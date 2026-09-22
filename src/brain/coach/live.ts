/**
 * In-session autoregulation (6.13, cadence 'live'): one line under the open
 * exercise after its first working set, adjusting the remaining sets from
 * how that one actually went. Only reacts to a live commit — a retro or
 * edited set says nothing about "right now".
 */
import type { LoggedSet } from '@/core/models';
import { roundToStep } from '../e1rm';
import type { Insight } from './rules';

export interface AutoregulationInput {
  exerciseId: string;
  exerciseName: string;
  firstSet: LoggedSet;
  targetKg: number;
  targetReps: number;
  /** Prior sessions for this exercise: >=3 uses a 2.5% step, else a flat 2.5 kg. */
  historyCount: number;
}

export function autoregulationSuggestion(input: AutoregulationInput): Insight | null {
  const { exerciseId, exerciseName, firstSet, targetKg, targetReps, historyCount } = input;
  if (firstSet.fidelity !== 'live') return null;
  if (firstSet.kg == null || firstSet.reps == null || !firstSet.effort) return null;
  if (!(targetKg > 0) || !(targetReps > 0)) return null;
  const step = historyCount >= 3 ? targetKg * 0.025 : 2.5;

  if (firstSet.effort === 'easy' && firstSet.reps >= targetReps) {
    const next = roundToStep(targetKg + step);
    return {
      id: `live:autoreg:${exerciseId}`, category: 'progress', priority: 170, cadence: 'live', kind: 'tip', exerciseId,
      title: `${exerciseName}: room to add load`,
      noticed: `That felt easy at ${firstSet.kg} kg for ${firstSet.reps}.`,
      means: 'Easy at or above target reps means there is room to add load right now.',
      action: `Try ${next} kg for the next set.`,
      evidence: { n: 1, window: 'this set', confidence: 'high' },
    };
  }
  if (firstSet.effort === 'max' && firstSet.reps < targetReps - 1) {
    const next = roundToStep(targetKg - step);
    return {
      id: `live:autoreg:${exerciseId}`, category: 'progress', priority: 170, cadence: 'live', kind: 'tip', exerciseId,
      title: `${exerciseName}: ease off`,
      noticed: `Missed target at max effort: ${firstSet.reps} of ${targetReps}.`,
      means: 'A big miss at max effort means the load is too heavy for today.',
      action: `Drop to ${next} kg and keep the rest at ideal effort.`,
      evidence: { n: 1, window: 'this set', confidence: 'high' },
    };
  }
  return null;
}
