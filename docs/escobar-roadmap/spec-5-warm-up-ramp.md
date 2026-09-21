# Warm-up ramp for the first heavy compound

> A compact preparation suggestion derived from a history-backed working target. It is not logged training, and it never creates sets for the user.

**Rank:** 5 · composite 22.9 · design effort 2/10 · network never.
**Prerequisites:** shared live.ts and spec 4's effectiveSetTarget. Use spec 10's captured target when present; legacy active state falls back to no ramp. All NEW exports below are proposed; existing source baseline `c3f4675`.

## User story

Opening my first loaded compound shows “Suggested ramp: 24 kg × 8 → 36 kg × 5 → 48 kg × 3; working target 60 kg.” It uses the 60 kg target from my log. I can hide it. Logging begins exactly where it did before, without automatically counting three warm-up sets in my volume or records.

## Brain work

APPEND `src/brain/live.ts`; reuse `COMPOUND_PATTERN` in bands.ts, `isWorkingSet` in exposure.ts and existing core Exercise/mode types. Import `PlanSetTarget`, `ActiveSession` and `BrainContext` as types.

```ts
export interface WarmupRamp {
  entryId: string; exerciseId: string; name: string;
  workingKg: number;
  sets: Array<{ kg: number; reps: number }>;
}
export function warmupRamp(input: {
  ctx: BrainContext; active: ActiveSession;
  targets: ReadonlyMap<string, PlanSetTarget | null>;
}): WarmupRamp | null;
```

Pure algorithm:

1. Return null when active.warmupDismissed is true or the session is paused. Inspect active entries in their current order; at most one ramp per session. Eligible means not skipped/done, known weighted exercise matching COMPOUND_PATTERN, stable planEntryId with planComparisonValid not false, captured targetSource history, finite positive effective first-set kg, and no working set already logged on that entry. Ignore unknown/assisted/bodyweight/duration/conditioning modes.
2. Working load must be ≥`WARMUP_MIN_WORKING_KG = 20`; this is a UI usefulness heuristic, not a physiological definition of “heavy”. Do not use body weight or estimated max. Any existing working set anywhere in the session suppresses the ramp: this conservatively limits it to initial preparation and avoids claiming to know whether a muscle is cold. Select the first eligible entry only.
3. Use `WARMUP_FRACTIONS = [0.4, 0.6, 0.8]` and `WARMUP_REPS = [8, 5, 3]`, NEW bands. Multiply the selected effective working load, round each down to `WARMUP_ROUND_KG = 0.5`; omit nonpositive/duplicate loads and any load ≥workingKg. Return null with fewer than `WARMUP_MIN_STEPS = 2` distinct useful steps.
4. No minimum barbell weight or available plates are known; show a suggested load and the literal caveat “Use the nearest lighter load your equipment allows.” Do not invent a 20 kg empty bar. The same calculation supports dumbbells/machines without claiming a particular increment is available.
5. If the active deload lowered the captured target, the ramp lowers with that effective target. Never applyDeload twice. Invalid/missing target →null, not a default ramp from startingLoadKg.

## Contract changes

No Finding/Proposal or proxy contract. Add optional `warmupDismissed?: boolean` to ActiveSession (in core/models.ts). NEW `dismissWarmup(expectedStartedAt: string): boolean` in workout/session.ts checks current session, then records only this explicit dismissal and flushSave. New sessions reset naturally; imported legacy sessions with no plan remain ineligible. Never store warm-up suggestions as LoggedSet and never add a warmup flag to historical data in this feature.

## Files to create / modify

Create `tests/live-warmup.test.ts` and `tests/warmup-dismiss.test.ts`.
Modify `src/brain/live.ts`, `src/brain/coach/bands.ts`, `src/core/models.ts`, `src/slices/workout/session.ts`, `src/slices/workout/Train.tsx`, `docs/COACH_BRAIN.md`.

