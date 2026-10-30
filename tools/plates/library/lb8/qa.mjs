// LIB-18 (lib-18-card Do 5, Do 8; copied from lb8/qa.mjs @ 5a9f004c): authoring-time plate QA of the LB8 rows (D-LIB9-AUTHORQA). Builds the LB8 plates
// page (build.mjs), then for each drawn id runs LIB-3's runQa, node and browser halves, on candidateOf(id, { all,
// authoring: true }): zero exemptions, no pin read, refused at approved-plate or shipped. Prints the per-id table: hard
// checks, raised flags and metrics. Writes nothing in the repo, but `--held --record` writes lb8/held-flags.json.
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/lb8/qa.mjs [--held [--record] | lib_id ...]
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { makeMirror } from '../../golden.mjs';
import { candidateOf } from '../candidate.mjs';
import { browserResults, launch } from '../qa/browser.mjs';
import { dropMirror, loadEngine } from '../qa/engine.mjs';
import { FLAGS, HARD, loadPins, runQa } from '../qa/index.mjs';
import { HELD, buildHeldPage, buildLb8Page, drawnIds, lb8All, sha256 } from './build.mjs';

/** { sha, reports: [runQa report] } for `ids` (default: every drawn LB8 id). */
export async function qaLb8({ ids = drawnIds(), all = lb8All(), browser: given = null, page = null } = {}) {
  const buf = page ?? (await buildLb8Page({ all, ids })).html, html = buf.toString('utf8');
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

/** The expected flags (DESIGN.md section 6, proposed for 'LB8 NOTE RULED'): F5 on every id at exactly the approved
 *  chrome's 3.57:1 (D-LIB9-F5, 14.4); F7 on the six drawable-false cards only (D-LIB18-F7); F2 on the three named
 *  flags at their posted values (cable_kickback, 6355447835 Q7; glute_bridge and bodyweight_calf_raise, 6357883031
 *  items 2d and 4). */
export const F7_IDS = ['lib_pendulum_squat', 'lib_lying_leg_curl', 'lib_standing_leg_curl', 'lib_seated_calf_raise', 'lib_standing_calf_raise', 'lib_bodyweight_calf_raise'];
export const F2_NAMED = { lib_glute_bridge: 0.134, lib_bodyweight_calf_raise: 0.103, lib_cable_kickback: 0.645 };
/** F3 named on cable_kickback (D-LIB18-F3KICK, 6372672239): its longest leader, px. */
export const F3_NAMED = { lib_cable_kickback: 37.8 };
export const EXPECTED = id => ['F5', ...(F7_IDS.includes(id) ? ['F7'] : []), ...(id in F2_NAMED ? ['F2'] : []), ...(id in F3_NAMED ? ['F3'] : [])].sort();
export const F5_EXEMPT = 3.57;
/** Each report's differences from the ruled set: a missing or extra flag, F5 at any value other than 3.57, or a named
 *  F2 more than 0.001 (a named F3 more than 0.1 px) from its posted value. */
export const flagProblems = reports => reports.flatMap(r => {
  const raised = FLAGS.filter(f => r.flags[f].raised).sort(), want = EXPECTED(r.id), out = [];
  if (JSON.stringify(raised) !== JSON.stringify(want)) out.push(`${r.id}: flags ${raised.join(',') || 'none'} != ruled ${want.join(',')}`);
  if (r.flags.F5.raised && +r.flags.F5.value.toFixed(2) !== F5_EXEMPT) out.push(`${r.id}: F5 ${r.flags.F5.value.toFixed(2)}:1 != the exempt ${F5_EXEMPT}:1`);
  if (r.id in F2_NAMED && !(Math.abs(r.flags.F2.value - F2_NAMED[r.id]) <= 0.001)) out.push(`${r.id}: F2 ${r.flags.F2.value} != the named ${F2_NAMED[r.id]}`);
  if (r.id in F3_NAMED && !(Math.abs(r.flags.F3.value - F3_NAMED[r.id]) <= 0.1)) out.push(`${r.id}: F3 ${r.flags.F3.value} != the named ${F3_NAMED[r.id]}`);
  return out;
});
/** The named flags' browser-measured values, recorded by `qa.mjs --held --record` (the unit run has no browser): the
 *  held page's sha256 (the named plates still held), the sha256 of the LB8 page of the named plates on rows.json, and
 *  each named plate's flags. lb8-plates.test.ts checks the
 *  recording against the ruled set and against the held page built now, so any drawing change needs a new recording. */
export const HELD_FLAGS = fileURLToPath(new URL('./held-flags.json', import.meta.url));
/** runQa on held ids (in memory, the held page; never evidence for rows.json). */
export async function qaHeld(ids, opts = {}) {
  const page = await buildHeldPage(undefined, ids);
  return qaLb8({ ids: page.ids, all: page.all, page: page.html, ...opts });
}

/** The named plates split by where they are drawn: still held (the held page) or on rows.json ('LIB-18 resume': the LB8
 *  page of those rows alone). */
export const namedSplit = (held = Object.keys(HELD).map(id => `lib_${id}`)) => ({ held: Object.keys(F2_NAMED).filter(id => held.includes(id)), rows: Object.keys(F2_NAMED).filter(id => !held.includes(id)) });
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const held = process.argv[2] === '--held', record = held && process.argv[3] === '--record';
  const ids = process.argv.slice(held ? 3 : 2);
  let sha, reports;
  if (record) {
    const sp = namedSplit(), h = await qaHeld(sp.held), r = sp.rows.length ? await qaLb8({ ids: sp.rows, page: (await buildLb8Page({ ids: sp.rows })).html }) : { sha: null, reports: [] };
    sha = h.sha; reports = [...h.reports, ...r.reports];
    writeFileSync(HELD_FLAGS, `${JSON.stringify({ pageSha: h.sha, rowsPageSha: r.sha, reports: reports.map(x => ({ id: x.id, flags: Object.fromEntries(FLAGS.map(f => [f, { raised: x.flags[f].raised, value: x.flags[f].value ?? null }])) })) }, null, 1)}\n`);
    console.log(`recorded ${HELD_FLAGS} (held page ${h.sha}; rows page of ${sp.rows.join(', ') || 'none'} ${r.sha})`);
  } else ({ sha, reports } = held ? await qaHeld(ids.length ? ids : null) : await qaLb8(ids.length ? { ids } : {}));
  console.log(`LB8 plates page sha256 ${sha}`);
  for (const line of tableOf(reports)) console.log(line);
  const bad = flagProblems(reports);
  console.log(bad.length ? `flag set DIFFERS from the ruled set:\n${bad.join('\n')}` : 'flag set: equal to the expected set (F5 3.57 on all; F7 on the drawable-false cards)');
  if (bad.length || reports.some(r => HARD.some(h => !r.hard[h].pass))) process.exit(1);
}
