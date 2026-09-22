# One rep short: near-miss records

> Recognize a logged performance close to an existing record, with exactly what was matched and what would exceed it.

**Rank:** 14 · composite 20.3 · design effort 4/10 · network never.
**Status:** proposed implementation against `c3f4675`. Uses spec 12's exported history helpers; does not change what counts as a PR.

## User story

After a set matches my previous 8 reps at 60 kg, the finish screen says “Matched your 8-rep best at 60 kg. One more would be a new rep record.” If I already set a record on that exercise, the actual PR keeps priority. This is recognition of the log, not an instruction to try another set.

## Brain work

NEW `src/brain/coach/detectors/nearmiss.ts` exports:

```ts
export interface NearMiss {
  exerciseId: string; exerciseName: string; sessionId: string; day: string;
  kind: 'reps_at_load' | 'best_reps' | 'heaviest' | 'strength';
  value: number; standing: number; required: number;
  gap: number; kg: number | null;
}
export function nearMissFor(current: ExerciseSessionSummary, prior: ExerciseSessionSummary[], mode: ResistanceMode, exerciseId: string, exerciseName: string): NearMiss | null;
export function sessionNearMisses(session: Session, allSessions: Session[], custom?: Exercise[]): NearMiss[];
export function detectNearMiss(ctx: BrainContext): Finding[];
```

Import summary types and exerciseHistory/modeOf from `src/brain/history.ts`; recordsFor and now-exported repsAtLoadMap from `src/brain/prs.ts`; loadStep from `src/brain/progression.ts`; core Session/Exercise/ResistanceMode; BrainContext/Finding from their existing coach modules. No allRecords scan or parallel record definition.

Rules:

1. Only weighted/bodyweight, and at least two prior working exposures. Any recordsFor(current,prior,mode,...) result suppresses all near-miss copy for that exercise. Unknown exercise mode, empty work, missing required numbers and assisted/duration/conditioning return null. No body-mass estimate.
2. Weighted reps-at-load: a current working set at a known positive prior kg equals the best prior reps at that load or is exactly one below it. required=standing+1, value=current reps, gap=required-value, kg=current.kg; require value>0. A tie is one rep from a new record; one below the old best needs two to beat it. Preserve that distinction in copy. Among ties choose highest kg, then most reps.
3. Bodyweight: the same equal-or-one-below rule on bestReps; kg=null. No implied comparison of assistance or changing body mass.
4. Heaviest, only if no rep candidate: standing=max prior topKg; required=round to nearest 0.5 of (standing+loadStep(standing)); value=current.topKg. Offer only value>0, value≤standing and standing-value≤loadStep(standing)+0.001. This recognizes a log within one normal step of the standing load; required is the first proposed step above that record, and gap may therefore be two steps. gap=required-value. No prescription to use that load next time.
5. Strength estimate, only if neither above: standing=max prior bestE1rm>0. The existing record test is strictly current.bestE1rm > standing*1.01. Define required=(floor(standing*1.01*10)+1)/10, the next 0.1 kg threshold above it. Require current.bestE1rm>0, ≤standing*1.01, and current.bestE1rm>=standing*0.98. Return exact derived values; round to one decimal **inside the brain** for numeric copy fields, retaining the raw comparison values locally if needed. If rounded current and required are indistinguishable or rounded gap is zero, suppress the strength candidate; never print a zero-away near miss. Call it an estimate, never a measured 1RM or load prescription. Exclude reps>10 automatically through summarizeSets's existing bestE1rm rules.
6. sessionNearMisses looks up the current summary by session.id and builds prior strictly from earlier `startedAt`, tie-break id lexical, excluding current/future/deleted sessions. Sort each canonical exercise's history accordingly instead of assuming imported array order. Resolve aliases through exerciseHistory and avoid duplicate canonical exercise IDs. Return at most two, ordered reps-at-load, bodyweight, heaviest, strength, then exerciseId. No same-session PR/near-miss double counting.
7. detectNearMiss uses the latest valid saved working session, dated today or up to two days earlier, never a future session. Emit the strongest one only (Coach noise budget). Severity 0, confidence medium, target exerciseId, subject exercise ID/name. Metrics: recordKind, current, standing, required, gap, sessionDay and optional loadKg. Round strength metrics as above; weight conversions stay at render edge. Evidence includes current and the prior sessions supporting the standing record; window covers them. Do not emit a proposal.

## Contract changes

NEW FindingKind `near_miss`, principle mapping `progressive_overload` and `one_rm_estimation` with reverse entries in `src/data/principles.json`. Add CATEGORY_OF progress and wordsFor branch in words.ts, register detector export in detectors/index.ts and call in report.ts. Confidence is medium; no LOW_OK change required. Do not add ProposalKind, change recordsFor thresholds or edit proxy schema/validator. All novel copy quantities must be explicit scalar metrics rather than arithmetic left to remote prose.

