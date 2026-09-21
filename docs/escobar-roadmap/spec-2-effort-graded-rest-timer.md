# Effort-graded rest timer

> The rest timer is graded by the effort you tapped and whether the lift was a compound, the countdown never jumps backwards, and the banner's headline is what your next set actually is.

**Tier:** quick-win · **Effort:** Small-to-medium: roughly 45 lines of new production code in brain/live.ts, ~35 changed lines in session.ts, ~25 in Train.tsx, ~12 in selectors.ts, 5 in models.ts, 6 in bands.ts, 2 CSS lines, plus a ~170-line test file and two doc edits. About half a day for a careful implementer, most of it in the store-backed fake-timer tests and in re-reading adjustRest/resumeSession/retimeRest against each other. Budget an extra hour for `npm run check` plus `npm run gate` (which boots a real browser in five themes and will exercise this exact code path).
**Judged:** value 7/10 · effort 3/10 · fit 8/10 · fires every-set · composite 24.1
**Adversarially verified:** yes, clean

## User story

You finish a heavy set of Leg Press, tab out of the reps box, and the rest timer starts on your own 90 seconds. A second later you tap "M". The clock does not reset — it keeps counting from where it is, but the total it is counting towards quietly becomes 2:15, and the line under it reads "Rest · 2:15 · +45s, max effort on a compound". Above that, in the banner's largest non-clock text, is the thing you actually want during a rest window: "Set 3 · 62.5 kg × 8" — the same target already sitting in that set row's placeholder on the card behind the banner. When the set you just logged was the last planned set of that exercise, the line reads "Last set · next up: Romanian Deadlift" instead. If you tap "M" again to clear the rating, the timer grades itself back down to your 90 seconds, still without resetting and still without the progress bar moving backwards. If you never tap effort at all, the timer behaves exactly as it does today, to the second.

## Brain work

NEW FILE /home/user/M-arc/src/brain/live.ts — pure, synchronous, no store, no signals, no prose, no Date.now(). It is the first file in brain/ about the live session rather than history. It imports ONLY: type { ActiveSession, Effort, ResistanceMode } from '@/core/models', type { GoalId } from '@/data/goals', type { Suggestion } from './progression', and the constants from './coach/bands'.

=== A. restFor(input: RestInput): RestGrade ===

Types:
  export interface RestInput { base: number; effort?: Effort; pattern: string; mode: ResistanceMode; goal: GoalId }
  export interface RestGrade { seconds: number; reasonKind: RestReasonKind }
  export type RestReasonKind = 'ungraded' | 'base' | 'easy' | 'max' | 'compound' | 'easy_compound' | 'max_compound' | 'strength_floor'

Algorithm, in exactly this order:

1. const base = clamp(input.base), where clamp(sec) = Math.max(REST_FLOOR_SEC, Math.min(REST_CEIL_SEC, Math.round(sec))). This is byte-identical to what startRest already does to preferences.restDefaultSec today.
2. if (!input.effort) return { seconds: base, reasonKind: 'ungraded' }. THIS IS THE WHOLE BACKWARD-COMPATIBILITY STORY: at reps-blur time the effort has not been tapped yet, so the grade is exactly the person's own default and the timer is identical to today's. No compound multiplier, no floor, no rounding of their own number. Do not "improve" this by applying the compound multiplier without an effort rating.
3. const compound = !!input.pattern && COMPOUND_PATTERN.test(input.pattern)  (COMPOUND_PATTERN is already exported from bands.ts:88).
4. const graded = base * REST_EFFORT_MULT[input.effort] * (compound ? REST_COMPOUND_MULT : 1)
5. const strengthGoal = input.goal === 'strength' || input.goal === 'strength_muscle'   (same predicate planners/rest.ts:8 already uses to decide who wants REST_STRENGTH_SEC as their default; keeping them in step is the point).
6. const floored = (strengthGoal && compound && input.mode === 'weighted') ? Math.max(graded, REST_STRENGTH_SEC) : graded
7. const seconds = clamp(Math.round(floored / REST_ROUND_SEC) * REST_ROUND_SEC)
8. reasonKind, first match wins:
   - seconds === base                  -> 'base'          (checked FIRST: never claim a reason when the number did not move — covers ideal/isolation, and covers a clamp that swallowed the multiplier at base 15 or base 600)
   - floored > graded                  -> 'strength_floor' (the floor was the binding constraint)
   - compound && effort === 'ideal'    -> 'compound'
   - compound && effort === 'easy'     -> 'easy_compound'
   - compound && effort === 'max'      -> 'max_compound'
   - otherwise                         -> input.effort ('easy' | 'max', both of which are RestReasonKind members)

Worked examples with the shipped constants (base 90):
  no effort, anything            -> 90,  'ungraded'
  ideal, elbow_extension         -> 90,  'base'
  easy,  elbow_extension         -> 72   -> round5 70   -> 'easy'
  max,   elbow_extension         -> 112.5 -> round5 115 -> 'max'
  ideal, squat                   -> 108  -> round5 110  -> 'compound'
  easy,  squat                   -> 86.4 -> round5 85   -> 'easy_compound'
  max,   squat                   -> 135  -> round5 135  -> 'max_compound'
  easy,  squat, goal strength, mode weighted -> 86.4 -> floor 150 -> 'strength_floor'
  easy,  vertical_pull, goal strength, mode bodyweight (Pull-Up) -> 85, 'easy_compound' (no floor: the floor rests on loaded work)
  base 600, max, squat           -> 900 -> clamp 600 -> 'base'
  base 15,  easy, elbow_extension -> 12 -> round5 10 -> clamp 15 -> 'base'

Edge cases and their required behaviour:
  - base outside 15..600 (a hand-edited or legacy-migrated preference): clamped in step 1, never trusted raw.
  - unknown exercise (findExercise returned undefined): caller passes pattern '' and mode 'weighted'; COMPOUND_PATTERN.test('') is false, so it grades as an isolation. Never throw.
  - the returned seconds is ALWAYS an integer inside [REST_FLOOR_SEC, REST_CEIL_SEC]. Assert this in a fuzz-style loop test.

=== B. nextAfterRest(entries, from, suggestion): RestNext | null ===

  export type RestNext =
    | { kind: 'set'; setNumber: number; kg: number | null; reps: number | null; durationSec: number | null }
    | { kind: 'next_exercise'; name: string }
    | { kind: 'session_end' }

  export function nextAfterRest(
    entries: ActiveSession['entries'],
    from: { entry: number; set: number },
    suggestion: Suggestion | null,
  ): RestNext | null

Algorithm:
  1. const entry = entries[from.entry]; if (!entry) return null;   (noUncheckedIndexedAccess makes this `| undefined` — guard it)
  2. const nextIndex = from.set + 1
  3. if (nextIndex < entry.sets.length):
       const t = suggestion?.sets[Math.min(nextIndex, suggestion.sets.length - 1)] ?? null
       return { kind: 'set', setNumber: nextIndex + 1, kg: t?.kg ?? null, reps: t?.reps ?? null, durationSec: t?.durationSec ?? null }
     The Math.min mirrors Train.tsx:274 exactly, so an entry extended with addSet() past the suggestion's set plan reuses the last target rather than going blank.
  4. const upcoming = entries.slice(from.entry + 1).find(e => !e.done && !e.skipped)
  5. return upcoming ? { kind: 'next_exercise', name: upcoming.name } : { kind: 'session_end' }

setNumber is 1-based for display. kg is returned in KG, unconverted — conversion happens only at the render edge (core/units.ts), per the state rule in the brief.

