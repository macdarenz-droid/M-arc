// Dumbbell biceps curl (standing, both arms, supinated grip), side view, figure facing screen right.
// View: SIDE. What a coach judges is sagittal: the elbow stays pinned at the side (upper arm vertical, no swing
// forward), the forearm sweeps from hanging straight to fully curled, and the trunk stays still (no lean-back swing).
// Form: research card docs/research/howto/cards/dumbbell_biceps_curl.json (verified, claude/libht-research
//  e2a70bc), plate section: start "standing tall, feet shoulder-width, knees slightly
//  bent (c2); arms hanging straight at the sides, palms forward, elbows close to the body (c1, c3); wrists straight
//  (c6); chest up, shoulders down (c8)"; end "elbows fully bent, dumbbells near the front of the shoulders (c3); upper
//  arms still at the sides or slightly forward, never back (c13); wrists straight (c6); body as at the start (c14)".
//  The card gives no end elbow angle in degrees: ELBOW_END is the textbook full curl (see CARD).
// Engine anchor: this is the first spec that uses the `dumbbell` primitive in SIDE view. With a supinated grip the
//  handle runs across the body (world x), so in side view the dumbbell is seen end-on: the primitive's default side
//  axis [1, 0, 0] draws the hex face (11.9 cm across the corners, the reference lateral raise's hex). The far-side
//  dumbbell sits exactly behind the near one (same y, z), so only the near one is drawn.
// Geometry decisions (confirmed by the report `angles` and the scratch clearance probe):
//  Standing tall: feet shoulder width (c2: mid-soles 28 cm apart, outer edges ~38 cm; the lateral foot contact error stays <= 0.4 cm, the
//   engine does not model foot eversion), mid-sole 7.7 cm in front of
//   the ankle so the legs are near vertical and the plumb line runs ear, shoulder, hip, ankle; knees 6 deg soft (c2
//   "slightly bent"): the root height is solved from that knee angle (ROOT_Y).
//  Shoulders: 0 deg flexion in start and end: the upper arm hangs vertical along the torso (elbows pinned).
//  Elbow: 0 deg at the start (arm fully extended), 140 deg at the end (fully curled, forearm 40 deg past vertical,
//   dumbbell in front of the front deltoid). At 140 deg the hex clears the chest outline (see header numbers below).
//  Shoulder rotation 0 (forearm swings in the sagittal plane); wrist 0 (c6 straight); scapulae 1 cm down and 1 cm
//   back (c8 "shoulders down and slightly back"); trunk, pelvis and neck 0 and identical in start and end (c14).
//  Drawn: end pose solid, 3 ghosts of the near arm + dumbbell, trace of the grip (a circular arc about the elbow).
//   Start: the hanging arm and its dumbbell lie wholly over the hip and thigh, so the engine's dashed start layer is
//   hidden under the filled end body. The start forearm is redrawn as dashed hidden lines (the approved pull_up
//   method) and the start dumbbell as a dashed hex outline (barbell_back_squat's start bar dot), both in front, so the
//   bottom of the curl reads. The start upper arm is the end upper arm (shoulder 0 in both), so it is not repeated.
// CARD: end elbow angle (ELBOW_END; card c3 says only "fully bent"), start elbow angle (ELBOW_START; c12 "arms
//  straight again"), shoulder flexion at the top (SHOULDER_FLEX_END; c13 allows "slightly forward"), stance width
//  (FOOT_X, c2), knee bend (KNEE_SOFT, c2), scapula set (SCAP, c8), Mistake elbow drift (MIS_FLEX, MIS_MARGIN; c4 gives none).
// Callouts, Mistake, tempo (card plate section): the 3 checkpoints (c3, c6, c14) are the callouts; the Mistake is the
//  card's plate.mistake (c4, drawable false: the top fault, the bent wrist, cannot be drawn): the elbows drift forward
//  while lifting. One direction is drawn (forward, c4's front-delt case), near the top of the curl: only the arms change
//  (shoulder flexion MIS_FLEX, elbow MIS_ELBOW), body as the end pose. Guides: the faulty arm's dashed outline (masked
//  otherwise), a dashed side line through the shoulder joint and an arrow from the pinned elbow to the drifted one.
//  Tells: elbows forward, the shoulder takes over. A Mistake check proves the elbow sits at least MIS_MARGIN in front of
//  the shoulder plane: the Mistake elbow is 13.0 cm past it, the end pose's would be 10.0 cm short (fails);
//  tempo up 1 s, down 2 s, pause 0 (c9), so there is no Hold, and no Rest phase (the card gives none). Measure: the elbow
//  sweep from the start forearm, value "full range" (c12), no number (the card gives none). The card's plate.tells
//  ("how you know you are doing it right") have no slot on the plate; they belong to the app layer.
// Flags: F2 coverage 0.082 at the reference scale (a standing figure with nothing to frame; zooming past 146.3 px/m
//  would be F1). Left as a flag, not tuned.
import { WINTER, REF, bodyShapes, fk, resolve, normPose } from '../engine.mjs';

