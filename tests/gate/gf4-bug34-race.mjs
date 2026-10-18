// GATE-FLAKE-4 repro and proof (docs/COACHING-DECISIONS.md D-GF4-2). Runs BUG-34's block of scripts/screenshot-gate.mjs,
// its bytes unchanged, with a delay after a context's screenshots, a slow parse before the overlay script, or a seeded
// defect in the launch overlay, as a loaded runner or a broken build would add. Needs `npm run build`. Exit 0 only when
// exactly the asked number of runs ran and each one matched --expect; 2 when the block could not be loaded.
//   node tests/gate/gf4-bug34-race.mjs [--old | --gate file] [--lag ms] [--lag-on 1|2|all] [--t0-lag ms] [--seed name]
//                                      [--theme t] [--runs n] [--expect green|red] [--trace]
// --old: main's block before GATE-FLAKE-4 (72c94fc6). --gate: another copy of the gate (a mutation).
// --lag: wait that long after a Page.captureScreenshot reply, on a context's first capture, its second, or both.
// --t0-lag: the main thread is busy that long once #launch is parsed, before its SVG and the overlay script.
// --seed: a defect in the overlay; each must turn the run red (see SEEDS). --theme: one theme instead of all 5.
// --trace: per context, the samples, FCP, the recorded frames and their largest gap, and the A2 margin.
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i < 0 ? d : process.argv[i + 1]; };
const OLD = process.argv.includes('--old'), TRACE = process.argv.includes('--trace'), GATE = arg('gate', '');
const LAG = Number(arg('lag', 0)), LAG_ON = arg('lag-on', '2'), T0_LAG = Number(arg('t0-lag', 0)), SEED = arg('seed', '');
const THEME = arg('theme', ''), RUNS = Number(arg('runs', 1)), EXPECT = arg('expect', 'green'), PORT = '4181';
const OLD_SHA = 'd46e95eb519b2a6e778d9c795ddd16fa9afbcfefca71a9d3353d9b9ba7e2fab5';
if (!['1', '2', 'all'].includes(LAG_ON) || !['green', 'red'].includes(EXPECT)) throw new Error('--lag-on is 1, 2 or all; --expect is green or red');

const onSel = (sel, f) => `new MutationObserver((ms, mo) => { const p = document.querySelector('${sel}'); if (p) { mo.disconnect(); (${f})(p); } }).observe(document, { childList: true, subtree: true });`;
const onPath = f => onSel('#launch-path', f);
const keyframes = k => `p => { const s = document.createElement('style'); s.textContent = '@keyframes bug34x { ${k} }'; document.head.append(s); p.style.animationName = 'bug34x'; }`;
/** Defects put into the overlay, each as an init script that runs before the page's own scripts. */
const SEEDS = {
  // the line never animates (paused before its first frame)
  'never': onPath(`p => { p.style.animationPlayState = 'paused'; }`),
  // the line runs at a fifth of its speed
  'slow-5x': `(() => { const f = () => { const a = document.getAnimations().find(x => x.animationName === 'launch-draw'); if (a) a.playbackRate = 0.2; else requestAnimationFrame(f); }; requestAnimationFrame(f); })()`,
  // the line stalls for 500 ms once its own time reaches 250 ms, then runs on
  'stall-500': `(() => { const f = () => { const a = document.getAnimations().find(x => x.animationName === 'launch-draw'); if (a && a.currentTime >= 250) { a.pause(); setTimeout(() => a.play(), 500); } else requestAnimationFrame(f); }; requestAnimationFrame(f); })()`,
  // the line stops 150 ms after the overlay script ran
  'freeze-150': `(() => { const f = () => { const a = document.getAnimations().find(x => x.animationName === 'launch-draw'); if (a && performance.now() - window.__marcLaunchT0 >= 150) a.pause(); else requestAnimationFrame(f); }; requestAnimationFrame(f); })()`,
  // the line drops 30 units in its first 195 ms, then stops
  'early-freeze': onPath(keyframes('0% { stroke-dashoffset: 100 } 16% { stroke-dashoffset: 70 } 100% { stroke-dashoffset: 70 }')),
  // the line waits 600 ms before it starts
  'late-600': onPath(`p => { p.style.animationDelay = '600ms'; }`),
  // the dot loses its motion path, so it sits at the mark's (0, 0) (the SMIL frozen frame)
  'dot-origin': onSel('#launch-dot', `d => { d.style.offsetPath = 'none'; }`),
  // the word shows from the first frame instead of after 1050 ms
  'word-early': onSel('#launch .launch-word', `w => { w.style.animationDelay = '0ms'; }`),
  // the line drops 40 units by 244 ms, then creeps: 9 units over the next 476 ms
  'creep': onPath(keyframes('0% { stroke-dashoffset: 100 } 20% { stroke-dashoffset: 60 } 59.0164% { stroke-dashoffset: 51 } 100% { stroke-dashoffset: 0 }')),
  // the dot stops once its own time reaches 40 ms (a glide that freezes in its first frames)
  'dot-freeze-40': `(() => { const f = () => { const a = document.getAnimations().find(x => x.animationName === 'launch-glide'); if (a && a.currentTime >= 40) a.pause(); else requestAnimationFrame(f); }; requestAnimationFrame(f); })()`,
};
if (SEED && !SEEDS[SEED]) throw new Error(`no seed ${SEED}`);
const T0_SRC = T0_LAG && `new MutationObserver((ms, mo) => { if (document.getElementById('launch')) { mo.disconnect(); const e = performance.now() + ${T0_LAG}; while (performance.now() < e); } }).observe(document, { childList: true, subtree: true });`;

