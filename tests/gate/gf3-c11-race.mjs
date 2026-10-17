// GATE-FLAKE-3 repro and proof (docs/COACHING-DECISIONS.md D-GF3-2). Runs HT-6's C11 checks (open, close, reduced
// motion) on the lat pulldown close-up, app against golden B, with a delay between each tap and its read, as a loaded
// runner adds. Needs `npm run build`. Exit 0 only when every run is green and the run count is the one asked for.
//   node tests/gate/gf3-c11-race.mjs [--old] [--lag ms] [--runs n] [--seed name] [--theme t]
// --old: main's read (tap, round trip, panel.getAnimations()) instead of scripts/c11-anims.mjs.
// --seed: a defect in the app page; each must turn the run red (see SEEDS).
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i < 0 ? d : process.argv[i + 1]; };
const OLD = process.argv.includes('--old'), LAG = Number(arg('lag', 0)), RUNS = Number(arg('runs', 1)), SEED = arg('seed', ''), THEME = arg('theme', 'silent-black');
process.env.MARC_GF3_LAG = String(LAG);
const H = await import('../../tools/plates/fidelity/harness.mjs');
const C11 = await import('../../scripts/c11-anims.mjs');
const ID = 'lat-pulldown', SEL = `#${ID}-zoom-hand`, PORT = '4180';

/** Defects put into the app page (after the recorder, so they act on what the app asks for). */
const SEEDS = {
  'close-duration': () => wrap((prev, el, k, o) => prev.call(el, k, k[1]?.transform === 'scale(.96)' ? { ...o, duration: 200 } : o)),
  'no-close': () => wrap((prev, el, k, o) => (k[1]?.transform === 'scale(.96)' ? { cancel() {}, set onfinish(f) { setTimeout(f, 160); } } : prev.call(el, k, o))),
  'two-anims': () => wrap((prev, el, k, o) => { if (k[1]?.transform === 'scale(.96)') prev.call(el, [{ opacity: 1 }, { opacity: 0 }], o); return prev.call(el, k, o); }),
  'open-keyframes': () => wrap((prev, el, k, o) => prev.call(el, k[0]?.transform === 'scale(.9)' ? [{ ...k[0], transform: 'scale(.8)' }, k[1]] : k, o)),
  'css-close': () => wrap((prev, el, k, o) => {
    if (k[1]?.transform === 'scale(.96)') { const st = document.createElement('style'); st.textContent = '@keyframes gf3x { to { opacity: .5 } }'; document.head.append(st); el.style.animation = 'gf3x 160ms'; }
    return prev.call(el, k, o);
  }),
  'reduced-anim': () => new MutationObserver(ms => { for (const m of ms) if (m.target.matches?.('[id$="-zoom-hand"]') && !m.target.hidden) m.target.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240 }); })
    .observe(document.body, { subtree: true, attributes: true, attributeFilter: ['hidden'] }),
};
const SEED_SRC = SEED && `(() => { const wrap = f => { const prev = Element.prototype.animate; Element.prototype.animate = function (k, o) { return this.matches('[id$="-zoom-hand"]') ? f(prev, this, k, o) : prev.call(this, k, o); }; }; (${SEEDS[SEED]})(); })()`;
if (SEED && !SEEDS[SEED]) throw new Error(`no seed ${SEED}`);

/** main's read, 41807999 scripts/screenshot-gate.mjs:6514, with the same delay between the tap and the read. */
const animsOf = async (page, sel) => { if (LAG) await new Promise(r => setTimeout(r, LAG)); return page.evaluate(s => document.querySelector(s).getAnimations().map(a => ({ k: a.effect.getKeyframes().map(f => ({ o: f.opacity, t: f.transform, off: f.offset })), d: a.effect.getTiming().duration, e: a.effect.getTiming().easing })), sel); };
const tapIn = (page, sel) => page.evaluate(s => document.querySelector(s).click(), sel);
const seed = async page => { if (SEED_SRC) { await C11.install(page); await page.evaluate(SEED_SRC); } };

