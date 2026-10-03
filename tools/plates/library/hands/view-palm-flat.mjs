// LIB-12 palm-flat view (drawing code only; the registry entry is hand-palm-flat.mjs). Research: shared/palm-flat.json.
//
// Camera: the side, from the little-finger edge (c5 pushes through it; the thumb, which no source places, is behind
// the hand). Fingers point right, the floor is y = 0, y grows DOWN (screen). Hand length HL = golden-B HAND_OF_H x H;
// finger lengths from golden-B HAND_PROP; thicknesses are golden-B hand.mjs's drawing values (view-common).
//
// LIB-26's `flatPalm` (vendored body.mjs) is the plate's palm. Its construction rules are reused here: the palm starts
// on the forearm's end and its palm side runs straight on the surface from the wrist to past the knuckles, and the
// test reuses LIB-26's join check. flatPalm itself is not called: its fingers taper up off the palm line (fingertip
// about 15 mm above the floor at 1.75 m, measured in the test), which c2 ("all parts of the hand ... on the floor")
// rules out at close-up scale (D-LIB12-6).
//
// pose: { forearmTilt: deg (0 = forearm vertical over the wrist; + = the hand ahead of the shoulder, forearm leaning
//         back), cup: deg (0 = flat; > 0 = the palm lifted about the heel, fingertips still down) }
import { HAND_PROP, add, capsule, fingerSegs, handLength, mul, rot, sub, thickScale } from './view-common.mjs';

export const PALM_FLAT_DEFAULT = { forearmTilt: 0, cup: 0 };
const FLOOR_TOL = 0.5;   // mm: a point within this of y = 0 lies on the floor

/** One half in mm: { parts, anchor, report }. */
export function palmFlatHalf(poseIn = {}, { H = 1750, role = 'right' } = {}) {
  const pose = { ...PALM_FLAT_DEFAULT, ...poseIn }, HL = handLength(H), s = thickScale(HL);
  // hand frame: u along the floor toward the fingers, h up from the palm's underside; screen = [u, -h]
  const pivot = [-4 * s, 0];                              // back edge of the heel: the cupped hand rotates about it
  const toS = ([u, h]) => rot([u, -h], -pose.cup, pivot);   // y-down screen; -cup lifts the fingers' end
  const mcpL = HAND_PROP.little.mcp[0] * HL, mcpM = HAND_PROP.middle.mcp[0] * HL;
  // palm (dorsal heights = hand.mjs's dorsal outline + its palmar depth 21: the back of the hand above a flat palm)
  const palm = [[-4, 0], [10, 0], [30, 0], [50, 0], [70, 0], [mcpM / s + 2, 0.5], [mcpM / s + 4, 12], [mcpM / s - 4, 26],
    [66, 35], [50, 37], [30, 39], [12, 40.5], [-4, 40.5]].map(([u, h]) => toS([u * s, h * s]));
  // fingers: lying on the floor in the flat hand (centre height = radius); cupped, the proximal segment runs down from
  // the lifted knuckle to the floor and the middle and distal segments lie flat
  const finger = name => {
    const segs = fingerSegs(name, HL), t = segs.map(q => q.t), base = toS([HAND_PROP[name].mcp[0] * HL, t[0]]);
    const pts = [base];
    if (pose.cup === 0) {
      let u = HAND_PROP[name].mcp[0] * HL;
      segs.forEach((q, i) => { u += q.L; pts.push(toS([u, i < 2 ? t[i + 1] : t[2] * 0.85])); });
    } else {
      const y1 = -t[1], dy = y1 - base[1], dx = Math.sqrt(Math.max(0, segs[0].L ** 2 - dy ** 2));
      pts.push([base[0] + dx, y1]);
      pts.push([pts[1][0] + segs[1].L, -t[2]]);
      pts.push([pts[2][0] + segs[2].L, -t[2] * 0.85]);
    }
    return { pts, caps: pts.slice(0, -1).map((p, i) => capsule(p, pts[i + 1], t[i], i === 2 ? t[2] * 0.85 : t[i + 1])) };
  };
  const little = finger('little'), middle = finger('middle');
  // wrist and forearm (the forearm keeps its tilt in screen space, whatever the palm does)
  const W = toS([0, 21 * s]), up = [-Math.sin(pose.forearmTilt * Math.PI / 180), -Math.cos(pose.forearmTilt * Math.PI / 180)];
  const side = [-up[1], up[0]], Lf = 120 * s, C = add(W, mul(up, Lf));
  const at = (P, w) => add(P, mul(side, w));
  const fore = [at(W, -19.5 * s), at(add(W, mul(up, Lf * 0.5)), -22 * s), at(C, -24 * s), add(at(C, -12 * s), mul(up, 3 * s)), at(C, 0),
    add(at(C, 12 * s), mul(up, -3 * s)), at(C, 24 * s), at(add(W, mul(up, Lf * 0.5)), 22 * s), at(W, 21 * s)];
  const parts = [
    { kind: 'floor', line: [[-40 * s, 0], [HL + 20 * s, 0]] },
    ...middle.caps.map(ring => ({ kind: 'far', ring })),
    { kind: 'skin', ring: fore }, { kind: 'skin', ring: palm },
    ...little.caps.map(ring => ({ kind: 'near', ring })),
    { kind: 'joint', at: W },
  ];
  // load and reference: the datum is the vertical through the wrist (the shoulder belongs over it, c1/c3/c6)
  const mid = toS([mcpL / 2, 0]);
  parts.push({ kind: role === 'wrong' ? 'datum-m' : 'datum', line: [W, [W[0], W[1] - Lf]] });
  if (pose.cup > 0) {
    const heel = toS([2 * s, 0]), gapTop = mid;
    parts.push({ kind: 'load-m', line: [add(W, mul(up, Lf * 0.75)), heel] }, { kind: 'contact-m', at: [heel[0], 0] },
      { kind: 'mark', line: [[gapTop[0], 0], gapTop] });
  } else {
    parts.push({ kind: role === 'wrong' ? 'load-m' : 'load', line: [add(W, mul(up, Lf * 0.75)), W] });
  }
  // report (mm): every skin outline point, the floor run, the mid-palm gap and the forearm tilt
  const skin = [palm, ...little.caps, ...middle.caps, fore].flat();
  const onFloor = skin.filter(p => Math.abs(p[1]) <= FLOOR_TOL).map(p => p[0]).sort((a, b) => a - b);
  const tipX = Math.max(...middle.pts.map(p => p[0]));
  const knuckleX = little.pts[0][0];
  const report = {
    view: 'palm-flat', role, forearmTiltDeg: +(Math.atan2(-up[0], -up[1]) * 180 / Math.PI).toFixed(1),
    lowestY: +Math.max(...skin.map(p => p[1])).toFixed(3),           // > 0 would be below the floor
    floorPoints: onFloor.length,
    floorSpan: onFloor.length ? +((onFloor[onFloor.length - 1] - Math.max(onFloor[0], W[0])) / (tipX - W[0])).toFixed(3) : 0,
    midPalmGapMm: +(-mid[1]).toFixed(1),
    floorBetweenHeelAndKnuckle: onFloor.filter(x => x > 10 * s && x < knuckleX).length,
    wristMm: W, HLmm: +HL.toFixed(1),
  };
  return { parts, anchor: [W[0], 0], report };
}

