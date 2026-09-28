// FG-3 seeded bad file for pathBudget: a kettlebell drawn with 26 paths (a part may have 25).
import type { ExerciseGuide } from '@/formguide/model';
import { BASE } from '../base';

export const lib_dumbbell_lateral_raise = { ...BASE, equipment: { ...BASE.equipment, kind: 'kettlebell' } } as ExerciseGuide;
