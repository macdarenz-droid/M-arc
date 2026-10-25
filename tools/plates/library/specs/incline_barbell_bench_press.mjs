// Incline Barbell Bench Press (adjustable bench at 30 deg in a rack), side view, facing right. H (D-LIB10-BENCH-H, #265).
// View: SIDE (card plate.view = census view): the bench angle, the upper-chest touch and the back on the pad read in the
// sagittal plane (c1, c7, c3); the flared elbow (the Mistake, c8, c9) reads as the elbow up level with the shoulder.
// Clone sources (D-LIB9-CLONE): the reclined class of incline_dumbbell_press (pilot A, main 1edb3c6), copied, never
// imported: `reclined()` (its bisect throws on a bracket with no root, rule b), the seat tilt, seat height, back-pad
// length, feet and scapular set; and barbell_bench_press's barbell, rack (two vendor rackUprights, the head-side one with
// its J-hook, and a safety pin drawn with parts.mjs sideBar), grip width and side-view-vertical forearm (LB2, #265).
// The bench is pilot A's `inclineBench` composer (imported; composers may be imported).
// Sources: research card docs/research/howto/cards/incline_barbell_bench_press.json (claude/libht-research 7d7c52e1,
// LB2 CARD FIELDS VERIFIED @ ccbe6f5), claims c1 (bench 30 to 45 degrees; upper-chest EMG peaked at 30), c3 (feet flat;
// head, shoulders and hips on the bench), c4 (grip slightly wider than shoulder width), c5 (unrack, bar on straight
// arms above the shoulders), c6 (safety catches), c7 (lower to the upper chest, elbows at 45-75 degrees to the torso),
// c8 and c9 (the Mistake: elbows flaring out excessively), c14 (tempo).
// Geometry decisions:
//  - Bench: `inclineBench`, back pad BACK = 60 deg from vertical, i.e. 30 deg from horizontal (c1); the measure arc
//    reads 30 deg from horizontal (plateFacts c1).
//  - Reclined class (copied): checks prove seat on the seat face, backUpper and buttock on the back pad (tol 1 cm),
//    head clearance and soles on the floor (c3).
//  - Grip (c4): GRIP_X off the midline, LB2's one number for "slightly wider than shoulder width" (as barbell_bench_press).
//  - Start (top, c5): arms straight (TOP_ELBOW 4) and vertical, the bar over the shoulder joints.
//  - End (bottom, c7): the bar's underside on the chest surface at thorax height TOUCH, solved so the upper arm sits at
//    60 deg from the torso axis (the plateFacts c7 midpoint of 45-75); the elbow straight under the bar in the side view
//    (forearm vertical), placed by the two arm lengths, as barbell_bench_press. info() reports TOUCH against the upper
//    chest (incline_dumbbell_press's UPPER_CHEST 0.77 H).
//  - Rack: the bench's own rack (card equipment): one upright at the head end; the racked bar over the brow, reachable
//    with the elbows RACK_ELBOW bent, in its J-hook. The safety catch runs footward from the upright, SAFETY_BELOW under
//    the bar's underside at the touch, to CATCH_PAST beyond it (c6); it sits behind the lifter (z back), so its span
//    is redrawn dashed in the end pose (13 Q2 (c), as barbell_bench_press).
//  - Engine limit (as barbell_bench_press): the start sleeve is a dashed dot in the end layer.
//  - Scale: reference 146.29 px/m.
// Plate labels (card): callouts = plate.checkpoints c1 (Bench at 30°), c7 (To upper chest), c3 (Back on pad); measure =
//   back pad from horizontal, expect 30 (c1); Mistake = plate.mistake c8, c9, c7 (key `flare`): the elbow raised level
//   with the shoulder at the bottom (D-LIB10-NOTE section 8), a dashed ghost upper arm and forearm with an arrow from
//   the end elbow; tempo = plate.tempo c14 (up 1, down 2, no pause): Lower 2, Press 1.
// Unsourced numbers (no card claim gives them; 13.3 must-fix 14): SEAT_TILT, SEAT_TOP, BACK_LEN, BEAM_Z, FOOT_Z and SCAP
//   (incline_dumbbell_press's), TOP_ELBOW (the anchor's), GRIP_X 0.30 (as barbell_bench_press), RACK_ELBOW 25 and the
//   bar over the brow, RACK_H, SAFETY_BELOW, CATCH_PAST, PLATE_D (45 cm, as the 8), and the Mistake's 90 deg (the flared
//   upper arm level with the shoulder: c8 names no angle).
import { landmarksOf, fk, resolve, normPose, rootOnSeat, WINTER, REF } from '../engine.mjs';
import { inclineBench, inclineFaces } from '../eq/inclineBench.mjs';
import { sideBar } from '../eq/parts.mjs';

