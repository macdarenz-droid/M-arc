// Smith Machine Incline Press (an adjustable bench at 30 degrees under the Smith bar), side view, facing right. H
// (D-LIB16R2-INCLINE: no Smith value in PARAMS, BENCH is not built, D-LIB10-BENCH-H; its sheet waits for
// incline_dumbbell_press to be pinned).
// View: SIDE (card plate.view = census view): the bench angle, the bar over the upper chest, the elbows and the
// straight bar path read in the sagittal plane (c1, c3).
// Clone sources (D-LIB9-CLONE), copied, never imported: incline_barbell_bench_press (LB2): `reclined()` (its bisects
// throw), the bench, the touch on the upper chest solved from the elbow angle with a plumb forearm (`touchAt`,
// `elbowUnder`), the flare Mistake (`misElbowAt`, MIS_DIP) with its ghost arm, joint ring and arrow;
// smith_machine_bench_press (pilot B): the rail through the touch, the top reach on the rail, the rig, the bar end dot
// and the stop drawn in front.
// Sources: research card docs/research/howto/cards/smith_machine_incline_press.json (claude/libht-research @
// a48b0594), claims c1 (bench at 30-45 degrees, the bar over the upper chest), c2 (blades together and down, chest up;
// grip slightly wider than the shoulders), c3 (lower to touch the upper chest lightly, elbows at about 45-75 degrees),
// c4 (feet flat; rotate the bar on the hooks), c5 (stops just below the touch), c6 (the Mistake: flaring the elbows),
// c14 (tempo).
// Geometry decisions:
//  - Bench: back pad BACK from vertical (card equipment: 30 degrees from the floor), the lifter reclined on it.
//  - Touch (c3): the thorax height whose plumb-forearm elbow sits ELBOW_DEG from the torso (the midpoint of 45-75);
//    the rail stands at that touch's z, so the bar's centre is on it in every pose.
//  - Start (c4): arms straight (TOP_ELBOW) on the rail line.
//  - Mistake (c6): the upper arms level with the shoulders, 90 degrees from the torso, at the solved depth MIS_DIP.
//  - Stop (c5): its top STOP_BELOW under the bar shaft's lowest drawn point, drawn in front (PLAN RULED).
// Plate labels: callouts = plate.checkpoints c1 (Bench 30-45°), c3 (To upper chest), c5 and c3 (Stops set); Mistake =
//   plate.mistake c6, c3 (key `flare`); tempo = plate.tempo (up 1, down 3, pause 0): Lower 3, Press 1 (Motra's 1 s
//   bottom pause, c14, is named, not drawn).
// Unsourced numbers: SIZES below, each with its basis in lb6/sizes.json (r2).
import { landmarksOf, fk, resolve, normPose, rootOnSeat, WINTER, REF } from '../engine.mjs';
import { inclineBench, inclineFaces } from '../eq/inclineBench.mjs';
import { perItem } from '../eq/parts.mjs';
import { smith, SMITH_ITEMS } from '../eq/smith.mjs';

export const SIZES = { BACK: 60, SEAT_TILT: 12, SEAT_TOP: 0.45, BACK_LEN: 0.84, FOOT_Z: 0.5, TOP_ELBOW: 4, GRIP_X: 0.3, ELBOW_DEG: 60,
  BAR_R: 0.025, PLATE_D: 0.45, STOP_BELOW: 0.02, STOP_W: 0.25, STOP_H: 0.05 };
const H = 1.75, BODY = { height: H };
const R = Math.PI / 180;
const { BACK, SEAT_TILT, SEAT_TOP, BACK_LEN, FOOT_Z, TOP_ELBOW, GRIP_X, ELBOW_DEG, BAR_R, PLATE_D, STOP_BELOW, STOP_W, STOP_H } = SIZES;
const BEAM_Z = [-0.80, 0.36];                         // incline_barbell_bench_press's bench beam
const TRUNK = 0;                                      // spine neutral against the pad (c6)
const SCAP = { elev: -1, pro: -3 };                   // blades together and down (cm) (c2)
const UPPER_CHEST = 0.77;                             // upper-chest level (thorax height, H), for the report (c3)
const OCCIPUT = [0, 0.955, -0.056];                   // back of the skull, side head outline (head frame, H)

