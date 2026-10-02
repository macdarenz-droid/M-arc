// LIB-12 gate checks (the "LIB-12" block of scripts/screenshot-gate.mjs calls runLib12Gate; also runnable alone:
// `node tools/plates/library/hands/gate-lib12.mjs [chrome path]`). Every LIB-12 drawn pair, in 5 themes at 390, 360
// and 340 px, on a page with the plate tokens, the theme CSS and golden-B HAND_CSS:
//   H4: no horizontal scroll; the SVG and every text in it inside the plate box;
//   H5: each ink class's contrast against the plate >= golden B's minimum for that class in the same theme, measured in
//       the same job on golden-B's push, pull and hang pairs (a class golden B does not draw: >= 3:1, WCAG 1.4.11);
//   the Right and Wrong halves differ in pixels; two renders of one pair give identical pixels.
// Red when no pair loads.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { HERE, MODULES, renderPair } from './pairs.mjs';

const ENGINE = join(HERE, '../../layers/engine');
const THEMES = ['silent-black', 'paper', 'ember', 'emerald', 'midnight'], WIDTHS = [390, 360, 340];

/** Every LIB-12 drawn id and fault, rendered through LIB-7's renderPair or (palm-flat, no handle) the key's render. */
export function lib12Pairs(mods = MODULES) {
  const out = [];
  for (const m of mods.filter(q => q.OWNER === 'LIB-12')) for (const [id, cfg] of Object.entries(m.IDS)) for (const f of cfg.faults) {
    const uid = `g12-${id.replace(/_/g, '-')}-${f}`;
    let svg;
    try { svg = renderPair(id, { uid, fault: f }).svg; } catch (e) {
      if (!/no explicit handle diameter/.test(e.message)) throw e;     // palm-flat until #193's handle rule allows it
      const V = m.VARIANTS[cfg.variant], F = V.faults[f];
      svg = m.render({ uid, right: V.right, wrong: { ...V.right, ...F.pose }, rightNote: V.rightNote, wrongNote: F.label, alt: { right: V.alt, wrong: F.alt } }).svg;
    }
    out.push({ id, fault: f, svg });
  }
  return out;
}

async function pageCss() {
  const { allThemesCss } = await import(pathToFileURL(join(ENGINE, 'themes.mjs')).href);
  const { HAND_CSS } = await import(pathToFileURL(join(ENGINE, 'hand.mjs')).href);
  const font = `data:font/woff2;base64,${readFileSync(join(ENGINE, 'inter-latin-wght-normal.woff2')).toString('base64')}`;
  return `@font-face{font-family:'Inter Variable';src:url('${font}') format('woff2-variations');font-weight:100 900;font-display:block}
${readFileSync(join(ENGINE, 'tokens.css'), 'utf8')}${allThemesCss()}
*,*::before,*::after{box-sizing:border-box}html,body{margin:0;background:var(--surface-2);color:var(--text);font-family:var(--font)}body{padding:16px}${HAND_CSS}`;
}

// In the page: per ink class, the lowest contrast of its colour against the plate's background.
const MEASURE = () => {
  const lum = c => { const m = c.match(/[\d.]+/g).map(Number); const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const bg = getComputedStyle(document.querySelector('.hand-plate')).backgroundColor, out = {};
  for (const e of document.querySelectorAll('.hand-svg *')) {
    if (e.closest('defs, pattern') || e.closest('.u-fill')) continue;
    const g = e.tagName === 'use' ? e.parentElement : null, cls = g ? `${g.parentElement.getAttribute('class')} ${g.getAttribute('class')}` : e.getAttribute('class');
    if (!cls || !/(^|\s)h-/.test(cls) || /h-panel|h-orient|h-divider|h-patch|h-arc/.test(cls)) continue;
    const cs = getComputedStyle(e), col = cs.stroke && cs.stroke !== 'none' ? cs.stroke : cs.fill;
    if (!col || col === 'none' || /rgba\(0, 0, 0, 0\)/.test(col)) continue;
    out[cls] = Math.min(out[cls] ?? Infinity, ratio(col, bg));
  }
  return out;
};

/** Pixels (of two same-size PNGs, base64) whose colour differs by more than 32 in any channel: anti-aliasing noise
 *  from the raster tiles stays below that, a different drawing does not. */
async function pixelDiff(page, a, b) {
  return page.evaluate(async ([a, b]) => {
    const load = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = `data:image/png;base64,${src}`; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    if (ia.width !== ib.width || ia.height !== ib.height) return Infinity;
    const px = im => { const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); return x.getImageData(0, 0, im.width, im.height).data; };
    const [da, db] = [px(ia), px(ib)];
    let n = 0;
    for (let i = 0; i < da.length; i += 4) if (Math.abs(da[i] - db[i]) > 32 || Math.abs(da[i + 1] - db[i + 1]) > 32 || Math.abs(da[i + 2] - db[i + 2]) > 32) n++;
    return n;
  }, [a, b]);
}

