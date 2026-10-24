// Tempo-strip design card (no sourced seconds): builds one plates page through the library page builder's own
// mirror path (golden.mjs makeMirror + build-page.mjs patchedBuilder), plus ONE extra once()-patch that replaces the
// mirror copy's tempoStrip. Golden B / the vendored folder is never edited. Then crops each card (plate to strip) at
// 390 px, 2x, in Silent Black and Paper.
//   node render.mjs <worktree> <outDir>
import { readFileSync, writeFileSync, mkdtempSync, rmSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const [W, OUT] = process.argv.slice(2);
const LIB = join(W, 'tools/plates/library');
const { patchedBuilder, goldenAConfig } = await import(pathToFileURL(join(LIB, 'build-page.mjs')).href);
const { makeMirror, VENDOR } = await import(pathToFileURL(join(W, 'tools/plates/golden.mjs')).href);
const { chromium } = await import(pathToFileURL(join(W, 'node_modules/playwright/index.mjs')).href);

const once = (src, find, repl) => {
  const i = src.indexOf(find);
  if (i < 0 || src.indexOf(find, i + 1) >= 0) throw new Error(`"${find.slice(0, 60)}" must occur exactly once`);
  return src.slice(0, i) + repl + src.slice(i + find.length);
};
const between = (src, start, end) => { const i = src.indexOf(start); return src.slice(i, src.indexOf(end, i) + end.length); };

// ---- THE PATCH (the same for A, B and C; the options differ only in the tempo-map rows) ----
// A phase with no sourced seconds has no `s`. Timed cards keep the vendored output byte for byte.
import { NOSECS_STRIP } from './nosecs-strip.mjs';
const patched = src => once(src, between(src, 'const tempoStrip = tempo => {', '\n};\n'), NOSECS_STRIP);

function build(cfg, text, extra = {}) {
  const mirror = makeMirror(), dir = mkdtempSync(join(tmpdir(), 'tempo-nosecs-'));
  try {
    for (const [id, body] of Object.entries(extra)) writeFileSync(join(mirror, 'exercises', `${id}.mjs`), body);
    const file = join(mirror, 'artifact', 'library-page.mjs');
    writeFileSync(file, text);
    const out = join(dir, 'page.html');
    const r = spawnSync(process.execPath, [file], { cwd: join(mirror, 'artifact'), env: { ...process.env, LIB_PAGE_CFG: JSON.stringify({ ...cfg, out }) }, encoding: 'utf8' });
    if (r.status !== 0) throw new Error(r.stderr.slice(0, 3000));
    return readFileSync(out);
  } finally { rmSync(mirror, { recursive: true, force: true }); rmSync(dir, { recursive: true, force: true }); }
}

// 1. Proof: with the patch, the golden A config still rebuilds e2bea90c… byte for byte.
const gA = await goldenAConfig();
const gAbytes = build({ groups: gA.groups, sources: gA.sources, specUrl: {}, heading: gA.heading }, patched(patchedBuilder()));
const gAsha = createHash('sha256').update(gAbytes).digest('hex');
console.log('golden A with the patch:', gAsha, gAbytes.length, 'B');

// 2. The comparison page.
mkdirSync(join(OUT, 'specs'), { recursive: true });
const SQUAT = join(VENDOR, 'exercises/barbell_back_squat.mjs'), BOX = join(LIB, 'specs/box_jump.mjs'), PLANK = join(LIB, 'specs/plank.mjs');
// Tempo-map rows per option (research cards on claude/libht-research-lb4 083a8e12):
//  front_squat plate.tempo c21: "Controlled descent, drive up" -> phases Lower, Drive up (the approved back squat's names);
//  box_jump plate.tempo c11: "Explosive take-off; step down" -> phases Take-off, Step down; c11 quotes "3-5 repetitions", "3-5 reps per set".
const ROWS = {
  front_squat: {
    A: [{ phase: 'Lower', move: true }, { phase: 'Drive up', move: true }],
    B: [{ phase: 'Lower', move: true, word: 'Controlled' }, { phase: 'Drive up', move: true }],
    C: [{ phase: 'Lower', move: true }, { phase: 'Drive up', move: true }],   // no sourced reps or hold: falls back to A
  },
  box_jump: {
    A: [{ phase: 'Take-off', move: true }, { phase: 'Step down', move: true }],
    B: [{ phase: 'Take-off', move: true, word: 'Explosive' }, { phase: 'Step down', move: true }],
    C: [{ phase: 'Reps', word: '3–5' }],
  },
};
// Vendored specs load from the mirror's own exercises/ (they import the mirror engine); library specs by URL.
const specs = { ref_plank: PLANK }, extra = { ref_back_squat: "export { default } from './barbell_back_squat.mjs';\n" };
for (const [id, base] of [['front_squat', null], ['box_jump', BOX]]) for (const k of 'ABC') {
  const key = `${id}_${k.toLowerCase()}`, from = base ? JSON.stringify(pathToFileURL(base).href) : "'./barbell_back_squat.mjs'";
  const body = `import base from ${from};\nexport default { ...base, tempo: ${JSON.stringify(ROWS[id][k])} };\n`;
  if (base) { const f = join(OUT, 'specs', `${key}.mjs`); writeFileSync(f, body); specs[key] = f; } else extra[key] = body;
}
const ids = ['ref_back_squat', 'ref_plank', ...['front_squat', 'box_jump'].flatMap(id => 'abc'.split('').map(k => `${id}_${k}`))];
const cfg = {
  groups: [{ id: 'g', title: 'Tempo', ids }],
  sources: Object.fromEntries(ids.map(id => [id, ['design card']])),
  specUrl: Object.fromEntries(Object.entries(specs).map(([id, p]) => [id, pathToFileURL(p).href])),
  heading: (await import(pathToFileURL(join(LIB, 'build-page.mjs')).href)).GOLDEN_A_HEADING,
};
const html = build(cfg, patched(patchedBuilder()), extra);
const page = join(OUT, 'page.html');
writeFileSync(page, html);
for (const id of ids) {
  const m = html.toString().match(new RegExp(`<article class="sheet-card" id="card-${id.replace(/_/g, '-')}"[\\s\\S]*?(<div class="tempo" role="img"[^\\n]*)\\n</article>`));
  console.log(id.padEnd(16), m[1].match(/aria-label="([^"]*)"/)[1], '| H2 regex:', /^<div class="tempo" role="img" aria-label="Tempo: [^"]+">/.test(m[1]));
}

// 3. Crops at 390 px, 2x: plate top to strip bottom, in Silent Black and Paper.
const browser = await chromium.launch({ executablePath: process.env.MARC_CHROMIUM ?? '/opt/pw-browsers/chromium' });
const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 2, colorScheme: 'dark' });
const p = await ctx.newPage();
await p.goto(pathToFileURL(page).href);
await p.evaluate(() => document.fonts.ready);
for (const theme of ['silent-black', 'paper']) {
  await p.click(`#theme-${theme}`);
  await p.waitForTimeout(150);
  for (const id of ids) {
    const cid = id.replace(/_/g, '-');
    const box = await p.evaluate(c => {
      const card = document.getElementById(`card-${c}`), fit = card.querySelector('.plate-fit'), t = card.querySelector('.tempo');
      card.scrollIntoView();
      const a = card.getBoundingClientRect(), f = fit.getBoundingClientRect(), s = t.getBoundingClientRect();
      const over = [...t.querySelectorAll('.tempo-label')].filter(l => { const r = l.getBoundingClientRect(); return r.left < s.left - 0.5 || r.right > s.right + 0.5; }).length;
      return { x: a.left + scrollX, y: f.top + scrollY - 4, w: a.width, h: s.bottom - f.top + 16, stripH: s.height, scroll: t.scrollWidth, client: t.clientWidth, over };
    }, cid);
    if (box.scroll > box.client || box.over) console.log('H4 overflow', id, theme, box);
    await p.screenshot({ path: join(OUT, 'crops', `${id}--${theme}.png`), clip: { x: box.x, y: box.y, width: box.w, height: box.h }, fullPage: true });
    console.log(theme, id, 'strip height', box.stripH, 'crop', Math.round(box.w), 'x', Math.round(box.h));
  }
}
await browser.close();
