// LIB-4b (card LIB-4b; library plan 3.6, 5.4; D-LIB4-SCOPE): the per-id library runner. For every id it proves each
// per-id state the 8 get from the HT-3..HT-10 blocks, against that id's plates page and layers page, one row per
// (id, theme, state) (fidelity/tuples.mjs), plus LIB-3's full plate QA report and the offline open. Run on the 8 it
// gives the HT blocks' pass set and px (B2). Build and CI time only; never bundled.
// CLI: node tools/plates/library/fidelity.mjs --ids <golden8|id,id,…> [--P n] [--families F,…] [--themes t,…] [--json out]
//      (serves www/ with vite preview on MARC_LIB_PORT, default 4180; MARC_CHROMIUM for the browser)
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { FIXTURE, GOLDEN_JSON, extractPlates, fragmentsOf, latestEntries } from '../golden.mjs';
import { ROOT } from '../lib/inputs.mjs';
import { rows as registryRows } from './registry.mjs';
import { HT_CUSTOM, HT_FULL, HT_PLATES, HT_THEMES, fixtureLeakSection, fixtureSection, closeHowTo, openAppTrain, openCard, openHowTo, ht10GoldenCounts, ht10Script, ht10Sweep } from '../fidelity/harness.mjs';
import { CHECKS, LIB_ONCE, NO_THEME, PQH_STATES, WIDTH, libraryTuples, sourceFacts } from './fidelity/tuples.mjs';
import { recorder, stateOf } from './fidelity/rows.mjs';
import { plateJob, plateStats } from './fidelity/plate.mjs';

/** The browser every page check runs in: full Chromium as the HT blocks launch it (D-HT3: never the headless shell). */
export const LAUNCH_ARGS = ['--no-sandbox', '--disable-lcd-text', '--disable-features=OverscrollHistoryNavigation,TouchpadOverscrollHistoryNavigation'];
export const launchBrowser = async () => (await import('playwright')).chromium.launch({ ...(process.env.MARC_CHROMIUM ? { executablePath: process.env.MARC_CHROMIUM } : { channel: 'chromium' }), args: LAUNCH_ARGS });
/** The families the runner runs, in order; each covers the CHECKS named. */
export const FAMILIES = ['entry', 'L2', 'plate', 'HT4', 'HT6', 'HT7', 'HT8', 'HT9', 'HT10', 'PQH', 'offline'];
const COVERS = { plate: ['L2b', 'F3', 'L3', 'L4'] };
const GOLDEN_B = 'tests/howto/golden/howto-layers.html';

/** The 8's pages: golden A (the plates page) and golden B (the layers page), as HT-3 and HT-6..HT-10 compare. */
export const golden8Pages = (root = ROOT) => {
  const plates = readFileSync(join(root, 'tests/howto/golden/technical-plates.html')), layers = readFileSync(join(root, GOLDEN_B));
  return Object.fromEntries(HT_PLATES.map(([, id]) => [id, { plates, layers }]));
};

/** Every pinned golden entry, latest per id: GOLDEN.json, then the batch files in name order. */
export function goldenEntries(root = ROOT) {
  const all = [...JSON.parse(readFileSync(join(root, 'tests/howto/golden/GOLDEN.json'), 'utf8')).entries];
  const dir = join(root, 'tests/howto/golden/library');
  if (existsSync(dir)) for (const f of readdirSync(dir).filter(n => n.endsWith('.json')).sort()) all.push(...JSON.parse(readFileSync(join(dir, f), 'utf8')).entries);
  return latestEntries(all);
}

/** A worker pool: runs `jobs` (async thunks) at most `P` at a time. */
async function pool(jobs, P) {
  let i = 0;
  await Promise.all([...Array(Math.max(1, Math.min(P, jobs.length)))].map(async () => { while (i < jobs.length) await jobs[i++](); }));
}

/**
 * Proves `ids` against `pages` (pages[id] = { plates, layers }: html strings or Buffers). Returns { rows, px, seconds,
 * stats }: rows cover libraryTuples(ids) exactly once (an untouched tuple is a fail row, never a skip); px maps each
 * pixel tuple 'id|theme|state' to its max px off; seconds maps id and family to the job seconds spent.
 * `families`/`themes` narrow a development run (the rows then cover only those); CI always runs everything.
 */
