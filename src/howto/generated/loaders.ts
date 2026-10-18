// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/ids.mjs). inputsSha256=7673ea4972d668587c3422f78628585edbb0667580cb12183d17376fdabfce9c
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
  "lib_barbell_row",
  "lib_one_arm_dumbbell_row",
  "lib_t_bar_row",
  "lib_landmine_row",
  "lib_smith_machine_bench_press",
  "lib_smith_machine_incline_press",
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
  lib_barbell_row: () => import('./ht-barbell-row'),
  lib_one_arm_dumbbell_row: () => import('./ht-one-arm-dumbbell-row'),
  lib_t_bar_row: () => import('./ht-t-bar-row'),
  lib_landmine_row: () => import('./ht-landmine-row'),
  lib_smith_machine_bench_press: () => import('./ht-smith-machine-bench-press'),
  lib_smith_machine_incline_press: () => import('./ht-smith-machine-incline-press'),
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
  "barbell-row": () => import('../../slices/howto/css/zoom-barbell-row.css').then(() => import('./handpair-lib4c-scratch-a')),
  "one-arm-dumbbell-row": () => import('../../slices/howto/css/zoom-one-arm-dumbbell-row.css').then(() => import('./handpair-lib4c-scratch-b')),
  "t-bar-row": () => import('../../slices/howto/css/zoom-t-bar-row.css').then(() => import('./handpair-lib4c-scratch-c')),
  "landmine-row": () => import('../../slices/howto/css/zoom-landmine-row.css').then(() => import('./handpair-lib4c-scratch-d')),
  "smith-machine-bench-press": () => import('../../slices/howto/css/zoom-smith-machine-bench-press.css').then(() => import('./handpair-lib4c-scratch-e')),
  "smith-machine-incline-press": () => import('../../slices/howto/css/zoom-smith-machine-incline-press.css').then(() => import('./handpair-lib4c-scratch-f')),
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
  "barbell-row": () => import('./posture-barbell-row'),
  "one-arm-dumbbell-row": () => import('./posture-one-arm-dumbbell-row'),
  "t-bar-row": () => import('./posture-t-bar-row'),
  "landmine-row": () => import('./posture-landmine-row'),
  "smith-machine-bench-press": () => import('./posture-smith-machine-bench-press'),
  "smith-machine-incline-press": () => import('./posture-smith-machine-incline-press'),
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
  "barbell-row": () => import('./feel-barbell-row'),
  "one-arm-dumbbell-row": () => import('./feel-one-arm-dumbbell-row'),
  "t-bar-row": () => import('./feel-t-bar-row'),
  "landmine-row": () => import('./feel-landmine-row'),
  "smith-machine-bench-press": () => import('./feel-smith-machine-bench-press'),
  "smith-machine-incline-press": () => import('./feel-smith-machine-incline-press'),
};
