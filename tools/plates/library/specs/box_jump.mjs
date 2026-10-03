// Box jump, side view, figure facing screen right, box in front.
// View: side (card plate.view). Take-off loading, the landing knee bend and the box height are sagittal.
// Airborne class: the loading frame (dashed start), the landing (solid end) and one ghost, the take-off at full
// extension (on the balls, legs straight, arms up; critic 10-03 R4: the FULL EXTENSION callout needs an extended pose
// to point at). The card's plate.frames name take-off and landing; the ghost is that take-off's extended instant, so
// no mid-air body is drawn. The trace follows the near hip from the crouch through the extension along the jump arc
// (via key poses: a curved rise, then root positions on a parabola; only the extension via is drawn).
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
//   elbows straight. Landing frame (c4, c5; verified plate.end): both whole feet flat on the box top, well back from
//   the edge (checks: heel HEEL_BACK behind the front edge, toe TOE_CLEAR short of the back edge),
//   mid-foot LAND_Z, hips back, knees soft-bent (LAND_HIP gives ~70-80 deg), thorax LAND_TRUNK deg, arms forward for balance.
//  Balance: both frames are solved with the Winter (2009) whole-body centre of mass straight over the mid-foot, as
//   hanging_leg_raise.mjs does over its bar, so neither frame tips over.
// Plate text (card box_jump plate, verified: claude/libht-research e2a70bc):
//  Callouts = the 3 plate.checkpoints: c2 load and swing (on the take-off frame's hands), c3 full extension (on the
//   extension ghost's straight knee), c5 soft knees (the landing checkpoint).
//  Mistake = plate.mistake (c5, drawable): landing on the box with straight, stiff knees (MISTAKE_HIP, same feet).
//   Tells: the card's plate.tells are cues of good form ("Both feet land together, knees bent", "You step down, never
//   jump down"), so the tells restate the fault: knees straight, stiff landing (c5). Flagged on PR #109.
//  Measure: none. The card gives no knee angle; an arc would only repeat the "Soft knees" callout.
//  Tempo: left out. The card gives no seconds ("explosive take-off; step down; full rest", c11).
// CARD (checked against card v2): from the card: BOX_H 45 cm (inside the beginner 30-45 cm, c8), knees and hips bent
//  with the arms back at take-off (c2), both feet on the box with the knees bent (c4, c5), FOOT_X (hip width, c1).
//  Not in the card, left flagged: TAKEOFF_HIP / TAKEOFF_TRUNK / ARMS_BACK, the EXT_* extension angles and LAND_HIP / LAND_TRUNK (how deep: no
//  number), BOX_Z0 (distance to the box), MISTAKE_HIP (how straight the Mistake knees are: near locked).
import { landmarksOf } from '../engine.mjs';

const H = 1.75;
const BOX_H = 0.45, BOX_D = 0.60, BOX_Z0 = 0.52;          // plyo box height, depth, front edge (m)
const FOOT_X = 0.10;                                       // mid-sole lateral offset: feet hip width (c1)
const LAND_Z = BOX_Z0 + 0.30;                              // landing mid-foot: foot about centred on the box top (card v2 end)
const HEEL_BACK = 0.15, TOE_CLEAR = 0.10;                  // heel at least this far back from the front edge, toe this far from the back
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

