// HT-2 plugin: the approved plates -> src/howto/generated/ht-<slug>.ts (x8), generated/index.ts and
// src/slices/howto/css/plate.css (ids.ts moved to gen/ids.mjs, LIB-2). It rebuilds the gallery from the vendored engine (HT-1's golden.mjs), refuses
// unless the page is the approved one and every fragment matches its latest GOLDEN.json entry, then emits the
// fragments as JSON string literals: the parsed strings are the golden bytes, never re-serialized.
import { goldenInputs, goldenRows } from '../library/registry.mjs';
import { readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, sha256 } from '../lib/inputs.mjs';
import { FIXTURE, FONT, GOLDEN_JSON, LIB_OF, firstDiff, buildGallery, extractPlates, fragmentsOf, latestEntries, makeMirror, readManifest, verifyChain } from '../golden.mjs';
import { galleryCss, rewriteCss } from '../css.mjs';

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
const figure = (f, pad) => [
  `{`,
  `${pad}  svg: ${lit(f.svg)},`,
  `${pad}  overlay: ${lit(f.overlay)},`,
  `${pad}  firstKey: ${lit(f.firstKey)},`,
  `${pad}  cues: [${f.cues.map(c => `{ key: ${lit(c.key)}, cue: ${lit(c.cue)} }`).join(', ')}],`,
  `${pad}}`,
].join('\n');

export function moduleText(id, p, entry, hash) {
  return `import type { BuiltHowTo } from '../types';

export default {
  schema: 1,
  id: ${lit(id)},
  name: ${lit(p.name)},
  hashes: { inputsSha256: ${lit(hash)}, golden: ${lit(sha256(JSON.stringify(entry)))} },
  plate: {
    view: ${lit(viewOf(p.normal.overlay))},
    normal: ${figure(p.normal, '    ')},
    mistake: ${figure(p.mistake, '    ')},
    tells: ${lit(p.tells)},
    tempo: ${lit(p.tempo)},
    alt: ${lit(p.alt)},
    mistakeAlt: ${lit(p.mistakeAlt)},
  },
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
    return { path, text: moduleText(id, byId.get(id), latest.get(id), hashFor(path)) };
  });
  out.push({ path: 'src/howto/generated/index.ts', text: indexText() });
  out.push({ path: 'src/slices/howto/css/plate.css', text: rewriteCss(galleryCss(html)) });
  return out;
}

/** LIB-2 (design 6.1): each output's own inputs. Every plates.mjs output is cut from one shared source (the golden
 *  A gallery built from the whole vendored folder), so a file's inputs are that whole set; the rows come from the
 *  registry's goldenRows() (plates.json only), so a library batch row is never among them (L2-A4). */
export const inputsFor = () => inputs();
export async function outputs(ctx) {
  return (await outputsOf(ctx)).map(o => ({ ...o, inputs: inputsFor(o.path) }));
}
