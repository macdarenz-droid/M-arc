// Barbell shrug, side view, figure facing screen right. Small-motion zoom plate (enlarged upper-body view, flag F1).
// View: SIDE (card plate.view; the census draws it side). Straight arms, a tall back and a straight-up shoulder path
// read best side-on (c2, c4).
// Sources: research card barbell_shrug (card v2, anchor ace-shrug, verified at claude/libht-research e2a70bc):
//  c1  palms-down grip, hands about shoulder width (grip);
//  c2  knees slightly bent, hips straight, back tall; shoulders straight up toward the ears as high as possible
//      (checkpoint "Back tall", start and end poses);
//  c3  only raise and lower the shoulders, do not roll them (checkpoint "Straight up");
//  c4  bar in front of the body on straight arms (checkpoint "Straight arms", the Mistake: bending the arms to pull);
//  c7  tempo about 1-2 s up and 1-2 s down, the lowering slow.
// Geometry decisions (confirmed by the report `angles`, `checks`, `contacts` and `measure`):
//  Standing (c2): feet hip width (mid-soles 20 cm apart), mid-sole 7.7 cm in front of the ankle (legs near vertical),
//   knees 5 deg soft (root height solved from KNEE_SOFT), pelvis, trunk and neck 0 in both poses (hips straight, back
//   tall, no head poke).
//  Shrug: scap.elev SHRUG = 5 cm (glenohumeral centre straight up; the engine's side torso raises the trapezius
//   contour by about half of that). UNSOURCED: the card says only "as high as possible" (c2) and gives no number;
//   5 cm is a conservative estimate. 7 cm was tried first: the engine's shoulder cap (5 cm above the joint centre)
//   then reached chin height and read as exaggerated. Check `shoulder rise` proves the drawn value.
//  Grip (c1): hands 50 cm apart (GRIP_X, about shoulder width, outside the thighs). Arms straight (c4): IK reach at
//   full arm length less 0.1 mm (elbow 2 deg), elbow pole back; measure at the elbow, value 'straight' (the card
//   gives no angle, so no expect).
//  Bar in front of the thighs (c4): bar centre on the front surface of the drawn thigh (engine body shape, sampled at
//   the bar's height) plus the 14 mm shaft radius plus 3 mm, solved per pose, so the bar rests on the thighs at the
//   start and slides up them at the top (the hand `contacts` prove the grips are on it). ~2 cm in front of mid-foot.
//  Camera (lead's zoom convention): `fit` with `maxScale` 1.71 (250 px/m); the fit's bottom margin is negative so the
//   plate edge cuts the legs just under the knees and the head top sits 30 px under the plate edge. Why: the
//   whole-body fit can only reach ~1.15x (the figure is 1.75 m tall), where a 5 cm shrug is 8 px; at 250 px/m it is
//   12.5 px and the trapezius contour change reads. The knees (c2) stay in view. No floor (cropped below the knees).
//   pxPerM is outside the 8's range: flag F1, an owner-named exemption, never a margin. The alt says it is enlarged.
//  Drawn: end (top) pose solid; start: the near arm dashed where it shows (engine start layer), the start bar dot
//   dashed (START_DOT, the squat's workaround), and the start neck/trapezius/shoulder contour, which lies inside the
//   shrugged figure, as dashed hidden lines (the approved pull_up method, only where it differs from the end
//   outline). No ghosts (a 5 cm move: ghosts would smear the outline; the 8 use 2-3). Trace: shoulderTop.r (the top
//   of the shoulder rising straight up, c3). Datum: a horizontal line at the start shoulder-top height, so the rise is
//   read against it.
//  Mistake: the card's top fault, rolling the shoulders (c3), is a rotation the engine cannot draw (card
//   drawable: false, flag F7). Drawn: the card's drawable fault, bent arms pulling the bar up (c4): the elbows bend
//   and the bar rides M_PULL = 15 cm higher up the thighs (still on the thigh surface, hands on it by IK). M_PULL is
//   illustrative: the card gives no number. Guides: an arrow on the bar (end -> faulty height) and a dashed line
//   along the bent arm (shoulder -> elbow -> wrist), because the engine masks the faulty forearm where it crosses the
//   torso and only the elbow poking out behind the back would show (an arc-arrow at the elbow was tried: clutter).
//   The construction lines (start contour, start bar dot) are left off the Mistake plate.
// CARD: GRIP_X (c1, about shoulder width), tempo (c7). Unsourced numbers: SHRUG (card: "as high as possible"),
//  KNEE_SOFT (card: "slightly bent", no angle), FOOT_X (card gives no stance), M_PULL (illustrative fault size).
import { WINTER, REF, landmarksOf, bodyShapes, fk, resolve, normPose } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.10;                                   // mid-sole lateral offset: feet hip width
const KNEE_SOFT = 5;                                   // deg: knees slightly flexed
const GRIP_X = 0.25;                                   // hand centre lateral offset: slightly wider than shoulder width
const SHRUG = 5;                                       // cm shoulder-girdle elevation at the top (CARD)
const BAR_R = 0.014, BAR_GAP = 0.003;                  // 28 mm shaft; bar surface 3 mm off the drawn thigh line
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
// Front (max z) of the drawn near thigh at height y (m).
function thighFront(pose, y) {
  const th = shapesOf(pose).find(s => s.key === 'thigh.r').pts, py = -y * 1000;
  let z = -Infinity;
  th.forEach((a, i) => { const b = th[(i + 1) % th.length];
    if ((a[1] - py) * (b[1] - py) <= 0 && a[1] !== b[1]) z = Math.max(z, a[0] + (b[0] - a[0]) * (py - a[1]) / (b[1] - a[1])); });
  return z / 1000;
}
// Key pose for a shrug height: bar on the thighs, arms straight (fixed point: bar height depends on its z).
function key(elev) {
  const p = { ...base, scap: { elev, pro: 0 } }, S = landmarksOf(p, H)['shoulder.r'], dx = GRIP_X - Math.abs(S[0]);
  let z = 0.10, y = 0;
  for (let i = 0; i < 6; i++) { y = S[1] - Math.sqrt(ARM * ARM - dx * dx - (z - S[2]) ** 2); z = thighFront(p, y) + BAR_R + BAR_GAP; }
  y = S[1] - Math.sqrt(ARM * ARM - dx * dx - (z - S[2]) ** 2);
  const pole = s => [s * 0.3, 0, -1];
  return { ...p, reach: { l: { at: [GRIP_X, y, z], pole: pole(1) }, r: { at: [-GRIP_X, y, z], pole: pole(-1) } } };
}
const start = key(0);
const end = key(SHRUG);
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
  const p = { ...end }, y = end.reach.r.at[1] + M_PULL, z = thighFront(p, y) + BAR_R + BAR_GAP, pole = s => [s * 0.3, 0, -1];
  return { reach: { l: { at: [GRIP_X, y, z], pole: pole(1) }, r: { at: [-GRIP_X, y, z], pole: pole(-1) } } };
})();