/** Run the checks. Returns { problems, stats }. */
export async function runLib12Gate(browser, { pairs: given, themes = THEMES, extraCss = '' } = {}) {
  const problems = [], stats = { pairs: 0, shots: 0 }, css = await pageCss();
  const pairsList = given ?? lib12Pairs();
  if (!pairsList.length) return { problems: ['LIB-12: no pair loaded'], stats };
  const { renderHandPair } = await import(pathToFileURL(join(ENGINE, 'hand.mjs')).href);
  const { PAIRS } = await import(pathToFileURL(join(ENGINE, 'hand-pairs.mjs')).href);
  const golden = Object.entries(PAIRS).map(([k, s]) => renderHandPair({ ...s, uid: `gold-${k}` }).svg);
  const html = (svgs, theme, extra = '') => `<!doctype html><html lang="en" data-theme="${theme}"><head><meta charset="utf-8"><style>${css}${extra}</style></head><body>${svgs.map(s => `<div class="hand-plate">${s}</div>`).join('')}</body></html>`;
  for (const theme of themes) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    // golden B's minimum per ink class, this theme
    await page.setContent(html(golden, theme)); await page.evaluate(() => document.fonts.ready);
    const gold = await page.evaluate(MEASURE);
    for (const { id, fault, svg } of pairsList) {
      const at = `${theme}/${id}/${fault}`;
      for (const w of WIDTHS) {
        await page.setViewportSize({ width: w, height: 900 });
        await page.setContent(html([svg], theme, extraCss)); await page.evaluate(() => document.fonts.ready);
        const fit = await page.evaluate(() => {
          const p = document.querySelector('.hand-plate').getBoundingClientRect(), s = document.querySelector('.hand-svg').getBoundingClientRect();
          const out = [...document.querySelectorAll('.hand-svg text')].filter(t => { const r = t.getBoundingClientRect(); return r.left < s.left - 0.5 || r.right > s.right + 0.5 || r.top < s.top - 0.5 || r.bottom > s.bottom + 0.5; }).map(t => t.textContent);
          return { scroll: document.documentElement.scrollWidth > innerWidth, svgOut: s.left < p.left - 0.5 || s.right > p.right + 0.5, textOut: out };
        });
        if (fit.scroll) problems.push(`${at} @${w}: horizontal scroll`);
        if (fit.svgOut) problems.push(`${at} @${w}: the SVG leaves the plate`);
        if (fit.textOut.length) problems.push(`${at} @${w}: text outside the SVG: ${fit.textOut.join(', ')}`);
        if (w !== 390) continue;
        const m = await page.evaluate(MEASURE);
        for (const [k, v] of Object.entries(m)) { const need = gold[k] ?? 3; if (v + 1e-9 < need) problems.push(`${at}: ${k} contrast ${v.toFixed(2)} < ${need.toFixed(2)}`); }
        const shot = (sel, clip) => (clip ? page.screenshot({ clip }) : page.locator(sel).screenshot()).then(b => b.toString('base64'));
        const a = await shot('.hand-plate');
        // Right vs Wrong: only the two drawings (no dots, heads or divider), the two 171-unit columns of the 358-unit
        // pair at 1:1 (390 px viewport), so equal drawings give equal pixels
        const box = await page.evaluate(() => { for (const e of document.querySelectorAll('.hand-svg > :not(defs):not(.h-panel)')) e.style.visibility = 'hidden';
          document.querySelector('.hand-svg').style.width = '358px';   // 1 unit = 1 px, so the column offset 187 is whole pixels
          const r = document.querySelector('.hand-svg').getBoundingClientRect(); return { x: r.x + scrollX, y: r.y + scrollY, w: r.width, h: r.height }; });
        const k = box.w / 358, col = x0 => ({ x: box.x + x0 * k, y: box.y + 66 * k, width: 166 * k, height: box.h - 70 * k });   // inside the plate's border
        const changed = await pixelDiff(page, await shot(null, col(0)), await shot(null, col(187)));
        if (changed < 50) problems.push(`${at}: Right and Wrong halves differ in only ${changed} px (< 50)`);
        await page.setContent(html([svg], theme, extraCss)); await page.evaluate(() => document.fonts.ready);
        if ((await shot('.hand-plate')) !== a) problems.push(`${at}: two renders differ in pixels`);
        stats.shots += 4;
      }
      stats.pairs++;
    }
    await ctx.close();
  }
  return { problems, stats };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const { createRequire } = await import('node:module');
  const { chromium } = createRequire(join(HERE, '../../../../package.json'))('playwright');
  const browser = await chromium.launch({ executablePath: process.argv[2] ?? process.env.MARC_CHROMIUM ?? '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--disable-lcd-text'] });
  try {
    const { problems, stats } = await runLib12Gate(browser);
    console.log(JSON.stringify({ stats, problems }, null, 1));
    process.exit(problems.length ? 1 : 0);
  } finally { await browser.close(); }
}
