// Composer `wall` (census gap `wall`, claude/howto-options 4a9fd86; LIB-14 Do 4; users wall_sit (anchor) and later
// wall_ball, LB10, plan 2.1:139): a plain wall seen side-on, one filled vertical slab standing on the floor line, its
// face the plane the back rests on (wall_sit w2, w4, w5).
// Built only from an existing primitive: eq/parts.mjs sideBar (a backPad in its surface form), so the slab's face sits
// exactly on `face`. The wall is static in every pose, so the Mistake needs no poly twin (PQ-H9). Reads no file.
// Assumed sizes (no card claim gives them; the spec that uses it lists them under "Unsourced numbers"): height 1.9 m,
// thickness 12 cm.
import { sideBar } from './parts.mjs';

export const WALL = Object.freeze({ h: 1.9, t: 0.12 });

/**
 * face: the world z of the wall face (the side the body touches); the slab extends `t` behind it (toward -z, the
 * figure faces +z). y0: the bottom (default the floor).
 */
export function wall({ face, h = WALL.h, t = WALL.t, y0 = 0 }) {
  const z = face - t / 2;
  return sideBar([0, y0, z], [0, y0 + h, z], t, { z: 'back' });
}
