// Composer `hackSled` (census gap `hackSled`, claude/howto-options 4a9fd86; LIB-18 Do 4; single use: hack_squat, its
// anchor, plan 2.1:141; D-LIB18-COMPOSERS, -FRAME): a plate-loaded hack squat machine seen from the side, as
// hack_squat's card names its parts (plate.equipment; c1, c3, c16, c18):
//  - static: the angled rail (in side view the near rail covers the far one), the large flat foot plate fixed at the
//    rail's bottom end, the fail-safe stop on the rail just below the drawn bottom of the rep (c16 "fail-safes at the
//    bottom of the rail"), and the frame: a bracket from the rail's bottom end under the foot plate to a front post,
//    the front post from that bracket to the floor, a rear post from the rail's top end to the floor and a floor beam joining them;
//  - moving (the sled, which slides along the rail with the lifter): the carriage plate riding on the rail, the tall
//    back pad on it (c2), two shoulder pads on top of it, one over each shoulder beside the neck (c1 "shoulders under
//    the pads"; D-LIB18-PADS), and the handle on a bracket off the front of the near shoulder pad, near the head (c18;
//    c3's "safety handles"). Every sled part is a `poly` (eq/parts.mjs sideBar or `poly`), so it is drawn in the
//    Mistake view whenever it moves (PQ-H9).
// Shoulder pads (D-LIB18-PADS, #306 6357949465): a single midline pad overlapped the neck by 2.1 cm in every pose
//  (scratchpad calves/padneck2.mjs). Each pad now lies on its own shoulder's trapezius, its inner edge padIn from the
//  midline, outside the neck, and reaches padOut over the trapezius top (trap.l, trap.r at 0.078 H). Its lower face
//  follows the trapezius slope: the body's front outline runs straight from (0.064, 0.842) H to (0.095, 0.831) H there
//  (body.mjs:42 torsoHalf), so the face drops padDrop from the inner edge to the outer one; the top face is level in
//  the trunk's frame, shoulderT over the outer bottom edge. Each pad's poly carries its eight corners (side view:
//  outer bottom rear, outer bottom front, inner bottom front, outer top front, inner top front, inner top rear, outer
//  top rear, inner bottom rear), so its outline is the side silhouette and its points give the pad's true 3D shape.
//  The far pad (x > 0) coincides with the near one in the side view and is the last item (so the near pad's slot is
//  unchanged).
// Built only from existing primitives (`backPad` through sideBar, `poly`). Reads no file. Returns several items of one
// type, so a spec takes it through eq/parts.mjs perItem(fn, HACK_SLED_ITEMS). Side view only (the card's view).
// Every pad, plate and rail touches the part that carries it: the back pad's rear face lies on the carriage plate, the
// carriage plate on the rail, each shoulder pad's rear end at the back pad's face by its top end, the handle on its
// bracket, which runs into the near shoulder pad; the foot plate sits on its bracket and the front post, the rail ends on the bracket and on the
// rear post, and both posts stand on the floor beam (D-LIB18-FRAME).
// Assumed sizes (no card claim gives them; the spec lists them under "Unsourced numbers" and lb8/sizes.json holds each
// with its basis): pads 7 cm thick (the vendor backPad), shoulder pad 20 cm long and 6 cm thick, carriage plate 4 cm,
// rail tube 5 cm, frame tubes 6 cm (romanChair's and pulloverMachine's beamT), foot plate 70 cm long and 3.5 cm thick
// (the 8's leg press plate, equipment.mjs legPress45 h 0.7 and t 0.035), fail-safe stop 6 cm along the rail, handle grip
// 12 cm by 3.2 cm (the vendor chestPress grip), handle bracket 3 cm; the shoulder pads padIn 11.2 cm to padOut 16.625 cm
// from the midline with a padDrop 1.925 cm slope (body.mjs:42, above).
import { add, mul, norm, sideBar } from './parts.mjs';

export const HACK_SLED = Object.freeze({ padT: 0.07, shoulderLen: 0.20, shoulderT: 0.06, carriageT: 0.04, railT: 0.05, tubeT: 0.06, plateLen: 0.70,
  plateT: 0.035, stopLen: 0.06, gripLen: 0.12, gripT: 0.032, bracketT: 0.03, padIn: 0.112, padOut: 0.16625, padDrop: 0.01925 });
export const HACK_SLED_ITEMS = 13;

const quad = (a, b, n, t) => [a, b, add(b, mul(n, t)), add(a, mul(n, t))];
/** One shoulder pad (side s: +1 the far, left one; -1 the near, right one) as its eight corners (order in the header).
 *  sh: { at, up, fwd }: at the point on the midline under the inner bottom edge at the pad's rear end, up and fwd the
 *  trunk's up and forward unit vectors; mv the sled's travel. */
export function shoulderPadPts(sh, s, mv = [0, 0, 0], C = HACK_SLED) {
  const up = norm(sh.up), fw = norm(sh.fwd), L = mul(fw, C.shoulderLen), o = add(sh.at, mv);
  const ib = add(o, [s * C.padIn, 0, 0]), ob = add(add(o, [s * C.padOut, 0, 0]), mul(up, -C.padDrop));
  const it = add(ib, mul(up, C.shoulderT - C.padDrop)), ot = add(ob, mul(up, C.shoulderT));
  return [ob, add(ob, L), add(ib, L), add(ot, L), add(it, L), it, ot, ib];
}

