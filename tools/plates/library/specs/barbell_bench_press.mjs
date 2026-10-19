// Barbell Bench Press (flat bench in a rack), side view, facing right. H (D-LIB10-BENCH-H; D-LIB10-BBELBOW, #265).
// View: SIDE (card plate.view = census view): the mid-chest touch, the vertical forearm, the hips on the bench and the
// diagonal bar path read in the sagittal plane (c2, c8, c10).
// Clone source (D-LIB9-CLONE): the supine class of dumbbell_bench_press (pilot A, #109 @ e6f39ff; D-LIB8FIX-CARRY),
// copied, never imported: `supine()` with its bisect made to throw when its bracket holds no root (rule b), the flat
// bench at 43 cm, the feet, the scapular set, the straight-arm top over the shoulder joints and the nipple-line point.
// The rack is close_grip_bench_press's rig (D-LIB10-BBELBOW 1: the two flat-bench plates match): two vendor
// rackUprights, the head-side one with its J-hook, and a safety pin drawn with parts.mjs sideBar.
// Sources: research card docs/research/howto/cards/barbell_bench_press.json (claude/libht-research-lb2 2b6747f8,
// named on #265), claims c1 (grip slightly wider than shoulder-width; hips into the bench as the bar comes off the
// rack), c2 (lower to the middle of the chest; forearms perpendicular to the floor at the bottom; StrongLifts "tucking
// your elbows in about 75°"), c6 (power rack, safety pins slightly lower than the bottom), c8 (bar path a diagonal line
// from mid-chest to over the shoulders), c10 (buttocks stay on the bench), c12 (blades together), c14 (feet flat),
// c25 (the Mistake: the bar driven straight up off the chest instead of up and back), c26, c18, c17 (tempo).
// c3's "45 to 60 degrees" is no fact and no label (D-LIB10-BBELBOW): on this body a mid-chest touch with a vertical
// forearm puts the upper arm at about 70° (#265 comment 6256258126); research reconciles c3 (R-LB2-24).
// Geometry decisions:
//  - Supine class (copied): checks prove backUpper and buttock on the pad (plane, tol 1 cm), head clearance and soles
//    on the floor (c10, c14).
//  - Grip (c1): GRIP_X off the midline, LB2's one number for "slightly wider than shoulder-width" (decline_bench_press's
//    GRIP_X, D-LIB10-NOTE Q1(b) condition 2).
//  - Start (top, c8): arms straight (TOP_ELBOW 4) and vertical, the bar over the shoulder joints.
//  - End (bottom, c2): the bar's underside on the chest surface at the nipple line (thorax 0.72 H, the anchor's MID);
//    the elbow straight under the bar in the side view (forearm vertical, c2), placed by the two arm lengths; the
//    forearm leans in the front plane, which the side view does not show.
//  - Bar path (c8): the Trace runs the diagonal from mid-chest to over the shoulders.
//  - Engine limit (as barbell_back_squat): the start sleeve is a dashed dot in the end layer.
//  - Scale: reference 146.29 px/m.
// Plate labels (card, 2b6747f8): callouts = plate.checkpoints c10 (Hips down), c8 (Mid-chest touch), c2 (Forearms
//   vertical); Mistake = plate.mistake c25 (key `path`): the bar driven straight up from the touch; tempo = plate.tempo
//   c26, c18, c17 (up 1, down 2, pause 1): Lower 2, Press 1, Hold 1 (D-LIB10-NOTE section 9).
// Unsourced numbers (no card claim gives them; 13.3 must-fix 14): BENCH_TOP, BENCH_LEN, BENCH_Z and FOOT_Z (the
//   anchor's), TOP_ELBOW (the anchor's), GRIP_X 0.30 (as decline_bench_press), RACK_ELBOW 25 and the bar over the brow,
//   RACK_DEPTH (1.6 m, a deep power rack: the foot-side upright stands clear of the labels), RACK_H, SAFETY_BELOW, PLATE_D (45 cm, as the 8), MIS_RISE (how far the faulty bar is drawn).
import { landmarksOf, fk, resolve, normPose, WINTER, REF } from '../engine.mjs';
import { sideBar } from '../eq/parts.mjs';

