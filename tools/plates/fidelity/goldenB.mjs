// HT-4 (HT4-A6, critic fix 20): the golden-B page state driver. Layer cards (HT-5..HT-9) call this instead of
// writing their own Playwright; it never touches app code, only the built golden-B page (a Playwright reference for
// "does the app's rendering of this state match golden B", never the app itself).
//
// Refactored from the vendored, already-proven `tools/plates/layers/artifact/shoot2.mjs` (the S-2 state check) into
// reusable functions. A selector that matches nothing throws, naming the state - it never returns an empty capture
// (a card comparing an empty capture against another empty capture would read "0 px difference" for the wrong
// reason, the exact bug a fresh reviewer caught in V1-08, see builder gotchas).
import { createRequire } from 'node:module';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildLayerPage, cleanupMirror, makeMirror } from '../layers.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..', '..');
const require = createRequire(join(ROOT, 'package.json'));

export const CHROME_PATH = '/opt/pw-browsers/chromium';
export const IDS = ['lateral-raise', 'barbell-back-squat', 'pull-up', 'hanging-leg-raise', 'lat-pulldown', 'seated-cable-row', 'leg-press', 'machine-chest-press'];
export const THEMES = ['silent-black', 'paper', 'midnight', 'ember', 'emerald'];
/** Joint red-flag blocks each card must show (golden-B review 2026-09-30). */
export const FLAGS = {
  'lateral-raise': ['wrist', 'shoulder'], 'barbell-back-squat': ['wrist', 'knee'], 'pull-up': ['wrist', 'shoulder', 'elbow'],
  'hanging-leg-raise': ['wrist'], 'lat-pulldown': ['wrist', 'shoulder'], 'seated-cable-row': ['wrist', 'shoulder'],
  'leg-press': ['wrist', 'knee'], 'machine-chest-press': ['wrist', 'elbow'],
};

const WOFF2 = () => readFileSync(join(ROOT, 'tools/plates/layers/engine/inter-latin-wght-normal.woff2'));

