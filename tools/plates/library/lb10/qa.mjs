// LIB-22 (lib-22-card Do 5, Do 8; copied from lb7/qa.mjs @ 5a9f004c): authoring-time plate QA of the LB10 rows (D-LIB9-AUTHORQA). Builds the LB10 plates
// page (build.mjs), then for each drawn id runs LIB-3's runQa, node and browser halves, on candidateOf(id, { all,
// authoring: true }): zero exemptions, no pin read, refused at approved-plate or shipped. Prints the per-id table: hard
// checks, raised flags and metrics. Writes nothing in the repo.
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/lb10/qa.mjs [lib_id ...]
import { fileURLToPath } from 'node:url';
import { makeMirror } from '../../golden.mjs';
import { candidateOf } from '../candidate.mjs';
import { browserResults, launch } from '../qa/browser.mjs';
import { dropMirror, loadEngine } from '../qa/engine.mjs';
import { FLAGS, HARD, loadPins, runQa } from '../qa/index.mjs';
import { buildLb10Page, drawnIds, lb10All, sha256 } from './build.mjs';

/** { sha, reports: [runQa report] } for `ids` (default: every drawn LB10 id). */
export async function qaLb10({ ids = drawnIds(), all = lb10All(), browser: given = null } = {}) {
  const { html: buf } = await buildLb10Page({ all, ids }), html = buf.toString('utf8');
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

/** The expected flags (DESIGN.md section 5, ruled 'LB10 NOTE RULED', #305 6355155831): F5 on every id at exactly the
 *  approved chrome's 3.57:1 (D-LIB9-F5, 14.4); F7 on the four drawable-false cards only (D-LIB22-F7); F1 on bear_crawl
 *  only (D-LIB22-FLOOR). */
export const F7_IDS = ['lib_farmer_s_carry', 'lib_burpee', 'lib_jumping_jacks', 'lib_medicine_ball_slam'];
export const F1_IDS = ['lib_bear_crawl'];
/** Named F2 (#305 6359365488 item 0, as cable_kickback's F2 on #306): battle_ropes' coverage 0.552 against F2's 0.549
 *  maximum at the standard 146.29 px/m; nothing changed to dodge it. */
export const F2_IDS = ['lib_battle_ropes'];
export const EXPECTED = id => ['F5', ...(F7_IDS.includes(id) ? ['F7'] : []), ...(F1_IDS.includes(id) ? ['F1'] : []), ...(F2_IDS.includes(id) ? ['F2'] : [])].sort();
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
  const { sha, reports } = await qaLb10(ids.length ? { ids } : {});
  console.log(`LB10 plates page sha256 ${sha}`);
  for (const line of tableOf(reports)) console.log(line);
  const bad = flagProblems(reports);
  console.log(bad.length ? `flag set DIFFERS from the ruled set:\n${bad.join('\n')}` : 'flag set: equal to the expected set (F5 3.57 on all; F7 on the drawable-false cards; F1 on bear_crawl; F2 on battle_ropes)');
  if (bad.length || reports.some(r => HARD.some(h => !r.hard[h].pass))) process.exit(1);
}
