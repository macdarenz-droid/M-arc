# Effort-rating repair and calibration

> Repair unrated working sets while the just-finished workout is still fresh, using explicit per-set choices.

**Rank:** 11 · composite 21.1 · design effort 3/10 · network never.
**Status:** proposed implementation against `c3f4675`. Depends on spec 10's fresh saved-session lookup, but old saved sessions remain repairable without plan metadata.

## User story

After saving a workout with unrated sets I see “Rate the sets you remember”. I tap Easy, Ideal or Max for each set I remember; Skip leaves the rest unknown. The explanation tells me what these labels mean. I can edit later in History. Escobar never guesses my effort from reps or load.

## Brain work

Append to NEW `src/brain/debrief.ts` from spec 10 (do not recreate the file). Existing `isWorkingSet` in `src/brain/exposure.ts`, `Effort`/`LoggedSet`/`Session` in `src/core/models.ts`, `RIR_BAND` in `src/brain/coach/bands.ts`, and `suggestNext` in `src/brain/progression.ts` are the owners.

```ts
export interface UnratedSet {
  exerciseIndex: number; setIndex: number; exerciseId: string;
  exerciseName: string; setNumber: number; fingerprint: string;
  actual: LoggedSet;
}
export interface EffortRepair {
  workingSets: number; ratedSets: number; missingSets: number;
  coverage: number; offer: boolean; missing: UnratedSet[];
}
export function unratedSets(session: Session): UnratedSet[];
export function effortRepair(session: Session): EffortRepair;
export function effortSetFingerprint(session: Session, exerciseIndex: number, setIndex: number): string | null;
export function effortCalibration(): Array<{ effort: Effort; label: string; rir: readonly [number, number] }>;
```

unratedSets returns the missing row vector; effortRepair reuses it for coverage. Count only working sets. Valid effort is easy/ideal/max; other imported strings count as unknown but are never silently rewritten. coverage=validRated/working, with empty→0 and offer=false. Offer when at least one working set exists and coverage<0.5. Return all missing rows for an opened repair strip, even after coverage reaches .5. setNumber is the actual saved row's one-based index; it is not a claim about a filtered original plan row.

Fingerprint is canonical JSON of `[session.id,session.startedAt,exerciseIndex,exercise.exerciseId,exercise.planEntryId ?? null,setIndex,set.kg ?? null,set.reps ?? null,set.durationSec ?? null,set.distanceM ?? null,set.effort ?? null]`; number/string identity matters. It guards concurrent edits, not authentication. Invalid position returns null. Calibration returns labels Easy/Ideal/Max and the existing RIR_BAND pairs; no new physiological threshold or detector.

Existing weighted progression can return mode `confirm_effort` with insufficient coverage across recent history. The feature's generic copy says ratings help future targets. If displaying “Next target is held until more sets are rated”, first call suggestNext on fresh saved history and require that exact mode for the named exercise. A single unrated session is not proof that every mode is held.

## Contract changes

No new FindingKind, ProposalKind, stored plan field or proxy field. Only existing LoggedSet.effort changes on explicit tap. NEW export in `src/slices/workout/session.ts`:

```ts
export function setSessionEffort(sessionId: string, exerciseIndex: number, setIndex: number, expectedFingerprint: string, effort: Effort): boolean;
```

Read the current session in state, match the fingerprint and isWorkingSet, validate effort, clone only the selected nested arrays/set, update state and flushSave. If the session/set was deleted, edited, already rated through another action or moved, return false with no write. No call to commitSet, startRest, finishSession, note tagging, preference refresh or notifications. Existing selectors recompute from the changed sessions reference. Fix History SessionEditor's save guard from spec 10 to reject stale drafts rather than overwrite this repair.

## Files to create / modify

Create `src/slices/workout/EffortRepair.tsx`, `tests/effort-repair.test.ts`. Append `src/brain/debrief.ts`; modify `src/slices/workout/session.ts`, `src/slices/workout/Train.tsx`. Spec 10 owns the necessary History stale-save guard in `src/slices/history/History.tsx`. No styles beyond existing primitives/tokens unless the three-button wrap genuinely needs a small class in `src/ui/styles.css`.

