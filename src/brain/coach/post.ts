/**
 * Post-session debrief (6.13, cadence 'post'): computed once when a session
 * finishes and stored with it (Session.debrief), so later renders show the
 * same numbers rather than drifting as history grows.
 */
import type { Exercise, LoadUnit, Session } from '@/core/models';
import { kgToDisplay } from '@/core/units';
import { exerciseHistory, modeOf, type ExerciseSessionSummary } from '../history';
import { recordsFor } from '../prs';
import { findExercise } from '@/core/exercises';
import { isWorkingSet } from '../exposure';
import type { Insight } from './rules';

/** Records set in this session, tiered by kind, only from sets logged live (timing-independent content is fine at any fidelity). */
export function recordsInsight(session: Session, priorSessions: Session[], custom: Exercise[] = [], unit: LoadUnit = 'kg'): Insight[] {
  const out: Insight[] = [];
  for (const ex of session.exercises) {
    const meta = findExercise(ex.exerciseId, custom);
    const hist = exerciseHistory(priorSessions, ex.exerciseId, custom);
    const current: ExerciseSessionSummary = exerciseHistory([session], ex.exerciseId, custom)[0]!;
    if (!current) continue;
    const mode = modeOf(ex.exerciseId, custom);
    const records = recordsFor(current, hist, mode, ex.exerciseId, meta?.name ?? ex.name, unit);
    for (const r of records) {
      out.push({
        id: `post:record:${session.id}:${r.exerciseId}:${r.kind}`, category: 'progress', priority: 310, cadence: 'post', kind: 'praise',
        exerciseId: r.exerciseId,
        title: `${r.exerciseName}: new record`,
        noticed: r.kind === 'strength' ? `${r.detail}, up from about ${Math.round(kgToDisplay(r.previous, unit))} ${unit}.` : `${r.detail}, up from ${r.previous}.`,
        means: 'That is a genuine personal best, not just a bigger number from more sets.',
        action: 'Nothing to do. Keep logging honestly and it will keep tracking.',
        evidence: { n: hist.length, window: `${hist.length} prior sessions`, confidence: hist.length >= 5 ? 'high' : 'medium' },
      });
    }
  }
  return out;
}

/** Shares of easy/ideal/max for the session, flagged if heavily skewed either way. */
export function effortMixInsight(session: Session): Insight | null {
  const sets = session.exercises.flatMap(e => e.sets).filter(isWorkingSet);
  const rated = sets.filter(s => s.effort);
  if (rated.length < 4) return null;
  const share = (e: 'easy' | 'ideal' | 'max') => rated.filter(s => s.effort === e).length / rated.length;
  const easy = share('easy'), ideal = share('ideal'), max = share('max');
  const pct = (v: number) => Math.round(v * 100);
  if (max <= 0.5 && easy <= 0.6) {
    return {
      id: `post:effort-mix:${session.id}`, category: 'progress', priority: 150, cadence: 'post', kind: 'data',
      title: `Effort mix: ${pct(easy)}% easy, ${pct(ideal)}% ideal, ${pct(max)}% max`,
      noticed: `Effort mix: ${pct(easy)}% easy, ${pct(ideal)}% ideal, ${pct(max)}% max.`,
      means: 'A healthy spread for most goals: stopping a couple of reps short of failure grows muscle nearly as well, with less fatigue.',
      action: 'No change needed.',
      evidence: { n: rated.length, window: 'this session', confidence: 'high' },
    };
  }
  if (max > 0.5) {
    return {
      id: `post:effort-mix:${session.id}`, category: 'progress', priority: 200, cadence: 'post', kind: 'tip',
      title: `Effort mix: ${pct(max)}% max effort`,
      noticed: `${pct(max)}% of rated sets were max effort.`,
      means: 'Frequent failure adds fatigue without much extra growth or strength.',
      action: 'Save max effort for the last set of an exercise.',
      evidence: { n: rated.length, window: 'this session', confidence: 'high' },
    };
  }
  return {
    id: `post:effort-mix:${session.id}`, category: 'progress', priority: 150, cadence: 'post', kind: 'tip',
    title: `Effort mix: ${pct(easy)}% easy`,
    noticed: `${pct(easy)}% of rated sets were easy.`,
    means: 'Mostly-easy sets leave growth on the table over time.',
    action: 'Push a couple of sets closer to ideal effort next time.',
    evidence: { n: rated.length, window: 'this session', confidence: 'high' },
  };
}

