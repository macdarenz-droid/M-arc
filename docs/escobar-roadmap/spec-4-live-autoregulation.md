# Live autoregulation: targets that answer the sets just logged

> Offer one conservative adjustment to the remaining empty rows of an exercise. Accept changes targets, never the numbers the person already entered.

**Rank:** 4 · composite 23.5 · design effort 5/10 · network never.
**Prerequisites:** the shared `src/brain/live.ts` from specs 1–2 and feature 10's plan-capture work item. The finish debrief UI is not a prerequisite. Existing source baseline is `c3f4675`; named NEW exports below do not yet exist.

## User story

My first bench set misses its 60 kg × 8 target by two reps and I mark Max. Under that row Escobar offers “That set was 60 kg × 6 at max effort. Use 57.5 kg × 8 for the remaining empty sets?” I can accept or dismiss. The recorded 60×6 stays exactly as logged, and the split stays unchanged. The rest banner and the remaining row placeholders agree afterward.

## Brain work

APPEND to `src/brain/live.ts`. Reuse `loadStep`, `repRange`, `Suggestion` from `src/brain/progression.ts`, `isWorkingSet` from exposure.ts; import core `Exercise`, `LoggedSet`, `PlanSetTarget`, and `GoalId`. Types and signatures:

```ts
export interface LiveAdjustment {
  key: string;
  sourceSet: number;
  direction: 'down' | 'up';
  reason: 'max_below_target' | 'easy_above_target';
  actualKg: number; actualReps: number; targetReps: number;
  next: PlanSetTarget;
  remainingIndices: number[];
  remainingSets: number;
}
export function effectiveSetTarget(
  base: readonly PlanSetTarget[], overrides: Array<PlanSetTarget | null> | undefined, setIndex: number,
): PlanSetTarget | null;
export function autoregulate(input: {
  exercise: Exercise | undefined; goal: GoalId;
  sets: LoggedSet[]; targets: PlanSetTarget[]; sourceSet: number;
  deloadActive: boolean; decisionTaken: boolean; historyBacked: boolean; allowIncrease: boolean;
}): LiveAdjustment | null;
```

`effectiveSetTarget` returns a defensive numeric copy of a valid override at that row, else the base set at `Math.min(setIndex, base.length - 1)`, else null. Invalid negative/noninteger index → null. This is the sole target resolver used by EntryCard and spec 2's restNext selector once this feature lands. For planned sessions base is snapshotEntry.targets directly. For legacy display only, map the existing Suggestion.sets to PlanSetTarget fields; legacy has no autoregulation offer. Do not call applyDeload on captured targets again. Extend nextAfterRest with an optional fourth parameter `effectiveTargets?: ReadonlyArray<PlanSetTarget | null>`; when supplied, use that vector at nextIndex and otherwise preserve spec 2’s Suggestion fallback. Both EntryCard and restNext build the vector using effectiveSetTarget. Add NEW `isReducedTarget(original: PlanSetTarget | null, effective: PlanSetTarget | null): boolean` in live.ts: true when either comparable non-null kg or reps decreases, otherwise false; spec 12 calls it. This is the only new target-reduction comparison.

Algorithm:

1. Return null when decisionTaken, paused session (caller gate), source index invalid, unknown exercise, mode other than weighted, no captured history-backed plan, invalidated comparison mapping, or no later row is entirely untouched. An untouched row has no defined kg/reps/duration/distance/effort: a typed weight alone is a user draft and is protected even though isWorkingSet returns false.
2. Require finite positive actual kg, integer reps >0, an actual effort, finite positive target kg and integer target reps. Match actual kg to its own target within `LIVE_TARGET_LOAD_EPS_KG = 0.01`. Training at a deliberately different load is not a failed target.
3. Down: source effort max and source reps ≤ target reps − `LIVE_MISS_REPS = 2`. Offer one `loadStep(actualKg)` down, rounded to the nearest half kg, floor zero; if result ≤0 or not less, return null. Keep the target reps within repRange. This is a suggestion from an observed miss, not an inferred fatigue diagnosis.
4. Up: require the source and at least one earlier working row of this exercise to be effort easy, at their corresponding target loads, and each ≥ target reps + `LIVE_SURPLUS_REPS = 2`; no working row has max effort. Require two qualifying rows (`LIVE_UP_MIN_SETS = 2`), no active deload, and allowIncrease from the captured plan entry. Offer **one rep** above the current target, bounded by repRange upper limit; do not offer a higher load mid-session. At upper limit → null.
5. Offer applies only to later untouched indices. Return complete new target, exact source actuals, source targetReps, count and indices. Key is canonical JSON of exercise id, source index, source set numeric/effort fields, original target and remaining indices; never a random ID or clock. Proposal repetition is controlled by the explicit decision state, not hidden exposure tracking.
6. One accept/dismiss decision per exercise slot per session. Replaced exercise gets a new planEntryId and a fresh opportunity. No recomputation loops inside the brain or mutation on rendering.

All thresholds NEW in `src/brain/coach/bands.ts`; existing `loadStep` and `repRange` are unchanged. Do not turn this into a new progression model.

## Contract changes

No FindingKind, ProposalKind or payload changes. This live offer follows accept/dismiss interaction without entering the global report. Uses feature 10's optional entry `targetOverrides`, `coachDecision` and snapshot `acceptedTargets` fields. Keep original `targets` immutable.

NEW slice exports in `src/slices/workout/session.ts`:

```ts
export function acceptLiveAdjustment(
  entryId: string, expectedStartedAt: string, offer: LiveAdjustment,
): boolean;
export function dismissLiveAdjustment(
  entryId: string, expectedStartedAt: string, offer: LiveAdjustment,
): boolean;
```

