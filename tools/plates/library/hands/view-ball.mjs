// LIB-12 ball-contact view (drawing code only; registry entry hand-ball-contact.mjs). Research:
// shared/implement-wall-ball.json c1-c4.
//
// Camera: the front, facing the lifter; the ball's centre is the origin, y grows DOWN. Both hands are drawn as palms
// on the ball's surface (a band along it), each with the forearm leaving the panel. The ball's diameter is a named
// drawing value (D-LIB12-2); the wrist spacing is c3's "about six inches" (152 mm). No thumb or finger detail is drawn:
// no source places them (a gap).
//
// pose: { contactDeg: the angle below the horizontal of each palm's centre on the ball (Right: hands underneath, c1;
//         Wrong: on the sides, c1/c4), forearmDeg: the forearm's direction below the horizontal, outward (Right:
//         elbows in front and below, c2; Wrong: elbows out, c2) }
import { add, cutLimb, dir, len, mul, sub } from './view-common.mjs';

export const WALL_BALL = { diameterMm: 356 };   // D-LIB12-2
export const BALL_DEFAULT = { contactDeg: 47, forearmDeg: 95 };
const SPAN = 40, PALM_T = 34;   // deg of the ball each palm covers; palm thickness (mm, drawing values)

export function ballHalf(poseIn = {}, { role = 'right', ball = WALL_BALL } = {}) {
  const pose = { ...BALL_DEFAULT, ...poseIn }, R = ball.diameterMm / 2, C = [0, 0];
  const parts = [{ kind: 'eq', circle: [C, R], back: true }];
  const wrists = [], contacts = [];
  for (const sgn of [1, -1]) {   // the lifter's left hand on screen right (front view), then the other
    const at = a => (sgn > 0 ? a : 180 - a);   // mirror an angle about the vertical axis
    const a0 = pose.contactDeg - SPAN / 2, a1 = pose.contactDeg + SPAN / 2;   // fingertip end .. wrist end
    const inner = [], outer = [];
    for (let i = 0; i <= 8; i++) { const a = a0 + (a1 - a0) * i / 8; inner.push(add(C, mul(dir(at(a)), R))); outer.push(add(C, mul(dir(at(a)), R + PALM_T * (0.55 + 0.45 * Math.sin(Math.PI * i / 8 * 0.9 + 0.3))))); }
    const W = add(C, mul(dir(at(a1)), R + PALM_T * 0.55));
    const palm = [...inner, ...outer.reverse()];
    const fdir = dir(at(pose.forearmDeg)), fore = cutLimb(W, add(W, mul(fdir, 100)), 26, 32, 150);
    parts.push({ kind: 'skin', ring: fore, straight: true }, { kind: 'skin', ring: palm }, { kind: 'joint', at: W });
    wrists.push(W); contacts.push(add(C, mul(dir(at(pose.contactDeg)), R)));
  }
  for (const c of contacts) parts.push({ kind: role === 'wrong' ? 'contact-m' : 'contact', at: c });
  if (role === 'wrong') parts.push({ kind: 'datum-m', line: [[-R * 1.1, 0], [R * 1.1, 0]] });
  const report = {
    view: 'ball', role, ballDiameterMm: ball.diameterMm,
    contactBelowHorizontalDeg: contacts.map(c => +(Math.atan2(c[1], Math.abs(c[0])) * 180 / Math.PI).toFixed(1)),
    wristSpacingMm: +Math.abs(wrists[0][0] - wrists[1][0]).toFixed(1),
    forearmDeg: pose.forearmDeg, onSurface: contacts.every(c => Math.abs(len(sub(c, C)) - R) < 1e-6),
  };
  return { parts, anchor: C, report };
}

/** Geometry checks for the wall-ball pair: Right under the ball with c3's wrist spacing, Wrong on the sides. */
export function ballProblems(report) {
  const bad = [], r = report.right, w = report.wrong;
  for (const a of r.contactBelowHorizontalDeg) if (a < 30) bad.push(`right: palm ${a} deg below the horizontal (< 30: not under the ball)`);
  if (Math.abs(r.wristSpacingMm - 152) > 10) bad.push(`right: wrists ${r.wristSpacingMm} mm apart (c3: 152 +- 10)`);
  for (const a of w.contactBelowHorizontalDeg) if (Math.abs(a) > 15) bad.push(`wrong: palm ${a} deg from the horizontal (> 15: not on the side)`);
  for (const [n, h] of [['right', r], ['wrong', w]]) if (!h.onSurface) bad.push(`${n}: a palm is off the ball`);
  return bad;
}
