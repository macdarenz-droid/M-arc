// FG-3 seeded bad file for everyPoseRenders: a machine whose drawing is empty, so the setup moment draws nothing.
import type { ExerciseGuide } from '@/formguide/model';
import { machineBase } from '../base';

export const lib_machine_lateral_raise = machineBase({ id: 'fx_empty', settings: {}, drive: [] });