## UI spec

Mount EffortRepair after the receipt and before Plan and actual in FinishScreen. Props `{ session: Session; onDone: () => void }`; Train owns session-local open state keyed by session.id. Once opened, keep the strip open while rating even when coverage crosses .5; Done or Skip closes it for this finish view. Reopening History uses its existing effort editor; no persisted “seen” flag. A fresh lookup each render reflects each tap immediately.

| Copy | Placeholder source |
|---|---|
| `Rate the sets you remember` | Literal heading |
| `{missing} of {working} working sets have no effort rating.` | EffortRepair.missingSets/workingSets |
| `{name} · Set {number} · {load} × {reps}` | UnratedSet.exerciseName/setNumber/actual; formatLoad with saved kg and current unit |
| `Easy · {low}–{high} reps left` | effortCalibration easy tuple (currently 4–6) |
| `Ideal · {low}–{high} reps left` | ideal tuple (currently 1–3) |
| `Max · {low}–{high} reps left` | max tuple (currently 0–1) |
| `These are rough effort bands. If you cannot remember, leave it unrated.` | Literal; no retrospective guess |
| `Ratings help Escobar choose future targets.` | Literal generic benefit |
| `Done` / `Skip for now` | Close local strip only; preserve choices already explicitly saved |
| `That set changed. Check it in History.` | Fresh fingerprint failure, no silent overwrite |

For bodyweight omit load; duration shows seconds; conditioning shows available distance/time and no fabricated rep count. Use Button with full accessible label including exercise, set and effort. Three equal, wrapping buttons; no selected-by-default value. “Skip for now” is the dismissal path. Do not trap the user on Finish or block Done.

## Data flow

Finish tap → persisted Session → effortRepair → rows → explicit rating tap → fingerprint revalidation → one LoggedSet.effort saved → fresh Session → recomputed coverage and existing brain signals. Nothing derives a rating from plan adherence or the LLM.

## Network and offline behaviour

Identical fully offline. Rating/Skip/Done trigger zero network calls and never use quota. Existing optional note tagging occurs only through its own note action. No measurements or actual-set payloads sent.

## Tests to write

- `zero work never offers repair`; `one of two rated does not auto-offer`; `one of three rated does`.
- `weight-only placeholders are not missing working sets`.
- `each explicit tap changes exactly one effort field and persists once`.
- `deleted edited or moved row rejects the stale fingerprint`.
- `rating does not start rest save another session or tag notes`.
- `repair continues after threshold crossing until Done or Skip` (live Playwright).
- `Skip preserves unknown effort and prior explicit choices`.
- `calibration copies RIR_BAND without redefining it`.
- `held-target copy requires confirm_effort`; `History stale save cannot erase repair`.

## Acceptance criteria

- [ ] Every named test in this spec passes, including empty, legacy, edited and deleted history.
- [ ] Only the explicit actions described above mutate state; all new brain functions are pure.
- [ ] App and proxy typecheck, both full test suites, production build, five-theme visual gate, and live Playwright feature checks pass. Run `npm run typecheck`, `npx tsc --noEmit -p proxy/tsconfig.json`, `npm test`, `npm --prefix proxy test`, `npm run build`, then `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` (use an installed Chromium path if different).
- [ ] Live verification covers kg/lb, 360px and 390px, keyboard access, navigation away/back, reload/resume, backup export/import and the explicit accept/dismiss path. Inspect screenshots in all five themes; no overflow or console errors. No new component-test framework.
- [ ] Append a dated `docs/COACH_BRAIN.md` decision entry stating actual behavior and deploy consequence; commit this feature, push, and verify CI for that exact commit. No Worker deploy for this spec.

## Do NOT

- Do not bulk-rate every set, guess from missed reps, default to Ideal, or require a rating to finish.
- Do not mutate summary.session, active session rows, or a stale History draft.
- Do not translate missing effort into max/easy, promise an automatic load increase, or add a new effort scale.
- Do not use medical readiness language, diagnose fatigue or call a prompt.
