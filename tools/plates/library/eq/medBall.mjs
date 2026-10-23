// Composer `medBall` (census gap `medBall`, "pulley() circle, compose from existing parts", claude/howto-options
// 4a9fd86; LIB-22 Do 4; two users, both in LB10, plan 2.1:140: medicine_ball_slam, its anchor, and wall_ball;
// D-LIB22-COMPOSERS): a soft medicine (slam) ball, seen from the side.
//  - the ball: one closed `poly` circle (curve: true), never the vendor `pulley` (a solid circle with no `poly`,
//    equipment.mjs:300), so a ball that moves between the end pose and the Mistake is drawn in the Mistake view (PQ-H9);
//  - its seam: a thin closed `poly` lens across the ball (a slam ball's moulded seam), so the ball reads as a ball and
//    not as a disc.
// Reads no file. Returns MED_BALL_ITEMS items of one type; a spec takes it through eq/parts.mjs perItem.
// Assumed size (lb10/sizes.json holds it with its basis): 23 cm across.
export const MED_BALL = Object.freeze({ d: 0.23, seam: 0.12, seamTilt: 20 });
export const MED_BALL_ITEMS = 2;

const R = Math.PI / 180;
/**
 * p.at: the ball's centre (world). p.view: 'side' (y-z plane) or 'front' (x-y plane). p.tilt: the seam's turn (deg).
 * Returns [ball, seam].
 */
export function medBall({ at, view = 'side', tilt = MED_BALL.seamTilt, z = 'mid', part = 'ball' }, C = MED_BALL) {
  const r = C.d / 2, pt = (u, v) => (view === 'side' ? [at[0], at[1] + v, at[2] + u] : [at[0] + u, at[1] + v, at[2]]);
  const ball = Array.from({ length: 24 }, (_, k) => { const a = k * 15 * R; return pt(r * Math.cos(a), r * Math.sin(a)); });
  // seam: a lens through the centre, turned `tilt`, its half-height seam * r
  const t = tilt * R, c = Math.cos(t), s = Math.sin(t), lens = [];
  for (let k = 0; k <= 12; k++) { const u = -r * 0.92 + (2 * r * 0.92) * k / 12, v = C.seam * r * Math.sin(Math.PI * k / 12); lens.push([u, v]); }
  for (let k = 11; k >= 1; k--) { const u = -r * 0.92 + (2 * r * 0.92) * k / 12, v = C.seam * r * 0.55 * Math.sin(Math.PI * k / 12); lens.push([u, v]); }
  const seam = lens.map(([u, v]) => pt(u * c - v * s, u * s + v * c));
  return [{ type: 'poly', pts: ball, curve: true, cls: 'eq-solid', z, part }, { type: 'poly', pts: seam, curve: true, cls: 'eq', z, part }];
}
