// LIB-7b D-LIB7b-PAGEDUP probe (7b-A4 (1); never run in CI). On a built layers page, each pair panel whose key has two
// or more copies is opened with the other copies present and hidden, and compared with the same panel opened on the page
// with the other copies removed, every fault page, light and dark: the drawing (the page's hand SVG) exactly in every
// browser; the whole panel exactly, except in Chromium 141, where it may differ by no more than the same run's control
// (the alone page shot twice), the run-to-run HTML text raster measured on #284 (F-LIB7b-2).
//   node tests/library/fixtures/lib7b/pagedup-probe.mjs <browser> <page.html> [--verbatim] [--runs N]
// --control compares the alone page with itself (the browser's own run-to-run variance, no repeat on the page).
// --verbatim first reverses D-LIB7b-PAGEDUP's one named rewrite on every copy (the ruling's default, verbatim repeats).
// Deterministic waits: the page's own reduced-motion state (`data-motion="reduce"`, build-page.mjs:349) so no open
// animation runs (Chromium bakes a mid-animation scale into SVG text: ht7-label-variance-rootcause), fonts loaded,
// every image complete, no running animation, two frames. Each comparison launches a fresh browser (a cold start).
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { divAt, unNamespaced } from '../../../../tools/plates/library/build-layers-page.mjs';

const [exe, file, ...rest] = process.argv.slice(2), verbatim = rest.includes('--verbatim'), control = rest.includes('--control');
const runs = rest.includes('--runs') ? +rest[rest.indexOf('--runs') + 1] : 1;
let html = readFileSync(file, 'utf8');
/** [{ id, pre, key, at, block }] for every pair panel on the page. */
const panelsOf = h => [...h.matchAll(/<div class="zx" id="([a-z0-9-]*hp-[a-z0-9-]+-zoom-hand)" data-zoom="hand"/g)].map(m => {
  const block = divAt(h, m.index), key = block.match(/<div class="hx hx-hp-([a-z0-9-]+)">/)[1];
  return { id: m[1], key, pre: m[1].slice(0, -`hp-${key}-zoom-hand`.length).replace(/-$/, ''), at: m.index, block };
});
if (verbatim) for (const p of panelsOf(html).reverse()) if (p.pre) {
  html = html.slice(0, p.at) + unNamespaced(p.block, p.key, p.pre) + html.slice(p.at + p.block.length);
  html = html.split(`aria-controls="${p.id}"`).join(`aria-controls="hp-${p.key}-zoom-hand"`);
}
const all = panelsOf(html), keys = [...new Set(all.map(p => p.key))].filter(k => all.filter(p => p.key === k).length > 1);
if (!keys.length) throw new Error('pagedup probe: no key with two copies on the page');
const cardOf = (h, p) => h.lastIndexOf('<article class="sheet-card" id="card-', p.at);
const files = {}, cases = [];
for (const k of keys) for (const [i, p] of all.filter(x => x.key === k).entries()) {
  const chrome = html.slice(cardOf(html, p)).match(/id="card-([a-z0-9-]+)"/)[1];
  let alone = html;
  for (const o of all.filter(x => x.key === k && x !== p).sort((a, b) => b.at - a.at)) alone = alone.slice(0, o.at) + alone.slice(o.at + o.block.length);
  const f = `${file}.alone-${chrome}.html`; writeFileSync(f, alone); files[chrome] = f;
  cases.push({ k, i, chrome });
}
const both = `${file}.${verbatim ? 'verbatim' : 'page'}.html`; writeFileSync(both, html);

