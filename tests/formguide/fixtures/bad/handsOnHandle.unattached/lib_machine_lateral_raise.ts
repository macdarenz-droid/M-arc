// FG-3 seeded bad file for handsOnHandle: the hands hold the equipment, but the only drive part (the stack) attaches no hand.
import type { ExerciseGuide } from '@/formguide/model';
import { BASE, machineBase, STACK } from '../base';

export const lib_machine_lateral_raise = machineBase({ id: 'fx_bare', settings: {}, drive: [STACK] }, { equipment: BASE.equipment } as Partial<ExerciseGuide>);