const H = 1.75;
const KNEE_SOFT = 6;                             // knees slightly bent (c2)
const FOOT_X = 0.14;                             // mid-sole lateral offset: feet shoulder width (c2)
// HJC height that gives KNEE_SOFT with the ankle under the foot: hip-ankle distance of the bent leg, less the
// sideways part (HJC 8.75 cm off the mid-plane, ankle at FOOT_X), plus the ankle height.
const LEG = (() => { const a = WINTER.thigh * H, b = WINTER.shank * H, k = KNEE_SOFT * Math.PI / 180; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k)); })();
const ROOT_Y = Math.sqrt(LEG * LEG - (FOOT_X - REF.hjcX * H) ** 2) + WINTER.ankleH * H;
const FOOT_Z = REF.mid * H;                      // mid-sole in front of the ankle: legs vertical under the hips
const ELBOW_START = 0;                           // arms fully extended at the bottom
const ELBOW_END = 140;                           // fully curled: forearm 40 deg past vertical
const SHOULDER_FLEX_START = 0, SHOULDER_FLEX_END = 0;   // elbows pinned at the sides: upper arm vertical (c3)
const SCAP = { elev: -1, pro: -1 };              // cm: shoulders set down and slightly back (c8)
const HEX_R = 0.119 / 2;
// Mistake (card plate.mistake, c4): "Elbows drifting forward or back during the curl instead of staying at the sides."
// The card gives no angle, so the drift is drawn only large enough to read at 390 px, well past c13's "slightly forward".
const MIS_FLEX = 45;                             // deg shoulder flexion: the upper arm swings forward off the side
const MIS_MARGIN = 0.10;                         // m: the drifted elbow is at least this far in front of the shoulder plane
const MIS_ELBOW = 120;                           // deg: near the top of the curl, the forearm a little past vertical
const MIS_SIDE = SCAP.pro / 100;                 // z of the shoulder joint (the side line), scapulae 1 cm back

const feet = { l: { at: [FOOT_X, 0, FOOT_Z] }, r: { at: [-FOOT_X, 0, FOOT_Z] } };
const base = { root: { at: [0, ROOT_Y, 0], tilt: 0 }, trunk: 0, neck: 0, scap: SCAP, wrist: 0, plant: feet };
const start = { ...base, shoulder: { flex: SHOULDER_FLEX_START, rot: 0 }, elbow: ELBOW_START };
const end = { ...base, shoulder: { flex: SHOULDER_FLEX_END, rot: 0 }, elbow: ELBOW_END };
const mistakePose = { shoulder: { flex: MIS_FLEX, rot: 0 }, elbow: MIS_ELBOW };   // merged over the end pose: only the arms change
// Dashed start dumbbell (hex face, the primitive's orientation: a corner points screen-right = +z).
const startHex = g => Array.from({ length: 7 }, (_, k) => [g[0], g[1] - HEX_R * Math.sin(k * Math.PI / 3), g[2] + HEX_R * Math.cos(k * Math.PI / 3)]);
// Start forearm as hidden lines (the approved pull_up method): engine body shapes on a 1000 px/m probe camera,
// sampled on the same Catmull-Rom spline the engine draws, kept only where the end figure covers them and outside
// the start upper arm and the start hex, mapped back to world metres for 'line'.
const cr = (ps, k = 8) => {
  const n = ps.length, g = i => ps[(i + n) % n], out = [];
  for (let i = 0; i < n; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let j = 0; j < k; j++) { const t = j / k, u = 1 - t;
      out.push([0, 1].map(d => u * u * u * p1[d] + 3 * u * u * t * c1[d] + 3 * u * t * t * c2[d] + t * t * t * p2[d])); }
  }
  return out;
};
const inside = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
  const [xi, yi] = poly[i], [xj, yj] = poly[j];
  if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
