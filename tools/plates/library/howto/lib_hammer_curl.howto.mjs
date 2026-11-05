// LIB-SHIP W5: the How-to content of lib_hammer_curl (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs; the form of lib_dumbbell_biceps_curl, W1). Every shown
// string restates a claim of the verified card docs/research/howto/cards/hammer_curl.json; its claim ids are named on
// each field's claim.
// Family (D-SHIP-FAMILY, lint/family.mjs INHERIT_MAP): child of dumbbell_biceps_curl. grip.width ->
// handling.width.text, the parent sheet's string exactly (true here: c10, the dumbbells may hang slightly away from the
// sides, the hand position that keeps the wrist straight); redFlags -> riskFlags ['wrist']; plate.view [].
// No hand zoom (D-SHIP-C3 no-zoom list, D-SHIP-W5-HAMMER; W5 panel L3 twice, recheck1): the card zoom `hammer-hand`'s
// Wrong is the wrist twisting toward palms up (c5), a forearm rotation. The hand engine cannot draw it: HandPose
// (src/howto/content-types.ts) has wrist ext and dev only, no forearm rotation, and the curl key records the twist as not
// drawable (hands/hand-curl.mjs IDS.hammer_curl comment). Its drawable faults (curled, bent back) are not the card's
// fault, so the sheet shows no hand zoom, no handling.pose and no faults, and no flexion or extension Wrong anywhere
// (D-SHIP-Q1 form). The grip copy carries c1 and c4 (gripLine) and c5 (the wrist line); the twist stays in the mistake
// row 'Wrists twisting out of neutral' (c5).
// GRIP (c) values (data only, never printed; D-SHIP-CONVCOPY): the card leaves grip.handContact empty, so the contact
// and the wrist ext range are DERIVED from the curl convention, pairs.mjs CONVENTIONS['ga:curl-mid'] (as
// lib_concentration_curl), cited as CONVENTION.
// No variant line (equipment 'Dumbbells').
import plateSpec from '../specs/hammer_curl.mjs';
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
  'ga-curl-mid': { cite: 'LIB-7 curl hand convention, pairs.mjs CONVENTIONS ga:curl-mid: across the middle of the palm, extension -10 to +10', url: 'tools/plates/library/hands/pairs.mjs',
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
// GRIP (c): the contact and wrist range DERIVED at import from the curl convention text, so they cannot drift from it
// (pairs.mjs CONVENTIONS['ga:curl-mid'], copied as lib_concentration_curl does; pairs.mjs is not imported).
const CURL_MID = 'GA 3.1 curl: across the middle of the palm; extension -10 to +10 (shared/curl.json gap 1)';   // CONVENTIONS['ga:curl-mid']
const CONTACT_OF_ZONE = { 'middle of the palm': 'mid-palm' };   // convention zone words -> HandContact
const CONTACT = Object.entries(CONTACT_OF_ZONE).find(([zone]) => CURL_MID.includes(zone))?.[1];
const EXT = CURL_MID.match(/extension (-?\d+) to \+?(-?\d+)/)?.slice(1).map(Number);
if (!CONTACT || !EXT) throw new Error(`lib_hammer_curl: pairs.mjs CONVENTIONS ga:curl-mid has no mapped contact or range: ${CURL_MID}`);

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
// One per card zoom except the hand zoom `hammer-hand` (D-SHIP-W5-HAMMER, above). The posture zoom is in the zoom
// shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
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
      redFlag: true, claim: C(['CONSENSUS'], [ACE, SL], 'c4, c5') },
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
    archetype: 'curl',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-W5-HAMMER: the card zoom\'s Wrong, the wrist twisting toward palms up (c5), is a forearm rotation the curl key cannot draw; the grip copy carries c1, c4 and c5.',
    orientation: 'neutral',          // c1: palms facing the body; the key's orientation 'neutral'
    handle: 'dumbbell',              // the key's HANDLE profile
    // inherited grip.width: the parent sheet's string, exactly (lint/family.mjs); the child's own c10 says the same
    width: { text: 'Let the dumbbells hang slightly out from your sides if that keeps your wrist straight.', claim: CL.c10 },
    thumb: { mode: 'wrapped', claim: CL.c1 },   // c1: thumbs round the handles
    contact: CONTACT,                // 'mid-palm', DERIVED from ga:curl-mid (CONVENTION, data only); the card gives none
    wrist: { ext: EXT, limitText: 'Keep the wrist from twisting through the lift.',   // c5 (grip.wrist "not twisting"); c4 is in gripLine
      claim: C(['CONSENSUS', 'CONVENTION'], [ACE, SL, 'ga-curl-mid'], 'c5, c4. The ext range is pairs.mjs CONVENTIONS ga:curl-mid, a convention, not a card number.') },
    faults: [],                      // no hand zoom: no drawn fault (D-SHIP-W5-HAMMER)
    gripLine: 'Closed neutral grip, thumbs round the handles. Wrist straight, palms facing your body.',   // c1, c4
    cue: 'Palms facing you, wrists straight.',   // c4, c5
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'load', text: 'Pick dumbbells you can curl without swinging.', claim: CL.c7 },
    { kind: 'position', text: 'Take a split stance, brace, shoulders down and back.', claim: CL.c2 },
    { kind: 'grip', text: 'Hold the dumbbells with a closed neutral grip beside your thighs.', claim: CL.c1 },
    { kind: 'position', text: 'Curl to the front of the shoulders, lower to straight arms.', claim: CL.c3 },
    // D-TEXT-GOLDEN (copy lines are not printed): posture torso and shrug (c4) moved here from the mistake line
    { kind: 'brace', text: 'Torso upright, no arching the lower back, no shrugging.', claim: CL.c4 },
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
  chips: ['hammer-elbow', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
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
