# Morning verdict: the check-in answered against your own normal

> After the user explicitly taps Save, the check-in card swaps in place for one tinted line that reads today against this person's own 28-day normal — and, on an amber or red morning, exactly one sentence naming the thing it just changed, or admitting that nothing changed.

**Tier:** core · **Effort:** 1 to 1.5 focused days. The statistics (src/brain/readiness.ts) are about two hours and are the easy part. The real time sits in three places: (a) re-deriving the one broken readinessFactor test block and proving the other four blocks in tests/coach-readiness.test.ts still pass unedited; (b) the consequence attribution — the counterfactual field inside adjustedRecovery, the band-crossing filters and the plan-modification resolution through findExercise, plus the five copy branches including the honest 'nothing changed' one; (c) checking the blast radius of the new readinessFactor, which feeds adjustedRecovery, the `recovery` selector, the Body screen, detectUnderRecovered and planToday, so recovery percentages move app-wide for anyone with a baseline. Budget the last hour for the COACH_BRAIN.md decisions-log row and a live pass through `npm run gate`.
**Judged:** value 7/10 · effort 5/10 · fit 9/10 · fires daily · composite 24
**Source verification:** corrected against `c3f467571f958c54e6447c7182ebf15c007d5947` on 2026-09-21. See `03-SOURCE-VERIFICATION.md` for the reference inventory and corrections. Proposed code is not implemented or runtime-verified.

## User story

It is 07:40. I open M/ARC, tap Sleep 4, Soreness 4, Stress 2, and hit Save. The card does not vanish. In its place, in the warning colour: "Below your normal — Stress 2/5 against your usual 4/5. Today averages 3.3 where you normally read 4." Under it, one sentence: "With this morning counted, chest reads 68% recovered instead of 79% — under the 75% line, though nothing in today's plan changes because of it." I now know my 2 means something specific to me, and I know precisely what it did and did not move. On a worse morning that sentence instead says the plan swaps a lift, and a button under it — the same "Use these swaps" button the hero already offers — applies it when, and only when, I tap it. On the 60–70% of mornings that are ordinary, I get one grey word, "Steady", and the one thing a baseline can say that a threshold cannot: "Stress has read 3/5 for your last 4 check-ins, against your usual 4/5; sleep is holding." Before any of this, on my first week, it says honestly: "8 check-ins in the last 28 days; 3 more and the coach can read these against your own normal instead of a textbook."

## Brain work

FOUR pieces of deterministic work. All of it is pure, synchronous, offline, and lives under src/brain/**.

=== PIECE 1 — NEW FILE src/brain/readiness.ts ===
Pure statistics over ReadinessEntry[]. Imports ONLY: `type ReadinessEntry` from '@/core/models', `daysBetween` from '@/core/dates', and the constants below from './coach/bands'. (Precedent for a top-level brain module importing coach/bands: src/brain/stats.ts already imports './coach/context' and './coach/deload'.) It must NOT import anything from ui/, slices/, native/, core/store, or coach/detectors.

Exported API, verbatim:

```ts
export type ReadinessDimension = 'sleep' | 'soreness' | 'stress';
export const READINESS_DIMENSIONS: readonly ReadinessDimension[] = ['sleep', 'soreness', 'stress'];
export const READINESS_DIMENSION_LABEL: Record<ReadinessDimension, string> = { sleep: 'Sleep', soreness: 'Soreness', stress: 'Stress' };

export type ReadinessVerdict = 'green' | 'steady' | 'amber' | 'red';

export interface ReadinessCentre { median: number; mad: number }

export interface ReadinessBaseline {
  sleep: ReadinessCentre; soreness: ReadinessCentre; stress: ReadinessCentre;
  /** Centre and spread of the per-day averages. */
  avg: ReadinessCentre;
  /** How many prior check-ins the baseline was built from. */
  entries: number;
  /** Day keys, inclusive. `to` is strictly before `today`. */
  from: string; to: string;
}

export interface ReadinessWorst { dimension: ReadinessDimension; value: number; median: number; delta: number }

export interface ReadinessDrift {
  dimension: ReadinessDimension;
  value: number;          // today's tap on that dimension
  run: number;            // consecutive most-recent check-ins at exactly this value, today included
  median: number;         // that dimension's baseline median
  holding: ReadinessDimension | null;
}

export interface ReadinessToday {
  entry: ReadinessEntry;
  /** round1 of the mean of the three taps. Every band comparison uses this rounded value. */
  avg: number;
  baseline: ReadinessBaseline | null;
  personalized: boolean;            // === (baseline !== null)
  delta: number | null;             // round2(avg - baseline.avg.median)
  madDenom: number | null;          // max(READINESS_MAD_FLOOR, baseline.avg.mad)
  z: number | null;                 // round2(delta / madDenom)
  /** The average at or below which a morning counts as low FOR THIS PERSON. */
  lowLine: number;
  worst: ReadinessWorst | null;
  drift: ReadinessDrift | null;
  verdict: ReadinessVerdict;
  /** Check-ins in the trailing window, today included — for the honest "not enough yet" copy. */
  entriesInWindow: number;
  /** Prior check-ins still needed before a baseline exists. 0 once personalized. */
  baselineEntriesNeeded: number;
}

export function readinessAvg(e: { sleep: number; soreness: number; stress: number }): number;   // raw mean, unrounded
export function readinessMedian(xs: number[]): number;
export function readinessMad(xs: number[], median: number): number;
export function readinessBaseline(entries: ReadinessEntry[], today: string): ReadinessBaseline | null;
export function readinessLowLine(baseline: ReadinessBaseline | null): number;
export function readinessDrift(entries: ReadinessEntry[], today: string, baseline: ReadinessBaseline | null): ReadinessDrift | null;
export function readinessVerdict(r: Pick<ReadinessToday, 'avg' | 'z' | 'personalized' | 'entry' | 'worst'>): ReadinessVerdict;
export function readinessToday(entries: ReadinessEntry[], today: string): ReadinessToday | null;
```

ALGORITHMS, step by step.

`readinessMedian(xs)`: copy, sort ascending numerically, return the middle element for odd length, the mean of the two middles for even. Return 0 for an empty array. (Identical semantics to `median` in coach/detectors/shared.ts — re-implement locally rather than importing, so this file stays independent of the detectors tree.)

`readinessMad(xs, median)`: `readinessMedian(xs.map(x => Math.abs(x - median)))`. Returns 0 for an empty array and 0 for a constant series — that is exactly why READINESS_MAD_FLOOR exists.

`readinessBaseline(entries, today)`:
1. `const prior = entries.filter(r => r.day < today && daysBetween(r.day, today) <= READINESS_BASELINE_WINDOW_DAYS)` — string comparison for "before today" (day keys are local YYYY-MM-DD, compared with string ops per the repo convention) and daysBetween for the window. The `r.day < today` guard also discards future-dated junk from a hand-edited backup.
2. `if (prior.length < READINESS_BASELINE_MIN_ENTRIES) return null;`
3. For each dimension d: `const xs = prior.map(r => r[d]); const m = readinessMedian(xs); centre[d] = { median: m, mad: readinessMad(xs, m) }`.
4. Average series: `const avgs = prior.map(r => round1(readinessAvg(r)))`; `avg = { median: readinessMedian(avgs), mad: readinessMad(avgs, readinessMedian(avgs)) }`.
5. `entries: prior.length`, `from: min day of prior`, `to: max day of prior` (sort the day strings; do not assume input order).

`readinessLowLine(baseline)`: `baseline ? round1(baseline.avg.median + READINESS_Z_AMBER * Math.max(READINESS_MAD_FLOOR, baseline.avg.mad)) : READINESS_LOW_AVG`. (READINESS_Z_AMBER is negative, so this subtracts.)

`readinessToday(entries, today)`:
1. `const entry = entries.find(r => r.day === today); if (!entry) return null;`
2. `const avg = round1(readinessAvg(entry));`
3. `const baseline = readinessBaseline(entries, today);` `personalized = baseline !== null`.
4. If baseline: `delta = round2(avg - baseline.avg.median)`, `madDenom = Math.max(READINESS_MAD_FLOOR, baseline.avg.mad)`, `z = round2(delta / madDenom)`. Else all three are null.
5. `worst`: if no baseline, null. Else for each dimension compute `d = entry[dim] - baseline[dim].median`; keep only `d < 0`; pick the smallest d; tie-break by the fixed order sleep, soreness, stress. Return `{ dimension, value: entry[dim], median: baseline[dim].median, delta: round2(d) }`, or null if every dimension is at or above its own median.
6. `drift = readinessDrift(entries, today, baseline)`.
7. `lowLine = readinessLowLine(baseline)`.
8. `entriesInWindow = priorCountInWindow + 1`; `baselineEntriesNeeded = Math.max(0, READINESS_BASELINE_MIN_ENTRIES - priorCountInWindow)`. (Compute priorCountInWindow with the same filter as step 1 of readinessBaseline; a tiny duplicate filter is fine and keeps readinessBaseline's own return shape clean.)
9. `verdict = readinessVerdict({ avg, z, personalized, entry, worst })`.

`readinessVerdict(r)` — evaluate in exactly this order and return on the first match:
```
const lowDim = r.entry.sleep === 1 || r.entry.soreness === 1 || r.entry.stress === 1;
if (r.avg <= READINESS_FLOOR_HARD_AVG) return 'red';                              // 1.5 — a terrible morning is low for anyone
if (!r.personalized && r.avg <= READINESS_LOW_AVG) return 'red';                  // 2.5 — the textbook floor, only while there is no baseline
if (r.personalized && r.z !== null && r.z <= READINESS_Z_RED) return 'red';       // -1.5
if (r.personalized && r.z !== null && r.z <= READINESS_Z_AMBER) return 'amber';   // -0.75
if (r.personalized && r.worst && r.worst.delta <= -READINESS_DIM_DROP) return 'amber';  // one dimension cratered while the others carried the average
if (!lowDim && (r.avg >= READINESS_GOOD_AVG || (r.personalized && r.z !== null && r.z >= READINESS_Z_GREEN))) return 'green';
return 'steady';
```
Note the deliberate consequence of line 2: once a baseline exists, READINESS_LOW_AVG no longer fires on its own. That is the whole point — a person whose median average is 2.0 reading 2.0 today is *steady*, not red, and their recovery windows stop being permanently widened. READINESS_FLOOR_HARD_AVG keeps a genuinely awful reading red for everyone.

`readinessDrift(entries, today, baseline)`:
1. `if (!baseline) return null;`
2. Build `series` = the prior-window entries plus today's, sorted by `day` DESCENDING (newest first). Today's entry is index 0.
3. For each dimension d: `value = series[0][d]`; `run` = the number of leading elements of `series` whose `[d] === value` (so run ≥ 1 always).
4. A dimension is a candidate when `run >= READINESS_DRIFT_MIN_RUN` AND `value <= baseline[d].median - 1`.
5. If no candidate, return null. Otherwise pick the candidate with the lowest `value`; tie-break by longest `run`; then by the fixed dimension order.
6. `holding`: among the other two dimensions, take the one with the largest `(series[0][d] - baseline[d].median)`, keep it only if that difference is `>= 0`, tie-break by fixed order; otherwise null.
7. Return `{ dimension, value, run, median: baseline[dimension].median, holding }`.
Drift is computed for every verdict (it is O(28) and free) but is only RENDERED on 'steady' — see uiSpec.

`round1`/`round2`: define them locally in this file (`const round1 = (v: number) => Math.round(v * 10) / 10;` and the ×100 version), matching coach/detectors/shared.ts. Do not import from detectors/shared.ts.

Why the rounded values are the ones compared: the number the card shows and the band it lands in can never disagree. The possible means of three integers in 1..5 are k/3, whose round1 forms (1, 1.3, 1.7, 2, 2.3, 2.7, 3, 3.3, ...) never sit on a band edge, so rounding cannot flip a verdict by accident.

=== PIECE 2 — readinessFactor rewritten, in src/brain/coach/detectors/recovery.ts ===
Today (lines 35–42) it is a continuous ramp between avg 2.5 and avg 1.0. It becomes a three-step function of the verdict, and it gains an exactly-computed counterfactual.

```ts
export interface ReadinessAdjustment { factor: number; verdict: ReadinessVerdict | null; personalized: boolean }

