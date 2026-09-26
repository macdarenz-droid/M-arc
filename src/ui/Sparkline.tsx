/** A small trend line (moved from History so Escobar's lazy chunk doesn't pull in History, §4.4). */
import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import { formatDay } from '@/core/dates';

const fmt = (v: number): string => String(Math.round(v * 10) / 10);

/**
 * `height`/`labels` are optional so Escobar's static 56px chart (no labels) is unaffected.
 * History passes `height={96} labels dates={...}`.
 */
export function Sparkline({ points, dates, height = 56, labels = false }: { points: number[]; dates?: string[]; height?: number; labels?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  // I12: read the real pixel width before paint, so the viewBox never scales non-uniformly (the
  // old preserveAspectRatio="none" stretched the end dot into an ellipse on any width but 300).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    setW(el.clientWidth);
    const ro = new ResizeObserver(entries => { const cw = entries[0]?.contentRect.width; if (cw) setW(cw); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  if (points.length < 2) return null;
  const min = Math.min(...points), max = Math.max(...points);
  const vw = Math.max(1, w), pad = 6;
  const x = (i: number) => pad + (i / (points.length - 1)) * (vw - pad * 2);
  const y = (v: number) => height - pad - ((v - min) / Math.max(1e-6, max - min)) * (height - pad * 2);
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p).toFixed(1)}`).join(' ');
  const lastX = x(points.length - 1), lastY = y(points[points.length - 1]!);
  return (
    <div class="sparkline-wrap" ref={ref}>
      <svg class="sparkline" viewBox={`0 0 ${vw} ${height}`} style={{ height: `${height}px` }} aria-hidden="true">
        <path d={d} fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx={lastX} cy={lastY} r="6.5" fill="var(--accent-soft)" />
        <circle cx={lastX} cy={lastY} r="3.5" fill="var(--accent)" />
      </svg>
      {labels && (
        <>
          <div class="sparkline-minmax" style={{ height: `${height}px` }}>
            <span class="num" style={{ top: `${(y(max) / height) * 100}%` }}>{fmt(max)}</span>
            {max !== min && <span class="num" style={{ top: `${(y(min) / height) * 100}%` }}>{fmt(min)}</span>}
          </div>
          {dates && dates.length > 1 && (
            <div class="row-between sparkline-dates">
              <span>{formatDay(dates[0]!, { day: 'numeric', month: 'short' })}</span>
              <span>{formatDay(dates[dates.length - 1]!, { day: 'numeric', month: 'short' })}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
