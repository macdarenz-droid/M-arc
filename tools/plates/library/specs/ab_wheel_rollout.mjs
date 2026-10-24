// Ab wheel rollout (kneeling), side view, figure facing screen right (the wheel rolls out to the right). LIB-21 (LB9,
//  H, tier A; the `abWheel` composer's anchor).
// View: side (card plate.view = census): the knees-to-head line (c2), the low-back arch (c3) and the roll distance (c7)
//  are sagittal.
// Sources: research card docs/research/howto/cards/ab_wheel_rollout.json (research head f574bb4b): c1 kneel on a soft
//  pad, hands on the wheel about shoulder-width, the wheel on the floor just in front of the knees; c2 brace, roll
//  forward slowly until the body is a straight line from knees to head, back straight the whole time; c3 as the arms
//  reach forward overhead and the chest sinks toward the floor, the low back does not arch (the Mistake); c4 roll back
//  with control; c7 kneeling is the easier version, a short roll-out first (the end is a moderate roll-out); c14 the
//  tempo convention (2 s out, 1 s back, no pause).
// Clone (D-LIB21-CLONE): hanging_leg_raise (the 8: census closest; its 12 deg arch and its trim), pilot A's plank (#109
//  @ dcac4a38: the prone line held by the arms, the Newton solve, SAG_LUMBAR), LB1's assisted_pull_up (#245 @ 9e5d9666:
//  the kneel class, the kneecap radius on a pad) and LB10's bear_crawl (#305 @ a9c64e11: the damped solve that throws,
//  the Winter centre of mass); copied, never imported.
// Geometry (confirmed by the report's contacts and checks, and by the tests on the drawn items):
//  Legs (the same in every pose): the knee joints on fixed spots, hip-width (the thighs in the hips' planes, knees
//   under the hip joints laterally); each shin lies flat back along the pad (SHIN_RISE 0: the shank horizontal), the
//   foot points back with its instep and toes on the pad (the ankle solved so the foot's lowest drawn point is level
//   with the shin's). The pad top is
//   placed BEAR under the lowest drawn point of the kneecap, shin and foot (the bearing rule, at most 0.5 cm).
//  Start (c1, c2): hands on the handles (grip centres the shoulder joints' width apart, c1 'about shoulder-width'), the
//   wheel on the floor with its rear edge WHEEL_GAP in front of the kneecaps; arms straight (elbow END_ELBOW short of
//   locked) and plumb over the wheel (ARMS_PLUMB); spine and neck neutral (trunk 0, neck 0, c2 'back straight');
//   root, pelvis tilt and hip flexion solved so each knee sits on its spot.
//  End (c2, c3, c7): one straight line from the knees to the head (hip 0, trunk 0, neck 0), the arms straight and
//   forward overhead at END_SHOULDER to the trunk line (short of in line: c7's moderate roll-out of the kneeling
//   version); root, pelvis tilt and the wheel's roll (its axle on the floor line) solved.
//  Mistake (c3, c13): the low back arches as the arms reach: the lumbar spine extends M_ARCH deg (plank.mjs:103's
//   approved sag, D-LIB21-ABSAG: the roll-out's end is a prone line held by the arms, the plank's class); the shoulders and the
//   knees stay where they are (so the arms, the hands and the wheel do not move, as plank.mjs's sag keeps its forearms
//   and toes); root, pelvis tilt and hip angle solved, so the hips sag below the knees-to-shoulders line.
//  Balance: the Winter centre of mass lies between the knees' pad contact and the wheel's floor contact in every pose.
// Camera: reference-like fit (hanging_leg_raise's margins); the figure is long and low at the end, so the scale is set by
//  the width.
// Unsourced numbers (SIZES; lb9/sizes.json holds each with its basis): PAD_T, BEAR, SHIN_RISE, WHEEL_GAP,
//  END_ELBOW, END_SHOULDER, M_ARCH; the wheel's own sizes are eq/abWheel.mjs AB_WHEEL.
import { landmarksOf, RADII, WINTER, REF, bodyShapes, fk, normPose, resolve } from '../engine.mjs';
import { abWheel, abWheelGeometry, kneelPad, AB_WHEEL, AB_WHEEL_ITEMS } from '../eq/abWheel.mjs';
import { perItem } from '../eq/parts.mjs';

