// Smith Machine Squat (bar on the upper traps, the bar on the Smith rails), side view, facing right. H
// (D-LIB16R2-SQUAT: PARAMS has no Smith value, the vendor engine reads only `spec.camera` of the PARAMS paths, and the
// card's tempo 3/1/0 is not the parent's; the D-LIB14-MODES form).
// View: SIDE (card plate.view = census view): the feet ahead of the bar's line, the thigh depth, the stops and the
// straight bar path read in the sagittal plane (c2, c6, c8).
// Clone sources (D-LIB9-CLONE), copied, never imported: barbell_back_squat (the 8, vendor): `key()` (the closed 2×2
// solve of the bar weights W in the thorax frame, the bar moved onto its line by the root), the bar on the upper traps
// (BAR_T), the feet, the grip and the hands; smith_machine_bench_press (pilot B): the rig call, the bar and its end
// dot, the stop. The bar's z is the rail's in every pose (eq/smith.mjs throws otherwise, c8).
// Sources: research card docs/research/howto/cards/smith_machine_squat.json (claude/libht-research @ a48b0594),
// claims c1 (bar across the upper traps, never on the neck), c2 (feet shoulder width, a few inches ahead of the bar's
// path; Motra 3-6 in), c3 (the Mistake: feet directly under the bar lets the knees travel too far forward), c5 (grip
// just outside the shoulders, elbows under the bar, chest lifted), c6 (hips back, knees bend, chest up, heels down,
// thighs at least parallel), c8 (stops just below squat depth), c22 (tempo).
// Geometry decisions:
//  - Rail: the bar's one vertical line, FEET_AHEAD behind the mid-soles (c2); the root moves so the bar stays on it.
//  - End: hips at END_HIP_Y with the pelvis-trunk incline END_INCL: thighs parallel (drawn 1.1° below level, c6).
//  - Mistake (c3): the same hips, trunk and bar; the feet back under the rail, so the knees sit far past the toes.
//  - Stop (c8): its top STOP_BELOW under the bar shaft's lowest drawn point, drawn in front as smith_machine_bench_press
//    does (ruled at PLAN RULED, #354 6543628951: a frame part beside the body, listed, not tested).
// Plate labels: callouts = plate.checkpoints c2 (Feet ahead), c6 (Thighs parallel), c8 (Stops set); Mistake =
//   plate.mistake c3 (key `under`); tempo = plate.tempo (up 1, down 3, pause 0): Lower 3, Drive up 1 (Motra's 1 s
//   bottom pause, c22, is named, not drawn).
// Unsourced numbers: SIZES below, each with its basis in lb6/sizes.json (r2).
import { landmarksOf } from '../engine.mjs';
import { perItem } from '../eq/parts.mjs';
import { smith, SMITH_ITEMS } from '../eq/smith.mjs';

export const SIZES = { FOOT_X: 0.19, TOE_OUT: 20, GRIP_X: 0.36, BAR_TY: 0.85, BAR_TZ: -0.058, FEET_AHEAD: 0.11, END_HIP_Y: 0.43, END_INCL: 28,
  END_SPINE: 6, BAR_R: 0.025, PLATE_D: 0.45, STOP_BELOW: 0.02, STOP_W: 0.25, STOP_H: 0.05 };
const H = 1.75, R = Math.PI / 180;
const { FOOT_X, TOE_OUT, GRIP_X, BAR_TY, BAR_TZ, FEET_AHEAD, END_HIP_Y, END_INCL, END_SPINE, BAR_R, PLATE_D, STOP_BELOW, STOP_W, STOP_H } = SIZES;
const BAR_T = [0, BAR_TY, BAR_TZ];                        // the bar on the upper traps, in the standing thorax frame (H) (c1)
export const RAIL_Z = -FEET_AHEAD;                        // mid-soles at z 0

