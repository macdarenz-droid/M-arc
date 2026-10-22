// LIB-6 layers page builder (plan 2.7): golden B's layers page for any list of exercises, from the approved chrome.
// The vendored artifact/build-page.mjs and artifact/howto-layers.mjs have the 8 written in (GROUPS, HOWTO_IDS, the
// close-up script per id). This builder runs those two files unchanged except for named, exact-once source patches
// that swap the written-in lists for a spec list, on a mirror copy of tools/plates/layers/. So a batch page carries
// golden B's chrome byte for byte and cannot drift from it; with the 8's list it rebuilds the LR-23 page (e7b81413…).
// Each exercise's close-ups come from the library renderer (render/closeups.mjs) or, as plan 2.6's fallback, from its
// frozen golden-B script (render/legacy.mjs). Nothing in tools/plates/layers/ is written to. Build time only (Node 22).
import { spawn } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { cleanupMirror, makeMirror } from '../layers.mjs';
import { LEGACY_SCRIPTS } from './render/legacy.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const RENDERER_URL = pathToFileURL(join(HERE, 'render', 'closeups.mjs')).href;
export const REGION_FIX_URL = pathToFileURL(join(HERE, 'render', 'region-fix.mjs')).href;
/** LIB-5's back box (D-LIB5-PAGE, D-LIB6PM-ANCHORS): loaded by URL, only for a page with a back-flagged sheet. */
export const BACK_BOX_URL = pathToFileURL(join(HERE, 'shared', 'back-box.mjs')).href;
/** The CSS comment label of a renderer-drawn exercise that has no golden-B label. */
export const RENDERER_LABEL = 'library/render/closeups.mjs';

/** Card id (build-page.mjs) <-> howto id (howto-layers.mjs): only the lateral raise differs, as in howto-layers.mjs. */
export const howtoIdOf = card => (card === 'lateral_raise' ? 'dumbbell_lateral_raise' : card);

/** Golden B's GROUPS. */
export const GOLDEN_B_GROUPS = [
  { id: 'free', title: 'Free weights', ids: ['lateral_raise', 'barbell_back_squat'] },
  { id: 'hanging', title: 'Hanging', ids: ['pull_up', 'hanging_leg_raise'] },
  { id: 'machines', title: 'Machines', ids: ['lat_pulldown', 'seated_cable_row', 'leg_press', 'machine_chest_press'] },
];
/** The 8's close-up sources: the library renderer with the 8's options, each CSS block labelled as golden B labels it. */
export const GOLDEN_B_OPTIONS_URL = pathToFileURL(join(HERE, 'render', 'closeups-8.mjs')).href;
export const GOLDEN_B_CLOSEUPS = Object.fromEntries(Object.entries(LEGACY_SCRIPTS).map(([id, label]) => [id, { optionsKey: id, label }]));
export const GOLDEN_B_SPEC = { groups: GOLDEN_B_GROUPS, closeups: GOLDEN_B_CLOSEUPS, optionsUrl: GOLDEN_B_OPTIONS_URL };
export const GOLDEN_B_JUMP = '  <a class="pg-jump" href="#machine-chest-press-chip-hand">Machine chest press: the wrist fix <span aria-hidden="true">&darr;</span></a>\n';

/** One exact-once source patch; throws, naming it, when the vendored text it expects is not there exactly once. */
export function patchOnce(src, name, from, to) {
  const n = src.split(from).length - 1;
  if (n !== 1) throw new Error(`layers page: patch "${name}" matched ${n} times (the vendored source moved)`);
  return src.replace(from, () => to);
}
const between = (src, name, start, endMark) => {
  const a = src.indexOf(start), b = a < 0 ? -1 : src.indexOf(endMark, a);
  if (a < 0 || b < 0 || src.indexOf(start, a + 1) >= 0) throw new Error(`layers page: patch "${name}" has no single anchor`);
  return src.slice(a, b + endMark.length);
};

