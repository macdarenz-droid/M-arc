import { addDays } from '@/core/dates';
import { isWorkingSet } from '@/brain/exposure';
import type { BrainContext } from '../context';
import type { Finding, MetricValue } from '../contract';
import { weekReview, type WeekReview } from '../review';
import { evidenceFrom, finding } from './shared';

const validDay = (day: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(day)
  && !Number.isNaN(Date.parse(`${day}T00:00:00Z`)) && new Date(`${day}T00:00:00Z`).toISOString().slice(0, 10) === day;

export function detectWeekClose(ctx: BrainContext, supplied: WeekReview | null = weekReview(ctx)): Finding[] {
  if (!supplied) return [];
  const review = supplied;
  const metrics: Record<string, MetricValue> = {
    activeDayCount: review.activeDayCount, workouts: review.workouts, sets: review.sets, volumeKg: review.volumeKg,
    baselineWeeks: review.baselineWeeks, hasBaseline: review.baselineSets !== null, direction: review.direction,
    scheduledDays: review.scheduledDays, alignedDays: review.alignedDays, scheduleBasis: review.scheduleBasis, start: review.start, end: review.end,
  };
  if (review.baselineSets !== null) metrics.baselineSets = review.baselineSets;
  if (review.baselineVolumeKg !== null) metrics.baselineVolumeKg = review.baselineVolumeKg;
  if (review.setsDelta !== null) metrics.setsDelta = review.setsDelta;
  if (review.volumeDeltaKg !== null) metrics.volumeDeltaKg = review.volumeDeltaKg;
  if (review.muscle) Object.assign(metrics, { muscleId: review.muscle.id, muscleSets: review.muscle.sets, muscleBaselineSets: review.muscle.baselineSets, muscleDeltaSets: review.muscle.deltaSets });
  const from = addDays(review.start, -7 * review.baselineWeeks);
  const unique = new Map<string, BrainContext['sessions'][number]>();
  for (const session of ctx.sessions) if (session.id && !unique.has(session.id) && validDay(session.day)
    && session.day >= from && session.day <= review.end && session.exercises.some(entry => entry.sets.some(isWorkingSet))) unique.set(session.id, session);
  const evidence = [...unique.values()].sort((a, b) => a.startedAt.localeCompare(b.startedAt) || a.id.localeCompare(b.id));
  return [finding({ kind: 'week_review', target: review.start, subject: {}, metrics, from: review.start, to: review.end, weeks: review.baselineWeeks + 1, confidence: review.baselineSets === null ? 'low' : 'medium', severity: 0, evidence: evidenceFrom(evidence) })];
}
