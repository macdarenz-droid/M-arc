// Single-leg Romanian deadlift (one dumbbell, contralateral), side view, figure facing screen right.
// View: side. The hinge over one leg (trunk and free leg moving as one long line, soft stance knee, flat back, the
// dumbbell hanging under the shoulder) is sagittal. The hip must stay square (no opening of the free hip, a
// rotation about the long axis): the engine has no pelvis yaw/roll, and a side view cannot show it, so that fault
// is not drawable here (census note).
// Form sources (standard technique descriptions; numbers below are named constants for the research card):
//  ACE Exercise Library, single-leg Romanian deadlift: stand on one leg, knee slightly bent; hinge at the hip,
//   the free leg extending behind in line with the torso, back flat, until the torso is about parallel to the
//   floor; hips stay level (square) to the floor.
//  NSCA, Essentials of Strength Training and Conditioning, 4th ed. (Haff & Triplett 2016): single-leg RDL as a
//   unilateral hip-hinge variation, weight in the hand opposite the stance leg. (Book, not re-read online.)
// Geometry decisions (confirmed by the engine report `angles`):
//  Stance leg = the figure's LEFT (far side, drawn lighter), so the free leg (near, right) sweeping back and the
//   dumbbell in the near right hand (opposite the stance leg) are drawn bold. Stance mid-sole at world z = 0,
//   x = 9 cm (under the left hip joint), toes forward.
//  Hinge method (as barbell_back_squat key()): thorax inclination = pelvis tilt + lumbar flexion (spine near
//   neutral). The free leg is IN LINE with the thorax: free hip flexion = -lumbar flexion (the thigh continues
//   the thorax line behind the pelvis), free knee 5 deg, ankle neutral (toes point at the floor).
//  Both arms hang straight down under the shoulders (IK target straight below each shoulder at 99.8% of the arm).
//  Balance (the key physical constraint): for every key pose the root is SOLVED so the whole-body centre of mass
//   (Winter 2009 Table 4.1 segment masses and COM positions: head-neck .081 at the ear, trunk .497 at mid
//   shoulder-hip, upper arm .028/.436, forearm .016/.430, hand .006, thigh .100/.433, shank .0465/.433, foot .0145)
//   plus the dumbbell (DB_MASS x body mass, at the grip) sits exactly over the stance mid-foot (z = 0), and the
//   root height gives the stance knee angle exactly. Verified in a scratch script from the rendered landmarks.
//  Start: standing tall on the stance leg, knee 5 deg soft; free foot just off the floor behind (hip 5 deg
//   extension, knee 45 deg; toe ~4 cm up).
//  End (CARD: trunk angle, stance knee): thorax 85 deg from vertical (about horizontal) = pelvis 80 + lumbar 5;
//   stance knee 18 deg.
//  One via pose (half way) solved the same way, so the traced dumbbell path stays balanced between key poses.
// CARD: END_INCL (trunk ~ parallel), END_KNEE (stance knee), START_KNEE, DB side (opposite the stance leg).
import { landmarksOf } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const STANCE_X = 0.09;                                    // stance mid-sole lateral offset (under the left hip)
const REACH = (0.186 + 0.146 + 0.46 * 0.108) * H * 0.998; // shoulder to grip centre, arm straight (Winter)
const DB_MASS = 0.15;                                     // dumbbell mass as a fraction of body mass (~11 kg at 75 kg)
const START = { incl: 2, spine: 0, knee: 5, freeHip: -5, freeKnee: 45 };
const VIA = { incl: 45, spine: 3, knee: 12, freeHip: -3, freeKnee: 12 };
const END = { incl: 85, spine: 5, knee: 18, freeHip: -5, freeKnee: 5 };   // CARD: incl, knee; freeHip = -spine

const stance = { l: { at: [STANCE_X, 0, 0], toe: [0, 0, 1] } };

