// FG-3: the muscle overlays each view draws (docs/FORM-GUIDE-PRODUCTION.md §3 "Muscle overlays by view"), read by the
// targetVisible check and the library census. The side and back part sets (FG-6) must draw every muscle listed here.
import type { MuscleId } from '@/data/muscles';
import { viewFor } from '../rig/patterns';
import type { View } from '../rig/joints';

export const OVERLAYS: Record<View, readonly MuscleId[]> = {
  front: ['front_delts', 'side_delts', 'upper_traps', 'biceps', 'forearms', 'upper_chest', 'chest', 'lats', 'abs', 'core', 'obliques', 'hip_flexors', 'quads', 'adductors'],
  side: ['side_delts', 'front_delts', 'rear_delts', 'upper_traps', 'mid_back', 'lats', 'chest', 'upper_chest', 'triceps', 'biceps', 'forearms', 'abs', 'core', 'obliques', 'lower_back', 'hip_flexors', 'glutes', 'quads', 'hamstrings', 'calves'],
  // adductors: the adductor magnus forms the inner back of the thigh (D-FG3)
  back: ['upper_traps', 'mid_back', 'lats', 'rear_delts', 'triceps', 'forearms', 'lower_back', 'abductors', 'glutes', 'hamstrings', 'calves', 'adductors'],
};
/** Aliases as in the app: these muscles are drawn by another overlay. */
export const ALIAS: Partial<Record<MuscleId, MuscleId>> = { brachialis: 'biceps', rotator_cuff: 'rear_delts' };

export const hasOverlay = (view: View, m: MuscleId): boolean => OVERLAYS[view].includes(ALIAS[m] ?? m);

/** The per-exercise view overrides the census needs (D-FG3); each file sets them with a `viewWhy`. */
export const CENSUS_VIEW_OVERRIDES: Record<string, { view: View; why: string }> = {
  lib_cable_external_rotation: { view: 'back', why: 'the cuff (infraspinatus, teres minor) lies on the back of the blade' },
  lib_hip_abduction: { view: 'back', why: 'glutes and outer hips are drawn in the back view; the pads read the same from behind' },
  lib_sumo_deadlift: { view: 'back', why: 'glutes and the adductor magnus both show from behind, with the wide stance' },
};

export type LibraryRow = { id: string; pattern: string; primary: string[] };
/** Library census: every primary muscle that has no overlay in its exercise's view (custom patterns have no guide). */
export function hiddenTargets(lib: LibraryRow[], overrides: Record<string, { view: View }> = {}): string[] {
  const out: string[] = [];
  for (const e of lib) {
    const view = overrides[e.id]?.view ?? viewFor(e.pattern);
    if (!view) continue;
    for (const m of e.primary) if (!hasOverlay(view, m as MuscleId)) out.push(`${e.id}: ${m} (${view})`);
  }
  return out;
}
