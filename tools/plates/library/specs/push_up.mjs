// Push-Up, side view, figure facing screen right (head right, feet left), face down on hands and toes. H (D-LIB10-PA's
// mode rule: the PUSHUP parent; no template, D-LIB11-TEMPLATES).
// View: SIDE (card plate.view = census view): the head-to-heel line, the shoulders over the hands, the chest to the
// floor and the sagging hips (the Mistake) all read in the sagittal plane (c1, c2, c3, c5, c6).
// Clone source (D-LIB9-CLONE): pilot A's plank class, plank.mjs and mountain_climbers.mjs (#109 @ 013f84e, approved;
// 48d49bb8 read), copied, never imported: the Newton solve (made to throw when it does not converge), the high-plank
// body (trunk, hip, knee 0; feet at right angles, toe tips on the floor), the flat palm with the wrist extended 90 so
// the palm lies on the floor (LIB-26), the plank line datum and the floor camera (D-LIB8-floor).
// Sources: research card docs/research/howto/cards/push_up.json (claude/libht-research @ 38d5f9c6), claims c1 (palms
// flat about shoulder-width, shoulders directly over the hands), c2 (body straight head to heels, no bend at the hips
// or knees, head in line, feet together), c3 (lower with the trunk rigid until the chest touches the floor; torso and
// legs go down together), c4 (press up until the elbows are straight), c5 (the Mistake: the hips sag or the low back
// arches), c6 (from the side at the top: shoulders over elbows over wrists), c7 (standard form: the elbows flare out on
// the way down), c13 (lower slowly, touch the floor lightly; tempo).
// Pose map (Do 1, D-LIB11 pose map; Q2(f)): spec `start` = card plate.end (bottom, chest on the floor) and spec `end` =
//  card plate.start (top, arms straight). The Mistake is drawn as end pose + override (plate.mjs:78, :208): at the
//  bottom the straight body already lies a hand's width over the floor, so sagging hips cannot drop below the line
//  without passing through the floor; at the top the sag reads against the solid straight body, as plank's approved
//  Mistake does. The tempo order follows the drawn start: Press, then Lower.
// Geometry decisions:
//  - Top (spec end, c1, c4, c6, c2): one straight line, toe tips on the floor at TOE_Z; arms straight and plumb, so the
//    wrist is straight under the shoulder (check) and the elbow on that line; palms flat (wrist 90, wrist at the
//    forearm's distal radius over the floor: check). Root and pelvis tilt solved.
//  - Bottom (spec start, c3, c7): the same straight body pivots about the toe tips until the chest landmark is
//    CHEST_GAP over the floor (touching lightly, c13); the hands stay on their floor spots (reach IK, the same target as
//    the top); the elbows flare out to the side (pole out and up, c7).
//  - Feet together (c2): both feet at the midline's sides (the body model's hip width; the side view shows one leg).
//  - Mistake (c5): from the top, the hip extends SAG_HIP and the lumbar spine extends with it (solved, with root and
//    pelvis tilt) while the shoulder (so the plumb arm and the hands) and the toe tip do not move: the hips drop below
//    the plank line and the low back arches. With the engine's one-pivot spine (L3) every arched solution that keeps
//    the shoulder and toes still drops the hip joint about 20-22 cm.
//  - Scale: D-LIB8-floor's floor camera with a 76 px right fit margin, `camera { fit: { right: 76 }, maxScale: 1.35,
//    y0: 339 }`: 144.57 px/m. At the full fit (177.18 px/m) 'Chest to floor' has no clear box (Q-R2-3: the smaller scale
//    when labels need room); the scale is pinned in tests/howto/lib11-pilot-b.test.ts.
// Plate labels (card @ 38d5f9c6): callouts = plate.checkpoints c2/c3 (Straight line), c1/c6 (Shoulders over hands),
//   c3/c13 (Chest to floor); Mistake = plate.mistake c5 (key `sag`): the hips sag and the low back arches; tempo =
//   plate.tempo c13 (up 1, down 2, pause 0): Press 1, Lower 2.
// Unsourced numbers (no card claim gives them; 13.3 must-fix 14): TOE_Z (the floor spot), CHEST_GAP (how close
//   "touches lightly" is drawn), ELBOW_POLE (how far out the elbows flare), SAG_HIP (how far the Mistake sags), the
//   floor line's length, LINE_RUN.
import { landmarksOf, RADII } from '../engine.mjs';

const H = 1.75;
const WRIST_Y = RADII.fore[2] * H;            // flat palm (LIB-26): the wrist sits the forearm's distal radius over the floor
const WRIST = 90;                             // arms plumb at the top, so the wrist extends 90 deg and the palm lies flat
const TOE_Z = -1.05;                          // toe tips on the floor (m), mountain_climbers'
export const CHEST_GAP = 0.005;                // bottom: the chest landmark this far over the floor (m): touches lightly (c3, c13)
const ELBOW_POLE = [1, 0, -1];                // bottom: elbow aim (x outward per side): out to the side and back (c7)
export const SAG_HIP = -20;                   // Mistake: hip extension (deg): the hips sag (c5)

