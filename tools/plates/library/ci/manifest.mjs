// LIB-4c (card LIB-4c Do 8b; D-LIB4c-1 (b), plan 3.5-3.6 L0-lib): tools/plates/library/MANIFEST.json pins, for every
// library row that has a plate entry in a batch golden file, each file its approved plate and pages are made from,
// with the file's sha256 and the hash of the approving plate entry. The set per row:
//   - closureOf(spec) and closureOf(How-to source) (data sources only; inputs-closure.mjs);
//   - the page builders: the esbuild import closure of build-page.mjs, plates-page.mjs, LIB-6's build-layers-page.mjs,
//     the modules the builders load by URL (render/closeups.mjs, render/region-fix.mjs, the batch's options module) and
//     the hand loader hands/pairs.mjs;
//   - the MANIFEST.json of each locked tree a builder imports from or reads from (vendor/ for the plates page, layers/
//     for the layers mirror);
//   - each non-locked file a builder reads at run time, from the builders' static input lists (checked with an fs-read
//     trace of a plates page build: golden.mjs reads pins.json and plates.json when loaded): the batch page JSON, the
//     batch file, the layersConfig, the files a layers spec's `files` map copies (the closure of every row of the
//     batch) and the hand loader's inputsFor(key).
// Files that do not exist at the sha are not listed. Entries change only in the commit that adds or replaces a pin.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from '../../lib/inputs.mjs';
import { latestEntries } from '../../golden.mjs';
import { LOCKED, closureOf } from '../inputs-closure.mjs';
import { LIBRARY_GOLDEN_DIR, batchGoldenOf, rows, sourceOf } from '../registry.mjs';

export const MANIFEST = 'tools/plates/library/MANIFEST.json';
const L = 'tools/plates/library/';
/** The page builders and the modules they load by URL; the batch's options module joins per row. */
export const BUILDERS = [`${L}build-page.mjs`, `${L}plates-page.mjs`, `${L}build-layers-page.mjs`, `${L}render/closeups.mjs`, `${L}render/region-fix.mjs`, `${L}hands/pairs.mjs`];
/** Files golden.mjs reads when it is loaded (every builder imports it). */
export const GOLDEN_MODULE_READS = ['tools/plates/pins.json', 'tools/plates/plates.json'];
const sha = b => createHash('sha256').update(b).digest('hex');
export const entryHash = e => sha(JSON.stringify(e));

/** The esbuild import closure of `entries` (repo-relative, node_modules left out). */
export async function importClosure(entries, root = ROOT) {
  const { build } = await import('esbuild');
  const r = await build({ entryPoints: entries, bundle: true, write: false, metafile: true, format: 'esm', platform: 'node', packages: 'external', logLevel: 'silent', absWorkingDir: root, outdir: 'l0-out' });
  return Object.keys(r.metafile.inputs).map(p => p.split('\\').join('/'));
}

/** The pinned library rows: [{ row, entry }] (the latest plate entry of the row in its batch golden file). */
export function pinnedRows(root = ROOT, all = rows(root)) {
  const out = [];
  for (const row of all.filter(r => r.batchFile)) {
    const file = join(root, batchGoldenOf(row.batchFile));
    if (!existsSync(file)) continue;
    const e = latestEntries(JSON.parse(readFileSync(file, 'utf8')).entries ?? []).get(row.id);
    if (e?.kind === 'plate') out.push({ row, entry: e });
  }
  return out;
}

