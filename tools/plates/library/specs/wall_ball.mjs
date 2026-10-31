// Wall ball, side view, figure facing screen right, the wall in front. LIB-SMALL (LB10 resume 3, mode H: D-SMALL-MODES;
// card parent null; `load.primitive` has no ball value, and the wall, the stance distance and the hands under the ball
// are no PARAMS key).
// View: side (card plate.view = census). The feet-to-wall distance and the forward tilt (c2, c3; the top fault), the
//  squat depth (c6) and the ball at the chest (c1, c9) read from the side, the wall drawn in front of the lifter.
// Sources: research card docs/research/howto/cards/wall_ball.json (research head 596dbe07): callouts =
//  plate.checkpoints (c2 Right distance, c6 Squat depth, c8/c9 the ball held close); Mistake = plate.mistake (c3, c4;
//  drawable): standing too far from the wall, the body tilting forward, drawn against the squat bottom (D-SMALL-WBMIS).
//  Tempo: Squat, Throw, each blank (D-SMALL-WBAFALL; strip/rows.json fallbackA, c16).
// Clone source (D-SMALL-WBCLONE; copied, never imported, D-LIB9-CLONE): goblet_squat (LB4, approved): the feet, the
//  thorax-rigid load spot (an affine combination of three thorax landmarks), the Winter 2009 balance with a point load,
//  the bracketed root finder and the key-pose solve; medicine_ball_slam for the medBall use (perItem, the dashed start
//  ball); wall_sit for the wall call (eq/wall.mjs, called with `face` = the near face + WALL.t so the slab stands in
//  front of the lifter).
// Geometry (confirmed by the engine report `checks` and the drawn-item tests):
//  Feet (c1): mid-soles FOOT_X either side, toes out TOE_OUT, both feet flat in every pose (c17, c6).
//  Wall (c2): its near face STAND_DIST in front of the start toe tips; static in every pose, the Mistake included.
//  Ball (c1, c9): eq/medBall.mjs at its default 23 cm, its centre BALL_OFF in front of the sternum along the thorax
//   normal (the first step that clears the torso by 2 px), rigid with the thorax: at chest height under the chin. The
//   hands cup its underside (c9 "hands underneath the ball", wrists HAND_X either side), the elbows down and in by the
//   ribs (c1 "elbows tucked in").
//  Balance: every key pose solves the root z so the centre of mass of body plus ball (BALL_MASS of body mass) is over
//   mid-foot; the root height is solved for the pose's depth.
//  Start (c1, c5): standing tall, knees 5 deg soft, thorax 3 deg forward. End (c6): the hip joint centre DEPTH below the
//   knee centre ("hip crease must break the plane of the knee"), thorax END_INCL (chest up), heels down.
//  Mistake (c3): the same squat bottom with the feet M_DIST from the wall (farther than c2's widest sourced distance,
//   "2 to 3 feet"), the thorax tipped forward M_INCL; the wall static. A dashed floor guide spans the gap.
// Unsourced numbers (lb10/sizes.json): FOOT_X, TOE_OUT, BALL_OFF, HAND_X, BALL_MASS, DEPTH, END_INCL, M_DIST, M_INCL,
//  WALL_H, the target's height and size; STAND_DIST is c2's Box Life midpoint (lb10/sizes.json).
import { bodyShapes, fk, landmarksOf, normPose, resolve } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { medBall, MED_BALL, MED_BALL_ITEMS } from '../eq/medBall.mjs';
import { wall, WALL } from '../eq/wall.mjs';

const H = 1.75, R = Math.PI / 180, B = { height: H };
export const SIZES = Object.freeze({ FOOT_X: 0.17, TOE_OUT: 20, STAND_DIST: 0.57, BALL_OFF: 0.126, HAND_X: 0.075, BALL_MASS: 0.048, DEPTH: 0.02, END_INCL: 28,
  M_DIST: 1.0, M_INCL: 40, WALL_H: 2.25, TARGET: [1.95, 2.2] });
const { FOOT_X, TOE_OUT, STAND_DIST, BALL_OFF, HAND_X, BALL_MASS, DEPTH, END_INCL, M_DIST, M_INCL, WALL_H, TARGET } = SIZES;
const BALL_R = MED_BALL.d / 2;
const toe = s => [s * Math.sin(TOE_OUT * R), 0, Math.cos(TOE_OUT * R)];
const feetAt = dz => ({ l: { at: [FOOT_X, 0, dz], toe: toe(1) }, r: { at: [-FOOT_X, 0, dz], toe: toe(-1) } });
const feet = feetAt(0);

