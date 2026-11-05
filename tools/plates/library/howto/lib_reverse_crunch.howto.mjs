// LIB-SHIP W7: the How-to content of lib_reverse_crunch, golden B's HowToContent shape (as lib_crunch). Every shown
// string restates a claim of the research card docs/research/howto/cards/reverse_crunch.json (cited in its field's
// claim, cN = card claim id).
// Handling: none, D-SHIP-GRIP (b2): the card archetype.hand is none; its handContact (c1 arms by the sides, palms
// pressing down; c19 hands under the hips) is on setup steps 1 and 3.
// No variant line (equipment 'Bodyweight').
//
// D-TEXT-GOLDEN (claim -> visible slot; posture checkpoints are kept in Q-W2-12 form as well):
//   card posture 'Breathe out and curl your hips' (c3, c8, c17)   -> zoom 'hips' Right, plate cue 'hips', copy.setupLine, setup 4 (W7 printed)
//   card posture 'Keep your knees at 90 degrees' (c4)             -> zoom 'knees' Right, plate cue 'knees', copy.mistakeLine fix
//   card posture 'Curl until your tailbone clears' (c5)           -> copy.setupLine, setup 4 (W7 printed)
//   card posture 'Hold briefly at the top' (c5)                   -> copy.setupLine (plate tempo Hold), setup 5 (W7 printed)
//   card posture 'Breathe in and roll down slowly' (c6, c10, c17) -> copy.setupLine, setup 5 (W7 printed)
//   card posture 'Knees return over your hips' (c7)               -> copy.mistakeLine fix, risks 'legs' (W7: as its fix)
//   handlingMistake 'Tucking your knees too far' (c11, c4)        -> zoom 'knees' Wrong, copy.mistakeLine, feel row 'neck', risks 'tuck'
//   handlingMistake 'Lower back arching' (c12, c17)               -> feel row 'low-back', risks 'arch', plate cue 'back'
//   handlingMistake 'Knees moving past your hips' (c7)            -> copy.mistakeLine (a fault, with its fix), risks 'legs' (W7 printed)
//   card zooms knees (M), hips (DV, its Wrong c9)                 -> zooms
//   card zoom low-back (T: the near arm covers the low back)      -> Right: setup step 3, plate cue 'back'; Wrong: feel row 'low-back', risks 'arch'
import plateSpec, { SIZES as SPEC_SIZES } from '../specs/reverse_crunch.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'ace-revcrunch': { cite: 'How To Do a Reverse Ab Crunch, Exercise Library (ACE)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/76/reverse-crunch/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'bb-revcrunch': { cite: 'Learn the Reverse Crunch to Fire Up Your Core Training (BarBend)', url: 'https://barbend.com/reverse-crunch/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'motra-revcrunch': { cite: 'Reverse Crunch, Exercise Guide (Motra)', url: 'https://motra.com/exercises/reverseCrunch',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'pg-revcrunch': { cite: 'How To Do Reverse Crunches (PureGym)', url: 'https://www.puregym.com/exercises/abs/reverse-crunches/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_plank lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-revcrunch', BB = 'bb-revcrunch', MO = 'motra-revcrunch', PG = 'pg-revcrunch';
const CL = {
  c1: C(['CONSENSUS'], [ACE, BB, MO], 'card c1'),
  c2: C(['CONSENSUS'], [ACE, BB, MO], 'card c2'),
  c5: C(['CONSENSUS'], [ACE, MO], 'card c5'),
  c7: C(['CONSENSUS'], [ACE], 'card c7'),
  c11: C(['CONSENSUS'], [BB], 'card c11'),
  c12: C(['CONSENSUS'], [PG, MO], 'card c12'),
  c15: C(['CONSENSUS'], [PG, BB], 'card c15'),
  c16: C(['CONSENSUS'], [BB], 'card c16'),
  c19: C(['CONSENSUS'], [BB, MO], 'card c19'),
  curl: C(['CONSENSUS'], [ACE, BB, PG, MO], 'card c3, c8, c17'),
  knees: C(['CONSENSUS'], [ACE, BB, MO], 'card c4, c11'),
  down: C(['CONSENSUS'], [ACE, BB, MO], 'card c6, c10, c17'),
  back: C(['CONSENSUS'], [ACE, BB, MO, PG], 'card c2, c12, c17'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses (start = legs up 90/90, low back flat; end = hips curled up):
//   tuck  (card zoom knees Wrong, c11): the spec's Mistake pose (the knees tuck too far, the knee angle closing), drawn as
//         the plate's Mistake view draws it (its guides: the dashed tucked leg and the knee arrow).
//   hinge (card zoom hips Wrong, c9 "only hinging at the hips, back still flat"): the start with the hips flexed HINGE deg
//         more (the knees swing toward the chest) and nothing else moving: the pelvis and the low back stay flat.
// Card zoom low-back (c2, c12) is a text checkpoint (D-SHIP-TEXTZOOM; brief: a DV that does not read becomes T): a
//   one-joint pelvis tip (the dead_bug spec's arch solve on this start) was solved and drawn, but in this side view the
//   near arm lies on the floor along the side (c1) and covers the low back's underside, so the gap does not read. Its
//   Right and Wrong are on posture 'low-back', setup step 4, feel row 'low-back' and risks 'arch'.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop):
// HINGE 35 deg (the spec's own ROLL, so the knees travel about as far as in the right pose) is a Wrong-pose size no
// card gives; no number from it appears in user copy; the layers panel judges it.
const H = 1.75, START = plateSpec.poses.start, END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const HINGE = SPEC_SIZES.ROLL;
const HINGED = { hip: START.hip + HINGE };
export const stills = {
  start: { pose: START },
  end: { pose: END },
  tuck: { pose: MIS },
  hinge: { pose: { ...START, ...HINGED } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// Zoom shell (pilot-a.closeups.mjs form); `off` and `sizePx` are drawing values.
const zooms = [
  {
    key: 'knees', chip: 'Knees', heading: 'Knee angle', kind: 'posture',
    crop: { center: { at: 'hip.r', pose: 'right', off: [-10, -30] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },   // M: the plate's own Mistake, dashed red over the right pose
    guides: plateSpec.mistake.guides,
    callout: {
      right: { text: 'Knees at 90', anchor: 'knee.r' },
      wrong: { text: 'Knees tuck', anchor: { at: 'knee.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Knees bent at 90 degrees.',
      wrong: 'Knees tucked too far toward the chest.',
    },
    alt: {
      right: 'Side view, top of the reverse crunch. Hips curled up, the knees still bent at a right angle.',
      wrong: 'Side view, top of the reverse crunch. The knees tuck too far toward the chest and the knee angle closes.',
    },
    feelRow: 'neck',
  },
  {
    key: 'hips', chip: 'Hips', heading: 'Hip curl', kind: 'posture',
    crop: { center: { at: 'hip.r', pose: 'right', off: [-10, -20] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'start', pose: HINGED, solid: true },   // DV: the hinge still drawn alone
    callout: {
      right: { text: 'Hips curl up', anchor: 'buttock' },
      wrong: { text: 'Back flat', anchor: { at: 'buttock', pose: 'mistake' } },
    },
    caption: {
      right: 'Hips and lower back curled off the floor.',
      wrong: 'Only hinging at the hips, back still flat.',
    },
    alt: {
      right: 'Side view, top of the reverse crunch. The hips and lower back curl off the floor toward the rib cage.',
      wrong: 'Side view, reverse crunch. The legs swing toward the chest, the back still flat on the floor.',
    },
    feelRow: 'hips',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'abs', plain: 'The abs curl your hips up.', claim: CL.c15 }],
  secondary: [
    { muscleId: 'obliques', plain: 'The sides of the belly also work.', claim: CL.c15 },
    { muscleId: 'hip_flexors', plain: 'The hip flexors also work.', claim: C(['CONSENSUS'], [PG, BB], 'card c15, c16') },
  ],
  watch: [{ muscleId: 'lower_back', plain: 'An arching lower back can strain it.', claim: C(['CONSENSUS'], [PG, MO, ACE], 'card c12, c7') }],
  feelLine: 'You should feel this in your belly, maybe more in your lower abs.',
  rows: [
    // The card's first row (lower belly) has no fix, so it is left out: the feel line says it.
    { key: 'hips', where: 'Front of the hips', at: { muscles: ['hip_flexors'] },
      means: 'Some hip flexor work is normal.',
      fix: 'Start each rep with your abs, not your legs.',
      zoom: 'hips', claim: CL.c16 },
    { key: 'neck', where: 'Neck', at: { parts: ['neck-left', 'neck-right'] },
      means: 'Knees tucked too far, weight rolling toward your neck.',
      fix: 'Keep your knees at 90 degrees. Stop if sharp pain occurs.',
      zoom: 'knees', claim: C(['CONSENSUS', 'WEAK'], [BB, MO], 'card c11, c18') },
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Your lower back arching can strain it.',
      fix: "Brace so it doesn't arch. Stop if sharp pain occurs.",
      redFlag: 'back', claim: C(['CONSENSUS', 'WEAK'], [PG, MO], 'card c12, c17, c18') },
  ],
  libraryDiff: { add: ['obliques'], why: 'PureGym and BarBend both name the obliques (card c15).' },
  claim: CL.c15,
};

/* ------------------------------------------------------------------------------------------------ risks ---------- */
const RISKS = [
  { key: 'tuck', text: 'Tucking your knees too far brings your weight onto your upper back and neck.', claim: CL.c11 },
  { key: 'arch', text: 'If your lower back arches, it can strain your lower back.', claim: CL.c12 },
  // W7 D-TEXT-PRINTED: handlingMistake 'Knees moving past your hips on the way down' (c7) as a fault, with its fix
  { key: 'legs', text: 'Knees going past your hips add low-back stress. Return them over your hips.', claim: CL.c7 },
];

export default {
  schema: 1,
  id: 'lib_reverse_crunch',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b2): the card archetype.hand is none; its handContact (c1, c19) is on setup steps 1 and 3.' },
  contacts: ['floor-body'],
  setup: [
    { kind: 'position', text: 'Lie on your back, arms by your sides, palms down.', claim: CL.c1 },
    // W7 D-TEXT-PRINTED (copy lines and posture checkpoints are not printed): the card's steps 2-3 (c2) and 4-5 (c2,
    // c19) merged; card posture 'Breathe out and curl your hips' (c3, c8, c17) and 'Curl until your tailbone clears'
    // (c5) -> step 4; 'Hold briefly at the top' (c5) and 'Breathe in and roll down slowly' (c6, c10, c17) -> step 5.
    { kind: 'brace', text: 'Brace, lift your feet, knees over hips and bent to 90 degrees.', zoom: 'knees', claim: CL.c2 },
    { kind: 'position', text: 'Lower back flat. Hard to flatten? Put your hands under your hips.',
      claim: C(['CONSENSUS'], [ACE, BB, MO], 'card c2, c19') },
    { kind: 'position', text: 'Breathe out, curl your hips toward your ribs, tailbone off the floor.', zoom: 'hips',
      claim: C(['CONSENSUS'], [ACE, BB, PG, MO], 'card c3, c8, c17, c5') },
    { kind: 'position', text: 'Hold briefly. Breathe in and roll down slowly, vertebra by vertebra.',
      claim: C(['CONSENSUS'], [ACE, BB, MO], 'card c5, c6, c10, c17') },
  ],
  posture: [
    { key: 'curl', label: 'Hips curl up', detail: 'Breathe out and curl your hips toward your rib cage. Lift your lower back, not just your legs.',
      anchor: { landmark: 'buttock', pose: 'end' }, zoom: 'hips', claim: C(['CONSENSUS'], [ACE, BB, PG, MO], 'card c3, c8, c17, c9') },
    // Q-W2-12: handlingMistake 'Tucking your knees too far' (c11, c4) merged here, its fix added
    { key: 'knees', label: 'Knees at 90', detail: "Keep your knees at 90 degrees. Don't tuck them too far.",
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'knees', claim: CL.knees },
    { key: 'tail', label: 'Tailbone up', detail: 'Curl until your tailbone clears the floor.',
      anchor: { landmark: 'sacrum', pose: 'end' }, claim: CL.c5 },
    { key: 'hold', label: 'Brief hold', detail: 'Hold briefly at the top.',
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: CL.c5 },
    { key: 'down', label: 'Slow roll down', detail: 'Breathe in and roll down slowly, vertebra by vertebra.',
      anchor: { landmark: 'backMid', pose: 'start' }, claim: CL.down },
    // Q-W2-12: handlingMistake 'Knees moving past your hips on the way down' (c7) merged here, its fix added
    { key: 'return', label: 'Knees over hips', detail: 'Control your legs. Knees return over your hips, not past them.',
      anchor: { landmark: 'knee.r', pose: 'start' }, claim: CL.c7 },
    // Q-W2-12: handlingMistake 'Lower back arching' (c12, c17) merged here, its fix added; D-SHIP-TEXTZOOM: card zoom
    // low-back (c2, c12), Right and Wrong
    { key: 'low-back', label: 'Back down', detail: "Lower back flat on the floor at the start, not arching. Brace so it doesn't arch.",
      anchor: { landmark: 'lumbar', pose: 'start' }, claim: CL.back },
  ],
  feel,
  zooms,
  chips: ['knees', 'hips', 'feel'],
  copy: {
    setupLine: 'Breathe out and curl until your tailbone clears the floor. Hold briefly, then breathe in and roll down vertebra by vertebra.',   // card c3, c5, c6, c10, c17
    mistakeLine: 'Knees tucking too far, or moving past your hips? Keep them at 90 degrees, over your hips.',   // card c11, c4, c7
    cueLine: 'Hips toward your ribs.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/reverse_crunch.json', rev: 1 },
};