/** The file set of one pinned row (repo-relative, existing, sorted). */
export async function filesOf(row, { root = ROOT, all = rows(root) } = {}) {
  const set = new Set(), add = p => { if (p && existsSync(join(root, p))) set.add(p); };
  const batch = all.filter(r => r.batchFile === row.batchFile), pages = row.pages ?? {};
  for (const p of closureOf([`tools/plates/${row.src}`], root)) add(p);
  for (const p of closureOf([sourceOf(row.id, root)], root)) add(p);
  let options = null;
  if (pages.layersConfig && existsSync(join(root, pages.layersConfig))) options = JSON.parse(readFileSync(join(root, pages.layersConfig), 'utf8')).optionsModule ?? null;
  const entries = [...BUILDERS, options].filter(p => p && existsSync(join(root, p)));
  const imports = await importClosure(entries, root);
  for (const p of imports) add(p);
  for (const t of LOCKED) if (imports.some(p => p.startsWith(t))) add(`${t}MANIFEST.json`);
  add('tools/plates/vendor/MANIFEST.json');   // build-page.mjs reads the vendored builder and mirrors vendor/
  if (existsSync(join(root, `${L}build-layers-page.mjs`))) add('tools/plates/layers/MANIFEST.json');   // makeMirror copies layers/
  for (const p of [...GOLDEN_MODULE_READS, pages.plates, pages.layersConfig, row.batchFile]) add(p);
  // layersSpecOf stages the closure of every row of the batch into the layers page's `files`
  for (const r of batch) for (const p of closureOf([`tools/plates/${r.src}`, sourceOf(r.id, root)], root)) add(p);
  if (existsSync(join(root, `${L}hands/pairs.mjs`))) {
    const pairs = await import(pathToFileURL(join(root, `${L}hands/pairs.mjs`)).href), key = pairs.HAND_OF_ID?.[row.id];
    if (key != null) for (const p of await pairs.inputsFor(key)) add(p);
  }
  return [...set].sort();
}

/** The manifest at `root`: { rows: { id: { entry, files: { path: sha256 } } } }, rows and files sorted. */
export async function manifestOf(root = ROOT, all = rows(root)) {
  const out = {};
  for (const { row, entry } of pinnedRows(root, all).sort((a, b) => (a.row.id < b.row.id ? -1 : 1))) {
    const files = await filesOf(row, { root, all });
    out[row.id] = { entry: entryHash(entry), files: Object.fromEntries(files.map(p => [p, sha(readFileSync(join(root, p)))])) };
  }
  return { rows: out };
}

export const manifestText = m => `${JSON.stringify(m, null, 1)}\n`;

/** Problems of the committed MANIFEST.json against the recomputed set (exact: missing, extra or changed). */
export async function manifestProblems(root = ROOT) {
  const want = await manifestOf(root), file = join(root, MANIFEST);
  if (!existsSync(file)) return [`${MANIFEST} is missing`];
  const got = JSON.parse(readFileSync(file, 'utf8')), bad = [];
  const ids = new Set([...Object.keys(want.rows), ...Object.keys(got.rows ?? {})]);
  for (const id of ids) {
    const w = want.rows[id], g = got.rows?.[id];
    if (!g) { bad.push(`${id}: pinned, but not in ${MANIFEST}`); continue; }
    if (!w) { bad.push(`${id}: in ${MANIFEST}, but no plate entry pins it`); continue; }
    if (g.entry !== w.entry) bad.push(`${id}: approving entry hash ${g.entry} != ${w.entry}`);
    for (const p of new Set([...Object.keys(w.files), ...Object.keys(g.files ?? {})])) {
      if (!(p in (g.files ?? {}))) bad.push(`${id}: ${p} is an input, not listed`);
      else if (!(p in w.files)) bad.push(`${id}: ${p} is listed, not an input`);
      else if (g.files[p] !== w.files[p]) bad.push(`${id}: ${p} sha256 ${w.files[p]} != listed ${g.files[p]}`);
    }
  }
  if (manifestText(got) !== readFileSync(file, 'utf8')) bad.push(`${MANIFEST} is not in its canonical form`);
  return bad;
}

/** Every library golden file name, so a test can say what it pinned. */
export const goldenFiles = (root = ROOT) => (existsSync(join(root, LIBRARY_GOLDEN_DIR)) ? readdirSync(join(root, LIBRARY_GOLDEN_DIR)).filter(n => n.endsWith('.json')).sort() : []);