// The block's own bytes: from its guard to the next block's guard.
const src = OLD ? execFileSync('git', ['show', '72c94fc6:scripts/screenshot-gate.mjs'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 })
  : readFileSync(GATE ? resolve(GATE) : join(ROOT, 'scripts/screenshot-gate.mjs'), 'utf8');
const a = src.indexOf("if (gate.runs('BUG-34'))"), b = src.indexOf('if (gate.runs(', a + 1);
const slice = a < 0 || b < 0 ? '' : src.slice(a, b);
const sha = createHash('sha256').update(slice).digest('hex');
if (!slice || (OLD && sha !== OLD_SHA)) { console.log(`BUG-34's block not found or not main's: sha256 ${sha}`); process.exit(2); }
const block = new (Object.getPrototypeOf(async () => {}).constructor)('browser', 'gate', 'errors', 'themes', 'PORT', 'console', slice);

const server = spawn(process.execPath, [join(ROOT, 'node_modules/vite/bin/vite.js'), 'preview', '--port', PORT, '--strictPort'], { cwd: ROOT, stdio: 'ignore' });
process.on('exit', () => server.kill('SIGKILL'));
for (let i = 0; ; i++) { try { await fetch(`http://localhost:${PORT}/`); break; } catch { if (i > 100) throw new Error('no preview server'); await new Promise(r => setTimeout(r, 100)); } }
const chrome = await chromium.launch({ ...(process.env.MARC_CHROMIUM ? { executablePath: process.env.MARC_CHROMIUM } : { channel: 'chromium' }), args: ['--no-sandbox'] });

