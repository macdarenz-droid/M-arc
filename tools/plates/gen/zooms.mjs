// HT-7 plugin: golden B's posture close-ups (S3, right next to wrong) -> src/howto/generated/posture-<chromeId>.ts, and
// the page's crop-background rule -> src/slices/howto/css/posture.css. Found by glob (no registry line).
//
// Golden B draws two posture close-ups per exercise (16). Its crops are re-renders with their own ids, labels, nested
// `<svg>` and `clip-path` (critic fix 3), so nothing is cut or redrawn here: each chunk carries
//   - `panels`: {key: the close-up's `<div class="zx" …>` block}, cut byte for byte from the golden-B page built from
//     the vendored, hash-locked layers (tools/plates/layers.mjs), after the page is checked against its approved sha256;
//   - `zdots`: the page's one hidden dot pattern (`ZDOTS`, howto-layers.mjs) that most crops fill their background
//     with (`url(#zdots)`), proven to be in the page verbatim; Posture.tsx mounts it once per document;
//   - an import of `css/zoom-<chromeId>.css` (HT-6 generates it: the exercise's scoped close-up rules). Never duplicated.
import { goldenInputs, goldenRows, sourceOf } from '../library/registry.mjs';
import { layersPage, pagesOf } from '../library/batch-golden.mjs';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, sha256 } from '../lib/inputs.mjs';
import { LAYERS, PAGE_SHA256, buildLayerPage, cleanupMirror, makeMirror, readManifest } from '../layers.mjs';
import { galleryCss, parse } from '../css.mjs';
import { chromeRules, divAt, howtoCss, libraryInputs, libraryRows, rewrite } from './hands.mjs';
import { CODEC, decoderSource, pack } from './codec/delta.mjs';
import { configPairOf } from './handpairs.mjs';   // LIB-7b (D-LIB7b-ZOOMS)
import { pairCss } from '../library/build-layers-page.mjs';   // LIB-7b (D-LIB7b-ZOOMS)

export const PLATES_JSON = 'tools/plates/plates.json';
export const inputs = () => [
  ...Object.keys(readManifest().files).map(p => `tools/plates/layers/${p}`),
  'tools/plates/layers/MANIFEST.json', 'tools/plates/layers.mjs', 'tools/plates/css.mjs', 'tools/plates/gen/hands.mjs', ...goldenInputs(),
  ...CODEC,   // HT-11: the posture chunks are packed with them
];

/** The page's rule for the dot pattern's dots (HOWTO_CSS). */
export const POSTURE_SELECTORS = ['.zdot'];

