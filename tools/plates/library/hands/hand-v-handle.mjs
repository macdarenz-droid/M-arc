// LIB-7c key `v-handle` (hands/DESIGN.md §10; D-LIB7c-KEYS): golden B's V-handle, 30 mm = 2 x its grip half-thickness
// 0.015 m (engine/equipment.mjs:132) = HANDLES['v-handle'] (engine/hand.mjs:35). Overhead, the palms face each other, so
// the camera looks at the thumb side (D-LIB7c-CAMERA). Literals only (D-LIB7FIX-PERKEY): the camera words equal
// pairs.mjs's THUMB_SIDE, checked by tests/library/lib7c.test.ts.
import { pullVariant, RULES_FILE } from './radial-rules.mjs';

export const KEY = 'v-handle', OWNER = 'LIB-7c', VIEW = 'radial', INPUTS = [RULES_FILE, 'tools/plates/layers/engine/equipment.mjs'];
export const ORIENTATIONS = { 'neutral-overhead': 'side' };
export const CAMERA_TEXT = { 'neutral-overhead': 'Seen from the thumb side' };
const CG = 'cards/close_grip_pulldown.json';
export const VARIANTS = {
  pull: pullVariant({ thumbClaims: [`${CG}#c16`], wristClaims: [`${CG}#c15`], curledClaims: [`${CG}#c15`], handle: { profile: 'v-handle', diameterMm: 30 } }),
};
export const IDS = {
  close_grip_pulldown: { variant: 'pull', orientation: 'neutral-overhead', faults: ['curled'], claims: [`${CG}#grip.type`, `${CG}#c1`] },
};
export const GAPS = {};
