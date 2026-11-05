// LIB-SHIP W5: the How-to content of lib_bodyweight_split_squat (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/bodyweight_split_squat.json; its claim ids are named on each field's claim.
// Handling: none (card archetype.hand 'none'; grip.type "none", grip note: bodyweight; thumb, contact and wrist empty,
// so no hand claim and no hand zoom).
// Zooms: one per card zoom. front-shin's Wrong is the plate's drawn Mistake (the front knee slid forward, c2); trunk's
// Wrong is the bottom pose with the chest pitched forward (still below; the card's wrongNote: the inverse of c2).
// Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints (mapped below); D-TEXT-GOLDEN: every
// card posture point and handlingMistake claim is also in a shown slot (LIB-SHIP W5 notes, G1 table).
// Red flag: the card's redFlags (knee), golden B's shared knee block, linked by the knee row.
import plateSpec from '../specs/bodyweight_split_squat.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'cat-splitsquat': { cite: 'Catalyst Athletics, Split Squat (Exercise Library)', url: 'https://www.catalystathletics.com/exercise/174/Split-Squat/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'nhs-knee': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/conditions/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
};
// Not cited: escamilla-2025 (c7, glute activity with the feet fixed; no field here restates it); c8 (loading
// implements, a progression).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const CAT = 'cat-splitsquat';
const CL = {
  c1: C(['CONSENSUS'], [CAT], 'c1'),
  c2: C(['CONSENSUS'], [CAT], 'c2'),
  c3: C(['CONSENSUS'], [CAT], 'c3'),
  c4: C(['CONSENSUS'], [CAT], 'c4'),
  c6: C(['CONSENSUS'], [CAT], 'c6'),
  c9: C(['CONSENSUS'], ['nhs-knee'], 'c9'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the start (c3), the bottom (end: c1, c2) and the spec's Mistake pose (card
// plate.mistake, c2: the front knee slid forward, the front shin tipped well past vertical), which is the card zoom
// front-shin's Wrong. One new still:
//   'chest-forward' (card zoom trunk Wrong, "Chest pitched forward"; the card's wrongNote: the inverse of c2): the
//         bottom pose with the pelvis and trunk pitched LEAN deg forward and the arms plumb (shoulder flexion = lean, the
//         spec's own arms() rule); feet held. lib_reverse_lunge's CHEST_FORWARD, copied (the plate is its clone).
// DRAWING VALUE (D-SHIP-DRAWVAL, #376 6614695581; precedent lib_reverse_lunge's LEAN 30 deg, the same Wrong on the same
// clone): LEAN 30 deg is a Wrong-pose size no card gives; no number from it appears in user copy; the layers panel
// judges it.
const LEAN = 30;
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const CHEST_FORWARD = { root: { ...END.root, tilt: LEAN }, shoulder: { flex: LEAN } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  'knee-forward': { pose: { ...END, ...MIS } },
  'chest-forward': { pose: { ...END, ...CHEST_FORWARD } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// The zoom shell's shape (callout with an anchor at the landmark it names; pilot-a.closeups.mjs), as
// lib_reverse_lunge's; each Wrong is drawn alone (solid). Crop centres (`off`) and `sizePx` are drawing values the layers
// panel judges.
const zooms = [
  {
    key: 'front-shin', chip: 'Shin', heading: 'Front shin', kind: 'posture',
    crop: { center: { at: 'knee.r', pose: 'right', off: [0, 10] }, sizePx: 160 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Shin vertical', anchor: 'knee.r' },
      wrong: { text: 'Knee forward', anchor: 'knee.r' },
    },
    caption: {
      right: 'Front shin about vertical.',
      wrong: 'Front knee slid forward, shin tipped far forward.',
    },
    alt: {
      right: 'Side view, bottom of the split squat. The front knee is over the ankle, the front shin about vertical.',
      wrong: 'Side view, bottom of the split squat. The front knee has slid forward, the shin tipped far forward.',   // W5 K1 (c2)
    },
  },
  {
    key: 'trunk', chip: 'Trunk', heading: 'Trunk angle', kind: 'posture',
    crop: { center: { at: 'sternum', pose: 'right', off: [0, 10] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: CHEST_FORWARD, solid: true },
    callout: {
      right: { text: 'Trunk upright', anchor: 'sternum' },
      wrong: { text: 'Chest forward', anchor: 'sternum' },
    },
    caption: {
      right: 'Trunk upright over the hips.',
      wrong: 'Chest pitched forward.',
    },
    alt: {
      right: 'Side view, bottom of the split squat. The trunk is upright over the hips, the arms hang at the sides.',
      wrong: 'Side view, bottom of the split squat. The chest is pitched forward over the front thigh.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  // c4 (split length shifts the emphasis), the card posture point 'Front foot farther forward ... closer ...' (D-TEXT-GOLDEN)
  primary: [{ muscleId: 'quads', plain: 'The front thigh works, more with the front foot closer.' }],
  secondary: [{ muscleId: 'glutes', plain: 'The back of the hip works more with the front foot farther forward.' }],
  watch: [{ muscleId: 'hip_flexors', plain: 'A stretch at the front of the back hip, more with a longer split.' }],
  // The card's first two rows (front of the front thigh; front of the back hip, c4) have no fix, so they are left off
  // the rows (D-SHIP-Q16); the feel line and the watch line say them.
  feelLine: 'You should feel this in the front thigh. The front of the back hip stretches.',
  rows: [
    { key: 'knee', where: 'Very painful, locking or giving-way knee', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Not a training feeling.',
      fix: 'Stop the set.',
      redFlag: 'knee', claim: CL.c9 },
  ],
  claim: CL.c4,
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'crash', text: 'Crashing into the bottom instead of lowering smoothly.', claim: CL.c6 },
];

export default {
  schema: 1,
  id: 'lib_bodyweight_split_squat',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'position', text: 'Stand in a split stance, one foot forward, one back.', claim: CL.c1 },
    // c4 (card posture point) moved here from the feel lines (not shown on the page, D-TEXT-GOLDEN)
    { kind: 'position', text: 'Front foot farther forward for more hip work, closer for more quads.', claim: CL.c4 },
    { kind: 'position', text: 'Bend both knees, lowering smoothly until the back knee lightly touches.',
      claim: C(['CONSENSUS'], [CAT], 'c1, c6') },
    { kind: 'position', text: 'Keep the trunk upright and the front shin about vertical.', zoom: 'front-shin', claim: CL.c2 },
    { kind: 'finish', text: 'Stand back up until the front knee is about straight.', claim: CL.c3 },
  ],
  posture: [
    { key: 'trunk', label: 'Trunk upright', detail: 'Trunk upright.',
      anchor: { landmark: 'sternum', pose: 'end' }, zoom: 'trunk', claim: CL.c2 },
    // Q-W2-12: handlingMistake 'Front knee sliding forward.' (c2) merged here; its fix is this detail
    { key: 'shin', label: 'Front shin vertical', detail: 'Front shin about vertical at the bottom.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'front-shin', claim: CL.c2 },
    { key: 'split', label: 'Split length', detail: 'Front foot farther forward for more hip work, closer for more quads.',
      anchor: { landmark: 'ankle.r', pose: 'end' }, claim: CL.c4 },
    // Q-W2-12: handlingMistake 'Dropping fast into the bottom.' (c6, c1)
    { key: 'drop', label: 'Dropping fast', detail: 'Lower smoothly until the back knee just touches.',
      anchor: { landmark: 'knee.l', pose: 'end' }, claim: C(['CONSENSUS'], [CAT], 'c6, c1') },
  ],
  feel,
  zooms,
  chips: ['front-shin', 'trunk', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Split stance, one foot forward, one back. Lower until the back knee lightly touches the floor.',
    mistakeLine: 'Never let the front knee slide forward. Keep the front shin about vertical at the bottom.',
    cueLine: 'Trunk upright, front shin vertical.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['knee'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/bodyweight_split_squat.json', rev: 1 },
};