export async function libraryFidelity(browser, port, { ids, pages, P = 1, families = FAMILIES, themes = HT_THEMES, root = ROOT, log = () => {}, fixtures = {} }) {
  const R = recorder(), all = registryRows(root), why = {}, seconds = { id: {}, family: {} }, stats = { plate: plateStats(), byFamily: {} };
  const facts = {};
  for (const id of ids) facts[id] = await sourceFacts(id, { root, all });
  const order = [...ids, HT_CUSTOM.id], custom = HT_CUSTOM;
  const job = id => ({ lib: id, chrome: facts[id].chromeId, index: order.indexOf(id), facts: facts[id] });
  const ok = id => {
    const p = pages[id];
    if (!p || !p.plates || !p.layers) { why[id] = `no ${!p ? 'pages' : !p.plates ? 'plates page' : 'layers page'} for ${id}`; return false; }
    return true;
  };
  const scratch = mkdtempSync(join(tmpdir(), 'lib4b-'));
  const files = new Map();
  /** The id's layers page as a file (goldenB.mjs's openPage loads a file: URL), wrapped as buildScratchPage wraps it. */
  const layersFile = id => {
    const html = String(pages[id].layers);
    if (!files.has(html)) {
      const f = join(scratch, `layers-${files.size}.html`);
      writeFileSync(f, /^<!doctype/i.test(html) ? html : `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>${html}</body></html>`);
      files.set(html, f);
    }
    return files.get(html);
  };
  const ctx = { browser, port, R, pages, order, custom, root, layersFile, stats, themes, golden: new Map(), fixtures };
  const timed = (id, fam, fn) => async () => {
    const t0 = Date.now();
    try { await fn(); } catch (e) { R.fail(id, NO_THEME, `${fam === 'plate' ? 'L3' : fam}/crashed@*`, `${fam} crashed: ${e.message.split('\n')[0]}`); log(`${id} ${fam}: crashed ${e.stack}`); }
    const s = (Date.now() - t0) / 1000;
    seconds.id[id] = (seconds.id[id] ?? 0) + s; seconds.family[fam] = (seconds.family[fam] ?? 0) + s;
  };
  const jobs = [];
  const twins = {};
  for (const fam of ['HT4', 'HT6', 'HT7', 'HT8', 'HT9', 'offline']) if (families.includes(fam)) twins[fam] = await import(`./fidelity/twins/${fam.toLowerCase()}.mjs`);
  for (const id of ids) {
    if (!ok(id)) continue;
    const j = job(id);
    if (families.includes('L2')) jobs.push(timed(id, 'L2', () => l2Job(ctx, j)));
    if (families.includes('PQH')) jobs.push(timed(id, 'PQH', () => pqhJob(ctx, j)));
    if (families.includes('entry') && themes.includes('paper')) jobs.push(timed(id, 'entry', () => entryJob(ctx, j)));
    if (twins.offline && themes.includes('silent-black')) jobs.push(timed(id, 'offline', () => twins.offline.run(ctx, { ...j, theme: 'silent-black' })));
    if (twins.HT4?.runNode) jobs.push(timed(id, 'HT4', () => twins.HT4.runNode(ctx, j)));
    for (const theme of themes) {
      const tj = { ...j, theme };
      if (families.includes('plate')) jobs.push(timed(id, 'plate', () => plateJob(browser, port, R, { ...tj, html: pages[id].plates, order, custom, stats: stats.plate, mutate: fixtures.mutate?.[id] ?? null, shift: fixtures.shift?.includes(id) ? 1 : 0 })));
      for (const fam of ['HT4', 'HT6', 'HT7', 'HT8', 'HT9']) if (twins[fam]) jobs.push(timed(id, fam, () => twins[fam].run(ctx, tj)));
      if (families.includes('HT10')) jobs.push(timed(id, 'HT10', () => ht10Job(ctx, tj)));
    }
  }
  try { await pool(jobs, P); } finally { rmSync(scratch, { recursive: true, force: true }); for (const c of ctx.cleanup ?? []) await c(); }
  const covers = new Set(families.flatMap(f => COVERS[f] ?? [f]));
  const want = (await libraryTuples(ids, { root })).filter(t => covers.has(t.state.split('/')[0]) && (t.theme === NO_THEME || themes.includes(t.theme)));
  const rows = R.finish(want, why);
  return { rows, px: { ...R.pxByTuple }, seconds, stats, problems: R.problems };
}