Use the snapshot goal in autoregulate; active deload gating is true if either the captured plan was deloaded or a deload is active now. Both re-read current active state and locate the stable planEntryId. Re-run autoregulate against current source and protected rows, compare key, and return false without writes on mismatch. Accept copies only targetOverrides for validated untouched rows plus snapshot acceptedTargets, sets coachDecision accepted, then flushSave. Dismiss writes only coachDecision dismissed and flushes. Neither writes LoggedSet, split, past session or coach acceptance maps. No undo action that would overwrite subsequent edits; the person can always type a different actual value.

## Files to create / modify

Create `tests/live-autoregulation.test.ts`, `tests/live-adjustment-apply.test.ts`.
Modify `src/brain/live.ts`, `src/brain/coach/bands.ts`, `src/slices/workout/session.ts`, `src/slices/workout/Train.tsx`, `src/app/selectors.ts` (restNext only), `docs/COACH_BRAIN.md`. Core fields are owned by spec 10 capture and must already exist; do not recreate them elsewhere.

`EntryCard` stores the offered LiveAdjustment in component state. Invoke the pure helper after a successful existing reps-blur commit or an explicit effort tap on a working set, using freshly read state. Do not add a kg blur commit. Effort button order: existing setSet → spec 2 regradeRest → evaluate this offer. No synthetic session appended to history. Input edits invalidate the visible offer if its key no longer matches. Hidden on navigation/reload until another explicit log event; accepted/dismissed decisions persist. The restNext selector reads overrides but not the one-second clock.

## UI spec

One `.hint` plus wrapping two-button row beneath the source set, using Button and existing theme tokens. No sheet, toast-only prompt, animation or haptic for appearance. Buttons: `Use this target` / `Keep my targets`. The empty space disappears when ineligible or dismissed. After acceptance: “Target updated for the remaining empty sets.” A stale tap says “The set changed; review the new target.”

| Template | Placeholder source |
|---|---|
| `That set was {actualLoad} × {actualReps} at max effort.` | actualKg via formatLoad; actualReps and reason from LiveAdjustment |
| `Use {nextLoad} × {nextReps} for the remaining {remainingSets} empty sets?` | next.kg/next.reps and remainingSets returned by brain |
| `Those easy sets cleared their targets. Add one rep to the remaining empty sets?` | reason easy_above_target; next.reps is brain value, not prompt arithmetic |

Show the exact resulting targets on both direction variants. Copy calls them suggestions, not measurements or guarantees. During an active deload only the down branch is eligible. PR-in-reach (spec 12) yields its row slot while an autoregulation offer is visible, and remains suppressed after a downward acceptance. Do not build a general attention governor.

## Data flow

Explicit set event → fresh active/plan → autoregulate → component-only offer → user decision → compare current evidence key → slice update of target metadata only → effectiveSetTarget → placeholders and rest banner → finish copies original and accepted plans → debrief. Structural row edits invalidate overrides while preserving a prior decision as specified in feature 10; deleting or replacing the entry prevents stale actions. Reload preserves accepted targets without generating new actual sets.

## Network and offline behaviour

Identical with online coach off, offline or exhausted quota. No `/ask`, `/explain`, retry, cache or new privacy surface. Old active sessions without a saved plan continue normal logging without this offer; the next explicitly started session becomes eligible.

## Tests to write

- `max miss offers one load step and never rewrites actual`: 60×6 vs target60×8, max →57.5×8, accept leaves actual unchanged.
- `a different load is not a target miss`; `weight-only and effort-only later drafts are protected`.
- `two easy surplus sets offer one rep within the goal band`; one qualifying set and upper-limit targets →null.
- `deload blocks upward offers and permits conservative downward offers`; targets are not double-scaled.
- `one decision per slot survives restart`; replacement receives new identity.
- `stale source edit rejects acceptance`; `shifted array cannot redirect a target`; `new session cannot accept an old offer`.
- `effective target matches banner and row including extra-row fallback`; `legacy active has no invented plan`.
- Playwright `log rate accept navigate reload finish`: actual values unchanged, placeholders and banner consistent, debrief shows original and accepted targets.

## Acceptance criteria

- [ ] Every named test in this spec passes, including empty, legacy, edited and deleted history.
- [ ] Only the explicit actions described above mutate state; all new brain functions are pure.
- [ ] App and proxy typecheck, both full test suites, production build, five-theme visual gate, and live Playwright feature checks pass. Run `npm run typecheck`, `npx tsc --noEmit -p proxy/tsconfig.json`, `npm test`, `npm --prefix proxy test`, `npm run build`, then `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` (use an installed Chromium path if different).
- [ ] Live verification covers kg/lb, 360px and 390px, keyboard access, navigation away/back, reload/resume, backup export/import and the explicit accept/dismiss path. Inspect screenshots in all five themes; no overflow or console errors. No new component-test framework.
- [ ] Append a dated `docs/COACH_BRAIN.md` decision entry stating actual behavior and deploy consequence; commit this feature, push, and verify CI for that exact commit. No Worker deploy for this spec.

## Do NOT

- Do not put suggestions into input values; HTML placeholders remain separate from actuals.
- Do not change suggestNext, loadStep, goal bands or accepted deload rules.
- Do not infer a diagnosis, readiness drop or session-wide fatigue from one miss.
- Do not generate offers on every keystroke, every render or timer tick, or reset dismissal on a tab change.
- Do not treat weight-only drafts as empty, or use render-time indices when accepting.
- Do not increase load mid-session, adjust already-filled rows, rewrite the template, or spend a network call.
- Do not duplicate live.ts, export it through the brain barrel or implement candidate 27's adaptive learner.
