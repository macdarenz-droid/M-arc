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
