// Reverse crunch (on the floor, legs up 90/90), side view, facing right. LIB-SUPCORE wave 2 (LB9, H; D-SUPCORE-MODES:
// the pelvis rolls up under a still thorax, the reverse of crunch's curl, outside derive.mjs's PARAMS).
// View: SIDE (card plate.view = census view): the 90 deg knees (c2, c4), the hips curling off the floor (c3, c5) and the
//  knee tuck (c11) read in the sagittal plane.
// Clone source (D-LIB9-CLONE, D-SUPCORE-ANCHOR; copied, never imported): crunch's approved bytes (PILOT-B2, panel mx25
//  APPROVED @ 716bf3b7): `bisect`, `supine(top 0)`, `flatLying` (PELVIS_TUCK 15), the floor camera, the floor equipment,
//  the array trunk and the 2x2 root Newton (crunch.mjs MIS_ROOT), here with its own pair: the near shoulder kept where
//  it lies at the start (the thorax still, c3 "rolling the spine up").
// Sources: research card docs/research/howto/cards/reverse_crunch.json (research a48b0594): c1 (on the back, arms by
//  the sides, palms down pressing into the floor), c2 (knees over the hips at 90 deg, thighs vertical, shins parallel to
//  the floor, low back flat: the start), c3 (raise the hips and low back, knees toward the chest), c4 (the knee angle
//  stays 90 deg), c5 (until the tailbone clears the floor, arms for balance), c11 (the Mistake: the knees tucked too far
//  back, the weight onto the upper back), c21 (tempo 2-1-2, up 2, down 2, pause 1).
// Geometry (solved on the landmarks and on the drawn outlines in world metres):
//  - Start (plate.start, c1, c2): flatLying; the thighs vertical (the hip solved so knee.r is straight above hip.r), the
//    knees at KNEE 90 deg flexion (shins level with the floor), feet relaxed (ankle 0); the arms by the sides, elbows
//    straight, the shoulders solved so the drawn palm rests on the floor (hand 'flat', palms down).
//  - End (plate.end, c3-c5): the pelvis rolls ROLL deg (posterior) and the spine takes it back in flexion, shared over
//    the four spine pivots by D-LB9R3-SPLIT's sourced shares (lb9/sizes.json cable_crunch SPLIT_*), so the thorax keeps
//    its angle and the near shoulder stays where it lies (root Newton); the hip and knee angles stay (c4), so the knees
//    come toward the chest; the arms stay on the floor (c5, plate.end).
//  - Mistake (c11, key `tuck`): the knees tuck, KNEE + M_KNEE deg, and the hips flex M_HIP deg more, toward the chest.
// Trace (fixed before any measure, DRAWING-GUIDE.md:29): knee.r, the knees coming toward the chest (c3); trim [4, 6].
// Unsourced numbers (SIZES; lb9/sizes.json holds each with its basis): ROLL, M_KNEE, M_HIP.
import { landmarksOf, fk, resolve, normPose, bodyShapes, RADII } from '../engine.mjs';

const H = 1.75, BODY = { height: H };
export const SIZES = Object.freeze({ PELVIS_TUCK: 15, KNEE_DEG: 90, ROLL: 35, BACK_H: 0.045, SPLIT_L5S1: 0.123, SPLIT_L3: 0.341, SPLIT_T12: 0.246, SPLIT_T7: 0.29, M_KNEE: 40, M_HIP: 20 });
const { PELVIS_TUCK, KNEE_DEG: KNEE, ROLL, BACK_H, M_KNEE, M_HIP } = SIZES;
const SPLIT = [SIZES.SPLIT_L5S1, SIZES.SPLIT_L3, SIZES.SPLIT_T12, SIZES.SPLIT_T7];
const OCCIPUT = [0, 0.955, -0.056];                    // back of the skull on the side head outline (head frame, H): crunch's
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };

// ---- supine class (copied from crunch @ 716bf3b7; the bisect throws on a bracket with no root) ----
const bisect = (f, lo, hi) => { if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error(`reverse_crunch: no solution in [${lo}, ${hi}]`); for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
function supine(top, z = 0, { tilt = -90, height = H } = {}) {
  const at0 = { root: { at: [0, 0, z], tilt } };
  const lm = p => landmarksOf(p, height), b = { height };
  const occ = p => fk(resolve(normPose(p, b), b).q, b).head(OCCIPUT);
  const pad = lm(at0).buttock[1];
  const trunk = bisect(t => lm({ ...at0, trunk: t }).backUpper[1] - pad, -40, 30);
  const neck = bisect(n => occ({ ...at0, trunk, neck: n })[1] - pad, -40, 60);
  return { root: { at: [0, top - pad, z], tilt }, trunk, neck };
}
function flatLying(s, height = H) {
  const tilt = s.root.tilt - PELVIS_TUCK, at0 = { root: { at: [0, 0, s.root.at[2]], tilt } }, b = { height };
  const lm = p => landmarksOf(p, height), occ = p => fk(resolve(normPose(p, b), b).q, b).head(OCCIPUT);
  const pad = lm(at0).buttock[1];
  const trunk = bisect(t => lm({ ...at0, trunk: t }).backUpper[1] - pad, -40, 60);
  const neck = bisect(n => occ({ ...at0, trunk, neck: n })[1] - pad, -40, 60);
  return { root: { at: [0, -pad, s.root.at[2]], tilt }, trunk, neck };
}
const LYING = flatLying(supine(0, 0));

// the drawn outlines in world metres (z along the floor, y up), the open hand drawn
const SIDE = { view: 'side', near: 'r', pxm: 1, P: w => [w[2], -w[1]] };
const shapesOf = p => bodyShapes(fk(resolve(normPose(p, BODY), BODY).q, BODY), SIDE, { hand: 'flat' }).filter(s => s.poly);
const lowest = (p, re) => -Math.max(...shapesOf(p).filter(s => re.test(s.key)).flatMap(s => s.poly.map(q => q[1])));
const PALM = /^palm\./;
const trunkOf = roll => ({ flex: [0, LYING.trunk, 0, 0].map((a, i) => a + SPLIT[i] * roll) });

// start: the thighs vertical, the knees at 90, the palms on the floor
const base = { ...LYING, trunk: trunkOf(0), knee: KNEE, ankle: 0, elbow: 0 };
const thighTilt = h => { const l = landmarksOf({ ...base, hip: h }, H); return l['knee.r'][2] - l['hip.r'][2]; };
const HIP = bisect(h => -thighTilt(h), 40, 120);
// palms flat on the floor (hand 'flat', LIB-26; bird_dog's WRIST_Y): the wrist bent so the hand lies level, the shoulder
// solved so the wrist sits the forearm's distal radius above the floor, the palm side then on it
const WRIST_Y = RADII.fore[2] * H;
const levelHand = p => { const g = w => { const l = landmarksOf({ ...p, wrist: w }, H); return l['grip.r'][1] - l['wrist.r'][1]; };
  const lo = -60, hi = 60, w = g(lo) <= 0 ? bisect(g, lo, hi) : bisect(v => -g(v), lo, hi); return { ...p, wrist: w }; };
const palmsDown = p => levelHand({ ...p, shoulder: bisect(s => landmarksOf(levelHand({ ...p, shoulder: s }), H)['wrist.r'][1] - WRIST_Y, -30, 20) });
const start = palmsDown({ ...base, hip: HIP }), SH = start.shoulder;

// the pelvis rolled `roll` deg, the thorax still: the root solved so the near shoulder stays at the start's
const SH0 = landmarksOf(start, H)['shoulder.r'];
const rolled = (roll, extra = {}) => {
  const at = ([y, z]) => ({ ...start, ...extra, trunk: trunkOf(roll), root: { at: [0, y, z], tilt: LYING.root.tilt - roll } });
  const f = q => { const l = landmarksOf(at(q), H); return [l['shoulder.r'][1] - SH0[1], l['shoulder.r'][2] - SH0[2]]; };
  let q = [...LYING.root.at.slice(1)];
  for (let it = 0; it < 40; it++) {
    const r = f(q); if (Math.hypot(...r) < 1e-7) return at(q);
    const J = [0, 1].map(k => { const d = 1e-6, qq = [...q]; qq[k] += d; return f(qq).map((v, i) => (v - r[i]) / d); });
    const det = J[0][0] * J[1][1] - J[1][0] * J[0][1];
    q = [q[0] - (r[0] * J[1][1] - r[1] * J[1][0]) / det, q[1] - (J[0][0] * r[1] - J[0][1] * r[0]) / det];
  }
  throw new Error('reverse_crunch: the rolled root does not converge');
};
const end = rolled(ROLL);
const mistakePose = rolled(ROLL, { knee: KNEE + M_KNEE, hip: HIP + M_HIP });

const lmS = landmarksOf(start, H), lmE = landmarksOf(end, H), lmM = landmarksOf(mistakePose, H);
// the drawn torso underside (world y) at floor position z: the lowest crossing of the outline polygon (crunch's)
const underside = (p, z) => { const pts = shapesOf(p).find(s => s.key === 'torso').poly; let lo = -Infinity;
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[0] - z) * (b[0] - z) > 0 || a[0] === b[0]) continue; lo = Math.max(lo, a[1] + (b[1] - a[1]) * (z - a[0]) / (b[0] - a[0])); }
  return -lo; };
// 'Back down' (c2): the end's low back where it leaves the floor, BACK_H above it (the leader runs out under the curled
// hips, clear of the floor line), searched footward from the near shoulder
export const BACK_AT = (() => { for (let z = lmE['shoulder.r'][2]; z < lmE.buttock[2]; z += 0.001) if (underside(end, z) >= BACK_H) return [0, BACK_H, z]; throw new Error('reverse_crunch: no back point'); })();
const cm = v => +(v * 100).toFixed(2);
export const info = () => ({ HIP: +HIP.toFixed(3), SH: +SH.toFixed(3), tailboneLiftCm: cm(lmE.buttock[1] - lmS.buttock[1]), sacrumLiftCm: cm(lmE.sacrum[1]),
  backUpperCm: [cm(lmS.backUpper[1]), cm(lmE.backUpper[1]), cm(lmM.backUpper[1])], kneeMoveCm: cm(Math.hypot(lmE['knee.r'][1] - lmS['knee.r'][1], lmE['knee.r'][2] - lmS['knee.r'][2])),
  palmLowCm: [cm(lowest(start, PALM)), cm(lowest(end, PALM)), cm(lowest(mistakePose, PALM))] });

