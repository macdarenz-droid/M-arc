// LIB-4c (card LIB-4c Do 5; plan 5.4, D-LIB4-SHARD): job howto-shard (k/K). Re-checks the plan hash against this sha's
// times.json and the page shas against the rebuild proof, then runs the once-states (LIB_ONCE.shard(k), plus
// LIB_ONCE.run on shard 1) and LIB-4b's runner over the shard's ids. Writes screenshots/howto-proof-<k>of<K>.json
// (writeProof rows, with meta) and the evidence under screenshots/howto-evidence/.
//   MARC_LIB_SHARD=k/K TZ=UTC node scripts/howto-shard.mjs        (reads howto-pages/ from howto-rebuild)
import { execFileSync, spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { jobFromEnv, writeProof } from '../tools/plates/fidelity/shard.mjs';
import { idsOfShard, libraryPlan, readTimes } from '../tools/plates/library/ci/plan.mjs';
import { PAGES_DIR } from './howto-rebuild.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
/** Pages per job (D-LIB4-PAR): LIB-4b's adopted P. 1 until B7 adopts more. */
export const LIB_P = 1;
const sha256 = b => createHash('sha256').update(b).digest('hex');

/** GATE-SPLIT's wwwHash (scripts/gate-split.mjs), the same bytes in the same order, so the verdict can compare the two
 *  families. Not imported: scripts/gate-*.mjs are class 5 for the library (affected.mjs), so no runner imports them. */
export function wwwHash(dir = join(ROOT, 'www')) {
  if (!existsSync(dir)) return null;
  const h = createHash('sha256');
  const walk = (d) => readdirSync(d).sort().flatMap(f => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
  for (const f of walk(dir)) {
    const rel = relative(dir, f);
    let buf = readFileSync(f);
    if (rel === 'sw.js') buf = Buffer.from(buf.toString('utf8').replace(/marc-\d{14}/g, 'marc-STAMP'));
    h.update(`${rel}\0${buf.length}\0`).update(buf);
  }
  return h.digest('hex');
}

/** Problems of the shard's inputs: the plan hash at this sha's times.json, the job against K, and the page shas. */
export function inputProblems({ plan, rebuild, job, times, pages }) {
  const out = [], mine = libraryPlan({ ids: plan.ids, times });
  if (mine.hash !== plan.hash) out.push(`plan hash ${mine.hash.slice(0, 12)} at this sha's times.json != howto-rebuild's ${plan.hash.slice(0, 12)}`);
  if (job.N !== plan.K) out.push(`job ${job.k + 1}/${job.N}, but the plan has K = ${plan.K}`);
  for (const [id, s] of Object.entries(rebuild.meta?.pageShas ?? {})) if (pages[id] !== s) out.push(`page ${id}: ${pages[id] ?? 'missing'} here != rebuild proof ${s}`);
  for (const id of Object.keys(pages)) if (!(id in (rebuild.meta?.pageShas ?? {}))) out.push(`page ${id} is not in the rebuild proof`);
  return { problems: out, hash: mine.hash };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const t0 = Date.now(), env = process.env;
  const j = jobFromEnv('MARC_LIB_SHARD'), job = j.N ? j : { k: 0, N: 1 }, K = job.N, k = job.k + 1;
  const dir = join(ROOT, PAGES_DIR);
  const plan = JSON.parse(readFileSync(join(dir, 'plan.json'), 'utf8')), rebuild = JSON.parse(readFileSync(join(dir, 'rebuild-proof.json'), 'utf8'));
  const pageShas = {};
  for (const [id, f] of Object.entries(plan.files ?? {})) { try { pageShas[id] = sha256(readFileSync(join(dir, f))); } catch { pageShas[id] = null; } }
  const { problems, hash } = inputProblems({ plan, rebuild, job, times: readTimes(ROOT), pages: pageShas });
  const ids = idsOfShard(plan, k);
  const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
  if (env.GITHUB_SHA && env.GITHUB_SHA !== sha) problems.push(`this job checked out ${sha}, not the commit under test ${env.GITHUB_SHA}`);
  if (plan.sha !== sha) problems.push(`howto-rebuild planned ${plan.sha}, this job is on ${sha}`);
  const pages = Object.fromEntries(ids.map(id => [id, { plates: plan.pages[id]?.plates && readFileSync(join(dir, plan.pages[id].plates)), layers: plan.pages[id]?.layers && readFileSync(join(dir, plan.pages[id].layers)) }]));

  const PORT = env.MARC_LIB_PORT || '4180';
  const server = spawn(process.execPath, [join(ROOT, 'node_modules/vite/bin/vite.js'), 'preview', '--port', PORT, '--strictPort'], { cwd: ROOT, stdio: 'ignore' });
  process.on('exit', () => { try { server.kill('SIGKILL'); } catch { /* gone */ } });
  for (let i = 0; ; i++) {
    try { if ((await fetch(`http://localhost:${PORT}/`)).ok) break; } catch { /* not yet */ }
    if (i > 240) throw new Error('preview server did not start');
    await new Promise(r => setTimeout(r, 250));
  }
  const { launchBrowser, libraryFidelity, onceStates } = await import('../tools/plates/library/fidelity.mjs');
  const browser = await launchBrowser(), chrome = browser.version();
  let once, out, onceSeconds;
  try {
    const t1 = Date.now();
    once = await onceStates(browser, PORT, k);
    onceSeconds = (Date.now() - t1) / 1000;
    console.log(`howto-shard ${k}/${K}: once-states ${once.length} rows in ${onceSeconds.toFixed(1)} s; now ${ids.length} ids`);
    out = ids.length ? await libraryFidelity(browser, PORT, { ids, pages, P: LIB_P, log: m => console.error(m) }) : { rows: [], px: {}, seconds: { id: {}, family: {} }, problems: [] };
  } finally { await browser.close(); server.kill('SIGKILL'); }
  const rows = [...once, ...out.rows];
  const shardSeconds = Math.round((Date.now() - t0) / 100) / 10;
  const meta = {
    job: { k, K }, tz: Intl.DateTimeFormat().resolvedOptions().timeZone, www: wwwHash(join(ROOT, 'www')), chrome, plan: hash, mode: plan.mode, ids,
    pageShas: Object.fromEntries(Object.keys(pageShas).sort().map(id => [id, pageShas[id]])), px: out.px, P: LIB_P,
    seconds: Object.fromEntries(Object.entries(out.seconds.id).map(([id, s]) => [id, Math.round(s * 10) / 10])),
    onceSeconds: Math.round(onceSeconds * 10) / 10, shardSeconds, problems,
  };
  writeProof(join(ROOT, `screenshots/howto-proof-${k}of${K}.json`), { sha, shard: K > 1 ? { k: job.k, N: K } : {}, rows: rows.map(({ why, ...r }) => r), meta });
  mkdirSync(join(ROOT, 'screenshots/howto-evidence'), { recursive: true });
  writeFileSync(join(ROOT, `screenshots/howto-evidence/shard-${k}of${K}.json`), JSON.stringify({ rows, px: out.px, seconds: out.seconds, stats: out.stats, sizes: out.sizes, problems: [...problems, ...(out.problems ?? [])] }, null, 1));
  const fails = rows.filter(r => r.result !== 'pass');
  for (const r of fails) console.log(`FAIL ${r.id} ${r.theme} ${r.state}: ${(r.why ?? []).join(' | ').slice(0, 400)}`);
  console.log(`howto-shard ${k}/${K}: ${ids.length} ids, ${rows.length} rows (${fails.length} fail), chrome ${chrome}, ${shardSeconds} s`);
  if (problems.length) console.error(`howto-shard inputs FAIL:\n${problems.join('\n')}`);
  process.exit(fails.length || problems.length ? 1 : 0);
}
