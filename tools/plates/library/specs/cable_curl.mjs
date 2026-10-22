// Cable curl (straight bar, low pulley, standing, facing the stack), side view, figure faces screen right, toward the
// column.
// View: SIDE (card plate.view = census view). The elbows staying close to the torso, the forearm sweep from slightly
// bent to fully bent, the still body and the fault, the arms fully straight at the bottom (c13), are sagittal.
// Form: research card docs/research/howto/cards/cable_curl.json (research head a8e66f32, identical at 3812989f), plate
//  section: start "Standing upright, feet about hip-width (c2), a step back from the low pulley (c1); arms down with the
//  elbows slightly bent, not fully extended (c13), palms up on the bar, hands about shoulder-width (c1); elbows close to
//  the torso (c3); wrists straight (c9)"; end "Elbows fully bent, bar near the shoulders (c3); upper arms still or
//  slightly forward, never back (c3); body in the same upright position (c8); wrists straight (c9)".
// Pose map (D-LIB15-POSE, #290 6340022161; DESIGN.md section 9): the spec's start is the card's end (the top, c3 "raise
//  the handle up towards your shoulders") and the spec's end is the card's start (the bottom, c13 "keep your arm
//  slightly bent"), because the fault sits at the bottom (c13) and the engine draws the Mistake against the spec's end.
//  The drawn order is the lowering (top -> bottom).
// Clone sources (D-LIB15-CLONE, copied never imported): lat_pulldown (main: the column, stack and pulley sizes; their
//  low-pulley form is overhead_cable_triceps_extension's, this branch) and dumbbell_biceps_curl (pilot A #109 @ ff7c5c4f:
//  the standing base, the curl arm with the upper arm pinned).
// Geometry decisions:
//  - Standing tall: feet hip width (c2), knees soft, the root solved from the knee angle (dumbbell_biceps_curl's).
//  - Upper arms vertical in both poses (c3: "keep it still"), so only the elbow moves; ELBOW_TOP fully bent (c3),
//    ELBOW_BOTTOM the soft bottom (c13 "slightly bent"): 18 deg, machine_chest_press.mjs:45's soft-elbow precedent
//    (the 8, main; #290 6343211054 item 7).
//  - The bar: a 28 mm straight bar seen end-on, its centre between the fists (both hands, shoulder width, c1), drawn as a
//    `poly` disc so it outlines in the Mistake (PQ-H9); the cable from the low pulley's upper tangent to the bar, with a
//    thin `poly` twin in the Mistake pose (eq/rope.mjs's pattern).
//  - Column in front of the lifter, the low pulley PULLEY_GAP ahead of the toes ("a step back", c1); the stack lifts by
//    the cable paid out (1:1), 3 cm pre-lift.
// Unsourced numbers (13.3 must-fix 14): KNEE_SOFT, FOOT_X, ELBOW_TOP (the card says "fully bent"), the column, stack and
//  pulley sizes (lat_pulldown's), the low pulley height (16 cm, "lowest position"), PULLEY_GAP, the bar diameter.
// Callouts, Mistake, tempo: the 3 checkpoints are the callouts (c3, c9, c8); the Mistake is the card's plate.mistake
//  (c13, drawable true): the elbows go fully straight at the bottom, drawn against the spec's end (the bottom).
//  Tempo: Lower 2 s, Curl 1 s (c10; pause 0, so no Hold; lb5/tempo.json; the drawn order); no Rest.
import { WINTER, REF, landmarksOf, bodyShapes, fk, resolve, normPose } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const KNEE_SOFT = 6;
const FOOT_X = 0.11;                                   // mid-soles hip width (c2)
const FOOT_Z = REF.mid * H;
const LEG = (() => { const a = WINTER.thigh * H, b = WINTER.shank * H, k = KNEE_SOFT * R; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k)); })();
const ROOT_Y = Math.sqrt(LEG * LEG - (FOOT_X - REF.hjcX * H) ** 2) + WINTER.ankleH * H;
const ELBOW_TOP = 140, ELBOW_BOTTOM = 18;              // fully bent (c3; dumbbell_biceps_curl :55); slightly bent (c13; machine_chest_press.mjs:45)
const SCAP = { elev: -1, pro: -1 };                    // shoulders set, as dumbbell_biceps_curl (c8 still body)

