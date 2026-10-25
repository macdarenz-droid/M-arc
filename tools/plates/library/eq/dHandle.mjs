// Composer `dHandle` (LB1, single_arm_lat_pulldown; card c1: a single handle on the cable): a single D-handle seen from
// the side. The grip (upright, held in a neutral or unstated palm direction) and the two side rails to the cable ring
// are separate `poly` parts, because the handle moves between the end pose and the Mistake (PQ-H9).
// Assumed sizes (typical stirrup handle, not one maker's; no card claim gives sizes): grip 12 cm long, 3 cm thick; rails
// 1.6 cm; ring 3.5 cm across, 13 cm from the grip toward the cable.
// Returns up to D_HANDLE_ITEMS items; wrap it with perItem() (parts.mjs) so each part gets its own key.
import { polyBar } from './polybar.mjs';

export const D_HANDLE_ITEMS = 4;
const R = Math.PI / 180;

/** The cable ring centre (world) of a handle held at grip g, pulled toward unit direction `toward`. */
export const dHandleRing = (g, toward, reach = 0.13) => [0, g[1] + toward[1] * reach, g[2] + toward[2] * reach];

/** cfg: { grip(lm) -> world grip centre, toward(g) -> unit direction to the cable, reach = 0.13, z = 'mid', part = 'handle' }. */
export function dHandle({ grip, toward, reach = 0.13, z = 'mid', part = 'handle' }) {
  return (lm) => {
    const g = grip(lm), u = toward(g), ring = dHandleRing(g, u, reach);
    const n = [0, -u[2], u[1]];                                     // across the cable line, in the side plane
    const ends = [-1, 1].map(s => [0, g[1] + n[1] * 0.06 * s, g[2] + n[2] * 0.06 * s]);
    return [
      polyBar(ends[0], ends[1], 0.03, { cls: 'eq-solid', z, part }),                                                // grip
      ...ends.map(e => polyBar(e, ring, 0.016, { c: 0.004, z, part })),                                            // side rails
      { type: 'poly', z, part, pts: Array.from({ length: 8 }, (_, i) => [0, ring[1] + 0.0175 * Math.sin(i * 45 * R), ring[2] + 0.0175 * Math.cos(i * 45 * R)]) },   // ring
    ];
  };
}
