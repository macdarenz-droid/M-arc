// LIB-3 browser checks (plan 3.2): PQ-H1's browser half (real text boxes: 8 px edge, no overlap, not on ink or a key
// joint; Inter loaded; no horizontal scroll), PQ-H4 (390/360/340 px: text inside the plate, 44 x 44 callout hit boxes
// that do not overlap, tempo strip inside), PQ-H5 (contrast per plate-drawn class in 5 themes against the approved
// minimum), and the measured flags F2 (figure coverage) and F5 (label text below 4.5:1). The page is opened through the
// HT-1 harness (offline, the app's Inter woff2), exactly as the fidelity gate opens the golden page.
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { interLoaded, openGolden, settle } from '../../fidelity/harness.mjs';
import { rendersOf } from './node.mjs';

export const THEMES = ['silent-black', 'paper', 'midnight', 'ember', 'emerald'];
export const WIDTHS = [390, 360, 340];
export const CLASSES = ['label', 'ink', 'trace', 'mistake'];
export const F5_MIN = 4.5;      // plan 3.3 F5 (WCAG AA body text)
export const EDGE = 8, JOINT = 3, HIT = 44, SIZE = 358;

export async function launch() {
  const executablePath = process.env.MARC_CHROMIUM ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
  return chromium.launch(executablePath ? { executablePath } : {});
}

const P = (key, text) => ({ key, text });

