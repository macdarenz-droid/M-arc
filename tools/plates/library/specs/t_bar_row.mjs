// T-bar row (free-standing, landmine rig with a V-handle), side view, figure facing screen right. LIB-13 (LB3, mode H;
// the landmine composer's second user, approved only after landmine_row, ruling D-LIB13-LANDMINE).
// View: side (card plate.view = census view). The chest-parallel back, the hinge and the handle path to the lower chest
// are front-to-back (c2, c3, c4).
// Sources: research card docs/research/howto/cards/t_bar_row.json (research head 892d6516): callouts = plate.checkpoints
//  (c3 Chest parallel, c2 Soft knees, c4 Elbows back); Mistake = plate.mistake (c7: the back rounds over the bar);
//  tempo = plate.tempo (c15: up 1, down 2, pause 1: Pull 1, Hold 1, Lower 2).
// Clone source: landmine_row (this branch; its rig, solver and clearance rule copied, never imported) and barbell_row
//  (#109 @ 48d49bb) for the held hinge (D-LIB9-CLONE).
// Rig (eq/landmine.mjs; c1, c24): the bar pinned at a floor pivot behind the lifter, plates on the free end, the lifter
//  straddling the bar; a vendor vHandle hooked under the bar 9 in (22.9 cm, the midpoint of c1's 8-10 in) from the
//  plates, behind them (c24), hanging under the bar to the hands.
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Feet (LIB-13s D-LIB13S-TBARFEET): mid-soles 38 cm apart, toes out 17 deg: the widest stance the engine plants within
//   0.5 cm (0.4 cm; upright_row's form). c2's "about shoulder width" is 45 cm on this body, but 45 cm with toes out 5 deg
//   lifts the foot 1.0 cm (H1.engine). The side view drops x (plate.mjs:44-45), so the width does not show.
//  Trunk and legs are one held hinge in start and end: thorax TRUNK_INCL 80 deg from vertical (chest parallel, c3;
//   "near parallel", c24) = pelvis 77 + lumbar 3 (back straight); knees KNEE 20 deg (slightly bent, c2); the root
//   ROOT_Z 15 cm behind mid-foot, its height SOLVED for the knee angle (bracket 0.5-0.935).
//  Hands: both on the V-handle's grips (15 cm apart, the vendor vHandle), neutral (c6's palms facing). Wrists bent back
//   35 deg into the pull grip (the card's recorded convention, R-LB3-5).
//  Start: the arms hang straight, ARM_BACK 10 deg behind vertical; the handle hangs straight down from the hook, so the
//   hook sits HANDLE_L above the grips; the pivot is SOLVED onto the floor so the bar runs through the hook.
//  End (c4, c23): elbows driven back, shoulder blades pulled back (4 cm); the bar turns up about the pivot until the
//   plates meet the torso: the arc angle is SOLVED at the first contact (scanned up from the start angle in 0.01 rad steps) so the nearest plate
//   corner, the bar's surface from the hook out, the hook ring or a hand sits CLEAR 5 mm off the drawn torso and head outline
//   (the engine's bodyShapes): "as far as possible before the plates make contact with your torso" (c23). One
//   via pose on the same circle keeps the ghosts and the Trace on the arc. The start bar and plate are redrawn as a
//   dashed phantom in the end pose (13 Q2 (c)).
//  Plate: one 10 lb iron plate per side, 228 mm by 31 mm, the same drawing convention as landmine_row (card gaps; c23:
//   smaller plates give more range; Rogue Machined Olympic Plates "10LB: 228MM"; D-LIB13-LANDMINE-2 2).
//  Mistake (c7): the back rounds over the bar: the pelvis tucks M_TUCK and the lumbar spine flexes M_SPINE
//   (illustrative; the card gives no number), the hips and feet held; the bar comes up on its circle until the bar,
//   hook ring, a grip or a plate corner comes within 2 px of the rounded torso and head (LIB-13s D-LIB13S-CLEAR: c23
//   names the plates at the end, not the bar over a rounded back). A dashed hump guide shows the round (romanian_deadlift's method).
//  Zoom (LIB-13s D-LIB13S-ZOOM): a normal-view circle at k 3 on the handle's Trace with the spec's own trim (27.23 px).
// Unsourced numbers: FOOT_X 0.19, TOE_OUT 17, TRUNK_INCL 80, SPINE 3, KNEE 20, ROOT_Z -0.15, ARM_BACK 10, HOOK 9 in (c1's midpoint),
//  HANDLE_L 0.22 (the vendor vHandle), CLEAR 5 mm, CLEAR_M 2 px, PRO_START 2 / PRO_END -4 cm, WRIST -35 (convention), M_TUCK 30,
//  M_SPINE 40, HUMP 8 cm; the landmine sizes (eq/landmine.mjs header); the plate (convention above).
import { bodyShapes, fk, landmarksOf, normPose, resolve } from '../engine.mjs';
import { LANDMINE, LANDMINE_ITEMS, alongBar, barFrame, hingeAt, landmine } from '../eq/landmine.mjs';
import { perItem } from '../eq/parts.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.19, TOE_OUT = 17;   // D-LIB13S-TBARFEET: the widest stance the engine plants within 0.5 cm (0.4 cm)
const TRUNK_INCL = 80, SPINE = 3, KNEE = 20, ROOT_Z = -0.15;
const ARM_BACK = 10, CLEAR = 0.005, WRIST = -35;
// Shoulder to grip centre at full reach as the engine's IK measures it with the wrist bent back WRIST deg (body.mjs
// solveReach: upper arm + the forearm-and-hand chord), at 99.98%: the IK then turns the forearm only by the hand's
// bend (about 9 deg), so the arm reads straight.
const REACH = (() => { const g = 0.46 * 0.108 * H, w = WRIST * Math.PI / 180; return (0.186 * H + Math.hypot(0.146 * H + g * Math.cos(w), g * Math.sin(w))) * 0.9998; })();
const PRO_START = 2, PRO_END = -4;
export const PLATE_D = 0.228, PLATE_T = 0.031;
const HOOK = 0.229, HANDLE_L = 0.22, RING_DROP = 0.006, GRIP_SEP = 0.15;
const S_HOOK = LANDMINE.barLen - LANDMINE.collarFromEnd + 0.01 - HOOK;   // the hook's distance from the pivot

