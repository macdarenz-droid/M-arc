// Pike Push-Up, side view, figure facing screen right (head right, feet left), hands and toes on the floor, the hips
// lifted into an upside-down V. H (D-LIB17R3-MODES: the card names no parent, and the inverted V is a pose no PARAMS key
// gives; no template).
// View: SIDE (card plate.view = census view): the inverted V and the hip height (c2, c9), the head's path forward and
// down (c5) and the head-to-floor depth (c3) read in the sagittal plane.
// Clone source (D-LIB9-CLONE): push_up (pilot B), copied, never imported: the Newton solve (throws when it does not
// converge), the toe tips on the floor, the flat palm (LIB-26), the bent arm solved for its floor spot and a level hand,
// the floor camera (D-LIB8-floor).
// Sources: research card docs/research/howto/cards/pike_push_up.json (research head a48b0594), claims c1 (hands about
// shoulder-width), c2 (legs straight, hips up and back into an upside-down V), c3 (hips up, bend the arms and lower the
// head to within an inch of the floor, elbows tucked about 45 degrees from the body), c4 (push back up to straight
// arms), c5 (neck neutral, chin slightly tucked; the head moves forward and down as the elbows bend), c6 (the drawn
// Mistake: moving only the head toward the floor, as in a handstand push-up), c7 (the top fault, the elbows flaring,
// cannot be seen from the side: drawable false, F7, D-LIB17R3-F7).
// Pose map: spec `start` = card plate.start (top, arms straight) and spec `end` = card plate.end (bottom, head near the
//  floor): the Mistake (c6) is a bottom fault, drawn as end pose + override (plate.mjs:78). No tempo seconds on the card
//  (c14; LR-33): the strip draws the untimed rows (strip/rows.json fallbackA, D-LIB17R3-AFALL).
// Geometry decisions:
//  - Top (spec start, c1, c2, c4): the hands' floor spots, arms straight, the arms in line with the trunk (shoulder
//    flexion SH_TOP), the hips flexed HIP_TOP with the legs straight, the toe tips on the floor; root, tilt and wrist
//    solved; the toe spot is solved from it.
//  - Bottom (spec end, c3, c5): the same hand and toe spots, the legs straight
//    (hips still high, c3: they stay above the shoulders; measured); the drawn head outline HEAD_GAP over the floor
//    (c3 "within an inch") and HEAD_FWD in front of the grips (c5 "forward and down"), the head and neck neutral
//    (neck 0, c5); root, tilt and hip flexion solved; the elbows about 45 degrees from the body (ELBOW_POLE); the
//    wrist solved so the hand lies level.
//  - Mistake (c6): only the head goes down: the head outline lands HEAD_GAP over the floor straight under the hands'
//    line (at the grips' z, as in a handstand push-up), the same toe spot; root, tilt and hip flexion solved; the elbows keep
//    the bottom's aim (the flare c6 says it leads to is the top fault, c7, which the side view cannot show: F7).
// Unsourced numbers (lb7/sizes.json with their basis): GRIP_Z, SH_TOP, HIP_TOP, HEAD_GAP, HEAD_FWD, ELBOW_POLE, the
//  floor run.
import { landmarksOf, RADII, normPose, resolve, fk, bodyShapes } from '../engine.mjs';

const H = 1.75;
export const SIZES = Object.freeze({ GRIP_Z: 0, SH_TOP: 170, HIP_TOP: 110, HEAD_GAP: 0.02, HEAD_FWD: 0.16, FLOOR_BACK: 0.15, FLOOR_FRONT: 0.4 });
const { GRIP_Z, SH_TOP, HIP_TOP, HEAD_GAP, HEAD_FWD, FLOOR_BACK, FLOOR_FRONT } = SIZES;
const ELBOW_POLE = [1, 0, -0.5];              // bottom: the elbows' aim (x outward per side): out and back, about 45 deg from the body (c3)
const WRIST_Y = RADII.fore[2] * H;            // flat palm (LIB-26)

