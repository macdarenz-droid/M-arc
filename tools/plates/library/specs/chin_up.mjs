// Chin-up (strict, underhand: palms toward the face), side view, figure faces a wall-mounted bar (screen right). LB1,
// mode H, tier A, hang pose class. Clone source: pull_up (golden A, bc0f378): the same wall-mounted 32 mm bar on its
// bracket, the hang redrawn as hidden lines over the top position, chin trace and bar datum.
// View: side (card plate.view, census view): the hang, the elbows driving down in front of the body, the chin reaching
// the bar and the fault (the legs kick and the body arcs) are all sagittal.
// Source: docs/research/howto/cards/chin_up.json (claude/libht-research). Claims used: c1 (palms toward the face, full
// grip), c2 (hands about shoulder width), c4 (shoulder blades down and back before the arms bend), c5 (elbows straight
// down toward the floor, in front of the body), c6 (body vertical, no swing: the fault is swinging or kipping), c7
// (chin level with the bar, then lower to fully straight arms), c8 (tempo 2-1-2, a drawing convention), c9 (legs
// crossed and still), c18 (free hang, elbows straight, head between the arms), c22 (head in line with the trunk).
// The forearm's turn is not visible from the side; the alt text carries the palms-toward-the-face grip (c1).
// Geometry decisions:
//  - Bar 2.25 m, 32 mm, on pull_up's wall bracket (55 cm off the wall).
//  - Grips +-21 cm: 42 cm apart, a little inside the 45 cm shoulder-joint width (c2: shoulder width or slightly closer).
//  - Start: free hang, elbows straight, head between the arms, trunk vertical under the bar (c18, c22); shoulder blades
//    already set down and back (c4); knees bent 55 with the lower legs crossed behind, the same in every pose (c9).
//  - End: chin level with the bar (c7: 0-4 cm over the bar top, checked); trunk near vertical (pelvis 2 back, trunk 3
//    back: no lean-back, c6); elbows driven down and kept in front of the shoulder (c5, tested).
//  - Mistake (card plate.mistake, c6): the kip. The legs kick forward (hips flexed 60, knees 70) and the body arcs back
//    (pelvis 18 back) to throw the chin over the bar. Two tells, both signs the card's mistake text names: the leg kick
//    (`kip`, = topFault) and the arcing body (`arc`).
// Unsourced numbers (the card gives none): BAR 2.25 m and WALL 0.55 m (pull_up's rig); GX 0.21 m (card: "about
//  shoulder width or slightly closer"); the knee 55 and ankle -20 (card: "legs crossed and still"); the end lean
//  (tilt -2, trunk -3), the end chin 1 cm over the bar top and the elbow pole (card: "level with the bar", "in front
//  of the body"); the Mistake sizes (hip 60, knee 70, tilt -18:
//  illustrative fault size).
import { normPose, resolve, fk, landmarksOf, bodyShapes } from '../engine.mjs';

const H = 1.75;
const BAR = [0, 2.25, 0];          // 32 mm bar centre
const BAR_R = 0.016, BAR_TOP = BAR[1] + BAR_R;
const GX = 0.21;                   // grip centre +-21 cm
const WALL = 0.55;                 // bar 55 cm off the wall (pull_up)

const grip = pole => ({ l: { at: [GX, BAR[1], BAR[2]], pole: [pole[0], pole[1], pole[2]] },
  r: { at: [-GX, BAR[1], BAR[2]], pole: [-pole[0], pole[1], pole[2]] } });
const LEGS = { hip: 0, knee: 55, ankle: -20 };

const START_Y = 1.128, END_POLE = [0.2, -1, 0.05];
export const start = { root: { at: [0, START_Y, -0.02], tilt: 0 }, trunk: 0, neck: 0, scap: { elev: -2, pro: -2 },
  ...LEGS, reach: grip([0.3, 0, 0.5]) };
export const end = { root: { at: [0, 1.65, -0.06], tilt: -2 }, trunk: -3, neck: -10, scap: { elev: -3, pro: -3 },
  ...LEGS, reach: grip(END_POLE) };
export const mistakePose = { root: { at: [0, 1.64, -0.07], tilt: -18 }, trunk: -4, hip: 60, knee: 70, ankle: -20,
  reach: grip([0.2, -1, 0.2]) };

