// The website's own gate (docs/WEBSITE-DESIGN.md section 13). Builds nothing: serves website/dist with vite preview, walks
// the four pages at 1440x900 and 400x844 with reduced motion off and on, saves a screenshot of each run to website/gate-out/
// and fails on any miss. Run from the repo root after npm run site:build:  npm run site:gate
// (MARC_CHROMIUM points at a chrome binary; otherwise /opt/pw-browsers/chromium, otherwise Playwright's own Chromium.)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { SITE_BASE } from './site.config.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(HERE);
const DIST = join(HERE, 'dist');
const OUT = join(HERE, 'gate-out');
const PORT = '4180';
const ORIGIN = `http://localhost:${PORT}`;
const KB = 1024;
const BUDGET = 120 * KB;
if (!existsSync(join(DIST, 'index.html'))) { console.error('website/dist/index.html is missing: run npm run site:build first'); process.exit(1); }
mkdirSync(OUT, { recursive: true });

// The expected fingerprint, read as text from the one constant that holds it (read only; nothing here signs anything).
const FP = (readFileSync(join(ROOT, '.github/workflows/build-apk.yml'), 'utf8').match(/EXPECTED_SHA256:\s*'([0-9A-F:]+)'/) || [])[1] || '';
if (FP.length !== 95) { console.error('EXPECTED_SHA256 in build-apk.yml is not a 95-character fingerprint'); process.exit(1); }

const PAGES = [['home', ''], ['install', 'install/'], ['privacy', 'privacy/'], ['404', '404.html']];
const SIZES = [[1440, 900], [400, 844]];
const FONTS = ['Instrument Sans', 'Inter', 'JetBrains Mono'];
// One live element per contrast pair in design doc 9.1 (text on --bg, --s1, --s2, --s3, --nav-bg, --accent, --accent-hover).
// A selector absent or hidden on a page is skipped; the threshold follows the element's own size and weight.
const PAIRS = ['h1', 'h2', 'h3', '.lead', '.step p', '.prose p', '.eyebrow', '.cap', '.btn-p', '.btn-p:hover', '.btn-s', '.nav-links a',
  '.card p', '.card h3', '.h3-card', '.foot p', '.foot a', '.frow3', '.rest-n', '.rest-time', '.pill', '.tick', '.undo-l', '.stat .val',
  '.stat', '.tile', '.key', 'code', '#fp', '#cmd', 'td', 'th', 'caption', 'li', 'p', 'a.link', '.skip'];

// Serve website/dist the same way the app gate serves www/ (scripts/screenshot-gate.mjs).
const server = spawn(process.execPath, [join(ROOT, 'node_modules/vite/bin/vite.js'), 'preview', '--config', 'website/vite.config.js', '--port', PORT, '--strictPort'], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
process.on('exit', () => { try { server.kill('SIGKILL'); } catch { /* already gone */ } });
server.stderr.on('data', (d) => process.stderr.write(`[preview] ${d}`));
server.on('exit', (code) => { if (code) { console.error(`preview server exited with ${code}`); process.exit(1); } });
for (let i = 0; ; i++) {
  try { const r = await fetch(ORIGIN + SITE_BASE); if (r.ok) break; } catch { /* not yet */ }
  if (i > 120) { console.error('preview server did not start'); process.exit(1); }
  await new Promise((r) => setTimeout(r, 250));
}

const exe = process.env.MARC_CHROMIUM || (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await chromium.launch({ ...(exe ? { executablePath: exe } : {}), args: ['--no-sandbox'] });
const linksSeen = new Set();
const allFails = [];

/** Let short animations (reveals, the hero rise, the mark's draw) finish; never waits on an infinite one for more than 3 s. */
const settle = (page) => page.evaluate(() => Promise.race([
  Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))),
  new Promise((r) => setTimeout(r, 3000)),
])).catch(() => {});

