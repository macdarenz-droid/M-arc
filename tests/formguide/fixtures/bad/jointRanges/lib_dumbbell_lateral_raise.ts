// FG-3 seeded bad file for jointRanges: soft knees at 12°, past the research range (0..10°).
import type { ExerciseGuide } from '@/formguide/model';
import { BASE } from '../base';

export const lib_dumbbell_lateral_raise = { ...BASE, joints: { ...BASE.joints, knee_flex: 12 } } as ExerciseGuide;