/** Today's check-in as a recovery-window multiplier. Never below 1, never above READINESS_RECOVERY_FACTOR_MAX. */
export function readinessAdjustment(ctx: BrainContext): ReadinessAdjustment {
  const r = readinessToday(ctx.readiness, ctx.today);
  if (!r) return { factor: 1, verdict: null, personalized: false };
  const factor = r.verdict === 'red' ? READINESS_RECOVERY_FACTOR_MAX
    : r.verdict === 'amber' ? READINESS_RECOVERY_FACTOR_AMBER
    : 1;
  return { factor, verdict: r.verdict, personalized: r.personalized };
}

/** Kept as the narrow public entry point the existing tests and callers use. */
export function readinessFactor(ctx: BrainContext): number { return readinessAdjustment(ctx).factor; }
```
Delete the file-local `readinessAvg` helper at lines 25–27 and the old ramp body; import `readinessToday` and `type ReadinessVerdict` from '../../readiness'. Remove the now-unused READINESS_LOW_AVG import from this file if nothing else uses it.

`AdjustedRecovery` (the interface at lines 16–24) gains three fields:
```ts
  /** adjustedPct as it would read if today's check-in were ignored. The whole attribution story rests on this. */
  pctWithoutReadiness: number;
  windowHoursWithoutReadiness: number;
  /** True when the readiness factor came from a baseline-relative verdict rather than the absolute floor. */
  readinessPersonalized: boolean;
```
`adjustedRecovery(ctx)` changes:
- `const ra = readinessAdjustment(ctx); const rFactor = ra.factor;` (one call, not one per muscle).
- In the early-return branch for an untrained muscle, add `pctWithoutReadiness: r.pct, windowHoursWithoutReadiness: r.windowHours, readinessPersonalized: ra.personalized`.
- In the main branch, immediately after `const factor = Math.min(RECOVERY_VOLUME_FACTOR_MAX, Math.max(volumeFactor, rFactor, fFactor));` add:
```ts
const factorWithout = Math.min(RECOVERY_VOLUME_FACTOR_MAX, Math.max(volumeFactor, fFactor));
const windowWithout = r.windowHours * factorWithout;
const pctWithout = Math.max(0, Math.min(100, Math.round((elapsed / windowWithout) * 100)));
```
(`elapsed` is already in scope; move its declaration above this block if needed.) Return `pctWithoutReadiness: pctWithout, windowHoursWithoutReadiness: Math.round(windowWithout), readinessPersonalized: ra.personalized` alongside the existing fields. Computing it here, inside the same loop, is mandatory: the unrounded `volumeFactor` and `rFactor` are in scope here, whereas the fields on the returned object are round2'd and would give a subtly different window.

`detectUnderRecovered`'s metrics object gains one key: `readinessPersonalized: r.readinessPersonalized`. Nothing else in that function changes.

The widen-only invariants are untouched: factors are still combined with Math.max, never multiplied, still clamped by RECOVERY_VOLUME_FACTOR_MAX, and the new factor function can still only return 1, 1.15 or 1.3.

=== PIECE 3 — NEW FILE src/brain/coach/verdict.ts ===
Attribution (the hard part) plus every word the card renders. Imports: `type Exercise` from '@/core/models', `muscleLabel`/`type MuscleId` from '@/data/muscles', `findExercise` from '@/core/exercises' (precedent: planners/today.ts line 9), `type Proposal` from './contract', `type AdjustedRecovery` from './detectors/recovery', the bands, and `READINESS_DIMENSION_LABEL`/`type ReadinessToday`/`type ReadinessVerdict` from '../readiness'.

```ts
export type ReadinessTone = 'positive' | 'warning' | 'danger' | 'muted';

export type ReadinessConsequence =
  | { kind: 'plan_swap'; exerciseIds: string[]; exerciseNames: string[]; muscle: MuscleId; pct: number; pctWithout: number; thresholdPct: number }
  | { kind: 'recovery_swap'; muscles: MuscleId[]; pct: number; pctWithout: number; thresholdPct: number }
  | { kind: 'recovery_flag'; muscles: MuscleId[]; pct: number; pctWithout: number; thresholdPct: number }
  | { kind: 'none_scheduled' }
  | { kind: 'none'; thresholdPct: number };

export interface ReadinessCard {
  verdict: ReadinessVerdict;
  tone: ReadinessTone;
  /** The tinted word or short phrase. Never empty. */
  headline: string;
  /** One line of reading detail. Never empty. */
  detail: string;
  /** The single consequence sentence. '' for green and steady — by design. */
  consequence: string;
  /** True only when the card should offer the existing today_plan accept button. */
  showPlanAction: boolean;
  personalized: boolean;
}

export function readinessConsequence(input: {
  recovery: AdjustedRecovery[];
  plan: Proposal | null;          // the today_plan proposal, or null
  custom: Exercise[];
  hasScheduledSplit: boolean;
}): ReadinessConsequence;

