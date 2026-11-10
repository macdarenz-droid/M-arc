// One-arm dumbbell row, side view, figure facing screen right. LIB-13 (LB3, mode H; the support pose-class anchor,
// plan 2.2:159, ruling D-LIB13-SUPPORT; the drawable-fault convention, plan 1:85-88).
// View: side (card plate.view = census view). The flat, level back, the knee-and-hand support and the arm driving back
// to the hip read side-on (c2, c4, c6, c9).
// Sources: research card docs/research/howto/cards/one_arm_dumbbell_row.json (research head 2dd60ae0): callouts =
//  plate.checkpoints (c2 Hand under shoulder, c3 Flat back, c9/c6 Elbow to hip); Mistake = plate.mistake (c10, drawable
//  false: the top fault, excessive momentum, is seen only as speed; the plate draws the next fault on the same list,
//  the short range); tempo = plate.tempo (c14: up 2, down 2, pause 0).
// Clone source: barbell_row (#109 @ 48d49bb) for the held hinge and its solver, dumbbell_biceps_curl (#109 @ 48d49bb)
//  for the engine dumbbell (axis default: the hex end-on in side view, as the curl), plank (#109) for the flat palm
//  (LIB-26); copied, never imported (D-LIB9-CLONE).
// Support (c1, c2, c4): the far (left) knee and the far hand on a flat bench, the near (right) foot on the floor, the
//  near arm working, so the moving arm is the near one.
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Trunk: the back flat (c3): spine 0, head in line. The pelvis tilt is SOLVED (bracket 50-100 deg, see Far arm), so the
//   flat back rises about 20 deg toward the head (LIB-PLATEFIX-4, pf8 T05 R1 c2, c3, #405 6688665575): with the knee
//   under the hip and the hand under the shoulder on one bench, a straight support arm is longer than the thigh, so the
//   back cannot be both level and supported on a straight arm (pf7 c3); c4's "parallel" yields to c2 and c3.
//  Far leg: thigh vertical (hip flex = the pelvis tilt: the knee straight under the hip, c2), knee 90 (the shin along the bench
//   top), ankle -40 (toes off the pad). The root height is SOLVED so the far shin's underside at the knee rests on the
//   bench top (a `checks` plane on knee.l).
//  Far arm (c2): nearly straight, by joint angles (the reach IK bends the elbow at least the palm's wrist offset, about
//   19 deg): the elbow SUP_FLEX, the shoulder flexion SOLVED so the wrist is straight under the shoulder, and the pelvis
//   tilt SOLVED so that wrist sits the forearm's distal radius above the pad (checks); the flat palm (LIB-26
//   `hand.l: 'flat'`) on the bench.
//  Near leg: the foot planted on the floor beside the bench, 3 cm ahead of the hip, 14 cm out (IK; knee nearly straight).
//  Working arm: start (c5): hanging straight down from the shoulder (joint angles: shoulder flexion = the pelvis tilt,
//   so the arm is plumb; elbow 0), the dumbbell under it. End (c6, c9):
//   the elbow bent and driven back, the upper arm close to the body, the dumbbell at the hip: the grip END_DZ behind
//   the shoulder line toward the hip and END_DY below the back. Shoulder blades: 2 cm forward at the bottom, pulled
//   back 4 cm at the top. Wrist bent back 35 deg into the pull grip (the card's recorded convention, R-LB3-5).
//  Mistake (c10, short range, the bottom half: "arm not fully straight at the bottom"; panel fix 2, D-LIB13-PANEL2,
//   D-LIB13-ONEARM-M): at the bottom the arm never straightens: the upper arm M_SWING behind plumb, the elbow bent
//   M_ELBOW (pf8 T05 R5 c3: the elbow about 50 px behind and 77 px below the shoulder at 2x, was D-LIB13-PANEL3's 25 deg;
//   the red elbow and dumbbell clear of the straight support arm and the dumbbell clear of the bottom one); the shoulder
//   blade M_PRO, 1 cm short of the end's pull-back, so the red arm hangs from the drawn (end) shoulder joint (pf8 c2). The red
//   arm and dumbbell are traced as dashed guides on top of the support arm and bench (panel fix 3). The top half (the
//   blade not pulled back) is not drawn: the shoulder joint sits inside the torso outline, so it shows no still sign.
//  Support hand flat on the bench (the engine's flat palm), the wrist angle SOLVED so the palm lies level (R3).
// Unsourced numbers: BENCH_TOP 0.42 m (the low end of the vendor bench's 42-45 cm, so the near leg reaches the floor), the bench length and position, ankle -40, the
//  near foot spot, END_DZ, END_DY, M_SWING 35, M_ELBOW 46, M_PRO -3 cm, SUP_FLEX 5, PRO 2 / -4 cm, WRIST -35 (convention).
import { landmarksOf, RADII, normPose, resolve, fk, bodyShapes } from '../engine.mjs';

