// LIB-SHIP W7: the How-to content of lib_medicine_ball_slam (golden B's HowToContent shape, as lib_plank). Every shown
// string restates a claim of the verified card docs/research/howto/cards/medicine_ball_slam.json (cited in its field's
// claim, cN = card claim id).
// Handling: D-SHIP-GRIP (b3) (D-SHIP-W7-B3; tests/howto/checks/c3-library.ts B3_PINS): NoHandling. The card's grip.thumb,
// grip.handContact and grip.wrist are "Not given" statements (pinned as kind 'none'), never printed; the width ("Not
// given beyond both hands on the ball") is not printed either. The card's grip.claims c15 and c1 are cited on setup 4,
// which also carries the hand zoom `ball-grip` Right (c15; its Wrong is null, LR-25).
// Back box: the card's redFlags hold 'back' (riskFlags ['back'], source nhs-back, as lib_plank).
// Way out: none. The card's tierA.wayOut is null (card gaps[0], LIB-WAYOUT); the rebound and ball choice are risks.
// No variant line (equipment 'Medicine Ball').
//
// D-TEXT-GOLDEN (claim -> slot):
//   posture c2 on the toes, ball overhead      -> posture 'top'
//   posture c3 slam between the feet           -> posture 'slam'
//   posture c3 hips back, knees bend           -> posture 'hips', zoom slam-hips (Right)
//   posture c5 back flat                       -> posture 'back', zoom pickup-back (Right)
//   posture c6 squat to pick up the ball       -> posture 'pickup', zoom pickup-back (Right)
//   posture c7 exhale as you slam              -> posture 'breathe'
//   handlingMistake slamming too softly (c16, c3) -> posture 'hm-soft' (Q-W2-12: label = mistake, detail = fix)
//   handlingMistake arms only (c4, c3)         -> posture 'hm-arms' (Q-W2-12), zoom slam-hips (the plate's Mistake), mistakeLine
//   handlingMistake rounding the back (c5)     -> posture 'hm-round' (Q-W2-12), zoom pickup-back (DV)
//   hand zoom `ball-grip` Right (c15)          -> setup 4; Wrong null (LR-25), nothing to show
//   T checkpoints                              -> none (both posture zooms drawn)
// D-TEXT-PRINTED (W7, #394): c3 slam between the feet, c7 exhale, handlingMistake too softly (c16, c3) -> setup 5. W7 panel (#394 SAFETY): the space check (c9) moved to setup 2, before the slam.
// D-TEXT-PROGRESSION: c11 (ball weight, start at 10 pounds and work up) is a progression, not on the sheet.
import plateSpec from '../specs/medicine_ball_slam.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'bb-slam': { cite: 'Lay the Smackdown on Your Core Workouts with Medicine Ball Slams (BarBend)', url: 'https://barbend.com/medicine-ball-slams/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'bb-slam-ben': { cite: 'The Main Benefits of Medicine Ball Slams And How to Do Them (BarBend)', url: 'https://barbend.com/benefits-of-medicine-ball-slams/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-slam': { cite: 'How to Do Ball Slams: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/ball-slams/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ace-os': { cite: 'Overhead Slams (ACE exercise library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/182/overhead-slams/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ace-heavy': { cite: 'Heavy Slam Ball Workout (ACE blog, Shana Verstegen)', url: 'https://www.acefitness.org/resources/everyone/blog/3801/heavy-slam-ball-workout/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'vit-slam': { cite: 'How to Master the Medicine Ball Slam Throw Technique (Vitruve)', url: 'https://vitruve.fit/blog/how-to-master-the-medicine-ball-slam-throw-technique/',
    kind: 'secondary', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'bodbot-mb-slam': { cite: 'Medicine Ball Slam (BodBot)', url: 'https://www.bodbot.com/Exercises/966/Medicine-Ball-Slam',
    kind: 'secondary', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'im-slam': { cite: 'How To Do Overhead Medicine Ball Slam (Iron Man Magazine)', url: 'https://www.ironmanmagazine.com/how-to-do-overhead-medicine-ball-slam/',
    kind: 'secondary', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'pg-mb': { cite: 'How and Why You Should Use a Medicine Ball (PureGym)', url: 'https://www.puregym.com/blog/how-and-why-you-should-use-a-medicine-ball/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'hl-slam': { cite: 'Slam Ball Exercises and Benefits (Healthline; medically reviewed by a CSCS)', url: 'https://www.healthline.com/health/fitness-exercise/slam-ball-exercises',
    kind: 'secondary', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_plank lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'sl-slam', BB = 'bb-slam', BOD = 'bodbot-mb-slam', ACE = 'ace-os', VIT = 'vit-slam', PG = 'pg-mb';
const CL = {
  c1: C(['CONSENSUS'], [SL, BOD, ACE], 'card c1'),
  c2: C(['CONSENSUS'], [SL, BOD, VIT], 'card c2'),
  c7: C(['CONSENSUS'], [SL, VIT, 'im-slam'], 'card c7'),
  c9: C(['CONSENSUS'], [VIT, PG, ACE, BOD], 'card c9'),
  c10: C(['CONSENSUS'], [PG], 'card c10'),
  c13: C(['CONSENSUS'], [SL, BB], 'card c13'),
  c14: C(['WEAK'], [SL], 'card c14'),
  ball: C(['CONSENSUS'], [VIT, PG, ACE, BOD], 'card c9'),
  hold: C(['CONSENSUS'], ['hl-slam', BOD, SL, ACE], 'card c15, c1'),
  face: C(['CONSENSUS'], ['bb-slam-ben', 'im-slam', PG, VIT], 'card c8, c9'),
  slam: C(['CONSENSUS'], [SL, BB, ACE, VIT], 'card c3, c16'),
  hips: C(['CONSENSUS'], [SL, BB, ACE, VIT, BOD], 'card c3, c4'),
  back: C(['CONSENSUS'], [BB, 'ace-heavy', ACE], 'card c5'),
  pickup: C(['CONSENSUS'], [SL, BOD, 'ace-heavy'], 'card c6, c5'),
  row: C(['CONSENSUS'], [BB, 'ace-heavy', ACE, SL, BOD], 'card c5, c6'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses:
//   arms  (card zoom slam-hips Wrong, c4 "arms only, no hip or knee bend"): the spec's Mistake, the plate's drawn fault,
//         merged over the end as the engine draws it.
//   round (card zoom pickup-back Wrong, c5 "back rounded"): the end (hips down and back, hands on the ball on the floor)
//         with the lumbar spine flexed ROUND deg; the root, pelvis tilt, feet and the hands on the ball stay (the arms'
//         reach IK takes up the drop of the shoulders).
// DRAWING VALUES (D-SHIP-DRAWVAL): ROUND 25 deg is a Wrong-pose size no card gives; it is sled_push's spec M_ROLL (the
// rounded back drawn on the plate). No number from it appears in user copy; the layers panel judges it.
const ROUND = 25;
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const ROUND_POSE = { ...END, trunk: ROUND };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  arms: { pose: { ...END, ...MIS } },
  round: { pose: ROUND_POSE },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
const zooms = [
  {
    key: 'slam-hips', chip: 'Hips', heading: 'Hips and knees', kind: 'posture',
    // zoom shell: crop centre on the right pose's hip, hips to feet; the Wrong is the spec's Mistake drawn alone (solid).
    crop: { center: { at: 'hip.r', pose: 'right', off: [0, -10] }, sizePx: 240 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Hips back', anchor: 'hip.r' },
      wrong: { text: 'Arms only', anchor: { at: 'grip.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Hips back and knees bent as the ball goes down.',   // card zoom right (c3)
      wrong: 'Arms only, no hip or knee bend.',                    // card zoom wrong (c4)
    },
    alt: {
      right: 'Side view, end of the slam. Hips pressed back, knees bent, hands on the ball between the feet.',
      wrong: 'Side view. Legs and hips stay straight while the arms fling the ball down.',
    },
  },
  {
    key: 'pickup-back', chip: 'Back', heading: 'Flat back', kind: 'posture',
    // zoom shell: crop centre on the right pose's mid back; the Wrong is the round still drawn alone (solid).
    crop: { center: { at: 'backMid', pose: 'right', off: [18, 10] }, sizePx: 180 },
    right: 'end',
    wrong: { base: 'end', pose: ROUND_POSE, solid: true },
    callout: {
      right: { text: 'Back flat', anchor: 'backMid' },
      wrong: { text: 'Back rounded', anchor: { at: 'backMid', pose: 'mistake' } },
    },
    caption: {
      right: 'Back flat, hips down and back for the pickup.',   // card zoom right (c5, c6)
      wrong: 'Back rounded.',                                        // card zoom wrong (c5)
    },
    alt: {
      right: 'Side view, hands on the ball on the floor. The back is flat, hips down and back.',
      wrong: 'Side view, hands on the ball on the floor. The back rounds forward.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'abs', plain: 'The abs make the downward force of the slam.', claim: CL.c13 },
    { muscleId: 'lats', plain: 'The lats draw the arms down from overhead.', claim: CL.c13 },
  ],
  secondary: [
    { muscleId: 'obliques', plain: 'The sides of the belly help.', claim: CL.c13 },
    { muscleId: 'glutes', plain: 'The glutes help.', claim: CL.c14 },
    { muscleId: 'front_delts', plain: 'The front of the shoulders helps.', claim: CL.c14 },
  ],
  watch: [],
  feelLine: 'You should feel this in your abs and lats.',
  rows: [
    // The card's first two rows (abs, lats) have no fix, so they are left out: the feel line says them.
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Rounding the back as you slam or pick up the ball.',   // card row means ("Fault: ...")
      fix: 'Keep your back flat and hinge from the hips.',
      redFlag: 'back', claim: CL.row },
  ],
  claim: CL.c13,
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'face', text: 'A bouncy ball can fly back up into your face.', claim: CL.face },
  { key: 'toes', text: 'Take care not to throw the ball onto your toes.', claim: CL.c10 },
  { key: 'space', text: 'A bouncing ball needs ample space around you.', claim: CL.c9 },
];

export default {
  schema: 1,
  id: 'lib_medicine_ball_slam',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b3): the card gives no thumb, hand contact or wrist (pinned "Not given" statements); grip claims c15 and c1 and the hand zoom Right are on setup 4.' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'load', text: 'Use a soft ball without much bounce.', claim: CL.ball },
    { kind: 'safety', text: 'Check the space around you is safe.', claim: CL.c9 },   // W7 panel (#394 SAFETY): the space check comes before the slam
    { kind: 'position', text: 'Feet about shoulder-width apart, knees slightly bent.', claim: CL.c1 },
    { kind: 'grip', text: 'Hold the ball firmly in both hands at chest height.', claim: CL.hold },
    { kind: 'brace', text: 'Ball overhead, arms straight. Brace, exhale, slam it hard between your feet.', claim: C(['CONSENSUS'], [SL, BOD, ACE, BB, VIT, 'im-slam'], 'card c1, c2, c3, c7, c16') },
  ],
  posture: [
    { key: 'top', label: 'Ball overhead', detail: 'Rise onto your toes, arms straight, ball overhead.',
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c2 },
    { key: 'slam', label: 'Slam down', detail: 'Slam the ball straight down between your feet.', anchor: { landmark: 'ankle.r', pose: 'end' }, claim: C(['CONSENSUS'], [SL, BB, ACE], 'card c3') },
    { key: 'hips', label: 'Hips and knees', detail: 'Press your hips back and bend your knees as you slam.',
      anchor: { landmark: 'hip.r', pose: 'end' }, zoom: 'slam-hips', claim: C(['CONSENSUS'], [SL, BB, ACE], 'card c3') },
    { key: 'back', label: 'Back flat', detail: 'Keep your back flat.', anchor: { landmark: 'backMid', pose: 'end' }, zoom: 'pickup-back', claim: CL.back },
    { key: 'pickup', label: 'Squat down', detail: 'Squat down to pick up the ball.', anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'pickup-back', claim: CL.pickup },
    { key: 'breathe', label: 'Breathe out', detail: 'Exhale as you slam the ball down.', anchor: { landmark: 'chest', pose: 'start' }, claim: CL.c7 },
    // Q-W2-12 (NoHandling): the card's handlingMistakes as checkpoints, label = the mistake, detail = the card's fix
    { key: 'hm-soft', label: 'Slamming too softly', detail: 'Slam it down with as much force as possible.', anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.slam },
    { key: 'hm-arms', label: 'Arms only', detail: 'Press your hips back and bend your knees as you slam.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'slam-hips', claim: CL.hips },
    { key: 'hm-round', label: 'Rounding the back', detail: 'Keep your back flat and hinge from the hips.',
      anchor: { landmark: 'backUpper', pose: 'end' }, zoom: 'pickup-back', claim: CL.back },
  ],
  feel,
  zooms,
  chips: ['slam-hips', 'pickup-back', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Hold a soft ball firmly in both hands at chest height, feet shoulder-width.',
    mistakeLine: 'Never slam with the arms only: press your hips back and bend your knees.',
    cueLine: 'Hips back, back flat.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/medicine_ball_slam.json', rev: 1 },
};
