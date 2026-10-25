// LIB-12 ball-contact view (drawing code only; registry entry hand-ball-contact.mjs). Research:
// shared/implement-wall-ball.json c1-c4.
//
// Camera: the front, facing the lifter; the ball's centre is the origin, y grows DOWN. Each hand is a front (palm)
// view built from golden B's parts (D-LIB12FIX-R8, lib12-hand.mjs): HAND_PROP knuckle positions and segment lengths,
// the engine's finger and thumb radii, tapered capsule segments with knuckle pads and flexion creases, a palm with its
// thenar pad, and a tapering forearm leaving the panel with the engine's wavy cut. Right: the palms under the ball,
// fingertips spread up its underside, thumbs at the outer sides (c1); Wrong: the palms flat on the ball's sides, seen
// edge-on (c1, c4). The ball's diameter is a named drawing value (D-LIB12-2); the wrist spacing is c3's "about six
// inches" (152 mm). Finger spread and palm width are drawing values (D-LIB12-9): no source places the fingers.
//
// pose: { contactDeg: the angle below the horizontal of each palm's centre on the ball (Right: hands underneath, c1;
//         Wrong: on the sides, c1/c4), forearmDeg: the forearm's direction below the horizontal, outward (Right:
//         elbows in front and below, c2; Wrong: elbows out, c2) }
import { ENGINE_COPIED, segsOf } from './lib12-hand.mjs';
import { HAND_PROP, add, capsule, cutLimb, dir, handLength, len, mul, sub } from './view-common.mjs';

export const WALL_BALL = { diameterMm: 356 };   // D-LIB12-2
export const BALL_DEFAULT = { contactDeg: 47, forearmDeg: 95 };
// front-view hand (mm at HL 189, drawing values): knuckle offsets across the palm (thumb side +), finger fan (deg), the
// palm outline, the palm point that lies on the ball, the thumb's base and direction
const KNUCKLE_W = { index: 31, middle: 10, ring: -10, little: -28 }, FAN = { index: 9, middle: 1, ring: -7, little: -16 };
const PALM = [[0, 24], [30, 33], [62, 40], [80, 38], [84, 18], [86, -2], [80, -22], [72, -38], [40, -36], [12, -30], [0, -22]];
const ON_BALL_U = 0.3, THUMB_BASE = [18, 26], THUMB_DEG = 52;

/** One front-view hand: rings in the hand frame (u toward the fingers, w toward the thumb), then mapped. */
function frontHand(HL, s, map, { edge = 1 } = {}) {
  const thumbT = ENGINE_COPIED.thumbT.value.map(t => t * s), sc = ([u, w]) => [u * s, w * s * edge];
  const fingers = ['index', 'middle', 'ring', 'little'].map(name => {
    const segs = segsOf(name, HL, s), base = sc([HAND_PROP[name].mcp[0] * HL / s, KNUCKLE_W[name]]), a = FAN[name];
    const pts = [base]; segs.forEach((q, i) => pts.push(add(pts[i], mul(dir(a * edge), q.L * [1, 0.92, 0.85][i]))));   // cupped round the ball: foreshortened
    return { pts, segs };
  });
  const thumbSegs = HAND_PROP.thumb.seg.map((l, i) => ({ L: l * HL * [0.6, 0.9, 0.9][i], t: thumbT[i] }));
  const tp = [sc(THUMB_BASE)]; let ta = THUMB_DEG * edge;
  thumbSegs.forEach((q, i) => { tp.push(add(tp[i], mul(dir(ta), q.L))); ta -= 14 * edge; });
  const palm = PALM.map(sc), [k0, k1, k2] = ENGINE_COPIED.indexTaper.value, pad = ENGINE_COPIED.knucklePad.value;
  const nearRings = [], creases = [];
  for (const f of fingers) {
    const t = f.segs.map(q => q.t * Math.max(edge, 0.55));
    nearRings.push(capsule(f.pts[0], f.pts[1], t[0], t[1] * k0), capsule(f.pts[1], f.pts[2], t[1], t[2] * k1), capsule(f.pts[2], f.pts[3], t[2], t[2] * k2));
    [t[0] * pad[1], t[1] * pad[2]].forEach((r, i) => nearRings.push(capsule(f.pts[i + 1], f.pts[i + 1], r, r, 8)));
    for (const i of [1, 2]) { const d = sub(f.pts[i + 1], f.pts[i - 1]), L = len(d), n = [-d[1] / L, d[0] / L]; creases.push([add(f.pts[i], mul(n, t[i] * 0.7)), add(f.pts[i], mul(n, -t[i] * 0.7))]); }
  }
  const thenar = capsule(tp[0], tp[1], thumbSegs[0].t * 1.25, thumbSegs[1].t * 1.1);
  const thumb = [capsule(tp[1], tp[2], thumbSegs[1].t, thumbSegs[2].t * 1.03), capsule(tp[2], tp[3], thumbSegs[2].t, thumbSegs[2].t * 0.8)];
  const td = sub(tp[3], tp[1]), tL = len(td), tn = [-td[1] / tL, td[0] / tL];
  creases.push([add(tp[2], mul(tn, thumbSegs[2].t * 0.7)), add(tp[2], mul(tn, -thumbSegs[2].t * 0.7))]);
  const M = rs => rs.map(r => r.map(map));
  return { skin: M([palm, thenar]), near: M(nearRings), thumb: M(thumb), creases: creases.map(l => l.map(map)), digits: fingers.length + 1 };
}

