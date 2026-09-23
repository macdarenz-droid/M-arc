# Remediation progress
Resume from this file and docs/REMEDIATION-PLAN.md. Never re-derive finished work.
Branch: claude/marc-r0-remediation-ast5xs (from claude/marc-regression-architecture-gegkbq, escobar 138edd6 merged) · Baseline: 589 app tests / 50 worker tests

## Owner answers
D1: done (R0.0, key 05:66:9A…F1:F5) · D2–D15: default

## Owner actions (collected; STOP once at the end)
- [x] R0 + R0.9 Worker deployed from main (PR #4 merge, run 35880696979 green; its /health step requires protocol 2, key, quotas and relay)
- [ ] R0.9 (PL-20): the affected user on the failing Wi-Fi opens https://marc-coach.mmarcdarenz.workers.dev/cdn-cgi/trace (expect colo=HKG) and sends Escobar a message
- [ ] R7.5 (D7): confirm, then move `legacy/v36/` to a tag and delete the folder
- [ ] R5: device checks listed under Phase R5
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

## R0 follow-ups (2026-09-23)
### CI perf budgets — done, commit cdffb8c
- CI run 35875534453 (older head, perf tests still in session.test.ts) failed rebuildRecoveryModel 539/500 and recoveryStatus 75/60. tests/perf-budget.ts times a fixed seeded 200k sort (median of 5; REFERENCE_MS 26 here); scale = max(1, measured/26); each budget asserts time < budget × scale and logs measured, scale and limit.
### R0.9 Upstream location (PL-20) — done
- src/upstreamRelay.ts `UpstreamRelay` DO (env.UPSTREAM.get(idFromName('us'), { locationHint: 'enam' })) runs the step and streams SSE back with an internal `_step` result; src/upstream.ts `localStep`/`relayStep`; the handler keeps validation, quotas, abort, retry, logging and uses the relay when bound. wrangler: UPSTREAM binding + migration v2 new_sqlite_classes ["UpstreamRelay"]. /health adds `relay`.
- mapError: 403 → `upstream_region` ("Escobar isn't available on this network right now. Try mobile data.", the plan's wording), 401 → `upstream_auth`; both pass `detail`. Upstream errors log `{requestId, code, detail, colo}`; the step line includes `colo`.
- App: `upstream_region` in transport ErrorCode and EscobarSheet's message map.
- deploy-worker.yml health check now also requires relay:true.
- Tests: worker 66 → 71 (relay path pinned to 'us'/'enam', no edge client; 403 via relay → upstream_region + detail + colo log; 401/403 split; disconnect aborts the relay's model stream < 50 ms); app transport test. Two exact-shape assertions gained the new `relay`/`colo` fields.

### How the Worker gets deployed
deploy-worker.yml runs on a push to `main` touching `escobar-worker/**`, or from "Run workflow". GitHub only shows "Run workflow" for a workflow that exists on the default branch, and `main` (245c26a) does not have this version. So:
1. Open a pull request from `claude/marc-r0-remediation-ast5xs` into `main` and merge it. The merge is a push to main that touches `escobar-worker/`, so "Deploy Escobar Worker" runs by itself (it needs the existing `CLOUDFLARE_API_TOKEN` secret, and `CLOUDFLARE_ACCOUNT_ID` if the token sees several accounts). It fails unless /health shows protocol 2, key, quotas and relay.
2. Without merging: on a computer, `cd escobar-worker && npm ci && CLOUDFLARE_API_TOKEN=… npx wrangler deploy` from this branch.
Pushing to `claude/escobar-v2-implementation-eidx64` would still deploy that branch's older Worker (its own workflow), without the relay: don't use it for this.

## Phase R4 — done
### Layer: apply/undo — done — IDs: ES-03, ES-04, ES-05, ES-02
- Undo is a targeted inverse per kind (table in plan §R4.1); `active` is never restored; an inverse that can no longer apply throws UndoUnavailable → "Undo is no longer available." and nothing is recorded. Undo map keyed `${conversationId}:${proposalId}`; `appliedAt` stored; `undoOpen()` = applied < 8 s ago and an inverse exists; ProposalCard hides Undo after the window (timer re-render).
- Live-session guards: programme replace and deleting the trained split are ToolErrors; fingerprints include the active split; the programme applier refuses while a session runs (no more `active: null`).
- Today override: `plannedExercises(split, override)` applies swap/remove/add/sets/load at startSession and in the Train preview; entries carry `loadFactor` into suggestNext; finishSession clears it. Step 1 (disable, then re-enable) was folded into this single push since nothing ships between the two.
- ProfileChange.source gains 'escobar' (used by the appliers).
### Layer: session and loop ownership — done — IDs: ES-06, ES-09, ES-10, ES-20, ES-11, ES-08, ES-17, ES-30 (toast), ES-31
- session: loop callbacks touch signals only while their loop is active (others save quietly, same epoch only); resetConversations bumps epoch; busy guard returns 'Escobar is still answering.' and keeps the text as the draft; after send, signals only if the loop is still current.
- loop: a new send aborts a running one; only the latest send sets idle; controller cleared only if still ours; notSent = !userCommitted; an unfinished repair renders the first answer with its unverified marks; decisions recorded during a turn stay queued.
- online: back-off only (60 s), done/refusal/step_limit/cut_off set online; checkOnline reschedules after the back-off; window 'online' clears it; health needs key:true ("Escobar isn't set up yet.").
- plan mode: isPlanRequest (word-bounded regex) in ui/prompts.ts; plan sticks per conversation; live wins in a session.
- memory: eviction skips injury/equipment/agreement; executor throws 'memory is full' when nothing can go; ids are time + random.
- tests/escobar/transport health fixture gains key:true (ES-08 changed the contract).
### Layer: privacy and limits — done — IDs: ES-12, ES-23, ES-13, ES-14, ES-16, ES-11 (render), ES-32 (pending expiry, months)
- context.redactDrivers (resting HR / HRV / sleep drivers) in get_readiness and show readiness_gauge; explainMethod drops health keys (restingHr*, healthDaysLogged, zone*FromBpm, non-Tanaka hrMax) and body keys (restingKcalPerDay) when sharing is off; toRequestMessages replays get_health / get_heart_session / show heart_session (health off) and get_body / show body_trend (body off) as denied.
- brief `one()` (single line, no ⟦⟧, ≤140) on every name, reason, title and memory; actions strip newlines from reasons; months rounded; expired proposals are not pending.
- Photos: Composer 2 per message; at most the 2 newest unsent photos inline per request; decisions log line fixed (D3).
- History window: estimated on the request form, keeps cutting at clean user turns until it fits (≤ 60k est. tokens, ≤ 400 entries); a trim forces a full brief. The existing window test's data was resized (ES-16 re-checks after the cut) and a new test covers repeated trimming.
- Verification: sentences drop leading list markers (both sides); the chips directive is removed before grounding; new CRISIS pattern (plan §R4.8).
### Layer: tools — done, commit c758e76 — IDs: ES-01, ES-15, ES-21, BR-18
- capJson `{ dropFrom }`; get_exercise_history newest first (schema + tools.generated.json regenerated); get_body drops from the start.
- lift_trend: first/last/best over the whole window, 12 points spread evenly (`sampleEvenly`).
- `progressionCtxFor(ctx, exerciseId, gymId?)` → readiness, recoveryPct, deload, equipment, loadFactor; used by get_next_target, get_live_session (autoregulation gets equipment for weighted lifts), get_equipment and show exercise_card.
### Layer: store, search, constants — done — IDs: ES-18, ES-30, ES-32
- fitToBudget never drops the active conversation: `trimOldest` cuts at the first plain user message after the midpoint, sets `trimmed`, shifts rollingSummary.upTo.
- Word-bounded keyword/title matching in palace/registry and knowledge/cards.
- explain_method constants come from the brain: E1RM_MAX_REPS / E1RM_FULL_WEIGHT_REPS, BIAS_MIN_OBSERVATIONS / BIAS_CAP_REPS, READINESS_CALIBRATING_DAYS, DELOAD_TRIGGER. The effort-calibration copy no longer claims the bias changes strength estimates (it doesn't, per the plan).
### Layer: UI — done — IDs: ES-22, ES-26, ES-27, ES-28, RG-03
- Proactive toggle hidden. Pinned cards on Today via ShowComponent (lazy chunk, only when pins exist), `until >= today`, Unpin. MemoryScreen (delete per item, Forget everything with confirm) replaces MemoryPlaceholder. ShowComponent memoised. Citation popover ignores taps inside itself. images.ts: one memoised IndexedDB handle (reset on failure/close); sent photos leave memory (`imagesSent` dep).
- R4.11: first enable imports `coach.askThread` as "Earlier conversation" (text only, leading assistant turns dropped, same-role turns merged) and sets legacyImported.
### Layer: tests — done — app 684 → 736
- New: tests/escobar/session.test.ts (5), apply.test.ts (7), privacy.test.ts (3). Extended: verify (30-phrase crisis table), read (newest first under the cap, capJson ends), show (52-week lift_trend, sampleEvenly), store (active trim, trimOldest, carry-over), palace and knowledge (whole-word matching), loop (sent photos evicted), knowledge (constants equal the brain's).
- The phrase table found 'self-harming' missed by the plan's CRISIS (`self[- ]?harm\b`); now `self[- ]?harm\w*`.
### Layer: gate — done
- Screenshot gate: Apply → Undo within the window ("Undone"); in a second theme Undo is gone after 8 s.
- `npm run check`: 736 passed (+ perf 3) · `npm run test:tz`: 736 × 3 zones · worker `npm ci && npm run check`: 71 passed · `npm run build && npm run gate`: PASS.

## Phase R5 — done (agent side); device checks pending
### Layer: native Java — commits f96f91c, 1st R5 native commit — IDs: PL-03, PL-04, VX-01, PL-08, PL-13, PL-15, PL-10, PL-16, RG-20 (D2)
- Health Connect: results delivered on `callbackExecutor` (cached pool), never on the single `executor` blocked on the latch; today's steps and active calories from two aggregates (local midnight → now), kcal = small calories / 1000; sleep/HR stay on the 48 h read; diagnose total in kcal.
- WatchBridge: startScan/stopScan/connect/disconnect/status/diagnostics run on the main thread; `DeviceScanner.scanning` volatile; one `watchDevices { devices }` event, throttled to 500 ms with a trailing emit; status emitted after the scan starts. WatchService: SecurityException / IllegalStateException on the FGS start → state `paused` with a reason.
- Rationale text (PL-10, "M/ARC", backup sentence per D2). patch_manifest enforces attributes on existing entries (idempotent, checked on a pre-seeded manifest); allowBackup left at default (D2).
### Layer: TS bridges — commit ad7e1b1 — IDs: VX-01, UI-16, ST-16, PL-04, PL-13, UI-21, UI-08, research (back, safe area)
- health.ts: kcalGuard (also heals stored healthDays and health.activeCalories on load), all-granted-failed → null, `lastHealthError`, `syncHealth({ prompt })` (only Settings prompts); `backgroundHealthSync` on cold start, resume and session start: connected only, 10-min throttle.
- watch.ts: `watchDevices` batch (old per-device event kept one release), `watchDiagnostics`, state `paused`. heart.ts: dedupe by receivedAtEpochMs, `state.peek().active`, time base = active.startedAt (sessionStartMs removed).
- Back: `ui/sheetStack.ts` (Sheet registers its onClose; `openSheets` derived), web history entries per sheet with popstate close and `go()` unwinding them first; `native/back.ts` Escobar → sheet → panel → Today → minimise, via `@capacitor/app` 8.1.1.
- Safe area: every inset is `var(--safe-area-inset-X, env(safe-area-inset-X, 0px))`; SystemBars style from the theme bg luminance (paper → light bars).
### Layer: UI — IDs: UI-07, UI-08, UI-16, RG-18, ST-03, ST-04, ST-20, ST-25
- Watch sheet: scanning from the plugin state (local flag reset in `finally`), empty result and permission hints, Forget watch whenever an address is saved, Copy watch diagnostics. Settings: Connect/Sync prompt, "Last sync failed → Details" opens the Health diagnostic sheet (permission, missing, failed, values, Open permissions).
- Found while building the gate: the PWA never registered its service worker, because `@capacitor/core` defines `window.Capacitor` on the web too; `main.tsx` now uses `isNative()`. Cache lookups use `ignoreVary` (module scripts carry Origin; `Vary: Origin` hid the installed bundle offline).
- sw.js: navigations network-first (cached under the URL and index.html), other GETs cache-first and kept only when ok+basic, failures are Response.error(); ASSETS stamped by sw-version.mjs (fails without the marker); activate carries /assets/ into the new cache. "App updated · Reload" toast on controllerchange unless a session runs. index.html: first-paint colours per theme, id validated, no maximum-scale. Manifest id "./".
### Layer: CI — IDs: RG-20, PL-16, research
- Both workflows: dex check for HealthConnectNativePlugin and WatchBridgePlugin before signing, targetSdk/compileSdk ≥ 36, `"@capacitor/app"` in the plugin list, sw.js stamped. Signing steps untouched; agent guard passes.
### Layer: tests — app 736 → 755
- health-bridge (kcal guard, all-failed null, prompt:false never requests, stored values healed), watch (batch), heart-capture (dedupe, peek, restart time base), back (order), theme (index.html colours = THEMES, no maximum-scale, bar style).
- Gate: offline reload renders; "build B" (new cache, old Escobar chunk deleted from the server) still opens Escobar in the old tab.
### Needs device check (owner)
- Health Connect numbers vs the Health Connect app (steps, active kcal); no 20 s stall on sync.
- Watch scan/connect stress; FGS start with Bluetooth denied shows "paused".
- Back gesture on 3-button and gesture navigation; edge-to-edge bars on Android 15/16 per theme.
### Layer: gate — done
- `npm run check`: 755 passed · worker 71 passed · `npm run build && npm run gate`: PASS (incl. service worker offline reload and build-B carry-over).

## Phase R6 — done (agent side)
### Layer: data model — IDs: RG-04 (D5), RG-19 (D4), F1, F2, F5
- `LoggedSet.kind` ('warmup' | 'drop' | 'failure'); `LoggedExercise.note`, `Session.note`, active entry `note`; `AppState.exerciseNotes` (≤ 200 chars, normalize `{}`), `daysOff` (valid, unique, sorted, ≤ 400, normalize `[]`), `lastBackupAt`; `Preferences.backupReminder`.
- 30 phase-9 exercises appended to exercises.json (153 total); DURATION_NAMES / CONDITIONING_NAMES ported verbatim.
### Layer: brain — IDs: F2, RG-19, RG-17
- `hasEntry` (filled in) decides what is kept and committed: `finishSession`, `commitSet` (a warm-up commits but never starts auto-rest), the un-commit check, `logPastSession`, the History editor, CSV. `isWorkingSet = hasEntry && kind !== 'warmup'` stays for counting (exposure, volume, recovery, e1RM, records, progression, weekly review, coach rules, Train/Coach counters, Escobar tools). `effortLabel`: failure = max (exposure, recovery, summaries). Records drop `drop` sets (both sides). Template save counts non-warm-up sets; suggestNext plans non-warm-up sets.
- Days off: `trainingStreak(…, daysOff)`, `adherenceRate(…, daysOff)`, `plannedThisWeek(schedule, daysOff, today)` as weekSummary's target (selectors, History, Escobar read/show/brief); training reminders skip days off.
- `sessionsToCsv(sessions, unit, from, to)` (RFC 4180, `setLoadIn`, exercise note on its first set, session note as its own row). Escobar get_exercise_history carries `setupNote`.
### Layer: UI — IDs: RG-17, RG-19, UI-20, F1, F2, F5, F8, F9
- Settings → Your data: Export CSV (90 days / all), "Last backup: N days ago" (stamped on export), Weekly backup reminder (native; Sunday 19:00, inexact, id 880101, tap opens Settings at Your data; taps route by `extra.type`).
- Today: "Take today off" (toast Undo) and a Day off state with Train anyway / Undo.
- Live card: setup note under the name (edit in Options, plus today's note), set-number button opens Normal / warm-up / drop / to failure, Log warm-ups in the warm-up disclosure, conditioning distance (1–1000 m) and seconds inputs. Finish: effort repair (≤ 12 unrated working sets, Skip) and a session note.
- History: session and exercise notes, setup note, W/D/F tags; Stats: 12-week volume bars in the display unit.
### Layer: tests — app 755 → 769
- exposure (kinds, warm-ups add no weekly sets), prs (warm-up/drop never a record), e1rm (warm-up ignored, failure = max), session (2 warm-ups + 3 working = 5 stored / 3 counted, no rest on warm-up, notes, farmer's carry distance), r6-features (CSV rows/quoting/filter, days off in streak/adherence/target, normalize, library modes, notes).
### Layer: gate — done
- Screenshot gate: day-off state on Today, setup note under the exercise name, logged warm-ups (W) in the live card, CSV row in Settings; page width checked. `npm run check`: 769 passed · worker 71 · `npm run build && npm run gate`: PASS.

## Phase R7 — done (agent side)
### Layer: deletions — commit 1aea4ca — IDs: ST-22, RG-13, BR-30, ES-24, UI-32, PL-15
- Removed after `grep -rnw` showed zero callers: store computeds, `hoursSince`, `withinDaysOfSession`/`withinDays`, `energyFromWatch`, `pickEnergy`, `dailyActiveKcal`, `weeklyEnergy`, `e1rmWeight`, `isRealChange` (and their tests: 769 → 760), `brain/index.ts`, `Bar`, `Ring` + `.ring`, `IconClock/Spark/Moon/Heart`, `REST_STEP`, `profile.setName`, `show.weeklyTotals`, `read.weeklySetsFor/e1rmOf`, `actions.equipmentGroupOf`, `context.plannedPerWeek/displayUnit`, `selectors.plannedPerWeek`, worker `MODE_ADDENDUM`, Java `LiveSession` average/min/max/total/lastReceivedAt, `batteryReceivedAt`, `HealthConnectNativePlugin.diagnose` (R5 uses `lastHealthError`), `.watch-pill .dot.live`. The watch branch uses none of them. Kept `energyFromHealthConnect`, `isDuplicateSession`, `retroSessionLogging`.
- `loadImage` is now used: sent-photo thumbnails load from IndexedDB (the R4 eviction had left them as a "Photo" placeholder). explain_method no longer claims 7–10 rep sets weigh half.
### Layer: dedupe — commits 81a3ad2, prepare-android — IDs: ST-23, RG-16, ES-24, RG-12, UI-29
- `DAMAGE_*` from data/recovery; `DirectiveBuffer` in the loop; `titleFrom()` and `withPendingDecision()` shared by loop/store/apply; RestBanner on `restRemainingSec`; `native/filePicker.ts` (null on cancel) for backups and photos; `core/sessionLogging.ts` (re-exported by brain/fidelity); `APP_VERSION = __APP_VERSION__` from package.json via Vite `define` and `scripts/build-convert.mjs` (the converter imports it too); version 37.1.0 (D13); esbuild a direct devDependency; `scripts/**/*.ts` in tsconfig.
- `scripts/prepare-android.sh` generates the Android project for both workflows (the release icon background had drifted to #06131B).
### Layer: CI and gate — IDs: PL-17, PL-18, RG-14
- Release: version name `<package.json>.<run>`, code `major × 1,000,000 + run`; a green "M/ARC gate" run on the SHA is required (`actions: read`, `gh run list`), else the gate runs in the release job; action majors aligned up (checkout@v6, setup-node@v6, setup-java@v5; agent-guard.yml is the supervisor's and keeps checkout@v4). CI on the R5/R6 pushes failed because the new dex check ran before "Build debug APK"; fixed by moving it after the build.
- Gate: local-date fixtures, `visible()` (locator.waitFor, 5 s) for every "should appear" check, one retry of the 150 ms first-feedback check on a fresh page, console errors fail the pulse pass; CI runs the gate a second time with `TZ=Pacific/Auckland`.
- Adaptive icon: `render-logo.mjs --android` renders the padded foreground (mark inside the 66/108 safe zone) and a monochrome layer per density into `native/res/`, with `mipmap-anydpi-v26` XML; `prepare-android.sh` copies them.
### Layer: copy, a11y, hooks — IDs: UI-25, RG-10, UI-26, UI-30, ST-24
- Editor hint and `k lb` volume for lb users; `HeartBpm` role=img; RestBanner announces "Rest done" once through a polite live region; `Row` activates on Enter/Space; `Segmented` sets `aria-selected`; effort buttons get a 44 px tall hit area (sideways it stops at the 4 px gap); `WeeklyReviewCard` calls its hook before returning. ST-24: lb display stays at 0.1 (decision).
### Layer: docs — RG-11
- README and docs/ARCHITECTURE.md rewritten to match the code (layers incl. escobar/, escobar-worker/, assets/; impulse-response recovery; 2.5 % records with effort-aware Epley; progression inputs; the full AppState key list and side stores; workflows on every branch).

## QA fixes (docs/qa/LIVE-QA.md on claude/marc-regression-architecture-gegkbq, 104 items; section W is the watch agent's)
Order: high → medium → low. Each fix has a test that fails before and passes after.

### QA-R0-1, QA-R0-2 (HIGH), QA-R0-3, QA-R0-4, QA-R0-5 — Worker. **Live only after the owner merges to main** (deploy-worker.yml)
- Every billed step is recorded: finished, refused (the API's own output count), and cut short by a hang-up, a timeout or a mid-stream error (output estimated from what was streamed). An error before any output is not billed and not counted. A step with no final message ends the turn.
- The per-IP daily cap now counts steps as well as turns (`MAX_STEPS_PER_IP`, default 1500), so tool-call-only turns from rotating device ids stop.
- IPv6 callers are keyed by their /64 for RATE_IP and the daily IP counters.
- A body without content-length is read in chunks and refused as soon as it passes 3 MB (no second TextEncoder copy).
- The relay spreads turns over 8 objects (`us-0`…`us-7`, all `enam`) by device, instead of one.
- Tests updated for the new contract (not loosened): the IP row now carries `steps`; the relay test expects the device's shard name.
- Not changed, by decision: requests with no Origin and self-minted device ids (QA-R0-1 part 3). The plan drops signed device ids (D15); the IP /64 key and the steps cap are what limit rotation.
### QA-R1-1, QA-R1-2, QA-R1-3 (medium)
- Quarantine with storage full moves the unreadable raw (removes the source key first, then writes the `.corrupt` copy), so boot is flagged and the data survives.
- `repairState` needs a session start time: a missing or malformed day is derived from it, and a session with neither is dropped (counted in `dropped`). Covers boot, restore and other-tab loads.
### QA-R2a-1, QA-R2a-2 (medium), QA-R6-13 (low)
- Health Connect part: already fixed by R5 (`backgroundHealthSync`: connected only, `prompt: false`, 10-min throttle). Notifications: `ensurePermission({ prompt })` only requests on a Settings tap (reminder controls, backup-reminder toggle); launch, resume, day-off and schedule edits only check. No more prompt on first launch either.
### QA-R2b-1 (medium)
- An emptied committed set is a draft while empty but keeps `at`, `restSec`, `fidelity` and `heart`; refilled, it is committed again with its original timing and rest is not restarted. The R2 session test that asserted the emptied set loses its time was updated for this contract (named in the test).
### QA-R2b-2, QA-R2b-4 (medium)
- Already fixed by R4.1 (c00fb27): split delete has a targeted inverse that never touches `active`, and deleting the split being trained is a ToolError. Regression test added for the QA scenario (fails at origin/main, where the applier snapshots `active`).
### QA-R2b-3, QA-R2b-5 (medium), QA-R2b-6 (low)
- finishSession predicts from the whole history again (one call, ~40 ms at 600 sessions), so it judges against the number the app showed.
- The rebuild's window covers the 28-day load ratio and layoff novelty (29 days, and at least F_ref sessions), anchors training age to the first session when none is set, and calibrates the sessions finishSession calibrates (everything but a session typed in afterwards: retro without `compressed`), including pre-logging `legacy` saves.
- `calibrateAfterSession` only runs the recovery prediction when some exercise has a max-effort comparison. Perf fixture rebuild: 34 ms (budget 500 ms, unchanged). Worst case measured: 600 sessions with every exercise at max effort, 0.7 s, only on a History save.
### QA-R2d-1 (medium)
- Recovery and readiness selectors read one computed per state field (`sessions`, `profile`, `healthDays`, …), so edits to the live session (a new `active`) leave them untouched and EntryCard's memos survive typing.
### QA-R3a-1, QA-R3a-5 (medium), QA-R3a-8 (low)
- 'under' needs the last two completed weeks to be full training weeks (3+ sessions, `FULL_WEEK_SESSIONS`) and both below the band. A first week, a first week back, or part weeks read 'in'. Two R3 volume tests that encoded the first-week 'under' were updated (named in the test) and a full-week case added.
- get_volume and volume_bars send `lastWeekSets` (and get_volume says what status is judged on). Body's this-week bar colours by this week's own count against the band.
### QA-R3a-2 (medium)
- `liftTrend(history, mode)` in brain/trend.ts: weighted uses the strength estimate, bodyweight best reps, duration longest hold, assisted the assistance load inverted. get_exercise_history and lift_trend pass the lift's mode to plateauStatus and use liftTrend.
### QA-R3a-3, QA-R3a-4 (medium)
- Upper = push + pull again (plan row 9), compared after dividing by `UPPER_PER_LOWER` (1.5): an even upper/lower split and a full-body week are both balanced; neglecting either region is still flagged. The shown ratio is the plain set ratio. COACHING-DECISIONS updated.
### QA-R3a-6, QA-R3a-7 (medium)
- `plateauStatus` looks only at sessions since the last break over 28 days (`sinceLastBreak`), so a comeback is not judged on months-old sessions (coach plateau notes and the deload trigger).
- The plateau lever needs its 6+ sessions to span at least 42 days of the 56 it looks at (`PLATEAU_MIN_SPAN_DAYS`); two weeks of a 3x/week lift no longer reads as flat.
### QA-R4a-1, QA-R4a-2, QA-R4a-3 (medium), QA-R4a-8 (low)
- `dropLoop()` (new/select/reset conversation and store replaced) stops the turn and sets loopView idle, pendingUser null, lastTurn null and the safety cards empty: the stopped loop is no longer allowed to touch the UI, so the switch does it.
- Plan mode is persisted through `updateConversation`, so the running loop's copy is plan too and a follow-up stays in plan mode.
### QA-R4a-4 (medium)
- `changedFromPlan(active, split)` compares the session with what was planned for today (the split shaped by today's Escobar adjustment), for both the finish prompt and `changedTemplate`. A one-day swap or skip from Escobar no longer offers "Keep the change for future sessions?".
### QA-R4b-1 (medium)
- `prepare()` runs the one-time carry-over when Escobar is already on, so users who enabled it in an earlier build get "Earlier conversation" once; `legacyImported` stops a second import.
### QA-R5a-1 (medium)
- A sync merges into the day already stored: a field a later sync could not read (or read as empty) keeps the earlier value. A partial failure sets `lastHealthError` (Settings shows its message and the Details row); the sync reports success only when nothing failed.
### QA-R6-1 (medium), QA-R6-7 (low)
- `backupAgeDays` compares the local day the backup was made with today (the stamp is UTC): no more -1 in the evening west of UTC or +1 in the morning east of it (tested under the 3-zone run). Tests added for the reminder (id, Sunday 19:00, inexact, cancel when off) and tap routing by `extra.type`.
### QA-R6-2 (medium)
- `volumeChartWeeks` returns oldest week first (weeklyVolumeHistory lists this week first); the chart and its 'this week' header read the right week.
### QA-R6-3 (medium), QA-R6-11 (low)
- `firstWorkingSet()` (brain/exposure): the live card's autoregulation tip and Escobar's live view start from the first non-warm-up set; Escobar plans and counts only working sets.
### QA-R1-4 (low)
- The lb backfill runs inside `repairState` (it sees the raw state), so restore gets it too.
### QA-R1-5 (low)
- With both copies kept aside, the rescue file holds both (crash-screen rescue format), so 'Delete rescue copy' after saving loses nothing.
