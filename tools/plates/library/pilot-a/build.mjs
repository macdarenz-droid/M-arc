// LIB-8 pilot A: builds the pilot plates page (the bytes that get pinned), the owner's review sheet around the same
// card bytes, and the self-check (engine report per plate, 390 px screenshots in Silent Black and Paper).
//   node tools/plates/library/pilot-a/build.mjs            writes out/ (see OUT below) and prints the summary
// The plates page is built by the library page builder (golden A's chrome, ../build-page.mjs). The sheet adds, per
// plate, its Mistake, a Paper thumbnail, the closest approved plate and every flag, and prints the plates page sha.
// A check extracts every card from both pages (golden.mjs extractPlates) and requires the fragments to be equal.
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildPlatesPage } from '../build-page.mjs';
import { reportPlates } from '../report.mjs';
import { ROOT, FIXTURE, extractPlates, fragmentsOf, sha256 } from '../../golden.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const LIB = join(here, '..');
export const OUT_DIR = join(here, 'out');
const PILOT = JSON.parse(readFileSync(join(here, 'plates.json'), 'utf8')).plates;
const CARDS = join(here, 'cards');   // verified research cards (card v2), copied from claude/libht-research

// Flag envelope (plan 3.3), measured on the 7 engine-drawn approved plates by report.mjs `measures` (the lateral
// raise is hand-drawn, at the reference 146.29 px/m). Re-measured by LIB-3 once it merges (plan 3.5, last bullet).
export const ENVELOPE = { pxPerM: [123.91, 146.29], coverage: [0.1, 0.246], longestLeader: [0, 81.9], boxed: [0, 6] };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const TIER_TITLE = { A: 'Tier A: over the face, spinal load, overhead, explosive', B: 'Tier B', C: 'Tier C' };
const APPROVED_CHROME = { lateral_raise: 'lateral-raise' };

/** Flags F1-F4 from the measures, F6 from the census view, F7 from the plate's `pilot` note; F5 is chrome-identical. */
export function flagsOf(entry, measures, spec) {
  const f = [];
  const out = (k, v) => v < ENVELOPE[k][0] || v > ENVELOPE[k][1];
  if (out('pxPerM', measures.pxPerM)) f.push({ id: 'F1', text: `Scale ${measures.pxPerM} px/m, approved ${ENVELOPE.pxPerM.join('-')}` });
  if (out('coverage', measures.coverage)) f.push({ id: 'F2', text: `Ink coverage ${measures.coverage}, approved ${ENVELOPE.coverage.join('-')}` });
  if (out('longestLeader', measures.longestLeader)) f.push({ id: 'F3', text: `Longest leader ${measures.longestLeader} px, approved up to ${ENVELOPE.longestLeader[1]}` });
  if (out('boxed', measures.boxed)) f.push({ id: 'F4', text: `${measures.boxed} hand-placed labels, approved up to ${ENVELOPE.boxed[1]}` });
  if (spec.view !== entry.view) f.push({ id: 'F6', text: `Drawn in ${spec.view} view; the census says ${entry.view}` });
  if (spec.pilot?.drawableFault) f.push({ id: 'F7', text: `Mistake is not the card's top fault (drawable-fault rule): ${spec.pilot.drawableFault}` });
  return f;
}

const cardOf = id => { const p = join(CARDS, `${id}.json`); return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null; };
const sourceLines = card => card.sources.map(s => `${s.title}${s.year ? ` (${s.year})` : ''}. ${s.url}${s.pmid ? ` PMID ${s.pmid}` : ''}`);

/** Screenshots of cards in a built page: normal, Mistake (after tapping Mistake), Paper (after tapping Paper). */
async function cardShots(browser, file, ids, { mistake = true, paper = true } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 2, colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(file).href);
  await page.evaluate(() => document.fonts.ready);
  const shot = async (id, sel) => (await page.locator(`#card-${id}${sel}`).screenshot({ type: 'png' }));
  const out = {};
  for (const id of ids) out[id] = { dark: await shot(id, ' .plate-fit') };
  if (mistake) for (const id of ids) { await page.click(`#${id}-mistake`); out[id].mistake = await shot(id, ' .plate-fit'); await page.click(`#${id}-mistake`); }
  if (paper) { await page.click('#theme-paper'); for (const id of ids) out[id].paper = await shot(id, ' .plate-fit'); await page.click('#theme-silent-black'); }
  // WebP (lossy, q 0.92) through the browser's own encoder: about a quarter of the PNG bytes for line art
  for (const id of ids) for (const k of Object.keys(out[id])) {
    const url = await page.evaluate(async b64 => { const im = new Image(); im.src = `data:image/png;base64,${b64}`; await im.decode();
      const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; c.getContext('2d').drawImage(im, 0, 0); return c.toDataURL('image/webp', 0.92); }, out[id][k].toString('base64'));
    out[id][k] = url;
  }
  await ctx.close();
  return out;
}
const img = (url, alt, cls) => `<img class="${cls}" alt="${esc(alt)}" src="${url}">`;

