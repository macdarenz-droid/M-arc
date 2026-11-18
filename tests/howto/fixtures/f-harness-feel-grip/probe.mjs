// F-HARNESS-FEEL-GRIP browser probe, a self-asserting evidence script (the tests/gate form; the unit jobs install no browser):
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tests/howto/fixtures/f-harness-feel-grip/probe.mjs [a6|a5]
// With no mode it runs both and exits 1 on any mismatch with the expected results below.
// `node probe.mjs a6`: goldenB.mjs's selfCheck on golden B's own page (lateral-raise, Silent Black), with the card's feel
//   bands as drawn (a primary map) and with them removed (a map with no primary), plus the H2 mutations.
// `node probe.mjs a5`: ht9.mjs openAllNoRows (and openAll) on a minimal sheet page, plus the H5 mutations.
// Prints one JSON object on stdout.
import { createRequire } from 'node:module';
import { rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const { chromium } = createRequire(import.meta.url)('playwright');
const ROOT = process.cwd(), imp = p => import(pathToFileURL(join(ROOT, p)).href);
const ID = 'lateral-raise', msg = e => String(e?.message ?? e).split('\n')[0];

async function a6() {
  const gb = await imp('tools/plates/fidelity/goldenB.mjs');
  const { dir, file } = await gb.buildScratchPage();
  const out = {};
  try {
    const run = async (name, prep, opts) => {
      const { browser, page, errs } = await gb.openPage(file, 'silent-black', { chromePath: process.env.MARC_CHROMIUM });
      try {
        await page.evaluate(prep.toString() === 'null' ? () => {} : prep, `#card-${ID}`);
        out[name] = { bad: await gb.selfCheck(page, ID, opts).catch(e => [`threw: ${msg(e)}`]), errs };
      } finally { await browser.close(); }
    };
    const noBands = c => document.querySelectorAll(`${c} .feel-band`).forEach(b => b.remove());
    // a map with no primary: no band drawn; the "feel tapped" state must equal rest
    await run('noPrimary', noBands, { primary: false });
    // today's rule on the same map (primary: true): the playing state finds no band
    await run('noBandPrimaryDefault', noBands, {});
    // m3/m4: bands drawn on a card held to no primary
    await run('bandsWithPrimaryFalse', () => {}, { primary: false });
    // the tap draws something (an is-playing outline): the tapped capture differs from rest
    await run('tapDraws', c => {
      document.querySelectorAll(`${c} .feel-band`).forEach(b => b.remove());
      const s = document.createElement('style'); s.textContent = '[data-feel-map].is-playing { outline: 6px solid #f0f; }'; document.head.append(s);
    }, { primary: false });
    // the default (a primary map as drawn) stays clean
    await run('primaryDefault', () => {}, {});
  } finally { rmSync(dir, { recursive: true, force: true }); }
  return out;
}

const SHEET = (feel, rows = 0) => `<!doctype html><html><body style="margin:0">
<dialog class="sheet ht" open><div class="sheet-panel" style="height:200px;overflow:auto"><div class="sheet-top">x</div>
<section class="setup"><details><summary>s</summary>a</details></section><section class="risks"><button aria-expanded="false" onclick="this.setAttribute('aria-expanded','true')">r</button></section>
<section class="feel">${feel ? '<div data-feel-map></div>' : ''}${[...Array(rows)].map((_, i) => `<div class="fr" data-row="r${i}"><button class="fr-btn" aria-expanded="false" onclick="this.setAttribute('aria-expanded','true')">r${i}</button></div>`).join('')}</section>
<div style="height:1200px"></div></div></dialog></body></html>`;

async function a5() {
  const t9 = await imp('tools/plates/library/fidelity/twins/ht9.mjs');
  const browser = await chromium.launch({ executablePath: process.env.MARC_CHROMIUM || undefined });
  const out = {};
  try {
    const page = await browser.newPage();
    const run = async (name, html, fn) => { await page.setContent(html); out[name] = await page.evaluate(fn).then(() => 'ok', e => msg(e)); };
    await run('noRows', SHEET(true), t9.openAllNoRows);
    await run('noRowsWithRow', SHEET(true, 1), t9.openAllNoRows);          // m7: a row shown on a zero-row sheet
    await run('noRowsNoMap', SHEET(false), t9.openAllNoRows);             // the map never mounts
    await run('openAllNoRows', SHEET(true), t9.openAll);                  // today's mutate on a zero-row sheet
    await run('openAllRows', SHEET(true, 2), t9.openAll);                 // openAll on a sheet with rows still passes
    out.mutateOf = { rows0: t9.a5MutateOf({ rows: [] }) === t9.openAllNoRows, rows2: t9.a5MutateOf({ rows: ['a', 'b'] }) === t9.openAll };
  } finally { await browser.close(); }
  return out;
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const clean = { bad: [], errs: [] };
/** The expected results (H2, H5): each returns a problem string or null. */
const EXPECT = {
  a6: r => [
    !same(r.noPrimary, clean) && `no band + primary false is not clean: ${JSON.stringify(r.noPrimary)}`,
    !same(r.primaryDefault, clean) && `a primary map with the defaults is not clean: ${JSON.stringify(r.primaryDefault)}`,
    !same(r.noBandPrimaryDefault.bad, ['threw: lateral-raise: feel-band animation not found to pause deterministically']) && `today's rule changed: ${JSON.stringify(r.noBandPrimaryDefault)}`,
    !/\.feel-band drawn on a map ruled with no primary/.test(r.bandsWithPrimaryFalse.bad.join(' ')) && `m3/m4 not red: ${JSON.stringify(r.bandsWithPrimaryFalse)}`,
    !same(r.tapDraws.bad, ['lateral-raise: feel tapped (no primary): capture differs from "feel" at rest (the tap drew something)']) && `a drawing tap not red: ${JSON.stringify(r.tapDraws)}`,
  ],
  a5: r => [
    r.noRows !== 'ok' && `a zero-row sheet fails: ${r.noRows}`,
    !/a feel row shows on a sheet whose source has none/.test(r.noRowsWithRow) && `m7 not red: ${r.noRowsWithRow}`,
    !/the feel section never mounted/.test(r.noRowsNoMap) && `no map not red: ${r.noRowsNoMap}`,
    !/the feel section never mounted/.test(r.openAllNoRows) && `openAll on a zero-row sheet changed: ${r.openAllNoRows}`,
    r.openAllRows !== 'ok' && `openAll on a sheet with rows fails: ${r.openAllRows}`,
    !same(r.mutateOf, { rows0: true, rows2: true }) && `a5MutateOf: ${JSON.stringify(r.mutateOf)}`,
  ],
};
const modes = process.argv[2] ? [process.argv[2]] : ['a6', 'a5'];
let bad = 0;
for (const m of modes) {
  if (!EXPECT[m]) throw new Error(`unknown mode ${m}`);
  const r = m === 'a6' ? await a6() : await a5();
  const p = EXPECT[m](r).filter(Boolean);
  console.log(`${m}: ${p.length ? 'FAIL' : 'PASS'} ${JSON.stringify(r)}`);
  for (const x of p) console.log(`  ${x}`);
  bad += p.length;
}
process.exit(bad ? 1 : 0);
