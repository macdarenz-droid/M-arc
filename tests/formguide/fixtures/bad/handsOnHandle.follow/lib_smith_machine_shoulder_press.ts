// V1-04 seeded bad file for handsOnHandle (A9): the solve fixture with its contacts holding the hands on the true rails
// while the followed handles are drawn 1 unit outside them, so the handle follows the hand along a path that misses it.
import type { ExerciseGuide } from '@/formguide/model';
import { lib_smith_machine_shoulder_press as FX } from '../../solve/lib_smith_machine_shoulder_press';

export const lib_smith_machine_shoulder_press = { ...FX, contacts: FX.contacts!.map(c => ({ ...c, on: c.on.replace('bar', 'rail') })) } as ExerciseGuide;
