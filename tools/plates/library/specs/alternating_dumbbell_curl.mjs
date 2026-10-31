// Alternating dumbbell curl (standing split stance, supinated grip, one arm at a time), side view, figure faces screen
// right. H row (D-LIB15R2-MODES; lb5/DESIGN.md 17.4, 17.6): the split stance (c3) and the one-arm curl with the other arm
// still (c1) lie outside PARAMS.
// Clone source (D-LIB9-CLONE, copied never imported): dumbbell_biceps_curl (pilot A, pinned): its near arm, poses,
// hidden start forearm, faulty-arm guides and Mistake builder; bayesian_cable_curl's split stance (STEP, feet, ROOT;
// D-LIB15-SPLIT, its sheet waits for reverse_lunge: D-LIB15R2-SPLIT).
// Form: research card docs/research/howto/cards/alternating_dumbbell_curl.json (research a48b0594), plate section: start
//  "Standing tall, split stance, torso braced, shoulders down (c3); both arms hanging straight, palms forward (c2);
//  wrists straight (c7)"; end "Working elbow fully bent with the dumbbell near the front of the shoulder (c12), upper
//  arm still by the side (c5); resting arm hanging straight in the start position (c1); torso upright and still".
//  The card's c3 second quote names a neutral grip (ACE's hammer page); the plate draws c2's palms forward (DESIGN 17.8).
// Geometry decisions:
//  - Split stance: the far (left) foot STEP ahead of the near (right) foot, both flat, torso upright.
//  - The near (right) arm curls as dumbbell_biceps_curl's; the far (left) arm hangs straight in both poses and in the
//    Mistake (c1), its dumbbell end-on at the thigh behind the body.
//  - Mistake (c5, c4): the working elbow swings forward, dumbbell_biceps_curl's builder on the near arm only.
// Drawn differences from dumbbell_biceps_curl (LB5 A15 rules): no elbow measure arc (its label leader would cross the
//  Trace within 6 px) and no Mistake arrow (from the end elbow it would sit on the solid end figure); the dashed faulty
//  arm and the tells show the fault.
// Unsourced numbers (13.3 must-fix 14): STEP and ROOT (bayesian_cable_curl's), ELBOW_END, the dumbbells (the
//  parent's hex), every Mistake magnitude (dumbbell_biceps_curl's; drawn).
// Callouts, Mistake, tempo: checkpoints c1, c5, c7 are the callouts; plate.mistake c5/c4, drawable false: the top
//  fault, the wrist bending (c7), cannot be seen side-on, so the plate draws the next fault (F7, D-LIB15R2-F7); tempo
//  up 1, down 2, pause 0 (c10): Curl 1, Lower 2.
import { bodyShapes, fk, resolve, normPose } from '../engine.mjs';

const H = 1.75;
const STEP = 0.45;                               // far foot ahead of the near foot (c3; bayesian_cable_curl's split stance)
const ROOT = [0, 0.87, 0.0];                     // hip-joint midpoint over the split stance (bayesian_cable_curl's)
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

const feet = { l: { at: [0.10, 0, STEP / 2 + 0.03] }, r: { at: [-0.10, 0, -STEP / 2 + 0.03] } };
const base = { root: { at: ROOT, tilt: 0 }, trunk: 0, neck: 0, scap: SCAP, wrist: 0, plant: feet };
const REST = { flex: 0, rot: 0 };                // the far arm: hanging straight in the start position (c1)
const start = { ...base, shoulder: { l: REST, r: { flex: SHOULDER_FLEX_START, rot: 0 } }, elbow: { l: ELBOW_START, r: ELBOW_START } };
const end = { ...base, shoulder: { l: REST, r: { flex: SHOULDER_FLEX_END, rot: 0 } }, elbow: { l: ELBOW_START, r: ELBOW_END } };
const mistakePose = { shoulder: { l: REST, r: { flex: MIS_FLEX, rot: 0 } }, elbow: { l: ELBOW_START, r: MIS_ELBOW } };   // over the end pose: only the near arm changes
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
const START_WRIST_L = fk(resolve(normPose(start, { height: H }), { height: H }).q, { height: H }).W.l;

export default {
  id: 'alternating_dumbbell_curl', name: 'Alternating Dumbbell Curl', view: 'side', facing: 'right',
  camera: { x0: 168, y0: 339 },                  // reference scale; figure + curl arc centred on the plate
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.5, to: 0.62 },
    // near dumbbell, end-on (hex face): moves with the near arm, so it ghosts and dashes with it
    lm => ({ type: 'dumbbell', at: lm['grip.l'], z: 'back' }),   // far dumbbell: hanging at the thigh, still (c1)
    lm => ({ type: 'dumbbell', at: lm['grip.r'], part: 'arm.r' }),
    (lm, ctx) => (ctx.pose === 'end' ? [{ type: 'line', cls: 'eq-cable m-line', pts: startHex(ctx.start['grip.r']), z: 'front', part: 'startdb' }] : null),
  ],
  checks: [
    ...['heel.r', 'ball.r', 'heel.l', 'ball.l'].map(landmark => ({ landmark, plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 })),   // both feet flat
    // the far arm stays in the start position (c1): its wrist where it starts, in every pose
    ...['end', 'mistake'].map(pose => ({ landmark: 'wrist.l', at: START_WRIST_L, pose, tol: 0.5 })),
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
  callouts: [
    { key: 'other', text: 'Other arm<br>still', anchor: 'wrist.l', cue: 'Keep the resting arm hanging in the start position.' },
    { key: 'elbows', text: 'Elbows<br>at sides', anchor: 'elbow.r', cue: 'Keep the working upper arm close to the torso, not forward or back.' },
    { key: 'wrists', text: 'Straight<br>wrists', anchor: 'wrist.r', cue: 'Keep the hand in line with the forearm, not bent up or down.' },
  ],
  tempo: [{ phase: 'Curl', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['arm.r'],
    guides: [
      ...MIS_ARM.map(pts => ({ kind: 'dashed', pts: [...pts, pts[0]] })),   // the faulty arm, swung forward off the side
      { kind: 'dashed', pts: [[0, 1.42, MIS_SIDE], [0, 0.98, MIS_SIDE]] },   // the side line through the shoulder joint
    ],
    tells: [
      { key: 'elbows', text: 'Elbow<br>swings', anchor: { at: 'elbow.r', pose: 'mistake', off: [0, 7] }, cue: 'Your working elbow swings forward off your side.' },
    ],
  },
  pilot: { drawableFault: 'top fault: the wrist bending (c7) cannot be seen side-on; drawn: the next fault, the working elbow swinging forward (c5, c4)' },
  alt: 'Alternating dumbbell curl, side view. Standing in a split stance with a dumbbell in each hand, palms forward. One arm curls its dumbbell up to the front of the shoulder, elbow by the side, while the other arm hangs still.',
};
