# Week in review

> Close the last complete Monday–Sunday week with a comparison against this person's prior complete weeks, distinct from the existing online summary of current findings.

**Rank:** 7 · composite 22.5 · design effort 5/10 · network never.
**Dependencies:** none on live-session features. Source baseline `c3f4675`; NEW module and exports below. The historical schedule is not stored; describe current-schedule alignment explicitly rather than asserting that an old commitment was kept or missed.

## User story

On Monday I see “Last week: 3 workouts, 42 working sets. Your prior-week median is 36 sets.” The card names which weekdays have logs and the muscle whose effective sets changed most. This week's counters remain available with “Week in progress” instead of an ungrounded motivational grade.

## Brain work

Type owners: `BrainContext` in `src/brain/coach/context.ts`; `Finding`, `Proposal` and their unions in `src/brain/coach/contract.ts`; `Session`, `Exercise`, `Weekday` in `src/core/models.ts`; `MuscleId` in `src/data/muscles.ts`. Import only the types used by this module.

NEW `src/brain/coach/review.ts`. Use `weeklyVolumeHistory` from src/brain/weekly.ts, `weeklyMuscleSets` from exposure.ts, `weekStart`, `addDays`, `weekdayOf` from core/dates.ts, and median/round1 from detectors/shared.ts. Do not call allRecords or recordsInWeek in a render.

```ts
export interface WeekReview {
  start: string; end: string;
  workouts: number; activeDays: string[]; activeDayCount: number;
  sets: number; volumeKg: number;
  baselineWeeks: number; baselineSets: number | null; baselineVolumeKg: number | null;
  setsDelta: number | null; volumeDeltaKg: number | null;
  direction: 'more' | 'similar' | 'less' | 'insufficient';
  scheduledDays: number; alignedDays: number;
  scheduleBasis: 'current' | 'none';
  muscle: { id: MuscleId; sets: number; baselineSets: number; deltaSets: number } | null;
}
export function weekReview(ctx: BrainContext): WeekReview | null;
export function weekReviewCopy(review: WeekReview, unit: 'kg' | 'lb'): {
  title: string; summary: string; detail: string; schedule: string;
};
```

Algorithm with NEW bands: `REVIEW_BASELINE_WEEKS = 8`, `REVIEW_MIN_BASELINE_WEEKS = 4`, `REVIEW_SIMILAR_RATIO = 0.1`, `REVIEW_MIN_MUSCLE_DELTA = 1`.

1. Closed week start = addDays(weekStart(today),-7), end = addDays(start,6). Return null if no real working session exists on or before end. Ignore future sessions. Filter duplicate IDs deterministically, preserving stored data. Use all seven dates; Sunday end is inclusive.
2. weeklyVolumeHistory(sessions,end,9) gives last closed week plus eight earlier weeks, oldest first. Include genuine zero weeks between first tracking and the closed week. Exclude every baseline week whose Monday is before the first logged working day (the first partial observation week is not a full denominator).
3. Require four prior complete observation weeks for comparison; otherwise return totals with null baseline/deltas and insufficient direction. With sufficient baseline take medians of sets and volumeKg including zero weeks. Delta fields are computed in brain; direction compares sets to median ±10%, with median zero handled explicitly (positive closed sets →more, both zero →similar). This is descriptive, not a grade of training quality.
4. activeDays are sorted unique Session.day for working sessions in the closed week. workouts counts sessions, not days; two sessions on Tuesday count two workouts and one active day.
5. Use weeklyMuscleSets(sessions,end,9,custom), whose index 0 is the closed week, against the same eligible baseline weeks. Pick maximum absolute effective-set delta ≥1; stable MuscleId tie-break. It is a change in logged work, not muscle growth, recovery or a recommendation to fill a quota.
6. Current schedule comparison: for each weekday currently assigned to an existing split count it once; alignedDays counts closed-week dates containing any working session on those weekdays. Label basis current. Do not equate alignment with having completed that scheduled split or with a historical promise. No current schedule →none and omit sentence.
7. Missing logs are “no work logged”, not proof no training happened. Return all numeric deltas/denominators as fields. The copy function is deterministic offline words; unit conversion uses core/units formatLoad, no calculations in JSX.

NEW `src/brain/coach/detectors/review.ts`:

```ts
export function detectWeekClose(ctx: BrainContext, review?: WeekReview | null): Finding[];
```

One `week_review`, target review.start, subject {}, severity 0, confidence medium with enough baseline; with insufficient history use low and add week_review to LOW_OK because its totals remain factual and copy discloses the missing comparison. Emit scalar metrics for each visible numeric field (`activeDayCount`, sets etc.), `hasBaseline`, `scheduleBasis`, `start`, `end`, and optional `muscleId`, `muscleSets`, `muscleBaselineSets`, `muscleDeltaSets`. Do not emit null numeric metrics: omit unavailable comparisons. Evidence includes closed/baseline sessions actually used. No global Proposal.

## Contract changes

Register week_review in contract FINDING_KINDS/PRINCIPLES_BY_FINDING → volume_dose_response; reverse card membership, words CATEGORY_OF volume, wordsFor wrapper around the same scalar copy logic, detector export, report safe registration, low-confidence gate as above, principles/words tests and decision-log row. No top-level payload field or validator changes.