function hiddenForearm() {
  const bd = { height: H }, probe = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
  const skS = fk(resolve(normPose(start, bd), bd).q, bd), skE = fk(resolve(normPose(end, bd), bd).q, bd);
  const shapes = sk => bodyShapes(sk, probe).map(s => ({ key: s.key, pts: s.key.includes('cap') ? s.poly : cr(s.poly) }));
  const S = shapes(skS), fore = S.find(s => s.key === 'fore.r');
  const hex = startHex(skS.G.r).slice(0, 6).map(w => probe.P(w));
  const others = [S.find(s => s.key === 'upper.r').pts, hex], cover = shapes(skE).map(s => s.pts), items = [];
  const vis = fore.pts.map(p => !others.some(o => inside(p, o)) && cover.some(c => inside(p, c)));
  const n = fore.pts.length, i0 = vis.indexOf(false);
  let run = [];
  for (let k = 1; k <= n; k++) { const i = (i0 + k) % n;
    if (vis[i]) run.push(fore.pts[i]); else { if (run.length > 2) items.push(run); run = []; } }
  if (run.length > 2) items.push(run);
  return items.map(r => ({ type: 'line', pts: r.map(([x, y]) => [0, -y / 1000, x / 1000]), cls: 'eq-cable m-line', z: 'front', part: 'startarm' }));
}
const START_FORE = hiddenForearm();
// The faulty arm (Mistake only): the engine masks its outline inside the faulty body, so it is redrawn as Mistake
// guides (dashed outline polylines, not masked), as barbell_overhead_press does: engine body shapes on the probe
// camera, on the engine's spline, mapped back to world metres.
function misArm() {
  const bd = { height: H }, probe = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
  const keys = ['upper.r', 'elbowcap.r', 'fore.r', 'fist.r'];
  return bodyShapes(fk(resolve(normPose({ ...end, ...mistakePose }, bd), bd).q, bd), probe).filter(sh => keys.includes(sh.key))
    .map(sh => (sh.key.includes('cap') ? sh.poly : cr(sh.poly, sh.key.startsWith('fist') ? 4 : 8)).map(([x, y]) => [0, -y / 1000, x / 1000]));
}
const MIS_ARM = misArm();

export default {
  id: 'dumbbell_biceps_curl', name: 'Dumbbell Biceps Curl', view: 'side', facing: 'right',
  camera: { x0: 168, y0: 339 },                  // reference scale; figure + curl arc centred on the plate
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.5, to: 0.62 },
    // near dumbbell, end-on (hex face): moves with the near arm, so it ghosts and dashes with it
    lm => ({ type: 'dumbbell', at: lm['grip.r'], part: 'arm.r' }),
    (lm, ctx) => (ctx.pose === 'end' ? [...START_FORE, { type: 'line', cls: 'eq-cable m-line', pts: startHex(ctx.start['grip.r']), z: 'front', part: 'startdb' }] : null),
  ],
  checks: [
    { landmark: 'heel.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },   // feet flat
    { landmark: 'ball.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    // the elbow stays pinned: on the vertical plane through the shoulder joint (set 1 cm back), start and end
    ...['start', 'end'].map(pose => ({ landmark: 'elbow.r', plane: { point: [0, 0, SCAP.pro / 100], normal: [0, 0, 1] }, pose, tol: 0.5 })),
    // top: the dumbbell centre stays in front of the sternum (hex radius 6 cm + chest line), never inside the chest
    { landmark: 'grip.r', above: { point: [0, 0, 0.072 * H + 0.06], normal: [0, 0, 1] }, pose: 'end' },
    // fault (c4): the elbow drifts forward, at least MIS_MARGIN in front of the shoulder plane (+z = figure forward)
    { landmark: 'elbow.r', above: { point: [0, 0, MIS_SIDE + MIS_MARGIN], normal: [0, 0, 1] }, pose: 'mistake' },
  ],
  startParts: ['arm.r'],
  ghosts: { count: 3, parts: ['arm.r'] },
  trace: { point: 'grip.r', trim: [12, 14] },
  measure: { vertex: 'elbow.r', from: { at: 'grip.r', pose: 'start' }, to: 'grip.r', radius: 20, title: 'Elbow', value: 'full range' },
  callouts: [
    { key: 'elbows', text: 'Elbows<br>at sides', anchor: 'elbow.r', cue: 'Keep the upper arms by your sides, never back, at most slightly forward on top.' },
    { key: 'wrists', text: 'Straight<br>wrists', anchor: 'wrist.r', cue: 'Keep the hand in line with the forearm, not bent up or down.' },
    { key: 'still', text: 'Still<br>body', anchor: 'backUpper', box: { left: 96, top: 108 }, cue: 'Keep the torso and knees still, so only the forearms travel.' },
  ],
  tempo: [{ phase: 'Curl', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['arm.r'],
    guides: [
      ...MIS_ARM.map(pts => ({ kind: 'dashed', pts: [...pts, pts[0]] })),   // the faulty arm, swung forward off the side
      { kind: 'dashed', pts: [[0, 1.42, MIS_SIDE], [0, 0.98, MIS_SIDE]] },   // the side line through the shoulder joint
      { kind: 'arrow', from: { at: 'elbow.r', pose: 'end', off: [3, 0] }, to: { at: 'elbow.r', pose: 'mistake', off: [-6, 2] } },
    ],
    tells: [
      { key: 'elbows', text: 'Elbows<br>forward', anchor: { at: 'elbow.r', pose: 'mistake', off: [0, 7] }, cue: 'Your elbows drift forward off your sides.' },
      { key: 'shoulder', text: 'Shoulder<br>takes over', anchor: { at: 'shoulder.r', pose: 'mistake', off: [8, -2] }, cue: 'The front of your shoulder takes over the lift.' },
    ],
  },
  alt: 'Dumbbell biceps curl, side view. Standing tall with a dumbbell in each hand, palms forward. The elbows stay at the sides while the forearms curl the dumbbells from the thighs up to the front of the shoulders.',
};
