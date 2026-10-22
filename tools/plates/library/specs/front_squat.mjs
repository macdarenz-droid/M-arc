// Front squat, side view, figure facing screen right. LIB-14 (LB4, mode H: D-LIB14-MODES; card parent and census closest
// barbell_back_squat, the 8).
// View: side (card plate.view = census view). The elbows dropping and the chest falling forward (c7), the upright torso
// (c1, c17) and the bar's height on the shoulders read from the side.
// Sources: research card docs/research/howto/cards/front_squat.json (research head 3812989f): callouts =
//  plate.checkpoints (c7 Elbows high, c12 Chest tall, c10 Whole foot); Mistake = plate.mistake (c7, drawable). Tempo:
//  none (the card gives no seconds; held under D-LIB14-NOSECS, so the spec carries no tempo).
// Clone source: barbell_back_squat (tools/plates/vendor/exercises/barbell_back_squat.mjs on main 5158609c): the feet,
//  the bar spot moving rigidly with the thorax (an affine combination of three thorax landmarks), the key() solve that
//  keeps the bar over mid-foot, the plate outline behind the body with the sleeve dot in front, and the dashed start bar
//  dot; copied, never imported (D-LIB9-CLONE).
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Feet: mid-soles 38 cm apart (heels about hip width or a little wider, c8), toes out 20 deg (c8: 15-30; the side view
//   cannot show it), knees tracking the toes (IK pole = toe line).
//  Bar (c2, c3): the front rack, in the channel between the throat and the top of the shoulders: the bar centre sits
//   BAR_T in the standing thorax frame (its underside level with the shoulder tops, just in front of the throat), so it
//   moves with the thorax; a `checks` plane per pose through the bar's underside, square to the thorax, holds the
//   shoulder top on it (c3: the shoulders hold the bar; the contact fact).
//  Arms (c4, c7): hands on the bar just outside the shoulders (GRIP_X), the elbows driven forward and up (IK pole
//   forward and up, the wrists bent back WRIST), so the upper arms sit near level; the hands only steady the bar (c3).
//  Start: standing tall, knees 5 deg soft, trunk 3 deg forward. End (c10-c12): the hip joint centre DEPTH below the knee
//   centre (hip crease below the top of the knee, c11), trunk END_INCL from vertical (torso upright, c12), whole foot
//   down; the hip height is SOLVED (bracket) for the depth, the root z for the bar over mid-foot.
//  Rack (c14, c26): a squat stand's upright one step in front of the lifter (walked out one step back, c26; vendor
//   rackUpright, no J-hook: its side-view hook points away from the lifter), and its spotter arm running back past the lifter (eq/parts
//   sideBar), its top SAFETY_DROP below the bar's underside at the bottom ("just below your lowest depth", c14).
//  Camera: PXM 128 px/m (inside the 8's 123.9-146.3) so the labels fit beside the upright.
//  Mistake (c7, out of the bottom): the elbows drop (IK pole down) and the chest falls forward, the thorax M_INCL
//   from vertical, so the bar travels forward of mid-foot (fsInfo.mBarZ); the hips rise out of the hole by the least
//   amount (SOLVED) that keeps the bar M_CLEAR above the spotter arm.
// Unsourced numbers: BAR_T (the rack spot), GRIP_X 0.25, the elbow pole, WRIST -70 (the card lists the wrist angle
//  as unsourced), START (knee 5, trunk 3), DEPTH 0.03 m,
//  END_INCL 22 (the card gives no torso angle), the stand's 2.3 m upright 0.55 m in front of mid-foot and its 5 cm spotter arm
//  reaching 0.5 m behind,
//  SAFETY_DROP 0.05 m (c14 "just below"), the 45 cm plate, M_INCL 45 (the Mistake magnitude, illustrative), M_CLEAR 0.02 m.
import { bodyShapes, fk, landmarksOf, normPose, resolve } from '../engine.mjs';
import { sideBar } from '../eq/parts.mjs';

const H = 1.75, R = Math.PI / 180, B = { height: H };
const FOOT_X = 0.19, TOE_OUT = 20, GRIP_X = 0.25;
const BAR_R = 0.014;                                      // the 28 mm shaft
// Bar centre in the standing thorax frame (H), the front rack: its underside level with the shoulder tops (the shelf
// the shrugged shoulders make, c3), just in front of the throat (c2).
const BAR_T = [0, 0.830 + BAR_R / H, 0.045];
const DEPTH = 0.03, END_INCL = 22, M_INCL = 45, M_CLEAR = 0.02;
const RACK = { at: 0.55, back: -0.5, t: 0.05 }, SAFETY_DROP = 0.05;
const PXM = 128, X0 = 150;                                 // camera: scale inside the 8's range (F1), the stand's upright clear of the labels

const toe = s => [s * Math.sin(TOE_OUT * R), 0, Math.cos(TOE_OUT * R)];
const feet = { l: { at: [FOOT_X, 0, 0], toe: toe(1) }, r: { at: [-FOOT_X, 0, 0], toe: toe(-1) } };

// Bar spot: affine combination of three thorax landmarks (neck pivot, backUpper, sternum) with known standing-frame
// coordinates (copied from the 8's squat), so it moves rigidly with the thorax.
const REFP = { neck: [0.855, -0.02], backUpper: [0.75, -0.072], sternum: [0.80, 0.07] };
const W = (() => {
  const [a, b, c] = [REFP.neck, REFP.backUpper, REFP.sternum];
  const M = [[a[0] - c[0], b[0] - c[0]], [a[1] - c[1], b[1] - c[1]]], v = [BAR_T[1] - c[0], BAR_T[2] - c[1]];
  const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
  const wa = (v[0] * M[1][1] - M[0][1] * v[1]) / det, wb = (M[0][0] * v[1] - v[0] * M[1][0]) / det;
  return { neck: wa, backUpper: wb, sternum: 1 - wa - wb };
})();
const barOf = lm => [0, 1, 2].map(i => W.neck * lm.neck[i] + W.backUpper * lm.backUpper[i] + W.sternum * lm.sternum[i]).map((v, i) => i === 0 ? 0 : v);

const hands = (bar, pole) => ({
  l: { at: [GRIP_X, bar[1], bar[2]], pole: [pole[0], pole[1], pole[2]] },
  r: { at: [-GRIP_X, bar[1], bar[2]], pole: [-pole[0], pole[1], pole[2]] },
});
const LOW = [0.3, -1, 0.25];                              // the Mistake's elbow pole: down
const WRIST = -70;                                        // wrists bent back under the bar (front rack; unsourced)
// Bracketed root finder (Illinois regula falsi; copied from single_leg_romanian_deadlift, #109): throws on a bracket
// with no root (D-LIB9-CLONE).
export const solve = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`front_squat: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-8; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};

// Key pose from hip height (m), thorax inclination (deg from vertical), bar z (0 = over mid-foot), neck and the lumbar
// part of the inclination (spine, deg).
function key(hipY, incl, barZ = 0, neck = 0, spine = 0, extra = {}) {
  const pose = { root: { at: [0, hipY, 0], tilt: incl - spine }, trunk: spine, neck, wrist: WRIST, plant: feet, ...extra };
  const b = barOf(landmarksOf(pose, H));
  pose.root.at = [0, hipY, barZ - b[2]];
  // Elbows high (c4, c7): the elbow pole's rise SOLVED (bracket 0..1.5) so the near upper arm is level, elbow at
  // shoulder height.
  const withPole = py => ({ ...pose, reach: hands([0, b[1], barZ], [0, py, 1]) });
  const py = solve(v => { const l = landmarksOf(withPole(v), H); return l['elbow.r'][1] - l['shoulder.r'][1]; }, 0, 1.5);
  return withPole(py);
}
const pole = (s, a) => [s * Math.sin(a * R), 0, Math.cos(a * R)];
const feetStart = { l: { ...feet.l, pole: pole(1, 14) }, r: { ...feet.r, pole: pole(-1, 14) } };
const kneeR = p => resolve(normPose(p, B), B).q.knee.r;
const START_Y = solve(y => kneeR(key(y, 3, 0, 0, 0, { plant: feetStart })) - 5, 0.80, 0.94);
const start = key(START_Y, 3, 0, 0, 0, { plant: feetStart });
// End: the hip height SOLVED (bracket 0.25..0.6 m) so the hip joint centre is DEPTH below the knee centre (c11).
const depthAt = y => { const l = landmarksOf(key(y, END_INCL, 0, -4, 4), H); return l['hip.r'][1] - (l['knee.r'][1] - DEPTH); };
export const END_Y = solve(depthAt, 0.25, 0.6);
const end = key(END_Y, END_INCL, 0, -4, 4);
const via = [key(START_Y + (END_Y - START_Y) / 3, 8, 0, -1, 1), key(START_Y + 2 * (END_Y - START_Y) / 3, 15, 0, -3, 3)];
// Mistake (c7, "elbows stay up out of the bottom"): coming out of the bottom the elbows drop (pole down) and the chest
// falls forward, the thorax M_INCL from vertical, so the bar, riding on the shoulders, travels forward of mid-foot. The
// hips rise straight up out of the hole by the least amount (SOLVED, bracket 0..0.25 m) that keeps the bar's underside
// M_CLEAR above the spotter arm: the bar never passes through the set safety.
const SAFETY_TOP = barOf(landmarksOf(end, H))[1] - BAR_R - SAFETY_DROP;
const mBody = rise => ({ root: { at: [end.root.at[0], end.root.at[1] + rise, end.root.at[2]], tilt: M_INCL - 10 }, trunk: 10, neck: -10, wrist: WRIST, plant: feet });
export const M_RISE = solve(rise => barOf(landmarksOf(mBody(rise), H))[1] - BAR_R - (SAFETY_TOP + M_CLEAR), 0, 0.25);
const ME = mBody(M_RISE);
const M_BAR = barOf(landmarksOf(ME, H));
const mistakeFull = { ...ME, reach: hands(M_BAR, LOW) };
const mistakePose = { root: mistakeFull.root, trunk: mistakeFull.trunk, neck: mistakeFull.neck, reach: mistakeFull.reach };

// The engine masks the Mistake outline inside the faulty body, so the faulty upper body (head, torso and the dropped
// near arm: their outer outline only) is traced as dashed guides, which the engine draws above every figure (as
// one_arm_dumbbell_row's, #274 @ a6f4bd07; copied).
const CAM = { view: 'side', near: 'r', facing: 'right', pxm: PXM, P: w => [X0 + w[2] * PXM, 339 - w[1] * PXM] };
const toW = ([x, y]) => [0, (339 - y) / PXM, (x - X0) / PXM];
const inPoly = (poly, [x, y]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
const ARM_KEYS = ['head', 'torso', 'shcap.r', 'upper.r', 'elbowcap.r', 'fore.r', 'fist.r'];
export const MIST_ARM = (() => {
  const pose = { ...end, ...mistakePose };
  const shapes = bodyShapes(fk(resolve(normPose(pose, B), B).q, B), CAM).filter(x => ARM_KEYS.includes(x.key) && x.poly);
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
const LE = landmarksOf(end, H), END_BAR = barOf(LE);
const SAFETY_Y = SAFETY_TOP - RACK.t / 2;
// The plate is an outline behind the body; the sleeve dot is drawn on top (as the 8's squat).
const barItem = lm => [
  { type: 'barbell', at: barOf(lm), plates: [0.045], part: 'bar', z: 'back' },
  { type: 'pulley', at: barOf(lm), r: 0.025, part: 'bar', z: 'front' },
];
// Start bar dot, dashed (the start layer never draws moving equipment; as the 8's squat).
const START_BAR = barOf(landmarksOf(start, H));
const START_DOT = Array.from({ length: 17 }, (_, k) => [0, START_BAR[1] + 0.025 * Math.sin(k * Math.PI / 8), START_BAR[2] + 0.025 * Math.cos(k * Math.PI / 8)]);
export const fsInfo = { mRise: M_RISE, mBarZ: M_BAR[2], endY: END_Y, bar: END_BAR, safetyTop: SAFETY_Y + RACK.t / 2, startBar: START_BAR };

const floor = { point: [0, 0, 0], normal: [0, 1, 0] };
// The shelf plane in one pose: through the bar's underside, its normal the thorax's up (shoulder joint to shoulder top).
const shelf = pose => {
  const l = landmarksOf(pose === 'start' ? start : end, H), b = barOf(l), u = [0, 1, 2].map(i => l['shoulderTop.r'][i] - l['shoulder.r'][i]);
  const L = Math.hypot(...u), n = u.map(v => v / L);
  return { landmark: 'shoulderTop.r', plane: { point: b.map((v, i) => v - n[i] * BAR_R), normal: n }, pose, tol: 0.5 };
};
export default {
  id: 'front_squat', name: 'Front Squat', view: 'side', facing: 'right',
  camera: { pxPerM: PXM, x0: X0, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.75, to: 0.75 },
    { type: 'rackUpright', at: [0, 0, RACK.at], z: 'back' },
    sideBar([0, SAFETY_Y, RACK.back], [0, SAFETY_Y, RACK.at], RACK.t, { z: 'back' }),
    lm => barItem(lm),
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: START_DOT, z: 'front', part: 'startbar' } : null),
  ],
  checks: [
    { landmark: 'heel.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: floor, pose: 'all', tol: 0.5 },
    shelf('start'), shelf('end'),                        // c3: the bar on the shoulder shelf
  ],
  startParts: ['trunk', 'leg.r'],
  ghosts: { count: 2, parts: ['trunk', 'leg.r'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  datum: [{ x: [0, 0, 0], from: 349, to: 60 }],
  callouts: [
    { key: 'elbows', text: 'Elbows high', anchor: 'elbow.r', box: { left: 236, top: 186 }, cue: 'Keep your elbows up so your shoulders hold the bar.' },
    { key: 'chest', text: 'Chest tall', anchor: 'backUpper', cue: 'Keep your torso upright on the way down and up.' },
    { key: 'foot', text: 'Whole foot', anchor: 'heel.r', cue: 'Stay balanced over the whole foot, knees in line with your feet.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: [
      ...MIST_ARM.map(pts => ({ kind: 'dashed', pts })),
      { kind: 'dashed', pts: [{ at: 'grip.r', pose: 'mistake', off: [0, 6] }, [0, 0, M_BAR[2]]] },
    ],
    tells: [
      { key: 'elbows', text: 'Elbows drop', anchor: { at: 'elbow.r', pose: 'mistake' }, box: { left: 236, top: 296 }, cue: 'The elbows drop and the bar starts to slip.' },
      { key: 'chest', text: 'Chest falls<br>forward', anchor: { at: 'chest', pose: 'mistake' }, box: { left: 236, top: 236 }, cue: 'The chest falls and the torso tips forward.' },
      { key: 'bar', text: 'Bar rolls<br>forward', anchor: { at: 'grip.r', pose: 'mistake' }, box: { left: 236, top: 168 }, cue: 'The bar rolls forward off the shoulders.' },
    ],
  },
  alt: 'Front squat, side view. The bar rests on the front of the shoulders with the elbows high, in a rack with safety bars set just below the bottom. The lifter sits straight down until the hips are below the knees, torso upright and the whole foot flat.',
};
