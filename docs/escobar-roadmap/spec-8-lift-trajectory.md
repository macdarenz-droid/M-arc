# Lift trajectory: velocity, projection date and falsifiable expiry

> Show what the recent logged top-load trend would imply for one more load step, anchored to the last observation, with an expiry that does not roll forward every time the app opens.

**Rank:** 8 · composite 21.8 · design effort 4/10 · network never.
**Dependencies:** no live feature required. Existing source baseline `c3f4675`. This adds a projection to the existing progress surface and existing progressing metrics; it does not change progression targets.

## User story

Under my bench trend: “Logged top load is rising about 1.25 kg per week. If that rate holds, the next 2.5 kg step projects around 14 November. Reassess after 5 December.” If I do not log again, those dates remain anchored and the line eventually says it expired. It is a projection from past logs, not an instruction to attempt a heavier lift that day.

## Brain work

NEW `src/brain/trajectory.ts`. Imports Exercise/Session from models, exerciseHistory/modeOf from history, trend/Confidence from trend.ts, loadStep from progression, addDays/daysBetween from dates. NEW exports:

```ts
export interface LiftTrajectory {
  exerciseId: string;
  status: 'projected' | 'expired';
  points: number; from: string; lastDay: string;
  currentKg: number; stepKg: number; nextKg: number; kgPerWeek: number;
  projectedOn: string; expiresOn: string;
  confidence: 'medium' | 'high';
}
export function liftTrajectory(sessions: Session[], exerciseId: string,
  today: string, custom?: Exercise[]): LiftTrajectory | null;
```

NEW bands: `TRAJECTORY_POINTS = 12`, `TRAJECTORY_MIN_POINTS = 7`, `TRAJECTORY_MIN_SPAN_DAYS = 28`, `TRAJECTORY_MAX_HORIZON_DAYS = 84`, `TRAJECTORY_EXPIRY_DAYS = 21`, `TRAJECTORY_MAX_LAST_GAP_DAYS = 28`.

1. Only known weighted exercises. Filter future/invalid day keys, nonfinite/nonpositive loads and zero-work observations. Canonical history comes from exerciseHistory. Collapse same-day rows to their largest logged topKg (stable latest session tie); at most last 12 distinct days. Require at least seven over at least 28 days. Do not mix exercise IDs, assistance loads, duration or volume into a load trend.
2. Call existing `trend(points.map(({day,topKg}) => ({day,value:topKg})))`. Require direction up and confidence medium/high. **slopePerWeek is a relative fraction, not kg/week.** Recover the absolute slope with the same recency-weighted mean `sum(w_i * topKg_i)/sum(w_i)`, where `w_i = 0.5 + i / max(1,n-1)` exactly as trend.ts uses; absolute = relative slope × that mean. Do this in the new brain module, not JSX or a prompt. Keep raw slope for date calculation; round kgPerWeek to two decimals once for display. Nonpositive/rounded-to-zero →null.
3. Last observed topKg is currentKg. stepKg = existing loadStep(currentKg), nextKg = currentKg + stepKg rounded to the half-kg grid. Number of days = ceil((nextKg-currentKg)/rawKgPerWeek*7), bounded below by 1. If >84 →null; do not force distant predictions into the cap.
4. projectedOn = addDays(lastDay,days), expiresOn = addDays(projectedOn,21). Never anchor either to today. Same history yields same numbers/dates on every visit. Set expired when today >expiresOn OR daysBetween(lastDay,today)>28; retain the old endpoint fields only to explain expiry. New logged data recomputes a new projection. Edits/import also recompute; there is no forecast ledger or fake remembered forecast.
5. No prediction for an active easier week at the UI/report consumer, and no target mutation. The function itself receives history/day only; consumers call existing deloadActive before displaying or attaching projection fields. Missing evidence returns null.
6. This is specifically a **top-load** trajectory. Reps and setup can vary; include the fixed interpretation limitation. Do not call it a strength-gain velocity or a confidence interval. No new statistical estimator or extrapolated e1RM needed.

## Contract changes

No new FindingKind or ProposalKind. Extend only `progressing` findings in `src/brain/coach/detectors/progress.ts` when liftTrajectory returns status projected and no deload is active. Add scalar metrics: `trajectoryKgPerWeek`, `trajectoryCurrentKg`, `trajectoryStepKg`, `trajectoryNextKg`, `trajectoryPoints`, `trajectoryProjectedOn`, `trajectoryExpiresOn`. Keep existing metrics intact. Expired/null adds no projection metrics.

