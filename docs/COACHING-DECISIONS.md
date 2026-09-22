# Coaching implementation decisions log

One entry per decision not already made explicit by section 8 of `docs/COACHING-PLAN.md`. Format: what, why, source.

## P0

- **Decided**: `DailyHealth` (models.ts) ships in P0 with only the fields P0 actually populates (`day`, `restingHr`, `latestHr`, `latestHrAt`, `sleepMinutes`, `sleepEndAt`, `steps`, `activeCalories`, `source`, `syncedAt`); `spo2`, `rmssd`, `lnRmssd`, `rmssdAt`, `rmssdSource` from the full plan 6.1 shape are added later by the phase that populates them.
  **Why**: rule "no speculative abstractions" — the Java plugin does not return spo2/RMSSD yet, and Appendix E shows the GT6 broadcast has no RR intervals. Adding unused optional fields now would be dead weight; adding an optional field later is not a migration.
  **Source**: plan 6.1 (full shape), Appendix E (RR/spo2 not available on GT6), CLAUDE-facing rule "no scope beyond the phase".

- **Decided**: 6.12.1's data gaps (`LoggedSet.at`/`restSec`, `trainedAt` vs `loggedAt`, `weightLog`, `trainingSince`, per-muscle time) are **not** implemented in P0, even though the task prompt named 6.12.1 for this phase.
  **Why**: section 7's acceptance table assigns 6.12.1 explicitly to phase **P1-R** ("P1-R Recovery v2 (6.11, F3.1, 6.12.1, 6.17)"), and P0's own "Done when" row only requires CI copy/patch, the health bridge fix, `healthDays` history, `nowMs`-based insights and profile birth year. Section 7 is the authoritative, up-to-date phase definition; the "suggested first prompt" in the "How to use this document" section (which named 6.12.1 for P0) predates that table. This is the plan contradicting itself; per the operating rules, the reading that keeps the phased structure intact (section 7) wins.
  **Source**: plan section 7 (P0 and P1-R rows), plan "How to use this document" line 19 (superseded).

- **Decided**: no `preferences.healthAutoSync` toggle is added in P0; health sync runs unconditionally on `pageshow` and on `startSession()`.
  **Why**: F0.3 in section 4/7 says "sync automatically on app open and session start" with no mention of a user toggle in P0's acceptance criteria; the toggle appears in 6.1's full `Preferences` shape but that's cumulative across all phases, and W16 only asks for automatic sync. Adding a toggle now would be a UI feature beyond what P0 needs.
  **Source**: plan F0.3, W16, section 7 P0 row.

- **Decided**: the Java plugin's health permissions are requested via Capacitor's standard `@Permission`/`requestPermissionForAlias`/`@PermissionCallback` mechanism (an alias `"health"` mapped to the four `android.permission.health.*` strings already declared by `patch_manifest.py`), rather than the Jetpack Health Connect `PermissionController` contract.
  **Why**: this plugin uses the **platform** Health Connect API (`android.health.connect.*`, gated on `Build.VERSION.SDK_INT >= 34`), not the Jetpack `androidx.health.connect.client` library. On API 34+ these permission strings are ordinary runtime permissions requestable through the standard Android permission dialog, which is exactly what Capacitor's built-in permission plumbing drives. The Jetpack contract exists to paper over pre-34 devices, which this plugin already excludes via `platformAvailable()`.
  **Source**: Capacitor Android plugin docs (custom permissions via `@Permission`/`@PermissionCallback`/`requestPermissionForAlias`), Android Health Connect developer docs (permissions are declared as normal `<uses-permission>` entries and requested via the standard runtime-permission flow on the platform API).

- **Decided**: `native/watch/*` and the `WatchBridge` plugin (F0.4, section 6.2) are **not** touched in P0.
  **Why**: section 7 assigns F0.4 to phase **P1**, not P0; `native/watch/` does not exist yet in the repo.
  **Source**: plan section 7 (P1 row lists F0.4).

## P0-P

- **Decided**: the `profile.changed` insight (6.15) only fires for `bodyWeightKg` and `goal`, not `heightCm`/`birthYear`/`sex`/`trainingSince`/`plannedDays`.
  **Why**: the plan's own templates for those other fields ("Now using age 34: estimated max heart rate 184, zones updated") describe consumers (HRmax, zones, calories) that don't exist until P1/P1-R/P2-C. Emitting an insight that names a feature the app doesn't have yet would be a lie the coach tells the user. Section 7's P0-P Done-when only requires "changing weight or goal produces one feedback insight" — it doesn't ask for the other fields.
  **Source**: plan 6.15 templates, section 7 P0-P row, "never write 'should work'" truthfulness rule.

- **Decided**: `src/brain/profile.ts`'s `profileAt()`/`ageAt()`/`weightAt()`/`profileDiff()` (6.15) are **not** implemented in P0-P.
  **Why**: nothing consumes them yet — frozen per-session energy snapshots need `SessionEnergy` (P1), relative-strength-at-the-time needs P2-C's metrics, and historical-band lookups need P1-R/P4. Building them now would be a speculative abstraction with no caller and no test beyond "it replays correctly in the abstract." `profileHistory` itself is recorded now (so no data is lost); the replay functions land with their first real consumer.
  **Source**: "no speculative abstractions" rule; plan 6.12.3/6.16 list these consumers in later phases.

- **Decided**: `AppState.goal` stays a non-nullable `GoalId` (defaulting to `'lean'` as today); no "goal: not set" state was introduced.
  **Why**: G9's fix ("the Today card for a fresh state says 'Goal: not set' instead of implying lean") would require `goal: GoalId | null` and touch every reader of `s.goal` across the app (progression, Coach, Train, coach rules) — a large, risky ripple for a copy nuance. Instead, the onboarding form actively asks the user to pick a goal (a real, informed choice is recorded in `profileHistory` with `source: 'onboarding'`), which addresses G9's substance (users choosing a goal, not drifting on a silent default) without the type change. Kept the existing, working default.
  **Source**: "if the plan contradicts... choose the reading that keeps existing behaviour" rule; G9 in plan 6.16.

- **Decided**: the profile dashboard (6.14) ships with only "About you", "Body" and "Training" sections. "Watch and health" and "Check-ins" are omitted.
  **Why**: Settings already has a working Health Connect card (P0); duplicating it in the dashboard before the watch (P1) or check-ins (P1-R/P2) exist would show controls for features that don't work. The dashboard will grow these sections when those phases land.
  **Source**: "no scope beyond the phase" rule.

- **Decided**: `strength_muscle`'s starter templates are `['upper', 'lower']`; `strength`'s are `['full_a', 'full_b']`.
  **Why**: 6.16 specifies the four template keys to add but not which of the two new goals gets which pair. Full-body A/B (higher per-lift frequency) is the more common recommendation for pure strength; upper/lower suits combined strength-and-muscle work with more accessory volume. Both are standard, defensible splits.
  **Source**: research (common strength-programming heuristics: full-body for frequency-driven strength work, upper/lower for combined hypertrophy+strength); no primary source needed since this is a template-offering choice, not a coaching claim.

- **Decided**: the goal-change "Apply rest" / "Add templates" one-tap actions (6.16, decision 14) are buttons inside the `GoalSheet`, not a `showToast(...)` action.
  **Why**: `Sheet` renders a native `<dialog>` via `showModal()`, which promotes it to the browser's top layer; the app's `Toast` is an ordinary fixed-position `<div>` rendered outside the dialog, so it would be visually hidden behind the modal's backdrop while the sheet is open. Buttons inside the sheet are guaranteed visible and are arguably a clearer one-tap surface than a toast that has to be dismissed first anyway.
  **Source**: verified by reading `ui/primitives.tsx`'s `Sheet` (`showModal()`) and `Toast` (plain `div`, rendered in `App.tsx` as a sibling, not inside any open dialog).

## P1-R

