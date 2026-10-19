// Dumbbell Romanian deadlift, side view, figure facing screen right. LIB-13 (LB3, mode H: HINGE is not built, DESIGN.md
// section 1).
// View: side (card plate.view = census view). Hips back, the soft fixed knee bend, a flat back and the dumbbells grazing
// the legs are front-to-back (c3, c4, c6); so is the arched back while standing up (the top fault, c10).
// Sources: research card docs/research/howto/cards/dumbbell_romanian_deadlift.json (research head 2dd60ae0): callouts =
//  plate.checkpoints (c6 Hips back, c4/c3 Bells on legs, c8/c10 Flat back); Mistake = plate.mistake (c10: the back
//  arches to stand up, in the second half of the rep); tempo = plate.tempo (c20: up 1, down 2, pause 0).
// Clone source: romanian_deadlift (#109 @ 48d49bb): its hinge solve (key(), the leg gap, the mid-shin depth) is copied
//  with the barbell swapped for a pair of dumbbells; never imported (D-LIB9-CLONE).
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Feet: mid-soles 22 cm apart, toes out 5 deg (the clone's; c2 "about shoulder width" is the card's, the side view
//   hides it).
//  Dumbbells (c1): one in each hand in front of the thighs, palms facing the body; the engine dumbbell end-on (the hex,
//   as the curl anchor). Hands 24 cm apart (unsourced; the dumbbells sit in front of the thighs).
//  Knees: KNEE 15 deg in every key pose, softly bent and fixed (inherited from the parent's c4; c6 "softly bent").
//  The hinge method and the solves are the clone's: the root fore-aft SOLVED so the dumbbell's hex face is 5 mm off
//   the drawn leg (c4: "touching the legs"; the hex half across the flats, 5.15 cm, in place of the shaft radius);
//   standing tall, hips over mid-foot, the arm hanging forward at the SOLVED angle that rests the dumbbell on the thigh; the bottom trunk SOLVED so the dumbbell centre is at
//   mid-shin (c3: "about halfway down the shins").
//  Mistake (c10): the back arches to stand up: at the via pose (half way up), the pelvis tilts M_ARCH forward and the
//   lumbar spine extends M_ARCH, so the thorax keeps its angle while the lower back sways; a dashed guide traces the
//   arch and an arrow points into it.
// Unsourced numbers: TOE_OUT 5, the 5 mm gap, the lumbar flexion (5 deg at the bottom), ARM_BACK 10, GRIP_X 0.12,
//  KNEE 15 (the parent's c4, not on this card), M_ARCH 25 (illustrative).
import { landmarksOf, RADII } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.11, TOE_OUT = 5;                         // mid-sole lateral offset (hip width), toe-out (deg)
const GRIP_X = 0.12;                                      // hand centre lateral offset (a dumbbell in front of each thigh)
const REACH = (0.186 + 0.146 + 0.46 * 0.108) * H * 0.998; // shoulder to grip centre, arm straight (Winter)
const BAR_GAP = 0.005;                                    // bar surface to the leg surface (m): touching lightly
const SHAFT_R = 0.119 * 0.866 / 2;                        // the dumbbell hex, half across the flats (vendor 11.9 cm head)
const KNEE = 15;                                          // CARD c4: knees fixed at about 15 deg all rep
const START_SPINE = 0;                                    // standing tall, spine neutral (c1, c10)
const VIA_SPINE = 2, END_SPINE = 5;                       // near-neutral lumbar (c5); END_INCL is solved (bar depth)
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
export const bisect = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`dumbbell_romanian_deadlift: no solution in [${a}, ${b}]`);
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
// Bar at arm's length from the shoulders, the straight arm hanging ARM_BACK deg back from vertical (critic 10-03 R1:
// a loaded arm hangs near vertical; 27 deg read as pulled back).
const ARM_BACK = 10;
const Z_HANG = [-0.7, -0.05];                         // root fore-aft bracket for the hanging-arm solve (one contact, in front of the shin)
const hangFor = lm => { const S = lm['shoulder.r'], dx = GRIP_X - Math.abs(S[0]), L = Math.sqrt(REACH ** 2 - dx * dx);
  return [0, S[1] - L * Math.cos(ARM_BACK * R), S[2] - L * Math.sin(ARM_BACK * R)]; };
