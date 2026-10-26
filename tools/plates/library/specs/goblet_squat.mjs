// Goblet squat, side view, figure facing screen right. LIB-14 (LB4, mode H: D-LIB14-MODES; card parent and census closest
// barbell_back_squat, the 8; the engine dumbbell anchor dumbbell_biceps_curl, pilot A).
// View: side (card plate.view = census view). The chest drooping, the weight drifting off the chest and the forward lean
// (g6) and the depth (g4) read from the side.
// Sources: research card docs/research/howto/cards/goblet_squat.json (research head 3812989f): callouts =
//  plate.checkpoints (g5 Weight at chest, g8 Chest up, g4 Thighs parallel); Mistake = plate.mistake (g6, drawable).
//  Tempo: the card's, tempoOf(strip/rows.json) (D-STRIP-B; g9 'Smooth and controlled', no seconds). variantLine:
//  exercises.json lists Dumbbell / Kettlebell; the plate draws the dumbbell held upright (the card's line).
// Clone source: barbell_back_squat (the 8, main) for the feet and the thorax-fixed load spot; single_leg_romanian_deadlift
//  (#109 @ ff7c5c4f) for the whole-body balance with a load (Winter 2009 masses) and its bracketed root finder;
//  dumbbell_biceps_curl (#109) for the engine dumbbell; copied, never imported (D-LIB9-CLONE).
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Feet (g1, g2): mid-soles FOOT_X either side (hip to shoulder width), toes out TOE_OUT, knees on the toe line, both
//   feet flat at start and end (checks; the end contact facts, g4).
//  Dumbbell (g1, g2, g5): upright (the vendor dumbbell, axis vertical), its centre DB_T in the standing thorax frame, so
//   it rides with the chest: directly in front of the chest, its upper head at chest height (g1, g5). The hands cup the
//   upper head from below (g1: "both hands cupping the top of the weight"): each grip on the head's underside, CUP_X
//   either side of the axis; a `checks` plane per pose holds each wrist where its grip meets the head (the contact facts
//   at start). The elbows hang down and in by the ribs (g2; IK pole down and in).
//  Balance: every key pose solves the root z so the centre of mass of body plus dumbbell (DB_MASS of body mass) is over
//   mid-foot; the root height is SOLVED (bracket) for the pose's depth.
//  Start: standing, knees 5 deg soft, trunk 3 deg forward. End (g4, g8): the hip joint centre DEPTH below the knee
//   centre (ACE's "hips below the knees", g4), the thorax END_INCL from vertical (chest upright, g8), heels down.
//  Mistake (g6): at the bottom the torso folds forward (thorax M_INCL), the chest droops, and the dumbbell drifts
//   M_DRIFT off the chest with the arms reaching (the hands follow it); the hips and legs stay as at the bottom. The
//   faulty upper body, arms and dumbbell are traced as dashed guides (front_squat's method).
// Unsourced numbers: FOOT_X 0.17 m, TOE_OUT 20, the start knee pole 17 deg inside the toe line (the foot contacts under 0.5 cm, as the 8's start pole), DB_T (the load spot), CUP_X 0.03 m, the elbow poles, DB_MASS 0.2, START
//  (knee 5, trunk 3), DEPTH 0.02 m, END_INCL 28, M_INCL 50, M_DRIFT 0.12 m (the Mistake magnitudes, illustrative), the
//  vendor dumbbell's default size.
import { bodyShapes, fk, landmarksOf, normPose, resolve } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180, B = { height: H };
const FOOT_X = 0.17, TOE_OUT = 20, CUP_X = 0.03, DB_MASS = 0.2, DEPTH = 0.02, END_INCL = 28, M_INCL = 50, M_DRIFT = 0.12;
const DB = { head: 0.119, headLen: 0.07, handle: 0.13 };
const HEAD_UNDER = DB.handle / 2;                       // the upper head's underside above the dumbbell centre (m)
const DB_T = [0, 0.75, 0.105];                          // dumbbell centre in the standing thorax frame (H): in front of the chest
const toe = s => [s * Math.sin(TOE_OUT * R), 0, Math.cos(TOE_OUT * R)];
const feet = { l: { at: [FOOT_X, 0, 0], toe: toe(1) }, r: { at: [-FOOT_X, 0, 0], toe: toe(-1) } };

