// LIB-7b D-LIB7b-SCRATCH2 P5 probe (never run in CI): goldenB.mjs zoomSel on golden B's page (the 8 keep today's ids) and
// on a page with pair rows (the first copy's hp- id, the repeat's namespaced id), plus its mutations, each red:
// a second .zx[data-zoom="hand"] in one card; a wrong id on a row with no pair key.
//   node tests/library/fixtures/lib7b/zoomsel-probe.mjs <browser> <pair page.html> <pairChromeId,…>
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openPage, zoomSel } from '../../../../tools/plates/fidelity/goldenB.mjs';

const [exe, pairPage, ids] = process.argv.slice(2), bad = [];
const GOLDEN = 'tests/howto/golden/howto-layers.html', EIGHT = ['lateral-raise', 'barbell-back-squat', 'pull-up', 'hanging-leg-raise', 'lat-pulldown', 'seated-cable-row', 'leg-press', 'machine-chest-press'];
const run = async (file, f) => { const o = await openPage(file, null, { chromePath: exe }); try { return await f(o.page); } finally { await o.browser.close(); } };
const sel = (page, id, key) => zoomSel(page, id, key).then(s => s, e => `THROWS ${e.message}`);

await run(GOLDEN, async page => {
  for (const id of EIGHT) {
    const keys = await page.evaluate(c => [...document.querySelectorAll(`${c} .zx-chip[data-zoom]`)].map(b => b.dataset.zoom), `#card-${id}`);
    for (const k of keys) { const s = await sel(page, id, k); console.log(`golden B ${id} ${k}: ${s}`); if (s !== `#${id}-zoom-${k}`) bad.push(`${id} ${k}: ${s}`); }
  }
});
await run(pairPage, async page => {
  for (const id of ids.split(',')) { const s = await sel(page, id, 'hand'); console.log(`pair page ${id} hand: ${s}`); if (!/^#([a-z0-9-]+-)?hp-[a-z0-9-]+-zoom-hand$/.test(s)) bad.push(`${id}: ${s}`); }
});
// mutations
const g = readFileSync(GOLDEN, 'utf8'), at = g.indexOf('<div class="zx" id="pull-up-zoom-hand"');
const T = mkdtempSync(join(tmpdir(), 'lib7b-zoomsel-')), twice = join(T, 'twice.html'), wrong = join(T, 'wrong.html');
writeFileSync(twice, g.slice(0, at) + '<div class="zx" id="pull-up-zz" data-zoom="hand" hidden></div>' + g.slice(at));
writeFileSync(wrong, g.replace('<div class="zx" id="pull-up-zoom-hand"', '<div class="zx" id="pull-up-zoom-hand-x"'));
for (const [name, f] of [['a second .zx[data-zoom="hand"] in one card', twice], ['a wrong id on a row with no pair key', wrong]]) {
  const s = await run(f, page => sel(page, 'pull-up', 'hand'));
  console.log(`mutation (${name}): ${s}`);
  if (!s.startsWith('THROWS')) bad.push(`mutation not red: ${name}`);
}
console.log(bad.length ? `FAIL\n${bad.join('\n')}` : 'PASS');
process.exit(bad.length ? 1 : 0);
