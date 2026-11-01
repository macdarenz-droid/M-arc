// Bodyweight split squat, side view, figure facing screen right. LIB-SPLIT (LB4, mode H: D-SPLIT-MODES).
// View: side (card plate.view = census view). A static split stance: the back-knee depth (c1), the upright trunk and
//  the vertical front shin (c2) are sagittal.
// Clone source: the pinned reverse_lunge (specs/reverse_lunge.mjs, PILOT-A3 PIN GO @ 2edabdf0), copied, never imported
//  (D-LIB9-CLONE). Copied unchanged: the body sizes, FOOT_X, FRONT_SHIN, REAR_HEEL, TRUNK_LEAN, ELBOW, the rear-foot
//  toe-pad lift (REAR_LIFT, solved value 0.0360 m), the end pose built from the front foot outward, the arms (flexion
//  = lean keeps them plumb) and the camera. The root finder is step_up's bracketed Illinois solve (LB4, copied), which
//  throws on a bracket with no root; its bracket and solved value are recorded at the call. No load (card
//  plate.equipment "Floor line only; no weights"), so no dumbbell entries.
// What differs from reverse_lunge: there is no step. Both feet stay where the end pose plants them in every pose (the
//  front foot flat, the rear foot on its ball). The end puts the back kneecap on the floor (c1 "lightly touches"), as
//  walking_lunge's (this lane): the rear knee joint centre KNEECAP above the floor, the front thigh FRONT_THIGH below
//  parallel. The start is the same stance with the hips straight above the end hips, raised until the front knee is
//  START_KNEE (c3 "about straight"; the engine leg is fully straight only with the foot off the floor).
// Form (research card bodyweight_split_squat, claims): c1 from a split stance, bend both knees to lower until the back
//  knee lightly touches the floor; c2 keep the trunk upright, the front shin about vertical at the bottom; c3 come up
//  until the front knee is about straight.
// Plate text (card plate): callouts = plate.checkpoints (c2 Trunk upright, c2 Front shin vertical, c1 Back knee down);
//  Mistake = plate.mistake (c2, drawable): the front knee slides forward at the bottom and the front shin tips well
//  past vertical. One tell, the knee (the topFault key).
// Mistake size: as forward_lunge's (this lane): the front shin at M_SHIN, the angle at which the front knee joint centre
//  passes over the front toe tip ("tips well past vertical" read as the knee past the toes, c4's "closer works the
//  quads more" giving no angle), the front foot flat and the hips held at the end height; picked from the words before
//  measuring, never enlarged (Q-D5-3).
// Arms: the card gives none (unsourced); they hang plumb at the sides, as the parent's, with no load.
// Tempo: the strip without seconds, exactly tempoOf(strip/rows.json bodyweight_split_squat) (D-STRIP-ROWS).
// Unsourced numbers: as reverse_lunge's (FOOT_X, FRONT_SHIN, REAR_HEEL, TRUNK_LEAN, ELBOW), FRONT_THIGH (5 deg below
//  parallel), START_KNEE 8, the split length (the end pose's), M_SHIN (solved).
import { landmarksOf, normPose, resolve } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180, B = { height: H };
const L_TH = 0.245 * H, L_SH = 0.246 * H, ANK = 0.039 * H, MID = 0.044 * H, BALL = 0.080 * H;
const FOOT_X = 0.10;              // mid-sole lateral offset (the parent's)
const FRONT_SHIN = 6;             // front shin, deg forward of vertical (c2 "about vertical")
const START_KNEE = 8;             // front knee flexion at the top (c3 "about straight")
const FRONT_THIGH = -5;           // front thigh, deg above horizontal (5 below parallel: the rear knee reaches the floor)
const KNEECAP = 0.028 * H;        // kneecap radius (body.mjs RADII.kneeCap)
const REAR_KNEE_Y = KNEECAP;      // rear knee joint centre height (m): the kneecap on the floor (c1 "lightly touches")
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
const front = { at: [-FOOT_X, 0, 0] };
const arms = lean => ({ shoulder: { flex: lean }, elbow: ELBOW });
const pose = (hip, lean, r, l) => ({ root: { at: [0, ...hip.slice(1)], tilt: lean }, trunk: { flex: 0 }, neck: 0, ...arms(lean), plant: { r, l } });
const REAR = { at: REAR_BALL, normal: REAR_N, toe: REAR_T, ref: 'ball' };

