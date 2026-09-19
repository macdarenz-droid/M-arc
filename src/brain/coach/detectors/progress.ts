/**
 * Per-exercise progress: plateau, decline, progressing, and records.
 * Wraps the existing trend and records engines and exposes them as facts.
 */
import { exerciseHistory } from '../../history';
import { plateauStatus, trend } from '../../trend';
import { recordsInWeek } from '../../prs';
import type { Finding } from '../contract';
import type { BrainContext } from '../context';
import { finding, loggedExercises, round2 } from './shared';

export function detectProgress(ctx: BrainContext): Finding[] {
  const out: Finding[] = [];
  for (const { id, name } of loggedExercises(ctx.sessions)) {
    const hist = exerciseHistory(ctx.sessions, id, ctx.custom);
    const p = plateauStatus(hist);
    if (p.status === 'unknown') continue;
    const recent = hist.slice(-8);
    const first = recent[0]!, last = recent[recent.length - 1]!;
    const kind = p.status === 'plateaued' ? 'plateau' : p.status === 'declining' ? 'decline' : 'progressing';
    if (kind !== 'progressing' && p.confidence === 'low') continue;
    if (kind === 'progressing' && p.confidence === 'low') continue;
    const loadTrend = trend(recent.map(r => ({ day: r.day, value: r.topKg })));
    const volumeTrend = trend(recent.map(r => ({ day: r.day, value: r.volume })));
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
      },
      from: first.day, to: last.day, sessions: recent.length,
      confidence: p.confidence,
      severity: kind === 'decline' ? 2 : kind === 'plateau' ? 1 : 0,
      evidence: { sessionIds: [...ids], days: recent.map(r => r.day) },
    }));
  }
  return out;
}

export function detectRecords(ctx: BrainContext): Finding[] {
  return recordsInWeek(ctx.sessions, ctx.today, ctx.custom).map(r => {
    const session = ctx.sessions.find(s => s.day === r.day && s.exercises.some(e => e.exerciseId === r.exerciseId));
    return finding({
      kind: 'record', target: `${r.exerciseId}:${r.kind}:${r.day}`,
      subject: { exerciseId: r.exerciseId, exerciseName: r.exerciseName },
      metrics: { recordKind: r.kind, value: round2(r.value), previous: round2(r.previous), detail: r.detail },
      from: r.day, to: r.day, sessions: 1, confidence: 'high', severity: 0,
      evidence: { sessionIds: session ? [session.id] : [], days: [r.day] },
    });
  });
}
