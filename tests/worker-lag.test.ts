// F-VITEST-RPC-2: the worker-lag guard (tests/worker-lag.ts). Its wiring is pinned (A4), and each path of its mechanism
// runs as a fixture under tests/fixtures/worker-lag: an awaited child vitest with its own config and a 2 s limit (the
// tests/child-test.test.ts form), so the real setup file keeps its single 30 s limit.
import { execFile } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const VITEST = new URL('../node_modules/vitest/vitest.mjs', import.meta.url).pathname;
const CONFIG = new URL('./fixtures/worker-lag/vitest.config.ts', import.meta.url).pathname;
const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');

/** One fixture's run: its exit code, its tests' statuses and messages, and its output. */
const run = async (fixture: string) => {
  const dir = mkdtempSync(join(tmpdir(), 'worker-lag-')), out = join(dir, 'r.json');
  const env: NodeJS.ProcessEnv = { ...process.env, MARC_TEST_CHILD_CONFIG: CONFIG, NO_COLOR: '1', FORCE_COLOR: '0' };
  delete env.MARC_TEST_CHILD;
  let code = 0, text = '';
  try {
    const r = await promisify(execFile)(process.execPath, [VITEST, 'run', '--config', CONFIG, `tests/fixtures/worker-lag/${fixture}.fx.ts`, '--reporter=default', '--reporter=json', `--outputFile.json=${out}`], { env, maxBuffer: 1 << 26 });
    text = r.stdout + r.stderr;
  } catch (e: any) { code = typeof e.code === 'number' ? e.code : 1; text = `${e.stdout ?? ''}${e.stderr ?? ''}`; }
  try {
    const r = JSON.parse(readFileSync(out, 'utf8')), results = r.testResults.flatMap((f: any) => f.assertionResults);
    return { code, statuses: results.map((x: any) => x.status), message: results.map((x: any) => x.failureMessages.join('\n')).join('\n'), text };
  } finally { rmSync(dir, { recursive: true, force: true }); }
};
/** The guard's red for one fixture file: `blocked <s> s at <task>`. */
const red = (file: string, task: string) =>
  new RegExp(`\\[worker-lag\\] tests/fixtures/worker-lag/${file}\\.fx\\.ts: the worker's event loop was blocked (\\d+\\.\\d) s at ${task} \\(limit 2 s`);
const seconds = (text: string, re: RegExp) => Number(text.match(re)?.[1] ?? NaN);

describe('F-VITEST-RPC-2 the guard is wired, with one fixed limit (A4)', () => {
  it('vite.config.ts runs the setup file in every worker', () => {
    expect(read('../vite.config.ts')).toContain("    setupFiles: ['tests/worker-lag-setup.ts'],\n");
  });
  it('the setup file makes one call, installLagGuard(30_000)', () => {
    const calls = read('./worker-lag-setup.ts').split('\n').filter(l => l && !l.startsWith('//') && !l.startsWith('import '));
    expect(calls).toEqual(['installLagGuard(30_000);']);
  });
  it('the guard reads no environment variable', () => {
    expect(read('./worker-lag.ts')).not.toMatch(/\benv\b|process\.argv/);
  });
});

