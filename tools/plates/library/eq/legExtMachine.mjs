// Composer `legExtMachine` (census gap `legExtMachine`, "seat + backPad + kneePad (shin roller) + line lever + stack",
// claude/howto-options 4a9fd86; LIB-18 Do 7, bulk; single use: leg_extension, its anchor, plan 2.1:141;
// D-LIB18-COMPOSERS, -FRAME): a selectorised leg extension machine seen from the side, as leg_extension's card names its
// parts (plate.equipment; c1-c3):
//  - static: a floor beam; the seat pad on its post (c1 "Sit on the leg extension machine"); the back pad (c1, c4) on a
//    bracket to the rear upright; the rear upright standing on the floor beam, with the weight stack behind it (its
//    cable runs inside the frame and is not drawn); the pivot boss at the knee (c1 "knees align with the machine's
//    pivot") on a bracket that runs back and down into the seat pad's front end; the side handles (c3 "hold on to the handles by your
//    sides"), each grip on a post that runs into the seat pad;
//  - moving (part 'lever'): the lever arm from inside the pivot boss to the shin roller (drawn behind the near leg, on
//    the machine's far side), and the roller resting on the lower shins just above the ankles (c2). Every moving part is a `poly` (eq/parts.mjs sideBar or `poly`), never the
//    census's `line` lever, so it is drawn in the Mistake view whenever it moves (PQ-H9; plate.mjs:205-218). The stack's
//    top plates lift with the lever (the vendor `stack` primitive's `lift`); the spec keeps the end lift in the Mistake.
// Every pad, seat and lever is joined to the frame (D-LIB18-FRAME): the seat pad sits on its post, which stands on the
//  floor beam; the back pad's rear face meets its bracket, which runs into the rear upright; the rear upright stands on
//  the floor beam; the pivot bracket runs from inside the boss into the seat pad's front end; the lever arm starts
//  inside the boss and runs into the roller; each handle post runs from the grip into the seat pad.
// Built only from existing primitives (`backPad`, directly and through sideBar, `poly`, `pulley`, `stack`). Reads no
// file. Returns several items of one type, so a spec takes it through eq/parts.mjs perItem(fn, LEG_EXT_ITEMS). Side
// view only (the card's view).
// Assumed sizes (no card claim gives them; the spec lists them under "Unsourced numbers" and its notes hold each with
// its basis): roller 5.5 cm radius (the vendor kneePad r, equipment.mjs:204), seat pad 7 cm thick (the vendor seat,
// equipment.mjs:181), back pad 7 cm (the vendor backPad t, equipment.mjs:186), frame tubes 6 cm (hackSled's and
// pulloverMachine's tubeT), lever tube 4 cm and pivot boss 3 cm radius (lb8/DESIGN.md section 12: legCurlMachine's sizes
// as a convention), pivot bracket 4 cm, handle post 2.5 cm and grip 1.6 cm radius (calfMachine's postT and gripR, the
// vendor chestPress grip), the vendor stack (16 plates of 2.5 cm, 22 cm wide, 6 lifted).
import { add, mul, sub, norm, sideBar } from './parts.mjs';

export const LEG_EXT = Object.freeze({ rollerR: 0.055, seatT: 0.07, padT: 0.07, tubeT: 0.06, leverT: 0.04, bossR: 0.03, bracketT: 0.04,
  postT: 0.025, gripR: 0.016, stackW: 0.22, stackPlates: 16, stackPlateH: 0.025, stackLoad: 6 });
export const LEG_EXT_ITEMS = 13;

const circle = (c, r, n = 20) => Array.from({ length: n }, (_, k) => [c[0], c[1] + r * Math.sin(2 * Math.PI * k / n), c[2] + r * Math.cos(2 * Math.PI * k / n)]);

/**
 * The lever in one pose (world points), shared by the composer and the spec (which solves the angle that rests the
 * roller on the drawn shins). p.pivot: the pivot centre; p.arm: the distance from the pivot to the roller centre (m);
 * p.angle: the arm's direction (deg) measured from straight down, positive toward +z (forward). Returns { u (unit,
 * pivot to roller), roller (roller centre) }.
 */
export function legExtLever({ pivot, arm, angle }) {
  const a = angle * Math.PI / 180, u = [0, -Math.cos(a), Math.sin(a)];
  return { u, roller: add(pivot, mul(u, arm)) };
}

