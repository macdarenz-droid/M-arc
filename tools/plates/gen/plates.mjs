// HT-2 plugin: the approved plates -> src/howto/generated/ht-<slug>.ts (x8), generated/index.ts and
// src/slices/howto/css/plate.css (ids.ts moved to gen/ids.mjs, LIB-2). It rebuilds the gallery from the vendored engine (HT-1's golden.mjs), refuses
// unless the page is the approved one and every fragment matches its latest GOLDEN.json entry, then emits the
// fragments as JSON string literals: the parsed strings are the golden bytes, never re-serialized.
import { batchGoldenOf, goldenInputs, goldenRows, rows as registryRows, shippedRows } from '../library/registry.mjs';
import { pagesOf, pinOf, platesPage } from '../library/batch-golden.mjs';
import { closureOf } from '../library/inputs-closure.mjs';
// The QA modules (LIB-3) and candidate.mjs are imported when a library row is gated, never at load: qa/node.mjs imports
// this file's moduleText, and a static import back would make a cycle (vitest's parallel module loads hang on it).
const qa = async () => ({ ...(await import('../library/candidate.mjs')), ...(await import('../library/qa/index.mjs')), ...(await import('../library/qa/engine.mjs')) });
import { readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, sha256 } from '../lib/inputs.mjs';
import { FIXTURE, FONT, GOLDEN_JSON, LIB_OF, firstDiff, buildGallery, extractPlates, fragmentsOf, latestEntries, makeMirror, readManifest, verifyChain } from '../golden.mjs';
import { galleryCss, rewriteCss } from '../css.mjs';
import { CODEC, decoderSource, pack } from './codec/delta.mjs';

const rel = p => p.slice(ROOT.length + 1).split('\\').join('/');
export const PLATES_JSON = 'tools/plates/plates.json';
export const LABEL = 'How to do it';

export const inputs = () => [
  ...Object.keys(readManifest().files).map(p => `tools/plates/vendor/${p}`),
  'tools/plates/vendor/MANIFEST.json', rel(FONT), 'tools/plates/golden.mjs', 'tools/plates/pins.json', 'tools/plates/css.mjs',
  ...goldenInputs(), rel(GOLDEN_JSON), rel(FIXTURE),
];

/** The view, from the plate's own meta label ("Front view" / "Side view"). */
export function viewOf(overlay) {
  const m = [...overlay.matchAll(/<span class="plate-meta"[^>]*>(Front|Side) view<\/span>/g)];
  if (m.length !== 1) throw new Error(`plates: expected one view label, found ${m.length}`);
  return m[0][1].toLowerCase();
}

/** Checks one extracted plate against its GOLDEN entry and its plates.json row; returns the problems. */
export function problemsOf(p, entry, row) {
  const bad = [], id = LIB_OF[p.chromeId];
  if (!entry) return [`${p.chromeId}: no GOLDEN.json entry`];
  if (!row) return [`${id}: no plates.json row`];
  for (const [k, v] of Object.entries(fragmentsOf(p))) if (entry.fragments[k] !== v) bad.push(`${id}.${k}: sha256 ${v} != GOLDEN ${entry.fragments[k]}`);
  for (const k of ['src', 'slug', 'prefix', 'chromeId']) if (row[k] !== entry[k]) bad.push(`${id}: plates.json ${k} ${row[k]} != GOLDEN ${entry[k]}`);
  if (p.prefix !== entry.prefix) bad.push(`${id}: svg prefix ${p.prefix} != GOLDEN ${entry.prefix}`);
  return bad;
}

const lit = s => JSON.stringify(s);
// `refs` (HT-11): the names the svg and overlay are bound to in a packed module, else they are written as literals
const figure = (f, pad, refs) => [
  `{`,
  `${pad}  svg: ${refs ? refs[0] : lit(f.svg)},`,
  `${pad}  overlay: ${refs ? refs[1] : lit(f.overlay)},`,
  `${pad}  firstKey: ${lit(f.firstKey)},`,
  `${pad}  cues: [${f.cues.map(c => `{ key: ${lit(c.key)}, cue: ${lit(c.cue)} }`).join(', ')}],`,
  `${pad}}`,
].join('\n');

/** The module text. With `packed` (HT-11, the shipped form) the four figure strings are path-encoded
 *  (tools/plates/gen/codec/delta.mjs) and decoded once at import. Without it they are literals, byte-stable for
 *  LIB-3 H7's sizing (L2-A19). */