// ---- copied from barbell_back_squat (vendor) ----
const toe = s => [s * Math.sin(TOE_OUT * R), 0, Math.cos(TOE_OUT * R)];
const feet = { l: { at: [FOOT_X, 0, 0], toe: toe(1) }, r: { at: [-FOOT_X, 0, 0], toe: toe(-1) } };
const REFP = { neck: [0.855, -0.02], backUpper: [0.75, -0.072], sternum: [0.80, 0.07] };
const W = (() => {
  const [a, b, c] = [REFP.neck, REFP.backUpper, REFP.sternum];
  const M = [[a[0] - c[0], b[0] - c[0]], [a[1] - c[1], b[1] - c[1]]], v = [BAR_T[1] - c[0], BAR_T[2] - c[1]];
  const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
  if (Math.abs(det) < 1e-12) throw new Error('smith_machine_squat: the bar weights have no solution');
  const wa = (v[0] * M[1][1] - M[0][1] * v[1]) / det, wb = (M[0][0] * v[1] - v[0] * M[1][0]) / det;
  return { neck: wa, backUpper: wb, sternum: 1 - wa - wb };
})();
const barOf = lm => [0, 1, 2].map(i => W.neck * lm.neck[i] + W.backUpper * lm.backUpper[i] + W.sternum * lm.sternum[i]).map((v, i) => i === 0 ? 0 : v);
const hands = bar => ({ l: { at: [GRIP_X, bar[1], bar[2]], pole: [0.35, -1, 0] }, r: { at: [-GRIP_X, bar[1], bar[2]], pole: [-0.35, -1, 0] } });
function key(hipY, incl, neck = 0, spine = 0, extra = {}) {
  const pose = { root: { at: [0, hipY, 0], tilt: incl - spine }, trunk: spine, neck, plant: feet, ...extra };
  const b = barOf(landmarksOf(pose, H));
  pose.root.at = [0, hipY, RAIL_Z - b[2]];
  return { ...pose, reach: hands([0, b[1], RAIL_Z]) };
}
const pole = (s, a) => [s * Math.sin(a * R), 0, Math.cos(a * R)];
const feetStart = { l: { ...feet.l, pole: pole(1, 14) }, r: { ...feet.r, pole: pole(-1, 14) } };
const start = key(0.918, 4, 0, 0, { plant: feetStart });
const via = [key(0.78, 12, 0, 2), key(0.60, 22, 0, 4)];
const end = key(END_HIP_Y, END_INCL, 0, END_SPINE);

// Mistake (c3): the feet directly under the bar; hips, trunk and bar as at the end.
const feetUnder = { l: { ...feetStart.l, at: [FOOT_X, 0, RAIL_Z] }, r: { ...feetStart.r, at: [-FOOT_X, 0, RAIL_Z] } };   // the start's knee pole: the feet sit flat
const misFull = key(END_HIP_Y, END_INCL, 0, END_SPINE, { plant: feetUnder });
const mistakePose = { root: misFull.root, plant: feetUnder, reach: misFull.reach };

const LS = landmarksOf(start, H), LE = landmarksOf(end, H);
const barAt = lm => [0, lm.grips[1], RAIL_Z];
export const BAR_LOW = barAt(LE)[1];
export const STOP_Y = BAR_LOW - BAR_R - STOP_BELOW;      // the stop's top (c8)
const rigOf = lm => smith({ railZ: RAIL_Z, bar: barAt(lm), stopY: STOP_Y, stop: { w: STOP_W, h: STOP_H }, stopZ: 'front', base: [RAIL_Z - 0.55, RAIL_Z - 0.25] });
const START_BAR = barAt(LS);
const START_DOT = Array.from({ length: 17 }, (_, k) => [0, START_BAR[1] + BAR_R * Math.sin(k * Math.PI / 8), START_BAR[2] + BAR_R * Math.cos(k * Math.PI / 8)]);
export const info = () => { const m = landmarksOf({ ...end, ...mistakePose }, H);
  return { rail: RAIL_Z, barTop: +START_BAR[1].toFixed(3), barLow: +BAR_LOW.toFixed(3), thighDeg: +(Math.atan2(LE['hip.r'][1] - LE['knee.r'][1], LE['knee.r'][2] - LE['hip.r'][2]) / R).toFixed(1),
    kneePastToeEndCm: +((LE['knee.r'][2] - LE['toe.r'][2]) * 100).toFixed(1), kneePastToeMisCm: +((m['knee.r'][2] - m['toe.r'][2]) * 100).toFixed(1) }; };

