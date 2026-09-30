// Barbell shrug, side view, figure facing screen right. Small-motion zoom class (upper-body crop).
// View: SIDE. The lift is a few centimetres of shoulder-girdle elevation straight up toward the ears with the arms
// straight and the bar sliding up the front of the thighs: all sagittal (height of the shoulders, bar against the
// thighs, no arm bend, no body lean).
// Form (textbook; the research card is not in yet, so every number is a named constant for the card):
//  NSCA, Exercise Technique Manual for Resistance Training (3rd ed., 2016), shrug: stand erect, feet hip width, knees
//   slightly flexed; pronated closed grip slightly wider than shoulder width; bar resting against the front of the
//   thighs, elbows fully extended; elevate the shoulders as high as possible toward the ears, keep the elbows straight,
//   do not roll the shoulders; lower under control. (Book, not re-read online for this plate.)
// Geometry decisions (confirmed by the report `angles`, `checks` and `contacts`):
//  Standing: feet hip width (mid-soles 20 cm apart), mid-sole 7.7 cm in front of the ankle (legs near vertical), knees
//   5 deg soft (root height solved from KNEE_SOFT), pelvis, trunk and neck 0 in both poses (no lean, no head poke).
//  Shrug: scap.elev SHRUG = 5 cm (glenohumeral centre straight up; the engine's side torso raises the trapezius
//   contour by about half of that). Not from a measured source: a conservative estimate for a full shrug. 7 cm was
//   tried first: the engine's shoulder cap (5 cm above the joint centre) then reached chin height and read as
//   exaggerated. CARD must set it.
//  Grip: hands 50 cm apart (GRIP_X, slightly wider than the shoulder joints, outside the thighs). Arms straight:
//   IK reach at full arm length less 0.1 mm (elbow 2 deg), elbow pole back.
//  Bar against the thighs: bar centre on the front surface of the drawn thigh (engine body shape, sampled at the bar's
//   height) plus the 14 mm shaft radius plus 3 mm, solved per pose, so the bar rests on the thighs at the start and
//   slides up them at the top (by construction; the hand `contacts` prove the grips are on it). In both poses the bar is ~2 cm in front of mid-foot.
//  Camera: an upper-body crop, pxPerM = 1.71 x the reference (250 px/m), head top 30 px under the plate edge, the legs
//   cut just under the knees by the plate edge. Why a crop: the whole-body fit can only reach ~1.15x (the figure is
//   1.75 m tall), where a 5 cm shrug is 8 px; at 250 px/m it is 12.5 px and the trapezius contour change reads.
//   The standing figure, the bar held on the thighs and the straight arms stay in view, so it still reads as the
//   shrug. No floor (cropped).
//  Drawn: end (top) pose solid; start: the near arm dashed where it shows (engine start layer), the start bar dot
//   dashed (START_DOT, the squat's workaround), and
//   the start neck/trapezius/shoulder contour, which lies inside the shrugged figure, as dashed hidden lines (the
//   approved pull_up method, only where it differs from the end outline). No ghosts (a 5 cm move: ghosts would smear
//   the outline). Trace: shoulderTop.r (the top of the shoulder rising). Datum: a horizontal line at the start
//   shoulder-top height, so the rise is measured against it.
// CARD: shrug height (SHRUG), grip width (GRIP_X), stance (FOOT_X), knee bend (KNEE_SOFT).
import { WINTER, REF, landmarksOf, bodyShapes, fk, resolve, normPose } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.10;                                   // mid-sole lateral offset: feet hip width
const KNEE_SOFT = 5;                                   // deg: knees slightly flexed
const GRIP_X = 0.25;                                   // hand centre lateral offset: slightly wider than shoulder width
const SHRUG = 5;                                       // cm shoulder-girdle elevation at the top (CARD)
const BAR_R = 0.014, BAR_GAP = 0.003;                  // 28 mm shaft; bar surface 3 mm off the drawn thigh line
const ARM = (WINTER.upperArm + WINTER.forearm + REF.gripOff) * H - 0.0001;  // arms straight (elbow 2 deg)
const SCALE = 250;                                     // px/m, 1.71 x the reference (small-motion zoom)
const HEAD_TOP_PX = 30;                                // head top under the plate edge

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
const B0 = barOf(start), START_DOT = Array.from({ length: 17 }, (_, k) => [0, B0[1] + 0.025 * Math.sin(k * Math.PI / 8), B0[2] + 0.025 * Math.cos(k * Math.PI / 8)]);

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

const HEAD_TOP = landmarksOf(end, H).head[1];
const CAMERA = { pxPerM: SCALE, x0: 170, y0: HEAD_TOP_PX + HEAD_TOP * SCALE };

export default {
  id: 'barbell_shrug', name: 'Barbell Shrug', view: 'side', facing: 'right',
  camera: CAMERA,
  poses: { start, end },
  equipment: [
    (lm, ctx) => {
      const b = ctx.pose === 'start' ? barOf(start) : barOf(end);
      return [
        ...(ctx.pose === 'end' ? [{ type: 'barbell', at: b, plates: [0.045], part: 'plate', z: 'back' }] : []),
        { type: 'pulley', at: [0, lm.grips[1], lm.grips[2]], r: 0.025, part: 'bar', z: 'front' },
        ...(ctx.pose === 'end' ? [...START_SHOULDERS, { type: 'line', cls: 'eq-cable m-line', pts: START_DOT, z: 'front', part: 'startbar' }] : []),
      ];
    },
  ],
  checks: [
    { landmark: 'heel.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    // shoulders rise by SHRUG: the end shoulder joint is SHRUG cm above the start one
    { landmark: 'shoulder.r', plane: { point: [0, landmarksOf(start, H)['shoulder.r'][1] + SHRUG / 100, 0], normal: [0, 1, 0] }, pose: 'end', tol: 0.2 },
  ],
  startParts: ['arm.r'],
  ghosts: { count: 0 },
  trace: { point: 'shoulderTop.r', trim: [3, 3] },
  datum: [{ y: 'start:shoulderTop.r', from: 60, to: 'start:shoulderTop.r' }],
  callouts: [],
  alt: 'Barbell shrug, side view, close-up of the upper body. Standing tall with straight arms, the bar resting against the front of the thighs; the shoulders lift straight up toward the ears by a few centimetres and the bar slides up the thighs.',
};