// ---- reclined class (copied from incline_dumbbell_press; the bisect throws on a bracket with no root) ----
const bisect = (f, lo, hi) => { if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error(`smith_machine_incline_press: no solution in [${lo}, ${hi}]`); for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
const skOf = (p, height = H) => { const b = { height }; return fk(resolve(normPose(p, b), b).q, b); };

/** Reclined on a seat + back pad: returns { pose: { root, trunk, neck }, hinge, faces, seatPt }. */
function reclined({ back, seatTilt = 0, seatTop, trunk = 0, height = H }) {
  const seatPt = [0, seatTop, 0];
  const at = tilt => ({ root: { at: rootOnSeat(seatPt, tilt, height), tilt }, trunk });
  const ang = tilt => { const lm = landmarksOf(at(tilt), height), d = [lm.backUpper[1] - lm.buttock[1], lm.backUpper[2] - lm.buttock[2]];
    return Math.atan2(-d[1], d[0]) / R; };   // recline of the buttock->backUpper line from vertical
  const tilt = bisect(t => back - ang(t), -100, 20);   // the recline falls as the pelvis tilts forward
  const p0 = at(tilt), lm = landmarksOf(p0, height);
  const u = [0, lm.backUpper[1] - lm.buttock[1], lm.backUpper[2] - lm.buttock[2]];
  const sn = [0, Math.cos(seatTilt * R), -Math.sin(seatTilt * R)];
  const k = ((seatPt[1] - lm.buttock[1]) * sn[1] + (seatPt[2] - lm.buttock[2]) * sn[2]) / (u[1] * sn[1] + u[2] * sn[2]);
  const hinge = [0, lm.buttock[1] + u[1] * k, lm.buttock[2] + u[2] * k];
  const faces = inclineFaces({ hinge, back, seatTilt });
  const n = faces.back.normal;
  const neck = bisect(nk => { const o = skOf({ ...p0, neck: nk }, height).head(OCCIPUT);
    return (o[1] - hinge[1]) * n[1] + (o[2] - hinge[2]) * n[2]; }, -40, 40);
  return { pose: { ...p0, neck }, hinge, faces, seatPt };
}

const REC = reclined({ back: BACK, seatTilt: SEAT_TILT, seatTop: SEAT_TOP, trunk: TRUNK });
const { hinge: HINGE, faces: F } = REC;
const feet = { l: { at: [0.10, 0, FOOT_Z] }, r: { at: [-0.10, 0, FOOT_Z] } };
const base = { ...REC.pose, scap: SCAP, plant: feet };
const lm0 = landmarksOf(base, H), sk0 = skOf(base);
const S = { l: lm0['shoulder.l'], r: lm0['shoulder.r'] };
const L1 = WINTER.upperArm * H, L2 = WINTER.forearm * H + REF.gripOff * H;
const UP = F.back.up, NB = F.back.normal;                                 // torso axis (toward the head), chest normal

// The bar's centre with its underside on the chest surface at thorax height h (the shaft radius out along the chest).
const onChest = h => { const c = sk0.thorax([0, h, 0.072]); return [0, c[1] + NB[1] * BAR_R, c[2] + NB[2] * BAR_R]; };
// Bottom (c7): the elbow in the side view straight under the grip (same z), at L1 from the shoulder and L2 from the
// grip: the two circles in the plane z = bar z meet at the elbow; the lateral of the two points is taken.
const elbowUnder = (bar, side) => { const s = side === 'l' ? 1 : -1, sh = S[side], G = [s * GRIP_X, bar[1], bar[2]];
  const dz = G[2] - sh[2], r1 = L1 * L1 - dz * dz, P = [sh[0], sh[1]], Q = [G[0], G[1]], d = Math.hypot(Q[0] - P[0], Q[1] - P[1]);
  const a = (r1 - L2 * L2 + d * d) / (2 * d), hh = r1 - a * a;
  if (!(r1 > 0 && hh >= 0)) throw new Error('smith_machine_incline_press: no elbow under the bar');
  const m = [P[0] + a * (Q[0] - P[0]) / d, P[1] + a * (Q[1] - P[1]) / d], k = Math.sqrt(hh);
  const c = [[m[0] + k * (Q[1] - P[1]) / d, m[1] - k * (Q[0] - P[0]) / d], [m[0] - k * (Q[1] - P[1]) / d, m[1] + k * (Q[0] - P[0]) / d]];
  const E = c.sort((u, v) => s * (v[0] - u[0]))[0];
  return [E[0], E[1], G[2]]; };
// Upper arm from the torso axis (deg, 3D): 0 along the torso toward the hips, 90 out level with the shoulder.
export const armFromTorso = (E, side = 'r') => { const sh = S[side], u = E.map((v, i) => v - sh[i]), n = Math.hypot(...u);
  return Math.acos(-(u[1] * UP[1] + u[2] * UP[2]) / n) / R; };
// TOUCH: the thorax height whose plumb-forearm elbow sits ELBOW_DEG from the torso (the higher the touch, the wider).
const touchAt = deg => bisect(h => armFromTorso(elbowUnder(onChest(h), 'r')) - deg, 0.73, 0.90);
export const TOUCH = touchAt(ELBOW_DEG);
const BAR1 = onChest(TOUCH);
export const RAIL_Z = BAR1[2];                        // the rail: the bar's one vertical line, over the upper chest (c1, c8 of the anchor)
const botReach = side => { const s = side === 'l' ? 1 : -1, E = elbowUnder(BAR1, side), sh = S[side];
  return { at: [s * GRIP_X, BAR1[1], BAR1[2]], pole: E.map((v, i) => v - sh[i]) }; };
// Top (c4): arms straight (TOP_ELBOW), the bar up its rail line (smith_machine_bench_press's topReach).
const topReach = side => { const s = side === 'l' ? 1 : -1, sh = S[side];
  const d = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(TOP_ELBOW * R)), h2 = d * d - (GRIP_X - Math.abs(sh[0])) ** 2 - (RAIL_Z - sh[2]) ** 2;
  if (!(h2 > 0)) throw new Error('smith_machine_incline_press: no top grip');
  return { at: [s * GRIP_X, sh[1] + Math.sqrt(h2), RAIL_Z], pole: [s * 1, -0.2, 0.3] }; };