const CAMERA = { fit: { left: 16, right: 16, top: 30, bottom: -112 }, maxScale: 250 / 146.29 };
const floor = { point: [0, 0, 0], normal: [0, 1, 0] };

export default {
  id: 'barbell_shrug', name: 'Barbell Shrug', view: 'side', facing: 'right',
  camera: CAMERA,
  poses: { start, end },
  equipment: [
    (lm, ctx) => {
      const b = [0, lm.grips[1], lm.grips[2]], moved = ctx.pose === 'end' || ctx.pose === 'mistake';
      return [
        ...(moved ? [{ type: 'barbell', at: b, plates: [0.045], part: 'plate', z: 'back' }] : []),
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
  ],
  startParts: ['arm.r'],
  ghosts: { count: 0 },
  trace: { point: 'shoulderTop.r', trim: [3, 3] },
  datum: [{ y: 'start:shoulderTop.r', from: 60, to: 'start:shoulderTop.r' }],
  measure: { vertex: 'elbow.r', from: 'shoulder.r', to: 'wrist.r', radius: 18, title: 'Elbow', value: 'straight' },
  callouts: [
    // c4
    { key: 'arms', text: 'Straight arms', anchor: { along: ['elbow.r', 'wrist.r'], t: 0.5, off: [8, 0] }, cue: 'Keep your elbows straight and let your arms just hang.' },
    // c3
    { key: 'up', text: 'Straight up', anchor: 'shoulderTop.r', cue: 'Move your shoulders only up and down, with no rolling.' },
    // c2
    { key: 'back', text: 'Back tall', anchor: 'backUpper', cue: 'Keep your knees soft, your hips straight and your back tall.' },
  ],
  tempo: [{ phase: 'Lift', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],   // c7
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'arrow', from: { at: 'grip.r', pose: 'end', off: [14, 0] }, to: { at: 'grip.r', pose: 'mistake', off: [14, 0] } },
      // the bent arm's line (shoulder -> elbow -> wrist): the engine masks the faulty forearm where it crosses the torso
      { kind: 'dashed', pts: [{ at: 'shoulder.r', pose: 'mistake' }, { at: 'elbow.r', pose: 'mistake' }, { at: 'wrist.r', pose: 'mistake' }] },
    ],
    tells: [
      // c4 (plate.mistake.what, handlingMistakes "Bending the arms to pull")
      { key: 'elbows', text: 'Elbows bend', anchor: { at: 'elbow.r', pose: 'mistake' }, cue: 'The elbows bend to pull the bar up.' },
      // c4 (plate.mistake.what)
      { key: 'arms', text: 'Arms pull', anchor: { at: 'grip.r', pose: 'mistake' }, cue: 'The arms lift the bar instead of the shoulders.' },
    ],
  },
  pilot: { drawableFault: 'Top fault (rolling the shoulders, c3) is a rotation the engine cannot draw; drawn: bent arms pulling the bar (c4).' },
  alt: 'Barbell shrug, side view, enlarged close-up of the upper body. Standing tall with soft knees and straight hips, the bar hangs on straight arms in front of the thighs. Only the shoulders lift straight up toward the ears and lower again; the arms stay straight.',
};
