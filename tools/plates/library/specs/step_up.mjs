// Step-up with dumbbells, side view, figure facing screen right. LIB-14 (LB4, mode H: D-LIB14-MODES; the split and
// single-leg pose classes, plan 2.2:155-156: split anchor reverse_lunge is held, D-LIB14-STEPUP; held under
// D-LIB14-NOSECS).
// View: side (card plate.view = census view). The rise is sagittal; the trunk lean (c1, c7), the whole foot on the box
// (c6) and the controlled lowering (c2) read from the side.
// Sources: research card docs/research/howto/cards/step_up.json (research head 3812989f): callouts = plate.checkpoints
//  (c6 Whole foot down, c7 Torso upright, c1 Top leg drives); Mistake = plate.mistake (c1, drawable). Tempo: none (the
//  card gives no seconds). variantLine: exercises.json lists Dumbbells / Bodyweight; the plate draws dumbbells at the
//  sides (c5, c15).
// Pose map (D-LIB14-STEPUP-POSE, #289 6338977366): the spec `start` is the card's end (standing tall on the box on the
//  lead leg, c1) and the spec `end` is the card's start (one whole foot on the box, the other on the floor, c1, c6), so
//  the Mistake, the trunk thrown forward to get up (c1), is drawn against the step position where the rise begins.
// Clone source: single_leg_romanian_deadlift (#109 @ ff7c5c4f) for the hanging arms, the whole-body balance (Winter 2009
//  masses) and its bracketed root finder; box_jump (#109) for the vendor box; the heel-lift convention of reverse_lunge
//  (#109, :17-22) for the trailing foot's push; copied, never imported (D-LIB9-CLONE).
// Geometry decisions (confirmed by the engine report `angles` and `checks`):
//  Box: BOX_H tall, BOX_D deep, its rear edge BOX_Z0 behind the lead mid-foot. Lead leg = the figure's RIGHT (near):
//   its whole foot flat on the box top in both poses (c6; checks, the contact facts c6 and c1). Trail leg = LEFT (far).
//  End (the step position, card start): the trailing foot flat on the floor TRAIL_Z behind (c1 "the other on the
//   floor"; checks, contact fact c1); the root SOLVED (nested brackets) so the lead knee is LEAD_KNEE and the trailing knee
//   TRAIL_KNEE; thorax END_INCL (torso upright, c6; "slightly forward", c7).
//  Start (standing tall on the box, card end): the lead knee 5 deg soft, the trailing foot lifted beside the lead
//   foot, just clear of the box top (above-check); the root z SOLVED so the centre of mass (body plus dumbbells) is over
//   the lead mid-foot; thorax 3 deg.
//  Camera: 128 px/m (inside the 8's range) so the figure standing tall on the 45 cm box fits the plate.
//  Arms hang plumb with a dumbbell in each hand, palms in (c5): the handle runs front to back, so the side view shows
//   the handle and both heads; the far dumbbell sits behind the near one.
//  Mistake (c1): at the step position the trunk is thrown forward (thorax M_INCL) with the hips held, and the trailing
//   foot pushes off its toes (heel up TRAIL_PUSH about the ball, the toe pad on the floor: pistol_squat's convention).
// Unsourced numbers: BOX_H 0.45 m (the box_jump precedent; c11's 45.7 cm is in no quote, so it is not a fact), BOX_D 0.50 m,
//  BOX_Z0 0.15 m, TRAIL_Z 0.50 m, LEAD_KNEE 105, TRAIL_KNEE 10, END_INCL 6, the start trailing foot (hip 15, knee 35),
//  DB_MASS 0.12 per pair, M_INCL 40 and TRAIL_PUSH 0.035 m (the Mistake magnitudes, illustrative).
import { landmarksOf, normPose, resolve } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180, B = { height: H };
const BOX_H = 0.45, BOX_D = 0.50, BOX_Z0 = 0.15, LEAD_X = 0.09, TRAIL_Z = 0.50, LEAD_KNEE = 105, TRAIL_KNEE = 10, END_INCL = 6;
const DB_MASS = 0.12, M_INCL = 40, TRAIL_PUSH = 0.035;
const REACH = (0.186 + 0.146 + 0.46 * 0.108) * H * 0.998; // shoulder to grip centre, arm straight (Winter; copied from SLRDL)
const toeLift = a => -Math.min(...[[0.112, -0.036], [0.120, -0.028], [0.100, -0.038]].map(([z, y]) => ((z - 0.080) * -Math.sin(a * R) + (y + 0.039) * Math.cos(a * R)) * H));
const lead = { at: [-LEAD_X, BOX_H, 0], toe: [0, 0, 1] };
const trail = (up = 0) => (up
  ? { at: [LEAD_X, toeLift(up), -TRAIL_Z], ref: 'ball', normal: [0, Math.cos(up * R), Math.sin(up * R)], toe: [0, -Math.sin(up * R), Math.cos(up * R)] }
  : { at: [LEAD_X, 0, -TRAIL_Z], toe: [0, 0, 1] });

