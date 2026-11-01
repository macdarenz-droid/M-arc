// Bulgarian split squat with dumbbells, side view, figure facing screen right. LIB-SPLIT (LB4, mode H: D-SPLIT-MODES).
// View: side (card plate.view = census view). The bench height and the rear-foot contact (c2), the rear-knee depth (c3)
//  and the back (c5) read from the side; the knee-in fault (c4) is a front-view fault and is not drawn.
// Clone source: the pinned reverse_lunge (specs/reverse_lunge.mjs, PILOT-A3 PIN GO @ 2edabdf0), copied, never imported
//  (D-LIB9-CLONE): the body sizes, FOOT_X, FRONT_SHIN, TRUNK_LEAN, ELBOW, the arms (flexion = lean keeps them plumb), the
//  two dumbbell entries, the shin plumb and the camera. The bench is the vendor `bench` with axis 'x' (bench_dip.mjs's
//  entry form). The root finder is step_up's bracketed Illinois solve (LB4, copied), which throws on a bracket with no
//  root; each bracket and solved value is recorded at its call.
// What differs from reverse_lunge: no step. The rear (far, l) foot rests laces-down on the bench (c2) in every pose:
//  the rigid engine foot turned over so that its dorsum line, from the instep point (foot frame [0.018, 0.018] H) to the
//  toe dorsum ([0.113, -0.020] H, FOOT_SIDE, body.mjs:57-58), lies on the bench top; the ankle then sits 4.1 cm above
//  the top. The instep overhangs the bench's front edge by OVERHANG (c2's free shin). The front (near, r) foot is flat,
//  its toe tip STANCE ahead of the bench's front edge (c2 "about three foot-lengths"). The end puts the rear kneecap on
//  the floor (c3 "lightly touches", D-SPLIT-BSSMIS): the rear knee joint centre KNEECAP above the floor, the hip where the
//  two thighs meet (front shin FRONT_SHIN). The start is the same stance with the hips straight above the end hips,
//  raised until the front knee is START_KNEE ("standing on the front leg").
// Form (research card bulgarian_split_squat, claims): c2 the front foot about three foot-lengths ahead of the support,
//  the top of the rear foot on a bench about knee height; c3 lower at a controlled speed until the rear knee lightly
//  touches the floor without resting on it; c5 the back straight; c8 no crash into the bottom; c9 dumbbells at the
//  sides.
// Bench height (D-SPLIT-BSSBENCH): 0.42 m, the highest on a 1 cm grid at which c3's floor contact holds on this body
//  (84 % of the 0.499 m standing knee joint height: c2's "about knee height"), an engine-limit size, unsourced.
// Mistake (D-SPLIT-BSSMIS; c3, c8): the hips sink M_SINK lower with the rear knee resting on the floor (the knee kept on
//  the floor, the hip z SOLVED). The tell is on `seat`, shown in a Mistake zoom at the smallest passing ladder k.
// Tempo: the strip without seconds, exactly tempoOf(strip/rows.json bulgarian_split_squat) (D-STRIP-ROWS).
// Unsourced numbers: BENCH_TOP 0.42 m, the bench depth (the vendor 0.29 m), OVERHANG 0.02 m, STANCE (3 foot-lengths of
//  the engine foot, 0.266 m each), as reverse_lunge's (FOOT_X, FRONT_SHIN, TRUNK_LEAN, ELBOW), START_KNEE, M_SINK.
import { landmarksOf, normPose, resolve } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180, B = { height: H };
const L_TH = 0.245 * H, L_SH = 0.246 * H, ANK = 0.039 * H, MID = 0.044 * H;
const FOOT_X = 0.10;              // mid-sole lateral offset (the parent's)
const FRONT_SHIN = 6;             // front shin, deg forward of vertical (the parent's)
const TRUNK_LEAN = 3;             // pelvis/trunk forward lean (deg from vertical)
const ELBOW = 4;
const START_KNEE = 8;             // front knee flexion at the top ("standing on the front leg")
const BENCH_TOP = 0.42;           // bench pad top (m), D-SPLIT-BSSBENCH
const BENCH_W = 0.29;             // bench depth seen side-on (the vendor bench's width)
const REAR_X = 0.05 * H;          // rear foot lateral offset: under the hip joint centre (REF.hjcX), so the turned-over
                                  // foot's plant is exact (0.0 cm; at the parent's 0.10 m it misses by 0.7 cm)