/** L2 (plan 3.6): the plates page's fragments and the bundled ht-<slug> chunk's fragments both equal the pinned entry. */
async function l2Job({ R, pages, root }, { lib, chrome }) {
  const entry = goldenEntries(root).get(lib), row = registryRows(root).find(r => r.id === lib);
  const page = stateOf('L2', 'page', null), chunk = stateOf('L2', 'chunk', null);
  if (!entry || entry.kind !== 'plate') { R.fail(lib, NO_THEME, page, 'no pinned plate entry'); R.fail(lib, NO_THEME, chunk, 'no pinned plate entry'); return; }
  const p = extractPlates(String(pages[lib].plates)).find(x => x.chromeId === chrome);
  if (!p) R.fail(lib, NO_THEME, page, `the plates page has no ${chrome} plate`);
  else R.check(lib, NO_THEME, page, JSON.stringify(fragmentsOf(p)) === JSON.stringify(entry.fragments) ? [] : [`page fragments ${JSON.stringify(fragmentsOf(p))} != pinned ${JSON.stringify(entry.fragments)}`]);
  const assets = join(root, 'www/assets'), f = readdirSync(assets).filter(n => new RegExp(`^ht-${row.slug}-[\\w-]{8}\\.js$`).test(n));
  if (f.length !== 1) { R.fail(lib, NO_THEME, chunk, `expected one ht-${row.slug}-*.js chunk, found ${f.join(', ') || 'none'}`); return; }
  const m = (await import(pathToFileURL(join(assets, f[0])).href)).default;
  const got = fragmentsOf({ normal: m.plate.normal, mistake: m.plate.mistake, tells: m.plate.tells, tempo: m.plate.tempo, alt: m.plate.alt, mistakeAlt: m.plate.mistakeAlt });
  R.check(lib, NO_THEME, chunk, JSON.stringify(got) === JSON.stringify(entry.fragments) ? [] : [`the bundled ${f[0]} does not hold the pinned fragments`]);
}

/** entry (HT3-A1, D-LIB4-CTRL 6): exactly one 44 px "How to do it" button on the id's card, and tapping it opens the sheet. */
async function entryJob({ browser, port, R, order, custom, fixtures }, { lib, index }) {
  const theme = 'paper', st = stateOf('entry', 'open', WIDTH), bad = [];
  const { ctx, page } = await openAppTrain(browser, port, theme, { order, custom, onError: m => bad.push(`page error: ${m}`) });
  try {
    const card = await openCard(page, index);
    if (fixtures.entry?.[lib]) await card.evaluate(fixtures.entry[lib]);   // B4's fixture only
    const entry = card.locator('button.ht-entry');
    const n = await entry.count(), name = n === 1 ? (await entry.getAttribute('aria-label')) ?? (await entry.innerText()).trim() : null, b = n === 1 ? await entry.boundingBox() : null;
    if (n !== 1 || name !== 'How to do it' || !b || b.width < 44 || b.height < 44) bad.push(`A1: ${n} entries, name ${JSON.stringify(name)}, box ${JSON.stringify(b && [b.width, b.height])}`);
    else { await openHowTo(page, index); await closeHowTo(page); }
  } catch (e) { bad.push(e.message.split('\n')[0]); } finally { await ctx.close(); }
  R.check(lib, theme, st, bad);
}

/** HT10 (HT10_PER_ID): the sweep and the reduced-motion sweep (ht10Sweep, reused), and A2 (the plate compare after the script). */
async function ht10Job(ctx, { lib, chrome, index, theme }) {
  const { browser, port, R, pages, order, custom, golden } = ctx;
  const html = pages[lib].layers;
  if (!golden.has(html)) golden.set(html, ht10GoldenCounts(browser, { html, ids: extractChromeIds(html) }));
  const counts = await golden.get(html);
  const expectRisks = existsSync(join(ctx.root, 'src/slices/howto/sections/Risks.tsx'));
  for (const [state, reduced] of [['sweep', false], ['reduced', true]]) {
    const r = await ht10Sweep(browser, port, theme, { ids: [chrome], reduced, expectRisks, golden: counts, order, custom, indexOf: () => index, inject: reduced ? null : ctx.fixtures.inject?.[lib] ?? null });
    const bad = [...r.problems];
    if (!reduced && r.stats.steps < 15) bad.push(`A1: only ${r.stats.steps} script steps probed, expected at least 15`);
    R.check(lib, theme, stateOf('HT10', state, WIDTH), bad);
  }
  const src = ht10Script.toString();
  // eslint-disable-next-line no-new-func
  const mutate = new Function('pre', `return (${src})(pre).then(() => {})`);
  const st = { ...plateStats() }, a2 = stateOf('HT10', 'a2', WIDTH);
  await plateJob(browser, port, R, { lib, chrome, index, theme, html: pages[lib].plates, order, custom, full: false, widths: [], mutate, markup: false, as: a2, stats: st });
  if (st.pairs < 2) R.fail(lib, theme, a2, `A2: only ${st.pairs} plate pairs compared, expected at least 2`);
}
const extractChromeIds = html => [...new Set([...String(html).matchAll(/id="card-([a-z0-9-]+)"/g)].map(m => m[1]))];

