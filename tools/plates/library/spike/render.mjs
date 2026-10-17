// ENGINE SPIKE (do not merge): renders spike specs through the library page builder (golden A chrome) and saves
// Silent Black, Mistake (Silent Black) and Paper PNGs per card at 390 px, like LIB-8's cardShots.
//   node tools/plates/library/spike/render.mjs <out-dir> <label>=<spec path> ...
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { buildPlatesPage } from '../build-page.mjs';

const [outDir, ...pairs] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const items = pairs.map(p => { const [label, spec] = p.split('='); return { label, spec: resolve(spec) }; });
const ids = [];
const specs = {};
for (const it of items) {
  const mod = (await import(pathToFileURL(it.spec).href)).default;
  ids.push(mod.id); specs[mod.id] = it.spec; it.id = mod.id;
}
const { html, warnings } = await buildPlatesPage({ groups: [{ id: 'spike', title: 'Engine spike', ids }], sources: Object.fromEntries(ids.map(i => [i, ['Engine spike render (scratch).']])), specs, heading: { h1: 'Engine spike' } });
if (warnings.trim()) console.error(warnings.trim());
const file = join(outDir, 'page.html'); writeFileSync(file, html);
const browser = await chromium.launch({ executablePath: process.env.MARC_CHROMIUM || undefined });
const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 2, colorScheme: 'dark' });
const page = await ctx.newPage();
await page.goto(pathToFileURL(file).href);
await page.evaluate(() => document.fonts.ready);
const shot = async (it, kind) => writeFileSync(join(outDir, `${it.label}-${kind}.png`), await page.locator(`#card-${it.id.replace(/_/g, '-')} .plate-fit`).screenshot({ type: 'png' }));
for (const it of items) await shot(it, 'silent-black');
for (const it of items) { const b = `#${it.id.replace(/_/g, '-')}-mistake`; if (await page.locator(b).count()) { await page.click(b); await shot(it, 'mistake'); await page.click(b); } }
await page.click('#theme-paper');
for (const it of items) await shot(it, 'paper');
await browser.close();
console.log(`spike render: ${items.map(i => i.label).join(', ')} -> ${outDir}`);
