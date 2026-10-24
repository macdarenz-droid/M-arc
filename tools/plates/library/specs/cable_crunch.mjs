// Cable crunch (triceps rope on the high pulley, kneeling, facing the column), side view, figure faces screen right
//  (the column on the right). LIB-21 (LB9, H; slice).
// View: side (card plate.view = census): the spine curling while the hips stay still and raised (c3, c5) and the fault,
//  the hips moving to pull (c8), are sagittal. Sides: the card names none and the lift is symmetric; the near side is
//  the right (D-LIB21-SIDES).
// Sources: research card docs/research/howto/cards/cable_crunch.json: c1 rope on the high pulley, kneel a few feet away
//  facing the machine, stance hip to shoulder-width; c2 one rope end in each hand, the hands on either side of the head
//  throughout; c3 a slight backward hinge from the hips that raises them, chin tucked, then curl forward, shoulders
//  toward the pelvis, hips still and raised ("Spine flexes, not hips"); c4 curl the spine as much as you can; c5 the
//  elbows move toward the thighs, crunch until they are near the thighs, from a start with the torso upright; c8 using
//  the hips to pull (the Mistake); c9 the arms do not yank; c12 chin tucked; c16 tempo (D-SUP-LB9-TEMPODIR Reading A:
//  crunch 2 s, pause 1 s, return 3 s).
// Clone (D-LIB21-CLONE; copied, never imported): hanging_leg_raise (the 8, census closest: the fit camera margins, the
//  tucked chin of its curl, the trace trim); rope_triceps_pushdown (#109 @ dcac4a38: the rope on a high pulley, the
//  cable from the pulley's lifter-side tangent, perItem(rope)); assisted_pull_up (LB1 @ 9e5d9666: the kneel class, the
//  knees held by `checks`, no knee-contact IK); bear_crawl (LB10 @ a9c64e11: the damped Newton solve that throws, the
//  Winter centre of mass, SIZES and info); seated_cable_row (the 8: cableColumn, the 1 mm start twin).
// Geometry (checked by the report's checks and contacts and by info):
//  Kneel (c1): each knee in its hip's plane (hip width, the narrow end of c1's range; the side view shows no width).
//   The upper shin bears on the floor under the knee joint: the knee joint sits the shin's proximal radius up, so the
//   drawn shin touches the floor line and the kneecap is 0.18 cm over it. Each shin lies back on the floor (its rise
//   solved so the drawn shin's lowest point is on the floor line); each ankle plantarflexed until the drawn instep is
//   on the floor line (solved). Knees, shins and feet are the same in every pose.
//  Start (c1, c2, c3, c5): the thigh HINGE back of vertical (the slight backward hinge that raises the hips, c3), the
//   pelvis and spine upright (tilt 0, trunk 0: c5 'torso upright'), the chin tucked (NECK, c3). Elbows bent, pointing
//   forward (pole forward; c2 Motra 'hands near your shoulders with elbows bent').
//  Hands (c2 'Hold the ropes on either side of your head throughout'): one head-frame point per side, the same in
//   every pose (the grips move with the head): at the ear landmark's height and depth, out from the midplane by the
//   head's widest half-width (the engine's front head outline) plus a fist radius plus GRIP_GAP.
//  Rope over the crown: main's eq/rope.mjs, unedited, with its `ferrule` override. The ferrule sits at the strand
//   length from both grips (the default 30 cm strand), on the cable's own line where the rope clears the skinned head
//   and body; where it would not (the cable meets the head from the front at the start), it turns from that line
//   toward the crown just far enough to clear, so the strands run over the crown and down beside the head (70.6 deg
//   at the start, 0 from 5/9 of the curl to the end; solved per drawn pose, info.keys[].ferruleDeg).
//  End (c3, c4, c5, c12): the hips unchanged (the start's root, tilt and hip angle, c3 'hips stationary'); only the
//   spine curls: the trunk flexion solved so each elbow cap comes ELBOW_GAP from its own thigh's surface (c5 'elbows
//   near thighs'; c4 'curling the spine as much as you can'), each elbow at the point of its circle about the
//   shoulder-grip line nearest its thigh, no nearer the midline than the thigh's axis. Chin still tucked (NECK).
//  Path: VIA_N - 1 via keys at even steps of the curl; the 2 ghosts land on keys 3 and 6.
//  Mistake (c8, c3: the hips move to pull, the spine does not flex): the spine stays as at the start (trunk 0) and
//   the arms keep the end's angles to the thorax (c9: the arms do not pull); the hips do the crunch: the thigh turns
//   back about the fixed knee (the hips drop back toward the heels) and the pelvis tips forward, both solved so (1) the
//   hands are as far from the pulley as at the end (the same pull) and (2) the centre
//   of mass sits where it sits at the end (balanced over the same knees and shins). No unsourced magnitude.
//  Balance (D-LIB21-BALANCE, c1): the Winter (2009) centre of mass lies over the knees-and-shins base (from the upper
//   shin under the knee joint back to the toes) in every key pose and the Mistake; info gives the numbers.
//  Rope (D-LIB21-ROPE): main's eq/rope.mjs, imported, its default sizes; its cable leaves the column's top pulley at
//   the lifter-side tangent. Mistake: one tell (D-LIB10-SKULL1 record in the hand-off), the hips moving. Column: the cableColumn primitive with its default 2.1 m frame and stack; the high pulley
//   is its top pulley (c1 'upper position').
// Camera: hanging_leg_raise's fit margins (capped at the reference scale): the 2.1 m column sets the height.
// Unsourced numbers (SIZES; lb9/sizes.json holds each with its basis): HINGE, NECK, ELBOW_GAP, COL_FRONT, VIA_N, ROPE_MARGIN,
//  GRIP_GAP.
import { landmarksOf, RADII, WINTER, REF, fk, resolve, normPose, bodyShapes } from '../engine.mjs';
import { rope, ropeGeometry, ROPE_ITEMS } from '../eq/rope.mjs';
import { perItem } from '../eq/parts.mjs';

