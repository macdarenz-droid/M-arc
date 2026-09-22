/** Repeated gaps between an exercise expected in a split and saved working sets. */
import type { Session } from '@/core/models';
import { findExercise } from '@/core/exercises';
import { addDays } from '@/core/dates';
import { isWorkingSet } from '@/brain/exposure';
import type { BrainContext } from '../context';
import type { Finding } from '../contract';
import { SKIP_LOOKBACK_DAYS, SKIP_MAX_FINDINGS, SKIP_MIN_MISSING, SKIP_WINDOW_SESSIONS } from '../bands';
import { evidenceFrom, finding } from './shared';

export interface SkipEvidence {
  splitId: string;
  exerciseId: string;
  basis: 'saved_plan' | 'current_template';
  sessions: number;
  missingSessions: number;
  from: string;
  to: string;
  sessionIds: string[];
  missingSessionIds: string[];
}

const validDay = (day: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(day)
  && !Number.isNaN(Date.parse(`${day}T00:00:00Z`))
  && new Date(`${day}T00:00:00Z`).toISOString().slice(0, 10) === day;

const hasWork = (session: Session): boolean => session.exercises.some(entry => entry.sets.some(isWorkingSet));

function resolvedWorkingIds(session: Session, ctx: BrainContext): Set<string> {
  const ids = new Set<string>();
  for (const logged of session.exercises) {
    if (!logged.sets.some(isWorkingSet)) continue;
    const exercise = findExercise(logged.exerciseId, ctx.custom) ?? findExercise(logged.name, ctx.custom);
    if (exercise) ids.add(exercise.id);
  }
  return ids;
}

function recentSplitSessions(ctx: BrainContext, splitId: string): Session[] {
  const from = addDays(ctx.today, -SKIP_LOOKBACK_DAYS);
  const unique = new Map<string, Session>();
  for (const session of ctx.sessions) {
    if (session.splitId !== splitId || !session.id || unique.has(session.id) || !validDay(session.day) || session.day < from || session.day > ctx.today || !hasWork(session)) continue;
    unique.set(session.id, session);
  }
  return [...unique.values()]
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt) || a.id.localeCompare(b.id))
    .slice(-SKIP_WINDOW_SESSIONS);
}

function expectedInSavedPlan(session: Session, exerciseId: string): boolean {
  const entries = session.plan?.entries;
  if (!entries) return false;
  return entries.some(entry => entry.exerciseId === exerciseId && entry.origin === 'start'
    && entry.excluded !== 'removed' && entry.excluded !== 'replaced');
}

export function skipEvidence(ctx: BrainContext): SkipEvidence[] {
  const out: SkipEvidence[] = [];
  for (const split of ctx.splits) {
    if (!split.exercises.length) continue;
    const sessions = recentSplitSessions(ctx, split.id);
    if (sessions.length !== SKIP_WINDOW_SESSIONS) continue;
    const withPlan = sessions.filter(session => session.plan !== undefined).length;
    if (withPlan !== 0 && withPlan !== sessions.length) continue;
    const basis: SkipEvidence['basis'] = withPlan === sessions.length ? 'saved_plan' : 'current_template';

    for (const slot of split.exercises) {
      const exercise = findExercise(slot.exerciseId, ctx.custom);
      if (!exercise) continue;
      if (basis === 'saved_plan' && !sessions.every(session => expectedInSavedPlan(session, exercise.id))) continue;
      const working = sessions.map(session => resolvedWorkingIds(session, ctx));
      if (basis === 'current_template') {
        const appeared = ctx.sessions.some(session => session.splitId === split.id && validDay(session.day) && session.day <= ctx.today
          && resolvedWorkingIds(session, ctx).has(exercise.id));
        if (!appeared) continue;
      }
      const missingSessionIds = sessions.filter((_, index) => !working[index]!.has(exercise.id)).map(session => session.id);
      if (missingSessionIds.length < SKIP_MIN_MISSING) continue;
      out.push({
        splitId: split.id,
        exerciseId: exercise.id,
        basis,
        sessions: sessions.length,
        missingSessions: missingSessionIds.length,
        from: sessions[0]!.day,
        to: sessions[sessions.length - 1]!.day,
        sessionIds: sessions.map(session => session.id),
        missingSessionIds,
      });
    }
  }
  return out.sort((a, b) => b.missingSessions - a.missingSessions || b.to.localeCompare(a.to)
    || a.splitId.localeCompare(b.splitId) || a.exerciseId.localeCompare(b.exerciseId));
}

export function detectChronicSkip(ctx: BrainContext): Finding[] {
  return skipEvidence(ctx).slice(0, SKIP_MAX_FINDINGS).flatMap(row => {
    const split = ctx.splits.find(candidate => candidate.id === row.splitId);
    const exercise = findExercise(row.exerciseId, ctx.custom);
    if (!split || !exercise) return [];
    const comparable = recentSplitSessions(ctx, row.splitId);
    const sessions = row.sessionIds.map(id => comparable.find(session => session.id === id)).filter((session): session is Session => !!session);
    return [finding({
      kind: 'chronic_skip',
      target: `${row.splitId}:${row.exerciseId}`,
      subject: { splitId: split.id, splitName: split.name, exerciseId: exercise.id, exerciseName: exercise.name },
      metrics: { sessions: row.sessions, missingSessions: row.missingSessions, presentSessions: row.sessions - row.missingSessions, basis: row.basis, exerciseName: exercise.name, splitName: split.name },
      from: row.from,
      to: row.to,
      sessions: row.sessions,
      confidence: row.basis === 'saved_plan' ? 'medium' : 'low',
      severity: 1,
      evidence: evidenceFrom(sessions),
    })];
  });
}
