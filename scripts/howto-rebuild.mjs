// LIB-4c (card LIB-4c Do 4; plan 5.4, D-LIB4-MODE, D-LIB4-VERDICT): job howto-rebuild. Fetches main (here only, so the
// fail-safe is the tested one), picks the mode and the ids, plans the shards, and rebuilds every pinned library page
// (L1) on parallel processes: plates pages through buildPlatesPage, layers pages through layersSpecOf and LIB-6's
// build-layers-page.mjs; each must equal its pin, and a layers page must also equal the committed bytes. Writes
// howto-pages/ (the pages, plan.json and a copy of the proof) and screenshots/howto-rebuild-proof.json, and appends
// ks, K and mode to $GITHUB_OUTPUT.
//   node scripts/howto-rebuild.mjs                     (CI; env GITHUB_SHA, GITHUB_REF, GITHUB_EVENT_NAME)
//   node scripts/howto-rebuild.mjs --page <golden file> <kind> <out>   (one page, in a child process)
import { execFileSync, spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFileSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { cpus, tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { writeProof } from '../tools/plates/fidelity/shard.mjs';
import { batchGoldenOf, rows } from '../tools/plates/library/registry.mjs';
import { affectedIds } from '../tools/plates/library/ci/affected.mjs';
import { modeOf } from '../tools/plates/library/ci/mode.mjs';
import { JOB_BUDGET_S, libraryIds, libraryPlan, readTimes } from '../tools/plates/library/ci/plan.mjs';
import { pinnedPages } from '../tools/plates/library/ci/verdict.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
export const PAGES_DIR = 'howto-pages';
export const PROOF = 'screenshots/howto-rebuild-proof.json';
const sha256 = b => createHash('sha256').update(b).digest('hex');
export const pageFileOf = (file, kind) => `${basename(file, '.json')}.${kind === 'page' ? 'plates' : 'layers'}.html`;

/** The rows of the batch whose golden file is `file`. */
const batchRowsOf = (file, all) => all.filter(r => r.batchFile && batchGoldenOf(r.batchFile) === file);

/** Builds one pinned page; returns its bytes. Throws when the page kind has no builder at this sha. */
export async function buildPage(file, kind, { root = ROOT, all = rows(root) } = {}) {
  const rs = batchRowsOf(file, all);
  if (!rs.length) throw new Error(`${file}: no batch file pins its pages here`);
  const pages = rs[0].pages;
  if (!pages) throw new Error(`${file}: its batch file has no pages`);
  if (kind === 'page') {
    const { buildPlatesPage } = await import('../tools/plates/library/build-page.mjs');
    const { pageConfig } = await import('../tools/plates/library/plates-page.mjs');
    return (await buildPlatesPage(await pageConfig(pages.plates, all))).html;
  }
  if (kind === 'layers-page') {
    const builder = join(root, 'tools/plates/library/build-layers-page.mjs');
    if (!existsSync(builder)) throw new Error(`${file}: a layers page is pinned, but tools/plates/library/build-layers-page.mjs (LIB-6) is not at this sha`);
    const { layersSpecOf } = await import('../tools/plates/library/layers-spec.mjs');
    const { buildLayersPage } = await import(pathToFileURL(builder).href);
    const stageDir = mkdtempSync(join(tmpdir(), 'howto-stage-'));
    try { return await buildLayersPage(layersSpecOf(rs[0].batchFile, { stageDir, root, all })); } finally { rmSync(stageDir, { recursive: true, force: true }); }
  }
  throw new Error(`${file}: page kind ${kind} has no builder`);
}

const child = (args) => new Promise(resolve => {
  const c = spawn(process.execPath, [fileURLToPath(import.meta.url), ...args], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
  const err = [];
  c.stdout.resume(); c.stderr.on('data', d => err.push(d));
  c.on('close', code => resolve({ code, err: Buffer.concat(err).toString() }));
});

/** L1 over every pinned page, at most P child processes at once. Returns { rows, pageShas, files }. */
export async function rebuildAll({ root = ROOT, all = rows(root), out = join(root, PAGES_DIR), P = Math.max(1, cpus().length) } = {}) {
  const { pages, unknown } = pinnedPages(root), rowsOut = [], pageShas = {}, files = {};
  mkdirSync(out, { recursive: true });
  let i = 0;
  await Promise.all([...Array(Math.min(P, pages.length || 1))].map(async () => {
    while (i < pages.length) {
      const p = pages[i++], dest = join(out, pageFileOf(p.file, p.kind)), why = [];
      const r = await child(['--page', p.file, p.kind, dest]);
      if (r.code !== 0) why.push(`build failed: ${r.err.trim().split('\n').pop()}`);
      else {
        const bytes = readFileSync(dest), got = sha256(bytes);
        pageShas[p.id] = got; files[p.id] = basename(dest);
        if (got !== p.pageSha256 || bytes.length !== p.bytes) why.push(`rebuilt ${got} (${bytes.length} B) != pinned ${p.pageSha256} (${p.bytes} B)`);
        if (p.kind === 'layers-page') {
          const committed = batchRowsOf(p.file, all)[0]?.pages?.layers, c = committed && existsSync(join(root, committed)) ? readFileSync(join(root, committed)) : null;
          if (!c) why.push(`no committed layers page ${committed}`);
          else if (!c.equals(bytes)) why.push(`rebuilt != committed ${committed} (${sha256(c)})`);
        }
      }
      rowsOut.push({ id: p.id, check: 'L1', state: `L1/${p.kind}@*`, theme: '*', width: null, result: why.length ? 'fail' : 'pass', why });
    }
  }));
  for (const u of unknown) rowsOut.push({ id: u.split(':')[0], check: 'L1', state: 'L1/unknown-kind@*', theme: '*', width: null, result: 'fail', why: [u] });
  return { rows: rowsOut, pageShas: Object.fromEntries(Object.keys(pageShas).sort().map(k => [k, pageShas[k]])), files };
}

/** { changed: [path] | null, base }: `git fetch --depth=1 origin main`, then the tree diff FETCH_HEAD..HEAD. */
export function changedPaths(root = ROOT) {
  try {
    execFileSync('git', ['fetch', '--depth=1', 'origin', 'main'], { cwd: root, stdio: ['ignore', 'ignore', 'pipe'] });
    const base = execFileSync('git', ['rev-parse', 'FETCH_HEAD'], { cwd: root, encoding: 'utf8' }).trim();
    const changed = execFileSync('git', ['diff', '--name-only', 'FETCH_HEAD', 'HEAD'], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 26 }).split('\n').filter(Boolean);
    return { changed, base };
  } catch (e) {
    console.error(`howto-rebuild: git fetch of origin main failed (${e.message.split('\n')[0]}): every id is selected`);
    return { changed: null, base: null };
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if (process.argv[2] === '--page') {
    const [file, kind, dest] = process.argv.slice(3);
    let bytes;
    try { bytes = await buildPage(file, kind); } catch (e) { console.error(`howto-rebuild --page: ${e.message.split('\n').slice(0, 3).join(' | ')}`); process.exit(1); }
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, bytes);
    process.exit(0);
  }
  const t0 = Date.now(), env = process.env;
  const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
  const all = rows(ROOT), mode = modeOf({ ref: env.GITHUB_REF, event: env.GITHUB_EVENT_NAME });
  const { changed, base } = changedPaths(ROOT);
  const ta = Date.now();
  const a = mode === 'affected' ? await affectedIds({ changed, base: base ?? 'FETCH_HEAD', root: ROOT, all }) : null;
  const affectedSeconds = (Date.now() - ta) / 1000;
  const ids = a ? a.ids : libraryIds(all), times = readTimes(ROOT), plan = libraryPlan({ ids, times });
  const out = join(ROOT, PAGES_DIR);
  rmSync(out, { recursive: true, force: true });
  const L1 = await rebuildAll({ root: ROOT, all, out });
  const seconds = Math.round((Date.now() - t0) / 100) / 10;
  const byBatch = new Map(Object.entries(L1.files).map(([id, f]) => [id, f]));
  const pagesOf = {};
  for (const id of ids) {
    const r = all.find(x => x.id === id), g = batchGoldenOf(r.batchFile);
    pagesOf[id] = { plates: byBatch.get(`${g}#page`) ?? null, layers: byBatch.get(`${g}#layers-page`) ?? null };
  }
  const errors = [];
  if (env.GITHUB_SHA && env.GITHUB_SHA !== sha) errors.push(`this job checked out ${sha}, not the commit under test ${env.GITHUB_SHA}`);
  if (seconds > JOB_BUDGET_S) errors.push(`rebuild took ${seconds} s, over the ${JOB_BUDGET_S} s budget`);
  const meta = {
    mode, base, changed, ids, plan: { K: plan.K, shards: plan.shards, hash: plan.hash, note: plan.note, loads: plan.loads },
    seconds, pageShas: L1.pageShas, affectedSeconds, baseValues: a?.baseValues ?? null, reasons: a?.reasons ?? null, class3: a?.class3 ?? null, errors,
  };
  const proof = writeProof(join(ROOT, PROOF), { sha, rows: L1.rows.map(({ why, ...r }) => r), meta });
  writeFileSync(join(out, 'plan.json'), `${JSON.stringify({ sha, mode, ids, K: plan.K, shards: plan.shards, hash: plan.hash, pages: pagesOf, files: L1.files }, null, 1)}\n`);
  copyFileSync(join(ROOT, PROOF), join(out, 'rebuild-proof.json'));
  const ks = JSON.stringify(Array.from({ length: plan.K }, (_, i) => i + 1));
  if (env.GITHUB_OUTPUT) appendFileSync(env.GITHUB_OUTPUT, `ks=${ks}\nK=${plan.K}\nmode=${mode}\n`);
  for (const r of L1.rows) console.log(`L1 ${r.id}: ${r.result}${r.why.length ? ` (${r.why.join('; ')})` : ''}`);
  if (a) for (const r of a.reasons) console.log(`affected: ${r.path} (class ${r.cls}): ${r.ids === 'all' ? 'all ids' : r.ids.join(', ') || 'no id'}; ${r.why}`);
  console.log(`howto-rebuild: mode ${mode}, ${ids.length} of ${libraryIds(all).length} ids, K ${plan.K}${plan.note ? ` (${plan.note})` : ''}, ${L1.rows.length} pinned pages in ${seconds} s (affected ${affectedSeconds.toFixed(1)} s); proof rows ${proof.rows.length}`);
  const bad = [...errors, ...L1.rows.filter(r => r.result !== 'pass').map(r => `L1 ${r.id}: ${r.why.join('; ')}`)];
  if (bad.length) { console.error(`howto-rebuild FAIL:\n${bad.join('\n')}`); process.exit(1); }
}
