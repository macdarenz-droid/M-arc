// GATE-FLAKE-5 repro and proof (docs/COACHING-DECISIONS.md D-GF5-2). Runs one block of scripts/screenshot-gate.mjs,
// its bytes unchanged, under a fault a loaded runner or a lost chunk would add: a main-thread stall inside COPY-2's
// swap (a dropped frame), a How-to chunk that fails or arrives late through the app's service worker, or a seeded
// defect. Needs `npm run build`. Exit 0 only when exactly the asked number of runs ran and each one matched --expect
// and every --want; 2 when the block could not be loaded.
//   node tests/gate/gf5-race.mjs --block copy2|ht8|ht9show [--old | --gate file] [--stall ms (--at-frame n | --at-ct c)]
//        [--fail-chunk regex] [--delay-chunk regex ms] [--seed name] [--runs n] [--expect green|red] [--want regex]... [--trace]
// --old: main's block before GATE-FLAKE-5 (5158609c). --gate: another copy of the gate (a mutation).
// --stall (copy2): the main thread is busy that long in the rAF callback of the swap's n-th frame (0-based, pending
//   frames included, counted once the sheet's h2 is no longer 'Quick check-in'), or of the first started frame whose
//   currentTime is >= c ms.
// --fail-chunk / --delay-chunk (ht8, ht9show): once the worker controls the page, the matching chunk is deleted from
//   its caches and only then a context route aborts its network fetch ('connectionreset') or holds it ms.
// --seed: a defect (copy2: SEEDS; ht8: hidden-feel). --want: with --expect red, every run must print an error matching it.
// --trace: copy2, per context the frames, gaps, gap pairs, steps and the replay match; ht8 and ht9show, the failed
//   requests, the How-to chunk requests with their times, the toasts and the worker's state.
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(`--${k}`); return i < 0 ? d : argv[i + 1]; };
const all = k => argv.flatMap((x, i) => (x === `--${k}` ? [argv[i + 1]] : []));
const BLOCK = arg('block', ''), OLD = argv.includes('--old'), TRACE = argv.includes('--trace'), GATE = arg('gate', '');
const STALL = Number(arg('stall', 0)), AT_FRAME = arg('at-frame', null), AT_CT = arg('at-ct', null), SEED = arg('seed', '');
const FAIL = arg('fail-chunk', ''), DELAY = arg('delay-chunk', ''), DELAY_MS = DELAY ? Number(argv[argv.indexOf('--delay-chunk') + 2]) : 0;
const RUNS = Number(arg('runs', 1)), EXPECT = arg('expect', 'green'), WANT = all('want').map(w => new RegExp(w)), PORT = '4182';
const KEYS = { copy2: 'COPY-2', ht8: 'HT-8', ht9show: 'HT-9' };
// main 5158609c's slices, guard to next guard
const OLD_SHA = {
  copy2: 'f493c7d525c3aa8fa59a6c5226100b517f6dfd0290715531d15b64cf5504248d',
  ht8: '876bf650596a7f61019e57cec82cad757b0e32f8519826c84c4226d0ee5fcab9',
  ht9show: '67bbee4ca56469a2e499105081218020c17c946e1d23413d50f2d8e93eca6585',
};
const SEEDS_HT8 = ['hidden-feel'], SEEDS_C2 = ['no-anim', 'snap-1ms', 'fast-80', 'overshoot', 'mid-jump', 'early-end', 'skip-ahead', 'blip'];
const bad = m => { console.log(m); process.exit(2); };
if (!KEYS[BLOCK]) bad('--block is copy2, ht8 or ht9show');
if (!['green', 'red'].includes(EXPECT) || (WANT.length && EXPECT !== 'red')) bad('--expect is green or red; --want needs --expect red');
if (STALL && (BLOCK !== 'copy2' || (AT_FRAME == null) === (AT_CT == null))) bad('--stall is copy2 only and needs one of --at-frame, --at-ct');
if ((FAIL || DELAY) && BLOCK === 'copy2') bad('--fail-chunk and --delay-chunk are ht8 and ht9show only');
if (FAIL && DELAY) bad('one of --fail-chunk, --delay-chunk');
if (DELAY && !(DELAY_MS > 0)) bad('--delay-chunk regex ms');
if (SEED && !(BLOCK === 'copy2' ? SEEDS_C2 : BLOCK === 'ht8' ? SEEDS_HT8 : []).includes(SEED)) bad(`no seed ${SEED} for ${BLOCK}`);

