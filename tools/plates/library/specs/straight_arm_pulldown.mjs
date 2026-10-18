// Straight-arm cable pulldown (standing, overhand straight bar, high pulley), side view, figure faces the column
// (screen right). LB1, mode H, tier C, stand + hinge pose class (library plan 2.2).
// View: side (card plate.view, c4, c5, c12): the arm sweeps in one plane about the shoulder, and the fault (the elbows
// bend, c6) reads from the side.
// Source: docs/research/howto/cards/straight_arm_pulldown.json (claude/libht-research). Claims used: c1 (highest
// pulley, straight bar, overhand, about shoulder width), c2 (stand a step back, cable taut, feet hip width, knees soft),
// c3 (trunk tall, at most a slight forward hip lean), c4 (elbows keep one slight bend top to bottom), c5 (the bar ends
// at the front of the thighs, chest tall), c6 (the fault: the elbows bend), c7 (one-second squeeze at the bottom, no
// swing), c9 (spine neutral), c15 (tempo convention).
// Clone sources (D-LIB9-CLONE, lib4-cards 13.2): the census closest is lat_pulldown (golden A, bc0f378) for the bar;
// the column is the vendored `cableColumn` as seated_cable_row (golden A) draws it, with the pulley at the top. The
// stand + hinge anchor is pilot A @ e6f39ff: `body`, `kneeOf` and the Illinois root finder are COPIED from
// romanian_deadlift.mjs / barbell_row.mjs (never imported). The root finder throws when its bracket holds no root
// (rule b). Brackets re-derived for this plate (rule c), each with the value it solves to:
//  - HIP_Y_BRACKET [0.80, 0.935] m (pilot A's [0.5, 0.935] narrowed to a standing hip; 0.935 is just over the
//    straight-leg hip, 0.9275 m): root height for the 10 deg soft knee -> 0.9238 m.
//  - ROOT_Z_BRACKET [-0.30, 0.10] m: root fore-aft so the shoulder joint sits over mid-foot -> -0.0820 m.
//  - SAG_BRACKET [0.50, 0.70] m: shoulder-to-bar sagittal radius for the 15 deg elbow bend -> 0.6618 m.
//  - END_ARM_BRACKET [0, 60] deg: arm angle forward of hanging so the bar clears the thighs by 1 cm -> 3.6 deg.
//  The start arm angle is not solved: it points at the pulley (122.9 deg forward of hanging).
// Geometry decisions:
//  - Feet hip width (mid-soles 24 cm apart, toes 5 deg out), knees 10 deg (soft, c2), trunk 10 deg forward of vertical
//    (pelvis 10, lumbar 0: the slight lean c3 allows, spine neutral c9), the same in every pose (c3, c7: no swing).
//  - Root: the shoulder joint over mid-foot, as romanian_deadlift's standing key puts the shoulders over the bar.
//  - Elbows: the same slight 15 deg bend at the start and the end (c4): the grip sits at the 15 deg reach from the
//    shoulder (Winter upper arm + forearm + grip offset).
//  - Start: the arms point at the high pulley (c1, c2: cable taut, in line with the arms), bar above the head.
//  - End: the bar on the same reach, swept down until it sits 1 cm in front of the thighs (c5).
//  - Column: 2.25 m, its pulley at the top front, 1.13 m in front of mid-foot (a step back, c2); 14 x 5 kg stack, the
//    stack drawn with two static guide rods as close_grip_pulldown draws them (R7).
//  - Mistake (card plate.mistake, c6): the elbows bend as the bar comes down (a bent-arm pulldown), drawn part-way
//    down: elbows 90 deg, the bar in front of the chest. Trunk and legs unchanged, so the arm is the only fault.
//  - In-between keys at every eighth of the rep keep the bar on the shoulder arc (lib4-cards 13.3 must-fix 1), so the
//    ghosts hold the 15 deg elbow and the trace sweeps the arc.
//  - Mistake tells (DRAWING-GUIDE:24, rule Q-D5-4): 'bend' (the elbows bend, topFault) and 'close' (the bar pulled in
//    close to the body, the card's "bent-arm pulldown", c6: 18.4 cm nearer the shoulder than the solid bar path at the
//    same height, lib4-cards 13.4 must-fix 4). 'close' points at the near side of the red fist, below the
//    cables, from the open space between the cable and the column.
//  - Labels sit on the left: on the right every leader to the arm would meet the cable. 'Arms stay straight' and
//    'Elbows bend' cross the trunk to reach the elbow, which hangs in front of it (no open side away from the cable).
// Unsourced numbers (the card gives none of these): feet 24 cm apart, toes 5 deg out; knees 10 deg; trunk 10 deg
// forward; elbow bend 15 deg; hands +-25 cm; bar 66 cm wide, 28 mm; end bar 1 cm in front of the thighs; column 2.25 m
// tall, 34 cm deep, its pulley 1.13 m in front of mid-foot at 2.12 m; 14 x 5 kg stack, 6 loaded; Mistake drawn
// mid-pull with the upper arm 35 deg forward and the elbow at 90 deg; in-between keys every eighth of the rep.
import { landmarksOf } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.12, TOE_OUT = 5;
const GRIP_X = 0.25;                                       // hands about shoulder width (c1)
const KNEE = 10, TRUNK_INCL = 10, SPINE = 0;
const ELBOW = 15;                                          // slight elbow bend, start and end (c4)
const BAR_GAP = 0.01;                                      // end bar surface to the thigh surface (m)
const SHAFT_R = 0.014;
const COL = { z: 1.35, h: 2.25, w: 0.34 };                 // column centre z, height, depth
const PULLEY = [0, 2.12, COL.z - COL.w / 2 - 0.05];       // high pulley on the column's front, at its top
const STACK = { plates: 14, load: 6 };
const HIP_Y_BRACKET = [0.80, 0.935], ROOT_Z_BRACKET = [-0.30, 0.10], END_ARM_BRACKET = [0, 60], SAG_BRACKET = [0.50, 0.70];

