// LIB-10 (lib-10-card Do 5, Do 8, A10): the LB2 plates page, built from lb2/rows.json read as if it were a batch file
// (it never goes into batches/: D-LIB10-AHEAD). Each row's sources lines come from its research card (as pilot A's
// sheet does), in memory only. The page holds every LB2 row whose spec exists (the build-ahead draws in steps).
//   node tools/plates/library/lb2/build.mjs     builds the page twice into a temp directory and prints both sha256
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT } from '../../lib/inputs.mjs';
import { buildPlatesPage } from '../build-page.mjs';
import { groupsConfig } from '../plates-page.mjs';
import { batchFiles, rows } from '../registry.mjs';

export const LB2_ROWS = 'tools/plates/library/lb2/rows.json';
const read = (root, p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const cardOf = (root, id) => read(root, `docs/research/howto/cards/${id.slice(4)}.json`);
/** A research card's source list as page lines (title, year, url, PMID). */
export const sourceLines = card => card.sources.map(s => `${s.title}${s.year ? ` (${s.year})` : ''}. ${s.url}${s.pmid ? ` PMID ${s.pmid}` : ''}`);

/** The LB2 rows data with each row's sources from its card (memory only). `data` defaults to lb2/rows.json. */
export function lb2Data(root = ROOT, data = read(root, LB2_ROWS)) {
  return { ...data, rows: Object.fromEntries(Object.entries(data.rows).map(([id, r]) => [id, { ...r, sources: sourceLines(cardOf(root, id)) }])) };
}

/** Every registry row: the 8, the batch files, then lb2/rows.json read as one more batch file (Do 4). */
export function lb2All(root = ROOT, data = lb2Data(root)) {
  return rows(root, { batches: [...batchFiles(root).map(p => [p, read(root, p)]), [LB2_ROWS, data]] });
}

/** The LB2 ids whose spec file exists, in rows.json order. */
export const drawnIds = (root = ROOT, data = read(root, LB2_ROWS)) => Object.entries(data.rows).filter(([, r]) => existsSync(join(root, 'tools/plates', r.src))).map(([id]) => id);

/** The LB2 plates page bytes ({ html: Buffer, warnings }) for `ids` (default: every drawn id). */
export async function buildLb2Page({ root = ROOT, all = lb2All(root), ids = drawnIds(root) } = {}) {
  return buildPlatesPage(await groupsConfig({ groups: [{ id: 'lb2', title: 'LB2', ids }] }, all, LB2_ROWS));
}

export const sha256 = b => createHash('sha256').update(b).digest('hex');

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = mkdtempSync(join(tmpdir(), 'lb2-page-')), shas = [];
  for (const n of [1, 2]) {
    const { html, warnings } = await buildLb2Page();
    if (warnings) console.error(warnings.trim());
    writeFileSync(join(dir, `lb2-plates-${n}.html`), html);
    shas.push(sha256(html));
    console.log(`build ${n}: ${sha256(html)} (${html.length} B) ${join(dir, `lb2-plates-${n}.html`)}`);
  }
  console.log(`ids: ${drawnIds().join(', ')}`);
  console.log(shas[0] === shas[1] ? `PQ-H7 page: identical, sha256 ${shas[0]}` : 'PQ-H7 page: the two builds DIFFER');
  if (shas[0] !== shas[1]) process.exit(1);
}
