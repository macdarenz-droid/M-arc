// Weighted dip (parallel bars, dip belt and plate), side view, figure facing screen right. LIB-17 (LB7, mode H; tier A;
// census closest pull_up, closeness N; the support pose class, anchor one_arm_dumbbell_row (LB3 #274), held until it
// is pinned: plan 2.2:159; the `dipBars` composer's anchor plate: plan 2.1:129-130, :141).
// View: side (card plate.view = census view). The depth (upper arm against the floor line), the elbows travelling back,
//  the shoulders down and the plate hanging low and still (c3-c6, c8) read side-on.
// Sources: research card docs/research/howto/cards/weighted_dip.json (research head e5ed66ca, F-LB7-1): callouts =
//  plate.checkpoints (c3/c6 Shoulders down, c4 Elbows back, c4 Depth to parallel); Mistake = plate.mistake (c14, c7:
//  cutting reps short, stopping well above parallel, drawable); tempo = plate.tempo (c4, c9: up 1, down 2, pause 0).
// Clone source: pull_up (the 8, main) for the hanging body (ankle, the shoulders down and back) and the elbow-bend arc
//  (bend from straight, the upper arm extended past the elbow), copied, never imported (D-LIB9-CLONE).
// Equipment: `dipBars` (eq/dipBars.mjs, this card) for the station; the dip belt, chain and plate (c8) drawn here from
//  `poly` (they move with the body, so they are drawn in the Mistake view, PQ-H9; D-LIB17-DIP); floor.
// Pose map (DESIGN.md section 9): identity. Start = plate.start (the top: arms straight, c2; shoulders down and back,
//  core braced, c3; torso nearly upright, c5; ankles crossed with a slight knee bend, c3; the plate hanging still, c8).
//  End = plate.end (the bottom; D-LIB17-DIPBAL option P, #299 6348947992, through research fix F-LB7-1: the shoulder on
//  the parallel line, elbows back, c4; shoulders down, c6; a slight lean, c5; balanced).
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Hands: each grip centre on its bar's centre line, BAR_X out (the shoulder joints' width: c1 "about shoulder-width"),
//   fixed in every pose (the hands do not move on the bars). Elbow IK pole straight back (c4 "elbows going back").
//  Balance (D-LIB17-DIPBAL): in every pose the body plus the plate (PLATE_KG on BODY_KG, its weight at the belt point)
//   has its centre of mass over the grips: the shoulder's z is solved for it (bisection; Winter's segment fractions on
//   the engine's landmarks). The top: straight arms (c2), the shoulder on the arm's reach from the grip. The bottom: the
//   shoulder on the parallel line PAR_Y (the height of a level upper arm over a plumb forearm); the elbow comes out at
//   the balanced 115.7 deg, the upper arm 14 deg above level. The Mistake (c14 "quarter or half reps"): the shoulder
//   M_DEPTH of the way from the top down to the parallel line, on the same path. The via poses lie on it too.
//  Trunk: the pelvis tilts forward TOP_LEAN at the top and BOTTOM_LEAN at the bottom (c5 "nearly upright, at most a
//   slight forward lean"), the spine and neck in line; the lean follows the depth in between.
//  Legs: the knees KNEE (c3 "slight knee bend", the top) to BOTTOM_KNEE and the thighs TOP_THIGH to BOTTOM_THIGH back
//   with the depth (balance; c3 states the top only); the ankles together under the body midline (c3 "crossing the
//   ankles"; the hips adduct HIP_ADD), the feet hanging as pull_up's (ANKLE).
//  Shoulders down and back (c3, c6): the scapulae SCAP_ELEV cm down and SCAP_PRO cm back in every pose, as pull_up's top.
//  Bar height BAR_Y (D-LIB17-DIP): a physical number, the lowest that keeps every drawn foot point and the plate at least
//   FLOOR_GAP above the floor in every pose, in 5 cm steps. The uprights stand POST_FRONT in front of the grips, clear
//   of the plate and the head (the bottom's feet pass far behind).
//  Belt, chain and plate (c8): the belt round the waist at the navel, BELT_W wide; the chain hangs plumb from the belt's
//   front to the plate's hole, CHAIN_LEN long, so the plate centre sits at mid-shin at the top (c8 "hang it low, near
//   the shins"); the plate (PLATE_D) hangs face-on to the side view, clear in front of the shins, still and vertical in
//   every pose.
// Unsourced numbers (SIZES below; lb7/sizes.json holds each with its basis): BAR_X, BAR_Y, POST_FRONT, TOP_LEAN,
//  BOTTOM_LEAN, KNEE, TOP_THIGH, BOTTOM_KNEE, BOTTOM_THIGH, HIP_ADD, ANKLE, SCAP_ELEV, SCAP_PRO, BELT_W, BELT_T, CHAIN_W,
//  PLATE_D, HOLE_D, FLOOR_GAP, FLOOR_BACK, FLOOR_FRONT, M_DEPTH, BODY_KG, PLATE_KG; solved: CHAIN_LEN, END_Y, TOP_Z; and
//  dipBars' DIP_BARS.
import { WINTER, REF, landmarksOf, normPose, resolve, fk, bodyShapes } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { dipBars, DIP_BARS_ITEMS } from '../eq/dipBars.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ BAR_X: 0.2266, BAR_Y: 1.10, POST_FRONT: 0.50, TOP_LEAN: 4, BOTTOM_LEAN: 15, KNEE: 20, TOP_THIGH: -15, BOTTOM_KNEE: 90, BOTTOM_THIGH: -40,
  HIP_ADD: 6, ANKLE: -22, SCAP_ELEV: -3, SCAP_PRO: -3, BELT_W: 0.06, BELT_T: 0.012, CHAIN_W: 0.008, PLATE_D: 0.45, HOLE_D: 0.05, FLOOR_GAP: 0.15,
  FLOOR_BACK: 0.30, FLOOR_FRONT: 0.30, M_DEPTH: 0.5, BODY_KG: 75, PLATE_KG: 20 });
