// PILOT-A3 (pilot-a3-card Do 2): authoring-time plate QA of the PILOT-A3 rows (D-LIB8M-QA, D-LIB9-AUTHORQA). Copied from
// pilot-a2/qa.mjs @ bf4b8d4d, never imported; only the names and EXPECTED differ. Builds the PILOT-A3 plates page (build.mjs),
// then for each drawn id runs LIB-3's runQa, node and browser halves, on candidateOf(id, { all, authoring: true }): zero
// exemptions, no pin read, refused at approved-plate or shipped. Prints the per-id table: hard checks, raised flags and
// metrics. `--json <file>` also writes the reports (the sheet's input) outside the repo. Writes nothing in the repo.
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/pilot-a3/qa.mjs [--json <file>] [lib_id ...]
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { makeMirror } from '../../golden.mjs';
import { candidateOf } from '../candidate.mjs';
import { browserResults, launch } from '../qa/browser.mjs';
import { dropMirror, loadEngine } from '../qa/engine.mjs';
import { FLAGS, HARD, loadPins, runQa } from '../qa/index.mjs';
import { buildPa3Page, drawnIds, pa3All, sha256 } from './build.mjs';

/** { sha, reports: [runQa report] } for `ids` (default: every drawn PILOT-A3 id). */
export async function qaPa3({ ids = drawnIds(), all = pa3All(), browser: given = null } = {}) {
  const { html: buf } = await buildPa3Page({ all, ids }), html = buf.toString('utf8');
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

/** The raised flags per id (pilot-a3-card, measured on bf4b8d4d): F5 3.57 on both (D-LIB9-F5); F3 and F4 as measured. */
export const EXPECTED = {
  lib_reverse_lunge: ['F3', 'F4', 'F5'], lib_dumbbell_fly: ['F3', 'F5'],
};
export const F5_EXEMPT = 3.57;
/** Differences between the raised flags and EXPECTED, and an F5 value other than the exempt 3.57. */
export const flagProblems = reports => reports.flatMap(r => {
  const raised = FLAGS.filter(f => r.flags[f].raised).sort(), want = EXPECTED[r.id] ?? [], out = [];
  if (JSON.stringify(raised) !== JSON.stringify(want)) out.push(`${r.id}: flags ${raised.join(',') || 'none'} != expected ${want.join(',')}`);
  if (r.flags.F5.raised && +r.flags.F5.value.toFixed(2) !== F5_EXEMPT) out.push(`${r.id}: F5 ${r.flags.F5.value.toFixed(2)}:1 != the exempt ${F5_EXEMPT}:1`);
  return out;
});

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2), j = args.indexOf('--json'), out = j >= 0 ? args.splice(j, 2)[1] : null;
  const { sha, reports } = await qaPa3(args.length ? { ids: args } : {});
  console.log(`PILOT-A3 plates page sha256 ${sha}`);
  for (const line of tableOf(reports)) console.log(line);
  if (out) writeFileSync(out, JSON.stringify({ sha, reports }, null, 1) + '\n');
  const bad = flagProblems(reports);
  console.log(bad.length ? `flag set DIFFERS from the expected set:\n${bad.join('\n')}` : 'flag set: equal to the expected set');
  if (bad.length || reports.some(r => HARD.some(h => !r.hard[h].pass))) process.exit(1);
}
