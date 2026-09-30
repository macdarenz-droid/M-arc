// HT-9: "Set up" (plan 2.4 item 6 / GA 2.1 item 8), a line-for-line port of golden B's setupSection()
// (tools/plates/layers/artifact/howto-layers.mjs). SETUP_VISIBLE mirrors golden B's SETUP_MAX_STEPS
// (artifact/copy-lint.mjs): today all 8 exercises have exactly 5 steps, so `more` is 0 and the button never
// renders (docs/COACHING-DECISIONS.md, HT-9). The collapse path stays for any future longer list.
// The "Show me the …" button needs only golden B's exact markup (id, data-zoom): HT-6's delegated click handler
// on the sheet panel opens the close-up (supervisor ruling on HT-6's design note, PR #112, 2026-09-30 -
// supersedes an earlier "dispatch ht:zoom-open" draft that never shipped). Nothing to wire here.
import { useState } from 'preact/hooks';
import type { VNode } from 'preact';
import { chromeIdOf } from '../PlateView';
import { iconBase } from '@/ui/icons';
import type { SectionProps } from './index';
// Pulls in the shared HT-9 text styles (setup, risks, sources); Risks.tsx and Sources.tsx always render
// alongside this one (sections/index.ts), so one side-effect import is enough (Vite dedupes).
import '../css/text.css';

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
    <section class="hw-sec setup" id={`${pre}-setup`} aria-labelledby={`${pre}-setup-h`}>
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

export function Setup({ howTo }: SectionProps) {
  const [open, setOpen] = useState(false);
  return renderSetup(howTo, open, () => setOpen(o => !o));
}
