// Pendulum squat (machine), side view, figure facing screen right. LIB-18 (LB8 bulk, mode H; tier B; census closest
// leg_press, closeness E; pose classes stand and lean, proven on barbell_back_squat: D-LIB18-CLASSES; composer
// `pendulum`, single use, its own anchor: plan 2.1:141, D-LIB18-COMPOSERS).
// View: side (card plate.view = census view). The depth (c4, c6), the back on the pad (c3), the upright torso (c5, c6),
//  the knees over the toes (c6), the heels flat (c9) and the fault, the heels lifting off the platform at the bottom
//  (c9, c15), all read side-on.
// Sources: research card docs/research/howto/cards/pendulum_squat.json: callouts = plate.checkpoints (c3 Back on pad;
//  c4, c6 Thighs to parallel; c6, c8 Knees over toes); Mistake = plate.mistake (c9, c15: the heels lift off the
//  platform at the bottom; drawable false, the top fault is dropping into the bottom, c10, c20, seen only as speed,
//  so F7 stays raised); tempo = the card's tempo (down 3, c18; up 1, a drawing convention, c18; pause 0); Trace =
//  plate.frames "Trace follows the knee" (D-LIB18-TRACE).
// Clone sources, copied, never imported (D-LIB9-CLONE): leg_press (main tools/plates/vendor/exercises/leg_press.mjs): the
//  machine read back from the body (:56 `travelOf`, here the pad frame read from the back on the pad), the back pad
//  tangent to the upper back and the buttock (:75-77), the heel lift about the ball (:95-101, HEEL_LIFT) and the trim
//  (:132); reverse_lunge (pilot A @ dcac4a38 specs/reverse_lunge.mjs:17-22, PR #109): the rigid foot on its ball, the
//  ball lifted so the toe pad (the lowest forefoot outline point) rests on the support instead of sinking into it.
// Equipment: eq/pendulum.mjs (pivot boss, rear post, floor beam, front post, platform bracket, fixed platform, latch;
//  the moving arm with the carriage, back pad, two shoulder pads (one on each trapezius beside the neck, D-LIB18-PADS)
//  and handle); floor.
// Pose map (DESIGN.md section 9): identity. Start = plate.start, the top (standing on the platform, shoulders under the
//  pads, back on the back pad, c1, c3; feet between hip- and shoulder-width, c2; latch released, c4; knees KNEE_TOP from
//  straight, c21). End = plate.end, the bottom (thighs parallel to the floor, c4, c6: the "or slightly lower" option is
//  not drawn; knees over the toes, c6; torso upright and back on the pad, c3, c5; heels flat, c9).
// Geometry decisions (confirmed by the engine report `angles`, `checks` and the drawn-item tests):
//  The platform is level at PLAT_Y; the mid-soles sit at world z 0, FOOT_X out, toes TOE_OUT out with the knees
//   tracking the toes (the IK pole is the toe line, c6, c8).
//  End: the thigh level (hip-joint centre at the knee's height, c4) and the knee straight over the toe tip (c6 "The knees
//   track over the toes"), both SOLVED (nested bisection on the root's height and fore-aft place); the pelvis tilt is
//   TILT_END (trunk 0: neutral spine).
//  Start: the knee KNEE_TOP from straight (c21) and the whole-body centre of mass (Winter 2009 fractions) over the
//   mid-sole (standing balanced on the platform as the latch is released, c4), both SOLVED; the pelvis tilt is
//   TILT_START.
//  The arm (c3 "back pressed against the backrest throughout", c6 "The torso remains upright, the arc of the machine
//   naturally maintains this position"): the back pad is fixed on the arm, so the torso turns with it. The pad's start
//   and end places (tangent to the upper back and the buttock in each pose) fix the arm's pivot: the one point both
//   places turn about (the pole of the rigid motion, SOLVED in closed form). TILT_START and TILT_END keep the torso
//   within 8 deg of vertical in both poses (barbell_back_squat.mjs:30 "standing tall ... trunk 8 deg forward"), split
//   evenly so the swing (16 deg) is the largest that keeps both upright, which gives the shortest arm. The pivot lands
//   behind and above the lifter (the pad moves down and back as the hips sit back).
//  Via poses (3, at a quarter, half and three quarters of the swing) turn the start torso about the pivot, so the
//   ghosts and the Trace follow the arc (the engine interpolates the root along a straight chord between keys).
//  The Mistake (c9, c15; leg_press.mjs:95-101): at the same arm place, the feet pivot HEEL_LIFT heel-up about the
//   balls; the ball is lifted until the toe pad rests on the platform (reverse_lunge.mjs:19-22), solved (BALL_LIFT); the
//   torso stays on the pad, the knees move forward.
//  Every bisection throws on a bracket with no sign change (D-LIB9-CLONE b). They solve to: END_Y, END_Z (the end
//   root), START_Y, START_Z (the start root), BALL_LIFT; the pivot is closed form.
// Labels (every box placed, F4): the back lies on the pad, so "Back on pad" meets the back's pad contact (the sacrum)
//  from behind and crosses the pad once (D-LIB18-BACKPAD's allowed named nit). "Thighs to parallel" meets the thigh's
//  underside from the open space under it (the top of the thigh is covered by the start figure). "Knees over toes" meets
//  the front of the knee from above; the ghosts' knees close the space round the end knee, so its leader touches
//  ghost0's knee tip 4.1-5.9 px from the anchor (a named-nit candidate; box scan in the plate notes). The heel tell meets
//  the lifted heel from the open space behind.
// Camera: fit (capped at the reference scale).
// Unsourced numbers (SIZES below; lb8/sizes.json holds each with its basis): PLAT_Y, FOOT_X, TOE_OUT, KNEE_TOP,
//  TILT_START, TILT_END, NECK, HEEL_LIFT, HANDLE_X, HANDLE_N, HANDLE_DOWN, POLE_OUT, PAD_BELOW, ARM_AT, LATCH_Y,
//  FLOOR_BACK, FLOOR_FRONT, FLOOR_LINE, TRACE_TRIM, PAD_Y; the composer's PENDULUM constants; the roots,
//  the pivot and BALL_LIFT solved.
import { WINTER, REF, normPose, resolve, fk, landmarks } from '../engine.mjs';
import { add, mul, sub, perItem } from '../eq/parts.mjs';
import { pendulum, swing, shoulderPadPts, PENDULUM, PENDULUM_ITEMS } from '../eq/pendulum.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ PLAT_Y: 0.15, FOOT_X: 0.13, TOE_OUT: 8, KNEE_TOP: 5, TILT_START: -8, TILT_END: 8, NECK: 5, HEEL_LIFT: 12,
  HANDLE_X: 0.25, HANDLE_N: 0.24, HANDLE_DOWN: 0.06, POLE_OUT: 0.6, PAD_BELOW: 0.10, ARM_AT: 0.25, LATCH_Y: 1.2,
  FLOOR_BACK: 0.03, FLOOR_FRONT: 0, FLOOR_LINE: 0.02, TRACE_TRIM: [6, 8], PAD_Y: 0.842 });
