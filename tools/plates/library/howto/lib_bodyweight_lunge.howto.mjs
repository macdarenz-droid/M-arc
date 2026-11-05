// LIB-SHIP W5: the How-to content of lib_bodyweight_lunge (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/bodyweight_lunge.json; its claim ids are named on each field's claim.
// Handling: none (card archetype.hand 'none'; grip.type "none", grip note: bodyweight, ACE gives no arm position; thumb,
// contact and wrist empty, so no hand claim and no hand zoom).
// Zooms: one per card zoom. front-shin's Wrong is the plate's drawn Mistake (hips and front knee driven forward, c3);
// back's Wrong is the bottom pose with a rounded back (still below; the card's wrongNote: the inverse of c5).
// Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints (mapped below); D-TEXT-GOLDEN: every
// card posture point and handlingMistake claim is also in a shown slot (LIB-SHIP W5 notes, G1 table). The sideways
// tilt (c2) needs a front view (the spec's header), so it is a text checkpoint shown in setup step 3 and the mistake line.
// Red flag: the card's redFlags (knee), golden B's shared knee block, linked by the knee row.
import plateSpec, { SIZES } from '../specs/bodyweight_lunge.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-fwdlunge-bw': { cite: 'Forward Lunge (ACE Exercise Library, no equipment)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/94/forward-lunge/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'cat-lunge': { cite: 'Catalyst Athletics, Lunge (Exercise Library)', url: 'https://www.catalystathletics.com/exercise/354/Lunge/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'nhs-knee': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/conditions/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
};
// Not cited: c8 (15-20 unloaded reps; load progression, no field here restates it).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-fwdlunge-bw';
const CL = {
  c1: C(['CONSENSUS'], [ACE], 'c1'),
  c2: C(['CONSENSUS'], [ACE], 'c2'),
  c3: C(['CONSENSUS'], [ACE], 'c3'),
  c4: C(['CONSENSUS'], [ACE], 'c4'),
  c5: C(['CONSENSUS'], [ACE], 'c5'),
  c6: C(['CONSENSUS'], [ACE], 'c6'),
  c9: C(['CONSENSUS'], ['cat-lunge'], 'c9'),
  c10: C(['CONSENSUS'], ['nhs-knee'], 'c10'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the start (c1), the bottom (end: c4, c5) and the spec's Mistake pose (card
// plate.mistake, c3: the hips and front knee driven forward, the front shin tipped far over the foot), which is the card
// zoom front-shin's Wrong. One new still:
//   'rounded' (card zoom back Wrong, "Rounded back"; the card's wrongNote: the inverse of c5): the bottom pose with the
//         trunk (lumbar) flexed ROUND deg, the pelvis, legs and feet held; the arms stay plumb (shoulder flexion = the
//         spec's lean plus ROUND, the spec's own arms() rule).
// DRAWING VALUE (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and lib_reverse_lunge's LEAN 30 deg): ROUND 30 deg
// is a Wrong-pose size no card gives; no number from it appears in user copy; the layers panel judges it.
const ROUND = 30;
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const ROUNDED = { trunk: { flex: ROUND }, shoulder: { flex: SIZES.TRUNK_LEAN + ROUND } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  'hips-forward': { pose: { ...END, ...MIS } },
  rounded: { pose: { ...END, ...ROUNDED } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// The zoom shell's shape (callout with an anchor at the landmark it names; pilot-a.closeups.mjs), as
// lib_reverse_lunge's; each Wrong is drawn alone (solid). Crop centres (`off`) and `sizePx` are drawing values the layers
// panel judges.
const zooms = [
  {
    key: 'front-shin', chip: 'Shin', heading: 'Front shin', kind: 'posture',
    crop: { center: { at: 'knee.r', pose: 'right', off: [-10, 10] }, sizePx: 180 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Hips dropped', anchor: 'hip.r' },
      wrong: { text: 'Shin tipped', anchor: 'knee.r' },
    },
    caption: {
      right: 'Hips dropped, front shin leaning only slightly.',
      wrong: 'Hips driven forward, front shin tipped far forward.',
    },
    alt: {
      right: 'Side view, bottom of the lunge. The hips are low over the back knee, the front shin leans slightly forward.',
      wrong: 'Side view, bottom of the lunge. The hips and front knee have driven forward, the shin tipped far forward.',   // W5 K1 (c3)
    },
  },
  {
    key: 'back', chip: 'Back', heading: 'Flat back', kind: 'posture',
    crop: { center: { at: 'lumbar', pose: 'right', off: [10, -10] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: ROUNDED, solid: true },
    callout: {
      right: { text: 'Flat back', anchor: 'backUpper' },
      wrong: { text: 'Rounded back', anchor: 'backUpper' },
    },
    caption: {
      right: 'Hips bent forward, back flat.',
      wrong: 'Rounded back.',
    },
    alt: {
      right: 'Side view, bottom of the lunge. The trunk leans forward from the hips with the back flat.',
      wrong: 'Side view, bottom of the lunge. The back is rounded, the shoulders curled forward.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'quads', plain: 'The front thigh pushes you back up.' },
    { muscleId: 'glutes', plain: 'The glutes push you back up too.' },
  ],
  secondary: [],
  watch: [],
  // The card's first row (front thighs and glutes, c6) has no fix, so it is left off the rows (D-SHIP-Q16).
  feelLine: 'You should feel this in your front thigh and glutes.',
  rows: [
    { key: 'step-length', where: 'Mostly backs of thighs and glutes', at: { muscles: ['hamstrings', 'glutes'] },
      means: 'A longer step works these more.',
      fix: 'Shorten the step for more front-thigh work.',
      claim: CL.c9 },
    { key: 'knee', where: 'Very painful, locking or giving-way knee', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Not a training feeling.',
      fix: 'Stop the set.',
      redFlag: 'knee', claim: CL.c10 },
  ],
  libraryDiff: { add: ['glutes'], why: 'Glutes from secondary to primary: the card names the quads and glutes together as driving the return (c6).' },
  claim: CL.c6,
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'balance', text: 'Losing balance on the step. Learn single-leg standing first.', claim: C(['CONSENSUS'], [ACE], 'c7, c2') },
  { key: 'shin', text: 'Uncontrolled forward shin travel when the hips drive forward.', claim: CL.c3 },
];

export default {
  schema: 1,
  id: 'lib_bodyweight_lunge',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'brace', text: 'Stand with feet together, shoulders down and back, trunk braced.', claim: CL.c1 },
    { kind: 'position', text: 'Balance on one foot, step forward, land heel first.', claim: CL.c2 },
    { kind: 'position', text: 'Move the weight over slowly, upper body level.', claim: CL.c2 },
    { kind: 'position', text: 'Drop the hips until the front thigh is about parallel.', zoom: 'front-shin',
      claim: C(['CONSENSUS'], [ACE], 'c4, c3') },
    { kind: 'finish', text: 'Push off firmly with the front leg to stand back up.', claim: CL.c6 },
  ],
  posture: [
    // Q-W2-12: handlingMistake 'Driving the hips forward.' (c3, c2) merged here, its fix added
    { key: 'hips', label: 'Hips drop down', detail: 'Hips lower down, not forward. Land heel first and drop the hips straight down.',
      anchor: { landmark: 'hip.r', pose: 'end' }, zoom: 'front-shin', claim: C(['CONSENSUS'], [ACE], 'c3, c2') },
    { key: 'shin', label: 'Front shin', detail: 'Front shin leans only slightly forward.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'front-shin', claim: CL.c4 },
    { key: 'back', label: 'Flat back', detail: 'Flat back, bent forward at the hips.',
      anchor: { landmark: 'backUpper', pose: 'end' }, zoom: 'back', claim: CL.c5 },
    // front-view point (the spec's header): a text checkpoint. Q-W2-12: handlingMistake 'Upper body swaying sideways.'
    // (c2) merged here, its fix added
    { key: 'tilt', label: 'No sideways tilt', detail: 'No sideways tilt of the upper body. Keep it level, without tilting or swaying.',
      anchor: { landmark: 'sternum', pose: 'end' }, claim: CL.c2 },
    // Q-W2-12: handlingMistake 'Wobbling on one leg.' (c7, c2)
    { key: 'wobble', label: 'One-leg wobble', detail: 'Practise standing on one leg first.',
      anchor: { landmark: 'ankle.r', pose: 'end' }, claim: C(['CONSENSUS'], [ACE], 'c7, c2') },
  ],
  feel,
  zooms,
  chips: ['front-shin', 'back', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Feet together, trunk braced. Step forward, land heel first, and move the weight over slowly.',
    mistakeLine: 'Never drive the hips forward: drop them straight down. Keep the upper body from swaying sideways.',
    cueLine: 'Hips down, back flat.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['knee'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/bodyweight_lunge.json', rev: 1 },
};
