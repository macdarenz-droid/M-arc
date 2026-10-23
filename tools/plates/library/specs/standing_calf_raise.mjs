// Standing calf raise (shoulder-pad lever machine), side view, figure facing screen right.
// LIB-18 (LB8, mode H; tier B; census closest barbell_back_squat (the 8, standing; closeness N: D-LIB18-CLONE); the
// `calfMachine` composer, standing form (the slice's seated_calf_raise drew its seated form on the same sheet:
// D-LIB18-SLICE, -CALF); drawable false, F7: D-LIB18-F7).
// HELD (S2 and S4; D-LIB8-shrug, D-LIB18-SIZE, -CALF): drawn card-true, measured, never enlarged, re-trimmed or moved.
//  The numbers are in the LB8 note (scratchpad calves/notes.md) and pinned by the drawn-item tests.
// View: side (card plate.view = census view). The heel range (c7, c9, c10), the soft knee (c5) and its fault, the
//  locked knee (c6), and the upright trunk under the pads (c2, c11) are all front-to-back.
// Sources: research card docs/research/howto/cards/standing_calf_raise.json (research head 596dbe07): callouts =
//  plate.checkpoints (c1 Balls of feet; c5, c6 Knees soft; c2, c11 Upright); Mistake = plate.mistake (c6, c5: the
//  knees locked straight while the heels rise; drawable false: the top fault, bouncing at the bottom, c6/c9, is speed
//  only, so F7 stays raised); tempo = the card's tempo with lb8/tempo.json's row (c19 up 2, down 2; c20 pause 1, a
//  drawing convention: Raise, Hold, Lower).
// Clone sources (copied, never imported; D-LIB9-CLONE): barbell_back_squat.mjs (main, the 8) for the standing side-view
//  figure, the soft knee and its Trace trim [10, 12] (:117); reverse_lunge (pilot A @ dcac4a38):17-22 for the rigid
//  foot planted on its ball with ref 'ball'; seated_calf_raise (this sheet) for the foot turned about the fixed ball,
//  the ankle range and the lever solved onto the body. Every root finder here is a bisection that throws on a bracket
//  with no root.
// Equipment: the `calfMachine` composer, form 'standing' (platform on its post, floor beam, rear tower and pivot hub,
//  lever arm with two shoulder pads, one on each shoulder top beside the neck (D-LIB18-PADS), and the hanging handle;
//  eq/calfMachine.mjs); floor.
// Pose map (identity): start = plate.start (the bottom), end = plate.end (the top); the Mistake against the end pose.
// Geometry decisions (confirmed by the engine report `checks` and the drawn-item tests):
//  Feet (c1, c4): the balls on the platform's top face at z 0 (plant ref 'ball'), each foot under its hip joint
//   (hip-width, toes forward). The ball never moves; every pose turns the rigid foot about it.
//  Body: trunk upright (tilt 0, trunk 0: c2, c11 "Stay upright", "back straight"), the knees KNEE_SOFT bent (c5) in
//   the start and the end. Balance (D-LIB18-BALANCE; the forefoot, c1, with the shoulder-pad load at the shoulders,
//   c1, c2): in every key pose the hip place is SOLVED so the whole-body centre of mass (Winter 2009 fractions on the
//   drawn landmarks, the hands on the handles included) stands over the balls; the shoulder tops then sit 0.1 to 2.1 cm
//   behind that plumb line, so with a load on them as heavy as the body the sum stays within 1.1 cm of the balls.
//  Start (c9, c10 "full but comfortable stretch"): the foot's toe-up angle that gives START_DF dorsiflexion (SOLVED).
//  End (c7, c10 "as high as you can", "fully extending ankles"): the toe-down angle that gives END_PF plantar flexion
//   (SOLVED); knees and trunk unchanged (c5, c11).
//  Lever: the pivot on a rear tower TOWER_BACK behind the start shoulder top; the arm level at the start with the
//   shoulder pad's lower face on the shoulder tops (c1, c2), the pad's centre PAD_BACK behind them; in every pose the arm
//   angle is SOLVED so that face rests on the shoulder tops. The handle hangs from the arm HANDLE_FWD in front of the
//   shoulder tops, its grip HANDLE_DROP under the arm, HANDLE_X out; both hands reach it by IK (c2, c3).
//  Mistake (c6 "Locking knees", c5): at the end's foot angle the knees lock straight (M_LOCK); the hips are solved again
//   so the centre of mass stays over the balls. One tell (lb8/DESIGN.md one-tell record: c6 and c5 read, no second sign
//   stated), on the red knee.
//  Start layer and ghosts: the foot only (startParts, ghosts), the part whose turn about the ball the cue is about (the
//   knees keep one bend, so a start leg would only double the end leg); the start foot lies partly under the end foot,
//   so its outline is redrawn as a dashed phantom in the end layer (DRAWING-GUIDE.md 4; cable_kickback.mjs START_LEG).
//   Leaders to the knees then cross no start or ghost leg (the ghosts' knees bulge ~4 px ahead of the end knee).
// Trace: the heel (c7; D-LIB18-CALF, -TRACE), trim TRACE_TRIM (barbell_back_squat.mjs:117; D-LIB18-TRIM).
// Unsourced numbers (SIZES below; lb8/sizes.json holds each with its basis): START_DF, END_PF, KNEE_SOFT, M_LOCK, PLAT_Y,
//  PLAT_BACK, PLAT_FRONT, TOWER_BACK, PAD_BACK, HANDLE_FWD, HANDLE_DROP, HANDLE_X, FLOOR_BACK, FLOOR_FRONT, TRACE_TRIM; the
//  composer's CALF_MACHINE sizes; START_TOE, END_TOE and the hip places solved.
import { WINTER, REF, normPose, resolve, fk, landmarks, bodyShapes } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { calfMachine, calfLever, CALF_MACHINE, CALF_MACHINE_ITEMS } from '../eq/calfMachine.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ START_DF: 20, END_PF: 50, KNEE_SOFT: 15, M_LOCK: 0, PLAT_Y: 0.15, PLAT_BACK: 0.02, PLAT_FRONT: 0.03,
  TOWER_BACK: 0.65, PAD_BACK: 0.05, HANDLE_FWD: 0.25, HANDLE_DROP: 0.16, HANDLE_X: 0.20, FLOOR_BACK: 0.10, FLOOR_FRONT: 0.10, TRACE_TRIM: [10, 12] });