const end = pose(HIP, TRUNK_LEAN, front, REAR);
// Bracketed root finder (Illinois regula falsi, copied from step_up.mjs): throws when f(a) and f(b) have the same sign.
const solve = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`bodyweight_split_squat: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-10; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const knees = p => resolve(normPose(p, B), B).q.knee;
// Start (c3): the same stance, the hips straight above the end hips; the hip height SOLVED, bracket [0.80, 0.836] m,
// so the front knee is START_KNEE (solved value 0.8350 m).
const START_Y = solve(y => knees(pose([0, y, HIP[2]], TRUNK_LEAN, front, REAR)).r - START_KNEE, 0.80, 0.836);
const start = pose([0, START_Y, HIP[2]], TRUNK_LEAN, front, REAR);
// Mistake (c2; as forward_lunge's): the front knee slides forward at the bottom; the front shin tips to M_SHIN with
// the foot flat, the hips held at the end height (thigh length kept). M_SHIN is solved from the drawn end pose: the
// knee joint centre over the toe tip (toe.r; the foot does not move).
const M_SHIN = Math.asin((landmarksOf(end, H)['toe.r'][2] - ankF[2]) / L_SH) / R;
const kneeM = kneeAt(M_SHIN);
const HIP_M = [0, HIP[1], kneeM[2] - Math.sqrt(L_TH ** 2 - (kneeM[1] - HIP[1]) ** 2)];
const MISTAKE = pose(HIP_M, TRUNK_LEAN, front, REAR);
/** The unsourced sizes (pilot-a2/sizes.json form). */
export const SIZES = { FOOT_X, FRONT_SHIN, FRONT_THIGH, REAR_KNEE_Y, REAR_HEEL, TRUNK_LEAN, ELBOW, START_KNEE, START_Y, M_SHIN };
export const bssInfo = { REAR_BALL, HIP, kneeF, START_Y, M_SHIN };
const SHIN_TOP = 0.12;
const SHIN_PLUMB = [[0, 0, ankF[2]], [0, kneeF[1] + SHIN_TOP, ankF[2]]];
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };

export default {
  id: 'bodyweight_split_squat', name: 'Bodyweight Split Squat', view: 'side', facing: 'right',
  camera: { x0: 248, y0: 339 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -1.3, to: 0.4 },
  ],
  checks: [
    { landmark: 'heel.r', plane: FLOOR, pose: 'all', tol: 0.5 },                        // front foot flat
    { landmark: 'ball.r', plane: FLOOR, pose: 'all', tol: 0.5 },
    { landmark: 'toe.l', plane: FLOOR, pose: 'all', tol: 1 },                           // rear forefoot on the floor (feet fixed)
    { landmark: 'knee.l', plane: { point: [0, KNEECAP, 0], normal: [0, 1, 0] }, pose: 'end', tol: 0.5 },   // c1: the back kneecap on the floor
  ],
  ghosts: { count: 2, parts: ['leg.r', 'leg.l', 'trunk', 'arm.r'] },
  trace: { point: 'hip.r', trim: [10, 12] },
  callouts: [
    { key: 'trunk', text: 'Trunk upright', anchor: 'sternum', cue: 'Keep the trunk upright.' },
    { key: 'shin', text: 'Front shin<br>vertical', anchor: { along: ['knee.r', 'ankle.r'], t: 0.45, off: [7, 0] }, guide: SHIN_PLUMB, cue: 'At the bottom, keep the front shin about vertical.' },
    { key: 'knee', text: 'Back knee<br>down', anchor: 'knee.l', box: { left: 40, top: 252 }, cue: 'Lower until the back knee lightly touches the floor.' },
  ],
  mistake: {
    pose: MISTAKE,
    tells: [
      { key: 'knee', text: 'Knee slides<br>forward', anchor: { at: 'knee.r', pose: 'mistake' }, cue: 'The front knee slides forward and the shin tips well past vertical.' },   // c2
      { key: 'shin', text: 'Shin tips<br>forward', anchor: { along: ['knee.r', 'ankle.r'], t: 0.5, pose: 'mistake' }, cue: 'The front shin tips past vertical, the knee ahead of the toes.' },
    ],
  },
  tempo: [{ phase: 'Lower', move: true, word: 'Smooth' }, { phase: 'Rise', move: true, word: 'Smooth' }],
  alt: 'Bodyweight split squat, side view. From a split stance with the front knee about straight, both knees bend and the body lowers until the back knee lightly touches the floor, front shin near vertical, front foot flat, back foot on the ball, trunk upright, feet staying in place.',
};
