// FG-3 seeded bad file for stops: a 6 s rep (the rest stretched to 2.5 s; the elbow-lead keys moved with their phases).
// 100 intervals across its phases no longer give GU-7a's ¼ % of a 3-5 s rep (§2: a rep sums to 3-5 s).
import type { ExerciseGuide } from '@/formguide/model';
import { BASE } from '../base';

export const lib_dumbbell_lateral_raise = { ...BASE, tempo: { lift: 1, hold: 0.5, lower: 2, rest: 2.5 },
  joints: { ...BASE.joints, elbow_lead: { keys: [[0.0639, 0], [0.14, 8], [0.3033, 8], [0.4557, 0]] } } } as ExerciseGuide;
