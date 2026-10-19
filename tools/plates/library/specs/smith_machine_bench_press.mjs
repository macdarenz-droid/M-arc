// Smith Machine Bench Press (flat bench under a Smith bar), side view, facing right. H (D-LIB10-BENCH-H: BENCH is not
// built and PARAMS has no Smith value, derive.mjs:4-12; D-LIB10-PA's mode rule).
// View: SIDE (card plate.view = census view): the bar over the mid-chest, the stop height, the straight bar path and
// the elbows (about 45 degrees, or flared level with the shoulder) read in the sagittal plane (c2, c3, c4, c7, c8).
// Clone source (D-LIB9-CLONE; D-LIB11-SMITH): barbell_bench_press @ 2dcbac1 (#265; LB2, D-LIB10-CRIT1), copied, never
// imported: `supine()` with its bisect made to throw when its bracket holds no root, the flat bench at 43 cm, the feet,
// the scapular set, the barbell and bar-end drawing, the start bar dot. That supine code is the class of
// dumbbell_bench_press (pilot A, approved @ 013f84e, 21.4), the supine anchor. New: the Smith rig (eq/smith.mjs), the
// bar on one vertical line over the mid-chest, the 45-degree elbow and the flare Mistake (close_grip_bench_press's
// ghost-arm capsule @ 2dcbac1, copied).
// Sources: research card docs/research/howto/cards/smith_machine_bench_press.json (claude/libht-research @ 38d5f9c6),
// claims c1 (blades together and down, chest up; grip slightly wider than shoulder-width), c2 (bench placed so the
// bar lines up with the mid-chest; feet flat), c3 (lower to the mid-chest, elbows at about 45 degrees, until the bar
// touches), c4 (safety stops just below the lowest point of the bar), c5 (rotate the bar off the hooks), c7 (the
// Mistake: flaring the elbows wide), c8 (a completely straight bar path), c12 and c18 (tempo).
// Geometry decisions:
//  - Supine class (copied): checks prove backUpper and buttock on the pad (plane, tol 1 cm), head clearance and soles
//    on the floor (c2).
//  - Bar line (c2, c8): the rail stands at the mid-chest touch point's z; the bar centre is on that vertical line in
//    every pose (start, ghosts, end, Mistake). Mid-chest = the anchor's nipple-line point, thorax 0.72 H.
//  - Grip (c1): GRIP_X off the midline, LB2's one number for "slightly wider than shoulder-width".
//  - Start (top, c2, c5): arms straight (TOP_ELBOW 4), the bar unhooked on the rail line over the mid-chest.
//  - End (bottom, c3): the bar's underside on the chest surface at mid-chest; each elbow placed on the circle the two
//    arm lengths allow, at END_ELEV from the torso axis (shoulder elevation, the 3D upper-arm-to-torso angle), the
//    lateral solution. The IK pole aims at it.
//  - Stops (c4): the stop's top STOP_BELOW under the bar's lowest drawn point (the bar end's underside at the touch),
//    drawn as a solid catch in front of the torso (STOP_SIZE, D-LIB11-PANEL1).
//  - Engine limit (as barbell_bench_press): the start bar end is a dashed dot in the end layer.
//  - Scale: reference 146.29 px/m.
// Plate labels (card @ 38d5f9c6): callouts = plate.checkpoints c2 (Bar over mid-chest), c4/c3 (Stops set), c1 (Blades
//   together); Mistake = plate.mistake c7, c3 (key `flare`): the elbows flared wide, level with the shoulder in the
//   side view, the bar still on its line at the mid-chest; tempo = plate.tempo c12, c18 (up 1, down 2, pause 0).
// Unsourced numbers (no card claim gives them; 13.3 must-fix 14): BENCH_TOP, BENCH_LEN, BENCH_Z and FOOT_Z (the
//   anchor's), TOP_ELBOW (the anchor's), GRIP_X 0.30 (as LB2), PLATE_D (45 cm, as the 8), STOP_BELOW, STOP_SIZE, the rig's sizes
//   (eq/smith.mjs: rail angle 0 degrees (vertical), rod 3 cm, hook rail 9 cm footward, carriage, hook, stop collar,
//   frame top 2.1 m), MIS_GHOST (the flared arm's capsule radii, as close_grip_bench_press).
import { landmarksOf, fk, resolve, normPose, WINTER, REF } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { smith, SMITH_ITEMS } from '../eq/smith.mjs';