// ---- in-page measurement (one card): boxes in plate px, contrast per class, coverage ----
const MEASURE = ([id, joints, mode, geo]) => {
  const fit = document.getElementById(`${id}-plate`), fig = fit.querySelector(`figure.plate[data-mode="${mode}"]`), F = fig.getBoundingClientRect();
  const k = 358 / F.width, toPlate = r => ({ x0: (r.left - F.left) * k, y0: (r.top - F.top) * k, x1: (r.right - F.left) * k, y1: (r.bottom - F.top) * k });
  const textBox = el => { const rg = document.createRange(); rg.selectNodeContents(el.tagName === 'SPAN' && el.classList.contains('plate-arc-label') ? el : el); const rs = [...rg.getClientRects()].filter(r => r.width > 0 && r.height > 0);
    if (!rs.length) return null; return { left: Math.min(...rs.map(r => r.left)), top: Math.min(...rs.map(r => r.top)), right: Math.max(...rs.map(r => r.right)), bottom: Math.max(...rs.map(r => r.bottom)) }; };
  const labels = [...fig.querySelectorAll('.plate-meta, .plate-callout, .plate-arc-label')].map(el => {
    const tb = textBox(el);
    return { key: el.dataset.key ?? (el.classList.contains('plate-meta') ? 'meta' : 'arc'), callout: el.classList.contains('plate-callout'), text: toPlate(tb), css: { x0: tb.left, y0: tb.top, x1: tb.right, y1: tb.bottom }, hit: el.classList.contains('plate-callout') ? (() => { const r = el.getBoundingClientRect(); return { x0: r.left, y0: r.top, x1: r.right, y1: r.bottom, w: r.width, h: r.height }; })() : null };
  });
  // ink: every drawn path/circle except leaders, anchors, hidden guides and the dot pattern; tested in plate px
  const svg = fig.querySelector('svg.plate-svg'), shown = el => { for (let e = el; e && e !== svg; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return false; } return true; };
  const skip = el => el.closest('defs, pattern, mask') || el.matches('.leader, .anchor, .lead-guide');
  const geoms = [];
  for (const el of svg.querySelectorAll('path, circle, use')) {
    if (skip(el) || !shown(el)) continue;
    const cs = getComputedStyle(el), sw = cs.stroke !== 'none' ? parseFloat(cs.strokeWidth) || 0 : 0, fill = cs.fill !== 'none';
    const g = el.tagName === 'use' ? document.querySelector(el.getAttribute('href')) : el;
    if (g) geoms.push({ g, sw, fill });
  }
  const pt = svg.createSVGPoint();
  const onInk = b => { for (let y = Math.ceil(b.y0); y <= b.y1; y++) for (let x = Math.ceil(b.x0); x <= b.x1; x++) { pt.x = x; pt.y = y;
    for (const { g, sw, fill } of geoms) { if (fill && g.isPointInFill(pt)) return [x, y]; if (sw > 0) { const old = g.style.strokeWidth; g.style.strokeWidth = sw; const hit = g.isPointInStroke(pt); g.style.strokeWidth = old; if (hit) return [x, y]; } } } return null; };
  const jointPts = joints ?? [...svg.querySelectorAll('.pose-end circle.joint')].map(c => ({ k: 'mark', p: [+c.getAttribute('cx'), +c.getAttribute('cy')] }));
  if (geo) for (const l of labels) { l.ink = onInk(l.text); l.joints = jointPts.filter(j => j.p[0] > l.text.x0 - 3 && j.p[0] < l.text.x1 + 3 && j.p[1] > l.text.y0 - 3 && j.p[1] < l.text.y1 + 3).map(j => j.k); }
  // figure coverage (normal figure only): union bbox of the start, ghost and end layers
  let cover = null;
  if (mode === 'normal') { const bs = [...svg.querySelectorAll('g.pose-start, g.ghost, g.pose-end')].map(g => g.getBBox()).filter(b => b.width > 0);
    const x0 = Math.min(...bs.map(b => b.x)), y0 = Math.min(...bs.map(b => b.y)), x1 = Math.max(...bs.map(b => b.x + b.width)), y1 = Math.max(...bs.map(b => b.y + b.height));
    cover = Math.max(0, Math.min(358, x1) - Math.max(0, x0)) * Math.max(0, Math.min(358, y1) - Math.max(0, y0)) / (358 * 358); }
  // contrast: computed colour with ancestor opacity over the plate backdrop
  // any CSS colour syntax (rgb, color(), oklch, color-mix) composited over an opaque sRGB backdrop, in a 1x1 canvas
  const cv = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true });
  const over = (css, a, bg) => { cv.globalAlpha = 1; cv.fillStyle = `rgb(${bg.map(Math.round).join(',')})`; cv.fillRect(0, 0, 1, 1);
    cv.globalAlpha = a; cv.fillStyle = '#000'; cv.fillStyle = css; cv.fillRect(0, 0, 1, 1); cv.globalAlpha = 1; const d = cv.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2]]; };
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const paints = s => s && s !== 'none' && !s.startsWith('url(');
  const bgOf = el => { const chain = []; for (let e = el; e; e = e.parentElement) chain.push(e); let bg = [255, 255, 255];
    for (const e of chain.reverse()) { const c = getComputedStyle(e).backgroundColor; if (paints(c)) bg = over(c, 1, bg); } return bg; };
  const opa = el => { let o = 1; for (let e = el; e && e !== fig.parentElement; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity); return o; };
  const plateBg = bgOf(fig);
  const contrast = {}, where = {};
  const add = (cls, c, el) => { if (c < (contrast[cls] ?? Infinity)) { contrast[cls] = c; where[cls] = `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}${el.dataset?.key ? `[${el.dataset.key}]` : ''}${el.getAttribute('aria-pressed') === 'true' ? '[pressed]' : ''}`; } };
  for (const el of fig.querySelectorAll('.plate-meta, .plate-callout, .plate-arc-label b, .plate-arc-label span')) {
    if (!shown(el)) continue;
    let bg = bgOf(el); const be = getComputedStyle(el, '::before');
    if (el.classList.contains('plate-callout') && paints(be.backgroundColor) && parseFloat(be.opacity) > 0) bg = over(be.backgroundColor, parseFloat(be.opacity), bg);
    add('label', ratio(over(getComputedStyle(el).color, opa(el), bg), bg), el);
  }
  const strokeC = (sel, cls) => { for (const el of svg.querySelectorAll(sel)) { if (!shown(el)) continue; const cs = getComputedStyle(el); if (!paints(cs.stroke)) continue;
    add(cls, ratio(over(cs.stroke, parseFloat(cs.strokeOpacity) * opa(el), plateBg), plateBg), el); } };
  strokeC('.pose-end .u-stroke use', 'ink'); strokeC('path.trace', 'trace'); strokeC('.m-pose .u-stroke use, .mistake-layer path.m-arrow, .mistake-layer path.m-line', 'mistake');
  // tempo strip
  const tempo = document.querySelector(`#card-${id} .tempo`), tr = tempo.getBoundingClientRect();
  const tempoOut = [...tempo.querySelectorAll('.tempo-label')].filter(l => { const r = l.getBoundingClientRect(); return r.left < tr.left - 0.5 || r.right > tr.right + 0.5; }).length;
  return { labels, cover, contrast, where, zoom: F.width / 358, plate: { x0: F.left, y0: F.top, x1: F.right, y1: F.bottom }, tempo: { scroll: tempo.scrollWidth, client: tempo.clientWidth, out: tempoOut } };
};