const toe = s => [s * Math.sin(TOE_OUT * R), 0, Math.cos(TOE_OUT * R)];
const feet = { l: { at: [FOOT_X, 0, 0], toe: toe(1) }, r: { at: [-FOOT_X, 0, 0], toe: toe(-1) } };
const kneeOf = lm => {
  const a = [0, 1, 2].map(i => lm['hip.r'][i] - lm['knee.r'][i]), b = [0, 1, 2].map(i => lm['ankle.r'][i] - lm['knee.r'][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
// Bracketed root finder (Illinois regula falsi): throws when f(a) and f(b) have the same sign (D-LIB9-CLONE b).
export const solve = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`t_bar_row: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 60 && Math.abs(b - a) > 1e-7; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const body = (y, pro, tilt = TRUNK_INCL - SPINE, trunk = SPINE) => ({ root: { at: [0, y, ROOT_Z], tilt }, trunk, neck: 0, scap: { pro }, wrist: WRIST, plant: feet });
const ROOT_Y = solve(y => kneeOf(landmarksOf(body(y, PRO_START), H)) - KNEE, 0.5, 0.935);

// Start: the grips (handle centre) ARM_BACK behind vertical below the shoulders, at the handle's 15 cm grip spacing.
const S0 = landmarksOf(body(ROOT_Y, PRO_START), H)['shoulder.r'];
const drop = Math.sqrt(REACH ** 2 - (Math.abs(S0[0]) - GRIP_SEP / 2) ** 2);
const START_GRIP = [0, S0[1] - drop * Math.cos(ARM_BACK * R), S0[2] - drop * Math.sin(ARM_BACK * R)];
const hookOfGrip = g => [0, g[1] + HANDLE_L + RING_DROP, g[2]];
const H0 = hookOfGrip(START_GRIP);
const PIVOT = hingeAt(H0[2] - Math.sqrt(S_HOOK ** 2 - (H0[1] - LANDMINE.hingeH) ** 2));
const angOf = p => Math.atan2(p[1] - PIVOT[1], p[2] - PIVOT[2]);
const hookAt = a => [0, PIVOT[1] + S_HOOK * Math.sin(a), PIVOT[2] + S_HOOK * Math.cos(a)];
const gripAt = a => { const h = hookAt(a); return [0, h[1] - HANDLE_L - RING_DROP, h[2]]; };
const hands = (g, pole) => ({ r: { at: [-GRIP_SEP / 2, g[1], g[2]], pole }, l: { at: [GRIP_SEP / 2, g[1], g[2]], pole: [-pole[0], pole[1], pole[2]] } });
const start = { ...body(ROOT_Y, PRO_START), reach: hands(START_GRIP, [-0.2, 0, -1]) };

// The drawn torso and head outline (the engine's own bodyShapes, in metres in the side plane) of a pose: the arms do not
// change it, so it is built once per pose.
const SIDE_CAM = { view: 'side', near: 'r', pxm: 1, P: w => [w[2], w[1]] };
const outlineOf = pose => { const b = { height: H }; return bodyShapes(fk(resolve(normPose(pose, b), b).q, b), SIDE_CAM).filter(x => x.key === 'torso' || x.key === 'head').map(x => x.poly); };
/** Signed distance (m) of world point p from the drawn outline `polys`: positive outside the body. */
function outside(polys, p) {
  const q = [p[2], p[1]];
  let inside = false, best = Infinity;
  for (const P of polys) for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const a = P[j], b = P[i];
    if ((b[1] > q[1]) !== (a[1] > q[1]) && q[0] < a[0] + (b[0] - a[0]) * (q[1] - a[1]) / (b[1] - a[1])) inside = !inside;
    const d = [b[0] - a[0], b[1] - a[1]], L2 = d[0] ** 2 + d[1] ** 2 || 1, t = Math.max(0, Math.min(1, ((q[0] - a[0]) * d[0] + (q[1] - a[1]) * d[1]) / L2));
    best = Math.min(best, Math.hypot(q[0] - a[0] - d[0] * t, q[1] - a[1] - d[1] * t));
  }
  return inside ? -best : best;
}
export const plateCorners = hook => {
  const { u, n, collar } = barFrame(PIVOT, hook), o = n.map(v => v * PLATE_D / 2);
  return [0.01, 0.01 + PLATE_T].flatMap(k => [1, -1].map(sg => collar.map((v, i) => v + u[i] * k + sg * o[i])));
};
// The bar's surface from the hook to its free end (every 2 cm, the sleeve's radius), the plate's corners, the hook ring
// and the grips: everything that rises with the handle must stay CLEAR off the drawn outline.
const risingPts = (a, step = 0.02) => {
  const h = hookAt(a), { n } = barFrame(PIVOT, h), out = [...plateCorners(h), gripAt(a), [0, h[1] - RING_DROP - 0.02, h[2]]];
  for (let s = S_HOOK - 0.1; s <= LANDMINE.barLen; s += step) for (const sg of [1, -1]) out.push(alongBar(PIVOT, h, s).map((v, i) => v + sg * n[i] * LANDMINE.sleeveD / 2));
  return out;
};
const clearAt = (polys, a) => Math.min(...risingPts(a).map(p => outside(polys, p))) - CLEAR;
const A0 = angOf(H0);
// The first contact as the bar turns up: scan from the start angle in 0.01 rad steps to the first sign change of f
// (clearance), then solve inside that step. Throws if nothing meets the torso within 0.6 rad.
const firstContact = f => {
  for (let a = A0; a < A0 + 0.6; a += 0.01) if (f(a) > 0 && f(a + 0.01) <= 0) return solve(f, a, a + 0.01);
  throw new Error(`${'t_bar_row'}: no contact within 0.6 rad`);
};
const end0 = body(ROOT_Y, PRO_END), LE0 = landmarksOf(end0, H), OE0 = outlineOf(end0);
const END_A = firstContact(a => clearAt(OE0, a));
const END_GRIP = gripAt(END_A);
const POLE_UP = () => [-0.5, 0.5, -2];   // elbows driven back (c4), a little up and out
const end = { ...end0, reach: hands(END_GRIP, POLE_UP()) };
const via = [{ ...body(ROOT_Y, (PRO_START + PRO_END) / 2), reach: hands(gripAt((A0 + END_A) / 2), [-0.4, -0.3, -1]) }];

const M_TUCK = 30, M_SPINE = 40;
// The Mistake stops when the bar, hook ring, grips or plate come within 2 px (D-LIB13S-CLEAR: c23's contact names the
// plates at the card's end, not the bar over a rounded back), measured on the drawn outline: the engine's Catmull-Rom
// spline through the torso and head polygons, sampled 8 times per span, the bar every 1 mm.
const CLEAR_M = 2 / 146.29;
const cr = (ps, k = 8) => {
  const n = ps.length, g = i => ps[(i + n) % n], out = [];
  for (let i = 0; i < n; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let j = 0; j < k; j++) { const t = j / k, u = 1 - t;
      out.push([0, 1].map(d => u * u * u * p1[d] + 3 * u * u * t * c1[d] + 3 * u * t * t * c2[d] + t * t * t * p2[d])); }
  }
  return out;
};
const mist0 = body(ROOT_Y, PRO_END, TRUNK_INCL - SPINE - M_TUCK, M_SPINE), LM0 = landmarksOf(mist0, H), OM0 = outlineOf(mist0).map(P => cr(P));
const MIST_A = firstContact(a => Math.min(...risingPts(a, 0.001).map(p => outside(OM0, p))) - CLEAR_M);
const mistakePose = { root: mist0.root, trunk: M_SPINE, reach: hands(gripAt(MIST_A), POLE_UP()) };

const HUMP = 0.08;
const LM_M = landmarksOf({ ...end, ...mistakePose }, H), LM_E = landmarksOf(end, H);
const HUMP_PTS = (() => {
  const A = LM_M.sacrum, B = LM_M.neck, flat = LM_E.sacrum.map((v, i) => (v + LM_E.backUpper[i]) / 2);
  const d = [0, LM_E.backUpper[1] - LM_E.sacrum[1], LM_E.backUpper[2] - LM_E.sacrum[2]], L = Math.hypot(...d);
  let n = [0, -d[2] / L, d[1] / L];
  if (n[1] < 0) n = n.map(v => -v);
  const P = flat.map((v, i) => v + n[i] * HUMP), C = P.map((v, i) => 2 * v - (A[i] + B[i]) / 2);
  const pts = Array.from({ length: 17 }, (_, k) => { const t = k / 16; return A.map((v, i) => (1 - t) ** 2 * v + 2 * t * (1 - t) * C[i] + t * t * B[i]); });
  return { pts, apex: pts[8], n };
})();
const HUMP_OUT = k => HUMP_PTS.apex.map((v, i) => v + HUMP_PTS.n[i] * k);
const ROUND_OFF = (() => { const a = HUMP_PTS.pts[7], b = LM_M.lumbar; return [+((a[2] - b[2]) * 146.29).toFixed(2), +(-(a[1] - b[1]) * 146.29).toFixed(2)]; })();

export const TBAR = { pivot: PIVOT, sHook: S_HOOK, hook: HOOK, handleL: HANDLE_L };
export const tbInfo = { rootY: +ROOT_Y.toFixed(3), pivotZ: +PIVOT[2].toFixed(3), startGrip: START_GRIP.map(v => +v.toFixed(3)),
  endGrip: END_GRIP.map(v => +v.toFixed(3)), riseCm: +((END_GRIP[1] - START_GRIP[1]) * 100).toFixed(1) };

// The bar is laid through the hook point (the grip's height plus the hanging handle), so the composer's `to` is the hook.
const hookOf = lm => [0, lm.grips[1] + HANDLE_L + RING_DROP, lm.grips[2]];
const rig = lm => landmine({ pivot: PIVOT, to: hookOf(lm), plates: [PLATE_T], plateD: PLATE_D });
const START_FRAME = barFrame(PIVOT, H0), START_PLATE = plateCorners(H0);
const phantom = [
  (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-line m-line', pts: [PIVOT, START_FRAME.end], z: 'center', part: 'startbar' } : null),
  (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-line m-line', pts: [START_PLATE[0], START_PLATE[2], START_PLATE[3], START_PLATE[1], START_PLATE[0]], z: 'center', part: 'startplate' } : null),
];
const floor = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  id: 't_bar_row', name: 'T-Bar Row', view: 'side', facing: 'right',
  camera: { x0: 232, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: PIVOT[2] - 0.2, to: 0.75 },
    ...perItem(rig, LANDMINE_ITEMS),
    lm => ({ type: 'vHandle', at: [0, lm.grips[1], lm.grips[2]], toward: [0, 1, 0], length: HANDLE_L, z: 'mid', part: 'handle' }),
    ...phantom,
  ],
  checks: [
    { landmark: 'heel.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'heel.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'grips', at: START_GRIP, pose: 'start', tol: 0.5 },
    { landmark: 'grips', at: END_GRIP, pose: 'end', tol: 0.5 },
  ],
  startParts: ['arm.r'],
  ghosts: { count: 2, parts: ['arm.r'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  zoom: { view: 'normal', k: 3 },   // D-LIB13S-ZOOM: the handle's path (grip.r) with the spec's own trim
  callouts: [
    { key: 'chest', text: 'Chest<br>parallel', anchor: 'backUpper', box: { left: 258, top: 116 }, cue: 'Keep your back straight and your chest level with the floor.' },
    { key: 'knees', text: 'Soft knees', anchor: 'knee.r', cue: 'Keep your knees slightly bent and your hips hinged back.' },
    { key: 'elbows', text: 'Elbows<br>back', anchor: 'elbow.r', box: { left: 138, top: 214 }, cue: 'Drive your elbows back and pull the handle to your lower chest.' },
  ],
  tempo: [{ phase: 'Pull', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: HUMP_PTS.pts },
      { kind: 'arrow', from: HUMP_OUT(0.12), to: HUMP_OUT(0.015) },
    ],
    tells: [
      { key: 'round', text: 'Back<br>rounds', anchor: { at: 'lumbar', pose: 'mistake', off: ROUND_OFF }, box: { left: 200, top: 112 }, cue: 'The back rounds forward over the bar.' },
      { key: 'tuck', text: 'Hips tuck<br>under', anchor: { at: 'sacrum', pose: 'mistake' }, box: { left: 100, top: 176 }, cue: 'The hips tuck under as the back curls.' },
    ],
  },
  pilot: { note: 'plate size: drawing convention (228 mm)' },
  alt: 'T-bar row, side view. Standing over a bar pinned at a floor pivot behind, a V-handle hooked under it near the plates, hinged with the chest level and knees soft, the lifter pulls the handle from straight arms toward the lower chest, elbows driving back, until the plates meet the torso.',
};
