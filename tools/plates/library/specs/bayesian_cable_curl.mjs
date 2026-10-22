// Bayesian cable curl (single handle, low pulley behind, split stance, one arm), side view, figure faces screen right,
// away from the column.
// View: SIDE (card plate.view = census view). The working arm drawn back behind the torso (c2, c3), the elbow bending
// while the upper arm stays still (c4, c5) and the fault, the upper arm swinging forward (c5), are sagittal.
// Form: research card docs/research/howto/cards/bayesian_cable_curl.json (research head a8e66f32, identical at 3812989f),
//  plate section: start "Facing away from the low pulley (c1), a step forward with light cable tension, torso leaning
//  slightly forward (c2); working arm straight and drawn behind the torso, elbow close to the body (c2, c4); upper arm
//  drawn back no more than about 45 deg behind vertical, which is the same line as 45 deg to the floor (c2, c3); free hand
//  on the hip (c7)"; end "Elbow bent, handle brought forward and up toward the shoulder (c4); upper arm in the same place
//  as the start (c4, c5); torso unchanged (c7)".
// Clone sources (D-LIB15-CLONE, copied never imported): lat_pulldown (main: column, stack and pulley sizes; the low-pulley
//  form is overhead_cable_triceps_extension's, this branch), dumbbell_biceps_curl (pilot A #109 @ ff7c5c4f: the curl arm,
//  ELBOW_END, the Mistake's MIS_FLEX, the faulty-arm guides) and rope_triceps_pushdown (pilot A: the slight lean).
// Split stance (D-LIB15-SPLIT): drawn now, no sheet until reverse_lunge is redrawn, owner-approved and pinned.
// Geometry decisions:
//  - Split stance, one step forward (c2): the far (left) foot STEP ahead of the near (right) foot, both flat.
//  - Lean: pelvis tilted TILT forward from the hips, back straight (c2 "lean your torso slightly forward"):
//    rope_triceps_pushdown's slight lean (pilot A, TILT 8 + TRUNK 3).
//  - Working (near, right) upper arm ARM_BACK behind vertical in both poses (c2 "about a 45-degree angle relative to the
//    floor", c3 "at most"); the shoulder extension is ARM_BACK less the forward lean, so the drawn line is 45 deg
//    behind vertical; measured by the arc (`expect` 45). Elbow straight at the start (c2 "arm is drawn back"), ELBOW_END
//    at the end (c4 "toward the shoulder"): dumbbell_biceps_curl's full curl, 140 deg (pilot A :55).
//  - Free (far, left) hand on the hip (c7), placed by IK on the side of the pelvis.
//  - Single handle: a D-handle drawn as a `poly` loop beside the fist (PQ-H9: it moves in the Mistake), the cable from the
//    low pulley's upper tangent to the handle, beside the body (the arm is lateral to the trunk), with a thin `poly`
//    twin in the Mistake pose.
// Unsourced numbers (13.3 must-fix 14): STEP, the column, stack and pulley sizes (lat_pulldown's), the low pulley height
//  (16 cm), PULLEY_GAP (the light-tension distance behind the heels), the handle size.
// Callouts, Mistake, tempo: the 3 checkpoints are the callouts (c2, c5, c4); the Mistake is the card's plate.mistake (c5,
//  drawable true), drawn against the end pose: the upper arm swings forward to MIS_FLEX of shoulder flexion,
//  dumbbell_biceps_curl's drawn swing (pilot A :61, 45 deg). Tempo: Curl 1 s, Lower 2 s (c12; pause 0, no Hold).
import { WINTER, REF, landmarksOf, bodyShapes, fk, resolve, normPose } from '../engine.mjs';

const H = 1.75;
const TILT = 11;                                       // slight forward lean from the hips (c2; rope_triceps_pushdown's 8 + 3)
const STEP = 0.45;                                     // far foot ahead of the near foot (c2: one step forward)
const ARM_BACK = 45;                                   // upper arm behind vertical (c2, c3)
const ELBOW_END = 140;                                 // handle toward the shoulder (c4; dumbbell_biceps_curl :55)
const MIS_FLEX = 45;                                   // the faulty upper arm: 45 deg forward (dumbbell_biceps_curl :61)

