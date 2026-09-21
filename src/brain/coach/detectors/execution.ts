import { daysBetween } from '@/core/dates';
import { sessionDebrief } from '@/brain/debrief';
import { exerciseHistory } from '@/brain/history';
import { isWorkingSet } from '@/brain/exposure';
import type { Session } from '@/core/models';
import { DEBRIEF_FINDING_DAYS, DEBRIEF_MIN_COMPARABLE_SETS } from '../bands';
import type { BrainContext } from '../context';
import type { Finding } from '../contract';
import { evidenceFrom, finding } from './shared';

const validDay = (day: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(day)
  && !Number.isNaN(Date.parse(`${day}T00:00:00Z`)) && new Date(`${day}T00:00:00Z`).toISOString().slice(0, 10) === day;

const before = (candidate: Session, target: Session): boolean => candidate.startedAt < target.startedAt
  || (candidate.startedAt === target.startedAt && candidate.id < target.id);

function comparisonEvidence(target: Session, prior: Session[], exerciseIds: Set<string>, custom: BrainContext['custom']): Session[] {
  const compared = new Map<string, Session>([[target.id, target]]);
  for (const exerciseId of exerciseIds) {
    const previousId = exerciseHistory(prior.filter(session => before(session, target)), exerciseId, custom).at(-1)?.sessionId;
    const match = previousId ? prior.find(session => session.id === previousId) : undefined;
    if (match) compared.set(match.id, match);
  }
  return [...compared.values()].sort((a, b) => a.startedAt.localeCompare(b.startedAt) || a.id.localeCompare(b.id));
}

export function detectSessionExecution(ctx: BrainContext): Finding[] {
  const eligible = ctx.sessions
    .filter(session => !!session.id && validDay(session.day) && session.day <= ctx.today && Number.isFinite(Date.parse(session.startedAt))
      && session.exercises.some(entry => entry.sets.some(isWorkingSet)))
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt) || a.id.localeCompare(b.id));
  const target = eligible.at(-1);
  if (!target || daysBetween(target.day, ctx.today) > DEBRIEF_FINDING_DAYS) return [];
  const prior = ctx.sessions.filter(session => session.id !== target.id && before(session, target));
  const debrief = sessionDebrief(target, prior, ctx.custom);
  const historyRows = debrief.exercises.filter(entry => entry.targetSource === 'history').flatMap(entry => entry.rows);
  const comparable = historyRows.filter(row => row.result === 'met' || row.result === 'below');
  if (comparable.length < DEBRIEF_MIN_COMPARABLE_SETS) return [];
  const met = comparable.filter(row => row.result === 'met').length;
  const tradeoffIds = new Set(debrief.exercises.filter(entry => entry.tradeoff).map(entry => entry.exerciseId));
  return [finding({
    kind: 'session_execution',
    target: target.id,
    subject: { splitId: target.splitId, splitName: target.splitName },
    metrics: {
      plannedSets: debrief.plannedSets ?? 0,
      loggedSets: debrief.loggedSets,
      comparableSets: comparable.length,
      metSets: met,
      belowSets: comparable.length - met,
      sessionDay: target.day,
    },
    from: target.day,
    to: target.day,
    sessions: 1,
    confidence: 'medium',
    severity: 0,
    evidence: evidenceFrom(comparisonEvidence(target, prior, tradeoffIds, ctx.custom)),
  })];
}
