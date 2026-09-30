// HT-9: "Where this comes from" (plan 2.4 item 8 / GA 2.1 item 9), a line-for-line port of golden B's
// sourcesSection() (tools/plates/layers/artifact/howto-layers.mjs). The owner's DISCLAIMER sits right after the
// collapsed list, exactly where golden B emits it (not inside "Risks"; O2 closed 2026-09-30).
//
// Data-shape note (docs/COACHING-DECISIONS.md, HT-9): golden B resolves each source id through its own per-file
// `SOURCES`/`EVIDENCE_LABELS` maps, which content-types.ts (HT-4) does not carry forward as a named type; only
// `Source` (bibliographic) and `EvidenceTag` exist there. Until HT-5's archetypes.ts/generated output settles the
// real shape, this section reads `howTo.sources` as `Source` plus the two golden-B evidence fields (`tags`, `note`)
// it needs to render the badges, reconciled against HT-5's actual generated type when that card lands.
import { chromeIdOf } from '../PlateView';
import { IconChevronDown } from '@/ui/icons';
import { DISCLAIMER, SHOW_EVIDENCE } from '@/howto/archetypes';
import type { EvidenceTag, Source } from '@/howto/content-types';
import type { SectionProps } from './index';

export interface SourceWithEvidence extends Source {
  /** What this source backs for this exercise (golden B's per-exercise EVIDENCE_LABELS override; may be absent). */
  readonly tags?: readonly EvidenceTag[];
  readonly note?: string;
}

const TAG_WORD: Readonly<Record<EvidenceTag, string>> = {
  DATA: 'Measured',
  MECH: 'Mechanics',
  CONSENSUS: 'Coaching consensus',
  WEAK: 'Weak for this use',
};

export function Sources({ howTo }: SectionProps) {
  const pre = chromeIdOf(howTo);
  const sources = (howTo.sources ?? []) as readonly SourceWithEvidence[];
  return (
    <>
      <details class="hw-sec srcs" id={`${pre}-sources`}>
        <summary id={`${pre}-sources-toggle`}>
          <span>Sources</span>
          <span class="src-n">{sources.length}</span>
          <IconChevronDown size={18} />
        </summary>
        {SHOW_EVIDENCE && (
          <p class="src-key">
            Each source is labelled for what it backs here. <b>Measured</b> = a study that measured it.{' '}
            <b>Mechanics</b> = how the joint works. <b>Coaching consensus</b> = what trainers agree on.{' '}
            <b>Weak for this use</b> = related, not direct.
          </p>
        )}
        <ul class="src-list">
          {sources.map(s => (
            <li key={s.id}>
              <p class="src-cite">
                {s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer">{s.cite}</a> : s.cite}
              </p>
              {SHOW_EVIDENCE && (s.tags?.length || s.note) && (
                <p class="src-ev">
                  {s.tags?.map(t => <span key={t} class={`ev ev-${t.toLowerCase()}`}>{TAG_WORD[t]}</span>)}
                  {s.note && <span>{s.note}</span>}
                </p>
              )}
            </li>
          ))}
        </ul>
      </details>
      <p class="ht-disclaimer" id={`${pre}-disclaimer`}>{DISCLAIMER}</p>
    </>
  );
}