const { START_DF, END_PF, KNEE_SOFT, M_LOCK, PLAT_Y, PLAT_BACK, PLAT_FRONT, TOWER_BACK, PAD_BACK, HANDLE_FWD, HANDLE_DROP, HANDLE_X, FLOOR_BACK, FLOOR_FRONT, TRACE_TRIM } = SIZES;
const FOOT_X = REF.hjcX * H;                            // c4 hip-width: each foot under its hip joint
const LT = WINTER.thigh * H, LS = WINTER.shank * H;
const C = CALF_MACHINE;

const bisect = (f, a, b, what, n = 24) => {
  let fa = f(a);
  if (fa * f(b) > 0) throw new Error(`standing_calf_raise: no solution for ${what} in [${a}, ${b}]`);
  for (let i = 0; i < n; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
  return (a + b) / 2;
};
const add = (a, b) => a.map((v, i) => v + b[i]), sub = (a, b) => a.map((v, i) => v - b[i]), mul = (a, k) => a.map(v => v * k);
const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
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

// the foot's sole frame for a toe-down world angle (deg; negative = toe up); the balls fixed on the platform at z 0
const BALL = [0, PLAT_Y, 0];
const sole = d => { const a = d * R; return { t: [0, -Math.sin(a), Math.cos(a)], n: [0, Math.cos(a), Math.sin(a)] }; };
const plant = d => { const s = sole(d), one = x => ({ at: [x, BALL[1], BALL[2]], normal: s.n, toe: s.t, ref: 'ball', pole: [0, 0, 1] }); return { l: one(FOOT_X), r: one(-FOOT_X) }; };
const ankleOf = d => { const s = sole(d); return sub(add(BALL, mul(s.n, WINTER.ankleH * H)), mul(s.t, REF.ball * H)); };
const reachOf = k => Math.sqrt(LT * LT + LS * LS + 2 * LT * LS * Math.cos(k * R));   // hip-to-ankle span at knee bend k
// legs for foot angle d, knee bend k and the hip-ankle line phi deg behind vertical (trunk upright: c2, c11)
const legs = (d, k, phi) => { const A = ankleOf(d), D = reachOf(k); return { root: { at: [0, A[1] + D * Math.cos(phi * R), A[2] - D * Math.sin(phi * R)], tilt: 0 }, trunk: 0, neck: 0, plant: plant(d) }; };

// lever: the pivot on the rear tower, the arm level at the start with the pad's lower face on the shoulder tops
const PRE = solved(legs(0, KNEE_SOFT, -10)).lm['shoulderTop.r'];       // a first shoulder place (feet level), for the first pass only
const TOWER_Z = PRE[2] - TOWER_BACK;
// the arm angle (deg above level, toward +z) that rests the pad's lower face on the shoulder top Q, for pivot P
const restOn = (P, Q) => bisect(a => dot(sub(Q, P), [0, Math.cos(a * R), -Math.sin(a * R)]) + C.shoulderT, -60, 60, 'the arm angle that rests the pad on the shoulders');
let PIVOT = null, ARM = null;
const leverOf = lm => calfLever({ pivot: PIVOT, arm: ARM, angle: restOn(PIVOT, lm['shoulderTop.r']), toward: 1, handleAt: -HANDLE_FWD - PAD_BACK, handleH: -HANDLE_DROP - C.armT / 2 });
const handsOn = (p, lm) => { const g = leverOf(lm).grip; return { ...p, reach: { l: { at: [HANDLE_X, g[1], g[2]], pole: [1, -1, 0] }, r: { at: [-HANDLE_X, g[1], g[2]], pole: [-1, -1, 0] } } }; };
// the drawn pose (hands on the handles) for foot d and knee k, its hips SOLVED so the centre of mass is over the balls
const balanced = (d, k) => {
  const at = phi => { const p = legs(d, k, phi); return handsOn(p, solved(p).lm); };
  const phi = bisect(f => comOf(solved(at(f)).lm)[2] - BALL[2], -25, 15, `the hip place that balances foot ${d.toFixed(1)} deg, knee ${k}`);
  return at(phi);
};
// the engine ankle angle (+ dorsiflexion) of the balanced pose: the balance sets the shank's lean, so the foot angle that
// gives a target ankle angle is solved on the balanced pose
const balancedAnkle = (d, k) => solved(balanced(d, k)).q.ankle.r;
const toeFor = (k, target, lo, hi, what) => bisect(d => balancedAnkle(d, k) - target, lo, hi, what);
// the start, solved twice: first with the pivot from a first shoulder place (only the hands depend on it), then with the
// pivot TOWER_BACK behind the start shoulder top, its pad's lower face level on it
PIVOT = [0, PRE[1] + C.shoulderT, TOWER_Z]; ARM = TOWER_BACK - PAD_BACK;
const S1 = solved(balanced(toeFor(KNEE_SOFT, START_DF, -40, 20, 'the toe-up angle of START_DF dorsiflexion'), KNEE_SOFT)).lm['shoulderTop.r'];
PIVOT = [0, S1[1] + C.shoulderT, S1[2] - TOWER_BACK];
export const START_TOE = toeFor(KNEE_SOFT, START_DF, -40, 20, 'the toe-up angle of START_DF dorsiflexion');
export const END_TOE = toeFor(KNEE_SOFT, -END_PF, 20, 75, 'the toe-down angle of END_PF plantar flexion');
const start = balanced(START_TOE, KNEE_SOFT), end = balanced(END_TOE, KNEE_SOFT), mistakeFull = balanced(END_TOE, M_LOCK);
const mistakePose = { root: mistakeFull.root, trunk: mistakeFull.trunk, plant: mistakeFull.plant, reach: mistakeFull.reach };
const LS0 = solved(start).lm, LE = solved(end).lm, LM = solved({ ...end, ...mistakePose }).lm;

const TOE_TIP = BALL[2] + (REF.toe - REF.ball) * H;
const machine = {
  form: 'standing', pivot: PIVOT, arm: ARM, towerZ: PIVOT[2], toward: 1, handleAt: -HANDLE_FWD - PAD_BACK, handleH: -HANDLE_DROP - C.armT / 2,
  platform: { top: PLAT_Y, z: [BALL[2] - PLAT_BACK, TOE_TIP + PLAT_FRONT], postZ: (BALL[2] + TOE_TIP) / 2 },
  floorZ: [PIVOT[2] - C.tubeT, TOE_TIP + PLAT_FRONT],
};
const angleOf = lm => restOn(PIVOT, lm['shoulderTop.r']);

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

export const SCR = { BALL, PIVOT, ARM, TOWER_Z: PIVOT[2], LS: LS0, LE, LM, machine, angleOf, comOf, start, end, mistakePose, START_TOE, END_TOE };

const PLAT_PLANE = { point: BALL, normal: [0, 1, 0] };
// the shoulder pads' lower face in one pose (its plane: both pads share it), for the c1 shoulder contact
const padFace = lm => { const L = leverOf(lm); return { point: add(L.pad, mul(L.n, -C.shoulderT)), normal: L.n }; };
const factChecks = (pose, lm, names) => names.map(landmark => ({ landmark, at: lm[landmark], pose, tol: 0.5 }));
export default {
  id: 'standing_calf_raise', name: 'Standing Calf Raise', view: 'side', facing: 'right',
  camera: { fit: true },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: machine.floorZ[0] - FLOOR_BACK, to: machine.floorZ[1] + FLOOR_FRONT },
    ...perItem(lm => calfMachine({ ...machine, angle: angleOf(lm) }), CALF_MACHINE_ITEMS),
    ...perItem((lm, ctx) => (ctx.pose === 'end' ? START_LEG : []), START_LEG.length),
  ],
  checks: [
    // c2: hands on the handles at the start (the grip's drawn place)
    ...factChecks('start', LS0, ['wrist.l', 'wrist.r']),
    // c1: the shoulder tops on the shoulder pad's lower face at the start (and in every key pose: the lever rests on them)
    ...['shoulderTop.l', 'shoulderTop.r'].flatMap(landmark => [{ landmark, plane: padFace(LS0), pose: 'start', tol: 0.5 }, { landmark, plane: padFace(LE), pose: 'end', tol: 0.5 }]),
    // c1, c7: the balls on the platform's top face in every pose
    ...['ball.l', 'ball.r'].map(landmark => ({ landmark, plane: PLAT_PLANE, pose: 'all', tol: 0.5 })),
    // c1 (StrengthLog) toes on the support at the start: the card's fact, checked on the platform's top; the rigid foot
    // misses it (the toe point sits up off the platform), a miss recorded with the S4 hold
    ...['toe.l', 'toe.r'].map(landmark => ({ landmark, plane: PLAT_PLANE, pose: 'start', tol: 0.5 })),
    ...['heel.l', 'heel.r'].map(landmark => ({ landmark, above: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all' })),
  ],
  startParts: ['foot.r'],
  ghosts: { count: 3, parts: ['foot.r'] },
  trace: { point: 'heel.r', trim: TRACE_TRIM },
  callouts: [
    { key: 'balls', text: 'Balls of<br>feet', anchor: { at: 'ball.r', off: [1, -9] }, box: { left: 244, top: 284 }, cue: 'Balls of the feet on the platform edge, heels hanging off.' },
    { key: 'knees', text: 'Knees<br>soft', anchor: { at: 'knee.r', off: [6, 0] }, box: { left: 280, top: 214 }, cue: 'Knees slightly bent and stable, never locked.' },
    { key: 'upright', text: 'Upright', anchor: 'backMid', box: { left: 122, top: 124 }, cue: 'Stand upright under the pads, back straight.' },
  ],
  tempo: [{ phase: 'Raise', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['leg.r', 'leg.l', 'lever'],
    tells: [
      { key: 'lock', text: 'Locking<br>knees', anchor: { at: 'knee.r', pose: 'mistake', off: [6, 0] }, box: { left: 248, top: 210 }, cue: 'Knees locked straight while the heels rise and lower.' },
    ],
  },
  pilot: { drawableFault: 'Top fault: bouncing at the bottom (c6, c9), seen only as speed; the plate draws the next fault on the same list, locking the knees (c6, c5).' },
  alt: 'Standing calf raise, side view. Standing upright under a machine\'s shoulder pads with the hands on its handles, the balls of the feet on a platform edge and the knees slightly bent, the heels lower to a stretch, then rise as high as possible.',
};
