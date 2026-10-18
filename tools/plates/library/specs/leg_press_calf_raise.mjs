// Leg press calf raise, 45-degree plate-loaded sled, side view (figure faces the sled, screen right). LB1, mode H.
// View: side (card plate.view). The only moving joint is the ankle, in the sagittal plane; the heel drop, the foot on
// the platform edge and the knee lock (the fault) all read from the side.
// Source: docs/research/howto/cards/leg_press_calf_raise.json (claude/libht-research). Claims used: c1 (balls of the
// feet on the bottom edge of the platform, heels free, toes straight or slightly out), c2 (legs straight or very
// slightly bent, never locked; only the ankles move), c3 (hands on the side handles), c4 (push the platform up with the
// ankles through about 30-45 degrees, hold the top, return to a slight stretch, ball of the foot 10-20 degrees toward
// the shin), c5 and c6 (the fault: going fast straightens and locks the knees), c7 (the balls of the feet keep firm
// contact), c8 (no bounce at the bottom), c15 (tempo 2 up, 1 hold, 2 down).
// Clone source: leg_press (golden A, bc0f378): the same rig, copied (rails 45 deg, plate tilt 15 deg, back pad 30 deg,
// seat pan, frame, side handles), so the calf raise sits on the parent's machine.
// Geometry decisions:
//  - Feet: the ball 3 cm above the platform's bottom edge (BALL_U), heels past the edge; the foot pivots about the
//    ball (as the parent's heels-up Mistake), FOOT[pose] deg from flat on the face. Feet 26 cm apart, toes 5 deg out
//    (c1 gives no width; the parent's 34 cm and 15 deg leave the ball 0.6-0.8 cm off the plate at these near-straight
//    knees, because the engine's ankle bends only in the shin's plane; at 26 cm and 5 deg every pose is within 0.3 cm).
//  - Knees 25 deg bent in start and end and unchanged (c2: straight or very slightly bent; the parent's top is about
//    15): each pose's sled travel is solved so the knee stays at KNEE (the ankle alone moves the platform). 25 is the
//    least bend at which the knee's snap to straight moves the tell anchor past PQ-H3's smallest approved deviation
//    (11.4 px; 20 deg gives 10.0 px).
//  - Start: the stretch, ankle about 20 deg toward the shin (c4: 10-20). End: ankle about 24 deg extended, a 43.5 deg
//    range (c4: 30-45). The sled moves 8.2 cm along the rail.
//  - Mistake (card plate.mistake, c5, c6): the knees snap straight and lock (1 deg) at the end's foot angle; the
//    sled goes a further 2.2 cm out.
import { legPressFace, landmarksOf, normPose, resolve } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const TILT = -60;                                        // pelvis/back recline: back pad 30 deg above horizontal (parent)
const HIP = [0, 0.50, 0];                                // hip-joint centre (parent)
const PHI = 15;                                          // footplate tilt vs square to the rail (parent)
const OFF = 0.22;                                        // plate face 22 cm above the rail line (parent)
const FOOT_X = 0.13;                                     // sole centres 26 cm apart (see below)
const TOE_OUT = 5;                                       // toes slightly out (c1)
const toeOf = (up, sx) => { const o = TOE_OUT * R; return [sx * Math.sin(o), up[1] * Math.cos(o), up[2] * Math.cos(o)]; };

// The parent's rail line, rebuilt exactly as leg_press builds it from its bottom pose (so the machine is the same).
const SHIN = -3, TH = (SHIN + 90) * R, S = SHIN * R, LT = 0.245 * H, LS = 0.246 * H;
const kneeB = [0, HIP[1] + LT * Math.sin(TH), HIP[2] + LT * Math.cos(TH)];
const ankleB = [0, kneeB[1] + LS * Math.sin(S), kneeB[2] + LS * Math.cos(S)];
const F0 = legPressFace({ rail: { from: [0, 0, 0], angle: 45 }, offset: OFF, plate: { tilt: PHI } }, 0), N = F0.normal, UP = F0.up;
const soleB = [0, ankleB[1] - N[1] * 0.039 * H + UP[1] * 0.044 * H, ankleB[2] - N[2] * 0.039 * H + UP[2] * 0.044 * H];
const DIR = [0, Math.SQRT1_2, Math.SQRT1_2], NUP = [0, DIR[2], -DIR[1]];
const faceB = [0, soleB[1] - UP[1] * 0.10, soleB[2] - UP[2] * 0.10];
const FROM = [0, faceB[1] - NUP[1] * OFF - DIR[1] * 0.62, faceB[2] - NUP[2] * OFF - DIR[2] * 0.62];
const LP = { rail: { from: FROM, angle: 45, length: 1.35 }, offset: OFF, plate: { tilt: PHI, h: 0.7 } };

