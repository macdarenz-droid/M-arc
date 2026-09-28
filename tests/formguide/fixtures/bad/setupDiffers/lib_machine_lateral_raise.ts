// FG-3 seeded bad file for setupDiffers: the wrong seat setting is the right one, so the setup pair shows no difference.
import type { ExerciseGuide } from '@/formguide/model';
import { BASE, machineBase } from '../base';

export const lib_machine_lateral_raise = machineBase({ id: 'fx_seat', settings: { seat: 0.4 }, drive: [] },
  { mistake: { ...BASE.mistake, setup: { setting: 'seat', wrong: 0.4, text: 'Seat too low: the arms start below the pads.' } } } as Partial<ExerciseGuide>);
