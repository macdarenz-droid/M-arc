# Remediation progress
Resume from this file and docs/REMEDIATION-PLAN.md. Never re-derive finished work.
Branch: claude/marc-r0-remediation-ast5xs (from claude/marc-regression-architecture-gegkbq, escobar 138edd6 merged) · Baseline: 589 app tests / 50 worker tests

## Owner answers
D1: done (R0.0, key 05:66:9A…F1:F5) · D2–D15: default

## Owner actions (collected; STOP once at the end)
- [ ] R0: dispatch "Deploy Escobar Worker", confirm /health quotas:true
- [ ] R0: if the deploy fails because Durable Objects are unavailable, run `npx wrangler kv namespace create QUOTA` and bind `QUOTA` in wrangler.toml
- [ ] R0.0: keep the encrypted key backup → add the new fingerprint in AppGallery Connect → backup, uninstall, reinstall, restore → delete SECRETS_WRITE_TOKEN and the `marc-debug-signing-v1` caches

## Phase R0 — done (agent side); owner deploy pending
### Layer: worker — done, commit f7c2ff6 — IDs: PL-01, PL-05, PL-06, PL-07, PL-12, PL-14
- QuotaCounter Durable Object (sync kv), quota.ts DO → KV → none, recordStep every step, RATE_IP, 413/byte checks, effort-only system messages refused, 48 KB system cap, policy sentence, abort on disconnect, one log line per step.
- PL-06: validate.test.ts and anthropic.test.ts assertions that accepted effort-only messages updated (they encoded the bug).
### Layer: CI — done, commit f863b6b — IDs: PL-11, PL-19/PL-02 (R0.8)
- deploy-worker.yml: push to main (paths filter kept) + workflow_dispatch; `npx --no-install wrangler deploy` with wrangler 4.136.3 pinned exactly in escobar-worker/package.json + lockfile; /health step fails unless protocol 2, key:true and quotas:true.
- release-apk.yml: MARC_ANDROID_* replaced by MARC_SIGNING_KEYSTORE_B64 / MARC_SIGNING_STORE_PASSWORD, alias `marc`, same EXPECTED_SHA256 assertion as build-apk.yml, keystore grep added. Signing step of build-apk.yml untouched.
- `wrangler deploy --dry-run` bundles and lists QUOTA_DO, RATE, RATE_IP (local check, no deploy).
### Layer: tests — done, commit 149e7e7 — worker 50 → 66
- New test/quota.test.ts: 5 concurrent DO adds sum exactly; alarm cleanup; scope mapping; DO → messages; tool_use step = steps 1 / turns 0; rotating device ids from one IP → 429 via RATE_IP; per-IP daily cap; one log line, no device id/content; health quotas:true.
- handler.test.ts: content-length 3_000_001 → 413 without reading the body or making the client; UTF-8 byte size; cancelled body aborts the model stream within 50 ms (mutation-checked: fails without the fix).
- validate.test.ts: effort-only refused; 48 KB system cap in bytes; cache_control on user text refused.
### Layer: gate — done
- `npm run check`: 589 passed · worker `npm ci && npm run check`: 66 passed · `npm run build && npm run gate`: PASS (5 themes, legacy import, escobar, palace).

### R0 report
- Built: QuotaCounter DO (sync kv, per UTC day, 3-day alarm cleanup) with KV fallback; RATE_IP; per-IP and global-output daily caps; every step recorded; abort on disconnect (enable_request_signal + writer.closed); 413 on content-length and UTF-8 bytes; effort-only system messages refused; 48 KB system cap; policy sentence; one log line per step; deploy on main + dispatch with wrangler 4.136.3 pinned and quotas:true health check; release-apk.yml on MARC_SIGNING_* with the fingerprint assertion.
- Tested: see layers above.
- Decided by research: DO with synchronous kv (no await between read and write); abort detection via writer.closed instead of waiting for the 10 s heartbeat; brief cap 48 KB (BRIEF_CAP 3000 chars × UTF-8 ≤ 12 KB, so 48 KB is the larger bound).
- Needs device check: Escobar chat still streams after deploy; a closed chat stops billing (watch `wrangler tail` for the step log with stop_reason null).
- Next dependency: R1 (store hardening) is independent of R0 and can start now. Two consecutive APKs signed 05:66… are produced by CI on this branch's push (build-apk.yml unchanged).
(skipped / not reproduced: none)