/** A selector whose first compound is golden B's `.plate` (the drawing rules), after an optional `html…` prefix. */
const PLATE_FIRST = /^(html(?:[:[][^\s]*)?\s+)?\.plate(?![\w-])/;
/**
 * The page's plate drawing rules for the crops. A crop is a plate re-render inside the close-up, marked `class="plate …"`
 * (golden B's own class, kept byte for byte), so the page styles its strokes, joints, discs and equipment with the
 * gallery's `.plate …` rules. The app has those rules only as `.ht .ht-plate …` (HT-2's class map, for the sheet's own
 * plate figure), which never match a crop. So each rule whose selector starts with `.plate` is shipped for the crops as
 * `.ht :where(.hx) .plate …`: `:where` adds nothing, so every rule keeps golden's specificity plus the one `.ht` class
 * every app How-to rule carries, and golden's order (these come before the close-up CSS, as in the page).
 * First, one reset: the app's own global `.plate` (the weight-plate chip, styles.css) would otherwise style every crop's
 * `.plate` box; `all: revert` drops it to the browser default, as the page has it, before golden's `.plate` rule.
 */
export function cropPlateCss(galleryStyle) {
  const keep = sel => sel.split(',').map(x => x.trim()).filter(x => PLATE_FIRST.test(x));
  const text = [];
  for (const n of parse(galleryStyle)) {
    if (n.sel != null) { const k = keep(n.sel); if (k.length) text.push(`${k.join(', ')} { ${n.body} }`); continue; }
    if (!Array.isArray(n.body)) continue;
    const inner = n.body.filter(c => c.sel != null).map(c => [keep(c.sel), c.body]).filter(([k]) => k.length);
    if (inner.length) text.push(`${n.at} { ${inner.map(([k, b]) => `${k.join(', ')} { ${b} }`).join(' ')} }`);
  }
  if (!text.length) throw new Error('zooms: no .plate rules in the golden-B page');
  const MARK = 'htzoomplate';
  const css = rewrite(`.plate { all: revert; }\n${text.join('\n')}`.replace(/\.plate(?![\w-])/g, `.${MARK}`));
  if (/\.ht-plate\b/.test(css)) throw new Error('zooms: a crop rule was class-mapped');
  return css.replace(new RegExp(`\\.ht \\.${MARK}(?![\\w-])`, 'g'), '.ht :where(.hx) .plate').replace(new RegExp(`\\.${MARK}(?![\\w-])`, 'g'), '.plate');
}

/** The posture close-up panels of one exercise, in page order: [{ key, panel }], each exactly as the page holds it. */
export function posturePanels(html, id) {
  const out = [], re = new RegExp(`<div class="zx" id="${id}-zoom-([a-z0-9-]+)" data-zoom="([a-z0-9-]+)"`, 'g');
  for (const m of html.matchAll(re)) {
    if (m[2] === 'hand') continue;
    if (m[1] !== m[2]) throw new Error(`zooms: ${id}: panel id ${m[1]} != data-zoom ${m[2]}`);
    if (out.some(o => o.key === m[2])) throw new Error(`zooms: ${id}: two ${m[2]} close-ups`);
    out.push({ key: m[2], panel: divAt(html, m.index) });
  }
  if (!out.length) throw new Error(`zooms: ${id}: no posture close-up in the golden-B page`);
  return out;
}

// ---- F-ZOOM-NONE (card f-zoom-none-card.md, PLAN RULED on #388): a library row with no drawn posture close-up ----
// Allowed only when every posture zoom of the row's card is a ruled text checkpoint, named in TEXT_ZOOMS with its
// ruling. Such a row writes no posture-<chromeId>.ts; every other row runs the code below it unchanged.
export const TEXT_ZOOMS = 'tools/plates/library/text-zooms.json';
export const TEXT_ZOOM_RULINGS = Object.freeze(['D-SHIP-TEXTZOOM']);
/** The text-zooms entries ({ <lib id>: { ruling, checkpoints: { <card zoom key>: <posture checkpoint key> } } }). */
export const readTextZooms = (root = ROOT) => JSON.parse(readFileSync(join(root, TEXT_ZOOMS), 'utf8')).entries ?? {};
/** The row's entry when its sheet has no posture zoom and the entry holds; null when the sheet has posture zooms and no
 *  entry. Throws on every F-ZOOM-NONE red. sheet: the How-to content; card: its research card. */
export function textZoomRow(rowId, sheet, card, list) {
  const e = list[rowId], drawn = (sheet.zooms ?? []).filter(z => z.kind !== 'hand');
  if (drawn.length) {
    if (e) throw new Error(`zooms: ${rowId}: has posture zooms [${drawn.map(z => z.key)}], but ${TEXT_ZOOMS} names it`);
    return null;
  }
  if (!e) throw new Error(`zooms: ${rowId}: no posture zoom, and no ${TEXT_ZOOMS} entry rules its card zooms text checkpoints`);
  if (!TEXT_ZOOM_RULINGS.includes(e.ruling)) throw new Error(`zooms: ${rowId}: ${TEXT_ZOOMS} ruling ${JSON.stringify(e.ruling)} is not one of ${TEXT_ZOOM_RULINGS}`);
  const cardZooms = (card.zooms ?? []).filter(z => z.kind === 'posture'), keys = new Set((sheet.posture ?? []).map(p => p.key)), map = e.checkpoints ?? {};
  for (const z of cardZooms) {
    if (!(z.key in map)) throw new Error(`zooms: ${rowId}: card zoom ${z.key} is drawable: ${TEXT_ZOOMS} maps it to no text checkpoint`);
    if (!keys.has(map[z.key])) throw new Error(`zooms: ${rowId}: card zoom ${z.key} maps to checkpoint ${map[z.key]}, which the sheet's posture does not hold`);
  }
  for (const k of Object.keys(map)) if (!cardZooms.some(z => z.key === k)) throw new Error(`zooms: ${rowId}: ${TEXT_ZOOMS} names card zoom ${k}, which the card's posture zooms do not hold`);
  // no link may open a close-up the sheet does not have (a setup, posture, mistake or feel "Show me")
  const own = new Set((sheet.zooms ?? []).map(z => z.key)), links = [];
  const walk = x => { if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) { if (k === 'zoom' && typeof v === 'string') links.push(v); else walk(v); } };
  for (const k of ['setup', 'posture', 'mistakes', 'feel']) walk(sheet[k]);
  const dangling = [...new Set(links.filter(z => !own.has(z)))];
  if (dangling.length) throw new Error(`zooms: ${rowId}: links to close-ups the sheet does not have: ${dangling}`);
  return e;
}
/** F-ZOOM-NONE: a ruled row's page must hold no posture close-up, and its card no control that opens a close-up the
 *  sheet does not have (`own`: the sheet's zoom keys). */
