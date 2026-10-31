// Bear crawl, side view, figure facing screen right (head right, feet left), face down on hands and toes. LIB-22
//  (LB10, H; held: D-LIB8-shrug, the card-true 2-inch step's Trace is under traceLenMin).
// View: side (card plate.view = census): hands under the shoulders, knees under the hips (c3), the knee hover (c8)
//  and the hips level with the shoulders (c2) are sagittal; the hips-rising fault reads from the side.
// Sources: research card docs/research/howto/cards/bear_crawl.json (research head 596dbe07): c1 hands shoulder-width;
//  c2 opposite hand and leg forward, hips and shoulders at the same height; c3 table-top, hands under the shoulders,
//  knees under the hips, feet hip-width, palms driven into the floor, knees lifted 2 inches; c4 right arm and left leg
//  forward 2 inches, back flat; c5 the bottom not raised as the knees lift (the Mistake); c8 knees close to the
//  ground without touching it, no butt raised the whole time; c10 crawl 15 to 30 seconds (the strip).
// Clone (D-LIB22-CLONE): machine_chest_press (the 8: census closest; nothing of its machine), plank and
//  mountain_climbers (#109 @ dcac4a38: the floor camera D-LIB8-floor, the flat palm, the feet at right angles to the
//  shins with the toe tips down, the Newton solve, HIKE_HIP); copied, never imported.
// Geometry (confirmed by the report's contacts and checks, and by tests on the drawn items):
//  Start (c3, c4): spine and neck neutral (trunk 0, neck 0); arms straight and plumb, flat palms (wrist 90, LIB-26)
//   under the shoulder joints (the hands the shoulder joints' width apart, c1); thighs plumb, knees under the hip
//   joints, the knee joints KNEE_HOVER above the kneecap's floor contact (c3 'lift knees 2 inches'); feet at right
//   angles to the shins (mountain_climbers' ankle 0), toe tips on the floor, hip-width (the legs in the hips' planes).
//   Root, pelvis tilt, hip, knee and shoulder angles solved. The hands and feet are then held as reach and plant targets.
//  End (c4's first diagonal, D-LIB22-SIDES): the near (right) hand and the far (left) foot STEP forward on the floor;
//   pelvis tilt kept, the root (height, reach) solved so both arms stay straight (END_ELBOW) to their hands (the trunk
//   follows about 2.5 cm), both palms flat (each wrist solved, the wrist WRIST_Y up); knees still hovering (c8).
//  Mistake (c5, c2, c8): the hips rise above the line of the back: the pelvis turns M_TILT (pilot A's hike as drawn,
//   mountain_climbers.mjs:88), the shoulders stay where both straight arms reach; hands and feet stay on their spots.
//  Height (S3 question, notes): with straight arms and plumb thighs the hip joints sit 7.8 cm below the shoulder
//   joints (0.529 vs 0.607 m), the back rising about 10 deg toward the head; c2's "same height" is drawn as the flat
//   back (trunk 0); the Mistake puts the hips 7.5 cm above the shoulders.
// Camera: D-LIB8-floor (plank.mjs, mountain_climbers.mjs): floor at y 339, the width-filling scale capped at x1.35
//  (197.49 px/m, F1).
// Unsourced numbers (SIZES; lb10/sizes.json holds each with its basis): KNEE_HOVER, STEP, M_TILT, END_ELBOW.
import { landmarksOf, RADII, WINTER, REF } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
export const SIZES = Object.freeze({ KNEE_HOVER: 0.0508, STEP: 0.0508, M_TILT: 18.8, END_ELBOW: 1 });
const { KNEE_HOVER, STEP, M_TILT, END_ELBOW } = SIZES;
const WRIST_Y = RADII.fore[2] * H;         // flat palm (LIB-26): the wrist the forearm's distal radius above the floor
const WRIST = 90;                          // arms plumb: the wrist extends 90 deg and the palm lies flat
const KNEE_Y = RADII.kneeCap * H + KNEE_HOVER;   // the knee joint over the floor: kneecap radius + the hover (mountain_climbers' kneecap check)

// Newton with finite differences (plank.mjs, mountain_climbers.mjs @ dcac4a38), damped; throws if it does not converge.
function solve(p0, make, res, what, iters = 80) {
  const keys = Object.keys(p0), p = { ...p0 };
  const f = q => { const pose = make(q); return res(landmarksOf(pose, H), pose); };
  for (let it = 0; it < iters; it++) {
    const r = f(p); if (Math.hypot(...r) < 1e-9) return p;
    const J = keys.map(k => { const d = 1e-5, q = { ...p, [k]: p[k] + d }; return f(q).map((v, i) => (v - r[i]) / d); });
    const n = keys.length, A = Array.from({ length: n }, (_, i) => [...keys.map((_, j) => J[j][i]), -r[i]]);
    for (let c = 0; c < n; c++) {
      let m = c; for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[m][c])) m = i;
      [A[c], A[m]] = [A[m], A[c]];
      for (let i = 0; i < n; i++) if (i !== c) { const k = A[i][c] / A[c][c]; for (let j = c; j <= n; j++) A[i][j] -= k * A[c][j]; }
    }
    const step = keys.map((_, i) => A[i][n] / A[i][i]), r0 = Math.hypot(...r);
    for (let h = 1; h > 1e-4; h /= 2) {
      const q = { ...p }; keys.forEach((k, i) => { q[k] += h * step[i]; });
      if (Math.hypot(...f(q)) < r0) { Object.assign(p, q); break; }
    }
  }
  if (!(Math.hypot(...f(p)) <= 1e-6)) throw new Error(`bear_crawl: no solution for ${what}`);
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