## Phase R1 — done
### Layer: core/store — done, commit 4f4cc86 — IDs: ST-01, ST-10, ST-11, ST-19, RG-02, ST-09
- Quarantine to `marc.state.v1.corrupt` (main) and `marc.state.v1.backup.corrupt` (backup, when source is fresh/legacy); `bootRecovered` signal; `rescueRaw()` / `deleteRescueCopy()`.
- persistNow: main write first, quota → drop backup + retry once; backup = previous good raw on the first save of each local day (`marc.state.v1.backupDay`), best-effort.
- `repairState()` exported (deep repair + dropped count); normalize = repair + fill + RG-02 lb backfill (raw has no `units`, lb user).
- storage listener for other tabs; toast when the local active session differs.
- convertLegacy: lb → lb gym (ST-09) and the same lb backfill (decided: v36 loads carry the same 0.25 kg rounding; the round-trip check makes it a no-op otherwise).
### Layer: app shell (crash containment) — done, commit ab5f71d — IDs: ST-02, RG-01, ST-15, ST-14, UI-05, ES-29
- index.html: `__marcBooted` gate, plain copy, "Save a copy of my data" (inline rescue, duplicated from src/core/rescue.ts on purpose), reset needs confirm().
- main.tsx: ErrorBoundary around App, booted flag, late error/rejection toast throttled to 10 s. New src/app/ErrorBoundary.tsx, src/core/rescue.ts.
- Lazy import catches: App EscobarMount, ui/open.ts, SettingsSection reset, Composer attach.
- router.validatePanelParams + showPanel refuses a panel without its required param; goTo validates view/seg; executor navigate keeps only view/seg/muscle/exerciseId/sessionId and rejects a bad muscle; MuscleDetail guards itself.
### Layer: settings + Escobar store listener — done, commit bcf1c04 — IDs: UI-06, UI-15, ST-21, RG-08, UI-14, ES-07, RG-15 (tests in the next layer)
- src/core/version.ts is the one APP_VERSION (Settings and escobar/session import it).
- src/slices/settings/backup.ts: buildBackup (schema 2, escobar, heart), parseBackup (v37 wrapper / bare state / legacy / error; repairState + dropped count; active kept only if under 12 h).
- Settings: confirm card before restore ("Replace N sessions … with M sessions from <date>?"), health reset, escobar + heart restore, Undo restores all three; cancelRestDone, haptics, resyncReminders after. Reset everything clears heart, images, marc.health.asked too. Rescue row: save rescue file / delete rescue copy.
- heartStore: read() plain-object check, restoreHeart sanitizes [number, number] pairs, clearHeart(); History delete removes the series and Undo restores it.
- escobar/store onStoreReplaced (clearStore, restoreEscobar); escobar/session subscribes: stops the loop, bumps `epoch`, reloads; a turn from an older epoch persists nothing.
### Layer: tests + gate — done — app 589 → 615
- New: tests/store.test.ts (quarantine survives 2 edits, backup throw → saveError null, quota retry, daily restore point, deep repair + dropped count, storage event without writing, other-tab toast, lb backfill 225 lb, kg/units unchanged), tests/backup.test.ts, tests/router.test.ts, tests/escobar/session-reset.test.ts (fails on the pre-fix session.ts).
- Extended: migrate (lb gym), escobar/executor (navigate keys, bad muscle hint).
- persistNow: after a quota retry the same save skips the restore-point write (found by the quota test).
- Gate (silent-black): post-boot rejection + throw → no crash screen; export → reset → restore round trip 27 → 0 → 27.

### R1 report
- Built: store quarantine + rescue file, daily restore point, deep repair, multi-tab sync, lb backfill, lb legacy gym; crash overlay rescue + boot gate, ErrorBoundary, late-error toast, lazy-import catches, panel param validation; version.ts, backup.ts (schema 2 with heart), confirmed restore with Undo, full reset, heart delete/undo, Escobar store-replaced listener with epoch.
- Tested: app `npm run check` 615 passed; worker 66 passed; gate PASS incl. round trip.
- Decided by research/judgement: two quarantine keys (main `.corrupt`, backup `.backup.corrupt`), rescue row downloads main first; legacy lb import also gets the lb backfill; restore confirm is an inline card like the existing reset confirm.
- Needs device check: rescue file download inside the Android WebView (ErrorBoundary uses the share sheet first; the pre-bundle overlay falls back to clipboard); restore file picker on Android.
- Next dependency: R2 (clock module) builds on R1's store test harness.
(skipped / not reproduced: none)

