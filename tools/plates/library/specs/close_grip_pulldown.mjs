// Close-grip pulldown (V-handle, neutral grip, handle to just below the chin), side view, figure faces the machine
// (screen right). LB1, mode H (plan 6.2 had D; the D/H reasons are in lb1/DESIGN.md). Clone source: lat_pulldown
// (golden A): the same selectorised station, seat, knee roller, boom, pulleys and stack, drawn the same way.
// View: side (card plate.view, census view): the handle path in front of the face, the elbows driven down to the
// hips, the unchanged lean and the fault (the handle pulled past the chin, elbows going back) are all sagittal.
// Source: docs/research/howto/cards/close_grip_pulldown.json (claude/libht-research). Claims used: c1 (V-handle, close
// neutral grip), c2/c3 (thigh pad tight on top of the thighs), c4 (slight lean, no more than about 30 deg, no extra lean
// during the pull), c5 (elbows down toward the hips, upper arms tucked, handle just below the chin), c6/c7 (the fault:
// the handle pulled too low, the elbows moving back), c9 (shoulder blades down first), c10 (tempo 2 s / 2 s).
// Geometry decisions:
//  - Machine and seat exactly as lat_pulldown (seat top 42 cm, knee roller on the thighs, head pulley 2.08 m, column
//    pulley, 16 x 5 kg stack), so the batch draws the same station the same way (rubric R7).
//  - V-handle (vHandle primitive: grips 15 cm apart, 22 cm to the cable ring) on the cable from the head pulley.
//  - The lean is the same at the start and the end (c4: no extra lean during the pull): pelvis tilt -8, trunk -3, a
//    13 deg lean at the hip, under the 30 deg limit.
//  - End: grip centres 6 cm under the chin and 9 cm in front of it (just below the chin, c5); the elbow pole points
//    down and a little back, so the elbows finish at the front edge of the trunk, below the shoulders.
//  - Mistake (card plate.mistake, c6, c7): the handle comes down to the lower chest and the elbows travel back behind
//    the trunk. The torso keeps the correct lean, so the one fault reads alone.
import { rootOnSeat, landmarksOf } from '../engine.mjs';

const H = 1.75;
const SEAT_TOP = 0.42;
const SEAT = [0, SEAT_TOP, 0];
const feet = { l: { at: [0.10, 0, 0.50] }, r: { at: [-0.10, 0, 0.50] } };
const GX = 0.075;                                       // V-handle grips 15 cm apart (vHandle sep)
const RING = 0.22;                                      // grips to the cable ring (vHandle length)
const HEAD = { z: 0.17, y: 2.08, r: 0.045 };
const COL = { z0: 0.86, z1: 1.12, h: 2.16 };
const COLP = { r: 0.035 };
const STACK_Z = (COL.z0 + COL.z1) / 2;
COLP.z = STACK_Z - COLP.r; COLP.y = HEAD.y + HEAD.r - COLP.r;

const TILT = -8, TRUNK = -3;
const body = { root: { at: rootOnSeat(SEAT, TILT), tilt: TILT }, trunk: TRUNK, neck: -4, plant: feet };
const lm0 = landmarksOf({ ...body, shoulder: { flex: 0 } }, H);
const grips = (c, pole) => ({
  l: { at: [GX, c[1], c[2]], pole: [pole[0], pole[1], pole[2]] },
  r: { at: [-GX, c[1], c[2]], pole: [-pole[0], pole[1], pole[2]] },
});
// End handle: grip centre 6 cm under the chin, 9 cm in front of it.
const END_G = [0, lm0.chin[1] - 0.06, lm0.chin[2] + 0.09];
// The handle hangs on the cable from the head pulley: its ring sits RING along the cable line above the grips.
const toward = g => { const d = [0, HEAD.y - g[1], HEAD.z - g[2]], L = Math.hypot(...d); return d.map(v => v / L); };
const ringOf = g => { const t = toward(g); return [0, g[1] + t[1] * RING, g[2] + t[2] * RING]; };
// Start: arms straight overhead on the same cable line (the handle travels along it).
const cd = toward(END_G);
const START_Y = 1.607;
const START_G = [0, START_Y, END_G[2] + cd[2] / cd[1] * (START_Y - END_G[1])];

