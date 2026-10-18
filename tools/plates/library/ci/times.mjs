// LIB-4c (card LIB-4c Do 7; D-LIB4-SHARD): refreshes tools/plates/library/ci/times.json from the library shard proofs
// of full runs: each id's seconds (the largest seen) and the once-states' seconds (once.shard: the largest other shard's;
// once.run: shard 1's minus once.shard). An id's seconds are its share of its shard's wall time after the once-states
// and c0 (D-LIB4c-5, D-LIB4c-C0: c0 is planned separately, so it is not counted twice): the runner's meta.seconds sums each id's job durations, and at P > 1 those jobs overlap, so the raw sums
// add up to about P times the wall time the plan budgets (C14: 3,094 job-seconds in an 829 s shard at P = 4). default and c0 stay as they are. GATE-SPLIT's refreshTimes keys its result
// `seconds` and reads only meta.seconds, so its shape does not fit; this is the thin wrapper. Only the supervisor runs
// it; batch PRs never edit times.json.
//   node tools/plates/library/ci/times.mjs <proof dir> [--write]
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT } from '../../lib/inputs.mjs';
import { TIMES_FILE } from './plan.mjs';
import { collectLibrary } from './verdict.mjs';

export function refreshLibraryTimes(times, shards) {
  const ids = {};
  for (const m of shards) {
    const raw = Object.entries(m.meta?.seconds ?? {}), sum = raw.reduce((a, [, s]) => a + s, 0);
    const wall = m.meta?.shardSeconds >= 0 ? Math.max(0, m.meta.shardSeconds - (m.meta.onceSeconds ?? 0) - (times.c0 ?? 0)) : sum;
    for (const [id, s] of raw) ids[id] = Math.max(ids[id] ?? 0, Math.round((sum ? wall * s / sum : 0) * 10) / 10);
  }
  // shard 1 runs LIB_ONCE.run and its own LIB_ONCE.shard rows; every other shard only its LIB_ONCE.shard rows
  const others = shards.filter(m => m.meta?.job?.k > 1 && m.meta?.onceSeconds >= 0).map(m => m.meta.onceSeconds);
  const first = shards.filter(m => m.meta?.job?.k === 1 && m.meta?.onceSeconds >= 0).map(m => m.meta.onceSeconds);
  const shard = others.length ? Math.max(...others) : times.once?.shard ?? 0;
  const run = first.length ? Math.round(Math.max(0, Math.max(...first) - shard) * 10) / 10 : times.once?.run ?? 0;
  return { ...times, once: { run, shard }, ids: Object.fromEntries(Object.keys(ids).sort().map(id => [id, ids[id]])) };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = process.argv[2];
  if (!dir) { console.error('usage: node tools/plates/library/ci/times.mjs <proof dir> [--write]'); process.exit(2); }
  const file = join(ROOT, TIMES_FILE), next = refreshLibraryTimes(JSON.parse(readFileSync(file, 'utf8')), collectLibrary(dir).shards);
  const text = `${JSON.stringify(next, null, 1)}\n`;
  if (process.argv.includes('--write')) writeFileSync(file, text); else process.stdout.write(text);
}