export function readinessCard(input: {
  readiness: ReadinessToday;
  consequence: ReadinessConsequence;
  canOfferPlan: boolean;
}): ReadinessCard;
```

`readinessConsequence` algorithm — this is attribution, not statistics. It must PROVE the check-in moved something:
1. `const crossedSwap = recovery.filter(r => r.lastTrainedAt !== null && r.readinessFactor > 1 && r.adjustedPct < RECOVERY_SWAP_PCT && r.pctWithoutReadiness >= RECOVERY_SWAP_PCT).sort((a,b) => a.adjustedPct - b.adjustedPct || a.muscle.localeCompare(b.muscle));`
2. `const crossedFlag = recovery.filter(r => r.lastTrainedAt !== null && r.readinessFactor > 1 && r.adjustedPct < RECOVERY_FLAG_PCT && r.pctWithoutReadiness >= RECOVERY_FLAG_PCT).sort(same);`
3. Plan attribution: `const swapSet = new Set(crossedSwap.map(r => r.muscle));` then, only when `input.plan?.apply.kind === 'today_plan'` AND `(input.plan.apply.recommendedSplitId ?? input.plan.subject.splitId) === input.plan.subject.splitId` (otherwise acceptProposal switches the split and ignores modifications), `const attributed = input.plan.apply.modifications.filter(c => c.reason === 'under_recovered' && (() => { const main = findExercise(c.removeExerciseId, input.custom)?.primary[0]; return !!main && swapSet.has(main); })());` — a `reason: 'note_flag'` modification is NEVER attributed to the check-in (it traces to a session note), and a modification on a muscle that was already under RECOVERY_SWAP_PCT without the check-in is NEVER attributed (the last session did that).
4. Return, first match wins: `attributed.length` → `plan_swap` (exerciseIds = the removeExerciseIds, exerciseNames resolved with `findExercise(id, custom)?.name ?? id`, muscle/pct/pctWithout taken from the worst crossedSwap entry whose muscle belongs to one of the attributed modifications, thresholdPct = RECOVERY_SWAP_PCT); else `crossedSwap.length` → `recovery_swap` (muscles = all of them, pct/pctWithout from crossedSwap[0], thresholdPct = RECOVERY_SWAP_PCT); else `crossedFlag.length` → `recovery_flag` (thresholdPct = RECOVERY_FLAG_PCT); else `!hasScheduledSplit` → `none_scheduled`; else `none` with thresholdPct = RECOVERY_FLAG_PCT.

`readinessCard` builds every string from the templates in uiSpec. Tone map: red→'danger', amber→'warning', green→'positive', steady→'muted'. `consequence` is '' unless verdict is 'amber' or 'red'. `showPlanAction = input.canOfferPlan && input.consequence.kind === 'plan_swap' && (verdict === 'amber' || verdict === 'red')`.

The card never performs arithmetic on a displayed number: `pct` and `pctWithout` are separate fields carried through from AdjustedRecovery, exactly as StatsPr.value exists beside StatsPr.detail.

=== PIECE 4 — detectReadiness gate and metrics (existing file) ===
`detectReadiness` in src/brain/coach/detectors/readiness.ts:
1. `const r = readinessToday(ctx.readiness, ctx.today); if (!r) return [];`
2. Replace the old today-gate `if (avg(today) > READINESS_LOW_AVG) return []` with `if (r.verdict !== 'red' && r.verdict !== 'amber') return [];`
3. Keep the pattern gate exactly as it is, but count trailing lows against the person's own line: `const lowCount = 1 + trailing.filter(x => round1(readinessAvg(x)) <= r.lowLine).length; if (lowCount < READINESS_PATTERN_MIN_LOW) return [];` (`trailing` now explicitly excludes future entries — `x.day < ctx.today && daysBetween(x.day, ctx.today) <= READINESS_PATTERN_WINDOW_DAYS`.)
4. Delete the file-local `avg` helper; use `readinessAvg` from '../../readiness'.
5. Metrics become:
```ts
metrics: {
  avg: round1(readinessAvg(r.entry)),   // unchanged shape; tests/coach-readiness.test.ts line 105 expects 1.3 here
  sleep: r.entry.sleep, soreness: r.entry.soreness, stress: r.entry.stress,
  thresholdAvg: r.lowLine,              // === READINESS_LOW_AVG when un-personalized, so line 106 still passes
  lowCheckIns: lowCount,
  personalized: r.personalized,
  verdict: r.verdict,
  ...(r.baseline ? { baselineAvg: r.baseline.avg.median, baselineEntries: r.baseline.entries, deltaFromBaseline: r.delta ?? 0, z: r.z ?? 0 } : {}),
  ...(r.worst ? { worstDimension: r.worst.dimension, worstValue: r.worst.value, worstMedian: r.worst.median } : {}),
}
```
Everything else (kind, subject, window, confidence 'medium', severity 1, evidence) is unchanged. Only emit baselineAvg/z/delta when a baseline exists — a null or NaN reaching `reportNumbers()` fails tests/coach-fuzz.test.ts line 294.

NOTHING ELSE in the brain changes. No new FindingKind, no new ProposalKind, no contract.ts edit, no principles.json edit, no report.ts edit, no proxy edit, no payload field.

## Contract changes

none. `src/brain/coach/contract.ts` is not touched: no FINDING_KINDS entry, no PROPOSAL_KINDS entry, no ProposalApply member, no PRINCIPLES_BY_* entry, no CONTRACT_VERSION change. The verdict is a brain function rendered straight by the UI — the same pattern `suggestNext()`'s `reason`/`target` strings already use for Train's EntryCard placeholders — so it never becomes a Finding and never enters a payload.

The only contract-adjacent change is additive metric keys on two EXISTING finding kinds, which requires no registration anywhere:
- `low_readiness` metrics gain `personalized`, `verdict`, and (when a baseline exists) `baselineAvg`, `baselineEntries`, `deltaFromBaseline`, `z`, `worstDimension`, `worstValue`, `worstMedian`. Its existing keys `avg`, `sleep`, `soreness`, `stress`, `thresholdAvg`, `lowCheckIns` keep their names and meanings.
- `under_recovered` metrics gain `readinessPersonalized: boolean`.
`Finding['metrics']` is already `Record<string, number | string | boolean>`, and `allowedNumbers()` (explainer.ts line 145) recursively visits `f.metrics`, so each new number is automatically legal for the model to quote and needs no proxy change. `src/data/principles.json` needs no edit: `subjective_readiness_monitoring` already lists `low_readiness` in its `findingKinds`, which is what tests/principles.test.ts checks.

## Files to create

### `src/brain/readiness.ts`
Pure statistics over state.readiness: the 28-day personal baseline (per-dimension median + MAD, plus the same for the per-day averages), today's reading against it, the four-band verdict, the low line, the worst dimension and the slow per-dimension drift. Dependency-free apart from core/models types, core/dates and coach/bands constants.

```ts
export type ReadinessDimension = 'sleep' | 'soreness' | 'stress';
export const READINESS_DIMENSIONS: readonly ReadinessDimension[];
export const READINESS_DIMENSION_LABEL: Record<ReadinessDimension, string>;
export type ReadinessVerdict = 'green' | 'steady' | 'amber' | 'red';
export interface ReadinessCentre { median: number; mad: number }
export interface ReadinessBaseline { sleep: ReadinessCentre; soreness: ReadinessCentre; stress: ReadinessCentre; avg: ReadinessCentre; entries: number; from: string; to: string }
export interface ReadinessWorst { dimension: ReadinessDimension; value: number; median: number; delta: number }
export interface ReadinessDrift { dimension: ReadinessDimension; value: number; run: number; median: number; holding: ReadinessDimension | null }
export interface ReadinessToday { entry: ReadinessEntry; avg: number; baseline: ReadinessBaseline | null; personalized: boolean; delta: number | null; madDenom: number | null; z: number | null; lowLine: number; worst: ReadinessWorst | null; drift: ReadinessDrift | null; verdict: ReadinessVerdict; entriesInWindow: number; baselineEntriesNeeded: number }
export function readinessAvg(e: { sleep: number; soreness: number; stress: number }): number;
export function readinessMedian(xs: number[]): number;
export function readinessMad(xs: number[], median: number): number;
export function readinessBaseline(entries: ReadinessEntry[], today: string): ReadinessBaseline | null;
export function readinessLowLine(baseline: ReadinessBaseline | null): number;
export function readinessDrift(entries: ReadinessEntry[], today: string, baseline: ReadinessBaseline | null): ReadinessDrift | null;
export function readinessVerdict(r: Pick<ReadinessToday, 'avg' | 'z' | 'personalized' | 'entry' | 'worst'>): ReadinessVerdict;
export function readinessToday(entries: ReadinessEntry[], today: string): ReadinessToday | null;
```

### `src/brain/coach/verdict.ts`
Attribution and copy for the morning verdict card: proves whether today's check-in actually moved a recovery percentage across RECOVERY_SWAP_PCT or RECOVERY_FLAG_PCT, or caused a planToday modification, and renders the card's headline / detail / single consequence sentence. Every word the card shows lives here, not in the .tsx.

```ts
export type ReadinessTone = 'positive' | 'warning' | 'danger' | 'muted';
export type ReadinessConsequence =
  | { kind: 'plan_swap'; exerciseIds: string[]; exerciseNames: string[]; muscle: MuscleId; pct: number; pctWithout: number; thresholdPct: number }
  | { kind: 'recovery_swap'; muscles: MuscleId[]; pct: number; pctWithout: number; thresholdPct: number }
  | { kind: 'recovery_flag'; muscles: MuscleId[]; pct: number; pctWithout: number; thresholdPct: number }
  | { kind: 'none_scheduled' }
  | { kind: 'none'; thresholdPct: number };
