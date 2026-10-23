# M/ARC — Codex whole-app audit

**Date:** 1 October 2026, Asia/Manila. **App:** 37.1.0. **Repository:** [macdarenz-droid/M-arc](https://github.com/macdarenz-droid/M-arc).

**Audited source:** `168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd` on `main`. During the audit, main advanced to `cd3c92152715dbe0877f730fa3cad491df35e28b`. A complete comparison found only seven documentation/rules files changed across nine commits; application, native, Worker, tests and build code were unchanged. Code links below deliberately point to the audited snapshot. This is a report-only change; no application fixes were made.

## Overall assessment

M/ARC has a substantial automated test suite, sensible separation of pure training logic from UI, local-first storage, lazy-loaded coach/guide/share features, and useful input/privacy guards. Its passing checks do **not** establish that the app's advice and every failure path are correct.

This audit identifies **32 primary findings: 4 P1 and 28 P2**. Of these, **30 are implementation/workflow/portability defects; two (SCI-10 and SCI-11) are scientific-validation and claim-precision gaps**. Additional observations and documented design tradeoffs are listed separately and are not included in that count. No P0 issue was established. The most urgent work is enforcing the coach-off switch, paid-request admission, and the two incorrect recovery/readiness calculations. Treat those as release blockers before relying on the affected promises.

The review covers every major shipped subsystem and named screen/control family. It combines source tracing, executable synthetic examples, a direct browser check, dependency audits and inspection of exact-commit CI evidence. It is **not** a claim that every possible button sequence, phone, sensor, model response or scientific statement was dynamically verified. The coverage matrix and remaining checks below make those boundaries explicit.

### Findings at a glance

| ID | Priority | Finding |
|---|---|---|
| SEC-01 | P1 | Parallel paid requests pass the same quota allowance; quota errors fail open |
| SEC-03 | P1 | An active coach turn sends another request after Online coach is switched off |
| SCI-01 | P1 | Improving an assisted exercise can teach the recovery model that performance worsened |
| SCI-02 | P1 | Four-hour sleep every night can become 100/green readiness |
| DATA-01 | P2 | Accepted malformed backups can persistently crash the app |
| DATA-02 | P2 | Reset/delete can retain data or allow another tab to restore it |
| REL-01 | P2 | Cached PWA fails to open when the server returns HTTP 503 |
| SCI-03 | P2 | Severe soreness is ignored for unlogged/marked-fresh muscles |
| SCI-04 | P2 | Red readiness still increases reps/time/distance in four exercise modes |
| SCI-05 | P2 | Assisted trends track easiest assistance; rep records ignore resistance changes |
| SCI-06 | P2 | Falling resting HR is penalized like rising resting HR |
| SCI-07 | P2 | Widely separated HR readings qualify as a continuous maximum plateau |
| SCI-08 | P2 | Substitute rep target treats working load as estimated 1RM |
| SCI-09 | P2 | Draft-plan and completed-week muscle volume use different coefficients |
| SCI-10 | P2 / evidence | Fixed calorie error bands are not validated for lifting/device sources |
| SCI-11 | P2 / evidence | Recovery/readiness confidence and causal wording exceed validation located |
| UI-01 | P2 | Skip today discards an exercise's already committed sets at Finish |
| UI-02 | P2 | History swipe-delete Undo restores the pre-edit session |
| UI-03 | P2 | Past-session form cannot log timed/distance modes faithfully |
| UI-04 | P2 | History cannot edit carry distance and hides other carry measurements |
| UI-05 | P2 | Timing correction accepts a completed workout in the future |
| UI-06 | P2 | Live unit switch can change a different gym from the displayed session |
| UI-07 | P2 | Muscle detail says Full Now while the model still estimates hours to full |
| UI-08 | P2 | Onboarding displays Male selected but saves sex as unset |
| UI-09 | P2 | Essential goal/exercise/watch/reorder actions lack keyboard equivalents |
| UI-10 | P2 | Crash reset ignores assistive synthesized clicks |
| UI-11 | P2 | Progress/stats use incorrect measurements for conditioning/timed work |
| UI-12 | P2 | Coach target and live target disagree because their context differs |
| NAT-01 | P2 | Cached LIVE status never ages if watch notifications stop silently |
| NAT-02 | P2 | Paused heart samples inflate workout calories and zone duration |
| NAT-03 | P2 | Latest nap/old resting-HR sample is treated as today's recovery input |
| DEV-01 | P2 | Windows build/test workflow fails on filename and path conventions |

**Priority meaning:** P1 = correct before release/reliance on the affected functionality; P2 = material incorrect result, data behavior, access or supported development workflow; P3 = limited inconsistency. These are product engineering priorities, not CVSS or a medical risk score. “Runtime” below means synthetic execution of real source functions; “code path” means a traced reachable path without a full device/browser reenactment. Research gaps are labeled separately.

## Verification and performance evidence

| Check | Result and exact scope |
|---|---|
| Original Linux CI source gate | **Passed** on audited SHA: Worker checks, Relay checks, app typecheck/tests/build, extra New York/Manila timezone tests, built-source validation and default browser gate. Inspected via GitHub jobs API, not rerun remotely by this audit. |
| Original Linux Auckland browser gate | **Passed** on audited SHA. [Exact workflow run](https://github.com/macdarenz-droid/M-arc/actions/runs/36789100045). Existing browser gates cover five themes, migration and many behaviors; they do not test every new counterexample below. |
| Original Android build gate | **Passed** on audited SHA in the same workflow run. This is CI build/gate evidence, not a physical-device behavior check. |
| Local Worker | Typecheck passed; **152/152 tests across 9 files passed**, Node 24.19.0 on Windows. CI uses Node 22. |
| Local focused existing app tests | **42/42 across 7 files passed:** health bridge, notifications, watch wrapper, heart capture, PWA, router and back handling. |
| Local performance tests | **3/3 passed.** 600 sessions: recovery-model rebuild **78.0 ms**, recovery status **43.5 ms**, coach insights **48.9 ms**. 680-message window **0.7 ms**. Machine scale 1.13; these are desktop synthetic measurements, not Android UI-latency or battery results. Other audit processes were active. |
| Independent audit probes | Security synthetic transport/storage/quota/SW cases; scientific boundary fixtures; **7/7 UI proof assertions**, **2/2 native-boundary assertions**, and **1/1 additional end-to-end session-state probe** through pause/resume/commit/finish. These tests reproduce findings or characterize documented boundaries; their passing is evidence of the observed output, not acceptance of every behavior. |
| Local unchanged app typecheck/build | **Failed on Windows** because extensionless imports resolve `Coach.tsx` as `coach.ts` and `Profile.tsx` as `profile.ts`. Original Vite build reports missing `INSIGHT_COLOR`. See DEV-01. |
| Local full app suite | Started unchanged and produced Windows URL/path failures, then stopped after several minutes without further progress/completion. No local full-suite pass is claimed; no test was edited or disabled. Exact-commit Linux CI supplies full-regression evidence. |
| Local browser build | Built with an **external audit-only Vite alias shim** selecting the intended two `.tsx` files. App source unchanged; this is not a successful unchanged Windows production build. Onboarding → Settings → Profile visibly confirmed UI-08 using synthetic data. |
| Bundle size from that audit build | Main JS **640.07 kB / 189.94 kB gzip**, main CSS **57.49 kB / 11.66 kB gzip**; Vite issued its >500 kB chunk warning. Escobar session ~100.60 kB /35.36 kB gzip is a lazy chunk; eight guide chunks are also lazy. Size alone is not proof of perceptible slowness. |
| Dependency registry audit | Root: **5 moderate package findings**; Worker: **4 moderate +1 high package finding**. Both `npm audit --omit=dev` runs reported **0 findings**. These counts include transitive/duplicate affected packages and concern development toolchains; they are not ten independently proven production exploits. |

No paid live coach request, real user health data, deployed-service mutation, release signing change or destructive production test was used. The production Worker environment, provider spend ceiling, APK/device behavior and host response headers were not independently exercised.

### Performance judgment

The measured 600-session algorithms meet their current budgets. The code separates the one-second live ticker from minute-level recovery/readiness, limits recent History cards and chart windows, and lazily loads expensive optional features. However, target/history calculations still run on live entry edits, the main bundle is large, and `rawSamples` is an unbounded array despite being described as a ring. Profile an older Android device with realistic multi-year data, a long active watch session and repeated set edits before promising smoothness. Measure cold/warm startup, input delay, long tasks, memory, pause/resume and background battery cost; the current timing tests cannot answer those questions.

### Dependency remediation

Refresh the toolchain through ordinary tested dependency updates. The [Vitest maintainer advisory](https://github.com/vitest-dev/vitest/security/advisories/GHSA-82fw-gwwq-j7x9) describes a dev-server/mock redirect file-read issue and its specific preconditions; the audited app uses the Node test environment, so remote exploitation of the shipped app was not established. The Worker finding follows Wrangler → Miniflare → Undici; the [Undici maintainer advisory](https://github.com/nodejs/undici/security/advisories/GHSA-w293-vg96-wgc3) documents the affected TLS connection-option path. UUID is also reported under Capacitor CLI → Xcode. Do not run `npm audit fix --force` blindly or infer that replacing these packages fixes the app-level findings.

## Scope and method

The shipped Preact/TypeScript app, its pure training engine, UI callbacks, state repair/migration/backup, online Escobar loop/tools/Worker, error reporting, PWA caching, Android bridges, BLE service and build/test setup were reviewed. `legacy/v36` was considered through the migration boundary, not audited as a currently shipped app. `relay/` is a separate product according to this repository's README and was excluded from this M/ARC audit; its original CI status is recorded only as part of the shared gate. Generated art was inspected through its registry/loader and sampled source evidence, not frame-by-frame certification of all exercise technique.

The requested breadth is represented by subsystem and control-family coverage below. Static tracing is not equivalent to clicking each control on a real phone, and a passing existing suite is not proof that all guidance is research-validated.

## Security, privacy, persistence and PWA


### SEC-01 — P1: quota admission does not reserve capacity, and quota outages permit paid requests

**Locations:** [escobar-worker/src/quotaDO.ts:22–41](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/escobar-worker/src/quotaDO.ts#L22-L41); [escobar-worker/src/handler.ts:129–130,180–190](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/escobar-worker/src/handler.ts#L129-L130); [escobar-worker/src/quota.ts:39–49,66–82](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/escobar-worker/src/quota.ts#L39-L49).

`check()` only reads the finished-call counters. The paid upstream request runs after that check, and `add()` happens after its response. Atomic additions prevent lost increments, but do not prevent concurrent requests from all seeing the same remaining allowance. This applies to the global cap as well as device/IP caps. With one step remaining, a burst can start many steps; output tokens can similarly overshoot by the combined output of all in-flight calls. The burst rate limits narrow but do not remove this window. The check also returns `{ok:true}` if the Durable Object throws; failure to record usage is swallowed.

**Offline reproduction:** with device, IP and global limits all set to one, run ten `QuotaCounter.check()` calls before any `add()`. All ten return `ok:true`; adding their results produces global `{steps:10,out:1000}`. A throwing `QUOTA_DO.check()` also returns `ok:true` from `checkQuota()`.

**Impact:** the advertised daily spending guard is not a hard admission limit. Arbitrary callers can reach this paid endpoint using a syntactically valid self-generated device ID and no Origin header (`handler.ts:95–104`); the finding does not assume CORS is authentication or that public anonymous access itself is unintended.

**Fix:** combine check and reservation in one Durable Object operation before opening the upstream stream; reserve a bounded output allowance and account for input/cache costs if the intended limit is monetary. Reconcile/release reservations on completion with idempotency and expiration. Refuse paid calls, or use a deliberately bounded emergency allowance, when enforcement is unavailable. Add concurrent **admission** tests, not only concurrent counter-addition tests. Provider-side spend limits are a separate defense; they were not inspected. This aligns with [OWASP API4 guidance on concurrent resource consumption and third-party spending limits](https://api-security.owasp.org/editions/2023/en/0xa4-unrestricted-resource-consumption/).

### SEC-03 — P1: turning the online coach off does not stop an ongoing multi-step turn

**Locations:** [src/escobar/ui/SettingsSection.tsx:33–35](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/escobar/ui/SettingsSection.tsx#L33-L35); [src/escobar/session.ts:216–243,265–267,284](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/escobar/session.ts#L216-L243); [src/escobar/loop.ts:375–394,435–440,481–489,554–580](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/escobar/loop.ts#L375-L394).

The Settings switch only writes `enabled:false`. Closing the sheet also only changes UI state. Neither aborts the active loop. The loop does not check `enabled` before sending each subsequent request, so a turn that needs tools continues sending local results even after Settings says “Off. Nothing leaves the phone.”

**Offline reproduction:** start the real `EscobarLoop` with an injected transport. Return a `get_overview` tool request from step one, then set state `escobar.enabled=false` before that result is handled. The loop completes successfully after two transport calls; recorded enabled flags at those calls are `[true,false]`.

**Fix:** route all disable paths through one operation that aborts/drops the loop and cancels pending work; enforce `enabled` again at the session send and each transport step. A request already received by the server cannot be recalled, but no new step should start after revocation. Test disable during streaming, a tool round trip, retry backoff, and hidden-sheet operation.

### DATA-01 — P2: structurally invalid backups can be accepted and persistently crash readers

**Locations:** [src/core/store.ts:34–38,46–86,119–125,177–187](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/core/store.ts#L34-L38); [src/slices/settings/backup.ts:30–38](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/settings/backup.ts#L30-L38); [src/slices/settings/Settings.tsx:126–143](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/settings/Settings.tsx#L126-L143); consumers [src/app/selectors.ts:65–67](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/app/selectors.ts#L65-L67), [src/brain/coach/rules.ts:669–674](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/coach/rules.ts#L669-L674), [src/escobar/context/brief.ts:116](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/escobar/context/brief.ts#L116).

Repair checks most list elements only for “is object” and does not validate several lists at all. `insightFeedback:{}` and `profileHistory:{}` survive normalization. A backup containing `insightFeedback:{}` is accepted and written; the Home insight selector then throws `TypeError: feedback is not iterable`. On reload it is still accepted as the main saved state, so the automatic corrupt-state/backup fallback does not activate. `profileHistory:{}` breaks Escobar's brief with `.some is not a function`. Separately, `active.entries:[null]` throws inside `parseBackup()`; only JSON parsing is caught, so the Restore handler has no normal invalid-file response for it.

**Offline evidence:** the real parser/normalizer and selectors produced those failures with otherwise fresh valid synthetic states. No execution or filesystem privilege is gained from this issue; it is an import/boot availability and data-repair defect.

**Fix:** validate field shapes and required nested fields at the import boundary, including every list, enum, finite number, day and active entry. Drop/repair invalid records with an accurate count, or reject before replacing current state. Catch complete parse/convert/repair failures. Test that any accepted backup can run the major selectors and can boot after serialization; keep a last-known-readable state until that succeeds.

### DATA-02 — P2: reset/delete operations can leave or restore supposedly deleted data

**Locations:** [src/core/store.ts:275–288,369–372](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/core/store.ts#L275-L288); `index.html:89–93`; [src/main.tsx:55–63](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/main.tsx#L55-L63); [src/escobar/session.ts:321–326](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/escobar/session.ts#L321-L326); [src/escobar/store.ts:181–207](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/escobar/store.ts#L181-L207); [src/slices/settings/Settings.tsx:76–85](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/settings/Settings.tsx#L76-L85).

Two concrete cross-tab gaps exist in the deletion contract:

1. The main-state listener ignores `storage` events with `key:null` or `newValue:null`. The crash reset uses `localStorage.clear()`. A second open PWA tab retains its old in-memory state and writes it back on its next normal update, page hide or tab close. The synthetic probe dispatched `{key:null,newValue:null}` after clearing storage and then called `flushSave()`; the deleted “Synthetic old profile” reappeared.
2. “Delete conversations” calls `saveStore(emptyStore())` directly, instead of the replacement-notifying `clearStore()` path. Another open tab does not react to a non-null `ESCOBAR_KEY` storage update, retains its old conversations, and can write them back on the next chat save. This path is source-confirmed; a two-browser-tab UI reproduction was not run.
**Documented exception, not counted as a defect:** “Reset everything” intentionally preserves `CORRUPT_KEY` and `CORRUPT_BACKUP_KEY`. The privacy policy explicitly says unreadable saved copies remain until the separate “Unreadable data kept aside” → “Hold to delete” action. The synthetic probe confirmed this preservation, but it does not establish a violation of that documented contract. Keep that exception visible near the reset action.

**Fix:** use a shared reset epoch/tombstone and replacement notifications, cancel pending saves in every tab, and distinguish ordinary state synchronization from a deletion. Add two-context tests where a stale tab is hidden or saves immediately after deletion; separately preserve and test the documented quarantine-recovery choice.

Browser behavior supporting the cross-tab reproduction: [MDN StorageEvent documentation](https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent) specifies `key:null` for `clear()` and delivery to other documents sharing the storage area.

### REL-01 — P2: a transient HTTP error prevents use of an already cached PWA

**Location:** [public/sw.js:45–50](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/public/sw.js#L45-L50).

Navigation falls back to the cached application only when `fetch()` rejects. HTTP 500/502/503 responses resolve normally, so the worker serves the hosting error page even if a complete working app is cached. Local workout features become inaccessible for that navigation during a host outage despite being designed to work offline. No data loss was observed.

**Offline reproduction:** evaluate the real service worker in a VM, provide a valid cached index, and return `Response('server unavailable',{status:503})` from fetch. The navigation response remains HTTP 503 with the error body.

**Fix:** use the known cached index for transient server failures as well as network rejection; define the desired behavior for 404/other permanent errors separately. Add tests for 500/503, rejected fetch, no cached index, and a successful new build.

## Secondary observations and bounded hardening work

- **SEC-02 reviewed behavior — documented conversation replay, not a counted defect:** [src/escobar/loop.ts:218–246](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/escobar/loop.ts#L218-L246) redacts old tool results and situation briefs after sharing is switched off, but replays assistant prose; `254–284` also supplies rolling summaries. The probe `toRequestMessages(history, undefined, {body:false,health:false})` retained synthetic assistant text containing weight, resting HR and sleep. However, [docs/PRIVACY-POLICY.md:30](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/docs/PRIVACY-POLICY.md#L30) expressly discloses that words already written by the user or coach continue to be sent. This is a privacy design tradeoff, not proof that the implemented sharing contract is broken. The Settings toggles do not show this exception beside their labels; consider making the scope clear there and offering a fresh outbound conversation when users want to stop replaying previous sensitive text. No independently demonstrated violation involving rolling summaries or model-authored tool inputs is claimed.
- **Restored endpoint and consent trust (P2 candidate; product decision):** `normalizeEscobar()` at [src/core/escobarState.ts:77–80](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/core/escobarState.ts#L77-L80) restores arbitrary HTTP(S) proxy URLs, enabled state and sharing flags. `Settings.tsx:138` preserves those settings while only resetting Health Connect authorization. The import confirmation does not surface the new server. A deliberately crafted/shared backup can redirect the next coach interaction to another server and enable sharing; an HTTP URL also passes normalization despite the Settings editor requiring HTTPS. The probe confirmed preservation of `https://audit.invalid`, `enabled:true`, and both sharing flags. Consider treating destination/consent/device identity as local trust decisions instead of portable training data. This is not a zero-click network exploit: it requires importing and confirming the backup and later coach use.
- **Orphaned photos (P2/P3 storage/privacy maintenance):** [src/escobar/images.ts:30–36](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/escobar/images.ts#L30-L36) persists every image in IndexedDB; `evictImages()` removes only RAM data, and the only disk delete is all-photo `clearImages()`. Conversation eviction/trimming in [src/escobar/store.ts:90–138](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/escobar/store.ts#L90-L138) does not delete the corresponding photos. Disk use and retained photos can therefore grow beyond the 20-conversation / 1 MB chat limit. Implement ID-based image GC when conversations/messages are pruned and a byte/count budget. Static path finding; long-device-life storage growth was not benchmarked.
- **Manual Worker deploy branch restriction absent (P2 operational hardening):** [.github/workflows/deploy-worker.yml:11,20–43](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/.github/workflows/deploy-worker.yml#L11) permits `workflow_dispatch` but has no job-level `github.ref == 'refs/heads/main'` guard or declared protected environment. Push deployments are main-only; manual workflow runs are a separate path and may choose another branch. The comment claims main-only. Repo/organization environment policy could provide an external guard, but that was not inspected. Add an explicit branch check and owner-controlled deployment environment if that is the intended release contract.
- **Legacy lb backfill is a no-op (P3):** [src/core/migrate.ts:238](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/core/migrate.ts#L238) backfills `state.sessions` while that array is still empty; line 262 subsequently assigns `sessions`. A 102 kg legacy set displays 224.9 lb rather than its inferable entered value 225 lb. Canonical kilograms remain correct, so this is a small historical display fidelity issue, not evidence of a major load-conversion or safety error. Apply backfill to the finished imported sessions.
- **Error report message scrubbing has an explicit limitation:** [src/errors/scrub.ts](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/errors/scrub.ts) and worker validation replace digits and quoted text, but do not prove that arbitrary unquoted personal text in an `Error.message` is absent. Existing app-controlled messages inspected were mostly fixed strings. No concrete normal user flow leaking an unquoted personal value was reproduced; do not label this a confirmed data leak.

## Coverage, controls observed, and limits

Read/inspected: the main store and repair/migration/load/save/reset paths; backup parsing/application; heart-store sanitization and retention; Escobar session/transport/replay/windowing/tool executor/action validation/apply/store/images and selected context/read/UI paths; error-report consent/queue/sender/scrubbing; Worker request validation, CORS, quota/counter handling, model request construction, relay, error reporting D1 schema/rate/retention routes; PWA install/activate/fetch/version stamping and main registration; deployment workflow and Capacitor configuration. Relevant architecture/error-report docs and repository reviewer rules were read. Scientific formulas and the majority of visual button behavior belong to the other specialist lanes.

Controls observed: generated server-owned tool list; request/body caps; no client API key in the inspected transport; structured bounded action proposals and user Apply before training mutations; rendering coach text as text rather than arbitrary HTML; positive health/body tool gates; an explicit initial coach-sharing choice; default-off error report consent, bounded queue and server validation; prepared SQL statements for D1; HMAC IP rate keys for error reports; server-report retention; same-origin PWA caching and failed-resource responses rather than HTML substitution. These controls do not cancel the findings above.

Evidence scripts/output are outside the repository in `work/audit-security-probes.ts`, `work/build-security-probes.mjs`, and `work/audit-security-probes-output.jsonl`. Build and execution completed successfully. Independent local verification found the Worker typecheck and all 152 Worker tests passed; these probes independently exercise cases those passing tests do not cover. No source edits or test weakening were made.

Not verified: deployed Worker configuration, provider/account spend caps, production host response headers, permissions held by deployment actors, real Anthropic model behavior, Android process-kill durability, actual user storage pressure, IndexedDB behavior across real WebViews, or an exhaustive dynamic button walk. These findings are not a claim of full production penetration testing or proof that no other vulnerabilities exist.


## Training logic, insight accuracy and research


### SCI-01 — P1: assisted-machine improvement trains the recovery model in the wrong direction

**Locations:** [src/brain/recovery.ts:514-527](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/recovery.ts#L514-L527), [src/brain/history.ts:85](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/history.ts#L85), [src/brain/recovery.ts:415-420](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/recovery.ts#L415-L420).

`calibrateAfterSession` accepts every exercise mode. `bestE1rm` is calculated from stored `kg`, which is assistance rather than lifted load for an assisted pull-up. Consequently, doing the same reps with **less help** looks like a strength loss. This increases the lats' recovery time constant and persists an incorrect calibration observation.

**Executed reproduction:** one max-effort assisted pull-up set with 60 kg assistance × 8 on September 25; one with 40 kg assistance × 8 on October 1. Default profile and empty recovery model. Result: `{tauScale:{lats:1.1},observations:{lats:1}}`. Performance improved; the model learned that recovery should be 10% slower. The inverse can teach faster recovery when assistance increased.

**Remedy:** allow e1RM-based calibration only for modes whose kg is resistance, or implement a separately validated assistance-aware comparison with matched repetitions/body weight. Test both increasing and decreasing assistance through finish and model replay.

### SCI-02 — P1: repeated four-hour nights become perfect readiness

**Location:** [src/brain/readiness.ts:200-211](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/readiness.ts#L200-L211) (baseline is used as physiological need), `:295-298` (calibration label).

The median of the person's recorded sleep is treated as their entire sleep requirement. Matching chronic undersleep gives a perfect sleep subscore. Missing inputs are then renormalized, so this can give perfect overall readiness.

**Executed reproduction:** 14 dates ending today, each `sleepMinutes:240`, no other signals. `readiness` returns `{score:100,band:'green',loadAdvice:'normal',confidence:'low',calibrating:false,drivers:[]}`. Merely collecting enough bad sleep makes the provisional label disappear; there is no absolute-duration check. Healthy adults' usual short sleep is not evidence that their sleep requirement fell to four hours. The app's own `knowledge.json` recommends at least seven hours, consistent with the [AASM/SRS consensus](https://aasm.org/resources/pdf/adultsleepdurationconsensus.pdf).

**Remedy:** distinguish personal sleep consistency from sleep sufficiency. Use an evidence-informed minimum/need model, retain uncertainty, and test chronic restriction, one short night, missing nights and recovery sleep. A population recommendation should not be converted into a guaranteed personalized performance effect either.

### SCI-03 — P2: severe soreness is bypassed for unlogged or marked-fresh muscles

**Location:** [src/brain/recovery.ts:344-369](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/recovery.ts#L344-L369).

The early return for no prior muscle dose or `freshOverridesLast` occurs before today's soreness cap. This reports 100% recovered and ready even if the user has just rated soreness 5/5. It also allows an old fresh mark to outrank newer soreness, since check-ins have a day and no comparison is made with the mark.

**Executed reproduction:** `recoveryStatus({sessions:[],now,checkIns:[{day:today,soreness:{chest:5}}]})` produces chest `pct:100, ready:true`. A user may have exercised outside the app before first use; their explicit check-in must still count.

**Remedy:** apply current soreness after every model/freshness branch, and define precedence for same-day marks. Test no history, unrelated exercise history, stale fresh marks and current soreness.

### SCI-04 — P2: red-readiness adjustments do not apply to four exercise modes

**Locations:** [src/brain/progression.ts:362-394](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/progression.ts#L362-L394), `:425-442`.

Duration, distance-based conditioning, bodyweight and assisted branches return before the red-readiness set reduction. `holdLoad:true` is added afterward but only constrains later load changes. Existing targets can still increase reps, duration or distance and retain all sets while the coach says to ease off.

**Executed reproduction:** last session has three ideal sets; today's context `{readiness:{loadAdvice:'reduce'},recoveryPct:10}`. Pull-ups 8→9 reps; assisted pull-ups 8→9; plank 30→35 seconds; 20 kg farmer carry 20→25 m. All return three sets and no `cutSets`. Weighted lifts in the same situation remove a set. Timed holds also return before the long-break check.

**Remedy:** apply a mode-independent readiness/re-entry policy before producing targets, with mode-appropriate volume limits. If a mode intentionally ignores a factor, align the coach statement and document the evidence for that exception.

### SCI-05 — P2: assisted trends use the easiest set; records ignore assistance or added load

**Locations:** [src/brain/history.ts:67-69](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/history.ts#L67-L69); [src/brain/trend.ts:46-52,137](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/trend.ts#L46-L52); [src/brain/prs.ts:125-127](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/prs.ts#L125-L127); [src/brain/coach/post.ts:33](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/coach/post.ts#L33).

`topKg` is the maximum assistance in a session. Using it to measure assisted strength tracks the easiest set, so a harder top set followed by more-assisted back-off work can be classified as decline. Separately, assisted and weighted-bodyweight rep records compare repetitions across every load. An easier session can therefore be celebrated as a genuine personal best.

**Executed reproductions:** (1) eight weekly sessions whose difficult set improves from 40→26 kg assistance, while the back-off changes from 50→64 kg assistance, both ×8, returns a downward trend of -3.42%/week. (2) 20 kg assistance ×8 followed by 60 kg assistance ×9 returns `best_reps` and feeds the debrief's unconditional personal-best claim.

**Remedy:** use the least-help comparable working set for assisted progress, handle zero assistance explicitly, and compare rep records at matched assistance/added load. Keep raw maximum repetitions as a separate descriptive statistic if desired. The F13 specification deliberately left old progression/records unchanged; this is a pre-existing product-logic limitation, not a failure to implement F13.

### SCI-06 — P2: falling resting HR slows recovery just like rising resting HR

**Location:** [src/brain/recovery.ts:159-163](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/recovery.ts#L159-L163).

`Math.abs(avg(rhr7)-avg(rhr28))` penalizes any directional change beyond 0.5 SD. The readiness module correctly treats a rise as the adverse direction, so the two engines disagree.

**Executed reproduction:** 21 days at 60 bpm followed by seven days at 50 bpm, no sleep or load penalties: `systemicFactor(...) === 1.1`. The lower recent resting HR stretches recovery by 10%. Lower HR is not automatically positive in every clinical/training context, but neither is any decline evidence of fatigue. [Buchheit's monitoring paper](https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2014.00073/full) requires direction, measurement uncertainty and training context.

**Remedy:** use a signed change for the existing elevation rule; evaluate unusual decreases separately only with corroborating evidence. Add symmetry tests.

### SCI-07 — P2: disconnected heart readings satisfy the validated max-heart-rate detector

**Locations:** [src/brain/heart.ts:57-71](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/heart.ts#L57-L71); similar loss of time continuity in `:261-265` and `sessionDrift`'s three-point ready run.

The algorithm says it requires consecutive five-second samples and an ascending run, but immediately drops timestamps. Five points separated by long disconnects become a plateau; the first five points do not need any preceding ramp at all. The result can raise the observed max used for saved heart summaries/zones while the observation remains eligible. The heart store retains 60 session series, older observations partly decay, and a profile override takes precedence. Current live-rest call sites do not pass this observed-max input, so an effect on live rest is not established.

**Executed reproduction:** `[[0,200],[600,201],[1200,200],[1800,201],[2400,200]]` returns 200 bpm. Five isolated readings spread over 40 minutes are accepted as a sustained max.

**Remedy:** enforce adjacent timestamps, minimum uninterrupted coverage and a real ramp before promoting an observed maximum. Do not describe the result as validated solely because it is a flat sensor trace.

### SCI-08 — P2: substitute target uses working weight as a one-rep estimate

**Locations:** [src/brain/progression.ts:349](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/progression.ts#L349); [src/brain/substitute.ts:37-49](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/substitute.ts#L37-L49).

The caller passes `replacedLast.workKg`, while the callee scales that number by a research **1RM** ratio and inversely solves Epley to prescribe repetitions. The source set's rep count and effort are discarded. Two lifters who both used 60 kg but did 3 versus 10 reps get the same substitute target.

**Executed reproduction:** barbell bench working load 60 kg carried to dumbbell bench on the default kg rack returns 22.5 kg per hand for three reps. A 60 kg ×8 ideal-effort anchor has app e1RM 80 kg; applying its own 0.415 ratio gives a 33.2 kg per-hand estimated max, materially different from treating 24.9 kg as that max. Actual study comparisons were 1RM in 12 trained men, not individualized transfer guarantees. [Original study](https://www.tandfonline.com/doi/full/10.1080/02640414.2010.543916).

**Remedy:** pass a compatible, trustworthy estimated strength plus requested rep/effort target; choose the load for that target before snapping, or use the ratio only as a conservative same-rep working-load heuristic without pretending it is a max. Also use `menu.rungsKg` to choose a start; the current helper checks it is nonempty but snaps using `menu.profile`, ignoring learned rungs.

### SCI-09 — P2: plan evaluation and logged volume disagree about the same secondary work

**Locations:** [src/brain/plan.ts:75-86](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/plan.ts#L75-L86); [src/brain/exposure.ts:12-14,104-112](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/exposure.ts#L12-L14).

Plan evaluation uses the recovery/emphasis coefficient 0.55 for secondary sets; every logged weekly-volume view uses 0.5. The plan can be warned or blocked using a volume the app will never count after completion.

**Executed reproduction:** three weekly bench sessions, six sets each. Plan gives 9.9 secondary sets for triceps/front delts; logging it gives 9.0. At a band boundary this changes the verdict. Plan balance also sums muscle counts, whereas `trainingBalance` counts each exercise set once, so the two balance evaluators are not equivalent.

**Remedy:** use `SET_WEIGHT` or a shared weekly-volume evaluator and the same balance definitions in draft and actual history. Verify identical planned and completed programmes yield identical counts.

### SCI-10 — P2, evidence limitation: calorie bands imply precision not established for lifting

**Location:** [src/brain/energy.ts:27-35,55-75,85-90](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/energy.ts#L27-L35).

Keytel's heart-rate formula is integrated through an entire resistance session and displayed with a fixed ±25% band; any Health Connect source gets ±10%. The bands are arithmetic constants, not estimated confidence intervals or verified device error. Coverage is only sample presence and cannot establish that an exercise-energy equation is applicable.

[Keytel 2005](https://pubmed.ncbi.nlm.nih.gov/15966347/) studied 115 adults aged 18–45 during steady-state treadmill/cycle exercise. That does not establish these error bounds for intermittent resistance sets/rest, other ages or every Health Connect writer. A [2024 resistance-exercise energy review](https://pubmed.ncbi.nlm.nih.gov/38896201/) identifies substantial method limitations and anaerobic contributions.

**Remedy:** keep this explicitly a rough estimate, avoid presenting an unsupported uncertainty interval as accuracy, and validate by activity/device against a reference protocol before choosing numerical bounds. Treat original device values as source estimates, not guaranteed ±10% truth. This is an evidence issue, not a claim that every calculated calorie total is wrong.

### SCI-11 — P2, evidence limitation: deterministic heuristics are presented as measured physiology or causal facts

**Locations:** [src/data/recovery.ts](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/data/recovery.ts) (impulse, tau, age/damage constants); [src/brain/recovery.ts:304-308,377-400](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/recovery.ts#L304-L308); [src/brain/readiness.ts:76-87,295](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/readiness.ts#L76-L87); [src/brain/coach/rules.ts:219-220,269,584](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/coach/rules.ts#L219-L220); [src/brain/coach/weeklyReview.ts:67-71,323-331](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/coach/weeklyReview.ts#L67-L71).

The recovery percentage is a normalized exponential residual, not a validated measurement of muscle recovery. Its ±15% time band is hand selected; confidence becomes high after eight calibration changes. Readiness confidence is just the number of inputs, and trend confidence is just point count. No held-out prediction error, calibration plot or uncertainty model was located. Exact monthly strength expectations and lifetime-set-count levels likewise act as policies, not individual biological standards.

The prose overstates what those numbers can establish: a low score says hard training works against muscle growth; a `personalized` tau below 1 (learning faster recovery) can still emit that the user's history proves worse performance from retraining too soon. The code's 60% line does not establish either causal assertion. The [Morán-Navarro trial](https://pubmed.ncbi.nlm.nih.gov/28965198/) supports longer recovery after failure under its protocol, not the app's exact constants for every muscle/person.

**Remedy:** retain helpful coaching policies but describe their outputs as estimates and observations. Separate data completeness from empirically demonstrated predictive confidence. Validate prospective outcomes before claims of individualized accuracy or causal harm. Link every numerical product policy to either evidence or an explicit heuristic rationale.

## Additional lower-priority observations

- [src/brain/coach/weeklyReview.ts:55-58](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/coach/weeklyReview.ts#L55-L58) and [src/brain/coach/post.ts:43-46](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/coach/post.ts#L43-L46) read raw `effort` instead of `effortLabel`. A valid restored `kind:'failure'` set without an effort is max effort for recovery/history but is absent from failure-share insights. A 12-set fixture returns failureShare 0. Normal Train UI currently sets both fields, which limits exposure; normalize restored data or use the shared helper.
- [src/brain/coach/weeklyReview.ts:245](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/coach/weeklyReview.ts#L245) hardcodes failure share 0.5 and the rep-mix rule hardcodes 0.15; goal policies define different caps/minimums (0.3/0.4 and 0.4/0.25). The weekly review disagrees with post-session/goal-aware rules. Either centralize policy or explicitly document intentional different thresholds.
- [src/brain/coach/rules.ts](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/coach/rules.ts) effort-drift copy talks about the same work/load, but `effortDrift` never controls load/reps. A planned increase can be misrepresented as reduced recovery. Likewise `rirObservations` pairs different sessions and does not control fatigue/order; three pair combinations need not be three independent observations. These are cues to investigate, not verified personal calibration.
- `weightTrendPctPerWeek` anchors recency to the most recent weigh-in, not today. A months-old weight log can still produce a current weekly nutrition suggestion if exercise sessions are current. Add a freshness check.
- [src/data/knowledge.json](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/data/knowledge.json) stores paper titles/years without DOI/PMID/URLs or per-claim evidence notes. Several broad claims (session length, pain after 48h, balance and joint protection) need more precise sourcing and population limits. This is a provenance gap, not proof that each claim is false.

## Research fact-check and interpretation

| Area | Assessment | Primary/official source checked |
|---|---|---|
| Mifflin–St Jeor arithmetic | `10*kg+6.25*cm-5*age+5/-161` matches the published simplified equation. Birth year estimates age within about a year; personalized accuracy is not guaranteed. | [Mifflin et al., 1990](https://pubmed.ncbi.nlm.nih.gov/2305711/) |
| Max-HR age formula | `208-0.7*age` matches Tanaka. It is a population regression, not a measured individual maximum. Five-zone boundaries and observed-max decay remain product choices. | [Tanaka et al., 2001](https://pubmed.ncbi.nlm.nih.gov/11153730/) |
| Progressive loading, training specificity | Broad approach is compatible with guidelines. Exact thresholds, double confirmation, return cuts and load-menu policies are product heuristics. The knowledge library still primarily cites 2009 ACSM; update its evidence review to the 2026 position stand. | [ACSM 2009](https://pubmed.ncbi.nlm.nih.gov/19204579/), [ACSM 2026 official summary](https://acsm.org/resistance-training-guidelines-update-2026/), [official infographic](https://www.acsm.org/wp-content/uploads/2026/03/Resistance-Training-Position-Stand-infographic.pdf) |
| Failure/recovery | Failure can prolong recovery in tested protocols. Does not validate fixed 2× impulses, muscle factors, 90% ready threshold or the confidence ladder. | [Morán-Navarro et al., 2017](https://pubmed.ncbi.nlm.nih.gov/28965198/) |
| Sleep | Repeated short sleep should not be equated with sufficient sleep simply because it is normal for that user's recent records. | [AASM/SRS 2015 official consensus](https://aasm.org/resources/pdf/adultsleepdurationconsensus.pdf) |
| Resting HR/HRV and HR-guided rest | Useful within-person context, with measurement error and standardized collection. Peak HR similarity does not by itself establish similar RIR, and the app's exact 90%-of-peak mismatch rule is unvalidated. | [Buchheit 2014](https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2014.00073/full) |
| Calories | Formula has a genuine source but is extrapolated from steady-state aerobic work to intermittent lifting. Fixed ±25% and ±10% ranges are unsupported accuracy claims. | [Keytel 2005](https://pubmed.ncbi.nlm.nih.gov/15966347/), [Mitchell et al. 2024](https://pubmed.ncbi.nlm.nih.gov/38896201/) |
| Navy tape body fat | Metric density-equation structure is correct. Approximately 3–4 percentage points reflects population standard error in military data, not a guaranteed individual interval across every lab method. | [National Academies military validation chapter](https://www.ncbi.nlm.nih.gov/books/NBK235939/) |
| Exercise substitution ratios | 17% lower combined dumbbell 1RM in the bench experiment is correctly transcribed into 0.415 per hand; sample was 12 trained men. Generic movement-pattern/equipment transfer and user-specific predictions are assumptions. | [Saeterbakken et al. 2011](https://www.tandfonline.com/doi/full/10.1080/02640414.2010.543916) |
| Bodyweight fractions | [docs/F13-BODYWEIGHT-LOAD.md](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/docs/F13-BODYWEIGHT-LOAD.md) responsibly identifies pike/bench-dip and some lunge fractions as unverified/model-based. One fixed fraction cannot describe every incline, stance or geometry. Good for rough volume display; not an interchangeable measured kg stimulus. This pass did not revalidate each fraction experimentally. | Repo's per-fraction research ledger; no external whole-table validation claimed |
| How-to evidence | Source registries distinguish DATA, MECH, WEAK and coaching consensus, a useful separation. Eight guides are approved; 145 are pending. EMG papers cannot establish a unique safe joint angle or superior long-term growth. Spot-checked one bench cue source; full-text PMC access for two other sampled studies returned CAPTCHA, so those full texts were not independently verified in this pass. | [Snyder & Fry cue experiment](https://pubmed.ncbi.nlm.nih.gov/22076100/); code under `tools/plates/layers/exercises/*.howto.mjs` |

## Coverage and limits

Reviewed code in every `src/brain` module (balance, bodyweight, deload, e1rm, effort/bias, energy, exposure, fidelity, heart, history, onboarding, plan, progression, PRs, readiness, recovery, retarget, substitutes, trends, equipment/units, volume, weekly totals and coach cues/live/pre/post/rules/weekly review), exercise classification, core mass conversions, Navy body fat, goal/template/recovery/volume/muscle tables, knowledge-card claims, bodyweight/load-transfer specifications and sampled HowTo source registries. Inspected guards, modes, time windows, input completeness, plausible data and boundary examples.

Executed `audit-science-probe.ts` bundled with the repository's esbuild, outside the repository, at the exact audited commit. Its recorded reproductions are implementation-output tests, not clinical validation. No external paid coach API or live user health data used. Existing-suite results, performance checks and UI/native verification are reported separately above. The clinical/scientific literature was checked selectively at major formulas and decision boundaries; this is not a systematic review of every nutrition sentence, biomechanical posture or population. Numerical policies that appear intentional are called out as validation limits rather than falsely reported as transcription bugs.


## Screens, controls and workflow correctness


### UI-01 — P2: Skip today silently drops sets already logged

- Evidence: [src/slices/workout/Train.tsx:883](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/workout/Train.tsx#L883) allows Skip today on an entry with completed sets. [src/slices/workout/session.ts:526](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/workout/session.ts#L526) excludes the entire skipped entry from the saved session. The finish sheet instead says anything with logged sets is saved (`Train.tsx:469`) and its set/exercise counters include skipped work (`472-473`).
- Reproduce: start a split, enter and commit a set, choose its Options → Skip today, finish. The isolated probe committed 60 kg × 8, skipped that entry, then Finish returned null and history stayed empty. With other exercises logged, only the skipped exercise's work disappears.
- Impact: recorded work is lost and recovery/volume/history undercount it; the finish preview can disagree with the actual saved session.
- Remedy: keep performed sets when skipping the remainder; reserve removal for an explicit remove action, or clearly confirm deleting the already logged work and provide Undo. Compute finish counters from the exact saved projection.
- Verification: runtime probe, reproducible through the above UI callback chain.

### UI-02 — P2: Swipe-delete Undo restores a stale pre-edit session

- Evidence: the swipe effect in [src/slices/history/History.tsx:180-231](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/history/History.tsx#L180-L231) captures `session`, but its dependency at `:231` is only `[session.id]`. `SessionEditor.save` replaces the stored session at `:289`. Swiping later calls `deleteSessionWithUndo(session)` using the original captured object (`:224-226`); Undo inserts that object at `:44`.
- Reproduce: History → Edit a session's 60 kg set to 65 kg → Save → stay on History → swipe that same session left → Undo. The component remains keyed by the same session ID, so Undo restores 60 kg.
- Impact: Undo reverses a separate saved edit without warning.
- Remedy: capture the current session from state at deletion time, or refresh the handler when the session object changes; also protect delayed swipe animation callbacks from operating after component disposal.
- Verification: code path. This specific swipe sequence was not driven in the browser during this audit.

### UI-03 — P2: Past logging cannot enter the app's supported timed/carry modes

- Evidence: [src/slices/workout/Train.tsx:1127-1135](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/workout/Train.tsx#L1127-L1135) unconditionally renders load, reps and effort for every exercise. The live screen distinguishes duration at `:816-821` and provides conditioning distance/time at `:850-856`. `hasEntry` accepts duration or distance ([src/brain/exposure.ts:29-31](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/exposure.ts#L29-L31)), and the exercise picker explicitly creates duration and conditioning exercises (`ExercisePicker.tsx:58-59`).
- Reproduce: put Plank/a custom timed hold or a carry/sled into a split → Log a past session. There is no seconds/metres field. A 60-second plank cannot be entered faithfully; entering 60 as reps stores the wrong data and leaves duration progression without a measurement.
- Remedy: share a mode-aware set editor between live, retrospective and history workflows; persist duration/distance as those fields.
- Verification: code path. This is exposed for supported library/custom modes, not a hypothetical future feature.

### UI-04 — P2: History editor cannot correct carry distance and hides its load when a duration exists

- Evidence: [src/slices/history/History.tsx:306-307](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/history/History.tsx#L306-L307) chooses the entire edit layout solely from `st.durationSec != null`, not exercise mode. No control anywhere in SessionEditor writes `distanceM`. `setLabel` at `:266-267` returns seconds before considering distance or load.
- Reproduce: log a live carry of 32 kg, 40 m, 35 s. History shows only 35 s; Edit offers seconds and effort, with no load/distance correction. For a distance-only carry, Edit shows load/reps but still no distance. Setting reps to zero does not delete it because `hasEntry` still sees distance, contrary to the editor hint at `:314`.
- Remedy: present/correct all applicable conditioning fields and delete through an explicit action. Use the same measurement-aware formatter in History and share/stat views.
- Verification: code path; live carry persistence itself is already covered in [tests/session.test.ts:287-289](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/tests/session.test.ts#L287-L289).

### UI-05 — P2: Timing correction permits future completed workouts

- Evidence: `TimeQuestionSheet` validates only nonempty day/time and valid minutes ([src/slices/workout/Train.tsx:1062](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/workout/Train.tsx#L1062)); `resolveSessionTiming` validates finite date/positive duration but no upper date bound ([src/slices/workout/session.ts:582-608](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/workout/session.ts#L582-L608)). The past-session form separately rejects future starts at `Train.tsx:1101-1102`.
- Reproduce: rapidly fill a live workout so it triggers “When did you train?” → select a future date → Save. The runtime probe used 2027-01-01 while the clock was 2026-10-01; the function returned true and saved that future startedAt.
- Impact: completed workouts can disappear from current-period views, reorder history into the future and feed inconsistent recovery/training dates.
- Remedy: validate the full start/end interval in the shared mutation, constrain form date input, and apply the same rule to both entry paths. Invalid input must not close the correction sheet as if it saved.
- Verification: runtime mutation probe plus UI callback inspection.

### UI-06 — P2: Live unit controls can edit a different gym from the one on screen

- Evidence: live EntryCard resolves units using `s.active?.gymId` ([src/slices/workout/Train.tsx:587](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/workout/Train.tsx#L587)), but `flip` and `flipGroup` at `:658-659` omit gymId; suspect-fix at `:859` does the same. `setExerciseUnit` and `setEquipmentUnit` default to the global active gym ([src/slices/workout/units.ts:29,39](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/workout/units.ts#L29)). Settings → Gyms allows Make active during a live workout ([src/slices/settings/Gyms.tsx:35](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/settings/Gyms.tsx#L35)).
- Reproduce: start in gym A with a saved kg profile, visit Today → Settings → Gyms and make B active, return to Live, tap kg→lb. The field remains kg for session A, but B's profile is changed to lb. Long-press group changes and suspect-unit correction share the mismatch.
- Remedy: pass `effectiveGymId` through every live equipment mutation, or explicitly switch the session gym as one consistent operation.
- Verification: runtime probe confirmed A stayed kg and B became lb.

### UI-07 — P2: Ready muscle incorrectly says it is fully recovered now

- Evidence: [src/slices/body/Body.tsx:370](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/body/Body.tsx#L370) uses `!r.recovering` to show Full → Now. The model defines recovering as `<90%` ([src/brain/recovery.ts:393-397](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/recovery.ts#L393-L397)), whereas full recovery is 97% and `fullInHours` can remain positive.
- Reproduce: open a muscle between 90% and 96%. Runtime model fixture produced `{pct:90,recovering:false,fullInHours:31.8}`; MuscleDetail displays Full Now despite 31.8 hours to its model's full threshold. ReadyTimesCard uses the actual fullInHours, so two views disagree.
- Remedy: determine full status using FULL_PCT/actual fullInHours, and keep “Ready” and “Full” distinct throughout display.
- Verification: runtime model counterexample and direct rendering expression.

### UI-08 — P2: Onboarding shows Male selected but saves no sex unless tapped

- Evidence: [src/slices/profile/Onboarding.tsx:77](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/profile/Onboarding.tsx#L77) renders `s.profile.sex ?? 'male'`; only onChange writes sex. Save (`:65-68`) writes weight and marks onboarding complete; it does not commit the displayed default. Profile correctly renders undefined as unselected (`Profile.tsx:43`).
- Reproduce: fresh onboarding → enter 80 kg, 180 cm, birth year 1995 → leave visually selected Male untouched → Save → Settings → Profile. The browser check showed “3 of 4 details for the coach” and Sex “Not set.”
- Impact: user believes setup is complete but sex-dependent calculations remain unavailable/incomplete.
- Remedy: show no selected sex until explicitly chosen, or consistently persist an explicitly accepted default; avoid silently assuming a sensitive field.
- Verification: browser-confirmed on the audit build.

### UI-09 — P2: Several essential actions are pointer-only

- Evidence: `Card` is just a div ([src/ui/primitives.tsx:15-16](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/ui/primitives.tsx#L15-L16)). GoalSheet choices are click-only Cards ([src/slices/coach/Coach.tsx:120](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/coach/Coach.tsx#L120)), as are insight expansion (`:61`) and the weekly-review entry (`:224`). Exercise search results ([src/slices/workout/ExercisePicker.tsx:33](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/workout/ExercisePicker.tsx#L33)) and substitutes ([src/slices/workout/Train.tsx:952](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/workout/Train.tsx#L952)) are click-only divs. Watch device selection ([src/slices/settings/Watch.tsx:67](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/settings/Watch.tsx#L67)) is also a click-only Card. Unlike the shared `Row`, none has tabIndex/keyboard handling. Live reorder (`reorder.ts`) has pointer handlers only and no alternate Move controls.
- Reproduce: Tab through Add exercise or Training goal with a keyboard/switch interface. The choices are skipped; Enter cannot activate them. A visible button labeled Add in search is a span, not an actionable button.
- Remedy: use native buttons for choices or accessible Row controls; separate nested buttons from whole-card actions; provide explicit move up/down controls for reordering. Add browser keyboard tests for these named paths, not just CSS focus rings.
- Basis: [W3C WCAG 2.2 keyboard guidance](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) requires keyboard-equivalent functionality. This audit does not claim complete WCAG conformance testing.
- Verification: code path. App has good keyboard support in many other shared components, but these bypass it.

### UI-10 — P2: Crash reset's accessible click fallback is inverted

- Evidence: [src/app/ErrorBoundary.tsx:78-79](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/app/ErrorBoundary.tsx#L78-L79) calls armTap only for `e.detail !== 0`, contrary to the adjacent comment and the normal HoldButton implementation ([src/ui/primitives.tsx:434-438](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/ui/primitives.tsx#L434-L438), detail=0 handling). Assistive synthesized clicks carry detail=0.
- Reproduce: on a render-error screen, activate Hold to delete everything using a synthesized detail=0 activation. Neither first nor second click arms/confirms. The runtime probe found no setState for detail=0, but detail=1 did arm it.
- Impact: a user relying on synthesized activation loses the recovery path for data that crashes on every reload.
- Remedy: correct the predicate or reuse a shared tested activation state machine with the ordinary HoldButton. Test pointer hold, ordinary short click, keyboard and assistive synthesized click separately.
- Verification: runtime handler probe; no actual reset was executed.

### UI-11 — P2: Conditioning progress ignores distance/time, while timed statistics display load/reps

- Evidence: [src/slices/history/progressTrend.ts:11-13,21-25](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/history/progressTrend.ts#L11-L13) falls through to strength/volume for conditioning. [src/slices/history/History.tsx:479,507-509](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/history/History.tsx#L479) formats the readout and top stats as load × reps for every mode; [src/brain/bodyweight.ts:102](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/bodyweight.ts#L102) returns load/reps for all non-bodyweight/assisted modes.
- Reproduce: four 32 kg carry sessions of 20/40/60/80 metres, without reps. Runtime output is a flat `[32,32,32,32]` chart with unknown trend and zero usable points. For timed holds, the line does use seconds but the readout still says load × zero reps and “reps at top.”
- Impact: supported modes get missing/misleading progress feedback even with complete logs.
- Remedy: choose measurement and labels by mode; compare conditioning distance/time at comparable loads or explicitly mark it unsupported, rather than plotting a different metric. Use a seconds readout for holds.
- Verification: runtime carry fixture and direct timed-stat formatting path.

### UI-12 — P2: Insight details can prescribe a heavier target than the actual session permits

- Evidence: [src/slices/coach/Coach.tsx:143](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/coach/Coach.tsx#L143) calculates its “Next session” card with deload/equipment only. [src/slices/workout/Train.tsx:598](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/workout/Train.tsx#L598) includes today's readiness, muscle recovery and the live plan. Both use the same day and history.
- Reproduce: two recent bench sessions at 60 kg × 12 with ordinary effort, followed by a red-readiness day. Open an exercise-linked insight and then start the workout. An isolated fixture using those call-site contexts produced Insight = **62.5 kg, 3 sets**, Live = **60 kg, 2 sets**. Red-readiness safeguards are omitted in the insight path.
- Remedy: derive both views from one shared planned-target selector with the same readiness, recovery, equipment menu and override inputs. If a future-session baseline is intentionally shown, identify that distinct timing instead of presenting conflicting current-day advice.
- Verification: runtime algorithm fixture with the actual differing call-site inputs, plus code-path inspection.

## Secondary items and boundaries

- **P3 measurement formatting:** [src/ui/EffortBars.tsx:50-54](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/ui/EffortBars.tsx#L50-L54) formats every total >=10,000 as `t`, including data converted to lb. A 22,046 lb total becomes `22t`, with the footer adding lb. Formatter must know the unit; use kg→tonnes only, or k lb. This is a deterministic display defect but less urgent than record loss.
- **Unnamed form controls:** live reps/hold inputs (`Train.tsx:817,821`), history reps/duration/effort (`History.tsx:306-308`), schedule selects (`Coach.tsx:194`), and settings reminder time/style (`Settings.tsx:178-179`) have nearby text but no associated label or aria-label. WeightInput does have an accessible name. Add names including exercise/set/measurement and inspect TalkBack output. [W3C labels guidance](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html).
- **Potential stale derived state, not established:** `resolveSessionTiming` changes trainedAt/trainedEndAt and chronological order without rebuilding recoveryModel, unlike History edits (`History.tsx:36-37`). Do not assert a quantitatively wrong model until a fixture demonstrates a changed rebuild.
- How-to entry is present only for `hasHowTo` exercises. Current registry has eight approved guides and [src/slices/howto/sections/index.ts:16](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/howto/sections/index.ts#L16) is empty. Core plate callouts, Trace, Mistake and loading-failure paths were inspected; future layered sections and all 153 library movements were not represented as shipped UI.
- Body-fat formula/evidence assessed in the science section. The “within 3 to 4 points” line should be treated as a statistical estimate, not a guaranteed personal error bound.

## Control-family coverage

| Surface | Controls/functions traced | Result/limits |
|---|---|---|
| App shell/navigation | Five tabs, same-tab top, per-tab scroll memo, programmatic go, panel validation, native/dialog stack lifecycle, lazy Escobar mount, onboarding/error-report gate, toast and save/recovery banner | Code path reviewed. See verification evidence and native limitations above. |
| Today | Start/continue, off/undo/train anyway, Settings, Body/History/Coach links, week/streak/readiness/insight display | Callbacks resolve to common start/router/day-off mutations; the science section covers displayed model validity. |
| Train setup | Split tabs, templates/custom creation, name blur, sets ±, move up, remove/undo, focus chips, delete confirmation | Real callbacks traced. Split/name bounds and removal undo are explicit. |
| Gym management | Switch/add/rename/default kg/lb, make active/delete, equipment/exercise reset | Session-vs-global gym mismatch UI-06. |
| Exercise picker/substitutes | Search/exclude, custom name/equipment/mode/muscles/role, create/add/back, substitute | Modes are available; essential choice controls fail keyboard access UI-09. |
| Pre-session | Check-in ratings/soreness, Save/Skip/close, pre-session insight sheet, Start | Common requestStart pipeline used by Today and History. Readiness model covered in the science section. |
| Live workout | Pause/resume, elapsed time, finish, add/reorder/collapse exercises, kg/lb fields, reps/time/distance, Log planned, effort, set kinds, sets ± and Undo, warm-up log, notes, skip/restore/remove, substitute, done/undo-done, plate math, how-to | Core commit-once/rest and immutable IDs traced; record loss, gym mismatch, keyboard issues listed. |
| Rest banner | Timer/heart branch, freshness fallback, ±15, Skip/OK, pause, finish haptic, next-set hint, animation/space reservation | UI paths inspected. Science/native sections cover measured HR validity, Bluetooth and native alert delivery. |
| Finish/retro entry | Save just today/future, discard hold, missing-effort repair, time correction, I trained just now, past data form, Done/Share | UI-01,03,05 and secondary timing recalibration question. |
| History log/editor | Month arrows/swipe/day select, recent/selected-day cards, expand/Edit/Share, swipe/delete Undo, edit Save/Delete/Keep | UI-02 and UI-04; date cells also lack full date/selected-state accessible names. |
| History stats | Log/Stats segment, exercise selection, weekly chart, scrub/readout, effort bars, records, share | UI-11 and P3 lb/tonne formatting. Source algorithms audited separately. |
| Body | Recovery/week/levels, map/row/chip open, ready-time tile/detail, muscle logged/try-next, Add to live, Mark fresh, Ask Escobar, body-fat form/unit conversion/save | UI-07; the science section covers Mark fresh/soreness interaction and body-fat claims. |
| Coach | Insight expand/Helpful/Not now/Undo/Show again, goal/rest/templates, schedule/manual/quick arrange, review/dismiss, lighter-week accept, another tip | Actions have mutation callbacks; keyboard choice defects UI-09; omitted target context demonstrated in UI-12. |
| Profile/onboarding | Intro/form/review/skip/close/save, weight typo confirm/cancel, height/year commit, sex, training month/new, planned days, goal | UI-08; note optional onboarding fields can remain incomplete by design. |
| Settings | Theme, unit, rest, spark, reminder controls, motion/haptics/keep-awake/test, profile open, health/watch/diagnostic, backup/restore/export/rescue/reset, privacy/error-report controls | UI callbacks traced. Security/native sections cover serialized-data restore correctness, reset privacy and native permissions. |
| Share | Period, carousel/style dots, formats, photo/remove, Save/Share, busy/empty handling, SVG URLs/PNG warm cache, comparison seen flags, lazy import failure/reload | Boundaries and failures traced; no external sharing invoked. The original CI gate supplies visual/export evidence. |
| How-to | Lazy registry load, generated normal/mistake insertion, callout selection, Trace, Mistake, restore/snapshot/zoom interface, close and failure/reload | Eight guides shipped. Golden content is repository-generated; trust boundaries covered in the security review. |
| Shared primitives/theme | Buttons/chips/rows/segments/toggle, native dialog/focus/drag/back, toasts/pause/swipe/Undo, number commit, hold confirmation, weight input, motion preference, theme tokens/status bar, charts/maps | Normal primitives often supply keyboard/focus/reduced-motion affordances; bypasses and crash handler are listed. No comprehensive assistive-device/contrast certification performed. |

## Performance review

- Clock separation and per-field selectors correctly keep heavy recovery/readiness computations off the one-second live timer (`app/clock.ts`, `app/selectors.ts:31-46`). Measured performance-suite results are given above.
- History renders 30 recent session cards and charts limit visible history to 12; share rasterizes only the settled card with a one-card cache and revokes preview blob URLs; How-to and share are lazy chunks. These reduce visible work.
- EntryCard memo dependencies include the whole edited entry (`Train.tsx:593`), so each keystroke reruns that card's target and history/record calculations. Before claiming device performance is satisfactory, profile typing with a large real-shaped history on Android; existing 600-session budgets measure algorithms, not input latency, layout, or GC.
- `heart.ts` calls rawSamples a ring but uses unbounded push; a very long forgotten active session and repeated whole-array filters deserve a bounded-buffer device test. No measured memory failure is asserted here.
- No live device, TalkBack hardware, background battery, GPU/jank, or live Bluetooth performance benchmark was run in this audit.

## Focused execution

Command from repository: `node node_modules/vitest/vitest.mjs run --config ../audit-ui-vitest.config.mts`.

Result: **7 / 7 synthetic proof assertions passed**, 34 ms test body (1.31 s total). Probes: skip-after-commit record loss; future timing acceptance; gym mismatch; crash synthesized-click rejection; 90%-ready/full-time discrepancy; conditioning distance ignored; mismatched insight/live readiness context. Files are outside the repository under `work/`, keeping audited app source unchanged. A direct browser check additionally confirmed UI-08. These probes do not establish full-regression, browser or build success; see the separate verification table.


## Android, heart capture and development portability

### NAT-01 — P2: a silent watch remains LIVE and can satisfy heart-guided rest with old samples

**Locations:** [native/watch/WatchBridgePlugin.java:196-227](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/native/watch/WatchBridgePlugin.java#L196-L227); [native/watch/WatchService.java:238-260](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/native/watch/WatchService.java#L238-L260); [src/native/watch.ts:52-66](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/native/watch.ts#L52-L66); [src/slices/workout/Train.tsx:489-503,1261-1272](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/workout/Train.tsx#L489-L503); [src/slices/workout/heart.ts:47-49](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/workout/heart.ts#L47-L49).

The native freshness calculation correctly uses elapsed time, but it is evaluated only when status is requested or an event is emitted. The client calls status once at startup and then trusts emitted status. If a connected sensor stops notifications without disconnecting, nothing schedules a transition from LIVE to DELAYED/STALE. Train and its heart-guided rest read that cached LIVE flag; recentLiveBpms returns the last three samples regardless of age or whether they belong to the current rest.

**Executed boundary probe:** a mocked native bridge supplied one LIVE status; after advancing the clock 120 seconds, the client remained LIVE and status had been read only once. Java source contains no periodic status timer for the silent-notification path. This reproduces the client defect; a physical BLE sensor was not used. Old low readings can qualify the next accessory rest once its minimum timer passes, even though no current recovery reading exists.

**Fix:** derive freshness from each reading's monotonic receipt age on a ticking clock, emit/poll stale transitions, and require samples from the current rest after the set. Preserve timer fallback when the stream is stale. Test no packets, contact lost, stopped broadcasts with a connected link, and reconnect/resume.

### NAT-02 — P2: pause does not pause heart capture or calorie attribution

**Locations:** [src/slices/workout/heart.ts:30-43,65-87](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/workout/heart.ts#L30-L43); [src/slices/workout/session.ts:97-99,155-164](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/workout/session.ts#L97-L99); [src/brain/energy.ts:59-75](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/energy.ts#L59-L75); [src/brain/heart.ts:137-159](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/heart.ts#L137-L159).

Capture tests only whether a session is active. It continues through `pausedAt`, using wall-clock offsets. Finished duration excludes pauses, but the retained series includes them. Zone duration counts every five-second sample; calorie integration spans the entire retained wall interval. The coverage ratio is capped at one, which hides the discrepancy.

**Executed reproduction through real session mutations:** start at 09:00; commit a set at 09:04; pause 09:05–09:55; resume and commit a final set at 09:59; finish at 10:00. A synthetic reading arrives every five seconds. `pauseSession`, `resumeSession`, `commitSet` and `finishSession(false)` save `durationSec:600`, `logging.mode:'live'`, `timingTrusted:true`, `heart.samples:720`, `energy.minutes:60`, zone seconds totaling `3600`, and coverage `1`. The final set prevents forgotten-Finish trimming from masking the bug. Thus the ten-minute active workout can carry an hour of heart-derived activity.

**Fix:** record/retain pause intervals and exclude those intervals consistently from capture, summary, energy integration and quality denominators; ensure gap-filling does not insert pause calories afterward. Keep a clearly defined wall/active time mapping so set timestamps remain correct. Test pause mid-set/rest, long pauses, multiple pauses, restart and corrected finish time.

### NAT-03 — P2: imported sleep and resting HR lose the meaning of their measurement window

**Locations:** [native/HealthConnectNativePlugin.java:285-317,332-344](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/native/HealthConnectNativePlugin.java#L285-L317); [src/native/health.ts:47-65,89-121](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/native/health.ts#L47-L65); [src/slices/settings/health.ts:16-30](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/settings/health.ts#L16-L30); [src/brain/readiness.ts:41-45,202-211](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/brain/readiness.ts#L41-L45).

The 48-hour sleep read selects only the record with the latest end, so a 30-minute afternoon nap replaces a seven-hour night's sleep as the readiness input. It measures the whole session interval and ignores any awake stages. The Android API explicitly permits awake stages within a sleep record ([official sleep-session documentation](https://developer.android.com/health-and-fitness/health-connect/features/sleep-sessions)). The correct aggregation policy needs to distinguish an overnight session, fragmented sleep and naps; summing overlapping writers without deduplication is also not a correct repair.

Resting HR similarly selects the latest value anywhere in 48 hours, but drops its `restingTime` when serializing. Mapping then assigns it to today's DailyHealth. With no new watch record, yesterday's reading can become a second independent-looking daily sample and alter the 7/28-day baselines. Sleep's end timestamp is retained, but readiness consumes sleepMinutes/day without using it to establish last-night eligibility.

**Reproduction from source:** supply 23:00–06:00 sleep plus 14:00–14:30 nap and sync after 14:30: the loop chooses 30 minutes. Sync on two consecutive mornings before any replacement resting-HR sample: the same timestamped native record is saved under both sync dates. These are deterministic source paths; no actual Health Connect database was written or read during the audit.

**Fix:** preserve source timestamp/record identity for resting HR; compute baselines from eligible distinct daily observations. Define a local sleep-day policy, exclude awake intervals where known, handle fragmented/overlapping sessions and naps explicitly, and propagate data age/coverage to readiness. Include midnight/timezone, delayed syncing, missing stages and duplicate-source fixtures.

### DEV-01 — P2: the advertised local commands do not work unchanged on Windows

**Locations:** [src/app/App.tsx:5-11](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/app/App.tsx#L5-L11); [src/slices/workout/Train.tsx:37](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/workout/Train.tsx#L37); [src/slices/coach/Coach.tsx](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/coach/Coach.tsx); [src/slices/coach/coach.ts](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/coach/coach.ts); [src/slices/profile/Profile.tsx](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/profile/Profile.tsx); [src/slices/profile/profile.ts](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/src/slices/profile/profile.ts); [package.json:11,20](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/package.json#L11); [tests/howto/content.test.ts:322,409-413](https://github.com/macdarenz-droid/M-arc/blob/168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd/tests/howto/content.test.ts#L322).

TypeScript/Vite try `.ts` before `.tsx`; on a case-insensitive filesystem an import ending `Coach` can match `coach.ts`, and `Profile` can match `profile.ts`. The unchanged checkout's typecheck reports TS1149/TS1261 and missing exports; Vite fails because INSIGHT_COLOR is resolved from coach.ts. Shell scripts also use POSIX-only `MARC_PERF=1` and `TZ=...` assignment syntax. Several tests treat a file URL's pathname as a platform path, producing `C:\C:\...` on Windows.

**Fix:** use distinct descriptive filenames for state/actions and views, use fileURLToPath for filesystem paths, and set test environment variables through a platform-neutral Node runner or supported equivalent. Add a Windows CI lane if Windows development is intended; otherwise document Linux as required. Linux production-build failure is **not** alleged: its exact-commit source/build gates passed.

For browser inspection only, this audit used an external Vite configuration selecting Coach.tsx and Profile.tsx explicitly. No checked-in source, test, gate or assertion was weakened to make the original workflow appear green.

## Remediation order and acceptance evidence

1. **Coach-off and cost controls:** fix SEC-01 and SEC-03 with realistic multi-step turns and concurrent quota admission. Prove that no new step starts after the coach is disabled and that the last allowed quota slot admits exactly one contender. Separately decide whether to improve the documented conversation-replay tradeoff described under SEC-02; it is not counted as a defect. Keep testing on mocked/staging providers until the owner authorizes paid calls.
2. **Trustworthy training outputs:** correct SCI-01/02 first, then consolidate readiness/recovery/target context across exercise modes and screens (SCI-03–09, UI-07/11/12, NAT-01–03). Add asymmetric assistance, chronic short sleep, current soreness, disconnected HR, pauses and plan-to-actual invariants. Keep evidence gaps separate from arithmetic repairs.
3. **Data and user actions:** address backup acceptance/boot invariants, reset epochs, skip/finish preservation, fresh Undo snapshots, mode-aware editing, future-time validation and gym identity. Test whole workflows as well as pure functions, including stale tabs and failures between persistence steps.
4. **Access and release quality:** repair keyboard/synthesized-click controls, name fields, fix PWA HTTP-error fallback, stabilize Windows tooling if supported, and update dev dependencies. Profile realistic older Android hardware and repeat the full gates on the final source/APK after fixes.

### Remaining device/production checks

These remain explicit validation work, not implied passes: Android 14+ Health Connect eligibility and permissions; real BLE silent-stream/reconnect behavior; background capture, process death and battery use; notification permission/exact-alarm refusal and reboot behavior; file-share/save cancellation and Android storage versions; actual TalkBack/keyboard navigation; storage-full and multi-tab IndexedDB recovery; production security headers and Worker configuration; provider caps; and real coach citation/claim quality using an approved test budget. No release or signing credential was inspected or changed.

A fix should carry a failing-before/passing-after regression that exercises the reported path. Existing screenshot equality, generic “no page error” checks, or a test that only restates the implementation are not substitutes for that proof.


## Repository inventory and evidence handling

Counts are tracked files at the audit checkout, including generated files/assets where applicable; they are an inventory, not a claim of line-by-line dynamic execution. Source tracing coverage is described in the preceding tables.

| Directory | Files | Scope |
|---|---:|---|
| `src/app/` | 8 | Shell, navigation and selectors |
| `src/brain/` | 29 | Training algorithms and coach rules |
| `src/core/` | 13 | Models, persistence and migration |
| `src/data/` | 12 | Exercise and policy data |
| `src/escobar/` | 48 | Online coach, tools, consent and UI |
| `src/errors/` | 8 | Error-reporting pipeline |
| `src/native/` | 10 | Web/native bridge wrappers |
| `src/slices/` | 41 | Screen workflows |
| `src/ui/` | 13 | Shared controls and styling |
| `src/theme/` | 2 | Theme engine/tokens |
| `src/howto/` | 13 | Guide definitions/registry |
| `native/` | 23 | Android Java, manifest and resources |
| `public/` | 5 | PWA/static assets |
| `escobar-worker/src/` | 15 | Paid-coach backend |
| `tests/` | 245 | App tests |
| `escobar-worker/test/` | 12 | Worker tests |

The audit's synthetic scripts and raw local logs were kept outside application source. Reproductions in this document name the actual functions, inputs, outputs and user steps; none uses private user values. The companion downloadable evidence archive supplied in the audit conversation contains the scripts, logs, source-resolution shim and browser proof. It is not part of the application bundle. Any future edit to this report should preserve the source SHA and distinguish new evidence from this snapshot.
