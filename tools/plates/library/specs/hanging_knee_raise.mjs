// Hanging knee raise (overhand, bent knees), side view, facing right. LB1, mode H, tier A, hang pose class.
// View: side (card plate.view, c6): the knee height against the hips, the pelvis curl and the swing are all sagittal.
// Source: docs/research/howto/cards/hanging_knee_raise.json (claude/libht-research). Claims used: c1 (feet clear the
// floor), c2 (overhand, arms fully straight), c4 (each rep from a still hang, no swing; the Mistake: swinging to kick
// the legs up), c5 (knees above hip height, brief hold), c6 (the pelvis rolls back, the low back rounds a little),
// c8 (lower with control), c9 (tempo 1-1-2, a drawing convention).
// Clone source: hanging_leg_raise (golden A, bc0f378), copied (never imported): the bar, the grip, the balance solver
// (hang(): every correct pose has its Winter centre of mass on the bar's vertical) and the curl arc. Parent fields that
// are false for this child (DESIGN.md 2): straight legs (c5: knees bent), the "Legs straight" callout, the "Knees
// only" tell (the child's correct pose), the hip measure, and the parent's tempo.
// Geometry decisions:
//  - Start: still dead hang, legs straight down (c4), toes relaxed.
//  - End: knees bent 100 deg and lifted past hip height (knee 22.7 cm above the hip joint, thigh 32 deg past
//    horizontal, c5), pelvis tucked 22 deg back with the lumbar curled 14 deg (c6), centre of mass on the bar line (c4).
//  - Mistake (card plate.mistake, c4): the swing. The centre of mass is swung 20 cm behind the bar line, the back arched
//    (trunk -12, no pelvis curl) and the legs flung forward and up (hip 115, knee 60). Tells: 'swing' (the body
//    swings) and 'kick' (the legs kicked up, anchored at the red ankle, outside the solid figure), both visible signs of
//    the card's one fault ("the body swings to help kick the legs up").
//  - A datum line at hip height runs to the end knee, so "knees above hips" reads against it.
// Unsourced numbers: A1 end angles (tilt -22, trunk 14, neck 10, hip 100, knee 100: the card gives "above hip height"
//  and "rounds a little", no angles), SWING_OFF 0.20 m and the Mistake angles (tilt 0, trunk -12, neck -5, hip 115,
//  knee 60: illustrative fault size), BAR 2.25 m and GRIP_X 0.24 m (as the parent; the card gives no bar height or grip
//  width), ankle -25 (relaxed toes), label boxes.
import { landmarksOf, normPose, resolve, fk, bodyShapes } from '../engine.mjs';

const H = 1.75;
const BAR = [0, 2.25, 0];                     // 32 mm bar, 2.25 m, ceiling mount (as the parent)
const GRIP_X = 0.24;                          // overhand grip, hands 48 cm apart (as the parent)
const ARM = (0.186 + 0.146 + 0.46 * 0.108) * H;   // glenohumeral centre to grip centre, arm straight
const hands = { l: { at: [GRIP_X, BAR[1], BAR[2]], pole: [0.5, 0, -1] }, r: { at: [-GRIP_X, BAR[1], BAR[2]], pole: [-0.5, 0, -1] } };

// Winter (2009) segment masses and centre-of-mass positions (copied from hanging_leg_raise).
const mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
function comZ(lm) {
  let m = 0, z = 0;
  const seg = (w, p) => { m += w; z += w * p[2]; };
  seg(0.081, lm.ear);
  seg(0.497, mid(lm.shoulders, lm.hips, 0.5));
  for (const s of ['l', 'r']) {
    seg(0.028, mid(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436));
    seg(0.016, mid(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430));
    seg(0.006, lm[`grip.${s}`]);
    seg(0.100, mid(lm[`hip.${s}`], lm[`knee.${s}`], 0.433));
    seg(0.0465, mid(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433));
    seg(0.0145, mid(lm[`heel.${s}`], lm[`toe.${s}`], 0.5));
  }
  return z / m;
}

// Place the body so the arms are straight to the bar and the centre of mass sits `off` m in front of it (copied).
function hang(angles, off = 0) {
  let root = [0, BAR[1] - 1.14, -0.02];
  for (let i = 0; i < 40; i++) {
    const pose = { ...angles, root: { at: root, tilt: angles.tilt }, reach: hands };
    const lm = landmarksOf(pose, H);
    const dz = BAR[2] + off - comZ(lm);
    const sh = lm['shoulder.r'], lat = GRIP_X - Math.abs(sh[0]);
    const need = Math.sqrt((ARM * 0.998) ** 2 - lat ** 2);
    const sz = sh[2] + dz, dy = Math.sqrt(Math.max(0, need ** 2 - (BAR[2] - sz) ** 2));
    root = [0, root[1] + (BAR[1] - dy - sh[1]), root[2] + dz];
  }
  const { tilt, ...rest } = angles;
  return { ...rest, root: { at: root.map(v => +v.toFixed(4)), tilt }, reach: hands };
}