=== C. Three new constants in src/brain/coach/bands.ts, two moved ones ===
They are bands, so they live in bands.ts and nowhere else. See filesToModify for the exact text. No arithmetic on them anywhere but restFor.

## Contract changes

None. This feature adds no FindingKind and no ProposalKind. Do not touch src/brain/coach/contract.ts, PRINCIPLES_BY_FINDING, PRINCIPLES_BY_PROPOSAL, ACCEPT_COOLDOWN_DAYS, PROPOSAL_ORDER, report.ts's `raw` array, words.ts (CATEGORY_OF / wordsFor / renderProposal), src/slices/coach/apply.ts, src/slices/coach/preferences.ts, or KIND_LABEL in Coach.tsx.

The one principles.json edit is prose only: the `appUse` string on the existing `rest_intervals` card (src/data/principles.json:169-173) currently ends "The app does not log per-set rest, so this is advice about the default." That sentence becomes false for the live timer. tests/principles.test.ts only asserts appUse.length > 10 and that findingKinds/proposalKinds name real kinds, so editing the prose is safe; do NOT add anything to that card's findingKinds or proposalKinds arrays.

## Files to create

### `/home/user/M-arc/src/brain/live.ts`
The live session's deterministic helpers: how long to rest after a set, and what the running timer is counting towards. Pure functions over plain data, like the rest of brain/ — numbers and tags out, never prose. First file in brain/ about the live session rather than history.

```ts
export type RestReasonKind = 'ungraded' | 'base' | 'easy' | 'max' | 'compound' | 'easy_compound' | 'max_compound' | 'strength_floor';

export interface RestGrade {
  /** Seconds the timer should run end to end. Always an integer in [REST_FLOOR_SEC, REST_CEIL_SEC]. */
  seconds: number;
  /** Why it differs from the person's own default, or 'base'/'ungraded' when it does not. */
  reasonKind: RestReasonKind;
}

export interface RestInput {
  /** The person's own rest length from Settings, in seconds. Never overridden, only bent. */
  base: number;
  /** The effort tapped on the set that started this timer. Undefined until they tap one. */
  effort?: Effort;
  /** Exercise.pattern from the catalog, matched against COMPOUND_PATTERN. '' when the exercise is unknown. */
  pattern: string;
  /** Exercise.mode. The strength floor only applies to loaded work. */
  mode: ResistanceMode;
  goal: GoalId;
}

export function restFor(input: RestInput): RestGrade;

export type RestNext =
  | { kind: 'set'; setNumber: number; kg: number | null; reps: number | null; durationSec: number | null }
  | { kind: 'next_exercise'; name: string }
  | { kind: 'session_end' };

export function nextAfterRest(
  entries: ActiveSession['entries'],
  from: { entry: number; set: number },
  suggestion: Suggestion | null,
): RestNext | null;

// Imports (type-only where possible, nothing from slices/, ui/, native/ or core/store):
//   import type { ActiveSession, Effort, ResistanceMode } from '@/core/models';
//   import type { GoalId } from '@/data/goals';
//   import type { Suggestion } from './progression';
//   import { COMPOUND_PATTERN, REST_CEIL_SEC, REST_COMPOUND_MULT, REST_EFFORT_MULT, REST_FLOOR_SEC, REST_ROUND_SEC, REST_STRENGTH_SEC } from './coach/bands';
```

### `/home/user/M-arc/tests/live-rest.test.ts`
Vitest (node environment) covering restFor and nextAfterRest as pure functions, and commitSet / regradeRest / adjustRest / pause-resume against the real signals store with fake timers, following the in-memory-storage pattern of tests/coach-apply.test.ts.

```ts
No exports — a test file. Top matter:

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initStore, replaceState, state } from '@/core/store';
import { freshState, type AppState } from '@/core/models';
import { restFor, nextAfterRest, type RestNext } from '@/brain/live';
import { REST_CEIL_SEC, REST_FLOOR_SEC } from '@/brain/coach/bands';
import { startSession, commitSet, regradeRest, adjustRest, setSet, startRest, stopRest, restRemainingSec, pauseSession, resumeSession, finishSession, discardSession, active, addSet } from '@/slices/workout/session';
import { pplSplits, PUSH_ID, LEGS_ID } from './coach-helpers';

const memory = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) }; };
const seed = (): AppState => { const s = freshState(new Date('2026-06-01T00:00:00Z')); s.splits = pplSplits(); return s; };

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-09-19T18:00:00.000Z')); initStore(memory()); replaceState(seed()); });
afterEach(() => { discardSession(); vi.useRealTimers(); });

// NOTE: do NOT import '@/app/selectors' here — it installs a module-level setInterval.
// NOTE: do NOT import '@/slices/workout/Train' — vitest is node-environment and the brief forbids component tests.
// haptic() and scheduleRestDone() already no-op under node (isNative() is false, navigator.vibrate is undefined);
// tests/coach-apply.test.ts already proves session.ts imports cleanly in this environment.
```

## Files to modify

- **`/home/user/M-arc/src/brain/coach/bands.ts`** — Directly under the existing `export const REST_STRENGTH_SEC = 150; export const REST_SHORT_SEC = 120;` (lines 78-80), add the grading bands. `Effort` is already imported at line 6 for RIR_BAND, so no new import:

/**
 * Live rest grading (rest_intervals). The person's own restDefaultSec is the
 * base and is never overridden — these only bend it, and only once they have
 * actually rated the set. Harder sets and compound lifts get longer rests;
 * an easy set gets a shorter one.
 */
export const REST_EFFORT_MULT: Record<Effort, number> = { easy: 0.8, ideal: 1, max: 1.25 };
/** A compound earns a longer rest than an isolation at the same effort. */
export const REST_COMPOUND_MULT = 1.2;
/** Graded rests round to this, so the clock reads as a round number (112.5s -> 115s). Deliberately not the 15s UI step, which would distort a 1.25x multiplier into 1.17x or 1.33x. */
export const REST_ROUND_SEC = 5;
/** Hard bounds on any rest timer, in seconds. Moved here from src/slices/workout/session.ts (was REST_MIN / REST_MAX) because brain/ may never import from slices/ and restFor() has to clamp with the same numbers session.ts does. */
export const REST_FLOOR_SEC = 15;
export const REST_CEIL_SEC = 600;

Do not change REST_STRENGTH_SEC, REST_SHORT_SEC or COMPOUND_PATTERN.
- **`/home/user/M-arc/src/brain/index.ts`** — Add `export * from './live';` after `export * from './progression';` (line 6). No name collides with anything already barrelled. `stats.ts` stays out of the barrel, as today.
- **`/home/user/M-arc/src/core/models.ts`** — Extend `RestState` (lines 99-103) with three optional, transient fields. No `version` bump, no entry in core/migrate.ts, no change to store.ts's normalize() — `normalize` spreads `active` through untouched and every new field is optional, so an in-flight rest saved by an older build simply has them undefined and the banner falls back to today's copy.

export interface RestState {
  endsAt: number;
  totalSec: number;
  pausedRemainingSec?: number;
  /** Which logged set started this timer, so a later effort tap can re-grade the timer that set owns and no other. Transient: it dies with the active session. */
  from?: { entry: number; set: number };
  /** Why restFor() graded it away from the person's own default. Undefined on a rest from an older build. */
  reasonKind?: RestReasonKind;
  /** The total restFor() asked for. Equal to totalSec exactly while the clock is still honouring the grade; a manual +/-15 or a late clamp makes them differ, which is what hides the reason line. */
  gradedSec?: number;
}

