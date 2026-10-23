// Composer `jumpRope` (census gap `jumpRope`, "new primitive or box/line composition (single user)", claude/howto-options
// 4a9fd86; LIB-22 Do 4; single use: jump_rope, its anchor, plan 2.1:141; D-LIB22-COMPOSERS): a skipping rope seen from
// the FRONT (jump_rope's card and census view).
//  - two handles: `poly` capsules along each fist's handle axis, the rope end at the handle's lower tip;
//  - the rope: one thin closed `poly` strand from one handle's tip to the other's, bowed out beside the body to an apex that
//    sits at `apexY` (over the head, or under the soles), bowed out `width` beside the body: the turning rope's
//    front-view outline at that instant.
// Every part moves (start, end and Mistake), so every part carries `poly` (PQ-H9), and the rope runs unbroken from
// handle to handle in every pose (A15). Reads no file. Returns JUMP_ROPE_ITEMS items; a spec takes it through perItem.
// Assumed sizes (lb10/sizes.json holds each with its basis): handles 15 cm long and 2.6 cm thick, the rope 5 mm thick.
export const JUMP_ROPE = Object.freeze({ handleLen: 0.15, handleT: 0.026, ropeT: 0.005 });
export const JUMP_ROPE_ITEMS = 3;

const sub = (a, b) => a.map((v, i) => v - b[i]), add = (a, b) => a.map((v, i) => v + b[i]), mul = (a, k) => a.map(v => v * k);
const norm = a => { const L = Math.hypot(...a) || 1; return a.map(v => v / L); };
/** A handle in the front view: a capsule centred on the grip, along `axis` (screen up = +y), its rope tip `tip`. */
function handle(grip, axis, C) {
  const u = norm([axis[0], axis[1], 0]), n = [-u[1], u[0], 0], h = C.handleLen / 2, t = C.handleT / 2, pts = [];
  for (let a = 0; a <= 180; a += 30) { const r = a * Math.PI / 180; pts.push(add(add(grip, mul(u, h)), add(mul(n, t * Math.cos(r)), mul(u, t * Math.sin(r))))); }
  for (let a = 180; a <= 360; a += 30) { const r = a * Math.PI / 180; pts.push(add(add(grip, mul(u, -h)), add(mul(n, t * Math.cos(r)), mul(u, t * Math.sin(r))))); }
  return { pts, tip: add(grip, mul(u, -h)) };
}
/** The rope's centre line (front view, x-y plane at the tips' z): from tip a out to `width` beside the body and round
 *  through the apex (apexY, at x = the tips' midpoint) to tip b; each half is one cubic Bezier. */
export function ropeLine(a, b, apexY, width, n = 16) {
  const cx = (a[0] + b[0]) / 2, z = (a[2] + b[2]) / 2, half = (p, s) => {
    const P = [p, [cx + s * width, p[1] + (apexY - p[1]) * 0.2, z], [cx + s * width, apexY, z], [cx, apexY, z]];
    return Array.from({ length: n + 1 }, (_, k) => { const t = k / n, u = 1 - t; return [0, 1, 2].map(i => u * u * u * P[0][i] + 3 * u * u * t * P[1][i] + 3 * u * t * t * P[2][i] + t * t * t * P[3][i]); });
  };
  const sa = Math.sign(a[0] - cx) || 1;
  return [...half(a, sa), ...half(b, -sa).reverse().slice(1)];
}
export const lineLength = pts => pts.slice(1).reduce((s, p, i) => s + Math.hypot(...sub(p, pts[i])), 0);
/**
 * p.grips: { l, r } world grip centres; p.axis: the handles' direction in the fists (toward the rope tip is -axis);
 * p.apexY: the rope's apex height; p.width: how far out from the midline the rope bows. Returns [left handle, right handle, rope].
 */
export function jumpRope({ grips, axis = [0, 1, 0], apexY, width = 0.4, z = 'front', part = 'rope' }, C = JUMP_ROPE) {
  const L = handle(grips.l, [-axis[0], axis[1], 0], C), Rh = handle(grips.r, axis, C);
  const line = ropeLine(Rh.tip, L.tip, apexY, width), t = C.ropeT / 2;
  const off = (p, i, s) => { const q = line[Math.min(line.length - 1, i + 1)], o = line[Math.max(0, i - 1)], d = norm(sub(q, o)); return add(p, mul([-d[1], d[0], 0], s * t)); };
  const strand = [...line.map((p, i) => off(p, i, 1)), ...line.map((p, i) => off(p, i, -1)).reverse()];
  return [{ type: 'poly', pts: L.pts, curve: true, cls: 'eq-solid', z, part }, { type: 'poly', pts: Rh.pts, curve: true, cls: 'eq-solid', z, part },
    { type: 'poly', pts: strand, cls: 'eq-solid', z: 'back', part }];
}
