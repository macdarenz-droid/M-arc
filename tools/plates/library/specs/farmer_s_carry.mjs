// Farmer's carry (dumbbells), side view, figure facing screen right. LIB-22 (LB10, H; NOSECS: no tempo).
// View: side (card plate.view = census): the tall torso, the long arms at the sides, the shoulders back and down and
//  the step length are sagittal.
// Sources: research card docs/research/howto/cards/farmer_s_carry.json (research head 596dbe07): c3 feet about
//  hip-width, grab each dumbbell (neutral grip); c4 arms fully extended at the sides, tall chest, neutral neck and
//  spine, torso upright, gaze ahead; c5 shoulders back and down; c6 knees not locked out; c8 short, deliberate steps;
//  c9 steady and upright, the weights level; c13 thumb wrapped; c18 about 25 % of body weight in each hand; c25
//  regular-sized steps (the Mistake). Tempo: none (D-LIB22-SECS, NOSECS).
// Clone (D-LIB22-CLONE): barbell_back_squat (the 8: the standing side view), dumbbell_biceps_curl (#109 @ dcac4a38:
//  the engine dumbbell, SCAP), reverse_lunge (#109: the neutral-grip dumbbells front-to-back, one entry each),
//  mountain_climbers (#109: one stride of the cycle, the via ghost), kettlebell_swing (the Winter centre of mass with
//  a carried load); copied, never imported.
// Geometry (confirmed by the report's contacts and checks, and by tests on the drawn items):
//  Upright: pelvis tilt, lumbar and neck 0 (c4); the arms hang straight down at the sides (shoulder 0, elbow 0, c4),
//   the scapulae set SCAP_ELEV down and SCAP_PRO back (c5); a dumbbell in each fist, handle front-to-back (neutral
//   grip, c3), the far one behind the body (z back), the near one in front (z front).
//  Feet FOOT_X out (c3 hip-width: the ankles under the engine's hip joints). The far (left) foot is the stance foot:
//   its ball stays on one spot in every pose; the near (right) foot steps (D-LIB22-SIDES: no side named, near picked).
//  Start: feet flat side by side (c3), knees KNEE_SOFT (c6); root solved so the centre of mass (the body and both
//   dumbbells) lies over the mid-soles. End: the near foot flat STRIDE ahead (c8); the far leg keeps its start knee and
//   ankle and rolls onto its ball (heel-up solved, 13 deg); the centre of mass midway between the near mid-sole and the
//   far ball (root solved; the near knee follows, 20 deg). Via (one ghost): the near foot half way, its sole VIA_LIFT up.
//  Mistake (c25, c8; drawable false, F7): the near foot M_STRIDE ahead (a regular-sized step), solved the same way (the
//   far heel 24 deg up, the hips 3.7 cm lower, the near knee 23.6 deg). The near dumbbell, inside the Mistake outline,
//   is redrawn as a red dashed guide. Tells: `long` at the Mistake toe (c25), `short` at the Mistake knee (c8).
//  The start dumbbells are redrawn dashed in the end view (the start layer drops moving equipment, D-LIB22-DRAW).
// Unsourced numbers (SIZES; lb10/sizes.json holds each with its basis): FOOT_X, KNEE_SOFT, SCAP_ELEV, SCAP_PRO,
//  STRIDE, M_STRIDE, VIA_LIFT, BODY_KG, DB_SHARE; solved: DB_KG.
import { landmarksOf, resolve, normPose } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ FOOT_X: 0.0875, KNEE_SOFT: 15, SCAP_ELEV: -1, SCAP_PRO: -1, STRIDE: 0.35, M_STRIDE: 0.70, VIA_LIFT: 0.025, BODY_KG: 75, DB_SHARE: 0.25 });
const { FOOT_X, KNEE_SOFT, SCAP_ELEV, SCAP_PRO, STRIDE, M_STRIDE, VIA_LIFT, BODY_KG, DB_SHARE } = SIZES;
// c18 'approximately 25% of your body weight in each hand', on the BODY_KG figure.
export const DB_KG = DB_SHARE * BODY_KG;

