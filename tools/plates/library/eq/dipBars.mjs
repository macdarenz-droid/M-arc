// Composer `dipBars` (census gap `dipBars`, claude/howto-options 4a9fd86; LIB-17 Do 4; single use: weighted_dip, its
// anchor, plan 2.1:129-130, :141; D-LIB17-COMPOSERS, -DIP): a dip station seen from the side, as weighted_dip's card
// names it (plate.equipment "Parallel dip bars on a frame", hands about shoulder-width, c1, c2):
//  - two parallel bars, one either side of the body at the hands' width; in side view the near bar covers the far one;
//  - the frame: an upright under each bar at one end, the bars running from the uprights past the hands, as on a dip
//    tower, and a floor beam under each upright running under the station.
// Built only from existing primitives: backPad as a straight bar via eq/parts.mjs sideBar (class `eq`, with `poly`) for
// every part. The station draws nothing that moves: every part sits at one place in every pose, so the Mistake needs no
// twin (PQ-H9). The belt, chain and plate (c8) move with the body, so the spec draws them, not this composer (D-LIB17-DIP).
// Reads no file. Returns several items of one type, so a spec takes it through eq/parts.mjs perItem(fn, DIP_BARS_ITEMS).
// Side view only (weighted_dip's card and census view).
// Assumed sizes (no card claim gives them; the spec lists them under "Unsourced numbers" and lb7/sizes.json holds each
// with its basis): bar tube 4.5 cm, bars 60 cm long, the uprights 6 cm and 12 cm taller than the bars, the floor beams
// 6 cm, running from 15 cm behind the uprights to 95 cm in front of them.
import { sideBar } from './parts.mjs';

export const DIP_BARS = Object.freeze({ barT: 0.045, barLen: 0.60, postT: 0.06, postAbove: 0.12, beamT: 0.06, beamBack: 0.15, beamFront: 0.95 });
export const DIP_BARS_ITEMS = 6;

/**
 * p.barY: the bars' centre-line height (world m). p.barX: the bars' lateral offset (each bar at x = +-barX).
 * p.postZ: the uprights' world z; the bars run from there for barLen toward the lifter: forward (p.toward +1, the
 *   uprights behind the lifter) or back (p.toward -1, the uprights in front of the lifter, as on a dip tower faced from
 *   the open side). The floor beams run under the station from beamBack outside the uprights to beamFront inside them.
 * Returns, in order: far bar, far upright, far floor beam (z back), then near floor beam, near upright (z back) and
 * near bar (z mid: in front of the trunk and near leg, behind the near arm, so the near fist closes over it).
 */
export function dipBars({ barY, barX, postZ, toward = 1 }) {
  const C = DIP_BARS, out = [];
  for (const [s, near] of [[1, false], [-1, true]]) {
    const x = s * barX;
    const t = toward >= 0 ? 1 : -1, bar = sideBar([x, barY, postZ - t * C.postT / 2], [x, barY, postZ + t * C.barLen], C.barT, { z: near ? 'mid' : 'back', part: 'bar' });
    const post = sideBar([x, C.beamT, postZ], [x, barY + C.postAbove, postZ], C.postT, { z: 'back', part: 'frame' });
    const beam = sideBar([x, C.beamT / 2, postZ - t * C.beamBack], [x, C.beamT / 2, postZ + t * C.beamFront], C.beamT, { z: 'back', part: 'frame' });
    out.push(...(near ? [beam, post, bar] : [bar, post, beam]));
  }
  return out;
}
