// Hollow body hold (on the floor, an isometric hold), side view, facing right. LIB-SUPCORE wave 2 (LB9, H;
// D-SUPCORE-MODES: an isometric hold outside derive.mjs's PARAMS).
// View: SIDE (card plate.view = census view): the low back on the floor (c2, c7), the crescent (c3) and the leg height
//  (c4, c5) read in the sagittal plane.
// Clone source (D-LIB9-CLONE, D-SUPCORE-ANCHOR; copied, never imported): crunch's approved bytes (PILOT-B2, panel mx25
//  APPROVED @ 716bf3b7): `bisect`, `supine(top 0)` (trunk -3.555 deg, neck -1.927 deg, root [0, 0.140, 0], tilt -90),
//  `flatLying` (the pelvis tucked PELVIS_TUCK 15 deg, L3 solved back), the floor camera { fit, maxScale 1.35, y0 339 },
//  the floor equipment, the array trunk with SPLIT [0, 0, 1, 0] (D-SUPCORE-SPLIT) and the drawn-outline floor measure.
// Sources: research card docs/research/howto/cards/hollow_body_hold.json (research a48b0594): c1 (lie on the back, legs
//  straight and together, arms overhead, biceps by the ears), c2 (low back flat on the floor, lift the shoulders and
//  legs, hold), c3 (lumbar spine and hips on the floor, a crescent), c4 (legs 15-30 deg off the floor; the card draws
//  15), c5 (the Mistake: legs too low), c9 (chin lowered, eyes to the feet), c12 (hold up to 30 s).
// Geometry (solved on the drawn outlines in world metres, as crunch's heel and underside measures):
//  - Entry (spec start, plate.start, c1): flatLying; legs straight (knee 0) with the hips solved so the lowest drawn leg
//    point rests on the floor; toes pointed (ankle TOE); arms straight overhead (elbow 0), the shoulders solved so the
//    lowest drawn arm point rests on the floor; head resting (the supine solve's neck).
//  - Hold (spec end, plate.end, c2-c4, c9): the shoulders lift by a T12 curl CURL (crunch's END_CURL as the floor class's
//    convention); the pelvis, buttock and low back stay as at the entry (c3); legs straight and together, the hip-to-
//    ankle line LEG deg off the floor (c4); the arms by the ears: the shoulder angle to the thorax ARM; the chin lowered
//    by NECK deg of neck flexion (c9).
//  - Mistake (c5, key `low`): only the legs drop, to M_LEG deg off the floor; the heels stay off the floor.
// Trace (fixed before any measure, DRAWING-GUIDE.md:29): heel.r, the legs lifting to about 15 deg (c4, checkpoint
//  'Legs low'); trim [4, 6] (crunch's, the floor-class anchor).
// Unsourced numbers (SIZES; lb9/sizes.json holds each with its basis): TOE, CURL, ARM, NECK, M_LEG, ARM_PLANE.
import { landmarksOf, fk, resolve, normPose, bodyShapes } from '../engine.mjs';

const H = 1.75, BODY = { height: H };
export const SIZES = Object.freeze({ PELVIS_TUCK: 15, TOE: -40, CURL: 25, LEG: 15, ARM: 185, ARM_PLANE: 80, NECK: 10, M_LEG: 5 });
const { PELVIS_TUCK, TOE, CURL, LEG, ARM, ARM_PLANE, NECK, M_LEG } = SIZES;
const OCCIPUT = [0, 0.955, -0.056];                    // back of the skull on the side head outline (head frame, H): crunch's
const FLOOR = { point: [0, 0, 0], normal: [0, 1, 0] };

// ---- supine class (copied from crunch @ 716bf3b7; the bisect throws on a bracket with no root) ----
const bisect = (f, lo, hi) => { if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error(`hollow_body_hold: no solution in [${lo}, ${hi}]`); for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; };
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
const shapesOf = p => bodyShapes(fk(resolve(normPose(p, BODY), BODY).q, BODY), SIDE).filter(s => s.poly);
const lowest = (p, re) => -Math.max(...shapesOf(p).filter(s => re.test(s.key)).flatMap(s => s.poly.map(q => q[1])));
const LEGS = /^(thigh|kneecap|shank|foot)\./, ARMS = /^(shcap|upper|elbowcap|fore|fist)\./, CALF = /^(shank|foot)\./, FORE = /^(fore|fist)\./;
const flex = curl => ({ flex: [0, LYING.trunk, curl, 0] });
const legs = hip => ({ hip, knee: 0, ankle: TOE });
const arms = sh => ({ shoulder: { l: { elev: sh, plane: ARM_PLANE }, r: { elev: sh, plane: ARM_PLANE } }, elbow: 0 });

// entry: the legs and the arms resting on the floor
const entryHip = bisect(h => lowest({ ...LYING, trunk: flex(0), ...legs(h) }, CALF), -40, 0);
const entrySh = bisect(s => -lowest({ ...LYING, trunk: flex(0), ...legs(entryHip), ...arms(s) }, FORE), 150, 200);
const start = { ...LYING, trunk: flex(0), ...legs(entryHip), ...arms(entrySh) };

