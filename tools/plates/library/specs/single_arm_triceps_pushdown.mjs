// Single-arm triceps pushdown (single D-handle, high pulley, one arm, torso vertical), side view, figure faces the
// column (screen right). H row (D-LIB15R2-MODES; lb5/DESIGN.md 17.4, 17.6): the vertical torso (c16, against the parent's
// 11 deg lean), the one working arm and the single handle (c2) lie outside PARAMS.
// Clone source (D-LIB9-CLONE, copied never imported): triceps_pushdown (pilot A, pinned): the station, the pinned elbow
// E, the grip arc, the start and end elbow angles, the lean-and-arch Mistake builder and its guides. The handle is the
// dHandle composer on main (eq/dHandle.mjs, anchor single_arm_lat_pulldown; imported, never edited), the cable from its
// ring to the head pulley.
// Form: research card docs/research/howto/cards/single_arm_triceps_pushdown.json (research a48b0594), plate section:
//  start "Standing facing the stack, torso vertical and braced (c16), shoulders and hips square (c4); working elbow at
//  the side, hand at about upper-chest level (c7); wrist neutral (c9)"; end "Working arm straight, elbow still at the
//  side and not locked (c5, c8); torso unchanged and not turned (c4)".
// Geometry decisions:
//  - Torso vertical (c16): pelvis tilt and trunk 0, hips over the feet (ROOT z 0); knees soft as the parent.
//  - Working (near, right) arm: the parent's pinned elbow and grip arc. The free (far, left) arm hangs at the side,
//    the hand by the thigh (FREE), in every pose.
//  - Handle (c2): the D-handle grip in the near hand, its ring REACH toward the head pulley along the cable.
// Unsourced numbers (13.3 must-fix 14): the parent's (station, stack, E, START_ELBOW's chest target, END_ELBOW 4), the
//  D-handle's sizes (dHandle.mjs), FREE, every Mistake magnitude (the parent's MIS_*; drawn).
// Callouts, Mistake, tempo: checkpoints c5, c4, c9 are the callouts; plate.mistake c17 (drawable), the parent's lean
//  and arch drawn from the vertical torso; tempo up 1, down 2, pause 1 (c10): Press 1, Hold 1, Return 2.
import { landmarksOf, bodyShapes, fk, resolve, normPose } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { dHandle, dHandleRing, D_HANDLE_ITEMS } from '../eq/dHandle.mjs';

const H = 1.75;
const R = Math.PI / 180;
const TILT = 0, TRUNK = 0, NECK = 0;                   // torso vertical and braced (c16); head level
const ROOT = [0, 0.922, 0];                            // hip-joint midpoint: knees soft (~12 deg), hips over the feet
const FEET = { l: { at: [0.11, 0, 0.06] }, r: { at: [-0.11, 0, 0.06] } };   // feet flat, hip width
const ARM_FWD = 5;                                     // upper arm, deg forward of vertical (elbow pinned at the side)
const ELBOW_X = 0.205;                                 // elbow 2.2 cm inside the shoulder joint (upper arm on the torso side)
const GRIP_X = 0.19;                                   // grip centres +-19 cm: about shoulder width (c2)
const TOP_BAR_T = 0.25;                                // start: bar at upper-chest level (c7), 1/4 of the way from the chest
                                                       //  landmark (nipple line) up to the sternal notch
const END_ELBOW = 4;                                   // end: arms straight, not hard-locked (c8)
const REACH = 0.13;                                    // grip to the handle's cable ring (dHandle reach)

const body = { root: { at: ROOT, tilt: TILT }, trunk: TRUNK, neck: NECK, scap: { elev: -0.5, pro: 0 }, plant: FEET };
// segment lengths from the engine's own skeleton (shoulder->elbow, elbow->grip centre)
const probe = landmarksOf({ ...body, shoulder: { flex: 0 }, elbow: 0 }, H);
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const L1 = dist(probe['shoulder.r'], probe['elbow.r']), L2 = dist(probe['elbow.r'], probe['grip.r']);
const S = probe['shoulder.r'];                         // right shoulder joint (x < 0)