const OVERHANG = 0.02;            // instep point ahead of the bench's front edge (m)
const FOOT_LEN = (0.120 + 0.032) * H;   // engine foot, heel to toe tip (FOOT_SIDE)
const STANCE = 3 * FOOT_LEN;      // front toe tip ahead of the bench's front edge (c2)
const KNEECAP = 0.028 * H;        // kneecap radius (body.mjs RADII.kneeCap)
const M_SINK = 0.01;              // Mistake: the hips sink this much lower, the knee resting (m)

// Bracketed root finder (Illinois regula falsi, copied from step_up.mjs): throws when f(a) and f(b) have the same sign.
const solve = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`bulgarian_split_squat: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-10; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};

// Front foot flat, mid-foot at z 0; its toe tip (FOOT_SIDE [0.120, ..]) is (0.120 - 0.044) H ahead.
const TOE_Z = (0.120 - 0.044) * H, EDGE_Z = TOE_Z - STANCE;
// Rear foot laces-down: the foot frame turned so the dorsum line instep -> toe dorsum points straight back, level.
const IN = [0.018, 0.018], TD = [0.113, -0.020];   // foot frame [z, y] in H
const PHI = Math.PI + Math.atan2(-(TD[1] - IN[1]), TD[0] - IN[0]);   // toe direction angle in the (z, y) plane
const zf = [Math.cos(PHI), Math.sin(PHI)], yf = [-Math.sin(PHI), Math.cos(PHI)];   // foot z and y axes, world (z, y)
const INSTEP = [EDGE_Z + OVERHANG, BENCH_TOP];
const ANKLE_B = [INSTEP[0] - (zf[0] * IN[0] + yf[0] * IN[1]) * H, INSTEP[1] - (zf[1] * IN[0] + yf[1] * IN[1]) * H];
// the plant: the sole 'mid' point and the foot's normal and toe directions (solvePlant: ankle = at + n ankleH - t mid)
const REAR = {
  at: [REAR_X, ANKLE_B[1] + (zf[1] * MID - yf[1] * ANK), ANKLE_B[0] + (zf[0] * MID - yf[0] * ANK)],
  normal: [0, yf[1], yf[0]], toe: [0, zf[1], zf[0]], pole: [0, -1, 0],   // the rear knee bulges down, toward the floor
};
const front = { at: [-FOOT_X, 0, 0] };

// End: the rear knee joint centre KNEECAP above the floor, in front of the rear ankle; the front knee at FRONT_SHIN;
// the hip where the two thighs meet (the upper intersection).
const ankF = [ANK, -MID];   // (y, z)
const kneeF = [ankF[0] + L_SH * Math.cos(FRONT_SHIN * R), ankF[1] + L_SH * Math.sin(FRONT_SHIN * R)];
const kneeB = [KNEECAP, ANKLE_B[0] + Math.sqrt(L_SH ** 2 - (ANKLE_B[1] - KNEECAP) ** 2)];
const meet = (a, b) => {   // the upper point at L_TH from both (y, z) points
  const dy = b[0] - a[0], dz = b[1] - a[1], d = Math.hypot(dy, dz), h = Math.sqrt(L_TH ** 2 - (d / 2) ** 2);
  const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], u = [dz / d, -dy / d];
  const p1 = [m[0] + u[0] * h, m[1] + u[1] * h], p2 = [m[0] - u[0] * h, m[1] - u[1] * h];
  return p1[0] > p2[0] ? p1 : p2;
};
const HIP = meet(kneeF, kneeB);   // (y, z)
const arms = lean => ({ shoulder: { flex: lean }, elbow: ELBOW });
const pose = (y, z, lean) => ({ root: { at: [0, y, z], tilt: lean }, trunk: { flex: 0 }, neck: 0, ...arms(lean), plant: { r: front, l: REAR } });
const end = pose(HIP[0], HIP[1], TRUNK_LEAN);
const knees = p => resolve(normPose(p, B), B).q.knee;
// Start: the hips straight above the end hips, the height SOLVED so the front knee is START_KNEE.
const START_Y = solve(y => knees(pose(y, HIP[1], TRUNK_LEAN)).r - START_KNEE, HIP[0] + 0.1, HIP[0] + 0.42);
const start = pose(START_Y, HIP[1], TRUNK_LEAN);
// Mistake: the hips M_SINK lower; the hip z SOLVED, bracket [HIP z, HIP z + 0.25] m, so the rear knee stays on the
// floor (the rear foot is fixed on the bench, so the knee cannot move: the hips swing forward about it).
const M_Y = HIP[0] - M_SINK;
const M_Z = solve(z => landmarksOf(pose(M_Y, z, TRUNK_LEAN), H)['knee.l'][1] - KNEECAP, HIP[1], HIP[1] + 0.25);
const MISTAKE = pose(M_Y, M_Z, TRUNK_LEAN);
export const SIZES = { FOOT_X, REAR_X, FRONT_SHIN, TRUNK_LEAN, ELBOW, START_KNEE, BENCH_TOP, BENCH_W, OVERHANG, STANCE, M_SINK };
export const bssInfo = { EDGE_Z, INSTEP, ANKLE_B, HIP, kneeB, START_Y, M_Y, M_Z, PHI: PHI / R };
const SHIN_TOP = 0.12;
const SHIN_PLUMB = [[0, 0, ankF[1]], [0, kneeF[0] + SHIN_TOP, ankF[1]]];
const bells = lm => [
  { type: 'dumbbell', at: lm['grip.l'], axis: [0, 0, 1], z: 'back', part: 'db' },
  { type: 'dumbbell', at: lm['grip.r'], axis: [0, 0, 1], z: 'front', part: 'db' },
];
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };

export default {
  id: 'bulgarian_split_squat', name: 'Bulgarian Split Squat', view: 'side', facing: 'right',
  camera: { x0: 248, y0: 339 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: EDGE_Z - BENCH_W - 0.15, to: 0.4 },
    { type: 'bench', at: [0, BENCH_TOP, EDGE_Z - BENCH_W / 2], axis: 'x', width: BENCH_W, z: 'back' },
    lm => bells(lm)[0],
    lm => bells(lm)[1],
  ],
  checks: [
    { landmark: 'heel.r', plane: FLOOR, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: FLOOR, pose: 'all', tol: 0.5 },
    { landmark: 'knee.l', plane: { point: [0, KNEECAP, 0], normal: [0, 1, 0] }, pose: 'end', tol: 0.5 },   // c3: the rear kneecap on the floor
  ],
  ghosts: { count: 2, parts: ['leg.r', 'leg.l', 'trunk', 'arm.r', 'db'] },
  trace: { point: 'hip.r', trim: [10, 12] },
  callouts: [
    { key: 'foot', text: 'Foot on<br>bench', anchor: 'ankle.l', cue: 'Rest the top of the rear foot on a bench about knee height.' },
    { key: 'stance', text: 'Long stance', anchor: 'toe.r', cue: 'Put the front foot about three foot-lengths ahead of the bench.' },
    { key: 'back', text: 'Back straight', anchor: 'backUpper', cue: 'Keep the back straight as the rear knee lowers.' },
  ],
  mistake: {
    pose: MISTAKE,
    tells: [
      { key: 'seat', text: 'Drops into<br>the bottom', anchor: { at: 'seat', pose: 'mistake' }, cue: 'The hips drop into the bottom and the rear knee rests on the floor.' },   // c3, c8
    ],
  },
  zoom: { view: 'mistake', k: 1.5 },
  tempo: [{ phase: 'Lower', move: true, word: 'Controlled' }, { phase: 'Stand', move: true }],
  alt: 'Bulgarian split squat with dumbbells, side view. The top of the rear foot rests on a bench behind, the front foot well ahead, and the body lowers until the rear knee lightly touches the floor, front foot flat, back straight, dumbbells hanging at the sides.',
};
