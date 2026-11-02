// Cable shrug, side view, figure facing screen right. LIB-13s wave 2 (mode H, D-LIB13S-MODES: SHRUG is not built).
// Clone source (D-LIB9-CLONE, copied, never imported): barbell_shrug's bytes as approved in panel mx16 @ 01b66192: the
//  standing body, the 5 cm shrug, the straight-arm bar solve 15 mm in front of the body (D-LIB13S-CLEAR), the hidden
//  start shoulders, the hand capsule, the Mistake (bent arms pulling the bar M_PULL higher) and the zoom.
// Sources: research card docs/research/howto/cards/cable_shrug.json (research a48b0594):
//  c1  a straight bar on a low pulley, hands about shoulder width or slightly wider, palms down (grip; the start hand
//      contacts, plateFacts wrist.l and wrist.r);
//  c2  stand close to the pulley with the arms extended in front holding the bar (start pose);
//  c3  elevate the shoulders as high as possible and hold the top for a second (checkpoint "Hold the top");
//  c4  stand up straight, head up, eyes forward (checkpoint "Stand straight");
//  c5  do not lift the bar with the biceps; only the shoulders move (checkpoint "Straight arms"; the Mistake);
//  c7, c16  tempo: about 1 s up, a 1 s hold at the top, 2 s down, the lowering slow.
// Geometry decisions: the parent's (barbell_shrug.mjs header) for the body, shrug, bar and Mistake, unchanged. Then:
//  Column (c1, c2): the vendor cableColumn ahead of the lifter, its low pulley PULLEY_R 4.5 cm with the centre 16 cm up
//   (top 0.205 m, cable_curl's lowest position) and PULLEY_GAP ahead of the toe tip ("Stand close to the pulley"); the
//   cable runs from the pulley to the bar's centre, the stack lifting with the bar. The barbell's end-on plates are gone:
//   the bar is the attachment's 28 mm shaft end-on.
//  Labels: boxed on the left, above the zoom; the parent's elbow measure is left off (the column fills the right).
// Unsourced numbers: SHRUG, KNEE_SOFT, FOOT_X, M_PULL, BAR_GAP (the parent's), PULLEY_GAP, the pulley height and size,
//  the column (the vendor cableColumn's defaults).
import { WINTER, REF, landmarksOf, bodyShapes, fk, resolve, normPose } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.10;                                   // mid-sole lateral offset: feet hip width
const KNEE_SOFT = 5;                                   // deg: knees slightly flexed
const GRIP_X = 0.25;                                   // hand centre lateral offset: slightly wider than shoulder width
const SHRUG = 5;                                       // cm shoulder-girdle elevation at the top (CARD)
const BAR_R = 0.014, BAR_GAP = 0.015;                  // 28 mm shaft; bar surface 15 mm off the drawn body front (2 px, D-LIB13S-CLEAR)
const ARM = (WINTER.upperArm + WINTER.forearm + REF.gripOff) * H - 0.0001;  // arms straight (elbow 2 deg)

const FOOT_Z = REF.mid * H;
const LEG = (() => { const a = WINTER.thigh * H, b = WINTER.shank * H, k = KNEE_SOFT * R; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k)); })();
const ROOT_Y = Math.sqrt(LEG * LEG - (FOOT_X - REF.hjcX * H) ** 2) + WINTER.ankleH * H;
const feet = { l: { at: [FOOT_X, 0, FOOT_Z] }, r: { at: [-FOOT_X, 0, FOOT_Z] } };
const base = { root: { at: [0, ROOT_Y, 0], tilt: 0 }, trunk: 0, neck: 0, plant: feet };

// Drawn-shape helpers (engine body shapes on a 1000 px/m probe camera, the same Catmull-Rom spline it draws).
const bd = { height: H }, probe = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
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
const shapesOf = pose => bodyShapes(fk(resolve(normPose(pose, bd), bd).q, bd), probe)
  .map(s => ({ key: s.key, pts: s.key.includes('cap') ? s.poly : cr(s.poly) }));