async function shots(f, chrome, scheme) {
  const b = await chromium.launch({ executablePath: exe });
  try {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: scheme }), p = await ctx.newPage();
    await p.goto('file://' + f);
    await p.evaluate(() => document.documentElement.setAttribute('data-motion', 'reduce'));
    await p.click(`#${chrome}-chip-hand`);
    const panel = p.locator('.zx[data-zoom="hand"]:not([hidden])');
    if (await panel.count() !== 1) throw new Error(`${chrome}: ${await panel.count()} open hand panels`);
    const n = await panel.locator('.zx-page').count(), out = [];
    for (let i = 0; i < n; i++) {
      if (i) await panel.locator(`.zx-page:not([hidden]) .pager-btn[data-page="${i}"]`).click();
      await p.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map(im => (im.complete ? null : new Promise(r => { im.onload = im.onerror = r; }))));
        await Promise.all(document.getAnimations().map(a => a.finished.catch(() => null)));
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      });
      if (await p.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length)) throw new Error(`${chrome}: animation running at the shot`);
      const svg = panel.locator('.zx-page:not([hidden]) .hand-plate svg.hand-svg');
      if (await svg.count() !== 1) throw new Error(`${chrome}: ${await svg.count()} drawings on the page`);
      out.push({ panel: await panel.screenshot({ animations: 'disabled' }), svg: await svg.screenshot({ animations: 'disabled' }) });
    }
    return { out, version: b.version() };
  } finally { await b.close(); }
}
// pixel difference count of two PNGs, decoded in a browser canvas
const decoder = await chromium.launch({ executablePath: exe }), dp = await decoder.newPage();
const diffPx = (a, c) => (a.equals(c) ? 0 : dp.evaluate(async ([a, c]) => {
  const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s; });
  const [x, y] = await Promise.all([load(a), load(c)]);
  if (x.width !== y.width || x.height !== y.height) return Infinity;
  const d = img => { const cv = new OffscreenCanvas(img.width, img.height), g = cv.getContext('2d'); g.drawImage(img, 0, 0); return g.getImageData(0, 0, img.width, img.height).data; };
  const P = d(x), Q = d(y); let n = 0;
  for (let i = 0; i < P.length; i += 4) if (P[i] !== Q[i] || P[i + 1] !== Q[i + 1] || P[i + 2] !== Q[i + 2] || P[i + 3] !== Q[i + 3]) n++;
  return n;
}, [a.toString('base64'), c.toString('base64')]));
// D-LIB7b-PAGEDUP condition (1) as ruled (#284 6334672289): the drawing is compared exactly in every browser; the whole
// panel exactly except in Chromium 141, whose HTML text may differ by no more than the same run's control (alone vs alone).
let bad = 0, n = 0, version = '';
for (let r = 1; r <= runs; r++) {
  const res = [];
  for (const c of cases) for (const scheme of ['light', 'dark']) {
    const x = await shots(control ? files[c.chrome] : both, c.chrome, scheme), y = await shots(files[c.chrome], c.chrome, scheme), z = await shots(files[c.chrome], c.chrome, scheme);
    version = x.version;
    for (const [i, s] of x.out.entries()) res.push({ c, scheme, i, svg: s.svg.equals(y.out[i].svg), px: await diffPx(s.panel, y.out[i].panel), ctl: await diffPx(y.out[i].panel, z.out[i].panel), s, y: y.out[i] });
  }
  const tol = version.startsWith('141.') ? Math.max(0, ...res.map(q => q.ctl)) : 0;
  for (const q of res) {
    n++;
    const ok = q.svg && q.px <= tol;
    if (!ok) { bad++; writeFileSync(`${file}.r${r}.${q.c.chrome}.${q.scheme}.p${q.i}.diff-both.png`, q.s.panel); writeFileSync(`${file}.r${r}.${q.c.chrome}.${q.scheme}.p${q.i}.diff-alone.png`, q.y.panel); }
    console.log(`run ${r} ${q.c.k} copy ${q.c.i} (${q.c.chrome}) ${q.scheme} page ${q.i}: drawing ${q.svg ? 'equal' : 'DIFFERS'}, panel ${q.px} px off (run control max ${tol}, this case's control ${q.ctl}): ${ok ? 'ok' : 'RED'}`);
  }
}
await decoder.close();
console.log(`${version} ${control ? 'control (alone vs alone)' : verbatim ? 'verbatim' : 'namespaced (B)'}: ${n} shots, ${bad} red: ${bad ? 'FAIL' : 'PASS'}`);
process.exit(bad ? 1 : 0);