export function moduleText(id, p, entry, hash, packed = false) {
  const plate = pad => [
    `view: ${lit(viewOf(p.normal.overlay))},`,
    `normal: ${figure(p.normal, pad, packed && ['nSvg', 'nOverlay'])},`,
    `mistake: ${figure(p.mistake, pad, packed && ['mSvg', 'mOverlay'])},`,
    `tells: ${lit(p.tells)},`,
    `tempo: ${lit(p.tempo)},`,
    `alt: ${lit(p.alt)},`,
    `mistakeAlt: ${lit(p.mistakeAlt)},`,
  ].map(l => `${pad}${l}`).join('\n');
  // HT-11: the packed plate is an arrow called in place, so the module keeps its one import and its object literal
  const body = packed ? `(() => {
    // HT-11: the figure strings ship path-encoded; unpack (src/howto/delta.js, copied so the chunk imports nothing)
    // gives back their golden bytes once, at import.
    const unpack = ${decoderSource().replace(/\n/g, '\n    ')};
    const [nSvg = '', nOverlay = '', mSvg = '', mOverlay = ''] = unpack([
${pack([p.normal.svg, p.normal.overlay, p.mistake.svg, p.mistake.overlay]).map(s => `      ${lit(s)},`).join('\n')}
    ]);
    return {
${plate('      ')}
    };
  })()` : `{
${plate('    ')}
  }`;
  return `import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: ${lit(id)},
  name: ${lit(p.name)},
  hashes: { inputsSha256: ${lit(hash)}, golden: ${lit(sha256(JSON.stringify(entry)))} },
  plate: ${body},
} satisfies BuiltHowTo;
`;
}

export const chunkName = slug => `ht-${slug}`;

/** LOADERS moved to generated/loaders.ts (LIB-2, design 7: its own lazy chunk, written by gen/ids.mjs). index.ts stays
 *  as a re-export so '@/howto/generated' keeps its meaning. */
export function indexText() {
  return `// LOADERS live in ./loaders (LIB-2): one dynamic import per shipped id, in its own lazy chunk.
export { LOADERS } from './loaders';
`;
}

async function outputsOf({ hashFor }) {
  const golden = JSON.parse(readFileSync(GOLDEN_JSON, 'utf8'));
  const chain = verifyChain(golden.entries);
  if (chain.length) throw new Error(`plates: GOLDEN.json chain:\n${chain.join('\n')}`);
  const latest = latestEntries(golden.entries), page = latest.get('page');
  const rows = goldenRows();
  const mirror = makeMirror();
  let built;
  try { built = await buildGallery(mirror); } finally { rmSync(mirror, { recursive: true, force: true }); }
  if (sha256(built) !== page.pageSha256) {
    const at = firstDiff(built, readFileSync(FIXTURE));
    throw new Error(`plates: L1 rebuilt gallery sha256 ${sha256(built)} (${built.length} B) != approved ${page.pageSha256} (${page.bytes} B); first differing byte at offset ${at} (node ${process.version}); never generate from it`);
  }
  const html = built.toString('utf8'), plates = extractPlates(html);
  const bad = plates.flatMap(p => problemsOf(p, latest.get(LIB_OF[p.chromeId]), rows[LIB_OF[p.chromeId]]));
  const goldenIds = [...latest.values()].filter(e => e.kind === 'plate').map(e => e.id);
  if (JSON.stringify(Object.keys(rows)) !== JSON.stringify(goldenIds)) bad.push(`plates.json ids ${Object.keys(rows)} != GOLDEN plates ${goldenIds}`);
  if (plates.length !== goldenIds.length) bad.push(`${plates.length} plates in the gallery, ${goldenIds.length} in GOLDEN.json`);
  if (bad.length) throw new Error(`plates: refusing to generate:\n${bad.join('\n')}`);
  const byId = new Map(plates.map(p => [LIB_OF[p.chromeId], p]));
  const out = goldenIds.map(id => {
    const path = `src/howto/generated/${chunkName(rows[id].slug)}.ts`;
    return { path, text: moduleText(id, byId.get(id), latest.get(id), hashFor(path, inputsFor(path)), true) };
  });
  out.push({ path: 'src/howto/generated/index.ts', text: indexText() });
  const plateCss = rewriteCss(galleryCss(html));
  out.push({ path: 'src/slices/howto/css/plate.css', text: plateCss });
  out.push(...await libraryOutputs(hashFor, plateCss));
  return out;
}

/** LIB-2b: the shipped library rows (the 8 stay above, from golden A). */
export const libraryRows = (all = registryRows()) => shippedRows(all).filter(r => r.mode !== 'golden');

