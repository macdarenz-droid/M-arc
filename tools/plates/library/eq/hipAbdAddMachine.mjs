// Composer `hipAbdAddMachine` (library plan 2.1:140; LIB-16R2, D-LIB16R2-COMPOSERS): a seated hip abduction / adduction
// machine seen from the FRONT. Anchor hip_abduction; both users (hip_abduction, hip_adduction) are on the LB6 sheet.
// Parts (card plate.equipment of both users: seat, back pad, footrests, two leg pads on the outer or inner thighs, side
// handles; c1, c2):
//  - static: the seat and the back pad (pecDeck's form), the centre column under the seat and a floor beam, and two side
//    handles beside the hips (a grip and its post);
//  - moving with each leg (`part: 'leg'`, every one a `poly`, PQ-H9): the leg pad against the thigh (outer for
//    abduction, inner for adduction), the leg arm from the pad down to the footrest, and the footrest under the foot.
// The spec gives the pad and foot geometry in world points per pose (read from the drawn legs), so the composer only
// draws; it reads no file and returns PRIMITIVES items only (equipment.mjs:316). Front view only.
// Assumed sizes (no card claim gives them; HIP_ABD_ADD below, each with its basis in lb6/sizes.json r2.composers): pad
// 6 cm thick and 20 cm tall, leg arm 4 cm, footrest 16 x 3 cm, column 8 cm, floor beam 5 cm, handle grip 12 x 3 cm on
// a 3 cm post, back pad 30 x 70 cm (pecDeck's); each footrest stops 2 cm short of the midline.
import { frontBar } from './parts.mjs';

export const HIP_ABD_ADD = { PAD_T: 0.06, PAD_H: 0.2, ARM_T: 0.04, FOOT_W: 0.16, FOOT_H: 0.03, COLUMN_T: 0.08, BEAM_T: 0.05, GRIP_L: 0.12, GRIP_T: 0.03,
  POST_T: 0.03, BACK_W: 0.3, MID_GAP: 0.02 };
const { PAD_T, PAD_H, ARM_T, FOOT_W, FOOT_H, COLUMN_T, BEAM_T, GRIP_L, GRIP_T, POST_T, BACK_W, MID_GAP } = HIP_ABD_ADD;

/** A closed axis-aligned rectangle (front view) as a `poly` item: x0..x1, y0..y1 at depth z. */
const rect = (x0, x1, y0, y1, z, extra) => ({ type: 'poly', pts: [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z], [x0, y0, z]], cls: 'eq', ...extra });

/**
 * p.side: 'outer' (abduction) or 'inner' (adduction). p.seat: world top-surface centre of the seat. p.back: { at, len }
 * the back pad's centre and length. p.legs: { l, r } each { face: x of the pad face against the thigh, y: pad centre
 * height, z: depth, foot: [x, y, z] the sole point the footrest carries }. p.handles: { l, r } world grip centres.
 * p.beam: [x0, x1] of the floor beam. p.pxPerM: the plate scale (front bars are sized in px by the backPad primitive).
 * Returns HIP_ABD_ADD_ITEMS items, the static ones first; wrap it with perItem() (parts.mjs).
 */
export function hipAbdAddMachine({ side, seat, back, legs, handles, beam, pxPerM }) {
  if (!['outer', 'inner'].includes(side)) throw new Error(`hipAbdAddMachine: side ${side} is not outer or inner`);
  const out = [
    { type: 'seat', at: seat, z: 'back' },
    { type: 'backPad', at: back.at, angle: 0, len: back.len, below: back.len / 2, width: BACK_W, post: false, z: 'back' },
    frontBar([0, 0.03, seat[2]], [0, seat[1] - 0.05, seat[2]], COLUMN_T, pxPerM, { z: 'back' }),            // centre column
    frontBar([beam[0], BEAM_T / 2, seat[2]], [beam[1], BEAM_T / 2, seat[2]], BEAM_T, pxPerM, { z: 'back' }),   // floor beam
  ];
  for (const s of ['l', 'r']) {   // side handles: a grip on a post down to the seat's height
    const g = handles[s];
    out.push(frontBar([g[0], seat[1] - 0.05, g[2]], [g[0], g[1] - GRIP_L / 2, g[2]], POST_T, pxPerM, { z: 'back' }));
    out.push(rect(g[0] - GRIP_T / 2, g[0] + GRIP_T / 2, g[1] - GRIP_L / 2, g[1] + GRIP_L / 2, g[2], { z: 'back' }));
  }
  for (const s of ['l', 'r']) {   // moving: pad, leg arm, footrest
    const L = legs[s], out1 = s === 'l' ? 1 : -1, dir = side === 'outer' ? out1 : -out1;   // dir: from the face into the pad
    const x0 = L.face, x1 = L.face + dir * PAD_T, padLo = L.y - PAD_H / 2, armX = (x0 + x1) / 2, f = L.foot;
    out.push(rect(Math.min(x0, x1), Math.max(x0, x1), padLo, L.y + PAD_H / 2, L.z, { z: 'front', part: 'leg' }));
    out.push(rect(armX - ARM_T / 2, armX + ARM_T / 2, f[1], padLo, L.z, { z: 'back', part: 'leg' }));
    // the footrest spans the foot and the arm, and stops MID_GAP short of the midline, so the two never cross
    let lo = Math.min(f[0] - FOOT_W / 2, armX - ARM_T / 2), hi = Math.max(f[0] + FOOT_W / 2, armX + ARM_T / 2);
    if (out1 > 0) lo = Math.max(lo, MID_GAP); else hi = Math.min(hi, -MID_GAP);
    out.push(rect(lo, hi, f[1] - FOOT_H, f[1], f[2], { z: 'back', part: 'leg' }));
  }
  return out;
}
export const HIP_ABD_ADD_ITEMS = 14;
