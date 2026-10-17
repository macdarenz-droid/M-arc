// LIB-4b: the twin of gate group HT-7 (scripts/screenshot-gate.mjs, `if (gate.runs('HT-7'))`; pinned in twins.mjs), for
// ONE library id in ONE theme: each posture close-up's L3 (with the D-HT7-L3-text re-open rule and, in silent-black on
// the first key, the 0.5 px control), its L4 opening animation (equal to golden B's, one, C18 props), A4 (S1/S3
// exclusive, focus, A2 one #zdots and no duplicate ids), the plate restore after Close, A5 (the posture chunk fetched
// once, none before the first tap), the chip (44x44, A6 Right/Wrong halves); in paper also the reduced-motion pass.
// Same browser setup as the block: golden B (the id's layers page) through goldenB.mjs openPage, the app in that same
// browser. Not here (LIB-4-DESIGN X5, X2): the D-HT7-L3-text-9 30-opens label check, the planted probes, chunk sizes.
// Posture keys: the source's (job.facts.posture) and golden B's DOM (its .zx panels less the source's hand key), so a
// posture key missing on either side is a missing or an extra row.
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import * as H from '../../../fidelity/harness.mjs';
import { WIDTH } from '../tuples.mjs';
import { stateOf } from '../rows.mjs';
import { sourceOf } from '../../registry.mjs';

const panelSel = (id, k) => `#${id}-zoom-${k}`;

