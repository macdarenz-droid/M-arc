// LIB-SHIP W1: the How-to content of lib_rope_triceps_pushdown, golden B's HowToContent shape
// (layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the research card
// docs/research/howto/cards/rope_triceps_pushdown.json (cited in its field's claim, cN = card claim id).
// Hand: the rope-hand zoom is drawn on the page by the approved `rope` pair key (hands/hand-rope.mjs, variant push,
// orientation neutral, fault curled; words hands/words/rope-push-neutral.json). handling and the zoom's hand data repeat
// that key's recorded values (pose, contact, wrist range, thumb, fault), so the sheet and the drawing agree. The key's
// contact (rope across the middle of the palm, contactAt .6) is its drawing value ga:rope-fist-mid, not a claim
// (shared/rope-rule.json gap 1); the card's own claim is the hand against the knob (c2).
// Hint (handling.cue): 'Hands against the rope knobs.' (LIB-SHIP-DESIGN.md section 4, text E).
//
// Additions to the architecture's types, used as golden B uses them:
//   ZoomSpec.callouts   one label per crop ({ text, guide }), machine_chest_press
//   stills              still poses for the posture crops, built from the plate spec's own poses
import plateSpec from '../specs/rope_triceps_pushdown.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'nfpt-rope': { cite: 'How to do Tricep Pushdowns with the Rope (Robert Bovee, NFPT, 2025)', url: 'https://nfpt.com/how-to-do-tricep-pushdowns-with-the-rope/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'ace-pushdown': { cite: 'Triceps Pushdowns (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/185/triceps-pushdowns/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'sl-rope': { cite: 'How to Do Tricep Pushdown With Rope: Muscles Worked & Proper Form (StrengthLog, 2023)', url: 'https://www.strengthlog.com/?p=2541',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'sl-pushdown': { cite: 'How to Do Tricep Pushdown With Bar: Muscles Worked & Proper Form (StrengthLog, 2023)', url: 'https://www.strengthlog.com/tricep-pushdown/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const CL = {
  c1: C(['CONSENSUS'], ['sl-rope', 'ace-pushdown'], 'card c1'),
  c2: C(['CONSENSUS'], ['nfpt-rope', 'ace-pushdown'], 'card c2'),
  c4: C(['CONSENSUS'], ['sl-pushdown', 'sl-rope'], 'card c4'),
  c5: C(['CONSENSUS'], ['nfpt-rope', 'ace-pushdown'], 'card c5'),
  c6: C(['CONSENSUS'], ['nfpt-rope'], 'card c6'),
  c7: C(['CONSENSUS'], ['ace-pushdown'], 'card c7'),
  c8: C(['CONSENSUS'], ['nfpt-rope'], 'card c8'),
  c9: C(['CONSENSUS'], ['nfpt-rope', 'ace-pushdown'], 'card c9'),
  c10: C(['CONSENSUS'], ['ace-pushdown', 'sl-rope'], 'card c10'),
  c11: C(['CONSENSUS'], ['ace-pushdown'], 'card c11'),
  c12: C(['CONSENSUS'], ['sl-rope'], 'card c12'),
  c15: C(['CONSENSUS'], ['sl-rope'], 'card c15'),
  c17: C(['CONSENSUS'], ['nfpt-rope'], 'card c17'),
  grip: C(['CONSENSUS'], ['nfpt-rope', 'ace-pushdown', 'sl-pushdown'], 'card c2, c3, c5'),
  lean: C(['CONSENSUS'], ['sl-rope', 'ace-pushdown'], 'card c12, c10'),
  elbowsOut: C(['CONSENSUS'], ['ace-pushdown', 'nfpt-rope'], 'card c7, c6'),
  elbowRow: C(['CONSENSUS'], ['sl-rope', 'nfpt-rope', 'ace-pushdown'], 'card c16, c9'),
  setupArms: C(['CONSENSUS'], ['nfpt-rope', 'ace-pushdown'], 'card c6, c8, c11'),
  setupLine: C(['CONSENSUS'], ['sl-rope', 'ace-pushdown', 'nfpt-rope'], 'card c1, c2, c6, c11'),
  mistakeLine: C(['CONSENSUS'], ['nfpt-rope', 'ace-pushdown', 'sl-rope'], 'card c6, c10'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The `rope` key's push variant, as recorded (hands/hand-rope.mjs VARIANTS.push, IDS.rope_triceps_pushdown).
const RIGHT_POSE = {
  view: 'radial', forearm: 90, wrist: { ext: 0, dev: 0 }, contactAt: 0.6, fingers: { curl: 1 }, thumb: 'wrapped', squeeze: 'firm',
  handle: { profile: 'rope', axis: 'across', diameterMm: 28 }, load: { kind: 'pull' },
};
const CURLED = {
  key: 'curled', label: 'Wrist curled',
  pose: { wrist: { ext: -30 } },
  markers: ['lever-arc'],
  alt: 'Wrist bent toward the palm as the rope is pushed down.',
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// Built from the plate spec's own poses (no new geometry beyond what the card names):
//   elbows-forward (card zoom rope-elbow Wrong, c7): the start pose with the upper arms swung forward MIS_SHOULDER deg
//            (the spec's own Mistake value) and the start elbow angle (START_ELBOW 100). How far is a drawing choice
//            (the card gives no number).
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): MIS_SHOULDER 25 (the
// spec's own Mistake value) and START_ELBOW 100 size the elbows-forward Wrong; no card gives them, no number appears in
// user copy; the layers panel judges them.
const { start: START, end: END } = plateSpec.poses, MIS_SHOULDER = 25, START_ELBOW = 100;
export const stills = {
  start: { pose: START },
  end: { pose: END },
  'elbows-forward': { pose: { ...START, reach: null, shoulder: { flex: MIS_SHOULDER }, elbow: START_ELBOW, wrist: 0 } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
const zooms = [
  {
    key: 'rope-hand', chip: 'Hand', heading: 'Rope grip', kind: 'hand',
    hand: {
      right: RIGHT_POSE,
      wrong: ['curled'],
      camera: 'above',   // pairs.mjs ORIENTATIONS.neutral
      panelHeight: 170,
      notes: { right: 'Middle of palm', wrong: 'Wrist curled' },   // the key's approved words (rope-push-neutral.json)
    },
    caption: {
      right: 'Hand up against the knob, neutral grip, wrist straight.',
      wrong: 'Fist curled toward the forearm, wrist bent.',
    },
    alt: {
      right: 'Rope across the middle of the palm, thumb wrapped round it. Wrist straight, in line with the forearm.',   // the key's alt, split to two sentences (C7)
      wrong: CURLED.alt,
    },
  },
  {
    key: 'rope-elbow', chip: 'Elbows', heading: 'Elbow position', kind: 'posture',
    crop: { center: { landmark: 'elbow.r', pose: 'start', dx: 10, dy: 0 }, sizePx: 140 },
    right: 'start',
    wrong: { still: 'elbows-forward', over: 'start' },
    callouts: {
      right: { text: 'At your sides', guide: 'upper-arm-plumb' },
      wrong: { text: 'Drifted forward', guide: 'upper-arm-plumb' },
    },
    caption: {
      right: 'Elbows against your sides at the top.',
      wrong: 'Elbows drifted forward, upper arms swung up.',
    },
    alt: {
      right: 'Side view, top of the pushdown. Upper arms hang straight down, elbows against the sides, forearms just past level.',
      wrong: 'Side view, top of the pushdown. The upper arms swing forward and up, so the elbows leave the sides.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'triceps', plain: 'The back of the upper arm does most of the work.' }],
  secondary: [{ muscleId: 'forearms', plain: 'The forearms work too.' }],
  watch: [],
  feelLine: 'You should feel this in the back of your upper arms.',
  rows: [
    // The card's first row (back of the upper arm) has no fix, so it is left out: the feel line says it.
    { key: 'forearms', where: 'Forearms, at the top', at: { muscles: ['forearms'] },
      means: 'The rope rises higher than just above parallel.',
      fix: 'Stop when your forearms are just past parallel.',
      claim: CL.c8 },
    { key: 'lower-back', where: 'Lower back pain', at: { muscles: ['lower_back'] },
      means: 'You lean too far forward or arch your back.',
      fix: "Stop and don't train through the pain. Stand taller, tilt only from the hips.",
      redFlag: 'back', claim: CL.lean },
    { key: 'elbows', where: 'Elbow discomfort or pain', at: { parts: ['elbow-left', 'elbow-right'] },
      means: 'Heavy, low-rep sets feel uncomfortable in the elbows for many.',
      fix: "Stop and don't train through the pain. Go lighter, don't lock out your elbows.",
      redFlag: 'elbow', claim: CL.elbowRow },
  ],
  claim: CL.c17,
};

/* ------------------------------------------------------------------------------------------------ mistakes, risks */
const MISTAKES = [
  { key: 'lean', title: 'Leaning over or arching back', claim: CL.lean,
    fix: 'Stand taller. Tilt only from the hips.' },
  { key: 'elbows-forward', title: 'Elbows drifting forward or out', zoom: 'rope-elbow', claim: CL.elbowsOut,
    fix: 'Keep your elbows at your sides.' },
  { key: 'too-high', title: 'Rope rising too high', claim: CL.c8,
    fix: 'Stop when your forearms are just past parallel.' },
];
const RISKS = [
  { key: 'lockout', text: 'Locking the elbows out hard at the bottom can injure the elbows.', claim: CL.c9 },
  { key: 'lean', text: 'Leaning or arching strains the lower back.', claim: CL.c12 },
  { key: 'weight', text: 'Too much weight moved with momentum can lead to injury.', claim: CL.c15 },
];

export default {
  schema: 1,
  id: 'lib_rope_triceps_pushdown',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    orientation: 'neutral',
    handle: 'rope',
    loadAxis: 'across',
    overBody: false,
    thumb: { mode: 'wrapped', claim: CL.c2 },
    contact: 'mid-palm',   // the key's contact 'mid' (ga:rope-fist-mid, a drawing value)
    wrist: { ext: [0, 15], limitText: 'Fist curling toward the forearm? Keep the wrist straight.', claim: CL.c5 },   // the key's wristRange
    pose: RIGHT_POSE,
    faults: [CURLED],
    gripLine: 'Hold each rope end, hands against the knobs. Palms face each other, wrists straight.',
    cue: 'Hands against the rope knobs.',
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'adjust', text: 'Fix the rope to the pulley at its top position.', claim: CL.c1 },
    { kind: 'grip', text: 'Hold each end with your hand against the knob, thumbs wrapped.', zoom: 'rope-hand', claim: CL.c2 },
    { kind: 'position', text: 'Stand facing the machine, feet hip-width or staggered, torso tall.', claim: CL.c10 },
    { kind: 'position', text: 'Elbows at your sides, forearms just past parallel, shoulders down and back.', zoom: 'rope-elbow', claim: CL.setupArms },
    { kind: 'load', text: 'Pick a weight you can move with control.', claim: CL.c15 },
  ],
  posture: [
    { key: 'elbows', label: 'Elbows in', detail: 'Elbows stay in at your sides.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, zoom: 'rope-elbow', claim: CL.c6 },
    { key: 'wrists', label: 'Straight wrists', detail: 'Wrists straight throughout.',
      anchor: { landmark: 'wrist.r', pose: 'end' }, zoom: 'rope-hand', claim: CL.c5 },
    { key: 'torso', label: 'Torso tall', detail: 'Torso tall. Any lean comes from the hips, not an arched back.',
      anchor: { landmark: 'backUpper', pose: 'start' }, claim: CL.c10 },
    { key: 'shoulders', label: 'Shoulders down', detail: 'Shoulders down and back.',
      anchor: { landmark: 'shoulder.r', pose: 'start' }, claim: CL.c11 },
    // D-SHIP-Q14 (#376 6614695581): the card zoom rope-spread is a text checkpoint (the spread does not show side-on and
    // the crop engine draws only the plate's camera), as golden B's machine_chest_press keeps "Start depth" (:165, :285).
    { key: 'spread', label: 'Rope ends apart', detail: 'Rope ends spread apart, hands passing the thighs. Hands jammed together hit the thighs.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c4 },
    { key: 'soft', label: 'Elbows not locked', detail: 'Arms straight at the bottom, elbows not locked out.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c9 },
  ],
  feel,
  zooms,
  copy: {
    setupLine: 'Rope on the top pulley, hands against the knobs. Elbows at your sides, shoulders down and back.',
    mistakeLine: 'Keep your elbows at your sides. Lean only from the hips, never by arching your back.',
    cueLine: 'Elbows in at your sides.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['elbow', 'back'],
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/rope_triceps_pushdown.json', rev: 1 },
};
