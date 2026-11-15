// F-VITEST-RPC-2 (D-RPC2-TARGET; STOP 1 ruled (a) as D-RPC2-EXC, review FAIL ruled as D-RPC2-EXC-LOCAL, #428): the budget
// for the guard's `[worker-lag]` lines. Every block is at most 15 s in a CI job and 10 s locally, except the exact,
// named list below, whose blocks may reach 20 s in both until follow-up F-BENCHDIP-EVAL takes them off it. They are
// the tests and the hook where three tools/** units run: bench_dip's runQa stretch, bench_dip.mjs's module evaluation
// and one batch platesPage call. A line is excepted only when its file and its whole task string are equal (===) to an
// entry's. The guard itself stays at its one 30 s limit (tests/worker-lag-setup.ts); this file only reads its lines.
// Run: node tests/worker-lag-budget.mjs [--local] <log>...   (exit 1 and one line per problem when a log is over budget)
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const BUDGET = 15, LOCAL_BUDGET = 10, EXC_BUDGET = 20;
const R17 = 'test "LIB-17 resume: the LIB-ZOOM circles (D-LIBZOOM-EXTEND; DESIGN.md section 17) > ';
/** The exact excepted set: [unit, file:line, the guard's whole task string]. */
export const EXC = [
  ['runQa(bench_dip)', 'tests/howto/lb7-plates.test.ts:2014', `${R17}each zoomed spec asks for its ruled zoom, and its plate fails PQ-H3 on that view at plate scale (why the zoom exists)"`],
  ['runQa(bench_dip)', 'tests/howto/lb7-plates.test.ts:2024', `${R17}the node half has no problem on either zoomed plate; the bar is met inside the circle at k, never lowered"`],
  ['runQa(bench_dip)', 'tests/howto/lb7-plates.test.ts:2038', `${R17}mutations: each zoom removed is red on the plate-scale bar; resistance_band_pull_apart at k 1.5 and bench_dip's trace on the still heel are red at the zoom"`],
  ['bench_dip.mjs evaluation', 'tests/howto/lb7-plates.test.ts:62', 'beforeAll'],
  ['bench_dip.mjs evaluation', 'tests/howto/platefix2-zoom.test.ts:58', 'test "PF2 (a): existing zooms are byte-equal > the 37 zoom entries of every other spec render the svg, focus, circle, source and link they rendered before (a)"'],
  ['bench_dip.mjs evaluation', 'tests/howto/platefix3b-zoomhead.test.ts:23', 'test "PF3b head projection: existing zooms are byte-equal > every other spec\'s zoom entries render the svg, focus, circle, source, link and posture they rendered before"'],
  ['platesPage(row)', 'tests/howto/library-rows.test.ts:561', 'test "D-LIB2b-PINS (11): HT2-A1 and the class-map check for each shipped library row > for the repo\'s shipped library rows and the E1 tree\'s: its ht- plate strings are the plate cut from its batch plates page, whose fragments === the batch golden plate entry; no plate or plate-fit class"'],
];

const LINE = /\[worker-lag\] (\S+) (\d+(?:\.\d+)?) s at (.*)$/;
/** The over-budget blocks in a job log's text, one line each. */
export function budgetProblems(text, budget = BUDGET) {
  const out = [];
  for (const raw of text.split('\n')) {
    const m = raw.replace(/\x1b\[[0-9;]*m/g, '').match(LINE);   // eslint-disable-line no-control-regex
    if (!m) continue;
    const [, file, s, task] = m, sec = Number(s);
    const exc = EXC.some(([, at, t]) => at.slice(0, at.lastIndexOf(':')) === file && t === task), limit = exc ? EXC_BUDGET : budget;
    if (sec > limit) out.push(`${file} ${s} s at ${task} (over ${limit} s${exc ? ', an excepted unit' : ''})`);
  }
  return out;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const args = process.argv.slice(2), local = args[0] === '--local', budget = local ? LOCAL_BUDGET : BUDGET;
  let bad = 0;
  for (const f of args.slice(local ? 1 : 0)) for (const p of budgetProblems(readFileSync(f, 'utf8'), budget)) { console.log(`${f}: ${p}`); bad++; }
  console.log(bad ? `OVER BUDGET: ${bad} block(s)` : 'WITHIN BUDGET');
  process.exit(bad ? 1 : 0);
}
