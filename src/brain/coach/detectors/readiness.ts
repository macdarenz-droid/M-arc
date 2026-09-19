/**
 * A pattern of low morning check-ins (subjective_readiness_monitoring): a
 * single low reading correlates weakly with anything on its own, so this
 * only speaks once several of the trailing check-ins, today's included,
 * came back low. Widening today's recovery windows from a single check-in
 * is a separate, more immediate use of the same data — see
 * detectors/recovery.ts's readinessFactor.
 */
import { daysBetween } from '@/core/dates';
import type { Finding } from '../contract';
import type { BrainContext } from '../context';
import { READINESS_LOW_AVG, READINESS_PATTERN_MIN_LOW, READINESS_PATTERN_WINDOW_DAYS } from '../bands';
import { finding, round1 } from './shared';

function avg(e: { sleep: number; soreness: number; stress: number }): number {
  return (e.sleep + e.soreness + e.stress) / 3;
}

export function detectReadiness(ctx: BrainContext): Finding[] {
  const today = ctx.readiness.find(r => r.day === ctx.today);
  if (!today || avg(today) > READINESS_LOW_AVG) return [];
  const trailing = ctx.readiness.filter(r => r.day !== ctx.today && daysBetween(r.day, ctx.today) <= READINESS_PATTERN_WINDOW_DAYS);
  const lowCount = 1 + trailing.filter(r => avg(r) <= READINESS_LOW_AVG).length;
  if (lowCount < READINESS_PATTERN_MIN_LOW) return [];
  return [finding({
    kind: 'low_readiness', target: ctx.today, subject: {},
    metrics: { avg: round1(avg(today)), sleep: today.sleep, soreness: today.soreness, stress: today.stress, thresholdAvg: READINESS_LOW_AVG, lowCheckIns: lowCount },
    from: ctx.today, to: ctx.today, confidence: 'medium', severity: 1,
    evidence: { sessionIds: [], days: [ctx.today] },
  })];
}
