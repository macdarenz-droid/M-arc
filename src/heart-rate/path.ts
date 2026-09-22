/**
 * Geometry for the live trace. Pure, so the shape rules are testable without
 * a DOM.
 *
 * Two decisions here are about honesty, not looks:
 *
 * - The y-axis has a floor. Auto-scaling to the window's own range meant that
 *   at rest, where the pulse wobbles between 72 and 73, one bpm filled the
 *   whole chart height and a still heart drew a square wave.
 * - The curve is monotone cubic, whose tangents are clamped against the
 *   neighbouring slopes. It bends between readings but cannot rise above the
 *   highest reading it passes through or fall below the lowest, so it never
 *   draws a peak that was not measured.
 */

/** Below this, the window is padded around its midpoint rather than stretched. */
export const MIN_SPAN_BPM = 20;

export interface TraceGeometry {
  /** The curve through the readings, with a break at every signal gap. */
  line: string;
  /** The same curve closed to the baseline, one subpath per segment. */
  area: string;
  /** The newest reading's position, or null when the signal is not live. */
  tip: { x: number; y: number } | null;
  low: number;
  high: number;
}

export interface TraceSegment { t: number; bpm: number }

export interface TraceOptions {
  width: number;
  height: number;
  padding: number;
  /** Local window, in epoch milliseconds. */
  from: number;
  to: number;
  /** A reading older than this does not get a live tip marker. */
  liveWithinMs: number;
}

/**
 * Monotone cubic interpolation (Fritsch–Carlson). Straight lines for fewer
 * than three points, where there is no curve to constrain.
 */
export function monotonePath(points: Array<{ x: number; y: number }>): string {
  const n = points.length;
  if (n === 0) return '';
  if (n < 3) return points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');

  const dx: number[] = [], slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = points[i + 1]!.x - points[i]!.x;
    slope[i] = dx[i] ? (points[i + 1]!.y - points[i]!.y) / dx[i]! : 0;
  }
  const m: number[] = [slope[0]!];
  for (let i = 1; i < n - 1; i++) {
    // A sign change is a local extreme: flatten the tangent so the curve turns
    // at the reading rather than swinging past it.
    if (slope[i - 1]! * slope[i]! <= 0) { m[i] = 0; continue; }
    const w1 = 2 * dx[i]! + dx[i - 1]!, w2 = dx[i]! + 2 * dx[i - 1]!;
    m[i] = (w1 + w2) / (w1 / slope[i - 1]! + w2 / slope[i]!);
  }
  m[n - 1] = slope[n - 2]!;

  let d = `M${points[0]!.x.toFixed(2)},${points[0]!.y.toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const c = dx[i]! / 3;
    const p = points[i]!, q = points[i + 1]!;
    d += ` C${(p.x + c).toFixed(2)},${(p.y + c * m[i]!).toFixed(2)}`
      + ` ${(q.x - c).toFixed(2)},${(q.y - c * m[i + 1]!).toFixed(2)}`
      + ` ${q.x.toFixed(2)},${q.y.toFixed(2)}`;
  }
  return d;
}

/**
 * Build the drawable geometry from already-segmented readings. Each segment is
 * one unbroken run of signal; the caller splits them, and this never joins two.
 */
export function traceGeometry(segments: TraceSegment[][], options: TraceOptions): TraceGeometry {
  const { width, height, padding, from, to, liveWithinMs } = options;
  const all = segments.flat();
  if (!all.length) return { line: '', area: '', tip: null, low: 0, high: 0 };

  let low = Infinity, high = -Infinity;
  for (const s of all) { if (s.bpm < low) low = s.bpm; if (s.bpm > high) high = s.bpm; }

  // Pad a narrow window around its own midpoint, so a steady pulse looks steady.
  const measured = high - low;
  const span = Math.max(MIN_SPAN_BPM, measured);
  const mid = (high + low) / 2;
  const floor = measured >= MIN_SPAN_BPM ? low : mid - span / 2;

  const range = Math.max(1, to - from);
  const x = (t: number) => padding + ((t - from) / range) * (width - padding * 2);
  const y = (bpm: number) => height - padding - ((bpm - floor) / span) * (height - padding * 2);

  const lines: string[] = [], areas: string[] = [];
  for (const segment of segments) {
    if (segment.length < 2) continue;
    const points = segment.map(s => ({ x: x(s.t), y: y(s.bpm) }));
    const d = monotonePath(points);
    lines.push(d);
    // Closed to the bottom edge of the box, not to zero bpm — the fill shows
    // the shape of the window, and the card never claims a zero baseline.
    areas.push(`${d} L${points[points.length - 1]!.x.toFixed(2)},${height} L${points[0]!.x.toFixed(2)},${height} Z`);
  }

  const lastSegment = segments[segments.length - 1];
  const newest = lastSegment?.[lastSegment.length - 1];
  const live = !!newest && to - newest.t <= liveWithinMs;
  return {
    line: lines.join(' '),
    area: areas.join(' '),
    tip: live && newest ? { x: x(newest.t), y: y(newest.bpm) } : null,
    low, high,
  };
}
