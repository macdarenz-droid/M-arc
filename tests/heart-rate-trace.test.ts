/**
 * The live trace's geometry. Two of these are honesty rules rather than
 * styling: the curve may not draw a reading that was not taken, and a steady
 * pulse may not be magnified into a dramatic one.
 */
import { describe, it, expect } from 'vitest';
import { monotonePath, traceGeometry, MIN_SPAN_BPM, type TraceSegment } from '@/heart-rate/path';

const BOX = { width: 320, height: 76, padding: 6, liveWithinMs: 5_000 };
const T0 = Date.parse('2026-09-22T10:00:00.000Z');
const run = (bpms: number[], startAt = T0, stepMs = 1_000): TraceSegment[] =>
  bpms.map((bpm, i) => ({ t: startAt + i * stepMs, bpm }));

/** Every y the path visits, sampled densely enough to catch an overshoot. */
function sampleCurve(d: string): number[] {
  const ys: number[] = [];
  // Cubic segments: C c1x,c1y c2x,c2y x,y — evaluate each at 24 points.
  const nums = d.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
  let i = 0;
  let cur = { x: nums[i++]!, y: nums[i++]! };
  ys.push(cur.y);
  while (i + 5 < nums.length + 1 && i + 5 <= nums.length) {
    const c1 = { x: nums[i++]!, y: nums[i++]! };
    const c2 = { x: nums[i++]!, y: nums[i++]! };
    const end = { x: nums[i++]!, y: nums[i++]! };
    for (let s = 1; s <= 24; s++) {
      const t = s / 24, u = 1 - t;
      ys.push(u * u * u * cur.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * end.y);
    }
    cur = end;
  }
  return ys;
}

describe('monotonePath', () => {
  it('passes through every point it is given', () => {
    const pts = [{ x: 0, y: 10 }, { x: 10, y: 40 }, { x: 20, y: 20 }, { x: 30, y: 50 }];
    const d = monotonePath(pts);
    for (const p of pts) expect(d).toContain(`${p.x.toFixed(2)},${p.y.toFixed(2)}`);
  });

  /**
   * The property that makes smoothing safe here. A plain cubic through the same
   * points bulges past the extremes and draws peaks that were never recorded.
   */
  it('never travels above the highest point or below the lowest', () => {
    const pts = [
      { x: 0, y: 60 }, { x: 8, y: 58 }, { x: 16, y: 20 },
      { x: 24, y: 19 }, { x: 32, y: 55 }, { x: 40, y: 56 },
    ];
    const ys = sampleCurve(monotonePath(pts));
    const low = Math.min(...pts.map(p => p.y)), high = Math.max(...pts.map(p => p.y));
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(low - 0.001);
    expect(Math.max(...ys)).toBeLessThanOrEqual(high + 0.001);
  });

  it('stays flat through a flat run rather than rippling', () => {
    const pts = [{ x: 0, y: 30 }, { x: 10, y: 30 }, { x: 20, y: 30 }, { x: 30, y: 30 }];
    const ys = sampleCurve(monotonePath(pts));
    for (const y of ys) expect(Math.abs(y - 30)).toBeLessThan(0.001);
  });

  it('draws a straight segment for two points and nothing for none', () => {
    expect(monotonePath([])).toBe('');
    expect(monotonePath([{ x: 0, y: 1 }, { x: 5, y: 9 }])).toBe('M0.00,1.00 L5.00,9.00');
  });
});

describe('traceGeometry', () => {
  const opts = (segments: TraceSegment[][]) => {
    const all = segments.flat();
    return { ...BOX, from: all[0]!.t, to: all[all.length - 1]!.t };
  };

  /**
   * Auto-scaling to the window's own range meant a pulse resting between 72 and
   * 73 filled the whole chart height — a still heart drawing a square wave.
   */
  it('does not magnify a steady pulse into a dramatic one', () => {
    const steady = [run([72, 73, 72, 73, 72, 73])];
    const g = traceGeometry(steady, opts(steady));
    const ys = sampleCurve(g.line);
    const drawn = Math.max(...ys) - Math.min(...ys);
    const usable = BOX.height - BOX.padding * 2;
    // One bpm of a 20 bpm floor is about 5% of the box, not 100% of it.
    expect(drawn).toBeLessThan(usable * 0.1);
  });

  it('centres a narrow window instead of pinning it to the floor', () => {
    const steady = [run([72, 73, 72])];
    const g = traceGeometry(steady, opts(steady));
    const ys = sampleCurve(g.line);
    const centre = BOX.height / 2;
    expect(Math.abs((Math.max(...ys) + Math.min(...ys)) / 2 - centre)).toBeLessThan(3);
  });

  it('uses the real range once it exceeds the floor', () => {
    const wide = [run([70, 90, 120, 145])];
    const g = traceGeometry(wide, opts(wide));
    expect(g.low).toBe(70);
    expect(g.high).toBe(145);
    const ys = sampleCurve(g.line);
    // A genuine 75 bpm swing should fill most of the box.
    expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThan((BOX.height - BOX.padding * 2) * 0.9);
  });

  it('reports the window high and low from the readings, not the drawing', () => {
    const s = [run([80, 96, 74, 88])];
    const g = traceGeometry(s, opts(s));
    expect(g.low).toBe(74);
    expect(g.high).toBe(96);
  });

  /** The rule the whole feature rests on: a gap is never drawn through. */
  it('starts a new subpath at every signal gap, in the line and the fill alike', () => {
    const before = run([80, 82, 84]);
    const after = run([120, 122, 124], T0 + 40_000);
    const g = traceGeometry([before, after], { ...BOX, from: T0, to: T0 + 42_000 });
    expect(g.line.match(/M/g)).toHaveLength(2);
    expect(g.area.match(/Z/g)).toHaveLength(2);
  });

  it('marks the newest reading when the signal is live', () => {
    const s = [run([80, 90, 100])];
    const g = traceGeometry(s, opts(s));
    expect(g.tip).not.toBeNull();
    // Newest reading sits at the right edge of the window.
    expect(g.tip!.x).toBeCloseTo(BOX.width - BOX.padding, 1);
  });

  it('drops the marker once the reading is stale, so nothing pulses over dead data', () => {
    const s = [run([80, 90, 100])];
    const all = s.flat();
    const g = traceGeometry(s, { ...BOX, from: all[0]!.t, to: all[all.length - 1]!.t + 30_000 });
    expect(g.tip).toBeNull();
  });

  it('returns empty geometry rather than throwing on no readings', () => {
    const g = traceGeometry([], { ...BOX, from: T0, to: T0 + 1_000 });
    expect(g).toEqual({ line: '', area: '', tip: null, low: 0, high: 0 });
  });

  it('skips a lone reading, which has no shape to draw', () => {
    const g = traceGeometry([run([88])], { ...BOX, from: T0, to: T0 + 1_000 });
    expect(g.line).toBe('');
  });

  it('closes the fill to the box floor, never to a zero-bpm baseline', () => {
    const s = [run([70, 140])];
    const g = traceGeometry(s, opts(s));
    expect(g.area).toContain(`,${BOX.height}`);
  });

  it('exposes the floor it enforces', () => {
    expect(MIN_SPAN_BPM).toBe(20);
  });
});
