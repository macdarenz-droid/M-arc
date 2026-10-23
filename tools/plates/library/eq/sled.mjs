// Composer `sled` (census gap `sled`, "new primitive (recommended: 2 or more users)", claude/howto-options 4a9fd86;
// LIB-22 Do 4; two users, both in LB10, plan 2.1:140: sled_push, its anchor, and sled_pull; D-LIB22-COMPOSERS): a
// weight sled seen from the side, drawn as a composition of existing primitives (a new primitive is out of scope,
// vendor/** is reserved).
//  - the body: a low skid on two runners (the near runner covers the far one in side view), the runners on the floor;
//  - the loading horn: an upright peg on the body with bumper plates on it (the load, c17 "Load the sled");
//  - push form (sled_push c1, plate.equipment "two upright handles"): two upright posts at the body's rear edge, each
//    joined to the body by a bracket (D-LIB22-FRAME: no free-floating handle); the near post z `mid` (in front of the
//    trunk and near leg, behind the near arm, so the near fist closes over it), the far post z `back`;
//  - pull form (sled_pull, bulk): a hitch ring on a bracket at the body's front edge, where the rope starts.
// The sled is static: every part sits at one place in every pose (D-LIB22-IMPLEMENT), so none needs `poly` for the
// Mistake view; each part is a `sideBar` (backPad, class `eq`) or a `poly`.
// Reads no file. Returns up to SLED_ITEMS items; a spec takes it through eq/parts.mjs perItem.
// Assumed sizes (no card claim gives them; lb10/sizes.json holds each with its basis).
import { sideBar } from './parts.mjs';

export const SLED = Object.freeze({ len: 0.8, bodyT: 0.06, bodyY: 0.10, runnerT: 0.04, strutT: 0.03, strutIn: 0.06, postT: 0.035, hornH: 0.36, hornT: 0.05,
  plateD: 0.45, plateT: 0.06, plates: 2, bracket: 0.12, hitchW: 0.08, hitchH: 0.06, ringR: 0.025 });
export const SLED_ITEMS = 11;

/**
 * p.rearZ: world z of the body's rear edge (toward the lifter); the body runs forward (+z) for len.
 * p.postTop: the posts' top height (push form); p.form: 'push' | 'pull'. p.postX: the posts' lateral offset.
 */
export function sled({ rearZ, postTop = 1.4, form = 'push', postX = 0.25 }, C = SLED) {
  const out = [], z0 = rearZ, z1 = rearZ + C.len, yB = C.bodyY;
  // runners on the floor (their undersides at y 0), and the skid body on them
  out.push(sideBar([0, C.runnerT / 2, z0], [0, C.runnerT / 2, z1], C.runnerT, { z: 'back', part: 'sled' }));
  out.push(sideBar([0, yB, z0], [0, yB, z1], C.bodyT, { z: 'back', part: 'sled' }));
  // struts from the runner to the body at both ends
  for (const zz of [z0 + C.strutIn, z1 - C.strutIn]) out.push(sideBar([0, C.runnerT, zz], [0, yB - C.bodyT / 2, zz], C.strutT, { z: 'back', part: 'sled' }));
  // loading horn and plates, at the body's middle
  const hz = (z0 + z1) / 2, top = yB + C.bodyT / 2;
  out.push(sideBar([0, top, hz], [0, top + C.hornH, hz], C.hornT, { z: 'back', part: 'sled' }));
  const plate = (y) => ({ type: 'poly', pts: [[0, y, hz - C.plateD / 2], [0, y, hz + C.plateD / 2], [0, y + C.plateT, hz + C.plateD / 2], [0, y + C.plateT, hz - C.plateD / 2]], cls: 'eq-solid', z: 'back', part: 'sled' });
  for (let k = 0; k < C.plates; k++) out.push(plate(top + k * C.plateT));
  if (form === 'push') {
    // far post (back), then its bracket; near post (mid) with its bracket, at the rear edge
    for (const [x, zl] of [[postX, 'back'], [-postX, 'mid']]) {
      const pz = z0 + C.postT / 2;
      out.push(sideBar([x, top, pz], [x, postTop, pz], C.postT, { z: zl, part: 'sled' }));
      out.push({ type: 'poly', pts: [[x, top, pz], [x, top, pz + C.bracket], [x, top + C.bracket, pz]], cls: 'eq-solid', z: zl, part: 'sled' });
    }
  } else {
    // hitch: a bracket on the front edge and a ring on it
    const hy = top + C.hitchH;
    out.push({ type: 'poly', pts: [[0, top, z1 - C.hitchW], [0, top, z1], [0, hy, z1], [0, hy, z1 - C.hitchW / 4]], cls: 'eq-solid', z: 'back', part: 'sled' });
    out.push({ type: 'poly', pts: Array.from({ length: 12 }, (_, k) => [0, hy + C.ringR + C.ringR * Math.sin(k * Math.PI / 6), z1 + C.ringR * Math.cos(k * Math.PI / 6)]), curve: true, cls: 'eq', z: 'back', part: 'sled' });
  }
  return out;
}
/** The world point on a push post at height y (the grip's place), near (x < 0) or far. */
export const postPoint = ({ rearZ, postX = 0.25 }, y, side = 'r', C = SLED) => [side === 'r' ? -postX : postX, y, rearZ + C.postT / 2];
