// Hammer curl (standing split stance, neutral grip, both arms), side view, figure faces screen right. H row
// (D-LIB15R2-MODES; lb5/DESIGN.md 17.4, 17.6): the split stance (c2) and the neutral grip (c1, c5) lie outside PARAMS.
// Clone source (D-LIB9-CLONE, copied never imported): dumbbell_biceps_curl (pilot A, pinned): its arms, poses, hidden
// start forearm, faulty-arm guides and Mistake builder; bayesian_cable_curl's split stance (STEP, feet, ROOT; D-LIB15-
// SPLIT, its sheet waits for reverse_lunge: D-LIB15R2-SPLIT); the side-on dumbbell (vendor `dumbbell` with an `axis`, as
// dumbbell_overhead_triceps_extension).
// Form: research card docs/research/howto/cards/hammer_curl.json (research a48b0594), plate section: start "Split stance,
//  torso braced, shoulders down and back, head in line (c2); dumbbells alongside the thighs, palms facing the body,
//  elbows straight (c1)"; end "Elbows bent, dumbbells near the front of the shoulders (c3); elbows not forward, torso
//  upright, wrists straight (c4); grip still neutral (c5)".
// Geometry decisions:
//  - Split stance: the far (left) foot STEP ahead of the near (right) foot, both flat, torso upright (c2, c4).
//  - Neutral grip (c1, c5): palms face the body, so the handle runs front to back, perpendicular to the forearm in the
//    sagittal plane, and the dumbbell shows side-on (its heads and handle). It turns with the forearm.
//  - The elbow, the curl and the Mistake are dumbbell_biceps_curl's (ELBOW_END 140, MIS_FLEX 45, MIS_ELBOW 120): c6 and
//    c4 name the same fault, the elbows moving forward.
// Drawn differences from dumbbell_biceps_curl (LB5 A15 rules): no elbow measure arc (its label leader would cross the
//  Trace within 6 px) and no Mistake arrow (from the end elbow it would sit on the solid end figure); the dashed faulty
//  arm and the tells show the fault.
// Unsourced numbers (13.3 must-fix 14): STEP and ROOT (bayesian_cable_curl's), the dumbbell (the vendor default; the
//  dashed start outline at its sizes), ELBOW_END, every Mistake magnitude (dumbbell_biceps_curl's; drawn).
// Callouts, Mistake, tempo: checkpoints c5, c4, c4 are the callouts; plate.mistake c6/c4, drawable true; tempo up 1,
//  down 2, pause 0 (c12): Curl 1, Lower 2.
import { bodyShapes, fk, resolve, normPose } from '../engine.mjs';

const H = 1.75;
const STEP = 0.45;                               // far foot ahead of the near foot (c2; bayesian_cable_curl's split stance)
const ROOT = [0, 0.87, 0.0];                     // hip-joint midpoint over the split stance (bayesian_cable_curl's)
const ELBOW_START = 0;                           // arms fully extended at the bottom
const ELBOW_END = 140;                           // fully curled: forearm 40 deg past vertical
const SHOULDER_FLEX_START = 0, SHOULDER_FLEX_END = 0;   // elbows pinned at the sides: upper arm vertical (c3)
const SCAP = { elev: -1, pro: -1 };              // cm: shoulders set down and slightly back (c8)
// Mistake (card plate.mistake, c4): "Elbows drifting forward or back during the curl instead of staying at the sides."
// The card gives no angle, so the drift is drawn only large enough to read at 390 px, well past c13's "slightly forward".
const MIS_FLEX = 45;                             // deg shoulder flexion: the upper arm swings forward off the side
const MIS_MARGIN = 0.10;                         // m: the drifted elbow is at least this far in front of the shoulder plane
const MIS_ELBOW = 120;                           // deg: near the top of the curl, the forearm a little past vertical
const MIS_SIDE = SCAP.pro / 100;                 // z of the shoulder joint (the side line), scapulae 1 cm back