const H = 1.75, BODY = { height: H };
const R = Math.PI / 180;
const BENCH_TOP = 0.43, BENCH_LEN = 1.2, BENCH_Z = -0.46;   // the anchor's flat bench (m), set 6 cm headward so the bar meets the mid-chest with the pad under the head
const FOOT_Z = 0.51;                                  // mid-sole in front of the hip joint (m), the anchor's
const SCAP = { elev: -1, pro: -3 };                   // blades together and down (cm) (c1)
const TOP_ELBOW = 4;                                  // top: elbow flexion (deg), arms straight
const GRIP_X = 0.30;                                  // grip centre off the midline (m): slightly wider than shoulder-width (c1)
const MID_CHEST = 0.72;                               // thorax height (H) of the touch: the anchor's nipple-line point (c2, c3)
export const END_ELEV = 45;                           // end: upper arm from the torso axis (deg), "about 45 degrees" (c3)
const BAR_R = 0.025;                                  // the drawn bar end's radius (m), as barbell_bench_press
const PLATE_D = 0.45;                                 // plate diameter (m)
const STOP_BELOW = 0.02;                              // stop top under the bar's lowest drawn point (m) (c4)
const STOP_SIZE = { w: 0.25, h: 0.05 };               // the catch: 36.6 x 7.3 px at 146.29 px/m (D-LIB11-PANEL1: 34-40 x 6-9 px)
const OCCIPUT = [0, 0.955, -0.056];                   // back of the skull on the side head outline (head frame, H)

// ---- supine class (copied from barbell_bench_press @ 2dcbac1; the bisect throws on a bracket with no root, D-LIB9-CLONE b) ----
export const bisect = (f, lo, hi) => { if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error(`smith_machine_bench_press: no solution in [${lo}, ${hi}]`); for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
export function supine(top, z = 0, { tilt = -90, height = H } = {}) {
  const body = { height }, at0 = { root: { at: [0, 0, z], tilt } };
  const lm = p => landmarksOf(p, height);
  const occ = p => fk(resolve(normPose(p, body), body).q, body).head(OCCIPUT);
  const pad = lm(at0).buttock[1];
  const trunk = bisect(t => lm({ ...at0, trunk: t }).backUpper[1] - pad, -40, 30);
  const neck = bisect(n => occ({ ...at0, trunk, neck: n })[1] - pad, -40, 60);
  return { root: { at: [0, top - pad, z], tilt }, trunk, neck };
}

const LYING = supine(BENCH_TOP, 0);
const feet = { l: { at: [0.10, 0, FOOT_Z] }, r: { at: [-0.10, 0, FOOT_Z] } };
const base = { ...LYING, scap: SCAP, plant: feet };
const lm0 = landmarksOf(base, H);
const S = { l: lm0['shoulder.l'], r: lm0['shoulder.r'] };
const sk0 = fk(resolve(normPose(base, BODY), BODY).q, BODY);
const L1 = WINTER.upperArm * H, L2 = WINTER.forearm * H + REF.gripOff * H;
const sub = (a, b) => a.map((v, i) => v - b[i]), dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0), unit = a => { const k = Math.hypot(...a); return a.map(v => v / k); };
const AXIS = unit(sub(sk0.thorax([0, 0, 0]), sk0.thorax([0, 1, 0])));   // the thorax's long axis, headward to footward (the engine's elev reference)

const onChest = h => { const c = sk0.thorax([0, h, 0.072]); return [0, c[1] + BAR_R, c[2]]; };
const BAR1 = onChest(MID_CHEST);                      // the bar centre at the touch
export const RAIL_Z = BAR1[2];                        // the rail: the bar's one vertical line (c8)
const topReach = side => { const s = side === 'l' ? 1 : -1, sh = S[side];
  const d = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(TOP_ELBOW * R));
  return { at: [s * GRIP_X, sh[1] + Math.sqrt(d * d - (GRIP_X - Math.abs(sh[0])) ** 2 - (RAIL_Z - sh[2]) ** 2), RAIL_Z], pole: [s * 1, -0.2, 0.3] }; };
const BAR0 = [0, topReach('r').at[1], RAIL_Z];

/** The elbow (world) on the circle |E - S| = L1, |E - G| = L2 whose upper arm makes `elev` deg with the torso axis; the
 *  lateral of the two solutions. Throws when the circle has no such point (D-LIB9-CLONE: no silent fallback). */