function key(knee, incl, spine, hang = barFor, zr = [-0.7, -0.02]) {
  const gapAt = z => { const lm = landmarksOf(body(hipY(z, knee, incl, spine), z, incl, spine), H); return legGap(lm, hang(lm)) - BAR_GAP; };
  // The dumbbell is wider than the bar, so the clone's fixed brackets can miss: scan zr in 1 cm steps for the first
  // change from inside the leg (gap < 0) to clear of it, and solve inside that step.
  let z = null;
  for (let a = zr[0]; a < zr[1] - 1e-9 && z === null; a += 0.01) if (gapAt(a) < 0 && gapAt(a + 0.01) >= 0) z = bisect(gapAt, a, a + 0.01);
  if (z === null) throw new Error(`dumbbell_romanian_deadlift: no leg contact in [${zr}] at trunk ${incl}`);
  const pose = body(hipY(z, knee, incl, spine), z, incl, spine), bar = hang(landmarksOf(pose, H));
  return { ...pose, reach: { l: { at: [GRIP_X, bar[1], bar[2]], pole: [0.2, 0, -1] }, r: { at: [-GRIP_X, bar[1], bar[2]], pole: [-0.2, 0, -1] } } };
}

// Mid-shin (CARD c6): the bottom trunk angle is SOLVED so the bar centre sits at the height of the mid-point of the
// near shank (knee to ankle joint centres). Not a card number: it follows from the knee angle and the depth.
const midShin = lm => (lm['knee.r'][1] + lm['ankle.r'][1]) / 2;
const barDepth = incl => { const lm = landmarksOf(key(KNEE, incl, END_SPINE, hangFor, Z_HANG), H); return lm.grips[1] - midShin(lm); };
const END_INCL = bisect(barDepth, 70, 100);
// Standing tall (c1, c2): trunk upright (START_INCL 0), hips over mid-foot (root z 0), knees at KNEE; the straight arm
// hangs forward at the angle SOLVED (bracket 0-30 deg) that rests the dumbbell's hex 5 mm off the drawn thigh: the
// dumbbells in front of the thighs (a 5 cm dumbbell cannot hang plumb under the shoulder without entering the thigh).
const START_INCL = 0;
const standBody = body(hipY(0, KNEE, START_INCL, START_SPINE), 0, START_INCL, START_SPINE), LS0 = landmarksOf(standBody, H);
const hangAt = (S, a) => { const dx = GRIP_X - Math.abs(S[0]), L = Math.sqrt(REACH ** 2 - dx * dx); return [0, S[1] - L * Math.cos(a * R), S[2] + L * Math.sin(a * R)]; };
const START_ARM = bisect(a => legGap(LS0, hangAt(LS0['shoulder.r'], a)) - BAR_GAP, 0, 30);
const START_DB = hangAt(LS0['shoulder.r'], START_ARM);
const start = { ...standBody, reach: { l: { at: [GRIP_X, START_DB[1], START_DB[2]], pole: [0.2, 0, -1] }, r: { at: [-GRIP_X, START_DB[1], START_DB[2]], pole: [-0.2, 0, -1] } } };
const via = [key(KNEE, END_INCL / 2, VIA_SPINE, hangFor, Z_HANG)];
const end = key(KNEE, END_INCL, END_SPINE, hangFor, Z_HANG);
const LE = landmarksOf(end, H), MID_SHIN = midShin(LE);
const angleFromVertical = (a, b) => Math.atan2(Math.abs(a[2] - b[2]), Math.abs(a[1] - b[1])) / R;
export const dbInfo = { endIncl: +END_INCL.toFixed(1), hipZ: +LE['hip.r'][2].toFixed(3), heelZ: +LE['heel.r'][2].toFixed(3), barZ: +LE.grips[2].toFixed(3),
  shoulderZ: +LE['shoulder.r'][2].toFixed(3), armDeg: +angleFromVertical(LE['shoulder.r'], LE['grip.r']).toFixed(1),
  thighDeg: +angleFromVertical(LE['hip.r'], LE['knee.r']).toFixed(1), shinDeg: +((LE['knee.r'][2] - LE['ankle.r'][2]) / Math.hypot(LE['knee.r'][1] - LE['ankle.r'][1], LE['knee.r'][2] - LE['ankle.r'][2])).toFixed(3) };