/** Newton with finite differences (copied from push_up.mjs, pilot B); throws when it does not converge. */
function solve(p0, make, res, iters = 40) {
  const keys = Object.keys(p0); const p = { ...p0 };
  const f = q => res(landmarksOf(make(q), H));
  for (let it = 0; it < iters; it++) {
    const r = f(p); if (Math.hypot(...r) < 1e-6) return p;
    const J = keys.map(k => { const d = 1e-5, q = { ...p, [k]: p[k] + d }; return f(q).map((v, i) => (v - r[i]) / d); });
    const n = keys.length, A = Array.from({ length: n }, (_, i) => [...keys.map((_, j) => J[j][i]), -r[i]]);
    for (let c = 0; c < n; c++) {
      let m = c; for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[m][c])) m = i;
      [A[c], A[m]] = [A[m], A[c]];
      for (let i = 0; i < n; i++) if (i !== c) { const k = A[i][c] / A[c][c]; for (let j = c; j <= n; j++) A[i][j] -= k * A[c][j]; }
    }
    keys.forEach((k, i) => { p[k] += A[i][n] / A[i][i]; });
  }
  if (Math.hypot(...f(p)) >= 1e-6) throw new Error('pike_push_up: the solve did not converge');
  return p;
}

const body = q => ({ root: { at: [0, q.y, q.z], tilt: q.tilt }, trunk: 0, neck: 0, wrist: q.w ?? 90, hip: q.hip ?? HIP_TOP, knee: 0, ankle: 0,
  ...(q.f != null ? { shoulder: { flex: q.f }, elbow: 0 } : {}) });
/** The drawn outline's lowest point over the floor (m) of part `key` (the engine's side-view shapes at 1 px per m). */
const B1 = { height: H };
const CAM1 = { view: 'side', near: 'r', facing: 'right', pxm: 1, P: w => [w[2], -w[1]] };
const lowOf = (pose, key) => -Math.max(...bodyShapes(fk(resolve(normPose(pose, B1), B1).q, B1), CAM1, { hand: 'flat' }).find(s => s.key === key).poly.map(p => p[1]));
const headLow = pose => lowOf(pose, 'head');
// Top: arms straight in line with the trunk, the wrist on the floor at GRIP's z, the hand level; the drawn foot outline
// (not the toe landmark: at this foot angle the sole between toe and ball is lower) on the floor, refined to a fixed
// point.
let TQ = { y: 0.75, z: -0.3, tilt: 135, w: 40 };
{ let off = 0;
  for (let i = 0; i < 6; i++) { TQ = solve(TQ, q => body({ ...q, f: SH_TOP }), lm => [lm['wrist.r'][1] - WRIST_Y, lm['grip.r'][1] - WRIST_Y, lm['grip.r'][2] - GRIP_Z, lm['toe.r'][1] - off]);
    off -= lowOf(body({ ...TQ, f: SH_TOP }), 'foot.r'); }
  if (Math.abs(lowOf(body({ ...TQ, f: SH_TOP }), 'foot.r')) > 1e-5) throw new Error('pike_push_up: the foot outline did not settle on the floor'); }
const top = body({ ...TQ, f: SH_TOP });
const lmT = landmarksOf(top, H);
export const TOE_Z = +lmT['toe.r'][2].toFixed(4);
const GRIP = { r: lmT['grip.r'], l: lmT['grip.l'] };
const WT = lmT['wrist.r'];
// A bent-arm pose: the hands kept on their spots (the wrist on its floor spot, the hand level), the elbows aimed `pole`.
const bent = (q, pole) => solve({ x: GRIP.r[0], y: GRIP.r[1], z: GRIP.r[2], w: 40 }, p => ({ ...body({ ...q, w: p.w }),
  reach: { r: { at: [p.x, p.y, p.z], pole: [-pole[0], pole[1], pole[2]] }, l: { at: [-p.x, p.y, p.z], pole } } }),
  lm => [...lm['wrist.r'].map((v, i) => v - WT[i]), lm['grip.r'][1] - GRIP.r[1]]);
