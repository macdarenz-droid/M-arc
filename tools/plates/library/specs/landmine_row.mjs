// Landmine row, side view, figure facing screen right. LIB-13 (LB3, mode H; the landmine composer's anchor, ruling
// D-LIB13-LANDMINE).
// View: side (card plate.view = census view). The parallel torso, the hinge and the bar end rising to the chest are
// front-to-back (c3, c6).
// Sources: research card docs/research/howto/cards/landmine_row.json (research head 2dd60ae0): callouts =
//  plate.checkpoints (c3 Torso parallel, c5 Brace first, c6 Elbows back); Mistake = plate.mistake (c9, c11: the lower
//  back rounds over the bar); tempo = plate.tempo (c12: up 1, down 2, pause 0).
// Clone source: barbell_row (#109 @ 48d49bb), its held-hinge body and solver copied (D-LIB9-CLONE), never imported.
// Rig (eq/landmine.mjs): the bar pinned at a floor pivot behind the lifter, running forward between the feet, the
//  loaded end in front; the lifter straddles the loaded end (c2), hands one above the other on the bar just behind
//  the plates (c4). The card marks this layout "inferred from c1, c2": every rig position below is unsourced.
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Feet: mid-soles 33 cm apart (between hip and shoulder width, c2: the midpoint of the 22-45 cm span of this body's
//   hip and shoulder widths), toes out 5 deg; mid-foot at world z = 0.
//  Trunk and legs are one held hinge in start and end (only the arms, shoulder blades and bar move): thorax TRUNK_INCL
//   80 deg from vertical ("roughly parallel", c3) = pelvis 77 + lumbar 3 (back straight); knees KNEE 30 deg (hips and
//   knees bent, c3); the root ROOT_Z 15 cm behind mid-foot; its height SOLVED for the knee angle (bracket 0.5-0.935).
//  Hands (c4): one above the other on the bar's axis at the midline, the far hand just behind the inner collar
//   (GRIP_GAP 5 cm), the near hand HAND_SEP 9 cm further toward the pivot. Wrists bent back 35 deg into the pull grip
//   (the card's recorded convention, R-LB3-5).
//  Start: the near arm hangs straight, ARM_BACK 10 deg behind vertical (the shoulders ahead of the weight, c2); the
//   pivot is SOLVED onto the floor so the bar runs through both hands.
//  End (c6 "bar end pulled toward the chest"; c20, MECH from the T-bar row: "as far as possible before the plates make
//   contact with your torso"): elbows driven back, shoulder blades squeezed (4 cm); the bar turns up about the pivot to
//   the first contact (scanned up from the start angle in 0.01 rad steps, then solved): the nearest point of the
//   plate or of the bar's surface from the near hand out sits CLEAR 5 mm off the drawn torso and head outline (the
//   engine's bodyShapes). The plate reaches the chest first; the hands rise about 31 cm. One via pose on the same
//   circle keeps the ghosts and the Trace on the arc. The start bar and plate are redrawn as a dashed phantom in the
//   end pose (13 Q2 (c)).
//  Plate: the 10 lb iron plate, 228 mm (the drawing convention below).
//  Mistake (c9, c11): the lower back rounds over the bar: the pelvis tucks M_TUCK and the lumbar spine flexes M_SPINE
//   (illustrative; the card gives no number), the hips and feet held; the bar comes up on its circle to the first
//   contact with the rounded torso (the same rule). A dashed hump guide shows the round (romanian_deadlift's method).
// Unsourced numbers: TOE_OUT 5, TRUNK_INCL 80, SPINE 3, KNEE 30, ROOT_Z -0.15, ARM_BACK 10, GRIP_GAP 5 cm, HAND_SEP
//  9 cm, CLEAR 5 mm, PRO_START 2 / PRO_END -4 cm, WRIST -35 (convention), M_TUCK 30,
//  M_SPINE 40, HUMP 8 cm; the landmine sizes (eq/landmine.mjs header).
import { bodyShapes, fk, landmarksOf, normPose, resolve } from '../engine.mjs';
import { LANDMINE, LANDMINE_ITEMS, alongBar, barFrame, hingeAt, landmine } from '../eq/landmine.mjs';
import { perItem } from '../eq/parts.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.165, TOE_OUT = 5;

const TRUNK_INCL = 80, SPINE = 3, KNEE = 30, ROOT_Z = -0.15;
const ARM_BACK = 10, GRIP_GAP = 0.05, HAND_SEP = 0.09, CLEAR = 0.005, WRIST = -35;
// Shoulder to grip centre at full reach as the engine's IK measures it with the wrist bent back WRIST deg (body.mjs
// solveReach: upper arm + the forearm-and-hand chord), at 99.98%: the IK then turns the forearm only by the hand's
// bend (about 9 deg), so the arm reads straight.
const REACH = (() => { const g = 0.46 * 0.108 * H, w = WRIST * Math.PI / 180; return (0.186 * H + Math.hypot(0.146 * H + g * Math.cos(w), g * Math.sin(w))) * 0.9998; })();
const PRO_START = 2, PRO_END = -4;
// Plate: one 10 lb iron plate per side, 228 mm across and 31 mm thick (Rogue Machined Olympic Plates, "10LB: 228MM",
// "10LB Plate Width 1.22\"", roguefitness.com, read 2026-10-19), a drawing convention (card gaps: no source gives the
// plate size; c20: smaller plates give more range). The largest catalogue iron plate that passes PQ-H3 card-true here:
// the 25 lb (300 mm) leaves a 17.8 px Trace. D-LIB13-LANDMINE-2 2.
export const PLATE_D = 0.228, PLATE_T = 0.031;
const S_FAR = LANDMINE.barLen - LANDMINE.collarFromEnd - GRIP_GAP, S_NEAR = S_FAR - HAND_SEP;   // hands' distances from the pivot

const toe = s => [s * Math.sin(TOE_OUT * R), 0, Math.cos(TOE_OUT * R)];
const feet = { l: { at: [FOOT_X, 0, 0], toe: toe(1) }, r: { at: [-FOOT_X, 0, 0], toe: toe(-1) } };
const kneeOf = lm => {
  const a = [0, 1, 2].map(i => lm['hip.r'][i] - lm['knee.r'][i]), b = [0, 1, 2].map(i => lm['ankle.r'][i] - lm['knee.r'][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
// Bracketed root finder (Illinois regula falsi): throws when f(a) and f(b) have the same sign (D-LIB9-CLONE b).
export const solve = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`landmine_row: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 60 && Math.abs(b - a) > 1e-7; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const body = (y, pro, tilt = TRUNK_INCL - SPINE, trunk = SPINE) => ({ root: { at: [0, y, ROOT_Z], tilt }, trunk, neck: 0, scap: { pro }, wrist: WRIST, plant: feet });
const ROOT_Y = solve(y => kneeOf(landmarksOf(body(y, PRO_START), H)) - KNEE, 0.5, 0.935);

// Start: the near hand hangs ARM_BACK behind vertical below the near shoulder, on the midline.
const S0 = landmarksOf(body(ROOT_Y, PRO_START), H)['shoulder.r'];
const drop = Math.sqrt(REACH ** 2 - S0[0] ** 2);
const START_NEAR = [0, S0[1] - drop * Math.cos(ARM_BACK * R), S0[2] - drop * Math.sin(ARM_BACK * R)];
// The pivot on the floor behind: the hinge point S_NEAR from the near hand along the bar.
const PIVOT = hingeAt(START_NEAR[2] - Math.sqrt(S_NEAR ** 2 - (START_NEAR[1] - LANDMINE.hingeH) ** 2));
const farOf = near => alongBar(PIVOT, near, S_FAR);
const hands = (near, pole) => ({ r: { at: near, pole }, l: { at: farOf(near), pole: [-pole[0], pole[1], pole[2]] } });
const start = { ...body(ROOT_Y, PRO_START), reach: hands(START_NEAR, [-0.2, 0, -1]) };

// End (c6, c20): the bar turns up about the pivot to the first contact of the plate or the bar with the drawn torso
// and head outline (CLEAR 5 mm): the plates reach the chest; the hands stop below it.
const angOf = p => Math.atan2(p[1] - PIVOT[1], p[2] - PIVOT[2]);
const arcAt = a => [0, PIVOT[1] + S_NEAR * Math.sin(a), PIVOT[2] + S_NEAR * Math.cos(a)];
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
export const plateCorners = near => {
  const { u, n, collar } = barFrame(PIVOT, near), o = n.map(v => v * PLATE_D / 2);
  return [0.01, 0.01 + PLATE_T].flatMap(k => [1, -1].map(sg => collar.map((v, i) => v + u[i] * k + sg * o[i])));
};
// The bar's surface from the near hand to its free end (sampled every 2 cm, radius = the sleeve's) also stays clear.
const barPts = near => {
  const { n } = barFrame(PIVOT, near), out = [];
  for (let s = S_NEAR; s <= LANDMINE.barLen; s += 0.02) for (const sg of [1, -1]) out.push(alongBar(PIVOT, near, s).map((v, i) => v + sg * n[i] * LANDMINE.sleeveD / 2));
  return out;
};
const clearAt = (polys, a) => Math.min(...[...plateCorners(arcAt(a)), ...barPts(arcAt(a))].map(p => outside(polys, p))) - CLEAR;
const A0 = angOf(START_NEAR);
// The first contact as the bar turns up: scan from the start angle in 0.01 rad steps to the first sign change of f
// (clearance), then solve inside that step. Throws if nothing meets the torso within 0.6 rad.
const firstContact = f => {
  for (let a = A0; a < A0 + 0.6; a += 0.01) if (f(a) > 0 && f(a + 0.01) <= 0) return solve(f, a, a + 0.01);
  throw new Error(`${'landmine_row'}: no contact within 0.6 rad`);
};
const end0 = body(ROOT_Y, PRO_END), LE0 = landmarksOf(end0, H), OE0 = outlineOf(end0);
const END_A = firstContact(a => clearAt(OE0, a));
const END_NEAR = arcAt(END_A);
const dorsal = lm => { const d = [0, 1, 2].map(i => lm.backUpper[i] - lm.chest[i]), L = Math.hypot(...d); return d.map(v => v / L); };
// Elbows driven back (c6): the elbow pole points back and a little up, out to the side.
const POLE_UP = () => [-0.5, 0.5, -2];
const end = { ...end0, reach: hands(END_NEAR, POLE_UP(LE0)) };
// One via pose half way round the arc keeps the ghosts and the Trace on the circle.
const VIA_NEAR = arcAt((A0 + END_A) / 2);
const via = [{ ...body(ROOT_Y, (PRO_START + PRO_END) / 2), reach: hands(VIA_NEAR, [-0.4, -0.3, -1]) }];

// Mistake (c9, c11): pelvis tucked, lumbar flexed, hips and feet held; the bar comes up on its circle until the plates
// meet the rounded torso (the same 1 cm rule).
const M_TUCK = 30, M_SPINE = 40;
const mist0 = body(ROOT_Y, PRO_END, TRUNK_INCL - SPINE - M_TUCK, M_SPINE), LM0 = landmarksOf(mist0, H), OM0 = outlineOf(mist0);
const MIST_A = firstContact(a => clearAt(OM0, a));
const MIST_NEAR = arcAt(MIST_A);
const mistakePose = { root: mist0.root, trunk: M_SPINE, reach: hands(MIST_NEAR, POLE_UP(LM0)) };

// The rounded back as one dashed arc (romanian_deadlift's HUMP method).
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

export const LM_ROW = { pivot: PIVOT, sNear: S_NEAR, sFar: S_FAR };
export const lmInfo = { rootY: +ROOT_Y.toFixed(3), pivotZ: +PIVOT[2].toFixed(3), startNear: START_NEAR.map(v => +v.toFixed(3)), endNear: END_NEAR.map(v => +v.toFixed(3)), riseCm: +((END_NEAR[1] - START_NEAR[1]) * 100).toFixed(1) };

const rig = lm => landmine({ pivot: PIVOT, to: lm['grip.r'], plates: [PLATE_T], plateD: PLATE_D });
// The start bar and plate, redrawn as a dashed phantom in the end pose (the start layer never draws moving equipment;
// 13 Q2 (c), DRAWING-GUIDE section 4): `line` items, never in the Mistake pose.
const START_FRAME = barFrame(PIVOT, START_NEAR), START_PLATE = plateCorners(START_NEAR);
const phantom = [
  (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-line m-line', pts: [PIVOT, START_FRAME.end], z: 'center', part: 'startbar' } : null),
  (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-line m-line', pts: [START_PLATE[0], START_PLATE[2], START_PLATE[3], START_PLATE[1], START_PLATE[0]], z: 'center', part: 'startplate' } : null),
];
const floor = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  id: 'landmine_row', name: 'Landmine Row', view: 'side', facing: 'right',
  camera: { x0: 232, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: PIVOT[2] - 0.2, to: 0.75 },
    ...perItem(rig, LANDMINE_ITEMS),
    ...phantom,
  ],
  checks: [
    { landmark: 'heel.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'heel.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'grip.r', at: START_NEAR, pose: 'start', tol: 0.5 },
    { landmark: 'grip.r', at: END_NEAR, pose: 'end', tol: 0.5 },
    { landmark: 'grip.l', at: farOf(END_NEAR), pose: 'end', tol: 0.5 },
  ],
  startParts: ['arm.r'],
  ghosts: { count: 2, parts: ['arm.r'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  callouts: [
    { key: 'torso', text: 'Torso<br>parallel', anchor: 'backUpper', box: { left: 258, top: 116 }, cue: 'Keep your back straight and your torso roughly level with the floor.' },
    { key: 'brace', text: 'Brace first', anchor: { along: ['backMid', 'sacrum'], t: 0.5 }, box: { left: 160, top: 136 }, cue: 'Brace your trunk before each pull so your lower back does not round.' },
    { key: 'elbows', text: 'Elbows<br>back', anchor: 'elbow.r', box: { left: 138, top: 214 }, cue: 'Drive your elbows back and pull the bar to your chest.' },
  ],
  tempo: [{ phase: 'Pull', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: HUMP_PTS.pts },
      { kind: 'arrow', from: HUMP_OUT(0.12), to: HUMP_OUT(0.015) },
    ],
    tells: [
      { key: 'round', text: 'Lower back<br>rounds', anchor: { at: 'lumbar', pose: 'mistake', off: ROUND_OFF }, box: { left: 200, top: 112 }, cue: 'The lower back rounds over the bar.' },
      { key: 'tuck', text: 'Hips tuck<br>under', anchor: { at: 'sacrum', pose: 'mistake' }, box: { left: 100, top: 176 }, cue: 'The hips tuck under as the back curls.' },
    ],
  },
  pilot: { note: 'plate size: drawing convention (228 mm)' },
  alt: 'Landmine row, side view. Straddling the loaded end of a bar pinned at a floor pivot behind, hinged with the torso roughly level and the back straight, the lifter pulls the bar end from straight arms up to the chest, driving the elbows back.',
};
