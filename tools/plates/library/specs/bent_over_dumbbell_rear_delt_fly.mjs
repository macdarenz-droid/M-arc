// Bent-over dumbbell rear delt fly, SIDE view (figure facing screen right). Recommended view; the front view is
// bent_over_dumbbell_rear_delt_fly__alt.mjs (same poses) and is a NO-GO with this engine.
// View decision (go/no-go): the census asks for the front view, because the exercise is an arm sweep across the
// body (horizontal abduction). Rendered both ways:
//  - Front view, trunk 80 deg (the textbook pose): the engine draws a flexed trunk as a foreshortened FRONTAL
//    outline (SPEC 8), so the torso collapses to a thin band at shoulder height, the head all but disappears and
//    the legs are drawn over it: a pair of legs with arms growing from the shoulders. Not readable.
//  - Front view with the trunk raised to 45 deg (tried in scratch only): the figure reads as a person standing
//    upright doing a lateral raise, which teaches the wrong exercise. Not acceptable either.
//  - Side view (this file): the hinge a coach checks (thorax 80 deg, soft knees, hips back, flat back, balance
//    over mid-foot) is true and clear, and the dumbbells visibly rise from under the shoulders to shoulder height.
//    Limit: the sweep out to the sides points at the camera, so the raised near arm is foreshortened to a short
//    stub beside the shoulder. The callouts/card text must carry "out to the sides".
// Form sources (standard technique descriptions; numbers below are named constants for the research card):
//  ACE Exercise Library, bent-over reverse fly: hinge at the hips with a flat back until the torso is nearly
//   parallel to the floor, knees slightly bent; arms hang under the chest, elbows slightly bent and fixed; raise
//   the arms out to the sides until they are level with the shoulders, squeezing the shoulder blades; lower slowly.
//  NSCA, Essentials of Strength Training and Conditioning, 4th ed. (Haff & Triplett 2016): bent-over lateral raise
//   / reverse fly, torso flexed near parallel, neutral spine, elbows slightly flexed. (Book, not re-read online.)
// Geometry decisions (confirmed by the engine report `angles`):
//  Held hinge (as barbell_row): thorax inclination = pelvis tilt + lumbar flexion; the same root and legs at start
//   and end; only the arms, shoulder blades and dumbbells move (startParts and ghosts: arms and dumbbells).
//  Balance: the root is SOLVED so the whole-body centre of mass (Winter 2009 Table 4.1 segment masses, as
//   single_leg_romanian_deadlift) plus both dumbbells sits over mid-foot (z = 0) in the start pose, and the root
//   height gives the knee angle. With the arms raised the COM moves 0.3 cm (arms move sideways, not fore-aft).
//  Trunk (CARD): thorax 80 deg from vertical (10 deg short of parallel) = pelvis 75 + lumbar 5; knees 20 deg
//   (CARD); feet hip width (mid-soles 22 cm apart), toes forward; neck in line with the thorax.
//  Arms: elbows held ~20 deg bent (grip 1.5% closer to the shoulder than a straight arm), elbows bowing out
//   (IK pole lateral at the start, up at the top). Start: hands hanging under the shoulders, 4 cm inside them.
//   End: hands level with the shoulders straight out to the sides (upper arms ~90 deg from the trunk, CARD),
//   shoulder blades squeezed 3 cm. Two via poses on the arc (30 and 60 deg) so the ghosts and trace follow the
//   circular sweep instead of a chord.
//  Dumbbells: neutral grip (palms facing), handle pointing along the trunk toward the head (world +z): the side
//   view shows the dumbbell in profile, the front view (alt) the hex heads end-on.
// CARD: INCL (trunk angle), KNEE, top arm height (level with the shoulders), ELBOW bend, dumbbell mass share.
import { landmarksOf } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.11;                                     // mid-sole lateral offset (hip width)
const INCL = 80, SPINE = 5, KNEE = 20;                   // CARD
const ELBOW = 20;                                        // CARD: held elbow bend (deg)
const L1 = 0.186 * H, L2 = (0.146 + 0.46 * 0.108) * H;   // upper arm; forearm + grip offset (Winter)
const REACH = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(ELBOW * R));   // shoulder to grip at that bend
const IN = 0.04;                                         // start: hands 4 cm inside the shoulders
const PRO_START = 1, PRO_END = -3;                       // shoulder blades (cm)
const DB_MASS = 0.05;                                    // each dumbbell, fraction of body mass (~4 kg at 75 kg)

