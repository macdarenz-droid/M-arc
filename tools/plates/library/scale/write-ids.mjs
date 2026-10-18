// LIB-4a (D-LIB4-FIXTURE, Do 9): LIB-2's syntheticRoot copy made whole for the checks at scale. syntheticRoot rewrites
// only ids.ts and loaders.ts; this writes every tools/plates/gen/ids.mjs output into the copy (ids.ts, ids-node.mjs,
// lib-id.ts, loaders.ts, coverage.ts), so the harness control (which reads ids-node.mjs) sees the same shipped set as
// the app. Library hands ship as shared handpair-<key> chunks, never hand-<chromeId> (LIB-2 design 12; only the 8 have
// hand- chunks), so the clones' hand files become one pair per clone through the repo's own handpairs plugin
// (D-LIB4a-1). The copy's tests/howto/budgets.json "How-to total" and loaders perId are re-set at n by LIB-2's rule
// (L2-A23, budgets/total.mjs). Measurement only: it writes into the temporary copy, never into the real tree.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, cpSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { syntheticRoot } from './synthetic.mjs';
import { totalCeiling, perIdCeiling } from '../budgets/total.mjs';

const G = 'src/howto/generated';
const PAIRS = 'tools/plates/library/hands/pairs.mjs';

/** The budgets.json text re-set at n shipped ids (L2-A23): the How-to total and every perId entry, from their measured. */
export function budgetsAt(json, n) {
  const b = JSON.parse(json);
  for (const t of b.totals ?? []) if (t.chunk === 'How-to total') Object.assign(t, { rawMax: totalCeiling(t.measuredRaw, n), gzMax: totalCeiling(t.measuredGz, n) });
  for (const p of b.perId ?? []) Object.assign(p, { n, rawMax: perIdCeiling(p.measuredRaw, n), gzMax: perIdCeiling(p.measuredGz, n) });
  return `${JSON.stringify(b, null, 2)}\n`;
}

/** syntheticRoot(src, n), then every gen/ids.mjs output, the hand pairs and the budgets at n, in the copy.
 *  Returns syntheticRoot's { root, ids, chromeIds } plus `written` (repo-relative paths changed in the copy). */
export async function writeIds(src, n) {
  const s = await syntheticRoot(src, n), root = s.root;
  if (resolve(root) === resolve(src)) throw new Error('write-ids: refusing to write into the source tree');
  const written = [];
  const put = (p, text) => { mkdirSync(join(root, p, '..'), { recursive: true }); writeFileSync(join(root, p), text); written.push(p); };
  const plates = JSON.parse(readFileSync(join(root, 'tools/plates/plates.json'), 'utf8'));
  const eightChrome = new Set(Object.values(plates).map(p => p.chromeId));
  const libChrome = s.chromeIds.filter(c => !eightChrome.has(c));
  // the clones' hand panels become pairs: one key per clone (its chrome id), through a pairs loader in the copy
  const pairOfId = {}, panelOf = {};
  s.ids.forEach((id, i) => {
    const c = s.chromeIds[i];
    if (eightChrome.has(c)) return;
    const f = join(root, G, `hand-${c}.ts`);
    if (!existsSync(f)) return;
    const m = readFileSync(f, 'utf8').match(/^export const panel = (.*);$/m);
    if (!m) throw new Error(`write-ids: no panel in ${G}/hand-${c}.ts`);
    panelOf[c] = new Function(`return ${m[1]};`)();
    pairOfId[id] = c;
    rmSync(f);
    written.push(`${G}/hand-${c}.ts`);
  });
  if (Object.keys(pairOfId).length) {
    put(PAIRS, `// LIB-4a write-ids (scratch copy only): each synthetic clone's hand panel as its own pair.
export const HAND_OF_ID = ${JSON.stringify(pairOfId, null, 2)};
const PANEL = ${JSON.stringify(panelOf)};
export const inputsFor = key => ['tools/plates/library/hands/pairs.mjs'];
export const pairPanel = async key => PANEL[key];
`);
  }
  // headers (D-LIB4a-6): render() cannot run on the copy, since a shipped library row with no pinned page is refused
  // (LIB-2b E3, pagesOf) and every clone is one. Each file is the plugin's own measuring-mode text under the
  // generator's header(): a single-writer file whose inputs all exist in the copy gets render()'s exact hash
  // (inputsSha256 over the writer's inputsFor, in the copy); ids.ts and ids-node.mjs, whose inputs include
  // content.mjs's per-row source closure (the clones have no How-to source, so the generator itself throws there),
  // keep the source tree's header line as it is
  const lib = await import(pathToFileURL(join(root, 'tools/plates/lib/inputs.mjs')).href);
  const hp = await import(pathToFileURL(join(root, 'tools/plates/gen/handpairs.mjs')).href);
  const gen = await import(pathToFileURL(join(root, 'tools/plates/gen/ids.mjs')).href);
  const HP = 'tools/plates/gen/handpairs.mjs', IDS = 'tools/plates/gen/ids.mjs';
  const withHeader = (p, writers, inputs, text) => lib.header(p, writers, lib.inputsSha256(writers, inputs, root)) + text;
  for (const o of await hp.outputs()) put(o.path, withHeader(o.path, [HP], o.inputs, o.text));
  for (const o of await gen.outputs()) {
    const was = readFileSync(join(src, o.path), 'utf8'), h = lib.parseHeader(was);
    if (!h) throw new Error(`write-ids: ${o.path} has no generator header in the source tree`);
    const own = h.writers.length === 1 && h.writers[0] === IDS && o.path !== 'tools/plates/library/ids-node.mjs';
    put(o.path, own ? withHeader(o.path, [IDS], gen.inputsFor(o.path) ?? gen.inputs(), o.text) : was.slice(0, was.indexOf('\n') + 1) + o.text);
  }
  const budgets = 'tests/howto/budgets.json';
  const bsrc = existsSync(join(root, budgets)) ? join(root, budgets) : join(src, budgets);
  put(budgets, budgetsAt(readFileSync(bsrc, 'utf8'), n));
  if (libChrome.length && !readdirSync(join(root, G)).some(f => f.startsWith('handpair-'))) throw new Error('write-ids: no handpair file written');
  return { ...s, written: [...new Set(written)] };
}

/** Copies the copy's changed and new files (`written` plus the synthetic clones and batch) into `dest`, a checkout of
 *  the scratch branch. Never the source tree. */
export function exportTo(s, src, dest) {
  if (resolve(dest) === resolve(src)) throw new Error('write-ids: refusing to export into the source tree');
  const files = new Set(s.written);
  for (const dir of [G, 'src/slices/howto/css', 'tools/plates/library/batches']) for (const f of readdirSync(join(s.root, dir))) {
    const p = `${dir}/${f}`;
    if (!existsSync(join(src, p)) || readFileSync(join(src, p), 'utf8') !== readFileSync(join(s.root, p), 'utf8')) files.add(p);
  }
  for (const p of files) {
    if (existsSync(join(s.root, p))) { mkdirSync(join(dest, p, '..'), { recursive: true }); cpSync(join(s.root, p), join(dest, p)); }
    else rmSync(join(dest, p), { force: true });
  }
  return [...files].sort();
}

// CLI: node tools/plates/library/scale/write-ids.mjs <n> <dest checkout>
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const [n, dest] = [Number(process.argv[2]), process.argv[3]];
  const src = resolve(new URL('../../../..', import.meta.url).pathname);
  const s = await writeIds(src, n);
  const files = exportTo(s, src, resolve(dest));
  console.log(`write-ids: n = ${n}, ${files.length} files into ${dest} (copy ${s.root})`);
}