Compute once per relevant active entries/targets change in LiveSession, using useMemo with explicit dependencies, not per EntryCard render. Pass the result to its single selected card. That card renders only when expanded; collapsing does not choose a new exercise. Once any working set exists it disappears. Dismissal is session-wide and survives navigation/restart. Add/remove/swap before logging recomputes which first eligible entry owns the ramp; no mutation during recomputation.

## UI spec

Inside the selected EntryCard, above the set-grid and below its existing reason, use a quiet `.hint` paragraph and Button size sm variant quiet, labelled “Hide warm-up”. Text wraps; use no new colour literal, chart, icon system or modal.

| Template | Source |
|---|---|
| `Suggested ramp: {steps}. Working target {workingLoad}.` | WarmupRamp.sets, each kg via formatLoad and reps verbatim; workingKg via formatLoad |
| `{load} × {reps}` | One ramp set; arrows are literal separators, not inferred logged chronology |
| `Use the nearest lighter load your equipment allows. These suggestions are not logged sets.` | Literal limitation |

No “Accept all sets” button; viewing preparation is read-only. Hide is the dismiss action. The user chooses whether to perform it and logs actual training through existing controls. Empty/ineligible result mounts nothing. No loading state. At 360px let the ramp wrap without pushing set inputs or effort buttons sideways.

## Data flow

Start tap → captured original target → optional accepted live overrides → effectiveSetTarget map → warmupRamp → single card. Hide tap → dismissWarmup → ActiveSession.warmupDismissed. First actual working set → next pure result null. Finish/discard removes the transient flag; no history rows or PR changes result from the ramp itself.

## Network and offline behaviour

Identical offline and with online coach disabled. No call, note tagging, payload, quota, caching or background trigger. Insufficient exercise history or a restored pre-snapshot active session means no ramp; ordinary targets/logging remain available.

## Tests to write

- `60 kg gives 24x8 36x5 48x3 without mutation`: deep-freeze input; output matches fields above.
- `first eligible compound only`; `any logged work suppresses initial ramp`.
- `starter loads and unknown exercises do not imply personal readiness`.
- `assisted duration conditioning and bodyweight remain silent`.
- `deload target lowers ramp exactly once`.
- `duplicates zero nonfinite and target-equal steps are removed`.
- `hide survives restart and never touches sessions or split`; stale session dismissal no-ops.
- Playwright `ramp hide log finish`: no extra sets in session count, records or weekly volume; kg/lb conversion only at render.

## Acceptance criteria

- [ ] Every named test in this spec passes, including empty, legacy, edited and deleted history.
- [ ] Only the explicit actions described above mutate state; all new brain functions are pure.
- [ ] App and proxy typecheck, both full test suites, production build, five-theme visual gate, and live Playwright feature checks pass. Run `npm run typecheck`, `npx tsc --noEmit -p proxy/tsconfig.json`, `npm test`, `npm --prefix proxy test`, `npm run build`, then `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` (use an installed Chromium path if different).
- [ ] Live verification covers kg/lb, 360px and 390px, keyboard access, navigation away/back, reload/resume, backup export/import and the explicit accept/dismiss path. Inspect screenshots in all five themes; no overflow or console errors. No new component-test framework.
- [ ] Append a dated `docs/COACH_BRAIN.md` decision entry stating actual behavior and deploy consequence; commit this feature, push, and verify CI for that exact commit. No Worker deploy for this spec.

## Do NOT

- Do not create warm-up rows, change isWorkingSet, exclude actual sets from records or invent a historical warmup flag.
- Do not claim injury prevention, predict injury or assert the user's muscles are cold.
- Do not use a starter load as personal evidence, raw body data or a 1RM percentage.
- Do not assume plate availability or a standard bar mass; never round a suggestion above its computed ramp load.
- Do not show ramps for several exercises or bring one back after an explicit session dismissal.
- Do not overwrite live.ts or add new network/prompt work.
