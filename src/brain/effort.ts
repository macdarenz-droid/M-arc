/**
 * Is the user's logged effort on an exercise drifting harder or easier?
 * The newer half of the last six sessions is compared with the older half.
 * A drift needs at least two of three newer sessions to move a level, so one
 * hard day is not a trend.
 */
import type { ExerciseSessionSummary } from './history';
import { EFFORT_MULT } from './exposure';
import type { Confidence } from './trend';

export interface EffortDrift {
  status: 'harder' | 'easier' | 'stable' | 'unknown';
  delta: number;
  confidence: Confidence;
}

/** Two of three sessions one level harder shifts the mean by about 0.067; one session by 0.033. */
export const DRIFT_THRESHOLD = 0.05;

export function effortDrift(history: ExerciseSessionSummary[]): EffortDrift {
  const recent = history.slice(-6);
  const obs = recent.flatMap((r, i) => r.sets.filter(s => s.effort).map(s => ({ i, v: EFFORT_MULT[s.effort!] })));
  const sessionsWithEffort = new Set(obs.map(o => o.i)).size;
  if (sessionsWithEffort < 4 || obs.length < 8) return { status: 'unknown', delta: 0, confidence: 'low' };
  const mid = Math.floor(recent.length / 2);
  const older = obs.filter(o => o.i < mid), newer = obs.filter(o => o.i >= mid);
  if (older.length < 3 || newer.length < 3) return { status: 'unknown', delta: 0, confidence: 'low' };
  const mean = (xs: { v: number }[]) => xs.reduce((a, b) => a + b.v, 0) / xs.length;
  const delta = mean(newer) - mean(older);
  const confidence: Confidence = sessionsWithEffort >= 6 && obs.length >= 18 ? 'high' : sessionsWithEffort < 5 || obs.length < 10 ? 'low' : 'medium';
  const status = Math.abs(delta) < DRIFT_THRESHOLD ? 'stable' : delta > 0 ? 'harder' : 'easier';
  return { status, delta, confidence };
}