// hold: the hip-to-ankle line `deg` off the floor
const legAngle = p => { const l = landmarksOf(p, H); return Math.atan2(l['ankle.r'][1] - l['hip.r'][1], l['ankle.r'][2] - l['hip.r'][2]) * 180 / Math.PI; };
const holdAt = (deg, extra = {}) => { const b = { ...LYING, trunk: flex(CURL), neck: LYING.neck + NECK, ...arms(ARM), ...extra };
  return { ...b, ...legs(bisect(h => legAngle({ ...b, ...legs(h) }) - deg, -20, 60)) }; };
const end = holdAt(LEG);
const mistakePose = holdAt(M_LEG);

const lmS = landmarksOf(start, H), lmE = landmarksOf(end, H), lmM = landmarksOf(mistakePose, H);
const cm = v => +(v * 100).toFixed(2);
export const info = () => ({ entryHip: +entryHip.toFixed(3), entrySh: +entrySh.toFixed(3), endHip: +end.hip.toFixed(3), misHip: +mistakePose.hip.toFixed(3),
  legDeg: +legAngle(end).toFixed(2), misLegDeg: +legAngle(mistakePose).toFixed(2), entryLegLowCm: cm(lowest(start, LEGS)), entryArmLowCm: cm(lowest(start, ARMS)),
  endArmLowCm: cm(lowest(end, ARMS)), misLegLowCm: cm(lowest(mistakePose, LEGS)), endLegLowCm: cm(lowest(end, LEGS)), bladeLiftCm: cm(lmE.backUpper[1] - lmS.backUpper[1]),
  buttock: [cm(lmS.buttock[1]), cm(lmE.buttock[1]), cm(lmM.buttock[1])], heelLiftCm: cm(lmE['heel.r'][1] - lmS['heel.r'][1]) });

export default {
  id: 'hollow_body_hold', name: 'Hollow Body Hold', view: 'side', facing: 'right',
  camera: { fit: true, maxScale: 1.35, y0: 339 },      // D-LIB8-floor: floor at y 339, width-filling scale <= x1.35
  poses: { start, end },
  equipment: [{ type: 'floor', from: -1.3, to: 1.25 }],
  checks: [
    { landmark: 'buttock', plane: FLOOR, pose: 'all', tol: 1 },                 // hips on the floor (c1, c3)
    { landmark: 'backUpper', plane: FLOOR, pose: 'start', tol: 1 },             // lying flat at the entry (c1)
    { landmark: 'backUpper', above: FLOOR, pose: 'end' },                       // shoulders lifted (c2)
    { landmark: 'heel.r', above: FLOOR, pose: 'end' },
  ],
  startParts: ['torso', 'head', 'arm.r', 'leg.r'],
  ghosts: { count: 1, parts: ['leg.r', 'arm.r'] },
  trace: { point: 'heel.r', trim: [4, 6] },
  tempo: [{ phase: 'Hold', s: 'max 30' }],   // D-SUPCORE-HOLDMAX (#366 6570379460): c12's "up to 30 seconds" as an upper bound
  // D-SUPCORE-HOLLOWLEG (#366 6575342285): c4's 15 deg, the card's one measure fact, drawn as the angle between the floor
  // line and the hip-to-ankle line in the hold (lb9/sizes.json LEG's measure), at the ankle
  measure: { vertex: 'ankle.r', from: { dir: [-1, 0] }, to: 'hip.r', radius: 64, title: 'Legs', value: 'about 15°', expect: 15, box: { left: 186, top: 256 } },
  callouts: [
    { key: 'lowback', text: 'Low back<br>down', anchor: 'navel', box: { left: 140, top: 192 }, cue: 'Press your low back flat to the floor the whole hold.' },
    { key: 'legs', text: 'Legs low', anchor: { along: ['knee.r', 'ankle.r'], t: 0.5, off: [0, -7] }, box: { left: 250, top: 206 }, cue: 'Legs straight and off the floor, no higher than about 30 degrees.' },
    { key: 'shoulders', text: 'Shoulders up', anchor: { at: 'shoulderTop.r', off: [0, -3] }, box: { left: 16, top: 214 }, cue: 'Lift your shoulders and arms off the floor, biceps by your ears.' },
  ],
  mistake: {
    pose: mistakePose,
    guides: [
      { kind: 'arrow', from: { along: ['knee.r', 'ankle.r'], t: 0.85, pose: 'end', off: [0, 6] }, to: { along: ['knee.r', 'ankle.r'], t: 0.85, pose: 'mistake', off: [0, -2] } },
    ],
    tells: [
      { key: 'low', text: 'Legs too<br>low', anchor: { at: 'toe.r', pose: 'mistake' }, box: { left: 252, top: 200 }, cue: 'Your legs sink too low, so the hip flexors take over.' },
    ],
  },
  alt: 'Hollow body hold, side view. Lying on the back with the low back pressed to the floor, the lifter lifts the shoulders, arms by the ears, and the straight legs about 15 degrees off the floor, and holds the crescent.',
};
