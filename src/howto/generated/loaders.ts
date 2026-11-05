// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/ids.mjs). inputsSha256=f2365e442c8cb120e78a8698fdd597f72a87d550993429236f3d9cf4b9941407
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
  "lib_dumbbell_bench_press",
  "lib_dumbbell_shoulder_press",
  "lib_upright_row",
  "lib_dumbbell_biceps_curl",
  "lib_rope_triceps_pushdown",
  "lib_plank",
  "lib_cable_fly",
  "lib_push_up",
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
  lib_dumbbell_bench_press: () => import('./ht-dumbbell-bench-press'),
  lib_dumbbell_shoulder_press: () => import('./ht-dumbbell-shoulder-press'),
  lib_upright_row: () => import('./ht-upright-row'),
  lib_dumbbell_biceps_curl: () => import('./ht-dumbbell-biceps-curl'),
  lib_rope_triceps_pushdown: () => import('./ht-rope-triceps-pushdown'),
  lib_plank: () => import('./ht-plank'),
  lib_cable_fly: () => import('./ht-cable-fly'),
  lib_push_up: () => import('./ht-push-up'),
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
  "dumbbell-biceps-curl": () => import('../../slices/howto/css/zoom-dumbbell-biceps-curl.css').then(() => import('./handpair-curl-dumbbell-under')),
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
  "dumbbell-bench-press": () => import('./posture-dumbbell-bench-press'),
  "dumbbell-shoulder-press": () => import('./posture-dumbbell-shoulder-press'),
  "upright-row": () => import('./posture-upright-row'),
  "dumbbell-biceps-curl": () => import('./posture-dumbbell-biceps-curl'),
  "rope-triceps-pushdown": () => import('./posture-rope-triceps-pushdown'),
  "plank": () => import('./posture-plank'),
  "cable-fly": () => import('./posture-cable-fly'),
  "push-up": () => import('./posture-push-up'),
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
  "dumbbell-bench-press": () => import('./feel-dumbbell-bench-press'),
  "dumbbell-shoulder-press": () => import('./feel-dumbbell-shoulder-press'),
  "upright-row": () => import('./feel-upright-row'),
  "dumbbell-biceps-curl": () => import('./feel-dumbbell-biceps-curl'),
  "rope-triceps-pushdown": () => import('./feel-rope-triceps-pushdown'),
  "plank": () => import('./feel-plank'),
  "cable-fly": () => import('./feel-cable-fly'),
  "push-up": () => import('./feel-push-up'),
};
