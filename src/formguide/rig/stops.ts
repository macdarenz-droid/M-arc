// Keyframe stops and the smoothness numbers, ported from the demo's shared rig (rig-final/gen.mjs: SAMPLES, smoothNumbers)
// and ../smooth-check.cjs (phaseStats, stopJerk, check (d)) at DEMO_COMMIT. Pure, no DOM.
import { n4 } from './math';

/** Stop spacing in percent of the rep: the lift (0-25 %) and the return (37.5-87.5 %). The demo uses 0.25 and 0.5. */
export type StopSpec = { lift: number; return: number };
export const DEMO_STOPS: StopSpec = { lift: 0.25, return: 0.5 };

/** The stops in percent: every `lift` % in the lift, every `return` % in the return, the holds at their boundaries only. */
export function stopsFor(s: StopSpec = DEMO_STOPS): number[] {
  const out: number[] = [];
  for (let i = 0; i <= Math.round(25 / s.lift); i++) out.push(i * s.lift);
  for (let i = 0; i <= Math.round(50 / s.return); i++) out.push(37.5 + i * s.return);
  out.push(100);
  return out;
}
/** SAMPLES of rig-final/gen.mjs: 203 stops. */
export const SAMPLES = stopsFor();

/** smooth-check.cjs LIM */
export const LIM = { a: 0.01, b: 0.08, c: 3, d: 4, travel: 10 } as const;
export const PHASES: [string, number, number][] = [['lift', 0, 0.25], ['return', 0.375, 0.875]];

export type Smooth = { a: number; b: number; c: number };
/**
 * rig-final/gen.mjs smoothNumbers: stops rounded as written (n4), drawn linearly between stops, sampled every 1/480 of
 * the rep. at(u) -> pose at rep fraction u; angles: the pose keys; grip: pose -> [x, y].
 */
export function smoothNumbers<Q>(at: (u: number) => Q, angles: string[], grip: (q: Q) => number[], stops: number[] = SAMPLES): Smooth {
  const st = stops.map(pc => ({ u: pc / 100, q: at(pc / 100) }));
  const val = (k: string, q: Q): number[] => (k === 'grip' ? grip(q).map(v => +n4(v)) : [+n4((q as Record<string, number>)[k]!)]);
  const lerp = (k: string, u: number) => { let i = 0; while (i < st.length - 2 && st[i + 1]!.u < u) i++; const t = (u - st[i]!.u) / (st[i + 1]!.u - st[i]!.u), a = val(k, st[i]!.q), b = val(k, st[i + 1]!.q); return a.map((v, j) => v + (b[j]! - v) * t); };
  let b = 0, c = 0, a = 0;
  for (const [u0, u1] of [[0, 0.25], [0.375, 0.875]] as const) {
    for (const k of [...angles, 'grip']) {
      const smp: number[][] = []; for (let i = Math.round(u0 * 480); i <= Math.round(u1 * 480); i++) smp.push(lerp(k, i / 480));
      const vel = smp.slice(1).map((v, i) => v.map((x, j) => (x - smp[i]![j]!) * 120));
      const mag = (v: number[]) => Math.hypot(...v), peak = Math.max(...vel.map(mag));
      a = Math.max(a, mag(vel[0]!) / peak, mag(vel[vel.length - 1]!) / peak);
      for (let i = 1; i < vel.length; i++) b = Math.max(b, mag(vel[i]!.map((x, j) => x - vel[i - 1]![j]!)) / peak);
      if (k === 'grip') continue;
      const s = st.filter(x => x.u >= u0 - 1e-9 && x.u <= u1 + 1e-9).map(x => [x.u * 4, val(k, x.q)[0]!] as const);
      const vv: number[] = [], tm: number[] = []; for (let i = 1; i < s.length; i++) { vv.push((s[i]![1] - s[i - 1]![1]) / (s[i]![0] - s[i - 1]![0])); tm.push((s[i]![0] + s[i - 1]![0]) / 2); }
      const acc: number[] = []; for (let i = 1; i < vv.length; i++) acc.push((vv[i]! - vv[i - 1]!) / (tm[i]! - tm[i - 1]!));
      const jk: number[] = []; for (let i = 1; i < acc.length; i++) jk.push(Math.abs(acc[i]! - acc[i - 1]!));
      c = Math.max(c, Math.max(...jk) / median(jk));
    }
  }
  return { a, b, c };
}
export const median = (xs: number[]): number => { const srt = [...xs].sort((x, y) => x - y); return srt.length % 2 ? srt[(srt.length - 1) / 2]! : (srt[srt.length / 2 - 1]! + srt[srt.length / 2]!) / 2; };