## Phase R2 — done
### Layer: clock and dates — done, commit d217c48 — IDs: ST-05, ST-06, ST-07, UI-03, UI-09, RG-06, RG-07, VX-02, ST-08, ST-16, ST-18, BR-15, BR-25, ES-25, UI-04
- New src/app/clock.ts: today, nowMs, minuteNow, refreshClock (tz signature → resetDayCache), always-on 60 s interval, ref-counted acquireTicker. setTicking deleted; selectors re-export; recovery/coachContext read minuteNow.
- main.tsx: visible → refreshClock + resyncReminders + syncAndStoreHealth; pageshow removed.
- dayKey passes day keys through; adherenceRate uses weekdayOf and skips an unfinished today; fidelity/session midnight_crossing on local days; restingHr addDays; energy age parseDay; apply.ts todayKey; Train fallback day via dayKey. formatTimeOfDay + formatLocalStamp; Settings/Coach/Profile hints local.
- `npm run test:tz` added (+ CI step in build-apk.yml and release-apk.yml). UTC-assuming tests fixed: heart Tanaka (local mid-year), fidelity midnight (local times), recovery soreness cap (dayKey). adherenceRate and energy-age tests pass after the code fix.
### Layer: session write paths — done, commit 5ef1ffb — IDs: UI-01, UI-31, RG-05, BR-29, UI-11, UI-24, UI-12, UI-19, R2.8
- Commit-once (status/at guard), addSet carries load/reps only, emptied committed set drops its commit; setRestEffort + Train effort button (UI-31).
- R2.8 ids: ActiveSession.id kept as Session.id, entry/set ids on every creation path, substitution = new entry id, status dropped at finish; normalize backfills ids for a loaded active only; setSetById / commitSetById({actionAt}) / removeEntryById, index functions wrap them.
- sortByStart in finish, logPastSession, resolveSessionTiming; daysSinceLastSession uses max day; post/rules sort before slice.
- deleteSplit keeps active; History editor: empty save → remove with Undo; rebuildRecoveryModel (linear: recent window + carried last summary; calibrateAfterSession got an optional prevSummary) on save/remove/undo.
- Paused rest: adjustRest changes pausedRemainingSec; startRest while paused stores it; resume keeps effort/preSetBpm.
- tests/reorder.test.ts updated for R2.8 (sets now carry ids) and now also asserts ids survive reorder.
### Layer: UI — done, commit b466dc0 — IDs: UI-13, UI-22, UI-27, UI-28, UI-17, UI-23
- src/core/parse.ts (parseLoad/Reps/DurationSec/Minutes; comma decimal; ranges). WeightInput type=text inputMode=decimal via parseLoad. Train reps/duration, History editor, TimeQuestion/PastSession durations use the parsers; Save disabled on missing day/time, bad duration, future past-session start; logPastSession null → toast.
- New CommitNumber primitive (local text, commit on blur/Enter, range-checked): Profile + Onboarding birth year (1900..now−10) and height (100..250).
- Split rename and gym rename commit on sheet close and Enter. Toast keeps onDismiss in a ref, deps [message, action]. Today Start → requestStart + go('train') (check-in/pre-session sheets). ≤380 px set-grid CSS.
### Layer: notifications — done, commit f022161 — IDs: UI-02, PL-09, RG-18 (test alert part)
- notifications.ts: cached exactOk from checkExactNotificationSetting (boot + resume); rest alert isExactNotification: exactOk; training reminders isExactNotification: false; requestExactAlarm only from a Settings tap. No USE_EXACT_ALARM.
- Settings → Reminders (native only): "Precise rest alerts" row when not granted; "Test rest alert (5 s)".
### Layer: performance — done, commit 0ccadfa — IDs: BR-23, UI-10, BR-32
- recovery: systemicFactor memoised per day inside sessionMuscleDoses; muscleDoses() + recoveryAt() exported, recoveryStatus = recoveryAt(muscleDoses()); readinessSeries builds doses once.
- history: exerciseHistory cached per (sessions array, custom array, id) in WeakMaps; returns a copy.
- Train: LiveClock is the only nowMs reader on the live screen; EntryCard memoises suggestNext, best, autoreg, priorE1rm and per-set prev/PR (deps: sessions, custom, units, goal, gym, entry, today, readiness, deload, recoveryPct; never profile).
- rules week-grade: sessions.length === 0 check without weekSummary.
### Layer: tests + gate — done — app 615 → 641 (also under TZ=America/New_York and Asia/Manila)
- New: tests/clock.test.ts (refcount, 30 ticks → recovery once, minute interval without ticker, TZ change + refresh; the TZ test fails with a no-op resetDayCache), tests/session.test.ts (commit-once, draft on empty, addSet carry, R2.8 ids/substitution/commitSetById/actionAt/backfill, sorted resolve/logPast, deleteSplit keeps active, order-independent rebuild, paused rest, perf), tests/parse.test.ts, tests/notifications.test.ts (mocked plugin).
- Perf (this container, median of 5 after warm-up, 600 sessions): recoveryStatus 42 ms (budget 60), coachInsights 51 ms (budget 150), rebuildRecoveryModel 249 ms (budget 500). Needed: systemicFactor gets a 28-day session window (+2-day margins); calibration asks recovery for pct only (`pctOnly`).
- Gate: `.set-grid input` selectors (load input is text now); rest clock still ticks on Today after a commit; 360 px live screen with 102.5 typed: input not clipped and page not wider than 360. Found and fixed: at ≤380 px the exercise card's button row forced the page to 387 px (row wraps now; grid columns minmax(0, …)).

