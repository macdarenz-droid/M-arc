// LIB-SHIP W2 (D-SHIP-Q4, D-SHIP-SHAPES): pilot B2's close-up options, data only, for render/closeups.mjs's 'zoom' shell,
// keyed as pilot-b2.layers.json's optionsKey. The shell record as pilot-a.closeups.mjs; no id here has a hand zoom
// (hands/no-zoom.json, or archetype none), so each takes the plain shell record (D-CROP-NONE, #380).
const ZOOM = {
  shell: 'zoom', chipText: { feel: 'Feel' },
  crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
  css: { thumb: 'plain' },
};
export const CLOSEUP_OPTIONS = {
  // W2 panel fix: the chin Wrong's pull arrow is a `path` guide, so its css (render/closeup/zoom-css.mjs o.path)
  crunch: { ...ZOOM, css: { ...ZOOM.css, path: true } },
};