// The block's own bytes: from its guard to the next block's guard (HT-9 Show: the guard before its tag).
const src = OLD ? execFileSync('git', ['show', '5158609c:scripts/screenshot-gate.mjs'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 })
  : readFileSync(GATE ? resolve(GATE) : join(ROOT, 'scripts/screenshot-gate.mjs'), 'utf8');
const a = BLOCK === 'ht9show' ? src.lastIndexOf('if (gate.runs(', src.indexOf("const tag = 'HT-9 Show';")) : src.indexOf(`if (gate.runs('${KEYS[BLOCK]}'))`);
const b = a < 0 ? -1 : src.indexOf('if (gate.runs(', a + 1);
const slice = a < 0 || b < 0 ? '' : src.slice(a, b);
const sha = createHash('sha256').update(slice).digest('hex');
if (!slice || (OLD && sha !== OLD_SHA[BLOCK])) bad(`${BLOCK}'s block not found or not main's: sha256 ${sha}`);
// The gate's own helpers the COPY-2 slice reads, from the same source.
const visibleSrc = /^const visible = .*$/m.exec(src)?.[0];
const lg = src.indexOf('async function launchGone(page) {'), launchGoneSrc = lg < 0 ? '' : src.slice(lg, src.indexOf('\n}\n', lg) + 2);
if (!visibleSrc || !launchGoneSrc) bad('visible or launchGone not found in the gate');
// The slice imports '../tools/plates/fidelity/harness.mjs' relative to scripts/, so it runs from a temporary module
// there (deleted on exit, never committed). Every name it reads is a parameter or the gate's helper; any other throws.
const MOD = join(ROOT, 'scripts', `.gf5-probe-${process.pid}.mjs`);
writeFileSync(MOD, `import { join } from 'node:path';\nimport { readFileSync, readdirSync, writeFileSync } from 'node:fs';\n${visibleSrc}\n${launchGoneSrc}\nexport default async function (gate, browser, chromium, errors, PORT, ROOT, OUT, console) {\n${slice}\n}\n`);
const cleanup = () => { try { unlinkSync(MOD); } catch {} };
process.on('exit', cleanup);
let block;
try { block = (await import(pathToFileURL(MOD).href)).default; } finally { cleanup(); }
const OUT = mkdtempSync(join(tmpdir(), 'gf5-'));

const server = spawn(process.execPath, [join(ROOT, 'node_modules/vite/bin/vite.js'), 'preview', '--port', PORT, '--strictPort'], { cwd: ROOT, stdio: 'ignore' });
process.on('exit', () => server.kill('SIGKILL'));
for (let i = 0; ; i++) { try { await fetch(`http://localhost:${PORT}/`); break; } catch { if (i > 100) throw new Error('no preview server'); await new Promise(r => setTimeout(r, 100)); } }
const exe = process.env.MARC_CHROMIUM ? { executablePath: process.env.MARC_CHROMIUM } : { channel: 'chromium' };

const fx = (v, n = 1) => (typeof v === 'number' && Number.isFinite(v) ? v.toFixed(n) : String(v));
/** The swap: the panel's animation whose first keyframe is a negative translateY (Train.tsx's StartSheet). */
const SWAP = `x => /^translateY\\(-/.test(x.effect?.getKeyframes()[0]?.transform || '')`;
const STALL_SRC = STALL && `(() => { let n = -1, done = false; const f = () => { if (done) return; const d = [...document.querySelectorAll('dialog.sheet[open]')].pop(); const p = d && d.querySelector('.sheet-panel'); const swapped = d && d.querySelector('h2') && d.querySelector('h2').textContent !== 'Quick check-in'; const an = swapped && p && p.getAnimations().find(x => x.playState === 'running' && (${SWAP})(x)); if (an) { n++; if (${AT_CT == null ? `n === ${Number(AT_FRAME)}` : `!an.pending && an.currentTime >= ${Number(AT_CT)}`}) { const e = performance.now() + ${STALL}; while (performance.now() < e); done = true; return; } } requestAnimationFrame(f); }; requestAnimationFrame(f); })()`;
/** COPY-2 seeds: Element.prototype.animate wrapped before the app runs; only the swap call, its Animation or the
 *  panel changes. "Frame n" is the swap's n-th frame as --at-frame counts it (n = --at-frame with a stall, else 2). */
