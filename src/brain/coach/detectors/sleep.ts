/** Short sleep from Health Connect, only when a reading exists for today. */
import { dayKey } from '@/core/dates';
import type { Finding } from '../contract';
import type { BrainContext } from '../context';
import { SLEEP_SHORT_MINUTES } from '../bands';
import { finding } from './shared';

export function detectSleep(ctx: BrainContext): Finding[] {
  const h = ctx.health;
  if (!h.connected || h.sleepMinutes == null || !h.lastSync) return [];
  if (dayKey(h.lastSync) !== ctx.today) return [];
  if (h.sleepMinutes >= SLEEP_SHORT_MINUTES) return [];
  return [finding({
    kind: 'low_sleep_readiness', target: ctx.today, subject: {},
    metrics: { sleepMinutes: Math.round(h.sleepMinutes), thresholdMinutes: SLEEP_SHORT_MINUTES, sleepHours: Math.round(h.sleepMinutes / 6) / 10 },
    from: ctx.today, to: ctx.today, confidence: 'medium', severity: 1, evidence: { sessionIds: [], days: [] },
  })];
}
