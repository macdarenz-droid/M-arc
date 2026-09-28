// FG-3 seeded bad file for themes: a kettlebell drawn with a literal colour.
import type { ExerciseGuide } from '@/formguide/model';
import { BASE } from '../base';

export const lib_dumbbell_lateral_raise = { ...BASE, equipment: { ...BASE.equipment, kind: 'kettlebell' } } as ExerciseGuide;
