// High knees, side view, figure facing screen right. LIB-22 (LB10, H; cycle: one half-cycle; tempo c8).
// View: side (card plate.view = census): the thigh height (c2, c3), the tall chest (c1) and the back arching as the
//  knee goes too high (c5) are sagittal.
// Sources: research card docs/research/howto/cards/high_knees.json (research head 596dbe07): c1 stand tall, arms at
//  the sides, chest open, eyes ahead; c2 the right knee toward the chest, slightly above waist level, the left hand up
//  in a pumping motion (ACE "pumping your arms"); c3 the upper leg to at least 90 degrees of flexion; c4 feet
//  hip-width, soft knees, shifting toward the balls of the feet, springing between the ball of each foot; c5 the knee
//  so high the back arches (the Mistake); c8 30 s of work, 30 s of rest.
// Clone (D-LIB22-CLONE): hanging_leg_raise (the 8: the knee drive and the Mistake arch, :69), reverse_lunge (#109 @
//  dcac4a38: the rigid foot on its ball, FOOT_X, ELBOW); box_jump's airborne frame is not needed: the stance foot stays
//  down (D-LIB22-AIRBORNE, c4). Copied, never imported.
// Sides (D-LIB22-SIDES): c2 and c3 name the right knee and the left hand; the right leg is the near side.
// Geometry (confirmed by the report's contacts and checks, and by tests on the drawn items):
//  Start (c1, c4): both feet flat, hip-width (FOOT_X), knees KNEE_SOFT; trunk upright (tilt 0, spine and neck 0); the
//   arms at the sides (ELBOW soft); the root's z solved so the centre of mass sits over the balls of the feet (c4
//   "shift towards the balls of your feet").
//  End (c2-c5): the stance (left, far) foot on its ball, heel-up HEEL_UP (reverse_lunge's rigid foot, lifted until the
//   toe pad touches), its knee KNEE_SOFT; the right thigh raised so the knee joint sits at waist (navel) height, its
//   kneecap top then slightly above it (solved: END_HIP), the shank hanging plumb (knee flexion = the thigh's angle);
//   the trunk upright (c5); the left arm pumped forward and the right arm back, both elbows ARM_ELBOW, the left grip at
//   the shoulder's height (solved: ARM_FLEX), the right upper arm mirrored back. The root's z solved so the centre of
//   mass sits over the stance ball (c4), the root's y from the stance knee's bend.
//  Mistake (c5): the pelvis tilts back M_TILT and the low back arches M_ARCH (hanging_leg_raise.mjs:69's approved
//   arch); the hip keeps its flexion on the pelvis, so the knee rises with it ("knees getting so high"); the root's z
//   re-solved so the body stays over the stance ball (a counter-move, no label).
// Unsourced numbers (SIZES; lb10/sizes.json holds each with its basis): FOOT_X, KNEE_SOFT, HEEL_UP, ELBOW, ARM_ELBOW,
//  M_TILT, M_ARCH; solved: END_HIP, ARM_FLEX, START_Z, END_Z, M_Z.
import { landmarksOf, RADII } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ FOOT_X: 0.10, KNEE_SOFT: 15, HEEL_UP: 15, ELBOW: 4, ARM_ELBOW: 90, M_TILT: -14, M_ARCH: -12 });
const { FOOT_X, KNEE_SOFT, HEEL_UP, ELBOW, ARM_ELBOW, M_TILT, M_ARCH } = SIZES;
export const bisect = (f, a, b, what) => {
  let fa = f(a), fb = f(b), side = 0;
  if (!(fa * fb <= 0)) throw new Error(`high_knees: no root for ${what} in [${a}, ${b}] (${fa}, ${fb})`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-8; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
/** Winter (2009) whole-body centre of mass (single_leg_romanian_deadlift.mjs:19-36 @ dcac4a38). */
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
const kneeOf = (lm, s) => {
  const a = [0, 1, 2].map(i => lm[`hip.${s}`][i] - lm[`knee.${s}`][i]), b = [0, 1, 2].map(i => lm[`ankle.${s}`][i] - lm[`knee.${s}`][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
// The rigid foot on its ball, heel-up (reverse_lunge.mjs:59-61 @ dcac4a38): lifted so the toe pad just touches the floor.
const sT = Math.sin(HEEL_UP * R), cT = Math.cos(HEEL_UP * R);
const LIFT = -Math.min(...[[0.112, -0.036], [0.120, -0.028], [0.100, -0.038]].map(([z, y]) => ((z - 0.080) * -sT + (y + 0.039) * cT) * H));
const BALL_Z = 0;                                    // the stance ball's place on the floor (world z 0)
const flat = x => ({ at: [x, 0, BALL_Z], normal: [0, 1, 0], toe: [0, 0, 1], ref: 'ball' });   // explicit, so the engine blends to the end's heel-up
const onBall = x => ({ at: [x, LIFT, BALL_Z], normal: [0, cT, sT], toe: [0, -sT, cT], ref: 'ball' });
const arms0 = { shoulder: 0, elbow: ELBOW };          // c1: the arms at the sides
// Start (c1, c4): both feet flat on the floor, knees KNEE_SOFT, the root's z solved over the balls of the feet.
const standAt = (y, z) => ({ root: { at: [0, y, z], tilt: 0 }, trunk: 0, neck: 0, ...arms0, plant: { l: flat(FOOT_X), r: flat(-FOOT_X) } });
const yFor = (z, f) => bisect(y => kneeOf(landmarksOf(f(y, z), H), 'l') - KNEE_SOFT, 0.70, 0.95, 'the soft knee');
export const START_Z = bisect(z => com(landmarksOf(standAt(yFor(z, standAt), z), H))[2] - BALL_Z, -0.25, 0.1, 'the start balance');
const start = standAt(yFor(START_Z, standAt), START_Z);
// End: the thigh's angle (hip flexion on the upright pelvis) puts the knee joint at the navel's height (c2 "slightly
// above waist level": the kneecap's top, RADII.kneeCap above the joint, is then above the waist).
const legUp = th => ({ hip: { r: th }, knee: { r: th }, ankle: { r: 0 } });   // the shank hangs plumb
const armsUp = phi => ({ shoulder: { l: { flex: phi }, r: { ext: phi } }, elbow: { l: ARM_ELBOW, r: ARM_ELBOW } });
const endAt = (y, z, th, phi, tilt = 0, trunk = 0) => ({ root: { at: [0, y, z], tilt }, trunk, neck: 0, ...legUp(th), ...armsUp(phi), plant: { l: onBall(FOOT_X), r: null } });
const solveEnd = (tilt, trunk, th0) => {
  // fixed point: y from the stance knee, th from the knee height, phi from the grip height, z from the balance
  let y = start.root.at[1], z = START_Z, th = th0 ?? 100, phi = 45;
  for (let i = 0; i < 6; i++) {
    y = bisect(yy => kneeOf(landmarksOf(endAt(yy, z, th, phi, tilt, trunk), H), 'l') - KNEE_SOFT, 0.70, 1.0, 'the stance knee');
    if (th0 == null) th = bisect(t => { const L = landmarksOf(endAt(y, z, t, phi), H); return L['knee.r'][1] - L.navel[1]; }, 70, 140, 'the knee height');
    phi = bisect(p => { const L = landmarksOf(endAt(y, z, th, p, tilt, trunk), H); return L['grip.l'][1] - L['shoulder.l'][1]; }, 0, 120, 'the grip height');
    z = bisect(zz => com(landmarksOf(endAt(y, zz, th, phi, tilt, trunk), H))[2] - BALL_Z, -0.3, 0.2, 'the balance');
  }
  return { y, z, th, phi };
};
const E = solveEnd(0, 0);
export const END_HIP = E.th, ARM_FLEX = E.phi, END_Z = E.z;
const end = endAt(E.y, E.z, E.th, E.phi);
// Mistake (c5): the pelvis back M_TILT, the low back arched M_ARCH; the hip keeps END_HIP on the pelvis, so the knee rises.
const Mi = solveEnd(M_TILT, M_ARCH, END_HIP);
export const M_Z = Mi.z;
const mistake = { root: { at: [0, Mi.y, Mi.z], tilt: M_TILT }, trunk: M_ARCH, shoulder: armsUp(Mi.phi).shoulder };
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  id: 'high_knees', name: 'High Knees', view: 'side', facing: 'right',
  camera: { x0: 190, y0: 339 },
  poses: { start, end },
  equipment: [{ type: 'floor', from: -0.7, to: 0.9 }],
  checks: [
    ...['heel.l', 'heel.r', 'ball.l', 'ball.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'start', tol: 0.5 })),   // c4: both feet down at the start
    { landmark: 'ball.l', plane: FLOOR, pose: 'end', tol: 1 },                                                              // c4 fact: the stance foot on its ball
    { landmark: 'heel.l', above: { point: [0, 0.03, 0], normal: [0, 1, 0] }, pose: 'end', tol: 0 },                       // c4: on the ball, heel up
    { landmark: 'knee.r', above: { point: [0, landmarksOf(end, H)['hip.r'][1], 0], normal: [0, 1, 0] }, pose: 'end', tol: 0 },   // c3: at least 90 deg (the knee above the hip joint)
    { landmark: 'knee.r', plane: { point: [0, landmarksOf(end, H).navel[1], 0], normal: [0, 1, 0] }, pose: 'end', tol: 1 },   // c2: the knee at waist level
  ],
  ghosts: { count: 1, parts: ['leg.r', 'arm.l'] },
  tempo: [{ phase: 'Work', s: 30, move: true }, { phase: 'Rest', s: 30 }],
  trace: { point: 'knee.r', trim: [10, 12] },
  callouts: [
    { key: 'chest', text: 'Chest tall', anchor: 'start:sternum', cue: 'Stand tall, eyes ahead, core braced.' },
    { key: 'thigh', text: 'Thigh to hip', anchor: 'knee.r', cue: 'Knee up to hip height or a little above, opposite arm pumping.' },
    { key: 'balls', text: 'Balls of feet', anchor: { at: 'ball.l', off: [0, -8] }, box: { left: 250, top: 300 }, cue: 'Soft knees, springing from the ball of one foot to the other.' },
  ],
  mistake: {
    pose: mistake,
    guides: [{ kind: 'arrow', from: { at: 'head', pose: 'end', off: [0, -9] }, to: { at: 'head', pose: 'mistake', off: [0, -9] } }],
    tells: [
      { key: 'arch', text: 'Back arches', anchor: { at: 'backUpper', pose: 'mistake' }, box: { left: 40, top: 132 }, cue: 'The lower back arches and the trunk tips back.' },
      { key: 'high', text: 'Knee<br>too high', anchor: { at: 'knee.r', pose: 'mistake', off: [0, -8] }, box: { left: 264, top: 120 }, cue: 'The knee is driven so high that the back gives way.' },
    ],
  },
  alt: 'High knees, side view. Standing tall on the balls of the feet, the right knee drives up to waist height while the left arm pumps forward. The trunk stays upright.',
};
export const info = { pose: Object.fromEntries([['start', start], ['end', end], ['mistake', { ...end, ...mistake }]].map(([k, p]) => { const lm = landmarksOf(p, H); return [k, { com: +com(lm)[2].toFixed(3), heel: +lm['heel.l'][2].toFixed(3), ball: +lm['ball.l'][2].toFixed(3), toe: +lm['toe.l'][2].toFixed(3), kneeR: lm['knee.r'].map(v => +v.toFixed(3)) }]; })), END_HIP, ARM_FLEX, KNEE_CAP: RADII.kneeCap * H };
