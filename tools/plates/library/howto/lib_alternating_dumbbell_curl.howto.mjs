// LIB-SHIP W5: the How-to content of lib_alternating_dumbbell_curl (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs; the form of lib_dumbbell_biceps_curl, W1). Every shown
// string restates a claim of the verified card docs/research/howto/cards/alternating_dumbbell_curl.json; its claim ids
// are named on each field's claim.
// Family (D-SHIP-FAMILY, lint/family.mjs INHERIT_MAP): child of dumbbell_biceps_curl. grip.type -> handling.orientation
// 'supinated' and handling.handle 'dumbbell'; grip.thumb -> handling.thumb.mode and handling.pose.thumb ('wrapped');
// grip.width -> handling.width.text, the parent sheet's string exactly (true here: c13, the dumbbells may hang slightly
// away from the sides, the hand position that keeps the wrist straight); redFlags -> riskFlags ['wrist']; plate.view [].
// Hand zoom (D-SHIP-GRIP case (a)): the card zoom `curl-wrist` is drawn by the approved `curl` pair key
// (tools/plates/library/hands/hand-curl.mjs IDS.alternating_dumbbell_curl: variant 'dumbbell', orientation 'under',
// faults curled and bent-back). The pose, faults and wrist range below are that key's recorded values, read from the key
// module so they cannot drift; the Right/Wrong notes are the pair panel's words
// (tools/plates/library/hands/words/curl-dumbbell-under.json). The card leaves grip.handContact empty: the contact is the
// key's convention 'ga:curl-mid' (hands/pairs.mjs CONVENTIONS), cited as CONVENTION, and is data only (D-SHIP-CONVCOPY:
// never printed in the grip line, setup, captions, alt or cue).
// No variant line (equipment 'Dumbbells').
import plateSpec from '../specs/alternating_dumbbell_curl.mjs';
import { IDS, VARIANTS } from '../hands/hand-curl.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-hammer': { cite: 'Hammer Curl (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/10/hammer-curl/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'nielasher-alt': { cite: 'Alternating Dumbbell Curls (Niel Asher Education)', url: 'https://nielasher.com/blogs/strength-and-conditioning/alternating-dumbbell-curls',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-dbcurl': { cite: 'How to Dumbbell Curl: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/dumbbell-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'marcolin-2018': { cite: 'Differences in electromyographic activity of biceps brachii and brachioradialis while performing three variants of curl', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6047503/',
    kind: 'peer-reviewed', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'acsm-2009': { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-22', use: 'CONSENSUS' },
  // The curl key's own source for the hand contact (the card has no grip.handContact): a drawing convention.
  'hand-key-curl': { cite: 'LIB-7 hand pair key curl (dumbbell), CONVENTIONS ga:curl-mid: across the middle of the palm', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG's own source (layers/howto/shared.mjs), as golden B's machine_chest_press lists it: the card's redFlags 'wrist'.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
};
// Not cited: c10 (tempo, the plate's), c8 (breathing; no field here restates it).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-hammer', NA = 'nielasher-alt', SL = 'sl-dbcurl';
const CL = {
  c1: C(['CONSENSUS'], [ACE, NA], 'c1'),
  c2: C(['CONSENSUS'], [SL], 'c2'),
  c3: C(['CONSENSUS', 'MECH'], [ACE], 'c3'),
  c4: C(['CONSENSUS', 'MECH'], [ACE], 'c4'),
  c5: C(['CONSENSUS'], [NA, SL], 'c5'),
  c6: C(['CONSENSUS'], [NA, SL], 'c6'),
  c7: C(['CONSENSUS'], [SL], 'c7'),
  c12: C(['CONSENSUS', 'MECH'], [ACE], 'c12'),
  c13: C(['CONSENSUS', 'MECH'], [ACE], 'c13'),
  c14: C(['CONSENSUS'], [SL, 'marcolin-2018'], 'c14'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant (hand-curl.mjs, radial-rules.mjs curlVariant).
const KEYED = IDS.alternating_dumbbell_curl, V = VARIANTS[KEYED.variant];
const RIGHT_POSE = V.right;
const FAULTS = KEYED.faults.map(key => {
  const f = V.faults[key];
  // HandFault.pose.wrist needs dev: the key's fault sets ext only and the engine merges it over the right pose
  // (render/closeup/common.mjs mergePose), so dev is the right pose's own value (0), written out for the type.
  return { key, label: f.label, pose: { ...f.pose, wrist: { dev: RIGHT_POSE.wrist.dev, ...f.pose.wrist } }, markers: f.markers, alt: f.alt };
});

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. 'swing' (card zoom alt-curl-arms Wrong, c6/c14: "Trunk moving as the dumbbell swings
// up"): the end pose with the pelvis and trunk tipped SWAY deg back from the hips as one piece, feet held by the spec's
// plant; the arms keep their angles to the trunk, so the curled dumbbell rides back with the body. The plate's own
// Mistake is the elbow swing (c5), not this fault.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and lib_reverse_lunge's LEAN 30 deg): SWAY 15 deg
// is a Wrong-pose size no card gives; no number from it appears in user copy; the layers panel judges it.
const SWAY = 15;
const END = plateSpec.poses.end;
const SWING = { root: { ...END.root, tilt: -SWAY } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  swing: { pose: { ...END, ...SWING } },
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
      camera: 'side',               // the pair's camera (pairs.mjs ORIENTATIONS.under)
      panelHeight: V.panelHeight,
      // The pair panel's own words (D-SHIP-CONVCOPY allows the key's panel words): 'Middle of palm' is the curl key's
      // ga:curl-mid label, source hand-key-curl (words/curl-dumbbell-under.json, radial-rules.mjs:16).
      notes: { right: 'Middle of palm', wrong: 'Wrist curled' },   // words/curl-dumbbell-under.json, first page
    },
    caption: {
      right: 'Closed palms-forward grip, hand in line with the forearm.',   // card zoom right (c2, c3, c7)
      wrong: 'Wrist bent back or curled toward the forearm.',               // card zoom wrong (c7); the key's two faults
    },
    // The key's alt without its contact words (D-SHIP-CONVCOPY): palms forward c2, thumb wrapped c3, wrist straight c7.
    alt: { right: 'Palm forward, thumb wrapped round the handle. Wrist straight, in line with the forearm.', wrong: V.faults[KEYED.faults[0]].alt },
    feelRow: 'wrist',
  },
  {
    key: 'alt-curl-arms', chip: 'Arms', heading: 'Arm and trunk', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's chest, wide enough for the curled arm, the
    // resting arm and the trunk; the Wrong is the swing still drawn alone (solid), as `stills.swing`.
    crop: { center: { at: 'chest', pose: 'right', off: [0, 10] }, sizePx: 200 },
    right: 'end',
    wrong: { base: 'end', pose: SWING, solid: true },
    callout: {
      right: { text: 'Torso upright', anchor: 'backUpper' },
      wrong: { text: 'Trunk swings', anchor: 'backUpper' },
    },
    caption: {
      right: 'Working arm curled, resting arm hanging straight, torso upright.',   // card zoom right (c1, c4, c14)
      wrong: 'Trunk moving as the dumbbell swings up.',                            // card zoom wrong (c6, c14)
    },
    alt: {
      right: 'Side view, top of the curl. One arm is curled, the other hangs straight. The torso is upright.',
      wrong: 'Side view. The trunk tips back as the dumbbell swings up, so the body helps lift it.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const HANDS = ['hand-left', 'hand-right', 'hand-back-left', 'hand-back-right'];
const feel = {
  primary: [{ muscleId: 'biceps', plain: 'The biceps, at the front of the upper arm, bends the elbow.' }],
  secondary: [{ muscleId: 'forearms', plain: 'A forearm muscle also helps bend the elbow.' }],
  watch: [],
  // The card's first row (front of the upper arm, c9) has no fix, so it is left off the rows (D-SHIP-Q16); the feel
  // line says it.
  feelLine: 'You should feel this in the front of your upper arm.',
  rows: [
    { key: 'wrist', where: 'Wrist discomfort or pain', at: { parts: HANDS },
      means: 'Your wrists are bent up or down under load.',
      fix: "Stop and don't train through the pain. Keep the wrist straight.",
      zoom: 'hand', redFlag: true, claim: C(['CONSENSUS'], [SL, NA], 'c7, c15') },
  ],
  claim: C(['CONSENSUS'], ['marcolin-2018'], 'c9'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'wrists', title: 'Wrist bending up or down', zoom: 'hand', claim: CL.c7,
    fix: 'Keep the hand in line with the forearm.' },
  { key: 'elbow', title: 'Elbow swinging forward or back', claim: CL.c5,
    fix: 'Keep the elbow close to your torso.' },
  { key: 'swing', title: 'Swinging the body', zoom: 'alt-curl-arms', claim: CL.c6,
    fix: 'Use a lighter dumbbell and lift with control.' },
];
const RISKS = [
  { key: 'wrist', text: 'Bent wrists under load can cause wrist discomfort.', claim: CL.c7 },
];

export default {
  schema: 1,
  id: 'lib_alternating_dumbbell_curl',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'curl'
    orientation: 'supinated',        // inherited grip.type (parent's value); c2: palms forward; the key's orientation 'under'
    handle: 'dumbbell',              // inherited grip.type (parent's value); the key's HANDLE profile
    loadAxis: V.loadAxis,            // 'across'
    // inherited grip.width: the parent sheet's string, exactly (lint/family.mjs); the child's own c13 says the same
    width: { text: 'Let the dumbbells hang slightly out from your sides if that keeps your wrist straight.', claim: CL.c13 },
    thumb: { mode: RIGHT_POSE.thumb, claim: CL.c3 },   // inherited grip.thumb 'wrapped' (c3: thumbs round the handles; the key's right pose)
    contact: 'mid-palm',             // CONVENTION, data only: the key's contact 'mid' (ga:curl-mid, source hand-key-curl); the card gives none
    wrist: { ext: V.wristRange, limitText: 'Keep the hand in line with the forearm, not bent up or down.',
      claim: C(['CONSENSUS', 'CONVENTION'], [SL, 'hand-key-curl'], 'c7. The ext range is the curl key\'s wristRange (ga:curl-mid), a convention, not a card number.') },
    pose: RIGHT_POSE,                // inherited grip.thumb: pose.thumb 'wrapped'
    faults: FAULTS,
    gripLine: 'Palms forward, thumbs wrapped round the handles.',   // c2, c3; the wrist line is wrist.limitText (c7)
    cue: 'Wrist straight, thumbs wrapped.',   // c7, c3
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'load', text: 'Pick dumbbells light enough to curl without swinging.', claim: C(['CONSENSUS'], [NA, 'acsm-2009', SL], 'c11, c6') },
    { kind: 'position', text: 'Stand in a split stance, torso braced, shoulders down and back.', claim: CL.c3 },
    { kind: 'grip', text: 'Palms-forward grip, thumbs round the handles, arms at your sides.', zoom: 'hand',
      claim: C(['CONSENSUS', 'MECH'], [SL, ACE], 'c2, c3') },
    { kind: 'position', text: 'Curl one arm while the other stays down. Lower before switching.', zoom: 'alt-curl-arms', claim: CL.c1 },
    // D-TEXT-GOLDEN: posture range (c12)
    { kind: 'finish', text: 'Curl to the front of the shoulder, lower to a straight arm.', claim: CL.c12 },
  ],
  posture: [
    { key: 'other', label: 'Other arm still', detail: 'Resting arm stays in the start position.',
      anchor: { landmark: 'wrist.l', pose: 'end' }, zoom: 'alt-curl-arms', claim: CL.c1 },
    { key: 'elbows', label: 'Elbows at sides', detail: 'Working elbow stays close to the torso.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c5 },
    { key: 'torso', label: 'Torso upright', detail: 'Torso upright. No arching the lower back.',
      anchor: { landmark: 'backUpper', pose: 'end' }, zoom: 'alt-curl-arms', claim: CL.c4 },
    { key: 'wrists', label: 'Straight wrists', detail: 'Wrists stay straight.', anchor: { landmark: 'wrist.r', pose: 'end' }, zoom: 'hand', claim: CL.c7 },
    { key: 'range', label: 'Full range', detail: 'Curl to the front of the shoulder, lower to a straight arm.',
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c12 },
    { key: 'still', label: 'Still body', detail: 'Body stays still. Only the arm moves.', anchor: { landmark: 'hip.r', pose: 'end' }, zoom: 'alt-curl-arms', claim: CL.c14 },
  ],
  feel,
  zooms,
  chips: ['hand', 'alt-curl-arms', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Split stance, torso braced, shoulders down and back. Palms forward, arms at your sides.',   // c3, c2
    // D-TEXT-GOLDEN: posture torso (c4) and still (c14)
    mistakeLine: 'Never swing your body to lift the weight. Keep the torso upright, no arching the lower back.',   // c6, c14, c4
    cueLine: 'Body still, only the arm moves.',   // c14
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['wrist'],   // the card's redFlags (inherited, the parent's ['wrist'])
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/alternating_dumbbell_curl.json', rev: 1 },
};
