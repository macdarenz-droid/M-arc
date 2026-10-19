// LIB-7c 7c-A10 (D-LIB7FIX-PERKEY): no pinned input moves. Compares this tree with the base head LIB-7c last merged,
// built as a scratch git worktree in os.tmpdir() and removed in `finally`:
//   node tests/library/fixtures/lib7c/a10.mjs <base ref>
// (1) for each of the 8 LIB-7 keys, inputsFor(key) and the sha256 of every listed file are equal on both trees;
// (2) none of the six ids is a pinned row here (ci/manifest.mjs pinnedRows);
// (3) the esbuild import closure of hands/pairs.mjs (ci/manifest.mjs importClosure) is equal and holds no LIB-7c file;
// (4) `git diff <base> --stat` touches none of pairs.mjs, panel.mjs, zoom.mjs, words/chrome.json;
// (5) where library pins exist, MANIFEST.json is unchanged. Exit 1 on any problem.
// `--mutate-chrome` edits words/chrome.json in the scratch tree only (the 7c-A10 mutation): (1) must turn red.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = join(new URL('.', import.meta.url).pathname, '../../../..'), base = process.argv[2], mutate = process.argv.includes('--mutate-chrome');
if (!base) throw new Error('usage: a10.mjs <base ref> [--mutate-chrome]');
const SIX = ['assisted_pull_up', 'chin_up', 'close_grip_pulldown', 'hanging_knee_raise', 'inverted_row', 'underhand_lat_pulldown'];
const H = 'tools/plates/library/hands/', SHARED = [`${H}pairs.mjs`, `${H}panel.mjs`, `${H}zoom.mjs`, `${H}words/chrome.json`];
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' });
// the per-tree facts, computed by a child node in that tree (each tree loads its own pairs.mjs)
const PROBE = `
const root = process.argv[1], { createHash } = await import('node:crypto'), { readFileSync } = await import('node:fs'), { join } = await import('node:path');
const P = await import(join(root, '${H}pairs.mjs')), M = await import(join(root, 'tools/plates/library/ci/manifest.mjs'));
const keys = {};
for (const [id, e] of P.INDEX.drawn) if (e.mod.OWNER === 'LIB-7') { const k = P.HAND_OF_ID['lib_' + id]; keys[k] ??= Object.fromEntries(P.inputsFor(k).map(f => [f, createHash('sha256').update(readFileSync(join(root, f))).digest('hex')])); }
const closure = (await M.importClosure(['${H}pairs.mjs'], root)).sort();
const pinned = M.pinnedRows(root).map(r => r.row.id);
console.log(JSON.stringify({ keys, closure, pinned }));`;
const probe = root => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', PROBE, root], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 26 }).trim().split('\n').pop());

const dir = mkdtempSync(join(tmpdir(), 'lib7c-a10-')), wt = join(dir, 'base'), bad = [];
try {
  git('worktree', 'add', '--detach', wt, base);
  symlinkSync(join(ROOT, 'node_modules'), join(wt, 'node_modules'));
  if (mutate) writeFileSync(join(wt, `${H}words/chrome.json`), readFileSync(join(wt, `${H}words/chrome.json`), 'utf8').replace('Hand pages', 'Hand pagez'));
  const here = probe(ROOT), there = probe(wt);
  const ks = Object.keys(there.keys).sort();
  if (ks.length !== 8) bad.push(`(1) base has ${ks.length} LIB-7 keys, expected 8`);
  if (JSON.stringify(Object.keys(here.keys).sort()) !== JSON.stringify(ks)) bad.push('(1) the LIB-7 keys differ');
  for (const k of ks) if (JSON.stringify(here.keys[k]) !== JSON.stringify(there.keys[k])) bad.push(`(1) ${k}: inputsFor or a file's sha256 differs`);
  for (const id of SIX) if (here.pinned.includes(`lib_${id}`)) bad.push(`(2) lib_${id} is a pinned row`);
  if (JSON.stringify(here.closure) !== JSON.stringify(there.closure)) bad.push('(3) the esbuild closure of pairs.mjs differs');
  for (const f of here.closure) if (/hand-(bar|v-handle)\.mjs$|lib7c-|words\/(bar|v-handle)-/.test(f)) bad.push(`(3) the closure holds ${f}`);
  const stat = git('diff', base, '--name-only', '--', ...SHARED).trim();
  if (stat) bad.push(`(4) shared engine files changed: ${stat.split('\n').join(', ')}`);
  const man = 'tools/plates/library/MANIFEST.json';
  if (existsSync(join(ROOT, man)) && git('diff', base, '--name-only', '--', man).trim()) bad.push('(5) MANIFEST.json changed');
  const digest = createHash('sha256').update(JSON.stringify(here.keys)).digest('hex');
  console.log(`7c-A10 vs ${base}: 8 LIB-7 keys, inputs digest ${digest}; pinned rows ${here.pinned.length}, none of the six; pairs.mjs closure ${here.closure.length} files, equal`);
} finally {
  try { git('worktree', 'remove', '--force', wt); } catch { /* removed below */ }
  rmSync(dir, { recursive: true, force: true });
}
console.log(bad.length ? bad.join('\n') : '7c-A10: PASS');
process.exitCode = bad.length ? 1 : 0;
