// Composer `calfMachine` (census gap `calfMachine`, "kneePad lever or shoulder pads + box platform", claude/howto-options
// 4a9fd86; LIB-18 Do 4; D-LIB18-COMPOSERS, -FRAME): one calf raise machine seen from the side, in two forms on the same
// platform and frame, from this one file, so the shared rig is approved once:
//  - form 'seated' (seated_calf_raise; plate.equipment c1-c3, c5, c6): a seat pad on a post; a foot platform under the
//    balls of the feet with its rear edge just behind the balls, so the heels hang off it (c3); in front of the
//    platform a tower that carries the lever's pivot; the lever arm runs back from the pivot to a roller pad that rests
//    across the thighs just above the knees (c1, c2); a handle grip rises from the arm just in front of the pad (c5) and
//    the safety lever sticks up from the arm beside it (c6);
//  - form 'standing' (standing_calf_raise; plate.equipment c1-c3): the same platform and floor beam; a rear tower
//    behind the lifter carries the pivot; the lever arm runs forward from it to a shoulder pad whose lower face rests on
//    the top of the shoulders (c1, c2); the handle post hangs from the arm in front of the pad (handleAt < 0, handleH < 0:
//    the arm runs on to the post) with the grip at its end (c2, c3 "handles by the pads"). No seat and no safety lever
//    (the standing card names neither).
//  Static (z back): floor beam, the platform and its post, the seat and its post (seated), the tower and its pivot hub.
//  Moving (part 'lever', every one a `poly`, eq/parts.mjs sideBar or `poly`, so it is drawn in the Mistake view
//  whenever it moves, PQ-H9; plate.mjs:205-218): the lever arm, the pad, the handle grip and the safety lever.
// Every pad, seat, platform and lever is joined to the frame (D-LIB18-FRAME): the seat pad sits on its post and the
//  platform on its post, both posts and the tower stand on the floor beam, the lever arm starts inside the pivot hub on
//  the tower top and runs into the pad, and the handle and the safety lever start inside the arm.
// Built only from existing primitives (`backPad` through sideBar, `poly`, `pulley`). Reads no file. Returns several items
// of one type, so a spec takes it through eq/parts.mjs perItem(fn, CALF_MACHINE_ITEMS). Side view only.
// Assumed sizes (no card claim gives them; the spec lists them under "Unsourced numbers" and lb8/sizes.json holds each
// with its basis): roller 5.5 cm radius (the vendor kneePad r), seat 40 cm by 7 cm (the vendor seat), shoulder pad 20 cm by
// 6 cm (hackSled's), frame tubes 6 cm (hackSled's and pulloverMachine's tubeT), lever arm 5 cm (pulloverMachine's armT),
// platform 3.5 cm thick (the 8's leg press plate, equipment.mjs legPress45 t 0.035), pivot hub 4.5 cm radius (the vendor pulley), handle grip 3.2 cm across (the vendor chestPress grip)
// on a 2.5 cm post handleH over the arm at the pad (handleAt 0), safety lever 10 cm by 2 cm, safetyAt along the arm
// from the pad.
import { add, mul, norm, sideBar } from './parts.mjs';

export const CALF_MACHINE = Object.freeze({ rollerR: 0.055, seatLen: 0.40, seatT: 0.07, shoulderLen: 0.20, shoulderT: 0.06, tubeT: 0.06, armT: 0.05,
  platT: 0.035, hubR: 0.045, gripR: 0.016, postT: 0.025, handleH: 0.14, safetyLen: 0.10, safetyT: 0.02, handleAt: 0, safetyAt: 0.14 });
export const CALF_MACHINE_ITEMS = 12;

const circle = (c, r, n = 20) => Array.from({ length: n }, (_, k) => [c[0], c[1] + r * Math.sin(2 * Math.PI * k / n), c[2] + r * Math.cos(2 * Math.PI * k / n)]);
const rot = (v, a) => [v[0], v[1] * Math.cos(a) + v[2] * Math.sin(a), -v[1] * Math.sin(a) + v[2] * Math.cos(a)];   // about x: +a turns +z toward +y

/**
 * The lever in one pose (world points), shared by the composer and the spec (which puts the hands on `grip`).
 * p.pivot: the pivot (world). p.arm: the arm length from the pivot to the pad's centre (m). p.angle: the arm's angle
 * (deg) above level; p.toward: +1 when the arm runs from the pivot toward +z (standing: pivot behind), -1 toward -z
 * (seated: pivot in front). p.handleAt, p.handleH: the handle post's place along the arm back from the pad centre and
 * its height over the arm (defaults CALF_MACHINE's; the standing form may set them). Returns { u (unit, pivot to pad), n (unit, the arm's upper side), pad (pad centre), grip
 * (handle grip centre), gripBase, safetyBase, safetyTip }.
 */
