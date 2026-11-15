// F-GEN-WALK-SPEED: the library walkers' shared steps (a tree's generate render(), its affected.mjs inputsMap(), feel.mjs
// renderAll()) run once per test run instead of once per test. Nothing here changes what a walker checks; it changes
// only where the data comes from.
// - The key is treeKey(root): sha256 over the root path and every file under it (path and content; a symlink by its
//   target), skipping only node_modules/ and .git/. Any changed byte anywhere in the tree is a new key, so a changed
//   spec, size or engine file can never be served stale.
// - memo() keeps the result in this run's cache folder (CACHE_ENV, made by tests/walk-cache-setup.ts under the OS temp
//   folder and removed when the run ends; nothing outlives one run). One process computes a key; the others wait on its
//   lock file. Every caller, the computing one included, gets a fresh decode of the stored text, so no test shares an
//   object with another. A result is stored only when the tree's key is the same after the compute as before it.
// - memoLocal() keeps a result that cannot be stored as text (it holds a module instance) in this worker only, under
//   the same key. Callers must not change it.
// - Outside a vitest run (no CACHE_ENV) both compute directly.
import { createHash } from 'node:crypto';
import { closeSync, existsSync, openSync, readdirSync, readFileSync, readlinkSync, renameSync, rmSync, writeFileSync, writeSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const CACHE_ENV = 'MARC_WALK_CACHE';
export const CACHE_PREFIX = 'marc-walk-cache-';
const SKIP = new Set(['node_modules', '.git']);
const sha = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');

/** sha256 of the root path and every file under it (sorted, skipping node_modules/ and .git/ at any depth). */
export function treeKey(root: string): string {
  const base = resolve(root), h = createHash('sha256');
  h.update(`root\0${base}\0`);
  const walk = (dir: string, rel: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))) {
      if (SKIP.has(e.name)) continue;
      const p = join(dir, e.name), r = rel ? `${rel}/${e.name}` : e.name;
      try {
        if (e.isDirectory()) { h.update(`d\0${r}\0`); walk(p, r); }
        else if (e.isSymbolicLink()) h.update(`l\0${r}\0${readlinkSync(p)}\0`);
        else if (e.isFile()) h.update(`f\0${r}\0${sha(readFileSync(p))}\0`);
        else h.update(`o\0${r}\0`);
      } catch (err: any) { h.update(`x\0${r}\0${err?.code ?? 'error'}\0`); }   // removed while walking: a new key, never a hit
    }
  };
  walk(base, '');
  return h.digest('hex');
}

/** True when `dir` is a run cache folder: directly under the OS temp folder, named CACHE_PREFIX + mkdtemp's suffix. */
export function isRunDir(dir: string): boolean {
  const d = resolve(dir), t = resolve(tmpdir());
  return d.startsWith(t + sep) && resolve(d, '..') === t && /^marc-walk-cache-[A-Za-z0-9]{6}$/.test(basename(d)) && existsSync(d);
}

