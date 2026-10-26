// Composer `declineBench` (census gap `declineBench`, claude/howto-options 4a9fd86; LIB-10 Do 4): a decline bench seen
// from the side, head end low, with its own rack. Parts, as decline_bench_press's card names them:
//  - the declined pad under the lifter, head end low (c2), and its frame: a short leg at the head end, a tall post at
//    the high end, a floor beam;
//  - the foot pads at the high end (c1): a leg post rising from the frame to two rollers the feet hook under;
//  - the rack at the head end, slightly behind the head (c1), with a J-hook at the rack height (c7);
//  - one safety arm per side (c6), running from the rack upright toward the feet; in side view both project onto one
//    line, drawn once.
// Built only from existing primitives (backPad as a straight bar via sideBar, box, kneePad, rackUpright). Every part
// is static (a bench and its rack do not move in a rep), so the Mistake needs no `poly` twin (PQ-H9). Reads no file.
// Assumed sizes (typical commercial decline bench with uprights; no card claim gives them, and the spec that uses it
// lists them under "Unsourced numbers"): pad 7 cm thick, 29 cm wide; rollers 11 cm; uprights 7.6 cm tube (the vendored
// rackUpright); safety arm a 5 cm tube.
import { sideBar, add, mul } from './parts.mjs';
const R = Math.PI / 180;

/**
 * The pad face as a plane: `at` is a world point on the pad's top surface, `angle` the decline (deg, head end low:
 * the face rises toward +z). Returns { point, normal, along } with `along` the unit vector up the pad toward the feet.
 */
export function declineFace({ at, angle }) {
  const along = [0, Math.sin(angle * R), Math.cos(angle * R)];
  return { point: at, normal: [0, Math.cos(angle * R), -Math.sin(angle * R)], along };
}

/**
 * p.at, p.angle: the pad face (declineFace). p.head, p.foot: the pad's ends, as distances along the face from `at`
 *   (head end negative). p.pad: pad thickness.
 * p.rollers: world centres of the two foot rollers (one per side, they project onto one circle) and p.rollerR.
 * p.rack: { z, h, hookY } the upright's world z, height and J-hook bearing height (null = no rack).
 * p.safety: { y, from, to } the safety arm's top height and its world z span (null = no arms).
 * Returns item[] for `equipment`; spread it (each item is its own entry).
 */
export function declineBench({ at, angle, head = -0.95, foot = 0.25, pad = 0.07, rollers = null, rollerR = 0.055, rack = null, safety = null, z = 'back' }) {
  const F = declineFace({ at, angle });
  const inward = mul(F.normal, -pad / 2);
  const padA = add(add(at, inward), mul(F.along, head)), padB = add(add(at, inward), mul(F.along, foot));
  const under = (u, d) => add(add(at, mul(F.normal, -pad)), mul(F.along, u)).map((v, i) => (i === 1 ? v - d : v));
  const beamY = 0.045;
  const headLeg = under(head + 0.12, 0), footLeg = under(foot - 0.10, 0);
  const beam = [Math.min(headLeg[2], rack ? rack.z : headLeg[2]) - 0.08, Math.max(footLeg[2], rollers ? rollers[2] : footLeg[2]) + 0.10];
  const items = [
    sideBar([0, beamY, beam[0]], [0, beamY, beam[1]], 0.05, { z }),                    // floor beam
    { type: 'box', at: [0, 0.018, beam[0] + 0.06], w: 0.12, h: 0.036, z },             // head-end foot
    { type: 'box', at: [0, 0.018, beam[1] - 0.06], w: 0.12, h: 0.036, z },             // high-end foot
    sideBar(headLeg, [0, beamY, headLeg[2]], 0.05, { z }),                             // head-end leg
    sideBar(footLeg, [0, beamY, footLeg[2]], 0.05, { z }),                             // high-end post
    sideBar(padA, padB, pad, { z }),                                                   // the declined pad
  ];
  if (rollers) {
    // leg post: straight up from the floor beam to the rollers' hub
    const hub = rollers;
    items.push(sideBar([0, beamY, hub[2]], [0, hub[1], hub[2]], 0.045, { z }));
    items.push({ type: 'kneePad', at: [0, hub[1] - rollerR, hub[2]], r: rollerR, z: 'front' });
  }
  if (rack) {
    items.push({ type: 'rackUpright', at: [0, 0, rack.z], h: rack.h, hook: rack.hookY, z });
  }
  if (safety) {
    const arm = 0.05;
    items.push(sideBar([0, safety.y - arm / 2, safety.from], [0, safety.y - arm / 2, safety.to], arm, { z }));
  }
  return items;
}