// ---- smooth-check.cjs on written stops (what the browser draws), for any rotate channel -------------------------------
const N = 480, REP = 4, DT = REP / N;
/** the value a channel draws at u: linear between the written stops (as a CSS or WAAPI linear keyframe list) */
export function drawnAt(stops: readonly (readonly [number, number])[], u: number): number {
  let i = 0; while (i < stops.length - 2 && stops[i + 1]![0] <= u) i++;
  const [u0, v0] = stops[i]!, [u1, v1] = stops[i + 1]!;
  return u1 === u0 ? v1 : v0 + (v1 - v0) * Math.min(1, Math.max(0, (u - u0) / (u1 - u0)));
}
export function phaseStats(samples: number[], i0: number, i1: number) {
  const vel: number[] = []; for (let i = i0; i < i1; i++) vel.push((samples[i + 1]! - samples[i]!) / DT);
  const peak = Math.max(...vel.map(Math.abs));
  let jump = 0; for (let i = 1; i < vel.length; i++) jump = Math.max(jump, Math.abs(vel[i]! - vel[i - 1]!));
  const seg = samples.slice(i0, i1 + 1);
  return { edge: peak ? Math.max(Math.abs(vel[0]!), Math.abs(vel[vel.length - 1]!)) / peak : 0, jump: peak ? jump / peak : 0, travel: Math.max(...seg) - Math.min(...seg) };
}
export function stopJerk(stops: readonly (readonly [number, number])[], a: number, b: number): number {
  const s = stops.filter(([u]) => u >= a - 1e-9 && u <= b + 1e-9).map(([u, v]) => [u * REP, v] as const);
  const vv: number[] = [], tm: number[] = [];
  for (let i = 1; i < s.length; i++) { const dt = s[i]![0] - s[i - 1]![0]; if (dt <= 0) continue; vv.push((s[i]![1] - s[i - 1]![1]) / dt); tm.push((s[i]![0] + s[i - 1]![0]) / 2); }
  const acc: number[] = []; for (let i = 1; i < vv.length; i++) acc.push((vv[i]! - vv[i - 1]!) / (tm[i]! - tm[i - 1]!));
  const jk: number[] = []; for (let i = 1; i < acc.length; i++) jk.push(Math.abs(acc[i]! - acc[i - 1]!));
  if (jk.length < 3) return Infinity;
  const med = median(jk);
  return med > 0 ? Math.max(...jk) / med : Infinity;
}
export type ChannelCheck = { name: string; travel: number; a: number; b: number; c: number | null; d: number };
/**
 * smooth-check.cjs checks (a)-(d) for rotate channels given as written stops [u, degrees]: (a) edge speed, (b) velocity
 * step and (c) stop jerk for angles moving 10 degrees or more in a phase (D-S1/D-S2), (d) the largest step per 1/120 s.
 */
export function checkChannels(chans: { name: string; stops: [number, number][] }[]): { rows: ChannelCheck[]; a: number; b: number; c: number; d: number } {
  const rows: ChannelCheck[] = [];
  let A = 0, B = 0, C = 0, D = 0;
  for (const ch of chans) {
    const smp = Array.from({ length: N + 1 }, (_, i) => drawnAt(ch.stops, i / N));
    let d = 0; for (let i = 0; i < N; i++) d = Math.max(d, Math.abs(smp[i + 1]! - smp[i]!));
    D = Math.max(D, d);
    for (const [, u0, u1] of PHASES) {
      const s = phaseStats(smp, Math.round(u0 * N), Math.round(u1 * N)), gate = s.travel >= LIM.travel;
      const c = gate ? stopJerk(ch.stops, u0, u1) : null;
      rows.push({ name: ch.name, travel: s.travel, a: s.edge, b: s.jump, c, d });
      if (gate) { A = Math.max(A, s.edge); B = Math.max(B, s.jump); C = Math.max(C, c!); }
    }
  }
  return { rows, a: A, b: B, c: C, d: D };
}
