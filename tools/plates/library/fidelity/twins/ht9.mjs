// LIB-4b: the twin of gate group HT-9 (scripts/screenshot-gate.mjs, four statements: "HT-9 C19", "HT-9 Show",
// "HT-9 Order", "HT-9"), pinned by twins.mjs. One library id in one theme, one row per state (tuples.mjs statesOf):
// HT9/C19; HT9/{setup,risks,disclaimer}-{L3,copy}; HT9/A3; in HT_FULL HT9/show-<n> per Setup "Show me" button (DOM
// order) and HT9/A5; in Silent Black HT9/order. Same contexts, taps, waits, compare rules and thresholds as the blocks;
// the app is seeded with the run's order, golden B is the id's layers page (pages[lib].layers).
// Not here (LIB-4-DESIGN X7, once per run on index 0): the HT-3b A3 split timing and the A3 duplicate-line fixture.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import * as H from '../../../fidelity/harness.mjs';
import * as GBm from '../../../fidelity/goldenB.mjs';
import { plateJob, plateStats } from '../plate.mjs';
import { stateOf } from '../rows.mjs';
import { WIDTH } from '../tuples.mjs';

const APP = 'dialog.sheet.ht';
const S = sub => stateOf('HT9', sub, WIDTH);
const msg = e => e.message.split('\n')[0];

/** The content strings, from the generated modules themselves (the "HT-9" block's esbuild bundle), once per root. */
const bundles = new Map();
function content(root) {
  if (!bundles.has(root)) bundles.set(root, (async () => {
    const { build: esb } = await import('esbuild');
    const genDir = join(root, 'src/howto/generated');
    const htFiles = readdirSync(genDir).filter(f => /^ht-.*\.ts$/.test(f));
    const entry = `${htFiles.map((f, i) => `import h${i} from ${JSON.stringify(join(genDir, f))};`).join('\n')}\nexport const HOWTOS = [${htFiles.map((_, i) => `h${i}`).join(', ')}];\nexport * from ${JSON.stringify(join(root, 'src/howto/archetypes.ts'))};\n`;
    const bundled = await esb({ stdin: { contents: entry, resolveDir: root, loader: 'ts' }, bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'silent' });
    const C = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
    const FLAG = { wrist: C.RED_FLAG, shoulder: C.RED_FLAG_SHOULDER, knee: C.RED_FLAG_KNEE, elbow: C.RED_FLAG_ELBOW };
    const flagLines = Object.fromEntries(Object.entries(FLAG).map(([k, F]) => [k, [F.name, F.now, F.doctor]]));
    return { C, flagLines };
  })());
  return bundles.get(root);
}

/** C19's inputs, read as the "HT-9 C19" block reads them (ESC_NC_RE from tests/guards/no-contacts.ts, DISCLAIMER). */
function c19Inputs(root) {
  const nc = Object.fromEntries([...readFileSync(join(root, 'tests/guards/no-contacts.ts'), 'utf8').matchAll(/^export const (\w+) = \/(.*)\/([a-z]*);$/gm)].map(m => [m[1], new RegExp(m[2], m[3])]));
  if (Object.keys(nc).length !== 4) throw new Error(`ESC-NC: expected 4 patterns in tests/guards/no-contacts.ts, read ${Object.keys(nc).join(', ')}`);
  const d = readFileSync(join(root, 'src/howto/archetypes.ts'), 'utf8').match(/export const DISCLAIMER: string = "((?:[^"\\]|\\.)*)";/);
  if (!d) throw new Error('HT-9 C19: no DISCLAIMER in src/howto/archetypes.ts');
  return {
    patterns: ['CONTACT_RE', 'SOURCE_RE', 'SOURCE_CS_RE'].map(k => ({ source: nc[k].source, flags: nc[k].flags })),
    words: ['Measured', 'Mechanics', 'Coaching consensus', 'Weak for this use'],
    disclaimer: JSON.parse(`"${d[1]}"`),
  };
}

export async function run(ctx, job) {
  const { theme } = job;
  const parts = [c19(ctx, job), ...(H.HT_FULL.includes(theme) ? [show(ctx, job)] : []), ...(theme === 'silent-black' ? [order(ctx, job)] : [])];
  await Promise.all(parts);   // the blocks run side by side in their own contexts; none of these three compares pixels
  await main(ctx, job);
  if (H.HT_FULL.includes(theme)) await a5(ctx, job);
}

