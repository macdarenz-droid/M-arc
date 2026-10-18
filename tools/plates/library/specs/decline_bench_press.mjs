// Decline Bench Press (barbell, decline bench with its own rack), side view, facing right. H (D-LIB10-DECLINE).
// View: SIDE (card plate.view = census view): the decline angle, the hooked feet and the lower-chest touch point read
// only from the side (c1, c2, c5).
// Clone source (D-LIB9-CLONE): the supine class of dumbbell_bench_press (pilot A, #109 @ e6f39ff; D-LIB8FIX-CARRY),
// copied, never imported. Copied and changed: `supine()` becomes `declined()` (the pad plane is tilted by DECLINE; the
// same trunk, neck and root solve, measured along the tilted pad normal) and its bisect throws when its bracket holds
// no root (D-LIB9-CLONE b); the start reach (arms straight and vertical, grips over the shoulder joints, TOP_ELBOW 4)
// is copied as it is. New: the barbell (as barbell_back_squat draws it: the plate outline behind the body, the sleeve
// dot in front, the start dot dashed in the end pose), the declineBench composer, hooked legs, the lower-chest touch.
// Sources: research card docs/research/howto/cards/decline_bench_press.json (claude/libht-research-lb2 2b6747f8, named
// on #265), claims c1 (feet hooked under the pads at the high end; the rack slightly behind the
// head), c2 (decline, about -15 deg), c3 (overhand grip, slightly wider than shoulder width), c4 (blades together and
// down, chest up), c5 (bar touches the lower chest only), c6 (safety racks at the sides), c7 (rack height reachable
// without fully straightening the arms; the bar held over you on locked arms).
// Geometry decisions:
//  - Declined class: `declined()` solves the root, trunk and neck that put backUpper, buttock and the back of the
//    skull (OCCIPUT) on the pad plane, which falls DECLINE deg toward the head (c2). Checks prove backUpper, buttock
//    (plane, tol 1 cm) and head clearance in every pose.
//  - Legs: hips flexed HIP_FLEX, knees KNEE_FLEX, so the shins hang down and forward from the high end; the rollers
//    sit on the front of the ankles (c1: feet hooked under the pads). A drawn-item test proves each ankle's front on its roller.
//  - Blades together and down (SCAP, c4).
//  - Start (top, c7): arms straight (TOP_ELBOW 4 deg, "arms locked") and vertical, the bar over the shoulder joints.
//  - End (bottom, c5): the bar's underside on the lower chest (thorax height LOW_CHEST H, the chest surface), the grips
//    GRIP_X off the midline (c3: slightly wider than shoulder width); the elbow pole points out and down.
//  - Rack (c1, c7): the racked bar over the brow ("the rack slightly behind you": headward of the start bar over the
//    shoulders); its J-hook at the height where the arms reach the bar with the elbows still RACK_ELBOW deg bent
//    ("without fully extending your arms"). The uprights stand at the bench's sides, so in side view they cross the head.
//  - Safety arm (c6): its top SAFETY_BELOW under the bar's underside at the touch, from the upright to past the touch.
//  - Engine limit (as barbell_back_squat): the start layer never draws moving equipment, so the start sleeve is a
//    dashed dot in the end layer.
//  - Scale: reference 146.29 px/m (same body size as every plate).
// Plate labels (card, 2b6747f8): callouts = plate.checkpoints c1 (Feet hooked), c5 (Lower-chest touch), c4 (Blades
//   together, anchored on the upper back headward of the arm); Mistake = plate.mistake c5 (bar landing high, toward the
//   neck; key `high`), tells `high` and `neck` (c5, c12); tempo = plate.tempo c8 (up 1, down 2, pause 0) plus the ruled
//   bottom constant Pause 1 s (c8 "Pause for a count of one."; D-LIB10-NOTE Q5): Lower 2, Pause 1, Press 1.
// Unsourced numbers (no card claim gives them; 13.3 must-fix 14): PAD_Y (pad top at the hips), HIP_FLEX, KNEE_FLEX,
//   ANKLE, ROLLER_R, the rack over the brow, RACK_ELBOW, SAFETY_BELOW, GRIP_X (a grip "slightly wider than shoulder width" made a number),
//   LOW_CHEST, HIGH_CHEST (the Mistake touch: the top of the sternum), the bench sizes in eq/declineBench.mjs, PLATE_D (a 45 cm plate, as the 8 draw it).
import { landmarksOf, fk, resolve, normPose, WINTER, REF, RADII } from '../engine.mjs';
import { declineBench, declineFace } from '../eq/declineBench.mjs';

