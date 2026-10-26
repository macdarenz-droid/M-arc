// Side plank (forearm), FRONT view, lying on the right side (head to the figure's right, screen left). LIB-21 (LB9, H,
//  (b) row: the library's first `root.roll` plate, LIB-20).
// View: front (card plate.view = census): the straight line from the head to the feet and the sinking hips (c2, c5) lie
//  in the body's frontal plane, which the front view shows.
// Hold class (plank, pilot A; plan 1:80-81): the entry pose (dashed start) then the held pose (solid end); the Trace
//  follows the hips into the hold.
// Sources: research card docs/research/howto/cards/side_plank.json: c1 lie on one side, the elbow under the shoulder,
//  the top leg stacked on the bottom leg, legs straight (or knees bent: an "or" choice, D-LIB17-ORCHOICE; straight is
//  drawn, as plate.start); c2 press the elbow, hip and bottom foot into the floor and lift the hips into a straight line
//  from the ribs through the hips and bottom leg, head to feet; c3 the top arm rests on the hip; c5 when the hips sink,
//  the core does much less (the Mistake); c7 the bottom shoulder down, away from the ear; a mat under the elbow and
//  forearm; c9 the hold (tempo).
// Sides (D-LIB21-SIDES): c1 names no side ("one side"); the plate draws the right side down. The card's c9 asks for
//  both sides evenly; the plate draws one.
// Clone (D-LIB21-CLONE): hanging_leg_raise (census closest; its trim convention), pilot A's plank (the hold class:
//  entry, held pose, the hips' Trace, the body-line datum, the forearm placed by the hand IK) and upright_row (the
//  engine front view); bird_dog and superman (this batch: the mat, the floor camera, contacts on the drawn outlines);
//  copied, never imported.
// Geometry (confirmed by the report's contacts and checks, and by measuring the drawn outlines; `info`):
//  The body lies on its side by `root.roll` (LIB-20): the whole body turns about the forward axis, + tips the head to
//   the figure's right, so the right side is down.
//  Bottom arm (c1, c7): the elbow joint ELBOW_Y above the mat top with the upper arm plumb (the shoulder joint straight
//   above it); the forearm flat on the mat FORE deg from straight forward toward the head (a forearm pointing straight
//   at the camera lies end-on behind the elbow, so the front view could not show it on the floor), placed by the hand
//   IK with the elbow pole down (plank.mjs's method). ELBOW_Y and the grip height are solved so the drawn upper arm,
//   forearm and fist rest on the mat top (0 cm). The same in every pose (the arm does not move).
//  Legs (c1, c2): straight (knee 0, ankle 0); the top leg adducted STACK deg so its foot rests on the bottom foot; the
//   bottom foot's lowest drawn point on the floor in every pose.
//  Held pose (c2, c7): one straight line from the head to the feet: trunk { lat 0 }, hips 0 against the pelvis, neck 0;
//   root and roll solved so the shoulder joint sits over the elbow and the bottom foot on the floor. Shoulder girdle
//   neutral (scap 0, c7 "down, away from the ear": the engine's resting girdle; no size is stated).
//  Entry (c1, c2 "press the elbow, your hips and your bottom foot into the ground"): the same elbow and foot, the
//   pelvis's lowest drawn point on the mat top; the side bend shared equally by the lumbar spine (trunk.lat) and the
//   hips (both legs turned the same angle against the pelvis), a stated reason that fixes the split without a number;
//   root, roll and the bend solved. The legs then rest along the floor (thigh 0.7 cm, shin 1.4 cm above it).
//  Mistake (c5): the hips sink M_SINK of the way from the held height to the entry's (the root), the elbow, shoulder and
//   foot unchanged, the bend shared as at the entry (solved). The thorax pivots about the shoulder, so the head dips
//   with it.
//  Top arm (c3): the hand rests on the top hip (grip TOP_HAND above the hip joint along the world up), elbow up and back.
//  Balance (D-LIB21-BALANCE, c2): the centre of mass (Winter on the drawn landmarks) lies over the elbow-to-foot support
//   in every pose (baseOf).
//  Trace (D-LIB21-TRACE; the hold convention "Trace follows the path into the hold"): the bottom hip, hip.r (c2 "lift
//   the hips"), trim [4, 6] (plank.mjs's hips Trace).
// Camera: D-LIB21-FLOOR / D-LIB8-floor: floor at y 339, the width-filling scale capped at x1.35 (F1 at its measured
//  px/m). Datum: the body line of the held pose, shoulder to ankle, run past both ends (plank.mjs's datum).
// Unsourced numbers (SIZES; lb9/sizes.json holds each with its basis): MAT_T, MAT_LEN, STACK, FORE, TOP_HAND, M_SINK,
//  FLOOR_RUN (the floor line's run past the mat's head end, so the bottom arm's two labels fit beside it).
// Start phantom and ghosts: the legs only (the entry's legs lie on the floor; the entry torso's phantom would fill the
//  space under the held body, where the Mistake's red hips sink).
// Labels: the one tell's leader enters the solid end figure once from above to the red top outline of the sunk pelvis
//  (9.6 px past its first 8 px): the sunk hips lie under the solid figure, so no leader reaches them from open space
//  (a named front entry, asked with the E-R5 slice, D-LIB18-LIFT's form).
import { landmarksOf, bodyShapes, normPose, resolve, fk, WINTER, REF, RADII } from '../engine.mjs';

