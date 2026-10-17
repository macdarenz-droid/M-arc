// LIB-2b (D-LIB2b-CLOSURE, card 10 E2): the files a data source's text depends on. closureOf(files) returns the given
// data sources (How-to sources, plate specs and their composers) plus the transitive closure of their imports, from
// esbuild's metafile (bundle, platform node, packages external, no write), repo-relative and sorted. Plugin and
// page-builder code keeps its static input lists; this helper is for data sources only.
// esbuild silently skips what it cannot follow, so every closure file is also scanned, and the helper throws, naming
// file and line, on a computed or template import(), require( or createRequire, a specifier that is neither relative nor
// node:, and, outside the MANIFEST-locked trees, a file read (readFileSync, new URL(…, import.meta.url)). When the
// closure enters a locked tree, that tree's MANIFEST.json joins the result (engine/sheet.mjs reads tokens.css and the
// Inter woff2, which the MANIFEST hash-locks).
import { buildSync, transformSync } from 'esbuild';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../lib/inputs.mjs';

/** Trees whose every file is hash-locked by their MANIFEST.json. */
export const LOCKED = ['tools/plates/layers/', 'tools/plates/vendor/'];
const lockOf = p => LOCKED.find(t => p.startsWith(t));

const IMPORT_CALL = /\bimport\s*\(/g;
const STRING_ARG = /^\s*(['"])(?:(?!\1)[^\\\n]|\\.)*\1\s*\)/;
/** The problems of one closure file's code (comments removed by esbuild, so prose never counts): [`file:line: why`].
 *  `externals`: the specifiers esbuild left external (bare and node: ones). */
export function scanProblems(rel, text, externals = []) {
  const code = transformSync(text, { loader: 'js', format: 'esm', legalComments: 'none' }).code;
  const bad = [], at = i => `${rel} (code line ${code.slice(0, i).split('\n').length})`;
  // esbuild prints a constant template literal as a plain string, so template-literal imports are found in the source
  for (const m of text.matchAll(/\bimport\s*\(\s*`/g)) bad.push(`${rel}:${text.slice(0, m.index).split('\n').length}: import() with an argument that is not one plain string literal`);
  for (const m of code.matchAll(IMPORT_CALL)) {
    if (!STRING_ARG.test(code.slice(m.index + m[0].length))) bad.push(`${at(m.index)}: import() with an argument that is not one plain string literal`);
  }
  for (const m of code.matchAll(/\brequire\s*\(|\bcreateRequire\b/g)) bad.push(`${at(m.index)}: ${m[0].replace(/\s*\($/, '')} is not followed by the closure`);
  for (const s of externals) if (!s.startsWith('node:')) bad.push(`${rel}: specifier ${s} is neither relative nor node:`);
  if (!lockOf(rel)) for (const m of code.matchAll(/\breadFileSync\b|\bnew URL\s*\([^)]*import\.meta\.url/g)) bad.push(`${at(m.index)}: reads a file outside the MANIFEST-locked trees (not an import, so no closure can list it)`);
  return bad;
}

/** The data closure of `files` (repo-relative), plus the MANIFEST.json of each locked tree it enters. Throws on an
 *  unresolved import (naming the importer) and on any scanProblems. Cached per process by root and files. */
const cache = new Map();
export function closureOf(files, root = ROOT) {
  const key = JSON.stringify([root, files]);
  if (!cache.has(key)) cache.set(key, closureOnce(files, root));
  return [...cache.get(key)];
}
function closureOnce(files, root) {
  if (!files.length) throw new Error('closure: no source files');
  for (const f of files) if (!existsSync(join(root, f))) throw new Error(`closure: ${f} does not exist`);
  let meta;
  try {
    meta = buildSync({ entryPoints: files, bundle: true, platform: 'node', packages: 'external', write: false, metafile: true, format: 'esm', logLevel: 'silent', absWorkingDir: root, outdir: 'closure-out' }).metafile;
  } catch (e) {
    const why = (e.errors ?? []).map(x => `${x.location?.file ?? '?'}:${x.location?.line ?? '?'}: ${x.text}`).join('\n') || e.message;
    throw new Error(`closure: unresolved import:\n${why}`);
  }
  const out = Object.keys(meta.inputs).map(p => p.split('\\').join('/')).sort();
  const ext = p => (meta.inputs[p].imports ?? []).filter(i => i.external).map(i => i.original ?? i.path);
  const bad = Object.keys(meta.inputs).flatMap(p => scanProblems(p.split('\\').join('/'), readFileSync(join(root, p), 'utf8'), ext(p)));
  if (bad.length) throw new Error(`closure: cannot follow every input:\n${bad.join('\n')}`);
  const manifests = [...new Set(out.map(lockOf).filter(Boolean))].map(t => `${t}MANIFEST.json`);
  return [...new Set([...out, ...manifests])].sort();
}
