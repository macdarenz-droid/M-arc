// Composer `smith` (census gap `smith`, claude/howto-options 4a9fd86; LIB-11 Do 3): a Smith machine seen from the side.
// Parts, as smith_machine_bench_press's card names them (c2, c4, c5, c8):
//  - the rail: the guide rod the bar runs on, one per side; in side view both project onto one line, drawn once. The bar
//    runs in "a completely straight path" (c8), so the bar's centre is always on this line;
//  - the hook rail: a slotted upright beside the rod (the vendored rackUpright and its hole row), one per side, one line;
//  - the carriage: the sleeve that rides the rod with the bar, and its hook, which reaches from the carriage to the hook
//    rail's face (c5: the bar is rotated off and back onto the hooks);
//  - the safety stop: a catch on the rod, its top below the bar's lowest drawn point (c4); `stop` sets its size and
//    `stopZ` its layer (a spec draws it in front of the body so it reads as a solid catch, D-LIB11-PANEL1);
//  - the frame: a floor beam and a top cross-member joining rod and hook rail.
// Built only from existing primitives (sideBar's backPad, box, rackUpright, poly). Reads no file. The carriage and its
// hook move with the bar (start to end); in the Mistake the bar stays on its line, so nothing moves between end and
// Mistake unless the spec moves the bar, and then the carriage is a backPad and the hook a poly (both carry `poly`,
// PQ-H9). Side view only.
// Later users (plan 2.1:137) and what they need, so the anchor is not redrawn for them: smith_machine_incline_press (an
// incline bench under the bar: the spec draws the bench, `rail` unchanged), smith_machine_shoulder_press (a seat and a
// high bar: `top` and `stopY` only), smith_machine_squat (a standing lifter, the bar on the back: `stopY` low, the
// floor beam clear of the feet with `base`), smith_machine_shrug (the bar at hip height, stops under it: `stopY`).
// Assumed sizes (no card claim gives them; the spec that uses it lists them under "Unsourced numbers"): the rail is
// vertical (0 degrees, `angle` is not offered) and a 3 cm rod; hook rail 7.6 cm (the vendored rackUpright) 9 cm footward
// of the rod, centre to centre; carriage 6 x 5 cm; hook arm 1.5 cm thick with a 2 cm lip; stop collar 6 x 4 cm; frame
// top 2.1 m; floor beam 5 cm.
import { sideBar, add } from './parts.mjs';

export const RAIL_T = 0.03, HOOK_GAP = 0.09, UPRIGHT_W = 0.076, CARRIAGE = { w: 0.06, h: 0.05 }, STOP = { w: 0.06, h: 0.04 };

/** The hook rail's near face (world z) for a rod at `railZ`: the face the hook reaches. */
export const hookFaceZ = railZ => railZ + HOOK_GAP - UPRIGHT_W / 2;

/**
 * p.railZ: world z of the rod (the bar's line). p.bar: world centre of the bar in this pose ([x, y, z]; x is ignored,
 *   y is read, z must equal railZ: the composer throws if it does not, c8). p.stopY: world height of the stop's top.
 * p.stop: the stop's { w, h } (default STOP). p.stopZ: its layer (default `z`). p.top: frame height. p.base: [zFrom, zTo] of the floor beam. Returns SMITH_ITEMS items, the moving ones first:
 *   [carriage, hook, stop, rod, hook rail, top member, floor beam]; wrap it with perItem() (parts.mjs).
 */
export function smith({ railZ, bar, stopY, stop: st = STOP, stopZ = null, top = 2.1, base = null, z = 'back' }) {
  if (Math.abs(bar[2] - railZ) > 1e-9) throw new Error(`smith: the bar centre (z ${bar[2]}) is off the rail (z ${railZ}): the bar path is straight (c8)`);
  const y = bar[1], face = hookFaceZ(railZ);
  const carriage = { ...sideBar([0, y, railZ - CARRIAGE.w / 2], [0, y, railZ + CARRIAGE.w / 2], CARRIAGE.h, { z }), part: 'carriage' };
  // hook: an arm from the carriage's foot-side face to the hook rail's face, then a lip up the face (a J lying on its side)
  const c = railZ + CARRIAGE.w / 2, t = 0.015, lip = 0.02, y0 = y - CARRIAGE.h / 2;
  const P = (zz, yy) => [0, yy, zz];
  const hook = { type: 'poly', pts: [P(c, y0), P(face, y0), P(face, y0 + lip + t), P(face - t, y0 + lip + t), P(face - t, y0 + t), P(c, y0 + t)], cls: 'eq', z, part: 'hook' };
  const stop = { type: 'box', at: [0, stopY - st.h / 2, railZ], w: st.w, h: st.h, z: stopZ ?? z };
  const rod = sideBar([0, 0.05, railZ], [0, top, railZ], RAIL_T, { z });
  const upright = { type: 'rackUpright', at: [0, 0, railZ + HOOK_GAP], h: top, z };
  const b = base ?? [railZ - 0.35, railZ + 0.45];
  const member = sideBar([0, top - 0.03, railZ - 0.06], [0, top - 0.03, railZ + HOOK_GAP + UPRIGHT_W / 2 + 0.02], 0.06, { z });
  const beam = sideBar(add([0, 0.025, 0], [0, 0, b[0]]), [0, 0.025, b[1]], 0.05, { z });
  return [carriage, hook, stop, rod, upright, member, beam];
}
export const SMITH_ITEMS = 7;
