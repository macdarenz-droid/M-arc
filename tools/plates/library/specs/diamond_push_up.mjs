// Diamond Push-Up, side view, figure facing screen right (head right, feet left), face down on hands and toes, the
// hands close together under the upper chest. H (D-LIB17R3-MODES: the hands' place along the body and the tucked elbow
// are not PARAMS keys; no template).
// View: SIDE (card plate.view = census view): the body line and the sagging low back of the Mistake (c3, c6), the tucked
// elbows (c3) and the hands under the upper chest (c1) read from the side. The diamond itself is not visible from the
// side; the ship card's hand zoom carries it (card viewWhy, zooms 'hand').
// Clone source (D-LIB9-CLONE): push_up (pilot B), copied, never imported: the Newton solve (throws when it does not
// converge), the straight body on the toe tips at TOE_Z, the flat palm (LIB-26), the sag Mistake solved with the
// shoulder and toe still (refused unless the low back extends), the plank-line datum and the floor camera.
// Sources: research card docs/research/howto/cards/diamond_push_up.json (research head a48b0594), claims c1 (hands flat
// close together, thumbs and first fingers forming a diamond, below the upper chest, elbows straight), c2 (body straight,
// torso and legs rigid, chin tucked, shoulders down and back), c3 (lower the chest to the backs of the hands, elbows
// tucked close to the torso, the low back and hips neither drop nor arch), c5 (push back up, the body rising as one
// unit), c6 and c7 (the Mistake: the low back and hips sag toward the floor, the low back overextends).
// Pose map (push_up's): spec `start` = card plate.end (bottom, chest near the backs of the hands) and spec `end` = card
//  plate.start (top, arms straight). The Mistake is end pose + override (plate.mjs:78): push_up's sag at the top. No
//  tempo seconds on the card (c5; LR-33): the strip draws the untimed rows (strip/rows.json fallbackA, D-LIB17R3-AFALL).
// Geometry decisions:
//  - Bottom (spec start, c3): the straight body pivots about the toe tips until the chest landmark is CHEST_GAP over
//    the backs of the hands (the hand's back HAND_BACK over the floor); the grip (the palm's centre) lies GRIP_FWD in
//    front of the chest landmark along the floor, so the chest is over the hands and the grips sit between the chest
//    and shoulder landmarks (c1's "below the upper chest"); the grips HAND_X out from the midline (the hands touching
//    at the thumbs, c1); the elbows aim back along the torso (ELBOW_POLE, tucked, c3); the wrist angle is solved so the
//    hand lies level.
//  - Top (spec end, c1, c2): the same toe spot and grips, the arms straight (elbow 0; the shoulder's elevation and
//    plane solved for the grip spot), the palm level; root, tilt and wrist solved.
//  - Mistake (c6, c7): push_up's: from the top, the hip extends SAG_HIP and the lumbar spine extends with it, solved so
//    the shoulder and the toe tip stay; the neck takes back the thorax's turn (head in line).
// Unsourced numbers (lb7/sizes.json with their basis): TOE_Z, HAND_X, GRIP_FWD, HAND_BACK, CHEST_GAP, ELBOW_POLE,
//  SAG_HIP, the floor run, LINE_RUN.
import { landmarksOf, RADII } from '../engine.mjs';

const H = 1.75;
export const SIZES = Object.freeze({ TOE_Z: -1.05, HAND_X: 0.04, GRIP_FWD: 0.03, CHEST_GAP: 0.01, SAG_HIP: -20,
  FLOOR_BACK: 0.1, FLOOR_FRONT: 0.42, LINE_RUN: 0.18 });
const { TOE_Z, HAND_X, GRIP_FWD, CHEST_GAP, SAG_HIP, FLOOR_BACK, FLOOR_FRONT, LINE_RUN } = SIZES;
const ELBOW_POLE = [0.15, 0, -1];             // the elbows' aim (x outward per side): back along the torso, tucked (c3)
const WRIST_Y = RADII.fore[2] * H;            // flat palm (LIB-26): the wrist the forearm's distal radius over the floor
const HAND_BACK = 2 * WRIST_Y;                // the back of the flat hand over the floor: the forearm's distal diameter

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
  if (Math.hypot(...f(p)) >= 1e-6) throw new Error('diamond_push_up: the solve did not converge');
  return p;
}

