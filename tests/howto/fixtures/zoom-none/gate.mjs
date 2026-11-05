// F-ZOOM-NONE A1 (#388, PLAN RULED): a zero-zoom sheet on screen, through the LIB-SHAPES test-only route swap
// (tests/howto/fixtures/lib-shapes/gate.mjs): the built ht-leg-press chunk is served as a wrapper that edits its content
// object in memory with fixture.mjs's zeroZoomOf. Nothing in src/ or www/ changes. Fails closed: the swap must run once
// per theme, the sheet must lose its posture chips and close-ups, and no posture-leg-press chunk may be requested.
import { join } from 'node:path';
import { zeroZoomOf } from './fixture.mjs';
import { wrapperOf as shapesWrapperOf } from '../lib-shapes/gate.mjs';

const ORIG = 'zoom-none-orig';
export const ROW = { id: 'lib_leg_press', pre: 'leg-press', chunk: 'ht-leg-press-', posture: ['back-on-pad', 'foot'], chips: ['hand', 'feel'], feelLinks: 2 };
/** The feel chunk is cut from the row's page, so a zero-zoom row's page gives Feel no posture link: the built leg press
 *  feel chunk loses its "Show me" buttons to the dropped zooms (exactly `feelLinks` of them, else the swap throws). */
export function feelWithout(text, keys, want) {
  const re = new RegExp(`<button[^<>]*class="fr-show"[^<>]*data-zoom="(?:${keys.join('|')})"[^<>]*>[\\s\\S]*?<\\/button>`, 'g'), n = text.match(re)?.length ?? 0;
  if (n !== want) throw new Error(`zoom-none gate: ${n} feel links to the dropped zooms (want ${want})`);
  return text.replace(re, '');
}
export const THEMES = ['silent-black', 'paper'];

/** LIB-SHAPES's wrapper with zeroZoomOf as the edit (its anchors and fail-closed checks unchanged). */
export function wrapperOf(orig, origUrl, id) {
  const w = shapesWrapperOf(orig, origUrl, id, 'none');
  const a = w.indexOf('const shapeOf = '), b = w.indexOf('\nconst hits = ');
  if (a < 0 || b < a) throw new Error('zoom-none gate: LIB-SHAPES wrapper anchors moved');
  return (w.slice(0, a) + `const shapeOf = ${zeroZoomOf.toString()};` + w.slice(b))
    .replace('globalThis.__libShapes', 'globalThis.__zoomNone').replace('globalThis.__libShapes', 'globalThis.__zoomNone').replace("'LIB-SHAPES: ", "'F-ZOOM-NONE: ");
}

