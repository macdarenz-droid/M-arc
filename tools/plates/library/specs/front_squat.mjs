// Front squat, side view, figure facing screen right. LIB-14 (LB4, mode H: D-LIB14-MODES; card parent and census closest
// barbell_back_squat, the 8).
// View: side (card plate.view = census view). The elbows dropping and the chest falling forward (c7), the upright torso
// (c1, c17) and the bar's height on the shoulders read from the side.
// Sources: research card docs/research/howto/cards/front_squat.json (research head 3812989f): callouts =
//  plate.checkpoints (c7 Elbows high, c12 Chest tall, c10 Whole foot); Mistake = plate.mistake (c7, drawable). Tempo:
//  the card's, tempoOf(strip/rows.json) (D-STRIP-B; c21 'Controlled descent' on Lower, Drive up blank; no seconds).
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
//  Arms (c3-c5, c7): the fingertip rack (c3: "a fingertip rack position is preferable"; c5). Open hands (flat palm),
//   wrists bent WRIST, the bar across the fingers FINGER of the way from the wrist to the fingertips at GRIP_X either
//   side of the midline (rackHands, solved); the elbows forward, out and up (pole HIGH), each bent about 145 deg (the
//   8's back squat 147) and in front of its shoulder; a `checks` plane per pose holds each near hand on the bar,
//   measured at the wrist (c4, the contact fact). The hands only steady the bar (c3).
//  Start: standing tall, knees 5 deg soft, trunk 3 deg forward. End (c10-c12): the hip joint centre DEPTH below the knee
//   centre (hip crease below the top of the knee, c11), trunk END_INCL from vertical (torso upright, c12), whole foot
//   down; the hip height is SOLVED (bracket) for the depth, the root z for the bar over mid-foot.
//  Rack (c14, c26): a squat stand's upright one step in front of the lifter (walked out one step back, c26; vendor
//   rackUpright, no J-hook: its side-view hook points away from the lifter), and its spotter arm running back past the lifter (eq/parts
//   sideBar), its top SAFETY_DROP below the bar's underside at the bottom ("just below your lowest depth", c14).
//  Camera: PXM 128 px/m (inside the 8's 123.9-146.3) so the labels fit beside the upright.
//  Mistake (c7, out of the bottom): the elbows drop (IK pole down) and the chest falls forward with the hips where
//   they were: the thorax inclination SOLVED as the furthest the chest can fall before the bar comes within M_CLEAR of
//   the spotter arm (fsInfo.mIncl, about 28 deg against 22), so no part the card does not name moves. The faulty upper
//   body is traced as dashed guides. The bar's own forward drift (fsInfo.mBarZ, about 3 cm) is too small to point at,
//   so no bar tell is drawn.
// Unsourced numbers: BAR_T (the rack spot), GRIP_X 0.14 (the finger contact), FINGER 0.6, WRIST 40, the elbow poles
//  (the card lists the wrist angle as unsourced), START (knee 5, trunk 3), DEPTH 0.03 m, END_INCL 22 (the card gives
//  no torso angle), the stand's 2.3 m upright 0.45 m in front of mid-foot and its 5 cm spotter arm reaching 0.5 m
//  behind, SAFETY_DROP 0.05 m (c14 "just below"), the 45 cm plate, M_CLEAR 0.02 m.
import { bodyShapes, fk, landmarksOf, normPose, resolve, REF, WINTER } from '../engine.mjs';
import { sideBar } from '../eq/parts.mjs';

const H = 1.75, R = Math.PI / 180, B = { height: H };
const FOOT_X = 0.19, TOE_OUT = 20, GRIP_X = 0.14;
const BAR_R = 0.014;                                      // the 28 mm shaft
// Bar centre in the standing thorax frame (H), the front rack: its underside level with the shoulder tops (the shelf
// the shrugged shoulders make, c3), just in front of the throat (c2).
const BAR_T = [0, 0.830 + BAR_R / H, 0.045];
const DEPTH = 0.03, END_INCL = 22, M_CLEAR = 0.02;
const RACK = { at: 0.45, back: -0.5, t: 0.05 }, SAFETY_DROP = 0.05;
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

