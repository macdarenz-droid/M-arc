// Composer `battleRope` (census gap `battleRope`, "new primitive or box/line composition (single user)",
// claude/howto-options 4a9fd86; LIB-22 Do 4; single use: battle_ropes, its anchor, plan 2.1:141; D-LIB22-COMPOSERS):
// the two ends of a battle rope seen from the SIDE (battle_ropes' card and census view).
//  - each rope end: one closed `poly` strand ropeT thick (c8 "1.5 inches (3.8 cm) thick"), from the fist forward to
//    `edgeZ` (the plate's edge, toward the anchor off the plate, plate.equipment). Its rest line runs straight from the
//    hand's mid-height `restY` at the hand down to the floor at the edge (the slack end lying toward the anchor, c1
//    "some slack"); the wave rides on it: the hand's offset from `restY`, carried forward as a cosine of `waveLen`
//    and fading linearly to nothing at the edge, so the strand starts in the fist and never dips under the floor.
//    Seen from the side, the near and far ropes, driven by hands at opposite heights, are in opposite phase (c3).
// Every part moves with the hands (start, end, Mistake), so every part is a `poly` (PQ-H9), and each rope runs unbroken
// from the hand to the plate edge in every pose (A15, A18). Reads no file. Returns BATTLE_ROPE_ITEMS items of one type
// [far rope (z back), near rope (z mid)]; a spec takes it through eq/parts.mjs perItem.
// Assumed sizes (lb10/sizes.json holds each with its basis): the rope 3.8 cm thick (c8); n samples per strand side.
import { add, mul, sub, norm } from './parts.mjs';

export const BATTLE_ROPE = Object.freeze({ ropeT: 0.038, n: 64 });
export const BATTLE_ROPE_ITEMS = 2;

/** The rope's centre line (side view, y-z at the hand's x): from the grip g to the floor at edgeZ. */
export function ropeLine(g, { restY, edgeZ, waveLen, floorY = 0 }, C = BATTLE_ROPE) {
  const L = edgeZ - g[2], A = g[1] - restY, lo = floorY + C.ropeT / 2, pts = [];
  for (let k = 0; k <= C.n; k++) {
    const s = k / C.n, d = s * L, rest = restY + (lo - restY) * s;
    pts.push([g[0], rest + A * Math.cos(2 * Math.PI * d / waveLen) * (1 - s), g[2] + d]);
  }
  return pts;
}
/** A strand outline ropeT thick around a centre line (offsets in the y-z plane). */
function strand(line, t) {
  const off = (i, sgn) => { const q = line[Math.min(line.length - 1, i + 1)], o = line[Math.max(0, i - 1)], d = norm(sub(q, o)); return add(line[i], mul([0, d[2], -d[1]], sgn * t / 2)); };
  return [...line.map((_, i) => off(i, 1)), ...line.map((_, i) => off(i, -1)).reverse()];
}
/**
 * p.grips: { l, r } world grip centres (l = far, r = near in the side view); p.restY: the hands' mid-height (the rope's
 * rest line at the hand); p.edgeZ: the plate edge's world z; p.waveLen: the wave's length (m); p.floorY: the floor.
 * Returns [far rope, near rope], each a closed `poly` strand.
 */
export function battleRope({ grips, restY, edgeZ, waveLen, floorY = 0, part = 'rope' }, C = BATTLE_ROPE) {
  return [['l', 'back'], ['r', 'mid']].map(([s, z]) => ({ type: 'poly', pts: strand(ropeLine(grips[s], { restY, edgeZ, waveLen, floorY }, C), C.ropeT), cls: 'eq-solid', z, part }));
}
