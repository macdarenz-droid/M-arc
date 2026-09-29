# Paid Escobar: payments plan (PAY-1)

Owner decision, 2026-09-29:
- M/ARC stays free on Google Play.
- Escobar, the online AI coach, becomes a paid subscription, because every answer costs the owner's AI key.
- Everything else stays free, including the offline coach tips (`src/brain/coach`).
- Package: `com.mrcdrnzz.dailytracker` (`capacitor.config.json`).

This is a plan only. It contains no app or Worker code. The decision is recorded as D-PAY1 in `docs/COACHING-DECISIONS.md`.

Repo base: `main` at f313b96.

---

## 1. What exists today (read from the code)

### 1.1 How the app reaches Escobar
- **The call.** `src/escobar/transport.ts:78-109` (`httpTransport`) POSTs `<worker>/v2/turn` with two headers, `content-type` and `x-escobar-device`, and reads the answer as server-sent events.
- **The health check.** `checkHealth` (`transport.ts:113-128`) treats the coach as online only when `/health` answers `protocol: 2` and `key: true`.
- **The device id.** `ensureDeviceId()` (`src/escobar/session.ts:73-85`) makes 12 random bytes into `dev_<24 hex>` and saves it in `state.escobar.deviceId` (`src/core/models.ts:444-445`).
- **The Worker address.** It is built into the app (`src/escobar/state.ts:10,93`). A Settings edit can override it through `escobar.proxyUrl` (`models.ts:442-443`).
- **The on/off switch.** The coach is off until the user turns on "Online coach" (`models.ts:440-441`, `src/escobar/ui/SettingsSection.tsx:33`).

### 1.2 The Worker
The Worker is `escobar-worker/`, the Cloudflare Worker `marc-coach` (`wrangler.toml:3`).
- **Routing.** `src/index.ts:8-18` sends `/errors*` to the error handler and everything else to `handle()` (`src/handler.ts:91-199`).
- **CORS.** `handler.ts:15,26-37` allows the Capacitor origins and the PWA origin `https://mrcdrnzz.netlify.app` (`wrangler.toml:36`). The allowed headers are only `content-type, x-escobar-device` (`handler.ts:31`).
- **Model and cost.** The default model is `claude-opus-5` (`wrangler.toml:11`). The app's price table lists it at $5 per million input tokens, $25 per million output tokens and $0.50 per million cache reads (`src/escobar/state.ts:57`).

### 1.3 Authentication: there is none
- **The only check.** `handler.ts:102-103` checks that `x-escobar-device` matches `/^dev_[a-f0-9]{24}$/` (`handler.ts:13`). Any client can make one up. There is no secret, signature or account.
- **The only limits.** Per-device and per-IP burst limits (`handler.ts:118-126`; `wrangler.toml:38-48`, 30 and 60 a minute), and daily quotas in the `QUOTA_DO` Durable Object: one instance per UTC day (`quota.ts:32`). Default quotas are:
  - per device: 80 turns, 400 steps and 400k output tokens;
  - for the whole Worker: 20k steps and 3M output tokens (`quota.ts:11`).
- **Quota failure lets the call through.** When the quota check itself fails, the call goes ahead (`quota.ts:47`).
- **What this means.** Anyone who reads this public repo can spend the owner's key today, up to the global cap (3M output tokens a day, about $75 of output at $25 per million), by rotating device ids and IPs. Paid Escobar has to close this hole, not just add a paywall on top of it.

### 1.4 What is sent
Listed in `docs/PRIVACY-POLICY.md:21-34`:
- the message, the conversation and photos;
- a summary built on the phone;
- workout history the coach asks for;
- the random device id, app version, unit and tone;
- health and body data only when their own switches are on.

The Worker keeps no conversation. It counts usage per device id and per IP for the day, and its logs hold only the model, token counts and timing (`handler.ts:180`).

### 1.5 The error-report path
- `POST /errors` (`index.ts:11`, `src/errorsHandler.ts:44-85`), described in `docs/ERROR-REPORTS.md`.
- It is off by default, sends a 13-item allowlist and a random install id (separate from the device id), stores reports in D1 for 90 days, and is rate-limited at 30 an hour.
- Payments leave it alone. It shares only the Worker and its daily cron (`wrangler.toml:85-86`).

### 1.6 How the app is built
- **Capacitor.** Capacitor 8.5.0 (`package.json:26-38`). `scripts/prepare-android.sh` regenerates the Android project on every build:
  - runs `npx cap add android` and sets minSdk 26 (lines 7-16);
  - copies the hand-written Java plugins from `native/` (line 21);
  - patches the manifest (line 23).
- **Plugins.** They are registered in `native/MainActivity.java:10-12`. No step adds a Gradle dependency today.
- **The "M/ARC gate" workflow.** `.github/workflows/build-apk.yml` runs the Worker checks, `npm run check`, `test:tz` and the gate on every branch.
- **The release workflow.** `.github/workflows/release-apk.yml` is started by hand. It builds a **signed APK** (`./gradlew assembleRelease`), checks the plugins and dex classes, and signs with the permanent key. **It builds no AAB**, and Google Play needs one (see 2.6).
- **The Worker deploy.** `.github/workflows/deploy-worker.yml` deploys the Worker when a change to `escobar-worker/**` merges to `main`. The owner merges those PRs.
- **The web version.** A PWA runs on Netlify and calls the same Worker. Play Billing does not exist there.