## Files to create / modify

Create `src/brain/coach/detectors/nearmiss.ts`, `src/slices/workout/NearMissNote.tsx`, `tests/near-miss.test.ts`. Modify `src/brain/coach/detectors/index.ts`, `src/brain/coach/report.ts`, `src/brain/coach/contract.ts`, `src/brain/coach/words.ts`, `src/data/principles.json`, `src/slices/workout/Train.tsx`, `tests/coach-explainer.test.ts`, `tests/principles.test.ts`. Spec 12 owns the small prs.ts export change; do not duplicate it.

## UI spec

FinishScreen shows at most one quiet note after Plan and actual, using fresh saved session lookup from spec 10. Props `{ miss: NearMiss; unit: 'kg' | 'lb' }`. Existing actual PR presentation remains first. Coach uses the existing insight card and sheet with research references. No toast/modal, autoplay celebration or retry button.

| Copy | Placeholder source |
|---|---|
| `Matched your {standing}-rep best at {load}. {gap} more would be a new rep record.` | NearMiss.standing, formatLoad(kg,unit), gap=1 for this matched-best template; singular grammar |
| `{value} reps; previous best {standing}. {required} would beat it.` | Bodyweight fields; weighted one-below case uses the same template with formatted kg |
| `Logged {valueLoad}; heaviest previously {standingLoad}. A load above {standingLoad} would beat it; the next normal step is {requiredLoad}.` | Heaviest value/standing/required via formatLoad, no promise or changed target |
| `Strength estimate {valueLoad}; the next record threshold is {requiredLoad}.` | Strength's rounded numeric fields with formatLoad; explicitly estimate |
| `A useful marker for another day; no extra set needed now.` | Literal |

Use singular “rep” for gap=1. Exact details may show the supporting session date with formatDay; no invented countdown or claim that the next session will set a record. If a later History edit turns it into an actual PR, the near miss disappears on recomputation.

## Data flow

Finish saves real working sets → fresh session → canonical current/prior histories → recordsFor exclusion → nearMissFor → one finish note. buildReport independently calls detectNearMiss for existing Coach insights. History edits/deletion, new records, custom exercise changes and date expiry recompute; no persisted celebration state or new target.

## Network and offline behaviour

Zero calls at finish or on Coach. Off/offline/quota exhausted is identical. Existing user-requested report explanation may use explicit scalar near_miss metrics through the unchanged payload path. No raw history or body measurements included. If remote date/unit wording fails grounding, retain deterministic local text; never relax allowedNumbers or validateGrounding.

## Tests to write

- `matched eight is one from a new record while seven correctly names nine and gap two`.
- `any actual PR on the exercise suppresses all its near misses`.
- `two prior exposures required and first sessions remain baselines`.
- `new unknown loads assisted duration and conditioning do not infer a rep best`.
- `strict one-percent strength boundary and next-tenth threshold agree with recordsFor`.
- `heaviest-load comparison respects loadStep around 10 and 30 kg`.
- `import order and same-day timestamp tie-break do not leak future history`.
- `alias entries produce one canonical result`; `edited/deleted standing record recomputes`.
- `detector expires after two local days and ignores future sessions`.
- `finish caps at one and actual PR styling wins`; `all emitted copy numbers are grounded`.

## Acceptance criteria

- [ ] Every named test in this spec passes, including empty, legacy, edited and deleted history.
- [ ] Only the explicit actions described above mutate state; all new brain functions are pure.
- [ ] App and proxy typecheck, both full test suites, production build, five-theme visual gate, and live Playwright feature checks pass. Run `npm run typecheck`, `npx tsc --noEmit -p proxy/tsconfig.json`, `npm test`, `npm --prefix proxy test`, `npm run build`, then `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` (use an installed Chromium path if different).
- [ ] Live verification covers kg/lb, 360px and 390px, keyboard access, navigation away/back, reload/resume, backup export/import and the explicit accept/dismiss path. Inspect screenshots in all five themes; no overflow or console errors. No new component-test framework.
- [ ] Append a dated `docs/COACH_BRAIN.md` decision entry stating actual behavior and deploy consequence; commit this feature, push, and verify CI for that exact commit. No Worker deploy for this spec.

## Do NOT

- Do not call tying the old record a new record, or say one rep below it is one rep from beating it.
- Do not fabricate first-session records, turn estimated 1RM into measured strength, or change existing PR thresholds.
- Do not nudge an extra set, max effort, heavier load today, or a target override.
- Do not perform a full allRecords pass per row, send actual sets to the proxy, or loosen grounding for dates/converted units.
