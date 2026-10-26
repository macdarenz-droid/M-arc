// LIB-18 (lib-18-card Do 5, Do 8, A10; copied from lb7/build.mjs @ 5a9f004c): the
// LB8 plates page, built from lb8/rows.json read as if it were a batch file (it never goes into batches/: D-LIB18-AHEAD).
// Each row's sources lines come from its research card, in memory only. The page holds every LB8 row whose spec exists.
//   node tools/plates/library/lb8/build.mjs     builds the page twice into a temp directory and prints both sha256
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/lb8/build.mjs --shots [theme] [lib_id ...]
//     screenshots each drawn card (theme default paper, 390 px wide, normal and Mistake) into a temp directory
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/lb8/build.mjs --held [theme] [lib_id ...]
//     the held renders (Do 5): the ids held under D-LIB18-SIZE or -CALF (none has no seconds: D-LIB18-SECS), as rows added in
//     memory only, on a separate page in a temp directory (build-page.mjs draws no tempo strip for a spec with none),
//     screenshotted at 390 px. That page is never passed to candidateOf, runQa or the critic, and is never evidence.
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT } from '../../lib/inputs.mjs';
import { buildPlatesPage } from '../build-page.mjs';
import { groupsConfig } from '../plates-page.mjs';
import { batchFiles, rows } from '../registry.mjs';

export const LB8_ROWS = 'tools/plates/library/lb8/rows.json';
const read = (root, p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const cardOf = (root, id) => read(root, `docs/research/howto/cards/${id.slice(4)}.json`);
/** A research card's source list as page lines (title, year, url, PMID). */
export const sourceLines = card => card.sources.map(s => `${s.title}${s.year ? ` (${s.year})` : ''}. ${s.url}${s.pmid ? ` PMID ${s.pmid}` : ''}`);

/** The LB8 rows data with each row's sources from its card (memory only). `data` defaults to lb8/rows.json. */
export function lb8Data(root = ROOT, data = read(root, LB8_ROWS)) {
  return { ...data, rows: Object.fromEntries(Object.entries(data.rows).map(([id, r]) => [id, { ...r, sources: sourceLines(cardOf(root, id)) }])) };
}

/** Every registry row: the 8, the batch files, then lb8/rows.json read as one more batch file (Do 5). */
export function lb8All(root = ROOT, data = lb8Data(root)) {
  return rows(root, { batches: [...batchFiles(root).map(p => [p, read(root, p)]), [LB8_ROWS, data]] });
}

/** The LB8 ids whose spec file exists, in rows.json order. */
export const drawnIds = (root = ROOT, data = read(root, LB8_ROWS)) => Object.entries(data.rows).filter(([, r]) => existsSync(join(root, 'tools/plates', r.src))).map(([id]) => id);

/** The LB8 plates page bytes ({ html: Buffer, warnings }) for `ids` (default: every drawn id). */
export async function buildLb8Page({ root = ROOT, all = lb8All(root), ids = drawnIds(root) } = {}) {
  return buildPlatesPage(await groupsConfig({ groups: [{ id: 'lb8', title: 'LB8', ids }] }, all, LB8_ROWS));
}

export const sha256 = b => createHash('sha256').update(b).digest('hex');

/** PNG screenshots of each card at 390 px in `theme`, `mode` 'mistake' or 'normal': [{ id, path }] in `dir`. */
export async function cardShots({ ids = drawnIds(), theme = 'paper', mode = 'mistake', dir = mkdtempSync(join(tmpdir(), 'lb8-shots-')), page: given = null } = {}) {
  const { launch } = await import('../qa/browser.mjs'), { openGolden, settle } = await import('../../fidelity/harness.mjs');
  const { html, data } = given ?? { html: (await buildLb8Page({ ids })).html, data: read(ROOT, LB8_ROWS) }, browser = await launch(), out = [];
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

/** The ids drawn but held off rows.json (DESIGN.md held table): any held under D-LIB18-SIZE, -CALF or S1-S4 (D-LIB8M-CARDTRUE).
 *  Each with its census view. Empty until a drawn plate is held. */
export const HELD = { seated_calf_raise: 'side', standing_calf_raise: 'side', bodyweight_calf_raise: 'side', resisted_hip_flexion: 'side', glute_bridge: 'side' };
const slugOf = id => id.replace(/_/g, '-');
/** The held rows, in memory only (never written to rows.json or any file under the repo), for the held ids whose spec exists. */
export function heldData(root = ROOT, only = null) {
  const rowsOut = {};
  for (const [id, view] of Object.entries(HELD)) if ((!only || only.includes(`lib_${id}`)) && existsSync(join(root, `tools/plates/library/specs/${id}.mjs`))) {
    const s = slugOf(id);
    rowsOut[`lib_${id}`] = { src: `library/specs/${id}.mjs`, slug: s, prefix: s, chromeId: s, mode: 'H', stage: 'drawing', view };
  }
  return { ...read(root, LB8_ROWS), rows: rowsOut };
}
/** The held page ({ html, data, ids }): a separate page of the held rows only, in memory; never evidence (Do 5). */
export async function buildHeldPage(root = ROOT, only = null) {
  const data = heldData(root, only), withSources = lb8Data(root, data), ids = Object.keys(data.rows);
  const all = rows(root, { batches: [...batchFiles(root).map(p => [p, read(root, p)]), ['tools/plates/library/lb8/held (memory)', withSources]] });
  const { html } = await buildPlatesPage(await groupsConfig({ groups: [{ id: 'lb8-held', title: 'LB8 held', ids }] }, all, 'tools/plates/library/lb8/held (memory)'));
  return { html, data, ids, all };
}

const main = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (main && process.argv[2] === '--held') {
  const [theme = 'paper', ...only] = process.argv.slice(3), page = await buildHeldPage(ROOT, only.length ? only : null), dir = mkdtempSync(join(tmpdir(), 'lb8-held-'));
  for (const mode of ['normal', 'mistake']) for (const { path } of await cardShots({ ids: page.ids, theme, mode, dir, page })) console.log(path);
} else if (main && process.argv[2] === '--shots') {
  const [theme = 'paper', ...ids] = process.argv.slice(3);
  for (const mode of ['normal', 'mistake']) for (const { path } of await cardShots({ theme, mode, ...(ids.length ? { ids } : {}) })) console.log(path);
} else if (main) {
  const dir = mkdtempSync(join(tmpdir(), 'lb8-page-')), shas = [];
  for (const n of [1, 2]) {
    const { html, warnings } = await buildLb8Page();
    if (warnings) console.error(warnings.trim());
    writeFileSync(join(dir, `lb8-plates-${n}.html`), html);
    shas.push(sha256(html));
    console.log(`build ${n}: ${sha256(html)} (${html.length} B) ${join(dir, `lb8-plates-${n}.html`)}`);
  }
  console.log(`ids: ${drawnIds().join(', ')}`);
  console.log(shas[0] === shas[1] ? `PQ-H7 page: identical, sha256 ${shas[0]}` : 'PQ-H7 page: the two builds DIFFER');
  if (shas[0] !== shas[1]) process.exit(1);
}