const H = 1.75, D = Math.PI / 180;
export const SIZES = Object.freeze({ PAD_T: 0.03, BEAR: 0.0025, SHIN_RISE: 0, WHEEL_GAP: 0.03, END_ELBOW: 5, END_SHOULDER: 135, M_ARCH: -30 });
const { PAD_T, BEAR, SHIN_RISE, WHEEL_GAP, END_ELBOW, END_SHOULDER, M_ARCH } = SIZES;
const GX = REF.shX * H;                       // c1: grip centres the shoulder joints' width apart
const KX = REF.hjcX * H;                      // knees under the hip joints (lateral)
const WR = AB_WHEEL.r;

// Newton with finite differences (plank.mjs, bear_crawl.mjs), damped; throws if it does not converge.
function solve(p0, make, res, what, iters = 80) {
  const keys = Object.keys(p0), p = { ...p0 };
  const f = q => { const pose = make(q); return res(landmarksOf(pose, H), pose); };
  for (let it = 0; it < iters; it++) {
    const r = f(p); if (Math.hypot(...r) < 1e-9) return p;
    const J = keys.map(k => { const d = 1e-5, q = { ...p, [k]: p[k] + d }; return f(q).map((v, i) => (v - r[i]) / d); });
    const n = keys.length, A = Array.from({ length: n }, (_, i) => [...keys.map((_, j) => J[j][i]), -r[i]]);
    for (let c = 0; c < n; c++) {
      let m = c; for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[m][c])) m = i;
      [A[c], A[m]] = [A[m], A[c]];
      for (let i = 0; i < n; i++) if (i !== c) { const k = A[i][c] / A[c][c]; for (let j = c; j <= n; j++) A[i][j] -= k * A[c][j]; }
    }
    const step = keys.map((_, i) => A[i][n] / A[i][i]), r0 = Math.hypot(...r);
    for (let h = 1; h > 1e-4; h /= 2) {
      const q = { ...p }; keys.forEach((k, i) => { q[k] += h * step[i]; });
      if (Math.hypot(...f(q)) < r0) { Object.assign(p, q); break; }
    }
  }
  if (!(Math.hypot(...f(p)) <= 1e-6)) throw new Error(`ab_wheel_rollout: no solution for ${what}`);
  return p;
}
const mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
/** Winter (2009) whole-body centre of mass on the drawn landmarks (single_leg_romanian_deadlift.mjs:19-36 @ dcac4a38). */
export function com(lm) {
  let m = 0; const c = [0, 0, 0];
  const seg = (w, p) => { m += w; for (let i = 0; i < 3; i++) c[i] += w * p[i]; };
  seg(0.081, lm.ear); seg(0.497, mid(lm.shoulders, lm.hips, 0.5));
  for (const s of ['l', 'r']) {
    seg(0.028, mid(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)); seg(0.016, mid(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)); seg(0.006, lm[`grip.${s}`]);
    seg(0.100, mid(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)); seg(0.0465, mid(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)); seg(0.0145, mid(lm[`heel.${s}`], lm[`toe.${s}`], 0.5));
  }
  return c.map(v => v / m);
}

