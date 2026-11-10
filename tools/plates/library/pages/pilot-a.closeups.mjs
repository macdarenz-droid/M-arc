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
  // LIB-SHIP W8a (SHIP W8a PLAN RULED, #413): back on the page with its 3b plate (pf10 #408 6704679655); its Wrong
  // draws the plate's faulty-arm outlines and drift path (render/closeup/zoom-css.mjs o.outlines, o.path), as PF1 had it
  barbell_overhead_press: { ...ZOOM, css: { ...ZOOM.css, outlines: true, path: true } },
  pec_fly: ZOOM,   // W8a: back on the page with its PF2 plate (pf4 #395 6648800268)
  dumbbell_biceps_curl: { ...ZOOM, hand: { layout: 'single', uid: 'dbc', rightNote: 'Middle of palm', panelHeight: 282 } },
  plank: { ...ZOOM, css: { ...ZOOM.css, spine: true } },   // the hip-line crop's shoulder-heel reference (spine guide)
  rope_triceps_pushdown: ZOOM,
  barbell_row: ZOOM,
  dumbbell_bench_press: ZOOM,
  dumbbell_shoulder_press: ZOOM,
  // LIB-PLATEFIX-1: back on the page with their fixed plates (#379 6633524031)
  romanian_deadlift: ZOOM,
  single_leg_romanian_deadlift: ZOOM,
  triceps_pushdown: ZOOM,
  // LIB-SHIP W3 (Q-W3-14, F-PAIR-FAULTS #386): the palm-flat key's hand zoom, its own note and panel height
  // (hands/hand-palm-flat.mjs: rightNote 'Whole hand down', panelHeight 170); the page swaps it for the pair panel, whose
  // size the key sets (W8a: the page is byte-equal at 170 and 282). W8a (Q-W8a-3, #413): css.spine strokes the hip-line
  // crop's head-to-heel guide.
  mountain_climbers: { ...ZOOM, css: { ...ZOOM.css, spine: true }, hand: { layout: 'single', uid: 'mc', rightNote: 'Whole hand down', panelHeight: 170 } },
};
