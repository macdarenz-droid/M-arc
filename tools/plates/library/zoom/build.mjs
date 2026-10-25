// LIB-ZOOM: the plates page of the zoom rows (zoom/rows.json, read as one more batch file after LB1's, as
// lb1/build.mjs reads its own), and the authoring-time plate QA of those rows (LIB-3's runQa, node and browser halves,
// zero exemptions). Writes nothing in the repo.
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/zoom/build.mjs [lib_id ...]
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT } from '../../lib/inputs.mjs';
import { makeMirror } from '../../golden.mjs';
import { buildPlatesPage } from '../build-page.mjs';
import { candidateOf } from '../candidate.mjs';
import { groupsConfig } from '../plates-page.mjs';
import { browserResults, launch } from '../qa/browser.mjs';
import { dropMirror, loadEngine } from '../qa/engine.mjs';
import { loadPins, runQa } from '../qa/index.mjs';
import { batchFiles, rows } from '../registry.mjs';
import { LB1_ROWS, lb1Data, sha256 } from '../lb1/build.mjs';
import { tableOf } from '../lb1/qa.mjs';

export const ZOOM_ROWS = 'tools/plates/library/zoom/rows.json';
const read = (root, p) => JSON.parse(readFileSync(join(root, p), 'utf8'));

/** Every registry row: the 8, the batch files, LB1's rows, then zoom/rows.json (sources from each row's card). */
export function zoomAll(root = ROOT) {
  return rows(root, { batches: [...batchFiles(root).map(p => [p, read(root, p)]), [LB1_ROWS, lb1Data(root)], [ZOOM_ROWS, lb1Data(root, read(root, ZOOM_ROWS))]] });
}
export const zoomIds = (root = ROOT) => Object.keys(read(root, ZOOM_ROWS).rows);

export async function buildZoomPage({ root = ROOT, all = zoomAll(root), ids = zoomIds(root) } = {}) {
  return buildPlatesPage(await groupsConfig({ groups: [{ id: 'zoom', title: 'LIB-ZOOM', ids }] }, all, ZOOM_ROWS));
}

/** { sha, reports } of the zoom rows' authoring QA (node and browser). */
export async function qaZoom({ ids = zoomIds(), all = zoomAll() } = {}) {
  const { html: buf } = await buildZoomPage({ all, ids }), html = buf.toString('utf8');
  const mirror = makeMirror(), E = await loadEngine(mirror), pins = loadPins(), browser = await launch();
  try {
    const cands = [];
    for (const id of ids) cands.push(await candidateOf(id, { all, platesHtml: html, engine: E, authoring: true }));
    const b = await browserResults(browser, html, cands, E, pins.envelope);
    const reports = [];
    for (const c of cands) reports.push(await runQa(c, { engine: E, pins, browser: b }));
    return { sha: sha256(buf), reports };
  } finally { await browser.close(); dropMirror(mirror); }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const ids = process.argv.slice(2);
  const { sha, reports } = await qaZoom(ids.length ? { ids } : {});
  console.log(`LIB-ZOOM plates page sha256 ${sha}`);
  for (const line of tableOf(reports)) console.log(line);
}