// Whole-body centre of mass (Winter 2009 Table 4.1) plus extra point masses [[m, p], ...].
const L3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
function com(lm, extra = []) {
  const parts = [[0.081, lm.ear], [0.497, L3(lm.shoulders, lm.hips, 0.5)], ...extra];
  for (const s of ['l', 'r']) parts.push(
    [0.028, L3(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)], [0.016, L3(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)], [0.006, lm[`grip.${s}`]],
    [0.100, L3(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)], [0.0465, L3(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)], [0.0145, L3(lm[`heel.${s}`], lm[`toe.${s}`], 0.5)]);
  const M = parts.reduce((a, p) => a + p[0], 0);
  return [0, 1, 2].map(i => parts.reduce((a, p) => a + p[0] * p[1][i], 0) / M);
}
const kneeOf = lm => {
  const a = [0, 1, 2].map(i => lm['hip.l'][i] - lm['knee.l'][i]), b = [0, 1, 2].map(i => lm['ankle.l'][i] - lm['knee.l'][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
// Bracketed root finder (Illinois regula falsi): f(a) and f(b) must differ in sign.
const solve = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`single_leg_romanian_deadlift: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 60 && Math.abs(b - a) > 1e-7; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
// Arms hanging straight down: the shoulder landmarks do not depend on the arm angles, so solve them first.
const hang = lm => ({
  l: { at: [lm['shoulder.l'][0], lm['shoulder.l'][1] - REACH, lm['shoulder.l'][2]], pole: [0.2, 0, -1] },
  r: { at: [lm['shoulder.r'][0], lm['shoulder.r'][1] - REACH, lm['shoulder.r'][2]], pole: [-0.2, 0, -1] },
});
function key({ incl, spine, knee, freeHip, freeKnee }) {
  const body = (y, z) => ({ root: { at: [0, y, z], tilt: incl - spine }, trunk: spine, neck: 0,
    hip: { l: 0, r: freeHip }, knee: { l: 0, r: freeKnee }, ankle: { l: 0, r: 0 }, plant: stance });
  const hipY = z => solve(y => kneeOf(landmarksOf(body(y, z), H)) - knee, 0.6, 0.935);
  const full = (y, z) => { const b = body(y, z); return { ...b, reach: hang(landmarksOf(b, H)) }; };
  const comZ = z => { const lm = landmarksOf(full(hipY(z), z), H); return com(lm, [[DB_MASS, lm['grip.r']]])[2]; };
  const z = solve(comZ, -0.5, 0.3);
  return full(hipY(z), z);
}

const start = key(START), via = [key(VIA)], end = key(END);

// Dumbbell in the near right hand, handle across the body (pronated, x axis): the side view shows the hex end-on.
// Start dumbbell dashed (engine workaround as in the squat: the start layer never draws moving equipment).
const HEX_R = 0.119 / 2;
const S0 = landmarksOf(start, H)['grip.r'];
const START_HEX = Array.from({ length: 7 }, (_, k) => [S0[0], S0[1] + HEX_R * Math.sin((k * 60 + 30) * R), S0[2] + HEX_R * Math.cos((k * 60 + 30) * R)]);
const floor = { point: [0, 0, 0], normal: [0, 1, 0] };

export default {
  id: 'single_leg_romanian_deadlift', name: 'Single-Leg Romanian Deadlift', view: 'side', facing: 'right',
  camera: { x0: 205, y0: 339 },                          // reference scale; the long hinge line (free foot to head) centred
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.75, to: 0.75 },
    lm => ({ type: 'dumbbell', at: lm['grip.r'], axis: [1, 0, 0], part: 'db', z: 'front' }),
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: START_HEX, z: 'front', part: 'startdb' } : null),
  ],
  checks: [
    { landmark: 'heel.l', plane: floor, pose: 'all', tol: 0.5 },               // stance foot flat
    { landmark: 'ball.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'toe.r', above: floor, pose: 'all' },                          // free foot off the floor
    { landmark: 'heel.r', above: floor, pose: 'all' },
  ],
  startParts: ['trunk', 'leg.r', 'arm.r'],
  ghosts: { count: 2, parts: ['trunk', 'leg.r', 'arm.r', 'db'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  datum: [{ x: [0, 0, 0], from: 349, to: 60 }],           // plumb line over the stance mid-foot: the balance line
  callouts: [],
  alt: 'Single-leg Romanian deadlift, side view. Standing on the left leg with a soft knee and a dumbbell in the right hand, the lifter hinges until the torso is about parallel to the floor while the right leg extends straight back in line with the torso; the dumbbell hangs under the shoulder and the body stays balanced over the standing foot.',
};
