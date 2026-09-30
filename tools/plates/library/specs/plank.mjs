// Forearm plank, side view, figure facing screen right (head right, feet left), face down.
// View: side (card plate.view): every plank fault (sag, hiked hips, bent knees, shoulders not over the elbows) is a line.
// Hold class: entry pose (dashed start) -> held pose (solid end); the trace follows the hips into the hold.
// Form (research card plank, claims): c1 start lying face down, elbows under the shoulders, palms down; c2 legs
//  straight, toes pulled toward the shins; c3 lift the whole body slowly, trunk and legs stiff; c4 no sagging low
//  back, no hiked hips, no bent knees; c5 shoulders directly over the elbows, no shrug.
// Geometry decisions (confirmed by the report `angles` and `checks`):
//  Forearm contact: the engine has no forearm-plant IK, so the forearm is placed with the hand IK: the fist centre is
//   put on the floor (reach, GRIP_Y = fist radius 3.5 cm) at the forearm+hand length in front of a point straight
//   under the shoulder, with the elbow pole straight down. With the elbow held at ELBOW_Y (4 cm: elbow cap and
//   forearm radius) the two-bone solution puts the elbow exactly under the shoulder and the forearm flat on the floor.
//   Checks prove it: the elbow landmark sits ELBOW_Y above the floor and straight under the shoulder (same z) in both
//   poses, the grip on the floor.
//  Feet: the engine foot is rigid (no toe joint), so "toes tucked" is drawn as the ankle at ANKLE deg with the toe tip
//   on the floor (check); the toes stay on the same floor spot (TOE_Z) in both poses.
//  Held pose: one straight line, shoulders to heels: trunk, hip and knee all 0 relative to the pelvis (the standing
//   outline rotated), neck 0 (head in line, eyes to the floor); the pelvis tilt, root and nothing else are solved (Newton,
//   finite differences) so that the elbow is under the shoulder at ELBOW_Y and the toe tip is on the floor at TOE_Z.
//  Entry pose (card c1/c2, the textbook set-up): lying face down propped on the forearms: forearms, elbows and
//   shoulders exactly as in the hold (the forearms do not move when the body lifts), belly resting on the floor
//   (navel landmark NAVEL_Y above it), thighs down with ENTRY_HIP deg of hip extension, legs straight, toes tucked on
//   the same spot; solved for root, pelvis tilt, lumbar extension and ankle angle. With the shoulders held over the
//   elbows the lumbar spine takes ~40 deg of extension (the engine bends the spine at one pivot, L3), which is the
//   prone-on-elbows set-up. Only the hips and legs move between the two poses; the trace is the hips rising.
//  Hands: the engine fist sits one grip offset past the wrist, so a small gap shows between the forearm and the fist
//   when nothing covers the hand (engine look, unchanged).
// Plate text (card plank plate, source-checked, not yet critic-verified, so provisional):
//  Callouts = the 3 plate.checkpoints (c5 elbows under shoulders, c4 hips level, c4 knees straight). Datum = the plank
//   line, shoulder to heel of the held pose, run past both ends (the held pose lies on it; the sag drops below it).
//  Mistake = plate.mistake (c4, drawable): the low back sags, hips below the shoulder-heel line (solved: SAG_LUMBAR).
//  Tells: the card's plate.tells ("Shoulders stay over your elbows", "You can keep breathing") are signs of good form,
//   not signs of the fault, so the Mistake tells restate plate.mistake.what (hips drop, low back sags; c4). Flagged on
//   PR #109 for the critic.
//  Measure: none. The card gives no angle, and the body line is the datum (a 180 deg arc at the hip reads as noise).
//  Tempo: left out. The card gives Hold 5+ s only (c6) and no Set or Rest seconds; the engine strip needs seconds for
//   every phase, and none may be invented (pilot note, PR #109).
// CARD (checked against card v2): from the card: elbows under the shoulders (c5), straight line and straight knees
//  (c4), entry face down on the forearms with the belly down (c1: NAVEL_Y), toes pulled toward the shins (c2: ANKLE).
//  Not in the card, left flagged: ENTRY_HIP (-10 deg thigh extension lying down), SAG_LUMBAR (how far the Mistake
//  sags). TOE_Z follows from the body model.
import { landmarksOf } from '../engine.mjs';