async function showMode(page, id, mode) {
  await page.evaluate(([id, mode]) => { const pill = document.getElementById(`${id}-mistake`); if ((pill.getAttribute('aria-pressed') === 'true') !== (mode === 'mistake')) pill.click(); }, [id, mode]);
  await settle(page);
}
const overlap = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));

/** Raw browser measurements of every card in `html`: { [chromeId]: { [theme]: { [width]: { normal, mistake } } } , font, scroll }. */
export async function measurePage(browser, html, cands, E, { themes = THEMES, widths = WIDTHS, css = null } = {}) {
  const joints = new Map(cands.map(c => { const R = rendersOf(c, E); return [c.chromeId, R ? R.normal.report.keyJoints : null]; }));
  const out = {}, errors = [];
  for (const theme of themes) for (const w of widths) {
    const { ctx, page } = await openGolden(browser, theme, { viewport: { width: w, height: 844 }, html, onError: m => errors.push(m) });
    try {
      if (css) { await page.addStyleTag({ content: css }); await settle(page); }
      const font = await interLoaded(page), scroll = await page.evaluate(() => document.scrollingElement.scrollWidth - innerWidth);
      for (const c of cands) {
        const r = (out[c.chromeId] ??= {})[theme] ??= {};
        const at = r[w] = { font, scroll };
        for (const mode of ['normal', 'mistake']) {
          await showMode(page, c.chromeId, mode);
          at[mode] = await page.evaluate(MEASURE, [c.chromeId, joints.get(c.chromeId), mode, theme === themes[0] && w === 390]);
        }
        await showMode(page, c.chromeId, 'normal');
      }
    } finally { await ctx.close(); }
  }
  return { cards: out, errors };
}

/** PQ-H1 (browser half), H4, H5, F2, F5 of one card from its measurements, against the pinned envelope. */
export function judge(c, m, envelope) {
  const H1 = [], H4 = [], H5 = [], seen = new Set();
  const push = (arr, p) => { if (!seen.has(p.key)) { seen.add(p.key); arr.push(p); } };
  let coverMin = Infinity, coverMax = -Infinity, labelMin = Infinity;
  for (const [theme, byW] of Object.entries(m)) for (const [w, at] of Object.entries(byW)) {
    if (!at.font) push(H1, P('H1.font', 'Inter Variable did not load'));
    if (at.scroll > 0) push(H1, P(`H1.hscroll:${w}`, `horizontal scroll of ${at.scroll} px at ${w} px`));
    for (const mode of ['normal', 'mistake']) {
      const d = at[mode];
      if (+w === 390) {   // plate-px checks: the plate is 358 px wide here (no zoom), so they run once per theme
        d.labels.forEach((l, i) => {
          const t = l.text, name = `${mode}:${l.key}`;
          if (t.x0 < EDGE || t.y0 < EDGE || t.x1 > SIZE - EDGE || t.y1 > SIZE - EDGE) push(H1, P(`H1.edge:${name}`, `${name} text box ${fmt(t)} is within ${EDGE} px of the plate edge`));
          d.labels.slice(i + 1).forEach(o => { if (overlap(t, o.text) > 0) push(H1, P(`H1.overlap:${mode}:${l.key}|${o.key}`, `${mode}: text boxes ${l.key} and ${o.key} overlap`)); });
          if (l.ink) push(H1, P(`H1.ink:${name}`, `${name} text box sits on figure ink at ${l.ink}`));
          for (const j of l.joints ?? []) push(H1, P(`H1.joint:${name}:${j}`, `${name} text box is within ${JOINT} px of key joint ${j}`));
        });
        if (mode === 'normal') { coverMin = Math.min(coverMin, d.cover); coverMax = Math.max(coverMax, d.cover); }
      }
      for (const l of d.labels) {
        const p = d.plate, t = l.css;
        if (t.x0 < p.x0 - 0.01 || t.y0 < p.y0 - 0.01 || t.x1 > p.x1 + 0.01 || t.y1 > p.y1 + 0.01) push(H4, P(`H4.outside:${w}:${mode}:${l.key}`, `${w} px: ${mode} ${l.key} text leaves the plate`));
      }
      // 44 CSS px at 390 (zoom 1); where the approved chrome shrinks every plate (zoom < 1 below 390 px, the same on
      // all 8), 44 x that pinned zoom. A card whose zoom differs from the pinned chrome zoom is a problem of its own.
      const z = envelope.H4zoom?.[w];
      if (z == null) push(H4, P(`H4.unpinned:${w}`, `no pinned chrome zoom at ${w} px`));
      else if (Math.abs(d.zoom - z) > 0.0005) push(H4, P(`H4.zoom:${w}`, `${w} px: plate zoom ${d.zoom.toFixed(4)} != the approved chrome zoom ${z}`));
      const min = HIT * (z ?? 1) - 0.01, hits = d.labels.filter(l => l.callout);
      hits.forEach((a, i) => {
        if (a.hit.w < min || a.hit.h < min) push(H4, P(`H4.small:${mode}:${a.key}`, `${mode} callout ${a.key} hit box ${a.hit.w.toFixed(1)}x${a.hit.h.toFixed(1)} < ${(min + 0.01).toFixed(1)} px square (44 x zoom ${z}, at ${w} px)`));
        hits.slice(i + 1).forEach(b => { const o = overlap(a.hit, b.hit); if (o > 0) push(H4, P(`H4.overlap:${mode}:${a.key}|${b.key}`, `${mode} callouts ${a.key} and ${b.key} hit boxes overlap by ${o.toFixed(2)} px² (at ${w} px)`)); });
      });
      if (d.tempo.scroll > d.tempo.client || d.tempo.out) push(H4, P(`H4.tempo:${w}`, `${w} px: tempo strip overflows (${d.tempo.scroll} > ${d.tempo.client}, ${d.tempo.out} labels outside)`));
      for (const cls of CLASSES) {
        const v = d.contrast[cls];
        if (v == null) continue;
        if (cls === 'label') labelMin = Math.min(labelMin, v);
        const floor = envelope.H5?.[theme]?.[cls];
        if (floor == null) push(H5, P(`H5.unpinned:${theme}:${cls}`, `no approved minimum for ${cls} in ${theme}`));
        else if (v < floor) push(H5, P(`H5.contrast:${theme}:${cls}`, `${theme}: ${cls} contrast ${v.toFixed(2)} < the approved minimum ${floor}`));
      }
    }
  }
  const F2 = envelope.F2 ? { value: +coverMin.toFixed(4), range: envelope.F2, raised: coverMin < envelope.F2[0] || coverMax > envelope.F2[1] } : { value: coverMin, raised: true, why: 'no F2 envelope' };
  const F5 = { value: +labelMin.toFixed(2), min: F5_MIN, raised: !(labelMin >= F5_MIN) };
  return { H1, H4, H5, flags: { F2, F5 }, metrics: { cover: +coverMin.toFixed(4), labelContrast: +labelMin.toFixed(2) } };
}
const fmt = b => `[${[b.x0, b.y0, b.x1, b.y1].map(v => v.toFixed(1)).join(', ')}]`;

