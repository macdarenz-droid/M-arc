// LIB-7 gate checks (hands/DESIGN.md §4 A5), run by scripts/screenshot-gate.mjs block "LIB-7" with the gate's browser, or
// alone: node tools/plates/library/hands/gate.mjs [chrome path]. Every drawn page renders through hands/zoom.mjs, styled
// by golden B's own zoom CSS, in 5 themes:
//   H4  at 390, 360 and 340 px: no horizontal scroll, the hand SVG inside the page;
//   H5  each ink class's contrast against the plate >= the minimum of the same class on golden B's 8 hands, same job;
//   G9  every bend value's real box clear of its half's outline (isPointInFill on the half's <defs> paths);
//   R/W Right and Wrong hands differ in pixels (outline layer alone, each half shot at the same place);
//   det two renders of a page are pixel-identical.
// It fails when it finds no page to check.
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { INDEX, pairSpec, ROOT } from './pairs.mjs';
import { pairZoom } from './zoom.mjs';
import { pageHtml, THEME_IDS, zoomTextsOf } from './page.mjs';
import { approvedHand } from './sheet.mjs';

const WIDTHS = [390, 360, 340];
const GOLD = [['dumbbell_lateral_raise'], ['pull_up', 'p1'], ['pull_up', 'p2'], ['hanging_leg_raise', 'p1'], ['lat_pulldown', 'p1'], ['lat_pulldown', 'p2'],
  ['seated_cable_row'], ['machine_chest_press'], ['barbell_back_squat'], ['leg_press']];

/** Every drawn page of one owner's keys: [{ id, page, html }]. `index` lets a test plant a defect. */
export function gatePages(index = INDEX, owner = 'LIB-7') {
  const out = [];
  for (const [id, e] of index.drawn) {
    if (e.mod.OWNER !== owner) continue;
    const z = pairZoom(id, zoomTextsOf(id, index), {}, { index });
    for (const w of pairSpec(id, index).wrong) out.push({ id, page: w.key, html: z.handZoom(w.key) });
  }
  return out;
}

// in the page: per ink key (the element's class or its nearest h-* ancestor's, plus stroke/fill), the lowest contrast
// against the plate background; colours as the browser computes them (rgb, rgba or color(srgb ...))
const CONTRAST = () => {
  const rgb = s => { const m = s.match(/rgba?\(([^)]+)\)/), c = s.match(/color\(srgb ([^)]+)\)/);
    if (m) { const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [v[0], v[1], v[2], v[3] ?? 1]; }
    if (c) { const v = c[1].split(/[ /]+/).filter(Boolean).map(Number); return [v[0] * 255, v[1] * 255, v[2] * 255, v[3] ?? 1]; }
    return null; };
  const lum = ([r, g, b]) => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const out = {};
  for (const svg of document.querySelectorAll('.hand-svg')) {
    const bg = rgb(getComputedStyle(svg.closest('.hand-plate')).backgroundColor);
    for (const el of svg.querySelectorAll('path, circle, use, text, rect')) {
      if (el.closest('defs')) continue;
      const own = el.getAttribute('class'), anc = el.parentElement.closest('[class^="h-"], [class*=" h-"]');
      const key = own ?? anc?.getAttribute('class');
      if (!key || key === 'dot') continue;
      const cs = getComputedStyle(el);
      for (const prop of ['stroke', 'fill']) {
        const v = cs[prop]; if (!v || v === 'none' || v.startsWith('url')) continue;
        if (prop === 'stroke' && parseFloat(cs.strokeWidth) === 0) continue;
        const c = rgb(v); if (!c) { out[`${key}|${prop}`] = -1; continue; }
        const a = c[3] * parseFloat(cs.opacity || 1), mix = [0, 1, 2].map(i => c[i] * a + bg[i] * (1 - a));
        const L1 = lum(mix), L2 = lum(bg), r = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        const k = `${key}|${prop}`; out[k] = Math.min(out[k] ?? Infinity, +r.toFixed(3));
      }
    }
  }
  return out;
};
// in the page: bend values whose real box covers an outline point of their half
const LABELS = () => {
  const bad = [];
  for (const svg of document.querySelectorAll('.hand-svg')) for (const t of svg.querySelectorAll('text.h-val')) {
    const wrong = t.classList.contains('m'), b = t.getBBox();
    const uid = svg.querySelector('defs path[id]')?.id.replace(/-[rw]-.*$/, '');
    const inks = [...svg.querySelectorAll(`defs path[id^="${uid}-${wrong ? 'w' : 'r'}-"]`)];
    let hit = null;
    for (let i = 0; i <= 8 && !hit; i++) for (let j = 0; j <= 4 && !hit; j++) {
      const p = new DOMPoint(b.x + b.width * i / 8, b.y + b.height * j / 4);
      hit = inks.find(e => e.isPointInFill(p))?.id ?? null;
    }
    if (hit) bad.push(`${t.textContent} over ${hit}`);
  }
  return bad;
};

