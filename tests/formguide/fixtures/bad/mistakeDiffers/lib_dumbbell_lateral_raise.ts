// FG-3 seeded bad file for mistakeDiffers: the mistake keeps the correct tempo and only shrugs, dips and turns the thumbs: the hands move as fast as in the right rep.
import type { ExerciseGuide } from '@/formguide/model';
import { BASE } from '../base';

export const lib_dumbbell_lateral_raise = { ...BASE, mistake: { ...BASE.mistake, tempo: undefined, joints: { knee_flex: [0, 6], shrug_cm: [0, 5], wrist_pron: [0, 40] } } } as ExerciseGuide;
