// V1-09: the machines library (docs/FORM-GUIDE-PRODUCTION.md §4). One slot file per machine, so the cards that draw
// them never edit this file: each fills its own `machines/<id>.ts`. A null slot is a machine not drawn yet.
import type { MachineArt } from './primitives';
import { leg_press_45 } from './leg_press_45';
import { dual_pulley } from './dual_pulley';
import { row_station } from './row_station';
import { leg_extension } from './leg_extension';
import { leg_curl_seated } from './leg_curl_seated';
import { calf_seated } from './calf_seated';
import { pulldown_station } from './pulldown_station';
import { chest_press } from './chest_press';
import { shoulder_press } from './shoulder_press';
import { pec_deck } from './pec_deck';

export type { MachineArt, Stack } from './primitives';

/** The card that draws each slot (FORM-GUIDE-PRODUCTION.md §10). */
export const MACHINE_CARDS = {
  leg_press_45: 'V1-14', dual_pulley: 'V1-15', row_station: 'V1-15', leg_extension: 'V1-16', leg_curl_seated: 'V1-16',
  calf_seated: 'V1-16', pulldown_station: 'V1-17', chest_press: 'V1-18', shoulder_press: 'V1-18', pec_deck: 'V1-23',
} as const;
export type MachineSlot = keyof typeof MACHINE_CARDS;

/** Read by any id (an id with no slot reads undefined); the `satisfies` keeps exactly one entry per slot. */
export const MACHINES: Readonly<Record<string, MachineArt | null>> = {
  leg_press_45, dual_pulley, row_station, leg_extension, leg_curl_seated, calf_seated, pulldown_station, chest_press,
  shoulder_press, pec_deck,
} satisfies Record<MachineSlot, MachineArt | null>;

const isSlot = (id: string): id is MachineSlot => Object.prototype.hasOwnProperty.call(MACHINE_CARDS, id);

/** A machine's drawing, or why there is none: a slot not drawn yet names its card; any other id has no slot. */
export function machineFor(id: string, extra: Record<string, MachineArt> = {}): MachineArt | string {
  const m = extra[id] ?? (isSlot(id) ? MACHINES[id] : undefined);
  if (m) return m;
  return isSlot(id) ? `machine ${id} is drawn by ${MACHINE_CARDS[id]}` : `machine ${id} has no drawing (no slot in machines/index.ts)`;
}
