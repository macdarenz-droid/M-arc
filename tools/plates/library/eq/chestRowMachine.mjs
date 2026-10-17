// Composer `chestRowMachine` (library plan 2.1, census gap chestRowMachine; LB1 user chest_supported_row): a
// chest-supported (plate-loaded or selectorised) row machine seen from the side, the lifter seated facing the chest pad
// (+z). Built only from existing primitives (box, seat, backPad, pulley, poly).
// - Frame: a floor rail and a front column carrying the chest pad and, at its top, the lever pivot.
// - Chest pad: upright, its face at `pad.face` (a world point on the face at mid-chest) tilted `pad.angle` from vertical
//   (+ leaning toward the lifter's face); it does not move in a rep.
// - Seat on its post, and a foot bar in front of the seat (static).
// - Lever handles: a lever from the pivot down to a handle at the lifter's grip (neutral: upright; overhand: end-on). The lever and
//   handle move between the end pose and the Mistake, so both are `poly` (PQ-H9).
// The handle follows the hands: `leverHandle(cfg, deg)` gives the handle point at a lever angle, so a spec puts the
// reach target on the lever's circle and the lever keeps its length in every pose (tests/howto/lb1-plates.test.ts).
// Assumed sizes (typical commercial chest-supported row, not one maker's drawing; no card claim gives sizes): chest pad
// 45 cm tall, 9 cm thick; column 6 cm; lever 5 cm thick; handle 13 cm long, 3 cm thick; seat as the vendored `seat`.
// Returns up to CHEST_ROW_ITEMS items; wrap it with perItem() (parts.mjs) so each part gets its own key.
import { polyBar } from './polybar.mjs';

const R = Math.PI / 180;
export const CHEST_ROW_ITEMS = 9;

/** The handle centre (world) at lever angle `deg` (0 = straight down from the pivot, + swinging back toward the lifter). */
export function leverHandle({ pivot, lever }, deg) {
  return [0, pivot[1] - lever * Math.cos(deg * R), pivot[2] - lever * Math.sin(deg * R)];
}

/** The lever angle (deg) whose handle is nearest world point g (the grips). */
export function leverAngle({ pivot }, g) {
  return Math.atan2(pivot[2] - g[2], pivot[1] - g[1]) / R;
}

/**
 * cfg: { seat: world centre of the seat top, pad: { face, angle = 0, len = 0.45, t = 0.09 }, pivot, lever,
 *   column: world z of the front column, footBar: world point or null, floor: [from z, to z],
 *   grip: 'neutral' (a vertical handle, default) | 'overhand' (a horizontal handle, end-on) }.
 * Returns (lm, ctx) => item[] (CHEST_ROW_ITEMS at most).
 */
export function chestRowMachine(cfg) {
  const { seat, pad, pivot, lever, column, floor } = cfg;
  const padLen = pad.len ?? 0.45, padT = pad.t ?? 0.09, ang = pad.angle ?? 0;
  const up = [0, Math.cos(ang * R), Math.sin(ang * R)];          // up the pad face; + angle leans the top toward the lifter
  const n = [0, -up[2], up[1]];                                     // into the pad, away from the lifter (+z at angle 0)
  const mid = [0, pad.face[1], pad.face[2]];
  const at = (s, d) => [0, mid[1] + up[1] * s + n[1] * d, mid[2] + up[2] * s + n[2] * d];
  const padBack = at(0, padT);
  return (lm) => {
    const g = [0, lm.grips[1], lm.grips[2]], a = leverAngle(cfg, g), h = leverHandle(cfg, a);
    return [
      { type: 'floor', from: floor[0], to: floor[1] },
      { type: 'box', at: [0, 0.022, (floor[0] + 0.1 + column + 0.08) / 2], w: column + 0.08 - floor[0] - 0.1, h: 0.044, rc: 1, z: 'center' },   // floor rail
      { type: 'box', at: [0, (pivot[1] + 0.05) / 2, column], w: 0.06, h: pivot[1] + 0.05, rc: 1 },                                              // front column
      polyBar(padBack, [0, padBack[1], column], 0.05, { z: 'back' }),                                                                         // pad arm to the column
      { type: 'poly', z: 'back', pts: [at(-padLen / 2, 0), at(padLen / 2, 0), at(padLen / 2, padT), at(-padLen / 2, padT)] },                // chest pad
      { type: 'seat', at: seat, len: 0.36 },
      cfg.footBar ? { type: 'box', at: cfg.footBar, w: 0.05, h: 0.05, rc: 2 } : null,                                                         // foot bar
      polyBar(pivot, h, 0.05, { z: 'mid', part: 'lever' }),                                                                                   // lever
      cfg.grip === 'overhand'                                                                                                                 // handle
        ? { type: 'poly', cls: 'eq-solid', z: 'mid', part: 'lever', pts: Array.from({ length: 8 }, (_, i) => [0, h[1] + 0.016 * Math.sin(i * 45 * R), h[2] + 0.016 * Math.cos(i * 45 * R)]) }
        : polyBar([0, h[1] - 0.065, h[2]], [0, h[1] + 0.065, h[2]], 0.03, { cls: 'eq-solid', z: 'mid', part: 'lever' }),
    ].filter(Boolean);
  };
}