- **Decided**: `RecoveryModel` ships as `{ tauScale, observations }` only; the plan's `exerciseDamageScale` axis is not implemented.
  **Why**: 6.11 point 8 describes two calibration axes (per-muscle `tauScale` and a separate per-exercise `exerciseDamageScale`), but only names one required test ("calibration bounds and direction") and gives no distinct trigger condition for the exercise-level axis. Shipping a second, unused calibration dimension with no consumer or test would be a speculative abstraction. Per-muscle `tauScale` alone already satisfies the two-sided, bounded calibration loop and its test.
  **Source**: plan 6.11 point 8; "no speculative abstractions" rule.

- **Decided**: exercise damage (`x` in the impulse formula) is derived in code from a name/id list (`core/exercises.ts` `exerciseDamage()`/`setDamage()`), the same pattern as `roleOf()` from P0-P, instead of adding a `damage` field to `exercises.json`.
  **Why**: keeps a large, hand-maintained data file untouched; the plan's own damage list ("Romanian and stiff-leg deadlift, Nordic and glute-ham curl, good morning, deficit deadlift, ...") is exactly the kind of static classification `roleOf()` already established the convention for. Checked the actual library: several named exercises (Nordic curl, good morning, deficit/stiff-leg deadlift, sissy squat) don't exist in this library at all, so the derived list only includes what's actually present.
  **Source**: `node -e` inspection of `src/data/exercises.json`; plan 6.11 point 1.

- **Decided**: the per-set fidelity classifier does not distinguish "gap while the app was backgrounded" from "gap while foregrounded" (6.17.2's `delayed` condition for a >12-minute gap explicitly says "while the app was in the background the whole time"). Any gap outside the 20s-12min live window is `delayed`, regardless of foreground/background.
  **Why**: tracking real foreground/background time would need new `visibilitychange` wiring threaded through the active-session state — real complexity for a distinction that doesn't change the outcome (a long foreground gap between sets is equally not "logged as it happened" for timing-trust purposes as a long backgrounded one).
  **Source**: plan 6.17.2; "no scope beyond the phase" rule.

- **Decided**: the full 6.17.4 gating matrix and `tests/gating.test.ts` are not implemented this phase, beyond what the recovery model, records, and adherence/streak already do correctly by construction (they already key off `trainedAt`/`day`, never `loggedAt`).
  **Why**: most of the matrix's rows gate features that don't exist yet — per-set heart data, HR-guided rest, session density/idle-time medians, fixed-load HR comparison — all P1/P2 work. A table-driven test asserting "produces X" for a metric that isn't built would be testing nothing. `CheckIn.sleepQuality`/`mood` were left optional (not required, unlike the plan's literal `CheckIn` shape) so P1-R can write a soreness-only check-in row today without inventing sleep/mood values, and P2 can fill them on the same day's row later without a shape change.
  **Source**: plan 6.17.4; section 7 P1-R's actual Done-when list, which names none of these; "no speculative abstractions".

- **Decided**: History "logged later" tags, edited-set pencil marks, and the post-session debrief's "here's what I could/couldn't judge" copy (6.17.3, 6.17.6) are not built this phase.
  **Why**: section 7 assigns the post-session debrief explicitly to **P2-C** ("the pre-session sheet and post-session debrief render in the gate"). Building debrief copy now would either duplicate work when P2-C's `Insight` v2 shape lands, or fork the copy into two places. `Session.logging` already carries everything a future debrief needs (`mode`, `flags`, `timingTrusted`); nothing is lost by deferring the surface.
  **Source**: plan section 7 (P2-C row).

- **Decided**: the systemic training-load ratio (7-day vs 28-day session-RPE load) only applies once training has spanned at least 14 of the last 28 days with 3 or more sessions in that window.
  **Why**: found by manually exercising the feature — a brand-new account's very first session always produced a ratio over the 1.3 threshold, because dividing the same one-session total by 7 versus 28 mechanically gives 4.0 regardless of actual training pattern. The plan's ATL/CTL framing assumes an established training history; nothing in 6.11 says what to do before one exists, so this guard is a reasonable, tested reading rather than a literal instruction.
  **Source**: manual Playwright verification (see COACHING-PROGRESS.md); plan 6.11 point 2 (systemic factor).

- **Decided**: the "when did you train?" sheet's default start time never lands in the future. If the scheduled/reminder-time guess would put the session's end after "now", the default falls back to "ended just now" (`now − duration` as the start).
  **Why**: found the same way — defaulting blindly to a fixed guess (the reminder time, or 17:00) produces a future timestamp whenever the sheet is answered before that time of day, which the recovery model correctly (if surprisingly) treats as "hasn't happened yet" (zero residual, 100% recovered) since `residualOf` guards against negative elapsed time. The guard is on the timestamp, not the model; the model's negative-elapsed guard is correct and stays as is.
  **Source**: manual Playwright verification; `resolveSessionTiming`/`TimeQuestionSheet` in `slices/workout/Train.tsx` and `session.ts`.

## P2-C

- **Decided**: "feedback and snooze" (F3.6: Helpful/Not now, 7-day snooze, an "Earlier this month" log) is **not** built in P2-C, despite being named in the phase's scope prose.
  **Why**: the plan contradicts itself here — section 7's scope column lists "feedback and snooze" under **both** P2-C and P4 (P4's row: "...cues in session, feedback, substitutions..."), but only P4's own Done-when names a concrete, testable acceptance bar for it ("snoozed insights hide for 7 days"). P2-C's Done-when lists none of this (only catalogue-row tests, the pre-session sheet, the post-session debrief, and the weekly review). Per the standing rule to pick the reading that keeps existing behaviour when the plan contradicts itself, and per "section 7's Done-when is authoritative over more expansive scope prose" (used throughout this build), `InsightFeedback`/snooze is deferred to P4, where it already sits in this project's phase plan and has an actual test to satisfy.
  **Source**: plan section 7 (P2-C and P4 rows); plan 6.13's `coachInsights()` line ("drop ids snoozed in the last 7 days") and F3.6.

- **Decided**: "in-session autoregulation" (6.13's "Autoregulation after set 1" row, cadence `'live'`) **is** built this phase, as `src/brain/coach/live.ts`'s `autoregulationSuggestion()`, wired into `EntryCard` in `Train.tsx`.
  **Why**: unlike feedback/snooze, this row has no contradicting phase assignment anywhere in the plan — it's named only under P2-C, and P2-C's Done-when explicitly requires "every catalogue row has a test for firing, staying quiet below its minimum." Leaving it out would be an undocumented scope cut of a fully-specified row (exact formula given at plan line 620), not a defensible deferral.
  **Source**: plan 6.13 ("Autoregulation after set 1" row) and 6.12.5 (in-session cadence description).

- **Decided**: autoregulation's "cap remaining sets at ideal" effect is delivered as advisory copy in the suggestion's `action` text ("...and keep the rest at ideal effort"), not as a hard UI constraint that disables the Max effort button for the rest of the exercise.
  **Why**: every example in the plan's own catalogue (6.13's own worked text, "Missed two at max. Drop 5% for the rest.") frames this as spoken advice, not an input restriction; disabling a button based on a soft heuristic would block a genuinely-earned max set later in the exercise and adds real complexity (effort-button state keyed to a transient per-exercise flag) for a wording nuance.
  **Source**: plan 6.13 catalogue row template text; "no scope beyond the phase" rule.

