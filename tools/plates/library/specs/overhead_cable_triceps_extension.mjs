// Overhead cable triceps extension (rope, low pulley, standing, back to the stack), side view, figure faces screen
// right, away from the column.
// View: SIDE (card plate.view = census view). The elbow bend overhead with the upper arms by the ears (c7), the lean
// from the hips (c5) and the fault, the lower back arching as the rope is pushed overhead (c9), are sagittal. Elbow flare
// (c8) is sideways and not drawn (card viewWhy).
// Form: research card docs/research/howto/cards/overhead_cable_triceps_extension.json (research head 3812989f, LR-29
//  VALID), plate section: start "Back to the stack, one step forward to tension the cable (c3); feet shoulder-width or
//  staggered (c4); slight forward lean from the hips, back straight (c5); upper arms by the ears, elbows bent, hands
//  holding the rope behind the head (c1, c3)"; end "Arms straight overhead, elbows not locked (c6); upper arms still by
//  the ears (c7); trunk unchanged (c6)". Feet drawn shoulder-width (D-LIB15-SPLIT point 3: never staggered).
// Clone sources (D-LIB15-CLONE, copied never imported): rope_triceps_pushdown (pilot A #109 @ ff7c5c4f: the tower, the
//  rope composer use, the faulty-arm guides), lat_pulldown (main: the column sizes), barbell_overhead_press (pilot A:
//  arms overhead by the ears).
// Geometry decisions:
//  - Stance: feet flat, mid-soles 14 cm off the mid-plane (shoulder width, c4), knees soft (KNEE ~ 8 deg).
//  - Lean (c5): pelvis tilted TILT forward from the hips with a straight back (trunk 0, so the back stays straight and
//    the whole trunk leans TILT); hips ROOT_Z behind the mid-foot so the weight stays over the feet; neck NECK keeps
//    the head in line.
//  - Upper arms by the ears (c1, c7): shoulder flexion SH_FLEX relative to the thorax, the same in every pose, so the
//    upper arm never moves (c6 "only the elbow joint moves"); only the elbow changes.
//  - Start: hands holding the rope behind the head, elbows bent ELBOW_START (c1, c3). End: arms straight, not locked,
//    ELBOW_END (c6).
//  - Column: low pulley LOW (c1 "lower position"), the stack in a two-upright column behind the lifter, the lat_pulldown
//    tower's sizes; cable from the stack over the top pulley, down the column front to the low pulley, out to the rope.
//    The stack lifts by the cable paid out between the low pulley and the ferrule (1:1), 3 cm pre-lift (c3: tension).
//  - Rope: main's eq/rope.mjs with its default sizes; the cable leaves the low pulley's upper tangent toward the
//    ferrule. It runs behind the back and clear of the neck and head in every pose (plate.equipment; A15 tests it).
// Unsourced numbers (13.3 must-fix 14; no card claim gives them): TILT, KNEE, ROOT_Z, NECK, SH_FLEX, ELBOW_START,
//  ELBOW_END, the stance width (FOOT_X), the low pulley height and the column's distance behind the heels (the "one
//  step", c3), column and stack sizes (lat_pulldown's), the rope sizes (eq/rope.mjs defaults), and the Mistake's
//  magnitudes (MIS_*; c9 gives none).
// Callouts, Mistake, tempo: the 3 checkpoints are the callouts (c7/c6, c5, c6); the Mistake is the card's
//  plate.mistake (c9, drawable true): the lower back arches as the rope is pushed overhead, drawn against the end pose:
//  the pelvis tips further forward while the lumbar spine extends, so the chest and the arms tip back over the arch.
//  Tempo: Extend 1 s, Hold 1 s (c21's drawing convention, LR-33), Lower 2 s (lb5/tempo.json, D-LIB8M-TEMPO); no Rest.
import { landmarksOf } from '../engine.mjs';
import { rope, ropeGeometry, ROPE_ITEMS } from '../eq/rope.mjs';
import { perItem } from '../eq/parts.mjs';

