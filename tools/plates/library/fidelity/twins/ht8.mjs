// LIB-4b: the twin of gate group HT-8 (scripts/screenshot-gate.mjs, `if (gate.runs('HT-8'))`; pinned by B3 in
// fidelity/twins.mjs). For one library id in one theme it makes every per-id check of that block, with the block's
// viewport (390 x TALL_H), placeApp / placeGolden / pair / animList / pauseAt / finish / quiet and its thresholds, and
// records one row per state instead of pushing to `errors`: HT8/L4, HT8/S5-end, HT8/S4, HT8/S6-<row> per row (from the
// DOM, as the block enumerates them); HT_FULL HT8/S5-mid and HT8/reduced (the block's reducedRun for this id); in
// silent-black HT8/lazy (one feel-<chrome>-*.js request after the tap) and HT8/C12 (the block's C12, for this id).
// The golden is the id's layers page (pages[id].layers; golden B for the 8). Not here (LIB-4-DESIGN exemptions): the
// feel chunk sizes and the main-bundle markup check (X2), the early "Feel it" chip and the shimmer tripwire (X6).
import { HT_FULL, TALL_H, closeHowTo, diffPng, meetsRule, openAppTrain, openGolden, openHowTo } from '../../../fidelity/harness.mjs';
import { WIDTH } from '../tuples.mjs';
import { stateOf } from '../rows.mjs';

/** SWEEP / GAP / DELAY from the vendored feelmap.mjs, read as the block reads them (the block's fallback if absent). */
async function timings(root) {
  const { readFileSync } = await import('node:fs');
  const { join } = await import('node:path');
  const src = readFileSync(join(root, 'tools/plates/layers/engine/feelmap.mjs'), 'utf8');
  const cm = src.match(/const SWEEP = (\d+), GAP = (\d+), DELAY = (\d+), TOTAL = SWEEP \* 2 \+ GAP;/);
  const [SWEEP, GAP, DELAY] = cm ? [+cm[1], +cm[2], +cm[3]] : [2400, 400, 300];
  const TOTAL = SWEEP * 2 + GAP;
  return { found: !!cm, SWEEP, GAP, DELAY, TOTAL, END: DELAY + TOTAL };
}

const APP = 'dialog.sheet.ht .feel', GOLD = id => `#card-${id} .feel`;
const frames2 = p => p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
/** Waits until nothing runs inside `sel` (the rest of the golden page may still play its own maps). */
const quiet = (p, sel) => p.waitForFunction(s => { const e = document.querySelector(s); return !!e && !e.getAnimations({ subtree: true }).some(a => a.playState === 'running'); }, sel, { timeout: 9000 }).then(() => frames2(p));
const click = (p, sel) => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error(`no ${s}`); e.click(); }, sel);
/** The app: the feel section scrolled just under the sheet header, on its own layer; returns its rect. */
const placeApp = page => page.evaluate(s => {
  const f = document.querySelector(s), p = f.closest('.sheet-panel'), top = p.querySelector('.sheet-top').getBoundingClientRect().bottom;
  p.scrollTop += f.getBoundingClientRect().top - top - 8;
  f.style.willChange = 'transform';
  const r = f.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height, fits: r.top >= top - 0.001 && r.bottom <= innerHeight + 0.001 };
}, APP);
/** The golden: the card in a modal dialog, placed so its feel section is at `at`, on its own layer (as HT-3 presents). */
const placeGolden = (page, id, at) => page.evaluate(([id, sel, at]) => {
  const c = document.getElementById(`card-${id}`);
  let d = document.getElementById('ht8-present');
  if (!d) {
    d = document.createElement('dialog'); d.id = 'ht8-present';
    d.style.cssText = 'box-sizing:border-box;padding:0 16px;border:0;margin:0;inset:0 auto auto 0;width:100%;max-width:none;max-height:none;background:transparent;overflow:visible;color:inherit;font:inherit;letter-spacing:inherit';
    document.getElementById('sheets').append(d);
  }
  const old = d.querySelector('.sheet-card');
  if (old && old !== c) document.getElementById('ht8-home').replaceWith(old);
  if (c.parentElement !== d) { c.before(Object.assign(document.createElement('i'), { id: 'ht8-home' })); d.append(c); }
  if (!d.open) d.showModal();
  Object.assign(d.style, { top: '0px', paddingLeft: '16px', paddingRight: '16px' });
  const f0 = document.querySelector(sel).getBoundingClientRect(), dx = at.x - f0.left;
  Object.assign(d.style, { top: `${at.y - f0.top}px`, paddingLeft: `${16 + dx}px`, paddingRight: `${16 - dx}px` });
  const f = document.querySelector(sel); f.style.willChange = 'transform';
  const r = f.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}, [id, GOLD(id), at]);