/** "HT-9 C19": everything opened; no link, source or contact UI; exactly one disclaimer, after the last red flag. */
async function c19({ browser, port, R, order, custom, root }, { lib, index, theme }) {
  const st = S('C19'), { patterns, words, disclaimer } = c19Inputs(root);
  const { ctx, page } = await H.openAppTrain(browser, port, theme, { order, custom, onError: m => R.fail(lib, theme, st, `page error: ${m}`) });
  try {
    await H.openHowTo(page, index);
    await page.locator('dialog.sheet.ht .ht-disclaimer').waitFor({ state: 'attached', timeout: 5000 });
    await page.evaluate(() => { document.querySelectorAll('dialog.sheet.ht details:not([open])').forEach(d => { d.open = true; }); });
    for (let i = 0; i < 4; i++) {
      const opened = await page.evaluate(() => {
        const btns = [...document.querySelectorAll('dialog.sheet.ht [aria-expanded="false"]')];
        btns.forEach(b => b.click());
        return btns.length;
      });
      if (!opened) break;
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.getAnimations().every(a => a.playState !== 'running' && !a.pending), null, { timeout: 8000 });
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    }
    const found = await page.evaluate(([pats, words, disclaimer]) => {
      const dlg = document.querySelector('dialog.sheet.ht');
      const problems = [];
      const res = pats.map(p => new RegExp(p.source, p.flags));
      const linkN = dlg.querySelectorAll('a').length;
      if (linkN) problems.push(`${linkN} <a> element(s)`);
      const targetN = dlg.querySelectorAll('[target]').length;
      if (targetN) problems.push(`${targetN} [target] element(s)`);
      const bannedN = dlg.querySelectorAll('.srcs,.src-cite,.src-ev,.src-key,.ev').length;
      if (bannedN) problems.push(`${bannedN} banned-class element(s) (.srcs/.src-cite/.src-ev/.src-key/.ev)`);
      for (const el of dlg.querySelectorAll('*')) {
        const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim();
        if (own && words.includes(own)) problems.push(`element with own text "${own}" (an evidence label word)`);
      }
      const strings = [dlg.innerText];
      for (const el of dlg.querySelectorAll('[aria-label],[title],[alt]')) {
        for (const a of ['aria-label', 'title', 'alt']) { const v = el.getAttribute(a); if (v) strings.push(v); }
      }
      for (const s of strings) for (const re of res) { const m = s.match(re); if (m) problems.push(`"${m[0]}" matches ${re}`); }
      const disclaimers = [...dlg.querySelectorAll('.ht-disclaimer')];
      if (disclaimers.length !== 1) problems.push(`${disclaimers.length} .ht-disclaimer element(s), expected 1`);
      else if (disclaimers[0].textContent !== disclaimer) problems.push(`disclaimer text "${disclaimers[0].textContent}" !== owner's text`);
      const redflags = [...dlg.querySelectorAll('.redflag')];
      if (redflags.length && disclaimers.length === 1) {
        const last = redflags[redflags.length - 1];
        const pos = last.compareDocumentPosition(disclaimers[0]);
        if (!(pos & Node.DOCUMENT_POSITION_FOLLOWING)) problems.push('the disclaimer is not after the last .redflag');
      }
      return problems;
    }, [patterns, words, disclaimer]);
    R.check(lib, theme, st, found);
    await H.closeHowTo(page);
  } catch (e) { R.fail(lib, theme, st, `C19 crashed: ${msg(e)}`); } finally { await ctx.close(); }
}

