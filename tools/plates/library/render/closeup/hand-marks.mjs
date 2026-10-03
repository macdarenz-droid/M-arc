// LIB-6: named hand-drawing options, moved verbatim from golden B's howto/render-pull_up.mjs (same arithmetic, same
// order): `stripLoad` (no force line for a load across the hand), finger-base marks, the hook thumb.
import { handGeometry } from '../../../layers/engine/hand.mjs';
import { f } from './common.mjs';

// 5.1: the force line is drawn only for 'along-forearm' loads: drop the load line, its head, the contact dot and the
// wrist tick; the dashed forearm datum and the bend arc stay.
export const stripLoad = svg => svg.replace(/<path class="h-load[^"]*"[^>]*\/>/g, '').replace(/<path class="h-load-head[^"]*"[^>]*\/>/g, '')
  .replace(/<circle class="h-contact[^"]*"[^>]*\/>/g, '').replace(/<path class="h-tick"[^>]*\/>/g, '');

// Finger-base line: a faint dashed line across the hand at the knuckle line (the base of the fingers), at the same
// place in both halves, with a small label in the Right half. The hand frame is the engine's: wrist centre at the
// origin (the drawn wrist joint), u toward the fingers, v toward the back of the hand; screen U, V as makeProj.
export function fingerBaseMarks(svg, k, poseR, poseW) {
  const wr = [...svg.matchAll(/h-joint wrist" cx="([\d.]+)" cy="([\d.]+)"/g)].map(m => [+m[1], +m[2]]);
  const one = (pose, W, label) => {
    const g = handGeometry(pose), th = pose.forearm * Math.PI / 180, U = [Math.sin(th), Math.cos(th)], V = [U[1], -U[0]];
    const Hh = p => { const q = g.toF(p); return [W[0] + k * (q[0] * U[0] + q[1] * V[0]), W[1] + k * (q[0] * U[1] + q[1] * V[1])]; };
    const u = g.mcpI[0], a = Hh([u, 13 * g.s]), b = Hh([u, -14.5 * g.s - 2 * g.R - 14 * g.s]);
    let out = `<path class="h-base" d="M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}"/>`;
    if (label) out += `<text class="h-base-t" x="${f(a[0] - 3)}" y="${f(a[1] - 2)}" text-anchor="end"><tspan x="${f(a[0] - 3)}">FINGER</tspan><tspan x="${f(a[0] - 3)}" dy="10">BASE</tspan></text>`;
    return out;
  };
  return one(poseR, wr[0], true) + one(poseW, wr[1], false);
}

// Hook thumb (thumb page only). The engine aims a hook thumb at the index finger's middle segment, where the index
// covers it completely. In a hook grip the thumb wraps round the bar first and the fingers close over it: its two
// visible segments are re-aimed with a 2-link reach from the engine's own metacarpal end so the tip hugs the bar at
// `tipAngle` (degrees from the finger direction toward the back of the hand) and lies under the index finger's first
// segment. Segment lengths and thicknesses are the engine's. Drawn with the engine's thumb classes.
export function hookThumb(pose, svg, k, uid, tipAngle = 15) {
  const g = handGeometry(pose), R = Math.PI / 180, th = pose.forearm * R, U = [Math.sin(th), Math.cos(th)], V = [U[1], -U[0]];
  const W = svg.match(/h-joint wrist" cx="([\d.]+)" cy="([\d.]+)"/).slice(1).map(Number);
  const Hh = p => { const q = g.toF(p); return [W[0] + k * (q[0] * U[0] + q[1] * V[0]), W[1] + k * (q[0] * U[1] + q[1] * V[1])]; };
  const ts = g.tsegs, mc = g.thumb.pts[1], c = g.circle.c, l1 = ts[1].L, l2 = ts[2].L;
  const T = [c[0] + (g.R + ts[2].t * 0.9) * Math.cos(tipAngle * R), c[1] + (g.R + ts[2].t * 0.9) * Math.sin(tipAngle * R)];
  const dx = T[0] - mc[0], dy = T[1] - mc[1], d = Math.min(Math.hypot(dx, dy), l1 + l2 - 0.01), a0 = Math.atan2(dy, dx);
  const a = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
  const ips = [a0 + a, a0 - a].map(x => [mc[0] + l1 * Math.cos(x), mc[1] + l1 * Math.sin(x)]);
  const ip = ips.sort((p, q) => Math.hypot(q[0] - c[0], q[1] - c[1]) - Math.hypot(p[0] - c[0], p[1] - c[1]))[0];   // bends away from the bar
  const ta = Math.atan2(T[1] - ip[1], T[0] - ip[0]), tip = [ip[0] + l2 * Math.cos(ta), ip[1] + l2 * Math.sin(ta)];
  const capsule = (P, Q, r1, r2, n = 10) => { const dd = [Q[0] - P[0], Q[1] - P[1]], L = Math.hypot(...dd) || 1e-6, u = [dd[0] / L, dd[1] / L], nr = [-u[1], u[0]], ps = [];
    const ring = (C, r, b0, b1) => { for (let i = 0; i <= n; i++) { const b = b0 + (b1 - b0) * i / n; ps.push([C[0] + u[0] * Math.cos(b) * r + nr[0] * Math.sin(b) * r, C[1] + u[1] * Math.cos(b) * r + nr[1] * Math.sin(b) * r]); } };
    ring(Q, r2, Math.PI / 2, -Math.PI / 2); ring(P, r1, -Math.PI / 2, -3 * Math.PI / 2); return ps; };
  const polyD = ps => 'M' + ps.map(q => `${f(q[0])} ${f(q[1])}`).join('L') + 'Z';
  const defs = `<path id="${uid}-htpp" d="${polyD(capsule(mc, ip, ts[1].t, ts[2].t * 1.03).map(Hh))}"/><path id="${uid}-htdp" d="${polyD(capsule(ip, tip, ts[2].t, ts[2].t * 0.8).map(Hh))}"/>`;
  const uses = `<use href="#${uid}-htpp"/><use href="#${uid}-htdp"/>`;
  // base patch (fill only) where the thumb grows out of the thenar pad, as the engine's basePatch
  const A = Hh(mc), B = Hh(ip), ang = Math.atan2(B[1] - A[1], B[0] - A[0]), rp = ts[1].t * k + 1.4, pp = [];
  for (let i = 0; i <= 12; i++) { const b = ang + Math.PI / 2 + Math.PI * i / 12; pp.push([A[0] + Math.cos(b) * rp, A[1] + Math.sin(b) * rp]); }
  // nail on the outer side of the distal segment (away from the bar)
  const du = [tip[0] - ip[0], tip[1] - ip[1]], L = Math.hypot(...du), u = [du[0] / L, du[1] / L];
  let nn = [-u[1], u[0]]; const mid = [ip[0] + u[0] * L * 0.5, ip[1] + u[1] * L * 0.5];
  if (Math.hypot(mid[0] + nn[0] - c[0], mid[1] + nn[1] - c[1]) < Math.hypot(mid[0] - nn[0] - c[0], mid[1] - nn[1] - c[1])) nn = [-nn[0], -nn[1]];
  const at = (fu, fn) => Hh([ip[0] + u[0] * L * fu + nn[0] * ts[2].t * fn, ip[1] + u[1] * L * fu + nn[1] * ts[2].t * fn]);
  const nail = `M${at(0.42, 0.86).map(f).join(' ')}L${at(0.92, 0.65).map(f).join(' ')}M${at(0.42, 0.86).map(f).join(' ')}L${at(0.42, 0.45).map(f).join(' ')}`;
  const el = `<g class="h-thumb"><g class="u-stroke">${uses}</g><g class="u-fill">${uses}</g></g><path class="h-patch" d="${polyD(pp)}"/><path class="h-nail" d="${nail}"/>`;
  return { defs, el };
}
