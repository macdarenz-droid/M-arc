// HT-9: "Set up" (plan 2.4 item 6 / GA 2.1 item 8), a line-for-line port of golden B's setupSection()
// (tools/plates/layers/artifact/howto-layers.mjs). SETUP_VISIBLE mirrors golden B's SETUP_MAX_STEPS
// (artifact/copy-lint.mjs): today all 8 exercises have exactly 5 steps, so `more` is 0 and the button never
// renders (docs/COACHING-DECISIONS.md, HT-9). The collapse path stays for any future longer list.
// The "Show me the …" button has golden B's exact markup (id, data-zoom) and, per the sections' cross-section
// contract (events.ts: "Feel (HT-8), Setup (HT-9) ... ask for a close-up"), dispatches `ht:zoom-open` itself
// (HT-6's ZoomHost listens for it on the dialog/root). HT-6's own delegated click handler on the sheet panel
// only ever opens its own `.hm-show`; every other card's "Show me" emits its own event (critic fix: HT-10's
// sweep found the 19 setup buttons dead on arrival - docs/COACHING-DECISIONS.md).
import { useLayoutEffect, useState } from 'preact/hooks';
import type { VNode, JSX } from 'preact';
import { chromeIdOf } from '../PlateView';
import { iconBase } from '@/ui/icons';
import { emit } from '../events';
import type { SectionProps } from './index';
// Pulls in the shared HT-9 text styles (setup, risks); Risks.tsx always renders alongside this one
// (sections/index.ts), so one side-effect import is enough (Vite dedupes).
import '../css/text.css';

/** golden B's "Show me" tap: opens the close-up (or brings it into view) through HT-6's zoom host. Takes the
 * resolved button (not the event) so it is unit-testable with a plain fake element, no DOM needed. */
export function openSetupZoom(btn: HTMLElement | null | undefined): void {
  const key = btn?.dataset.zoom;
  if (key) emit(btn, 'ht:zoom-open', { key, opener: btn });
}

function onSetupClick(e: JSX.TargetedMouseEvent<HTMLElement>): void {
  openSetupZoom((e.target as HTMLElement).closest<HTMLElement>('.st-show'));
}

/** golden B's `I.arrow(16)`, byte-equivalent path. */
const ArrowIcon = () => <svg {...iconBase(16)}><path d="M5 12h13M13 7l5 5-5 5" /></svg>;

/** golden B's SETUP_MAX_STEPS (artifact/copy-lint.mjs). */
export const SETUP_VISIBLE = 5;

/** Pure render: no hooks, so it is unit-testable by calling it directly (project convention: no jsdom). */
export function renderSetup(howTo: SectionProps['howTo'], open: boolean, onToggle: () => void): VNode {
  const pre = chromeIdOf(howTo);
  const steps = howTo.setup ?? [];
  const zooms = howTo.zooms ?? [];
  const zoomChip = (key?: string) => zooms.find(z => z.key === key)?.chip;
  const more = steps.length - SETUP_VISIBLE;
  return (
    <section class="hw-sec setup" id={`${pre}-setup`} aria-labelledby={`${pre}-setup-h`} onClick={onSetupClick}>
      <h4 class="eyebrow" id={`${pre}-setup-h`}>Set it up</h4>
      <ol class="st-list">
        {steps.map((s, i) => {
          const hide = i >= SETUP_VISIBLE;
          const chip = s.zoom ? zoomChip(s.zoom) : undefined;
          return (
            <li key={s.text} hidden={hide && !open} data-more={hide || undefined}>
              <span class="st-n" aria-hidden="true">{i + 1}</span>
              <div>
                <p>{s.text}</p>
                {chip && (
                  <button type="button" class="st-show" id={`${pre}-step-${i + 1}-show`} data-zoom={s.zoom}>
                    {`Show me the ${chip.toLowerCase()}`}<ArrowIcon />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {more > 0 && (
        <button
          type="button"
          class="fr-more st-more"
          id={`${pre}-setup-more`}
          aria-expanded={open}
          data-n={steps.length}
          data-all
          onClick={onToggle}
        >
          {open ? 'Fewer steps' : `All ${steps.length} steps`}
        </button>
      )}
    </section>
  );
}

/** HT-3b A3 (supervisor ruling on #113): Setup and Risks are below the plate, so they render after its first paint,
 *  each in a task of its own (`frames` frames, then a macrotask), never inside the timed open. Setup waits 2 frames;
 *  Risks waits 3, so it mounts after the frame that laid out Setup and neither shares a task or a layout pass with
 *  the other's (D-HT9-A3b). */
export function useAfterFirstPaint(frames = 2): boolean {
  const [ready, setReady] = useState(false);
  useLayoutEffect(() => {
    let left = frames, timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => { if (--left > 0) raf = requestAnimationFrame(tick); else timer = setTimeout(() => setReady(true), 0); };
    let raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(timer); };
  }, []);
  return ready;
}

export function Setup({ howTo }: SectionProps) {
  const [open, setOpen] = useState(false);
  const ready = useAfterFirstPaint();
  return ready ? renderSetup(howTo, open, () => setOpen(o => !o)) : null;
}
