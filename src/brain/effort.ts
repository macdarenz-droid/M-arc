/** Is the user's logged effort on an exercise drifting harder or easier? */
import type { ExerciseSessionSummary } from './history';
import { EFFORT_MULT, effortLabel } from './exposure';
import type { Confidence } from './trend';

export interface EffortDrift {
  status: 'harder' | 'easier' | 'stable' | 'unknown';
  delta: number;
  confidence: Confidence;
}

/** AUD-9 OBS-DRIFT: same work = the halves' mean working load within 1 % and mean working reps within one rep. */
export const SAME_WORK = { loadShare: 0.01, reps: 1 } as const;

export function effortDrift(history: ExerciseSessionSummary[]): EffortDrift {
  const recent = history.slice(-6);
  const obs = recent.flatMap((r, i) => r.sets.map(effortLabel).filter(e => e != null).map(e => ({ i, v: EFFORT_MULT[e] })));
  const sessionsWithEffort = new Set(obs.map(o => o.i)).size;
  if (sessionsWithEffort < 4 || obs.length < 8) return { status: 'unknown', delta: 0, confidence: 'low' };
  const mid = Math.floor(recent.length / 2);
  const older = obs.filter(o => o.i < mid), newer = obs.filter(o => o.i >= mid);
  if (older.length < 3 || newer.length < 3) return { status: 'unknown', delta: 0, confidence: 'low' };
  // Effort says something about recovery only at the same work: a planned load or rep step is not drift.
  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const halves = (pick: (r: ExerciseSessionSummary) => number) => [avg(recent.slice(0, mid).map(pick)), avg(recent.slice(mid).map(pick))] as const;
  const [kgA, kgB] = halves(r => r.workKg), [repsA, repsB] = halves(r => r.workReps);
  if (Math.abs(kgB - kgA) > SAME_WORK.loadShare * Math.max(kgA, kgB) || Math.abs(repsB - repsA) >= SAME_WORK.reps) return { status: 'unknown', delta: 0, confidence: 'low' };
  const mean = (xs: { v: number }[]) => xs.reduce((a, b) => a + b.v, 0) / xs.length;
  const delta = mean(newer) - mean(older);
  const confidence: Confidence = sessionsWithEffort >= 6 && obs.length >= 18 ? 'high' : sessionsWithEffort < 5 || obs.length < 10 ? 'low' : 'medium';
  const status = Math.abs(delta) < 0.025 ? 'stable' : delta > 0 ? 'harder' : 'easier';
  return { status, delta, confidence };
}