// ---- legs: the shin and foot lie on the pad, the same in every pose ----
// Drawn outlines on a 1000 px/m side probe (as hanging_leg_raise.mjs's hidden trunk), mapped back to world metres.
const probe = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
const shapesOf = pose => { const body = { height: H }; return bodyShapes(fk(resolve(normPose(pose, body), body).q, body), probe); };
const lowest = (shapes, re) => Math.min(...shapes.filter(s => re.test(s.key)).flatMap(s => s.poly.map(p => -p[1] / 1000)));
// The knee angle that gives the shank a world direction `rise` deg above back-horizontal, for a thigh at (tilt, hip).
const kneeFor = (tilt, hip, rise) => hip - tilt + 90 + rise;
// Reference kneel (thigh plumb) with the knee joint at height 0.5 m: the shin flat along the pad (SHIN_RISE), then the
// ankle solved so the foot's lowest drawn point is level with the shin's (the instep and toes on the pad).
const refKneel = (rise, ankle) => ({ root: { at: [0, 0.5 + WINTER.thigh * H, 0], tilt: 0 }, hip: 0, knee: kneeFor(0, 0, rise), ankle, shoulder: { flex: 0 } });
const LEG = (() => {
  const depth = lowest(shapesOf(refKneel(SHIN_RISE, -60)), /^(kneecap|shank)\.r$/);
  const footLow = a => lowest(shapesOf(refKneel(SHIN_RISE, a)), /^foot\.r$/) - depth;
  let a0 = -70, a1 = -45; if (footLow(a0) * footLow(a1) > 0) throw new Error('ab_wheel_rollout: no ankle brackets the instep on the pad');
  for (let i = 0; i < 50; i++) { const m = (a0 + a1) / 2; if (footLow(a0) * footLow(m) <= 0) a1 = m; else a0 = m; }
  return { rise: SHIN_RISE, ankle: (a0 + a1) / 2, drop: 0.5 - depth };   // drop: knee joint height above the lowest leg point
})();
const KY = PAD_T + LEG.drop - BEAR;            // knee joint height: the lowest leg point BEAR into the pad top
const KNEE = [KX, KY, 0];

// ---- poses ----
const L1 = WINTER.upperArm * H, LF = WINTER.forearm * H, G = REF.gripOff * H;
const REACH = Math.sqrt(L1 * L1 + (LF + G) ** 2 + 2 * L1 * (LF + G) * Math.cos(END_ELBOW * D));   // shoulder to grip, elbow END_ELBOW
const grips = (W, pole) => ({ l: { at: [GX, WR, W], pole: [0.3, pole[1], pole[2]] }, r: { at: [-GX, WR, W], pole: [-0.3, pole[1], pole[2]] } });
const pose = (q, W, pole) => ({ root: { at: [0, q.y, q.z], tilt: q.tilt }, trunk: q.trunk ?? 0, neck: 0, hip: q.hip, knee: kneeFor(q.tilt, q.hip, LEG.rise), ankle: LEG.ankle, reach: grips(W, pole) });
const kneeRes = lm => [lm['knee.r'][1] - KNEE[1], lm['knee.r'][2] - KNEE[2]];
const yz = v => [v[1], v[2]];
const angleAt = (a, o, b) => { const u = yz(a).map((v, i) => v - yz(o)[i]), w = yz(b).map((v, i) => v - yz(o)[i]); return Math.acos((u[0] * w[0] + u[1] * w[1]) / Math.hypot(...u) / Math.hypot(...w)) / D; };

// Start: the wheel's rear edge WHEEL_GAP in front of the kneecaps (the kneecap's front at the knee joint + its radius).
const W0 = KNEE[2] + RADII.kneeCap * H + WHEEL_GAP + WR;
const POLE_S = [0, -0.2, -1], POLE_E = [0, -1, -0.2];
const QS = solve({ y: 0.55, z: -0.1, tilt: 60, hip: 80 }, q => pose(q, W0, POLE_S), lm => [...kneeRes(lm),
  lm['shoulder.r'][2] - W0, dist(lm['shoulder.r'], [-GX, WR, W0]) - REACH], 'the start');
const start = pose(QS, W0, POLE_S);
const LS0 = landmarksOf(start, H);
// End: the straight line knees to head (hip 0), the shoulder at END_SHOULDER between the trunk line and the arm.
const QE = solve({ y: 0.25, z: 0.3, tilt: 75, W: 1.2 }, q => pose({ ...q, hip: 0 }, q.W, POLE_E), lm => [...kneeRes(lm),
  angleAt(lm['hip.r'], lm['shoulder.r'], lm['grip.r']) - END_SHOULDER, dist(lm['shoulder.r'], [-GX, WR, lm['grip.r'][2]]) - REACH], 'the end');
