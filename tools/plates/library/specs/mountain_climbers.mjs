// Mountain climbers, side view, figure facing screen right (head right, feet left), face down in a high plank.
// View: side (card plate.view): the knee drive, the head-to-heel line, the hands-under-shoulders stack and the hip
//  hike fault are all sagittal.
// Cycle class: one half-cycle, from the high plank (dashed start) to the near knee driven toward the chest (solid end);
//  the trace follows the driving knee.
// Form (research card mountain_climbers, claims): c1 a moving plank from a raised push-up position, feet brought
//  forward one at a time toward the chest; c2 hands directly under the shoulders, arms straight; c3 a straight line
//  from the back of the head to the heels, on hands and toes; c4 bring one foot toward the chest, then switch, without
//  letting the hips hike up; c6 shoulders stay over the wrists.
// Geometry decisions (confirmed by the report `angles` and `checks`):
//  Hands: the engine hand is a fist (no flat palm, no forearm pronation). Laying it forward (wrist 90) put the fist
//   beside the wrist like a loose ball, so the fist stands under the wrist on the floor (WRIST 0, GRIP_Y = fist
//   radius), as a knuckle push-up hand. Cost: the shoulders sit ~8 cm higher than on a flat palm, so the body line is
//   ~22 deg from the floor instead of ~18. Arms straight (elbow 0) and plumb: shoulder flexion = pelvis tilt, so the
//   wrist is exactly under the shoulder (check) in both poses: c2 and c6 hold by construction.
//  Start: high plank, one straight line: trunk, hips and knees 0 relative to the pelvis, neck 0 (head in line); feet
//   at right angles to the shins, toe tips on the floor at TOE_Z (rigid engine foot: no toe joint); root and pelvis
//   tilt solved (Newton, finite differences) so the fist is on the floor and the toes on their spot.
//  End: the near (right) leg drives: the foot is placed by the plant IK under the hip (DRIVE_FOOT_DZ), toes down
//   (DRIVE_FOOT_TILT), hovering FOOT_CLEAR over the floor (the card leaves toe tap vs float unsourced; the rigid foot's
//   lowest point is lifted, checks prove the clearance), which puts the knee under the chest (IK: hip ~118, knee ~138).
//   Pelvis tilt, root, trunk and the far leg are exactly the start's: the hips stay level (no hike, c4) and the far
//   leg stays straight back on its toes (its outline is also the dashed start leg, which lies exactly under it).
//  One ghost (t = 0.5, the via pose) shows the swing with the thigh still behind vertical and the foot trailing up.
// CARD: DRIVE_FOOT_DZ / DRIVE_FOOT_TILT (how far the knee comes, c4; shorter for the easier version c9), FOOT_CLEAR
//  (tap vs float, unsourced), hands under the shoulders (c2, c6), straight line (c3).
import { landmarksOf } from '../engine.mjs';

const H = 1.75;
const GRIP_Y = 0.035;                        // fist centre height: fist radius, resting on the floor (m)
const WRIST = 0;                             // fist under the wrist (see header)
const TOE_Z = -1.05;                         // toe tips of the straight legs on the floor (m)
const VIA_HIP = 45, VIA_KNEE = 95;           // mid-swing ghost (deg)
const DRIVE_FOOT_DZ = -0.12;                 // driving foot (ball) this far behind the hip-joint centre at the end (m)
const DRIVE_FOOT_TILT = 70;                  // driving foot heel-up angle (deg): toes pointing down toward the floor
const FOOT_CLEAR = 0.025;                    // the driving foot hovers: its lowest point this far off the floor (m)
const R = Math.PI / 180;

function solve(p0, make, res, iters = 30) {  // Newton with finite differences (as plank.mjs)
  const keys = Object.keys(p0); const p = { ...p0 };
  const f = q => res(landmarksOf(make(q), H));
  for (let it = 0; it < iters; it++) {
    const r = f(p); if (Math.hypot(...r) < 1e-6) break;
    const J = keys.map(k => { const d = 1e-5, q = { ...p, [k]: p[k] + d }; return f(q).map((v, i) => (v - r[i]) / d); });
    const n = keys.length, A = Array.from({ length: n }, (_, i) => [...keys.map((_, j) => J[j][i]), -r[i]]);
    for (let c = 0; c < n; c++) {
      let m = c; for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[m][c])) m = i;
      [A[c], A[m]] = [A[m], A[c]];
      for (let i = 0; i < n; i++) if (i !== c) { const k = A[i][c] / A[c][c]; for (let j = c; j <= n; j++) A[i][j] -= k * A[c][j]; }
    }
    keys.forEach((k, i) => { p[k] += A[i][n] / A[i][i]; });
  }
  return p;
}

