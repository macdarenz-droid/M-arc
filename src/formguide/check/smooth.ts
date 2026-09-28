// FG-3: smooth-check (a)-(d), ported from GU-7a (PR #40, rig/stops.ts phaseStats and stopJerk, themselves from the demo's
// smooth-check.cjs), with the sample step and phase windows taken from the file's tempo instead of a fixed 4 s rep.
// Scope as GU-7a's D-S1/D-S2: (a) and (b) for the grip and for angles moving 10° or more in the phase, (b) as the step
// in velocity (signed, or a vector for the grip), (c) for those angles, (d) for every angle over the whole rep.

/** smooth-check.cjs LIM: edge speed ≤ 1 % of the phase's top speed, velocity step ≤ 8 % of it, stop jerk ≤ 3× its
 * median, at most 4° per 1/120 s; (a)-(c) only for angles that travel 10° or more in the phase. */
export const LIM = { a: 0.01, b: 0.08, c: 3, d: 4, travel: 10 } as const;
/** Sample rate of the check: 1/120 s. */
export const HZ = 120;

export const median = (xs: number[]): number => { const s = [...xs].sort((x, y) => x - y); return s.length % 2 ? s[(s.length - 1) / 2]! : (s[s.length / 2 - 1]! + s[s.length / 2]!) / 2; };

/** Samples i0..i1 of one value (scalar) or point (vector) track, dt seconds apart: (a) edge speed and (b) the largest
 * velocity step, both over the phase's top speed, with the sample index of each; travel = the excursion. */
export function phaseStats(track: number[][], i0: number, i1: number, dt: number) {
  const vel: number[][] = [];
  for (let i = i0; i < i1; i++) vel.push(track[i + 1]!.map((v, k) => (v - track[i]![k]!) / dt));
  const mag = (v: number[]) => Math.hypot(...v), peak = Math.max(0, ...vel.map(mag));
  let jump = 0, at = i0;
  for (let i = 1; i < vel.length; i++) { const j = mag(vel[i]!.map((v, k) => v - vel[i - 1]![k]!)); if (j > jump) { jump = j; at = i0 + i; } }
  const e0 = mag(vel[0] ?? [0]), e1 = mag(vel[vel.length - 1] ?? [0]);
  // excursion: the range of a value, or the diagonal of a point's box
  const seg = track.slice(i0, i1 + 1), travel = Math.hypot(...seg[0]!.map((_, k) => Math.max(...seg.map(p => p[k]!)) - Math.min(...seg.map(p => p[k]!))));
  return { peak, edge: peak ? Math.max(e0, e1) / peak : 0, edgeAt: e0 >= e1 ? i0 : i1, jump: peak ? jump / peak : 0, jumpAt: at, travel };
}

/** (c) the largest change in acceleration between written stops over its median, stops in [a, b] (rep fractions). */
export function stopJerk(stops: readonly (readonly [number, number])[], a: number, b: number, repS: number): number {
  const s = stops.filter(([u]) => u >= a - 1e-9 && u <= b + 1e-9).map(([u, v]) => [u * repS, v] as const);
  const vv: number[] = [], tm: number[] = [];
  for (let i = 1; i < s.length; i++) { const dt = s[i]![0] - s[i - 1]![0]; if (dt <= 0) continue; vv.push((s[i]![1] - s[i - 1]![1]) / dt); tm.push((s[i]![0] + s[i - 1]![0]) / 2); }
  const acc: number[] = []; for (let i = 1; i < vv.length; i++) acc.push((vv[i]! - vv[i - 1]!) / (tm[i]! - tm[i - 1]!));
  const jk: number[] = []; for (let i = 1; i < acc.length; i++) jk.push(Math.abs(acc[i]! - acc[i - 1]!));
  if (jk.length < 3) return Infinity;
  const med = median(jk);
  return med > 0 ? Math.max(...jk) / med : Math.max(...jk) > 0 ? Infinity : 0;
}
