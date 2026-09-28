// FG-3 seeded bad file for muscleTiming: effort curves that peak on the way down, at 70 % of the rep.
import type { ExerciseGuide } from '@/formguide/model';
import { BASE } from '../base';

export const lib_dumbbell_lateral_raise = { ...BASE, muscles: { ...BASE.muscles, effort: { side_delts: { keys: [[0, 0.1], [0.7, 1], [1, 0.1]] }, front_delts: [0.1, 0.5], upper_traps: 0.1 } }, mistake: { ...BASE.mistake, muscles: { upper_traps: 0.6 } } } as ExerciseGuide;
