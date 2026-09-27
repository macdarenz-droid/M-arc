// check.cjs: serves out/ on a local port and loads every wrapper page and index.html in Chromium.
// Exit 1 on any page error, console error, failed request, runtime "unsupported construct" error or empty artboard;
// also probes: Roboto loaded, players animate, player stage matches its harness (anim-*/index.html), Main's sheet
// opens and closes (dc-import mount/unmount), Theme boards show their theme, index.html has no page-wide horizontal scroll.
// Screenshots: out/shots/<Board>.png at 1x, out/shots/index-390.png and index-1280.png. Run after build.mjs.
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const HERE = __dirname, OUT = path.join(HERE, 'out'), SHOTS = path.join(OUT, 'shots'), DEMO = path.join(HERE, '..');
const HARNESS = path.resolve(process.env.HARNESS || DEMO); // folder holding anim-*/index.html (default: the demo folder)
const canvas = JSON.parse(fs.readFileSync(path.join(DEMO, 'project', 'canvas.json'), 'utf8'));
const boards = Object.entries(canvas.boards).map(([f, b]) => ({ name: f.slice(0, -8), w: b.w, h: b.h }));
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png' };
const THEME_BG = { Paper: 'rgb(255, 255, 255)', Ember: 'rgb(7, 8, 10)', Emerald: 'rgb(15, 15, 15)', Midnight: 'rgb(10, 37, 64)' };
const kebab = s => s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const fails = [];
const check = (ok, msg) => { console.log((ok ? 'PASS ' : 'FAIL ') + msg); if (!ok) fails.push(msg); };

// The Artifact host wraps index.html in a document skeleton; the server does the same so the page runs in standards mode.
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
  if (rel === 'favicon.ico') { res.writeHead(204); res.end(); return; } // the browser asks for it; the pages have none
  const file = path.join(OUT, rel);
  if (!file.startsWith(OUT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  let body = fs.readFileSync(file);
  if (rel === 'index.html') body = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  res.end(body);
});