const H = 1.75;
const FOOT_X = 0.14, FOOT_Z = 0.077;                   // mid-sole: shoulder width (c4), under the hips
const ROOT = [0, 0.905, -0.035];                       // hip-joint midpoint: knees soft, hips a little back (c5)
const TILT = 10, TRUNK = 0, NECK = 0;                  // lean from the hips with a straight back (c5); head in line
const SH_FLEX = 178;                                   // upper arms by the ears, relative to the leaning thorax (c1, c7)
const ELBOW_START = 128, ELBOW_END = 8;                // rope behind the head (c1, c3); straight, not locked (c6)
const SCAP = { elev: 1, pro: 0 };

const feet = { l: { at: [FOOT_X, 0, FOOT_Z] }, r: { at: [-FOOT_X, 0, FOOT_Z] } };
const base = { root: { at: ROOT, tilt: TILT }, trunk: TRUNK, neck: NECK, scap: SCAP, wrist: 0, plant: feet, shoulder: { flex: SH_FLEX, rot: 0 } };
const start = { ...base, elbow: ELBOW_START };
const end = { ...base, elbow: ELBOW_END };

// Mistake (card plate.mistake, c9): "Lower back arching as the rope is pushed overhead." c9 gives no size, so the arch
// takes the closest approved plate with the same fault (#290 6343211054 item 1): barbell_overhead_press (pilot A) draws no
// lumbar arch, so LB3's dumbbell_romanian_deadlift (#274 a6f4bd07, specs/dumbbell_romanian_deadlift.mjs:109, M_ARCH 25):
// the pelvis tips M_ARCH further forward and the lumbar spine extends M_ARCH, so the thorax angle is unchanged and the
// lower back sways in. Never sized to pass PQ-H3.
const M_ARCH = 25;
const mistakePose = { root: { at: ROOT, tilt: TILT + M_ARCH }, trunk: TRUNK - M_ARCH };
const LM_M = landmarksOf({ ...end, ...mistakePose }, H);
// The arch as a dashed curve (sacrum -> lumbar -> backMid -> backUpper of the faulty pose, 2 cm up), LB3
// dumbbell_romanian_deadlift's guide, and an arrow into the lumbar (DRDL's, turned to point forward: this trunk is upright).
// The arrow points forward into the lumbar from behind, its tip 15 cm behind the faulty lumbar point: the end figure's
// back lies behind that point, and a tip at 13 cm is 4.8 px from it, inside the 6 px clearance (13.1).
const ARCH_TIP = LM_M.lumbar.map((v, i) => v + (i === 2 ? -0.15 : 0)), ARCH_TAIL = LM_M.lumbar.map((v, i) => v + (i === 2 ? -0.25 : 0));
const ARCH_PTS = ['sacrum', 'lumbar', 'backMid', 'backUpper'].map(k => LM_M[k].map((v, i) => v + (i === 1 ? 0.02 : 0)));

// Column behind the lifter (world z < 0), lat_pulldown tower sizes.
const COL = { z0: -0.95, z1: -1.21, h: 2.14 };         // front and back uprights (front = the lifter's side)
const STACK_Z = (COL.z0 + COL.z1) / 2;
const TOP = { y: COL.h - 0.07, r: 0.035 };             // top pulleys: over the stack and over the front upright
const LOW = { y: 0.16, z: COL.z0 + 0.06, r: 0.045 };   // low pulley, on the column front, lowest position (c1)
const PLATES = 16, PLATE_H = 0.025, LIFT0 = 0.03;

// Upper tangent point on the low pulley toward a point b (side-view plane), on the lifter side.
function lowTangent(b) {
  const dz = b[2] - LOW.z, dy = b[1] - LOW.y, D = Math.hypot(dz, dy), a0 = Math.atan2(dy, dz), al = Math.acos(LOW.r / D);
  const c = [a0 + al, a0 - al].map(a => [0, LOW.y + LOW.r * Math.sin(a), LOW.z + LOW.r * Math.cos(a)]);
  return c[0][1] > c[1][1] ? c[0] : c[1];
}
const gripsOf = lm => ({ l: lm['grip.l'], r: lm['grip.r'] });
const midOf = lm => [0, lm.grips[1], lm.grips[2]];
const ferruleOf = lm => ropeGeometry({ pulley: lowTangent(midOf(lm)), grips: gripsOf(lm) }).ferrule;
const cableLen = lm => { const f = ferruleOf(lm); return Math.hypot(f[1] - LOW.y, f[2] - LOW.z); };