const H = 1.75, R = Math.PI / 180, BODY = { height: H };
export const SIZES = Object.freeze({ HINGE: 20, NECK: 12, ELBOW_GAP: 0.02, COL_FRONT: 0.9144, VIA_N: 9, GRIP_GAP: 0.02, ROPE_MARGIN: 0.003 });
const { HINGE, NECK, ELBOW_GAP, COL_FRONT, VIA_N, GRIP_GAP, ROPE_MARGIN } = SIZES;
// cableColumn's own defaults (vendor/engine/equipment.mjs:85, :98): 2.1 m frame, 34 cm wide, top pulley 9 cm under the
// top, 3.5 cm radius. Named here only so the rope's cable leaves that pulley; the primitive draws them.
const COL_H = 2.1, COL_W = 0.34, TOP_DROP = 0.09, TOP_R = 0.035;
const COL_Z = COL_FRONT + COL_W / 2;                     // column centre: its front face COL_FRONT ahead of the knees
const PULLEY = [0, COL_H - TOP_DROP, COL_Z];             // the high pulley = the column's top pulley (c1)
// The ear landmark in the head frame (body.mjs:165, ear = [0, .93, -.005] H): the grips' height and resting depth.
const EAR_Y = 0.93, EAR_Z = -0.005;
// eq/rope.mjs's defaults, read only to measure the drawn rope against the body: grip to stopper centre, the rope's
// and the stopper's half-thickness.
const BELOW = 0.055, ROPE_R = 0.014, KNOB_R = 0.023, CABLE_R = 0.002;

const sub = (a, b) => a.map((v, i) => v - b[i]), add = (a, b) => a.map((v, i) => v + b[i]), mul = (a, k) => a.map(v => v * k);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], len = a => Math.hypot(...a), unit = a => mul(a, 1 / len(a));
const mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

// Newton with finite differences (bear_crawl.mjs @ a9c64e11), damped; throws if it does not converge.
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
  if (!(Math.hypot(...f(p)) <= 1e-6)) throw new Error(`cable_crunch: no solution for ${what}`);
  return p;
}
/** Bisection on [a, b] for fn changing sign; returns the end of the final bracket where fn >= 0. Throws on a bracket
 *  with no sign change (D-LIB21-CLONE). */
