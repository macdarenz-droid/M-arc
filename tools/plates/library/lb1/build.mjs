// LIB-9a (lib-9a-card Do 4, Do 7, A10): the LB1 plates page. LIB-SHIP W3 (D-SHIP-MOVE as amended by Q-W2-10; W2's
// pilot-b2/build.mjs precedent) moved the rows into batches/lb01.json with their sources lines and deleted lb1/rows.json.
// The page is built from the registry's batch file; a lb1/rows.json written back is read as one more batch file again,
// so a row copied back there is refused (registry.mjs: a row in two places). The page holds every LB1 row whose spec
// exists (leg_press_calf_raise has none: left-out, D-OWNER-LIB142).
//   node tools/plates/library/lb1/build.mjs     builds the page twice into a temp directory and prints both sha256
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT } from '../../lib/inputs.mjs';
import { buildPlatesPage } from '../build-page.mjs';
import { groupsConfig } from '../plates-page.mjs';
import { batchFiles, rows } from '../registry.mjs';

export const LB1_ROWS = 'tools/plates/library/lb1/rows.json';
export const LB1_BATCH = 'tools/plates/library/batches/lb01.json';
/** The rows file: lb1/rows.json if it exists (a copy-back), else batches/lb01.json (LIB-SHIP W3). */
export const rowsFile = (root = ROOT) => (existsSync(join(root, LB1_ROWS)) ? LB1_ROWS : LB1_BATCH);
const read = (root, p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const cardOf = (root, id) => read(root, `docs/research/howto/cards/${id.slice(4)}.json`);
/** A research card's source list as page lines (title, year, url, PMID). */
export const sourceLines = card => card.sources.map(s => `${s.title}${s.year ? ` (${s.year})` : ''}. ${s.url}${s.pmid ? ` PMID ${s.pmid}` : ''}`);

/** The LB1 rows data with each row's sources from its card (memory only). `data` defaults to lb1/rows.json. */
export function lb1Data(root = ROOT, data = read(root, rowsFile(root))) {
  return { ...data, rows: Object.fromEntries(Object.entries(data.rows).map(([id, r]) => [id, { ...r, sources: sourceLines(cardOf(root, id)) }])) };
}

/** Every registry row: the 8 and the batch files with `data` in place of batches/lb01.json; a lb1/rows.json copy-back is
 *  read as one more batch file (so its rows are refused as duplicates). */
export function lb1All(root = ROOT, data = lb1Data(root)) {
  if (rowsFile(root) === LB1_ROWS) return rows(root, { batches: [...batchFiles(root).map(p => [p, read(root, p)]), [LB1_ROWS, data]] });
  return rows(root, { batches: batchFiles(root).map(p => [p, p === LB1_BATCH ? data : read(root, p)]) });
}

/** The LB1 ids whose spec file exists, in rows-file order. */
export const drawnIds = (root = ROOT, data = read(root, rowsFile(root))) => Object.entries(data.rows).filter(([, r]) => existsSync(join(root, 'tools/plates', r.src))).map(([id]) => id);

/** The LB1 plates page bytes ({ html: Buffer, warnings }) for `ids` (default: every drawn id). */
export async function buildLb1Page({ root = ROOT, all = lb1All(root), ids = drawnIds(root) } = {}) {
  return buildPlatesPage(await groupsConfig({ groups: [{ id: 'lb1', title: 'LB1', ids }] }, all, rowsFile(root)));
}

export const sha256 = b => createHash('sha256').update(b).digest('hex');

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = mkdtempSync(join(tmpdir(), 'lb1-page-')), shas = [];
  for (const n of [1, 2]) {
    const { html, warnings } = await buildLb1Page();
    if (warnings) console.error(warnings.trim());
    writeFileSync(join(dir, `lb1-plates-${n}.html`), html);
    shas.push(sha256(html));
    console.log(`build ${n}: ${sha256(html)} (${html.length} B) ${join(dir, `lb1-plates-${n}.html`)}`);
  }
  console.log(`ids: ${drawnIds().join(', ')}`);
  console.log(shas[0] === shas[1] ? `PQ-H7 page: identical, sha256 ${shas[0]}` : 'PQ-H7 page: the two builds DIFFER');
  if (shas[0] !== shas[1]) process.exit(1);
}