const H = 1.75, D = Math.PI / 180;
export const SIZES = Object.freeze({ MAT_T: 0.01, MAT_LEN: 1.73, STACK: 6, FORE: 45, TOP_HAND: 0.12, M_SINK: 0.5, FLOOR_RUN: 0.4 });
const { MAT_T, MAT_LEN, STACK, FORE, TOP_HAND, M_SINK, FLOOR_RUN } = SIZES;
// The drawn outlines in world metres: a front camera at 1 px/m, screen y down.
const CAM = { view: 'front', near: null, pxm: 1, P: w => [w[0], -w[1]] };
const shapesOf = pose => { const b = { height: H }, r = resolve(normPose(pose, b), b); return bodyShapes(fk(r.q, b), CAM, {}).filter(s => s.poly); };

// Newton with finite differences (bird_dog.mjs, bear_crawl.mjs @ a9c64e11), damped; throws if it does not converge.
function solve(p0, make, res, what, iters = 80) {
  const keys = Object.keys(p0), p = { ...p0 };
  const f = q => res(make(q));
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
  if (!(Math.hypot(...f(p)) <= 1e-6)) throw new Error(`side_plank: no solution for ${what}`);
  return p;
}

const UA = WINTER.upperArm * H, FA = (WINTER.forearm + REF.gripOff) * H;
const XE = -0.66;                                          // the elbow's spot on the mat (m, world x)
// The bottom arm for an elbow height ye and a grip height yg: the shoulder joint plumb over the elbow, the grip centre
// on the mat at the forearm's length FORE deg from forward toward the head.
const armOf = (ye, yg) => { const fl = Math.sqrt(FA * FA - (ye - yg) ** 2); return { SH: [XE, ye + UA], GRIP: [XE - fl * Math.sin(FORE * D), yg, fl * Math.cos(FORE * D)] }; };
const MAT0 = armOf(0.05, 0.045).GRIP[0] - 0.06;             // the mat's head end, 6 cm past the fist
export const MAT = { x0: MAT0, x1: MAT0 + MAT_LEN };
const surf = x => (x >= MAT.x0 && x <= MAT.x1 ? MAT_T : 0);
/** The least gap (m) between the drawn shapes matching re and the surface under them (mat top or floor); negative =
 *  into it. */
export const gap = (pose, re) => { let m = Infinity; for (const s of shapesOf(pose)) if (re.test(s.key)) for (const v of s.poly) m = Math.min(m, -v[1] - surf(v[0])); return m; };

const bodyAt = (q, arm) => ({ root: { at: [q.x, q.y, 0], roll: q.roll }, trunk: { lat: q.lat ?? 0 }, neck: 0,
  hip: { l: { abd: -STACK - (q.d ?? 0) }, r: { abd: q.d ?? 0 } }, knee: 0, ankle: 0,
  reach: { r: { at: arm.GRIP, pole: [0, -1, 0] } } });
