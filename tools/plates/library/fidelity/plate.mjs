// LIB-4b: the plate block per id (L2b, F3, L3, L4; HT3-A6), re-implemented from harness.mjs ht3Fidelity (pinned by
// B3: twins.mjs HARNESS_PINS) with one row per (id, theme, state). Same contexts, same order of taps, same compare
// rules; the golden page is the id's plates page (pages[id].plates), the app is seeded with the run's own order.
// One job is one id in one theme: its 390 matrix, then (HT_FULL) 360 and 340.
import {
  DEVICE, G, TALL_H, HT_FULL, appOffset, blockMarkup, capture, closeHowTo, diffPng, hideSections, l2bCompare, l2bWalk,
  meetsRule, openAppTrain, openGolden, openHowTo, ownLayers, presentGolden, region, sectionWidthProblems, settle, settleApp,
  unpresentGolden,
} from '../../fidelity/harness.mjs';
import { NARROW, WIDTH } from './tuples.mjs';
import { stateOf } from './rows.mjs';

const TEXT_PROPS = ['font-family', 'font-size', 'font-weight', 'font-style', 'letter-spacing', 'line-height', 'text-transform', 'color', 'display', 'margin-bottom'];
const frames2 = page => page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
const animList = (page, figSel) => page.evaluate(sel => {
  const fig = document.querySelector(sel);
  const path = el => { const p = []; for (let e = el; e && e !== fig; e = e.parentElement) p.unshift([...e.parentElement.children].indexOf(e)); return p.join('.'); };
  return fig.getAnimations({ subtree: true }).map(a => ({ target: path(a.effect.target), name: a.animationName, keyframes: a.effect.getKeyframes(), timing: a.effect.getTiming() }))
    .sort((x, y) => (x.target + x.name).localeCompare(y.target + y.name));
}, figSel);
const freezeAt = (page, figSel, t) => page.evaluate(([sel, t]) => {
  const as = document.querySelector(sel).getAnimations({ subtree: true });
  const saved = new Map();
  for (const a of as) if (!saved.has(a.effect.target)) saved.set(a.effect.target, a.effect.target.getAttribute('style'));
  window.__ht3Saved = saved;
  if (t != null) for (const a of as) { a.pause(); a.currentTime = t; a.commitStyles(); }
  for (const a of as) a.cancel();
  return as.length;
}, [figSel, t]);
const unfreeze = (page, figSel, id) => page.evaluate(([sel, id]) => {
  for (const [el, st] of window.__ht3Saved ?? []) { if (st == null) el.removeAttribute('style'); else el.setAttribute('style', st); }
  window.__ht3Saved = null;
  document.querySelector(sel).classList.remove('tracing');
  document.getElementById(`${id}-trace`).setAttribute('aria-pressed', 'false');
}, [figSel, id]);
const click = (page, sel) => page.evaluate(s => { const b = document.querySelector(s); if (!b) throw new Error(`no ${s}`); b.click(); }, sel);
/** ht3Fidelity's capture label -> the row's sub-state. */
export const subOf = label => label.replace('M:after-hide-restore', 'M:restore').replace(/^T@(\d+)$/, 'T$1').replace('R:end', 'R-end');

/**
 * One id in one theme. `R`: the recorder; `lib`: the library id (the rows' id); `chrome`: its chrome id; `index`: its
 * card index in `order`; `html`: its plates page. `markup: false` and `widths: []` and `full: false` give HT10-A2's and
 * HT-6 A6's / HT-9 A5's narrower compare; `as`: the one state every check of the job goes to (e.g. HT6/A6@390).
 */
