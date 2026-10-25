// LIB-2 plugin (design 12, ruling D-LIB7-1): library hand close-ups are shared per pair key, so their app chunks are
// src/howto/generated/handpair-<key>.ts (the zoom registry's `hand-*.ts` glob does not match them, and
// tests/howto/hands.test.ts keeps its 8). Input: LIB-7's loader tools/plates/library/hands/pairs.mjs, which must export
//   HAND_OF_ID: { <lib id>: <key> }     inputsFor(key): string[]     pairPanel(key): Promise<string> (the zx panel)
// Only keys used by shipped ids are written; their loaders are the PAIR_OF / PAIR_LOADERS exports of
// generated/loaders.ts (gen/ids.mjs). Until LIB-7 merges the loader does not exist and nothing is written.
import { existsSync } from 'node:fs';
import { readFileSync } from 'node:fs';   // LIB-7b
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

export async function outputs({ pairsFile = PAIRS, prev } = {}) {
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
  if (prev) out.push(...await pairRowOutputs(prev, pairs));   // LIB-7b (D-LIB7b-SCOPE (c))
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

// ---- LIB-7b (D-LIB7b-SCOPE (c), hands/DESIGN.md §9 (c)-(d)): library rows whose layers config names a pair ----------
// Runs after gen/hands.mjs, which writes each shipped library row's zoom-<chromeId>.css from its pinned layers page.
//   - a shipped row whose config names pair K: HAND_OF_ID[id] === K and an archetype other than 'none', else throw;
//   - a 'none' row whose card on its page holds a pair panel throws;
//   - a pair row's zoom-<chromeId>.css gains the rules that style its pair panel (`.hx-hp-<K> …`, cut from the same
//     page), before golden B's HX_TAIL as on the page; the file without them must be gen/hands.mjs's text byte for byte.
// The converse (every keyed row names its pair) is LIB-9's D-LIB4-ENTRY check, not a throw here.
export const after = ['tools/plates/gen/hands.mjs'];
/** The pair key a row's layers config names, or undefined. */
export function configPairOf(row, root = ROOT) {
  const file = row.pages?.layersConfig;
  if (!file || !existsSync(join(root, file))) return undefined;
  return JSON.parse(readFileSync(join(root, file), 'utf8')).closeups?.[row.id]?.pair;
}
/** The card element of `chromeId` on a layers page (build-page.mjs: `<article class="sheet-card" id="card-<id>"`). */
export function cardOf(html, chromeId) {
  const a = html.indexOf(`<article class="sheet-card" id="card-${chromeId}"`), b = a < 0 ? -1 : html.indexOf('</article>', a);
  if (a < 0 || b < 0) throw new Error(`handpairs: no card ${chromeId} on its page`);
  return html.slice(a, b);
}
export const hasPairPanel = card => /<div class="zx" id="[a-z0-9-]*hp-[a-z0-9-]+-zoom-hand" data-zoom="hand"/.test(card);
/** The pair-row problems of one shipped library row (throws). */
export function pairRowCheck(row, key, hand, archetype, html) {
  if (key === undefined) {
    if (archetype === 'none' && hasPairPanel(cardOf(html, row.chromeId))) throw new Error(`handpairs: ${row.id}: archetype 'none', but its card on ${row.pages.layers} holds a pair panel`);
    return;
  }
  if (archetype === 'none') throw new Error(`handpairs: ${row.id}: archetype 'none', but ${row.pages.layersConfig} names pair ${key}`);
  if (hand !== key) throw new Error(`handpairs: ${row.id}: ${row.pages.layersConfig} names pair ${key}, but HAND_OF_ID gives ${hand}`);
}
async function pairRowOutputs(prev, pairs) {
  const H = await import('./hands.mjs'), { layersPage } = await import('../library/batch-golden.mjs'), { galleryCss } = await import('../css.mjs');
  const lib = H.libraryRows();
  if (!lib.length) return [];
  const archetypes = JSON.parse(readFileSync(join(ROOT, H.COVERAGE_DATA), 'utf8')).archetypes;
  const bp = readFileSync(join(ROOT, 'tools/plates/layers/artifact/build-page.mjs'), 'utf8'), out = [];
  for (const row of lib) {
    const key = configPairOf(row), html = layersPage(row).toString();
    pairRowCheck(row, key, pairs?.HAND_OF_ID?.[row.id], archetypes[row.id], html);
    if (key === undefined) continue;
    // A standalone call (no earlier writer's output, as tests read a plugin's own inputs) runs the checks only.
    if (!prev.size) continue;
    const path = `src/slices/howto/css/zoom-${row.chromeId}.css`, style = galleryCss(html), flat = H.flatStyle(style), tail = H.chromeRules(H.howtoCss(bp, style), H.HX_TAIL);
    if (H.rewrite(`${H.scopedRules(flat, row.chromeId)}\n${tail}`, { inPanel: true }) !== prev.get(path)) throw new Error(`handpairs: ${row.id}: ${path} is not gen/hands.mjs's text`);
    // no own `inputs`: this writer's share is the plugin-wide list (the pair loader and the registry); gen/hands.mjs's
    // share already lists the row's pinned page and layers config the rules are cut from
    out.push({ path, text: H.rewrite(`${H.scopedRules(flat, row.chromeId)}\n${H.scopedRules(flat, `hp-${key}`)}\n${tail}`, { inPanel: true }) });
  }
  return out;
}
