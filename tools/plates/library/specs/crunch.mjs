// Crunch (on the floor, arms crossed over the chest), side view, facing right. H (D-LIB10-PA's mode rule; the anchor of
// the floor-supine class, SUPCORE's later parent, D-LIB11-TEMPLATES: no template here).
// View: SIDE (card plate.view = census view): the shoulder-blade lift, the feet, tailbone and low back on the mat, and
// the fault (pelvis tipping, low back lifting) all read in the sagittal plane (c3, c4, c6).
// Clone sources (D-LIB9-CLONE; copied, never imported): the supine class of dumbbell_bench_press (pilot A, approved @
// 013f84e, 21.4; read at #109 48d49bb8): `supine()` with its bisect that throws on a bracket with no root, here on the
// floor plane (top 0) instead of the bench pad; the floor-horizontal camera of plank and mountain_climbers (pilot A,
// approved @ 013f84e / carried @ e6f39ff; D-LIB8-floor).
// Sources: research card docs/research/howto/cards/crunch.json (claude/libht-research @ 38d5f9c6), claims c1 (on the
// back, knees bent, feet flat about hip-width, heels about 30-45 cm from the tailbone), c2 (arms crossed over the
// chest, one of the hand options; c7 names it the one that keeps the arms off the head), c3 (curl the trunk, ribs toward
// the pelvis; feet, tailbone and low back stay on the mat; hold briefly), c4 (only until the shoulder blades leave the
// floor), c5 (slowly uncurl), c6 (the Mistake: jerking up with the hip flexors, the pelvis tipping forward, more low-back
// stress), c7 (chin slightly tucked and held), c12 (tempo).
// Geometry decisions:
//  - Supine class (copied, top 0): pelvis tilt -90, the trunk angle that puts backUpper and buttock on the floor together
//    (a 3.6 deg lumbar arch: a neutral spine), the neck angle that puts the back of the skull on the floor, then the
//    root height that puts all three on it. Checks prove the floor contacts (plane, tol 1 cm). LIB-SUPCORE panel fix
//    (mx24 R1, R3; flatLying): the pelvis then tucks PELVIS_TUCK deg and L3 takes it back, so the lower-trunk underside
//    lies on the mat (c3 "feet, tailbone and low back stay on the mat") instead of the neutral spine's 5 cm hollow.
//  - Feet (c1): flat, the drawn back of each heel HEEL_FROM_TAIL (37.5 cm, the midpoint of "about 30-45 cm") footward of
//    the tailbone's floor contact, read as the buttock landmark (the body model has no coccyx point; panel mx24 R1 measured
//    it there); one foot under each hip joint (hip-width); the plant IK bends the knees up (pole up).
//  - Arms (c2): crossed over the chest, each hand in front of the opposite shoulder (the reach IK, solved per pose
//    against that pose's thorax), elbows out to the side. The far (left) hand rests HAND[1] off the chest; the near
//    (right) forearm lies over the far one, its hand NEAR_OFF off the chest, so the two forearms never pass through each
//    other (D-SUPCORE-CROSS; c2 names no hand-on-chest contact).
//  - Chin (c7): the start keeps the supine solve's neck (skull resting, neck neutral); the neck angle relative to the
//    thorax is the same in every right pose ("keep it there"). A further tuck is not drawn: the engine turns the head
//    about the neck pivot, so a tuck would lift the skull off the mat in the start.
//  - End (c3, c4; LIB-SUPCORE D-SUPCORE-SPLIT): every pose writes the array trunk (D-SPINE-MIX), SPLIT [0, 0, 1, 0]:
//    L3 keeps the supine solve's arch and the trunk curls END_CURL deg at T12 only, with the pelvis, legs and feet
//    unchanged. c3 keeps the feet, tailbone and low back on the mat, which zeroes the lumbar pivots (L5/S1, L3); the
//    shoulder blades (backUpper, the engine's mid-blade point) sit on the T7 pivot, so only a T12 turn lifts them with
//    the low back down (pilot-b2/DESIGN.md section 2). END_CURL is the curl-up's usual end range (no card number;
//    listed below).
//  - Camera (D-LIB8-floor, floor-horizontal class): floor line at the approved y 339; the scale fills the plate width
//    between the approved 16 px side margins (engine `fit`), capped at x1.35 of 146.29 px/m; F1 is that ruling's flag.
//    Fixed before any measure (D-LIB11-SMALL): fit + maxScale 1.35, as plank and mountain_climbers.
//  - Trace (DRAWING-GUIDE.md:29, fixed before any measure): backUpper, the shoulder blades the c3/c4 cue is about; trim
//    [4, 6] as the floor-class anchor plank (a short floor-class path).
// Plate labels (card @ 38d5f9c6): callouts = plate.checkpoints c3 (Low back down), c4 (Shoulder blades up), c7 (Chin
//   set); Mistake = plate.mistake c6 (key `lowback`): jerking up with the hip flexors, the pelvis tipping forward and
//   the low back lifting; tells: the low back off the mat (c6, c3), the pelvis tipping forward (c6); tempo = plate.tempo
//   c12 (up 1, pause 1, down 2): Curl 1, Hold 1, Lower 2 (Q3: Hold right after the concentric).
// Unsourced numbers (no card claim gives them; 13.3 must-fix 14): END_CURL 25 deg (how far the trunk curls: "just off
//   the floor", c4, gives no number), HAND (where the crossed hands rest on the chest), NEAR_OFF 0.12 m (the near hand
//   off the chest, the smallest whole cm that keeps the forearms apart; D-SUPCORE-CROSS), ELBOW_POLE, KNEE_POLE, FLOOR
//   (the floor line's length), MIS_TILT 14 deg (how far the pelvis tips forward in the Mistake), PELVIS_TUCK 15 deg (the
//   smallest whole degree whose underside stays within 1 cm of the mat with the contacts within 0.5 cm of it).
import { landmarksOf, fk, resolve, normPose, bodyShapes } from '../engine.mjs';

