// Underhand lat pulldown (long bar, palms facing the lifter, hands about shoulder width, bar to just below the chin),
// side view, figure faces the machine (screen right). LB1, mode H. Clone sources: close_grip_pulldown (LB1, after the
// D-LIB9a-SLICE fixes: station, stack, rods, lean construction, label rules) and lat_pulldown (golden A: the latBar).
// View: side (card plate.view, census view): the bar path in front of the face, the elbows driven down and back, the
// unchanged lean and the fault (the bar pulled on past the end, the elbows travelling back) are all sagittal.
// Source: docs/research/howto/cards/underhand_lat_pulldown.json (claude/libht-research). Claims used: c1 (underhand,
// about shoulder width), c4 (pads tight on the thighs), c5 (slight lean, no more than about 30 deg, no extra lean during
// the pull), c6 (elbows down and back toward the glutes, bar just below chin height), c8 and c11 (the fault: pulling
// on past the end, the elbows moving back; LR-31 at research head 9eaa248), c10 (shoulder blades down first), c12
// (tempo 2 s / 2 s).
// Geometry decisions:
//  - Station as close_grip_pulldown (column at 1.04/1.30 m, 18 cm further back than lat_pulldown's, shared by the LB1
//    pulldowns), seat top 42 cm, knee roller on the thighs, head pulley 2.08 m, 16 x 5 kg stack with two rods.
//  - Bar as lat_pulldown (1.22 m, straight 60 cm centre, ends dropped 12 cm, 28 mm). Hands at +-22 cm (44 cm apart,
//    about the 45 cm shoulder-joint width, c1), on the straight centre, so the grips sit at the bar centre height; the
//    near dropped end hangs outboard of the hand, drawn in front as lat_pulldown draws it.
//  - The lean is the same at the start and the end (c5): pelvis tilt -8, trunk -3, a 13 deg lean at the hip.
//  - End: bar centre 10 cm under the chin, 9 cm in front of it (just below chin height, c6); forearms vertical under
//    the bar, elbows pulled down toward the hips.
//  - Mistake (card plate.mistake, c6, c8, c11; LR-31): the bar pulled on down past the end (grip 14 cm under and 4 cm
//    in front of the chest mark, 25.7 cm below the end bar) and the elbows driven back behind the trunk (7.4 cm behind
//    the end backMid, the red elbow cap 8.9 px clear of the solid end figure). The lean stays the set lean (c5), so
//    the arm and the bar are the only red parts. The bar sits behind the solid torso, so its moving cable is drawn
//    dashed to the head pulley, as close_grip draws it.
//  - Mistake tells: 'past' (the bar pulled too low, on the red ring round the low bar) and 'back' (the elbows behind
//    the body, from the open left side), close_grip's pair. The low bar's arm and a fist-sized ring round it are
//    redrawn dashed over the solid figure and the arrow runs down the cable line onto it (lb1-critic-findings R5).
// CARD: GX (c1, about shoulder width), the lean limit (c5, about 30 deg), tempo (card `tempo`). Unsourced numbers:
//  END_BAR 10 cm under and 9 cm in front of the chin (card: "just below chin height"), START_Y 1.63 m, TILT -8 and
//  TRUNK -3 (card: "slight lean"), MIS_BAR 14 cm under and 4 cm in front of the chest mark and the Mistake elbow pole
//  [0, 0.5, -1] (card gives no size), the tell boxes (176, 222) and (4, 236); station sizes (SEAT_TOP 0.42 m, HEAD 2.08 m, COL 1.04/1.30 m,
//  bar 1.22 m / 60 cm / 12 cm drop, 16 plates, LIFT0 3 cm) copied from close_grip_pulldown and lat_pulldown.
import { rootOnSeat, landmarksOf } from '../engine.mjs';

const H = 1.75;
const SEAT_TOP = 0.42;
const SEAT = [0, SEAT_TOP, 0];
const feet = { l: { at: [0.10, 0, 0.50] }, r: { at: [-0.10, 0, 0.50] } };
const GX = 0.22;                                        // grip centres +-22 cm (about shoulder width, c1)
const BAR_W = 1.22, BAR_STRAIGHT = 0.6, BAR_DROP = 0.12, BAR_R = 0.014;
const HEAD = { z: 0.17, y: 2.08, r: 0.045 };
const COL = { z0: 1.04, z1: 1.30, h: 2.16 };
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
// End bar: centre 10 cm under the chin (just below chin height, at the top of the chest), 9 cm in front of it.
const END_BAR = [0, lm0.chin[1] - 0.10, lm0.chin[2] + 0.09];
// The bar hangs on the cable from the head pulley and travels along that line.
const toward = b => { const d = [0, HEAD.y - b[1], HEAD.z - b[2]], L = Math.hypot(...d); return d.map(v => v / L); };
const cd = toward(END_BAR);
const START_Y = 1.63;
const START_BAR = [0, START_Y, END_BAR[2] + cd[2] / cd[1] * (START_Y - END_BAR[1])];