### R2 report
- Built: clock module + resume refresh; time-zone-safe day keys and local time hints; TZ matrix in CI; commit-once sets and stable live ids with id-based mutators; sorted history everywhere; recovery rebuild on history edits; paused-rest fixes; input parsers and text load entry; commit-on-blur profile fields; rename commits; toast timer; Today start via check-in; exact-alarm handling with Settings row and test alert; perf (dose reuse, per-day systemic factor, history cache, isolated live clock, memoised entry cards); narrow-phone layout.
- Tested: `npm run check` 641; `npm run test:tz` 641 × 2; worker 66; gate PASS.
- Decided by research/judgement: rebuild uses a recent window plus carried last summaries (linear) and finish uses the same window, so live and rebuilt models agree on the recovery prediction; `pctOnly` for calibration; history cache returns copies.
- Needs device check: exact-alarm flow on Android 14+ (Allow row, test alert while locked); comma-decimal entry on the Android keyboard; 360 px phones.
- Next dependency: R3 (coach numbers) reads the new clock/selectors.
(skipped / not reproduced: none)

## Phase R3 — done
### Layer: brain — done, commits efd7e36, 7cfbd73, b94c159, d30da88 — IDs: BR-01, BR-02, BR-03, BR-19, BR-05, BR-06, BR-04, BR-27, BR-07, BR-16, BR-17, D9, BR-08, BR-09, BR-10, BR-11, BR-12, BR-13, BR-14, BR-22, BR-18, BR-20, BR-21, BR-26, BR-31, BR-24, BR-28
### Layer: UI and Escobar wiring — done — IDs: ST-12, ST-13, ST-17, UI-18, RG-09 (+ Train/Escobar call sites for BR-08/BR-09, History for BR-22/BR-28)
### Layer: tests + gate — done — app 641 → 681
- One test per row in the existing files, plus new tests/bodyfat, trend, muscles, exercises, cues (every cue reachable).
- Tests updated because they asserted a fixed bug: weeklyReview hardSetsThisWeek (easy counted half, BR-16); isStale gained a `today` argument (BR-04).
- Perf budgets moved to tests/perf and run alone (`MARC_PERF=1`, part of `npm test`): in the full parallel run recoveryStatus measured 53–58 ms against 60, i.e. contention, not the code (alone: 42 ms).
- Gate: onboarding weight selector (the field is text now). PASS.

### R3 report
- Built: the 21 rows of plan §R3 (see COACHING-DECISIONS.md "Remediation R3").
- Tested: `npm run check` 681 + 2 perf; `npm run test:tz` 681 × 2; worker 66; gate PASS.
- Decided by research/judgement: balance upper = mean of push and pull (the finding's own balanced fixture); plateau-lever's 6-session bar replaces the trend-confidence check; legacy import keeps name mapping via an equipment-agreeing partial match (all gate fixtures unchanged); reason-cue mapping from suggestion mode (reasonKeyFor).
- Needs device check: Body fat inches entry; lb body weight entry; mindset note on Today on an odd day.
- Next dependency: R4 (Escobar integrity) reads these brain outputs.
(skipped / not reproduced: none)