function bisect(fn, a, b, what) {
  let fa = fn(a), fb = fn(b); if (fa * fb > 0) throw new Error(`cable_crunch: no root for ${what} in [${a}, ${b}]`);
  for (let i = 0; i < 80; i++) { const m = (a + b) / 2, fm = fn(m); if (fa * fm <= 0) { b = m; fb = fm; } else { a = m; fa = fm; } }
  return fa >= 0 ? a : b;
}
/** Winter (2009) whole-body centre of mass on the drawn landmarks (bear_crawl.mjs @ a9c64e11). */
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
const skOf = pose => fk(resolve(normPose(pose, BODY), BODY).q, BODY);

// ---- kneel: knees, shins and feet (the same in every pose) ----
const T_LEN = WINTER.thigh * H;
const KNEE_Y = RADII.shank[0] * H;                       // the knee joint the shin's proximal radius over the floor
const KNEE = { l: [REF.hjcX * H, KNEE_Y, 0], r: [-REF.hjcX * H, KNEE_Y, 0] };   // each knee in its hip's plane
const SIDE_PROBE = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
const lowest = (pose, key) => -Math.max(...bodyShapes(skOf(pose), SIDE_PROBE).find(s => s.key === key).poly.map(p => p[1])) / 1000;
// A kneeling pose from the thigh's angle back of vertical (th) and the pelvis tilt: the root on the circle about the
// knee; the shin's rise (deg up from horizontal toward the ankle) and the ankle angle keep the shin and foot fixed.
const kneel = (th, tilt, rise, ankle) => ({ root: { at: [0, KNEE_Y + T_LEN * Math.cos(th * R), -T_LEN * Math.sin(th * R)], tilt }, hip: th + tilt, knee: th + 90 + rise, ankle });
export const RISE = bisect(a => lowest(kneel(HINGE, 0, a, -60), 'shank.r'), 0, 15, 'the shin on the floor');
export const ANKLE = bisect(a => lowest(kneel(HINGE, 0, RISE, a), 'foot.r'), -90, -20, 'the instep on the floor');
const legs = (th, tilt) => kneel(th, tilt, RISE, ANKLE);

// ---- the skinned head, neck and shoulder top in 3D, from the engine's own outlines ----
// Each horizontal section is an ellipse with the side outline's depth and the front outline's half-width at that
// height (the head in the head frame; the neck and trapezius in the thorax frame), read on 1000 px/m probes of the
// standing reference pose.
const NEUTRAL = skOf({ root: { at: [0, REF.hjcY * H, 0], tilt: 0 } });
const outline = (view, key) => bodyShapes(NEUTRAL, { view, near: 'r', pxm: 1000, P: w => [(view === 'side' ? w[2] : w[0]) * 1000, -w[1] * 1000] })
  .find(x => x.key === key).poly.map(([u, v]) => [u / 1000 / H, -v / 1000 / H]);   // [z or x, y] in H
const crossings = (poly, y) => { const out = []; for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length];
  if ((p[1] - y) * (q[1] - y) <= 0 && p[1] !== q[1]) out.push(p[0] + (y - p[1]) / (q[1] - p[1]) * (q[0] - p[0])); } return out; };
const PART = { head: { side: outline('side', 'head'), front: outline('front', 'head'), y: [0.872, 1.0] },
  torso: { side: outline('side', 'torso'), front: outline('front', 'torso'), y: [0.80, 0.905] } };
/** Conservative signed distance (m, negative inside) of a reference-frame point p (H units) from one part's section. */
function partDist(part, p) {
  const P = PART[part]; if (p[1] < P.y[0] || p[1] > P.y[1]) return Infinity;
  const zs = crossings(P.side, p[1]), xs = crossings(P.front, p[1]); if (zs.length < 2 || xs.length < 2) return Infinity;
  const z0 = Math.min(...zs), z1 = Math.max(...zs), hz = (z1 - z0) / 2, w = Math.max(...xs.map(Math.abs));
  return (Math.hypot((p[2] - (z0 + z1) / 2) / hz, p[0] / w) - 1) * Math.min(hz, w) * H;
}
const toRef = (R3, pivotW, pivotRef, w) => add(pivotRef, mul([0, 1, 2].map(j => R3[0][j] * (w[0] - pivotW[0]) + R3[1][j] * (w[1] - pivotW[1]) + R3[2][j] * (w[2] - pivotW[2])), 1 / H));

