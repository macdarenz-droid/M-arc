// LIB-2 plugin (library plan 5.2, 5.3; design 7): the id registries, from tools/plates/library/registry.mjs.
//   src/howto/ids.ts                       hasHowTo over 5-character hashes of the shipped ids (main bundle, <= 2,048 B)
//   tools/plates/library/ids-node.mjs      its Node twin, emitted from the same template (tests, the gate's harness)
//   src/howto/lib-id.ts                    LibId: every exercises.json id (types only, generated once per exercises.json)
//   src/howto/generated/loaders.ts        LOADERS: one dynamic import per shipped id (its own lazy chunk)
//   src/howto/coverage.ts                  every exercises.json id's status (HT-4's C6 contract) and stage (plan 1)
// content.mjs runs after this plugin and appends HOWTO_HINTS to ids.ts, as it did after plates.mjs.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../lib/inputs.mjs';
import { EXERCISES_JSON, registryInputs, rows, shippedIds } from '../library/registry.mjs';
import { PAIRS, loadPairs, pairsOf } from './handpairs.mjs';

export const COVERAGE_DATA = 'tools/plates/library/coverage-archetypes.json';
export const LABEL = 'How to do it';
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/** The hash, as source text: FNV-1a 32-bit over UTF-16 code units, xor-folded to 30 bits, 5 base-64 characters. One
 *  template for both twins; `ts` adds the TypeScript annotations. */
const hashSrc = ts => `function h(s${ts ? ': string' : ''})${ts ? ': string' : ''} {
  let x = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) x = Math.imul(x ^ s.charCodeAt(i), 0x01000193) >>> 0;
  x = (x ^ (x >>> 30)) & 0x3fffffff;
  let o = '';
  for (let k = 0; k < 5; k++) { o = A[x & 63] + o; x >>>= 6; }
  return o;
}`;
const hasSrc = ts => `export function hasHowTo(id${ts ? ': string' : ''})${ts ? ': id is HowToId' : ''} {
  if (!id.startsWith('lib_')) return false;
  const t = h(id);
  for (let i = 0; i < SET.length; i += 5) if (SET.startsWith(t, i)) return true;
  return false;
}`;

// eslint-disable-next-line no-new-func
const hashFn = new Function('A', `${hashSrc(false)}\nreturn h;`)(ALPHABET);
/** The 5-character hash of an id (the same function both twins carry). */
export const idHash = id => hashFn(id);

/** The SET literal for `shipped`, refusing a collision between a shipped id and any other exercises.json id. */
export function setOf(shipped, allIds) {
  if (shipped.length === 0) throw new Error('ids: no shipped ids');
  const byHash = new Map();
  for (const id of allIds) {
    const t = idHash(id);
    if (byHash.has(t)) {
      const other = byHash.get(t);
      if (shipped.includes(id) || shipped.includes(other)) throw new Error(`ids: hash collision ${t} between ${other} and ${id}; salt or widen the hash (plan 5.2)`);
    }
    byHash.set(t, id);
  }
  for (const id of shipped) if (!allIds.includes(id)) throw new Error(`ids: shipped id ${id} is not in ${EXERCISES_JSON}`);
  return shipped.map(idHash).join('');
}

export const idsText = set => `// Main-bundle How-to module (plan 2.9: <= 2,048 B, no imports). SET: hashes of the shipped ids (plan 5.2).
export type HowToId = string & { readonly __howTo: true };
export const HOWTO_LABEL = ${JSON.stringify(LABEL)};
const SET = ${JSON.stringify(set)};
const A = ${JSON.stringify(ALPHABET)};
${hashSrc(true)}
${hasSrc(true)}
`;

export const idsNodeText = set => `// Node twin of src/howto/ids.ts (tests and the gate's harness): the same SET literal and hash template, emitted
// together by tools/plates/gen/ids.mjs.
const SET = ${JSON.stringify(set)};
const A = ${JSON.stringify(ALPHABET)};
${hashSrc(false)}
${hasSrc(false)}
`;

export const libIdText = ids => `// Every library exercise id in src/data/exercises.json (library plan 5.2). Types only: costs no bundle bytes.
export type LibId =
${ids.map(id => `  | ${JSON.stringify(id)}`).join('\n')};
`;

export const htIndexText = (loaders, pairOf = {}, keys = []) => `import type { BuiltHowTo, LibId } from '../types';

// The shipped ids in registry order (tests and tools read them here; the main bundle has only ids.ts's hashes).
export const HOWTO_IDS = [
${loaders.map(([id]) => `  ${JSON.stringify(id)},`).join('\n')}
] as const;

// One dynamic import per shipped id. Partial: LibId names every exercise, and only the shipped ones have a loader.
export const LOADERS: Partial<Record<LibId, () => Promise<{ default: BuiltHowTo }>>> = {
${loaders.map(([id, slug]) => `  ${id}: () => import('./ht-${slug}'),`).join('\n')}
};

// Hand pairs (LIB-2 design 12): exercise chrome id -> shared pair key, and one dynamic import per key.
export const PAIR_OF: Readonly<Record<string, string>> = {${Object.entries(pairOf).map(([c, k]) => `\n  ${JSON.stringify(c)}: ${JSON.stringify(k)},`).join('')}${keys.length ? '\n' : ''}};
export const PAIR_LOADERS: Readonly<Record<string, () => Promise<{ readonly panel: string }>>> = {${keys.map(k => `\n  ${JSON.stringify(k)}: () => import('./handpair-${k}'),`).join('')}${keys.length ? '\n' : ''}};
`;

