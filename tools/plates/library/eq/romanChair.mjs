// Composer `romanChair` (census gap `romanChair`, claude/howto-options 4a9fd86; LIB-13 Do 4; single use: back_extension,
// plan 2.1:141): a 45-degree back-extension bench (Roman chair) seen from the side, as back_extension's card names its
// parts (c1-c3):
//  - the hip pad under the top of the thighs, just below the hip bones (c1, c2), on a short post;
//  - the foot plate the soles press on, with the heel roller behind the ankles (feet secured, c3);
//  - the frame: a floor beam, and the main beam rising at the bench angle from the floor beam's rear end to the pad.
// Built only from existing primitives (backPad as a straight bar via eq/parts.mjs sideBar, kneePad). Every part is
// static (the bench does not move in a rep), so the Mistake needs no `poly` twin (PQ-H9). Reads no file. Returns
// several items of the same type, so a spec takes it through eq/parts.mjs perItem(fn, ROMAN_CHAIR_ITEMS).
// Assumed sizes (a typical commercial 45-degree hyperextension bench; no card claim gives them, and the spec that uses
// it lists them under "Unsourced numbers"): pad 40 cm long, 8 cm thick; foot plate 30 cm, 2.5 cm thick; heel roller
// 5 cm radius; beams 6 cm square tube; post 5 cm.
import { add, mul, norm, sideBar, sub } from './parts.mjs';

export const ROMAN_CHAIR = Object.freeze({ padLen: 0.40, padT: 0.08, plateLen: 0.30, plateT: 0.025, rollerR: 0.05, beamT: 0.06, postT: 0.05 });
export const ROMAN_CHAIR_ITEMS = 6;

/**
 * p.pad: { at, along }: a world point on the pad's top face (the thigh contact) and the unit vector along the face
 *   toward the head end; the pad runs ROMAN_CHAIR.padLen centred on `at`.
 * p.foot: { at, along }: a world point on the foot plate's face (the sole contact) and the unit vector along the plate
 *   toward the toes; the plate runs plateLen with the contact 8 cm above its low end.
 * p.heel: the heel roller's centre (behind the ankles).
 * p.floorZ: [rear z, front z] of the floor beam.
 */
export function romanChair({ pad, foot, heel, floorZ }) {
  const C = ROMAN_CHAIR, pu = norm(pad.along), pn = norm([0, -pu[2], pu[1]]);       // pad face normal (toward the thighs)
  const padN = pn[1] > 0 ? pn : mul(pn, -1);
  const padLo = add(pad.at, mul(pu, -C.padLen / 2)), padHi = add(pad.at, mul(pu, C.padLen / 2));
  const fu = norm(foot.along), fn0 = norm([0, -fu[2], fu[1]]), toward = sub(heel, foot.at);
  const fN = fn0[1] * toward[1] + fn0[2] * toward[2] > 0 ? fn0 : mul(fn0, -1);         // plate normal toward the feet
  const plLo = add(foot.at, mul(fu, -0.08)), plHi = add(foot.at, mul(fu, C.plateLen - 0.08));
  const padUnder = add(add(pad.at, mul(padN, -C.padT)), mul(pu, -0.05));              // the post's top, under the pad
  const plateBack = add(add(foot.at, mul(fN, -C.plateT)), mul(fu, 0.04));
  const rear = [0, C.beamT / 2, floorZ[0]], front = [0, C.beamT / 2, floorZ[1]];
  const beamTop = add(padUnder, mul(padN, -0.12));                                    // main beam end, below the post
  return [
    sideBar(rear, front, C.beamT, { z: 'back' }),                                      // floor beam
    sideBar(rear, beamTop, C.beamT, { z: 'back' }),                                    // main beam
    sideBar(beamTop, padUnder, C.postT, { z: 'back' }),                                // pad post
    sideBar(add(padLo, mul(padN, -C.padT / 2)), add(padHi, mul(padN, -C.padT / 2)), C.padT, { z: 'back' }),   // hip pad: top face through pad.at
    sideBar(add(plLo, mul(fN, -C.plateT / 2)), add(plHi, mul(fN, -C.plateT / 2)), C.plateT, { z: 'back' }),   // foot plate: face through foot.at
    { type: 'kneePad', at: sub(heel, [0, C.rollerR, 0]), r: C.rollerR, normal: [0, 1, 0], postTo: plateBack, z: 'back' },
  ];
}