// Front (max z) of the drawn body at height y (m): both thighs and the torso (LIB-13s D-LIB13S-CLEAR; the near thigh
// alone let the Mistake bar sit inside the belly).
const FRONT_KEYS = ['thigh.r', 'thigh.l', 'torso'];
function bodyFront(pose, y) {
  const py = -y * 1000;
  let z = -Infinity;
  for (const th of shapesOf(pose).filter(s => FRONT_KEYS.includes(s.key)).map(s => s.pts))
    th.forEach((a, i) => { const b = th[(i + 1) % th.length];
      if ((a[1] - py) * (b[1] - py) <= 0 && a[1] !== b[1]) z = Math.max(z, a[0] + (b[0] - a[0]) * (py - a[1]) / (b[1] - a[1])); });
  return z / 1000;
}
// Key pose for a shrug height: bar on the thighs, arms straight (fixed point: bar height depends on its z).
function key(elev) {
  const p = { ...base, scap: { elev, pro: 0 } }, S = landmarksOf(p, H)['shoulder.r'], dx = GRIP_X - Math.abs(S[0]);
  let z = 0.10, y = 0;
  for (let i = 0; i < 6; i++) { y = S[1] - Math.sqrt(ARM * ARM - dx * dx - (z - S[2]) ** 2); z = bodyFront(p, y) + BAR_R + BAR_GAP; }
  y = S[1] - Math.sqrt(ARM * ARM - dx * dx - (z - S[2]) ** 2);
  const pole = s => [s * 0.3, 0, -1];
  return { ...p, reach: { l: { at: [GRIP_X, y, z], pole: pole(1) }, r: { at: [-GRIP_X, y, z], pole: pole(-1) } } };
}
const start = key(0);
const end = key(SHRUG);
// The drawn start wrists (engine IK), for the card's c1 hand contacts (LIB-13s CARD FIELDS FIX: the grip quote states the start).
const START_W = (() => { const bd = { height: H }, sk = fk(resolve(normPose(start, bd), bd).q, bd); return { 'wrist.r': sk.W.r, 'wrist.l': sk.W.l }; })();
const barOf = pose => [0, pose.reach.r.at[1], pose.reach.r.at[2]];
// Start bar dot, dashed (engine limit: the start layer never draws moving equipment; barbell_back_squat's workaround).
// The bar end-on is the 28 mm shaft inside the fist (as golden lat_pulldown), not the 50 mm sleeve: at this 1.7x zoom a
// sleeve ring filled the fist, so the fist read as the bar and the hand as stopping short of it (critic run 2, R3).
const B0 = barOf(start), START_DOT = Array.from({ length: 17 }, (_, k) => [0, B0[1] + BAR_R * Math.sin(k * Math.PI / 8), B0[2] + BAR_R * Math.cos(k * Math.PI / 8)]);

// Start neck / trapezius / shoulder contour as hidden lines: the start torso outline where it lies inside the end
// figure and more than 1.5 mm from the end torso outline (i.e. only where the two differ: the shoulders).
const inside = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
  const [xi, yi] = poly[i], [xj, yj] = poly[j];
  if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
const distTo = (p, poly) => Math.min(...poly.map(q => Math.hypot(p[0] - q[0], p[1] - q[1])));
function hiddenShoulders() {
  const S = shapesOf(start).find(s => s.key === 'torso').pts, E = shapesOf(end), Et = E.find(s => s.key === 'torso').pts;
  const cover = E.map(s => s.pts), items = [];
  const vis = S.map(p => cover.some(c => inside(p, c)) && distTo(p, Et) > 1.5);
  const n = S.length, i0 = vis.indexOf(false);
  let run = [];
  for (let k = 1; k <= n; k++) { const i = (i0 + k) % n;
    if (vis[i]) run.push(S[i]); else { if (run.length > 2) items.push(run); run = []; } }
  if (run.length > 2) items.push(run);
  return items.map(r => ({ type: 'line', pts: r.map(([x, y]) => [0, -y / 1000, x / 1000]), cls: 'eq-cable m-line', z: 'front', part: 'startshoulders' }));
}
const START_SHOULDERS = hiddenShoulders();