// Fixed elbow E (right side; the left side mirrors x).
const EDX = -ELBOW_X - S[0], Ls = Math.sqrt(L1 * L1 - EDX * EDX);
const E = [-ELBOW_X, S[1] - Ls * Math.cos(ARM_FWD * R), S[2] + Ls * Math.sin(ARM_FWD * R)];
const U = [(E[0] - S[0]) / L1, (E[1] - S[1]) / L1, (E[2] - S[2]) / L1];      // upper-arm direction
// Grip on the forearm circle about E at elbow flexion phi: forearm dir f with f.x fixed by the grip width.
const FX = (-GRIP_X - E[0]) / L2, FC = Math.sqrt(1 - FX * FX);
const gripAt = phi => {
  const target = Math.cos(phi * R);                   // f . U = cos(flexion)
  let lo = 0, hi = Math.PI;                            // alpha: forearm angle from straight down, forward positive
  const dot = a => FX * U[0] + (-FC * Math.cos(a)) * U[1] + (FC * Math.sin(a)) * U[2];
  for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (dot(mid) > target) lo = mid; else hi = mid; }
  const a = (lo + hi) / 2;
  return [E[0] + L2 * FX, E[1] - L2 * FC * Math.cos(a), E[2] + L2 * FC * Math.sin(a)];
};
// IK pole: from the shoulder-grip line toward E (the elbow lands on E)
const poleTo = g => {
  const d = [g[0] - S[0], g[1] - S[1], g[2] - S[2]], k = Math.hypot(...d), u = d.map(v => v / k);
  const e = [E[0] - S[0], E[1] - S[1], E[2] - S[2]], t = e[0] * u[0] + e[1] * u[1] + e[2] * u[2];
  const p = e.map((v, i) => v - u[i] * t), n = Math.hypot(...p) || 1;
  return p.map(v => v / n);
};
// the free (far) arm hangs at the side, the hand by the thigh, in start, end and every key
const FREE = { at: [0.2, 0.84, 0.06], pole: [0.3, 0, -1] };
const armsAt = phi => {
  const g = gripAt(phi), pole = poleTo(g);
  return { l: FREE, r: { at: g, pole } };
};
// START_ELBOW: the flexion that puts the bar at the upper-chest target height (bisection; bar height rises with flexion)
const lmB = landmarksOf({ ...body, shoulder: { flex: 0 } }, H);
const TOP_BAR_Y = lmB.chest[1] + (lmB.sternum[1] - lmB.chest[1]) * TOP_BAR_T;
const START_ELBOW = (() => { let lo = 60, hi = 160; for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (gripAt(m)[1] < TOP_BAR_Y) lo = m; else hi = m; } return +((lo + hi) / 2).toFixed(1); })();
const SEG = 12;                                        // key poses every 1/12 of the sweep (~10 deg of forearm)
const PHIS = Array.from({ length: SEG + 1 }, (_, i) => i / SEG).map(t => START_ELBOW + (END_ELBOW - START_ELBOW) * t);
const [start, ...rest] = PHIS.map(phi => ({ ...body, reach: armsAt(phi) }));
const end = rest.pop(), via = rest;

// Station (side-view plane), sized like the approved lat pulldown tower.
const HEAD = { z: 0.50, y: 2.03, r: 0.045 };           // head pulley on the boom, 12 cm in front of the column
const COL = { z0: 0.62, z1: 0.88, h: 2.14 };           // column uprights (front/back), height
const COLP = { r: 0.035 };
const STACK_Z = (COL.z0 + COL.z1) / 2;
COLP.z = STACK_Z - COLP.r; COLP.y = HEAD.y + HEAD.r - COLP.r;
const PLATES = 16, PLATE_H = 0.025, LIFT0 = 0.03;

function headTangent(b) {                              // cable from the bar to its tangent on the lifter side of the pulley
  const dz = b[2] - HEAD.z, dy = b[1] - HEAD.y, D = Math.hypot(dz, dy), a0 = Math.atan2(dy, dz), al = Math.acos(HEAD.r / D);
  const c = [a0 + al, a0 - al].map(a => [0, HEAD.y + HEAD.r * Math.sin(a), HEAD.z + HEAD.r * Math.cos(a)]);
  return c[0][2] < c[1][2] ? c[0] : c[1];
}
const toward = g => { const d = [0, HEAD.y - g[1], HEAD.z - g[2]], L = Math.hypot(...d); return d.map(v => v / L); };
const barOf = lm => dHandleRing(lm['grip.r'], toward(lm['grip.r']), REACH);   // the handle's cable ring
const cableLen = b => Math.hypot(b[1] - HEAD.y, b[2] - HEAD.z);

