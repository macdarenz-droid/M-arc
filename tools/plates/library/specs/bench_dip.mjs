// Bench dip (feet on the floor), side view, figure facing screen right. LIB-17 (LB7, mode H; tier B; census closest
// machine_chest_press, closeness N; the support pose class, anchor one_arm_dumbbell_row (LB3 #274), held until it is
// pinned: plan 2.2:159; the drawable-fault convention, plan 1:85-88; D-LIB17-F7).
// View: side (card plate.view = census view). The depth (c5, c8), the hips close to the bench (c4) and the straight
//  legs with the heels down (c3) read side-on. The top fault, flared elbows (c7), is sideways and this view cannot show
//  it, so the plate draws the next fault (plate.mistake, drawable false; F7 stays raised).
// Sources: research card docs/research/howto/cards/bench_dip.json (research head 8d750bfe): callouts =
//  plate.checkpoints (c5/c8 Elbows at 90, c4 Hips close, c3 Legs out); Mistake = plate.mistake (c8: dropping too low,
//  the upper arms well below level); tempo = the card's tempo (c16, c17: down 2, up 1, pause 1, drawing conventions).
// Clone source: machine_chest_press (the 8, main) for the side-view figure, the bent end elbow and the start phantom
//  pattern; one_arm_dumbbell_row (#274 @ a6f4bd07) for the flat palm on a bench (the engine's LIB-26 hand, the wrist a
//  forearm radius over the pad); copied, never imported (D-LIB9-CLONE).
// Equipment: the vendor `bench`, seen end-on (axis x: the lifter sits on its long side, c1), behind the lifter; floor.
// Pose map (DESIGN.md section 9): identity. Start = plate.start (the top: arms straight, c3, c6; palms flat beside the
//  hips, fingers forward, c1, c2; hips just clear of the edge and close, c3, c4; legs straight, heels on the floor, toes
//  up, c3; shoulder blades back with a slight lean back, c20). End = plate.end (the bottom: elbows about 90 with the
//  upper arm about level, c5, c8; hips close, c4; legs straight, heels down, c3).
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Hands: each wrist WRIST_Y over the pad (one_arm_dumbbell_row's flat palm), the fingertips FINGER_IN in from the
//   bench's front edge, pointing forward (c2); the wrist angle is SOLVED so the hand lies level in every pose; the hands
//   at the shoulder joints' width (c1, c19 "about shoulder-width"); they never move.
//  Arms by joint angles (no IK): the upper arm's world angle from plumb `u` and the elbow bend `e`; the root is placed
//   so the near wrist sits on its bench point. Top: e = 0 (straight, c3), u SOLVED so the buttock clears the bench's
//   front edge by HIP_CLEAR (c3 "slightly forward to clear the edge", c4 "close"). Bottom: u = -90 (the upper arm level,
//   pointing back) and e = 90 (c5): the forearm plumb, the elbow straight over the hand. The Mistake: the upper arm
//   M_FLEX below level, the forearm still plumb (e = 90 + M_FLEX).
//  Legs straight (knee 0, c3, c4), the foot square to the shin (ANKLE, c3 "toes pointing up"). The heels stay where the
//   top pose plants them (c3 "heels on the ground", the feet do not move): in every other pose the pelvis tilt and the
//   hip flexion are SOLVED (bisection) so the near heel sits on that floor point. With the toes up the drawn heel's
//   round back is the lowest point of the foot, so each pose sets the heel point's height that puts the drawn heel on
//   the floor line (the heel point within 1.2 cm of the floor in every pose).
//  Shoulder blades back (c20): the scapulae SCAP_PRO cm back in every pose; the slight lean back at the top (c20): the
//   pelvis tilted TOP_LEAN back.
// Held (DESIGN.md section 14; D-LIB8-shrug, D-LIB17-SIZE, S2): the Trace at the ruled shoulder point measures 10.2 px,
//  under traceLenMin; never enlarged, re-trimmed or moved. Route LIB-ZOOM.
// Camera: the reference scale (fit, capped), the floor line raised to y 300 so the two hip labels sit under it.
// Unsourced numbers (SIZES below; lb7/sizes.json holds each with its basis): BENCH_TOP, BENCH_W, FINGER_IN, HIP_CLEAR,
//  TOP_LEAN, ANKLE, SCAP_PRO, M_FLEX, FLOOR_BACK, FLOOR_FRONT; TOP_U, END_TILT and M_TILT solved. The bends 0 and 90 are
//  c3's and c5's.
import { WINTER, RADII, landmarksOf, normPose, resolve, fk, bodyShapes } from '../engine.mjs';

const H = 1.75;
export const SIZES = Object.freeze({ BENCH_TOP: 0.42, BENCH_W: 0.29, FINGER_IN: 0.01, HIP_CLEAR: 0.08, TOP_LEAN: 5, ANKLE: 0, SCAP_PRO: -3, M_FLEX: 20,
  FLOOR_BACK: 0.15, FLOOR_FRONT: 0.25 });
const { BENCH_TOP, BENCH_W, FINGER_IN, HIP_CLEAR, TOP_LEAN, ANKLE, SCAP_PRO, M_FLEX, FLOOR_BACK, FLOOR_FRONT } = SIZES;

const EDGE_Z = 0;                                                    // the bench's front edge (world origin)
const WRIST_Y = RADII.fore[2] * H;                                   // flat palm: the wrist a forearm radius over the pad
const WRIST = [BENCH_TOP + WRIST_Y, EDGE_Z - FINGER_IN - WINTER.hand * H];   // [y, z] of each wrist
// Bisection on a bracket (throws when the bracket holds no sign change; D-LIB9-CLONE b).
const bisect = (f, a, b) => {
  let fa = f(a);
  if (fa * f(b) > 0) throw new Error(`bench_dip: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 40; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
  return (a + b) / 2;
};
// The body for pelvis tilt t, hip flexion hf, the upper arm's world angle u and the elbow bend e (both sides alike);
// the wrist bent so the hand lies level, fingers forward (the hand's world angle 90 from plumb).
const bodyFor = (t, hf, u, e, root = [0, 0, 0]) => ({ root: { at: root, tilt: t }, trunk: 0, neck: 0, scap: { pro: SCAP_PRO },
  shoulder: { flex: u + t }, elbow: e, wrist: 90 - u - e, hip: { flex: hf }, knee: 0, ankle: ANKLE });
const place = (t, hf, u, e) => {
  const w = landmarksOf(bodyFor(t, hf, u, e), H)['wrist.r'];
  return bodyFor(t, hf, u, e, [0, WRIST[0] - w[1], WRIST[1] - w[2]]);
};
const L = p => landmarksOf(p, H);
// The lowest point of the drawn feet (world m): with the toes up the heel's round back sits under the heel landmark,
// so each pose is solved with the heel landmark at the height that puts the drawn heel on the floor line.
const footLow = pose => { const b = { height: H };
  return Math.min(...bodyShapes(fk(resolve(normPose(pose, b), b).q, b), { view: 'side', near: 'r', facing: 'right', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] })
    .filter(s => /^foot\./.test(s.key) && s.poly).flatMap(s => s.poly.map(p => -p[1] / 1000))); };
const settle = make => { let dy = 0, p = make(dy); for (let k = 0; k < 3; k++) { dy -= footLow(p); p = make(dy); } return p; };
// Top: the hip flexion that puts the heels on the floor, then the arm's slope that clears the buttock off the edge.
const topAt = (u, dy) => place(-TOP_LEAN, bisect(h => L(place(-TOP_LEAN, h, u, 0))['heel.r'][1] - dy, 0, 179), u, 0);
const topU = dy => bisect(u => L(topAt(u, dy)).buttock[2] - (EDGE_Z + HIP_CLEAR), -80, 0);
const start = settle(dy => topAt(topU(dy), dy));
export const TOP_U = start.shoulder.flex - start.root.tilt;
const HEEL_Z = L(start)['heel.r'][2];
// Any other pose: the tilt and hip flexion that keep the near heel on its floor point (legs straight; the feet do not
// slide).
const poseFor = (u, e) => settle(dy => {
  const hfFor = t => bisect(h => L(place(t, h, u, e))['heel.r'][1] - dy, t, 179);
  const t = bisect(tt => L(place(tt, hfFor(tt), u, e))['heel.r'][2] - HEEL_Z, -40, 60);
  return place(t, hfFor(t), u, e);
});
const HEEL = L(start)['heel.r'];
const at = s => poseFor(TOP_U + (-90 - TOP_U) * s, 90 * s);         // s: 0 the top, 1 the bottom
const end = at(1);
const via = [1 / 3, 2 / 3].map(at);
const mistakePose = poseFor(-90 - M_FLEX, 90 + M_FLEX);
export const END_TILT = end.root.tilt, M_TILT = mistakePose.root.tilt;

const LS = L(start), LE = L(end);
// The Mistake arm (13.1; one_arm_dumbbell_row's pattern, #274): the engine masks the Mistake outline inside the faulty
// body, so the red near arm over the red trunk shows only in scraps. Its outer outline (upper arm, elbow cap, forearm)
// is traced as dashed guides, which the engine draws above every figure and the bench.
const inside = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
  const [xi, yi] = poly[i], [xj, yj] = poly[j];
  if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
const probe = { view: 'side', near: 'r', facing: 'right', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
const shapesOf = pose => { const b = { height: H }; return bodyShapes(fk(resolve(normPose(pose, b), b).q, b), probe, { hand: 'flat' }).filter(s => s.poly); };
const outlineRuns = (shapes, keys) => {
  const arm = shapes.filter(s => keys.includes(s.key)), runs = [];
  for (const s of arm) {
    const others = arm.filter(o => o !== s).map(o => o.poly), keep = s.poly.map(p => !others.some(o => inside(p, o)));
    const i0 = keep.indexOf(false);
    if (i0 < 0) { runs.push([...s.poly, s.poly[0]]); continue; }
    let run = [];
    for (let k = 1; k <= s.poly.length; k++) { const i = (i0 + k) % s.poly.length; if (keep[i]) run.push(s.poly[i]); else { if (run.length > 1) runs.push(run); run = []; } }
    if (run.length > 1) runs.push(run);
  }
  return runs.map(r => r.map(([x, y]) => [0, -y / 1000, x / 1000]));
};
export const MIST_ARM = outlineRuns(shapesOf(mistakePose), ['upper.r', 'elbowcap.r', 'fore.r']);

// The elbow bend arc (pull_up's convention: bend from straight): the reference ray is the upper arm extended past the
// elbow in the end pose; the arc runs from it to the wrist.
const UA = [LE['elbow.r'][2] - LE['shoulder.r'][2], LE['elbow.r'][1] - LE['shoulder.r'][1]];
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
const PAD = { point: [0, BENCH_TOP + WRIST_Y, 0], normal: [0, 1, 0] };

export const BD = { wrist: WRIST, heel: HEEL, edgeZ: EDGE_Z, poseFor, at, mistakePose };
export default {
  id: 'bench_dip', name: 'Bench Dip', view: 'side', facing: 'right',
  camera: { fit: true, y0: 300 },
  hand: 'flat',
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: EDGE_Z - BENCH_W - FLOOR_BACK, to: LS['toe.r'][2] + FLOOR_FRONT },
    { type: 'bench', at: [0, BENCH_TOP, EDGE_Z - BENCH_W / 2], axis: 'x', width: BENCH_W, z: 'back' },
  ],
  checks: [
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, plane: PAD, pose: 'all', tol: 0.5 })),            // c2: palms flat on the bench
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: LS[landmark], pose: 'start', tol: 0.5 })),    // c2 facts: the hands on the bench at the start
    ...['heel.l', 'heel.r'].map(landmark => ({ landmark, at: LS[landmark], pose: 'start', tol: 0.5 })),      // c3 facts: the heels on the floor at the start
    // c3: the heels stay down at the bottom (ruled: a check, no end fact): the heel point at its start place along the
    // floor (the feet do not slide) and not under the floor; the drawn heel on the floor line is the drawn-item test
    // (the heel rolls on its round back as the legs pivot, so the heel point rises 0.7 cm while the drawn heel stays down)
    ...['heel.l', 'heel.r'].map(landmark => ({ landmark, plane: { point: LS[landmark], normal: [0, 0, 1] }, pose: 'end', tol: 0.5 })),
    ...['heel.l', 'heel.r'].map(landmark => ({ landmark, above: FLOOR, pose: 'end', tol: 0 })),
    ...['ball.l', 'ball.r', 'toe.l', 'toe.r'].map(landmark => ({ landmark, above: FLOOR, pose: 'all', tol: 0 })),   // toes up, off the floor
  ],
  ghosts: { count: 2, parts: ['trunk', 'arm.r'] },
  trace: { point: 'shoulder.r', trim: [10, 12] },
  // The level line (c5, c8): through the end elbow; the upper arm lies on it at the bottom, and below it in the Mistake.
  datum: [{ y: 'elbow.r', from: { at: 'elbow.r', off: [-14, 0] }, to: { at: 'shoulder.r', off: [30, 0] } }],
  measure: { vertex: 'elbow.r', from: { dir: UA }, to: 'wrist.r', radius: 18, title: 'Elbow', value: 'about 90°', expect: 90, box: { left: 12, top: 150 } },
  callouts: [
    // c5, c8: on the elbow's upper edge, from the open space above the arm
    { key: 'elbows', text: 'Elbows<br>at 90', anchor: { at: 'elbow.r', off: [4, -6] }, box: { left: 54, top: 92 }, cue: 'Lower until your elbows reach about 90 degrees, upper arms level with the floor.' },
    // c4: on the hips' underside (the seat point), from below the floor line, clear of the bench's foot
    { key: 'hips', text: 'Hips close', anchor: { at: 'seat', off: [10, 0] }, box: { left: 160, top: 308 }, cue: 'Keep your hips close to the bench.' },
    // c3: on the shin's upper edge, from the open space above the legs
    { key: 'legs', text: 'Legs out', anchor: { along: ['knee.r', 'ankle.r'], t: 0.5, off: [0, -7] }, box: { left: 284, top: 226 }, cue: 'Keep your legs straight out, heels on the floor.' },
  ],
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Press', s: 1, move: true }, { phase: 'Hold', s: 1 }],
  mistake: {
    pose: mistakePose,
    guides: MIST_ARM.map(pts => ({ kind: 'dashed', pts })),
    tells: [
      // c8: the red hips' underside, below the end figure's, near the floor
      { key: 'low', text: 'Dropping<br>too low', anchor: { at: 'seat', pose: 'mistake', off: [10, 0] }, box: { left: 160, top: 308 }, cue: 'Dropping too low puts too much stress on the shoulders.' },
      // c8: the level line through the elbow (the datum), which the red upper arm sinks below
      { key: 'parallel', text: 'Below<br>parallel', anchor: { at: 'shoulder.r', pose: 'end', off: [26, 0] }, box: { left: 200, top: 128 }, cue: 'The upper arms sink well below level with the floor.' },
    ],
  },
  pilot: { drawableFault: 'Top fault: the elbows flaring out (c7), sideways, which the side view cannot show; the plate draws the next fault on the same list, dropping too low (c8).' },
  zoom: { view: 'normal', k: 3 },
  alt: 'Bench dip, side view. Hands flat on the edge of a bench behind the hips, legs straight out with the heels on the floor, the lifter lowers from straight arms until the elbows are bent about 90 degrees with the upper arms level, hips close to the bench.',
};
