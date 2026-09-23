/**
 * Personal records. The first session of an exercise is a baseline, never a
 * record. Records are about performance (heavier, stronger, more reps at a
 * load, longer hold, more distance), never about total volume.
 */
import type { Exercise, LoadUnit, LoggedSet, ResistanceMode, Session } from '@/core/models';
import { formatSetLoad, kgToDisplay } from '@/core/units';
import { exerciseHistory, modeOf, summarizeSets, type ExerciseSessionSummary } from './history';
import { weekStart, addDays } from '@/core/dates';
import { isWorkingSet } from './exposure';

export type PrKind = 'heaviest' | 'strength' | 'reps_at_load' | 'best_reps' | 'best_duration' | 'best_distance';

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  day: string;
  kind: PrKind;
  /** Plain words, e.g. "60 kg × 8". */
  detail: string;
  value: number;
  previous: number;
}

/** A record's number in words, loads in `unit` (QA-R3b-2). */
export function formatRecordValue(kind: PrKind, v: number, unit: LoadUnit = 'kg'): string {
  if (kind === 'heaviest' || kind === 'strength') return `${kgToDisplay(v, unit)} ${unit}`;
  if (kind === 'best_duration') return `${v}s`;
  if (kind === 'best_distance') return `${v} m`;
  return `${v} reps`;
}

export const PR_LABEL: Record<PrKind, string> = {
  heaviest: 'Heaviest load',
  strength: 'Strength estimate',
  reps_at_load: 'More reps at a load',
  best_reps: 'Most reps',
  best_duration: 'Longest hold',
  best_distance: 'Furthest carry',
};

function repsAtLoadMap(rows: ExerciseSessionSummary[]): Map<number, number> {
  const m = new Map<number, number>();
  for (const r of rows) for (const s of r.sets) {
    if ((s.kg ?? 0) > 0 && (s.reps ?? 0) > 0) m.set(s.kg!, Math.max(m.get(s.kg!) ?? 0, s.reps!));
  }
  return m;
}

/** Records set in `current`, given all `prior` sessions of the same exercise. */
/** BR-28: details read in `unit`, and a set typed in that unit reads exactly as typed. */
/** F2: drop sets count for volume but never set or hold a record. */
function withoutDrops(r: ExerciseSessionSummary): ExerciseSessionSummary {
  return r.sets.some(s => s.kind === 'drop') ? summarizeSets(r.sessionId, r.day, r.sets.filter(s => s.kind !== 'drop')) : r;
}

export function recordsFor(currentIn: ExerciseSessionSummary, priorIn: ExerciseSessionSummary[], mode: ResistanceMode, exerciseId: string, exerciseName: string, unit: LoadUnit = 'kg'): PersonalRecord[] {
  if (!priorIn.length) return [];
  const current = withoutDrops(currentIn);
  const prior = priorIn.map(withoutDrops);
  const out: PersonalRecord[] = [];
  const base = { exerciseId, exerciseName, day: current.day };
  if (mode === 'weighted' || mode === 'conditioning') {
    const prevTop = Math.max(0, ...prior.map(p => p.topKg));
    const topSet = current.sets.find(s => s.kg === current.topKg) ?? { kg: current.topKg };
    if (current.topKg > prevTop && prevTop > 0) out.push({ ...base, kind: 'heaviest', detail: `${formatSetLoad(topSet, unit)} × ${current.topReps}`, value: current.topKg, previous: prevTop });
    const prevE = Math.max(0, ...prior.map(p => p.bestE1rm));
    if (prevE > 0 && current.bestE1rm > prevE * 1.025) out.push({ ...base, kind: 'strength', detail: `about ${Math.round(kgToDisplay(current.bestE1rm, unit))} ${unit} one-rep estimate`, value: Math.round(current.bestE1rm * 10) / 10, previous: Math.round(prevE * 10) / 10 });
    const atLoad = repsAtLoadMap(prior);
    for (const s of current.sets) {
      const prevReps = atLoad.get(s.kg ?? -1);
      if (prevReps != null && (s.reps ?? 0) > prevReps && !out.some(o => o.kind === 'reps_at_load')) {
        out.push({ ...base, kind: 'reps_at_load', detail: `${s.reps} reps at ${formatSetLoad(s, unit)}`, value: s.reps!, previous: prevReps });
      }
    }
  }
  if (mode === 'bodyweight' || mode === 'assisted') {
    const prev = Math.max(0, ...prior.map(p => p.bestReps));
    if (current.bestReps > prev && prev > 0) out.push({ ...base, kind: 'best_reps', detail: `${current.bestReps} reps`, value: current.bestReps, previous: prev });
  }
  if (mode === 'duration' || mode === 'conditioning') {
    const prev = Math.max(0, ...prior.map(p => p.bestDurationSec));
    if (current.bestDurationSec > prev && prev > 0) out.push({ ...base, kind: 'best_duration', detail: `${current.bestDurationSec}s`, value: current.bestDurationSec, previous: prev });
  }
  if (mode === 'conditioning') {
    const prev = Math.max(0, ...prior.map(p => p.bestDistanceM));
    if (current.bestDistanceM > prev && prev > 0) out.push({ ...base, kind: 'best_distance', detail: `${current.bestDistanceM} m`, value: current.bestDistanceM, previous: prev });
  }
  return out;
}

/** Every record across all sessions, newest first. */
export function allRecords(sessions: Session[], custom: Exercise[] = [], unit: LoadUnit = 'kg'): PersonalRecord[] {
  const names = new Map<string, string>();
  for (const s of sessions) for (const e of s.exercises) if (!names.has(e.exerciseId)) names.set(e.exerciseId, e.name);
  const out: PersonalRecord[] = [];
  for (const [id, name] of names) {
    const hist = exerciseHistory(sessions, id, custom);
    const mode = modeOf(id, custom);
    hist.forEach((row, i) => out.push(...recordsFor(row, hist.slice(0, i), mode, id, name, unit)));
  }
  return out.sort((a, b) => b.day.localeCompare(a.day));
}

export function recordsInWeek(sessions: Session[], today: string, custom: Exercise[] = [], unit: LoadUnit = 'kg'): PersonalRecord[] {
  const start = weekStart(today);
  const end = addDays(start, 7);
  return allRecords(sessions, custom, unit).filter(r => r.day >= start && r.day < end);
}

/** Live check while logging: would this set be a record right now? */
export function isLiveRecord(sessions: Session[], exerciseId: string, set: { kg?: number; reps?: number; kind?: LoggedSet['kind'] }, custom: Exercise[] = []): boolean {
  if (!isWorkingSet(set) || set.kind === 'drop') return false;
  const hist = exerciseHistory(sessions, exerciseId, custom);
  if (!hist.length) return false;
  const mode = modeOf(exerciseId, custom);
  const current = summarizeSets('live', '9999-12-31', [set]);
  return recordsFor(current, hist, mode, exerciseId, '').length > 0;
}