const { BAR_X, BAR_Y, POST_FRONT, TOP_LEAN, BOTTOM_LEAN, KNEE, TOP_THIGH, BOTTOM_KNEE, BOTTOM_THIGH, HIP_ADD, ANKLE, SCAP_ELEV, SCAP_PRO, BELT_W, BELT_T, CHAIN_W,
  PLATE_D, HOLE_D, FLOOR_GAP, FLOOR_BACK, FLOOR_FRONT, M_DEPTH, BODY_KG, PLATE_KG } = SIZES;

const L_UA = WINTER.upperArm * H, L_FG = (WINTER.forearm + REF.gripOff) * H;
const GRIP = s => [s * BAR_X, BAR_Y, 0];
// Bracketed root finder (bisection): throws when f(a) and f(b) have the same sign (D-LIB9-CLONE b).
export const bisect = (f, a, b, what) => {
  let fa = f(a), fb = f(b);
  if (fa * fb > 0) throw new Error(`weighted_dip: no ${what} in [${a}, ${b}]`);
  for (let i = 0; i < 70; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) { b = m; fb = fm; } else { a = m; fa = fm; } }
  return (a + b) / 2;
};
// Body centre of mass (D-LIB17-DIPBAL): Winter (2009) table 4.1 mass fractions and centre positions from each
// segment's proximal end, on the engine's landmarks (upper arm .028 at .436, forearm .016 at .430, hand .006 at .5,
// thigh .100 at .433, shank .0465 at .433, foot .0145 at .5, trunk .497 at the hip-shoulder midpoint, head and neck .081
// at the ear).
const lerp3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
export const bodyCom = L => {
  const parts = [[0.497, lerp3(L.hips, L.shoulders, 0.5)], [0.081, L.ear]];
  for (const s of ['l', 'r']) parts.push([0.028, lerp3(L[`shoulder.${s}`], L[`elbow.${s}`], 0.436)], [0.016, lerp3(L[`elbow.${s}`], L[`wrist.${s}`], 0.430)],
    [0.006, lerp3(L[`wrist.${s}`], L[`grip.${s}`], 0.5)], [0.100, lerp3(L[`hip.${s}`], L[`knee.${s}`], 0.433)], [0.0465, lerp3(L[`knee.${s}`], L[`ankle.${s}`], 0.433)],
    [0.0145, lerp3(L[`ankle.${s}`], L[`toe.${s}`], 0.5)]);
  const m = parts.reduce((t, [w]) => t + w, 0);
  return parts.reduce((t, [w, p]) => t.map((v, i) => v + w * p[i] / m), [0, 0, 0]);
};
// The body at depth d (0 the top, 1 the bottom): the lean, the knees and the thighs move with the depth (c3's slight
// bend at the top only; D-LIB17-DIPBAL's legs at the bottom), the spine and neck in line; the root placed so the near
// shoulder joint sits at [y, z].
const bodyAt = (d, root) => {
  const tilt = TOP_LEAN + (BOTTOM_LEAN - TOP_LEAN) * d, thigh = TOP_THIGH + (BOTTOM_THIGH - TOP_THIGH) * d;
  return { root: { at: root, tilt }, trunk: 0, neck: 0, scap: { elev: SCAP_ELEV, pro: SCAP_PRO },
    hip: { l: { flex: tilt + thigh, abd: -HIP_ADD }, r: { flex: tilt + thigh, abd: -HIP_ADD } }, knee: KNEE + (BOTTOM_KNEE - KNEE) * d, ankle: ANKLE };
};
const pole = [0, 0, -1];   // c4 "elbows going back"
const poseFor = (d, y, z) => {
  const off = landmarksOf(bodyAt(d, [0, 0, 0]), H)['shoulder.r'];
  return { ...bodyAt(d, [0, y - off[1], z - off[2]]), reach: { l: { at: GRIP(1), pole }, r: { at: GRIP(-1), pole } } };
};
const flexOf = L => 180 - Math.acos((([a, b]) => a.reduce((t, v, i) => t + v * b[i], 0) / Math.hypot(...a) / Math.hypot(...b))(
  [L['shoulder.r'], L['grip.r']].map(p => p.map((v, i) => v - L['elbow.r'][i])))) / R;