Add `import type { RestReasonKind } from '@/brain/live';` at the top. This is a TYPE-ONLY import, so it creates no runtime edge from core/ to brain/ (core/ has no runtime brain imports today and must keep none). If that import is judged unacceptable, inline the union instead of importing it — but do not remove the field.
- **`/home/user/M-arc/src/slices/workout/session.ts`** — Five edits. (1) Line 16: delete `export const REST_MIN = 15, REST_MAX = 600, REST_STEP = 15;` and replace with `/** The step the rest banner's +/- buttons move by. A UI step, not a coaching band. */\nexport const REST_STEP = 15;\n/** Never let a running clock drop below this many seconds on a re-time; matches what adjustRest has always floored remaining at. */\nconst MIN_REMAINING_SEC = 5;`. Add imports: `import { REST_CEIL_SEC, REST_FLOOR_SEC } from '@/brain/coach/bands';` and `import { restFor, type RestGrade } from '@/brain/live';` (slices -> brain is the legal direction; findExercise is already imported at line 8, state at line 7).

(2) resumeSession (lines 55-62) — THE PAUSE BUG. It currently rebuilds rest as a fresh object literal `{ endsAt, totalSec }`, which silently drops `from`, `reasonKind` and `gradedSec` on every pause/resume, so the regrade stops working after a pause and only after a pause. Change the one line to spread:
    const rest = a.rest?.pausedRemainingSec != null
      ? { ...a.rest, endsAt: Date.now() + a.rest.pausedRemainingSec * 1000, pausedRemainingSec: undefined }
      : a.rest;

(3) startRest (lines 106-111) gains two optional params, so its existing single call site and any test calling startRest(90) keep compiling:
    export function startRest(sec: number, from?: { entry: number; set: number }, grade?: RestGrade): void {
      const total = Math.max(REST_FLOOR_SEC, Math.min(REST_CEIL_SEC, Math.round(sec)));
      const endsAt = Date.now() + total * 1000;
      patchActive(a => ({ ...a, rest: { endsAt, totalSec: total, from, reasonKind: grade?.reasonKind, gradedSec: grade?.seconds } }));
      void scheduleRestDone(endsAt);
    }

(4) NEW private helpers, placed just above startRest:
    /** Grade the rest for one logged set, starting from the person's own default. */
    function gradeFor(a: ActiveSession, entry: number, index: number): RestGrade {
      const e = a.entries[entry];
      const ex = e ? findExercise(e.exerciseId, state.value.customExercises) : undefined;
      return restFor({
        base: state.value.preferences.restDefaultSec,
        effort: e?.sets[index]?.effort,
        pattern: ex?.pattern ?? '',
        mode: ex?.mode ?? 'weighted',
        goal: state.value.goal,
      });
    }

    /**
     * Re-time the running rest WITHOUT restarting it: keep what has already
     * elapsed, replace only what is left. This is what keeps the countdown and
     * the progress bar monotonic, and it is the single path — there is no
     * "restart if it only just started" branch.
     */
    function retimeRest(totalTargetSec: number, grade?: RestGrade): void {
      const a = active();
      if (!a?.rest) return;
      const paused = a.pausedAt != null && a.rest.pausedRemainingSec != null;
      const rem0 = restRemainingSec(a) ?? 0;
      const elapsed = Math.max(0, a.rest.totalSec - rem0);
      const rem1 = Math.max(MIN_REMAINING_SEC, Math.min(REST_CEIL_SEC, Math.round(totalTargetSec) - elapsed));
      const total = Math.min(REST_CEIL_SEC, Math.round(elapsed + rem1));
      const endsAt = Date.now() + rem1 * 1000;
      patchActive(x => {
        if (!x.rest) return x;
        const rest: RestState = { ...x.rest, endsAt, totalSec: total };
        if (paused) rest.pausedRemainingSec = rem1;
        if (grade) { rest.reasonKind = grade.reasonKind; rest.gradedSec = grade.seconds; }
        return { ...x, rest };
      });
      if (paused) void cancelRestDone(); else void scheduleRestDone(endsAt);
    }
(add `RestState` to the type import on line 5.)

(5) adjustRest (lines 113-120) is REPLACED by a two-liner over retimeRest. Its old body set `totalSec: Math.max(x.rest.totalSec, Math.round(remaining))` — the new REMAINING, not the new TOTAL — so the banner printed a total the clock was not honouring and `pct` snapped backwards (base 90, +15 at 20s elapsed: old code wrote totalSec 90 while running 85 more seconds, pct read 5.6% when 19% had actually elapsed). It also read `endsAt` directly, so adjusting while paused used a stale end time.
    export function adjustRest(deltaSec: number): void {
      const a = active();
      if (!a?.rest) return;
      retimeRest(a.rest.totalSec + deltaSec);
    }

(6) commitSet (lines 71-79) — the only behavioural change is the seconds it passes:
      if (state.value.preferences.autoRest) {
        const g = gradeFor(a, entry, index);
        startRest(g.seconds, { entry, set: index }, g);
      }
  Everything else (the isWorkingSet gate, the boolean return, haptic.light()) is untouched. At reps-blur time `effort` is undefined, restFor returns the clamped base, and the timer is identical to today's.

(7) NEW exported function, placed directly after adjustRest:
    /**
     * The effort rating on the set that started the running timer changed, so
     * re-grade the timer. Never restarts it, never touches logged data, and
     * never touches a timer another set owns. Clearing the rating grades it
     * back down to the person's own default, symmetrically.
     */
    export function regradeRest(entry: number, index: number): void {
      const a = active();
      if (!a?.rest?.from) return;
      if (a.rest.from.entry !== entry || a.rest.from.set !== index) return;
      if (!state.value.preferences.autoRest) return;
      if ((restRemainingSec(a) ?? 0) <= 0) return; // already rung: leave it alone
      retimeRest(gradeFor(a, entry, index).seconds, gradeFor(a, entry, index));
    }
  (compute gradeFor once into a local `g` and pass `g.seconds, g` — do not call it twice; the two-call form above is written out only to show both arguments.)

finishSession needs no edit: it sets `active: null`, so `rest` and its `from` go with it.
- **`/home/user/M-arc/src/app/selectors.ts`** — Add ONE computed at the very end of the file, after `sessionsToday` (line 62), so it is declared after `deload` and `today` which it reads. Add to the existing imports: `applyDeload` alongside `deloadActive` from '@/brain/coach/deload'; `import { suggestNext } from '@/brain/progression';`; `import { nextAfterRest, type RestNext } from '@/brain/live';`.

/**
 * What the running rest timer is counting towards: the next set of the same
 * exercise, or the exercise that follows when the last planned set is done.
 * Null when nothing is resting, or when the timer does not know which set
 * started it (a rest carried over from a build before this existed).
 * Deliberately does NOT read nowMs, so the banner's one-second tick never
 * recomputes suggestNext.
 */
export const restNext = computed<RestNext | null>(() => {
  const s = state.value;
  const a = s.active;
  const from = a?.rest?.from;
  if (!a || !from) return null;
  const entry = a.entries[from.entry];
  if (!entry) return null;
  const suggestion = applyDeload(
    suggestNext(s.sessions, entry.exerciseId, s.goal, today.value, entry.sets.length, s.customExercises),
    deload.value, today.value,
  );
  return nextAfterRest(a.entries, from, suggestion);
});

That suggestNext + applyDeload pair is character-for-character the call EntryCard already makes at Train.tsx:253, which is precisely why the banner can only ever show a number the user is already looking at.
- **`/home/user/M-arc/src/slices/workout/Train.tsx`** — Four edits, no other component touched.

