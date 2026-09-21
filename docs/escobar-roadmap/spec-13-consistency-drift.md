# Consistency drift: the training day that faded

> Describe a change in logged weekdays, then offer a schedule move only when the replacement day is supported by the logs.

**Rank:** 13 · composite 20.5 · design effort 5/10 · network never.
**Status:** proposed implementation against `c3f4675`. Keeps existing learned schedules and reminders; adds a precise longer comparison.

## User story

“Friday appeared in 7 of the older 8 weeks and 2 of the recent 8” names a pattern I might have missed. If my logs now support Saturday for the same split, I can move the scheduled slot there or dismiss the suggestion. No guilt, missed-session claim or automatic reminder change.

## Brain work

Type owners: `BrainContext` in `src/brain/coach/context.ts`; `Finding`, `Proposal` and their unions in `src/brain/coach/contract.ts`; `Session`, `Exercise`, `Weekday` in `src/core/models.ts`; `MuscleId` in `src/data/muscles.ts`. Import only the types used by this module.

Existing `learnHabits`, HabitDay/HabitModel live in `src/brain/coach/detectors/habit.ts` (not src/brain/habit.ts). Its default history is twelve weeks, and olderProbability/recentCount do not represent two eight-week windows. Do not relabel those values.

Append to existing `src/brain/weekly.ts`:

```ts
export interface TrainingWeek {
  from: string; to: string; days: Weekday[]; activeDayCount: number;
}
export function trainingDaysPerWeek(sessions: Session[], today: string, weeks = 16): TrainingWeek[];
```

Return exactly `weeks` completed Monday–Sunday windows, oldest first, excluding the current partial week and future logs. Bound integer weeks to 1..52. Count unique weekday dates with at least one working set anywhere in the session; duplicate sessions on a day count once. Return zero weeks within the observation period; no interpolation. Caller handles insufficient observation span.

Append to `src/brain/coach/detectors/consistency.ts`:

```ts
export function detectConsistencyDrift(ctx: BrainContext, model?: HabitModel): Finding[];
```

Add NEW bands in `src/brain/coach/bands.ts`: DRIFT_WINDOW_WEEKS=16, DRIFT_HALF_WEEKS=8, DRIFT_MIN_OLDER=6, DRIFT_MAX_RECENT=3, DRIFT_MIN_DROP=3, DRIFT_DEST_MIN_WEEKS=6, DRIFT_DEST_SPLIT_WEEKS=4. Require a valid working session on or before the first of the sixteen complete weeks (the first partial observed week cannot be treated as fully observed). Compare older eight against recent eight. Candidate weekday has olderCount≥6, recentCount≤3, drop≥3. Select largest drop, then olderCount, then WEEKDAYS order; at most one finding. Severity 1, confidence high for older≥7/recent≤2 else medium. Target weekday; subject `{}`; evidence all working sessions on this weekday inside the two windows. Metrics: weekday, olderCount, recentCount, olderWeeks=8, recentWeeks=8, dropCount, olderFrom, olderTo, recentFrom, recentTo. These are logged attendance facts, not proof of the historical schedule.

Add `HabitDay.recentProbability: number` and compute it from the existing loop's weighted numerator/denominator for k≤HABIT_COLD_WEEKS, including only eligible past dates. Initialize to 0, round2 like olderProbability. Keep the existing all-window probability, cold retirement and planner behavior unchanged. This field improves transparency of the existing model; the sixteen-week drift detector does **not** consume it.

Append to `src/brain/coach/planners/schedule.ts`:

```ts
export function planConsistencyShift(ctx: BrainContext, model: HabitModel, drift: Finding | undefined): Proposal | null;
```

Require drift.kind consistency_drift and an existing scheduled split on the source weekday. Among currently empty other weekdays, require logged training in ≥6 recent eight complete weeks and ≥4 of those weeks with that exact existing split. Also require model.days[destination] with the same splitId (for established start time). Choose most same-split weeks, then most attended weeks, then WEEKDAYS order. Add scalar destinationWeekday/destinationCount/destinationSplitCount to the detector's metrics when this evidence exists; compute this candidate in a NEW pure exported `consistencyDestination(ctx: BrainContext, source: Weekday, model: HabitModel): { day: Weekday; weeks: number; splitWeeks: number } | null` in the same detector module, called by detector and planner with one learned model passed where available. Exact signature for detector may accept optional model: `detectConsistencyDrift(ctx: BrainContext, model?: HabitModel): Finding[]`.

Proposal uses existing kind schedule, subject `{}`, apply.days only `{source:null,destination:LearnedDay}` populated from model.days. basedOn drift id, expiry addDays(today,7), suffix `drift-${source}-${destination}`; keep normal schedule dismissKey so schedule proposals share cooldown. If this proposal exists, suppress ordinary planSchedule for this report (one schedule proposal, no competing patch). If no safe destination, retain the finding with no new schedule action; ordinary existing planner may run independently.

## Contract changes

