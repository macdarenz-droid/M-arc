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
//  Bottom: lowered until the first of the barbell's plates, the seat and the buttock reaches the floor (c10 "slowly
//   lowering back to the ground", c1 "Sit on the floor"; with the pad resting on the body the seat lands first): the
//   pelvis tilt is SOLVED by bisection.
//  The ghosts: two in-between keys (poses.via) on the bench edge at a third and two thirds of the tilt, where plate.mjs
//   draws the two ghosts (ghostT 1/3, 2/3), so the ghosts pivot on the edge too (c9) instead of sliding into the bench.
//  The bar sits on its pad in the hip crease (c3, c4), resting on the drawn body in every pose (#306 6358957999 item
//   1): the pad wedged into the drawn front corner between the near thigh and the torso, as deep as the outlines let a
//   PAD_R pad sit (barIn below); on the flat top that is PAD_R out from the crease.
//  Hands hold the bar either side of the hips (c3, c24 "just wider than hip width"): each grip on the bar at x =
//   +-GRIP_X.
// Mistake (c11, c12, c13; Contreras: "the lifter substitutes by arching the back" to lock the weight out, c12): the
//  top reached with the lower back arched (Held 6, D-HELD6-HIPTHRUST, the D-A3-REVBOW form on LIB-SPINE): the end pose
//  with trunk.bow M_ARCH (12, the unsourced drawing size of reverse_lunge's approved bow): the pelvis tips under the
//  held thorax. The thorax, the bar, the hands and the feet stay at the end pose, and the upper back stays on the
//  bench edge (c9). One tell, `arch`, on the lumbar landmark, with a Mistake zoom at k 3; the ribs are in its cue.
// Camera: the reference scale (fit, capped at 146.29 px/m).
// Unsourced numbers (SIZES below; lb8/sizes.json holds each with its basis): PAD_R, GRIP_X, PLATE_D, SLEEVE_D,
//  BENCH_W, M_ARCH, FLOOR_BACK, FLOOR_FRONT; BENCH_TOP, START_TILT solved.
import { WINTER, REF, landmarksOf, normPose, resolve, fk, landmarks, bodyShapes } from '../engine.mjs';

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
// world crease point and outline normal for a root and pelvis tilt (pelvis frame: rotX(tilt) about the hip-joint centre)
const rotX = (v, a) => { const c = Math.cos(a * R), s = Math.sin(a * R); return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c]; };
const creaseAt = (root, tilt) => {
  const rel = rotX([0, (CREASE_REF[1] - REF.hjcY) * H, CREASE_REF[2] * H], tilt);
  return { c: [0, root[1] + rel[1], root[2] + rel[2]], n: rotX(NRM_REF, tilt) };
};
const hands = bar => ({ l: { at: [GRIP_X, bar[1], bar[2]], pole: [1, -0.6, 0] }, r: { at: [-GRIP_X, bar[1], bar[2]], pole: [-1, -0.6, 0] } });

// A body pivoted on the bench edge: pelvis tilt t, lumbar trunk k; the root placed so backUpper sits on the edge.
const onEdge = (t, k = 0, extra = {}) => {
  const p0 = { root: { at: [0, 0, 0], tilt: t }, trunk: { flex: k }, neck: 0, plant, ...extra };   // the object form in every pose (D-SPINE-MIX)
  const b = L(p0).backUpper;
  const root = [0, EDGE[1] - b[1], EDGE[2] - b[2]];
  return { ...p0, root: { at: root, tilt: t } };
};

