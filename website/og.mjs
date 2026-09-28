// Renders website/og.html to website/public/og.png (1200x630) with the Chromium Playwright already uses for the app's gate.
// Run from the repo root: node website/og.mjs
import { chromium } from 'playwright';
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const here = fileURLToPath(new URL('.', import.meta.url));
const src = resolve(here, 'og.html');
const out = resolve(here, 'public/og.png');
const LIMIT = 300 * 1024;

const browser = await chromium.launch({ executablePath: process.env.MARC_CHROMIUM || '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto('file://' + src);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
} finally {
  await browser.close();
}
const size = statSync(out).size;
if (size > LIMIT) {
  console.error(`og.png is ${size} bytes, over the ${LIMIT} byte limit`);
  process.exit(1);
}
console.log(`og.png ${size} bytes`);
