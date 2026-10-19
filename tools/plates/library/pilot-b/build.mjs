// LIB-11 (lib-11-card Do 4, Do 7, A9): the pilot B plates page, built from pilot-b/rows.json read as if it were a batch
// file (it never goes into batches/ before the pin, Do 11). Copied from lb2/build.mjs @ 2dcbac1 (#265, D-LIB11-SMITH),
// never imported; only the names and paths differ. Each row's sources lines come from its research card, in memory only.
// The page holds every pilot B row whose spec exists (the build-ahead draws in steps).
//   node tools/plates/library/pilot-b/build.mjs     builds the page twice into a temp directory and prints both sha256
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT } from '../../lib/inputs.mjs';
import { buildPlatesPage } from '../build-page.mjs';
import { groupsConfig } from '../plates-page.mjs';
import { batchFiles, rows } from '../registry.mjs';

export const PB_ROWS = 'tools/plates/library/pilot-b/rows.json';
const read = (root, p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const cardOf = (root, id) => read(root, `docs/research/howto/cards/${id.slice(4)}.json`);
/** A research card's source list as page lines (title, year, url, PMID). */
export const sourceLines = card => card.sources.map(s => `${s.title}${s.year ? ` (${s.year})` : ''}. ${s.url}${s.pmid ? ` PMID ${s.pmid}` : ''}`);

/** The pilot B rows data with each row's sources from its card (memory only). `data` defaults to pilot-b/rows.json. */
export function pbData(root = ROOT, data = read(root, PB_ROWS)) {
  return { ...data, rows: Object.fromEntries(Object.entries(data.rows).map(([id, r]) => [id, { ...r, sources: sourceLines(cardOf(root, id)) }])) };
}

/** Every registry row: the 8, the batch files, then pilot-b/rows.json read as one more batch file (Do 4). */
export function pbAll(root = ROOT, data = pbData(root)) {
  return rows(root, { batches: [...batchFiles(root).map(p => [p, read(root, p)]), [PB_ROWS, data]] });
}

/** The pilot B ids whose spec file exists, in rows.json order. */
export const drawnIds = (root = ROOT, data = read(root, PB_ROWS)) => Object.entries(data.rows).filter(([, r]) => existsSync(join(root, 'tools/plates', r.src))).map(([id]) => id);

/** The pilot B plates page bytes ({ html: Buffer, warnings }) for `ids` (default: every drawn id). */
export async function buildPbPage({ root = ROOT, all = pbAll(root), ids = drawnIds(root) } = {}) {
  return buildPlatesPage(await groupsConfig({ groups: [{ id: 'pilot-b', title: 'Pilot B', ids }] }, all, PB_ROWS));
}

export const sha256 = b => createHash('sha256').update(b).digest('hex');

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = mkdtempSync(join(tmpdir(), 'pilot-b-page-')), shas = [];
  for (const n of [1, 2]) {
    const { html, warnings } = await buildPbPage();
    if (warnings) console.error(warnings.trim());
    writeFileSync(join(dir, `pilot-b-plates-${n}.html`), html);
    shas.push(sha256(html));
    console.log(`build ${n}: ${sha256(html)} (${html.length} B) ${join(dir, `pilot-b-plates-${n}.html`)}`);
  }
  console.log(`ids: ${drawnIds().join(', ')}`);
  console.log(shas[0] === shas[1] ? `PQ-H7 page: identical, sha256 ${shas[0]}` : 'PQ-H7 page: the two builds DIFFER');
  if (shas[0] !== shas[1]) process.exit(1);
}
