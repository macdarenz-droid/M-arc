// HT-4 (HT4-A3): C1, cross-field rules across a single HowToContent. The shape itself is checked by `satisfies
// HowToContent` at authoring time; C1 checks only rules the type system can't: references between fields.
import type { HowToContent } from '../../../src/howto/content-types';

/** `knownIds` is every exercises.json id (ContentLibId), used to check `extends` targets. */
export function checkC1(content: HowToContent, knownIds: ReadonlySet<string>): string[] {
  const bad: string[] = [];
  const zoomKeys = new Set(content.zooms.map(z => z.key));
  const feelRowKeys = new Set(content.feel.rows.map(r => r.key));

  const checkZoomRef = (owner: string, zoom: string | undefined) => {
    if (zoom !== undefined && !zoomKeys.has(zoom)) bad.push(`C1: ${owner} references zoom "${zoom}", which is not in zooms`);
  };
  content.setup.forEach((s, i) => checkZoomRef(`setup[${i}]`, s.zoom));
  content.posture.forEach((p, i) => checkZoomRef(`posture[${i}] (${p.key})`, p.zoom));
  content.feel.rows.forEach((r, i) => checkZoomRef(`feel.rows[${i}] (${r.key})`, r.zoom));
  content.mistakes.forEach((m, i) => checkZoomRef(`mistakes[${i}] (${m.key})`, m.zoom));
  if (content.handling.archetype !== 'none' && content.handling.faults) {
    for (const f of content.handling.faults) if (typeof f !== 'string') checkZoomRef(`handling.faults (${f.key})`, undefined);
  }

  for (const z of content.zooms) if (z.feelRow !== undefined && !feelRowKeys.has(z.feelRow)) bad.push(`C1: zooms.${z.key} references feelRow "${z.feelRow}", which is not in feel.rows`);

  if (content.zooms.length > 4) bad.push(`C1: ${content.zooms.length} zooms, at most 4 allowed`);

  if (content.extends !== undefined && !knownIds.has(content.extends)) bad.push(`C1: extends "${content.extends}" is not a known id`);

  return bad;
}
