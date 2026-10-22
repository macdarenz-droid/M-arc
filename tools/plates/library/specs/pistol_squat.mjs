// Pistol squat, side view, figure facing screen right. LIB-14 (LB4, mode H; the single-leg pose class,
// single_leg_romanian_deadlift pilot A; the drawable-fault convention, plan 1:85-88, D-LIB14-PISTOL).
// View: side (card plate.view = census view). The free leg held forward (p5), the depth (p3) and the heel lift (p8)
// read from the side; a front view would hide the free leg behind the standing leg.
// Sources: research card docs/research/howto/cards/pistol_squat.json (research head 3812989f): callouts =
//  plate.checkpoints (p1 Arms forward, p5 Free leg straight, p3 Heel down); Mistake = plate.mistake (p8, drawable
//  false: the top fault, bouncing out of the bottom, is seen only as speed; the knee cave needs a front view; the plate
//  draws the next listed fault the side view shows, the standing heel lifting). Tempo: none (the card gives no seconds;
//  held under D-LIB14-NOSECS, so the spec carries no tempo).
// Clone source: single_leg_romanian_deadlift (#109 @ ff7c5c4f) for the single-leg balance solve (Winter 2009 segment
//  masses; the root SOLVED so the centre of mass sits over the stance mid-foot) and its bracketed root finder, copied,
//  never imported (D-LIB9-CLONE).
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Stance leg = the figure's RIGHT (near side, drawn bold), so the standing foot and its heel, the fault, are on top;
//   the free leg (left, far) reaches forward past it. Stance mid-sole at world z = 0, x = -9 cm (under the right hip),
//   toes forward.
//  Every key pose: the root height is SOLVED (bracket) for the stance knee angle and the root z (bracket) so the
//   whole-body centre of mass is over the stance mid-foot. Arms reach forward, level (p1: shoulder flexion 90, elbows
//   straight). Free leg straight (p5: knee 0).
//  Start (p1): standing tall on the right leg, knee 5 soft, trunk 3 forward, the free leg lifted forward (hip 30).
//  End (p2, p3, p5): the standing knee bent END_KNEE (deep: hamstring toward the calf, p3, short of the engine's
//   segment overlap), the stance foot flat (checks), hips back with the trunk END_INCL forward (unsourced: the card
//   lists the torso angle as unsourced), the free leg straight and hovering forward, its heel FREE_CLEAR above the
//   floor (the free hip flexion SOLVED, bracket; checks).
//  Mistake (p8, heel lift): at the bottom the standing heel rises HEEL_UP deg about the ball of the foot (plant ref
//   'ball', sole plane pitched); hips, trunk, arms and free leg as at the bottom, so the knee travels forward over the
//   toes.
// Unsourced numbers: STANCE_X 0.09, START (knee 5, trunk 3, free hip 30), END_KNEE 140, END_INCL 40, FREE_CLEAR
//  0.05 m, VIA (knee 75, trunk 20), HEEL_UP 25 (the Mistake magnitude, illustrative), arms level.
import { landmarksOf, normPose, resolve } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180, B = { height: H };
const STANCE_X = 0.09, END_KNEE = 140, END_INCL = 40, FREE_CLEAR = 0.05, HEEL_UP = 25;
const stance = (heelUp = 0) => ({ r: heelUp
  ? { at: [-STANCE_X, 0, 0], ref: 'ball', normal: [0, Math.cos(heelUp * R), Math.sin(heelUp * R)], toe: [0, -Math.sin(heelUp * R), Math.cos(heelUp * R)] }
  : { at: [-STANCE_X, 0, 0], toe: [0, 0, 1] } });