export interface ReadinessCard { verdict: ReadinessVerdict; tone: ReadinessTone; headline: string; detail: string; consequence: string; showPlanAction: boolean; personalized: boolean }
export function readinessConsequence(input: { recovery: AdjustedRecovery[]; plan: Proposal | null; custom: Exercise[]; hasScheduledSplit: boolean }): ReadinessConsequence;
export function readinessCard(input: { readiness: ReadinessToday; consequence: ReadinessConsequence; canOfferPlan: boolean }): ReadinessCard;
```

### `src/slices/today/ReadinessVerdict.tsx`
The presentational card that replaces ReadinessCheckIn in the same Today slot once today's check-in exists. Contains zero copy strings of its own beyond the 'Morning check-in' eyebrow and the 'Why' button label — everything else arrives on the ReadinessCard prop.

```ts
export function ReadinessVerdict({ card, acceptLabel, onAccept, onWhy }: { card: ReadinessCard; acceptLabel: string | null; onAccept: () => void; onWhy: () => void }): JSX.Element;
```

### `tests/readiness.test.ts`
Unit tests for the pure src/brain/readiness.ts module: baseline gate, window, median/MAD, the MAD floor, all four verdict bands, the two headline bug-fix cases (habitual-2 no longer red; a 4.7-to-3.0 crash now red), worst dimension, drift runs and the low line.

```ts
(test file — no exports)
```

## Files to modify

- **`src/brain/coach/bands.ts`** — Append a block under the existing READINESS_* group (after line 58). Keep READINESS_LOW_AVG = 2.5 and READINESS_RECOVERY_FACTOR_MAX = 1.3 exactly as they are — FATIGUE_RECOVERY_FACTOR is derived from the latter and must not move. Add, each with a one-line comment in the file's existing voice: READINESS_BASELINE_WINDOW_DAYS = 28; READINESS_BASELINE_MIN_ENTRIES = 10 ('ten check-ins in four weeks before the coach claims to know this person\'s normal — six was tested and rejected: at that size one unusual dimension could drag a whole verdict'); READINESS_MAD_FLOOR = 0.6 ('a 1–5 scale often has zero spread, and dividing by a tiny MAD makes every small dip look like a crisis'); READINESS_Z_RED = -1.5; READINESS_Z_AMBER = -0.75; READINESS_Z_GREEN = 1; READINESS_DIM_DROP = 2 ('one dimension two whole points under its own median is worth naming even when the other two carry the average'); READINESS_GOOD_AVG = 4.5; READINESS_FLOOR_HARD_AVG = 1.5 ('the absolute floor that still applies to someone whose own normal is already low'); READINESS_DRIFT_MIN_RUN = 3; and READINESS_RECOVERY_FACTOR_AMBER = Math.round((1 + (READINESS_RECOVERY_FACTOR_MAX - 1) / 2) * 100) / 100 ('halfway to the cap — an amber morning is a real signal, not the worst one'). Do not inline any of these numbers anywhere else.
- **`src/brain/coach/detectors/recovery.ts`** — Rewrite readinessFactor as a verdict step-function and add readinessAdjustment (see brainWork Piece 2). Delete the local readinessAvg helper (lines 25–27) and the linear-ramp body (lines 38–41). Add pctWithoutReadiness, windowHoursWithoutReadiness and readinessPersonalized to the AdjustedRecovery interface and populate them in BOTH return branches of adjustedRecovery, computing the counterfactual inside the loop where the unrounded volumeFactor/fatigueFactor are in scope. Add readinessPersonalized: r.readinessPersonalized to detectUnderRecovered's metrics object. Update the block comment above readinessFactor: it currently says 'Linear between a full check-in (factor 1) and the worst possible one' — that sentence becomes false.
- **`src/brain/coach/detectors/readiness.ts`** — Replace the absolute today-gate with the verdict gate, count trailing lows against r.lowLine instead of READINESS_LOW_AVG, drop the local avg helper in favour of readinessAvg, and widen the metrics object (see brainWork Piece 4). Update the file's header comment: it currently describes readinessFactor as 'a separate, more immediate use of the same data' — still true, but add that both now read against the person's own 28-day baseline when there is one.
- **`src/brain/coach/words.ts`** — Two copy fixes, no structural change. (1) Line 192, the under_recovered `extra` array: the clause `num(m.readinessFactor) > 1 ? 'Your check-in today read low, which widens it a little more.'` is now false for a personalized amber/red (a 3.8 against a personal median of 4.6 is not 'low'). Split it: when readinessFactor > 1 and m.readinessPersonalized === true use 'Your check-in today read below your own normal, which widens it a little more.'; when readinessFactor > 1 and it is not personalized keep the existing sentence verbatim. (2) The `low_readiness` case (lines 203–207): when m.personalized === true and typeof m.baselineAvg === 'number', use title 'Below your own normal, more than once' and noticed `Your morning check-ins have read below your own normal more than once this week: today, sleep ${num(m.sleep)}/5, soreness ${num(m.soreness)}/5, stress ${num(m.stress)}/5 — an average of ${num(m.avg)} against your usual ${num(m.baselineAvg)}.`; otherwise keep today's exact title, noticed, means and action. `means` and `action` are unchanged in both branches. Do not touch CATEGORY_OF, KIND_WEIGHT, or any other case.
- **`src/brain/index.ts`** — Add `export * from './readiness';` after the existing './recovery' line. Verify no exported name collides (readinessAvg/readinessMedian/readinessMad/readinessBaseline/readinessToday/readinessVerdict/readinessDrift/readinessLowLine and the types are all new). Do NOT barrel './coach/verdict' — the barrel currently exports only top-level brain modules plus './coach/cues', and verdict.ts is imported by path.
- **`src/app/selectors.ts`** — Four edits. (1) Add `export const adjusted = computed(() => adjustedRecovery(brainContext.value));` directly above the existing `recovery` selector, and rewrite `recovery` to map over `adjusted.value` instead of calling adjustedRecovery again — adjustedRecovery costs ~13 ms at 400 sessions and must not run twice per state change. (2) Add `export const readingToday = computed(() => readinessToday(state.value.readiness, today.value));`. (3) Add `export const canOfferTodayPlan = computed(() => !!todaySuggestion.value && !!scheduledSplit.value && sessionsToday.value.length === 0 && !state.value.active);` — declare it after todaySuggestion and sessionsToday so the reference order is valid. (4) Add `export const verdictCard = computed<ReadinessCard | null>(() => { const r = readingToday.value; if (!r) return null; const consequence = readinessConsequence({ recovery: adjusted.value, plan: todaySuggestion.value?.proposal ?? null, custom: state.value.customExercises, hasScheduledSplit: !!scheduledSplit.value }); return readinessCard({ readiness: r, consequence, canOfferPlan: canOfferTodayPlan.value }); });`. Add the imports from '@/brain/readiness' and '@/brain/coach/verdict'.
- **`src/slices/today/Today.tsx`** — Line 61 becomes two lines in the same slot, immediately above the `card-accent` hero: keep `{!checkedInToday && !checkInSkipped && <ReadinessCheckIn day={today.value} onDone={() => setCheckInSkipped(true)} />}` exactly as it is, and add `{checkedInToday && verdictCard.value && <ReadinessVerdict card={verdictCard.value} acceptLabel={plan?.acceptLabel ?? null} onAccept={accept} onWhy={() => go('coach')} />}`. Import verdictCard from '@/app/selectors' and ReadinessVerdict from './ReadinessVerdict'. `accept` (line 37) and `plan` (line 35) already exist and are reused unchanged. Add NOTHING under the hero — no chip, no second surface.
- **`tests/coach-readiness.test.ts`** — Re-derive exactly one existing block and add five new describes. The block at lines 18–23 ('widens toward the cap as today\'s check-in gets worse') asserts the old linear ramp and must be replaced, not deleted — see the tests[] list for the replacement assertions. The blocks at lines 11–16, 26–49, 51–82 and 84–115 all still pass unchanged (every adjustedRecovery fixture uses entry(TODAY,1,1,1) with no baseline, which is red under the new rules too, so READINESS_RECOVERY_FACTOR_MAX is still the expected factor; and all four detectReadiness fixtures have fewer than 10 prior entries, so lowLine === READINESS_LOW_AVG and today's verdict is red in each case that fires) — run them and confirm before touching anything.
- **`tests/coach-words.test.ts`** — Add the new metric keys to the shared `base.metrics` blob in the 'renders every finding kind' test (add readinessPersonalized: true, baselineAvg: 4.7, deltaFromBaseline: -1.4, z: -2.33, worstDimension: 'stress', worstValue: 2, worstMedian: 4 — note `personalized: true` is already there at line 22). Extend the existing 'under_recovered names the fatigue note' test with the personalized/un-personalized readiness wording, and add a low_readiness wording test. See tests[].
- **`docs/COACH_BRAIN.md`** — Three edits. (1) The `low_readiness` row of the detector table (line 93): change the trigger column to 'A pattern of low morning check-ins, read against this person\'s own 28-day baseline when one exists (≥10 check-ins in 28 days)' and the gate column to 'Today\'s verdict is amber or red, and at least one more of the trailing week\'s check-ins was at or under this person\'s own low line'. (2) The Phase 8 readiness paragraph (lines 345–365): replace the sentence describing readinessFactor as widening 'from a single check-in ... the same mechanism as the existing volume factor' with a description of the three-step verdict, and add that READINESS_LOW_AVG is now the no-baseline band plus a hard floor rather than the only rule. (3) Append one dated row to the decisions-log table (the table under `## Decisions log`, line 428, whose last row currently ends just before `## Non-goals` at line 534), dated 2026-09-21, ending in the deploy consequence — it is app-only, no proxy redeploy, no state version change. Name in it: the cry-wolf fix (a habitual-2 rater no longer carries a permanent 1.1× on every recovery window), the previously-invisible crash (4.7 to 3.0 now reads red), the choice of 10-in-28 and MAD floor 0.6 over the originally-sketched 6 entries and 0.4, and the fact that READINESS_LOW_AVG survives as a no-baseline band and as READINESS_FLOOR_HARD_AVG rather than being deleted.

