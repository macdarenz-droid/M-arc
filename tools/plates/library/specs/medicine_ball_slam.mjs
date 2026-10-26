// Medicine ball slam (overhead slam), side view, figure facing screen right. LIB-22 (LB10, H; NOSECS lifted at 'LIB-22 resume': D-STRIP-AFALL).
// View: side (card plate.view = census): the ball overhead, the hips pressed back, the knees bent and the flat back,
//  and the fault (hips and knees straight) are sagittal.
// Sources: research card docs/research/howto/cards/medicine_ball_slam.json (research head 596dbe07): c2 tall, the ball
//  overhead, arms straight, hips slightly forward, on the toes, no lean back; c3 the slam straight down between the
//  feet, hips back, knees bent; c4 the whole body, not the arms only (the Mistake); c5 back flat, ACE "the spine and shin
//  angles remain parallel"; c9 a soft slam ball; c10 the ball clear of the toes; c11 a 10-pound ball; c15 both hands.
//  Tempo: Slam, blank (D-LIB22-AFALL; strip/rows.json fallbackA, c12).
// Clone (D-LIB22-CLONE): barbell_back_squat (the 8: the squat), barbell_overhead_press (#109 @ dcac4a38: straight arms
//  overhead), reverse_lunge (#109: the rigid foot on its ball and toe pad); copied, never imported.
// Geometry (confirmed by the report's contacts and checks, and by tests on the drawn items):
//  Start (c2, c15): on the toes (heel-up HEEL_UP, the toe pad on the floor), knees START_KNEE, the hips forward of the
//   ankles by START_Z (solved: the body and the ball overhead balance over the forefoot, between the balls and the toes)
//   of the ankles, trunk 0; the arms straight up in the flexion plane, the hands on the ball's sides.
//  End (c3-c5): the ball on the floor between the feet, the hands just over its top (the slam followed down); three
//   unknowns solved together (Newton, throws if it does not converge): the shoulders END_ARM of the arm's length from
//   the hands, the body balanced over mid-foot, the trunk parallel to the shin (c5 ACE).
//  Via (VIA_N keys, the middle one a ghost): the body blended from the start to the squat, the arms swung forward
//   and down past the face (c3). All keys hold the hands by reach, so the hand path follows the arc.
//  Mistake (c4): knees straight and hips extended, the trunk M_INCL, the arms flung down M_FLEX in front; the ball on
//   the floor as at the end. The faulty arm lies over the solid squat, so it is redrawn as a dashed guide on top.
//  The ball (eq/medBall.mjs) is a `poly` circle; the start ball is redrawn dashed (D-LIB22-DRAW).
// Unsourced numbers (SIZES; lb10/sizes.json holds each with its basis): PX_PER_M, FOOT_X, BALL_DZ, TOE_OUT, HEEL_UP, BALL_KG,
//  START_KNEE, END_ARM, VIA_N, M_INCL, M_FLEX; solved: END_INCL, END_Z.
import { landmarksOf, WINTER, REF, normPose, resolve } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { medBall, MED_BALL, MED_BALL_ITEMS } from '../eq/medBall.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ PX_PER_M: 134, FOOT_X: 0.13, TOE_OUT: 10, HEEL_UP: 45, START_KNEE: 2, BALL_KG: 4.5, BODY_KG: 75, END_ARM: 0.97,
  VIA_N: 5, M_INCL: 10, M_FLEX: 30, BALL_DZ: 0.07 });
const { FOOT_X, TOE_OUT, HEEL_UP, START_KNEE, BALL_KG, BODY_KG, END_ARM, VIA_N, M_INCL, M_FLEX, BALL_DZ } = SIZES;
const ARM = (WINTER.upperArm + WINTER.forearm + REF.gripOff) * H;
const BALL_R = MED_BALL.d / 2, GRIP_X = BALL_R;