// Belt, chain and plate (c8), from the pelvis landmarks of each pose: the pelvis frame (up, forward) solved from the
// hips, navel and sacrum, whose pelvis-frame offsets are fixed (body.mjs:164-168: navel [0, .62, .066] H, sacrum
// [0, .585, -.058] H from the hip-joint line at .53 H).
const solve2 = (a, b, c, d, v1, v2) => { const det = a * d - b * c; return [v1.map((_, i) => (d * v1[i] - b * v2[i]) / det), v1.map((_, i) => (a * v2[i] - c * v1[i]) / det)]; };
const pelvisFrame = lm => {
  const o = lm.hips, v1 = lm.navel.map((v, i) => v - o[i]), v2 = lm.sacrum.map((v, i) => v - o[i]);
  const [up, fwd] = solve2(0.09 * H, 0.066 * H, 0.055 * H, -0.058 * H, v1, v2);
  const nu = Math.hypot(...up), nf = Math.hypot(...fwd);
  return { o, up: up.map(v => v / nu), fwd: fwd.map(v => v / nf) };
};
const at = (F, y, z) => F.o.map((v, i) => v + F.up[i] * y + F.fwd[i] * z);
// The belt band in side view: from the back contour to the front contour of the torso at the navel (torsoSide,
// body.mjs:43-48: back -0.053 H, front +0.066 H at .60-.64 H), BELT_W tall, BELT_T proud of the skin.
const BELT_Y = (0.62 - 0.53) * H, BACK_Z = -0.053 * H - BELT_T, FRONT_Z = 0.066 * H + BELT_T;
const beltOf = lm => {
  const F = pelvisFrame(lm), h = BELT_W / 2;
  return { front: at(F, BELT_Y - h, FRONT_Z), pts: [at(F, BELT_Y + h, BACK_Z), at(F, BELT_Y + h, FRONT_Z), at(F, BELT_Y - h, FRONT_Z), at(F, BELT_Y - h, BACK_Z)] };
};
// Balance: the shoulder's z solved (bisection) so the body's centre of mass sits over the grips.
// The plate's weight acts at its belt point (it hangs plumb below it): the balance is the body plus the plate
// (PLATE_KG on BODY_KG) at the belt's front (D-LIB17-DIPBAL condition 3, amended 6348947992).
export const loadedCom = L => { const b = bodyCom(L), f = beltOf(L).front; return b.map((v, i) => (BODY_KG * v + PLATE_KG * f[i]) / (BODY_KG + PLATE_KG)); };
const balancedZ = (d, y) => bisect(z => loadedCom(landmarksOf(poseFor(d, y, z), H))[2], -0.3, 0.6, 'balanced shoulder position');
// The top (c2: straight arms): the shoulder on the straight arm's reach from the grip, its z solved for balance.
const ARM = L_FG + L_UA - 0.0001;
const topYOf = z => BAR_Y + Math.sqrt(ARM * ARM - z * z);
export const TOP_Z = bisect(z => loadedCom(landmarksOf(poseFor(0, topYOf(z), z), H))[2], -0.2, 0.2, 'balanced top');
export const TOP_Y = topYOf(TOP_Z);
export const PAR_Y = BAR_Y + L_FG;                                                    // the parallel line (c4: upper arm level, forearm plumb)
// The bottom (D-LIB17-DIPBAL, option P, #299 6348947992): the shoulder on the parallel line (c4 "parallel or slightly
// below"), the lean BOTTOM_LEAN (c5), the legs back, balanced; the elbow is then the balanced value (about 112.5).
export const END_Y = PAR_Y;
const depthOfY = y => (TOP_Y - y) / (TOP_Y - END_Y);
const poseAtY = y => { const d = depthOfY(y); return d === 0 ? poseFor(0, TOP_Y, TOP_Z) : poseFor(d, y, balancedZ(d, y)); };
const start = poseFor(0, TOP_Y, TOP_Z);                                                 // the top: straight arms, balanced
const end = poseAtY(END_Y);
const via = [1 / 3, 2 / 3].map(t => poseAtY(TOP_Y + (END_Y - TOP_Y) * t));
// The Mistake (c14's half rep; ruled, D-LIB17-DIPBAL condition 4): the shoulder M_DEPTH of the way from the top down to
// the parallel line, on the same balanced path, so it stays well above parallel.
export const M_Y = TOP_Y + (PAR_Y - TOP_Y) * M_DEPTH;
const mistakePose = poseAtY(M_Y);
const shoulderAt = () => [-BAR_X, END_Y, landmarksOf(end, H)['shoulder.r'][2]];

