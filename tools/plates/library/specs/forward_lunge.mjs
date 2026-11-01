// Forward lunge with dumbbells, side view, figure facing screen right. LIB-SPLIT (LB4, mode H: D-SPLIT-MODES).
// View: side (card plate.view = census view). The forward step, the hip drop and the shin travel (c3), the shin angle
//  (c2) and the straight back (c5) are all sagittal.
// Clone source: the pinned reverse_lunge (specs/reverse_lunge.mjs, PILOT-A3 PIN GO @ 2edabdf0), copied, never imported
//  (D-LIB9-CLONE). Copied unchanged: the body sizes, FOOT_X, FRONT_SHIN, FRONT_THIGH, REAR_KNEE_Y, REAR_HEEL,
//  TRUNK_LEAN, ELBOW, the rear-foot toe-pad lift (REAR_LIFT, solved value 0.0360 m), the end pose built from the front
//  foot outward, the arms (flexion = lean keeps them plumb), the two dumbbell entries, the shin plumb guide and the
//  camera. reverse_lunge has no root finder; nothing here is bracketed.
// What differs from reverse_lunge (D-SPLIT-FWD): the step goes forward. The start stands on the rear foot's spot: both
//  feet START_Z behind the front foot's mid-foot, so the rear (far, l) foot's ball is where the end pose's rear ball is
//  (z equal; its height moves by REAR_LIFT, the rigid-foot toe-pad convention). The near (r) leg steps forward and lands
//  heel first (c4): via 1 = the near foot in the air halfway, the body over the rear foot; via 2 = the near foot down
//  at its spot, the rear heel up, hips halfway down; end = the parent's end pose.
// Form (research card forward_lunge, claims): c1 feet about hip width, step forward, lower the back knee almost to the
//  floor without touching; c2 a step long enough that the front shin is about vertical; c3 drop the hips toward the
//  floor rather than driving them forward; c4 the stepping foot lands heel first; c5 one dumbbell in each hand, palms
//  in, arms straight at the sides, back straight.
// Plate text (card plate): callouts = plate.checkpoints (c3 Hips drop down, c2 Front shin vertical, c5 Back straight);
//  Mistake = plate.mistake (c3, drawable): the hips and front knee drive forward on landing and the front shin tips far
//  forward over the foot. Tells: the knee (first, the topFault key) and the hips.
// Mistake size: the front shin at M_SHIN deg from vertical with the front foot flat and the hips held at the end height
//  (they move forward, not down). M_SHIN is the angle at which the front knee joint centre passes over the front toe
//  tip (c13's "the knee ahead of the toes" read onto "tips far forward over the foot"); picked from the words before
//  measuring and never enlarged (Q-D5-3).
// Tempo: the strip without seconds, exactly tempoOf(strip/rows.json forward_lunge) (D-STRIP-ROWS).
// Unsourced numbers: as reverse_lunge's (FOOT_X, FRONT_THIGH, REAR_KNEE_Y, REAR_HEEL, TRUNK_LEAN, ELBOW), the via poses
//  (swing foot 8 cm up; hips), M_SHIN (the Mistake size).
import { landmarksOf } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const L_TH = 0.245 * H, L_SH = 0.246 * H, ANK = 0.039 * H, MID = 0.044 * H, BALL = 0.080 * H;
const FOOT_X = 0.10;              // mid-sole lateral offset: feet hip width (c1)
const FRONT_SHIN = 6;             // front shin, deg forward of vertical (c2 "about vertical")
const FRONT_THIGH = 0;            // front thigh, deg above horizontal (0 = parallel)
const REAR_KNEE_Y = 0.085;        // rear knee joint centre height (m): kneecap ~3.6 cm clear of the floor (c1 "without touching")
const REAR_HEEL = 45;             // rear foot heel-up angle (deg)
const TRUNK_LEAN = 3;             // pelvis/trunk forward lean at the bottom (deg from vertical)
const STAND_LEAN = 0;
const ELBOW = 4;

