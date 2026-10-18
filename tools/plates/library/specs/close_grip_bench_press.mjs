// Close-Grip Bench Press (barbell, flat bench in a rack), side view, facing right. H (D-LIB10-BENCH-H, #265).
// View: SIDE (card plate.view = census view): the elbows by the ribs, the low touch and the hips on the bench read in
// the sagittal plane (c2, c3, c4).
// Clone source (D-LIB9-CLONE): the supine class of dumbbell_bench_press (pilot A, #109 @ e6f39ff; D-LIB8FIX-CARRY),
// copied, never imported: `supine()` with its bisect made to throw when its bracket holds no root (rule b), the flat
// bench at 43 cm, the feet, the scapular set and the straight-arm top over the shoulder joints. New: the barbell (as
// barbell_back_squat draws it), the rack (two vendor rackUprights, the head-side one with its J-hook, and a safety pin
// drawn with parts.mjs sideBar), the close grip and its bottom.
// Sources: research card docs/research/howto/cards/close_grip_bench_press.json (claude/libht-research-lb2 2b6747f8,
// named on #265), claims c1 (hands directly in line with the shoulders, elbows pointed toward the feet), c2 (elbows
// close to the ribs: the Mistake's opposite), c3 (feet push the floor, hips pressed into the bench), c4 (the bar touches
// the chest where the ribs end), c5 (shoulder blades together and down), c9 (tempo, ACSM 1-2 s each way); parent
// barbell_bench_press c6 (J-hooks, safety pins slightly below the bottom) and c8 (bar over the shoulders at the top),
// inherited by the card.
// Geometry decisions:
//  - Supine class (copied): checks prove backUpper and buttock on the pad (plane, tol 1 cm), head clearance and soles
//    on the floor (c3).
//  - Grip (c1): grip centres straight in line with the shoulder joints, GRIP_X = |shoulder.r x| on this body (0.2266 m),
//    read from the engine's landmarks, never a constant.
//  - Start (top, parent c8): arms straight (TOP_ELBOW 4) and vertical, the bar over the shoulder joints.
//  - End (bottom, c4, c2): the bar's underside on the chest surface at RIBS_END (the thorax's lower edge in the body
//    model, 0.66 H, body.mjs:123); the elbow pole points down, toward the feet and only a little out (c1, c2), so the
//    elbow stays by the side of the ribcage. The card gives no forearm rule, so the forearm takes the angle these force.
//  - Rack (parent c6, inherited): the head-side upright puts the racked bar over the brow, where the hands reach it
//    with the elbows still RACK_ELBOW deg bent; its vendor J-hook points the way the figure faces, into the rack. A
//    second upright stands by the hips. The safety pin runs between them, its top SAFETY_BELOW under the bar's
//    underside at the touch, so the bar never touches it in a good rep. The pin's span behind the torso is redrawn
//    dashed in the end pose (hidden-part rule, 13 Q2 (c)).
//  - Engine limit (as barbell_back_squat): the start sleeve is a dashed dot in the end layer.
//  - Scale: reference 146.29 px/m.
// Plate labels (card, 2b6747f8): callouts = plate.checkpoints c2 (Elbows to ribs), c4 (Low-chest touch), c3 (Hips
//   pressed down); Mistake = plate.mistake c2 (elbows drift from the ribs, the bar lands high on the chest, never the
//   neck; key `flare`); tempo = plate.tempo c9 (up 1, down 2, no pause): Lower 2, Press 1 (D-LIB10-NOTE section 9).
// Unsourced numbers (no card claim gives them; 13.3 must-fix 14): BENCH_TOP, BENCH_LEN, BENCH_Z and FOOT_Z (the
//   anchor's), TOP_ELBOW (the anchor's), BOT_POLE (the elbow's aim), RACK_ELBOW 25 and the bar over the brow (as
//   decline_bench_press), HIP_UPRIGHT_Z, RACK_H, SAFETY_BELOW, PLATE_D (45 cm, as the 8), MIS_CHEST and MIS_POLE (the
//   Mistake's touch and elbow aim).
import { landmarksOf, fk, resolve, normPose, WINTER, REF } from '../engine.mjs';
import { sideBar } from '../eq/parts.mjs';