/** Browser results for runQa: Map(id -> judge result). */
export async function browserResults(browser, html, cands, E, envelope, opts) {
  const { cards, errors } = await measurePage(browser, html, cands, E, opts);
  if (errors.length) throw new Error(`plate page errors: ${errors.join('; ')}`);
  return new Map(cands.map(c => [c.id, judge(c, cards[c.chromeId], envelope)]));
}

/** The browser half of the envelope, measured on the 8: H5 minimum per theme and class, F2 [min, max]. */
export async function measureBrowserEnvelope(browser, html, cands, E) {
  const { cards, errors } = await measurePage(browser, html, cands, E);
  if (errors.length) throw new Error(`golden page errors: ${errors.join('; ')}`);
  const lo = v => Math.floor(v * 1000) / 1000, hi = v => Math.ceil(v * 1000) / 1000, H5 = {}, covers = [];
  for (const c of cands) for (const theme of THEMES) for (const w of WIDTHS) for (const mode of ['normal', 'mistake']) {
    const d = cards[c.chromeId][theme][w][mode];
    for (const cls of CLASSES) if (d.contrast[cls] != null) (H5[theme] ??= {})[cls] = Math.min(H5[theme][cls] ?? Infinity, d.contrast[cls]);
    if (mode === 'normal' && w === 390) covers.push(d.cover);
  }
  for (const t of Object.keys(H5)) for (const k of Object.keys(H5[t])) H5[t][k] = lo(H5[t][k]);
  const H4zoom = {};
  for (const w of WIDTHS) {
    const zs = new Set(cands.flatMap(c => THEMES.flatMap(t => ['normal', 'mistake'].map(m => cards[c.chromeId][t][w][m].zoom.toFixed(4)))));
    if (zs.size !== 1) throw new Error(`the approved chrome zoom at ${w} px differs between plates: ${[...zs]}`);
    H4zoom[w] = +[...zs][0];
  }
  return { H5, F2: [lo(Math.min(...covers)), hi(Math.max(...covers))], H4zoom };
}
