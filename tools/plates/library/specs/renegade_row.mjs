// Renegade row (high plank on two hex dumbbells, one-arm row), side view, figure facing screen right (head right, feet
// left), face down. LIB-17 (LB7, mode H; tier A; census closest seated_cable_row, closeness N; the plank pose class,
// anchors plank (pilot A) and push_up (pilot B), both held until pinned: plan 2.2:154, D-LIB17-PILOTB).
// Held off rows.json, the page, QA and the critic under D-LIB14-NOSECS (D-LIB17-SECS): the card's tempo is null (LR-33),
//  so this spec carries no tempo; its renders come only from lb7/build.mjs --held.
// View: side (card plate.view = census view). The straight line head to heels, the row to the ribs and the dumbbell
//  set back down on a flat side or on a corner (c3, c4, c9) read side-on.
// Sources: research card docs/research/howto/cards/renegade_row.json (research head 8d750bfe): callouts =
//  plate.checkpoints (c2/c3 Straight line, c1 Feet wide, c4/c5 Row to ribs); Mistake = plate.mistake (c9: the dumbbell
//  lowered too quickly lands on a corner, drawable, a still sign); plate.frames: one row, the Trace follows the near
//  dumbbell.
// Clone source: plank (#109 @ ff7c5c4f) for the straight-body solve (Newton, finite differences) and the shoulder-heel
//  datum; seated_cable_row (the 8, main) for the row's elbow driven back; dumbbell_biceps_curl (#109) for the engine
//  dumbbell (axis default: the hex end-on in side view). Copied, never imported (D-LIB9-CLONE).
// Equipment: two vendor `dumbbell`s (hex heads, c6), each flat on the floor under its hand; floor. The Mistake's
//  dumbbell, turned onto a corner, is drawn here from `poly` (the vendor primitive draws its end-on hex at one fixed
//  turn, equipment.mjs:33-35; S1's likeliest case, drawn).
// Pose map (DESIGN.md section 9): start = plate.start (both hands on the dumbbells, c1, c2, c6; straight line, c3).
//  End = plate.end (the near dumbbell at the ribcage, c4, c5; the far arm straight; the body line unchanged, c3, c14).
//  Mistake (proposed, DESIGN.md section 9; the supervisor rules the pose it is compared with): the fault happens as the
//  dumbbell returns to the floor (c9), so the Mistake pose is the near arm back down with the dumbbell landing on a
//  corner, compared with the far dumbbell, which sits flat on the floor in the same side-view place.
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Dumbbells: each grip centre on its dumbbell's axis, the hex flat on the floor (axis APOTHEM above it), straight under
//   its shoulder (c2 "hands under the shoulders"), at the shoulder joints' width (c1 "shoulder-width apart").
//  Plank: arms straight and plumb (shoulder joint ARM over the grip), the body one straight line shoulders to heels
//   (trunk, hip, knee 0, neck 0: c2, c3), toes tucked on the floor (ankle ANKLE, the toe tip on the floor at TOE_Z);
//   root and pelvis tilt SOLVED (plank's Newton solve) so the shoulder sits over the grip and the toe tip on the floor.
//  Row (c4, c5): the near grip END_BACK behind the shoulder joint along the body and at the shoulder joints' height,
//   beside the lower ribs; the elbow IK pole up and back (the elbow close to the body, driven back).
//  Mistake (c9): the near grip back on the floor line under the shoulder, the dumbbell turned M_TURN onto a corner (the
//   axis CIRCUM above the floor, the corner on it).
// Unsourced numbers (SIZES below; lb7/sizes.json holds each with its basis): DB_X, ANKLE, TOE_Z, END_BACK, END_OUT,
//  M_TURN, FLOOR_BACK, FLOOR_FRONT, LINE_RUN; the hex sizes are the vendor dumbbell's (equipment.mjs:30).
import { WINTER, REF, landmarksOf } from '../engine.mjs';