export const A0 = { tilt: 0, trunk: 0, neck: 0, hip: 0, knee: 0, ankle: -25 };
export const A1 = { tilt: -22, trunk: 14, neck: 10, hip: 100, knee: 100, ankle: -25 };
// Posterior pelvic tilt on the correct plate (with the 'curl' callout): the parent's arc under the pelvis.
const CURL = (() => {
  const r = 32, p = a => ({ at: 'hip.r', off: [r * Math.cos(a * Math.PI / 180), r * Math.sin(a * Math.PI / 180)] });
  const arc = Array.from({ length: 10 }, (_, k) => p(158 - 88 * k / 9));
  const tip = arc[9].off, tan = [Math.sin(70 * Math.PI / 180), -Math.cos(70 * Math.PI / 180)], n = [-tan[1], tan[0]];
  const wing = s => ({ at: 'hip.r', off: [tip[0] - tan[0] * 6 + s * n[0] * 4, tip[1] - tan[1] * 6 + s * n[1] * 4] });
  return [...arc, wing(1), arc[9], wing(-1)];
})();
const lerpA = t => Object.fromEntries(Object.keys(A0).map(k => [k, A0[k] + (A1[k] - A0[k]) * t]));
export const start = hang(A0), end = hang(A1);
const via = [hang(lerpA(1 / 3)), hang(lerpA(2 / 3))];
export const SWING_OFF = -0.20;
export const MISTAKE = hang({ tilt: 0, trunk: -12, neck: -5, hip: 115, knee: 60, ankle: -25 }, SWING_OFF);

// The swung-back body's arms cross its neck and chest; the hidden head and trunk outline is redrawn as hidden lines
// (copied from hanging_leg_raise).
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
function hiddenTrunk(pose) {
  const body = { height: H }, probe = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
  const shapes = bodyShapes(fk(resolve(normPose(pose, body), body).q, body), probe)
    .map(s => ({ key: s.key, pts: s.key.includes('cap') || s.key.startsWith('fist') ? s.poly : cr(s.poly) }));
  const isArm = k => /^(shcap|upper|elbowcap|fore|fist)\./.test(k);
  const arms = shapes.filter(s => isArm(s.key)).map(s => s.pts), trunk = shapes.filter(s => s.key === 'head' || s.key === 'torso');
  const runs = [];
  for (const s of trunk) {
    const other = trunk.filter(o => o !== s).map(o => o.pts);
    const vis = s.pts.map(p => arms.some(a => inside(p, a)) && !other.some(o => inside(p, o)));
    const n = s.pts.length, i0 = vis.indexOf(false);
    let run = [];
    for (let k = 1; k <= n; k++) { const i = (i0 + k) % n;
      if (vis[i]) run.push(s.pts[i]); else { if (run.length > 2) runs.push(run); run = []; } }
    if (run.length > 2) runs.push(run);
  }
  return runs.map(r => ({ kind: 'dashed', pts: r.map(([x, y]) => [0, -y / 1000, x / 1000]) }));
}
const MISTAKE_HIDDEN = hiddenTrunk(MISTAKE);

export { comZ, BAR };

export default {
  id: 'hanging_knee_raise', name: 'Hanging Knee Raise', view: 'side', facing: 'right',
  camera: { fit: { left: 14, right: 14, top: 22, bottom: 12 } },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.75, to: 1.15 },
    { type: 'pullupBar', at: BAR, stub: 0.25, mount: 'ceiling', z: 'back' },
    { type: 'line', pts: [[0, BAR[1] + 0.25, -0.20], [0, BAR[1] + 0.25, 0.20]] },            // ceiling the post hangs from
    { type: 'line', cls: 'eq-solid', z: 'front', pts: Array.from({ length: 25 }, (_, k) => [0, BAR[1] + 0.016 * Math.sin(k * Math.PI / 12), BAR[2] + 0.016 * Math.cos(k * Math.PI / 12)]) },
  ],
  checks: [
    { landmark: 'grip.r', at: hands.r.at, pose: 'all', tol: 0.5 },
    { landmark: 'grip.l', at: hands.l.at, pose: 'all', tol: 0.5 },
    { landmark: 'toe.r', above: { point: [0, 0.05, 0], normal: [0, 1, 0] }, pose: 'all' },   // feet clear of the floor (c1)
  ],
  ghosts: { count: 3, parts: ['leg.r', 'trunk'] },
  trace: { point: 'knee.r', trim: [10, 12] },
  datum: [{ y: 'hip.r', from: 'hip.r', to: 'knee.r' }],
  callouts: [
    { key: 'still', text: 'Still start', anchor: { at: 'knee.r', pose: 'start' }, box: { left: 50, top: 240 }, cue: 'Start every rep from a still hang, with no swing.' },
    { key: 'knees', text: 'Knees<br>above hips', anchor: 'knee.r', box: { left: 170, top: 112 }, cue: 'Lift the knees past hip height and hold a moment.' },
    { key: 'curl', text: 'Pelvis<br>curls up', anchor: 'sacrum', box: { left: 10, top: 170 }, guide: CURL, cue: 'At the top, roll the hips up toward the ribs, low back rounding a little.' },
  ],
  tempo: [{ phase: 'Lift', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: MISTAKE,
    guides: [
      { kind: 'arc-arrow', center: 'grips', r: 100, a0: 118, a1: 140 },
      ...MISTAKE_HIDDEN,
    ],
    tells: [
      { key: 'swing', text: 'Body<br>swings', anchor: { at: 'grips', off: [-70, 71] }, cue: 'The body swings to help the legs up.' },
      { key: 'kick', text: 'Legs<br>kicked up', anchor: 'ankle.r', cue: 'The swing kicks the knees up, not the abs.' },
    ],
  },
  alt: 'Hanging knee raise, side view. Hanging from a bar with straight arms and an overhand grip. From a still hang, the bent knees rise above hip height while the pelvis curls up, the body not swinging.',
};