// Feet: the ball BALL_U along the face from its reference point (the plate's bottom edge is at -0.35 h = -0.245), the
// foot turned FOOT_DEG about the ball (+: heel toward the lifter, the ankle extends; -: heel past the edge).
const BALL_U = -0.215;
const ballAt = tv => { const fc = legPressFace(LP, tv); return [0, fc.at[1] + fc.up[1] * BALL_U, fc.at[2] + fc.up[2] * BALL_U]; };
const feetAt = (tv, deg) => {
  const fc = legPressFace(LP, tv), a = deg * R, n = fc.normal, t = fc.up, b = ballAt(tv);
  const t2 = t.map((v, i) => v * Math.cos(a) - n[i] * Math.sin(a)), n2 = n.map((v, i) => v * Math.cos(a) + t[i] * Math.sin(a));
  return { l: { at: [FOOT_X, b[1], b[2]], normal: n2, toe: toeOf(t2, 1), ref: 'ball' }, r: { at: [-FOOT_X, b[1], b[2]], normal: n2, toe: toeOf(t2, -1), ref: 'ball' } };
};
// sled travel of any pose, read back from the ball (so ghosts and the Mistake move the sled with the feet)
const travelOf = lm => { const b = lm['ball.r'], b0 = ballAt(0); return (b[1] - b0[1]) * DIR[1] + (b[2] - b0[2]) * DIR[2]; };
// footplate outline (world) at a sled travel, the same box as the engine's legPress45 plate (70 cm x 3.5 cm)
const plateOutline = tv => {
  const fc = legPressFace(LP, tv), t = 0.035, lo = -0.7 * 0.35, hi = 0.7 * 0.65;
  const P = (u, d) => [0, fc.at[1] + fc.up[1] * u - fc.normal[1] * d, fc.at[2] + fc.up[2] * u - fc.normal[2] * d];
  return [P(lo, 0), P(hi, 0), P(hi, t), P(lo, t), P(lo, 0)];
};
// hands on the side handles beside the hips (c3; parent)
const HANDLE = [0.25, HIP[1] + 0.03, HIP[2] + 0.10];
const hands = { l: { at: HANDLE, pole: [1, 0.25, 0] }, r: { at: [-HANDLE[0], HANDLE[1], HANDLE[2]], pole: [-1, 0.25, 0] } };
const base = { root: { at: HIP, tilt: TILT }, trunk: 0, neck: 5, reach: hands };

// Each pose's sled travel: solved so the knee bends KNEE deg at the pose's foot angle (bisection; the knee straightens
// as the sled goes out). Throws if the bracket holds no root.
const KNEE = 25, FOOT = { start: 5, end: 42 }, LOCK = 1;
const kneeAt = (tv, deg) => { const b = { height: H }; return resolve(normPose({ ...base, plant: feetAt(tv, deg) }, b), b).q.knee.r; };
const travelFor = (knee, deg) => {
  let lo = 0.6, hi = 1.2;
  if (!(kneeAt(lo, deg) > knee && kneeAt(hi, deg) < knee)) throw new Error(`leg_press_calf_raise: no sled travel in [${lo}, ${hi}] gives knee ${knee} deg`);
  for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (kneeAt(m, deg) > knee) lo = m; else hi = m; }
  return (lo + hi) / 2;
};
const T = { start: travelFor(KNEE, FOOT.start), end: travelFor(KNEE, FOOT.end), mistake: travelFor(LOCK, FOOT.end) };
const start = { ...base, plant: feetAt(T.start, FOOT.start) };
const end = { ...base, plant: feetAt(T.end, FOOT.end) };
const mistakePose = { plant: feetAt(T.mistake, FOOT.end) };