const H = 1.75;
const L_UA = 0.186 * H, L_FG = (0.146 + 0.46 * 0.108) * H;   // upper arm; elbow to grip centre (straight wrist)
const ELBOW_Y = 0.04, GRIP_Y = 0.035;                         // elbow joint and fist centre heights on the floor (m)
const SH_Y = ELBOW_Y + L_UA;                                  // shoulder straight over the elbow
const TOE_Z = -1.10;                                          // toe tips on the floor (m)
const ANKLE = 0;                                              // hold: foot at right angles to the shin (toes tucked)
const NAVEL_Y = 0.01;                                         // entry: belly front (navel landmark) resting on the floor
const ENTRY_HIP = -10;                                        // entry: hip extension (deg) with the thighs down on the floor
const ARM_X = 0.259 * H / 2;                                  // elbows straight under the shoulders (shoulder width)

// Newton solve with finite differences: find params p (object of numbers) so residuals(pose(p)) = 0.
function solve(p0, make, res, iters = 30) {
  const keys = Object.keys(p0); let p = { ...p0 };
  const f = q => res(landmarksOf(make(q), H));
  for (let it = 0; it < iters; it++) {
    const r = f(p); if (Math.hypot(...r) < 1e-6) break;
    const J = keys.map(k => { const d = 1e-5, q = { ...p, [k]: p[k] + d }; return f(q).map((v, i) => (v - r[i]) / d); });
    // solve J^T x = -r (J is n x n, stored by column)
    const n = keys.length, A = Array.from({ length: n }, (_, i) => [...keys.map((_, j) => J[j][i]), -r[i]]);
    for (let c = 0; c < n; c++) {
      let m = c; for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[m][c])) m = i;
      [A[c], A[m]] = [A[m], A[c]];
      for (let i = 0; i < n; i++) if (i !== c) { const k = A[i][c] / A[c][c]; for (let j = c; j <= n; j++) A[i][j] -= k * A[c][j]; }
    }
    keys.forEach((k, i) => { p[k] += A[i][n] / A[i][i]; });
  }
  return p;
}

// Arms: shoulder flexed so the upper arm is vertical, the fist on the floor in front of the elbow (see header).
const arms = (lm) => {
  const g = s => [s * ARM_X, GRIP_Y, lm[`shoulder.${s > 0 ? 'l' : 'r'}`][2] + Math.sqrt(L_FG ** 2 - (ELBOW_Y - GRIP_Y) ** 2)];
  return { l: { at: g(1), pole: [0, -1, 0] }, r: { at: g(-1), pole: [0, -1, 0] } };
};
const body = q => ({ root: { at: [0, q.y, q.z], tilt: q.tilt }, trunk: q.trunk ?? 0, neck: 0, hip: q.hip ?? 0, knee: 0, ankle: q.ankle ?? ANKLE, shoulder: { flex: 90 }, elbow: 90 });
const withArms = q => { const b = body(q); return { ...b, reach: arms(landmarksOf(b, H)) }; };

// Held pose: unknowns root y, z and pelvis tilt; shoulder at SH_Y, toe tip on the floor at TOE_Z.
const HQ = solve({ y: 0.3, z: -0.2, tilt: 80 }, body, lm => [lm['shoulder.r'][1] - SH_Y, lm['toe.r'][1], lm['toe.r'][2] - TOE_Z]);
const end = withArms(HQ);
const SH = landmarksOf(end, H)['shoulder.r'];
// Entry pose: same shoulder (so the same forearms), pelvis on the floor, toes on the same spot.
const entry = q => body({ ...q, hip: ENTRY_HIP });
const EQ = solve({ y: 0.1, z: HQ.z, tilt: 90, trunk: -20, ankle: 0 }, entry,
  lm => [lm['shoulder.r'][1] - SH[1], lm['shoulder.r'][2] - SH[2], lm.navel[1] - NAVEL_Y, lm['toe.r'][1], lm['toe.r'][2] - TOE_Z]);
