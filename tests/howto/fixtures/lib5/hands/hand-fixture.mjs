// LIB-5 (D-LIB5-FAULTKEYS 4): a fixture hand module in LIB-7's shape (#193 @ 55e91e9, hand-rope.mjs), so the family
// reader is proven before any hand-*.mjs is on main. Known fault count: 3 (two variants). Never drawn or shipped.
export const KEY = 'fixture', OWNER = 'LIB-5', VIEW = 'radial', INPUTS = [];
export const HANDLE = { profile: 'round', diameterMm: 28 };
export const VARIANTS = {
  floor: {
    archetype: 'on-body', rightNote: 'Palm flat',
    faults: {
      'hand-ahead': { label: 'Hand ahead', side: 'ahead', claims: ['shared/palm-flat.json#c3'] },
      'cupped-palm': { label: 'Palm cupped', side: 'cupped', claims: ['shared/palm-flat.json#c2'] },
    },
  },
  push: {
    archetype: 'push', rightNote: 'Middle of palm',
    faults: { curled: { label: 'Wrist curled', side: 'flexed', claims: ['shared/rope-rule.json#c6'] } },
  },
};
export const IDS = { fixture_exercise: { variant: 'floor', faults: ['hand-ahead', 'cupped-palm'] } };
export const GAPS = {};
