// Box jump, side view, figure facing screen right, box in front.
// View: side (card plate.view). Take-off loading, the landing knee bend and the box height are sagittal.
// Airborne class: two frames only (card plate.frames), the take-off (dashed start) and the landing (solid end). No
// mid-air body is drawn (ghosts count 0); the flight exists only as the trace, which follows the near hip along a
// jump arc built from via key poses (root positions on a parabola; the via bodies are never drawn).
// Form (research card box_jump, claims): c1 stand facing a sturdy box, feet about hip width; c2 load: brace, bend the
//  knees and hips, swing the arms back; c3 take off extending hips, knees and ankles as the arms swing up; c4 bend the
//  hips to lift the feet onto the box, land with both feet; c5 land with the knees bent (straight knees = the fault);
//  c7/c8 a box well below the maximum, beginners 12-18 in (30-45 cm).
// Geometry decisions (confirmed by the report `angles` and `checks`):
//  Box: BOX_H 45 cm tall (top of the card's c8 beginner range; reads clearly as a box, not a step), BOX_D 60 cm deep
//   (a common 20 x 24 x 30 in plyo box on its 24 in side), front edge BOX_Z0 = 52 cm in front of the take-off
//   mid-foot (toes ~39 cm from the box, so the take-off head is not hidden behind the landing body).
//  Take-off frame = the bottom of the countermovement (c2): feet flat, hip-joint centre TAKEOFF_HIP high (a quarter-
//   to-half squat), thorax TAKEOFF_TRUNK deg from vertical, arms swung back ARMS_BACK deg behind the thorax line,
//   elbows straight. Landing frame (c4, c5): both feet flat on the box top with the mid-foot LAND_Z, hips back,
//   knees soft-bent (LAND_HIP gives ~70-80 deg), thorax LAND_TRUNK deg, arms forward for balance.
//  Balance: both frames are solved with the Winter (2009) whole-body centre of mass straight over the mid-foot, as
//   hanging_leg_raise.mjs does over its bar, so neither frame tips over.
// CARD: BOX_H (c8), TAKEOFF_HIP / TAKEOFF_TRUNK / ARMS_BACK (c2 depth and swing), LAND_HIP / LAND_TRUNK (c5 knee bend),
//  FOOT_X (c1 hip width), BOX_Z0 (distance to the box: unsourced).
import { landmarksOf } from '../engine.mjs';

const H = 1.75;
const BOX_H = 0.45, BOX_D = 0.60, BOX_Z0 = 0.52;          // plyo box height, depth, front edge (m)
const FOOT_X = 0.10;                                       // mid-sole lateral offset: feet hip width (c1)
const LAND_Z = BOX_Z0 + 0.26;                              // landing mid-foot: whole foot on the box, toes clear of the back
const TAKEOFF_HIP = 0.68, TAKEOFF_TRUNK = 48, ARMS_BACK = 25;
const LAND_HIP = BOX_H + 0.72, LAND_TRUNK = 32, ARMS_FWD = 95;