// The ball centre: BALL_OFF in front of the sternum, square to the thorax (goblet_squat's load spot: an affine
// combination of three thorax landmarks in the standing thorax frame, in units of H), so it rides with the thorax.
const REFP = { neck: [0.855, -0.02], backUpper: [0.75, -0.072], sternum: [0.80, 0.07] };
const BALL_T = [0, REFP.sternum[0], REFP.sternum[1] + BALL_OFF / H];
const Wt = (() => {
  const [a, b, c] = [REFP.neck, REFP.backUpper, REFP.sternum];
  const M = [[a[0] - c[0], b[0] - c[0]], [a[1] - c[1], b[1] - c[1]]], v = [BALL_T[1] - c[0], BALL_T[2] - c[1]];
  const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
  const wa = (v[0] * M[1][1] - M[0][1] * v[1]) / det, wb = (M[0][0] * v[1] - v[0] * M[1][0]) / det;
  return { neck: wa, backUpper: wb, sternum: 1 - wa - wb };
})();
const ballOfLm = lm => [0, 1, 2].map(i => Wt.neck * lm.neck[i] + Wt.backUpper * lm.backUpper[i] + Wt.sternum * lm.sternum[i]).map((v, i) => (i === 0 ? 0 : v));
// Hands under the ball (c9): each grip on the underside, HAND_X either side of the centre.
const UNDER = Math.sqrt(BALL_R ** 2 - HAND_X ** 2);
const cupOf = (c, s) => [s * HAND_X, c[1] - UNDER, c[2]];
const ELBOWS = [0.25, -1, 0.1];
const cups = c => ({ l: { at: cupOf(c, 1), pole: ELBOWS }, r: { at: cupOf(c, -1), pole: [-ELBOWS[0], ELBOWS[1], ELBOWS[2]] } });

