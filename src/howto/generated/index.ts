// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/plates.mjs). inputsSha256=5144ed2dfd81b1d1d80b1746b76dd40548b7d4ada7dc186fe2b2fa062d64f7e2
import type { BuiltHowTo, LibId } from '../types';

export const LOADERS: Record<LibId, () => Promise<{ default: BuiltHowTo }>> = {
  lib_dumbbell_lateral_raise: () => import('./ht-dumbbell-lateral-raise'),
  lib_barbell_back_squat: () => import('./ht-barbell-back-squat'),
  lib_pull_up: () => import('./ht-pull-up'),
  lib_hanging_leg_raise: () => import('./ht-hanging-leg-raise'),
  lib_lat_pulldown: () => import('./ht-lat-pulldown'),
  lib_seated_cable_row: () => import('./ht-seated-cable-row'),
  lib_leg_press: () => import('./ht-leg-press'),
  lib_machine_chest_press: () => import('./ht-machine-chest-press'),
};