const LS = landmarksOf(start, H), LE = landmarksOf(end, H);
// The balanced bottom elbow (solved; D-LIB17-DIPBAL: "the elbow at the balanced value, about 112.5").
export const END_FLEX = 180 - (() => { const a = LE['shoulder.r'], b = LE['elbow.r'], c = LE['grip.r'], u = a.map((v, i) => v - b[i]), w = c.map((v, i) => v - b[i]);
  return Math.acos(u.reduce((t, v, i) => t + v * w[i], 0) / Math.hypot(...u) / Math.hypot(...w)) * 180 / Math.PI; })();
const midShin = lm => lm['knee.r'].map((v, i) => (v + lm['ankle.r'][i]) / 2);
export const CHAIN_LEN = beltOf(LS).front[1] - midShin(LS)[1];
const ringPts = (c, r, n = 24) => Array.from({ length: n }, (_, k) => [0, c[1] + r * Math.sin(2 * Math.PI * k / n), c[2] + r * Math.cos(2 * Math.PI * k / n)]);
export const loadOf = lm => {
  const b = beltOf(lm), hole = [0, b.front[1] - CHAIN_LEN, b.front[2]], w = CHAIN_W / 2;
  return {
    hole, belt: b.pts,
    plate: ringPts(hole, PLATE_D / 2), ring: ringPts(hole, HOLE_D / 2, 12),
    chain: [[0, b.front[1], b.front[2] - w], [0, b.front[1], b.front[2] + w], [0, hole[1], hole[2] + w], [0, hole[1], hole[2] - w]],
  };
};
// The point of the drawn start belt band at the navel's height on the front skin (the band spans BELT_Y +- BELT_W/2
// and runs from the back contour to FRONT_Z), which the c8 contact fact checks the navel against.
const BELT_AT_NAVEL = at(pelvisFrame(LS), BELT_Y, 0.066 * H);
const LOAD = [
  lm => ({ type: 'poly', pts: loadOf(lm).plate, cls: 'eq', z: 'center', part: 'plate' }),
  lm => ({ type: 'poly', pts: loadOf(lm).ring, cls: 'eq-solid', z: 'center', part: 'plate' }),
  lm => ({ type: 'poly', pts: loadOf(lm).chain, cls: 'eq-solid', z: 'center', part: 'chain' }),
  lm => ({ type: 'poly', pts: loadOf(lm).belt, cls: 'eq-solid', z: 'mid', part: 'belt' }),
];