/**
 * Validates a spec and returns the per-howto-id plan the patched howto-layers.mjs reads.
 * spec.groups: [{ id, title, ids: [cardId] }]; spec.closeups: { [howtoId]: { legacy: true } | { optionsKey, label? } };
 * spec.optionsUrl: module exporting `CLOSEUP_OPTIONS` (required when any exercise uses the renderer);
 * spec.files: { 'exercises/<id>.mjs': absPath, … } copied into the mirror (a new exercise's plate and howto sources);
 * spec.jump: the header's jump-link line (default golden B's; null drops it); spec.regionFix (default true).
 */
export function planOf(spec) {
  const cards = spec.groups.flatMap(g => g.ids), ids = cards.map(howtoIdOf);
  if (!cards.length) throw new Error('layers page: no exercises');
  if (new Set(cards).size !== cards.length) throw new Error('layers page: an exercise is listed twice');
  const legacy = {}, labels = {}, keys = {};
  for (const id of ids) {
    const c = spec.closeups?.[id];
    if (!c) throw new Error(`layers page: ${id}: no close-up source`);
    if (c.legacy) {
      if (!LEGACY_SCRIPTS[id]) throw new Error(`layers page: ${id}: no frozen golden-B script to fall back to`);
      legacy[id] = LEGACY_SCRIPTS[id]; labels[id] = LEGACY_SCRIPTS[id];
    } else {
      if (!c.optionsKey || !spec.optionsUrl) throw new Error(`layers page: ${id}: renderer close-ups need optionsUrl and optionsKey`);
      keys[id] = c.optionsKey; labels[id] = c.label ?? RENDERER_LABEL;
    }
  }
  return { ids, legacy, labels, keys, optionsUrl: spec.optionsUrl ?? null, regionFix: spec.regionFix !== false };
}

/** The patched howto-layers.mjs source. */
export function patchHowtoLayers(src, plan) {
  src = patchOnce(src, 'HOWTO_IDS', between(src, 'HOWTO_IDS', 'export const HOWTO_IDS = [', '];\n'),
    `export const HOWTO_IDS = ${JSON.stringify(plan.ids)};\n`);
  src = patchOnce(src, 'RENDERER', between(src, 'RENDERER', 'const RENDERER = {', '};\n'),
    `const RENDERER = ${JSON.stringify(plan.labels)};   // LIB-6: the close-up CSS comment label per id\n`
    + `const LEGACY = ${JSON.stringify(plan.legacy)};   // LIB-6: frozen golden-B scripts (plan 2.6 fallback)\n`);
  src = patchOnce(src, 'legacy path', 'const file = join(root, RENDERER[id]), url', 'const file = join(root, LEGACY[id]), url');
  src = patchOnce(src, 'renderer dispatch', '  for (const id of HOWTO_IDS) apis[id] = await loadRenderer(id);',
    `  const __lib = await import(${JSON.stringify(RENDERER_URL)}), __opts = ${plan.optionsUrl ? `(await import(${JSON.stringify(plan.optionsUrl)})).CLOSEUP_OPTIONS` : '{}'};\n`
    + `  const __keys = ${JSON.stringify(plan.keys)};\n`
    + `  if (mods.some(M => (M.default.riskFlags ?? []).includes('back'))) __BACK.backBox = (await import(${JSON.stringify(BACK_BOX_URL)})).backBox;   // LIB-6-PM: D-LIB6PM-ANCHORS\n`
    + `  for (const id of HOWTO_IDS) apis[id] = LEGACY[id] ? await loadRenderer(id)\n`
    + `    : __lib.closeupApi((await import(pathToFileURL(join(root, 'exercises', \`\${id}.howto.mjs\`)).href)), __opts[__keys[id]], { root, specFile: __lib.specFileOf(root, id), engine: await __lib.engineOf(__lib.specFileOf(root, id), { root }) });\n`
    + (plan.regionFix ? `  (await import(${JSON.stringify(REGION_FIX_URL)})).applyRegionFix((await import('../engine/bodymap-parts.mjs')).FRONT_PARTS);\n` : ''));
  // D-LIB5-PAGE, D-LIB6PM-ANCHORS: the back box. RF links a back-flagged row; FLAG's `back` getter reads the box from the
  // holder, which the dispatch above fills only when a sheet on the page is back-flagged (risksSection is synchronous).
  src = patchOnce(src, 'back holder', "import { lintAll, formatViolations, FEEL_ROWS_MAX, SETUP_MAX_STEPS } from './copy-lint.mjs';\n",
    "import { lintAll, formatViolations, FEEL_ROWS_MAX, SETUP_MAX_STEPS } from './copy-lint.mjs';\n"
    + 'const __BACK = {};   // LIB-6-PM: the back box, loaded only for a page with a back-flagged sheet\n');
  src = patchOnce(src, 'RF', "const RF = { true: 'wrist', shoulder: 'shoulder', knee: 'knee', elbow: 'elbow' };",
    "const RF = { true: 'wrist', shoulder: 'shoulder', knee: 'knee', elbow: 'elbow', back: 'back' };");
  src = patchOnce(src, 'FLAG', 'const FLAG = { wrist: RED_FLAG, shoulder: RED_FLAG_SHOULDER, knee: RED_FLAG_KNEE, elbow: RED_FLAG_ELBOW };',
    'const FLAG = { wrist: RED_FLAG, shoulder: RED_FLAG_SHOULDER, knee: RED_FLAG_KNEE, elbow: RED_FLAG_ELBOW, '
    + 'get back() { try { return __BACK.backBox(); } catch (e) { throw new Error(`${howto.id}: ${e.message}`); } } };');
  return src;
}

