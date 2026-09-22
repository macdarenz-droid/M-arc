import type { Exercise, ResistanceMode, Session } from '@/core/models';
import { daysBetween } from '@/core/dates';
import { findExercise } from '@/core/exercises';
import { exerciseHistory, modeOf, type ExerciseSessionSummary } from '@/brain/history';
import { recordsFor, repsAtLoadMap } from '@/brain/prs';
import { loadStep } from '@/brain/progression';
import { isWorkingSet } from '@/brain/exposure';
import type { Finding } from '../contract';
import type { BrainContext } from '../context';
import { evidenceFrom, finding, round1 } from './shared';

export interface NearMiss {
  exerciseId: string;
  exerciseName: string;
  sessionId: string;
  day: string;
  kind: 'reps_at_load' | 'best_reps' | 'heaviest' | 'strength';
  value: number;
  standing: number;
  required: number;
  gap: number;
  kg: number | null;
}

const half = (value: number): number => Math.round(value * 2) / 2;

/** Recognize a close result without changing the existing definition of a record. */
export function nearMissFor(current: ExerciseSessionSummary, prior: ExerciseSessionSummary[], mode: ResistanceMode, exerciseId: string, exerciseName: string): NearMiss | null {
  if ((mode !== 'weighted' && mode !== 'bodyweight') || prior.length < 2 || !current.sets.length) return null;
  if (recordsFor(current, prior, mode, exerciseId, exerciseName).length) return null;
  const base = { exerciseId, exerciseName, sessionId: current.sessionId, day: current.day };

  if (mode === 'weighted') {
    const standingByLoad = repsAtLoadMap(prior);
    const repCandidate = current.sets
      .map(set => ({ kg: set.kg ?? 0, value: set.reps ?? 0, standing: standingByLoad.get(set.kg ?? -1) ?? 0 }))
      .filter(row => Number.isFinite(row.kg) && row.kg > 0 && Number.isFinite(row.value) && row.value > 0 && row.standing > 0
        && (row.value === row.standing || row.value === row.standing - 1))
      .sort((a, b) => b.kg - a.kg || b.value - a.value)[0];
    if (repCandidate) {
      const required = repCandidate.standing + 1;
      return { ...base, kind: 'reps_at_load', value: repCandidate.value, standing: repCandidate.standing, required, gap: required - repCandidate.value, kg: repCandidate.kg };
    }

    const standingLoad = Math.max(0, ...prior.map(row => row.topKg));
    const currentLoad = current.topKg;
    if (Number.isFinite(standingLoad) && standingLoad > 0 && Number.isFinite(currentLoad) && currentLoad > 0
      && currentLoad <= standingLoad && standingLoad - currentLoad <= loadStep(standingLoad) + 0.001) {
      const required = half(standingLoad + loadStep(standingLoad));
      return { ...base, kind: 'heaviest', value: currentLoad, standing: standingLoad, required, gap: required - currentLoad, kg: null };
    }

    const rawStanding = Math.max(0, ...prior.map(row => row.bestE1rm));
    const rawValue = current.bestE1rm;
    if (Number.isFinite(rawStanding) && rawStanding > 0 && Number.isFinite(rawValue) && rawValue > 0
      && rawValue <= rawStanding * 1.01 && rawValue >= rawStanding * 0.98) {
      const value = round1(rawValue);
      const standing = round1(rawStanding);
      const required = round1((Math.floor(rawStanding * 1.01 * 10) + 1) / 10);
      const gap = round1(required - value);
      if (value !== required && gap !== 0) return { ...base, kind: 'strength', value, standing, required, gap, kg: null };
    }
    return null;
  }

  const standing = Math.max(0, ...prior.map(row => row.bestReps));
  const value = current.bestReps;
  if (!Number.isFinite(standing) || standing <= 0 || !Number.isFinite(value) || value <= 0 || (value !== standing && value !== standing - 1)) return null;
  const required = standing + 1;
  return { ...base, kind: 'best_reps', value, standing, required, gap: required - value, kg: null };
}

const sessionTime = (session: Session): number => Date.parse(session.startedAt);
const compareSessions = (a: Session, b: Session): number => sessionTime(a) - sessionTime(b) || a.id.localeCompare(b.id);