/** PQH: LIB-3's full runQa report (node and browser halves) per id; each row passes only when the report is ok. */
async function pqhJob(ctx, { lib, chrome }) {
  const { R, pages } = ctx;
  const Q = await qaBase(ctx);
  const html = String(pages[lib].plates);
  const fail = m => { for (const s of PQH_STATES) R.fail(lib, NO_THEME, s, m); };
  const cands = await Q.candidates(html);
  const c = cands.find(x => x.chromeId === chrome);
  if (!c) return fail(`no QA candidate for ${lib} (${Q.approved.includes(lib) ? 'not on its plates page' : 'library candidates come from LIB-2, not built yet'})`);
  const bmap = await Q.browserResults(Q.browser, html, [c], Q.E, Q.pins.envelope);
  const report = await Q.runQa(c, { engine: Q.E, pins: Q.pins, approvedStrings: Q.strings, browser: bmap });
  const blocking = [...Q.HARD.flatMap(h => report.hard[h].problems.map(p => `${h} ${p.key}`)), ...Q.FLAGS.filter(f => report.flags[f].blocks)];
  for (const [i, h] of Q.HARD.entries()) {
    const bad = report.hard[h].problems.map(p => `${p.key}: ${p.text}`);
    if (!report.ok && !bad.length) bad.push(`report not ok: ${blocking.join(', ')}`);
    R.check(lib, NO_THEME, PQH_STATES[i], bad);
  }
  const fl = Q.FLAGS.filter(f => report.flags[f].blocks).map(f => `${f} raised without a named exemption`);
  if (!report.ok && !fl.length) fl.push(`report not ok: ${blocking.join(', ')}`);
  R.check(lib, NO_THEME, PQH_STATES[PQH_STATES.length - 1], fl);
}
/** LIB-3's engine mirror, pins and QA browser, built once per run. */
async function qaBase(ctx) {
  if (!ctx.qa) ctx.qa = (async () => {
    const [I, A, E, B, G] = await Promise.all(['index', 'approved', 'engine', 'browser'].map(n => import(`./qa/${n}.mjs`)).concat(import('../golden.mjs')));
    const mirror = G.makeMirror(), engine = await E.loadEngine(mirror), browser = await B.launch();
    ctx.cleanup = [...(ctx.cleanup ?? []), async () => { await browser.close(); E.dropMirror(mirror); }];
    return { runQa: I.runQa, HARD: I.HARD, FLAGS: I.FLAGS, pins: I.loadPins(), E: engine, browser, browserResults: B.browserResults, strings: A.approvedStrings(), approved: A.APPROVED_IDS, candidates: html => A.candidatesOf(html, engine) };
  })();
  return ctx.qa;
}

/**
 * The per-shard once-states (LIB_ONCE): HT-1's golden self-check (0 px twice, a 1 px shift fails), and on shard 1
 * LIB-3's browser self-test (qa/selftest.mjs). Returns rows.
 */
export async function onceStates(browser, port, k) {
  const R = recorder(), [a, b] = LIB_ONCE.shard(k);
  const { goldenSelfCheck } = await import('../fidelity/harness.mjs');
  const r = await goldenSelfCheck(browser);
  R.check(a.id, a.theme, a.state, r.problems.filter(p => !p.startsWith('negative control:')));
  R.check(b.id, b.theme, b.state, r.control?.fails ? [] : [`the 1 px shift control does not fail the rule (${r.control?.off} px)`]);
  const tuples = [a, b];
  if (k === 1) {
    const { selftest } = await import('./qa/selftest.mjs');
    const [c] = LIB_ONCE.run, lines = [];
    const ok = await selftest({ log: l => lines.push(l) }).then(x => x, e => ({ ok: false, error: e.message }));
    R.check(c.id, c.theme, c.state, ok?.ok === false || ok?.bad?.length ? [JSON.stringify(ok).slice(0, 500)] : []);
    tuples.push(c);
  }
  return R.finish(tuples);
}