/** "HT-9 Show": every Setup "Show me" button, tapped by id in DOM order, opens its close-up; ids equal golden B's. */
async function show({ browser, port, R, order, custom, root, pages }, { lib, chrome, index, theme, facts }) {
  const HT7 = existsSync(join(root, 'src/slices/howto/sections/Posture.tsx'));
  const esc = chrome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const gold = [...new Set([...String(pages[lib].layers).matchAll(new RegExp(`id="(${esc}-step-\\d+-show)"`, 'g'))].map(m => m[1]))].sort();
  let cur = null;
  const seen = [], states = [];
  const { ctx, page } = await H.openAppTrain(browser, port, theme, { order, custom, onError: m => R.fail(lib, theme, cur ?? S('show-1'), `page error: ${m}`) });
  try {
    await H.openHowTo(page, index);
    await page.locator('dialog.sheet.ht .setup').waitFor({ state: 'attached', timeout: 5000 });
    await H.settleApp(page);
    const btns = await page.evaluate(() => [...document.querySelectorAll('dialog.sheet.ht .setup .st-show')].map(b => ({ id: b.id, key: b.dataset.zoom, hm: b.classList.contains('hm-show') })));
    for (const [i, btn] of btns.entries()) {
      cur = S(`show-${i + 1}`); states.push(cur);
      const bad = [];
      seen.push(btn.id);
      if (btn.hm) bad.push(`${btn.id} is a handling-mistake button inside Setup`);
      await page.evaluate(i => document.getElementById(i).click(), btn.id);
      const must = HT7 || btn.key === 'hand';
      const shown = await page.locator(`dialog.sheet.ht .zx[data-zoom="${btn.key}"]`).waitFor({ state: 'visible', timeout: must ? 8000 : 1000 }).then(() => true).catch(() => false);
      await H.settleApp(page);
      const state = await page.evaluate(k => {
        const dlg = document.querySelector('dialog.sheet.ht'), panel = dlg.querySelector(`.zx[data-zoom="${k}"]`);
        if (!panel || panel.hidden) return 'no .zx panel opened';
        const r = panel.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) return 'the panel has no visible size';
        const plate = dlg.querySelector('.ht-plate-fit');
        if (plate && !plate.hidden) return 'the plate box is not hidden with the close-up open';
        return null;
      }, btn.key);
      // the block counts a posture tap before HT-7 as "pending" (never a failure); with HT-7 in the build it must open
      if (!(shown && !state) && must) bad.push(`${btn.id} (${btn.key}): ${state ?? 'nothing opened'}`);
      R.check(lib, theme, cur, bad);
      await page.evaluate(() => document.querySelector('dialog.sheet.ht .zx:not([hidden]) .zx-close')?.click());
      await H.settleApp(page);
    }
    cur = null;
    await H.closeHowTo(page);
  } catch (e) { R.fail(lib, theme, cur ?? S('show-1'), `Show crashed: ${msg(e)}`); } finally { await ctx.close(); }
  const got = [...seen].sort();
  if (JSON.stringify(got) !== JSON.stringify(gold)) {
    const m = `setup "Show me" ids ${JSON.stringify(got)} !== golden B's ${JSON.stringify(gold)}`;
    const all = new Set([...states, ...[...Array(Math.max(facts.shows, 1))].map((_, i) => S(`show-${i + 1}`))]);
    for (const st of all) R.fail(lib, theme, st, m);
  }
}

/** "HT-9 Order": the sections that render something, in golden B's order (Silent Black only). */
async function order({ browser, port, R, order: seed, custom }, { lib, index, theme }) {
  const st = S('order'), WANT = ['hand', 'feel', 'setup', 'risks'];
  const { ctx, page } = await H.openAppTrain(browser, port, theme, { order: seed, custom, onError: m => R.fail(lib, theme, st, `page error: ${m}`) });
  try {
    await H.openHowTo(page, index);
    await page.locator('dialog.sheet.ht .ht-disclaimer').waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
    const got = await page.evaluate(() => [...document.querySelectorAll('dialog.sheet.ht [data-section]')].filter(el => el.childNodes.length).map(el => el.dataset.section));
    R.check(lib, theme, st, JSON.stringify(got) !== JSON.stringify(WANT) ? [`section order ${JSON.stringify(got)} !== golden B's ${JSON.stringify(WANT)}`] : []);
    await H.closeHowTo(page);
  } catch (e) { R.fail(lib, theme, st, `Order crashed: ${msg(e)}`); } finally { await ctx.close(); }
}

/** The text nodes under `sel`, in DOM order (whitespace-only nodes skipped). */
const leaves = (page, sel) => page.evaluate(s => {
  const e = document.querySelector(s);
  if (!e) return null;
  const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), out = [];
  for (let n = w.nextNode(); n; n = w.nextNode()) if (n.textContent.trim()) out.push(n.textContent);
  return out;
}, sel);
const rectOf = (page, sel) => page.evaluate(s => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }, sel);

