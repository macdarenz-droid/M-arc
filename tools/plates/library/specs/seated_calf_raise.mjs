// Seated calf raise (plate-loaded knee-pad lever machine), side view, figure facing the platform (screen right).
// LIB-18 (LB8, mode H; census closest leg_press, closeness N: D-LIB18-CLONE; the slice's `calfMachine` plate, the
// small-motion and rigid-foot case, F7: D-LIB18-SLICE, -CALF, -F7).
// HELD (S2 and S4; D-LIB8-shrug, D-LIB18-SIZE, -CALF): drawn card-true, measured, never enlarged, re-trimmed or moved:
//  - S2: the heel Trace measures 11.8 px at 146.29 px/m, under traceLenMin 22.11 px (the Mistake's tell deviation,
//    12.2 px, passes deviationMin 11.39 px);
//  - S4: the engine foot is rigid (no toe joint, body.mjs:25), so with the ball fixed on the platform the drawn toe
//    enters the platform's top face once the foot tips 5.4 deg toe-down (ankle 8.9 deg plantar flexion) and is 2.9 cm
//    inside it at the card's top (ankle END_PF); the Mistake's toe is 0.5 cm inside. Route: the owner's (D-LIB18-CALF).
// View: side (card plate.view = census view). The heel range (c7, c8, c12), the knee at 90 with the shin vertical (c1,
//  c4, c13) and the pad above the knees (c2) are all front-to-back.
// Sources: research card docs/research/howto/cards/seated_calf_raise.json (research head 596dbe07): callouts =
//  plate.checkpoints (c2 Pad above knees; c1/c4/c13 Knees at 90; c3 Balls of feet); Mistake = plate.mistake (c10, c12,
//  drawable false: the top fault, bouncing at the bottom, c10/c11, is speed only, so F7 stays raised); tempo =
//  plate.tempo (c19, c9: up 2, pause 1, down 2; lb8/tempo.json: Raise, Hold, Lower).
// Clone sources (copied, never imported; D-LIB9-CLONE): leg_press.mjs (main, the 8) for the side-view seated figure,
//  the knee measure and the heel Trace with its trim (:154) and the foot on its ball (:94-100, heelsUp); reverse_lunge
//  (pilot A @ dcac4a38):17-22 for the rigid foot planted on its ball with ref 'ball'; machine_chest_press and
//  lat_pulldown (main) for the seated, upright trunk with the hands on the machine by IK. Every bisection here throws on
//  a bracket with no root.
// Equipment: the `calfMachine` composer, form 'seated' (seat, platform, front tower and pivot, lever arm with the roller
//  pad, handle and safety lever; eq/calfMachine.mjs); floor.
// Pose map (identity): start = plate.start (the bottom), end = plate.end (the top); the Mistake against the end pose.
// Geometry decisions (confirmed by the engine report `angles`, `checks` and the drawn-item tests):
//  Hips: the hip-joint centres at z 0, trunk upright (tilt 0, trunk 0: c5, c13 "back straight"); the seat pad's top
//   at the seat landmark (SEAT_TOP), so the pelvis rests on it in every pose.
//  Feet (c3): the balls on the platform's top face (plant ref 'ball'), each foot under its hip joint (hip-width), toes
//   forward. Start: thigh level and shin vertical (knee 90, c1, c4) with the ankle START_DF dorsiflexed, which fixes
//   the ball's place and, with PLAT_Y, the hip height. The ball never moves; every other pose turns the foot about it.
//  End (c8, c12 "as high as possible", "full ankle extension"): the toe-down angle that gives END_PF plantar flexion
//   (SOLVED); the hips stay on the seat, so the knees rise and the knee reads 91.8 (c13's 90, +-2).
//  Lever: the pivot on a tower TOWER_GAP in front of the toe tip; the arm level at the start with its roller resting on
//   the drawn thigh just above the knee (c2; the pivot height SOLVED); in every pose the arm angle is SOLVED so the
//   roller touches the drawn thigh outline (body.mjs limb() polygon and the kneecap), so the thighs lift the pad (c1).
//   The handle grip rides on a post over the roller (c5, "handles by the pad"); both hands reach it by IK, HANDLE_X out.
//  Mistake (c10 "Incomplete range of motion", c12 "half reps get half results"): the heels stop M_PART of the way
//   between the start and the end ankle angles (SOLVED toe-down angle); the knees and the pad stop lower with them.
//   One tell (the record is in lb8/DESIGN.md: c10 and c12 read, no second sign stated), on the red heel; a dashed level
//   through the end heel and an arrow down to the red heel show the missing rise.
// Trace: the heel (c7, c8, c12; D-LIB18-CALF, -TRACE), trim TRACE_TRIM (leg_press.mjs:154).
// Unsourced numbers (SIZES below; lb8/sizes.json holds each with its basis): START_DF, END_PF, M_PART, PLAT_Y, PLAT_BACK,
//  PLAT_FRONT, SEAT_BACK, SEAT_FRONT, SEAT_POST, TOWER_GAP, HANDLE_X, FLOOR_BACK, FLOOR_FRONT, TRACE_TRIM; the
//  composer's CALF_MACHINE sizes; END_TOE, M_TOE and PIVOT_Y solved. The knee 90 and the vertical shin are c1's and c4's.
import { WINTER, REF, RADII, normPose, resolve, fk, landmarks } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { calfMachine, calfLever, CALF_MACHINE, CALF_MACHINE_ITEMS } from '../eq/calfMachine.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ START_DF: 20, END_PF: 50, M_PART: 0.5, PLAT_Y: 0.18, PLAT_BACK: 0.02, PLAT_FRONT: 0.03, SEAT_BACK: 0.28,
  SEAT_FRONT: 0.12, SEAT_POST: 0.08, TOWER_GAP: 0.58, HANDLE_X: 0.20, FLOOR_BACK: 0.10, FLOOR_FRONT: 0.10, TRACE_TRIM: [6, 8] });
