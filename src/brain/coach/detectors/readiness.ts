/**
 * A pattern of low morning check-ins (subjective_readiness_monitoring).
 * Both the pattern and the immediate recovery adjustment read against the
 * person's own 28-day baseline when one exists.
 */
import { daysBetween } from '@/core/dates';
import { readinessAvg, readinessToday } from '../../readiness';
import type { Finding } from '../contract';
import type { BrainContext } from '../context';
import { READINESS_PATTERN_MIN_LOW, READINESS_PATTERN_WINDOW_DAYS } from '../bands';
import { finding, round1 } from './shared';

export function detectReadiness(ctx: BrainContext): Finding[] {
  const r = readinessToday(ctx.readiness, ctx.today);
  if (!r || (r.verdict !== 'red' && r.verdict !== 'amber')) return [];
  const trailingByDay = new Map(ctx.readiness
    .filter(x => readinessToday([x], x.day) && x.day < ctx.today && daysBetween(x.day, ctx.today) <= READINESS_PATTERN_WINDOW_DAYS)
    .map(x => [x.day, x]));
  const trailing = [...trailingByDay.values()];
  const lowCount = 1 + trailing.filter(x => round1(readinessAvg(x)) <= r.lowLine).length;
  if (lowCount < READINESS_PATTERN_MIN_LOW) return [];
  return [finding({
    kind: 'low_readiness', target: ctx.today, subject: {},
    metrics: {
      avg: round1(readinessAvg(r.entry)), sleep: r.entry.sleep, soreness: r.entry.soreness, stress: r.entry.stress,
      thresholdAvg: r.lowLine, lowCheckIns: lowCount, personalized: r.personalized, verdict: r.verdict,
      ...(r.baseline ? { baselineAvg: r.baseline.avg.median, baselineEntries: r.baseline.entries, deltaFromBaseline: r.delta ?? 0, z: r.z ?? 0 } : {}),
      ...(r.worst ? { worstDimension: r.worst.dimension, worstValue: r.worst.value, worstMedian: r.worst.median } : {}),
    },
    from: ctx.today, to: ctx.today, confidence: 'medium', severity: 1,
    evidence: { sessionIds: [], days: [ctx.today] },
  })];
}
