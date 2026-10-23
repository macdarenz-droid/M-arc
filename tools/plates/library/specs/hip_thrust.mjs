// Hip thrust (barbell, flat bench), side view, figure's feet toward screen right. LIB-18 (LB8, mode H; tier A; census
// closest leg_press, closeness N; the bridge pose class, its first user, approved on the LB8 sheet: plan 2.2:165;
// D-LIB18-CLASSES).
// View: side (card plate.view = census view). The arched lower back with the ribs up (c11, c12), the bar in the hip
//  crease (c3), the bench edge under the upper back (c2, c9), the vertical shins (c6) and the knee angle (c8) read
//  side-on.
// Sources: research card docs/research/howto/cards/hip_thrust.json (research head 596dbe07): callouts =
//  plate.checkpoints (c3 Bar in crease, c12/c11/c10 Ribs down, c6/c8 Shins vertical); Mistake = plate.mistake (c11,
//  c12, c13: the lower back arched with the ribs up, drawable true); tempo = the card's tempo (c22: up 1, down 2,
//  pause 1, a drawing convention).
// Clone source: leg_press (the 8, main): the side-view figure laid back on a pad, the lumbar-pivot Mistake (its M_ROLL
//  rotation of the pelvis about REF.lumbar, leg_press.mjs:85-93) and the measured knee arc; bench_dip (#299 @ 5a9f004c)
//  for the vendor bench seen end-on and the throwing bisection; copied, never imported (D-LIB9-CLONE).
// Equipment: the vendor `bench`, seen end-on (axis x: the lifter's back meets its long side, c1, c2), behind the
//  lifter; the barbell with its 45 cm plates and a pad round the bar (c3, c4), drawn from `poly` so it is drawn in the
//  Mistake view when it moves (PQ-H9; the vendor `barbell` draws its side-view plate as a `line`); floor.
// Pose map (DESIGN.md section 9): identity. Start = plate.start (the bottom: upper back on the bench edge, c2; hips low,
//  knees bent, feet flat on the floor, c1; the bar on its pad in the hip crease, both hands holding it, c3, c4). End =
//  plate.end (the top: hips fully extended, the shoulders, hips and knees on one level line, c8; shins vertical, c6;
//  knees 90, c8; spine neutral, c8, c12; the upper back still on the bench edge, c9).
// Geometry decisions (confirmed by the engine report `checks` and the drawn-item tests):
//  Top: the pelvis laid back 90 (the shoulder and hip joints level: the torso parallel to the floor, c8), hips at 0
//   (fully extended, the thigh on the torso's line, c8), the shin plumb (c6) so the knee is 90 (c8), the foot flat on
//   the floor (c1). With the ankle at its standing height those facts fix the hip height; the bench top is SOLVED as
//   the height of the upper back (backUpper) on that line, and the bench's front edge sits under it (c2, c9).
//  The rep pivots on the bench edge (c9 "a pivot point around the bench"): every pose keeps backUpper on the edge and
//   the feet where the top plants them; the spine stays neutral (trunk 0, c10, c13).
//  Bottom: lowered until the first of the barbell's plates and the buttock reaches the floor (c10 "slowly lowering
//   back to the ground"): the pelvis tilt is SOLVED by bisection.
//  The bar sits on its pad in the hip crease (c3, c4): the crease point on the pelvis's front outline (body.mjs
//   torsoSide, between the points at .487 and .520 H), the bar centre PAD_R out along the outline's normal.
//  Hands hold the bar either side of the hips (c3, c24 "just wider than hip width"): each grip on the bar at x =
//   +-GRIP_X.
// Mistake (c11, c12, c13; Contreras: "the lifter substitutes by arching the back" to lock the weight out, c12): the
//  top reached with the lower back arched: the lumbar extended M_ARCH (hanging_leg_raise.mjs:69's trunk -12, the 8's
//  lumbar arch), the bar at the top's height (the lockout reached), the upper back still on the bench edge (c9) and
//  the feet planted: the root and the pelvis tilt are SOLVED for those three; the thorax turns ribs-up about the edge.
// Camera: the reference scale (fit, capped at 146.29 px/m).
// Unsourced numbers (SIZES below; lb8/sizes.json holds each with its basis): PAD_R, GRIP_X, PLATE_D, SLEEVE_D,
//  BENCH_W, M_ARCH, FLOOR_BACK, FLOOR_FRONT; BENCH_TOP, START_TILT, M_TILT solved.
import { WINTER, REF, landmarksOf } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ PAD_R: 0.045, GRIP_X: 0.2, PLATE_D: 0.45, SLEEVE_D: 0.05, BENCH_W: 0.29, M_ARCH: 12, FLOOR_BACK: 0.35, FLOOR_FRONT: 0.3,
  BODY_KG: 75, LOAD_KG: 60 });   // BODY_KG, LOAD_KG: the balance's masses (the centre of mass with the bar's load at the crease)