// Mistake (card plate.mistake, c4): elbows bend to pull the bar M_PULL higher up the thighs (bar kept on the thigh).
const M_PULL = 0.15;                                   // m, illustrative: the card gives no number
const mistakePose = (() => {
  const p = { ...end }, y = end.reach.r.at[1] + M_PULL, z = bodyFront(p, y) + BAR_R + BAR_GAP, pole = s => [s * 0.3, 0, -1];
  return { reach: { l: { at: [GRIP_X, y, z], pole: pole(1) }, r: { at: [-GRIP_X, y, z], pole: pole(-1) } } };
})();

const HAND_R = 0.035, WRIST_R = 0.018;                // hand capsule radii at the bar and at the wrist (m)
const M_G = mistakePose.reach.r.at;
const M_RING = r => Array.from({ length: 25 }, (_, k) => [M_G[0], M_G[1] + r * Math.sin(k * Math.PI / 12), M_G[2] + r * Math.cos(k * Math.PI / 12)]);
// where the ghost forearm meets the ring: the ring edge on the wrist side
const M_W = landmarksOf({ ...end, ...mistakePose }, H)['wrist.r'];
const M_EDGE = (() => { const d = [0, M_W[1] - M_G[1], M_W[2] - M_G[2]], L = Math.hypot(...d); return [M_G[0], M_G[1] + d[1] / L * HAND_R, M_G[2] + d[2] / L * HAND_R]; })();
const CAMERA = { x0: 176, y0: 339 };                   // reference scale (146.29 px/m): whole figure, feet on the floor line
// Closed hand (R3): the engine draws the fist as a circle on the grip centre, 8.7 cm past the wrist, so a gap opens
// between the forearm tip and the fist. A filled capsule from the wrist to the grip (fist radius 3.5 cm at the bar,
// forearm tip 1.8 cm at the wrist) closes the hand around the 28 mm shaft; the shaft is drawn on top of it.
function handPoly(lm) {
  const W = lm['wrist.r'], G = lm['grip.r'], d = [G[1] - W[1], G[2] - W[2]], L = Math.hypot(...d), u = [d[0] / L, d[1] / L], n = [-u[1], u[0]], pts = [];
  for (let a = -90; a <= 90; a += 30) pts.push([G[0], G[1] + HAND_R * (Math.cos(a * R) * u[0] + Math.sin(a * R) * n[0]), G[2] + HAND_R * (Math.cos(a * R) * u[1] + Math.sin(a * R) * n[1])]);
  for (let a = 90; a <= 270; a += 45) pts.push([G[0], W[1] + WRIST_R * (Math.cos(a * R) * u[0] + Math.sin(a * R) * n[0]), W[2] + WRIST_R * (Math.cos(a * R) * u[1] + Math.sin(a * R) * n[1])]);
  return { type: 'poly', pts, curve: true, cls: 'eq-solid', z: 'front', part: 'hand' };
}
const floor = { point: [0, 0, 0], normal: [0, 1, 0] };
// The column (c1, c2): low pulley ahead of the toes, on the column's near face.
const TOE_Z = landmarksOf(start, H)['toe.r'][2];
const PULLEY_R = 0.045, PULLEY_GAP = 0.06, COL_W = 0.34;
const PULLEY = [0, 0.16, TOE_Z + PULLEY_GAP + PULLEY_R];
const COLUMN_Z = PULLEY[2] + COL_W / 2;
const column = lm => ({ type: 'cableColumn', base: [0, 0, COLUMN_Z], pulley: { at: PULLEY, r: PULLEY_R }, to: [0, lm.grips[1], lm.grips[2]], rest: B0, part: 'column' });

