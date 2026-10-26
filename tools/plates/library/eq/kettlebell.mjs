// Composer `kettlebell` (census gap `kettlebell`, claude/howto-options 4a9fd86; LIB-22 Do 4; single use:
// kettlebell_swing, its anchor, plan 2.1:129-130, :141; D-LIB22-COMPOSERS): a kettlebell held by its handle in both
// hands, seen from the side (kettlebell_swing's card and census view).
//  - the bell: a round body with a flat base, one closed `poly` (curve);
//  - the horns and handle: one closed `poly` from the body's shoulders up to the handle the hands hold. With both
//    hands side by side on the handle (c2) the handle runs across the body (world x), so in side view it is seen
//    end-on inside the fists and only the horns show, as one arch.
// Every part moves with the hands (the swing), so every part is a `poly`: the Mistake view outlines it (PQ-H9).
// The bell hangs on from the handle along `dir` (the arm line, shoulder to grip: the bell continues the straight,
// loose arms, c7), so in every pose the body, horns and handle lie on one line with the arms.
// Reads no file. Returns KETTLEBELL_ITEMS items of one type; a spec takes it through eq/parts.mjs perItem.
// Assumed sizes (no card claim gives them; lb10/sizes.json holds each with its basis): a solid cast-iron bell sized
// to c25's 16 kg study bell: body 16.2 cm across with a flat base, handle centre 15.1 cm from the body centre, horns
// and handle 3.3 cm thick, the handle 10 cm wide, the neck 7 cm wide where the horns meet the body. bellMass() gives
// the drawn bell's mass from these sizes (cast iron, 7.2 kg per litre), so the balance uses the bell as drawn.
import { add, mul, sub, norm } from './parts.mjs';

export const KETTLEBELL = Object.freeze({ bodyD: 0.162, reach: 0.151, hornT: 0.033, neckW: 0.07, baseFlat: 0.6, handleW: 0.10, density: 7200 });
/** The drawn bell's mass (kg): the body (a sphere with its base cap cut off at baseFlat) plus the horns and handle
 *  (a tube hornT thick, two horns from the body's shoulder to the handle and the handle across), all cast iron. */
export function bellMass(C = KETTLEBELL) {
  const r = C.bodyD / 2, h = r * (1 - C.baseFlat), body = 4 / 3 * Math.PI * r ** 3 - Math.PI * h * h * (3 * r - h) / 3;
  const tube = Math.PI * (C.hornT / 2) ** 2 * (2 * (C.reach - 0.8 * r) + C.handleW);
  return C.density * (body + tube);
}
export const KETTLEBELL_ITEMS = 2;

const R = Math.PI / 180;
/** In-plane unit vectors (side view: the y-z plane) for direction u: u itself and its normal. */
const frame = u => { const d = norm([0, u[1], u[2]]); return { d, n: [0, -d[2], d[1]] }; };

/** The bell body's centre for a grip point and a hanging direction (unit, grip -> bell). */
export const bellCentre = (grip, dir, C = KETTLEBELL) => add(grip, mul(frame(dir).d, C.reach));

/**
 * p.grip: the handle centre in the hands (world; the grips' midpoint). p.dir: the hanging direction (grip -> bell),
 * normally the arm line from the shoulder to the grip. Returns [horns, body], both `poly`, z `mid` by default.
 */
export function kettlebell({ grip, dir, z = 'mid', part = 'bell' }, C = KETTLEBELL) {
  const { d, n } = frame(dir), c = bellCentre(grip, dir, C), r = C.bodyD / 2, x = grip[0];
  const at = (p, a, rr) => [x, p[1] + rr * (Math.cos(a * R) * d[1] + Math.sin(a * R) * n[1]), p[2] + rr * (Math.cos(a * R) * d[2] + Math.sin(a * R) * n[2])];
  // body: a circle with its far end (along d) cut flat at baseFlat of the radius (the bell's flat base)
  const body = [];
  for (let a = -180; a < 180; a += 15) {
    const p = at(c, a, r), along = (p[1] - c[1]) * d[1] + (p[2] - c[2]) * d[2];
    body.push(along > C.baseFlat * r ? add(p, mul([0, d[1], d[2]], C.baseFlat * r - along)) : p);
  }
  // horns: seen from the side the two horns overlap into one neck, from the body's top (flared, neckW wide) to the
  // handle at the grip (hornT thick, rounded), where the fists close over it
  const base = add(c, mul(d, -r * 0.8)), w0 = C.neckW / 2, t = C.hornT / 2;
  const horns = [add(base, mul(n, -w0)), add(add(grip, mul(n, -t)), mul(d, 0)), add(grip, mul(d, -t)), add(add(grip, mul(n, t)), mul(d, 0)), add(base, mul(n, w0)), add(c, mul(d, -r * 0.4))];
  return [{ type: 'poly', pts: horns, curve: true, cls: 'eq-solid', z, part }, { type: 'poly', pts: body, curve: true, cls: 'eq-solid', z, part }];
}
void sub;
