// LIB-5 (D-LIB5-FAMILY, D-LIB5-FAULTKEYS 4): family consistency. Rule (a) is one label per fault.key; a row that
// declares inheritance is refused until LIB-9's ruled comparator replaces familyRefusal in this module. The reader
// collects faults from three sources: the 8's handling.faults, the shared modules' faults and every
// tools/plates/library/hands/hand-*.mjs VARIANTS[*].faults (an object keyed by fault key, LIB-7's shape).
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../../../..', import.meta.url)));
export const HANDS_DIR = 'tools/plates/library/hands';
const v = (out, path, rule, detail = '') => out.push({ path, rule, detail });

/** D-LIB5-FAMILY (2): a row that declares inheritance is refused until a ruled comparator exists. `readCard(path)` reads
 *  the card the How-to's research.card names (as candidate.mjs researchOf reads it), or returns null. */
export function familyRefusal(id, content, readCard) {
  if (content.extends !== undefined) return `${id}: family: extends: inherited-string map not ruled (D-LIB5-FAMILY)`;
  const card = typeof content.research?.card === 'string' ? readCard(content.research.card) : null;
  if (card && card.inherit !== undefined && !(Array.isArray(card.inherit) && card.inherit.length === 0)) return `${id}: family: ${content.research.card}#inherit: inherited-string map not ruled (D-LIB5-FAMILY)`;
  return null;
}

/** Rule (a): one label per fault.key across `sources` = [{ src, faults: [{ key, label }] }]. */
export function familyLabels(sources) {
  const seen = new Map(), out = [];
  for (const { src, faults } of sources) for (const f of faults) {
    const at = seen.get(f.key);
    if (!at) seen.set(f.key, { label: f.label, src });
    else if (at.label !== f.label) v(out, `fault ${f.key}`, 'one label per fault key (content.md 4, family consistency)', `"${f.label}" (${src}) vs "${at.label}" (${at.src})`);
  }
  return out;
}

/** The hand modules under `dir`: [{ src, M }] for every hand-*.mjs, sorted by name ([] when the folder is absent). */
export async function handModules(dir = join(ROOT, HANDS_DIR)) {
  if (!existsSync(dir)) return [];
  const names = readdirSync(dir).filter(n => /^hand-.+\.mjs$/.test(n)).sort();
  return Promise.all(names.map(async n => ({ src: n, M: await import(pathToFileURL(join(dir, n)).href) })));
}

/** One source per hand module: its VARIANTS[*].faults as [{ key, label }]. */
export const handSources = mods => mods.map(({ src, M }) => ({ src,
  faults: Object.values(M.VARIANTS ?? {}).flatMap(va => Object.entries(va.faults ?? {}).map(([key, f]) => ({ key, label: f.label }))) }));

/** One source per shared module export that carries faults: [{ key, label }] from its faults[]. */
export const sharedSources = mods => mods.flatMap(({ src, M }) => Object.entries(M)
  .filter(([, e]) => Array.isArray(e?.faults))
  .map(([name, e]) => ({ src: `${src}#${name}`, faults: e.faults.map(f => ({ key: f.key, label: f.label })) })));

/** One source per How-to module of the 8: its handling.faults objects. */
export const eightSources = mods => mods.map(({ src, M }) => ({ src,
  faults: ((M.default ?? M).handling?.faults ?? []).filter(f => typeof f === 'object').map(f => ({ key: f.key, label: f.label })) }));

/** The fault entries hand modules export, counted straight from VARIANTS (the reader's check). */
export const exportedHandFaults = mods => mods.reduce((a, { M }) => a + Object.values(M.VARIANTS ?? {}).reduce((b, va) => b + Object.keys(va.faults ?? {}).length, 0), 0);

const countOf = sources => sources.reduce((a, s) => a + s.faults.length, 0);

/** Rule (a) over the three sources, with the reader's three count checks. Returns { counts, problems }. */
export function familyCheck({ eight, shared, hands, handMods }) {
  const counts = { eight: countOf(eight), shared: countOf(shared), hands: countOf(hands) }, problems = [];
  const exported = exportedHandFaults(handMods);
  if (counts.eight === 0) v(problems, 'family reader', 'the 8\'s fault count is 0');
  if (counts.shared === 0) v(problems, 'family reader', 'the shared modules\' fault count is 0');
  if (counts.hands !== exported) v(problems, 'family reader', 'hand faults read differ from the faults the hand modules export', `${counts.hands} read, ${exported} exported`);
  if (exported > 0 && counts.hands === 0) v(problems, 'family reader', 'the hand modules export faults but none were read');
  problems.push(...familyLabels([...eight, ...shared, ...hands]));
  return { counts, problems };
}