// The bar rests in the hip crease (c3): the drawn crease is the front corner where the near thigh's outline meets the
// torso's (engine bodyShapes, side view, mm; on a folded hip the pelvis's own crease point lies under the thigh, so the
// corner is taken from the drawn outlines: their crossing on the thigh's front, never the one under it). The padded bar (radius PAD_R) sits as
// deep into that corner as the drawn body lets it: its centre is the point nearest the corner that keeps PAD_R clear of
// the torso and thigh outlines. On the flat top that is the corner plus PAD_R out along the front; on a folded hip (the
// bottom, the ghosts) the pad wedges into the V, touching the belly and the thigh both. Solved per pose: for each
// direction from the corner (a 4 deg scan of the full turn, then golden-section on the best), the first distance where
// the clearance reaches PAD_R (a throwing bisection on the scanned 2 mm bracket).
const MM = 1000, SIDE_CAM = { view: 'side', near: 'r', facing: 'right', pxm: MM, P: w => [w[2] * MM, w[1] * MM] };
const OUTLINE = /^(torso|thigh\.)/;
const inPoly = (P, [x, y]) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
const segD = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy, u = l2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2)) : 0; return Math.hypot(p[0] - a[0] - dx * u, p[1] - a[1] - dy * u); };
const clearOf = polys => p => { let d = Infinity, inn = false; for (const P of polys) { if (inPoly(P, p)) inn = true; for (let i = 0; i < P.length; i++) d = Math.min(d, segD(p, P[i], P[(i + 1) % P.length])); } return inn ? -d : d; };
const crossings = (A, B) => {      // every point where outline A's edges cross outline B's
  const out = [];
  for (let i = 0; i < A.length; i++) for (let j = 0; j < B.length; j++) {
    const p = A[i], p2 = A[(i + 1) % A.length], q = B[j], q2 = B[(j + 1) % B.length];
    const r = [p2[0] - p[0], p2[1] - p[1]], s = [q2[0] - q[0], q2[1] - q[1]], d = r[0] * s[1] - r[1] * s[0];
    if (Math.abs(d) < 1e-12) continue;
    const t = ((q[0] - p[0]) * s[1] - (q[1] - p[1]) * s[0]) / d, u = ((q[0] - p[0]) * r[1] - (q[1] - p[1]) * r[0]) / d;
    if (t >= 0 && t < 1 && u >= 0 && u < 1) out.push([p[0] + t * r[0], p[1] + t * r[1]]);
  }
  return out;
};
const barCache = new Map();
const barIn = p => {
  const tk = p.trunk && typeof p.trunk === 'object' ? p.trunk : { flex: p.trunk ?? 0 };   // number or object trunk (D-SPINE-MIX)
  const key = JSON.stringify([p.root.at, p.root.tilt, tk.flex ?? 0, tk.bow ?? 0].flat().map(v => +v.toFixed(9)));
  if (barCache.has(key)) return barCache.get(key);
  const b = { height: H }, sk = fk(resolve(normPose(p, b), b).q, b), shapes = bodyShapes(sk, SIDE_CAM).filter(x => x.poly && OUTLINE.test(x.key));
  const clear = clearOf(shapes.map(x => x.poly)), poly = k => shapes.find(x => x.key === k).poly;
  const { c, n } = creaseAt(p.root.at, p.root.tilt), C0 = [c[2] * MM, c[1] * MM], N = [n[2], n[1]], r = PAD_R * MM;
  const lm = landmarks(sk), K = lm['knee.r'], Hp = lm['hip.r'], T = lm['thighTop.r'], A = [1, 2].map(i => T[i] - (Hp[i] + (K[i] - Hp[i]) * 0.82));   // the thigh's front (y, z)
  const X = crossings(poly('thigh.r'), poly('torso')).sort((u, v) => (v[0] - u[0]) * A[1] + (v[1] - u[1]) * A[0])[0];
  if (!X) throw new Error('hip_thrust: the thigh and torso outlines do not meet');
  const at = (a, s) => { const ca = Math.cos(a * R), sa = Math.sin(a * R); return [X[0] + s * (N[0] * ca - N[1] * sa), X[1] + s * (N[0] * sa + N[1] * ca)]; };
  // the first distance (mm) along direction a where the pad clears the outline; Infinity when it does not within `max`
  // (30 cm, or the best distance found so far: a farther place cannot be the nearest)
  const reach = (a, max = 300) => {
    const f = s => clear(at(a, s)) - r;
    let s0 = 0;
    for (let s1 = 2; s1 <= max + 2; s1 += 2) { if (f(s1) >= 0) return bisect(f, s0, s1); s0 = s1; }
    return Infinity;
  };
  let best = 0, bs = Infinity;
  for (let a = -180; a < 180; a += 4) { const s = reach(a, Math.min(300, bs)); if (s < bs) { bs = s; best = a; } }
  if (!Number.isFinite(bs)) throw new Error('hip_thrust: the bar pad finds no clear place within 30 cm of the crease');
  let lo = best - 4, hi = best + 4;
  const g = (Math.sqrt(5) - 1) / 2;
  let x1 = hi - g * (hi - lo), x2 = lo + g * (hi - lo), f1 = reach(x1), f2 = reach(x2);
  for (let i = 0; i < 30; i++) { if (f1 < f2) { hi = x2; x2 = x1; f2 = f1; x1 = hi - g * (hi - lo); f1 = reach(x1); } else { lo = x1; x1 = x2; f1 = f2; x2 = lo + g * (hi - lo); f2 = reach(x2); } }
  const a = (lo + hi) / 2, q = at(a, reach(a)), bar = [0, q[1] / MM, q[0] / MM];
  barCache.set(key, bar);
  return bar;
};
const withBar = p => ({ ...p, reach: hands(barIn(p)) });

