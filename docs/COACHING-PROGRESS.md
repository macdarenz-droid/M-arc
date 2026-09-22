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

## Next: Phase P2-C (Coach v2) — NOT STARTED
Sections to read next: 6.12 (CoachContext v2, metrics.ts), 6.13 (insight catalogue).

## Not started
P2-C, P1, P2, P3, P4.
