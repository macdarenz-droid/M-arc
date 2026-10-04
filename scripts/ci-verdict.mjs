// GATE-SPLIT (docs/qa/GATE-SPLIT-DESIGN.md 4.2): the one verdict over every shard's proof. Job gate-verdict downloads
// all proof artifacts and runs `node scripts/ci-verdict.mjs <dir>`. Families: `gate` (screenshots/gate-proof-*.json,
// one per gate job) and `ht10` (ht10-proof.json plus the ht10-job.json the workflow writes beside it). It fails on a
// wrong sha, a missing, duplicated, extra or miscounted item, a failed row, a failed needed job, or a job over budget.
// Env: GITHUB_SHA, GITHUB_EVENT_NAME, MARC_GATE_ARRANGEMENT (split | serial), MARC_NEEDS (toJSON(needs)).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALWAYS, GATE_FILE, parseGate } from './gate-blocks.mjs';
import { TIMES_FILE, planFor, planHash } from './gate-split.mjs';
import { coverProblems } from '../tools/plates/fidelity/shard.mjs';

/** The time zones every gate group must run in, once each. A constant, never an input (4.2 item 11). */
export const GATE_TZS = ['UTC', 'Pacific/Auckland'];
/** D-HT10-A5c-2's 30 min goal for a gate job's gate step (D-GATESPLIT-BUDGET): over it is red. */
export const JOB_BUDGET_S = 1800;
/** The re-pick signal (2.2): any shard over it is reported, not red. */
export const SHARD_TARGET_S = 900;

const key = (r) => `${r.id}|${r.theme}|${r.state}`;

/**
 * The verdict. `gate`: gate proof manifests. `ht10`: [{ manifest, tz, shard }]. `gateSrc`: the gate file at this sha.
 * Returns { problems, notes }; any problem makes the job red.
 */
