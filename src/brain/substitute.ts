/** F3.7: exercise substitutes, for when a muscle is recovering or an insight suggests balance work. */
import type { Exercise } from '@/core/models';
import { LIBRARY } from '@/core/exercises';
import { equipmentGroup } from './coach/cues';

/** Same primary muscle as `exercise`, ranked by matching movement pattern then equipment group. */
export function substitutesFor(exercise: Exercise, custom: Exercise[] = []): Exercise[] {
  const group = equipmentGroup(exercise.equipment);
  const score = (e: Exercise): number => (e.pattern === exercise.pattern ? 2 : 0) + (equipmentGroup(e.equipment) === group ? 1 : 0);
  return [...LIBRARY, ...custom]
    .filter(e => e.id !== exercise.id && e.primary.some(m => exercise.primary.includes(m)))
    .sort((a, b) => score(b) - score(a));
}
