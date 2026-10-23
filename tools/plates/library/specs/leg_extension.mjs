// Leg extension (selectorised machine), side view, figure facing screen right. LIB-18 (LB8, mode H, bulk; tier C;
// census closest leg_press, closeness N: D-LIB18-CLONE; composer `legExtMachine`, single use, its own anchor: plan
// 2.1:141, D-LIB18-COMPOSERS).
// HELD (S2; D-LIB8-shrug, D-LIB18-SIZE): drawn card-true, measured, never enlarged or moved: the Mistake's largest tell
//  deviation (the upper back, carried 5.2 cm off the pad by the 12 deg arch) measures 7.6 px at 146.29 px/m, under
//  deviationMin 11.39 px; the Trace (the ankle) measures 75.9 px and passes.
// View: side (card plate.view = census view). The knee at the pivot (c1), the roller on the lower shins (c2), the knee
//  range from 90 to straight but not locked (c3, c7, c8), the back on the pad (c4) and the fault, the back arching off
//  the pad as the legs extend (c5, c6), all read side-on.
// Sources: research card docs/research/howto/cards/leg_extension.json (research head 596dbe07): callouts =
//  plate.checkpoints (c1 Knee at pivot; c4/c6 Back on pad; c7/c8 Knees unlocked); Mistake = plate.mistake (c5, c6:
//  the back arching off the back pad as the legs extend; drawable true; topFault 'arch'); tempo = the card's tempo
//  (Extend 2, Hold 1, Lower 2: c15, c16; lb8/tempo.json's row); Trace = the ankle (c7 "Exhale to extend your lower
//  legs"; D-LIB18-TRACE).
// Clone sources (copied, never imported; D-LIB9-CLONE): leg_press (main, the 8) for the side-view machine figure, the
//  side handles beside the hips (leg_press.mjs:68), the back pad tangent to the upper back and the buttock (:75-77) and
//  the Trace trim (:132); machine_chest_press (main, the seated 8) for the seat: the pelvis on the seat by rootOnSeat
//  with the back pad reclined 5 deg (:30, :54) and the back pad's length (:141); seated_calf_raise (LB8 slice) for the
//  roller resting on the drawn limb outline (its thighGap, here on the shank). Every bisection here throws on a bracket
//  with no root.
// Equipment: eq/legExtMachine.mjs (floor beam, seat on its post, back pad on its bracket, rear upright and stack, pivot
//  boss on its bracket, side handles; the moving lever with the shin roller); floor.
// Pose map (lb8/DESIGN.md section 9): identity. Start = plate.start (seated, back against the pad, c4; knees in line
//  with the pivot, c1; knees bent 90 with the lower shins behind the roller, c2, c3; hands on the side handles, c3).
//  End = plate.end (legs straight but not locked, the shins about level, c7, c8; back still on the pad, c4).
// Geometry decisions (confirmed by the engine report `angles`, `checks` and the drawn-item tests):
//  Seat and back (machine_chest_press.mjs:30, :54): the seat landmark (the buttock's contact) on the seat pad's top at
//   z 0; the pelvis and thorax lie back TILT (the 8's seated back pad), neutral spine (trunk 0); the back pad tangent to
//   backUpper and buttock (c1, c4). The torso is the same in the start and the end, so both stay on the pad.
//  Thighs level on the seat: hip flexion 90 + TILT, so the thigh lies level in the world (c1 knees at the pivot, which
//   sits level with them). Start knee 90 (c3), so the shank hangs plumb; the foot neutral (ankle 0: no claim gives it).
//  SEAT_TOP (solved): the hanging foot's lowest point FOOT_CLEAR above the floor at the start.
//  Pivot: the start knee joint (c1 "knees align with the machine's pivot point"). The roller rests on the front of the
//   drawn shank outline (body.mjs limb(), its polygon) ROLL_UP above the ankle joint at the start (c2 "just above your
//   ankles"); the lever's length and its offset from the shank are SOLVED there. In every pose the lever angle is
//   SOLVED so the roller touches the drawn shins, so the shins move the lever.
//  End (c7 "straight but not locked", c8): the knee KNEE_END short of straight, so the shins sit KNEE_END below level
//   (c7 BarBend "parallel with the ground").
//  Mistake (c5, c6; hanging_leg_raise.mjs:69's lumbar arch): at the end the pelvis tips forward M_ARCH about its seat
//   contact (it stays on the seat) and the lumbar extends M_ARCH (trunk -M_ARCH), so the thorax keeps its angle and is
//   carried forward off the back pad; the hips flex M_ARCH more so the thighs stay level on the seat; the hands keep
//   the handles. The faulty back contour (masked inside the solid end trunk) is a red dashed guide.
//  Every bisection throws on a bracket with no sign change (D-LIB9-CLONE b). They solve to: ROLL_OFF (the roller's
//   offset from the start shank axis that rests it on the drawn shin) and, per pose, the lever angle that rests the
//   roller on the drawn shins.
// Labels: "Knee at pivot" meets the pivot boss's upper rear rim and "Knees unlocked" the end shin's top just ahead of the
//  knee, both from the open space above the legs (the lever runs behind the near leg, so no leader meets it). "Back on
//  pad" meets the upper back's pad contact (D-LIB18-BACKPAD) from above and behind, crossing the back pad once (the
//  ruled nit) over the low rear upright and the stack. The two tells meet the red dashed back contour (sacrum: c6
//  "arching your lower back"; backUpper: c6 "lift from the support", the pad contact), each entering the end figure
//  once from the front (64 and 66 px). No knee measure: the start knee's arc sits in the pocket closed by the thigh,
//  the seat's front and the calf, where every leader crosses the seat (the 90 deg fact is held by the engine angles).
// Camera: fit (capped at the reference scale).
// Unsourced numbers (SIZES below; the notes hold each with its basis): TILT, FOOT_CLEAR, ROLL_UP, KNEE_END, M_ARCH,
//  HANDLE, PAD_LEN, PAD_BELOW, SEAT_BACK, SEAT_GAP, TOWER_GAP, STACK_GAP, CAM_R, BRACKET_AT, FLOOR_BACK,
//  FLOOR_FRONT, TRACE_TRIM; the composer's LEG_EXT constants; SEAT_TOP, ROLL_OFF, ARM and the lever angles solved. The
//  knee 90 is c3's.
import { WINTER, REF, RADII, landmarksOf, rootOnSeat } from '../engine.mjs';
import { add, mul, sub, perItem } from '../eq/parts.mjs';
import { legExtMachine, legExtLever, LEG_EXT, LEG_EXT_ITEMS } from '../eq/legExtMachine.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ TILT: -5, FOOT_CLEAR: 0.05, ROLL_UP: 0.08, KNEE_END: 5, M_ARCH: 12, HANDLE: [0.25, 0.03, 0.10], PAD_LEN: 0.62,
  PAD_BELOW: 0.06, SEAT_BACK: 0.03, SEAT_GAP: 0.08, TOWER_GAP: 0.08, STACK_GAP: 0.02, CAM_R: 0.10, BRACKET_AT: 0.30,
  FLOOR_BACK: 0.05, FLOOR_FRONT: 0.10, TRACE_TRIM: [6, 8] });
