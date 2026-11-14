// F-VITEST-RPC-2 (D-RPC2-TARGET, STOP 1 ruled (a) as D-RPC2-EXC on #428): the CI budget for the guard's `[worker-lag]`
// lines. Every block is at most 15 s in a CI job, except the blocks of three named tools/** units, which may reach 20 s:
// bench_dip's runQa stretch, bench_dip.mjs's module evaluation and one batch platesPage call (follow-up F-BENCHDIP-EVAL).
// The guard itself stays at its one 30 s limit (tests/worker-lag-setup.ts); this file only reads the lines it prints.
// Run: node tests/worker-lag-budget.mjs <job log>...   (exit 1 and one line per problem when a log is over budget)
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const BUDGET = 15, EXC_BUDGET = 20;
/** The exact set of excepted blocks: [unit, file, the task's leading text]. */
export const EXC = [
  ['runQa(bench_dip)', 'tests/howto/lb7-plates.test.ts', 'test "LIB-17 resume: the LIB-ZOOM circles (D-LIBZOOM-EXTEND; DESIGN.md section 17) > '],
  ['bench_dip.mjs evaluation', 'tests/howto/lb7-plates.test.ts', 'beforeAll'],
  ['bench_dip.mjs evaluation', 'tests/howto/platefix2-zoom.test.ts', 'test "PF2 (a): existing zooms are byte-equal > '],
  ['bench_dip.mjs evaluation', 'tests/howto/platefix3b-zoomhead.test.ts', 'test "PF3b head projection: existing zooms are byte-equal > '],
  ['platesPage(row)', 'tests/howto/library-rows.test.ts', 'test "D-LIB2b-PINS (11): HT2-A1 and the class-map check for each shipped library row > '],
];

const LINE = /\[worker-lag\] (\S+) (\d+(?:\.\d+)?) s at (.*)$/;
/** The over-budget blocks in a job log's text, one line each. */
export function budgetProblems(text) {
  const out = [];
  for (const raw of text.split('\n')) {
    const m = raw.replace(/\x1b\[[0-9;]*m/g, '').match(LINE);   // eslint-disable-line no-control-regex
    if (!m) continue;
    const [, file, s, task] = m, sec = Number(s);
    const exc = EXC.some(([, f, t]) => f === file && task.startsWith(t)), limit = exc ? EXC_BUDGET : BUDGET;
    if (sec > limit) out.push(`${file} ${s} s at ${task} (over ${limit} s${exc ? ', an excepted unit' : ''})`);
  }
  return out;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  let bad = 0;
  for (const f of process.argv.slice(2)) for (const p of budgetProblems(readFileSync(f, 'utf8'))) { console.log(`${f}: ${p}`); bad++; }
  console.log(bad ? `OVER BUDGET: ${bad} block(s)` : 'WITHIN BUDGET');
  process.exit(bad ? 1 : 0);
}