// Whole-body centre of mass (Winter 2009 Table 4.1; copied from goblet_squat) plus point masses.
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
  if (fa * fb > 0) throw new Error(`wall_ball: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-8; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const kneeR = p => resolve(normPose(p, B), B).q.knee.r;
const trunkOf = (y, z, incl, spine, extra = {}) => ({ root: { at: [0, y, z], tilt: incl - spine }, trunk: spine, neck: -incl / 2, plant: feet, ...extra });
const withCups = p => ({ ...p, reach: cups(ballOfLm(landmarksOf(p, H))) });
/** A key pose: thorax `incl`, the root height from depth(pose) = 0 (bracket ys), the root z for the centre of mass with the ball over mid-foot. */
function key({ incl, spine = 0, depth, ys, zr = [-0.4, 0.3], extra = {}, mz = 0 }) {
  const yAt = z => solve(y => depth(withCups(trunkOf(y, z, incl, spine, extra))), ...ys);
  const z = solve(z => { const p = withCups(trunkOf(yAt(z), z, incl, spine, extra)), l = landmarksOf(p, H); return com(l, [[BALL_MASS, ballOfLm(l)]])[2] - mz; }, ...zr);
  return withCups(trunkOf(yAt(z), z, incl, spine, extra));
}
const kneeAt = k => p => kneeR(p) - k;
const below = p => { const l = landmarksOf(p, H); return l['hip.r'][1] - (l['knee.r'][1] - DEPTH); };
const pole = (s, a) => [s * Math.sin(a * R), 0, Math.cos(a * R)];
const feetStart = { l: { ...feet.l, pole: pole(1, 17) }, r: { ...feet.r, pole: pole(-1, 17) } };
const start = key({ incl: 3, depth: kneeAt(5), ys: [0.8, 0.935], extra: { plant: feetStart } });
const end = key({ incl: END_INCL, spine: 6, depth: below, ys: [0.25, 0.6], zr: [-0.45, -0.15] });
const via = [key({ incl: END_INCL * 0.5, spine: 3, depth: kneeAt(60), ys: [0.4, 0.935] })];

const LS = landmarksOf(start, H), LE = landmarksOf(end, H);
const TOE_TIP = Math.max(LS['toe.r'][2], LS['toe.l'][2]);
export const WALL_FACE = TOE_TIP + STAND_DIST;            // the wall's near face (world z)
// Mistake (c3): the squat bottom with the feet moved back so the toe tips are M_DIST from the wall, thorax M_INCL.
const DZ = -(M_DIST - STAND_DIST);
const MF = feetAt(DZ);
// goblet_squat's Mistake method: the thorax folds to M_INCL about the bottom's hips (moved back with the feet), the
// ball riding the thorax and the hands under it.
const mistakePose = (() => {
  const at = [end.root.at[0], end.root.at[1], end.root.at[2] + DZ];
  const p = { root: { at, tilt: M_INCL - 6 }, trunk: 6, neck: -M_INCL / 2, plant: MF };
  return { ...p, reach: cups(ballOfLm(landmarksOf(p, H))) };
})();
const LM = landmarksOf({ ...end, ...mistakePose }, H);

const ballAt = (lm, ctx) => (lm ? ballOfLm(lm) : null);
const S_BALL = ballOfLm(LS);
const START_BALL = medBall({ at: S_BALL }).map(it => ({ type: 'line', cls: 'eq-line m-line', pts: [...it.pts, it.pts[0]], z: 'front', part: 'startball' }));
// The target: a short mark on the wall face above head height (plate.equipment "a target above head height").
const TARGET_ITEM = { type: 'box', at: [0, (TARGET[0] + TARGET[1]) / 2, WALL_FACE - 0.015], w: 0.03, h: TARGET[1] - TARGET[0], z: 'back' };

export const wbInfo = { wallFace: WALL_FACE, toeTip: TOE_TIP, mToeTip: Math.max(LM['toe.r'][2], LM['toe.l'][2]), startBall: S_BALL, endBall: ballOfLm(LE),
  hipKneeCm: (LE['hip.r'][1] - LE['knee.r'][1]) * 100, chin: LS.chin ?? null };
export const POSES = { start, end, mistake: mistakePose };

const floor = { point: [0, 0, 0], normal: [0, 1, 0] };
const hand = (pose, s) => {
  const l = pose === 'start' ? LS : LE, g = cupOf(ballOfLm(l), s === 'l' ? 1 : -1), d = l[`grip.${s}`].map((v, i) => v - l[`wrist.${s}`][i]);
  return { landmark: `wrist.${s}`, plane: { point: g.map((v, i) => v - d[i]), normal: [0, 1, 0] }, pose, tol: 0.5 };
};
export default {
  id: 'wall_ball', name: 'Wall Ball', view: 'side', facing: 'right',
  camera: { x0: 150, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: DZ - 0.45, to: WALL_FACE },
    wall({ face: WALL_FACE + WALL.t, h: WALL_H }),
    TARGET_ITEM,
    ...perItem((lm, ctx) => medBall({ at: ballAt(lm, ctx) }), MED_BALL_ITEMS),
    ...perItem((lm, ctx) => (ctx.pose === 'end' ? START_BALL : null), MED_BALL_ITEMS),
  ],
  checks: [
    { landmark: 'heel.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'heel.l', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.l', plane: floor, pose: 'all', tol: 0.5 },
    hand('start', 'r'), hand('start', 'l'), hand('end', 'r'), hand('end', 'l'),
  ],
  startParts: ['trunk', 'leg.r'],
  ghosts: { count: 2, parts: ['trunk', 'leg.r', 'arm.r'] },
  trace: { point: 'hip.r', trim: [10, 12] },
  callouts: [
    { key: 'distance', text: 'Right<br>distance', anchor: { at: 'toe.r', pose: 'start' }, cue: 'Arms out, the ball touches the wall: stand there.' },
    { key: 'depth', text: 'Squat depth', anchor: 'hip.r', cue: 'Squat until your thighs are parallel to the floor or lower, chest up.' },
    { key: 'close', text: 'Ball close', anchor: 'grip.r', cue: 'Hands under the ball, close to your body the whole time.' },
  ],
  tempo: [{ phase: 'Squat', move: true }, { phase: 'Throw', move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: [[0, 0.004, Math.max(LM['toe.r'][2], LM['toe.l'][2])], [0, 0.004, WALL_FACE]] },
    ],
    tells: [
      { key: 'far', text: 'Too far', anchor: { at: 'toe.r', pose: 'mistake' }, cue: 'The feet stand too far from the wall.' },
      { key: 'tilt', text: 'Body tilts<br>forward', anchor: { at: 'backUpper', pose: 'mistake' }, cue: 'The body tilts forward to reach the wall.' },
    ],
  },
  alt: 'Wall ball, side view. Facing a wall at arm\'s length, the lifter holds a medicine ball under the chin with the elbows tucked in and squats until the hips are below the knees, chest up, heels flat.',
};
