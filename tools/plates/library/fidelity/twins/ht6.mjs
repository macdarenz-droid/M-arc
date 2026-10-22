// LIB-4b twin T2 (LIB-4-DESIGN 3): gate group HT-6 (scripts/screenshot-gate.mjs, `if (gate.runs('HT-6'))`) for ONE
// library id in ONE theme, one row per state (tuples.mjs statesOf, family HT6). Same contexts, taps, waits, compare
// rules, thresholds and messages as the block; `P(...)` becomes a fail on the state the check belongs to. The block's
// per-id checks done for this id: grip L3, hand pages (L3, C16, Right/Wrong words and icons), C11 open/close, A4 open/
// close, chip box, C11 reduced (`reduced()`), and in HT_FULL A4 Mistake, origin from Mistake, A6 (plateJob with the
// block's openClose) and A8 (this id's card hint); in silent-black A7 lazy load and the Android Back check. Pages are
// enumerated from the DOM, so a page missing against the source is a missing or an extra row.
// Not twinned (named exemption X2): A7 chunk sizes and the 8-chunk count. Not done: the block writes the failing
// pair's PNGs to the gate's OUT dir; the twin does not (the row holds the message).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { HT_FULL, DEVICE, TALL_H, capture, closeHowTo, diffPng, meetsRule, openAppTrain, openCard, openGolden, openHowTo, settle, settleApp } from '../../../fidelity/harness.mjs';
import { captureAnims, c11Bad } from '../../../../../scripts/c11-anims.mjs';
import { howToHint } from '../../ids-node.mjs';
import { loadPairs } from '../../../gen/handpairs.mjs';
import { stateOf } from '../rows.mjs';
import { WIDTH } from '../tuples.mjs';
import { plateJob, plateStats } from '../plate.mjs';

