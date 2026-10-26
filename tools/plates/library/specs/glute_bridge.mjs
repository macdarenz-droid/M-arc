// Glute bridge (bodyweight, on the floor), side view, figure's feet toward screen right. LIB-18 (LB8, bulk; tier C;
// census closest leg_press, closeness N; the bridge pose class, approved on the LB8 sheet with hip_thrust: plan
// 2.2:165; D-LIB18-CLASSES).
// View: side (card plate.view). The shoulders, hips and knees in one line (c4), the knee angle (c4), the tucked pelvis
//  and flat low back (c2) and the arched low back of the Mistake (c6, c7) all read side-on.
// Sources: research card docs/research/howto/cards/glute_bridge.json (research head 596dbe07): callouts =
//  plate.checkpoints (c2/c6/c12 Pelvis tucked, c4 Straight line, c4 Knees at 90); Mistake = plate.mistake (c6, c7:
//  the lower back overarching at the top, drawable true); tempo = the card's tempo (c15: up 1, down 2, pause 1).
// Clone source: leg_press (the 8, main; Trace trim [6, 8], leg_press.mjs:132); hip_thrust (this batch's bridge, LB8
//  slice) for the bridge solve, the throwing bisection and the lumbar-arch Mistake: copied, never imported (D-LIB9-CLONE).
// Equipment: the floor line only (card plate.equipment; census equipmentNeeds floor). No composer.
// Pose map (DESIGN.md section 9): identity. Start = plate.start (lying on the back, arms straight by the sides, knees
//  bent, feet flat, c1; pelvis tucked so the low back is flat on the floor, c2). End = plate.end (hips up so shoulders,
//  hips and knees form a straight line, shin and thigh at 90, c4; low back not arched, c5, c6; heels down, c3).
// Geometry decisions (confirmed by the engine report `checks` and the drawn-item tests):
//  Floor contacts on the drawn outline: in the top and the Mistake the lowest thorax-skinned point of the back contour
//   (torsoSide's points at .66-.845 H, copied from body.mjs:47-50) rests on the floor, with backUpper over z 0 (the
//   shoulders stay on one floor spot); the head's lowest outline point (HEAD_SIDE, body.mjs:38-39) rests on the floor
//   in every pose, the neck angle SOLVED for it (a physical reason: an unsupported head would float or sink).
//  The arms lie straight by the sides on the floor (c1): elbow 0, the shoulder extension SOLVED per pose so the wrist
//   sits at the forearm's distal radius above the floor, the wrist angle SOLVED so the flat hand lies level on it.
//  Top (end): a neutral lumbar (END_TRUNK 0: c7 "Keeping a neutral spine"; c5, c6 "low back not arched"; the tuck is a
//   setup step, c2, so it is drawn at the start only, D-LIB18-FACTS); the hip angle SOLVED so the knee lies on the
//   shoulder-hip line (c4, side view), the knee 90 (c4), and the pelvis tilt SOLVED so the ankle sits at its standing
//   height (the foot flat, c1, c3). The feet are planted where the top puts them and stay there (c1, c3).
//  Start: backUpper and the buttock on the floor (c1): for a lumbar flexion k the pelvis tilt is SOLVED so both are on
//   the floor. The tuck (c2) is ruled as the least k that brings the sacrum to the floor, 25 deg the ceiling
//   (hanging_leg_raise.mjs:52/:54): on this body that solve has no root in [0, 25] (31.0 deg), so the tuck is drawn at
//   the ceiling, the sacrum 0.65 cm up (inside PQ-H6's 1 cm), the back contour at most 0.44 cm into the floor (the
//   recorded miss, notes). Every bisection throws on a bracket with no root (D-LIB9-CLONE b).
// Mistake (c6, c7; ACE c6 "pushing your hips too high ... increases the amount of hyperextension (arching) in your low
//  back"): the top with the lower back arched: the lumbar extended M_ARCH (trunk -12, hanging_leg_raise.mjs:69's lumbar
//  arch, hip_thrust's model: neutral top, arch -12), the hip angle held at the top's (the glutes' extension unchanged,
//  c6 PureGym "ensuring the glutes power the hip extension, rather than the lower back"), the upper back on the floor
//  and the feet planted: the pelvis tilt is SOLVED for those, so the hips rise 3.1 cm with the arch (DESIGN.md 12
//  M_HIGH: no separate number). One tell (record in the notes); `high` is not a tell (ruled).
// Camera: fit (capped at the reference 146.29 px/m).
// Unsourced numbers (SIZES below; lb8/sizes.json holds each with its basis): FOOT_X, START_TUCK (the
//  ceiling), M_ARCH, FLOOR_BACK, FLOOR_FRONT; END_TILT, END_HIP, START_TILT, M_TILT solved.
import { REF, RADII, WINTER, normPose, resolve, fk, landmarks } from '../engine.mjs';