/** The vendored specExercise head the 'plate engine' patch (D-LIB6PM-PLATE) replaces. */
export const PLATE_ENGINE_ANCHOR = "const specExercise = async id => {\n  const spec = (await import(pathToFileURL(join(root, 'exercises', `${id}.mjs`)).href)).default;\n  const pre = id.replace(/_/g, '-');\n";

/** The patched build-page.mjs source. */
export function patchBuildPage(src, spec) {
  src = patchOnce(src, 'GROUPS', between(src, 'GROUPS', 'const GROUPS = [', '];\n'), `const GROUPS = ${JSON.stringify(spec.groups)};\n`);
  // D-LIB6PM-PLATE: each plate block is drawn by its spec's engine (default the mirror's own layers renderPlate). The inner
  // renderPlate shadows the import in specExercise only; __layersPlate is bound here, outside its declaration's TDZ.
  src = patchOnce(src, 'plate engine', PLATE_ENGINE_ANCHOR,
    `const __lib = await import(${JSON.stringify(RENDERER_URL)}), __layersPlate = renderPlate;   // LIB-6-PM: D-LIB6PM-PLATE\n`
    + PLATE_ENGINE_ANCHOR.replace("  const pre = id.replace(/_/g, '-');\n",
      "  const pre = id.replace(/_/g, '-'), renderPlate = await __lib.plateEngine(id, join(root, 'exercises', `${id}.mjs`), { root, layers: { name: 'layers', renderPlate: __layersPlate } });\n"));
  if (spec.jump !== undefined) src = patchOnce(src, 'jump link', GOLDEN_B_JUMP, spec.jump ?? '');
  return src;
}

