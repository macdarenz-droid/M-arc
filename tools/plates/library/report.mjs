// LIB-8 quality report: the engine's own report (engine/render.mjs, SPEC 6) for library specs, plus the flag measures.
// For each spec it renders the three sheets render.mjs renders (Silent Black normal, Paper normal, Silent Black
// Mistake) at 390 px, device scale 2, in a mirror of the vendored engine, and applies render.mjs's browser checks
// unchanged: label boxes 8 px inside the plate, no overlap, nothing drawn under a label, no key joint under a label,
// font loaded, no horizontal scroll, the sheet fits. `ok` = every browser and engine list empty.
//   node tools/plates/library/report.mjs <spec.mjs|golden:<id>> ... [--shots DIR]   prints JSON
import { createRequire } from 'node:module';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ROOT, makeMirror, verifyVendor } from '../golden.mjs';

const overlap = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
const pathLen = d => {   // leader paths are M/L polylines
  const ps = [...d.matchAll(/[ML]\s*(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1], +m[2]]);
  let L = 0; for (let i = 1; i < ps.length; i++) L += Math.hypot(ps[i][0] - ps[i - 1][0], ps[i][1] - ps[i - 1][1]);
  return L;
};

/** Flag measures of one normal render (plan 3.3): F1 scale, F2 ink coverage, F3 longest leader, F4 hand-boxed labels. */
export function measures(spec, plate) {
  const occ = plate.occ, cells = occ.g.reduce((a, v) => a + v, 0);
  const leaders = [...plate.svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)].map(m => pathLen(m[1]));
  const boxed = [...(spec.callouts ?? []), ...(spec.mistake?.tells ?? [])].filter(c => c.box).length + (spec.measure?.box ? 1 : 0);
  return { pxPerM: plate.report.camera.pxPerM, coverage: +(cells / occ.g.length).toFixed(3), longestLeader: +Math.max(0, ...leaders).toFixed(1), boxed };
}

/** Load a spec: a library spec path, or 'golden:<id>' for one of the 7 engine-drawn approved plates. */
const loadSpec = async (ref, mirror) => ref.startsWith('golden:')
  ? (await import(pathToFileURL(join(mirror, 'exercises', `${ref.slice(7)}.mjs`)).href)).default
  : (await import(`${pathToFileURL(resolve(ref)).href}?t=${Date.now()}`)).default;

