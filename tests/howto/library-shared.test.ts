// LIB-5: the shared layer modules (D-LIB5-*; docs/howto/library/LIB-5-DESIGN.md). This block: check-bundle.mjs, the
// S4-P bundle half (D-LIB5-BUNDLE), on temp folders written at run time from the copied card.
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const SCRIPT = new URL('../../tools/plates/library/shared/check-bundle.mjs', import.meta.url).pathname;
/* eslint-disable @typescript-eslint/no-explicit-any */
let B: any;
const temps: string[] = [];
beforeAll(async () => { B = await import(/* @vite-ignore */ url('tools/plates/library/shared/check-bundle.mjs')); });
afterAll(() => { for (const t of temps) rmSync(t, { recursive: true, force: true }); });

/** A built-like folder: index.html, sw.js and an assets/ HowToSheet chunk, plus `extra` file -> text. */
function folder({ chunk = true, extra = {} as Record<string, string> } = {}) {
  const d = mkdtempSync(join(tmpdir(), 'lib5-bundle-'));
  temps.push(d);
  mkdirSync(join(d, 'assets'));
  writeFileSync(join(d, 'index.html'), '<!doctype html><title>M/ARC</title>');
  writeFileSync(join(d, 'sw.js'), 'self.addEventListener("fetch", () => {});');
  if (chunk) writeFileSync(join(d, 'assets', 'HowToSheet-AbCd1234.js'), 'export const x = "Wrist pain";');
  for (const [p, t] of Object.entries(extra)) { mkdirSync(join(d, p, '..'), { recursive: true }); writeFileSync(join(d, p), t); }
  return d;
}
const run = (dir: string) => spawnSync(process.execPath, [SCRIPT, dir], { encoding: 'utf8' });

describe('LIB-5 S4-P: check-bundle.mjs (D-LIB5-BUNDLE)', () => {
  it('reads the three whole box values from the copied card', () => {
    const v = B.boxValues();
    expect(Object.keys(v)).toEqual(['name', 'now', 'doctor']);
    for (const t of Object.values(v)) expect(typeof t === 'string' && (t as string).length > 0).toBe(true);
  });
  it('a clean folder passes (exit 0)', () => {
    const r = run(folder());
    expect([r.status, r.stderr]).toEqual([0, '']);
  });
  for (const f of ['name', 'now', 'doctor']) {
    it(`mutation: box.${f}.text planted in a shipped file -> exit 1, naming that field`, () => {
      const r = run(folder({ extra: { 'assets/index-Zz9.js': `const a = ${JSON.stringify(B.boxValues()[f])};` } }));
      expect(r.status).toBe(1);
      expect(r.stderr).toContain(`assets/index-Zz9.js: holds box.${f}.text`);
      expect(r.stderr.match(/holds box\./g)).toHaveLength(1);
    });
  }
  it('mutation: no HowToSheet chunk -> exit 1', () => {
    const r = run(folder({ chunk: false }));
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('no assets/HowToSheet-*.js chunk');
  });
  it('a value in any file under the folder counts (index.html, sw.js, nested)', () => {
    const v = B.boxValues();
    expect(B.bundleProblems(folder({ extra: { 'index.html': v.doctor, 'nested/deep/m.json': v.now } }), v).sort())
      .toEqual(['index.html: holds box.doctor.text', 'nested/deep/m.json: holds box.now.text']);
  });
});