const L3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
function com(lm, extra = []) {   // Winter 2009 Table 4.1 (copied from single_leg_romanian_deadlift) plus point masses
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
  if (fa * fb > 0) throw new Error(`step_up: no solution in [${a}, ${b}]`);
  for (let i = 0; i < 80 && Math.abs(b - a) > 1e-8; i++) {
    const c = (a * fb - b * fa) / (fb - fa), fc = f(c);
    if (fc * fb > 0) { b = c; fb = fc; if (side === -1) fa /= 2; side = -1; } else if (fa * fc > 0) { a = c; fa = fc; if (side === 1) fb /= 2; side = 1; } else return c;
  }
  return (a + b) / 2;
};
const knees = p => resolve(normPose(p, B), B).q.knee;
// Arms hanging straight down (the shoulders do not depend on the arms), palms in.
const hang = lm => ({
  l: { at: [lm['shoulder.l'][0], lm['shoulder.l'][1] - REACH, lm['shoulder.l'][2]], pole: [0.2, 0, -1] },
  r: { at: [lm['shoulder.r'][0], lm['shoulder.r'][1] - REACH, lm['shoulder.r'][2]], pole: [-0.2, 0, -1] },
});
const withArms = p => ({ ...p, reach: hang(landmarksOf(p, H)) });
const dbs = lm => [[DB_MASS / 2, lm['grip.l']], [DB_MASS / 2, lm['grip.r']]];

// End (the step position): the root (y, z) SOLVED by nested brackets: z for the lead knee, y for the trailing knee.
const endBody = (y, z, incl, up = 0) => ({ root: { at: [0, y, z], tilt: incl - 3 }, trunk: 3, neck: -incl / 2, plant: { r: lead, l: trail(up) } });
const endAt = z => { const y = solve(y => knees(endBody(y, z, END_INCL)).l - TRAIL_KNEE, 0.6, 1.0); return endBody(y, z, END_INCL); };
const END_Z = solve(z => knees(endAt(z)).r - LEAD_KNEE, -0.6, -0.1);
const end = withArms(endAt(END_Z));
// Start (standing tall on the box on the lead leg): lead knee 5; the trailing foot lifted beside it by joint angles;
// the root z SOLVED so the centre of mass with the dumbbells is over the lead mid-foot.
const topBody = (y, z) => ({ root: { at: [0, y, z], tilt: 3 }, trunk: 0, neck: 0, hip: { l: 15 }, knee: { l: 35 }, ankle: { l: 10 }, plant: { r: lead } });
const topAt = z => withArms(topBody(solve(y => knees(topBody(y, z)).r - 5, BOX_H + 0.7, BOX_H + 0.94), z));
const TOP_Z = solve(z => com(landmarksOf(topAt(z), H), dbs(landmarksOf(topAt(z), H)))[2], -0.3, 0.2);
const start = topAt(TOP_Z);
// Mistake (c1): the trunk thrown forward over the lead thigh, the hips held; the trailing foot pushes off its toes.
export const PUSH_UP = solve(a => landmarksOf({ ...end, plant: { r: lead, l: trail(a) } }, H)['heel.l'][1] - TRAIL_PUSH, 2, 30);
const MB = { ...endBody(end.root.at[1], end.root.at[2], M_INCL, PUSH_UP) };
const mistakePose = { root: MB.root, trunk: MB.trunk, neck: MB.neck, plant: MB.plant, reach: hang(landmarksOf(MB, H)) };
const LS = landmarksOf(start, H), LE = landmarksOf(end, H), LM = landmarksOf({ ...end, ...mistakePose }, H);
export const suInfo = { endZ: END_Z, topZ: TOP_Z, pushUp: PUSH_UP, trailClear: Math.min(LS['heel.l'][1], LS['toe.l'][1]) - BOX_H, mSternumFwd: LM.sternum[2] - LE.sternum[2] };

