// Bird dog, side view, figure facing screen right (head right, feet left), on hands and knees on a mat. LIB-21 (LB9, H).
// View: side (card plate.view = census): the low back's sag as the leg rises (c7, c8), the limbs at or near parallel
//  to the floor (c4, c5) and the head in line (c6) are sagittal. The hip-rotation fault (c12) cannot show from the side.
// Sources: research card docs/research/howto/cards/bird_dog.json: c1 kneel on a mat, knees and feet hip-width, feet
//  dorsiflexed (toes toward the body); c2 hands on the mat under the shoulders at shoulder width, fingers forward, knees
//  under the hips; c3 spine neutral, back flat; c4 the LEFT leg raised and straightened to at or near parallel, hips
//  level; c5 the RIGHT arm raised and straightened to at or near parallel, shoulders level; c6 head in line, eyes on the
//  floor; c7 the low back may sag into more lordosis as the leg rises, avoid lifting the leg too high; c8 arching the
//  lower back is a named mistake; c11 press down with the non-moving hand, knee and toes; c14 hold briefly, then repeat
//  with the opposite arm and leg; c20, c21 the tempo (strip from lb9/tempo.json: up 3, pause 3, down 3); c22 a mat under
//  the knees.
// Sides (D-LIB21-SIDES, D-LIB15-MIRROR): c4 names the left leg and c5 the right arm (ACE steps 4-5). Facing right, the
//  near side is the figure's right: the raised right arm is near, the raised left leg is far; the down (supporting)
//  limbs are the far left arm and the near right leg. The card has an each-side claim (c14 "repeat with the opposite
//  arm and leg"); the plate draws the side c4 and c5 name.
// Clone (D-LIB21-CLONE): hanging_leg_raise (the 8: census closest; its 12 deg lumbar arch and its trace trim);
//  bear_crawl (LB10 @ a9c64e11: the quadruped solve, the flat palms, the Winter com, the reach/plant targets, the floor
//  camera) and plank (#109 @ dcac4a38: D-LIB8-floor, hand 'flat'); copied, never imported.
// Geometry (confirmed by the report's contacts and checks, and by measuring the drawn outlines):
//  Mat (c1, c2, c22): one exercise mat MAT_T thick and MAT_LEN long on the floor, centred between the start's down
//   fingertips and toes; the hands, knees and toes rest on its top (y MAT_T). Static (one place in every pose).
//  Start (c1, c2, c3, c6): spine and neck neutral (trunk 0, neck 0); arms straight and plumb, flat palms (wrist 90, the
//   wrist the forearm's distal radius above the mat top) under the shoulder joints (hands the shoulders' width apart,
//   c2); thighs plumb, knee joints under the hip joints, each kneecap on the mat top (knee joint the kneecap radius
//   above it); feet at right angles to the shins (ankle 0), toe tips on the mat (c1 toes tucked); legs hip-width.
//   Root, pelvis tilt, hip, knee and shoulder angles solved (Newton). Hands and feet then held as reach and plant
//   targets. The back rises about 15 deg toward the head (straight arms are longer than the thighs); "flat" is drawn
//   as the straight, neutral spine (trunk 0), as bear_crawl's c2.
//  End (c4, c5, held briefly c14, c21): root, pelvis and spine unchanged (c11, c12: hips and shoulders do not shift);
//   the near right arm straight (elbow 0, wrist 0) and level (wrist at shoulder height: parallel to the floor, c5);
//   the far left leg straight (knee 0, ankle 0) and level (ankle at hip height, c4). The down left hand, right knee and
//   right toes stay on their spots. The raised foot is a plant target at both ends, so its path is the straight
//   blend from the mat to the reach and never passes into the mat (the angle blend took the toe 1.3 cm in).
//  Mistake (c7, c8): the low back sags into an arch: lumbar extension M_ARCH (trunk), the pelvis follows (tilt +8.3,
//   solved); the shoulders stay where they were (c11), the down hand, knee and toes stay on their spots (the knee joint
//   held on its circle about the hip), the down arm stays straight and its palm flat; the raised arm stays level. With
//   the hip angle unchanged the anterior tilt lifts the raised leg 8.3 deg past parallel (c7 "lifting the leg too high").
//  Balance (D-LIB21-BALANCE; Winter com on the drawn landmarks): start inside the four contacts; end and Mistake over
//   the down hand-and-knee line (c2, c4, c5, c11): 0.08 / 0.22 cm from the grip-to-knee segment (within 2 cm), inside
//   the hull of the flat palm, the knee and the toes by 1.18 / 1.44 cm. Ghosts: 1.11 / 0.61 cm from the line.
//  Trace (D-LIB21-TRACE, DRAWING-GUIDE.md:29): the rising foot, ankle.l (c4 "raise and straighten one leg", c7 "as the
//   leg is raised"), trim [10, 12] (hanging_leg_raise.mjs:124, D-LIB18-TRIM).
// Camera: D-LIB21-FLOOR / D-LIB8-floor (plank.mjs, bear_crawl.mjs): floor at y 339, the width-filling scale capped at
//  x1.35 (151.49 px/m, F1).
// Unsourced numbers (SIZES; lb9/sizes.json holds each with its basis): MAT_T, MAT_LEN, M_ARCH.
import { landmarksOf, RADII, WINTER } from '../engine.mjs';