export function calfLever({ pivot, arm, angle, toward = -1, handleAt = CALF_MACHINE.handleAt, handleH = CALF_MACHINE.handleH }) {
  const C = CALF_MACHINE, a = angle * Math.PI / 180;
  const u = norm([0, Math.sin(a), toward * Math.cos(a)]), n0 = [0, Math.cos(a), -toward * Math.sin(a)], n = n0[1] >= 0 ? n0 : mul(n0, -1);
  const pad = add(pivot, mul(u, arm));
  const gripBase = add(pivot, mul(u, arm - handleAt)), grip = add(gripBase, mul(n, C.armT / 2 + handleH));
  const safetyBase = add(pivot, mul(u, arm - C.safetyAt));
  const sd = norm(add(n, mul(u, -0.8)));                                 // safety lever leans away from the pad
  const safetyTip = add(safetyBase, mul(sd, C.armT / 2 + C.safetyLen));
  return { u, n, pad, grip, gripBase, safetyBase, safetyTip };
}

/**
 * p.form: 'seated' | 'standing'.
 * p.floorZ: [rear z, front z] of the floor beam (it lies on the floor, y 0 to tubeT).
 * p.platform: { top, z: [rear edge z, front edge z], postZ }: the platform's top face height, its edges and its post.
 * p.seat: { top, z: [rear z, front z], postZ } (seated only): the seat pad's top face, its ends and its post.
 * p.pivot, p.arm, p.angle, p.toward: the lever (calfLever). p.towerZ: the tower's z (under the pivot).
 * Returns CALF_MACHINE_ITEMS slots, in order: floor beam, platform post, platform, seat post, seat pad (seated; null in
 * the standing form), tower, pivot hub (static, z back); lever arm, pad (roller or shoulder pad), handle post, handle
 * grip, safety lever (null in the standing form) (part 'lever'; the pad and the grip z mid, the rest z back).
 */
export function calfMachine(p) {
  const C = CALF_MACHINE, t = C.tubeT, seated = p.form !== 'standing';
  const L = calfLever(p);
  const [pz0, pz1] = p.platform.z, ptop = p.platform.top;
  const out = [
    sideBar([0, t / 2, p.floorZ[0]], [0, t / 2, p.floorZ[1]], t, { z: 'back', part: 'frame' }),                                   // floor beam
    sideBar([0, t, p.platform.postZ], [0, ptop - C.platT + 0.005, p.platform.postZ], t, { z: 'back', part: 'frame' }),           // platform post
    sideBar([0, ptop - C.platT / 2, pz0], [0, ptop - C.platT / 2, pz1], C.platT, { z: 'back', part: 'platform' }),                // platform
  ];
  if (seated) {
    const [sz0, sz1] = p.seat.z, stop = p.seat.top;
    out.push(sideBar([0, t, p.seat.postZ], [0, stop - C.seatT + 0.005, p.seat.postZ], t, { z: 'back', part: 'frame' }),          // seat post
      sideBar([0, stop - C.seatT / 2, sz0], [0, stop - C.seatT / 2, sz1], C.seatT, { z: 'back', part: 'seat' }));                  // seat pad
  } else out.push(null, null);
  out.push(sideBar([0, t, p.towerZ], [0, p.pivot[1], p.towerZ], t, { z: 'back', part: 'frame' }),                               // tower
    { type: 'pulley', at: p.pivot, r: C.hubR, z: 'back', part: 'frame' });                                                        // pivot hub
  // moving: the lever
  // standing: the arm runs on past the pad to the handle post when the handles sit in front of the pad (handleAt < 0)
  const armEnd = add(L.pad, mul(L.u, seated ? 0 : Math.max(C.shoulderLen / 2, -(p.handleAt ?? C.handleAt) + C.postT / 2)));
  out.push({ ...sideBar(p.pivot, armEnd, C.armT, { z: 'back' }), part: 'lever' });                                               // lever arm
  if (seated) out.push({ type: 'poly', pts: circle(L.pad, C.rollerR), curve: true, cls: 'eq', z: 'mid', part: 'lever' });        // roller pad on the thighs
  else {                                                                                                                         // shoulder pad: lower face on the shoulders
    const a = add(L.pad, mul(L.u, -C.shoulderLen / 2)), b = add(L.pad, mul(L.u, C.shoulderLen / 2)), up = mul(L.n, C.armT / 2), dn = mul(L.n, -C.shoulderT);
    out.push({ type: 'poly', pts: [add(a, up), add(b, up), add(b, dn), add(a, dn)], cls: 'eq', z: 'mid', part: 'lever' });
  }
  out.push({ ...sideBar(L.gripBase, L.grip, C.postT, { z: 'back' }), part: 'lever' },                                           // handle post, from inside the arm
    { type: 'poly', pts: circle(L.grip, C.gripR, 12), cls: 'eq-solid', z: 'mid', part: 'lever' },                               // handle grip, end-on
    seated ? { ...sideBar(L.safetyBase, L.safetyTip, C.safetyT, { z: 'back' }), part: 'lever' } : null);                      // safety lever (seated only)
  return out;
}
