// LIB-SHIP W5: the How-to content of lib_hammer_curl (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs; the form of lib_dumbbell_biceps_curl, W1). Every shown
// string restates a claim of the verified card docs/research/howto/cards/hammer_curl.json; its claim ids are named on
// each field's claim.
// Family (D-SHIP-FAMILY, lint/family.mjs INHERIT_MAP): child of dumbbell_biceps_curl. grip.width ->
// handling.width.text, the parent sheet's string exactly (true here: c10, the dumbbells may hang slightly away from the
// sides, the hand position that keeps the wrist straight); redFlags -> riskFlags ['wrist']; plate.view [].
// Hand zoom (D-SHIP-GRIP case (a)): the card zoom `hammer-hand` is drawn by the approved `curl` pair key
// (tools/plates/library/hands/hand-curl.mjs IDS.hammer_curl: variant 'dumbbell', orientation 'neutral', faults curled
// and bent-back). The pose, faults and wrist range below are that key's recorded values, read from the key module so
// they cannot drift; the Right/Wrong notes are the pair panel's words (hands/words/curl-dumbbell-neutral.json). The
// card leaves grip.handContact empty: the contact is the key's convention 'ga:curl-mid' (hands/pairs.mjs CONVENTIONS),
// cited as CONVENTION, and is data only (D-SHIP-CONVCOPY: never printed).
// D-SHIP-W5-HAMMERWRONG (Q-W5-8): the card zoom's Wrong is a twist toward palms up (c5), a forearm rotation the radial
// view cannot draw; the key draws the wrist curled and bent back. The zoom's Wrong caption names the drawn fault, from
// the card's own wrist-straight claim (c4), and never says "twist"; the twist claim (c5) stays visible in the mistake
// row 'Wrists twisting out of neutral' and in the cue line.
// No variant line (equipment 'Dumbbells').
import plateSpec from '../specs/hammer_curl.mjs';
import { IDS, VARIANTS } from '../hands/hand-curl.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-hammer': { cite: 'Hammer Curl (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/10/hammer-curl/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-hammer': { cite: 'How to Do Hammer Curl: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/hammer-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'caufriez-2018': { cite: 'The Role of the Muscle Brachioradialis in Elbow Flexion: An Electromyographic Study', url: 'https://pubmed.ncbi.nlm.nih.gov/29409427/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // The curl key's own source for the hand contact (the card has no grip.handContact): a drawing convention.
  'hand-key-curl': { cite: 'LIB-7 hand pair key curl (dumbbell), CONVENTIONS ga:curl-mid: across the middle of the palm', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG's own source (layers/howto/shared.mjs), as golden B's machine_chest_press lists it: the card's redFlags 'wrist'.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
};
// Not cited: coratella-2023 (c9), acsm-2009 (c12, c13: tempo and progression; no field here restates them).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-hammer', SL = 'sl-hammer';
const CL = {
  c1: C(['CONSENSUS'], [ACE], 'c1'),
  c2: C(['CONSENSUS'], [ACE], 'c2'),
  c3: C(['CONSENSUS'], [ACE], 'c3'),
  c4: C(['CONSENSUS'], [ACE], 'c4'),
  c5: C(['CONSENSUS'], [SL], 'c5'),
  c6: C(['CONSENSUS'], [SL], 'c6'),
  c7: C(['CONSENSUS'], [SL], 'c7'),
  c10: C(['CONSENSUS'], [ACE], 'c10'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant (hand-curl.mjs, radial-rules.mjs curlVariant).
const KEYED = IDS.hammer_curl, V = VARIANTS[KEYED.variant];
const RIGHT_POSE = V.right;
const FAULTS = KEYED.faults.map(key => {
  const f = V.faults[key];
  // HandFault.pose.wrist needs dev: the key's fault sets ext only and the engine merges it over the right pose
  // (render/closeup/common.mjs mergePose), so dev is the right pose's own value (0), written out for the type.
  return { key, label: f.label, pose: { ...f.pose, wrist: { dev: RIGHT_POSE.wrist.dev, ...f.pose.wrist } }, markers: f.markers, alt: f.alt };
});

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. 'elbows-forward' (card zoom hammer-elbow Wrong, c6: "Elbows pushed forward,
// dumbbells lifted by the shoulders") is the spec's own Mistake (elbows moving forward, c6/c4), merged over the end pose.
// No drawing value of this sheet's own: the Mistake's sizes are the spec's.
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  'elbows-forward': { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same kinds; the hand zoom's key is 'hand' (golden B's chip rule). The posture zoom is in the zoom
// shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'hand', chip: 'Wrist', heading: 'Wrist position', kind: 'hand',   // card zoom key: hammer-hand
    hand: {
      right: RIGHT_POSE,
      wrong: FAULTS,                // handling.faults (golden B's shape: fault objects); the pair pages them in this order
      camera: 'above',              // the pair's camera (pairs.mjs ORIENTATIONS.neutral: the handle seen end-on from above)
      panelHeight: V.panelHeight,
      // The pair panel's own words (D-SHIP-CONVCOPY allows the key's panel words): 'Middle of palm' is the curl key's
      // ga:curl-mid label, source hand-key-curl (words/curl-dumbbell-neutral.json, radial-rules.mjs:16).
      notes: { right: 'Middle of palm', wrong: 'Wrist curled' },   // words/curl-dumbbell-neutral.json, first page
    },
    caption: {
      right: 'Closed neutral grip, thumb round the handle, wrist straight.',   // card zoom right (c1, c4)
      // D-SHIP-W5-HAMMERWRONG: the key's drawn faults (curled, bent back), the inverse of c4 "keep the wrist straight"
      wrong: 'Wrist bent back or curled toward the forearm.',
    },
    // The key's alt without its contact words (D-SHIP-CONVCOPY): palms facing the body and thumb wrapped c1, wrist c4.
    alt: { right: 'Palm facing the body, thumb wrapped round the handle. Wrist straight, in line with the forearm.', wrong: V.faults[KEYED.faults[0]].alt },
    feelRow: 'wrist',
  },
  {
    key: 'hammer-elbow', chip: 'Elbows', heading: 'Elbow path', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's elbow for both halves; the Wrong is the
    // spec's Mistake drawn alone (solid), as `stills['elbows-forward']`.
    crop: { center: { at: 'elbow.r', pose: 'right', off: [0, -10] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Elbows at sides', anchor: 'elbow.r' },
      wrong: { text: 'Elbows forward', anchor: 'elbow.r' },
    },
    caption: {
      right: 'Elbows by the sides at the top.',                            // card zoom right (c6)
      wrong: 'Elbows pushed forward, dumbbells lifted by the shoulders.',  // card zoom wrong (c6)
    },
    alt: {
      right: 'Side view, top of the curl. The upper arm hangs straight down by the side. The elbow is fully bent.',
      wrong: 'Side view. The elbow has moved forward off the side, so the shoulder helps lift the dumbbell.',
    },
    feelRow: 'front-shoulder',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const HANDS = ['hand-left', 'hand-right', 'hand-back-left', 'hand-back-right'];
const feel = {
  primary: [{ muscleId: 'biceps', plain: 'The biceps and the brachialis, at the front of the upper arm, do most of the work.' }],
  secondary: [{ muscleId: 'forearms', plain: 'The forearm flexors help, especially the brachioradialis.' }],
  watch: [],
  // The card's first row (front of upper arm and forearm, c8, c11) has no fix, so it is left off the rows (D-SHIP-Q16);
  // the feel line says it.
  feelLine: 'You should feel this in the front of your upper arm and your forearm.',
  rows: [
    { key: 'front-shoulder', where: 'Front of the shoulder', at: { muscles: ['front_delts'] },
      means: 'Your elbows move forward, which loads the front delts.',
      fix: 'Keep the elbows at your sides.',
      zoom: 'hammer-elbow', claim: CL.c6 },
    { key: 'wrist', where: 'Wrist', at: { parts: HANDS },
      means: 'Your wrist is bending or twisting.',
      fix: 'Keep the wrist straight, palms facing your body.',
      zoom: 'hand', redFlag: true, claim: C(['CONSENSUS'], [ACE, SL], 'c4, c5') },
  ],
  claim: C(['CONSENSUS', 'DATA'], [SL, 'caufriez-2018'], 'c8, c11'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'elbows', title: 'Elbows moving forward or back', zoom: 'hammer-elbow', claim: C(['CONSENSUS'], [SL, ACE], 'c6, c4'),
    fix: 'Keep the elbows at your sides.' },
  // D-SHIP-W5-HAMMERWRONG: the card's twist claim (c5) is visible here; no zoom link (the hand zoom draws a bend)
  { key: 'twist', title: 'Wrists twisting out of neutral', claim: CL.c5,
    fix: 'Keep the palms facing your body the whole way.' },
  { key: 'swing', title: 'Swinging the body', claim: CL.c7,
    fix: 'Take weight off and lift with control.' },
];
const RISKS = [
  { key: 'heavy', text: 'Too heavy a weight can make you swing and cut reps short.', claim: CL.c7 },
  { key: 'delts', text: 'Elbows moving forward put extra load on the front delts.', claim: CL.c6 },
];

export default {
  schema: 1,
  id: 'lib_hammer_curl',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'curl'
    orientation: 'neutral',          // c1: palms facing the body; the key's orientation 'neutral'
    handle: 'dumbbell',              // the key's HANDLE profile
    loadAxis: V.loadAxis,            // 'across'
    // inherited grip.width: the parent sheet's string, exactly (lint/family.mjs); the child's own c10 says the same
    width: { text: 'Let the dumbbells hang slightly out from your sides if that keeps your wrist straight.', claim: CL.c10 },
    thumb: { mode: RIGHT_POSE.thumb, claim: CL.c1 },   // 'wrapped' (c1: thumbs round the handles; the key's right pose)
    contact: 'mid-palm',             // CONVENTION, data only: the key's contact 'mid' (ga:curl-mid, source hand-key-curl); the card gives none
    wrist: { ext: V.wristRange, limitText: 'Keep the wrist straight, palms facing your body.',
      claim: C(['CONSENSUS', 'CONVENTION'], [ACE, 'hand-key-curl'], 'c4. The ext range is the curl key\'s wristRange (ga:curl-mid), a convention, not a card number.') },
    pose: RIGHT_POSE,
    faults: FAULTS,
    gripLine: 'Closed neutral grip, palms facing your body, thumbs wrapped round the handles.',   // c1; the wrist line is wrist.limitText (c4)
    cue: 'Palms facing you, wrists straight.',   // c4, c5
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'load', text: 'Pick dumbbells you can curl without swinging.', claim: CL.c7 },
    { kind: 'position', text: 'Take a split stance, brace, shoulders down and back.', claim: CL.c2 },
    { kind: 'grip', text: 'Hold the dumbbells with a closed neutral grip beside your thighs.', zoom: 'hand', claim: CL.c1 },
    { kind: 'position', text: 'Curl to the front of the shoulders, lower to straight arms.', claim: CL.c3 },
  ],
  posture: [
    { key: 'grip', label: 'Neutral grip', detail: 'Palms keep facing your body, no wrist twist.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c5 },
    { key: 'elbows', label: 'Elbows still', detail: 'Elbows do not move forward.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'hammer-elbow', claim: CL.c4 },
    { key: 'torso', label: 'Upright torso', detail: 'Torso upright. No arching the lower back.', anchor: { landmark: 'backUpper', pose: 'end' }, claim: CL.c4 },
    { key: 'shrug', label: 'No shrugging', detail: 'No shrugging.', anchor: { landmark: 'shoulderTop.r', pose: 'end' }, claim: CL.c4 },
    { key: 'lower', label: 'Straight arms', detail: 'Lower until the elbows are fully straight.', anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c3 },
    { key: 'range', label: 'Full range', detail: 'Full range, not half reps.', anchor: { landmark: 'elbow.r', pose: 'start' }, claim: CL.c7 },
  ],
  feel,
  zooms,
  chips: ['hand', 'hammer-elbow', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Split stance, torso braced, shoulders down and back. Dumbbells beside your thighs, palms facing your body.',   // c2, c1
    // D-TEXT-GOLDEN: posture torso and shrug (c4), range (c7)
    mistakeLine: 'Keep the torso upright, no arching the lower back, no shrugging. Go full range, never half reps.',   // c4, c7
    cueLine: 'Palms facing you all the way.',   // c5
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['wrist'],   // the card's redFlags (inherited, the parent's ['wrist'])
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/hammer_curl.json', rev: 1 },
};
