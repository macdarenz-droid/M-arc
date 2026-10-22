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
import { goldenInputs, goldenRows } from '../library/registry.mjs';
import { layersPage, pagesOf } from '../library/batch-golden.mjs';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, sha256 } from '../lib/inputs.mjs';
import { LAYERS, PAGE_SHA256, buildLayerPage, cleanupMirror, makeMirror, readManifest } from '../layers.mjs';
import { galleryCss, parse } from '../css.mjs';
import { chromeRules, divAt, howtoCss, libraryInputs, libraryRows, rewrite } from './hands.mjs';
import { configPairOf } from './handpairs.mjs';   // LIB-7b (D-LIB7b-ZOOMS)
import { pairCss } from '../library/build-layers-page.mjs';   // LIB-7b (D-LIB7b-ZOOMS)

export const PLATES_JSON = 'tools/plates/plates.json';
export const inputs = () => [
  ...Object.keys(readManifest().files).map(p => `tools/plates/layers/${p}`),
  'tools/plates/layers/MANIFEST.json', 'tools/plates/layers.mjs', 'tools/plates/css.mjs', 'tools/plates/gen/hands.mjs', ...goldenInputs(),
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

const lit = s => JSON.stringify(s);
export const postureText = (id, panels, zdots) => `// The ${id} posture close-ups (golden B), loaded on the first posture open (plan 2.5), with its close-up CSS.\n`
  + `import '../../slices/howto/css/zoom-${id}.css';\n`
  + `export const panels: Readonly<Record<string, string>> = {\n${panels.map(p => `  ${lit(p.key)}: ${lit(p.panel)},\n`).join('')}};\n`
  + `export const zdots = ${lit(zdots)};\n`;
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
      out.push({ path: `src/howto/generated/posture-${id}.ts`, text: postureText(id, panels, L.ZDOTS) });
    }
    const postureCss = postureCssOf(style, chrome);
    out.push({ path: 'src/slices/howto/css/posture.css', text: postureCss });
    const base = styleWithout(style, goldenRows());
    for (const row of libraryRows()) {
      const page = layersPage(row), file = pagesOf(row).layers, id = row.chromeId, lib = galleryCss(page);
      if (page.split(L.ZDOTS).length !== 2) throw new Error(`zooms: ${row.id}: ZDOTS is not in ${file} exactly once`);
      if (styleWithout(lib, libraryRows().filter(r => pagesOf(r).layers === file)) !== base) throw new Error(`zooms: ${row.id}: ${file}'s style, without its own .hx- rules, is not golden B's`);
      if (postureCssOf(lib, howtoCss(readFileSync(join(LAYERS, 'artifact', 'build-page.mjs'), 'utf8'), lib)) !== postureCss) throw new Error(`zooms: ${row.id}: ${file} does not rebuild posture.css byte for byte`);
      const panels = posturePanels(page, id);
      out.push({ path: `src/howto/generated/posture-${id}.ts`, text: postureText(id, panels, L.ZDOTS) });
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
  return row ? [...libraryInputs(row), 'tools/plates/gen/hands.mjs'] : inputs();
}
export async function outputs(ctx) {
  return (await outputsOf(ctx)).map(o => ({ ...o, inputs: inputsFor(o.path) }));
}
