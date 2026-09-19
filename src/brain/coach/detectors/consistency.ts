/** Gaps and the very beginning. */
import { daysSinceLastSession } from '../../weekly';
import type { Finding } from '../contract';
import type { BrainContext } from '../context';
import { FIRST_SESSIONS_COUNT, LONG_GAP_DAYS, REENTRY_GAP_DAYS } from '../bands';
import { evidenceFrom, finding } from './shared';

export function detectGap(ctx: BrainContext): Finding[] {
  const gap = daysSinceLastSession(ctx.sessions, ctx.today);
  if (gap == null || gap < LONG_GAP_DAYS) return [];
  const last = ctx.sessions[ctx.sessions.length - 1]!;
  return [finding({
    kind: 'long_gap', target: 'last', subject: {},
    metrics: { days: gap, reentry: gap > REENTRY_GAP_DAYS, lastDay: last.day },
    from: last.day, to: ctx.today, confidence: 'high', severity: 1, evidence: evidenceFrom([last]),
  })];
}

export function detectFirstSessions(ctx: BrainContext): Finding[] {
  if (ctx.sessions.length >= FIRST_SESSIONS_COUNT) return [];
  return [finding({
    kind: 'first_sessions', target: 'baseline', subject: {},
    metrics: { sessions: ctx.sessions.length, needed: FIRST_SESSIONS_COUNT },
    from: ctx.sessions[0]?.day ?? ctx.today, to: ctx.today, confidence: 'high', severity: 0,
    evidence: evidenceFrom(ctx.sessions),
  })];
}