const floor = { point: [0, 0, 0], normal: [0, 1, 0] }, boxTop = { point: [0, BOX_H, 0], normal: [0, 1, 0] };
// The dumbbell in the hand (c5), checked at the wrist: the plane square to the hand (wrist to grip) through the wrist spot
// that puts the grip on the dumbbell's handle centre, at the step position (spec end).
const inHand = s => {
  const d = [0, 1, 2].map(i => LE[`grip.${s}`][i] - LE[`wrist.${s}`][i]), L = Math.hypot(...d), n = d.map(v => v / L);
  return { landmark: `wrist.${s}`, plane: { point: hang(LE)[s].at.map((v, i) => v - d[i]), normal: n }, pose: 'end', tol: 0.5 };
};
export default {
  id: 'step_up', name: 'Step-Up', view: 'side', facing: 'right',
  camera: { pxPerM: 128, x0: 196, y0: 339 },   // 128 px/m (inside the 8's 123.9-146.3): standing tall on the box fits under the header
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.85, to: 0.75 },
    { type: 'box', at: [0, BOX_H / 2, -BOX_Z0 + BOX_D / 2], w: BOX_D, h: BOX_H, z: 'back' },
    lm => ({ type: 'dumbbell', at: lm['grip.r'], axis: [0, 0, 1], part: 'arm.r', z: 'front' }),
  ],
  checks: [
    { landmark: 'heel.r', plane: boxTop, pose: 'all', tol: 0.5 },     // c6: the whole lead foot on the box
    { landmark: 'ball.r', plane: boxTop, pose: 'all', tol: 0.5 },
    { landmark: 'heel.l', plane: floor, pose: 'end', tol: 0.5 },      // c1: the other foot on the floor
    { landmark: 'ball.l', plane: floor, pose: 'end', tol: 0.5 },
    { landmark: 'heel.l', above: boxTop, pose: 'start' },              // standing tall: the trailing foot clear of the box
    { landmark: 'toe.l', above: boxTop, pose: 'start' },
    { landmark: 'toe.l', above: floor, pose: 'mistake' },              // the push: heel up, the toe pad on the floor
    inHand('r'), inHand('l'),                                          // c5: the dumbbells in both hands at the step position
  ],
  startParts: ['trunk', 'leg.r', 'leg.l'],
  ghosts: { count: 2, parts: ['trunk', 'leg.r', 'leg.l', 'arm.r'] },
  trace: { point: 'hip.r', trim: [8, 10] },
  callouts: [
    { key: 'foot', text: 'Whole foot<br>down', anchor: 'heel.r', cue: 'Put your whole lead foot firmly on the box.' },
    { key: 'torso', text: 'Torso upright', anchor: 'backUpper', cue: 'Keep your torso upright, with only a slight lean as you rise.' },
    { key: 'leg', text: 'Top leg drives', anchor: 'knee.r', cue: 'Stand up with the top leg, with little help from the bottom foot.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: [{ at: 'heel.l', pose: 'mistake' }, { at: 'ball.l', pose: 'mistake' }] },
    ],
    tells: [
      { key: 'lean', text: 'Trunk thrown<br>forward', anchor: { at: 'backUpper', pose: 'mistake' }, cue: 'The trunk lurches forward to get up.' },
      { key: 'push', text: 'Back foot<br>pushes', anchor: { at: 'heel.l', pose: 'mistake' }, cue: 'The bottom foot pushes off to help.' },
    ],
  },
  alt: 'Step-up with dumbbells, side view. One whole foot on a knee-high box and the other on the floor, dumbbells hanging at the sides, the lifter stands up on the box with the top leg, torso upright.',
};
