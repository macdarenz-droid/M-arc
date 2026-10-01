// HT-10 (card HT10-A5; supervisor amendment 2026-09-30, library plan 5.4): the How-to shard helper and the proof
// manifest writer. Used only by gate block HT-10; the library's own shard jobs reuse it. Unset means "run
// everything": no shard is ever a way to drop a state. Build and gate time only; never bundled.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
/** Sort order of `(id, theme, state)` tuples: id, then theme, then state (plain code-unit order, locale-free). */
export const tupleOrder = (a, b) => cmp(a.id, b.id) || cmp(a.theme, b.theme) || cmp(a.state, b.state);

/**
 * Shard `k` of `N` (0 <= k < N) over the sorted `(id, theme, state)` tuples: the tuple at sorted index i belongs to
 * shard i mod N, so every tuple lands in exactly one shard. Returns `select(tuples)`, which sorts a copy and keeps
 * this shard's tuples. `htShard()` with both unset selects every tuple. Throws on a half-set or invalid pair and on
 * a duplicate tuple (a duplicate would be proven twice and another state never).
 */
export function htShard(k, N) {
  const unset = k == null && N == null;
  if (!unset) {
    if (!Number.isInteger(N) || N < 1) throw new Error(`htShard: N must be an integer >= 1, got ${N}`);
    if (!Number.isInteger(k) || k < 0 || k >= N) throw new Error(`htShard: k must be an integer in 0..${N - 1}, got ${k}`);
  }
  return tuples => {
    const sorted = [...tuples].sort(tupleOrder);
    for (let i = 0; i < sorted.length; i++) {
      const t = sorted[i];
      for (const f of ['id', 'theme', 'state']) if (typeof t[f] !== 'string' || !t[f]) throw new Error(`htShard: tuple ${i} has no ${f}: ${JSON.stringify(t)}`);
      if (i && tupleOrder(sorted[i - 1], t) === 0) throw new Error(`htShard: duplicate tuple ${JSON.stringify(t)}`);
    }
    return unset ? sorted : sorted.filter((_, i) => i % N === k);
  };
}

/**
 * Reads `MARC_HT_SHARD` ("k/N", 1-based as CI matrix jobs name them: "1/2" and "2/2") into htShard's 0-based
 * { k, N }. Unset or empty gives {} (run everything); anything else malformed throws.
 */
export function shardFromEnv(env = process.env) {
  const v = env.MARC_HT_SHARD;
  if (v == null || v === '') return {};
  const m = /^(\d+)\/(\d+)$/.exec(v);
  if (!m) throw new Error(`MARC_HT_SHARD must be "k/N" with 1 <= k <= N, got "${v}"`);
  const k = Number(m[1]) - 1, N = Number(m[2]);
  if (k < 0 || k >= N) throw new Error(`MARC_HT_SHARD must be "k/N" with 1 <= k <= N, got "${v}"`);
  htShard(k, N);   // validates
  return { k, N };
}

/**
 * D-HT10-A5: whether gate block HT-10 runs in this job. It runs when MARC_HT_SHARD is set (an ht10-gate shard) and
 * when it is unset (the full set, for local runs); it skips only in a job that sets MARC_HT10_OWN_JOB=1 without a
 * shard (the existing gate jobs, once HT-10 has its own job).
 */
export const ht10Runs = (env = process.env) => !(env.MARC_HT10_OWN_JOB === '1' && !env.MARC_HT_SHARD);

/** Every (id, theme, state) tuple: each id x theme x perIdState, plus each once-state as ('*', onceTheme, state). */
export function htTuples(ids, themes, perIdStates, onceStates = [], onceTheme = themes[0]) {
  return [
    ...ids.flatMap(id => themes.flatMap(theme => perIdStates.map(state => ({ id, theme, state })))),
    ...onceStates.map(state => ({ id: '*', theme: onceTheme, state })),
  ];
}

/**
 * The verdict over proof manifests (library plan 5.4): every manifest ran on one sha, and the (id, theme, state) rows
 * of all manifests together cover `tuples` exactly once (none missing, none twice, none extra). Returns the problems.
 */
export function coverProblems(manifests, tuples) {
  const out = [];
  const shas = new Set(manifests.map(m => m.sha));
  if (shas.size !== 1) out.push(`manifests ran on ${shas.size} shas: ${[...shas].join(', ')}`);
  const key = t => `${t.id}|${t.theme}|${t.state}`;
  const seen = new Map();
  for (const m of manifests) for (const r of m.rows) seen.set(key(r), (seen.get(key(r)) ?? 0) + 1);
  for (const t of tuples) { const n = seen.get(key(t)) ?? 0; if (n !== 1) out.push(`${key(t)} proven ${n} times`); seen.delete(key(t)); }
  for (const k of seen.keys()) out.push(`${k} proven but not expected`);
  return out;
}

const RESULTS = new Set(['pass', 'fail']);
/**
 * Writes the proof manifest (library plan 5.4): one row `{sha, id, check, state, theme, width, result}` per proven
 * state, sorted, as JSON at `file`. `width` is the CSS px width or null when the check has none. Throws (writing
 * nothing) on a row with a missing field, a result other than pass/fail, or a duplicate (id, check, state, theme,
 * width). Returns the manifest object.
 */
export function writeProof(file, { sha, shard = {}, rows }) {
  if (typeof sha !== 'string' || !/^[0-9a-f]{7,40}$/.test(sha)) throw new Error(`writeProof: sha must be a git sha, got ${sha}`);
  const out = rows.map((r, i) => {
    for (const f of ['id', 'check', 'state', 'theme']) if (typeof r[f] !== 'string' || !r[f]) throw new Error(`writeProof: row ${i} has no ${f}: ${JSON.stringify(r)}`);
    if (!(r.width === null || (Number.isFinite(r.width) && r.width > 0))) throw new Error(`writeProof: row ${i} width must be a positive number or null: ${JSON.stringify(r)}`);
    if (!RESULTS.has(r.result)) throw new Error(`writeProof: row ${i} result must be pass or fail: ${JSON.stringify(r)}`);
    return { sha, id: r.id, check: r.check, state: r.state, theme: r.theme, width: r.width, result: r.result };
  });
  const key = r => [r.id, r.check, r.state, r.theme, r.width ?? ''].join('\u0000');
  out.sort((a, b) => cmp(key(a), key(b)));
  for (let i = 1; i < out.length; i++) if (key(out[i - 1]) === key(out[i])) throw new Error(`writeProof: duplicate row ${JSON.stringify(out[i])}`);
  const manifest = { sha, shard: shard.N ? { k: shard.k, N: shard.N } : null, rows: out };
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(manifest, null, 1)}\n`);
  return manifest;
}
