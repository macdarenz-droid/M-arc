// FG-3 seeded bad file for mistakeSane: a tell names the elbow bend, which the mistake never changes.
import type { ExerciseGuide } from '@/formguide/model';
import { BASE } from '../base';

export const lib_dumbbell_lateral_raise = { ...BASE, mistake: { ...BASE.mistake, tells: [...BASE.mistake.tells, { text: 'The elbows bend.', joint: 'elbow_flex' }] } } as ExerciseGuide;