const end = withBar(onEdge(TOP_TILT));
export const BAR_TOP = barIn(end);
// ---- bottom (start): lowered until the plates or the seat (c1 "Sit on the floor") or the buttock reach the floor ----
const lowest = t => { const p = onEdge(t), l = L(p); return Math.min(barIn(p)[1] - PLATE_D / 2, l.seat[1], l.buttock[1]); };
export const START_TILT = bisect(lowest, -89, -20);
const start = withBar(onEdge(START_TILT));
// ---- the in-between keys: the rep pivots on the bench edge (c9), so the two ghosts (plate.mjs ghostT 1/3, 2/3, which
// fall exactly on these keys) are drawn on the edge too, at the tilts a third and two thirds of the way up ----
const via = [1, 2].map(i => withBar(onEdge(START_TILT + (TOP_TILT - START_TILT) * i / 3)));
// ---- Mistake (Held 6, D-HELD6-HIPTHRUST; the D-A3-REVBOW form): the end pose with the trunk bowed M_ARCH (LIB-SPINE
// trunk.bow): the pelvis tips M_ARCH under the held thorax, which is the lumbar arch. The thorax, the bar, the hands
// and the feet stay at the end pose, and backUpper stays on the edge ----
const mistakePose = { ...end, trunk: { flex: 0, bow: M_ARCH } };

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
// the bar of any pose (ghosts included), read back from the drawn body: the pelvis tilt from the hip-joint centre to
// the lumbar pivot and the lumbar bend from the lumbar pivot to backUpper (both carried by the body, body.mjs fk), the
// feet planted, as leg_press reads its sled back from the feet; then placed in the crease as above
const LUMBAR_REF = [0, (REF.lumbar[1] - REF.hjcY) * H, REF.lumbar[2] * H];
const UPPER_REF = [0, (0.75 - REF.lumbar[1]) * H, (-0.072 - REF.lumbar[2]) * H];   // backUpper (body.mjs landmarks) from the lumbar pivot
const ang = (a, b) => Math.atan2(a[2] - b[2], a[1] - b[1]) / R;
const tiltOf = lm => ang(lm.lumbar, lm.hips) - Math.atan2(LUMBAR_REF[2], LUMBAR_REF[1]) / R;
const trunkOf = lm => ang(lm.backUpper, lm.lumbar) - Math.atan2(UPPER_REF[2], UPPER_REF[1]) / R - tiltOf(lm);
const barOf = lm => barIn({ root: { at: lm.hips, tilt: tiltOf(lm) }, trunk: trunkOf(lm), neck: 0, plant });
const BARS = { start: barIn(start), end: BAR_TOP, mistake: BAR_TOP };   // the Mistake's bar is the end's (D-HELD6-HIPTHRUST)