### 1.7 The privacy policy draft
- `docs/PRIVACY-POLICY.md` says the app has "no accounts, no ads and no analytics" (line 7).
- It lists what Escobar sends (lines 21-34), including the counters kept for 3 days.
- It lists nothing about purchases.

---

## 2. Google facts this plan relies on

Checked on 2026-09-29. Quotes marked ✔ were re-read on the page by the planner. The others come from the research pass, which read the pages through a summariser, so their wording may be slightly off. Builders re-check the linked page before relying on exact wording.

### 2.1 Billing Library version
- ✔ https://developer.android.com/google/play/billing/deprecation-faq: "By Aug 31, 2026, all new apps and updates to existing apps must use Billing Library version 8 or later." An extension can be requested until Nov 1, 2026.
- **So:** use Play Billing Library 9.x. v9 needs minSdk 23; this repo sets 26 (`prepare-android.sh:13`).

### 2.2 Acknowledge and verify
- ✔ https://developer.android.com/google/play/billing/integrate, on acknowledging: "must be done within three days so that the purchase isn't automatically refunded and entitlement revoked".
- ✔ Same page, on verifying: "we strongly recommend passing the token to your secure backend server where you can then verify the purchase and protect against fraud."
- Restoring a purchase uses `queryPurchasesAsync()`.

### 2.3 Subscriptions
Source: https://developer.android.com/google/play/billing/subscriptions
- **Grace period:** users "should retain access".
- **Account hold:** "Users should not have access to entitlements during this period."
- **Free trials:** "Google Play verifies that the user has a valid payment method before starting the free trial."
- **Managing a subscription:** the deep link is `https://play.google.com/store/account/subscriptions?sku=<id>&package=<pkg>`.

### 2.4 Checking a purchase on the server
- **Reading a purchase.** https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.subscriptionsv2/get: `GET https://androidpublisher.googleapis.com/androidpublisher/v3/applications/{packageName}/purchases/subscriptionsv2/tokens/{token}`, scope `https://www.googleapis.com/auth/androidpublisher`.
- **What a purchase contains** (https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.subscriptionsv2):
  - `subscriptionState`: PENDING, ACTIVE, PAUSED, IN_GRACE_PERIOD, ON_HOLD, CANCELED or EXPIRED;
  - `acknowledgementState`, `linkedPurchaseToken` and `testPurchase`;
  - per line item: `expiryTime`, `offerDetails` (`offerTags`, `basePlanId`, `offerId`) and ✔ `offerPhase`: "Current offer phase details (can indicate free trial, introductory pricing, proration period, or base pricing)".
- **Acknowledging on the server.** https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.subscriptions/acknowledge: `POST …/purchases/subscriptions/{subscriptionId}/tokens/{token}:acknowledge`.
- **Service account access.** https://developers.google.com/android-publisher/getting_started: invite the service account in Play Console under Users and permissions, with "View financial data, orders, and cancellation survey responses" and "Manage orders and subscriptions".
- **Quota.** https://developers.google.com/android-publisher/quotas: "3000 queries per minute for each bucket".
- **Refunds.** https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.voidedpurchases/list lists voided purchases (refunded, cancelled or charged back). `startTime` "cannot be older than 30 days".