// mx27 R5: the fault leg as one closed dashed outline: the union of the Mistake's drawn near thigh, kneecap, shank and
// foot (world metres, side view), filled on a 4 mm grid and traced once around (Moore neighbour), every 3rd cell kept
const legOutline = p => {
  const polys = shapesOf(p).filter(x => /^(thigh|kneecap|shank|foot)\.r$/.test(x.key)).map(x => x.poly), G = 0.004;
  const xs = polys.flat().map(q => q[0]), ys = polys.flat().map(q => q[1]), x0 = Math.min(...xs) - 2 * G, y0 = Math.min(...ys) - 2 * G;
  const W = Math.ceil((Math.max(...xs) - x0) / G) + 3, Hh = Math.ceil((Math.max(...ys) - y0) / G) + 3;
  const inside = (P, x, y) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const on = (i, j) => i >= 0 && j >= 0 && i < W && j < Hh && polys.some(P => inside(P, x0 + i * G, y0 + j * G));
  let st = null; for (let j = 0; j < Hh && !st; j++) for (let i = 0; i < W; i++) if (on(i, j)) { st = [i, j]; break; }
  const N = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]], out = [st];
  let cur = st, dir = 6;
  for (let n = 0; n < 20000; n++) {
    let k = 0; for (; k < 8; k++) { const d = (dir + 6 + k) % 8, q = [cur[0] + N[d][0], cur[1] + N[d][1]]; if (on(q[0], q[1])) { cur = q; dir = d; break; } }
    if (k === 8 || (cur[0] === st[0] && cur[1] === st[1])) break;
    out.push(cur);
  }
  const pts = out.filter((_, i) => i % 3 === 0).map(([i, j]) => [0, -(y0 + j * G), x0 + i * G]);
  return [...pts, pts[0]];
};
export const FAULT_LEG = Object.freeze(legOutline(mistakePose));

export default {
  hand: 'flat',
  id: 'reverse_crunch', name: 'Reverse Crunch', view: 'side', facing: 'right',
  camera: { fit: true, maxScale: 1.35, y0: 339 },      // D-LIB8-floor: floor at y 339, width-filling scale <= x1.35
  poses: { start, end },
  equipment: [{ type: 'floor', from: -1.0, to: 0.8 }],
  checks: [
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, plane: { point: [0, WRIST_Y, 0], normal: [0, 1, 0] }, pose: 'start', tol: 0.5 })),   // palms flat on the floor (c1)
    { landmark: 'buttock', plane: FLOOR, pose: 'start', tol: 1 },               // low back flat at the start (c2)
    { landmark: 'backUpper', plane: FLOOR, pose: 'all', tol: 1 },               // the upper back stays down (c3)
    { landmark: 'buttock', above: FLOOR, pose: 'end' },                         // the tailbone clears the floor (c5)
  ],
  startParts: ['torso', 'leg.r', 'leg.l'],
  ghosts: { count: 2, parts: ['leg.r'] },
  trace: { point: 'knee.r', trim: [4, 6] },
  tempo: [{ phase: 'Curl', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  callouts: [
    { key: 'knees', text: 'Knees at 90', anchor: { at: 'knee.r', off: [-6, -3] }, box: { left: 20, top: 180 }, cue: 'Keep the knee angle at 90 degrees the whole rep.' },
    { key: 'hips', text: 'Hips curl up', anchor: 'buttock', box: { left: 256, top: 236 }, cue: 'Curl your hips and low back off the floor toward your ribs.' },
    { key: 'back', text: 'Back down', anchor: BACK_AT, box: { left: 212, top: 296 }, cue: 'Start with the low back flat on the floor, not arched.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'dashed', pts: FAULT_LEG.map(q => [...q]) },   // mx27 R5: one closed outline of the tucked leg
      { kind: 'arrow', from: { at: 'knee.r', pose: 'end', off: [-9, 5] }, to: { at: 'knee.r', pose: 'mistake', off: [3, -6] } },   // from the solid knee to the fault knee
    ],
    tells: [
      { key: 'tuck', text: 'Knees tuck', anchor: { at: 'knee.r', pose: 'mistake', off: [-9, 0] }, box: { left: 20, top: 206 }, cue: 'The knees tuck in toward your chest and the knee angle closes.' },
    ],
  },
  alt: 'Reverse crunch, side view. Lying on the back, arms by the sides and palms down, knees over the hips at 90 degrees, the lifter curls the hips and low back off the floor, knees toward the chest, then lowers.',
};