const H = 1.75, BODY = { height: H };
const R = Math.PI / 180;
const BENCH_TOP = 0.43, BENCH_LEN = 1.2, BENCH_Z = -0.40;   // the anchor's flat bench (m)
const FOOT_Z = 0.51;                                  // mid-sole in front of the hip joint (m), the anchor's
const SCAP = { elev: -1, pro: -3 };                   // blades together and down (cm) (c5)
const TOP_ELBOW = 4;                                  // top: elbow flexion (deg), arms straight
const RIBS_END = 0.66;                                // end: thorax height (H) of the touch, where the ribs end (c4)
const BOT_POLE = [0.25, -1, 0.3];                    // end: the elbow's aim (x outward per side): down, by the ribs (c1, c2)                     // end: the elbow's aim (x outward per side): down, footward (c1, c2)                     // end: the elbow's aim (x outward per side): down, footward (c1, c2)                     // end: the elbow's aim (x outward per side): down, footward (c1, c2)
const BAR_R = 0.014;                                  // bar shaft radius (m), the vendored 28 mm shaft
const RACK_ELBOW = 25;                                // elbow bend when the hands reach the racked bar (deg)
const HIP_UPRIGHT_Z = 0.12;                           // the second upright, by the hips (m)
const RACK_H = 1.5;                                   // upright height (m)
const SAFETY_BELOW = 0.03;                            // safety pin top under the bar's underside at the touch (m)
const PLATE_D = 0.45;                                 // plate diameter (m)
const MIS_CHEST = 0.77;                               // Mistake: thorax height (H) of the high touch (c2: high on the chest)
const MIS_POLE = [1, -0.35, 0.15];                    // Mistake: the elbow's aim, out to the side (c2: away from the ribs)
const OCCIPUT = [0, 0.955, -0.056];                   // back of the skull on the side head outline (head frame, H)
const FOREHEAD = [0, 0.95, 0.06];                     // brow top on the side head outline (head frame, H)

// ---- supine class (copied from the anchor; the bisect throws on a bracket with no root, D-LIB9-CLONE b) ----
export const bisect = (f, lo, hi) => { if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error(`close_grip_bench_press: no solution in [${lo}, ${hi}]`); for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
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
export const GRIP_X = Math.abs(S.r[0]);                              // hands in line with the shoulders (c1)

const topReach = side => { const s = side === 'l' ? 1 : -1, sh = S[side];
  const d = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(TOP_ELBOW * R));
  return { at: [s * GRIP_X, sh[1] + d, sh[2]], pole: [s * 1, -0.2, 0.3] }; };
const onChest = h => { const c = sk0.thorax([0, h, 0.072]); return [0, c[1] + BAR_R, c[2]]; };
const BAR0 = [0, topReach('r').at[1], topReach('r').at[2]];
const BAR1 = onChest(RIBS_END);
const reachAt = (bar, pole) => side => { const s = side === 'l' ? 1 : -1; return { at: [s * GRIP_X, bar[1], bar[2]], pole: [s * pole[0], pole[1], pole[2]] }; };
const botReach = reachAt(BAR1, BOT_POLE);

const start = { ...base, reach: { l: topReach('l'), r: topReach('r') } };
const end = { ...base, reach: { l: botReach('l'), r: botReach('r') } };

// Mistake (card plate.mistake, c2; key `flare`): the elbows drift away from the ribs and the bar lands high on the chest
// (MIS_CHEST), never at the neck. Same body; the elbow aims out to the side.
const BARM = onChest(MIS_CHEST);
const misReach = reachAt(BARM, MIS_POLE);
const mistakePose = { reach: { l: misReach('l'), r: misReach('r') } };
const lmE = landmarksOf(end, H), lmM = landmarksOf({ ...end, ...mistakePose }, H);
// Ghost arm for the Mistake (the capsule copied from incline_dumbbell_press @ e6f39ff): upper arm and forearm with the
// engine's radii, as closed dashed guides, since the engine masks the faulty outline inside the solid body.
const capsule = (a, b, ra, rb, n = 8) => { const u = [b[1] - a[1], b[2] - a[2]], k = Math.hypot(...u), t = [u[0] / k, u[1] / k], nn = [-t[1], t[0]], pts = [];
  const ang0 = Math.atan2(nn[0], nn[1]);
  for (let i = 0; i <= n; i++) { const q = ang0 - Math.PI * i / n; pts.push([0, b[1] + rb * Math.cos(q), b[2] + rb * Math.sin(q)]); }
  for (let i = 0; i <= n; i++) { const q = ang0 + Math.PI - Math.PI * i / n; pts.push([0, a[1] + ra * Math.cos(q), a[2] + ra * Math.sin(q)]); }
  return [...pts, pts[0]]; };
const GHOST_UPPER = capsule(lmM['shoulder.r'], lmM['elbow.r'], 0.052, 0.040), GHOST_FORE = capsule(lmM['elbow.r'], lmM['grip.r'], 0.040, 0.026);
export const info = () => ({ gripX: +GRIP_X.toFixed(4), endElbowOutOfShoulderCm: +((Math.abs(lmE['elbow.r'][0]) - GRIP_X) * 100).toFixed(1),
  endElbowFootwardCm: +((lmE['elbow.r'][2] - S.r[2]) * 100).toFixed(1), touchFootwardOfShoulderCm: +((BAR1[2] - S.r[2]) * 100).toFixed(1),
  misElbowOutCm: +((Math.abs(lmM['elbow.r'][0]) - Math.abs(lmE['elbow.r'][0])) * 100).toFixed(1), misTouchHeadwardCm: +((BAR1[2] - BARM[2]) * 100).toFixed(1),
  misBarToChinCm: +(Math.hypot(BARM[1] - lmM.chin[1], BARM[2] - lmM.chin[2]) * 100).toFixed(1) });

