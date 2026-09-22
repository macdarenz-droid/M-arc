# Coaching implementation progress

Resume from this file, `docs/COACHING-DECISIONS.md` and `docs/COACHING-PLAN.md`. Never re-derive finished work — check "Items done" first.

**Phase order**: P0 → P0-P → P1-R → P2-C → P1 → P2 → P3 → P4.
**Layer order inside a phase**: data model → brain → native → UI → gate. Commit at each layer, push at end of phase.

PR: https://github.com/macdarenz-droid/M-arc/pull/2 (kept open across all phases; checklist updated after each phase).

## Phase P0 (Close the loops) — DONE
Native health plugin compiles into the APK (CI copy + manifest patch), `health.ts` bridge fixed, `DailyHealth`/`healthDays` added, auto-sync on boot/pageshow/session-start, insights use the minute-quantised clock, profile gained `birthYear`.

## Phase P0-P (Profile and goal) — DONE
Onboarding sheet + profile dashboard, `profileHistory`, weight log, `profile.changed` insight, goal rewritten as a full policy object (role-based main/accessory ranges, low-range e1RM step-down, rest suggestion, starter templates per goal).

## Phase P1-R (Recovery v2) — DONE

Sections read: 6.11 (recovery model), F3.1, 6.12.1 (data gaps), 6.17 (logging fidelity).

### Layer: data model — done, commit 7638f50
- `core/models.ts`: `LoggedSet.at/restSec/fidelity/flags`; `Session.logging: SessionLogging`, `day` now derives from `trainedAt`; `CheckIn` (soreness-only for now, other fields optional), `RecoveryModel`, `FreshMark`.
- `core/store.ts`: backfills `logging` via `legacySessionLogging()` for any session saved before the field existed.
- `data/muscles.ts`: `recoveryFactor` per muscle (τ_base prior).
- `brain/fidelity.ts` (new): `classifySetFidelity`, `isCompressed`, `liveSessionLogging`/`retroSessionLogging`/`legacySessionLogging`, plausibility checks (`implausibleLoad`/`implausibleReps`/`unitSuspect`/`futureTime`/`isDuplicateSession`).

### Layer: brain — done, commits 43c0fa3, 766b189
- `data/recovery.ts` (new): the model's full parameter table.
- `core/exercises.ts`: `exerciseDamage()`/`setDamage()` (damage factor, same code-derived pattern as `roleOf()`).
- `brain/recovery.ts` rewritten: impulse-response model (per-set impulse → per-session-per-muscle dose+τ → fast+slow decay stacked over 7 days → pct vs personal reference dose), ready@90%/full@97% both solved numerically with a ±15% display band, systemic (whole-body) factor from sleep/resting-HR/session-RPE load ratio (capped 1.25x, gated on real history — see decisions), soreness cap, "Mark as fresh" override, `calibrateTauScale`/`calibrateAfterSession`.
- `coach/rules.ts`: new `recovery.scheduled-conflict` rule (F3.1), doesn't require `personalized`.
- Verified against the plan's own worked example (ready ~24/34/47h, full ~55/77h, 8 max sets ~75h) — matches almost exactly once each scenario's own history defines its reference dose.
- Tests: `tests/fidelity.test.ts` (21), `tests/recovery.test.ts` rewritten (20, including the 36h-apart stacking test, 120h cap, 7-day floor, soreness cap, fresh-mark override, calibration bounds/direction).

### Layer: native — N/A (no native code needed)

### Layer: UI — done, commit 47b8ccb
- `session.ts`: `commitSet` records `at`/`restSec`/`fidelity`; auto-rest restarts only on a live commit; `finishSession` builds `logging` and derives day/timing from `trainedAt`; `resolveSessionTiming()` (patches a compressed session after the time question); `logPastSession()` (timer-free entry); `calibrateAfterSession` wired in.
- `Train.tsx`: "When did you train?" sheet on a compressed finish; "Log a past session" button + entry grid (no timer, no rest banner).
- `Body.tsx`: three-state recovery map (Recovering / Ready for hard work / Fully recovered), ready-in-hours range + confidence per muscle, drivers + "Mark as fresh" in the muscle sheet, whole-body systemic line.
- **Found and fixed two real bugs via manual Playwright verification** (not just unit tests): (1) the systemic training-load ratio spiked to >1.25x for any brand-new account's very first session (fixed by requiring real history — see decisions); (2) the time-question sheet's default start time could land in the future when the reminder-time guess hadn't happened yet today, which the model correctly zeroed out to "100% recovered" (fixed the default, not the model).

