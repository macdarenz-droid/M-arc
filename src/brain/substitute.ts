/** F3.7: exercise substitutes, for when a muscle is recovering or an insight suggests balance work. */
import type { Exercise } from '@/core/models';
import { LIBRARY } from '@/core/exercises';
import { equipmentGroup } from './coach/cues';
import { loadableNear, formatLoadable, type LoadMenu } from './units';
import { substitutionRatio } from '@/data/substitutionRatios';

/** Same primary muscle as `exercise`, ranked by matching movement pattern then equipment group. */
export function substitutesFor(exercise: Exercise, custom: Exercise[] = []): Exercise[] {
  const group = equipmentGroup(exercise.equipment);
  const score = (e: Exercise): number => (e.pattern === exercise.pattern ? 2 : 0) + (equipmentGroup(e.equipment) === group ? 1 : 0);
  return [...LIBRARY, ...custom]
    .filter(e => e.id !== exercise.id && e.primary.some(m => exercise.primary.includes(m)))
    .sort((a, b) => score(b) - score(a));
}

export interface CarryOverStart {
  /** Canonical kg, snapped to a real rung on the substitute's menu. */
  kg: number;
  reps: number;
  confidence: 'low';
  text: string;
}

/**
 * LT-5 (docs/LOAD-AWARE-TARGETS.md §5): a starting estimate for a substitute exercise, carried over
 * from the replaced lift's strength estimate (its e1RM or top kg, canonical) through a sourced
 * pattern ratio (`src/data/substitutionRatios.ts`), then placed on the substitute's own load menu.
 * Null with no sourced ratio for this pair, or nothing to place it on - the caller keeps today's
 * `startingLoadKg` behaviour (A3).
 */
export function carryOverStart(replaced: Pick<Exercise, 'pattern' | 'equipment'>, substitute: Pick<Exercise, 'pattern' | 'equipment'>, replacedEstimateKg: number, menu: Pick<LoadMenu, 'profile' | 'rungsKg'>): CarryOverStart | null {
  if (!(replacedEstimateKg > 0) || !menu.rungsKg.length) return null;
  if (replaced.pattern !== substitute.pattern) return null;
  const ratio = substitutionRatio(replaced.pattern, equipmentGroup(replaced.equipment), equipmentGroup(substitute.equipment));
  if (!ratio) return null;
  const estimateKg = replacedEstimateKg * ratio.ratio;
  const rung = chooseStartRung(estimateKg, menu);
  const reps = Math.max(1, Math.min(20, Math.floor(30 * (estimateKg / rung.kg - 1))));
  return { kg: rung.kg, reps, confidence: 'low', text: `Start around ${formatLoadable(rung)} for ${reps}` };
}

/**
 * Where the carry-over estimate lands on the substitute's menu: nearest real load at or below the
 * estimate, so the first session is achievable. The one call LT-2 can swap for its own rung choice
 * once it lands, without touching carryOverStart's shape.
 */
function chooseStartRung(estimateKg: number, menu: Pick<LoadMenu, 'profile'>) {
  return loadableNear(estimateKg, menu.profile, 'down');
}