const feet = { l: { at: [FOOT_X, 0, FOOT_Z] }, r: { at: [-FOOT_X, 0, FOOT_Z] } };
const base = { root: { at: [0, ROOT_Y, 0], tilt: 0 }, trunk: 0, neck: 0, scap: SCAP, wrist: 0, plant: feet, shoulder: { flex: 0, rot: 0 } };
const start = { ...base, elbow: ELBOW_TOP };            // card end: the top
const end = { ...base, elbow: ELBOW_BOTTOM };           // card start: the bottom
// Mistake (card plate.mistake, c13): "Arms fully extended at the bottom, so the biceps lose tension between reps." The
// elbows straighten fully (0 deg) at the bottom; nothing else changes. 0 deg is the card's "fully extended", not a size.
const mistakePose = { elbow: 0 };
// The faulty arm on top (#290 6343211054 item 5): the engine masks its outline inside the end figure, so it is redrawn as
// Mistake guides (dashed outlines, not masked), dumbbell_biceps_curl's misArm (pilot A): engine body shapes on a
// 1000 px/m probe camera, on the engine's Catmull-Rom spline, mapped back to world metres.
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
function misArm() {
  const bd = { height: H }, probe = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
  const keys = ['fore.r', 'fist.r'];
  return bodyShapes(fk(resolve(normPose({ ...end, ...mistakePose }, bd), bd).q, bd), probe).filter(sh => keys.includes(sh.key))
    .map(sh => cr(sh.poly, sh.key.startsWith('fist') ? 4 : 8).map(([x, y]) => [0, -y / 1000, x / 1000]));
}
const MIS_ARM = misArm();

// Column in front of the lifter (world z > 0), lat_pulldown tower sizes.
const TOE_Z = landmarksOf(end, H)['toe.r'][2];
const PULLEY_GAP = 0.60;                               // the low pulley's front this far ahead of the toes ("a step back", c1)
const LOW = { y: 0.16, r: 0.045 };
LOW.z = TOE_Z + PULLEY_GAP + LOW.r;
const COL = { z0: LOW.z + 0.06, z1: LOW.z + 0.32, h: 2.14 };   // front (lifter side) and back uprights
const STACK_Z = (COL.z0 + COL.z1) / 2;
const TOP = { y: COL.h - 0.07, r: 0.035 };
const PLATES = 16, PLATE_H = 0.025, LIFT0 = 0.03, BAR_R = 0.014;

// Upper tangent point on the low pulley toward a point b (side-view plane), on the lifter side.
function lowTangent(b) {
  const dz = b[2] - LOW.z, dy = b[1] - LOW.y, D = Math.hypot(dz, dy), a0 = Math.atan2(dy, dz), al = Math.acos(LOW.r / D);
  const c = [a0 + al, a0 - al].map(a => [0, LOW.y + LOW.r * Math.sin(a), LOW.z + LOW.r * Math.cos(a)]);
  return c[0][1] > c[1][1] ? c[0] : c[1];
}
const barOf = lm => [0, lm.grips[1], lm.grips[2]];
const cableLen = lm => { const b = barOf(lm), t = lowTangent(b); return Math.hypot(b[1] - t[1], b[2] - t[2]); };
const disc = (c, r, n = 12) => Array.from({ length: n }, (_, k) => [0, c[1] + r * Math.sin(2 * Math.PI * k / n), c[2] + r * Math.cos(2 * Math.PI * k / n)]);
// a thin poly twin of a cable a -> b (side plane, 2 mm either side), drawn only in the Mistake pose (PQ-H9)
const twin = (a, b, t = 0.002) => { const dy = b[1] - a[1], dz = b[2] - a[2], L = Math.hypot(dy, dz), ny = -dz / L * t, nz = dy / L * t;
  return [[0, a[1] + ny, a[2] + nz], [0, b[1] + ny, b[2] + nz], [0, b[1] - ny, b[2] - nz], [0, a[1] - ny, a[2] - nz]]; };
const LEN_BOTTOM = cableLen(landmarksOf(end, H));