const H = 1.75;
export const SIZES = Object.freeze({ MAT_T: 0.01, MAT_LEN: 1.73, M_ARCH: -12 });
const { MAT_T, MAT_LEN, M_ARCH } = SIZES;
const WRIST_Y = MAT_T + RADII.fore[2] * H;     // flat palm (LIB-26): the wrist the forearm's distal radius above the mat top
const WRIST = 90;                               // arms plumb: the wrist extends 90 deg and the palm lies flat (bear_crawl)
const KNEE_Y = MAT_T + RADII.kneeCap * H;       // kneeling: the kneecap (radius RADII.kneeCap) on the mat top

// Newton with finite differences (bear_crawl.mjs @ a9c64e11), damped; throws if it does not converge.
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
  if (!(Math.hypot(...f(p)) <= 1e-6)) throw new Error(`bird_dog: no solution for ${what}`);
  return p;
}
const mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
/** Winter (2009) whole-body centre of mass on the drawn landmarks (bear_crawl.mjs @ a9c64e11). */
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

// Start: the quadruped on the mat, the near wrist at z 0.
const quad = q => ({ root: { at: [0, q.y, q.z], tilt: q.tilt }, trunk: 0, neck: 0, shoulder: { flex: q.sh }, elbow: 0, wrist: WRIST, hip: q.hip, knee: q.knee, ankle: 0 });
export const QS = solve({ y: 0.5, z: -0.45, tilt: 80, sh: 80, hip: 80, knee: 100 }, quad, lm => [
  lm['wrist.r'][1] - WRIST_Y, lm['wrist.r'][2], lm['wrist.r'][2] - lm['shoulder.r'][2],
  lm['knee.r'][1] - KNEE_Y, lm['knee.r'][2] - lm['hip.r'][2],
  lm['toe.r'][1] - MAT_T,
], 'the start');
export const LS = landmarksOf(quad(QS), H);
// Hands and feet as reach and plant targets where the start angles put them (bear_crawl.mjs @ a9c64e11).
const unit = v => { const L = Math.hypot(...v); return v.map(x => x / L); };
const footAt = (s, L = LS) => {
  const t = unit([0, 1, 2].map(i => L[`ball.${s}`][i] - L[`heel.${s}`][i])), a = [0, 1, 2].map(i => L[`ankle.${s}`][i] - L[`ball.${s}`][i]);
  const k = a[0] * t[0] + a[1] * t[1] + a[2] * t[2];
  return { at: L[`ball.${s}`], toe: t, normal: unit(a.map((v, i) => v - k * t[i])), ref: 'ball', pole: [0, -1, 0] };
};
const handAt = s => ({ at: LS[`grip.${s}`], pole: [0, 0, -1] });
const base = { root: { at: [0, QS.y, QS.z], tilt: QS.tilt }, trunk: 0, neck: 0 };
const start = { ...base, wrist: WRIST, reach: { l: handAt('l'), r: handAt('r') }, plant: { l: footAt('l'), r: footAt('r') } };
// End (c4, c5): the near right arm and the far left leg straight and level; root, pelvis and spine unchanged (c11, c12).
const endAt = q => ({ ...base, shoulder: { r: { flex: q.sh } }, elbow: { r: 0 }, wrist: { l: WRIST, r: 0 }, reach: { l: handAt('l') },
  hip: { l: q.hip }, knee: { l: 0 }, ankle: { l: 0 }, plant: { r: footAt('r') } });