const ROOT = [0, 0.87, 0.0];
const feet = { l: { at: [0.10, 0, STEP / 2 + 0.03] }, r: { at: [-0.10, 0, -STEP / 2 + 0.03] } };
const body = { root: { at: ROOT, tilt: TILT }, trunk: 0, neck: -TILT, scap: { elev: 0, pro: 0 }, plant: feet };
const lmB = landmarksOf({ ...body, shoulder: { flex: 0 } }, H);
const HIP_L = lmB['hip.l'];
const freeHand = { at: [HIP_L[0] + 0.10, HIP_L[1] + 0.06, HIP_L[2]], pole: [1, 0, -0.6] };   // hand on the hip (c7)
const arm = elbow => ({ shoulder: { r: { ext: ARM_BACK - TILT, rot: 0 } }, elbow: { r: elbow }, reach: { l: freeHand, r: null }, wrist: 0 });
const start = { ...body, ...arm(0) };
const end = { ...body, ...arm(ELBOW_END) };
const mistakePose = { shoulder: { r: { flex: MIS_FLEX + TILT, rot: 0 } } };

// Column behind the lifter (world z < 0), the low pulley PULLEY_GAP behind the near heel.
const HEEL_Z = landmarksOf(start, H)['heel.r'][2];
const PULLEY_GAP = 0.55;
const LOW = { y: 0.16, r: 0.045 };
LOW.z = HEEL_Z - PULLEY_GAP - LOW.r;
const COL = { z0: LOW.z - 0.06, z1: LOW.z - 0.32, h: 2.14 };
const STACK_Z = (COL.z0 + COL.z1) / 2;
const TOP = { y: COL.h - 0.07, r: 0.035 };
const PLATES = 16, PLATE_H = 0.025, LIFT0 = 0.03;
function lowTangent(b) {                               // upper tangent on the low pulley toward b, lifter side
  const dz = b[2] - LOW.z, dy = b[1] - LOW.y, D = Math.hypot(dz, dy), a0 = Math.atan2(dy, dz), al = Math.acos(LOW.r / D);
  const c = [a0 + al, a0 - al].map(a => [0, LOW.y + LOW.r * Math.sin(a), LOW.z + LOW.r * Math.cos(a)]);
  return c[0][1] > c[1][1] ? c[0] : c[1];
}
// The handle: a D loop around the fist, its ring 7 cm from the grip toward the cable.
const ringOf = lm => { const g = lm['grip.r'], t = lowTangent(g), d = [t[1] - g[1], t[2] - g[2]], L = Math.hypot(...d); return [0, g[1] + d[0] / L * 0.07, g[2] + d[1] / L * 0.07]; };
const handle = lm => {
  const g = lm['grip.r'], r = ringOf(lm), u = [(r[1] - g[1]) / 0.07, (r[2] - g[2]) / 0.07], n = [-u[1], u[0]], w = 0.05;
  const p = (a, b) => [0, g[1] + u[0] * a + n[0] * b, g[2] + u[1] * a + n[1] * b];
  return [p(0.07, 0), p(0.035, w), p(-0.02, w), p(-0.035, 0), p(-0.02, -w), p(0.035, -w)];
};
const cableLen = lm => { const r = ringOf(lm), t = lowTangent(r); return Math.hypot(r[1] - t[1], r[2] - t[2]); };
const LEN_START = cableLen(landmarksOf(start, H));
const twin = (a, b, t = 0.002) => { const dy = b[1] - a[1], dz = b[2] - a[2], L = Math.hypot(dy, dz), ny = -dz / L * t, nz = dy / L * t;
  return [[0, a[1] + ny, a[2] + nz], [0, b[1] + ny, b[2] + nz], [0, b[1] - ny, b[2] - nz], [0, a[1] - ny, a[2] - nz]]; };

// The faulty arm on top: dumbbell_biceps_curl's misArm (pilot A), dashed outlines of the swung upper arm, forearm, fist.
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
const MIS_ARM = (() => {
  const bd = { height: H }, probe = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
  const keys = ['upper.r', 'elbowcap.r', 'fore.r', 'fist.r'];
  return bodyShapes(fk(resolve(normPose({ ...end, ...mistakePose }, bd), bd).q, bd), probe).filter(sh => keys.includes(sh.key))
    .map(sh => (sh.key.includes('cap') ? sh.poly : cr(sh.poly, sh.key.startsWith('fist') ? 4 : 8)).map(([x, y]) => [0, -y / 1000, x / 1000]));
})();
const S_END = landmarksOf(end, H)['shoulder.r'];

