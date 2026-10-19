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
//  Trunk: the back level with the floor (c3, c4): spine 0, head in line, the pelvis tilt SOLVED (bracket 70-100 deg)
//   so the drawn back line (sacrum to upper back) is horizontal.
//  Far leg: thigh vertical (hip flex = the pelvis tilt: the knee straight under the hip, c2), knee 90 (the shin along the bench
//   top), ankle -40 (toes off the pad). The root height is SOLVED so the far shin's underside at the knee rests on the
//   bench top (a `checks` plane on knee.l).
//  Far arm (c2): the flat palm (LIB-26 `hand.l: 'flat'`, wrist 90) on the bench straight under the far shoulder; the
//   reach target is SOLVED (3 fixed-point steps) so the wrist sits the forearm's distal radius above the pad and under
//   the shoulder (checks). With the knee under the hip, the hand under the shoulder and a level back on one flat bench,
//   the support elbow bends (about 75 deg): the arm is longer than the thigh. Card-true, flagged for R1/R3.
//  Near leg: the foot planted on the floor beside the bench, 3 cm ahead of the hip, 14 cm out (IK; knee nearly straight).
//  Working arm: start (c5): hanging straight down from the shoulder (joint angles: shoulder flexion = the pelvis tilt,
//   so the arm is plumb; elbow 0), the dumbbell under it. End (c6, c9):
//   the elbow bent and driven back, the upper arm close to the body, the dumbbell at the hip: the grip END_DZ behind
//   the shoulder line toward the hip and END_DY below the back. Shoulder blades: 2 cm forward at the bottom, pulled
//   back 4 cm at the top. Wrist bent back 35 deg into the pull grip (the card's recorded convention, R-LB3-5).
//  Mistake (c10, short range): the pull stops short: the grip low, M_DY under and M_DZ behind the shoulder (the arm
//   swung part way back, clear of the body: panel fix D-LIB13-PANEL1 R5), the shoulder blade not pulled back (pro 2 cm,
//   as at the start).
//  Support hand flat on the bench (the engine's flat palm), the wrist angle SOLVED so the palm lies level (R3).
// Unsourced numbers: BENCH_TOP 0.42 m (the low end of the vendor bench's 42-45 cm, so the near leg reaches the floor), the bench length and position, ankle -40, the
//  near foot spot, END_DZ, END_DY, M_DY 0.50, M_DZ 0.30, PRO 2 / -4 cm, WRIST -35 (convention).
import { landmarksOf, RADII } from '../engine.mjs';

const H = 1.75;
const BENCH_TOP = 0.42, SHANK_R = RADII.shank[1] * H;
const WRIST_Y = RADII.fore[2] * H;                       // flat palm: the wrist sits the forearm's distal radius up

const PRO_START = 2, PRO_END = -4, WRIST = -35;
const END_DZ = 0.40, END_DY = 0.28, M_DY = 0.50, M_DZ = 0.30;

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
const body0 = (y, pro, tilt, wl = 90) => ({ root: { at: [0, y, 0], tilt }, trunk: 0, neck: 0, scap: { l: { pro: 0 }, r: { pro } },
  hip: { l: tilt, r: 0 }, knee: { l: 90, r: 0 }, ankle: { l: -40, r: 0 }, wrist: { l: wl, r: WRIST },
  plant: { r: { at: [-0.14, 0, 0.03] } } });
// The drawn back level (c4 "parallel to the ground"): the pelvis tilt is SOLVED (bracket 70-100 deg) so the back line,
// sacrum to upper back, is horizontal; the far hip flexes the same, so the far thigh stays vertical.
const TILT = solve(t => { const l = landmarksOf(body0(1, PRO_START, t), H); return l.backUpper[1] - l.sacrum[1]; }, 70, 100);
const base0 = (y, pro, wl) => body0(y, pro, TILT, wl);
const ROOT_Y = solve(y => landmarksOf(base0(y, PRO_START), H)['knee.l'][1] - SHANK_R - BENCH_TOP, 0.7, 1.2);

