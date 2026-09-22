# Session debrief: plan versus actual on the finish screen

> Keep the existing session receipt and add an honest comparison with the targets actually shown before logging. Never regenerate a historical plan from the workout that just finished.

**Rank:** 10 · composite 21.2 · design effort 6/10 · network never.
**Status:** proposed implementation, verified source baseline `c3f4675`. Existing files/exports below exist at that baseline; everything labelled NEW must be created. The plan-capture work item is a prerequisite of spec 4 and authoritative skip evidence in spec 6; the finish UI can ship later. This is part of feature 10, not an extra feature.

## User story

After finishing Push I see “Plan and actual” beneath the saved duration/exercises/sets. Bench says “Target 60 kg × 8; logged 60 kg × 6”, with a neutral note when fewer reps accompanied a heavier load. An old session says “Targets were not saved for this session” rather than inventing what Escobar told me. An accepted live adjustment is visible separately from the original target.

## Brain work

NEW `src/brain/debrief.ts`. Import `BrainContext` from `src/brain/coach/context.ts`, `Session`, `Exercise`, `ResistanceMode`, and the new plan types from `src/core/models.ts`; use existing `exerciseHistory`, `summarizeSets` from `src/brain/history.ts`, `isWorkingSet` from `src/brain/exposure.ts`, `suggestNext` from `src/brain/progression.ts`, `applyDeload` from `src/brain/coach/deload.ts`. No selectors, store, clock or random IDs in this module.

NEW core types (declarations below belong to models.ts, never import the brain at runtime):

```ts
export interface PlanSetTarget {
  kg: number | null;
  reps: number | null;
  durationSec: number | null;
}
export interface WorkoutPlanEntry {
  id: string;
  exerciseId: string;
  name: string;
  mode: ResistanceMode | null;
  origin: 'start' | 'added' | 'replacement';
  replaces?: string;
  plannedSets: number;
  targetSource: 'history' | 'starter' | 'unavailable';
  allowIncrease: boolean;
  targets: PlanSetTarget[];
  excluded?: 'skipped' | 'removed' | 'replaced';
  acceptedTargets?: Array<PlanSetTarget | null>;
}
export interface WorkoutPlanSnapshot {
  version: 1;
  capturedAt: string;
  goal: GoalId;
  deload: CoachState['deload'];
  entries: WorkoutPlanEntry[];
}
```

NEW debrief exports, exact signatures:

```ts
export interface PlanEntryInput {
  id: string; exerciseId: string; name: string; plannedSets: number;
  origin: WorkoutPlanEntry['origin']; replaces?: string;
}
export function capturePlanEntry(ctx: BrainContext, entry: PlanEntryInput): WorkoutPlanEntry;
export function capturePlan(ctx: BrainContext, entries: PlanEntryInput[], capturedAt: string): WorkoutPlanSnapshot;
export interface DebriefSet {
  setNumber: number;
  planned: PlanSetTarget | null;
  accepted: PlanSetTarget | null;
  actual: PlanSetTarget;
  result: 'met' | 'below' | 'different_load' | 'uncomparable';
}
export interface DebriefExercise {
  planEntryId: string | null; exerciseId: string; name: string;
  plannedSets: number | null; loggedSets: number;
  targetSource: WorkoutPlanEntry['targetSource'] | 'missing';
  excluded: WorkoutPlanEntry['excluded'] | null;
  rows: DebriefSet[];
  tradeoff: { previousKg: number; actualKg: number; previousReps: number;
    actualReps: number; previousVolumeKg: number; actualVolumeKg: number } | null;
}
export interface SessionDebrief {
  sessionId: string; hasPlan: boolean; plannedSets: number | null;
  loggedSets: number; comparableSets: number; metSets: number;
  exercises: DebriefExercise[];
}
export function sessionDebrief(session: Session, prior: Session[], custom?: Exercise[]): SessionDebrief;
```

Capture algorithm:

