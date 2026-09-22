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