const { PLAT_Y, FOOT_X, TOE_OUT, KNEE_TOP, TILT_START, TILT_END, NECK, HEEL_LIFT, HANDLE_X, HANDLE_N, HANDLE_DOWN, POLE_OUT, PAD_BELOW, ARM_AT,
  LATCH_Y, FLOOR_BACK, FLOOR_FRONT, FLOOR_LINE, TRACE_TRIM, PAD_Y } = SIZES;

const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
// Bisection on a bracket (throws when the bracket holds no sign change; D-LIB9-CLONE b).
const bisect = (f, a, b, what) => {
  let fa = f(a);
  if (fa * f(b) > 0) throw new Error(`pendulum_squat: no solution for ${what} in [${a}, ${b}]`);
  for (let i = 0; i < 50; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
  return (a + b) / 2;
};
const ang3 = (a, v, b) => { const p = sub(a, v), q = sub(b, v); return Math.acos(dot(p, q) / Math.hypot(...p) / Math.hypot(...q)) / R; };
const B = { height: H };
const skOf = p => fk(resolve(normPose(p, B), B).q, B);
const L = p => landmarks(skOf(p));
const kneeOf = l => 180 - ang3(l['hip.r'], l['knee.r'], l['ankle.r']);   // knee bend from straight (deg)
// Whole-body centre of mass, Winter (2009) table 4.1 fractions on the landmarks (single_leg_romanian_deadlift.mjs:19-36)
const lerp3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
export const comOf = l => {
  const parts = [[0.497, lerp3(l.hips, l.shoulders, 0.5)], [0.081, l.ear]];
  for (const s of ['l', 'r']) parts.push([0.028, lerp3(l[`shoulder.${s}`], l[`elbow.${s}`], 0.436)], [0.016, lerp3(l[`elbow.${s}`], l[`wrist.${s}`], 0.430)],
    [0.006, lerp3(l[`wrist.${s}`], l[`grip.${s}`], 0.5)], [0.100, lerp3(l[`hip.${s}`], l[`knee.${s}`], 0.433)], [0.0465, lerp3(l[`knee.${s}`], l[`ankle.${s}`], 0.433)],
    [0.0145, lerp3(l[`ankle.${s}`], l[`toe.${s}`], 0.5)]);
  const m = parts.reduce((t, [w]) => t + w, 0);
  return parts.reduce((t, [w, p]) => t.map((v, i) => v + w * p[i] / m), [0, 0, 0]);
};

// Feet: flat on the level platform, mid-soles at z 0, toes turned out TOE_OUT.
const toeOf = sx => { const o = TOE_OUT * R; return [sx * Math.sin(o), 0, Math.cos(o)]; };
const PLANT = { l: { at: [FOOT_X, PLAT_Y, 0], normal: [0, 1, 0], toe: toeOf(1) }, r: { at: [-FOOT_X, PLAT_Y, 0], normal: [0, 1, 0], toe: toeOf(-1) } };
// The back pad's face line in a pose, read from the drawn back: through the buttock, along buttock -> upper back.
const frameOf = l => { const d = sub(l.backUpper, l.buttock), k = Math.hypot(...d), u = [0, d[1] / k, d[2] / k]; return { o: l.buttock, u, n: [0, -u[2], u[1]] }; };
// hands on the handles (in the pad frame: HANDLE_DOWN below the shoulder pad's lower face, HANDLE_N in front of the pad
// face), elbows hanging down along the trunk and out to the sides
const SP_OF = l => { const f = frameOf(l); return dot(sub(l['trap.r'], f.o), f.u); };   // the shoulder line along the pad (the handles' and the back pad top's reference)
const gripAt = (f, sp, sx) => { const g = add(add(f.o, mul(f.u, sp - HANDLE_DOWN)), mul(f.n, HANDLE_N)); return [sx * HANDLE_X, g[1], g[2]]; };
const legs = (at, tilt) => ({ root: { at, tilt }, trunk: 0, neck: NECK, plant: PLANT });
const withHands = p => { const l = L(p), f = frameOf(l), sp = SP_OF(l);
  return { ...p, reach: { l: { at: gripAt(f, sp, 1), pole: [POLE_OUT - f.u[0], -f.u[1], -f.u[2]] }, r: { at: gripAt(f, sp, -1), pole: [-POLE_OUT - f.u[0], -f.u[1], -f.u[2]] } } }; };

// End: thigh level, knee over the toe tip.
const endZ = y => bisect(z => { const l = L(legs([0, y, z], TILT_END)); return l['knee.r'][2] - l['toe.r'][2]; }, -0.6, 0.1, 'the root place that sets the knee over the toe');
export const END_Y = bisect(y => { const l = L(legs([0, y, endZ(y)], TILT_END)); return l['hip.r'][1] - l['knee.r'][1]; }, PLAT_Y + 0.25, PLAT_Y + 0.7, 'the root height that levels the thigh');
export const END_Z = endZ(END_Y);
const end = withHands(legs([0, END_Y, END_Z], TILT_END));
// Start: knee KNEE_TOP, centre of mass over the mid-sole (z 0).
const startY = z => bisect(y => kneeOf(L(legs([0, y, z], TILT_START))) - KNEE_TOP, PLAT_Y + 0.5, PLAT_Y + 1.0, 'the root height of the top knee');
export const START_Z = bisect(z => comOf(L(withHands(legs([0, startY(z), z], TILT_START))))[2], -0.3, 0.3, 'the start root place over the mid-sole');
export const START_Y = startY(START_Z);
const start = withHands(legs([0, START_Y, START_Z], TILT_START));
const LS = L(start), LE = L(end);
// The pivot: the pole of the pad's rigid motion from its start place to its end place (side-view plane).
const FS = frameOf(LS), FE = frameOf(LE);
export const SWING = Math.atan2(FS.u[1] * FE.u[2] - FS.u[2] * FE.u[1], dot(FS.u, FE.u));   // rad, + = forward at the top (swing())
export const PIVOT = (() => {
  const c = Math.cos(SWING), s = Math.sin(SWING), a = LS.buttock, b = LE.buttock;
  // b = P + Rot(a - P) with Rot(dz, dy) = (dz c + dy s, dy c - dz s): solve the 2x2 system (I - Rot) P = b - Rot a
  const ra = [a[2] * c + a[1] * s, a[1] * c - a[2] * s], r = [b[2] - ra[0], b[1] - ra[1]];
  const m = [[1 - c, -s], [s, 1 - c]], det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
  if (Math.abs(det) < 1e-9) throw new Error('pendulum_squat: no pivot (the back pad does not turn between the start and the end)');
  return [0, (m[0][0] * r[1] - m[1][0] * r[0]) / det, (r[0] * m[1][1] - m[0][1] * r[1]) / det];
})();
export const PIVOT_Y = PIVOT[1], PIVOT_Z = PIVOT[2];
// Via poses: the start torso turned about the pivot by a quarter, half and three quarters of the swing.
const viaAt = k => { const a = SWING * k, at = swing(start.root.at, PIVOT, a); return withHands(legs(at, TILT_START + (TILT_END - TILT_START) * k)); };
const via = [0.25, 0.5, 0.75].map(viaAt);
// The arm angle of any pose, read back from the drawn back on the pad (so ghosts and the Mistake move the arm with
// the body; in the Mistake the torso stays on the pad, so the arm stays where the end pose has it).
const angleOf = l => { const f = frameOf(l); return Math.atan2(FE.u[1] * f.u[2] - FE.u[2] * f.u[1], dot(FE.u, f.u)); };
const SP = SP_OF(LE);

// Mistake: heels up HEEL_LIFT about the balls (leg_press.mjs:95-101), the ball lifted so the toe pad rests on the
// platform (reverse_lunge.mjs:19-22): the lowest forefoot outline point (body.mjs FOOT_SIDE, foot frame, H) on PLAT_Y.
const FOREFOOT = [[0.080, -0.039], [0.112, -0.036], [0.120, -0.028], [0.113, -0.020]];
const heelsUp = lift => {
  const a = HEEL_LIFT * R, t2 = [0, -Math.sin(a), Math.cos(a)], n2 = [0, Math.cos(a), Math.sin(a)], o = TOE_OUT * R;
  const side = (sx, l) => ({ at: [sx * FOOT_X, PLAT_Y + lift, LE[`ball.${l}`][2]], normal: n2, toe: [sx * Math.sin(o), t2[1] * Math.cos(o), t2[2] * Math.cos(o)], ref: 'ball' });
  return { l: side(1, 'l'), r: side(-1, 'r') };
};
const toePadLow = lift => { const sk = skOf({ ...end, plant: heelsUp(lift) }); return Math.min(...FOREFOOT.map(([z, y]) => sk.foot('r', [0, y, z])[1])) - PLAT_Y; };
export const BALL_LIFT = bisect(toePadLow, -0.002, 0.03, 'the ball lift that rests the toe pad on the platform');
const mistakePose = { plant: heelsUp(BALL_LIFT) };

const C = PENDULUM;
const PLATFORM = { top: PLAT_Y, z: 0 };                 // centred under the mid-soles
// The shoulder pads (D-LIB18-PADS): one on each trapezius beside the neck (eq/pendulum.mjs header). Their frame is the
// end trunk's, turned with the arm (the thorax rides fixed on the back pad: trunk 0 in every pose): the inner bottom
// edge runs forward at PAD_Y (H, the front outline's trapezius vertex, body.mjs:42) from the back pad's face (closed
// form: the thorax line at PAD_Y meets the end pad's face plane).
const SH_END = (() => {
  const sk = skOf(end), o = sk.thorax([0, 0, 0]), k = Math.hypot(...sub(sk.thorax([0, 1, 0]), o));
  const up = mul(sub(sk.thorax([0, 1, 0]), o), 1 / k), fwd = mul(sub(sk.thorax([0, 0, 1]), o), 1 / k), n = [0, -FE.u[2], FE.u[1]];
  const f = z => dot(sub(sk.thorax([0, PAD_Y, z]), LE.buttock), n), z = -f(0) / (f(1) - f(0));
  return { at: sk.thorax([0, PAD_Y, z]), up, fwd };
})();
const machineAt = l => {
  const a = angleOf(l), o = swing(LE.buttock, PIVOT, a), u = swing(add(LE.buttock, FE.u), PIVOT, a);
  const uu = sub(u, o), f = { o, u: uu, n: [0, -uu[2], uu[1]] };
  const at = swing(SH_END.at, PIVOT, a), turn = v => sub(swing(add(SH_END.at, v), PIVOT, a), at);
  return { pivot: PIVOT, frame: f, pad: { lo: -PAD_BELOW, hi: SP + C.shoulderT }, shoulder: { at, up: turn(SH_END.up), fwd: turn(SH_END.fwd) }, grip: { u: SP - HANDLE_DOWN, n: HANDLE_N, x: -HANDLE_X }, armAt: ARM_AT,
    platform: PLATFORM, frontZ: 0, floorZ: [PIVOT[2] - FLOOR_BACK, C.plateLen / 2 + FLOOR_FRONT], latch: { y: LATCH_Y } };
};
// Start phantom (DRAWING-GUIDE.md 4; D-LIB18-DRAW): the start layer never draws moving equipment, so the start back pad,
// shoulder pad and arm are redrawn as dashed outlines in the end layer.
const outline = (a, b, n, t) => [a, b, add(b, mul(n, t)), add(a, mul(n, t)), a];
const startPhantom = (() => {
  const m = machineAt(LS), f = m.frame, face = (s, off = 0) => add(add(f.o, mul(f.u, s)), mul(f.n, off));
  return [
    { type: 'line', pts: outline(face(-PAD_BELOW), face(SP + C.shoulderT), f.n, -C.padT), cls: 'eq-line m-line', z: 'back', part: 'startArm' },
    // the near shoulder pad's side silhouette at the start (its outer bottom edge and its top, eq/pendulum.mjs)
    (() => { const p = shoulderPadPts(m.shoulder, -1); return { type: 'line', pts: [p[0], p[1], p[3], p[6], p[0]], cls: 'eq-line m-line', z: 'back', part: 'startArm' }; })(),
    (() => { const e = face(ARM_AT, -C.padT * 0.75), d = sub(e, PIVOT), k = Math.hypot(...d), w = [0, -d[2] / k, d[1] / k], h = mul(w, C.armT / 2);
      return { type: 'line', pts: [add(PIVOT, h), add(e, h), sub(e, h), sub(PIVOT, h), add(PIVOT, h)], cls: 'eq-line m-line', z: 'back', part: 'startArm' }; })(),
  ];
})();
const PAD_PLANE = (f) => ({ point: f.o, normal: f.n });
// the drawn back pad's face in a pose (the composer's frame for that pose, so each check is on the drawn item)
const PAD_START = machineAt(LS).frame, PAD_END = machineAt(LE).frame, PAD_MISTAKE = machineAt(L({ ...end, ...mistakePose })).frame;
const PLAT_PLANE = { point: [0, PLAT_Y, 0], normal: [0, 1, 0] };
// a shoulder pad's lower face in a pose (its plane, from its drawn corners: through the inner bottom rear corner, normal up
// out of the trapezius); s +1 the far (left) pad, -1 the near (right) one
const padFace = (s, l) => {
  const sh = machineAt(l).shoulder, p = shoulderPadPts(sh, s), a = sub(p[1], p[0]), b = sub(p[7], p[0]);
  const n = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], k = Math.hypot(...n) * Math.sign(dot(n, sh.up));
  return { point: p[7], normal: mul(n, 1 / k) };
};

