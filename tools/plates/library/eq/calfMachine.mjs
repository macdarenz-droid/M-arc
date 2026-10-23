// Composer `calfMachine` (census gap `calfMachine`, "kneePad lever or shoulder pads + box platform", claude/howto-options
// 4a9fd86; LIB-18 Do 4; D-LIB18-COMPOSERS, -FRAME): one calf raise machine seen from the side, in two forms on the same
// platform and frame, from this one file, so the shared rig is approved once:
//  - form 'seated' (seated_calf_raise; plate.equipment c1-c3, c5, c6): a seat pad on a post; a foot platform under the
//    balls of the feet with its rear edge just behind the balls, so the heels hang off it (c3); in front of the
//    platform a tower that carries the lever's pivot; the lever arm runs back from the pivot to a roller pad that rests
//    across the thighs just above the knees (c1, c2); a handle grip rises from the arm just in front of the pad (c5) and
//    the safety lever sticks up from the arm beside it (c6);
//  - form 'standing' (standing_calf_raise; plate.equipment c1-c3): the same platform and floor beam; a rear tower
//    behind the lifter carries the pivot; the lever arm runs forward from it to two shoulder pads, one over each
//    shoulder, whose lower faces rest on the shoulder tops (c1, c2; D-LIB18-PADS); the handle post hangs from the arm in front of the pad (handleAt < 0, handleH < 0:
//    the arm runs on to the post) with the grip at its end (c2, c3 "handles by the pads"). No seat and no safety lever
//    (the standing card names neither).
//  Static (z back): floor beam, the platform and its post, the seat and its post (seated), the tower and its pivot hub.
//  Moving (part 'lever', every one a `poly`, eq/parts.mjs sideBar or `poly`, so it is drawn in the Mistake view
//  whenever it moves, PQ-H9; plate.mjs:205-218): the lever arm, the pad (pads), the handle grip and the safety lever.
// Shoulder pads (standing form; D-LIB18-PADS, #306 6357949465): a single midline pad overlapped the neck by 3.8 to 4.8 cm
//  (scratchpad calves/padneck2.mjs). Each pad now sits on its own shoulder top, from padIn to padOut off the midline:
//  the lever turns up to 10.1 deg off the upright trunk (standing_calf_raise's Mistake; 9.6 deg at the end), so the
//  flat lower face, on the shoulder tops (0.830 H: shoulder 0.800 H + cap 0.030 H, body.mjs:21, :29, :153), drops
//  tan(10.1 deg) x 0.0616 H (the trunk's back 10.8 cm behind them at 0.82 H, body.mjs:47 torsoSide) = 0.011 H (1.9 cm)
//  over the trunk's rear edge; padIn 0.125 H (21.875 cm) is where the front outline (body.mjs:42 torsoHalf, its edge
//  from (0.122, 0.821) to (0.14, 0.800) H) lies 0.0125 H (2.2 cm) under the shoulder tops, so the face clears the
//  trapezius and the neck in every pose; padOut reaches past the shoulder cap's outer side (shX + shoulderCap =
//  0.1595 H = 27.9 cm). Each pad's poly carries its eight corners (side view: outer bottom rear,
//  outer bottom front, inner bottom front, outer top front, inner top front, inner top rear, outer top rear, inner
//  bottom rear; the profile is a rectangle). The far pad (x > 0) coincides with the near one in the side view and is
//  the last item but one (null in the seated form, so the seated slots are unchanged).
// Lever fork (standing form; D-LIB18-PADS follow-up): a midline arm ran 6.3 to 6.4 cm inside the neck and head in every
//  pose (scratchpad pads/arm.mjs). The arm now forks at the pivot hub (an axle across the tower top) into two branches,
//  one to each pad, each in the plane through its pad's middle, x = +-(padIn + padOut) / 2 = 24.9 cm: there the trunk
//  is at most 0.14 H = 24.5 cm wide (body.mjs:42, at 0.80 H, under the branch) and the head 0.046 H = 8 cm (body.mjs:36),
//  so no branch meets the body. In the side view the branches coincide with the old arm; the near branch keeps the arm's
//  slot and the far branch is the last item (null in the seated form, whose arm stays on the midline between the knees).
// Every pad, seat, platform and lever is joined to the frame (D-LIB18-FRAME): the seat pad sits on its post and the
//  platform on its post, both posts and the tower stand on the floor beam, the lever arm starts inside the pivot hub on
//  the tower top and runs into the pad, and the handle and the safety lever start inside the arm.
// Built only from existing primitives (`backPad` through sideBar, `poly`, `pulley`). Reads no file. Returns several items
// of one type, so a spec takes it through eq/parts.mjs perItem(fn, CALF_MACHINE_ITEMS). Side view only.
// Assumed sizes (no card claim gives them; the spec lists them under "Unsourced numbers" and lb8/sizes.json holds each
// with its basis): roller 5.5 cm radius (the vendor kneePad r), seat 40 cm by 7 cm (the vendor seat), shoulder pad 20 cm by
// 6 cm (hackSled's), frame tubes 6 cm (hackSled's and pulloverMachine's tubeT), lever arm 5 cm (pulloverMachine's armT),
// platform 3.5 cm thick (the 8's leg press plate, equipment.mjs legPress45 t 0.035), pivot hub 4.5 cm radius (the vendor pulley), handle grip 3.2 cm across (the vendor chestPress grip),
// shoulder pads padIn 21.875 cm to padOut 28 cm off the midline (above)
// on a 2.5 cm post handleH over the arm at the pad (handleAt 0), safety lever 10 cm by 2 cm, safetyAt along the arm
// from the pad.
import { add, mul, norm, sub, sideBar } from './parts.mjs';