Do not put forecast dates into numeric year/month/day fields: allowedNumbers intentionally excludes date components. The local surface formats dates. In words.ts's progressing case, add a local offline sentence from the fields; cached remote text remains subject to normal rejection/fallback and does not gain new grounded digits from a date. Do not change validateText or allowedNumbers to accommodate date prose. CONTRACT_VERSION remains 1; proxy untouched.

## Files to create / modify

Create `src/brain/trajectory.ts`, `tests/trajectory.test.ts`.
Modify `src/brain/coach/bands.ts`, `src/brain/coach/detectors/progress.ts`, `src/brain/coach/words.ts`, `src/slices/history/History.tsx` (Stats exercise-progress card), `tests/coach-words.test.ts`, `tests/coach-detectors.test.ts`, `docs/COACH_BRAIN.md`.

Stats already computes selected exercise history. Memoize trajectory on sessions/exercise/customExercises/today and deload status. Do not change Sparkline data, existing trend labels, records or targets. No new chart package, new screen or settings toggle. Import by direct path; do not widen the barrel.

## UI spec

One wrapping `.hint` block below the current per-exercise history list. Never truncate the expiry so it cannot be read. Present tense always says “if”.

| Template | Placeholder source |
|---|---|
| `Logged top load is rising about {rate} per week across {points} logged days.` | kgPerWeek via formatLoad, points |
| `If that rate holds, {nextLoad} projects around {projectedDate}. Reassess after {expiryDate}.` | nextKg via formatLoad, projectedOn/expiresOn via formatDay |
| `This projection has expired; another logged session is needed to reassess it.` | status expired; do not show a fresh forecast date |
| `A past-load trend, not a scheduled target. Rep counts and equipment setup can affect it.` | Literal |

The ordinary card handles insufficient data; trajectory null adds no repeated “keep logging” banner. Easier week: no projection line, existing deload banner remains. No accept/dismiss action for a read-only estimate. No storage written when it appears or expires.

## Data flow

Saved exercise history → ordered distinct-day top loads → existing relative trend + identical weighted mean → absolute slope in brain → anchored dates → History Stats and additive progressing metrics → offline copy. New history/edit/import replaces the computed result; today only changes stale status, never moves an unchanged projection into the future.

## Network and offline behaviour

All calculation/display local. Existing optional explain sees scalar metrics only on explicit calls; no call on expiry or a new point. Offline/off/quota failure changes nothing. Dates are rendered locally; do not weaken the remote numeric/date grounding boundary.

## Tests to write

- `known linear top loads recover kg per week not a relative fraction`: weighted mean relation agrees with trend.ts.
- `six points fewer than 28 days flat down and unknown return null`.
- `same-day duplicates do not inflate evidence`; `future days and invalid loads are excluded`.
- `unchanged history keeps projectedOn and expiresOn across app opens`.
- `forecast expires on deadline or stale observation and never silently extends`.
- `new history and edited history recompute rather than reuse stale values`.
- `horizon beyond 84 days is not clamped into a confident prediction`.
- `assisted timed conditioning and bodyweight are excluded`; `deload consumer suppresses projection`.
- `progress finding preserves old metrics and adds only finite scalar values`; `date components do not enter allowedNumbers`.

## Acceptance criteria

- [ ] Every named test in this spec passes, including empty, legacy, edited and deleted history.
- [ ] Only the explicit actions described above mutate state; all new brain functions are pure.
- [ ] App and proxy typecheck, both full test suites, production build, five-theme visual gate, and live Playwright feature checks pass. Run `npm run typecheck`, `npx tsc --noEmit -p proxy/tsconfig.json`, `npm test`, `npm --prefix proxy test`, `npm run build`, then `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` (use an installed Chromium path if different).
- [ ] Live verification covers kg/lb, 360px and 390px, keyboard access, navigation away/back, reload/resume, backup export/import and the explicit accept/dismiss path. Inspect screenshots in all five themes; no overflow or console errors. No new component-test framework.
- [ ] Append a dated `docs/COACH_BRAIN.md` decision entry stating actual behavior and deploy consequence; commit this feature, push, and verify CI for that exact commit. No Worker deploy for this spec.

## Do NOT

- Do not print slopePerWeek as kg/week or multiply it in a prompt/UI component.
- Do not move the forecast anchor to today, persist a made-up previous prediction, or promise a PR date.
- Do not change suggestNext or schedule an automatic load increase.
- Do not merge top-load and e1RM/volume trajectories, infer muscle gain, or project assisted loads upward.
- Do not add a FindingKind, network route, raw history payload or validator exception for formatted dates.
