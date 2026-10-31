// LIB-8R (lib-8r-card Do 4, Do 7, A3): the PILOT-A2 plates page. Before the pin it is built from pilot-a2/rows.json read
// as one more batch file, never written under batches/ (Do 4); after the pin, from the registry's batches/pilot-a2.json.
// Copied from pilot-b/build.mjs @ c7bdad7a (#278), never imported; the rows.json read and the card shots follow
// lb7/build.mjs @ c7bdad7a (LIB-17 Do 5). Each row's sources lines come from its research card, in memory only.
//   node tools/plates/library/pilot-a2/build.mjs     builds the page twice into a temp directory and prints both sha256
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/pilot-a2/build.mjs --shots [theme] [lib_id ...]
//     screenshots each drawn card (theme default paper, 390 px wide, normal and Mistake) into a temp directory
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT } from '../../lib/inputs.mjs';
import { buildPlatesPage } from '../build-page.mjs';
import { groupsConfig } from '../plates-page.mjs';
import { batchFiles, rows } from '../registry.mjs';

export const PA2_ROWS = 'tools/plates/library/pilot-a2/rows.json';
export const PA2_BATCH = 'tools/plates/library/batches/pilot-a2.json';
const read = (root, p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const cardOf = (root, id) => read(root, `docs/research/howto/cards/${id.slice(4)}.json`);
/** The rows file: pilot-a2/rows.json before the pin, batches/pilot-a2.json after it (Do 7 deletes rows.json). */
export const rowsFile = (root = ROOT) => (existsSync(join(root, PA2_ROWS)) ? PA2_ROWS : PA2_BATCH);
/** A research card's source list as page lines (title, year, url, PMID). */
export const sourceLines = card => card.sources.map(s => `${s.title}${s.year ? ` (${s.year})` : ''}. ${s.url}${s.pmid ? ` PMID ${s.pmid}` : ''}`);

/** The PILOT-A2 rows data with each row's sources from its card (memory only). */
export function pa2Data(root = ROOT, data = read(root, rowsFile(root))) {
  return { ...data, rows: Object.fromEntries(Object.entries(data.rows).map(([id, r]) => [id, { ...r, sources: sourceLines(cardOf(root, id)) }])) };
}

/** Every registry row: the 8 and the batch files; before the pin, pilot-a2/rows.json read as one more batch file. */
export function pa2All(root = ROOT) {
  return rowsFile(root) === PA2_BATCH ? rows(root) : rows(root, { batches: [...batchFiles(root).map(p => [p, read(root, p)]), [PA2_ROWS, pa2Data(root)]] });
}

/** The PILOT-A2 ids whose spec file exists, in rows-file order. */
export const drawnIds = (root = ROOT, data = read(root, rowsFile(root))) => Object.entries(data.rows).filter(([, r]) => existsSync(join(root, 'tools/plates', r.src))).map(([id]) => id);

/** The PILOT-A2 plates page bytes ({ html: Buffer, warnings }) for `ids` (default: every drawn id). */
export async function buildPa2Page({ root = ROOT, all = pa2All(root), ids = drawnIds(root) } = {}) {
  return buildPlatesPage(await groupsConfig({ groups: [{ id: 'pilot-a2', title: 'Pilot A2', ids }] }, all, rowsFile(root)));
}

export const sha256 = b => createHash('sha256').update(b).digest('hex');

/** PNG screenshots of each card at 390 px in `theme`, `mode` 'mistake' or 'normal': [{ id, path }] in `dir`. */
export async function cardShots({ ids = drawnIds(), theme = 'paper', mode = 'mistake', dir = mkdtempSync(join(tmpdir(), 'pa2-shots-')) } = {}) {
  const { launch } = await import('../qa/browser.mjs'), { openGolden, settle } = await import('../../fidelity/harness.mjs');
  const html = (await buildPa2Page({ ids })).html, data = read(ROOT, rowsFile(ROOT)), browser = await launch(), out = [];
  try {
    const { ctx, page } = await openGolden(browser, theme, { viewport: { width: 390, height: 844 }, html });
    try {
      for (const id of ids) {
        const cid = data.rows[id].chromeId;
        await page.evaluate(([c, m]) => { const pill = document.getElementById(`${c}-mistake`); if ((pill.getAttribute('aria-pressed') === 'true') !== (m === 'mistake')) pill.click(); }, [cid, mode]);
        await settle(page);
        const path = join(dir, `${id}-${theme}-${mode}.png`);
        await page.locator(`#card-${cid}`).screenshot({ path });
        out.push({ id, path });
      }
    } finally { await ctx.close(); }
  } finally { await browser.close(); }
  return out;
}

const main = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (main && process.argv[2] === '--shots') {
  const [theme = 'paper', ...ids] = process.argv.slice(3);
  for (const mode of ['normal', 'mistake']) for (const { path } of await cardShots({ theme, mode, ...(ids.length ? { ids } : {}) })) console.log(path);
} else if (main) {
  const dir = mkdtempSync(join(tmpdir(), 'pilot-a2-page-')), shas = [];
  for (const n of [1, 2]) {
    const { html, warnings } = await buildPa2Page();
    if (warnings) console.error(warnings.trim());
    writeFileSync(join(dir, `pilot-a2-plates-${n}.html`), html);
    shas.push(sha256(html));
    console.log(`build ${n}: ${sha256(html)} (${html.length} B) ${join(dir, `pilot-a2-plates-${n}.html`)}`);
  }
  console.log(`ids: ${drawnIds().join(', ')}`);
  console.log(shas[0] === shas[1] ? `PQ-H7 page: identical, sha256 ${shas[0]}` : 'PQ-H7 page: the two builds DIFFER');
  if (shas[0] !== shas[1]) process.exit(1);
}