export async function plateJob(browser, port, R, { lib, chrome, index, theme, html, order, custom, full = HT_FULL.includes(theme), widths = full ? NARROW : [], mutate = null, markup: markupAll = true, as = null, stats, shift = 0 }) {
  const at = (check, label, w) => as ?? stateOf(check, subOf(label), w);
  let cur = null;
  const fail = (state, m) => R.fail(lib, theme, state, m);
  const app = await openAppTrain(browser, port, theme, { order, custom, onError: m => fail(cur ?? at('L3', 'N', WIDTH), `app page error: ${m}`) });
  let gold = await openGolden(browser, theme, { html, onError: m => fail(cur ?? at('L3', 'N', WIDTH), `golden page error: ${m}`) });
  const figSel = { app: 'dialog.sheet.ht .ht-golden figure[data-mode="normal"]', golden: `#card-${chrome} .plate[data-mode="normal"]` };
  let width = DEVICE.viewport.width, withM = false;
  const both = async fn => { await Promise.all([fn(app.page, 'app'), fn(gold.page, 'golden')]); };
  const check = async (label, { markup = markupAll } = {}) => {
    const L2b = at('L2b', label, width), F3 = at('F3', label, width), L3 = at('L3', label, width);
    cur = L3;
    await settleApp(app.page);
    const secBefore = await hideSections(app.page, true);
    if (markup) {
      await unpresentGolden(gold.page);
      const [ga, aa] = await Promise.all([blockMarkup(gold.page, 'golden', chrome, withM), blockMarkup(app.page, 'app', chrome)]);
      stats.f3++;
      if (ga !== aa) { let i = 0; while (ga[i] === aa[i]) i++; fail(F3, `the block markup differs at char ${i}: app …${aa.slice(i - 40, i + 80)}… golden …${ga.slice(i - 40, i + 80)}…`); } else R.ok(lib, theme, F3);
      const [gw, aw] = await Promise.all([l2bWalk(gold.page, G.golden(chrome), 'golden', withM), l2bWalk(app.page, G.app(chrome), 'app')]);
      stats.l2b++;
      R.check(lib, theme, L2b, l2bCompare(gw, aw, `${chrome} ${label} L2b`));
    }
    const fits = async () => { try { await region(app.page, G.app(chrome), 'app'); return true; } catch { return false; } };
    const scrolls = () => app.page.evaluate(() => { const p = document.querySelector('dialog.sheet.ht .sheet-panel'); return p.scrollHeight > p.clientHeight; });
    let tall = false;
    if ((await scrolls()) || !(await fits())) {
      tall = true; stats.tall.push(`${theme}/${chrome}/${label}@${width}`);
      await Promise.all([app.page.setViewportSize({ width, height: TALL_H }), gold.page.setViewportSize({ width, height: TALL_H })]);
      await settleApp(app.page);
      if ((await scrolls()) || !(await fits())) fail(L3, `the sheet still scrolls or the region does not fit at ${width}x${TALL_H}`);
    }
    const own = await ownLayers(app.page, 'app', chrome, true, true);
    const ao = await appOffset(app.page);
    own.push(...await presentGolden(gold.page, chrome, ao));
    stats.ownLayers += own.length ? 0 : 1;
    for (const b of own) fail(L3, b);
    const [ra, rg] = await Promise.all([region(app.page, G.app(chrome), 'app'), region(gold.page, G.golden(chrome), 'golden')]);
    const exp = width === 390 ? 358 : null;
    if (ra.blockWidth !== rg.blockWidth || ra.fitWidth !== rg.fitWidth || ra.width !== rg.width || ra.height !== rg.height || ra.zoom !== rg.zoom || (exp && (ra.fitWidth !== exp || ra.zoom !== '1')))
      fail(L3, `widths differ: app .ht-golden ${ra.blockWidth} / .ht-plate-fit ${ra.fitWidth} (zoom ${ra.zoom}), region ${ra.width}x${ra.height}; golden card content ${rg.blockWidth} / .plate-fit ${rg.fitWidth} (zoom ${rg.zoom}), region ${rg.width}x${rg.height}`);
    else {
      const [a, g] = await Promise.all([capture(app.page, ra, shift), capture(gold.page, rg)]);   // shift: B2's 1 px fixture only
      const d = await diffPng(gold.page, a, g);
      stats.pairs++; stats.offMax = Math.max(stats.offMax, d.off); stats.off1Max = Math.max(stats.off1Max, d.off1);
      R.px(lib, theme, L3, d.off);
      if (d.ink < 0.05) fail(L3, `the capture is nearly blank (ink ${(d.ink * 100).toFixed(1)} %)`);
      if (!meetsRule(d)) fail(L3, `${d.off} px off (max ${d.maxDelta}/255, ${d.off1} off by 1, of ${d.total})${tall ? ` at ${width}x${TALL_H}` : ''}`);
      else R.ok(lib, theme, L3);
    }
    await ownLayers(app.page, 'app', chrome, false);
    const secAfter = await hideSections(app.page, false);
    if (secAfter !== secBefore) fail(L3, `${secBefore} sections were displayed before the capture, ${secAfter} after (not restored)`);
    if (tall) { await Promise.all([app.page.setViewportSize({ width, height: 844 }), gold.page.setViewportSize({ width, height: 844 })]); await settleApp(app.page); }
    cur = null;
  };
  const keys = mode => app.page.$$eval(`dialog.sheet.ht .ht-golden figure[data-mode="${mode}"] .plate-callout`, bs => bs.map(b => b.dataset.key));
  try {
    for (const w of [WIDTH, ...widths]) {
      width = w;
      if (w !== WIDTH) {
        await app.page.setViewportSize({ width: w, height: 844 });
        await gold.ctx.close();
        gold = await openGolden(browser, theme, { viewport: { width: w, height: 844 }, html, onError: m => fail(cur ?? at('L3', 'N', w), `golden page error: ${m}`) });
      }
      await openHowTo(app.page, index);
      withM = false;
      if (mutate) await app.page.evaluate(mutate, chrome);
      R.check(lib, theme, at('L2b', 'sections', w), await sectionWidthProblems(app.page, gold.page, chrome));
      if (w === WIDTH) {
        const txt = await Promise.all([
          app.page.$$eval('dialog.sheet.ht .sheet-head h2, dialog.sheet.ht .sheet-eyebrow', (els, props) => els.map(e => props.map(p => getComputedStyle(e).getPropertyValue(p))), TEXT_PROPS),
          gold.page.$$eval(`#card-${chrome} h3, #card-${chrome} .sheet-eyebrow`, (els, props) => els.map(e => props.map(p => getComputedStyle(e).getPropertyValue(p))), TEXT_PROPS),
        ]);
        const title = at('L2b', 'title', WIDTH);
        if (txt[0].length !== 2 || JSON.stringify(txt[0]) !== JSON.stringify(txt[1])) fail(title, `title/eyebrow text styles: app ${JSON.stringify(txt[0])} vs golden ${JSON.stringify(txt[1])}`);
        else R.ok(lib, theme, title);
      }
      await check('N');
      const deep = full && w === WIDTH;
      if (deep) {
        const nk = await keys('normal');
        for (const k of nk.slice(1)) { await both(p => click(p, `#${chrome}-n-${k}`)); await check(`N:${k}`); }
        await both(p => click(p, `#${chrome}-n-${nk[0]}`));
      }
      await both(p => click(p, `#${chrome}-mistake`)); withM = true;
      await check('M');
      if (deep) {
        const tk = await keys('mistake');
        for (const k of tk.slice(1)) { await both(p => click(p, `#${chrome}-m-${k}`)); await check(`M:${k}`); }
        const r = await app.page.evaluate(() => {
          const g = document.querySelector('dialog.sheet.ht .ht-golden'), api = g.htPlateApi, fit = g.querySelector('.ht-plate-fit');
          const s = api.snapshot(); api.setPlateHidden(true);
          const hid = fit.hidden && fit.inert && !api.slot.hidden && api.slot === g.querySelector('.ht-zoom-slot');
          api.clearMistake(); const cleared = api.snapshot(); api.setPlateHidden(false); api.restore(s);
          return { s, hid, cleared, back: api.snapshot(), shown: !fit.hidden && !fit.inert && api.slot.hidden, keys: Object.keys(g).includes('htPlateApi') };
        });
        const api = at('L3', 'slot-api', WIDTH);
        if (!r.hid || !r.shown || r.keys || JSON.stringify(r.back) !== JSON.stringify(r.s) || r.cleared.mode !== 'normal') fail(api, `A6 zoom slot API: ${JSON.stringify(r)}`);
        else R.ok(lib, theme, api);
        await check('M:after-hide-restore');
      }
      await both(p => click(p, `#${chrome}-mistake`)); withM = true;
      if (w === WIDTH) {
        const L4 = s => at('L4', s, WIDTH);
        await both(p => click(p, `#${chrome}-trace`));
        const [la, lg] = await Promise.all([animList(app.page, figSel.app), animList(gold.page, figSel.golden)]);
        stats.anims++;
        if (!la.length || JSON.stringify(la) !== JSON.stringify(lg)) fail(L4('anims'), `the Trace animations differ (app ${la.length}, golden ${lg.length}): ${JSON.stringify(la).slice(0, 300)} vs ${JSON.stringify(lg).slice(0, 300)}`);
        else R.ok(lib, theme, L4('anims'));
        if (full) {
          const ends = [];
          await both(async (p, which) => {
            const endedOnTime = await p.evaluate(sel => new Promise(resolve => {
              const fig = document.querySelector(sel), ended = () => fig.classList.contains('tracing') === false;
              const finished = Promise.all(fig.getAnimations({ subtree: true }).map(a => a.finished.catch(() => {})));
              Promise.race([finished, new Promise(r => setTimeout(r, 10000))]).then(() => {
                if (ended()) return resolve(true);
                const mo = new MutationObserver(() => { if (ended()) { mo.disconnect(); resolve(true); } });
                mo.observe(fig, { attributes: true, attributeFilter: ['class'] });
                setTimeout(() => { mo.disconnect(); resolve(ended()); }, 1000);
              });
            }), which === 'app' ? figSel.app : figSel.golden);
            if (!endedOnTime) ends.push(`Trace did not end by itself in the ${which} page`);
          });
          const pressed = await app.page.$eval(`#${chrome}-trace`, b => b.getAttribute('aria-pressed'));
          if (pressed !== 'false') ends.push(`Trace is still aria-pressed=${pressed} after it ended`);
          R.check(lib, theme, L4('ends'), ends);
        } else { await both((p, which) => freezeAt(p, which === 'app' ? figSel.app : figSel.golden, null)); await both((p, which) => unfreeze(p, which === 'app' ? figSel.app : figSel.golden, chrome)); }
        await settleApp(app.page); await settle(gold.page);
        const shots = [];
        for (const t of full ? [600, 1200, 1800, 2400] : [2400]) {
          await presentGolden(gold.page, chrome, await appOffset(app.page));
          await both(p => click(p, `#${chrome}-trace`));
          await both((p, which) => freezeAt(p, which === 'app' ? figSel.app : figSel.golden, t));
          await check(`T@${t}`, { markup: false });
          if (t === 600 || t === 2400) shots.push(await capture(app.page, await region(app.page, G.app(chrome), 'app')));
          await both((p, which) => unfreeze(p, which === 'app' ? figSel.app : figSel.golden, chrome));
          await unpresentGolden(gold.page);
        }
        if (full) {
          if (shots.length === 2 && (await diffPng(app.page, shots[0], shots[1])).off === 0) fail(L4('motion'), 'the 0.6 s and 2.4 s Trace frames are identical, so the frame check sees no motion');
          else R.ok(lib, theme, L4('motion'));
        }
        await settleApp(app.page); await settle(gold.page);
        await both(p => p.emulateMedia({ reducedMotion: 'reduce' }));
        await both(p => p.waitForFunction(() => document.documentElement.getAttribute('data-motion') === 'reduce', null, { timeout: 5000 }));
        await both(p => click(p, `#${chrome}-trace`));
        await check('R:end', { markup: false });
        await both(p => p.emulateMedia({ reducedMotion: 'no-preference' }));
        await both(p => p.waitForFunction(() => document.documentElement.getAttribute('data-motion') !== 'reduce', null, { timeout: 5000 }));
      }
      await unpresentGolden(gold.page);
      await closeHowTo(app.page);
    }
  } finally { await app.ctx.close(); await gold.ctx.close(); }
}

export const plateStats = () => ({ pairs: 0, offMax: 0, off1Max: 0, tall: [], l2b: 0, f3: 0, anims: 0, ownLayers: 0 });
