// F-VITEST-RPC: run a test's body in an awaited child vitest process, so the worker that runs this file never blocks
// on it. vitest's worker answers its runner over RPC with a 60 s limit; a long synchronous body in the worker blocks
// that RPC and the run exits 1 with `Timeout calling "onTaskUpdate"` even when every test passed (D-LIB13S-RPC,
// D-LIB8M-RPC). `child.it(name, fn, timeout)` registers the test exactly as `it(name, fn, timeout)` would, and
// `child.it.each(items)(name, fn, timeout)` as `it.each` would for string items (the call keeps the text "it('", which
// some files' own checks read).
// - In the child (MARC_TEST_CHILD=1) it is `it` with the original body, run with every hook its describe declares,
//   then one macrotask, so tests that run back to back in one child never add up to one long block of its worker.
// - In the parent its body is replaced by one awaited child per describe: vitest on this file, filtered (-t) to the
//   full names of that describe's child.it tests, which run there in file order. Each parent test then passes only when
//   the child's JSON report holds exactly one result for it and that result passed; otherwise it throws the child's
//   failure messages. The child's output is printed once, by the first of the describe's tests.
import { execFile } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { it } from 'vitest';

export const IN_CHILD = process.env.MARC_TEST_CHILD === '1';
const VITEST = new URL('../node_modules/vitest/vitest.mjs', import.meta.url).pathname;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const yieldOnce = () => new Promise<void>(r => setImmediate(r));
const WRAPPED = new Set<string>();
type Run = { report: any; stdout: string; stderr: string; code: number };
const RUNS = new WeakMap<object, Promise<Run>>();

/** The suite names above a task, outermost first (the json reporter's ancestorTitles). */
const ancestors = (task: any) => { const a: string[] = []; for (let t = task.suite; t && t !== task.file && t.type !== 'file'; t = t.suite) if (t.name) a.unshift(t.name); return a; };
/** The name vitest's -t matches: the suite names, then the test's, joined by a space (runner getTaskFullName). */
const fullName = (task: any) => [...ancestors(task), task.name].join(' ');

const runChild = async (file: string, names: string[]): Promise<Run> => {
  const dir = mkdtempSync(join(tmpdir(), 'vitest-child-')), out = join(dir, 'r.json');
  const args = [VITEST, 'run', file, '-t', `^(?:${names.map(esc).join('|')})$`, '--reporter=dot', '--reporter=json', `--outputFile.json=${out}`];
  let stdout = '', stderr = '', code = 0, report: any = null;
  try {
    ({ stdout, stderr } = await promisify(execFile)(process.execPath, args, { env: { ...process.env, MARC_TEST_CHILD: '1', NO_COLOR: '1', FORCE_COLOR: '0' }, maxBuffer: 1 << 28 }));
  } catch (e: any) { ({ stdout = '', stderr = '' } = e); code = typeof e.code === 'number' ? e.code : 1; }
  try { report = JSON.parse(readFileSync(out, 'utf8')); } catch { /* no report: the child failed before writing it */ } finally { rmSync(dir, { recursive: true, force: true }); }
  return { report, stdout, stderr, code };
};

function itChild(name: string, fn: () => unknown, timeout?: number): void {
  if (IN_CHILD) { it(name, async () => { await fn(); await yieldOnce(); }, timeout); return; }
  WRAPPED.add(name);
  it(name, async ({ task }) => {
    const owner: any = task.suite ?? task.file;
    let run = RUNS.get(owner), first = false;
    if (!run) {
      first = true;
      const group = (owner.tasks as any[]).filter(t => t.type === 'test' && t.mode === 'run' && WRAPPED.has(t.name));
      run = runChild(task.file.filepath, group.map(fullName));
      RUNS.set(owner, run);
    }
    const { report, stdout, stderr, code } = await run;
    if (first) console.log(stdout);
    const mine = (report?.testResults ?? []).flatMap((f: any) => f.assertionResults)
      .filter((r: any) => r.title === task.name && JSON.stringify(r.ancestorTitles) === JSON.stringify(ancestors(task)) && r.status !== 'skipped');
    if (mine.length !== 1 || mine[0].status !== 'passed') {
      throw new Error(`child test ${mine[0]?.status ?? 'not run'} (child exit ${code}, ${mine.length} result(s)): ${name}\n${(mine[0]?.failureMessages ?? []).join('\n')}\n${report ? '' : `${stdout}\n${stderr}`}`);
    }
  }, timeout);
}

/** `it.each` for string items: one itChild per item, named as vitest names it (%s is the item). */
const each = (items: readonly string[]) => (name: string, fn: (item: string) => unknown, timeout?: number): void => {
  if (IN_CHILD) { it.each(items)(name, async (x: string) => { await fn(x); await yieldOnce(); }, timeout); return; }
  for (const x of items) itChild(name.replace('%s', x), () => fn(x), timeout);
};
export const child = { it: Object.assign(itChild, { each }) };

/** The D-LIB8M-RPC form for a fixture step: `node --input-type=module -e code` (in cwd), awaited, so the worker waits on
 *  the child without blocking. Resolves to its stdout; rejects, with the child's stderr, when it exits non-zero. */
export const nodeChild = async (code: string, cwd?: string): Promise<string> =>
  (await promisify(execFile)(process.execPath, ['--input-type=module', '-e', code], { cwd, encoding: 'utf8', maxBuffer: 1 << 26 })).stdout;
/** lib2b fixture.mjs ownRowsTree(opts), run in an awaited child: the temp tree it made. */
export const ownRowsTreeInChild = async (opts: { src?: string } = {}): Promise<string> =>
  nodeChild(`const F = await import(${JSON.stringify(new URL('howto/fixtures/lib2b/fixture.mjs', import.meta.url).href)}); process.stdout.write(F.ownRowsTree(${JSON.stringify(opts)}));`);
