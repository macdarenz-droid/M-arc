// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/ids.mjs). inputsSha256=dba597200bae84732385f1232fac33fd6917656840722a141f6f6183fd1ac2db
import type { BuiltHowTo, LibId } from '../types';

// The shipped ids in registry order (tests and tools read them here; the main bundle has only ids.ts's hashes).
export const HOWTO_IDS = [
  "lib_dumbbell_lateral_raise",
  "lib_barbell_back_squat",
  "lib_pull_up",
  "lib_hanging_leg_raise",
  "lib_lat_pulldown",
  "lib_seated_cable_row",
  "lib_leg_press",
  "lib_machine_chest_press",
] as const;

// One dynamic import per shipped id. Partial: LibId names every exercise, and only the shipped ones have a loader.
export const LOADERS: Partial<Record<LibId, () => Promise<{ default: BuiltHowTo }>>> = {
  lib_dumbbell_lateral_raise: () => import('./ht-dumbbell-lateral-raise'),
  lib_barbell_back_squat: () => import('./ht-barbell-back-squat'),
  lib_pull_up: () => import('./ht-pull-up'),
  lib_hanging_leg_raise: () => import('./ht-hanging-leg-raise'),
  lib_lat_pulldown: () => import('./ht-lat-pulldown'),
  lib_seated_cable_row: () => import('./ht-seated-cable-row'),
  lib_leg_press: () => import('./ht-leg-press'),
  lib_machine_chest_press: () => import('./ht-machine-chest-press'),
};
