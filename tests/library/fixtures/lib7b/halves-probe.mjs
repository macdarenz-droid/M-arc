// LIB-7b D-LIB7b-HALVES probe (condition 3; never run in CI): every LIB-7 pair panel with golden B's splitHalves vs the
// same panel with exactly what splitHalves adds removed, each page of each key in each of the 5 themes, on hands/page.mjs's
// approved sheet page plus the pair scope's CSS. Byte-equal PNGs are required (LIB-7's critic-approved drawings unchanged).
//   node tests/library/fixtures/lib7b/halves-probe.mjs <browser>
import { chromium } from 'playwright';
import { pairPanel, keysOf } from '../../../../tools/plates/library/hands/pairs.mjs';
import { CSS, THEME_IDS, pageHtml } from '../../../../tools/plates/library/hands/page.mjs';
import { pairCss } from '../../../../tools/plates/library/build-layers-page.mjs';
import { unsplit } from './unsplit.mjs';

const b = await chromium.launch({ executablePath: process.argv[2] });
let n = 0, bad = 0;
for (const k of keysOf()) {
  const split = await pairPanel(k), plain = unsplit(split), css = CSS + pairCss(k);
  if (plain === split) throw new Error(`${k}: no halves to remove`);
  for (const theme of THEME_IDS) {
    const shot = async h => {
      const p = await b.newPage({ viewport: { width: 420, height: 900 } });
      await p.setContent(pageHtml(h.replace(' hidden>', '>'), theme, { css }));
      await p.evaluate(() => document.fonts.ready);
      const out = [], pages = await p.locator('.zx-page').count();
      for (let i = 0; i < pages; i++) { await p.evaluate(i => document.querySelectorAll('.zx-page').forEach((x, j) => { x.hidden = j !== i; }), i); out.push(await p.locator('.zx').screenshot()); }
      await p.close(); return out;
    };
    const [x, y] = [await shot(plain), await shot(split)];
    x.forEach((s, i) => { n++; if (!s.equals(y[i])) { bad++; console.log(`DIFFERS ${k} ${theme} page ${i}`); } });
  }
}
console.log(`${b.version()}: ${n} shots, ${bad} differ: ${bad ? 'FAIL' : 'PASS'}`);
await b.close();
process.exit(bad ? 1 : 0);
