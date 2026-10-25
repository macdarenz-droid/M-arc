// LIB-12 cupped view (drawing code only; registry entry hand-cupped.mjs). Research: cards/goblet_squat.json g1, g2, g5,
// g6 only (D-LIB12-4; shared/cupped-thumb.json applies to the overhead extension, not to goblet).
//
// Camera: the side, lifter facing right; the chest's front is x = 0, y grows DOWN. The dumbbell stands upright in front
// of the chest (g1, g2), its top head seen edge-on. The near hand is golden B's hand rebuilt by lib12-hand.mjs
// (D-LIB12FIX-R8): palm up and flat against the top head's underside (g1 "both hands cupping the top of the weight"),
// the wrist bent back under the load, the fingers curling up the head's front edge, the thumb down along the handle;
// the forearm runs down toward the elbow and leaves the panel with the engine's wavy cut. The handle behind the forearm
// is drawn as a hidden line (h-datum, golden B's dashed reference line: h-eq-thin fails H5 contrast in Emerald), so the
// dumbbell reads as one object. Finger
// and thumb placement and sizes are drawing values (D-LIB12-2, D-LIB12-9): no goblet source places them.
//
// pose: { chestGapMm: the gap between the chest and the dumbbell's head (Right 0: against the chest, g1/g5; Wrong: the
//         weight drifted away from the body, g6), elbowForwardMm: elbow ahead of the chest line (g2 "elbows close to
//         the ribs") }
import { baseGeometry, projector, segsOf, sideHand } from './lib12-hand.mjs';
import { HAND_PROP, add, dir, handLength, mul, sub } from './view-common.mjs';

export const GOBLET_DUMBBELL = { headDiameterMm: 180, headThickMm: 70, handleDiameterMm: 32, handleLengthMm: 130 };   // D-LIB12-2
export const CUPPED_DEFAULT = { chestGapMm: 0, elbowForwardMm: null };   // null: the elbow straight under the hands
const FOREARM_OF_H = 0.146;   // Winter 2009, as vendored body.mjs WINTER.forearm

