// LIB-7-FIX (hands/DESIGN.md §8): the exercise-neutral pair panel, the `<div class="zx"` block main's
// tools/plates/gen/handpairs.mjs writes into src/howto/generated/handpair-<key>.ts. Its markup is golden B's close-up
// panel as artifact/howto-layers.mjs:162-171 builds it (and cleanZoom tidies it, :140-157), with every id keyed by the pair
// key (`hp-<key>-`) instead of a card, and its words from words/chrome.json and words/<key>.json (one file per key,
// D-LIB7FIX-PERKEY), each with its approved source. The SVGs are
// pairs.mjs renderPair's, byte for byte (D-LIB7FIX-CARRY). No chromeId, card id, lib id or exercise name.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CAPTION_MAX_WORDS, words } from '../../layers/artifact/copy-lint.mjs';
import { captions, esc, pagerOf } from '../render/closeup/common.mjs';
import { splitHalves } from '../../layers/artifact/howto-layers.mjs';   // LIB-7b: D-LIB7b-HALVES

// D-LIB7FIX-PERKEY: a new key adds its own words file and edits no shared one (panel.mjs cannot import pairs.mjs, which imports it)
export const WORDS_DIR = 'tools/plates/library/hands/words';
export const CHROME_WORDS = `${WORDS_DIR}/chrome.json`;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../../..');
const readJson = p => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));
/** The words file of one pair key. */
export function wordsFileOf(key) {
  if (!/^[a-z0-9-]+$/.test(key)) throw new Error(`hand panel ${key}: not a pair key`);
  return `${WORDS_DIR}/${key}.json`;
}
/** { chrome, keys: { [key]: words } } from words/chrome.json and words/<key>.json. */
export function readWords(key) {
  const f = wordsFileOf(key);
  if (!existsSync(join(ROOT, f))) throw new Error(`hand panel ${key}: no words in ${f}`);
  return { chrome: readJson(CHROME_WORDS).chrome, keys: { [key]: readJson(f) } };
}
/** Every key's words, for tests and sweeps only (a panel reads its own key's file). */
export function allWords() {
  const keys = readdirSync(join(ROOT, WORDS_DIR)).filter(n => n.endsWith('.json') && n !== 'chrome.json').sort().map(n => n.slice(0, -5));
  return { ...readJson(CHROME_WORDS), keys: Object.fromEntries(keys.map(k => [k, readJson(wordsFileOf(k))])) };
}
// golden B's close icon, I.x(18) (howto-layers.mjs:99-101)
const X18 = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.00" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

/** One word entry: { text, source }; throws without both, or for a caption over golden B's CAPTION_MAX_WORDS. */
function word(key, path, w, caption = false) {
  if (typeof w?.text !== 'string' || !w.text.trim() || typeof w.source !== 'string' || !w.source.trim()) throw new Error(`hand panel ${key}: ${path} has no approved text and source`);
  if (caption && words(w.text) > CAPTION_MAX_WORDS) throw new Error(`hand panel ${key}: ${path} has ${words(w.text)} words (max ${CAPTION_MAX_WORDS})`);
  return w.text;
}

/** The words of one key: heading, and per fault the Right and Wrong captions and the pager label. */
export function wordsOf(key, faults, all = readWords(key)) {
  const k = all.keys?.[key];
  if (!k) throw new Error(`hand panel ${key}: no words in ${wordsFileOf(key)}`);
  const extra = Object.keys(k.faults ?? {}).filter(f => !faults.includes(f));
  if (extra.length) throw new Error(`hand panel ${key}: words for faults it does not draw: ${extra}`);
  return {
    heading: word(key, 'heading', k.heading),
    faults: Object.fromEntries(faults.map(f => [f, { right: word(key, `${f}.right`, k.faults?.[f]?.right, true), wrong: word(key, `${f}.wrong`, k.faults?.[f]?.wrong, true),
      pager: word(key, `${f}.pager`, k.faults?.[f]?.pager) }])),
  };
}

/** The panel. pages: [{ fault, svg }] in the key's fault order; svg drawn with the uid `hp-<key>-<fault>`. */
export function panelHtml(key, pages, all = readWords(key)) {
  const w = wordsOf(key, pages.map(p => p.fault), all), pre = `hp-${key}`, zid = `${pre}-zoom-hand`;
  const pager = pages.length > 1 ? pagerOf(pages.map(p => ({ key: p.fault, label: w.faults[p.fault].pager }))) : null;
  const body = pages.map((p, i) => {
    // the pager as cleanZoom leaves it (howto-layers.mjs:148-153): a group of toggle buttons with ids and data hooks
    let k = 0;
    const pg = pager ? pager(p.fault).replace('<div class="pager" role="tablist"', '<div class="pager" role="group"')
      .replace(/<button class="pager-btn" role="tab" aria-selected=/g, () => `<button type="button" class="pager-btn" data-page="${k}" id="${pre}-zb-p${i}-tab${k++}" aria-pressed=`) : '';
    return `<div class="zx-page" data-page="${i}"${i ? ' hidden' : ''}><section class="zoom"><div class="hand-plate">${p.svg}</div>${captions(w.faults[p.fault])}${pg}</section></div>`;
  }).join('');
  // LIB-7b (D-LIB7b-HALVES): golden B's TalkBack halves, as cleanZoom gives every card's close-up (attribute-only)
  return splitHalves(`<div class="zx" id="${zid}" data-zoom="hand" role="region" aria-labelledby="${zid}-h" hidden>`
    + `<div class="zx-top"><h4 class="zx-h" id="${zid}-h" tabindex="-1">${esc(w.heading)}</h4>`
    + `<button type="button" class="zx-close" id="${zid}-close" aria-label="${esc(all.chrome.close.text)}">${X18}</button></div>`
    + `<div class="hx hx-${pre}">${body}</div></div>`, `hand panel ${key}`);
}
