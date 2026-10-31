// LIB-15 (lib-15-card Do 5, Do 8, A10): the LB5 plates page, built from lb5/rows.json read as if it were a batch file
// (it never goes into batches/: D-LIB15-AHEAD). Each row's sources lines come from its research card (as pilot A's
// sheet does), in memory only. The page holds every LB5 row whose spec exists (the build-ahead draws in steps).
//   node tools/plates/library/lb5/build.mjs     builds the page twice into a temp directory and prints both sha256
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/lb5/build.mjs --shots [theme] [lib_id ...]
//     screenshots each drawn card's Mistake (theme default paper, 390 px wide) into a temp directory (sheet review)
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/lb5/build.mjs --sheet [lib_id ...]
//     the LB5 sheet (Do 7): Paper and Silent Black, normal and Mistake, with each id's notes, as one HTML file
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT } from '../../lib/inputs.mjs';
import { buildPlatesPage } from '../build-page.mjs';
import { groupsConfig } from '../plates-page.mjs';
import { batchFiles, rows } from '../registry.mjs';

export const LB5_ROWS = 'tools/plates/library/lb5/rows.json';
const read = (root, p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const cardOf = (root, id) => read(root, `docs/research/howto/cards/${id.slice(4)}.json`);
/** A research card's source list as page lines (title, year, url, PMID). */
export const sourceLines = card => card.sources.map(s => `${s.title}${s.year ? ` (${s.year})` : ''}. ${s.url}${s.pmid ? ` PMID ${s.pmid}` : ''}`);

/** The LB5 rows data with each row's sources from its card (memory only). `data` defaults to lb5/rows.json. */
export function lb5Data(root = ROOT, data = read(root, LB5_ROWS)) {
  return { ...data, rows: Object.fromEntries(Object.entries(data.rows).map(([id, r]) => [id, { ...r, sources: sourceLines(cardOf(root, id)) }])) };
}

/** Every registry row: the 8, the batch files, then lb5/rows.json read as one more batch file (Do 4). */
export function lb5All(root = ROOT, data = lb5Data(root)) {
  return rows(root, { batches: [...batchFiles(root).map(p => [p, read(root, p)]), [LB5_ROWS, data]] });
}

/** The LB5 ids whose spec file exists, in rows.json order. */
export const drawnIds = (root = ROOT, data = read(root, LB5_ROWS)) => Object.entries(data.rows).filter(([, r]) => existsSync(join(root, 'tools/plates', r.src))).map(([id]) => id);

/** The LB5 plates page bytes ({ html: Buffer, warnings }) for `ids` (default: every drawn id). */
export async function buildLb5Page({ root = ROOT, all = lb5All(root), ids = drawnIds(root) } = {}) {
  return buildPlatesPage(await groupsConfig({ groups: [{ id: 'lb5', title: 'LB5', ids }] }, all, LB5_ROWS));
}

export const sha256 = b => createHash('sha256').update(b).digest('hex');

/** PNG screenshots of each card at 390 px in `theme`, `mode` 'mistake' or 'normal': [{ id, path }] in `dir`. */
export async function cardShots({ ids = drawnIds(), theme = 'paper', mode = 'mistake', dir = mkdtempSync(join(tmpdir(), 'lb5-shots-')) } = {}) {
  const { launch } = await import('../qa/browser.mjs'), { openGolden, settle } = await import('../../fidelity/harness.mjs');
  const { html } = await buildLb5Page({ ids }), data = read(ROOT, LB5_ROWS), browser = await launch(), out = [];
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

/** The owner-visible notes per id on the LB5 sheet (DESIGN.md sections 6, 11, 13; rulings named). */
export const SHEET_NOTES = {
  lib_cross_body_hammer_curl: ['F7: drawable fault. The top fault, the arm fully straight at the bottom (c15), is a small elbow bend toward the camera that the front view cannot show; the plate draws the next fault, the working shoulder shrugging (c5, c6; F-LB5-1) (needs your named yes)', 'zoom: the Mistake circle at 2x on the shrugging shoulder (D-LIB15R2-ZOOM)', 'F2: cover 0.164, under the approved 0.191 (front view, standing; named)'],
  lib_incline_dumbbell_curl: ['F7: drawable fault. The top fault, the wrists bending (c11), cannot be seen from the side; the plate draws the elbows drifting forward (needs your named yes)'],
  lib_wrist_curl: ['F7: drawable fault. The top fault, the weight rolling to the fingertips (c5), needs open fingers, which the plate figure does not draw; the plate draws the lean and the arm straightening (needs your named yes)', 'zoom: the circle at 3x on the wrist and grip path; the "Forearm supported" label moved to make room (D-LIB15R2-ZOOM, -WRISTBOX)', 'F3: longest leader 94.8 px, over the approved 82.26 (named)'],
  lib_dumbbell_overhead_triceps_extension: ['zoom: the Mistake circle at 1.5x on the arching back (D-LIB15R2-ZOOM)', 'F3: longest leader 47.3 px, under the approved 49.33-82.26 (named)', 'F4: no hand-placed labels, under the approved 2-6 (named)'],
  lib_preacher_curl: ['new rig: the preacherPad composer (D-LIB15-PREACHER; preacherPad anchor)', 'plate size: its own drawn value (0.23 m), not skull_crusher\'s'],
};
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
/** The LB5 sheet (Do 7): per id, Paper and Silent Black, normal and Mistake, at 390 px, with its notes. Returns the path. */
export async function buildSheet({ ids = drawnIds(), dir = mkdtempSync(join(tmpdir(), 'lb5-sheet-')) } = {}) {
  const cells = [['paper', 'normal'], ['paper', 'mistake'], ['silent-black', 'normal'], ['silent-black', 'mistake']];
  const shots = {};
  for (const [theme, mode] of cells) for (const { id, path } of await cardShots({ ids, theme, mode, dir })) (shots[id] ??= []).push({ theme, mode, src: `data:image/png;base64,${readFileSync(path).toString('base64')}` });
  const rowsHtml = ids.map(id => `<section><h2>${id}</h2>${(SHEET_NOTES[id] ?? []).map(n => `<p class="note">${esc(n)}</p>`).join('')}<div class="row">${shots[id].map(s => `<figure><img src="${s.src}" width="390"><figcaption>${s.theme} · ${s.mode}</figcaption></figure>`).join('')}</div></section>`).join('');
  const page = `<!doctype html><meta charset="utf-8"><title>LB5 sheet</title><style>body{font:14px system-ui;margin:16px;background:#fff;color:#111}.row{display:flex;gap:12px;flex-wrap:wrap}figure{margin:0}figcaption{font-size:12px;color:#555}.note{margin:4px 0;color:#7a2a00}h2{margin:24px 0 4px}</style><h1>LB5 sheet</h1>${rowsHtml}`;
  const out = join(dir, 'lb5-sheet.html');
  writeFileSync(out, page);
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1] && process.argv[2] === '--sheet') {
  console.log(await buildSheet(process.argv.length > 3 ? { ids: process.argv.slice(3) } : {}));
} else if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1] && process.argv[2] === '--shots') {
  const [theme = 'paper', ...ids] = process.argv.slice(3);
  for (const { path } of await mistakeShots({ theme, ...(ids.length ? { ids } : {}) })) console.log(path);
} else if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = mkdtempSync(join(tmpdir(), 'lb5-page-')), shas = [];
  for (const n of [1, 2]) {
    const { html, warnings } = await buildLb5Page();
    if (warnings) console.error(warnings.trim());
    writeFileSync(join(dir, `lb5-plates-${n}.html`), html);
    shas.push(sha256(html));
    console.log(`build ${n}: ${sha256(html)} (${html.length} B) ${join(dir, `lb5-plates-${n}.html`)}`);
  }
  console.log(`ids: ${drawnIds().join(', ')}`);
  console.log(shas[0] === shas[1] ? `PQ-H7 page: identical, sha256 ${shas[0]}` : 'PQ-H7 page: the two builds DIFFER');
  if (shas[0] !== shas[1]) process.exit(1);
}