const H = 1.75, BODY = { height: H };
const R = Math.PI / 180;
const BACK = 60;                                      // back pad from vertical (deg): 30 deg from horizontal (c1)
const SEAT_TILT = 12;                                 // seat front edge up (deg)
const SEAT_TOP = 0.45;                                // seat face height at the lifter's seat contact (m)
const BACK_LEN = 0.84;                                // back pad length (m): reaches past the back of the head
const BEAM_Z = [-0.80, 0.36];                         // floor beam rear / front ends (m)
const TRUNK = 0;                                      // spine neutral against the pad (c3, c9)
const FOOT_Z = 0.50;                                  // mid-sole in front of the hip joint (m)
const SCAP = { elev: -1, pro: -3 };                   // blades back and down (cm)
const TOP_ELBOW = 4;                                  // top: elbow flexion (deg), arms straight (c5)
const GRIP_X = 0.30;                                  // grip centre off the midline (m): slightly wider than shoulder width (c4)
const ELBOW_DEG = 60;                                 // end: upper arm from the torso axis (deg), the midpoint of c7's 45-75
const UPPER_CHEST = 0.77;                             // upper-chest level (thorax height, H), for the report (c7)
const BAR_R = 0.014;                                  // bar shaft radius (m), the vendored 28 mm shaft
const RACK_ELBOW = 25;                                // elbow bend when the hands reach the racked bar (deg)
const RACK_H = 1.6;                                   // upright height (m)
const CATCH_PAST = 0.24;                              // safety catch end footward of the touch (m)
const SAFETY_BELOW = 0.03;                            // safety pin top under the bar's underside at the touch (m) (c6)
const PLATE_D = 0.45;                                 // plate diameter (m)
const OCCIPUT = [0, 0.955, -0.056];                   // back of the skull, side head outline (head frame, H)
const FOREHEAD = [0, 0.95, 0.06];                     // brow top on the side head outline (head frame, H)

