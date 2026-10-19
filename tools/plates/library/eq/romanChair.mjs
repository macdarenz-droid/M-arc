// Composer `romanChair` (census gap `romanChair`, claude/howto-options 4a9fd86; LIB-13 Do 4; single use: back_extension,
// plan 2.1:141): a 45-degree back-extension bench (Roman chair) seen from the side, as back_extension's card names its
// parts (c1-c3):
//  - the hip pad under the top of the thighs, just below the hip bones (c1, c2), on a short post;
//  - the foot plate the soles press on, with the heel roller behind the ankles (feet secured, c3);
//  - the frame: a floor beam, and the main beam rising at the bench angle from the floor beam's rear end to the pad.
// Built only from existing primitives: `poly` for the pad and the foot plate (outlines with a face exactly on the
// contact line), backPad as a straight bar via eq/parts.mjs sideBar for the beams and posts, kneePad for the heel
// roller. Every part is static (the bench does not move in a rep), so the Mistake needs no twin (PQ-H9). Reads no
// file. Returns several items of the same type, so a spec takes it through eq/parts.mjs perItem(fn, ROMAN_CHAIR_ITEMS).
// LB3 panel fix (D-LIB13-PANEL1, #274 6278550928): one hip pad whose face runs along the front of the upper thighs
// (it was drawn turned into the thigh, so only two corners showed), an upright under the raised end of the 45-degree
// beam, and the foot plate on the sole line, square to the shins, under the soles.
// Assumed sizes (a typical commercial 45-degree hyperextension bench; no card claim gives them, and the spec that uses
// it lists them under "Unsourced numbers"): pad 50 cm long (6 cm of it above the contact point), 22 cm deep (the
// panel's "about 75 x 35 px"); foot plate 30 cm, 3 cm thick; heel roller 5 cm radius; beams 6 cm square tube; posts 5 cm.
import { add, mul, norm, sideBar, sub } from './parts.mjs';

export const ROMAN_CHAIR = Object.freeze({ padLen: 0.50, padAbove: 0.06, padT: 0.22, plateLen: 0.30, plateBack: 0.06, plateT: 0.03, rollerR: 0.05, beamT: 0.06, postT: 0.05 });
export const ROMAN_CHAIR_ITEMS = 7;

/**
 * p.pad: { at, along, normal }: a world point on the pad's face (the thigh contact), the unit vector along the face
 *   toward the head end, and the face normal pointing from the thigh into the pad. The face runs padAbove toward the
 *   head and the rest of padLen toward the knees.
 * p.foot: { at, along, normal }: a world point on the foot plate's face (the sole contact), the unit vector along it
 *   toward the toes, and the normal from the plate toward the feet. The face runs plateBack behind `at`.
 * p.heel: the heel roller's centre (behind the ankles).
 * p.floorZ: [rear z, front z] of the floor beam.
 */
export function romanChair({ pad, foot, heel, floorZ }) {
  const C = ROMAN_CHAIR, pu = norm(pad.along), pn = norm(pad.normal);
  const faceHi = add(pad.at, mul(pu, C.padAbove)), faceLo = add(pad.at, mul(pu, C.padAbove - C.padLen));
  const padPts = [faceHi, faceLo, add(faceLo, mul(pn, C.padT)), add(faceHi, mul(pn, C.padT))];
  const fu = norm(foot.along), fn = norm(foot.normal);
  const plLo = add(foot.at, mul(fu, -C.plateBack)), plHi = add(foot.at, mul(fu, C.plateLen - C.plateBack));
  const platePts = [plLo, plHi, add(plHi, mul(fn, -C.plateT)), add(plLo, mul(fn, -C.plateT))];
  const padBack = add(add(pad.at, mul(pn, C.padT)), mul(pu, C.padAbove - C.padLen / 2));   // the post's top: the pad's back, mid length
  const beamTop = add(padBack, mul(pn, 0.08));                                            // main beam end, behind the pad
  const rear = [0, C.beamT / 2, floorZ[0]], front = [0, C.beamT / 2, Math.max(floorZ[1], beamTop[2] + C.beamT)];
  const plateBack = add(add(foot.at, mul(fn, -C.plateT)), mul(fu, C.plateLen / 2 - C.plateBack));
  return [
    sideBar(rear, front, C.beamT, { z: 'back' }),                                         // floor beam
    sideBar(rear, beamTop, C.beamT, { z: 'back' }),                                       // main beam, rising at the bench angle
    sideBar(beamTop, [0, C.beamT, beamTop[2]], C.beamT, { z: 'back' }),                   // upright under the raised end
    sideBar(beamTop, padBack, C.postT, { z: 'back' }),                                    // pad post
    { type: 'poly', pts: padPts, cls: 'eq', z: 'back' },                                  // hip pad: face on the thigh line
    { type: 'poly', pts: platePts, cls: 'eq', z: 'back' },                                // foot plate: face on the sole line
    { type: 'kneePad', at: sub(heel, [0, C.rollerR, 0]), r: C.rollerR, normal: [0, 1, 0], postTo: plateBack, z: 'back' },
  ];
}