const server = spawn(process.execPath, [join(ROOT, 'node_modules/vite/bin/vite.js'), 'preview', '--port', PORT, '--strictPort'], { cwd: ROOT, stdio: 'ignore' });
process.on('exit', () => server.kill('SIGKILL'));
for (let i = 0; ; i++) { try { await fetch(`http://localhost:${PORT}/`); break; } catch { if (i > 100) throw new Error('no preview server'); await new Promise(r => setTimeout(r, 100)); } }
const browser = await chromium.launch({ ...(process.env.MARC_CHROMIUM ? { executablePath: process.env.MARC_CHROMIUM } : { channel: 'chromium' }), args: ['--no-sandbox'] });
const GB = readFileSync(join(ROOT, 'tests/howto/golden/howto-layers.html'));
const index = H.HT_PLATES.findIndex(p => p[0] === ID);
let done = 0, red = 0;
try {
  const app = await H.openAppTrain(browser, PORT, THEME), gold = await H.openGolden(browser, THEME, { html: GB });
  const rapp = await H.openAppTrain(browser, PORT, THEME, { reducedMotion: 'reduce' });
  await H.openHowTo(app.page, index); await H.openHowTo(rapp.page, index);
  if (SEED !== 'reduced-anim') await seed(app.page); else await seed(rapp.page);
  console.log(`${process.env.MARC_CHROMIUM ?? 'chromium'} ${browser.version()} · ${OLD ? 'old read' : 'c11-anims'} · lag ${LAG} ms · seed ${SEED || 'none'}`);
  for (let run = 1; run <= RUNS; run++) {
    const bad = [];
    let aA, aG, cA, cG, o, c, shut;
    if (OLD) {
      await app.page.click(`#${ID}-chip-hand`);
      await app.page.locator(`dialog.sheet.ht ${SEL}`).waitFor({ state: 'visible', timeout: 8000 });
      [aA, aG] = await Promise.all([animsOf(app.page, SEL), (async () => { await gold.page.click(`#${ID}-chip-hand`); return animsOf(gold.page, SEL); })()]);
    } else {
      aA = await C11.captureAnims(app.page, SEL, async () => { await app.page.click(`#${ID}-chip-hand`); await app.page.locator(`dialog.sheet.ht ${SEL}`).waitFor({ state: 'visible', timeout: 8000 }); }, 'shown');
      aG = await C11.captureAnims(gold.page, SEL, () => gold.page.click(`#${ID}-chip-hand`), 'shown');
    }
    if (C11.c11Bad(aA, aG)) bad.push(`open: app ${JSON.stringify(aA)} vs golden ${JSON.stringify(aG)}`);
    await H.settleApp(app.page); await H.settle(gold.page);
    if (OLD) {
      const s = async pg => { await pg.click(`${SEL}-close`); return animsOf(pg, SEL); };
      [cA, cG] = await Promise.all([s(app.page), s(gold.page)]);
    } else {
      const s = pg => C11.captureAnims(pg, SEL, () => pg.click(`${SEL}-close`), 'hidden');
      [cA, cG] = await Promise.all([s(app.page), s(gold.page)]);
    }
    if (C11.c11Bad(cA, cG)) bad.push(`close: app ${JSON.stringify(cA)} vs golden ${JSON.stringify(cG)}`);
    await H.settleApp(app.page); await H.settle(gold.page);
    if (OLD) {
      await tapIn(rapp.page, `#${ID}-chip-hand`); await rapp.page.locator(`dialog.sheet.ht ${SEL}`).waitFor({ state: 'visible' });
      o = await animsOf(rapp.page, SEL);
      await tapIn(rapp.page, `${SEL}-close`);
      c = await animsOf(rapp.page, SEL); shut = await rapp.page.evaluate(s => document.querySelector(s).hidden, SEL);
    } else {
      o = await C11.captureAnims(rapp.page, SEL, async () => { await tapIn(rapp.page, `#${ID}-chip-hand`); await rapp.page.locator(`dialog.sheet.ht ${SEL}`).waitFor({ state: 'visible' }); }, 'shown');
      c = await C11.captureAnims(rapp.page, SEL, async () => { shut = await rapp.page.evaluate(s => { document.querySelector(`${s}-close`).click(); return document.querySelector(s).hidden; }, SEL); }, 'hidden');
    }
    if (o.length || c.length || !shut) bad.push(`reduced motion: open ${JSON.stringify(o)}, close ${JSON.stringify(c)}, closed at once ${shut}`);
    await H.settleApp(rapp.page);
    done++; if (bad.length) red++;
    console.log(`run ${run}: ${bad.length ? `RED ${bad.join(' · ')}` : 'green'}`);
  }
} finally { await browser.close(); }
console.log(`${done} of ${RUNS} runs, ${red} red`);
process.exit(done !== RUNS ? 2 : red ? 1 : 0);
