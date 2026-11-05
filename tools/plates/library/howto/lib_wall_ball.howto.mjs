// LIB-SHIP W7: the How-to content of lib_wall_ball (golden B's HowToContent shape, as lib_plank). Every shown string
// restates a claim of the verified card docs/research/howto/cards/wall_ball.json (cited in its field's claim, cN = card
// claim id).
// Handling: D-SHIP-GRIP (b3) (D-SHIP-W7-B3; tests/howto/checks/c3-library.ts B3_PINS): NoHandling. The card's grip.thumb
// and grip.wrist are "Not given" statements (pinned kind 'none'), never printed; its handContact (c9) and grip.claims
// (c1, c9) are cited on setup 3 and setup 5. The card hand zoom `catch-hands` Right (c9) is setup 5; its Wrong ("Hands
// sandwiching the ball, elbows out", c9) shows as a fault: posture 'hm-hands' and copy.mistakeLine.
// Zoom catch-timing is a text checkpoint (D-SHIP-TEXTZOOM: a timing fault): its Right is posture 'catch', its Wrong is
// posture 'hm-early' (the card handlingMistake that names it).
// Shoulder box: the card's redFlags ['shoulder']; the feel row `shoulder` links it.
// Way out: none. The card's tierA.wayOut is null (card gaps[0], LIB-WAYOUT); the face-strike lines are risks.
// No variant line (equipment 'Medicine Ball').
//
// D-TEXT-GOLDEN (claim -> slot):
//   posture c6 thighs parallel or lower        -> posture 'depth'
//   posture c6 weight in heels, chest up       -> posture 'heels'
//   posture c7 drive up, throw to the target   -> posture 'drive'
//   posture c9 ball close to the body          -> posture 'close'
//   posture c8 catch standing, then squat      -> posture 'catch' (T catch-timing Right)
//   posture c11 breathe in down, out up        -> posture 'breathe'
//   handlingMistake too far from the wall (c3, c2) -> posture 'hm-far' (Q-W2-12; zoom wall-distance, the plate's Mistake), setupLine
//   handlingMistake squatting before the catch (c8) -> posture 'hm-early' (Q-W2-12; T catch-timing Wrong)
//   handlingMistake squatting too shallow (c6) -> posture 'hm-shallow' (Q-W2-12)
//   hand zoom catch-hands Right (c9)           -> setup 5; Wrong (c9) -> posture 'hm-hands', copy.mistakeLine
// D-TEXT-PROGRESSION: c12 (ball weight, start light) and c16 (programming) are not form checkpoints, not on the sheet.
import plateSpec from '../specs/wall_ball.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'bb-wb': { cite: 'The Wall Ball is the Cardio Booster Your Workouts Are Missing (BarBend)', url: 'https://barbend.com/wall-balls-exercise-guide/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ggr-wb': { cite: 'Ball Out With Our Wall Ball Workout (Garage Gym Reviews)', url: 'https://www.garagegymreviews.com/wall-ball-workout',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'pg-wb': { cite: 'Hyrox Wall Ball Guide: Everything You Need To Know (PureGym)', url: 'https://www.puregym.com/blog/hyrox-wall-ball/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'boxlife-wallball': { cite: '5 Tips To Dominate Wall Balls (Box Life Magazine)', url: 'https://boxlifemagazine.com/5-tips-to-dominate-wall-balls/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'boxrox-wallball': { cite: 'Seven Important Technique Tips to Improve Your Wall Ball Efficiency in CrossFit (BOXROX)', url: 'https://www.boxrox.com/?p=106154',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'boxrox-wb5': { cite: '5 Tips to Destroy Wall Balls in Crossfit WODs (BOXROX)', url: 'https://www.boxrox.com/5-tips-to-destroy-wall-balls/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'fv-wb': { cite: 'Advice On Making Wall Balls Easier For CrossFit Athletes (Fitness Volt)', url: 'https://fitnessvolt.com/wall-balls-crossfit-athletes/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'hl-wb': { cite: 'Slam Ball Exercises and Benefits (Healthline; medically reviewed by a CSCS), wall balls section', url: 'https://www.healthline.com/health/fitness-exercise/slam-ball-exercises',
    kind: 'secondary', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs), as lib_cable_fly lists it: the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const BB = 'bb-wb', GG = 'ggr-wb', PG = 'pg-wb', BL = 'boxlife-wallball', BR = 'boxrox-wallball', B5 = 'boxrox-wb5', FV = 'fv-wb', HL = 'hl-wb';