/** Runs the block: the row x both themes at 390 px. `P` records a problem; returns the screenshot count. */
export async function zoomNoneGate({ browser, port, OUT, P, H, writeFileSync }) {
  let shots = 0;
  for (const theme of THEMES) {
    const noSw = { newContext: o => browser.newContext({ ...o, serviceWorkers: 'block' }) };
    const { ctx, page } = await H.openAppTrain(noSw, port, theme, { onError: m => P(`${theme}: page error: ${m}`) });
    let hits = 0;
    const postureReqs = [];
    try {
      page.on('request', r => { if (/\/assets\/posture-leg-press-/.test(r.url())) postureReqs.push(r.url()); });
      await ctx.route(/\/assets\/ht-leg-press-[\w-]+\.js(\?.*)?$/, async route => {
        const url = route.request().url();
        if (url.includes(ORIG)) return route.continue();
        try {
          hits++;
          const res = await route.fetch();
          await route.fulfill({ status: 200, contentType: 'text/javascript', body: wrapperOf(await res.text(), `${url}${url.includes('?') ? '&' : '?'}${ORIG}`, ROW.id) });
        } catch (e) { P(`${theme}: route swap: ${e.message}`); await route.abort(); }
      });
      let feelHits = 0;
      await ctx.route(/\/assets\/feel-leg-press-[\w-]+\.js(\?.*)?$/, async route => {
        try { feelHits++; const res = await route.fetch(); await route.fulfill({ status: 200, contentType: 'text/javascript', body: feelWithout(await res.text(), ROW.posture, ROW.feelLinks) }); }
        catch (e) { P(`${theme}: feel route swap: ${e.message}`); await route.abort(); }
      });
      const idx = H.HT_ORDER.indexOf(ROW.id);
      if (idx < 0) { P(`${theme}: ${ROW.id} not in the seeded split`); continue; }
      await H.openHowTo(page, idx);
      await page.evaluate(() => { const p = document.querySelector('dialog.sheet.ht .sheet-panel'); p.scrollTop = p.scrollHeight; });
      await page.locator(`dialog.sheet.ht #${ROW.pre}-feel`).waitFor({ state: 'attached', timeout: 8000 }).catch(() => P(`${theme}: the feel section never mounted`));
      await H.settleApp(page);
      const r = await page.evaluate(({ pre, posture }) => {
        const d = document.querySelector('dialog.sheet.ht'), panel = d.querySelector('.sheet-panel');
        const visible = e => { const b = e.getBoundingClientRect(), cs = getComputedStyle(e); return b.width > 0 && b.height > 0 && cs.visibility !== 'hidden' && !e.closest('[hidden]'); };
        const small = [...d.querySelectorAll('[data-section] button, [data-section] a[href]')].filter(visible)
          .map(e => { const b = e.getBoundingClientRect(); return { t: (e.id || e.textContent.trim()).slice(0, 40), w: Math.round(b.width * 10) / 10, h: Math.round(b.height * 10) / 10 }; })
          .filter(x => x.w < 44 || x.h < 44);
        return {
          swapped: globalThis.__zoomNone ?? [],
          chips: [...d.querySelectorAll('.ht-look .zx-chip')].map(b => b.id.slice(`${pre}-chip-`.length)),
          postureRefs: posture.flatMap(k => [...d.querySelectorAll(`#${pre}-chip-${k}, #${pre}-zoom-${k}, [data-zoom="${k}"]`)].map(e => `${k}: <${e.tagName.toLowerCase()} id=${e.id} class=${e.className}>`)),
          feelChip: !!d.querySelector(`#${pre}-chip-feel`),
          small,
          overflow: [document.scrollingElement.scrollWidth - innerWidth, panel.scrollWidth - panel.clientWidth,
            ...[...d.querySelectorAll('[data-section]')].map(e => Math.round(e.getBoundingClientRect().right - panel.getBoundingClientRect().right))].filter(v => v > 0),
        };
      }, { pre: ROW.pre, posture: ROW.posture });
      const T = `${theme} ${ROW.id} (zero posture zooms)`;
      if (!r.swapped.includes(ROW.id)) P(`${T}: the fixture swap did not run (the sheet is the shipped one)`);
      if (r.postureRefs.length) P(`${T}: posture chip, close-up or link on the sheet: ${r.postureRefs.join(', ')}`);
      if (!r.feelChip) P(`${T}: no Feel chip`);
      if (JSON.stringify(r.chips) !== JSON.stringify(ROW.chips)) P(`${T}: chips ${r.chips.join(', ')}, want ${ROW.chips.join(', ')}`);
      if (r.small.length) P(`${T}: tap targets under 44 px: ${r.small.map(x => `${x.t} ${x.w}x${x.h}`).join(', ')}`);
      if (r.overflow.length) P(`${T}: horizontal overflow ${r.overflow.join(', ')} px`);
      if (postureReqs.length) P(`${T}: a posture chunk was requested: ${postureReqs[0]}`);
      await page.locator('dialog.sheet.ht .sheet-panel').evaluate(p => { p.scrollTop = 0; });
      await H.settleApp(page);
      writeFileSync(join(OUT, `zoom-none-${theme}.png`), await page.screenshot({ animations: 'disabled', caret: 'hide' }));
      shots++;
      await H.closeHowTo(page);
      if (hits !== 1) P(`${theme}: the chunk route was hit ${hits} times (want 1)`);
      if (feelHits !== 1) P(`${theme}: the feel chunk route was hit ${feelHits} times (want 1)`);
    } finally { await ctx.close(); }
  }
  return shots;
}