const N = STALL && AT_FRAME != null ? Number(AT_FRAME) : 2;
const atFrame = act => `(() => { let n = -1; const f = () => { n++; if (n === ${N}) { (${act})(); return; } requestAnimationFrame(f); }; requestAnimationFrame(f); })();`;
const C2_SEEDS = {
  'no-anim': `return null;`,
  'snap-1ms': `return orig.call(this, kf, { ...o, duration: 1 });`,
  'fast-80': `return orig.call(this, kf, { ...o, duration: 80 });`,
  'overshoot': `return orig.call(this, kf, { ...o, easing: 'cubic-bezier(0.3, 1.8, 0.5, 1)' });`,
  'mid-jump': `const el = this, an = orig.call(this, kf, o); ${atFrame(`() => { el.style.position = 'relative'; el.style.top = '40px'; }`)} return an;`,
  'early-end': `const an = orig.call(this, kf, o); ${atFrame(`() => an.cancel()`)} return an;`,
  'skip-ahead': `const an = orig.call(this, kf, o); ${atFrame(`() => { an.currentTime += 120; }`)} return an;`,
  // its own ease sampled every 5 ms, linear between, except 6 px higher from ct 150 to 175 ms
  'blip': `const c = orig.call(this, kf, o); c.pause(); const D = o.duration, ty = t => { c.currentTime = t; return new DOMMatrixReadOnly(getComputedStyle(this).transform).m42; };
    const pts = []; for (let t = 0; t <= D; t += 5) pts.push([t, ty(t) - (t >= 150 && t < 175 ? 6 : 0)]);
    pts.push([149.9, ty(149.9)], [150, ty(150) - 6], [174.9, ty(174.9) - 6], [175, ty(175)]); c.cancel();
    pts.sort((x, y) => x[0] - y[0]);
    return orig.call(this, pts.map(([t, y]) => ({ offset: t / D, transform: \`translateY(\${y}px)\` })), { ...o, easing: 'linear' });`,
};
const C2_SEED_SRC = SEED && BLOCK === 'copy2' && `(() => { const orig = Element.prototype.animate; Element.prototype.animate = function (kf, o) {
  if (!(this.classList?.contains('sheet-panel') && Array.isArray(kf) && /^translateY\\(-/.test(kf[0]?.transform || ''))) return orig.call(this, kf, o);
  ${C2_SEEDS[SEED]} }; })()`;
const HIDDEN_FEEL = `(() => { const s = document.createElement('style'); s.textContent = 'dialog.sheet.ht .feel { visibility: hidden }'; (document.head || document.documentElement).append(s); })()`;
/** The chunk fault: wait for the worker to control the page, delete the chunk from every marc-* cache, then arm. */
const FAULT_RE = FAIL || DELAY;
const FAULT_SRC = FAULT_RE && `(() => { if (location.port !== '${PORT}' || !('serviceWorker' in navigator)) return;
  const go = async () => { const re = new RegExp(${JSON.stringify(FAULT_RE)}); let had = 0;
    for (const k of await caches.keys()) if (k.startsWith('marc-')) { const c = await caches.open(k); for (const r of await c.keys()) if (re.test(r.url)) { had++; await c.delete(r); } }
    await window.__gf5Arm({ controller: !!navigator.serviceWorker.controller, had }); };
  if (navigator.serviceWorker.controller) go(); else navigator.serviceWorker.addEventListener('controllerchange', go, { once: true }); })()`;
const TOASTS_SRC = `(() => { window.__gf5T = []; const go = () => new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.nodeType === 1) for (const t of [n, ...n.querySelectorAll('div.toast')]) if (t.matches?.('div.toast')) window.__gf5T.push(t.textContent); }).observe(document.documentElement, { childList: true, subtree: true }); if (document.documentElement) go(); else document.addEventListener('DOMContentLoaded', go); })()`;