// Winter (2009) segment masses and centre-of-mass positions (as hanging_leg_raise.mjs).
const mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
function comZ(lm) {
  let m = 0, z = 0;
  const seg = (w, p) => { m += w; z += w * p[2]; };
  seg(0.081, lm.ear); seg(0.497, mid(lm.shoulders, lm.hips, 0.5));
  for (const s of ['l', 'r']) {
    seg(0.028, mid(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)); seg(0.016, mid(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)); seg(0.006, lm[`grip.${s}`]);
    seg(0.100, mid(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)); seg(0.0465, mid(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)); seg(0.0145, mid(lm[`heel.${s}`], lm[`toe.${s}`], 0.5));
  }
  return z / m;
}
// A grounded frame: feet flat at (y, z), hip height hipY; the root z is solved so the centre of mass is over mid-foot.
function grounded(y, z, hipY, angles) {
  const plant = { l: { at: [FOOT_X, y, z] }, r: { at: [-FOOT_X, y, z] } };
  let rz = z - 0.2;
  for (let i = 0; i < 40; i++) {
    const pose = { ...angles, root: { at: [0, hipY, rz], tilt: angles.tilt }, plant };
    rz += z - comZ(landmarksOf(pose, H));
  }
  const { tilt, ...rest } = angles;
  return { ...rest, root: { at: [0, hipY, +rz.toFixed(4)], tilt }, plant };
}
// Thorax angle = tilt (pelvis) + trunk (lumbar, 6 deg); the shoulder angle is set in the world: arms ARMS_BACK deg
// behind the thorax line (extension) at take-off, ARMS_FWD deg of flexion on landing.
const start = grounded(0, 0, TAKEOFF_HIP, { tilt: TAKEOFF_TRUNK - 6, trunk: 6, neck: -12, shoulder: { ext: ARMS_BACK }, elbow: 5, ankle: 0 });
const end = grounded(BOX_H, LAND_Z, LAND_HIP, { tilt: LAND_TRUNK - 6, trunk: 6, neck: -10, shoulder: { flex: ARMS_FWD }, elbow: 15 });

// Flight: the hip on a parabola from the take-off hip to the landing hip, apex APEX m above the landing hip. The
// via poses carry only root positions and a tucked, arms-up shape for the interpolation; they are never drawn.
const APEX = 0.25;
const P0 = start.root.at, P1 = end.root.at;
const arc = t => {
  const y0 = P0[1], y1 = P1[1], top = y1 + APEX;
  // quadratic through (0, y0), (1, y1) with its maximum `top`: y = y0 + b t - a t^2
  const k = Math.sqrt(top - y0) , l = Math.sqrt(top - y1), tp = k / (k + l), a = (top - y0) / (tp * tp);
  return [0, top - a * (t - tp) ** 2, P0[2] + (P1[2] - P0[2]) * t];
};
const via = Array.from({ length: 9 }, (_, i) => (i + 1) / 10).map(t => ({
  root: { at: arc(t), tilt: 20 }, trunk: 6, neck: -8, shoulder: { flex: 60 + 60 * Math.sin(Math.PI * t) }, elbow: 15,
  hip: 60 + 20 * t, knee: 70 + 20 * Math.sin(Math.PI * t), ankle: -10,
}));

const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] }, TOP = { point: [0, BOX_H, 0], normal: [0, 1, 0] };

export default {
  id: 'box_jump', name: 'Box Jump', view: 'side', facing: 'right',
  camera: { x0: 122, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.55, to: 1.45 },
    { type: 'box', at: [0, BOX_H / 2, BOX_Z0 + BOX_D / 2], w: BOX_D, h: BOX_H, z: 'back' },
  ],
  checks: [
    { landmark: 'heel.r', plane: FLOOR, pose: 'start', tol: 0.5 },                          // take-off: feet flat
    { landmark: 'ball.r', plane: FLOOR, pose: 'start', tol: 0.5 },
    { landmark: 'heel.r', plane: TOP, pose: 'end', tol: 0.5 },                              // landing: feet flat on the box
    { landmark: 'ball.r', plane: TOP, pose: 'end', tol: 0.5 },
    { landmark: 'heel.r', above: { point: [0, 0, BOX_Z0], normal: [0, 0, 1] }, pose: 'end' },            // whole foot on the top
    { landmark: 'toe.r', above: { point: [0, 0, BOX_Z0 + BOX_D], normal: [0, 0, -1] }, pose: 'end' },
  ],
  ghosts: { count: 0 },
  trace: { point: 'hip.r', trim: [10, 12] },
  callouts: [],
  alt: 'Box jump, side view. Take-off frame: feet hip width, knees and hips bent, arms swung back. The hips arc up and forward onto a knee-high box. Landing frame: both feet flat on the box, knees and hips bent to absorb the landing, arms forward.',
};