const H = 1.75;
export const SIZES = Object.freeze({ DB_X: 0.2266, ANKLE: 0, TOE_Z: -1.25, END_BACK: 0.21, END_OUT: 0.08, M_TURN: 30, FLOOR_BACK: 0.12, FLOOR_FRONT: 0.30, LINE_RUN: 0.22 });
const { DB_X, ANKLE, TOE_Z, END_BACK, END_OUT, M_TURN, FLOOR_BACK, FLOOR_FRONT, LINE_RUN } = SIZES;
const HEAD = 0.119;                                     // vendor dumbbell head across the corners (equipment.mjs:30)
const CIRCUM = HEAD / 2, APOTHEM = CIRCUM * Math.cos(Math.PI / 6);
const ARM = (WINTER.upperArm + WINTER.forearm + REF.gripOff) * H - 0.0001;   // straight arm, shoulder to grip centre
const GRIP_Y = APOTHEM, SH_Y = GRIP_Y + ARM;

// Newton solve with finite differences (copied from plank.mjs @ ff7c5c4f): params p so residuals(pose(p)) = 0.
function solveN(p0, make, res, iters = 30) {
  const keys = Object.keys(p0); let p = { ...p0 };
  const f = q => res(landmarksOf(make(q), H));
  for (let it = 0; it < iters; it++) {
    const r = f(p); if (Math.hypot(...r) < 1e-6) break;
    const J = keys.map(k => { const d = 1e-5, q = { ...p, [k]: p[k] + d }; return f(q).map((v, i) => (v - r[i]) / d); });
    const n = keys.length, A = Array.from({ length: n }, (_, i) => [...keys.map((_, j) => J[j][i]), -r[i]]);
    for (let c = 0; c < n; c++) {
      let m = c; for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[m][c])) m = i;
      [A[c], A[m]] = [A[m], A[c]];
      if (Math.abs(A[c][c]) < 1e-12) throw new Error('renegade_row: singular solve');
      for (let i = 0; i < n; i++) if (i !== c) { const k = A[i][c] / A[c][c]; for (let j = c; j <= n; j++) A[i][j] -= k * A[c][j]; }
    }
    keys.forEach((k, i) => { p[k] += A[i][n] / A[i][i]; });
  }
  if (Math.hypot(...f(p)) > 1e-5) throw new Error('renegade_row: the plank solve did not converge');
  return p;
}

// The body: one straight line (trunk, hips, knees 0), arms flexed 90 so they hang plumb from the horizontal trunk.
const bodyOf = q => ({ root: { at: [0, q.y, q.z], tilt: q.tilt }, trunk: 0, neck: 0, hip: 0, knee: 0, ankle: ANKLE, shoulder: { flex: 90 }, elbow: 0 });
const HQ = solveN({ y: 0.4, z: -0.3, tilt: 75 }, bodyOf, lm => [lm['shoulder.r'][1] - SH_Y, lm['toe.r'][1], lm['toe.r'][2] - TOE_Z]);
const BODY = bodyOf(HQ);
const SH = landmarksOf(BODY, H)['shoulder.r'];
const GZ = SH[2];
export const DB = { l: [DB_X, GRIP_Y, GZ], r: [-DB_X, GRIP_Y, GZ] };
const down = [0, -1, 0];
const start = { ...BODY, reach: { l: { at: DB.l, pole: [0, 0, 1] }, r: { at: DB.r, pole: [0, 0, 1] } } };
// End (c4, c5): the near dumbbell beside the lower ribs, END_BACK behind the shoulder joint (the trunk is level, so
// along z), at the shoulder joints' height, END_OUT outside the shoulder joint so the inner head clears the ribs.
const LB = landmarksOf(start, H);
const END_GRIP = [-(DB_X + END_OUT), LB['shoulder.r'][1], GZ - END_BACK];
const end = { ...start, reach: { l: start.reach.l, r: { at: END_GRIP, pole: [0, 1, -0.4] } } };
// Mistake (c9): the near dumbbell landing on a corner, its axis CIRCUM above the floor straight under the shoulder.
const M_GRIP = [-DB_X, CIRCUM, GZ];
const mistakePose = { reach: { l: start.reach.l, r: { at: M_GRIP, pole: [0, 0, 1] } } };