// ---- the hands by the head (c2) and the rope ----
const HEAD_W = Math.max(...PART.head.front.map(p => Math.abs(p[0])));   // the head's widest half-width (H)
const GX = HEAD_W + RADII.fist + GRIP_GAP / H;                           // the fist GRIP_GAP off the widest skull
const gripsAt = sk => ({ l: sk.head([GX, EAR_Y, EAR_Z]), r: sk.head([-GX, EAR_Y, EAR_Z]) });   // one head-frame point per side, every pose
// The cable leaves the top pulley at its lifter-side tangent (rope_triceps_pushdown.mjs headTangent @ dcac4a38).
function tangent(b) {
  const dz = b[2] - PULLEY[2], dy = b[1] - PULLEY[1], D = Math.hypot(dz, dy), a0 = Math.atan2(dy, dz), al = Math.acos(TOP_R / D);
  const c = [a0 + al, a0 - al].map(a => [0, PULLEY[1] + TOP_R * Math.sin(a), PULLEY[2] + TOP_R * Math.cos(a)]);
  return c[0][2] < c[1][2] ? c[0] : c[1];
}
const gripsOf = lm => ({ l: lm['grip.l'], r: lm['grip.r'] });
const ROPE_REACH = 0.30 - BELOW;                         // eq/rope.mjs's default strand (30 cm) less the grip-to-stopper run
const sampleDist = (sk, c, rad) => Math.min(partDist('head', toRef(sk.Rh, sk.N, REF.neck, c)), partDist('torso', toRef(sk.Rt, sk.L, REF.lumbar, c))) - rad;
/** Least clearance (m) from the skinned head, neck and shoulder top of a rope geometry: both strands with their
 *  stoppers, and the cable from the pulley's tangent to the ferrule (CABLE_R). */
function geoClearance(sk, geo) {
  let best = Infinity;
  for (const st of geo.strands) { const L = len(sub(st.grip, st.from));
    for (let k = 0; k <= 60; k++) { const d = (L + BELOW) * k / 60; best = Math.min(best, sampleDist(sk, add(st.from, mul(st.dir, d)), d > L ? KNOB_R : ROPE_R)); } }
  const T = tangent(geo.ferrule);
  for (let k = 0; k <= 40; k++) best = Math.min(best, sampleDist(sk, mid(T, geo.ferrule, k / 40), CABLE_R));
  return best;
}
/** The rope for a pose (sk) and its grips: the ferrule at the strand length from both grips (on the circle about the
 *  grips' midpoint in the midplane), at the point of that circle nearest the cable's own line (the composer's default)
 *  where the rope and cable clear the skinned head and body, turning only toward the crown: the rope then runs over
 *  the crown and down beside the head. Searched in 0.5 deg steps, then bisected; throws (S7) if none clears. */
const ferrules = new Map();
export function ropeOf(sk, g) {
  const M = mul(add(g.l, g.r), 0.5), half = len(sub(g.l, g.r)) / 2, Rr = Math.sqrt(ROPE_REACH ** 2 - half ** 2);
  const key = [...g.l, ...g.r].map(v => v.toFixed(6)).join(','); if (ferrules.has(key)) return ferrules.get(key);
  const a = unit(sub([0, ...tangent(M).slice(1)], [0, M[1], M[2]])), b = [0, -a[2], a[1]];
  const at = th => add(M, add(mul(a, Rr * Math.cos(th * R)), mul(b, Rr * Math.sin(th * R))));
  const geoAt = th => ropeGeometry({ pulley: tangent(at(th)), grips: g, ferrule: at(th) }), clear = th => geoClearance(sk, geoAt(th)) - ROPE_MARGIN;
  // turn only toward the crown, from the face's side over the top: the way that moves the ferrule back in the head frame
  const back = th => toRef(sk.Rh, sk.N, REF.neck, at(th))[2], sg = back(1) < back(-1) ? 1 : -1;
  let th = 0;
  if (clear(0) < 0) {
    th = null;
    for (let k = 1; k <= 360 && th == null; k++) if (clear(sg * k * 0.5) >= 0) th = bisect(clear, sg * (k - 1) * 0.5, sg * k * 0.5, 'the rope clear of the head');
    if (th == null) throw new Error('cable_crunch: S7, no ferrule over the crown clears the head');
  }
  const geo = { ...geoAt(th), theta: th }; ferrules.set(key, geo); return geo;
}
export const ropeClearance = (sk, g) => geoClearance(sk, ropeOf(sk, g));
const reachOf = (pose, poles) => { const g = gripsAt(skOf(pose)); return { ...pose, reach: { l: { at: g.l, pole: poles.l }, r: { at: g.r, pole: poles.r } } }; };