/** Checks one library plate against its batch golden `plate` entry and its batch row; returns the problems. */
export function libraryProblems(p, entry, row) {
  const bad = [];
  for (const [k, v] of Object.entries(fragmentsOf(p))) if (entry.fragments?.[k] !== v) bad.push(`${row.id}.${k}: sha256 ${v} != batch golden ${entry.fragments?.[k]}`);
  for (const k of ['src', 'slug', 'prefix', 'chromeId']) if (row[k] !== entry[k]) bad.push(`${row.id}: batch row ${k} ${row[k]} != batch golden ${entry[k]}`);
  if (p.prefix !== entry.prefix) bad.push(`${row.id}: svg prefix ${p.prefix} != batch golden ${entry.prefix}`);
  return bad;
}

/** The QA node half of one library row (D-LIB2b-QA): throws QaRefused naming the id for any problem but the browser keys.
 *  Cached in-process by sha256 of its candidate inputs (the row, its plate card markup, its spec closure and research
 *  card bytes); `ms` is the measured node-half time of the run that filled the cache. */
const qaCache = new Map();
export async function gateNodeHalf(row, platesHtml, engine, all) {
  const { QaRefused, candidateOf, nodeHalf, runQa } = await qa();
  const c = await candidateOf(row.id, { platesHtml, engine, all });
  const spec = closureOf([`tools/plates/${row.src}`]).map(f => [f, sha256(readFileSync(join(ROOT, f)))]);
  const key = sha256(JSON.stringify([row, c.article, c.plate, spec, c.research, c.exemptions]));
  if (!qaCache.has(key)) {
    const t0 = Date.now(), report = nodeHalf(await runQa(c, { engine }));
    qaCache.set(key, { ...report, ms: Date.now() - t0 });
  }
  const report = qaCache.get(key);
  if (!report.ok) throw new QaRefused(report);
  return report;
}

/** Each shipped library row's ht-<slug>.ts plate part, cut from its batch plates page after its pins and the QA node half. */
async function libraryOutputs(hashFor, plateCss) {
  const all = registryRows(), lib = libraryRows(all);
  if (!lib.length) return [];
  const { dropMirror, loadEngine } = await qa(), mirror = makeMirror();
  try {
    const engine = await loadEngine(mirror), out = [];
    for (const row of lib) {
      const html = await platesPage(row, all), file = pagesOf(row).plates;
      // plate.css is built from golden A's gallery only: a batch page must rebuild it byte for byte (D-LIB2b-CSS)
      if (rewriteCss(galleryCss(html)) !== plateCss) throw new Error(`plates: ${row.id}: the page built from ${file} does not rebuild plate.css byte for byte`);
      const p = extractPlates(html).find(x => x.chromeId === row.chromeId);
      if (!p) throw new Error(`plates: ${row.id}: no card-${row.chromeId} in the page built from ${file}`);
      const entry = pinOf(row, 'plate'), bad = libraryProblems(p, entry, row);
      if (bad.length) throw new Error(`plates: refusing to generate ${row.id}:\n${bad.join('\n')}`);
      await gateNodeHalf(row, html, engine, all);
      const path = `src/howto/generated/${chunkName(row.slug)}.ts`;
      out.push({ path, text: moduleText(row.id, p, entry, hashFor(path, inputsFor(path)), true) });
    }
    return out;
  } finally { dropMirror(mirror); }
}

/** LIB-2 (design 6.1), LIB-2b: each output's own inputs. The 8's outputs are cut from one shared source (the golden A
 *  gallery built from the whole vendored folder), so a file's inputs are that whole set; the rows come from the
 *  registry's goldenRows() (plates.json only), so a library batch row is never among them (L2-A4). A library row's
 *  ht-<slug>.ts adds its plates page config, the closure of its spec (closureOf), its batch file and batch golden file. */
export function inputsFor(path) {
  const row = libraryRows().find(r => path === `src/howto/generated/${chunkName(r.slug)}.ts`);
  if (!row) return /\/ht-[^/]+\.ts$/.test(path) ? [...inputs(), ...CODEC] : inputs();   // HT-11: an ht-*.ts is packed with CODEC
  return [...inputs(), ...CODEC, 'tools/plates/library/plates-page.mjs', 'tools/plates/library/build-page.mjs', 'tools/plates/library/batch-golden.mjs',
    pagesOf(row).plates, ...closureOf([`tools/plates/${row.src}`]), row.batchFile, batchGoldenOf(row.batchFile)];
}
export async function outputs(ctx) {
  return (await outputsOf(ctx)).map(o => ({ ...o, inputs: inputsFor(o.path) }));
}
