// LIB-SHIP W3 (D-SHIP-Q4, D-SHIP-SHAPES): the zoom batch's close-up options, data only, for render/closeups.mjs's 'zoom'
// shell, keyed as zoom.layers.json's optionsKey. horizontal_leg_press has no hand zoom (card-no-zoom, Q-W3-10), so it
// takes NO_HAND, as pilot-b.closeups.mjs.
const ZOOM = {
  shell: 'zoom', chipText: { feel: 'Feel' },
  crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
  css: { thumb: 'plain' },
};
// No hand close-up: zoom.mjs calls handZoomOf(mod, o.hand) for every record, which reads o.handleChoiceHint and needs a
// known layout; handZoom() itself runs only for a sheet with a hand zoom, so this layout is never drawn.
const NO_HAND = { ...ZOOM, hand: { layout: 'single' } };
// W3 LAYERS FIX (#384 6648454032, L5): the leg-line outlines' styles (zoom-css 'outlines', golden B's hanging_leg_raise).
const LINES = r => ({ ...r, css: { ...r.css, outlines: true } });
export const CLOSEUP_OPTIONS = {
  horizontal_leg_press: LINES(NO_HAND),
};