export function textZoomPageCheck(rowId, html, chromeId, file, own = ['hand']) {
  const left = posturePanelKeys(html, chromeId);
  if (left.length) throw new Error(`zooms: ${rowId}: ruled in ${TEXT_ZOOMS}, but ${file} holds posture close-ups [${left}]`);
  const a = html.indexOf(`<article class="sheet-card" id="card-${chromeId}"`), b = a < 0 ? -1 : html.indexOf('</article>', a);
  if (a < 0 || b < 0) throw new Error(`zooms: ${rowId}: no card ${chromeId} on ${file}`);
  const opens = [...new Set([...html.slice(a, b).matchAll(/data-zoom="([a-z0-9-]+)"/g)].map(m => m[1]).filter(k => !own.includes(k)))];
  if (opens.length) throw new Error(`zooms: ${rowId}: ruled in ${TEXT_ZOOMS}, but its card on ${file} opens close-ups it does not have [${opens}]`);
}
/** The posture close-up keys a page holds for `id` (posturePanels without its throw). */
export const posturePanelKeys = (html, id) => [...html.matchAll(new RegExp(`<div class="zx" id="${id}-zoom-([a-z0-9-]+)" data-zoom="([a-z0-9-]+)"`, 'g'))].map(m => m[2]).filter(k => k !== 'hand');
/** F-ZOOM-NONE: the row's text-zooms entry (checked) and its sheet's zoom keys, or null. */
async function textZoomOf(row, list) {
  const sheet = (await import(pathToFileURL(join(ROOT, sourceOf(row.id))).href)).default;
  const cardFile = sheet.research?.card;
  if (typeof cardFile !== 'string' || !existsSync(join(ROOT, cardFile))) throw new Error(`zooms: ${row.id}: no research card ${cardFile}`);
  const e = textZoomRow(row.id, sheet, JSON.parse(readFileSync(join(ROOT, cardFile), 'utf8')), list);
  return e && { entry: e, own: sheet.zooms.map(z => z.key) };
}

const lit = s => JSON.stringify(s);
/** The module text. With `packed` (HT-11, the shipped form) the panels and zdots are path-encoded
 *  (tools/plates/gen/codec/delta.mjs) and decoded once at import by a copy of src/howto/delta.js's unpack, so the
 *  chunk keeps its one import. */
export function postureText(id, panels, zdots, packed = false) {
  const head = `// The ${id} posture close-ups (golden B), loaded on the first posture open (plan 2.5), with its close-up CSS.\n`
    + `import '../../slices/howto/css/zoom-${id}.css';\n`;
  if (!packed) return head
    + `export const panels: Readonly<Record<string, string>> = {\n${panels.map(p => `  ${lit(p.key)}: ${lit(p.panel)},\n`).join('')}};\n`
    + `export const zdots = ${lit(zdots)};\n`;
  const names = panels.map((_, n) => `p${n}`);
  return head
    + `// HT-11: the strings ship path-encoded; unpack (src/howto/delta.js, copied so the chunk imports nothing else) gives\n`
    + `// back their golden bytes once, at import.\n`
    + `const unpack = ${decoderSource()};\n`
    + `const [${[...names, 'z'].map(n => `${n} = ''`).join(', ')}] = unpack([\n${pack([...panels.map(p => p.panel), zdots]).map(s => `  ${lit(s)},\n`).join('')}]);\n`
    + `export const panels: Readonly<Record<string, string>> = {\n${panels.map((p, n) => `  ${lit(p.key)}: ${names[n]},\n`).join('')}};\n`
    + `export const zdots = z;\n`;
}
/** posture.css from a layers page's style and its HOWTO_CSS (the 8's from golden B; a library page must rebuild it). */
export function postureCssOf(style, chrome) {
  const plate = cropPlateCss(style), zdot = rewrite(chromeRules(chrome, POSTURE_SELECTORS));
  return `${plate}${zdot.slice(zdot.indexOf('/* ht-tokens:end */\n') + 20)}`;
}
/** A layers page's style with comments, blank lines and the given rows' own `.hx-<chromeId> ` rules removed (D-LIB2b-CSS): what every
 *  page must share with golden B's. */