const start = { ...body, scap: { elev: 0, pro: 0 }, reach: grips(START_G, [1, 0.1, 0.2]) };
const end = { ...body, scap: { elev: -2, pro: -2 }, reach: grips(END_G, [0.25, -1, -0.15]) };
// Mistake: the handle pulled down to the lower chest, the elbows driven back behind the trunk.
const MIS_G = [0, lm0.chest[1] - 0.15, lm0.chest[2] + 0.05];
const misBody = { reach: grips(MIS_G, [0.3, 0.35, -1]) };

const PAD_AT = lm0['thighTop.r'];
const PAD = { at: [0, PAD_AT[1], PAD_AT[2]], r: 0.055 };

function headTangent(b) {
  const dz = b[2] - HEAD.z, dy = b[1] - HEAD.y, D = Math.hypot(dz, dy), a0 = Math.atan2(dy, dz), al = Math.acos(HEAD.r / D);
  const c = [a0 + al, a0 - al].map(a => [0, HEAD.y + HEAD.r * Math.sin(a), HEAD.z + HEAD.r * Math.cos(a)]);
  return c[0][2] < c[1][2] ? c[0] : c[1];
}
const gripOf = lm => [0, lm.grips[1], lm.grips[2]];
const cableLen = g => Math.hypot(ringOf(g)[1] - HEAD.y, ringOf(g)[2] - HEAD.z);
const LIFT0 = 0.03;
// Lean construction (end pose): plumb line up from the hip joint and the trunk axis, over the figure, as lat_pulldown.
const HIP_E = [0, lm0['hip.r'][1], lm0['hip.r'][2]];
const TU = (() => { const d = [0, lm0['shoulder.r'][1] - HIP_E[1], lm0['shoulder.r'][2] - HIP_E[2]], L = Math.hypot(...d); return d.map(v => v / L); })();
const RAY = 0.33;
const LEAN_UP = [0, HIP_E[1] + RAY, HIP_E[2]], LEAN_AX = HIP_E.map((v, i) => v + TU[i] * RAY);

