/** Immutable workout-target capture. Historical comparison is added later. */
import type { PlanSetTarget, WorkoutPlanEntry, WorkoutPlanSnapshot } from '@/core/models';
import { findExercise } from '@/core/exercises';
import { exerciseHistory } from './history';
import { suggestNext } from './progression';
import { applyDeload, deloadActive } from './coach/deload';
import type { BrainContext } from './coach/context';

export interface PlanEntryInput {
  id: string;
  exerciseId: string;
  name: string;
  plannedSets: number;
  origin: WorkoutPlanEntry['origin'];
  replaces?: string;
}

const finiteNonnegative = (value: number | null): number | null =>
  value !== null && Number.isFinite(value) && value >= 0 ? value : null;
const positiveInteger = (value: number | null): number | null =>
  value !== null && Number.isInteger(value) && value > 0 ? value : null;
const copyTarget = (target: { kg: number | null; reps: number | null; durationSec: number | null }): PlanSetTarget => ({
  kg: finiteNonnegative(target.kg),
  reps: positiveInteger(target.reps),
  durationSec: finiteNonnegative(target.durationSec),
});

export function capturePlanEntry(ctx: BrainContext, entry: PlanEntryInput): WorkoutPlanEntry {
  const exercise = findExercise(entry.exerciseId, ctx.custom);
  if (!exercise) return {
    ...entry, mode: null, targetSource: 'unavailable', allowIncrease: false, targets: [],
  };
  const historyBacked = exerciseHistory(ctx.sessions, entry.exerciseId, ctx.custom).length > 0;
  const raw = suggestNext(ctx.sessions, entry.exerciseId, ctx.goal, ctx.today, entry.plannedSets, ctx.custom);
  const suggestion = applyDeload(raw, ctx.deload, ctx.today);
  const targets = Array.from({ length: Math.max(0, entry.plannedSets) }, (_, index) => {
    const target = suggestion.sets[Math.min(index, suggestion.sets.length - 1)];
    return target ? copyTarget(target) : { kg: null, reps: null, durationSec: null };
  });
  const canIncrease = raw.mode === 'increase' || raw.mode === 'reps' || raw.mode === 'hold' || raw.mode === 'confirm';
  return {
    ...entry,
    mode: exercise.mode,
    targetSource: historyBacked ? 'history' : 'starter',
    allowIncrease: historyBacked && canIncrease && !deloadActive(ctx.deload, ctx.today),
    targets,
  };
}

export function capturePlan(ctx: BrainContext, entries: PlanEntryInput[], capturedAt: string): WorkoutPlanSnapshot {
  return {
    version: 1,
    capturedAt,
    goal: ctx.goal,
    deload: ctx.deload ? { ...ctx.deload } : null,
    entries: entries.map(entry => {
      const captured = capturePlanEntry(ctx, { ...entry });
      return { ...captured, targets: captured.targets.map(target => ({ ...target })) };
    }),
  };
}
