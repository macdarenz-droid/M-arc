// FG-3 seeded bad file for machinePivot: a lever whose pivot sits 30 units from the shoulder it turns about.
import type { ExerciseGuide } from '@/formguide/model';
import { machineBase } from '../base';

export const lib_machine_lateral_raise = machineBase({ id: 'fx_lever', settings: {}, drive: [{ part: 'arm', travel: [0, 1], chain: ['shoulder_r'] }] });
