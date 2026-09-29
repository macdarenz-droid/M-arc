// V1-05: `npm run fg:render <id | path/to/file.ts> [--debug]` and `npm run fg:render -- --sheet` render one
// exercise's picture set to renders/<id>/ (docs/FORM-GUIDE-PRODUCTION.md §10.5). Like fg-check.mjs, this first
// bundles src/formguide/check/render.ts to node_modules/.cache/fg-render.mjs (esbuild, as package.json's "logo" and
// "fg:check" do), then the exercise file itself the same way, then imports both: render.ts builds every picture as a
// standalone, fully token-resolved SVG string (pure, no DOM); this script's only job is to turn each one into a PNG
// with the local Chromium (MARC_CHROMIUM=/opt/pw-browsers/chromium), at 360 and 390 px in all 5 themes. The rig is
// resolved before Chromium ever launches, so an id with no rig (A3) exits 1 without needing a browser at all.
import { build } from 'esbuild';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const debug = args.includes('--debug');
const sheet = args.includes('--sheet');
const outIdx = args.indexOf('--out');
const outOverride = outIdx >= 0 ? args[outIdx + 1] : null;
const rest = args.filter((a, i) => !a.startsWith('--') && (outIdx < 0 || i !== outIdx + 1));
const [arg] = rest;
if (!arg && !sheet) { console.error('usage: npm run fg:render <exercise id | path to an exercise file> [--debug] [--out dir]\n       npm run fg:render -- --sheet [--out dir]'); process.exit(2); }

const RENDER_OUT = resolve('node_modules/.cache/fg-render.mjs');
await build({ entryPoints: ['src/formguide/check/render.ts'], bundle: true, format: 'esm', platform: 'node', outfile: RENDER_OUT, logLevel: 'warning' });
const lib = await import(`${pathToFileURL(RENDER_OUT).href}?t=${Date.now()}`);

const SHEET_REST = { id: 'lib__sheet', kind: 'hold', order: 'lift_first', camera: { full: 'standingFront', zoom: 'standingFront', subject: 'pelvis' }, pose: 'standing', equipment: { kind: 'none', attach: [], loadFrom: 'bodyweight' }, tempo: { hold: 1 }, movement: { breathe: 'out on lift' }, muscles: { target: [], helps: [], keepQuiet: [], effort: {} }, cues: [], mistake: { name: '', joints: {}, tells: [] }, sources: [] };

/** What each rendered view needs before Chromium ever launches: its jobs and where a bad-rig view stands. */
function plan() {
  if (sheet) {
    return { outDir: resolve(outOverride ?? 'renders/_sheet'), views: ['front', 'side', 'back'].map(view => ({ view, rig: lib.rigFor(SHEET_REST, view) })) };
  }
  const path = resolve(/[\\/]|\.ts$/.test(arg) ? arg : `src/formguide/exercises/${arg}.ts`);
  if (!existsSync(path)) { console.error(`fg:render: no exercise file ${path}`); process.exit(2); }
  return { path };
}

let guide, rig, outDir, sheetPlan;
if (sheet) {
  sheetPlan = plan();
  outDir = sheetPlan.outDir;
} else {
  const { path } = plan();
  const guideOut = resolve('node_modules/.cache/fg-render-guide.mjs');
  await build({ entryPoints: [path], bundle: true, format: 'esm', platform: 'node', outfile: guideOut, logLevel: 'warning' });
  const mod = await import(`${pathToFileURL(guideOut).href}?t=${Date.now()}`);
  guide = lib.guideOf(mod, path);
  rig = lib.rigFor(guide, lib.viewOf(guide, lib.patternOf(guide.id)));
  if (typeof rig === 'string') { console.error(`fg:render ${guide.id}: ${rig}`); process.exit(1); }
  outDir = resolve(outOverride ?? `renders/${guide.id}`);
}
mkdirSync(outDir, { recursive: true });

const { chromium } = await import('playwright');
const browser = await chromium.launch({ ...(process.env.MARC_CHROMIUM ? { executablePath: process.env.MARC_CHROMIUM } : {}), args: ['--no-sandbox'] });
const page = await browser.newPage({ deviceScaleFactor: 1 });
const t0 = Date.now();

/** Screenshots one SVG string at `width` px wide (height follows its own aspect ratio) to `path`. Reused across
 * every (theme, moment) pair on one page: setContent once, screenshot at each width, no reload between them. */
async function shootAll(jobs, theme) {
  for (const job of jobs) {
    await page.setContent(`<!doctype html><html><body style="margin:0;background:${lib.bgOf(theme)}"><div id="fgr-cap">${job.svg}</div><style>#fgr-cap svg{display:block;width:100%;height:auto}</style></body></html>`);
    for (const width of lib.WIDTHS) {
      // each figure slot keeps its own width (a compare or filmstrip composite is `slots` times as wide, never
      // squeezed to fit): the container is sized to slots * width, matching a single moment's own figure width.
      const total = width * job.slots;
      await page.setViewportSize({ width: total, height: Math.max(1, Math.round(total * 2)) });
      await page.locator('#fgr-cap').screenshot({ path: `${outDir}/${job.name}-${theme}-${width}.png` });
    }
  }
}

if (sheet) {
  // --sheet: the front, side and back figure at rest, one per view that has a rig yet (D-FG7, doc:151). A view
  // without a rig (side until V1-06, back until V1-22) writes its reason instead of failing the sheet.
  for (const { view, rig: r } of sheetPlan.views) {
    if (typeof r === 'string') { writeFileSync(`${outDir}/${view}-not-ready.txt`, `${r}\n`); console.log(`sheet ${view}: ${r}`); continue; }
    for (const theme of lib.THEME_IDS) {
      const moment = lib.svgsFor(SHEET_REST, r, theme, { debug }).find(j => j.name === 'moment-0');
      if (moment) await shootAll([{ name: view, svg: moment.svg, slots: 1 }], theme);
    }
  }
} else {
  for (const theme of lib.THEME_IDS) await shootAll(lib.svgsFor(guide, rig, theme, { debug }), theme);
  const tremor = lib.tremorPx(guide, rig, lib.cameraOf(guide, false, false).box, 360);
  writeFileSync(`${outDir}/report.txt`, `fg:render ${guide.id}\nhold tremor at 360px: ${tremor.toFixed(2)} px\nrender time: ${((Date.now() - t0) / 1000).toFixed(1)} s\n`);
  console.log(`fg:render ${guide.id}: hold tremor ${tremor.toFixed(2)} px at 360px, ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}

await browser.close();