const S = sub => stateOf('HT6', sub, WIDTH);
// LIB-7b (D-LIB7b-SCOPE (d)): a library id on a pair key is found by its pair markup, the zx panel holding its key's
// `.hx-hp-<key>` scope, in its card on the page or in the app's How-to sheet (the page may namespace a repeated copy's
// ids, D-LIB7b-PAGEDUP (B)); any other id keeps `#<chromeId>-zoom-hand`. PAIR_KEY: chromeId -> key, set by run().
const PAIR_KEY = {};
const panelSel = id => (PAIR_KEY[id] ? `.zx[data-zoom="hand"]:has(> .hx-hp-${PAIR_KEY[id]}):is(#card-${id} *, dialog.sheet.ht *)` : `#${id}-zoom-hand`);
const closeSel = id => (PAIR_KEY[id] ? `${panelSel(id)} .zx-close` : `${panelSel(id)}-close`);   // LIB-7b
const click = (page, sel) => page.evaluate(s => { const b = document.querySelector(s); if (!b) throw new Error(`no ${s}`); b.click(); }, sel);
const rectOf = (page, sel) => page.evaluate(s => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }, sel);
/** The block's readPanel, unchanged: the visible page of a panel, its words, icons and image labels. */
const readPanel = (page, sel) => page.evaluate(sel => {
  const p = document.querySelector(sel), pg = [...p.querySelectorAll('.zx-page')].find(x => !x.hidden) ?? p;
  const lum = c => { const m = c.match(/[\d.]+/g).map(Number); const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]); };
  const bgOf = e => { for (let x = e; x; x = x.parentElement) { const b = getComputedStyle(x).backgroundColor; if (b && !/rgba\(0, 0, 0, 0\)|transparent/.test(b)) return b; } return getComputedStyle(document.body).backgroundColor; };
  const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const words = [...pg.querySelectorAll('text, b, span, strong, p, div')].filter(e => ![...e.children].some(c => c.textContent.trim()) && /^(Right|Wrong)$/.test(e.textContent.trim()))
    .map(e => { const cs = getComputedStyle(e), col = e instanceof SVGElement ? cs.fill : cs.color, r = e.getBoundingClientRect(); return { w: e.textContent.trim(), ok: r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.opacity !== '0', c: contrast(col, bgOf(e)) }; });
  const icon = d => [...pg.querySelectorAll('path')].filter(e => e.getAttribute('d') === d).map(e => { const cs = getComputedStyle(e), r = e.getBoundingClientRect(); return r.width > 0 && cs.stroke !== 'none' && !/rgba\(0, 0, 0, 0\)/.test(cs.stroke) ? contrast(cs.stroke, bgOf(e)) : 0; });
  const h = document.getElementById(p.getAttribute('aria-labelledby') ?? '');
  return {
    words, tick: icon('M5 12l4 4L19 7'), cross: icon('M6 6l12 12M18 6L6 18'),
    region: p.getAttribute('role') === 'region' && !!h && !!h.textContent.trim() && h.classList.contains('zx-h'),
    right: [...pg.querySelectorAll('[role="img"][aria-label^="Right: "]')].length, wrong: [...pg.querySelectorAll('[role="img"][aria-label^="Wrong: "]')].length,
    pages: p.querySelectorAll('.zx-page').length,
  };
}, sel);
const plateState = page => page.evaluate(() => {
  const g = document.querySelector('dialog.sheet.ht .ht-golden'), fit = g.querySelector('.ht-plate-fit');
  return { snap: g.htPlateApi.snapshot(), hidden: fit.hidden, inert: fit.inert, mounted: !!fit.querySelector('figure[data-mode="normal"]'), cue: g.querySelector('.cue-line').hidden, slot: g.querySelector('.ht-zoom-slot').hidden };
});
/** The block's A6 `mutate`, unchanged: open and close the hand close-up before the plate compare (runs in the app page). */
export const openClose = async id => {
  const wait = f => new Promise(r => { const t0 = performance.now(); const k = () => (f() || performance.now() - t0 > 5000 ? r() : requestAnimationFrame(k)); k(); });
  const p = () => document.getElementById(`${id}-zoom-hand`) ?? document.querySelector('dialog.sheet.ht .zx[data-zoom="hand"]:has(> [class*="hx-hp-"])');   // LIB-7b: or the pair panel
  document.getElementById(`${id}-chip-hand`).click();
  await wait(() => p() && !p().hidden && !p().getAnimations().length);
  p().querySelector('.zx-close').click();   // LIB-7b: the panel's own close button (`${id}-zoom-hand-close` for an unkeyed id)
  await wait(() => p().hidden && !document.querySelector('.ht-plate-fit').hidden);
  window.__ht6OpenClosed = (window.__ht6OpenClosed ?? 0) + 1;
};

/** The block's A8 hint set: every exercises.json id's hint through the generated decoder (ids.ts's Node twin). */
let hints = null;
const hintTexts = root => (hints ??= JSON.parse(readFileSync(join(root, 'src/data/exercises.json'), 'utf8')).map(e => howToHint(e.id)).filter(t => t !== undefined));
let pairsP = null;
/** The /assets/ name prefix of this id's hand chunk: handpair-<key>- for a library id on a shared pair, else hand-<chrome>-. */
const chunkPrefix = async (lib, chrome) => {
  pairsP ??= loadPairs();
  const key = (await pairsP)?.HAND_OF_ID?.[lib];
  return key ? `/assets/handpair-${key}-` : `/assets/hand-${chrome}-`;
};