NEW FindingKind `consistency_drift`; add FINDING_KINDS entry and mapping to existing principle `habit_formation_and_cues` in contract.ts and its reverse findingKinds array in `src/data/principles.json`. Add CATEGORY_OF mapping `consistency` and wordsFor branch in words.ts. Add detector to detectors/index.ts; planner to planners/index.ts; report registers both using its existing learned model. Do not add ProposalKind or bump the wire version.

For this schedule action, acceptProposal must recompute the current drift proposal before applying and require exact days equality with the displayed proposal. A changed source split, occupied destination, expired proposal or deleted split returns “Your schedule changed. Review a fresh suggestion.” Do not fall back to the first split. Preserve all five unrelated weekdays and their learnedStarts; clear the source start and use the existing destination time. Existing reminder resync runs only after successful explicit acceptance. Dismiss uses existing memory/spec 9 if installed.

## Files to create / modify

Modify `src/brain/coach/bands.ts`, `src/brain/weekly.ts`, `src/brain/coach/detectors/consistency.ts`, `src/brain/coach/detectors/habit.ts`, `src/brain/coach/detectors/index.ts`, `src/brain/coach/planners/schedule.ts`, `src/brain/coach/planners/index.ts`, `src/brain/coach/report.ts`, `src/brain/coach/contract.ts`, `src/brain/coach/words.ts`, `src/data/principles.json`, `src/slices/coach/apply.ts`. Create `tests/consistency-drift.test.ts`; extend `tests/coach-habit.test.ts`, `tests/coach-apply.test.ts`, `tests/principles.test.ts`, `tests/coach-explainer.test.ts`. Existing Coach InsightSheet/SuggestionSheet present the result; no new screen or reminder subsystem.

## UI spec

| Copy | Placeholder source |
|---|---|
| `{day} is less common in your logs` | WEEKDAY_LABEL[metrics.weekday] |
| `{day} appeared in {older} of the older {olderWeeks} complete weeks and {recent} of the recent {recentWeeks}.` | Explicit finding counts/window sizes |
| `This describes logged sessions; your past schedule was not saved.` | Literal limitation |
| `Move {split} from {source} to {destination}?` | Current verified split.name and proposal days |
| `{destination} appeared in {weeks} recent weeks, including {splitWeeks} with {split}.` | Destination metrics, not HabitDay.count from a different window |
| `Move the scheduled day` / `Not now` | Explicit accept/dismiss |
| `No schedule change suggested.` | No supported destination; finding only |

Details use formatDay on exact older/recent window endpoints. No red “failed”, broken streak or push notification. Existing insight/card limits still apply.

## Data flow

Saved sessions → sixteen complete training weeks → one drift finding → current schedule + recent split votes + learned start → optional partial schedule proposal → existing Coach sheet → tap → fresh revalidation → schedule and reminder resync. Today changes only after explicit acceptance.

## Network and offline behaviour

Zero new calls. Offline/off/quota exhausted use identical deterministic copy. Existing optional report explanation may receive only scalar metrics, not individual sessions or past schedule guesses. All numbers are explicit metrics; ordinary grounding tests must pass without loosening validation.

## Tests to write

- `seven of older eight and two of recent eight triggers Friday drift`.
- `fifteen observed complete weeks and initial partial week do not qualify`.
- `multiple sessions on one day count once and empty sessions do not count`.
- `current week and future dates never depress the recent denominator`.
- `largest drop wins with stable weekday tie-break`.
- `recentProbability uses the existing recent window and preserves retirement`.
- `same-split Saturday evidence produces only a two-day schedule patch`.
- `occupied destination deleted split expiry or changed schedule blocks acceptance`.
- `unsupported destination is informational and never clears the old day`.
- `ordinary and drift schedule proposals never compete`; `dismissal leaves reminders unchanged`.
- `every copy number has a scalar metric and registered research reference`.

## Acceptance criteria

- [ ] Every named test in this spec passes, including empty, legacy, edited and deleted history.
- [ ] Only the explicit actions described above mutate state; all new brain functions are pure.
- [ ] App and proxy typecheck, both full test suites, production build, five-theme visual gate, and live Playwright feature checks pass. Run `npm run typecheck`, `npx tsc --noEmit -p proxy/tsconfig.json`, `npm test`, `npm --prefix proxy test`, `npm run build`, then `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` (use an installed Chromium path if different).
- [ ] Live verification covers kg/lb, 360px and 390px, keyboard access, navigation away/back, reload/resume, backup export/import and the explicit accept/dismiss path. Inspect screenshots in all five themes; no overflow or console errors. No new component-test framework.
- [ ] Append a dated `docs/COACH_BRAIN.md` decision entry stating actual behavior and deploy consequence; commit this feature, push, and verify CI for that exact commit. No Worker deploy for this spec.

## Do NOT

- Do not call twelve weeks two groups of eight, count sessions as weeks, or include the unfinished current week.
- Do not infer injury, motivation, adherence to an unsaved schedule or why a weekday changed.
- Do not move a split into an occupied day, copy the first split as fallback, or clear unrelated days.
- Do not rebuild habit learning, add notifications or restore shipped audit work.
