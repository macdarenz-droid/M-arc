/**
 * Effort ratings: are they there, are they drifting, do they and the rep
 * ranges fit the goal? Rests on effort_rir_scale, proximity_to_failure and
 * load_and_rep_range.
 */
import { GOAL_BY_ID } from '@/data/goals';
import { findExercise } from '@/core/exercises';
import { exerciseHistory, modeOf } from '../../history';
import { effortDrift } from '../../effort';
import { repRange } from '../../progression';
import type { Finding } from '../contract';
import type { BrainContext } from '../context';
import { effortCoverage, evidenceFrom, finding, loggedExercises, median, round2 } from './shared';

export function detectEffortMissing(ctx: BrainContext): Finding[] {
  const { coverage, sets } = effortCoverage(ctx.sessions, 3);
  if (sets < 8 || coverage >= 0.5) return [];
  const recent = ctx.sessions.slice(-3);
  return [finding({
    kind: 'effort_missing', target: 'recent', subject: {},
    metrics: { ratedPct: Math.round(coverage * 100), sets, sessions: recent.length },
    from: recent[0]!.day, to: recent[recent.length - 1]!.day, sessions: recent.length,
    confidence: 'high', severity: 1, evidence: evidenceFrom(recent),
  })];
}

export function detectEffortDrift(ctx: BrainContext): Finding[] {
  const out: Finding[] = [];
  for (const { id, name } of loggedExercises(ctx.sessions)) {
    const hist = exerciseHistory(ctx.sessions, id, ctx.custom);
    const d = effortDrift(hist);
    if (d.status === 'unknown' || d.status === 'stable' || d.confidence === 'low') continue;
    const recent = hist.slice(-6);
    out.push(finding({
      kind: d.status === 'harder' ? 'effort_drift_harder' : 'effort_drift_easier', target: id,
      subject: { exerciseId: id, exerciseName: name },
      metrics: { delta: round2(d.delta), sessions: recent.length },
      from: recent[0]!.day, to: recent[recent.length - 1]!.day, sessions: recent.length,
      confidence: d.confidence, severity: 1,
      evidence: { sessionIds: recent.map(r => r.sessionId), days: recent.map(r => r.day) },
    }));
  }
  return out;
}

export function detectEffortMismatch(ctx: BrainContext): Finding[] {
  const goal = GOAL_BY_ID[ctx.goal];
  const out: Finding[] = [];
  for (const { id, name } of loggedExercises(ctx.sessions)) {
    const recent = exerciseHistory(ctx.sessions, id, ctx.custom).slice(-4);
    if (recent.length < 4) continue;
    const rated = recent.flatMap(r => r.sets).filter(s => s.effort);
    if (rated.length < 8) continue;
    const share = (e: string) => rated.filter(s => s.effort === e).length / rated.length;
    const maxShare = share('max'), easyShare = share('easy'), idealShare = share('ideal');
    let direction: 'harder_than_goal' | 'easier_than_goal' | null = null;
    if (maxShare >= 0.6 && goal.rir[0] >= 1) direction = 'harder_than_goal';
    else if (easyShare >= 0.6) direction = 'easier_than_goal';
    if (!direction) continue;
    out.push(finding({
      kind: 'effort_mismatch', target: id, subject: { exerciseId: id, exerciseName: name },
      metrics: {
        direction, maxSharePct: Math.round(maxShare * 100), idealSharePct: Math.round(idealShare * 100), easySharePct: Math.round(easyShare * 100),
        goalRirLow: goal.rir[0], goalRirHigh: goal.rir[1], goal: goal.id, sessions: recent.length, ratedSets: rated.length,
      },
      from: recent[0]!.day, to: recent[recent.length - 1]!.day, sessions: recent.length,
      confidence: rated.length >= 16 ? 'high' : 'medium', severity: 1,
      evidence: { sessionIds: recent.map(r => r.sessionId), days: recent.map(r => r.day) },
    }));
  }
  return out;
}

export function detectRepRangeMismatch(ctx: BrainContext): Finding[] {
  const strengthGoal = ctx.goal === 'strength' || ctx.goal === 'strength_muscle';
  const out: Finding[] = [];
  for (const { id, name } of loggedExercises(ctx.sessions)) {
    if (modeOf(id, ctx.custom) !== 'weighted') continue;
    const meta = findExercise(id, ctx.custom);
    const recent = exerciseHistory(ctx.sessions, id, ctx.custom).slice(-4).filter(r => r.topReps > 0);
    if (recent.length < 4) continue;
    const [lo, hi] = repRange(meta, ctx.goal);
    const reps = recent.map(r => r.topReps);
    let direction: 'above' | 'below' | null = null;
    if (reps.every(r => r > hi + 3)) direction = 'above';
    else if (lo - 2 >= 1 && reps.every(r => r < lo - 2)) direction = 'below';
    if (!direction) continue;
    out.push(finding({
      kind: 'rep_range_mismatch', target: id, subject: { exerciseId: id, exerciseName: name },
      metrics: { direction, typicalReps: median(reps), rangeLow: lo, rangeHigh: hi, goal: ctx.goal, sessions: recent.length },
      from: recent[0]!.day, to: recent[recent.length - 1]!.day, sessions: recent.length,
      confidence: 'medium', severity: strengthGoal ? 1 : 0,
      evidence: { sessionIds: recent.map(r => r.sessionId), days: recent.map(r => r.day) },
    }));
  }
  return out;
}