export function cuppedHalf(poseIn = {}, { H = 1750, role = 'right', dumbbell = GOBLET_DUMBBELL } = {}) {
  const pose = { ...CUPPED_DEFAULT, ...poseIn }, HL = handLength(H), s = HL / 189;
  const { headDiameterMm: D, headThickMm: T, handleDiameterMm: hd, handleLengthMm: hl } = dumbbell;
  const cx = pose.chestGapMm + D / 2;           // dumbbell axis
  const topY = -140 * s;                        // top of the top head
  const head1 = [[cx - D / 2, topY], [cx + D / 2, topY], [cx + D / 2, topY + T], [cx - D / 2, topY + T]];
  const handle = [[cx - hd / 2, topY + T], [cx + hd / 2, topY + T], [cx + hd / 2, topY + T + hl], [cx - hd / 2, topY + T + hl]];
  const y2 = topY + T + hl, head2 = [[cx - D / 2, y2], [cx + D / 2, y2], [cx + D / 2, y2 + T], [cx - D / 2, y2 + T]];
  // the hand: palm up against the underside (the engine's palm-side pads flattened on it), knuckles at the front edge
  const handTop = topY + T, base0 = baseGeometry(H, 90), { g } = base0, mcp = g.mcpI[0];
  const vMin = Math.min(...g.palmar.map(p => p[1])), base = { ...base0, palmar: g.palmar.map(([u]) => [u, vMin]) };
  const K = [cx + D / 2 - 40 * s, handTop];                        // the knuckle line, inside the front edge
  const W = [K[0] - mcp, handTop - vMin];                           // wrist centre, below the palm
  // the forearm toward the elbow: straight down (default) or to the given elbow
  const Lf = FOREARM_OF_H * H, ex = pose.elbowForwardMm ?? W[0], E = [ex, W[1] + Math.sqrt(Math.max(1, Lf ** 2 - (W[0] - ex) ** 2))];
  const fa = Math.atan2(W[0] - E[0], -(W[1] - E[1])) * 180 / Math.PI + 180;   // engine forearm angle (180: pointing up at the hand)
  const P = projector({ W, forearmDeg: fa, mirror: true, ext: 90 + (fa - 180) });
  // fingers (screen mm): along the underside from the knuckles, then bending up the front edge of the head
  const finger = name => {
    const segs = segsOf(name, HL, s), t = segs.map(q => q.t), pts = [[K[0], handTop + t[0] * 0.95]];
    [-8, -80, -95].forEach((a, i) => pts.push(add(pts[i], mul(dir(a), segs[i].L))));
    // keep the bent segments clear of the head: shift the chain so its middle and distal segments lie outside the edge
    const dx = Math.max(0, cx + D / 2 + t[1] * 1.02 - Math.min(pts[2][0], pts[3][0]));
    return { name, pts: pts.map((p, i) => (i >= 2 ? [p[0] + dx, p[1]] : i === 1 ? [p[0] + dx * 0.6, p[1]] : p)), segs, screen: true, palmSide: 1 };
  };
  const index = finger('index'), middle = finger('middle');
  // the thumb: from the thenar pad down along the handle's front face
  const ts = g.tsegs, mc = P.Hh(g.thumb.pts[1]), tx = cx + hd / 2 + ts[1].t;
  const ip = [tx, mc[1] + ts[1].L * 0.95], tip = [tx - 2 * s, ip[1] + ts[2].L];
  const thumb = { pts: [P.Hh(g.thumb.pts[0]), mc, ip, tip], segs: ts, screen: true, palmSide: -1 };
  const h = sideHand({ ...base, e: 90, near: [index], far: [middle], thumb, thumbLayer: 'thumb', foreLen: 70 * s }, P);
  // the chest: the lifter's front from the collarbone to the belly, a cut-off band behind x = 0
  const bot = topY + T + 70 * s, top = topY - 30 * s;   // only the band beside the top head
  const chest = [[-14 * s, top], [-3 * s, top + 40 * s], [0, topY], [0, topY + T], [-4 * s, topY + T + 60 * s], [-16 * s, bot - 40 * s], [-24 * s, bot],
    [-80 * s, bot], [-74 * s, (top + bot) / 2 + 20 * s], [-86 * s, (top + bot) / 2 - 20 * s], [-80 * s, top]];
  const layers = [
    { union: 'h-far', rings: [{ ring: chest }] },
    { poly: 'h-eq', ring: head2 }, { poly: 'h-eq', ring: handle }, { poly: 'h-eq', ring: head1 },
    ...h.layers,
    { poly: 'h-datum', ring: handle },   // the handle behind the hand and forearm, as a hidden (dashed) line
    { joint: true, at: W },
  ];
  if (role === 'wrong') layers.push({ path: 'h-mark', line: [[0, topY + T / 2], [pose.chestGapMm, topY + T / 2]] });
  else layers.push({ contact: true, at: [0, topY + T / 2] });
  const palmTop = Math.min(P.Hh([mcp * 0.3, vMin])[1], P.Hh([mcp * 0.9, vMin])[1]);
  const report = {
    view: 'cupped', role,
    chestGapMm: +(Math.min(...[...head1, ...head2].map(p => p[0])) - 0).toFixed(2),
    palmsToHeadMm: +Math.abs(palmTop - handTop).toFixed(2),
    elbowForwardMm: +E[0].toFixed(1), HLmm: +HL.toFixed(1),
    thumbAlongHandle: Math.abs(ip[0] - (cx + hd / 2)) < ts[1].t * 1.5 && tip[1] > ip[1],
    fingersClearOfHead: [index, middle].every(c => c.pts.slice(2).every(p => p[0] >= cx + D / 2)), outline: h.pts,
  };
  return { layers, anchor: [0, topY], report };
}

/** Geometry checks for the goblet pair: Right against the chest, Wrong >= 40 mm off, palms on the head's underside. */
export function cuppedProblems(report) {
  const bad = [], r = report.right, w = report.wrong;
  if (r.chestGapMm > 5) bad.push(`right: weight ${r.chestGapMm} mm off the chest (> 5)`);
  if (w.chestGapMm < 40) bad.push(`wrong: weight ${w.chestGapMm} mm off the chest (< 40)`);
  for (const [n, h] of [['right', r], ['wrong', w]]) {
    if (h.palmsToHeadMm > 3) bad.push(`${n}: palms ${h.palmsToHeadMm} mm from the head's underside (> 3)`);
    if (!h.thumbAlongHandle) bad.push(`${n}: the thumb is not along the handle`);
    if (!h.fingersClearOfHead) bad.push(`${n}: the fingers cut into the head`);
  }
  return bad;
}