// The hang sits straight under the top position, so the filled end figure hides the start head, trunk and arm.
// Redrawn as hidden lines over the end figure, as pull_up does (copied, not imported).
const STYLE_HANG = 'eq-cable m-line';
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
function hangOutline() {
  const body = { height: H }, probe = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
  const shapesOf = pose => bodyShapes(fk(resolve(normPose(pose, body), body).q, body), probe)
    .map(s => ({ key: s.key, pts: s.key.includes('cap') || s.key.startsWith('fist') ? s.poly : cr(s.poly) }));
  const keep = ['head', 'torso', 'upper.r', 'fore.r', 'fist.r'];
  const hang = shapesOf(start).filter(s => keep.includes(s.key)).map(s => ({ ...s, pts: s.key.startsWith('fist') ? cr(s.pts, 4) : s.pts }));
  const cover = shapesOf(end).map(s => s.pts);
  const items = [];
  for (const s of hang) {
    const isArm = k => /^(upper|fore|fist)\./.test(k);
    const others = hang.filter(o => o !== s && (!isArm(s.key) || isArm(o.key))).map(o => o.pts);
    const vis = s.pts.map(p => !others.some(o => inside(p, o)) && cover.some(c => inside(p, c)));
    const n = s.pts.length, i0 = vis.indexOf(false);
    if (i0 < 0) { items.push([...s.pts, s.pts[0]]); continue; }
    let run = [];
    for (let k = 1; k <= n; k++) { const i = (i0 + k) % n;
      if (vis[i]) run.push(s.pts[i]); else { if (run.length > 2) items.push(run); run = []; } }
    if (run.length > 2) items.push(run);
  }
  return items.map(r => ({ type: 'line', pts: r.map(([x, y]) => [0, -y / 1000, x / 1000]), cls: STYLE_HANG, z: 'front', part: 'hang' }));
}
const HANG = hangOutline();
export const LE = landmarksOf(end, H);

export default {
  id: 'chin_up', name: 'Chin-up', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    { type: 'box', at: [0, BAR[1], WALL / 2], w: WALL, h: 0.035, rc: 1.5 },           // bracket arm to the wall
    { type: 'box', at: [0, BAR[1], WALL + 0.012], w: 0.024, h: 0.26, rc: 1 },         // wall plate
    { type: 'pullupBar', at: BAR, mount: 'ceiling', stub: 0.0001 },                   // the 32 mm bar, end-on
    (lm, ctx) => (ctx.pose === 'end' ? HANG : null),                               // hang head, trunk and arm as hidden lines
  ],
  checks: [
    { landmark: 'chin', above: { point: [0, BAR_TOP, 0], normal: [0, 1, 0] }, pose: 'end' },           // chin level with the bar:
    { landmark: 'chin', above: { point: [0, BAR_TOP + 0.04, 0], normal: [0, -1, 0] }, pose: 'end' },   // 0-4 cm over its top
  ],
  ghosts: { count: 2, parts: ['trunk', 'leg.l', 'leg.r'] },
  trace: { point: 'chin', trim: [18, 8] },
  datum: [{ y: BAR_TOP, from: 20, to: 'chin' }],
  callouts: [
    { key: 'set', text: 'Shoulders set', anchor: 'shoulderTop.r', box: { left: 2, top: 71 }, cue: 'Pull the shoulder blades down and back before the arms bend, and hold them there.' },
    { key: 'elbows', text: 'Elbows in front', anchor: 'elbow.r', box: { left: 196, top: 160 }, cue: 'Drive the elbows straight down toward the floor, kept in front of the body.' },
    { key: 'chin', text: 'Chin to bar', anchor: 'chin', cue: 'Pull until the chin is level with the bar, then lower to fully straight arms.' },
  ],
  tempo: [{ phase: 'Pull', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'arc-arrow', center: 'hip.r', r: 50, a0: 70, a1: 10 },
    ],
    tells: [
      { key: 'kip', text: 'Legs kick', anchor: 'knee.r', cue: 'The legs kick forward to swing the body up.' },
      { key: 'arc', text: 'Body arcs', anchor: { at: 'backUpper', pose: 'mistake' }, box: { left: 10, top: 96 }, cue: 'The body arcs back to throw the chin over the bar.' },
    ],
  },
  alt: 'Chin-up, side view. Palms toward the face, hands about shoulder width. From a straight-arm hang under a bar, the body rises without swinging until the chin is level with the bar, elbows driven down in front of the body.',
};