// The Mistake dumbbell's end-on hex, turned M_TURN from flat (a corner straight down on the floor), and its axle core,
// as `poly` (world points in the side-view plane at the grip): the same sizes as the vendor primitive.
const hexAt = (c, r, turn) => [0, 60, 120, 180, 240, 300].map(a => [c[0], c[1] + r * Math.sin((a + turn) * Math.PI / 180), c[2] + r * Math.cos((a + turn) * Math.PI / 180)]);
export const M_HEX = hexAt(M_GRIP, CIRCUM, M_TURN);   // the vendor hex has flats top and bottom; turned 30, a vertex points straight down
const M_CORE = Array.from({ length: 12 }, (_, k) => [M_GRIP[0], M_GRIP[1] + 0.0158 * Math.sin(k * Math.PI / 6), M_GRIP[2] + 0.0158 * Math.cos(k * Math.PI / 6)]);
export const CORNER = M_HEX.reduce((a, p) => (p[1] < a[1] ? p : a));   // the vertex on the floor; the tell sits on the next corner up (M_HEX[0]), clear of the flat hex

// The plank line (datum, plank.mjs's): shoulder to heel of the held pose, run LINE_RUN past each end.
const LINE = (() => {
  const lm = landmarksOf(start, H), a = lm['shoulder.r'], b = lm['heel.r'], d = b.map((v, i) => v - a[i]), n = Math.hypot(...d);
  return [a.map((v, i) => v - d[i] / n * LINE_RUN), b.map((v, i) => v + d[i] / n * LINE_RUN)];
})();
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };

export const RR = { db: DB, endGrip: END_GRIP, mGrip: M_GRIP, corner: CORNER, apothem: APOTHEM, circum: CIRCUM, gz: GZ };
export default {
  id: 'renegade_row', name: 'Renegade Row', view: 'side', facing: 'right',
  camera: { x0: 236, y0: 339 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: TOE_Z - FLOOR_BACK, to: GZ + FLOOR_FRONT },
    { type: 'dumbbell', at: DB.l, z: 'back', part: 'farBell' },                                       // far hand's dumbbell, flat (c6)
    (lm, ctx) => (ctx.pose === 'mistake' ? null : { type: 'dumbbell', at: lm['grip.r'], part: 'arm.r' }),
    (lm, ctx) => (ctx.pose === 'mistake' ? { type: 'poly', pts: M_HEX, cls: 'disc', z: 'front', part: 'arm.r' } : null),
    (lm, ctx) => (ctx.pose === 'mistake' ? { type: 'poly', pts: M_CORE, cls: 'disc-core', z: 'front', part: 'arm.r' } : null),
  ],
  checks: [
    { landmark: 'toe.r', plane: FLOOR, pose: 'all', tol: 0.5 },                                     // toes on the floor
    { landmark: 'grip.l', at: DB.l, pose: 'all', tol: 0.5 },                                        // c1: the far hand on its dumbbell
    { landmark: 'grip.r', at: DB.r, pose: 'start', tol: 0.5 },                                      // c1: the near hand on its dumbbell
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: landmarksOf(start, H)[landmark], pose: 'start', tol: 0.5 })),   // c1 facts
    { landmark: 'shoulder.r', plane: { point: [0, 0, GZ], normal: [0, 0, 1] }, pose: 'all', tol: 0.5 },   // c2: hands under the shoulders
  ],
  startParts: ['arm.r'],
  ghosts: { count: 2, parts: ['arm.r'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  datum: [{ x: 0, from: 0, to: 0, line: LINE }],
  callouts: [
    { key: 'line', text: 'Straight<br>line', anchor: 'buttock', box: { left: 76, top: 206 }, cue: 'Keep one straight line from your head to your heels.' },
    { key: 'feet', text: 'Feet wide', anchor: 'heel.r', cue: 'Set your feet wider than hip-width for a steady base.' },
    { key: 'row', text: 'Row to<br>ribs', anchor: { at: 'grip.r', off: [0, -7] }, box: { left: 120, top: 160 }, cue: 'Row the dumbbell to your ribcage, elbow close to your body.' },
  ],
  tempo: [{ phase: 'Row', move: true }, { phase: 'Lower', move: true, word: 'Controlled' }],
  mistake: {
    pose: mistakePose,
    guides: [],
    tells: [
      // one tell (D-LIB10-SKULL1 record, DESIGN.md section 9): c9 states the corner landing and no second sign
      { key: 'corner', text: 'Lands on<br>a corner', anchor: M_HEX[0], box: { left: 256, top: 286 }, cue: 'The dumbbell comes down too fast and lands on a corner.' },
    ],
  },
  alt: 'Renegade row, side view. In a high plank on two hex dumbbells, hands under the shoulders, body straight from head to heels, the lifter rows one dumbbell to the ribcage, elbow close to the body, and sets it back down flat.',
};
