// Composer `pulloverMachine` (census gap `pulloverMachine`, claude/howto-options 4a9fd86; LIB-16 Do 4 and Do 7; single
// use: machine_pullover, its anchor, plan 2.1:141): a seated elbow-pad pullover machine (Nautilus style, the card's
// drawing note) seen from the side, as machine_pullover's card names its parts (plate.equipment; c1-c4):
//  - static: the seat pad, the tall back pad the torso and head rest on (c2, c7), the seat belt across the lap (c2, c4),
//    the foot bar in front of the shins (c2, c3, c5; the drawn poses have the feet off it), and the frame (floor beam,
//    upright behind the back pad, the arm that carries the pivot hub over the shoulder); a centre post (a frame tube, as
//    wide as the 8's chest press seat post) stands the seat on the floor beam, and a bracket joins the back pad to the
//    upright at the middle of the pad's two contact points (LIB-16 panel fix, #297 6353020731);
//  - moving: the movement arm, which turns about the pivot at about shoulder height (c1): a tube along the upper arm,
//    the elbow pad the back of the upper arm rests on (c3), and a strut to the crossbar the open hands rest on (c3, c6),
//    drawn end-on. Every moving part is a `poly` (eq/parts.mjs sideBar or `poly`), so it is drawn in the Mistake view
//    whenever it moves (PQ-H9).
// Built only from existing primitives (`seat`, `backPad`, `poly`, `pulley`, sideBar from eq/parts.mjs). Reads no file.
// Returns several items of one type, so a spec takes it through eq/parts.mjs perItem(fn, PULLOVER_MACHINE_ITEMS).
// Assumed sizes (no card claim gives them; the spec lists them under "Unsourced numbers" and lb6/sizes.json holds each
// with its basis): seat pad 40 cm, pads 7 cm thick (the vendor seat and backPad); frame tubes 6 cm (romanChair's
// beamT); arm tube 5 cm; elbow pad 20 cm long; crossbar 3.2 cm (the vendor chestPress grip); belt 5 cm wide, 1.5 cm
// thick; foot bar 3 cm radius; hub 4.5 cm radius (the vendor pulley).
import { add, mul, norm, sideBar, sub } from './parts.mjs';

export const PULLOVER_MACHINE = Object.freeze({ seatLen: 0.40, padT: 0.07, tubeT: 0.06, armT: 0.05, elbowPadLen: 0.20, barR: 0.016, beltW: 0.05,
  beltT: 0.015, footBarR: 0.03, hubR: 0.045 });
export const PULLOVER_MACHINE_ITEMS = 16;

const circle = (c, r, n = 16) => Array.from({ length: n }, (_, k) => [0, c[1] + r * Math.sin(2 * Math.PI * k / n), c[2] + r * Math.cos(2 * Math.PI * k / n)]);

/**
 * p.seat: { at }: the seat pad's top centre. p.pad: { surface: [upper, lower], len, below }: the back pad's face.
 * p.belt: { at, along }: a point on the top of the thighs where the belt crosses and the unit vector along the thigh.
 * p.footBar: the foot bar's centre. p.pivot: the arm's pivot (world).
 * p.arm: { u, n, elbowAt, padFrom, bar }: in this pose, the unit vector along the upper arm (from the pivot toward the
 *   elbow), the unit normal from the arm's axis toward the elbow pad's face (the back of the upper arm), the point on the
 *   pad face where the elbow rests, and the crossbar's centre.
 * p.frameZ: the upright's world z; p.floorZ: [rear z, front z] of the floor beam.
 */
export function pulloverMachine({ seat, pad, belt, footBar, pivot, arm, frameZ, floorZ }) {
  const C = PULLOVER_MACHINE, t = C.tubeT;
  const top = Math.max(pad.surface[0][1] + pad.len, pivot[1]) + 0.08;
  // elbow pad: a slab whose face runs along the upper arm through arm.elbowAt, padT deep behind the face
  const pu = norm(arm.u), pn = norm(arm.n);
  const f0 = add(arm.elbowAt, mul(pu, -C.elbowPadLen / 2)), f1 = add(arm.elbowAt, mul(pu, C.elbowPadLen / 2));
  const padPts = [f0, f1, add(f1, mul(pn, C.padT)), add(f0, mul(pn, C.padT))];
  const padBack = add(arm.elbowAt, mul(pn, C.padT));
  // back pad bracket: level, from the upright to the pad's back face, at the middle of the two contact points
  const pu2 = norm(sub(pad.surface[0], pad.surface[1])), pn2 = [0, -pu2[2], pu2[1]];
  const mid = mul(add(pad.surface[0], pad.surface[1]), 0.5), padBackAt = add(mid, mul(pn2, -C.padT));
  const beltU = norm(belt.along), beltN = norm([0, -beltU[2], beltU[1]]);
  const b0 = add(belt.at, mul(beltU, -C.beltW / 2)), b1 = add(belt.at, mul(beltU, C.beltW / 2));
  const beltPts = [b0, b1, add(b1, mul(beltN, C.beltT)), add(b0, mul(beltN, C.beltT))];
  return [
    sideBar([0, t / 2, floorZ[0]], [0, t / 2, floorZ[1]], t, { z: 'back' }),                           // floor beam
    sideBar([0, t, frameZ], [0, top, frameZ], t, { z: 'back' }),                                       // upright behind the back pad
    sideBar([0, top - t / 2, frameZ], [0, top - t / 2, pivot[2]], t, { z: 'back' }),                   // top beam over the shoulder
    sideBar([0, top - t / 2, pivot[2]], pivot, t, { z: 'back' }),                                      // drop to the pivot hub
    sideBar([0, t, footBar[2]], footBar, 0.04, { z: 'back' }),                                         // foot bar post
    { type: 'seat', at: seat.at, len: C.seatLen, post: false, z: 'back' },
    sideBar([0, seat.at[1] - C.padT, seat.at[2]], [0, t, seat.at[2]], t, { z: 'back' }),             // seat post down to the floor beam
    sideBar([0, padBackAt[1], frameZ], padBackAt, 0.04, { z: 'back' }),                               // back pad bracket
    { type: 'backPad', surface: pad.surface, len: pad.len, below: pad.below, t: C.padT, post: false, z: 'back' },
    { type: 'poly', pts: beltPts, cls: 'eq-solid', z: 'mid' },                                         // seat belt across the lap
    { type: 'poly', pts: circle(footBar, C.footBarR), cls: 'eq', z: 'back' },                          // foot bar, end-on
    { type: 'pulley', at: pivot, r: C.hubR, z: 'mid' },                                                // pivot hub
    { ...sideBar(pivot, padBack, C.armT, { z: 'mid' }), part: 'arm' },                                 // arm tube to the pad
    { type: 'poly', pts: padPts, cls: 'eq', z: 'mid', part: 'arm' },                                   // elbow pad
    { ...sideBar(add(f1, mul(pn, C.padT / 2)), arm.bar, C.armT * 0.8, { z: 'mid' }), part: 'arm' },   // strut to the crossbar
    { type: 'poly', pts: circle(arm.bar, C.barR), cls: 'eq-solid', z: 'front', part: 'arm' },          // crossbar, end-on
  ];
}