function resolvedHistory(currentSession: Session, allSessions: Session[], exerciseId: string, custom: Exercise[]): { current: ExerciseSessionSummary; prior: ExerciseSessionSummary[] } | null {
  const ordered = [...allSessions.filter(session => session.id !== currentSession.id), currentSession]
    .filter(session => Number.isFinite(sessionTime(session)))
    .sort(compareSessions);
  const currentIndex = ordered.findIndex(session => session.id === currentSession.id);
  if (currentIndex < 0) return null;
  const history = exerciseHistory(ordered.slice(0, currentIndex + 1), exerciseId, custom);
  const current = history.find(row => row.sessionId === currentSession.id);
  if (!current) return null;
  return { current, prior: history.filter(row => row.sessionId !== currentSession.id) };
}

/** Near misses in one saved session, deduplicated through canonical exercise ids. */
export function sessionNearMisses(session: Session, allSessions: Session[], custom: Exercise[] = []): NearMiss[] {
  const seen = new Set<string>();
  const out: NearMiss[] = [];
  for (const logged of session.exercises) {
    const exercise = findExercise(logged.exerciseId, custom) ?? findExercise(logged.name, custom);
    if (!exercise || seen.has(exercise.id)) continue;
    seen.add(exercise.id);
    const history = resolvedHistory(session, allSessions, exercise.id, custom);
    if (!history) continue;
    const miss = nearMissFor(history.current, history.prior, modeOf(exercise.id, custom), exercise.id, exercise.name);
    if (miss) out.push(miss);
  }
  const rank: Record<NearMiss['kind'], number> = { reps_at_load: 0, best_reps: 1, heaviest: 2, strength: 3 };
  return out.sort((a, b) => rank[a.kind] - rank[b.kind] || a.exerciseId.localeCompare(b.exerciseId)).slice(0, 2);
}

function supportingSessions(miss: NearMiss, session: Session, sessions: Session[], custom: Exercise[]): Session[] {
  const resolved = resolvedHistory(session, sessions, miss.exerciseId, custom);
  if (!resolved) return [session];
  const ids = new Set(resolved.prior.filter(row => {
    if (miss.kind === 'reps_at_load') return row.sets.some(set => set.kg === miss.kg && set.reps === miss.standing);
    if (miss.kind === 'best_reps') return row.bestReps === miss.standing;
    if (miss.kind === 'heaviest') return row.topKg === miss.standing;
    return round1(row.bestE1rm) === miss.standing;
  }).map(row => row.sessionId));
  return [...sessions.filter(candidate => ids.has(candidate.id)), session].sort(compareSessions);
}

const validRecentSession = (session: Session, ctx: BrainContext): boolean => /^\d{4}-\d{2}-\d{2}$/.test(session.day)
  && daysBetween(session.day, ctx.today) >= 0 && daysBetween(session.day, ctx.today) <= 2
  && Number.isFinite(sessionTime(session)) && sessionTime(session) <= ctx.now
  && session.exercises.some(exercise => exercise.sets.some(isWorkingSet));

/** The strongest recent saved near miss, for the existing Coach insight surface. */
export function detectNearMiss(ctx: BrainContext): Finding[] {
  const latest = ctx.sessions.filter(session => validRecentSession(session, ctx)).sort(compareSessions).at(-1);
  if (!latest) return [];
  const miss = sessionNearMisses(latest, ctx.sessions, ctx.custom)[0];
  if (!miss) return [];
  const support = supportingSessions(miss, latest, ctx.sessions, ctx.custom);
  const metrics: Finding['metrics'] = { recordKind: miss.kind, current: miss.value, standing: miss.standing, required: miss.required, gap: miss.gap, sessionDay: miss.day };
  if (miss.kg !== null) metrics.loadKg = miss.kg;
  return [finding({
    kind: 'near_miss', target: miss.exerciseId, subject: { exerciseId: miss.exerciseId, exerciseName: miss.exerciseName }, metrics,
    from: support[0]?.day ?? miss.day, to: miss.day, sessions: support.length, confidence: 'medium', severity: 0, evidence: evidenceFrom(support),
  })];
}
