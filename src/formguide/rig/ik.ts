// FG-1: two-bone solve, ported from GU-7a (PR #40, src/formguide/rig/math.ts solve3 and its vector helpers, which
// were ported verbatim from the demo's rig-final/gen.mjs). Used when a machine or cable drives the movement: the
// equipment path is the source and the arm or leg chain is solved to it (§3). Pure, no DOM.

export type Vec = number[];
export type Pt = [number, number];

export const deg = (r: number): number => (r * 180) / Math.PI;
export const norm = (v: Vec): Vec => { const l = Math.hypot(...v); return v.map(x => x / l); };
export const sub = (a: Vec, b: Vec): Vec => a.map((x, i) => x - b[i]!);
export const add = (a: Vec, b: Vec): Vec => a.map((x, i) => x + b[i]!);
export const mul = (a: Vec, k: number): Vec => a.map(x => x * k);
export const dot = (a: Vec, b: Vec): number => a.reduce((s, x, i) => s + x * b[i]!, 0);

export type Solve = { E: Vec; fu: number; ff: number; phi: number; psi: number; inside: number; outFromSide: number; forward: number };
/** 2-bone solve in 3D with a pole vector (GU-7a solve3, unchanged). S shoulder, G grip (x, y, z), z = distance out to the
 * lifter's side. Returns the elbow and the projected (drawn) lengths fu, ff, plus side-view angles. */
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

/**
 * The planar case, for a drawn view: solve3 in the drawing plane with the pole on one side of the S→G line.
 * bend +1 puts the joint on the left of S→G (screen coordinates, y down), -1 on the right. Throws when out of reach.
 */
export function solve2(S: Pt, G: Pt, a: number, b: number, bend: 1 | -1): Pt {
  const dx = G[0] - S[0], dy = G[1] - S[1];
  const pole = [dy * bend, -dx * bend, 0];
  const E = solve3([S[0], S[1], 0], [G[0], G[1], 0], a, b, pole).E;
  return [E[0]!, E[1]!];
}