export function coverageText(entries) {
  const line = ([id, e]) => e.status === 'approved'
    ? `  '${id}': { status: 'approved', stage: 'shipped' },`
    : `  '${id}': { status: 'pending', archetype: '${e.archetype}', stage: ${JSON.stringify(e.stage)} },`;
  return `// HT-4 (HT4-A3 C6) + LIB-2 (library plan 1): the 153-id coverage table. Every exercises.json id is 'approved' (its
// How-to ships: stage 'shipped') or 'pending' with its hand archetype (appendix B) and its stage in the library plan's
// vocabulary. Generated by tools/plates/gen/ids.mjs from ${COVERAGE_DATA} (the archetypes, hand-edited only to
// record a card's own archetype change, never to make C6 pass) and the registry's stages.
import type { ContentLibId, HandArchetypeId } from './content-types';

export type CoverageStage = 'queued' | 'researching' | 'drawing' | 'review' | 'approved-plate' | 'shipped' | \`blocked:\${string}\` | \`left-out:\${string}\`;
export type CoverageEntry =
  | { readonly status: 'approved'; readonly stage: 'shipped' }
  | { readonly status: 'pending'; readonly archetype: HandArchetypeId; readonly stage: Exclude<CoverageStage, 'shipped'> };

export const COVERAGE: Readonly<Record<ContentLibId, CoverageEntry>> = {
${entries.map(line).join('\n')}
};
`;
}

/** Coverage entries in the data file's order; the mapping rule of D-LIB2-status. */
export function coverageEntries(archetypes, all, exerciseIds) {
  const stageOf = new Map(all.map(r => [r.id, r.stage]));
  const ids = Object.keys(archetypes);
  const missing = exerciseIds.filter(id => !(id in archetypes)), extra = ids.filter(id => !exerciseIds.includes(id));
  if (missing.length || extra.length) throw new Error(`ids: ${COVERAGE_DATA} must hold every exercises.json id once (missing ${missing}, unknown ${extra})`);
  return ids.map(id => {
    const stage = stageOf.get(id) ?? 'queued';
    if (stage === 'shipped') return [id, { status: 'approved' }];
    if (!archetypes[id]) throw new Error(`ids: ${id} is not shipped but has no archetype in ${COVERAGE_DATA}`);
    return [id, { status: 'pending', archetype: archetypes[id], stage }];
  });
}

const pairsInputs = () => [...registryInputs(), ...(existsSync(join(ROOT, PAIRS)) ? [PAIRS] : [])];
export const inputs = () => [...registryInputs(), COVERAGE_DATA, ...(existsSync(join(ROOT, PAIRS)) ? [PAIRS] : [])];
/** Each output's own inputs (design 6.1), static so a header can be re-checked with no render. */
export function inputsFor(path) {
  if (path === 'src/howto/lib-id.ts') return [EXERCISES_JSON];
  if (path === 'src/howto/coverage.ts') return [...registryInputs(), COVERAGE_DATA];
  if (path === 'src/howto/generated/loaders.ts') return pairsInputs();
  if (['src/howto/ids.ts', 'tools/plates/library/ids-node.mjs'].includes(path)) return registryInputs();
  return undefined;
}

export async function outputs() {
  const all = rows(), shipped = shippedIds(all);
  const exerciseIds = JSON.parse(readFileSync(join(ROOT, EXERCISES_JSON), 'utf8')).map(e => e.id);
  const set = setOf(shipped, exerciseIds);
  const slugOf = new Map(all.map(r => [r.id, r.slug]));
  const archetypes = JSON.parse(readFileSync(join(ROOT, COVERAGE_DATA), 'utf8')).archetypes;
  const { pairOf, keys } = pairsOf(await loadPairs(), shipped, all);
  return [
    { path: 'src/howto/ids.ts', text: idsText(set), inputs: inputsFor('src/howto/ids.ts') },
    { path: 'tools/plates/library/ids-node.mjs', text: idsNodeText(set), inputs: inputsFor('tools/plates/library/ids-node.mjs') },
    { path: 'src/howto/lib-id.ts', text: libIdText(exerciseIds), inputs: inputsFor('src/howto/lib-id.ts') },
    { path: 'src/howto/generated/loaders.ts', text: htIndexText(shipped.map(id => [id, slugOf.get(id)]), pairOf, keys), inputs: inputsFor('src/howto/generated/loaders.ts') },
    { path: 'src/howto/coverage.ts', text: coverageText(coverageEntries(archetypes, all, exerciseIds)), inputs: inputsFor('src/howto/coverage.ts') },
  ];
}