// The load spot: an affine combination of three thorax landmarks (copied from the 8's squat), rigid with the thorax.
const REFP = { neck: [0.855, -0.02], backUpper: [0.75, -0.072], sternum: [0.80, 0.07] };
const W = (() => {
  const [a, b, c] = [REFP.neck, REFP.backUpper, REFP.sternum];
  const M = [[a[0] - c[0], b[0] - c[0]], [a[1] - c[1], b[1] - c[1]]], v = [DB_T[1] - c[0], DB_T[2] - c[1]];
  const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
  const wa = (v[0] * M[1][1] - M[0][1] * v[1]) / det, wb = (M[0][0] * v[1] - v[0] * M[1][0]) / det;
  return { neck: wa, backUpper: wb, sternum: 1 - wa - wb };
})();
const dbOf = lm => [0, 1, 2].map(i => W.neck * lm.neck[i] + W.backUpper * lm.backUpper[i] + W.sternum * lm.sternum[i]).map((v, i) => i === 0 ? 0 : v);
const cupOf = (c, s) => [s * CUP_X, c[1] + HEAD_UNDER, c[2]];
const ELBOWS = [0.25, -1, 0.1];
const cups = c => ({ l: { at: cupOf(c, 1), pole: ELBOWS }, r: { at: cupOf(c, -1), pole: [-ELBOWS[0], ELBOWS[1], ELBOWS[2]] } });

