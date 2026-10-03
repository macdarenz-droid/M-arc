// Romanian deadlift (barbell), side view, figure facing screen right.
// View: side. Everything a coach checks (hips travelling back, soft knees, trunk angle, a neutral spine, the bar
// sliding down the legs) is sagittal.
// Sources: research card docs/research/howto/cards/romanian_deadlift.json (card v2, verified at claude/libht-research e2a70bc): claims c1-c7, c9, c10, c20
//  (ace-romanian-deadlift, sl-romanian-deadlift, nasm-rdl, acsm2009). Callouts = the card's 3 plate.checkpoints
//  (c2 Hips back, c3 Bar close, c5 Flat back); Mistake = plate.mistake (c7); tempo = plate.tempo (c20: 2 s down,
//  1 s up, pause 0 so no hold phase).
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Feet: mid-soles 22 cm apart (hip width, c10; hip-joint centres are 17.5 cm apart), toes out 5 deg, knees
//   tracking the toes. Mid-foot (sole landmark) at world z = 0.
//  Grip: pronated, hands 48 cm apart (slightly wider than the 45 cm shoulders, arms just outside the thighs, c9),
//   arms hanging straight (reach length 99.8% of the straight arm: elbows ~4 deg soft, pointing back).
//  Knees (CARD c4): 15 deg in every key pose (start, via, end): the knees stay fixed, only the hips bend. Proved by
//   measure.expect 165 (round 3, R4: the knee arc drawn at the knee between thigh and shin, as barbell_row) and
//   the report angles.
//  Hinge method (as barbell_back_squat key()): trunk inclination = pelvis tilt + lumbar flexion (spine near
//   neutral, c5, c10). For each key pose the root is SOLVED, not placed by eye: its height gives the knee angle
//   exactly, its fore-aft position makes the bar (hanging at arm's length from the shoulders) sit exactly over
//   mid-foot (start) or the arms hang ARM_BACK (end, via), AND the bar sits 5 mm in front of the near leg's drawn
//   surface (thigh, kneecap or shin): the bar slides down the legs (c3). `checks` prove the start bar over mid-foot.
//  Start (c1): standing, bar on the front of the thighs; the trunk lean (17 deg) is SOLVED so the shoulders sit
//   straight over the bar (arms plumb); spine neutral.
//  End (CARD c6, bar at about mid-shin; critic 10-03 R1: hips well back, a loaded arm hanging near vertical): the
//   straight arms hang ARM_BACK (10 deg) back from vertical, the root's fore-aft position is SOLVED so the bar
//   touches the shin (BAR_GAP), and the trunk angle so the bar centre is at the height of the mid-point of the near
//   shank, proved by a `checks` plane at MID_SHIN (0.0 cm). Result (rdlInfo): hips 40 cm behind mid-foot (28 cm
//   behind the heel), thighs 30 deg and shins 15 deg back from vertical at the fixed 15 deg knee, trunk 82 deg from
//   vertical, shoulders 6 cm ahead of mid-foot, the bar 6 cm behind it against the shin. The earlier bottom kept the
//   bar over mid-foot with the hips only 6 cm behind the heels, so the arm hung 27 deg back (critic R1). No mid-foot
//   plumb line: the bar drifts 6 cm back along the legs (c3, bar close), which the card allows (c6: depth, c4: knees).
//   The trunk angle is not a card number; it follows from c4, c6 and ARM_BACK.
//  One via pose (half the bottom trunk angle) is solved the same way, so the bar slides along the legs between key
//   poses and never passes through the thighs.
//  Mistake (c7, plate.mistake + handlingMistakes "rounding the lower back to get the bar lower"): feet, knees and
//   hips as in the correct bottom; the pelvis tucks M_TUCK (25 deg, illustrative: the card gives no number) and the
//   lumbar spine flexes until the hanging bar's 45 cm plates reach the floor (solved: 39 deg lumbar flexion). The
//   bar hangs plumb from the shoulders, so it also leaves the legs. Guides (round 3, R5): a dashed curve along the rounded
//   lower back (sacrum to mid-back, 10 px hump: the pose alone draws ~3 px), a red arrow onto its top where the
//   LOWER BACK ROUNDS tell ends, and an arrow from the correct bar to the faulty one.
// CARD: KNEE (c4, 15 deg), bottom bar height (c6, mid-shin), stance (c10) and grip (c9) widths; tempo (c20).
// Unsourced (not on the card, geometry choices above): the 5 deg lumbar flexion, 5 deg toe-out, the 5 mm bar gap,
//  ARM_BACK (10 deg: the critic's "within about 10 degrees of vertical").
import { landmarksOf, RADII } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.11, TOE_OUT = 5;                         // mid-sole lateral offset (hip width), toe-out (deg)
const GRIP_X = 0.24;                                      // hand centre lateral offset on the bar
const REACH = (0.186 + 0.146 + 0.46 * 0.108) * H * 0.998; // shoulder to grip centre, arm straight (Winter)
const BAR_GAP = 0.005;                                    // bar surface to the leg surface (m): touching lightly
const SHAFT_R = 0.014;                                    // 28 mm shaft
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
// Bar at arm's length from the shoulders, the straight arm hanging ARM_BACK deg back from vertical (critic 10-03 R1:
// a loaded arm hangs near vertical; 27 deg read as pulled back).
const ARM_BACK = 10;
const Z_HANG = [-0.45, -0.25];                         // root fore-aft bracket for the hanging-arm solve (one contact, in front of the shin)
const hangFor = lm => { const S = lm['shoulder.r'], dx = GRIP_X - Math.abs(S[0]), L = Math.sqrt(REACH ** 2 - dx * dx);
  return [0, S[1] - L * Math.cos(ARM_BACK * R), S[2] - L * Math.sin(ARM_BACK * R)]; };