/** Resolves once no scroller moves for 3 frames (both pages scroll smoothly to an opened close-up). */
const still = page => page.evaluate(() => new Promise(res => {
  const pos = () => [scrollY, ...[...document.querySelectorAll('.sheet-panel')].map(p => p.scrollTop)].join();
  let last = pos(), same = 0, n = 0;
  const f = () => { const now = pos(); same = now === last ? same + 1 : 0; last = now; if (same >= 3 || ++n > 300) res(); else requestAnimationFrame(f); };
  requestAnimationFrame(f);
}));
/** The panel on its own layer at a whole-pixel viewport y (the block's `place`). */
const place = async (page, sel, which, at) => {
  await still(page);
  return page.evaluate(([sel, which, at]) => {
    const e = document.querySelector(sel);
    e.style.willChange = 'transform';
    if (which === 'app') {
      const p = e.closest('.sheet-panel'), head = p.querySelector('.sheet-top').getBoundingClientRect().bottom;
      e.style.position = 'relative'; e.style.top = '0px';
      p.style.scrollBehavior = 'auto';
      p.scrollTop += e.getBoundingClientRect().top - (head + 8);
      const r = e.getBoundingClientRect();
      if (at == null) at = Math.ceil(r.top);
      e.style.top = `${at - r.top}px`;
    } else window.scrollTo({ top: window.scrollY + e.getBoundingClientRect().top - at, behavior: 'instant' });
    document.activeElement?.blur?.();
    const r = e.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height, fits: r.bottom <= innerHeight };
  }, [sel, which, at]);
};
const unplace = (page, sel) => page.evaluate(sel => { const e = document.querySelector(sel); if (e) { e.style.willChange = ''; e.style.position = ''; e.style.top = ''; const p = e.closest('.sheet-panel'); if (p) p.style.scrollBehavior = ''; } }, sel);
/** A capture of `clip` once two in a row are identical (up to 6 tries). */
const shot = async (page, clip) => {
  let prev = null;
  for (let i = 0; i < 6; i++) {
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    const b = await page.screenshot({ clip, animations: 'disabled', caret: 'hide' });
    if (prev && prev.equals(b)) return b;
    prev = b;
  }
  throw new Error(`the capture at ${JSON.stringify(clip)} never settled`);
};
/** D-HT7-L3-text: the open panel's SVG <text> boxes in device px of a capture of `clip`, widened by a quarter em. */
const textBoxes = (page, sel, clip) => page.evaluate(([sel, clip, dsf]) => [...document.querySelectorAll(`${sel} svg text`)].map(t => {
  const r = t.getBoundingClientRect(), m = 0.25 * parseFloat(getComputedStyle(t).fontSize) * Math.abs(t.getScreenCTM().a);
  return { label: t.textContent.trim(), x0: Math.floor((r.left - m - clip.x) * dsf), y0: Math.floor((r.top - m - clip.y) * dsf), x1: Math.ceil((r.right + m - clip.x) * dsf), y1: Math.ceil((r.bottom + m - clip.y) * dsf) };
}).filter(b => b.x1 > b.x0 && b.y1 > b.y0), [sel, clip, H.DEVICE.deviceScaleFactor]);
/** Every differing pixel between two same-size captures, and how many lie outside all of `boxes`. */
const diffPixels = (page, a, b, boxes) => page.evaluate(async ([a64, b64, boxes]) => {
  const load = async s => { const bm = await createImageBitmap(await (await fetch(`data:image/png;base64,${s}`)).blob()); const c = new OffscreenCanvas(bm.width, bm.height).getContext('2d'); c.drawImage(bm, 0, 0); return c.getImageData(0, 0, bm.width, bm.height); };
  const [A, B] = [await load(a64), await load(b64)];
  let n = 0, outside = 0; const hit = new Set();
  for (let i = 0; i < A.data.length; i += 4) {
    if (A.data[i] === B.data[i] && A.data[i + 1] === B.data[i + 1] && A.data[i + 2] === B.data[i + 2] && A.data[i + 3] === B.data[i + 3]) continue;
    n++;
    const x = (i / 4) % A.width, y = Math.floor(i / 4 / A.width), box = boxes.find(q => x >= q.x0 && x < q.x1 && y >= q.y0 && y < q.y1);
    if (box) hit.add(box.label); else outside++;
  }
  return { n, outside, texts: [...hit] };
}, [a.toString('base64'), b.toString('base64'), boxes]);
/** L3 on one app capture against golden B's: 'pass', 'text' (D-HT7-L3-text allows one re-open), or 'fail'. */
const l3 = async (page, sel, clip, a, b) => {
  const d = await H.diffPng(page, a, b);
  if (H.meetsRule(d)) return { verdict: 'pass', d };
  if (!d.sameSize) return { verdict: 'fail', d, px: null };
  const px = await diffPixels(page, a, b, await textBoxes(page, sel, clip));
  return { verdict: px.n && !px.outside ? 'text' : 'fail', d, px };
};
/** D-HT7-L3-text's one re-open: Close, then the same chip once the page is idle, placed at viewport y `at`. */
const reopen = async (page, id, k, sel, at) => {
  await unplace(page, sel);
  await page.click(`${sel}-close`);
  await page.waitForSelector(`${sel}[hidden]`, { state: 'attached' });
  await H.settleApp(page);
  await page.click(`#${id}-chip-${k}`);
  await page.waitForSelector(`${sel}:not([hidden])`);
  await H.settleApp(page);
  await page.mouse.move(0, 0);
  const r = await place(page, sel, 'app', at); delete r.fits;
  return { r, img: await shot(page, r) };
};
const offText = d => d.sameSize ? `${d.off} px off (${d.off1} by 1, max ${d.maxDelta})` : `size ${d.width}x${d.height} != ${d.otherWidth}x${d.otherHeight}`;
/** Records every Element.animate() call on a close-up panel, with the transform origin set just before. */
const recordAnims = page => page.evaluate(() => {
  if (window.__ht7anims) return;
  window.__ht7anims = [];
  const orig = Element.prototype.animate;
  Element.prototype.animate = function (kf, opts) {
    if (this.classList?.contains('zx')) window.__ht7anims.push({ id: this.id, keyframes: kf, opts, origin: this.style.transformOrigin });
    return orig.call(this, kf, opts);
  };
});
const takeAnims = (page, id) => page.evaluate(id => { const a = window.__ht7anims.filter(x => x.id === id); window.__ht7anims = []; return a.map(({ id, ...x }) => x); }, id);
const appPlate = page => page.evaluate(() => { const b = document.querySelector('dialog.sheet.ht .ht-golden'), fit = b.querySelector('.ht-plate-fit'), t = b.querySelector('.tempo'); const f = fit.getBoundingClientRect(), r = t.getBoundingClientRect(), c = b.getBoundingClientRect(); return { x: c.left, y: f.top, width: c.width, height: r.bottom - f.top }; });

let GB = null;
const goldenB = async root => (GB ??= await import(pathToFileURL(join(root, 'tools/plates/fidelity/goldenB.mjs')).href));