// The far palm: grip target moved until the wrist is WRIST_Y over the pad, straight under the far shoulder.
const S_L = landmarksOf(base0(ROOT_Y, PRO_START), H)['shoulder.l'];
const WRIST_AT = [S_L[0] - 0.03, BENCH_TOP + WRIST_Y, S_L[2]];
const farHandFor = wl => {
  let t = [WRIST_AT[0], WRIST_AT[1] + 0.05, WRIST_AT[2] + 0.07];
  for (let k = 0; k < 4; k++) {
    const w = landmarksOf({ ...base0(ROOT_Y, PRO_START, wl), reach: { l: { at: t, pole: [0, 0, -1] } } }, H)['wrist.l'];
    t = t.map((v, i) => v + WRIST_AT[i] - w[i]);
  }
  return { at: t, pole: [0, 0, -1] };
};
// Palm flat on the bench (panel fix D-LIB13-PANEL1 R3; drawn with the engine's flat palm, spec `hand`): the far
// wrist angle is SOLVED (bracket 0-90 deg) so the hand (wrist -> grip) lies level, pointing forward along the bench.
const handRise = wl => { const l = landmarksOf({ ...base0(ROOT_Y, PRO_START, wl), reach: { l: farHandFor(wl) } }, H); return l['grip.l'][1] - l['wrist.l'][1]; };
const WRIST_L = solve(handRise, 0, 90);
const base = (y, pro) => base0(y, pro, WRIST_L);
const farHand = farHandFor(WRIST_L);
const withArms = (pro, near, pole) => ({ ...base(ROOT_Y, pro), reach: { l: farHand, r: { at: near, pole } } });
// Start (c5): the working arm by joint angles, hanging plumb from the level trunk: shoulder flexion 90 (the trunk is
// 90 deg forward), elbow 0; only the far hand uses IK.
const hang = pro => ({ ...base(ROOT_Y, pro), shoulder: { r: { flex: TILT } }, elbow: { r: 0 }, reach: { l: farHand } });
const S_R = landmarksOf(base(ROOT_Y, PRO_START), H)['shoulder.r'];
const start = hang(PRO_START);
const START_GRIP = landmarksOf(start, H)['grip.r'];
const SE_R = landmarksOf(base(ROOT_Y, PRO_END), H)['shoulder.r'];
const LB = landmarksOf(base(ROOT_Y, PRO_END), H);
const END_GRIP = [SE_R[0] - 0.03, LB.backUpper[1] - END_DY, SE_R[2] - END_DZ];
const end = withArms(PRO_END, END_GRIP, [-0.3, 1, -0.4]);
// The short pull (panel fix D-LIB13-PANEL1 R5): the dumbbell stops low, M_DY under and M_DZ behind the shoulder, the
// arm swung only part way back, so the whole red working arm sits in open space, clear of the support arm, the near
// leg and the torso (the Mistake outline is masked inside the body; searched on the engine's bodyShapes: 81% of the arm
// outline shows, against under 35% for any grip at the old half-way height).
const MIST_GRIP = [START_GRIP[0], SE_R[1] - M_DY, SE_R[2] - M_DZ];
const mistakePose = { scap: { l: { pro: 0 }, r: { pro: PRO_START } }, reach: { l: farHand, r: { at: MIST_GRIP, pole: [-0.3, 1, -0.4] } } };

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
      { kind: 'arrow', from: { at: 'grip.r', pose: 'mistake', off: [12, 12] }, to: { at: 'grip.r', pose: 'end', off: [14.9, 21.2] } },   // 80% of the way to the end grip, 12 px off the near leg: 6 px clear of the solid end figure (A15)
    ],
    tells: [
      { key: 'short', text: 'Stops<br>short', anchor: { at: 'grip.r', pose: 'mistake' }, box: { left: 246, top: 234 }, cue: 'The pull stops short of the hip.' },
      { key: 'blade', text: 'Blade not<br>back', anchor: { at: 'shoulderTop.r', pose: 'mistake' }, box: { left: 230, top: 136 }, cue: 'The shoulder blade is not pulled back at the top.' },
    ],
  },
  pilot: { drawableFault: 'Top fault: excessive momentum (c10), seen only as speed; the plate draws the next fault on the same list, the short range (c10).' },
  alt: 'One-arm dumbbell row, side view. One knee and the same-side hand on a flat bench, the back flat and level, the lifter pulls the dumbbell from a straight hanging arm up to the hip, driving the elbow back close to the body.',
};
