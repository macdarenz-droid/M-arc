// LIB-7b D-LIB7b-PAGEDUP probe (7b-A4 (1); never run in CI). On a built layers page, each pair panel whose key has two
// or more copies is opened with the other copies present and hidden, and compared with the same panel opened on the page
// with the other copies removed, every fault page, light and dark. The rule is D-LIB7b-PAGEDUP-141 (below): exact, except
// Chromium 141's run-to-run text raster (F-LIB7b-2), bounded by text boxes and the pooled control.
//   node tests/library/fixtures/lib7b/pagedup-probe.mjs <browser> <page.html> [--verbatim] [--runs N]
// --control compares the alone page with itself (the browser's own run-to-run variance, no repeat on the page).
// --mutate stroke|label: see below.
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
// --mutate stroke|label (each must be red in both browsers): in the page with both copies, copy 2 gets one drawn path moved
// by 1 px, or one shown label changed; its alone page is left as built.
const mutate = rest.includes('--mutate') ? rest[rest.indexOf('--mutate') + 1] : null;
if (mutate) {
  const c2 = panelsOf(html).filter(p => p.key === keys[0])[1];
  let m = c2.block;
  if (mutate === 'stroke') m = m.replace(/<path (?=[^>]*\bd=")/, '<path transform="translate(1 0)" ');
  else if (mutate === 'label') m = m.replace('>Wrist curled<', '>Wrist curleD<');
  else throw new Error(`pagedup probe: --mutate ${mutate}`);
  if (m === c2.block) throw new Error(`pagedup probe: --mutate ${mutate} changed nothing`);
  html = html.slice(0, c2.at) + m + html.slice(c2.at + c2.block.length);
}
const mode = control ? 'control (alone vs alone)' : verbatim ? 'verbatim' : mutate ? `mutate ${mutate}` : 'namespaced (B)';
const both = `${file}.${verbatim ? 'verbatim' : mutate ? `mutate-${mutate}` : 'page'}.html`; writeFileSync(both, html);

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
      // the text boxes of this shot, in panel pixels: every SVG <text>/<tspan> and every non-empty HTML text node
      const texts = await p.evaluate(() => {
        const pn = [...document.querySelectorAll('.zx[data-zoom="hand"]')].find(x => !x.hidden), o = pn.getBoundingClientRect(), dpr = devicePixelRatio, out = [];
        const add = r => { if (r.width && r.height) out.push([Math.floor((r.left - o.left) * dpr), Math.floor((r.top - o.top) * dpr), Math.ceil((r.right - o.left) * dpr), Math.ceil((r.bottom - o.top) * dpr)]); };
        for (const t of pn.querySelectorAll('text, tspan')) add(t.getBoundingClientRect());
        const w = document.createTreeWalker(pn, NodeFilter.SHOW_TEXT);
        for (let t; (t = w.nextNode());) if (t.textContent.trim() && !t.parentElement.closest('svg')) { const r = document.createRange(); r.selectNodeContents(t); for (const q of r.getClientRects()) add(q); }
        return out;
      });
      out.push({ panel: await panel.screenshot({ animations: 'disabled' }), texts });
    }
    return { out, version: b.version() };
  } finally { await b.close(); }
}
// the differing pixel indices of two same-size PNGs, decoded in a browser canvas ([] when byte-equal; null on a size change)
const decoder = await chromium.launch({ executablePath: exe }), dp = await decoder.newPage();
const diffOf = async (a, c) => (a.equals(c) ? { w: 0, px: [] } : dp.evaluate(async ([a, c]) => {
  const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s; });
  const [x, y] = await Promise.all([load(a), load(c)]);
  if (x.width !== y.width || x.height !== y.height) return null;
  const d = img => { const cv = new OffscreenCanvas(img.width, img.height), g = cv.getContext('2d'); g.drawImage(img, 0, 0); return g.getImageData(0, 0, img.width, img.height).data; };
  const P = d(x), Q = d(y), px = [];
  for (let i = 0; i < P.length; i += 4) if (P[i] !== Q[i] || P[i + 1] !== Q[i + 1] || P[i + 2] !== Q[i + 2] || P[i + 3] !== Q[i + 3]) px.push(i / 4);
  return { w: x.width, px };
}, [a.toString('base64'), c.toString('base64')]));
// D-LIB7b-PAGEDUP-141 (#284 6334811344): Chrome 153 and every other browser: the whole panel exact, every shot. Chromium
// 141 only: a shot passes when every differing pixel lies inside a text box of both shots AND inside the union of the
// control diffs (the alone page shot twice) for the same key, scheme and page, pooled over every run of this invocation.
const shotsAll = [];
let version = '';
for (let r = 1; r <= runs; r++) for (const c of cases) for (const scheme of ['light', 'dark']) {
  const x = await shots(control ? files[c.chrome] : both, c.chrome, scheme), y = await shots(files[c.chrome], c.chrome, scheme), z = await shots(files[c.chrome], c.chrome, scheme);
  version = x.version;
  for (const [i, s] of x.out.entries()) shotsAll.push({ r, c, scheme, i, s, y: y.out[i], d: await diffOf(s.panel, y.out[i].panel), ctl: await diffOf(y.out[i].panel, z.out[i].panel) });
}
await decoder.close();
const lax = version.startsWith('141.'), pool = new Map(), idOf = q => `${q.c.k}|${q.scheme}|${q.i}`;
for (const q of shotsAll) { if (!pool.has(idOf(q))) pool.set(idOf(q), new Set()); for (const k of q.ctl?.px ?? []) pool.get(idOf(q)).add(k); }
const controlPairs = shotsAll.length;
if (lax && controlPairs < 20) throw new Error(`pagedup probe: ${controlPairs} control pairs, need at least 20 (use --runs)`);
const inBoxes = (k, w, boxes) => { const x = k % w, y = (k / w) | 0; return boxes.some(([l, t, r, b]) => x >= l && x < r && y >= t && y < b); };
let bad = 0;
for (const q of shotsAll) {
  const px = q.d?.px, w = q.d?.w;
  let ok, why;
  if (!px) { ok = false; why = 'size changed'; }
  else if (!px.length) { ok = true; why = 'equal'; }
  else if (!lax) { ok = false; why = `${px.length} px off`; }
  else {
    const outText = px.filter(k => !(inBoxes(k, w, q.s.texts) && inBoxes(k, w, q.y.texts))).length, outPool = px.filter(k => !pool.get(idOf(q)).has(k)).length;
    ok = !outText && !outPool; why = `${px.length} px off (${outText} outside text boxes, ${outPool} outside the pooled control)`;
  }
  if (!ok) { bad++; writeFileSync(`${file}.r${q.r}.${q.c.chrome}.${q.scheme}.p${q.i}.diff-both.png`, q.s.panel); writeFileSync(`${file}.r${q.r}.${q.c.chrome}.${q.scheme}.p${q.i}.diff-alone.png`, q.y.panel); }
  console.log(`run ${q.r} ${q.c.k} copy ${q.c.i} (${q.c.chrome}) ${q.scheme} page ${q.i}: ${why}: ${ok ? 'ok' : 'RED'}`);
}
const pooled = [...pool.values()].reduce((n, s) => n + s.size, 0), ctlDiffering = shotsAll.filter(q => q.ctl?.px.length).length;
console.log(`${version} ${mode}: ${shotsAll.length} shots, ${bad} red; ${controlPairs} control pairs (${ctlDiffering} differing, ${pooled} pooled px); rule ${lax ? '141: text boxes and pooled control' : 'exact'}: ${bad ? 'FAIL' : 'PASS'}`);
process.exit(bad ? 1 : 0);