// Newton with finite differences (plank.mjs, mountain_climbers.mjs @ dcac4a38); throws if it does not converge.
function solve(p0, make, res, what, iters = 40) {
  const keys = Object.keys(p0), p = { ...p0 };
  const f = q => { const pose = make(q); return res(landmarksOf(pose, H), pose); };
  for (let it = 0; it < iters; it++) {
    const r = f(p); if (Math.hypot(...r) < 1e-7) return p;
    const J = keys.map(k => { const d = 1e-5, q = { ...p, [k]: p[k] + d }; return f(q).map((v, i) => (v - r[i]) / d); });
    const n = keys.length, A = Array.from({ length: n }, (_, i) => [...keys.map((_, j) => J[j][i]), -r[i]]);
    for (let c = 0; c < n; c++) {
      let m = c; for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[m][c])) m = i;
      [A[c], A[m]] = [A[m], A[c]];
      for (let i = 0; i < n; i++) if (i !== c) { const k = A[i][c] / A[c][c]; for (let j = c; j <= n; j++) A[i][j] -= k * A[c][j]; }
    }
    // damped: halve the step until the residual shrinks (a full step can leave a leg's reach)
    const step = keys.map((_, i) => A[i][n] / A[i][i]), r0 = Math.hypot(...r);
    for (let h = 1; h > 1e-4; h /= 2) {
      const q = { ...p }; keys.forEach((k, i) => { q[k] += h * step[i]; });
      const rq = Math.hypot(...f(q)); if (rq < r0) { Object.assign(p, q); break; }
    }
  }
  if (!(Math.hypot(...f(p)) <= 1e-5)) throw new Error(`farmer_s_carry: no solution for ${what}`);
  return p;
}
const mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
/** Winter (2009) whole-body centre of mass on the drawn landmarks (single_leg_romanian_deadlift.mjs:19-36 @ dcac4a38). */
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
/** The centre of mass's z with both dumbbells at the grips (c18's load in each hand). */
export const comWith = lm => (com(lm)[2] * BODY_KG + (lm['grip.l'][2] + lm['grip.r'][2]) * DB_KG) / (BODY_KG + 2 * DB_KG);
export const kneeOf = (lm, s) => {
  const a = [0, 1, 2].map(i => lm[`hip.${s}`][i] - lm[`knee.${s}`][i]), b = [0, 1, 2].map(i => lm[`ankle.${s}`][i] - lm[`knee.${s}`][i]);
  return 180 - Math.acos(Math.max(-1, Math.min(1, (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)))) / R;
};
const flat = (x, z, y = 0) => ({ at: [x, y, z] });
// The rigid foot on its ball, heel-up th deg (reverse_lunge.mjs:57-61 @ dcac4a38): lifted so the toe pad just touches
// the floor. The far (stance) foot's ball stays on its start spot in every pose; th 0 is the flat start foot.
const BALL_Z = (0.080 - 0.044) * H;   // the ball in front of the mid-sole (body.mjs REF.ball, REF.mid)
const onBall = (x, z, th) => {
  const sT = Math.sin(th * R), cT = Math.cos(th * R);
  const lift = -Math.min(...[[0.112, -0.036], [0.120, -0.028], [0.100, -0.038]].map(([fz, fy]) => ((fz - 0.080) * -sT + (fy + 0.039) * cT) * H));
  return { at: [x, lift, z], normal: [0, cT, sT], toe: [0, -sT, cT], ref: 'ball' };
};
const body = (q, nearZ, nearY = 0) => ({ root: { at: [0, q.y, q.z], tilt: 0 }, trunk: 0, neck: 0, scap: { elev: SCAP_ELEV, pro: SCAP_PRO },
  shoulder: { flex: 0 }, elbow: 0, wrist: 0, plant: { l: q.th ? onBall(FOOT_X, BALL_Z, q.th) : flat(FOOT_X, 0), r: flat(-FOOT_X, nearZ, nearY) } });
