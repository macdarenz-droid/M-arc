// Composer `latRaiseMachine` (library plan 2.1:141; LIB-16R2, D-LIB16R2-COMPOSERS): a seated lateral raise machine seen
// from the FRONT. Single use, anchor machine_lateral_raise.
// Parts (card plate.equipment: seat, back pad, two arm pads on levers pivoting at shoulder height, handles; c1-c3):
//  - static: the seat and the back pad (pecDeck's form), the centre column up to a top housing over the shoulders, and
//    a pivot boss level with each shoulder joint (c1);
//  - moving with each arm (`part: 'arm'`, every one a `poly`, PQ-H9): the lever along the outside of the upper arm (from
//    LEVER_FROM of its length; its root runs behind the shoulder to the pivot and is not drawn), the arm pad against
//    the upper arm just above the elbow (c3) and the handle at the hand.
// The spec gives each arm's geometry in world points per pose (read from the drawn arm), so the composer only draws;
// it reads no file and returns PRIMITIVES items only (equipment.mjs:316). Front view only.
// Assumed sizes (no card claim gives them; LAT_RAISE below, each with its basis in lb6/sizes.json r2.composers): pad
// 6 cm thick over the last 30-5 % of the upper arm, lever 4 cm, handle 13 x 3 cm, pivot boss r 4 cm, column 8 cm,
// housing 7 cm, back pad 30 x 70 cm (pecDeck's).
import { frontBar } from './parts.mjs';

export const LAT_RAISE = { PAD_T: 0.06, LEVER_FROM: 0.25, PAD_FROM: 0.7, PAD_TO: 0.95, LEVER_T: 0.04, GRIP_L: 0.13, GRIP_T: 0.03, BOSS_R: 0.04, COLUMN_T: 0.08, HOUSING_T: 0.07, BACK_W: 0.3 };
const { PAD_T, LEVER_FROM, PAD_FROM, PAD_TO, LEVER_T, GRIP_L, GRIP_T, BOSS_R, COLUMN_T, HOUSING_T, BACK_W } = LAT_RAISE;

/** A closed quad strip along a 2D axis (front view): from a + u*t0 to a + u*t1, between offsets o0 and o1 along n, at z. */
const strip = (a, u, n, t0, t1, o0, o1, z, extra) => {
  const P = (t, o) => [a[0] + u[0] * t + n[0] * o, a[1] + u[1] * t + n[1] * o, z];
  return { type: 'poly', pts: [P(t0, o0), P(t1, o0), P(t1, o1), P(t0, o1), P(t0, o0)], cls: 'eq', ...extra };
};

/**
 * p.seat: world top-surface centre of the seat. p.back: { at, len } the back pad. p.top: world y of the housing.
 * p.arms: { l, r } each { pivot: world shoulder joint, u: [x, y] unit along the upper arm (front view), n: [x, y] unit
 *   away from the body, len: the upper arm's length, face: offset along n of the arm's outer outline at the pad,
 *   grip: world grip centre, z: depth of the moving parts }. p.pxPerM: the plate scale.
 * Returns LAT_RAISE_ITEMS items, the static ones first; wrap it with perItem() (parts.mjs).
 */
export function latRaiseMachine({ seat, back, top, arms, pxPerM }) {
  const out = [
    { type: 'seat', at: seat, z: 'back' },
    { type: 'backPad', at: back.at, angle: 0, len: back.len, below: back.len / 2, width: BACK_W, post: false, z: 'back' },
    frontBar([0, 0.03, back.at[2]], [0, top, back.at[2]], COLUMN_T, pxPerM, { z: 'back' }),                                   // centre column
    frontBar([arms.r.pivot[0] - 0.08, top, back.at[2]], [arms.l.pivot[0] + 0.08, top, back.at[2]], HOUSING_T, pxPerM, { z: 'back' }),   // housing
  ];
  for (const s of ['l', 'r']) out.push({ type: 'pulley', at: arms[s].pivot, r: BOSS_R, z: 'back' });                         // pivot bosses (c1)
  for (const s of ['l', 'r']) {
    const A = arms[s], a = [A.pivot[0], A.pivot[1]], L = A.len;
    out.push(strip(a, A.u, A.n, LEVER_FROM * L, PAD_FROM * L, A.face, A.face + LEVER_T, A.z, { z: 'back', part: 'arm' }));    // lever (its root behind the shoulder is not drawn)
    out.push(strip(a, A.u, A.n, PAD_FROM * L, PAD_TO * L, A.face, A.face + PAD_T, A.z, { z: 'front', part: 'arm' }));          // arm pad (c3)
    const g = A.grip;
    out.push({ type: 'poly', pts: [[g[0] - GRIP_T / 2, g[1] - GRIP_L / 2, A.z], [g[0] + GRIP_T / 2, g[1] - GRIP_L / 2, A.z], [g[0] + GRIP_T / 2, g[1] + GRIP_L / 2, A.z],
      [g[0] - GRIP_T / 2, g[1] + GRIP_L / 2, A.z], [g[0] - GRIP_T / 2, g[1] - GRIP_L / 2, A.z]], cls: 'eq', z: 'back', part: 'arm' });   // handle (c3)
  }
  return out;
}
export const LAT_RAISE_ITEMS = 12;