/** The block's l3 for one close-up of one id: fails go to `state` (P(...) in the block). */
async function l3(R, lib, theme, state, stats, app, gold, id, label, sel = panelSel(id)) {
  const P = m => R.fail(lib, theme, state, m);
  R.ok(lib, theme, state);
  await gold.evaluate(() => new Promise(r => { document.documentElement.style.scrollBehavior = 'auto'; let y = NaN, n = 0; const f = () => { n = scrollY === y ? n + 1 : 0; y = scrollY; if (n >= 3) r(); else requestAnimationFrame(f); }; f(); }));
  const saved = await Promise.all([app, gold].map(pg => pg.evaluate(s => { const e = document.querySelector(s), o = e.style.transformOrigin; e.style.willChange = 'transform'; e.style.transformOrigin = '0px 0px'; return o; }, sel)));
  await settleApp(app); await settle(gold);
  const place = () => app.evaluate(s => { const z = document.querySelector(s), panel = z.closest('.sheet-panel'), top = panel.querySelector('.sheet-top').getBoundingClientRect().bottom; panel.scrollTop += z.getBoundingClientRect().top - (top + 8); const r = z.getBoundingClientRect(); return r.top >= top - 0.001 && r.bottom <= innerHeight + 0.001; }, sel);
  let tall = false;
  if (!(await place())) {
    tall = true;
    await Promise.all([app.setViewportSize({ width: 390, height: TALL_H }), gold.setViewportSize({ width: 390, height: TALL_H })]);
    await settleApp(app);
    if (!(await place())) P(`${id} ${label}: the close-up does not fit a 390 x ${TALL_H} viewport below the sheet header`);
  }
  await settleApp(app);
  const at = await rectOf(app, sel);
  await gold.evaluate(([s, at]) => {
    document.documentElement.style.overflowAnchor = 'none';
    document.body.style.marginTop = '0px'; window.scrollTo({ top: 0, behavior: 'instant' });
    for (let k = 0; k < 3; k++) { const r = document.querySelector(s).getBoundingClientRect(); if (r.top === at.y) break; document.body.style.marginTop = `${parseFloat(document.body.style.marginTop) + at.y - r.top}px`; }
  }, [sel, at]);
  await settleApp(app); await settle(gold);
  const [ra, rg] = [await rectOf(app, sel), await rectOf(gold, sel)];
  if (ra.x !== rg.x || ra.y !== rg.y || ra.width !== rg.width || ra.height !== rg.height) P(`${id} ${label}: panel box app ${JSON.stringify(ra)} vs golden ${JSON.stringify(rg)}`);
  else {
    const [a, g] = [await capture(app, ra), await capture(gold, rg)];
    const d = await diffPng(app, a, g);
    stats.pairs++; stats.offMax = Math.max(stats.offMax, d.off); if (tall) stats.tall++;
    R.px(lib, theme, state, d.off);
    if (d.ink < 0.02) P(`${id} ${label}: the app capture is blank (ink ${d.ink})`);
    if (!meetsRule(d)) P(`${id} ${label} L3: ${d.off} px off (max ${d.maxDelta}/255, ${d.off1} off by 1, of ${d.total}${d.sameSize ? '' : `, sizes ${d.width}x${d.height} vs ${d.otherWidth}x${d.otherHeight}`})`);
  }
  for (const [k, pg] of [app, gold].entries()) await pg.evaluate(([s, o]) => { const e = document.querySelector(s); e.style.willChange = ''; e.style.transformOrigin = o; }, [sel, saved[k]]);
  if (tall) { await Promise.all([app.setViewportSize(DEVICE.viewport), gold.setViewportSize(DEVICE.viewport)]); await settleApp(app); }
}

