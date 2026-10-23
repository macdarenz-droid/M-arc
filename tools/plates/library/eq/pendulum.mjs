// Composer `pendulum` (census gap `pendulum`, claude/howto-options 4a9fd86; LIB-18 Do 4; single use: pendulum_squat, its
// anchor, plan 2.1:141; D-LIB18-COMPOSERS, -FRAME): a pendulum squat machine seen from the side, as pendulum_squat's card
// names its parts (plate.equipment: "swinging arm on a pivot with shoulder pads and a back pad, a fixed foot platform,
// handles and a safety latch (c1, c4)"):
//  - static: the pivot boss on top of the rear post, the rear post, the floor beam, the front post, the platform
//    bracket and the foot platform (fixed under the feet), and the safety latch: a catch lever hinged on the rear post,
//    drawn turned down along the post, clear of the arm's swing (released, c4);
//  - moving (the arm swings about the pivot with the lifter): the arm from the pivot to the back pad, the back
//    pad on it (c3), the shoulder pad on top of it over the shoulders (c1), and the handle on
//    a bracket off the front of the shoulder pad (c16). Every moving part is a `poly` (eq/parts.mjs sideBar or `poly`),
//    so it is drawn in the Mistake view whenever it moves (PQ-H9).
// Built only from existing primitives (`backPad` through sideBar, `poly`, `pulley`). Reads no file. Returns several items
// of one type, so a spec takes it through eq/parts.mjs perItem(fn, PENDULUM_ITEMS). Side view only (the card's view).
// Every pad, platform, lever and arm touches the part that carries it: the arm's end runs into the back pad's rear half, the arm's root sits on the pivot boss, which sits on the rear post;
// the shoulder pad's rear end lies on the back pad's top; the handle on its bracket, which runs into the shoulder pad;
// the platform on its bracket, the bracket on the front post; the latch's hinge on the rear post; both posts stand on
// the floor beam (D-LIB18-FRAME).
// Assumed sizes (no card claim gives them; lb8/sizes.json holds each with its basis): pads 7 cm thick (the vendor
// backPad), shoulder pad 20 cm long and 6 cm thick, arm tube 7 cm, frame tubes 6 cm, pivot boss 4.5 cm
// radius (the vendor pulley), platform 70 cm long and 3.5 cm thick (the vendor legPress45 plate), platform bracket 3 cm,
// handle grip 12 cm by 3.2 cm (the vendor chestPress grip), handle bracket 3 cm, latch lever 18 cm by 3 cm.
import { add, mul, norm, sideBar } from './parts.mjs';

export const PENDULUM = Object.freeze({ padT: 0.07, shoulderLen: 0.20, shoulderT: 0.06, armT: 0.07, tubeT: 0.06, bossR: 0.045,
  plateLen: 0.70, plateT: 0.035, bracketT: 0.03, gripLen: 0.12, gripT: 0.032, latchLen: 0.18, latchT: 0.03 });
export const PENDULUM_ITEMS = 12;

const quad = (a, b, n, t) => [a, b, add(b, mul(n, t)), add(a, mul(n, t))];
// rotate a world point about the pivot in the side-view (z, y) plane by `a` rad, + = toward the front at the top
// (the pelvis-tilt sense: + tilts the torso forward)
export const swing = (p, pivot, a) => {
  const dz = p[2] - pivot[2], dy = p[1] - pivot[1], c = Math.cos(a), s = Math.sin(a);
  return [p[0], pivot[1] + dy * c - dz * s, pivot[2] + dz * c + dy * s];
};

/**
 * p.pivot: the arm's pivot (world, x 0). p.frame: { o, u, n } the back pad's face line in the pose drawn: o a point on
 *   it (the buttock contact), u the unit vector up the pad, n the face normal toward the lifter (u turned 90 deg
 *   forward). p.pad: { lo, hi }: the pad's lower and upper ends, distances along u from o. p.shoulder: the distance along
 *   u (from o) of the shoulder pad's lower face. p.grip: the handle grip's centre as { u, n, x } in the pad frame (x the
 *   lateral offset, drawn at the near side). p.armAt: the distance along u (from o) where the arm meets the back pad.
 * p.platform: { top, z }: the platform's top face height and its centre's z; p.frontZ: the front post's z (under
 *   the platform); p.floorZ: [rear z, front z] of the floor beam. p.latch: { y }: the latch hinge height on the rear post.
 * Returns, in order: floor beam, rear post, front post, platform bracket, platform, latch lever, pivot boss (static,
 *   part 'frame'/'platform'/'latch', z back); then arm, back pad, shoulder pad, handle bracket (z back),
 *   handle grip (z mid) (part 'arm').
 */