const BAR0 = [0, topReach('r').at[1], RAIL_Z];

const start = { ...base, reach: { l: topReach('l'), r: topReach('r') } };
const end = { ...base, reach: { l: botReach('l'), r: botReach('r') } };

// Mistake (card plate.mistake, c8, c9, c7; key `flare`): the elbows flare out excessively as the bar comes down. The
// bar touches at the same place; the upper arm goes out level with the shoulder, 90 deg from the torso axis (square to
// the pad), turned about the torso axis to the depth (MIS_DIP, solved) where the forearm still reaches the bar.
const misElbowAt = (dip, side) => { const s = side === 'l' ? 1 : -1, sh = S[side], dp = dip * R;
  return [sh[0] + s * L1 * Math.cos(dp), sh[1] + NB[1] * L1 * Math.sin(dp), sh[2] + NB[2] * L1 * Math.sin(dp)]; };
export const MIS_DIP = bisect(d => L2 - Math.hypot(...misElbowAt(d, 'r').map((v, i) => v - [-GRIP_X, BAR1[1], BAR1[2]][i])), -40, 20);
const misReach = side => { const s = side === 'l' ? 1 : -1, E = misElbowAt(MIS_DIP, side), sh = S[side];
  return { at: [s * GRIP_X, BAR1[1], BAR1[2]], pole: E.map((v, i) => v - sh[i]) }; };