const SHEET_CSS = `
:root { --wrap: 390px; }
@media (min-width: 832px) { :root { --wrap: 800px; } }
@media (min-width: 1240px) { :root { --wrap: 1200px; } }
.pilot-row { grid-column: 1 / -1; display: grid; grid-template-columns: minmax(0, 390px); gap: 16px; align-items: start; padding-bottom: 24px; border-bottom: 1px solid var(--border-subtle); }
@media (min-width: 832px) { .pilot-row { grid-template-columns: 390px minmax(0, 1fr); } }
.pilot-aside { display: grid; gap: 12px; min-width: 0; }
.pilot-meta { display: grid; gap: 6px; font-size: var(--fs-small); color: var(--text-2); }
.pilot-meta b { color: var(--text); font-weight: var(--fw-semibold); }
.pilot-flags { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; padding: 0; list-style: none; }
.pilot-flags li { font-size: var(--fs-meta); line-height: var(--lh-meta); padding: 2px 8px; border-radius: var(--radius-pill); border: 1px solid color-mix(in srgb, var(--mistake) 55%, var(--border)); color: var(--text); }
.pilot-flags li.none { border-color: var(--border); color: var(--text-2); }
.pilot-shots { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 230px), 1fr)); gap: 12px; }
.pilot-shots figure { display: grid; gap: 4px; margin: 0; }
.pilot-shots figcaption { font-size: var(--fs-cap); line-height: var(--lh-cap); letter-spacing: var(--ls-cap); text-transform: uppercase; font-weight: var(--fw-semibold); color: var(--text-2); }
.pilot-shots img { width: 100%; height: auto; border-radius: var(--radius-lg); border: 1px solid var(--border); }
.pg-sha { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; overflow-wrap: anywhere; color: var(--pg-text); }
`;

