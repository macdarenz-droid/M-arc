// LIB-7 key `ez` (hands/DESIGN.md §2): the EZ bar's angled grip, seen end-on in the radial view (the angle itself lies
// along the line of sight and is not drawn; no source gives it). 28 mm drawing value (D-LIB7-2), passed explicitly.
import { curlVariant, pushVariant, RULES_FILE } from './radial-rules.mjs';

export const KEY = 'ez', OWNER = 'LIB-7', VIEW = 'radial', INPUTS = [RULES_FILE];
export const HANDLE = { profile: 'ez-bend', diameterMm: 28 };
export const VARIANTS = {
  curl: curlVariant({ wristClaims: ['cards/ez_bar_curl.json#c8', 'cards/preacher_curl.json#c8', 'cards/reverse_curl.json#c6'],
    bentBackClaims: ['cards/ez_bar_curl.json#c8', 'cards/preacher_curl.json#c8', 'cards/reverse_curl.json#c6'] }),
  // parked (D-LIB7-19a): no id draws it until golden-B follow-up 9 (skull_crusher: orientation over, faults ['bent-back'],
  // claims ['cards/skull_crusher.json#c1'])
  push: pushVariant({ thumbClaims: ['cards/skull_crusher.json#c1'], wristClaims: ['cards/skull_crusher.json#c3'], bentBackClaims: ['cards/skull_crusher.json#c3'] }),
};
export const IDS = {
  // angled grip: #c1 "underhand on its angled sections", #c2 "semi-supinated (half-way between palms up and palms in)" (D-LIB7-15)
  ez_bar_curl: { variant: 'curl', orientation: 'angled', faults: ['bent-back', 'curled'], claims: ['cards/ez_bar_curl.json#c1', 'cards/ez_bar_curl.json#c2'] },
  preacher_curl: { variant: 'curl', orientation: 'under', faults: ['bent-back', 'curled'], claims: ['cards/preacher_curl.json#c1'] },
  reverse_curl: { variant: 'curl', orientation: 'over', faults: ['bent-back', 'curled'], claims: ['cards/reverse_curl.json#c1'] },
};
export const GAPS = {
  skull_crusher: 'golden-B follow-up 9: the engine cannot seat a heel push low and over the forearm (D-LIB7-19a); the push variant is parked until plan 2.8 fixes it',
};