// Full extension (c3, critic 10-03 R4): the take-off pose drawn as the plate's one ghost (key pose at t = 0.5, where
// the engine draws a single ghost): the same feet on the balls (heels up EXT_HEEL deg), knees EXT_KNEE deg, hips
// straight, the whole body leaning EXT_LEAN toward the box, arms swung up EXT_ARMS deg of flexion. The FULL
// EXTENSION leader ends on this pose's knee. Drawing values (the card gives no angles): EXT_*.
const EXT_HEEL = 35, EXT_KNEE = 4, EXT_LEAN = 18, EXT_ARMS = 150;
const kneeAngle = lm => { const a = [0, 1, 2].map(i => lm['hip.r'][i] - lm['knee.r'][i]), b = [0, 1, 2].map(i => lm['ankle.r'][i] - lm['knee.r'][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) * 180 / Math.PI; };
const BALL0 = landmarksOf(start, H)['ball.r'];
const ext = (() => {
  const th = EXT_HEEL * Math.PI / 180, n = [0, Math.cos(th), Math.sin(th)], t = [0, -Math.sin(th), Math.cos(th)];
  const plant = { l: { at: [FOOT_X, 0, BALL0[2]], normal: n, toe: t, ref: 'ball' }, r: { at: [-FOOT_X, 0, BALL0[2]], normal: n, toe: t, ref: 'ball' } };
  const lean = EXT_LEAN * Math.PI / 180;                       // hip forward of the ankle along the lean
  const pose = y => { const A = [0, extAnkleY(th), BALL0[2] - 0.12 * Math.cos(th)];
    return { root: { at: [0, y, A[2] + (y - A[1]) * Math.tan(lean)], tilt: -EXT_LEAN + 6 }, trunk: 6, neck: -6, shoulder: { flex: EXT_ARMS }, elbow: 10, plant }; };
  let lo = 0.8, hi = 1.15;                                      // root height: knee bend EXT_KNEE
  for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (kneeAngle(landmarksOf(pose(mid), H)) > EXT_KNEE) lo = mid; else hi = mid; }
  return pose((lo + hi) / 2);
})();
function extAnkleY(th) { return 0.039 * H * Math.cos(th) + 0.12 * Math.sin(th); }   // ankle height on the balls (approx: sets the lean line only; the IK places the leg)
const EXT_KNEE_PT = landmarksOf(ext, H)['knee.r'];

// Flight: the hip on a parabola from the take-off (full extension) hip to the landing hip, apex APEX m above the
// landing hip. The vias carry a tucked, arms-up shape for the interpolation; they are never drawn.
const APEX = 0.25;
const P0 = ext.root.at, P1 = end.root.at;
const arc = t => {
  const y0 = P0[1], y1 = P1[1], top = y1 + APEX;
  // quadratic through (0, y0), (1, y1) with its maximum `top`: y = y0 + b t - a t^2
  const k = Math.sqrt(top - y0) , l = Math.sqrt(top - y1), tp = k / (k + l), a = (top - y0) / (tp * tp);
  return [0, top - a * (t - tp) ** 2, P0[2] + (P1[2] - P0[2]) * t];
};
// keys: start (t 0), six rising keys, full extension (t 0.5, the ghost), six flight keys, end (t 1): the same number
// of keys on each side puts the extension at t = 0.5, and enough flight keys keep the traced hip arc smooth.
// The rising hip follows a quadratic curve from the crouch to the extension whose end tangent is the flight
// parabola's take-off direction, so the traced hip path has no corner at take-off.
const ARC_D = (() => { const a = arc(0), b = arc(0.01); return [0, (b[1] - a[1]) / 0.01, (b[2] - a[2]) / 0.01]; })();
const RISE_C = (() => { const L = Math.hypot(ext.root.at[1] - start.root.at[1], ext.root.at[2] - start.root.at[2]) * 0.5, n = Math.hypot(ARC_D[1], ARC_D[2]);
  return [0, ext.root.at[1] - ARC_D[1] / n * L, ext.root.at[2] - ARC_D[2] / n * L]; })();
const riseAt = k => start.root.at.map((v, i) => (1 - k) ** 2 * v + 2 * k * (1 - k) * RISE_C[i] + k * k * ext.root.at[i]);
const rise = k => ({ root: { at: riseAt(k), tilt: start.root.tilt + (ext.root.tilt - start.root.tilt) * k },
  trunk: 6, neck: -8, shoulder: k < 0.5 ? { ext: ARMS_BACK * (1 - 2 * k) } : { flex: EXT_ARMS * (2 * k - 1) }, elbow: 8,
  plant: k < 0.5 ? start.plant : ext.plant });