let ctxN = 0;
/** One context with the faults and the trace, for the contexts the block makes (browser.newContext). */
async function wrapContext(ctx, opts) {
  const id = ++ctxN, t0 = Date.now(), info = { id, theme: '?', rate: 1, frames: null, replay: null, page: null, arm: null, reqs: [] };
  if (STALL_SRC) await ctx.addInitScript(STALL_SRC);
  if (C2_SEED_SRC) await ctx.addInitScript(C2_SEED_SRC);
  if (SEED === 'hidden-feel') await ctx.addInitScript(HIDDEN_FEEL);
  if (BLOCK !== 'copy2') await ctx.addInitScript(TOASTS_SRC);
  const blocked = opts?.serviceWorkers === 'block';
  if (FAULT_SRC && !blocked) {
    await ctx.exposeBinding('__gf5Arm', async (_, st) => {
      if (info.arm) return;
      info.arm = { ...st, at: Date.now() - t0 };
      await ctx.route(new RegExp(FAULT_RE), async route => {
        if (FAIL) return route.abort('connectionreset');
        await new Promise(r => setTimeout(r, DELAY_MS)); return route.continue().catch(() => {});
      });
    });
    await ctx.addInitScript(FAULT_SRC);
  }
  if (BLOCK !== 'copy2') {
    const rec = new Map(), path = r => (r.serviceWorker() ? 'service worker' : 'page');
    ctx.on('request', r => { if (r.url().includes('/assets/')) { const x = { file: r.url().split('/').pop(), path: path(r), start: Date.now() - t0 }; rec.set(r, x); info.reqs.push(x); } });
    ctx.on('requestfinished', r => { const x = rec.get(r); if (x) x.end = Date.now() - t0; });
    ctx.on('requestfailed', r => { const x = rec.get(r) ?? { file: r.url().split('/').pop(), path: path(r), start: NaN }; if (!rec.has(r)) info.reqs.push(x); x.end = Date.now() - t0; x.err = r.failure()?.errorText; });
  }
  const pageOf = ctx.newPage.bind(ctx), closeOf = ctx.close.bind(ctx), cdpOf = ctx.newCDPSession.bind(ctx);
  ctx.newPage = async () => {
    const page = await pageOf(); info.page = page;
    const ev = page.evaluate.bind(page), init = page.addInitScript.bind(page);
    page.addInitScript = (f, x) => { if (Array.isArray(x) && typeof x[0] === 'string') info.theme = x[0]; return init(f, x); };
    page.evaluate = async (...args) => {
      const r = await ev(...args);
      if (Array.isArray(r) && r.length && typeof r[0] === 'object' && r[0] && 'top' in r[0] && 'dlg' in r[0]) info.frames = r;
      if (r && typeof r === 'object' && Array.isArray(r.gaps) && Array.isArray(r.atCt)) info.replay = r;
      return r;
    };
    return page;
  };
  ctx.newCDPSession = async p => {
    const cdp = await cdpOf(p), send = cdp.send.bind(cdp);
    cdp.send = (m, x) => { if (m === 'Emulation.setCPUThrottlingRate') info.rate = Math.max(info.rate, x.rate); return send(m, x); };
    return cdp;
  };
  ctx.close = async () => {
    if (TRACE) {
      if (BLOCK === 'copy2') traceC2(info);
      else if (info.page && !blocked && (info.reqs.length || info.arm)) {
        const toasts = await info.page.evaluate(() => window.__gf5T ?? []).catch(e => [`(not read: ${e.message.split('\n')[0]})`]);
        const sw = await info.page.evaluate(async () => ({ controller: !!navigator.serviceWorker?.controller, reg: (r => (r ? (r.active ? 'active' : r.installing ? 'installing' : r.waiting ? 'waiting' : 'none') : 'none'))(await navigator.serviceWorker?.getRegistration()) })).catch(() => null);
        traceHt(info, toasts, sw);
      }
    }
    return closeOf();
  };
  return ctx;
}
function traceHt(info, toasts, sw) {
  const lazy = info.reqs.filter(x => /^(feel|hand|ht|HowToSheet|loaders)-/.test(x.file) && (x.path === 'page' || x.err || FAULT_RE && new RegExp(FAULT_RE).test(x.file)));
  const failed = info.reqs.filter(x => x.err);
  console.log(`  ctx ${info.id} ${info.theme}: worker ${sw ? `controller ${sw.controller}, registration ${sw.reg}` : 'n/a'}${info.arm ? ` · fault armed at ${info.arm.at} ms (controller ${info.arm.controller}, ${info.arm.had} cached entr${info.arm.had === 1 ? 'y' : 'ies'} deleted)` : FAULT_RE ? ' · fault NOT armed' : ''} · ${info.reqs.length} /assets/ requests, ${failed.length} failed · toasts ${JSON.stringify(toasts)}`);
  for (const x of failed) console.log(`    failed: ${x.file} ${x.err} (${x.path}) ${fx(x.start, 0)}-${fx(x.end, 0)} ms`);
  for (const x of lazy.filter(x => !x.err)) console.log(`    ${x.file} (${x.path}) ${fx(x.start, 0)}-${x.end == null ? 'not finished' : fx(x.end, 0)} ms`);
}
let c2Gaps = 0, c2Match = 0;
function traceC2(info) {
  const on = (info.frames ?? []).filter(x => x.top != null), ts = x => x.ts ?? x.t;
  let gap = 0, raw = 0, ctd = 0;
  for (let k = 1; k < on.length; k++) {
    gap = Math.max(gap, ts(on[k]) - ts(on[k - 1])); raw = Math.max(raw, Math.abs(on[k].top - on[k - 1].top));
    if (on[k].ct != null && on[k - 1].ct != null && on[k - 1].ct > 0) ctd = Math.max(ctd, Math.abs(on[k].ct - on[k - 1].ct - (on[k].ts - on[k - 1].ts)));
  }
  const pairs = on.flatMap((x, k) => (k && ts(x) - ts(on[k - 1]) >= 25 ? [k] : []));
  const r = info.replay;
  let rep = 0, match = 0;
  if (r) {
    for (const g of r.gaps) if (g.tops) for (let k = 1; k < g.tops.length; k++) rep = Math.max(rep, Math.abs(g.tops[k] - g.tops[k - 1]));
    for (const m of r.atCt) match = Math.max(match, Math.abs(m.top - on[m.i].top));
    for (const g of r.gaps) if (g.tops && g.span[0] === 0 && on[g.i - 1].ct == null) match = Math.max(match, Math.abs(g.tops[0] - on[g.i - 1].top));
    for (const g of r.gaps) if (g.tops && on[g.i].ct == null) match = Math.max(match, Math.abs(g.tops[g.tops.length - 1] - on[g.i].top));
  }
  c2Gaps += pairs.length; c2Match = Math.max(c2Match, match);
  const gp = pairs.map(k => { const g = r?.gaps.find(x => x.i === k); return `${fx(ts(on[k]) - ts(on[k - 1]))} ms@${fx(on[k].t, 0)}${r ? (g?.tops ? ` replayable [${fx(g.span[0])}, ${fx(g.span[1])}]` : ' raw') : ''}`; });
  console.log(`  ${info.theme} ${info.rate}x: ${on.length} frames, largest gap ${fx(gap)} ms, ${pairs.length} gap pairs${gp.length ? ` (${gp.join('; ')})` : ''}, largest raw step ${fx(raw, 2)} px${r ? `, largest replayed step ${fx(rep, 2)} px, replay match ${fx(match, 3)} px` : ''}${on.some(x => 'ct' in x) ? `, largest |ct step - ts step| ${fx(ctd, 3)} ms` : ''}`);
}