1. The slice allocates `newId('pe')` per live entry. After accepted `CoachChange[]` have been applied by `startSession`, build a `BrainContext` from state **before** the session is logged. Pass the local start day and start time explicitly.
2. Resolve each exercise with `findExercise` from `src/core/exercises.ts`. For a known exercise compute `applyDeload(suggestNext(ctx.sessions, id, ctx.goal, ctx.today, plannedSets, ctx.custom), ctx.deload, ctx.today)` once. Keep the unscaled suggestNext result long enough to set allowIncrease=true only for history-backed modes increase/reps/hold/confirm, with no captured active deload. All other modes, including unknown/starter, set false. Expand/copy its set targets to the actual planned row count using the last target for overflow, matching Train's existing index rule. Do not change suggestNext's history-based set-count behavior.
3. `targetSource` is history only when `exerciseHistory` contains a working session; otherwise starter. Unknown exercise: mode null, unavailable, empty targets. Validate finite nonnegative loads/durations and positive integer reps when copying. Null represents unknown, never zero-as-unknown.
4. `capturePlan` deep-copies entries and the current deload object; it does not mutate its inputs. The original targets never change afterward. Accepted adjustments go in `acceptedTargets`, separately.
5. Match saved actuals by `planEntryId`, never by array position. No ID or invalid snapshot means unknown plan, even if today's split happens to look the same. Plan entries absent from actuals remain visible as skipped/removed/replaced or “No work logged”; they are not zero-load performance.
6. Compare against accepted target when present, original otherwise. Weighted: require equal finite load (tolerance `DEBRIEF_LOAD_EPS_KG = 0.01`) and target reps; equal-load reps ≥ target is met, less is below, different load is incomparable to that target. Duration compares duration only; bodyweight compares reps only. Assisted/conditioning are uncomparable in this first pass. Do not collapse load and reps into an invented score.
7. For weighted tradeoff, use the immediately preceding chronological session of the same exercise, excluding this session and every later one. Show tradeoff only when topKg increased, topReps decreased, and same-exercise kg×reps volume decreased; require positive valid loads/reps. Label the three observations, not “regression” or lost strength. `summarizeSets.volume` is mode-dependent; only use it here for weighted exercises.
8. Return all arithmetic in result fields. Stable order: captured plan order, then unplanned actual exercises. Fewer rows after History edits must not acquire another row's target: edits that remove/reorder working rows invalidate that exercise's comparison identity (see lifecycle below).

NEW `src/brain/coach/detectors/execution.ts`:

```ts
export function detectSessionExecution(ctx: BrainContext): Finding[];
```

Use the latest valid saved session at or before ctx.today, ordered startedAt then id; only within `DEBRIEF_FINDING_DAYS = 2`, and only with ≥`DEBRIEF_MIN_COMPARABLE_SETS = 3` history-sourced comparable sets. Compute sessionDebrief excluding current/later sessions. Emit one informational `session_execution` with target session.id, subject splitId/splitName, confidence medium, severity 0. Metrics: `plannedSets`, `loggedSets`, `comparableSets`, `metSets`, `belowSets` (precomputed), `sessionDay`. Evidence includes that session plus actually compared prior sessions. No claim about adherence for a starter target. Return [] when unknown; do not add to LOW_OK.

## Contract changes

- Add optional `plan?: WorkoutPlanSnapshot` to `ActiveSession` and `Session`, optional `planEntryId?: string` to live entries and `LoggedExercise`. Add optional `planComparisonValid?: boolean` on live entries; false disables per-set comparison/live adjustment after a structural removal. Absence on newly captured entries means valid; absence without a snapshot never creates a plan. No state version bump and no backfill.
- Live entries also reserve optional `targetOverrides?: Array<PlanSetTarget | null>` and `coachDecision?: { key: string; action: 'accepted' | 'dismissed' }` for spec 4. Spec 4 owns their mutation semantics; capture alone leaves them absent.
- Add `session_execution` to FINDING_KINDS and PRINCIPLES_BY_FINDING → `progressive_overload`. Add reverse membership on that existing principles.json card, category `progress` and a wordsFor case, export/register detector through detectors/index.ts and report.ts safe wrapper. No new ProposalKind. CONTRACT_VERSION remains 1.
- Session.plan remains device-only: no new payload field, no spreads of Session into metrics. Existing trimming emits scalar Finding.metrics and removes evidence.

## Files to create / modify

