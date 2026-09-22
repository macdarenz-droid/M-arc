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
