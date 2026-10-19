// LIB-4c (card LIB-4c Do 6; D-LIB4-VERDICT): the library family of gate-verdict (D-GATESPLIT-ONE; there is no
// howto-verdict). It recomputes at the sha the mode, the ids (affected mode: affectedIds from the rebuild proof's base
// sha, changed list and base-side values; it never copies the proof's ids and never fetches), K, the plan hash and
// the expected tuples, and is red on every D-LIB4-VERDICT item. Build and CI time only; never bundled.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { coverProblems } from '../../fidelity/shard.mjs';
import { ROOT } from '../../lib/inputs.mjs';
import { HT_PLATES } from '../../fidelity/harness.mjs';
import { latestEntries } from '../../golden.mjs';
import { LIBRARY_GOLDEN_DIR, rows, shippedIds } from '../registry.mjs';
import { LIB_ONCE, libraryTuples } from '../fidelity/tuples.mjs';
import { rowProblems } from '../fidelity/rows.mjs';
import { affectedIds } from './affected.mjs';
import { modeOf } from './mode.mjs';
import { JOB_BUDGET_S, SHARD_TARGET_S, libraryIds, libraryPlan, readTimes } from './plan.mjs';

/** The jobs the family needs in MARC_NEEDS, each with result success. */
export const LIBRARY_NEEDS = ['howto-rebuild', 'howto-shard'];
export const REBUILD_FILE = 'howto-rebuild-proof.json';
export const SHARD_FILE = /^howto-proof-(\d+)of(\d+)\.json$/;
/** The page kinds L1 has a builder for. */
export const PAGE_KINDS = ['page', 'layers-page'];

/** { rebuild: [manifest], shards: [manifest] } under `dir` (one folder per artifact); byte-identical copies dropped. */
export function collectLibrary(dir) {
  const files = [];
  const walk = d => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else files.push(p); } };
  walk(dir);
  const seen = new Set();
  const read = re => files.filter(f => re.test(basename(f))).map(f => readFileSync(f, 'utf8')).filter(t => !seen.has(t) && seen.add(t)).map(t => JSON.parse(t));
  return { rebuild: read(/^howto-rebuild-proof\.json$/), shards: read(SHARD_FILE) };
}