export default {
  id: 'cable_curl', name: 'Cable Curl', view: 'side', facing: 'right',
  camera: { x0: 140, y0: 339 },                  // the reference scale (SPEC 1 default); the figure left of the column
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.4, to: COL.z1 + 0.1 },
    { type: 'box', at: [0, 0.022, (COL.z0 - 0.12 + COL.z1 + 0.03) / 2], w: COL.z1 + 0.03 - COL.z0 + 0.12, h: 0.044, rc: 1, z: 'back' },   // base rail
    { type: 'box', at: [0, COL.h + 0.03, (COL.z0 - 0.03 + COL.z1 + 0.03) / 2], w: COL.z1 - COL.z0 + 0.06, h: 0.06, rc: 1.5 },            // top frame
    ...[COL.z0, COL.z1].map(z => ({ type: 'box', at: [0, COL.h / 2, z], w: 0.05, h: COL.h, rc: 1 })),
    { type: 'pulley', at: [0, TOP.y, STACK_Z], r: TOP.r },
    { type: 'pulley', at: [0, TOP.y, LOW.z], r: TOP.r },
    { type: 'pulley', at: [0, LOW.y, LOW.z], r: LOW.r },
    { type: 'cable', from: [0, TOP.y + TOP.r, STACK_Z], to: [0, TOP.y + TOP.r, LOW.z], z: 'back' },
    { type: 'cable', from: [0, TOP.y, LOW.z - TOP.r], to: [0, LOW.y, LOW.z - LOW.r], z: 'back' },
    ...[-0.05, 0.05].map(o => ({ type: 'line', cls: 'eq-thin', pts: [[0, 0.06, STACK_Z + o], [0, 1.80, STACK_Z + o]] })),   // guide rods
    lm => {                                            // the stack lifts by the cable paid out (1:1) above the bottom pose
      const lift = Math.max(0, LIFT0 + cableLen(lm) - LEN_BOTTOM);
      return [
        { type: 'stack', base: [0, 0, STACK_Z], plates: PLATES, load: 6, w: 0.16, lift, rods: false, part: 'stack' },
        { type: 'cable', from: [0, TOP.y, STACK_Z], to: [0, 0.06 + PLATES * PLATE_H + lift, STACK_Z], z: 'back', part: 'stack' },
      ];
    },
    lm => ({ type: 'cable', from: lowTangent(barOf(lm)), to: barOf(lm), z: 'center', part: 'bar' }),
    (lm, ctx) => (ctx.pose === 'mistake' ? { type: 'poly', cls: 'eq', z: 'center', part: 'bar', pts: twin(lowTangent(barOf(lm)), barOf(lm)) } : null),
    lm => ({ type: 'poly', curve: true, cls: 'eq-solid', z: 'mid', part: 'bar', pts: disc(barOf(lm), BAR_R) }),
  ],
  checks: [
    { landmark: 'heel.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    // the elbows stay at the sides (c3): on the vertical plane through the shoulder joint, start and end
    ...['start', 'end'].map(pose => ({ landmark: 'elbow.r', plane: { point: [0, 0, SCAP.pro / 100], normal: [0, 0, 1] }, pose, tol: 0.5 })),
  ],
  ghosts: { count: 3, parts: ['arm.r', 'bar'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  measure: { vertex: 'elbow.r', from: 'shoulder.r', to: 'wrist.r', radius: 18, title: 'Elbow', value: 'slightly bent', box: { left: 174, top: 98 } },
  callouts: [
    { key: 'elbows', text: 'Elbows at<br>sides', anchor: { at: 'elbow.r', off: [-4, 0] }, box: { left: 32, top: 162 }, cue: 'Keep the elbows close to your torso. Never let the upper arms go back.' },
    { key: 'wrists', text: 'Straight<br>wrists', anchor: { at: 'wrist.r', off: [-4, 0] }, box: { left: 43, top: 208 }, cue: 'Keep the hand in line with the forearm.' },
    { key: 'still', text: 'Still<br>body', anchor: 'backUpper', box: { left: 56, top: 116 }, cue: 'Keep the torso upright and still. Only the arms move.' },
  ],
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Curl', s: 1, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['bar'],
    guides: MIS_ARM.map(pts => ({ kind: 'dashed', pts: [...pts, pts[0]] })),   // the straightened forearm and fist, on top
    tells: [
      { key: 'straight', text: 'Arms locked<br>straight', anchor: { at: 'wrist.r', pose: 'mistake' }, box: { left: 16, top: 198 }, cue: 'Your arms go fully straight at the bottom, so the biceps lose tension.' },
    ],
  },
  alt: 'Cable curl, side view. Standing a step back from a low cable pulley with a straight bar in both hands, palms up, the elbows at the sides. The lifter lowers the bar from the shoulders to the thighs, stopping with the elbows slightly bent.',
};