const H = 1.75;
const BENCH_TOP = 0.42, SHANK_R = RADII.shank[1] * H;
const WRIST_Y = RADII.fore[2] * H;                       // flat palm: the wrist sits the forearm's distal radius up

const PRO_START = 2, PRO_END = -4, WRIST = -35;
const END_DZ = 0.40, END_DY = 0.28, M_SWING = 35, M_ELBOW = 46, M_PRO = PRO_END + 1, SUP_FLEX = 5;

// Bracketed root finder (Illinois regula falsi): throws when f(a) and f(b) have the same sign (D-LIB9-CLONE b).
export const solve = (f, a, b) => {
  let fa = f(a), fb = f(b), side = 0;
  if (fa * fb > 0) throw new Error(`one_arm_dumbbell_row: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 60 && Math.abs(b - a) > 1e-7; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const body0 = (y, pro, tilt, wl = 90, phi = tilt) => ({ root: { at: [0, y, 0], tilt }, trunk: 0, neck: 0, scap: { l: { pro: 0 }, r: { pro } },
  hip: { l: tilt, r: 0 }, knee: { l: 90, r: 0 }, ankle: { l: -40, r: 0 }, wrist: { l: wl, r: WRIST },
  shoulder: { l: { flex: phi } }, elbow: { l: SUP_FLEX }, plant: { r: { at: [-0.14, 0, 0.03] } } });
// The support arm nearly straight (pf8 T05 R1, #405 6688665575; c2 "hand under shoulder"): with the knee under the hip
// and the hand under the shoulder on one flat bench, the arm is longer than the thigh, so the flat back rises toward the
// head. The far arm is set by joint angles: the elbow bent SUP_FLEX (a soft elbow), the shoulder flexion SOLVED (phiFor,
// bracket tilt +-30 deg) so the wrist sits straight under the shoulder (c2). The pelvis tilt is SOLVED (bracket 50-100
// deg) so that wrist sits the forearm's distal radius over the pad (the flat palm); for each tilt the root height is
// SOLVED so the far shin rests on the bench (rootFor). The spine stays 0 (the back flat, c3) and the far hip flexes the
// same as the tilt, so the far thigh stays vertical (the knee under the hip).
const rootFor = t => solve(y => landmarksOf(body0(y, PRO_START, t), H)['knee.l'][1] - SHANK_R - BENCH_TOP, 0.7, 1.2);
const phiFor = (y, t) => solve(f => { const l = landmarksOf(body0(y, PRO_START, t, 90, f), H); return l['wrist.l'][2] - l['shoulder.l'][2]; }, t - 30, t + 30);
const TILT = solve(t => { const y = rootFor(t); return landmarksOf(body0(y, PRO_START, t, 90, phiFor(y, t)), H)['wrist.l'][1] - BENCH_TOP - WRIST_Y; }, 50, 100);
const ROOT_Y = rootFor(TILT), PHI = phiFor(ROOT_Y, TILT);
const base0 = (y, pro, wl) => body0(y, pro, TILT, wl, PHI);
const S_L = landmarksOf(base0(ROOT_Y, PRO_START), H)['shoulder.l'];
// Palm flat on the bench (panel fix D-LIB13-PANEL1 R3; drawn with the engine's flat palm, spec `hand`): the far
// wrist angle is SOLVED (bracket 0-120 deg) so the hand (wrist -> grip) lies level, pointing forward along the bench.
const handRise = wl => { const l = landmarksOf(base0(ROOT_Y, PRO_START, wl), H); return l['grip.l'][1] - l['wrist.l'][1]; };
const WRIST_L = solve(handRise, 0, 120);
const base = (y, pro) => base0(y, pro, WRIST_L);
const FAR = { shoulder: { flex: PHI }, elbow: SUP_FLEX };
const withArms = (pro, near, pole) => ({ ...base(ROOT_Y, pro), reach: { r: { at: near, pole } } });
// Start (c5): the working arm by joint angles, hanging plumb from the trunk: shoulder flexion = the pelvis tilt (spine
// 0), elbow 0; the far arm keeps its joint angles.
const hang = pro => ({ ...base(ROOT_Y, pro), shoulder: { l: FAR.shoulder, r: { flex: TILT } }, elbow: { l: FAR.elbow, r: 0 } });
const S_R = landmarksOf(base(ROOT_Y, PRO_START), H)['shoulder.r'];
const start = hang(PRO_START);
const START_GRIP = landmarksOf(start, H)['grip.r'];
const SE_R = landmarksOf(base(ROOT_Y, PRO_END), H)['shoulder.r'];
const LB = landmarksOf(base(ROOT_Y, PRO_END), H);
const END_GRIP = [SE_R[0] - 0.03, LB.backUpper[1] - END_DY, SE_R[2] - END_DZ];
const end = withArms(PRO_END, END_GRIP, [-0.3, 1, -0.4]);
// The arm short of straight at the bottom (panel fix 3, D-LIB13-PANEL3 #274 6335029737; pf8 T05 R5 c3): by joint
// angles, the upper arm M_SWING behind plumb (the elbow about 54 px behind and 78 px under the shoulder at 2x) and the
// elbow bent M_ELBOW, the wrist ahead of the upper-arm line, behind the straight support arm; the far arm keeps its
// joint angles (reach.r cleared from the end pose).
const mistakePose = { scap: { l: { pro: 0 }, r: { pro: M_PRO } }, shoulder: { l: FAR.shoulder, r: { flex: TILT - M_SWING } }, elbow: { l: FAR.elbow, r: M_ELBOW }, reach: { r: null } };
// The engine masks the Mistake outline inside the faulty body, so where the red arm crosses the support arm only scraps
// showed. The red working arm (shoulder cap, upper arm, elbow cap, forearm: its outer outline only) and the end-on
// dumbbell are traced as dashed guides, which the engine draws in the Mistake layer above every figure and the bench.
const PXM = 146.28571428571428, CAM = { view: 'side', near: 'r', facing: 'right', pxm: PXM, P: w => [150 + w[2] * PXM, 339 - w[1] * PXM] };
const toW = ([x, y]) => [0, (339 - y) / PXM, (x - 150) / PXM];
const inPoly = (poly, [x, y]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
const ARM_KEYS = ['shcap.r', 'upper.r', 'elbowcap.r', 'fore.r'];
export const MIST_ARM = (() => {
  const b = { height: H }, pose = { ...end, ...mistakePose };
  const shapes = bodyShapes(fk(resolve(normPose(pose, b), b).q, b), CAM).filter(x => ARM_KEYS.includes(x.key) && x.poly);
  const runs = [];
  for (const sh of shapes) {
    const others = shapes.filter(o => o !== sh).map(o => o.poly), keep = sh.poly.map(q => !others.some(P => inPoly(P, q)));
    const start = keep.indexOf(false);
    if (start < 0) { runs.push([...sh.poly, sh.poly[0]]); continue; }
    let cur = [];
    for (let k = 1; k <= sh.poly.length; k++) { const i = (start + k) % sh.poly.length; if (keep[i]) cur.push(sh.poly[i]); else if (cur.length) { runs.push(cur); cur = []; } }
    if (cur.length) runs.push(cur);
  }
  return runs.filter(r => r.length > 1).map(r => r.map(toW));
})();
const LM_MIST = landmarksOf({ ...end, ...mistakePose }, H), MIST_GRIP = LM_MIST['grip.r'];
// The arrow runs from the dumbbell's edge down to the straight-arm dumbbell (the start grip, under the shoulder).
const ARROW_OFF = (() => { const a = CAM.P(MIST_GRIP), b = CAM.P(START_GRIP), L = Math.hypot(b[0] - a[0], b[1] - a[1]), r = 0.119 / 2 * PXM + 1; return [+((b[0] - a[0]) / L * r).toFixed(2), +((b[1] - a[1]) / L * r).toFixed(2)]; })();
export const MIST_BELL = (() => { const c = CAM.P(MIST_GRIP), r = 0.119 / 2 * PXM; return [0, 60, 120, 180, 240, 300, 360].map(a => toW([c[0] + r * Math.cos(a * Math.PI / 180), c[1] + r * Math.sin(a * Math.PI / 180)])); })();

const LS = landmarksOf(start, H);
const BENCH_Z0 = LS['knee.l'][2] - 0.25, BENCH_Z1 = LS['wrist.l'][2] + 0.15;
export const oaInfo = { tilt: +TILT.toFixed(2), rootY: +ROOT_Y.toFixed(3), wristL: LS['wrist.l'].map(v => +v.toFixed(3)), shoulderL: S_L.map(v => +v.toFixed(3)), elbowL: LS['elbow.l'].map(v => +v.toFixed(3)) };
const floor = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  id: 'one_arm_dumbbell_row', name: 'One-Arm Dumbbell Row', view: 'side', facing: 'right',
  camera: { x0: 150, y0: 339 },
  hand: { l: 'flat' },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.75, to: 1.0 },
    { type: 'bench', at: [0.12, BENCH_TOP, (BENCH_Z0 + BENCH_Z1) / 2], len: BENCH_Z1 - BENCH_Z0, z: 'back' },
    lm => ({ type: 'dumbbell', at: lm['grip.r'], part: 'arm.r' }),
  ],
  checks: [
    { landmark: 'heel.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: floor, pose: 'all', tol: 0.5 },
    { landmark: 'knee.l', plane: { point: [0, BENCH_TOP + SHANK_R, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },   // knee on the bench (c1)
    { landmark: 'wrist.l', plane: { point: [0, BENCH_TOP + WRIST_Y, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },  // palm flat on the bench
    { landmark: 'wrist.l', plane: { point: S_L, normal: [0, 0, 1] }, pose: 'start', tol: 0.5 },                         // hand under the shoulder (c2)
  ],
  hand: { l: 'flat' },
  startParts: ['arm.r'],
  ghosts: { count: 2, parts: ['arm.r'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  callouts: [
    { key: 'hand', text: 'Hand under<br>shoulder', anchor: 'wrist.l', cue: 'Put your supporting hand under your shoulder and your knee under your hip.' },
    { key: 'back', text: 'Flat back', anchor: 'backUpper', cue: 'Keep your back flat and level, head in line with your spine.' },
    { key: 'elbow', text: 'Elbow<br>to hip', anchor: 'elbow.r', cue: 'Drive your upper arm back close to your body, dumbbell toward your hip.' },
  ],
  tempo: [{ phase: 'Pull', s: 2, move: true }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      ...MIST_ARM.map(pts => ({ kind: 'dashed', pts })),
      { kind: 'dashed', pts: MIST_BELL },
      { kind: 'arrow', from: { at: 'grip.r', pose: 'mistake', off: ARROW_OFF }, to: { at: 'grip.r', pose: 'start' } },   // down to the straight-arm bottom
    ],
    tells: [
      { key: 'short', text: 'Arm not<br>straight', anchor: { at: 'elbow.r', pose: 'mistake' }, box: { left: 246, top: 234 }, cue: 'The arm never straightens at the bottom.' },
      { key: 'lower', text: 'Not<br>lowered', anchor: { at: 'grip.r', pose: 'mistake' }, box: { left: 250, top: 290 }, cue: 'The dumbbell never comes all the way down.' },
    ],
  },
  pilot: { drawableFault: 'Top fault: excessive momentum (c10), seen only as speed; the plate draws the next fault on the same list, the short range (c10).' },
  alt: 'One-arm dumbbell row, side view. One knee and the same-side hand on a flat bench, the back flat and level, the lifter pulls the dumbbell from a straight hanging arm up to the hip, driving the elbow back close to the body.',
};