// Start: the table-top on hands and toes, the near wrist at z 0.
const quad = q => ({ root: { at: [0, q.y, q.z], tilt: q.tilt }, trunk: 0, neck: 0, shoulder: { flex: q.sh }, elbow: 0, wrist: WRIST, hip: q.hip, knee: q.knee, ankle: 0 });
const QS = solve({ y: 0.55, z: -0.5, tilt: 80, sh: 80, hip: 80, knee: 90 }, quad, lm => [
  lm['wrist.r'][1] - WRIST_Y, lm['wrist.r'][2], lm['wrist.r'][2] - lm['shoulder.r'][2],   // c3: the palm down, under the shoulder
  lm['knee.r'][1] - KNEE_Y, lm['knee.r'][2] - lm['hip.r'][2],                            // c3: the knee hovering under the hip
  lm['toe.r'][1],                                                                        // on the toes
], 'the table-top');
const LS = landmarksOf(quad(QS), H);
// Hands and feet as reach and plant targets where the angles put them (so the end can move one hand and one foot on
// the floor and the engine blends the targets, never swinging a limb through the floor).
const unit = v => { const L = Math.hypot(...v); return v.map(x => x / L); };
const footAt = (s, dz = 0) => {
  const t = unit([0, 1, 2].map(i => LS[`ball.${s}`][i] - LS[`heel.${s}`][i])), a = [0, 1, 2].map(i => LS[`ankle.${s}`][i] - LS[`ball.${s}`][i]);
  const k = a[0] * t[0] + a[1] * t[1] + a[2] * t[2];
  return { at: [LS[`ball.${s}`][0], LS[`ball.${s}`][1], LS[`ball.${s}`][2] + dz], toe: t, normal: unit(a.map((v, i) => v - k * t[i])), ref: 'ball', pole: [0, -1, 0] };
};
const handAt = (s, dz = 0) => ({ at: [LS[`grip.${s}`][0], LS[`grip.${s}`][1], LS[`grip.${s}`][2] + dz], pole: [0, 0, -1] });
const base = { root: { at: [0, QS.y, QS.z], tilt: QS.tilt }, trunk: 0, neck: 0, wrist: WRIST };
const start = { ...base, reach: { l: handAt('l'), r: handAt('r') }, plant: { l: footAt('l'), r: footAt('r') } };
// End (c4): the near hand and the far foot STEP forward on the floor. The arms were straight at full reach, so the
// trunk follows: the root (height and reach) solved so both elbows stay straight (END_ELBOW short of the singular full
// extension, kettlebell_swing.mjs TOP_KNEE's reason) with the pelvis tilt unchanged; the near palm stays flat (its wrist
// solved so the wrist sits WRIST_Y up).
// The shoulder-to-grip distance with the elbow END_ELBOW short of straight and the wrist at w (body.mjs solveReach's
// L2 and beta: the grip REF.gripOff off the forearm line).
const L1 = WINTER.upperArm * H, LF = WINTER.forearm * H, G = REF.gripOff * H;
const reachOf = w => { const L2 = Math.hypot(LF + G * Math.cos(w * R), G * Math.sin(w * R)), b = Math.atan2(G * Math.sin(w * R), LF + G * Math.cos(w * R));
  return Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(END_ELBOW * R + b)); };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const endAt = q => ({ ...base, root: { at: [0, q.y, q.z], tilt: QS.tilt }, wrist: { l: q.wl, r: q.w }, reach: { l: handAt('l'), r: handAt('r', STEP) }, plant: { l: footAt('l', STEP), r: footAt('r') } });
export const QE = solve({ y: QS.y - 0.005, z: QS.z + STEP / 2, w: WRIST - 5, wl: WRIST }, endAt, (lm, p) => [
  dist(lm['shoulder.l'], handAt('l').at) - reachOf(p.wrist.l), dist(lm['shoulder.r'], handAt('r', STEP).at) - reachOf(p.wrist.r), lm['wrist.r'][1] - WRIST_Y, lm['wrist.l'][1] - WRIST_Y], 'the end');
