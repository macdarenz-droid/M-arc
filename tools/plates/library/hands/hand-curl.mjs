// LIB-7 key `curl` (hands/DESIGN.md §2): curls on a dumbbell (variant `dumbbell`) or a straight bar (variant `bar`).
// Sizes are drawing values (D-LIB7-2): golden-B's dumbbell 32 mm with a 120 mm head, the 28 mm bar.
import { curlVariant, RULES_FILE } from './radial-rules.mjs';

export const KEY = 'curl', OWNER = 'LIB-7', VIEW = 'radial', INPUTS = [RULES_FILE];
export const HANDLE = { profile: 'dumbbell', diameterMm: 32, headMm: 120 };
export const VARIANTS = {
  dumbbell: curlVariant(),
  bar: curlVariant({ handle: { profile: 'bar-28', diameterMm: 28 },
    bentBackClaims: ['cards/barbell_curl.json#c8', 'cards/cable_curl.json#c9', 'shared/curl.json#c3'] }),
};
const BOTH = ['curled', 'bent-back'];
export const IDS = {
  dumbbell_biceps_curl: { variant: 'dumbbell', orientation: 'under', faults: BOTH, claims: ['cards/dumbbell_biceps_curl.json#c1'] },
  alternating_dumbbell_curl: { variant: 'dumbbell', orientation: 'under', faults: BOTH, claims: ['cards/alternating_dumbbell_curl.json#c2'] },
  incline_dumbbell_curl: { variant: 'dumbbell', orientation: 'under', faults: BOTH, claims: ['cards/incline_dumbbell_curl.json#c11'] },
  // the cards' own Wrongs (a twist toward palms up, hammer_curl #c5; "twisted or bent", cross_body #c7) are rotations
  // the radial view can't show: recorded, not drawn; shared/curl.json's flexion and extension faults are drawn
  hammer_curl: { variant: 'dumbbell', orientation: 'neutral', faults: BOTH, claims: ['shared/curl.json#c2'] },
  cross_body_hammer_curl: { variant: 'dumbbell', orientation: 'neutral', faults: BOTH, claims: ['cards/cross_body_hammer_curl.json#c1'] },
  concentration_curl: { variant: 'dumbbell', orientation: 'unstated', faults: BOTH, claims: [] },
  barbell_curl: { variant: 'bar', orientation: 'under', faults: ['bent-back', 'curled'], claims: ['cards/barbell_curl.json#c1'] },
  cable_curl: { variant: 'bar', orientation: 'under', faults: ['bent-back', 'curled'], claims: ['cards/cable_curl.json#c1'] },
};
export const GAPS = {
  wrist_curl: 'exempt: the wrist is the moving joint (shared/wrist-curl-exemption.json)',
};
