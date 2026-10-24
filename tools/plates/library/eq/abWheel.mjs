// Composer `abWheel` (census gap `abWheel`, "pulley() circle + line handle", "compose from existing parts",
// claude/howto-options 4a9fd86; LIB-21 Do 4; single use: ab_wheel_rollout, plan 2.1:141; D-LIB21-COMPOSERS): an ab
// wheel seen from the side (the card's and census view), "a small wheel with a handle each side" (card plate.equipment,
// c1), and the soft pad under the knees.
//  - the wheel: one closed `poly` circle (curve: true) standing on the floor, never the vendor `pulley` (a solid circle
//    with no `poly`, equipment.mjs:300), so the wheel is drawn in the Mistake view whenever it moves (PQ-H9);
//  - the hub: a smaller closed `poly` circle on the axle;
//  - the two handles, a pair (D-LIB18-PADS: a real pair is drawn as a pair): each a straight tube on the axle line
//    (world x) from the hub face out past the hand, so in side view each is seen end-on as a circle on the axle. The
//    far handle sits behind the far fist; the near one is drawn as an outline over the near fist, as the 8's hanging leg
//    raise draws its bar end-on over the fist (hanging_leg_raise.mjs:118-119), so the hand reads as wrapped around it;
//  - the knee pad (`kneelPad`): a flat soft pad on the floor (a side bar, eq/parts.mjs sideBar), static in every pose.
// The handles join the wheel through the hub on the one axle (D-LIB21-FRAME): each handle's inner end is the hub face.
// Reads no file. `abWheel` returns AB_WHEEL_ITEMS items of one type; a spec takes it through eq/parts.mjs perItem.
// Assumed sizes (no card claim gives them; lb9/sizes.json holds each with its basis): wheel 18 cm across, 5 cm wide;
// hub 5 cm across; handles 3 cm thick, 12 cm long past the grip centre's inner edge (see AB_WHEEL).
import { sideBar } from './parts.mjs';

export const AB_WHEEL = Object.freeze({ r: 0.09, width: 0.05, hubR: 0.025, handleD: 0.03, handlePast: 0.06 });
export const AB_WHEEL_ITEMS = 4;

const R = Math.PI / 180;
/** A circle of radius r about world point c in the side view's plane (y-z), at world x = c[0]. */
const ring = (c, r, n = 24) => Array.from({ length: n }, (_, k) => { const a = k * (360 / n) * R; return [c[0], c[1] + r * Math.sin(a), c[2] + r * Math.cos(a)]; });

/**
 * The wheel's solids (world metres), for drawing and for 3D checks. axle: the axle centre on the body mid-plane
 * (x 0); gripX: the grip centres' lateral distance from the mid-plane (each hand on its handle).
 * wheel: a disc of radius r and half-width width/2 about the axle; handles l (x > 0) and r (x < 0): tubes of
 * diameter handleD along x from the hub face (width/2) to gripX + handlePast.
 */
export function abWheelGeometry({ axle, gripX }, C = AB_WHEEL) {
  const tube = s => ({ from: [s * C.width / 2, axle[1], axle[2]], to: [s * (gripX + C.handlePast), axle[1], axle[2]], d: C.handleD });
  return { wheel: { c: axle, r: C.r, halfW: C.width / 2 }, hubR: C.hubR, handles: { l: tube(1), r: tube(-1) } };
}

/** The ab wheel in side view: [wheel, hub, far handle (l), near handle (r)]. axle: the axle centre; the wheel stands on
 *  the floor when axle[1] = r. */
export function abWheel({ axle, gripX, part = 'wheel' }, C = AB_WHEEL) {
  const g = abWheelGeometry({ axle, gripX }, C), hd = C.handleD / 2;
  return [
    { type: 'poly', pts: ring(axle, C.r), curve: true, cls: 'eq-solid', z: 'center', part },
    { type: 'poly', pts: ring(axle, C.hubR, 16), curve: true, cls: 'eq', z: 'center', part },
    { type: 'poly', pts: ring(g.handles.l.to, hd, 12), curve: true, cls: 'eq-solid', z: 'back', part },
    { type: 'poly', pts: ring(g.handles.r.to, hd, 12), curve: true, cls: 'eq-line', z: 'front', part },
  ];
}

/** The soft knee pad (c1): a flat bar on the floor from world z0 to z1, t thick (its top at y t), static. */
export const kneelPad = ({ z0, z1, t, part = 'pad' }) => sideBar([0, t / 2, z0], [0, t / 2, z1], t, { z: 'back', part });