(1) Imports: add `restNext` to the selectors import on line 4; add `regradeRest` and `REST_STEP` to the './session' import on line 19; add `import type { RestNext, RestReasonKind } from '@/brain/live';`. formatClock (line 7), formatLoad (line 8) and unit (line 4) are already imported.

(2) Module-level copy tables, next to the existing EFFORTS const (lines 30-34). This is where the words live — brain/live.ts returns the tag, the screen turns it into English, exactly as the app already does for coach findings:
    /** The clause after the delta on the rest banner. Empty means the graded number equals the person's own default, so say nothing. */
    const REST_REASON: Record<RestReasonKind, string> = {
      ungraded: '', base: '',
      easy: 'easy set', max: 'max effort',
      compound: 'a compound lift',
      easy_compound: 'easy set on a compound',
      max_compound: 'max effort on a compound',
      strength_floor: 'strength goal, compound lift',
    };

    function restNextLine(n: RestNext | null, u: 'kg' | 'lb'): string {
      if (!n) return '';
      if (n.kind === 'next_exercise') return `Last set · next up: ${n.name}`;
      if (n.kind === 'session_end') return 'Last set · last exercise of the session';
      if (n.durationSec != null) return `Set ${n.setNumber} · ${n.durationSec}s`;
      if (n.kg != null) return n.reps != null ? `Set ${n.setNumber} · ${formatLoad(n.kg, u)} × ${n.reps}` : `Set ${n.setNumber} · ${formatLoad(n.kg, u)}`;
      if (n.reps != null) return `Set ${n.setNumber} · ${n.reps} reps`;
      return `Set ${n.setNumber}`;
    }

(3) Line 288, the effort button's onClick — the plumbing repair. One statement added after the existing setSet, nothing else on the line changes:
    onClick={() => { setSet(index, j, { effort: set.effort === ef.v ? undefined : ef.v }); regradeRest(index, j); }}
  setSet goes through update(), which assigns state.value synchronously, so regradeRest reads the effort that was just written. Toggling the same button off sets effort to undefined and regrades back to base — that is the symmetric path, and it needs no extra code.

(4) RestBanner (lines 360-380) is rewritten. The clock becomes a direct flex child; the text column becomes the growing one and now carries the primary line, the detail line and the progress bar:
    export function RestBanner() {
      const a = state.value.active;
      useEffect(() => { if (a?.rest) setTicking(true); }, [a?.rest?.endsAt]);
      if (!a?.rest) return null;
      const now = nowMs.value;
      const remaining = a.pausedAt && a.rest.pausedRemainingSec != null ? a.rest.pausedRemainingSec : Math.max(0, Math.round((a.rest.endsAt - now) / 1000));
      const done = remaining <= 0;
      const pct = a.rest.totalSec ? Math.max(0, Math.min(100, 100 - (remaining / a.rest.totalSec) * 100)) : 100;
      const primary = restNextLine(restNext.value, unit.value);
      const base = state.value.preferences.restDefaultSec;
      const honouring = a.rest.gradedSec != null && a.rest.gradedSec === a.rest.totalSec && a.rest.totalSec !== base;
      const reason = honouring && a.rest.reasonKind ? REST_REASON[a.rest.reasonKind] : '';
      const delta = a.rest.totalSec - base;
      const detail = done
        ? (primary ? 'Rest done.' : 'Rest done. Next set.')
        : `Rest · ${formatClock(a.rest.totalSec)}${reason ? ` · ${delta > 0 ? '+' : '−'}${Math.abs(delta)}s, ${reason}` : ''}`;
      return (
        <div class={`rest ${done ? 'done' : ''}`} role="status">
          <div class="clock">{done ? 'Go' : formatClock(remaining)}</div>
          <div class="grow">
            {primary && <div class="rest-next ellipsis">{primary}</div>}
            <div class="hint ellipsis">{detail}</div>
            <div class="bar" style={{ marginTop: 6 }}><i style={{ width: `${pct}%`, background: done ? 'var(--positive)' : undefined }} /></div>
          </div>
          {!done && <Button variant="quiet" size="sm" aria-label="Less rest" onClick={() => adjustRest(-REST_STEP)}>{`−${REST_STEP}`}</Button>}
          {!done && <Button variant="quiet" size="sm" aria-label="More rest" onClick={() => adjustRest(REST_STEP)}>{`+${REST_STEP}`}</Button>}
          <Button size="sm" onClick={() => stopRest()}>{done ? 'OK' : 'Skip'}</Button>
        </div>
      );
    }
  Note the added Math.max(0, ...) on pct: with the old adjustRest, remaining could exceed totalSec and produce a negative CSS width, which browsers discard. The aria-labels 'Less rest'/'More rest' are unchanged, so nothing that queries by accessible name breaks.
- **`/home/user/M-arc/src/ui/styles.css`** — Two edits inside the existing `/* Rest banner */` block (lines 143-145), nothing else in the file. Add `flex: none;` to the `.rest .clock` rule so the clock keeps its 72px now that it is a direct flex child, and add one new rule scoped under `.rest` so it can affect no other screen and no other theme token:
    .rest .rest-next { font-size: 14px; font-weight: 600; line-height: 1.3; }
Colours come only from the inherited text token — do not introduce a colour here. The growing column already gets `min-width: 0` from `.grow`, which is what makes `.ellipsis` work on a 360px-wide phone.
- **`/home/user/M-arc/src/data/principles.json`** — On the `rest_intervals` card (line ~169), replace the `appUse` sentence "The app does not log per-set rest, so this is advice about the default." with "The live rest timer also grades the person's own default up for a max-effort or compound set and down for an easy one; it still does not log the rest actually taken." Touch nothing else on the card — its findingKinds stays [] and its proposalKinds stays ["rest_default"].
- **`/home/user/M-arc/docs/COACH_BRAIN.md`** — Append one dated row to the Decisions log table (starts line 430, `| Date | Decision |`), ending in the deploy consequence, matching the voice of the surrounding rows. Suggested text:
| 2026-09-20 | Live rest timer is graded, not fixed. `restFor()` (`src/brain/live.ts`) bends the person's own `restDefaultSec` by effort (0.8 / 1 / 1.25) and by 1.2x on a compound, with a 150s floor for compound loaded work on a strength goal; it returns the base untouched until the set is actually rated, so anyone who never taps E/I/M sees the identical timer. Repaired the plumbing defect this exposed: the effort buttons never committed anything, so the coach could not see the rating at the moment it acted — the buttons now call `regradeRest()`. Re-timing is one path only (keep what has elapsed, replace what is left), which forced a fix to `adjustRest`, whose `totalSec` was set to the new REMAINING rather than the new TOTAL and so printed a length the clock was not honouring and snapped the progress bar backwards; and to `resumeSession`, which rebuilt the rest object as a fresh literal and dropped the new fields on every pause. No model call, no payload field, nothing leaves the device. Deploy consequence: after this ships the +/-15 buttons report a longer total than before (correctly), and an in-flight rest saved by the previous build has no `from`, so its banner falls back to the old copy until the next set is logged. |

No new row in the detector table — there is no new detector.
- **`/home/user/M-arc/docs/ARCHITECTURE.md`** — In the `src/` tree at line 9-12, add `live` to the brain/ line so the file is discoverable: `brain/     pure functions: exposure, recovery, history, prs, trend, progression, balance, effort, weekly, bodyfat, live (rest grading + next-set for the live session), coach/cues, ...`. No other edit.

## UI spec

