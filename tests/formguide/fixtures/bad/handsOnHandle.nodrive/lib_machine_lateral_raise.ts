// FG-3 seeded bad file for handsOnHandle: a machine file whose hands hold the equipment but whose drive list is empty.
import type { ExerciseGuide } from '@/formguide/model';
import { BASE, machineBase } from '../base';

export const lib_machine_lateral_raise = machineBase({ id: 'fx_bare', settings: {}, drive: [] }, { equipment: BASE.equipment } as Partial<ExerciseGuide>);
