// LIB-SHIP W5 (D-SHIP-Q4, D-SHIP-SHAPES): LB5's close-up options, data only, for render/closeups.mjs's 'zoom' shell,
// keyed as lb05.layers.json's optionsKey; the shell record as pilot-a.closeups.mjs. Pair-key ids draw their hand zoom
// here only for the build; the page swaps that block for the pair panel (LIB-7b). rightNote is every curl/ez words file's
// right note ('Middle of palm', hands/words/*.json) and the panel height is the W1 curl's. Every other id has no hand
// zoom (hands/no-zoom.json, NoHandling or archetype none) and takes the shell record with no `hand`.
const ZOOM = {
  shell: 'zoom', chipText: { feel: 'Feel' },
  crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
  css: { thumb: 'plain' },
};
export const CLOSEUP_OPTIONS = {
  preacher_curl: { ...ZOOM, hand: { layout: 'single', uid: 'pc', rightNote: 'Middle of palm', panelHeight: 282 } },
  cable_curl: { ...ZOOM, hand: { layout: 'single', uid: 'cc', rightNote: 'Middle of palm', panelHeight: 282 } },
  bayesian_cable_curl: ZOOM,
  concentration_curl: ZOOM,
  dumbbell_overhead_triceps_extension: ZOOM,
  cross_body_hammer_curl: { ...ZOOM, hand: { layout: 'single', uid: 'cbhc', rightNote: 'Middle of palm', panelHeight: 282 } },
  wrist_curl: ZOOM,
  hammer_curl: { ...ZOOM, hand: { layout: 'single', uid: 'hc', rightNote: 'Middle of palm', panelHeight: 282 } },
  alternating_dumbbell_curl: { ...ZOOM, hand: { layout: 'single', uid: 'adc', rightNote: 'Middle of palm', panelHeight: 282 } },
  single_arm_triceps_pushdown: ZOOM,
  incline_dumbbell_curl: { ...ZOOM, hand: { layout: 'single', uid: 'idc', rightNote: 'Middle of palm', panelHeight: 282 } },
  straight_bar_triceps_pushdown: ZOOM,
  barbell_curl: { ...ZOOM, hand: { layout: 'single', uid: 'bc', rightNote: 'Middle of palm', panelHeight: 282 } },
  ez_bar_curl: { ...ZOOM, hand: { layout: 'single', uid: 'ebc', rightNote: 'Middle of palm', panelHeight: 282 } },
  reverse_curl: { ...ZOOM, hand: { layout: 'single', uid: 'rc', rightNote: 'Middle of palm', panelHeight: 282 } },
};
