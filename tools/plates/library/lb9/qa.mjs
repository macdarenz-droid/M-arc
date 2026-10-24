// LIB-21 (lib-21-card Do 5, Do 8; copied from lb10/qa.mjs @ a9c64e11, with lb8/qa.mjs's named flags @ d76fc305 :51-63): authoring-time plate QA of the LB9 rows (D-LIB9-AUTHORQA). Builds the LB9 plates
// page (build.mjs), then for each drawn id runs LIB-3's runQa, node and browser halves, on candidateOf(id, { all,
// authoring: true }): zero exemptions, no pin read, refused at approved-plate or shipped. Prints the per-id table: hard
// checks, raised flags and metrics. Writes nothing in the repo.
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/lb9/qa.mjs [lib_id ...]
import { fileURLToPath } from 'node:url';
import { makeMirror } from '../../golden.mjs';
import { candidateOf } from '../candidate.mjs';
import { browserResults, launch } from '../qa/browser.mjs';
import { dropMirror, loadEngine } from '../qa/engine.mjs';
import { FLAGS, HARD, loadPins, runQa } from '../qa/index.mjs';
import { buildLb9Page, drawnIds, lb9All, sha256 } from './build.mjs';

/** { sha, reports: [runQa report] } for `ids` (default: every drawn LB9 id). */
export async function qaLb9({ ids = drawnIds(), all = lb9All(), browser: given = null } = {}) {
  const { html: buf } = await buildLb9Page({ all, ids }), html = buf.toString('utf8');
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

/** The expected flags (DESIGN.md section 5, proposed for 'LB9 NOTE RULED'; D-LIB21-FLAGS): F5 on every id at exactly
 *  the approved chrome's 3.57:1 (D-LIB9-F5, 14.4); F7 on the three (b) drawable-false cards only, once drawn
 *  (D-LIB21-F7); F1 on each D-LIB21-FLOOR plate at its measured px/m (named, D-LIB18-F3KICK's form). */
export const F7_IDS = ['lib_side_plank', 'lib_russian_twist', 'lib_bicycle_crunch'];
/** F1 named per D-LIB21-FLOOR plate: its px/m from the width-filling scale (D-LIB8-floor), fixed before H3. */
export const F1_NAMED = { lib_bird_dog: 151.49 };
/** F3 named on bird_dog (D-LIB21-F3DOG, 'LB9 NOTE RULED' Q2, #312 6382248634): its longest leader, px, short of the
 *  envelope's minimum because the labels sit in open space beside their parts; never cleared by lengthening a leader. */
export const F3_NAMED = { lib_bird_dog: 26.5, lib_cable_crunch: 26.2 };
/** F2 named on cable_crunch (D-LIB21-CCFLAGS, #312 after 6382642897): ink coverage, the high-pulley cable and the column
 *  spanning the plate (as LB8's cable_kickback 0.645); its F3 above likewise. Nothing moved to clear either. */
export const F2_NAMED = { lib_cable_crunch: 0.623 };
export const EXPECTED = id => ['F5', ...(F7_IDS.includes(id) ? ['F7'] : []), ...(id in F1_NAMED ? ['F1'] : []), ...(id in F3_NAMED ? ['F3'] : []), ...(id in F2_NAMED ? ['F2'] : [])].sort();
export const F5_EXEMPT = 3.57;
/** Each report's differences from the ruled set: a missing or extra flag, F5 at any value other than 3.57, or a named
 *  F1 (F3) more than 0.1 px/m (px) from its ruled value. */
export const flagProblems = reports => reports.flatMap(r => {
  const raised = FLAGS.filter(f => r.flags[f].raised).sort(), want = EXPECTED(r.id), out = [];
  if (JSON.stringify(raised) !== JSON.stringify(want)) out.push(`${r.id}: flags ${raised.join(',') || 'none'} != ruled ${want.join(',')}`);
  if (r.flags.F5.raised && +r.flags.F5.value.toFixed(2) !== F5_EXEMPT) out.push(`${r.id}: F5 ${r.flags.F5.value.toFixed(2)}:1 != the exempt ${F5_EXEMPT}:1`);
  if (r.id in F3_NAMED && !(Math.abs(r.flags.F3.value - F3_NAMED[r.id]) <= 0.1)) out.push(`${r.id}: F3 ${r.flags.F3.value} != the named ${F3_NAMED[r.id]} px`);
  if (r.id in F2_NAMED && !(Math.abs(r.flags.F2.value - F2_NAMED[r.id]) <= 0.001)) out.push(`${r.id}: F2 ${r.flags.F2.value} != the named ${F2_NAMED[r.id]}`);
  if (r.id in F1_NAMED && !(Math.abs(r.flags.F1.value - F1_NAMED[r.id]) <= 0.1)) out.push(`${r.id}: F1 ${r.flags.F1.value} != the named ${F1_NAMED[r.id]} px/m`);
  return out;
});

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const ids = process.argv.slice(2);
  const { sha, reports } = await qaLb9(ids.length ? { ids } : {});
  console.log(`LB9 plates page sha256 ${sha}`);
  for (const line of tableOf(reports)) console.log(line);
  const bad = flagProblems(reports);
  console.log(bad.length ? `flag set DIFFERS from the ruled set:\n${bad.join('\n')}` : 'flag set: equal to the expected set (F5 3.57 on all; F7 on the (b) drawable-false cards; F1 on the named floor plates; F3 named on bird_dog and cable_crunch; F2 named on cable_crunch)');
  if (bad.length || reports.some(r => HARD.some(h => !r.hard[h].pass))) process.exit(1);
}
