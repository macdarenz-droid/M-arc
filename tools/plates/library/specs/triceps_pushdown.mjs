// Triceps pushdown (straight bar, high pulley, overhand grip), side view, figure faces the column (screen right).
// View: SIDE. What a coach checks is sagittal: the upper arms pinned at the sides (the elbow is the only joint that
// moves), the forearm sweeping from above level (bar at the upper chest) down to a straight arm, the bar path an arc about the elbow that
// ends just in front of the thighs, and a still, slightly forward-leaning torso. The front view would show only the
// grip width.
// Form sources: research card triceps_pushdown (claims c1-c14: ACE triceps pressdown; NSCA Exercise Technique Manual
//  3rd ed.), which this plate follows; every number below is a named constant for the card to confirm.
// Geometry decisions:
//  - Torso: pelvis tilt 8 + trunk 3 = about 11 deg forward lean from the hips, back flat (c4: "slight forward lean ...
//    from the hips ... so the bar clears the body at the bottom"); knees soft (~12 deg); feet flat and parallel, 22 cm
//    apart (hip width, c3). Centre of mass over the mid-foot (hips back, arms forward).
//  - Elbow FIXED in the world (c5, c14): one elbow point E, 5 deg forward of the plumb line from the shoulder joint and
//    2.2 cm inside it (upper arm against the torso side). Each key pose puts the grip on the forearm circle about E and
//    the IK pole points at E, so the solved elbow sits on E (checks: 0 cm) and the upper arm never moves.
//  - Grip: overhand, about shoulder width (c2): grip centres 38 cm apart; straight bar 56 cm, 28 mm. Side view shows it
//    end-on (latBar straight = width, drop 0: one circle under the fist).
//  - Start (c7): bar at about upper-chest level, i.e. a quarter of the way from the chest landmark (nipple line) up to
//    the sternal notch: 1.29 m, which the pinned elbow reaches at 128 deg of flexion (forearm ~43 deg above level).
//  - End (c8): arms straight, not hard-locked: elbow 4 deg; the bar finishes 5.6 cm clear of the thigh front (check).
//  - Bar path: an arc about the elbow. `via` keys every 1/12 of the sweep put the in-between grips (and the 3 ghosts at
//    t = .25/.5/.75, keys 3/6/9) ON the arc; the trace chords between keys turn by ~10 deg and sag under 0.2 px.
//  - Station (c1: pulley at its top position, above head height): selectorised tower like the approved lat pulldown
//    (boom, head pulley 2.03 m up, column pulley, 16 x 5 kg stack in a 26 cm column). The head pulley sits 55 cm in
//    front of the hip joints, so the cable runs 14 deg (top) to 16 deg (bottom) off vertical toward the lifter and
//    clears the forearm. Stack travel = cable paid out (1:1, 60 cm), 3 cm pre-lift at the start (tension on).
// CARD: TOP_BAR_T -> START_ELBOW (c7), END_ELBOW (c8), TILT + TRUNK lean (c4), ROOT knee bend, FEET stance (c3),
//  GRIP_X (c2), ARM_FWD (c5), bar length, pulley height (c1).
import { landmarksOf } from '../engine.mjs';

const H = 1.75;
const R = Math.PI / 180;
const TILT = 8, TRUNK = 3, NECK = -8;                  // ~11 deg forward lean from the hips, back flat (c4); head level
const ROOT = [0, 0.922, -0.045];                       // hip-joint midpoint: knees soft (~12 deg), hips a little back
const FEET = { l: { at: [0.11, 0, 0.06] }, r: { at: [-0.11, 0, 0.06] } };   // feet flat, hip width
const ARM_FWD = 5;                                     // upper arm, deg forward of vertical (elbow pinned at the side)
const ELBOW_X = 0.205;                                 // elbow 2.2 cm inside the shoulder joint (upper arm on the torso side)
const GRIP_X = 0.19;                                   // grip centres +-19 cm: about shoulder width (c2)
const TOP_BAR_T = 0.25;                                // start: bar at upper-chest level (c7), 1/4 of the way from the chest
                                                       //  landmark (nipple line) up to the sternal notch
const END_ELBOW = 4;                                   // end: arms straight, not hard-locked (c8)
const BAR_W = 0.56;                                    // straight pushdown bar 56 cm (22 in), 28 mm

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
const armsAt = phi => {
  const g = gripAt(phi), pole = poleTo(g);
  return { l: { at: [-g[0], g[1], g[2]], pole: [-pole[0], pole[1], pole[2]] }, r: { at: g, pole } };
};
// START_ELBOW: the flexion that puts the bar at the upper-chest target height (bisection; bar height rises with flexion)
const lmB = landmarksOf({ ...body, shoulder: { flex: 0 } }, H);
const TOP_BAR_Y = lmB.chest[1] + (lmB.sternum[1] - lmB.chest[1]) * TOP_BAR_T;
const START_ELBOW = (() => { let lo = 60, hi = 160; for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (gripAt(m)[1] < TOP_BAR_Y) lo = m; else hi = m; } return +((lo + hi) / 2).toFixed(1); })();
const SEG = 12;                                        // key poses every 1/12 of the sweep (~10 deg of forearm)
const PHIS = Array.from({ length: SEG + 1 }, (_, i) => i / SEG).map(t => START_ELBOW + (END_ELBOW - START_ELBOW) * t);
const [start, ...rest] = PHIS.map(phi => ({ ...body, reach: armsAt(phi) }));
const end = rest.pop(), via = rest;

// Thigh front at the bar's end height: the bar must finish in front of the thighs, not in them.
const lmE = landmarksOf(end, H);
const G_END = gripAt(END_ELBOW);
const THIGH_FRONT = (() => {
  const h = lmE['hip.r'], k = lmE['knee.r'], t = (h[1] - G_END[1]) / (h[1] - k[1]);
  const c = h.map((v, i) => v + (k[i] - v) * t), d = [0, k[1] - h[1], k[2] - h[2]], L = Math.hypot(...d);
  const n = [0, -d[2] / L, d[1] / L];                  // thigh-axis normal, pointing forward (+z)
  const nf = n[2] < 0 ? n.map(v => -v) : n;
  return { point: c.map((v, i) => v + nf[i] * 0.075), normal: nf };   // 7.5 cm thigh radius at that level
})();

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
const barOf = lm => [0, lm.grips[1], lm.grips[2]];
const cableLen = b => Math.hypot(b[1] - HEAD.y, b[2] - HEAD.z);

export default {
  id: 'triceps_pushdown', name: 'Triceps Pushdown', view: 'side', facing: 'right',
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
    (lm) => {                                          // straight bar end-on in the hands, cable up to the head pulley
      const b = barOf(lm);
      return [
        { type: 'latBar', at: b, width: BAR_W, straight: BAR_W, drop: 0, z: 'mid', part: 'bar' },
        { type: 'cable', from: b, to: headTangent(b), z: 'mid', part: 'bar' },
      ];
    },
  ],
  checks: [
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },   // feet flat ON the floor
    { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'elbow.r', at: E, pose: 'all', tol: 0.5 },                                           // elbow pinned (start and end)
    { landmark: 'grip.r', above: THIGH_FRONT, pose: 'end' },                                          // bar ends in front of the thigh
  ],
  ghosts: { count: 3, parts: ['arm.r', 'bar'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  callouts: [],
  alt: 'Triceps pushdown, side view. Standing at a high cable tower with a slight forward lean, upper arms pinned at the sides, the lifter presses a straight bar from forearms about level down in an arc to straight arms in front of the thighs.',
};
