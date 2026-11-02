// Flutter kicks (on the floor, straight legs off the floor), side view, facing right. LIB-SUPCORE wave 2 (LB9, H;
// D-SUPCORE-MODES: short alternating kicks, a limb motion outside derive.mjs's PARAMS).
// View: SIDE (card plate.view = census view): the feet off the floor (c2, c5), the kicks (c3) and the low back on the
//  floor (c4, c7) read in the sagittal plane.
// Clone source (D-LIB9-CLONE, D-SUPCORE-ANCHOR; copied, never imported): crunch's approved bytes (PILOT-B2, panel mx25
//  APPROVED @ 716bf3b7): `bisect`, `supine(top 0)`, `flatLying` (PELVIS_TUCK 15), the floor camera, the floor equipment,
//  the array trunk, the Mistake (crunch c6 form: the pelvis tips MIS_TILT forward, L3 takes it back) and the drawn-
//  outline floor measure; reverse_crunch's palms-down arms (this lane).
// Sources: research card docs/research/howto/cards/flutter_kicks.json (research a48b0594): c1 (on the floor, legs
//  straight, arms by the sides, palms flat), c2 (the low back on the floor, the feet several inches off it), c3 (the legs
//  up and down alternately in short, crisp movements), c4 (the low back flat on the floor throughout), c5 (both feet off
//  the floor, knees straight, kicks from the hips), c7 (the Mistake: the low back arching), c9 (short, quick kicks).
// Geometry (solved on the landmarks and on the drawn outlines in world metres):
//  - Start (plate.start, c1, c2, c4): flatLying, the head resting; arms by the sides, elbows straight, the shoulders
//    solved so the drawn palms rest on the floor (hand 'flat'); legs straight (knee 0) and together, the hips solved so
//    the drawn heels are FEET above the floor.
//  - End (plate.end, c3, c5): the near (right) hip flexes KICK deg (the leg higher) and the far (left) hip extends KICK
//    deg (lower), knees straight; the rest as at the start.
//  - Mistake (c7, key `arch`): the end with the pelvis tipped MIS_TILT forward, the root height and L3 solved so the
//    buttock and the upper back stay on the floor; both hips take the tip back (the legs keep their angle to the floor)
//    and the shoulders are solved again so the palms stay on the floor.
// Trace (fixed before any measure, DRAWING-GUIDE.md:29; the card frames: "Trace follows the near foot"): heel.r; trim
//  [4, 6].
// Unsourced numbers (SIZES; lb9/sizes.json holds each with its basis): FEET, KICK, MIS_TILT.
import { landmarksOf, fk, resolve, normPose, bodyShapes, RADII } from '../engine.mjs';

const H = 1.75, BODY = { height: H };
export const SIZES = Object.freeze({ PELVIS_TUCK: 15, FEET: 0.1016, KICK: 4, MIS_TILT: 14 });
const { PELVIS_TUCK, FEET, KICK, MIS_TILT } = SIZES;
const OCCIPUT = [0, 0.955, -0.056];                    // back of the skull on the side head outline (head frame, H): crunch's
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };

// ---- supine class (copied from crunch @ 716bf3b7; the bisect throws on a bracket with no root) ----
const bisect = (f, lo, hi) => { if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error(`flutter_kicks: no solution in [${lo}, ${hi}]`); for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
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
const PALM = /^palm\./, HEEL = sd => new RegExp(`^foot\\.${sd}$`);
const trunk = (l3 = LYING.trunk) => ({ flex: [0, l3, 0, 0] });

// start: palms on the floor, the heels FEET above it
const base = { ...LYING, trunk: trunk(), knee: 0, ankle: 0, elbow: 0 };
// palms flat on the floor (hand 'flat', LIB-26; bird_dog's WRIST_Y): the wrist bent so the hand lies level, the shoulder
// solved so the wrist sits the forearm's distal radius above the floor, the palm side then on it
const WRIST_Y = RADII.fore[2] * H;
const levelHand = p => { const g = w => { const l = landmarksOf({ ...p, wrist: w }, H); return l['grip.r'][1] - l['wrist.r'][1]; };
  const lo = -60, hi = 60, w = g(lo) <= 0 ? bisect(g, lo, hi) : bisect(v => -g(v), lo, hi); return { ...p, wrist: w }; };
const palmsDown = p => levelHand({ ...p, shoulder: bisect(s => landmarksOf(levelHand({ ...p, shoulder: s }), H)['wrist.r'][1] - WRIST_Y, -30, 20) });
const arms = palmsDown(base), SH = arms.shoulder;
const HIP = bisect(h => lowest({ ...arms, hip: h }, HEEL('r')) - FEET, -40, 40);
const start = { ...arms, hip: HIP };
// end: the near leg KICK higher, the far leg KICK lower
const end = { ...start, hip: { l: HIP - KICK, r: HIP + KICK } };

// the arch (crunch c6 form, here with the thorax held exactly as in the end: only the pelvis, the low back and the legs
// move): the pelvis tips MIS_TILT forward and L3 and T12 take it back between them; Newton on (root
// y, root z, L3) keeps the near shoulder where it is in the end and the buttock on the floor; throws when it does not
// converge (no silent fallback)
const SH_E = landmarksOf(end, H)['shoulder.r'];
const archAt = (base, [y, z, l3]) => ({ ...base, trunk: { flex: [0, l3, base.trunk.flex[2] + LYING.trunk - MIS_TILT - l3, 0] }, root: { at: [0, y, z], tilt: LYING.root.tilt + MIS_TILT } });
const solve3 = (A, b) => { const M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < 3; c++) { const p = M.slice(c).reduce((a, r, i) => (Math.abs(r[c]) > Math.abs(M[a][c]) ? i + c : a), c); [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < 3; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k < 4; k++) M[r][k] -= f * M[c][k]; } }
  return M.map((r, i) => r[3] / r[i]); };
const ARCH = base => {
  const f = q => { const l = landmarksOf(archAt(base, q), H); return [l.buttock[1], l['shoulder.r'][1] - SH_E[1], l['shoulder.r'][2] - SH_E[2]]; };
  let q = [LYING.root.at[1], LYING.root.at[2], LYING.trunk - MIS_TILT];
  for (let it = 0; it < 60; it++) {
    const r = f(q); if (Math.hypot(...r) < 1e-8) return q;
    const J = [0, 1, 2].map(k => { const d = 1e-6, qq = [...q]; qq[k] += d; return f(qq).map((v, i) => (v - r[i]) / d); });
    const dq = solve3([0, 1, 2].map(i => [0, 1, 2].map(k => J[k][i])), r.map(v => -v)); q = q.map((v, i) => v + dq[i]);
  }
  throw new Error(`flutter_kicks: the Mistake arch does not converge`);
};
// the hips take the tip back (the legs keep their angle to the floor); the arms are the end's (the thorax still)
const M0B = { ...end, hip: { l: HIP - KICK + MIS_TILT, r: HIP + KICK + MIS_TILT } }, mistakePose = archAt(M0B, ARCH(M0B));

const lmS = landmarksOf(start, H), lmE = landmarksOf(end, H), lmM = landmarksOf(mistakePose, H);
const cm = v => +(v * 100).toFixed(2);
const underside = (p, z) => { const pts = shapesOf(p).find(s => s.key === 'torso').poly; let lo = -Infinity;
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[0] - z) * (b[0] - z) > 0 || a[0] === b[0]) continue; lo = Math.max(lo, a[1] + (b[1] - a[1]) * (z - a[0]) / (b[0] - a[0])); }
  return -lo; };
const LUMBAR_Z = lmM.lumbar[2], gapTop = [0, underside(mistakePose, LUMBAR_Z), LUMBAR_Z], gapBot = [0, 0, LUMBAR_Z];
// mx27 R5: the arched low back's drawn underside where it has left the floor (over 0.5 cm), every 5 mm, as a red dashed
// line under the solid figure
export const ARCH_UNDER = Object.freeze((() => { const out = [];
  for (let z = lmM.backUpper[2]; z <= lmM.buttock[2]; z += 0.005) { const y = underside(mistakePose, z); if (Number.isFinite(y) && y > 0.005) out.push([0, y, z]); }
  return out; })());