// Start (c3 feet side by side; c6 knees soft): the knees KNEE_SOFT, the centre of mass over the mid-soles.
const QS = solve({ y: 0.92, z: -0.03 }, q => body(q, 0), lm => [kneeOf(lm, 'r') - KNEE_SOFT, comWith(lm)], 'the start');
export const ankleOf = (p, s) => resolve(normPose(p, { height: H }), { height: H }).q.ankle[s];
const ANK0 = ankleOf(body(QS, 0), 'l');
// A step of length d (c8): the near foot flat d ahead; the far (stance) leg keeps its start knee (KNEE_SOFT, c6) and
// ankle and rolls onto its ball (heel-up th, solved), so the heel rises instead of the ankle bending further; the centre
// of mass midway between the near mid-sole and the far ball (the two contacts). The near knee follows (tested soft).
const stepAt = (d, guess) => solve(guess, q => body(q, d), (lm, p) => [kneeOf(lm, 'l') - KNEE_SOFT, ankleOf(p, 'l') - ANK0, comWith(lm) - (d + BALL_Z) / 2], `the step ${d}`);
const QE = stepAt(STRIDE, { y: QS.y - 0.01, z: QS.z + STRIDE / 2, th: 15 });
const QM = stepAt(M_STRIDE, { y: QS.y - 0.04, z: QS.z + M_STRIDE / 2, th: 22 });
const start = body(QS, 0), end = body(QE, STRIDE);
const mistake = body(QM, M_STRIDE);
// Via (the one ghost): mid-swing, the near foot half way and VIA_LIFT up, the root and the far heel half way.
const via = [body({ y: (QS.y + QE.y) / 2, z: (QS.z + QE.z) / 2, th: QE.th / 2 }, STRIDE / 2, VIA_LIFT)];

// Dumbbells in both fists, neutral grip (handle front-to-back, reverse_lunge.mjs:104-108 @ dcac4a38): one entry each.
// The engine dumbbell (equipment.mjs:30-40: handle 13 cm, drawn 1.6 cm thick; hex heads 11.9 cm across the corners,
// 7 cm long) is scaled by DB_SCALE (heads only, the handle stays the hand's width) so its cast-iron mass (7200 kg/m3,
// as eq/kettlebell.mjs) equals DB_KG, the mass the balance uses (#305 6359365488 item 5).
const dbMass = k => 7200 * (2 * (3 * Math.sqrt(3) / 2) * (0.119 * k / 2) ** 2 * 0.07 * k + Math.PI * 0.008 ** 2 * 0.14);
export const DB_SCALE = (() => { let a = 0.5, b = 3; for (let i = 0; i < 80; i++) { const c = (a + b) / 2; if (dbMass(c) < DB_KG) a = c; else b = c; } return (a + b) / 2; })();
const DB = { handle: 0.13, headLen: 0.07 * DB_SCALE, head: 0.119 * DB_SCALE, hh: 0.119 * DB_SCALE * 0.866 / 2, ht: 0.016 };
export const DB_DRAWN_KG = dbMass(DB_SCALE);
const bells = lm => [
  { type: 'dumbbell', at: lm['grip.l'], axis: [0, 0, 1], head: DB.head, headLen: DB.headLen, z: 'back', part: 'db' },
  { type: 'dumbbell', at: lm['grip.r'], axis: [0, 0, 1], head: DB.head, headLen: DB.headLen, z: 'front', part: 'db' },
];
// Its outline as world points, for the dashed start phantom.
const dbOutline = g => {
  const [x, y, z] = g, P = (dz, dy) => [x, y + dy, z + dz], a = DB.handle / 2, b = a + DB.headLen;
  return [
    [P(-b, DB.hh), P(-a, DB.hh), P(-a, DB.ht / 2), P(a, DB.ht / 2), P(a, DB.hh), P(b, DB.hh), P(b, -DB.hh), P(a, -DB.hh), P(a, -DB.ht / 2), P(-a, -DB.ht / 2), P(-a, -DB.hh), P(-b, -DB.hh), P(-b, DB.hh)],
  ];
};
const LS = landmarksOf(start, H);
const START_DB = ['l', 'r'].flatMap(s => dbOutline(LS[`grip.${s}`]).map(pts => ({ type: 'line', cls: 'eq-line m-line', pts, z: s === 'l' ? 'back' : 'front', part: 'startdb' })));