const CL = {
  c1: C(['CONSENSUS'], [GG, PG, BB], 'card c1'),
  c2: C(['CONSENSUS'], [B5, BL, GG, BB, HL], 'card c2'),
  c4: C(['CONSENSUS', 'WEAK'], [BR], 'card c4'),
  c6: C(['CONSENSUS'], [BB, B5, PG], 'card c6'),
  c7: C(['CONSENSUS'], [GG, PG, HL], 'card c7'),
  c8: C(['CONSENSUS'], [BR, BL, PG, BB], 'card c8'),
  c9: C(['CONSENSUS'], [BR, BL], 'card c9'),
  c10: C(['CONSENSUS'], [FV, B5], 'card c10'),
  c11: C(['CONSENSUS'], [BL, PG], 'card c11'),
  c13: C(['CONSENSUS'], [BB, GG, PG, HL], 'card c13'),
  c14: C(['CONSENSUS'], [BB, PG], 'card c14'),
  c15: C(['CONSENSUS'], [PG, HL], 'card c15'),
  brace: C(['CONSENSUS'], [GG, PG, BB], 'card c1, c5'),
  far: C(['CONSENSUS'], [FV, BR, B5, BL, GG, BB, HL], 'card c3, c2'),
  row: C(['CONSENSUS', 'WEAK'], [BR, B5, BL, GG, BB, HL], 'card c4, c2'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (squat bottom at the right distance, ball close at the chest; c2, c6, c9)
// and the spec's Mistake merged over it, as the engine draws it (card plate.mistake c3, c4: the feet too far from the
// wall, the body tilting forward). The card zoom wall-distance Wrong is the plate's drawn fault. No drawing value added.
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  far: { pose: { ...END, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
const zooms = [
  {
    key: 'wall-distance', chip: 'Distance', heading: 'Wall distance', kind: 'posture',
    // zoom shell: crop centre on the right pose's knee, wide enough for the body and the wall; the Wrong is the spec's
    // Mistake drawn alone (solid).
    crop: { center: { at: 'knee.r', pose: 'right', off: [8, -20] }, sizePx: 270 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Arm\'s length', anchor: 'toe.r' },
      wrong: { text: 'Too far back', anchor: { at: 'heel.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Arms out, the ball touches the wall.',                 // card zoom right (c2)
      wrong: 'Too far back: the ball goes forward, body tilts.',     // card zoom wrong (c3)
    },
    alt: {
      right: 'Side view, bottom of the squat, about arm\'s length from the wall. Torso upright, ball at the chest.',
      wrong: 'Side view. The feet stand too far back from the wall, so the body tilts forward.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'quads', plain: 'The quads straighten the knees as you stand.', claim: CL.c13 },
    { muscleId: 'glutes', plain: 'The glutes straighten the hips as you stand.', claim: CL.c13 },
  ],
  secondary: [
    { muscleId: 'upper_chest', plain: 'The upper chest helps throw the ball overhead.', claim: CL.c14 },
    { muscleId: 'triceps', plain: 'The triceps straighten the elbows.', claim: CL.c14 },
    { muscleId: 'hamstrings', plain: 'The hamstrings help.', claim: CL.c15 },
  ],
  watch: [],
  feelLine: 'You should feel this in your thighs, glutes, shoulders and upper chest.',
  rows: [
    // The card's first two rows (thighs and glutes; shoulders and upper chest) have no fix, so they are left out: the
    // feel line says them.
    { key: 'shoulder', where: 'Shoulders', at: { muscles: ['front_delts'] },
      means: 'The right distance from the wall takes strain off them.',
      fix: 'Hold your arms out, ball touching the wall: stand there.',
      redFlag: 'shoulder', claim: CL.row },
  ],
  claim: CL.c13,
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'distance', text: 'The right distance from the wall takes strain off your shoulders.', claim: CL.c4 },
  { key: 'close', text: 'Too close to the wall, the ball will probably fall on your face.', claim: CL.c4 },
  { key: 'tired', text: 'Tired arms can let the ball smash into your face.', claim: CL.c10 },
];

export default {
  schema: 1,
  id: 'lib_wall_ball',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b3): the card gives no thumb or wrist (pinned "Not given" statements); grip claims c1 and c9 and the hand zoom Right are on setup 3 and 5.' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'position', text: 'Face a sturdy wall, feet shoulder-width apart, toes slightly out.', claim: CL.c1 },
    { kind: 'position', text: 'Arms out, ball touching the wall: stand there.', zoom: 'wall-distance', claim: CL.c2 },
    { kind: 'grip', text: 'Hold the ball at chest height, elbows tucked in.', claim: CL.c1 },
    { kind: 'brace', text: 'Brace your trunk and stand tall.', claim: CL.brace },
    { kind: 'grip', text: 'At the catch: hands under the ball, elbows high in front.', claim: CL.c9 },
  ],
  posture: [
    { key: 'depth', label: 'Squat depth', detail: 'Squat until your thighs are parallel to the floor or lower.', anchor: { landmark: 'hip.r', pose: 'end' }, claim: CL.c6 },
    { key: 'heels', label: 'Chest up', detail: 'Keep your weight in your heels and your chest up.', anchor: { landmark: 'chest', pose: 'end' }, claim: CL.c6 },
    { key: 'drive', label: 'Drive up', detail: 'Drive up through your heels and throw the ball to the target.', anchor: { landmark: 'knee.r', pose: 'start' }, claim: CL.c7 },
    { key: 'close', label: 'Ball close', detail: 'Keep the ball close to your body.', anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c9 },
    // D-SHIP-TEXTZOOM (header): the card zoom catch-timing as text (Right here; its Wrong is hm-early)
    { key: 'catch', label: 'Catch, then squat', detail: 'Catch with hips and arms extended, then squat.', anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c8 },
    { key: 'breathe', label: 'Breathe', detail: 'Breathe in as you squat, out as you throw.', anchor: { landmark: 'chest', pose: 'start' }, claim: CL.c11 },
    // Q-W2-12 (NoHandling): the card's handlingMistakes as checkpoints, label = the mistake, detail = the card's fix
    { key: 'hm-far', label: 'Too far back', detail: 'Arms out, ball touching the wall: stand there.',
      anchor: { landmark: 'heel.r', pose: 'end' }, zoom: 'wall-distance', claim: CL.far },
    { key: 'hm-early', label: 'Squatting before catching', detail: 'Catch standing tall, then squat.', anchor: { landmark: 'buttock', pose: 'end' }, claim: CL.c8 },
    { key: 'hm-shallow', label: 'Squatting too shallow', detail: 'Squat until your thighs are parallel to the floor or lower.', anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.c6 },
    // D-SHIP-W7-B3: the hand zoom catch-hands Wrong (c9) as a fault
    { key: 'hm-hands', label: 'Sandwiching the ball', detail: 'Hands under the ball, elbows high in front.', anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c9 },
  ],
  feel,
  zooms,
  chips: ['wall-distance', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Arms out, ball touching the wall: stand there. Ball at chest height.',
    mistakeLine: 'Never sandwich the ball from the sides: hands under it, elbows high.',
    cueLine: 'Catch tall, then squat.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/wall_ball.json', rev: 1 },
};
