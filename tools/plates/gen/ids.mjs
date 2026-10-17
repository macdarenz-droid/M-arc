// LIB-2 plugin (library plan 5.2, 5.3; design 7): the id registries, from tools/plates/library/registry.mjs.
//   src/howto/ids.ts                       hasHowTo and howToHint over 4-character hashes of the shipped ids (main
//                                          bundle, <= 2,048 B, refused over it)
//   tools/plates/library/ids-node.mjs      its Node twin, emitted from the same template (tests, the gate's harness)
//   src/howto/lib-id.ts                    LibId: every exercises.json id (types only, generated once per exercises.json)
//   src/howto/generated/loaders.ts        LOADERS: one dynamic import per shipped id (its own lazy chunk), and the
//                                          per-chromeId HAND, POSTURE and FEEL chunk maps (D-LIB2-sheet-maps)
//   src/howto/coverage.ts                  every exercises.json id's status (HT-4's C6 contract) and stage (plan 1)
// ids.ts and its twin carry the push hints (content.mjs's pushHints, D-LIB2-hints); content.mjs, which runs after this
// plugin, stays ids.ts's second writer: it checks the hints it renders are the ones written.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../lib/inputs.mjs';
import { hintsOutputs } from '../library/ids-encoding.mjs';
import { inputs as contentInputs, pushHints } from './content.mjs';
import { EXERCISES_JSON, registryInputs, rows, shippedIds } from '../library/registry.mjs';
import { PAIRS, loadPairs, pairsOf } from './handpairs.mjs';

/** The layer plugins whose chunks loaders.ts maps (run first, so ctx.prev holds their outputs). */
export const LAYERS = ['tools/plates/gen/hands.mjs', 'tools/plates/gen/zooms.mjs', 'tools/plates/gen/feel.mjs', 'tools/plates/gen/handpairs.mjs'];
export const after = LAYERS;

export const ENCODING = 'tools/plates/library/ids-encoding.mjs';
export const COVERAGE_DATA = 'tools/plates/library/coverage-archetypes.json';
// The encoding (S, H, O and the decoder) lives in ../library/ids-encoding.mjs, shared with content.mjs (D-LIB2-hints).
export { IDS_MAX, IDS_WRITERS, LABEL, hintsOutputs, idHash, idsBudget, idsNodeText, idsText, literals, setOf } from '../library/ids-encoding.mjs';

export const libIdText = ids => `// Every library exercise id in src/data/exercises.json (library plan 5.2). Types only: costs no bundle bytes.
export type LibId =
${ids.map(id => `  | ${JSON.stringify(id)}`).join('\n')};
`;

/** The per-chromeId chunk maps, in shipped-row order (D-LIB2-sheet-maps): HAND is an exercise's own hand-<chromeId>
 *  chunk, else its shared handpair-<key> chunk (design 12); POSTURE and FEEL are posture-<chromeId> and
 *  feel-<chromeId> when written. `has(name)`: whether src/howto/generated/<name>.ts is an output. */
export function chunkMaps(shippedRows, has, pairOf = {}) {
  const hand = [], posture = [], feel = [];
  for (const { chromeId: c } of shippedRows) {
    if (has(`hand-${c}`)) hand.push([c, `hand-${c}`]);
    else if (pairOf[c]) hand.push([c, `handpair-${pairOf[c]}`]);
    if (has(`posture-${c}`)) posture.push([c, `posture-${c}`]);
    if (has(`feel-${c}`)) feel.push([c, `feel-${c}`]);
  }
  return { hand, posture, feel };
}

const mapText = entries => `{${entries.map(([c, f]) => `\n  ${JSON.stringify(c)}: () => import('./${f}'),`).join('')}${entries.length ? '\n' : ''}}`;

