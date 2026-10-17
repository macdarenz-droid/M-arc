/**
 * The Exercise progress card's trend (QA2-FC-1). BUG-41: the line, its label and the trend come
 * from one series, the one Escobar judges (progressSeries in brain/trend).
 */
import type { ResistanceMode } from '@/core/models';
import type { ExerciseSessionSummary } from '@/brain/history';
import { progressSeries, type ProgressMetric, type Trend } from '@/brain/trend';

export { progressSeries };

export function progressTrend(hist: ExerciseSessionSummary[], mode: ResistanceMode): Trend {
  return progressSeries(hist, mode).trend;
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
  if (mode === 'conditioning') return h.bestDistanceM || h.bestE1rm || h.topKg || h.bestReps;
  return h.bestE1rm || h.topKg || h.bestReps;
}

const MODE_METRIC: Record<ResistanceMode, ProgressMetric> = { weighted: 'e1rm', conditioning: 'distance', bodyweight: 'reps', duration: 'hold', assisted: 'assist' };

const HINT: Record<ProgressMetric, string> = {
  e1rm: 'Estimated one-rep max', top: 'Top load', volume: 'Volume', distance: 'Farthest distance',
  assist: 'Less assistance', reps: 'Best reps', hold: 'Longest hold',
};

/** The label under the card's line: the metric it plots (COPY-1: a label, no explanation). */
export function progressHint(mode: ResistanceMode, metric: ProgressMetric = MODE_METRIC[mode]): string {
  return HINT[metric];
}
