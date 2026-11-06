// Machine pullover (seated elbow-pad pullover machine, Nautilus style: the card's drawing note), side view, figure facing
// screen right. LIB-16 (LB6, mode H; census closest lat_pulldown; the `pulloverMachine` composer's anchor, plan 2.1:141).
// View: side (card plate.view = census view). The arms turn in the sagittal plane from overhead to the midsection (c3,
// c4), and the back and head leaving the pad (c7, c8) read only from the side.
// Sources: research card docs/research/howto/cards/machine_pullover.json (research head a8e66f32): callouts =
//  plate.checkpoints (c1 Shoulders at pivot, c6 Push with elbows, c7 Back on pad); Mistake = plate.mistake (c8, the back
//  arched off the pad, drawable); tempo = plate.tempo (c14: up 2, down 2, pause 1).
// Clone source: lat_pulldown (the 8, main; D-LIB16-CLONE) for the seated root and the arm path; machine_chest_press
//  (the 8, main) for the back pad laid tangent to the back and the seat and feet; the startArmPhantom method for hidden
//  start parts. Copied, never imported (D-LIB9-CLONE). Equipment: eq/pulloverMachine.mjs (single use; its anchor).
// Pose map (DESIGN.md section 9): identity. Start = plate.start (arm overhead, c2, c3, c6, c7); end = plate.end (the bar
//  at the belt, c4, c7); the Mistake is drawn against the end pose.
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Seat SEAT_TOP (the 8's chest press), pelvis upright, feet flat as the 8's; the back pad laid tangent to the upper back
//  and the buttock (c2, c7); the head on the pad: the neck extends NECK, SOLVED so the back of the head touches the pad
//  face (c7).
//  The movement arm turns about the pivot PIVOT_UP above the shoulder joint (c1 "slightly below the axis"). The upper
//  arm's angle THETA (from hanging, flexion) sets the elbow on the pad (c3), the forearm bent ELBOW_FLEX with the open
//  hand on the crossbar (c3, c6; the engine's flat palm); the bar is rigid on the arm, so every pose turns the same arm
//  about the pivot. THETA at the start is SOLVED so the bar sits BAR_BEHIND behind the back of the head (c3 "near or
//  slightly behind the head"); at the end SOLVED so the bar is BAR_OVER_BELT above the belt (c4 "in tight to the seat
//  belt").
//  Mistake (c8): the lower back and head pull away from the pad as the arm comes down: the pelvis tips forward M_ARCH
//  on the seat (the low back arches) while the thorax keeps its angle, so the low back, upper back and head move
//  forward off the pad; the arm stays at the end.
// Unsourced numbers (SIZES below; lb6/sizes.json holds each with its basis). The elbow's pole is an IK hint.
import { bodyShapes, fk, landmarksOf, normPose, RADII, resolve, rootOnSeat, WINTER } from '../engine.mjs';
import { PULLOVER_MACHINE, PULLOVER_MACHINE_ITEMS, pulloverMachine } from '../eq/pulloverMachine.mjs';
import { perItem } from '../eq/parts.mjs';

const H = 1.75, R = Math.PI / 180, B = { height: H };
export const SIZES = Object.freeze({ SEAT_TOP: 0.46, SEAT_Z: 0.10, FEET_X: 0.10, FEET_Z: 0.47, PIVOT_UP: 0.03, ELBOW_FLEX: 90, BAR_BEHIND: 0.03,
  BAR_OVER_BELT: 0.03, BELT_T: 0.25, PAD_LEN: 1.0, PAD_BELOW: 0.08, FRAME_BACK: 0.15, FOOT_BAR_UP: 0.30, FOOT_BAR_FWD: 0.10,
  BEAM_OUT: 0.10, FLOOR_BACK: 0.20, FLOOR_FRONT: 0.30, M_ARCH: 12, M_NECK: 12 });
const { SEAT_TOP, SEAT_Z, FEET_X, FEET_Z, PIVOT_UP, ELBOW_FLEX, BAR_BEHIND, BAR_OVER_BELT, BELT_T, PAD_LEN, PAD_BELOW, FRAME_BACK, FOOT_BAR_UP,
  FOOT_BAR_FWD, BEAM_OUT, FLOOR_BACK, FLOOR_FRONT, M_ARCH, M_NECK } = SIZES;

// Bracketed root finder (Illinois regula falsi, copied from back_extension, #274): throws when f(a) and f(b) have the
// same sign (D-LIB9-CLONE b).
export const bisect = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`machine_pullover: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-8; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};

const SEAT = [0, SEAT_TOP, 0];
const feet = { l: { at: [FEET_X, 0, FEET_Z] }, r: { at: [-FEET_X, 0, FEET_Z] } };
const trunkOnly = (neck, tilt = 0) => ({ root: { at: rootOnSeat(SEAT, tilt, H), tilt }, trunk: -tilt, neck, plant: feet });
const L0 = landmarksOf(trunkOnly(0), H);
// Back pad: tangent to the upper back and the buttock of the upright body (the 8's chest press method).
const padU = [0, L0.backUpper[1], L0.backUpper[2]], padL = [0, L0.buttock[1], L0.buttock[2]];
const PAD_N = (() => { const d = [0, padU[1] - padL[1], padU[2] - padL[2]], n = [0, -d[2], d[1]], k = Math.hypot(...n); return n.map(v => v / k); })();
const padOff = p => (p[1] - padU[1]) * PAD_N[1] + (p[2] - padU[2]) * PAD_N[2];   // + in front of the pad face
const probe = { view: 'side', facing: 'right', near: 'r', pxm: 1, P: w => [w[2], -w[1]] };
const headBack = pose => { const sk = fk(resolve(normPose(pose, B), B).q, B), h = bodyShapes(sk, probe).find(s => s.key === 'head').poly;
  return Math.min(...h.map(([z, my]) => padOff([0, -my, z]))); };
// c7: the neck extends (negative) until the back of the head touches the pad face (bracket -30..10 deg).
export const NECK = bisect(n => headBack(trunkOnly(n)), -30, 10);
const SH = landmarksOf(trunkOnly(NECK), H)['shoulder.r'];
export const PIVOT = [0, SH[1] + PIVOT_UP, SH[2]];
const dir = phi => [0, -Math.cos(phi * R), Math.sin(phi * R)];                         // from hanging, toward the front
const L1 = WINTER.upperArm * H, L2 = (WINTER.forearm + WINTER.hand) * H;               // the open hand: wrist to fingertips
const rot = (p, deg) => { const a = deg * R, dz = p[2] - PIVOT[2], dy = p[1] - PIVOT[1];  // about the pivot, deg toward hanging (dir(th) turns the other way)
  return [p[0], PIVOT[1] + dy * Math.cos(a) - dz * Math.sin(a), PIVOT[2] + dz * Math.cos(a) + dy * Math.sin(a)]; };
// The arm frame at angle th0 (the start's): the elbow on the pad face, the hand along the forearm (wrist to fingertips),
// the bar under the middle of the palm. Every other pose turns it about the pivot by (th - th0).
const frame0 = th => {
  const E = [0, SH[1] + L1 * dir(th)[1], SH[2] + L1 * dir(th)[2]], f = dir(th + ELBOW_FLEX);
  const W = [0, E[1] + WINTER.forearm * H * f[1], E[2] + WINTER.forearm * H * f[2]];
  const palm = [0, W[1] + WINTER.hand * H * 0.45 * f[1], W[2] + WINTER.hand * H * 0.45 * f[2]];
  const n = dir(th + ELBOW_FLEX - 90);                                                   // the palm faces the bar (toward the upper arm's line)
  const bar = palm.map((v, i) => v + n[i] * (0.016 + RADII.fore[2] * H));
  const back = dir(th - 90), elbowAt = E.map((v, i) => v + back[i] * RADII.elbowCap * H);
  return { E, W, bar, elbowAt, u: dir(th), n: back };
};
const belt = (() => {   // the belt across the top of the thighs, BELT_T of the way from the hip to the knee
  const h = L0['hip.r'], k = L0['knee.r'], d = [0, k[1] - h[1], k[2] - h[2]], L = Math.hypot(...d), u = d.map(v => v / L), n = [0, -u[2], u[1]];
  const up = n[1] > 0 ? n : n.map(v => -v), r = RADII.thigh[1] * H;
  return { at: [0, h[1] + d[1] * BELT_T + up[1] * r, h[2] + d[2] * BELT_T + up[2] * r], along: u };
})();
// THETA at the start: the bar BAR_BEHIND behind the back of the head (bracket 120..185 deg).
const HEAD_Z = (() => { const sk = fk(resolve(normPose(trunkOnly(NECK), B), B).q, B); return Math.min(...bodyShapes(sk, probe).find(s => s.key === 'head').poly.map(p => p[0])); })();
export const THETA0 = bisect(th => frame0(th).bar[2] - (HEAD_Z - BAR_BEHIND), 120, 185);
const F0 = frame0(THETA0);
const armAt = th => { const d = THETA0 - th; return { u: dir(th), n: dir(th - 90), elbowAt: rot(F0.elbowAt, d), bar: rot(F0.bar, d), W: rot(F0.W, d), E: rot(F0.E, d) }; };
// THETA at the end: the bar BAR_OVER_BELT above the belt's top (bracket -10..60 deg).
export const THETA1 = bisect(th => armAt(th).bar[1] - (belt.at[1] + PULLOVER_MACHINE.beltT + PULLOVER_MACHINE.barR + BAR_OVER_BELT), -30, 20);
// The hand: wrist IK target on the arm frame (the open palm then lies along the forearm onto the bar).
const wristTarget = th => armAt(th).W;
const GRIP_OFF = 0.46 * WINTER.hand * H;   // the engine's grip point: 0.46 of the hand past the wrist
const reach = th => { const a = armAt(th), f = dir(th + ELBOW_FLEX), w = wristTarget(th), g = [0, w[1] + f[1] * GRIP_OFF, w[2] + f[2] * GRIP_OFF];
  return { r: { at: [SH[0], g[1], g[2]], pole: [0, a.u[1], a.u[2]] }, l: { at: [-SH[0], g[1], g[2]], pole: [0, a.u[1], a.u[2]] } }; };
const pose = (th, tilt = 0) => ({ ...trunkOnly(NECK, tilt), reach: reach(th) });
const start = pose(THETA0), end = pose(THETA1);
const via = [1 / 3, 2 / 3].map(t => pose(THETA0 + (THETA1 - THETA0) * t));
// Mistake (c8): the pelvis tips forward M_ARCH on the seat (the low back hollows) and the lumbar spine extends as much,
// so the thorax keeps its angle but sits forward of the pad (the back off the pad); the neck bends M_NECK forward from
// the start's, so the head pulls off the pad too.
const M_ROOT = trunkOnly(NECK, M_ARCH).root;
const mistakePose = { root: M_ROOT, trunk: -M_ARCH, neck: NECK + M_NECK };

// Hidden start parts (DRAWING-GUIDE section 4; slice look #297 6346404542 item 2): the start bar and the open hands on it
// sit behind the head, so they are redrawn in the end pose as a dashed phantom outline (the 8's startArmPhantom method).
const insidePoly = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
  const [xi, yi] = poly[i], [xj, yj] = poly[j];
  if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
const outlineRuns = polys => { const runs = [];
  polys.forEach((poly, k) => {
    let run = [];
    const flush = () => { if (run.length > 1) runs.push(run); run = []; };
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], q = poly[(i + 1) % poly.length], n = Math.max(1, Math.ceil(Math.hypot(q[0] - a[0], q[1] - a[1]) / 0.002));
      for (let j = 0; j < n; j++) {
        const pt = [a[0] + (q[0] - a[0]) * j / n, a[1] + (q[1] - a[1]) * j / n];
        if (polys.some((o, m) => m !== k && insidePoly(pt, o))) flush(); else run.push(pt);
      }
    }
    flush();
  });
  return runs; };
export const START_PHANTOM = (() => {
  const sk = fk(resolve(normPose(start, B), B).q, B);
  const hand = bodyShapes(sk, probe, { hand: 'flat' }).filter(sh => sh.key === 'palm.r' || sh.key === 'fore.r').map(sh => sh.poly);
  const bar = Array.from({ length: 16 }, (_, k) => [F0.bar[2] + 0.016 * Math.cos(2 * Math.PI * k / 16), -(F0.bar[1] + 0.016 * Math.sin(2 * Math.PI * k / 16))]);
  return outlineRuns([...hand, bar]).map(r => ({ type: 'line', pts: r.map(p => [0, -p[1], p[0]]), cls: 'eq-line m-line', z: 'front' }));
})();

// The faulty pose's contact planes: the pad face (back), the elbow on the pad face, the wrist on the bar.
const PAD = { point: padU, normal: PAD_N }, FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
const elbowPlane = th => { const a = armAt(th); return { point: a.elbowAt.map((v, i) => v - a.n[i] * RADII.elbowCap * H), normal: a.n }; };
const LS = landmarksOf(start, H);
const FRAME_Z = padL[2] - FRAME_BACK;
const FOOT_BAR = (() => { const k = L0['knee.r'], a = L0['ankle.r']; return [0, a[1] + FOOT_BAR_UP, Math.max(k[2], a[2]) + FOOT_BAR_FWD]; })();
const machine = (lm, ctx) => {
  const th = ctx.pose === 'start' ? THETA0 : ctx.pose === 'end' || ctx.pose === 'mistake' ? THETA1
    : (() => { const s = lm['shoulder.r'], e = lm['elbow.r']; return Math.atan2(e[2] - s[2], -(e[1] - s[1])) / R; })();
  return pulloverMachine({ seat: { at: [0, SEAT_TOP, SEAT_Z] }, pad: { surface: [padU, padL], len: PAD_LEN, below: PAD_BELOW }, belt,
    footBar: FOOT_BAR, pivot: PIVOT, arm: armAt(th), frameZ: FRAME_Z, floorZ: [FRAME_Z - BEAM_OUT, FOOT_BAR[2] + BEAM_OUT] });
};

// The drop that carries the pivot hub, at its front edge above the head: the hub itself sits behind the shoulder, so
// the end figure and the elbow Trace close it in, and no leader reaches it from open space (D-LIB16-PIVOT-ANCHOR).
const DROP_AT = 1.84;   // world height on the drop, between the head top and the top beam
const PIVOT_DROP = [0, DROP_AT, PIVOT[2] + PULLOVER_MACHINE.tubeT / 2];
export const PM = { padL, pivot: PIVOT, theta: [THETA0, THETA1], armAt, belt, pad: PAD, neck: NECK, elbowPlane, footBar: FOOT_BAR };
export default {
  id: 'machine_pullover', name: 'Machine Pullover', view: 'side', facing: 'right',
  camera: { x0: 160, y0: 339 },
  hand: 'flat',
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: FRAME_Z - FLOOR_BACK, to: FEET_Z + FLOOR_FRONT },
    ...perItem(machine, PULLOVER_MACHINE_ITEMS),
    (lm, ctx) => (ctx.pose === 'end' ? START_PHANTOM : null),   // the hidden start bar and hand, dashed
  ],
  checks: [
    { landmark: 'seat', plane: { point: SEAT, normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'backUpper', plane: PAD, pose: 'start', tol: 0.5 },                                // c7 torso on the pad
    { landmark: 'backUpper', plane: PAD, pose: 'end', tol: 0.5 },
    { landmark: 'buttock', plane: PAD, pose: 'start', tol: 0.5 },
    { landmark: 'buttock', plane: PAD, pose: 'end', tol: 0.5 },
    { landmark: 'elbow.r', plane: elbowPlane(THETA0), pose: 'start', tol: 0.5 },                   // c3 upper arms on the pads
    { landmark: 'elbow.l', plane: elbowPlane(THETA0), pose: 'start', tol: 0.5 },
    { landmark: 'elbow.r', plane: elbowPlane(THETA1), pose: 'end', tol: 0.5 },                     // c4 pulling at the pads
    { landmark: 'elbow.l', plane: elbowPlane(THETA1), pose: 'end', tol: 0.5 },
    { landmark: 'wrist.r', at: LS['wrist.r'], pose: 'start', tol: 0.5 },                           // c3 hands on the movement arm
    { landmark: 'wrist.l', at: LS['wrist.l'], pose: 'start', tol: 0.5 },
    { landmark: 'heel.r', plane: FLOOR, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: FLOOR, pose: 'all', tol: 0.5 },
  ],
  startParts: ['arm.r', 'arm'],
  ghosts: { count: 2, parts: ['arm.r', 'arm'] },
  trace: { point: 'elbow.r', trim: [10, 12] },   // D-LIB16-PULLOVER-TRACE: the elbows drive the pads (c3); the grip's wider arc closed the pivot and the elbow cue in
  callouts: [
    { key: 'pivot', text: 'Shoulders<br>at pivot', anchor: PIVOT_DROP, box: { left: 214, top: 24 }, cue: 'Set the seat so your shoulders sit just below the machine\'s pivot.' },
    { key: 'elbows', text: 'Push with<br>elbows', anchor: { at: 'elbow.r', pose: 'start', off: [2, -6] }, box: { left: 184, top: 72 }, cue: 'Keep your hands open and drive the pads down with your elbows.' },
    { key: 'pad', text: 'Back on pad', anchor: 'backUpper', box: { left: 28, top: 174 }, cue: 'Keep your torso and head against the back pad.' },
  ],
  tempo: [{ phase: 'Pull', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['trunk'],   // the fault is the back and head; the arms and legs follow the hips by a few mm
    guides: [],
    tells: [
      { key: 'arch', text: 'Back arches', anchor: { at: 'backUpper', pose: 'mistake' }, box: { left: 22, top: 174 }, cue: 'The lower back arches away from the pad.' },
      { key: 'head', text: 'Head off pad', anchor: { at: 'head', pose: 'mistake' }, box: { left: 166, top: 84 }, cue: 'The head pulls forward off the pad.' },
    ],
  },
  alt: 'Machine pullover, side view. Seated with the belt on and the back and head on the pad, the lifter drives the elbow pads from overhead down to the waist, open hands resting on the bar, until the bar sits close to the seat belt.',
};