export const htIndexText = (loaders, { hand = [], posture = [], feel = [] } = {}) => `import type { BuiltHowTo, LibId } from '../types';

// The shipped ids in registry order (tests and tools read them here; the main bundle has only ids.ts's hashes).
export const HOWTO_IDS = [
${loaders.map(([id]) => `  ${JSON.stringify(id)},`).join('\n')}
] as const;

// One dynamic import per shipped id. Partial: LibId names every exercise, and only the shipped ones have a loader.
export const LOADERS: Partial<Record<LibId, () => Promise<{ default: BuiltHowTo }>>> = {
${loaders.map(([id, slug]) => `  ${id}: () => import('./ht-${slug}'),`).join('\n')}
};

// Per-chromeId chunks (D-LIB2-sheet-maps): the sheet chunk holds no per-id map, so it does not grow with the library.
// HAND: the exercise's own hand chunk, else its shared hand pair (LIB-2 design 12).
export const HAND: Readonly<Record<string, () => Promise<{ readonly panel: string }>>> = ${mapText(hand)};
export const POSTURE: Readonly<Record<string, () => Promise<{ readonly panels: Readonly<Record<string, string>>; readonly zdots: string }>>> = ${mapText(posture)};
export const FEEL: Readonly<Record<string, () => Promise<{ readonly default: { readonly id: string; readonly pre: string; readonly section: string } }>>> = ${mapText(feel)};
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

const pairsInputs = () => [...registryInputs(), ...LAYERS.filter(p => p !== 'tools/plates/gen/handpairs.mjs'), ...(existsSync(join(ROOT, PAIRS)) ? [PAIRS] : [])];
export const inputs = () => [...registryInputs(), COVERAGE_DATA, ...(existsSync(join(ROOT, PAIRS)) ? [PAIRS] : [])];
/** Each output's own inputs (design 6.1), static so a header can be re-checked with no render. */
export function inputsFor(path) {
  if (path === 'src/howto/lib-id.ts') return [EXERCISES_JSON];
  if (path === 'src/howto/coverage.ts') return [...registryInputs(), COVERAGE_DATA];
  if (path === 'src/howto/generated/loaders.ts') return pairsInputs();
  // the encoding module is an input of both twins; content.mjs adds its own inputs as ids.ts's second writer
  if (path === 'src/howto/ids.ts') return [...registryInputs(), ENCODING];
  if (path === 'tools/plates/library/ids-node.mjs') return [...registryInputs(), ENCODING, ...contentInputs()];
  return undefined;
}

export async function outputs(ctx = {}) {
  const all = rows(), shipped = shippedIds(all);
  const exerciseIds = JSON.parse(readFileSync(join(ROOT, EXERCISES_JSON), 'utf8')).map(e => e.id);
  const twins = hintsOutputs(await pushHints(), shipped, exerciseIds);
  const slugOf = new Map(all.map(r => [r.id, r.slug]));
  const archetypes = JSON.parse(readFileSync(join(ROOT, COVERAGE_DATA), 'utf8')).archetypes;
  const { pairOf } = pairsOf(await loadPairs(), shipped, all);
  const gen = name => `src/howto/generated/${name}.ts`;
  const has = ctx.prev ? name => ctx.prev.has(gen(name)) : name => existsSync(join(ROOT, gen(name)));
  const byId = new Map(all.map(r => [r.id, r]));
  const maps = chunkMaps(shipped.map(id => byId.get(id)), has, pairOf);
  return [
    { path: 'src/howto/ids.ts', text: twins.ids, inputs: inputsFor('src/howto/ids.ts') },
    { path: 'tools/plates/library/ids-node.mjs', text: twins.node, inputs: inputsFor('tools/plates/library/ids-node.mjs') },
    { path: 'src/howto/lib-id.ts', text: libIdText(exerciseIds), inputs: inputsFor('src/howto/lib-id.ts') },
    { path: 'src/howto/generated/loaders.ts', text: htIndexText(shipped.map(id => [id, slugOf.get(id)]), maps), inputs: inputsFor('src/howto/generated/loaders.ts') },
    { path: 'src/howto/coverage.ts', text: coverageText(coverageEntries(archetypes, all, exerciseIds)), inputs: inputsFor('src/howto/coverage.ts') },
  ];
}