export const bisect = (f, a, b, what) => {
  let fa = f(a), fb = f(b), side = 0;
  if (!(fa * fb <= 0)) throw new Error(`medicine_ball_slam: no root for ${what} in [${a}, ${b}] (${fa}, ${fb})`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-8; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
export function com(lm) {
  let m = 0; const c = [0, 0, 0];
  const seg = (w, p) => { m += w; for (let i = 0; i < 3; i++) c[i] += w * p[i]; };
  seg(0.081, lm.ear); seg(0.497, mid(lm.shoulders, lm.hips, 0.5));
  for (const s of ['l', 'r']) {
    seg(0.028, mid(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)); seg(0.016, mid(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)); seg(0.006, lm[`grip.${s}`]);
    seg(0.100, mid(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)); seg(0.0465, mid(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)); seg(0.0145, mid(lm[`heel.${s}`], lm[`toe.${s}`], 0.5));
  }
  return c.map(v => v / m);
}
const kneeOf = lm => {
  const a = [0, 1, 2].map(i => lm['hip.r'][i] - lm['knee.r'][i]), b = [0, 1, 2].map(i => lm['ankle.r'][i] - lm['knee.r'][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
function armsAsAngles(p) {
  const q = resolve(normPose(p, { height: H }), { height: H }).q, { reach, ...rest } = p;
  return { ...rest, shoulder: { l: { ...q.sh.l }, r: { ...q.sh.r } }, elbow: { ...q.elbow } };
}
const toeDir = s => [s * Math.sin(TOE_OUT * R), 0, Math.cos(TOE_OUT * R)];
const flat = { l: { at: [FOOT_X, 0, 0], normal: [0, 1, 0], toe: toeDir(1), ref: 'mid' }, r: { at: [-FOOT_X, 0, 0], normal: [0, 1, 0], toe: toeDir(-1), ref: 'mid' } };
// On the toes (reverse_lunge.mjs:59-61's method): the rigid foot planted heel-up HEEL_UP on its ball, lifted so the
// lowest outline point (the toe pad) just touches the floor.
const sT = Math.sin(HEEL_UP * R), cT = Math.cos(HEEL_UP * R);
const LIFT = -Math.min(...[[0.112, -0.036], [0.120, -0.028], [0.100, -0.038]].map(([zz, y]) => ((zz - 0.080) * -sT + (y + 0.039) * cT) * H));
const BALL_Z = (REF.ball - REF.mid) * H;
const tipToe = s => { const t = toeDir(s); return { at: [s * FOOT_X, LIFT, BALL_Z * t[2]], normal: [t[0] * sT, cT, t[2] * sT], toe: [t[0] * cT, -sT, t[2] * cT], ref: 'ball' }; };
const toes = { l: tipToe(1), r: tipToe(-1) };
const ANKLE_Z = -REF.mid * H;
// Start (c2, c15): tall on the toes, knees extended, hips START_HIP in front of the ankles, the ball overhead in both
// hands, its centre plumb over the shoulders, the arms straight.
const standOn = (plant, z, knee, tilt = 0) => { const at = y => ({ root: { at: [0, y, z], tilt }, trunk: 0, neck: 0, plant }); return at(bisect(y => kneeOf(landmarksOf(at(y), H)) - knee, 0.6, 1.2, 'stand height')); };
const S0At = z => standOn(toes, ANKLE_Z + z, START_KNEE);

// The arms straight up (barbell_overhead_press's lockout), the hands on the ball's sides (c15): the straight arm's
// reach to a grip GRIP_X from the midline, plumb over the shoulder. Every key pose holds the hands by IK (reach), so
// the engine blends the hand targets, never the shoulder angles (an overhead arm drawn in to the midline has no angle
// form that blends forward).
const armAt = (lm, phi) => { const S = lm['shoulder.l'], A = Math.sqrt(ARM ** 2 - (S[0] - GRIP_X) ** 2) - 0.001, y = S[1] - A * Math.cos(phi * R), z = S[2] + A * Math.sin(phi * R);
  return { l: { at: [GRIP_X, y, z], pole: [1, 0, -0.3] }, r: { at: [-GRIP_X, y, z], pole: [-1, 0, -0.3] } }; };
const startAt = z => { const b = S0At(z); return { ...b, reach: armAt(landmarksOf(b, H), 180) }; };
const forefoot = lm => ((lm['ball.l'][2] + lm['toe.l'][2]) / 2 + (lm['ball.r'][2] + lm['toe.r'][2]) / 2) / 2;
const withBall = lm => (com(lm)[2] * BODY_KG + lm.grips[2] * BALL_KG) / (BODY_KG + BALL_KG);
// c2 "hips slightly forward ... on your toes": the hips' offset is solved so the centre of mass (the ball overhead in
// the hands included) sits over the forefoot the body stands on.
export const START_Z = bisect(z => { const lm = landmarksOf(startAt(z), H); return withBall(lm) - forefoot(lm); }, -0.1, 0.3, 'the start balance');
const S0 = S0At(START_Z), LS0 = landmarksOf(S0, H);
const start = startAt(START_Z);
// End (c3-c6): the ball on the floor between the feet, the hands on its sides; trunk END_INCL (back flat); the root's
// height puts the shoulders END_ARM of the arm's length from the hands, its z balances the body over the feet. The ball
// sits BALL_DZ in front of mid-foot, still between the feet (heel -0.12 to toe +0.13 m), so in 3D it clears both feet
// and shanks (D-LIB22-STANCE amended, #305 6357040314 option (c)).
const BALL_END = [0, BALL_R, BALL_DZ];
const TOP = 2 * BALL_R + 0.02, ballGrips = { l: { at: [0.06, TOP, BALL_DZ], pole: [1, 0, -0.2] }, r: { at: [-0.06, TOP, BALL_DZ], pole: [-1, 0, -0.2] } };
const squatAt = (y, z, incl) => ({ root: { at: [0, y, z], tilt: incl }, trunk: 0, neck: 0, plant: flat });
const shinIncl = lm => Math.atan2(lm['knee.r'][2] - lm['ankle.r'][2], lm['knee.r'][1] - lm['ankle.r'][1]) / R;
// Newton with finite differences (mountain_climbers.mjs:41-55 @ dcac4a38), throwing when it does not converge.
function solve(p0, make, res, iters = 40) {
  const keys = Object.keys(p0), p = { ...p0 }, f = q => res(landmarksOf(make(q), H));
  for (let it = 0; it < iters; it++) {
    const r = f(p); if (Math.hypot(...r) < 1e-7) return p;
    const J = keys.map(k => { const d = 1e-5, q = { ...p, [k]: p[k] + d }; return f(q).map((v, i) => (v - r[i]) / d); });
    const n = keys.length, A = Array.from({ length: n }, (_, i) => [...keys.map((_, j) => J[j][i]), -r[i]]);
    for (let c = 0; c < n; c++) {
      let m = c; for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[m][c])) m = i;
      [A[c], A[m]] = [A[m], A[c]];
      if (Math.abs(A[c][c]) < 1e-12) throw new Error('medicine_ball_slam: singular step');
      for (let i = 0; i < n; i++) if (i !== c) { const k = A[i][c] / A[c][c]; for (let j = c; j <= n; j++) A[i][j] -= k * A[c][j]; }
    }
    keys.forEach((k, i) => { p[k] += A[i][n] / A[i][i]; });
  }
  throw new Error('medicine_ball_slam: no convergence');
}
// End: three conditions, three unknowns (root y, z and the trunk's inclination): the shoulders END_ARM of the arm's
// length from the hands on the ball (c3, c4: following the slam down), the body balanced over mid-foot, and c5 (ACE)
// "the spine and shin angles remain parallel".
const EQ = solve({ y: 0.42, z: -0.2, incl: 45 }, q => squatAt(q.y, q.z, q.incl), lm => { const S = lm['shoulder.l'];
  return [Math.hypot(S[0] - 0.06, S[1] - TOP, S[2]) - END_ARM * ARM, com(lm)[2], (SQ_INCL(lm) - shinIncl(lm)) / 100]; });
function SQ_INCL(lm) { return Math.atan2(lm.shoulders[2] - lm.hips[2], lm.shoulders[1] - lm.hips[1]) / R; }
export const END_INCL = EQ.incl, END_Z = EQ.z;
const end = { ...squatAt(EQ.y, EQ.z, EQ.incl), reach: ballGrips };
// VIA_N via poses (the middle one drawn as the ghost): the body blended from the tall start to the squat, the straight
// arms swung forward and down in front on one arc about the shoulder, their angle from plumb evenly spaced from the
// start's 180 to the end's (c3 "bring the ball down over your head to throw it directly downwards into the floor").
const mix = (a, b, t) => (Array.isArray(a) ? a.map((v, i) => mix(v, b[i], t)) : typeof a === 'number' ? a + (b - a) * t : t < 0.5 ? a : b);
const blend = t => { const p = { root: { at: mix(S0.root.at, end.root.at, t), tilt: mix(0, EQ.incl, t) }, trunk: 0, neck: 0,
  plant: Object.fromEntries(['l', 'r'].map(sd => [sd, { at: mix(toes[sd].at, flat[sd].at, t), normal: mix(toes[sd].normal, [0, 1, 0], t), toe: mix(toes[sd].toe, flat[sd].toe, t), ref: t < 0.5 ? 'ball' : 'mid' }])) };
  return p; };
const LE = landmarksOf(end, H), PHI_END = Math.atan2(LE.grips[2] - LE.shoulders[2], LE.shoulders[1] - LE.grips[1]) / R;
const via = Array.from({ length: VIA_N }, (_, k) => { const t = (k + 1) / (VIA_N + 1), b = blend(t); return { ...b, reach: armAt(landmarksOf(b, H), 180 + (PHI_END - 180) * t) }; });
// Mistake (c4): arms only: knees straight, hips extended near upright, the arms flung down in front, the ball released.
const SM = standOn(flat, ANKLE_Z, 0.5, M_INCL);
const mistake = { root: SM.root, trunk: 0, plant: flat, shoulder: { flex: M_FLEX + M_INCL }, elbow: 0, reach: { l: null, r: null } };
const ballAt = (lm, ctx) => (ctx.pose === 'mistake' || ctx.pose === 'end' ? BALL_END : [0, lm.grips[1], lm.grips[2]]);
const LSTART = landmarksOf(start, H), FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
const START_BALL = medBall({ at: [0, LSTART.grips[1], LSTART.grips[2]] }).map(it => ({ type: 'line', cls: 'eq-line m-line', pts: [...it.pts, it.pts[0]], z: 'front', part: 'startball' }));

export default {
  id: 'medicine_ball_slam', name: 'Medicine Ball Slam', view: 'side', facing: 'right',
  camera: { pxPerM: SIZES.PX_PER_M, x0: 172, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.8, to: 0.8 },
    ...perItem((lm, ctx) => medBall({ at: ballAt(lm, ctx) }), MED_BALL_ITEMS),
    ...perItem((lm, ctx) => (ctx.pose === 'end' ? START_BALL : null), MED_BALL_ITEMS),
  ],
  checks: [
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: LSTART[landmark], pose: 'start', tol: 0.5 })),            // c15 fact: the hands on the ball
    ...['toe.l', 'toe.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'start', tol: 0.5 })),                           // c2 fact: on the toes
    ...['heel.l', 'heel.r', 'ball.l', 'ball.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'end', tol: 0.5 })),        // feet flat at the slam
  ],
  ghosts: { count: 1, parts: ['arm.r', 'ball'] },
  trace: { point: 'grips', trim: [10, 12] },
  callouts: [
    { key: 'overhead', text: 'Ball overhead', anchor: { at: 'grip.r', pose: 'start', off: [-15.41, 0] }, box: { left: 30, top: 44 }, cue: 'Tall on your toes, arms straight, ball overhead.' },
    { key: 'hips', text: 'Hips and knees', anchor: 'buttock', box: { left: 28, top: 192 }, cue: 'Press the hips back and bend the knees as you slam.' },
    { key: 'flat', text: 'Flat back', anchor: 'backUpper', box: { left: 56, top: 136 }, cue: 'Back flat as you slam.' },
  ],
  mistake: {
    pose: mistake,
    // the faulty arm lies over the solid squat, which masks it: redrawn as a dashed guide on top (LB7 slice item 1)
    guides: [{ kind: 'dashed', pts: [{ at: 'shoulder.r', pose: 'mistake' }, { at: 'elbow.r', pose: 'mistake' }, { at: 'grip.r', pose: 'mistake' }] }],
    tells: [
      { key: 'arms', text: 'Arms only', anchor: { at: 'grip.r', pose: 'mistake' }, cue: 'The arms slam the ball on their own.' },
      { key: 'legs', text: 'Legs straight', anchor: { at: 'buttock', pose: 'mistake' }, cue: 'The hips and knees stay straight instead of bending.' },
    ],
  },
  tempo: [{ phase: 'Slam', move: true }],   // D-STRIP-AFALL (D-LIB22-AFALL): blank, strip/rows.json fallbackA (lb10/tempo.json)
  alt: 'Medicine ball slam, side view. Tall on the toes with the ball overhead in straight arms, then the ball slammed to the floor between the feet with the hips pressed back, the knees bent and the back flat.',
};
export const info = { END_INCL, END_Z, LIFT, startToe: LSTART['toe.r'], startCom: com(LSTART), endCom: com(landmarksOf(end, H)) };