/** Newton with finite differences (copied from plank.mjs @ 013f84e); throws when it does not converge. */
export function solve(p0, make, res, iters = 40) {
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
  if (Math.hypot(...f(p)) >= 1e-6) throw new Error('push_up: the solve did not converge');
  return p;
}

const plankPose = q => ({ root: { at: [0, q.y, q.z], tilt: q.tilt }, trunk: q.trunk ?? 0, neck: 0, shoulder: { flex: q.tilt }, elbow: 0, wrist: WRIST, hip: q.hip ?? 0, knee: 0, ankle: 0 });
const TQ = solve({ y: 0.45, z: -0.2, tilt: 75 }, plankPose, lm => [lm['wrist.r'][1] - WRIST_Y, lm['toe.r'][1], lm['toe.r'][2] - TOE_Z]);
const lmT = landmarksOf(plankPose(TQ), H);
const SH = lmT['shoulder.r'];
const GRIP = { l: lmT['grip.l'], r: lmT['grip.r'] };      // the hands' floor spots, kept in every pose
const reachTop = { l: { at: GRIP.l, pole: [0, -1, 0] }, r: { at: GRIP.r, pole: [0, -1, 0] } };
const body = q => ({ root: { at: [0, q.y, q.z], tilt: q.tilt }, trunk: q.trunk ?? 0, neck: 0, wrist: q.wrist ?? WRIST, hip: q.hip ?? 0, knee: 0, ankle: 0 });
const top = { ...body(TQ), reach: reachTop };
// Bottom: the straight body about the toe tips, the chest landmark CHEST_GAP over the floor.
const BQ = solve({ y: TQ.y - 0.2, z: TQ.z, tilt: TQ.tilt + 10 }, body, lm => [lm.chest[1] - CHEST_GAP, lm['toe.r'][1], lm['toe.r'][2] - TOE_Z]);
// The flared arm (pole out and back) turns the forearm's bend plane, so the hand cannot keep the top's grip point: the
// wrist stays on its floor spot (the top's wrist) and the hand stays level (the grip at the top's grip height: palm flat,
// fingers turned in, c1), solved for the grip target and the wrist angle.
const WT = lmT['wrist.r'];
const flared = p => ({ ...body({ ...BQ, wrist: p.w }), reach: { r: { at: [p.x, p.y, p.z], pole: [-ELBOW_POLE[0], ELBOW_POLE[1], ELBOW_POLE[2]] }, l: { at: [-p.x, p.y, p.z], pole: ELBOW_POLE } } });
const FQ = solve({ x: GRIP.r[0], y: GRIP.r[1], z: GRIP.r[2], w: 30 }, flared, lm => [...lm['wrist.r'].map((v, i) => v - WT[i]), lm['grip.r'][1] - GRIP.r[1]]);
const bottom = flared(FQ);
// The plank line: shoulder to heel of the top pose; belowLine(p) is a point's distance under it (m, + = below).
const belowLine = p => { const a = lmT['shoulder.r'], b = lmT['heel.r'], u = [b[1] - a[1], b[2] - a[2]], L = Math.hypot(...u);
  return -((p[2] - a[2]) * u[0] - (p[1] - a[1]) * u[1]) / L; };
// Mistake (c5): the hips sag and the low back arches. The hip extends SAG_HIP; the lumbar angle, root and pelvis tilt
// are solved so the shoulder (so the plumb arms and the hands) and the toe tip do not move. The same equations have a
// second root with the low back bent forward (a rounded back, the hips higher): the solve starts on the arched side and
// the result is refused unless the lumbar spine extends.
const MQ = { ...solve({ y: TQ.y - 0.1, z: TQ.z, tilt: TQ.tilt, trunk: -30 }, q => body({ ...q, hip: SAG_HIP }),
  lm => [lm['shoulder.r'][1] - SH[1], lm['shoulder.r'][2] - SH[2], lm['toe.r'][1], lm['toe.r'][2] - TOE_Z]), hip: SAG_HIP };
if (!(MQ.trunk < -5)) throw new Error('push_up: the sag solve did not land on the arched root');
// The head stays in line with the top's (c2: head in line): the neck takes back the thorax's turn, so only the hips and
// the low back differ from the solid figure.
MQ.neck = -((MQ.tilt + MQ.trunk) - TQ.tilt);
const MISTAKE = { ...body(MQ), neck: MQ.neck, reach: reachTop };