- **Decided**: autoregulation only fires for `role === 'main'` exercises in `mode === 'weighted'`, using the same `roleOf()` classification P0-P already established (main-pattern compound lifts vs everything else).
  **Why**: the plan explicitly scopes this to "a main lift" (6.12.5) and separately forbids it "on isolation or timed sets" (6.13's forbidden-phrases column). `role === 'main'` is exactly the existing main-vs-accessory (compound-vs-isolation) split; `mode === 'weighted'` additionally excludes duration/bodyweight/conditioning sets, matching "timed sets" and any set without a load to step by.
  **Source**: plan 6.12.5, 6.13 (Autoregulation row, forbidden column); `core/exercises.ts` `roleOf()` (P0-P).

- **Decided**: the autoregulation step size uses `historyCount >= 3` (this exercise's prior logged sessions) to switch from a flat 2.5 kg step to a 2.5% step, reusing `exerciseHistory(...).length` computed inline in `EntryCard` rather than the existing `confidenceFrom()` buckets from `progression.ts` (which switch at 4, not 3).
  **Why**: the plan's own threshold is "after 3 sessions" (6.13 line 620), a specific number distinct from `progression.ts`'s unrelated low/medium/high confidence buckets (built for a different purpose: display confidence on the next-session suggestion, not a step-size cutoff). Reusing the wrong threshold to avoid a second history lookup would silently change the plan's stated behaviour by one session.
  **Source**: plan 6.13 (Autoregulation row: "steps of 2.5% after 3 sessions, else 2.5 kg").

- **Decided**: the post-session debrief is computed live in `FinishScreen` from `postSessionInsights()` each time the finish screen renders; it is not persisted to a new `Session.debrief` field, despite `post.ts`'s own doc comment describing it as "computed once ... and stored with it."
  **Why**: nothing yet re-displays a past session's debrief later (History's per-session detail doesn't show it, and P1-R already deferred History "logged later" tags/debrief copy to this phase's *build*, not to a persistence layer) — the finish screen is the only reader, and it always has the session and its immediate prior sessions in memory right after saving. Adding `Session.debrief` now, with no second reader and no test distinguishing "stored" from "recomputed identically," would be a speculative field. Recomputing is also strictly more correct today: it always reflects the current rule set, never a stale snapshot from an older app version. Revisit if/when History grows a per-session debrief view that needs the exact original numbers frozen.
  **Source**: "no speculative abstractions" rule; `src/brain/coach/post.ts`'s own header comment (aspirational, not yet implemented); section 7's P2-C Done-when (only requires it "render in the gate", not persist).

- **Decided**: the "What the coach can see" card (6.12.6) ships with rows for sets, effort ratings, set timing, Health Connect, today's check-in, profile completeness, and weigh-ins. The plan's "watch" row (connected state, last-session heart-rate coverage) is omitted.
  **Why**: there is no watch/WatchBridge integration yet — that's P1's own scope (F0.4, F1.1). Showing a "Watch: not connected" row before the feature exists would be exactly the kind of promise-a-feature-that-doesn't-work copy the P0-P profile-dashboard decision already ruled out for "Watch and health". The row is added once P1 lands.
  **Source**: plan 6.12.6 row list; section 7 (P1 row owns F0.4/watch); prior P0-P decision on the profile dashboard's "Watch and health" section.

- **Decided**: `weeklyReviewInsights`, `preSessionInsights` and `postSessionInsights` all take an optional `limit` parameter and return `out.sort((a, b) => b.priority - a.priority).slice(0, limit)` — the same rank-then-truncate shape the existing always-on `RULES`/`coachInsights()` pipeline already uses.
  **Why**: the plan names cadence-specific caps ("`limit` stays 3 on Today and becomes 5 on the Coach tab" for the now-cadence list) but doesn't spell out the pre/post/weekly caller-side contract in code; matching the established sort-then-slice convention already used elsewhere keeps every insight list behaving the same way (highest priority first, quietly truncated) rather than inventing a second selection rule.
  **Source**: existing `coachInsights()` pattern in `brain/coach/rules.ts`; "the code's existing convention" resolution-order rule.

- **Decided**: `WeeklyReviewCard`'s dismissal is keyed by the Monday date string of the current calendar week (`weekStart(today)`, stored in `AppState.weeklyReviewDismissedWeek`), so dismissing reliably reappears once a new week starts, matching section 7's "weekly review appears on the first open of a new week" wording exactly.
  **Source**: section 7 P2-C Done-when; `core/dates.ts` `weekStart()` (existing, Monday-based).

## P1

- **Decided**: `LiveSession.freshness()` (ported to `native/watch/core/LiveSession.java`) returns the plan's exact `Freshness` enum strings (`LIVE`/`DELAYED`/`STALE`/`WAITING`/`CHECK_FIT`/`DISCONNECTED`) instead of Watch-test's original UI prose (`"WAITING FOR DATA"`, `"CHECK WATCH FIT"`).
  **Why**: Watch-test's strings were written for its own on-screen label, not for a TS bridge to pattern-match on; the plan's own `WatchStatus` type (6.2) names the enum values explicitly, and the TS side maps them by exact string. Changing them at the port boundary (not deeper in the ported logic) keeps the actual state machine byte-for-byte identical to Watch-test.
  **Source**: plan 6.2 (`type Freshness = 'LIVE' | 'DELAYED' | 'STALE' | 'WAITING' | 'CHECK_FIT' | 'DISCONNECTED'`).

- **Decided**: `DeviceScanner.start()` takes a caller-supplied `timeoutMs` instead of Watch-test's hardcoded 20-second scan window.
  **Why**: the plan's own plugin contract is `startScan({ timeoutMs })` — the timeout is a parameter of the TS-facing method, not a fixed app constant, so the native port has to accept it as an argument to honour that contract at all.
  **Source**: plan 6.2 plugin contract.

- **Decided**: the notification's small icon uses `R.mipmap.ic_launcher` (the app's own launcher icon, always present in a Capacitor Android project) rather than a new custom drawable resource.
  **Why**: adding a dedicated monochrome status-bar icon would need a new drawable XML/PNG set added through the same CI icon-generation step that already overwrites the launcher mipmaps — extra CI wiring for a notification most users will rarely see, when the existing, always-present launcher resource works today without touching the icon pipeline.
  **Source**: "no scope beyond the phase" rule; verified `R.mipmap.ic_launcher` is guaranteed present by Capacitor's default Android template, independent of the CI icon-replacement step.

- **Decided**: "remember the last device address... `autoConnectOnSession` calls `connect` with it when `startSession()` runs" (6.2) is implemented entirely on the TS side — `Preferences.watch.deviceAddress` in `AppState`, read by `session.ts`'s `startSession()` — with **no** native `SharedPreferences` storage in the plugin.
  **Why**: the plan names plugin `SharedPreferences` as the storage, but M/ARC already persists all durable preferences in `AppState` (localStorage), which is the app's single source of truth and already survives restarts; a second, native-only copy of the same one string would be a duplicate store that could drift from the one Settings/the watch sheet actually show and edit. `startSession()` already has the address in scope from `state.value.preferences.watch` with no native round-trip needed.
  **Source**: "the code's existing convention" resolution rule (single state store, no native-side duplicate persistence exists anywhere else in this codebase, e.g. health's connection flag).

- **Decided**: `energyFromHealthConnect()` (6.10) is implemented as a pure, tested function, but its native call site — a new Health Connect `readRange(start, end)` plugin method aggregating `ActiveCaloriesBurnedRecord` over exactly the session window — is **not** built this phase, so `pickEnergy()`'s Health Connect branch is always unused in practice today.
  **Why**: the plan's own verified hardware note (Appendix E, restated in 6.10) says plainly that on this exact watch, "Huawei Health currently shares steps but no active calories to Health Connect, so in practice the heart-rate formula will be the working source until that sharing changes." Building a new native plugin method whose one real caller cannot supply any data on the verified hardware would be exactly the kind of speculative, untestable addition the rules warn against. The heart-rate-formula path (`sessionEnergy`) is fully wired and is genuinely the "practice" path per the plan's own words.
  **Source**: plan 6.10 (Appendix E restatement); "no speculative abstractions" rule.

- **Decided**: `restTarget` (HR-guided rest), `rmssd` (HRV) and `hrrTrend` (multi-session HRR trend) from 6.4's `brain/heart.ts` list are **not** implemented in P1.
  **Why**: section 7 assigns HR-guided rest to **P2** ("HR-guided rest, effort-mismatch rule..."); the watch (GT6) verifiably sends no RR intervals at all (Appendix E), so `rmssd` has no input to operate on until a device that does exists, and HRV work is explicitly **P3** ("HRV flow, dormant on the GT6"); `hrrTrend` feeds the `heart.hrr-trend` coach rule, itself named only in P2's rule list (6.4). P1's own Done-when needs none of these three.
  **Source**: plan section 7 (P1/P2/P3 rows); plan 6.2 Appendix E hardware facts; plan 6.4's own rule-priority list assigning `heart.hrr-trend` alongside `heart.overreaching`/`heart.effort-mismatch`/`heart.drift` (all P2 per the pending-tasks split already recorded for P2-C's feedback/snooze deferral).