const start = { ...body, scap: { elev: 0, pro: 0 }, reach: grips(START_BAR, [1, 0.1, 0.2]) };
const end = { ...body, scap: { elev: -2, pro: -2 }, reach: grips(END_BAR, [0.2, -1, -0.3]) };
// Mistake (LR-31, card plate.mistake c6, c8, c11): the bar pulled on down past the end, so the elbows travel back behind
// the trunk; the lean stays the set lean (c5).
const MIS_BAR = [0, lm0.chest[1] - 0.14, lm0.chest[2] + 0.04];
const misBody = { reach: grips(MIS_BAR, [0, 0.5, -1]) };
// The low bar and its arm lie under the solid forearm, so the Mistake's arm (the engine's own joints for this pose) and
// a fist-sized circle round the low bar are redrawn as red dashed lines over the solid figure, and the arrow runs down
// the cable line onto the low bar (Do 8 recheck, lb1-critic-findings round 3 R5; segment lengths are the arm's own).
const lmM = landmarksOf({ ...end, ...misBody }, H), lmE = landmarksOf(end, H);
const yz = p => [0, p[1], p[2]];
const MIS_ARM = [yz(lmM['shoulder.r']), yz(lmM['elbow.r']), yz(lmM['grip.r'])];
const FIST_R = 0.02 * H;
const MIS_RING = Array.from({ length: 17 }, (_, i) => { const a = i / 16 * 2 * Math.PI; return [0, MIS_BAR[1] + FIST_R * Math.sin(a), MIS_BAR[2] + FIST_R * Math.cos(a)]; });
const ARROW = (() => { const e = yz(lmE['grip.r']), d = MIS_BAR.map((v, i) => v - e[i]), L = Math.hypot(...d), u = d.map(v => v / L);
  return { from: e.map((v, i) => v + u[i] * (FIST_R + 0.02)), to: MIS_BAR.map((v, i) => v - u[i] * (FIST_R + 0.005)) }; })();

const PAD_AT = lm0['thighTop.r'];
const PAD = { at: [0, PAD_AT[1], PAD_AT[2]], r: 0.055 };

function headTangent(b) {
  const dz = b[2] - HEAD.z, dy = b[1] - HEAD.y, D = Math.hypot(dz, dy), a0 = Math.atan2(dy, dz), al = Math.acos(HEAD.r / D);
  const c = [a0 + al, a0 - al].map(a => [0, HEAD.y + HEAD.r * Math.sin(a), HEAD.z + HEAD.r * Math.cos(a)]);
  return c[0][2] < c[1][2] ? c[0] : c[1];
}
const barOf = lm => [0, lm.grips[1], lm.grips[2]];
const cableLen = b => Math.hypot(b[1] - HEAD.y, b[2] - HEAD.z);
const LIFT0 = 0.03;
// Lean construction (end pose; Do 8 fix, lb1-critic-findings R4): the angle sits behind the back, where nothing
// overlaps. Its vertex is 5 cm behind the upper back; one leg is a dashed plumb line down from it, the other runs
// parallel to the trunk axis (hip joint to shoulder joint), so the arc between them shows the trunk lean.
const HIP_E = [0, lm0['hip.r'][1], lm0['hip.r'][2]];
const TU = (() => { const d = [0, lm0['shoulder.r'][1] - HIP_E[1], lm0['shoulder.r'][2] - HIP_E[2]], L = Math.hypot(...d); return d.map(v => v / L); })();
const BACK_OFF = 0.05, LEG = 0.40;
const LEAN_V = [0, lm0.backUpper[1], lm0.backUpper[2] - BACK_OFF];
const LEAN_B = LEAN_V.map((v, i) => v - TU[i] * LEG);
const LEAN_DN = [0, LEAN_V[1] - LEG, LEAN_V[2]];