// Fingertip rack (c3, c5; the panel's slice look 6341498444): open hands (the engine's flat palm), wrists bent WRIST, the
// bar resting across the fingers FINGER of the way from the wrist to the fingertips, at GRIP_X either side of the
// midline; the elbows forward, out and up (pole HIGH), so each elbow bends under 150 deg and sits in front of its
// shoulder. The reach target (the palm's grip point) is SOLVED by damped fixed-point steps so that finger point lies on
// the bar; it throws if it does not land within 0.1 mm.
const HIGH = [0.3, 0.2, 1], LOW = [0.3, -1, 0.25];         // elbow poles: forward-out-up (rack), down (the Mistake)
const WRIST = 40, FINGER = 0.6, K_TIP = WINTER.hand / REF.gripOff;
const fingerOf = (l, s) => l[`wrist.${s}`].map((v, i) => v + FINGER * K_TIP * (l[`grip.${s}`][i] - v));
export function rackHands(pose, bar, pole) {
  const tgt = { l: [GRIP_X, bar[1], bar[2]], r: [-GRIP_X, bar[1], bar[2]] }, G = { l: [...tgt.l], r: [...tgt.r] };
  const at = () => ({ ...pose, reach: { l: { at: G.l, pole: [pole[0], pole[1], pole[2]] }, r: { at: G.r, pole: [-pole[0], pole[1], pole[2]] } } });
  for (let k = 0; k < 400; k++) {
    const l = landmarksOf(at(), H);
    let err = 0;
    for (const s of ['l', 'r']) { const F = fingerOf(l, s); G[s] = G[s].map((v, i) => v + 0.2 * (tgt[s][i] - F[i])); err = Math.max(err, Math.hypot(...F.map((v, i) => v - tgt[s][i]))); }
    if (err < 1e-4) return at().reach;
  }
  throw new Error('front_squat: the fingertip rack does not reach the bar');
}
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
  return { ...pose, reach: rackHands(pose, [0, b[1], barZ], HIGH) };
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
// Mistake (c7, "elbows stay up out of the bottom"): the elbows drop (pole down) and the chest falls forward with the
// hips where they were (the end root), so the bar, riding on the shoulders, travels forward of mid-foot and down. The
// thorax inclination is SOLVED (bracket END_INCL..70 deg) as the furthest the chest can fall before the bar's underside
// comes within M_CLEAR of the spotter arm: no hip rise or other part the card does not name (slice look item 3).
const SAFETY_TOP = barOf(landmarksOf(end, H))[1] - BAR_R - SAFETY_DROP;
const mBody = incl => ({ root: { at: end.root.at, tilt: incl - 10 }, trunk: 10, neck: -10, wrist: WRIST, plant: feet });
export const M_INCL = solve(incl => barOf(landmarksOf(mBody(incl), H))[1] - BAR_R - (SAFETY_TOP + M_CLEAR), END_INCL, 70);
const ME = mBody(M_INCL);
const M_BAR = barOf(landmarksOf(ME, H));
const mistakeFull = { ...ME, reach: rackHands(ME, M_BAR, LOW) };
const mistakePose = { root: mistakeFull.root, trunk: mistakeFull.trunk, neck: mistakeFull.neck, reach: mistakeFull.reach };

