/**
 * The live heart line (owner's pick "E, layered trace"): a thin heartbeat trace across the top
 * of the screen, a sharp line over a blurred copy with a faint echo behind (no beating edge:
 * the owner asked for the trace only). `HeartBpm` is the number beside it; both share one beat clock through
 * the `--pulse-beat` CSS variable. Colours come from the theme's `--accent`, so all five themes
 * follow. Under reduced motion the trace is drawn once and nothing beats.
 */
import { useEffect, useRef } from 'preact/hooks';

/** One heartbeat over phase 0..1: P bump, QRS spike, T wave. */
const g = (x: number, m: number, s: number) => Math.exp(-((x - m) ** 2) / (2 * s * s));
export const ecg = (t: number): number => 0.12 * g(t, 0.18, 0.025) - 0.14 * g(t, 0.3, 0.008) + g(t, 0.33, 0.009) - 0.28 * g(t, 0.36, 0.01) + 0.24 * g(t, 0.56, 0.04);
/** Glow envelope: rises into the R wave, decays after it. */
export const beatEnvelope = (t: number): number => (t < 0.33 ? g(t, 0.33, 0.02) : Math.exp(-(t - 0.33) / 0.16));

const PERIOD_PX = 118;
const reducedMotion = (): boolean => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };

function accent(): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  return v || '#5e6ad2';
}

function traceTo(x: CanvasRenderingContext2D, w: number, base: number, amp: number, offBeats: number): void {
  x.beginPath();
  for (let px = 0; px <= w; px++) {
    const b = px / PERIOD_PX + offBeats;
    const y = base - ecg(((b % 1) + 1) % 1) * amp;
    if (px) x.lineTo(px, y); else x.moveTo(px, y);
  }
}

export function PulseLine({ bpm }: { bpm: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const bpmRef = useRef(bpm);
  bpmRef.current = bpm;
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const x = c.getContext('2d');
    if (!x) return;
    const reduce = reducedMotion();
    let w = 0, h = 0, raf = 0, color = accent(), colorAt = 0;
    const size = () => {
      const r = c.getBoundingClientRect(), d = window.devicePixelRatio || 1;
      w = r.width; h = r.height; c.width = Math.max(1, w * d); c.height = Math.max(1, h * d);
      x.setTransform(d, 0, 0, d, 0, 0);
    };
    size();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(size) : null;
    ro?.observe(c);
    const root = document.documentElement;
    const frame = (now: number) => {
      if (now - colorAt > 1000) { color = accent(); colorAt = now; }
      const beats = reduce ? 0 : now / 1000 / (60 / Math.max(30, bpmRef.current));
      root.style.setProperty('--pulse-beat', reduce ? '0' : Math.min(1, beatEnvelope(beats % 1)).toFixed(3));
      x.clearRect(0, 0, w, h);
      const base = h * 0.45, amp = h * 0.34;
      x.globalAlpha = 0.18; traceTo(x, w, base + 2, amp * 0.7, beats - 0.12); x.strokeStyle = color; x.lineWidth = 1; x.stroke();
      x.globalAlpha = 0.35; x.filter = 'blur(3px)'; traceTo(x, w, base, amp, beats); x.lineWidth = 4; x.stroke(); x.filter = 'none';
      x.globalAlpha = 1;
      const fade = x.createLinearGradient(0, 0, w, 0);
      fade.addColorStop(0, 'transparent'); fade.addColorStop(0.15, color); fade.addColorStop(0.85, color); fade.addColorStop(1, 'transparent');
      traceTo(x, w, base, amp, beats); x.strokeStyle = fade; x.lineWidth = 1.3; x.shadowColor = color; x.shadowBlur = 5; x.stroke(); x.shadowBlur = 0;
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro?.disconnect(); root.style.removeProperty('--pulse-beat'); };
  }, []);
  return (
    <div class="pulse-line" aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  );
}

/** The heart-rate number with a heart that beats in time with the line. */
export function HeartBpm({ bpm }: { bpm: number }) {
  return (
    <span class="heart-bpm" role="status" aria-label={`Heart rate ${bpm} beats a minute`}>
      <svg class="heart-bpm-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /></svg>
      <span class="heart-bpm-n">{bpm}</span>
    </span>
  );
}
