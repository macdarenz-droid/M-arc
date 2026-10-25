// Dumbbell Pullover (one dumbbell, flat bench), side view, facing right. H (own parent; lib-10-card LB2 ids).
// View: SIDE (card plate.view = census view): the shoulder-flexion arc, the constant elbow bend and the hips on the bench
// read in the sagittal plane (c5, c6, c8).
// Clone source (D-LIB9-CLONE): the supine class of dumbbell_bench_press (pilot A, #109 @ e6f39ff; D-LIB8FIX-CARRY),
// copied, never imported: `supine()` with its bisect made to throw when its bracket holds no root (rule b), the flat
// bench at 43 cm, the feet, the scapular set. New: the two-hand grip on one dumbbell hanging vertically, the arc
// round the shoulder at one elbow bend.
// Sources: research card docs/research/howto/cards/dumbbell_pullover.json (claude/libht-research-lb2 2b6747f8, named on
// #265), claims c1 (five points: head, blades and buttocks on the bench, both feet on the floor), c2 (head as far up
// the bench as possible), c3 and c13 (both palms cradle the top plate; the dumbbell hangs vertically), c4 (start: above
// the upper chest, arms vertical, elbows slightly bent), c5 (lower back over the head to a controlled stretch), c6 (the
// same elbow bend all the way), c7 (the Mistake: much more elbow bend, the weight closer to the shoulders), c8 (hips
// stay on the bench), c9 (eyes on the ceiling), c18 (tempo, ACSM 1-2 s each way).
// Geometry decisions:
//  - Supine class (copied): checks prove backUpper and buttock on the pad (plane, tol 1 cm), head clearance and soles
//    on the floor (c1, c8). The neck keeps the anchor's neutral solve, eyes up (c9).
//  - Bench: flat, pad top 43 cm (the anchor's), 1.2 m; its head end at the crown (c2: head as far up as possible, so
//    the bench does not block the arms).
//  - Hands: both on the one handle, the grip centres HAND_X off the midline; the dumbbell hangs straight down from
//    them, its centre HANG below the grip centre (c3, c13), drawn with the vendor dumbbell, axis vertical.
//  - Arms: the elbow bend ELBOW stays the same in every pose and on the path (c6); the arm swings about the shoulder in
//    the sagittal plane. Start (c4): the upper arm and forearm straight up over the upper chest. End (c5): the arm
//    swung back past the head until the grip is END_BELOW under the shoulder joint's height. 11 via keys at even swing
//    steps keep the Trace and the ghosts on that arc (13.3 must-fix 1 and 3).
//  - Engine limit: the start layer never draws moving equipment, so the start dumbbell is a dashed outline in the
//    end layer.
//  - Scale: reference 146.29 px/m.
// Plate labels (card, 2b6747f8): callouts = plate.checkpoints c1 (Five points), c6 (Same elbow bend), c8 (Hips down);
//   Mistake = plate.mistake c7 (key `bend`): at the end the elbows bend far more and the weight comes in toward the
//   shoulders; tempo = plate.tempo c18 (up 1, down 2, no pause): Lower 2, Pull 1 (D-LIB10-NOTE section 9).
// Unsourced numbers (no card claim gives them; 13.3 must-fix 14): BENCH_TOP, BENCH_LEN, FOOT_Z (the anchor's),
//   HEAD_END, HAND_X, HANG, ELBOW ("slightly bent" made a number), END_BELOW (the "stretch you can tolerate" made a
//   number), MIS_ELBOW and MIS_SWING (the Mistake's bend and where it happens: the dumbbell clears the bench end).
import { landmarksOf, fk, resolve, normPose, WINTER, REF } from '../engine.mjs';

const H = 1.75, BODY = { height: H };
const R = Math.PI / 180;
const BENCH_TOP = 0.43, BENCH_LEN = 1.2;              // the anchor's flat bench (m)
const HEAD_END = 0;                                   // pad head end at the top of the skull (m) (c2: the head as far up as possible)
const FOOT_Z = 0.51;                                  // mid-sole in front of the hip joint (m), the anchor's
const SCAP = { elev: -1, pro: -3 };                   // the anchor's scapular set (cm)
const HAND_X = 0.05;                                  // grip centre off the midline (m): both hands on one handle (c3)
const HANG = 0.11;                                    // dumbbell centre under the grip centre (m): it hangs from the top plate (c13)
const ELBOW = 15;                                     // elbow bend (deg), the same in every pose (c4, c6)
const END_BELOW = 0.08;                               // end: grip under the shoulder joint's height (m) (c5)
const MIS_ELBOW = 85;                                 // Mistake: elbow bend (deg) (c7)
const MIS_SWING = 60;                                 // Mistake: upper arm back from vertical (deg): the bend brings the weight in early (c7)
const OCCIPUT = [0, 0.955, -0.056];                   // back of the skull on the side head outline (head frame, H)
const CROWN = [0, 1.0, 0];                            // top of the skull (head frame, H)

