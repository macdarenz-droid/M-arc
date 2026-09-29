// V1-07 seeded bad file for contactsHeld: the V1-04 press with each hand's contact on its rail, not on the handle it
// leads. The rails lie on the handles' paths here (fixture.json), so every hand is held on the line and every handle
// follows its hand (handsOnHandle and machinePivot pass), but no contact holds the followed point on its own part.
import type { ExerciseGuide } from '@/formguide/model';
import { lib_smith_machine_shoulder_press as FX } from '../../solve/lib_smith_machine_shoulder_press';

export const lib_smith_machine_shoulder_press = { ...FX, contacts: FX.contacts!.map(c => ({ ...c, on: c.on.replace('bar', 'rail') })) } as ExerciseGuide;