const feet = { l: { at: [0.10, 0, STEP / 2 + 0.03] }, r: { at: [-0.10, 0, -STEP / 2 + 0.03] } };
const base = { root: { at: ROOT, tilt: 0 }, trunk: 0, neck: 0, scap: SCAP, wrist: 0, plant: feet };
const start = { ...base, shoulder: { flex: SHOULDER_FLEX_START, rot: 0 }, elbow: ELBOW_START };
const end = { ...base, shoulder: { flex: SHOULDER_FLEX_END, rot: 0 }, elbow: ELBOW_END };
const mistakePose = { shoulder: { flex: MIS_FLEX, rot: 0 }, elbow: MIS_ELBOW };   // merged over the end pose: only the arms change
// The handle direction: perpendicular to the forearm in the sagittal plane (neutral grip, palms toward the body).
const handleDir = (g, e) => { const f = [0, g[1] - e[1], g[2] - e[2]], n = Math.hypot(f[1], f[2]); return [0, -f[2] / n, f[1] / n]; };
// Dashed start dumbbell, side-on (the vendor default sizes: handle 13 cm x 1.6 cm, heads 7 cm long, 10.3 cm across).
const startDb = (g, e) => {
  const u = handleDir(g, e), v = [0, -u[2], u[1]], P = (a, b) => [0, g[1] + u[1] * a + v[1] * b, g[2] + u[2] * a + v[2] * b];
  const rect = (a0, a1, h) => [P(a0, -h / 2), P(a1, -h / 2), P(a1, h / 2), P(a0, h / 2), P(a0, -h / 2)];
  return [rect(-0.065, 0.065, 0.016), rect(-0.135, -0.065, 0.103), rect(0.065, 0.135, 0.103)];
};
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
  const dbs = startDb(skS.G.r, skS.E.r).map(r => r.slice(0, 4).map(w => probe.P(w)));
  const others = [S.find(s => s.key === 'upper.r').pts, ...dbs], cover = shapes(skE).map(s => s.pts), items = [];
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
  id: 'hammer_curl', name: 'Hammer Curl', view: 'side', facing: 'right',
  camera: { x0: 168, y0: 339 },                  // reference scale; figure + curl arc centred on the plate
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.5, to: 0.62 },
    // near dumbbell, end-on (hex face): moves with the near arm, so it ghosts and dashes with it
    lm => ({ type: 'dumbbell', at: lm['grip.r'], axis: handleDir(lm['grip.r'], lm['elbow.r']), part: 'arm.r' }),   // side-on (c1, c5)
    (lm, ctx) => (ctx.pose === 'end' ? [...START_FORE, ...startDb(ctx.start['grip.r'], ctx.start['elbow.r']).map(pts => ({ type: 'line', cls: 'eq-cable m-line', pts, z: 'front', part: 'startdb' }))] : null),
  ],
  checks: [
    ...['heel.r', 'ball.r', 'heel.l', 'ball.l'].map(landmark => ({ landmark, plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 })),   // both feet flat (c2)
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
    { key: 'grip', text: 'Neutral<br>grip', anchor: 'grip.r', cue: 'Keep the palms facing your body from bottom to top. No wrist twist.' },
    { key: 'elbows', text: 'Elbows<br>still', anchor: 'elbow.r', box: { left: 90, top: 160 }, cue: 'Keep the elbows by your body. Do not move them forward.' },
    { key: 'torso', text: 'Upright<br>torso', anchor: 'backUpper', box: { left: 86, top: 108 }, cue: 'Stand tall with the lower back not arched and the shoulders not shrugged.' },
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
      { key: 'elbows', text: 'Elbows<br>forward', anchor: { at: 'elbow.r', pose: 'mistake', off: [0, 7] }, cue: 'Your elbows move forward as the dumbbells come up.' },
      { key: 'shoulder', text: 'Shoulder<br>takes over', anchor: { at: 'shoulder.r', pose: 'mistake', off: [8, -2] }, cue: 'The front of your shoulder takes the load instead of the biceps.' },
    ],
  },
  alt: 'Hammer curl, side view. Standing in a split stance with a dumbbell in each hand, palms facing the body. The elbows stay by the body while the forearms curl the dumbbells from the thighs up to the front of the shoulders.',
};
