// Dumbbell Bench Press (flat bench, pronated grip), side view, facing right. Anchor of the SUPINE pose class.
// View: SIDE. What a coach judges is sagittal: five-point contact (head, upper back, buttocks on the bench, both feet
// flat on the floor), the dumbbells lowered to the side of the chest (not the neck, not the belly) and pressed back
// up over the shoulders. The fly-like width is frontal and does not need to be seen to judge this press.
// Sources: research card docs/research/howto/cards/dumbbell_bench_press.json (branch claude/libht-research
// e2a70bc, verified), claims c1 (flat bench, feet on the floor), c2 (blades down and back; head, shoulders,
// buttocks, feet in contact), c10 + c4 (start: arms straight and vertical, dumbbells directly over the shoulder joints, never past eye level), c5 (lower to
// mid-chest, a little wide toward the armpits, touch gently), c7 (each dumbbell roughly over its elbow).
// Geometry decisions:
//  - Supine class (anchor): rootOnSeat does not fit a lying pose, so `supine()` solves it: pelvis tilt -90 (lying
//    back), the trunk angle that puts backUpper and buttock on the pad plane together (a 3.6 deg lumbar arch in this
//    body model: a neutral spine, c1), the neck angle that puts the back of the skull (head-frame point OCCIPUT, the
//    side head outline's occiput) on the pad (neck -1.9 deg: neutral), then the root height that puts all three ON
//    the pad. Checks prove backUpper and buttock (plane, tol 1 cm), head clearance and soles on the floor (c2).
//  - Bench: flat bench, pad top 43 cm (IPF rules 42-45 cm), 1.2 m long, 6 cm pad; foot end under the upper thigh,
//    head end 18 cm past the skull.
//  - Feet: flat, mid-sole 51 cm in front of the hip joint: shins vertical, knee flexion 79 deg (c1).
//  - Shoulder blades down and back (scap pro -3 cm, elev -1 cm) (c2).
//  - Start (top, c10, c4): arms straight (elbow 4 deg) and vertical, grips directly over the shoulder joints (22.7 cm
//    off the midline), so the dumbbells stay below eye level. (Verified card; the draft's lean toward the eyes is gone.)
//  - End (bottom, c5, c7): upper arm 60 deg out from the torso seen from above ("a little wide toward the armpits") and
//    22 deg below the shoulder's horizontal (elbows just under the bench line); side-view forearm vertical, so the
//    dumbbell is straight over the elbow. That puts the grip 3 cm below the nipple line (mid-chest) and the hex 5 cm
//    above the chest surface line, i.e. touching the chest in side view. Grips 42 cm off the midline: the forearm leans
//    in 11.5 deg in the front plane ("roughly over the elbow", c7). Solved elbow flexion 122 deg.
//  - Path: straight lerp between the two grips (reach IK re-solved per sample): down and toward the feet, the slight
//    arc of c7 in side view.
//  - Dumbbells: engine `dumbbell` primitive, axis [1,0,0] (palms forward, c3: handles in line across the body), so the
//    hex shows end-on in side view. Near one in front of the figure, far one behind it (it projects onto the near one).
//  - Engine limit: the start layer never draws equipment (plate.mjs eqMoving compares start items with themselves),
//    so the start dumbbell is a dashed phantom hex in the end layer (same workaround as machine_chest_press).
//  - Scale: reference 146.29 px/m (same body size as every plate); x0 centres bench + feet. A lying body leaves the
//    top ~45% of the plate empty at this scale: kept for a consistent body size; that space takes the callouts.
// Plate labels (verified card): callouts = plate.checkpoints c2 (Five points), c5 (Down to
//   mid-chest), c7 (Weight over elbow); Mistake = plate.mistake c6 (low back arches, hips lift), tells from c6/c2;
//   tempo = plate.tempo c15 (up 1 s, down 2 s, no pause; the plate starts at the top, so Lower then Press). No measure
//   arc: the card gives no angle; the elbow plumb datum proves c7 instead.
// CARD: bench pad height (BENCH_TOP), foot position (FOOT_Z), top grip over the shoulder joint (TOP_Z, TOP_X, c10), top elbow (TOP_ELBOW),
//   bottom flare (BOTTOM_ABD), depth (BOTTOM_DIP) and hand width (BOTTOM_X) against c5/c7, scapular set (SCAP, c2).
import { landmarksOf, fk, resolve, normPose, WINTER, REF } from '../engine.mjs';

