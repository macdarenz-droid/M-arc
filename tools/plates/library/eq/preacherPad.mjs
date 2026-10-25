// Composer `preacherPad` (census gap `preacherPad`, claude/howto-options 4a9fd86; LIB-15 Do 4; single use: preacher_curl,
// plan 2.1:141, D-LIB15-PREACHER): a preacher bench's arm pad seen from the side, as preacher_curl's card names its parts
// (c1, c2):
//  - the pad: an upholstered block whose top edge sits under the armpits, whose sloped front face carries the backs of
//    the upper arms, whose back face takes the chest, and whose bottom edge runs level under the elbows;
//  - the post under the pad, down the body's mid-plane to the floor, and its floor foot.
// Built only from existing primitives: `poly` for the pad (an outline with its arm face exactly on the contact line),
// backPad as a straight bar via eq/parts.mjs sideBar for the post and the foot. Every part is static (the pad does not
// move in a rep), so the Mistake needs no twin (PQ-H9). Reads no file. Returns several items of the same type, so a spec
// takes it through eq/parts.mjs perItem(fn, PREACHER_PAD_ITEMS). The seat is the vendor `seat` primitive in the spec.
// Assumed sizes (a typical commercial preacher bench; no card claim gives them, and preacher_curl lists them under
// "Unsourced numbers"): arm face 34 cm long, the pad 5 cm thick under the arm face's low end, post 6 cm square tube,
// floor foot 44 cm.
import { add, mul, norm, sideBar } from './parts.mjs';

export const PREACHER_PAD = Object.freeze({ faceLen: 0.34, bottomT: 0.05, postT: 0.06, footLen: 0.44, footT: 0.03 });
export const PREACHER_PAD_ITEMS = 3;

/**
 * p.top: the world point of the pad's top edge (under the armpits), where the arm face meets the chest face.
 * p.face: unit vector down the arm face (from the top edge toward the elbows).
 * p.back: unit vector down the chest (back) face from the top edge; it ends level with the pad's bottom edge.
 */
export function preacherPad({ top, face, back }) {
  const C = PREACHER_PAD, fu = norm(face), bu = norm(back);
  const faceLo = add(top, mul(fu, C.faceLen)), lowY = faceLo[1] - C.bottomT;
  const backLo = add(top, mul(bu, (top[1] - lowY) / -bu[1]));                           // the back face down to the bottom edge
  const padPts = [top, faceLo, [faceLo[0], lowY, faceLo[2]], backLo];
  const midZ = (faceLo[2] + backLo[2]) / 2;
  const foot = [0, C.footT / 2, midZ];
  return [
    { type: 'poly', pts: padPts, cls: 'eq', z: 'mid' },                                   // the pad: arm face on the contact line
    sideBar([0, lowY + 0.01, midZ], [0, C.footT, midZ], C.postT, { z: 'center' }),       // post down the mid-plane
    sideBar(add(foot, [0, 0, -C.footLen / 2]), add(foot, [0, 0, C.footLen / 2]), C.footT, { z: 'center' }),   // floor foot
  ];
}
