// Rope triceps pushdown (rope attachment, high pulley, neutral grip), side view, figure faces the column (screen right).
// View: SIDE (card plate.view). The elbow bends front-to-back and the fault the card names (elbows drifting forward,
// c7) plus the bottom line of wrist, elbow and shoulder (c9) read side-on. The rope ends spreading apart at the bottom
// (c4) is lateral and does not show in this view (card: it goes to a zoom); the hands are still spread in the pose, so
// the rope strands and the angles are true.
// Form sources: research card rope_triceps_pushdown (claims c1-c11: ACE triceps pressdown; NSCA Exercise Technique
//  Manual 3rd ed.), which this plate follows; the numbers below are named constants for the card to confirm.
// Geometry decisions:
//  - Torso: pelvis tilt 8 + trunk 3 = about 11 deg forward lean from the hips, back flat (c10); knees soft (~12 deg);
//    feet flat and parallel, 22 cm apart (hip width, c10). Centre of mass over the mid-foot.
//  - Elbow FIXED in the world at E, 1.5 deg behind the plumb line from the shoulder joint (ARM_FWD) and 2.2 cm inside it (upper arm on
//    the torso side, c6), so at the bottom wrist, elbow and shoulder stand in one vertical line (c9). Each key pose puts
//    the grip on the forearm sphere about E and the IK pole points at E: the solved elbow sits on E, the upper arm
//    never moves.
//  - Start: forearms just past parallel (c8): elbow flexion 100 (about 10 deg above horizontal). Hands against the
//    knobs, neutral grip (c2, c3), grip centres 14 cm apart (knobs close together under the ferrule).
//  - End: arms straight, elbows not locked (c9): elbow 4 deg. Rope ends spread (c4): grip centres 37 cm apart, beside
//    the thighs (the straight arm from a pinned elbow allows no wider without abducting the shoulder).
//  - Grip spread follows the elbow angle linearly between the two ends.
//  - Rope: library `rope` composer, strands 30 cm ferrule-to-knob, knobs 5.5 cm past the grip centre (defaults), cable
//    from the head pulley's lifter-side tangent to the ferrule. The ferrule rides 23 cm above the hands at the top and
//    16 cm at the bottom (the strands open as the hands spread).
//  - Path: an arc about the elbow; `via` keys every 1/12 of the sweep put the in-between grips (and the 3 ghosts at
//    t = .25/.5/.75, keys 3/6/9) ON the arc; the trace chords sag under 0.2 px.
//  - Station: the same selectorised tower as triceps_pushdown / the approved lat pulldown (boom, head pulley 2.03 m up,
//    column pulley, 16 x 5 kg stack), pulley at its top position (c1). Stack travel = cable change (1:1), 3 cm pre-lift.
// CARD: START_ELBOW (c8), END_ELBOW (c9), TILT + TRUNK lean (c10), ROOT knee bend, GRIP_X0 / GRIP_X1 (c4), ARM_FWD (c9),
//  pulley height (c1).
import { landmarksOf } from '../engine.mjs';
import { rope, ropeGeometry, ROPE_ITEMS } from '../eq/rope.mjs';
import { perItem } from '../eq/parts.mjs';

const H = 1.75;
const R = Math.PI / 180;
const TILT = 8, TRUNK = 3, NECK = -8;                  // ~11 deg forward lean from the hips, back flat (c4); head level
const ROOT = [0, 0.922, -0.045];                       // hip-joint midpoint: knees soft (~12 deg), hips a little back
const FEET = { l: { at: [0.11, 0, 0.06] }, r: { at: [-0.11, 0, 0.06] } };   // feet flat, hip width
const ARM_FWD = -1.5;                                  // upper arm 1.5 deg back of vertical: with the 4 deg soft elbow, shoulder,
                                                       //  elbow and wrist stand in one vertical line at the bottom (c9)
const ELBOW_X = 0.205;                                 // elbow 2.2 cm inside the shoulder joint (upper arm on the torso side)
const GRIP_X0 = 0.07, GRIP_X1 = 0.185;                 // grip centres +-7 cm at the top, +-18.5 cm at the bottom (rope ends apart, c4)
const START_ELBOW = 100;                               // start: forearms just past parallel (c8)
const END_ELBOW = 4;                                   // end: arms straight, not locked (c9)

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
// Grip on the forearm sphere about E at elbow flexion phi: forearm dir f with f.x set by the grip spread at phi.
const gxAt = phi => GRIP_X0 + (GRIP_X1 - GRIP_X0) * (START_ELBOW - phi) / (START_ELBOW - END_ELBOW);
const gripAt = phi => {
  const FX = (-gxAt(phi) - E[0]) / L2, FC = Math.sqrt(1 - FX * FX);
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
const mid = lm => [0, lm.grips[1], lm.grips[2]];
const gripsOf = lm => ({ l: lm['grip.l'], r: lm['grip.r'] });
const ferruleOf = lm => ropeGeometry({ pulley: headTangent(mid(lm)), grips: gripsOf(lm) }).ferrule;
const cableLen = lm => { const f = ferruleOf(lm); return Math.hypot(f[1] - HEAD.y, f[2] - HEAD.z); };

export default {
  id: 'rope_triceps_pushdown', name: 'Rope Triceps Pushdown', view: 'side', facing: 'right',
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
      const lift = LIFT0 + cableLen(lm) - cableLen(ctx.start);
      return [
        { type: 'stack', base: [0, 0, STACK_Z], plates: PLATES, load: 8, w: 0.16, lift, rods: false, part: 'stack' },
        { type: 'cable', from: [0, COLP.y, STACK_Z], to: [0, 0.06 + PLATES * PLATE_H + lift, STACK_Z], z: 'back', part: 'stack' },
      ];
    },
    ...perItem((lm, ctx) => rope({ pulley: headTangent(mid(lm)), grips: gripsOf(lm), part: 'rope', mistakeTwin: true, ctx }), ROPE_ITEMS),   // rope in the hands, cable to the pulley
  ],
  checks: [
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },   // feet flat ON the floor
    { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'elbow.r', at: E, pose: 'all', tol: 0.5 },                                           // elbow pinned (start and end)
    { landmark: 'elbow.r', plane: { point: S, normal: [0, 0, 1] }, pose: 'end', tol: 1 },              // shoulder, elbow, wrist
    { landmark: 'wrist.r', plane: { point: S, normal: [0, 0, 1] }, pose: 'end', tol: 1 },              //  in one vertical line (c9)
  ],
  ghosts: { count: 3, parts: ['arm.r', 'rope'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  callouts: [],
  alt: 'Rope triceps pushdown, side view. Standing at a high cable tower with a slight forward lean, upper arms pinned at the sides, the lifter presses a rope from forearms just past level down in an arc to straight arms, the hands finishing beside the thighs with the rope ends apart.',
};
