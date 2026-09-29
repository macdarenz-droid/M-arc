# Paid Escobar: payments plan (PAY-1)

**Owner decisions:**
- **2026-09-29, first:**
  - M/ARC stays free on Google Play.
  - Escobar, the online AI coach, becomes paid, because every answer costs the owner's AI key.
  - Everything else stays free, including the offline coach tips (`src/brain/coach`).
  - Package: `com.mrcdrnzz.dailytracker` (`capacitor.config.json`).
- **2026-09-29 11:05, refined:**
  - Escobar is unlocked by an **activation code** that is valid for 30 days and renewable.
  - People pay through a **payment link**, receive a code, and type it into the app.
  - The owner can **mint unlimited free codes** for himself, friends and promotions.

This is a plan only. It contains no app or Worker code. The decision is D-PAY1 in `docs/COACHING-DECISIONS.md`.

Repo base: `main` at f313b96.

**Plan in brief:**
- **Codes:** the Worker issues and checks the codes.
- **No selling inside the app:** the app sells nothing itself, which makes it "consumption-only" under Play's rules, so Play Billing is not needed.
- **No payment links in the app:** the app may say in plain text where codes are sold, but never links to the payment page, in any country.
- **Links outside the app:** the payment link lives on the website, in social posts and in emails.
- **Play subscription is optional (§5.5):** it is not required, and adding it would take away the plain-text mention of the website.

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


### 2.7 Codes, payment links and countries (research for the refined model, 2026-09-29)
Quotes marked ✔ were read on the page by the planner; the pages came back through a summariser, so recheck exact wording before quoting them to Google.

