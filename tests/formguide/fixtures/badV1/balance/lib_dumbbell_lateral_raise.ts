// V1-07 seeded bad file for balance: the fixture base whose mistake leans the whole body 13° off its feet (sway), on the
// widest camera (full and zoom) so the frame still holds it; its centre of mass leaves the foot base.
import type { ExerciseGuide } from '@/formguide/model';
import { BASE } from '../../bad/base';

export const lib_dumbbell_lateral_raise = {
  ...BASE, camera: { ...BASE.camera, full: 'lyingSide', zoom: 'lyingSide' },
  mistake: { ...BASE.mistake, joints: { ...BASE.mistake.joints, sway: { keys: [[0, 0], [0.1, 13], [0.3, 13], [0.475, 0]] } } },
} as ExerciseGuide;