const start = { ...entry(EQ), reach: end.reach };
// Mistake (card plate.mistake, c4): the low back sags, the hips drop below the shoulder-heel line. Forearms and toes
// stay on their floor spots (same shoulder, same toe tip); the lumbar spine extends SAG_LUMBAR deg and the pelvis,
// root and hip angle are solved so the shoulder and the toe tip do not move. How far it sags is a drawing choice
// (the card gives no number): enough to read in 2 seconds at 390 px.
const SAG_LUMBAR = -30;
// The plank line (datum): shoulder to heel of the held pose, run LINE_RUN m past each end so it shows beyond the body
// (the engine draws datums under the figure).
const LINE_RUN = 0.22;
const LINE = (() => {
  const lm = landmarksOf(end, H), a = lm['shoulder.r'], b = lm['heel.r'], d = b.map((v, i) => v - a[i]), n = Math.hypot(...d);
  return [a.map((v, i) => v - d[i] / n * LINE_RUN), b.map((v, i) => v + d[i] / n * LINE_RUN)];
})();
const sag = q => body({ ...q, trunk: SAG_LUMBAR });
const MQ = solve({ y: HQ.y - 0.05, z: HQ.z, tilt: HQ.tilt, hip: -5 }, sag,
  lm => [lm['shoulder.r'][1] - SH[1], lm['shoulder.r'][2] - SH[2], lm['toe.r'][1], lm['toe.r'][2] - TOE_Z]);
const MISTAKE = { ...sag(MQ), reach: end.reach };

const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };
const onFloor = (landmark, tol = 0.5) => ({ landmark, plane: FLOOR, pose: 'all', tol });

export default {
  id: 'plank', name: 'Plank', view: 'side', facing: 'right',
  camera: { x0: 205, y0: 250 },
  poses: { start, end },
  equipment: [{ type: 'floor', from: -1.35, to: 0.6 }],
  checks: [
    { landmark: 'elbow.r', plane: { point: [0, ELBOW_Y, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },   // forearm down
    { landmark: 'elbow.r', plane: { point: SH, normal: [0, 0, 1] }, pose: 'all', tol: 0.5 },                  // elbow under the shoulder
    { landmark: 'grip.r', plane: { point: [0, GRIP_Y, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },      // fist on the floor
    onFloor('toe.r'),
    { landmark: 'navel', plane: { point: [0, NAVEL_Y, 0], normal: [0, 1, 0] }, pose: 'start', tol: 0.5 },     // entry: belly down
  ],
  ghosts: { count: 2, parts: ['trunk', 'leg.r'] },
  trace: { point: 'hip.r', trim: [4, 6] },
  // The plank line, shoulder to heel: the held pose lies on it (c4); in the Mistake the hips drop below it.
  datum: [{ x: 0, from: 0, to: 0, line: LINE }],
  callouts: [
    { key: 'elbows', text: 'Elbows under<br>shoulders', anchor: 'elbow.r', cue: 'Stack the shoulders right over the elbows, and don\'t shrug.' },
    { key: 'hips', text: 'Hips level', anchor: 'buttock', cue: 'Hold one line: no sagging low back and no hiked hips.' },
    { key: 'knees', text: 'Knees straight', anchor: 'knee.r', cue: 'Keep the legs straight and stiff through the whole hold.' },
  ],
  mistake: {
    pose: MISTAKE,
    guides: [
      { kind: 'arrow', from: { at: 'hip.r', pose: 'end' }, to: { at: 'hip.r', pose: 'mistake' } },
    ],
    tells: [
      { key: 'drop', text: 'Hips drop', anchor: { at: 'buttock', pose: 'mistake' }, cue: 'The hips drop below the shoulder-to-heel line.' },
      { key: 'sag', text: 'Low back<br>sags', anchor: { at: 'backMid', pose: 'mistake' }, cue: 'The low back sags toward the floor.' },
    ],
  },
  pilot: { note: 'Tempo left out: card gives Hold 5+ s only, no Set or Rest seconds (c6).' },
  alt: 'Forearm plank, side view. From lying face down propped on the forearms, elbows under the shoulders and toes tucked, the hips lift until the body forms one straight line from the head to the heels, knees straight, shoulders over the elbows.',
};
