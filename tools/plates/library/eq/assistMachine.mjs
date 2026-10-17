// Composer `assistMachine` (library plan 2.1, census gaps assistMachine, mountStep, stackPin; LB1 anchor
// assisted_pull_up): an assisted pull-up machine seen from the side, the lifter kneeling on its pad and facing the
// tower (+z). Built only from existing primitives (box, pullupBar, stack, pulley, cable, floor, poly).
// - Tower in front of the lifter: two uprights, a top beam, a floor rail running back under the lifter.
// - Handle arm from the tower at bar height, ending in the bar the lifter holds (end-on, as on the pull_up plate).
// - Knee pad on a lever: the lever pivots on the tower's near face and runs back under the lifter; the pad sits on a
//   short bracket at its end. A cable runs from the lever up over two pulleys to the weight stack in the tower, so
//   pushing the pad down lifts the stack, and the stack's pull lifts the pad (the assistance, card c1, c4).
// - Mount step on the tower's near face, and the selector pin in the stack (census mountStep, stackPin).
// The machine is driven by named per-pose states, never by the lifter's landmarks: cfg.padTop gives the pad-top height
// for 'start', 'end' and 'mistake' (ghosts interpolate it), and the pad sits on a circle of radius `lever` round the
// pivot. The spec solves the lifter onto those pads and proves the contact with `checks` planes at the same heights,
// so a knee that misses its pad shows (tests/howto/lb1-plates.test.ts reads the drawn pad in every pose).
// The start layer never draws moving equipment (vendor plate.mjs compares the start equipment with itself), so the
// start pad, bracket and lever are added to the end pose as a thin dashed outline (`line`, 'eq-line m-line'), as
// leg_press does for its start footplate and machine_chest_press for its start lever.
// Moving parts (lever, bracket, pad, stack pin) are `poly`, the stack and cables are H9 line types, so the Mistake
// view outlines every part that moves (PQ-H9). Everything else is static.
// Assumed sizes (typical commercial assisted pull-up machine, not one maker's drawing; no card claim gives sizes):
// uprights 6 cm, tower 40 cm deep and 2.25 m tall; handle arm 5 cm; 32 mm bar; lever 5 cm thick; pad 32 cm long and
// 8 cm thick on a 6 cm bracket; step 24 cm deep at 42 cm; 14 plates of 2.5 cm; pulleys 7 cm.
// Returns up to ASSIST_ITEMS items; wrap it with perItem() (parts.mjs) so each part gets its own key.
import { RADII } from '../engine.mjs';
import { polyBar, polyPad } from './polybar.mjs';

export const KNEE_R = RADII.kneeCap;   // in body heights: kneecap radius, from the knee joint to the pad top

/**
 * The machine state for a pad-top height: { padTop: [rear, front], leverEnd, attach }.
 * m.pivot: world pivot of the lever (on the tower's near face); m.lever: pivot to the bracket foot (m);
 * m.bracket: bracket height (m); m.pad: [length, thickness]; m.padBack: how far the pad reaches behind the lever end (m);
 * m.attach: cable attachment, as a distance from the pivot along the lever (m); topY: world height of the pad top.
 */
export function assistGeometry(m, topY) {
  const [padLen, padT] = m.pad;
  const footY = topY - padT - m.bracket;
  const dy = footY - m.pivot[1];
  if (Math.abs(dy) >= m.lever) throw new Error(`assistMachine: pad top ${topY.toFixed(3)} m is out of the lever's reach (dy ${dy.toFixed(3)} m)`);
  const dz = Math.sqrt(m.lever * m.lever - dy * dy);
  const leverEnd = [0, footY, m.pivot[2] - dz];
  const rear = [0, topY, leverEnd[2] - m.padBack], front = [0, topY, rear[2] + padLen];
  const k = m.attach / m.lever, attach = [0, m.pivot[1] + dy * k, m.pivot[2] - dz * k];
  return { padTop: [rear, front], leverEnd, attach };
}

/** The pad-top height of a drawn pose: cfg.padTop[pose], or for ghost i of n the start-to-end value at t = (i+1)/(n+1). */
export function padTopFor(cfg, pose) {
  if (pose in cfg.padTop) return cfg.padTop[pose];
  const g = /^ghost(\d+)$/.exec(pose);
  if (!g) throw new Error(`assistMachine: no pad state for pose ${pose}`);
  const t = (+g[1] + 1) / ((cfg.ghosts ?? 3) + 1);
  return cfg.padTop.start + (cfg.padTop.end - cfg.padTop.start) * t;
}

