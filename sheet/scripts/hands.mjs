// scratch: render a drawn id's hand pages (every fault) at 390 px, Silent Black and Paper, like hands/sheet.mjs
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const [root, out, ...ids] = process.argv.slice(2);
const { pairSpec, renderPair, ROOT } = await import(pathToFileURL(join(root, 'tools/plates/library/hands/pairs.mjs')).href);
const { pageHtml } = await import(pathToFileURL(join(root, 'tools/plates/library/hands/page.mjs')).href);
mkdirSync(out, { recursive: true });
const { chromium } = createRequire(join(ROOT, 'package.json'))('playwright');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const id of ids) {
  const s = pairSpec(id);
  const body = s.wrong.map(F => `<div class="hand-plate">${renderPair(id, { fault: F.key }).svg}</div>`).join('');
  for (const [theme, scheme] of [['silent-black', 'dark'], ['paper', 'light']]) {
    const f = join(out, `${id}-${theme}.html`); writeFileSync(f, pageHtml(body, theme));
    const p = await browser.newPage({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 2, colorScheme: scheme });
    await p.goto(pathToFileURL(f).href); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: join(out, `${id}-${theme}.png`), fullPage: true }); await p.close();
  }
  console.log(id, s.wrong.map(w => w.key).join(','));
}
await browser.close();