const H = 1.75, BODY = { height: H };
const R = Math.PI / 180;
const DECLINE = 15;                                   // pad falls toward the head (deg) (c2)
const PAD_Y = 0.60;                                   // pad top under the buttock (m)
const HIP_FLEX = 30, KNEE_FLEX = 100, ANKLE = -25;   // legs over the high end, shins down to the rollers, feet pointed under them (deg)
const ROLLER_R = 0.055;                               // foot roller radius (m)
const SCAP = { elev: -1, pro: -3 };                   // blades together and down (cm) (c4)
const TOP_ELBOW = 4;                                  // top: elbow flexion (deg), arms locked (c7)
const GRIP_X = 0.30;                                  // grip centre off the midline (m) (c3)
const LOW_CHEST = 0.685;                              // lower chest: thorax height (H) of the touch (c5)
const HIGH_CHEST = 0.80;                              // Mistake: thorax height (H) of the high touch, the top of the sternum (c5, c12)
const BAR_R = 0.014;                                  // bar shaft radius (m): the 28 mm shaft of the vendored barbell
const RACK_ELBOW = 25;                                // elbow bend when the hands reach the racked bar (deg) (c7)
const SAFETY_BELOW = 0.03;                            // safety arm top under the bar's underside at the touch (m) (c6)
const PLATE_D = 0.45;                                 // plate diameter (m)
const OCCIPUT = [0, 0.955, -0.056];                   // back of the skull on the side head outline (head frame, H)
const FOREHEAD = [0, 0.95, 0.06];                     // brow top on the side head outline (head frame, H)

// ---- declined class: root, trunk and neck that put backUpper, buttock and occiput on a pad falling toward the head ----
const bisect = (f, lo, hi) => { if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error(`decline_bench_press: no solution in [${lo}, ${hi}]`); for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
export { bisect };
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
/** Lying on a pad whose face falls `angle` deg toward the head, buttock at world height `y` and z `z`. Returns pose
 * fields { root, trunk, neck } and the pad face { point, normal, along }. */
export function declined(y, z = 0, { angle = DECLINE, height = H } = {}) {
  const body = { height }, tilt = -90 - angle, at0 = { root: { at: [0, 0, 0], tilt } };
  const lm = p => landmarksOf(p, height);
  const occ = p => fk(resolve(normPose(p, body), body).q, body).head(OCCIPUT);
  const n = declineFace({ at: [0, 0, 0], angle }).normal, b0 = lm(at0).buttock;
  const off = q => dot(q.map((v, i) => v - b0[i]), n);                 // height over the pad plane through the buttock
  const trunk = bisect(t => off(lm({ ...at0, trunk: t }).backUpper), -40, 30);
  const neck = bisect(k => off(occ({ ...at0, trunk, neck: k })), -40, 60);
  const root = { at: [0, y - b0[1], z - b0[2]], tilt };
  return { pose: { root, trunk, neck }, face: declineFace({ at: [0, y, z], angle }) };
}

const LYING = declined(PAD_Y, 0);
const F = LYING.face;
const base = { ...LYING.pose, scap: SCAP, hip: HIP_FLEX, knee: KNEE_FLEX, ankle: ANKLE };
const lm0 = landmarksOf(base, H);
const S = { l: lm0['shoulder.l'], r: lm0['shoulder.r'] };
const sk0 = fk(resolve(normPose(base, BODY), BODY).q, BODY);
const L1 = WINTER.upperArm * H, L2 = WINTER.forearm * H + REF.gripOff * H;

// Top (c7): arms straight and vertical, the bar over the shoulder joints (copied from the anchor's topReach).
const TOP_Z = S.r[2];
const topReach = side => { const s = side === 'l' ? 1 : -1, sh = S[side];
  const d = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(TOP_ELBOW * R));
  const dx = s * GRIP_X - sh[0], dz = TOP_Z - sh[2], dy = Math.sqrt(d * d - dx * dx - dz * dz);
  return { at: [s * GRIP_X, sh[1] + dy, sh[2] + dz], pole: [s * 1, -0.2, 0.3] }; };
// Bottom (c5): the bar's underside on the lower chest surface.
const CHEST_LOW = sk0.thorax([0, LOW_CHEST, 0.07]);                    // lower chest surface point, side view
const NB = F.normal;
const BAR1 = [0, CHEST_LOW[1] + NB[1] * BAR_R, CHEST_LOW[2] + NB[2] * BAR_R];
const botReach = side => { const s = side === 'l' ? 1 : -1;
  return { at: [s * GRIP_X, BAR1[1], BAR1[2]], pole: [s * 1, -0.9, 0.25] }; };
const BAR0 = [0, topReach('r').at[1], topReach('r').at[2]];

