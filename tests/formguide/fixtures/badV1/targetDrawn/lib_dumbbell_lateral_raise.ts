// V1-07 seeded bad file for targetDrawn (A4): a front file targeting lats. The front overlays list lats, so targetVisible
// passes, but the front figure paints tints for side_delts, front_delts and upper_traps only.
import type { ExerciseGuide } from '@/formguide/model';
import { BASE } from '../../bad/base';

export const lib_dumbbell_lateral_raise = { ...BASE, muscles: { ...BASE.muscles, target: ['side_delts', 'lats'] } } as ExerciseGuide;
