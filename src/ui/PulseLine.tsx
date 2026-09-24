/**
 * The live heart pulse (owner's pick "F, edge only"): no trace, just the top edge of the screen
 * brightening in time with the heart, and `HeartBpm` (heart + number) beating with it. Both read
 * one beat clock through the `--pulse-beat` CSS variable. Colours come from the theme's
 * `--accent`, so all five themes follow. Under reduced motion nothing beats.
 */
import { useEffect, useRef } from 'preact/hooks';

const g = (x: number, m: number, s: number) => Math.exp(-((x - m) ** 2) / (2 * s * s));
/** Glow envelope: rises into the R wave, decays after it. */
export const beatEnvelope = (t: number): number => (t < 0.33 ? g(t, 0.33, 0.02) : Math.exp(-(t - 0.33) / 0.16));

const reducedMotion = (): boolean => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };

export function PulseLine({ bpm }: { bpm: number }) {
  const bpmRef = useRef(bpm);
  bpmRef.current = bpm;
  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion()) { root.style.setProperty('--pulse-beat', '0'); return () => root.style.removeProperty('--pulse-beat'); }
    let raf = 0;
    const frame = (now: number) => {
      const beats = now / 1000 / (60 / Math.max(30, bpmRef.current));
      root.style.setProperty('--pulse-beat', Math.min(1, beatEnvelope(beats % 1)).toFixed(3));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); root.style.removeProperty('--pulse-beat'); };
  }, []);
  return <div class="pulse-line" aria-hidden="true"><div class="pulse-edge" /></div>;
}

/** The heart-rate number with a heart that beats in time with the edge. */
export function HeartBpm({ bpm }: { bpm: number }) {
  return (
    <span class="heart-bpm" role="img" aria-label={`Heart rate ${bpm} beats a minute`}>
      <svg class="heart-bpm-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /></svg>
      <span class="heart-bpm-n">{bpm}</span>
    </span>
  );
}
