// Composer `crunchMachine` (census gap `crunchMachine`, claude/howto-options 4a9fd86; LIB-16 Do 4; single use:
// machine_crunch, its anchor, plan 2.1:141): a selectorised seated ab-crunch machine seen from the side, as
// machine_crunch's card names its parts (plate.equipment; c2, c3; the drawing note "shin roller and handles by the
// shoulders", D-LIB16-VLINE):
//  - the seat pad and the back pad the hips press against (c2), on one frame;
//  - the padded shin roller in front of the lower shins (c2), on a post from the floor beam;
//  - the movement arm: handles by the shoulders (c3) on a lever that pivots on the frame. The pivot sits on the trunk's
//    bend axis (the engine's one lumbar pivot, in the start pose), so the handles travel with the shoulders as the
//    spine curls (c1 mo-crunch "Adjust machine for proper alignment with torso").
// Built only from existing primitives: `seat`, `backPad` (also as straight bars via eq/parts.mjs sideBar), `kneePad`
// for the roller, `chestPress` for the movement arm (lever, neutral grip and pivot boss: polys, so the arm is drawn in
// the Mistake view whenever it moves, PQ-H9). The seat, back pad, frame and roller are static in every pose; the arm
// moves between start and end. Reads no file. Returns several items of one type, so a spec takes it through
// eq/parts.mjs perItem(fn, CRUNCH_MACHINE_ITEMS).
// Assumed sizes (a typical commercial selectorised ab-crunch machine; no card claim gives them; the spec lists them
// under "Unsourced numbers" and lb6/sizes.json holds each with its basis): seat pad 40 cm long, 7 cm thick (the vendor
// seat); back pad 7 cm thick; frame tubes 6 cm; roller radius 5.5 cm (the vendor kneePad); grip 14 cm (the vendor
// chestPress).
import { sideBar } from './parts.mjs';

export const CRUNCH_MACHINE = Object.freeze({ seatLen: 0.40, padT: 0.07, tubeT: 0.06, rollerR: 0.055, grip: 0.14 });
export const CRUNCH_MACHINE_ITEMS = 9;

/**
 * p.seat: { at }: the seat pad's top centre (world, the vendor `seat` primitive's `at`).
 * p.pad: { surface: [upper, lower], len, below }: the back pad's face, tangent to the back (world points), as the
 *   vendor backPad's `surface` form.
 * p.roller: { at, normal }: the shin contact point on the roller and the unit normal from the shin into the roller.
 * p.pivot: the movement arm's pivot (world). p.handle: the grip centre (world), where the hand holds it.
 * p.frameZ: the world z of the frame's upright, behind the back pad. p.floorZ: [rear z, front z] of the floor beam.
 */
export function crunchMachine({ seat, pad, roller, pivot, handle, frameZ, floorZ }) {
  const C = CRUNCH_MACHINE, t = C.tubeT;
  const top = Math.max(pad.surface[0][1], pivot[1]) + 0.05;
  const rc = roller.at.map((v, i) => v + roller.normal[i] * C.rollerR);              // roller centre
  return [
    sideBar([0, t / 2, floorZ[0]], [0, t / 2, floorZ[1]], t, { z: 'back' }),             // floor beam
    sideBar([0, t, frameZ], [0, top, frameZ], t, { z: 'back' }),                         // upright behind the back pad
    sideBar([0, seat.at[1] - C.padT - 0.03, frameZ], [0, seat.at[1] - C.padT - 0.03, seat.at[2]], t, { z: 'back' }),   // seat arm
    sideBar([0, pivot[1], frameZ], [0, pivot[1], pivot[2]], t, { z: 'back' }),           // pivot arm, upright to the pivot
    sideBar([0, t, rc[2]], [0, rc[1], rc[2]], 0.04, { z: 'back' }),                      // roller post
    { type: 'seat', at: seat.at, len: C.seatLen, post: false, z: 'back' },
    { type: 'backPad', surface: pad.surface, len: pad.len, below: pad.below, t: C.padT, post: false, z: 'back' },
    { type: 'kneePad', at: roller.at, r: C.rollerR, normal: roller.normal, z: 'back' },
    { type: 'chestPress', pivot, handle, grip: C.grip, gripAxis: [0, 1, 0], z: 'mid', part: 'arm' },
  ];
}
