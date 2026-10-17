// LIB-2b (design 6.2, D-LIB2b-PAGES): a shipped library row's pinned pages. Its batch file names them in `pages`:
// `plates` (the plates page config, rebuilt here by buildPlatesPage on every generate, as golden A is), `layers` (the
// committed layers page, read as is) and `layersConfig` (that page's builder config, used by layers-spec.mjs). Both
// pages are pinned in the batch golden file (registry batchGoldenOf), which must pass verifyBatchChain against
// GOLDEN.json: `page` and `layers-page` entries ({ pageSha256, bytes }) and one `plate` entry per id. Every reader
// throws, naming the batch and the file, before anything is cut from a page that is missing or differs from its pin.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, sha256 } from '../lib/inputs.mjs';
import { GOLDEN_JSON, latestEntries, verifyBatchChain } from '../golden.mjs';
import { batchGoldenOf } from './registry.mjs';
import { buildPlatesPage } from './build-page.mjs';
import { pageConfig } from './plates-page.mjs';

const where = row => `${row.id} (batch ${row.batch}, ${row.batchFile})`;
/** The row's `pages`, or a throw naming the id: a shipped library row needs all three. */
export function pagesOf(row) {
  if (!row.batchFile) throw new Error(`library: ${row.id} is not a library row`);
  if (!row.pages) throw new Error(`library: ${where(row)}: shipped, but its batch file has no pages`);
  return row.pages;
}

const goldens = new Map();
/** { file, entries, latest } of a batch golden file, after its chain and base check. */
export function batchGolden(row, root = ROOT) {
  const file = batchGoldenOf(row.batchFile), abs = join(root, file);
  if (goldens.has(abs)) return goldens.get(abs);
  if (!existsSync(abs)) throw new Error(`library: ${where(row)}: no batch golden file ${file}`);
  const data = JSON.parse(readFileSync(abs, 'utf8'));
  const bad = verifyBatchChain(data, JSON.parse(readFileSync(GOLDEN_JSON, 'utf8')).entries);
  if (bad.length) throw new Error(`library: ${file}:\n${bad.join('\n')}`);
  const g = { file, entries: data.entries, latest: latestEntries(data.entries) };
  goldens.set(abs, g);
  return g;
}

/** The latest entry of `kind` ('page', 'layers-page') or the latest `plate` entry of the row, or a throw. */
export function pinOf(row, kind, root = ROOT) {
  const g = batchGolden(row, root), e = g.latest.get(kind === 'plate' ? row.id : kind);
  if (!e || (kind === 'plate' && e.kind !== 'plate')) throw new Error(`library: ${where(row)}: no ${kind} entry in ${g.file}`);
  return e;
}

const pinCheck = (row, file, bytes, e) => {
  if (sha256(bytes) !== e.pageSha256 || bytes.length !== e.bytes) throw new Error(`library: ${where(row)}: ${file} sha256 ${sha256(bytes)} (${bytes.length} B) != pinned ${e.pageSha256} (${e.bytes} B)`);
};

const layersPages = new Map();
/** The committed layers page (utf8), after its pin check. */
export function layersPage(row, root = ROOT) {
  const file = pagesOf(row).layers, abs = join(root, file);
  if (layersPages.has(abs)) return layersPages.get(abs);
  if (!existsSync(abs)) throw new Error(`library: ${where(row)}: no layers page ${file}`);
  const bytes = readFileSync(abs);
  pinCheck(row, file, bytes, pinOf(row, 'layers-page', root));
  layersPages.set(abs, bytes.toString('utf8'));
  return layersPages.get(abs);
}

const platesPages = new Map();
/** The batch plates page (utf8), rebuilt from its config and the registry, after its pin check. */
export function platesPage(row, all, root = ROOT) {
  const file = pagesOf(row).plates, abs = join(root, file);
  if (!platesPages.has(abs)) {
    if (!existsSync(abs)) throw new Error(`library: ${where(row)}: no plates page config ${file}`);
    platesPages.set(abs, (async () => {
      const { html } = await buildPlatesPage(await pageConfig(file, all));
      pinCheck(row, `the page built from ${file}`, html, pinOf(row, 'page', root));
      return html.toString('utf8');
    })());
  }
  return platesPages.get(abs);
}