const W1 = QE.W;
const end = pose({ ...QE, hip: 0 }, W1, POLE_E);
const LE = landmarksOf(end, H);
// Mistake: the lumbar extends M_ARCH; shoulders and knees stay (arms, hands and wheel unchanged).
const QM = solve({ y: QE.y - 0.03, z: QE.z, tilt: QE.tilt, hip: -5 }, q => pose({ ...q, trunk: M_ARCH }, W1, POLE_E), lm => [...kneeRes(lm),
  lm['shoulder.r'][1] - LE['shoulder.r'][1], lm['shoulder.r'][2] - LE['shoulder.r'][2]], 'the arch');
const mistake = pose({ ...QM, trunk: M_ARCH }, W1, POLE_E);

// Start phantoms (DRAWING-GUIDE.md 4; Q2 (c); D-LIB21-DRAW): the start wheel and the start near arm lie partly inside
// the end figure (the end thigh crosses them), so the runs of their outlines hidden inside the end figure's drawn
// shapes are redrawn as dashed hidden lines in the end layer (hanging_leg_raise.mjs's hidden-line method, copied).
const insidePoly = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
  const [xi, yi] = poly[i], [xj, yj] = poly[j];
  if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
const dense = (P, step = 2) => P.flatMap((a, i) => { const b = P[(i + 1) % P.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step)); return Array.from({ length: n }, (_, k) => [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); });
const hiddenRuns = (outlines, cover) => outlines.flatMap(P => {
  const pts = dense(P), vis = pts.map(p => !cover.some(c => insidePoly(p, c))), n = pts.length, i0 = vis.indexOf(true), runs = [];
  if (i0 < 0) return [pts];
  let run = [];
  for (let k = 1; k <= n; k++) { const i = (i0 + k) % n; if (!vis[i]) run.push(pts[i]); else { if (run.length > 2) runs.push(run); run = []; } }
  if (run.length > 2) runs.push(run);
  return runs;
});
export const START_HIDDEN = (() => {
  const ws = shapesOf(start).filter(s => /^(upper|elbowcap|fore|fist)\.r$/.test(s.key)).map(s => s.poly);
  const wheel = Array.from({ length: 48 }, (_, k) => { const a = k * 7.5 * D; return [(W0 + WR * Math.cos(a)) * 1000, -(WR + WR * Math.sin(a)) * 1000]; });
  const cover = shapesOf(end).map(s => s.poly);
  return hiddenRuns([...ws, wheel], cover).map(r => r.map(([x, y]) => [-GX, -y / 1000, x / 1000]));
})();

// The straight line knees to head (c2): the end knee joint to the crown, run LINE_RUN m past each end (plank.mjs LINE).
const LINE_RUN = 0.1;
const LINE = (() => { const a = LE['knee.r'], b = LE.head, d = b.map((v, i) => v - a[i]), n = Math.hypot(...d);
  return [a.map((v, i) => v - d[i] / n * LINE_RUN), b.map((v, i) => v + d[i] / n * LINE_RUN)]; })();
const LINE_TIP = (() => { const [a, b] = LINE; return a.map((v, i) => v + (b[i] - v) * (1 - 0.05 / Math.hypot(...b.map((w, k) => w - a[k])))); })();   // on the run past the crown

