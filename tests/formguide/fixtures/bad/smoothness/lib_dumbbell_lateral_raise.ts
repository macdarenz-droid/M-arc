// FG-3 seeded bad file for smoothness: the raise is still moving fast when the lift ends and drifts on through the hold (edge speed).
import type { ExerciseGuide } from '@/formguide/model';
import { BASE } from '../base';

export const lib_dumbbell_lateral_raise = { ...BASE, joints: { ...BASE.joints, shoulder_abd: { keys: [[0, 10], [0.3, 88], [0.375, 88], [0.875, 10]] } } } as ExerciseGuide;