export const QE = solve({ sh: 160, hip: -10 }, endAt, lm => [lm['wrist.r'][1] - lm['shoulder.r'][1], lm['ankle.l'][1] - lm['hip.l'][1]], 'the end');
// The raised foot as a plant target at both ends (its solved end place): the engine blends the target, so the foot
// leaves the mat on a straight path (an angle blend took the toe 1.3 cm into the mat).
const end = { ...endAt(QE), plant: { l: footAt('l', landmarksOf(endAt(QE), H)), r: footAt('r') } };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const THIGH = WINTER.thigh * H;
// Mistake (c7, c8): lumbar extension M_ARCH; root and pelvis tilt solved so the shoulders stay (c11), the down knee
// stays on its spot (the hip on its circle about it; the foot plant keeps the toes), the down arm straight with its palm
// flat (shoulder and wrist angles solved), the raised arm level. The raised leg keeps its hip angle, so it rises.
const mAt = q => ({ ...end, root: { at: [0, q.y, q.z], tilt: q.tilt }, trunk: M_ARCH, reach: { l: null }, plant: { l: null, r: footAt('r') },
  shoulder: { l: { flex: q.sh }, r: { flex: q.shr } }, elbow: 0, wrist: { l: q.w, r: 0 } });
export const QM = solve({ y: QS.y - 0.02, z: QS.z, tilt: QS.tilt + 8, sh: QS.sh, w: WRIST, shr: QE.sh }, mAt, lm => [
  lm['wrist.r'][1] - lm['shoulder.r'][1],
  dist(lm['hip.r'], LS['knee.r']) - THIGH, lm['shoulder.l'][1] - LS['shoulder.l'][1], lm['shoulder.l'][2] - LS['shoulder.l'][2],
  lm['wrist.l'][2] - LS['wrist.l'][2], lm['grip.l'][1] - lm['wrist.l'][1]], 'the arch');