const fly = t => ({ root: { at: arc(t), tilt: 20 }, trunk: 6, neck: -8, shoulder: { flex: 120 - 20 * t }, elbow: 15,
  hip: 30 + 50 * t, knee: 30 + 50 * Math.sin(Math.PI * t), ankle: -10 });
const via = [...[1, 2, 3, 4, 5, 6].map(k => rise(k / 7)), ext, ...[1, 2, 3, 4, 5, 6].map(k => fly(k / 7))];

// Mistake (card plate.mistake, c5): landing on the box with straight, stiff knees. Same feet on the box; the hips stay
// high (MISTAKE_HIP), knees almost locked, trunk nearly upright, centre of mass over mid-foot as the other frames.
// How straight is a drawing choice (the card gives no number): knees near locked, so it reads in 2 seconds.
const MISTAKE_HIP = BOX_H + 0.925, MISTAKE_TRUNK = 12;
const MISTAKE = grounded(BOX_H, LAND_Z, MISTAKE_HIP, { tilt: MISTAKE_TRUNK - 6, trunk: 6, neck: -6, shoulder: { flex: ARMS_FWD }, elbow: 15 });


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
    { landmark: 'heel.l', plane: TOP, pose: 'end', tol: 0.5 },                              // both feet flat on the box
    { landmark: 'ball.l', plane: TOP, pose: 'end', tol: 0.5 },
    // whole feet on the top, well back from the front edge, heels never hanging off (verified card, plate.end)
    { landmark: 'heel.r', above: { point: [0, 0, BOX_Z0 + HEEL_BACK], normal: [0, 0, 1] }, pose: 'end' },
    { landmark: 'heel.r', above: { point: [0, 0, BOX_Z0 + HEEL_BACK], normal: [0, 0, 1] }, pose: 'mistake' },
    { landmark: 'toe.r', above: { point: [0, 0, BOX_Z0 + BOX_D - TOE_CLEAR], normal: [0, 0, -1] }, pose: 'end' },
    { landmark: 'heel.r', plane: TOP, pose: 'mistake', tol: 0.5 },                          // stiff landing: same feet on the box
    { landmark: 'ball.r', plane: TOP, pose: 'mistake', tol: 0.5 },
  ],
  ghosts: { count: 1 },                                   // t = 0.5: the full-extension take-off pose (via[3])
  trace: { point: 'hip.r', trim: [10, 12] },
  callouts: [
    { key: 'load', text: 'Load and<br>swing', anchor: { at: 'grip.r', pose: 'start' }, cue: 'Bend the knees and hips while the arms swing back.' },
    { key: 'extend', text: 'Full<br>extension', anchor: EXT_KNEE_PT, cue: 'Take off by extending hips, knees and ankles as the arms swing up.' },
    { key: 'land', text: 'Soft knees', anchor: 'knee.r', cue: 'Land on the box with both feet, knees bent.' },
  ],
  mistake: {
    pose: MISTAKE,
    guides: [
      { kind: 'arrow', from: { at: 'knee.r', pose: 'end' }, to: { at: 'knee.r', pose: 'mistake' } },
    ],
    tells: [
      { key: 'straight', text: 'Knees straight', anchor: { at: 'knee.r', pose: 'mistake' }, cue: 'The knees stay straight as the feet land on the box.' },
      { key: 'stiff', text: 'Stiff landing', anchor: { at: 'buttock', pose: 'mistake' }, box: { left: 12, top: 110 }, cue: 'The legs don\'t bend to absorb the landing.' },
    ],
  },
  pilot: { note: 'No tempo strip: no sourced seconds (explosive take-off, step down, full rest; c11).' },
  alt: 'Box jump, side view. Take-off frame: feet hip width, knees and hips bent, arms swung back. The hips arc up and forward onto a knee-high box. Landing frame: both feet flat on the box, knees and hips bent to absorb the landing, arms forward.',
};