export function pendulum({ pivot, frame, pad, shoulder, grip, armAt, platform, frontZ, floorZ, latch }) {
  const C = PENDULUM, t = C.tubeT, U = norm(frame.u), N = norm(frame.n);
  const face = (s, off = 0) => add(add(frame.o, mul(U, s)), mul(N, off));                    // a point on the pad face line
  // static frame
  const pTop = platform.top, pUnder = pTop - C.plateT, brY = pUnder - C.bracketT / 2, pz = [platform.z - C.plateLen / 2, platform.z + C.plateLen / 2];
  const rearZ = pivot[2];
  const latchHi = [0, latch.y, rearZ + t / 2 + C.latchT / 2], latchLo = add(latchHi, [0, -C.latchLen, 0]);
  // moving: the arm from the pivot into the back pad's rear half
  const armEnd = face(armAt, -C.padT * 0.75);
  const sp0 = face(shoulder), sp1 = add(sp0, mul(N, C.shoulderLen));
  const g = add(add(frame.o, mul(U, grip.u)), mul(N, grip.n)), gp = [grip.x, g[1], g[2]];
  const gA = add(gp, mul(U, -C.gripLen / 2)), gB = add(gp, mul(U, C.gripLen / 2)), gN = mul(N, C.gripT / 2);
  const brAt = add(sp0, add(mul(N, C.shoulderLen * 0.75), mul(U, C.shoulderT / 2)));        // bracket root inside the shoulder pad
  return [
    sideBar([0, t / 2, floorZ[0]], [0, t / 2, floorZ[1]], t, { z: 'back', part: 'frame' }),                          // floor beam
    sideBar([0, t, rearZ], [0, pivot[1], rearZ], t, { z: 'back', part: 'frame' }),                                  // rear post up to the pivot
    sideBar([0, t, frontZ], [0, brY, frontZ], t, { z: 'back', part: 'frame' }),                                     // front post under the platform
    sideBar([0, brY, pz[0] + 0.05], [0, brY, pz[1] - 0.05], C.bracketT, { z: 'back', part: 'frame' }),   // platform bracket
    { type: 'poly', pts: [[0, pTop, pz[0]], [0, pTop, pz[1]], [0, pUnder, pz[1]], [0, pUnder, pz[0]]], cls: 'eq', z: 'back', part: 'platform' },
    { type: 'poly', pts: quad(add(latchHi, [0, 0, -C.latchT / 2]), add(latchLo, [0, 0, -C.latchT / 2]), [0, 0, 1], C.latchT), cls: 'eq-solid', z: 'back', part: 'latch' },   // latch lever, turned down (released)
    { type: 'pulley', at: pivot, r: C.bossR, z: 'back', part: 'frame' },                                             // pivot boss
    { ...sideBar(pivot, armEnd, C.armT, { z: 'back' }), part: 'arm' },                                                // swinging arm
    { ...sideBar(face(pad.lo, -C.padT / 2), face(pad.hi, -C.padT / 2), C.padT, { z: 'back' }), part: 'arm' },          // back pad
    { type: 'poly', pts: quad(sp0, sp1, U, C.shoulderT), cls: 'eq', z: 'mid', part: 'arm' },                         // shoulder pad
    { ...sideBar(brAt, add(gB, mul(U, C.bracketT / 2)), C.bracketT, { z: 'back' }), part: 'arm' },                     // handle bracket
    { type: 'poly', pts: [add(gA, mul(gN, -1)), add(gB, mul(gN, -1)), add(gB, gN), add(gA, gN)], cls: 'eq-solid', z: 'mid', part: 'arm' },   // handle grip
  ];
}