const start = { ...base, reach: { l: topReach('l'), r: topReach('r') } };
const end = { ...base, reach: { l: botReach('l'), r: botReach('r') } };

// Mistake (card plate.mistake, c5; key `high`): the bar lands high on the chest, toward the neck. Same body, same
// elbow pole; the bar's underside touches the chest at HIGH_CHEST (the top of the sternum) instead of the lower chest.
const CHEST_HIGH = sk0.thorax([0, HIGH_CHEST, 0.07]);
const BARM = [0, CHEST_HIGH[1] + NB[1] * BAR_R, CHEST_HIGH[2] + NB[2] * BAR_R];
const misReach = side => { const s = side === 'l' ? 1 : -1; return { at: [s * GRIP_X, BARM[1], BARM[2]], pole: [s * 1, -0.9, 0.25] }; };
const mistakePose = { reach: { l: misReach('l'), r: misReach('r') } };
const lmMis = landmarksOf({ ...end, ...mistakePose }, H), CHIN = lmMis.chin;
// Ghost forearm for the Mistake (copied from incline_dumbbell_press @ e6f39ff): a capsule with the engine forearm's radii
// from the faulty elbow to the faulty grip, drawn as a closed dashed guide, since the engine masks the faulty outline
// wherever it lies inside the solid body.
const capsule = (a, b, ra, rb, n = 8) => { const u = [b[1] - a[1], b[2] - a[2]], k = Math.hypot(...u), t = [u[0] / k, u[1] / k], nn = [-t[1], t[0]], pts = [];
  const ang0 = Math.atan2(nn[0], nn[1]);
  for (let i = 0; i <= n; i++) { const q = ang0 - Math.PI * i / n; pts.push([0, b[1] + rb * Math.cos(q), b[2] + rb * Math.sin(q)]); }
  for (let i = 0; i <= n; i++) { const q = ang0 + Math.PI - Math.PI * i / n; pts.push([0, a[1] + ra * Math.cos(q), a[2] + ra * Math.sin(q)]); }
  return pts; };
const ghostForearm = (p => [...p, p[0]])(capsule(lmMis['elbow.r'], lmMis['grip.r'], 0.040, 0.026));
const ring = (c, r, n = 16) => Array.from({ length: n + 1 }, (_, k) => [0, c[1] + r * Math.sin(2 * Math.PI * k / n), c[2] + r * Math.cos(2 * Math.PI * k / n)]);
export const mistakeInfo = () => ({ touchMovedHeadwardCm: +((BAR1[2] - BARM[2]) * 100).toFixed(1), barToChinCm: { end: +(Math.hypot(BAR1[1] - CHIN[1], BAR1[2] - CHIN[2]) * 100).toFixed(1), mistake: +(Math.hypot(BARM[1] - CHIN[1], BARM[2] - CHIN[2]) * 100).toFixed(1) } });

// Rack (c1, c7): the racked bar over the brow, behind (headward of) the start bar over the shoulders; J-hook where the
// hands reach the bar with the elbows RACK_ELBOW bent.
const OCC0 = sk0.head(OCCIPUT);
const RACK_Z = sk0.head(FOREHEAD)[2];
const reachLen = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(RACK_ELBOW * R));
const RACK_BAR = (() => { const sh = S.r, dx = -GRIP_X - sh[0], dz = RACK_Z - sh[2]; return [0, sh[1] + Math.sqrt(reachLen * reachLen - dx * dx - dz * dz), RACK_Z]; })();
const HOOK_Y = RACK_BAR[1] - BAR_R;
const SAFETY_Y = BAR1[1] - BAR_R - SAFETY_BELOW;
const SAFETY_END = BAR1[2] + 0.18, SAFETY_T = 0.05;
// The safety arm's span under the touch lies behind the torso and arm, so (hidden-part rule, 13 Q2 (c)) its two edges
// are redrawn as dashed lines over the figure in the end pose, from the shoulder joint to the arm's end.
const SAFETY_PHANTOM = [SAFETY_Y, SAFETY_Y - SAFETY_T].map(y => ({ type: 'line', cls: 'eq-line m-line', z: 'front', part: 'safety', pts: [[0, y, S.r[2]], [0, y, SAFETY_END]] }));
const BLADES = sk0.thorax([0, 0.84, -0.072]);                            // upper back between the blades, headward of the arm
// foot rollers on the front of the ankles (c1)
const ANK = lm0['ankle.r'], KNEE = lm0['knee.r'];
const SHIN = (() => { const d = [0, ANK[1] - KNEE[1], ANK[2] - KNEE[2]], k = Math.hypot(d[1], d[2]); return [0, d[1] / k, d[2] / k]; })();
const FRONT = [0, -SHIN[2], SHIN[1]].map(v => (SHIN[1] < 0 ? -v : v));    // shin normal, toward the front (+z side)
const ANKLE_R = RADII.shank[2] * H;                                      // shin radius at the ankle (m), the engine's leg shape
const HUB = [0, ANK[1] + FRONT[1] * (ANKLE_R + ROLLER_R), ANK[2] + FRONT[2] * (ANKLE_R + ROLLER_R)];
export const info = () => ({ trunk: +LYING.pose.trunk.toFixed(2), neck: +LYING.pose.neck.toFixed(2), bar0: BAR0.map(v => +v.toFixed(3)), bar1: BAR1.map(v => +v.toFixed(3)), rackBar: RACK_BAR.map(v => +v.toFixed(3)), hookY: +HOOK_Y.toFixed(3), safetyY: +SAFETY_Y.toFixed(3), hub: HUB.map(v => +v.toFixed(3)), occiput: OCC0.map(v => +v.toFixed(3)) });

