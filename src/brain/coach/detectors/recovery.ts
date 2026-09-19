/**
 * Muscle recovery with the session's volume taken into account. The base
 * window comes from effort (24/48/72 h) and the user's own short-rest
 * history; a session much bigger than the muscle's usual widens it, up to
 * 1.5×. Nothing ever shrinks it. Rests on recovery_time_course.
 */
import type { MuscleId } from '@/data/muscles';
import { MUSCLE_BY_ID } from '@/data/muscles';
import { muscleTouches, recoveryStatus, type MuscleRecovery } from '../../recovery';
import type { Finding } from '../contract';
import type { BrainContext } from '../context';
import { RECOVERY_FLAG_PCT, RECOVERY_VOLUME_FACTOR_MAX } from '../bands';
import { finding, median, round2 } from './shared';

export interface AdjustedRecovery extends MuscleRecovery {
  volumeFactor: number;
  adjustedWindowHours: number;
  adjustedPct: number;
  adjustedHoursLeft: number;
}

export function adjustedRecovery(ctx: BrainContext): AdjustedRecovery[] {
  const base = recoveryStatus(ctx.sessions, ctx.custom, ctx.now);
  const touches = muscleTouches(ctx.sessions, ctx.custom);
  return base.map(r => {
    if (!r.lastDay || !r.lastTrainedAt) return { ...r, volumeFactor: 1, adjustedWindowHours: r.windowHours, adjustedPct: r.pct, adjustedHoursLeft: r.hoursLeft };
    const list = touches[r.muscle];
    const lastSets = list.filter(t => t.day === r.lastDay).reduce((a, t) => a + t.sets, 0);
    const priorByDay = new Map<string, number>();
    for (const t of list) if (t.day !== r.lastDay) priorByDay.set(t.day, (priorByDay.get(t.day) ?? 0) + t.sets);
    const priors = [...priorByDay.values()].slice(-12);
    let factor = 1;
    if (priors.length >= 3) {
      const usual = median(priors);
      if (usual > 0) factor = Math.min(RECOVERY_VOLUME_FACTOR_MAX, Math.max(1, lastSets / usual));
    }
    const window = r.windowHours * factor;
    const elapsed = (ctx.now - new Date(r.lastTrainedAt).getTime()) / 3_600_000;
    const pct = Math.max(0, Math.min(100, Math.round((elapsed / window) * 100)));
    return { ...r, volumeFactor: round2(factor), adjustedWindowHours: Math.round(window), adjustedPct: pct, adjustedHoursLeft: Math.max(0, window - elapsed) };
  });
}

export function detectUnderRecovered(ctx: BrainContext, recovery = adjustedRecovery(ctx)): Finding[] {
  const out: Finding[] = [];
  for (const r of recovery) {
    if (!r.lastDay || r.adjustedPct >= RECOVERY_FLAG_PCT) continue;
    const session = ctx.sessions.filter(s => s.day === r.lastDay);
    out.push(finding({
      kind: 'under_recovered', target: r.muscle,
      subject: { muscle: r.muscle as MuscleId, muscleGroup: MUSCLE_BY_ID[r.muscle].group },
      metrics: {
        pct: r.adjustedPct, hoursLeft: Math.round(r.adjustedHoursLeft), windowHours: r.adjustedWindowHours,
        baseWindowHours: r.windowHours, volumeFactor: r.volumeFactor, personalized: r.personalized, lastDay: r.lastDay,
      },
      from: r.lastDay, to: ctx.today,
      confidence: r.personalized ? 'high' : 'medium',
      severity: r.adjustedPct < 50 ? 2 : 1,
      evidence: { sessionIds: session.map(s => s.id), days: [r.lastDay] },
    }));
  }
  return out;
}
