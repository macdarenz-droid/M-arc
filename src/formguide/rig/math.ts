// Rig maths, ported verbatim from the demo's shared rig (docs/design/form-guide-demo/rig-final/gen.mjs at DEMO_COMMIT).
// Names and formulas are the demo's; only types are added. Pure, no DOM.

export type Pt = [number, number];
export type Vec = number[];

export const rad = (d: number): number => (d * Math.PI) / 180;
export const deg = (r: number): number => (r * 180) / Math.PI;
export const n2 = (v: number): string => { const s = (Math.round(v * 100) / 100).toString(); return s === '-0' ? '0' : s; };
export const n3 = (v: number): string => { const s = (Math.round(v * 1000) / 1000).toString(); return s === '-0' ? '0' : s; };
// keyframe values: angles and scales to 1e-4, so rounding never adds a kink the smoothness check (c) would see
export const n4 = (v: number): string => { const s = (Math.round(v * 10000) / 10000).toString(); return s === '-0' ? '0' : s; };
export const pts = (a: readonly Pt[]): string => a.map(([x, y]) => `${n2(x)},${n2(y)}`).join(' ');
export const tr = (a: readonly Pt[], dx: number, dy: number): Pt[] => a.map(([x, y]) => [x + dx, y + dy]);
export const mir = (a: readonly Pt[]): Pt[] => a.map(([x, y]) => [-x, y]);
export const oct = (cx: number, cy: number, r: number): Pt[] => Array.from({ length: 8 }, (_, i) => { const a = rad(i * 45 + 22.5); return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
export const hexv = (cx: number, cy: number, r: number, sy = 1): Pt[] => Array.from({ length: 6 }, (_, i) => { const a = rad(i * 60); return [cx + r * Math.cos(a), cy + r * sy * Math.sin(a)]; });
export const norm = (v: Vec): Vec => { const l = Math.hypot(...v); return v.map(x => x / l); };
export const sub = (a: Vec, b: Vec): Vec => a.map((x, i) => x - b[i]!);
export const add = (a: Vec, b: Vec): Vec => a.map((x, i) => x + b[i]!);
export const mul = (a: Vec, k: number): Vec => a.map(x => x * k);
export const dot = (a: Vec, b: Vec): number => a.reduce((s, x, i) => s + x * b[i]!, 0);
// Round joint caps: an n-gon (12 sides reads round at every size); half: the half facing dir (degrees, 0 = +x).
export const ngon = (cx: number, cy: number, r: number, n = 12, a0 = 15): Pt[] => Array.from({ length: n }, (_, i) => { const a = rad(a0 + (i * 360) / n); return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
export const half = (cx: number, cy: number, r: number, dir: number, n = 6): Pt[] => [...Array.from({ length: n + 1 }, (_, i): Pt => { const a = rad(dir - 90 + (i * 180) / n); return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; })];
// sym: a front-view shape given as its screen-right half, from a point on x = 0 round to a point on x = 0.
export const sym = (h: readonly Pt[]): Pt[] => [...h, ...mir(h.slice(1, -1)).reverse()];

// Timing (spec 2.5): 4 s rep; lift 0-25 %, hold to 37.5 %, return to 87.5 %, pause to 100 %.
// Each move follows the minimum-jerk profile p(x) = 10x^3 - 15x^4 + 6x^5.
export const minJerk = (x: number): number => x * x * x * (10 + x * (-15 + 6 * x));
export function progress(u: number): number { // u = fraction of one rep -> p (0 setup .. 1 end pose)
  if (u <= 0.25) return minJerk(u / 0.25);
  if (u <= 0.375) return 1;
  if (u <= 0.875) return 1 - minJerk((u - 0.375) / 0.5);
  return 0;
}
export const binom = (n: number, k: number): number => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
// Hand-path pace: a monotone Bernstein polynomial whose control points are the running sums of the weights w.
export function pace(w: readonly number[], p: number): number {
  const n = w.length, tot = w.reduce((a, b) => a + b, 0);
  let c = 0, s = 0;
  for (let k = 1; k <= n; k++) { c += w[k - 1]! / tot; s += c * binom(n, k) * p ** k * (1 - p) ** (n - k); }
  return s;
}
export const bern = (cp: readonly number[], t: number): number => { const n = cp.length - 1; let s = 0; for (let k = 0; k <= n; k++) s += cp[k]! * binom(n, k) * t ** k * (1 - t) ** (n - k); return s; };

export type Solve = { E: Vec; fu: number; ff: number; phi: number; psi: number; inside: number; outFromSide: number; forward: number };
// 2-bone solve in 3D with a pole vector. S shoulder, G grip (x, y, z), z = distance out to the lifter's side.
// Returns the elbow and the projected (drawn) lengths fu, ff, plus side-view angles.
export function solve3(S: Vec, G: Vec, a: number, b: number, pole: Vec): Solve {
  const D = sub(G, S), d = Math.hypot(...D);
  if (d > a + b || d < Math.abs(a - b)) throw new Error(`unreachable d=${d.toFixed(2)}`);
  const ax = mul(D, 1 / d), along = (a * a - b * b + d * d) / (2 * d), rc = Math.sqrt(Math.max(0, a * a - along * along));
  const perp = norm(sub(pole, mul(ax, dot(pole, ax))));
  const E = add(add(S, mul(ax, along)), mul(perp, rc));
  const fu = Math.hypot(E[0]! - S[0]!, E[1]! - S[1]!) / a, ff = Math.hypot(G[0]! - E[0]!, G[1]! - E[1]!) / b;
  const phi = deg(Math.atan2(E[0]! - S[0]!, E[1]! - S[1]!)), psi = deg(Math.atan2(G[0]! - E[0]!, G[1]! - E[1]!));
  const inside = deg(Math.acos(dot(sub(S, E), sub(G, E)) / (a * b)));
  const outFromSide = deg(Math.asin(Math.max(-1, Math.min(1, E[2]! / a))));
  const forward = deg(Math.atan2(E[0]! - S[0]!, E[1]! - S[1]!));
  return { E, fu, ff, phi, psi, inside, outFromSide, forward };
}
export const origin = (x: number, y: number): string => `transform-origin:${n2(x)}px ${n2(y)}px`;
