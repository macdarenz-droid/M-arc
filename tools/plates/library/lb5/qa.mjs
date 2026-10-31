// LIB-15 (lib-15-card Do 5, Do 8): authoring-time plate QA of the LB5 rows (D-LIB9-AUTHORQA). Builds the LB5 plates
// page (build.mjs), then for each drawn id runs LIB-3's runQa, node and browser halves, on candidateOf(id, { all,
// authoring: true }): zero exemptions, no pin read, refused at approved-plate or shipped. Prints the per-id table: hard
// checks, raised flags and metrics. Writes nothing in the repo.
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/lb5/qa.mjs [lib_id ...]
import { fileURLToPath } from 'node:url';
import { makeMirror } from '../../golden.mjs';
import { candidateOf } from '../candidate.mjs';
import { browserResults, launch } from '../qa/browser.mjs';
import { dropMirror, loadEngine } from '../qa/engine.mjs';
import { FLAGS, HARD, loadPins, runQa } from '../qa/index.mjs';
import { buildLb5Page, drawnIds, lb5All, sha256 } from './build.mjs';

/** { sha, reports: [runQa report] } for `ids` (default: every drawn LB5 id). */
export async function qaLb5({ ids = drawnIds(), all = lb5All(), browser: given = null } = {}) {
  const { html: buf } = await buildLb5Page({ all, ids }), html = buf.toString('utf8');
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

/** The expected flags (DESIGN.md section 6): F5 on every id at exactly the approved chrome's 3.57:1 (D-LIB9-F5), F7 on
 *  the drawable-fault ids (D-LIB15-F7), F2 on the low-cover ids ruled named flags (D-LIB15-F2: #290 6345185694,
 *  6340022161). */
export const F7_IDS = ['lib_cross_body_hammer_curl', 'lib_incline_dumbbell_curl', 'lib_wrist_curl'];
export const F2_IDS = ['lib_concentration_curl', 'lib_wrist_curl', 'lib_cross_body_hammer_curl'];
/** LIB-15R2 (DESIGN.md 17.3, proposed named flags on the zoom rows): F3 (the longest leader outside 49.33-82.26) and F4
 *  (hand-boxed labels outside 2-6). */
export const F3_IDS = ['lib_dumbbell_overhead_triceps_extension', 'lib_wrist_curl'];
export const F4_IDS = ['lib_dumbbell_overhead_triceps_extension'];
export const EXPECTED = id => ['F5', ...(F7_IDS.includes(id) ? ['F7'] : []), ...(F2_IDS.includes(id) ? ['F2'] : []),
  ...(F3_IDS.includes(id) ? ['F3'] : []), ...(F4_IDS.includes(id) ? ['F4'] : [])].sort();
export const F5_EXEMPT = 3.57;
/** Each report's differences from the ruled set: a missing or extra flag, or F5 at any value other than 3.57. */
export const flagProblems = reports => reports.flatMap(r => {
  const raised = FLAGS.filter(f => r.flags[f].raised).sort(), want = EXPECTED(r.id), out = [];
  if (JSON.stringify(raised) !== JSON.stringify(want)) out.push(`${r.id}: flags ${raised.join(',') || 'none'} != ruled ${want.join(',')}`);
  if (r.flags.F5.raised && +r.flags.F5.value.toFixed(2) !== F5_EXEMPT) out.push(`${r.id}: F5 ${r.flags.F5.value.toFixed(2)}:1 != the exempt ${F5_EXEMPT}:1`);
  return out;
});

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const ids = process.argv.slice(2);
  const { sha, reports } = await qaLb5(ids.length ? { ids } : {});
  console.log(`LB5 plates page sha256 ${sha}`);
  for (const line of tableOf(reports)) console.log(line);
  const bad = flagProblems(reports);
  console.log(bad.length ? `flag set DIFFERS from the ruled set:\n${bad.join('\n')}` : 'flag set: equal to the ruled set (F5 3.57 on all; F7 cross_body_hammer_curl, incline_dumbbell_curl, wrist_curl)');
  if (bad.length || reports.some(r => HARD.some(h => !r.hard[h].pass))) process.exit(1);
}