const sT = Math.sin(REAR_HEEL * R), cT = Math.cos(REAR_HEEL * R);
const REAR_LIFT = -Math.min(...[[0.112, -0.036], [0.120, -0.028], [0.100, -0.038]].map(([z, y]) => ((z - 0.080) * -sT + (y + 0.039) * cT) * H));
const REAR_N = [0, cT, sT], REAR_T = [0, -sT, cT];

// End pose, built from the front foot outward (reverse_lunge's).
const ankF = [0, ANK, -MID];
const kneeAt = shin => [0, ankF[1] + L_SH * Math.cos(shin * R), ankF[2] + L_SH * Math.sin(shin * R)];
const kneeF = kneeAt(FRONT_SHIN);
const HIP = [0, kneeF[1] + L_TH * Math.sin(FRONT_THIGH * R), kneeF[2] - L_TH * Math.cos(FRONT_THIGH * R)];
const kneeB = [0, REAR_KNEE_Y, HIP[2] - Math.sqrt(L_TH ** 2 - (HIP[1] - REAR_KNEE_Y) ** 2)];
const ankBy = REAR_LIFT + ANK * cT + BALL * sT;
const ankB = [0, ankBy, kneeB[2] - Math.sqrt(L_SH ** 2 - (ankBy - REAR_KNEE_Y) ** 2)];
const REAR_BALL = [FOOT_X, REAR_LIFT, ankB[2] - ANK * sT + BALL * cT];
// Start on the rear foot's spot: a flat foot's ball is BALL - MID ahead of its mid-foot.
const START_Z = REAR_BALL[2] - (BALL - MID);

const front = { at: [-FOOT_X, 0, 0] };
const arms = lean => ({ shoulder: { flex: lean }, elbow: ELBOW });
const pose = (hip, lean, r, l) => ({ root: { at: [0, ...hip.slice(1)], tilt: lean }, trunk: { flex: 0 }, neck: 0, ...arms(lean), plant: { r, l } });
const REAR = { at: REAR_BALL, normal: REAR_N, toe: REAR_T, ref: 'ball' };

// Start: standing tall on the rear foot's spot, feet hip width, hip-joint centre 3 cm in front of the ankles.
const start = pose([0, 0.925, START_Z - MID + 0.03], STAND_LEAN, { at: [-FOOT_X, 0, START_Z] }, { at: [FOOT_X, 0, START_Z] });
// The step (c4: the stepping foot lands heel first, the weight moves onto it slowly): via 1 = the near foot 8 cm up and
// halfway forward, toes up for a heel landing, the body still over the flat rear foot; via 2 = the near foot down at
// its spot, the rear heel up on the ball, the hips halfway down.
const via = [
  pose([0, 0.89, START_Z + 0.06], 1, { at: [-FOOT_X, 0.08, START_Z / 2], normal: [0, Math.cos(15 * R), -Math.sin(15 * R)] }, { at: [FOOT_X, 0, START_Z] }),
  pose([0, 0.70, (HIP[2] + START_Z) / 2 + 0.12], TRUNK_LEAN, front, REAR),
];
const end = pose(HIP, TRUNK_LEAN, front, REAR);
// Mistake size (header): the front shin angle that puts the knee joint centre over the front toe tip, solved from the
// drawn end pose (toe.r is the toe tip landmark; the foot does not move). Solved value 29.2 deg.
const M_SHIN = Math.asin((landmarksOf(end, H)['toe.r'][2] - ankF[2]) / L_SH) / R;
// Mistake (c3): on landing the hips and the front knee drive forward instead of the hips dropping; the front shin tips
// to M_SHIN with the foot flat, the hips held at the end height (thigh length kept). Arms, trunk lean and the rear
// foot are the end pose's.
const kneeM = kneeAt(M_SHIN);
const HIP_M = [0, HIP[1], kneeM[2] - Math.sqrt(L_TH ** 2 - (kneeM[1] - HIP[1]) ** 2)];
const MISTAKE = pose(HIP_M, TRUNK_LEAN, front, REAR);
/** The unsourced sizes (pilot-a2/sizes.json form). */
export const SIZES = { FOOT_X, FRONT_SHIN, FRONT_THIGH, REAR_KNEE_Y, REAR_HEEL, TRUNK_LEAN, ELBOW, M_SHIN, START_Z };
export const fwdInfo = { REAR_BALL, START_Z, HIP, HIP_M, kneeF, kneeM };
const SHIN_TOP = 0.12;
const SHIN_PLUMB = [[0, 0, ankF[2]], [0, kneeF[1] + SHIN_TOP, ankF[2]]];
// Hips drop (c3): a plumb from the hips to the floor under them.
const HIP_PLUMB = ['hips', [0, 0, HIP[2]]];
const bells = lm => [
  { type: 'dumbbell', at: lm['grip.l'], axis: [0, 0, 1], z: 'back', part: 'db' },
  { type: 'dumbbell', at: lm['grip.r'], axis: [0, 0, 1], z: 'front', part: 'db' },
];
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };

