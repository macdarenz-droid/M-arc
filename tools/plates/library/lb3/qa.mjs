// LIB-13 (lib-13-card Do 5, Do 8): authoring-time plate QA of the LB3 rows (D-LIB9-AUTHORQA). Builds the LB3 plates
// page (build.mjs), then for each drawn id runs LIB-3's runQa, node and browser halves, on candidateOf(id, { all,
// authoring: true }): zero exemptions, no pin read, refused at approved-plate or shipped. Prints the per-id table: hard
// checks, raised flags and metrics. Writes nothing in the repo.
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/lb3/qa.mjs [lib_id ...]
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/lb3/qa.mjs --sheet
//     the LB3 owner sheet (build.mjs buildOwnerSheet; card :20-21), built twice into a temp directory with the table
import { fileURLToPath } from 'node:url';
import { makeMirror } from '../../golden.mjs';
import { candidateOf } from '../candidate.mjs';
import { browserResults, launch } from '../qa/browser.mjs';
import { dropMirror, loadEngine } from '../qa/engine.mjs';
import { FLAGS, HARD, loadPins, runQa } from '../qa/index.mjs';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildLb3Page, buildOwnerSheet, drawnIds, lb3All, sha256 } from './build.mjs';

/** { sha, reports: [runQa report] } for `ids` (default: every drawn LB3 id). */
export async function qaLb3({ ids = drawnIds(), all = lb3All(), browser: given = null } = {}) {
  const { html: buf } = await buildLb3Page({ all, ids }), html = buf.toString('utf8');
  const mirror = makeMirror(), E = await loadEngine(mirror), pins = loadPins();
  const browser = given ?? await launch();
  try {
    const cands = [];
    for (const id of ids) cands.push(await candidateOf(id, { all, platesHtml: html, engine: E, authoring: true }));
    const b = await browserResults(browser, html, cands, E, pins.envelope);
    const reports = [];
    for (const c of cands) reports.push(await runQa(c, { engine: E, pins, browser: b }));
    return { sha: sha256(buf), reports };
  } finally {
    if (!given) await browser.close();
    dropMirror(mirror);
  }
}

const f1 = v => (typeof v === 'number' ? +v.toFixed(1) : v);
/** The table rows: id | hard checks | raised flags (F5 names its element, the label text, and its contrast) | metrics. */
export const tableOf = reports => [
  '| id | hard checks | raised flags | pxPerM | cover | leaderMax | traceLen | deviation |',
  '|---|---|---|---|---|---|---|---|',
  ...reports.map(r => {
    const bad = HARD.filter(h => !r.hard[h].pass).map(h => `${h} ${r.hard[h].problems.map(p => p.key).join(', ')}`);
    const flags = FLAGS.filter(f => r.flags[f].raised).map(f => (f === 'F5' ? `F5 label text ${f1(r.flags.F5.value)}:1 < ${r.flags.F5.min}` : `${f} ${JSON.stringify(f1(r.flags[f].value))}`));
    const m = r.metrics;
    return `| ${r.id} | ${bad.length ? bad.join('; ') : 'all 10 pass'} | ${flags.join(', ') || 'none'} | ${f1(m.pxPerM)} | ${+m.cover.toFixed(3)} | ${f1(m.leaderMax)} | ${f1(m.traceLen)} | ${f1(m.deviation)} |`;
  }),
];

/** The ruled expected flags (DESIGN.md sections 6 and 16.7): F5 on every id at exactly the approved chrome's 3.57:1
 *  (D-LIB9-F5), F2 on pendlay_row (#274 6267110489), F7 on one_arm_dumbbell_row (drawable false); barbell_shrug's named
 *  F2, F3, F4 and F7 (D-LIB13S-FLAGS, -TOPFAULT); wave 2: dumbbell_shrug F2 and F4, smith_machine_shrug F2 (DESIGN.md
 *  16.11, named with the parent's reasons). */
const NAMED = { lib_pendlay_row: ['F2'], lib_one_arm_dumbbell_row: ['F7'], lib_barbell_shrug: ['F2', 'F3', 'F4', 'F7'],
  lib_dumbbell_shrug: ['F2', 'F4'], lib_smith_machine_shrug: ['F2'] };
export const EXPECTED = id => ['F5', ...(NAMED[id] ?? [])].sort();
export const F5_EXEMPT = 3.57;
/** Each report's differences from the ruled set: a missing or extra flag, or F5 at any value other than 3.57. */
export const flagProblems = reports => reports.flatMap(r => {
  const raised = FLAGS.filter(f => r.flags[f].raised).sort(), want = EXPECTED(r.id), out = [];
  if (JSON.stringify(raised) !== JSON.stringify(want)) out.push(`${r.id}: flags ${raised.join(',') || 'none'} != ruled ${want.join(',')}`);
  if (r.flags.F5.raised && +r.flags.F5.value.toFixed(2) !== F5_EXEMPT) out.push(`${r.id}: F5 ${r.flags.F5.value.toFixed(2)}:1 != the exempt ${F5_EXEMPT}:1`);
  return out;
});

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1] && process.argv[2] === '--sheet') {
  const dir = mkdtempSync(join(tmpdir(), 'lb3-sheet-')), runs = [];
  for (const n of [1, 2]) { const r = await buildOwnerSheet({ qaLb3, flagProblems, tableOf }); writeFileSync(join(dir, `lb3-sheet-${n}.html`), r.html); runs.push(r); console.log(`sheet ${n}: ${r.sheetSha} (${Buffer.byteLength(r.html)} B) ${join(dir, `lb3-sheet-${n}.html`)}; plates page ${r.pageSha}`); }
  for (const line of runs[0].table) console.log(line);
  console.log(JSON.stringify(runs[0].flags));
  const same = runs[0].sheetSha === runs[1].sheetSha && runs[0].pageSha === runs[1].pageSha;
  console.log(same ? `sheet: identical, sha256 ${runs[0].sheetSha}` : 'sheet: the two builds DIFFER');
  if (!same) process.exit(1);
} else if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const ids = process.argv.slice(2);
  const { sha, reports } = await qaLb3(ids.length ? { ids } : {});
  console.log(`LB3 plates page sha256 ${sha}`);
  for (const line of tableOf(reports)) console.log(line);
  const bad = flagProblems(reports);
  console.log(bad.length ? `flag set DIFFERS from the ruled set:\n${bad.join('\n')}` : 'flag set: equal to the ruled set (F5 3.57 on all; F2 pendlay_row; F7 one_arm_dumbbell_row; F2 F3 F4 F7 barbell_shrug; F2 F4 dumbbell_shrug; F2 smith_machine_shrug)');
  if (bad.length || reports.some(r => HARD.some(h => !r.hard[h].pass))) process.exit(1);
}