export async function lib7Gate(browser, { index = INDEX, owner = 'LIB-7', themes = THEME_IDS, widths = WIDTHS, out = null, css } = {}) {
  const problems = [], pages = gatePages(index, owner);
  if (!pages.length) return { problems: ['LIB-7: no hand pair page to check'], pages: 0 };
  const ctx = await browser.newContext({ deviceScaleFactor: 2 });
  const shots = { n: 0 };
  // `css` (a planted defect) styles the pair pages only; golden B's floor is always measured with its own CSS
  const open = async (body, theme, width, pageCss = css) => {
    const p = await ctx.newPage(); await p.setViewportSize({ width, height: 900 });
    await p.setContent(pageHtml(body, theme, { width, ...(pageCss ? { css: pageCss } : {}) }), { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
    return p;
  };
  try {
    // golden B's contrast floor, per ink key and theme, measured now on the 8's hands
    const goldBody = (await Promise.all(GOLD.map(([id, pg]) => approvedHand(id, pg)))).map((s, i) => `<div class="hand-plate">${s.replace(/id="([^"]+)"/g, `id="g${i}-$1"`).replace(/#([a-z][\w-]*)/g, `#g${i}-$1`)}</div>`).join('');
    const floor = {};
    for (const theme of themes) { const p = await open(goldBody, theme, 390, null); floor[theme] = await p.evaluate(CONTRAST); await p.close(); }
    for (const { id, page, html } of pages) {
      const at = `${id}/${page}`;
      for (const theme of themes) {
        for (const width of widths) {
          const p = await open(html, theme, width);
          const fit = await p.evaluate(() => { const r = document.querySelector('.hand-svg').getBoundingClientRect();
            return { scroll: document.documentElement.scrollWidth, right: r.right, left: r.left, w: innerWidth }; });
          if (fit.scroll > width || fit.right > width + 0.5 || fit.left < -0.5) problems.push(`${at} ${theme} @${width}: H4 overflow ${JSON.stringify(fit)}`);
          if (width === 390) {
            const c = await p.evaluate(CONTRAST);
            for (const [k, v] of Object.entries(c)) {
              const g = floor[theme][k];
              if (g === undefined) problems.push(`${at} ${theme}: H5 ink ${k} has no golden-B counterpart`);
              else if (v < g - 0.001) problems.push(`${at} ${theme}: H5 ${k} contrast ${v} < golden B ${g}`);
            }
            for (const l of await p.evaluate(LABELS)) problems.push(`${at} ${theme}: G9 ${l}`);
          }
          await p.close();
        }
      }
      // pixel checks, Silent Black at 390
      const shot = async (body, extraCss = '') => { const p = await open(body + (extraCss ? `<style>${extraCss}</style>` : ''), 'silent-black', 390);
        const box = await p.locator('.hand-svg').first().boundingBox(); shots.n++;
        const png = await p.screenshot({ clip: { x: box.x, y: box.y, width: box.width, height: box.height } });
        await p.close(); return png;
      };
      const a = await shot(html), b = await shot(html);
      if (!a.equals(b)) problems.push(`${at}: two renders differ in pixels`);
      // Right vs Wrong: the outline layer alone (skin and far fingers; labels, markers and the dot grid hidden), each half
      // shot on its own at the Right half's place (the Wrong half drawn 187 user units to the right, so moved back by
      // exactly that), so identical hands give identical pixels
      const bare = '.hand-svg .h-panel > :not(.h-skin):not(.h-far), .hand-svg text, .hand-svg > rect, .hand-svg > path, .hand-svg > g:not(.h-panel) { display: none }';
      const rightOnly = await shot(html, `${bare} .hand-svg .h-panel.wrong { display: none }`);
      const wrongOnly = await shot(html, `${bare} .hand-svg .h-panel.right { display: none } .hand-svg .h-panel.wrong { transform: translate(-${358 / 2 - 8 + 16}px, 0) }`);
      if (rightOnly.equals(wrongOnly)) problems.push(`${at}: Right and Wrong hands are the same picture`);
      if (out) { const { writeFileSync } = await import('node:fs'); writeFileSync(join(out, `lib7-${id}-${page}.png`), a); }
    }
  } finally { await ctx.close(); }
  return { problems, pages: pages.length, themes: themes.length, widths: widths.length, shots: shots.n };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { chromium } = createRequire(join(ROOT, 'package.json'))('playwright');
  const b = await chromium.launch({ executablePath: process.argv[2] ?? '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--disable-lcd-text'] });
  try {
    const t0 = Date.now(), r = await lib7Gate(b);
    console.log(`${b.version()}: ${r.pages} pages x ${r.themes} themes x ${r.widths} widths, ${r.shots} shots, ${(Date.now() - t0) / 1000} s`);
    console.log(r.problems.length ? r.problems.join('\n') : 'LIB-7 gate: PASS');
    process.exitCode = r.problems.length ? 1 : 0;
  } finally { await b.close(); }
}