/** Median rest before compound sets, and whether reps fell off across the session. */
/**
 * BR-20: judged per main exercise with 3+ working sets, never across different lifts. Reps fell
 * when an exercise's last set has 25% fewer reps than its first. The rest median leaves out each
 * exercise's first set (its "rest" is the changeover from the last exercise).
 */
export function restAndDensityInsight(session: Session, isStrengthGoal: boolean, custom: Exercise[] = []): Insight | null {
  const mains = session.exercises
    .filter(e => findExercise(e.exerciseId, custom)?.role === 'main')
    .map(e => e.sets.filter(isWorkingSet))
    .filter(sets => sets.length >= 3);
  const rests = mains.flatMap(sets => sets.slice(1)).map(s => s.restSec).filter((r): r is number => r != null).sort((a, b) => a - b);
  if (rests.length < 3) return null;
  const medianRest = rests[Math.floor(rests.length / 2)]!;
  const fell = mains.map(sets => ({ first: sets[0]!.reps ?? 0, last: sets[sets.length - 1]!.reps ?? 0 })).filter(x => x.first > 0 && (x.first - x.last) / x.first >= 0.25);
  const threshold = isStrengthGoal ? 120 : 90;
  if (medianRest >= threshold || !fell.length) return null;
  const firstReps = fell[0]!.first, lastReps = fell[0]!.last;
  const compoundSets = mains.flat();
  return {
    id: `post:rest:${session.id}`, category: 'progress', priority: 180, cadence: 'post', kind: 'tip',
    title: `Median rest ${medianRest}s`,
    noticed: `Median rest before sets was ${medianRest}s, and reps on a main lift fell from ${firstReps} on the first set to ${lastReps} on the last.`,
    means: `On heavy sets, ${isStrengthGoal ? '2 to 3 minutes' : '90 seconds or more'} keeps reps up.`,
    action: 'Take a little longer before the next heavy set.',
    evidence: { n: compoundSets.length, window: 'this session', confidence: 'medium' },
  };
}

/** |Delta duration| vs the median of the split's last 5 sessions. */
export function durationDriftInsight(session: Session, priorSameSplit: Session[]): Insight | null {
  if (priorSameSplit.length < 5) return null;
  const durations = [...priorSameSplit].sort((a, b) => a.startedAt.localeCompare(b.startedAt)).slice(-5).map(s => s.durationSec).sort((a, b) => a - b);
  const median = durations[Math.floor(durations.length / 2)]!;
  if (median <= 0) return null;
  const delta = (session.durationSec - median) / median;
  if (Math.abs(delta) < 0.2) return null;
  const minutes = (sec: number) => Math.round(sec / 60);
  return {
    id: `post:duration:${session.id}`, category: 'data', priority: 130, cadence: 'post', kind: 'data',
    title: `${minutes(session.durationSec)} min, ${delta > 0 ? 'longer' : 'shorter'} than usual`,
    noticed: `Ran ${minutes(session.durationSec)} min, your usual for ${session.splitName} is about ${minutes(median)} min.`,
    means: delta > 0 ? 'Idle time between sets is the most common cause.' : 'A tighter session, or fewer sets than usual.',
    action: delta > 0 ? 'Short on time next time? Superset the last couple of accessories.' : 'No change needed if everything got logged.',
    evidence: { n: priorSameSplit.length, window: `${priorSameSplit.length} sessions`, confidence: 'medium' },
  };
}

export interface PostSessionInput {
  session: Session;
  priorSessions: Session[];
  custom: Exercise[];
  isStrengthGoal: boolean;
  /** The display unit for record text (BR-28). */
  unit?: LoadUnit;
}

export function postSessionInsights(input: PostSessionInput, limit = 4): Insight[] {
  const { session, priorSessions, custom, isStrengthGoal } = input;
  const priorSameSplit = priorSessions.filter(s => s.splitId === session.splitId);
  // Rest, density and duration drift need a session whose timing can be trusted (6.17.4); content-only
  // rows (records, effort mix) accept every logging fidelity.
  const timingTrusted = session.logging?.timingTrusted ?? true;
  const out: Insight[] = [
    ...recordsInsight(session, priorSessions, custom, input.unit ?? 'kg'),
    effortMixInsight(session),
    timingTrusted ? restAndDensityInsight(session, isStrengthGoal, custom) : null,
    timingTrusted ? durationDriftInsight(session, priorSameSplit) : null,
  ].filter((i): i is Insight => !!i);
  return out.sort((a, b) => b.priority - a.priority).slice(0, limit);
}
