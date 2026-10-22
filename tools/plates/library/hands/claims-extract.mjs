// LIB-7: writes hands/claims.json, the pinned extract of every research claim the hand keys cite (hands/DESIGN.md §4 A3).
// Run: node tools/plates/library/hands/claims-extract.mjs [research commit]. Reads the research branch through git, so CI
// needs only the committed extract. A ref is `<file>#<cid>` (a claim's text), or `#grip.type`, `#inherit`, `#appliesTo`.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { HERE, MODULES, ROOT } from './pairs.mjs';

export const RESEARCH = process.argv[2] ?? '95342b1';
// census (docs/howto/library/inputs/census.json on claude/howto-options): the ids each LIB-7 key's scope is built from
export const CENSUS = process.argv[3] ?? '4a9fd86';
const SCOPE = { archetype: ['curl'], need: ['band', 'ezBar', 'rope', 'ropeLikely', 'singleHandle'] };
/** Every claim ref the key modules cite (variants, faults, ids), sorted. `ga:*` conventions are not research refs. */
export function refsOf(mods) {
  const out = new Set();
  const add = a => (a ?? []).forEach(r => { if (!r.startsWith('ga:')) out.add(r); });
  for (const m of mods) {
    for (const V of Object.values(m.VARIANTS ?? {})) { Object.values(V.claims ?? {}).forEach(add); Object.values(V.faults).forEach(F => add(F.claims)); }
    for (const c of Object.values(m.IDS ?? {})) add(c.claims);
  }
  return [...out].sort();
}
export function textOf(json, frag) {
  if (frag === 'grip.type') return json.grip.type;
  if (frag === 'inherit') return json.inherit.map(i => i.field).join(' | ');
  if (frag === 'appliesTo') return json.appliesTo.join(', ');
  const c = json.claims.find(x => x.id === frag);
  if (!c) throw new Error(`no claim ${frag}`);
  return c.text;
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const files = {}, claims = {};
  for (const ref of refsOf(MODULES)) {
    const [file, frag] = ref.split('#');
    if (!files[file]) {
      const raw = execFileSync('git', ['show', `${RESEARCH}:docs/research/howto/${file}`], { cwd: ROOT });
      files[file] = { sha256: createHash('sha256').update(raw).digest('hex'), json: JSON.parse(raw.toString('utf8')) };
    }
    claims[ref] = textOf(files[file].json, frag);
  }
  const out = { research: RESEARCH, files: Object.fromEntries(Object.entries(files).map(([k, v]) => [k, v.sha256])), claims };
  writeFileSync(join(HERE, 'claims.json'), JSON.stringify(out, null, 1) + '\n');
  const raw = execFileSync('git', ['show', `${CENSUS}:docs/howto/library/inputs/census.json`], { cwd: ROOT }), c = JSON.parse(raw.toString('utf8'));
  const census = { census: CENSUS, sha256: createHash('sha256').update(raw).digest('hex'),
    archetype: Object.fromEntries(c.exercises.map(e => [e.id, e.handArchetype])),
    byHandArchetype: Object.fromEntries(SCOPE.archetype.map(k => [k, c.aggregates.byHandArchetype[k].ids])),
    equipmentByNeed: Object.fromEntries(SCOPE.need.map(k => [k, c.aggregates.equipmentByNeed[k].ids])) };
  writeFileSync(join(HERE, 'census-scope.json'), JSON.stringify(census, null, 1) + '\n');
  console.log(`claims.json: ${Object.keys(claims).length} refs from ${Object.keys(files).length} files @ ${RESEARCH}`);
}