const PAD = { z0: KNEE[2] - 0.62, z1: KNEE[2] + 0.09, t: PAD_T };
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  id: 'ab_wheel_rollout', name: 'Ab Wheel Rollout', view: 'side', facing: 'right',
  camera: { fit: { left: 14, right: 14, top: 22, bottom: 12 } },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: PAD.z0 - 0.08, to: W1 + 0.3 },
    kneelPad(PAD),
    ...perItem((lm) => abWheel({ axle: [0, WR, lm['grip.r'][2]], gripX: GX }), AB_WHEEL_ITEMS),
    ...START_HIDDEN.map(pts => ({ type: 'line', pts, cls: 'eq-line m-line', z: 'front', part: 'startPhantom' })),
  ],
  checks: [
    ...['knee.l', 'knee.r'].map(landmark => ({ landmark, plane: { point: [0, KY, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 })),   // c1: knees on the pad
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: LS0[landmark], pose: 'start', tol: 0.5 })),                             // c1 fact: the hands on the handles
    ...['grip.l', 'grip.r'].map(landmark => ({ landmark, plane: { point: [0, WR, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 })),    // hands on the handles, the wheel on the floor
    ...['toe.l', 'toe.r'].map(landmark => ({ landmark, above: { point: [0, PAD_T - 0.005, 0], normal: [0, 1, 0] }, pose: 'all' })),     // feet on the pad
    { landmark: 'shoulder.r', plane: { point: [0, 0, W0], normal: [0, 0, 1] }, pose: 'start', tol: 0.5 },                                 // arms plumb at the start
  ],
  ghosts: { count: 2, parts: ['wheel'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  // The knees-to-head line (c2), the end pose's knee joint to its crown, run LINE_RUN past each end (plank.mjs's datum).
  datum: [{ x: 0, from: 0, to: 0, line: LINE }],
  // Labels boxed above the swept band (the start head ends at plate x 172; the in-between bodies the engine counts as
  // drawn reach up to y 215), each leader vertical; two-line labels so the three fit beside each other.
  callouts: [
    { key: 'line', text: 'Straight<br>line', anchor: LINE_TIP, box: { left: 244, top: 179 }, cue: 'Knees to head in one line, back straight.' },
    { key: 'arch', text: 'No back<br>arch', anchor: { along: ['sacrum', 'backMid'], t: 0.5 }, box: { left: 171, top: 167 }, cue: 'Don\'t let your low back arch as you reach.' },
    { key: 'slow', text: 'Roll<br>slowly', anchor: { at: 'grip.r', off: [0, -12] }, box: { left: 290, top: 226 }, cue: 'Roll out and back slowly and under control.' },
  ],
  mistake: {
    pose: mistake,
    // The arch lies inside the solid end figure (lib4-cards 32-33): its true contour (the engine's dashed outline) and a
    // short red arrow (about 12 px) from just above the end low back down to the arched low back.
    guides: [{ kind: 'arrow', from: { along: ['sacrum', 'backMid'], t: 0.5, pose: 'end', off: [0, -4] }, to: { along: ['sacrum', 'backMid'], t: 0.5, pose: 'mistake' } }],
    // One tell (D-LIB10-SKULL1; DESIGN.md one-tell record): c3 and c13 state one sign of this fault, the low back
    // arching (lumbar extension); the hips dropping is its geometry, not a sign a claim states.
    tells: [
      { key: 'arch', text: 'Low back<br>arches', anchor: { along: ['sacrum', 'backMid'], t: 0.5, pose: 'mistake' }, box: { left: 171, top: 175 }, cue: 'The low back arches as the arms reach overhead.' },
    ],
  },
  tempo: [{ phase: 'Roll out', s: 2, move: true }, { phase: 'Roll back', s: 1, move: true }],
  alt: 'Ab wheel rollout, side view. Kneeling on a pad with the hands on the wheel just in front of the knees, the lifter rolls the wheel forward until the body is one straight line from the knees to the head, arms reaching overhead.',
};
export const info = { LEG, KY, W0, W1, QS, QE, QM, REACH, pose: Object.fromEntries([['start', start], ['end', end], ['mistake', mistake]].map(([k, p]) => { const lm = landmarksOf(p, H);
  return [k, { com: com(lm).map(v => +v.toFixed(3)), knee: lm['knee.r'].map(v => +v.toFixed(3)), grip: lm['grip.r'].map(v => +v.toFixed(3)), shoulder: lm['shoulder.r'].map(v => +v.toFixed(3)), hip: lm['hip.r'].map(v => +v.toFixed(3)) }]; })) };