const H = 1.75, BODY = { height: H };
const R = Math.PI / 180;
const BENCH_TOP = 0.43, BENCH_LEN = 1.2, BENCH_Z = -0.40;   // the anchor's flat bench (m)
const FOOT_Z = 0.51;                                  // mid-sole in front of the hip joint (m), the anchor's
const SCAP = { elev: -1, pro: -3 };                   // blades together (cm) (c12)
const TOP_ELBOW = 4;                                  // top: elbow flexion (deg), arms straight
const GRIP_X = 0.30;                                  // grip centre off the midline (m): slightly wider than shoulder-width (c1)
const MID_CHEST = 0.72;                               // end: thorax height (H) of the touch, the nipple line (c2)
const BAR_R = 0.014;                                  // bar shaft radius (m), the vendored 28 mm shaft
const RACK_ELBOW = 25;                                // elbow bend when the hands reach the racked bar (deg)
const RACK_H = 1.5;                                   // upright height (m)
const RACK_DEPTH = 1.6;                               // upright to upright, front to back (m): a deep power rack, its foot-side upright clear of the labels
const SAFETY_BELOW = 0.03;                            // safety pin top under the bar's underside at the touch (m) (c6)
const PLATE_D = 0.45;                                 // plate diameter (m)
const MIS_RISE = 0.36;                                // Mistake: the bar drawn this far straight up from the touch (m) (c25)
const OCCIPUT = [0, 0.955, -0.056];                   // back of the skull on the side head outline (head frame, H)
const FOREHEAD = [0, 0.95, 0.06];                     // brow top on the side head outline (head frame, H)

// ---- supine class (copied from the anchor; the bisect throws on a bracket with no root, D-LIB9-CLONE b) ----
export const bisect = (f, lo, hi) => { if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error(`barbell_bench_press: no solution in [${lo}, ${hi}]`); for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
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

const topReach = side => { const s = side === 'l' ? 1 : -1, sh = S[side];
  const d = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(TOP_ELBOW * R));
  return { at: [s * GRIP_X, sh[1] + Math.sqrt(d * d - (GRIP_X - Math.abs(sh[0])) ** 2), sh[2]], pole: [s * 1, -0.2, 0.3] }; };
const onChest = h => { const c = sk0.thorax([0, h, 0.072]); return [0, c[1] + BAR_R, c[2]]; };
const BAR0 = [0, topReach('r').at[1], topReach('r').at[2]];
const BAR1 = onChest(MID_CHEST);
// Bottom (c2): the elbow in the side view straight under the grip (same z), at L1 from the shoulder and L2 from the grip:
// the two circles in the plane z = bar z meet at the elbow; the lateral of the two points is taken (the elbow out to the
// side, below the shoulder). The IK pole aims at it, so the engine's elbow lands there.
export const elbowUnderBar = side => { const s = side === 'l' ? 1 : -1, sh = S[side], G = [s * GRIP_X, BAR1[1], BAR1[2]];
  const dz = G[2] - sh[2], r1 = L1 * L1 - dz * dz, P = [sh[0], sh[1]], Q = [G[0], G[1]], d = Math.hypot(Q[0] - P[0], Q[1] - P[1]);
  const a = (r1 - L2 * L2 + d * d) / (2 * d), hh = r1 - a * a;
  if (!(r1 > 0 && hh >= 0)) throw new Error('barbell_bench_press: no elbow under the bar');
  const m = [P[0] + a * (Q[0] - P[0]) / d, P[1] + a * (Q[1] - P[1]) / d], k = Math.sqrt(hh);
  const c = [[m[0] + k * (Q[1] - P[1]) / d, m[1] - k * (Q[0] - P[0]) / d], [m[0] - k * (Q[1] - P[1]) / d, m[1] + k * (Q[0] - P[0]) / d]];
  const E = c.sort((u, v) => s * (v[0] - u[0]))[0];
  return [E[0], E[1], G[2]]; };
