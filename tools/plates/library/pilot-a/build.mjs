// LIB-8 pilot A: builds the pilot plates page (the bytes that get pinned), the owner's review sheet around the same
// card bytes, and the self-check (engine report per plate, 390 px screenshots in Silent Black and Paper).
//   node tools/plates/library/pilot-a/build.mjs            writes out/ (see OUT below) and prints the summary
// The plates page is built by the library page builder (golden A's chrome, ../build-page.mjs). The sheet adds, per
// plate, its Mistake, a Paper thumbnail, the closest approved plate and every flag, and prints the plates page sha.
// A check requires every card (<article>…</article>) on the sheet to be byte-identical to the same card on the plates page.
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildPlatesPage } from '../build-page.mjs';
import { reportPlates } from '../report.mjs';
import { ROOT, FIXTURE, sha256 } from '../../golden.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const LIB = join(here, '..');
export const OUT_DIR = join(here, 'out');
const PLATES_JSON = JSON.parse(readFileSync(join(here, 'plates.json'), 'utf8'));
const ALL = PLATES_JSON.plates;
const HANDS = PLATES_JSON.hands ?? [];   // LIB-12 hand renders: shown on the sheet only (evidence images), never on the plates page
const PILOT = ALL.filter(p => !p.held);   // held plates stay off both pages (supervisor ruling), one line each on the sheet
const HELD = ALL.filter(p => p.held);
const CARDS = join(ROOT, 'docs', 'research', 'howto', 'cards');   // verified research cards, byte copies from claude/libht-research f57e794 (D-LIB8M-CARDS)

// Flag envelope (plan 3.3), measured on the 7 engine-drawn approved plates by report.mjs `measures` (the lateral
// raise is hand-drawn, at the reference 146.29 px/m). Kept for this sheet and page order only (D-LIB8FIX-ENV): F2 and F3 here are other measures than LIB-3's; LIB-3's qa flags (qa/envelope.json) gate the merge.
export const ENVELOPE = { pxPerM: [123.91, 146.29], coverage: [0.1, 0.246], longestLeader: [0, 81.9], boxed: [0, 6] };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const TIER_TITLE = { A: 'Tier A: over the face, spinal load, overhead, explosive', B: 'Tier B', C: 'Tier C' };
const APPROVED_CHROME = { lateral_raise: 'lateral-raise' };

