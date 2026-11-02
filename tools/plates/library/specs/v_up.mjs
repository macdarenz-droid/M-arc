// V-up (on the floor), side view, facing right. LIB-SUPCORE wave 2 (LB9, H; D-SUPCORE-MODES: the legs and torso rise to
// a V, outside derive.mjs's PARAMS; its card parent hollow_body_hold is in no golden file).
// View: SIDE (card plate.view = census view): the low back on the floor (c5, c6), the V (c3) and the straight legs (c8)
//  read in the sagittal plane.
// Pose map (lb9/tempo.json poseMap, the push_up form): the spec start is plate.end (the V) and the spec end is
//  plate.start (lying), because plate.mistake places the arch at the start of the rep (c6, c5) and the Mistake overrides
//  the spec end (plate.mjs:78).
// Clone source (D-LIB9-CLONE, D-SUPCORE-ANCHOR; copied, never imported): crunch's approved bytes (PILOT-B2, panel mx25
//  APPROVED @ 716bf3b7): `bisect`, `supine(top 0)`, `flatLying` (PELVIS_TUCK 15), the floor camera, the floor equipment,
//  the array trunk with SPLIT [0, 0, 1, 0] (D-SUPCORE-SPLIT; the V's upper-body curl CURL, crunch's END_CURL), the
//  Mistake (crunch c6 form: the pelvis tips MIS_TILT forward, L3 takes it back) and the drawn-outline floor measure;
//  bird_dog's Winter centre of mass (bear_crawl @ a9c64e11).
// Sources: research card docs/research/howto/cards/v_up.json (research a48b0594): c1 (lying face up, legs straight, feet
//  pressed together, arms above the head), c3 (lift the legs and torso together, reach toward the toes), c4 (the return
//  ends with the heels a few inches off the floor, the back flat), c5, c6 (the low back on the floor; the Mistake: the
//  low back arching at the start), c8 (legs as straight as possible).
// Geometry (solved on the landmarks and on the drawn outlines in world metres):
//  - Lying (spec end, plate.start, c1, c4): flatLying, the head resting; legs straight (knee 0) and together, the hips
//    solved so the drawn heels hover HOVER above the floor (c4); arms straight overhead (elbow 0), the shoulders solved
//    so the drawn forearms and fists rest on the floor (c1, PLAN RULED Q2).
//  - V (spec start, plate.end, c3, c8): the pelvis rocks back onto the buttock (tilt solved so the thorax is THORAX_V deg
//    off the floor with the T12 curl CURL and the lumbar pivots straight), the root set so the drawn torso's lowest point is on the floor; legs straight
//    and together, the hips solved so the Winter centre of mass sits over that contact (the V balances on the buttock);
//    arms straight, the shoulders solved so the wrists lie on the line from the shoulder to the toes (c3 "reach toward the
//    toes").
//  - Mistake (c6, key `arch`, on the spec end): the pelvis tips MIS_TILT forward, the root height and L3 solved so the
//    buttock and the upper back stay on the floor; the heels kept HOVER above it and the arms on it (solved again).
// Trace (fixed before any measure, DRAWING-GUIDE.md:29): wrist.r, the hands reaching (c3, checkpoint 'Reach to toes');
//  trim [4, 6].
// Unsourced numbers (SIZES; lb9/sizes.json holds each with its basis): HOVER, THORAX_V, CURL, MIS_TILT.
import { landmarksOf, fk, resolve, normPose, bodyShapes } from '../engine.mjs';

const H = 1.75, BODY = { height: H };
export const SIZES = Object.freeze({ PELVIS_TUCK: 15, HOVER: 0.0762, THORAX_V: 65, CURL: 25, MIS_TILT: 14 });
const { PELVIS_TUCK, HOVER, THORAX_V, CURL, MIS_TILT } = SIZES;
const OCCIPUT = [0, 0.955, -0.056];                    // back of the skull on the side head outline (head frame, H): crunch's
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };

// ---- supine class (copied from crunch @ 716bf3b7; the bisect throws on a bracket with no root) ----
const bisect = (f, lo, hi) => { if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error(`v_up: no solution in [${lo}, ${hi}]`); for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
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
const lowZ = (p, re) => { let best = null; for (const s of shapesOf(p)) if (re.test(s.key)) for (const q of s.poly) if (!best || q[1] > best[1]) best = q; return best[0]; };
const HEELS = /^foot\./, FORE = /^(fore|fist|palm)\./, TORSO = /^torso$/;
const trunk = (l3 = LYING.trunk, t12 = 0) => ({ flex: [0, l3, t12, 0] });
const mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
/** Winter (2009) whole-body centre of mass on the drawn landmarks (bird_dog.mjs, from bear_crawl.mjs @ a9c64e11). */
function com(lm) {
  let m = 0; const c = [0, 0, 0];
  const seg = (w, p) => { m += w; for (let i = 0; i < 3; i++) c[i] += w * p[i]; };
  seg(0.081, lm.ear); seg(0.497, mid(lm.shoulders, lm.hips, 0.5));
  for (const s of ['l', 'r']) {
    seg(0.028, mid(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)); seg(0.016, mid(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)); seg(0.006, lm[`grip.${s}`]);
    seg(0.100, mid(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)); seg(0.0465, mid(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)); seg(0.0145, mid(lm[`heel.${s}`], lm[`toe.${s}`], 0.5));
  }
  return c.map(v => v / m);
}

// lying (spec end): heels hovering, arms resting overhead
const legsUp = (p, hover) => ({ ...p, hip: bisect(h => lowest({ ...p, hip: h }, HEELS) - hover, -40, 40) });
const armsDown = p => ({ ...p, shoulder: bisect(s => -lowest({ ...p, shoulder: s }, FORE), 150, 220) });
const end = armsDown(legsUp({ ...LYING, trunk: trunk(), knee: 0, ankle: 0, elbow: 0 }, HOVER));

// V (spec start): the pelvis rocked back, the T12 curl, the thorax THORAX_V off the floor, resting on the buttock
const thoraxDeg = p => { const sk = fk(resolve(normPose(p, BODY), BODY).q, BODY), a = sk.thorax([0, 0.62, 0]), b = sk.thorax([0, 0.80, 0]); return Math.atan2(b[1] - a[1], a[2] - b[2]) * 180 / Math.PI; };
const vBase = { ...LYING, trunk: trunk(0, CURL), knee: 0, ankle: 0, elbow: 0, hip: 90 };
const TILT_V = bisect(t => thoraxDeg({ ...vBase, root: { at: [0, 0.3, 0], tilt: t } }) - THORAX_V, LYING.root.tilt, 0);
const onButt = p => { const y = lowest({ ...p, root: { at: [0, 0, 0], tilt: TILT_V } }, TORSO); return { ...p, root: { at: [0, -y, 0], tilt: TILT_V } }; };
// the reach: the shoulders solved so the wrist lies on the line from the shoulder to the toe (c3)
const reachOf = p => { const off = s => { const l = landmarksOf({ ...p, shoulder: s }, H), a = l['shoulder.r'], b = l['toe.r'], w = l['wrist.r'];
  return (b[2] - a[2]) * (w[1] - a[1]) - (b[1] - a[1]) * (w[2] - a[2]); }; return { ...p, shoulder: bisect(off, 0, 180) }; };
// the hips solved so the centre of mass (arms reaching) sits over the drawn torso's floor contact
const comOff = h => { const p = reachOf(onButt({ ...vBase, hip: h })); return com(landmarksOf(p, H))[2] - lowZ(p, TORSO); };
const HIP_V = bisect(h => -comOff(h), 60, 140);
const start = reachOf(onButt({ ...vBase, hip: HIP_V })), SH_V = start.shoulder;

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
  throw new Error(`v_up: the Mistake arch does not converge`);
};
// the heels kept HOVER above the floor (solved again on the arched pose); the arms are the end's (the thorax still)
const M0 = archAt(end, ARCH(end)), mistakePose = legsUp(M0, HOVER);

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
const legDeg = l => Math.atan2(l['ankle.r'][1] - l['hip.r'][1], l['ankle.r'][2] - l['hip.r'][2]) * 180 / Math.PI;
export const info = () => ({ TILT_V: +TILT_V.toFixed(3), HIP_V: +HIP_V.toFixed(3), SH_V: +SH_V.toFixed(3), endHip: +end.hip.toFixed(3), endSh: +end.shoulder.toFixed(3),
  thoraxV: +thoraxDeg(start).toFixed(2), legV: +legDeg(lmS).toFixed(2), comOffCm: cm(com(lmS)[2] - lowZ(start, TORSO)), heelHoverCm: [cm(lowest(end, HEELS)), cm(lowest(mistakePose, HEELS))],
  underCm: [cm(underside(end, LUMBAR_Z)), cm(gapTop[1])], buttock: [cm(lmS.buttock[1]), cm(lmE.buttock[1]), cm(lmM.buttock[1])], vLowCm: cm(lowest(start, /./)) });

export default {
  hand: 'flat',
  id: 'v_up', name: 'V-Up', view: 'side', facing: 'right',
  camera: { fit: true, maxScale: 1.35, y0: 339 },      // D-LIB8-floor: floor at y 339, width-filling scale <= x1.35
  poses: { start, end },
  equipment: [{ type: 'floor', from: -1.3, to: 1.0 }],
  checks: [
    { landmark: 'buttock', plane: FLOOR, pose: 'end', tol: 1 },                 // low back on the floor lying (c4, c5)
    { landmark: 'backUpper', plane: FLOOR, pose: 'end', tol: 1 },
    { landmark: 'heel.r', above: FLOOR, pose: 'end' },                          // heels a few inches off (c4)
  ],
  zoom: [{ view: 'mistake', k: 2 }],   // the arch is under deviationMin at plate scale; the smallest passing ladder k
  startParts: ['torso', 'head', 'arm.r', 'leg.r'],
  ghosts: { count: 0 },
  trace: { point: 'wrist.r', trim: [4, 6] },
  tempo: [{ phase: 'Lower', move: true }, { phase: 'Lift', move: true }],   // fallbackA (D-STRIP-AFALL; PLAN RULED Q3, c14 contested), written after #358
  callouts: [
    { key: 'lowback', text: 'Low back<br>down', anchor: 'navel', box: { left: 64, top: 262 }, cue: 'Keep your low back touching the floor at the start and return.' },
    { key: 'reach', text: 'Reach to<br>toes', anchor: { at: 'grip.r', pose: 'start' }, box: { left: 196, top: 150 }, cue: 'Lift legs and torso together, hands reaching toward your toes.' },
    { key: 'legs', text: 'Legs<br>together', anchor: { along: ['knee.r', 'ankle.r'], t: 0.5, off: [0, -7] }, box: { left: 266, top: 252 }, cue: 'Legs as straight as you can, toes pressed together.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: [{ kind: 'dashed', pts: [gapBot, gapTop] }, { kind: 'dashed', pts: ARCH_UNDER.map(q => [...q]) }],
    tells: [
      { key: 'arch', text: 'Low back<br>arches', anchor: { at: 'lumbar', pose: 'mistake' }, box: { left: 140, top: 166 }, cue: 'Your low back arches off the floor at the start of the rep.' },
    ],
  },
  alt: 'V-up, side view. From lying face up with the arms overhead and the heels just off the floor, the lifter lifts the straight legs and the torso together into a V, hands reaching toward the toes, then lowers.',
};
