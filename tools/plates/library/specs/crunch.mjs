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
//    root height that puts all three on it. Checks prove the floor contacts (plane, tol 1 cm).
//  - Feet (c1): flat, heels HEEL_FROM_TAIL (37.5 cm, the midpoint of "about 30-45 cm") footward of the tailbone, read as
//    the engine's sacrum landmark (the body model has no coccyx point); one foot under each hip joint (hip-width); the
//    plant IK bends the knees up (pole up).
//  - Arms (c2): crossed over the chest, each hand on the chest in front of the opposite shoulder (the reach IK, solved
//    per pose against that pose's thorax), elbows out to the side.
//  - Chin (c7): the start keeps the supine solve's neck (skull resting, neck neutral); the neck angle relative to the
//    thorax is the same in every right pose ("keep it there"). A further tuck is not drawn: the engine turns the head
//    about the neck pivot, so a tuck would lift the skull off the mat in the start.
//  - End (c3, c4): the trunk curls END_CURL deg at the spine pivot (the engine's single lumbar bend, about L3) with the
//    pelvis, legs and feet unchanged, so the tailbone and buttock stay down and the shoulder blades (backUpper, the
//    engine's upper-back point, mid-blade) lift just off the floor. END_CURL is the curl-up's usual end range where the
//    blades clear the mat (no card number; listed below).
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
//   the floor", c4, gives no number), HAND (where the crossed hands rest on the chest), ELBOW_POLE, KNEE_POLE, FLOOR
//   (the floor line's length), MIS_TILT 14 deg (how far the pelvis tips forward in the Mistake).
import { landmarksOf, fk, resolve, normPose } from '../engine.mjs';

const H = 1.75, BODY = { height: H };
export const HEEL_FROM_TAIL = 0.375;                   // heel to tailbone along the floor (m): midpoint of 30-45 cm (c1)
const HIP_W = 0.0875;                                  // foot under each hip joint (m): HJCs 17.5 cm apart (hip-width, c1)
export const END_CURL = 25;                            // end: trunk curl at the spine pivot (deg)
const HAND = [0.10, 0.035, 0.775];                     // crossed hand on the chest: x toward the opposite side (m), off the chest surface (m), thorax height (H)
const ELBOW_POLE = [1, -0.6, 0.7];                     // elbow aim (x outward per side): out to the side, toward the hips, resting low by the ribs
const KNEE_POLE = [0, 1, 0.25];                        // knees up
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

const LYING = supine(0, 0);
const lmL = landmarksOf(LYING, H);
const HEEL_Z = lmL.sacrum[2] + HEEL_FROM_TAIL;
const feet = { l: { at: [HIP_W, 0, HEEL_Z], ref: 'heel', pole: KNEE_POLE }, r: { at: [-HIP_W, 0, HEEL_Z], ref: 'heel', pole: KNEE_POLE } };

// arms crossed: each hand on the chest in front of the opposite shoulder, solved against the pose's own thorax
const crossed = p => {
  const sk = fk(resolve(normPose(p, BODY), BODY).q, BODY);
  const hand = s => sk.thorax([-s * HAND[0] / H, HAND[2], 0.072 + HAND[1] / H]);
  return { l: { at: hand(1), pole: ELBOW_POLE }, r: { at: hand(-1), pole: [-ELBOW_POLE[0], ELBOW_POLE[1], ELBOW_POLE[2]] } };
};
const body = (trunk, extra = {}) => ({ ...LYING, trunk, plant: feet, ...extra });
const withArms = p => ({ ...p, reach: crossed(p) });

const start = withArms(body(LYING.trunk));
const end = withArms(body(LYING.trunk + END_CURL));

// Mistake (card plate.mistake, c6; key `lowback`): the hip flexors jerk the trunk up, the pelvis tips forward MIS_TILT
// deg (anterior tilt) and the low back lifts off the mat. The thorax keeps the end's angle to the floor (the spine bend
// takes back the tip), so only the pelvis and the low back differ from the right end pose; the root (height and z) is
// solved so the buttock stays on the mat and the shoulder keeps its end z (the upper body does not slide); the feet
// stay planted.
const misTrunk = LYING.trunk + END_CURL - MIS_TILT;
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
export const info = () => ({ heelFromTailCm: cm(lmS['heel.r'][2] - lmS.sacrum[2]), bladeLiftCm: cm(lmE.backUpper[1] - lmS.backUpper[1]), shoulderLiftCm: cm(lmE['shoulder.r'][1] - lmS['shoulder.r'][1]),
  endLumbarCm: cm(lmE.lumbar[1]), misLumbarLiftCm: cm(lmM.lumbar[1] - lmE.lumbar[1]), misBackMidLiftCm: cm(lmM.backMid[1] - lmE.backMid[1]), misSacrumLiftCm: cm(lmM.sacrum[1] - lmE.sacrum[1]) });

// low-back gap marker (21.6's lesson: a red dashed back line off the mat with a visible gap, never a dome over the belly)
const gapTop = lmM.backMid, gapBot = [0, 0, gapTop[2]], TICK = 2 / 197.5;
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
  startParts: ['torso', 'arm.r', 'arm.l'],
  ghosts: { count: 2, parts: ['torso', 'arm.r'] },
  trace: { point: 'backUpper', trim: [4, 6] },
  tempo: [{ phase: 'Curl', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  callouts: [
    { key: 'lowback', text: 'Low back<br>down', anchor: 'buttock', cue: 'Keep your feet, tailbone and low back on the mat.' },
    { key: 'blades', text: 'Shoulder<br>blades up', anchor: { at: 'backUpper', off: [-7, 0] }, box: { left: 8, top: 300 }, cue: 'Curl up only until your shoulder blades leave the floor.' },
    { key: 'chin', text: 'Chin<br>set', anchor: 'chin', box: { left: 24, top: 196 }, cue: 'Tuck your chin slightly and hold it there without pulling your neck.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'line', pts: [gapBot, gapTop] }, tick(gapBot), tick(gapTop),
      { kind: 'arc-arrow', center: { at: 'hip.r', pose: 'mistake' }, r: 26, a0: 115, a1: 75 },
    ],
    tells: [
      { key: 'lowback', text: 'Low back<br>lifts', anchor: { at: 'backMid', pose: 'mistake' }, cue: 'Your low back lifts off the mat as you jerk up.' },
      { key: 'pelvis', text: 'Pelvis<br>tips', anchor: { at: 'buttock', pose: 'mistake' }, cue: 'Your hip flexors pull and your pelvis tips forward.' },
    ],
  },
  alt: 'Crunch, side view. Lying on the back, knees bent and feet flat, arms crossed over the chest, the lifter curls the upper back until the shoulder blades leave the floor, low back and feet on the mat, holds, then uncurls.',
};