// D-LIB8M-SHEET: the sheet's F-lines are LIB-3's raised flags from the Do 9 report (runQa per id, passed to build() as
// `qa`); MERGE.md section e's prediction (with D-LIB8M-TF1 4's F7 on the curl) shows as "predicted / measured" where they differ.
const QA_FLAG = {
  F1: (f) => `Scale ${r2(f.value)} px/m, approved ${f.range.map(v => r2(v)).join('-')}`,
  F2: (f) => `Figure box area ${r2(f.value, 3)}, approved ${f.range.map(v => r2(v, 3)).join('-')}`,
  F3: (f) => `Longest leader ${r2(f.value, 1)} px, approved ${f.range.map(v => r2(v, 1)).join('-')}`,
  F4: (f) => `${f.value} hand-placed labels, approved ${f.range.join('-')}`,
  F5: (f, at) => `Tell contrast ${f.value}, minimum ${f.min}${at ? ` (${at.where}, ${at.theme}, ${at.width} px)` : ''}`,
  F6: (f) => `Drawn in ${f.value} view; the census says ${f.expect}`,
  F7: (f) => `Mistake draws '${f.value}'; the card's top fault is '${f.expect}' (drawable-fault rule)`,
};
const r2 = (v, d = 2) => +Number(v).toFixed(d);
export const PREDICTED = {
  barbell_row: ['F4', 'F5'], single_leg_romanian_deadlift: ['F4', 'F5'], dumbbell_bench_press: ['F4', 'F5'], incline_dumbbell_press: ['F4', 'F5'],
  dumbbell_shoulder_press: ['F4', 'F5'], barbell_overhead_press: ['F5'], romanian_deadlift: ['F5'], upright_row: ['F5'], pec_fly: ['F5'],
  dumbbell_biceps_curl: ['F4', 'F5', 'F7'], triceps_pushdown: ['F5'], rope_triceps_pushdown: ['F5'], plank: ['F1', 'F5'], mountain_climbers: ['F1', 'F3', 'F5'],
};
/** The raised LIB-3 flags of one id from the Do 9 report, in F-number order, and the predicted / measured line if they differ. */
export function qaFlagsOf(id, qa) {
  const e = qa.find(x => x.id === `lib_${id}`);
  if (!e) throw new Error(`${id}: not in the Do 9 report`);
  const raised = Object.entries(e.report.flags).filter(([, f]) => f.raised).sort(([a], [b]) => a.localeCompare(b));
  const lines = raised.map(([k, f]) => ({ id: k, text: QA_FLAG[k](f, k === 'F5' ? e.f5Element : null) }));
  const got = raised.map(([k]) => k).join(', '), want = (PREDICTED[id] ?? []).join(', ');
  return { lines, differs: got === want ? null : `Predicted ${want || 'none'} / measured ${got || 'none'}` };
}
// The critic run each plate's approval rests on (lib4-cards 13.5 panel; medians R1-R7, then R10 where scored; R8, R9 unscored).
export const CRITIC = {
  dumbbell_shoulder_press: 'approved, round 1 @ 83735ab (D-LIB8M-CRIT1): 4, 4, 5, 5, 4, 4, 4; R10 5',
  dumbbell_biceps_curl: 'approved, round 1 @ 83735ab (D-LIB8M-CRIT1): 4, 5, 5, 5, 4, 5, 5',
  dumbbell_bench_press: 'approved, recheck @ 013f84e (D-LIB8M-CRIT2), no item at 3 or less',
  triceps_pushdown: 'approved, recheck @ 013f84e (D-LIB8M-CRIT2), no item at 3 or less',
  rope_triceps_pushdown: 'approved, recheck @ 013f84e (D-LIB8M-CRIT2), no item at 3 or less',
  pec_fly: 'approved, recheck @ 013f84e (D-LIB8M-CRIT2), no item at 3 or less',
  plank: 'Mistake redrawn, focused recheck PASS (supervisor, #109 6382619662); normal plate approved, recheck @ 013f84e (D-LIB8M-CRIT2)',
  upright_row: 'approved, last recheck @ 94c551f (D-LIB8M-CRIT3), every scored item passes',
  barbell_row: 'approved, wf_cad21b92-9ed @ e6f39ff (carried, D-LIB8M-CARRY)',
  romanian_deadlift: 'approved, wf_cad21b92-9ed @ e6f39ff (carried, D-LIB8M-CARRY)',
  single_leg_romanian_deadlift: 'approved, wf_cad21b92-9ed @ e6f39ff (carried, D-LIB8M-CARRY)',
  barbell_overhead_press: 'approved, wf_cad21b92-9ed @ e6f39ff (carried; tempo strip new, D-LIB8M-CARRY)',
  mountain_climbers: 'approved, wf_cad21b92-9ed @ e6f39ff (carried, D-LIB8M-CARRY)',
};

/** Flags F1-F4 from the measures, F6 from the census view, F7 from the plate's `pilot` note; F5 is chrome-identical. */
export function flagsOf(entry, measures, spec) {
  const f = [];
  const out = (k, v) => v < ENVELOPE[k][0] || v > ENVELOPE[k][1];
  if (out('pxPerM', measures.pxPerM)) f.push({ id: 'F1', text: `Scale ${measures.pxPerM} px/m, approved ${ENVELOPE.pxPerM.join('-')}${entry.rulings?.F1 ? `. Ruling ${entry.rulings.F1}` : ''}` });
  if (out('coverage', measures.coverage)) f.push({ id: 'F2', text: `Ink coverage ${measures.coverage}, approved ${ENVELOPE.coverage.join('-')}` });
  if (out('longestLeader', measures.longestLeader)) f.push({ id: 'F3', text: `Longest leader ${measures.longestLeader} px, approved up to ${ENVELOPE.longestLeader[1]}` });
  if (out('boxed', measures.boxed)) f.push({ id: 'F4', text: `${measures.boxed} hand-placed labels, approved up to ${ENVELOPE.boxed[1]}` });
  if (spec.view !== entry.view) f.push({ id: 'F6', text: `Drawn in ${spec.view} view; the census says ${entry.view}` });
  if (spec.pilot?.drawableFault) f.push({ id: 'F7', text: `Mistake is not the card's top fault (drawable-fault rule): ${spec.pilot.drawableFault}` });
  for (const n of entry.notes ?? []) f.push({ id: 'Note', text: n });
  if (!spec.tempo) f.push({ id: 'Note', text: 'No tempo strip: the verified card gives no seconds (never invented)' });
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
  for (const id of ids) for (const k of Object.keys(out[id])) out[id][k] = await webp(page, out[id][k]);
  await ctx.close();
  return out;
}
// WebP (lossy, q 0.92) through the browser's own encoder: about a quarter of the PNG bytes for line art
const webp = (page, png) => page.evaluate(async b64 => { const im = new Image(); im.src = `data:image/png;base64,${b64}`; await im.decode();
  const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; c.getContext('2d').drawImage(im, 0, 0); return c.toDataURL('image/webp', 0.92); }, png.toString('base64'));
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

