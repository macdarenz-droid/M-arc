// LIB-12 front-rack view (drawing code only; registry entry hand-front-rack.mjs). Research:
// shared/front-rack-exemption.json c1, c4, c5 and cards/front_squat.json c3, c4.
//
// Camera: the side, lifter facing right, y grows DOWN, the shoulder joint S at the origin. Seen from the side, the hand
// under the bar shows its little-finger edge, so the thumb (which no source places for the rack beyond "wrapped as far
// as the rack allows") is behind the hand. The bar is end-on, 28 mm (golden B's bar value, passed explicitly,
// D-LIB12-2). Arm lengths are Winter 2009 (as the vendored body.mjs WINTER), finger lengths golden-B HAND_PROP.
//
// pose: { barLiftMm: the bar's gap above the shoulder shelf (Right 0: the shoulders hold the bar, c1/c5; Wrong: lifted
//         off them, held by the hands, c4), upperArmDeg: the upper arm's angle above the horizontal (Right: elbows
//         high, c5; Wrong: elbows down), barInPalm: the bar sits in the palm (a full grip carrying it, c4) instead of
//         on the fingers (fingertip rack allowed when the shoulders hold it, c4) }
import { HAND_PROP, add, capsule, chainCaps, cutLimb, dir, fingerSegs, handLength, len, mul, segDist, sub, wrapChain } from './view-common.mjs';

export const FRONT_RACK_BAR = { diameterMm: 28 };   // D-LIB12-2
export const FRONT_RACK_DEFAULT = { barLiftMm: 0, barForwardMm: 0, upperArmDeg: 10, barInPalm: false };
const UPPER_OF_H = 0.186, FOREARM_OF_H = 0.146;   // Winter 2009 (vendored body.mjs WINTER.upperArm, .forearm)

