// Composer `safetyArms` (census gap `safetyArms`, claude/howto-options 477585f): a power rack seen from the side,
// with its safety arms set. Two uprights (the vendored `rackUpright`, same 76 mm tube and hole row as the approved
// plates), a top cross-member, and one safety arm per side running front to back between the uprights at `armY`.
// In side view both arms project onto one line, drawn once. Built only from existing primitives (rackUpright,
// backPad as a straight bar via sideBar); every part is static (PQ-H9 needs no poly twin).
// Assumed sizes (typical commercial power rack; the spec names its source): uprights 1.2 m apart front to back
// (inside depth about 1.1 m), 2.3 m tall; safety arm a 5 x 7.5 cm tube reaching 10 cm past each upright.
import { sideBar } from './parts.mjs';

/**
 * p.front, p.back: world z of the front and rear uprights (the lifter stands between them, facing +z).
 * p.armY: world height of the top of the safety arms (set below the bar's rack position, per the card).
 * p.h: upright height. Returns item[] for `equipment`; spread it (each item is its own entry).
 * p.hookY (add-only, LIB-8 critic 10-02; default null = no hook, the output is unchanged): world height of the bar's
 *   bearing surface on a J-hook fixed to the FRONT upright's rear face, pointing back toward the lifter inside the rack.
 *   Same shape and size as the vendored rackUpright hook (7 cm arm, 1.5 cm thick, 5 cm lip), as a static `poly`
 *   (rackUpright's own hook points the way the figure faces, i.e. out of the rack on the front upright).
 */
export function safetyArms({ front, back, armY, h = 2.3, arm = 0.075, over = 0.1, z = 'back', hookY = null }) {
  const tube = 0.076;
  const hook = hookY == null ? [] : (() => {
    const zf = front - tube / 2, y = hookY - 0.015, s = -1;   // s: toward the lifter (-z); y: the arm's underside
    const pz = (dz, dy) => [0, y + dy, zf + s * dz];
    return [{ type: 'poly', pts: [pz(0, 0), pz(0.07, 0), pz(0.07, 0.05), pz(0.055, 0.05), pz(0.055, 0.015), pz(0, 0.015)], cls: 'eq', z }];
  })();
  return [
    { type: 'rackUpright', at: [0, 0, back], h, z },
    { type: 'rackUpright', at: [0, 0, front], h, z },
    sideBar([0, h - 0.04, back - tube / 2], [0, h - 0.04, front + tube / 2], 0.08, { z }),              // top cross-member
    sideBar([0, armY - arm / 2, back - over], [0, armY - arm / 2, front + over], arm, { z }),           // safety arm
    ...hook,
  ];
}
