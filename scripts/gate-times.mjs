// GATE-SPLIT (docs/qa/GATE-SPLIT-DESIGN.md 3.4): refreshes scripts/gate-times.json from the gate proofs of one run
// (meta.seconds per group; the larger of the two time zones). K, offsets and default stay as they are; the supervisor
// runs this after merges. Re-packing moves blocks between jobs and never changes them.
//   node scripts/gate-times.mjs <proof dir> [--write]
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { collect } from './ci-verdict.mjs';
import { TIMES_FILE } from './gate-split.mjs';

export function refreshTimes(times, manifests) {
  const seconds = {};
  for (const m of manifests) for (const [k, s] of Object.entries(m.meta?.seconds ?? {})) seconds[k] = Math.max(seconds[k] ?? 0, s);
  return { ...times, seconds: Object.fromEntries(Object.keys(seconds).sort().map(k => [k, seconds[k]])) };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = process.argv[2];
  if (!dir) { console.error('usage: node scripts/gate-times.mjs <proof dir> [--write]'); process.exit(2); }
  const next = refreshTimes(JSON.parse(readFileSync(TIMES_FILE, 'utf8')), collect(dir).gate);
  const text = `${JSON.stringify(next, null, 1)}\n`;
  if (process.argv.includes('--write')) writeFileSync(TIMES_FILE, text); else process.stdout.write(text);
}
