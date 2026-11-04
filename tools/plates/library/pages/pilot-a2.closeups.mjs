// LIB-SHIP W2 (D-SHIP-Q4, D-SHIP-SHAPES): pilot A2's close-up options, data only, for render/closeups.mjs's 'zoom' shell,
// keyed as pilot-a2.layers.json's optionsKey. The shell record as pilot-a.closeups.mjs; no id here has a hand zoom
// (hands/no-zoom.json, or archetype none), so each takes NO_HAND below.
const ZOOM = {
  shell: 'zoom', chipText: { feel: 'Feel' },
  crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
  css: { thumb: 'plain' },
};
// No hand close-up: zoom.mjs calls handZoomOf(mod, o.hand) for every record, which reads o.handleChoiceHint and needs a
// known layout; handZoom() itself runs only for a sheet with a hand zoom, so this layout is never drawn.
const NO_HAND = { ...ZOOM, hand: { layout: 'single' } };
export const CLOSEUP_OPTIONS = {
  bent_over_dumbbell_rear_delt_fly: NO_HAND,
};