const H = 1.75, BODY = { height: H };
export const HEEL_FROM_TAIL = 0.375;                   // back of the heel to the tailbone's floor contact (the buttock), along the floor (m): midpoint of 30-45 cm (c1)
const HIP_W = 0.0875;                                  // foot under each hip joint (m): HJCs 17.5 cm apart (hip-width, c1)
export const END_CURL = 25;                            // end: trunk curl at the spine pivot (deg)
const HAND = [0.10, 0.035, 0.775];                     // crossed hand on the chest: x toward the opposite side (m), off the chest surface (m), thorax height (H)
export const NEAR_OFF = 0.12;                          // the near (right) hand off the chest surface (m), D-SUPCORE-CROSS
const ELBOW_POLE = [1, -0.3, 0.7];                     // elbow aim (x outward per side): out to the side, a little toward the hips (-0.3: the far forearm clears the far thigh in the end, panel fix)
const KNEE_POLE = [0, 1, 0.25];                        // knees up
export const PELVIS_TUCK = 15;                         // the pelvis tucked (posterior tilt, deg) so the low back lies flat on the mat (c3; panel mx24 R1, R3)
export const MIS_TILT = 14;                            // Mistake: pelvis tips forward (deg, anterior tilt)
const OCCIPUT = [0, 0.955, -0.056];                    // back of the skull on the side head outline (head frame, H)
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };

// ---- supine class (copied from dumbbell_bench_press @ 013f84e; the bisect throws on a bracket with no root, D-LIB9-CLONE b) ----
export const bisect = (f, lo, hi) => { if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error(`crunch: no solution in [${lo}, ${hi}]`); for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
export function supine(top, z = 0, { tilt = -90, height = H } = {}) {
  const body = { height }, at0 = { root: { at: [0, 0, z], tilt } };
  const lm = p => landmarksOf(p, height);
  const occ = p => fk(resolve(normPose(p, body), body).q, body).head(OCCIPUT);
  const pad = lm(at0).buttock[1];
  const trunk = bisect(t => lm({ ...at0, trunk: t }).backUpper[1] - pad, -40, 30);
  const neck = bisect(n => occ({ ...at0, trunk, neck: n })[1] - pad, -40, 60);
  return { root: { at: [0, top - pad, z], tilt }, trunk, neck };
}

// LIB-SUPCORE panel fix (mx24 R1, R3): the low back laid flat on the mat. From the supine solve, the pelvis tucks
// PELVIS_TUCK deg (posterior tilt) and L3 takes the tilt back so the blades rest on the floor; then the root height puts
// the buttock on the floor and the neck rests the skull, as supine() does (same bisect, same brackets but L3's, which
// opens to 60 deg for the tucked pelvis).
export function flatLying(s, height = H) {
  const tilt = s.root.tilt - PELVIS_TUCK, at0 = { root: { at: [0, 0, s.root.at[2]], tilt } }, b = { height };
  const lm = p => landmarksOf(p, height), occ = p => fk(resolve(normPose(p, b), b).q, b).head(OCCIPUT);
  const pad = lm(at0).buttock[1];
  const trunk = bisect(t => lm({ ...at0, trunk: t }).backUpper[1] - pad, -40, 60);
  const neck = bisect(n => occ({ ...at0, trunk, neck: n })[1] - pad, -40, 60);
  return { root: { at: [0, -pad, s.root.at[2]], tilt }, trunk, neck };
}
const LYING = flatLying(supine(0, 0));
const lmL = landmarksOf(LYING, H);
// the drawn foot outline in world metres (z along the floor), to measure the back of the heel (panel mx24 R1)
const SIDE = { view: 'side', near: 'r', pxm: 1, P: w => [w[2], -w[1]] };
const heelBack = (p, sd = 'r') => Math.min(...bodyShapes(fk(resolve(normPose(p, BODY), BODY).q, BODY), SIDE).find(s => s.key === `foot.${sd}`).poly.map(q => q[0]));
const plant = z => ({ l: { at: [HIP_W, 0, z], ref: 'heel', pole: KNEE_POLE }, r: { at: [-HIP_W, 0, z], ref: 'heel', pole: KNEE_POLE } });
// the heel landmark sits a fixed distance ahead of the back of the flat foot: one provisional plant measures it
const Z0 = lmL.buttock[2] + HEEL_FROM_TAIL, HEEL_Z = Z0 + (Z0 - heelBack({ ...LYING, plant: plant(Z0) }));
const feet = plant(HEEL_Z);

// arms crossed: each hand on the chest in front of the opposite shoulder, solved against the pose's own thorax
const crossed = p => {
  const sk = fk(resolve(normPose(p, BODY), BODY).q, BODY);
  const hand = s => sk.thorax([-s * HAND[0] / H, HAND[2], 0.072 + (s < 0 ? NEAR_OFF : HAND[1]) / H]);
  return { l: { at: hand(1), pole: ELBOW_POLE }, r: { at: hand(-1), pole: [-ELBOW_POLE[0], ELBOW_POLE[1], ELBOW_POLE[2]] } };
};
// LIB-SUPCORE (D-SUPCORE-SPLIT): the curl's share at each spine pivot [L5/S1, L3, T12, T7]; L3 keeps the arch
export const SPLIT = Object.freeze([0, 0, 1, 0]);
const flex = (arch, curl) => ({ flex: [0, arch, 0, 0].map((a, i) => a + SPLIT[i] * curl) });
const body = (trunk, extra = {}) => ({ ...LYING, trunk, plant: feet, ...extra });
const withArms = p => ({ ...p, reach: crossed(p) });

const start = withArms(body(flex(LYING.trunk, 0)));
const end = withArms(body(flex(LYING.trunk, END_CURL)));

// Mistake (card plate.mistake, c6; key `lowback`): the hip flexors jerk the trunk up, the pelvis tips forward MIS_TILT
// deg (anterior tilt) and the low back lifts off the mat. The thorax keeps the end's angle to the floor (L3 takes back
// the tip; the T12 curl is the end's), so only the pelvis and the low back differ from the right end pose; the root (height and z) is
// solved so the buttock stays on the mat and the shoulder keeps its end z (the upper body does not slide); the feet
// stay planted.
const misTrunk = flex(LYING.trunk - MIS_TILT, END_CURL);
const misAt = ([y, z]) => body(misTrunk, { root: { at: [0, y, z], tilt: LYING.root.tilt + MIS_TILT } });
const SH_E = landmarksOf(end, H)['shoulder.r'];
// root (y, z): the buttock on the mat and the shoulder at the end pose's z (the upper body does not slide), by Newton
// with finite differences (as plank.mjs @ 013f84e); throws when it does not converge (no silent fallback)
const MIS_ROOT = (() => {
  const f = q => { const l = landmarksOf(misAt(q), H); return [l.buttock[1], l['shoulder.r'][2] - SH_E[2]]; };
  let q = [...LYING.root.at.slice(1)];
  for (let it = 0; it < 40; it++) {
    const r = f(q); if (Math.hypot(...r) < 1e-7) return q;
    const J = [0, 1].map(k => { const d = 1e-6, qq = [...q]; qq[k] += d; return f(qq).map((v, i) => (v - r[i]) / d); });
    const det = J[0][0] * J[1][1] - J[1][0] * J[0][1];
    q = [q[0] - (r[0] * J[1][1] - r[1] * J[1][0]) / det, q[1] - (J[0][0] * r[1] - J[0][1] * r[0]) / det];
  }
  throw new Error('crunch: the Mistake root does not converge');
})();
const mistakePose = withArms(misAt(MIS_ROOT));

const lmS = landmarksOf(start, H), lmE = landmarksOf(end, H), lmM = landmarksOf(mistakePose, H);
const cm = v => +(v * 100).toFixed(1);
export const info = () => ({ heelFromTailCm: cm(heelBack(start) - lmS.buttock[2]), heelFromTailLCm: cm(heelBack(start, 'l') - lmS.buttock[2]), bladeLiftCm: cm(lmE.backUpper[1] - lmS.backUpper[1]), shoulderLiftCm: cm(lmE['shoulder.r'][1] - lmS['shoulder.r'][1]),
  endLumbarCm: cm(lmE.lumbar[1]), misLumbarLiftCm: cm(lmM.lumbar[1] - lmE.lumbar[1]), misBackMidLiftCm: cm(lmM.backMid[1] - lmE.backMid[1]), misSacrumLiftCm: cm(lmM.sacrum[1] - lmE.sacrum[1]) });

// the drawn torso underside (world y) at floor position z: the lowest crossing of the outline polygon
const underside = (p, z) => { const pts = bodyShapes(fk(resolve(normPose(p, BODY), BODY).q, BODY), SIDE).find(s => s.key === 'torso').poly; let lo = -Infinity;
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[0] - z) * (b[0] - z) > 0 || a[0] === b[0]) continue; lo = Math.max(lo, a[1] + (b[1] - a[1]) * (z - a[0]) / (b[0] - a[0])); }
  return -lo; };