export function verdict({ gate, ht10 = [], gateSrc, times, sha, event, arrangement = 'split', needs = {}, ht10Tuples = null }) {
  const problems = [], notes = [];
  // in the serial arrangement (E8's A, workflow_dispatch only) the shard jobs are skipped on purpose
  const maySkip = arrangement === 'serial' && event === 'workflow_dispatch' ? new Set(['gate-shard']) : new Set();
  for (const [job, n] of Object.entries(needs)) if (n?.result !== 'success' && !(n?.result === 'skipped' && maySkip.has(job))) problems.push(`needed job ${job} ended ${n?.result ?? 'unknown'}`);
  if (!/^[0-9a-f]{40}$/.test(sha ?? '')) problems.push(`GITHUB_SHA is not a full sha: ${sha}`);

  // ---- gate family
  const { groups, problems: parse } = parseGate(gateSrc);
  problems.push(...parse.map(p => `gate file: ${p}`));
  const keys = groups.map(g => g.key), checked = keys.filter(k => !ALWAYS.has(k));
  const serial = arrangement === 'serial' && event === 'workflow_dispatch';
  if (arrangement === 'serial' && !serial) problems.push(`the serial arrangement is allowed only on workflow_dispatch, not ${event}`);
  const K = serial ? 1 : times.K;
  for (const m of gate) {
    if (m.sha !== sha) problems.push(`gate proof ${m.meta?.tz}/${m.meta?.job?.k} ran on ${m.sha}, not ${sha}`);
    if (!GATE_TZS.includes(m.meta?.tz)) problems.push(`gate proof in an unexpected time zone ${m.meta?.tz}`);
  }
  for (const tz of GATE_TZS) {
    const ms = gate.filter(m => m.meta?.tz === tz);
    const ks = ms.map(m => m.meta?.job?.k).sort((a, b) => a - b);
    if (ms.length !== K || ks.join() !== Array.from({ length: K }, (_, i) => i + 1).join() || ms.some(m => m.meta?.job?.K !== K)) problems.push(`${tz}: expected gate proofs for jobs 1..${K} of ${K}, got [${ms.map(m => `${m.meta?.job?.k}/${m.meta?.job?.K}`).join(', ')}]`);
    const plan = K === 1 ? [checked] : planFor(keys, times, K, tz);
    const hash = planHash(keys, times, tz);
    for (const m of ms) {
      if (m.meta?.plan !== hash) problems.push(`${tz} job ${m.meta?.job?.k}: packed a different plan (${m.meta?.plan?.slice(0, 12)} vs ${hash.slice(0, 12)})`);
      if (m.meta?.groups !== keys.length) problems.push(`${tz} job ${m.meta?.job?.k}: saw ${m.meta?.groups} groups, the gate file has ${keys.length}`);
      const ran = m.rows.filter(r => r.check === 'gate' && !ALWAYS.has(r.id)).map(r => r.id);
      const want = plan[(m.meta?.job?.k ?? 0) - 1] ?? [];
      if (ran.join() !== want.join()) problems.push(`${tz} job ${m.meta?.job?.k}: ran [${ran.join(', ')}], its plan is [${want.join(', ')}]`);
      for (const a of ALWAYS) { const n = m.rows.filter(r => r.check === 'gate' && r.id === a).length; if (n !== 1) problems.push(`${tz} job ${m.meta?.job?.k}: ALWAYS group ${a} proven ${n} times, expected once per job`); }
      const s = m.meta?.gateSeconds;
      if (!(s >= 0)) problems.push(`${tz} job ${m.meta?.job?.k}: no gateSeconds`);
      else if (s > JOB_BUDGET_S) problems.push(`${tz} job ${m.meta?.job?.k}: gate step ${s} s, over the ${JOB_BUDGET_S} s budget (D-GATESPLIT-BUDGET)`);
      else if (s > SHARD_TARGET_S) notes.push(`${tz} job ${m.meta?.job?.k}: ${s} s, over the ${SHARD_TARGET_S} s target: re-pick K (design 2.2)`);
      if (!m.meta?.www) problems.push(`${tz} job ${m.meta?.job?.k}: no www hash`);
    }
  }
  const expected = GATE_TZS.flatMap(tz => checked.map(id => ({ id, theme: '*', state: tz })));
  const gateRows = gate.map(m => ({ sha: m.sha, rows: m.rows.filter(r => r.check === 'gate' && !ALWAYS.has(r.id)) }));
  if (gate.length) problems.push(...coverProblems(gateRows, expected).map(p => `gate: ${p}`));
  else problems.push('gate: no gate proofs found');
  const nRows = gateRows.reduce((a, m) => a + m.rows.length, 0);
  if (nRows !== expected.length) problems.push(`gate: ${nRows} group rows, expected ${checked.length} groups x ${GATE_TZS.length} time zones = ${expected.length}`);
  const themeSeen = new Map(), themesOf = new Map();
  for (const m of gate) for (const r of m.rows.filter(x => x.check === 'gate-theme')) {
    const k = key(r); themeSeen.set(k, (themeSeen.get(k) ?? 0) + 1);
    const t = `${r.id}|${r.state}`; if (!themesOf.has(t)) themesOf.set(t, new Set()); themesOf.get(t).add(r.theme);
  }
  for (const [k, n] of themeSeen) if (n > 1) problems.push(`gate-theme ${k} proven ${n} times`);
  for (const id of checked) {
    const a = [...(themesOf.get(`${id}|UTC`) ?? [])].sort().join(), b = [...(themesOf.get(`${id}|Pacific/Auckland`) ?? [])].sort().join();
    if (a !== b) problems.push(`${id}: themes seen in UTC [${a}] differ from Pacific/Auckland [${b}]`);
  }
  for (const f of ['www', 'chrome']) { const v = new Set(gate.map(m => m.meta?.[f])); if (v.size > 1) problems.push(`gate proofs differ in meta.${f}: ${[...v].join(' / ')}`); }
  for (const m of gate) for (const r of m.rows) if (r.result !== 'pass') problems.push(`${r.state} ${r.check} ${r.id}${r.theme === '*' ? '' : ` (${r.theme})`}: ${r.result}`);
  const co = [...new Set(gate.flatMap(m => m.meta?.constructionOnly ?? []))].sort();
  if (co.length) notes.push(`theme proof by construction only (no theme-named file): ${co.join(', ')}`);

  // ---- ht10 family (when its tuples are given)
  if (ht10Tuples) for (const tz of GATE_TZS) {
    const js = ht10.filter(j => j.tz === tz);
    const Ns = new Set(js.map(j => j.manifest.shard?.N ?? 1));
    const N = js.length ? Math.max(...Ns) : 0;
    const ks = js.map(j => (j.manifest.shard?.k ?? 0) + 1).sort((a, b) => a - b);
    if (!js.length || Ns.size !== 1 || ks.join() !== Array.from({ length: N }, (_, i) => i + 1).join()) problems.push(`ht10 ${tz}: expected shards 1..N once each, got [${js.map(j => `${(j.manifest.shard?.k ?? 0) + 1}/${j.manifest.shard?.N ?? 1}`).join(', ')}]`);
    for (const j of js) if (j.manifest.sha !== sha) problems.push(`ht10 ${tz} shard ${(j.manifest.shard?.k ?? 0) + 1}: ran on ${j.manifest.sha}, not ${sha}`);
    if (js.length) problems.push(...coverProblems(js.map(j => j.manifest), ht10Tuples).map(p => `ht10 ${tz}: ${p}`));
    for (const j of js) for (const r of j.manifest.rows) if (r.result !== 'pass') problems.push(`ht10 ${tz} ${r.id} ${r.theme} ${r.state}: ${r.result}`);
  }
  for (const j of ht10) if (!GATE_TZS.includes(j.tz)) problems.push(`ht10 proof in an unexpected time zone ${j.tz}`);
  return { problems, notes };
}