export default {
  id: 'cable_shrug', name: 'Cable Shrug', view: 'side', facing: 'right',
  camera: CAMERA,
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.45, to: COLUMN_Z + 0.25 },
    column,
    (lm, ctx) => {
      const b = [0, lm.grips[1], lm.grips[2]];
      return [
        ...(ctx.pose === 'start' ? [] : [handPoly(lm)]),
        { type: 'pulley', at: b, r: BAR_R, part: 'bar', z: 'front' },
        ...(ctx.pose === 'end' && !ctx.mistake ? [...START_SHOULDERS, { type: 'line', cls: 'eq-cable m-line', pts: START_DOT, z: 'front', part: 'startbar' }] : []),
      ];
    },
  ],
  checks: [
    { landmark: 'heel.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: floor, pose: 'all', tol: 0.5 },
    // shoulder rise: the end shoulder joint is SHRUG cm above the start one
    { landmark: 'shoulder.r', plane: { point: [0, landmarksOf(start, H)['shoulder.r'][1] + SHRUG / 100, 0], normal: [0, 1, 0] }, pose: 'end', tol: 0.2 },
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: START_W[landmark], pose: 'start', tol: 0.5 })),   // c1 facts: the hands on the bar
  ],
  startParts: ['arm.r'],
  ghosts: { count: 0 },
  trace: { point: 'shoulderTop.r', trim: [0, 0] },
  zoom: { view: 'normal', k: 3.5 },   // D-LIB13S-ZOOM: the 5 cm shrug (shoulderTop.r), the smallest ladder k over the Trace bar
  // Two levels bracket the 5 cm rise: shoulder top at the start and at the top (R7: small at full-figure scale).
  datum: [{ y: 'start:shoulderTop.r', from: 130, to: 'start:shoulderTop.r' }, { y: 'shoulderTop.r', from: 130, to: 'shoulderTop.r', mistake: false }],   // from 130 (the parent's 60): the labels sit left
  // Labels boxed on the left (the column fills the right), above the zoom. No elbow measure: the column leaves no place for
  // its label within the approved leader lengths (F3), and the "Straight arms" checkpoint carries c5.
  callouts: [
    // c5
    { key: 'arms', text: 'Straight arms', anchor: { along: ['elbow.r', 'wrist.r'], t: 0.5, off: [8, 0] }, box: { left: 30, top: 140 }, cue: 'Keep your arms straight and let only the shoulders lift the bar.' },
    // c3
    { key: 'top', text: 'Hold the top', anchor: 'shoulderTop.r', box: { left: 60, top: 44 }, cue: 'Hold the top for a second with the shoulders up.' },
    // c4
    { key: 'stand', text: 'Stand straight', anchor: 'backUpper', box: { left: 8, top: 92 }, cue: 'Stand up straight with your head up and eyes forward.' },
  ],
  tempo: [{ phase: 'Lift', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],   // c7, c16
  mistake: {
    pose: mistakePose,
    guides: [
      // R5: the faulty bar raised in front of the thighs, as a complete dashed ring (the hand around the bar) with the
      // shaft inside, drawn as guides because the Mistake mask hides faulty outlines inside the body; the red arrow
      // runs from the correct bar up to that ring.
      { kind: 'dashed', pts: M_RING(HAND_R) },
      { kind: 'line', pts: M_RING(BAR_R) },
      { kind: 'arrow', from: { at: 'grip.r', pose: 'end', off: [0, -7] }, to: { at: 'grip.r', pose: 'mistake', off: [0, 7] } },
      // the bent arm's line (shoulder -> elbow -> wrist): the engine masks the faulty forearm where it crosses the torso
      { kind: 'dashed', pts: [{ at: 'shoulder.r', pose: 'mistake' }, { at: 'elbow.r', pose: 'mistake' }, { at: 'wrist.r', pose: 'mistake' }, M_EDGE] },
    ],
    tells: [
      // c5 (plate.mistake.what)
      { key: 'elbows', text: 'Elbows bend', anchor: { at: 'elbow.r', pose: 'mistake' }, cue: 'The elbows bend to curl the bar up.' },
      // c5
      { key: 'arms', text: 'Arms pull', anchor: { at: 'grip.r', pose: 'mistake' }, box: { left: 60, top: 220 }, cue: 'The arms lift the bar instead of the shoulders.' },
    ],
  },
  alt: 'Cable shrug, side view. Standing tall close to a low cable pulley, the bar hangs on straight arms in front of the thighs. Only the shoulders lift straight up toward the ears, hold for a second and lower again. The arms stay straight.',
};