- **Decided**: `sessionHeartSummary`'s `restingHrBpm` input is nullable; when null, avg/max/min/coverage/HRR60 still compute, but zone-bucketing is skipped (`zoneSec` stays all-zero) rather than guessing a resting HR to make zones "work."
  **Why**: found by manually exercising the finish screen with a stubbed watch and a profile with no Health Connect history and no manual override — the whole Heart card was going missing (an all-or-nothing gate), even though avg/max/HRR60 don't actually need a resting HR at all, only the zone bar does. `restingHr()` deliberately has no fallback beyond override/7-day-median ("do not infer resting HR from a session," 6.4) — that rule protects against a bad *inference*, and does not require blocking every other, unrelated number in the same card. This is a bug fix within the phase's own scope (the finish card is explicitly P1's), not a new feature.
  **Source**: manual Playwright verification with a stubbed WatchBridge plugin; plan 6.4 (`restingHr` fallback chain) and 6.5 (finish-card contents: "avg, max, HRR60, zone bar, kcal if available, coverage note" — zones are one component among several, not a gate on the rest).

- **Decided**: `hrMax()`'s "observed max" input is the best `observedHrMaxFromSeries()` plateau across **all** of a profile's stored session series (`heartStore.exportHeart()` plus the just-finished session), aggregated by a new pure `bestObservedHrMax()`, rather than tracked as a running single value updated incrementally per session.
  **Why**: `heartStore` already caps at 60 sessions (LRU); re-scanning the capped set on each finish is cheap (60 short arrays) and needs no new persisted "current observed max" field that could drift from what the stored series actually show, or need its own migration/reset story.
  **Source**: "no speculative abstractions" (no new stored field without a second consumer); existing `heartStore` cap already bounds the cost.

- **Decided**: the gate script's watch-stub fixture reports the platform as native via `window.CapacitorCustomPlatform = { name: 'android' }`, not by overriding `window.Capacitor` directly.
  **Why**: found the hard way — a raw `window.Capacitor = {...}` override set via `addInitScript` gets partially clobbered when the app's real bundled `@capacitor/core` initializes (its bootstrap unconditionally reassigns `isNativePlatform`/`getPlatform`/`registerPlugin` on whatever object it finds at `window.Capacitor`, preserving `Plugins` but not those methods). `CapacitorCustomPlatform` is Capacitor's own documented escape hatch for exactly this — its `getPlatform()` checks `window.CapacitorCustomPlatform.name` before anything else — and is the only override the real core's bootstrap actually respects.
  **Source**: reading `node_modules/@capacitor/core/dist/capacitor.js`'s bootstrap function directly (see COACHING-PROGRESS.md).

- **Decided**: the watch-stub gate fixture runs in a plain `newContext({ viewport })`, without the other passes' `deviceScaleFactor: 2, isMobile: true, hasTouch: true`.
  **Why**: found by trial — with touch/mobile emulation on, clicks partway through a live session (filling a set's inputs, tapping an effort button right after connecting a stubbed watch) became persistently flaky (repeated "element intercepts pointer events" across unrelated elements), while the exact same interactions are already reliable in the theme passes above, which never combine a watch connection with typing into a live set in the same flow. Screenshot resolution is lower for this one supplementary fixture as a result; the five main theme passes, which do need device-accurate screenshots, are unaffected.
  **Source**: manual iteration on the gate script (see COACHING-PROGRESS.md) — plain vs. touch-emulated context was the only variable that fixed it.

- **Decided**: the watch-connects-for-the-first-time onboarding trigger (`OnboardingTrigger` gains `'watch'`) is checked and can fire even inside another trigger's normal 14-day dismissal cooldown, but only ever once per profile (`Onboarding.watchPromptedAt`).
  **Why**: 6.14's trigger list treats "a watch connects for the first time" as its own, independent condition alongside (not subordinate to) the dismissal cooldown that governs the "partial" trigger; a user who dismissed the general profile nudge yesterday and connects a watch today has a new, specific reason to be asked (calories/zones/recovery just became relevant), which the general cooldown was never meant to suppress.
  **Source**: plan line ~675 (trigger list: "...has not dismissed the sheet in the last 14 days...; a watch connects for the first time (6.10); or 90 days...").

## P2

- **Decided**: `minRestSec` (60/90/120 for easy/ideal/max) applies to every set with heart-mode rest, not only main lifts, despite 6.4's own phrasing ("minRest(effort) (60 s easy, 90 s ideal, 120 s max for main lifts)").
  **Why**: no separate table exists anywhere in the plan for accessory-lift minimums, and F1.2's own description never mentions a main/accessory split at all — the "for main lifts" clause reads as contextual framing (HR-guided rest matters most on the lifts the plan's own examples focus on), not a stated carve-out with a second, unwritten number. Inventing a different accessory-only minimum would violate "never invent a number."
  **Source**: plan 6.4 (`restTarget` bullet) and F1.2 (no main/accessory distinction in the feature description itself).

- **Decided**: `effortMismatch()` (F1.3) only implements the direction the plan's own template describes — an "easy"-labeled set whose peak heart rate sits within 10% of the session's own hardest rated set. The mirror case (a "max"-labeled set that barely raised heart rate) is not flagged.
  **Why**: F1.3's row and 6.13's template text ("you rated Easy on sets that hit 92% of your session max") describe exactly one direction, with one concrete worked number (92%) to anchor a threshold from. The reverse direction has zero textual basis anywhere in the plan, so flagging it would need an invented threshold with no anchor at all — worse than the easy-direction's already-approximate 90% cutoff, which at least rounds beneath the plan's own worked example.
  **Source**: plan F1.3, 6.13's effort-mix-adjacent template wording; "never invent a number" rule.

- **Decided**: `hrMax()` calls inside `restTarget`'s live, per-tick evaluation (the rest banner) use `hrMax(profile)` with no observed-max argument (falling back to override → Tanaka → 190), while the finish-card path (`finishHeartCapture`, built in P1) still computes the full `bestObservedHrMax` aggregation.
  **Why**: `bestObservedHrMax` rescans every stored session's series (up to the 60-session heart-store cap); doing that once per second while a rest timer ticks is wasted work for a number that changes at most a few times a year (a new observed max), whereas the finish card computes it exactly once per session. The two-tier approach (cheap default during live decisions, full aggregation once at finish) keeps the expensive scan where it's actually justified.
  **Source**: performance reasoning specific to this call site; no plan text addresses call frequency, so this is an implementation detail, not a threshold or formula.

- **Decided**: F1.5 (conditioning zone progression targets, and the two new record kinds — "longest time in zone" and "lower average HR at the same load") is **not** built this phase.
  **Why**: section 7's P2 Done-when is literally "Rest ends when the target is met with the timer as ceiling; falls back when STALE; rules have tests; gate has a heart-mode rest screenshot" — every clause is about HR-guided rest and the two rules (effort-mismatch, drift) already built; F1.5 is named only in the phase's scope-summary column, not its acceptance criteria. Building it would also need real new plumbing that doesn't exist anywhere yet: `prs.ts`'s `recordsFor()`/`allRecords()` and `progression.ts`'s `suggestNext()` currently take zero dependency on `heartStore`'s raw series (they only see `Session[]`/`ExerciseSessionSummary[]`), and "time in zone" needs the raw per-second series windowed to a set, not any data these pure modules are given today. That is a real architectural addition, not a small extension, for scope prose that this phase's own Done-when doesn't test.
  **Source**: section 7 (P2 Done-when vs. scope-summary column); `src/brain/prs.ts`/`src/brain/progression.ts` (verified neither imports or receives anything from `core/heartStore.ts`).

- **Decided**: `heart.overreaching`, `heart.hrr-trend`, `data.watch` and `data.health` (all listed in 6.4's rule-additions alongside `heart.effort-mismatch`/`heart.drift`) are **not** added this phase either.
  **Why**: none are named in section 7's P2 scope-summary ("HR-guided rest, effort mismatch, drift, conditioning zones, two new record kinds") or its Done-when, and `heart.overreaching` specifically calls `overreachingFlag()` from `brain/readiness.ts` — a P3 file that doesn't exist yet, gated on HRV/resting-HR baselines this phase never builds. `heart.hrr-trend` and the two `data.*` nudge rules have no F-number and aren't claimed by any single phase's Done-when in the plan; they're deferred until a phase that actually tests for them claims them (most likely P3, alongside `heart.overreaching`).
  **Source**: plan 6.4's rule list vs. section 7's P1/P2/P3 rows; `brain/readiness.ts` does not exist in this codebase as of this phase.

## P3

- **Decided**: F2.3 (the 60-120s HRV reading flow) is not built, and `overreachingFlag()`/F2.5 (resting-HR and HRR trend sparklines in History → Stats) are not built either. `DailyHealth` gains optional `rmssd`/`lnRmssd`/`rmssdAt` fields, and `readiness()` correctly handles their permanent absence, but nothing populates them yet.
  **Why**: F2.3's own text says the GT6 sends no RR intervals (Appendix E) and the flow "stays hidden on the GT6" — building a reading UI whose one precondition never holds on the only verified hardware would be untestable dead code. F2.5 is in P3's scope-summary but not its Done-when ("With 7 days of health data the Today card shows a tier with reasons; red readiness removes load increases in Train; no watch → check-in alone yields a low-confidence tier" — none of that is Stats sparklines or an overreaching flag), matching the same scope-summary-vs-Done-when gap already used to defer F1.5 in P2.
  **Source**: plan F2.3 (Appendix E restatement), section 7 (P3 scope-summary vs. Done-when).

- **Decided**: several of `readiness()`'s sub-scores use a documented approximation where 6.4 names a component but not its exact formula: the check-in sub-score averages its three named parts (soreness/sleep-quality/mood z-scores) with equal weight; the sleep sub-score renormalises its stated 60%/25% split across "last night" and "3-night debt" only (6.4's third component, bedtime regularity, has no data source anywhere in this app — no sleep *start* time is ever read, only `sleepMinutes`/`sleepEndAt`); the acute-load sub-score reuses the systemic factor's own ATL/CTL ratio-to-score mapping pattern (6.11/F2.4) rather than inventing a second one; z-scores require at least 3 prior values to be considered meaningful (a statistical-validity guard, not a coaching threshold).
  **Why**: each of these extends the plan's own stated formula (the resting-HR and HRV clamp patterns) or an already-built primitive (the systemic factor) to a component the plan names but doesn't fully specify, rather than inventing an unrelated mechanism. Bedtime regularity specifically has zero data to compute from without new native/Health-Connect plumbing this phase doesn't build (no sleep-start read exists), so renormalising the other two sub-parts is the only way to keep the sleep component computable at all with what P0's health bridge already provides.
  **Source**: plan 6.4 (readiness formula: check-in/sleep component lists, resting-HR and HRV clamp formulas as the nearest analogous rules); `native/health.ts`/`HealthConnectNativePlugin.java` (no sleep-start field read anywhere in this codebase).

- **Decided**: a first-ever check-in with zero prior days to z-score against still contributes to the check-in sub-score, via a fallback that maps the raw 1-5 rating against its own midpoint (3) rather than treating the whole check-in as absent.
  **Why**: found by manually walking through the actual UI — the first person to ever use the check-in sheet got no readiness score at all, contradicting 6.4's own stated behaviour ("Shows 'calibrating' until 14 days of check-ins or sleep exist" implies a score exists and is marked provisional throughout that window, not that it's withheld until then). The z-score path (`n>=3`) is kept as the primary, more personal comparison; the raw fallback only fills in while there isn't enough history for it.
  **Source**: manual Playwright verification (see COACHING-PROGRESS.md); plan 6.4 ("calibrating" wording).