// Mistake (card plate.mistake, c11): "Leaning too far forward over the bar or arching the back to press it down."
// Drawn mid-press: the trunk tips well forward from the hips over the bar (pelvis MIS_TILT further forward), the low
// back arches a little (the lumbar extends MIS_ARCH, so the thorax tips less than the pelvis), the upper arms stay at
// the torso sides and the elbows bend to press the bar down. The card gives no angle, so MIS_* are drawn just large
// enough to read at 390 px. The bar's cable is a line (no `poly`), so the faulty cable is a dashed guide (the lat
// pulldown's method).
const MIS_TILT = 42, MIS_ARCH = 14, MIS_SHOULDER = 25, MIS_ELBOW = 75;   // extra pelvis tilt, lumbar extension, upper arm
                                                       //  flexion relative to the leaning thorax (arm along the side), elbow
const MIS_HIPS = 0.07, MIS_DROP = 0.008;              // hips pushed back as the trunk tips (weight over the feet), knees kept soft
const mistakePose = { root: { at: [ROOT[0], ROOT[1] - MIS_DROP, ROOT[2] - MIS_HIPS], tilt: TILT + MIS_TILT }, trunk: TRUNK - MIS_ARCH, reach: null, shoulder: { l: { flex: 0 }, r: { flex: MIS_SHOULDER } }, elbow: { l: 0, r: MIS_ELBOW }, wrist: 0 };
// R5 (critic 10-03): the faulty upper arm drawn as the clear solid red segment: the engine's own outline of the faulty
// near upper arm (side view, sampled on its Catmull-Rom spline) as a solid Mistake guide, and the faulty forearm and
// hand as dashed guides, kept apart from the dashed leaning torso and head (the masked engine arm outline tangled with
// them, so the near arm is no longer in `parts`).
const misArm = (() => {
  const bd = { height: H }, probe = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
  const cr = ps => { const n = ps.length, g = i => ps[(i + n) % n], out = [];
    for (let i = 0; i < n; i++) { const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
      for (let k = 0; k < 8; k++) { const t = k / 8, u = 1 - t, c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        out.push([0, 1].map(d => u * u * u * p1[d] + 3 * u * u * t * c1[d] + 3 * u * t * t * c2[d] + t * t * t * p2[d])); } }
    return out; };
  const shapes = bodyShapes(fk(resolve(normPose({ ...end, ...mistakePose }, bd), bd).q, bd), probe);
  const get = key => { const sh = shapes.find(x => x.key === key), pts = (key.includes('cap') ? sh.poly : cr(sh.poly)).map(([x, y]) => [0, -y / 1000, x / 1000]); return [...pts, pts[0]]; };
  return { upper: get('upper.r'), rest: ['elbowcap.r', 'fore.r', 'fist.r'].map(get) };
})();
const lmM = landmarksOf({ ...end, ...mistakePose }, H), MIS_BAR = barOf(lmM);

