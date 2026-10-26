// Composer `medBallOptional` (census gap `medBallOptional`, claude/howto-options 4a9fd86; LIB-21 Do 4, Do 7b; one user,
// russian_twist, plan 2.1:141; D-LIB21-COMPOSERS): the optional medicine ball held at the chest in both hands (c2),
// seen from the front.
//  - the ball: one closed `poly` circle (curve: true), never the vendor `pulley` (a solid circle with no `poly`,
//    equipment.mjs:300), so a ball that moves between the end pose and the Mistake is drawn in the Mistake view (PQ-H9);
//  - its seam: a thin closed `poly` band across the ball, so the ball reads as a ball and not as a disc.
// #305's eq/medBall.mjs was read as a pattern only (D-LIB21-COMPOSERS); nothing is imported, copied or forked.
// Reads no file. Returns MED_BALL_OPT_ITEMS items of one type; a spec takes it through eq/parts.mjs perItem.
// Assumed size (lb9/sizes.json holds it with its basis): 23 cm across.
export const MED_BALL_OPT = Object.freeze({ d: 0.23, seam: 0.1 });
export const MED_BALL_OPT_ITEMS = 2;

const R = Math.PI / 180;
/**
 * p.at: the ball's centre (world). p.pitch: the front camera's pitch (deg, SPEC.md 1: screen-up = y cos p - z sin p), so
 * the ball is drawn in the plane square to the view and stays a circle on the plate. p.axis: the seam's direction on
 * the plate, [right, up] (default level). Returns [ball, seam].
 */
export function medBallOptional({ at, pitch = 0, axis = [1, 0], z = 'mid', part = 'ball' }, C = MED_BALL_OPT) {
  const r = C.d / 2, n = Math.hypot(...axis), a0 = [axis[0] / n, axis[1] / n], p = pitch * R;
  // the plate's right and up as world directions square to the view: right = +x, up = (0, cos p, -sin p)
  const X = [1, 0, 0], U = [0, Math.cos(p), -Math.sin(p)];
  const u = X.map((x, i) => a0[0] * x + a0[1] * U[i]), v = X.map((x, i) => -a0[1] * x + a0[0] * U[i]);
  const pt = (a, b) => [0, 1, 2].map(i => at[i] + a * u[i] + b * v[i]);
  const ball = Array.from({ length: 24 }, (_, k) => { const t = k * 15 * R; return pt(r * Math.cos(t), r * Math.sin(t)); });
  // seam: a band through the centre, along `axis`, its half-width seam * r, ending on the ball's outline
  const w = C.seam * r, e = Math.sqrt(r * r - w * w) * 0.98;
  const seam = [pt(-e, w), pt(e, w), pt(e, -w), pt(-e, -w)];
  return [{ type: 'poly', pts: ball, curve: true, cls: 'eq-solid', z, part }, { type: 'poly', pts: seam, cls: 'eq', z, part }];
}
