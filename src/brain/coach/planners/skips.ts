/** Explicit alternatives for one confirmed repeated omission. */
import { addDays } from '@/core/dates';
import { findExercise } from '@/core/exercises';
import { substitutes } from '@/brain/live';
import type { BrainContext } from '../context';
import type { Finding, Proposal } from '../contract';
import { adjustedRecovery } from '../detectors/recovery';
import { detectNoteFlags } from '../detectors/notes';
import { proposal, recentPainMuscles, type UsageProfile } from './shared';

export function planSkips(
  ctx: BrainContext,
  findings: Finding[],
  profile: UsageProfile,
  swapBudget: number,
): Proposal[] {
  const source = findings
    .filter(f => f.kind === 'chronic_skip' && f.metrics.basis === 'saved_plan' && f.subject.splitId && f.subject.exerciseId)
    .sort((a, b) => Number(b.metrics.missingSessions ?? 0) - Number(a.metrics.missingSessions ?? 0)
      || b.window.to.localeCompare(a.window.to) || a.id.localeCompare(b.id))[0];
  if (!source?.subject.splitId || !source.subject.exerciseId) return [];
  const split = ctx.splits.find(candidate => candidate.id === source.subject.splitId);
  const slot = split?.exercises.find(candidate => candidate.exerciseId === source.subject.exerciseId);
  const exercise = findExercise(source.subject.exerciseId, ctx.custom);
  if (!split || !slot || !exercise) return [];

  const expiresOn = addDays(ctx.today, 7);
  const out: Proposal[] = [];
  if (split.exercises.length > 1) {
    out.push(proposal({
      kind: 'split_modify',
      subject: { splitId: split.id, splitName: split.name },
      apply: { kind: 'split_modify', splitId: split.id, add: [], remove: [exercise.id], setChanges: [] },
      basedOn: [source.id],
      confidence: 'medium',
      expiresOn,
      suffix: `skip-cut-${exercise.id}`,
    }));
  }
  if (swapBudget > 0) {
    const ready = new Map(adjustedRecovery(ctx).map(row => [row.muscle, row.adjustedPct]));
    const pick = substitutes(ctx, exercise.id, slot.sets, {
      max: 1,
      profile,
      exclude: new Set(split.exercises.map(candidate => candidate.exerciseId)),
      readiness: muscle => ready.get(muscle) ?? 100,
      avoid: recentPainMuscles(detectNoteFlags(ctx)),
    })[0];
    if (pick) {
      out.push(proposal({
        kind: 'exercise_swap',
        subject: { splitId: split.id, splitName: split.name, exerciseName: exercise.name },
        apply: { kind: 'exercise_swap', splitId: split.id, fromExerciseId: exercise.id, toExerciseId: pick.exerciseId },
        basedOn: [source.id],
        confidence: 'medium',
        expiresOn,
        suffix: `skip-swap-${exercise.id}`,
      }));
    }
  }
  return out;
}