export const info = () => ({ SH: +SH.toFixed(3), HIP: +HIP.toFixed(3), heelCm: { start: [cm(lowest(start, HEEL('r'))), cm(lowest(start, HEEL('l')))], end: [cm(lowest(end, HEEL('r'))), cm(lowest(end, HEEL('l')))], mistake: [cm(lowest(mistakePose, HEEL('r'))), cm(lowest(mistakePose, HEEL('l')))] },
  palmCm: [cm(lowest(start, PALM)), cm(lowest(mistakePose, PALM))], underCm: [cm(underside(start, LUMBAR_Z)), cm(underside(end, LUMBAR_Z)), cm(gapTop[1])], buttock: [cm(lmS.buttock[1]), cm(lmE.buttock[1]), cm(lmM.buttock[1])] });

export default {
  hand: 'flat',
  id: 'flutter_kicks', name: 'Flutter Kicks', view: 'side', facing: 'right',
  camera: { fit: true, maxScale: 1.35, y0: 339 },      // D-LIB8-floor: floor at y 339, width-filling scale <= x1.35
  poses: { start, end },
  equipment: [{ type: 'floor', from: -1.0, to: 1.1 }],
  checks: [
    ...['wrist.l', 'wrist.r'].map(landmark => ({ landmark, plane: { point: [0, WRIST_Y, 0], normal: [0, 1, 0] }, pose: 'start', tol: 0.5 })),   // palms flat on the floor (c1)
    { landmark: 'buttock', plane: FLOOR, pose: 'all', tol: 1 },                 // low back flat on the floor throughout (c4)
    { landmark: 'backUpper', plane: FLOOR, pose: 'all', tol: 1 },
    { landmark: 'heel.r', above: FLOOR, pose: 'all' },                          // both feet off the floor (c2, c5)
    { landmark: 'heel.l', above: FLOOR, pose: 'all' },
  ],
  zoom: [{ view: 'normal', k: 3.5 }, { view: 'mistake', k: 2 }],   // neither view reaches its PQ-H3 bar at plate scale; the smallest passing ladder k per view
  startParts: ['leg.r'],
  ghosts: { count: 1, parts: ['leg.r', 'leg.l'] },   // D-SUPCORE-KICKDATUM (#366 6580574917): the in-between legs show the alternation
  // D-SUPCORE-KICKDATUM: a plumb beside the heels spanning the near heel's kick and the far heel's (the main drawing only)
  datum: [{ x: { at: 'toe.r', off: [10, 0] }, from: { at: 'heel.r', off: [0, -6] }, to: { at: 'heel.l', off: [0, 6] }, mistake: false }],
  trace: { point: 'heel.r', trim: [4, 6] },
  tempo: [{ phase: 'Kick', move: true, word: 'Crisp' }],   // tempoOf(strip/rows.json flutter_kicks) (D-STRIP-ROWS; c3)
  callouts: [
    { key: 'flat', text: 'Low back<br>flat', anchor: 'navel', box: { left: 36, top: 236 }, cue: 'Flatten your low back to the floor and keep it there.' },
    { key: 'feet', text: 'Feet lifted', anchor: { at: 'toe.r', off: [3, 0] }, box: { left: 204, top: 264 }, cue: 'Both feet several inches off the floor, knees straight.' },   // mx27 R4: on the near foot
    { key: 'short', text: 'Short kicks', anchor: { along: ['hip.r', 'knee.r'], t: 0.5, off: [0, -7] }, box: { left: 126, top: 204 }, cue: 'Short, quick, alternating kicks from the hips.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: [{ kind: 'dashed', pts: [gapBot, gapTop] }, { kind: 'dashed', pts: ARCH_UNDER.map(q => [...q]) }],
    tells: [
      { key: 'arch', text: 'Low back<br>arches', anchor: { at: 'lumbar', pose: 'mistake' }, box: { left: 120, top: 200 }, cue: 'Your low back arches off the floor as the legs kick.' },
    ],
  },
  alt: 'Flutter kicks, side view. Lying on the back, arms by the sides and palms flat, low back on the floor, the lifter holds both straight legs a few inches up and kicks them up and down in short alternating moves.',
};