// low-back gap marker (21.6's lesson: a red dashed back line off the mat with a visible gap, never a dome over the belly),
// at the lumbar (panel mx24 R5): from the floor to the Mistake's drawn underside under the lumbar landmark
const LUMBAR_Z = lmM.lumbar[2], gapTop = [0, underside(mistakePose, LUMBAR_Z), LUMBAR_Z], gapBot = [0, 0, LUMBAR_Z], TICK = 2 / 197.5;
export const LOWBACK = Object.freeze({ z: LUMBAR_Z, endUnderCm: cm(underside(end, LUMBAR_Z)), startUnderCm: cm(underside(start, LUMBAR_Z)), mistakeUnderCm: cm(gapTop[1]) });
const tick = p => ({ kind: 'line', pts: [[0, p[1], p[2] - TICK], [0, p[1], p[2] + TICK]] });

export default {
  id: 'crunch', name: 'Crunch', view: 'side', facing: 'right',
  camera: { fit: true, maxScale: 1.35, y0: 339 },      // D-LIB8-floor: floor at y 339, width-filling scale <= x1.35
  poses: { start, end },
  equipment: [{ type: 'floor', from: -1.0, to: 0.70 }],
  checks: [
    { landmark: 'buttock', plane: FLOOR, pose: 'all', tol: 1 },                 // tailbone and hips on the mat (c3)
    { landmark: 'backUpper', plane: FLOOR, pose: 'start', tol: 1 },             // lying flat at the start (c1)
    { landmark: 'backUpper', above: FLOOR, pose: 'end' },
    { landmark: 'head', above: FLOOR, pose: 'all' },
    { landmark: 'sole.r', plane: FLOOR, pose: 'all', tol: 0.5 },                // feet flat (c1, c3)
    { landmark: 'sole.l', plane: FLOOR, pose: 'all', tol: 0.5 },
  ],
  // D-SUPCORE-CRUNCH: neither view reaches its PQ-H3 bar at plate scale; the smallest passing ladder k per view
  zoom: [{ view: 'normal', k: 3 }, { view: 'mistake', k: 2 }],
  startParts: ['torso', 'head', 'arm.r', 'arm.l'],   // the start head drawn too (panel mx24 R1: the start reads full length)
  ghosts: { count: 2, parts: ['torso', 'arm.r'] },
  trace: { point: 'backUpper', trim: [4, 6] },
  tempo: [{ phase: 'Curl', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  callouts: [
    { key: 'lowback', text: 'Low back<br>down', anchor: [0, 0, lmE.lumbar[2]],   // the lumbar underside on the mat (panel mx24 R4)
      cue: 'Keep your feet, tailbone and low back on the mat.' },
    { key: 'blades', text: 'Shoulder<br>blades up', anchor: { at: 'backUpper', off: [-7, 0] }, box: { left: 56, top: 216 }, cue: 'Curl up only until your shoulder blades leave the floor.' },
    { key: 'chin', text: 'Chin set', anchor: 'chin', box: { left: 24, top: 160 }, cue: 'Tuck your chin slightly and hold it there without pulling your neck.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'line', pts: [gapBot, gapTop] }, tick(gapBot), tick(gapTop),
      { kind: 'arc-arrow', center: { at: 'hip.r', pose: 'mistake' }, r: 26, a0: 75, a1: 115 },   // head on the head side: the forward tip (panel mx24 R5)
    ],
    tells: [
      { key: 'lowback', text: 'Low back<br>lifts', anchor: { at: 'lumbar', pose: 'mistake' }, cue: 'Your low back lifts off the mat as you jerk up.' },
      { key: 'pelvis', text: 'Pelvis<br>tips', anchor: { at: 'buttock', pose: 'mistake' }, cue: 'Your hip flexors pull and your pelvis tips forward.' },
    ],
  },
  alt: 'Crunch, side view. Lying on the back, knees bent and feet flat, arms crossed over the chest, the lifter curls the upper back until the shoulder blades leave the floor, low back and feet on the mat, holds, then uncurls.',
};
