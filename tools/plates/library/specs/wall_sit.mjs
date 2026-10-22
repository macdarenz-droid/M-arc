// Wall sit, side view, figure facing screen right, the wall behind. LIB-14 (LB4, mode H; the hold convention, plank
// pilot A; the `wall` composer's anchor and the wall pose class's only user, plan 2.1:139, 2.2:165).
// View: side (card plate.view = census view). Hip and knee angles (w2), knees over the ankles (w4) and the heel-to-wall
// distance (w8) read only from the side.
// Sources: research card docs/research/howto/cards/wall_sit.json (research head 3812989f): callouts = plate.checkpoints
//  (w5 Back on wall, w4 Knees over ankles, w2/w7 90 degrees); Mistake = plate.mistake (w8, drawable); tempo = the card's
//  w6 hold, "2-5 sets of 30-60-second holds" (one Hold row, the quote's string; no Set or Rest: no quote gives them).
// Clone source: barbell_back_squat (the 8, main) for the feet (mid-soles 38 cm apart, the knee pole on the toe line);
//  plank (#109 @ ff7c5c4f) for the hold convention (entry dashed, held solid; trace on the hips) and its Newton solver,
//  copied, never imported (D-LIB9-CLONE), with a throw when it does not converge.
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Feet planted at mid-foot z = 0, shoulder width (w4: mid-soles 38 cm apart, as the 8's squat), toes out TOE_OUT.
//  Held pose (w2, w4): pelvis upright (tilt 0); root height, root z and lumbar angle SOLVED (Newton) so the knee is 90
//   deg, the knee sits straight over the ankle (shin vertical, w4) and the upper back (backUpper) sits at the buttock's
//   z, so both touch one vertical wall. The hip flexion (femur vs pelvis) follows at 90.3 deg (w2). The wall face is then placed at the buttock (WALL_Z, derived: feet out "as far as needed", w2).
//  Entry pose (w2, w5): standing with the back and buttocks on the same wall, the feet on the same spot; root and lumbar
//   SOLVED so buttock and backUpper touch the wall face and the knee is ENTRY_KNEE (soft).
//  Arms: the hands rest on the thighs in the held pose (the card lists hand position as unsourced; hanging arms put
//   the fists under the seat in the side view).
//  Mistake (w8): feet too close to the wall: both feet FEET_IN nearer the wall, hips and back where they were (same
//   depth, still on the wall), so the knees bend further and travel forward past the toes. A dashed plumb from the
//   faulty knee to the floor lands past the toes (dashed guides only: no solid red part inside the end figure).
// Unsourced numbers: the wall's 1.9 m height and 12 cm thickness (eq/wall.mjs), TOE_OUT 10 (w4 "slightly"),
//  ENTRY_KNEE 15, FEET_IN 0.27 m (the Mistake magnitude, illustrative), the hands resting on the
//  thighs (HAND_T 0.55, HAND_UP 0.09 m; the card lists hand position as unsourced).
import { landmarksOf, normPose, resolve } from '../engine.mjs';
import { wall } from '../eq/wall.mjs';

const H = 1.75, R = Math.PI / 180, B = { height: H };
const FOOT_X = 0.19, TOE_OUT = 10, ENTRY_KNEE = 15, FEET_IN = 0.27, HAND_T = 0.55, HAND_UP = 0.09;
const toe = s => [s * Math.sin(TOE_OUT * R), 0, Math.cos(TOE_OUT * R)];
const pole = () => [0, 0, 1];
const feetAt = (dz, p = false) => ({ l: { at: [FOOT_X, 0, dz], toe: toe(1), ...(p ? { pole: pole() } : {}) }, r: { at: [-FOOT_X, 0, dz], toe: toe(-1), ...(p ? { pole: pole() } : {}) } });

// Newton solve with finite differences (copied from plank, #109 @ ff7c5c4f): params p so res(p) = 0; throws when it
// does not converge (D-LIB9-CLONE).
export function solve(p0, res, iters = 40) {
  const keys = Object.keys(p0); const p = { ...p0 };
  for (let it = 0; it < iters; it++) {
    const r = res(p); if (Math.hypot(...r) < 1e-7) return p;
    const J = keys.map(k => { const d = 1e-5, q = { ...p, [k]: p[k] + d }; return res(q).map((v, i) => (v - r[i]) / d); });
    const n = keys.length, A = Array.from({ length: n }, (_, i) => [...keys.map((_, j) => J[j][i]), -r[i]]);
    for (let c = 0; c < n; c++) {
      let m = c; for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[m][c])) m = i;
      [A[c], A[m]] = [A[m], A[c]];
      for (let i = 0; i < n; i++) if (i !== c) { const k = A[i][c] / A[c][c]; for (let j = c; j <= n; j++) A[i][j] -= k * A[c][j]; }
    }
    keys.forEach((k, i) => { p[k] += A[i][n] / A[i][i]; });
  }
  throw new Error(`wall_sit: no solution from ${JSON.stringify(p0)}`);
}

