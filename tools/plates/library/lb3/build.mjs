// LIB-13 (lib-13-card Do 5, Do 8, A10): the LB3 plates page, built from lb3/rows.json read as if it were a batch file
// (it never goes into batches/: D-LIB13-AHEAD). Each row's sources lines come from its research card (as pilot A's
// sheet does), in memory only. The page holds every LB3 row whose spec exists (the build-ahead draws in steps).
//   node tools/plates/library/lb3/build.mjs     builds the page twice into a temp directory and prints both sha256
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/lb3/build.mjs --shots [theme] [lib_id ...]
//     screenshots each drawn card's Mistake (theme default paper, 390 px wide) into a temp directory (sheet review)
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/lb3/build.mjs --sheet [lib_id ...]
//     the LB3 sheet (Do 7): Paper and Silent Black, normal and Mistake, with each id's notes, as one HTML file
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT } from '../../lib/inputs.mjs';
import { buildPlatesPage } from '../build-page.mjs';
import { groupsConfig } from '../plates-page.mjs';
import { batchFiles, rows } from '../registry.mjs';

export const LB3_ROWS = 'tools/plates/library/lb3/rows.json';
const read = (root, p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const cardOf = (root, id) => read(root, `docs/research/howto/cards/${id.slice(4)}.json`);
/** A research card's source list as page lines (title, year, url, PMID). */
export const sourceLines = card => card.sources.map(s => `${s.title}${s.year ? ` (${s.year})` : ''}. ${s.url}${s.pmid ? ` PMID ${s.pmid}` : ''}`);

/** The LB3 rows data with each row's sources from its card (memory only). `data` defaults to lb3/rows.json. */
export function lb3Data(root = ROOT, data = read(root, LB3_ROWS)) {
  return { ...data, rows: Object.fromEntries(Object.entries(data.rows).map(([id, r]) => [id, { ...r, sources: sourceLines(cardOf(root, id)) }])) };
}

/** Every registry row: the 8, the batch files, then lb3/rows.json read as one more batch file (Do 4). */
export function lb3All(root = ROOT, data = lb3Data(root)) {
  return rows(root, { batches: [...batchFiles(root).map(p => [p, read(root, p)]), [LB3_ROWS, data]] });
}

/** The LB3 ids whose spec file exists, in rows.json order. */
export const drawnIds = (root = ROOT, data = read(root, LB3_ROWS)) => Object.entries(data.rows).filter(([, r]) => existsSync(join(root, 'tools/plates', r.src))).map(([id]) => id);

/** The LB3 plates page bytes ({ html: Buffer, warnings }) for `ids` (default: every drawn id). */
export async function buildLb3Page({ root = ROOT, all = lb3All(root), ids = drawnIds(root) } = {}) {
  return buildPlatesPage(await groupsConfig({ groups: [{ id: 'lb3', title: 'LB3', ids }] }, all, LB3_ROWS));
}

export const sha256 = b => createHash('sha256').update(b).digest('hex');

/** PNG screenshots of each card at 390 px in `theme`, `mode` 'mistake' or 'normal': [{ id, path }] in `dir`. */
export async function cardShots({ ids = drawnIds(), theme = 'paper', mode = 'mistake', dir = mkdtempSync(join(tmpdir(), 'lb3-shots-')) } = {}) {
  const { launch } = await import('../qa/browser.mjs'), { openGolden, settle } = await import('../../fidelity/harness.mjs');
  const { html } = await buildLb3Page({ ids }), data = read(ROOT, LB3_ROWS), browser = await launch(), out = [];
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
export const mistakeShots = opts => cardShots({ ...opts, mode: 'mistake' });

/** The owner-visible notes per id on the LB3 sheet (DESIGN.md sections 6, 11, 13; rulings named). */
export const SHEET_NOTES = {
  lib_pendlay_row: ['F2 cover 0.163 (named flag, #274 6267110489): a held hinge, only the arms and the bar move'],
  lib_landmine_row: ['plate size: drawing convention (228 mm) (D-LIB13-TBAR)', 'new rig: the landmine composer (D-LIB13-LANDMINE; landmine anchor)'],
  lib_one_arm_dumbbell_row: ['F7: drawable fault. The top fault, momentum (c10), shows only as speed; the plate draws the next fault on the list, the short range (needs your named yes)', 'support anchor (D-LIB13-SUPPORT): back_extension is shown with it'],
  lib_sumo_deadlift: ['a pure side view cannot show the wide stance and turned-out feet, so it reads close to a conventional deadlift with low hips (panel note, D-LIB13-PANEL1)', 'stance drawn 30 cm apart, toes out 10 deg: the engine foot has no roll, so c2\'s 70 cm and 42 deg cannot be drawn'],
  lib_back_extension: ['shown with its support anchor, one_arm_dumbbell_row (D-LIB13-SUPPORT); redrawn if the anchor is rejected'],
};
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
/** The LB3 sheet (Do 7): per id, Paper and Silent Black, normal and Mistake, at 390 px, with its notes. Returns the path. */
export async function buildSheet({ ids = drawnIds(), dir = mkdtempSync(join(tmpdir(), 'lb3-sheet-')) } = {}) {
  const cells = [['paper', 'normal'], ['paper', 'mistake'], ['silent-black', 'normal'], ['silent-black', 'mistake']];
  const shots = {};
  for (const [theme, mode] of cells) for (const { id, path } of await cardShots({ ids, theme, mode, dir })) (shots[id] ??= []).push({ theme, mode, src: `data:image/png;base64,${readFileSync(path).toString('base64')}` });
  const rowsHtml = ids.map(id => `<section><h2>${id}</h2>${(SHEET_NOTES[id] ?? []).map(n => `<p class="note">${esc(n)}</p>`).join('')}<div class="row">${shots[id].map(s => `<figure><img src="${s.src}" width="390"><figcaption>${s.theme} · ${s.mode}</figcaption></figure>`).join('')}</div></section>`).join('');
  const page = `<!doctype html><meta charset="utf-8"><title>LB3 sheet</title><style>body{font:14px system-ui;margin:16px;background:#fff;color:#111}.row{display:flex;gap:12px;flex-wrap:wrap}figure{margin:0}figcaption{font-size:12px;color:#555}.note{margin:4px 0;color:#7a2a00}h2{margin:24px 0 4px}</style><h1>LB3 sheet</h1>${rowsHtml}`;
  const out = join(dir, 'lb3-sheet.html');
  writeFileSync(out, page);
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1] && process.argv[2] === '--sheet') {
  console.log(await buildSheet(process.argv.length > 3 ? { ids: process.argv.slice(3) } : {}));
} else if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1] && process.argv[2] === '--shots') {
  const [theme = 'paper', ...ids] = process.argv.slice(3);
  for (const { path } of await mistakeShots({ theme, ...(ids.length ? { ids } : {}) })) console.log(path);
} else if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = mkdtempSync(join(tmpdir(), 'lb3-page-')), shas = [];
  for (const n of [1, 2]) {
    const { html, warnings } = await buildLb3Page();
    if (warnings) console.error(warnings.trim());
    writeFileSync(join(dir, `lb3-plates-${n}.html`), html);
    shas.push(sha256(html));
    console.log(`build ${n}: ${sha256(html)} (${html.length} B) ${join(dir, `lb3-plates-${n}.html`)}`);
  }
  console.log(`ids: ${drawnIds().join(', ')}`);
  console.log(shas[0] === shas[1] ? `PQ-H7 page: identical, sha256 ${shas[0]}` : 'PQ-H7 page: the two builds DIFFER');
  if (shas[0] !== shas[1]) process.exit(1);
}