// Pads (parent): back pad tangent to the upper back and the buttock, seat pan under the pelvis, frame posts.
const LM = landmarksOf(end, H);
const PAD_U = (() => { const d = [0, LM.backUpper[1] - LM.buttock[1], LM.backUpper[2] - LM.buttock[2]], l = Math.hypot(...d); return d.map(v => v / l); })();
const PAD_N = [0, -PAD_U[2], PAD_U[1]];
const SEAT_RISE = 20;
const PAD_POST = [0, LM.buttock[1] + PAD_U[1] * 0.30 - PAD_N[1] * 0.07, LM.buttock[2] + PAD_U[2] * 0.30 - PAD_N[2] * 0.07];
const SEAT_POST = [0, LM.buttock[1] - 0.075, LM.buttock[2] + 0.12];
const BASE_Z0 = PAD_POST[2] - 0.10;
// the ball on the drawn plate face, per pose
const onFace = pose => ({ landmark: 'ball.r', plane: { point: ballAt(T[pose]), normal: legPressFace(LP, T[pose]).normal }, pose, tol: 1 });

export default {
  id: 'leg_press_calf_raise', name: 'Leg Press Calf Raise', view: 'side', facing: 'right',
  camera: { fit: { left: 10, right: 10, top: 40, bottom: 18 }, maxScale: 1 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.80, to: 1.30 },
    { type: 'box', at: [0, 0.02, (BASE_Z0 + FROM[2] - 0.03) / 2], w: FROM[2] - 0.03 - BASE_Z0, h: 0.04 },     // frame rail
    { type: 'box', at: [0, PAD_POST[1] / 2 + 0.02, PAD_POST[2]], w: 0.05, h: PAD_POST[1] - 0.04 },            // back-pad post
    { type: 'box', at: [0, SEAT_POST[1] / 2 + 0.02, SEAT_POST[2]], w: 0.05, h: SEAT_POST[1] - 0.04 },         // seat post
    { type: 'line', cls: 'eq', pts: [HANDLE, [0, HANDLE[1] - 0.10, HANDLE[2] - 0.02]], z: 'back' },         // handle arm
    { type: 'backPad', surface: [LM.backUpper, LM.buttock], len: 0.95, below: 0.02, post: false },
    { type: 'backPad', at: [0, LM.buttock[1] - 0.004, LM.buttock[2]], angle: 90 + SEAT_RISE, len: 0.34, below: 0.30, post: false },
    (lm, ctx) => [
      { type: 'legPress45', ...LP, travel: travelOf(lm), part: 'sled' },
      // the start layer never draws moving equipment, so the start footplate is a dashed outline in the end pose
      ...(ctx.pose === 'end' ? [{ type: 'line', cls: 'eq-line m-line', pts: plateOutline(T.start), z: 'back', part: 'phantom' }] : []),
    ],
    { type: 'pulley', at: HANDLE, r: 0.018, z: 'mid' },
  ],
  checks: [
    onFace('start'), onFace('end'), onFace('mistake'),   // balls of the feet on the drawn plate in every pose (c1, c7)
    { landmark: 'buttock', plane: { point: LM.buttock, normal: PAD_N }, pose: 'all', tol: 1 },
    { landmark: 'backUpper', plane: { point: LM.backUpper, normal: PAD_N }, pose: 'all', tol: 1 },
  ],
  ghosts: { count: 3, parts: ['leg.r'] },
  trace: { point: 'toe.r', trim: [2, 2] },
  callouts: [
    { key: 'balls', text: 'Balls<br>of feet', anchor: 'ball.r', cue: 'Only the balls of the feet on the bottom edge of the platform, heels free.' },
    { key: 'soft', text: 'Knees<br>soft', anchor: 'knee.r', cue: 'Legs straight or very slightly bent, never locked, and they do not move.' },
    { key: 'stretch', text: 'Controlled<br>stretch', anchor: { at: 'heel.r', pose: 'start' }, cue: 'Heels lower under control to a slight stretch, with no bounce.' },
  ],
  tempo: [{ phase: 'Raise', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['leg.r', 'leg.l'],
    tells: [
      { key: 'lock', text: 'Knees<br>locked', anchor: { at: 'knee.r', pose: 'mistake' }, cue: 'Going fast, the knees snap straight and lock as the platform goes up.' },
    ],
  },
  alt: 'Leg press calf raise on a 45 degree sled, side view. Reclined on the back pad with the knees slightly bent, only the balls of the feet on the bottom edge of the platform, the ankles push the platform up and lower it under control to a slight stretch.',
};