const pose = (q, dz = 0, p = false) => ({ root: { at: [0, q.y, q.z], tilt: 0 }, trunk: q.trunk, neck: -q.trunk, plant: feetAt(dz, p), shoulder: 0, elbow: 5 });
const angles = p => resolve(normPose(p, B), B).q;

// Held pose: knee 90 (w2), the knee straight over the ankle in the side view (w4), backUpper at the buttock's z (back
// flat on one wall, w4, w5). The hip flexion follows: 90.3 deg (w2; report angles).
const HQ = solve({ y: 0.5, z: -0.45, trunk: 0 }, q => {
  const p = pose(q), l = landmarksOf(p, H);
  return [(angles(p).knee.r - 90) / 90, l['knee.r'][2] - l['ankle.r'][2], l.backUpper[2] - l.buttock[2]];
});
const HELD = pose(HQ), LH = landmarksOf(HELD, H);
// Hands rest on the thighs in the held pose (IK: the grip HAND_T of the way from hip to knee, HAND_UP above the joint
// line); the entry's arms are not drawn (startParts).
const handOn = s => { const h = LH[`hip.${s}`], k = LH[`knee.${s}`]; return { at: [h[0] + (k[0] - h[0]) * HAND_T, h[1] + (k[1] - h[1]) * HAND_T + HAND_UP, h[2] + (k[2] - h[2]) * HAND_T], pole: [0, -0.3, -1] }; };
const end = { ...HELD, reach: { l: handOn('l'), r: handOn('r') } };
export const WALL_Z = landmarksOf(end, H).buttock[2];
// Entry: buttock and backUpper on the wall face, the knee ENTRY_KNEE, same feet. The buttock moves only with the
// pelvis (tilt 0), so the root z is the wall less its offset; the lumbar angle (bracket -20..20 deg) puts backUpper on
// the wall; the root height (bracket 0.70..0.86 m) gives the knee.
export const bracket = (f, a, b) => {   // Illinois regula falsi (copied from one_arm_dumbbell_row, #274): throws on a bracket with no root
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`wall_sit: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-8; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const BUTT_DZ = landmarksOf(pose({ y: 0.8, z: 0, trunk: 0 }), H).buttock[2];
const E_TRUNK = bracket(t => { const l = landmarksOf(pose({ y: 0.8, z: 0, trunk: t }), H); return l.backUpper[2] - l.buttock[2]; }, -20, 20);
const E_Y = bracket(y => angles(pose({ y, z: WALL_Z - BUTT_DZ, trunk: E_TRUNK })).knee.r - ENTRY_KNEE, 0.70, 0.86);
const EQ = { y: E_Y, z: WALL_Z - BUTT_DZ, trunk: E_TRUNK };
const start = pose(EQ);
// Mistake (w8): feet FEET_IN nearer the wall; hips, pelvis and back as held (same depth, still on the wall), so the
// knees bend further (115 deg) and travel forward, 5.7 cm past the toes. Knee pole straight ahead (keeps the foot
// contact at 0.2 cm).
const mistakePose = { plant: feetAt(-FEET_IN, true) };
const LM = landmarksOf({ ...end, ...mistakePose }, H), LE = landmarksOf(end, H);
const SHANK_EXT = [LE['knee.r'][2] - LE['ankle.r'][2], LE['knee.r'][1] - LE['ankle.r'][1]];
export const wsInfo = { held: HQ, entry: EQ, wallZ: WALL_Z, kneeZ: LE['knee.r'][2], ankleZ: LE['ankle.r'][2], mKneeZ: LM['knee.r'][2], toeZ: LE['toe.r'][2], mToeZ: LM['toe.r'][2] };

const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] }, WALLP = { point: [0, 0, WALL_Z], normal: [0, 0, 1] };
export default {
  id: 'wall_sit', name: 'Wall Sit', view: 'side', facing: 'right',
  camera: { x0: 196, y0: 339 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: WALL_Z, to: 0.75 },
    wall({ face: WALL_Z }),
  ],
  checks: [
    { landmark: 'heel.r', plane: FLOOR, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: FLOOR, pose: 'all', tol: 0.5 },
    { landmark: 'backUpper', plane: WALLP, pose: 'all', tol: 0.5 },
    { landmark: 'buttock', plane: WALLP, pose: 'all', tol: 0.5 },
  ],
  startParts: ['trunk', 'leg.r'],
  ghosts: { count: 2, parts: ['trunk', 'leg.r'] },
  trace: { point: 'hip.r', trim: [8, 10] },
  // The knee-over-ankle plumb (w4), correct plate only (as the 8's shin line): in the Mistake the faulty knee's own red
  // plumb and the floor gap to the toes carry the fault.
  datum: [{ x: [0, 0, LE['ankle.r'][2]], from: 349, to: 230, mistake: false }],
  // w2: the knee arc, from the shin line extended past the knee to the thigh (the 8's knee measure), expect 90.
  measure: { vertex: 'knee.r', from: { dir: SHANK_EXT }, to: 'hip.r', radius: 22, title: 'Knee', value: 'about 90°', expect: 90, box: { left: 230, top: 202 } },
  callouts: [
    { key: 'back', text: 'Back on wall', anchor: 'backUpper', box: { left: 140, top: 164 }, cue: 'Keep your back and buttocks on the wall.' },
    { key: 'knees', text: 'Knees over<br>ankles', anchor: 'knee.r', box: { left: 226, top: 302 }, cue: 'Keep your shins vertical, knees right above the ankles.' },
    { key: 'deg', text: '90 degrees', anchor: 'thighTop.r', box: { left: 236, top: 246 }, cue: 'Slide down until your hips and knees are at about 90 degrees.' },
  ],
  tempo: [{ phase: 'Hold', s: '30-60' }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: [{ at: 'knee.r', pose: 'mistake' }, [0, 0, LM['knee.r'][2]]] },
      { kind: 'dashed', pts: [[0, 0.004, LM['toe.r'][2]], [0, 0.004, LM['knee.r'][2]]] },   // the floor gap: toes to the knee's plumb
    ],
    tells: [
      { key: 'feet', text: 'Feet too<br>close', anchor: { at: 'toe.r', pose: 'mistake' }, box: { left: 236, top: 284 }, cue: 'The feet sit too close to the wall.' },
      { key: 'knees', text: 'Knees past<br>toes', anchor: { at: 'knee.r', pose: 'mistake' }, box: { left: 236, top: 222 }, cue: 'The knees push forward past the toes.' },
    ],
  },
  alt: 'Wall sit, side view. From standing with the back and buttocks on a wall and the feet out in front, the lifter slides down and holds with hips and knees at about 90 degrees, shins vertical with the knees over the ankles, back flat on the wall.',
};