### 2.5 Real-time notifications and security
- **Real-Time Developer Notifications (RTDN)** (https://developer.android.com/google/play/billing/getting-ready): recommended, not required. https://developer.android.com/google/play/billing/rtdn-reference: "These notifications tell you only that the purchase state changed". The server must still call the API.
- **`obfuscatedAccountId`** (https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.Builder): optional, at most 64 characters. It must not contain personal data in plain text.
- **Security guidance** (https://developer.android.com/google/play/billing/security): verify on the server, use the purchase token as the key, not `orderId`.

### 2.6 Policy, fees and publishing
- **Billing policy** (https://support.google.com/googleplay/android-developer/answer/10281818): "Google Play's billing system is required for developers offering in-app purchases of digital goods and services distributed on Google Play."
- **Subscriptions policy** (https://support.google.com/googleplay/android-developer/answer/9900533): the app must be "clearly and explicitly disclosing your offer terms, the cost of your subscription, the frequency of your billing cycle, the automatic renewal terms", describe the trial, and give "an easy-to-use, online method to cancel the subscription".
- **Data safety** (https://support.google.com/googleplay/android-developer/answer/10787469):
  - ✔ payment services: "you don't need to declare collection of the data that the payment service collects … if … Your app never accesses this information; and The payment service collects this information directly from the user".
  - ✔ "Purchase history: Information about purchases or transactions a user has made."
- **Service fee** (✔ https://support.google.com/googleplay/android-developer/answer/112622): 15% on auto-renewing subscriptions. From June 30, 2026 in the EEA, UK and US it is "10% + 5% billing fee".
- **App Bundles** (https://developer.android.com/guide/app-bundle): "From August 2021, new apps are required to publish with the Android App Bundle on Google Play."
- **App signing** (https://support.google.com/googleplay/android-developer/answer/9842756): Play App Signing with an upload key. An existing key can be given to Google with the PEPK tool.
- **New personal accounts** (https://support.google.com/googleplay/android-developer/answer/14151465): they must run "a closed test with a minimum of 12 testers who have been opted in continuously for" 14 days before getting production access.
- **Testing billing** (https://developer.android.com/google/play/billing/test): license testers get test cards. In test, a monthly subscription renews every 5 minutes, a trial lasts 3 minutes, and an unacknowledged purchase is refunded after 3 minutes.

---

## 3. Designs and scores

Three designers worked independently. Two judges then scored the designs on their own, with weights: security 30, privacy 20, Play policy 20, build size and risk 15, owner effort 15.

| Design | Billing route | Entitlement | Judge 1 | Judge 2 | Mean |
|---|---|---|---|---|---|
| **A** | Our own Capacitor plugin in `native/` wrapping Billing 9.x | Worker verifies with `subscriptionsv2`, then issues a signed pass that lasts 12 h at most | **7.9** | **7.25** | **7.58** |
| B | Community plugin `capacitor-plugin-cdv-purchase` 13.18.0 (Billing 9.0.0) | Purchase token sent on every call; a Durable Object cache kept current by RTDN | 7.1 | 7.08 | 7.09 |
| C | RevenueCat `@revenuecat/purchases-capacitor` 13.6.1 | Worker asks the RevenueCat REST API, with a short cache | 6.6 | 6.70 | 6.65 |

Scores per criterion (judge 1 / judge 2):

| | Security | Privacy | Policy | Build/risk | Owner effort |
|---|---|---|---|---|---|
| A | 8 / 7 | 9 / 8 | 8 / 8 | 7 / 6 | 7 / 7 |
| B | 8.5 / 8 | 7 / 7.5 | 8 / 8 | 5.5 / 5.5 | 5 / 5 |
| C | 7 / 7 | 5 / 5 | 7.5 / 7.5 | 6.5 / 8 | 6.5 / 6 |

Both judges picked **A**, with parts of B and C added. What they found:
- **A: wrong storage.** A put its per-subscription counters on the KV path, but KV is not bound in the live Worker (`wrangler.toml:70-73`), and the live store is one Durable Object per day. The counters need their own store.
- **A and C: counters can fail open.** Their per-subscription caps sat behind a quota check that lets calls through when it fails (`quota.ts:47`). B alone kept paid counters in a store that blocks when it fails.
- **C: one wrong reason.** C said RevenueCat webhooks need a paid plan. RevenueCat's single plan includes them.
- **Holes all three shared:**
  - device caps do nothing, because the client picks its own device id;
  - trials got the full paid allowance;
  - a few heavy subscribers could use up the global cap and lock out every payer;
  - cost can exceed the price on the current model;
  - there is no hard spending limit on the AI key.

The chosen design below fixes each of these.

---

## 4. Chosen design: A, with parts of B and C

**Why A:** it gives nearly all of B's security with no third party, no Pub/Sub and no new npm package. It sends the least new data, and it follows the pattern this repo already uses for native plugins.

### 4.1 Overview
1. **The plugin.** Our own Java plugin `native/PlayBillingPlugin.java` wraps Play Billing Library **9.1.0**. It is copied and registered like `HealthConnectNativePlugin`.
2. **Buying or restoring.** The app buys or restores the subscription through Google Play, then sends the **purchase token** once to a new Worker endpoint, `POST /v2/entitle`.
3. **Checking with Google.** The Worker calls `subscriptionsv2.get` with a service-account token it signs itself using WebCrypto, so the Worker gets no new npm package. It acknowledges the purchase on the server, then returns a **pass**:
   - the pass is `HMAC-SHA256` over `{v, kid, s, d, st, iat, exp}`;
   - `s` is the first 16 bytes of `sha256(purchaseToken)`, `d` is the device id, and `st` is `paid` or `trial`;
   - the pass expires at the earlier of now + 12 h and the Play expiry time.
4. **Every turn.** `/v2/turn` needs `x-escobar-pass`. The Worker checks:
   - the HMAC, in constant time, with `crypto.subtle.verify`;
   - that `kid` is a known key, `exp` is still ahead, and `d` equals `x-escobar-device`.
   Then it asks the **subscription's own Durable Object** (`EntitleDO`, one per `s`) to check and charge its budget. If the DO fails, the turn gets **503: the turn is blocked, never let through**.
5. **Refunds.** A daily job on the existing cron (`wrangler.toml:85-86`) calls `voidedpurchases.list` for the last 3 days and marks those subscriptions voided in their `EntitleDO`. A voided subscription is refused at the **next turn**, even while its pass is still valid.
6. **Budgets in dollars, not tokens.** Each paid step is priced by the Worker from the usage the API reports, using a price table that matches `src/escobar/state.ts:56-72`; a Worker test checks the two agree. The budgets:
   - per subscription per day: `SUB_USD_DAY`;
   - per subscription per 30-day period: `SUB_USD_MONTH`;
   - a smaller budget while in the trial: `TRIAL_USD`;
   - a paid pool for the whole Worker per day, `PAID_USD_DAY`, which replaces the unpaid global cap once the paywall is on.
   Section 7 gives the values.
7. **Rollout switch.** A Worker variable `PAYWALL` takes `off`, `log` or `on`:
   - `off`: today's behaviour;
   - `log`: checks passes and counts the calls it would have refused, but never blocks;
   - `on`: blocks.
   The owner moves from `log` to `on` once the paid app is live.
8. **Web and other stores.** The PWA and phones without Google Play show "Escobar is part of M/ARC on Google Play". Everything else in the app stays free.

### 4.2 Choices, with reasons

**Identity.** No accounts. The Google Play purchase is the identity:
- the purchase token stands for one Google account's subscription;
- the Worker keeps only the hash `s`;
- `obfuscatedAccountId` is **not set**: there is no account to link it to, and restore works without it (design B's reasoning);
- device ids are **not** a control, because the client picks them. The pass is bound to one only so a copied pass also needs a copied header.

**What the pass is for.**
- It keeps the raw token off every turn: the token is sent about twice a day, not with every message.
- Checking a pass needs no storage.
- An HMAC fits because only the Worker issues and checks passes. `kid` allows the key to be rotated.

**The pass is kept in memory only.** It is re-fetched at launch through restore. There is **no change to `models.ts`**, the saved data shape, and the Worker's 10-minute cache of Google's answer keeps a cold start cheap.

**What counts as paid.**

| Google state | Escobar |
|---|---|
| `ACTIVE` | Yes |
| `IN_GRACE_PERIOD` | Yes (Google's rule), plus a banner: "Payment problem: fix it in Google Play" |
| `CANCELED` with `expiryTime` still ahead | Yes, until the paid period ends |
| `PENDING`, `PAUSED`, `ON_HOLD`, `EXPIRED` | No: 402 with a "Fix payment" or "Subscribe" link |
| Voided (refund or chargeback) | No |
| Replaced by a newer token (`linkedPurchaseToken`) | No |
| `testPurchase` | Only when the variable `ALLOW_TEST=1` |
| Wrong package or product | No |

**Trial.**
- Offer a 7-day free trial on the base plan. Play checks the payment method and handles eligibility.
- The Worker recognises the trial from `lineItems[].offerPhase`. As a backup, the owner tags the trial offer `trial`, and the Worker reads `offerDetails.offerTags`.
- During the trial the subscription gets `TRIAL_USD` in total, not the full paid budget. Trials cannot be farmed for free coaching.

**Restore.**
- It runs automatically at launch and on resume, at most once every 6 h, and from a "Restore purchase" button.
- `queryPurchasesAsync(SUBS)` finds the subscription on a new phone or after a reinstall, as long as the same Google account is used.

**Refunds and cancellations.**
- A cancelled subscription keeps working until its end date.
- A refund, revocation or chargeback is caught at the latest by the next daily voided-purchases job, or by the next Google check (every 12 h at most).
- RTDN is a later upgrade (card PAY-W2, not in this release). It would need Pub/Sub, and the budgets already limit the cost of the delay.

**Offline.**
- Escobar needs the network anyway. Offline, nothing changes: the offline coach and the rest of the app keep working and stay free.
- If Google or the Worker cannot be reached during a refresh, the app keeps using a pass that has not expired yet.
- If Google fails during `/v2/entitle`, the Worker returns 503 and never 402. A subscriber the Worker has cached as paid within the last 24 h is still served (stale-if-error).

**Old app versions.** Once `PAYWALL=on`, a turn without a pass gets a refusal whose text says "Update M/ARC to keep using Escobar". It uses an error code that today's app already shows as text (acceptance W1-A9).

### 4.3 Attacks and what stops them

| Attack | Result |
|---|---|
| Edit the app or remove the paywall | Nothing changes: the Worker enforces the pass. Pointing `proxyUrl` at another server spends that server's own key. |
| Made-up device id, rotating IPs (today's hole) | 402 before any quota check or model call |
| Forge a pass | Needs `ENTITLE_KEY_n`, a 256-bit Worker secret |
| Replay an old pass | It expires within 12 h, is bound to one device id, and is charged to that subscription's own budget |
| Share a pass or token with friends | Every copy draws on the same per-subscription dollar budget: the payer's own allowance |
| Fake token, or a token from another app | Google rejects it, or the package or product check fails: 402. Failed lookups are cached for 60 s, and cache misses are limited per IP, so fake tokens cannot use up the 3000/min Google quota |
| Refund, then keep using Escobar | Voided at the next daily job and refused at the next turn |
| Test purchase | Refused unless `ALLOW_TEST=1` |
| Paid-counter store fails | 503, blocked |
| A few heavy subscribers | They hit their own budgets first. `PAID_USD_DAY` alerts at 80% and is sized to the number of subscribers (section 7). The Anthropic spend limit is the last stop (owner step O9) |

---

## 5. Build cards

Shared fields for all cards (C\*, V\*, R\*):
- **connectivity (C\*):**
  - new traffic from the app goes only to the owner's Worker and to Google Play (through the Billing Library);
  - the Worker calls only `oauth2.googleapis.com` and `androidpublisher.googleapis.com`;
  - no third-party service.
- **verification (V\*):**
  - while building: focused tests;
  - before review: `npm run check`, `npm run test:tz` and the gate (app cards), or `npm --prefix escobar-worker run check` (Worker card);
  - every new test is shown failing on the base commit;
  - the mutations used to prove each test catches its bug are listed in the PR.
- **reserved_paths (R\*):**
  - watch agent files: `native/wear/**`, `src/native/wearEngine.ts`, `src/slices/settings/WatchLab.tsx`, the Watch-lab row in `Settings.tsx`, and the watch agent's CI lines;
  - everything about signing, `EXPECTED_SHA256` and keystores;
  - `package.json` and `package-lock.json`;
  - `src/core/models.ts`, `src/core/store.ts` and migrations;
  - another task's blocks in `scripts/screenshot-gate.mjs` and `tests/theme.test.ts`;
  - every path in another open card's write_scope.
- **Check-in:** PAY-W1 and PAY-A1 are hard cards. Each builder posts a `CHECK-IN PAY-xx` design note on its PR before bulk building. The supervisor answers `go` or `re-guide`.

Merge order: **W1** (owner merges, with `PAYWALL=off`) → **A1** → **A2** → **R1** → **D1** → **D2**. The owner then does the Play setup (section 6), sets `PAYWALL=log`, runs the closed test, and sets `PAYWALL=on` once the paid build is live in production.

### PAY-W1: Worker entitlement (separate PR; the owner merges it because merging deploys it)
- **outcome:** `/v2/turn` serves only callers with a valid, paid pass once `PAYWALL=on`. Paid spending is limited per subscription and fails closed. Refunds are cut off within a day.
- **base:** `main`. **depends_on:** none. The owner's Google Cloud setup (O4) is needed only for the live check, not to build.
- **read_first:**
  - this doc §2.4, §4;
  - `escobar-worker/src/handler.ts:26-37,91-199`;
  - `quota.ts`, `quotaDO.ts`, `index.ts`, `wrangler.toml`;
  - `src/escobar/state.ts:56-72`.
- **write_scope:**
  - new: `escobar-worker/src/{entitle.ts, pass.ts, googlePlay.ts, entitleDO.ts, voided.ts, prices.ts}`;
  - `escobar-worker/src/{handler.ts, index.ts, anthropic.ts (Env only)}`;
  - `escobar-worker/wrangler.toml`: vars, the `ENTITLE` DO binding, migration `v3`, and comments naming the secrets;
  - `escobar-worker/test/**` and `escobar-worker/README.md`;
  - `.github/workflows/deploy-worker.yml`: add-only lines in the `/health` check, with the supervisor's OK.
- **reserved_paths:** R\*; everything outside `escobar-worker/**`; `errors*.ts`.
- **design:**
  - **Secrets** (set with `wrangler secret put`, never in the repo): `PLAY_SA_EMAIL`, `PLAY_SA_KEY` (PKCS8 PEM), `ENTITLE_KEY_1`.
  - **Vars:** `PAYWALL`, `PLAY_PACKAGE`, `PLAY_SUB_ID`, `ENTITLE_KID`, `ALLOW_TEST`, `SUB_USD_DAY`, `SUB_USD_MONTH`, `TRIAL_USD` and `PAID_USD_DAY`.
  - **`/health`** adds `paywall: 'off'|'log'|'on'` and `billing: boolean` (secrets present).
  - **CORS** allows `x-escobar-pass`.
  - **Order in `/v2/turn`:** device check → burst limits → pass check → `EntitleDO` check-and-charge → existing quota → model. A step is charged in `EntitleDO` by its actual price after it runs, using the same billed rule as `handler.ts:183-190`.
  - **`POST /v2/entitle`** takes `{purchaseToken, productId}` (token at most 512 characters). It allows 10 calls an hour per `s` and 20 cache misses an hour per IP bucket, and caches Google's answer in the DO for 10 minutes and a failed lookup for 60 s.
  - **`EntitleDO` stores** `{state, expiryMs, trial, voided, supersededBy, test, checkedMs, day, usdDay, periodStart, usdPeriod, usdTrial}`. It stores no raw token, no order id and no Google account id. An alarm deletes a row 40 days after its last use or after it expires.
  - **Logs:** only a 4-hex prefix of `s`.
- **acceptance:** tests use a fake Google API and a fake DO.
  - W1-A1: `PAYWALL=on` with no pass, a malformed pass, a wrong HMAC, an unknown `kid`, an expired `exp`, or `d` ≠ device → 402, and the model client is never called.
  - W1-A2: the state table in §4.2, one test per row. `CANCELED` is paid only before `expiryTime`.
  - W1-A3: Google 5xx or timeout on entitle → 503, never 402. A subscriber cached as paid in the last 24 h is still served.
  - W1-A4: `acknowledgementState` PENDING triggers `:acknowledge`. If that fails, the pass is still issued and the next entitle call retries.
  - W1-A5: when the day, period or trial budget is used up → 402 or 429 with a clear message. If `EntitleDO` throws → 503 and the model is never called (fails closed).
  - W1-A6: the voided job marks `voided` and the next turn → 402. A superseded token → 402.
  - W1-A7: `PAYWALL=log` never blocks, and logs how many calls it would have refused. `PAYWALL=off` behaves byte for byte like today on the existing `handler.test.ts` suite.
  - W1-A8: the service-account JWT is RS256 with the right `aud`, `scope` and `exp`, checked against a test key pair. The OAuth token is cached until 5 minutes before it expires.
  - W1-A9: an app built from `main` before A2 shows the 402 message as text (check the code path in `EscobarSheet.tsx:51-55` and `transport.ts:91-99`, and pick the error code to match).
  - W1-A10: no raw token or pass appears in any `console.*` call (a test spies on console).
  - W1-A11: `prices.ts` equals `PRICES` in `src/escobar/state.ts` for every id in `MODE_MODELS` (the test reads the file).
  - W1-F1: the full existing Worker test suite stays green.
- **risk:**
  - JWT signing in Workers: test it with a real key pair.
  - The DO adds a hop to every turn. Budget: +30 ms at p50, measured in the check-in.
  - A wrong state table locks out payers. Mitigations: the `log` stage, and a test per row.
- **return:** PR link, head, evidence per criterion, mutations, and the exact owner commands for the secrets.

### PAY-W2 (later, not in this release): real-time notifications
Google's real-time notifications (RTDN) sent through a Pub/Sub push to `/play/rtdn`, with OIDC checking. This would cut the delay before a refund stops Escobar from up to a day to minutes. Start it only if the voided-purchases job proves too slow.

### PAY-A1: Billing plugin
- **outcome:** the app can read the subscription product, buy it, restore it and open the "manage subscription" page on Android. It does nothing on the web.
- **base:** `main`. **depends_on:** none.
- **read_first:**
  - §2.1-2.3;
  - `native/MainActivity.java`, `native/NativeUiPlugin.java` (the pattern);
  - `scripts/prepare-android.sh`;
  - https://developer.android.com/google/play/billing/integrate.
- **write_scope:**
  - new: `native/PlayBillingPlugin.java`, `src/native/billing.ts`, `tests/native/billing.test.ts`;
  - `native/MainActivity.java`: one `registerPlugin` line;
  - `scripts/prepare-android.sh`: with the supervisor's OK, add only (1) the copy of the new Java file, (2) an insert of `implementation 'com.android.billingclient:billing:9.1.0'` into `android/app/build.gradle`, and (3) a `grep` check that the insert happened.
- **reserved_paths:** R\*; `src/escobar/**` (belongs to A2).
- **design:**
  - Plugin methods: `getProduct`, `buy`, `restore`, `manage`. `getProduct` returns the formatted price, billing period, trial length and offer token from `queryProductDetailsAsync`; the other three are `launchBillingFlow`, `queryPurchasesAsync(SUBS)` and the Play deep link.
  - `buy` returns `{purchaseToken, productId, state}`. `PENDING` is reported as pending, never as paid.
  - The plugin does **not** acknowledge purchases: the Worker does.
  - `billing.ts` returns `unsupported` when `!Capacitor.isNativePlatform()` or when the plugin is missing. That covers Huawei phones with no Google Play, which get the "not available" reply from the plugin.
- **acceptance:**
  - A1-A1: `billing.ts` unit tests with a fake bridge cover each method, pending, cancelled by the user, not connected (one retry), and unsupported on the web.
  - A1-A2: `prepare-android.sh` stops with an error if the Gradle insert is missing (proved by breaking it once).
  - A1-A3: a recorded device check on a license-tester phone: product shown with its local price, buy, restore after reinstall, manage link opens Play.
  - A1-F1: the watch and Health Connect plugins are still registered, and the gate stays green.
- **risk:**
  - The Billing Library can only be tested on a real phone: record the device check.
  - Hand-written BillingClient code: after two failed tries, switch to `capacitor-plugin-cdv-purchase` 13.18.0 (Billing 9.0.0, MIT, checked by design B and judge 2). Keep the same `billing.ts` API, and get the supervisor's OK for the dependency.
- **return:** as W1, plus the APK size change (measured).

### PAY-A2: Paywall, pass and turn header
- **outcome:** users see a paywall that meets Google's policy, can subscribe, restore and manage. Every turn carries the pass, and a 402 opens the paywall. The PWA explains that Escobar is on Google Play.
- **base:** `main` after A1 merges. **depends_on:** A1; W1's contract (§4.1). Build against a fake Worker. Merge only after W1 is deployed with `PAYWALL=off`.
- **write_scope:**
  - new: `src/escobar/entitlement.ts` (in-memory pass, refresh 2 h before expiry, on resume, and after one 402), `src/escobar/ui/Paywall.tsx`;
  - `src/escobar/transport.ts`: the header and the 402 mapping;
  - `src/escobar/ui/SettingsSection.tsx`: turning the switch on with no pass opens the paywall;
  - `src/escobar/session.ts`: wiring only;
  - `tests/escobar/**`;
  - a `PAY-A2` block in `scripts/screenshot-gate.mjs` and `src/ui/styles.css` (only rules for the paywall).
- **reserved_paths:** R\*; `src/brain/coach/**` (the offline coach is not touched); `native/**`.
- **acceptance:**
  - A2-A1: the paywall shows the price and period from Play, the auto-renew terms, the trial length and "charged after the trial unless you cancel", a Cancel link to Play, Restore, and a line saying the offline coach stays free. A test checks every string, and the gate captures a screenshot in each of the 5 themes.
  - A2-A2: the transport sends `x-escobar-pass`. On 402 it refreshes once, then shows the paywall. On 503 it shows "can't check your subscription, try again" and keeps an unexpired pass.
  - A2-A3: the PWA, with no native billing, never shows a Subscribe button and never sends a turn. The Escobar row reads "Escobar is part of M/ARC on Google Play".
  - A2-A4: states have their own text: grace period shows "Payment problem" with a link to fix it in Play; account hold shows a "Fix payment" link; a cancelled subscription shows "Active until <date>".
  - A2-A5: the pass is never written to storage. A test spies on `update` and `localStorage`.
  - A2-F1: offline coach tips work with Escobar locked (test). Existing Escobar tests stay green.
- **risk:** the paywall text must meet the subscriptions policy. It is reviewed against §2.6 and in the closed test.

### PAY-R1: Release build for Play (supervisor)
- **outcome:** CI produces an AAB and proves that billing is inside it.
- **depends_on:** A1.
- **write_scope:** `.github/workflows/release-apk.yml` and `build-apk.yml`, add-only steps:
  - `./gradlew bundleRelease`, producing an **unsigned** AAB artifact;
  - checks that the resolved `com.android.billingclient:billing` is ≥ 8;
  - checks that the merged manifest has `com.android.vending.BILLING`;
  - checks that the dex has `PlayBillingPlugin`.
- **reserved_paths:** every signing step, `EXPECTED_SHA256` and keystore handling.
- **Signing the AAB belongs to the owner.** The owner chooses the Play App Signing path (O2). Nobody adds an AAB signing step until the owner says how.
- **acceptance:**
  - R1-A1: each check fails on a build without the plugin (shown once).
  - R1-A2: the APK signing and fingerprint steps are byte for byte unchanged (diff shown).

### PAY-D1: Privacy policy update
- **depends_on:** W1 (final field list and retention times).
- **write_scope:** `docs/PRIVACY-POLICY.md`.
- **Content:**
  - a new "Escobar subscription" section: Google Play handles the payment; the app sends the purchase token to the coach server to check it; the server keeps a scrambled code of it, the subscription state and its spending counters for up to 40 days after last use; no card details, name or email;
  - line 7 is updated ("no accounts" stays true);
  - a note that the offline coach is free.
- **acceptance:**
  - D1-A1: every data item in §8 appears, with its retention time.
  - D1-A2: the owner approves it.

### PAY-D2: Play Data safety answers and listing text
- **depends_on:** D1.
- **write_scope:** this doc, section 9 (final answers).
- **acceptance:**
  - D2-A1: each answer is traced to the code.
  - D2-A2: the listing says "Free app. The Escobar online coach is an optional subscription."

---

## 6. Owner steps (only the owner can do these)

- **O1. Payments profile.** Play Console → Settings → Payments profile: legal name and address (no PO box) and a statement name. The country cannot be changed later.
- **O2. App signing and AAB.** Decide on Play App Signing: either upload the current key through PEPK, or let Google generate the app signing key and keep the current key as the upload key. This touches the signing key, so it is yours alone. It blocks the first upload.
- **O3. Subscription product.** Monetize → Subscriptions → create `escobar` with:
  - base plan `monthly` at the price in section 7;
  - optional base plan `yearly`;
  - an offer `trial7`: 7-day free trial, tagged `trial`, new customers only;
  - grace period on (7 days), account hold on, pause off;
  - Family Library sharing off.
- **O4. Google Cloud.**
  1. Create a project and enable the Google Play Android Developer API.
  2. Create a service account and a JSON key.
  3. In Play Console → Users and permissions, invite the service account email with "View financial data, orders, and cancellation survey responses" and "Manage orders and subscriptions".
  4. Run `npx wrangler secret put PLAY_SA_EMAIL`, `PLAY_SA_KEY` and `ENTITLE_KEY_1`. For the last one, use 32 random bytes in base64, for example from `openssl rand -base64 32`.
  5. Never paste any of these into the repo or a chat.
- **O5. Testers.** Add license testers (Settings → License testing). Upload the first AAB to the internal track.
- **O6. Closed test.** Run it with 12 testers for 14 days: the rule for new personal accounts.
- **O7. Approvals** (section 10).
- **O8. Merge and switch.** Merge PAY-W1, then set `PAYWALL=log`. Once the paid build is live in production, set `PAYWALL=on`.
- **O9. Spending limit.** Set a monthly spend limit on the Anthropic key in the Claude Console, as the last line of defence. We have not checked which limit options your account has.

---

## 7. Price and trial

### 7.1 What comparable apps charge
- ✔ **Fitbod** (AI workout planner), https://fitbod.me/faqs/: "Fitbod offers monthly $15.99 and annual membership $95.99 options, when purchased on our website", with a 7-day free trial.
- ✔ **JuggernautAI** (AI strength coach), https://www.juggernautai.app/: $34.99 a month or $349.99 a year, with a 2-week free trial.

M/ARC is different: the whole tracker is free, and only the AI chat coach is paid. So the price should sit **below** Fitbod.

### 7.2 What an answer costs
This is an estimate: the real per-turn cost is not known yet.
- **Assumption.** A turn takes about 2 steps. Each step uses about 2k new input tokens, 10k cached input tokens and 500 output tokens (thinking included).
- **On `claude-opus-5`** ($5 / $25 / $0.50 per million): about **$0.055 a turn**.
- **On `claude-sonnet-5`** ($2 / $10 / $0.20, `state.ts:60`): about **$0.022 a turn**.
- **Check it.** Settings already shows the cost for the day (`usage.costUsd`). `PAYWALL=log` adds the real cost per subscription to the Worker logs.

### 7.3 Recommendation
- **$9.99 a month** or **$69.99 a year**, with a **7-day free trial** (the same as Fitbod).
- After Google's 15% fee: $8.49 a month from monthly plans, $4.96 a month from yearly ones.
- **Starting budgets** (Worker variables, changed without code):
  - `SUB_USD_MONTH` = **$4**: under the worst net monthly income, so every subscriber pays for their own use;
  - `SUB_USD_DAY` = **$0.60**;
  - `TRIAL_USD` = **$0.75**;
  - `PAID_USD_DAY` = $1 × active subscribers, at least $10, with a log warning at 80%.
- **What $4 buys.** About 70 turns a month on Opus 5, or about 180 on Sonnet 5. If most subscribers hit the budget, the owner can move Escobar's chat mode to `claude-sonnet-5` (`MODEL_CHAT`, `wrangler.toml:15`). That is the owner's choice on quality against cost.
- **Local prices.** Play converts to local prices. The owner reviews the converted prices in O3.

---

## 8. What is new: data, dependencies, money

| Item | Where | Kept for | Today |
|---|---|---|---|
| Play purchase token | app → Worker, only on `/v2/entitle` (about twice a day) | not stored; only its hash | none |
| Pass: hash, device id, times | app → Worker on each turn | in memory only | none |
| Subscription hash, Google state, expiry, trial flag, voided flag, dollar counters | Worker `EntitleDO` | 40 days after last use or expiry | per-device counters for 3 days |
| Calls to Google (the Play Developer API) | Worker → Google | — | none |

- **Not used:** `obfuscatedAccountId`, order ids, Google account ids, email. Coach content is unchanged.
- **Dependencies:**
  - Gradle `com.android.billingclient:billing:9.1.0` (a new native dependency: the supervisor must OK it);
  - no npm package in the app or the Worker.
- **Money:**
  - Google's service fee on revenue;
  - Anthropic costs during trials (capped by `TRIAL_USD`);
  - no RevenueCat or other paid service;
  - Google Cloud: a project, a service account and the Play Developer API. We found no charge for this API in the pages we read, but have not verified that there is none.

---

## 9. Play Data safety answers (the payment part; finalised by PAY-D2)
- **Financial info → Purchase history:**
  - collected: yes (the purchase token and subscription state go to the owner's server);
  - shared: no;
  - processed ephemerally: no;
  - required: yes, for Escobar only;
  - purpose: app functionality and fraud prevention.
  - This is our reading of the page quoted in §2.6. The owner confirms it.
- **Payment info (card details):** not collected. Google Play collects it directly and the app never sees it (the exception quoted in §2.6).
- **Device or other IDs:** as today (the random device id, already declared for Escobar). No new id.
- Everything else is unchanged from the current draft.

---

## 10. Needs the owner's approval
1. **New data sent and stored:** section 8, the purchase token and the per-subscription record for up to 40 days. Also the Data safety answer "Purchase history".
2. **New dependency:** Play Billing Library 9.1.0 in Gradle.
3. **New provider setup:** a Google Cloud project and a service account that can read orders and subscriptions.
4. **Money:** the price ($9.99 a month / $69.99 a year / 7-day trial), the budgets in §7.3, and the trial cost to the key.
5. **The signing path for the AAB** (O2).
6. **Web users losing Escobar:** once `PAYWALL=on`, the PWA and phones without Google Play (for example Huawei) lose Escobar. Sideloaded APKs also lose it, unless Play recognises them; we have not verified whether it does.

---

## 11. Risks and mitigations

| Risk | Mitigation |
|---|---|
| The owner steps (AAB, signing, the 14-day closed test) hold up the launch | Start O1-O6 now, in parallel with the builds. `PAYWALL` stays `off` until everything is live. |
| Today's hole (made-up device ids) stays open until `on` | Run `log` as soon as W1 merges. Set a date for `on`. Until then the owner may lower the free global cap (`MAX_OUTPUT_TOTAL`). |
| Paying users are locked out by a bug | The `log` stage, a test per state, 503 (never 402) when Google fails, stale-if-error for 24 h, and a pass that has not expired yet. |
| Cost above revenue | Dollar budgets per subscription, per day, during the trial and for the paid pool; the Anthropic spend limit; switching the model is available. |
| Trial farming | `TRIAL_USD` caps what a trial can spend; Play checks the payment method. |
| A leaked service-account key | It lives only in Worker secrets, with Play permissions for orders only. Rotate it in Cloud Console. |
| Hand-written billing code fails on phones | A recorded device check on a real phone. Fallback plugin after two failed tries (A1). |
| Policy rejection of the paywall | The A2-A1 checklist follows the policy text; the closed test catches problems before production. |
| Google or Durable Object outage | Paid turns get 503 (blocked, not let through); the offline coach is unaffected. |
| The billing-library deadline | Billing 9.1.0 from day one, and a CI check for ≥ 8 (R1). |
