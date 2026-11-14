// F-HAND-PALMFLAT-SIZE C2 box probe (Q-PFS-2, run by hand; output posted on #424): the scratch mountain_climbers sub-key
// panel (pairNote "Under shoulder", c2; Q-PFS-4) in each of the 5 themes, on hands/page.mjs's sheet page plus the pair scope's
// CSS. Each drawn note (.h-note) must end inside its half, 4 px clear of its edge (leg_press.howto-render.mjs:384's bound:
// 171 - 4 for Right, 358 - 4 for Wrong), in svg units. --m7 draws a 40-character note instead, which must be red.
//   node tests/howto/fixtures/f-hand-palmflat-size/note-box.mjs <browser> [--m7] [--png <dir>]
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { pairPanel, subKeysOf, INDEX } from '../../../../tools/plates/library/hands/pairs.mjs';
import { CSS, THEME_IDS, pageHtml } from '../../../../tools/plates/library/hands/page.mjs';
import { pairCss } from '../../../../tools/plates/library/build-layers-page.mjs';

const args = process.argv.slice(2), m7 = args.includes('--m7'), png = args.includes('--png') ? args[args.indexOf('--png') + 1] : null;
const CARD = 'docs/research/howto/cards/mountain_climbers.json';
const text = m7 ? 'Hand set right under the shoulder joint!' : 'Under shoulder';
if (m7 && text.length !== 40) throw new Error('m7 note is not 40 characters');
const row = { pair: 'palm-flat-floor-over', pairFaults: ['hand-ahead'], pairNote: { right: { text, source: `${CARD}#c2` } },
  pairWords: { 'hand-ahead': { right: { text: 'Hand directly under the shoulder', source: `${CARD}#c2, zooms[hand-under-shoulder].right` } } } };
const sub = 'palm-flat-floor-only-hand-ahead-over', subs = subKeysOf([{ file: 'scratch.layers.json', closeups: { lib_mountain_climbers: row } }]).subs;
const panel = await pairPanel(sub, INDEX, subs), css = CSS + pairCss(sub);
console.log(`panel sha256 ${createHash('sha256').update(panel).digest('hex')}${m7 ? ' (m7)' : ''}`);
const b = await chromium.launch({ executablePath: args[0] });
let bad = 0;
for (const theme of THEME_IDS) {
  const p = await b.newPage({ viewport: { width: 420, height: 900 }, deviceScaleFactor: png ? 2 : 1 });
  await p.setContent(pageHtml(panel.replace(' hidden>', '>'), theme, { css }));
  await p.evaluate(() => document.fonts.ready);
  const notes = await p.evaluate(() => [...document.querySelectorAll('.h-note')].map(t => {
    const bb = t.getBBox(), limit = (+t.getAttribute('x') > 179 ? 358 : 171) - 4;
    return { t: t.textContent, left: +bb.x.toFixed(1), right: +(bb.x + bb.width).toFixed(1), limit };
  }));
  if (notes.length !== 2) { bad++; console.log(`${theme}: ${notes.length} notes, expected 2`); }
  for (const n of notes) { const ok = n.right <= n.limit; if (!ok) bad++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${theme} ${n.t}: x ${n.left}..${n.right} <= ${n.limit}`); }
  if (png) { mkdirSync(png, { recursive: true }); const f = join(png, `${theme}.png`); writeFileSync(f, await p.locator('.zx').screenshot()); }
  await p.close();
}
console.log(`${b.version()}: ${bad ? 'FAIL' : 'PASS'}`);
await b.close();
process.exit(bad ? 1 : 0);