export async function build({ draft = false, qa = null, list: LIST = PILOT, specPath = id => join(LIB, 'specs', `${id}.mjs`), out: OUT = OUT_DIR } = {}) {
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
    h1: `Pilot A · ${LIST.length} pattern plates`,
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
    // extras: go/no-go alternates (their plate alone, Silent Black, from the engine report) and preview images
    const altSpecs = LIST.flatMap(p => (p.extras ?? []).filter(x => x.spec).map(x => x.spec));
    if (altSpecs.length) await reportPlates(altSpecs.map(specPath), { shotsDir: join(OUT, 'shots') });
    const page = await (await browser.newContext()).newPage();
    for (const p of LIST) for (const x of p.extras ?? []) x.url = await webp(page, readFileSync(x.spec ? join(OUT, 'shots', `${x.spec}-dark-plate.png`) : join(here, x.image)));
    for (const h of HANDS) h.urls = await Promise.all(h.images.map(f => webp(page, readFileSync(join(here, f)))));
  } finally { await browser.close(); }

  // 5. the sheet: the plates page with a row per card (card + aside), heading with the plates page sha
  // Owner decision LR-23 (2026-09-30): no Sources section and no source, study or organisation names in the sheet's
  // visible text; sources stay in the card data. The footer line and the golden chrome's sources list are dropped here.
  const sheetHeading = { ...heading, foot: 'Pilot sheet for the owner\'s review. Drawings are computed by our own code from the verified research cards.', title: 'M/ARC Library Plates · Pilot A sheet', intro: `${heading.intro}</p><p>Each row: the plate as it will ship (live), its Mistake, a Paper thumbnail, the closest approved plate and every flag. Research: the verified cards at claude/libht-research f57e794. Plates page sha256 <span class="pg-sha">${pageSha}</span> (${plates.length.toLocaleString('en')} B); the cards on this sheet are byte-identical to that page.${HELD.map(h => `</p><p>Held off this sheet: ${h.id.replace(/_/g, ' ')}. ${h.held}.`).join('')}` };
  let sheet = (await buildPlatesPage({ groups, sources, specs, heading: sheetHeading })).html.toString();
  sheet = sheet.replace('</style>', `${SHEET_CSS}</style>`);
  const src = sheet.match(/\n  <details id="sources">[\s\S]*?<\/details>/g);
  if (src?.length !== 1) throw new Error('sheet: the sources list was not found exactly once');
  sheet = sheet.replace(src[0], '');
  for (const p of LIST) {
    const cid = p.id.replace(/_/g, '-'), s = shots[cid], apId = APPROVED_CHROME[p.closest] ?? p.closest.replace(/_/g, '-');
    const spec = specMods[p.id], env = flags[p.id].filter(f => f.id !== 'Note'), notes = flags[p.id].filter(f => f.id === 'Note');
    const q = qa ? qaFlagsOf(p.id, qa) : null;
    const fl = [...(q ? q.lines : [{ id: 'LIB-3', text: 'flags not measured: no Do 9 report passed' }]), ...notes];
    const aside = `<aside class="pilot-aside" aria-label="${esc(spec.name)}: review notes">
  <div class="pilot-meta"><span><b>Tier ${p.tier}</b> · ${esc(p.class)}</span><span>Closest approved: <b>${esc(p.closest.replace(/_/g, ' '))}</b></span>${spec.pilot?.note ? `<span>${esc(spec.pilot.note)}</span>` : ''}<span>Engine report: <b>${rep[p.id].ok ? 'clean' : 'NOT clean'}</b> · ${rep[p.id].measures.pxPerM} px/m</span><span>Critic: ${esc(CRITIC[p.id] ?? 'pending')}</span><span>Page order: ${env.length ? esc(env.map(f => f.text).join('; ')) : 'no envelope flag'}</span>${q?.differs ? `<span>${esc(q.differs)}</span>` : ''}</div>
  <ul class="pilot-flags">${fl.length ? fl.map(f => `<li><b>${f.id}</b> ${esc(f.text)}</li>`).join('') : '<li class="none">No flags</li>'}</ul>
  <div class="pilot-shots">
    <figure>${img(s.mistake, `${spec.name}: Mistake, Silent Black`, 'shot')}<figcaption>Mistake · ${esc((spec.mistake?.tells ?? []).map(t => t.text.replace(/<br\s*\/?>/g, ' ')).join(' · '))}</figcaption></figure>
    <figure>${img(approved[apId].dark, `Closest approved plate: ${p.closest}`, 'shot')}<figcaption>Closest approved · ${esc(p.closest.replace(/_/g, ' '))}</figcaption></figure>
    <figure>${img(s.paper, `${spec.name}: Paper theme`, 'shot')}<figcaption>Paper · normal</figcaption></figure>
    ${(p.extras ?? []).map(x => `<figure>${img(x.url, x.caption, 'shot')}<figcaption>${esc(x.caption)}</figcaption></figure>`).join('')}
  </div>
</aside>`;
    const re = new RegExp(`(<article class="sheet-card" id="card-${cid}"[\\s\\S]*?</article>)`);
    if (!re.test(sheet)) throw new Error(`${cid}: card not found in the sheet`);
    sheet = sheet.replace(re, `<div class="pilot-row" id="row-${cid}">$1${aside}</div>`);
  }
  // LIB-12 hand renders (sheet only): one row per hand kind, Silent Black and Paper, with its flags
  if (HANDS.length) {
    const rows = HANDS.map(h => `<div class="pilot-row" id="row-hand-${h.key}"><aside class="pilot-aside" aria-label="${esc(h.name)}: hand render">
  <div class="pilot-meta"><span><b>${esc(h.name)}</b>${h.id ? ` · ${esc(h.id.replace(/_/g, ' '))}` : ''}</span></div>
  <ul class="pilot-flags">${h.flags.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
  ${h.urls.length ? `<div class="pilot-shots">${h.urls.map((u, i) => `<figure>${img(u, `${h.name}: ${i ? 'Paper' : 'Silent Black'}`, 'shot')}<figcaption>${i ? 'Paper' : 'Silent Black'}</figcaption></figure>`).join('')}</div>` : ''}
</aside></div>`).join('\n');
    const end = sheet.lastIndexOf('\n</main>');
    if (end < 0) throw new Error('sheet: </main> not found');
    sheet = `${sheet.slice(0, end)}\n<section class="group" id="group-hands" aria-labelledby="group-hands-title"><h2 class="group-title" id="group-hands-title">Hand renders</h2>\n${rows}\n</section>${sheet.slice(end)}`;
  }
  const sheetFile = join(OUT, 'pilot-a-sheet.html');
  writeFileSync(sheetFile, sheet);

  // 6. the sheet's cards are the pinned bytes
  const cards = html => new Map([...html.matchAll(/<article class="sheet-card" id="card-([a-z0-9-]+)"[\s\S]*?<\/article>/g)].map(m => [m[1], m[0]]));
  const a = cards(plates.toString()), b = cards(sheet);
  if (a.size !== LIST.length || b.size !== LIST.length) throw new Error(`cards: plates page ${a.size}, sheet ${b.size}, list ${LIST.length}`);
  for (const [id, bytes] of a) if (b.get(id) !== bytes) throw new Error(`${id}: sheet card differs from the plates page`);

  const summary = {
    pageSha, pageBytes: plates.length, sheetSha: sha256(sheet), sheetBytes: Buffer.byteLength(sheet), warnings: warnings.trim(),
    plates: order.map(p => ({ id: p.id, tier: p.tier, ok: rep[p.id].ok, flags: flags[p.id].map(f => f.id), measures: rep[p.id].measures,
      issues: rep[p.id].renders.flatMap(r => [...r.browserIssues, ...r.engineIssues].map(i => `${r.name}: ${i}`)) })),
  };
  writeFileSync(join(OUT, 'self-check.json'), JSON.stringify(summary, null, 1) + '\n');
  return summary;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const qi = process.argv.indexOf('--qa');
  const s = await build({ draft: process.argv.includes('--draft'), qa: qi > 0 ? JSON.parse(readFileSync(process.argv[qi + 1], 'utf8')) : null });
  console.log(JSON.stringify({ ...s, plates: s.plates.map(p => `${p.tier} ${p.id} ${p.ok ? 'ok' : 'NOT OK'} ${p.flags.join(',')} ${p.issues.join('; ')}`) }, null, 1));
  process.exitCode = s.plates.every(p => p.ok) ? 0 : 1;
}
