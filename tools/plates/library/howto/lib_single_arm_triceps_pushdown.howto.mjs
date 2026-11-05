// LIB-SHIP W5: the How-to content of lib_single_arm_triceps_pushdown (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/single_arm_triceps_pushdown.json (cited in its field's claim, cN = card claim id).
// Parent: triceps_pushdown (card parent; staged sheet lib_triceps_pushdown.howto.mjs). Inherited fields per INHERIT_MAP
// (tools/plates/library/lint/family.mjs, SHIP W5 PLAN RULED #392 6647901307): handling.thumb.mode (D-SHIP-W5-THUMB),
// handling.wrist.ext only (D-SHIP-W5-SAWRIST: this row writes its own one-arm limitText from c9) and riskFlags are `===`
// the parent's; plate.view is plate-only (`[]`, D-SHIP-W5-PLATEONLY). No handling.pose (no-zoom child, Extra 1).
// No hand zoom (D-SHIP-C3 no-zoom list, gap-key on tools/plates/library/hands/no-zoom.json): the d-handle key lists this
// id in GAPS (tools/plates/library/hands/hand-d-handle.mjs:21; golden-B follow-up 9, D-LIB7-19a: the engine cannot seat
// a heel push low and over the forearm). The card's hand zoom `single-pushdown-wrist` right line ("Full grip, thumb
// wrapped, hand in line with the forearm", c9, c2) lives in handling (gripLine, wrist.limitText) and setup step 2. Its
// wrong is null (LR-25), so there is no hand fault.
// GRIP (c) (D-SHIP-GRIP, Q-W5-7): the card leaves grip.handContact empty, and its grip.type states no palm direction, so
// handling.orientation is left out. The contact and the wrist range are read at import from the push key's convention,
// tools/plates/library/hands/pairs.mjs CONVENTIONS['ga:push-heel'], cited as CONVENTION (source ga-push-heel), data
// only, never printed (D-SHIP-CONVCOPY).
// Red flags: the card's redFlags (elbow, back). The elbow box is golden B's shared block; the back box is LIB-5's
// (tools/plates/library/shared/back-box.mjs), linked by the lower-back row's redFlag: 'back' (R-LB5-4; the box's
// appliesTo edit is pending, Q-W5-9: this row is staged until it lands).
// No variant line (exercises.json equipment 'Cable').
import plateSpec from '../specs/single_arm_triceps_pushdown.mjs';
import { RED_FLAG, RED_FLAG_ELBOW } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_ELBOW };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'ace-pushdown': { cite: 'Triceps Pushdowns (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/185/triceps-pushdowns/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'centr-single': { cite: 'Tutorial: Cable single-arm pushdown (Centr)', url: 'https://shop.hyroxequipment.centr.com/blogs/features/cp-tutorial-cable-single-arm-pushdown',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'acsm-2009': { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-pushdown': { cite: 'How to Do Tricep Pushdown With Bar: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/tricep-pushdown-with-bar/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  // The push key's own source for the hand contact (the card has no grip.handContact): a drawing convention.
  'ga-push-heel': { cite: 'LIB-7 push hand convention, pairs.mjs CONVENTIONS ga:push-heel: heel of the palm, extension 0 to 15', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG_ELBOW's own source (layers/howto/shared.mjs), as golden B's machine_chest_press lists it: the card's redFlags 'elbow'.
  'nhs-elbow-pain': { cite: 'NHS, Elbow and arm pain', url: 'https://www.nhs.uk/symptoms/elbow-and-arm-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When elbow pain needs a check.' },
  // The back box's own source (shared/back-box.mjs, docs/research/howto/shared/back-pain-box.json sources): the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c3 (one arm at a time: the exercise itself), c10 (tempo, a plate drawing convention), c11 (breathing),
// c14 (load progression). c18 and c19 (the card's NHS data-only lines, R-LB5-2) are carried by the shared elbow and back
// boxes, whose own sources are listed above, as on the parent sheet.

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-pushdown', CE = 'centr-single', SL = 'sl-pushdown';
const CL = {
  c2: C(['CONSENSUS'], [ACE], 'card c2'),
  c4: C(['CONSENSUS'], [CE], 'card c4'),
  c5: C(['CONSENSUS'], [ACE], 'card c5'),
  c7: C(['CONSENSUS'], [ACE], 'card c7'),
  c8: C(['CONSENSUS'], [ACE], 'card c8'),
  c9: C(['CONSENSUS'], [ACE], 'card c9'),
  c12: C(['CONSENSUS'], [SL], 'card c12'),
  c13: C(['CONSENSUS', 'WEAK'], [SL], 'card c13'),
  c15: C(['CONSENSUS'], [CE], 'card c15'),
  c16: C(['CONSENSUS'], [ACE], 'card c16'),
  c17: C(['MECH'], [SL], 'card c17'),
  set: C(['CONSENSUS'], [ACE], 'card c1, c2'),
  stand: C(['CONSENSUS'], [ACE, CE], 'card c1, c4'),
  brace: C(['CONSENSUS'], [ACE], 'card c16, c7'),
  lats: C(['CONSENSUS'], [ACE], 'card c6, c5'),
  elbow: C(['CONSENSUS'], [ACE], 'card c6, c5, c7'),
  elbowRow: C(['CONSENSUS'], [SL], 'card c12 (c18: the elbow box)'),
  backRow: C(['MECH'], [SL], 'card c17 (c19: the back box)'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (c): the contact and wrist range DERIVED at import from the push key's convention text, as lib_triceps_pushdown
// does (Q-W2-2 form), so they cannot drift from it. HandContact names the palm zone 'heel of the palm' as 'heel'
// (src/howto/content-types.ts HandContact); a convention that names no mapped zone throws. pairs.mjs is not imported
// (its closure pulls howto-layers.mjs, which the MANIFEST closure cannot follow); the text is copied here.
const PUSH_HEEL = 'GA 3.1 push: heel of the palm, low, over the forearm; extension 0 to 15';   // CONVENTIONS['ga:push-heel']
const CONTACT_OF_ZONE = { 'heel of the palm': 'heel' };   // convention zone words -> HandContact
const CONTACT = Object.entries(CONTACT_OF_ZONE).find(([zone]) => PUSH_HEEL.includes(zone))?.[1];
const EXT = PUSH_HEEL.match(/extension (\d+) to (\d+)/)?.slice(1).map(Number);
if (!CONTACT || !EXT) throw new Error(`lib_single_arm_triceps_pushdown: pairs.mjs CONVENTIONS ga:push-heel has no mapped contact or range: ${PUSH_HEEL}`);

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From this row's own plate spec poses. 'elbow-forward' (card zoom single-pushdown-elbow Wrong, c6: "Elbow drifted
// forward, upper arm swung up"): the start pose with the arms of the spec's own Mistake pose (working upper arm swung
// forward with the elbow bent, the free arm hanging), the trunk left as at the start, so only the arms move.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2, golden B's machine_chest_press seatDrop and
// lib_triceps_pushdown's elbows-forward): the spec's Mistake shoulder flex (25) and elbow (75) size the elbow-forward
// Wrong; no card gives them, no number appears in user copy; the layers panel judges them.
const { start: START, end: END } = plateSpec.poses, MIS = plateSpec.mistake.pose;
const ELBOW_FORWARD = { reach: null, shoulder: MIS.shoulder, elbow: MIS.elbow, wrist: 0 };
export const stills = {
  start: { pose: START },
  end: { pose: END },
  'elbow-forward': { pose: { ...START, ...ELBOW_FORWARD } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `single-pushdown-wrist` (gap-key, above). The posture zoom is in the zoom
// shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs), on this row's
// own plate.
const zooms = [
  {
    key: 'single-pushdown-elbow', chip: 'Elbow', heading: 'Elbow position', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): the Wrong is the elbow-forward still drawn alone (solid), as
    // `stills['elbow-forward']`; crop centre on the right pose's working elbow for both halves.
    crop: { center: { at: 'elbow.r', pose: 'right', off: [10, 0] }, sizePx: 140 },
    right: 'start',
    wrong: { base: 'start', pose: ELBOW_FORWARD, solid: true },
    callout: {
      right: { text: 'Elbow at side', anchor: 'elbow.r' },
      wrong: { text: 'Drifted forward', anchor: { at: 'elbow.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Working elbow against the side at the top.',   // card zooms[1] right (c6)
      wrong: 'Elbow drifted forward, upper arm swung up.',   // card zooms[1] wrong (c6)
    },
    alt: {
      right: 'Side view, top of the pushdown. The working upper arm hangs against the side, hand at upper-chest level.',   // c5, c7
      wrong: 'Side view, top of the pushdown. The working upper arm swings forward and up, so the elbow leaves the side.',  // c6
    },
    feelRow: 'lats',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'triceps', plain: 'The triceps do the work.' }],
  secondary: [],   // the card names none (its libraryDiff: the library's forearms are kept but unsourced, so not shown)
  watch: [],
  feelLine: 'You should feel this in the back of your upper arm.',
  rows: [
    // The card's first row (back of the upper arm) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'lats', where: 'Side of the back', at: { muscles: ['lats'] },
      means: 'Your elbow drifts forward, which brings in the lats.',
      fix: 'Pin the elbow to your side.',
      zoom: 'single-pushdown-elbow', claim: CL.lats },
    { key: 'elbows', where: 'Elbow discomfort or pain', at: { parts: ['elbow-left', 'elbow-right'] },
      means: 'Heavy, low-rep sets feel uncomfortable in the elbows for many.',   // c12 (the row's own claim)
      fix: "Stop and don't train through the pain. Use lighter weights for more reps.",
      redFlag: 'elbow', claim: CL.elbowRow },
    { key: 'lower-back', where: 'Lower back pain', at: { muscles: ['lower_back'] },
      means: 'You lean too far forward or arch your back.',   // c17 (the row's own claim)
      fix: "Stop and don't train through the pain. Stand taller, tilt only from the hips.",
      redFlag: 'back', claim: CL.backRow },
  ],
  claim: CL.c15,
};

/* ------------------------------------------------------------------------------------------------ mistakes, risks */
const MISTAKES = [
  { key: 'lean', title: 'Leaning over or arching back', claim: CL.c17,
    fix: "Tilt from your hips. Don't arch your back." },
  { key: 'elbow-forward', title: 'Elbow drifting forward', zoom: 'single-pushdown-elbow', claim: CL.elbow,
    fix: 'Keep the elbow at your side. Stop the return at upper-chest level.' },
  { key: 'turning', title: 'Turning the torso', claim: CL.c4,
    fix: 'Keep shoulders and hips square.' },
];
const RISKS = [
  { key: 'elbows', text: 'Heavy loads feel uncomfortable in the elbows for many people.', claim: CL.c12 },
  { key: 'weight', text: 'Too much weight moved with momentum can lead to injury.', claim: CL.c13 },
  { key: 'lean', text: 'Leaning or arching can strain the lower back.', claim: CL.c17 },
];

export default {
  schema: 1,
  id: 'lib_single_arm_triceps_pushdown',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    why: 'D-SHIP-C3 no-zoom list: the d-handle key lists single_arm_triceps_pushdown in GAPS (hand-d-handle.mjs:21; golden-B follow-up 9, D-LIB7-19a); the grip copy carries c2 and c9.',
    handle: 'd-handle',        // c2: a single handle (the spec's D-handle)
    overBody: false,
    thumb: { mode: 'wrapped', claim: CL.c2 },   // c2; `===` the parent's mode (INHERIT_MAP grip.thumb)
    contact: CONTACT,          // 'heel', DERIVED from pairs.mjs CONVENTIONS ga:push-heel (CONVENTION, above); never printed
    // ext `===` the parent's (INHERIT_MAP grip.wrist -> handling.wrist.ext): c9 gives no degrees ("neutral, in line with
    // the forearm"); EXT is the push key's convention range, read above, data only. limitText is this card's own c9
    // (one arm, D-SHIP-W5-SAWRIST).
    wrist: { ext: EXT, limitText: 'Keep the wrist in line with the forearm.',
      claim: C(['CONSENSUS', 'CONVENTION'], [ACE, 'ga-push-heel'], 'card c9. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number.') },
    // The card's hand zoom wrong is null (LR-25), so this row has no hand fault.
    faults: [],
    // card zooms[0] right (c9, c2): full grip, thumb wrapped, hand in line with the forearm; c2: grip it firmly.
    gripLine: 'Single handle, firm full grip, thumb wrapped. Hand in line with the forearm.',
    cue: 'Wrist in line with the forearm.',   // hint F (grip.wrist, c9)
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'adjust', text: 'Set the pulley above head height and attach a single handle.', claim: CL.set },
    { kind: 'grip', text: 'Grip the handle firmly, thumb wrapped.', claim: CL.c2 },
    { kind: 'position', text: 'Stand facing the machine with your shoulders and hips square.', claim: CL.stand },
    // D-TEXT-GOLDEN: posture torso (c16, braced and upright) placed here with the card's setup step 4
    { kind: 'brace', text: 'Brace, torso upright. Working elbow at your side, hand at upper chest.',
      zoom: 'single-pushdown-elbow', claim: CL.brace },
    // D-TEXT-GOLDEN: posture lockout (c8) placed here. The card's setup step 5 (c13, pick a weight you can move with
    // control) stays visible as risk 2 (c13).
    { kind: 'position', text: 'Straighten the arm fully without locking the elbow.', claim: CL.c8 },
  ],
  posture: [
    { key: 'elbow', label: 'Elbow pinned', detail: 'Working elbow stays next to your side.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, zoom: 'single-pushdown-elbow', claim: CL.c5 },
    { key: 'square', label: 'Square torso', detail: 'Shoulders and hips stay square, no twisting.',
      anchor: { landmark: 'backUpper', pose: 'start' }, claim: CL.c4 },
    { key: 'torso', label: 'Torso upright', detail: 'Torso braced and upright.',
      anchor: { landmark: 'backMid', pose: 'start' }, claim: CL.c16 },
    { key: 'wrist', label: 'Neutral wrist', detail: 'Wrist neutral throughout.',
      anchor: { landmark: 'wrist.r', pose: 'end' }, claim: CL.c9 },
    { key: 'lockout', label: 'No lockout', detail: 'Straighten the arm fully without locking the elbow.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c8 },
    { key: 'return', label: 'Return height', detail: 'Return only until the elbow starts to move forward.',
      anchor: { landmark: 'grip.r', pose: 'start' }, zoom: 'single-pushdown-elbow', claim: CL.c7 },
  ],
  feel,
  zooms,
  chips: ['single-pushdown-elbow', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Single handle on a high pulley. Working elbow at your side, shoulders and hips square.',
    mistakeLine: 'Keep your elbow at your side. Tilt only from the hips, never by arching your back.',
    cueLine: 'Elbow pinned to your side.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['elbow', 'back'],   // the card's redFlags, in its order; `===` the parent's (INHERIT_MAP redFlags)
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/single_arm_triceps_pushdown.json', rev: 1 },
};