// ---- start: kneeling tall, hips raised by the slight hinge, torso upright, chin tucked (c1, c3, c5) ----
const upright = { ...legs(HINGE, 0), trunk: 0, neck: NECK };
const FWD = [0, 0, 1];
const start = reachOf(upright, { l: FWD, r: FWD });

// ---- end: only the spine curls until the elbows are near the thighs (c3, c4, c5) ----
const thighR = t => { const [a, m, b, mm] = RADII.thigh; return (t < mm ? a + (m - a) * Math.sin(t / mm * Math.PI / 2) : m + (b - m) * (1 - Math.cos((t - mm) / (1 - mm) * Math.PI / 2))) * H; };
const segDist = (p, a, b) => { const d = sub(b, a), t = Math.max(0, Math.min(1, dot(sub(p, a), d) / dot(d, d))); return [len(sub(p, add(a, mul(d, t)))), t]; };
/** Elbow-cap surface to the thigh surface (m): the cap a sphere (RADII.elbowCap), the thigh the drawn tapered capsule. */
export const capGap = (e, hip, knee) => { const [d, t] = segDist(e, hip, knee); return d - thighR(t) - RADII.elbowCap * H; };
const SGN = { l: 1, r: -1 }, L1 = WINTER.upperArm * H, L2 = WINTER.forearm * H + REF.gripOff * H;
const LH = landmarksOf(upright, H);                      // the hips and thighs (unchanged in the curl)
// each elbow at the point of its circle about the shoulder-grip line nearest its own thigh, no nearer the midline than
// the thigh's axis; the IK pole points there
function nearestElbow(S, G, s) {
  const hip = LH[`hip.${s}`], knee = LH[`knee.${s}`], v = sub(G, S), D = len(v), u = unit(v);
  const a = (L1 * L1 - L2 * L2 + D * D) / (2 * D), h = Math.sqrt(Math.max(0, L1 * L1 - a * a)), C = add(S, mul(u, a));
  const e1 = unit(sub([0, -1, 0], mul(u, -u[1]))), e2 = [u[1] * e1[2] - u[2] * e1[1], u[2] * e1[0] - u[0] * e1[2], u[0] * e1[1] - u[1] * e1[0]];
  let best = null;
  for (let k = 0; k < 720; k++) { const p = k / 720 * 2 * Math.PI, E = add(C, add(mul(e1, h * Math.cos(p)), mul(e2, h * Math.sin(p))));
    if (SGN[s] * E[0] < REF.hjcX * H) continue;
    const gp = capGap(E, hip, knee); if (!best || gp < best.gap) best = { gap: gp, pole: sub(E, C) }; }
  return best;
}
const curled = tr => ({ ...upright, trunk: tr });
const elbowsAt = tr => { const sk = skOf(curled(tr)), g = gripsAt(sk); return { l: nearestElbow(sk.S.l, g.l, 'l'), r: nearestElbow(sk.S.r, g.r, 'r') }; };
export const TRUNK_END = bisect(tr => { const e = elbowsAt(tr); return Math.min(e.l.gap, e.r.gap) - ELBOW_GAP; }, 0, 100, 'the elbows near the thighs');
const END_POLE = (e => ({ l: e.l.pole, r: e.r.pole }))(elbowsAt(TRUNK_END));
// via keys at even steps of the curl, the grips fixed on the head; the poles blend from forward to the end's
const via = Array.from({ length: VIA_N - 1 }, (_, i) => (i + 1) / VIA_N).map(t =>
  reachOf(curled(TRUNK_END * t), { l: mid(FWD, END_POLE.l, t), r: mid(FWD, END_POLE.r, t) }));
