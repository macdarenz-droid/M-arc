// GATE-SPLIT (docs/qa/GATE-SPLIT-DESIGN.md 3.2, 4.1): the gate's job selection and proof. The gate calls
// `gateSplit(...)` once after `const errors = []`, `gate.runs('<key>')` in front of each top-level statement, and
// `gate.done()` before `browser.close()`. MARC_GATE_JOB="k/K" (1-based) runs the blocks `packShards` gives job k of
// K; unset, empty or "1/1" runs every block, as the gate always did. Each run writes
// screenshots/gate-proof-<tz>-<k>of<K>.json in HT-10's writeProof format. Build and gate time only; never bundled.
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALWAYS, REPLAYED, parseGate } from './gate-blocks.mjs';
import { jobFromEnv, packShards, writeProof } from '../tools/plates/fidelity/shard.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
export const TIMES_FILE = join(ROOT, 'scripts/gate-times.json');
export const THEMES = ['silent-black', 'paper', 'ember', 'emerald', 'midnight'];
/** A theme name anywhere in a screenshot's name, between non-letters (4.1). */
export const THEME_IN_NAME = /(?:^|[^a-z])(silent-black|paper|ember|emerald|midnight)(?:[^a-z]|$)/;
export const tzSlug = (tz) => (tz === 'UTC' ? 'utc' : tz === 'Pacific/Auckland' ? 'auckland' : tz.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

/** The plan for one time zone: `jobs[j]` = the group keys job j runs (ALWAYS groups excluded; they run in every job). */
export function planFor(groupKeys, times, K, tz) {
  const items = groupKeys.filter(k => !ALWAYS.has(k)).map(id => ({ id, seconds: times.seconds?.[id] ?? times.default }));
  const offsets = Array.from({ length: K }, (_, j) => times.offsets?.[`${tz}/${j + 1}`] ?? 0);
  // offsets describe CI's own job layout (source-gate's head start), so they apply only at the configured K; a solo
  // run (E10, K = groups) must give one group per job
  return packShards(items, K, K === times.K ? offsets : []);
}
/** sha-256 of the packing input, so the verdict can prove every job packed the same plan. */
export const planHash = (groupKeys, times, tz) => createHash('sha256').update(JSON.stringify({ groupKeys, seconds: times.seconds, default: times.default, offsets: times.offsets, tz })).digest('hex');

/** sha-256 over www/ (sorted paths and bytes), with sw.js's build-time cache stamp normalised: each job builds its own www. */
export function wwwHash(dir = join(ROOT, 'www')) {
  if (!existsSync(dir)) return null;   // unit tests run before the build; every gate job has www
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

/** The replay of each REPLAYED write (gate-blocks.mjs), exactly as the group writes it. */
export const REPLAY = {
  'HT-3 process.env.HT3_DUMP': ({ OUT }) => { process.env.HT3_DUMP ??= join(OUT, 'ht3-diffs'); },
};

export function gateSplit({ errors, OUT, browser, file, env = process.env }) {
  const { groups, problems } = parseGate(readFileSync(file, 'utf8'));
  if (problems.length) throw new Error(`GATE-SPLIT: the gate file does not parse into guarded groups:\n${problems.join('\n')}`);
  const times = JSON.parse(readFileSync(TIMES_FILE, 'utf8'));
  const job = jobFromEnv('MARC_GATE_JOB', env);
  const K = job.N ?? 1, k = job.k ?? 0;
  const tz = env.TZ || 'UTC';
  const keys = groups.map(g => g.key);
  const planned = new Set(K === 1 ? keys.filter(x => !ALWAYS.has(x)) : planFor(keys, times, K, tz)[k]);
  const known = new Set(keys);
  const order = new Map(keys.map((x, i) => [x, i]));
  const replays = REPLAYED.map(r => ({ ...r, at: order.get(r.group), fn: REPLAY[`${r.group} ${r.path}`], done: false }));
  for (const r of replays) if (r.at == null || !r.fn) throw new Error(`GATE-SPLIT: no group or replay for REPLAYED ${r.group} ${r.path}`);
  const reached = [], rows = new Map();
  let open = null;
  const listOut = () => { try { return new Set(readdirSync(OUT)); } catch { return new Set(); } };
  const close = () => {
    if (!open) return;
    const after = listOut();
    open.row.seconds += (Date.now() - open.t0) / 1000;
    open.row.errors += errors.length - open.e0;
    for (const f of after) if (!open.files0.has(f) && !f.startsWith('gate-proof-')) open.row.files.add(f);
    open = null;
  };
  const t0 = Date.now();
  const gate = {
    job: { k: k + 1, K }, tz,
    /** Whether this job runs the group `key`; also closes the previous group's timing row. */
    runs(key) {
      if (!known.has(key)) throw new Error(`GATE-SPLIT: gate.runs('${key}') is not a group the parser found`);
      const run = ALWAYS.has(key) || planned.has(key);
      if (open && open.key === key) return run;
      // a group that runs in another job still leaves its REPLAYED state for every later group, as in one serial run
      for (const r of replays) if (!r.done && r.at < order.get(key)) { r.done = true; if (!planned.has(r.group)) r.fn({ OUT }); }
      close();
      if (!run) return false;
      if (rows.has(key)) throw new Error(`GATE-SPLIT: group ${key} reached twice`);
      rows.set(key, { seconds: 0, errors: 0, files: new Set() });
      reached.push(key);
      open = { key, row: rows.get(key), t0: Date.now(), e0: errors.length, files0: listOut() };
      return true;
    },
    /** E4: every planned group reached, none extra; then the proof file. */
    async done() {
      close();
      const want = keys.filter(x => planned.has(x) || ALWAYS.has(x));
      const missing = want.filter(x => !rows.has(x)), extra = reached.filter(x => !want.includes(x));
      if (missing.length) errors.push(`GATE-SPLIT E4: job ${k + 1}/${K} (${tz}) never reached planned groups ${missing.join(', ')}`);
      if (extra.length) errors.push(`GATE-SPLIT E4: job ${k + 1}/${K} (${tz}) ran unplanned groups ${extra.join(', ')}`);
      const proofRows = [], constructionOnly = [];
      for (const key of reached) {
        const r = rows.get(key);
        proofRows.push({ id: key, check: 'gate', state: tz, theme: '*', width: null, result: r.errors ? 'fail' : 'pass' });
        const seen = new Set([...r.files].map(f => THEME_IN_NAME.exec(f)?.[1]).filter(Boolean));
        for (const theme of seen) proofRows.push({ id: key, check: 'gate-theme', state: tz, theme, width: null, result: r.errors ? 'fail' : 'pass' });
        if (!seen.size && !ALWAYS.has(key)) constructionOnly.push(key);
      }
      const sha = (env.GITHUB_SHA || '').slice(0, 40) || execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim();
      const meta = {
        job: { k: k + 1, K }, tz,
        www: wwwHash(), chrome: browser ? browser.version() : null,
        plan: planHash(keys, times, tz), groups: keys.length,
        seconds: Object.fromEntries(reached.map(x => [x, Math.round(rows.get(x).seconds * 10) / 10])),
        gateSeconds: Math.round((Date.now() - t0) / 100) / 10,
        files: Object.fromEntries(reached.map(x => [x, [...rows.get(x).files].sort()])),
        constructionOnly, openContexts: browser ? browser.contexts().length : null,
        errors: [...errors],
      };
      writeProof(join(OUT, `gate-proof-${tzSlug(tz)}-${k + 1}of${K}.json`), { sha, shard: K > 1 ? { k, N: K } : {}, rows: proofRows, meta });
      console.log(`GATE-SPLIT: job ${k + 1}/${K} (${tz}) ran ${reached.length} of ${keys.length} groups in ${meta.gateSeconds} s; proof written`);
    },
  };
  return gate;
}