function key(knee, incl, spine, hang = barFor, zr = [-0.40, -0.04]) {
  const gapAt = z => { const lm = landmarksOf(body(hipY(z, knee, incl, spine), z, incl, spine), H); return legGap(lm, hang(lm)) - BAR_GAP; };
  const z = bisect(gapAt, ...zr);
  const pose = body(hipY(z, knee, incl, spine), z, incl, spine), bar = hang(landmarksOf(pose, H));
  return { ...pose, reach: { l: { at: [GRIP_X, bar[1], bar[2]], pole: [0.2, 0, -1] }, r: { at: [-GRIP_X, bar[1], bar[2]], pole: [-0.2, 0, -1] } } };
}

// Mid-shin (CARD c6): the bottom trunk angle is SOLVED so the bar centre sits at the height of the mid-point of the
// near shank (knee to ankle joint centres). Not a card number: it follows from the knee angle and the depth.
const midShin = lm => (lm['knee.r'][1] + lm['ankle.r'][1]) / 2;
const barDepth = incl => { const lm = landmarksOf(key(KNEE, incl, END_SPINE, hangFor, Z_HANG), H); return lm.grips[1] - midShin(lm); };
const END_INCL = bisect(barDepth, 70, 100);
// Standing: the trunk lean is SOLVED so the shoulders sit straight over the bar (arms hanging plumb, bar resting on
// the thighs over mid-foot, c1).
const START_INCL = bisect(incl => landmarksOf(key(KNEE, incl, START_SPINE), H)['shoulder.r'][2], 0, 30);
const start = key(KNEE, START_INCL, START_SPINE);
const via = [key(KNEE, END_INCL / 2, VIA_SPINE, hangFor, Z_HANG)];
const end = key(KNEE, END_INCL, END_SPINE, hangFor, Z_HANG);
const LE = landmarksOf(end, H), MID_SHIN = midShin(LE);
const angleFromVertical = (a, b) => Math.atan2(Math.abs(a[2] - b[2]), Math.abs(a[1] - b[1])) / R;
export const rdlInfo = { endIncl: +END_INCL.toFixed(1), hipZ: +LE['hip.r'][2].toFixed(3), heelZ: +LE['heel.r'][2].toFixed(3), barZ: +LE.grips[2].toFixed(3),
  shoulderZ: +LE['shoulder.r'][2].toFixed(3), armDeg: +angleFromVertical(LE['shoulder.r'], LE['grip.r']).toFixed(1),
  thighDeg: +angleFromVertical(LE['hip.r'], LE['knee.r']).toFixed(1), shinDeg: +((LE['knee.r'][2] - LE['ankle.r'][2]) / Math.hypot(LE['knee.r'][1] - LE['ankle.r'][1], LE['knee.r'][2] - LE['ankle.r'][2])).toFixed(3) };

// Mistake (card plate.mistake, c7): the lower back rounds as the bar is reached down. Hips, knees and feet stay as in
// the correct bottom; the pelvis tucks (M_TUCK) and the lumbar spine flexes until the hanging bar's 45 cm plates
// reach the floor (c5: the bar does not need to touch the floor; handlingMistakes: rounding to get the bar lower).
// M_TUCK is illustrative (the card gives no number); the rounding follows from the floor stop.
const M_TUCK = 25, PLATE_R = 0.225, M_FLOOR_GAP = 0.004;
const hangFrom = lm => { const S = lm['shoulder.r'], dx = GRIP_X - Math.abs(S[0]); return [0, S[1] - Math.sqrt(REACH ** 2 - dx * dx), S[2]]; };
const mistOf = spine => ({ ...end, root: { at: end.root.at, tilt: END_INCL - END_SPINE - M_TUCK }, trunk: spine });
const M_SPINE = bisect(sp => hangFrom(landmarksOf(mistOf(sp), H))[1] - PLATE_R - M_FLOOR_GAP, END_SPINE, 60);
const MIST_BAR = hangFrom(landmarksOf(mistOf(M_SPINE), H));
const mistakePose = { root: mistOf(M_SPINE).root, trunk: M_SPINE,
  reach: { l: { at: [GRIP_X, MIST_BAR[1], MIST_BAR[2]], pole: [0.2, 0, -1] }, r: { at: [-GRIP_X, MIST_BAR[1], MIST_BAR[2]], pole: [-0.2, 0, -1] } } };
