// Composer `pecDeck` (library plan 2.1): a seated pec-deck (rear-pivot fly machine), FRONT view. Seat and back pad on
// a centre column; a top housing carries two pivots above the shoulders; each arm runs out level from its pivot,
// turns down at a corner and ends in a vertical handle held in a neutral grip. The arm swings about the pivot's
// vertical axis, so in the front view the corner and handle travel sideways (their depth is not drawn).
// Assumed sizes (typical commercial pec deck; the spec names its source): arm tubes 5 cm, handles 14 cm long,
// pivot boss 4 cm, seat pad 36 cm wide, back pad 30 x 70 cm, column 8 cm.
// Returns PEC_DECK_ITEMS items; wrap it with perItem() (parts.mjs) so same-type items get their own keys.
// Moving parts (arm, corner, handle) are backPad/chestPress items with `poly` (PQ-H9).
import { frontBar } from './parts.mjs';

/**
 * p.pivot: { l, r } world pivot points (top of each arm's vertical axis); p.grips: { l, r } world grip centres;
 * p.seat: world top-surface centre of the seat; p.back: { at, len } back pad centre point and length;
 * p.top: world y of the housing; p.pxPerM: the plate scale (front bars are sized in px by the backPad primitive).
 */
export function pecDeck({ pivot, grips, seat, back, top, pxPerM, grip = 0.14, tube = 0.05, z = 'mid', part = 'arm', direct = false, uprights = null }) {
  const out = [
    { type: 'seat', at: seat, z: 'back' },
    { type: 'backPad', at: back.at, angle: 0, len: back.len, below: back.len / 2, width: 0.3, post: false, z: 'back' },
    frontBar([0, 0.03, back.at[2]], [0, top, back.at[2]], 0.08, pxPerM, { z: 'back' }),                  // centre column
    frontBar([pivot.r[0] - 0.08, top, back.at[2]], [pivot.l[0] + 0.08, top, back.at[2]], 0.07, pxPerM, { z: 'back' }),   // housing
  ];
  // uprights (add-only option): x offset of two frame legs from the floor to the housing, one outside each pivot
  if (uprights != null) for (const x of [-uprights, uprights]) out.push(frontBar([x, 0.03, back.at[2]], [x, top, back.at[2]], 0.05, pxPerM, { z: 'back' }));
  for (const s of ['l', 'r']) {
    const p = pivot[s], g = grips[s], corner = [g[0], p[1], g[2]];
    out.push({ type: 'pulley', at: p, r: 0.04, z: 'back' });                                        // pivot boss
    // direct (add-only option): one straight lever from the pivot down to the handle, no level arm
    if (direct) { out.push({ type: 'chestPress', pivot: p, handle: g, grip, gripAxis: [0, 1, 0], z, part }); continue; }
    out.push({ ...frontBar(p, corner, tube, pxPerM, { z }), part });                               // level arm
    out.push({ type: 'chestPress', pivot: corner, handle: g, grip, gripAxis: [0, 1, 0], z, part });   // drop + handle
  }
  return out;
}

export const PEC_DECK_ITEMS = 10;   // default; `uprights` adds 2, `direct` removes 2