/** Every pinned library page at `root`: [{ id: '<golden file>#<kind>', file, kind, pageSha256, bytes }], plus unknown kinds. */
export function pinnedPages(root = ROOT) {
  const dir = join(root, LIBRARY_GOLDEN_DIR), out = [], unknown = [];
  let names = [];
  try { names = readdirSync(dir).filter(n => n.endsWith('.json')).sort(); } catch { names = []; }
  for (const n of names) {
    const file = `${LIBRARY_GOLDEN_DIR}/${n}`, data = JSON.parse(readFileSync(join(dir, n), 'utf8'));
    for (const [k, e] of latestEntries(data.entries ?? [])) {
      if (e.kind === 'plate') continue;
      if (!PAGE_KINDS.includes(e.kind)) { unknown.push(`${file}: page kind ${e.kind} has no builder`); continue; }
      out.push({ id: `${file}#${k}`, file, kind: k, pageSha256: e.pageSha256, bytes: e.bytes });
    }
  }
  return { pages: out, unknown };
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/**
 * The family's verdict. lib: the shard manifests; rebuild: the rebuild manifests (exactly one is expected); gate: the
 * gate family's manifests (for www and chrome). Returns { problems, notes, line, mode, ids, seconds }.
 */
export async function libraryVerdict({ lib, rebuild, gate = [], sha, ref, event, needs = {}, root = ROOT, all = rows(root), times = readTimes(root) }) {
  const problems = [], notes = [], t0 = Date.now();
  for (const job of LIBRARY_NEEDS) {
    if (!(job in needs)) problems.push(`library: needed job ${job} is missing from MARC_NEEDS`);
    else if (needs[job]?.result !== 'success') problems.push(`library: needed job ${job} ended ${needs[job]?.result ?? 'unknown'}`);
  }
  if (!/^[0-9a-f]{40}$/.test(sha ?? '')) problems.push(`library: GITHUB_SHA is not a full sha: ${sha}`);
  const U = libraryIds(all), mode = modeOf({ ref, event });
  const eight = HT_PLATES.map(p => p[1]);   // the 8 the HT blocks prove
  if (!same([...U, ...eight].sort(), [...shippedIds(all)].sort())) problems.push(`library: library ids + the 8 (${U.length + eight.length}) differ from shippedIds() (${shippedIds(all).length}): ${shippedIds(all).filter(id => !U.includes(id) && !eight.includes(id)).join(', ')}`);

  // ---- the rebuild proof (L1) and the ids
  if (rebuild.length !== 1) problems.push(`library: expected one rebuild proof, got ${rebuild.length}`);
  const rb = rebuild[0] ?? { rows: [], meta: {} }, rm = rb.meta ?? {};
  if (rebuild.length && rb.sha !== sha) problems.push(`library: the rebuild proof ran on ${rb.sha}, not ${sha}`);
  if (rm.mode !== mode) problems.push(mode === 'full' && rm.mode === 'affected' ? `library: affected mode on a full ref (${ref}, ${event})` : `library: the rebuild ran in mode ${rm.mode}, the ref gives ${mode}`);
  let ids = U, reasons = [];
  if (mode === 'affected') {
    const a = await affectedIds({ changed: rm.changed === undefined ? null : rm.changed, base: rm.base, baseValues: rm.baseValues ?? {}, root, all });
    ids = a.ids; reasons = a.reasons;
  }
  const seconds = (Date.now() - t0) / 1000;
  if (seconds > 120) notes.push(`library: the affected recompute took ${seconds.toFixed(1)} s (over 2 min; gate-verdict has timeout-minutes 10)`);
  const plan = libraryPlan({ ids, times });
  if (plan.note) notes.push(`library: ${plan.note}`);
  if (rm.plan?.hash !== plan.hash) problems.push(`library: the rebuild planned ${rm.plan?.hash?.slice(0, 12)}, the verdict's plan is ${plan.hash.slice(0, 12)} (ids, times or K differ)`);
  const { pages, unknown } = pinnedPages(root);
  problems.push(...unknown.map(u => `library: ${u}`));
  const want = pages.map(p => ({ id: p.id, theme: '*', state: `L1/${p.kind}@*` }));
  if (rebuild.length) problems.push(...coverProblems([rb], want).map(p => `library L1: ${p}`));
  for (const r of rb.rows ?? []) if (r.result !== 'pass') problems.push(`library L1 ${r.id}: ${r.result}`);
  for (const p of pages) if (rm.pageShas?.[p.id] !== p.pageSha256) problems.push(`library L1 ${p.id}: rebuilt ${rm.pageShas?.[p.id]?.slice(0, 12)} != pinned ${p.pageSha256.slice(0, 12)}`);
  if (Object.keys(rm.pageShas ?? {}).length !== pages.length) problems.push(`library L1: ${Object.keys(rm.pageShas ?? {}).length} page shas in the rebuild proof, ${pages.length} pinned pages`);

  // ---- the shards
  const K = plan.K, ks = lib.map(m => m.meta?.job?.k).sort((a, b) => a - b);
  if (ks.join() !== Array.from({ length: K }, (_, i) => i + 1).join() || lib.some(m => m.meta?.job?.K !== K)) problems.push(`library: expected shard proofs 1..${K} of ${K}, got [${lib.map(m => `${m.meta?.job?.k}/${m.meta?.job?.K}`).join(', ')}]`);
  const tuples = [...await libraryTuples(ids, { root }), ...Array.from({ length: K }, (_, i) => LIB_ONCE.shard(i + 1)).flat(), ...LIB_ONCE.run];
  if (lib.length) problems.push(...coverProblems(lib, tuples).map(p => `library: ${p}`));
  else problems.push('library: no shard proofs found');
  for (const m of lib) {
    const k = m.meta?.job?.k, at = `library shard ${k}`;
    if (m.sha !== sha) problems.push(`${at}: ran on ${m.sha}, not ${sha}`);
    if (m.meta?.plan !== plan.hash) problems.push(`${at}: packed plan ${m.meta?.plan?.slice(0, 12)}, the verdict's plan is ${plan.hash.slice(0, 12)}`);
    if (m.meta?.mode !== mode) problems.push(`${at}: mode ${m.meta?.mode}, the ref gives ${mode}`);
    if (!same([...(m.meta?.ids ?? [])].sort(), [...(plan.shards[(k ?? 0) - 1] ?? [])].sort())) problems.push(`${at}: proved ids [${(m.meta?.ids ?? []).join(', ')}], its plan is [${(plan.shards[(k ?? 0) - 1] ?? []).join(', ')}]`);
    if (m.meta?.tz !== 'UTC') problems.push(`${at}: ran in time zone ${m.meta?.tz}, not UTC`);
    if (!same(m.meta?.pageShas ?? null, rm.pageShas ?? null)) problems.push(`${at}: its page shas differ from the rebuild proof`);
    const s = m.meta?.shardSeconds;
    if (!(s >= 0)) problems.push(`${at}: no shardSeconds`);
    else if (s > JOB_BUDGET_S) problems.push(`${at}: ${s} s, over the ${JOB_BUDGET_S} s budget`);
    else if (s > SHARD_TARGET_S) notes.push(`${at}: ${s} s, over the ${SHARD_TARGET_S} s target: re-pick K/N (refresh times.json; D-GATESPLIT-BUDGET)`);
    for (const r of m.rows) {
      if (r.result !== 'pass') problems.push(`${at}: ${r.id} ${r.theme} ${r.state}: ${r.result}`);
      for (const p of rowProblems(r)) problems.push(`${at}: ${p}`);
    }
  }
  for (const f of ['www', 'chrome']) {
    const libV = new Set(lib.map(m => m.meta?.[f])), gateV = new Set(gate.map(m => m.meta?.[f]));
    if (libV.size > 1) problems.push(`library: shard proofs differ in meta.${f}: ${[...libV].join(' / ')}`);
    if (lib.length && !lib[0].meta?.[f]) problems.push(`library: no ${f} in the shard proofs`);
    if (gateV.size && [...libV].some(v => !gateV.has(v))) problems.push(`library: meta.${f} ${[...libV].join(' / ')} differs from the gate family's ${[...gateV].join(' / ')}`);
  }
  // D-LIB4c-4: a shard planned with no id because its fixed part is over the target is named, with the seconds it used
  const fixedOnly = plan.shards.map((s, j) => (s.length === 0 && plan.loads[j] > SHARD_TARGET_S ? `shard ${j + 1} once-states only (fixed ${Math.round(plan.loads[j] * 10) / 10} s planned, ${lib.find(m => m.meta?.job?.k === j + 1)?.meta?.shardSeconds ?? '?'} s used; D-LIB4c-4)` : null)).filter(Boolean);
  notes.push(...fixedOnly.map(f => `library: ${f}`));
  const line = `library: ${mode} (${ids.length} of ${U.length})${fixedOnly.length ? `; ${fixedOnly.join('; ')}` : ''}`;
  if (mode === 'affected') notes.push(...reasons.map(r => `library affected: ${r.path} (class ${r.cls}): ${r.ids === 'all' ? 'all ids' : r.ids.length ? r.ids.join(', ') : 'no id'}; ${r.why}`));
  return { problems, notes, line, mode, ids, seconds };
}