export default {
  id: 'close_grip_pulldown', name: 'Close-Grip Pulldown', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.5, to: 1.3 },
    ...[[-0.22, 0.30], [0.66, COL.z1]].map(([a, b]) => ({ type: 'box', at: [0, 0.022, (a + b) / 2], w: b - a, h: 0.044, rc: 1, z: 'center' })),
    { type: 'box', at: [0, COL.h + 0.03, (HEAD.z - 0.08 + COL.z1 + 0.03) / 2], w: COL.z1 + 0.03 - HEAD.z + 0.08, h: 0.06, rc: 1.5 },
    { type: 'line', cls: 'eq', pts: [[0, COL.h, HEAD.z], [0, HEAD.y, HEAD.z]] },
    { type: 'line', cls: 'eq', pts: [[0, COL.h, COLP.z], [0, COLP.y, COLP.z]] },
    ...[COL.z0, COL.z1].map(z => ({ type: 'box', at: [0, COL.h / 2, z], w: 0.05, h: COL.h, rc: 1 })),
    { type: 'seat', at: [0, SEAT_TOP, 0.02], len: 0.42 },
    { type: 'kneePad', at: PAD.at, r: PAD.r, normal: [0, 1, 0], postTo: [0, 0.26, 0.03], z: 'center' },
    { type: 'kneePad', at: PAD.at, r: PAD.r, normal: [0, 1, 0], z: 'front' },
    { type: 'pulley', at: [0, HEAD.y, HEAD.z], r: HEAD.r },
    { type: 'pulley', at: [0, COLP.y, COLP.z], r: COLP.r },
    { type: 'cable', from: [0, HEAD.y + HEAD.r, HEAD.z], to: [0, COLP.y + COLP.r, COLP.z], z: 'back' },
    (lm, ctx) => {
      const lift = LIFT0 + cableLen(gripOf(lm)) - cableLen(gripOf(ctx.start));   // the cable pays out as the handle comes down: the stack rises
      return [
        { type: 'stack', base: [0, 0, STACK_Z], plates: 16, load: 8, w: 0.16, lift, rods: false, part: 'stack' },
        { type: 'cable', from: [0, COLP.y, STACK_Z], to: [0, 0.06 + 16 * 0.025 + lift, STACK_Z], z: 'back', part: 'stack' },
      ];
    },
    // V-handle in both hands (in front of the trunk, behind the near arm) and its cable to the head pulley
    (lm) => {
      const g = gripOf(lm);
      return [
        { type: 'vHandle', at: g, toward: toward(g), length: RING, z: 'mid', part: 'handle' },
        { type: 'cable', from: ringOf(g), to: headTangent(ringOf(g)), z: 'mid', part: 'handle' },
      ];
    },
    (lm, ctx) => (ctx.pose === 'end' && !ctx.mistake ? [
      { type: 'line', cls: 'eq-line datum', pts: [HIP_E, LEAN_UP], z: 'front' },
      { type: 'line', cls: 'eq-line', pts: [HIP_E, LEAN_AX], z: 'front' },
    ] : null),
    ...[-0.05, 0.05].map(o => ({ type: 'line', cls: 'eq-thin', pts: [[0, 0.06, STACK_Z + o], [0, 1.95, STACK_Z + o]] })),
  ],
  checks: [
    { landmark: 'seat', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'thighTop.r', plane: { point: PAD.at, normal: [0, 1, 0] }, pose: 'all', tol: 1 },
    { landmark: 'thighUnder.r', above: { point: SEAT, normal: [0, 1, 0] }, pose: 'all' },
  ],
  ghosts: { count: 3, parts: ['arm.r', 'handle'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  measure: { vertex: 'hip.r', from: 'up', to: 'shoulder.r', radius: 40, title: 'Lean back', value: 'under 30°' },
  callouts: [
    { key: 'thighs', text: 'Thighs<br>pinned', anchor: 'thighTop.r', box: { left: 180, top: 226 }, cue: 'Set the thigh pad tight on top of the thighs.' },
    { key: 'elbows', text: 'Elbows<br>to hips', anchor: 'elbow.r', box: { left: 172, top: 180 }, cue: 'Drive the elbows down toward the hips, upper arms tucked at the sides.' },
    { key: 'chin', text: 'Handle<br>below chin', anchor: 'grip.r', box: { left: 150, top: 132 }, cue: 'Stop when the handle is just below the chin.' },
  ],
  tempo: [{ phase: 'Pull', s: 2, move: true }, { phase: 'Return', s: 2, move: true }],
  mistake: {
    pose: misBody,
    parts: ['arm.r', 'handle'],
    guides: [
      { kind: 'dashed', pts: [ringOf(MIS_G), headTangent(ringOf(MIS_G))] },
      // the faulty handle sits inside the solid arm: its V-handle redrawn as hidden lines (as pull_up redraws its hang)
      { kind: 'dashed', pts: [MIS_G, ringOf(MIS_G)] },
      { kind: 'dashed', pts: [[0, MIS_G[1] - 0.06, MIS_G[2]], [0, MIS_G[1] + 0.06, MIS_G[2]]] },
      { kind: 'arrow', from: { at: 'grip.r', pose: 'end', off: [14, 0] }, to: { at: 'grip.r', off: [14, 0] } },
    ],
    tells: [
      { key: 'low', text: 'Pulled<br>too low', anchor: 'grip.r', cue: 'The handle is pulled past the chin, down the chest.' },
      { key: 'back', text: 'Elbows<br>behind', anchor: 'elbow.r', cue: 'The elbows drive back behind the body.' },
    ],
  },
  alt: 'Close-grip pulldown, side view. Seated with the thighs under the knee pad, a V-handle is pulled from straight arms overhead to just below the chin, elbows down to the hips.',
};