const end = endAt(QE);
// Mistake (c5): the hips rise above the line of the back: the pelvis (and the flat back with it) turns M_TILT, the hips
// up, about the shoulders, which stay where both straight arms reach their hands (the hands and feet stay on their
// spots; the knees lift as the legs follow). M_TILT is pilot A's approved hike, measured: mountain_climbers.mjs:88
// HIKE_HIP 30 turns its pelvis 18.8 deg (tilt 72.9 -> 91.7 @ dcac4a38). HIKE_HIP itself (30 deg more hip flexion) cannot
// be drawn here: with the hands and feet planted the hip flexion peaks at +25.7 deg (notes).
/** Hip flexion seen on the drawn landmarks: 180 less the angle between the thigh (hip to knee) and the trunk (hips to shoulders). */
export const hipFlexOf = lm => { const f = s => { const a = lm[`knee.${s}`].map((v, i) => v - lm[`hip.${s}`][i]), b = lm.shoulders.map((v, i) => v - lm.hips[i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R; }; return (f('l') + f('r')) / 2; };
const LE = landmarksOf(end, H), HIP0 = hipFlexOf(LE);
const mAt = q => ({ ...end, root: { at: [0, q.y, q.z], tilt: QS.tilt + M_TILT } });
const QM = solve({ y: QS.y + 0.15, z: QS.z - 0.05 }, mAt, lm => [dist(lm['shoulder.l'], handAt('l').at) - reachOf(QE.wl),
  dist(lm['shoulder.r'], handAt('r', STEP).at) - reachOf(QE.w)], 'the hips rising');
const mistake = { root: mAt(QM).root };
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  hand: 'flat',
  id: 'bear_crawl', name: 'Bear Crawl', view: 'side', facing: 'right',
  camera: { fit: true, maxScale: 1.35, y0: 339 },   // D-LIB8-floor (plank.mjs, mountain_climbers.mjs @ dcac4a38)
  poses: { start, end },
  equipment: [{ type: 'floor', from: -1.0, to: 0.35 }],
  checks: [
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, at: LS[landmark], pose: 'start', tol: 0.5 })),   // c3 fact: the palms driven into the floor
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, plane: { point: [0, WRIST_Y, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 })),   // palms flat (LIB-26)
    ...['toe.l', 'toe.r'].map(landmark => ({ landmark, plane: FLOOR, pose: 'all', tol: 0.5 })),               // on the toes
    ...['knee.l', 'knee.r'].map(landmark => ({ landmark, plane: { point: [0, KNEE_Y, 0], normal: [0, 1, 0] }, pose: 'start', tol: 0.5 })),   // c3: knees 2 in up
    ...['knee.l', 'knee.r'].map(landmark => ({ landmark, above: { point: [0, RADII.kneeCap * H + 0.04, 0], normal: [0, 1, 0] }, pose: 'end', tol: 0 })),   // c8: still hovering, kneecaps 4 cm or more clear
  ],
  ghosts: { count: 1, parts: ['arm.r', 'leg.l'] },
  trace: { point: 'wrist.r', trim: [4, 6] },
  callouts: [
    { key: 'hands', text: 'Hands<br>under<br>shoulders', anchor: { along: ['shoulder.r', 'wrist.r'], t: 0.6, off: [6, 0] }, box: { left: 262, top: 260 }, cue: 'Palms pressed into the floor, hands under the shoulders, knees under the hips.' },
    { key: 'knees', text: 'Knees<br>hover', anchor: { at: 'knee.l', off: [8, 0] }, box: { left: 180, top: 280 }, cue: 'Knees about 2 inches off the floor, never touching it.' },
    { key: 'hips', text: 'Hips level', anchor: 'sacrum', box: { left: 96, top: 152 }, cue: 'Back straight, hips at the same height as the shoulders.' },
  ],
  mistake: {
    pose: mistake,
    tells: [
      { key: 'hips', text: 'Hips rise', anchor: { at: 'buttock', pose: 'mistake' }, box: { left: 64, top: 152 }, cue: 'The hips rise above the line of the back as the knees lift.' },
      { key: 'level', text: 'Hips above<br>shoulders', anchor: { at: 'backUpper', pose: 'mistake' }, box: { left: 192, top: 96 }, cue: 'The hips sit higher than the shoulders.' },
    ],
  },
  tempo: [{ phase: 'Work', s: '15–30', move: true }],
  zoom: { view: 'normal', k: 4 },   // D-LIBZOOM-EXTEND (lib4-cards §41; DESIGN.md §21): the hand's step (wrist.r), 29.3 px at k 4 (bar at the zoom's scale)
  alt: 'Bear crawl, side view. On hands and toes with the hands under the shoulders and the knees under the hips, hovering just off the floor, back flat. One hand and the opposite foot move forward a small step.',
};
export const info = { QS, QE, QM, hip0: HIP0, hipM: hipFlexOf(landmarksOf(mAt(QM), H)), pose: Object.fromEntries([['start', start], ['end', end], ['mistake', mAt(QM)]].map(([k, p]) => { const lm = landmarksOf(p, H);
  return [k, { com: com(lm).map(v => +v.toFixed(3)), hipY: +lm['hip.r'][1].toFixed(3), shY: +lm['shoulder.r'][1].toFixed(3), kneeL: lm['knee.l'].map(v => +v.toFixed(3)), kneeR: lm['knee.r'].map(v => +v.toFixed(3)), toeL: lm['toe.l'].map(v => +v.toFixed(3)), toeR: lm['toe.r'].map(v => +v.toFixed(3)), wristR: lm['wrist.r'].map(v => +v.toFixed(3)), gripR: lm['grip.r'].map(v => +v.toFixed(3)) }]; })) };
