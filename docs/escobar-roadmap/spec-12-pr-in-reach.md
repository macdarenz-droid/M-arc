# PR in reach: a pre-set record badge

> Show a reachable rep record beside an existing next-set target without asking for extra load or turning an unlogged target into a record.

**Rank:** 12 · composite 20.6 · design effort 3/10 · network never.
**Status:** proposed implementation; baseline `c3f4675`. Integrates after spec 4's effective target resolver. Existing records remain authoritative.

## User story

Before my next bench set, “9 reps at 60 kg would beat your previous 8” appears if that rep count fits my current target range. It disappears if today's easier targets make it unsuitable. A performed PR gets the existing recorded badge; a possible PR is never counted as one.

## Brain work

Extend `src/brain/prs.ts`, where `recordsFor`, `isLiveRecord` and private `repsAtLoadMap` already exist. Export repsAtLoadMap without changing its algorithm. Add:

```ts
export function repsAtLoadMap(rows: ExerciseSessionSummary[]): Map<number, number>;
export function liveRecordFrom(prior: ExerciseSessionSummary[], mode: ResistanceMode, set: LoggedSet): boolean;
export interface PrReach {
  kind: 'reps_at_load' | 'best_reps';
  kg: number | null; standingReps: number; requiredReps: number;
}
export function prReach(args: {
  prior: ExerciseSessionSummary[];
  mode: ResistanceMode;
  target: PlanSetTarget | null;
  repCeiling: number;
  earlierSets: LoggedSet[];
  deloadActive: boolean;
  reducedTarget: boolean;
}): PrReach | null;
```

ExerciseSessionSummary comes from `src/brain/history.ts`; core types include NEW PlanSetTarget from spec 10. liveRecordFrom is the existing isLiveRecord core after the history lookup: isWorkingSet → summarizeSets → recordsFor. Keep isLiveRecord's signature unchanged and delegate to it after exerciseHistory/modeOf. Differential tests must prove current results unchanged for all resistance modes; this is not a PR algorithm redesign.

NEW bands in `src/brain/coach/bands.ts`: `PR_REACH_EXTRA_REPS = 1`, `PR_REACH_MIN_HISTORY = 1`. Use them for the extra-rep allowance and minimum prior exposures.

prReach rules, in order:

1. No prior working history, missing target reps, active deload, accepted reduced target, non-finite numbers, or mode other than weighted/bodyweight → null. Assisted is deliberately excluded: different assistance amounts are not equivalent.
2. Weighted requires positive target.kg with an exact prior load match in repsAtLoadMap. Bodyweight uses maximum prior bestReps. New loads and first exposures are not standing rep records.
3. Include earlier working sets from this active entry in the standing rep maximum at the same load (or bodyweight). If any earlier set already broke the prior rep record, return null for the remaining entry: no repeated escalating challenge after today's success.
4. requiredReps=standingReps+1. Offer only when requiredReps≤target.reps+1 and ≤repCeiling from existing repRange(exercise,goal)[1]. A suggested target already above the standing record is eligible. Never change a target, load, effort or logged value.
5. Return at most one candidate for the earliest uncompleted row. UI additionally suppresses if that row has any user-entered value or effort, or the entry is done/skipped, its plan comparison was invalidated, or an autoregulation offer occupies this slot. This avoids a competing instruction during typing. Existing actual-record styling takes precedence.

Build prior history once per exercise per sessions/customExercises reference, with useMemo in EntryCard. Cache key also includes exerciseId so swaps invalidate it. Use liveRecordFrom with this same prior array for the existing actual badge; never call allRecords or exerciseHistory once per row on each keystroke. Memoize the history, not the changing current set/target. No wall-clock dependency.

## Contract changes

No FindingKind, ProposalKind, persistent metadata or wire change. PrReach is ephemeral. Read spec 4's accepted overrides through effectiveSetTarget; call spec 4’s isReducedTarget(original,effective) to determine reducedTarget. Use current goal and exact deload dates as other live features do.

## Files to create / modify

Modify `src/brain/coach/bands.ts`, `src/brain/prs.ts`, `src/slices/workout/Train.tsx`, `tests/prs.test.ts`; create `tests/pr-reach.test.ts`. A new small `src/slices/workout/PrReachHint.tsx` is the presentational component (props `{ reach: PrReach; unit: 'kg' | 'lb' }`, alias the type as needed). No proxy, store, models or selectors changes for this feature itself.

## UI spec

Place one quiet hint below the earliest eligible row's target, outside editable inputs. Use existing hint/info tokens; never reuse the solid “PR” actual-record badge. No modal, celebration, notification or accept button: this is conditional information. Entering a value dismisses the hint; actual work remains the user's action.

| Copy | Placeholder source |
|---|---|
| `{required} reps at {load} would beat your previous {standing}.` | PrReach.requiredReps, formatLoad(reach.kg,unit), standingReps |
| `{required} reps would beat your previous {standing}.` | Bodyweight candidate, no invented load |
| `Only if it feels right today.` | Literal optional second line |

The accessible text includes the full conditional wording. No unit conversion before comparing loads; no round-tripping through lb.

## Data flow

Saved history → exerciseHistory memo → repsAtLoadMap + current effective target → prReach → one conditional hint. Current set input → hide hint → existing liveRecordFrom check. Accepting spec 4's reduction invalidates the offer immediately. Swapping, deleting history, editing prior reps and changing goals recompute from their actual references.

## Network and offline behaviour

Zero calls and no quota use. Exactly the same hint offline and with remote coach off. No fallback invented record when history is absent.

## Tests to write

- `known 60 kg record of 8 offers 9 within target and goal ceiling`.
- `unknown load and first session produce no reachable PR`.
- `two reps beyond target and above goal ceiling are suppressed`.
- `earlier record today prevents another escalating rep challenge`.
- `assisted duration conditioning and active deload return null`.
- `accepted lower target hides reach without changing actuals`.
- `liveRecordFrom matches isLiveRecord across all modes and empty history`.
- `kg and lb render one identical underlying comparison`.
- `history lookup is per entry memo rather than per row or keystroke` (instrument the helper in a focused test; no benchmark suite).
- Live Playwright: `typing hides possible record while performed record keeps existing badge`.

## Acceptance criteria

- [ ] Every named test in this spec passes, including empty, legacy, edited and deleted history.
- [ ] Only the explicit actions described above mutate state; all new brain functions are pure.
- [ ] App and proxy typecheck, both full test suites, production build, five-theme visual gate, and live Playwright feature checks pass. Run `npm run typecheck`, `npx tsc --noEmit -p proxy/tsconfig.json`, `npm test`, `npm --prefix proxy test`, `npm run build`, then `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` (use an installed Chromium path if different).
- [ ] Live verification covers kg/lb, 360px and 390px, keyboard access, navigation away/back, reload/resume, backup export/import and the explicit accept/dismiss path. Inspect screenshots in all five themes; no overflow or console errors. No new component-test framework.
- [ ] Append a dated `docs/COACH_BRAIN.md` decision entry stating actual behavior and deploy consequence; commit this feature, push, and verify CI for that exact commit. No Worker deploy for this spec.

## Do NOT

- Do not call an unlogged target a PR or append it to history.
- Do not tell the user to go to failure, add load, override deload, or exceed the goal range.
- Do not compare assisted reps across assistance, kilograms against displayed pounds, or estimate a missing prior load.
- Do not build a second record engine or run allRecords in EntryCard render.
