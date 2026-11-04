// LIB-SHIP W2: the How-to content of lib_push_up (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/push_up.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-C3, card-no-zoom): the card has no hand zoom (its notes: the palm-flat shared card owns the hand
// rules), so the sheet has none; the id is on tools/plates/library/hands/no-zoom.json. The card's hand claims (palms
// flat about shoulder-width, push through the heel and outer edge of the palm, wrist under the shoulder; c1, c14, c6)
// live in handling, setup and posture.
// Hand values (D-SHIP-GRIP case (a)): the card leaves grip.thumb empty. The values below come from the approved
// `palm-flat` pair key (tools/plates/library/hands/hand-palm-flat.mjs IDS.push_up: variant 'floor', orientation 'over',
// faults cupped-palm and hand-ahead), copied with each value's key line: the key module cannot be imported here, since
// its view code (hands/view-common.mjs:10, :160) reads files at run time and the library closure (library-manifest
// test, C0) refuses a How-to whose import closure reads files. The key records no ThumbMode: its
// drawing lays the thumb on the floor beside the index (hands/view-palm-flat.mjs:52), which is golden B's 'beside'
// (layers/engine/hand.mjs:142: the thumb laid along the index), cited CONVENTION (source hand-key-palm-flat), never DATA.
// Feel (D-SHIP-Q7): the card's watch muscle `core` is text only (feel.textOnly), as lib_plank.
// No variant line (equipment 'Bodyweight').
import plateSpec, { solve } from '../specs/push_up.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-pushup': { cite: 'Push-Ups, Exercise Library (ACE)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/41/push-up/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS' },
  'sl-pushup': { cite: 'How to Do Push-Up: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/push-up/',
    kind: 'coach', access: 'full', checked: '2026-10-02', use: 'CONSENSUS' },
  'bb-pushup': { cite: 'How to Perform the Push-Up: Tips, Tricks, & Variations (BarBend)', url: 'https://barbend.com/push-up/',
    kind: 'coach', access: 'full', checked: '2026-10-02', use: 'CONSENSUS' },
  'kikuchi-2017': { cite: 'Low-load bench press and push-up induce similar muscle hypertrophy and strength gain.', url: 'https://pubmed.ncbi.nlm.nih.gov/29541130/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-02', use: 'DATA' },
  // The palm-flat key's own source for the thumb (the card has no grip.thumb): a drawing convention.
  'hand-key-palm-flat': { cite: 'LIB-12 hand pair key palm-flat (floor): the thumb lies on the floor beside the index', url: 'tools/plates/library/hands/hand-palm-flat.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs), as golden B's lateral raise lists it: the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-pushup', SL = 'sl-pushup', BB = 'bb-pushup';
const CL = {
  c1: C(['CONSENSUS'], [ACE, SL], 'c1'),
  c2: C(['CONSENSUS'], [ACE, SL], 'c2'),
  c3: C(['CONSENSUS'], [ACE, BB], 'c3'),
  c5: C(['CONSENSUS'], [BB], 'c5'),
  c6: C(['CONSENSUS'], [BB], 'c6'),
  c7: C(['CONSENSUS'], [ACE], 'c7'),
  c8: C(['CONSENSUS'], [SL], 'c8'),
  c9: C(['CONSENSUS'], [SL, BB], 'c9'),
  c13: C(['CONSENSUS', 'WEAK'], [BB, ACE], 'c13'),
  c14: C(['CONSENSUS'], [BB, ACE], 'c14'),
  c15: C(['CONSENSUS'], [BB], 'c15'),
  line: C(['CONSENSUS'], [ACE, SL, BB], 'c2, c5'),
  stack: C(['CONSENSUS'], [ACE, SL, BB], 'c1, c6'),
  grip: C(['CONSENSUS'], [ACE, SL, BB], 'c1, c14'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant, copied (hand-palm-flat.mjs IDS.push_up, VARIANTS.floor; not importable,
// see the header). Not drawn on this sheet (no hand zoom), so each fault keeps the key's label, markers and alt with no
// HandPose (the key's own pose values are its palm-flat view's, not a HandPose: BOP's undrawn fault shape).
const V = { archetype: 'palm-flat', loadAxis: 'along-forearm' };   // VARIANTS.floor.archetype, .loadAxis
const FAULTS = [   // IDS.push_up.faults, in order
  // VARIANTS.floor.faults['cupped-palm']; its alt's semicolon split into two sentences for copy-lint check C7 (a lint
  // rule, not a card claim), as the curl splits its key's alt
  { key: 'cupped-palm', label: 'Palm cupped', pose: {}, markers: [], alt: 'Palm arched off the floor, only the heel and fingertips down. The heel takes the load.' },
  // VARIANTS.floor.faults['hand-ahead']; card claim c6 (hands planted too far in front), as the stack zoom's Wrong
  { key: 'hand-ahead', label: 'Hand ahead', pose: {}, markers: [], alt: 'Hand flat but ahead of the shoulder, forearm leaning back.' },
];
const KEY_AHEAD_TILT = 25;   // VARIANTS.floor.faults['hand-ahead'].pose.forearmTilt
const THUMB = 'beside';   // CONVENTION (D-SHIP-GRIP (a)): the key's drawn thumb (view-palm-flat.mjs:52), source hand-key-palm-flat

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses (spec end = card plate.start, the top; the pose map is the spec's):
//   sag   (card zoom hip-line Wrong, c5): the spec's Mistake pose, the plate's drawn fault (hips sag, low back arches).
//   ahead (card zoom stack Wrong, c6 "hands planted far in front of the shoulders"): the top with the straight arm
//         leaning AHEAD deg back from the plumb line, so the hand is ahead of the shoulder: the hand stays on its floor
//         spot and flat, the body straight, the toe tips on the floor; root, pelvis tilt and the wrist angle solved
//         with the spec's own solver.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): AHEAD 25 deg is
// the palm-flat key's own hand-ahead fault size (hand-palm-flat.mjs VARIANTS.floor.faults['hand-ahead'].pose.forearmTilt,
// KEY_AHEAD_TILT above); no card gives it, no number from it appears in user copy; the layers panel judges it.
const H = 1.75, END = plateSpec.poses.end, LT = landmarksOf(END, H), AHEAD = KEY_AHEAD_TILT;
const aheadPose = q => ({ ...END, root: { at: [0, q.y, q.z], tilt: q.tilt }, reach: null, shoulder: { flex: q.tilt + AHEAD }, elbow: 0, wrist: q.w });
const AQ = solve({ y: END.root.at[1], z: END.root.at[2] - 0.1, tilt: END.root.tilt, w: 90 - AHEAD }, aheadPose,
  lm => [lm['wrist.r'][1] - LT['wrist.r'][1], lm['wrist.r'][2] - LT['wrist.r'][2], lm['toe.r'][1], lm['grip.r'][1] - LT['grip.r'][1]]);
const SAG = plateSpec.mistake.pose, AHEAD_POSE = aheadPose(AQ);
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  sag: { pose: { ...END, ...SAG } },
  ahead: { pose: AHEAD_POSE },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same keys and kinds. Zoom shell shape (callout with an anchor at the landmark it names, no guide
// mark; pilot-a.closeups.mjs); each Wrong is its still drawn alone (solid).
const zooms = [
  {
    key: 'hip-line', chip: 'Hip line', heading: 'Hip line', kind: 'posture',
    crop: { center: { at: 'hip.r', pose: 'right', off: [0, 0] }, sizePx: 160 },
    right: 'end',
    wrong: { base: 'end', pose: SAG, solid: true },
    callout: {
      right: { text: 'Straight line', anchor: 'hip.r' },
      wrong: { text: 'Hips sag', anchor: 'hip.r' },
    },
    caption: {
      right: 'Head, hips and heels in one straight line.',
      wrong: 'Hips sagging, low back arched.',
    },
    alt: {
      right: 'Side view, top of the push-up. Head, hips and heels on one straight line, arms straight.',
      wrong: 'Side view, top of the push-up. The hips sag toward the floor and the low back arches.',
    },
  },
  {
    key: 'stack', chip: 'Hands', heading: 'Hand position', kind: 'posture',
    crop: { center: { at: 'elbow.r', pose: 'right', off: [0, 0] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'end', pose: AHEAD_POSE, solid: true },
    callout: {
      right: { text: 'Stacked', anchor: 'shoulder.r' },
      wrong: { text: 'Hands ahead', anchor: 'wrist.r' },   // c6
    },
    caption: {
      right: 'Shoulders over elbows over wrists.',
      wrong: 'Hands planted far in front of the shoulders.',   // c6
    },
    alt: {
      right: 'Side view, top of the push-up. Shoulder, elbow and wrist stand in one vertical line, palm flat.',
      wrong: 'Side view, top of the push-up. The hands are planted far in front of the shoulders, arms leaning.',   // c6
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'chest', plain: 'The chest does the pressing.' }],
  secondary: [
    { muscleId: 'triceps', plain: 'The back of the upper arm helps press.' },
    { muscleId: 'front_delts', plain: 'The front of the shoulders helps press.' },
  ],
  textOnly: [   // named in the text, never painted (C2: the map draws core on the serratus); D-SHIP-Q7, as lib_plank
    { muscleId: 'core', plain: 'The belly holds the body straight, much like a plank.', claim: CL.c9 },
  ],
  watch: [],
  feelLine: 'You should feel this in your chest, front shoulders and the back of your arms.',
  rows: [
    // The card's first two rows (the pressing muscles; the belly holding the body straight) have no fix, so they are
    // left out: the feel line and feel.textOnly say them (D-SHIP-Q16).
    { key: 'shoulder', where: 'Front-shoulder pain', at: { muscles: ['front_delts'] },
      means: 'Flared elbows can load the shoulder more.',
      fix: "Stop and don't train through the pain. Turn your hands forward, elbows close.",
      redFlag: 'shoulder', claim: CL.c7 },
  ],
  claim: C(['CONSENSUS', 'DATA'], [SL, BB, 'kikuchi-2017'], 'c9, c11'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'sag', title: 'Hips sagging, low back arching', zoom: 'hip-line', claim: CL.c5,
    fix: 'Brace your abs, squeeze your glutes, tuck your pelvis slightly.' },
  { key: 'hands', title: 'Hands not under the shoulders', zoom: 'stack', claim: CL.c6,
    fix: 'Stack your shoulders over your hands.' },
  { key: 'drop', title: 'Dropping fast to the floor', claim: CL.c13,
    fix: 'Lower under control and touch the floor lightly.' },
];
const RISKS = [
  { key: 'elbows', text: 'Elbows kept close may ease stress on the shoulder.', claim: CL.c7 },
  { key: 'floor', text: 'A cluttered or slippery floor makes the set unsafe.', claim: CL.c15 },
];

export default {
  schema: 1,
  id: 'lib_push_up',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'palm-flat'
    why: 'D-SHIP-C3: the card has no hand zoom (card-no-zoom); the grip copy carries c1, c6 and c14.',
    orientation: 'pronated',         // the key's orientation 'over': palms down on the floor (c1)
    handle: 'floor',
    loadAxis: V.loadAxis,            // 'along-forearm'
    overBody: false,
    width: { text: 'Hands about shoulder-width apart, or slightly wider.', claim: CL.c1 },
    thumb: { mode: THUMB, claim: C(['CONVENTION'], ['hand-key-palm-flat'], 'The card has no grip.thumb: the palm-flat key\'s drawn thumb, beside the index on the floor (view-palm-flat.mjs:52).') },
    contact: 'palm-flat',            // c14: the whole palm on the floor (the key's contact 'whole-hand')
    // The key records no wrist range (V.wristRange null): the floor sets the wrist, under the shoulder at the top (c6).
    wrist: { exempt: 'Palm flat on the floor: the wrist sits under the shoulder at the top, no range given.', claim: CL.c6 },
    faults: FAULTS,
    gripLine: 'Palms flat, about shoulder-width. Push through the heel and outer edge of the palm.',
    cue: 'Squeeze the floor with your hands.',   // c14
  },
  contacts: ['floor-body'],
  setup: [
    { kind: 'position', text: 'Kneel, palms flat on the floor about shoulder-width apart.', claim: CL.c1 },
    { kind: 'position', text: 'Shift forward until your shoulders are over your hands.', zoom: 'stack', claim: CL.stack },
    { kind: 'position', text: 'Straighten your legs, feet together. Torso and legs move together.', zoom: 'hip-line',   // D-TEXT-GOLDEN: posture together (c3)
      claim: C(['CONSENSUS'], [ACE, SL, BB], 'c2, c3') },
    { kind: 'brace', text: 'Brace your trunk and tense your glutes and thighs.', claim: CL.c2 },
    { kind: 'grip', text: 'Squeeze the floor. Breathe in going down, out going up.', claim: C(['CONSENSUS'], [BB, ACE, SL], 'c14, c8') },   // D-TEXT-GOLDEN: posture breathe (c8)
  ],
  posture: [
    { key: 'line', label: 'Straight line', detail: "Low back doesn't sag, hips don't hike.",
      anchor: { landmark: 'hip.r', pose: 'end' }, zoom: 'hip-line', claim: CL.c3 },
    { key: 'stack', label: 'Shoulders over hands', detail: 'Shoulders over elbows over wrists at the top.',
      anchor: { landmark: 'shoulder.r', pose: 'end' }, zoom: 'stack', claim: CL.c6 },
    { key: 'head', label: 'Head in line', detail: 'Head in line with your spine.', anchor: { landmark: 'head', pose: 'end' }, claim: CL.c2 },
    { key: 'together', label: 'One piece', detail: 'Torso and legs move together.', anchor: { landmark: 'backMid', pose: 'start' }, claim: CL.c3 },
    { key: 'breathe', label: 'Breathe', detail: 'Breathe in going down, out going up.', anchor: { landmark: 'chest', pose: 'start' }, claim: CL.c8 },
    { key: 'grip', label: 'Palms flat', detail: "Palms flat. 'Squeeze' the floor, pushing through the heel and outer edge of the palm.",
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.grip },
  ],
  feel,
  zooms,
  chips: ['hip-line', 'stack', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Palms flat, about shoulder-width, shoulders over your hands. Body in one line, feet together.',
    mistakeLine: 'Never let your hips sag or your low back arch. Brace your abs and squeeze your glutes.',
    cueLine: 'Body in one straight line.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/push_up.json', rev: 1 },
};