/** Builds the golden-B page fresh (from the vendored, hash-locked layers) into a scratch dir; returns its path. */
export async function buildScratchPage() {
  const mirror = makeMirror();
  const html = await buildLayerPage(mirror);
  cleanupMirror(mirror);
  const dir = mkdtempSync(join(tmpdir(), 'ht4-goldenb-page-'));
  const wrap = join(dir, 'page.html');
  writeFileSync(wrap, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>${html.toString('utf8')}</body></html>`);
  return { dir, file: wrap };
}
export function cleanupScratchPage(dir) { rmSync(dir, { recursive: true, force: true }); }

/**
 * Opens the golden-B page in a fresh context at the app's phone viewport, on the given theme.
 * `reduce`: `data-motion="reduce"` (reduced motion). Returns { browser, ctx, page, errs }; caller closes `browser`.
 */
export async function openPage(pageFile, theme, { reduce = false, chromePath = CHROME_PATH } = {}) {
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ executablePath: chromePath });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: 'dark', reducedMotion: reduce ? 'reduce' : 'no-preference' });
  const woff2 = WOFF2();
  await ctx.route('**/*', r => {
    const u = r.request().url();
    if (u.startsWith('https://fonts.googleapis.com/')) return r.fulfill({ status: 200, contentType: 'text/css', body: "@font-face{font-family:'Inter';font-weight:100 900;font-display:block;src:url(https://fonts.gstatic.com/local/inter.woff2) format('woff2')}" });
    if (u === 'https://fonts.gstatic.com/local/inter.woff2') return r.fulfill({ status: 200, contentType: 'font/woff2', body: woff2 });
    return u.startsWith('file:') ? r.continue() : r.abort();
  });
  const page = await ctx.newPage(), errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(pageFile).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  if (theme) await page.evaluate(t => document.querySelector(`#theme-${t}`).click(), theme);
  return { browser, ctx, page, errs };
}

const clickSel = (page, sel) => page.evaluate(s => {
  const e = document.querySelector(s);
  if (!e) throw new Error(`selector matches nothing: ${s}`);
  e.click();
}, sel);

/** Fonts settled, animations quiet (or timed out at 2s - the shimmer only ever runs 2 passes, C12). */
const settle = page => page.evaluate(() => new Promise(r => {
  const t0 = performance.now();
  const f = () => (!document.getAnimations().some(a => a.playState === 'running') || performance.now() - t0 > 2000) ? r() : requestAnimationFrame(f);
  f();
}));

/**
 * Captures one named state: asserts the selector matches something visible, non-empty, inside the 390 px sheet,
 * then screenshots it. Throws, naming `state`, on a selector match failure - never returns an empty buffer.
 */
export async function capture(page, sel, state) {
  const problem = await page.evaluate(([sel, state]) => {
    const e = document.querySelector(sel);
    if (!e) return `${state}: selector matches nothing (${sel})`;
    const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    if (!r.width || !r.height || cs.display === 'none' || cs.visibility === 'hidden') return `${state}: not visible (${sel})`;
    if (r.left < -0.5 || r.right > innerWidth + 0.5) return `${state}: outside the 390px sheet (${sel})`;
    return null;
  }, [sel, state]);
  if (problem) throw new Error(problem);
  const el = page.locator(sel).first();
  await el.scrollIntoViewIfNeeded();
  await settle(page);
  return el.screenshot({ animations: 'allow' });
}

/** S2: opens the hand or a posture zoom by its chip key. */
export async function openZoom(page, id, key) {
  await clickSel(page, `#card-${id} .zx-chip[data-zoom="${key}"]`);
  await settle(page);
}
export async function closeZoom(page, id, key) {
  await clickSel(page, `#${id}-zoom-${key}-close`);
  await settle(page);
}
/** Handling-mistake row (the Mistake pill on the plate). */
export async function openMistake(page, id) { await clickSel(page, `#${id}-mistake`); await settle(page); }
/** Feel map at rest, playing (a frame mid-sweep), each row open. */
export async function playFeel(page, id) {
  await page.evaluate(sel => document.querySelector(sel).scrollIntoView({ block: 'center' }), `#card-${id} [data-feel-map]`);
  await page.waitForTimeout(700);
  await clickSel(page, `#card-${id} [data-feel-map]`);
  await page.waitForTimeout(1400);
}
/**
 * Opens one feel row. Compact-copy update (b3a90af): every feel row now shows (the visible count equals
 * FEEL_ROWS_MAX), so no ".fr-more" button exists on any of the 8 sheets - asserted here rather than silently
 * skipped, so a future content change that brings the button back is caught, not quietly worked around.
 */
export async function openFeelRow(page, id, row) {
  const more = await page.$(`#card-${id} .fr-more`);
  if (more) throw new Error(`${id}: ".fr-more" exists - every feel row should already show (compact-copy update)`);
  await clickSel(page, `#${id}-row-${row}`);
  await page.waitForTimeout(40);
}
/**
 * Asserts every setup step already shows. Compact-copy update (b3a90af): the visible count equals SETUP_MAX_STEPS,
 * so no ".st-more" button exists - the collapse code stays for a longer list, which the lint now forbids.
 */
export async function assertAllSetupStepsShown(page, id) {
  const more = await page.$(`#card-${id} .st-more`);
  if (more) throw new Error(`${id}: ".st-more" exists - every setup step should already show (compact-copy update)`);
  const hidden = await page.evaluate(c => document.querySelectorAll(`${c} .st-list li[hidden]`).length, `#card-${id}`);
  if (hidden) throw new Error(`${id}: ${hidden} setup step(s) still hidden`);
}
export async function expandSources(page, id) {
  await page.evaluate(sel => { document.querySelector(sel).open = true; }, `#card-${id} .srcs`);
}

/**
 * Every state the layer cards compare, for one exercise: hand zoom per key, posture zoom per chip, handling
 * mistake, feel map (rest, playing, each row open, reduced motion is driven by the caller's theme choice), setup
 * collapsed/expanded, sources collapsed/expanded, risks. Returns [{ name, selector }].
 */
export async function statesFor(page, id) {
  const card = `#card-${id}`;
  const zoomKeys = await page.evaluate(c => [...document.querySelectorAll(`${c} .zx-chip[data-zoom]`)].map(b => b.dataset.zoom), card);
  const rows = await page.evaluate(c => [...document.querySelectorAll(`${c} .fr`)].map(r => r.dataset.row), card);
  const states = [
    { name: `${id}: chips`, selector: `${card} .zx-chips-wrap` },
    { name: `${id}: grip + handling mistakes`, selector: `${card} .grip` },
    { name: `${id}: feel at rest`, selector: `${card} .feel` },
    { name: `${id}: setup`, selector: `${card} .setup` },
    { name: `${id}: risks`, selector: `${card} .risks` },
    { name: `${id}: sources`, selector: `${card} .srcs` },
  ];
  for (const z of zoomKeys) states.push({ name: `${id}: zoom ${z}`, selector: `#${id}-zoom-${z}`, open: () => openZoom(page, id, z), close: () => closeZoom(page, id, z) });
  for (const r of rows) states.push({ name: `${id}: feel row ${r}`, selector: `${card} .feel` });
  return states;
}

/**
 * Self-check (HT4-A6): captures every state of `id` twice back to back and asserts 0 px difference between the two
 * captures (proves `capture` is deterministic and never silently returns an empty/blank buffer for two different
 * states). Forces reduced motion first, so a still-running shimmer (C12: up to ~5.5 s) can never make two otherwise
 * identical captures differ by animation phase alone - that is a timing question for the gate's own animation
 * probes, not this driver's determinism. Returns the list of state names that failed (empty = clean).
 */
export async function selfCheck(page, id) {
  await page.evaluate(() => { document.documentElement.dataset.motion = 'reduce'; });
  const bad = [];
  const states = await statesFor(page, id);
  for (const s of states) {
    if (s.open) await s.open();
    const a = await capture(page, s.selector, s.name);
    const b = await capture(page, s.selector, s.name);
    if (!a.equals(b)) bad.push(s.name);
    if (s.close) await s.close();
  }
  return bad;
}