- **Decided**: `readiness()`'s hysteresis requirement ("a band change needs two consecutive days") is **not** implemented; the band is always the current day's raw computation.
  **Why**: real hysteresis needs the caller to persist yesterday's *settled* band somewhere (a new `AppState` field with its own default/normalize entry) purely to smooth day-to-day noise — a real, if small, new piece of persisted state for a behaviour section 7's P3 Done-when never tests. Deferred rather than built speculatively; revisit if a later phase's acceptance criteria actually exercises it.
  **Source**: plan 6.4 (hysteresis clause); section 7 P3 Done-when (silent on it); "no speculative abstractions" rule.

- **Decided**: the "back off advice fires only when two or more inputs are worse than 1 SD" clause is approximated by each sub-score's own driver-text threshold (e.g. resting-HR delta >=5, a sub-score below 0.4) rather than literally counting how many of the present sub-scores sit below a shared "1 SD worse than the midpoint" cutoff.
  **Why**: the six sub-scores are computed on different native scales (some are already z-score-derived 0-1 mappings, others like recovery-pct are direct ratios), so a single shared "1 SD" cutoff across all of them would need an invented, universal definition of what "1 SD" means on a ratio-based sub-score — there isn't one to reuse from the plan. Per-component thresholds, each already tied to that component's own stated formula, are the closer reading; the outcome (drivers only listed for genuinely bad inputs) matches the clause's intent even if not its literal mechanism.
  **Source**: plan 6.4 (back-off clause); no plan text defines "1 SD" generically across heterogeneous 0-1 sub-scores.

- **Decided**: found and fixed a real bug rather than a scope decision — `readiness()`'s "today's target muscles" originally fell back to *every* muscle when nothing was scheduled, and `recoveryStatus()` returns every never-trained muscle at 100% recovered; together this silently padded the recovery sub-score toward 1.0 whenever no split was scheduled, diluting genuinely bad signals (verified: a fixture with badly elevated resting HR alone came out "amber" instead of "red" until fixed). Target muscles — and the recovery/soreness sub-scores that depend on them — are now empty (not computed) when nothing is scheduled, rather than defaulting to the whole body.
  **Source**: a failing unit test caught this before it shipped (see COACHING-PROGRESS.md); not a plan-interpretation question.

- **Decided**: the check-in sheet (F2.2) asks for soreness per muscle in today's *scheduled split* (typically 2-4 chips, one rating each) rather than one single overall soreness number, even though F2.2's own text calls it "3 taps."
  **Why**: `readiness()`'s check-in sub-score explicitly consumes "soreness of today's target muscles" (6.4) — per-muscle data, matching the `CheckIn.soreness: Partial<Record<MuscleId, 1-5>>` shape P1-R already built. A single overall number would satisfy the "3 taps" framing but silently starve the very sub-score this sheet exists to feed. The sheet stays fast (rating chips, one tap each) even when it's a few muscles rather than exactly one.
  **Source**: plan 6.4 (check-in sub-score: "soreness of today's target muscles"); `core/models.ts`'s existing `CheckIn.soreness` shape (P1-R).

- **Decided**: `readiness.today`'s green "positive note once a week" fires on Monday specifically, rather than tracking "last shown" in persisted state.
  **Why**: a deterministic, stateless once-a-week cadence (today is the first day of the ISO week) needs no new `AppState` field and no dismissal bookkeeping, unlike the weekly-review card's own "once per calendar week" mechanism (P2-C) which genuinely needs persistence because it's dismissible and must not reappear after a "seen" action. A pure insight with no dismiss action doesn't have that requirement.
  **Source**: "no scope beyond the phase" rule; contrast with P2-C's `weeklyReviewDismissedWeek` (a materially different requirement: dismissible vs. purely periodic).

## P4

