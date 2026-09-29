// V1-09: the frame-rate readout for the owner's phone reading (DC0, D-FG7 (k); FORM-GUIDE-PRODUCTION.md §10.6). The
// player's own rAF loop hands every frame's timestamp to a FrameLog; a long-press on the stage opens a panel with the
// median and p95 frame time of the last play and a Stress toggle (an 80-path stand-in machine behind the figure in
// compare mode). Everything lives in memory for the open sheet: nothing is stored, sent or written anywhere.

/** The q-quantile (0..1) of a list, nearest rank; NaN when empty. */
export function quantile(xs: readonly number[], q: number): number {
  if (!xs.length) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.ceil(q * s.length) - 1))]!;
}

export type FrameStats = { frames: number; median: number; p95: number };

/** Frame intervals of one play: `start` clears, `tick` takes each rAF timestamp, `stats` reads the last play. */
export class FrameLog {
  private last = NaN;
  private dts: number[] = [];
  start() { this.last = NaN; this.dts = []; }
  /** A pause ends the interval chain, so the paused time is never counted as a frame. */
  gap() { this.last = NaN; }
  tick(t: number) {
    if (Number.isFinite(this.last) && t > this.last) this.dts.push(t - this.last);
    this.last = t;
  }
  stats(): FrameStats | null {
    return this.dts.length ? { frames: this.dts.length, median: quantile(this.dts, 0.5), p95: quantile(this.dts, 0.95) } : null;
  }
}

/** The panel's text for the stats of the last play. */
export function statsLine(s: FrameStats | null): string {
  if (!s) return 'Play once to measure.';
  const ms = (v: number) => `${v.toFixed(1)} ms`;
  return `Median ${ms(s.median)} (${Math.round(1000 / s.median)} fps) · p95 ${ms(s.p95)} · ${s.frames} frames`;
}

type Timers = { set: (fn: () => void, ms: number) => unknown; clear: (h: unknown) => void };
const WINDOW_TIMERS: Timers = { set: (fn, ms) => setTimeout(fn, ms), clear: h => clearTimeout(h as ReturnType<typeof setTimeout>) };
/** How long a press must be held to open the panel. */
export const LONG_PRESS_MS = 600;

/** A press held LONG_PRESS_MS without moving more than 10 px fires once; lifting, leaving or moving cancels it. */
export function longPress(onFire: () => void, timers: Timers = WINDOW_TIMERS) {
  let h: unknown = null, x = 0, y = 0;
  const cancel = () => { if (h !== null) { timers.clear(h); h = null; } };
  return {
    down: (e: { clientX: number; clientY: number }) => { cancel(); x = e.clientX; y = e.clientY; h = timers.set(() => { h = null; onFire(); }, LONG_PRESS_MS); },
    move: (e: { clientX: number; clientY: number }) => { if (h !== null && Math.hypot(e.clientX - x, e.clientY - y) > 10) cancel(); },
    up: cancel,
  };
}
