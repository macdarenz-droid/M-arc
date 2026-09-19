/**
 * Muscle recovery with the session's volume taken into account. The base
 * window comes from effort (24/48/72 h) and the user's own short-rest
 * history; a session much bigger than the muscle's usual widens it, up to
 * 1.5×. Nothing ever shrinks it. Rests on recovery_time_course.
 */
import type { Session } from '@/core/models';
import type { MuscleId } from '@/data/muscles';
import { MUSCLE_BY_ID } from '@/data/muscles';
import { muscleTouches, recoveryStatus, type MuscleRecovery } from '../../recovery';
import type { Finding } from '../contract';
import type { BrainContext } from '../context';
import { FATIGUE_RECOVERY_FACTOR, READINESS_LOW_AVG, READINESS_RECOVERY_FACTOR_MAX, RECOVERY_FLAG_PCT, RECOVERY_VOLUME_FACTOR_MAX } from '../bands';
import { finding, median, round2 } from './shared';

export interface AdjustedRecovery extends MuscleRecovery {
  volumeFactor: number;
  readinessFactor: number;
  fatigueFactor: number;
  adjustedWindowHours: number;
  adjustedPct: number;
  adjustedHoursLeft: number;
}

function readinessAvg(e: { sleep: number; soreness: number; stress: number }): number {
  return (e.sleep + e.soreness + e.stress) / 3;
}

/**
 * How much today's own check-in, if any, widens every muscle's recovery
 * window — the same idea as the volume factor: only ever widens, never
 * shrinks. Linear between a full check-in (factor 1) and the worst
 * possible one (READINESS_RECOVERY_FACTOR_MAX).
 */
export function readinessFactor(ctx: BrainContext): number {
  const entry = ctx.readiness.find(r => r.day === ctx.today);
  if (!entry) return 1;
  const avg = readinessAvg(entry);
  if (avg >= READINESS_LOW_AVG) return 1;
  const t = (READINESS_LOW_AVG - avg) / (READINESS_LOW_AVG - 1);
  return round2(1 + t * (READINESS_RECOVERY_FACTOR_MAX - 1));
}

/**
 * True when a session logged that day was tagged "fatigue" in a way that
 * touches this muscle — either the flag named no muscle (a whole-session
 * note like "felt gassed today" widens recovery for everything trained
 * that day) or named this muscle specifically.
 */
function fatigueFlaggedOn(sessions: Session[], day: string, muscle: MuscleId): boolean {
  return sessions.some(s => s.day === day && s.noteFlags?.some(f => f.kind === 'fatigue' && (f.muscle === null || f.muscle === muscle)));
}

export function adjustedRecovery(ctx: BrainContext): AdjustedRecovery[] {
  const base = recoveryStatus(ctx.sessions, ctx.custom, ctx.now);
  const touches = muscleTouches(ctx.sessions, ctx.custom);
  const rFactor = readinessFactor(ctx);
  return base.map(r => {
    if (!r.lastDay || !r.lastTrainedAt) return { ...r, volumeFactor: 1, readinessFactor: rFactor, fatigueFactor: 1, adjustedWindowHours: r.windowHours, adjustedPct: r.pct, adjustedHoursLeft: r.hoursLeft };
    const list = touches[r.muscle];
    const lastSets = list.filter(t => t.day === r.lastDay).reduce((a, t) => a + t.sets, 0);
    const priorByDay = new Map<string, number>();
    for (const t of list) if (t.day !== r.lastDay) priorByDay.set(t.day, (priorByDay.get(t.day) ?? 0) + t.sets);
    const priors = [...priorByDay.values()].slice(-12);
    let volumeFactor = 1;
    if (priors.length >= 3) {
      const usual = median(priors);
      if (usual > 0) volumeFactor = Math.min(RECOVERY_VOLUME_FACTOR_MAX, Math.max(1, lastSets / usual));
    }
    const fFactor = fatigueFlaggedOn(ctx.sessions, r.lastDay, r.muscle) ? FATIGUE_RECOVERY_FACTOR : 1;
    const factor = Math.min(RECOVERY_VOLUME_FACTOR_MAX, Math.max(volumeFactor, rFactor, fFactor));
    const window = r.windowHours * factor;
    const elapsed = (ctx.now - new Date(r.lastTrainedAt).getTime()) / 3_600_000;
    const pct = Math.max(0, Math.min(100, Math.round((elapsed / window) * 100)));
    return { ...r, volumeFactor: round2(volumeFactor), readinessFactor: round2(rFactor), fatigueFactor: round2(fFactor), adjustedWindowHours: Math.round(window), adjustedPct: pct, adjustedHoursLeft: Math.max(0, window - elapsed) };
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
        baseWindowHours: r.windowHours, volumeFactor: r.volumeFactor, readinessFactor: r.readinessFactor, fatigueFactor: r.fatigueFactor, personalized: r.personalized, lastDay: r.lastDay,
      },
      from: r.lastDay, to: ctx.today,
      confidence: r.personalized ? 'high' : 'medium',
      severity: r.adjustedPct < 50 ? 2 : 1,
      evidence: { sessionIds: session.map(s => s.id), days: [r.lastDay] },
    }));
  }
  return out;
}
