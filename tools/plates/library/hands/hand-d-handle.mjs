// LIB-7 key `d-handle` (hands/DESIGN.md §2): a single cable handle, golden-B's `d-handle` profile with its 30 mm drawing
// value passed explicitly (D-LIB7-2). The handle's frame is not drawn (no dimensions sourced).
import { curlVariant, pullVariant, pushVariant, RULES_FILE } from './radial-rules.mjs';

export const KEY = 'd-handle', OWNER = 'LIB-7', VIEW = 'radial', INPUTS = [RULES_FILE];
export const HANDLE = { profile: 'd-handle', diameterMm: 30 };
const PD = 'cards/single_arm_triceps_pushdown.json', LP = 'cards/single_arm_lat_pulldown.json';
export const VARIANTS = {
  // bent back = the inverse of #c9 (wrist neutral), as the card's wrongNote records
  push: pushVariant({ thumbClaims: [`${PD}#c2`], wristClaims: [`${PD}#c9`], bentBackClaims: [`${PD}#c9`] }),
  // contact and thumb inherited from lat_pulldown, as the card's inherit list records
  pull: pullVariant({ thumbClaims: [`${LP}#inherit`], wristClaims: [`${LP}#c15`], curledClaims: [`${LP}#c15`] }),
  curl: curlVariant(),
};
export const IDS = {
  single_arm_triceps_pushdown: { variant: 'push', orientation: 'unstated', faults: ['bent-back'], claims: [`${PD}#grip.type`] },
  single_arm_lat_pulldown: { variant: 'pull', orientation: 'unstated', faults: ['curled'], claims: [`${LP}#grip.type`] },
  bayesian_cable_curl: { variant: 'curl', orientation: 'unstated', faults: ['curled', 'bent-back'], claims: ['shared/curl.json#appliesTo'] },
};
const NO_DIR = 'the claim names no bend direction and the radial view shows only flexion and extension';
export const GAPS = {
  cable_chest_press: `c3: ${NO_DIR} (supervisor ruling 2026-10-02)`,
  cable_fly: `c4: ${NO_DIR}`,
  low_to_high_cable_fly: `c4, c6: ${NO_DIR}`,
  high_to_low_cable_fly: 'no hand zoom on the card',
  cable_lateral_raise: 'no research card',
  cable_rear_delt_fly: 'no research card',
  cable_external_rotation: 'no research card',
  pallof_press: 'no research card',
};