const lmEnd = landmarksOf(end, H);

export default {
  id: 'overhead_cable_triceps_extension', name: 'Overhead Cable Triceps Extension', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -1.05, to: 0.45 },
    { type: 'box', at: [0, 0.022, (COL.z1 - 0.03 + COL.z0 + 0.12) / 2], w: COL.z0 + 0.12 - COL.z1 + 0.03, h: 0.044, rc: 1, z: 'back' },   // base rail
    { type: 'box', at: [0, COL.h + 0.03, (COL.z1 - 0.03 + COL.z0 + 0.03) / 2], w: COL.z0 - COL.z1 + 0.06, h: 0.06, rc: 1.5 },          // top frame
    ...[COL.z0, COL.z1].map(z => ({ type: 'box', at: [0, COL.h / 2, z], w: 0.05, h: COL.h, rc: 1 })),
    { type: 'pulley', at: [0, TOP.y, STACK_Z], r: TOP.r },
    { type: 'pulley', at: [0, TOP.y, LOW.z], r: TOP.r },
    { type: 'pulley', at: [0, LOW.y, LOW.z], r: LOW.r },
    { type: 'cable', from: [0, TOP.y + TOP.r, STACK_Z], to: [0, TOP.y + TOP.r, LOW.z], z: 'back' },
    { type: 'cable', from: [0, TOP.y, LOW.z + TOP.r], to: [0, LOW.y, LOW.z + LOW.r], z: 'back' },
    ...[-0.05, 0.05].map(o => ({ type: 'line', cls: 'eq-thin', pts: [[0, 0.06, STACK_Z + o], [0, 1.80, STACK_Z + o]] })),   // guide rods
    (lm, ctx) => {                                     // the stack lifts by the cable paid out (1:1)
      const lift = LIFT0 + cableLen(lm) - cableLen(ctx.start);
      return [
        { type: 'stack', base: [0, 0, STACK_Z], plates: PLATES, load: 6, w: 0.16, lift, rods: false, part: 'stack' },
        { type: 'cable', from: [0, TOP.y, STACK_Z], to: [0, 0.06 + PLATES * PLATE_H + lift, STACK_Z], z: 'back', part: 'stack' },
      ];
    },
    ...perItem((lm, ctx) => rope({ pulley: lowTangent(midOf(lm)), grips: gripsOf(lm), part: 'rope', mistakeTwin: true, ctx }), ROPE_ITEMS),
  ],
  checks: [
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    // the upper arm never moves (c6, c7): the elbow at the same world point in start and end
    ...['start', 'end'].map(pose => ({ landmark: 'elbow.r', at: lmEnd['elbow.r'], pose, tol: 0.5 })),
  ],
  ghosts: { count: 3, parts: ['arm.r', 'rope'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  measure: { vertex: 'elbow.r', from: 'shoulder.r', to: 'wrist.r', radius: 18, title: 'Elbow', value: 'not locked', box: { left: 268, top: 136 } },
  callouts: [
    { key: 'ears', text: 'Arms by<br>ears', anchor: 'elbow.r', cue: 'Keep the upper arms by your ears. Only the forearms move.' },
    { key: 'lean', text: 'Hip lean', anchor: { at: 'navel', off: [4, 0] }, box: { left: 262, top: 190 }, cue: 'Lean slightly from the hips with a straight back and braced core.' },
    { key: 'lockout', text: 'Soft<br>lockout', anchor: 'grip.r', cue: 'Straighten the arms fully overhead without locking the elbows.' },
  ],
  tempo: [{ phase: 'Extend', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['torso', 'head', 'arm.r', 'rope'],
    guides: [
      { kind: 'dashed', pts: ARCH_PTS, smooth: true },
      { kind: 'arrow', from: ARCH_TAIL, to: ARCH_TIP },
    ],
    tells: [
      { key: 'arch', text: 'Low back<br>arches', anchor: { at: 'lumbar', pose: 'mistake' }, cue: 'Your lower back arches as you push the rope overhead.' },
    ],
  },
  alt: 'Overhead cable triceps extension, side view. Standing with the back to a low cable pulley, leaning slightly forward from the hips, the upper arms by the ears. The lifter straightens the elbows to push a rope from behind the head to straight arms overhead.',
};
