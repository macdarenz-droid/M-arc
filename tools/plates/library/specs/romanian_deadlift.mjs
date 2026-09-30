// Romanian deadlift (barbell), side view, figure facing screen right.
// View: side. Everything a coach checks (hips travelling back, soft knees, trunk angle, a neutral spine, the bar
// sliding down the thighs over mid-foot) is sagittal.
// Form sources (standard technique descriptions; numbers below are named constants for the research card):
//  NSCA, Essentials of Strength Training and Conditioning, 4th ed. (Haff & Triplett 2016), ch. 15, Romanian
//   deadlift: start standing tall holding the bar at the thighs (pronated grip, slightly wider than hip width),
//   knees slightly flexed; flex at the hips, move the hips back, keep the back flat and the knees slightly bent and
//   still, bar close to the thighs; lower until the trunk is about parallel or the back can no longer stay flat.
//   (Book, not re-read online for this plate.)
//  ACE Exercise Library, Romanian deadlift: hips push back, soft knees, spine neutral, bar stays close to the legs.
//  Rippetoe, Starting Strength 3rd ed. (2011): a loaded bar stays over the middle of the foot (balance point).
// Geometry decisions (confirmed by the engine report `angles`):
//  Feet: mid-soles 22 cm apart (about hip width; hip-joint centres are 17.5 cm apart), toes out 5 deg, knees
//   tracking the toes. Mid-foot (sole landmark) at world z = 0.
//  Grip: pronated, hands 48 cm apart (just outside the thighs, about shoulder width), arms hanging straight
//   (reach length 99.8% of the straight arm: elbows ~4 deg soft, pointing back).
//  Hinge method (as barbell_back_squat key()): trunk inclination = pelvis tilt + lumbar flexion (spine near
//   neutral). For each key pose the root is SOLVED, not placed by eye: its height gives the knee angle exactly, its
//   fore-aft position makes the bar (hanging at arm's length from the shoulders) sit exactly over mid-foot AND
//   5 mm in front of the near leg's drawn surface (thigh, kneecap or shin), i.e. the bar slides down the legs.
//   The shoulders end up ahead of the bar (arms 6 deg forward of vertical standing, ~19 deg back at the bottom),
//   as in a real hinge where the lats keep the bar against the thighs.
//   Balance check (Winter 2009 segment masses, scratch script): whole-body COM 8.9 cm behind mid-foot standing and
//   1.3 cm ahead at the bottom; with a bar of 0.8 x body mass 4.9 cm behind and 0.7 cm ahead: over the foot
//   (heel at -13 cm) throughout. The solved bottom position is also where the body alone balances over mid-foot.
//  Start: standing tall, knees 4 deg soft, trunk 2 deg forward; bar against the upper thighs.
//  End (CARD: trunk angle, knee angle, bar depth): knees 18 deg (15-20 soft, unchanged through the rep in
//   spirit: they bend only a little more as the hips go back), thorax 62 deg from vertical = pelvis 57 + lumbar 5
//   (neutral), neck in line with the thorax; bar just below the kneecaps.
//  One via pose (half depth) is solved the same way, so the traced bar path is vertical over mid-foot and the bar
//   never passes through the thighs between key poses.
// CARD: END_INCL (trunk angle), END_KNEE and START_KNEE, bottom bar height (just below the knees), grip width,
//  stance width.
import { landmarksOf, RADII } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.11, TOE_OUT = 5;                         // mid-sole lateral offset (hip width), toe-out (deg)
const GRIP_X = 0.24;                                      // hand centre lateral offset on the bar
const REACH = (0.186 + 0.146 + 0.46 * 0.108) * H * 0.998; // shoulder to grip centre, arm straight (Winter)
const BAR_GAP = 0.005;                                    // bar surface to the leg surface (m): touching lightly
const SHAFT_R = 0.014;                                    // 28 mm shaft
const START_KNEE = 4, START_INCL = 2, START_SPINE = 0;
const VIA_KNEE = 12, VIA_INCL = 32, VIA_SPINE = 2;
const END_KNEE = 18, END_INCL = 62, END_SPINE = 5;        // CARD

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
const body = (y, z, incl, spine) => ({ root: { at: [0, y, z], tilt: incl - spine }, trunk: spine, neck: 0, plant: feet });
// Bracketed root finder (Illinois regula falsi): f(lo) and f(hi) must differ in sign; converges in ~10 calls.
const bisect = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`romanian_deadlift: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 60 && Math.abs(b - a) > 1e-7; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
// Hip height that gives the knee angle, for a root z.
const hipY = (z, knee, incl, spine) => bisect(y => kneeOf(landmarksOf(body(y, z, incl, spine), H)) - knee, 0.5, 0.935);
// Bar over mid-foot at arm's length below the shoulders.
const barFor = lm => { const S = lm['shoulder.r'], dx = GRIP_X - Math.abs(S[0]); return [0, S[1] - Math.sqrt(REACH ** 2 - S[2] ** 2 - dx * dx), 0]; };
function key(knee, incl, spine) {
  const gapAt = z => { const lm = landmarksOf(body(hipY(z, knee, incl, spine), z, incl, spine), H); return legGap(lm, barFor(lm)) - BAR_GAP; };
  const z = bisect(gapAt, -0.40, -0.04);
  const pose = body(hipY(z, knee, incl, spine), z, incl, spine), bar = barFor(landmarksOf(pose, H));
  return { ...pose, reach: { l: { at: [GRIP_X, bar[1], 0], pole: [0.2, 0, -1] }, r: { at: [-GRIP_X, bar[1], 0], pole: [-0.2, 0, -1] } } };
}

const start = key(START_KNEE, START_INCL, START_SPINE);
const via = [key(VIA_KNEE, VIA_INCL, VIA_SPINE)];
const end = key(END_KNEE, END_INCL, END_SPINE);

// Bar: the side-view barbell draws the near 45 cm plate as an outline over the figure and the 50 mm sleeve as a
// solid dot, on top (z front) so the bar reads over the fist. Start bar dot, dashed (engine workaround as in the
// squat: the start layer never draws moving equipment).
const barAt = lm => [0, lm.grips[1], lm.grips[2]];
const START_BAR = barAt(landmarksOf(start, H));
const START_DOT = Array.from({ length: 17 }, (_, k) => [0, START_BAR[1] + 0.025 * Math.sin(k * Math.PI / 8), START_BAR[2] + 0.025 * Math.cos(k * Math.PI / 8)]);

const floor = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  id: 'romanian_deadlift', name: 'Romanian Deadlift', view: 'side', facing: 'right',
  camera: { x0: 172, y0: 339 },                          // reference scale; the hinged figure centred
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.75, to: 0.75 },
    lm => ({ type: 'barbell', at: barAt(lm), plates: [0.045], part: 'bar', z: 'front' }),
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: START_DOT, z: 'front', part: 'startbar' } : null),
  ],
  checks: [
    { landmark: 'heel.r', plane: floor, pose: 'all', tol: 0.5 },                 // feet flat through the rep
    { landmark: 'ball.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'heel.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'grips', plane: { point: [0, 0, 0], normal: [0, 0, 1] }, pose: 'all', tol: 0.5 },   // bar over mid-foot
  ],
  startParts: ['trunk', 'leg.r', 'arm.r'],
  ghosts: { count: 2, parts: ['trunk', 'leg.r', 'arm.r'] },
  trace: { point: 'grip.r', trim: [6, 8] },                  // short bar travel (34 cm): small trims
  // Mid-foot plumb line (as the squat): the bar travels down it.
  datum: [{ x: [0, 0, 0], from: 349, to: 60 }],
  callouts: [],
  alt: 'Romanian deadlift, side view. Standing tall with the bar at the thighs, the lifter pushes the hips back with soft knees and a flat back, sliding the bar down the legs to just below the knees; the bar stays over the middle of the foot.',
};
