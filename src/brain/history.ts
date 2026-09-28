/** Per-exercise history, derived once from sessions and reused by every engine. */
import type { Effort, Exercise, LoggedSet, ResistanceMode, Session } from '@/core/models';
import { findExercise } from '@/core/exercises';
import { effectiveOneRm } from './e1rm';
import { daysBetween } from '@/core/dates';
import { isWorkingSet, EFFORT_MULT } from './exposure';
import { confirmsFlagged, isImplausibleSet } from './fidelity';

export interface ExerciseSessionSummary {
  sessionId: string;
  day: string;
  /** Every working set, held ones included (content always counts: set counts, the "last time" hint). */
  sets: LoggedSet[];
  /**
   * BUG-18 (COACHRULES-F3): working sets the plausibility check flags that no other set has
   * repeated yet. Every number below leaves them out, so a typo never feeds e1RM, trends,
   * records or targets until the load is lifted again.
   */
  held: LoggedSet[];
  /** Heaviest load used for a working set. */
  topKg: number;
  /** Reps done at the heaviest load (best set). */
  topReps: number;
  /**
   * BUG-18 (PROGRESSION-F3): the straight working load, the load most working sets used (drop
   * sets aside); a tie goes to the heavier load. Targets build on this, not on one heavy single.
   */
  workKg: number;
  /** Best reps at the working load. */
  workReps: number;
  /** Fewest reps at the working load: every working set reached this (PROGRESSION-F23). */
  workMinReps: number;
  bestReps: number;
  bestDurationSec: number;
  bestDistanceM: number;
  volume: number;
  /** Best estimated 1RM using sets of 10 reps or fewer. */
  bestE1rm: number;
  /** 0–1 share of working sets that have an effort recorded. */
  effortCoverage: number;
  avgEffort: number;
  hasMax: boolean;
  allEasy: boolean;
}

/** The straight working load of `sets` (BUG-18): most sets, then the heavier load; drop sets only when nothing else is loaded. */
function straightLoad(sets: LoggedSet[]): { kg: number; sets: LoggedSet[] } {
  const loaded = sets.filter(s => (s.kg ?? 0) > 0);
  const pool = loaded.some(s => s.kind !== 'drop') ? loaded.filter(s => s.kind !== 'drop') : loaded;
  const count = new Map<number, number>();
  for (const s of pool) count.set(s.kg!, (count.get(s.kg!) ?? 0) + 1);
  let kg = 0, n = 0;
  for (const [k, c] of count) if (c > n || (c === n && k > kg)) { kg = k; n = c; }
  return { kg, sets: pool.filter(s => s.kg === kg) };
}

/** `isHeld` marks sets to leave out of every number (BUG-18); they stay in `sets` and `held`. */
export function summarizeSets(sessionId: string, day: string, sets: LoggedSet[], isHeld: (s: LoggedSet) => boolean = () => false): ExerciseSessionSummary {
  // F2: warm-ups never count; a set to failure stands for max effort everywhere downstream.
  const all = sets.filter(isWorkingSet).map(s => ({ s, held: isHeld(s), w: s.kind === 'failure' && s.effort !== 'max' ? { ...s, effort: 'max' as const } : s }));
  const working = all.filter(x => !x.held).map(x => x.w);
  const { kg: workKg, sets: workSets } = straightLoad(working);
  const topKg = Math.max(0, ...working.map(s => s.kg ?? 0));
  const topSets = working.filter(s => (s.kg ?? 0) === topKg);
  const topReps = Math.max(0, ...topSets.map(s => s.reps ?? 0));
  const withEffort = working.filter(s => s.effort);
  const efforts = withEffort.map(s => EFFORT_MULT[s.effort as Effort]);
  return {
    sessionId,
    day,
    sets: all.map(x => x.w),
    held: all.filter(x => x.held).map(x => x.w),
    topKg,
    topReps,
    workKg,
    workReps: Math.max(0, ...workSets.map(s => s.reps ?? 0)),
    workMinReps: workSets.length ? Math.min(...workSets.map(s => s.reps ?? 0)) : 0,
    bestReps: Math.max(0, ...working.map(s => s.reps ?? 0)),
    bestDurationSec: Math.max(0, ...working.map(s => s.durationSec ?? 0)),
    bestDistanceM: Math.max(0, ...working.map(s => s.distanceM ?? 0)),
    volume: working.reduce((a, s) => a + ((s.kg ?? 0) > 0 ? (s.kg ?? 0) * (s.reps ?? 0) : (s.reps ?? 0)), 0),
    bestE1rm: Math.max(0, ...working.map(s => effectiveOneRm(s.kg ?? 0, s.reps ?? 0, s.effort) ?? 0)),
    effortCoverage: working.length ? withEffort.length / working.length : 0,
    avgEffort: efforts.length ? efforts.reduce((a, b) => a + b, 0) / efforts.length : 1,
    hasMax: withEffort.some(s => s.effort === 'max'),
    allEasy: withEffort.length > 0 && withEffort.length === working.length && withEffort.every(s => s.effort === 'easy'),
  };
}