// ---- reclined class (copied from incline_dumbbell_press; the bisect throws on a bracket with no root) ----
export const bisect = (f, lo, hi) => { if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error(`incline_barbell_bench_press: no solution in [${lo}, ${hi}]`); for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
const skOf = (p, height = H) => { const b = { height }; return fk(resolve(normPose(p, b), b).q, b); };

/** Reclined on a seat + back pad: returns { pose: { root, trunk, neck }, hinge, faces, seatPt }. */
export function reclined({ back, seatTilt = 0, seatTop, trunk = 0, height = H }) {
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

// Top (c5): arms straight and vertical, the bar over the shoulder joints.
const topReach = side => { const s = side === 'l' ? 1 : -1, sh = S[side];
  const d = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(TOP_ELBOW * R));
  return { at: [s * GRIP_X, sh[1] + Math.sqrt(d * d - (GRIP_X - Math.abs(sh[0])) ** 2), sh[2]], pole: [s * 1, -0.2, 0.3] }; };
const BAR0 = [0, topReach('r').at[1], topReach('r').at[2]];
// The bar's centre with its underside on the chest surface at thorax height h (the shaft radius out along the chest).
const onChest = h => { const c = sk0.thorax([0, h, 0.072]); return [0, c[1] + NB[1] * BAR_R, c[2] + NB[2] * BAR_R]; };
// Bottom (c7): the elbow in the side view straight under the grip (same z), at L1 from the shoulder and L2 from the
// grip: the two circles in the plane z = bar z meet at the elbow; the lateral of the two points is taken.
const elbowUnder = (bar, side) => { const s = side === 'l' ? 1 : -1, sh = S[side], G = [s * GRIP_X, bar[1], bar[2]];
  const dz = G[2] - sh[2], r1 = L1 * L1 - dz * dz, P = [sh[0], sh[1]], Q = [G[0], G[1]], d = Math.hypot(Q[0] - P[0], Q[1] - P[1]);
  const a = (r1 - L2 * L2 + d * d) / (2 * d), hh = r1 - a * a;
  if (!(r1 > 0 && hh >= 0)) throw new Error('incline_barbell_bench_press: no elbow under the bar');
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
const botReach = side => { const s = side === 'l' ? 1 : -1, E = elbowUnder(BAR1, side), sh = S[side];
  return { at: [s * GRIP_X, BAR1[1], BAR1[2]], pole: E.map((v, i) => v - sh[i]) }; };

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
const GHOST_UPPER = capsule(lmM['shoulder.r'], lmM['elbow.r'], 0.052, 0.040), GHOST_FORE = capsule(lmM['elbow.r'], lmM['grip.r'], 0.040, 0.026);
export const info = () => { const e = lmE['elbow.r'], m = lmM['elbow.r'], along = p => (p[1] - S.r[1]) * UP[1] + (p[2] - S.r[2]) * UP[2];
  return { touch: +TOUCH.toFixed(4), touchBelowUpperChestCm: +((UPPER_CHEST - TOUCH) * H * 100).toFixed(1), endArmFromTorsoDeg: +armFromTorso(e).toFixed(1),
    misArmFromTorsoDeg: +armFromTorso(m).toFixed(1), misDip: +MIS_DIP.toFixed(1), misElbowAlongTorsoCm: +(along(m) * 100).toFixed(1),
    endElbowAlongTorsoCm: +(along(e) * 100).toFixed(1),
    endBarToChinCm: +(Math.hypot(BAR1[1] - lmE.chin[1], BAR1[2] - lmE.chin[2]) * 100).toFixed(1) }; };

// Rack: the racked bar over the brow, reachable with the elbows RACK_ELBOW bent; the vendor J-hook (7 cm arm, 5 cm lip)
// on the upright's foot-side face holds it (c5).
const RACK_Z = sk0.head(FOREHEAD)[2];
const reachLen = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(RACK_ELBOW * R));
const RACK_BAR = (() => { const sh = S.r, dz = RACK_Z - sh[2], dx = GRIP_X - Math.abs(sh[0]); return [0, sh[1] + Math.sqrt(reachLen * reachLen - dz * dz - dx * dx), RACK_Z]; })();
const HOOK_Y = RACK_BAR[1] - BAR_R, UPRIGHT_W = 0.076;
const HEAD_UPRIGHT_Z = RACK_Z - UPRIGHT_W / 2 - 0.055;
const SAFETY_Y = BAR1[1] - BAR_R - SAFETY_BELOW, PIN_T = 0.05;
const PIN = sideBar([0, SAFETY_Y - PIN_T / 2, HEAD_UPRIGHT_Z], [0, SAFETY_Y - PIN_T / 2, BAR1[2] + CATCH_PAST], PIN_T, { z: 'back' });
const PIN_PHANTOM = [SAFETY_Y, SAFETY_Y - PIN_T].map(y => ({ type: 'line', cls: 'eq-line m-line', z: 'front', part: 'safety', pts: [[0, y, HEAD_UPRIGHT_Z], [0, y, BAR1[2] + CATCH_PAST]] }));
export const rackInfo = () => ({ rackBar: RACK_BAR.map(v => +v.toFixed(3)), hookY: +HOOK_Y.toFixed(3), headUprightZ: +HEAD_UPRIGHT_Z.toFixed(3), safetyY: +SAFETY_Y.toFixed(3) });

const barOf = lm => [0, lm.grips[1], lm.grips[2]];
const START_DOT = Array.from({ length: 17 }, (_, k) => [0, BAR0[1] + 0.025 * Math.sin(k * Math.PI / 8), BAR0[2] + 0.025 * Math.cos(k * Math.PI / 8)]);
const ring = (c, r, n = 16) => Array.from({ length: n + 1 }, (_, k) => [0, c[1] + r * Math.sin(2 * Math.PI * k / n), c[2] + r * Math.cos(2 * Math.PI * k / n)]);
// label and measure points on the back face of the back pad (PAD = 7 cm, the composer default)
const PAD = 0.07, onPadBack = u => [0, HINGE[1] + UP[1] * u - NB[1] * PAD, HINGE[2] + UP[2] * u - NB[2] * PAD];
const onPadFront = u => [0, HINGE[1] + UP[1] * u, HINGE[2] + UP[2] * u];   // on the pad face the back lies on

export default {
  id: 'incline_barbell_bench_press', name: 'Incline Barbell Bench Press', view: 'side', facing: 'right',
  camera: { x0: 228, y0: 339 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -1.12, to: 0.85 },
    ...inclineBench({ hinge: HINGE, back: BACK, seatTilt: SEAT_TILT, backLen: BACK_LEN, beamZ: BEAM_Z }),
    { type: 'rackUpright', at: [0, 0, HEAD_UPRIGHT_Z], h: RACK_H, hook: HOOK_Y, z: 'back' },
    PIN,
    (lm, ctx) => (ctx.pose === 'end' && !ctx.mistake ? PIN_PHANTOM : null),
    lm => [{ type: 'barbell', at: barOf(lm), plateD: PLATE_D, plates: [0.045], part: 'plate', z: 'back' },
      { type: 'pulley', at: barOf(lm), r: 0.025, part: 'bar', z: 'front' }],
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: START_DOT, z: 'front', part: 'startbar' } : null),
  ],
  checks: [
    { landmark: 'seat', plane: { point: F.seat.point, normal: F.seat.normal }, pose: 'all', tol: 1 },       // hips on the seat (c3)
    { landmark: 'backUpper', plane: { point: F.back.point, normal: F.back.normal }, pose: 'all', tol: 1 },  // shoulders on the pad (c3)
    { landmark: 'buttock', plane: { point: F.back.point, normal: F.back.normal }, pose: 'all', tol: 1 },    // hips on the pad (c3)
    { landmark: 'head', above: { point: F.back.point, normal: F.back.normal }, pose: 'all' },
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },          // feet flat (c3)
    { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
  ],
  startParts: ['arm.r', 'arm.l', 'bar'],
  ghosts: { count: 2, parts: ['arm.r', 'bar'] },
  trace: { point: 'grip.r', trim: [12, 12] },
  measure: { vertex: onPadBack(0.04), from: 'back', to: { dir: [UP[2], UP[1]] }, radius: 28, title: 'Bench', value: '30°', expect: 90 - BACK, box: { left: 58, top: 260 } },
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Press', s: 1, move: true }],
  callouts: [
    { key: 'bench', text: 'Bench<br>at 30°', anchor: onPadBack(0.62), box: { left: 40, top: 214 }, cue: 'Set the back pad to about 30 degrees, never steeper than 45.' },
    { key: 'chest', text: 'To upper<br>chest', anchor: 'grip.r', box: { left: 222, top: 176 }, cue: 'Lower the bar under control to the top of your chest, not your neck.' },
    { key: 'pad', text: 'Back<br>on pad', anchor: onPadFront(0.30), box: { left: 160, top: 286 }, cue: 'Keep your head, shoulders and hips on the bench, with no big arch.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: GHOST_UPPER },                                                          // the flared upper arm (ghost)
      { kind: 'dashed', pts: GHOST_FORE },
      { kind: 'arrow', from: { at: 'elbow.r', pose: 'end', off: [-4, -4] }, to: { at: 'elbow.r', pose: 'mistake', off: [3, 3] } },   // the elbow swings up and out
    ],
    tells: [
      { key: 'flare', text: 'Elbows<br>flare out', anchor: { at: 'elbow.r', pose: 'mistake' }, box: { left: 24, top: 248 }, cue: 'Your elbows flare out as the bar comes down.' },
      { key: 'level', text: 'Level with<br>shoulders', anchor: [0, (lmM['shoulder.r'][1] + lmM['elbow.r'][1]) / 2, (lmM['shoulder.r'][2] + lmM['elbow.r'][2]) / 2], box: { left: 8, top: 198 }, cue: 'Your upper arms come up level with your shoulders instead of staying below them.' },
    ],
  },
  alt: 'Incline barbell bench press, side view. On a bench set to 30 degrees in a rack, head, shoulders and hips on the pad and feet flat, the lifter lowers the bar from straight arms over the shoulders to the upper chest, forearms vertical, then presses back up.',
};
