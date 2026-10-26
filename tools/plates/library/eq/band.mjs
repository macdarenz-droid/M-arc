// Composer `band` (library plan 2.1, census gap band; LB1 anchor resistance_band_row): a resistance band looped round
// the soles of both feet, seen from the side, its two ends held in the hands (floor-sit row). Built only from `poly`.
// - The loop lies across the sole at the ball of the foot (card resistance_band_row c1: around the soles), one band
//   thickness out from the sole, from the ball back toward the arch.
// - Two strands run straight (under tension) from the loop to the fists: the near strand (to grip.r) in front of the near
//   leg, the far strand (to grip.l) behind it. The strands move between the end pose and the Mistake, so they are `poly`
//   (PQ-H9); the loop is `poly` too, so the band reads as one material.
// Assumed sizes (a typical flat loop band seen edge-on, not one maker's; no card claim gives sizes): 1.2 cm thick at
// the hands, 0.8 cm on the sole.
// Returns up to BAND_ITEMS items; wrap it with perItem() (parts.mjs) so each part gets its own key.
import { polyBar } from './polybar.mjs';

export const BAND_ITEMS = 3;
const sub = (a, b) => a.map((v, i) => v - b[i]), add = (a, b) => a.map((v, i) => v + b[i]), mul = (a, k) => a.map(v => v * k);
const unit = a => { const L = Math.hypot(...a) || 1; return a.map(v => v / L); };
const yz = p => [0, p[1], p[2]];

/** Where the band leaves the sole (world, side plane) and the sole's outward normal, for one foot's landmarks. */
export function bandAnchor(lm, side = 'r', t = 0.008) {
  const ball = yz(lm[`ball.${side}`]), heel = yz(lm[`heel.${side}`]), ankle = yz(lm[`ankle.${side}`]);
  const along = unit(sub(heel, ball)), out = unit(sub(sub(ball, ankle), mul(along, sub(ball, ankle).reduce((s, v, i) => s + v * along[i], 0))));
  const a = add(ball, mul(out, t / 2)), b = add(add(ball, mul(along, 0.06)), mul(out, t / 2));
  return { loop: [a, b], leave: a, out };
}

/** cfg: { t = 0.012 (strand), loopT = 0.008 }. Returns (lm, ctx) => item[] (BAND_ITEMS). */
export function band({ t = 0.012, loopT = 0.008 } = {}) {
  return (lm) => {
    const A = bandAnchor(lm, 'r', loopT);
    return [
      polyBar(A.loop[0], A.loop[1], loopT, { c: 0.002, cls: 'eq-solid', z: 'front', part: 'band' }),                                   // loop on the soles
      polyBar(A.leave, yz(lm['grip.l']), t, { c: 0.002, cls: 'eq-solid', z: 'center', part: 'band' }),                                // far strand
      polyBar(A.leave, yz(lm['grip.r']), t, { c: 0.002, cls: 'eq-solid', z: 'front', part: 'band' }),                                 // near strand
    ];
  };
}