export function styleWithout(style, rowsOf) {
  const ids = Object.values(rowsOf).map(r => r.chromeId);
  // LIB-7b (D-LIB7b-ZOOMS): a pair key's scope belongs to the rows whose layers config names it. Its `.hx-hp-<K> ` lines
  // must be exactly the hook's own pairCss(K) lines (else throw), and only then are they dropped with the rows' own.
  const lines = style.replace(/\/\*[\s\S]*?\*\//g, '').split('\n'), byKey = new Map();
  for (const r of Object.values(rowsOf)) { const k = configPairOf(r); if (k !== undefined) byKey.set(k, [...(byKey.get(k) ?? []), r.id]); }
  for (const [k, of] of byKey) {
    const got = lines.filter(l => l.trimStart().startsWith(`.hx-hp-${k} `)), want = pairCss(k).split('\n').filter(l => l.trim());
    if (got.join('\n') !== want.join('\n')) throw new Error(`zooms: ${of.join(', ')}: the page's .hx-hp-${k} rules are not pairCss(${k}) exactly`);
  }
  return lines.filter(l => l.trim() && !ids.some(id => l.trimStart().startsWith(`.hx-${id} `)) && ![...byKey.keys()].some(k => l.trimStart().startsWith(`.hx-hp-${k} `))).join('\n');
}

async function outputsOf() {
  const rows = goldenRows();
  const mirror = makeMirror();
  try {
    const page = await buildLayerPage(mirror);
    if (sha256(page) !== PAGE_SHA256) throw new Error(`zooms: golden-B page sha256 ${sha256(page)} != approved ${PAGE_SHA256}`);
    const html = page.toString('utf8');
    const L = await import(pathToFileURL(join(mirror, 'artifact', 'howto-layers.mjs')).href);
    if (html.split(L.ZDOTS).length !== 2) throw new Error('zooms: ZDOTS is not in the golden-B page exactly once');
    const style = galleryCss(html), chrome = howtoCss(readFileSync(join(LAYERS, 'artifact', 'build-page.mjs'), 'utf8'), style);
    const out = [];
    for (const row of Object.values(rows)) {
      const id = row.chromeId, panels = posturePanels(html, id);
      out.push({ path: `src/howto/generated/posture-${id}.ts`, text: postureText(id, panels, L.ZDOTS, true) });
    }
    const postureCss = postureCssOf(style, chrome);
    out.push({ path: 'src/slices/howto/css/posture.css', text: postureCss });
    const base = styleWithout(style, goldenRows()), textZooms = readTextZooms();
    for (const row of libraryRows()) {
      const page = layersPage(row), file = pagesOf(row).layers, id = row.chromeId, lib = galleryCss(page);
      if (page.split(L.ZDOTS).length !== 2) throw new Error(`zooms: ${row.id}: ZDOTS is not in ${file} exactly once`);
      if (styleWithout(lib, libraryRows().filter(r => pagesOf(r).layers === file)) !== base) throw new Error(`zooms: ${row.id}: ${file}'s style, without its own .hx- rules, is not golden B's`);
      if (postureCssOf(lib, howtoCss(readFileSync(join(LAYERS, 'artifact', 'build-page.mjs'), 'utf8'), lib)) !== postureCss) throw new Error(`zooms: ${row.id}: ${file} does not rebuild posture.css byte for byte`);
      // F-ZOOM-NONE: a ruled text-checkpoint row writes no posture chunk, and its page holds no posture close-up
      const ruled = await textZoomOf(row, textZooms);
      if (ruled) { textZoomPageCheck(row.id, page, id, file, ruled.own); continue; }
      const panels = posturePanels(page, id);
      out.push({ path: `src/howto/generated/posture-${id}.ts`, text: postureText(id, panels, L.ZDOTS, true) });
    }
    return out;
  } finally {
    cleanupMirror(mirror);
  }
}

/** LIB-2 (design 6.1): each output's own inputs. Every zooms.mjs output is cut from one shared source (the golden
 *  B page built from the whole vendored folder), so a file's inputs are that whole set; the rows come from the
 *  registry's goldenRows() (plates.json only), so a library batch row is never among them (L2-A4). */
/** LIB-2b (lib4-cards 11.1 item 12): a library row's posture-<chromeId>.ts lists its pinned page and the files around it
 *  (hands.mjs libraryInputs: ZDOTS is checked against the MANIFEST-locked golden B). The 8 keep the whole layers set. */
export function inputsFor(path) {
  const row = libraryRows().find(r => path === `src/howto/generated/posture-${r.chromeId}.ts`);
  return row ? [...libraryInputs(row), 'tools/plates/gen/hands.mjs', ...CODEC] : inputs();
}
export async function outputs(ctx) {
  return (await outputsOf(ctx)).map(o => ({ ...o, inputs: inputsFor(o.path) }));
}