export function elbowAt(side, G, elev) {
  const s = side === 'l' ? 1 : -1, sh = S[side], f = phi => { const e = elbowOn(sh, G, phi); return Math.acos(dot(unit(sub(e, sh)), AXIS)) / R - elev; };
  let best = null;
  for (let k = 0; k < 360; k++) { const a = k * R, b = (k + 1) * R; if (f(a) * f(b) <= 0) { let lo = a, hi = b; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; }
    const e = elbowOn(sh, G, (lo + hi) / 2); if (!best || s * e[0] > s * best[0]) best = e; } }
  if (!best) throw new Error(`smith_machine_bench_press: no elbow at ${elev} deg`);
  return best;
}
// the circle of elbow points for shoulder sh and grip G, parametrised by phi
function elbowOn(sh, G, phi) {
  const d = sub(G, sh), L = Math.hypot(...d), u = d.map(v => v / L), a = (L1 * L1 - L2 * L2 + L * L) / (2 * L), r = Math.sqrt(L1 * L1 - a * a);
  const ref = Math.abs(u[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], t = unit(ref.map((v, i) => v - u[i] * dot(ref, u)));
  const w = [u[1] * t[2] - u[2] * t[1], u[2] * t[0] - u[0] * t[2], u[0] * t[1] - u[1] * t[0]];
  return [0, 1, 2].map(i => sh[i] + u[i] * a + r * (Math.cos(phi) * t[i] + Math.sin(phi) * w[i]));
}
const botReach = side => { const s = side === 'l' ? 1 : -1, G = [s * GRIP_X, BAR1[1], BAR1[2]], E = elbowAt(side, G, END_ELEV);
  return { at: G, pole: sub(E, S[side]) }; };

const start = { ...base, reach: { l: topReach('l'), r: topReach('r') } };
const end = { ...base, reach: { l: botReach('l'), r: botReach('r') } };

// Mistake (card plate.mistake, c7, c3; key `flare`): the elbows flared wide, level with the shoulder in the side view
// (rankNote: "a flared elbow sits level with the shoulder instead of down toward the ribs"). The bar stays where the
// rail holds it, on the chest at mid-chest (c8): only the arms change. Each elbow is the lateral point of the arm's
// circle at the shoulder's z.
export function flaredElbow(side) {
  const s = side === 'l' ? 1 : -1, sh = S[side], G = [s * GRIP_X, BAR1[1], BAR1[2]];
  const f = phi => elbowOn(sh, G, phi)[2] - sh[2];
  let best = null;
  for (let k = 0; k < 360; k++) { const a = k * R, b = (k + 1) * R; if (f(a) * f(b) <= 0) { let lo = a, hi = b; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; }
    const e = elbowOn(sh, G, (lo + hi) / 2); if (!best || s * e[0] > s * best[0]) best = e; } }
  if (!best) throw new Error('smith_machine_bench_press: no flared elbow level with the shoulder');
  return best;
}
const misReach = side => { const s = side === 'l' ? 1 : -1; return { at: [s * GRIP_X, BAR1[1], BAR1[2]], pole: sub(flaredElbow(side), S[side]) }; };
const mistakePose = { reach: { l: misReach('l'), r: misReach('r') } };
const lmE = landmarksOf(end, H), lmM = landmarksOf({ ...end, ...mistakePose }, H);
// Ghost arm for the Mistake (the capsule copied from close_grip_bench_press @ 2dcbac1): upper arm and forearm with the
// engine's radii, as closed dashed guides, since the engine masks the faulty outline inside the solid body.
const capsule = (a, b, ra, rb, n = 8) => { const u = [b[1] - a[1], b[2] - a[2]], k = Math.hypot(...u), t = [u[0] / k, u[1] / k], nn = [-t[1], t[0]], pts = [];
  const ang0 = Math.atan2(nn[0], nn[1]);
  for (let i = 0; i <= n; i++) { const q = ang0 - Math.PI * i / n; pts.push([0, b[1] + rb * Math.cos(q), b[2] + rb * Math.sin(q)]); }
  for (let i = 0; i <= n; i++) { const q = ang0 + Math.PI - Math.PI * i / n; pts.push([0, a[1] + ra * Math.cos(q), a[2] + ra * Math.sin(q)]); }
  return [...pts, pts[0]]; };
const GHOST_UPPER = capsule(lmM['shoulder.r'], lmM['elbow.r'], 0.052, 0.040), GHOST_FORE = capsule(lmM['elbow.r'], lmM['grip.r'], 0.040, 0.026);
const elevOf = (lm, side) => +(Math.acos(dot(unit(sub(lm[`elbow.${side}`], lm[`shoulder.${side}`])), AXIS)) / R).toFixed(1);
export const info = () => ({ endElev: elevOf(lmE, 'r'), misElev: elevOf(lmM, 'r'), endElbowFootwardCm: +((lmE['elbow.r'][2] - S.r[2]) * 100).toFixed(1),
  misElbowFootwardCm: +((lmM['elbow.r'][2] - S.r[2]) * 100).toFixed(1), touchFootwardOfShoulderCm: +((BAR1[2] - S.r[2]) * 100).toFixed(1),
  railToNeckCm: +((RAIL_Z - lm0.neck[2]) * 100).toFixed(1), barTop: BAR0.map(v => +v.toFixed(3)), barTouch: BAR1.map(v => +v.toFixed(3)) });