export default {
  id: 'smith_machine_squat', name: 'Smith Machine Squat', view: 'side', facing: 'right',
  camera: { x0: 196, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -0.8, to: 0.75 },
    ...perItem(lm => rigOf(lm), SMITH_ITEMS),
    lm => [{ type: 'barbell', at: barAt(lm), plateD: PLATE_D, plates: [0.045], part: 'plate', z: 'back' }, { type: 'pulley', at: barAt(lm), r: BAR_R, part: 'bar', z: 'front' }],
    (lm, ctx) => (ctx.pose === 'end' ? { type: 'line', cls: 'eq-cable m-line', pts: START_DOT, z: 'front', part: 'startbar' } : null),
  ],
  checks: [
    ...['heel.r', 'ball.r', 'heel.l', 'ball.l'].map(landmark => ({ landmark, plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 })),   // heels down (c6)
    { landmark: 'trap.r', at: LS['trap.r'], pose: 'start', tol: 0.5 },          // c1 the bar across the upper traps
    { landmark: 'trap.l', at: LS['trap.l'], pose: 'start', tol: 0.5 },
    { landmark: 'wrist.r', at: LS['wrist.r'], pose: 'start', tol: 0.5 },        // c5 hands on the bar
    { landmark: 'wrist.l', at: LS['wrist.l'], pose: 'start', tol: 0.5 },
    { landmark: 'grips', at: START_BAR, pose: 'start', tol: 0.5 },              // the bar on its line (c8)
    { landmark: 'grips', at: barAt(LE), pose: 'end', tol: 0.5 },
  ],
  startParts: ['trunk', 'leg.r', 'bar', 'carriage', 'hook'],
  ghosts: { count: 2, parts: ['trunk', 'leg.r'] },
  trace: { point: 'grip.r', trim: [10, 12] },
  callouts: [
    { key: 'feet', text: 'Feet<br>ahead', anchor: 'ball.r', box: { left: 268, top: 300 }, cue: 'Set your feet a few inches in front of the bar, not under it.' },
    { key: 'depth', text: 'Thighs<br>parallel', anchor: 'knee.r', box: { left: 236, top: 246 }, cue: 'Squat until your thighs are at least parallel to the floor.' },
    { key: 'stops', text: 'Stops<br>set', anchor: [0, STOP_Y - STOP_H / 2, RAIL_Z - STOP_W / 2], cue: 'Set the safety stops just below your squat depth before you unrack.' },
  ],
  tempo: [{ phase: 'Lower', s: 3, move: true }, { phase: 'Drive up', s: 1, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'arrow', from: { at: 'ball.r', pose: 'end', off: [0, 8] }, to: { at: 'ball.r', pose: 'mistake', off: [0, 8] } },   // the feet slide back under the bar
      { kind: 'dashed', pts: [[0, 0, RAIL_Z], [0, BAR_LOW, RAIL_Z]] },                                                         // the bar's line down to the feet
    ],
    tells: [
      { key: 'under', text: 'Feet under<br>bar', anchor: { at: 'ball.r', pose: 'mistake' }, cue: 'Your feet are right under the bar, so your knees travel far forward.' },
      { key: 'knees', text: 'Knees far<br>forward', anchor: { at: 'knee.r', pose: 'mistake' }, box: { left: 252, top: 214 }, cue: 'Your knees push far past your toes.' },
    ],
  },
  alt: 'Smith machine squat, side view. The bar rests on the upper traps, feet a few inches ahead of the bar. The lifter sits the hips back and bends the knees until the thighs are parallel, chest up and heels down, the bar moving straight down to just above the stops.',
};