// ---- supine class (copied from the anchor; the bisect throws on a bracket with no root, D-LIB9-CLONE b) ----
export const bisect = (f, lo, hi) => { if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error(`dumbbell_pullover: no solution in [${lo}, ${hi}]`); for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
export function supine(top, z = 0, { tilt = -90, height = H } = {}) {
  const body = { height }, at0 = { root: { at: [0, 0, z], tilt } };
  const lm = p => landmarksOf(p, height);
  const occ = p => fk(resolve(normPose(p, body), body).q, body).head(OCCIPUT);
  const pad = lm(at0).buttock[1];
  const trunk = bisect(t => lm({ ...at0, trunk: t }).backUpper[1] - pad, -40, 30);
  const neck = bisect(n => occ({ ...at0, trunk, neck: n })[1] - pad, -40, 60);
  return { root: { at: [0, top - pad, z], tilt }, trunk, neck };
}

const LYING = supine(BENCH_TOP, 0);
const feet = { l: { at: [0.10, 0, FOOT_Z] }, r: { at: [-0.10, 0, FOOT_Z] } };
const base = { ...LYING, scap: SCAP, plant: feet };
const lm0 = landmarksOf(base, H);
const S = { l: lm0['shoulder.l'], r: lm0['shoulder.r'] };
const sk0 = fk(resolve(normPose(base, BODY), BODY).q, BODY);
const L1 = WINTER.upperArm * H, L2 = WINTER.forearm * H + REF.gripOff * H;
const HEAD_TOP = sk0.head(CROWN);
const BENCH_Z = HEAD_TOP[2] - HEAD_END + BENCH_LEN / 2;

// The arm as one swing angle `a` (deg; 0 = straight up, + = back over the head) at elbow bend `e`: the shoulder-to-grip
// reach in the sagittal plane, the grip HAND_X off the midline; the elbow pole points the way the forearm folds.
const reachLen = e => Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(e * R));
const gripAt = (side, a, e = ELBOW) => { const s = side === 'l' ? 1 : -1, sh = S[side], dx = s * HAND_X - sh[0], l = Math.sqrt(reachLen(e) ** 2 - dx * dx);
  return [s * HAND_X, sh[1] + l * Math.cos(a * R), sh[2] - l * Math.sin(a * R)]; };
const reachAt = (a, e = ELBOW) => side => { const s = side === 'l' ? 1 : -1;
  return { at: gripAt(side, a, e), pole: [s * 0.3, Math.sin(a * R), Math.cos(a * R)] }; };   // elbows point forward/up (c14)
const poseAt = (a, e) => ({ ...base, reach: { l: reachAt(a, e)('l'), r: reachAt(a, e)('r') } });
// End: swing back until the grip is END_BELOW under the shoulder joint's height (c5).
const END_A = bisect(a => (S.r[1] - END_BELOW) - gripAt('r', a)[1], 60, 170);
const start = poseAt(0, ELBOW), end = poseAt(END_A, ELBOW);
const via = Array.from({ length: 11 }, (_, k) => poseAt(END_A * (k + 1) / 12, ELBOW));

// Mistake (card plate.mistake, c7; key `bend`): the elbows bend far more as the dumbbell goes back, so the weight comes
// in toward the shoulders: the upper arm stops at MIS_SWING back from vertical and the forearm folds MIS_ELBOW down
// toward the head, so the dumbbell drops behind the head instead of reaching out on long arms.
const misUpper = [0, L1 * Math.cos(MIS_SWING * R), -L1 * Math.sin(MIS_SWING * R)];
const misGrip = side => { const s = side === 'l' ? 1 : -1, sh = S[side], u = misUpper.map(v => v / L1);
  const E = sh.map((v, i) => v + u[i] * L1), back = [0, u[2], -u[1]];   // fold the forearm down, toward the floor
  const f = [0, u[1] * Math.cos(MIS_ELBOW * R) + back[1] * Math.sin(MIS_ELBOW * R), u[2] * Math.cos(MIS_ELBOW * R) + back[2] * Math.sin(MIS_ELBOW * R)];
  const k = Math.hypot(f[1], f[2]), dx = s * HAND_X - E[0], l = Math.sqrt(Math.max(0, L2 * L2 - dx * dx));
  return { at: [s * HAND_X, E[1] + f[1] / k * l, E[2] + f[2] / k * l], pole: u }; };
const mistakePose = { reach: { l: misGrip('l'), r: misGrip('r') } };
const lmE = landmarksOf(end, H), lmM = landmarksOf({ ...end, ...mistakePose }, H);
const elbowBend = lm => { const a = lm['elbow.r'].map((v, i) => v - lm['shoulder.r'][i]), b = lm['grip.r'].map((v, i) => v - lm['elbow.r'][i]);
  return Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (Math.hypot(...a) * Math.hypot(...b))) / R; };