// R5 (round 3): the engine bends the spine at one lumbar point and blends the outline over ~10 cm, so the drawn hump
// of the rounded back is only ~3 px. A dashed curve along the lower back (mistake guides are drawn on top, not
// masked) shows the rounding: from the sacrum to the mid-back of the faulty pose, bulging HUMP (7 cm, 10 px) out
// of the straight line between them at its middle. The red arrow points at the top of that hump.
const HUMP = 0.07;
const LM_M = landmarksOf({ ...end, ...mistakePose }, H);
const HUMP_PTS = (() => {
  const A = LM_M.sacrum, B = LM_M.backMid, M = A.map((v, i) => (v + B[i]) / 2), d = [0, B[1] - A[1], B[2] - A[2]], L = Math.hypot(...d);
  let n = [0, -d[2] / L, d[1] / L];
  if ((LM_M.chest[1] - M[1]) * n[1] + (LM_M.chest[2] - M[2]) * n[2] > 0) n = n.map(v => -v);   // away from the chest
  const C = M.map((v, i) => v + n[i] * 2 * HUMP);                                                // quadratic control point
  const pts = Array.from({ length: 13 }, (_, k) => { const t = k / 12; return A.map((v, i) => (1 - t) ** 2 * v + 2 * t * (1 - t) * C[i] + t * t * B[i]); });
  return { pts, apex: pts[6], n };
})();
const HUMP_OUT = k => HUMP_PTS.apex.map((v, i) => v + HUMP_PTS.n[i] * k);


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
    // Mistake only: the near 45 cm plate as a circle that carries poly (the barbell's plate outline is a line and
    // would drop out of the Mistake view, PQ-H9), so the faulty plates are seen landing on the floor.
    (lm, ctx) => (ctx.pose === 'mistake' ? { type: 'pulley', at: barAt(lm), r: PLATE_R, part: 'mplate', z: 'front' } : null),
  ],
  checks: [
    { landmark: 'heel.r', plane: floor, pose: 'all', tol: 0.5 },                 // feet flat through the rep
    { landmark: 'ball.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'heel.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'grips', plane: { point: [0, 0, 0], normal: [0, 0, 1] }, pose: 'start', tol: 0.5 }, // bar over mid-foot
    { landmark: 'grips', plane: { point: [0, MID_SHIN, 0], normal: [0, 1, 0] }, pose: 'end', tol: 0.5 }, // c6 mid-shin
    { landmark: 'grips', above: { point: [0, PLATE_R, 0], normal: [0, 1, 0] }, pose: 'mistake' },      // plates on, not in, the floor
  ],
  startParts: ['trunk', 'leg.r', 'arm.r'],
  ghosts: { count: 2, parts: ['trunk', 'leg.r', 'arm.r'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  // R4 (round 3): the knee angle drawn AT the knee (as barbell_row): the arc between thigh and shin, round the back of
  // the knee. The earlier flexion arc (shin extension to thigh) was only 15 deg wide at 28 px and floated on the thigh.
  measure: { vertex: 'knee.r', from: 'hip.r', to: 'ankle.r', radius: 18, title: 'Knee', value: 'about 15° bend', expect: 180 - KNEE },
  callouts: [
    // c2
    { key: 'hips', text: 'Hips back', anchor: 'buttock', cue: 'Move your hips back to lower the bar and keep the slight knee bend fixed.' },
    // c3
    { key: 'bar', text: 'Bar close', anchor: 'grip.r', cue: 'Keep the bar very close to your legs all the way down and up.' },
    // c5
    { key: 'back', text: 'Flat back', anchor: 'backUpper', cue: 'Keep your back neutral and stop lowering where it would start to round.' },
  ],
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Stand', s: 1, move: true }],   // c20 (pause 0: no hold)
  mistake: {
    pose: mistakePose,
    guides: [
      // the rounded lower back (R5): dashed hump along the back, red arrow onto its top
      { kind: 'dashed', pts: HUMP_PTS.pts },
      { kind: 'arrow', from: HUMP_OUT(0.12), to: HUMP_OUT(0.015) },
      { kind: 'arrow', from: { at: 'grip.r', pose: 'end' }, to: { at: 'grip.r', pose: 'mistake' } },
    ],
    tells: [
      // c7 (plate.mistake)
      { key: 'round', text: 'Lower back<br>rounds', anchor: HUMP_PTS.pts[4], cue: 'The lower back rounds at the bottom of the rep.' },
      // c7 (handlingMistakes: rounding to get the bar lower), c5
      { key: 'reach', text: 'Bar<br>too low', anchor: 'grip.r', cue: 'The bar is reached down to the floor by rounding the back.' },
    ],
  },
  alt: 'Romanian deadlift, side view. Standing tall with the bar at the thighs and knees about 15 degrees bent, the lifter pushes the hips back with a flat back, keeping the knee bend fixed and the bar close to the legs down to about mid-shin.',
};