export const CALF_MACHINE = Object.freeze({ rollerR: 0.055, seatLen: 0.40, seatT: 0.07, shoulderLen: 0.20, shoulderT: 0.06, tubeT: 0.06, armT: 0.05,
  platT: 0.035, hubR: 0.045, gripR: 0.016, postT: 0.025, handleH: 0.14, safetyLen: 0.10, safetyT: 0.02, handleAt: 0, safetyAt: 0.14, padIn: 0.21875, padOut: 0.28 });
export const CALF_MACHINE_ITEMS = 14;

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

// One shoulder pad (standing form; side s: +1 the far, left one; -1 the near, right one) on the lever L, as its eight
// corners (order in the header): lower face shoulderT under the arm's axis, top face flush with the arm's top.
const shoulderPad = (L, s) => {
  const C = CALF_MACHINE, a = add(L.pad, mul(L.u, -C.shoulderLen / 2)), b = add(L.pad, mul(L.u, C.shoulderLen / 2)), up = mul(L.n, C.armT / 2), dn = mul(L.n, -C.shoulderT);
  const X = (p, x) => [s * x, p[1], p[2]];
  const ob = X(add(a, dn), C.padOut), ib = X(add(a, dn), C.padIn), ot = X(add(a, up), C.padOut), it = X(add(a, up), C.padIn), L2 = sub(b, a);
  return { type: 'poly', pts: [ob, add(ob, L2), add(ib, L2), add(ot, L2), add(it, L2), it, ot, ib], cls: 'eq', z: 'mid', part: 'lever' };
};

/**
 * p.form: 'seated' | 'standing'.
 * p.floorZ: [rear z, front z] of the floor beam (it lies on the floor, y 0 to tubeT).
 * p.platform: { top, z: [rear edge z, front edge z], postZ }: the platform's top face height, its edges and its post.
 * p.seat: { top, z: [rear z, front z], postZ } (seated only): the seat pad's top face, its ends and its post.
 * p.pivot, p.arm, p.angle, p.toward: the lever (calfLever). p.towerZ: the tower's z (under the pivot).
 * Returns CALF_MACHINE_ITEMS slots, in order: floor beam, platform post, platform, seat post, seat pad (seated; null in
 * the standing form), tower, pivot hub (static, z back); lever arm, pad (roller or shoulder pad), handle post, handle
 * grip, safety lever (null in the standing form), far shoulder pad, far lever branch (both null in the seated form;
 * standing, the arm slot holds the near branch) (part 'lever'; the pads
 * and the grip z mid, the rest z back). In the standing form the pad slot holds the near (right) shoulder pad.
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
  const xb = (C.padIn + C.padOut) / 2, branch = sx => ({ ...sideBar([sx * xb, p.pivot[1], p.pivot[2]], [sx * xb, armEnd[1], armEnd[2]], C.armT, { z: 'back' }), part: 'lever' });
  out.push(seated ? { ...sideBar(p.pivot, armEnd, C.armT, { z: 'back' }), part: 'lever' } : branch(-1));                        // lever arm (standing: its near branch)
  if (seated) out.push({ type: 'poly', pts: circle(L.pad, C.rollerR), curve: true, cls: 'eq', z: 'mid', part: 'lever' });        // roller pad on the thighs
  else out.push(shoulderPad(L, -1));                                                                                          // near shoulder pad: lower face on the shoulder top
  out.push({ ...sideBar(L.gripBase, L.grip, C.postT, { z: 'back' }), part: 'lever' },                                           // handle post, from inside the arm
    { type: 'poly', pts: circle(L.grip, C.gripR, 12), cls: 'eq-solid', z: 'mid', part: 'lever' },                               // handle grip, end-on
    seated ? { ...sideBar(L.safetyBase, L.safetyTip, C.safetyT, { z: 'back' }), part: 'lever' } : null,                      // safety lever (seated only)
    seated ? null : shoulderPad(L, 1),                                                                                          // far shoulder pad (standing only)
    seated ? null : branch(1));                                                                                                 // far lever branch (standing only)
  return out;
}