const body = q => ({ root: { at: [0, q.y, q.z], tilt: q.tilt }, trunk: q.trunk ?? 0, neck: q.neck ?? 0, wrist: q.w ?? 90, hip: q.hip ?? 0, knee: 0, ankle: 0 });
// Bottom: the straight body about the toe tips, the chest landmark CHEST_GAP over the backs of the hands.
const BQ = solve({ y: 0.25, z: -0.2, tilt: 85 }, body, lm => [lm.chest[1] - (HAND_BACK + CHEST_GAP), lm['toe.r'][1], lm['toe.r'][2] - TOE_Z]);
const lmB0 = landmarksOf(body(BQ), H);
export const GRIP_Z = +(lmB0.chest[2] + GRIP_FWD).toFixed(4);
const GRIP = { r: [-HAND_X, WRIST_Y, GRIP_Z], l: [HAND_X, WRIST_Y, GRIP_Z] };
const arms = { r: { at: GRIP.r, pole: [-ELBOW_POLE[0], ELBOW_POLE[1], ELBOW_POLE[2]] }, l: { at: GRIP.l, pole: ELBOW_POLE } };
const withArms = q => ({ ...body(q), reach: arms });
// The wrist angle that lays the hand level (the wrist on the floor plane) for a body q.
const BW = solve({ w: 60 }, w => withArms({ ...BQ, ...w }), lm => [lm['wrist.r'][1] - WRIST_Y]);
const bottom = withArms({ ...BQ, ...BW });
// Top: the same toe spot and grips; the arms straight (elbow 0, the shoulder's elevation and plane solved); the palm
// level.
const straight = q => ({ ...body(q), shoulder: { elev: q.elev, plane: q.plane, rot: q.rot ?? 0 }, elbow: 0 });
const TQ = solve({ y: 0.45, z: -0.2, tilt: 72, w: 85, elev: 80, plane: 80 }, straight, lm => [lm['toe.r'][1], lm['toe.r'][2] - TOE_Z,
  lm['grip.r'][0] - GRIP.r[0], lm['grip.r'][1] - WRIST_Y, lm['grip.r'][2] - GRIP_Z, lm['wrist.r'][1] - WRIST_Y]);
const top = straight(TQ);
const lmT = landmarksOf(top, H), SH = lmT['shoulder.r'];
// Mistake (c6, c7): push_up's sag (copied), the arms kept on their grips.
const MQ = { ...solve({ y: TQ.y - 0.1, z: TQ.z, tilt: TQ.tilt, trunk: -30 }, q => withArms({ ...q, w: TQ.w, hip: SAG_HIP }),
  lm => [lm['shoulder.r'][1] - SH[1], lm['shoulder.r'][2] - SH[2], lm['toe.r'][1], lm['toe.r'][2] - TOE_Z]), hip: SAG_HIP, w: TQ.w };
// The Mistake's arms: straight, on the top's grips (the shoulder stays): the shoulder's elevation and plane and the
// wrist solved.
const MA = solve({ elev: TQ.elev, plane: TQ.plane, w: TQ.w }, a => straight({ ...MQ, ...a }), lm => [lm['grip.r'][0] - GRIP.r[0], lm['grip.r'][1] - WRIST_Y,
  lm['grip.r'][2] - GRIP_Z]);
const MISTAKE = straight({ ...MQ, ...MA });

const start = bottom, end = top;
const LINE = (() => { const a = lmT['shoulder.r'], b = lmT['heel.r'], d = b.map((v, i) => v - a[i]), n = Math.hypot(...d);
  return [a.map((v, i) => v - d[i] / n * LINE_RUN), b.map((v, i) => v + d[i] / n * LINE_RUN)]; })();
const lmB = landmarksOf(bottom, H), lmM = landmarksOf(MISTAKE, H);
const R2D = 180 / Math.PI;
const ang3 = (a, v, b) => { const u = a.map((x, i) => x - v[i]), w = b.map((x, i) => x - v[i]); return Math.acos(u.reduce((s, x, i) => s + x * w[i], 0) / Math.hypot(...u) / Math.hypot(...w)) * R2D; };
const belowLine = p => { const a = lmT['shoulder.r'], b = lmT['heel.r'], u = [b[1] - a[1], b[2] - a[2]], L = Math.hypot(...u);
  return -((p[2] - a[2]) * u[0] - (p[1] - a[1]) * u[1]) / L; };