/**
 * B2/B4 failure fixtures by name ("<name>:<lib id>"), each the HT block's own: HT-3's section fixtures and 1 px shift,
 * HT-10's hidden chip and "Show me", and B4's hidden entry. Never used outside the evidence runs.
 */
export function fixturesOf(specs) {
  const f = { mutate: {}, shift: [], inject: {}, entry: {} };
  for (const s of specs) {
    const [name, lib] = s.split(':');
    if (name === 'section') f.mutate[lib] = fixtureSection;
    else if (name === 'leak-section') f.mutate[lib] = fixtureLeakSection;
    else if (name === 'shift') f.shift.push(lib);
    else if (name === 'ht10-inject') f.inject[lib] = () => { document.querySelector('dialog.sheet.ht .st-show').style.display = 'none'; document.querySelector('dialog.sheet.ht .zx-chip[data-zoom]').style.display = 'none'; };
    else if (name === 'hide-entry') f.entry[lib] = card => card.querySelectorAll('.ht-entry').forEach(e => e.remove());
    else throw new Error(`unknown fixture ${name} (section, leak-section, shift, ht10-inject, hide-entry)`);
  }
  return f;
}

// ---- CLI -----------------------------------------------------------------------------------------------------------
const arg = (name, d = null) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : d; };
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { spawn } = await import('node:child_process');
  const idsArg = arg('ids', 'golden8'), ids = idsArg === 'golden8' ? HT_PLATES.map(p => p[1]) : idsArg.split(',');
  const fixtures = fixturesOf(process.argv.flatMap((a, i) => (a === '--fixture' ? [process.argv[i + 1]] : [])));
  const P = +arg('P', '1'), families = arg('families') ? arg('families').split(',') : FAMILIES, themes = arg('themes') ? arg('themes').split(',') : HT_THEMES;
  for (const f of families) if (!FAMILIES.includes(f)) throw new Error(`unknown family ${f} (${FAMILIES.join(', ')})`);
  const PORT = process.env.MARC_LIB_PORT || '4180';
  const server = spawn(process.execPath, [join(ROOT, 'node_modules/vite/bin/vite.js'), 'preview', '--port', PORT, '--strictPort'], { cwd: ROOT, stdio: 'ignore' });
  process.on('exit', () => { try { server.kill('SIGKILL'); } catch { /* gone */ } });
  for (let i = 0; ; i++) {
    try { if ((await fetch(`http://localhost:${PORT}/`)).ok) break; } catch { /* not yet */ }
    if (i > 120) throw new Error('preview server did not start');
    await new Promise(r => setTimeout(r, 250));
  }
  // the 8 compare with golden A and golden B; any other id needs --pages <json of { id: { plates: file, layers: file } }>
  const pages = arg('pages') ? Object.fromEntries(Object.entries(JSON.parse(readFileSync(arg('pages'), 'utf8'))).map(([id, p]) => [id, { plates: readFileSync(p.plates), layers: readFileSync(p.layers) }])) : golden8Pages();
  const browser = await launchBrowser();
  const t0 = Date.now();
  let out;
  try { out = await libraryFidelity(browser, PORT, { ids, pages, P, families, themes, fixtures, log: m => console.error(m) }); } finally { await browser.close(); }
  const fails = out.rows.filter(r => r.result === 'fail');
  for (const r of fails) console.log(`FAIL ${r.id} ${r.theme} ${r.state}: ${r.why.join(' | ').slice(0, 400)}`);
  const pxId = {};
  for (const [k, v] of Object.entries(out.px)) { const id = k.split('|')[0]; pxId[id] = Math.max(pxId[id] ?? 0, v); }
  console.log(`rows ${out.rows.length} (${out.rows.length - fails.length} pass, ${fails.length} fail); browser ${browser.version()}; P ${P}; ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  console.log(`max px off per id ${JSON.stringify(pxId)}`);
  console.log(`seconds per id ${JSON.stringify(Object.fromEntries(Object.entries(out.seconds.id).map(([k, v]) => [k, +v.toFixed(1)])))}`);
  console.log(`seconds per family ${JSON.stringify(Object.fromEntries(Object.entries(out.seconds.family).map(([k, v]) => [k, +v.toFixed(1)])))}`);
  if (arg('json')) writeFileSync(arg('json'), JSON.stringify(out, null, 1));
  server.kill('SIGKILL');
  process.exit(fails.length ? 1 : 0);
}
