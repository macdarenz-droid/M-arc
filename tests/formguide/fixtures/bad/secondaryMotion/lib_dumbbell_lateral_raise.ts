// FG-3 seeded bad file for secondaryMotion: the shoulder rises to 88° with no blade rhythm written.
import type { ExerciseGuide } from '@/formguide/model';
import { BASE } from '../base';

export const lib_dumbbell_lateral_raise = { ...BASE, movement: { ...BASE.movement, bladeRhythm: undefined } } as ExerciseGuide;
