// LIB-SHIP W5: the How-to content of lib_cross_body_hammer_curl (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs; the form of lib_dumbbell_biceps_curl, W1). Every shown
// string restates a claim of the verified card docs/research/howto/cards/cross_body_hammer_curl.json; its claim ids are
// named on each field's claim. No parent (the card names none).
// Hand zoom (D-SHIP-GRIP case (a)): the card zoom `hammer-wrist` is drawn by the approved `curl` pair key
// (tools/plates/library/hands/hand-curl.mjs IDS.cross_body_hammer_curl: variant 'dumbbell', orientation 'neutral',
// faults curled and bent-back). The pose, faults and wrist range below are that key's recorded values, read from the key
// module so they cannot drift; the Right/Wrong notes are the pair panel's words (hands/words/curl-dumbbell-neutral.json).
// The card leaves grip.thumb empty, but its c5 says the grip is closed, "thumbs around the handles": the thumb is cited to
// c5 (the key's right pose draws the same 'wrapped'). The card leaves grip.handContact empty: the contact is the key's
// convention 'ga:curl-mid' (hands/pairs.mjs CONVENTIONS), cited as CONVENTION, and is data only (D-SHIP-CONVCOPY: never
// printed).
// D-SHIP-W5-HAMMERWRONG (Q-W5-8): the card zoom's Wrong ("Wrist twisted or bent", c7) includes a twist, a forearm
// rotation the radial view cannot draw; the key draws the wrist curled and bent back. The zoom's Wrong caption names the
// drawn fault, from the card's own wrist-straight claim (c5), and never says "twist"; the twist claim (c7, "no bend or
// twist") is the Grip section's wrist line (handling.wrist.limitText).
// Plate: FRONT view (the card's plate.view); the posture crop is cut in the plate's own view (F-CROP-FRONT, #380).
// No variant line (equipment 'Dumbbells').
import plateSpec from '../specs/cross_body_hammer_curl.mjs';
import { IDS, VARIANTS } from '../hands/hand-curl.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'fb-cbhammer': { cite: 'Cross Body Hammer Curls: Form, Muscles Worked, Target Weight & Variations (Fitbod)', url: 'https://fitbod.me/exercises/cross-body-hammer-curls',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ace-hammer': { cite: 'Hammer Curl (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/10/hammer-curl/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'MECH' },
  'sl-hammer': { cite: 'How to Do Hammer Curl: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/hammer-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'MECH' },
  'coratella-2023': { cite: 'Biceps Brachii and Brachioradialis Excitation in Biceps Curl Exercise: Different Handgrips, Different Synergy', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10054060/',
    kind: 'peer-reviewed', access: 'full', checked: '2026-10-22', use: 'DATA' },
  'kerr-2010': { cite: 'Epidemiology of weight training-related injuries presenting to United States emergency departments, 1990 to 2007', url: 'https://pubmed.ncbi.nlm.nih.gov/20139328/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'WEAK' },
  // The curl key's own source for the hand contact (the card has no grip.handContact): a drawing convention.
  'hand-key-curl': { cite: 'LIB-7 hand pair key curl (dumbbell), CONVENTIONS ga:curl-mid: across the middle of the palm', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG's own source (layers/howto/shared.mjs), as golden B's machine_chest_press lists it: the card's redFlags 'wrist'.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
};
// Not cited: acsm-2009 (c11, c12: tempo and progression; no field here restates them).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const FB = 'fb-cbhammer', ACE = 'ace-hammer', SL = 'sl-hammer';
const CL = {
  c1: C(['CONSENSUS'], [FB], 'c1'),
  c2: C(['CONSENSUS'], [FB], 'c2'),
  c4: C(['CONSENSUS'], [FB], 'c4'),
  c5: C(['MECH'], [ACE], 'c5'),
  c6: C(['MECH'], [ACE], 'c6'),
  c7: C(['MECH'], [SL], 'c7'),
  c13: C(['WEAK'], ['kerr-2010'], 'c13'),
  c15: C(['CONSENSUS'], [FB], 'c15'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant (hand-curl.mjs, radial-rules.mjs curlVariant).
const KEYED = IDS.cross_body_hammer_curl, V = VARIANTS[KEYED.variant];
const RIGHT_POSE = V.right;
const FAULTS = KEYED.faults.map(key => {
  const f = V.faults[key];
  // HandFault.pose.wrist needs dev: the key's fault sets ext only and the engine merges it over the right pose
  // (render/closeup/common.mjs mergePose), so dev is the right pose's own value (0), written out for the type.
  return { key, label: f.label, pose: { ...f.pose, wrist: { dev: RIGHT_POSE.wrist.dev, ...f.pose.wrist } }, markers: f.markers, alt: f.alt };
});

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. 'shrug' (card zoom cross-arc Wrong, c5: "Working shoulder shrugged up toward the
// ear") is the spec's own Mistake (the working shoulder shrugging, c5/c6), merged over the end pose. No drawing value of
// this sheet's own: the Mistake's sizes are the spec's.
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  shrug: { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same kinds; the hand zoom's key is 'hand' (golden B's chip rule). The posture zoom is in the zoom
// shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs), in the plate's
// front view.
const zooms = [
  {
    key: 'hand', chip: 'Wrist', heading: 'Wrist position', kind: 'hand',   // card zoom key: hammer-wrist
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
      right: 'Palm facing the body, wrist straight.',   // card zoom right (c7, c5)
      // D-SHIP-W5-HAMMERWRONG: the key's drawn faults (curled, bent back), the inverse of c5 "keep the wrist straight"
      wrong: 'Wrist bent back or curled toward the forearm.',
    },
    // The key's alt without its contact words (D-SHIP-CONVCOPY): palm facing the body c1, thumb round the handle c5.
    alt: { right: 'Palm facing the body, thumb round the handle. Wrist straight, in line with the forearm.', wrong: V.faults[KEYED.faults[0]].alt },
    feelRow: 'wrist',
  },
  {
    key: 'cross-arc', chip: 'Shoulders', heading: 'Shoulder line', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs), front view: crop centre on the right pose's chest for both halves, wide
    // enough for both shoulders and the dumbbell at the opposite shoulder; the Wrong is the spec's Mistake drawn alone
    // (solid), as `stills.shrug`.
    crop: { center: { at: 'chest', pose: 'right', off: [0, -35] }, sizePx: 190 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Shoulders level', anchor: 'shoulderTop.r' },
      wrong: { text: 'Shoulder shrugs', anchor: 'shoulderTop.r' },
    },
    caption: {
      right: 'Dumbbell arcs toward the opposite shoulder, shoulders level.',   // card zoom right (c2, c5)
      wrong: 'Working shoulder shrugged up toward the ear.',                  // card zoom wrong (c5)
    },
    alt: {
      right: 'Front view, top of the curl. The dumbbell is near the opposite shoulder. Both shoulders stay level and down.',
      wrong: 'Front view. The working shoulder is shrugged up toward the ear as the dumbbell rises.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const HANDS = ['hand-left', 'hand-right', 'hand-back-left', 'hand-back-right'];
const feel = {
  primary: [{ muscleId: 'biceps', plain: 'The biceps, at the front of the upper arm, is the target.' }],
  secondary: [{ muscleId: 'forearms', plain: 'The forearm flexors help, especially the brachioradialis.' }],
  watch: [{ muscleId: 'front_delts', plain: 'A neutral grip can work the front of the shoulder more.' }],
  // The card's first two rows (front of the upper arm; forearm, c9) have no fix, so they are left off the rows
  // (D-SHIP-Q16); the feel line says them.
  feelLine: 'You should feel this in the front of your upper arm and your forearm.',
  rows: [
    { key: 'wrist', where: 'Wrist', at: { parts: HANDS },
      means: 'Your wrist is bending or twisting.',
      fix: "Keep the palm facing your body. Go lighter if you can't.",
      zoom: 'hand', redFlag: true, claim: C(['MECH', 'CONSENSUS'], [SL, ACE, FB], 'c7, c5, c4') },
  ],
  claim: C(['CONSENSUS', 'DATA', 'WEAK'], [SL, FB, 'coratella-2023'], 'c9, c10'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'straight', title: 'Arm fully straight at bottom', claim: CL.c15,
    fix: 'Limit the range. Keep the arm slightly bent between reps.' },
  { key: 'swing', title: 'Swinging the dumbbells with momentum', claim: CL.c4,
    fix: 'Go lighter and control the weight. A seated version helps stop swinging.' },
  { key: 'shrug', title: 'Shrugging the shoulder', zoom: 'cross-arc', claim: C(['MECH'], [ACE], 'c5, c6'),
    fix: 'Keep the shoulders down and back.' },
];
const RISKS = [
  { key: 'swing', text: 'Swinging the dumbbells raises the risk of injury.', claim: CL.c4 },
  { key: 'dropped', text: 'Across weight training, dropped weights are the most common way people get badly hurt.', claim: CL.c13 },
];

export default {
  schema: 1,
  id: 'lib_cross_body_hammer_curl',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'curl'
    orientation: 'neutral',          // c1: palms facing the body; the key's orientation 'neutral'
    handle: 'dumbbell',              // the key's HANDLE profile
    loadAxis: V.loadAxis,            // 'across'
    width: { text: 'Dumbbells in front of you, feet about shoulder-width.', claim: CL.c1 },   // card grip.width
    thumb: { mode: RIGHT_POSE.thumb, claim: CL.c5 },   // 'wrapped' (c5: thumbs around the handles; the key's right pose)
    contact: 'mid-palm',             // CONVENTION, data only: the key's contact 'mid' (ga:curl-mid, source hand-key-curl); the card gives none
    // D-SHIP-W5-HAMMERWRONG: the Grip wrist line carries c7's "no bend or twist" (card grip.wrist)
    wrist: { ext: V.wristRange, limitText: 'Keep the wrist straight, with no bend or twist.',
      claim: C(['MECH', 'CONVENTION'], [SL, ACE, 'hand-key-curl'], 'c7, c5. The ext range is the curl key\'s wristRange (ga:curl-mid), a convention, not a card number.') },
    pose: RIGHT_POSE,
    faults: FAULTS,
    gripLine: 'Closed neutral grip, palms facing your body, thumbs round the handles.',   // c1, c5
    cue: 'Palm facing you, wrist straight.',   // c7, c5
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'load', text: 'Pick a weight you can lift without swinging.', claim: CL.c4 },
    { kind: 'position', text: 'Stand with feet about shoulder-width apart.', claim: CL.c1 },
    { kind: 'grip', text: 'Hold the dumbbells in front of you, palms facing your body.', zoom: 'hand', claim: CL.c1 },
    { kind: 'brace', text: 'Brace your trunk, shoulders down and back.', claim: CL.c6 },
    // D-TEXT-GOLDEN: posture arc, same path and switch (c2); elbow in place is the cue line
    { kind: 'position', text: 'Curl toward the opposite shoulder. Lower the same path, then switch.',
      zoom: 'cross-arc', claim: CL.c2 },
  ],
  posture: [
    { key: 'arc', label: 'Arc across', detail: 'Curl toward the opposite shoulder in an arc.',
      anchor: { landmark: 'grip.r', pose: 'end' }, zoom: 'cross-arc', claim: CL.c2 },
    { key: 'elbow', label: 'Elbow in place', detail: 'Elbow stays in place, arm slightly bent at the bottom.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, claim: C(['CONSENSUS'], [FB], 'c2, c15') },
    { key: 'palms', label: 'Palms face body', detail: 'Palm keeps facing the body, wrist straight.',
      anchor: { landmark: 'wrist.r', pose: 'end' }, zoom: 'hand', claim: C(['MECH'], [SL, ACE], 'c7, c5') },
    { key: 'shrug', label: 'Shoulders down', detail: 'No shrugging.', anchor: { landmark: 'shoulderTop.r', pose: 'end' }, zoom: 'cross-arc', claim: CL.c5 },
    { key: 'torso', label: 'Torso upright', detail: 'Torso upright. No arching the lower back.', anchor: { landmark: 'chest', pose: 'end' }, claim: CL.c6 },
    { key: 'lower', label: 'Same path back', detail: 'Lower along the same path, then switch arms.', anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c2 },
  ],
  feel,
  zooms,
  chips: ['hand', 'cross-arc', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Feet about shoulder-width, trunk braced, shoulders down and back. Dumbbells in front, palms facing you.',   // c1, c6
    // D-TEXT-GOLDEN: posture torso (c6)
    mistakeLine: 'Never swing the dumbbells. Keep the torso upright, with no arching of the lower back.',   // c4, c6
    cueLine: 'Elbow in place, arc across.',   // c2
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['wrist'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/cross_body_hammer_curl.json', rev: 1 },
};