The prior decision log's discarded weekly remote-summary idea stays shipped as-is. This is an offline closed-week comparison with a defined window, not a duplicate endpoint or an automatic `/explain` call.

## Files to create / modify

Create `src/brain/coach/review.ts`, `src/brain/coach/detectors/review.ts`, `src/slices/today/WeekReview.tsx`, `tests/week-review.test.ts`, `tests/coach-review.test.ts`.
Modify `src/brain/coach/bands.ts`, `contract.ts`, `report.ts`, `words.ts`, `detectors/index.ts`; `src/data/principles.json`; `src/app/selectors.ts`; `src/slices/today/Today.tsx`; existing principles/words tests; `docs/COACH_BRAIN.md`.

Add `closedWeekReview` computed in selectors, fed only by a selected context of sessions/customExercises/schedule/today. Use computed sub-signals for each relevant object before the expensive projection so active typing/nowMinute does not invalidate it. Register detectWeekClose with the same pure function in buildReport, but do not make selectors import report or create a cyclic dependency. No persistent derived cache.

Today: replace the hardcoded grade title/note display with literal “Week in progress” / “Your logged work so far.” Keep the current week Stat counters. Render one closed-week Card after that current-week section. The full generic Coach insight may remain in its existing list; do not add another dedicated Coach review card.

## UI spec

Presentational WeekReview component receives `{ review: WeekReview; unit: 'kg' | 'lb' }` (alias type on import), uses Card, Button and existing stack/hint/row styles. Closed summary is visible; “Details” toggles the on-device comparison beneath it. Expansion is component state, not an engagement ledger. No accept action is needed for facts.

| Copy template | Exact field/source |
|---|---|
| `Last week · {start}–{end}` | review.start/end via formatDay |
| `{workouts} workouts on {activeDayCount} days; {sets} working sets.` | matching WeekReview fields |
| `Your prior {baselineWeeks} complete weeks had a median of {baselineSets} sets.` | baseline fields, only when non-null |
| `{volume} total logged load × reps, compared with a prior median of {baselineVolume}.` | volumeKg/baselineVolumeKg via formatLoad; label is volume, never PR |
| `{muscle}: {muscleSets} effective sets; prior median {muscleBaselineSets}.` | review.muscle, muscleLabel(id) |
| `{alignedDays} of the {scheduledDays} weekdays on your current schedule had logs last week. This compares with today's schedule.` | review current-schedule fields |
| `A few more complete weeks are needed for a personal comparison.` | insufficient baseline; no invented countdown |

No all-time percent change in copy unless a scalar field is added in brain and separately tested; this spec does not request it. Empty last week shows real zeros if prior tracking exists. No history means hide the closed review, keep the current screen's empty state. Full prose can wrap; the numeric counters do not overflow at 360px.

## Data flow

Local day rollover/resume → today selector → last complete week selection → logged working sets and prior closed-week medians → one review object → Today card and detector → existing report/words. Edit/delete/import recomputes from real data; the week key prevents comparing a partial current week with complete prior weeks. No “seen” marker or background scheduler.

## Network and offline behaviour

All primary UI works without the online coach. No added calls on Monday, open, finish or Details. Existing explicit explain may optionally phrase a retained week_review finding, but the closed card always uses its deterministic copy so quota/failure cannot remove it. No raw sets or body information in metrics.

## Tests to write

- `Monday closes the preceding Sunday and excludes this Monday`; `Sunday still reviews the prior complete week`.
- `DST local day keys keep Monday windows`; `two sessions same day are two workouts one day`.
- `baseline excludes partial first week and includes observed zero weeks`.
- `three baseline weeks show totals only`; `four enable medians`; `zero median never divides by zero`.
- `effective muscle sets match weeklyMuscleSets secondary half-weight`.
- `current schedule is labelled not rewritten into historical adherence`.
- `editing deleting importing logs updates the same week review`; `no sessions hides review`.
- `each printed metric is finite and payload-grounded`; `no new request on open or rollover`.

## Acceptance criteria

- [ ] Every named test in this spec passes, including empty, legacy, edited and deleted history.
- [ ] Only the explicit actions described above mutate state; all new brain functions are pure.
- [ ] App and proxy typecheck, both full test suites, production build, five-theme visual gate, and live Playwright feature checks pass. Run `npm run typecheck`, `npx tsc --noEmit -p proxy/tsconfig.json`, `npm test`, `npm --prefix proxy test`, `npm run build`, then `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` (use an installed Chromium path if different).
- [ ] Live verification covers kg/lb, 360px and 390px, keyboard access, navigation away/back, reload/resume, backup export/import and the explicit accept/dismiss path. Inspect screenshots in all five themes; no overflow or console errors. No new component-test framework.
- [ ] Append a dated `docs/COACH_BRAIN.md` decision entry stating actual behavior and deploy consequence; commit this feature, push, and verify CI for that exact commit. No Worker deploy for this spec.

## Do NOT

- Do not add a remote weekly-summary endpoint, scheduler, notification or quota charge.
- Do not compare a partial week to full weeks or silently remove true zero weeks.
- Do not claim old scheduled days were kept/missed when only today's schedule is known.
- Do not call volume a record, muscle-set changes muscle growth, or more work automatically better.
- Do not change the existing weekSummary calculation or other screens' historical behavior solely to remove Today's grade copy.
- Do not compute heavy allRecords work per render or persist the review as user data.
