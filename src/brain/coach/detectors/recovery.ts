/**
 * Muscle recovery with volume, readiness and fatigue widening the base
 * window. Factors combine by maximum and never shrink recovery time.
 */
import type { Session } from '@/core/models';
import type { MuscleId } from '@/data/muscles';
import { MUSCLE_BY_ID } from '@/data/muscles';
import { muscleTouches, recoveryStatus, type MuscleRecovery } from '../../recovery';
import { readinessToday, type ReadinessVerdict } from '../../readiness';
import type { Finding } from '../contract';
import type { BrainContext } from '../context';
import { FATIGUE_RECOVERY_FACTOR, READINESS_RECOVERY_FACTOR_AMBER, READINESS_RECOVERY_FACTOR_MAX, RECOVERY_FLAG_PCT, RECOVERY_VOLUME_FACTOR_MAX } from '../bands';
import { finding, median, round2 } from './shared';

export interface AdjustedRecovery extends MuscleRecovery {
  volumeFactor: number;
  readinessFactor: number;
  fatigueFactor: number;
  adjustedWindowHours: number;
  adjustedPct: number;
  adjustedHoursLeft: number;
  pctWithoutReadiness: number;
  windowHoursWithoutReadiness: number;
  readinessPersonalized: boolean;
}

export interface ReadinessAdjustment { factor: number; verdict: ReadinessVerdict | null; personalized: boolean }

/** Today's check-in as a recovery-window multiplier, in three widen-only steps. */
export function readinessAdjustment(ctx: BrainContext): ReadinessAdjustment {
  const readiness = readinessToday(ctx.readiness, ctx.today);
  if (!readiness) return { factor: 1, verdict: null, personalized: false };
  const factor = readiness.verdict === 'red' ? READINESS_RECOVERY_FACTOR_MAX
    : readiness.verdict === 'amber' ? READINESS_RECOVERY_FACTOR_AMBER : 1;
  return { factor, verdict: readiness.verdict, personalized: readiness.personalized };
}

/** Kept as the narrow public entry point existing callers use. */
export function readinessFactor(ctx: BrainContext): number { return readinessAdjustment(ctx).factor; }

function fatigueFlaggedOn(sessions: Session[], day: string, muscle: MuscleId): boolean {
  return sessions.some(s => s.day === day && s.noteFlags?.some(f => f.kind === 'fatigue' && (f.muscle === null || f.muscle === muscle)));
}

export function adjustedRecovery(ctx: BrainContext): AdjustedRecovery[] {
  const base = recoveryStatus(ctx.sessions, ctx.custom, ctx.now);
  const touches = muscleTouches(ctx.sessions, ctx.custom);
  const ra = readinessAdjustment(ctx);
  const rFactor = ra.factor;
  return base.map(r => {
    if (!r.lastDay || !r.lastTrainedAt) return {
      ...r, volumeFactor: 1, readinessFactor: rFactor, fatigueFactor: 1,
      adjustedWindowHours: r.windowHours, adjustedPct: r.pct, adjustedHoursLeft: r.hoursLeft,
      pctWithoutReadiness: r.pct, windowHoursWithoutReadiness: r.windowHours,
      readinessPersonalized: ra.personalized,
    };
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
    const elapsed = (ctx.now - new Date(r.lastTrainedAt).getTime()) / 3_600_000;
    const factorWithout = Math.min(RECOVERY_VOLUME_FACTOR_MAX, Math.max(volumeFactor, fFactor));
    const windowWithout = r.windowHours * factorWithout;
    const pctWithout = Math.max(0, Math.min(100, Math.round((elapsed / windowWithout) * 100)));
    const window = r.windowHours * factor;
    const pct = Math.max(0, Math.min(100, Math.round((elapsed / window) * 100)));
    return {
      ...r, volumeFactor: round2(volumeFactor), readinessFactor: round2(rFactor), fatigueFactor: round2(fFactor),
      adjustedWindowHours: Math.round(window), adjustedPct: pct, adjustedHoursLeft: Math.max(0, window - elapsed),
      pctWithoutReadiness: pctWithout, windowHoursWithoutReadiness: Math.round(windowWithout),
      readinessPersonalized: ra.personalized,
    };
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
        baseWindowHours: r.windowHours, volumeFactor: r.volumeFactor, readinessFactor: r.readinessFactor,
        fatigueFactor: r.fatigueFactor, readinessPersonalized: r.readinessPersonalized,
        personalized: r.personalized, lastDay: r.lastDay,
      },
      from: r.lastDay, to: ctx.today,
      confidence: r.personalized ? 'high' : 'medium',
      severity: r.adjustedPct < 50 ? 2 : 1,
      evidence: { sessionIds: session.map(s => s.id), days: [r.lastDay] },
    }));
  }
  return out;
}