/** The geometry checks for one palm-flat pair (C5-style; plan 2.3). [] when every check holds. */
export function palmFlatProblems(report, fault) {
  const bad = [], r = report.right, w = report.wrong;
  if (r.lowestY > 1e-6) bad.push(`right: a point ${r.lowestY} mm below the floor`);
  if (r.floorPoints < 3) bad.push(`right: ${r.floorPoints} points on the floor (< 3)`);
  if (r.floorSpan < 0.9) bad.push(`right: floor run ${r.floorSpan} of wrist to tip (< 0.9)`);
  if (Math.abs(r.forearmTiltDeg) > 5) bad.push(`right: forearm ${r.forearmTiltDeg} deg from vertical (> 5)`);
  if (w.lowestY > 1e-6) bad.push(`wrong: a point ${w.lowestY} mm below the floor`);
  if (fault === 'cupped-palm') {
    if (w.midPalmGapMm < 6) bad.push(`wrong cupped-palm: mid-palm gap ${w.midPalmGapMm} mm (< 6)`);
    if (w.floorBetweenHeelAndKnuckle > 0) bad.push(`wrong cupped-palm: ${w.floorBetweenHeelAndKnuckle} palm points on the floor between heel and knuckles`);
    if (w.floorPoints < 2) bad.push('wrong cupped-palm: heel and fingertips not both on the floor');
  } else if (fault === 'hand-ahead') {
    if (w.forearmTiltDeg < 20) bad.push(`wrong hand-ahead: forearm tilt ${w.forearmTiltDeg} deg (< 20)`);
  } else bad.push(`unknown palm-flat fault ${fault}`);
  return bad;
}