/** Elements with their own text whose computed opacity, or an ancestor's, is 0. `inView` limits it to the current viewport. */
const hiddenText = (page, inView) => page.evaluate((inView) => {
  const out = [];
  for (const el of document.body.querySelectorAll('*')) {
    if (!el.checkVisibility() || el.closest('.step-shot')) continue;
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const r = el.getBoundingClientRect();
    if (inView && (r.bottom <= 0 || r.top >= innerHeight)) continue;
    for (let a = el; a && a !== document.body; a = a.parentElement) {
      if (getComputedStyle(a).opacity === '0') { out.push(`<${a.tagName.toLowerCase()}${a.className ? '.' + [...a.classList].join('.') : ''}> "${el.textContent.trim().slice(0, 40)}"`); break; }
    }
  }
  return out.slice(0, 6);
}, inView);

/** WCAG 2.x contrast of each PAIRS element's text against its background, composited in sRGB. Every ancestor's background is
 *  layered up to the root and each element's `opacity` (its own and its ancestors') thins the text and every layer beneath it,
 *  so a dimmed block (the inactive story steps) is measured as the reader sees it. */
const contrast = (page, sels) => page.evaluate((sels) => {
  const parse = (c) => { const m = (c.match(/[\d.]+/g) || [0, 0, 0, 0]).map(Number); return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 }; };
  const over = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const bgOf = (el) => {
    const layers = [];
    let fa = 1;
    for (let a = el; a; a = a.parentElement) {
      const cs = getComputedStyle(a);
      const c = parse(cs.backgroundColor);
      if (c.a > 0) layers.push(c);
      const o = parseFloat(cs.opacity);
      if (o < 1) { fa *= o; layers.forEach((l) => { l.a *= o; }); }
    }
    let bg = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) bg = over(layers[i], bg);
    return { bg, fa };
  };
  const out = [];
  for (const sel of sels) {
    const el = [...document.querySelectorAll(sel)].find((e) => e.checkVisibility() && e.textContent.trim());
    if (!el) continue;
    const cs = getComputedStyle(el);
    const { bg, fa } = bgOf(el);
    const col = parse(cs.color);
    const fg = over({ ...col, a: col.a * fa }, bg);
    const [l1, l2] = [lum(fg), lum(bg)];
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const size = parseFloat(cs.fontSize);
    const need = size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight, 10) >= 700) ? 3 : 4.5;
    out.push({ sel, ratio: Math.round(ratio * 100) / 100, need, size: Math.round(size), fg: fa < 1 ? `${cs.color} at opacity ${Math.round(fa * 100) / 100}` : cs.color, bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})` });
  }
  return out;
}, sels);

async function run(name, path, [w, h], reduced) {
  const tag = `${name}-${w}-${reduced ? 'reduced' : 'motion'}`;
  const fails = [];
  const F = (m) => fails.push(`${tag}: ${m}`);
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const bytes = { doc: 0, font: 0 };
  const fontHosts = new Set();
  const pending = [];
  let requests = 0;
  page.on('console', (m) => { if (m.type() === 'error') F(`console error: ${m.text()}`); });
  page.on('pageerror', (e) => F(`page error: ${e.message}`));
  page.on('requestfailed', (r) => F(`request failed: ${r.url()} (${r.failure()?.errorText})`));
  page.on('request', (r) => {
    requests++;
    const u = new URL(r.url());
    if (/^https?:$/.test(u.protocol) && u.hostname !== 'localhost' && u.hostname !== '127.0.0.1') F(`third-party request: ${r.url()}`);
  });
  page.on('response', (r) => {
    if (r.status() >= 400) F(`HTTP ${r.status()}: ${r.url()}`);
    const t = r.request().resourceType();
    if (!['document', 'stylesheet', 'script', 'font'].includes(t)) return;
    pending.push(r.body().then((body) => {
      if (t === 'font') { bytes.font += body.length; fontHosts.add(new URL(r.url()).hostname); } else bytes.doc += gzipSync(body).length;
    }).catch(() => {}));
  });

  await page.goto(ORIGIN + SITE_BASE + path, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await settle(page);

  // Fonts: loaded from the site's own origin.
  const loaded = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/^["']|["']$/g, '')));
  FONTS.forEach((f) => { if (!loaded.includes(f)) F(`font not loaded: ${f}`); });

  // Every element in the JetBrains Mono face has ligatures off (W34): its contextual alternates would fuse -- and >- in the verify command.
  (await page.evaluate(() => [...document.body.querySelectorAll('*')]
    .filter((el) => { const cs = getComputedStyle(el); return /^["']?JetBrains Mono/.test(cs.fontFamily) && cs.fontVariantLigatures !== 'none'; })
    .map((el) => `<${el.tagName.toLowerCase()}${el.className ? '.' + [...el.classList].join('.') : ''}> "${el.textContent.trim().slice(0, 40)}"`).slice(0, 6)))
    .forEach((t) => F(`ligatures on in the mono face: ${t}`));

  // Text left invisible in the first viewport once load animations have run.
  (await hiddenText(page, true)).forEach((t) => F(`text at opacity 0 after load: ${t}`));
  if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) F('horizontal scroll at rest');

  // Fingerprint and verify command (install page).
  if (name === 'install') {
    const v = await page.evaluate(() => ({ fp: document.querySelector('#fp')?.textContent.trim() ?? null, cmd: document.querySelector('#cmd')?.textContent.trim() ?? null }));
    if (v.fp !== FP) F(`fingerprint #fp ${v.fp === null ? 'is missing' : `reads "${v.fp}"`} (expected the 95-character EXPECTED_SHA256)`);
    if (!v.cmd || !v.cmd.includes('MARC-v') || !v.cmd.includes('-signed.apk')) F(`verify command #cmd ${v.cmd === null ? 'is missing' : `reads "${v.cmd}"`} (expected MARC-v… -signed.apk)`);
  }

  // Scroll to the bottom the way a wheel does, 100px a notch, recording the story's data-step on the way. Half-viewport jumps
  // could land two steps in the band at once (the first step is under 200px tall), and then only the later one is recorded.
  const steps = new Set();
  const height = () => page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < await height(); y += 100) {
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(60);
    steps.add(await page.evaluate(() => document.getElementById('pinblock')?.dataset.step ?? null));
  }
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  // Lazy images without a layout box (the story's stacked fallback figures are display:none while JS runs) never start
  // loading in Chromium, so the load wait covers only images that have a box; the hidden ones are fetched below.
  await page.waitForFunction(() => [...document.images].every((i) => i.getClientRects().length === 0 || i.complete), null, { timeout: 15000 }).catch(() => F('images did not finish loading within 15 s'));
  await page.waitForTimeout(300);
  await settle(page);
  if (name === 'home' && !reduced) ['1', '2', '3'].forEach((s) => { if (!steps.has(s)) F(`pinned story never set data-step="${s}" while scrolling (seen: ${[...steps].join(', ')})`); });

  (await page.evaluate(() => [...document.images].filter((i) => i.getClientRects().length > 0 && !(i.naturalWidth > 0) || !i.alt.trim()).map((i) => `${i.getAttribute('src')} (${i.naturalWidth > 0 ? 'empty alt' : 'not loaded'})`)))
    .forEach((m) => F(`img: ${m}`));
  for (const src of await page.evaluate(() => [...new Set([...document.images].filter((i) => i.getClientRects().length === 0).map((i) => i.currentSrc || i.src))])) {
    const r = await fetch(src).catch(() => null);
    if (!r || !r.ok) F(`img without a layout box does not resolve: ${src}`);
  }
  (await hiddenText(page, false)).forEach((t) => F(`text at opacity 0 after scrolling to the bottom: ${t}`));
  if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) F('horizontal scroll after scrolling');

  // Reduced motion: each step heading is visible and clear of the phone.
  if (name === 'home' && reduced) {
    const bad = await page.evaluate(() => {
      const phone = document.querySelector('.pin .phone') || document.querySelector('.pin');
      const out = [];
      document.querySelectorAll('.step h3').forEach((hd) => {
        hd.scrollIntoView({ block: 'center' });
        const r = hd.getBoundingClientRect();
        const p = phone && phone.getBoundingClientRect();
        const vis = hd.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && r.width > 0 && r.height > 0;
        const over = p && r.left < p.right && r.right > p.left && r.top < p.bottom && r.bottom > p.top;
        if (!vis || over) out.push(`"${hd.textContent.trim()}" ${vis ? 'is covered by the phone' : 'is not visible'}`);
      });
      return out;
    });
    bad.forEach((b) => F(`reduced motion: step heading ${b}`));
  }

  // Contrast from computed styles (the primary button also in its hover state).
  await page.evaluate(() => scrollTo(0, 0));
  if (await page.locator('.btn-p').first().isVisible()) await page.locator('.btn-p').first().hover();
  for (const c of await contrast(page, PAIRS)) if (c.ratio < c.need) F(`contrast ${c.sel}: ${c.ratio}:1 < ${c.need}:1 at ${c.size}px (${c.fg} on ${c.bg})`);

  // Internal links: each unique target answers 200 and exists as a file in dist (vite preview would fall back to index.html); anchors name an id.
  for (const href of new Set(await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.href)))) {
    const u = new URL(href);
    if (u.origin !== ORIGIN || linksSeen.has(u.pathname + u.hash)) continue;
    linksSeen.add(u.pathname + u.hash);
    const rel = u.pathname.startsWith(SITE_BASE) ? u.pathname.slice(SITE_BASE.length) : u.pathname;
    const file = join(DIST, rel === '' || rel.endsWith('/') ? `${rel}index.html` : rel);
    const r = await fetch(u.origin + u.pathname);
    if (r.status !== 200 || !existsSync(file)) { F(`link does not resolve: ${u.pathname} (HTTP ${r.status}${existsSync(file) ? '' : ', no such file in dist'})`); continue; }
    if (u.hash && !(await r.text()).includes(`id="${decodeURIComponent(u.hash.slice(1))}"`)) F(`anchor target missing: ${u.pathname}${u.hash}`);
  }

  await Promise.all(pending);
  if (bytes.doc > BUDGET) F(`page weight: HTML+CSS+JS ${(bytes.doc / KB).toFixed(1)} KB gzipped > 120 KB`);
  if (bytes.font > BUDGET) F(`page weight: fonts ${(bytes.font / KB).toFixed(1)} KB > 120 KB`);
  if (fontHosts.size === 0) F('no font file was requested');
  [...fontHosts].filter((x) => x !== 'localhost' && x !== '127.0.0.1').forEach((x) => F(`font served from another host: ${x}`));

  await page.screenshot({ path: join(OUT, `${tag}.png`), fullPage: true });
  await ctx.close();
  console.log(`${fails.length ? 'FAIL' : 'ok  '} ${tag}: ${requests} requests, HTML+CSS+JS ${(bytes.doc / KB).toFixed(1)} KB gz, fonts ${(bytes.font / KB).toFixed(1)} KB${name === 'home' ? `, data-step seen ${[...steps].filter(Boolean).join(',')}` : ''}${fails.length ? `, ${fails.length} failure(s)` : ''}`);
  allFails.push(...fails);
}

for (const [name, path] of PAGES) for (const size of SIZES) for (const reduced of [false, true]) await run(name, path, size, reduced);

await browser.close();
server.kill('SIGKILL');
if (allFails.length) {
  console.error(`\n${allFails.length} failure(s):`);
  allFails.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
console.log(`\nwebsite gate passed: ${PAGES.length * SIZES.length * 2} runs, screenshots in website/gate-out/`);
