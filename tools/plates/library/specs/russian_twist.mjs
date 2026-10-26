// Russian twist (feet down, medicine ball), FRONT view from a camera raised CAM_PITCH deg. LIB-21 (LB9, H, (b) row:
//  the library's first `trunk.yaw` and `root.yaw` plate, LIB-20; the `medBallOptional` composer's one user).
// View: front (card plate.view = census): the trunk turning side to side while the hips and knees stay still (c4)
//  reads from the front. The camera is raised (LIB-20 `camera.pitch`) so the seated legs and the ball by the hip read
//  in depth (plan 2.4's spike for this id used pitch 20, REPORT.md:44).
// Sources: research card docs/research/howto/cards/russian_twist.json: c1 sit on the floor, knees bent, feet on the
//  floor (the easier version; "or slightly lifted" is an "or" choice, D-LIB17-ORCHOICE: plate.start draws the feet
//  down, c6); c2 hold a medicine ball in both hands in front of the chest; c3 lean back slightly with a straight back;
//  c4 turn the trunk to one side and bring the weight toward the hip, keeping the hips stable; c5 keep the buttocks
//  planted; c8 the top fault (fast, uncontrolled twists: speed only, so F7); the card tempo (Turn 1, Return 1).
// Sides (D-LIB21-SIDES): the card names no side (c4 "to one side ... then the other"); the plate draws the turn to the
//  figure's left.
// Clone (D-LIB21-CLONE): hanging_leg_raise (census closest; its trim), resistance_band_row (LB1: the floor-sit class,
//  rootOnSeat on the floor), upright_row (the engine front view) and LIB-20's _test_er5 (the E-R5 fields); copied,
//  never imported.
// Geometry (confirmed by the report's contacts and checks; `info`):
//  Seat (c1, c5): the buttocks on the floor (the `seat` landmark, rootOnSeat) with the pelvis tilted back LEAN deg
//   and the spine straight (trunk.flex 0, c3 "lean slightly back with a straight back"); neck 0. Unchanged in start and
//   end (c4, c5: the hips stay still).
//  Legs (c1): feet flat on the floor (plant), FOOT_Z in front of the hip joints and the hips' width apart, knees up and
//   forward; the same in start and end.
//  Start (c2): the ball's centre BALL_Z in front of the chest landmark and BALL_DROP under it (-3 cm: above), between
//   the chest and the raised knees, a hand on each side of it (grip centres GRIP_IN of its radius out from its centre,
//   elbows out and down).
//  End (c4): the ball beside the left hip, its inner edge BALL_GAP out from the pelvis's outer side (HIP_HALF), its
//   bottom BALL_LIFT above the floor, level with the hip joint front to back; the thorax turned (trunk.yaw) so the chest
//   faces the ball (the turn "leading with your hands or the load", c4): YAW is solved, not chosen.
//  Via (D-LIB21-DRAW): the ball turns out to the side at chest height first, then down by the hip (one via key), so the
//   ghosts and the Trace pass outside the left thigh; its turn is solved the same way.
//  Mistake (plate.mistake, c4, c5): the hips and knees swing with the trunk: the pelvis turns M_YAW (half the solved
//   trunk turn) about the vertical (root.yaw), the legs keep their end angles, so the knees and feet swing with it;
//   the thorax keeps its total turn (trunk.yaw YAW - M_YAW) and the hands stay on the ball.
//  Balance (D-LIB21-BALANCE, c1, c5): the centre of mass (Winter on the drawn landmarks, plus the ball at its centre)
//   lies over the base from the buttocks to the feet in every pose (baseOf).
//  Trace (D-LIB21-TRACE): the ball toward the hip (the grips' midpoint, c4), trim [10, 12] (hanging_leg_raise.mjs:124).
// Unsourced numbers (SIZES; lb9/sizes.json holds each with its basis): CAM_PITCH, LEAN, FOOT_Z, BALL_Z, BALL_DROP,
//  GRIP_IN, HIP_HALF, BALL_LIFT, BALL_GAP, M_YAW_SHARE; the ball's size is eq/medBallOptional.mjs MED_BALL_OPT.
// Start phantom and ghosts: the ball and the left arm only (the right arm reaches behind the knees in this view, and its
//  phantom would sit under the Mistake's one tell).
import { landmarksOf, rootOnSeat, normPose, resolve, REF, WINTER } from '../engine.mjs';
import { medBallOptional, MED_BALL_OPT, MED_BALL_OPT_ITEMS } from '../eq/medBallOptional.mjs';
import { perItem } from '../eq/parts.mjs';

