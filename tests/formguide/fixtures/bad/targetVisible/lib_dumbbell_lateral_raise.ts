// FG-3 seeded bad file for targetVisible: a target the front view has no overlay for.
import type { ExerciseGuide } from '@/formguide/model';
import { BASE } from '../base';

export const lib_dumbbell_lateral_raise = { ...BASE, muscles: { ...BASE.muscles, target: ['side_delts', 'calves'] } } as ExerciseGuide;
