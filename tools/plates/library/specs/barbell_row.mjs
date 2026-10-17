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
//  End (critic run 2 fix): bar touching the belly just above the navel (c5), 1.9 cm off the drawn front surface
//   (shaft radius + clothing), SOLVED to sit over mid-foot, so the bar path is one vertical line on the plumb datum.
//   The elbow is driven back and up until it sits straight above the bar (forearm vertical in the side view): IK
//   pole toward the back of the thorax with a SOLVED lateral share (report angles: shoulder elev 60 deg in the
//   abduction plane, elbow 120 deg), shoulder blades squeezed back 4 cm.
// Research card (docs/research/howto/cards/barbell_row.json, card v2, verified at claude/libht-research e2a70bc):
//  callouts = plate.checkpoints (Flat back c4, Soft knees c3, Bar to belly c5); Mistake = plate.mistake (torso
//  swings up to heave the bar, c7; tells from c7 and handlingMistakes[0]); tempo = plate.tempo (up 1 s, down 2 s,
//  no pause, c13: two phases, no invented rest). The knee arc is worded, not numbered: the card says "slightly
//  bent" (c3) and gives no angle. End bar spot matches c6 (abdomen or low chest).
// CARD numbers: the card gives none for the trunk angle, the knee angle, the grip width (c2: "slightly wider than
//  shoulder width", 52 cm fits) or the stance (c8: about shoulder width). TRUNK_INCL 60 and KNEE 20 stay unsourced
//  (flagged).
import { landmarksOf, RADII } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.12, TOE_OUT = 5;                         // mid-sole lateral offset (~hip width), toe-out (deg)
const GRIP_X = 0.26;                                      // hand centre lateral offset on the bar
const REACH = (0.186 + 0.146 + 0.46 * 0.108) * H * 0.998; // shoulder to grip centre, arm straight (Winter)
const BAR_GAP = 0.01;                                     // hanging bar surface to the shin/knee surface (m)
const SHAFT_R = 0.014;                                    // 28 mm shaft
const TRUNK_INCL = 60, SPINE = 5, KNEE = 20;              // CARD
const PRO_START = 2, PRO_END = -4;                        // shoulder blades (cm): long arms -> squeezed back

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

// End bar spot (critic run 2, R1): the bar finishes on the belly just above the navel (c5 "toward the belly button")
// and straight over mid-foot, so the whole bar path is one vertical line on the plumb datum. barOn(lm, t) is a point
// on the front surface line navel -> chest at fraction t, pushed out by the shaft radius + 5 mm clothing; BAR_T is
// SOLVED so that point sits at z = 0 (mid-foot) in the end pose.
const CLEAR = SHAFT_R + 0.005;
const barOn = (lm, t) => {
  const d = [lm.chest[1] - lm.navel[1], lm.chest[2] - lm.navel[2]], L = Math.hypot(...d), u = d.map(v => v / L);
  let n = [-u[1], u[0]];
  if (n[0] * (lm.chest[1] - lm.backUpper[1]) + n[1] * (lm.chest[2] - lm.backUpper[2]) < 0) n = n.map(v => -v);
  return [0, lm.navel[1] + d[0] * t + n[0] * CLEAR, lm.navel[2] + d[1] * t + n[1] * CLEAR];
};
const end0 = body(ROOT_Y, ROOT_Z, PRO_END), LE0 = landmarksOf(end0, H);
const BAR_T = solve(t => barOn(LE0, t)[2], -0.5, 1);
const END_BAR = barOn(LE0, BAR_T);
// Elbow pole: toward the back of the thorax (world) and a lateral share SOLVED so the elbow sits straight above the
// bar in the side view (critic run 2, R1: the forearm hangs vertical at the top, as a strict row finishes).
const dorsal = (() => { const d = [0, 1, 2].map(i => LE0.backUpper[i] - LE0.chest[i]), L = Math.hypot(...d); return d.map(v => v / L); })();
const endAt = out => ({ ...end0, reach: hands(END_BAR, [-out, dorsal[1], dorsal[2]]) });
const ELBOW_OUT = solve(out => landmarksOf(endAt(out), H)['elbow.r'][2] - END_BAR[2], 0.05, 5);
const end = endAt(ELBOW_OUT);

// Mistake (card plate.mistake, c7): the torso swings up to heave the bar. Hips and lower back extend together
// (pelvis and lumbar both open), the feet stay planted, and the bar is still pulled to the same thorax spot, so the
// fault reads as a trunk that rises with the bar. M_TILT / M_SPINE are illustrative (the card gives no number).
const M_TILT = 30, M_SPINE = 0, M_HIP = [0.02, 0.05];    // hips drive up and forward (m)
const mist0 = { ...body(ROOT_Y, ROOT_Z, PRO_END), root: { at: [0, ROOT_Y + M_HIP[0], ROOT_Z + M_HIP[1]], tilt: M_TILT }, trunk: M_SPINE }, LM0 = landmarksOf(mist0, H);
const MIST_BAR = barOn(LM0, BAR_T);
const mdorsal = (() => { const d = [0, 1, 2].map(i => LM0.backUpper[i] - LM0.chest[i]), L = Math.hypot(...d); return d.map(v => v / L); })();
const mistakePose = { root: mist0.root, trunk: M_SPINE, reach: hands(MIST_BAR, [-ELBOW_OUT, mdorsal[1], mdorsal[2]]) };

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
  measure: { vertex: 'knee.r', from: 'hip.r', to: 'ankle.r', radius: 20, title: 'Knee', value: 'slightly bent' },
  callouts: [
    { key: 'back', text: 'Flat back', anchor: { along: ['backMid', 'sacrum'], t: 0.5 }, cue: 'Keep the back flat, not rounded or arched, from start to finish.' },
    { key: 'knees', text: 'Soft knees', anchor: 'knee.r', cue: 'Keep the knees slightly bent and the hips hinged, not standing tall.' },
    { key: 'bar', text: 'Bar to<br>belly', anchor: 'grip.r', cue: 'Pull the bar to the belly button or low chest, not the neck.' },
  ],
  tempo: [{ phase: 'Pull', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'arc-arrow', center: 'hip.r', r: 100, a0: -26, a1: -50 },
      { kind: 'arrow', from: { at: 'hip.r', pose: 'end', off: [-22, 0] }, to: { at: 'hip.r', pose: 'mistake', off: [-22, 0] } },
    ],
    tells: [
      { key: 'swing', text: 'Torso<br>swings up', anchor: 'backUpper', cue: 'The torso swings up to heave the bar.' },
      { key: 'hips', text: 'Hips throw', anchor: 'buttock', cue: 'The hips and lower back throw the weight up.' },
    ],
  },
  alt: 'Barbell row, side view. Hinged at the hips with a flat back and slightly bent knees, the lifter pulls the bar from straight arms, over the middle of the foot, to the belly button or low chest, driving the elbows back.',
};
