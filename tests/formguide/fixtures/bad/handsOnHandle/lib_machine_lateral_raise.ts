// FG-3 seeded bad file for handsOnHandle: the cable handle runs along a line the right hand never reaches.
import type { ExerciseGuide } from '@/formguide/model';
import { machineBase } from '../base';

export const lib_machine_lateral_raise = machineBase({ id: 'fx_cable', settings: {}, drive: [{ part: 'handle', travel: [0, 1], chain: ['shoulder_r', 'elbow_r', 'wrist_r'] }] });