const shoulderRes = (pose, arm) => { const lm = landmarksOf(pose, H); return [lm['shoulder.r'][0] - arm.SH[0], lm['shoulder.r'][1] - arm.SH[1]]; };
const heldOf = arm => solve({ x: -0.14, y: 0.44, roll: 72 }, q => bodyAt(q, arm), pose => [...shoulderRes(pose, arm), gap(pose, /^foot\.r/)], 'the held pose');
// ELBOW_Y and the grip height: the drawn upper arm and forearm, and the fist, rest on the mat top in the held pose.
const ARMQ = solve({ ye: 0.05, yg: 0.045 }, q => { const arm = armOf(q.ye, q.yg); return bodyAt(heldOf(arm), arm); },
  pose => [gap(pose, /^(upper|fore)\.r/), gap(pose, /^fist\.r/)], 'the bottom arm');
export const ELBOW_Y = ARMQ.ye;
const ARM = armOf(ARMQ.ye, ARMQ.yg);
const withHand = pose => { const L = landmarksOf(pose, H); return { ...pose, reach: { ...pose.reach, l: { at: [L['hip.l'][0], L['hip.l'][1] + TOP_HAND, 0.02], pole: [0.3, 1, -0.5] } } }; };

// Held pose (c2, c7).
export const QE = heldOf(ARM);
export const end = withHand(bodyAt(QE, ARM));
const LEND = landmarksOf(end, H);
// Entry (c1, c2): the pelvis on the mat, the bend shared by the spine and the hips (d = lat).
export const QS = solve({ x: -0.15, y: 0.18, roll: 64, lat: -27 }, q => bodyAt({ ...q, d: q.lat }, ARM),
  pose => [...shoulderRes(pose, ARM), gap(pose, /^foot\.r/), gap(pose, /^torso/)], 'the entry');
export const start = withHand(bodyAt({ ...QS, d: QS.lat }, ARM));
const LSTART = landmarksOf(start, H);
// Mistake (c5): the hips sink M_SINK of the way down to the entry height.
export const QM = solve({ x: QE.x, y: QE.y - 0.1, roll: QE.roll + 5, lat: -10 }, q => bodyAt({ ...q, d: q.lat }, ARM),
  pose => [...shoulderRes(pose, ARM), gap(pose, /^foot\.r/), pose.root.at[1] - (QE.y - M_SINK * (QE.y - QS.y))], 'the sag');
const sag = withHand(bodyAt({ ...QM, d: QM.lat }, ARM));
export const mistake = { root: sag.root, trunk: sag.trunk, hip: sag.hip, reach: sag.reach };

const mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
/** Winter (2009) whole-body centre of mass on the drawn landmarks (bird_dog.mjs). */
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
/** Balance (D-LIB21-BALANCE, c2): the support runs from the elbow's forearm contact to the bottom foot's floor contact
 *  (world x); the centre of mass's x and its margin (cm, + inside) in that span. */
export function baseOf(pose) {
  const lm = landmarksOf(pose, H), c = com(lm)[0], x0 = Math.min(lm['elbow.r'][0], lm['grip.r'][0]);
  let x1 = -Infinity; for (const s of shapesOf(pose)) if (/^foot\.r/.test(s.key)) for (const v of s.poly) if (-v[1] - surf(v[0]) < 0.005) x1 = Math.max(x1, v[0]);
  return { from: +x0.toFixed(3), to: +x1.toFixed(3), com: +c.toFixed(3), margin: +(Math.min(c - x0, x1 - c) * 100).toFixed(2) };
}
// The body line (datum, c2): shoulder to ankle of the held pose, run LINE_RUN m past each end (plank.mjs).
const LINE_RUN = 0.16;
const LINE = (() => {
  const lm = landmarksOf(end, H), a = lm['shoulder.r'], b = lm['ankle.r'], d = b.map((v, i) => v - a[i]), n = Math.hypot(...d);
  return [a.map((v, i) => v - d[i] / n * LINE_RUN), b.map((v, i) => v + d[i] / n * LINE_RUN)];
})();
const SPAN = (() => { let a = Infinity, b = -Infinity; for (const p of [start, end]) for (const s of shapesOf(p)) for (const v of s.poly) { a = Math.min(a, v[0]); b = Math.max(b, v[0]); } return [a, b]; })();

