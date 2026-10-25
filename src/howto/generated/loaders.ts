// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/ids.mjs). inputsSha256=56b2068c3d0f4c703ee9f417696b2bb4625366508a207e5ee5c3b8d961d43804
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

// Per-chromeId chunks (D-LIB2-sheet-maps): the sheet chunk holds no per-id map, so it does not grow with the library.
// HAND: the exercise's own hand chunk, else its shared hand pair (LIB-2 design 12).
export const HAND: Readonly<Record<string, () => Promise<{ readonly panel: string }>>> = {
  "lateral-raise": () => import('./hand-lateral-raise'),
  "barbell-back-squat": () => import('./hand-barbell-back-squat'),
  "pull-up": () => import('./hand-pull-up'),
  "hanging-leg-raise": () => import('./hand-hanging-leg-raise'),
  "lat-pulldown": () => import('./hand-lat-pulldown'),
  "seated-cable-row": () => import('./hand-seated-cable-row'),
  "leg-press": () => import('./hand-leg-press'),
  "machine-chest-press": () => import('./hand-machine-chest-press'),
};
export const POSTURE: Readonly<Record<string, () => Promise<{ readonly panels: Readonly<Record<string, string>>; readonly zdots: string }>>> = {
  "lateral-raise": () => import('./posture-lateral-raise'),
  "barbell-back-squat": () => import('./posture-barbell-back-squat'),
  "pull-up": () => import('./posture-pull-up'),
  "hanging-leg-raise": () => import('./posture-hanging-leg-raise'),
  "lat-pulldown": () => import('./posture-lat-pulldown'),
  "seated-cable-row": () => import('./posture-seated-cable-row'),
  "leg-press": () => import('./posture-leg-press'),
  "machine-chest-press": () => import('./posture-machine-chest-press'),
};
export const FEEL: Readonly<Record<string, () => Promise<{ readonly default: { readonly id: string; readonly pre: string; readonly section: string } }>>> = {
  "lateral-raise": () => import('./feel-lateral-raise'),
  "barbell-back-squat": () => import('./feel-barbell-back-squat'),
  "pull-up": () => import('./feel-pull-up'),
  "hanging-leg-raise": () => import('./feel-hanging-leg-raise'),
  "lat-pulldown": () => import('./feel-lat-pulldown'),
  "seated-cable-row": () => import('./feel-seated-cable-row'),
  "leg-press": () => import('./feel-leg-press'),
  "machine-chest-press": () => import('./feel-machine-chest-press'),
};
