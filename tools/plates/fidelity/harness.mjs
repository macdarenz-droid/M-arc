// Fidelity harness (HT-1; HT-3 reuses it): serve a golden page offline with the app's Inter woff2, capture a
// block of it, and compare two captures pixel by pixel in the browser (canvas getImageData; no new dependency).
// Build and gate time only; never bundled.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
export const FONT = join(ROOT, 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2');
export const GOLDEN_PAGE = join(ROOT, 'tests/howto/golden/technical-plates.html');

/** The phone the plates were approved on: 390 x 844 CSS px at DPR 2 (plan 2.7, L3). */
export const DEVICE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 };

/** L3 pass rule (plan 2.7): no channel off by more than 1/255, at most 0.02 % of pixels off by exactly 1.
 * Changing it is a supervisor decision, never a builder fix. */
export const RULE = { maxChannelDelta: 1, maxOffByOneFraction: 0.0002 };

export const ORIGIN = 'http://golden.invalid';
const FONT_URL = `${ORIGIN}/__fidelity/inter-latin-wght-normal.woff2`;

/** The one declared normalisation: 'Inter Variable' from the app's woff2, declared as engine/sheet.mjs declares it. */
export const fontFaceCss = url => `@font-face { font-family: 'Inter Variable'; src: url('${url}') format('woff2-variations'); font-weight: 100 900; font-display: block; }`;

/**
 * Routes every request of a browser context: `pages` ({ '/path': bytes }) are served from ORIGIN, the Google Fonts
 * stylesheet request is answered with fontFaceCss (so the golden HTML bytes stay unchanged), the woff2 is served from
 * disk, and anything else is aborted and listed in the returned `blocked` array (the page must not need the network).
 */
export async function routeOffline(ctx, pages, font = FONT) {
  const blocked = [];
  const woff2 = readFileSync(font);
  await ctx.route('**/*', route => {
    const url = route.request().url();
    if (url === FONT_URL) return route.fulfill({ status: 200, contentType: 'font/woff2', body: woff2 });
    if (url.startsWith('https://fonts.googleapis.com/css')) return route.fulfill({ status: 200, contentType: 'text/css', body: fontFaceCss(FONT_URL) });
    if (url.startsWith(`${ORIGIN}/`)) {
      const body = pages[new URL(url).pathname];
      if (body !== undefined) return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body });
    }
    blocked.push(url);
    return route.abort();
  });
  return { blocked };
}

/** Fonts loaded, no animation or transition left, two frames painted. */
export async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.getAnimations().length === 0, null, { timeout: 5000 });
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
}

