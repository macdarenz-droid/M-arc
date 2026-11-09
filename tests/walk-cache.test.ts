// F-GEN-WALK-SPEED: guards for tests/walk-cache.ts and its globalSetup. The cache lives only in this run's temp folder,
// its key covers every byte of the tree, each caller gets its own copy, and one process computes a key while the
// others wait.
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import setup from './walk-cache-setup';
import { CACHE_ENV, cacheDir, isRunDir, memo, memoLocal, treeKey } from './walk-cache';

const tmps: string[] = [];
afterAll(() => { for (const d of tmps) rmSync(d, { recursive: true, force: true }); });
const tree = (files: Record<string, string>) => {
  const d = mkdtempSync(join(tmpdir(), 'walk-cache-tree-')); tmps.push(d);
  for (const [p, t] of Object.entries(files)) { mkdirSync(join(d, p, '..'), { recursive: true }); writeFileSync(join(d, p), t); }
  return d;
};
const withEnv = <T>(env: Record<string, string | undefined>, fn: () => T): T => {
  const old = Object.fromEntries(Object.keys(env).map(k => [k, process.env[k]]));
  for (const [k, v] of Object.entries(env)) if (v === undefined) delete process.env[k]; else process.env[k] = v;
  try { return fn(); } finally { for (const [k, v] of Object.entries(old)) if (v === undefined) delete process.env[k]; else process.env[k] = v; }
};
const SPEC = 'tools/plates/library/exercises/zz_walk.mjs';
/* eslint-disable @typescript-eslint/no-explicit-any */
const json = { enc: (v: any) => JSON.stringify(v), dec: (s: string): any => JSON.parse(s) };

describe('F-GEN-WALK-SPEED: the cache lives only in this run\'s temp folder', () => {
  it('this run has a cache folder: mkdtemp-named, directly under the OS temp folder', () => {
    const d = process.env[CACHE_ENV]!;
    expect(isRunDir(d), d).toBe(true);
    expect(cacheDir()).toBe(d);
  });
  it('a folder outside the OS temp folder, or not a run folder, is refused', () => {
    const repo = resolve('node_modules/.cache/marc-walk-cache-abc123'), named = mkdtempSync(join(tmpdir(), 'other-')); tmps.push(named);
    for (const d of [repo, named, join(tmpdir(), 'marc-walk-cache-missing'), join(named, 'marc-walk-cache-abc123')]) {
      expect(isRunDir(d), d).toBe(false);
      expect(() => withEnv({ [CACHE_ENV]: d }, () => cacheDir()), d).toThrow(/is not a run cache folder/);
    }
  });
  it('globalSetup makes a new folder per run and removes it at the end; a child vitest of the run reuses its parent\'s', () => {
    const runs = [0, 1].map(() => withEnv({ [CACHE_ENV]: process.env[CACHE_ENV], MARC_TEST_CHILD: undefined }, () => { const end = setup(); return { dir: process.env[CACHE_ENV]!, end }; }));
    expect(runs[0]!.dir).not.toBe(runs[1]!.dir);
    for (const r of runs) { expect(r.dir).not.toBe(process.env[CACHE_ENV]); expect(isRunDir(r.dir), r.dir).toBe(true); r.end(); expect(existsSync(r.dir), r.dir).toBe(false); }
    const parent = process.env[CACHE_ENV]!;
    withEnv({ MARC_TEST_CHILD: '1' }, () => { const end = setup(); expect(process.env[CACHE_ENV]).toBe(parent); end(); });
    expect(existsSync(parent)).toBe(true);
    // an inherited folder that is not a run folder is never reused, even by a child
    withEnv({ MARC_TEST_CHILD: '1', [CACHE_ENV]: resolve('node_modules/.cache/x') }, () => { const end = setup(); const d = process.env[CACHE_ENV]!; expect(isRunDir(d)).toBe(true); end(); expect(existsSync(d)).toBe(false); });
  });
});