const withBent = (q, pole) => { const p = bent(q, pole); return { ...body({ ...q, w: p.w }), reach: { r: { at: [p.x, p.y, p.z], pole: [-pole[0], pole[1], pole[2]] }, l: { at: [-p.x, p.y, p.z], pole } } }; };
/** Solves `extra` (a root's last residual given the crown's target height) so the drawn head outline, not the crown
 *  landmark, sits HEAD_GAP over the floor: the crown's offset above the outline's low point, refined to a fixed point. */
const headOnGap = (p0, extra) => { let off = 0, q = p0;
  for (let i = 0; i < 6; i++) { q = solve(q, body, lm => [lm['toe.r'][1], lm['toe.r'][2] - TOE_Z, lm.head[1] - (HEAD_GAP + off), extra(lm)]); off += HEAD_GAP - headLow(body(q)); }
  if (Math.abs(headLow(body(q)) - HEAD_GAP) > 1e-5) throw new Error('pike_push_up: the head outline did not settle on its gap');
  return q; };
// Bottom (c3, c5): toe tips on their spot, the head outline HEAD_GAP over the floor and HEAD_FWD in front of the grips.
const BQ = headOnGap({ y: TQ.y - 0.15, z: TQ.z + 0.1, tilt: TQ.tilt - 10, hip: HIP_TOP - 10 }, lm => lm.head[2] - (GRIP_Z + HEAD_FWD));
const bottom = withBent(BQ, ELBOW_POLE);
// Mistake (c6): only the head goes down, straight under the hands' line.
const MQ = headOnGap({ y: BQ.y, z: BQ.z - 0.05, tilt: BQ.tilt, hip: BQ.hip }, lm => lm.head[2] - GRIP_Z);
const MISTAKE = withBent(MQ, ELBOW_POLE);
// PANEL mx13 R5 (#356 6547087962): the faulty head as a complete dashed outline drawn over the fill (the engine's own
// side-view head shape in the Mistake pose, as world points), straight under the shoulders' line (the grips' z).
export const FAULT_HEAD = bodyShapes(fk(resolve(normPose(MISTAKE, B1), B1).q, B1), CAM1, { hand: 'flat' }).find(s => s.key === 'head').poly.map(([z, y]) => [0, -y, z]);
// The dashed neck (PANEL mx15 R5): from the Mistake's neck point (the red back line's end) to the faulty head's top
// outline point.
const lmMis = landmarksOf(MISTAKE, H);
export const FAULT_NECK = [[0, lmMis.neck[1], lmMis.neck[2]], FAULT_HEAD.reduce((a, p) => (p[1] > a[1] ? p : a))];

// The in-between keys (PANEL mx13 R3, #356 6547087962): at the ghosts' times, t 1/3 and 2/3 of the way from the top to
// the bottom, the tilt and hip flexion are the keys' blend and the root is solved so the toe tips stay on their spot;
// the hands stay on their spots (withBent). The two ghosts sit on these keys, so no ghost hand leaves the floor.
const viaAt = t => {
  const tilt = TQ.tilt + (BQ.tilt - TQ.tilt) * t, hip = HIP_TOP + (BQ.hip - HIP_TOP) * t, toeY = (1 - t) * lmT['toe.r'][1];
  const q = solve({ y: TQ.y + (BQ.y - TQ.y) * t, z: TQ.z + (BQ.z - TQ.z) * t }, p => body({ ...p, tilt, hip }), lm => [lm['toe.r'][1] - toeY, lm['toe.r'][2] - TOE_Z]);
  return withBent({ ...q, tilt, hip }, ELBOW_POLE);
};
const via = [1 / 3, 2 / 3].map(viaAt);
const start = top, end = bottom;
const lmB = landmarksOf(bottom, H), lmM = landmarksOf(MISTAKE, H);
const R2D = 180 / Math.PI;
const ang3 = (a, v, b) => { const u = a.map((x, i) => x - v[i]), w = b.map((x, i) => x - v[i]); return Math.acos(u.reduce((s, x, i) => s + x * w[i], 0) / Math.hypot(...u) / Math.hypot(...w)) * R2D; };
export const info = () => ({ toeZ: TOE_Z, topHipY: +lmT['hip.r'][1].toFixed(3), topShoulderY: +lmT['shoulder.r'][1].toFixed(3), bottomHipY: +lmB['hip.r'][1].toFixed(3), bottomShoulderY: +lmB['shoulder.r'][1].toFixed(3),
  bottomHeadZ: +lmB.head[2].toFixed(3), headPastGripCm: +((lmB.head[2] - GRIP_Z) * 100).toFixed(1), bottomElbowToTrunk: +ang3(lmB['elbow.r'], lmB['shoulder.r'], lmB['hip.r']).toFixed(1),
  bottomElbow: +ang3(lmB['shoulder.r'], lmB['elbow.r'], lmB['wrist.r']).toFixed(1), mistakeHeadMoveCm: +(Math.hypot(lmM.head[1] - lmB.head[1], lmM.head[2] - lmB.head[2]) * 100).toFixed(1),
  headLowCm: +(headLow(bottom) * 100).toFixed(2), mistakeHeadLowCm: +(headLow(MISTAKE) * 100).toFixed(2), mistakeToeZ: +lmM['toe.r'][2].toFixed(3), bottomHip: +BQ.hip.toFixed(1), mistakeHip: +MQ.hip.toFixed(1), mistakeElbow: +ang3(lmM['shoulder.r'], lmM['elbow.r'], lmM['wrist.r']).toFixed(1) });