const feet = { l: { at: [FOOT_X, 0, 0], toe: [0, 0, 1] }, r: { at: [-FOOT_X, 0, 0], toe: [0, 0, 1] } };
const L3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
function com(lm, extra = []) {                           // Winter (2009) Table 4.1
  const parts = [[0.081, lm.ear], [0.497, L3(lm.shoulders, lm.hips, 0.5)], ...extra];
  for (const s of ['l', 'r']) parts.push(
    [0.028, L3(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)], [0.016, L3(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)], [0.006, lm[`grip.${s}`]],
    [0.100, L3(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)], [0.0465, L3(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)], [0.0145, L3(lm[`heel.${s}`], lm[`toe.${s}`], 0.5)]);
  const M = parts.reduce((a, p) => a + p[0], 0);
  return [0, 1, 2].map(i => parts.reduce((a, p) => a + p[0] * p[1][i], 0) / M);
}
const kneeOf = lm => {
  const a = [0, 1, 2].map(i => lm['hip.r'][i] - lm['knee.r'][i]), b = [0, 1, 2].map(i => lm['ankle.r'][i] - lm['knee.r'][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
const solve = (f, a, b) => {                             // bracketed root finder (Illinois regula falsi)
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`bent_over_dumbbell_rear_delt_fly: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 60 && Math.abs(b - a) > 1e-7; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};

const body = (y, z, pro) => ({ root: { at: [0, y, z], tilt: INCL - SPINE }, trunk: SPINE, neck: 0, scap: { pro }, plant: feet });
// Hand on the sweep arc at angle a (0 = hanging, 90 = straight out), in the vertical plane through the shoulder.
const hands = (lm, a) => {
  const out = {};
  for (const [s, sg] of [['l', 1], ['r', -1]]) {
    const S = lm[`shoulder.${s}`], u = Math.sin(a * R), d = Math.cos(a * R);
    out[s] = { at: [S[0] + sg * (REACH * u - IN * d), S[1] - REACH * d, S[2]], pole: [sg * d, u, 0] };
  }
  return out;
};
const pose = (y, z, a) => { const pro = PRO_START + (PRO_END - PRO_START) * a / 90, b = body(y, z, pro); return { ...b, reach: hands(landmarksOf(b, H), a) }; };
const hipY = z => solve(y => kneeOf(landmarksOf(body(y, z, PRO_START), H)) - KNEE, 0.5, 0.935);
const dbs = lm => [[DB_MASS, lm['grip.l']], [DB_MASS, lm['grip.r']]];
const ROOT_Z = solve(z => { const lm = landmarksOf(pose(hipY(z), z, 0), H); return com(lm, dbs(lm))[2]; }, -0.5, 0.2);
const ROOT_Y = hipY(ROOT_Z);

const start = pose(ROOT_Y, ROOT_Z, 0);
const via = [pose(ROOT_Y, ROOT_Z, 30), pose(ROOT_Y, ROOT_Z, 60)];
const end = pose(ROOT_Y, ROOT_Z, 90);

const G0 = landmarksOf(start, H)['grip.r'], HZ = 0.135, HY = 0.119 * 0.866 / 2;
const HH = 0.065, HR = 0.008;                          // handle half-length, half-thickness (m)
const START_DB = [[-HZ, -HY], [-HH, -HY], [-HH, -HR], [HH, -HR], [HH, -HY], [HZ, -HY], [HZ, HY], [HH, HY], [HH, HR], [-HH, HR], [-HH, HY], [-HZ, HY], [-HZ, -HY]].map(([dz, dy]) => [G0[0], G0[1] + dy, G0[2] + dz]);
const floor = { point: [0, 0, 0], normal: [0, 1, 0] };

export default {
  id: 'bent_over_dumbbell_rear_delt_fly', name: 'Bent-Over Dumbbell Rear Delt Fly', view: 'side', facing: 'right',
  camera: { x0: 172, y0: 339 },                          // reference scale; the hinged figure centred
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.75, to: 0.75 },
    lm => [
      { type: 'dumbbell', at: lm['grip.l'], axis: [0, 0, 1], part: 'db', z: 'front' },
      { type: 'dumbbell', at: lm['grip.r'], axis: [0, 0, 1], part: 'db', z: 'front' },
    ],
    // start dumbbell, dashed side profile (engine workaround as in the squat: the start layer never draws moving
    // equipment): heads 27 cm end to end, 10.3 cm across the hex flats
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: START_DB, z: 'front', part: 'startdb' } : null),
  ],
  checks: [
    { landmark: 'heel.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'heel.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.l', plane: floor, pose: 'all', tol: 0.5 },
  ],
  startParts: ['arm.r'],
  ghosts: { count: 2, parts: ['arm.r', 'db'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  datum: [{ x: [0, 0, 0], from: 349, to: 60 }],           // mid-foot plumb line: the body balances over it
  callouts: [],
  alt: 'Bent-over dumbbell rear delt fly, side view. Hinged forward with a flat back nearly parallel to the floor and soft knees, balanced over the middle of the foot, the lifter raises two dumbbells from hanging under the chest out to the sides until the arms are level with the shoulders, elbows slightly bent.',
};