const start = bottom, end = top;
// The plank line (datum): shoulder to heel of the top pose, run LINE_RUN m past each end (as plank).
const LINE_RUN = 0.18;
const LINE = (() => { const a = lmT['shoulder.r'], b = lmT['heel.r'], d = b.map((v, i) => v - a[i]), n = Math.hypot(...d);
  return [a.map((v, i) => v - d[i] / n * LINE_RUN), b.map((v, i) => v + d[i] / n * LINE_RUN)]; })();
const lmB = landmarksOf(bottom, H), lmM = landmarksOf(MISTAKE, H);
export const info = () => ({ shoulderOverWristCm: +((lmT['shoulder.r'][2] - lmT['wrist.r'][2]) * 100).toFixed(2), chestToFloorCm: +(lmB.chest[1] * 100).toFixed(1),
  bottomElbowOutCm: +((Math.abs(lmB['elbow.r'][0]) - Math.abs(lmB['shoulder.r'][0])) * 100).toFixed(1), bottomElbow: lmB['elbow.r'].map(v => +v.toFixed(3)), bottomWrist: +FQ.w.toFixed(1), handTurnInDeg: +(Math.atan2(lmB['grip.r'][0] - WT[0], lmB['grip.r'][2] - WT[2]) * 180 / Math.PI).toFixed(1),
  hipDropBelowLineCm: +(belowLine(lmM['hip.r']) * 100).toFixed(1), endHipBelowLineCm: +(belowLine(lmT['hip.r']) * 100).toFixed(1), tilt: [+BQ.tilt.toFixed(1), +TQ.tilt.toFixed(1)], misLumbar: +MQ.trunk.toFixed(1), misHip: +MQ.hip.toFixed(1) });

const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
export default {
  hand: 'flat',
  id: 'push_up', name: 'Push-Up', view: 'side', facing: 'right',
  camera: { fit: { right: 76 }, maxScale: 1.35, y0: 339 },   // D-LIB8-floor: floor at y 339, width-filling scale <= x1.35
  poses: { start, end },
  equipment: [{ type: 'floor', from: -1.15, to: 0.42 }],
  checks: [
    { landmark: 'wrist.r', plane: { point: [0, WRIST_Y, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },   // palm flat on the floor (LIB-26)
    { landmark: 'wrist.l', plane: { point: [0, WRIST_Y, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },   // both palms (c1)
    { landmark: 'wrist.r', plane: { point: SH, normal: [0, 0, 1] }, pose: 'end', tol: 0.5 },                // shoulders over the hands (c1, c6)
    { landmark: 'elbow.r', plane: { point: SH, normal: [0, 0, 1] }, pose: 'end', tol: 0.5 },                // over the elbows (c6)
    { landmark: 'toe.r', plane: FLOOR, pose: 'all', tol: 0.5 },                                              // on the toes (c2)
    { landmark: 'chest', plane: FLOOR, pose: 'start', tol: 1 },                                           // the chest touches the floor (c3)
  ],
  startParts: ['torso', 'leg.r', 'leg.l', 'arm.r'],
  ghosts: { count: 2, parts: ['arm.r'] },
  trace: { point: 'sternum', trim: [8, 10] },
  datum: [{ x: 0, from: 0, to: 0, line: LINE }],
  callouts: [
    { key: 'line', text: 'Straight line', anchor: 'backUpper', box: { left: 64, top: 192 }, cue: 'Keep your head, hips and heels in one line, with no sag.' },
    { key: 'hands', text: 'Shoulders<br>over hands', anchor: 'shoulderTop.r', box: { left: 196, top: 150 }, cue: 'At the top, stack your shoulders over your elbows and wrists.' },
    { key: 'chest', text: 'Chest<br>to floor', anchor: { at: 'sternum', pose: 'start' }, box: { left: 282, top: 282 }, cue: 'Lower until your chest touches the floor lightly.' },
  ],
  mistake: {
    pose: MISTAKE,
    guides: [
      { kind: 'arrow', from: { at: 'hip.r', pose: 'end' }, to: { at: 'hip.r', pose: 'mistake' } },
    ],
    tells: [
      { key: 'sag', text: 'Hips sag', anchor: { at: 'buttock', pose: 'mistake' }, box: { left: 28, top: 236 }, cue: 'Your hips sag toward the floor, below the line.' },
      { key: 'arch', text: 'Low back<br>arches', anchor: { at: 'backMid', pose: 'mistake' }, box: { left: 120, top: 186 }, cue: 'Your low back arches instead of staying braced.' },
    ],
  },
  tempo: [{ phase: 'Press', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],
  alt: 'Push-up, side view. From the chest touching the floor, palms flat under the shoulders and elbows out, the lifter presses up to straight arms, shoulders over the hands, the body one straight line from head to heels on the toes.',
};