export const PS = { LS, LE, FS, FE, SWING, PIVOT, SP, SH_END, padFace, END_Y, END_Z, START_Y, START_Z, BALL_LIFT, PLATFORM, machineAt, frameOf, angleOf, startPhantom, mistakePose, start, end, via };
// The card's contact facts (lb8 DESIGN.md section 11; D-LIB18-FACTS): each bound by a check on its landmark in its pose:
// the feet (heel, ball) on the platform's top face, the back (backUpper, buttock) on the back pad's face, the hands
// (wrist) at the drawn hand on the handle (a grip has no plane; the drawn-item tests prove the grip on the handle).
const factChecks = (pose, p, names) => names.map(landmark => ({ landmark, at: L(p)[landmark], pose, tol: 0.5 }));
export default {
  id: 'pendulum_squat', name: 'Pendulum Squat', view: 'side', facing: 'right',
  camera: { fit: { right: 55 } },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: PIVOT[2] - FLOOR_BACK - FLOOR_LINE, to: PENDULUM.plateLen / 2 + FLOOR_FRONT + FLOOR_LINE },
    ...perItem(lm => pendulum(machineAt(lm)), PENDULUM_ITEMS),
    ...perItem((lm, ctx) => (ctx.pose === 'end' ? startPhantom : []), startPhantom.length),
  ],
  checks: [
    ...factChecks('start', start, ['wrist.l', 'wrist.r']),
    // c1, c7, c9: heel and ball on the platform at the start and the end (the Mistake lifts the heels: checked above it)
    ...['heel.l', 'heel.r', 'ball.l', 'ball.r'].flatMap(landmark => ['start', 'end'].map(pose => ({ landmark, plane: PLAT_PLANE, pose, tol: 0.5 }))),
    ...['heel.l', 'heel.r', 'ball.l', 'ball.r', 'toe.l', 'toe.r'].map(landmark => ({ landmark, above: PLAT_PLANE, pose: 'all', tol: 0 })),
    // c3 "throughout": the upper back and the buttock on the pad face in every pose (the Mistake keeps the torso on it)
    ...['backUpper', 'buttock'].flatMap(landmark => [['start', PAD_START], ['end', PAD_END], ['mistake', PAD_MISTAKE]].map(([pose, f]) => ({ landmark, plane: PAD_PLANE(f), pose, tol: 0.5 }))),
    ...['backUpper', 'backMid', 'sacrum', 'buttock'].flatMap(landmark => [['start', PAD_START], ['end', PAD_END], ['mistake', PAD_MISTAKE]].map(([pose, f]) => ({ landmark, above: PAD_PLANE(f), pose, tol: 0.5 }))),
    // c1: the shoulders under the shoulder pads: each trapezius on its own pad's lower face (the face rides with the arm)
    ...[['trap.l', 1], ['trap.r', -1]].flatMap(([landmark, sd]) => [['start', LS], ['end', LE]].map(([pose, l]) => ({ landmark, plane: padFace(sd, l), pose, tol: 0.5 }))),
  ],
  ghosts: { count: 3, parts: ['leg.r'] },
  trace: { point: 'knee.r', trim: TRACE_TRIM },
  callouts: [
    { key: 'back', text: 'Back on<br>pad', anchor: 'sacrum', box: { left: 110, top: 222 }, cue: 'Core braced, back pressed against the backrest.' },
    { key: 'parallel', text: 'Thighs to<br>parallel', anchor: { along: ['hip.r', 'knee.r'], t: 0.4, off: [0, 10] }, box: { left: 134, top: 276 }, cue: 'Lower until your thighs are parallel or a little lower.' },
    { key: 'knees', text: 'Knees<br>over toes', anchor: { at: 'knee.r', off: [7, -3] }, box: { left: 272, top: 140 }, cue: 'Knees track over the toes, never caving in.' },
  ],
  tempo: [{ phase: 'Lower', s: 3, move: true }, { phase: 'Push', s: 1, move: true }],
  // LIB-ZOOM's inline zoom circle (D-LIBZOOM-EXTEND, #325 6405116791): the Mistake's fault drawn again at k 2.5, the smallest of
  // 1.5-4 whose tell-anchor move reaches deviationMin 11.39 px at the zoom's own scale (14.2 px); zoom/inline.mjs places it.
  zoom: { view: 'mistake', k: 2.5 },
  mistake: {
    pose: mistakePose,
    parts: ['leg.r', 'leg.l'],
    guides: [
      // the lifted sole: a dashed red line along it from the ball back past the raised heel
      { kind: 'dashed', pts: [{ at: 'ball.r', pose: 'mistake' }, { at: 'heel.r', pose: 'mistake' }] },
    ],
    tells: [
      // c9 "Heels rising", c15 "Lifting heels off the platform": on the raised heel
      { key: 'heels', text: 'Heels<br>lift', anchor: { at: 'heel.r', pose: 'mistake' }, box: { left: 280, top: 280 }, cue: 'Heels lift off the platform at the bottom.' },
    ],
  },
  pilot: { drawableFault: 'Top fault: losing control and dropping into the bottom (c20, c10), seen only as speed; the plate draws the next fault by the same steps, the heels lifting off the platform (c9, c15).' },
  alt: 'Pendulum squat, side view. Standing on a fixed platform, shoulders under the pads and back on the pad of a swinging arm, the lifter lowers until the thighs are level, knees over the toes, torso upright and heels flat, then pushes back up to almost straight legs.',
};
