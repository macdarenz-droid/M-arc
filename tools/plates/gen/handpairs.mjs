// LIB-2 plugin (design 12, ruling D-LIB7-1): library hand close-ups are shared per pair key, so their app chunks are
// src/howto/generated/handpair-<key>.ts (the zoom registry's `hand-*.ts` glob does not match them, and
// tests/howto/hands.test.ts keeps its 8). Input: LIB-7's loader tools/plates/library/hands/pairs.mjs, which must export
//   HAND_OF_ID: { <lib id>: <key> }     inputsFor(key): string[]     pairPanel(key): Promise<string> (the zx panel)
// Only keys used by shipped ids are written; their loaders are the PAIR_OF / PAIR_LOADERS exports of
// generated/loaders.ts (gen/ids.mjs). Until LIB-7 merges the loader does not exist and nothing is written.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from '../lib/inputs.mjs';
import { registryInputs, rows, shippedIds } from '../library/registry.mjs';

export const PAIRS = 'tools/plates/library/hands/pairs.mjs';
export const pairPath = key => `src/howto/generated/handpair-${key}.ts`;

/** The pair loader module, or null when LIB-7 has not landed it. `file` is repo-relative (tests pass a fixture). */
export async function loadPairs(file = PAIRS) {
  if (!existsSync(join(ROOT, file))) return null;
  return import(pathToFileURL(join(ROOT, file)).href);
}

/** Shipped id -> key, and the keys in first-use order, for the shipped ids that have a pair. */
export function pairsOf(pairs, shipped, all = rows()) {
  if (!pairs) return { pairOf: {}, keys: [] };
  const byId = new Map(all.map(r => [r.id, r]));
  const pairOf = {}, keys = [];
  for (const id of shipped) {
    const key = pairs.HAND_OF_ID[id];
    if (!key) continue;
    if (!/^[a-z0-9-]+$/.test(key)) throw new Error(`handpairs: ${id}: bad key ${key}`);
    pairOf[byId.get(id).chromeId] = key;
    if (!keys.includes(key)) keys.push(key);
  }
  return { pairOf, keys };
}

export const pairText = (key, panel) => `// The ${key} hand pair (library plan 2.3), shared by every exercise that uses it, loaded on its first open.
export const panel = ${JSON.stringify(panel)};
`;

export const inputs = () => [...registryInputs(), PAIRS].filter(p => existsSync(join(ROOT, p)));

export async function outputs({ pairsFile = PAIRS } = {}) {
  const pairs = await loadPairs(pairsFile);
  const { keys } = pairsOf(pairs, shippedIds());
  const out = [];
  for (const key of keys) {
    const ins = pairs.inputsFor(key);
    if (!Array.isArray(ins) || ins.length === 0) throw new Error(`handpairs: ${key}: inputsFor gave no inputs`);
    const panel = await pairs.pairPanel(key);
    if (typeof panel !== 'string' || !panel.startsWith('<div class="zx"')) throw new Error(`handpairs: ${key}: pairPanel is not a zx panel`);
    out.push({ path: pairPath(key), text: pairText(key, panel), inputs: [...registryInputs(), ...ins] });
  }
  return out;
}

/** L2-A21: the pair files written and the PAIR_LOADERS keys equal the keys the shipped ids use. Red on an empty pair
 *  registry. `written`: the handpair-*.ts paths; `loaderKeys`: Object.keys(PAIR_LOADERS). */
export function pairProblems(pairs, shipped, written, loaderKeys, all = rows()) {
  if (!pairs) return written.length || loaderKeys.length ? [`no pair loader, but ${written.length} files and ${loaderKeys.length} loaders`] : [];
  if (!pairs.HAND_OF_ID || Object.keys(pairs.HAND_OF_ID).length === 0) return ['empty pair registry'];
  const { keys } = pairsOf(pairs, shipped, all), bad = [];
  const want = keys.map(pairPath).sort();
  if (JSON.stringify([...written].sort()) !== JSON.stringify(want)) bad.push(`pair files ${written} != ${want}`);
  if (JSON.stringify([...loaderKeys].sort()) !== JSON.stringify([...keys].sort())) bad.push(`PAIR_LOADERS keys ${loaderKeys} != ${keys}`);
  return bad;
}
