// Barbell row (bent-over, overhand), side view, figure facing screen right.
// View: side. What a coach checks (a held hip hinge, a flat back, the bar pulled to the lower chest / upper
// stomach, elbows driving back past the torso) is sagittal.
// Form sources (standard technique descriptions; numbers below are named constants for the research card):
//  NSCA, Essentials of Strength Training and Conditioning, 4th ed. (Haff & Triplett 2016), ch. 15, bent-over row:
//   pronated grip wider than shoulder width, knees slightly flexed, torso flexed forward with a flat back, arms
//   fully extended at the start; pull the bar to the lower chest / upper abdomen, torso and knees still.
//   (Book, not re-read online for this plate.)
//  ACE Exercise Library, bent-over barbell row: hinge at the hips, neutral spine, pull the elbows back.
// Geometry decisions (confirmed by the engine report `angles`):
//  Legs and trunk are one held hinge: the same root, pelvis tilt and lumbar flexion in start and end (only the
//   arms, shoulder blades and bar move; startParts and ghosts show only the near arm and the bar).
//  Hinge method (romanian_deadlift / barbell_back_squat key()): thorax inclination = pelvis tilt + lumbar flexion
//   (spine near neutral). The root is SOLVED: its height gives the knee angle; its fore-aft position puts the
//   hanging bar (arm's length below the shoulders) exactly over mid-foot and 1 cm clear of the shins.
//   Balance check (Winter 2009 segment masses, scratch script): body COM 0.8 cm behind mid-foot at the start
//   (2.1 cm at the end); with a bar of half body mass 0.5 cm behind (start) and 1.6 cm ahead (end). The shoulders therefore sit ahead of
//   the bar (arms ~19 deg back from vertical), as they must for the lifter's own mass to balance over the feet.
//  Trunk (CARD): thorax 60 deg from vertical (30 deg above horizontal) = pelvis 55 + lumbar 5. Knees 20 deg
//   (CARD). Neck in line with the thorax.
//  Grip: pronated, hands 52 cm apart (slightly wider than the 45 cm shoulder width).
//  Start: shoulder blades 2 cm protracted (arms long); bar over mid-foot, just below the knees.
//  End: bar touching the torso at the lower chest / upper stomach (thorax point 0.70 H, 1.9 cm off the drawn
//   front surface = shaft radius + clothing), elbows driven back past the back line (IK pole toward the back of the
//   thorax, 35% out to the side: a moderate flare; with the bar on the lower chest the elbow flexes ~137 deg and the
//   elbow sits just above the back line in the side view), shoulder blades squeezed back 4 cm.
// CARD: TRUNK_INCL, KNEE, grip width, end bar contact height (BAR_T), stance width.
import { landmarksOf, RADII } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.12, TOE_OUT = 5;                         // mid-sole lateral offset (~hip width), toe-out (deg)
const GRIP_X = 0.26;                                      // hand centre lateral offset on the bar
const REACH = (0.186 + 0.146 + 0.46 * 0.108) * H * 0.998; // shoulder to grip centre, arm straight (Winter)
const BAR_GAP = 0.01;                                     // hanging bar surface to the shin/knee surface (m)
const SHAFT_R = 0.014;                                    // 28 mm shaft
const TRUNK_INCL = 60, SPINE = 5, KNEE = 20;              // CARD
const PRO_START = 2, PRO_END = -4;                        // shoulder blades (cm): long arms -> squeezed back
const ELBOW_OUT = 0.35;                                  // elbow pole: lateral share (flare ~30-45 deg from the torso)
const BAR_T = [0.70, 0.065 + (SHAFT_R + 0.005) / H];     // bar centre at the end, standing thorax frame (y, z in H)

const toe = s => [s * Math.sin(TOE_OUT * R), 0, Math.cos(TOE_OUT * R)];
const feet = { l: { at: [FOOT_X, 0, 0], toe: toe(1) }, r: { at: [-FOOT_X, 0, 0], toe: toe(-1) } };

// Limb radius profile (engine geom.limbR) to measure the bar's clearance from the drawn leg.
const limbR = (rA, rM, rB, m) => t => t < m ? rA + (rM - rA) * Math.sin((t / m) * Math.PI / 2) : rM + (rB - rM) * (1 - Math.cos(((t - m) / (1 - m)) * Math.PI / 2));
const thR = limbR(...RADII.thigh), shR = limbR(...RADII.shank);
const segGap = (p, a, b, rf) => {
  const d = [b[1] - a[1], b[2] - a[2]], L2 = d[0] ** 2 + d[1] ** 2;
  const t = Math.max(0, Math.min(1, ((p[1] - a[1]) * d[0] + (p[2] - a[2]) * d[1]) / L2));
  return Math.hypot(p[1] - a[1] - d[0] * t, p[2] - a[2] - d[1] * t) - rf(t) * H;
};
const legGap = (lm, bar) => Math.min(segGap(bar, lm['hip.r'], lm['knee.r'], thR), segGap(bar, lm['knee.r'], lm['ankle.r'], shR),
  Math.hypot(bar[1] - lm['knee.r'][1], bar[2] - lm['knee.r'][2]) - RADII.kneeCap * H) - SHAFT_R;
