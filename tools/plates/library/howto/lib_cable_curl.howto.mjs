// LIB-SHIP W5: the How-to content of lib_cable_curl (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs; the form of lib_dumbbell_biceps_curl.howto.mjs). Every
// shown string restates a claim of the verified card docs/research/howto/cards/cable_curl.json; its claim ids are named
// on each field's claim.
// Hand zoom (D-SHIP-GRIP case (a)): the card zoom `curl-wrist` is drawn by the approved `curl` pair key
// (tools/plates/library/hands/hand-curl.mjs IDS.cable_curl: variant 'bar', orientation 'under', faults bent-back then
// curled). The pose, faults, contact and wrist range below are that key's recorded values, read from the key module so
// they cannot drift; the Right/Wrong notes are the pair panel's words (tools/plates/library/hands/words/curl-bar-under.json).
// The card leaves grip.thumb and grip.handContact empty: the thumb is the key's right-pose thumb and the contact the key's
// convention 'ga:curl-mid' (hands/pairs.mjs CONVENTIONS), both cited as CONVENTION, data only: never printed in any
// string (D-SHIP-CONVCOPY).
// Pose map: the spec's start is the top of the curl and its end the bottom (specs/cable_curl.mjs, D-LIB15-POSE).
// No parent, no variant line (equipment 'Cable').
import plateSpec from '../specs/cable_curl.mjs';
import { IDS, VARIANTS, HANDLE } from '../hands/hand-curl.mjs';
import { BUILDERS } from '../templates/CURL.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'sl-cablecurl': { cite: 'How to Do Cable Curl With Bar: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/cable-curl-with-bar/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'fb-cablecurl': { cite: 'Cable Bicep Curl: Form, Muscles Worked, Target Weight & Variations (Fitbod)', url: 'https://fitbod.me/exercises/cable-bicep-curl',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-dbcurl': { cite: 'How to Dumbbell Curl: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/dumbbell-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'MECH' },
  'ace-seated-curl': { cite: 'Seated Biceps Curl (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/44/seated-biceps-curl/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'MECH' },
  'marcolin-2018': { cite: 'Differences in electromyographic activity of biceps brachii and brachioradialis while performing three variants of curl', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6047503/',
    kind: 'peer-reviewed', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'acsm-2009': { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-22', use: 'CONSENSUS' },
  'larsen-2026': { cite: 'The effects of shoulder extension angle on elbow flexor hypertrophy in the cable curl exercise', url: 'https://pubmed.ncbi.nlm.nih.gov/41988507/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // The curl key's own source for the thumb and the hand contact (the card has neither): drawing conventions.
  'hand-key-curl': { cite: 'LIB-7 hand pair key curl (bar): right-pose thumb wrapped; CONVENTIONS ga:curl-mid, across the middle of the palm', url: 'tools/plates/library/hands/hand-curl.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG's own source (layers/howto/shared.mjs), as golden B's machine_chest_press lists it: the card's redFlags 'wrist'.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
};
// Not cited: c10 (tempo, a plate drawing convention), c11 (load progression), c12 (hypertrophy study).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'sl-cablecurl', FB = 'fb-cablecurl';
const CL = {
  c1: C(['CONSENSUS'], [SL], 'c1'),
  c3: C(['CONSENSUS'], [SL, FB], 'c3'),
  c4: C(['CONSENSUS'], [SL, FB], 'c4'),
  c7: C(['MECH'], ['sl-dbcurl'], 'c7'),
  c8: C(['MECH'], ['sl-dbcurl'], 'c8'),
  c9: C(['MECH'], ['ace-seated-curl', 'sl-dbcurl'], 'c9'),
  c13: C(['CONSENSUS'], [FB], 'c13'),
  stand: C(['CONSENSUS'], [SL, FB], 'c1, c2'),
  back: C(['CONSENSUS', 'MECH'], [SL, FB, 'sl-dbcurl'], 'c3, c7'),
  finish: C(['CONSENSUS'], [SL, FB], 'c4, c13'),
  wrist: C(['MECH'], ['ace-seated-curl', 'sl-dbcurl', 'nhs-wrist-pain'], 'c9, c14'),
  feel: C(['CONSENSUS'], [SL, FB, 'marcolin-2018'], 'c6, c5'),
  // card grip.thumb is empty: the curl key's right-pose thumb (radial-rules.mjs curlVariant), data only, never printed.
  thumb: C(['CONVENTION'], ['hand-key-curl'], 'card grip.thumb is empty: the curl key\'s right-pose thumb, a convention, never shown.'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant (hand-curl.mjs, radial-rules.mjs curlVariant).
const KEYED = IDS.cable_curl, V = VARIANTS[KEYED.variant];
const RIGHT_POSE = V.right;
// CONVENTION (D-SHIP-GRIP (a), source hand-key-curl): the key's contact 'mid' (ga:curl-mid) as HandContact. Data only.
const CONTACT = { mid: 'mid-palm' }[V.contact];
if (!CONTACT) throw new Error(`lib_cable_curl: the curl key's contact ${V.contact} has no HandContact`);
const FAULTS = KEYED.faults.map(key => {
  const f = V.faults[key];
  // HandFault.pose.wrist needs dev: the key's fault sets ext only and the engine merges it over the right pose
  // (render/closeup/common.mjs mergePose), so dev is the right pose's own value (0), written out for the type.
  return { key, label: f.label, pose: { ...f.pose, wrist: { dev: RIGHT_POSE.wrist.dev, ...f.pose.wrist } }, markers: f.markers, alt: f.alt };
});

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. 'elbows-back' (card zoom curl-elbow Wrong, c7: "Upper arm swung back behind the
// body"): the spec's start (the top: upper arm vertical, elbow 140) with the upper arm swung back. The spec's Mistake is
// a different fault (arms straight at the bottom, c13), so this still is built here.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and the approved lib_barbell_curl plate): the swing
// back is the CURL template's `elbows` builder, dir 'back' (templates/CURL.mjs BUILDERS: shoulder flex -30, elbow 140),
// read from the template so it cannot drift; the elbow 140 equals this spec's ELBOW_TOP. No card gives the size, no
// number appears in user copy; the layers panel judges it.
const BACK = BUILDERS.elbows.back;
const ELBOWS_BACK = { shoulder: { flex: BACK.flex, rot: 0 }, elbow: BACK.elbow };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  'elbows-back': { pose: { ...plateSpec.poses.start, ...ELBOWS_BACK } },
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
      // The pair key's own panel words (words/curl-bar-under.json, first page bent-back), drawn by the key.
      notes: { right: 'Middle of palm', wrong: 'Wrist bent back' },
    },
    caption: {
      right: 'Palms up, hand in line with the forearm.',          // card zoom right (c9)
      wrong: 'Wrist bent back or curled toward the forearm.',     // the key's two drawn faults; c9 (bent wrists)
    },
    // Right: the card's own words (c1, c9), no thumb or contact (D-SHIP-CONVCOPY); Wrong: the key's alt.
    alt: { right: 'Bar held palm up. Wrist straight, in line with the forearm.', wrong: FAULTS[0].alt },
    feelRow: 'wrist',
  },
  {
    key: 'curl-elbow', chip: 'Elbows', heading: 'Elbow path', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's elbow for both halves; the Right is the spec's
    // start (the top), the Wrong the elbows-back still drawn alone (solid), as `stills['elbows-back']`.
    crop: { center: { at: 'elbow.r', pose: 'right', off: [0, -10] }, sizePx: 150 },
    right: 'start',
    wrong: { base: 'start', pose: ELBOWS_BACK, solid: true },
    callout: {
      right: { text: 'Elbow at side', anchor: 'elbow.r' },
      wrong: { text: 'Elbow back', anchor: 'elbow.r' },
    },
    caption: {
      right: 'Upper arm by the side at the top.',        // card zoom right (c3)
      wrong: 'Upper arm swung back behind the body.',     // card zoom wrong (c7)
    },
    alt: {
      right: 'Side view, top of the curl. The upper arm hangs straight down by the side, the bar near the shoulder.',
      wrong: 'Side view, top of the curl. The upper arm has swung back behind the body.',
    },
    feelRow: 'front-shoulder',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const HANDS = ['hand-left', 'hand-right', 'hand-back-left', 'hand-back-right'];
const feel = {
  primary: [{ muscleId: 'biceps', plain: 'The biceps, at the front of the upper arm, do most of the work.' }],
  secondary: [{ muscleId: 'forearms', plain: 'The forearm flexors help, and a forearm muscle also bends the elbow.' }],
  watch: [{ muscleId: 'front_delts', plain: 'The front delts take load if the elbows drift forward.' }],   // c7
  // The card's first row (front of the upper arm, c5) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
  feelLine: 'You should feel this in the front of your upper arms.',
  rows: [
    { key: 'front-shoulder', where: 'Front of the shoulder', at: { muscles: ['front_delts'] },
      means: 'Your elbows drift well forward, which loads the front delts.',
      fix: 'Keep the elbows at your sides.',
      zoom: 'curl-elbow', claim: CL.c7 },
    { key: 'wrist', where: 'Wrist discomfort or pain', at: { parts: HANDS },
      means: 'Your wrists are bent up or down under load.',
      fix: "Stop and don't train through the pain. Keep the wrist straight.",
      zoom: 'hand', redFlag: true, claim: CL.wrist },
  ],
  claim: CL.feel,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'straight', title: 'Arms straight at the bottom', claim: CL.c13,
    fix: 'Limit the range. Keep the arm slightly bent between reps.' },
  { key: 'back', title: 'Upper arms travelling back', zoom: 'curl-elbow', claim: CL.back,
    fix: 'Keep the upper arms still by your sides.' },
  { key: 'swing', title: 'Swinging the body', claim: CL.c8,
    fix: 'Use less weight and lift with control.' },
];
const RISKS = [
  { key: 'wrist', text: 'Bent wrists under load can cause wrist discomfort.', claim: CL.c9 },
];

export default {
  schema: 1,
  id: 'lib_cable_curl',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'curl'
    orientation: 'supinated',        // c1: underhand, palms up; the key's orientation 'under'
    handle: V.handle?.profile ?? HANDLE.profile,   // the key's bar variant: 'bar-28' (the spec's 28 mm straight bar)
    loadAxis: V.loadAxis,            // 'across'
    width: { text: 'Hands about shoulder-width apart.', claim: CL.c1 },
    thumb: { mode: RIGHT_POSE.thumb, claim: CL.thumb },   // CONVENTION: the key's right-pose thumb ('wrapped'); never printed
    contact: CONTACT,                // CONVENTION: 'mid-palm' from the key's ga:curl-mid (source hand-key-curl); never printed
    wrist: { ext: V.wristRange, limitText: 'Keep the hand in line with the forearm.',
      claim: C(['MECH', 'CONVENTION'], ['ace-seated-curl', 'sl-dbcurl', 'hand-key-curl'], 'c9. The ext range is the curl key\'s wristRange (ga:curl-mid), a convention, not a card number.') },
    pose: RIGHT_POSE,
    faults: FAULTS,
    gripLine: 'Underhand grip, palms up, hands about shoulder-width. Keep your wrists straight.',   // c1, c9
    cue: 'Wrist in line with the forearm.',   // c9
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'adjust', text: 'Set the pulley to the lowest position and attach a bar.', claim: CL.c1 },
    { kind: 'grip', text: 'Take an underhand grip, hands about shoulder-width.', zoom: 'hand', claim: CL.c1 },
    { kind: 'position', text: 'Step back from the stack. Stand upright, feet about hip-width.', claim: CL.stand },
    { kind: 'load', text: 'Pick a weight you can curl without swinging.', claim: CL.c8 },
    { kind: 'finish', text: 'Lift and lower under control, arms slightly bent at the bottom.', claim: CL.finish },   // D-TEXT-GOLDEN: posture lower (c4), bent (c13)
  ],
  posture: [
    { key: 'elbows', label: 'Elbows at sides', detail: 'Elbows stay close to the torso.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, zoom: 'curl-elbow', claim: CL.c3 },
    { key: 'upper-arm', label: 'Never back', detail: 'Upper arms stay still or move slightly forward, never back.',
      anchor: { landmark: 'shoulder.r', pose: 'start' }, zoom: 'curl-elbow', claim: CL.c3 },
    { key: 'still', label: 'Still body', detail: 'Body stays still. Only the arms move.', anchor: { landmark: 'backUpper', pose: 'start' }, claim: CL.c8 },
    { key: 'wrists', label: 'Straight wrists', detail: 'Wrists stay straight.', anchor: { landmark: 'wrist.r', pose: 'start' }, zoom: 'hand', claim: CL.c9 },
    { key: 'control', label: 'Controlled lowering', detail: 'Lower under control.', anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c4 },
    { key: 'bent', label: 'Slight bend', detail: 'Keep the arm slightly bent at the bottom to maintain tension.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c13 },
  ],
  feel,
  zooms,
  chips: ['hand', 'curl-elbow', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Bar on the low pulley, underhand grip. Step back, stand upright, elbows close to your torso.',
    mistakeLine: 'Keep a slight bend at the bottom. Never let your upper arms travel back.',
    cueLine: 'Elbows close, body still.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['wrist'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/cable_curl.json', rev: 1 },
};