/** This run's cache folder, or null outside a vitest run. A folder that is not a run folder is refused. */
export function cacheDir(): string | null {
  const d = process.env[CACHE_ENV];
  if (!d) return null;
  if (!isRunDir(d)) throw new Error(`walk-cache: ${CACHE_ENV}=${d} is not a run cache folder (${CACHE_PREFIX}* directly under ${tmpdir()})`);
  return d;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const alive = (pid: number) => { try { process.kill(pid, 0); return true; } catch (e: any) { return e?.code === 'EPERM'; } };

/** The result of `compute()` for `root`'s current content, computed once per run (see the header). */
export async function memo<T>(name: string, root: string, compute: () => Promise<T>, enc: (v: T) => string, dec: (s: string) => T): Promise<T> {
  const dir = cacheDir();
  if (!dir) return compute();
  const key = treeKey(root), file = join(dir, `${name}-${key}.json`), lock = `${file}.lock`;
  for (;;) {
    if (existsSync(file)) return dec(readFileSync(file, 'utf8'));
    let fd: number;
    try { fd = openSync(lock, 'wx'); } catch (e: any) {
      if (e?.code !== 'EEXIST') throw e;
      let pid = 0; try { pid = +readFileSync(lock, 'utf8'); } catch { /* the holder just finished */ }
      if (pid && !alive(pid)) rmSync(lock, { force: true });   // its holder died: take over
      else await sleep(250);
      continue;
    }
    try {
      writeSync(fd, String(process.pid)); closeSync(fd);
      const text = enc(await compute());
      if (treeKey(root) === key) { const tmp = `${file}.${process.pid}.tmp`; writeFileSync(tmp, text); renameSync(tmp, file); }
      return dec(text);
    } finally { rmSync(lock, { force: true }); }
  }
}

const LOCAL = new Map<string, Promise<any>>();
/** The result of `compute()` for `root`'s current content, once per worker (a value that holds a module instance). */
export function memoLocal<T>(name: string, root: string, compute: () => Promise<T>): Promise<T> {
  if (!cacheDir()) return compute();
  const k = `${name}\0${treeKey(root)}`;
  if (!LOCAL.has(k)) LOCAL.set(k, compute().catch(e => { LOCAL.delete(k); throw e; }));
  return LOCAL.get(k)!;
}

/** F-VITEST-RPC-2: `code` run by node in the tree at `root` (its own modules), awaited, so the worker never blocks on the
 *  compute; resolves to the text after its last `\n@@` mark (the result line), and rejects with its stderr. This file is
 *  also loaded by globalSetup, so it cannot import tests/child-test.ts (which imports vitest). */
const inChild = async (code: string, root: string): Promise<string> => {
  const { stdout } = await promisify(execFile)(process.execPath, ['--input-type=module', '-e', code], { cwd: resolve(root), encoding: 'utf8', maxBuffer: 1 << 28 });
  const i = stdout.lastIndexOf('\n@@');
  if (i < 0) throw new Error(`walk-cache: the child printed no result:\n${stdout.slice(-2000)}`);
  return stdout.slice(i + 3);
};
const url = (root: string, p: string) => pathToFileURL(join(resolve(root), p)).href;
type Out = Map<string, { text: string; writers: string[]; hash: string }>;
const encMap = (m: Map<string, any>) => JSON.stringify([...m]);
const decMap = (s: string) => new Map(JSON.parse(s));

/** tools/plates/generate.mjs render() of the tree at `root`. */
export const renderOf = (root: string): Promise<Out> =>
  memo('render', root, async () => decMap(await inChild("const { render } = await import('./tools/plates/generate.mjs'); process.stdout.write('\\n@@' + JSON.stringify([...(await render())]));", root)) as Out, encMap, decMap as (s: string) => Out);

/** tools/plates/library/ci/affected.mjs inputsMap(root) of the tree at `root`. */
export const inputsMapOf = (root: string): Promise<{ inputs: Map<string, string[]>; writers: Map<string, string[]>; proven: boolean; why: string[] }> =>
  memo('inputsMap', root, async () => { const o = JSON.parse(await inChild(`const { inputsMap } = await import('./tools/plates/library/ci/affected.mjs'); const m = await inputsMap(${JSON.stringify(resolve(root))}); process.stdout.write('\\n@@' + JSON.stringify({ ...m, inputs: [...m.inputs], writers: [...m.writers] }));`, root)); return { ...o, inputs: new Map(o.inputs), writers: new Map(o.writers) }; },
    m => JSON.stringify({ ...m, inputs: [...m.inputs], writers: [...m.writers] }),
    s => { const o = JSON.parse(s); return { ...o, inputs: new Map(o.inputs), writers: new Map(o.writers) }; });

/** tools/plates/gen/feel.mjs renderAll() of the tree at `root` (holds the engine module instance `fm`: per worker). */
export const feelAllOf = (root: string): Promise<any> =>
  memoLocal('feel.renderAll', root, async () => (await import(/* @vite-ignore */ url(root, 'tools/plates/gen/feel.mjs'))).renderAll());
