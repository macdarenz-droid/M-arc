// LB1 (LIB-9a) shared shapes for composers whose parts move in a rep. A moving equipment part must carry `poly`, or it
// silently drops out of the Mistake view (PQ-H9; plate.mjs draws a changed item in the Mistake only if it has `poly`).
// Each helper returns ONE `poly` item (a closed outline in world metres), so it can move between the end pose and the
// Mistake. Side view only: outlines are built in the y/z plane (x = 0, the body mid-plane).
import { sub, add, mul, norm } from './parts.mjs';

/** In-plane unit normal of the y/z direction u, turned 90 degrees. */
const across = u => [0, -u[2], u[1]];

/** A straight bar from world point a to b, t thick, its corners cut by c (m) so it reads as a machined part. */
export function polyBar(a, b, t, { c = Math.min(0.012, t / 3), cls = 'eq', z = 'back', part } = {}) {
  const u = norm(sub(b, a)), n = mul(across(u), t / 2), k = mul(u, c), kn = mul(across(u), c);
  const A = sub(a, n), B = sub(b, n), C = add(b, n), D = add(a, n);
  const pts = [add(A, k), sub(B, k), add(B, kn), sub(C, kn), sub(C, k), add(D, k), sub(D, kn), add(A, kn)];
  return { type: 'poly', pts, cls, z, ...(part ? { part } : {}) };
}

/** A pad seen side-on: its top face from `rear` to `front` (world points), `t` thick below the face, rounded ends. */
export function polyPad(rear, front, t, { cls = 'eq', z = 'center', part } = {}) {
  const u = norm(sub(front, rear)), dn = across(u);   // dn: from the top face into the pad (down for a pad along +z)
  const r = t / 2, L = Math.hypot(...sub(front, rear));
  const at = (s, d) => add(add(rear, mul(u, s)), mul(dn, d));
  const arc = (s0, sgn) => Array.from({ length: 5 }, (_, i) => {   // half circle round the pad end, centre at depth r
    const a = Math.PI / 2 - (Math.PI * (i + 1)) / 6;
    return at(s0 + sgn * r * Math.cos(a), r - r * Math.sin(a));
  });
  const pts = [at(r, 0), at(L - r, 0), ...arc(L - r, 1), at(L - r, t), at(r, t), ...arc(r, -1).reverse()];
  return { type: 'poly', pts, cls, z, ...(part ? { part } : {}) };
}