/**
 * p.floorZ: [rear z, front z] of the floor beam (on the floor, y 0 to tubeT).
 * p.seat: { top, z: [rear z, front z], postZ }: the seat pad's top face, its ends and its post.
 * p.pad: { upper, lower, len, below }: two world points on the back pad's face line (upper above lower; the vendor
 *   backPad `surface` form) and the pad's length and its reach below `lower`.
 * p.towerZ, p.towerTop: the rear upright's z and its top height. p.bracketAt: the distance up the pad face from `lower`
 *   where the pad bracket leaves the pad's rear face (it runs level back into the upright).
 * p.stackZ: the stack's centre z (its base on the floor beam); p.lift: the lifted plates' rise (m).
 * p.pivot, p.arm, p.angle: the lever (legExtLever). p.pivotTo: the world point inside the seat pad's front end
 *   where the pivot bracket ends.
 * p.grip: the near handle grip's centre (world); its post runs down to p.gripTo (inside the seat pad).
 * Returns LEG_EXT_ITEMS slots, in order: floor beam, seat post, seat pad, back pad, pad bracket, rear upright, stack,
 * pivot bracket, handle post (static, z back), lever arm (part 'lever', z back), roller (part 'lever', z mid), pivot boss
 * (static, z mid, over the knee and the lever's root), handle grip (static, z mid).
 */
export function legExtMachine(p) {
  const C = LEG_EXT, t = C.tubeT;
  const [sz0, sz1] = p.seat.z, stop = p.seat.top;
  const u = norm(sub(p.pad.upper, p.pad.lower)), n = [0, -u[2], u[1]];            // pad direction (up) and face normal (forward)
  const bracketRoot = add(add(p.pad.lower, mul(u, p.bracketAt)), mul(n, -C.padT + 0.005));
  const L = legExtLever(p);
  const rollerIn = add(L.roller, mul(L.u, -0.01));                                // the arm ends 1 cm inside the roller
  return [
    sideBar([0, t / 2, p.floorZ[0]], [0, t / 2, p.floorZ[1]], t, { z: 'back', part: 'frame' }),                                  // floor beam
    sideBar([0, t, p.seat.postZ], [0, stop - C.seatT + 0.005, p.seat.postZ], t, { z: 'back', part: 'frame' }),                  // seat post
    sideBar([0, stop - C.seatT / 2, sz0], [0, stop - C.seatT / 2, sz1], C.seatT, { z: 'back', part: 'seat' }),                  // seat pad
    { type: 'backPad', surface: [p.pad.upper, p.pad.lower], len: p.pad.len, below: p.pad.below, t: C.padT, post: false, z: 'back', part: 'pad' },   // back pad
    sideBar(bracketRoot, [0, bracketRoot[1], p.towerZ], t, { z: 'back', part: 'frame' }),                                       // pad bracket, into the upright
    sideBar([0, t, p.towerZ], [0, p.towerTop, p.towerZ], t, { z: 'back', part: 'frame' }),                                      // rear upright
    { type: 'stack', base: [0, t, p.stackZ], plates: C.stackPlates, plateH: C.stackPlateH, w: C.stackW, load: C.stackLoad, lift: p.lift, z: 'back', part: 'stack' },
    sideBar(p.pivot, p.pivotTo, C.bracketT, { z: 'back', part: 'frame' }),                                                       // pivot bracket, boss to the seat pad's front
    sideBar(p.grip, p.gripTo, C.postT, { z: 'back', part: 'frame' }),                                                            // handle post, grip to the seat pad
    { ...sideBar(p.pivot, rollerIn, C.leverT, { z: 'back' }), part: 'lever' },                                                   // lever arm (behind the near leg)
    { type: 'poly', pts: circle(L.roller, C.rollerR), curve: true, cls: 'eq', z: 'mid', part: 'lever' },                         // shin roller
    { type: 'pulley', at: p.pivot, r: C.bossR, z: 'mid', part: 'frame' },                                                         // pivot boss
    { type: 'poly', pts: circle(p.grip, C.gripR, 12), cls: 'eq-solid', z: 'mid', part: 'frame' },                               // handle grip, end-on
  ];
}