const mistakePose = { reach: { l: misReach('l'), r: misReach('r') } };
const lmE = landmarksOf(end, H), lmM = landmarksOf({ ...end, ...mistakePose }, H);
// Ghost arm for the Mistake (the capsule copied from close_grip_bench_press): upper arm and forearm with the engine's
// radii, as closed dashed guides, since the engine masks the faulty outline inside the solid body.
const capsule = (a, b, ra, rb, n = 8) => { const u = [b[1] - a[1], b[2] - a[2]], k = Math.hypot(...u), t = [u[0] / k, u[1] / k], nn = [-t[1], t[0]], pts = [];
  const ang0 = Math.atan2(nn[0], nn[1]);
  for (let i = 0; i <= n; i++) { const q = ang0 - Math.PI * i / n; pts.push([0, b[1] + rb * Math.cos(q), b[2] + rb * Math.sin(q)]); }
  for (let i = 0; i <= n; i++) { const q = ang0 + Math.PI - Math.PI * i / n; pts.push([0, a[1] + ra * Math.cos(q), a[2] + ra * Math.sin(q)]); }
  return [...pts, pts[0]]; };
// Panel 2 fix (#265 6396940823, R5): a dashed ring of the joint-marker radius (2.25 px, plate.mjs) at the flared elbow,
// and the arrow runs the full way from the correct elbow to that ring.
const JOINT_R = 2.25 / 146.29;
const RING = Array.from({ length: 13 }, (_, k) => [0, lmM['elbow.r'][1] + JOINT_R * Math.sin(2 * Math.PI * k / 12), lmM['elbow.r'][2] + JOINT_R * Math.cos(2 * Math.PI * k / 12)]);
const RING_EDGE = (() => { const a = lmE['elbow.r'], b = lmM['elbow.r'], d = Math.hypot(b[1] - a[1], b[2] - a[2]);
  return [0, b[1] - (b[1] - a[1]) / d * JOINT_R, b[2] - (b[2] - a[2]) / d * JOINT_R]; })();
const GHOST_UPPER = capsule(lmM['shoulder.r'], lmM['elbow.r'], 0.052, 0.040), GHOST_FORE = capsule(lmM['elbow.r'], lmM['grip.r'], 0.040, 0.026);
export const info = () => { const e = lmE['elbow.r'], m = lmM['elbow.r'], along = p => (p[1] - S.r[1]) * UP[1] + (p[2] - S.r[2]) * UP[2];
  return { touch: +TOUCH.toFixed(4), touchBelowUpperChestCm: +((UPPER_CHEST - TOUCH) * H * 100).toFixed(1), endArmFromTorsoDeg: +armFromTorso(e).toFixed(1),
    misArmFromTorsoDeg: +armFromTorso(m).toFixed(1), misDip: +MIS_DIP.toFixed(1), misElbowAlongTorsoCm: +(along(m) * 100).toFixed(1),
    endElbowAlongTorsoCm: +(along(e) * 100).toFixed(1),
    endBarToChinCm: +(Math.hypot(BAR1[1] - lmE.chin[1], BAR1[2] - lmE.chin[2]) * 100).toFixed(1) }; };

const barOf = lm => [0, lm.grips[1], RAIL_Z];
export const STOP_Y = BAR1[1] - BAR_R - STOP_BELOW;   // the stop's top, just below the touch (c5, c3)
const rigOf = lm => smith({ railZ: RAIL_Z, bar: barOf(lm), stopY: STOP_Y, stop: { w: STOP_W, h: STOP_H }, stopZ: 'front', base: [RAIL_Z - 0.45, RAIL_Z + 0.25] });
const START_DOT = Array.from({ length: 17 }, (_, k) => [0, BAR0[1] + BAR_R * Math.sin(k * Math.PI / 8), BAR0[2] + BAR_R * Math.cos(k * Math.PI / 8)]);
// label and measure points on the back face of the back pad (PAD = 7 cm, the composer default)
const PAD = 0.07, onPadBack = u => [0, HINGE[1] + UP[1] * u - NB[1] * PAD, HINGE[2] + UP[2] * u - NB[2] * PAD];
const onPadFront = u => [0, HINGE[1] + UP[1] * u, HINGE[2] + UP[2] * u];   // on the pad face the back lies on