// Rack: the racked bar over the brow, reachable with the elbows RACK_ELBOW bent; the vendor J-hook (7 cm arm, 5 cm lip)
// on the head-side upright's foot-side face holds it.
const RACK_Z = sk0.head(FOREHEAD)[2];
const reachLen = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(RACK_ELBOW * R));
const RACK_BAR = (() => { const sh = S.r, dz = RACK_Z - sh[2]; return [0, sh[1] + Math.sqrt(reachLen * reachLen - dz * dz), RACK_Z]; })();
const HOOK_Y = RACK_BAR[1] - BAR_R, UPRIGHT_W = 0.076;
const HEAD_UPRIGHT_Z = RACK_Z - UPRIGHT_W / 2 - 0.055;            // the bar sits in the hook, 5.5 cm out from the face
const SAFETY_Y = BAR1[1] - BAR_R - SAFETY_BELOW, PIN_T = 0.05;
const PIN = sideBar([0, SAFETY_Y - PIN_T / 2, HEAD_UPRIGHT_Z], [0, SAFETY_Y - PIN_T / 2, HIP_UPRIGHT_Z], PIN_T, { z: 'back' });
const PIN_PHANTOM = [SAFETY_Y, SAFETY_Y - PIN_T].map(y => ({ type: 'line', cls: 'eq-line m-line', z: 'front', part: 'safety', pts: [[0, y, S.r[2]], [0, y, HIP_UPRIGHT_Z]] }));
export const rackInfo = () => ({ rackBar: RACK_BAR.map(v => +v.toFixed(3)), hookY: +HOOK_Y.toFixed(3), headUprightZ: +HEAD_UPRIGHT_Z.toFixed(3), safetyY: +SAFETY_Y.toFixed(3) });

const barOf = lm => [0, lm.grips[1], lm.grips[2]];
const START_DOT = Array.from({ length: 17 }, (_, k) => [0, BAR0[1] + 0.025 * Math.sin(k * Math.PI / 8), BAR0[2] + 0.025 * Math.cos(k * Math.PI / 8)]);
const ring = (c, r, n = 16) => Array.from({ length: n + 1 }, (_, k) => [0, c[1] + r * Math.sin(2 * Math.PI * k / n), c[2] + r * Math.cos(2 * Math.PI * k / n)]);

export default {
  id: 'close_grip_bench_press', name: 'Close-Grip Bench Press', view: 'side', facing: 'right',
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
    { landmark: 'buttock', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all', tol: 1 },   // hips pressed down (c3)
    { landmark: 'head', above: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all' },
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },          // feet on the floor (c3)
    { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
  ],
  startParts: ['arm.r', 'arm.l', 'bar'],
  ghosts: { count: 2, parts: ['arm.r', 'bar'] },
  trace: { point: 'grip.r', trim: [12, 12] },
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Press', s: 1, move: true }],
  callouts: [
    { key: 'ribs', text: 'Elbows<br>to ribs', anchor: 'elbow.r', cue: 'Keep your elbows close to your ribs as the bar comes down.' },
    { key: 'touch', text: 'Low-chest<br>touch', anchor: 'grip.r', cue: 'Touch the bar low on your chest, where the ribs end.' },
    { key: 'hips', text: 'Hips<br>pressed down', anchor: 'buttock', cue: 'Push your feet into the floor and keep your hips on the bench.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: ring(BARM, 0.04) },                                                    // the high bar, drawn whole over the chest
      { kind: 'dashed', pts: GHOST_UPPER },                                                          // the flared upper arm (ghost)
      { kind: 'dashed', pts: GHOST_FORE },
      { kind: 'arrow', from: { at: 'grip.r', pose: 'end', off: [-6, -6] }, to: { at: 'grip.r', pose: 'mistake', off: [6, -6] } },
      { kind: 'arrow', from: { at: 'elbow.r', pose: 'end', off: [-4, -4] }, to: { at: 'elbow.r', pose: 'mistake', off: [3, 3] } },   // the elbow leaves the ribs
    ],
    tells: [
      { key: 'flare', text: 'Elbows<br>flare out', anchor: { at: 'elbow.r', pose: 'mistake' }, cue: 'Your elbows drift away from your ribs.' },
      { key: 'high', text: 'Bar<br>high', anchor: [0, BARM[1] + 0.03, BARM[2] - 0.03], box: { left: 38, top: 208 }, cue: 'The bar touches high on your chest instead of low.' },
    ],
  },
  alt: 'Close-grip bench press, side view. Lying on a flat bench in a rack, hands in line with the shoulders, feet flat and hips down, the lifter lowers the bar from straight arms to the low chest where the ribs end, elbows close to the ribs, then presses back up.',
};