/** The band animation list of one map: name, target, keyframes and timing (L4). */
const animList = (p, sel) => p.evaluate(s => [...document.querySelector(s).querySelectorAll('.feel-band')].flatMap(b => b.getAnimations().map(a => ({
  name: a.animationName, target: ['--feel-from', '--feel-to'].map(k => getComputedStyle(b).getPropertyValue(k).trim()), keyframes: a.effect.getKeyframes(), timing: (({ duration, delay, easing, fill, iterations, direction, endDelay }) => ({ duration, delay, easing, fill, iterations, direction, endDelay }))(a.effect.getTiming()),
}))), sel);
/** Pauses every band animation of the map at `t` ms. */
const pauseAt = (p, sel, t) => p.evaluate(([s, t]) => { for (const a of document.querySelector(s).getAnimations({ subtree: true })) if (a.animationName === 'feel-sweep') { a.pause(); a.currentTime = t; } }, [sel, t]);
const finish = (p, sel) => p.evaluate(s => { for (const a of document.querySelector(s).getAnimations({ subtree: true })) if (a.animationName === 'feel-sweep') a.finish(); }, sel);
/** Opens the id's sheet and brings its feel section in, as the block does before every tap. */
async function openFeel(page, index) {
  await openHowTo(page, index);
  await page.evaluate(() => document.querySelector('dialog.sheet.ht .ht-feel-host').scrollIntoView({ block: 'center' }));
  await page.locator(APP).waitFor({ state: 'visible', timeout: 8000 });
}