const { TILT, FOOT_CLEAR, ROLL_UP, KNEE_END, M_ARCH, HANDLE, PAD_LEN, PAD_BELOW, SEAT_BACK, SEAT_GAP, TOWER_GAP, STACK_GAP, CAM_R,
  BRACKET_AT, FLOOR_BACK, FLOOR_FRONT, TRACE_TRIM } = SIZES;
const C = LEG_EXT;

const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
const unit = v => { const k = Math.hypot(...v); return v.map(x => x / k); };
// Bisection on a bracket (throws when the bracket holds no sign change; D-LIB9-CLONE b).
const bisect = (f, a, b, what) => {
  let fa = f(a);
  if (fa * f(b) > 0) throw new Error(`leg_extension: no solution for ${what} in [${a}, ${b}]`);
  for (let i = 0; i < 50; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
  return (a + b) / 2;
};
const L = p => landmarksOf(p, H);

// ---- the seated body (machine_chest_press.mjs:30, :54): seat landmark on the seat top at z 0, thighs level ----
const FLEX = 90 + TILT;                                                   // hip flexion that lays the thigh level in the world
const seated = (seatTop, knee, extra = {}) => ({ root: { at: rootOnSeat([0, seatTop, 0], TILT, H), tilt: TILT }, trunk: 0, neck: 0,
  hip: { flex: FLEX }, knee, ankle: 0, ...extra });
// SEAT_TOP (solved, linear): the start foot's lowest drawn point FOOT_CLEAR above the floor
const probe = L(seated(0, 90));
const footLow = Math.min(...['heel.r', 'sole.r', 'ball.r', 'toe.r'].map(k => probe[k][1]));
export const SEAT_TOP = FOOT_CLEAR - footLow;
const SEAT = [0, SEAT_TOP, 0];
const ROOT = rootOnSeat(SEAT, TILT, H);
const GRIP = s => [s * HANDLE[0], ROOT[1] + HANDLE[1], ROOT[2] + HANDLE[2]];       // side handles beside the hips (leg_press.mjs:68)
const hands = { l: { at: GRIP(1), pole: [1, 0.25, 0] }, r: { at: GRIP(-1), pole: [-1, 0.25, 0] } };   // elbows out to the sides (leg_press.mjs:69)
const start = seated(SEAT_TOP, 90, { reach: hands });
const end = seated(SEAT_TOP, KNEE_END, { reach: hands });
// Mistake: the pelvis tips forward M_ARCH about its seat contact, the lumbar extends M_ARCH, the thighs stay level
const mistakePose = { root: { at: rootOnSeat(SEAT, TILT + M_ARCH, H), tilt: TILT + M_ARCH }, trunk: -M_ARCH, hip: { flex: FLEX + M_ARCH } };
const LS = L(start), LE = L(end), LM = L({ ...end, ...mistakePose });

// ---- the drawn shank outline (body.mjs limb(), radii RADII.shank; limbR copied from geom.mjs:69) ----
const limbR = (rA, rM, rB, m) => t => t < m ? rA + (rM - rA) * Math.sin((t / m) * Math.PI / 2) : rM + (rB - rM) * (1 - Math.cos(((t - m) / (1 - m)) * Math.PI / 2));
const SHR = limbR(...RADII.shank), TS = [0, 0.12, RADII.shank[3] * 0.7, RADII.shank[3], 0.55, 0.78, 1];
const segDist = (p, a, b) => { const d = sub(b, a), L2 = dot(d, d), t = Math.max(0, Math.min(1, dot(sub(p, a), d) / L2)); return Math.hypot(...sub(p, add(a, mul(d, t)))); };
const yz = v => [0, v[1], v[2]];
// signed gap (m) from point c to the front outline of the near shank (negative inside the drawn shank)
const shinGap = (lm, c) => {
  const k = yz(lm['knee.r']), a = yz(lm['ankle.r']), u = unit(sub(a, k)), n = [0, u[2], -u[1]];   // n: the shin's front
  const pts = TS.map(t => add(add(k, mul(sub(a, k), t)), mul(n, SHR(t) * H)));
  const gap = Math.min(...pts.slice(1).map((q, i) => segDist(c, pts[i], q)));
  const Ls = Math.hypot(...sub(a, k)), tc = dot(sub(c, k), u) / Ls, perp = dot(sub(c, k), n);
  return tc >= 0 && tc <= 1 && perp < SHR(tc) * H ? -gap : gap;
};
const shankAngle = lm => { const d = sub(yz(lm['ankle.r']), yz(lm['knee.r'])); return Math.atan2(d[2], -d[1]) / R; };   // from straight down, + forward

// ---- the lever: pivot at the start knee (c1); the roller on the shin ROLL_UP above the ankle (c2) ----
export const PIVOT = yz(LS['knee.r']);
const LSH = WINTER.shank * H;
const U0 = unit(sub(yz(LS['ankle.r']), PIVOT)), N0 = [0, U0[2], -U0[1]];
const AX0 = add(PIVOT, mul(U0, LSH - ROLL_UP));
export const ROLL_OFF = bisect(d => shinGap(LS, add(AX0, mul(N0, d))) - C.rollerR, 0, 0.15, 'the roller offset that rests it on the start shin');
const ROLLER0 = add(AX0, mul(N0, ROLL_OFF));
export const ARM = Math.hypot(...sub(ROLLER0, PIVOT));
const PSI = Math.atan2(ROLL_OFF, LSH - ROLL_UP) / R;                    // the roller's angle ahead of the shank, seen from the pivot
const leverAt = lm => { const s = shankAngle(lm) + PSI; return bisect(a => shinGap(lm, legExtLever({ pivot: PIVOT, arm: ARM, angle: a }).roller) - C.rollerR, s - 20, s + 20, 'the lever angle that rests the roller on the shins'); };
const A_START = shankAngle(LS);
const liftOf = lm => CAM_R * (shankAngle(lm) - A_START) * R;              // the stack rises with the lever's turn (cam radius CAM_R)

// ---- the machine (static parts from the start/end torso, which is the same in both) ----
const SEAT_FRONT = PIVOT[2] - SEAT_GAP;
const SEAT_REAR = LE.buttock[2] - C.padT - SEAT_BACK;
const POST_Z = (SEAT_REAR + SEAT_FRONT) / 2;
const PAD_U = unit(sub(yz(LE.backUpper), yz(LE.buttock))), PAD_N = [0, -PAD_U[2], PAD_U[1]];
const PAD_LO = add(yz(LE.buttock), mul(PAD_U, -PAD_BELOW)), PAD_HI = add(yz(LE.buttock), mul(PAD_U, PAD_LEN - PAD_BELOW));
const BRACKET_Y = add(yz(LE.buttock), mul(PAD_U, BRACKET_AT))[1];         // the pad bracket's height (it runs level into the upright)
const TOWER_Z = Math.min(PAD_LO[2], PAD_HI[2]) - C.padT - TOWER_GAP;
const STACK_Z = TOWER_Z - C.tubeT / 2 - STACK_GAP - C.stackW / 2;
const machine = {
  floorZ: [STACK_Z - C.stackW / 2 - FLOOR_BACK, POST_Z + C.tubeT / 2 + FLOOR_FRONT],
  seat: { top: SEAT_TOP, z: [SEAT_REAR, SEAT_FRONT], postZ: POST_Z },
  pad: { upper: yz(LE.backUpper), lower: yz(LE.buttock), len: PAD_LEN, below: PAD_BELOW },
  towerZ: TOWER_Z, towerTop: BRACKET_Y + C.tubeT / 2, bracketAt: BRACKET_AT, stackZ: STACK_Z,
  pivot: PIVOT, arm: ARM, pivotTo: [0, SEAT_TOP - C.seatT / 2, SEAT_FRONT - C.bracketT / 2],
  grip: yz(GRIP(-1)), gripTo: [0, SEAT_TOP - C.seatT / 2, GRIP(-1)[2]],
};
// one solve per drawn pose: perItem calls the composer once per slot with the same landmarks object
const memo = new WeakMap();
const machineAt = (lm, ctx) => {
  if (!memo.has(lm)) memo.set(lm, legExtMachine({ ...machine, angle: leverAt(lm), lift: liftOf(ctx?.pose === 'mistake' ? LE : lm) }));
  return memo.get(lm);
};
// Start phantom (DRAWING-GUIDE.md 4; D-LIB18-DRAW): the start layer never draws moving equipment, so the start lever
// and roller are redrawn as dashed outlines in the end layer, where the Trace starts.
const ring = (c, r, n = 24) => { const p = Array.from({ length: n }, (_, k) => [0, c[1] + r * Math.sin(2 * Math.PI * k / n), c[2] + r * Math.cos(2 * Math.PI * k / n)]); return [...p, p[0]]; };
const startPhantom = (() => {
  const a0 = leverAt(LS), lv = legExtLever({ pivot: PIVOT, arm: ARM, angle: a0 }), side = [0, lv.u[2], -lv.u[1]], h = C.leverT / 2;
  const tip = add(lv.roller, mul(lv.u, -C.rollerR));
  return [
    { type: 'line', pts: [add(PIVOT, mul(side, h)), add(tip, mul(side, h))], cls: 'eq-line m-line', z: 'back', part: 'startLever' },
    { type: 'line', pts: [add(PIVOT, mul(side, -h)), add(tip, mul(side, -h))], cls: 'eq-line m-line', z: 'back', part: 'startLever' },
    { type: 'line', pts: ring(lv.roller, C.rollerR), cls: 'eq-line m-line', z: 'back', part: 'startLever' },
  ];
})();

const PAD_PLANE = { point: yz(LE.buttock), normal: PAD_N }, SEAT_PLANE = { point: SEAT, normal: [0, 1, 0] };
// the roller's contact with the shin, as two planes through the drawn roller of a pose: across the shank at the
// roller's foot on the shank axis less ROLL_UP (the ankle joint lies on it), and along the shank axis parallel to the
// roller's tangent (the ankle joint, on the axis, lies on it while the roller rests on the shin)
const rollerPlanes = lm => {
  const rl = legExtLever({ pivot: PIVOT, arm: ARM, angle: leverAt(lm) }).roller, u = unit(sub(yz(lm['ankle.r']), yz(lm['knee.r']))), n = [0, u[2], -u[1]];
  const foot = add(rl, mul(n, -ROLL_OFF));
  return { across: { point: add(foot, mul(u, ROLL_UP)), normal: u }, along: { point: foot, normal: n } };
};
const RP0 = rollerPlanes(LS);
export const LX = { SEAT_TOP, PIVOT, ARM, ROLL_OFF, PSI, LS, LE, LM, machine, leverAt, shinGap, shankAngle, liftOf, start, end, mistakePose, startPhantom, PAD_PLANE, SEAT_PLANE, rollerPlanes };
// The card's facts (lb8 DESIGN.md section 10; D-LIB18-FACTS): each contact bound by a check on its landmark and pose,
// on the item it touches where one exists (seat, pad, roller); the wrists by the drawn point (the handle grips are
// held by the grip landmark's own check).
const factChecks = (pose, p, names) => names.map(landmark => ({ landmark, at: L(p)[landmark], pose, tol: 0.5 }));
export default {
  id: 'leg_extension', name: 'Leg Extension', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: machine.floorZ[0] - 0.05, to: LE['toe.r'][2] + 0.05 },
    ...perItem(machineAt, LEG_EXT_ITEMS),
    ...perItem((lm, ctx) => (ctx.pose === 'end' ? startPhantom : []), startPhantom.length),
  ],
  checks: [
    ...factChecks('start', start, ['wrist.l', 'wrist.r']),
    ...['grip.l', 'grip.r'].map(landmark => ({ landmark, at: GRIP(landmark.endsWith('l') ? 1 : -1), pose: 'all', tol: 0.5 })),   // c3: hands on the handles
    { landmark: 'seat', plane: SEAT_PLANE, pose: 'all', tol: 0.5 },                                                            // c1: seated on the seat pad
    ...['thighUnder.l', 'thighUnder.r', 'buttock'].map(landmark => ({ landmark, above: SEAT_PLANE, pose: 'all', tol: 0.5 })),    // never inside the seat
    // c4 "throughout": the upper back and the buttock on the back pad at the start and the end; never inside it
    ...['start', 'end'].flatMap(pose => ['backUpper', 'buttock'].map(landmark => ({ landmark, plane: PAD_PLANE, pose, tol: 0.5 }))),
    ...['backUpper', 'backMid', 'sacrum', 'buttock'].map(landmark => ({ landmark, above: PAD_PLANE, pose: 'all', tol: 0.5 })),
    // c2: the roller on the lower shins just above the ankles (start fact; the drawing keeps it at the end)
    ...['start', 'end'].flatMap(pose => ['ankle.l', 'ankle.r'].flatMap(landmark => {
      const P0 = pose === 'start' ? RP0 : rollerPlanes(LE);
      return [{ landmark, plane: P0.across, pose, tol: 0.5 }, { landmark, plane: P0.along, pose, tol: 0.5 }];
    })),
    ...['heel.l', 'heel.r', 'toe.l', 'toe.r'].map(landmark => ({ landmark, above: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0 })),
  ],
  ghosts: { count: 3, parts: ['leg.r', 'lever'] },
  trace: { point: 'ankle.r', trim: TRACE_TRIM },
  callouts: [
    { key: 'pivot', text: 'Knee at<br>pivot', anchor: [0, PIVOT[1] + C.bossR * Math.SQRT1_2, PIVOT[2] - C.bossR * Math.SQRT1_2], box: { left: 178, top: 204 }, cue: "Knees line up with the machine's pivot." },
    { key: 'back', text: 'Back on<br>pad', anchor: 'backUpper', box: { left: 40, top: 166 }, cue: 'Keep your back pressed into the pad without arching.' },
    { key: 'soft', text: 'Knees<br>unlocked', anchor: { along: ['knee.r', 'ankle.r'], t: 0.25, off: [0, -8] }, box: { left: 250, top: 172 }, cue: 'Straighten without locking your knees.' },
  ],
  tempo: [{ phase: 'Extend', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['torso', 'head'],
    guides: [
      // the faulty back contour, carried off the pad (masked inside the solid end trunk)
      { kind: 'dashed', smooth: true, pts: [{ at: 'backUpper', pose: 'mistake' }, { at: 'backMid', pose: 'mistake' }, { at: 'sacrum', pose: 'mistake' }, { at: 'buttock', pose: 'mistake' }] },
    ],
    tells: [
      { key: 'arch', text: 'Back<br>arches', anchor: { at: 'sacrum', pose: 'mistake' }, box: { left: 204, top: 204 }, cue: 'The lower back arches as the legs extend.' },
      { key: 'off', text: 'Back off<br>pad', anchor: { at: 'backUpper', pose: 'mistake' }, box: { left: 196, top: 154 }, cue: 'The back lifts off the back pad.' },
    ],
  },
  alt: 'Leg extension, side view. Seated on a machine with the back on the pad, the knees level with the lever pivot and a roller on the lower shins, the lifter straightens the legs from 90 degrees until they are nearly level, without locking the knees.',
};