export default {
  id: 'underhand_lat_pulldown', name: 'Underhand Lat Pulldown', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.5, to: 1.48 },
    ...[[-0.22, 0.30], [0.84, COL.z1]].map(([a, b]) => ({ type: 'box', at: [0, 0.022, (a + b) / 2], w: b - a, h: 0.044, rc: 1, z: 'center' })),
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
      const lift = LIFT0 + cableLen(barOf(lm)) - cableLen(barOf(ctx.start));   // the cable pays out as the bar comes down: the stack rises
      return [
        { type: 'stack', base: [0, 0, STACK_Z], plates: 16, load: 8, w: 0.16, lift, rods: false, part: 'stack' },
        { type: 'cable', from: [0, COLP.y, STACK_Z], to: [0, 0.06 + 16 * 0.025 + lift, STACK_Z], z: 'back', part: 'stack' },
      ];
    },
    // bar: centre section end-on, the near dropped end (outboard of the hand) as a vertical run below it, in front
    (lm) => {
      const b = barOf(lm), top = b[1] - BAR_R, bot = b[1] - BAR_DROP - BAR_R;
      return [
        { type: 'latBar', at: b, width: BAR_W, straight: BAR_STRAIGHT, drop: 0, z: 'mid', part: 'bar' },
        { type: 'box', at: [0, (top + bot) / 2, b[2]], w: 2 * BAR_R, h: top - bot, rc: 9, cls: 'eq-solid', z: 'front', part: 'bar' },
        { type: 'cable', from: b, to: headTangent(b), z: 'mid', part: 'bar' },
      ];
    },
    (lm, ctx) => (ctx.pose === 'end' && !ctx.mistake ? [
      { type: 'line', cls: 'eq-line datum', pts: [LEAN_V, LEAN_DN], z: 'front' },
      { type: 'line', cls: 'eq-line', pts: [LEAN_V, LEAN_B], z: 'front' },
    ] : null),
    ...[-0.05, 0.05].map(o => ({ type: 'line', cls: 'eq-thin', pts: [[0, 0.06, STACK_Z + o], [0, 1.95, STACK_Z + o]] })),
  ],
  checks: [
    { landmark: 'seat', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'thighTop.r', plane: { point: PAD.at, normal: [0, 1, 0] }, pose: 'all', tol: 1 },
    { landmark: 'thighUnder.r', above: { point: SEAT, normal: [0, 1, 0] }, pose: 'all' },
  ],
  ghosts: { count: 3, parts: ['arm.r', 'bar'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  measure: { vertex: LEAN_V, from: 'down', to: LEAN_B, radius: 45, title: 'Lean back', value: 'under 30°' },
  callouts: [
    { key: 'thighs', text: 'Thighs<br>pinned', anchor: { at: 'thighTop.r', off: [14, 0] }, box: { left: 188, top: 236 }, cue: 'Set the pads tight on top of the thighs.' },
    { key: 'elbows', text: 'Elbows<br>down, back', anchor: 'elbow.r', box: { left: 2, top: 180 }, cue: 'Pull the elbows down and back toward the glutes.' },
    { key: 'chin', text: 'Bar<br>below chin', anchor: 'grip.r', box: { left: 146, top: 174 }, cue: 'Stop when the bar passes just below chin height.' },
  ],
  tempo: [{ phase: 'Pull', s: 2, move: true }, { phase: 'Return', s: 2, move: true }],
  mistake: {
    pose: misBody,
    parts: ['arm.r', 'bar'],
    guides: [
      { kind: 'dashed', pts: [MIS_BAR, headTangent(MIS_BAR)] },
      { kind: 'dashed', pts: MIS_ARM },
      { kind: 'dashed', pts: MIS_RING },
      { kind: 'arrow', from: ARROW.from, to: ARROW.to },
    ],
    tells: [
      { key: 'past', text: 'Pulled<br>too low', anchor: { at: 'grip.r', off: [5, 0] }, box: { left: 176, top: 222 }, cue: 'The bar keeps going down well past the chin.' },
      { key: 'back', text: 'Elbows<br>go back', anchor: 'elbow.r', box: { left: 4, top: 236 }, cue: 'The elbows start to travel back behind the body.' },
    ],
  },
  alt: 'Underhand lat pulldown, side view. Seated with the thighs under the knee pad, palms facing in about shoulder width, the bar is pulled from straight arms overhead to just below the chin, elbows down and back.',
};