- **Decided**: `deloadTrigger()` (F3.3) is built from existing primitives rather than the parallel, more literal spec in plan section 6 (`brain/deload.ts`'s own subsection): condition (a)/(b) reuse `plateauStatus()` (P2-C's trend/plateau detector, already computing "no e1RM/weight improvement over recent sessions" from `topKg`+`volume` trend) and `effortDrift()` (P2's effort-trend detector) instead of a fresh 7-day-vs-28-day e1RM window comparison; condition (c) reuses this phase's own new `weeklyMuscleSets()`/`volumeBands()`; the HRV-collapse condition from that same subsection is not built at all.
  **Why**: the F3.3 feature bullet (section 4) and the `brain/deload.ts` subsection (section 6) list overlapping but not identical trigger conditions for the same function — resolution order step 1 (nearest analogous rule) points at reusing already-built, tested primitives over inventing a second e1RM-window comparator that would duplicate `plateauStatus()`'s job. The HRV condition is dead code on the GT6 for the same reason `overreachingFlag()`/F2.3 were deferred in P3 (Appendix E: no RR intervals from this hardware).
  **Source**: plan section 4 (F3.3 bullet) vs. section 6 (`brain/deload.ts` subsection); P2-C's `trend.ts`/`plateauStatus()` and P2's `effort.ts`/`effortDrift()` as the reused primitives; P3's Appendix E precedent for the HRV condition.

- **Decided**: the deload prescription is fixed at `setFactor: 0.6, loadFactor: 0.9` rather than a range.
  **Why**: the F3.3 bullet says "minus 30 to 40% sets and minus 10% load" (→ sets ×0.6-0.7, load ×0.9) while the `brain/deload.ts` subsection says "sets × 0.5 to 0.6, load × 0.85 to 0.9" — two different ranges for the same prescription. `0.6`/`0.9` sits inside both ranges' overlap, so it satisfies either reading rather than picking one plan passage over the other.
  **Source**: plan section 4 (F3.3 bullet) vs. section 6 (`brain/deload.ts` subsection: prescription line).

- **Decided**: `suggestNext()`'s new deload branch sits right after the `gap > 28` reentry check (before the bodyweight/accessory branch), so it covers weighted and bodyweight/assisted/conditioning modes but never fires for `duration` mode, since that mode already returns earlier in the function (before the reentry check even runs).
  **Why**: the plan says only "order after reentry," which is satisfied by this placement; restructuring the function so duration-mode could also reach the deload branch would touch an unrelated, pre-existing code path for a mode that isn't a "main lift" in the sense F3.3 is written for (isometric holds don't have a "load" to cut by `loadFactor`, only a duration).
  **Source**: plan section 6 (`brain/progression.ts` changes: "Order after reentry"); existing `suggestNext()` control flow (duration's early return predates this phase).

- **Decided**: F3.3's "closes itself" is read-time gating (`activeDeload` in `selectors.ts` returns `null` once `today > endDay`), not a mutation that clears `AppState.deload` when it expires.
  **Why**: every reader (`deloadOffer()`, the Train suggestion calls, the Coach `DeloadCard`) already goes through a computed/derived value, so gating there is sufficient for every acceptance criterion the plan states ("progression targets... for 7 days... a week later the coach closes it and returns to normal targets") without adding a write path (and its own trigger — on session start? on app open?) purely to keep the stored record tidy. The stale record staying in `AppState.deload` after it expires is harmless: nothing reads it as active past `endDay`, and a later real deload overwrites it wholesale.
  **Source**: "no scope beyond the phase, no speculative abstractions" rule; F3.3's own acceptance wording (closes itself → normal targets, not → clears the field).

- **Decided**: F3.2's volume bands use `trainingLevels()`'s existing 7-level scale (New/Beginner/Developing/Established/Advanced/Elite/Master) even though the plan's band table (section 4's F3.2 bullet and section 6's `data/volume.ts` note) only lists 5 named levels. `volumeBands()` clamps any `levelIndex` above 4 (Advanced) to the Advanced band.
  **Why**: reusing `trainingLevels()` (P0's existing per-muscle level computation, already used by Body → Levels) rather than building a second, competing level scale just for volume bands is the "existing code convention" resolution; the plan gives no landmarks past Advanced, so extending the last known band is the only reading that doesn't invent new numbers.
  **Source**: plan section 4 (F3.2 bullet: 5 named bands) and section 6 (`data/volume.ts`: "bands by level as listed in F3.2"); `brain/exposure.ts`'s pre-existing `LEVELS`/`trainingLevels()` (7 levels, P0).

- **Decided**: `programming.volume` (the F3.2 coach insight) only fires for a muscle that is a primary muscle of some exercise in one of the user's own splits, not for every muscle `muscleVolumeStatus()` flags 'under'/'over'.
  **Why**: without that filter, an untrained muscle with a stale, tiny 4-week median could read as "under" purely from wording, which is noise rather than the "far under or over its band" the F3.2 bullet describes for a muscle the user is actually training. Scoping to the user's own program keeps the insight's premise ("your usual range") literally true.
  **Source**: plan section 4 (F3.2 bullet: "when a trained muscle is far under or over its band").

- **Decided**: F3.6's "Not now"/snooze and "Helpful" feedback is per-insight-`id`, and the "Earlier this month" log renders a label derived from the id's stable prefix (e.g. `volume:chest` → "Volume", `decline:lib_barbell_bench_press` → "Decline") rather than the insight's own title/means/action text at the time it fired.
  **Why**: `InsightFeedback` only ever needed `{id, day, verdict}` for the actual behavioural requirement (snoozed hides for 7 days, tested in `coach.test.ts`); storing each insight's full rendered text at feedback time would be a second, parallel copy of data the rules pipeline already owns and can re-derive differently tomorrow (e.g. a decline insight's exact numbers change every day). The log is a receipt of "what you tapped," not a replay of what it said.
  **Source**: F3.6 bullet ("a small insight log in Coach"), read against "don't design for hypothetical future requirements" — a full-text cache is unrequested scope.

- **Decided**: F3.4's warm-up rows and F3.5's in-session cue both key off the *live* entry's most recent prior e1RM/exercise metadata computed fresh in `EntryCard`, not off the pre-session brief's own `warmupRamp()`/`pickCue()` calls from `preSessionInsights()` — the two are independent computations of the same underlying data (`warmupSets()` is shared; the cue is not tracked/cached between the two call sites).
  **Why**: the pre-session sheet and the live session are different mounts (a sheet dismissed, then hours or days later the entry card renders); trying to thread one computation's result through as state to the other would need new plumbing for a purely cosmetic consistency guarantee (both computations are deterministic given the same inputs, so they already agree in practice — same e1RM in, same ramp out).
  **Source**: "no scope beyond the phase" rule; `warmupSets()` extraction itself *is* the shared primitive both call sites use, which is the actual point of doing the extraction.

- **Decided**: F3.5's "track shown cues per exercise to rotate" is read as seeding `pickCue()` by `${today}|${exercise.id}` (so the pick changes day to day, deterministically, per exercise) rather than persisting a "recently shown cue ids" list in `AppState` or in-memory.
  **Why**: this is exactly the convention Coach.tsx's own pre-existing "Coach tip" card already uses (`${today.value}|${cueSeed}`) for the same rotation goal; matching an established in-repo convention outranks inventing a new persisted-state mechanism for a cosmetic rotation feature with no acceptance test tied to it in section 7.
  **Source**: existing code convention (`Coach.tsx`'s pre-existing cue-rotation seed, predating this phase); "existing convention" resolution-order step 2.

- **Decided**: F3.7's exercise substitution is reachable two ways — always, via a "Substitute exercise" action in the exercise's menu sheet; and proactively, via a warning line ("Still recovering (N%). See substitutes...") shown only when that exercise's primary muscle's recovery is below 60%, reusing the same 60% threshold `progression.ts` already uses for `readinessBlocksIncrease`. The "or an insight suggests balance work" half of F3.7's trigger list (surfacing a substitute action directly from the `balance.imbalance` Coach insight) is not wired up.
  **Why**: the recovering-muscle path covers the concrete, already-computed signal (`recoveryPctFor()`, already read in `EntryCard` for `suggestNext()`'s own `recoveryPct`), reusing an existing threshold rather than inventing a new one. Wiring the balance insight to the same picker would need `InsightSheet` to know which *specific* exercise/muscle to substitute for a lopsided-work insight that is about a muscle group, not one exercise — a real design question (which of several accessory exercises does "add pull work" even mean to substitute?) rather than a mechanical wiring gap, so it is left for a later pass rather than guessed at.
  **Source**: plan section 4 (F3.7 bullet: two trigger conditions); `progression.ts`'s pre-existing `recoveryPct < 60` threshold (P3) as the nearest analogous rule for "recovering."

- **Decided**: substituting an exercise mid-session (`substituteEntry()`) blanks that entry's sets (kg/reps/effort all cleared) rather than trying to carry over the old exercise's logged numbers.
  **Why**: a different exercise's load and rep numbers are not comparable (e.g. swapping a barbell bench press for a pec fly) — carrying them over as placeholder targets would show a wrong "last time" hint and a wrong pre-filled load. A blank slate is the same experience as `addExerciseToSession()` already gives a freshly added exercise.
  **Source**: existing `addExerciseToSession()` convention (P0) for how a new entry starts; correctness (a swapped exercise has no valid "last time" of its own yet).

- **Decided**: F3.8's morning readiness notification only ever computes and injects a readiness summary for **today's** occurrence of the reminder; every other pre-scheduled day (the sync horizon is 8 weeks) keeps the plain "ready when you are" body.
  **Why**: local notifications must be scheduled with fixed text ahead of time, but `readiness()` depends on health/check-in data that, for a day 2+ days out, has not happened yet — there is no server push to recompute it closer to send time. `resyncReminders()` already runs on app boot and on `pageshow` (P0's existing wiring), so today's body is refreshed with a same-session-fresh readiness snapshot every time the app is opened, which is the closest this architecture gets to "at the reminder time." A stale multi-day-old snapshot for a future day would be actively misleading, so it is deliberately not attempted.
  **Source**: plan section 4 (F3.8 bullet: "readiness summary at the reminder time"); `native/notifications.ts`'s pre-existing 8-week scheduling horizon and `main.tsx`'s pre-existing `resyncReminders()` boot/pageshow calls (both predate this phase); technical constraint (local notifications have no server-side recompute).

## Post-P4 fix: kg decimal input

- **Decided**: extracted a shared `WeightInput` primitive (`ui/primitives.tsx`) that holds its own draft text while focused, instead of a plain `<input value={kgToDisplay(kg)}>` bound straight to the parsed-and-rounded number.
  **Why**: user-reported bug — typing "23.5" always became a whole number. Root cause: the input's `value` was derived from `kgToDisplay(parseFloat(typed))`, so the moment a trailing "." was typed (parses to the same integer), the very next render snapped the field back to the integer text before a following digit could land, discarding the fraction. Fixed by keeping the field's visible text as local state, re-syncing from the committed kg only while not focused (on blur, or an external kg change while unfocused) — this is not a plan item, just a pre-existing bug in code this phase's own kg inputs are adjacent to. Reused in all three affected call sites (`Train.tsx`'s live entry and past-session entry, `History.tsx`'s past-session editor).
  **Source**: user report; not a plan section (bug fix, not new scope).

## Boot crash: `addListener(...).catch is not a function` (2026-09-22)
- On device, `Capacitor.Plugins.WatchBridge.addListener` returned a bare handle, not a Promise, so the chained `.catch` threw during boot.
- Decision: never chain `.catch` onto a plugin call directly. `listen()` in `src/native/watch.ts` wraps it in `Promise.resolve(...)` inside a try; `isSupported`/`status` get the same treatment, and so does the LocalNotifications tap listener. A missing or odd plugin now turns live HR off and never blocks boot.

## Escobar v2: reset and architecture (2026-09-22)
- Phase E (the port of the old Escobar onto this brain) was reverted at the owner's request (`4d8ff4e`, a revert commit, so the history stays intact). The boot-crash fix `decec92` stays.
- Escobar is to be rebuilt fresh on this brain from `docs/ESCOBAR-ARCHITECTURE.md` (phases EV0–EV9). That document's §24 lists the decisions already taken. An adversarial review against the code and the Claude API docs was folded into it before commit.
- Model default `claude-opus-5`, with refusal fallbacks on by default (`fallbacks: 'default'`). Both are env-configurable in the Worker. v2 is deployed into the existing Worker `marc-coach` (the owner's call), which keeps its API-key secret. The owner runs the deploy; agents never wait for it.

## Escobar v2

### Decisions already made (ESCOBAR-ARCHITECTURE.md §24, logged at EV0)
1. Revert and rebuild rather than port (owner, 2026-09-22). v2 deploys into the existing Worker `marc-coach`, which keeps its secret; the owner deploys, agents never wait.
2. Model `claude-opus-5` for every mode, adaptive thinking, effort per mode (chat medium, plan high, live/brief/moment/summarize low); env-configurable.
3. Refusal fallbacks on by default (`fallbacks: 'default'`, beta `server-side-fallback-2026-07-01`), with the §12.3 compatibility check.
4. Client-side tool execution through a stateless single-step Worker. Data stays local; the Worker owns policy.
5. `show` is a tool, not markup; chips and citations are markup.
6. Numbers: fact ledger + citations + one repair round, never silent deletion.
7. `strict: true` on action/memory tools and `evaluate_plan`; read/show tools non-strict with app-side validation; no numeric/length keywords in schemas; `eager_input_streaming` off.
8. Brief as a mid-conversation system message, persisted once per user turn, diffed between full briefs, carrying the mode addendum and decisions; `<situation>` fallback for models without support.
9. Manifest sent by the app, cached 1 h; tool schema changes need a Worker redeploy (shared schema + sync test).
10. Tab id stays `coach`; label and icon become Escobar.
11. Proactivity: ≤ 2 moments shown/day, ≤ 3 wording calls/day, quiet hours 22:00–07:00, no new push notifications.
12. Old thread imported once as "Earlier conversation".
13. Photos never touch localStorage; sent once, then a permanent stub.
14. Staged user turns and orphan closing keep API history valid on every exit path.
15. Sharing toggles default off until the user taps Enable.
16. Mixed-unit gyms (§25): per-exercise/per-gym entry unit, display unit global, `LoggedSet.entered` stores exactly what was typed, loadable targets, slip detection, Escobar sets equipment profiles.

### EV0
- **`escobar.memoryEnabled` added to `EscobarState`** (not in §6.1's field list). §17.2 needs a persisted "Escobar may remember things I tell him" toggle that makes `remember` return denied; it belongs with the rest of the coach's settings. Default `true` (memory writes are already visible with Undo, §2.3).
- **Normalisation lives in `src/core/escobarState.ts`** (`normalizeEscobar`), called from `store.ts`'s private `normalize()`. Keeps `normalize()` private while making the per-field repair unit-testable directly.
- **Conversation store extras:** `Conversation.pendingDecisions` (the §10.3 decision queue, read by the next brief) and `rollingSummary` (§11.4 request-side compaction) are stored on the conversation, not in messages, so history stays append-only. `setEscobarStorage()` lets the gate's mock use an in-memory store (§23 EV5).
- **Size accounting uses UTF-16 length × 2** as the byte estimate: WebView localStorage quotas are counted in UTF-16 code units, so this is the conservative measure.
- **Cap victim order:** summarised conversations first (oldest first), then the oldest; the active conversation is never dropped by the count cap and goes last under the size guard.
- **Backup:** Settings export adds `escobar: exportAllEscobar()` next to `state`; restore calls `restoreEscobar()` only when the file has an `escobar` key (older backups leave the store alone); Reset everything clears the store.

### EVU (Plate Sense)
- **Display rounding changed with the storage fix.** `displayToKg` now keeps 3 decimals for both units (§25.3). `kgToDisplay` rounds kg to 0.01 (so 1.25 kg steps and 23.75 kg survive) and lb to 0.1 (a 3-decimal kg converts back to the typed lb exactly). The old 0.5 rounding would have re-created drift for 1.25 kg plates. Logged sets additionally carry `entered`, and `setLoadIn`/`formatSetLoad` show it verbatim in its own unit.
- **`units` normalisation sits next to `normalizeEscobar`** in `core/escobarState.ts` (`normalizeUnits`, `normalizeProfile`): same per-field repair style; pre-Plate-Sense states get one gym "My gym" with the old global unit as its default (§25.3). Profiles for unknown gym ids are dropped; ladders sort ascending (≤ 80), plates descending (≤ 12), add-ons ≤ 6, `barKg` kept only in 5–30.
- **Snapping lives in a wrapper around `suggestNext`**: the existing rules run unchanged (`suggestRaw`), then an optional `loadFactor` (§10.4; added here rather than in EV2 because it shares the same post-processing seam) and an optional `equipment` snap apply. Direction: `up` for `increase`, `down` for `reduce`/`deload`, `nearest` otherwise (hold/confirm/start/reentry/plateau keep the load, so nearest is the honest reading of "keep it").
- **Loadable sets are enumerated, not searched**: ladders as given; barbells as bar + 2 × every per-side plate sum (unbounded pairs, DP in hundredths, 180 kg / 400 lb per side); stacks as multiples of `step` (from one step up) plus every add-on subset. Cached per profile. Beyond the ladder a target clamps to its end.
- **`plateBreakdown` is greedy per side (per §25.4) with a 0.02-unit tolerance**, so a 45 lb bar stored as 20.412 kg still reads 225 lb as "45 + 45 lb".
- **Autoregulation never "adds load" to the same rung**: when snapping lands on the current target, it steps to the next rung in that direction.
- **`suspectAlternative`**: ~2.2× → the typed number was lb (`{unit:'lb', value: kg}`); ~0.45× → kg typed into an lb field (`{unit:'kg', value: kg/0.4536 rounded to 0.1}`).
- **`inferGym`** uses `logging.trainedAt` (the real training time, not when it was logged), local weekday and time of day, a circular ±120 min window, 56 days back; ties go to the most recent.
- **The unit pill shows only the active unit** ("lb"), tap to flip, long-press (550 ms) for the whole equipment group. A two-segment `kg | lb` pill does not fit inside a ~75 px set-grid input at 360 px; the single-unit pill keeps the typed number readable. The 44 px tap area comes from a transparent `::before` overhang.
- **Flipping an exercise's unit resets its ladder, plates and bar to the new unit's built-ins** (a 45 lb bar with lb plates), because the old ones describe equipment in the other unit. Hand-tuned or scanned profiles are only replaced by an explicit flip.
- **The slip chip is computed in Train, not from stored `flags`**: `flagsForSet` is not called by any slice today, so the chip checks `unitSuspect(set.kg, best of the last 3 sessions' top loads)` on committed sets. "No, kg" is remembered for the rest of the app session (in memory); "Yes, lb" converts the set (`entered` = the typed number in lb) and saves the exercise's unit with source `suspect_fix`.
- **Gym pre-selection runs once per app session** on Train idle (only with 2+ gyms), so a manual switch is never overridden while the app stays open.
- **The Settings row button reads "Manage"** (not "Open") so the existing gate's `Open` lookup for Profile stays unique.

### EV1 (Palace)
- **`settingsOpen`/`profileOpen` are getter/setter objects, not `computed`**: existing callers write `.value = true`, which a read-only computed cannot take. Reads go through `openPanel.value`, so components still subscribe.
- **All sheet panels render from `App.tsx` (`Panels`)**, so a palace target opens them from any tab; `go(tab)` clears the panel only when the tab actually changes. `exercise-stats` is a History view (seg forced to Stats, exercise preselected), not a sheet.
- **Body's map view and History's segment moved into router signals** (`bodyView`, `historySeg`) so targets can say `{view: 'week'}` or `{seg: 'stats'}`.
- **Panel params left out are filled from the data** (`resolvePanelParams`): the last session for `session`, the last session's first exercise for `exercise-stats`, chest for `muscle`.
- **Live-session features anchor on the way in**: warm-up, swap, rest, plate math, unit pill, effort and finish only exist during a session, so their entries spotlight `train.start` (the Start button when idle, the live header when a session runs) and carry `how` steps. Every anchor is then verifiable by the gate.
- **Today's Coach section always renders** (with a quiet empty state), so `today.coach` has a stable anchor.
- **The weekly review sheet opens as a panel even when the card is hidden** (fewer than 5 days logged): it then says nothing stood out.
- **Closing open Sheets generically** dispatches `cancel` on every open `dialog.sheet`, which runs each Sheet's own `onClose`, so local sheet state stays consistent.
- **`openSheets` counter lives in `ui/primitives.tsx`** next to `Sheet` (the dock in EV5 reads it).
- **69 registry entries** cover every tab section, panel, Settings row group, and the §7.1 key actions.

### EV2 (tools and brain additions)
- **`evaluatePlan` counts secondary muscles at `ROLE_WEIGHT.secondary` (0.55)** as §8.3 says, while the Body tab's effective sets use `SET_WEIGHT.secondary` (0.5). The 10% difference only matters at band edges; the spec's number is kept and the constant is imported, not copied.
- **"Over 7 days" is read as "more than 7 splits"** (`too_many_splits`, the app's `MAX_SPLITS`); a 7-key schedule cannot hold more than 7 days. Unknown schedule refs and a plan with no training day also block.
- **Under-band warnings only for muscles the plan trains as a primary target, or the six big ones** (chest, lats, quads, hamstrings, glutes, side delts). Secondary-only muscles (forearms, traps, rotator cuff) would otherwise flood every plan with warnings.
- **A "hard day" for a muscle = 3+ direct sets**; two such days in a row (Saturday → Sunday wraps) is a 24 h recovery conflict (a warning, not a block: §8.3 lists blocks explicitly).
- **Score** = 100 − 30 per block − 8 per warn − 2 per info, clamped 0–100; used only to compare drafts.
- **Brain speed-ups found while building the tools** (six months of PPL, 156 sessions, Node): `coachInsights` 3.1 s → 58 ms, `recoveryStatus` 184 → 38 ms, 5-day `readinessSeries` 750 → 63 ms. Causes: `findExercise` re-normalising every library name on each name lookup, and `parseDay`/`daysBetween` re-parsing the same day strings thousands of times. Fixes are behaviour-preserving memos: `normalizeName` results, name → exercise per custom list (WeakMap by array identity; custom lists are replaced immutably), and day key → local-midnight ms. `systemicFactor` computes its reference day once. All existing tests unchanged and green. Tools must answer in well under a second on a phone, and Today already runs these.
- **Method constants are exported from the code that uses them** (readiness weights and bands, heart zones/rest, fidelity gaps, Epley divisor and RIR table, warm-up ramp, re-entry days, recovery hold %, plateau window, balance thresholds, weekly-review days, deload factors in `data/deload.ts`) so `explain_method` never copies a literal.
- **Tools run on a `ToolCtx` (state + now), not on signals** (`escobar/tools/context.ts`), so every tool is pure and testable; derived views (recovery, readiness, coach context) are memoised per context.
- **`show` summaries live in `tools/show.ts` now (EV2), rendering comes in EV6.** The executor needs the drawn data as the tool result; EV6 components render from the same `summarize()`.
- **Executor is synchronous and runs in block order**, so fact ids stay deterministic even when the loop runs read tools "in parallel" (they are local and sync).
- **Memory, snooze and escalation are returned as effects/instructions**, never written by the executor; the loop/UI applies them (with Undo) so the executor stays pure.
- **`lookup_knowledge` facts are labelled `k:<card id> …`** so the verifier can treat a `⟦k:id⟧` citation as grounding for that card's numbers (§14.4).
- **Proposal ids come from the conversation's proposal count** (`p1`, `p2`, …) for replayable scenarios.
- **Mode addenda live app-side** (`escobar/context/modes.ts`) because the app builds the brief's `mode:` line; `scripts/escobar-tools.mjs` copies them into the Worker's generated file (EV3) so there is one source.
- **Knowledge cards cite sources by title and year only** (no URLs) to avoid linking to wrong pages; every number in a card also appears in its statement (tested), and debated topics are rated `debated`.
- **Brief lines are diffed without fact ids**; ids are assigned only to lines actually sent, then renumbered so the ledger stays sequential.