export function ballHalf(poseIn = {}, { H = 1750, role = 'right', ball = WALL_BALL } = {}) {
  const pose = { ...BALL_DEFAULT, ...poseIn }, R = ball.diameterMm / 2, Cb = [0, 0], HL = handLength(H), s = HL / 189;
  const layers = [{ circle: 'h-eq', c: Cb, r: R }];
  const skin = [], near = [], thumbs = [], creases = [], wrists = [], contacts = [], outline = [], digits = [];
  for (const sgn of [1, -1]) {   // the lifter's left hand on screen right (front view), then the other
    const at = a => (sgn > 0 ? a : 180 - a);   // mirror an angle about the vertical axis
    const contact = add(Cb, mul(dir(at(pose.contactDeg)), R)), rad = dir(at(pose.contactDeg));
    // the fingers run up the surface from the contact (the tangent turning away from the bottom), the palm on the ball
    const tan = sgn > 0 ? [rad[1], -rad[0]] : [-rad[1], rad[0]];
    const up = tan[1] <= 0 ? tan : mul(tan, -1);
    const edge = Math.abs(pose.contactDeg) < 20 ? 0.45 : 1;   // a hand flat on the ball's side is seen edge-on
    const uOn = ON_BALL_U * HL, W = sub(contact, mul(up, uOn));
    const wDir = sgn > 0 ? [up[1], -up[0]] : [-up[1], up[0]];   // the thumb side: outward
    const wOut = dot2(wDir, [sgn, 0]) >= 0 ? wDir : mul(wDir, -1);
    const map = ([u, w]) => add(W, add(mul(up, u), mul(wOut, w)));
    const h = frontHand(HL, s, map, { edge });
    const fdir = dir(at(pose.forearmDeg)), fore = cutLimb(W, add(W, mul(fdir, 100)), 22 * s, 28 * s, 60 * s);
    const wrist = capsule(W, W, 22 * s, 22 * s, 10);
    skin.push({ ring: fore, straight: true }, { ring: wrist }, ...h.skin.map(ring => ({ ring, smooth: true })));
    near.push(...h.near.map(ring => ({ ring })));
    thumbs.push(...h.thumb.map(ring => ({ ring })));
    creases.push(...h.creases);
    outline.push(...fore, ...h.skin.flat(), ...h.near.flat(), ...h.thumb.flat());
    wrists.push(W); contacts.push(contact); digits.push(h.digits);
  }
  layers.push({ union: 'h-skin', rings: skin }, { union: 'h-skin', rings: near }, { lines: 'h-crease', segs: creases }, { union: 'h-thumb', rings: thumbs });
  for (const W of wrists) layers.push({ joint: true, at: W });
  for (const c of contacts) layers.push({ contact: role === 'wrong' ? 'm' : true, at: c });
  if (role === 'wrong') layers.push({ path: 'h-datum m', line: [[-R * 1.1, 0], [R * 1.1, 0]] });
  const report = {
    view: 'ball', role, ballDiameterMm: ball.diameterMm,
    contactBelowHorizontalDeg: contacts.map(c => +(Math.atan2(c[1], Math.abs(c[0])) * 180 / Math.PI).toFixed(1)),
    wristSpacingMm: +Math.abs(wrists[0][0] - wrists[1][0]).toFixed(1),
    forearmDeg: pose.forearmDeg, onSurface: contacts.every(c => Math.abs(len(sub(c, Cb)) - R) < 1e-6),
    digitsPerHand: digits, outline,
  };
  return { layers, anchor: Cb, report };
}
const dot2 = (a, b) => a[0] * b[0] + a[1] * b[1];

/** Geometry checks for the wall-ball pair: Right under the ball with c3's wrist spacing, Wrong on the sides. */
export function ballProblems(report) {
  const bad = [], r = report.right, w = report.wrong;
  for (const a of r.contactBelowHorizontalDeg) if (a < 30) bad.push(`right: palm ${a} deg below the horizontal (< 30: not under the ball)`);
  if (Math.abs(r.wristSpacingMm - 152) > 10) bad.push(`right: wrists ${r.wristSpacingMm} mm apart (c3: 152 +- 10)`);
  for (const a of w.contactBelowHorizontalDeg) if (Math.abs(a) > 15) bad.push(`wrong: palm ${a} deg from the horizontal (> 15: not on the side)`);
  for (const [n, h] of [['right', r], ['wrong', w]]) if (!h.onSurface) bad.push(`${n}: a palm is off the ball`);
  return bad;
}
