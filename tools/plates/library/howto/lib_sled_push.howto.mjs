// LIB-SHIP W7: the How-to content of lib_sled_push (golden B's HowToContent shape, as lib_plank). Every shown string
// restates a claim of the verified card docs/research/howto/cards/sled_push.json (cited in its field's claim, cN = card
// claim id).
// Handling: D-SHIP-GRIP (b): the card's archetype.hand is push, but its grip.thumb, grip.handContact and grip.wrist are
// all empty (no sled-push source gives them), so the sheet uses NoHandling; the type and width claim (c1) and the card
// hand zoom `hands` Right (c1, c4; its Wrong is null, LR-25) are on setup 2.
// Back box: the card's redFlags hold 'back', so the sheet shows the back box (riskFlags ['back'], source nhs-back, as
// lib_plank).
// Feel (D-SHIP-Q7): the card's feel names abs and obliques (c14), drawn as secondary; no `core` row.
// No variant line (equipment 'Sled').
//
// D-TEXT-GOLDEN (claim -> slot):
//   posture c3 shoulders behind hands         -> posture 'shoulders', setup 4
//   posture c6 spine neutral, abs tight       -> posture 'spine', setup 5, zoom back (Right)
//   posture c6 eyes ahead is below; c9 'same body angle' -> posture 'hm-angle'
//   posture c6 eyes just ahead of the sled    -> posture 'eyes'
//   posture c8 balls of the feet              -> posture 'feet', zoom feet (Right)
//   posture c10 short, powerful steps         -> posture 'steps'
//   posture c11 arms in the same position     -> posture 'arms'
//   handlingMistake rounded back (c7)         -> posture 'hm-round' (Q-W2-12; zoom back, the plate's Mistake), mistakeLine
//   handlingMistake heels touching (c8)       -> posture 'hm-heels' (Q-W2-12; zoom feet, DV)
//   handlingMistake hips rise / chest drops (c9) -> posture 'hm-angle' (Q-W2-12)
//   hand zoom `hands` Right (c1, c4)          -> setup 2; Wrong null (LR-25), nothing to show
//   T checkpoints                              -> none (both posture zooms drawn)
// D-TEXT-PRINTED (W7, #394): c11 arms same position -> setup 4; c6 eyes ahead -> setup 5; c10 short steps -> zoom feet
//   caption.right; handlingMistake c9 -> risks[angle].
// D-TEXT-PROGRESSION: c16 (start light, then add one thing at a time) is a progression, not on the sheet.
import plateSpec from '../specs/sled_push.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'sl-sledpush': { cite: 'How to Do Sled Push: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/sled-push/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'bb-sledpush': { cite: 'The Sled Push May Be the Ultimate Leg-Builder (BarBend)', url: 'https://barbend.com/sled-push/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'fv-sledpush': { cite: 'Sled Push: Ultimate Guide to Strengthen Your Legs and Core (Fitness Volt)', url: 'https://fitnessvolt.com/sled-push-guide/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ggr-sledpush': { cite: 'Sled Push Workout: Trainer Tips (Garage Gym Reviews)', url: 'https://www.garagegymreviews.com/sled-push-workout',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'maddigan-2014': { cite: 'Lower-limb and trunk muscle activation with back squats and weighted sled apparatus (2014)', url: 'https://pubmed.ncbi.nlm.nih.gov/25226330/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_plank lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'sl-sledpush', BB = 'bb-sledpush', FV = 'fv-sledpush', GG = 'ggr-sledpush';
const CL = {
  c1: C(['CONSENSUS'], [SL, BB, FV], 'card c1'),
  c3: C(['CONSENSUS'], [SL, BB], 'card c3'),
  c5: C(['CONSENSUS'], [BB], 'card c5'),
  c6: C(['CONSENSUS'], [SL, GG, FV], 'card c6'),
  c7: C(['CONSENSUS'], [GG], 'card c7'),
  c8: C(['CONSENSUS'], [GG, FV, BB], 'card c8'),
  c9: C(['CONSENSUS'], [SL], 'card c9'),
  c10: C(['CONSENSUS'], [SL, FV], 'card c10'),
  c11: C(['CONSENSUS'], [SL], 'card c11'),
  c13: C(['CONSENSUS', 'DATA'], [SL, BB, FV, 'maddigan-2014'], 'card c13, c15'),
  c14: C(['CONSENSUS'], [SL], 'card c14'),
  c17: C(['CONSENSUS'], [SL], 'card c17'),
  hands: C(['CONSENSUS'], [SL, BB, FV, GG], 'card c1, c4'),
  arms: C(['CONSENSUS'], [SL, BB, GG, FV], 'card c3, c4'),
  back: C(['CONSENSUS'], [GG, SL, BB], 'card c7, c3'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses:
//   round (card zoom back Wrong, c7): the spec's Mistake merged over the end, as the engine draws it.
//   heel  (card zoom feet Wrong, c8 "heel down on the floor"): the end with the near (right) foot's heel set down: the
//         same rigid foot kept on its ball spot, its sole turned flat to the floor (the spec's onBall with heel-up 0,
//         its LIFT formula copied from sled_push.mjs:42-44). Root, trunk and hands stay; the leg IK solves the knee.
// DRAWING VALUES (D-SHIP-DRAWVAL): none added; the heel-down foot is the floor itself (heel-up 0), not a size.
const H = 1.75, END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const SOLE = [[0.112, -0.036], [0.120, -0.028], [0.100, -0.038]];   // sled_push.mjs:43, the sole points the LIFT clears
const liftAt = deg => { const s = Math.sin(deg * Math.PI / 180), c = Math.cos(deg * Math.PI / 180);
  return -Math.min(...SOLE.map(([z, y]) => ((z - 0.080) * -s + (y + 0.039) * c) * H)); };
const R0 = END.plant.r;
const heelDown = { ...R0, at: [R0.at[0], liftAt(0), R0.at[2]], normal: [0, 1, 0], toe: [0, 0, 1] };
const HEEL_POSE = { ...END, plant: { ...END.plant, r: heelDown } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  round: { pose: { ...END, ...MIS } },
  heel: { pose: HEEL_POSE },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
const zooms = [
  {
    key: 'back', chip: 'Back', heading: 'Flat back', kind: 'posture',
    // zoom shell: crop centre on the right pose's mid back for both halves; the Wrong is the spec's Mistake drawn alone
    // (solid), its dashed hump guide is the plate's.
    crop: { center: { at: 'backMid', pose: 'right', off: [10, 28] }, sizePx: 220 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Back flat', anchor: 'backMid' },
      wrong: { text: 'Back rounded', anchor: { at: 'backMid', pose: 'mistake' } },
    },
    caption: {
      right: 'Back flat, head to hips in a straight line.',   // card zoom right (c3)
      wrong: 'Back rounded.',                                 // card zoom wrong (c7)
    },
    alt: {
      right: 'Side view, sled push. The body leans forward, back flat, head to hips in one straight line.',
      wrong: 'Side view, sled push. The back rounds, so the head drops off the straight line.',
    },
  },
  {
    key: 'feet', chip: 'Feet', heading: 'Balls of feet', kind: 'posture',
    // zoom shell: crop centre on the right pose's near heel; the Wrong is the heel still drawn alone (solid).
    crop: { center: { at: 'heel.r', pose: 'right', off: [12, -22] }, sizePx: 100 },
    right: 'end',
    wrong: { base: 'end', pose: HEEL_POSE, solid: true },
    callout: {
      right: { text: 'Heels up', anchor: 'heel.r' },
      wrong: { text: 'Heel down', anchor: { at: 'heel.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Short, powerful steps on the balls of your feet.',   // card zoom right (c8), c10 (D-TEXT-PRINTED)
      wrong: 'Heel down on the floor.',                // card zoom wrong (c8)
    },
    alt: {
      right: 'Side view, sled push. The front foot pushes on its ball, heel off the floor.',
      wrong: 'Side view, sled push. The front foot is flat, its heel down on the floor.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'quads', plain: 'The front of the thighs straightens the knee as you drive.', claim: CL.c13 },
    { muscleId: 'glutes', plain: 'The glutes straighten the hip and drive you forward.', claim: CL.c13 },
    { muscleId: 'calves', plain: 'The calves pass the force into the ground.', claim: CL.c13 },
  ],
  secondary: [
    { muscleId: 'abs', plain: 'The belly holds the ribcage and pelvis together.', claim: CL.c14 },
    { muscleId: 'obliques', plain: 'The sides of the belly hold the trunk still.', claim: CL.c14 },
  ],
  watch: [],
  feelLine: 'You should feel this in your thighs, glutes and calves.',
  rows: [
    // The card's first three rows (thighs, glutes, calves) have no fix, so they are left out: the feel line says them.
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'A rounded back.',                          // card row means ("Fault: a rounded back.")
      fix: 'Hinge at your hips and keep your back flat.',
      redFlag: 'back', claim: CL.back },
  ],
  claim: CL.c13,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
// Q-W2-12 (#379 6628699724, the NoHandling form): the card's handlingMistakes are posture checkpoints hm-round,
// hm-heels, hm-angle (label = the mistake, detail = the card's fix); mistakeLine repeats the rounded back.
const RISKS = [
  { key: 'round', text: 'A rounded back will not favor your spine.', claim: CL.c7 },
  { key: 'bent', text: 'Bent arms may cause some discomfort in your elbows and shoulders.', claim: CL.c5 },
  // D-TEXT-PRINTED (W7, #394): handlingMistake c9 (posture hm-angle is not printed)
  { key: 'angle', text: 'Hips rising or chest dropping as you tire? Keep the same body angle.', claim: CL.c9 },
];

export default {
  schema: 1,
  id: 'lib_sled_push',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b): the card gives no thumb, hand contact or wrist; its type and width claim (c1) and hand zoom Right (c1, c4) are on setup 2.' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'safety', text: 'Load the sled. Check the path is flat and clear.', claim: CL.c17 },
    { kind: 'grip', text: 'Stand behind the sled. Hands about halfway down the handles, arms straight.', claim: CL.hands },
    { kind: 'position', text: 'Step back and lean forward, head to hips in a straight line.', zoom: 'back', claim: CL.c3 },
    { kind: 'position', text: 'Keep arms straight the whole push, shoulders behind your hands.', claim: C(['CONSENSUS'], [SL, BB, GG, FV], 'card c3, c4, c11') },
    { kind: 'brace', text: 'Tighten your abs, spine neutral, eyes just ahead of the sled.', claim: CL.c6 },
  ],
  posture: [
    { key: 'shoulders', label: 'Shoulders behind hands', detail: 'Shoulders straight behind your hands.',
      anchor: { landmark: 'shoulder.r', pose: 'start' }, claim: CL.c3 },
    { key: 'spine', label: 'Spine neutral', detail: 'Spine neutral, abs tight.', anchor: { landmark: 'backMid', pose: 'start' }, zoom: 'back', claim: CL.c6 },
    { key: 'eyes', label: 'Eyes ahead', detail: 'Eyes just ahead of the sled.', anchor: { landmark: 'head', pose: 'start' }, claim: CL.c6 },
    { key: 'feet', label: 'Balls of feet', detail: 'Push through the balls of your feet.', anchor: { landmark: 'ball.r', pose: 'start' }, zoom: 'feet', claim: CL.c8 },
    { key: 'steps', label: 'Short steps', detail: 'Short, powerful steps, not a jog.', anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.c10 },
    { key: 'arms', label: 'Arms steady', detail: 'Keep your arms in the same position.', anchor: { landmark: 'elbow.r', pose: 'start' }, claim: CL.c11 },
    // Q-W2-12 (NoHandling): the card's handlingMistakes as checkpoints, label = the mistake, detail = the card's fix
    { key: 'hm-round', label: 'Rounded back', detail: 'Hinge at your hips, head up, shoulders down.',
      anchor: { landmark: 'backMid', pose: 'end' }, zoom: 'back', claim: CL.c7 },
    { key: 'hm-heels', label: 'Heels touching floor', detail: 'Drive your knees higher and stay on the balls of your feet.',
      anchor: { landmark: 'heel.r', pose: 'end' }, zoom: 'feet', claim: CL.c8 },
    { key: 'hm-angle', label: 'Body angle drifting', detail: "Hips rising or chest dropping as you tire? Keep the same body angle all push.",
      anchor: { landmark: 'hips', pose: 'end' }, claim: CL.c9 },
  ],
  feel,
  zooms,
  chips: ['back', 'feet', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Hands halfway down the handles, arms straight. Lean forward, head to hips in a line.',
    mistakeLine: 'Never push with a rounded back. Hinge at your hips, head up.',
    cueLine: 'Back flat, heels up.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12: the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/sled_push.json', rev: 1 },
};
