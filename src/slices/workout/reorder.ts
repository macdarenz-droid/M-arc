/**
 * Hold-and-drag reordering for the live session's exercise list (owner request). Hold an
 * exercise for a moment, then drag it up or down; the others slide out of the way and it drops
 * into place on release. It only moves things: no selection state, no highlight, and it never
 * starts from inputs or buttons, so logging sets is untouched. A short move before the hold
 * ends is treated as a scroll.
 */
import { useRef, useState } from 'preact/hooks';
import { haptic } from '@/native/haptics';

const HOLD_MS = 320;
const SLOP_PX = 8;

interface Drag { from: number; to: number; dy: number; tops: number[]; heights: number[]; step: number }

export function useReorder(onMove: (from: number, to: number) => void) {
  const listRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const live = useRef<Drag | null>(null);
  const suppressUntil = useRef(0);

  const onPointerDown = (index: number) => (e: PointerEvent) => {
    if (e.button !== 0 || live.current) return;
    if ((e.target as Element).closest('input, textarea, select, button, a, [role="switch"]')) return;
    const startX = e.clientX, startY = e.clientY;
    let started = false;
    const cleanup = () => {
      clearTimeout(timer);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
      window.removeEventListener('touchmove', block);
    };
    const block = (t: TouchEvent) => { if (started) t.preventDefault(); };
    const begin = () => {
      const items = [...(listRef.current?.querySelectorAll<HTMLElement>(':scope > .reorder-item') ?? [])];
      if (!items[index]) return;
      const rects = items.map(el => el.getBoundingClientRect());
      const step = rects.length > 1 ? rects[1]!.top - rects[0]!.bottom : 12;
      started = true;
      live.current = { from: index, to: index, dy: 0, tops: rects.map(r => r.top), heights: rects.map(r => r.height), step };
      setDrag(live.current);
      void haptic.dragStart();
    };
    const timer = setTimeout(begin, HOLD_MS);
    const move = (m: PointerEvent) => {
      if (!started) {
        if (Math.abs(m.clientX - startX) > SLOP_PX || Math.abs(m.clientY - startY) > SLOP_PX) cleanup();
        return;
      }
      const d = live.current!;
      const dy = m.clientY - startY;
      const centre = d.tops[d.from]! + d.heights[d.from]! / 2 + dy;
      const to = d.tops.filter((t, j) => j !== d.from && t + d.heights[j]! / 2 < centre).length;
      if (to !== d.to) void haptic.tick();
      live.current = { ...d, dy, to };
      setDrag(live.current);
    };
    const finish = (commit: boolean) => {
      cleanup();
      const d = live.current;
      live.current = null;
      setDrag(null);
      if (!started || !d) return;
      suppressUntil.current = Date.now() + 400;
      if (commit && d.to !== d.from) onMove(d.from, d.to);
    };
    const up = () => finish(true);
    const cancel = () => finish(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    window.addEventListener('touchmove', block, { passive: false });
  };

  /** Where item `i` sits while a drag is in progress. */
  const styleFor = (i: number): Record<string, string> | undefined => {
    if (!drag) return undefined;
    const shift = drag.heights[drag.from]! + drag.step;
    if (i === drag.from) return { transform: `translateY(${drag.dy}px)`, zIndex: '3', position: 'relative', transition: 'none' };
    if (drag.from < drag.to && i > drag.from && i <= drag.to) return { transform: `translateY(${-shift}px)` };
    if (drag.to < drag.from && i >= drag.to && i < drag.from) return { transform: `translateY(${shift}px)` };
    return { transform: 'translateY(0)' };
  };

  /** A tap that ends a drag must not also open or close the card. */
  const clickAllowed = (): boolean => Date.now() > suppressUntil.current;

  return { listRef, dragging: drag != null, onPointerDown, styleFor, clickAllowed };
}
