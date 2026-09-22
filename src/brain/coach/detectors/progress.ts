/**
 * Per-exercise progress: plateau, decline, progressing, and records.
 * Wraps the existing trend and records engines and exposes them as facts.
 */
import { exerciseHistory } from '../../history';
import { plateauStatus, trend } from '../../trend';
import { recordsInWeek } from '../../prs';
import { liftTrajectory } from '../../trajectory';
import type { Finding } from '../contract';
import type { BrainContext } from '../context';
import { deloadActive } from '../deload';
import { finding, loggedExercises, median, round2 } from './shared';
import type { ExerciseSessionSummary } from '../../history';

/**
 * How many trailing sessions since the last personal best, and how long a
 * flat stretch this person needs before it counts as a stall: one and a half
 * times their usual gap between improvements, never under four sessions.
 */
export function flatTail(hist: ExerciseSessionSummary[]): { tail: number; minTail: number; usualStep: number } {
  const perf = hist.map(h => (h.bestE1rm > 0 ? h.bestE1rm : h.topKg > 0 ? h.topKg * (1 + h.topReps / 30) : h.bestReps));
  let best = -Infinity;
  const improvements: number[] = [];
  perf.forEach((v, i) => { if (v > best + 1e-9) { best = v; improvements.push(i); } });
  const lastImprovement = improvements[improvements.length - 1] ?? 0;
  const gaps = improvements.slice(1).map((v, i) => v - improvements[i]!).filter(g => g > 0);
  const usualStep = gaps.length >= 2 ? Math.max(1, Math.round(median(gaps))) : 3;
  return { tail: hist.length - lastImprovement, minTail: Math.max(4, Math.ceil(1.5 * usualStep)), usualStep };
}

export function detectProgress(ctx: BrainContext): Finding[] {
  const out: Finding[] = [];
  for (const { id, name } of loggedExercises(ctx.sessions)) {
    const hist = exerciseHistory(ctx.sessions, id, ctx.custom);
    const p = plateauStatus(hist);
    if (p.status === 'unknown') continue;
    const recent = hist.slice(-8);
    const first = recent[0]!, last = recent[recent.length - 1]!;
    const kind = p.status === 'plateaued' ? 'plateau' : p.status === 'declining' ? 'decline' : 'progressing';
    if (p.confidence === 'low') continue;
    const { tail, minTail, usualStep } = flatTail(hist);
    if (kind === 'plateau' && tail < minTail) continue;
    const loadTrend = trend(recent.map(r => ({ day: r.day, value: r.topKg })));
    const volumeTrend = trend(recent.map(r => ({ day: r.day, value: r.volume })));
    const trajectory = kind === 'progressing' && !deloadActive(ctx.deload, ctx.today) ? liftTrajectory(ctx.sessions, id, ctx.today, ctx.custom) : null;
    const ids = new Set(recent.map(r => r.sessionId));
    out.push(finding({
      kind, target: id, subject: { exerciseId: id, exerciseName: name },
      metrics: {
        sessions: recent.length,
        firstTopKg: first.topKg, lastTopKg: last.topKg,
        firstTopReps: first.topReps, lastTopReps: last.topReps,
        firstBestReps: first.bestReps, lastBestReps: last.bestReps,
        firstVolume: Math.round(first.volume), lastVolume: Math.round(last.volume),
        loadSlopePerWeek: round2(loadTrend.slopePerWeek), volumeSlopePerWeek: round2(volumeTrend.slopePerWeek),
        flatSessions: tail, usualStepEvery: usualStep,
        ...(trajectory?.status === 'projected' ? {
          trajectoryKgPerWeek: trajectory.kgPerWeek,
          trajectoryCurrentKg: trajectory.currentKg,
          trajectoryStepKg: trajectory.stepKg,
          trajectoryNextKg: trajectory.nextKg,
          trajectoryPoints: trajectory.points,
          trajectoryProjectedOn: trajectory.projectedOn,
          trajectoryExpiresOn: trajectory.expiresOn,
        } : {}),
      },
      from: first.day, to: last.day, sessions: recent.length,
      confidence: p.confidence,
      severity: kind === 'decline' ? 2 : kind === 'plateau' ? 1 : 0,
      evidence: { sessionIds: [...ids], days: recent.map(r => r.day) },
    }));
  }
  return out;
}

const RECORD_RANK: Record<string, number> = { heaviest: 0, strength: 1, reps_at_load: 2, best_reps: 3, best_duration: 4, best_distance: 5 };

/** One finding per exercise per week: the most significant record, with a count of the others. */
export function detectRecords(ctx: BrainContext): Finding[] {
  const byExercise = new Map<string, ReturnType<typeof recordsInWeek>>();
  for (const r of recordsInWeek(ctx.sessions, ctx.today, ctx.custom)) byExercise.set(r.exerciseId, [...(byExercise.get(r.exerciseId) ?? []), r]);
  const out: Finding[] = [];
  for (const [exerciseId, list] of byExercise) {
    const r = [...list].sort((a, b) => (RECORD_RANK[a.kind] ?? 9) - (RECORD_RANK[b.kind] ?? 9) || b.day.localeCompare(a.day))[0]!;
    const days = [...new Set(list.map(x => x.day))].sort();
    const sessions = ctx.sessions.filter(s => days.includes(s.day) && s.exercises.some(e => e.exerciseId === exerciseId));
    out.push(finding({
      kind: 'record', target: `${exerciseId}:week`,
      subject: { exerciseId, exerciseName: r.exerciseName },
      metrics: { recordKind: r.kind, value: round2(r.value), previous: round2(r.previous), detail: r.detail, day: r.day, recordsThisWeek: list.length },
      from: days[0]!, to: days[days.length - 1]!, sessions: days.length, confidence: 'high', severity: 0,
      evidence: { sessionIds: sessions.map(s => s.id), days },
    }));
  }
  return out;
}