export const HT = { edge: EDGE, benchTop: BENCH_TOP, bars: BARS, barIn, barOf, creaseAt, tiltOf, onEdge, via, start, end, mistakePose };
// The card's contact facts (lb8 DESIGN.md; D-LIB18-FACTS): each bound by a check on its landmark in its pose, at the
// drawn point (H6 reads the report's checks); the drawn-item tests prove the contact itself.
const factChecks = (pose, p, names) => names.map(landmark => ({ landmark, at: L(p)[landmark], pose, tol: 0.5 }));
export default {
  id: 'hip_thrust', name: 'Hip Thrust', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: EDGE_Z - BENCH_W - FLOOR_BACK, to: SOLE(1)[2] + FLOOR_FRONT },
    { type: 'bench', at: [0, BENCH_TOP, EDGE_Z - BENCH_W / 2], axis: 'x', width: BENCH_W, z: 'back' },
    ...Array.from({ length: BAR_ITEMS }, (_, k) => (lm, ctx) => barItems(ctx?.pose === 'mistake' ? BARS.mistake : barOf(lm))[k]),
    // the start bar's phantom (Q2 (c); DRAWING-GUIDE 4): the start layer drops moving equipment, so the start plate and
    // pad are redrawn as hidden lines in the end layer, where the Trace starts
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-line m-line', pts: [...ring(BARS.start, PLATE_D / 2), ring(BARS.start, PLATE_D / 2)[0]], z: 'front', part: 'phantom' } : null),
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-line m-line', pts: [...ring(BARS.start, PAD_R, 16), ring(BARS.start, PAD_R, 16)[0]], z: 'front', part: 'phantom' } : null),
  ],
  checks: [
    ...factChecks('start', start, ['heel.l', 'heel.r', 'ball.l', 'ball.r', 'wrist.l', 'wrist.r']),
    ...factChecks('end', end, ['heel.l', 'heel.r', 'wrist.l', 'wrist.r']),
    // c1 "Sit on the floor" (setup): the seat on the floor at the start (the bottom solve stops there: the seat lands
    // before the plates, which stay above the floor with the pad resting in the crease)
    { landmark: 'seat', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'start', tol: 0.5 },
    { landmark: 'backUpper', at: EDGE, pose: 'all', tol: 0.5 },                                  // c2, c9: the upper back on the bench edge
    ...['sole.l', 'sole.r'].map(landmark => ({ landmark, at: SOLE(landmark.endsWith('l') ? 1 : -1), pose: 'all', tol: 0.5 })),   // c1: feet flat
  ],
  ghosts: { count: 2, parts: ['trunk', 'leg.r', 'arm.r'] },
  trace: { point: 'hip.r', trim: [6, 8] },
  measure: { vertex: 'knee.r', from: 'hip.r', to: 'ankle.r', radius: 20, title: 'Knee', value: 'about 90°', expect: 90, box: { left: 260, top: 200 } },
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
      // one tell (D-HELD6-HIPTHRUST): `ribs` is dropped (1.86 px does not read) and kept in the cue, as reverse_lunge's
      { key: 'arch', text: 'Back<br>arched', anchor: { at: 'lumbar', pose: 'mistake' }, box: { left: 150, top: 170 }, cue: 'The lower back arches and the ribs flare up as the hips lock out.' },
    ],
  },
  zoom: { view: 'mistake', k: 3 },   // the ring on the lumbar arch; 3 is the smallest ladder k that passes (lumbar 4.10 px: 12.31 at k 3, 10.26 at k 2.5)
  alt: 'Hip thrust, side view. Upper back on a bench edge, feet flat, a padded barbell held in the hip crease: the hips drive up until shoulders, hips and knees form a level line with the shins vertical, then lower toward the floor.',
};