export default {
  id: 'single_arm_triceps_pushdown', name: 'Single-Arm Triceps Pushdown', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end, via },
  equipment: [
    { type: 'floor', from: -0.5, to: 1.1 },
    { type: 'box', at: [0, 0.022, (0.40 + COL.z1) / 2], w: COL.z1 - 0.40, h: 0.044, rc: 1, z: 'back' },      // base rail (ahead of the toes)
    { type: 'box', at: [0, COL.h + 0.03, (HEAD.z - 0.08 + COL.z1 + 0.03) / 2], w: COL.z1 + 0.03 - HEAD.z + 0.08, h: 0.06, rc: 1.5 },   // boom
    { type: 'line', cls: 'eq', pts: [[0, COL.h, HEAD.z], [0, HEAD.y, HEAD.z]] },       // head pulley hanger
    { type: 'line', cls: 'eq', pts: [[0, COL.h, COLP.z], [0, COLP.y, COLP.z]] },       // column pulley hanger
    ...[COL.z0, COL.z1].map(z => ({ type: 'box', at: [0, COL.h / 2, z], w: 0.05, h: COL.h, rc: 1 })),
    { type: 'pulley', at: [0, HEAD.y, HEAD.z], r: HEAD.r },
    { type: 'pulley', at: [0, COLP.y, COLP.z], r: COLP.r },
    { type: 'cable', from: [0, HEAD.y + HEAD.r, HEAD.z], to: [0, COLP.y + COLP.r, COLP.z], z: 'back' },
    ...[-0.05, 0.05].map(o => ({ type: 'line', cls: 'eq-thin', pts: [[0, 0.06, STACK_Z + o], [0, 1.95, STACK_Z + o]] })),   // guide rods
    (lm, ctx) => {                                     // stack lifts by the cable paid out (1:1)
      const lift = LIFT0 + cableLen(barOf(lm)) - cableLen(barOf(ctx.start));
      return [
        { type: 'stack', base: [0, 0, STACK_Z], plates: PLATES, load: 8, w: 0.16, lift, rods: false, part: 'stack' },
        { type: 'cable', from: [0, COLP.y, STACK_Z], to: [0, 0.06 + PLATES * PLATE_H + lift, STACK_Z], z: 'back', part: 'stack' },
      ];
    },
    ...perItem(dHandle({ grip: lm => lm['grip.r'], toward, reach: REACH, z: 'mid', part: 'bar' }), D_HANDLE_ITEMS),   // single handle (c2)
    lm => ({ type: 'cable', from: barOf(lm), to: headTangent(barOf(lm)), z: 'mid', part: 'bar' }),
  ],
  checks: [
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },   // feet flat ON the floor
    { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    ...['start', 'end'].map(pose => ({ landmark: 'elbow.r', at: E, pose, tol: 0.5 })),                 // elbow pinned (start and end)
    ...['start', 'end'].map(pose => ({ landmark: 'hip.r', plane: { point: [0, 0, ROOT[2]], normal: [0, 0, 1] }, pose, tol: 0.5 })),   // hips under the shoulders: torso vertical (c16)
    { landmark: 'grip.r', above: { point: [-(0.0875 + 0.075), 0, 0], normal: [-1, 0, 0] }, pose: 'end' },   // one hand: the grip ends beside the thigh, outside its 7.5 cm radius
  ],
  ghosts: { count: 3, parts: ['arm.r', 'bar'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  measure: { vertex: 'elbow.r', from: 'shoulder.r', to: 'wrist.r', radius: 18, title: 'Elbow', value: 'not locked', box: { left: 44, top: 216 } },
  callouts: [
    { key: 'elbow', text: 'Elbow<br>pinned', anchor: 'elbow.r', cue: 'Keep the working upper arm at your side so only the forearm moves.' },
    { key: 'torso', text: 'Square<br>torso', anchor: 'backUpper', box: { left: 56, top: 124 }, cue: 'Keep the shoulders and hips square. The body does not turn.' },
    { key: 'wrist', text: 'Neutral<br>wrist', anchor: 'wrist.r', cue: 'Keep the hand in line with the forearm from top to bottom.' },
  ],
  tempo: [{ phase: 'Press', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['torso', 'head', 'bar'],   // the near arm is drawn as guides (R5); far arm doubles it; the stack's travel is not the fault
    guides: [
      { kind: 'line', pts: misArm.upper },                                          // the faulty upper arm, solid (R5)
      ...misArm.rest.map(pts => ({ kind: 'dashed', pts })),
      { kind: 'dashed', pts: [MIS_BAR, headTangent(MIS_BAR)] },
      { kind: 'arc-arrow', center: 'hips', r: 108, a0: -84, a1: -56 },   // the trunk tipping forward from the hips
    ],
    tells: [
      { key: 'lean', text: 'Leaning<br>over', anchor: { at: 'backUpper', pose: 'mistake' }, cue: 'You lean over the handle or arch your back to push it down.' },
    ],
  },
  alt: 'Single-arm triceps pushdown, side view. Standing tall at a high cable with the torso vertical, one upper arm pinned at the side, the lifter presses a single handle from upper-chest level down to a straight arm, the other arm hanging.',
};
