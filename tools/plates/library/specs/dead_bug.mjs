// Dead bug (on a mat, arms and legs up), side view, facing right. LIB-SUPCORE wave 2 (LB9, H; D-SUPCORE-MODES: one arm
// and the opposite leg extend, a limb motion outside derive.mjs's PARAMS; `handedness` names a loaded side, not a pose).
// View: SIDE (card plate.view = census view): the knees over the hips (c3), the arm and leg lowering to just above the
//  floor (c4) and the low back on the mat (c5, c6) read in the sagittal plane.
// Clone source (D-LIB9-CLONE, D-SUPCORE-ANCHOR; copied, never imported): crunch's approved bytes (PILOT-B2, panel mx25
//  APPROVED @ 716bf3b7): `bisect`, `supine(top 0)`, `flatLying` (PELVIS_TUCK 15), the floor camera, the floor equipment,
//  the array trunk, the Mistake (crunch c6 form: the pelvis tips MIS_TILT forward, L3 takes it back, the root solved by
//  crunch's 2x2 Newton so the buttock stays on the floor and the shoulder keeps its z) and the drawn-outline floor
//  measure. The legs-up start is reverse_crunch's (this lane: the thighs vertical, the knees at 90).
// Sources: research card docs/research/howto/cards/dead_bug.json (research a48b0594): c1 (on the back on a mat), c3
//  (low back pressed into the mat; knees bent 90 deg directly over the hips, arms straight up above the chest), c4
//  (slowly lower one arm and the opposite leg until the hand and heel lightly touch the floor without resting; GGR's
//  pair: the right hand above the head and the left leg), c5 (the back stays flat on the mat), c6 (the Mistake: the
//  back arching), c8 (eyes to the ceiling).
// Geometry (solved on the landmarks and on the drawn outlines in world metres):
//  - Start (plate.start, c3): flatLying, the head resting; the thighs vertical (hip solved: knee.r over hip.r), knees KNEE
//    90 deg, ankles 0; both arms straight (elbow 0) and vertical (the shoulder solved: wrist.r over shoulder.r).
//  - End (plate.end, c4, c5): the near (right) arm overhead, the shoulder solved so the drawn fist is GAP above the
//    floor; the far (left) leg straight (knee 0), the hip solved so the drawn heel is GAP above the floor; the far arm and
//    the near leg as at the start; the low back and the head as at the start (c5, c8).
//  - Mistake (c6, key `arch`): the end with the pelvis tipped MIS_TILT forward and L3 taking it back (the thorax keeps
//    its angle), the root solved so the buttock stays on the floor and the near shoulder keeps its z; both hips take the
//    tip back so the legs keep their angle to the floor.
// Trace (fixed before any measure, DRAWING-GUIDE.md:29): wrist.r, the near hand lowering overhead (c4, checkpoint
//  'Opposite limbs'); trim [4, 6].
// Unsourced numbers (SIZES; lb9/sizes.json holds each with its basis): GAP, MIS_TILT.
import { landmarksOf, fk, resolve, normPose, bodyShapes } from '../engine.mjs';

const H = 1.75, BODY = { height: H };
export const SIZES = Object.freeze({ PELVIS_TUCK: 15, KNEE_DEG: 90, GAP: 0.02, MIS_TILT: 14 });
const { PELVIS_TUCK, KNEE_DEG: KNEE, GAP, MIS_TILT } = SIZES;
const OCCIPUT = [0, 0.955, -0.056];                    // back of the skull on the side head outline (head frame, H): crunch's
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };

// ---- supine class (copied from crunch @ 716bf3b7; the bisect throws on a bracket with no root) ----
const bisect = (f, lo, hi) => { if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error(`dead_bug: no solution in [${lo}, ${hi}]`); for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
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

// the drawn outlines in world metres (z along the floor, y up)
const SIDE = { view: 'side', near: 'r', pxm: 1, P: w => [w[2], -w[1]] };
const shapesOf = p => bodyShapes(fk(resolve(normPose(p, BODY), BODY).q, BODY), SIDE, { hand: 'flat' }).filter(s => s.poly);   // the open hand drawn (mx27 R7: no ring past the fingertips)
const lowest = (p, re) => -Math.max(...shapesOf(p).filter(s => re.test(s.key)).flatMap(s => s.poly.map(q => q[1])));
const trunk = (l5 = 0, l3 = LYING.trunk) => ({ flex: [l5, l3, 0, 0] });

// start: the thighs vertical, the knees at 90, both arms straight up
const base = { ...LYING, trunk: trunk(), knee: KNEE, ankle: 0, elbow: 0 };
const fwd = (p, a, b) => { const l = landmarksOf(p, H); return l[b][2] - l[a][2]; };
const HIP = bisect(h => -fwd({ ...base, hip: h }, 'hip.r', 'knee.r'), 40, 120);
const SH = bisect(s => -fwd({ ...base, hip: HIP, shoulder: s }, 'shoulder.r', 'wrist.r'), 40, 140);
const start = { ...base, hip: HIP, shoulder: SH };

// end: the near arm overhead and the far leg straight, fist and heel GAP above the floor
const SH_R = bisect(s => -(lowest({ ...start, shoulder: { l: SH, r: s } }, /^palm\.r$/) - GAP), 120, 200);
const HIP_L = bisect(h => lowest({ ...start, shoulder: { l: SH, r: SH_R }, hip: { l: h, r: HIP }, knee: { l: 0, r: KNEE } }, /^(shank|foot)\.l$/) - GAP, -30, 60);
const end = { ...start, shoulder: { l: SH, r: SH_R }, hip: { l: HIP_L, r: HIP }, knee: { l: 0, r: KNEE } };

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
  throw new Error(`dead_bug: the Mistake arch does not converge`);
};
const M0B = { ...end, hip: { l: HIP_L + MIS_TILT, r: HIP + MIS_TILT } }, M0 = archAt(M0B, ARCH(M0B));
// the far heel kept GAP above the floor (c4), solved again on the arched pose; the arms are the end's (the thorax still)
const M_HIP_L = bisect(h => lowest({ ...M0, hip: { l: h, r: HIP + MIS_TILT } }, /^(shank|foot)\.l$/) - GAP, -30, 60);
const mistakePose = { ...M0, hip: { l: M_HIP_L, r: HIP + MIS_TILT } };

