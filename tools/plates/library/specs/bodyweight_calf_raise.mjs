// Bodyweight calf raise (on a step), side view, figure facing screen right.
// LIB-18 (LB8, mode H; tier C; census closest barbell_back_squat (the 8, standing; closeness N: D-LIB18-CLONE); vendor
// `box` (the step) and `floor`; drawable false, F7: D-LIB18-F7; the small-motion case: D-LIB18-CALF).
// HELD (S2 and S4; D-LIB8-shrug, D-LIB18-SIZE, -CALF): drawn card-true, measured, never enlarged, re-trimmed or moved.
//  The numbers are in the LB8 note (scratchpad calves/notes.md) and pinned by the drawn-item tests.
// View: side (card plate.view = census view). The heel range (c2, c4), the straight but unlocked knees (c7) and the
//  fault, the heels moving only part way (c8, c2), are all front-to-back.
// Sources: research card docs/research/howto/cards/bodyweight_calf_raise.json (research head 596dbe07): callouts =
//  plate.checkpoints (c4 Heels high; c7 Knees soft; c2 Heels dip); Mistake = plate.mistake (c8, c2; drawable false: the
//  top fault, moving too fast or bouncing, c9/c8, is speed only, so F7 stays raised); tempo = the card's tempo with
//  lb8/tempo.json's row (c15 up 2, down 2, pause 1: Raise, Hold, Lower).
// Clone sources (copied, never imported; D-LIB9-CLONE): barbell_back_squat.mjs (main, the 8) for the standing side-view
//  figure, the soft knee (:30, 5 deg) and its Trace trim [10, 12] (:117); reverse_lunge (pilot A @ dcac4a38):17-22 for
//  the rigid foot planted on its ball with ref 'ball'; seated_calf_raise (this sheet) for the foot turned about the fixed
//  ball, the ankle range and the part-way Mistake with its guides. Every root finder here is a bisection that throws on
//  a bracket with no root.
// Equipment: the vendor `box` (the step: c2 "on a step", c3 "heels hanging off the edge") and `floor`.
// Pose map (identity): start = plate.start (the bottom), end = plate.end (the top); the Mistake against the end pose.
// Geometry decisions (confirmed by the engine report `checks` and the drawn-item tests):
//  Feet (c1, c3): the balls on the step's top face at z 0 (plant ref 'ball'), its rear edge STEP_BACK behind them so
//   the heels hang off; each foot under its hip joint (c1 hip-width, toes forward). The ball never moves; every pose
//   turns the rigid foot about it.
//  Body (c1 "standing tall", c7): trunk upright (tilt 0, trunk 0), knees KNEE_SOFT bent (straight but unlocked), arms
//   hanging by the sides (c1's first option). Balance (D-LIB18-BALANCE; the forefoot on the step edge, c3, c4): in every
//   key pose the hip place is SOLVED so the whole-body centre of mass (Winter 2009 fractions on the drawn landmarks)
//   stands over the balls.
//  Start (c2 "lower to flat or slightly below if on step for stretch": the plate draws slightly below): the foot's
//   toe-up angle that gives START_DF dorsiflexion (SOLVED).
//  End (c4 "as high as possible", "onto your tiptoes"): the toe-down angle that gives END_PF plantar flexion (SOLVED).
//  Mistake (c8 "Partial range", c2): the heels stop M_PART of the way between the start and the end ankle angles
//   (SOLVED toe-down angle), the hips solved again over the balls. One tell (lb8/DESIGN.md one-tell record: c8, c2, c4,
//   c5 read, no second sign stated), on the red heel; a dashed level through the end heel and an arrow down to the red
//   heel show the missing rise.
//  Start layer and ghosts: the foot only (startParts, ghosts), the part whose turn about the ball the cue is about; the
//   start foot lies partly under the end foot, so its outline is redrawn as a dashed phantom in the end layer
//   (DRAWING-GUIDE.md 4; cable_kickback.mjs START_LEG). Leaders to the heels then cross no start or ghost shank.
// Trace: the heel (c4; D-LIB18-CALF, -TRACE), trim TRACE_TRIM (barbell_back_squat.mjs:117; D-LIB18-TRIM).
// Unsourced numbers (SIZES below; lb8/sizes.json holds each with its basis): START_DF, END_PF, KNEE_SOFT, M_PART, STEP_Y,
//  STEP_BACK, STEP_DEPTH, FLOOR_BACK, FLOOR_FRONT, TRACE_TRIM; START_TOE, END_TOE, M_TOE and the hip places solved.
import { WINTER, REF, normPose, resolve, fk, landmarks, bodyShapes } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ START_DF: 20, END_PF: 50, KNEE_SOFT: 5, M_PART: 0.5, STEP_Y: 0.15, STEP_BACK: 0.02, STEP_DEPTH: 0.28,
  FLOOR_BACK: 0.45, FLOOR_FRONT: 0.25, TRACE_TRIM: [10, 12] });