const { PAD_R, GRIP_X, PLATE_D, SLEEVE_D, BENCH_W, M_ARCH, FLOOR_BACK, FLOOR_FRONT } = SIZES;

// Bisection on a bracket (throws when the bracket holds no sign change; D-LIB9-CLONE b).
const bisect = (f, a, b) => {
  let fa = f(a);
  if (fa * f(b) > 0) throw new Error(`hip_thrust: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 50; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
  return (a + b) / 2;
};
const L = p => landmarksOf(p, H);

// ---- top (end): the level body on the bench edge ----
const TOP_TILT = -90;
const EDGE_Z = 0;                                                       // the bench's front edge (world origin in z)
const HIP_Y = WINTER.ankleH * H + WINTER.shank * H;                    // the knee at the hip's height over a plumb shin
const probe = L({ root: { at: [0, HIP_Y, 0], tilt: TOP_TILT }, hip: 0, knee: 90 });
export const BENCH_TOP = probe.backUpper[1];                           // solved: the upper back's height on the level line
const ROOT_TOP = [0, HIP_Y, EDGE_Z - probe.backUpper[2]];              // backUpper over the front edge
const EDGE = [0, BENCH_TOP, EDGE_Z];
// the feet: flat on the floor where the top's plumb shins put them (sole centre, c1, c6)
const topLm = L({ root: { at: ROOT_TOP, tilt: TOP_TILT }, hip: 0, knee: 90 });
const SOLE = s => [s * REF.hjcX * H, 0, topLm['ankle.r'][2] + REF.mid * H];
const plant = { l: { at: SOLE(1), normal: [0, 1, 0], toe: [0, 0, 1] }, r: { at: SOLE(-1), normal: [0, 1, 0], toe: [0, 0, 1] } };

// The hip crease (ref coordinates, pelvis): on torsoSide's front outline between (z .045, y .487) and (.058, .520) H,
// at the hip joint's height, and the outline's outward normal there.
const C0 = [0.045, 0.487], C1 = [0.058, 0.520], tC = (REF.hjcY - C0[1]) / (C1[1] - C0[1]);
const CREASE_REF = [0, C0[1] + (C1[1] - C0[1]) * tC, C0[0] + (C1[0] - C0[0]) * tC];
const NRM_REF = (() => { const dz = C1[0] - C0[0], dy = C1[1] - C0[1], l = Math.hypot(dz, dy); return [0, -dz / l, dy / l]; })();
// world crease and bar centre for a root and pelvis tilt (pelvis frame: rotX(tilt) about the hip-joint centre)
const rotX = (v, a) => { const c = Math.cos(a * R), s = Math.sin(a * R); return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c]; };
const barAt = (root, tilt) => {
  const rel = rotX([0, (CREASE_REF[1] - REF.hjcY) * H, CREASE_REF[2] * H], tilt), n = rotX(NRM_REF, tilt);
  return [0, root[1] + rel[1] + n[1] * PAD_R, root[2] + rel[2] + n[2] * PAD_R];
};
const hands = bar => ({ l: { at: [GRIP_X, bar[1], bar[2]], pole: [1, -0.6, 0] }, r: { at: [-GRIP_X, bar[1], bar[2]], pole: [-1, -0.6, 0] } });

// A body pivoted on the bench edge: pelvis tilt t, lumbar trunk k; the root placed so backUpper sits on the edge.
const onEdge = (t, k = 0, extra = {}) => {
  const p0 = { root: { at: [0, 0, 0], tilt: t }, trunk: k, neck: 0, plant, ...extra };
  const b = L(p0).backUpper;
  const root = [0, EDGE[1] - b[1], EDGE[2] - b[2]];
  return { ...p0, root: { at: root, tilt: t } };
};
const withBar = p => ({ ...p, reach: hands(barAt(p.root.at, p.root.tilt)) });

const end = withBar(onEdge(TOP_TILT));
export const BAR_TOP = barAt(end.root.at, TOP_TILT);
// ---- bottom (start): lowered until the plates or the buttock reach the floor ----
const lowest = t => { const p = onEdge(t), l = L(p); return Math.min(barAt(p.root.at, t)[1] - PLATE_D / 2, l.buttock[1]); };
export const START_TILT = bisect(lowest, -89, -20);
const start = withBar(onEdge(START_TILT));
// ---- Mistake: the arch at the top: lumbar extended M_ARCH, the bar at the top's height, backUpper on the edge ----
export const M_TILT = bisect(t => barAt(onEdge(t, -M_ARCH).root.at, t)[1] - BAR_TOP[1], TOP_TILT - 20, TOP_TILT + 25);
const mistakeBody = onEdge(M_TILT, -M_ARCH);
const mistakePose = withBar(mistakeBody);

const LE = L(end), LS = L(start), LM = L(mistakePose);
// the barbell from poly: the 45 cm plate as an outline over the figure (the vendor barbell's x-ray look), its inner
// ring, the sleeve and the pad round the bar (c4)
const ring = (c, r, n = 32) => Array.from({ length: n }, (_, k) => [0, c[1] + r * Math.sin(2 * Math.PI * k / n), c[2] + r * Math.cos(2 * Math.PI * k / n)]);
const barItems = bar => [
  { type: 'poly', pts: ring(bar, PLATE_D / 2), cls: 'eq-line', z: 'front' },
  { type: 'poly', pts: ring(bar, PAD_R), cls: 'eq', z: 'mid' },
  { type: 'poly', pts: ring(bar, SLEEVE_D / 2), cls: 'eq-solid', z: 'front' },
];
const BAR_ITEMS = 3;
// the bar of any pose (ghosts included), read back from the drawn pelvis: its tilt from the hip-joint centre to the
// lumbar pivot (both carried by the pelvis, body.mjs fk), as leg_press reads its sled back from the feet
const LUMBAR_REF = [0, (REF.lumbar[1] - REF.hjcY) * H, REF.lumbar[2] * H];
const tiltOf = lm => {
  const v = [lm.lumbar[1] - lm.hips[1], lm.lumbar[2] - lm.hips[2]];
  return (Math.atan2(v[1], v[0]) - Math.atan2(LUMBAR_REF[2], LUMBAR_REF[1])) / R;
};
const barOf = lm => barAt(lm.hips, tiltOf(lm));
const BARS = { start: barAt(start.root.at, START_TILT), end: BAR_TOP, mistake: barAt(mistakePose.root.at, M_TILT) };

export const HT = { edge: EDGE, benchTop: BENCH_TOP, bars: BARS, barAt, barOf, onEdge, start, end, mistakePose };
// The card's contact facts (lb8 DESIGN.md; D-LIB18-FACTS): each bound by a check on its landmark in its pose, at the
// drawn point (H6 reads the report's checks); the drawn-item tests prove the contact itself.
const factChecks = (pose, p, names) => names.map(landmark => ({ landmark, at: L(p)[landmark], pose, tol: 0.5 }));
export default {
  id: 'hip_thrust', name: 'Hip Thrust', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: EDGE_Z - BENCH_W - FLOOR_BACK, to: SOLE(1)[2] + FLOOR_FRONT },
    { type: 'bench', at: [0, BENCH_TOP, EDGE_Z - BENCH_W / 2], axis: 'x', width: BENCH_W, z: 'back' },
    ...Array.from({ length: BAR_ITEMS }, (_, k) => lm => barItems(barOf(lm))[k]),
    // the start bar's phantom (Q2 (c); DRAWING-GUIDE 4): the start layer drops moving equipment, so the start plate and
    // pad are redrawn as hidden lines in the end layer, where the Trace starts
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-line m-line', pts: [...ring(BARS.start, PLATE_D / 2), ring(BARS.start, PLATE_D / 2)[0]], z: 'front', part: 'phantom' } : null),
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-line m-line', pts: [...ring(BARS.start, PAD_R, 16), ring(BARS.start, PAD_R, 16)[0]], z: 'front', part: 'phantom' } : null),
  ],
  checks: [
    ...factChecks('start', start, ['heel.l', 'heel.r', 'ball.l', 'ball.r', 'wrist.l', 'wrist.r']),
    ...factChecks('end', end, ['heel.l', 'heel.r', 'wrist.l', 'wrist.r']),
    // c1 "Sit on the floor" (setup): the seat on the floor at the start; the drawn bottom stops where the plates reach the
    // floor first, so the seat sits above it: a miss recorded with the hold (CARD FIELDS fix 5)
    { landmark: 'seat', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'start', tol: 0.5 },
    { landmark: 'backUpper', at: EDGE, pose: 'all', tol: 0.5 },                                  // c2, c9: the upper back on the bench edge
    ...['sole.l', 'sole.r'].map(landmark => ({ landmark, at: SOLE(landmark.endsWith('l') ? 1 : -1), pose: 'all', tol: 0.5 })),   // c1: feet flat
  ],
  ghosts: { count: 2, parts: ['trunk', 'leg.r', 'arm.r'] },
  trace: { point: 'hip.r', trim: [6, 8] },
  measure: { vertex: 'knee.r', from: 'hip.r', to: 'ankle.r', radius: 20, title: 'Knee', value: 'about 90°', expect: 90 },
  callouts: [
    { key: 'crease', text: 'Bar in<br>crease', anchor: [0, BAR_TOP[1] + PAD_R, BAR_TOP[2]], box: { left: 196, top: 150 }, cue: 'The bar sits in your hip crease, held there by your hands.' },
    { key: 'ribs', text: 'Ribs<br>down', anchor: { along: ['chest', 'navel'], t: 0.4 }, box: { left: 70, top: 170 }, cue: 'Keep your ribs down and lower back neutral through the whole rep.' },
    { key: 'shins', text: 'Shins<br>vertical', anchor: { along: ['knee.r', 'ankle.r'], t: 0.5 }, cue: 'At the top your shins are vertical and your torso is flat.' },
  ],
  tempo: [{ phase: 'Lift', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', smooth: true, pts: [{ at: 'backUpper', pose: 'mistake' }, { at: 'backMid', pose: 'mistake' }, { at: 'sacrum', pose: 'mistake' }, { at: 'buttock', pose: 'mistake' }] },
    ],
    tells: [
      { key: 'arch', text: 'Back<br>arched', anchor: { along: ['navel', 'hips'], t: -0.15, pose: 'mistake' }, box: { left: 150, top: 150 }, cue: 'The lower back arches as the hips lock out.' },
      { key: 'ribs', text: 'Ribs up', anchor: { along: ['chest', 'navel'], t: 0.4, pose: 'mistake' }, box: { left: 50, top: 180 }, cue: 'The ribs flare up instead of staying down.' },
    ],
  },
  alt: 'Hip thrust, side view. Upper back on a bench edge, feet flat, a padded barbell held in the hip crease: the hips drive up until shoulders, hips and knees form a level line with the shins vertical, then lower toward the floor.',
};
