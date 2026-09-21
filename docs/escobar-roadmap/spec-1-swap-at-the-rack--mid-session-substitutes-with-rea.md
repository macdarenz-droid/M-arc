# Swap at the rack: mid-session substitutes with real targets

> The per-exercise menu in a live session gains up to three substitute exercises that share the muscle, each arriving with its own deload-adjusted target from that exercise's own logged history, and a swap that patches the card in place instead of dumping a blank exercise at the bottom of the list.

**Tier:** core · **Effort:** Medium — roughly 4 to 6 focused hours. About 70 lines of new brain code in `src/brain/live.ts` (a composition over five already-exported helpers, prototyped and verified working against the real library), 14 lines in `session.ts`, 2 constants in `bands.ts`, roughly 90 lines of changed/added JSX and handlers in `Train.tsx` (the sheet's three states plus lifting `picking` to a tagged union and threading `onBrowse`), around 200 lines of tests, and two doc edits. The ranking itself is the cheap part. The real cost sits in three places: keeping `substitutes()` pure by injecting readiness and the pain set rather than reaching for selectors; the `picking` lift plus `onBrowse` threading, which is the only genuinely new state plumbing; and cost discipline in `EntryCard`, where the surrounding code models exactly the habit that must not be copied.
**Judged:** value 7/10 · effort 4/10 · fit 8/10 · fires monthly · composite 24.8
**Adversarially verified:** yes, clean

## User story

You are three exercises into Push. The bench is occupied and you are not waiting ten minutes for it. You tap the "..." on the Barbell Bench Press card. The sheet that opens today offers "Skip today" and "Remove from this session" — both of which throw the plan away. With this change the sheet opens with two new rows first: "Equipment is taken — same muscles, different kit" and "Not doing this one today — same muscles, best match from your history". You tap the first. The sheet becomes a short list: "Machine Chest Press · 60 kg · 6–12 reps · Same movement, Chest · Machine" with a small "8 sessions" chip; "Cable Chest Press · Start light · 6–12 reps · Same movement, Chest · Cable" with a "New to you" chip; "Dumbbell Bench Press · 22.5 kg · 6–12 reps · Same movement, Chest · Dumbbells" with a "6 sessions" chip. Nothing has changed yet. You tap the machine press. The sheet closes, the card you were already looking at — still third in the list, still open — now says Machine Chest Press with three empty set rows and the same 60 kg × 6–12 target it just showed you, and a toast offers "Undo". You log your first set thirty seconds after deciding, instead of searching a picker for a name you half-remember and landing on a card with no numbers on it at all.

## Brain work

NEW FILE `/home/user/M-arc/src/brain/live.ts`. This file does not exist today (verified: `ls src/brain/live.ts` → not found). If another feature in this roadmap has already created it, APPEND to it rather than overwriting.

It is pure, synchronous, dependency-free Layer-1 code like the rest of `src/brain/`. It takes a `BrainContext` plus plain injected inputs and returns plain data. Adjusted recovery and the pain-flag muscle set live in the app layer (`src/app/selectors.ts`); they are INJECTED AS PARAMETERS, never imported.

File header comment (write it, it is load-bearing for the next reader):
```
/**
 * Brain work for the live session: questions the person asks mid-workout,
 * about the workout they are in. Pure and synchronous like the rest of
 * src/brain/ — plain data in, plain data out. It must never import from
 * @/app, @/slices, @/ui, @/native or @/core/store. Adjusted recovery and
 * the recent-pain muscle set are computed in the app layer and passed in
 * as `readiness` and `avoid`, not fetched from a selector.
 */
```

Imports (all verified to exist with these exact names):
```ts
import type { Exercise, ResistanceMode } from '@/core/models';
import type { MuscleId } from '@/data/muscles';
import { findExercise } from '@/core/exercises';
import { suggestNext, type Suggestion } from './progression';
import { applyDeload } from './coach/deload';
import { equipmentGroup } from './coach/cues';
import type { BrainContext } from './coach/context';
import { allExercises, scoreExercise, usageProfile, type UsageProfile } from './coach/planners/shared';
import { MAX_SUBSTITUTES, SUBSTITUTE_MIN_READY } from './coach/bands';
```

Module-private constant, with this comment:
```ts
/**
 * Progress means the same thing inside this set of modes (more load, more
 * reps, less help), so they substitute for one another. A timed hold or a
 * conditioning drill does not stand in for a weighted press: the target
 * would be a different kind of number.
 */
const REP_PROGRESS_MODES: ReadonlySet<ResistanceMode> = new Set(['weighted', 'bodyweight', 'assisted']);
const sameModeFamily = (a: Exercise, b: Exercise): boolean =>
  a.mode === b.mode || (REP_PROGRESS_MODES.has(a.mode) && REP_PROGRESS_MODES.has(b.mode));
```

EXPORTED API — exactly these three:
```ts
export interface Substitute {
  exerciseId: string;
  name: string;
  /** The library's own equipment string, e.g. "Plate-Loaded / Machine". Shown verbatim. */
  equipment: string;
  /** equipmentGroup(equipment) — the coarse group the spread rule and the "different kit" mode use. */
  equipmentGroup: string;
  /** True when this matches the original's movement pattern AND lead muscle — planSwaps' own strict rule. */
  samePattern: boolean;
  /** Primary muscles shared with the original, in the ORIGINAL's order. Never empty. */
  sharedPrimary: MuscleId[];
  /** This candidate's own next-session target, already scaled by an active easier week. */
  target: Suggestion;
  /** Sessions this exercise appears in (usageProfile.useCount). 0 = never logged. */
  useCount: number;
}

export interface SubstituteOptions {
  /** 'any' ranks the whole shared-muscle pool. 'different_equipment' drops every candidate on the original's own equipment group — the rack is taken. Default 'any'. */
  mode?: 'any' | 'different_equipment';
  /** 0–100 adjusted recovery per muscle, injected by the caller. The brain never reads selectors. Omitted = no readiness gate. */
  readiness?: (m: MuscleId) => number;
  /** Floor for `readiness`. Default SUBSTITUTE_MIN_READY. */
  minReady?: number;
  /** Muscles a recent note flagged as painful — recentPainMuscles(detectNoteFlags(ctx)), injected. Omitted = no pain gate. */
  avoid?: ReadonlySet<MuscleId>;
  /** Exercise ids already in the live session, so a substitute is never something already on the card list. */
  exclude?: ReadonlySet<string>;
  /** A usage profile the caller already has. Computed from ctx when omitted. */
  profile?: UsageProfile;
  /** Default MAX_SUBSTITUTES. */
  max?: number;
}

export function substitutes(
  ctx: BrainContext,
  exerciseId: string,
  plannedSets: number,
  o: SubstituteOptions = {},
): Substitute[]
```

ALGORITHM — implement exactly this. I prototyped it against the real library and the real test fixtures and every claim below is a measured output, not a guess.

1. `const origin = findExercise(exerciseId, ctx.custom); if (!origin || !origin.primary.length) return [];`
2. Resolve defaults: `const mode = o.mode ?? 'any'; const minReady = o.minReady ?? SUBSTITUTE_MIN_READY; const max = o.max ?? MAX_SUBSTITUTES; const originGroup = equipmentGroup(origin.equipment); const profile = o.profile ?? usageProfile(ctx.sessions, ctx.custom, ctx.today);`
3. Eligibility filter over `allExercises(ctx.custom)` — a candidate is dropped if ANY of:
   - `x.id === origin.id`
   - `o.exclude?.has(x.id)`
   - `!x.primary.length`
   - `!x.primary.some(m => origin.primary.includes(m))`  (the shared-primary test)
   - `!sameModeFamily(origin, x)`
   - `o.avoid && x.primary.some(m => o.avoid!.has(m))`  (pain gate — same rule planAdditions applies)
   - `o.readiness && x.primary.some(m => o.readiness!(m) < minReady)`  (mirrors pickExercise's own readiness gate)
   - `mode === 'different_equipment' && equipmentGroup(x.equipment) === originGroup`
4. Tier test: `const isTier1 = (x: Exercise) => x.pattern === origin.pattern && !!x.primary[0] && x.primary[0] === origin.primary[0];` — this is byte-for-byte the rule `planSwaps` already uses to build its candidate list (`x.pattern === meta.pattern && x.primary[0] === meta.primary[0]`, swaps.ts line 33).
5. Rank within a tier, reusing the existing scorer and the existing tie-break:
```ts
const rank = (pool: Exercise[]) => pool
  .map(ex => ({ ex, score: scoreExercise(ex, { candidates: pool, profile, preferFresh: false }) }))
  .sort((a, b) => b.score - a.score || a.ex.id.localeCompare(b.ex.id))
  .map(x => x.ex);
const ordered = [...rank(eligible.filter(isTier1)), ...rank(eligible.filter(x => !isTier1(x)))];
```
   `preferFresh` MUST be `false` — the opposite of `planSwaps`. Mid-session you want something the person already knows how to do, not novelty. `scoreExercise` ignores its `candidates` field; passing the pool is required only to satisfy `PickOptions`.
   Concatenating tiers this way means a tier dominates `useCount` outright: a familiar fly can never be promoted above an unfamiliar press.
6. Equipment spread, three passes:
```ts
const chosen: Exercise[] = [];
const groups = new Set<string>();
for (const x of ordered) { if (chosen.length >= max) break; const g = equipmentGroup(x.equipment); if (groups.has(g)) continue; chosen.push(x); groups.add(g); }
for (const x of ordered) { if (chosen.length >= max) break; if (!chosen.includes(x)) chosen.push(x); }
chosen.sort((a, b) => ordered.indexOf(a) - ordered.indexOf(b));
```
   Pass 1 takes at most one row per equipment group, so the list spans `min(max, distinct groups)` groups. Pass 2 fills leftover rows in rank order. Pass 3 restores rank/tier order for display, so the tier ordering is still what the person reads top-to-bottom.
7. Map to `Substitute`:
```ts
return chosen.map(ex => ({
  exerciseId: ex.id,
  name: ex.name,
  equipment: ex.equipment,
  equipmentGroup: equipmentGroup(ex.equipment),
  samePattern: isTier1(ex),
  sharedPrimary: origin.primary.filter(m => ex.primary.includes(m)),
  target: applyDeload(suggestNext(ctx.sessions, ex.id, ctx.goal, ctx.today, plannedSets, ctx.custom), ctx.deload, ctx.today),
  useCount: profile.useCount.get(ex.id) ?? 0,
}));
```
   `applyDeload` is NOT optional. `EntryCard` (Train.tsx:253) renders `applyDeload(suggestNext(...), deload.value, today.value)`. A row built from raw `suggestNext` during an accepted easier week would show 60 kg and the card it becomes would show 51 kg one tap later.

MEASURED BEHAVIOUR (run against `ctx(pplHistory(LAST_MONDAY, 8))`, `exclude: new Set(PUSH_EX)`):
- Origin `lib_barbell_bench_press` (Barbell, horizontal_push, primary ["chest"]) → `lib_cable_chest_press` (Cable), `lib_decline_bench_press` (Barbell), `lib_dumbbell_bench_press` (Dumbbells) — all `samePattern: true`, all `sharedPrimary: ["chest"]`, 3 distinct equipment groups.
- Same origin with `mode: 'different_equipment'` → `lib_cable_chest_press`, `lib_dumbbell_bench_press`, `lib_machine_chest_press`; `lib_decline_bench_press` (Barbell) is gone.
- Origin `lib_leg_press` with `readiness: m => m === 'glutes' ? 40 : 100` → `lib_barbell_back_squat`, `lib_goblet_squat`, `lib_hack_squat` — all quads-only; every glutes-primary candidate dropped.
- Origin `lib_leg_press`, `max: 30` → `lib_wall_sit` (duration), `lib_box_jump`, `lib_jump_squat`, `lib_sled_push` (conditioning) are all absent, even though they pass the tier-1 pattern+primary test.
- With `lib_machine_chest_press` logged on every push day for 8 weeks: row 1 is `lib_machine_chest_press`, `useCount: 8`, `target.kg === 60`, `target.confidence === 'medium'`, `target.mode === 'plateau'`, and `row.target` deep-equals `suggestNext(c.sessions, 'lib_machine_chest_press', c.goal, c.today, 3, c.custom)`.
- Same fixture with `deload: { from: '2026-09-15', to: '2026-09-25', loadFactor: DELOAD_LOAD_FACTOR, effortCap: 'ideal' }` → `target.kg === 51`.

ALSO NEW: `replaceEntry()` in `src/slices/workout/session.ts` (see filesToModify). That is slice code, not brain code — it mutates the store through the existing `patchActive`.

NOT NEW, deliberately: no new ranking model, no new scorer, no new `Finding` or `Proposal`. `substitutes()` is a ~60-line composition over `allExercises`, `scoreExercise`, `usageProfile`, `equipmentGroup`, `suggestNext` and `applyDeload`, all of which already exist and none of which may be edited.

## Contract changes

none.

This is deliberately NOT a `Proposal` and NOT a `Finding`. Proposals are coach-initiated, dismissable, cooldown-tracked and belong in the Suggestions inbox; this is user-initiated, lives for exactly one tap, and must not leave a `dismissKey`, an `accepted[key]` day, or an `ACCEPT_COOLDOWN_DAYS` entry behind. Do not touch `src/brain/coach/contract.ts`, `src/data/principles.json`, `PRINCIPLES_BY_FINDING`, `PRINCIPLES_BY_PROPOSAL`, `PROPOSAL_ORDER`, `CATEGORY_OF`, `wordsFor`, `renderProposal`, `acceptProposal` (`src/slices/coach/apply.ts`), `KIND_LABEL` in `Coach.tsx`, or `src/brain/coach/preferences.ts`. `CONTRACT_VERSION` stays 1.

The only shared-constants change is two new bands in `src/brain/coach/bands.ts` — see filesToModify.

## Files to create

### `/home/user/M-arc/src/brain/live.ts`
Pure Layer-1 brain work for the live session: ranked substitute exercises for one entry, each carrying its own deload-adjusted next-session target. Composes existing helpers only; imports nothing from @/app, @/slices, @/ui, @/native or @/core/store.

```ts
export interface Substitute { exerciseId: string; name: string; equipment: string; equipmentGroup: string; samePattern: boolean; sharedPrimary: MuscleId[]; target: Suggestion; useCount: number }

export interface SubstituteOptions { mode?: 'any' | 'different_equipment'; readiness?: (m: MuscleId) => number; minReady?: number; avoid?: ReadonlySet<MuscleId>; exclude?: ReadonlySet<string>; profile?: UsageProfile; max?: number }

export function substitutes(ctx: BrainContext, exerciseId: string, plannedSets: number, o?: SubstituteOptions): Substitute[]

(module-private, not exported: const REP_PROGRESS_MODES: ReadonlySet<ResistanceMode>; const sameModeFamily: (a: Exercise, b: Exercise) => boolean)
```

### `/home/user/M-arc/tests/live-substitutes.test.ts`
Vitest node-environment tests for substitutes() and replaceEntry(). Two describes in one file: the brain function against real library data and tests/coach-helpers fixtures, and replaceEntry against a real store seeded the way tests/splits.test.ts does it.

```ts
no exports (test file). Local helper copied from tests/splits.test.ts line 6:
const memory = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) }; };
Local fixture:
const withMachine = () => pplHistory(LAST_MONDAY, 8, (_w, split, ex) => split === 'push' ? [...ex, { id: 'lib_machine_chest_press', sets: sets(60, 8, 'ideal') }] : ex);
```

## Files to modify

- **`/home/user/M-arc/src/brain/coach/bands.ts`** — Append two constants at the end of the file (after DELOAD_LOAD_FACTOR, line 96), each with a doc comment. The brief's rule is that thresholds live here and are never inlined.

/** At most this many substitutes in the live swap sheet. Three rows is a decision, six is a menu. */
export const MAX_SUBSTITUTES = 3;

/**
 * Readiness floor for a mid-session substitute, in percent recovered. Lower than
 * pickExercise's own 90 default on purpose: the person is already training this
 * muscle group right now, so the gate exists to stop offering something that is
 * clearly still cooked, not to enforce a fresh muscle. Sits between
 * RECOVERY_SWAP_PCT (60) and RECOVERY_FLAG_PCT (75) territory by design.
 */
export const SUBSTITUTE_MIN_READY = 75;

Do not change any existing constant in this file.
- **`/home/user/M-arc/src/slices/workout/session.ts`** — Add `replaceEntry` immediately after `addExerciseToSession` (line 98-100) and before `removeEntry`. This is the bug fix: `addExerciseToSession` appends to the end of `entries`, and EntryCards are keyed `${entry.exerciseId}-${i}`, so using it for a swap would jump the exercise to the bottom of the list and reset every card below it.

/**
 * Swap one live entry for a different exercise, in place. The card keeps its
 * position and its planned set count, so a mid-session swap does not send the
 * exercise to the bottom of the list. Sets already logged in the slot are
 * cleared — they belong to the exercise that was there — so the caller confirms
 * with the person first when the slot is not empty. Returns false and changes
 * nothing when there is no active session, the index is out of range, or that
 * exercise is already somewhere in this session.
 */
export function replaceEntry(entry: number, ex: Exercise): boolean {
  const a = active();
  if (!a || !a.entries[entry]) return false;
  if (a.entries.some((e, i) => i !== entry && e.exerciseId === ex.id)) return false;
  patchActive(x => ({ ...x, entries: x.entries.map((e, i) => (i !== entry ? e : { exerciseId: ex.id, name: ex.name, sets: Array.from({ length: Math.max(1, e.sets.length) }, () => ({})), done: false, skipped: false })) }));
  void haptic.medium();
  return true;
}

No new imports are needed: `Exercise`, `active`, `patchActive` and `haptic` are all already in this file. Do NOT call `flushSave()` — match `addExerciseToSession` and `removeEntry`, which do not; `update()` already schedules the save.
- **`/home/user/M-arc/src/slices/workout/Train.tsx`** — Six edits.

(1) IMPORTS. Add to the existing import from './session' (line 19): `replaceEntry`. Add to the existing import from '@/brain/exposure' (line 17): `isWorkingSet`. Add to the existing import from '@/brain/progression' (line 12): `type Suggestion`. Add to the existing import from 'preact/hooks' (line 1): nothing (useMemo is NOT used — see doNots). New import lines:
import { substitutes, type Substitute } from '@/brain/live';
import { contextFromState } from '@/brain/coach/context';
import { adjustedRecovery, detectNoteFlags } from '@/brain/coach/detectors';
import { recentPainMuscles } from '@/brain/coach/planners/shared';
import { equipmentGroup } from '@/brain/coach/cues';

(2) MODULE-LEVEL HELPER, next to EFFORTS (line 30). This de-duplicates the identical expression already written twice, at line 117 and line 263; replace both call sites with it.
/** A Suggestion's headline target, with kg rendered in the user's unit. */
function fmtTarget(sg: Suggestion, u: 'kg' | 'lb'): string {
  return sg.kg != null && u === 'lb' ? sg.target.replace(`${sg.kg} kg`, formatLoad(sg.kg, u)) : sg.target;
}
Line 117 becomes: {fmtTarget(next, u)} · {next.reason}
Line 263 becomes: {fmtTarget(next, u)} · {logged}/{entry.sets.length} sets

(3) LiveSession — lift `picking` from a boolean to a tagged union (line 196):
const [picking, setPicking] = useState<{ mode: 'add' } | { mode: 'replace'; index: number } | null>(null);
Line 215 button: onClick={() => setPicking({ mode: 'add' })}
Line 214 EntryCard: add prop onBrowse={() => setPicking({ mode: 'replace', index: i })}
Line 218 picker becomes:
{picking && <ExercisePicker exclude={a.entries.map(e => e.exerciseId)} onClose={() => setPicking(null)} onPick={ex => {
  if (picking.mode === 'replace') {
    const slot = a.entries[picking.index];
    const n = slot ? slot.sets.filter(isWorkingSet).length : 0;
    if (slot && n > 0 && !confirm(`Replace ${slot.name}? The ${n} set${n === 1 ? '' : 's'} you logged on it are cleared from this session.`)) { setPicking(null); return; }
    replaceEntry(picking.index, ex);
  } else addExerciseToSession(ex);
  setPicking(null);
}} />}
(`confirm()` is already used in this file at line 230 for discarding a session — same pattern, no new primitive.)

(4) EntryCard signature (line 248) — add one prop: `onBrowse: () => void`. Destructure it.

(5) EntryCard local state — replace `const [menu, setMenu] = useState(false);` (line 254) with:
const [menu, setMenu] = useState(false);
const [swap, setSwap] = useState<{ mode: 'any' | 'different_equipment'; rows: Substitute[] } | null>(null);
const [confirmSwap, setConfirmSwap] = useState<Substitute | null>(null);
const loggedHere = entry.sets.filter(isWorkingSet).length;
and two handlers, defined in the component body but only EVER invoked from an event handler:
// Computed on tap, never in the render body: usageProfile is an O(all logged sets)
// scan and adjustedRecovery is ~20 ms — both would otherwise run on every keystroke
// in every set input.
const openSwaps = (m: 'any' | 'different_equipment') => {
  const c = contextFromState(state.value, today.value, Date.now());
  const ready = new Map(adjustedRecovery(c).map(r => [r.muscle, r.adjustedPct]));
  const rows = substitutes(c, entry.exerciseId, entry.sets.length, {
    mode: m,
    exclude: new Set((active()?.entries ?? []).map(e => e.exerciseId)),
    readiness: mu => ready.get(mu) ?? 100,
    avoid: recentPainMuscles(detectNoteFlags(c)),
  });
  setSwap({ mode: m, rows });
};
const doSwap = (sub: Substitute) => {
  const pick = findExercise(sub.exerciseId, s.customExercises);
  if (!pick) return;
  if (!replaceEntry(index, pick)) { showToast('Already in this session'); return; }
  const undoable = loggedHere === 0 && !!ex;
  setConfirmSwap(null); setSwap(null); setMenu(false);
  showToast(`Swapped in ${pick.name}`, undoable ? 'Undo' : undefined, undoable ? () => { replaceEntry(index, ex!); } : undefined);
};

(6) EntryCard sheet (lines 305-313) — replace the single sheet with three mutually exclusive sheets. Exact markup in uiSpec. Only one <Sheet> is ever mounted at a time; never nest two.
- **`/home/user/M-arc/docs/COACH_BRAIN.md`** — Two additions.

(a) A new short subsection immediately after the '## Layer 1: planners' block (which ends just before '## The contract', around line 128), titled '## Layer 1: live helpers':

`src/brain/live.ts` answers questions the person asks *during* a session,
about the session they are in. `substitutes(ctx, exerciseId, plannedSets,
opts)` ranks up to three exercises that share a primary muscle with the one
on the card: strictly same-movement candidates first (the same
`pattern` + lead-muscle rule `planSwaps` uses), then same-muscle ones,
ordered inside each tier by `scoreExercise` with `preferFresh: false` —
mid-session you want what the person already knows, not novelty. The rows
span as many distinct equipment groups as the pool allows, and a "the rack
is taken" mode drops the original's own group outright. Each row carries
`suggestNext` for that candidate, run through `applyDeload`, so the number
on the row is the number the card shows one tap later. Readiness and the
recent-pain muscle set are injected by the caller: the brain layer does not
read `src/app/selectors.ts`. This is not a `Proposal` — it is user-initiated,
lives for one tap, and leaves no `dismissKey` behind.

(b) One dated row appended to the '## Decisions log' table (currently ending at line 449), matching the existing pipe format and ending in the deploy consequence:

| 2026-09-20 | A mid-session substitute is a live brain helper, not a proposal: user-initiated, no dismiss key, no cooldown, one tap long. Its target is the candidate's own `suggestNext` put through `applyDeload`, so the sheet and the card it becomes never state two different loads. Substitutes are computed on the tap that opens the sheet, never in a render body — `usageProfile` and `adjustedRecovery` would otherwise run on every keystroke in a set input. Nothing leaves the device and the proxy is untouched; ships app-only. |

## UI spec

All UI lives in `/home/user/M-arc/src/slices/workout/Train.tsx`. No new component, no new file, no new CSS class. Reuses `Sheet`, `Row`, `Button`, `Chip` from `src/ui/primitives.tsx` and the existing `.stack-sm`, `.list`, `.hint`, `.ellipsis`, `.small`, `.muted`, `.grid-2` classes (all verified present in `src/ui/styles.css`).

MOUNT POINT: the per-entry options `Sheet` inside `EntryCard`, Train.tsx lines 305-313. Today it contains exactly "Skip today / Put back in today", "Remove from this session", and a metadata `.hint` line. It becomes three mutually exclusive sheets driven by `menu`, `swap` and `confirmSwap`.

--- STATE 1: the options sheet (unchanged entry point, two new rows on top) ---
```tsx
{menu && !swap && !confirmSwap && (
  <Sheet title={entry.name} onClose={() => setMenu(false)}>
    <div class="stack-sm">
      <Row onClick={() => openSwaps('different_equipment')}>
        <div>Equipment is taken</div>
        <div class="hint">Same muscles, different kit</div>
      </Row>
      <Row onClick={() => openSwaps('any')}>
        <div>Not doing this one today</div>
        <div class="hint">Same muscles, best match from your history</div>
      </Row>
      <Button onClick={() => { skipEntry(index, !entry.skipped); setMenu(false); }}>{entry.skipped ? 'Put back in today' : 'Skip today'}</Button>
      <Button variant="danger" onClick={() => { onRemove(); setMenu(false); }}>Remove from this session</Button>
      {ex && <p class="hint">{ex.equipment} · main: {ex.primary.map(muscleLabel).join(', ')}{ex.secondary.length ? ` · helps: ${ex.secondary.map(muscleLabel).join(', ')}` : ''}</p>}
    </div>
  </Sheet>
)}
```
Copy is fixed, kit-neutral and honest. It is deliberately NOT "Rack's taken" — the blocked exercise may be a cable station. The two rows differ only in that the first excludes the original's own `equipmentGroup`; that one bit of user signal is what turns a muscle filter into a coach reading the room, and it stays entirely offline.

--- STATE 2: the substitute list ---
```tsx
{menu && swap && !confirmSwap && (
  <Sheet title={`Swap ${entry.name}`} onClose={() => { setSwap(null); setMenu(false); }}>
    <div class="stack-sm">
      <p class="hint">{swap.mode === 'different_equipment' && ex ? `Same muscles, off the ${equipmentGroup(ex.equipment).toLowerCase()}.` : 'Same muscles, ranked by what you already train.'} Every target below comes from your own sessions with that exercise. Nothing changes until you pick one.</p>
      <div class="list">
        {swap.rows.map(sub => (
          <Row
            key={sub.exerciseId}
            onClick={() => (loggedHere ? setConfirmSwap(sub) : doSwap(sub))}
            trailing={
              sub.useCount === 0 ? <Chip>New to you</Chip>
                : sub.target.confidence === 'low' ? <Chip tone="warning">Rough target</Chip>
                : <Chip>{sub.useCount} session{sub.useCount === 1 ? '' : 's'}</Chip>
            }
          >
            <div class="ellipsis">{sub.name}</div>
            <div class="hint ellipsis">{fmtTarget(sub.target, u)} · {sub.samePattern ? `Same movement, ${sub.sharedPrimary.map(muscleLabel).join(' and ')}` : `Also hits ${sub.sharedPrimary.map(muscleLabel).join(' and ')}`} · {sub.equipment}</div>
          </Row>
        ))}
        {!swap.rows.length && <p class="muted small" style={{ padding: '12px 0' }}>{swap.mode === 'different_equipment' ? 'Nothing on other kit trains the same muscles and is ready today.' : 'No close match right now — everything similar is already in this session or still recovering.'}</p>}
      </div>
      <Row onClick={() => { setSwap(null); setMenu(false); onBrowse(); }}>
        <div>Browse all exercises</div>
        <div class="hint">Search the library. No target until you have logged it.</div>
      </Row>
      <Button variant="quiet" onClick={() => setSwap(null)}>Back</Button>
    </div>
  </Sheet>
)}
```

COPY TEMPLATE for a row's `.hint` line, with the exact source of every placeholder:

`{target} · {why} · {equipment}`

- `{target}` = `fmtTarget(sub.target, u)`. `sub.target` is `applyDeload(suggestNext(ctx.sessions, candidateId, ctx.goal, ctx.today, entry.sets.length, ctx.custom), ctx.deload, ctx.today)`; `.target` is `Suggestion.target`, a string built inside `progression.ts` from `last.topKg` (that candidate's own logged top set) and `repRange(meta, goal)` (`GOAL_BY_ID[goal].reps` or `.accessoryReps`). `fmtTarget` only re-renders the kg in the user's unit at the render edge, using the identical expression EntryCard already uses at line 263. Examples produced by the real code: `"60 kg · 6–12 reps"`, `"Start light · 6–12 reps"`, `"20 kg · 6–12 reps"`, `"14 reps"`, `"Hold 25s"`.
- `{why}` = `sub.samePattern ? \`Same movement, ${sub.sharedPrimary.map(muscleLabel).join(' and ')}\` : \`Also hits ${sub.sharedPrimary.map(muscleLabel).join(' and ')}\``. `samePattern` is `Exercise.pattern` + `primary[0]` equality against the original; `sharedPrimary` is the set intersection of the two `Exercise.primary` arrays from the library; `muscleLabel` is `src/data/muscles.ts` line 64. Examples: `"Same movement, Chest"`, `"Same movement, Quads and Glutes"`, `"Also hits Quads"`.
- `{equipment}` = `sub.equipment`, the library's own `Exercise.equipment` string, verbatim. Examples: `"Machine"`, `"Cable"`, `"Dumbbells"`, `"Plate-Loaded / Machine"`.

TRAILING CHIP, exactly three cases and this precedence:
- `useCount === 0` → `<Chip>New to you</Chip>`. From `usageProfile(ctx.sessions, ctx.custom, ctx.today).useCount`. Says plainly that the target is the library's starting-load line, not this person's history.
- else `target.confidence === 'low'` → `<Chip tone="warning">Rough target</Chip>`. `Suggestion.confidence` is a real field (progression.ts line 28); it is shown, never hidden.
- else → `<Chip>{useCount} session{useCount === 1 ? '' : 's'}</Chip>`. A real count of sessions containing that exercise.

Fully rendered example, real output from the prototype against a fixture where the person logs a machine chest press on every push day for eight weeks, goal `lean`, unit kg, bench press card open:
- `Machine Chest Press` / `60 kg · 6–12 reps · Same movement, Chest · Machine` / chip `8 sessions`
- `Cable Chest Press` / `Start light · 6–12 reps · Same movement, Chest · Cable` / chip `New to you`
- `Decline Bench Press` / `20 kg · 6–12 reps · Same movement, Chest · Barbell` / chip `New to you`

--- STATE 3: the confirm, only when the slot already has logged sets ---
```tsx
{menu && confirmSwap && (
  <Sheet title={`Swap ${entry.name}?`} onClose={() => setConfirmSwap(null)}>
    <div class="stack-sm">
      <p class="small">You have {loggedHere} set{loggedHere === 1 ? '' : 's'} logged on {entry.name}. Swapping replaces the card and clears them from this session.</p>
      <div class="grid-2">
        <Button onClick={() => { const pick = findExercise(confirmSwap.exerciseId, s.customExercises); if (pick) addExerciseToSession(pick); setConfirmSwap(null); setSwap(null); setMenu(false); showToast(`${confirmSwap.name} added below`); }}>Keep my sets, add below</Button>
        <Button variant="primary" onClick={() => doSwap(confirmSwap)}>Swap and clear</Button>
      </div>
      <Button variant="quiet" onClick={() => setConfirmSwap(null)}>Cancel</Button>
    </div>
  </Sheet>
)}
```
`{loggedHere}` = `entry.sets.filter(isWorkingSet).length` — real logged sets in the live session, using the app's single definition of "this set counts".

ACCEPT / DISMISS INTERACTION — nothing changes until tapped:
- Opening the options sheet: reads only. No store write.
- Tapping "Equipment is taken" / "Not doing this one today": computes the list into COMPONENT-LOCAL state. No store write, nothing persisted, no `ActiveSession` field added.
- Tapping a substitute row with an EMPTY slot: `replaceEntry(index, ex)` — the single store write — then the sheet closes and a toast offers `Undo`, which calls `replaceEntry(index, ex_original)` to put the original exercise back at the same index with the same planned set count.
- Tapping a substitute row with a NON-EMPTY slot: no write yet; the confirm sheet opens with two real, non-destructive-vs-destructive choices. "Keep my sets, add below" uses the existing `addExerciseToSession` (appends, keeps the logged work). "Swap and clear" calls `replaceEntry`. `Undo` is NOT offered in this path, because the cleared sets cannot be restored and a toast that implies otherwise would be a lie.
- "Back" returns to the options sheet with no write. The sheet's own close button and backdrop dismiss with no write.
- "Browse all exercises" hands off to the existing `ExercisePicker` in replace mode; a non-empty slot triggers the same `confirm()` before the write.

LOADING / EMPTY STATES: there is no loading state — the whole path is synchronous on-device work (three `suggestNext` calls at 0.3–0.4 ms each plus one `usageProfile` scan and one `adjustedRecovery`, all on the tap that opens the list, ~25 ms once). Empty state is the `.muted.small` paragraph above, plus the always-present "Browse all exercises" row, so the sheet is never a dead end.

AFTER THE SWAP: the card keeps index `index`, so `open` in `LiveSession` still points at it and it stays expanded. Its `key` changes (`${entry.exerciseId}-${i}`), so the card remounts and its own local sheet state resets — which is what you want, the sheet just closed. The card's existing `suggestNext` + `applyDeload` at line 253 now targets the substitute, so the header hint and every set-row placeholder repopulate with the substitute's real numbers immediately. `FinishChoice` (line 228) already compares the split's exercise ids to the session's, so a swap automatically makes the finish sheet offer "Save for future" — no code needed.

## Data flow

Every hop, no gaps:

1. RAW STATE. `state.value.active.entries[index]` — `{ exerciseId, name, sets: LoggedSet[], done, skipped }` (`ActiveSession` in `src/core/models.ts`). Plus `state.value.sessions` (all history, kg), `state.value.customExercises`, `state.value.goal`, `state.value.coach.deload`.

2. TAP. The person taps the "..." button on an `EntryCard` (`setMenu(true)`), then one of the two new rows. This is the ONLY trigger. Nothing above runs on render.

3. CONTEXT. The tap handler `openSwaps(mode)` calls `contextFromState(state.value, today.value, Date.now())` from `src/brain/coach/context.ts` → a `BrainContext`. Reading `state.value` inside an event handler creates no render subscription.

4. INJECTED READINESS. `adjustedRecovery(c)` from `src/brain/coach/detectors` (re-exported from `detectors/recovery.ts`) → `AdjustedRecovery[]` → `new Map(rows.map(r => [r.muscle, r.adjustedPct]))` → the `readiness: (m) => ready.get(m) ?? 100` closure. This is exactly the same number `src/app/selectors.ts` line 45-48 exposes as `recovery`, computed here instead of read from the selector so that (a) the brain layer stays pure and (b) EntryCard never subscribes to a ~20 ms computed that would then re-evaluate on every keystroke.

5. INJECTED PAIN SET. `detectNoteFlags(c)` (`src/brain/coach/detectors/notes.ts`) → `Finding[]` → `recentPainMuscles(findings)` (`src/brain/coach/planners/shared.ts` line 118) → `Set<MuscleId>`. `detectNoteFlags` is an O(sessions) scan over `Session.noteFlags`, not a `buildReport` call. NOTE, and say so honestly in any write-up: `noteFlags` are written only by `applySessionNoteFlags`, called only from `requestNoteFlags` (the `/notes` proxy route). For the default user (`remoteExplainer === false`) this set is permanently empty and the gate is a silent no-op. It degrades in the safe direction. Do not describe the feature to users as pain-aware.

6. INJECTED EXCLUSIONS. `new Set((active()?.entries ?? []).map(e => e.exerciseId))` — every exercise already on a card in this session, including the one being replaced.

7. BRAIN. `substitutes(c, entry.exerciseId, entry.sets.length, { mode, exclude, readiness, avoid })` in `src/brain/live.ts`:
   `allExercises(ctx.custom)` → eligibility filter (shared primary, mode family, pain, readiness, equipment mode, exclusions) → tier split by `pattern` + `primary[0]` → `scoreExercise(..., { preferFresh: false })` sort inside each tier → equipment-group spread → per row `suggestNext(ctx.sessions, candidateId, ctx.goal, ctx.today, plannedSets, ctx.custom)` → `applyDeload(suggestion, ctx.deload, ctx.today)` → `Substitute[]`.

8. COMPONENT STATE. `setSwap({ mode, rows })`. Component-local `useState` only. Not a signal, not a selector, not in the store, not in `ActiveSession`. It dies when the sheet closes.

9. RENDER. `swap.rows.map(...)` → `Row` + `Chip` per substitute. `fmtTarget(sub.target, u)` converts kg to the display unit at the render edge only (`unit` selector → `core/units.ts`). No other transformation of any number.

10. USER ACTION. Tap a row → `loggedHere > 0 ? setConfirmSwap(sub) : doSwap(sub)`.

11. STATE UPDATE. `doSwap` → `findExercise(sub.exerciseId, s.customExercises)` → `replaceEntry(index, pick)` in `src/slices/workout/session.ts` → `patchActive` → `update(s => ...)` in `src/core/store.ts` → new `AppState` → `state` signal fires.

12. RE-RENDER. `LiveSession` re-renders, `EntryCard` at `index` gets a new `key` and remounts with the substitute's `exerciseId`. Its own line-253 `applyDeload(suggestNext(...))` now returns the substitute's target — the same object `substitutes()` computed one tap earlier, because both call the same function with the same arguments and the same deload. The header hint, every set-row `placeholder`, and the `next.reason` line all repopulate. A toast with `Undo` calls `replaceEntry(index, ex_original)`.

13. BROWSE-ALL BRANCH. `onBrowse()` → `setPicking({ mode: 'replace', index })` in `LiveSession` → the existing `<ExercisePicker>` renders with `exclude={a.entries.map(e => e.exerciseId)}` → `onPick(ex)` → optional `confirm()` when the slot has logged sets → `replaceEntry(picking.index, ex)`.

14. SESSION END. Unchanged. `finishSession` drops skipped entries and non-working sets; the swapped exercise is written into `Session.exercises` under its new id, so the NEXT call to `substitutes()` or `suggestNext()` for that exercise sees one more session of history. `FinishChoice` already detects that the session's exercise ids differ from the split's and offers "Save for future".

## Network / offline

none - fully on-device.

No route is called. No payload field is added. `proxy/src/types.ts`, `onlyKeys`, `validateGrounding()` and the §1 blocklist are untouched. Nothing leaves the device. Do not create or edit anything under `src/ai/**` or `proxy/**` for this feature.

Why enrichment is not merely deferred but architecturally unavailable mid-workout: the live ceiling is the Cloudflare `[[ratelimits]]` RATE binding at 6 requests per 60 seconds per device across ALL routes. A per-swap or per-set model call would burn that budget in the first two minutes of a session and starve `/ask` and `/explain`. The deterministic path is complete without it.

If a future version ever adds phrasing ("this one keeps the same chest emphasis with less shoulder strain"), it phrases only: the candidate set, the ranking, the equipment gate, the readiness gate and every number stay in `src/brain/live.ts`, and the call would be a `/explain`-shaped request over a trimmed report, never a new payload shape carrying `sessions`.

## Tests to write

- tests/live-substitutes.test.ts — describe('substitutes'), it('puts same-movement candidates above same-muscle ones and never returns more than MAX_SUBSTITUTES'): with `const c = ctx(pplHistory(LAST_MONDAY, 8))` and `substitutes(c, 'lib_barbell_bench_press', 3, { exclude: new Set(PUSH_EX) })`, assert `rows.length <= MAX_SUBSTITUTES`, `rows.length > 0`, and that `rows.findIndex(r => !r.samePattern)` is either -1 or greater than the last index where `samePattern` is true (i.e. `rows.map(r => r.samePattern)` is non-increasing).
- tests/live-substitutes.test.ts — it('never returns the exercise itself or anything already on a card'): same call; assert `rows.every(r => r.exerciseId !== 'lib_barbell_bench_press')` and `rows.every(r => !PUSH_EX.includes(r.exerciseId))`.
- tests/live-substitutes.test.ts — it('every row shares at least one primary muscle with the original'): for each row, `expect(r.sharedPrimary.length).toBeGreaterThan(0)` and `expect(findExercise('lib_barbell_bench_press')!.primary).toEqual(expect.arrayContaining(r.sharedPrimary))` and `expect(findExercise(r.exerciseId)!.primary).toEqual(expect.arrayContaining(r.sharedPrimary))`.
- tests/live-substitutes.test.ts — it('carries the candidate\'s own next-session target, identical to suggestNext'): with the `withMachine()` fixture and `exclude: new Set(PUSH_EX)`, take `const row = rows.find(r => r.exerciseId === 'lib_machine_chest_press')!`; assert `expect(row.target).toEqual(suggestNext(c.sessions, 'lib_machine_chest_press', c.goal, c.today, 3, c.custom))`, `expect(row.target.kg).toBe(60)`, `expect(row.target.confidence).toBe('medium')`, `expect(row.useCount).toBe(8)`. (Verified real output.)
- tests/live-substitutes.test.ts — it('gives a never-logged candidate the honest start-mode line rather than nothing'): with `ctx(pplHistory(LAST_MONDAY, 8))` and `exclude: new Set(PUSH_EX)`, assert every row has `useCount === 0`, `target.mode === 'start'` and `target.confidence === 'low'`; assert the `lib_decline_bench_press` row has `target.kg === 20` (startingLoadKg('Barbell')) and the `lib_cable_chest_press` row has `target.kg === null` with `target.target === 'Start light · 6–12 reps'`.
- tests/live-substitutes.test.ts — it('scales every row by an active easier week, exactly like the live card does'): `const c = ctx(withMachine(), { deload: { from: '2026-09-15', to: '2026-09-25', loadFactor: DELOAD_LOAD_FACTOR, effortCap: 'ideal' } })`; take the `lib_machine_chest_press` row; assert `expect(row.target).toEqual(applyDeload(suggestNext(c.sessions, 'lib_machine_chest_press', c.goal, c.today, 3, c.custom), c.deload, c.today))` and `expect(row.target.kg).toBe(51)` and that 51 is strictly less than the undeloaded 60. This is the anti-regression test for the sheet and the card disagreeing.
- tests/live-substitutes.test.ts — it('drops candidates whose primary muscle is under the readiness floor'): `substitutes(c, 'lib_leg_press', 3, { exclude: new Set(LEGS_EX), readiness: m => (m === 'glutes' ? 40 : 100) })`; assert `rows.length === 3` and `rows.every(r => !findExercise(r.exerciseId)!.primary.includes('glutes'))`; assert the returned ids are `['lib_barbell_back_squat', 'lib_goblet_squat', 'lib_hack_squat']` (verified real output, pins both the gate and the ordering).
- tests/live-substitutes.test.ts — it('drops candidates whose primary muscle a recent note flagged as painful'): `substitutes(c, 'lib_barbell_bench_press', 3, { exclude: new Set(PUSH_EX), avoid: new Set(['chest']) })` → `expect(rows).toEqual([])` (bench's only primary is chest, so every shared-primary candidate is gated); and `substitutes(c, 'lib_leg_press', 3, { exclude: new Set(LEGS_EX), avoid: new Set(['glutes']) })` → rows exist and none has `glutes` in its `primary`.
- tests/live-substitutes.test.ts — it('never substitutes a timed hold or a conditioning drill for a weighted lift'): `substitutes(c, 'lib_leg_press', 3, { exclude: new Set(LEGS_EX), max: 30 })`; assert the ids do not include `lib_wall_sit` (duration), `lib_box_jump`, `lib_jump_squat` or `lib_sled_push` (conditioning), even though all four pass the same-pattern + same-lead-muscle test; assert `lib_bodyweight_squat` IS present (bodyweight is in the rep-progress family).
- tests/live-substitutes.test.ts — it('spans at least two equipment groups when the pool has them'): bench origin with `exclude: new Set(PUSH_EX)`; `expect(new Set(rows.map(r => r.equipmentGroup)).size).toBeGreaterThanOrEqual(2)` (the verified real result is 3: Cable, Barbell, Dumbbells).
- tests/live-substitutes.test.ts — it('different_equipment drops the original\'s own equipment group'): bench origin (equipment 'Barbell') with `mode: 'different_equipment'`; assert `rows.every(r => r.equipmentGroup !== 'Barbell')` and `rows.every(r => r.exerciseId !== 'lib_decline_bench_press')`; assert the rows are `['lib_cable_chest_press', 'lib_dumbbell_bench_press', 'lib_machine_chest_press']` (verified real output).
- tests/live-substitutes.test.ts — it('ranks familiarity inside a tier, never across it'): build `sessions` = `pplHistory(LAST_MONDAY, 8)` plus ten extra sessions of `lib_cable_fly` (pattern chest_adduction → tier 2) via `session(day, [{ id: 'lib_cable_fly', sets: sets(15, 12, 'ideal') }])`; call with `exclude: new Set(PUSH_EX)`; assert `rows[0].samePattern === true` and `rows.every(r => r.samePattern)` — a heavily-used fly must not be promoted above an unfamiliar press.
- tests/live-substitutes.test.ts — it('is deterministic'): call twice with the same ctx and options; `expect(a.map(r => r.exerciseId)).toEqual(b.map(r => r.exerciseId))`.
- tests/live-substitutes.test.ts — it('returns nothing for an exercise it cannot resolve'): `expect(substitutes(c, 'lib_not_a_real_id_at_all', 3)).toEqual([])`.
- tests/live-substitutes.test.ts — it('stays inside the brain layer'): `const src = readFileSync(new URL('../src/brain/live.ts', import.meta.url), 'utf8'); expect(src).not.toMatch(/from '@\/(app|slices|ui|native)\//); expect(src).not.toMatch(/from '@\/core\/store'/);`. Nothing else enforces the layering rule — no ESLint in this repo — so this test IS the rule. (tests/ask-scenarios.test.ts already reads files with node:fs, so this is not a new convention.)
- tests/live-substitutes.test.ts — describe('replaceEntry') with `beforeEach(() => { initStore(memory()); replaceState(freshState(new Date('2026-06-01T00:00:00Z'))); })`, it('patches in place, keeping position and planned set count'): `createSplit('Push', [{exerciseId:'lib_barbell_bench_press',sets:4},{exerciseId:'lib_dumbbell_lateral_raise',sets:3},{exerciseId:'lib_triceps_pushdown',sets:3}])`, `startSession(split)`, `replaceEntry(0, findExercise('lib_machine_chest_press')!)` → `expect(true)`; assert `active()!.entries.length === 3`, `entries[0].exerciseId === 'lib_machine_chest_press'`, `entries[0].name === 'Machine Chest Press'`, `entries[0].sets.length === 4`, `entries[1].exerciseId === 'lib_dumbbell_lateral_raise'`, `entries[2].exerciseId === 'lib_triceps_pushdown'`.
- tests/live-substitutes.test.ts — it('clears the slot\'s logged sets and its done and skipped flags'): after `startSession`, `setSet(0, 0, { kg: 60, reps: 8, effort: 'ideal' })`, `markDone(0)`; then `replaceEntry(0, findExercise('lib_machine_chest_press')!)`; assert `entries[0].sets.every(s => Object.keys(s).length === 0)`, `entries[0].done === false`, `entries[0].skipped === false`.
- tests/live-substitutes.test.ts — it('refuses when that exercise is already in the session'): a session containing both bench and lateral raise; `expect(replaceEntry(0, findExercise('lib_dumbbell_lateral_raise')!)).toBe(false)` and assert `entries.map(e => e.exerciseId)` is unchanged.
- tests/live-substitutes.test.ts — it('refuses an out-of-range index and refuses with no active session'): `expect(replaceEntry(9, ex)).toBe(false)`; then `discardSession()` and `expect(replaceEntry(0, ex)).toBe(false)`.
- tests/live-substitutes.test.ts — it('a swapped session finishes cleanly and the finish sheet offers to keep the change'): after replacing entry 0 and logging `setSet(0, 0, { kg: 50, reps: 10, effort: 'ideal' })`, call `finishSession(false)`; assert the returned `FinishSummary.changedTemplate === true` and `summary.session.exercises.some(e => e.exerciseId === 'lib_machine_chest_press')` and that the split in `state.value.splits[0]!.exercises[0]!.exerciseId` is still `'lib_barbell_bench_press'` (a one-day swap does not edit the template unless the person chooses 'Save for future').

## Acceptance criteria

- [ ] `npm run check` passes: `tsc --noEmit` clean under `strict` + `noUncheckedIndexedAccess`, all vitest files green (the existing 374 tests plus the new file), and `vite build` succeeds.
- [ ] `npm --prefix proxy run check` is untouched and still passes — no proxy file is modified by this change.
- [ ] `npm run gate` passes across all five themes with no console error; the new rows and chips use only existing classes and theme tokens (`--warning` via `Chip tone="warning"`), and no new CSS is added to `src/ui/styles.css`.
- [ ] `src/brain/live.ts` contains no import from `@/app/`, `@/slices/`, `@/ui/`, `@/native/` or `@/core/store`, and the layering test in `tests/live-substitutes.test.ts` enforces it.
- [ ] `substitutes()` is called from exactly one place in the app — the tap handler `openSwaps` in `EntryCard` — and never from a render body, a `useMemo`, or a `computed` in `src/app/selectors.ts`. Grepping `substitutes(` in `src/slices/` returns one call site.
- [ ] Opening a set input and typing does not call `substitutes`, `usageProfile`, `adjustedRecovery`, `detectNoteFlags` or `buildReport`. (Manual check: add a temporary `console.count` inside `openSwaps`, type ten characters into a kg field, confirm the count does not move.)
- [ ] During an accepted easier week, the kg on a substitute row and the kg on the card that row becomes are identical — because both are `applyDeload(suggestNext(...), deload, today)` with the same arguments. Pinned by the deload test.
- [ ] Tapping a substitute keeps the card at its original index: `entries.length` and the ids at every other index are unchanged, and the planned set count of the slot is preserved.
- [ ] Nothing in `state` changes until a substitute row (or a confirm button) is tapped: opening the options sheet and opening the substitute list perform zero store writes.
- [ ] A slot with logged working sets cannot lose them without an explicit second tap — either the confirm sheet's "Swap and clear", or the `confirm()` dialog on the Browse-all path.
- [ ] `Undo` appears on the toast only when the slot was empty, and restores the original exercise at the same index with the same planned set count.
- [ ] No `Proposal`, `Finding`, `dismissKey`, `accepted[...]` entry or cooldown is created by a swap; `state.value.coach` is byte-identical before and after.
- [ ] Every number on a substitute row traces to logged data: the load and rep range to that candidate's own `exerciseHistory` via `suggestNext` (or, for a never-logged candidate, to `startingLoadKg(equipment)` from the library), the session count to `usageProfile.useCount`, the confidence word to `Suggestion.confidence`. No arithmetic is performed on any of them.
- [ ] With `remoteExplainer === false` (the default), every part of the feature works: the list appears, the targets are real, and the pain gate is simply an empty set.
- [ ] The substitute list spans at least two distinct equipment groups whenever the eligible pool contains at least two, and in `different_equipment` mode contains no candidate on the original's own equipment group.
- [ ] A row's `samePattern` order is non-increasing top to bottom: no same-muscle-only candidate is ever listed above a same-movement one, regardless of how familiar it is.
- [ ] Only one `<Sheet>` is mounted at a time inside `EntryCard`; there is no nested `<dialog>` and no second `<ExercisePicker>` rendered inside a card.
- [ ] `docs/COACH_BRAIN.md` has a new `## Layer 1: live helpers` subsection and exactly one new dated row in the decisions log, ending in the deploy consequence.

## Do NOT

- Do NOT import `recovery`, `report`, `brainContext`, `insights` or anything else from `@/app/selectors` inside `src/brain/live.ts`. Nothing lints this — the layering rule is convention only — so an agent that does it gets a green `npm run check` and a silently broken architecture. Readiness and the pain-muscle set are PARAMETERS (`readiness`, `avoid`), resolved at the Train.tsx call site. The layering test in tests/live-substitutes.test.ts exists precisely to catch this.
- Do NOT call `substitutes()`, `usageProfile()`, `adjustedRecovery()` or `detectNoteFlags()` in `EntryCard`'s render body. The surrounding code actively teaches the wrong habit: `EntryCard` already calls `suggestNext` unmemoized at Train.tsx:253, and that is cheap (0.3-0.4 ms). This one is not — `usageProfile` is a full O(all logged sets) scan (7,468 sets at the brief's 400-session fixture), `adjustedRecovery` is ~21 ms, and three more `suggestNext` calls ride along. Compute it in the tap handler and store the result in `useState`. Do NOT 'fix' this with `useMemo` either: a `useMemo` whose deps include `s.sessions` or `state.value` re-runs on every keystroke, which is the bug.
- Do NOT read `report.value` (or call `buildReport`) anywhere in Train.tsx to get the pain-flag set. `buildReport` runs 19 detectors and is 50-116 ms; it is exactly the wrong thing to run when a sheet opens mid-workout. Call `detectNoteFlags(ctx)` and pass its findings to `recentPainMuscles` — that is an O(sessions) scan over `Session.noteFlags`.
- Do NOT build a row from raw `suggestNext`. It MUST go through `applyDeload(suggestion, ctx.deload, ctx.today)`, because `EntryCard` at line 253 does, and during an accepted easier week the sheet would show 60 kg and the card would show 51 kg one tap later — the same target with two values seconds apart.
- Do NOT use `target.mode === 'start'` to decide whether a target is trustworthy. `applyDeload` rewrites `mode` to `'hold'` for every deloaded suggestion, including a start-mode one. Honesty on the row comes from `useCount === 0` ("New to you") and `target.confidence === 'low'` ("Rough target"), which `applyDeload` preserves.
- Do NOT pass `preferFresh: true` to `scoreExercise`. That is `planSwaps`' novelty bias, correct over weeks and wrong in the thirty seconds when the decision is being made. Mid-session the person wants something they already know how to do. `scoreExercise` already rewards `useCount` up to 5, which is the right instinct.
- Do NOT let familiarity compete with the tier via a score nudge (a `+4` for a matching pattern, or similar). The tiers are concatenated arrays: every same-movement candidate is ranked, then every same-muscle one is appended. A heavily-used fly must never be promoted above an unfamiliar press.
- Do NOT use `addExerciseToSession` to perform the swap. It appends to the end of `entries`, so the exercise jumps to the bottom of the list and — because EntryCards are keyed ``${entry.exerciseId}-${i}`` — every card below it remounts and loses its open/closed state. Use `replaceEntry`, which patches in place.
- Do NOT change the EntryCard `key` from ``${entry.exerciseId}-${i}``. It is deliberate: local state resets when an entry is removed. Changing it to ``${i}`` would leave stale card state behind on removal. That is a separate decision and out of scope here.
- Do NOT render a second `<ExercisePicker>` or a second `<Sheet>` inside `EntryCard` while the options sheet is open. Two `<dialog>` elements with `showModal()` nest badly and you would also duplicate the `exclude` list. Lift `picking` in `LiveSession` to `{ mode: 'add' } | { mode: 'replace'; index } | null` and thread an `onBrowse(index)` callback down — that is the one piece of genuinely new state plumbing in this feature, and it is the right one.
- Do NOT store the substitute list in the store, in `ActiveSession`, in a signal, or in `src/app/selectors.ts`. It is component-local `useState` that lives for one tap. `ActiveSession` gains no new field.
- Do NOT create a `Proposal`, a `ProposalKind`, a `FindingKind`, a `dismissKey`, a `PRINCIPLES_BY_*` entry, an `ACCEPT_COOLDOWN_DAYS` entry, a `PROPOSAL_ORDER` entry, a `KIND_LABEL`, a `principles.json` card, or a `words.ts` case. This is user-initiated and dismissable only by closing a sheet. `CONTRACT_VERSION` stays 1 and `version: 1` in the store type is never bumped.
- Do NOT edit `scoreExercise`, `pickExercise`, `usageProfile`, `allExercises`, `candidatesFor`, `recentPainMuscles`, `planSwaps`, `planToday`, `planAdditions`, `suggestNext`, `applyDeload` or `equipmentGroup`. They are read-only here. If one of them seems to need a change, the design is wrong.
- Do NOT inline `3` or `75`. Add `MAX_SUBSTITUTES` and `SUBSTITUTE_MIN_READY` to `src/brain/coach/bands.ts` with doc comments, and import them. Thresholds live in bands.ts — never inline a number.
- Do NOT do arithmetic on a `Suggestion`'s numbers for display — no 'that's 15% lighter', no percentage of the old load, no estimated one-rep max on the row. Each figure must be its own field. Show `target.target`, `target.kg`, `useCount` and `confidence` as they come out of the brain.
- Do NOT convert kg inside `src/brain/live.ts`. All loads stay in kg through the brain; conversion happens only at the render edge, via the `fmtTarget` helper in Train.tsx using `formatLoad`/`kgToDisplay` from `core/units.ts`.
- Do NOT silently clear logged sets. When `entry.sets.filter(isWorkingSet).length > 0`, the confirm step is mandatory on BOTH paths — the substitute row (confirm sheet with 'Keep my sets, add below' / 'Swap and clear') and the Browse-all picker (`confirm()`, the same pattern already used at Train.tsx:230). And do NOT offer `Undo` after clearing sets — it cannot restore them and the toast would be lying.
- Do NOT describe the feature as pain-aware in user-facing copy. `recentPainMuscles` reads `note_flag` findings, which exist only when `/notes` has run, which requires `remoteExplainer === true`. For the default offline user that set is permanently empty and the gate is a no-op. It degrades safely, but do not claim it.
- Do NOT make any network call, add any payload field, or touch `src/ai/**`, `proxy/src/**`, `onlyKeys` or `validateGrounding`. At 6 requests / 60 s across all routes, a per-swap model call mid-workout is not buildable.
- Do NOT add `export * from './live'` to `src/brain/index.ts`. Import from `@/brain/live` directly, the same way `stats.ts` is imported from `@/brain/stats`. The barrel would drag `coach/planners/shared` → `contract` → `principles.json` into every brain import for no benefit.
- Do NOT add `flushSave()` to `replaceEntry`. `addExerciseToSession` and `removeEntry` do not; `update()` already schedules the save. Match the neighbours.
- Do NOT write a component test. `tests/**/*.test.ts` only, node environment, no JSX in tests — that is the repo's rule and there is no DOM test setup.
- Do NOT offer a candidate whose progress means something different: a timed hold (`mode: 'duration'`) or a conditioning drill (`mode: 'conditioning'`) is not a substitute for a weighted press, even when it passes the same-pattern + same-lead-muscle test. `lib_wall_sit`, `lib_box_jump` and `lib_jump_squat` all pass that test for a leg press and all must be filtered out by `sameModeFamily`.
- Do NOT skip appending the dated row to the COACH_BRAIN.md decisions log. Every substantive change appends one, and it must end in the deploy consequence.

## Open questions for the owner

- When the slot already has logged sets, the shipped default is a confirm sheet offering BOTH 'Keep my sets, add below' (existing `addExerciseToSession`, appends) and 'Swap and clear' (`replaceEntry`). The owner may prefer that a slot with logged work ALWAYS inserts below and never offers to clear — one fewer destructive path, at the cost of the card losing its position. Decide before shipping; the two-button confirm is the reversible choice.
- `SUBSTITUTE_MIN_READY = 75` is a judgement call. `pickExercise`'s own default is 90 and the merged feature note suggested 75; `RECOVERY_SWAP_PCT` (what today_plan uses to force a swap) is 60 and `RECOVERY_FLAG_PCT` (worth mentioning) is 75. 75 is defensible as 'do not offer something visibly still cooked' without being so strict it empties the list mid-session, but it is not derived from anything. Owner call.
- The sheet entry point is two rows ('Equipment is taken' / 'Not doing this one today'). That single extra bit of signal is what lets the list drop the blocked equipment group. The owner may prefer one row ('Swap this exercise') and always-mixed equipment, trading the signal for one fewer tap in the common case.
- Should a substitute the person picks repeatedly — say, machine press over barbell bench three sessions running — eventually feed the existing `exercise_swap` proposal so the coach offers to change the split itself? That is the natural follow-on and is deliberately out of scope here (it would need a per-swap record, which `ActiveSession` has no field for). Worth deciding whether to reserve the data now.
- 'Browse all exercises' currently sits at the bottom of the substitute list, below the three rows. If the list is often empty (a very small custom library, an aggressive readiness gate) it may belong at the top. Cheap to move either way; no design reason to choose one today.