describe('F-GEN-WALK-SPEED: the key covers every byte of the tree', () => {
  it('a changed spec is computed again, never served stale; an unchanged tree is served from the cache', async () => {
    const t = tree({ [SPEC]: 'export const A = 1;\n', 'tools/plates/layers/engine/sizes.mjs': 'export const S = 1;\n' });
    let n = 0;
    const get = () => memo('t-spec', t, async () => { n++; return { spec: (await import('node:fs')).readFileSync(join(t, SPEC), 'utf8') }; }, json.enc, json.dec);
    expect(await get()).toEqual({ spec: 'export const A = 1;\n' });
    expect(await get()).toEqual({ spec: 'export const A = 1;\n' });
    expect(n).toBe(1);
    writeFileSync(join(t, SPEC), 'export const A = 2;\n');   // same size, one byte
    expect(await get()).toEqual({ spec: 'export const A = 2;\n' });
    expect(n).toBe(2);
  });
  it('treeKey changes with any file\'s path or content and with the root path; node_modules/ and .git/ are skipped', () => {
    const files = { [SPEC]: 'a', 'tools/plates/layers/engine/sizes.mjs': 'b', 'docs/research/howto/x.json': 'c' };
    const a = tree(files), b = tree(files), k = treeKey(a);
    expect(treeKey(a)).toBe(k);
    expect(treeKey(b)).not.toBe(k);   // the root path is part of the key
    for (const [p, edit] of [[SPEC, 'z'], ['tools/plates/layers/engine/sizes.mjs', 'z'], ['docs/research/howto/x.json', 'z'], ['new.txt', '']] as const) {
      const t = tree(files), k0 = treeKey(t); writeFileSync(join(t, p), edit); expect(treeKey(t), p).not.toBe(k0);
    }
    const t = tree(files), k0 = treeKey(t);
    mkdirSync(join(t, 'node_modules/p'), { recursive: true }); writeFileSync(join(t, 'node_modules/p/i.js'), 'x');
    mkdirSync(join(t, '.git')); writeFileSync(join(t, '.git/HEAD'), 'x');
    expect(treeKey(t)).toBe(k0);
  });
  it('a result is not stored when the tree changed during the compute', async () => {
    const t = tree({ [SPEC]: 'a' });
    let n = 0;
    await memo('t-race', t, async () => { n++; writeFileSync(join(t, SPEC), 'b'); return 1; }, json.enc, json.dec);
    writeFileSync(join(t, SPEC), 'a');
    await memo('t-race', t, async () => { n++; return 1; }, json.enc, json.dec);
    expect(n).toBe(2);
  });
});

describe('F-GEN-WALK-SPEED: each caller gets its own copy; one process computes a key', () => {
  it('two calls for one key return equal values that share no object', async () => {
    const t = tree({ [SPEC]: 'a' });
    const get = () => memo('t-copy', t, async () => ({ rows: [{ id: 'lib_a', text: 'x' }] }), json.enc, json.dec);
    const [a, b] = [await get(), await get()];
    expect(a).toEqual(b);
    expect(a).not.toBe(b);
    expect(a.rows[0]).not.toBe(b.rows[0]);
    a.rows[0]!.text = 'changed';
    expect((await get()).rows[0]!.text).toBe('x');
  });
  it('concurrent callers wait for the one computing; a lock left by a dead process is taken over', async () => {
    const t = tree({ [SPEC]: 'a' });
    let n = 0;
    const slow = () => memo('t-lock', t, async () => { n++; await new Promise(r => setTimeout(r, 300)); return n; }, json.enc, json.dec);
    expect(await Promise.all([slow(), slow(), slow()])).toEqual([1, 1, 1]);
    const t2 = tree({ [SPEC]: 'b' });
    writeFileSync(join(cacheDir()!, `t-dead-${treeKey(t2)}.json.lock`), '2147483646');
    expect(await memo('t-dead', t2, async () => 7, json.enc, json.dec)).toBe(7);
  });
  it('memoLocal computes once per key in this worker and again for a changed tree', async () => {
    const t = tree({ [SPEC]: 'a' });
    let n = 0;
    const get = () => memoLocal('t-local', t, async () => ++n);
    expect([await get(), await get()]).toEqual([1, 1]);
    writeFileSync(join(t, SPEC), 'b');
    expect(await get()).toBe(2);
  });
});