const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  hand: 'flat',
  id: 'pike_push_up', name: 'Pike Push-Up', view: 'side', facing: 'right',
  camera: { fit: { right: 76 }, maxScale: 0.988, y0: 305 },   // push_up's floor camera (D-LIB8-floor) at push_up's 144.5 px/m, the floor raised to y 305 so the head labels sit under it
  poses: { start, via, end },
  equipment: [{ type: 'floor', from: TOE_Z - FLOOR_BACK, to: GRIP_Z + FLOOR_FRONT }],
  checks: [
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, plane: { point: [0, WRIST_Y, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 })),   // palms flat (c1)
    { landmark: 'toe.r', plane: FLOOR, pose: 'end', tol: 0.5 },                                                                             // on the toes (the top's foot outline is solved onto the floor)
  ],
  startParts: ['torso', 'leg.r', 'leg.l', 'arm.r'],
  ghosts: { count: 2, parts: ['arm.r'] },
  trace: { point: 'head', trim: [8, 10] },
  callouts: [
    { key: 'hips', text: 'Hips high', anchor: { at: 'buttock', pose: 'end' }, box: { left: 150, top: 116 }, cue: 'Keep your legs straight and your hips up in an upside-down V.' },
    { key: 'head', text: 'Head<br>forward', anchor: { at: 'head', pose: 'end', off: [7, -10] }, box: { left: 250, top: 226 }, cue: 'Move your head forward and down as your elbows bend.' },
    { key: 'floor', text: 'Head near floor', anchor: { at: 'head', pose: 'end' }, box: { left: 200, top: 315 }, cue: 'Lower until your head is about an inch from the floor.' },
  ],
  mistake: {
    pose: MISTAKE,
    guides: [
      // PANEL mx13/mx15 R5: the faulty head as a complete dashed outline over the fill, joined to the red body by a
      // dashed neck (the Mistake's neck point to the outline's top point).
      { kind: 'dashed', pts: [...FAULT_HEAD, FAULT_HEAD[0]] },
      { kind: 'dashed', pts: FAULT_NECK },
    ],
    tells: [
      { key: 'head', text: 'Head straight<br>down', anchor: { at: 'head', pose: 'mistake' }, box: { left: 230, top: 308 }, cue: 'Only your head drops toward the floor, straight down.' },
    ],
  },
  tempo: [{ phase: 'Lower', move: true }, { phase: 'Press', move: true }],   // D-STRIP-AFALL (D-LIB17R3-AFALL): blank, tempoOf(strip/rows.json fallbackA rows)
  alt: 'Pike push-up, side view. Hands and toes on the floor, legs straight and hips high in an upside-down V, the lifter bends the elbows and lowers the head forward and down to just over the floor.',
};
