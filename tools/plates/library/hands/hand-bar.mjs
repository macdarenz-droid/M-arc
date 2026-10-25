// LIB-7c key `bar` (hands/DESIGN.md §10; D-LIB7c-KEYS): a straight bar held in both hands, the bar the plate draws. Sizes
// are golden B's composers' (D-LIB7c-HANDLE): pullupBar d 0.032 m (hang and row), latBar d 0.028 m (pulldown),
// engine/equipment.mjs:45, :113. Its declarations are literals (D-LIB7FIX-PERKEY: a key module never imports pairs.mjs).
import { pullVariant, RULES_FILE } from './radial-rules.mjs';

export const KEY = 'bar', OWNER = 'LIB-7c', VIEW = 'radial', INPUTS = [RULES_FILE, 'tools/plates/layers/engine/equipment.mjs'];
export const CONVENTIONS = { 'ga:hang-base': 'GA 3.1 hang: top of the palm where the fingers start; extension 0 to 35' };
const CU = 'cards/chin_up.json', HK = 'cards/hanging_knee_raise.json', AP = 'cards/assisted_pull_up.json';
const IR = 'cards/inverted_row.json', UL = 'cards/underhand_lat_pulldown.json';
const BAR32 = { profile: 'bar-32', diameterMm: 32 }, BAR28 = { profile: 'pulldown-bar', diameterMm: 28 };
/** Hang: golden B hanging_leg_raise's Right pose values (exercises/hanging_leg_raise.howto.mjs:92-93), body weight
 *  hanging from the hand. No force line, as golden B's pull_up (render-pull_up.mjs:84-86); the contact dot stays for G4,
 *  as the lateral raise keeps it. Wrong: the curl at the wrist alone, never golden B's slip pose (follow-up 11). */
const hangVariant = ({ thumbClaims, wristClaims, curledClaims }) => ({
  archetype: 'hang', loadAxis: 'across', loadLine: false, wristRange: [0, 35], contact: 'base', handle: BAR32,
  flags: ['hang: no force line (pull_up), contact dot kept (G4)'],
  right: { view: 'radial', forearm: 180, wrist: { ext: 10, dev: 0 }, contactAt: 1.0, fingers: { curl: 1 }, thumb: 'wrapped', squeeze: 'firm', load: { kind: 'gravity' } },
  rightNote: 'Base of fingers',
  alt: 'Handle across the base of the fingers, thumb wrapped, back of the hand in line with the forearm.',
  claims: { thumb: thumbClaims, wrist: wristClaims, contact: ['ga:hang-base'] },
  faults: {
    curled: { label: 'Wrist curled', side: 'flexed', pose: { wrist: { ext: -30 } }, markers: ['lever-arc'], claims: curledClaims,
      alt: 'Wrist curled forward toward the forearm.' },
  },
});
export const VARIANTS = {
  hang: hangVariant({ thumbClaims: [`${CU}#c1`, `${HK}#c3`, `${AP}#c12`], wristClaims: [`${CU}#c3`, `${HK}#c16`, `${AP}#c14`],
    curledClaims: [`${CU}#c20`, `${HK}#c16`, `${AP}#c14`] }),
  row: pullVariant({ thumbClaims: [`${IR}#c14`], wristClaims: [`${IR}#c15`], curledClaims: [`${IR}#c15`], handle: BAR32 }),
  pulldown: pullVariant({ thumbClaims: [`${UL}#c2`], wristClaims: [`${UL}#c18`], curledClaims: [`${UL}#c18`], handle: BAR28 }),
};
const CURLED = ['curled'];
export const IDS = {
  chin_up: { variant: 'hang', orientation: 'under', faults: CURLED, claims: [`${CU}#grip.type`] },
  hanging_knee_raise: { variant: 'hang', orientation: 'over', faults: CURLED, claims: [`${HK}#grip.type`, `${HK}#c2`] },
  assisted_pull_up: { variant: 'hang', orientation: 'over', faults: CURLED, claims: [`${AP}#grip.type`, `${AP}#c1`] },
  // #c2 names both grips; #grip.type draws overhand (D-LIB7c-ORIENT)
  inverted_row: { variant: 'row', orientation: 'over', faults: CURLED, claims: [`${IR}#grip.type`, `${IR}#c2`] },
  underhand_lat_pulldown: { variant: 'pulldown', orientation: 'under', faults: CURLED, claims: [`${UL}#grip.type`, `${UL}#c1`] },
};
export const GAPS = {};