const runNode = (cwd, file) => new Promise((resolve, reject) => {
  const c = spawn(process.execPath, [file], { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
  const err = [];
  c.stdout.resume(); c.stderr.on('data', d => err.push(d));
  c.on('error', reject);
  c.on('close', code => (code === 0 ? resolve() : reject(new Error(`${file} exited ${code}: ${Buffer.concat(err).toString().slice(0, 4000)}`))));
});

/** Builds the layers page for `spec`; resolves to its bytes (the page the owner's sheet and CI golden use). */
export async function buildLayersPage(spec) {
  const plan = planOf(spec), mirror = makeMirror();
  try {
    for (const [rel, abs] of Object.entries(spec.files ?? {})) { mkdirSync(dirname(join(mirror, rel)), { recursive: true }); copyFileSync(abs, join(mirror, rel)); }
    const hl = join(mirror, 'artifact', 'howto-layers.mjs'), bp = join(mirror, 'artifact', 'build-page.mjs');
    writeFileSync(hl, patchHowtoLayers(readFileSync(hl, 'utf8'), plan));
    writeFileSync(bp, patchBuildPage(readFileSync(bp, 'utf8'), spec));
    await runNode(mirror, 'artifact/build-page.mjs');
    const page = readFileSync(join(mirror, 'artifact', 'technical-plates.html'));
    return pairRowsOf(spec).length ? Buffer.from(await withPairPanels(page.toString('utf8'), spec)) : page;   // LIB-7b
  } finally { cleanupMirror(mirror); }
}

// ---- LIB-7b (D-LIB7b-SCOPE (a), D-LIB9-HANDPAGE; hands/DESIGN.md §9): library hand blocks from the pair key --------
// A spec row whose closeups entry names `pair` gets the app's shared hand close-up on its page: its hand zx block becomes
// `await pairPanel(key)` byte for byte, each reference to the old block names the panel's id, and the page's style gains
// the pair scope's rules (`.hx-hp-<key> …`) once per key, after the cards' close-up CSS. A post-build step on the built
// page: no vendored text is patched. A spec that names no pair returns the built page untouched.
/** The CSS comment label of a pair scope's close-up rules. */
export const PAIR_LABEL = 'library/hands/pairs.mjs';
/** [{ howtoId, pre, key }] for the spec rows that name a pair. */
export function pairRowsOf(spec) {
  return Object.entries(spec.closeups ?? {}).filter(([, c]) => c.pair !== undefined).map(([howtoId, c]) => {
    if (typeof c.pair !== 'string' || !/^[a-z0-9-]+$/.test(c.pair)) throw new Error(`layers page: ${howtoId}: bad pair key ${c.pair}`);
    return { howtoId, pre: (howtoId === 'dumbbell_lateral_raise' ? 'lateral_raise' : howtoId).replace(/_/g, '-'), key: c.pair };
  });
}
/** The whole element starting at `start` (a `<div`), by balanced div tags (gen/hands.mjs divAt). */
export function divAt(html, start) {
  const re = /<div\b|<\/div>/g;
  re.lastIndex = start;
  let d = 0;
  for (let m; (m = re.exec(html));) { d += m[0] === '</div>' ? -1 : 1; if (!d) return html.slice(start, m.index + 6); }
  throw new Error(`layers page: unclosed div at ${start}`);
}
/** golden B's rendererCss (artifact/howto-layers.mjs:69-96): a close-up sheet's CSS without the shared engine blocks,
 *  the pager's tab state as cleanZoom leaves it, scoped to `scope` (page-level rules and @font-face dropped). */
export async function scopedSheetCss(css, scope) {
  const [{ allThemesCss }, { PLATE_CSS }, { HAND_CSS }, { FEEL_CSS }] = await Promise.all([import('../layers/engine/themes.mjs'),
    import('../layers/engine/index.mjs'), import('../layers/engine/hand.mjs'), import('../layers/engine/feelmap.mjs')]);
  const shared = [readFileSync(join(HERE, '../layers/engine/tokens.css'), 'utf8'), allThemesCss(), PLATE_CSS, HAND_CSS, FEEL_CSS];
  for (const s of shared) css = css.split(s).join('');
  return scopeCss(css.split('.pager-btn[aria-selected="true"]').join('.pager-btn[aria-pressed="true"]'), scope);
}
const splitTop = s => { const out = []; let d = 0, cur = ''; for (const ch of s) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && !d) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out; };
function scopeCss(css, scope) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  let out = '', i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open < 0) break;
    const head = css.slice(i, open).trim();
    let depth = 1, j = open + 1;
    while (depth && j < css.length) { if (css[j] === '{') depth++; else if (css[j] === '}') depth--; j++; }
    const body = css.slice(open + 1, j - 1);
    if (/^@(media|supports)/.test(head)) out += `${head}{${scopeCss(body, scope)}}`;
    else if (/^@keyframes/.test(head)) out += `${head}{${body}}`;
    else if (!head.startsWith('@')) {
      const sels = splitTop(head).map(s => s.trim()).filter(s => s && !/^(html|body|:root)\b/.test(s));
      if (sels.length) out += `${sels.map(s => `${scope} ${s}`).join(',')}{${body.trim()}}\n`;
    }
    i = j;
  }
  return out;
}
/** The pair scope's rules: the sheet CSS the pair pages are drawn and approved in (hands/page.mjs CSS), scoped. */
export const pairCss = async key => scopedSheetCss((await import('./hands/page.mjs')).CSS, `.hx-hp-${key}`);
/** golden B's HOWTO_CSS text (build-page.mjs), which the page's style holds right after the cards' close-up CSS. */
const howtoCssText = () => {
  const src = readFileSync(join(HERE, '../layers/artifact/build-page.mjs'), 'utf8'), a = src.indexOf('const HOWTO_CSS = `'), b = src.indexOf('\n`;', a);
  if (a < 0 || b < 0) throw new Error('layers page: no HOWTO_CSS in build-page.mjs');
  return src.slice(a + 'const HOWTO_CSS = `'.length, b + 1);
};
const once = (html, s, what) => { const a = html.indexOf(s); if (a < 0 || html.indexOf(s, a + 1) >= 0) throw new Error(`layers page: ${what}: ${a < 0 ? 'not found' : 'found twice'}`); return a; };
const idsIn = html => [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
const refsIn = html => [...html.matchAll(/(?:aria-(?:labelledby|describedby|controls)|for)="([^"]+)"|href="#([^"]+)"|url\(['"]?#([^)'"]+)/g)].flatMap(m => (m[1] ? m[1].split(/\s+/) : [m[2] ?? m[3]]));
/** The built page with each pair row's hand block replaced by its pair panel. */
export async function withPairPanels(html, spec, panelOf) {
  panelOf ??= (await import('./hands/pairs.mjs')).pairPanel;
  const rows = pairRowsOf(spec), done = new Set();
  for (const { howtoId, pre, key } of rows) {
    const old = divAt(html, once(html, `<div class="zx" id="${pre}-zoom-hand" data-zoom="hand"`, `${howtoId}: hand close-up`));
    const panel = await panelOf(key), zid = `hp-${key}-zoom-hand`;
    if (!panel.startsWith(`<div class="zx" id="${zid}" data-zoom="hand"`) || divAt(panel, 0) !== panel) throw new Error(`layers page: ${howtoId}: pairPanel(${key}) is not one zx panel`);
    html = html.replace(old, () => panel).split(`aria-controls="${pre}-zoom-hand"`).join(`aria-controls="${zid}"`);
    const gone = new Set(idsIn(old)), left = refsIn(html).filter(r => gone.has(r) && !idsIn(panel).includes(r));
    if (left.length || html.includes(`${pre}-zoom-hand`)) throw new Error(`layers page: ${howtoId}: references to the old hand block left: ${[...new Set(left)]}`);
    done.add(key);
  }
  const at = once(html, howtoCssText(), 'HOWTO_CSS') - 1;
  if (html[at] !== '\n') throw new Error('layers page: HOWTO_CSS does not follow the close-up CSS');
  let css = '';
  for (const k of done) css += `\n/* close-ups: ${PAIR_LABEL} hp-${k} */\n${await pairCss(k)}`;
  return html.slice(0, at) + css + html.slice(at);
}
