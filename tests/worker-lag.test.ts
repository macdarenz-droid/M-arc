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

// D-RPC2-EXC (STOP 1 ruled (a), #428): the CI budget over the guard's lines, 15 s, and 20 s for an exact set of three
// tools/** units (follow-up F-BENCHDIP-EVAL)
describe('F-VITEST-RPC-2 D-RPC2-EXC: the CI budget of the guard\'s lines', () => {
  const lag = (file: string, s: number, task: string) => `2026-11-14T15:00:00.0000000Z [worker-lag] ${file} ${s.toFixed(1)} s at ${task}`;
  const B = (): Promise<any> => import(/* @vite-ignore */ new URL('./worker-lag-budget.mjs', import.meta.url).href);
  it('the excepted set is exactly the three named units, in five places', async () => {
    const { EXC, BUDGET, EXC_BUDGET } = await B();
    expect([BUDGET, EXC_BUDGET]).toEqual([15, 20]);
    expect(EXC.map(([u, f, t]: string[]) => `${u} | ${f} | ${t}`)).toEqual([
      'runQa(bench_dip) | tests/howto/lb7-plates.test.ts | test "LIB-17 resume: the LIB-ZOOM circles (D-LIBZOOM-EXTEND; DESIGN.md section 17) > ',
      'bench_dip.mjs evaluation | tests/howto/lb7-plates.test.ts | beforeAll',
      'bench_dip.mjs evaluation | tests/howto/platefix2-zoom.test.ts | test "PF2 (a): existing zooms are byte-equal > ',
      'bench_dip.mjs evaluation | tests/howto/platefix3b-zoomhead.test.ts | test "PF3b head projection: existing zooms are byte-equal > ',
      'platesPage(row) | tests/howto/library-rows.test.ts | test "D-LIB2b-PINS (11): HT2-A1 and the class-map check for each shipped library row > ',
    ]);
    expect(new Set(EXC.map(([u]: string[]) => u)).size).toBe(3);
  });
  it('an unlisted block over 15 s is red; at 15 s it is not', async () => {
    const { budgetProblems } = await B();
    expect(budgetProblems(lag('tests/howto/lb6-plates.test.ts', 15.1, 'test "x > y"'))).toEqual(['tests/howto/lb6-plates.test.ts 15.1 s at test "x > y" (over 15 s)']);
    expect(budgetProblems(lag('tests/howto/lb6-plates.test.ts', 15.0, 'test "x > y"'))).toEqual([]);
    // the same file as an excepted block, but another task: still the 15 s budget
    expect(budgetProblems(lag('tests/howto/lb7-plates.test.ts', 16.0, 'test "LIB-17 A15: x > y"'))).toHaveLength(1);
  });
  it('a listed block over 20 s is red; at 20 s it is not', async () => {
    const { budgetProblems } = await B();
    const t = 'test "LIB-17 resume: the LIB-ZOOM circles (D-LIBZOOM-EXTEND; DESIGN.md section 17) > each zoomed spec asks"';
    expect(budgetProblems(lag('tests/howto/lb7-plates.test.ts', 20.0, t))).toEqual([]);
    expect(budgetProblems(lag('tests/howto/lb7-plates.test.ts', 20.1, t))).toEqual([`tests/howto/lb7-plates.test.ts 20.1 s at ${t} (over 20 s, an excepted unit)`]);
  });
});