/** A3, run in the app page: the red-flag blocks, each line once, one disclaimer. Returns the problems. */
const a3Probe = (page, flags, flagLines, disclaimer) => page.evaluate(([flags, lines, disclaimer, APP]) => {
  const dlg = document.querySelector(APP), bad = [];
  const w = document.createTreeWalker(dlg, NodeFilter.SHOW_TEXT), texts = [];
  for (let n = w.nextNode(); n; n = w.nextNode()) texts.push(n);
  const order = [...dlg.querySelectorAll('.redflag')].map(e => e.id.replace(/^.*-redflag-/, ''));
  if (JSON.stringify(order) !== JSON.stringify(flags)) bad.push(`red-flag blocks ${JSON.stringify(order)}, riskFlags ${JSON.stringify(flags)}`);
  for (const l of new Set(Object.values(lines).flat())) {
    const owners = flags.filter(k => lines[k].includes(l));
    const at = texts.filter(n => n.textContent === l);
    if (at.length !== owners.length) bad.push(`the red-flag line "${l}" shows ${at.length} times, expected ${owners.length}`);
    const homes = at.map(n => n.parentElement.closest('.risks .redflag')?.id.replace(/^.*-redflag-/, '') ?? null);
    if (JSON.stringify(homes) !== JSON.stringify(owners.slice(0, at.length))) bad.push(`the red-flag line "${l}" sits in ${JSON.stringify(homes)}, expected ${JSON.stringify(owners)}`);
  }
  const d = texts.filter(n => n.textContent === disclaimer);
  if (d.length !== 1 || dlg.querySelectorAll('.ht-disclaimer').length !== 1) bad.push(`the disclaimer shows ${d.length} times`);
  return bad;
}, [flags, flagLines, disclaimer, APP]);

/** A1: L3 of one element, the golden one placed at the app one's viewport position, both on their own layer. */
async function l3(app, gold, fail, px, aSel, gSel) {
  await gold.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  const own = (pg, s, on) => pg.evaluate(([s, on]) => { document.querySelector(s).style.willChange = on ? 'transform' : ''; }, [s, on]);
  await own(app, aSel, true); await own(gold, gSel, true);
  await H.settleApp(app); await H.settle(gold);
  const place = () => app.evaluate(s => { const z = document.querySelector(s), panel = z.closest('.sheet-panel'), top = panel.querySelector('.sheet-top').getBoundingClientRect().bottom; panel.scrollTop += z.getBoundingClientRect().top - (top + 8); const r = z.getBoundingClientRect(); return r.top >= top - 0.001 && r.bottom <= innerHeight + 0.001; }, aSel);
  let tall = false;
  if (!(await place())) {
    tall = true;
    await Promise.all([app.setViewportSize({ width: 390, height: H.TALL_H }), gold.setViewportSize({ width: 390, height: H.TALL_H })]);
    await H.settleApp(app);
    if (!(await place())) fail(`does not fit a 390 x ${H.TALL_H} viewport below the sheet header`);
  }
  await H.settleApp(app);
  const at = await rectOf(app, aSel);
  await gold.evaluate(([s, at]) => {
    document.documentElement.style.overflowAnchor = 'none';
    document.body.style.marginTop = '0px'; window.scrollTo({ top: 0, behavior: 'instant' });
    for (let k = 0; k < 3; k++) { const r = document.querySelector(s).getBoundingClientRect(); if (r.top === at.y) break; document.body.style.marginTop = `${parseFloat(document.body.style.marginTop) + at.y - r.top}px`; }
  }, [gSel, at]);
  await H.settleApp(app); await H.settle(gold);
  const [ra, rg] = [await rectOf(app, aSel), await rectOf(gold, gSel)];
  let ok = false;
  if (ra.x !== rg.x || ra.y !== rg.y || ra.width !== rg.width || ra.height !== rg.height) fail(`box app ${JSON.stringify(ra)} vs golden ${JSON.stringify(rg)}`);
  else {
    const [a, g] = [await H.capture(app, ra), await H.capture(gold, rg)];
    const d = await H.diffPng(app, a, g);
    px(d.off);
    ok = true;
    if (d.ink < 0.02) { ok = false; fail(`the app capture is blank (ink ${d.ink})`); }
    if (!H.meetsRule(d)) { ok = false; fail(`L3: ${d.off} px off (max ${d.maxDelta}/255, ${d.off1} off by 1, of ${d.total}${d.sameSize ? '' : `, sizes ${d.width}x${d.height} vs ${d.otherWidth}x${d.otherHeight}`})${tall ? ` at 390 x ${H.TALL_H}` : ''}`); }
  }
  await own(app, aSel, false); await own(gold, gSel, false);
  await gold.evaluate(() => { document.body.style.marginTop = '0px'; window.scrollTo(0, 0); });
  if (tall) { await Promise.all([app.setViewportSize(H.DEVICE.viewport), gold.setViewportSize(H.DEVICE.viewport)]); await H.settleApp(app); }
  return ok;
}