const botReach = side => { const s = side === 'l' ? 1 : -1, E = elbowUnderBar(side), sh = S[side];
  return { at: [s * GRIP_X, BAR1[1], BAR1[2]], pole: E.map((v, i) => v - sh[i]) }; };

const start = { ...base, reach: { l: topReach('l'), r: topReach('r') } };
const end = { ...base, reach: { l: botReach('l'), r: botReach('r') } };

// Mistake (card plate.mistake, c25; key `path`): the bar driven straight up off the chest instead of up and back toward
// the shoulders (c8). The faulty bar is MIS_RISE straight above the touch; the solid Trace keeps the right diagonal.
const BARM = [0, BAR1[1] + MIS_RISE, BAR1[2]];
const misReach = side => { const s = side === 'l' ? 1 : -1, E = elbowUnderBar(side), sh = S[side];
  return { at: [s * GRIP_X, BARM[1], BARM[2]], pole: E.map((v, i) => v - sh[i]) }; };
const mistakePose = { reach: { l: misReach('l'), r: misReach('r') } };
const lmE = landmarksOf(end, H);
export const info = () => { const e = lmE['elbow.r'], sh = S.r, ua = e.map((v, i) => v - sh[i]), ax = [0, 0, -1];
  return { touchFootwardOfShoulderCm: +((BAR1[2] - sh[2]) * 100).toFixed(1), forearmSideTiltDeg: +(Math.atan2(Math.abs(lmE['grip.r'][2] - e[2]), lmE['grip.r'][1] - e[1]) / R).toFixed(2),
    upperArmFromTorsoDeg: +(Math.acos(-(ua[1] * ax[1] + ua[2] * ax[2]) / L1) / R).toFixed(1), misBarOverTouchCm: +((BARM[2] - BAR1[2]) * 100).toFixed(1),
    misBarFootwardOfShoulderCm: +((BARM[2] - sh[2]) * 100).toFixed(1) }; };

// Rack (as close_grip_bench_press): the racked bar over the brow, reachable with the elbows RACK_ELBOW bent; the vendor
// J-hook (7 cm arm, 5 cm lip) on the head-side upright's foot-side face holds it.
const RACK_Z = sk0.head(FOREHEAD)[2];
const reachLen = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(RACK_ELBOW * R));
const RACK_BAR = (() => { const sh = S.r, dz = RACK_Z - sh[2], dx = GRIP_X - Math.abs(sh[0]); return [0, sh[1] + Math.sqrt(reachLen * reachLen - dz * dz - dx * dx), RACK_Z]; })();
const HOOK_Y = RACK_BAR[1] - BAR_R, UPRIGHT_W = 0.076;
const HEAD_UPRIGHT_Z = RACK_Z - UPRIGHT_W / 2 - 0.055;
const HIP_UPRIGHT_Z = HEAD_UPRIGHT_Z + RACK_DEPTH;                  // the second upright, a typical power rack's depth footward
const SAFETY_Y = BAR1[1] - BAR_R - SAFETY_BELOW, PIN_T = 0.05;
const PIN = sideBar([0, SAFETY_Y - PIN_T / 2, HEAD_UPRIGHT_Z], [0, SAFETY_Y - PIN_T / 2, HIP_UPRIGHT_Z], PIN_T, { z: 'back' });
const PIN_PHANTOM = [SAFETY_Y, SAFETY_Y - PIN_T].map(y => ({ type: 'line', cls: 'eq-line m-line', z: 'front', part: 'safety', pts: [[0, y, S.r[2]], [0, y, HIP_UPRIGHT_Z]] }));