// Start phantom (Q2 (c); DRAWING-GUIDE.md 4): the straight start arm runs down the same plumb line as the end forearm,
// so the end figure covers its lower half. Its outline (the union of the start near arm's shapes) is redrawn as hidden
// lines (dashed, no fill) over the end figure, only where the end figure covers it, as pull_up's hang outline does.
const crPts = (ps, k = 8) => {
  const n = ps.length, g = i => ps[(i + n) % n], out = [];
  for (let i = 0; i < n; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let j = 0; j < k; j++) { const t = j / k, u = 1 - t;
      out.push([0, 1].map(d => u * u * u * p1[d] + 3 * u * u * t * c1[d] + 3 * u * t * t * c2[d] + t * t * t * p2[d])); }
  }
  return out;
};
const inside = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
  const [xi, yi] = poly[i], [xj, yj] = poly[j];
  if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
export const START_ARM = (() => {
  const body = { height: H }, probe = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
  const shapesOf = pose => bodyShapes(fk(resolve(normPose(pose, body), body).q, body), probe)
    .map(s => ({ key: s.key, pts: s.key.includes('cap') || s.key.startsWith('fist') ? s.poly : crPts(s.poly) }));
  const arm = shapesOf(start).filter(s => ['upper.r', 'fore.r', 'fist.r'].includes(s.key));
  const cover = shapesOf(end).map(s => s.pts), items = [];
  for (const s of arm) {
    const others = arm.filter(o => o !== s).map(o => o.pts);
    const vis = s.pts.map(p => !others.some(o => inside(p, o)) && cover.some(c => inside(p, c)));
    const n = s.pts.length, i0 = vis.indexOf(false);
    if (i0 < 0) { items.push([...s.pts, s.pts[0]]); continue; }
    let run = [];
    for (let k = 1; k <= n; k++) { const i = (i0 + k) % n; if (vis[i]) run.push(s.pts[i]); else { if (run.length > 2) items.push(run); run = []; } }
    if (run.length > 2) items.push(run);
  }
  return items.map(r => ({ type: 'line', pts: r.map(([x, y]) => [0, -y / 1000, x / 1000]), cls: 'eq-cable m-line', z: 'front', part: 'startArm' }));
})();

// The Mistake arm (13.1; one_arm_dumbbell_row's pattern, #274): the engine masks the Mistake outline inside the faulty
// body, so the red upper arm crossing the red trunk showed only in scraps. The red near arm's outer outline (upper arm,
// elbow cap, forearm, fist) is traced as dashed guides, which the engine draws above every figure.
export const MIST_ARM = (() => {
  const body = { height: H }, probe = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
  const arm = bodyShapes(fk(resolve(normPose(mistakePose, body), body).q, body), probe)
    .filter(s => ['upper.r', 'elbowcap.r', 'fore.r', 'fist.r'].includes(s.key)).map(s => ({ key: s.key, pts: s.key.includes('cap') || s.key.startsWith('fist') ? s.poly : crPts(s.poly) }));
  const runs = [];
  for (const s of arm) {
    const others = arm.filter(o => o !== s).map(o => o.pts), keep = s.pts.map(p => !others.some(o => inside(p, o)));
    const i0 = keep.indexOf(false);
    if (i0 < 0) { runs.push([...s.pts, s.pts[0]]); continue; }
    let run = [];
    for (let k = 1; k <= s.pts.length; k++) { const i = (i0 + k) % s.pts.length; if (keep[i]) run.push(s.pts[i]); else { if (run.length > 1) runs.push(run); run = []; } }
    if (run.length > 1) runs.push(run);
  }
  return runs.map(r => r.map(([x, y]) => [0, -y / 1000, x / 1000]));
})();

// The elbow bend arc (pull_up's convention: bend from straight): the reference ray is the upper arm extended past the
// elbow in the end pose; the arc runs from it to the grip.
const UA = [LE['elbow.r'][2] - LE['shoulder.r'][2], LE['elbow.r'][1] - LE['shoulder.r'][1]];
const POST_Z = POST_FRONT;
// The rearmost drawn foot point over the drawn poses (the bottom's legs go back), where the floor line starts.
const FEET_BACK = Math.min(...[start, ...via, end, mistakePose].flatMap(p => { const l = landmarksOf(p, H); return ['toe.r', 'heel.r', 'toe.l', 'heel.l'].map(k => l[k][2]); }));
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
const onBar = s => ({ landmark: `grip.${s}`, at: GRIP(s === 'l' ? 1 : -1), pose: 'all', tol: 0.5 });