// In-page helpers (run with page.evaluate).
const boardInfo = () => {
  const board = document.getElementById('dc-board'), err = board && board.querySelector('[data-dc-error]');
  const root = board && board.firstElementChild, r = root && root.getBoundingClientRect();
  return {
    err: err ? err.textContent : '', els: board ? board.querySelectorAll('*').length : 0,
    rootW: r ? Math.round(r.width) : 0, rootH: r ? Math.round(r.height) : 0,
    needsRoboto: !!document.querySelector('link[href*="family=Roboto"]'),
    roboto: [...document.fonts].some(f => /Roboto/.test(f.family) && f.status === 'loaded'),
  };
};
const animInfo = () => {
  const scene = document.querySelector('.scene');
  if (!scene) return null;
  const els = [...scene.querySelectorAll('*')].filter(e => getComputedStyle(e).animationName !== 'none');
  const names = new Set(), kf = new Set();
  els.forEach(e => getComputedStyle(e).animationName.split(',').forEach(n => names.add(n.trim())));
  for (const s of document.styleSheets) {
    if (s.media && s.media.mediaText === 'not all') continue;
    let rules = [];
    try { rules = s.cssRules; } catch (e) { continue; } // cross-origin Google Fonts sheet
    (function walk(rs) { for (const r of rs) { if (r.type === CSSRule.KEYFRAMES_RULE) kf.add(r.name); else if (r.cssRules) walk(r.cssRules); } })(rules);
  }
  return { count: els.length, names: [...names].sort().join(' '), keyframes: [...kf].sort().join(' ') };
};
const poses = () => [...document.querySelectorAll('.scene *')].filter(e => getComputedStyle(e).animationName !== 'none').map(e => getComputedStyle(e).transform + getComputedStyle(e).opacity).join('|');
const colours = async (page, png) => page.evaluate(async b64 => {
  const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode();
  const c = document.createElement('canvas'); c.width = i.width; c.height = i.height;
  const g = c.getContext('2d'); g.drawImage(i, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height).data, seen = new Set();
  for (let j = 0; j < d.length && seen.size < 64; j += 16) seen.add(d[j] << 16 | d[j + 1] << 8 | d[j + 2]);
  return seen.size;
}, png.toString('base64'));

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}/`;
  fs.mkdirSync(SHOTS, { recursive: true });
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const browser = await chromium.launch({
    ...(process.env.MARC_CHROMIUM ? { executablePath: process.env.MARC_CHROMIUM } : {}),
    ...(proxy ? { proxy: { server: proxy, bypass: '127.0.0.1,localhost' } } : {}),
  });
  // Behind this session's TLS-terminating proxy Chromium does not trust the proxy CA, but Node does (NODE_EXTRA_CA_CERTS):
  // Google Fonts requests are fetched on the Node side, with verification on. Without a proxy Chromium fetches them itself.
  const newContext = async opts => {
    const ctx = await browser.newContext(opts);
    if (proxy) await ctx.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, async route => route.fulfill({ response: await route.fetch() }));
    return ctx;
  };
  const open = async (url, viewport) => {
    const ctx = await newContext({ viewport, deviceScaleFactor: 1 });
    const page = await ctx.newPage(), errors = [];
    page.on('pageerror', e => errors.push('page error: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push('console error: ' + m.text()); });
    page.on('requestfailed', r => errors.push('request failed: ' + r.url() + ' ' + (r.failure() || {}).errorText));
    page.on('response', r => { if (r.status() >= 400) errors.push('HTTP ' + r.status() + ': ' + r.url()); });
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
    return { page, ctx, errors };
  };
  const noErrors = (errors, what) => check(errors.length === 0, `${what}: no errors${errors.length ? ' (' + errors.length + '): ' + [...new Set(errors)].slice(0, 3).join(' | ') : ''}`);

  for (const b of boards) {
    const { page, ctx, errors } = await open(base + b.name + '.html', { width: b.w, height: b.h });
    const info = await page.evaluate(boardInfo);
    const png = await page.screenshot({ path: path.join(SHOTS, b.name + '.png'), clip: { x: 0, y: 0, width: b.w, height: b.h } });
    const n = await colours(page, png);
    check(!info.err, `${b.name}: runtime ok${info.err ? ' - ' + info.err : ''}`);
    check(info.els >= 3 && n >= 8, `${b.name}: not empty (${info.els} elements, ${n}+ colours), root ${info.rootW} x ${info.rootH} on a ${b.w} x ${b.h} board`);
    if (info.needsRoboto) check(info.roboto, `${b.name}: Roboto loaded`);
    if (/^Player-/.test(b.name)) {
      const a = await page.evaluate(poses); await page.waitForTimeout(450); const z = await page.evaluate(poses);
      check(a.length > 0 && a !== z, `${b.name}: animation runs (stage poses change over 450 ms)`);
      const mine = await page.evaluate(animInfo);
      const hfile = path.join(HARNESS, 'anim-' + kebab(b.name.slice(7)), 'index.html');
      if (!fs.existsSync(hfile)) check(false, `${b.name}: harness ${path.relative(HARNESS, hfile)} exists`);
      else {
        const hctx = await newContext({ viewport: { width: 390, height: 520 } });
        const hp = await hctx.newPage();
        await hp.goto('file://' + hfile, { waitUntil: 'load' }); await hp.waitForTimeout(300);
        const theirs = await hp.evaluate(animInfo);
        await hctx.close();
        const same = theirs && mine && mine.count === theirs.count && mine.names === theirs.names && mine.keyframes === theirs.keyframes;
        check(same, `${b.name}: stage matches harness ${path.relative(HARNESS, hfile)} (${mine && mine.count} animated elements, ${mine && mine.keyframes.split(' ').length} keyframes; harness ${theirs && theirs.count}, ${theirs && theirs.keyframes.split(' ').length})`);
      }
    }
    if (b.name === 'Main') {
      await page.click('.mn-row'); await page.waitForTimeout(700);
      const on = await page.evaluate(() => ({ sheet: !!document.querySelector('.sheet .player'), helmets: [...document.querySelectorAll('style[data-dc-helmet]')].filter(s => !s.media).map(s => s.dataset.dcHelmet).join(' ') }));
      check(on.sheet && on.helmets === 'Main About Player-MachineChestPress', `Main: a row opens About with its player (helmets on: ${on.helmets})`);
      await page.screenshot({ path: path.join(SHOTS, 'Main-sheet-open.png'), clip: { x: 0, y: 0, width: b.w, height: b.h } });
      await page.click('.mn-close'); await page.waitForTimeout(500);
      const off = await page.evaluate(() => ({ sheet: !!document.querySelector('.sheet'), helmets: [...document.querySelectorAll('style[data-dc-helmet]')].filter(s => !s.media).map(s => s.dataset.dcHelmet).join(' ') }));
      check(!off.sheet && off.helmets === 'Main', `Main: Close unmounts About (helmets on: ${off.helmets})`);
    }
    const theme = (b.name.match(/^Theme-(\w+)$/) || [])[1];
    if (theme) {
      const t = await page.evaluate(() => { const r = document.querySelector('.mn-root'); return { bg: r && getComputedStyle(r).backgroundColor, sheet: !!document.querySelector('.sheet .player') }; });
      check(t.bg === THEME_BG[theme] && t.sheet, `${b.name}: Main in ${theme} (${t.bg}) with the About sheet and player open`);
    }
    noErrors(errors, b.name);
    await ctx.close();
  }

  for (const w of [390, 1280]) {
    const { page, ctx, errors } = await open(base + 'index.html', { width: w, height: 900 });
    await page.waitForFunction(() => [...document.querySelectorAll('iframe')].every(f => { const d = f.contentDocument, bd = d && d.getElementById('dc-board'); return d && d.readyState === 'complete' && bd && bd.firstElementChild; }), null, { timeout: 20000 });
    await page.waitForTimeout(800);
    const info = await page.evaluate(() => ({
      title: document.title, frames: document.querySelectorAll('iframe').length,
      hscroll: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      first: [...document.querySelectorAll('.cv-row')[0].querySelectorAll('iframe')].map(f => f.getAttribute('src')).join(' '),
      fit: [...document.querySelectorAll('.cv-frame')].every(f => f.getBoundingClientRect().width <= f.closest('.cv-strip').clientWidth + 0.5),
      errs: [...document.querySelectorAll('iframe')].filter(f => f.contentDocument.querySelector('[data-dc-error]')).map(f => f.getAttribute('src')),
    }));
    check(info.title === 'M/ARC Form Guide Canvas' && info.frames === boards.length, `index ${w}: title and ${info.frames} artboard frames`);
    check(/^Player-/.test(info.first) && info.first.split(' ').every(s => /^Player-/.test(s)), `index ${w}: players first (${info.first})`);
    check(info.hscroll <= 0 && info.fit, `index ${w}: no page-wide horizontal scroll (${info.hscroll}), boards fit the column`);
    check(info.errs.length === 0, `index ${w}: every frame renders (${info.errs.join(' ') || 'none failed'})`);
    await page.screenshot({ path: path.join(SHOTS, `index-${w}.png`), fullPage: true });
    if (w === 390) {
      await page.click('.cv-seg button[data-size="full"]'); await page.waitForTimeout(200);
      const full = await page.evaluate(() => ({ w: document.querySelector('.cv-frame').getBoundingClientRect().width, hscroll: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
      check(full.w === 358 && full.hscroll <= 0, `index 390: "100 %" shows boards 1:1 (first frame ${full.w} px) and the page still does not scroll sideways`);
    }
    noErrors(errors, `index ${w}`);
    await ctx.close();
  }
  await browser.close();
  server.close();
  console.log(fails.length ? fails.length + ' FAILED' : 'CANVAS PREVIEW CHECKS PASSED');
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