export const STOP_Y = BAR1[1] - BAR_R - STOP_BELOW;   // the stop's top (c4)
const barOf = lm => [0, lm.grips[1], RAIL_Z];
export const rigOf = lm => smith({ railZ: RAIL_Z, bar: barOf(lm), stopY: STOP_Y, stop: STOP_SIZE, stopZ: 'front', base: [RAIL_Z - 0.12, RAIL_Z + 0.45] });
// The shoulder line (Mistake guide): straight out from the shoulder at 90 degrees to the torso, where the flared elbow sits.
const SHOULDER_LINE = [[0, S.r[1] + 0.22, S.r[2]], [0, BENCH_TOP + 0.01, S.r[2]]];
const START_DOT = Array.from({ length: 17 }, (_, k) => [0, BAR0[1] + 0.025 * Math.sin(k * Math.PI / 8), BAR0[2] + 0.025 * Math.cos(k * Math.PI / 8)]);

export default {
  id: 'smith_machine_bench_press', name: 'Smith Machine Bench Press', view: 'side', facing: 'right',
  camera: { x0: 205, y0: 339 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -1.12, to: 0.80 },
    { type: 'bench', at: [0, BENCH_TOP, BENCH_Z], len: BENCH_LEN },
    ...perItem(lm => rigOf(lm), SMITH_ITEMS),
    lm => [{ type: 'barbell', at: barOf(lm), plateD: PLATE_D, plates: [0.045], part: 'plate', z: 'back' },
      { type: 'pulley', at: barOf(lm), r: BAR_R, part: 'bar', z: 'front' }],
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: START_DOT, z: 'front', part: 'startbar' } : null),
  ],
  checks: [
    { landmark: 'backUpper', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all', tol: 1 },
    { landmark: 'buttock', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all', tol: 1 },
    { landmark: 'head', above: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all' },
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },          // feet flat (c2)
    { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'grips', at: [0, BAR1[1], BAR1[2]], pose: 'end', tol: 0.5 },                             // the bar at the touch point (c3)
    { landmark: 'chest', plane: { point: [0, BAR1[1] - BAR_R, 0], normal: [0, 1, 0] }, pose: 'end', tol: 1 }, // the chest touches the bar's underside (c3)
    { landmark: 'grip.r', at: topReach('r').at, pose: 'start', tol: 0.5 },                               // hands on the bar (c1)
    { landmark: 'grip.l', at: topReach('l').at, pose: 'start', tol: 0.5 },
  ],
  startParts: ['arm.r', 'arm.l', 'bar', 'carriage', 'hook'],
  ghosts: { count: 2, parts: ['arm.r', 'bar'] },
  trace: { point: 'grip.r', trim: [12, 12] },
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Press', s: 1, move: true }],
  callouts: [
    { key: 'midchest', text: 'Bar over<br>mid-chest', anchor: 'grip.r', box: { left: 200, top: 200 }, cue: 'Set the bench so the bar comes down onto the middle of your chest.' },
    { key: 'stops', text: 'Stops<br>set', anchor: [0, STOP_Y - STOP_SIZE.h / 2, RAIL_Z - STOP_SIZE.w / 2], box: { left: 56, top: 202 }, cue: 'Set the safety stops just below where the bar touches your chest.' },
    { key: 'blades', text: 'Blades<br>together', anchor: [0, BENCH_TOP, S.r[2]], box: { left: 70, top: 294 }, cue: 'Pull your shoulder blades together and down, and hold your chest up.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: GHOST_UPPER },                                                          // the flared upper arm (ghost)
      { kind: 'dashed', pts: GHOST_FORE },
      { kind: 'arrow', from: { at: 'elbow.r', pose: 'end', off: [-4, 4] }, to: { at: 'elbow.r', pose: 'mistake', off: [3, 3] } },   // the elbow swings out to shoulder level
      { kind: 'dashed', pts: SHOULDER_LINE },                                                        // the shoulder line: 90 degrees to the torso
    ],
    tells: [
      { key: 'flare', text: 'Elbows<br>flare wide', anchor: { at: 'elbow.r', pose: 'mistake' }, box: { left: 184, top: 200 }, cue: 'Your elbows flare out wide, level with your shoulders.' },
      { key: 'level', text: 'Level with<br>shoulders', anchor: SHOULDER_LINE[0], box: { left: 30, top: 150 }, cue: 'Your upper arms stick straight out, not about 45 degrees from your sides.' },
    ],
  },
  alt: 'Smith machine bench press, side view. Lying on a flat bench under the Smith bar, feet flat and shoulder blades together, the lifter lowers the bar straight down its rails to the middle of the chest, elbows about 45 degrees from the sides, stops set just below.',
};
