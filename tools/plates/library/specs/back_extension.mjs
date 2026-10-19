// Back extension (45-degree Roman chair, bodyweight), side view, figure facing screen right. LIB-13 (LB3, mode H; own
// parent; the support pose class, approved only after one_arm_dumbbell_row, ruling D-LIB13-SUPPORT).
// View: side (card plate.view = census view). The pad at the hip crease, the hinge at the hips, the rounded back (the top
// fault, c6, c19) and the straight line at the top are front-to-back (c1, c5, c6).
// Sources: research card docs/research/howto/cards/back_extension.json (research head 2dd60ae0): callouts =
//  plate.checkpoints (c2/c1 Pad below hips, c6 Hinge at hips, c5 Straight line); Mistake = plate.mistake (c6, c19: the
//  back rounds over the pad instead of the hips hinging); tempo = plate.tempo (c8, c21: up 1, down 2, the 1 s hold at
//  the top, c8).
// Clone source: romanian_deadlift (#109 @ 48d49bb) for the hinge (pelvis tilt + lumbar) and its root finder and hump
//  guide, copied, never imported (D-LIB9-CLONE). Equipment: eq/romanChair.mjs (single use).
// Pose map (DESIGN.md section 9): spec start = the card's plate.end (top: one straight line), spec end = the card's
//  plate.start (bottom, hinged over the pad), because the Mistake (rounding at the bottom) is drawn against the end pose.
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Bench: the 45-degree Roman chair (card equipment text; the "45" is in no quote, so it is drawn and listed unsourced):
//   the legs lie along the bench line, LEG_INCL 45 deg from vertical, knees KNEE 5 deg (slightly bent, c3), the root
//   (hip joints) at ROOT; the hip pad's top face is SOLVED onto the front of the near thigh 18% of the way from the hip
//   to the knee (the top of the thighs, just below the hip bones, c1, c2); the foot plate under the soles and the heel
//   roller behind the ankles (feet secured, c3).
//  Top (c5): shoulders, spine and hips in one straight line in line with the legs: pelvis tilt 45, lumbar 0, hip 5;
//   arms crossed on the chest (c4): both hands on the front of the chest by IK.
//  Bottom (c6, c7): the hinge at the hips with a straight back: the thorax BOTTOM_INCL 100 deg from vertical (the torso
//   "slightly below parallel to the floor", c7), lumbar 0; the legs held on the pad and the foot plate
//   (joint angles: the hip flexes as much as the pelvis tilts past the top, so the legs do not move).
//  Mistake (c6, c19): the back rounds over the pad instead of the hips hinging: the pelvis stays M_TILT, the lumbar
//   spine flexes so the thorax reaches the same depth; a dashed hump guide (romanian_deadlift's method).
// Unsourced numbers: LEG_INCL 45 (the chair's 45 deg), KNEE 5, ROOT, PAD_T 0.18, BOTTOM_INCL 100, the hand spot on the
//  chest, M_TILT 60, HUMP 8 cm; the romanChair sizes (eq/romanChair.mjs header).
import { landmarksOf, RADII } from '../engine.mjs';
import { ROMAN_CHAIR_ITEMS, romanChair } from '../eq/romanChair.mjs';
import { perItem } from '../eq/parts.mjs';

