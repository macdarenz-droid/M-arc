/** Next-session targets for the exercises the user is likely to do today. */
import { weekdayOf } from '@/core/dates';
import { findExercise } from '@/core/exercises';
import { suggestNext } from '../../progression';
import { applyDeload } from '../deload';
import type { Finding, Proposal } from '../contract';
import type { BrainContext } from '../context';
import { proposal } from './shared';

export function planLoad(ctx: BrainContext, findings: Finding[], todayPlan: Proposal | null): Proposal[] {
  if (ctx.sessions.some(s => s.day === ctx.today)) return [];
  const recommended = todayPlan?.apply.kind === 'today_plan' ? todayPlan.apply.recommendedSplitId : null;
  const splitId = ctx.schedule[weekdayOf(ctx.today)] ?? recommended;
  const split = ctx.splits.find(s => s.id === splitId);
  if (!split) return [];
  const out: Proposal[] = [];
  for (const e of split.exercises.slice(0, 8)) {
    const meta = findExercise(e.exerciseId, ctx.custom);
    // Deload-adjusted, so this matches the exact number Train/Live actually renders for today's
    // session (both already call applyDeload — see Train.tsx) instead of the un-scaled target.
    const s = applyDeload(suggestNext(ctx.sessions, e.exerciseId, ctx.goal, ctx.today, e.sets, ctx.custom), ctx.deload, ctx.today);
    const basedOn = findings.filter(f => f.subject.exerciseId === e.exerciseId || (f.kind === 'long_gap')).map(f => f.id);
    out.push(proposal({
      kind: 'load_next', subject: { exerciseId: e.exerciseId, exerciseName: meta?.name ?? e.exerciseId, splitId: split.id, splitName: split.name },
      apply: { kind: 'load_next', exerciseId: e.exerciseId, kg: s.kg, reps: s.reps, mode: s.mode },
      basedOn, confidence: s.confidence, expiresOn: ctx.today,
    }));
  }
  return out;
}
