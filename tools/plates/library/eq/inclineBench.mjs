// Composer `inclineBench` (library plan 2.1): an adjustable bench, side view. Seat pad plus a back pad at any angle
// from vertical (0 = upright shoulder-press setting, about 45-60 = incline press), on a floor beam with a front and a
// rear foot, a seat post and a back-pad strut. Built only from existing primitives (backPad, box).
// Assumed sizes (typical commercial adjustable bench, not one maker's drawing; the spec that uses it names its
// source): seat 36 cm long, pad 7 cm thick, back pad 80 cm long, both 29 cm wide; floor beam 1.3 m; feet 40 cm wide.
// Every part is static (a bench does not move in a rep), so the Mistake needs no `poly` twin (PQ-H9).
import { sideBar, add, mul } from './parts.mjs';
const R = Math.PI / 180;

/**
 * p.hinge: world point where the seat's rear edge meets the back pad (top surfaces), usually from the lifter's
 *   `seat` and `buttock` landmarks.
 * p.back: back-pad angle from vertical (deg, + reclined toward -z). p.seatTilt: seat front edge up (deg, default 0).
 * p.seatLen, p.backLen, p.pad (thickness), p.beamZ: [rear z, front z] of the floor beam.
 * Returns item[] for `equipment`. Also returns the pad faces for `checks` via inclineFaces().
 */
export function inclineFaces({ hinge, back = 45, seatTilt = 0 }) {
  const ub = [0, Math.cos(back * R), -Math.sin(back * R)];        // up the back pad
  const us = [0, Math.sin(seatTilt * R), Math.cos(seatTilt * R)];  // forward along the seat
  return {
    back: { point: hinge, normal: [0, Math.sin(back * R), Math.cos(back * R)], up: ub },
    seat: { point: hinge, normal: [0, Math.cos(seatTilt * R), -Math.sin(seatTilt * R)], forward: us },
  };
}

export function inclineBench({ hinge, back = 45, seatTilt = 0, seatLen = 0.36, backLen = 0.8, pad = 0.07, beamZ = null, z = 'back' }) {
  const { back: B, seat: S } = inclineFaces({ hinge, back, seatTilt });
  const inward = (n, d) => mul(n, -d);   // from a pad face into the pad
  // pads: bars centred half a pad under their faces
  const seatA = add(hinge, inward(S.normal, pad / 2)), seatB = add(seatA, mul(S.forward, seatLen));
  const backA = add(add(hinge, inward(B.normal, pad / 2)), mul(B.up, -0.02)), backB = add(backA, mul(B.up, backLen));
  const beamY = 0.045, bz = beamZ ?? [Math.min(hinge[2] - 0.55, backB[2] - 0.05), hinge[2] + seatLen + 0.05];
  const seatMid = add(seatA, mul(S.forward, seatLen * 0.45)), under = add(seatMid, mul(S.normal, -pad / 2));
  const backMid = add(backA, mul(B.up, backLen * 0.45)), behind = add(backMid, mul(B.normal, -pad / 2));
  const strutFoot = [0, beamY, Math.max(bz[0] + 0.1, behind[2] - 0.05)];
  return [
    sideBar([0, beamY, bz[0]], [0, beamY, bz[1]], 0.05, { z }),                        // floor beam
    { type: 'box', at: [0, 0.018, bz[0] + 0.06], w: 0.12, h: 0.036, z },               // rear foot
    { type: 'box', at: [0, 0.018, bz[1] - 0.06], w: 0.12, h: 0.036, z },               // front foot
    sideBar(under, [0, beamY, under[2]], 0.05, { z }),                                 // seat post
    sideBar(behind, strutFoot, 0.04, { z }),                                           // back-pad strut
    sideBar(backA, backB, pad, { z }),                                                 // back pad
    sideBar(seatA, seatB, pad, { z }),                                                 // seat pad
  ];
}
