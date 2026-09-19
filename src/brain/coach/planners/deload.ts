/**
 * An easier week, proposed only when several lifts decline together and
 * effort at the same load is rising or volume just jumped. Never by
 * calendar (deload_evidence).
 */
import { addDays } from '@/core/dates';
import type { Finding, Proposal } from '../contract';
import type { BrainContext } from '../context';
import { DELOAD_LOAD_FACTOR, DELOAD_MIN_DECLINES, DELOAD_MIN_RECENT_SESSIONS } from '../bands';
import { proposal } from './shared';

export function planDeload(ctx: BrainContext, findings: Finding[]): Proposal | null {
  if (findings.some(f => f.kind === 'long_gap')) return null;
  const recent = ctx.sessions.filter(s => s.day >= addDays(ctx.today, -28));
  if (recent.length < DELOAD_MIN_RECENT_SESSIONS) return null;
  const declines = findings.filter(f => f.kind === 'decline' && f.confidence !== 'low');
  const harder = findings.filter(f => f.kind === 'effort_drift_harder');
  const spikes = findings.filter(f => f.kind === 'volume_spike');
  if (declines.length < DELOAD_MIN_DECLINES || (!harder.length && !spikes.length)) return null;
  return proposal({
    kind: 'deload_week', subject: {},
    apply: { kind: 'deload_week', from: ctx.today, to: addDays(ctx.today, 6), loadFactor: DELOAD_LOAD_FACTOR, effortCap: 'ideal' },
    basedOn: [...declines, ...harder, ...spikes].map(f => f.id),
    confidence: declines.length >= 3 ? 'high' : 'medium', expiresOn: addDays(ctx.today, 14),
  });
}
