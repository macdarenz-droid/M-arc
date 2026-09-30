// HT-9: "Where this comes from" (plan 2.4 item 8 / GA 2.1 item 9), a line-for-line port of golden B's
// sourcesSection() (tools/plates/layers/artifact/howto-layers.mjs). The owner's DISCLAIMER sits right after the
// collapsed list, exactly where golden B emits it (not inside "Risks"; O2 closed 2026-09-30).
//
// Reported gap (docs/COACHING-DECISIONS.md, HT-9, "the missing Source registry"): `BuiltHowTo.sources` is
// `readonly SourceId[]` (content-types.ts/HT-4, confirmed against HT-5's actual merged output) - bare ids, no
// bibliographic record. HT-5's `content.mjs` already builds the full `id -> Source` registry (cite/url/kind/
// access/checked) and writes it to `docs/research/howto/sources.json` for verification, but never to anything
// under `src/` the app can import (tsconfig's `include` does not cover `docs/`, confirmed). `SOURCES` below is
// that missing piece, at the path a fix should add it (mirrors the module layout's own `generated/*` convention);
// it does not exist yet, so this file will not compile or run until that lands - not invented here.
//
// The per-source evidence badge (golden B's EVIDENCE_LABELS `{tag, text}`) is NOT part of that gap: HT-5's
// `loadContent` doc comment confirms golden B folds a source's per-use `use`/`note` into that same claim's own
// `Claim.tags`/note wherever the source is actually cited, so `evidenceFor()` below derives it by scanning the
// claim-bearing fields `BuiltHowTo` already carries (setup, posture, mistakes, risks, handling) rather than
// reading a second registry - the real, intended data flow, not a guess.
import { chromeIdOf } from '../PlateView';
import { IconChevronDown } from '@/ui/icons';
import { DISCLAIMER, SHOW_EVIDENCE } from '@/howto/archetypes';
import { SOURCES } from '@/howto/generated/sources';
import type { Claim, EvidenceTag, SourceId } from '@/howto/content-types';
import type { SectionProps } from './index';

const TAG_WORD: Readonly<Record<EvidenceTag, string>> = {
  DATA: 'Measured',
  MECH: 'Mechanics',
  CONSENSUS: 'Coaching consensus',
  WEAK: 'Weak for this use',
};

/** Every claim `howTo` carries today (HT-6/HT-7's zoom/feel claims land once those fields stop being `never`). */
function allClaims(howTo: SectionProps['howTo']): readonly Claim[] {
  const claims: Claim[] = [];
  for (const s of howTo.setup ?? []) claims.push(s.claim);
  for (const p of howTo.posture ?? []) claims.push(p.claim);
  for (const m of howTo.mistakes ?? []) claims.push(m.claim);
  for (const r of howTo.risks ?? []) claims.push(r.claim);
  const h = howTo.handling;
  if (h && h.archetype !== 'none') {
    claims.push(h.wrist.claim, h.thumb.claim);
    if (h.handleChoice) claims.push(h.handleChoice.claim);
    if (h.width) claims.push(h.width.claim);
  }
  return claims;
}

/** The union of tags every claim citing `id` in this exercise carries (golden B's EVIDENCE_LABELS, folded into
 *  each claim by HT-5's generator - see the file header). */
function evidenceFor(id: SourceId, claims: readonly Claim[]): readonly EvidenceTag[] {
  const tags = new Set<EvidenceTag>();
  for (const c of claims) if (c.sources.includes(id)) for (const t of c.tags) tags.add(t);
  return [...tags];
}

export function Sources({ howTo }: SectionProps) {
  const pre = chromeIdOf(howTo);
  const ids = howTo.sources ?? [];
  const claims = allClaims(howTo);
  return (
    <>
      <details class="hw-sec srcs" id={`${pre}-sources`}>
        <summary id={`${pre}-sources-toggle`}>
          <span>Sources</span>
          <span class="src-n">{ids.length}</span>
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
          {ids.map(id => {
            const s = SOURCES[id];
            if (!s) throw new Error(`${howTo.id}: source ${id} not in the registry`);
            const tags = evidenceFor(id, claims);
            return (
              <li key={id}>
                <p class="src-cite">
                  {s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer">{s.cite}</a> : s.cite}
                </p>
                {SHOW_EVIDENCE && tags.length > 0 && (
                  <p class="src-ev">
                    {tags.map(t => <span key={t} class={`ev ev-${t.toLowerCase()}`}>{TAG_WORD[t]}</span>)}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </details>
      <p class="ht-disclaimer" id={`${pre}-disclaimer`}>{DISCLAIMER}</p>
    </>
  );
}
