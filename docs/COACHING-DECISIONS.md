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
