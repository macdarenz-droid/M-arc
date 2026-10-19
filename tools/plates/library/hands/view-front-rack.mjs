// LIB-12 front-rack view (drawing code only; registry entry hand-front-rack.mjs). Research:
// shared/front-rack-exemption.json c1, c4, c5 and cards/front_squat.json c3, c4.
//
// Camera: the side, lifter facing right, y grows DOWN, the shoulder joint S at the origin. The hand is golden B's own
// hand (engine handGeometry, drawn by lib12-hand.mjs as the engine draws it, D-LIB12FIX-R8): radial view, the bar
// end-on, 28 mm (golden B's bar value, passed explicitly, D-LIB12-2). The rack hand comes up under the bar with the
// wrist bent back, the palm turned up and back toward the shoulder, the bar on the finger bases and the fingers loose
// behind it (c4 "fingertip rack ... fine if the bar stays on the shoulders"); the bar rests on the shoulder shelf, the
// front of the deltoid (c1, c5). The frame is a close-up: the hand, the bar and the shelf.
//
// pose: { barLiftMm: the bar's gap above the shoulder shelf (Right 0: the shoulders hold the bar, c1/c5; Wrong: lifted
//         off them, held by the hands, c4), barForwardMm, upperArmDeg: the upper arm's angle above the horizontal
//         (Right: elbows high, c5; Wrong: elbows down), barInPalm: the bar sits in the palm (a full grip carrying it,
//         c4) instead of on the fingers }
import { handGeometry, projector, sideHand } from './lib12-hand.mjs';
import { add, dir, handLength, len, mul, sub } from './view-common.mjs';

export const FRONT_RACK_BAR = { diameterMm: 28 };   // D-LIB12-2
export const FRONT_RACK_DEFAULT = { barLiftMm: 0, barForwardMm: 0, upperArmDeg: 10, barInPalm: false };
const UPPER_OF_H = 0.186, FOREARM_OF_H = 0.146;   // Winter 2009 (vendored body.mjs WINTER.upperArm, .forearm)
// the two hands (engine HandPose; drawing values, D-LIB12-9): the bar on the finger bases, fingers loose behind it, thumb
// resting (c4); or the bar deep in the palm, a full grip with the thumb round it
const RACK = { contactAt: 1.45, fingers: { curl: 0.3 }, thumb: 'loose', ext: [60, 100] };
const PALM = { contactAt: 0.3, fingers: { curl: 1 }, thumb: 'wrapped', ext: [0, 90] };

