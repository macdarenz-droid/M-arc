// Composer `legCurlMachine` (census gap `legCurlMachine`, claude/howto-options 4a9fd86; LIB-11 Do 3): a seated leg curl
// machine seen from the side. Parts, as seated_leg_curl's card names them (c1-c5):
//  - the seat pad and its post on a floor beam; the back pad, reclined, tangent to the back (c4);
//  - the lever: it turns about a pivot level with the knee (c1) and carries the ankle pad, a roller under the lower legs
//    just above the shoes (c3); the pivot boss is drawn over the knee, where the card's first checkpoint looks;
//  - the thigh pad: a roller snug on the thighs just above the knees (c2), on a bracket from the pivot;
//  - the pivot post, straight up from the floor beam to the pivot (clear of the shank in every pose: the lower leg is
//    in front of it when straight and behind it when curled);
//  - the side handles beside the seat (c5).
// In side view both levers, pads and handles project onto one shape each, drawn once. Built only from existing
// primitives (seat, backPad and sideBar's backPad, kneePad, pulley). Reads no file.
// Moving parts: the lever (a sideBar backPad) and the ankle pad (a kneePad roller) turn with the shank from start to
// end; both carry `poly` (backPad and kneePad draw closed outlines), so a lever that moves in a Mistake is still drawn
// there (PQ-H9). Every other part is static.
// Later users (plan 2.1:138) and what they need, so the anchor is not redrawn for them: lying_leg_curl (prone on a flat
// pad: `seat` null and `back` replaced by the spec's bench pad, `pivot` and the lever unchanged, the thigh pad off with
// `thigh` null), standing_leg_curl (one leg, a knee pad in front of the thigh: `thigh` as that pad's contact, `seat`
// and `back` null, the pivot post at the standing frame's knee height). The lever, ankle pad and pivot geometry is the shared part.
// Assumed sizes (no card claim gives them; the spec that uses it lists them under "Unsourced numbers"): seat pad 40 x
// 36 cm, 7 cm (the vendored seat); back pad 7 cm thick; rollers 5.5 cm radius (the vendored kneePad); lever 4 cm tube;
// pivot boss 3 cm radius; pivot post 6 cm; handles 3 cm, 14 cm long; floor beam 5 cm.
import { sideBar } from './parts.mjs';

/**
 * p.pivot: world pivot point (level with the knee joint, c1). p.ankle: the ankle pad's contact on the lower leg in this
 *   pose and p.ankleN: the unit normal there, away from the leg; the roller sits on it (c3). p.thigh: the thigh pad's
 *   contact (thighTop) and p.thighN its normal (c2). p.seat: the seat top-surface centre. p.back: [upper, lower] back
 *   points the back pad is tangent to (c4). p.handle: a handle grip centre (c5). p.base: [zFrom, zTo] of the floor beam.
 * Returns LEG_CURL_ITEMS items, the moving ones first: [lever, ankle pad, pivot boss, thigh pad, seat, seat post, back
 *   pad, pivot post, handle, floor beam]; wrap it with perItem() (parts.mjs).
 */
export function legCurlMachine({ pivot, ankle, ankleN, thigh, thighN, seat, back, handle, base, r = 0.055, z = 'back' }) {
  const roller = [0, ankle[1] + ankleN[1] * r, ankle[2] + ankleN[2] * r];
  return [
    { ...sideBar(pivot, roller, 0.04, { z }), part: 'lever' },                                         // lever (moves)
    { type: 'kneePad', at: ankle, r, normal: ankleN, z: 'center', part: 'lever' },                       // ankle pad (moves)
    { type: 'pulley', at: pivot, r: 0.03, z: 'front' },                                                 // pivot boss
    { type: 'kneePad', at: thigh, r, normal: thighN, postTo: pivot, z: 'center' },                // thigh pad on its bracket
    { type: 'seat', at: seat, z },                                                                       // seat pad
    sideBar([0, 0.05, seat[2]], [0, seat[1] - 0.07, seat[2]], 0.06, { z }),                              // seat post
    { type: 'backPad', surface: back, len: 0.62, below: 0.04, post: false, z },                          // back pad
    sideBar([0, 0.05, pivot[2]], [0, pivot[1] - 0.03, pivot[2]], 0.06, { z }),                          // pivot post
    sideBar([0, handle[1] - 0.10, handle[2] - 0.02], [0, handle[1] + 0.04, handle[2]], 0.03, { z }),      // side handle
    sideBar([0, 0.025, base[0]], [0, 0.025, base[1]], 0.05, { z }),                                      // floor beam
  ];
}
export const LEG_CURL_ITEMS = 10;
