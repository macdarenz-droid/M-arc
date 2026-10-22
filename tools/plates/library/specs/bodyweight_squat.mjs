// Bodyweight squat, side view, figure facing screen right. LIB-14 (LB4, mode H: D-LIB14-MODES; census closest
// barbell_back_squat, the 8; wall_sit's card parent).
// View: side (card plate.view = census view). ACE defines the bottom from the side (shin parallel to torso, b6); the
// heel lift (b4) and the hips-back descent (b3) are sagittal.
// Sources: research card docs/research/howto/cards/bodyweight_squat.json (research head 3812989f): callouts =
//  plate.checkpoints (b3 Hips back, b6 Shin parallel torso, b7 Heels down); Mistake = plate.mistake (b4, drawable).
//  Tempo: none (the card gives no seconds; held under D-LIB14-NOSECS, so the spec carries no tempo).
// Clone source: barbell_back_squat (the 8, main) for the feet and the squat key poses; single_leg_romanian_deadlift
//  (#109 @ ff7c5c4f) for the whole-body balance (Winter 2009 segment masses) and its bracketed root finder; the
//  heel-lift convention from reverse_lunge (#109, :17-22) as pistol_squat uses it; copied, never imported (D-LIB9-CLONE).
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Feet (b1): mid-soles FOOT_X either side (slightly wider than the hips), toes out TOE_OUT ("slightly"), knees
//   tracking the toes (IK pole = toe line), both feet flat at start and end (checks; the contact fact b7).
//  Every key pose: the pelvis tilt and lumbar give the thorax inclination; the root height is SOLVED (bracket) for the
//   pose's depth and the root z (bracket) so the whole-body centre of mass is over mid-foot. Arms: by the sides at the
//   start (b1, plumb), raised forward to level at the bottom (the card lists the arm position in the descent as
//   unsourced; hanging arms put the fists on the floor in front of the shins).
//  Start (b1): standing, knees 5 deg soft, trunk 3 deg forward.
//  End (b4, b6): thighs parallel (the hip joint centre level with the knee centre, SOLVED), the thorax parallel to the
//   shin (b6: the hip-to-shoulder line at the shin's angle from vertical, SOLVED by fixed-point steps), lumbar near
//   neutral (b6 "the low back should appear flat"), heels down.
//  Mistake (b4, heel lift): at the bottom both heels rise HEEL_RISE about the balls of the feet (pitch SOLVED, the toe
//   pads on the floor: pistol_squat's convention) and the root is re-solved so the centre of mass is over the balls
//   (b4 "weight rolling onto the toes"); knees and hips travel forward; thorax and depth as at the bottom.
// Unsourced numbers: FOOT_X 0.13 m, TOE_OUT 10, START (knee 5, trunk 3), SPINE 5 (lumbar share of the inclination),
//  the arms forward and level at the bottom, the datum runs (22 cm past the knee, 16 cm past the shoulder), HEEL_RISE 0.035 m (the onset of a lift, b4 "stop earlier if the heels start to lift": DESIGN.md
//  section 11's 3-4 cm midpoint; never sized to pass PQ-H3).
import { landmarksOf, normPose, resolve } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180, B = { height: H };
const FOOT_X = 0.13, TOE_OUT = 10, SPINE = 5, HEEL_RISE = 0.035;
const toe = s => [s * Math.sin(TOE_OUT * R), 0, Math.cos(TOE_OUT * R)];
// The heel lift (reverse_lunge.mjs:17-22 @ ff7c5c4f, copied as pistol_squat): the rigid foot pitched heel-up about the
// ball, the ball lifted so the toe pad just touches the floor.
const toeLift = a => -Math.min(...[[0.112, -0.036], [0.120, -0.028], [0.100, -0.038]].map(([z, y]) => ((z - 0.080) * -Math.sin(a * R) + (y + 0.039) * Math.cos(a * R)) * H));
const feet = (heelUp = 0) => Object.fromEntries([['l', 1], ['r', -1]].map(([s, k]) => [s, heelUp
  ? { at: [k * FOOT_X, toeLift(heelUp), 0], ref: 'ball', normal: [0, Math.cos(heelUp * R), Math.sin(heelUp * R)], toe: [k * Math.sin(TOE_OUT * R) * Math.cos(heelUp * R), -Math.sin(heelUp * R), Math.cos(TOE_OUT * R) * Math.cos(heelUp * R)] }
  : { at: [k * FOOT_X, 0, 0], toe: toe(k) }]));

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
  if (fa * fb > 0) throw new Error(`bodyweight_squat: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-8; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const kneeR = p => resolve(normPose(p, B), B).q.knee.r;
const body = (y, z, incl, spine, heelUp = 0, arms = 0) => ({ root: { at: [0, y, z], tilt: incl - spine }, trunk: spine, neck: -incl / 2,
  shoulder: { flex: incl + arms }, elbow: 5, plant: feet(heelUp) });
/** A key pose: thorax `incl`, the root height from `depth(y, z)` = 0 (bracket ys), the root z for the centre of mass over comZ. */
function key({ incl, spine = 0, depth, ys, zr = [-0.5, 0.3], heelUp = 0, comZ = 0, arms = 0 }) {
  const yAt = z => solve(y => depth(body(y, z, incl, spine, heelUp, arms)), ...ys);
  const z = solve(z => com(landmarksOf(body(yAt(z), z, incl, spine, heelUp, arms), H))[2] - comZ, ...zr);
  return body(yAt(z), z, incl, spine, heelUp, arms);
}
const kneeAt = k => p => kneeR(p) - k;
const parallel = p => { const l = landmarksOf(p, H); return l['hip.r'][1] - l['knee.r'][1]; };
const shinFromV = l => Math.atan2(l['knee.r'][2] - l['ankle.r'][2], l['knee.r'][1] - l['ankle.r'][1]) / R;
const start = key({ incl: 3, depth: kneeAt(5), ys: [0.80, 0.935] });
// End: thighs parallel and the thorax at the shin's angle from vertical (fixed-point steps on the inclination).
const ZR_END = [-0.45, -0.15];
export const END_INCL = (() => {
  let incl = 40;
  for (let k = 0; k < 40; k++) {
    const next = shinFromV(landmarksOf(key({ incl, spine: SPINE, depth: parallel, ys: [0.3, 0.7], zr: ZR_END, arms: 90 }), H));
    if (Math.abs(next - incl) < 1e-6) return next;
    incl = next;
  }
  throw new Error('bodyweight_squat: the shin-parallel trunk does not settle');
})();
const end = key({ incl: END_INCL, spine: SPINE, depth: parallel, ys: [0.3, 0.7], zr: ZR_END, arms: 90 });
const via = [key({ incl: END_INCL * 0.45, spine: SPINE / 2, depth: kneeAt(55), ys: [0.4, 0.935], arms: 45 })];
// Mistake: both heels rise HEEL_RISE (pitch SOLVED, bracket 2..25 deg), the weight over the balls of the feet, the
// knee angle and thorax as at the bottom.
const END_KNEE = kneeR(end), BALL_Z = landmarksOf(end, H)['ball.r'][2];
const misAt = a => key({ incl: END_INCL, spine: SPINE, depth: kneeAt(END_KNEE), ys: [0.3, 0.7], zr: [-0.3, -0.1], heelUp: a, comZ: BALL_Z, arms: 90 });
export const HEEL_UP = solve(a => landmarksOf(misAt(a), H)['heel.r'][1] - HEEL_RISE, 2, 25);
const MIS = misAt(HEEL_UP);
const mistakePose = { root: MIS.root, plant: MIS.plant };
const LE = landmarksOf(end, H), LM = landmarksOf({ ...end, ...mistakePose }, H);
// b6 datum: the shin line and the torso line (hip to shoulder) of the bottom, each run past its ends.
const run = (a, b, d) => { const u = b.map((v, i) => v - a[i]), L = Math.hypot(...u); return [a.map((v, i) => v - u[i] / L * d), b.map((v, i) => v + u[i] / L * d)]; };
const ext = (a, b, d0, d1) => { const [p, q] = run(a, b, 0), u = q.map((v, i) => v - p[i]), L = Math.hypot(...u); return [p.map((v, i) => v - u[i] / L * d0), q.map((v, i) => v + u[i] / L * d1)]; };
const SHIN_LINE = ext(LE['ankle.r'], LE['knee.r'], 0, 0.22), TORSO_LINE = ext(LE['hip.r'], LE['shoulder.r'], 0, 0.16);
export const bsInfo = { endIncl: END_INCL, shin: shinFromV(LE), heelUp: HEEL_UP, kneeFwdCm: (LM['knee.r'][2] - LE['knee.r'][2]) * 100, hipKneeCm: (LE['hip.r'][1] - LE['knee.r'][1]) * 100 };

const floor = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  id: 'bodyweight_squat', name: 'Bodyweight Squat', view: 'side', facing: 'right',
  camera: { x0: 196, y0: 339 },
  poses: { start, via, end },
  equipment: [{ type: 'floor', from: -0.75, to: 0.75 }],
  checks: [
    { landmark: 'heel.r', plane: floor, pose: 'start', tol: 0.5 },
    { landmark: 'ball.r', plane: floor, pose: 'start', tol: 0.5 },
    { landmark: 'heel.r', plane: floor, pose: 'end', tol: 0.5 },     // b7: heels flat (the contact fact)
    { landmark: 'ball.r', plane: floor, pose: 'end', tol: 0.5 },
    { landmark: 'toe.r', above: floor, pose: 'mistake' },             // heels up, the toes above the floor (the toe pad on it: a drawn-item test)
  ],
  startParts: ['trunk', 'leg.r'],
  ghosts: { count: 2, parts: ['trunk', 'leg.r'] },
  trace: { point: 'hip.r', trim: [8, 10] },
  datum: [{ x: 0, from: 0, to: 0, line: SHIN_LINE, mistake: false }, { x: 0, from: 0, to: 0, line: TORSO_LINE, mistake: false }],
  callouts: [
    { key: 'hips', text: 'Hips back', anchor: 'buttock', box: { left: 40, top: 210 }, cue: 'Start by moving your hips back, then down.' },
    { key: 'shin', text: 'Shin parallel<br>torso', anchor: 'knee.r', box: { left: 244, top: 286 }, cue: 'At the bottom, keep your shins and torso parallel.' },
    { key: 'heels', text: 'Heels down', anchor: 'heel.r', cue: 'Keep your heels flat, down and up.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: [{ at: 'heel.r', pose: 'mistake' }, { at: 'ball.r', pose: 'mistake' }] },
      { kind: 'dashed', pts: [{ at: 'knee.r', pose: 'mistake' }, [0, 0, LM['knee.r'][2]]] },
    ],
    tells: [
      { key: 'heels', text: 'Heels lift', anchor: { at: 'heel.r', pose: 'mistake' }, cue: 'The heels come off the floor at the bottom.' },
      { key: 'toes', text: 'Weight on<br>toes', anchor: { at: 'knee.r', pose: 'mistake' }, cue: 'The weight rolls forward onto the toes.' },
    ],
  },
  alt: 'Bodyweight squat, side view. Standing with the feet slightly wider than the hips and the arms by the sides, the lifter moves the hips back and down until the thighs are about parallel, shins and torso parallel, heels flat.',
};
