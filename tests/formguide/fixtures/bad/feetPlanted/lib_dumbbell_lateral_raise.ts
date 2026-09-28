// FG-3 seeded bad file for feetPlanted: the legs turned out 10° at the hip, so each foot tips off the floor.
import type { ExerciseGuide } from '@/formguide/model';
import { BASE } from '../base';

export const lib_dumbbell_lateral_raise = { ...BASE, joints: { ...BASE.joints, hip_abd: 10 } } as ExerciseGuide;