export default {
  id: 'bayesian_cable_curl', name: 'Bayesian Cable Curl', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: COL.z1 - 0.1, to: 0.6 },
    { type: 'box', at: [0, 0.022, (COL.z1 - 0.03 + COL.z0 + 0.12) / 2], w: COL.z0 + 0.12 - COL.z1 + 0.03, h: 0.044, rc: 1, z: 'back' },
    { type: 'box', at: [0, COL.h + 0.03, (COL.z1 - 0.03 + COL.z0 + 0.03) / 2], w: COL.z0 - COL.z1 + 0.06, h: 0.06, rc: 1.5 },
    ...[COL.z0, COL.z1].map(z => ({ type: 'box', at: [0, COL.h / 2, z], w: 0.05, h: COL.h, rc: 1 })),
    { type: 'pulley', at: [0, TOP.y, STACK_Z], r: TOP.r },
    { type: 'pulley', at: [0, TOP.y, LOW.z], r: TOP.r },
    { type: 'pulley', at: [0, LOW.y, LOW.z], r: LOW.r },
    { type: 'cable', from: [0, TOP.y + TOP.r, STACK_Z], to: [0, TOP.y + TOP.r, LOW.z], z: 'back' },
    { type: 'cable', from: [0, TOP.y, LOW.z + TOP.r], to: [0, LOW.y, LOW.z + LOW.r], z: 'back' },
    ...[-0.05, 0.05].map(o => ({ type: 'line', cls: 'eq-thin', pts: [[0, 0.06, STACK_Z + o], [0, 1.80, STACK_Z + o]] })),
    lm => {                                            // the stack lifts by the cable paid out (1:1)
      const lift = Math.max(0, LIFT0 + cableLen(lm) - LEN_START);
      return [
        { type: 'stack', base: [0, 0, STACK_Z], plates: PLATES, load: 6, w: 0.16, lift, rods: false, part: 'stack' },
        { type: 'cable', from: [0, TOP.y, STACK_Z], to: [0, 0.06 + PLATES * PLATE_H + lift, STACK_Z], z: 'back', part: 'stack' },
      ];
    },
    lm => ({ type: 'cable', from: lowTangent(ringOf(lm)), to: ringOf(lm), z: 'mid', part: 'handle' }),
    (lm, ctx) => (ctx.pose === 'mistake' ? { type: 'poly', cls: 'eq', z: 'mid', part: 'handle', pts: twin(lowTangent(ringOf(lm)), ringOf(lm)) } : null),
    lm => ({ type: 'poly', cls: 'eq-solid', z: 'front', part: 'handle', pts: handle(lm) }),
  ],
  checks: [
    { landmark: 'wrist.r', at: landmarksOf(start, H)['wrist.r'], pose: 'start', tol: 0.5 },   // the handle in the working hand (c1)
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    // the upper arm stays still (c4, c5): the elbow at one point in start and end
    ...['start', 'end'].map(pose => ({ landmark: 'elbow.r', at: landmarksOf(start, H)['elbow.r'], pose, tol: 0.5 })),
    // the fault (c5): the elbow swung in front of the shoulder joint
    { landmark: 'elbow.r', above: { point: [0, 0, S_END[2] + 0.10], normal: [0, 0, 1] }, pose: 'mistake' },
  ],
  startParts: ['arm.r'],
  ghosts: { count: 3, parts: ['arm.r', 'handle'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  measure: { vertex: 'shoulder.r', from: 'down', to: { at: 'elbow.r', pose: 'start' }, radius: 30, title: 'Upper arm', value: 'about 45°', expect: 45, box: { left: 280, top: 130 } },
  callouts: [
    { key: 'behind', text: 'Arm behind<br>body', anchor: { at: 'elbow.r', off: [0, -4] }, box: { left: 120, top: 140 }, cue: 'Start with the working arm drawn back behind your torso, cable taut.' },
    { key: 'still', text: 'Upper arm<br>still', anchor: { at: 'shoulderTop.r', off: [-4, 0] }, box: { left: 130, top: 92 }, cue: 'Keep the upper arm still. Only the forearm travels.' },
    { key: 'close', text: 'Elbow<br>close', anchor: { at: 'backMid', off: [-4, 0] }, box: { left: 116, top: 188 }, cue: 'Keep the elbow close to your body.' },
  ],
  tempo: [{ phase: 'Curl', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['handle'],
    guides: [
      ...MIS_ARM.map(pts => ({ kind: 'dashed', pts: [...pts, pts[0]] })),
    ],
    tells: [
      { key: 'swing', text: 'Upper arm<br>swings', anchor: { at: 'elbow.r', pose: 'mistake', off: [0, 4] }, box: { left: 258, top: 198 }, cue: 'Your upper arm swings forward so the shoulder helps lift the handle.' },
    ],
  },
  alt: 'Bayesian cable curl, side view. Standing in a split stance facing away from a low cable pulley, leaning slightly forward, the working arm drawn back behind the torso. The upper arm stays still while the elbow bends to bring the handle forward and up toward the shoulder.',
};