/** One id (job.lib, chrome id job.chrome, card job.index) in job.theme. */
export async function run(ctx, { lib, chrome, index, theme }) {
  const { browser, port, R, pages, order, custom, root } = ctx;
  const st = ctx.stats.byFamily.HT8 ??= { pairs: 0, l4: 0, rows: 0 };
  const full = HT_FULL.includes(theme), viewport = { width: WIDTH, height: TALL_H };
  const T = await timings(root);
  const S = sub => stateOf('HT8', sub, WIDTH);
  let cur = null;
  const fail = (state, m) => R.fail(lib, theme, state, m);
  const onError = where => m => fail(cur ?? S('L4'), `${where} page error: ${m}`);
  if (!T.found) fail(S('L4'), 'SWEEP/GAP/DELAY not found in the vendored feelmap.mjs');
  const html = pages[lib].layers;

  /** One L3 pair (the block's pair): both placed, captured at the same clip, compared by the HT-3 rule; px recorded. */
  async function pair(app, gold, state, anims = 'disabled') {
    st.pairs++;
    const a = await placeApp(app);
    if (!a.fits) return fail(state, `the app's feel section (${a.h} px) does not fit under the sheet header`);
    const g = await placeGolden(gold, chrome, a);
    if (g.x !== a.x || g.y !== a.y || g.w !== a.w || g.h !== a.h) return fail(state, `golden ${JSON.stringify(g)} != app ${JSON.stringify(a)}`);
    await frames2(app); await frames2(gold);
    const clip = { x: a.x, y: a.y, width: a.w, height: a.h };
    const [ia, ig] = [await app.screenshot({ clip, animations: anims, caret: 'hide' }), await gold.screenshot({ clip, animations: anims, caret: 'hide' })];
    const d = await diffPng(app, ia, ig);
    if (d.sameSize) R.px(lib, theme, state, d.off);
    if (!meetsRule(d)) return fail(state, `L3 ${d.sameSize ? `${d.off} px off (max ${d.maxDelta}/255, ${d.off1} off by 1)` : 'sizes differ'}`);
    if (d.ink < 0.01) return fail(state, `nothing drawn (ink ${d.ink})`);   // a probe must fail when it sees nothing to measure
    R.ok(lib, theme, state);
  }

  // themeRun, for this id
  {
    const { ctx: actx, page } = await openAppTrain(browser, port, theme, { viewport, order, custom, onError: onError('app') });
    let g = null;
    try {
      g = await openGolden(browser, theme, { viewport, html, onError: onError('golden') });
      const feelReqs = [];
      page.on('request', r => { if (/\/assets\/feel-[a-z0-9-]+-[\w-]+\.js$/.test(r.url())) feelReqs.push(r.url()); });
      const before = feelReqs.length;
      cur = theme === 'silent-black' ? S('lazy') : S('L4');
      await openFeel(page, index);
      if (theme === 'silent-black') {
        const got = feelReqs.slice(before);
        R.check(lib, theme, S('lazy'), got.length !== 1 || !got[0].includes(`/feel-${chrome}-`) ? [`feel chunk requests after the tap ${JSON.stringify(got)}`] : []);
      }
      // S5: tap the map in both, compare the band animation lists (L4), then the paused frames
      cur = S('L4');
      await placeApp(page); await placeGolden(g.page, chrome, await placeApp(page));
      await click(page, `${APP} [data-feel-map]`); await click(g.page, `${GOLD(chrome)} [data-feel-map]`);
      const [la, lg] = [await animList(page, APP), await animList(g.page, GOLD(chrome))];
      const bands = await page.evaluate(s => document.querySelectorAll(`${s} .feel-band`).length, APP);
      st.l4++;
      const l4 = [];
      if (!la.length || la.length !== bands) l4.push(`${la.length} band animations for ${bands} bands`);
      if (JSON.stringify(la) !== JSON.stringify(lg)) l4.push(`the band animation list differs from the golden's\n app ${JSON.stringify(la)}\n golden ${JSON.stringify(lg)}`);
      R.check(lib, theme, S('L4'), l4);
      for (const [t, sub] of full ? [[T.SWEEP / 2, 'S5-mid'], [T.TOTAL - 1, 'S5-end']] : [[T.TOTAL - 1, 'S5-end']]) {
        cur = S(sub);
        await pauseAt(page, APP, t); await pauseAt(g.page, GOLD(chrome), t);
        await pair(page, g.page, S(sub), 'allow');
      }
      cur = S('S4');
      await finish(page, APP); await finish(g.page, GOLD(chrome));
      await quiet(page, APP); await quiet(g.page, GOLD(chrome));
      // S4: the rest state after the sweep (is-playing removed on animationend, as the golden)
      const playing = await page.evaluate(s => document.querySelector(`${s} [data-feel-map]`).classList.contains('is-playing'), APP);
      if (playing) fail(S('S4'), 'is-playing still set after the sweep ended');
      await pair(page, g.page, S('S4'));
      // S6: every row open (watch outline, pain tint, or a plain row), then closed again
      const rows = await page.evaluate(s => [...document.querySelectorAll(`${s} .fr`)].map(r => r.dataset.row), APP);
      for (const r of rows) {
        const s6 = S(`S6-${r}`);
        cur = s6;
        await click(page, `${APP} .fr[data-row="${r}"] .fr-btn`); await click(g.page, `${GOLD(chrome)} .fr[data-row="${r}"] .fr-btn`);
        await quiet(page, APP); await quiet(g.page, GOLD(chrome));
        await pair(page, g.page, s6); st.rows++;
        if (theme === 'silent-black') {
          const small = await page.evaluate(([s, r]) => { const b = document.querySelector(`${s} .fr[data-row="${r}"] .fr-btn`).getBoundingClientRect(); return b.width < 44 || b.height < 44 ? `${b.width}x${b.height}` : null; }, [APP, r]);
          if (small) fail(s6, `row ${r}: button ${small} is under 44 x 44`);
          const ex = await page.evaluate(([s, r]) => document.querySelector(`${s} .fr[data-row="${r}"] .fr-btn`).getAttribute('aria-expanded'), [APP, r]);
          if (ex !== 'true') fail(s6, `row ${r}: aria-expanded ${ex} after opening`);
        }
        await click(page, `${APP} .fr[data-row="${r}"] .fr-btn`); await click(g.page, `${GOLD(chrome)} .fr[data-row="${r}"] .fr-btn`);
        await quiet(page, APP); await quiet(g.page, GOLD(chrome));
      }
      await closeHowTo(page);
      if (theme === 'silent-black') {
        // C12: nothing running at end + 1 s after a tap (real time), for this id
        cur = S('C12');
        await openFeel(page, index);
        await placeApp(page);
        await click(page, `${APP} [data-feel-map]`);
        await page.waitForTimeout(T.END + 1000);
        const running = await page.evaluate(() => document.querySelector('dialog.sheet.ht').getAnimations({ subtree: true }).filter(a => a.playState === 'running').map(a => a.animationName || a.id));
        R.check(lib, theme, S('C12'), running.length ? [`still running at end + 1 s (${T.END + 1000} ms): ${running.join(', ')}`] : []);
        await closeHowTo(page);
      }
    } finally { cur = null; await actx.close(); if (g) await g.ctx.close(); }
  }

  // reducedRun, for this id: band display:none and no animation after a tap, and the rest state against the golden
  if (full) {
    const red = S('reduced');
    cur = red;
    const { ctx: actx, page } = await openAppTrain(browser, port, theme, { viewport, reducedMotion: 'reduce', order, custom, onError: onError('app reduced') });
    let g = null;
    try {
      g = await openGolden(browser, theme, { viewport, reducedMotion: 'reduce', html, onError: onError('golden reduced') });
      await openFeel(page, index);
      await placeApp(page);
      await click(page, `${APP} [data-feel-map]`);
      await page.waitForTimeout(400);
      const s = await page.evaluate(s => { const bs = [...document.querySelectorAll(`${s} .feel-band`)]; return { n: bs.length, shown: bs.filter(b => getComputedStyle(b).display !== 'none').length, anims: bs.reduce((k, b) => k + b.getAnimations().length, 0), playing: document.querySelector(`${s} [data-feel-map]`).classList.contains('is-playing') }; }, APP);
      if (!s.n || s.shown || s.anims || s.playing) fail(red, `${JSON.stringify(s)} (want bands present, all display:none, no animation, no is-playing)`);
      await pair(page, g.page, red);
      await closeHowTo(page);
    } finally { cur = null; await actx.close(); if (g) await g.ctx.close(); }
  }
}