// Whole-body centre of mass (Winter 2009 Table 4.1; copied from single_leg_romanian_deadlift).
const L3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
function com(lm) {
  const parts = [[0.081, lm.ear], [0.497, L3(lm.shoulders, lm.hips, 0.5)]];
  for (const s of ['l', 'r']) parts.push(
    [0.028, L3(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)], [0.016, L3(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)], [0.006, lm[`grip.${s}`]],
    [0.100, L3(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)], [0.0465, L3(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)], [0.0145, L3(lm[`heel.${s}`], lm[`toe.${s}`], 0.5)]);
  const M = parts.reduce((a, p) => a + p[0], 0);
  return [0, 1, 2].map(i => parts.reduce((a, p) => a + p[0] * p[1][i], 0) / M);
}
// Bracketed root finder (Illinois regula falsi, copied): throws when f(a) and f(b) have the same sign (D-LIB9-CLONE).
export const solve = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`pistol_squat: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-8; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const kneeR = p => resolve(normPose(p, B), B).q.knee.r;
function key({ incl, knee, freeHip, zr = [-0.6, 0.4], heelUp = 0, comZ = 0 }) {
  const body = (y, z) => ({ root: { at: [0, y, z], tilt: incl }, trunk: 0, neck: -incl / 2,
    hip: { l: freeHip, r: 0 }, knee: { l: 0, r: 0 }, ankle: { l: 10, r: 0 }, shoulder: { flex: 90 + incl }, elbow: 0, plant: stance(heelUp) });
  const hipY = z => solve(y => kneeR(body(y, z)) - knee, 0.2, 0.935);
  const z = solve(z => com(landmarksOf(body(hipY(z), z), H))[2] - comZ, ...zr);
  return body(hipY(z), z);
}
// The root z bracket at the bottom: the hip must stay within the bent leg's reach of the ankle.
const END_ZR = [-0.335, 0.05];
const start = key({ incl: 3, knee: 5, freeHip: 30 });
const via = [key({ incl: 20, knee: 75, freeHip: 55 })];
// End: the free hip flexion SOLVED (bracket 60..130 deg) so the free heel hovers FREE_CLEAR above the floor (p5).
export const FREE_HIP = solve(fh => landmarksOf(key({ incl: END_INCL, knee: END_KNEE, freeHip: fh, zr: END_ZR }), H)['heel.l'][1] - FREE_CLEAR, 60, 130);
const end = key({ incl: END_INCL, knee: END_KNEE, freeHip: FREE_HIP, zr: END_ZR });
// Mistake: the heel rises HEEL_UP about the ball; the knee stays END_KNEE and the root is re-solved so the centre of
// mass sits over the ball of the foot (the weight rolls forward onto the toes), so hips and knee travel forward.
const BALL_Z = landmarksOf(end, H)['ball.r'][2];
const MIS = key({ incl: END_INCL, knee: END_KNEE, freeHip: FREE_HIP, zr: [-0.2, 0.15], heelUp: HEEL_UP, comZ: BALL_Z });
const mistakePose = { root: MIS.root, plant: MIS.plant };
const LE = landmarksOf(end, H), LM = landmarksOf({ ...end, ...mistakePose }, H);
const KNEE_M = LM['knee.r'];
export const psInfo = { freeHip: FREE_HIP, end: end.root, heelUpCm: (LM['heel.r'][1] - LE['heel.r'][1]) * 100, kneeFwdCm: (LM['knee.r'][2] - LE['knee.r'][2]) * 100, kneePastToeCm: (LM['knee.r'][2] - LM['toe.r'][2]) * 100, freeHeel: LE['heel.l'][1] };

const floor = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  id: 'pistol_squat', name: 'Pistol Squat', view: 'side', facing: 'right',
  camera: { x0: 170, y0: 339 },
  poses: { start, via, end },
  equipment: [{ type: 'floor', from: -0.75, to: 1.0 }],
  checks: [
    { landmark: 'heel.r', plane: floor, pose: 'start', tol: 0.5 },   // standing foot flat (p3)
    { landmark: 'ball.r', plane: floor, pose: 'start', tol: 0.5 },
    { landmark: 'heel.r', plane: floor, pose: 'end', tol: 0.5 },
    { landmark: 'ball.r', plane: floor, pose: 'end', tol: 0.5 },
    { landmark: 'ball.r', plane: floor, pose: 'mistake', tol: 0.5 },  // the Mistake: on the ball, heel up
    { landmark: 'heel.l', above: floor, pose: 'all' },                // free leg off the floor (p2)
    { landmark: 'toe.l', above: floor, pose: 'all' },
  ],
  startParts: ['trunk', 'leg.r', 'leg.l'],
  ghosts: { count: 2, parts: ['trunk', 'leg.r', 'leg.l'] },
  trace: { point: 'hip.r', trim: [8, 10] },
  callouts: [
    { key: 'arms', text: 'Arms forward', anchor: 'grip.r', cue: 'Reach your arms forward for balance.' },
    { key: 'leg', text: 'Free leg<br>straight', anchor: 'knee.l', cue: 'Hold the free leg out in front, knee straight.' },
    { key: 'heel', text: 'Heel down', anchor: 'heel.r', cue: 'Keep the whole standing foot flat on the floor.' },
  ],
  mistake: {
    pose: mistakePose,
    // Dashed guides only (drawn over the solid figure, never hidden): the lifted sole, heel to ball, and a plumb from
    // the faulty knee to the floor, which lands past the toes.
    guides: [
      { kind: 'dashed', pts: [{ at: 'heel.r', pose: 'mistake' }, { at: 'ball.r', pose: 'mistake' }] },
      { kind: 'dashed', pts: [{ at: 'knee.r', pose: 'mistake' }, [0, 0, KNEE_M[2]]] },
    ],
    tells: [
      { key: 'heel', text: 'Heel lifts', anchor: { at: 'heel.r', pose: 'mistake' }, cue: 'The standing heel comes off the floor at the bottom.' },
      { key: 'knee', text: 'Knee shoots<br>forward', anchor: { at: 'knee.r', pose: 'mistake' }, cue: 'The knee drives forward as the weight rolls onto the toes.' },
    ],
  },
  pilot: { drawableFault: 'Top fault: bouncing out of the bottom (p8), seen only as speed; the knee cave needs a front view; the plate draws the next listed fault, the standing heel lifting (p8).' },
  alt: 'Pistol squat, side view. Standing on one leg with the arms reaching forward and the other leg lifted in front, the lifter sits the hips back and bends the standing knee fully, the standing foot flat and the free leg straight and hovering forward.',
};
