// LIB-12 palm-flat view (drawing code only; the registry entry is hand-palm-flat.mjs). Research: shared/palm-flat.json.
//
// Camera: the side, from the little-finger edge (c5 pushes through it); fingers point right, the floor is y = 0, y grows
// DOWN (screen). The hand is golden B's hand rebuilt by lib12-hand.mjs (D-LIB12FIX-R8): the engine's palm, back-of-hand
// and forearm profiles from handGeometry, HAND_PROP segment lengths, the engine's radii, knuckle pads, creases and nail.
// The little finger is nearest (own outline over the palm), the middle finger and the thumb lie behind it (lighter
// line); the forearm tapers to the wrist and leaves the panel with the engine's wavy cut.
//
// LIB-26's flat-palm rule stays (D-LIB12-6): the palm side lies on the floor from the heel to the knuckle pads, and the
// fingers lie on the floor (centre height = segment radius, so each segment touches it). No outline point is below the
// floor.
//
// pose: { forearmTilt: deg (0 = forearm vertical over the wrist; + = the hand ahead of the shoulder, forearm leaning
//         back), cup: deg (0 = flat; > 0 = the palm lifted about the heel, knuckles up, the fingers coming down to the
//         floor with only their tip pads on it) }
import { baseGeometry, projector, segsOf, sideHand } from './lib12-hand.mjs';
import { HAND_PROP, add, dir, mul, rot, sub } from './view-common.mjs';

export const PALM_FLAT_DEFAULT = { forearmTilt: 0, cup: 0 };
const FLOOR_TOL = 0.5;   // mm: a point within this of y = 0 lies on the floor

/** A finger lying on the floor from its knuckle K (screen mm): straight (flat) or, cupped, coming down from a lifted
 *  knuckle with the proximal segment steep and the middle and distal segments flexed so only the tip pad meets the floor. */
function floorFinger(name, HL, s, K, cupped) {
  const segs = segsOf(name, HL, s), t = segs.map(q => q.t), tipT = t[2] * 0.85;
  if (!cupped) {
    const h = [t[0], t[1] * 1.02, t[2] * 1.02, tipT], pts = [[K[0], -h[0]]];   // centre heights: each joint's widest capsule end touches the floor
    segs.forEach((q, i) => pts.push([pts[i][0] + q.L, -h[i + 1]]));
    return { name, pts, segs, screen: true, palmSide: 1 };
  }
  // cupped: the proximal segment runs out level from the lifted knuckle (the finger joint held straight), then the
  // middle and distal segments bend down; solve the bend so the tip's pad (radius tipT) just meets the floor
  const chainAt = bend => { const pts = [K]; let a = -5; segs.forEach((q, i) => { if (i) a += bend * (i === 1 ? 1 : 0.8); pts.push(add(pts[i], mul(dir(a), q.L))); }); return pts; };
  let lo = 0, hi = 89;
  for (let n = 0; n < 40; n++) { const m = (lo + hi) / 2, tip = chainAt(m)[3]; if (tip[1] < -tipT) lo = m; else hi = m; }
  return { name, pts: chainAt(lo), segs, screen: true, palmSide: 1 };
}

