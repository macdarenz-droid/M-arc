// LIB-SHIP W1, W2 (D-SHIP-Q4, D-SHIP-SHAPES): pilot A's close-up options, data only, for render/closeups.mjs's 'zoom' shell
// (render/closeup/zoom.mjs, crop.mjs, hand.mjs), keyed as pilot-a.layers.json's optionsKey. Modelled on
// render/closeups-8.mjs (seated_cable_row's record: single hand page, engine crops). The zoom shell's posture callouts
// carry an anchor dot and need no guide mark. Curl draws its hand zoom here only for the build; the page
// swaps that block for the pair panel (LIB-7b). Every other id has no hand zoom (hands/no-zoom.json, or archetype
// none) and takes the shell record with no `hand`.
const ZOOM = {
  shell: 'zoom', chipText: { feel: 'Feel' },
  crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
  css: { thumb: 'plain' },
};
export const CLOSEUP_OPTIONS = {
  upright_row: ZOOM,
  dumbbell_biceps_curl: { ...ZOOM, hand: { layout: 'single', uid: 'dbc', rightNote: 'Middle of palm', panelHeight: 282 } },
  plank: { ...ZOOM, css: { ...ZOOM.css, spine: true } },   // the hip-line crop's shoulder-heel reference (spine guide)
  rope_triceps_pushdown: ZOOM,
  barbell_row: ZOOM,
  dumbbell_bench_press: ZOOM,
  dumbbell_shoulder_press: ZOOM,
};