const kneeOf = lm => {
  const a = [0, 1, 2].map(i => lm['hip.r'][i] - lm['knee.r'][i]), b = [0, 1, 2].map(i => lm['ankle.r'][i] - lm['knee.r'][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
const body = (y, z, pro) => ({ root: { at: [0, y, z], tilt: TRUNK_INCL - SPINE }, trunk: SPINE, neck: 0, scap: { pro }, plant: feet });
// Bracketed root finder (Illinois regula falsi): f(a) and f(b) must differ in sign.
const solve = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`barbell_row: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 60 && Math.abs(b - a) > 1e-7; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const hipY = z => solve(y => kneeOf(landmarksOf(body(y, z, PRO_START), H)) - KNEE, 0.5, 0.935);
const barFor = lm => { const S = lm['shoulder.r'], dx = GRIP_X - Math.abs(S[0]); return [0, S[1] - Math.sqrt(REACH ** 2 - S[2] ** 2 - dx * dx), 0]; };
const ROOT_Z = solve(z => { const lm = landmarksOf(body(hipY(z), z, PRO_START), H); return legGap(lm, barFor(lm)) - BAR_GAP; }, -0.40, -0.04);
const ROOT_Y = hipY(ROOT_Z);

const hands = (bar, pole) => ({ l: { at: [GRIP_X, bar[1], bar[2]], pole: [-pole[0], pole[1], pole[2]] }, r: { at: [-GRIP_X, bar[1], bar[2]], pole } });
const start0 = body(ROOT_Y, ROOT_Z, PRO_START);
const START_BAR = barFor(landmarksOf(start0, H));
const start = { ...start0, reach: hands(START_BAR, [-0.2, 0, -1]) };

// End bar spot: affine combination of three thorax landmarks (as barbell_back_squat), so it sits on the thorax.
const REFP = { neck: [0.855, -0.02], backUpper: [0.75, -0.072], sternum: [0.80, 0.07] };
const W = (() => {
  const [a, b, c] = [REFP.neck, REFP.backUpper, REFP.sternum];
  const M = [[a[0] - c[0], b[0] - c[0]], [a[1] - c[1], b[1] - c[1]]], v = [BAR_T[0] - c[0], BAR_T[1] - c[1]];
  const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
  const wa = (v[0] * M[1][1] - M[0][1] * v[1]) / det, wb = (M[0][0] * v[1] - v[0] * M[1][0]) / det;
  return { neck: wa, backUpper: wb, sternum: 1 - wa - wb };
})();
const end0 = body(ROOT_Y, ROOT_Z, PRO_END), LE0 = landmarksOf(end0, H);
const END_BAR = [0, 1, 2].map(i => i === 0 ? 0 : W.neck * LE0.neck[i] + W.backUpper * LE0.backUpper[i] + W.sternum * LE0.sternum[i]);
// Elbow pole: toward the back of the thorax (world) and ELBOW_OUT out to the side.
const dorsal = (() => { const d = [0, 1, 2].map(i => LE0.backUpper[i] - LE0.chest[i]), L = Math.hypot(...d); return d.map(v => v / L); })();
const end = { ...end0, reach: hands(END_BAR, [-ELBOW_OUT, dorsal[1], dorsal[2]]) };

const barAt = lm => [0, lm.grips[1], lm.grips[2]];
const START_DOT = Array.from({ length: 17 }, (_, k) => [0, START_BAR[1] + 0.025 * Math.sin(k * Math.PI / 8), START_BAR[2] + 0.025 * Math.cos(k * Math.PI / 8)]);
const floor = { point: [0, 0, 0], normal: [0, 1, 0] };

export default {
  id: 'barbell_row', name: 'Barbell Row', view: 'side', facing: 'right',
  camera: { x0: 172, y0: 339 },                          // reference scale; the hinged figure centred
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.75, to: 0.75 },
    // near 45 cm plate as an outline, 50 mm sleeve dot on top so the bar reads over the fist (as the squat)
    lm => ({ type: 'barbell', at: barAt(lm), plates: [0.045], part: 'bar', z: 'front' }),
    // the 50 mm sleeve alone as its own part, so the ghosts show the bar path without four more plate circles
    lm => ({ type: 'pulley', at: barAt(lm), r: 0.025, part: 'bardot', z: 'front' }),
    // start bar, dashed (engine workaround as in the squat: the start layer never draws moving equipment)
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: START_DOT, z: 'front', part: 'startbar' } : null),
  ],
  checks: [
    { landmark: 'heel.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'heel.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'grips', plane: { point: [0, 0, 0], normal: [0, 0, 1] }, pose: 'start', tol: 0.5 },   // bar over mid-foot
    { landmark: 'grips', at: END_BAR, pose: 'end', tol: 0.5 },                                         // bar on the torso
  ],
  startParts: ['arm.r'],
  ghosts: { count: 3, parts: ['arm.r', 'bardot'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  datum: [{ x: [0, 0, 0], from: 349, to: 60 }],           // mid-foot plumb line: the bar starts over it
  callouts: [],
  alt: 'Barbell row, side view. Hinged at the hips with a flat back about 30 degrees above horizontal and soft knees, the lifter pulls the bar from straight arms, over the middle of the foot, to the lower chest, driving the elbows back.',
};
