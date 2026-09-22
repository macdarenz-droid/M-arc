/** A small trend line (moved from History so Escobar's lazy chunk doesn't pull in History, §4.4). */
export function Sparkline({ points }: { points: number[] }) {
  if (points.length < 2) return null;
  const min = Math.min(...points), max = Math.max(...points);
  const w = 300, h = 56, pad = 4;
  const x = (i: number) => pad + (i / (points.length - 1)) * (w - pad * 2);
  const y = (v: number) => h - pad - ((v - min) / Math.max(1e-6, max - min)) * (h - pad * 2);
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p).toFixed(1)}`).join(' ');
  return <svg class="sparkline" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true"><path d={d} fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" /><circle cx={x(points.length - 1)} cy={y(points[points.length - 1]!)} r="3" fill="var(--accent)" /></svg>;
}