/** The lever, bracket and pad of one state, as the composer draws them (poly items). */
export function leverParts(cfg, g, z = { lever: 'back', pad: 'center' }) {
  const [rear, front] = g.padTop, padMid = [0, rear[1] - cfg.pad[1], (rear[2] + front[2]) / 2];
  return [
    polyBar(cfg.pivot, g.leverEnd, 0.05, { z: z.lever, part: 'pad' }),                                                                    // lever
    polyBar(g.leverEnd, padMid, 0.04, { z: z.lever, part: 'pad' }),                                                                       // pad bracket
    polyPad(rear, front, cfg.pad[1], { z: z.pad, part: 'pad' }),                                                                          // knee pad
  ];
}

export const ASSIST_ITEMS = 22;   // 19 parts + the 3-part start phantom in the end pose

/**
 * cfg: { pivot, lever, bracket, pad, padBack, attach, padTop: { start, end, mistake } (pad-top heights, m), ghosts (the
 *   spec's ghost count), tower: [near z, far z], h, bar: world bar centre, step: y,
 *   stack: { plates, load, lift0 (the stack's lift at the start, m) }, floor: [from z, to z] }.
 * Returns (lm, ctx) => item[] (one per part, ASSIST_ITEMS at most).
 */
export function assistMachine(cfg) {
  const { pivot, tower: [T0, T1], h = 2.25, bar, step = 0.42 } = cfg;
  const st = { plates: 14, load: 6, lift0: 0.03, ...(cfg.stack ?? {}) };
  const SZ = (T0 + T1) / 2, PA = [0, h - 0.10, cfg.attachZ ?? pivot[2] - 0.06], PB = [0, h - 0.10, SZ];
  const B0 = Math.min(T0 - 0.04, PA[2] - 0.05);
  return (lm, ctx) => {
    const g = assistGeometry(cfg, padTopFor(cfg, ctx.pose)), g0 = assistGeometry(cfg, cfg.padTop.start);
    // the cable from the lever over PA and PB to the stack: the stack rises by as much as the attachment drops
    const lift = st.lift0 - (g.attach[1] - g0.attach[1]);   // lift0: the stack's lift in the start (dead hang)
    if (lift < 0) throw new Error(`assistMachine: the stack would sit below its stops (lift ${lift.toFixed(3)} m)`);
    const top = 0.06 + st.plates * 0.025 + lift;
    const pinY = 0.06 + (st.plates - st.load) * 0.025 + lift + 0.0125;
    return [
      { type: 'floor', from: cfg.floor[0], to: cfg.floor[1] },
      { type: 'box', at: [0, 0.022, (cfg.floor[0] + 0.1 + T1 + 0.04) / 2], w: T1 + 0.04 - cfg.floor[0] - 0.1, h: 0.044, rc: 1, z: 'center' },  // floor rail
      ...[T0, T1].map(zz => ({ type: 'box', at: [0, h / 2, zz], w: 0.06, h, rc: 1 })),                                                    // uprights
      { type: 'box', at: [0, h - 0.03, (B0 + T1 + 0.04) / 2], w: T1 + 0.04 - B0, h: 0.06, rc: 1.5 },                                     // top beam, out over PA
      { type: 'box', at: [0, bar[1] + 0.03, (bar[2] + T0) / 2], w: T0 - bar[2], h: 0.05, rc: 1.5 },                                       // handle arm
      { type: 'pullupBar', at: bar, mount: 'ceiling', stub: 0.0001 },                                                                    // the bar, end-on
      { type: 'box', at: [0, step, T0 - 0.15], w: 0.24, h: 0.04, rc: 1.5, cls: 'eq' },                                                  // mount step
      { type: 'stack', base: [0, 0, SZ], plates: st.plates, load: st.load, w: 0.2, lift, rods: false, part: 'stack' },
      { type: 'poly', cls: 'eq-solid', z: 'back', part: 'stack', pts: [[0, pinY - 0.006, SZ - 0.13], [0, pinY - 0.006, SZ - 0.09], [0, pinY + 0.006, SZ - 0.09], [0, pinY + 0.006, SZ - 0.13]] },   // selector pin
      { type: 'pulley', at: PA, r: 0.035 },
      { type: 'pulley', at: PB, r: 0.035 },
      { type: 'cable', from: [0, PA[1] + 0.035, PA[2]], to: [0, PB[1] + 0.035, PB[2]], z: 'back' },
      { type: 'cable', from: [0, PB[1], PB[2]], to: [0, top, SZ], z: 'back', part: 'stack' },
      { type: 'cable', from: g.attach, to: [0, PA[1], PA[2] - 0.035], z: 'back', part: 'pad' },
      ...leverParts(cfg, g),
      { type: 'pulley', at: pivot, r: 0.03 },                                                                                           // lever pivot
      // the start pad, bracket and lever as a dashed outline in the end pose (never in the Mistake pose)
      ...(ctx.pose === 'end' ? leverParts(cfg, g0).map(it => ({ type: 'line', cls: 'eq-line m-line', z: 'back', part: 'phantom', pts: [...it.pts, it.pts[0]] })) : []),
    ];
  };
}