const lmS = landmarksOf(start, H), lmE = landmarksOf(end, H), lmM = landmarksOf(mistakePose, H);
const cm = v => +(v * 100).toFixed(2);
// the drawn torso underside (world y) at floor position z: the lowest crossing of the outline polygon (crunch's)
const underside = (p, z) => { const pts = shapesOf(p).find(s => s.key === 'torso').poly; let lo = -Infinity;
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[0] - z) * (b[0] - z) > 0 || a[0] === b[0]) continue; lo = Math.max(lo, a[1] + (b[1] - a[1]) * (z - a[0]) / (b[0] - a[0])); }
  return -lo; };
const LUMBAR_Z = lmM.lumbar[2], gapTop = [0, underside(mistakePose, LUMBAR_Z), LUMBAR_Z], gapBot = [0, 0, LUMBAR_Z];
// mx27 R5: the arched low back's drawn underside where it has left the floor (over 0.5 cm), every 5 mm, as a red dashed
// line under the solid figure
export const ARCH_UNDER = Object.freeze((() => { const out = [];
  for (let z = lmM.backUpper[2]; z <= lmM.buttock[2]; z += 0.005) { const y = underside(mistakePose, z); if (Number.isFinite(y) && y > 0.005) out.push([0, y, z]); }
  return out; })());
export const info = () => ({ HIP: +HIP.toFixed(3), SH: +SH.toFixed(3), SH_R: +SH_R.toFixed(3), HIP_L: +HIP_L.toFixed(3),
  fistLowCm: cm(lowest(end, /^palm\.r$/)), heelLowCm: cm(lowest(end, /^(shank|foot)\.l$/)), misHeelLowCm: cm(lowest(mistakePose, /^(shank|foot)\.l$/)), misFistLowCm: cm(lowest(mistakePose, /^palm\.r$/)),
  underCm: [cm(underside(start, LUMBAR_Z)), cm(underside(end, LUMBAR_Z)), cm(gapTop[1])], buttock: [cm(lmS.buttock[1]), cm(lmE.buttock[1]), cm(lmM.buttock[1])] });

export default {
  hand: 'flat',
  id: 'dead_bug', name: 'Dead Bug', view: 'side', facing: 'right',
  camera: { fit: true, maxScale: 1.35, y0: 339 },      // D-LIB8-floor: floor at y 339, width-filling scale <= x1.35
  poses: { start, end },
  equipment: [{ type: 'floor', from: -1.2, to: 1.0 }],
  checks: [
    { landmark: 'buttock', plane: FLOOR, pose: 'all', tol: 1 },                 // low back on the mat (c3, c5)
    { landmark: 'backUpper', plane: FLOOR, pose: 'all', tol: 1 },
    { landmark: 'grip.r', above: FLOOR, pose: 'end' },                          // the hand above the floor, not resting (c4)
    { landmark: 'heel.l', above: FLOOR, pose: 'end' },                          // the heel above the floor, not resting (c4)
  ],
  zoom: [{ view: 'mistake', k: 2 }],   // the arch is under deviationMin at plate scale; the smallest passing ladder k
  startParts: ['arm.r', 'leg.l'],
  ghosts: { count: 0 },
  trace: { point: 'wrist.r', trim: [4, 6] },
  tempo: [{ phase: 'Lower', move: true, word: 'Slow' }, { phase: 'Return', move: true, word: 'Slow' }],   // the strip row proposed in DESIGN.md 26.4 (c4), written after #358 (D-SUPCORE-STRIP)
  callouts: [
    { key: 'lowback', text: 'Low back<br>down', anchor: 'navel', box: { left: 138, top: 194 }, cue: 'Keep your low back flat on the mat every rep.' },
    { key: 'knees', text: 'Knees over<br>hips', anchor: { at: 'knee.r', off: [8, -6] }, box: { left: 258, top: 186 }, cue: 'Knees bent 90 degrees, right over your hips.' },
    { key: 'opposite', text: 'Opposite<br>limbs', anchor: { along: ['knee.l', 'ankle.l'], t: 0.5, off: [0, -6] }, box: { left: 214, top: 270 }, cue: 'Lower one arm and the opposite leg together, just above the floor.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: [{ kind: 'dashed', pts: [gapBot, gapTop] }, { kind: 'dashed', pts: ARCH_UNDER.map(q => [...q]) }],
    tells: [
      { key: 'arch', text: 'Low back<br>arches', anchor: { at: 'lumbar', pose: 'mistake', off: [0, -1] }, box: { left: 138, top: 206 }, cue: 'Your low back arches off the mat as the arm and leg lower.' },
    ],
  },
  alt: 'Dead bug, side view. Lying on the back with the low back on the mat, knees over the hips at 90 degrees and arms straight up, the lifter lowers one arm overhead and the opposite leg until hand and heel are just above the floor, then returns.',
};