- **Payments policy** (✔ https://support.google.com/googleplay/android-developer/answer/9858738):
  - "Play-distributed apps requiring or accepting payment for access to in-app features or services … must use Google Play's billing system for those transactions unless Section 3, 8, or 9 applies."
  - "Apps may not lead users to a payment method other than Google Play's billing system", which covers "in-app promotions, webviews, buttons, links".
- **Consumption-only apps are allowed** (✔ https://support.google.com/googleplay/android-developer/answer/10281818):
  - "Google Play allows any app to be consumption-only, even if it is part of a paid service. For example, a user could log in when the app opens and access content paid for somewhere else."
  - "consumption-only means that any product(s) or service(s), whether digital or physical, cannot be purchased from within the app."
- **Talking about other ways to pay** (✔ same page, under "Can I communicate with my users about alternative ways to pay?"):
  - "Outside of your app, you are free to communicate with your users about alternative purchase options."
  - "Within an app, developers may not lead users to a payment method other than Google Play's billing system unless Section 3, 8, or 9 of Payments policy applies."
  - For apps with no in-app purchasing, the page allows lines such as "Go to our website to upgrade your subscription to Premium" as long as there is no direct link.
- **Gift cards** (✔ same page): "Google Play's billing system is not required for the sale of in-app gift cards".
- **Countries where Play Billing is unavailable** (✔ same page): "As long as Google Play's billing system isn't available in a particular country, the Payments policy's requirement to use Google Play's billing system does not apply in that country."
- **United States** (✔ https://support.google.com/googleplay/android-developer/answer/15582165, from Oct 29, 2025):
  - "Google will not prohibit a developer from … link to transactions"
  - "Google will not require the use of Google Play Billing".
  - Developers use this through the external content links program (https://support.google.com/googleplay/android-developer/answer/16470497) or the alternative billing program (answer/16497028). Enrolled developers must "report transactions and pay the relevant service fees" from October 1, 2026.
- **European Economic Area and United Kingdom** (✔ billing choice programme, https://support.google.com/googleplay/android-developer/answer/17161464):
  - you can "guide users to your website for purchases using external web links", after enrolling;
  - the programme page lists 10% for auto-renewing subscriptions (and the first $1M a year) and 20% for other purchases;
  - the listed markets are the UK, the EEA and the US.
- **Australia:**
  - Australia is on the user choice billing list (✔ https://support.google.com/googleplay/android-developer/answer/13821247). There, a second billing system can sit next to Play Billing, with a fee 4% lower.
  - Australia gets "Changes to service fees + Expanded Billing Choice Availability" on **September 30, 2026** (✔ https://support.google.com/googleplay/android-developer/answer/16954621).
  - None of the pages we read says Australia allows external links. **Not verified**, so this plan treats links as not allowed in Australia.
- **Philippines:**
  - Not named in any programme.
  - The fee page puts it under "Rest of World", with changes on **September 30, 2027** (answer/16954621).
  - No link-outs; Play Billing rules apply to anything sold in the app.
- **Play promo codes** (✔ https://support.google.com/googleplay/android-developer/answer/6321495):
  - codes for subscriptions "provide users with a free trial of between 3 and 90 days";
  - one-time codes: "10,000 promo codes per quarter per subscription product";
  - custom codes: a redemption limit "between a minimum of 2,000 and a maximum of 99,999".
  - These only work with a Play subscription. They cannot replace the owner's unlimited Worker codes.

---

## 3. Designs and scores

### 3.1 Round 1: Play subscription (before the refinement)
Three independent designs, scored by two independent judges on security (30), privacy (20), Play policy (20), build/risk (15) and owner effort (15):

| Design | Billing route | Entitlement | Judge 1 | Judge 2 | Mean |
|---|---|---|---|---|---|
| **A** | Own Capacitor plugin, Billing 9.x | Worker verifies the purchase with `subscriptionsv2`, then issues an HMAC pass for 12 h | 7.9 | 7.25 | **7.58** |
| B | `capacitor-plugin-cdv-purchase` 13.18.0 | Token checked on every call; state cache kept current by RTDN | 7.1 | 7.08 | 7.09 |
| C | RevenueCat | Worker asks RevenueCat's REST API | 6.6 | 6.70 | 6.65 |

The judges' fixes carry into every design below:
- spending counters kept per paid entitlement, which block the turn when they fail (not the daily quota, which lets calls through when it fails, `quota.ts:47`);
- a smaller trial budget;
- a spend limit on the Anthropic key;
- an off → log → on rollout;
- device-id caps are not treated as a security control, because the client picks its own id.

A is kept, trimmed, as the optional Play path in §5.5.

### 3.2 Round 2: the owner's code model
[Scores and the reviewer's findings are filled in §3.3 after the independent review.]

---

## 4. Chosen design: Worker activation codes, app is consumption-only

### 4.1 What's allowed where (M/ARC with no purchase inside the app)

| Where the user is | Say in the app, in plain text, "Get a code at <site>" (no link, no button) | Clickable link or button to the payment page | Sell inside the app without Play Billing | Type in a code bought elsewhere | Talk about it outside the app (web, social, email) |
|---|---|---|---|---|---|
| **Every country, including the Philippines** | Yes (consumption-only rule) | **No** | No | Yes | Yes |
| **United States** | Yes | Only after enrolling in the external content links programme, with fees and transaction reports from Oct 1, 2026 | Only through the alternative billing programme | Yes | Yes |
| **European Economic Area and United Kingdom** | Yes | Only after enrolling in the billing choice programme (10% on subscriptions) | Only through the billing choice programme | Yes | Yes |
| **Australia** | Yes | Not verified, so treated as **No** (Expanded Billing Choice starts Sep 30, 2026; recheck then) | Only through user choice billing, next to Play Billing | Yes | Yes |
| **Web version (PWA) and the owner's website** | Yes | Yes (Google Play rules do not cover the web) | Yes | Yes | Yes |

Two rules decide the design:
1. **The Android app shows the same thing everywhere:** "Have an activation code? Enter it", and one plain-text line, "Codes are sold at <site>". There is no link, no button, no price and no webview anywhere. That is allowed in every country, needs no enrolment and no country check.
2. **Adding a Play subscription later** (§5.5) would end consumption-only. From then on the app **may not mention the website at all**, except in countries where the owner enrols in a programme.

### 4.2 Overview
1. **Codes.** A code looks like `MARC-XXXX-XXXX-XXXX-XXXX`: 16 Crockford base32 characters, which leave out I, L, O and U, so it is easy to type.
   - The first 12 characters are 60 random bits.
   - The last 4 characters are a 20-bit tag, `HMAC-SHA256(CODE_KEY, body)`.
   - The Worker rejects typos and made-up codes before touching storage. Nobody can mint a code without `CODE_KEY`, a Worker secret.
2. **Stored codes.** The D1 database `marc-codes` keeps the hash of each code, never the code itself. Each code has:
   - `kind`: `paid` or `owner`;
   - `days`: 30 by default;
   - `redeem_by`: a code must be used within 365 days by default;
   - `budget`: `standard` or `owner`;
   - an optional `note` (owner codes only, at most 40 characters, with a warning not to put names in it);
   - `redeemed_at`, `bound` (hash of the device id) and `moves`;
   - `revoked`.
3. **Redeem.** `POST /v2/redeem {code}` with the existing `x-escobar-device` header:
   - It is a single atomic `UPDATE … WHERE hash=? AND revoked=0 AND (bound IS NULL OR moves<3)`.
   - The first redemption binds the code to this install and adds `days` to the install's access, counting from the later of now and its current end date, so a new code stacks.
   - Typing the same code on a new install (after a reinstall or on a new phone) **moves** it there, at most 3 times. The old install loses access.
   - A code already bound to another install that has used up its moves → "This code is already in use".
4. **Per-install record.** The Durable Object `EntitleDO`, keyed by `sha256(deviceId)`, holds the end date, the bound code hash and the dollar counters. `/v2/turn` asks it on every turn, **before** any quota check or model call. If `EntitleDO` fails, the turn gets 503: blocked, never let through.
5. **Status.** `GET /v2/status` (device header) returns `{active, until}`. The app shows "Escobar active until 12 Nov". Nothing new is saved on the phone.
6. **Owner admin** (only with `Authorization: Bearer <ADMIN_TOKEN>`, a Worker secret; constant-time compare; 5 wrong tries an hour per IP locks that IP for the hour):
   - `POST /admin/codes {count 1-100, days 1-400, redeemByDays, budget, note}` returns the codes. This is the only time the codes appear in plain text, and there is no limit on how many times it can be called.
   - `POST /admin/revoke {code}` revokes a code and ends the install's access at once.
   - `GET /admin/codes?status=` lists codes by id (the first 8 characters of the hash), kind, days, dates, note and status.
   - The owner runs a small script, `escobar-worker/scripts/codes.mjs mint 10 --days 30`, which reads the token from an environment variable and never writes it to disk or logs.
7. **Payment link** (PAY-W2, once the owner picks a provider):
   - The provider hosts the payment page, and after payment redirects to `https://<worker>/buy/done?s=<session id>`.
   - The Worker checks with the provider's API (`PAY_PROVIDER_SECRET`) that the session is paid, for the right product, and not refunded.
   - It then **derives** the code as `HMAC(CODE_KEY, "pay:" + sessionId)`: opening the page again shows the same code, and the Worker stores no code and no buyer data.
   - The page shows the code and "Open M/ARC → Settings → Escobar → Enter code".
   - If the provider sends signed refund events, a refund revokes the code. Otherwise the owner revokes by hand.
8. **Budgets in dollars.** Each step is priced by the Worker from the usage the API reports, with a price table that matches `src/escobar/state.ts:56-72` (tested). The budgets are Worker variables (§7):
   - per install, per 30 days: `USD_PERIOD`;
   - per install, per day: `USD_DAY`;
   - a larger budget for the owner's own codes: `USD_PERIOD_OWNER`;
   - a total for the Worker per day: `PAID_USD_DAY`, which replaces the unpaid global cap once `PAYWALL=on`.
9. **Rollout switch.** `PAYWALL=off|log|on`, as in round 1. Once it is `on`, a turn without an active install gets 402 with a text today's app already shows: "Escobar needs an activation code. Update M/ARC to enter one."
10. **Web and other phones.** The PWA, Huawei phones and sideloaded builds can all redeem codes, because nothing depends on Google Play. The PWA may show a real "Buy a code" link, because the web is outside Play. The Android build never does.

### 4.3 Choices, with reasons

**Identity: the existing random device id.**
- There are no accounts and no new saved field.
- The id works like a password for Escobar. It is 96 random bits, is never logged, and is already sent today.
- If the phone is lost or reset, typing the code again moves it to the new install.

**Why there is no signed pass.**
- Every turn already reaches `EntitleDO` to charge the budget. That call gives the current access at once, so a revoke works immediately, and a pass would add nothing.

**Why D1 for codes and a Durable Object for spending.**
- Codes need a lookup across all installs and an owner list: D1 does that, and an `UPDATE` there happens once, atomically.
- Spending needs strict per-install counters on the path of every turn: a Durable Object does that.

**Why codes are 30-day and not auto-renewing.**
- There are no emails, no stored buyer accounts, and no recurring-billing rules.
- Renewing means buying another code. It stacks on the current end date.
- A 365-day code covers people who want a year.

**Trial.**
- There is no automatic trial, because device ids are free to make, so every new install could claim one.
- The owner mints short trial codes (for example 7 days) for promotions. The owner-minted codes are the trial.

**Refunds and revoking.** The owner revokes a code through admin, or the provider's refund event does it (W2). Access ends on the next turn.

**Offline.** Nothing changes. Escobar needs the network, and the offline coach and the rest of the app stay free.

### 4.4 Attacks and what stops them

| Attack | Result |
|---|---|
| Call the Worker with a made-up device id (today's hole) | Once `on`: 402 before any quota check or model call |
| Edit the app | Nothing changes: the Worker decides |
| Guess codes | The 20-bit tag rejects about 999,999 guesses in a million before storage. On top: 10 redeem tries an hour per install and 30 per IP bucket. A valid code also needs the 60 random bits |
| Forge a code | Needs `CODE_KEY`. Codes in D1 are stored only as hashes |
| Share a code | It works on one install at a time. Moving it has a limit of 3, and each move ends access on the old install |
| Share the device id (copy the app's data) | Both copies draw on one per-install dollar budget, which the buyer paid for |
| Reuse a payment session for more codes | The derived code is always the same one code |
| Steal the admin token | It exists only as a Worker secret. Wrong guesses lock the IP. It can be rotated with `wrangler secret put` |
| Refund, then keep using Escobar | Revoked at the refund event (W2) or by hand. Access ends on the next turn |
| Heavy users | Their own day and 30-day budgets. `PAID_USD_DAY` warns at 80%. The Anthropic spend limit is the last stop (O7) |
| Counter store fails | 503, blocked |

---

## 5. Build cards

**Shared fields (C\*, V\*, R\*):**
- **connectivity (C\*):**
  - The app talks only to the owner's Worker; there is no Play Billing on this path.
  - The Worker talks only to the payment provider's API (W2).
- **verification (V\*):**
  - Focused tests while building.
  - Before review: `npm run check`, `npm run test:tz` and the gate (app cards), or `npm --prefix escobar-worker run check` (Worker cards).
  - Each new test is shown failing on the base commit, and the PR lists the mutations used.
- **reserved_paths (R\*):**
  - the watch agent's files: `native/wear/**`, `src/native/wearEngine.ts`, `src/slices/settings/WatchLab.tsx`, the Watch-lab row and the watch agent's CI lines;
  - signing, `EXPECTED_SHA256` and keystores;
  - `package.json` and `package-lock.json`;
  - `src/core/models.ts`, `src/core/store.ts` and migrations;
  - other tasks' blocks in `scripts/screenshot-gate.mjs` and `tests/theme.test.ts`;
  - every path in another open card's write_scope.
- **check-in:** PAY-W1 is a hard card. Its builder posts `CHECK-IN PAY-W1` with the design note before bulk building.

**Merge order:**
1. **W1**: a separate PR the owner merges, with `PAYWALL=off`.
2. **A1**, then **D1**, then **D2**.
3. The owner sets `log`, then `on` once the build with code entry is live.
4. **W2** once the owner picks a payment provider. Owner-minted codes work before W2.

### PAY-W1: Codes, entitlement and admin in the Worker (separate PR, merged by the owner)
- **outcome:**
  - Once `PAYWALL=on`, only installs with an active code can use Escobar.
  - Spending is limited per install and blocks when it fails.
  - The owner can mint, list and revoke codes.
- **base:** `main`. **depends_on:** none.
- **read_first:**
  - this doc §4;
  - `escobar-worker/src/handler.ts:26-37,91-199`;
  - `quota.ts`, `quotaDO.ts`, `errorsStore.ts` (the D1 pattern), `index.ts` and `wrangler.toml`;
  - `src/escobar/state.ts:56-72`.
- **write_scope:**
  - new: `escobar-worker/src/{codes.ts, codesStore.ts, entitleDO.ts, entitle.ts, admin.ts, prices.ts}` and `escobar-worker/scripts/codes.mjs`;
  - `escobar-worker/src/{handler.ts, index.ts, anthropic.ts (Env only)}`;
  - `escobar-worker/wrangler.toml`: vars, the `ENTITLE` DO and migration `v3`, the `CODES_DB` D1 binding, and comments naming the secrets;
  - `escobar-worker/test/**` and `escobar-worker/README.md`;
  - `.github/workflows/deploy-worker.yml`: add-only `/health` checks, with the supervisor's OK.
- **reserved_paths:** R\*; everything outside `escobar-worker/**`; `errors*.ts`.
- **design:**
  - **Secrets:** `CODE_KEY` (32 random bytes) and `ADMIN_TOKEN` (32 random bytes). Neither is ever in the repo or in `[vars]`.
  - **Vars:** `PAYWALL`, `USD_DAY`, `USD_PERIOD`, `USD_PERIOD_OWNER`, `PAID_USD_DAY` and `REDEEM_BY_DAYS`.
  - **`/health`** adds `paywall` and `codes: boolean` (secrets and D1 present).
  - **CORS:** `/v2/redeem` and `/v2/status` use the same allowed origins. `/admin/*` sends no CORS headers, so no browser page can call it.
- **acceptance** (tests use a fake D1 (sqlite, as `test/d1-sqlite.ts` does) and a fake DO):
  - W1-A1: a code has 16 characters and a correct tag. A code with one wrong character, or a tag made with a different key, → 400 `bad_code` with no D1 read.
  - W1-A2: redeeming binds the code and adds `days`. A second code stacks from the current end. The same code on the same install changes nothing. The same code on a new install moves it (old install → 402). A 4th move → 409 `code_in_use`.
  - W1-A3: two redeems of one code at the same time → exactly one wins.
  - W1-A4: revoked, expired (`redeem_by` passed) and unknown codes → a clear error. Revoking a redeemed code → the next turn on that install gets 402.
  - W1-A5: with `PAYWALL=on`, an install with no access or with access expired → 402 and the model is never called. With `log`, it never blocks and logs how many it would have blocked. With `off`, behaviour matches today on the existing `handler.test.ts` suite.
  - W1-A6: when the day, 30-day or pool budget is used up → 429 with a clear message. If `EntitleDO` throws → 503 and the model is never called.
  - W1-A7: admin needs the token. A wrong token → 401. 5 wrong tries → 429 for that IP for an hour. `/admin/*` returns no CORS headers. Minting 100 codes returns 100 distinct valid codes. `count > 100` → 400.
  - W1-A8: redeem is limited to 10 an hour per install and 30 per IP bucket.
  - W1-A9: no code, token or device id appears in any `console.*` output (a test spies on the console). D1 holds only hashes (a test reads the table).
  - W1-A10: `prices.ts` equals `PRICES` in `src/escobar/state.ts` for each id in `MODE_MODELS`.
  - W1-A11: an app built from `main` before A1 shows the 402 text (from `transport.ts:91-99` and `EscobarSheet.tsx:51-55`; pick the error code to match).
  - W1-F1: every existing Worker test stays green.
- **risk:**
  - A D1 or DO outage blocks paid users: 503 with a clear message, and the offline coach still works.
  - Code guessing: covered by the tag plus the rate limits.
  - A leaked admin token: rotate it; every mint is logged by count only.
- **return:** PR link, head, evidence per criterion, mutations, and the owner's exact commands (`wrangler d1 create marc-codes`, `secret put`).

### PAY-W2: Payment link to code (separate PR, merged by the owner; after the owner picks a provider)
- **outcome:** after paying through the link, the buyer sees a code on `/buy/done`. A refund revokes it.
- **depends_on:** W1; the owner's choice of provider (O2).
- **write_scope:** `escobar-worker/src/{buy.ts, provider*.ts}`, plus a route in `index.ts`, tests and the README.
- **acceptance:**
  - W2-A1: an unpaid session, a session for another product, a refunded session, or a made-up session id → no code.
  - W2-A2: opening the paid page again → the same code (derived, not stored).
  - W2-A3: a signed refund event revokes the code. A bad signature → 401.
  - W2-A4: the page holds no buyer data beyond the code, sends `cache-control: no-store`, and loads no third-party scripts.

### PAY-A1: Code entry in the app
- **outcome:** the user can enter a code, see "active until", and gets clear messages. The Android build contains no link or price, and nothing in the app can be bought.
- **base:** `main` after W1 merges. **depends_on:** W1 (build against a fake Worker).
- **write_scope:**
  - new: `src/escobar/entitlement.ts` (status fetch, cached in memory) and `src/escobar/ui/CodeEntry.tsx`;
  - `src/escobar/transport.ts`: the 402 mapping;
  - `src/escobar/ui/SettingsSection.tsx`;
  - `src/escobar/session.ts`: wiring only;
  - `tests/escobar/**`;
  - a `PAY-A1` block in `scripts/screenshot-gate.mjs` and `src/ui/styles.css`.
- **reserved_paths:** R\*, `src/brain/coach/**` and `native/**`.
- **acceptance:**
  - A1-A1: Settings → Escobar shows "Enter activation code", status ("Active until <date>", "Expired", "Not active"), and one plain-text line, "Codes are sold at <CODE_SITE_TEXT>".
    - A test asserts that on native there is no `<a>`, no `href`, no `window.open` and no price in the component.
    - A test asserts that on the web the PWA shows a real link.
  - A1-A2: turning on "Online coach" with no active code opens the code entry. The Escobar sheet shows the 402 text with a button that opens code entry.
  - A1-A3: every Worker error (`bad_code`, `code_in_use`, expired, revoked, rate limit, 503) has its own plain message (a test per code).
  - A1-A4: nothing new is saved. A test spies on `update` and `localStorage`. The code field is cleared after sending.
  - A1-A5: the gate captures code entry in each of the 5 themes. The offline coach works with Escobar locked (test).
  - A1-F1: the existing Escobar tests stay green.
- **risk:** someone adds a link later by mistake. A1-A1's test stops it.

### PAY-D1: Privacy policy
- **depends_on:** W1 (and W2 for the payment part).
- **write_scope:** `docs/PRIVACY-POLICY.md`.
- **content:**
  - codes are sent to the coach server;
  - the server keeps a scrambled code of the code and of the install, the end date and spending counters, until 40 days after access ends;
  - payment happens on the provider's page, under the provider's own privacy policy, and the owner never sees card details;
  - the offline coach stays free.
- **acceptance:** each item in §8 appears with how long it is kept. The owner approves the text.

### PAY-D2: Play Data safety answers and listing text
- **depends_on:** D1. **write_scope:** this doc, §9.
- **acceptance:**
  - D2-A1: each answer is traced to the code.
  - D2-A2: the store listing says "Free app. The Escobar online coach needs an activation code." The listing is outside the app, so it may also name the website.

### 5.5 Optional later: a Play subscription path (only if the owner wants to sell inside the app)
- It is the round-1 design A, trimmed:
  - an own Billing 9.1.0 plugin;
  - the Worker verifies the purchase with `subscriptionsv2`;
  - a paid purchase opens access in the same `EntitleDO`;
  - Play promo codes are also possible (3-90 day trials, 10,000 one-time codes per quarter).
- **Cost of choosing it:**
  - the app is no longer consumption-only, so the "Codes are sold at <site>" line must go in every country where the owner has not enrolled in a programme;
  - Google takes its fee;
  - the release build must be an AAB with billing checks.
- Cards were drafted in the first version of this plan: PAY-A1 billing plugin, PAY-A2 paywall, PAY-R1 AAB with billing checks. They are held back. The supervisor rewrites them if the owner chooses this.

---

## 6. Owner steps (only the owner can do these)
- **O1. Create the code store and set the secrets.** Run:
  - `npx wrangler d1 create marc-codes`, and paste the id it prints into `wrangler.toml`;
  - `npx wrangler secret put CODE_KEY` and `npx wrangler secret put ADMIN_TOKEN`, each with 32 random bytes, for example from `openssl rand -base64 32`.

  Keep `ADMIN_TOKEN` in a password manager. Never put either value in the repo or a chat.
- **O2. Pick a payment provider.** It must:
  1. offer a hosted payment link;
  2. redirect after payment with a session id the server can check, or send signed events;
  3. pay out in your country.

  Candidates to check yourself: Stripe Payment Links, PayPal, Paddle, Lemon Squeezy. We have not verified which ones pay out in your country. Paddle and Lemon Squeezy act as the seller and handle sales tax (VAT/GST); with Stripe or PayPal, the tax is yours.
- **O3. Set up the website text.** Decide the site text the app shows ("Codes are sold at …"). Put the payment link on the website, in social posts and in emails, never in the Android app.
- **O4. Terms.** Write the terms of sale on the website: 30 days of access per code, no auto-renewal, and your refund rule.
- **O5. Merge and switch.** Merge W1, mint your own codes, set `PAYWALL=log`, then set `on` once the build with code entry is live.
- **O6. Play listing and forms.** Update the Play listing and the Data safety form (§9).
- **O7. Spending limit.** Set a monthly spend limit on the Anthropic key in the Claude Console. We have not checked which limit options your account has.
- **Publishing on Google Play still needs the AAB and signing decision from the first version.** It is not a payment step any more, but it still blocks publishing.

---

## 7. Price and budgets

### 7.1 What comparable apps charge
- ✔ **Fitbod**, https://fitbod.me/faqs/: "Fitbod offers monthly $15.99 and annual membership $95.99 options, when purchased on our website", with a 7-day free trial.
- ✔ **JuggernautAI**, https://www.juggernautai.app/: $34.99 a month or $349.99 a year, with a 2-week free trial.

M/ARC's tracker is free and only the AI coach is paid, so the price sits below both.

### 7.2 What an answer costs (estimate)
- About **$0.055 a turn on `claude-opus-5`**. This assumes 2 steps a turn, each with 2k new input tokens, 10k cached tokens and 500 output tokens. Prices are $5 / $25 / $0.50 per million (`state.ts:57`).
- About **$0.022 a turn on `claude-sonnet-5`** (`state.ts:60`).
- `PAYWALL=log` records the real cost per install.

### 7.3 Recommendation
- **Prices:**
  - **$9.99 for a 30-day code**;
  - **$69.99 for a 365-day code**;
  - trials are owner-minted 7-day codes, given out as promotions.
- **Fees:** there is no Google fee on this path. The provider's fee is not verified (commonly a few percent).
- **Budgets:**
  - `USD_PERIOD` = **$4** per 30 days (about 70 turns on Opus 5, about 180 on Sonnet 5);
  - `USD_DAY` = **$0.60**;
  - `USD_PERIOD_OWNER` = **$15**;
  - `PAID_USD_DAY` = $1 × active installs, at least $10, with a log warning at 80%.
- **Model choice:** if most people hit the budget, the owner can switch Escobar's chat mode to `claude-sonnet-5` (`MODEL_CHAT`, `wrangler.toml:15`).

---

## 8. What is new: data, dependencies, money

| Item | Where | Kept for | Today |
|---|---|---|---|
| The activation code | app → Worker, only on redeem | only its hash is stored | none |
| Code record: hash, kind, days, dates, note, bound install hash, moves, revoked | Worker D1 `marc-codes` | until 40 days after its access ends or it expires unredeemed | none |
| Install access: install hash, end date, dollar counters | Worker `EntitleDO` | until 40 days after access ends | per-device counters for 3 days |
| Payment-session hash (W2) | Worker D1 | as the code record | none |
| Buyer's name, email and card | the payment provider only, on its page | the provider's rules | none |

- **Not stored anywhere by the owner:** buyer email, card details, order ids tied to an install.
- **The app:** saves nothing new, and sends nothing new except the code.
- **Dependencies:** none. There is no npm package, no Gradle dependency and no Billing Library on this path.
- **New provider:** a payment provider (O2). It needs the owner's approval as a new paid service and data processor.
- **Money:** the provider's fees, and the AI cost of owner codes and trial codes (capped by their budgets).

---

## 9. Play Data safety answers (payment part, finalised by PAY-D2)
- **Financial info → Purchase history:** we recommend declaring it:
  - collected (the app sends a code that proves a purchase, and the server ties it to the install);
  - not shared;
  - required only for Escobar;
  - purpose: app functionality and fraud prevention.

  This is the cautious reading of the definition quoted in §2.6. The owner confirms it.
- **Payment info:** not collected by the app. Payment happens on the provider's website, outside the app.
- **Device or other IDs:** as today (the random device id, already sent for Escobar).

---

## 10. Needs the owner's approval
1. **New data stored:** the code and install records (§8), and the Purchase history answer.
2. **A payment provider:** a new paid service and processor, with its fees and the tax handling that comes with it.
3. **Price and budgets (§7):** also the AI cost of the free codes you mint.
4. **Old app versions:** once `PAYWALL=on`, users on old versions lose Escobar until they update and enter a code.
5. **No link in the Android app:** the app shows the site in plain text only, in every country. Adding links (US programme, EEA/UK programme) means enrolling, fees and transaction reports. That is a later decision for you.

---

## 11. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Play decides a plain-text website mention steers users | The line comes from Google's own example for consumption-only apps (§2.7). If Play objects, remove the line: the code entry alone still complies |
| Someone adds a Play purchase later and forgets the website line | §5.5 makes removing it part of that card. A1-A1's test covers links today |
| Today's hole stays open until `on` | Run `log` as soon as W1 merges, set a date for `on`, and lower `MAX_OUTPUT_TOTAL` until then |
| Codes posted publicly | One install at a time, 3 moves, owner revoke. Budgets cap the cost per code |
| A leaked admin token | Worker secret only; IP lockout; rotate with `wrangler secret put` |
| Paying users locked out by a bug | The `log` stage; a test per error; 503 (never 402) when storage fails |
| Cost above revenue | Dollar budgets per install, per day and for the pool; the spend limit on the key; the option to switch model |
| Tax and consumer rules for web sales | A seller-of-record provider (Paddle or Lemon Squeezy), or the owner handles tax. The owner decides (O2) |
| Australia or the US allow links in future | Not needed for this design. Enrolling is optional later (§4.1) |
