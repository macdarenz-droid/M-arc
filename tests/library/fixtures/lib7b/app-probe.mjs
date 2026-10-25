// LIB-7b app probes on the shared-key scratch tree (7b-A2 fresh-context styling, 7b-A4 app context; never run in main
// CI). Run in the scratch tree after `vite build`, from its root:
//   node tests/library/fixtures/lib7b/app-probe.mjs <idA> <idB>        (two ids on one pair key, in seed order)
// (1) C10 in a fresh app context per id: open the How-to and its Hand chip; the pair panel's first pager button has the
//     same height as on its layers page (the panel is styled by its zoom-<chromeId>.css, D-LIB2b-HANDCSS).
// (2) D-LIB7b-PAGEDUP in one app context (the HT-7 A2 probe): open id A's hand close-up, close it and its How-to, open
//     id B's on the same key; no id is repeated in the document (gate :7375-7382).
// --keep (mutation, must be red): id A's panel is left in the document (a copy appended to body) before B's opens.
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { HT_CUSTOM, closeHowTo, openAppTrain, openGolden, openHowTo, settle, settleApp } from '../../../../tools/plates/fidelity/harness.mjs';
import { LAUNCH_ARGS } from '../../../../tools/plates/library/fidelity.mjs';
import { rows } from '../../../../tools/plates/library/registry.mjs';

const keep = process.argv.includes('--keep'), ids = process.argv.slice(2).filter(a => a !== '--keep'), PORT = process.env.MARC_LIB_PORT || '4181', order = [...ids, HT_CUSTOM.id], custom = HT_CUSTOM;
const chromeOf = id => rows().find(r => r.id === id).chromeId, layersOf = id => readFileSync(rows().find(r => r.id === id).pages.layers);
const SHEET = 'dialog.sheet.ht .zx[data-zoom="hand"]:has(> [class*="hx-hp-"])';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', PORT, '--strictPort'], { stdio: 'ignore' });
const browser = await chromium.launch({ executablePath: process.env.MARC_CHROMIUM, args: LAUNCH_ARGS });
const bad = [];
try {
  for (let i = 0; i < 120; i++) { try { await fetch(`http://localhost:${PORT}/`); break; } catch { await new Promise(r => setTimeout(r, 250)); } }
  const pagerH = async (page, sel) => page.evaluate(s => document.querySelector(`${s} .zx-page:not([hidden]) .pager-btn`)?.getBoundingClientRect().height ?? 0, sel);
  for (const [i, id] of ids.entries()) {
    const app = await openAppTrain(browser, PORT, 'silent-black', { order, custom });
    await openHowTo(app.page, i);
    await app.page.click(`#${chromeOf(id)}-chip-hand`);
    await app.page.locator(SHEET).waitFor({ state: 'visible', timeout: 8000 }); await settleApp(app.page);
    const gold = await openGolden(browser, 'silent-black', { html: layersOf(id) });
    await gold.page.click(`#${chromeOf(id)}-chip-hand`); await settle(gold.page);
    const [a, g] = [await pagerH(app.page, SHEET), await pagerH(gold.page, `#card-${chromeOf(id)} .zx[data-zoom="hand"]`)];
    console.log(`(1) ${id}: pager button height app ${a} px, page ${g} px`);
    if (!a || a !== g) bad.push(`(1) ${id}: pager button height app ${a} vs page ${g}`);
    await app.ctx.close(); await gold.ctx.close();
  }
  const app = await openAppTrain(browser, PORT, 'silent-black', { order, custom }), dup = () => app.page.evaluate(() => { const v = [...document.querySelectorAll('[id]')].map(e => e.id); return [...new Set(v.filter((x, i) => v.indexOf(x) !== i))]; });
  await openHowTo(app.page, 0);
  await app.page.click(`#${chromeOf(ids[0])}-chip-hand`); await app.page.locator(SHEET).waitFor({ state: 'visible', timeout: 8000 }); await settleApp(app.page);
  if (keep) await app.page.evaluate(s => { const c = document.querySelector(s).cloneNode(true); c.hidden = true; document.body.append(c); }, SHEET);
  await app.page.click(`${SHEET} .zx-close`); await settleApp(app.page);
  await closeHowTo(app.page);
  await openHowTo(app.page, 1);
  await app.page.click(`#${chromeOf(ids[1])}-chip-hand`); await app.page.locator(SHEET).waitFor({ state: 'visible', timeout: 8000 }); await settleApp(app.page);
  const d = await dup(), n = await app.page.locator('.zx[data-zoom="hand"]').count();
  console.log(`(2) A then B in one context: ${n} hand panel(s) in the document, duplicate ids ${JSON.stringify(d)}`);
  if (d.length) bad.push(`(2) duplicate ids in the document: ${d.join(', ')}`);
  await app.ctx.close();
} finally { await browser.close(); server.kill(); }
console.log(bad.length ? `FAIL\n${bad.join('\n')}` : 'PASS');
process.exit(bad.length ? 1 : 0);
