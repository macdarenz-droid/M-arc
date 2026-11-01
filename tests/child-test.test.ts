// F-VITEST-RPC (review 6553479647): child.it passes in the parent only when its child ran the test, the test passed and
// the child exited 0. Each fixture under tests/fixtures/child-test runs as its own vitest project (an awaited child),
// and this file reads the parent's JSON report.
import { execFile } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const VITEST = new URL('../node_modules/vitest/vitest.mjs', import.meta.url).pathname;
const CONFIG = new URL('./fixtures/child-test/vitest.config.ts', import.meta.url).pathname;

/** The parent run of one fixture: its exit code, and the status and message of its one test. */
const parentRun = async (fixture: string) => {
  const dir = mkdtempSync(join(tmpdir(), 'child-test-')), out = join(dir, 'r.json');
  const env: NodeJS.ProcessEnv = { ...process.env, MARC_TEST_CHILD_CONFIG: CONFIG };
  delete env.MARC_TEST_CHILD;
  let code = 0;
  try {
    await promisify(execFile)(process.execPath, [VITEST, 'run', '--config', CONFIG, `tests/fixtures/child-test/${fixture}.fx.ts`, '--reporter=json', `--outputFile.json=${out}`], { env, maxBuffer: 1 << 26 });
  } catch (e: any) { code = typeof e.code === 'number' ? e.code : 1; }
  try {
    const r = JSON.parse(readFileSync(out, 'utf8')), results = r.testResults.flatMap((f: any) => f.assertionResults);
    return { code, statuses: results.map((x: any) => x.status), message: results.map((x: any) => x.failureMessages.join('\n')).join('\n') };
  } finally { rmSync(dir, { recursive: true, force: true }); }
};

describe('F-VITEST-RPC child.it: the parent reads the child exit code and the test result', { timeout: 120_000 }, () => {
  it('control: a clean test passes in the parent', async () => {
    expect(await parentRun('clean')).toEqual({ code: 0, statuses: ['passed'], message: '' });
  });
  it('a test that fails in the child fails in the parent, with the child\'s assertion message', async () => {
    const r = await parentRun('failing');
    expect([r.code, r.statuses]).toEqual([1, ['failed']]);
    expect(r.message).toMatch(/child test failed \(child exit 1, 1 result\(s\)\): passes/);
    expect(r.message).toMatch(/expected 1 to be 2/);
  });
  it('mutation: an afterAll that throws in the child turns the parent red, though the test itself passed there', async () => {
    const r = await parentRun('afterall');
    expect([r.code, r.statuses]).toEqual([1, ['failed']]);
    expect(r.message).toMatch(/child test passed \(child exit 1, 1 result\(s\)\): passes/);
    expect(r.message).toMatch(/afterAll threw in the child/);
  });
  it('mutation: an unhandled rejection in the child turns the parent red, though the test itself passed there', async () => {
    const r = await parentRun('rejection');
    expect([r.code, r.statuses]).toEqual([1, ['failed']]);
    expect(r.message).toMatch(/child test passed \(child exit 1, 1 result\(s\)\): passes/);
    expect(r.message).toMatch(/unhandled rejection in the child/);
  });
});