const { START_DF, END_PF, M_PART, PLAT_Y, PLAT_BACK, PLAT_FRONT, SEAT_BACK, SEAT_FRONT, SEAT_POST, TOWER_GAP, HANDLE_X, FLOOR_BACK, FLOOR_FRONT, TRACE_TRIM } = SIZES;
const FOOT_X = REF.hjcX * H;                            // c3 hip-width: each foot under its hip joint
const LT = WINTER.thigh * H, LS = WINTER.shank * H;

const bisect = (f, a, b, what) => {
  let fa = f(a);
  if (fa * f(b) > 0) throw new Error(`seated_calf_raise: no solution for ${what} in [${a}, ${b}]`);
  for (let i = 0; i < 50; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
  return (a + b) / 2;
};
const solved = p => { const b = { height: H }, r = resolve(normPose(p, b), b); return { q: r.q, lm: landmarks(fk(r.q, b)) }; };
const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
const sub = (a, b) => a.map((v, i) => v - b[i]), add = (a, b) => a.map((v, i) => v + b[i]), mul = (a, k) => a.map(v => v * k);
const unit = v => { const k = Math.hypot(...v); return v.map(x => x / k); };

// the foot's sole frame for a toe-down world angle (deg; negative = toe up)
const sole = d => { const a = d * R; return { t: [0, -Math.sin(a), Math.cos(a)], n: [0, Math.cos(a), Math.sin(a)] }; };
// start: thigh level, shin vertical (knee 90, c1, c4); the foot START_DF dorsiflexed, so toe-up START_DF in the world
const S0 = sole(-START_DF);
const ANKLE_Y = PLAT_Y + S0.n[1] * WINTER.ankleH * H - S0.t[1] * REF.ball * H;
const HIP = [0, ANKLE_Y + LS, 0];
const ANKLE0 = [0, ANKLE_Y, LT];
const BALL = add(sub(ANKLE0, mul(S0.n, WINTER.ankleH * H)), mul(S0.t, REF.ball * H));
const plant = d => { const s = sole(d); return { l: { at: [FOOT_X, BALL[1], BALL[2]], normal: s.n, toe: s.t, ref: 'ball', pole: [0, 0, 1] }, r: { at: [-FOOT_X, BALL[1], BALL[2]], normal: s.n, toe: s.t, ref: 'ball', pole: [0, 0, 1] } }; };
const legs = d => ({ root: { at: HIP, tilt: 0 }, trunk: 0, neck: 0, plant: plant(d) });
const ankleAt = d => solved(legs(d)).q.ankle.r;           // engine ankle angle (+ dorsiflexion)
export const END_TOE = bisect(d => ankleAt(d) + END_PF, 0, 60, 'the toe-down angle of END_PF plantar flexion');
const M_ANKLE = START_DF - M_PART * (START_DF + END_PF);
export const M_TOE = bisect(d => ankleAt(d) - M_ANKLE, -START_DF, END_TOE, 'the toe-down angle of the part-way rise');

// lever: level at the start, the roller resting on the thigh top just above the knee (thighTop, c2)
const C = CALF_MACHINE;
// The drawn thigh's upper outline (body.mjs limb(): the polygon through its sampled points, radius limbR(RADII.thigh),
// copied from geom.mjs:69) and the kneecap circle, in world metres: the roller rests on what is drawn.
const limbR = (rA, rM, rB, m) => t => t < m ? rA + (rM - rA) * Math.sin((t / m) * Math.PI / 2) : rM + (rB - rM) * (1 - Math.cos(((t - m) / (1 - m)) * Math.PI / 2));
const THR = limbR(...RADII.thigh), TS = [0, 0.12, RADII.thigh[3] * 0.7, RADII.thigh[3], 0.55, 0.78, 1];
const segDist = (p, a, b) => { const d = sub(b, a), L2 = dot(d, d), t = Math.max(0, Math.min(1, dot(sub(p, a), d) / L2)); return Math.hypot(...sub(p, add(a, mul(d, t)))); };
const thighGap = (lm, c0) => {
  const hp = lm['hip.r'], kn = lm['knee.r'], u = unit(sub(kn, hp)), c = [hp[0], c0[1], c0[2]];   // in the near leg's plane
  let n = [0, u[2], -u[1]]; if (n[1] < 0) n = mul(n, -1);
  const pts = TS.map(t => add(add(hp, mul(sub(kn, hp), t)), mul(n, THR(t) * H)));
  const kd = Math.hypot(...sub(c, kn)), knee = kd - RADII.kneeCap * H;
  const gap = Math.min(Math.abs(knee), ...pts.slice(1).map((q, i) => segDist(c, pts[i], q)));
  const L = Math.hypot(...sub(kn, hp)), tc = dot(sub(c, hp), u) / L, perp = dot(sub(c, hp), n);
  return (tc >= 0 && tc <= 1 && perp < THR(tc) * H) || knee < 0 ? -gap : gap;       // negative inside the drawn thigh
};
const LM0 = solved(legs(-START_DF)).lm;
const TOP0 = LM0['thighTop.r'], ROLL0 = add(TOP0, [0, C.rollerR, 0]);   // start: the roller straight over the thigh top point
const TOE_TIP = BALL[2] + (REF.toe - REF.ball) * H;
const TOWER_Z = TOE_TIP + TOWER_GAP;
const ARM = TOWER_Z - ROLL0[2];
// the pivot height: the arm level at the start, its roller touching the drawn thigh (SOLVED)
export const PIVOT_Y = bisect(y => thighGap(LM0, [0, y, ROLL0[2]]) - C.rollerR, TOP0[1] - 0.02, TOP0[1] + 0.15, 'the pivot height that rests the roller on the thigh');
const PIVOT = [0, PIVOT_Y, TOWER_Z];
const leverAt = lm => bisect(a => thighGap(lm, calfLever({ pivot: PIVOT, arm: ARM, angle: a }).pad) - C.rollerR, -10, 30, 'the lever angle that rests the roller on the thighs');
const gripAt = (a, x) => { const g = calfLever({ pivot: PIVOT, arm: ARM, angle: a }).grip; return [x, g[1], g[2]]; };
const posed = d => { const p = legs(d), a = leverAt(solved(p).lm);
  return { ...p, reach: { l: { at: gripAt(a, HANDLE_X), pole: [1, -0.3, 0] }, r: { at: gripAt(a, -HANDLE_X), pole: [-1, -0.3, 0] } } }; };
const start = posed(-START_DF), end = posed(END_TOE), mistakePose = posed(M_TOE);
const LS0 = solved(start).lm, LE = solved(end).lm, LM = solved({ ...end, ...mistakePose }).lm;

const SEAT_TOP = LS0.seat[1];
const machine = {
  form: 'seated', pivot: PIVOT, arm: ARM, towerZ: TOWER_Z,
  platform: { top: PLAT_Y, z: [BALL[2] - PLAT_BACK, TOE_TIP + PLAT_FRONT], postZ: (BALL[2] + TOE_TIP) / 2 },
  seat: { top: SEAT_TOP, z: [LS0.seat[2] - SEAT_BACK, LS0.seat[2] + SEAT_FRONT], postZ: LS0.seat[2] - SEAT_BACK + SEAT_POST },
  floorZ: [LS0.seat[2] - SEAT_BACK, TOWER_Z + C.tubeT],
};
const PAD_END = calfLever({ pivot: PIVOT, arm: ARM, angle: leverAt(LE) }).pad;
const PAD_ANCHOR = [0, PAD_END[1] + C.rollerR * Math.SQRT1_2, PAD_END[2] + C.rollerR * Math.SQRT1_2];   // the roller's upper front (end pose)
export const SCR = { HIP, BALL, PIVOT, ARM, TOWER_Z, LS: LS0, LE, LM, machine, leverAt, thighGap, start, end, mistakePose };

// The card's contact facts (lb8 DESIGN.md; D-LIB18-FACTS): each bound by a check on its landmark in its pose, at the
// drawn point (H6 reads the report's checks); the drawn-item tests prove the contact itself.
const factChecks = (pose, p, names) => { const b = { height: 1.75 }, l = landmarks(fk(resolve(normPose(p, b), b).q, b)); return names.map(landmark => ({ landmark, at: l[landmark], pose, tol: 0.5 })); };
export default {
  id: 'seated_calf_raise', name: 'Seated Calf Raise', view: 'side', facing: 'right',
  camera: { fit: true, x0: 100 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: machine.floorZ[0] - FLOOR_BACK, to: machine.floorZ[1] + FLOOR_FRONT },
    ...perItem(lm => calfMachine({ ...machine, angle: leverAt(lm) }), CALF_MACHINE_ITEMS),
  ],
  checks: [
    ...factChecks('start', start, ['wrist.l', 'wrist.r', 'thighTop.l', 'thighTop.r']),
    ...['ball.l', 'ball.r'].map(landmark => ({ landmark, plane: { point: BALL, normal: [0, 1, 0] }, pose: 'all', tol: 0.5 })),   // c3: balls on the platform
    { landmark: 'seat', plane: { point: [0, SEAT_TOP, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },                           // seated on the pad
    // c1 (StrengthLog) toes on the support at the start: the card's fact, checked on the platform's top; the rigid foot misses
    // it at the drawn stretch (the toe is up off the platform), a miss recorded with the S4 hold (CARD FIELDS fix 2)
    ...['toe.l', 'toe.r'].map(landmark => ({ landmark, plane: { point: BALL, normal: [0, 1, 0] }, pose: 'start', tol: 0.5 })),
    ...['heel.l', 'heel.r'].map(landmark => ({ landmark, above: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all' })),        // heels over the floor
  ],
  ghosts: { count: 3, parts: ['leg.r', 'lever'] },
  trace: { point: 'heel.r', trim: TRACE_TRIM },
  measure: { vertex: 'start:knee.r', from: 'start:hip.r', to: 'start:ankle.r', radius: 20, title: 'Knee', value: '90°', expect: 90, box: { left: 112, top: 282 } },
  callouts: [
    { key: 'pad', text: 'Pad above<br>knees', anchor: PAD_ANCHOR, box: { left: 200, top: 140 }, cue: 'Pad snug across the thighs, just above the knees.' },
    { key: 'knees', text: 'Knees<br>at 90', anchor: { along: ['knee.r', 'ankle.r'], t: 0.18, off: [7, 0] }, box: { left: 214, top: 233 }, cue: 'Knees bent at 90 degrees, shins vertical.' },
    { key: 'balls', text: 'Balls of<br>feet', anchor: { at: 'ball.r', off: [1, -9] }, box: { left: 208, top: 278 }, cue: 'Balls of the feet on the platform, heels hanging off.' },
  ],
  tempo: [{ phase: 'Raise', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['leg.r', 'leg.l', 'arm.r', 'arm.l', 'lever'],
    guides: [
      // the full rise the heels never reach: a level line through the end heel, and the drop to where they stop
      { kind: 'dashed', pts: [{ at: 'heel.r', pose: 'end', off: [-14, 0] }, { at: 'heel.r', pose: 'end', off: [4, 0] }] },
      { kind: 'arrow', from: { at: 'heel.r', pose: 'end', off: [-6, 0] }, to: { at: 'heel.r', pose: 'mistake', off: [-3, 0] } },
    ],
    tells: [
      { key: 'range', text: 'Half reps', anchor: { at: 'heel.r', pose: 'mistake', off: [-1, -3] }, box: { left: 72, top: 280 }, cue: 'Half reps get half results: the heels stop part way up.' },
    ],
  },
  pilot: { drawableFault: 'Top fault: bouncing at the bottom with momentum (c10, c11), seen only as speed; the plate draws the next fault on the same list, the heels moving only part way (c10, c12).' },
  alt: 'Seated calf raise, side view. Seated upright with a roller pad across the thighs just above the knees and the balls of the feet on a platform, the heels lower below it to a deep stretch, then rise as high as possible as the thighs lift the pad.',
};