### Layer: gate — done, commit bc28b8c
- `npm run check`: **PASS** (typecheck, 114/114 tests across 13 files, build).
- `npm run gate`: **PASS** — 5/5 themes. The scripted finish is fast enough to be "compressed" every run, so the time-question sheet is exercised and screenshotted for real on every gate run (not a synthetic fixture); "Log a past session" is exercised and screenshotted; Body's existing screenshot slot now shows the three-state map.

### P1-R report
- **Built**: see layer sections above.
- **Tested**: `npx vitest run tests/fidelity.test.ts tests/recovery.test.ts` → 41 passed. `npm run check` → 114/114, clean build. `npm run gate` → 5/5 themes PASS, screenshots visually confirmed (time-question sheet, past-session grid, three-state Body map with a legitimate "whole body" line on the legacy fixture's ~29 days of history).
- **Decided by research**: none requiring external sources this phase (the recovery model's constants come straight from the plan's own formulas, verified by reproducing its worked examples numerically).
- **Scoped down (recorded in COACHING-DECISIONS.md)**: `exerciseDamageScale` calibration axis omitted (no distinct trigger/test named); full 6.17.4 gating matrix / `tests/gating.test.ts` deferred to the phases that build the gated features; History tags and the post-session debrief deferred to P2-C (explicitly assigned there by section 7); foreground/background gap distinction collapsed into one rule.
- **Needs device check**: none new (pure web/TS/UI).
- **Depends on this for later phases**: P2-C's `metrics.ts` and post-session debrief will read `Session.logging` and the fidelity gating; P3's readiness card extends the same `healthDays`-based systemic-factor pattern; P4's deload state reads `recoveryModel`/calibration observations.

## Phase P2-C (Coach v2) — DONE

Sections read: 6.12 (CoachContext v2, insight shape, cadences), 6.13 (insight catalogue), section 7 (P2-C row).

### Layer: data model — folded into the brain commits (no separate commit)
- `core/models.ts`: `AppState.weeklyReviewDismissedWeek?: string` (Monday key of the week already reviewed).
- `brain/recovery.ts`: `trainingAgeMonths`/`ageOf` changed from module-private to exported, for `weeklyReviewInsights`'s `trainingAgeMonths` input and `Coach.tsx`'s `WhatCoachCanSee`.

### Layer: brain — done, commits d142028, 6a91163, 9839a5b
- `brain/e1rm.ts` (new): `effectiveOneRm` (effort-aware e1RM: RIR by label, easy +3/ideal +2/max +0, plus an optional personal bias), `e1rmWeight`, `roundToStep`, `isRealChange` (two-typical-error threshold), `loadForReps` (Epley inverted). `history.ts`'s `bestE1rm` and `prs.ts`'s strength-record threshold (1% → the plan's 2.5%) now use it.
- `brain/effortBias.ts` (new): `rirObservations`/`effortBiasByLabel` — pairs a max-effort set with a non-max set at the same load within 14 days to learn a personal RIR bias per effort label, gated on 3+ pairs.
- `brain/coach/weeklyReview.ts` (new): sets-vs-band (fractional hard sets), frequency per muscle, e1RM trend, progress vs. training age, rep-range mix, failure share, staleness, adherence, weight trend vs. the goal's band; `weekHasEnoughData()` (≥5 logged days this week) gates the whole set; `weeklyReviewInsights(input, limit=6)`.
- `brain/coach/pre.ts` (new): `workingLoadTarget`, `warmupRamp`, `mastersDefaults`, `preSessionInsights(input, limit=3)`.
- `brain/coach/post.ts` (new): `recordsInsight`, `effortMixInsight`, `restAndDensityInsight` and `durationDriftInsight` (the last two gated on `session.logging.timingTrusted`), `postSessionInsights(input, limit=4)`.
- `brain/coach/live.ts` (new): `autoregulationSuggestion` — after a main lift's first live-committed set, easy at/above target reps suggests more load (2.5% step after 3+ sessions of history, else flat 2.5 kg); missing target by 2+ reps at max effort suggests less, advising ideal effort for the rest.
- `brain/coach/rules.ts`: `Insight` gained the v2 fields (`kind`, `cadence` — now includes `'live'` — `evidence`, `numbers`, `drivers`, `unlocks`, `validUntil`) as optional additions; two new now-cadence rules, `progress.plateau-lever` and `readiness.effort-calibration`.
- Tests: `tests/e1rm.test.ts` (10), `tests/effortBias.test.ts` (6), `tests/weeklyReview.test.ts` (13), `tests/pre.test.ts` (6), `tests/post.test.ts` (10), `tests/live.test.ts` (8), `tests/coach.test.ts` (+4 for the two new rules).

### Layer: native — N/A (no native code needed)

### Layer: UI — done, commits 3ce4016, a72e4c6
- `Train.tsx`: starting a split shows a `PreSessionSheet` (load target, warm-up ramp, masters note) before the timer starts; `EntryCard` shows the autoregulation line under a main lift's open exercise, in the accent colour, once its first set is committed live; the finish screen appends a `Debrief` section built from `postSessionInsights()`.
- `Coach.tsx`: `WeeklyReviewCard` (top item as a teaser, opens a sheet with the rest, "Dismiss until next week" keyed to the Monday date so it reappears next week) and `WhatCoachCanSee` (sets logged, effort-rated share, live-logged share, Health Connect, today's check-in, profile completeness, weigh-in count — each with what it unlocks).
- Manually verified via Playwright (not just unit tests, since these are UI-driven, evidence-gated features): the pre-session sheet with no history ("Nothing to flag"); the post-session debrief with 4 rated sets (effort-mix row); the weekly review card and its sheet after 5 sessions logged across the current week (also confirmed `WhatCoachCanSee` renders further down the same page); the autoregulation line in both directions (easy → "Try 52.5 kg for the next set", max miss → "Drop to 50 kg and keep the rest at ideal effort") against a fixture with 5 prior sessions of real history.

### Layer: gate — done, commits 900af9a, a72e4c6
- Extended the silent-black walkthrough: screenshots the pre-session sheet; logs 4 rated sets (first one easy at the placeholder target, to exercise autoregulation; the mix still lands in the "healthy spread" branch so the existing debrief assertion holds); screenshots the live session (now asserted to contain an autoregulation "for the next set" line) and the finish screen (now asserted to contain a `Debrief` section).
- New fixture pass: a fresh profile logs 5 past sessions across the current calendar week via the existing "Log a past session" flow, then screenshots the Coach page (asserted to show "Weekly review") and the opened weekly-review sheet.
- `npm run check`: **PASS** (typecheck, 171/171 tests across 19 files, build). `npm run gate`: **PASS** — 5/5 themes, all new assertions hold, no page errors.

### P2-C report
- **Built**: see layer sections above — effort-aware e1RM, effort-calibration foundation, weekly review, pre-session brief, post-session debrief, in-session autoregulation, "What the coach can see".
- **Tested**: `npx vitest run` → 171/171 passed across 19 files (added `e1rm`, `effortBias`, `weeklyReview`, `pre`, `post`, `live`, plus 4 new `coach.test.ts` cases). `npm run check` → clean typecheck, 171/171, clean build. `npm run gate` → 5/5 themes PASS; screenshots visually confirmed for the pre-session sheet, the post-session debrief, the weekly-review card + sheet, and the autoregulation line (both the "add load" and "ease off" branches, the latter landing on a real plateau-detected 40 kg target from the legacy fixture's history).
- **Decided by research**: none requiring external sources this phase (e1RM RIR-by-effort mapping, record threshold, and autoregulation's formula all came straight from the plan's own tables).
- **Scoped down (recorded in COACHING-DECISIONS.md)**: insight feedback/snooze (F3.6) deferred to P4 — the plan assigns it to both phases in scope prose, but only P4's Done-when has a concrete test for it; the "watch" row in "What the coach can see" omitted until P1 builds WatchBridge; the post-session debrief is recomputed live rather than persisted to a new `Session.debrief` field (no second reader yet).
- **Needs device check**: none new (pure web/TS/UI; autoregulation and the debrief were both verified against realistic history via Playwright, not a real watch or phone).
- **Depends on this for later phases**: P1's live-HR work will add a `watch` row to "What the coach can see" and HR-aware rows to the post-session debrief; P2's HR-guided rest and effort-mismatch rules extend `coach/live.ts`'s cadence; P4's deload state will suppress `autoregulationSuggestion` on a back-off day (no-op today since `deload` doesn't exist yet) and builds the F3.6 feedback/snooze mechanism this phase deliberately deferred.

## Phase P1 (Live HR / WatchBridge) — DONE

Sections read: 6.2, 6.3 (WatchBridge/native BLE), F0.4, F1.1, F1.6, 6.10 (energy + profile sheet on first connect), section 7 (P1 row). Ported from `macdarenz-droid/Watch-test`'s Java (read-only; that repo was never modified).

### Layer: data model — done, commit 88e7a49
- `core/models.ts`: `SetHeart` (peak/end/restStart/hrr60), `SessionHeart` (source/deviceName/samples/avg/max/min/hrr60Median/zoneSec/energy/coverage), `SessionEnergy` (gross/active/low/high/minutes/source/profileSnapshot — frozen at finish, never recomputed from a later profile edit), `Profile.hrMaxOverride`/`restingHrOverride`, `Preferences.watch` (autoConnectOnSession/deviceAddress/deviceName). `LoggedSet.heart?`/`Session.heart?`.

### Layer: brain — done, commits beb5b05, 916b9e5
- `brain/heart.ts` (new): `hrMax` (override → validated observed max, decaying toward Tanaka past 12 months → Tanaka → 190), `observedHrMaxFromSeries` (5+ point plateau within 3bpm, reached by a ramp, <=220bpm), `downsampleToBuckets` (raw samples → 5s-bucket medians, contact=true only), `bestObservedHrMax` (aggregates across stored session series), `restingHr` (override → 7-day Health Connect median → null, no session inference), `zones` (Karvonen boundaries at 50/60/70/80/90% HRR), `signalQuality` (coverage), `setHeartFromWindow` (per-set peak/end/HRR60), `sessionHeartSummary` (the finish-card aggregate; `restingHrBpm` nullable — see decisions).
- `brain/energy.ts` (new): Mifflin-St Jeor BMR, Keytel gross kcal/min, `sessionEnergy` (heart-rate integration), `energyFromWatch`/`energyFromHealthConnect` (pure, the latter has no native caller yet — see decisions), `pickEnergy` (Health Connect > watch > heart rate), `dailyActiveKcal`, `weeklyEnergy`.
- Tests: `tests/heart.test.ts` (25), `tests/energy.test.ts` (18), `tests/heartStore.test.ts` (5).

### Layer: native — done, commit 72f27db; real compile verified by CI
- `native/watch/core/{HeartRateMeasurement,LiveSession}.java`: ported verbatim from Watch-test's Android-free `sensor-core`; compiles standalone with `javac` (checked directly in this environment, no Android SDK needed since they have zero Android dependency).
- `native/watch/{WatchService,DeviceScanner}.java`: ported from Watch-test, repackaged, notification points at M/ARC's `MainActivity`.
- `native/watch/WatchBridgePlugin.java` (new): the `@CapacitorPlugin(name="WatchBridge")` adapter matching the plan's exact TS contract (isSupported/permissionState/requestPermissions/startScan/stopScan/connect/disconnect/status, watchStatus/watchMeasurement/watchDevice events).
- `native/MainActivity.java`, `native/patch_manifest.py`, both CI workflows updated and verified against a synthetic manifest (idempotent, correct attributes) since this environment has no Android SDK to run a real `cap sync`.
- **This branch's own push triggered the real GitHub Actions Gradle build** (`android-gate` job, run 35739430443): "Build debug APK" succeeded — the actual, non-simulated compile check for every Android-dependent file in this layer passed.
- **Needs device check**: real BLE connection to a broadcasting watch, permission prompts on real API levels (31+/<=30/33+) — nothing further to verify without hardware; the code path has no substitute for an actual watch broadcast.

### Layer: UI — done, commits 036c489, 7f3aa85
- `native/watch.ts`, `core/heartStore.ts`, `slices/workout/heart.ts`: plugin wrapper + signals, the separate `marc.heart.v1` store (LRU 60), live-only in-memory capture wired into `session.ts` (`startSession`/`commitSet`/`finishSession`/`discardSession`), `main.tsx` boots both.
- `Train.tsx`: live pill (bpm + freshness dot, hidden on web) opening the new `slices/settings/Watch.tsx` `WatchSheet` (scan/connect/disconnect/auto-connect, shared with Settings); per-set "peak N" badge; finish screen "Heart" card.
- `History.tsx`: session card heart/kcal line. `Settings.tsx`: "Health" section renamed "Watch and health", gains a Watch row. `Onboarding.tsx`/`brain/onboarding.ts`/`profile.ts`/`selectors.ts`: the watch-connects-for-the-first-time trigger.
- **Manually verified end to end via Playwright** with a stubbed WatchBridge plugin (see decisions for the `CapacitorCustomPlatform` technique that made this possible against the real bundled `@capacitor/core`): pill appears and reaches LIVE with a real bpm reading, scan finds a device, connecting works, the onboarding-on-first-connect sheet fires correctly, the per-set peak badge renders, the finish screen's Heart card renders with real numbers. Zero console/page errors. Also reconfirmed (as in every prior phase) that the plain web-fallback path — no watch plugin at all — still produces zero errors through a full log-session-finish-history-settings walkthrough.
- **Found and fixed one real bug this way**: `sessionHeartSummary` was gated entirely on having a resting HR, so the whole Heart card silently disappeared whenever Health Connect had no history yet, even though avg/max/HRR60 don't need one — fixed to make `restingHrBpm` nullable and only skip the zone bar (see decisions).

### Layer: gate — done, commit 27eea4d
- Extends the walkthrough with a watch-stub fixture (plain, non-touch context — see decisions): stubs `WatchBridge` and reports the platform native via `CapacitorCustomPlatform`, then scans, connects, screenshots the watch sheet and the LIVE pill, logs a live set (asserts a peak badge), finishes (asserts a Heart card on the finish screen).
- `npm run check`: **PASS** (typecheck, 223/223 tests across 22 files, build). `npm run gate`: **PASS** — 5/5 themes plus the watch-stub fixture, all assertions hold, no page errors.

### P1 report
- **Built**: see layer sections above — WatchBridge Capacitor plugin (ported from Watch-test), heart-rate and energy brain modules, live capture wiring, live pill, per-set peaks, finish/History heart cards, Watch settings sheet, onboarding-on-first-connect.
- **Tested**: `npx vitest run` → 223/223 across 22 files. `npm run check` → clean. `npm run gate` → 5/5 themes + watch stub, PASS. The real GitHub Actions Gradle build (triggered by pushing the native commit) compiled every native file successfully — not a local simulation, the actual CI check section 7 names.
- **Decided by research**: none requiring new external sources (the heart/energy formulas came from the plan's own tables; the `CapacitorCustomPlatform` mechanism was found by reading `@capacitor/core`'s own bundled source directly, cited in the decisions log).
- **Scoped down (recorded in COACHING-DECISIONS.md)**: native `SharedPreferences` device-remembering skipped (AppState already the single source of truth); Health Connect's `readRange`/`energyFromHealthConnect` native call site skipped (the plan's own hardware note says this source is unreachable on the verified watch/Huawei-Health pairing today); `restTarget`/`rmssd`/`hrrTrend` deferred to P2/P3 per section 7's own phase assignment.
- **Needs device check**: real BLE connection to a broadcasting watch and the runtime permission prompts on real Android API levels — the one thing no environment available here can substitute for. Everything else (native compile, plugin contract, UI wiring, degraded-without-a-watch behaviour) was verified by other means as described above.
- **Depends on this for later phases**: P2's HR-guided rest and effort-mismatch/drift rules read `latestMeasurement`/`SetHeart`/`SessionHeart` this phase built; P3's readiness baselines read `healthDays` the same way P0 already established; P4's deload state is independent of this phase.

## Phase P2 (HR coaching) — DONE

Sections read: 6.4 (`restTarget`, `heart.effort-mismatch`/`heart.drift`), F1.2-F1.5, section 7 (P2 row).

### Layer: data model — done, commit 2afc601
- `core/models.ts`: `Preferences.rest: { mode: 'time'|'heart'; heartTargetPct; minSec }` (default `mode: 'time'`), `RestState.preSetBpm?`/`effort?`.

### Layer: brain — done, commit 15b12af
- `brain/heart.ts`: `minRestSec` (60/90/120 easy/ideal/max, applied uniformly — see decisions), `restReadyBpm`/`restTarget` (3 consecutive settled samples + the effort's minimum time, 300s hard cap), `effortMismatch` (session-relative, only the "easy but near-max" direction the plan's template actually describes), `intraSessionDrift` (3+ same-load sets, rising peak HR + shrinking HRR60).
- `coach/rules.ts`: `heart.effort-mismatch` (110) and `heart.drift` (130, alert) added to the always-on `RULES`, reading the most recent session.
- Tests: 13 new cases in `tests/heart.test.ts` (38 total in that file), 4 new cases in `tests/coach.test.ts`.

### Layer: native — N/A (no new native surface; reuses P1's WatchBridge stream)

### Layer: UI — done, commit 10b2c3e
- `session.ts`: `startRest` captures `preSetBpm`/`effort` at the moment auto-rest starts (from `slices/workout/heart.ts`'s new `latestLiveBpm()`).
- `Train.tsx`'s `RestBanner`: in heart mode with a LIVE stream and a resting-HR source, shows "150 → 103" and ends via `restTarget()`; falls back to the ordinary timer display/behaviour the instant the stream isn't LIVE or heart mode isn't selected — the original timer duration stays the ceiling either way.
- `Settings.tsx`: a "Rest ends by heart rate" toggle appears once a watch is actually connected.
- Manually verified via Playwright with the stubbed-watch technique from P1: heart mode shows the bpm-target banner correctly; forcing the stub's freshness to STALE correctly falls back to the plain timer. Zero errors either way.

### Layer: gate — done, commit d2b5f3a
- Watch-stub fixture now seeds a week of `restingHr` history and `rest.mode: 'heart'`, screenshots the rest banner after a live commit, and asserts the "N → N" heart-guided text appears.
- `npm run check`: **PASS** (typecheck, 239/239 tests across 22 files, build). `npm run gate`: **PASS** — 5/5 themes plus the watch-stub fixture, all assertions hold.

### P2 report
- **Built**: HR-guided rest (target bpm, 3-sample settling, effort-based minimum, 300s cap, timer-ceiling and STALE fallback), `heart.effort-mismatch` and `heart.drift` coach rules, Settings toggle.
- **Tested**: `npx vitest run` → 239/239 across 22 files. `npm run check` → clean. `npm run gate` → 5/5 themes + watch stub, PASS, including a real heart-mode rest screenshot.
- **Decided by research**: none (thresholds either came from the plan's own numbers/examples or are recorded as implementation-detail choices with no plan text to contradict).
- **Scoped down (recorded in COACHING-DECISIONS.md)**: F1.5 (conditioning zone targets, two new record kinds) deferred — not in this phase's literal Done-when, and would need new raw-series plumbing into `prs.ts`/`progression.ts` that doesn't exist; `heart.overreaching`/`heart.hrr-trend`/`data.watch`/`data.health` deferred (unclaimed by any phase's Done-when, and `heart.overreaching` needs P3's not-yet-built readiness module).
- **Needs device check**: the actual HR-guided rest experience on a real broadcasting watch (does 0.6 of reserve / +12bpm feel right in practice) — everything else (the decision logic, the UI fallback, the gate) was verified by other means.
- **Depends on this for later phases**: P3's readiness work will add `heart.overreaching` once its baselines exist; P4's deload state is independent.

## Phase P3 (Readiness) — DONE

Sections read: 6.4's `brain/readiness.ts` bullet, F2.1-F2.5, section 7 (P3 row).

### Layer: data model — folded into the brain commit (no separate commit)
- `core/models.ts`: `DailyHealth.rmssd?/lnRmssd?/rmssdAt?` (F2.3, unpopulated — dormant on the GT6).

### Layer: brain — done, commit 77ceea3
- `brain/readiness.ts` (new): `readinessBaselines` (7d/28d resting HR, 14d sleep median, 7d lnRMSSD mean/SD/CV), `readiness()` — weighted, renormalising, self-report-led score across check-in (0.35)/sleep (0.25)/target-muscle recovery (0.15)/resting-HR (0.10)/HRV (0.10)/acute load (0.05); bands green>=67/amber 34-66/red<=33; `loadAdvice`; never scores from zero inputs (null); "calibrating" until 14 days of check-ins or sleep. Several sub-formulas the plan names but doesn't fully specify (bedtime regularity, the check-in 3-way combination, hysteresis) are approximated or deferred — see decisions.
- `progression.ts`: `suggestNext()` gains an optional `ProgressionContext` (readiness, recoveryPct); 'reduce' holds and drops a set, 'no_increase'/recoveryPct<60 skips the increase branch.
- `recovery.ts`: exported `avg`/`stddev`/`clamp`/`sessionRpeLoad` (were private) for reuse.
- Tests: `tests/readiness.test.ts` (10), 4 new cases in `tests/progression.test.ts`, 2 new cases in `tests/coach.test.ts` (`readiness.today` rule).

### Layer: native — N/A (HRV native read deferred, see decisions)

### Layer: UI — done, commit 7d7dacd
- `Train.tsx`: a "Quick check-in" sheet (F2.2) — sleep quality, mood, and soreness per muscle in today's scheduled split — shows once per day before the pre-session brief, skippable; `suggestNext()` call sites now pass `{ readiness, recoveryPct }`.
- `Today.tsx`: a "Readiness" card above "This week" (band, score, drivers, load advice) or a quiet connect/check-in prompt. `coach/rules.ts`: `readiness.today` (450 red / 380 amber / 120 green on Mondays).
- `app/selectors.ts`: `todayCheckIn`/`todayReadiness` computed once, shared by Train, Today and the coach rules.
- **Found and fixed a real bug via manual testing**: `readiness()`'s target-muscle fallback (every muscle when nothing scheduled) combined with `recoveryStatus()`'s 100%-for-untrained-muscles default was silently padding the recovery sub-score toward green regardless of how bad other inputs were — caught by a failing unit test, fixed by leaving target muscles (and the sub-score) empty when nothing is scheduled. Also added a raw-rating fallback so a first-ever check-in with no history to z-score against still contributes to a (calibrating) score instead of nothing.

### Layer: gate — done, commit 06ad508
- New fixture: 28 days of health data (resting HR elevated the last 7), plus a "two-for-two clean top" exercise history that would otherwise suggest an increase. Asserts a real "Red · calibrating" tier renders on Today, and Train holds the load ("Add one step" does not appear) once readiness is red.
- Fixed the check-in sheet's new interruption of the existing "Start" flow in three places (the silent-black theme pass, the watch-stub fixture, and the new readiness fixture) — all previously assumed the pre-session sheet appears immediately after "Start", which the check-in sheet now sits in front of on any day without one.
- `npm run check`: **PASS** (typecheck, 254/254 tests across 23 files, build). `npm run gate`: **PASS** — 5/5 themes plus all supplementary fixtures.

### P3 report
- **Built**: readiness score and baselines, the progression readiness/recovery hook, the check-in sheet, the Today readiness card, the `readiness.today` insight.
- **Tested**: `npx vitest run` → 254/254 across 23 files. `npm run check` → clean. `npm run gate` → 5/5 themes + all fixtures, PASS, including a real red-readiness-holds-the-load screenshot.
- **Decided by research**: none requiring new external sources (the readiness formula's precisely-specified parts came straight from the plan; underspecified parts were extended from the plan's own analogous formulas or existing primitives, recorded in COACHING-DECISIONS.md).
- **Scoped down (recorded in COACHING-DECISIONS.md)**: F2.3 (HRV reading flow) and F2.5 (resting-HR/HRR trend sparklines, `overreachingFlag`) deferred — not in this phase's Done-when, and F2.3 is verifiably dead code on the only hardware this build targets; band hysteresis deferred (needs new persisted state, untested by Done-when).
- **Needs device check**: none new — HRV is the one input that would need real hardware, and it's already correctly inert (never populated) on the verified watch.
- **Depends on this for later phases**: P4's deload state can read `readiness()`'s band/loadAdvice the same way `suggestNext()` now does; a future phase adding a real HRV-capable device would only need to populate `DailyHealth.lnRmssd`, since `readiness()` already knows what to do with it.

## Next: Phase P4 (Programming) — NOT STARTED
Sections to read next: F3.1-F3.8, W1/W7/W8/W9/W10 (scheduled-split conflict — F3.1 partly done in P1-R already —, volume landmark bands, deload state, warm-up sets — pre.ts's warmupRamp partly covers this from P2-C —, cues in session, insight feedback and snooze deferred here from P2-C, exercise substitution, optional morning notification).

## Not started
P4.