export const WD = { grip: GRIP, shoulderAt, poseAtY, poseFor, loadOf, postZ: POST_Z, chainLen: CHAIN_LEN, endY: END_Y, mY: M_Y, parY: PAR_Y, topY: TOP_Y, bodyCom };
export default {
  id: 'weighted_dip', name: 'Weighted Dip', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: FEET_BACK - FLOOR_BACK, to: POST_Z + FLOOR_FRONT },
    ...perItem(() => dipBars({ barY: BAR_Y, barX: BAR_X, postZ: POST_Z, toward: -1 }), DIP_BARS_ITEMS),
    ...LOAD,
    (lm, ctx) => (ctx.pose === 'end' ? START_ARM : null),
  ],
  checks: [
    onBar('l'), onBar('r'),                                                                   // c1, c2: hands on the bars
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: LS[landmark], pose: 'start', tol: 0.5 })),   // c2 facts: the hands on the bars at the start
    { landmark: 'navel', at: BELT_AT_NAVEL, pose: 'start', tol: 0.5 },                         // c8 fact: the belt round the waist, at the navel
    ...['toe.r', 'toe.l', 'heel.r', 'heel.l'].map(landmark => ({ landmark, above: FLOOR, pose: 'all', tol: 0 })),   // feet clear of the floor
    ...['toe.r', 'toe.l', 'heel.r', 'heel.l'].map(landmark => ({ landmark, above: { point: [0, FLOOR_GAP, 0], normal: [0, 1, 0] }, pose: 'end', tol: 0 })),   // BAR_Y's rule
  ],
  ghosts: { count: 2, parts: ['trunk', 'arm.r'] },
  trace: { point: 'shoulder.r', trim: [10, 12] },
  // The parallel line (D-LIB17-DIPBAL option P): the shoulder height of a level upper arm over a plumb forearm; the
  // bottom's shoulder sits on it, and in the Mistake the shoulder stops above it.
  datum: [{ y: PAR_Y, from: { at: 'elbow.r', off: [-14, 0] }, to: { at: 'shoulder.r', off: [46, 0] } }],
  callouts: [
    // c3: the top position's shoulders (the checkpoint's claim c3 is the top), anchored on the start figure
    { key: 'shoulders', text: 'Shoulders<br>down', anchor: { at: 'shoulderTop.r', pose: 'start' }, box: { left: 30, top: 36 }, cue: 'Keep your shoulders down and back, away from your ears.' },
    { key: 'elbows', text: 'Elbows<br>back', anchor: { at: 'elbow.r', off: [-7, 0] }, box: { left: 30, top: 84 }, cue: 'Lower with your elbows going back, not out.' },
    // c4: on the parallel line (the datum), in front of the chest
    { key: 'depth', text: 'Depth to<br>parallel', anchor: { at: 'shoulder.r', off: [40, 0] }, box: { left: 268, top: 96 }, cue: 'Lower until your upper arm is about level with the floor.' },
  ],
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Press', s: 1, move: true }],
  mistake: {
    pose: mistakePose,
    guides: MIST_ARM.map(pts => ({ kind: 'dashed', pts })),
    tells: [
      { key: 'short', text: 'Rep cut<br>short', anchor: { at: 'head', pose: 'mistake' }, box: { left: 236, top: 30 }, cue: 'The rep stops well above parallel at the bottom.' },
      { key: 'parallel', text: 'Above<br>parallel', anchor: { along: ['mistake:elbow.r', 'mistake:shoulder.r'], t: 0.5, off: [0, -7], pose: 'mistake' }, box: { left: 56, top: 96 }, cue: 'The upper arm stops well above level with the floor.' },
    ],
  },
  alt: 'Weighted dip, side view. On parallel bars, a plate hanging low from a dip belt, the lifter lowers from straight arms until the upper arms are about level with the floor, elbows going back, shoulders down, torso nearly upright.',
};
