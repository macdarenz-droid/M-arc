// V1-07 seeded bad file for matchesResearch: the fixture base with a fourth cue that is also over 60 characters.
import type { ExerciseGuide } from '@/formguide/model';
import { BASE } from '../../bad/base';

export const lib_dumbbell_lateral_raise = { ...BASE, cues: [...BASE.cues, 'Raise the dumbbells slowly out to the sides until level with the shoulders.'] } as ExerciseGuide;