/** Every gate proof and ht10 proof under `dir` (artifacts download into one folder each). */
export function collect(dir) {
  const files = [];
  const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else files.push(p); } };
  walk(dir);
  const gate = files.filter(f => /^gate-proof-.+\.json$/.test(basename(f))).map(f => JSON.parse(readFileSync(f, 'utf8')));
  const ht10 = files.filter(f => basename(f) === 'ht10-proof.json').map(f => {
    const jobFile = join(dirname(f), 'ht10-job.json');
    let job = {};
    try { job = JSON.parse(readFileSync(jobFile, 'utf8')); } catch { job = { tz: null }; }
    return { manifest: JSON.parse(readFileSync(f, 'utf8')), tz: job.tz };
  });
  return { gate, ht10 };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = process.argv[2];
  if (!dir) { console.error('usage: node scripts/ci-verdict.mjs <proof dir>'); process.exit(2); }
  const { gate, ht10 } = collect(dir);
  const { ht10AllTuples } = await import('../tools/plates/fidelity/harness.mjs');
  const { problems, notes } = verdict({
    gate, ht10, gateSrc: readFileSync(GATE_FILE, 'utf8'), times: JSON.parse(readFileSync(TIMES_FILE, 'utf8')),
    sha: process.env.GITHUB_SHA, event: process.env.GITHUB_EVENT_NAME, arrangement: process.env.MARC_GATE_ARRANGEMENT || 'split',
    needs: JSON.parse(process.env.MARC_NEEDS || '{}'), ht10Tuples: await ht10AllTuples(),
  });
  for (const m of gate) console.log(`gate ${m.meta?.tz} job ${m.meta?.job?.k}/${m.meta?.job?.K}: ${m.rows.filter(r => r.check === 'gate').length} groups, ${m.meta?.gateSeconds} s`);
  for (const n of notes) console.log(`note: ${n}`);
  if (problems.length) { console.error(`gate-verdict FAIL (${problems.length}):\n${problems.join('\n')}`); process.exit(1); }
  console.log(`gate-verdict PASS: ${gate.length} gate proofs and ${ht10.length} ht10 proofs on ${process.env.GITHUB_SHA}; every group x time zone once, every HT-10 tuple x time zone once`);
}