/** Report every spec; shotsDir (optional) receives <id>-dark.png, <id>-paper.png, <id>-mistake-dark.png. */
export async function reportPlates(refs, { shotsDir = null, selected = {} } = {}) {
  const bad = verifyVendor();
  if (bad.length) throw new Error(`vendored engine is not the golden lock:\n${bad.join('\n')}`);
  const mirror = makeMirror(), tmp = mkdtempSync(join(tmpdir(), 'lib-report-'));
  const { sheetPage, SIZE } = await import(pathToFileURL(join(mirror, 'engine/index.mjs')).href);
  const { chromium } = createRequire(join(ROOT, 'package.json'))('playwright');
  const browser = await chromium.launch({ executablePath: process.env.MARC_CHROMIUM ?? '/opt/pw-browsers/chromium' });
  if (shotsDir) mkdirSync(shotsDir, { recursive: true });
  const results = [];
  try {
    for (const ref of refs) {
      const spec = await loadSpec(ref, mirror), id = spec.id;
      const sel = selected[id] ?? {};
      const c0 = spec.callouts?.[0]?.key ?? null, c1 = spec.callouts?.[1]?.key ?? c0, t0 = spec.mistake?.tells?.[0]?.key ?? null;
      const jobs = [
        { name: `${id}-dark`, theme: 'silent-black', scheme: 'dark', mistake: false, selected: sel.dark ?? c0 },
        { name: `${id}-paper`, theme: 'paper', scheme: 'light', mistake: false, selected: sel.paper ?? c1 },
        { name: `${id}-mistake-dark`, theme: 'silent-black', scheme: 'dark', mistake: true, selected: sel.mistake ?? t0 },
      ];
      const result = { id, ref, renders: [] };
      for (const j of jobs) {
        if (j.mistake && !spec.mistake) { result.renders.push({ name: j.name, browserIssues: ['no-mistake'], engineIssues: [] }); continue; }
        const { html, plate } = sheetPage(spec, { theme: j.theme, mistake: j.mistake, selected: j.selected, id: j.mistake ? 'm' : 'p' });
        const file = join(tmp, `${j.name}.html`);
        writeFileSync(file, html);
        const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: j.scheme });
        const page = await ctx.newPage();
        await page.goto(pathToFileURL(file).href);
        await page.evaluate(() => document.fonts.ready);
        const ph = await page.evaluate(() => document.querySelector('.sheet-panel').getBoundingClientRect().height);
        await page.evaluate(h => { document.body.style.height = h + 'px'; }, Math.ceil(ph + 96));
        await page.setViewportSize({ width: 390, height: Math.ceil(ph + 96) });
        const m = await page.evaluate(() => {
          const pl = document.querySelector('.plate'), pb = pl.getBoundingClientRect(), k = 358 / pb.width;
          const labels = [...pl.querySelectorAll('.plate-callout, .plate-arc-label, .plate-meta')].map(el => {
            const rg = document.createRange(); rg.selectNodeContents(el); const b = rg.getBoundingClientRect();
            return { t: el.textContent, b: { x0: (b.left - pb.left) * k, y0: (b.top - pb.top) * k, x1: (b.right - pb.left) * k, y1: (b.bottom - pb.top) * k } };
          });
          const panel = document.querySelector('.sheet-panel');
          return { font: document.fonts.check('15px "Inter Variable"'), wide: document.documentElement.scrollWidth, panelFits: panel.scrollHeight <= panel.clientHeight, labels };
        });
        const issues = [];
        m.labels.forEach((a, i) => {
          if (a.b.x0 < 8 || a.b.y0 < 8 || a.b.x1 > SIZE - 8 || a.b.y1 > SIZE - 8) issues.push(`edge:${a.t}`);
          m.labels.slice(i + 1).forEach(c => { if (overlap(a.b, c.b)) issues.push(`overlap:${a.t}|${c.t}`); });
          if (!a.t.match(/view$/i)) { const hit = plate.occ.count(a.b.x0, a.b.y0, a.b.x1, a.b.y1); if (hit) issues.push(`figure:${a.t}:${hit}cells`); }
          for (const jn of plate.report.keyJoints) if (jn.p[0] > a.b.x0 - 3 && jn.p[0] < a.b.x1 + 3 && jn.p[1] > a.b.y0 - 3 && jn.p[1] < a.b.y1 + 3) issues.push(`joint:${a.t}|${jn.k}`);
        });
        if (!m.font) issues.push('font-not-loaded');
        if (m.wide > 390) issues.push(`horizontal-scroll:${m.wide}`);
        if (!m.panelFits) issues.push('sheet-overflows');
        if (shotsDir) await page.screenshot({ path: join(shotsDir, `${j.name}.png`) });
        await ctx.close();
        const rep = plate.report;
        result.renders.push({ name: j.name, theme: j.theme, mistake: j.mistake, selected: j.selected, browserIssues: issues, engineIssues: rep.issues });
        if (!j.mistake && !result.measures) Object.assign(result, { measures: measures(spec, plate), camera: rep.camera, measure: rep.measure, contacts: rep.contacts, checks: rep.checks, angles: rep.angles });
        if (j.mistake) Object.assign(result, { mistakeContacts: rep.contacts.mistake ?? [], mistakeAngles: rep.angles.mistake ?? null });
      }
      result.ok = result.renders.every(r => !r.browserIssues.length && !r.engineIssues.length);
      results.push(result);
    }
  } finally {
    await browser.close();
    rmSync(mirror, { recursive: true, force: true });
    rmSync(tmp, { recursive: true, force: true });
  }
  return results;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), i = args.indexOf('--shots');
  const shotsDir = i >= 0 ? resolve(args[i + 1]) : null;
  const refs = args.filter((a, k) => !a.startsWith('--') && k !== i + 1);
  const out = await reportPlates(refs, { shotsDir });
  console.log(JSON.stringify(out, null, 1));
  process.exitCode = out.every(r => r.ok) ? 0 : 1;
}
