// LIB-4c (card LIB-4c Do 8, C13; D-LIB4-ENTRY): compares N library proof sets of one sha (each a folder of downloaded
// artifacts): the rows, each row's result, and the px of every pixel tuple. Exits 1 on the first difference. The
// pattern is GATE-SPLIT's gate-compare.mjs.
//   node tools/plates/library/ci/compare.mjs <dir1> <dir2> [<dir3> ...]
import { fileURLToPath } from 'node:url';
import { collectLibrary } from './verdict.mjs';

const key = r => `${r.id}|${r.theme}|${r.state}`;
/** { sha, results: Map(key -> result), px: Map(key -> px) } of one run's shard proofs. */
export function summary(shards) {
  const results = new Map(), px = new Map(), shas = new Set(shards.map(m => m.sha));
  for (const m of shards) {
    for (const r of m.rows) results.set(key(r), r.result);
    for (const [k, v] of Object.entries(m.meta?.px ?? {})) px.set(k, v);
  }
  return { shas, results, px, n: shards.reduce((a, m) => a + m.rows.length, 0) };
}

/** The first difference between runs (each a list of shard manifests), or null when all are identical. */
export function firstDifference(runs) {
  if (runs.length < 2) return 'need at least two runs';
  const S = runs.map(summary), [a] = S;
  if (a.shas.size !== 1) return `run 1 has ${a.shas.size} shas`;
  if (!a.results.size) return 'run 1 has no rows';
  for (let i = 1; i < S.length; i++) {
    const b = S[i], at = `run ${i + 1} vs run 1`;
    if (b.shas.size !== 1 || [...b.shas][0] !== [...a.shas][0]) return `${at}: sha ${[...b.shas].join(', ')} != ${[...a.shas][0]}`;
    if (b.n !== a.n) return `${at}: ${b.n} rows != ${a.n}`;
    for (const [k, r] of a.results) { if (!b.results.has(k)) return `${at}: row ${k} missing`; if (b.results.get(k) !== r) return `${at}: ${k} is ${b.results.get(k)}, was ${r}`; }
    for (const k of b.results.keys()) if (!a.results.has(k)) return `${at}: extra row ${k}`;
    for (const [k, v] of a.px) if (b.px.get(k) !== v) return `${at}: px ${k} is ${b.px.get(k) ?? 'missing'}, was ${v}`;
    for (const k of b.px.keys()) if (!a.px.has(k)) return `${at}: extra px tuple ${k}`;
  }
  return null;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dirs = process.argv.slice(2);
  if (dirs.length < 2) { console.error('usage: node tools/plates/library/ci/compare.mjs <dir1> <dir2> [...]'); process.exit(2); }
  const runs = dirs.map(d => collectLibrary(d).shards), d = firstDifference(runs);
  if (d) { console.error(`library compare FAIL: ${d}`); process.exit(1); }
  const s = summary(runs[0]);
  console.log(`library compare PASS: ${runs.length} runs on ${[...s.shas][0]}, ${s.n} rows and ${s.px.size} px tuples identical`);
}