## UI spec

COMPONENT: `ReadinessVerdict` in src/slices/today/ReadinessVerdict.tsx.

MOUNT POINT: Today.tsx, the same slot ReadinessCheckIn occupies today (line 61), between the topbar and the `card-accent` hero. Exactly one of the two renders:
- no entry for today.value AND not skipped this visit → `<ReadinessCheckIn/>` (unchanged)
- an entry exists for today.value → `<ReadinessVerdict/>`
- skipped this visit, no entry → neither (unchanged behaviour)
There is NO second surface. No chip under the hero, no banner, nothing in Coach.tsx. The verdict card stays in that slot for the rest of the day, re-derived from state.readiness on every render, so it survives a reload with zero new storage.

MARKUP (primitives only — `Card`, `Button` from '@/ui/primitives'; there is nothing else):
```tsx
const TONE_CLASS: Record<ReadinessTone, string> = { positive: 'positive-text', warning: 'warning-text', danger: 'danger-text', muted: 'muted' };
<Card class="card-quiet stack-sm">
  <div class="eyebrow">Morning check-in</div>
  <p class={TONE_CLASS[card.tone]} style={{ margin: 0, fontWeight: 600 }}>{card.headline}</p>
  <p class="small muted" style={{ margin: 0 }}>{card.detail}</p>
  {card.consequence && <p class="small" style={{ margin: 0 }}>{card.consequence}</p>}
  {card.showPlanAction && acceptLabel && (
    <div class="row wrap">
      <Button size="sm" onClick={onAccept}>{acceptLabel}</Button>
      <Button size="sm" variant="quiet" onClick={onWhy}>Why</Button>
    </div>
  )}
</Card>
```
`.card-quiet`, `.stack-sm`, `.eyebrow`, `.small`, `.muted`, `.row`, `.wrap`, `.positive-text`, `.warning-text`, `.danger-text` all exist in src/ui/styles.css (lines 44, 32, 25, 28, 26, 33, 36, 219, 220, 218). `.negative-text` DOES NOT EXIST — use `danger-text`. Add no CSS.

COPY TEMPLATES — all built in `readinessCard()` (brain/coach/verdict.ts), never in the .tsx. `{sleep}`, `{soreness}`, `{stress}` are `readiness.entry.sleep|soreness|stress` (the taps themselves). `{avg}` is `readiness.avg`. `{baselineAvg}` is `readiness.baseline.avg.median`. `{worstDim}` is `READINESS_DIMENSION_LABEL[readiness.worst.dimension]`, `{worstValue}` `readiness.worst.value`, `{worstMedian}` `readiness.worst.median`. `{lowLine}` is `readiness.lowLine`. `{entriesInWindow}`, `{needed}` = `readiness.baselineEntriesNeeded`, `{windowDays}` = READINESS_BASELINE_WINDOW_DAYS.

RED, personalized, and z <= READINESS_Z_AMBER (a real relative crash):
  headline: `Well below your normal`
  detail (worst present): `{worstDim} {worstValue}/5 against your usual {worstMedian}/5. Today averages {avg} where you normally read {baselineAvg}.`
  detail (worst null): `Today averages {avg} where you normally read {baselineAvg}.`
RED, personalized, but z > READINESS_Z_AMBER (fired by the hard floor — their normal is already very low):
  headline: `A low morning`
  detail: `Sleep {sleep}/5, soreness {soreness}/5, stress {stress}/5 — an average of {avg}. That is close to your usual {baselineAvg}, and still low enough that the coach treats it as a hard day.`
RED, not personalized:
  headline: `A low morning`
  detail: `Sleep {sleep}/5, soreness {soreness}/5, stress {stress}/5 — an average of {avg}, at or under the {lowLine} the coach treats as low.`
AMBER (always personalized):
  headline: `Below your normal`
  detail: same two variants as the personalized-red case.
GREEN, personalized:
  headline: `Good to go`
  detail: `Sleep {sleep}/5, soreness {soreness}/5, stress {stress}/5 — Today averages {avg}; your usual is {baselineAvg}. Keep to your planned targets and effort range.`
GREEN, not personalized:
  headline: `Good to go`
  detail: `Sleep {sleep}/5, soreness {soreness}/5, stress {stress}/5. Not enough check-ins yet to know your normal, but that reads well. Keep to your planned targets and effort range.`
STEADY with drift (the modal-day payoff — this is the one thing a baseline can say that a threshold cannot):
  headline: `Steady`
  detail: `{driftDim} has read {driftValue}/5 for your last {run} check-ins, against your usual {driftMedian}/5{holdingClause}.` where `{driftDim}` = READINESS_DIMENSION_LABEL[drift.dimension], `{driftValue}` = drift.value, `{run}` = drift.run, `{driftMedian}` = drift.median, and `{holdingClause}` = `; {lowercased READINESS_DIMENSION_LABEL[drift.holding]} is holding` when drift.holding is non-null, else ''. Say "check-ins", never "days" — entries can skip days and the run is counted in entries.
STEADY, no drift, personalized:
  headline: `Steady`
  detail: `Sleep {sleep}/5, soreness {soreness}/5, stress {stress}/5 — your usual {baselineAvg}.`
STEADY, no drift, not personalized (the honest hedge):
  headline: `Logged`
  detail: `Sleep {sleep}/5, soreness {soreness}/5, stress {stress}/5. {entriesInWindow} check-ins in the last {windowDays} days; {needed} more and the coach can read these against your own normal instead of a textbook.`

CONSEQUENCE SENTENCE — amber and red only, exactly one, from `readinessConsequence`'s kind. `{pct}` = AdjustedRecovery.adjustedPct, `{pctWithout}` = AdjustedRecovery.pctWithoutReadiness, `{swapPct}` = RECOVERY_SWAP_PCT (60), `{flagPct}` = RECOVERY_FLAG_PCT (75). `{muscle}` = `muscleLabel(consequence.muscles[0])`, the single worst crossed muscle to which pct/pctWithout belong. Do not attach that pair of numbers to a list of other muscles.
- plan_swap, one exercise: `That check-in is why the coach suggests adjusting {exerciseName} today: {muscle} reads {pct}% recovered with this morning counted, {pctWithout}% without it.`
- plan_swap, more than one: `That check-in is why the coach suggests adjusting {n} lifts today: {muscle} reads {pct}% recovered with this morning counted, {pctWithout}% without it.`
- recovery_swap: `With this morning counted, {muscle} reads {pct}% recovered instead of {pctWithout}% — under the {swapPct}% line where the coach swaps the lifts that hit it.`
- recovery_flag: `With this morning counted, {muscle} reads {pct}% recovered instead of {pctWithout}% — under the {flagPct}% line, though nothing in today's plan changes because of it.`
- none: `No new recovery threshold was crossed because of this check-in. Your plan still needs an explicit acceptance.`
- none_scheduled: `Nothing is scheduled today, so there is nothing to change — the reading is logged either way.`

INTERACTION / ACCEPT-DISMISS:
- Saving the check-in is the only write the whole feature performs, and it is the write ReadinessCheckIn already does today (`update(...)` + `flushSave()` in its `save()`). Do not change it.
- The action row appears only when `card.showPlanAction` — i.e. verdict is amber or red AND `canOfferTodayPlan` (a today_plan suggestion exists, a split is scheduled, no session has been logged today and none is live). It disappears for the rest of the day the moment a session starts, because there is nothing left to reconsider.
- The primary button's label is `todaySuggestion.value.acceptLabel` — the real, existing label ("Use these swaps", "Switch to Pull", "Go with Push"), never a navigation-sounding invention. Its onClick is Today.tsx's existing `accept` (line 37): `showToast(acceptProposal(plan.proposal, today.value))`. `acceptProposal` in src/slices/coach/apply.ts is the only mutation point and it runs only on this tap.
- The quiet "Why" button calls `go('coach')`, mirroring the hero's existing Why at line 89.
- Green and steady render as a headline plus one line and NOTHING else: no button, no consequence sentence, no data change of any kind.
- There is no dismiss, because nothing is pending: the card is a statement about a reading that already exists. To make it go away, the person trains (the button row hides) or the day rolls over.

EMPTY / LOADING STATES: there is no loading state — everything is synchronous and offline. `verdictCard.value === null` whenever there is no entry for today.value, in which case the component is not rendered at all. On the very first ever check-in, `baseline` is null, `personalized` is false, verdict comes from the absolute bands only, and the copy says so ("Not enough check-ins yet to know your normal" / "{needed} more and the coach can read these against your own normal"). No fake precision.

ACCESSIBILITY / THEMES: colour is carried by `--positive` / `--warning` / `--negative` via the three existing text classes and must never be the only signal — the headline word itself states the verdict, which is why "Steady" and "Well below your normal" are words, not dots. The card is not clickable, so it needs no role/tabIndex (Card only adds those when given onClick). Buttons are real `<button>`s from the Button primitive. `npm run gate` renders all five themes and fails on any console error.

## Data flow

Every hop, named:

WRITE (unchanged, already exists):
1. Today.tsx line 61 renders `<ReadinessCheckIn day={today.value} onDone={...}/>` while `s.readiness.some(r => r.day === today.value)` is false.
2. Three `Segmented` taps set local component state; `save()` builds `{ day, sleep, soreness, stress }` and calls `update(s => ({ ...s, readiness: [...s.readiness.filter(r => r.day !== day), entry] }))` then `flushSave()` (src/core/store.ts). One entry per day, localStorage key `marc.state.v1`, `version: 1` untouched.

READ (new):
3. `state` signal changes → `brainContext` (selectors.ts line 39) recomputes via `contextFromState`, which already passes `readiness: state.readiness` untrimmed (context.ts line 38). No new plumbing.
4. `readingToday` (new selector) = `readinessToday(state.value.readiness, today.value)` → builds the 28-day baseline from prior entries, computes avg/delta/madDenom/z/worst/drift/lowLine and calls `readinessVerdict`. Returns null when today has no entry.
5. `adjusted` (new selector) = `adjustedRecovery(brainContext.value)`. Inside it, `readinessAdjustment(ctx)` runs `readinessToday` once more over the same entries (O(28), free) and yields `{factor, verdict, personalized}`; the loop combines `Math.max(volumeFactor, rFactor, fFactor)` capped by RECOVERY_VOLUME_FACTOR_MAX as it always has, and additionally computes `pctWithoutReadiness` from `Math.max(volumeFactor, fFactor)` alone.
6. `recovery` (existing selector, now mapping `adjusted.value`) feeds the Today Recovery section and the Body screen exactly as before — with the new factor they change for anyone who has a baseline, which is the intended behaviour change.
7. `report` (selectors line 53) → `buildReport` → `adjustedRecovery(ctx)` again internally (unchanged; report.ts is not edited) → `detectUnderRecovered` emits `readinessPersonalized` in its metrics, and `detectReadiness` emits the widened `low_readiness` metrics → `insights` / `suggestions` / `todaySuggestion` as before.
8. `verdictCard` (new selector) = `readinessCard({ readiness: readingToday.value, consequence: readinessConsequence({ recovery: adjusted.value, plan: todaySuggestion.value?.proposal ?? null, custom: state.value.customExercises, hasScheduledSplit: !!scheduledSplit.value }), canOfferPlan: canOfferTodayPlan.value })`.
9. `readinessConsequence` filters `adjusted.value` for muscles whose `adjustedPct` sits below a band while `pctWithoutReadiness` sits above it, then checks whether any `today_plan` modification with `reason === 'under_recovered'` resolves (via `findExercise(removeExerciseId, custom)?.primary[0]`) to one of those muscles. That is the proof; absent it, the copy says nothing changed.
10. Today.tsx renders `<ReadinessVerdict card={verdictCard.value} acceptLabel={plan?.acceptLabel ?? null} onAccept={accept} onWhy={() => go('coach')}/>` in the check-in's slot.

USER ACTION → STATE UPDATE (the only one):
11. Tapping the primary button fires Today.tsx's existing `accept` → `acceptProposal(plan.proposal, today.value)` (src/slices/coach/apply.ts, `case 'today_plan'`) → `update(s => ({ ...s, coach: { ...s.coach, todayPlan: { day: today, splitId, changes } } }))` → returns a confirmation string → `showToast(...)`.
12. That state change re-runs step 3 onward: `todayPlan` → `scheduledSplitId` → `scheduledSplit` → `todayChanges`, the hero updates, `canOfferTodayPlan` stays true until a session is logged, and the consequence sentence re-derives from the same numbers. Nothing was written by rendering; only by the tap.

RECOMPUTE TRIGGERS: any `state` change and the `nowMinute` tick (selectors line 27), exactly as every other selector. Cost added per recompute: `readinessToday` twice over ≤29 entries plus `readinessConsequence` over 24 muscles — microseconds. The one real cost saved is the `adjusted` refactor, which stops `adjustedRecovery` (~13 ms at 400 sessions) running twice per recompute.

WHAT NEVER HAPPENS: no network call, no proxy route, no payload field, no cache, no new localStorage key, no `version` bump, no background scheduler. The verdict never passes through `words.ts`, `explainer.ts` or `validateText` — it is brain-authored copy rendered directly, the same as `suggestNext()`'s `reason` string in Train's EntryCard.

## Network / offline

none - fully on-device. No proxy route is added or changed. `proxy/src/handler.ts`'s `onlyKeys` and `proxy/src/types.ts` are NOT edited, because no new top-level payload field exists — the only payload-visible change is additive keys inside `Finding.metrics`, which the proxy validates as an opaque record and which `allowedNumbers()` (src/brain/coach/explainer.ts lines 130–151) already picks up by recursively visiting `f.metrics`. That means `baselineAvg`, `deltaFromBaseline`, `z`, `baselineEntries`, `worstValue` and `worstMedian` become legal numbers for the model to quote in an /explain or /ask answer with no other change, and `z` is its own field so the model is never asked to compute it — the StatsPr.value rule. The privacy blocklist is untouched: nothing here is `profile`, `name`, `email`, `bodyWeightKg`, `heightCm`, `sessions`, `evidence` or `sessionIds`. Offline behaviour is identical to online behaviour: with `remoteExplainer === false` (the default) every part of this feature works exactly the same, because none of it is in the remote path. No quota, no rate-limit, no cache impact. No redeploy of the Worker is required to ship this.

## Tests to write