// Mistake (c10): standing up with the back arched. The via pose (half way down) with the pelvis tilted M_ARCH further
// forward and the lumbar extended M_ARCH: the thorax angle is unchanged, the lower back sways in.
const M_ARCH = 25, V = via[0];
const mistakePose = { root: { ...V.root, tilt: V.root.tilt + M_ARCH }, trunk: V.trunk - M_ARCH, reach: V.reach };
const LM_M = landmarksOf({ ...end, ...mistakePose }, H);
// The arch as a dashed curve: sacrum -> lumbar -> backMid of the faulty pose, pushed 2 cm out from the back.
const ARCH_PTS = (() => {
  const P = ['sacrum', 'lumbar', 'backMid', 'backUpper'].map(k => LM_M[k]), c = P.reduce((a, p) => a.map((v, i) => v + p[i] / P.length), [0, 0, 0]);
  return P.map(p => p.map((v, i) => v + (p[i] - c[i]) * 0 + (i === 1 ? 0.02 : 0)));
})();
const ARCH_TIP = LM_M.lumbar.map((v, i) => v + (i === 1 ? 0.03 : 0)), ARCH_TAIL = LM_M.lumbar.map((v, i) => v + (i === 1 ? 0.13 : 0));

const DB = lm => ({ type: 'dumbbell', at: lm['grip.r'], part: 'bell' });
const START_GRIP = landmarksOf(start, H)['grip.r'];
const START_HEX = Array.from({ length: 7 }, (_, k) => [0, START_GRIP[1] + 0.0595 * Math.sin(k * Math.PI / 3 + Math.PI / 6), START_GRIP[2] + 0.0595 * Math.cos(k * Math.PI / 3 + Math.PI / 6)]);
const floor = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  id: 'dumbbell_romanian_deadlift', name: 'Dumbbell Romanian Deadlift', view: 'side', facing: 'right',
  camera: { x0: 172, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.75, to: 0.75 },
    DB,
    // the start dumbbell, dashed (the start layer never draws moving equipment)
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: START_HEX, z: 'front', part: 'startbell' } : null),
  ],
  checks: [
    { landmark: 'heel.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'heel.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'grips', plane: { point: [0, MID_SHIN, 0], normal: [0, 1, 0] }, pose: 'end', tol: 0.5 },   // c3 mid-shin
  ],
  startParts: ['trunk', 'leg.r', 'arm.r'],
  ghosts: { count: 2, parts: ['trunk', 'leg.r', 'arm.r'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  callouts: [
    { key: 'hips', text: 'Hips back', anchor: 'buttock', box: { left: 16, top: 176 }, cue: 'Push your hips back, not down, and keep your knees softly bent.' },
    { key: 'bells', text: 'Bells on<br>legs', anchor: 'grip.r', cue: 'Run the dumbbells down your thighs and shins, touching your legs.' },
    { key: 'back', text: 'Flat back', anchor: 'backUpper', box: { left: 57, top: 126 }, cue: 'Keep your back neutral and stop where it would round.' },
  ],
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Stand', s: 1, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: ARCH_PTS, smooth: true },
      { kind: 'arrow', from: ARCH_TAIL, to: ARCH_TIP },
    ],
    tells: [
      { key: 'arch', text: 'Back<br>arches', anchor: { at: 'lumbar', pose: 'mistake' }, box: { left: 70, top: 130 }, cue: 'The lower back arches to stand up.' },
      { key: 'hips', text: 'Hips stay<br>back', anchor: { at: 'buttock', pose: 'mistake' }, box: { left: 30, top: 200 }, cue: 'The hips stay back while the back does the lifting.' },
    ],
  },
  alt: 'Dumbbell Romanian deadlift, side view. Standing with a dumbbell in front of each thigh and the knees softly bent, the lifter pushes the hips back with a flat back, the dumbbells grazing the legs down to about mid-shin, and stands back up.',
};