/** True only when 'Inter Variable' really loaded from the woff2 (a probe must fail when the font is missing). */
export const interLoaded = page => page.evaluate(() => [...document.fonts].some(f => f.family.replace(/["']/g, '') === 'Inter Variable' && f.status === 'loaded'));

/**
 * Scrolls `topSel` to the top of the viewport and returns the viewport clip from its top to the bottom of
 * `bottomSel`, across its own left edge and width. Throws when the block does not fit the viewport.
 */
export async function blockClip(page, topSel, bottomSel) {
  const c = await page.evaluate(([t, b]) => {
    const top = document.querySelector(t), bottom = document.querySelector(b);
    if (!top || !bottom) return null;
    window.scrollTo(0, top.getBoundingClientRect().top + window.scrollY);
    const r = top.getBoundingClientRect(), rb = bottom.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: rb.bottom - r.top, vh: window.innerHeight };
  }, [topSel, bottomSel]);
  if (!c) throw new Error(`blockClip: ${topSel} or ${bottomSel} not found`);
  if (c.y < 0 || c.y + c.height > c.vh) throw new Error(`blockClip: ${topSel}..${bottomSel} (${c.height} px from y ${c.y}) does not fit the ${c.vh} px viewport`);
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  return { x: c.x, y: c.y, width: c.width, height: c.height };
}

/** PNG of a viewport clip. `shiftY` moves the clip (used only by the negative control). */
export const capture = (page, clip, shiftY = 0) => page.screenshot({ clip: { ...clip, y: clip.y + shiftY }, animations: 'disabled', caret: 'hide' });

/**
 * Decodes two PNGs in `page` (no colour conversion) and compares them channel by channel.
 * Returns { sameSize, width, height, total, off, off1, maxDelta, ink } where off counts pixels with any channel
 * different, off1 those whose largest channel difference is exactly 1, and ink the share of pixels in `a` that
 * differ from its top-left pixel (a blank capture has ink 0).
 */
export async function diffPng(page, a, b) {
  return page.evaluate(async ([a64, b64]) => {
    const decode = async s => {
      const blob = await (await fetch(`data:image/png;base64,${s}`)).blob();
      const bmp = await createImageBitmap(blob, { colorSpaceConversion: 'none', premultiplyAlpha: 'none' });
      const cv = new OffscreenCanvas(bmp.width, bmp.height), cx = cv.getContext('2d', { colorSpace: 'srgb' });
      cx.drawImage(bmp, 0, 0);
      return { w: bmp.width, h: bmp.height, d: cx.getImageData(0, 0, bmp.width, bmp.height).data };
    };
    const [A, B] = await Promise.all([decode(a64), decode(b64)]);
    let ink = 0;
    for (let i = 0; i < A.d.length; i += 4) if (A.d[i] !== A.d[0] || A.d[i + 1] !== A.d[1] || A.d[i + 2] !== A.d[2] || A.d[i + 3] !== A.d[3]) ink++;
    const total = A.w * A.h;
    if (A.w !== B.w || A.h !== B.h) return { sameSize: false, width: A.w, height: A.h, otherWidth: B.w, otherHeight: B.h, total, off: total, off1: 0, maxDelta: 255, ink: ink / total };
    let off = 0, off1 = 0, maxDelta = 0;
    for (let i = 0; i < A.d.length; i += 4) {
      const m = Math.max(Math.abs(A.d[i] - B.d[i]), Math.abs(A.d[i + 1] - B.d[i + 1]), Math.abs(A.d[i + 2] - B.d[i + 2]), Math.abs(A.d[i + 3] - B.d[i + 3]));
      if (m) { off++; if (m === 1) off1++; if (m > maxDelta) maxDelta = m; }
    }
    return { sameSize: true, width: A.w, height: A.h, total, off, off1, maxDelta, ink: ink / total };
  }, [a.toString('base64'), b.toString('base64')]);
}

/** The L3 pass rule. */
export const meetsRule = (d, rule = RULE) => d.sameSize && d.maxDelta <= rule.maxChannelDelta && d.off1 <= rule.maxOffByOneFraction * d.total;
/** The self-check rule: the golden against itself must be 0 px. */
export const identical = d => d.sameSize && d.off === 0;

/**
 * HT1-A5 self-check: the golden page, loaded twice in fresh contexts, captured per plate block (plate top to tempo
 * bottom) in every theme x {normal, mistake with the first tell}, must diff 0 px capture for capture. A built-in
 * negative control (the same block shifted 1 px) must fail the L3 rule, so a blind comparison cannot pass.
 * Returns { problems, captures, comparisons, control, ms }.
 */
export async function goldenSelfCheck(browser, { html = readFileSync(GOLDEN_PAGE), shiftSecondRun = 0 } = {}) {
  const t0 = Date.now(), problems = [];
  let control = null;
  // every (load, theme) pair is its own fresh context, run side by side; they share nothing but the browser
  const jobs = [0, 1].flatMap(run => [0, 1, 2, 3, 4].map(ti => ({ run, ti })));
  const loads = await Promise.all(jobs.map(async ({ run, ti }) => {
    const ctx = await browser.newContext({ ...DEVICE });
    const net = await routeOffline(ctx, { '/': html });
    const page = await ctx.newPage();
    page.on('pageerror', e => problems.push(`run ${run}: page error ${e.message}`));
    await page.goto(`${ORIGIN}/`);
    await settle(page);
    if (!(await interLoaded(page))) problems.push(`run ${run}: 'Inter Variable' did not load from the app woff2`);
    const themes = await page.$$eval('.seg', bs => bs.map(b => b.dataset.themeId));
    const cards = await page.$$eval('.sheet-card', cs => cs.map(c => c.dataset.ex));
    if (themes.length !== 5) problems.push(`run ${run}: ${themes.length} themes, expected 5`);
    if (cards.length !== 8) problems.push(`run ${run}: ${cards.length} plate cards, expected 8`);
    const shots = new Map();
    for (const theme of themes.slice(ti, ti + 1)) {
      await page.evaluate(t => document.getElementById(`theme-${t}`).click(), theme);
      await settle(page);
      for (const id of cards) {
        for (const mode of ['normal', 'mistake']) {
          if (mode === 'mistake') { await page.evaluate(i => document.getElementById(`${i}-mistake`).click(), id); await settle(page); }
          const geo = await page.evaluate(i => {
            const fit = document.getElementById(`${i}-plate`), fig = fit.querySelector(`.plate[data-mode="${fit.closest('.sheet-card').querySelector('.tells').hidden ? 'normal' : 'mistake'}"]`);
            return { fit: fit.getBoundingClientRect().width, zoom: getComputedStyle(fig).zoom, mode: fig.dataset.mode, pressed: fit.querySelector(`.plate[data-mode="${fig.dataset.mode}"] .plate-callout[aria-pressed="true"]`)?.dataset.key, first: fit.closest('.sheet-card').dataset[fig.dataset.mode === 'normal' ? 'selN' : 'selM'] };
          }, id);
          if (geo.fit !== 358 || geo.zoom !== '1') problems.push(`run ${run} ${theme} ${id}: .plate-fit is ${geo.fit} px at zoom ${geo.zoom}, expected 358 at 1`);
          if (geo.mode !== mode || geo.pressed !== geo.first) problems.push(`run ${run} ${theme} ${id}: showing ${geo.mode} with ${geo.pressed} selected, expected ${mode} with ${geo.first}`);
          const clip = await blockClip(page, `#${id}-plate`, `#card-${id} .tempo`);
          const key = `${theme}/${id}/${mode}`;
          shots.set(key, await capture(page, clip, run === 1 ? shiftSecondRun : 0));
          if (run === 0 && ti === 0 && !control) control = { key, png: await capture(page, clip, 1) };
          if (mode === 'mistake') { await page.evaluate(i => document.getElementById(`${i}-mistake`).click(), id); await settle(page); }
        }
      }
    }
    if (net.blocked.length) problems.push(`run ${run}: the page asked the network for ${net.blocked.join(', ')}`);
    return { run, shots, page };
  }));
  const runs = [0, 1].map(r => new Map(loads.filter(l => l.run === r).flatMap(l => [...l.shots])));
  const diffPage = loads[0].page;
  for (const l of loads.slice(1)) await l.page.context().close();
  let comparisons = 0;
  for (const [key, a] of runs[0]) {
    const b = runs[1].get(key);
    if (!b) { problems.push(`${key}: no second capture`); continue; }
    const d = await diffPng(diffPage, a, b);
    comparisons++;
    if (d.ink < 0.05) problems.push(`${key}: the capture is nearly blank (ink ${(d.ink * 100).toFixed(1)} %)`);
    if (!identical(d)) problems.push(`${key}: golden vs golden differs: ${JSON.stringify(d)}`);
  }
  const c = await diffPng(diffPage, runs[0].get(control.key), control.png);
  control = { key: control.key, off: c.off, maxDelta: c.maxDelta, fails: !meetsRule(c) };
  if (!control.fails) problems.push(`negative control: ${control.key} shifted 1 px still meets the L3 rule (${JSON.stringify(c)}), so the comparison is blind`);
  if (comparisons !== 80) problems.push(`${comparisons} comparisons, expected 80 (8 plates x 5 themes x 2 states)`);
  await diffPage.context().close();
  return { problems, captures: runs[0].size + runs[1].size, comparisons, control, ms: Date.now() - t0 };
}