export function frontRackHalf(poseIn = {}, { H = 1750, role = 'right', bar = FRONT_RACK_BAR } = {}) {
  const pose = { ...FRONT_RACK_DEFAULT, ...poseIn }, HL = handLength(H), s = HL / 189;
  const S = [0, 0], rDelt = 52 * s, rBar = bar.diameterMm / 2;
  const shelfDir = dir(-58), shelfPt = add(S, mul(shelfDir, rDelt));
  const B = add(add(S, mul(shelfDir, rDelt + rBar + pose.barLiftMm)), [pose.barForwardMm, 0]);
  const Lu = UPPER_OF_H * H, Lf = FOREARM_OF_H * H, E = add(S, mul(dir(-pose.upperArmDeg), Lu));
  // the hand: the bar is the engine's handle; solve the wrist angle (within the hand's range) and the forearm's screen
  // direction so the handle's centre is B and the forearm runs from the wrist to the elbow E (mirrored radial view: the
  // lifter faces right)
  const hand = pose.barInPalm ? PALM : RACK;
  let best = null;
  for (let ext = hand.ext[0]; ext <= hand.ext[1]; ext += 0.5) {
    const g = handGeometry({ view: 'radial', wrist: { ext }, contactAt: hand.contactAt, fingers: hand.fingers, thumb: hand.thumb,
      handle: { profile: 'bar-28', diameterMm: bar.diameterMm, axis: 'across' }, load: { kind: 'on-body' } }, { H });
    for (let fa = 180; fa < 360; fa += 0.25) {
      const P0 = projector({ forearmDeg: fa, ext, mirror: true }), c = P0.Hh(g.circle.c), W = sub(B, c);
      if (!(W[1] > B[1] + 15 && W[0] > B[0])) continue;   // the wrist below the bar and in front of it: the hand comes up under the bar
      const err = len(sub(add(W, mul(P0.U, -Lf)), E));
      if (!best || err < best.err) best = { err, ext, fa, g, W };
    }
  }
  const { g, ext, fa, W } = best, P = projector({ W, forearmDeg: fa, ext, mirror: true });
  const h = sideHand({ ...g, e: ext, near: [g.index], far: g.far, thumb: { pts: g.thumb.pts, segs: g.tsegs, palmSide: hand.thumb === 'beside' ? -1 : 1 },
    thumbLayer: 'thumb', grip: g.circle, closed: g.pose.fingers.open <= 0.2, foreLen: 55 * s }, P);
  // the shoulder shelf behind: the front of the deltoid as an arc band, cut at both ends
  const arc = (r, a0, a1, n = 16) => Array.from({ length: n + 1 }, (_, i) => add(S, mul(dir(a0 + (a1 - a0) * i / n), r)));
  const delt = [...arc(rDelt, -95, -15, 10), ...arc(rDelt - 16 * s, -15, -95, 10)];   // the shelf: an arc band of the deltoid's front, cut
  const layers = [{ union: 'h-far', rings: [{ ring: delt, smooth: true }] }, ...h.layers, { joint: true, at: W }];
  if (pose.barLiftMm > 0 || pose.barForwardMm > 0) { const gapEnd = add(B, mul(sub(S, B), rBar / len(sub(S, B)))); layers.push({ path: 'h-mark', line: [add(S, mul(sub(gapEnd, S), rDelt / len(sub(gapEnd, S)))), gapEnd] }); }
  else layers.push({ contact: true, at: shelfPt });
  // report: bar gap to the shelf, where the bar sits on the hand, finger contact, upper-arm elevation
  const mcp = g.mcpI[0], uB = g.circle.c[0];
  const palmar = g.palmar, vAt = u => { for (let i = 1; i < palmar.length; i++) if (u <= palmar[i][0]) { const [a, b] = [palmar[i - 1], palmar[i]]; return a[1] + (b[1] - a[1]) * (u - a[0]) / (b[0] - a[0]); } return palmar[palmar.length - 1][1]; };
  const report = {
    view: 'front-rack', role, barShelfGapMm: +(len(sub(B, S)) - rDelt - rBar).toFixed(2), solveErrMm: +best.err.toFixed(2),
    palmGapMm: +((g.circle.c[1] - g.circle.r) - vAt(uB)).toFixed(2),   // < 0: pressed into the palm skin
    fingersTouch: g.index.angs.some(a => a.touched),
    barAlongPalm: +(uB / mcp).toFixed(3),   // 0 wrist .. 1 knuckles; > 1 on the fingers
    wristExtDeg: ext, palmUpOrBack: (n => n[0] < 0 || n[1] < 0)(sub(P.Hh([mcp / 2, -10]), P.Hh([mcp / 2, 10]))),   // the palm faces up or back to the shoulder, not down over the bar
    upperArmDeg: +(-Math.atan2(E[1] - S[1], E[0] - S[0]) * 180 / Math.PI).toFixed(1),
    forearmDeg: +(-Math.atan2(E[1] - W[1], E[0] - W[0]) * 180 / Math.PI).toFixed(1),   // forearm toward the elbow, above horizontal
    barDiameterMm: bar.diameterMm, HLmm: +HL.toFixed(1), wristMm: W, barMm: B, outline: h.pts,
  };
  return { layers, anchor: S, report };
}

/** Geometry checks for the front-rack pair (C5-style; the wrist range is replaced by the exemption, so no wrist angle). */
export function frontRackProblems(report) {
  const bad = [], r = report.right, w = report.wrong;
  if (r.barShelfGapMm > 5) bad.push(`right: bar ${r.barShelfGapMm} mm above the shoulder shelf (> 5)`);
  if (!r.fingersTouch) bad.push('right: the fingers do not touch the bar');
  if (!r.palmUpOrBack) bad.push('right: the palm faces down and forward, over the bar');
  for (const [n, h] of [['right', r], ['wrong', w]]) if (h.solveErrMm > 1) bad.push(`${n}: the hand misses its bar placement by ${h.solveErrMm} mm (> 1)`);
  if (w.barShelfGapMm < 15) bad.push(`wrong: bar ${w.barShelfGapMm} mm above the shelf (< 15)`);
  if (w.palmGapMm > 1 || w.barAlongPalm > 0.9) bad.push(`wrong: bar not in the palm (gap ${w.palmGapMm} mm, at ${w.barAlongPalm} of the palm; needs <= 1 mm and <= 0.9)`);
  if (r.upperArmDeg - w.upperArmDeg < 30) bad.push(`elbow height: right ${r.upperArmDeg} minus wrong ${w.upperArmDeg} < 30 deg`);
  return bad;
}