export const info = () => ({ gripZ: GRIP_Z, bottomChestZ: +lmB.chest[2].toFixed(3), bottomShoulderZ: +lmB['shoulder.r'][2].toFixed(3), topChestZ: +lmT.chest[2].toFixed(3), topShoulderZ: +SH[2].toFixed(3),
  chestOverBackCm: +((lmB.chest[1] - HAND_BACK) * 100).toFixed(2), bottomElbowToTrunk: +ang3(lmB['elbow.r'], lmB['shoulder.r'], lmB['hip.r']).toFixed(1),
  bottomElbowOutCm: +((Math.abs(lmB['elbow.r'][0]) - Math.abs(lmB['shoulder.r'][0])) * 100).toFixed(1), topElbow: +ang3(lmT['shoulder.r'], lmT['elbow.r'], lmT['wrist.r']).toFixed(1),
  hipDropBelowLineCm: +(belowLine(lmM['hip.r']) * 100).toFixed(1), misLumbar: +MQ.trunk.toFixed(1), bottomWrist: +BW.w.toFixed(1), topWrist: +TQ.w.toFixed(1) });

const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  hand: 'flat',
  id: 'diamond_push_up', name: 'Diamond Push-Up', view: 'side', facing: 'right',
  camera: { fit: { right: 76 }, maxScale: 0.988, y0: 300 },   // push_up's floor camera (D-LIB8-floor) at push_up's 144.5 px/m, the floor raised to y 300 so the hand and elbow labels sit clear under it
  poses: { start, end },
  equipment: [{ type: 'floor', from: TOE_Z - FLOOR_BACK, to: GRIP_Z + FLOOR_FRONT }],
  checks: [
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, plane: { point: [0, WRIST_Y, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 })),   // palms flat (c1)
    ...['grip.l', 'grip.r'].map(landmark => ({ landmark, plane: { point: [0, 0, GRIP_Z], normal: [0, 0, 1] }, pose: 'all', tol: 0.5 })),    // below the upper chest (c1)
    { landmark: 'toe.r', plane: FLOOR, pose: 'all', tol: 0.5 },                                                                             // on the toes (c2)
    { landmark: 'chest', plane: { point: [0, HAND_BACK + CHEST_GAP, 0], normal: [0, 1, 0] }, pose: 'start', tol: 0.5 },                 // chest to the backs of the hands (c3)
  ],
  startParts: ['torso', 'leg.r', 'leg.l', 'arm.r'],
  ghosts: { count: 2, parts: ['arm.r'] },
  trace: { point: 'sternum', trim: [8, 10] },
  datum: [{ x: 0, from: 0, to: 0, line: LINE }],
  callouts: [
    { key: 'line', text: 'Body in line', anchor: 'backUpper', box: { left: 64, top: 153 }, cue: 'Keep your torso and legs rigid in one line, with no sag.' },
    { key: 'hands', text: 'Hands<br>under chest', anchor: { at: 'grip.r', pose: 'end' }, box: { left: 236, top: 310 }, cue: 'Place your hands close together under your upper chest.' },
    { key: 'elbows', text: 'Elbows<br>tucked', anchor: { at: 'elbow.r', pose: 'start' }, box: { left: 120, top: 310 }, cue: 'Keep your elbows close to your torso on the way down.' },
  ],
  mistake: {
    pose: MISTAKE,
    guides: [
      { kind: 'arrow', from: { at: 'navel', pose: 'end', off: [0, 8] }, to: { at: 'navel', pose: 'mistake', off: [0, 8] } },
    ],
    tells: [
      { key: 'sag', text: 'Hips sag', anchor: { at: 'buttock', pose: 'mistake' }, box: { left: 96, top: 304 }, cue: 'Your hips sag toward the floor.' },
      { key: 'arch', text: 'Low back arches', anchor: { at: 'lumbar', pose: 'mistake' }, box: { left: 168, top: 314 }, cue: 'Your low back overextends instead of staying rigid.' },
    ],
  },
  tempo: [{ phase: 'Press', move: true }, { phase: 'Lower', move: true }],   // D-STRIP-AFALL (D-LIB17R3-AFALL): blank, tempoOf(strip/rows.json fallbackA rows)
  alt: 'Diamond push-up, side view. Hands close together under the upper chest, elbows tucked by the sides, the lifter presses from the chest near the backs of the hands to straight arms, the body one straight line on the toes.',
};
