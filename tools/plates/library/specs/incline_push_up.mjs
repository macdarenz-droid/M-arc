// Incline Push-Up, side view, figure facing screen right (head right, feet left), hands on a flat bench's near top edge,
// toes on the floor. H (D-LIB17R3-MODES: the hand surface and the body angle are not PARAMS keys; no template).
// View: SIDE (card plate.view = census view): the body line (c2, c3), the body angle the feet set (c1) and the shrugged
// shoulders of the Mistake (c10) read in the sagittal plane.
// Clone source (D-LIB9-CLONE): push_up (pilot B, tests/howto/golden/library/pilot-b.json), copied, never imported: the
// Newton solve (throws when it does not converge), the straight body on the toe tips, the flat palm (LIB-26), the flared
// bottom arm solved for the wrist spot and a level hand, the plank-line datum, the floor camera (D-LIB8-floor).
// Sources: research card docs/research/howto/cards/incline_push_up.json (research head a48b0594), claims c1 (hands on top
// of a sturdy bench about shoulder-width, the feet walked back until the body is about 45 degrees to the floor), c2
// (one straight line head to heels, shoulders back and down), c3 (lower until the chest nearly touches the bench, about
// an inch away), c4 (elbows about 45 degrees from the body), c5 (gaze ahead), c9 (tempo 3 down, 3 up), c10 (the Mistake:
// the feet too close to the bench leave the shoulder blades raised in a shrug).
// Pose map (D-LIB11 pose map, push_up's): spec `start` = card plate.end (bottom, chest an inch over the bench edge) and
//  spec `end` = card plate.start (top, arms straight). The Mistake is drawn as end pose + override (plate.mjs:78): the
//  feet walked in and the shoulders shrugged at the top (c10: "even at the top"). The tempo follows the drawn start:
//  Press, then Lower.
// Geometry decisions:
//  - Bottom (spec start, c3, c4): the straight body (trunk, hip, knee 0) on the toe tips with the chest landmark
//    CHEST_GAP over the bench top and CHEST_IN past its near edge (over the edge, c3's "chest about an inch above the
//    bench edge"); the toe spot is solved from it. The hands stay on their bench spots (the wrist HAND_IN past the
//    edge, palm flat and level, fingers forward); the elbows aim out and back (ELBOW_BACK solved so sh.elev is 45 at the bottom, c4).
//  - Top (spec end, c1, c7): the same toe spot, arms straight (elbow 0), the wrist on its spot and the palm level;
//    root, tilt, shoulder flexion and wrist solved. The body angle (toe tip to shoulder) is an output of the bench
//    height, and BENCH_TOP is SOLVED so it is c1's 45 degrees (D-LIB17R3-BENCH; bisection on a bracket, throws without
//    a root).
//  - Mistake (c10): from the top, the toe spot moves M_FEET_IN toward the bench and the scapulae rise M_SHRUG cm; arms
//    straight, wrists on their spots, root solved. The body is steeper; the shrug alone is under the size bar, so the
//    first tell is on the feet (the cause c10 names).
// Unsourced numbers (no card claim gives them; listed in lb7/sizes.json with their basis): HAND_IN, CHEST_GAP's drawn
//  value of "about an inch", CHEST_IN, BOTTOM_ELEV (c4's 45 degrees), M_FEET_IN, M_SHRUG, the floor run, LINE_RUN; BENCH_TOP is solved
//  (c1's 45 degrees; c1 "sturdy bench, box or platform" and c14 fix no height).
import { landmarksOf, RADII, normPose, resolve } from '../engine.mjs';

const H = 1.75;
export const SIZES = Object.freeze({ BENCH_W: 0.29, HAND_IN: 0.02, CHEST_GAP: 0.025, CHEST_IN: 0.02, BODY_DEG: 45, M_FEET_IN: 0.2, M_SHRUG: 4, BOTTOM_ELEV: 45,
  FLOOR_BACK: 0.15, FLOOR_FRONT: 0.12, LINE_RUN: 0.18 });
const { BENCH_W, HAND_IN, CHEST_GAP, CHEST_IN, BODY_DEG, M_FEET_IN, M_SHRUG, BOTTOM_ELEV, FLOOR_BACK, FLOOR_FRONT, LINE_RUN } = SIZES;
// The bottom elbow aim (x outward per side): out and back, [1, 0, -ELBOW_BACK], ELBOW_BACK solved so the upper arm
// stands 45 deg from the trunk (sh.elev, PANELS.md 7) at the bottom: c4 "Keep your elbows at approximately 45 degrees
// from your body" (D-CFSMALL-ELEV, #356 6547986860).
const WRIST_Y = RADII.fore[2] * H;            // flat palm (LIB-26): the wrist the forearm's distal radius over the pad
const EDGE_Z = 0;                              // the bench's near top edge (world origin)
const R2D = 180 / Math.PI;

