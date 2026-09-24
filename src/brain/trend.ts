/** Recency-weighted trend and plateau detection over an exercise's history. */
import type { ExerciseSessionSummary } from './history';
import type { ResistanceMode } from '@/core/models';
import { daysBetween } from '@/core/dates';

export type Direction = 'up' | 'flat' | 'down' | 'unknown';
export type Confidence = 'low' | 'medium' | 'high';

export interface Trend {
  direction: Direction;
  /** Relative change per week as a fraction, e.g. 0.02 = 2% per week. */
  slopePerWeek: number;
  confidence: Confidence;
  points: number;
}

export function trend(points: Array<{ day: string; value: number }>): Trend {
  const usable = points.filter(p => Number.isFinite(p.value) && p.value > 0);
  if (usable.length < 4) return { direction: 'unknown', slopePerWeek: 0, confidence: 'low', points: usable.length };
  const t0 = new Date(usable[0]!.day).getTime();
  const xs = usable.map(p => (new Date(p.day).getTime() - t0) / (7 * 86_400_000));
  const ys = usable.map(p => p.value);
  const n = usable.length;
  const ws = usable.map((_, i) => 0.5 + (i / Math.max(1, n - 1)));
  const sw = ws.reduce((a, b) => a + b, 0);
  const mx = xs.reduce((a, x, i) => a + x * ws[i]!, 0) / sw;
  const my = ys.reduce((a, y, i) => a + y * ws[i]!, 0) / sw;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += ws[i]! * (xs[i]! - mx) * (ys[i]! - my); den += ws[i]! * (xs[i]! - mx) ** 2; }
  const slope = den ? num / den : 0;
  const rel = my ? slope / my : 0;
  const direction: Direction = Math.abs(rel) < 0.01 ? 'flat' : rel > 0 ? 'up' : 'down';
  const confidence: Confidence = n >= 12 ? 'high' : n > 6 ? 'medium' : 'low';
  return { direction, slopePerWeek: rel, confidence, points: n };
}

/**
 * QA-R3a-2: the trend of what counts as progress for the lift's mode. Weighted: the strength
 * estimate (or top load). Bodyweight: best reps. Duration: longest hold. Assisted: the assistance
 * load, with the direction inverted (less help is up); with it flat, the best reps, as in plateauStatus.
 */
export function liftTrend(history: ExerciseSessionSummary[], mode: ResistanceMode = 'weighted'): Trend {
  const recent = history.slice(-12);
  if (mode === 'bodyweight') return trend(recent.map(h => ({ day: h.day, value: h.bestReps })));
  if (mode === 'duration') return trend(recent.map(h => ({ day: h.day, value: h.bestDurationSec })));
  if (mode === 'assisted') {
    // QA2-FC-4: not the e1RM of the assistance, which rises with more reps and would read as down.
    const help = trend(recent.map(h => ({ day: h.day, value: h.topKg })));
    if (help.direction === 'up' || help.direction === 'down') return { ...help, direction: help.direction === 'up' ? 'down' : 'up', slopePerWeek: -help.slopePerWeek };
    const reps = trend(recent.map(h => ({ day: h.day, value: h.bestReps })));
    return reps.direction === 'unknown' && help.direction === 'flat' ? help : reps;
  }
  return trend(recent.map(h => ({ day: h.day, value: h.bestE1rm || h.topKg })));
}

export type PlateauStatus = 'progressing' | 'plateaued' | 'declining' | 'unknown';

/** Looks at the last 8 sessions. Needs at least 7 to say anything. */
/** Plateau status looks at this many recent sessions and needs at least PLATEAU_MIN_SESSIONS. */
export const PLATEAU_WINDOW = 8;
export const PLATEAU_MIN_SESSIONS = 7;

/**
 * For an assisted exercise (BR-06) less weight is progress: the weight direction is inverted,
 * and with the weight flat the best reps break the tie (volume would reward more assistance).
 */
/** A break longer than this starts the lift's history over for plateau and trend (QA-R3a-6). */
export const COMEBACK_GAP_DAYS = 28;

/** The sessions since the last break longer than COMEBACK_GAP_DAYS: a comeback is not judged on months-old sessions. */
export function sinceLastBreak<T extends { day: string }>(history: T[]): T[] {
  for (let i = history.length - 1; i > 0; i--) {
    if (daysBetween(history[i - 1]!.day, history[i]!.day) > COMEBACK_GAP_DAYS) return history.slice(i);
  }
  return history;
}

export function plateauStatus(history: ExerciseSessionSummary[], mode: ResistanceMode = 'weighted'): { status: PlateauStatus; confidence: Confidence } {
  const recent = sinceLastBreak(history).slice(-PLATEAU_WINDOW);
  if (recent.length < PLATEAU_MIN_SESSIONS) return { status: 'unknown', confidence: 'low' };
  if (mode === 'assisted') {
    const w = trend(recent.map(r => ({ day: r.day, value: r.topKg })));
    const reps = trend(recent.map(r => ({ day: r.day, value: r.bestReps })));
    const conf = w.confidence === 'low' ? reps.confidence : w.confidence;
    const tie = reps.direction === 'up' ? 'progressing' : reps.direction === 'down' ? 'declining' : 'plateaued';
    if (w.direction === 'down') return { status: 'progressing', confidence: conf };
    if (w.direction === 'up') return { status: 'declining', confidence: conf };
    return { status: tie, confidence: conf };
  }
  const weight = trend(recent.map(r => ({ day: r.day, value: r.topKg })));
  const volume = trend(recent.map(r => ({ day: r.day, value: r.volume })));
  const conf = weight.confidence === 'low' ? volume.confidence : weight.confidence;
  if (weight.direction === 'unknown') {
    if (volume.direction === 'up') return { status: 'progressing', confidence: conf };
    if (volume.direction === 'down') return { status: 'declining', confidence: conf };
    return { status: 'plateaued', confidence: conf };
  }
  if (weight.direction === 'up') return { status: 'progressing', confidence: conf };
  if (weight.direction === 'flat' && volume.direction === 'up') return { status: 'progressing', confidence: conf };
  if (weight.direction === 'flat') return { status: 'plateaued', confidence: conf };
  return { status: 'declining', confidence: conf };
}