export default {
  id: 'side_plank', name: 'Side Plank', view: 'front',
  camera: { fit: true, maxScale: 1.35, y0: 339 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: Math.min(SPAN[0], MAT.x0) - FLOOR_RUN, to: Math.max(SPAN[1], MAT.x1) },
    { type: 'box', at: [(MAT.x0 + MAT.x1) / 2, MAT_T / 2, 0], w: MAT_LEN, h: MAT_T, rc: 0.5, part: 'mat' },
  ],
  checks: [
    { landmark: 'elbow.r', plane: { point: [0, ELBOW_Y, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },          // c1: forearm down
    { landmark: 'elbow.r', plane: { point: [XE, 0, 0], normal: [1, 0, 0] }, pose: 'all', tol: 0.5 },              // c1: elbow under the shoulder
    { landmark: 'shoulder.r', plane: { point: [XE, 0, 0], normal: [1, 0, 0] }, pose: 'all', tol: 0.5 },
    // c2 "Press your elbow, your hips ... into the ground" (D-LIB21-SPFACTS, as D-LIB18-LLCFACTS): the bottom hip stays
    // where the entry's pelvis rests on the mat (its drawn side outline on the mat top, the drawn-item test), start only
    { landmark: 'hip.r', at: LSTART['hip.r'], pose: 'start', tol: 0.5 },
    // c2 "your bottom foot into the ground" (D-LIB21-SPFACTS (a)): the foot rests on its edge, so no foot landmark lies on
    // the surface; heel and ball are held at their solved spots, start and end (the drawn outline on the mat: the test)
    ...['start', 'end'].flatMap(pose => ['heel.r', 'ball.r'].map(landmark => ({ landmark, at: (pose === 'start' ? LSTART : LEND)[landmark], pose, tol: 0.5 }))),
  ],
  startParts: ['leg.l', 'leg.r'],
  ghosts: { count: 2, parts: ['leg.r'] },
  trace: { point: 'hip.r', trim: [4, 6] },
  datum: [{ x: 0, from: 0, to: 0, line: LINE }],
  callouts: [
    { key: 'elbow', text: 'Elbow under<br>shoulder', anchor: { at: 'elbow.r', off: [-9, -8] }, box: { left: 8, top: 285 }, cue: 'Bottom elbow sits under the shoulder.' },
    { key: 'hips', text: 'Hips up', anchor: { at: 'hip.l', off: [16, -5.5] }, box: { left: 200, top: 170 }, cue: 'Hips lifted into one line with the ribs and legs.' },
    { key: 'shoulder', text: 'Shoulder<br>down', anchor: 'shoulderTop.r', box: { left: 8, top: 237 }, cue: 'Bottom shoulder stays away from the ear.' },
  ],
  mistake: {
    pose: mistake,
    guides: [
      { kind: 'arrow', from: { at: 'hip.r', pose: 'mistake', off: [0, -12] }, to: { at: 'hip.r', pose: 'mistake' } },   // a short in-figure fault arrow (lib4-cards 32-33)
    ],
    tells: [
      { key: 'sink', text: 'Hips sink', anchor: { at: 'hip.l', pose: 'mistake', off: [13.2, -8.5] }, box: { left: 214, top: 200 }, cue: 'The hips sink toward the floor.' },
    ],
  },
  tempo: [{ phase: 'Hold', s: '30–60' }],
  pilot: { drawableFault: 'Top fault: holding the breath (c6), with no sign the plate can draw; drawn: the next fault on the same list, the hips sinking (c5).' },
  alt: 'Side plank, front view. From lying on one side propped on the forearm, the hips lift until the body forms one straight line from the head to the feet, the elbow under the shoulder and the top hand on the hip.',
};
export const info = { ELBOW_Y, QE, QS, QM, MAT, pose: Object.fromEntries([['start', start], ['end', end], ['mistake', { ...end, ...mistake }]].map(([k, p]) => [k, {
  base: baseOf(p), ...Object.fromEntries(['torso', 'thigh', 'shank', 'foot', 'upper', 'fore', 'fist', 'head', 'palm'].map(r => [r, +(gap(p, new RegExp('^' + r)) * 100).toFixed(2)])) }])) };