const H = 1.75, BODY = { height: H };
const R = Math.PI / 180;
const BENCH_TOP = 0.43;                               // pad top (m), IPF 42-45 cm
const BENCH_LEN = 1.2, BENCH_Z = -0.40;               // pad from z -1.00 (head end) to +0.20 (under the thighs)
const FOOT_Z = 0.51;                                  // mid-sole, in front of the hip joint (m)
const SCAP = { elev: -1, pro: -3 };                   // blades back and down (cm)
const TOP_ELBOW = 4;                                  // top: elbow flexion (deg), arms straight (c4)
const TOP_X = 0.227;                                  // top: grip centre off the midline (m): over the shoulder joints (c10)
const BOTTOM_ABD = 60;                                // bottom: upper arm angle from the torso, seen from above (deg)
const BOTTOM_DIP = 22;                                // bottom: upper arm below the shoulder's horizontal (deg): elbows just under the bench line
const BOTTOM_X = 0.42;                                // bottom: grip centre off the midline (m): inner heads at the side of the chest
const OCCIPUT = [0, 0.955, -0.056];                   // back of the skull on the side head outline (head frame, H)

// ---- supine class: root, trunk and neck that put backUpper, buttock and occiput on a horizontal pad ----
const bisect = (f, lo, hi) => { for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
/** Supine on a pad top at height `top`, hip joints at world z `z`. `lift` raises the buttock off the pad (the hips-up
 * fault) while the upper back and the skull stay on it. Returns pose fields { root, trunk, neck }. */
export function supine(top, z = 0, { tilt = -90, lift = 0, height = H } = {}) {
  const body = { height }, at0 = { root: { at: [0, 0, z], tilt } };
  const lm = p => landmarksOf(p, height);
  const occ = p => fk(resolve(normPose(p, body), body).q, body).head(OCCIPUT);
  const pad = lm(at0).buttock[1] - lift;                     // pad level in the root-at-0 frame
  const trunk = bisect(t => lm({ ...at0, trunk: t }).backUpper[1] - pad, -40, 30);
  const neck = bisect(n => occ({ ...at0, trunk, neck: n })[1] - pad, -40, 60);
  return { root: { at: [0, top - pad, z], tilt }, trunk, neck };
}
export const occiputOf = (pose, height = H) => { const b = { height }; return fk(resolve(normPose(pose, b), b).q, b).head(OCCIPUT); };

const LYING = supine(BENCH_TOP, 0);
const feet = { l: { at: [0.10, 0, FOOT_Z] }, r: { at: [-0.10, 0, FOOT_Z] } };
const base = { ...LYING, scap: SCAP, plant: feet };
const lm0 = landmarksOf(base, H);
const S = { l: lm0['shoulder.l'], r: lm0['shoulder.r'] };

const sk0 = fk(resolve(normPose(base, BODY), BODY).q, BODY);
const L1 = WINTER.upperArm * H, L2 = WINTER.forearm * H + REF.gripOff * H;

// Top (c10, c4): arms straight and vertical, grips directly over the shoulder joints (below eye level), elbow TOP_ELBOW.
const TOP_Z = S.r[2];                                        // arms vertical: grips straight over the shoulder joints (c10)
const topReach = side => { const s = side === 'l' ? 1 : -1, sh = S[side];
  const d = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(TOP_ELBOW * R));
  const dx = s * TOP_X - sh[0], dz = TOP_Z - sh[2], dy = Math.sqrt(d * d - dx * dx - dz * dz);
  return { at: [sh[0] + dx, sh[1] + dy, sh[2] + dz], pole: [s * 1, -0.2, 0.3] }; };
// Bottom (c5, c7): elbow placed by flare and depth; in the side view the forearm is vertical (grip straight above the
// elbow); across the body the hands sit BOTTOM_X off the midline, so the inner heads reach the side of the chest and the
// forearm leans in a little in the front plane ("roughly over the elbow", c7).
const botReach = side => { const s = side === 'l' ? 1 : -1, sh = S[side];
  const u = [s * Math.sin(BOTTOM_ABD * R) * Math.cos(BOTTOM_DIP * R), -Math.sin(BOTTOM_DIP * R), Math.cos(BOTTOM_ABD * R) * Math.cos(BOTTOM_DIP * R)];
  const E = sh.map((v, i) => v + u[i] * L1), off = Math.abs(E[0]) - BOTTOM_X;
  return { at: [s * BOTTOM_X, E[1] + Math.sqrt(L2 * L2 - off * off), E[2]], pole: u }; };
const MID = sk0.thorax([0, 0.72, 0.072]);                     // nipple line on the chest surface, for the report
export const bottomInfo = () => { const b = botReach('r'), g = b.at, e = g[2] - MID[2], lean = Math.asin((Math.abs(S.r[0] + b.pole[0] * L1) - BOTTOM_X) / L2) / R;
  return { gripBelowNippleLineCm: +(e * 100).toFixed(1), gripAboveChestCm: +((g[1] - MID[1]) * 100).toFixed(1), forearmLeanFrontDeg: +lean.toFixed(1) }; };

