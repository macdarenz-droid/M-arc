// LIB-SHIP W3 (supervisor #384 6647873082, item 1): the browser-level red for D-SHIP-A2FEEL (#379 6640877874).
// A page that models the app's feel-map hold observer (useFeelMap.ts, FEEL_JS condition 6: the sweep pauses while the map
// is off-screen) runs a script that ends with the map off-screen, wrapped two ways, and then the real settleApp
// (tools/plates/fidelity/harness.mjs):
//   - the real a2Mutate (tools/plates/library/fidelity.mjs): the map is scrolled back, the sweep ends, settleApp resolves;
//   - the old wrapper (the script alone, the scroll removed): the sweep stays paused and settleApp times out.
// Exit 0 only when both hold. Mutation proof: a2Mutate without its scrollIntoView makes the first case time out (exit 1).
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tests/gate/a2feel.mjs
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const { settleApp } = await import(pathToFileURL(join(ROOT, 'tools/plates/fidelity/harness.mjs')).href);
const { a2Mutate } = await import(pathToFileURL(join(ROOT, 'tools/plates/library/fidelity.mjs')).href);

// The map sits at the top of a tall sheet; its sweep (a finite Web Animation) plays only while the map is in view.
const PAGE = `<!doctype html><html><body style="margin:0">
<dialog class="sheet ht" open style="position:static;margin:0;padding:0;border:0">
  <div class="feel-map" style="height:120px;background:#ccc"></div>
  <div id="below" style="height:4000px"></div>
</dialog>
<script>
  const map = document.querySelector('.feel-map');
  const sweep = map.animate([{ opacity: 0.2 }, { opacity: 1 }], { duration: 1200, fill: 'none' });
  new IntersectionObserver(([e]) => (e.isIntersecting ? sweep.play() : sweep.pause())).observe(map);
</script></body></html>`;
// HT-10's script stand-in: it ends with the feel map scrolled off-screen
const SCRIPT = "async pre => { document.querySelector('#below').scrollIntoView({ block: 'end' }); await new Promise(r => setTimeout(r, 200)); }";
const OLD = src => new Function('pre', `return (${src})(pre).then(() => {})`); // eslint-disable-line no-new-func

const browser = await chromium.launch({ executablePath: process.env.MARC_CHROMIUM || undefined });
const run = async wrap => {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await page.setContent(PAGE);
  await page.evaluate(`(${wrap(SCRIPT).toString()})('pre')`);
  try { await settleApp(page); return 'settled'; } catch (e) { return /Timeout/i.test(e.message) ? 'timeout' : `error: ${e.message.split('\n')[0]}`; }
  finally { await page.context().close(); }
};
const fixed = await run(a2Mutate), old = await run(OLD);
await browser.close();
console.log(`a2Mutate: ${fixed}; scroll removed: ${old}`);
process.exit(fixed === 'settled' && old === 'timeout' ? 0 : 1);