const NO_CUSTOM: Exercise[] = [];

/** A lift counts as active while it was trained in the last six weeks (BR-05). */
export const ACTIVE_LIFT_DAYS = 42;
export function isActive(hist: ExerciseSessionSummary[], today: string): boolean {
  const last = hist[hist.length - 1];
  return !!last && daysBetween(last.day, today) <= ACTIVE_LIFT_DAYS;
}
/**
 * Results per sessions array and custom list (UI-10): state updates replace the arrays, so an
 * identity hit is always current. Callers get a copy, so sorting or reversing it is safe.
 */
const historyCache = new WeakMap<Session[], WeakMap<Exercise[], Map<string, ExerciseSessionSummary[]>>>();

/** All sessions where this exercise was logged, oldest first. */
export function exerciseHistory(sessions: Session[], exerciseId: string, custom: Exercise[] = NO_CUSTOM): ExerciseSessionSummary[] {
  let byCustom = historyCache.get(sessions);
  if (!byCustom) { byCustom = new WeakMap(); historyCache.set(sessions, byCustom); }
  let byId = byCustom.get(custom);
  if (!byId) { byId = new Map(); byCustom.set(custom, byId); }
  let hit = byId.get(exerciseId);
  if (!hit) { hit = computeExerciseHistory(sessions, exerciseId, custom); byId.set(exerciseId, hit); }
  return [...hit];
}

function computeExerciseHistory(sessions: Session[], exerciseId: string, custom: Exercise[]): ExerciseSessionSummary[] {
  const meta = findExercise(exerciseId, custom);
  const ids = new Set([exerciseId, meta?.id].filter(Boolean) as string[]);
  const rows: Array<{ s: Session; sets: LoggedSet[] }> = [];
  for (const s of sessions) {
    const sets = s.exercises.filter(e => ids.has(e.exerciseId) || (meta && findExercise(e.name, custom)?.id === meta.id)).flatMap(e => e.sets);
    if (!sets.some(isWorkingSet)) continue;
    rows.push({ s, sets });
  }
  rows.sort((a, b) => a.s.day.localeCompare(b.s.day));
  const checkLoad = loadIsChecked(exerciseId, custom);
  const out: ExerciseSessionSummary[] = [];
  rows.forEach(({ s, sets }, i) => {
    const ref = plausibilityRef(out, meta?.role === 'main');
    const later = rows.slice(i + 1).flatMap(r => r.sets.filter(isWorkingSet));
    out.push(summarizeSets(s.id, s.day, sets, heldIn(sets, later, ref, checkLoad)));
  });
  return out;
}

/** BUG-18: kg is checked for implausible jumps only where it is the lifted load. */
export function loadIsChecked(exerciseId: string, custom: Exercise[] = NO_CUSTOM): boolean {
  const mode = modeOf(exerciseId, custom);
  return mode === 'weighted' || mode === 'conditioning';
}

export interface PlausibilityRef {
  /** The best trusted load so far: the reference a jump is measured from. */
  bestKg: number | null;
  /** Whether a set is a main lift above 70 % of the best trusted e1RM (the 30-rep limit applies). */
  heavy: (s: Pick<LoggedSet, 'kg'>) => boolean;
}

/** BUG-18: what a new set is checked against, from the trusted sessions before it. */
export function plausibilityRef(prior: ExerciseSessionSummary[], isMain: boolean): PlausibilityRef {
  const bestKg = Math.max(0, ...prior.map(p => p.topKg));
  const bestE1rm = Math.max(0, ...prior.map(p => p.bestE1rm));
  return { bestKg: bestKg > 0 ? bestKg : null, heavy: s => isMain && bestE1rm > 0 && (s.kg ?? 0) > bestE1rm * 0.7 };
}

/**
 * BUG-18 (plan 6.17.4): the sets of one session held as implausible, those flagged against `ref`
 * that no other working set (this session or a later one, `later`) repeats.
 */
export function heldIn(sets: LoggedSet[], later: LoggedSet[], ref: PlausibilityRef, checkLoad: boolean): (s: LoggedSet) => boolean {
  const working = sets.filter(isWorkingSet);
  const held = new Set(working.filter(set => {
    if (set.kind === 'drop' || !isImplausibleSet(set, ref.bestKg, ref.heavy(set), checkLoad)) return false;
    return ![...working.filter(o => o !== set), ...later].some(o => confirmsFlagged(set, o, ref.bestKg, ref.heavy(set), checkLoad));
  }));
  return s => held.has(s);
}

export function modeOf(exerciseId: string, custom: Exercise[] = []): ResistanceMode {
  return findExercise(exerciseId, custom)?.mode ?? 'weighted';
}

export function daysSinceLast(history: ExerciseSessionSummary[], today: string): number | null {
  const last = history[history.length - 1];
  return last ? daysBetween(last.day, today) : null;
}
