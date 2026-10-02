// LIB-12 cupped view (drawing code only; registry entry hand-cupped.mjs). Research: cards/goblet_squat.json g1, g2, g5,
// g6 only (D-LIB12-4; shared/cupped-thumb.json applies to the overhead extension, not to goblet).
//
// Camera: the side, lifter facing right; the chest's front is x = 0, y grows DOWN. The dumbbell stands upright in front
// of the chest (g1, g2), its top head seen edge-on. The palms are drawn as ONE outline under the top head (g1 "both
// hands cupping the top of the weight"): no thumb or finger detail, because no goblet source places them (a gap).
// The near forearm runs from the hands down to the elbow. Sizes are named drawing values (D-LIB12-2).
//
// pose: { chestGapMm: the gap between the chest and the dumbbell's head (Right 0: against the chest, g1/g5; Wrong: the
//         weight drifted away from the body, g6), elbowForwardMm: elbow ahead of the chest line (g2 "elbows close to
//         the ribs") }
import { add, capsule, handLength, mul, sub } from './view-common.mjs';

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
  // the palms: one rounded outline hanging under the top head round the handle (top edge on the head's underside)
  const handTop = topY + T, hw = 0.42 * HL, hh = 0.30 * HL;
  const hands = [[cx - hw / 2, handTop], [cx + hw / 2, handTop], [cx + hw / 2 + 4 * s, handTop + hh * 0.5], [cx + hw / 2 - 6 * s, handTop + hh],
    [cx, handTop + hh + 6 * s], [cx - hw / 2 + 6 * s, handTop + hh], [cx - hw / 2 - 4 * s, handTop + hh * 0.5]];
  const W = [cx, handTop + hh];                                   // wrist (the forearm leaves the hands here)
  const Lf = FOREARM_OF_H * H, ex = pose.elbowForwardMm ?? cx, dy = Math.sqrt(Math.max(1, Lf ** 2 - (W[0] - ex) ** 2));
  const E = [ex, W[1] + dy];                                      // elbow
  const fore = capsule(W, E, 22 * s, 28 * s);
  // the chest: the lifter's front from the collarbone to the belly, a cut-off band behind x = 0
  const bot = E[1] + 20 * s, top = topY - 50 * s;
  const chest = [[-14 * s, top], [-3 * s, top + 40 * s], [0, topY], [0, topY + T], [-4 * s, topY + T + 60 * s], [-16 * s, bot - 40 * s], [-24 * s, bot],
    [-80 * s, bot], [-74 * s, (top + bot) / 2 + 20 * s], [-86 * s, (top + bot) / 2 - 20 * s], [-80 * s, top]];
  const parts = [
    { kind: 'far', ring: chest, straight: true },   // straight: the contact run stays exactly on x = 0
    { kind: 'eq', ring: head2, back: true }, { kind: 'eq', ring: handle, back: true }, { kind: 'eq', ring: head1, back: true },
    { kind: 'skin', ring: fore, straight: true }, { kind: 'skin', ring: hands },
    { kind: 'joint', at: W },
  ];
  if (role === 'wrong') parts.push({ kind: 'mark', line: [[0, topY + T / 2], [pose.chestGapMm, topY + T / 2]] });
  else parts.push({ kind: 'contact', at: [0, topY + T / 2] });
  const report = {
    view: 'cupped', role,
    chestGapMm: +(Math.min(...[...head1, ...head2].map(p => p[0])) - 0).toFixed(2),
    palmsToHeadMm: +Math.abs(Math.min(...hands.map(p => p[1])) - (topY + T)).toFixed(2),
    elbowForwardMm: +E[0].toFixed(1), HLmm: +HL.toFixed(1),
  };
  return { parts, anchor: [0, topY], report };
}

/** Geometry checks for the goblet pair: Right against the chest, Wrong >= 40 mm off, palms on the head's underside. */
export function cuppedProblems(report) {
  const bad = [], r = report.right, w = report.wrong;
  if (r.chestGapMm > 5) bad.push(`right: weight ${r.chestGapMm} mm off the chest (> 5)`);
  if (w.chestGapMm < 40) bad.push(`wrong: weight ${w.chestGapMm} mm off the chest (< 40)`);
  for (const [n, h] of [['right', r], ['wrong', w]]) if (h.palmsToHeadMm > 3) bad.push(`${n}: palms ${h.palmsToHeadMm} mm from the head's underside (> 3)`);
  return bad;
}
