# Coaching implementation progress

Resume from this file, `docs/COACHING-DECISIONS.md` and `docs/COACHING-PLAN.md`. Never re-derive finished work — check "Items done" first.

**Phase order**: P0 → P0-P → P1-R → P2-C → P1 → P2 → P3 → P4.
**Layer order inside a phase**: data model → brain → native → UI → gate. Commit at each layer, push at end of phase.

PR: https://github.com/macdarenz-droid/M-arc/pull/2 (kept open across all phases; checklist updated after each phase).

## Phase P0 (Close the loops) — DONE
See prior revision of this file (git history) or the PR description for the P0 report. Summary: native health plugin now compiles into the APK (CI copy + manifest patch), `health.ts` bridge fixed to match the real plugin, `DailyHealth`/`healthDays` added, auto-sync on boot/pageshow/session-start, insights use the minute-quantised clock, profile gained `birthYear`.

## Phase P0-P (Profile and goal) — DONE

Sections read: 6.14 (onboarding + profile dashboard), 6.15 (profile history/propagation), 6.16 (goal audit and fix).

### Layer: data model — done, commit 0d3feb6
- `core/models.ts`: `Exercise.role`; `Profile.trainingSince`/`plannedDays`; `WeightEntry`, `ProfileField`, `ProfileChange`, `Onboarding`; `AppState.weightLog`/`profileHistory`/`onboarding`.
- `core/store.ts`: defaults for all of the above.
- `core/exercises.ts`: `roleOf()` derives main/accessory from the plan's pattern list (+ the hip-thrust exception); `makeCustomExercise()` takes an explicit role.
- `data/goals.ts`: `Goal` rewritten as the full 6.16 policy object; every goal now has `accessoryReps`.
- `data/templates.ts`: added `full_a`/`full_b`/`upper`/`lower`; exported `SplitTemplateKey`.

### Layer: brain — done, commit bebcefa
- `progression.ts`: `repRange()` reads `exercise.role` (fixes G3/G4); low-range step-down (G5) uses two-consecutive-sessions e1RM decline at max effort when the goal's main range starts at 1-2 reps.
- `onboarding.ts` (new): `profileCompleteness()`, `shouldShowOnboarding()` (first/partial/review triggers, 14-day suppression, 3-dismissal cutoff, 90-day review), `isWeightTypo()`.
- `coach/rules.ts`: `CoachContext.profileHistory`; new `profile.changed` rule (weight + goal only — see decisions).
- Tests: `tests/goal.test.ts` (20 tests, all 4 goals), `tests/onboarding.test.ts` (9), `tests/coach.test.ts` (5), updated `tests/balance-weekly.test.ts` call sites.

### Layer: native — N/A for this phase (no native code needed)

### Layer: UI — done, commits 8f1bc4f
- `slices/profile/profile.ts`: field setters recording `profileHistory`, `logWeight`, `changeGoal`/`applyGoalRest`/`addGoalTemplates`, onboarding dismiss/complete/review.
- `slices/profile/Onboarding.tsx`: the sheet (first/partial/review copy) and the details form.
- `slices/profile/Profile.tsx`: the dashboard (About you / Body / Training — see decisions for why Watch-and-health/Check-ins are omitted); typo guard on a >10% weight jump.
- `coach/Coach.tsx`: extracted `GoalSheet` (exported, shared with the dashboard); one-tap "Apply rest"/"Add templates" buttons after a goal change.
- `settings/Settings.tsx`: Profile section is now a link to the dashboard.
- `workout/ExercisePicker.tsx`: main-lift-or-accessory picker for custom exercises.
- `router.ts`/`App.tsx`/`selectors.ts`: `profileOpen` sheet state; `onboardingTrigger` signal (purely state-derived, so every exit path stops it reappearing without a separate "closed" flag).
- Verified manually with a scripted Playwright walkthrough (fresh state → onboarding → dismiss → Settings → profile dashboard → weigh in → change goal → apply rest → add templates → Coach shows the `profile.changed` insight): zero console/page errors, screenshots inspected visually.

### Layer: gate — done, commit a4af474
- `scripts/screenshot-gate.mjs`: every theme now dismisses the onboarding sheet (shown on the legacy fixture's incomplete profile) and screenshots it; profile dashboard screenshotted from Settings (silent-black); a separate fresh-state pass screenshots the onboarding form and a real goal-change insight (the legacy fixture's own priority-320 progress insights would otherwise outrank the priority-260 `profile.changed` insight out of the top 3 — correct behaviour, not a bug to route around).
- `npm run check`: **PASS** (typecheck, 76/76 tests across 12 files, production build).
- `npm run gate`: **PASS** — 5/5 themes, no page errors, legacy import verified, new screenshots confirmed visually (onboarding sheet/form, profile dashboard, goal-changed insight all render correctly).

### P0-P report
- **Built**: see the four layer sections above for exact files/functions.
- **Tested**: `npx vitest run tests/goal.test.ts tests/onboarding.test.ts tests/coach.test.ts` → 34 passed. `npm run check` → clean typecheck, 76/76 tests, build OK. `npm run gate` → 5/5 themes PASS. Manual Playwright walkthrough → 0 console/page errors, screenshots visually confirmed.
- **Decided by research**: full_a/full_b → strength, upper/lower → strength_muscle (standard programming heuristic, no primary source needed — see COACHING-DECISIONS.md).
- **Scoped down (recorded in COACHING-DECISIONS.md)**: `profile.changed` limited to weight/goal; `profileAt`/`ageAt`/`weightAt`/`profileDiff` deferred to their first real consumer; `goal` stays non-nullable; dashboard omits Watch-and-health/Check-ins; one-tap actions are sheet buttons, not toasts (toasts are hidden behind an open `<dialog>`'s top layer).
- **Needs device check**: none new in this phase (pure web/TS/UI, no native code touched).
- **Depends on this for later phases**: P1-R's fidelity classifier and set timestamps build on `models.ts`/`store.ts` in the same pattern; P2-C's `metrics.ts` (relative strength, weight trend) will consume `weightLog`/`profileHistory` and is the natural home for `profileAt`/`weightAt`; P1's watch profile sheet reuses the "profile completeness" pattern from `onboarding.ts`.

## Next: Phase P1-R (Recovery v2) — NOT STARTED
Sections to read next: 6.11 (recovery model), F3.1, 6.12.1 (data gaps — set timestamps, `trainedAt`/`loggedAt`, `weightLog` already added, `trainingSince` already added), 6.17 (logging fidelity).

## Not started
P1-R, P2-C, P1, P2, P3, P4.