/** One id in one theme: the normal pass, and in paper the reduced-motion pass too (separate golden-B browsers). */
export async function run(ctx, job) {
  const st = ctx.stats.byFamily.HT7 ??= { pairs: 0, maxOff: 0, anims: 0, reduced: 0, restores: 0, controls: 0, reopens: 0 };
  await pass(ctx, job, false, st);
  if (job.theme === 'paper') await pass(ctx, job, true, st);
}

async function pass(ctx, { lib, chrome: id, index, theme, facts }, reduce, stats) {
  const { R } = ctx;
  const G = await goldenB(ctx.root);
  const S = (k, sub) => stateOf('HT7', `${k}:${reduce ? 'reduced' : sub}`, WIDTH);
  const bad = new Map();   // state -> [messages]; every state of a key is checked once at its end
  const P = (k, sub, m) => { const s = S(k, sub); if (!bad.has(s)) bad.set(s, []); bad.get(s).push(m); };
  const flush = (k, subs) => { for (const sub of subs) { const s = S(k, sub); R.check(lib, theme, s, bad.get(s) ?? []); bad.delete(s); } };
  const source = facts.posture ?? [];
  let cur = [source[0], 'L3'], lastSubs = [];   // cur: where a page error or a crash lands
  const g = await G.openPage(ctx.layersFile(lib), theme, { reduce, chromePath: process.env.MARC_CHROMIUM || G.CHROME_PATH });
  try {
    const app = await H.openAppTrain(g.browser, ctx.port, theme, { order: ctx.order, custom: ctx.custom, reducedMotion: reduce ? 'reduce' : 'no-preference', onError: m => cur[0] && P(cur[0], cur[1], `app page error: ${m}`) });
    // golden B's close-ups of this id, less the source's other kinds (the hand): golden B's markup does not tell a
    // posture panel from a hand panel, so a key is a posture key on the DOM side unless the source names it another kind
    const other = new Set(((await import(pathToFileURL(join(ctx.root, sourceOf(lib, ctx.root))).href)).default.zooms ?? []).filter(z => z.kind !== 'posture').map(z => z.key));
    const dom = (await g.page.evaluate(id => [...document.querySelectorAll(`#card-${id} .zx[data-zoom]`)].map(p => p.dataset.zoom), id)).filter(k => !other.has(k));
    const keys = [...source, ...dom.filter(k => !source.includes(k))];
    const first = keys[0];
    if (first) for (const e of g.errs) P(first, 'L3', `golden page error: ${e}`);
    if (reduce) await g.page.evaluate(() => { document.documentElement.dataset.motion = 'reduce'; });
    const fetched = [];
    app.page.on('request', r => { const m = r.url().match(/\/assets\/(posture-[a-z0-9-]+)-[\w-]{8}\.js$/); if (m) fetched.push(m[1]); });
    await H.openHowTo(app.page, index);
    if (first && fetched.length) P(first, 'A5', `${id}: a posture chunk was fetched before any posture tap (${fetched.join(', ')})`);
    const motion = await app.page.evaluate(() => document.documentElement.getAttribute('data-motion'));
    if (first && (motion === 'reduce') !== reduce) P(first, 'L4', `${id}: the app's data-motion is ${motion}`);
    for (const [ki, k] of keys.entries()) {
      const subs = reduce ? ['L3'] : ['L3', 'L4', 'A4', 'restore', 'A5', 'chip', ...(theme === 'silent-black' && ki === 0 ? ['control'] : [])];
      cur = [k, 'L3'];
      {
        if (!dom.includes(k)) { for (const sub of subs) P(k, sub, `${id}/${k}: golden B has no posture close-up ${panelSel(id, k)}`); flush(k, subs); continue; }
        const chip = `#${id}-chip-${k}`, sel = panelSel(id, k);
        const cr = await app.page.$eval(chip, b => { const r = b.getBoundingClientRect(); return [r.width, r.height]; }).catch(() => null);
        if (!cr) { for (const sub of subs) P(k, sub, `${id}: no posture chip ${chip}`); flush(k, subs); continue; }
        if (cr[0] < 44 || cr[1] < 44) P(k, 'chip', `A6 ${id}/${k}: chip ${cr[0].toFixed(1)}x${cr[1].toFixed(1)} under 44x44`);
        // A4 from Mistake on the first key: S1 then S3; normal on the second
        if (ki === 0) { await app.page.click(`#${id}-mistake`); await H.settleApp(app.page); }
        await app.page.mouse.move(0, 0);
        cur = [k, 'restore'];
        const before = await shot(app.page, await appPlate(app.page));
        const scroll = await app.page.$eval('dialog.sheet.ht .sheet-panel', p => p.scrollTop);
        await Promise.all([recordAnims(app.page), recordAnims(g.page)]);
        await takeAnims(app.page, ''); await takeAnims(g.page, '');
        cur = [k, 'L4'];
        await app.page.click(chip);
        await app.page.waitForSelector(`${sel}:not([hidden])`);
        if (ki === 0) await G.openMistake(g.page, id);
        await G.openZoom(g.page, id, k);
        const aa = await takeAnims(app.page, sel.slice(1)), ga = await takeAnims(g.page, sel.slice(1));
        await H.settleApp(app.page);
        if (JSON.stringify(aa) !== JSON.stringify(ga)) P(k, 'L4', `A3 L4 ${id}/${k}: opening animation ${JSON.stringify(aa)} != golden ${JSON.stringify(ga)}`);
        if (reduce) { if (aa.length) P(k, 'L4', `A3 ${id}/${k}: animates under reduced motion`); stats.reduced++; }
        else {
          if (aa.length !== 1) P(k, 'L4', `A3 L4 ${id}/${k}: ${aa.length} opening animations, expected 1`);
          stats.anims++;
        }
        for (const a of aa) for (const kf of a.keyframes) for (const p of Object.keys(kf)) if (!['offset', 'easing', 'composite', 'opacity', 'transform'].includes(p)) P(k, 'L4', `C18 ${id}/${k}: animates ${p}`);
        // S1 and S3 exclusive, through the slot API
        cur = [k, 'A4'];
        const s = await app.page.evaluate(([id, sel]) => {
          const fit = document.querySelector('dialog.sheet.ht .ht-plate-fit'), mis = document.getElementById(`${id}-mistake`), p = document.querySelector(sel);
          const ids = [...document.querySelectorAll('[id]')].map(e => e.id), dup = ids.filter((v, i) => ids.indexOf(v) !== i);
          return { plateHidden: fit.hidden && fit.inert, mistake: mis.getAttribute('aria-pressed'), shown: !p.hidden, focus: document.activeElement === p.querySelector('.zx-h'), zdots: document.querySelectorAll('#zdots').length, dup: [...new Set(dup)].slice(0, 5),
            halves: [...p.querySelectorAll('[role="img"]')].map(e => (e.getAttribute('aria-label') || '').split(':')[0]) };
        }, [id, sel]);
        if (!s.shown || !s.plateHidden || s.mistake === 'true') P(k, 'A4', `A4 ${id}/${k}: with the close-up open, plate hidden+inert ${s.plateHidden}, Mistake ${s.mistake}, panel shown ${s.shown}`);
        if (!s.focus) P(k, 'A4', `A3 ${id}/${k}: focus is not on the close-up heading`);
        if (s.zdots !== 1) P(k, 'A4', `A2 ${id}/${k}: ${s.zdots} #zdots in the document`);
        if (s.dup.length) P(k, 'A4', `A2 ${id}/${k}: duplicate ids in the document: ${s.dup.join(', ')}`);
        if (JSON.stringify(s.halves) !== '["Right","Wrong"]') P(k, 'chip', `A6 ${id}/${k}: role=img halves ${JSON.stringify(s.halves)}`);
        // L3
        cur = [k, 'L3'];
        await app.page.mouse.move(0, 0);
        const ra = await place(app.page, sel, 'app'), rg = await place(g.page, sel, 'golden', ra.y);
        if (!ra.fits || !rg.fits) P(k, 'L3', `A3 L3 ${id}/${k}: the panel does not fit in the viewport (app ${JSON.stringify(ra)}, golden ${JSON.stringify(rg)})`);
        delete ra.fits; delete rg.fits;
        if (ra.y !== rg.y || ra.x !== rg.x || ra.width !== rg.width) P(k, 'L3', `A3 L3 ${id}/${k}: panel at ${JSON.stringify(ra)} in the app, ${JSON.stringify(rg)} in golden B`);
        if (process.env.HT7_BITE === k) await app.page.evaluate(sel => { const e = [...document.querySelectorAll(`${sel} svg path`)].find(p => !p.closest('defs, clipPath, pattern, mask, text') && p.getBoundingClientRect().width > 4); e.setAttribute('transform', `translate(1 0) ${e.getAttribute('transform') ?? ''}`); }, sel); // BITE-TEMP
        const [ia, ig] = await Promise.all([shot(app.page, ra), shot(g.page, rg)]);
        const d = await H.diffPng(app.page, ia, ig);
        stats.pairs++; stats.maxOff = Math.max(stats.maxOff, d.off);
        R.px(lib, theme, S(k, 'L3'), d.off);
        if (!(d.ink > 0.05)) P(k, 'L3', `A3 L3 ${id}/${k}: the capture holds almost no ink (${d.ink}), nothing was compared`);
        const v = await l3(app.page, sel, ra, ia, ig);
        if (v.verdict === 'fail') P(k, 'L3', `A3 L3 ${id}/${k}: ${offText(v.d)}${v.px ? `; ${v.px.outside} of ${v.px.n} differing px outside every SVG text box` : ''}`);
        else if (v.verdict === 'text') {
          const { r, img } = await reopen(app.page, id, k, sel, ra.y);
          const same = r.x === ra.x && r.y === ra.y && r.width === ra.width && r.height === ra.height, d2 = same ? await H.diffPng(app.page, img, ig) : null;
          stats.reopens++;
          if (!d2 || !H.identical(d2)) P(k, 'L3', `A3 L3 ${id}/${k}: ${offText(v.d)} inside SVG text, and the re-open is ${d2 ? offText(d2) : `at ${JSON.stringify(r)}, not ${JSON.stringify(ra)}`}`);
        }
        if (ki === 0 && theme === 'silent-black' && !reduce) {   // control: the same capture half a pixel lower must fail
          cur = [k, 'control'];
          await place(app.page, sel, 'app', ra.y + 0.5);
          const dc = await H.diffPng(app.page, await shot(app.page, ra), ig);
          if (H.meetsRule(dc)) P(k, 'control', `A3 L3 control ${id}/${k}: a 0.5 px shift still passes (${dc.off} px off)`);
          stats.controls++;
        }
        await Promise.all([unplace(app.page, sel), unplace(g.page, sel)]);
        // close, then the plate block is what it was
        cur = [k, 'restore'];
        await app.page.click(`${sel}-close`);
        await app.page.waitForSelector(`${sel}[hidden]`, { state: 'attached' });
        await app.page.$eval('dialog.sheet.ht .sheet-panel', (p, y) => { p.scrollTop = y; }, scroll);
        await H.settleApp(app.page);
        await G.closeZoom(g.page, id, k);
        if (ki === 0) await G.openMistake(g.page, id);
        await app.page.mouse.move(0, 0);
        const after = await shot(app.page, await appPlate(app.page));
        const dr = await H.diffPng(app.page, before, after);
        if (!H.identical(dr)) P(k, 'restore', `A4 ${id}/${k}: the plate block after Close differs from before the open (${dr.off} px)`);
        stats.restores++;
        if (ki === 0) { await app.page.click(`#${id}-mistake`); await H.settleApp(app.page); }
        if (JSON.stringify(fetched) !== JSON.stringify([`posture-${id}`])) P(k, 'A5', `A5 ${id}/${k}: posture chunks fetched ${JSON.stringify(fetched)}, expected this exercise's, once`);
      }
      // a key passes its states only once every check of it ran (the last key after the sheet closed)
      if (ki < keys.length - 1) flush(k, subs); else lastSubs = subs;
    }
    const last = keys[keys.length - 1];
    cur = [last, 'A4'];
    await H.closeHowTo(app.page);
    if (last && await app.page.$('#zdots')) P(last, 'A4', `A2 ${id}: #zdots stays in the document after the sheet closed`);
    if (last) flush(last, lastSubs);
    await app.ctx.close();
  } catch (e) {
    // a crash fails the state it hit; the states of that key and later keys not yet checked stay "not proven"
    const m = `${reduce ? 'reduced ' : ''}crashed: ${e.message.split('\n')[0]}`;
    if (cur[0]) P(cur[0], cur[1], m); else R.fail(lib, theme, stateOf('HT7', 'crashed', WIDTH), m);
  } finally {
    for (const [s, list] of bad) R.check(lib, theme, s, list);
    await g.browser.close();
  }
}