// The engine masks the Mistake outline inside the faulty body, so the faulty upper body (head, torso and the dropped
// near arm: their outer outline only) is traced as dashed guides, which the engine draws above every figure (as
// one_arm_dumbbell_row's, #274 @ a6f4bd07; copied).
const CAM = { view: 'side', near: 'r', facing: 'right', pxm: PXM, P: w => [X0 + w[2] * PXM, 339 - w[1] * PXM] };
const toW = ([x, y]) => [0, (339 - y) / PXM, (x - X0) / PXM];
const inPoly = (poly, [x, y]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
// Panel lb4p item 2: only head, torso and shoulder cap are traced as one union outline; the dropped near arm is drawn
// as its own capsules (upper arm, elbow cap, forearm, hand: the plate's own arm outlines in the Mistake pose, so its
// segment lengths are the plate's), with a dashed elbow joint circle and an arrow from the solid elbow to the dropped one.
const ARM_KEYS = ['head', 'torso', 'shcap.r'];
const DROP_KEYS = ['upper.r', 'elbowcap.r', 'fore.r', 'fist.r'];
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
// The copy is the end pose's drawn arm (its outlines at the plate's camera, so every drawn length is the plate's),
// moved to the faulty shoulder and rotated in the picture plane about it until the upper arm points at the Mistake
// pose's elbow (the ruled drop); the forearm and hand keep their fold.
const LEp = landmarksOf(end, H), LMp = landmarksOf({ ...end, ...mistakePose }, H);
const [ES, EE, MS, MEl] = [LEp['shoulder.r'], LEp['elbow.r'], LMp['shoulder.r'], LMp['elbow.r']].map(CAM.P);
export const DROP_ANGLE = Math.atan2(MEl[1] - MS[1], MEl[0] - MS[0]) - Math.atan2(EE[1] - ES[1], EE[0] - ES[0]);
const rot = ([x, y]) => { const u = x - ES[0], v = y - ES[1], c = Math.cos(DROP_ANGLE), s = Math.sin(DROP_ANGLE); return [MS[0] + u * c - v * s, MS[1] + u * s + v * c]; };
export const DROP_ARM = bodyShapes(fk(resolve(normPose(end, B), B).q, B), CAM).filter(x => DROP_KEYS.includes(x.key) && x.poly).map(x => [...x.poly, x.poly[0]].map(rot).map(toW));
export const DROP_ELBOW = rot(EE);                                  // the dropped elbow, px
export const ARROW_OFF = [12, 3];                                   // px: the arrow runs beside the drop, clear of the end figure
const JOINT_R = 2.25;                                               // the engine's joint mark radius, px
export const DROP_JOINT = Array.from({ length: 13 }, (_, k) => toW([DROP_ELBOW[0] + JOINT_R * Math.cos(k * Math.PI / 6), DROP_ELBOW[1] + JOINT_R * Math.sin(k * Math.PI / 6)]));
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
export const fsInfo = { mIncl: M_INCL, mBarZ: M_BAR[2], endY: END_Y, bar: END_BAR, safetyTop: SAFETY_Y + RACK.t / 2, startBar: START_BAR };

const floor = { point: [0, 0, 0], normal: [0, 1, 0] };
// The shelf plane in one pose: through the bar's underside, its normal the thorax's up (shoulder joint to shoulder top).
const shelf = (pose, s = 'r') => {
  const l = landmarksOf(pose === 'start' ? start : end, H), b = barOf(l), u = [0, 1, 2].map(i => l[`shoulderTop.${s}`][i] - l[`shoulder.${s}`][i]);
  const L = Math.hypot(...u), n = u.map(v => v / L);
  return { landmark: `shoulderTop.${s}`, plane: { point: b.map((v, i) => v - n[i] * BAR_R), normal: n }, pose, tol: 0.5 };
};
// The hand on the bar, checked at the wrist (c4): the plane square to the hand (wrist to grip) through the wrist spot
// that puts the finger point FINGER of the way to the fingertips on the bar.
const onBar = (pose, s = 'r') => {
  const l = landmarksOf(pose === 'start' ? start : end, H), b = barOf(l), d = [0, 1, 2].map(i => l[`grip.${s}`][i] - l[`wrist.${s}`][i]);
  const L = Math.hypot(...d), n = d.map(v => v / L), spot = [s === 'r' ? -GRIP_X : GRIP_X, b[1], b[2]].map((v, i) => v - FINGER * K_TIP * d[i]);
  return { landmark: `wrist.${s}`, plane: { point: spot, normal: n }, pose, tol: 0.5 };
};
export default {
  id: 'front_squat', name: 'Front Squat', view: 'side', facing: 'right',
  hand: 'flat',
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
    onBar('start'), onBar('end'),                        // c4: the hands on the bar (fingertip rack, checked at the wrist)
    shelf('start', 'l'), shelf('end', 'l'), onBar('start', 'l'),   // the far side of the same (c3, c4; cflb4s, #289 6537412975)
  ],
  startParts: ['trunk', 'leg.r'],
  ghosts: { count: 2, parts: ['trunk', 'leg.r'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  datum: [{ x: [0, 0, 0], from: 349, to: 60 }],
  callouts: [
    { key: 'elbows', text: 'Elbows high', anchor: 'elbow.r', box: { left: 222, top: 190 }, cue: 'Keep your elbows up so your shoulders hold the bar.' },
    // panel lb4p item 1: the leader ends on the chest front just under the rack arm; the label under ELBOWS HIGH.
    { key: 'chest', text: 'Chest tall', anchor: 'chest', box: { left: 222, top: 242 }, cue: 'Keep your torso upright on the way down and up.' },
    { key: 'foot', text: 'Whole foot', anchor: 'heel.r', cue: 'Stay balanced over the whole foot, knees in line with your feet.' },
  ],
  tempo: [{ phase: 'Lower', move: true, word: 'Controlled' }, { phase: 'Drive up', move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      ...MIST_ARM.map(pts => ({ kind: 'dashed', pts })),
      ...DROP_ARM.map(pts => ({ kind: 'dashed', pts })),
      { kind: 'dashed', pts: DROP_JOINT },
      // the drop arrow runs beside the elbow's path, 12 px in front of it, so the solid red clears the end figure by 6 px (A15)
      { kind: 'arrow', from: toW([EE[0] + ARROW_OFF[0], EE[1] + ARROW_OFF[1]]), to: toW([DROP_ELBOW[0] + ARROW_OFF[0], DROP_ELBOW[1] + ARROW_OFF[1] - 4]) },
    ],
    // the elbows tell stays on the Mistake pose's elbow (H3 measures the drop there: 44.6 px); the dashed copy points at it
    tells: [
      { key: 'elbows', text: 'Elbows drop', anchor: { at: 'elbow.r', pose: 'mistake' }, box: { left: 218, top: 288 }, cue: 'The elbows drop and the bar starts to slip.' },
      { key: 'chest', text: 'Chest falls<br>forward', anchor: { at: 'chest', pose: 'mistake' }, box: { left: 218, top: 236 }, cue: 'The chest falls and the torso tips forward.' },
    ],
  },
  alt: 'Front squat, side view. The bar rests on the front of the shoulders with the elbows high, in a rack with safety bars set just below the bottom. The lifter sits straight down until the hips are below the knees, torso upright and the whole foot flat.',
};