const H = 1.75, R = Math.PI / 180;
const LEG_INCL = 45, KNEE = 5, ROOT = [0, 1.0, 0], PAD_T = 0.18, BOTTOM_INCL = 100;
// Bracketed root finder (Illinois regula falsi): throws when f(a) and f(b) have the same sign (D-LIB9-CLONE b).
export const bisect = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`back_extension: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 60 && Math.abs(b - a) > 1e-7; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
// The top pose by joint angles: the whole body one line at LEG_INCL; its soles fix the foot plate.
const top0 = { root: { at: ROOT, tilt: LEG_INCL }, trunk: 0, neck: 0, hip: KNEE, knee: KNEE, ankle: 0 };
const LT = landmarksOf(top0, H);
const SOLE = side => LT[`sole.${side}`];
// The foot plate lies on the sole line (heel to ball, square to the shin at ankle 0; panel fix D-LIB13-PANEL1): its
// face runs heel -> toe, its normal points from the plate toward the ankle (the soles press on the plate).
const PLATE_U = (() => { const d = [0, LT['ball.r'][1] - LT['heel.r'][1], LT['ball.r'][2] - LT['heel.r'][2]], L = Math.hypot(...d); return d.map(v => v / L); })();
const PLATE_N = (() => { let n = [0, -PLATE_U[2], PLATE_U[1]]; const a = LT['ankle.r']; if ((a[1] - LT['heel.r'][1]) * n[1] + (a[2] - LT['heel.r'][2]) * n[2] < 0) n = n.map(v => -v); return n; })();
// The legs are held by joint angles: the hip flexes as much as the pelvis tilts past the top, so the thighs, shins and
// feet stay on the pad and the foot plate in every pose (no foot IK: the plate is not level).
const legsAt = tilt => ({ hip: KNEE + tilt - LEG_INCL, knee: KNEE, ankle: 0 });
// The pad contact: the front surface of the near thigh at PAD_T of the way from the hip to the knee.
const thighR = t => { const [rA, rM, rB, m] = RADII.thigh; return t < m ? rA + (rM - rA) * Math.sin((t / m) * Math.PI / 2) : rM + (rB - rM) * (1 - Math.cos(((t - m) / (1 - m)) * Math.PI / 2)); };
const PAD = (() => {
  const A = LT['hip.r'], B = LT['knee.r'], d = [0, B[1] - A[1], B[2] - A[2]], L = Math.hypot(...d), u = d.map(v => v / L);
  let n = [0, -u[2], u[1]];
  if (n[2] < 0) n = n.map(v => -v);                                                    // the front of the thigh faces forward
  const p = A.map((v, i) => v + d[i] * PAD_T + n[i] * thighR(PAD_T) * H);
  return { at: [0, p[1], p[2]], along: u.map(v => -v), n };                            // along: toward the head
})();
// H6 contact plane (D-LIB13-FACTS2): the near thigh's axis, thighR(PAD_T) behind the pad face, parallel to the thigh.
// hip.r and knee.r lie on it while the thigh rests on the pad; legs moved off the pad open it.
const THIGH_ON_PAD = { point: PAD.at.map((v, i) => v - PAD.n[i] * thighR(PAD_T) * H), normal: PAD.n };
const HEEL = (() => { const a = LT['ankle.r'], h = LT['heel.r']; const d = [0, h[1] - a[1], h[2] - a[2]]; return [0, a[1] + d[1] * 0.2 - 0.05, a[2] + d[2] * 0.2 - 0.06]; })();
const chestHands = lm => {
  const c = lm.chest, s = lm.sternum, n = (() => { const d = [0, s[1] - lm.backUpper[1], s[2] - lm.backUpper[2]], L = Math.hypot(...d); return d.map(v => v / L); })();
  const at = [0, (c[1] + s[1]) / 2 + n[1] * 0.06, (c[2] + s[2]) / 2 + n[2] * 0.06];
  return { l: { at: [0.06, at[1], at[2]], pole: [1, -0.5, 0] }, r: { at: [-0.06, at[1], at[2]], pole: [-1, -0.5, 0] } };
};
const withArms = p => ({ ...p, reach: chestHands(landmarksOf(p, H)) });
const top = { root: top0.root, trunk: 0, neck: 0, ...legsAt(LEG_INCL) };
const start = withArms(top);
const bottom = { root: { at: ROOT, tilt: BOTTOM_INCL }, trunk: 0, neck: 0, ...legsAt(BOTTOM_INCL) };
const end = withArms(bottom);
const via = [withArms({ root: { at: ROOT, tilt: (LEG_INCL + BOTTOM_INCL) / 2 }, trunk: 0, neck: 0, ...legsAt((LEG_INCL + BOTTOM_INCL) / 2) })];

// Mistake (c6, c19): the pelvis held at M_TILT and the lumbar spine flexed to the same thorax depth.
const M_TILT = 60;
const mist0 = { root: { at: ROOT, tilt: M_TILT }, trunk: BOTTOM_INCL - M_TILT, neck: 0, ...legsAt(M_TILT) };
const mistakePose = { root: mist0.root, trunk: mist0.trunk, hip: mist0.hip, reach: chestHands(landmarksOf(mist0, H)) };
const HUMP = 0.08;
const LM_M = landmarksOf({ ...end, ...mistakePose }, H), LM_E = landmarksOf(end, H);
const HUMP_PTS = (() => {
  const A = LM_M.sacrum, B = LM_M.neck, flat = LM_E.sacrum.map((v, i) => (v + LM_E.backUpper[i]) / 2);
  const d = [0, LM_E.backUpper[1] - LM_E.sacrum[1], LM_E.backUpper[2] - LM_E.sacrum[2]], L = Math.hypot(...d);
  let n = [0, -d[2] / L, d[1] / L];
  if (n[1] < 0) n = n.map(v => -v);
  const P = flat.map((v, i) => v + n[i] * HUMP), C = P.map((v, i) => 2 * v - (A[i] + B[i]) / 2);
  const pts = Array.from({ length: 17 }, (_, k) => { const t = k / 16; return A.map((v, i) => (1 - t) ** 2 * v + 2 * t * (1 - t) * C[i] + t * t * B[i]); });
  return { pts, apex: pts[8], n };
})();
const HUMP_OUT = k => HUMP_PTS.apex.map((v, i) => v + HUMP_PTS.n[i] * k);

export const BX = { pad: { at: PAD.at, along: PAD.along, normal: PAD.n }, plateU: PLATE_U, plateN: PLATE_N, heel: HEEL };
const chair = () => romanChair({ pad: { at: PAD.at, along: PAD.along, normal: PAD.n }, foot: { at: LT['heel.r'], along: PLATE_U, normal: PLATE_N }, heel: HEEL, floorZ: [SOLE('r')[2] - 0.15, PAD.at[2] + 0.1] });
const floor = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  id: 'back_extension', name: 'Back Extension', view: 'side', facing: 'right',
  camera: { x0: 200, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.95, to: 0.75 },
    ...perItem(chair, ROMAN_CHAIR_ITEMS),
  ],
  checks: [
    { landmark: 'sole.r', plane: { point: LT['heel.r'], normal: PLATE_N }, pose: 'all', tol: 0.5 },   // feet on the foot plate (c3)
    { landmark: 'sole.l', plane: { point: LT['heel.r'], normal: PLATE_N }, pose: 'all', tol: 0.5 },
    { landmark: 'heel.r', plane: { point: LT['heel.r'], normal: PLATE_N }, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: { point: LT['heel.r'], normal: PLATE_N }, pose: 'all', tol: 0.5 },
    { landmark: 'hip.r', plane: THIGH_ON_PAD, pose: 'all' },                                          // c1, c3 thighs on the pad (H6 contact fact)
    { landmark: 'knee.r', plane: THIGH_ON_PAD, pose: 'all' },
  ],
  startParts: ['trunk', 'arm.r'],
  ghosts: { count: 2, parts: ['trunk', 'arm.r'] },
  trace: { point: 'shoulderTop.r', trim: [10, 12] },
  callouts: [
    { key: 'pad', text: 'Pad below<br>hips', anchor: PAD.at, box: { left: 56, top: 206 }, cue: 'Set the pad on your upper thighs, below your hip bones.' },
    { key: 'hinge', text: 'Hinge at<br>hips', anchor: 'buttock', box: { left: 70, top: 146 }, cue: 'Bend at the hips with a stiff, straight back.' },
    { key: 'line', text: 'Straight<br>line', anchor: { at: 'backUpper', pose: 'start' }, cue: 'Rise to a straight line from shoulders to hips, with no arch past it.' },
  ],
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Raise', s: 1, move: true }, { phase: 'Hold', s: 1 }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: HUMP_PTS.pts },
      { kind: 'arrow', from: HUMP_OUT(0.12), to: HUMP_OUT(0.015) },
    ],
    tells: [
      { key: 'round', text: 'Back<br>rounds', anchor: { at: 'backMid', pose: 'mistake' }, box: { left: 140, top: 104 }, cue: 'The back rounds over the pad.' },
      { key: 'hips', text: 'Hips stay<br>stiff', anchor: { at: 'buttock', pose: 'mistake' }, box: { left: 70, top: 150 }, cue: 'The hips barely hinge, so the spine bends instead.' },
    ],
  },
  alt: 'Back extension on a 45-degree Roman chair, side view. Thighs on the pad below the hip bones, feet secured and arms crossed, the lifter hinges at the hips with a straight back to slightly below parallel, then rises to one straight line.',
};