export const info = () => ({ endSwingDeg: +END_A.toFixed(1), endElbowDeg: +elbowBend(lmE).toFixed(1), misElbowDeg: +elbowBend(lmM).toFixed(1),
  misGripNearerShoulderCm: +((Math.hypot(...lmE['grip.r'].map((v, i) => v - S.r[i])) - Math.hypot(...lmM['grip.r'].map((v, i) => v - S.r[i]))) * 100).toFixed(1),
  benchHeadEndZ: +(BENCH_Z - BENCH_LEN / 2).toFixed(3), headTopZ: +HEAD_TOP[2].toFixed(3) });
export { elbowBend };
export const misDb = () => { const g = lmM.grips; return { dbClearOfBenchEndCm: +(((BENCH_Z - BENCH_LEN / 2) - (g[2] + DB_HEAD / 2)) * 100).toFixed(1), dbBottomVsPadCm: +((g[1] - HANG - DB_SPAN / 2 - 0.035 - BENCH_TOP) * 100).toFixed(1) }; };

const dbOf = lm => [0, lm.grips[1] - HANG, lm.grips[2]];
const START_DB = dbOf(landmarksOf(start, H));
const ring = (c, r, n = 6) => Array.from({ length: n + 1 }, (_, k) => [0, c[1] - r * Math.sin(2 * Math.PI * k / n), c[2] + r * Math.cos(2 * Math.PI * k / n)]);
const DB_HEAD = 0.119, DB_SPAN = 0.07 + 0.13;                       // the vendored dumbbell: 11.9 cm heads, 7 cm head length, 13 cm handle
const startDbPhantom = [{ type: 'line', cls: 'eq-line m-line', z: 'front', part: 'startdb', pts: [[0, START_DB[1] - DB_SPAN / 2 - 0.035, START_DB[2] - DB_HEAD / 2], [0, START_DB[1] + DB_SPAN / 2 + 0.035, START_DB[2] - DB_HEAD / 2], [0, START_DB[1] + DB_SPAN / 2 + 0.035, START_DB[2] + DB_HEAD / 2], [0, START_DB[1] - DB_SPAN / 2 - 0.035, START_DB[2] + DB_HEAD / 2], [0, START_DB[1] - DB_SPAN / 2 - 0.035, START_DB[2] - DB_HEAD / 2]] }];
const MIS_DB = dbOf(lmM);

export default {
  id: 'dumbbell_pullover', name: 'Dumbbell Pullover', view: 'side', facing: 'right',
  camera: { x0: 215, y0: 339 },
  poses: { start, via, end },
  equipment: [
    { type: 'floor', from: -1.12, to: 0.80 },
    { type: 'bench', at: [0, BENCH_TOP, BENCH_Z], len: BENCH_LEN },
    (lm, ctx) => (ctx.pose === 'end' && !ctx.mistake ? startDbPhantom : null),
    lm => [{ type: 'dumbbell', at: dbOf(lm), axis: [0, 1, 0], z: 'front', part: 'db' }],
  ],
  checks: [
    { landmark: 'backUpper', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all', tol: 1 },   // blades on the bench (c1)
    { landmark: 'buttock', plane: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all', tol: 1 },     // hips down (c1, c8)
    { landmark: 'head', above: { point: [0, BENCH_TOP, 0], normal: [0, 1, 0] }, pose: 'all' },
    { landmark: 'sole.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },            // feet on the floor (c1)
    { landmark: 'sole.l', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
  ],
  startParts: ['arm.r', 'arm.l'],
  ghosts: { count: 3, parts: ['arm.r', 'db'] },
  trace: { point: 'grip.r', trim: [12, 12] },
  tempo: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Pull', s: 1, move: true }],
  callouts: [
    { key: 'five', text: 'Five<br>points', anchor: 'backUpper', cue: 'Keep your head, blades and hips on the bench and both feet down.' },
    { key: 'bend', text: 'Same<br>elbow bend', anchor: 'elbow.r', cue: 'Keep the same slight bend in your elbows the whole way.' },
    { key: 'hips', text: 'Hips<br>down', anchor: 'buttock', cue: 'Keep your hips on the bench as the weight goes back.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: ring(MIS_DB, 0.06) },                                                  // the dumbbell pulled in (ghost)
      { kind: 'arrow', from: { at: 'grip.r', pose: 'end', off: [4, -6] }, to: { at: 'grip.r', pose: 'mistake', off: [-4, -6] } },
    ],
    tells: [
      { key: 'bend', text: 'Elbows<br>bend', anchor: { at: 'elbow.r', pose: 'mistake' }, box: { left: 160, top: 198 }, cue: 'Your elbows bend a lot as the dumbbell goes back.' },
      { key: 'near', text: 'Weight<br>comes in', anchor: [0, MIS_DB[1] + 0.06, MIS_DB[2]], box: { left: 112, top: 286 }, cue: 'The dumbbell comes in close to your head and shoulders.' },
    ],
  },
  alt: 'Dumbbell pullover, side view. Lying on a flat bench with the head at its end, feet flat, the lifter holds one dumbbell over the upper chest in both hands, arms nearly straight, and lowers it back over the head in an arc at the same elbow bend, then pulls it back.',
};