const { START_DF, END_PF, KNEE_SOFT, M_PART, STEP_Y, STEP_BACK, STEP_DEPTH, FLOOR_BACK, FLOOR_FRONT, TRACE_TRIM } = SIZES;
const FOOT_X = REF.hjcX * H;                            // c1 hip-width: each foot under its hip joint
const LT = WINTER.thigh * H, LS = WINTER.shank * H;

const bisect = (f, a, b, what, n = 24) => {
  let fa = f(a);
  if (fa * f(b) > 0) throw new Error(`bodyweight_calf_raise: no solution for ${what} in [${a}, ${b}]`);
  for (let i = 0; i < n; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
  return (a + b) / 2;
};
const add = (a, b) => a.map((v, i) => v + b[i]), sub = (a, b) => a.map((v, i) => v - b[i]), mul = (a, k) => a.map(v => v * k);
const lerp3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const solved = p => { const b = { height: H }, r = resolve(normPose(p, b), b); return { q: r.q, lm: landmarks(fk(r.q, b)) }; };
// whole-body centre of mass, Winter (2009) table 4.1 segment fractions on the drawn landmarks (lb7-plates.test.ts:862-868)
const comOf = L => {
  const parts = [[0.497, lerp3(L.hips, L.shoulders, 0.5)], [0.081, L.ear]];
  for (const s of ['l', 'r']) parts.push([0.028, lerp3(L[`shoulder.${s}`], L[`elbow.${s}`], 0.436)], [0.016, lerp3(L[`elbow.${s}`], L[`wrist.${s}`], 0.430)],
    [0.006, lerp3(L[`wrist.${s}`], L[`grip.${s}`], 0.5)], [0.100, lerp3(L[`hip.${s}`], L[`knee.${s}`], 0.433)], [0.0465, lerp3(L[`knee.${s}`], L[`ankle.${s}`], 0.433)],
    [0.0145, lerp3(L[`ankle.${s}`], L[`toe.${s}`], 0.5)]);
  const m = parts.reduce((t, [w]) => t + w, 0);
  return parts.reduce((t, [w, p]) => t.map((v, i) => v + w * p[i] / m), [0, 0, 0]);
};

// the foot's sole frame for a toe-down world angle (deg; negative = toe up); the balls fixed on the step at z 0
const BALL = [0, STEP_Y, 0];
const sole = d => { const a = d * R; return { t: [0, -Math.sin(a), Math.cos(a)], n: [0, Math.cos(a), Math.sin(a)] }; };
const plant = d => { const s = sole(d), one = x => ({ at: [x, BALL[1], BALL[2]], normal: s.n, toe: s.t, ref: 'ball', pole: [0, 0, 1] }); return { l: one(FOOT_X), r: one(-FOOT_X) }; };
const ankleOf = d => { const s = sole(d); return sub(add(BALL, mul(s.n, WINTER.ankleH * H)), mul(s.t, REF.ball * H)); };
const reachOf = k => Math.sqrt(LT * LT + LS * LS + 2 * LT * LS * Math.cos(k * R));   // hip-to-ankle span at knee bend k
// the pose for foot angle d, knee bend k and the hip-ankle line phi deg behind vertical (trunk upright, arms hanging: c1)
const legs = (d, k, phi) => { const A = ankleOf(d), D = reachOf(k); return { root: { at: [0, A[1] + D * Math.cos(phi * R), A[2] - D * Math.sin(phi * R)], tilt: 0 }, trunk: 0, neck: 0, plant: plant(d) }; };
// the hips SOLVED so the centre of mass is over the balls
const balanced = (d, k) => legs(d, k, bisect(f => comOf(solved(legs(d, k, f)).lm)[2] - BALL[2], -25, 15, `the hip place that balances foot ${d.toFixed(1)} deg, knee ${k}`));
// the engine ankle angle (+ dorsiflexion) of the balanced pose: the balance sets the shank's lean, so the foot angle that
// gives a target ankle angle is solved on the balanced pose
const toeFor = (target, lo, hi, what) => bisect(d => solved(balanced(d, KNEE_SOFT)).q.ankle.r - target, lo, hi, what);
export const START_TOE = toeFor(START_DF, -40, 20, 'the toe-up angle of START_DF dorsiflexion');
export const END_TOE = toeFor(-END_PF, 20, 75, 'the toe-down angle of END_PF plantar flexion');
const M_ANKLE = START_DF - M_PART * (START_DF + END_PF);
export const M_TOE = toeFor(M_ANKLE, START_TOE, END_TOE, 'the toe-down angle of the part-way rise');
const start = balanced(START_TOE, KNEE_SOFT), end = balanced(END_TOE, KNEE_SOFT), mistakeFull = balanced(M_TOE, KNEE_SOFT);
const mistakePose = { root: mistakeFull.root, plant: mistakeFull.plant };
const LS0 = solved(start).lm, LE = solved(end).lm, LM = solved({ ...end, ...mistakePose }).lm;

const STEP = { z: [BALL[2] - STEP_BACK, BALL[2] - STEP_BACK + STEP_DEPTH], top: STEP_Y };

// Start phantom: the outline of the start foot (cable_kickback START_LEG's method)
const insidePoly = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
  const [xi, yi] = poly[i], [xj, yj] = poly[j];
  if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
const LEG_KEYS = ['foot.r'];
export const START_LEG = (() => {
  const b = { height: H }, sk = fk(resolve(normPose(start, b), b).q, b);
  const cam = { view: 'side', near: 'r', facing: 'right', pxm: 1, P: w => [w[2], -w[1]] };
  const polys = bodyShapes(sk, cam).filter(sh => LEG_KEYS.includes(sh.key)).map(sh => sh.poly);
  const runs = [];
  polys.forEach((poly, k) => {
    let run = [];
    const flush = () => { if (run.length > 1) runs.push(run); run = []; };
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], q = poly[(i + 1) % poly.length], n = Math.max(1, Math.ceil(Math.hypot(q[0] - a[0], q[1] - a[1]) / 0.002));
      for (let j = 0; j < n; j++) {
        const p = [a[0] + (q[0] - a[0]) * j / n, a[1] + (q[1] - a[1]) * j / n];
        if (polys.some((o, m) => m !== k && insidePoly(p, o))) flush(); else run.push(p);
      }
    }
    flush();
  });
  return runs.map(r => ({ type: 'line', pts: r.map(p => [LS0['ankle.r'][0], -p[1], p[0]]), cls: 'eq-line m-line', z: 'front', part: 'startLeg' }));
})();