export default {
  id: 'smith_machine_incline_press', name: 'Smith Machine Incline Press', view: 'side', facing: 'right',
  camera: { x0: 228, y0: 339 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -1.12, to: 0.85 },
    ...inclineBench({ hinge: HINGE, back: BACK, seatTilt: SEAT_TILT, backLen: BACK_LEN, beamZ: BEAM_Z }),
    ...perItem(lm => rigOf(lm), SMITH_ITEMS),
    lm => [{ type: 'barbell', at: barOf(lm), plateD: PLATE_D, plates: [0.045], part: 'plate', z: 'back' },
      { type: 'pulley', at: barOf(lm), r: BAR_R, part: 'bar', z: 'front' }],
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: START_DOT, z: 'front', part: 'startbar' } : null),
  ],
  checks: [
    { landmark: 'seat', plane: { point: F.seat.point, normal: F.seat.normal }, pose: 'all', tol: 1 },       // c2 sitting on the incline
    { landmark: 'backUpper', plane: { point: F.back.point, normal: F.back.normal }, pose: 'all', tol: 1 },  // shoulders on the pad
    { landmark: 'buttock', plane: { point: F.back.point, normal: F.back.normal }, pose: 'all', tol: 1 },
    { landmark: 'head', above: { point: F.back.point, normal: F.back.normal }, pose: 'all' },
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },          // c4 feet flat
    { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'wrist.r', at: landmarksOf(start, H)['wrist.r'], pose: 'start', tol: 0.5 },               // c2 hands on the bar
    { landmark: 'wrist.l', at: landmarksOf(start, H)['wrist.l'], pose: 'start', tol: 0.5 },
    { landmark: 'grips', at: BAR0, pose: 'start', tol: 0.5 },                                               // the bar on its line
    { landmark: 'grips', at: BAR1, pose: 'end', tol: 0.5 },
    { landmark: 'sternum', plane: { point: [0, BAR1[1] - NB[1] * BAR_R, BAR1[2] - NB[2] * BAR_R], normal: NB }, pose: 'end', tol: 2 },   // c3 the bar touches the upper chest
  ],
  startParts: ['arm.r', 'arm.l', 'bar', 'carriage', 'hook'],
  ghosts: { count: 2, parts: ['arm.r', 'bar'] },
  trace: { point: 'grip.r', trim: [12, 12] },
  tempo: [{ phase: 'Lower', s: 3, move: true }, { phase: 'Press', s: 1, move: true }],
  callouts: [
    { key: 'bench', text: 'Bench<br>30-45°', anchor: onPadBack(0.62), cue: 'Set the back pad at 30 to 45 degrees, not steeper.' },
    { key: 'chest', text: 'To upper<br>chest', anchor: 'grip.r', box: { left: 230, top: 150 }, cue: 'Lower the bar under control to touch your upper chest lightly.' },
    { key: 'stops', text: 'Stops<br>set', anchor: [0, STOP_Y - STOP_H / 2, RAIL_Z + STOP_W / 2], box: { left: 250, top: 196 }, cue: 'Set the safety stops just below where the bar touches your upper chest.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: GHOST_UPPER },                                                          // the flared upper arm (ghost)
      { kind: 'dashed', pts: GHOST_FORE },
      { kind: 'dashed', pts: RING },                                                                 // the flared elbow's joint ring
      { kind: 'arrow', from: [0, lmE['elbow.r'][1], lmE['elbow.r'][2]], to: RING_EDGE },             // from the correct elbow to the ring
    ],
    tells: [
      { key: 'flare', text: 'Elbows<br>flare out', anchor: { at: 'elbow.r', pose: 'mistake' }, box: { left: 24, top: 248 }, cue: 'Your elbows flare wide as the bar comes down.' },
      { key: 'level', text: 'Level with<br>shoulders', anchor: { at: 'shoulder.r', pose: 'mistake' }, box: { left: 8, top: 198 }, cue: 'Your upper arms come up level with your shoulders instead of 45 to 75 degrees.' },
    ],
  },
  alt: 'Smith machine incline press, side view. On a bench set to 30 degrees under the Smith bar, feet flat and shoulder blades together, the lifter lowers the bar straight down its rails from straight arms to touch the upper chest, elbows about 60 degrees from the sides.',
};