export async function build({ draft = false, list: LIST = PILOT, specPath = id => join(LIB, 'specs', `${id}.mjs`), out: OUT = OUT_DIR } = {}) {
  mkdirSync(OUT, { recursive: true });
  const specs = Object.fromEntries(LIST.map(p => [p.id, specPath(p.id)]));
  const missing = LIST.filter(p => !existsSync(specs[p.id])).map(p => p.id);
  if (missing.length) throw new Error(`no spec yet: ${missing.join(', ')}`);

  // 1. self-check: the engine report per plate (render.mjs checks), screenshots at 390 px in Silent Black and Paper
  const reports = await reportPlates(LIST.map(p => specs[p.id]), { shotsDir: join(OUT, 'shots') });
  const rep = Object.fromEntries(reports.map(r => [r.id, r]));
  const specMods = Object.fromEntries(await Promise.all(LIST.map(async p => [p.id, (await import(pathToFileURL(specs[p.id]).href)).default])));
  const flags = Object.fromEntries(LIST.map(p => [p.id, flagsOf(p, rep[p.id].measures, specMods[p.id])]));

  // 2. order: tier A first, flagged first within a tier, then the plan's list order
  const order = [...LIST].sort((a, b) => a.tier.localeCompare(b.tier) || (flags[b.id].length > 0) - (flags[a.id].length > 0) || LIST.indexOf(a) - LIST.indexOf(b));
  const groups = ['A', 'B', 'C'].map(t => ({ id: `tier-${t.toLowerCase()}`, title: TIER_TITLE[t], ids: order.filter(p => p.tier === t).map(p => p.id) })).filter(g => g.ids.length);
  const sources = Object.fromEntries(LIST.map(p => { const c = cardOf(p.id); if (!c && !draft) throw new Error(`${p.id}: no verified card`); return [p.id, c ? sourceLines(c) : ['Research card pending (draft build).']]; }));

  // 3. the plates page (pinned bytes)
  const heading = {
    title: 'M/ARC Library Plates · Pilot A',
    kicker: 'M/ARC · How to do it · Library pilot A',
    h1: 'Pilot A · 19 pattern plates',
    intro: 'Still drawings computed from joint angles by the same locked engine as the approved 8, in the app\'s own colours. Tap Trace to play the path once, Mistake to see the common fault, and a label to highlight its cue.',
    foot: 'Pilot sheet for the owner\'s review. Drawings are computed by our own code from the verified research cards (Winter 2009 body proportions); sources per exercise below.',
  };
  const { html: plates, warnings } = await buildPlatesPage({ groups, sources, specs, heading });
  const platesFile = join(OUT, 'pilot-a-plates.html');
  writeFileSync(platesFile, plates);
  const pageSha = sha256(plates);

  // 4. screenshots from the pinned pages: each new card (normal, Mistake, Paper) and each closest approved card
  const { chromium } = createRequire(join(ROOT, 'package.json'))('playwright');
  const browser = await chromium.launch({ executablePath: process.env.MARC_CHROMIUM ?? '/opt/pw-browsers/chromium' });
  let shots, approved;
  try {
    shots = await cardShots(browser, platesFile, LIST.map(p => p.id.replace(/_/g, '-')));
    const need = [...new Set(LIST.map(p => APPROVED_CHROME[p.closest] ?? p.closest.replace(/_/g, '-')))];
    approved = await cardShots(browser, FIXTURE, need, { mistake: false, paper: false });
  } finally { await browser.close(); }

  // 5. the sheet: the plates page with a row per card (card + aside), heading with the plates page sha
  const sheetHeading = { ...heading, title: 'M/ARC Library Plates · Pilot A sheet', intro: `${heading.intro}</p><p>Each row: the plate as it will ship (live), its Mistake, a Paper thumbnail, the closest approved plate and every flag. Plates page sha256 <span class="pg-sha">${pageSha}</span> (${plates.length.toLocaleString('en')} B); the cards on this sheet are byte-identical to that page.` };
  let sheet = (await buildPlatesPage({ groups, sources, specs, heading: sheetHeading })).html.toString();
  sheet = sheet.replace('</style>', `${SHEET_CSS}</style>`);
  for (const p of LIST) {
    const cid = p.id.replace(/_/g, '-'), s = shots[cid], apId = APPROVED_CHROME[p.closest] ?? p.closest.replace(/_/g, '-');
    const fl = flags[p.id], spec = specMods[p.id];
    const aside = `<aside class="pilot-aside" aria-label="${esc(spec.name)}: review notes">
  <div class="pilot-meta"><span><b>Tier ${p.tier}</b> · ${esc(p.class)}</span><span>Closest approved: <b>${esc(p.closest.replace(/_/g, ' '))}</b></span>${spec.pilot?.note ? `<span>${esc(spec.pilot.note)}</span>` : ''}<span>Engine report: <b>${rep[p.id].ok ? 'clean' : 'NOT clean'}</b> · ${rep[p.id].measures.pxPerM} px/m · critic scores: pending (supervisor's visual critic)</span></div>
  <ul class="pilot-flags">${fl.length ? fl.map(f => `<li><b>${f.id}</b> ${esc(f.text)}</li>`).join('') : '<li class="none">No flags</li>'}</ul>
  <div class="pilot-shots">
    <figure>${img(s.mistake, `${spec.name}: Mistake, Silent Black`, 'shot')}<figcaption>Mistake · ${esc((spec.mistake?.tells ?? []).map(t => t.text.replace(/<br\s*\/?>/g, ' ')).join(' · '))}</figcaption></figure>
    <figure>${img(approved[apId].dark, `Closest approved plate: ${p.closest}`, 'shot')}<figcaption>Closest approved · ${esc(p.closest.replace(/_/g, ' '))}</figcaption></figure>
    <figure>${img(s.paper, `${spec.name}: Paper theme`, 'shot')}<figcaption>Paper · normal</figcaption></figure>
  </div>
</aside>`;
    const re = new RegExp(`(<article class="sheet-card" id="card-${cid}"[\\s\\S]*?</article>)`);
    if (!re.test(sheet)) throw new Error(`${cid}: card not found in the sheet`);
    sheet = sheet.replace(re, `<div class="pilot-row" id="row-${cid}">$1${aside}</div>`);
  }
  const sheetFile = join(OUT, 'pilot-a-sheet.html');
  writeFileSync(sheetFile, sheet);

  // 6. the sheet's cards are the pinned bytes
  const a = extractPlates(plates.toString()), b = extractPlates(sheet);
  if (a.length !== LIST.length || b.length !== LIST.length) throw new Error(`cards: plates page ${a.length}, sheet ${b.length}, list ${LIST.length}`);
  for (const pa of a) {
    const pb = b.find(x => x.chromeId === pa.chromeId);
    if (JSON.stringify(fragmentsOf(pa)) !== JSON.stringify(fragmentsOf(pb))) throw new Error(`${pa.chromeId}: sheet card differs from the plates page`);
  }
  const summary = {
    pageSha, pageBytes: plates.length, sheetSha: sha256(sheet), sheetBytes: Buffer.byteLength(sheet), warnings: warnings.trim(),
    plates: order.map(p => ({ id: p.id, tier: p.tier, ok: rep[p.id].ok, flags: flags[p.id].map(f => f.id), measures: rep[p.id].measures,
      issues: rep[p.id].renders.flatMap(r => [...r.browserIssues, ...r.engineIssues].map(i => `${r.name}: ${i}`)) })),
  };
  writeFileSync(join(OUT, 'self-check.json'), JSON.stringify(summary, null, 1) + '\n');
  return summary;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const s = await build({ draft: process.argv.includes('--draft') });
  console.log(JSON.stringify({ ...s, plates: s.plates.map(p => `${p.tier} ${p.id} ${p.ok ? 'ok' : 'NOT OK'} ${p.flags.join(',')} ${p.issues.join('; ')}`) }, null, 1));
  process.exitCode = s.plates.every(p => p.ok) ? 0 : 1;
}