Create `src/brain/debrief.ts`, `src/brain/coach/detectors/execution.ts`, `src/slices/workout/SessionDebrief.tsx`, `tests/debrief.test.ts`, `tests/session-plan.test.ts`, `tests/coach-execution.test.ts`.

Modify `src/core/models.ts`; `src/slices/workout/session.ts` (startSession, addExerciseToSession, finishSession, skipEntry, removeEntry, spec 1 replaceEntry); `src/slices/workout/Train.tsx` (EntryCard's displayed original targets and FinishScreen); `src/slices/history/History.tsx` (SessionEditor comparison invalidation plus read-only debrief in the existing sheet); `src/core/store.ts` (narrow validation of optional snapshot metadata on load/import); `src/brain/coach/bands.ts`; the registration files listed above; `tests/coach-words.test.ts`, `tests/principles.test.ts`; create `tests/store-plan.test.ts`; `docs/COACH_BRAIN.md`.

Ownership/lifecycle details:

- `startSession` has a single explicit tap and flushSave; capture within that same update. Do not write a plan on render. Accepted today-only drops are not expected entries, so spec 6 cannot call them skips.
- Adding a live exercise captures its own plan at the Add tap, origin added. Replacing creates a fresh ID/plan, marks the previous one replaced and records `replaces`; never assigns its old targets to a different lift.
- skip/unskip updates excluded only on the user's tap. remove marks removed. Preserve immutable original target arrays and original plannedSets after addSet/removeSet; extra rows have no original target and are labelled additional. Appending a set preserves original row indices and original targets; its displayed extra-row fallback is a suggestion, never an additional original plan. Any structural set edit clears overrides; preserve an existing coachDecision so removing a row cannot resurrect a dismissed offer. Removing a row sets planComparisonValid=false for the entire entry. Thereafter use the ordinary legacy suggestion for display, suppress live adjustment/ramp/PR-in-reach, and save no actualSetIndices for that entry. Retain the original count and snapshot for aggregate facts.
- `finishSession` copies plan and IDs to the saved session, drops nonworking sets as before, flushes as before. For every valid mapped entry retain a parallel `actualSetIndices?: number[]` on LoggedExercise (NEW, original live row indices for kept sets); debrief uses those indices. No default reconstruction for a legacy session. History set removal invalidates this array for that exercise; its counts still display, per-set planned values become null.
- SessionEditor already spreads Session when saving. Preserve metadata on value-only edits; capture the source session object on editor open and compare its current object identity at Save; any intervening update asks the user to reopen the editor, with no write. This guards an intervening effort repair. If session was deleted, refuse to resurrect it. Delete/Undo preserves the exact saved snapshot.
- Validate optional plan metadata without discarding otherwise valid history: bad metadata → drop that metadata only. Store normalization must check arrays, enums, unique IDs, finite values and bounded row counts (NEW `PLAN_MAX_METADATA_SETS = 100` and `PLAN_MAX_METADATA_ENTRIES = 100` exported from models.ts; there is no MAX_SETS export in splits.ts). These bounds validate optional metadata only; exceeding them drops comparison metadata, never actual logged rows. Do not alter actual sets. Legacy backups load unchanged.
- FinishScreen currently destructures stale `summary.session`. Instead look up `state.value.sessions.find(s => s.id === summary.session.id)` each render. Missing saved session gets the existing empty-save receipt and no actionable debrief/repair. This is required for spec 11 to re-render accurately. `useMemo` depends on fresh session, sessions array and customExercises, never only summary.

## UI spec

Use Card, Row, Section and Button from `src/ui/primitives.tsx`, current theme tokens, and existing stack/hint styles. Keep the receipt, MuscleMap, note and Done button. Mount a new presentational SessionDebrief component between receipt and muscle section. Component props are `{ debrief: SessionDebrief; unit: 'kg' | 'lb' }` (alias the type to avoid name collision).

| Copy | Placeholder source |
|---|---|
| `Plan and actual` | Literal heading |
| `{loggedSets} working sets logged; {plannedSets} originally planned.` | SessionDebrief totals; omit planned clause when null |
| `{name} · {loggedSets} of {plannedSets} planned sets` | DebriefExercise fields; added/unplanned uses “sets logged” |
| `Target {load} × {reps}; logged {actualLoad} × {actualReps}` | row.planned and row.actual; formatLoad at render edge only |
| `Accepted target {load} × {reps}` | row.accepted; separate line, never relabel original target |
| `Heavier load, fewer reps and less total work than the previous session.` | tradeoff non-null; expandable exact six numeric fields, kg formatted |
| `Starting suggestion, not a target learned from your history.` | targetSource starter |
| `Targets were not saved for this session.` | hasPlan false; actuals still visible |
| `Not comparable after this session was edited.` | missing/invalid actualSetIndices on otherwise planned saved exercise |

Timed rows show seconds rather than × reps; null fields show “Target unavailable”, never 0. A below result is neutral text, not a red failure badge. No accept button on a retrospective fact. Optional “Show all exercises” is presentation state only; no prompt or network call.

## Data flow

Start tap → apply accepted day changes → allocate stable entry IDs → capturePlan from prior logs → active.plan persists → logging/explicit target acceptance preserves originals → Finish tap filters actuals with original indices → Session.plan/planEntryId/actualSetIndices persist → fresh lookup → sessionDebrief → finish/history component. Detector independently consumes saved data for existing Coach insights. Export/import, history edit/delete/undo and reload invalidate/recompute from that saved source.

## Network and offline behaviour

Zero calls, including finish and reopening. Existing optional note tagging remains tied to the note flow; do not trigger it for debrief. Off, offline, quota exhausted or proxy unavailable: identical debrief. If the user later requests an existing report explanation, only scalar session_execution metrics may travel; plan arrays and actual sets never do.

## Tests to write

- `captures the displayed deload target before the current session exists`: seed prior 60 kg target, active factor .85 → original target 51, never double-scaled.
- `restart and import preserve original targets`: after logging a heavier current session, restored original stays 51.
- `unlogged placeholders never become actual work`: untouched finish leaves history unchanged.
- `swaps and additions retain separate plan identities`: no transfer of old exercise targets or evidence.
- `empty-row filtering retains original set indices`: rows 0/2 saved map to targets 0/2, not 0/1.
- `value edits recompute facts while row removal drops comparison`: no stale cached verdict; deletion never resurrects session.
- `accepted live target does not overwrite original`: debrief shows both.
- `heavier but fewer reps and lower volume is descriptive`: 60×10×3 vs 62.5×6×3 gives tradeoff, never diagnosis.
- `starter and old sessions do not create adherence findings`; `duration is seconds and assisted is uncomparable`.
- `execution metrics survive payload trimming and grounding`: use buildPayload/allowedNumbers/validateText without editing them; all emitted numbers have explicit scalar fields.

## Acceptance criteria

- [ ] Every named test in this spec passes, including empty, legacy, edited and deleted history.
- [ ] Only the explicit actions described above mutate state; all new brain functions are pure.
- [ ] App and proxy typecheck, both full test suites, production build, five-theme visual gate, and live Playwright feature checks pass. Run `npm run typecheck`, `npx tsc --noEmit -p proxy/tsconfig.json`, `npm test`, `npm --prefix proxy test`, `npm run build`, then `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` (use an installed Chromium path if different).
- [ ] Live verification covers kg/lb, 360px and 390px, keyboard access, navigation away/back, reload/resume, backup export/import and the explicit accept/dismiss path. Inspect screenshots in all five themes; no overflow or console errors. No new component-test framework.
- [ ] Append a dated `docs/COACH_BRAIN.md` decision entry stating actual behavior and deploy consequence; commit this feature, push, and verify CI for that exact commit. No Worker deploy for this spec.

## Do NOT

- Do not call suggestNext on history containing the just-saved session to recover an old target.
- Do not backfill old plans from current templates or introduce a new storage version.
- Do not put snapshot targets into LoggedSet values or count warm-up suggestions as work.
- Do not replace the finish receipt or note flow, or call this feature a new AI endpoint.
- Do not reuse an array index as exercise identity after swaps/removal, or compare the nth saved set to the nth target after empty rows were dropped.
- Do not auto-change future targets from debrief results; self-calibrating progression is candidate 27, outside this workstream.
- Do not add raw sessions, plan snapshots, evidence IDs or body measurements to any payload.
- Do not weaken the grounding validator to make copy pass, or treat an edited/deleted session as still present via summary.session.
