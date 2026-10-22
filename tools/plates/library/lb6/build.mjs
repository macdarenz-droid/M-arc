// LIB-16 (lib-16-card Do 5, Do 8, A10; copied from lb6/build.mjs @ a6f4bd07): the LB6 plates page, built from
// lb6/rows.json read as if it were a batch file (it never goes into batches/: D-LIB16-AHEAD). Each row's sources lines
// come from its research card, in memory only. The page holds every LB6 row whose spec exists.
//   node tools/plates/library/lb6/build.mjs     builds the page twice into a temp directory and prints both sha256
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/lb6/build.mjs --shots [theme] [lib_id ...]
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

export const LB6_ROWS = 'tools/plates/library/lb6/rows.json';
const read = (root, p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const cardOf = (root, id) => read(root, `docs/research/howto/cards/${id.slice(4)}.json`);
/** A research card's source list as page lines (title, year, url, PMID). */
export const sourceLines = card => card.sources.map(s => `${s.title}${s.year ? ` (${s.year})` : ''}. ${s.url}${s.pmid ? ` PMID ${s.pmid}` : ''}`);

/** The LB6 rows data with each row's sources from its card (memory only). `data` defaults to lb6/rows.json. */
export function lb6Data(root = ROOT, data = read(root, LB6_ROWS)) {
  return { ...data, rows: Object.fromEntries(Object.entries(data.rows).map(([id, r]) => [id, { ...r, sources: sourceLines(cardOf(root, id)) }])) };
}

/** Every registry row: the 8, the batch files, then lb6/rows.json read as one more batch file (Do 4). */
export function lb6All(root = ROOT, data = lb6Data(root)) {
  return rows(root, { batches: [...batchFiles(root).map(p => [p, read(root, p)]), [LB6_ROWS, data]] });
}

/** The LB6 ids whose spec file exists, in rows.json order. */
export const drawnIds = (root = ROOT, data = read(root, LB6_ROWS)) => Object.entries(data.rows).filter(([, r]) => existsSync(join(root, 'tools/plates', r.src))).map(([id]) => id);

/** The LB6 plates page bytes ({ html: Buffer, warnings }) for `ids` (default: every drawn id). */
export async function buildLb6Page({ root = ROOT, all = lb6All(root), ids = drawnIds(root) } = {}) {
  return buildPlatesPage(await groupsConfig({ groups: [{ id: 'lb6', title: 'LB6', ids }] }, all, LB6_ROWS));
}

export const sha256 = b => createHash('sha256').update(b).digest('hex');

/** PNG screenshots of each card at 390 px in `theme`, `mode` 'mistake' or 'normal': [{ id, path }] in `dir`. */
export async function cardShots({ ids = drawnIds(), theme = 'paper', mode = 'mistake', dir = mkdtempSync(join(tmpdir(), 'lb6-shots-')) } = {}) {
  const { launch } = await import('../qa/browser.mjs'), { openGolden, settle } = await import('../../fidelity/harness.mjs');
  const { html } = await buildLb6Page({ ids }), data = read(ROOT, LB6_ROWS), browser = await launch(), out = [];
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

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1] && process.argv[2] === '--shots') {
  const [theme = 'paper', ...ids] = process.argv.slice(3);
  for (const mode of ['normal', 'mistake']) for (const { path } of await cardShots({ theme, mode, ...(ids.length ? { ids } : {}) })) console.log(path);
} else if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = mkdtempSync(join(tmpdir(), 'lb6-page-')), shas = [];
  for (const n of [1, 2]) {
    const { html, warnings } = await buildLb6Page();
    if (warnings) console.error(warnings.trim());
    writeFileSync(join(dir, `lb6-plates-${n}.html`), html);
    shas.push(sha256(html));
    console.log(`build ${n}: ${sha256(html)} (${html.length} B) ${join(dir, `lb6-plates-${n}.html`)}`);
  }
  console.log(`ids: ${drawnIds().join(', ')}`);
  console.log(shas[0] === shas[1] ? `PQ-H7 page: identical, sha256 ${shas[0]}` : 'PQ-H7 page: the two builds DIFFER');
  if (shas[0] !== shas[1]) process.exit(1);
}