describe('F-VITEST-RPC-2 the guard fails a file that blocks its worker, naming the task (m1-m7)', { timeout: 120_000 }, () => {
  it('m1: a 3 s block in a test body fails the file, naming the test', async () => {
    const r = await run('test-body');
    expect([r.code, r.statuses]).toEqual([1, ['passed']]);
    expect(seconds(r.text, red('test-body', 'test "blocks in its body"'))).toBeGreaterThanOrEqual(3);
  });
  it('m2: a 3 s block in a beforeAll fails the file, naming beforeAll', async () => {
    const r = await run('before-all');
    expect(r.code).toBe(1);
    expect(seconds(r.text, red('before-all', 'beforeAll'))).toBeGreaterThanOrEqual(3);
  });
  it('m3: a 3 s block at module top level fails the file, naming collect', async () => {
    const r = await run('collect');
    expect(r.code).toBe(1);
    expect(seconds(r.text, red('collect', 'collect'))).toBeGreaterThanOrEqual(3);
  });
  it('m4: a 3 s block in the file\'s last afterAll fails the file, naming afterAll', async () => {
    const r = await run('after-all');
    expect(r.code).toBe(1);
    expect(seconds(r.text, red('after-all', 'afterAll'))).toBeGreaterThanOrEqual(3);
  });
  it('m5: a 3 s block after vi.useFakeTimers() still fails the file', async () => {
    const r = await run('fake-timers');
    expect(r.code).toBe(1);
    expect(seconds(r.text, red('fake-timers', 'test "blocks under fake timers"'))).toBeGreaterThanOrEqual(3);
  });
  it('m6: a 3 s block inside a child.it test fails the child, so its parent test fails', async () => {
    const r = await run('child');
    expect([r.code, r.statuses]).toEqual([1, ['failed']]);
    expect(r.message).toMatch(/child test passed \(child exit 1, 1 result\(s\)\): blocks in a child/);
    expect(seconds(r.message, red('child', 'test "fixture > blocks in a child"'))).toBeGreaterThanOrEqual(3);
  });
  it('m7 (control): a 1.5 s block, under the 2 s limit, passes', async () => {
    const r = await run('control');
    expect([r.code, r.statuses]).toEqual([0, ['passed']]);
    expect(r.text).not.toMatch(/\[worker-lag\]/);
  });
});