const toe = s => [s * Math.sin(TOE_OUT * R), 0, Math.cos(TOE_OUT * R)];
const feet = { l: { at: [FOOT_X, 0, 0], toe: toe(1) }, r: { at: [-FOOT_X, 0, 0], toe: toe(-1) } };
const kneeOf = lm => {
  const a = [0, 1, 2].map(i => lm['hip.r'][i] - lm['knee.r'][i]), b = [0, 1, 2].map(i => lm['ankle.r'][i] - lm['knee.r'][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
const body = (y, z) => ({ root: { at: [0, y, z], tilt: TRUNK_INCL - SPINE }, trunk: SPINE, neck: 0, plant: feet });
// Bracketed root finder (Illinois regula falsi), copied from pilot A: f(a) and f(b) must differ in sign.
export const solve = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`straight_arm_pulldown: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 60 && Math.abs(b - a) > 1e-7; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const hipY = z => solve(y => kneeOf(landmarksOf(body(y, z), H)) - KNEE, ...HIP_Y_BRACKET);
export const ROOT_Z = solve(z => landmarksOf(body(hipY(z), z), H)['shoulder.r'][2], ...ROOT_Z_BRACKET);
export const ROOT_Y = hipY(ROOT_Z);
const base = body(ROOT_Y, ROOT_Z), LM = landmarksOf(base, H);
const S = LM['shoulder.r'];

// The bar sits on an arc round the shoulder (sagittal radius SAG). SAG is SOLVED so the drawn elbow bends ELBOW deg
// (engine landmarks, shoulder-elbow-wrist) with the bar hanging straight down; the same arc then holds the same bend
// at every arm angle (the shoulder does not move: shoulder blades neutral in every pose).
const hands = (bar, pole) => ({ l: { at: [GRIP_X, bar[1], bar[2]], pole: [-pole[0], pole[1], pole[2]] }, r: { at: [-GRIP_X, bar[1], bar[2]], pole } });
const elbowOf = lm => {
  const a = [0, 1, 2].map(i => lm['shoulder.r'][i] - lm['elbow.r'][i]), b = [0, 1, 2].map(i => lm['wrist.r'][i] - lm['elbow.r'][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
const POLE_HANG = [-0.3, 0.4, -1];
export const SAG = solve(r => elbowOf(landmarksOf({ ...base, reach: hands([0, S[1] - r, S[2]], POLE_HANG) }, H)) - ELBOW, ...SAG_BRACKET);
const onArc = deg => [0, S[1] - SAG * Math.cos(deg * R), S[2] + SAG * Math.sin(deg * R)];   // deg forward of hanging

// Start: the bar on the reach, on the line from the shoulder to the pulley.
const toP = Math.atan2(PULLEY[2] - S[2], S[1] - PULLEY[1]) / R;   // deg forward of hanging
export const START_DEG = toP;
const START_BAR = onArc(START_DEG);
// End: swept down until the bar clears the thigh front by BAR_GAP.
const thighGap = bar => {
  const a = LM['hip.r'], b = LM['knee.r'], d = [b[1] - a[1], b[2] - a[2]], L2 = d[0] ** 2 + d[1] ** 2;
  const t = Math.max(0, Math.min(1, ((bar[1] - a[1]) * d[0] + (bar[2] - a[2]) * d[1]) / L2));
  return Math.hypot(bar[1] - a[1] - d[0] * t, bar[2] - a[2] - d[1] * t) - 0.046 * H - SHAFT_R;   // thigh belly radius (RADII.thigh 0.044-0.048 H)
};
export const END_DEG = solve(deg => thighGap(onArc(deg)) - BAR_GAP, ...END_ARM_BRACKET);
const END_BAR = onArc(END_DEG);
const POLE_START = [-0.3, -0.2, -1];
const start = { ...base, reach: hands(START_BAR, POLE_START) };
const end = { ...base, reach: hands(END_BAR, POLE_HANG) };
// In-between keys (lib4-cards 13.3 must-fix 1): at every eighth of the rep the bar sits on the same arc, the arm stepping
// evenly from START_DEG to END_DEG, so every ghost keeps the 15 deg elbow and the trace follows the arc. Without them
// the engine interpolates the grip on a straight chord and the ghost elbows bend 98-120 deg (more than the Mistake).
export const VIA_T = [1, 2, 3, 4, 5, 6, 7].map(k => k / 8);   // the ghosts (t = 1/4, 1/2, 3/4) land on keys 2, 4, 6
export const VIA_DEG = VIA_T.map(t => START_DEG + (END_DEG - START_DEG) * t);
const via = VIA_DEG.map((deg, i) => ({ ...base, reach: hands(onArc(deg), POLE_START.map((v, k) => v + (POLE_HANG[k] - v) * VIA_T[i])) }));

// Mistake (c6): part-way down the elbows have bent to about 90 deg, a bent-arm pulldown: the upper arm MIS_ARM deg
// forward of hanging, the forearm square to it, the bar in front of the chest. Drawn mid-pull, where the bent arm
// stands clear of the trunk and of the solid straight arm (at the bottom a bent arm would hide inside the trunk).
const MIS_ARM = 35, UA = 0.186 * H, FG = (0.146 + 0.46 * 0.108) * H;   // Winter upper arm; forearm + grip offset
const MIS_ELBOW = [0, S[1] - UA * Math.cos(MIS_ARM * R), S[2] + UA * Math.sin(MIS_ARM * R)];
const MIS_BAR = [0, MIS_ELBOW[1] + FG * Math.sin(MIS_ARM * R), MIS_ELBOW[2] + FG * Math.cos(MIS_ARM * R)];
const mistakePose = { reach: hands(MIS_BAR, [-0.3, -1, 0.3]) };

const barAt = lm => [0, lm.grips[1], lm.grips[2]];
const SZ = COL.z, ROD_TOP = COL.h - 0.21;

export default {
  id: 'straight_arm_pulldown', name: 'Straight-Arm Pulldown', view: 'side', facing: 'right',
  camera: { fit: { left: 70, right: 10 } },             // room on the left for the labels (their leaders cannot cross the cable on the right)
  poses: { start, end, via },
  equipment: [
    { type: 'floor', from: -0.3, to: COL.z + 0.3 },
    (lm, ctx) => {
      const col = (to, rest) => ({ type: 'cableColumn', base: [0, 0, SZ], height: COL.h, width: COL.w, pulley: { at: PULLEY, r: 0.045 }, to, rest,
        stack: { ...STACK, rods: false }, part: 'column' });
      const out = [col(barAt(lm), barAt(ctx.start)), { type: 'latBar', at: barAt(lm), width: 0.66, straight: 0.66, drop: 0, part: 'bar' }];
      // Start pose (as seated_cable_row): a 1 mm twin with the same keys, drawn nowhere, so the start bar and cable count
      // as moving and render dashed.
      if (ctx.pose === 'start') {
        const g2 = [0, lm.grips[1] + 0.001, lm.grips[2]];
        out.push(col(g2, g2), { type: 'latBar', at: g2, width: 0.66, straight: 0.66, drop: 0, part: 'bar' });
      }
      return out;
    },
    ...[-0.05, 0.05].map(dz => ({ type: 'line', cls: 'eq-thin', pts: [[0, 0.06, SZ + dz], [0, ROD_TOP, SZ + dz]] })),   // guide rods (static, as close_grip_pulldown)
  ],
  checks: [
    { landmark: 'heel.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
  ],
  ghosts: { count: 3, parts: ['arm.r', 'bar'] },
  trace: { point: 'grip.r', trim: [10, 10] },
  callouts: [
    { key: 'straight', text: 'Arms stay<br>straight', anchor: 'elbow.r', box: { left: 10, top: 196 }, cue: 'Keep the same slight elbow bend from top to bottom. Only the shoulders move.' },
    { key: 'trunk', text: 'Trunk<br>still', anchor: 'backMid', box: { left: 10, top: 140 }, cue: 'Hold one trunk angle: no swing to start the rep, no arched lower back.' },
    { key: 'thighs', text: 'Bar to<br>thighs', anchor: 'grip.r', box: { left: 140, top: 262 }, cue: 'Finish with the bar at the front of the thighs, chest tall.' },
  ],
  tempo: [{ phase: 'Pull', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['arm.r', 'bar'],
    tells: [
      { key: 'bend', text: 'Elbows<br>bend', anchor: { at: 'elbow.r', pose: 'mistake' }, box: { left: 10, top: 170 }, cue: 'The elbows bend and the lift turns into a pushdown.' },
      { key: 'close', text: 'Bar<br>pulled in', anchor: { at: 'grip.r', pose: 'mistake', off: [5, 5] }, box: { left: 200, top: 200 }, cue: 'The bar comes in close to the body, as in a bent-arm pulldown.' },
    ],
  },
  alt: 'Straight-arm cable pulldown, side view. Standing a step back from a high pulley with a slight forward lean and soft knees, the lifter sweeps a straight bar from overhead down to the front of the thighs, elbows keeping one slight bend.',
};