const sleep = ms => new Promise(r => setTimeout(r, ms));
const fx = (v, n = 2) => (typeof v === 'number' ? v.toFixed(n) : String(v));
let runMargin = Infinity;
/** Only what the block calls: browser.newContext, and on its contexts newCDPSession, newPage and close. */
const browser = {
  async newContext(opts) {
    const ctx = await chrome.newContext(opts);
    if (!opts) return ctx; // the block's pixel page, which never loads the app
    if (SEED) await ctx.addInitScript(SEEDS[SEED]);
    if (T0_SRC) await ctx.addInitScript(T0_SRC);
    const info = { rate: 1, theme: '?', samples: [], rec: null, page: null };
    const cdpOf = ctx.newCDPSession.bind(ctx), pageOf = ctx.newPage.bind(ctx), closeOf = ctx.close.bind(ctx);
    ctx.newCDPSession = async p => {
      const cdp = await cdpOf(p), send = cdp.send.bind(cdp);
      let shots = 0;
      cdp.send = async (m, params) => {
        if (m === 'Emulation.setCPUThrottlingRate') info.rate = params.rate;
        const r = await send(m, params);
        if (m === 'Page.captureScreenshot') { const n = ++shots; if (LAG && (LAG_ON === 'all' || Number(LAG_ON) === n)) await sleep(LAG); }
        return r;
      };
      return cdp;
    };
    ctx.newPage = async () => {
      const page = await pageOf(); info.page = page;
      const ev = page.evaluate.bind(page), init = page.addInitScript.bind(page);
      page.addInitScript = (f, x) => { info.theme = x?.[0] ?? '?'; return init(f, x); };
      page.evaluate = async (...args) => {
        const r = await ev(...args);
        if (r && typeof r === 'object' && 'off' in r && 'ctm' in r) info.samples.push(r);
        if (r && typeof r === 'object' && Array.isArray(r.frames)) info.rec = r;
        return r;
      };
      return page;
    };
    ctx.close = async () => {
      if (info.samples.length >= 2) trace(info, info.page && TRACE ? await info.page.evaluate(() => (performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? NaN) - window.__marcLaunchT0).catch(() => NaN) : NaN);
      return closeOf();
    };
    return ctx;
  },
};
/** The mark's y of a CSS-px edge at y from x0 to x1 (the smaller end), by the inverse of the capture's ctm. */
const markY = ([a, b, c, d, e, f], y, x0, x1) => Math.min(...[x0, x1].map(x => (a * (y - f) - b * (x - e)) / (a * d - b * c)));
/** One context's A2 margin (main: s2.off - s3.off - 10; the new block: the smallest x.off - fB.off - 10 up to FCP + 300). */
function trace(info, fcpNow) {
  const [s1, s2, s3] = info.samples, rec = info.rec;
  let margin = NaN, frames = 'n/a', f = '';
  if (rec) {
    const fp = rec.fcp, fr = rec.frames, fB = fr.find(x => x.t >= fp + 700);
    if (fB) margin = Math.min(...fr.filter(x => x.t <= fp + 300).map(x => x.off - fB.off - 10));
    let gap = 0; for (let k = 1; k < fr.length; k++) gap = Math.max(gap, fr[k].t - fr[k - 1].t);
    frames = `${fr.length} frames, largest gap ${fx(gap, 1)} ms`;
    const f0 = fr.filter(x => x.t <= fp).pop() ?? fr[0], fA = fr.find(x => x.t >= fp + 100);
    f = ` · f0 ${fx(f0?.off, 3)}@${fx(f0?.t, 0)} fA ${fx(fA?.off, 3)}@${fx(fA?.t, 0)} fB ${fx(fB?.off, 3)}@${fx(fB?.t, 0)}`;
  } else if (s3) margin = s2.off - s3.off - 10;
  if (Number.isFinite(margin)) runMargin = Math.min(runMargin, margin);
  if (!TRACE) return;
  const s = [s1, s2, s3].filter(Boolean).map((x, k) => `s${k + 1} ${fx(x.off, 3)}@${fx(x.t, 0)}${x.word ? ` word top ${fx(markY(x.ctm, x.word[1], x.word[0], x.word[2]))}` : ''}`).join(' ');
  console.log(`  ${info.theme} ${info.rate}x: ${s}${f} · FCP ${fx(rec ? rec.fcp : fcpNow, 1)} ms · ${frames} · margin ${fx(margin)}`);
}

console.log(`${process.env.MARC_CHROMIUM ?? 'chromium'} ${chrome.version()} · ${OLD ? 'main 72c94fc6' : GATE || 'working tree'} block ${sha.slice(0, 12)} · lag ${LAG} ms on ${LAG_ON} · t0-lag ${T0_LAG} ms · seed ${SEED || 'none'} · expect ${EXPECT}`);
let done = 0, matched = 0;
const margins = [];
try {
  for (let run = 1; run <= RUNS; run++) {
    const errors = []; runMargin = Infinity;
    // The block's own log line gives its margin when it has one (E11); main's comes from the trace of its samples.
    const log = { log: (...x) => { console.log(...x); const m = /smallest A2 margin (-?[\d.]+)/.exec(x.join(' ')); if (m) runMargin = Number(m[1]); } };
    await block(browser, { runs: id => id === 'BUG-34' }, errors, THEME ? [THEME] : ['silent-black', 'paper', 'ember', 'emerald', 'midnight'], PORT, log);
    done++;
    if ((errors.length ? 'red' : 'green') === EXPECT) matched++;
    margins.push(runMargin);
    console.log(`run ${run}: ${errors.length ? `RED (${errors.length})` : 'green'} · smallest A2 margin ${fx(runMargin)}`);
    for (const e of errors) console.log(`  ${e}`);
  }
} finally { await chrome.close(); }
const sorted = margins.filter(Number.isFinite).sort((x, y) => x - y);
console.log(`${done} of ${RUNS} runs, ${matched} ${EXPECT} as expected · median smallest margin ${sorted.length ? fx((sorted[(sorted.length - 1) >> 1] + sorted[sorted.length >> 1]) / 2) : 'n/a'}`);
process.exit(done === RUNS && matched === RUNS ? 0 : 1);