const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  id: 'farmer_s_carry', name: "Farmer's Carry", view: 'side', facing: 'right',
  camera: { x0: 120, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.45, to: 1.15 },
    lm => bells(lm)[0],
    lm => bells(lm)[1],
    ...START_DB.map(it => (lm, ctx) => (ctx.pose === 'end' ? it : null)),
  ],
  checks: [
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: LS[landmark], pose: 'start', tol: 0.5 })),   // c3 fact: each hand on its dumbbell
    ...['heel.r', 'ball.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'all', tol: 0.5 })),   // the near foot flat where it lands
    ...['heel.l', 'ball.l'].map(landmark => ({ landmark, plane: FLOOR, pose: 'start', tol: 0.5 })),   // c3: feet side by side, flat
    ...['end', 'mistake'].flatMap(pose => [
      { landmark: 'toe.l', plane: FLOOR, pose, tol: 1 },                                              // the far foot on its toes
      { landmark: 'heel.l', above: { point: [0, 0.03, 0], normal: [0, 1, 0] }, pose, tol: 0 },          // its heel up
    ]),
  ],
  ghosts: { count: 1, parts: ['leg.r'] },
  trace: { point: 'ball.r', trim: [10, 12] },
  callouts: [
    { key: 'torso', text: 'Tall torso', anchor: 'chest', box: { left: 184, top: 120 }, cue: 'Torso upright and chest tall, gaze ahead.' },
    { key: 'shoulders', text: 'Shoulders down', anchor: 'backUpper', box: { left: 16, top: 48 }, cue: 'Shoulders back and down, not shrugged.' },
    { key: 'arms', text: 'Arms long', anchor: { at: 'elbow.r', off: [-6, 0] }, box: { left: 16, top: 156 }, cue: 'Arms fully extended at your sides.' },
  ],
  mistake: {
    pose: mistake,
    // the near dumbbell moves with the Mistake body and lies inside its outline (masked there), so it is redrawn as a
    // red dashed guide on top (D-LIB22-IMPLEMENT)
    guides: dbOutline(landmarksOf(mistake, H)['grip.r']).map(pts => ({ kind: 'dashed', pts })),
    tells: [
      { key: 'long', text: 'Steps too long', anchor: { at: 'toe.r', pose: 'mistake' }, box: { left: 224, top: 280 }, cue: 'A regular-sized step, too long for a beginner.' },
      { key: 'short', text: 'Long stride', anchor: { at: 'knee.r', pose: 'mistake', off: [7, 0] }, box: { left: 224, top: 232 }, cue: 'The stride reaches past a short, deliberate step.' },
    ],
  },
  alt: "Farmer's carry, side view. Standing tall with a dumbbell in each hand, arms long at the sides and shoulders back and down, the near foot takes one short step forward.",
};
export const info = { QS, QE, QM, DB_KG, pose: Object.fromEntries([['start', start], ['end', end], ['mistake', mistake]].map(([k, p]) => { const lm = landmarksOf(p, H);
  return [k, { body: +com(lm)[2].toFixed(3), withDb: +comWith(lm).toFixed(3), kneeL: +kneeOf(lm, 'l').toFixed(1), kneeR: +kneeOf(lm, 'r').toFixed(1), heelL: +lm['heel.l'][2].toFixed(3), toeL: +lm['toe.l'][2].toFixed(3), heelR: +lm['heel.r'][2].toFixed(3), toeR: +lm['toe.r'][2].toFixed(3), hipY: +lm.hips[1].toFixed(3) }]; })) };