const end = reachOf(curled(TRUNK_END), END_POLE);

// ---- Mistake: the hips pull, the spine does not curl (c8, c3) ----
const LE = landmarksOf(end, H), RE = resolve(normPose(end, BODY), BODY).q;
// the pull: the hands' midpoint distance from the pulley (smooth in the pose; the ferrule's wrap search is not)
const ropeLenOf = pose => { const lm = landmarksOf(pose, H); return len(sub(lm.grips, PULLEY)); };
const armsEnd = { shoulder: { l: RE.sh.l, r: RE.sh.r }, elbow: { l: RE.elbow.l, r: RE.elbow.r }, wrist: 0, reach: null };
const misAt = q => ({ ...legs(q.th, q.tilt), trunk: 0, neck: NECK, ...armsEnd });
const LEN_E = ropeLenOf(end), COM_E = com(LE);
export const QM = solve({ th: HINGE + 15, tilt: TRUNK_END * 0.8 }, misAt, p => [ropeLenOf(p) - LEN_E, com(landmarksOf(p, H))[2] - COM_E[2]], 'the hips pulling');
const misFull = misAt(QM);
const mistake = { root: misFull.root, trunk: 0, hip: misFull.hip, knee: misFull.knee, shoulder: armsEnd.shoulder, elbow: armsEnd.elbow, wrist: 0, reach: null };

// ---- equipment ----
const LS = landmarksOf(start, H);
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
const skQ = q => fk(q, BODY);
// The start twin (below) shifts the grips 1 mm up; its ferrule is the real one shifted the same 1 mm, never re-solved.
const TWIN = [0, 0.001, 0];
const ferruleOf = (lm, q) => (lm.twin ? add(ropeOf(skQ(q), gripsOf(lm.twin)).ferrule, TWIN) : ropeOf(skQ(q), gripsOf(lm)).ferrule);
const ropeItems = (lm, ctx) => { const f = ferruleOf(lm, ctx.q); return rope({ pulley: tangent(f), grips: gripsOf(lm), ferrule: f, part: 'rope', mistakeTwin: true, ctx }); };
const column = (to, rest) => ({ type: 'cableColumn', base: [0, 0, COL_Z], pulley: { at: PULLEY, r: TOP_R }, to, rest, wrap: 1, part: 'column' });
// The engine compares the start items with themselves (plate.mjs sE), so a moving rope or cable never draws at the
// start; a 1 mm twin with the same keys (drawn nowhere) makes them count as moving, so they draw dashed there
// (seated_cable_row.mjs's pattern).
const shifted = lm => ({ ...lm, 'grip.l': add(lm['grip.l'], TWIN), 'grip.r': add(lm['grip.r'], TWIN), twin: lm });
const withTwin = fn => (lm, ctx) => { const a = fn(lm, ctx); return ctx.pose === 'start' && a ? [a, fn(shifted(lm), ctx)] : a; };
const knees = ['knee.l', 'knee.r'];
// 'Rope by head' anchor: on the near strand beside the head at the end, two thirds of the way from the fist to the ferrule
const ROPE_PT = (() => { const g = LE['grip.r'], f = ropeOf(skOf(end), gripsOf(LE)).ferrule; return add(g, mul(sub(f, g), 2 / 3)); })();
const START_FERRULE = ropeOf(skOf(start), gripsOf(LS)).ferrule;

