// LIB-SHIP W1 (D-SHIP-Q4): pilot A's close-up options, data only, for render/closeups.mjs's zbox shell
// (render/closeup/zbox.mjs), keyed as pilot-a.layers.json's optionsKey. Modelled on closeup/zbox-options.mjs.
// Curl and rope draw their hand zoom here only for the build; the page swaps that block for the pair panel (LIB-7b).
const BASE = {
  shell: 'zbox', bodyHeight: 1.75,
  camera: { kind: 'fitted' },
  still: { kind: 'seat-drop', dropFn: '__none__' },   // seatDrop 0: the still's pose on the plate's own equipment
  css: { marks: ['ref', 'dot'] },
};
const HAND = { mergeParts: ['wrist', 'fingers'], steps: [] };
// PROVISIONAL, NOT APPROVABLE: render/closeup/zbox-geometry.mjs GUIDES has no kind for these sheets' guides (side-line,
// forearm-line, upper-arm-plumb, elbow-angle, plank-line, elbow-plumb); knee-line only lets the shell run. Replace when
// a ruling adds the kinds.
const PROVISIONAL = { kind: 'knee-line', kneeR: 0.05, creaseM: 0.06 };
export const CLOSEUP_OPTIONS = {
  barbell_overhead_press: { ...BASE, guides: { 'forearm-line': PROVISIONAL } },
  dumbbell_biceps_curl: { ...BASE, guides: { 'side-line': PROVISIONAL }, hand: HAND },
  rope_triceps_pushdown: { ...BASE, guides: { 'upper-arm-plumb': PROVISIONAL }, hand: HAND },
  pec_fly: { ...BASE, guides: { 'elbow-angle': PROVISIONAL } },
  plank: { ...BASE, guides: { 'plank-line': PROVISIONAL, 'elbow-plumb': PROVISIONAL } },
};