/** The block's `run(theme)` and `reduced(theme)` for one id, then (HT_FULL) its A6. */
export async function run(ctx, { lib, chrome, index, theme, facts }) {
  const { browser, port, R, pages, order, custom } = ctx;
  const stats = (ctx.stats.byFamily ??= {}).HT6 ??= { pairs: 0, offMax: 0, tall: 0, words: 0, anims: 0, a6: 0, mistakeOrigins: 0 };
  const full = HT_FULL.includes(theme), id = chrome, T = `${theme} ${lib}`;
  PAIR_KEY[chrome] = (await (pairsP ??= loadPairs()))?.HAND_OF_ID?.[lib];   // LIB-7b
  let cur = full ? S('A8-hint') : S('open-anim');
  const fail = (state, m) => R.fail(lib, theme, state, m);
  const app = await openAppTrain(browser, port, theme, { order, custom, onError: m => fail(cur, `${theme} app page error: ${m}`) });
  const gold = await openGolden(browser, theme, { html: pages[lib].layers, onError: m => fail(cur, `${theme} golden page error: ${m}`) });
  const reqs = []; app.page.on('request', r => reqs.push(r.url()));
  let hasHand = false;
  try {
    if (full) {
      // A8 (LIB-2 D-LIB2-hints): this id's Train card shows its hint once when the decoder has one, else none
      cur = S('A8-hint');
      const want = howToHint(lib), bad = [];
      if (!!want !== !!facts.push) bad.push(`A8 ${lib}: the source's push hint is ${facts.push ? 'set' : 'unset'}, the decoder's hint ${JSON.stringify(want)}`);
      const card = await openCard(app.page, index);
      const got = await card.evaluate(c => [...c.querySelectorAll('p.hint.muted')].filter(p => !p.closest('.why-row ~ .ex-body')).map(p => p.textContent));
      const all = new Set(hintTexts(ctx.root));
      const shown = got.filter(t => all.has(t));
      if (want ? JSON.stringify(shown) !== JSON.stringify([want]) : shown.length) bad.push(`${theme} A8 ${lib}: hint lines ${JSON.stringify(got)}, expected ${want ? `"${want}" once` : 'none'}`);
      R.check(lib, theme, cur, bad);
    }
    await openHowTo(app.page, index);
    hasHand = await app.page.evaluate(i => !!document.getElementById(`${i}-chip-hand`), id);
    if (!hasHand && !facts.hand) { await closeHowTo(app.page); return; }
    if (!hasHand) { fail(S('open-anim'), `${T}: no hand chip #${id}-chip-hand, but the source has a hand close-up`); return; }
    const prefix = await chunkPrefix(lib, chrome);
    if (theme === 'silent-black') {
      cur = S('A7-lazy');
      const early = reqs.filter(u => /\/assets\/hand(pair)?-/.test(u));
      R.check(lib, theme, cur, early.length ? [`${T} A7: hand chunks requested before the first tap: ${early.join(', ')}`] : []);
    }
    // the Grip section with its handling mistakes, at S0, pixel for pixel
    if (facts.grip || await app.page.evaluate(i => !!document.getElementById(`${i}-grip`), id)) {
      cur = S('grip');
      await l3(R, lib, theme, cur, stats, app.page, gold.page, id, 'grip', `#${id}-grip`);
    }
    await app.page.evaluate(() => { document.querySelector('dialog.sheet.ht .sheet-panel').scrollTop = 0; });
    await gold.page.evaluate(() => { document.body.style.marginTop = '0px'; window.scrollTo({ top: 0, behavior: 'instant' }); });
    const before = await plateState(app.page);
    cur = S('open-anim');
    const aA = await captureAnims(app.page, panelSel(id), async () => {
      await app.page.click(`#${id}-chip-hand`);
      await app.page.locator(`dialog.sheet.ht ${panelSel(id)}`).waitFor({ state: 'visible', timeout: 8000 });
    }, 'shown');
    const aG = await captureAnims(gold.page, panelSel(id), () => gold.page.click(`#${id}-chip-hand`), 'shown');
    stats.anims++;
    R.check(lib, theme, cur, c11Bad(aA, aG) ? [`${T} C11 open animation: app ${JSON.stringify(aA)} vs golden ${JSON.stringify(aG)}`] : []);
    await settleApp(app.page); await settle(gold.page);
    if (theme === 'silent-black' && !reqs.some(u => u.includes(prefix) && u.endsWith('.js'))) fail(S('A7-lazy'), `A7: ${prefix.slice(8)}*.js not requested on the tap`);
    // A4: the plate box hidden and inert, the figure mounted, the cue line hidden, focus on the heading
    cur = S('A4');
    const open = await plateState(app.page);
    const focus = await app.page.evaluate(() => document.activeElement?.classList.contains('zx-h') ?? false);
    R.check(lib, theme, cur, !open.hidden || !open.inert || !open.mounted || !open.cue || open.slot || !focus ? [`${T} A4 open: ${JSON.stringify({ open, focus })}`] : []);
    const n = (await readPanel(app.page, panelSel(id))).pages;
    cur = S('chip');
    const [chA, chG] = [await rectOf(app.page, `#${id}-chip-hand`), await rectOf(gold.page, `#${id}-chip-hand`)];
    const firstG = await gold.page.evaluate(i => document.getElementById(`${i}-chip-hand`).previousElementSibling === null, id);
    R.check(lib, theme, cur, (firstG && chA.x !== chG.x) || chA.width !== chG.width || chA.height !== chG.height || chA.height < 44 || chA.width < 44 ? [`${T} chip: app ${JSON.stringify(chA)} vs golden ${JSON.stringify(chG)} (>= 44 x 44)`] : []);
    for (let i = 0; i < n; i++) {
      cur = S(`page-${i + 1}`);
      const P = m => fail(cur, m);
      if (i) for (const pg of [app.page, gold.page]) await pg.locator(`${panelSel(id)} .zx-page:not([hidden]) .pager-btn[data-page="${i}"]`).click();
      await l3(R, lib, theme, cur, stats, app.page, gold.page, id, `S2 page ${i + 1}`);
      const r = await readPanel(app.page, panelSel(id));
      if (!r.region) P(`${T} C16: the close-up region is not named by its heading`);
      const hasPair = r.words.some(w => w.w === 'Right') || r.words.some(w => w.w === 'Wrong');
      if (i === 0 || hasPair) {
        stats.words++;
        for (const w of ['Right', 'Wrong']) {
          const ws = r.words.filter(x => x.w === w);
          if (!ws.length || !ws.every(x => x.ok && x.c >= 3)) P(`${T} page ${i + 1}: the word ${w} is not printed readably (${JSON.stringify(ws)})`);
        }
        if (!(Math.max(0, ...r.tick) >= 2) || !(Math.max(0, ...r.cross) >= 2)) P(`${T} page ${i + 1}: tick ${JSON.stringify(r.tick)} / cross ${JSON.stringify(r.cross)} icons not drawn readably`);
        if (!r.right || !r.wrong) P(`${T} page ${i + 1} C16: halves labelled Right ${r.right}, Wrong ${r.wrong}`);
      }
    }
    // closing: golden B's exit animation, the plate state back as before, focus back on the chip
    cur = S('close-anim');
    const shut = pg => captureAnims(pg, panelSel(id), () => pg.click(closeSel(id)), 'hidden');
    const [cA, cG] = await Promise.all([shut(app.page), shut(gold.page)]);
    R.check(lib, theme, cur, c11Bad(cA, cG) ? [`${T} C11 close animation: app ${JSON.stringify(cA)} vs golden ${JSON.stringify(cG)}`] : []);
    await settleApp(app.page); await settle(gold.page);
    cur = S('A4');
    const after = await plateState(app.page), back = await app.page.evaluate(i => document.activeElement?.id === `${i}-chip-hand`, id);
    if (JSON.stringify(after) !== JSON.stringify(before) || !back) fail(cur, `${T} A4 close: ${JSON.stringify({ before, after, back })}`);
    if (full) {
      // opening clears Mistake (GA 2.2); closing puts it back
      cur = S('A4-mistake');
      await click(app.page, `#${id}-mistake`);
      const m0 = await plateState(app.page);
      await click(app.page, `#${id}-chip-hand`);
      await app.page.locator(`dialog.sheet.ht ${panelSel(id)}`).waitFor({ state: 'visible' });
      const m1 = await plateState(app.page);
      await click(app.page, closeSel(id)); await settleApp(app.page);
      const m2 = await plateState(app.page);
      R.check(lib, theme, cur, m0.snap.mode !== 'mistake' || m1.snap.mode !== 'normal' || JSON.stringify(m2) !== JSON.stringify(m0) ? [`${T} A4 Mistake: ${JSON.stringify({ m0: m0.snap, m1: m1.snap, m2: m2.snap })}`] : []);
      await click(app.page, `#${id}-mistake`);
      // opened from Mistake, the close-up grows out of the chip where golden B's does
      cur = S('origin');
      const originFromMistake = async (pg, inApp) => {
        await pg.click(`#${id}-mistake`);
        await pg.click(`#${id}-chip-hand`);
        if (inApp) await pg.locator(`dialog.sheet.ht ${panelSel(id)}`).waitFor({ state: 'visible' });
        const o = await pg.evaluate(s => document.querySelector(s).style.transformOrigin, panelSel(id));
        await click(pg, closeSel(id));
        if (inApp) await settleApp(pg); else await settle(pg);
        return o;
      };
      const [oA, oG] = [await originFromMistake(app.page, true), await originFromMistake(gold.page, false)];
      stats.mistakeOrigins++;
      const [xA, yA] = (oA || '').split(' '), [xG, yG] = (oG || '').split(' ');
      R.check(lib, theme, cur, !oA || !yA || yA !== yG || (firstG && xA !== xG) ? [`${T} open from Mistake: transform-origin app ${oA} vs golden ${oG}`] : []);
    }
    if (theme === 'silent-black') {
      // Android back closes the close-up first, then the sheet
      cur = S('back');
      await click(app.page, `#${id}-chip-hand`);
      await app.page.locator(`dialog.sheet.ht ${panelSel(id)}`).waitFor({ state: 'visible' });
      await settleApp(app.page);
      await app.page.evaluate(() => history.back());
      await app.page.waitForTimeout(600);
      const s1 = await app.page.evaluate(s => ({ sheet: !!document.querySelector('dialog.sheet.ht'), zoom: !document.querySelector(s)?.hidden }), panelSel(id));   // LIB-7b: by panelSel
      await app.page.evaluate(() => history.back());
      await app.page.locator('dialog.sheet.ht').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
      const s2 = await app.page.evaluate(() => !!document.querySelector('dialog.sheet.ht'));
      R.check(lib, theme, cur, !s1.sheet || s1.zoom || s2 ? [`${T} A4 Back: after one Back ${JSON.stringify(s1)}, after two the sheet is ${s2 ? 'still open' : 'closed'}`] : []);
      await settleApp(app.page);
      if (s2) await closeHowTo(app.page);
    } else await closeHowTo(app.page);
  } catch (e) { fail(cur, `${T} crashed: ${e.message.split('\n')[0]}`); } finally { await app.ctx.close(); await gold.ctx.close(); }
  if (!hasHand && !facts.hand) return;
  // C11 under reduced motion: no open or close animation (golden B: none); the block's reduced(theme) for this id
  {
    const st = S('reduced');
    const rapp = await openAppTrain(browser, port, theme, { reducedMotion: 'reduce', order, custom, onError: m => fail(st, `${theme} reduced app page error: ${m}`) });
    try {
      await openHowTo(rapp.page, index);
      const o = await captureAnims(rapp.page, panelSel(id), async () => {
        await click(rapp.page, `#${id}-chip-hand`);
        await rapp.page.locator(`dialog.sheet.ht ${panelSel(id)}`).waitFor({ state: 'visible' });
      }, 'shown');
      let shut = false;
      const c = await captureAnims(rapp.page, panelSel(id), async () => { shut = await rapp.page.evaluate(([s, c]) => { document.querySelector(c).click(); return document.querySelector(s).hidden; }, [panelSel(id), closeSel(id)]); }, 'hidden');
      R.check(lib, theme, st, o.length || c.length || !shut ? [`${theme} C11 reduced motion: open ${JSON.stringify(o)}, close ${JSON.stringify(c)}, closed at once ${shut}`] : []);
    } catch (e) { fail(st, `${theme} reduced crashed: ${e.message.split('\n')[0]}`); } finally { await rapp.ctx.close(); }
  }
  // A6: the HT-3 plate compare after the hand close-up was opened and closed (HT_FULL, 390 px)
  if (full) {
    const st = plateStats(), a6 = S('A6');
    try {
      await plateJob(browser, port, R, { lib, chrome, index, theme, html: pages[lib].plates, order, custom, full: false, widths: [], mutate: openClose, as: a6, stats: st });
    } catch (e) { fail(a6, `A6 crashed: ${e.message.split('\n')[0]}`); }
    stats.a6 += st.pairs;
    if (st.pairs < 2) fail(a6, `A6: only ${st.pairs} plate pairs compared, expected {N, M} (>= 2)`);
  }
}