const start = { ...base, reach: { l: topReach('l'), r: topReach('r') } };
const end = { ...base, reach: { l: botReach('l'), r: botReach('r') } };

// Engine workaround (as machine_chest_press): the start layer never draws equipment, so the start dumbbell is drawn
// as a dashed phantom hex (the dumbbell primitive's size; the start fist circle marks the handle) in the end layer.
const ring = (c, r, n, a0 = 0) => { const pts = []; for (let i = 0; i <= n; i++) { const a = (a0 + 360 * i / n) * R; pts.push([0, c[1] - r * Math.sin(a), c[2] + r * Math.cos(a)]); } return pts; };
const startDb = landmarksOf(start, H)['grip.r'];
const startDbPhantom = [ring(startDb, 0.119 / 2, 6)].map(pts => ({ type: 'line', pts, cls: 'eq-line m-line', z: 'front' }));

// Mistake (card plate.mistake, c6): the low back arches and the hips lift off the bench to press the weight. The
// buttock rises MISTAKE_LIFT off the pad while the upper back and the skull stay on it (supine() with `lift`): the lumbar
// spine extends 17 deg and the chin tucks. Arms keep the end grip; feet stay planted.
const MISTAKE_LIFT = 0.07;                            // hips off the pad (m)
const mistakePose = supine(BENCH_TOP, 0, { lift: MISTAKE_LIFT });
const lmM = landmarksOf({ ...end, ...mistakePose }, H);
const gapTop = lmM.buttock, gapBot = [0, BENCH_TOP, gapTop[2]], TICK = 2 / 146.29;
const tick = p => ({ kind: 'line', pts: [[0, p[1], p[2] - TICK], [0, p[1], p[2] + TICK]] });

export default {
  id: 'dumbbell_bench_press', name: 'Dumbbell Bench Press', view: 'side', facing: 'right',
  camera: { x0: 205, y0: 339 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -1.12, to: 0.80 },
    { type: 'bench', at: [0, BENCH_TOP, BENCH_Z], len: BENCH_LEN },
    (lm, ctx) => (ctx.pose === 'end' ? startDbPhantom : null),
    lm => [{ type: 'dumbbell', at: lm['grip.l'], axis: [1, 0, 0], z: 'back', part: 'db.l' },
      { type: 'dumbbell', at: lm['grip.r'], axis: [1, 0, 0], z: 'front', part: 'db' }],
  ],
  checks: [
    { landmark: 'backUpper', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all', tol: 1 },   // upper back ON the pad
    { landmark: 'buttock', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'start', tol: 1 },   // buttocks ON the pad
    { landmark: 'buttock', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'end', tol: 1 },
    { landmark: 'buttock', above: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'mistake' },        // gap shown in report
    { landmark: 'head', above: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all' },               // head never inside it
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },            // feet ON the floor
    { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
  ],
  startParts: ['arm.r', 'arm.l'],
  ghosts: { count: 3, parts: ['arm.r', 'db'] },
  trace: { point: 'grip.r', trim: [12, 12] },
  datum: [{ x: 'elbow.r', from: 'elbow.r', to: { at: 'grip.r', off: [0, -16] }, mistake: false }],   // plumb through the elbow: the weight sits over it (c7)
  callouts: [
    { key: 'five', text: 'Five<br>points', anchor: 'buttock', box: { left: 266, top: 210 }, cue: 'Keep your head, shoulders, hips and both feet down the whole set.' },
    { key: 'depth', text: 'Down to<br>mid-chest', anchor: 'grip.r', cue: 'Lower the dumbbells to mid-chest, a little wide, and touch gently.' },
    { key: 'elbow', text: 'Weight<br>over elbow', anchor: 'elbow.r', cue: 'Keep each dumbbell over its elbow, forearm close to vertical.' },
  ],
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Press', s: 1, move: true }],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'arrow', from: { at: 'buttock', pose: 'end', off: [0, -2] }, to: { at: 'buttock', pose: 'mistake', off: [0, -14] } },
      { kind: 'line', pts: [gapBot, gapTop] }, tick(gapBot), tick(gapTop),
    ],
    tells: [
      { key: 'hips', text: 'Hips<br>lift off', anchor: gapBot, cue: 'Your hips lift off the bench to push the weight up.' },
      { key: 'arch', text: 'Low back<br>arches', anchor: { at: 'navel', pose: 'mistake' }, cue: 'Your low back arches and the belly pushes up.' },
    ],
  },
  alt: 'Dumbbell bench press, side view. Lying on a flat bench, head, shoulders and hips on the pad, feet flat, the lifter lowers the dumbbells from straight arms to mid-chest, each forearm vertical under its dumbbell, then presses back up.',
};