/**
 * p.u: unit vector along the rail, pointing up the rail (up and back, away from the foot plate); p.n: the back pad's
 *   face normal, toward the lifter (u turned 90 deg forward).
 * p.pad: { at, lo, hi }: a point on the back pad's face line in the pose with travel 0, and the pad's lower and upper
 *   ends as distances along u from it. p.shoulder: { at, up, fwd } the shoulder pads' frame at travel 0
 *   (shoulderPadPts). p.grip: the handle grip's centre at travel 0 (world).
 * p.travel: the sled's travel along u from the travel-0 pose (m).
 * p.rail: { lo, hi }: the rail's lower and upper ends, distances along u from pad.at. p.stop: the distance along u of
 *   the fail-safe stop's upper face. p.plate: { at, tilt }: the centre of the foot plate's top face and its tilt (deg,
 *   toes up) from level. p.floorZ: [rear z, front z] of the floor beam.
 * Returns, in order: floor beam, rear post, front post, rail, rail bracket, foot plate, fail-safe stop (static, z back);
 * then carriage plate, back pad, near shoulder pad, handle bracket (z back), handle grip (z mid), far shoulder pad
 * (part 'sled'; the pads z mid).
 */
export function hackSled({ u, n, pad, shoulder, grip, travel = 0, rail, stop, plate, floorZ }) {
  const C = HACK_SLED, t = C.tubeT;
  const U = norm(u), N = norm(n), mv = mul(U, travel);
  const face = (s, off = 0) => add(add(pad.at, mul(U, s)), mul(N, off));                 // travel-0 point on the pad face line
  const railOff = -(C.padT + C.carriageT + C.railT / 2);                                    // rail centre line behind the pad face
  const railLo = face(rail.lo, railOff), railHi = face(rail.hi, railOff);
  // foot plate: top face through plate.at, along the plate direction (forward, tilted toes up)
  const a = (plate.tilt ?? 0) * Math.PI / 180, pd = [0, Math.sin(a), Math.cos(a)], pn = [0, Math.cos(a), -Math.sin(a)];
  const p0 = add(plate.at, mul(pd, -C.plateLen / 2)), p1 = add(plate.at, mul(pd, C.plateLen / 2));
  const plateUnder = add(plate.at, mul(pn, -C.plateT));
  // the rail's bottom end runs into a bracket under the foot plate, which carries the plate and ends on the front post
  const frontZ = add(plateUnder, mul(pd, C.plateLen * 0.25))[2];
  const brFrom = add(railLo, mul(U, C.railT / 2)), brTo = add(add(plate.at, mul(pn, -C.plateT - C.bracketT / 2)), mul(pd, C.plateLen * 0.25 + t / 2));
  const stopHi = face(stop, railOff + C.railT / 2), stopLo = face(stop - C.stopLen, railOff + C.railT / 2);
  // sled (moves with travel)
  const cLo = add(face(pad.lo, -C.padT), mv), cHi = add(face(pad.hi, -C.padT), mv);
  const padLo = add(face(pad.lo), mv), padHi = add(face(pad.hi), mv);
  const near = shoulderPadPts(shoulder, -1, mv), far = shoulderPadPts(shoulder, 1, mv);
  const g = add(grip, mv), gA = add(g, mul(U, -C.gripLen / 2)), gB = add(g, mul(U, C.gripLen / 2));
  const gN = mul(N, C.gripT / 2), gripPts = [add(gA, mul(gN, -1)), add(gB, mul(gN, -1)), add(gB, gN), add(gA, gN)];
  // bracket root inside the near shoulder pad: midway across it, 3/4 along it, at mid height over its outer bottom edge
  const brAt = add(add(add(shoulder.at, mv), [-(C.padIn + C.padOut) / 2, 0, 0]), add(mul(norm(shoulder.fwd), C.shoulderLen * 0.75), mul(norm(shoulder.up), C.shoulderT / 2 - C.padDrop)));
  return [
    sideBar([0, t / 2, floorZ[0]], [0, t / 2, floorZ[1]], t, { z: 'back', part: 'frame' }),                         // floor beam
    sideBar([0, t, railHi[2]], add(railHi, mul(U, C.railT / 2)), t, { z: 'back', part: 'frame' }),                  // rear post under the rail top
    sideBar([0, t, frontZ], [0, plateUnder[1] - C.bracketT, frontZ], t, { z: 'back', part: 'frame' }),             // front post under the plate
    sideBar(railLo, railHi, C.railT, { z: 'back', part: 'frame' }),                                                  // rail
    sideBar(brFrom, brTo, C.bracketT, { z: 'back', part: 'frame' }),                                                // rail bracket under the plate
    { type: 'poly', pts: quad(p0, p1, pn, -C.plateT), cls: 'eq', z: 'back', part: 'plate' },                       // foot plate
    { type: 'poly', pts: quad(stopLo, stopHi, N, C.carriageT), cls: 'eq-solid', z: 'back', part: 'stop' },        // fail-safe stop on the rail
    { ...sideBar(add(cLo, mul(N, -C.carriageT / 2)), add(cHi, mul(N, -C.carriageT / 2)), C.carriageT, { z: 'back' }), part: 'sled' },   // carriage plate
    { ...sideBar(add(padLo, mul(N, -C.padT / 2)), add(padHi, mul(N, -C.padT / 2)), C.padT, { z: 'back' }), part: 'sled' },             // back pad
    { type: 'poly', pts: near, cls: 'eq', z: 'mid', part: 'sled' },                                                 // near shoulder pad (right)
    { ...sideBar(brAt, add(gB, mul(U, C.bracketT / 2)), C.bracketT, { z: 'back' }), part: 'sled' },                // handle bracket
    { type: 'poly', pts: gripPts, cls: 'eq-solid', z: 'mid', part: 'sled' },                                       // handle grip (neutral, along the rail)
    { type: 'poly', pts: far, cls: 'eq', z: 'mid', part: 'sled' },                                                  // far shoulder pad (left)
  ];
}
