// FG-3 seeded bad file for bodyOnPad: a chest pad the chest never touches.
import type { ExerciseGuide } from '@/formguide/model';
import { machineBase, STACK } from '../base';

export const lib_machine_lateral_raise = machineBase({ id: 'fx_pad', settings: {}, drive: [STACK] });
