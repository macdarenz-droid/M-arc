// LIB-2b (D-LIB2b-LAYOUT): a batch's layers page spec for LIB-6's buildLayersPage, from data. It imports no LIB-6 code.
// Library specs and How-to sources keep in-repo relative imports (LIB-8's convention) and every Node consumer imports
// them in place; LIB-6's builder instead runs golden B's own scripts in a mirror of tools/plates/layers/, so each row's
// whole data closure (closureOf) is staged into `stageDir` with its specifiers rewritten for the mirror:
//   - a target under tools/plates/layers/** maps to its mirror path (the mirror's one engine instance is used);
//   - the row's spec (row.src) maps to exercises/<card>.mjs and its How-to source to exercises/<card>.howto.mjs;
//   - every other closure file is copied to library/<its repo-relative path> (vendor-engine files included);
//   - node: builtins stay as they are.
// A specifier that would leave the mirror throws, naming the file. The card id is the row's chromeId with underscores
// (plates-page.mjs cardIdOf); closeups are keyed by lib id in the config and translated to LIB-6's howto ids.
// LIB-4c's L1, LIB-4b's fixture.mjs, the LIB-2b fixture and LIB-9 build layers pages only through this.
import { buildSync } from 'esbuild';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from '../lib/inputs.mjs';
import { closureOf } from './inputs-closure.mjs';
import { cardIdOf } from './plates-page.mjs';
import { rows, sourceOf } from './registry.mjs';

const LAYERS = 'tools/plates/layers/';
/** LIB-6's howto id of a card id (build-layers-page.mjs howtoIdOf: only golden B's lateral raise differs). */
export const howtoIdOf = card => (card === 'lateral_raise' ? 'dumbbell_lateral_raise' : card);

/** The imports of each closure file: { file: [{ original, path }] } (repo-relative resolved paths), from esbuild. */
export function importsOf(files, root = ROOT) {
  const meta = buildSync({ entryPoints: files, bundle: true, platform: 'node', packages: 'external', write: false, metafile: true, format: 'esm', logLevel: 'silent', absWorkingDir: root, outdir: 'stage-out' }).metafile;
  return Object.fromEntries(Object.entries(meta.inputs).map(([f, v]) => [f.split('\\').join('/'), (v.imports ?? []).map(i => ({ original: i.original ?? i.path, path: i.path.split('\\').join('/'), external: !!i.external }))]));
}

/** `text` with each import specifier `from` -> `to`, only inside import/export statements and import() calls. */
export function rewriteSpecifiers(text, map, file) {
  let out = text;
  for (const [from, to] of Object.entries(map)) {
    const esc = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(\\bfrom\\s*|\\bimport\\s*\\(\\s*|\\bimport\\s+)(['"])${esc}\\2`, 'g');
    if (!re.test(out)) throw new Error(`layers-spec: ${file}: import of ${from} not found to rewrite`);
    out = out.replace(re, (_, pre, q) => `${pre}${q}${to}${q}`);
  }
  return out;
}

/** LIB-6's buildLayersPage spec for one batch file. `stageDir`: an empty temp folder the staged copies are written to. */
export function layersSpecOf(batchFile, { stageDir, root = ROOT, all = rows(root) } = {}) {
  if (!stageDir) throw new Error('layers-spec: no stageDir');
  const batchRows = all.filter(r => r.batchFile === batchFile);
  if (!batchRows.length) throw new Error(`layers-spec: ${batchFile} has no rows`);
  const pages = batchRows[0].pages;
  if (!pages?.layersConfig) throw new Error(`layers-spec: ${batchFile}: no pages.layersConfig`);
  const cfg = JSON.parse(readFileSync(join(root, pages.layersConfig), 'utf8'));
  const byId = new Map(batchRows.map(r => [r.id, r]));
  const rowOf = id => { const r = byId.get(id); if (!r) throw new Error(`layers-spec: ${pages.layersConfig}: ${id} is not a row of ${batchFile}`); return r; };
  const groups = (cfg.groups ?? []).map(g => ({ id: g.id, title: g.title, ids: g.ids.map(id => cardIdOf(rowOf(id))) }));
  const cards = groups.flatMap(g => g.ids);
  if (!cards.length) throw new Error(`layers-spec: ${pages.layersConfig} names no ids`);
  const closeups = {};
  for (const [id, c] of Object.entries(cfg.closeups ?? {})) {
    if (c.regionFix === false) throw new Error(`layers-spec: ${pages.layersConfig}: ${id}: regionFix:false is never set by a batch`);
    if ('pair' in c && (typeof c.pair !== 'string' || !/^[a-z0-9-]+$/.test(c.pair))) throw new Error(`layers-spec: ${pages.layersConfig}: ${id}: pair ${JSON.stringify(c.pair)} is not a pair key`);   // LIB-7b (D-LIB7b-SCOPE (b))
    closeups[howtoIdOf(cardIdOf(rowOf(id)))] = c;
  }
  if (cfg.regionFix === false) throw new Error(`layers-spec: ${pages.layersConfig}: regionFix:false is never set by a batch`);

  // mirror path of every staged repo file: the rows' specs and How-to sources, layers files, everything else under library/
  const ids = groups.flatMap(g => g.ids.map(card => batchRows.find(r => cardIdOf(r) === card).id));
  const mirrorOf = new Map();
  for (const id of ids) {
    const r = byId.get(id), card = cardIdOf(r);
    mirrorOf.set(`tools/plates/${r.src}`, `exercises/${card}.mjs`);
    mirrorOf.set(sourceOf(id, root), `exercises/${card}.howto.mjs`);
  }
  const roots = [...mirrorOf.keys()], closure = closureOf(roots, root).filter(p => !p.endsWith('MANIFEST.json')), imports = importsOf(roots, root);
  for (const p of closure) if (!mirrorOf.has(p)) mirrorOf.set(p, p.startsWith(LAYERS) ? p.slice(LAYERS.length) : `library/${p}`);
  const files = {};
  for (const p of closure) {
    const m = mirrorOf.get(p);
    if (p.startsWith(LAYERS) && m === p.slice(LAYERS.length)) continue;   // already in the mirror, unchanged
    const map = {};
    for (const i of imports[p] ?? []) {
      if (i.original.startsWith('node:')) continue;
      if (i.external) throw new Error(`layers-spec: ${p}: import ${i.original} would leave the mirror`);
      const to = mirrorOf.get(i.path);
      if (!to) throw new Error(`layers-spec: ${p}: import ${i.original} (${i.path}) is not in the staged closure`);
      let rel = posix.relative(posix.dirname(m), to);
      if (!rel.startsWith('.')) rel = `./${rel}`;
      if (rel.startsWith('../'.repeat(posix.dirname(m).split('/').length + 1))) throw new Error(`layers-spec: ${p}: import ${i.original} would leave the mirror`);
      map[i.original] = rel;
    }
    const text = rewriteSpecifiers(readFileSync(join(root, p), 'utf8'), map, p);
    if (text.includes('file://')) throw new Error(`layers-spec: ${p}: a staged file may not hold a file:// URL`);
    const abs = join(stageDir, m);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, text);
    files[m] = abs;
  }
  return {
    groups, closeups, files,
    ...(cfg.optionsModule ? { optionsUrl: pathToFileURL(join(root, cfg.optionsModule)).href } : {}),
    ...('jump' in cfg ? { jump: cfg.jump } : {}),
  };
}
