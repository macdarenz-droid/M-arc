// V1-07 `matchesResearch` (docs/FORM-GUIDE-PRODUCTION.md §10.5): the file says what its research.json says. Tempo, kind,
// order, the three muscle lists and the mistake's tells equal research; at most 3 cues of at most 60 characters (model.ts
// `cues`). Pure data, no DOM.
import type { ExerciseGuide, Research } from '../model';

export const CUES = { max: 3, chars: 60 } as const;

const sameSet = (a: readonly string[], b: readonly string[]) => a.length === b.length && [...a].sort().join('\n') === [...b].sort().join('\n');
const list = (a: readonly string[]) => (a.length ? a.join(', ') : 'none');

/** The failing lines (empty when the file matches its research). */
export function researchMismatches(g: ExerciseGuide, r: Research): string[] {
  const out: string[] = [];
  const ft = g.tempo as Record<string, number>, rt = r.tempo as Record<string, number>;
  for (const k of [...new Set([...Object.keys(rt), ...Object.keys(ft)])])
    if (ft[k] !== rt[k]) out.push(`tempo ${k} = ${ft[k] ?? 'missing'} s, research.json gives ${rt[k] ?? 'none'} s`);
  if (g.kind !== r.kind) out.push(`kind ${g.kind}, research.json gives ${r.kind}`);
  if (g.order !== r.order) out.push(`order ${g.order}, research.json gives ${r.order}`);
  for (const k of ['target', 'helps', 'keepQuiet'] as const)
    if (!sameSet(g.muscles[k], r.muscles[k])) out.push(`muscles.${k} ${list(g.muscles[k])} (${g.muscles[k].length}), research.json gives ${list(r.muscles[k])} (${r.muscles[k].length})`);
  const tell = (t: { text: string; joint: string }) => `${t.joint}: ${t.text}`;
  const ft2 = g.mistake.tells.map(tell), rt2 = r.mistake.tells.map(tell);
  for (const t of ft2.filter(x => !rt2.includes(x))) out.push(`mistake tell "${t}" is not in research.json (${rt2.length} tells there)`);
  for (const t of rt2.filter(x => !ft2.includes(x))) out.push(`research.json tell "${t}" is missing from the file (${ft2.length} tells here)`);
  if (g.cues.length > CUES.max) out.push(`${g.cues.length} cues > ${CUES.max}`);
  g.cues.forEach((q, i) => { if (q.length > CUES.chars) out.push(`cue ${i + 1} has ${q.length} characters > ${CUES.chars}`); });
  return out;
}