/** "HT-9": A1 L3 and A4 copy of Setup, Risks and the disclaimer against golden B, and A3. */
async function main({ browser, port, R, pages, order, custom, root }, { lib, chrome: id, index, theme }) {
  const { C, flagLines } = await content(root);
  const h = C.HOWTOS.find(x => x.id === lib);
  const L = { setup: S('setup-L3'), risks: S('risks-L3'), disclaimer: S('disclaimer-L3') };
  const all = [...Object.values(L), S('setup-copy'), S('risks-copy'), S('disclaimer-copy'), S('A3')];
  if (!h) { for (const st of all) R.fail(lib, theme, st, `HT-9: no generated How-to for ${lib}`); return; }
  let cur = null;
  const onErr = which => m => R.fail(lib, theme, cur ?? L.setup, `${which} page error: ${m}`);
  const app = await H.openAppTrain(browser, port, theme, { order, custom, onError: onErr('app') });
  const gold = await H.openGolden(browser, theme, { html: pages[lib].layers, onError: onErr('golden') });
  const appSel = sel => sel.replace(`#card-${id}`, APP);
  try {
    await H.openHowTo(app.page, index);
    for (const s of ['.setup', '.risks', '.ht-disclaimer']) await app.page.locator(`${APP} ${s}`).waitFor({ state: 'attached', timeout: 5000 });
    await H.settleApp(app.page);
    const states = await GBm.statesFor(gold.page, id);
    const setupS = states.find(s => s.name === `${id}: setup (every step shown)`), risksS = states.find(s => s.name === `${id}: risks`);
    if (!setupS || !risksS) { for (const st of all) R.fail(lib, theme, st, 'goldenB.mjs has no setup/risks state'); return; }
    cur = L.setup;
    await setupS.open();
    const hidden = await app.page.evaluate(A => ({ more: !!document.querySelector(`${A} .st-more`), hidden: document.querySelectorAll(`${A} .st-list li[hidden]`).length }), APP);
    if (hidden.more || hidden.hidden) R.fail(lib, theme, L.setup, `every setup step should show (${JSON.stringify(hidden)})`);
    // A1
    const pairs = [['setup', setupS.selector], ...risksS.selector.map(s => [s.endsWith('.risks') ? 'risks' : 'disclaimer', s])];
    if (pairs.length !== 3) for (const st of [L.risks, L.disclaimer]) R.fail(lib, theme, st, `goldenB.mjs's risks state has ${risksS.selector.length} selectors, expected the section and the disclaimer`);
    for (const [label, gSel] of pairs) {
      cur = L[label];
      try {
        const ok = await l3(app.page, gold.page, m => R.fail(lib, theme, L[label], m), off => R.px(lib, theme, L[label], off), appSel(gSel), gSel);
        if (ok) R.ok(lib, theme, L[label]);
      } catch (e) { R.fail(lib, theme, L[label], `A1 crashed: ${msg(e)}`); }
    }
    // A4
    const zoomChip = key => h.zooms.find(z => z.key === key)?.chip;
    const head = s => gold.page.evaluate(s => document.querySelector(s)?.textContent ?? null, s);
    const want = {
      setup: [await head(`#${id}-setup-h`), ...h.setup.flatMap((s, i) => [String(i + 1), s.text, ...(s.zoom && zoomChip(s.zoom) ? [`Show me the ${zoomChip(s.zoom).toLowerCase()}`] : [])])],
      risks: [await head(`#${id}-risks-h`), ...h.risks.map(r => r.text), ...(h.riskFlags ?? ['wrist']).flatMap(f => flagLines[f])],
      disclaimer: [C.DISCLAIMER],
    };
    for (const [label, gSel] of pairs) {
      const st = S(`${label}-copy`);
      cur = st;
      const [la, lg] = [await leaves(app.page, appSel(gSel)), await leaves(gold.page, gSel)];
      const bad = [];
      if (JSON.stringify(la) !== JSON.stringify(want[label])) bad.push(`A4 ${label}: on-screen copy ${JSON.stringify(la)} !== content strings ${JSON.stringify(want[label])}`);
      if (JSON.stringify(lg) !== JSON.stringify(want[label])) bad.push(`A4 ${label}: golden B's copy ${JSON.stringify(lg)} !== content strings ${JSON.stringify(want[label])}`);
      R.check(lib, theme, st, bad);
    }
    // A3 (its duplicate-line fixture runs once per run, not per id: LIB-4-DESIGN X7)
    cur = S('A3');
    R.check(lib, theme, S('A3'), (await a3Probe(app.page, h.riskFlags ?? ['wrist'], flagLines, C.DISCLAIMER)).map(b => `A3: ${b}`));
    cur = null;
    await H.closeHowTo(app.page);
  } catch (e) { R.fail(lib, theme, cur ?? L.setup, `HT-9 crashed: ${msg(e)}`); } finally { await app.ctx.close(); await gold.ctx.close(); }
}

