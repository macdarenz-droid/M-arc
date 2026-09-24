/**
 * The Exercise progress card's trend (QA2-FC-1). Assisted, bodyweight and hold lifts are judged by
 * their mode, as Escobar judges them (less assistance is up). Weighted lifts keep the strength
 * score, with volume for sessions of sets over 10 reps.
 */
import type { ResistanceMode } from '@/core/models';
import type { ExerciseSessionSummary } from '@/brain/history';
import { liftTrend, trend, type Trend } from '@/brain/trend';

export function progressTrend(hist: ExerciseSessionSummary[], mode: ResistanceMode): Trend {
  if (mode === 'assisted' || mode === 'bodyweight' || mode === 'duration') return liftTrend(hist, mode);
  return trend(hist.map(h => ({ day: h.day, value: h.bestE1rm || h.volume })));
}

/**
 * The value the card's sparkline draws, in the same direction as the trend: up is progress. Assisted
 * lifts plot the assistance negated (less help is higher), bodyweight lifts their best reps, holds
 * their longest time. Weighted and conditioning keep the strength score (QA2-FC-1 follow-up).
 */
export function progressValue(h: ExerciseSessionSummary, mode: ResistanceMode): number {
  if (mode === 'assisted') return -h.topKg;
  if (mode === 'bodyweight') return h.bestReps;
  if (mode === 'duration') return h.bestDurationSec;
  return h.bestE1rm || h.topKg || h.bestReps;
}

/** The hint under the card, describing what the trend actually follows for this mode. */
export function progressHint(mode: ResistanceMode): string {
  if (mode === 'assisted') return 'Trend follows the assistance: less help is progress; with the same help, more reps.';
  if (mode === 'bodyweight') return 'Trend follows your best reps.';
  if (mode === 'duration') return 'Trend follows your longest hold.';
  return 'Trend uses an estimated one-rep strength score from sets of 10 reps or fewer. It is a guide, not a test.';
}