const barOf = lm => [0, lm.grips[1], lm.grips[2]];
const barItem = lm => [
  { type: 'barbell', at: barOf(lm), plateD: PLATE_D, plates: [0.045], part: 'plate', z: 'back' },
  { type: 'pulley', at: barOf(lm), r: 0.025, part: 'bar', z: 'front' },
];
const START_DOT = Array.from({ length: 17 }, (_, k) => [0, BAR0[1] + 0.025 * Math.sin(k * Math.PI / 8), BAR0[2] + 0.025 * Math.cos(k * Math.PI / 8)]);

export default {
  id: 'decline_bench_press', name: 'Decline Bench Press', view: 'side', facing: 'right',
  camera: { x0: 205, y0: 339 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -1.15, to: 0.80 },
    ...declineBench({ at: F.point, angle: DECLINE, rollers: HUB, rollerR: ROLLER_R,
      rack: { z: RACK_Z, h: HOOK_Y + 0.30, hookY: HOOK_Y }, safety: { y: SAFETY_Y, from: RACK_Z, to: SAFETY_END } }),
    (lm, ctx) => (ctx.pose === 'end' && !ctx.mistake ? SAFETY_PHANTOM : null),
    lm => barItem(lm),
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: START_DOT, z: 'front', part: 'startbar' } : null),
  ],
  checks: [
    { landmark: 'backUpper', plane: { point: F.point, normal: F.normal }, pose: 'all', tol: 1 },   // upper back ON the pad
    { landmark: 'buttock', plane: { point: F.point, normal: F.normal }, pose: 'all', tol: 1 },     // buttocks ON the pad
    { landmark: 'head', above: { point: F.point, normal: F.normal }, pose: 'all' },                // head never inside it
  ],
  startParts: ['arm.r', 'arm.l', 'bar'],
  ghosts: { count: 2, parts: ['arm.r', 'bar'] },
  trace: { point: 'grip.r', trim: [12, 12] },
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Pause', s: 1 }, { phase: 'Press', s: 1, move: true }],
  callouts: [
    { key: 'feet', text: 'Feet<br>hooked', anchor: 'ankle.r', cue: 'Lock your feet under the pads at the high end.' },
    { key: 'touch', text: 'Lower-chest<br>touch', anchor: 'grip.r', cue: 'Touch the bar to your lower chest only, never high toward the neck.' },
    { key: 'blades', text: 'Blades<br>together', anchor: BLADES, box: { left: 118, top: 282 }, cue: 'Pull your shoulder blades together and down, chest up.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: ring(BARM, 0.04) },                                                    // the high bar, drawn whole over the chest
      { kind: 'dashed', pts: ghostForearm },                                                         // the forearm under the high bar (ghost)
      { kind: 'arrow', from: { at: 'grip.r', pose: 'end', off: [-6, -6] }, to: { at: 'grip.r', pose: 'mistake', off: [6, -6] } },
      { kind: 'dashed', pts: [[0, BARM[1], BARM[2] - 0.04], [0, CHIN[1], CHIN[2] + 0.01]] },          // the short way left to the chin and neck
    ],
    tells: [
      { key: 'high', text: 'Bar lands<br>high', anchor: [0, BARM[1] + 0.04, BARM[2]], cue: 'The bar touches high on your chest instead of the lower chest.' },
      { key: 'neck', text: 'Near the<br>neck', anchor: { at: 'chin', pose: 'mistake' }, cue: 'The bar comes down close to your neck.' },
    ],
  },
  alt: 'Decline bench press, side view. Lying on a bench that falls toward the head, feet hooked under the pads at the high end, the lifter lowers the bar from locked arms to touch the lower chest, then presses back up. Safety arms sit at the sides.',
};
