// Composer `ankleCuff` (LIB-18, LB8; census "box on the ankle landmark"; plan 2.1:140, D-LIB18-COMPOSERS): a padded
// ankle strap around the working shank just above the ankle joint, a short webbing tab on the side that faces the
// pulley and a D-ring at its end, where the cable's carabiner clips on. Side view, in the plane of the leg.
// Users: cable_kickback (the anchor plate: low pulley in front of the lifter, the ring on the front of the ankle) and
// resisted_hip_flexion (the low pulley behind the lifter, the ring on the back of the ankle). The ring side is never
// fixed here: it follows `toward` (the pulley), so one composer serves both.
// Every part moves with the ankle, so every part is a `poly` (drawn in the Mistake view, PQ-H9; plan.mjs:205-218).
// Returns CUFF_ITEMS items; wrap it with perItem() (parts.mjs) so each part gets its own key.
// Sizes (CUFF below; lb8/sizes.json holds each with its basis): the strap CUFF.h wide along the shank, centred CUFF.up
// above the ankle joint, CUFF.pad thick over the shank's surface; the tab CUFF.tab long and CUFF.tabW wide; the D-ring
// CUFF.ring across (outer) (a solid D).
import { sub, add, mul, norm } from './parts.mjs';

export const CUFF = Object.freeze({ h: 0.07, up: 0.055, pad: 0.010, tab: 0.025, tabW: 0.03, ring: 0.035 });
export const CUFF_ITEMS = 3;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/**
 * p.knee, p.ankle: world joint centres of the cuffed leg; p.toward: the world point the cable runs to (the pulley
 * centre); p.r: the shank's drawn radius (m) at the cuff centre (the spec reads it from the engine's RADII).
 * Returns the outline corners and `ring`, the world point where the cable meets the D-ring (its far edge, on the line
 * from the cuff centre toward `toward`).
 */
export function cuffGeometry({ knee, ankle, toward, r, size = CUFF }) {
  const u = norm(sub(knee, ankle));                                   // up the shank
  const c = add(ankle, mul(u, size.up));                              // strap centre on the shank axis
  // in the leg's plane (x is the view axis in side view): n = across the shank, on the pulley's side
  let n = [0, -u[2], u[1]];
  if (dot(n, sub(toward, c)) < 0) n = mul(n, -1);
  const half = r + size.pad, hh = size.h / 2;
  const P = (a, b) => add(add(c, mul(u, a)), mul(n, b));
  const band = [P(hh, half), P(hh, -half), P(-hh, -half), P(-hh, half)];
  const t0 = half, t1 = half + size.tab, tw = size.tabW / 2;
  const tab = [P(tw, t0 - 0.002), P(tw, t1), P(-tw, t1), P(-tw, t0 - 0.002)];
  // D-ring: a closed D outline, flat bar on the tab, round side away from the leg
  const R = size.ring / 2, k = 9, ring = [P(R, t1), ...Array.from({ length: k }, (_, i) => {
    const a = Math.PI / 2 - Math.PI * (i + 1) / (k + 1); return P(R * Math.sin(a), t1 + R * Math.cos(a));
  }), P(-R, t1)];
  const ringPt = P(0, t1 + R);
  return { centre: c, up: u, across: n, band, tab, ring, ringPt };
}

/** The drawn parts: strap (eq), tab (eq-solid), D-ring (eq-solid). All `poly`. */
export function ankleCuff(p) {
  const g = cuffGeometry(p), part = p.part ?? 'cuff', z = p.z ?? 'front';
  return [
    { type: 'poly', pts: g.band, cls: 'eq', z, part },
    { type: 'poly', pts: g.tab, cls: 'eq-solid', z, part },
    { type: 'poly', pts: g.ring, curve: false, cls: 'eq-solid', z, part },
  ];
}
export default ankleCuff;