/** One half in mm: { layers, anchor, report }. */
export function palmFlatHalf(poseIn = {}, { H = 1750, role = 'right' } = {}) {
  const pose = { ...PALM_FLAT_DEFAULT, ...poseIn }, base0 = baseGeometry(H, 90 - pose.forearmTilt), { s, HL, g } = base0;
  // the hand frame: wrist at W, fingers along +x, the palm side down. The palm's pads flatten on the floor (LIB-26's
  // rule): the engine's palm-side profile is laid at its deepest value from the heel to the knuckles.
  const vMin = Math.min(...g.palmar.map(p => p[1])), base = { ...base0, palmar: g.palmar.map(([u]) => [u, vMin]) };
  const W = [0, vMin];
  const P = projector({ W, forearmDeg: pose.forearmTilt, ext: 90 - pose.forearmTilt });
  const heel = [-4 * s, 0];                                        // back edge of the heel: the cupped palm turns about it
  const cupMap = p => { const q = P.Hh(p); return pose.cup ? rot(q, -pose.cup, heel) : q; };
  // knuckles on the palm's floor side (little and middle), lifted with the palm when cupped
  const knuckle = name => cupMap([HAND_PROP[name].mcp[0] * HL, HAND_PROP[name].mcp[1] * HL]);
  const little = floorFinger('little', HL, s, knuckle('little'), pose.cup > 0), middle = floorFinger('middle', HL, s, knuckle('middle'), pose.cup > 0);
  // the thumb lies on the floor beside the index, behind the hand: its two visible segments run from the thenar pad
  // forward and down to the floor (HAND_PROP thumb lengths, the engine's thumb radii)
  const ts = g.tsegs, cmc = cupMap(g.thumb.pts[0]), mc = cupMap(g.thumb.pts[1]), tTip = ts[2].t * 0.8;
  const ip0 = add(mc, mul(dir(Math.atan2(-tTip - mc[1], ts[1].L * 1.2) * 180 / Math.PI), ts[1].L));
  const ip = [ip0[0], Math.min(ip0[1], -ts[2].t * 1.03)];   // the joint's capsule (radius ts[2].t x 1.03) stays above the floor
  const tip = [ip[0] + Math.sqrt(Math.max(0, ts[2].L ** 2 - (-tTip - ip[1]) ** 2)), -tTip];
  const thumb = { pts: [cmc, mc, ip, tip], segs: ts, screen: true };
  const h = sideHand({ ...base, e: 90 - pose.forearmTilt, near: [little], far: [middle], thumb, thumbLayer: 'far', palmMap: cupMap, foreLen: 70 * s }, P);
  const tipX0 = Math.max(...h.pts.map(p => p[0]));
  const layers = [{ path: 'h-eq-core', line: [[-30 * s, 0], [tipX0 + 8 * s, 0]] }, ...h.layers, { joint: true, at: W }];
  // load and reference: the datum is the vertical through the wrist (the shoulder belongs over it, c1/c3/c6)
  const up = mul(P.U, -1), Lf = 70 * s, mcpL = HAND_PROP.little.mcp[0] * HL, mid = cupMap([mcpL / 2, vMin]);   // the palm's floor side, half way to the knuckles
  layers.push({ path: role === 'wrong' ? 'h-datum m' : 'h-datum', line: [W, [W[0], W[1] - Lf * 1.15]] });
  if (pose.cup > 0) {
    layers.push({ load: 'm', line: [add(W, mul(up, Lf * 0.75)), heel] }, { contact: 'm', at: heel }, { path: 'h-mark', line: [[mid[0], 0], mid] });
  } else layers.push({ load: role === 'wrong' ? 'm' : true, line: [add(W, mul(up, Lf * 0.75)), W] });
  // report (mm): every outline point, the floor run, the mid-palm gap, the finger run on the floor and the forearm tilt
  const skin = h.pts, onFloor = skin.filter(p => Math.abs(p[1]) <= FLOOR_TOL).map(p => p[0]).sort((a, b) => a - b);
  const tipX = Math.max(...middle.pts.map(p => p[0])), knuckleX = little.pts[0][0];
  const fingerLen = little.segs.reduce((a, q) => a + q.L, 0);
  const fingerOnFloor = h.near.filter(p => Math.abs(p[1]) <= FLOOR_TOL && p[0] >= knuckleX).map(p => p[0]);
  const report = {
    view: 'palm-flat', role, forearmTiltDeg: +(Math.atan2(-up[0], -up[1]) * 180 / Math.PI).toFixed(1),
    lowestY: +Math.max(0, ...skin.map(p => p[1])).toFixed(3),           // > 0 would be below the floor
    floorPoints: onFloor.length,
    floorSpan: onFloor.length ? +((onFloor[onFloor.length - 1] - Math.max(onFloor[0], W[0])) / (tipX - W[0])).toFixed(3) : 0,
    midPalmGapMm: +(-mid[1]).toFixed(1),
    floorBetweenHeelAndKnuckle: onFloor.filter(x => x > heel[0] + 12 * s && x < knuckleX - 12 * s).length,
    fingerFloorRun: fingerOnFloor.length ? +((Math.max(...fingerOnFloor) - Math.min(...fingerOnFloor)) / fingerLen).toFixed(3) : 0,   // of the little finger's length
    thumbOfHL: +((ts[1].L + ts[2].L) / HL).toFixed(3),                  // the visible thumb (proximal + distal) per hand length
    wristMm: W, HLmm: +HL.toFixed(1), outline: skin,
  };
  return { layers, anchor: [W[0], 0], report };
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
    if (w.fingerFloorRun > 0.15) bad.push(`wrong cupped-palm: the finger lies on the floor along ${w.fingerFloorRun} of its length (> 0.15: only the tip pad)`);
  } else if (fault === 'hand-ahead') {
    if (w.forearmTiltDeg < 20) bad.push(`wrong hand-ahead: forearm tilt ${w.forearmTiltDeg} deg (< 20)`);
  } else bad.push(`unknown palm-flat fault ${fault}`);
  return bad;
}
