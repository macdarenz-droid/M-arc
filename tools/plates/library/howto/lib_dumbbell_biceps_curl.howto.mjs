// LIB-SHIP W1: the How-to content of lib_dumbbell_biceps_curl (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/dumbbell_biceps_curl.json; its claim ids are named on each field's claim.
// Hand zoom (D-SHIP-GRIP case (a)): the card zoom `curl-wrist` is drawn by the approved `curl` pair key
// (tools/plates/library/hands/hand-curl.mjs IDS.dumbbell_biceps_curl: variant 'dumbbell', orientation 'under', faults
// curled and bent-back). The pose, faults, contact and wrist range below are that key's recorded values, read from the
// key module so they cannot drift; the Right/Wrong notes are the pair panel's words
// (tools/plates/library/hands/words/curl-dumbbell-under.json). The card leaves grip.handContact empty: the contact is the
// key's convention 'ga:curl-mid' (hands/pairs.mjs CONVENTIONS), cited as CONVENTION, never DATA.
import plateSpec from '../specs/dumbbell_biceps_curl.mjs';
import { IDS, VARIANTS } from '../hands/hand-curl.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'sl-dbcurl': { cite: 'How to Dumbbell Curl: Muscles Worked & Proper Form', url: 'https://www.strengthlog.com/dumbbell-curl/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'ace-seated-curl': { cite: 'Seated Biceps Curl (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/44/seated-biceps-curl/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'marcolin-2018': { cite: 'Differences in electromyographic activity of biceps brachii and brachioradialis while performing three variants of curl', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6047503/',
    kind: 'peer-reviewed', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'oliveira-2009': { cite: 'Effect of the shoulder position on the biceps brachii emg in different dumbbell curls', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3737788/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'acsm-2009': { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-09-30', use: 'CONSENSUS' },
  'kerr-2010': { cite: 'Epidemiology of weight training-related injuries presenting to United States emergency departments, 1990 to 2007', url: 'https://pubmed.ncbi.nlm.nih.gov/20139328/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'WEAK' },
  // The curl key's own source for the hand contact (the card has no grip.handContact): a drawing convention.
  'hand-key-curl': { cite: 'LIB-7 hand pair key curl (dumbbell), CONVENTIONS ga:curl-mid: across the middle of the palm', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-03', use: 'CONVENTION' },  // RED_FLAG's own source (layers/howto/shared.mjs), as golden B's machine_chest_press lists it: the card's redFlags 'wrist'.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'sl-dbcurl', ACE = 'ace-seated-curl';
const CL = {
  c1: C(['CONSENSUS'], [ACE, SL], 'c1'),
  c2: C(['CONSENSUS'], [SL], 'c2'),
  c3: C(['CONSENSUS'], [SL, ACE], 'c3'),
  c4: C(['CONSENSUS'], [SL], 'c4'),
  c5: C(['CONSENSUS'], [SL, 'marcolin-2018'], 'c5'),
  c6: C(['CONSENSUS'], [ACE, SL], 'c6'),
  c7: C(['CONSENSUS'], [ACE], 'c7'),
  c8: C(['CONSENSUS'], [SL, ACE], 'c8'),
  c11: C(['CONSENSUS'], ['oliveira-2009', 'marcolin-2018', SL], 'c11'),
  c12: C(['DATA'], ['oliveira-2009'], 'c12'),
  c13: C(['CONSENSUS'], [SL], 'c13'),
  c14: C(['CONSENSUS'], [SL], 'c14'),
  c16: C(['WEAK'], ['kerr-2010'], 'c16'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant (hand-curl.mjs, radial-rules.mjs curlVariant).
const KEYED = IDS.dumbbell_biceps_curl, V = VARIANTS[KEYED.variant];
const RIGHT_POSE = V.right;
const FAULTS = KEYED.faults.map(key => {
  const f = V.faults[key];
  // HandFault.pose.wrist needs dev: the key's fault sets ext only and the engine merges it over the right pose
  // (render/closeup/common.mjs mergePose), so dev is the right pose's own value (0), written out for the type.
  return { key, label: f.label, pose: { ...f.pose, wrist: { dev: RIGHT_POSE.wrist.dev, ...f.pose.wrist } }, markers: f.markers, alt: f.alt };
});

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. 'elbow-back' (card zoom wrong, c4: "elbow swung back behind the body to cheat the
// weight"): the spec's Mistake pose draws the forward drift (MIS_FLEX 45), so this still is the same arm change mirrored
// back. The card gives no angle; the size is the plate's own drift size, not a card number.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): the elbow-back
// swing is the plate's own forward drift mirrored; no card gives its size, no number appears in user copy; the layers
// panel judges it.
const MIS = plateSpec.mistake.pose, ELBOW_BACK = { ...MIS, shoulder: { ...MIS.shoulder, flex: -MIS.shoulder.flex } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  'elbow-back': { pose: { ...plateSpec.poses.end, ...ELBOW_BACK } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same kinds; the hand zoom's key is 'hand' (golden B's chip rule). The posture zoom is in the zoom
// shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'hand', chip: 'Wrist', heading: 'Wrist position', kind: 'hand',   // card zoom key: curl-wrist
    hand: {
      right: RIGHT_POSE,
      wrong: FAULTS,                // handling.faults (golden B's shape: fault objects); the pair pages them in this order
      camera: 'side',               // the pair's camera (pairs.mjs pairSpec)
      panelHeight: V.panelHeight,
      // CONVENTION (D-SHIP-GRIP (a)): 'Middle of palm' is the curl key's ga:curl-mid label, source hand-key-curl
      // (hands/pairs.mjs CONVENTIONS; words/curl-dumbbell-under.json:9-10, radial-rules.mjs:16); the card gives no contact.
      notes: { right: 'Middle of palm', wrong: 'Wrist curled' },   // words/curl-dumbbell-under.json, first page
    },
    caption: {
      right: 'Palms forward, thumb wrapped, hand in line with forearm.',
      wrong: 'Wrist bent back or curled toward the forearm.',
    },
    // the key's alt (radial-rules.mjs curlVariant), split in two sentences for the 15-word sentence cap
    // CONVENTION (D-SHIP-GRIP (a)): the contact in this alt is the curl key's ga:curl-mid, source hand-key-curl.
    alt: { right: 'Handle across the middle of the palm, thumb wrapped round it. Wrist straight, in line with the forearm.', wrong: V.faults[KEYED.faults[0]].alt },
    feelRow: 'wrist',
  },
  {
    key: 'curl-elbow', chip: 'Elbows', heading: 'Elbow path', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's elbow for both halves; the Wrong is the
    // elbow-back still drawn alone (solid), as `stills['elbow-back']`.
    crop: { center: { at: 'elbow.r', pose: 'right', off: [0, -10] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'end', pose: ELBOW_BACK, solid: true },
    callout: {
      right: { text: 'Elbow at side', anchor: 'elbow.r' },
      wrong: { text: 'Elbow back', anchor: 'elbow.r' },
    },
    caption: {
      right: 'Upper arm by your side at the top.',
      wrong: 'Elbow swung back behind the body to cheat the weight.',
    },
    alt: {
      right: 'Side view, top of the curl. The upper arm hangs straight down by the side. The elbow is fully bent, the dumbbell in front of the shoulder.',
      wrong: 'Side view. The elbow has swung back behind the body to cheat the weight. The dumbbell hangs low, in front of the hip.',
    },
    feelRow: 'front-shoulder',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const HANDS = ['hand-left', 'hand-right', 'hand-back-left', 'hand-back-right'];
const feel = {
  primary: [{ muscleId: 'biceps', plain: 'The biceps, at the front of the upper arm, is the main muscle worked.' }],
  secondary: [{ muscleId: 'forearms', plain: 'A forearm muscle also bends the elbow, and the forearm flexors help.' }],
  watch: [],
  feelLine: 'You should feel this in the front of your upper arm.',
  rows: [
    { key: 'front-shoulder', where: 'Front of the shoulder', at: { muscles: ['front_delts'] },
      means: 'Your elbows move forward, which puts extra load on the front delts.',
      fix: 'Keep the elbows at your sides.',
      zoom: 'curl-elbow', claim: CL.c4 },
    { key: 'wrist', where: 'Wrist discomfort or pain', at: { parts: HANDS },
      means: 'Your wrists are bent up or down under load.',
      fix: "Stop and don't train through the pain. Keep the wrist straight.",
      zoom: 'hand', redFlag: true, claim: CL.c6 },
  ],
  claim: C(['CONSENSUS', 'DATA'], ['oliveira-2009', 'marcolin-2018', SL], 'c11, c12'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'wrists', title: 'Wrists bending up or down', zoom: 'hand', claim: CL.c6,
    fix: 'Keep the hand in line with the forearm.' },
  { key: 'swing', title: 'Swinging the body', claim: CL.c5,
    fix: 'Use a lighter dumbbell and lift with control.' },
  { key: 'elbows', title: 'Elbows drifting back or forward', zoom: 'curl-elbow', claim: CL.c4,
    fix: 'Keep the elbows at your sides. Never let them travel back.' },
];
const RISKS = [
  { key: 'wrist', text: 'Bent wrists under load can cause wrist discomfort.', claim: CL.c6 },
  { key: 'dropped', text: 'Across weight training, dropped weights are the most common way people get badly hurt.', claim: CL.c16 },
];

export default {
  schema: 1,
  id: 'lib_dumbbell_biceps_curl',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'curl'
    orientation: 'supinated',        // c1: palms forward; the key's orientation 'under'
    handle: 'dumbbell',              // the key's HANDLE profile
    loadAxis: V.loadAxis,            // 'across'
    width: { text: 'Let the dumbbells hang slightly out from your sides if that keeps your wrist straight.', claim: CL.c7 },
    thumb: { mode: RIGHT_POSE.thumb, claim: CL.c1 },   // 'wrapped' (c1; the key's right pose)
    contact: 'mid-palm',             // CONVENTION: the key's contact 'mid' (ga:curl-mid, source hand-key-curl); the card gives none
    wrist: { ext: V.wristRange, limitText: 'Keep the hand in line with the forearm, not bent up or down.',
      claim: C(['CONSENSUS', 'CONVENTION'], [ACE, SL, 'hand-key-curl'], 'c6. The ext range is the curl key\'s wristRange (ga:curl-mid), a convention, not a card number.') },
    pose: RIGHT_POSE,
    faults: FAULTS,
    // CONVENTION (D-SHIP-GRIP (a)): 'across the middle of your palm' is the curl key's ga:curl-mid, source hand-key-curl;
    // palms forward and thumb wrapped c1, wrist straight c6.
    gripLine: 'Palms forward, handle across the middle of your palm, thumb wrapped. Keep your wrist straight.',
    cue: 'Wrist straight, thumbs wrapped.',
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'load', text: 'Pick a weight you can curl without swinging.', claim: CL.c5 },
    { kind: 'position', text: 'Stand with feet shoulder-width, knees slightly bent.', claim: CL.c2 },
    { kind: 'grip', text: 'Palms forward, thumbs wrapped, handle across the middle of the palm.', zoom: 'hand',
      claim: C(['CONSENSUS', 'CONVENTION'], [ACE, SL, 'hand-key-curl'], 'c1. The contact is the curl key\'s ga:curl-mid (the card has no grip.handContact).') },
    { kind: 'brace', text: 'Chest up, shoulders down and slightly back.', claim: CL.c8 },
  ],
  posture: [
    { key: 'elbows', label: 'Elbows at sides', detail: 'Elbows stay close to the body.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'curl-elbow', claim: CL.c3 },
    { key: 'upper-arm', label: 'Never back', detail: 'Upper arms never travel back. Slightly forward at the top is fine.',
      anchor: { landmark: 'shoulder.r', pose: 'end' }, zoom: 'curl-elbow', claim: CL.c13 },
    { key: 'still', label: 'Still body', detail: 'Body stays still. Only the arms move.', anchor: { landmark: 'backUpper', pose: 'end' }, claim: CL.c14 },
    { key: 'wrists', label: 'Straight wrists', detail: 'Wrists stay straight.', anchor: { landmark: 'wrist.r', pose: 'end' }, zoom: 'hand', claim: CL.c6 },
    { key: 'shrug', label: 'No shrugging', detail: 'No shrugging during the lift.', anchor: { landmark: 'shoulderTop.r', pose: 'end' }, claim: CL.c8 },
    { key: 'range', label: 'Full range', detail: 'Lower until the arms are straight again.', anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c12 },
  ],
  feel,
  zooms,
  chips: ['hand', 'curl-elbow', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Stand tall, feet shoulder-width, knees slightly bent. Palms forward, elbows close to your sides.',
    mistakeLine: 'Never let your elbows travel back to cheat the weight up. Go lighter instead of swinging.',
    cueLine: 'Elbows at your sides.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['wrist'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/dumbbell_biceps_curl.json', rev: 1 },
};