const barOf = lm => [0, lm.grips[1], lm.grips[2]];
const START_DOT = Array.from({ length: 17 }, (_, k) => [0, BAR0[1] + 0.025 * Math.sin(k * Math.PI / 8), BAR0[2] + 0.025 * Math.cos(k * Math.PI / 8)]);
const ring = (c, r, n = 16) => Array.from({ length: n + 1 }, (_, k) => [0, c[1] + r * Math.sin(2 * Math.PI * k / n), c[2] + r * Math.cos(2 * Math.PI * k / n)]);

export default {
  id: 'barbell_bench_press', name: 'Barbell Bench Press', view: 'side', facing: 'right',
  camera: { x0: 205, y0: 339 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -1.12, to: 0.80 },
    { type: 'bench', at: [0, BENCH_TOP, BENCH_Z], len: BENCH_LEN },
    { type: 'rackUpright', at: [0, 0, HEAD_UPRIGHT_Z], h: RACK_H, hook: HOOK_Y, z: 'back' },
    { type: 'rackUpright', at: [0, 0, HIP_UPRIGHT_Z], h: RACK_H, z: 'back' },
    PIN,
    (lm, ctx) => (ctx.pose === 'end' && !ctx.mistake ? PIN_PHANTOM : null),
    lm => [{ type: 'barbell', at: barOf(lm), plateD: PLATE_D, plates: [0.045], part: 'plate', z: 'back' },
      { type: 'pulley', at: barOf(lm), r: 0.025, part: 'bar', z: 'front' }],
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: START_DOT, z: 'front', part: 'startbar' } : null),
  ],
  checks: [
    { landmark: 'backUpper', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all', tol: 1 },
    { landmark: 'buttock', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all', tol: 1 },   // hips down (c10)
    { landmark: 'head', above: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all' },
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },          // feet flat (c14)
    { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
  ],
  startParts: ['arm.r', 'arm.l', 'bar'],
  ghosts: { count: 2, parts: ['arm.r', 'bar'] },
  trace: { point: 'grip.r', trim: [12, 12] },
  datum: [{ x: 'elbow.r', from: 'elbow.r', to: { at: 'grip.r', off: [0, -16] }, mistake: false }],   // plumb through the elbow: the forearm is vertical (c2)
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Press', s: 1, move: true }, { phase: 'Hold', s: 1 }],
  callouts: [
    { key: 'hips', text: 'Hips<br>down', anchor: 'buttock', box: { left: 176, top: 160 }, cue: 'Keep your buttocks on the bench for every rep.' },
    { key: 'touch', text: 'Mid-chest<br>touch', anchor: 'grip.r', box: { left: 184, top: 198 }, cue: 'Lower the bar to the middle of your chest, never toward the neck.' },
    { key: 'forearms', text: 'Forearms<br>vertical', anchor: { along: ['elbow.r', 'grip.r'], t: 0.45 }, box: { left: 88, top: 286 }, cue: 'At the bottom your forearms point straight up under the bar.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: [[0, BAR1[1] + 0.03, BAR1[2]], [0, BARM[1] - 0.03, BARM[2]]] },      // the straight-up path
      { kind: 'dashed', pts: ring(BARM, 0.03) },                                                    // the bar driven straight up
      { kind: 'arrow', from: [0, BARM[1] - 0.09, BARM[2]], to: [0, BARM[1] - 0.035, BARM[2]] },
    ],
    tells: [
      { key: 'path', text: 'Straight<br>up', anchor: { at: 'grip.r', pose: 'mistake', off: [0, 30] }, box: { left: 208, top: 206 }, cue: 'You drive the bar straight up off your chest.' },
      { key: 'chest', text: 'Stays over<br>chest', anchor: [0, BARM[1] + 0.03, BARM[2]], box: { left: 184, top: 150 }, cue: 'The bar stays over your chest instead of moving back over your shoulders.' },
    ],
  },
  alt: 'Barbell bench press, side view. Lying on a flat bench in a rack, feet flat and hips down, the lifter lowers the bar from straight arms over the shoulders to the middle of the chest, forearms vertical, then presses it up and back toward the shoulders.',
};
