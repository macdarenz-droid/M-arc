// LIB-SHIP W5: the How-to content of lib_bayesian_cable_curl (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/bayesian_cable_curl.json; its claim ids are named on each field's claim.
// Handling (D-SHIP-GRIP case (b)): the card's grip.thumb, grip.handContact and grip.wrist are all empty, so there is no
// hand claim to draw or write: NoHandling, and no hand zoom (the card has none; the d-handle key lists the id as a GAP,
// hands/hand-d-handle.mjs). The card's grip.type ("One hand on a single cable handle", c1) is setup steps 1 and 2 and
// the setup line; its grip.width ("One arm at a time", c1) is the setup line.
// Q-W2-12 form (as lib_pec_fly, a NoHandling sheet): the card's handlingMistakes are posture checkpoints (label = the
// mistake, detail = the card fix, claim kept; merged where the same as an existing checkpoint), and mistakes is empty.
// Red flag: the card's redFlags (shoulder), golden B's shared shoulder block, linked by the shoulder-pain row.
// No variant line (equipment 'Cable').
import plateSpec from '../specs/bayesian_cable_curl.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'bb-bayesian': { cite: 'How To Do the Bayesian Curl for Bigger, Beefier Biceps (BarBend)', url: 'https://barbend.com/bayesian-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-bayesian': { cite: 'How to Do Bayesian Curl: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/bayesian-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs), as golden B's lateral raise lists it: the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: parpa-2025 (c10), attarieh-2025 (c11), acsm-2009 (c12, c13: tempo and progression).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const BB = 'bb-bayesian', SL = 'sl-bayesian';
const CL = {
  c1: C(['CONSENSUS'], [BB, SL], 'c1'),
  c2: C(['CONSENSUS'], [SL, BB], 'c2'),
  c3: C(['CONSENSUS'], [BB], 'c3'),
  c4: C(['CONSENSUS'], [SL, BB], 'c4'),
  c6: C(['CONSENSUS'], [SL], 'c6'),
  c7: C(['CONSENSUS'], [BB], 'c7'),
  c9: C(['CONSENSUS'], [BB], 'c9'),
  shoulder: C(['CONSENSUS'], [BB], 'c9, c3'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses (start: arm drawn back, elbow straight; end: elbow bent) and Mistake:
//   'swing' (card zoom bayes-arm Wrong, c5: "Upper arm swinging forward as the handle rises"): the spec's own Mistake
//         (the upper arm swinging forward, c5), merged over the end pose.
//   'far' (card zoom bayes-reach Wrong, c3/c2: "Standing far away with the arm pulled far behind"): the start pose with
//         the whole body (root, both feet, the free hand on the hip) FAR m further from the column, and the working upper
//         arm EXTRA deg further behind the body; the cable runs longer to the handle.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and lib_reverse_lunge's SHORT 0.15 m and LEAN
// 30 deg): FAR 0.25 m and EXTRA 25 deg are Wrong-pose sizes no card gives (c3 caps the upper arm at about 45 deg; the
// still goes past it); no number from them appears in user copy; the layers panel judges them.
const FAR = 0.25, EXTRA = 25;
const START = plateSpec.poses.start, END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const fwd = at => [at[0], at[1], at[2] + FAR];
const FAR_POSE = {
  root: { ...START.root, at: fwd(START.root.at) },
  plant: { l: { ...START.plant.l, at: fwd(START.plant.l.at) }, r: { ...START.plant.r, at: fwd(START.plant.r.at) } },
  reach: { ...START.reach, l: { ...START.reach.l, at: fwd(START.reach.l.at) } },
  shoulder: { ...START.shoulder, r: { ...START.shoulder.r, ext: START.shoulder.r.ext + EXTRA } },
};
export const stills = {
  start: { pose: START },
  end: { pose: END },
  swing: { pose: { ...END, ...MIS } },
  far: { pose: { ...START, ...FAR_POSE } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same keys and kinds (both posture; the card has no hand zoom). Zoom shell shape (callout with an
// anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs); each Wrong is its still drawn alone (solid).
const zooms = [
  {
    key: 'bayes-arm', chip: 'Upper arm', heading: 'Upper arm', kind: 'posture',
    crop: { center: { at: 'elbow.r', pose: 'right', off: [10, -20] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Upper arm still', anchor: 'elbow.r' },
      wrong: { text: 'Upper arm swings', anchor: 'elbow.r' },
    },
    caption: {
      right: 'Upper arm held still, drawn back behind the torso.',   // card zoom right (c5, c2)
      wrong: 'Upper arm swinging forward as the handle rises.',     // card zoom wrong (c5)
    },
    alt: {
      right: 'Side view, top of the curl. The upper arm stays drawn back behind the torso, the elbow bent.',
      wrong: 'Side view. The upper arm has swung forward, so the shoulder helps lift the handle.',
    },
  },
  {
    key: 'bayes-reach', chip: 'Distance', heading: 'Cable distance', kind: 'posture',
    crop: { center: { at: 'hip.r', pose: 'right', off: [-30, 10] }, sizePx: 240 },
    right: 'start',
    wrong: { base: 'start', pose: FAR_POSE, solid: true },
    callout: {
      right: { text: 'Light tension', anchor: 'elbow.r' },
      wrong: { text: 'Arm far back', anchor: 'elbow.r' },
    },
    caption: {
      right: 'A step from the cable, light tension, modest stretch.',   // card zoom right (c3, c2)
      wrong: 'Standing far away with the arm pulled far behind.',      // card zoom wrong (c3, c2)
    },
    alt: {
      right: 'Side view, start of the curl. One step from the cable, the arm drawn back with light tension.',
      wrong: 'Side view. The lifter stands far from the cable, the arm pulled far behind the body.',
    },
    feelRow: 'stretch',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'biceps', plain: 'The biceps is the target, working from a lengthened start.' }],
  secondary: [{ muscleId: 'forearms', plain: 'The forearm flexors help.' }],
  watch: [{ muscleId: 'front_delts', plain: 'Holding the arm back can bring some tension to the front of the shoulder.' }],
  // The card's first row (front of the upper arm, c8) has no fix, so it is left off the rows (D-SHIP-Q16); the feel line
  // says it.
  feelLine: 'You should feel this in the front of your upper arm.',
  rows: [
    { key: 'stretch', where: 'Front of the shoulder, a stretch', at: { muscles: ['front_delts'] },
      means: 'Some tension here can come with the arm held back.',
      fix: 'Stand closer if it is more than a stretch.',
      zoom: 'bayes-reach', claim: CL.shoulder },
    { key: 'shoulder', where: 'Front of the shoulder, pain', at: { muscles: ['front_delts'] },
      means: 'Holding the arm back may stress the shoulder.',
      fix: 'Stand closer to the cable, or choose another curl.',
      redFlag: 'shoulder', claim: CL.shoulder },
  ],
  claim: C(['CONSENSUS'], [SL, BB], 'c8, c9'),
};

/* ------------------------------------------------------------------------------- risks (card risks) ---------- */
const RISKS = [
  { key: 'shoulder', text: 'Holding the arm behind the body can cause shoulder discomfort for some people.', claim: CL.c9 },
];

export default {
  schema: 1,
  id: 'lib_bayesian_cable_curl',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP: the card gives no thumb, contact or wrist claim.' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'adjust', text: 'Set the cable to its lowest height with a single handle.', claim: CL.c1 },
    { kind: 'grip', text: 'Handle in your working hand, back to the machine.', claim: C(['CONSENSUS'], [BB, SL], 'c1 (card grip.type)') },
    { kind: 'position', text: 'Step forward to light cable tension, arm drawn behind you.', zoom: 'bayes-reach', claim: CL.c2 },
    { kind: 'safety', text: 'Stand closer if your shoulder feels restricted.', claim: CL.c3 },
    { kind: 'brace', text: 'Free hand on your hip or out to the side.', claim: CL.c7 },
  ],
  posture: [
    { key: 'lean', label: 'Slight lean', detail: 'Torso leans slightly forward.', anchor: { landmark: 'chest', pose: 'start' }, claim: CL.c2 },
    { key: 'elbow', label: 'Elbow close', detail: 'Elbow stays close to the body.', anchor: { landmark: 'elbow.r', pose: 'start' }, claim: CL.c4 },
    // Q-W2-12: handlingMistake 'Upper arm moving forward' (c5, c4) merged here, its fix added
    { key: 'still', label: 'Upper arm still', detail: 'Upper arm stays motionless. Only the elbow bends.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'bayes-arm', claim: C(['CONSENSUS'], [BB, SL], 'c5, c4') },
    // Q-W2-12: handlingMistake 'Tilting side to side' (c7) merged here, its fix added
    { key: 'trunk', label: 'Trunk braced', detail: 'Trunk braced, no tilting side to side. Free hand on your hip.',
      anchor: { landmark: 'backMid', pose: 'end' }, claim: CL.c7 },
    { key: 'lower', label: 'Slow lowering', detail: 'Lower slowly.', anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c6 },
    // Q-W2-12: handlingMistake 'Standing too far away' (c3)
    { key: 'far', label: 'Standing too far', detail: 'Stand a bit closer to the cable.',
      anchor: { landmark: 'heel.r', pose: 'start' }, zoom: 'bayes-reach', claim: CL.c3 },
  ],
  feel,
  zooms,
  chips: ['bayes-arm', 'bayes-reach', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    // card grip.type and grip.width (c1); D-TEXT-GOLDEN: posture lean (c2)
    setupLine: 'Back to a low cable, one handle, one arm at a time. Lean slightly forward, arm drawn behind you.',   // c1, c2
    // D-TEXT-GOLDEN: posture still (c5), trunk (c7)
    mistakeLine: 'Never let the upper arm swing forward. Brace your trunk so you do not tilt side to side.',   // c5, c7
    // D-TEXT-GOLDEN: posture elbow (c4), lower (c6)
    cueLine: 'Elbow close, lower slowly.',   // c4, c6
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/bayesian_cable_curl.json', rev: 1 },
};