const chrome = await chromium.launch({ ...exe, args: ['--no-sandbox'] });
const browser = { newContext: async opts => wrapContext(await chrome.newContext(opts), opts) };
/** HT-8 launches its own browser (:8013); its contexts get the same faults. */
const chromiumW = {
  launch: async o => {
    const b8 = await chromium.launch(o), nc = b8.newContext.bind(b8);
    b8.newContext = async opts => wrapContext(await nc(opts), opts);
    return b8;
  },
};

console.log(`${process.env.MARC_CHROMIUM ?? 'chromium'} ${chrome.version()} · ${BLOCK} ${OLD ? 'main 5158609c' : GATE || 'working tree'} block ${sha.slice(0, 12)} · stall ${STALL}${STALL ? (AT_CT != null ? ` at ct ${AT_CT}` : ` at frame ${AT_FRAME}`) : ''} · fail ${FAIL || '-'} · delay ${DELAY ? `${DELAY} ${DELAY_MS} ms` : '-'} · seed ${SEED || 'none'} · expect ${EXPECT}${WANT.length ? ` · want ${WANT.map(String).join(', ')}` : ''}`);
let done = 0, matched = 0;
try {
  for (let run = 1; run <= RUNS; run++) {
    const errors = [];
    try {
      await block({ runs: k => k === KEYS[BLOCK] }, browser, chromiumW, errors, PORT, ROOT, OUT, console);
    } catch (e) { errors.push(`threw: ${e.stack ?? e}`); }
    done++;
    const red = errors.length > 0, missing = WANT.filter(w => !errors.some(e => w.test(e)));
    const ok = (red ? 'red' : 'green') === EXPECT && !missing.length;
    if (ok) matched++;
    console.log(`run ${run}: ${red ? `RED (${errors.length})` : 'green'}${missing.length ? ` · no error matches ${missing.map(String).join(', ')}` : ''}`);
    for (const e of errors) console.log(`  ${e}`);
  }
} finally { await chrome.close(); }
if (BLOCK === 'copy2' && TRACE) console.log(`trace: ${c2Gaps} gap pairs over all contexts, largest replay match difference ${fx(c2Match, 3)} px`);
console.log(`${done} of ${RUNS} runs, ${matched} ${EXPECT} as expected`);
process.exit(done === RUNS && matched === RUNS ? 0 : 1);