const plankPose = q => ({ root: { at: [0, q.y, q.z], tilt: q.tilt }, trunk: 0, neck: 0, shoulder: { flex: q.tilt }, elbow: 0, wrist: WRIST, hip: 0, knee: 0, ankle: 0 });
const Q = solve({ y: 0.45, z: -0.2, tilt: 75 }, plankPose, lm => [lm['grip.r'][1] - GRIP_Y, lm['toe.r'][1], lm['toe.r'][2] - TOE_Z]);
const start = plankPose(Q);
// End: the driving foot is placed by the plant IK (sole on a plane tilted DRIVE_FOOT_TILT heel-up, ref 'ball'), lifted
// so the rigid foot's lowest forefoot point hovers FOOT_CLEAR above the floor; hip, knee and ankle come from the IK.
const sT = Math.sin(DRIVE_FOOT_TILT * R), cT = Math.cos(DRIVE_FOOT_TILT * R);
const LOW = -Math.min(...[[0.112, -0.036], [0.120, -0.028], [0.100, -0.038]].map(([z, y]) => ((z - 0.080) * -sT + (y + 0.039) * cT) * H));
const HIPZ = landmarksOf(start, H)['hip.r'][2];
const DRIVE = { at: [-0.10, LOW + FOOT_CLEAR, HIPZ + DRIVE_FOOT_DZ], normal: [0, cT, sT], toe: [0, -sT, cT], ref: 'ball', pole: [0, -0.3, 1] };
const end = { ...start, plant: { r: DRIVE } };
// Via (drawn as the one ghost, t = 0.5): mid swing, the thigh still behind the vertical and the foot trailing up, so
// the knee never scrapes the floor in the drawing (with level hips the knee passes ~4.5 cm over it, which only the
// trace shows).
const via = [{ ...start, hip: { r: VIA_HIP, l: 0 }, knee: { r: VIA_KNEE, l: 0 }, ankle: { r: -20, l: 0 } }];
const SH = landmarksOf(start, H)['shoulder.r'];

const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };

export default {
  id: 'mountain_climbers', name: 'Mountain Climbers', view: 'side', facing: 'right',
  camera: { x0: 215, y0: 290 },
  poses: { start, via, end },
  equipment: [{ type: 'floor', from: -1.3, to: 0.55 }],
  checks: [
    { landmark: 'grip.r', plane: { point: [0, GRIP_Y, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },    // hand on the floor
    { landmark: 'wrist.r', plane: { point: SH, normal: [0, 0, 1] }, pose: 'all', tol: 0.5 },                // wrist under the shoulder
    { landmark: 'toe.l', plane: FLOOR, pose: 'all', tol: 0.5 },                                              // far leg on its toes
    { landmark: 'toe.r', plane: FLOOR, pose: 'start', tol: 0.5 },
    { landmark: 'toe.r', above: { point: [0, 0.02, 0], normal: [0, 1, 0] }, pose: 'end' },            // driving foot off the floor
    { landmark: 'heel.r', above: { point: [0, 0.02, 0], normal: [0, 1, 0] }, pose: 'end' },
    { landmark: 'knee.r', above: { point: [0, 0.049 + FOOT_CLEAR, 0], normal: [0, 1, 0] }, pose: 'end' },   // kneecap clear
  ],
  ghosts: { count: 1, parts: ['leg.r'] },
  trace: { point: 'knee.r', trim: [10, 12] },
  callouts: [],
  alt: 'Mountain climbers, side view. High plank on straight arms, hands under the shoulders, body in one line from head to heels. One knee drives forward under the chest while the other leg stays straight back on the toes, hips level.',
};