- tests/readiness.test.ts — `readinessBaseline` gate: 9 entries on the 9 days before TODAY returns null; 10 returns a baseline with `entries === 10`. Assert against READINESS_BASELINE_MIN_ENTRIES rather than the literal.
- tests/readiness.test.ts — `readinessBaseline` excludes today: 10 prior entries of (4,4,4) plus a TODAY entry of (1,1,1) gives `avg.median === 4` and `sleep.median === 4`; the same 10 priors with no TODAY entry give the identical baseline.
- tests/readiness.test.ts — `readinessBaseline` window: 10 entries 30–40 days before TODAY return null; the same 10 placed inside 28 days return a baseline. Also assert a future-dated entry (TODAY+1) is excluded.
- tests/readiness.test.ts — `readinessMad` floor is applied, not the raw MAD: with 10 identical (4,4,4) priors `baseline.avg.mad === 0` but `readinessToday(...).madDenom === READINESS_MAD_FLOOR`.
- tests/readiness.test.ts — amber band: 10 priors of (4,4,4), TODAY (4,4,2) → `avg === 3.3`, `delta === -0.7`, `z === -1.17`, `verdict === 'amber'`, `personalized === true`, `worst.dimension === 'stress'`, `worst.delta === -2`.
- tests/readiness.test.ts — relative red: 10 priors of (4,4,4), TODAY (4,2,2) → `avg === 2.7` (deliberately ABOVE READINESS_LOW_AVG), `z === -2.17`, `verdict === 'red'`. Assert `avg > READINESS_LOW_AVG` in the same test so the relative path is provably what fired.
- tests/readiness.test.ts — THE CRY-WOLF FIX: 10 priors of (2,2,2), TODAY (2,2,2) → `avg === 2` which is `<= READINESS_LOW_AVG`, yet `verdict === 'steady'`, `personalized === true`, `z === 0`. Comment the test with why: a habitual 2 is this person's normal, and the old absolute cut called it low every single day.
- tests/readiness.test.ts — THE INVISIBLE-CRASH FIX: 12 priors alternating (5,4,5) and (4,5,5) (median avg 4.7), TODAY (3,3,3) → `verdict === 'red'`, and assert `avg > READINESS_LOW_AVG` so the test proves this reading was completely invisible under the old absolute rule.
- tests/readiness.test.ts — hard floor survives for everyone: 10 priors of (1,1,2) (so z === 0 today) plus TODAY (1,1,2) → `avg === 1.3`, `avg <= READINESS_FLOOR_HARD_AVG`, `verdict === 'red'`.
- tests/readiness.test.ts — one cratered dimension: 10 priors of (4,4,4), TODAY (5,5,1) → `z === -0.5` (above the amber z line) but `worst.delta === -3` → `verdict === 'amber'` via READINESS_DIM_DROP.
- tests/readiness.test.ts — green needs no dimension at 1: 10 priors of (3,3,3), TODAY (5,5,5) → 'green'; TODAY (5,5,1) → not 'green'. With no baseline at all (3 entries), TODAY (5,5,5) → 'green' with `personalized === false`, and TODAY (3,3,3) → 'steady' (assert `!== 'amber'`, since amber must be unreachable without a baseline).
- tests/readiness.test.ts — `readinessDrift`: 10 priors of (4,4,4) except the 3 most recent of which carry stress 2, plus TODAY stress 2 → `{ dimension: 'stress', value: 2, run: 4, median: 4, holding: 'sleep' }`. With only 2 consecutive 2s → null. With `baseline === null` → null. With today's stress at 4 (equal to its median) → null even at run 5, because drift requires `value <= median - 1`.
- tests/readiness.test.ts — `readinessLowLine`: `readinessLowLine(null) === READINESS_LOW_AVG`; with a 10×(4,4,4) baseline it equals `round1(4 + READINESS_Z_AMBER * READINESS_MAD_FLOOR)` i.e. 3.6. Assert against the constants, never the literals.
- tests/readiness.test.ts — `readinessToday` returns null when there is no entry for `today`, and never throws on an empty array.
- tests/coach-readiness.test.ts — REPLACES the block at lines 18–23. New test 'steps by verdict rather than ramping, and a habitual low reading no longer widens anything': (a) no baseline + entry(TODAY,2,2,2) → READINESS_RECOVERY_FACTOR_MAX (the absolute band, since there is no personal normal yet); (b) no baseline + entry(TODAY,1,1,1) → READINESS_RECOVERY_FACTOR_MAX (this assertion is carried over verbatim from line 22); (c) a 10-entry (4,4,4) baseline + entry(TODAY,4,4,2) → READINESS_RECOVERY_FACTOR_AMBER, and assert it is strictly greater than 1 and strictly less than READINESS_RECOVERY_FACTOR_MAX; (d) a 10-entry (2,2,2) baseline + entry(TODAY,2,2,2) → exactly 1.
- tests/coach-readiness.test.ts — widen-only invariant, as a loop: for all 125 (sleep, soreness, stress) triples, with and without a 10-entry (3,3,3) baseline, `readinessFactor` is `>= 1` and `<= READINESS_RECOVERY_FACTOR_MAX`.
- tests/coach-readiness.test.ts — the existing tests at lines 11–16, 26–49, 51–82 and 84–115 must still pass with no edit. Run them first; if any fails, the implementation is wrong, not the test.
- tests/coach-readiness.test.ts — `pctWithoutReadiness`: with the `usual` chest fixture and no check-in, `pctWithoutReadiness === adjustedPct` and `windowHoursWithoutReadiness === adjustedWindowHours`; with entry(TODAY,1,1,1), `adjustedPct < pctWithoutReadiness` and `pctWithoutReadiness` equals the no-check-in run's `adjustedPct`. Also assert `readinessPersonalized === false` there and `true` with a 10-entry baseline.
- tests/coach-readiness.test.ts — `readinessConsequence` 'recovery_flag': build a chest session timed so that raw recovery sits just above RECOVERY_FLAG_PCT and a red check-in pushes `adjustedPct` below it → kind 'recovery_flag', `muscles` contains 'chest', `pct === adjustedPct`, `pctWithout === pctWithoutReadiness`, `thresholdPct === RECOVERY_FLAG_PCT`.
- tests/coach-readiness.test.ts — `readinessConsequence` 'none': a red check-in with every muscle fully recovered (no sessions) and `hasScheduledSplit: true` → `{ kind: 'none' }`. This is the case an agent will paper over with an invented consequence; the test exists to stop that.
- tests/coach-readiness.test.ts — `readinessConsequence` 'none_scheduled': same fixture with `hasScheduledSplit: false` → `{ kind: 'none_scheduled' }`.
- tests/coach-readiness.test.ts — `readinessConsequence` attribution: with a crossed chest muscle and a hand-built today_plan Proposal whose `modifications` contain `{ removeExerciseId: 'lib_machine_chest_press', reason: 'under_recovered' }` → kind 'plan_swap' with that id in `exerciseIds`. The SAME modification with `reason: 'note_flag'` → NOT 'plan_swap' (falls through to 'recovery_swap'/'recovery_flag'). A modification on a muscle whose `pctWithoutReadiness` was ALREADY below RECOVERY_SWAP_PCT → NOT 'plan_swap', because last session's volume caused that, not this morning.
- tests/coach-readiness.test.ts — `readinessCard` coverage: loop over all four verdicts × personalized true/false × all five consequence kinds, asserting `headline` and `detail` are non-empty and pass the `looksClean` predicate copied from tests/coach-words.test.ts (`!/undefined|NaN|\{|\}|\[object/.test(s)`), that `consequence === ''` for green and steady and non-empty for amber and red, and that `showPlanAction` is false for green and steady regardless of `canOfferPlan`.
- tests/coach-readiness.test.ts — `readinessCard` steady drift copy: with the drift fixture, `detail` contains 'Stress', '2/5', 'last 4 check-ins' and 'sleep is holding', and contains no '%' and no number absent from the entry/baseline.
- tests/coach-readiness.test.ts — `detectReadiness` now speaks for a relative crash: 12 priors around 4.7, yesterday (3,3,3), TODAY (3,3,3) → one finding with `metrics.avg === 3`, `metrics.personalized === true`, `metrics.baselineAvg === 4.7`, `metrics.lowCheckIns === 2`, `metrics.verdict === 'red'`, and `metrics.avg > READINESS_LOW_AVG` (proving it is the relative path). Assert `principles` is still `['subjective_readiness_monitoring']`.
- tests/coach-readiness.test.ts — `detectReadiness` stays silent for the habitual-2 person: 10 priors of (2,2,2), yesterday (2,2,2), TODAY (2,2,2) → `toEqual([])`. The cry-wolf fix at the findings layer.
- tests/coach-words.test.ts — extend the existing 'under_recovered names the fatigue note' test: metrics `{ pct: 45, hoursLeft: 26, lastDay: '2026-09-18', readinessFactor: 1.3, readinessPersonalized: true }` → `noticed` contains 'below your own normal' and does NOT contain 'read low'; the same with `readinessPersonalized: false` → contains 'read low' and does not contain 'your own normal'; with `readinessFactor` absent → neither sentence appears.
- tests/coach-words.test.ts — new low_readiness wording test: metrics with `personalized: true, baselineAvg: 4.7, avg: 3, sleep: 3, soreness: 3, stress: 3` → `noticed` contains '4.7' and 'your usual', title contains 'your own normal'; the same metrics with `personalized: false` and no baselineAvg → the existing wording, and `noticed` must not contain 'normal'.
- tests/coach-fuzz.test.ts — no edit needed, but it must pass unchanged: its 50 personas already generate random readiness entries at coverages 0 to 1 (lines 125–131, 168–169), and its `Number.isFinite` sweep over `reportNumbers(report)` (line 294) is the regression net that catches a NaN `z` or `deltaFromBaseline` leaking from an empty-baseline division. Run it and say so.

## Acceptance criteria

- [ ] `npm run check` passes: tsc --noEmit under `strict` + `noUncheckedIndexedAccess`, the full vitest suite (existing 374 tests plus the new ones), and the build.
- [ ] `npm run gate` passes across all five themes with zero console errors, with a check-in saved for the current day.
- [ ] `npm run backtest` produces the same output as before this change: src/brain/coach/backtest.ts line 188 passes `readiness: []`, so readinessFactor is 1 on every backtested day and no backtest number may move.
- [ ] A person with no baseline who answers 1/1/1 sees a red card; `readinessFactor` returns READINESS_RECOVERY_FACTOR_MAX; the pre-existing assertions at tests/coach-readiness.test.ts lines 22, 36, 46, 78 and 80 still hold with no edit.
- [ ] A person with ten (2,2,2) check-ins in the last 28 days who answers 2/2/2 sees 'Steady', `readinessFactor` returns exactly 1, `detectReadiness` returns [], and no recovery window is widened. Before this change they got a permanent 1.1x and a daily low_readiness finding.
- [ ] A person whose median average is 4.7 who answers 3/3/3 sees a red card, `readinessFactor` returns READINESS_RECOVERY_FACTOR_MAX, and `detectReadiness` can fire. Before this change this reading was entirely invisible to the brain.
- [ ] With under ten prior check-ins in the window, `readinessBaseline` returns null, `ReadinessToday.personalized` is false, the verdict comes only from READINESS_FLOOR_HARD_AVG / READINESS_LOW_AVG / READINESS_GOOD_AVG, and the rendered copy says so in words rather than quoting a personal normal.
- [ ] Every number rendered on the card traces to a value the person tapped or a count of their own entries: sleep/soreness/stress are the taps; avg, baselineAvg, worstMedian, driftMedian and lowLine are medians or means of taps; run, entriesInWindow and needed are counts of entries; pct and pctWithout are AdjustedRecovery fields; swapPct and flagPct are bands constants. No number on the card is computed inside a template string.
- [ ] The consequence sentence appears only for amber and red, is exactly one sentence, and says 'nothing changes' whenever no muscle's `adjustedPct` crossed RECOVERY_FLAG_PCT or RECOVERY_SWAP_PCT that its `pctWithoutReadiness` did not, and no today_plan modification with `reason === 'under_recovered'` resolves to such a muscle.
- [ ] No state is written by rendering the card. The only write is ReadinessCheckIn's existing save, and the only mutation reachable from the card is `acceptProposal` behind the primary button tap.
- [ ] `adjustedRecovery` is called exactly once per selector recompute (via the new `adjusted` selector), and `readinessFactor` still never returns below 1 nor above READINESS_RECOVERY_FACTOR_MAX, still combines with volume and fatigue by Math.max, and is still capped by RECOVERY_VOLUME_FACTOR_MAX.
- [ ] No file under proxy/ is modified, no new key is added to localStorage, `AppState.version` stays the literal 1, and `ReadinessEntry` gains no field.
- [ ] `src/brain/readiness.ts` and `src/brain/coach/verdict.ts` import nothing from src/ui, src/slices, src/native or src/core/store.
- [ ] docs/COACH_BRAIN.md carries the updated `low_readiness` detector row, the corrected Phase 8 readiness paragraph, and one new dated decisions-log row ending in the deploy consequence.