const H = 1.75, body = { height: H };
export const SIZES = Object.freeze({ FOOT_X: 0.0875, START_TUCK: 25, M_ARCH: 12, FLOOR_BACK: 0.25, FLOOR_FRONT: 0.25 });
const { FOOT_X, M_ARCH, FLOOR_BACK, FLOOR_FRONT } = SIZES;
const TUCK_MAX = SIZES.START_TUCK, END_KNEE = 90, END_TRUNK = 0;   // END_TRUNK: the neutral spine at the top (c7)

// Bisection on a bracket (throws when the bracket holds no sign change; D-LIB9-CLONE b).
const bisect = (f, a, b, what) => {
  let fa = f(a);
  if (fa * f(b) > 0) throw new Error(`glute_bridge: no solution for ${what} in [${a}, ${b}]`);
  for (let i = 0; i < 50; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
  return (a + b) / 2;
};
const skOf = p => fk(resolve(normPose(p, body), body).q, body);
const L = p => landmarks(skOf(p));

// Outline points (ref [z, y], copied from body.mjs): the thoracic back contour (torsoSide :47-50, .66-.905 H) and the
// side head (HEAD_SIDE :38-39).
const BACK_UP = [[-0.030, 0.905], [-0.036, 0.876], [-0.048, 0.851], [-0.062, 0.826], [-0.070, 0.790], [-0.072, 0.750], [-0.066, 0.700]];
const BACK_LOW = [[-0.056, 0.650], [-0.050, 0.615], [-0.058, 0.585], [-0.074, 0.552], [-0.080, 0.522], [-0.073, 0.496], [-0.052, 0.480], [-0.020, 0.475]];
const HEAD = [[0.0, 1.0], [0.032, 0.994], [0.052, 0.976], [0.060, 0.952], [0.061, 0.930], [0.060, 0.905], [0.056, 0.885], [0.047, 0.872],
  [0.027, 0.873], [0.010, 0.882], [-0.008, 0.897], [-0.038, 0.912], [-0.054, 0.934], [-0.056, 0.960], [-0.045, 0.984], [-0.022, 0.998]];
const minY = pts => Math.min(...pts.map(p => p[1]));
export const outlineOf = p => {
  const sk = skOf(p);
  return { backUp: BACK_UP.map(([z, y]) => sk.skin([0, y, z])), backLow: BACK_LOW.map(([z, y]) => sk.skin([0, y, z])), head: HEAD.map(([z, y]) => sk.head([0, y, z])) };
};

// A body lying on the floor: pelvis tilt t, lumbar k, hips h; the root placed so the upper back's lowest outline point
// is on the floor and backUpper over z 0; the neck solved so the head rests on the floor.
const place = (t, k, extra = {}) => {
  const p0 = { root: { at: [0, 0, 0], tilt: t }, trunk: k, neck: 0, ...extra };
  const o = outlineOf(p0), b = L(p0).backUpper;
  return { ...p0, root: { at: [0, -minY(o.backUp.filter((_, i) => BACK_UP[i][1] <= 0.845)), -b[2]], tilt: t } };   // the thorax-skinned points (body.mjs fk skin)
};
const onFloor = (t, k, extra = {}) => {
  const p1 = place(t, k, extra);
  const neck = bisect(n => minY(outlineOf({ ...p1, neck: n }).head), -40, 60, 'the neck (head on the floor)');
  return { ...p1, neck };
};
// The arms straight by the sides on the floor (c1), the hands flat (spec.hand 'flat').
const withArms = p => {
  const wristY = RADII.fore[2] * H;
  const e = bisect(x => L({ ...p, shoulder: { ext: x }, elbow: 0 })['wrist.r'][1] - wristY, -30, 89, 'the shoulder (wrist on the floor)');
  const q = { ...p, shoulder: { ext: e }, elbow: 0 };
  const w = bisect(a => { const s = skOf({ ...q, wrist: a }); return s.G.r[1] - s.W.r[1]; }, -60, 60, 'the wrist (hand flat)');
  return { ...q, wrist: w };
};

// ---- top (end): shoulders, hips and knees in line, knee 90, foot flat ----
const yz = v => [v[2], v[1]];
const crossYZ = (a, b, c) => { const [az, ay] = yz(a), [bz, by] = yz(b), [cz, cy] = yz(c); return (bz - az) * (cy - by) - (by - ay) * (cz - bz); };
const lineHip = (t, k) => bisect(h => { const l = L(place(t, k, { hip: h, knee: END_KNEE })); return crossYZ(l['shoulder.r'], l['hip.r'], l['knee.r']); }, -40, 80, 'the hip (knee on the shoulder-hip line)');
const ANKLE_Y = WINTER.ankleH * H;

// ---- start's tuck (c2): the least lumbar flexion that brings the sacrum to the floor, 25 deg the ceiling ----
// With backUpper and the buttock on the floor (c1) that solve has no root in [0, 25] on this body (the sacrum is still
// 0.65 cm up at 25; it reaches the floor at 31.0): the tuck is drawn at the ceiling (hanging_leg_raise.mjs:52/:54) and
// the miss is recorded (notes); the sacrum stays inside PQ-H6's 1 cm contact limit.
const lyingTilt = k => bisect(t => { const l = L({ root: { at: [0, 0, 0], tilt: t }, trunk: k }); return l.backUpper[1] - l.buttock[1]; }, -130, -50, 'the lying pelvis (backUpper and buttock level)');
export const START_TUCK = TUCK_MAX;
export const START_TILT = lyingTilt(START_TUCK);

export const END_TILT = bisect(t => L(place(t, END_TRUNK, { hip: lineHip(t, END_TRUNK), knee: END_KNEE }))['ankle.r'][1] - ANKLE_Y, -160, -90, 'the top pelvis (foot flat)');
export const END_HIP = lineHip(END_TILT, END_TRUNK);
const topLm = L(place(END_TILT, END_TRUNK, { hip: END_HIP, knee: END_KNEE }));
const SOLE = s => [s * FOOT_X, 0, topLm['ankle.r'][2] + REF.mid * H];
const plant = { l: { at: SOLE(1), normal: [0, 1, 0], toe: [0, 0, 1], pole: [0, 1, 0.3] }, r: { at: SOLE(-1), normal: [0, 1, 0], toe: [0, 0, 1], pole: [0, 1, 0.3] } };

const end = withArms({ ...onFloor(END_TILT, END_TRUNK, { hip: END_HIP, knee: END_KNEE }), plant });
// the start: the pelvis level-laid (backUpper and buttock on the floor), the root put so the buttock is on the floor
const start = (() => {
  const p0 = { root: { at: [0, 0, 0], tilt: START_TILT }, trunk: START_TUCK, plant };
  const l = L(p0);
  const p1 = { ...p0, root: { at: [0, -l.buttock[1], -l.backUpper[2]], tilt: START_TILT } };
  const neck = bisect(n => minY(outlineOf({ ...p1, neck: n }).head), -40, 60, 'the start neck (head on the floor)');
  return withArms({ ...p1, neck });
})();

// ---- Mistake: the arch at the top: lumbar -M_ARCH, the hip angle held, the upper back on the floor, the feet planted ----
const ANKLE_AT = s => [s * FOOT_X, ANKLE_Y, SOLE(s)[2] - REF.mid * H];
const SHANK = WINTER.shank * H;
export const M_TILT = bisect(t => { const l = L(place(t, -M_ARCH, { hip: END_HIP, knee: END_KNEE })), k = l['knee.r'], a = ANKLE_AT(-1); return Math.hypot(k[1] - a[1], k[2] - a[2]) - SHANK; }, END_TILT - 30, END_TILT + 15, 'the Mistake pelvis (feet planted)');
const mistakePose = withArms({ ...onFloor(M_TILT, -M_ARCH), plant });

const LE = L(end), LS = L(start), LM = L(mistakePose);
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
// The knee bend arc (hack_squat's and bench_dip's convention: the bend from straight): from the top thigh extended past
// the knee to the ankle, in front of the shin, so its leader starts in open space and crosses no line.
const THIGH_DIR = [LE['knee.r'][2] - LE['hip.r'][2], LE['knee.r'][1] - LE['hip.r'][1]];
export const GB = { start, end, mistakePose, LE, LS, LM, SOLE, FLOOR, outlineOf };

export default {
  id: 'glute_bridge', name: 'Glute Bridge', view: 'side', facing: 'right',
  camera: { fit: true },
  hand: 'flat',
  poses: { start, end },
  equipment: [
    { type: 'floor', from: Math.min(...outlineOf(start).head.map(p => p[2])) - FLOOR_BACK, to: LE['toe.r'][2] + FLOOR_FRONT },
  ],
  checks: [
    // c1 (setup): the upper back, the buttock and the whole feet on the floor at the start; c2: the sacrum (the tucked low back)
    ...['backUpper', 'buttock', 'heel.l', 'heel.r', 'ball.l', 'ball.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'start', tol: 0.5 })),
    // the sacrum 0.65 cm up at the 25 deg ceiling (the recorded miss of the tuck solve): within PQ-H6's 1 cm contact limit
    { landmark: 'sacrum', plane: FLOOR, pose: 'start', tol: 1 },
    // c3: the heels pressing into the floor at the top (the Mistake keeps them planted too)
    ...['heel.l', 'heel.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'end', tol: 0.5 })),
    ...['heel.l', 'heel.r', 'ball.l', 'ball.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'mistake', tol: 0.5 })),
    // nothing through the floor: the feet and hands on or above it; no back landmark more than 1 cm into it (D-LIB18-FRAME;
    // the tucked start's backMid sits 0.18 cm in, the back's soft tissue on the floor)
    ...['toe.l', 'toe.r', 'heel.l', 'heel.r', 'ball.l', 'ball.r', 'wrist.l', 'wrist.r', 'head'].map(landmark => ({ landmark, above: FLOOR, pose: 'all', tol: 0 })),
    ...['backUpper', 'backMid', 'sacrum', 'buttock'].map(landmark => ({ landmark, above: FLOOR, pose: 'all', tol: 1 })),
  ],
  ghosts: { count: 2, parts: ['trunk', 'leg.r', 'arm.r'] },
  trace: { point: 'hip.r', trim: [6, 8] },
  measure: { vertex: 'knee.r', from: { dir: THIGH_DIR }, to: 'ankle.r', radius: 20, title: 'Knee', value: 'about 90°', expect: 90, box: { left: 285, top: 262 } },
  callouts: [
    // c2, c6, c12: on the pelvis (ruling PR #306 6357883031 item 2c): the torso's front outline straight above the hip
    // joint (hips + [-5.9, -14] px, perpendicular to the trunk, 0.04 px from the end outline), met from the open space
    // above; the leader crosses no figure and runs >= 6 px from the Trace (the low back's underside is enclosed)
    { key: 'tuck', text: 'Pelvis<br>tucked', anchor: { at: 'hips', off: [-5.9, -14] }, box: { left: 70, top: 215 }, cue: 'Keep the core tight and the pelvis tucked so the low back does not arch.' },
    // c4: on the thigh's top edge, on the shoulder-hip-knee line, from the open space above
    { key: 'line', text: 'Straight<br>line', anchor: { along: ['hip.r', 'knee.r'], t: 0.55, off: [0, -11] }, box: { left: 180, top: 205 }, cue: 'At the top your shoulders, hips and knees form a straight line.' },
    // c4: the knee at the top
    { key: 'knee', text: 'Knees<br>at 90', anchor: { at: 'knee.r', pose: 'end' }, box: { left: 262, top: 205 }, cue: 'At the top your shin and thigh form roughly a right angle.' },
  ],
  tempo: [{ phase: 'Lift', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', smooth: true, pts: [{ at: 'backMid', pose: 'mistake' }, { at: 'sacrum', pose: 'mistake' }, { at: 'buttock', pose: 'mistake' }] },
    ],
    tells: [
      // c6, c7: on the lumbar back (ruling PR #306 6357883031 item 2b): the Mistake sacrum, on the Mistake back outline
      // (0.0 px), 5.5 px inside the end figure; the leader enters the end figure (and the Mistake figure) once, from the
      // front (above, box to screen right), crossing no equipment, 72.4 px (D-LIB18-LIFT: at most 81.9; box scan in notes)
      { key: 'arch', text: 'Back<br>arched', anchor: { at: 'sacrum', pose: 'mistake' }, box: { left: 172, top: 224 }, cue: 'The lower back overarches as the hips push too high.' },
    ],
  },
  alt: 'Glute bridge, side view. Lying on the back on the floor, arms by the sides, knees bent and feet flat: the hips lift until shoulders, hips and knees form a straight line with the knees at about 90 degrees, then lower back to the floor.',
};