const mistake = mAt(QM);
// The mat (c1, c2, c22): centred between the start's down fingertips and toe tips, its top at MAT_T.
const MAT = (() => { const zc = (LS['toe.r'][2] + LS['grip.l'][2]) / 2; return { at: [0, MAT_T / 2, zc], z0: zc - MAT_LEN / 2, z1: zc + MAT_LEN / 2 }; })();
const TOP = { point: [0, MAT_T, 0], normal: [0, 1, 0] };
export default {
  hand: 'flat',
  id: 'bird_dog', name: 'Bird Dog', view: 'side', facing: 'right',
  camera: { fit: true, maxScale: 1.35, y0: 339 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: MAT.z0, to: MAT.z1 },
    { type: 'box', at: MAT.at, w: MAT_LEN, h: MAT_T, rc: 0.5, part: 'mat' },
  ],
  checks: [
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, plane: { point: [0, WRIST_Y, 0], normal: [0, 1, 0] }, pose: 'start', tol: 0.5 })),   // c2: palms flat on the mat
    { landmark: 'wrist.l', at: LS['wrist.l'], pose: 'all', tol: 0.5 },                                     // c11: the down hand stays (flat)
    ...['knee.l', 'knee.r'].map(landmark => ({ landmark, plane: { point: [0, KNEE_Y, 0], normal: [0, 1, 0] }, pose: 'start', tol: 0.5 })),   // c1, c2: kneecaps on the mat
    { landmark: 'knee.r', at: LS['knee.r'], pose: 'all', tol: 0.5 },                                        // c11: the down knee stays
    ...['toe.l', 'toe.r'].map(landmark => ({ landmark, plane: TOP, pose: 'start', tol: 0.5 })),              // c1: toes tucked on the mat
    { landmark: 'toe.r', at: LS['toe.r'], pose: 'all', tol: 0.5 },                                          // c11: the down toes stay
  ],
  ghosts: { count: 2, parts: ['arm.r', 'leg.l'] },
  trace: { point: 'ankle.l', trim: [10, 12] },
  callouts: [
    { key: 'under', text: 'Hands, knees<br>under', anchor: 'buttock', box: { left: 60, top: 186 }, cue: 'Hands under the shoulders, knees under the hips.' },
    { key: 'flat', text: 'Back flat', anchor: 'backMid', box: { left: 168, top: 196 }, cue: 'Spine neutral: no sagging or arching as the leg rises.' },
    { key: 'level', text: 'Arm, leg<br>level', anchor: { along: ['elbow.r', 'wrist.r'], t: 0.5, off: [0, -7] }, box: { left: 284, top: 172 }, cue: 'Arm and leg at or near parallel to the floor, hips level.' },
  ],
  mistake: {
    pose: mistake,
    guides: [
      { kind: 'arrow', from: { along: ['sacrum', 'backMid'], t: 0.5, pose: 'mistake', off: [0, -16] }, to: { along: ['sacrum', 'backMid'], t: 0.5, pose: 'mistake', off: [0, -3] } },
      { kind: 'arrow', from: { along: ['knee.l', 'ankle.l'], t: 0.7, pose: 'mistake', off: [0, 3] }, to: { along: ['knee.l', 'ankle.l'], t: 0.7, pose: 'mistake', off: [0, -9] } },
    ],
    tells: [
      { key: 'arch', text: 'Low back<br>arches', anchor: { along: ['sacrum', 'backMid'], t: 0.85, pose: 'mistake' }, box: { left: 150, top: 186 }, cue: 'The low back sags into an arch as the leg rises.' },
      { key: 'high', text: 'Leg too high', anchor: { along: ['knee.l', 'ankle.l'], t: 0.4, pose: 'mistake', off: [0, -7] }, box: { left: 20, top: 200 }, cue: 'The leg lifts too high, past parallel to the floor.' },
    ],
  },
  tempo: [{ phase: 'Reach', s: 3, move: true }, { phase: 'Hold', s: 3 }, { phase: 'Return', s: 3, move: true }],
  alt: 'Bird dog, side view. On hands and knees on a mat with the back flat, one arm reaches straight forward and the opposite leg straight back, both level with the floor.',
};
/** Balance (D-LIB21-BALANCE) in the floor plane (x, z): the centre of mass's distance (cm) from the down grip-to-knee
 *  segment, and its margin (cm, + inside) in the hull of the down flat palm (wrist to fingertips), knee and toe tip. */
const cross2 = (a, b, p) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
export function baseOf(lm) {
  const c = com(lm), p = [c[0], c[2]], xz = v => [v[0], v[2]], g = xz(LS['grip.l']), k = xz(LS['knee.r']), t = xz(LS['toe.r']);
  const w = xz(LS['wrist.l']), f = [w[0], w[1] + WINTER.hand * H];
  const d = [k[0] - g[0], k[1] - g[1]], u = Math.max(0, Math.min(1, ((p[0] - g[0]) * d[0] + (p[1] - g[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2)));
  const hull = [f, w, t, k], n = hull.length, o = Math.sign(cross2(hull[0], hull[1], hull[2]));
  const margin = Math.min(...hull.map((a, i) => { const b = hull[(i + 1) % n]; return o * cross2(a, b, p) / Math.hypot(b[0] - a[0], b[1] - a[1]); }));
  return { line: +(Math.hypot(p[0] - g[0] - u * d[0], p[1] - g[1] - u * d[1]) * 100).toFixed(2), hull: +(margin * 100).toFixed(2) };
}
export const info = { QS, QE, QM, pose: Object.fromEntries([['start', start], ['end', end], ['mistake', mistake]].map(([k, p]) => { const lm = landmarksOf(p, H);
  return [k, { com: com(lm).map(v => +v.toFixed(3)), base: baseOf(lm), wristL: lm['wrist.l'].map(v => +v.toFixed(3)), kneeR: lm['knee.r'].map(v => +v.toFixed(3)), toeR: lm['toe.r'].map(v => +v.toFixed(3)), ankleL: lm['ankle.l'].map(v => +v.toFixed(3)), lumbar: lm.lumbar.map(v => +v.toFixed(3)) }]; })) };