## Do NOT

- Do NOT add a FindingKind or ProposalKind. Do not touch src/brain/coach/contract.ts, src/data/principles.json, CATEGORY_OF/KIND_WEIGHT in words.ts, report.ts's `raw` array, ACCEPT_COOLDOWN_DAYS or PROPOSAL_ORDER. The verdict is a brain function rendered by the UI, not a finding.
- Do NOT edit anything under proxy/. No `onlyKeys` change, no proxy/src/types.ts change, no new GroundingPayload field. Nothing new leaves the device.
- Do NOT delete or weaken the existing assertions in tests/coach-readiness.test.ts. Exactly ONE block — lines 18–23, the linear-ramp test — is re-derived. Lines 11–16, 26–49, 51–82 and 84–115 must pass untouched; if one fails, fix the implementation.
- Do NOT let `readinessFactor` return a value below 1, and do NOT multiply the readiness, volume and fatigue factors together. `Math.min(RECOVERY_VOLUME_FACTOR_MAX, Math.max(volumeFactor, rFactor, fFactor))` stays exactly as written.
- Do NOT compute the counterfactual by calling `adjustedRecovery` or `recoveryStatus` a second time, and do NOT reconstruct it from the round2'd `volumeFactor`/`fatigueFactor` fields on the returned object. Compute `pctWithoutReadiness` inside the existing loop where the unrounded factors are in scope. `recoveryStatus` is 13 ms at 400 sessions.
- Do NOT write any user-facing copy inside ReadinessVerdict.tsx beyond the 'Morning check-in' eyebrow and the 'Why' button label. Every headline, detail and consequence string is built in src/brain/coach/verdict.ts.
- Do NOT invent a consequence. If no muscle crossed a band because of the check-in and no today_plan modification traces to one, the sentence must say nothing changed. An amber morning that genuinely changed nothing is a correct, honest output, not a bug to paper over.
- Do NOT do arithmetic inside a copy template — no `${pct - pctWithout}`, no percentage deltas, no 'x% worse'. `pct` and `pctWithout` are separate fields for exactly this reason (see StatsPr.value beside StatsPr.detail).
- Do NOT attribute a today_plan modification with `reason: 'note_flag'` to the check-in. That traces to a session note, not to this morning. Likewise do not attribute a modification whose muscle was already below RECOVERY_SWAP_PCT without the check-in.
- Do NOT use the CSS class `negative-text` — it does not exist in src/ui/styles.css. The negative tone class is `danger-text` (line 218).
- Do NOT add an all-day chip under the Today hero, a second card, a Coach-tab surface, or a banner. One card, in the check-in's own slot.
- Do NOT change ReadinessCheckIn.tsx's `save()` — the write, the `flushSave()` and the `onDone()` callback stay exactly as they are — and do NOT make the check-in card stop appearing when unanswered.
- Do NOT label the primary button 'See today's plan' or anything else that implies navigation. It APPLIES the plan through `acceptProposal`, so it must carry `todaySuggestion.acceptLabel` — the real label the hero already shows.
- Do NOT apply anything automatically on save, do NOT pre-select the plan, and do NOT write `coach.todayPlan` from the verdict path. `src/slices/coach/apply.ts` stays the only mutation point and it runs only on an explicit tap.
- Do NOT include today's entry in the baseline. The baseline is prior days only; including today makes the comparison circular and the z-score collapse toward 0.
- Do NOT lower READINESS_BASELINE_MIN_ENTRIES to 6 or READINESS_MAD_FLOOR to 0.4. At mad 0.4 a single dimension moving two points trips red, which reinstates precisely the cry-wolf problem this feature exists to remove. The evidence-gate posture is to return null and hedge, never to lower the gate.
- Do NOT delete READINESS_LOW_AVG. It survives as the no-baseline band and as the basis of the documented comparison; READINESS_FLOOR_HARD_AVG is a separate, lower, always-on floor.
- Do NOT compare on an unrounded z or avg while displaying a rounded one. `ReadinessToday.avg`, `delta` and `z` are rounded once at construction, and every band comparison uses those exact stored values, so the number shown and the band it lands in can never disagree.
- Do NOT emit `baselineAvg`, `deltaFromBaseline` or `z` into `low_readiness` metrics when there is no baseline. A null or NaN reaching `reportNumbers()` fails tests/coach-fuzz.test.ts's finite-number sweep.
- Do NOT import from src/core/store, src/app/selectors, src/ui or src/slices inside src/brain/**. Both new brain files take plain data as arguments.
- Do NOT change src/brain/stats.ts or `buildAskStats` to use adjusted recovery. It deliberately reads raw `recoveryStatus`, and /ask's snapshot is out of scope.
- Do NOT write a component test. tests/ is node-environment and `tests/**/*.test.ts` only — there is no component testing setup. Test `readinessCard` as a pure function instead.
- Do NOT say 'days' in the drift sentence. The run is counted in check-in entries, which can skip days; say 'your last N check-ins'.
- Do NOT round with a new helper or import `round1`/`round2` from coach/detectors/shared.ts into src/brain/readiness.ts. Define them locally, matching the existing one-liners.
- Do NOT add CSS to src/ui/styles.css or a new UI primitive. Everything the card needs already exists.
- Do NOT let the action row persist once a session is live or logged today — `canOfferTodayPlan` must include `sessionsToday.value.length === 0 && !state.value.active`.

## Verification addendum — binding implementation details

- Paths and current exports are in `03-SOURCE-VERIFICATION.md`. `ReadinessVerdict` is a new component and a new brain type in different modules: import the type with an alias if a consumer needs both. Add `import type { JSX } from 'preact'` for the proposed explicit return type.
- Validate input day keys and integer ratings 1–5, de-duplicate by day (last array occurrence wins), then sort copies. Use that same private canonicalization in every public readiness helper. `readinessDrift` returns null without today's valid entry. A duplicate/future/malformed backup cannot satisfy the ten-distinct-prior-days gate.
- Changes begin on Save, never on the third scale tap. `baselineEntriesNeeded` counts missing **prior** entries: with eight entries including today, seven are prior and three are still needed. It is a count deficit, not a guaranteed date; copy says “more prior check-ins are needed” to avoid promising that the very next save creates a baseline.
- The existing source does not assign a habitual 2 a permanent 1.3 factor: it assigns 1.1. Replace that inherited example in the implementation decision log. The new personalized steady behavior is factor 1.
- Use pending-proposal language. `acceptProposal` applies modifications only if the recommended split is the subject split. Do not claim an ignored swap caused a split switch. A drop without a replacement is an adjustment, not a swap. Only the actual attributed muscle supplies the displayed recovery pair.
- Green may mean a high absolute reading, not an improvement over baseline. The corrected neutral copy names both averages without inventing a direction and never encourages overriding an easier week.
- The `none` consequence includes `thresholdPct`; use `toMatchObject({kind:'none'})`, not equality against an incomplete object. Build the steady-drift copy fixture with stress 3 against 4; stress 2 against 4 is amber under READINESS_DIM_DROP and is not a steady example.
- Add named tests `future readiness cannot create a low pattern`, `duplicate days do not create a baseline`, `switching splits does not claim an ignored swap`, `attribution names only the muscle whose numbers are shown`, and `absolute green does not claim above-baseline improvement`.
- The relative-low detector carries extra derived metrics through existing optional user-requested payloads. It causes zero new calls; “nothing new leaves” means no raw readings/body/session envelope is introduced, not that the widened Finding.metrics are magically local-only.
- Implement the specified 10-in-28 gate, MAD floor 0.6, widen-only factors and neutral green copy. No owner confirmation is needed for the defaults; the following notes are future tuning only.

## Deferred tuning notes (not implementation blockers)

- The baseline gate is specified as 10 check-ins in 28 days with a MAD floor of 0.6, raised from the originally-sketched 6 and 0.4 because at mad 0.4 one dimension moving two points trips red. 10-in-28 is roughly two and a half check-ins a week; if the owner's own logging cadence is lighter, 8 is the next defensible value and only READINESS_BASELINE_MIN_ENTRIES changes. Implement 10; flag it for tuning after two weeks of real use.
- `detectReadiness` can now fire for someone whose absolute average is high (4.7 dropping to 3.0) and can no longer fire for someone whose absolute average is always low. That is the intended correction, but it changes who the `low_readiness` insight speaks to. Evaluate this intended change in the named tests before shipping, since the finding's copy and its research card were both written for the absolute reading.
- Green's closing clause — 'A good day to take the top set closer to the limit, if the plan calls for it' — is the only place in the app that nudges toward harder work. The wording has been corrected above so it does not read as permission to override an active deload or the goal's RIR band (it does not change either mechanically; deload and effort_mismatch are untouched).
- The riskiest assumption is honesty drift: once people learn a low score visibly changes the plan, self-reports tend to migrate toward the middle. Decide whether to add a one-line note in Settings or under the check-in saying plainly that the check-in changes today's plan, which tends to help rather than hurt honesty — deliberately not specified here because it is a product judgement, not an implementation detail.
- The verdict card currently stays in the check-in's slot for the rest of the day, with its action row hiding once a session starts. The alternative is collapsing it to a single line after the first session. Specified as 'stays' because it needs no new storage and no new state; revisit after living with it.