SURFACE: exactly one component, `RestBanner` in /home/user/M-arc/src/slices/workout/Train.tsx (currently lines 360-380), rendered globally by App.tsx:27 whenever `state.active.rest` exists. No new screen, no new sheet, no new route, no Settings change.

LAYOUT (existing primitives and classes only, plus one scoped CSS rule):
  [ .clock 26px ] [ .grow column: .rest-next / .hint / .bar ] [ −15 ] [ +15 ] [ Skip|OK ]
The clock and the buttons are exactly as today. The change is that the bar moves from its own flex column into the text column, so the text column is the one that grows and the primary line has somewhere to live. Both text lines carry `.ellipsis`; `.grow` supplies `min-width: 0`, which is what makes truncation work at 360px rather than squeezing the buttons.

PRIMARY LINE (`.rest-next`, 14px/600, shown in BOTH the counting and the done state, hidden entirely when `rest.from` is absent):
  "Set {setNumber} · {kg} {unit} × {reps}"        e.g.  Set 3 · 62.5 kg × 8
  "Set {setNumber} · {kg} {unit}"                 (suggestion has a load but no rep target)
  "Set {setNumber} · {reps} reps"                 (bodyweight / assisted / conditioning — kg is null)
  "Set {setNumber} · {durationSec}s"              e.g.  Set 2 · 45s   (duration mode)
  "Set {setNumber}"                               (suggestion has no numbers at all)
  "Last set · next up: {name}"                    e.g.  Last set · next up: Romanian Deadlift
  "Last set · last exercise of the session"
Placeholder sources, every one of them:
  setNumber   = nextAfterRest().setNumber = rest.from.set + 2 (1-based display index of the next set in the same entry)
  kg          = applyDeload(suggestNext(sessions, entry.exerciseId, goal, today, entry.sets.length, custom), deload, today).sets[min(nextIndex, len-1)].kg — the identical call and identical index EntryCard uses at Train.tsx:253 and 274 to produce the kg placeholder the person is looking at. Rendered through formatLoad(kg, unit.value), so it follows the lb setting like every other load in the app.
  reps        = the same target object's .reps (the source of the reps placeholder at Train.tsx:285)
  durationSec = the same target object's .durationSec (the source of the seconds placeholder at Train.tsx:281)
  name        = entries[j].name, the live session's own working copy of the exercise name, for the first entry after rest.from.entry with done === false && skipped === false
  unit        = state.preferences.weightUnit via the existing `unit` selector