const H = 1.75, D = Math.PI / 180;
export const SIZES = Object.freeze({ CAM_PITCH: 20, LEAN: 20, FOOT_Z: 0.55, BALL_Z: 0.15, BALL_DROP: -0.03, BALL_GAP: 0.02, GRIP_IN: 0.9, HIP_HALF: 0.17, BALL_LIFT: 0.03, M_YAW_SHARE: 0.5 });
const { CAM_PITCH, LEAN, FOOT_Z, BALL_Z, BALL_DROP, BALL_GAP, GRIP_IN, HIP_HALF, BALL_LIFT, M_YAW_SHARE } = SIZES;
const R = MED_BALL_OPT.d / 2, FX = REF.hjcX * H;
const rotY = (v, a) => { const c = Math.cos(a * D), s = Math.sin(a * D); return [c * v[0] + s * v[2], v[1], -s * v[0] + c * v[2]]; };
const SEAT = [0, 0, 0];
const feet = { l: { at: [FX, 0, FOOT_Z], pole: [0, 1, 1] }, r: { at: [-FX, 0, FOOT_Z], pole: [0, 1, 1] } };
const base = { root: { at: rootOnSeat(SEAT, -LEAN, H), tilt: -LEAN }, neck: 0, plant: feet };
const L0 = landmarksOf({ ...base, trunk: { flex: 0, yaw: 0 } }, H);
// A hand on each side of the ball, across the ball along the thorax's side-to-side axis turned `a` deg.
const hands = (b, a) => { const d = rotY([R * GRIP_IN, 0, 0], a); return { l: { at: [b[0] + d[0], b[1], b[2] + d[2]], pole: [1, -1, 0] }, r: { at: [b[0] - d[0], b[1], b[2] - d[2]], pole: [-1, -1, 0] } }; };
export const B0 = [0, L0.chest[1] - BALL_DROP, L0.chest[2] + BALL_Z];
export const start = { ...base, trunk: { flex: 0, yaw: 0 }, reach: hands(B0, 0) };
export const B1 = [HIP_HALF + BALL_GAP + R, BALL_LIFT + R, L0['hip.l'][2]];
// The turn: the chest faces the ball: the sternum's forward direction (sternum minus the shoulders' midpoint, level)
// points at the ball's centre (bisection; throws without a bracket).
const facing = (a, B) => { const L = landmarksOf({ ...base, trunk: { flex: 0, yaw: a } }, H), f = [L.sternum[0] - L.shoulders[0], L.sternum[2] - L.shoulders[2]], g = [B[0] - L.sternum[0], B[2] - L.sternum[2]];
  return Math.atan2(f[0], f[1]) - Math.atan2(g[0], g[1]); };
const turnTo = B => { let a = 0, b = 80, fa = facing(a, B); if (!(fa * facing(b, B) <= 0)) throw new Error('russian_twist: no bracket for the turn');
  for (let i = 0; i < 60; i++) { const m = (a + b) / 2, fm = facing(m, B); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } } return (a + b) / 2; };
export const YAW = turnTo(B1);
// The via key (D-LIB21-DRAW, ghosts on the real path): the ball turns out to the side at chest height first, then down
// by the hip, so it passes outside the left thigh, not through it: at the end's side-to-side place, the start's height,
// half way back, the chest facing it.
export const BV = [B1[0], B0[1], (B0[2] + B1[2]) / 2], YAW_V = turnTo(BV);
const via = { ...base, trunk: { flex: 0, yaw: YAW_V }, reach: hands(BV, YAW_V) };
export const end = { ...base, trunk: { flex: 0, yaw: YAW }, reach: hands(B1, YAW) };
// Mistake: the legs set to the end's resolved angles (no plant), the pelvis turned M_YAW about the vertical; the spine
// (trunk flex, yaw and lat, least squares) keeps the shoulders as near their end place as the leaned pivot allows
// (1.5 cm), so the hips and legs swing and the upper body stays.
const QEND = resolve(normPose(end, { height: H }), { height: H }).q;
export const M_YAW = M_YAW_SHARE * YAW;
const LE = landmarksOf(end, H);
const misAt = q => ({ ...end, root: { ...base.root, yaw: M_YAW }, trunk: { flex: q.f, yaw: q.y, lat: q.l }, plant: { l: null, r: null }, hip: QEND.hip, knee: QEND.knee, ankle: QEND.ankle });
export const QM = (() => { const p = { f: 0, y: YAW - M_YAW, l: 0 }, keys = ['f', 'y', 'l'];
  const res = q => { const L = landmarksOf(misAt(q), H); return [0, 1, 2].map(i => L.shoulders[i] - LE.shoulders[i]).concat([L.sternum[0] - LE.sternum[0]]); };
  for (let it = 0; it < 60; it++) { const r = res(p); if (Math.hypot(...r) < 1e-9) break;
    const J = keys.map(k => { const q = { ...p, [k]: p[k] + 1e-4 }; return res(q).map((v, i) => (v - r[i]) / 1e-4); });
    // Gauss-Newton step (normal equations: 3 unknowns, 4 residuals; the leaned pivot moves with the pelvis turn, so the
    // shoulders cannot be held exactly)
    const A = keys.map((_, a) => keys.map((_, b) => J[a].reduce((s, v, i) => s + v * J[b][i], 0))), g = keys.map((_, a) => -J[a].reduce((s, v, i) => s + v * r[i], 0));
    for (let c = 0; c < 3; c++) for (let i = 0; i < 3; i++) if (i !== c) { const k = A[i][c] / A[c][c]; for (let j = 0; j < 3; j++) A[i][j] -= k * A[c][j]; g[i] -= k * g[c]; }
    keys.forEach((k, i) => { p[k] += g[i] / A[i][i]; }); }
  if (!(Math.hypot(...res(p)) < 0.03)) throw new Error('russian_twist: no solution for the Mistake spine'); return p; })();