// Whole-body centre of mass (Winter 2009 Table 4.1; copied from single_leg_romanian_deadlift) plus point masses.
const L3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
function com(lm, extra = []) {
  const parts = [[0.081, lm.ear], [0.497, L3(lm.shoulders, lm.hips, 0.5)], ...extra];
  for (const s of ['l', 'r']) parts.push(
    [0.028, L3(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)], [0.016, L3(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)], [0.006, lm[`grip.${s}`]],
    [0.100, L3(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)], [0.0465, L3(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)], [0.0145, L3(lm[`heel.${s}`], lm[`toe.${s}`], 0.5)]);
  const M = parts.reduce((a, p) => a + p[0], 0);
  return [0, 1, 2].map(i => parts.reduce((a, p) => a + p[0] * p[1][i], 0) / M);
}
// Bracketed root finder (Illinois regula falsi, copied): throws when f(a) and f(b) have the same sign (D-LIB9-CLONE).
export const solve = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`goblet_squat: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-8; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const kneeR = p => resolve(normPose(p, B), B).q.knee.r;
const trunkOf = (y, z, incl, spine, extra = {}) => ({ root: { at: [0, y, z], tilt: incl - spine }, trunk: spine, neck: -incl / 2, plant: feet, ...extra });
const withCups = p => ({ ...p, reach: cups(dbOf(landmarksOf(p, H))) });
/** A key pose: thorax `incl`, the root height from depth(pose) = 0 (bracket ys), the root z for the centre of mass with the dumbbell over mid-foot. */
function key({ incl, spine = 0, depth, ys, zr = [-0.4, 0.3], extra = {} }) {
  const yAt = z => solve(y => depth(withCups(trunkOf(y, z, incl, spine, extra))), ...ys);
  const z = solve(z => { const p = withCups(trunkOf(yAt(z), z, incl, spine, extra)), l = landmarksOf(p, H); return com(l, [[DB_MASS, dbOf(l)]])[2]; }, ...zr);
  return withCups(trunkOf(yAt(z), z, incl, spine, extra));
}
const kneeAt = k => p => kneeR(p) - k;
const below = p => { const l = landmarksOf(p, H); return l['hip.r'][1] - (l['knee.r'][1] - DEPTH); };
const pole = (s, a) => [s * Math.sin(a * R), 0, Math.cos(a * R)];
const feetStart = { l: { ...feet.l, pole: pole(1, 17) }, r: { ...feet.r, pole: pole(-1, 17) } };
const start = key({ incl: 3, depth: kneeAt(5), ys: [0.8, 0.935], extra: { plant: feetStart } });
const end = key({ incl: END_INCL, spine: 6, depth: below, ys: [0.25, 0.6], zr: [-0.45, -0.15] });
const via = [key({ incl: END_INCL * 0.5, spine: 3, depth: kneeAt(60), ys: [0.4, 0.935] })];
// Mistake (g6): the thorax folds to M_INCL about the same hips; the dumbbell drifts M_DRIFT forward off the chest and
// the hands follow it (the elbows open).
const ME = { root: { at: end.root.at, tilt: M_INCL - 12 }, trunk: 12, neck: -12, plant: feet };
const M_DB = (() => { const c = dbOf(landmarksOf(ME, H)); return [0, c[1] - 0.03, c[2] + M_DRIFT]; })();
const mistakePose = { root: ME.root, trunk: ME.trunk, neck: ME.neck, reach: { l: { at: cupOf(M_DB, 1), pole: [0.3, -1, 0.4] }, r: { at: cupOf(M_DB, -1), pole: [-0.3, -1, 0.4] } } };
const dbAt = (lm, ctx) => (ctx.pose === 'mistake' ? M_DB : dbOf(lm));

// The faulty upper body and the drifting dumbbell are traced as dashed guides (front_squat's method, one_arm_dumbbell_row's
// code, copied): the engine masks the Mistake outline inside the faulty body.
const PXM = 146.28571428571428, X0 = 196, CAM = { view: 'side', near: 'r', facing: 'right', pxm: PXM, P: w => [X0 + w[2] * PXM, 339 - w[1] * PXM] };
const toW = ([x, y]) => [0, (339 - y) / PXM, (x - X0) / PXM];
const inPoly = (poly, [x, y]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
const KEYS = ['head', 'torso', 'shcap.r', 'upper.r', 'elbowcap.r', 'fore.r', 'fist.r'];
export const MIST_UPPER = (() => {
  const shapes = bodyShapes(fk(resolve(normPose({ ...end, ...mistakePose }, B), B).q, B), CAM).filter(x => KEYS.includes(x.key) && x.poly);
  const runs = [];
  for (const sh of shapes) {
    const others = shapes.filter(o => o !== sh).map(o => o.poly), keep = sh.poly.map(q => !others.some(P => inPoly(P, q)));
    const first = keep.indexOf(false);
    if (first < 0) { runs.push([...sh.poly, sh.poly[0]]); continue; }
    let cur = [];
    for (let k = 1; k <= sh.poly.length; k++) { const i = (first + k) % sh.poly.length; if (keep[i]) cur.push(sh.poly[i]); else if (cur.length) { runs.push(cur); cur = []; } }
    if (cur.length) runs.push(cur);
  }
  return runs.filter(r => r.length > 1).map(r => r.map(toW));
})();
// The drifted dumbbell's outline (side-on, upright: handle and two heads as one rectangle per part), dashed.
const rect = (c, w, y0, y1) => [[0, y0, c[2] - w], [0, y0, c[2] + w], [0, y1, c[2] + w], [0, y1, c[2] - w], [0, y0, c[2] - w]];
const hw = DB.head * 0.866 / 2;
export const MIST_DB = [rect(M_DB, hw, M_DB[1] + HEAD_UNDER, M_DB[1] + HEAD_UNDER + DB.headLen), rect(M_DB, hw, M_DB[1] - HEAD_UNDER - DB.headLen, M_DB[1] - HEAD_UNDER)];

const LS = landmarksOf(start, H), LE = landmarksOf(end, H);
// The start dumbbell, hidden behind the end torso? It rides with the chest, so it is redrawn only as a dashed outline at
// the end (the start layer never draws moving equipment; the 8's start bar dot).
const S_DB = dbOf(LS);
const START_DB = [rect(S_DB, hw, S_DB[1] + HEAD_UNDER, S_DB[1] + HEAD_UNDER + DB.headLen), rect(S_DB, hw, S_DB[1] - HEAD_UNDER - DB.headLen, S_DB[1] - HEAD_UNDER)];
// Hands cupping the head (g1): per pose, the plane square to the dumbbell's axis through the wrist spot that puts each
// grip on the upper head's underside.
const cupCheck = (pose, s) => {
  const l = pose === 'start' ? LS : LE, g = cupOf(dbOf(l), s === 'l' ? 1 : -1), d = l[`grip.${s}`].map((v, i) => v - l[`wrist.${s}`][i]);
  const n = [0, 1, 0], spot = g.map((v, i) => v - d[i]);
  return { landmark: `wrist.${s}`, plane: { point: spot, normal: n }, pose, tol: 0.5 };
};
export const gsInfo = { endDb: dbOf(LE), mDb: M_DB, hipKneeCm: (LE['hip.r'][1] - LE['knee.r'][1]) * 100 };

const floor = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  id: 'goblet_squat', name: 'Goblet Squat', view: 'side', facing: 'right',
  camera: { x0: X0, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.75, to: 0.75 },
    (lm, ctx) => ({ type: 'dumbbell', at: dbAt(lm, ctx), axis: [0, 1, 0], part: 'db', z: 'front' }),
    ...START_DB.map(pts => (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts, z: 'front', part: 'startdb' } : null)),
  ],
  checks: [
    { landmark: 'heel.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'heel.l', plane: floor, pose: 'all', tol: 0.5 },     // g4: both feet
    { landmark: 'ball.l', plane: floor, pose: 'all', tol: 0.5 },
    cupCheck('start', 'r'), cupCheck('start', 'l'), cupCheck('end', 'r'), cupCheck('end', 'l'),
  ],
  startParts: ['trunk', 'leg.r'],
  ghosts: { count: 2, parts: ['trunk', 'leg.r', 'arm.r', 'db'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  datum: [{ x: [0, 0, 0], from: 349, to: 60 }],
  // panel lb4p item 3: CHEST UP's leader ends on the chest front between the chin and the dumbbell's top head, the label
  // above WEIGHT AT CHEST.
  callouts: [
    { key: 'weight', text: 'Weight at<br>chest', anchor: 'grip.r', box: { left: 252, top: 232 }, cue: 'Keep the dumbbell upright against your chest the whole rep.' },
    { key: 'chest', text: 'Chest up', anchor: { along: ['sternum', 'chin'], t: 0.6 }, box: { left: 252, top: 176 }, cue: 'Keep your torso upright, with no extra forward lean.' },
    { key: 'thighs', text: 'Thighs<br>parallel', anchor: 'hip.r', box: { left: 30, top: 300 }, cue: 'Squat until your thighs are parallel, or deeper if you can.' },
  ],
  tempo: [{ phase: 'Lower', move: true, word: 'Controlled' }, { phase: 'Drive up', move: true, word: 'Controlled' }],
  mistake: {
    pose: mistakePose,
    guides: [
      ...MIST_UPPER.map(pts => ({ kind: 'dashed', pts })),
      ...MIST_DB.map(pts => ({ kind: 'dashed', pts })),
    ],
    tells: [
      { key: 'lean', text: 'Leans far<br>forward', anchor: { at: 'backUpper', pose: 'mistake' }, cue: 'The torso leans far forward and the chest droops.' },
      { key: 'drift', text: 'Weight drifts<br>away', anchor: { at: 'grip.r', pose: 'mistake' }, cue: 'The dumbbell drifts away from the body.' },
    ],
  },
  alt: 'Goblet squat, side view. Holding one dumbbell upright in front of the chest with both hands cupping the top, elbows by the ribs, the lifter squats until the hips are below the knees, chest up, heels flat.',
};