/** Newton with finite differences (copied from push_up.mjs, pilot B); throws when it does not converge. */
function solve(p0, make, res, iters = 40) {
  const keys = Object.keys(p0); const p = { ...p0 };
  const f = q => res(landmarksOf(make(q), H));
  for (let it = 0; it < iters; it++) {
    const r = f(p); if (Math.hypot(...r) < 1e-6) return p;
    const J = keys.map(k => { const d = 1e-5, q = { ...p, [k]: p[k] + d }; return f(q).map((v, i) => (v - r[i]) / d); });
    const n = keys.length, A = Array.from({ length: n }, (_, i) => [...keys.map((_, j) => J[j][i]), -r[i]]);
    for (let c = 0; c < n; c++) {
      let m = c; for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[m][c])) m = i;
      [A[c], A[m]] = [A[m], A[c]];
      for (let i = 0; i < n; i++) if (i !== c) { const k = A[i][c] / A[c][c]; for (let j = c; j <= n; j++) A[i][j] -= k * A[c][j]; }
    }
    keys.forEach((k, i) => { p[k] += A[i][n] / A[i][i]; });
  }
  if (Math.hypot(...f(p)) >= 1e-6) throw new Error('incline_push_up: the solve did not converge');
  return p;
}
// Bisection on a bracket (throws when the bracket holds no sign change).
const bisect = (f, a, b) => {
  let fa = f(a);
  if (fa * f(b) > 0) throw new Error(`incline_push_up: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 50; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
  return (a + b) / 2;
};

// The straight body: root, tilt; straight arms at shoulder flexion f with the wrist w (when f is given).
const body = q => ({ root: { at: [0, q.y, q.z], tilt: q.tilt }, trunk: 0, neck: 0, scap: { elev: q.elev ?? 0 }, wrist: q.w ?? 90, hip: 0, knee: 0, ankle: 0,
  ...(q.f != null ? { shoulder: { flex: q.f }, elbow: 0 } : {}) });
const bottomRoot = top => solve({ y: top + 0.1, z: -0.3, tilt: 75 }, body,
  lm => [lm.chest[1] - (top + CHEST_GAP), lm.chest[2] - (EDGE_Z + CHEST_IN), lm['toe.r'][1]]);
const straightArms = (top, toeZ, elev = 0, p0 = { y: top + 0.3, z: -0.35, tilt: 55, f: 55, w: 70 }) => solve(p0, q => body({ ...q, elev }),
  lm => [lm['wrist.r'][1] - (top + WRIST_Y), lm['wrist.r'][2] - (EDGE_Z + HAND_IN), lm['toe.r'][1], lm['toe.r'][2] - toeZ, lm['grip.r'][1] - lm['wrist.r'][1]]);
const bodyDeg = lm => Math.atan2(lm['shoulder.r'][1] - lm['toe.r'][1], lm['shoulder.r'][2] - lm['toe.r'][2]) * R2D;
const topFor = top => { const BQ = bottomRoot(top), toeZ = landmarksOf(body(BQ), H)['toe.r'][2], TQ = straightArms(top, toeZ); return { BQ, toeZ, TQ }; };
/** The bench top height (m): SOLVED so the top's toe-to-shoulder line is c1's 45 degrees (D-LIB17R3-BENCH). */
export const BENCH_TOP = +bisect(h => bodyDeg(landmarksOf(body(topFor(h).TQ), H)) - BODY_DEG, 0.3, 0.55).toFixed(4);
const { BQ, toeZ: TOE_Z, TQ } = topFor(BENCH_TOP);
export const TOE_Z_SOLVED = +TOE_Z.toFixed(4);
const top = body(TQ);
const lmT = landmarksOf(top, H);
const GRIP = lmT['grip.r'], WT = lmT['wrist.r'];
// Bottom: the flared arm turns the forearm's bend plane, so the wrist is held on its spot and the hand level, solved
// for the grip target and the wrist angle (push_up's method).
const flaredWith = pole => p => ({ ...body({ ...BQ, w: p.w }), reach: { r: { at: [p.x, p.y, p.z], pole: [-pole[0], pole[1], pole[2]] }, l: { at: [-p.x, p.y, p.z], pole } } });
const bottomWith = k => { const f = flaredWith([1, 0, -k]); return f(solve({ x: GRIP[0], y: GRIP[1], z: GRIP[2], w: 30 }, f, lm => [...lm['wrist.r'].map((v, i) => v - WT[i]), lm['grip.r'][1] - GRIP[1]])); };
const elevOf = pose => resolve(normPose(pose, { height: H }), { height: H }).q.sh.r.elev;
export const ELBOW_BACK = +bisect(k => elevOf(bottomWith(k)) - BOTTOM_ELEV, 0.3, 1.0).toFixed(4);
const bottom = bottomWith(ELBOW_BACK);
// Mistake (c10): the toe spot M_FEET_IN closer to the bench, the scapulae raised M_SHRUG cm; arms straight, wrists on
// their spots.
const MQ = straightArms(BENCH_TOP, TOE_Z + M_FEET_IN, M_SHRUG, TQ);
const MISTAKE = body({ ...MQ, elev: M_SHRUG });

const start = bottom, end = top;
const lmB = landmarksOf(bottom, H), lmM = landmarksOf(MISTAKE, H);
// The plank line (datum): shoulder to heel of the top pose, run LINE_RUN m past each end (push_up's).
const LINE = (() => { const a = lmT['shoulder.r'], b = lmT['heel.r'], d = b.map((v, i) => v - a[i]), n = Math.hypot(...d);
  return [a.map((v, i) => v - d[i] / n * LINE_RUN), b.map((v, i) => v + d[i] / n * LINE_RUN)]; })();
const ang3 = (a, v, b) => { const u = a.map((x, i) => x - v[i]), w = b.map((x, i) => x - v[i]); return Math.acos(u.reduce((s, x, i) => s + x * w[i], 0) / Math.hypot(...u) / Math.hypot(...w)) * R2D; };
export const info = () => ({ benchTop: BENCH_TOP, toeZ: TOE_Z_SOLVED, topBodyDeg: +bodyDeg(lmT).toFixed(2), mistakeBodyDeg: +bodyDeg(lmM).toFixed(2),
  topArmFromPlumb: +(TQ.f - TQ.tilt).toFixed(1), chestOverTopCm: +((lmB.chest[1] - BENCH_TOP) * 100).toFixed(2), chestPastEdgeCm: +((lmB.chest[2] - EDGE_Z) * 100).toFixed(2),
  bottomElbowToTrunk: +ang3(lmB['elbow.r'], lmB['shoulder.r'], lmB['hip.r']).toFixed(1), bottomWrist: +bottom.wrist.toFixed(1),
  headOverTopCm: +((Math.min(lmB.head[1], lmB.chin[1]) - BENCH_TOP) * 100).toFixed(1) });

export default {
  hand: 'flat',
  id: 'incline_push_up', name: 'Incline Push-Up', view: 'side', facing: 'right',
  camera: { fit: { right: 76 }, maxScale: 0.988, y0: 339 },   // push_up's floor camera (D-LIB8-floor) at push_up's scale (144.5 px/m)
  poses: { start, end },
  equipment: [
    { type: 'floor', from: TOE_Z - FLOOR_BACK, to: EDGE_Z + BENCH_W + FLOOR_FRONT },
    { type: 'bench', at: [0, BENCH_TOP, EDGE_Z + BENCH_W / 2], axis: 'x', width: BENCH_W, z: 'back' },
  ],
  checks: [
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, plane: { point: [0, BENCH_TOP + WRIST_Y, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 })),   // palms flat on the bench (c1)
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, plane: { point: [0, 0, EDGE_Z + HAND_IN], normal: [0, 0, 1] }, pose: 'all', tol: 0.5 })),      // at its near edge (c1)
    { landmark: 'toe.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },                                                       // on the toes (c2)
    { landmark: 'chest', plane: { point: [0, BENCH_TOP + CHEST_GAP, 0], normal: [0, 1, 0] }, pose: 'start', tol: 0.5 },                                 // chest an inch over the bench (c3)
  ],
  startParts: ['torso', 'leg.r', 'leg.l', 'arm.r'],
  ghosts: { count: 2, parts: ['arm.r'] },
  trace: { point: 'sternum', trim: [8, 10] },
  datum: [{ x: 0, from: 0, to: 0, line: LINE }],
  callouts: [
    { key: 'line', text: 'Straight line', anchor: 'backUpper', box: { left: 16, top: 150 }, cue: 'Keep your head, hips and heels in one line.' },
    { key: 'shoulders', text: 'Shoulders<br>down', anchor: { at: 'trap.r', pose: 'end', off: [0, -13] }, box: { left: 150, top: 76 }, cue: 'Keep your shoulders down and away from your ears.' },
    { key: 'chest', text: 'Chest<br>to bench', anchor: { at: 'sternum', pose: 'start' }, box: { left: 282, top: 232 }, cue: 'Lower until your chest is just short of the bench.' },
  ],
  mistake: {
    pose: MISTAKE,
    guides: [
      { kind: 'arrow', from: { at: 'toe.r', pose: 'end', off: [8, -12] }, to: { at: 'toe.r', pose: 'mistake', off: [8, -12] } },
    ],
    tells: [
      { key: 'feet', text: 'Feet too close', anchor: { at: 'heel.r', pose: 'mistake' }, box: { left: 86, top: 304 }, cue: 'Your feet are too close to the bench.' },
      { key: 'shrug', text: 'Shoulders<br>shrug', anchor: { at: 'shoulder.r', pose: 'mistake', off: [12, 2] }, box: { left: 268, top: 172 }, cue: 'Your shoulder blades stay raised toward your ears.' },
    ],
  },
  tempo: [{ phase: 'Press', s: 3, move: true }, { phase: 'Lower', s: 3, move: true }],
  alt: 'Incline push-up, side view. Hands flat on the edge of a bench, body straight on the toes at about 45 degrees, the lifter presses from the chest just over the bench to straight arms.',
};
