// LIB-SHIP W1, W2 (D-SHIP-Q4, D-SHIP-SHAPES): pilot A's close-up options, data only, for render/closeups.mjs's 'zoom' shell
// (render/closeup/zoom.mjs, crop.mjs, hand.mjs), keyed as pilot-a.layers.json's optionsKey. Modelled on
// render/closeups-8.mjs (seated_cable_row's record: single hand page, engine crops). The zoom shell's posture callouts
// carry an anchor dot and need no guide mark. Curl and mountain climbers draw their hand zoom here only for the build; the page
// swaps that block for the pair panel (LIB-7b). Every other id has no hand zoom (hands/no-zoom.json, or archetype
// none) and takes the shell record with no `hand`.
const ZOOM = {
  shell: 'zoom', chipText: { feel: 'Feel' },
  crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
  css: { thumb: 'plain' },
};
export const CLOSEUP_OPTIONS = {
  pec_fly: ZOOM,
  upright_row: ZOOM,
  barbell_overhead_press: ZOOM,
  dumbbell_biceps_curl: { ...ZOOM, hand: { layout: 'single', uid: 'dbc', rightNote: 'Middle of palm', panelHeight: 282 } },
  plank: ZOOM,
  rope_triceps_pushdown: ZOOM,
  barbell_row: ZOOM,
  dumbbell_bench_press: ZOOM,
  dumbbell_shoulder_press: ZOOM,
  // W2: the palm-flat pair (words/palm-flat-floor-over.json); the key's rightNote and render default panel height
  // (hand-palm-flat.mjs VARIANTS.floor, render). The page swaps this block for the pair panel (LIB-7b).
  mountain_climbers: { ...ZOOM, hand: { layout: 'single', uid: 'mc', rightNote: 'Whole hand down', panelHeight: 170 } },
  romanian_deadlift: ZOOM,
  single_leg_romanian_deadlift: ZOOM,
  triceps_pushdown: ZOOM,
};