export const BCR = { BALL, STEP, LS: LS0, LE, LM, comOf, start, end, mistakePose, START_TOE, END_TOE, M_TOE };

const STEP_PLANE = { point: BALL, normal: [0, 1, 0] };
export default {
  id: 'bodyweight_calf_raise', name: 'Bodyweight Calf Raise', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: STEP.z[0] - FLOOR_BACK, to: STEP.z[1] + FLOOR_FRONT },
    { type: 'box', at: [0, STEP_Y / 2, (STEP.z[0] + STEP.z[1]) / 2], w: STEP_DEPTH, h: STEP_Y, rc: 2, z: 'back', part: 'step' },
    ...START_LEG.map(it => (lm, ctx) => (ctx.pose === 'end' ? it : null)),
  ],
  checks: [
    // c3, c4: the balls on the step's top face in every pose
    ...['ball.l', 'ball.r'].map(landmark => ({ landmark, plane: STEP_PLANE, pose: 'all', tol: 0.5 })),
    // c4 on the tiptoes at the end: the card's fact, checked on the step's top; the rigid foot misses it (the toe point
    // sinks into the step at the card's top), a miss recorded with the S4 hold
    ...['toe.l', 'toe.r'].map(landmark => ({ landmark, plane: STEP_PLANE, pose: 'end', tol: 0.5 })),
    ...['heel.l', 'heel.r'].map(landmark => ({ landmark, above: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all' })),
  ],
  startParts: ['foot.r'],
  ghosts: { count: 3, parts: ['foot.r'] },
  trace: { point: 'heel.r', trim: TRACE_TRIM },
  callouts: [
    { key: 'high', text: 'Heels high', anchor: 'heel.r', box: { left: 24, top: 252 }, cue: 'Heels as high as possible at the top.' },
    { key: 'knees', text: 'Knees<br>soft', anchor: { at: 'knee.r', off: [6, 0] }, box: { left: 200, top: 214 }, cue: 'Knees straight but unlocked.' },
    { key: 'dip', text: 'Heels dip', anchor: { at: 'heel.r', pose: 'start' }, box: { left: 60, top: 306 }, cue: 'On a step, heels slightly below it at the bottom.' },
  ],
  tempo: [{ phase: 'Raise', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['leg.r', 'leg.l', 'torso', 'arm.r', 'arm.l'],
    guides: [
      // the full rise the heels never reach: a level line through the end heel, and the drop to where they stop
      { kind: 'dashed', pts: [{ at: 'heel.r', pose: 'end', off: [-14, 0] }, { at: 'heel.r', pose: 'end', off: [4, 0] }] },
      { kind: 'arrow', from: { at: 'heel.r', pose: 'end', off: [-6, 0] }, to: { at: 'heel.r', pose: 'mistake', off: [-3, 0] } },
    ],
    tells: [
      { key: 'part', text: 'Partial<br>range', anchor: { at: 'heel.r', pose: 'mistake', off: [-1, -4] }, box: { left: 70, top: 272 }, cue: 'Partial range: the heels rise only part way.' },
    ],
  },
  pilot: { drawableFault: 'Top fault: moving too fast or bouncing (c9, c8), seen only as speed; the plate draws the next fault on the same list, the heels moving only part way (c8, c2).' },
  alt: 'Bodyweight calf raise on a step, side view. Standing tall with the arms by the sides, the balls of the feet on the step edge and the knees straight but unlocked, the heels dip slightly below the step, then rise as high as possible onto the tiptoes.',
};