export function frontRackHalf(poseIn = {}, { H = 1750, role = 'right', bar = FRONT_RACK_BAR } = {}) {
  const pose = { ...FRONT_RACK_DEFAULT, ...poseIn }, HL = handLength(H), s = HL / 189;
  const S = [0, 0], rDelt = 52 * s, rBar = bar.diameterMm / 2;
  // the shoulder shelf: the front of the deltoid; the bar rests on it up and forward of the joint (the throat channel)
  const shelfDir = dir(-58), shelfPt = add(S, mul(shelfDir, rDelt));
  const B = add(add(S, mul(shelfDir, rDelt + rBar + pose.barLiftMm)), [pose.barForwardMm, 0]);
  // upper arm and elbow
  const Lu = UPPER_OF_H * H, Lf = FOREARM_OF_H * H, E = add(S, mul(dir(-pose.upperArmDeg), Lu));
  // palm: the hand points back from the wrist toward the bar; the wrist sits on the forearm's circle round the elbow,
  // placed so the bar lies on the fingers (right) or across the palm (wrong)
  const mcp = HAND_PROP.little.mcp[0] * HL, palmR = t => (20 - 7 * Math.min(1, Math.max(0, t))) * s;   // palm half-thickness
  const along = pose.barInPalm ? 0.6 * mcp : mcp + 4 * s;          // where along the palm the bar is met
  const rr = rBar + palmR(along / mcp);
  // solve the wrist W on |W - E| = Lf whose palm line (W -> B, offset below by the bar radius + palm half-thickness) meets
  // the bar at `along`: search the angle round the elbow
  let best = null;
  for (let a = 150; a <= 260; a += 0.1) {
    const W = add(E, mul(dir(a), Lf)), d = len(sub(B, W));
    const err = Math.abs(Math.sqrt(Math.max(0, d * d - rr ** 2)) - along);
    if (W[1] > B[1] && (!best || err < best.err)) best = { W, err };
  }
  const W = best.W, toB = sub(B, W), dB = len(toB), u0 = mul(toB, 1 / dB);
  // the palm axis turns from W->B by the angle that puts the bar (radius + half palm) beside it, on the palm side
  const off = Math.asin(Math.min(1, rr / dB)) * 180 / Math.PI;
  const axisDeg = Math.atan2(u0[1], u0[0]) * 180 / Math.PI + off;   // palm below the bar (screen y down: + turns down)
  const K = add(W, mul(dir(axisDeg), mcp));                          // knuckle (little finger)
  const palm = capsule(W, K, palmR(0), palmR(1));
  // fingers: little finger (near) wraps round the bar from the knuckle, curling up over it; middle finger (far)
  const fing = name => { const segs = fingerSegs(name, HL); return { segs, ...wrapChain({ base: K, a0: axisDeg, segs, circle: { c: B, r: rBar }, sign: -1 }) }; };
  const little = fing('little'), middle = fing('middle');
  // the arm leaves the panel: the forearm from the wrist toward the elbow, the upper arm from the shoulder toward it
  const fore = cutLimb(W, E, 22 * s, 30 * s, 110 * s), upper = cutLimb(S, E, 44 * s, 38 * s, 190 * s);
  const delt = Array.from({ length: 24 }, (_, i) => add(S, mul(dir(i * 15), rDelt)));
  // body: neck front and throat above the shelf, the deltoid round the joint, the chest below; cut behind
  const body = [[-90 * s, -150 * s], [-14 * s, -150 * s], [-6 * s, -95 * s], add(S, mul(dir(-100), rDelt)), [-10 * s, 40 * s], [-4 * s, 110 * s], [-90 * s, 110 * s]];
  const parts = [
    { kind: 'far', ring: body, straight: true },
    ...chainCaps(middle.pts, middle.segs).map(ring => ({ kind: 'far', ring })),
    { kind: 'skin', ring: delt }, { kind: 'skin', ring: upper, straight: true }, { kind: 'skin', ring: fore, straight: true }, { kind: 'skin', ring: palm, straight: true },
    { kind: 'eq', circle: [B, rBar] }, { kind: 'eq-core', circle: [B, rBar * 0.62] },
    ...chainCaps(little.pts, little.segs).map(ring => ({ kind: 'near', ring, straight: true })),
    { kind: 'joint', at: W },
  ];
  if (pose.barLiftMm > 0 || pose.barForwardMm > 0) { const gapEnd = add(B, mul(sub(S, B), rBar / len(sub(S, B)))); parts.push({ kind: 'mark', line: [add(S, mul(sub(gapEnd, S), rDelt / len(sub(gapEnd, S)))), gapEnd] }); }
  else parts.push({ kind: 'contact', at: shelfPt });
  // report: bar gap to the shelf, whether the bar sits in the palm, finger contact, upper-arm elevation
  const ab = sub(K, W), tRaw = ((B[0] - W[0]) * ab[0] + (B[1] - W[1]) * ab[1]) / (ab[0] ** 2 + ab[1] ** 2), tB = Math.max(0, Math.min(1, tRaw));
  const palmGapMm = segDist(B, W, K) - rBar - palmR(tB);
  const report = {
    view: 'front-rack', role, barShelfGapMm: +(len(sub(B, S)) - rDelt - rBar).toFixed(2), solveErrMm: +best.err.toFixed(2),
    palmGapMm: +palmGapMm.toFixed(2), fingersTouch: little.touched.some(Boolean),
    barAlongPalm: +tRaw.toFixed(3),   // 0 wrist .. 1 knuckles; > 1 on the fingers
    upperArmDeg: +(-Math.atan2(E[1] - S[1], E[0] - S[0]) * 180 / Math.PI).toFixed(1),
    forearmDeg: +(-Math.atan2(E[1] - W[1], E[0] - W[0]) * 180 / Math.PI).toFixed(1),   // drawn forearm, above horizontal
    barDiameterMm: bar.diameterMm, HLmm: +HL.toFixed(1),
  };
  return { parts, anchor: S, report };
}

/** Geometry checks for the front-rack pair (C5-style; the wrist range is replaced by the exemption, so no wrist angle). */
export function frontRackProblems(report) {
  const bad = [], r = report.right, w = report.wrong;
  if (r.barShelfGapMm > 5) bad.push(`right: bar ${r.barShelfGapMm} mm above the shoulder shelf (> 5)`);
  if (!r.fingersTouch) bad.push('right: the fingers do not touch the bar');
  for (const [n, h] of [['right', r], ['wrong', w]]) if (h.solveErrMm > 1) bad.push(`${n}: the hand misses its bar placement by ${h.solveErrMm} mm (> 1)`);
  if (w.barShelfGapMm < 15) bad.push(`wrong: bar ${w.barShelfGapMm} mm above the shelf (< 15)`);
  if (w.palmGapMm > 1 || w.barAlongPalm > 0.9) bad.push(`wrong: bar not in the palm (gap ${w.palmGapMm} mm, at ${w.barAlongPalm} of the palm; needs <= 1 mm and <= 0.9)`);
  if (r.upperArmDeg - w.upperArmDeg < 30) bad.push(`elbow height: right ${r.upperArmDeg} minus wrong ${w.upperArmDeg} < 30 deg`);
  return bad;
}