const misFull = misAt(QM);
export const mistake = { root: misFull.root, trunk: misFull.trunk, plant: misFull.plant, hip: misFull.hip, knee: misFull.knee, ankle: misFull.ankle };
const ballAt = lm => [0, 1, 2].map(i => (lm['grip.l'][i] + lm['grip.r'][i]) / 2);
const mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
/** Winter (2009) whole-body centre of mass on the drawn landmarks (bird_dog.mjs), plus the ball (BALL_KG) at its centre. */
export const BALL_KG = 3;
export function com(lm, ball = ballAt(lm), M = 75) {
  let m = 0; const c = [0, 0, 0];
  const seg = (w, p) => { m += w; for (let i = 0; i < 3; i++) c[i] += w * p[i]; };
  seg(0.081, lm.ear); seg(0.497, mid(lm.shoulders, lm.hips, 0.5));
  for (const s of ['l', 'r']) {
    seg(0.028, mid(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)); seg(0.016, mid(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)); seg(0.006, lm[`grip.${s}`]);
    seg(0.100, mid(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)); seg(0.0465, mid(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)); seg(0.0145, mid(lm[`heel.${s}`], lm[`toe.${s}`], 0.5));
  }
  seg(BALL_KG / M, ball);
  return c.map(v => v / m);
}
/** Balance (D-LIB21-BALANCE, c1, c5): the base from the buttocks (the seat landmark) to the heels (front to back, z)
 *  and between the hips' outer sides (side to side, x); the centre of mass's margins (cm, + inside). */
export function baseOf(pose) {
  const lm = landmarksOf(pose, H), c = com(lm), z0 = lm.seat[2] - 0.05, z1 = Math.max(lm['heel.l'][2], lm['heel.r'][2]);
  return { com: c.map(v => +v.toFixed(3)), z: +(Math.min(c[2] - z0, z1 - c[2]) * 100).toFixed(2), x: +((HIP_HALF - Math.abs(c[0])) * 100).toFixed(2) };
}
export default {
  id: 'russian_twist', name: 'Russian Twist', view: 'front',
  camera: { fit: true, maxScale: 1.35, pitch: CAM_PITCH },
  poses: { start, via: [via], end },
  equipment: [
    { type: 'floor', from: [-0.6, 0, FOOT_Z], to: [0.6, 0, FOOT_Z] },
    ...perItem(lm => medBallOptional({ at: ballAt(lm), pitch: CAM_PITCH, z: 'front' }), MED_BALL_OPT_ITEMS),
  ],
  checks: [
    { landmark: 'seat', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },   // c1, c5: buttocks on the floor
  ],
  startParts: ['ball', 'arm.l'],
  ghosts: { count: 2, parts: ['ball', 'arm.l'] },
  trace: { point: 'grips', trim: [10, 12] },
  callouts: [
    { key: 'back', text: 'Straight back', anchor: { at: 'shoulderTop.r', off: [0, 5] }, cue: 'Lean back slightly with a straight back.' },
    { key: 'hips', text: 'Hips still', anchor: { at: 'hip.r', off: [-14, 0] }, cue: 'Hips and buttocks stay planted as you turn.' },
    { key: 'ball', text: 'Ball to hip', anchor: { at: 'grips', off: [0, 22.5] }, cue: 'The ball travels toward each hip.' },
  ],
  mistake: {
    pose: mistake,
    tells: [
      { key: 'hips', text: 'Knees swing', anchor: { at: 'knee.r', pose: 'mistake', off: [-8.5, -5] }, box: { left: 4, top: 222 }, cue: 'The hips and knees swing with the trunk.' },
    ],
  },
  tempo: [{ phase: 'Turn', s: 1, move: true }, { phase: 'Return', s: 1, move: true }],
  pilot: { drawableFault: 'Top fault: fast, uncontrolled twists (c8), seen only as speed; drawn: the next fault, the hips and knees swinging with the trunk (c4, c5).' },
  alt: 'Russian twist, front view from slightly above. Seated on the floor, knees bent and feet down, leaning back with a straight back, the trunk turns to bring a medicine ball from the chest to beside one hip while the hips and knees stay still.',
};
export const info = { YAW, M_YAW, QM, B0, B1, pose: Object.fromEntries([['start', start], ['end', end], ['mistake', { ...end, ...mistake }]].map(([k, p]) => [k, { base: baseOf(p) }])) };