DETAIL LINE (`.hint`), while counting:
  no reason:   "Rest · {formatClock(rest.totalSec)}"                       (identical to today's copy)
  with reason: "Rest · {formatClock(rest.totalSec)} · +{n}s, {clause}"     e.g.  Rest · 2:15 · +45s, max effort on a compound
               "Rest · {formatClock(rest.totalSec)} · −{n}s, {clause}"     e.g.  Rest · 1:10 · −20s, easy set
  n      = Math.abs(rest.totalSec − preferences.restDefaultSec) — the delta against the number the person themselves set with the ±15 rows in Settings.tsx:71. Rendering the delta rather than only the absolute is the whole point: it reads as their 90 seconds being adjusted, not replaced.
  sign   = '+' (U+002B) / '−' (U+2212, the same glyph Settings already uses)
  clause = REST_REASON[rest.reasonKind] — one of: 'easy set', 'max effort', 'a compound lift', 'easy set on a compound', 'max effort on a compound', 'strength goal, compound lift'
  THE GATE: the reason clause renders only when `rest.gradedSec != null && rest.gradedSec === rest.totalSec && rest.totalSec !== preferences.restDefaultSec`. That means it is silent on every set where the grading did not move the number (ideal effort on an isolation, a clamp at 15s or 600s, and every set where no effort was tapped), and it disappears the moment the person overrides with ±15 or a late clamp bends the target — so the app can never print a duration the clock is not actually honouring.

DETAIL LINE, done state:
  "Rest done."              when a primary line is present (the primary already says what is next; the old copy would repeat it)
  "Rest done. Next set."    when there is no primary line (unchanged fallback for a rest with no `from`)
Clock text ("Go" / formatClock(remaining)) and the `.rest.done` border are unchanged.

LOADING / EMPTY / DEGRADED STATES:
  - No active session or no rest: the banner returns null, as today.
  - `rest.from` undefined (a rest started by the previous build and still running after an update, or a rest whose owning entry was removed with removeEntry): no primary line, detail line is exactly today's "Rest · 1:30" / "Rest done. Next set.". Nothing throws.
  - Paused: `remaining` comes from pausedRemainingSec as today; the primary and detail lines still render; ±15 now correctly adjusts the paused remainder instead of a stale endsAt.
  - There is no spinner and no async anywhere in this feature.

INTERACTION AND CONSENT — nothing here changes the person's logged data:
  - The only tap that writes to `LoggedSet` is the effort button, which already wrote `effort` before this change; regradeRest is called after it and writes only `state.active.rest` (endsAt / totalSec / reasonKind / gradedSec), which is a timer, not training data.
  - The grading only ever runs inside the existing `preferences.autoRest` opt-in: `startRest` is reached only from `commitSet` under `autoRest`, and `regradeRest` returns early when `autoRest` is off.
  - The ±15 buttons and Skip are untouched escape hatches: ±15 overrides any graded number (and silences the reason line), Skip kills the timer.
  - There is no accept/dismiss/snooze surface because this emits no Proposal. Do not add one, do not route it through src/slices/coach/apply.ts, do not write a dismissKey.
  - Nothing writes to preferences.restDefaultSec. The person's own number is the base and stays the base.

VISIBLE CHANGE IN THE EXISTING VISUAL GATE: scripts/screenshot-gate.mjs (silent-black only) fills 72.5 / 8, blurs the reps input, then clicks `.effort button.ideal` on the first Push exercise, which migrates to Machine Chest Press (pattern horizontal_push = compound, mode weighted, goal lean, default 90s). Expect screenshots/silent-black-live.png to show "Rest · 1:50 · +20s, a compound lift" with "Set 2 · 72.5 kg × 8" above it. That is correct output, not a regression — do not "fix" it.

## Data flow

Hop by hop, both directions, all on device.

STARTING THE TIMER
1. The person types reps into the input at Train.tsx:285 and blurs it (tapping the effort button blurs it too — mousedown fires blur before click, which is why the ordering below works).
2. onBlur -> commitSet(index, j) (session.ts:72). Reads active(), the set, `isWorkingSet(set)` (brain/exposure.ts). Returns false and does nothing if the set is empty — unchanged.
3. commitSet reads `state.value.preferences.autoRest`. If on, it calls gradeFor(a, entry, index), which reads `state.value.preferences.restDefaultSec` (the number set by the ±15 rows in Settings.tsx:71), `entries[entry].sets[index].effort` (undefined at this moment), and `findExercise(entry.exerciseId, state.value.customExercises)` (core/exercises.ts:75) for `.pattern` and `.mode`, plus `state.value.goal`.
4. gradeFor -> restFor(...) in brain/live.ts. Effort is undefined, so it returns { seconds: clamp(base), reasonKind: 'ungraded' } — the same number today's code passes. No brain state, no I/O.
5. commitSet -> startRest(g.seconds, { entry, set: index }, g) -> patchActive -> update() (core/store.ts:93) -> state.value reassigned + persistSoon(250ms) -> localStorage 'marc.state.v1'. startRest also calls scheduleRestDone(endsAt) (native/notifications.ts:37, notification id 880001), which no-ops off-device.

RE-GRADING
6. The person taps E / I / M at Train.tsx:288. onClick calls setSet(index, j, { effort }) FIRST — that is the existing, explicit, user-initiated write to LoggedSet.effort — then regradeRest(index, j). update() is synchronous, so step 7 already sees the new effort.
7. regradeRest (session.ts) reads active(); bails unless `rest.from` exists AND matches (entry, index) AND autoRest is on AND restRemainingSec(a) > 0. Calls gradeFor again — now with the tapped effort — and hands the result to retimeRest.
8. retimeRest reads rest.totalSec and restRemainingSec(a) (which itself honours pausedAt/pausedRemainingSec), derives elapsed = totalSec − remaining, sets rem1 = clamp(target − elapsed, 5, 600) and total = elapsed + rem1, then patchActive spreads `...x.rest` and writes endsAt, totalSec, reasonKind, gradedSec (and pausedRemainingSec when paused). scheduleRestDone(endsAt) reschedules the Android notification for free; cancelRestDone() when paused.
   Because elapsed is preserved by construction, `remaining <= totalSec` always holds and the progress bar only ever moves forward.

RENDERING
9. app/selectors.ts `restNext` (a computed) re-evaluates whenever state.value or today changes — and NOT on the nowMs tick, because it never reads nowMs. It reads state.active.rest.from and the entry, calls suggestNext(sessions, exerciseId, goal, today, entry.sets.length, customExercises) (brain/progression.ts:59) and applyDeload(..., deload.value, today.value) (brain/coach/deload.ts:13), then nextAfterRest(entries, from, suggestion) (brain/live.ts) -> a plain RestNext.
10. RestBanner reads state.value.active (for rest.endsAt/totalSec/reasonKind/gradedSec), nowMs.value (the 1s tick installed by setTicking), restNext.value, unit.value and state.value.preferences.restDefaultSec. restNextLine() and REST_REASON turn the plain data into the two strings. formatLoad() (core/units.ts:13) is the only place kg becomes lb.
11. Tapping ±15 -> adjustRest(±REST_STEP) -> retimeRest(totalSec ± 15) with no grade argument, so reasonKind/gradedSec are left as they were; gradedSec !== totalSec from that moment on, which is exactly what makes the reason clause disappear. Tapping Skip -> stopRest() -> rest: undefined -> banner unmounts. finishSession() -> active: null -> everything transient dies with it; no migration, no cleanup code.

NETWORK: none. No hop above touches src/ai/**, proxy/**, GroundingPayload, explanationKey, or any signal read by them. brain/coach/context.ts's contextFromState never reads state.active, and buildAskStats never sees it, so the new RestState fields cannot reach a payload even accidentally.

## Network / offline

none - fully on-device. No route is added or called; no payload field is added, so there is no edit to `onlyKeys` in proxy/src/handler.ts, none to proxy/src/types.ts, and none to validateGrounding()'s blocklist. Nothing in this feature produces text that is ever sent to a model, so allowedNumbers()/validateText() in src/brain/coach/explainer.ts and askAllowedNumbers()/sanitizePersonalAnswer() are not in this path at all. `emptyCoach().remoteExplainer === false` changes nothing about the behaviour — the feature is identical with the online coach on or off, and identical in aeroplane mode. Do not run `npm --prefix proxy run check` expecting changes; there are none. The feature also degrades along its own axis without a network: with no effort tapped, restFor returns the person's own default and the timer is byte-identical to the current build.

## Tests to write

- tests/live-rest.test.ts :: 'an unrated set rests for exactly the length the person chose' — restFor({ base: 90, pattern: 'squat', mode: 'weighted', goal: 'strength' }) with no effort returns { seconds: 90, reasonKind: 'ungraded' }; assert the compound multiplier and the strength floor are BOTH inert without a rating, because that is the whole backward-compatibility guarantee.
- tests/live-rest.test.ts :: 'effort bends the person's own number' — with base 90 and pattern 'elbow_extension' (Triceps Pushdown), effort 'ideal' -> { seconds: 90, reasonKind: 'base' }, 'easy' -> { seconds: 70, reasonKind: 'easy' }, 'max' -> { seconds: 115, reasonKind: 'max' }. Pins both the multipliers and the round-to-5.
- tests/live-rest.test.ts :: 'a compound earns longer than an isolation at the same effort' — pattern 'squat' with base 90: 'ideal' -> 110/'compound', 'easy' -> 85/'easy_compound', 'max' -> 135/'max_compound'; and expect(restFor({...pattern:'squat',effort:'max'}).seconds).toBeGreaterThan(restFor({...pattern:'elbow_extension',effort:'max'}).seconds).
- tests/live-rest.test.ts :: 'the strength floor applies to loaded compounds only' — goal 'strength', pattern 'squat', mode 'weighted', effort 'easy' -> { seconds: 150, reasonKind: 'strength_floor' }; the same input with mode 'bodyweight' (a Pull-Up, pattern 'vertical_pull') -> 85/'easy_compound'; the same input with pattern 'elbow_flexion' -> 70/'easy'; goal 'lean' with pattern 'squat' -> 85/'easy_compound'. Also assert goal 'strength_muscle' floors identically to 'strength', matching planners/rest.ts's predicate.
- tests/live-rest.test.ts :: 'a graded rest is never outside the clamps and never lies about landing on the base' — loop every Effort x ['squat','elbow_extension',''] x every GoalId x base in [15, 90, 150, 600, 5, 900] and assert Number.isInteger(seconds), seconds >= REST_FLOOR_SEC, seconds <= REST_CEIL_SEC, and (reasonKind === 'base' || reasonKind === 'ungraded') === (seconds === clamp(base)). Explicitly assert restFor({ base: 600, effort: 'max', pattern: 'squat', mode: 'weighted', goal: 'lean' }) is { seconds: 600, reasonKind: 'base' } — clamped, and therefore silent.
- tests/live-rest.test.ts :: 'nextAfterRest names the next set, then the next exercise, then the end' — build a plain entries array [{ exerciseId: 'a', name: 'Leg Press', sets: [{},{},{}], done: false, skipped: false }, { exerciseId: 'b', name: 'Romanian Deadlift', sets: [{}], done: false, skipped: false }] and a stub Suggestion whose sets are [{kg:60,reps:8,durationSec:null,note:''}, {kg:62.5,reps:8,...}, {kg:62.5,reps:6,...}]. from {entry:0,set:0} -> { kind:'set', setNumber:2, kg:62.5, reps:8 }; from {entry:0,set:2} -> { kind:'next_exercise', name:'Romanian Deadlift' }; with entry 1 marked skipped -> { kind:'session_end' }; from {entry:9,set:0} -> null; suggestion null -> { kind:'set', setNumber:2, kg:null, reps:null, durationSec:null }; an entry extended to 5 sets against a 3-set suggestion -> from {entry:0,set:3} reuses the LAST target (kg 62.5, reps 6), mirroring Train.tsx:274.
- tests/live-rest.test.ts :: 'committing a set starts the person's own rest and records which set owns it' — startSession(pplSplits()[0]) (Push, first exercise lib_barbell_bench_press), setSet(0,0,{kg:60,reps:8}), commitSet(0,0) returns true; expect(active()!.rest).toMatchObject({ totalSec: 90, gradedSec: 90, reasonKind: 'ungraded' }); expect(active()!.rest!.from).toEqual({ entry: 0, set: 0 }). Then a second case with preferences.autoRest false: commitSet still returns true and active()!.rest is undefined. Then a third: commitSet(0,1) on an empty set returns false and leaves the rest object untouched.
- tests/live-rest.test.ts :: 'tapping an effort re-grades the running timer without restarting it' — startSession(legs split), setSet(0,0,{kg:100,reps:8}) (lib_leg_press, pattern 'squat', mode weighted, goal 'lean'), commitSet(0,0); vi.advanceTimersByTime(20_000); setSet(0,0,{effort:'max'}); regradeRest(0,0); expect(active()!.rest!.totalSec).toBe(135); expect(restRemainingSec(active()!)).toBe(115); expect(active()!.rest!.totalSec - restRemainingSec(active()!)!).toBe(20) — elapsed is preserved, which is the monotonic-bar guarantee; expect(active()!.rest!.gradedSec).toBe(135); expect(active()!.rest!.reasonKind).toBe('max_compound').
- tests/live-rest.test.ts :: 'clearing the effort grades back down to the person's default, symmetrically' — continuing from the previous state, setSet(0,0,{effort:undefined}); regradeRest(0,0); expect totalSec 90, remaining 70, elapsed still 20, reasonKind 'ungraded', gradedSec 90. Then tap 'easy' -> totalSec 85 (90*0.8*1.2 = 86.4 -> 85), remaining 65.
- tests/live-rest.test.ts :: 'a late downgrade never drags the progress bar backwards' — commitSet with base 90 on lib_triceps_pushdown, advance 80_000, setSet effort 'easy', regradeRest: the raw target (70) is already behind, so expect totalSec 85, restRemainingSec 5, and totalSec - remaining === 80. Assert 100 - (remaining/totalSec)*100 is strictly greater than the pct measured just before the tap.
- tests/live-rest.test.ts :: 'a regrade only ever touches the timer its own set started' — commitSet(0,0) starts the timer; setSet(0,1,{effort:'max'}); regradeRest(0,1) leaves rest.totalSec, rest.endsAt and rest.reasonKind byte-identical. Also: regradeRest(1,0) after a timer started by entry 0 is a no-op; regradeRest(0,0) after stopRest() is a no-op and does NOT create a rest object; regradeRest(0,0) with autoRest false is a no-op.
- tests/live-rest.test.ts :: 'a paused and resumed rest still knows which set owns it' — the pause trap. commitSet(0,0); advance 10_000; pauseSession(); advance 5_000; resumeSession(); expect(active()!.rest!.from).toEqual({ entry: 0, set: 0 }) — this fails against the current resumeSession, which rebuilds the rest object as a fresh literal. Then setSet(0,0,{effort:'max'}); regradeRest(0,0); expect totalSec to be the graded target and elapsed to still be 10.
- tests/live-rest.test.ts :: 'the +/-15 buttons report the length the clock is actually honouring' — pins the adjustRest fix. commitSet(0,0) with base 90; advance 20_000; adjustRest(15); expect(active()!.rest!.totalSec).toBe(105) and restRemainingSec === 85 (the old code wrote 90 while running 85 more seconds). Then adjustRest(-15) -> totalSec 90, remaining 70. Then with 3 seconds left, adjustRest(-15) floors remaining at 5 rather than ringing instantly. Also assert an adjust does NOT clear gradedSec/reasonKind but DOES make gradedSec !== totalSec, which is the flag the banner uses to stop printing the reason.
- tests/live-rest.test.ts :: 'the clamps come from bands.ts and hold on every path' — startRest(5) -> totalSec REST_FLOOR_SEC (15); startRest(9_999) -> totalSec REST_CEIL_SEC (600); retime via adjustRest(10_000) never exceeds REST_CEIL_SEC. Import REST_FLOOR_SEC/REST_CEIL_SEC from '@/brain/coach/bands' in the test so a future edit to the bands moves the test with it.
- tests/live-rest.test.ts :: 'finishing the session takes the timer with it' — commitSet(0,0); finishSession(false); expect(state.value.active).toBeNull(). No assertion on notifications (they no-op under node).

## Acceptance criteria

- [ ] With no effort rating ever tapped, the rest timer's length, start time and banner copy are byte-identical to the current build: commitSet passes exactly clamp(preferences.restDefaultSec) and the detail line reads 'Rest · 1:30' for a 90s default.
- [ ] Tapping E, I or M on the set that started the running timer re-times it in place: the countdown never resets to a full new total, the elapsed portion is preserved exactly (totalSec − remaining is unchanged by the tap), and the progress bar's pct never decreases across a regrade.
- [ ] Tapping the same effort button again clears the rating and grades the timer back down to the person's own restDefaultSec, by the same single path — the timer can go down as well as up.
- [ ] The number printed on the detail line is always the number the clock is honouring: rest.totalSec is rendered directly, and the '+30s, max effort on a compound' clause appears only when gradedSec === totalSec && totalSec !== restDefaultSec.
- [ ] The reason clause is silent on every set where the grading did not move the number — ideal effort on an isolation, any set with no rating, a base clamped at 15s or 600s, and any rest the person has overridden with ±15.
- [ ] The banner's largest non-clock text is what comes next: 'Set 3 · 62.5 kg × 8' mid-exercise, 'Last set · next up: {name}' after the last planned set, 'Last set · last exercise of the session' when nothing is left. It renders in both the counting and the done state.
- [ ] Every kg shown in the banner is the same number the corresponding set row already shows as its placeholder — same suggestNext call, same applyDeload, same set index (Math.min(j, sets.length − 1)) — and follows the lb setting through formatLoad.
- [ ] restFor() always returns an integer inside [REST_FLOOR_SEC, REST_CEIL_SEC] for every combination of effort, pattern, mode, goal and base, including bases outside the clamps.
- [ ] A rest already running when the app is updated (no `from` field) renders the old copy and throws nothing; a pause and resume keeps `from` so a later effort tap still re-grades.
- [ ] Nothing the feature does writes to state.sessions, state.preferences or state.coach. The only writes are state.active.rest (a timer) and the pre-existing, explicitly tapped LoggedSet.effort.
- [ ] adjustRest(±15) now reports the true total: base 90 with 20s elapsed and +15 gives totalSec 105 with 85 remaining, and pct reads ~19%, not ~6%.
- [ ] `npm run check` passes (tsc --noEmit with strict + noUncheckedIndexedAccess, all vitest files, build).
- [ ] `npm run gate` passes with no console errors in all five themes, and screenshots/silent-black-live.png shows the graded banner ('Rest · 1:50 · +20s, a compound lift' over 'Set 2 · 72.5 kg × 8') with no horizontal overflow at 390px.
- [ ] `npm --prefix proxy run check` is unchanged and unaffected — no proxy file is touched.
- [ ] grep confirms REST_MIN and REST_MAX no longer exist anywhere in src/, and no file under src/brain/ imports from src/slices/.

## Do NOT

- Do NOT add onBlur={() => commitSet(index, j)} to the kg input (Train.tsx:284). It looks like the obvious fix for the 'the kg input never commits' complaint in the problem statement, but it would restart the rest timer every time someone corrects a weight after logging the set. The kg input stays commit-free.
- Do NOT make the effort button start a rest timer when none is running. regradeRest re-times an existing timer owned by that exact set and does nothing otherwise — it never calls startRest.
- Do NOT implement the two-path regrade from the original feature note (`elapsed <= REST_REGRADE_WINDOW_SEC ? startRest(target) : adjustRest(target - totalSec)`). There is no REST_REGRADE_WINDOW_SEC constant in this spec. One path, always: keep the elapsed portion, replace the remainder.
- Do NOT leave adjustRest's `totalSec: Math.max(x.rest.totalSec, Math.round(remaining))` in place and do NOT claim adjustRest is 'reused unchanged'. `remaining` there is the new REMAINING time, not the new TOTAL; leaving it ships a banner that prints a length the clock is not honouring and a progress bar that snaps backwards.
- Do NOT call startRest from regradeRest or from retimeRest. startRest resets endsAt to a full fresh total and throws the elapsed time away — that is precisely the 'yanked backwards' behaviour this feature exists to avoid.
- Do NOT rebuild the rest object as a fresh literal anywhere. resumeSession currently does exactly that (`{ endsAt, totalSec }`), which silently drops `from` on every pause/resume; every write to rest must spread `...a.rest` / `...x.rest` first.
- Do NOT import anything from src/slices/**, src/ui/**, src/native/** or src/core/store into src/brain/live.ts, and do NOT leave REST_MIN/REST_MAX in session.ts for brain/ to import. slices -> brain is the only legal direction; that is why the bounds move to bands.ts.
- Do NOT put copy strings, sentence fragments, units or formatting inside src/brain/live.ts. It returns a reasonKind tag and integers; REST_REASON and restNextLine in Train.tsx turn those into English. 'The brain decides, the words explain' is the governing rule of this codebase.
- Do NOT derive the strength floor from GOAL_BY_ID[goal].rir. Growth's rir is [0,2] and strength's is [1,3], so an rir-derived rule hands the LONGEST rests to the growth goal — exactly backwards. Use the goal id predicate (`goal === 'strength' || goal === 'strength_muscle'`), the same one planners/rest.ts:8 already uses.
- Do NOT snap the graded seconds to REST_STEP (15). Rounding a 1.25x multiplier to 15s turns it into 1.17x or 1.33x. Round to REST_ROUND_SEC (5). REST_STEP is only the ± button step.
- Do NOT write to preferences.restDefaultSec, do NOT add a Settings toggle for grading, and do NOT add a new preference field. The person's own number is the base; autoRest is already the opt-in; the ±15 buttons are already the override.
- Do NOT apply the compound multiplier, the strength floor or the rounding when `effort` is undefined. restFor must return the clamped base with reasonKind 'ungraded' so commit-time behaviour is unchanged for anyone who never rates a set.
- Do NOT print a reason clause without the gate (`gradedSec === totalSec && totalSec !== base`). A hint that says '+45s, max effort on a compound' must be a delta the clock is genuinely honouring.
- Do NOT call suggestNext (or exerciseHistory, allRecords, recordsInWeek or weekSummary) inside RestBanner's render body. The banner re-renders every second on the nowMs tick; the next-set line comes from the `restNext` computed in src/app/selectors.ts, which is where all shared derived state lives.
- Do NOT read nowMs (or nowMinute) inside the `restNext` computed. Reading it would make the computed recompute once a second and drag suggestNext with it.
- Do NOT add a FindingKind or ProposalKind. Do not touch contract.ts, FINDING_KINDS, PROPOSAL_KINDS, PRINCIPLES_BY_FINDING, PRINCIPLES_BY_PROPOSAL, ACCEPT_COOLDOWN_DAYS, PROPOSAL_ORDER, report.ts, words.ts, detectors/, planners/, src/slices/coach/apply.ts, coach/preferences.ts or KIND_LABEL in Coach.tsx. The existing rest_default proposal stays exactly as it is.
- Do NOT touch proxy/ at all — no route, no onlyKeys entry, no proxy/src/types.ts change, no validateGrounding edit. Nothing leaves the device.
- Do NOT bump AppState.version (it is the literal type 1) and do NOT add anything to src/core/migrate.ts or store.ts's normalize(). from / reasonKind / gradedSec are optional and transient by design.
- Do NOT persist the rendered sentence. RestState stores a tag and two integers; the words are recomputed at render.
- Do NOT call regradeRest from inside setSet. setSet is also how kg, reps and durationSec are written, and editing a rep count must not re-time the clock. regradeRest is called from exactly one place: the effort button's onClick in Train.tsx:288.
- Do NOT change commitSet's signature, its boolean return, its isWorkingSet gate, or its haptic.light() call. The only change inside it is which number it hands to startRest.
- Do NOT add per-set timestamps (LoggedSet.at), a rest-actually-taken field, or a medianRestSec() learner. That is a persisted schema change on a type that is written into every historical session; it ships separately.
- Do NOT write a component test or add jsdom. vitest here is node-environment and only picks up tests/**/*.test.ts; there are no component tests in this repo and this feature does not introduce the first one. The banner's rendering is covered by npm run gate.
- Do NOT inline 15, 600 or 5 anywhere in session.ts, Train.tsx or live.ts. Import REST_FLOOR_SEC / REST_CEIL_SEC / REST_ROUND_SEC from bands.ts and use REST_STEP for the ± buttons.
- Do NOT add a second notification id or change 880001. startRest and retimeRest both call scheduleRestDone, which cancels and reschedules that one id; the Android alert follows the new end time for free.
- Do NOT regrade a timer that has already rung (restRemainingSec <= 0) — leave it showing 'Go'.
- Do NOT use the Suggestion's top-level .kg / .reps for the banner's per-set line. Use .sets[Math.min(nextIndex, sets.length - 1)], the same object EntryCard renders as the placeholder, or the banner will disagree with the row behind it.
- Do NOT print a raw kg number. Every load in the banner goes through formatLoad(kg, unit.value) so the lb setting is honoured, per the 'conversion only at the render edge' rule.
- Do NOT let either new text line wrap or push the buttons off screen. Both carry .ellipsis inside the .grow column (which supplies min-width: 0); the only new CSS is one rule scoped under .rest plus flex: none on .rest .clock.
- Do NOT 'fix' the changed gate screenshot. scripts/screenshot-gate.mjs clicks an effort button on a compound lift, so a graded banner in screenshots/silent-black-live.png is the expected new output.

## Open questions for the owner

- Should REST_COMPOUND_MULT (1.2) apply at 'ideal' effort, or only at 'max'? As specified it applies at every rated effort, which means most compound sets get +20% and therefore show a reason line — the grading is not 'silent on about half of sets' as the value judge hoped, it is silent mainly on isolation work. Defensible (the rest_intervals card recommends 2-3 minutes on compounds generally), but it makes the feature louder than the note assumed. Owner call: keep as specified, or gate the compound multiplier behind effort !== 'easy', or behind effort === 'max' only.
- The final-set cap from the merge note is deliberately NOT implemented. Capping the rest after an exercise's last planned set at the base is arguable (the next set is a different movement, so the extension earned by the muscle you just worked does not transfer) but it is also often wrong (bench -> incline press is the same muscle), it is hard to state in one line of copy, and it makes restFor depend on set position. Owner call: leave it out, or add `lastSet: boolean` to RestInput with `if (lastSet) seconds = Math.min(seconds, base)` and a 'changing exercise' reason clause.
- Should goal 'strength_muscle' get the 150s REST_STRENGTH_SEC floor, or only 'strength'? The spec gives both the floor, matching planners/rest.ts:8, which already proposes 150s as the DEFAULT for both. The original feature note said `goal === 'strength'` only. Consistency with the existing proposal is the stronger argument but it is the owner's band to set.
- Are 0.8 / 1 / 1.25 the right effort multipliers? They are a coaching judgement, not a number from a study, and they are the thing most likely to feel wrong to someone who chose 90s deliberately because they superset. They are one edit in bands.ts with one test to update.
- Should a manual ±15 explicitly clear reasonKind/gradedSec rather than relying on the `gradedSec === totalSec` equality gate to hide the reason line? The gate is fewer moving parts and self-healing, but it is implicit; clearing them is louder in the code and easier for a future reader to follow. Behaviour is identical either way.