export default {
  id: 'cable_crunch', name: 'Cable Crunch', view: 'side', facing: 'right',
  camera: { fit: { left: 14, right: 14, top: 22, bottom: 12 } },   // hanging_leg_raise's margins
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.75, to: COL_Z + COL_W / 2 + 0.15 },
    withTwin((lm, ctx) => column(ferruleOf(lm, ctx.q), START_FERRULE)),   // the stack lifts by the cable paid out
    ...perItem(ropeItems, ROPE_ITEMS).map(withTwin),                             // the rope in the hands, cable to the pulley
  ],
  checks: [
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: LS[landmark], pose: 'start', tol: 0.5 })),   // c2 fact: the hands on the rope ends
    ...knees.map(landmark => ({ landmark, at: KNEE[landmark.slice(-1)], pose: 'all', tol: 0.5 })),          // c1: the knees on one spot
    ...knees.map(landmark => ({ landmark, plane: { point: [0, KNEE_Y, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 })),   // upper shin on the floor
    ...['toe.l', 'toe.r', 'ankle.l', 'ankle.r'].map(landmark => ({ landmark, at: LS[landmark], pose: 'all', tol: 0.5 })),  // shins and feet still
    ...['heel.l', 'heel.r', 'toe.l', 'toe.r'].map(landmark => ({ landmark, above: FLOOR, pose: 'all', tol: 0 })),          // never below the floor
  ],
  ghosts: { count: 2, parts: ['trunk', 'arm.r', 'rope'] },
  trace: { point: 'shoulder.r', trim: [10, 12] },
  callouts: [
    { key: 'hips', text: 'Hips still', anchor: { at: 'buttock', off: [5.5, 12] }, box: { left: 8, top: 286 }, cue: 'Keep the hips still and raised while only the spine bends.' },
    { key: 'curl', text: 'Curl the<br>spine', anchor: { at: 'sacrum', off: [0, -3] }, box: { left: 16, top: 240 }, cue: 'Curl your spine so the elbows move toward your thighs.' },
    { key: 'rope', text: 'Rope by<br>head', anchor: ROPE_PT, box: { left: 200, top: 238 }, cue: 'Hands hold the rope by your head, and the arms don\'t yank.' },
  ],
  tempo: [{ phase: 'Crunch', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 3, move: true }],
  mistake: {
    pose: mistake,
    guides: [
      // the hips moving back and down (the hip-joint midpoint, drawn behind the buttock)
      { kind: 'arrow', from: { at: 'hips', pose: 'end', off: [-36, 24] }, to: { at: 'hips', pose: 'mistake', off: [-36, 24] } },
    ],
    tells: [
      { key: 'hips', text: 'Hips<br>move', anchor: { at: 'seat', pose: 'mistake' }, box: { left: 8, top: 263 }, cue: 'The hips move back to pull while the spine stays straight.' },
    ],
  },
  alt: 'Side view of a cable crunch: kneeling before a cable column with the rope held beside the head, the lifter curls the spine until the elbows are near the thighs while the hips stay still and raised.',
};

const r3 = v => +v.toFixed(3), r2 = v => +v.toFixed(2);
const keyPoses = [start, ...via, end];
export const info = {
  RISE, ANKLE, TRUNK_END, QM, kneeY: KNEE_Y, pulley: PULLEY, gripX: GX,
  base: { front: r3(KNEE.r[2]), back: r3(LS['toe.r'][2]) },
  keys: keyPoses.map(p => { const sk = skOf(p), lm = landmarksOf(p, H);
    return { trunk: r2(p.trunk), ferruleDeg: r2(ropeOf(sk, gripsOf(lm)).theta), comZ: r3(com(lm)[2]), ropeClearCm: r2(ropeClearance(sk, gripsOf(lm)) * 100), elbowGapCm: r2(Math.min(...['l', 'r'].map(s => capGap(lm[`elbow.${s}`], lm[`hip.${s}`], lm[`knee.${s}`]))) * 100) }; }),
  pose: Object.fromEntries([['start', start], ['end', end], ['mistake', misFull]].map(([k, p]) => { const lm = landmarksOf(p, H);
    return [k, { com: com(lm).map(r3), hip: lm['hip.r'].map(r3), knee: lm['knee.r'].map(r3), elbow: lm['elbow.r'].map(r3), grip: lm['grip.r'].map(r3), ropeLen: r3(ropeLenOf(p)), ferruleDeg: r2(ropeOf(skOf(p), gripsOf(lm)).theta), ropeClearCm: r2(ropeClearance(skOf(p), gripsOf(lm)) * 100) }]; })),
};