// D-RPC2-EXC (STOP 1 ruled (a), #428) and D-RPC2-EXC-LOCAL (review FAIL 6889918612 ruled, #428): the budget over the
// guard's lines, 15 s in CI and 10 s locally, and 20 s for an exact, named list of tests and one hook where three
// tools/** units run (follow-up F-BENCHDIP-EVAL takes them off it)
describe('F-VITEST-RPC-2 D-RPC2-EXC: the CI budget of the guard\'s lines', () => {
  const lag = (file: string, s: number, task: string) => `2026-11-14T15:00:00.0000000Z [worker-lag] ${file} ${s.toFixed(1)} s at ${task}`;
  const B = (): Promise<any> => import(/* @vite-ignore */ new URL('./worker-lag-budget.mjs', import.meta.url).href);
  const R17 = 'test "LIB-17 resume: the LIB-ZOOM circles (D-LIBZOOM-EXTEND; DESIGN.md section 17) > ';
  it('the excepted set is exactly the seven named places of the three units, each at its file:line', async () => {
    const { EXC, BUDGET, LOCAL_BUDGET, EXC_BUDGET } = await B();
    expect([BUDGET, LOCAL_BUDGET, EXC_BUDGET]).toEqual([15, 10, 20]);
    expect(EXC.map(([u, at, t]: string[]) => `${u} | ${at} | ${t}`)).toEqual([
      `runQa(bench_dip) | tests/howto/lb7-plates.test.ts:2014 | ${R17}each zoomed spec asks for its ruled zoom, and its plate fails PQ-H3 on that view at plate scale (why the zoom exists)"`,
      `runQa(bench_dip) | tests/howto/lb7-plates.test.ts:2024 | ${R17}the node half has no problem on either zoomed plate; the bar is met inside the circle at k, never lowered"`,
      `runQa(bench_dip) | tests/howto/lb7-plates.test.ts:2038 | ${R17}mutations: each zoom removed is red on the plate-scale bar; resistance_band_pull_apart at k 1.5 and bench_dip's trace on the still heel are red at the zoom"`,
      'bench_dip.mjs evaluation | tests/howto/lb7-plates.test.ts:62 | beforeAll',
      'bench_dip.mjs evaluation | tests/howto/platefix2-zoom.test.ts:58 | test "PF2 (a): existing zooms are byte-equal > the 37 zoom entries of every other spec render the svg, focus, circle, source and link they rendered before (a)"',
      'bench_dip.mjs evaluation | tests/howto/platefix3b-zoomhead.test.ts:23 | test "PF3b head projection: existing zooms are byte-equal > every other spec\'s zoom entries render the svg, focus, circle, source, link and posture they rendered before"',
      'platesPage(row) | tests/howto/library-rows.test.ts:561 | test "D-LIB2b-PINS (11): HT2-A1 and the class-map check for each shipped library row > for the repo\'s shipped library rows and the E1 tree\'s: its ht- plate strings are the plate cut from its batch plates page, whose fragments === the batch golden plate entry; no plate or plate-fit class"',
    ]);
    expect(new Set(EXC.map(([u]: string[]) => u)).size).toBe(3);
    // each file:line is where that test (or the file-level beforeAll) is declared
    for (const [, at, t] of EXC as [string, string, string][]) {
      const [file, n] = [at.slice(0, at.lastIndexOf(':')), Number(at.slice(at.lastIndexOf(':') + 1))];
      const line = readFileSync(file, 'utf8').split('\n')[n - 1] ?? '';
      if (t === 'beforeAll') expect(line).toMatch(/^beforeAll\(/);
      else expect(line.replace(/\\'/g, "'")).toContain(`it('${t.slice(t.lastIndexOf(' > ') + 3, -1)}'`);
    }
  });
  it('an unlisted block over 15 s is red; at 15 s it is not', async () => {
    const { budgetProblems } = await B();
    expect(budgetProblems(lag('tests/howto/lb6-plates.test.ts', 15.1, 'test "x > y"'))).toEqual(['tests/howto/lb6-plates.test.ts 15.1 s at test "x > y" (over 15 s)']);
    expect(budgetProblems(lag('tests/howto/lb6-plates.test.ts', 15.0, 'test "x > y"'))).toEqual([]);
    // the same file as an excepted block, but another task: still the 15 s budget
    expect(budgetProblems(lag('tests/howto/lb7-plates.test.ts', 16.0, 'test "LIB-17 A15: x > y"'))).toHaveLength(1);
  });
  it('a sibling test in a listed test\'s describe, or a listed name in another file, keeps the 15 s budget', async () => {
    const { budgetProblems, EXC } = await B();
    const sib = `${R17}LIB-SHIP W6: any other test"`;
    expect(budgetProblems(lag('tests/howto/lb7-plates.test.ts', 15.1, sib))).toEqual([`tests/howto/lb7-plates.test.ts 15.1 s at ${sib} (over 15 s)`]);
    for (const [, at, t] of EXC as [string, string, string][]) {
      const file = at.slice(0, at.lastIndexOf(':')), pre = t.slice(0, t.lastIndexOf(' > ') + 3);
      if (t !== 'beforeAll') expect(budgetProblems(lag(file, 15.1, `${pre}a sibling"`))).toHaveLength(1);
      expect(budgetProblems(lag(file, 15.1, `${t} `))).toHaveLength(1);              // a longer task string is not equal
      expect(budgetProblems(lag('tests/howto/lb6-plates.test.ts', 15.1, t))).toHaveLength(1);
    }
  });
  it('a listed block over 20 s is red; at 20 s it is not', async () => {
    const { budgetProblems, EXC } = await B();
    for (const [, at, t] of EXC as [string, string, string][]) {
      const file = at.slice(0, at.lastIndexOf(':'));
      expect(budgetProblems(lag(file, 20.0, t))).toEqual([]);
      expect(budgetProblems(lag(file, 20.1, t))).toEqual([`${file} 20.1 s at ${t} (over 20 s, an excepted unit)`]);
    }
  });
  it('D-RPC2-EXC-LOCAL: with the 10 s local budget an unlisted block over 10 s is red and a listed one keeps 20 s', async () => {
    const { budgetProblems, LOCAL_BUDGET, EXC } = await B();
    expect(budgetProblems(lag('tests/howto/lb6-plates.test.ts', 10.1, 'test "x > y"'), LOCAL_BUDGET)).toEqual(['tests/howto/lb6-plates.test.ts 10.1 s at test "x > y" (over 10 s)']);
    expect(budgetProblems(lag('tests/howto/lb6-plates.test.ts', 10.0, 'test "x > y"'), LOCAL_BUDGET)).toEqual([]);
    const [, at, t] = EXC[0] as [string, string, string], file = at.slice(0, at.lastIndexOf(':'));
    expect(budgetProblems(lag(file, 19.9, t), LOCAL_BUDGET)).toEqual([]);
    expect(budgetProblems(lag(file, 10.1, `${R17}a sibling"`), LOCAL_BUDGET)).toHaveLength(1);
  });
});