export default {
  id: 'forward_lunge', name: 'Forward Lunge', view: 'side', facing: 'right',
  camera: { x0: 248, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -1.3, to: 0.4 },
    lm => bells(lm)[0],
    lm => bells(lm)[1],
  ],
  checks: [
    { landmark: 'heel.r', plane: FLOOR, pose: 'all', tol: 0.5 },                        // front foot flat
    { landmark: 'ball.r', plane: FLOOR, pose: 'all', tol: 0.5 },
    { landmark: 'heel.l', plane: FLOOR, pose: 'start', tol: 0.5 },                      // feet together at the start
    { landmark: 'ball.l', plane: FLOOR, pose: 'start', tol: 0.5 },
    { landmark: 'toe.l', plane: FLOOR, pose: 'end', tol: 1 },                           // rear forefoot on the floor
    { landmark: 'knee.l', above: { point: [0, 0.049 + 0.02, 0], normal: [0, 1, 0] }, pose: 'end' },   // c1 "without touching" (cap + 2 cm)
  ],
  ghosts: { count: 2, parts: ['leg.r', 'leg.l', 'trunk', 'arm.r', 'db'] },
  trace: { point: 'hip.r', trim: [10, 12] },
  callouts: [
    { key: 'hips', text: 'Hips drop<br>down', anchor: 'buttock', guide: HIP_PLUMB, cue: 'Drop the hips toward the floor rather than driving them forward.' },
    { key: 'shin', text: 'Front shin<br>vertical', anchor: { along: ['knee.r', 'ankle.r'], t: 0.45, off: [7, 0] }, guide: SHIN_PLUMB, cue: 'Step long enough that the front shin is about vertical.' },
    { key: 'back', text: 'Back straight', anchor: 'backUpper', cue: 'Keep the back straight as you step.' },
  ],
  mistake: {
    pose: MISTAKE,
    tells: [
      { key: 'knee', text: 'Knee drives<br>forward', anchor: { at: 'knee.r', pose: 'mistake' }, cue: 'The front knee drives forward and the shin tips far over the foot.' },   // c3
      { key: 'hips', text: 'Hips push<br>forward', anchor: { at: 'buttock', pose: 'mistake' }, cue: 'The hips drive forward instead of dropping.' },   // c3
    ],
  },
  tempo: [{ phase: 'Step', move: true, word: 'Slow' }, { phase: 'Lower', move: true, word: 'Smooth' }, { phase: 'Rise', move: true }],
  alt: 'Forward lunge with dumbbells, side view. From standing, one leg steps forward and lands heel first; the body lowers until the front thigh is parallel and the back knee is just off the floor, front shin near vertical, back foot on the ball, back straight.',
};