/**
 * The "HT-9" block's A5 `mutate`, verbatim: scroll the sheet to the end and open every collapsed control (zoom chips
 * aside; one feel row per feel section), then drop the feel rows' finished entry animations (D-HT9-C19-settle).
 * Runs in the app page (serialized by Playwright).
 */
export const openAll = async () => {
  const A = 'dialog.sheet.ht';
  const wait = (f, what = 'Setup/Risks never mounted') => new Promise((r, j) => { const t0 = performance.now(); const k = () => (f() ? r() : performance.now() - t0 > 5000 ? j(new Error(`HT-9 A5: ${what}`)) : requestAnimationFrame(k)); k(); });
  await wait(() => document.querySelector(`${A} .ht-disclaimer`) && document.querySelector(`${A} .setup`));
  const panel = document.querySelector(`${A} .sheet-panel`);
  panel.scrollTop = panel.scrollHeight;
  await wait(() => document.querySelector(`${A} .feel .fr-btn`), 'the feel section never mounted');
  for (let i = 0; i < 4; i++) {
    document.querySelectorAll(`${A} details:not([open])`).forEach(d => { d.open = true; });
    document.querySelectorAll(`${A} [aria-expanded="false"]:not(.zx-chip):not(.fr-btn)`).forEach(b => b.click());
    document.querySelectorAll(`${A} .feel`).forEach(f => { const r = [...f.querySelectorAll('.fr-btn')].pop(); if (r?.getAttribute('aria-expanded') === 'false') r.click(); });
    panel.scrollTop = panel.scrollHeight;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  }
  if (panel.scrollTop < 1 || panel.scrollTop + panel.clientHeight < panel.scrollHeight - 1) throw new Error(`HT-9 A5: the sheet did not scroll to the end (${panel.scrollTop}/${panel.scrollHeight})`);
  if (document.querySelectorAll(`${A} [aria-expanded="false"]:not(.zx-chip):not(.fr-btn), ${A} details:not([open])`).length) throw new Error('HT-9 A5: a collapsed control stayed closed');
  for (const f of document.querySelectorAll(`${A} .feel`)) if (f.querySelectorAll('.fr-btn[aria-expanded="true"]').length !== 1) throw new Error('HT-9 A5: a feel section does not have exactly one row open');
  const drop = el => { for (const a of el.getAnimations()) if (a.playState === 'finished') { a.commitStyles(); a.cancel(); } };
  document.addEventListener('animationend', e => { if (e.target.closest?.('.feel')) drop(e.target); }, true);
  await wait(() => document.getAnimations().every(a => a.playState !== 'running' && !a.pending), 'an animation kept running');
  for (const a of document.getAnimations()) if (a.playState === 'finished' && a.effect?.target?.closest?.('.feel')) { a.commitStyles(); a.cancel(); }
};

/** "HT-9" A5 (HT_FULL): the HT-3 plate compare (L2b, F3, L3 at 390, N and M) after openAll, against the plates page. */
async function a5({ browser, port, R, pages, order, custom }, { lib, chrome, index, theme }) {
  const st = stateOf('HT9', 'A5', WIDTH), stats = plateStats();
  try {
    await plateJob(browser, port, R, { lib, chrome, index, theme, html: pages[lib].plates, order, custom, full: false, widths: [], mutate: openAll, as: st, stats });
  } catch (e) { R.fail(lib, theme, st, `A5 (after scrolling to the end and opening everything) crashed: ${msg(e)}`); }
  if (stats.pairs < 2) R.fail(lib, theme, st, `A5: only ${stats.pairs} plate pairs compared, expected {N, M} (>= 2)`);
}
