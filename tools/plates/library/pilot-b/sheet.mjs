// LIB-11 (lib-11-card Do 10, D-LIB8M-SHEET's pattern): the pilot B review sheet around the plates page's own card bytes.
// The sheet part is copied from pilot-a/build.mjs on main 1edb3c66 (#109 merged; D-LIB11-SMITH), never imported; it
// differs where the card's Do 10 differs: the rows come from build.mjs (pilot-b/rows.json), the F-lines are only LIB-3's
// raised flags from the Do 7 report (qa.mjs --json), the closest plate is the pilot A anchor (or golden A's leg_press),
// and the sheet adds the hand renders, the E-R5 renders and the decisions. Writes only into <out> (never the repo).
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/pilot-b/sheet.mjs <out> --qa <qa.json> --er5 <png dir>
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/pilot-b/sheet.mjs --hands   writes the 6 evidence PNGs
// Builds the plates page and the sheet twice each and prints both sha256 pairs; the cards on the sheet must be
// byte-identical to the plates page's.
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ROOT } from '../../lib/inputs.mjs';
import { FIXTURE } from '../../golden.mjs';
import { buildPlatesPage } from '../build-page.mjs';
import { groupsConfig } from '../plates-page.mjs';
import { rows } from '../registry.mjs';
import { renderPair } from '../hands/pairs.mjs';
import { pageHtml } from '../hands/page.mjs';
import { buildPbPage, drawnIds, sha256 } from './build.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const PLATES_JSON = JSON.parse(readFileSync(join(here, 'plates.json'), 'utf8'));
const HELD = PLATES_JSON.plates.filter(p => p.held);
const HANDS = PLATES_JSON.hands;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const cid = id => id.replace(/_/g, '-');
const r2 = (v, d = 2) => +Number(v).toFixed(d);
const TIER_TITLE = { A: 'Tier A: over the face, spinal load, overhead, explosive', B: 'Tier B', C: 'Tier C' };

// D-LIB8M-SHEET: the F-lines are LIB-3's raised flags (runQa per id, the Do 7 report); DESIGN.md section 4's
// prediction shows as "predicted / measured" where they differ (21.3 point 3).
const QA_FLAG = {
  F1: f => `Scale ${r2(f.value)} px/m, approved ${f.range.map(v => r2(v)).join('-')}`,
  F2: f => `Figure box area ${r2(f.value, 3)}, approved ${f.range.map(v => r2(v, 3)).join('-')}`,
  F3: f => `Longest leader ${r2(f.value, 1)} px, approved ${f.range.map(v => r2(v, 1)).join('-')}`,
  F4: f => `${f.value} hand-placed labels, approved ${f.range.join('-')}`,
  F5: f => `Tell contrast ${f.value}, minimum ${f.min} (the selected Mistake tell in Midnight, D-LIB9-F5)`,
  F6: f => `Drawn in ${f.value} view; the census says ${f.expect}`,
  F7: f => `Mistake draws '${f.value}'; the card's top fault is '${f.expect}' (drawable-fault rule)`,
};
export const PREDICTED = { smith_machine_bench_press: ['F5'], seated_leg_curl: ['F5'], cable_fly: ['F2', 'F5'], push_up: ['F5'] };
// a raised flag other than F5 that the owner's sheet answers by name, with plan 8 decision 9's default
export const RULED_FLAG = { cable_fly: { F2: 'named flag: the two full-height columns outside the open hands (NOTE RULED, #278 6267313038, item 2)' } };

/** The raised LIB-3 flags of one id from the Do 7 report, in F-number order, and the predicted / measured line if they differ. */
export function qaFlagsOf(id, qa) {
  const e = qa.reports.find(x => x.id === `lib_${id}`);
  if (!e) throw new Error(`${id}: not in the Do 7 report`);
  const bad = Object.entries(e.hard).filter(([, h]) => !h.pass).map(([k]) => k);
  if (bad.length) throw new Error(`${id}: hard checks fail in the Do 7 report: ${bad.join(', ')}`);
  const raised = Object.entries(e.flags).filter(([, f]) => f.raised).sort(([a], [b]) => a.localeCompare(b));
  const lines = raised.map(([k, f]) => ({ id: k, text: QA_FLAG[k](f) + (RULED_FLAG[id]?.[k] ? `. ${RULED_FLAG[id][k]}` : '') }));
  const got = raised.map(([k]) => k).join(', '), want = (PREDICTED[id] ?? []).join(', ');
  return { lines, raised: raised.map(([k]) => k), hard: Object.keys(e.hard).length, differs: got === want ? null : `Predicted ${want || 'none'} / measured ${got || 'none'}` };
}
// The critic run each plate's approval rests on (lib4-cards 13.5 panel, D-CRITIC-CAL3; #278 6275943464, 6276782102).
export const CRITIC = {
  push_up: 'approved, round 1 @ 4033daf (D-CRITIC-CAL3): every median 4 or more; bytes unchanged at d3b231d',
  smith_machine_bench_press: 'approved, focused recheck @ d3b231d (D-LIB11-PANEL1): R2 4 [4,4,4], R4 5, R10 5',
  seated_leg_curl: 'approved, focused recheck @ d3b231d (D-LIB11-PANEL1): R4 5 [5,5,5]',
  cable_fly: 'approved, focused recheck @ d3b231d (D-LIB11-PANEL1): R3 4 [4,4,4]',
};
// E-R5 (Do 8; #278 6277350376 renders, 6277782675 advisory scores, 6381385131 D-ER5-GO). Scored, never approved.
export const SPIKE = '82ae2d4060487048b7841d303d2199d94f90c0fb';
export const ER5 = [
  { key: 'side_plank', name: 'Side plank', fields: 'root.roll (about 70), trunk.lat (Mistake); pitch 0', mistake: true,
    scores: 'R1 4 · R2 5 · R3 3 · R4 4 · R5 3 · R6 4 · R7 4', below: 'R3 and R5' },
  { key: 'russian_twist', name: 'Russian twist', fields: 'trunk.yaw 35, camera.pitch 20, volume trunk', mistake: false,
    scores: 'R1 3 · R2 2 · R3 2 · R4 3 · R6 4 · R7 4', below: 'R1 to R4', note: 'No Mistake tile: hips and knees swinging needs root.yaw, which LIB-20 adds (D-ER5-YAW)' },
  { key: 'dumbbell_fly', name: 'Dumbbell fly', fields: 'camera.pitch 45', mistake: true,
    scores: 'R1 3 · R2 2 · R3 2 · R4 4 · R5 3 · R6 4 · R7 3 · R10 3', below: 'R1, R2, R3, R5, R7 and R10', note: "Mistake is the spike's older fault, not the card's c13" },
  { key: 'rear_delt_fly', name: 'Rear-delt fly', fields: 'camera.pitch 15, volume trunk', mistake: true,
    scores: 'R1 3 · R2 5 · R3 5 · R4 4 · R5 2 · R6 4 · R7 3', below: 'R1, R5 and R7' },
];
// Decisions on this sheet. The owner delegated his open library choices to the supervisor (D-ER5-GO, 6381385131): each
// gets a recommended option and the supervisor decides; an answered one is shown, not asked.
export const DECISIONS = [
  { name: 'Engine fields (E-R5)', state: 'Answered: GO (D-ER5-GO, #278 6381385131). LIB-20 lands root.roll, trunk.yaw, trunk.lat, camera.pitch and the volume trunk, plus root.yaw (D-ER5-YAW), as a golden update that keeps golden A and every pinned page byte-identical.' },
  { name: 'Text-only feel state', state: 'No render from the layers lane yet (D-LIB11-TEXTONLY). Recommended: yes (decision 7 default). Supervisor decides.' },
  { name: 'Battle rope camera', state: 'Options (D-LIB12FIX-ROPE): (i) the committed render, seen from above at forearm 180, R8 PASS; (ii) a redraw at a level forearm (forearm 90), no render supplied; (iii) another camera, not defined. Recommended: (i), the only drawn and R8-approved option, and LIB-12-FIX keeps its bytes. Supervisor decides.' },
  { name: 'Cable fly F2', state: 'Figure box area 0.628 against 0.549: the two columns outside the open hands. Recommended: approve as a named exemption (plan 8 decision 9 default). Supervisor decides.' },
];

/** Screenshots of cards in a built page: normal, Mistake (after tapping Mistake), Paper (after tapping Paper), as WebP. */
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
const img = (url, alt) => `<img class="shot" alt="${esc(alt)}" src="${url}">`;
const fig = (url, alt, cap) => `<figure>${img(url, alt)}<figcaption>${esc(cap)}</figcaption></figure>`;

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
.pilot-row.wide { grid-template-columns: minmax(0, 1fr); }
.pilot-text { margin: 0; max-width: 72ch; font-size: var(--fs-small); line-height: 1.5; color: var(--text); }
.pilot-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; color: var(--text-2); }
.pg-sha { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; overflow-wrap: anywhere; color: var(--pg-text); }
`;

/** The pilot A anchors and golden A's leg_press as one page, from their registry rows (the pinned specs). */
const anchorPage = list => groupsConfig({ groups: [{ id: 'anchors', title: 'Anchors', ids: [...new Set(list.map(p => `lib_${p.closest}`))] }] }, rows(), 'anchors');

/** One build of the plates page and the sheet into `out` (suffix n). Returns their bytes and shas. */
export async function build({ qa, er5Dir, out, n = 1 }) {
  mkdirSync(out, { recursive: true });
  if (qa.reports.length !== drawnIds().length) throw new Error(`Do 7 report: ${qa.reports.length} ids, ${drawnIds().length} drawn`);
  const ids = drawnIds().map(i => i.slice(4)), LIST = ids.map(id => { const p = PLATES_JSON.plates.find(x => x.id === id); if (!p || p.held) throw new Error(`${id}: no plates.json entry, or held`); return p; });
  const q = Object.fromEntries(ids.map(id => [id, qaFlagsOf(id, qa)]));

  // 1. the plates page (the bytes the pin will hold); the report must have run on these bytes
  const { html: plates, warnings } = await buildPbPage();
  const pageSha = sha256(plates);
  if (qa.sha !== pageSha) throw new Error(`Do 7 report ran on page ${qa.sha}, this page is ${pageSha}`);
  const platesFile = join(out, `pilot-b-plates-${n}.html`);
  writeFileSync(platesFile, plates);
  const anchorsCfg = await anchorPage(LIST.filter(p => p.closest !== 'leg_press'));
  const anchorsFile = join(out, `pilot-b-anchors-${n}.html`);
  writeFileSync(anchorsFile, (await buildPlatesPage(anchorsCfg)).html);

  // 2. screenshots: each card (normal, Mistake, Paper); each anchor; the hand and E-R5 PNGs as WebP
  const { chromium } = createRequire(join(ROOT, 'package.json'))('playwright');
  const browser = await chromium.launch({ executablePath: process.env.MARC_CHROMIUM ?? '/opt/pw-browsers/chromium' });
  let shots, anchors, hands, er5;
  try {
    shots = await cardShots(browser, platesFile, ids.map(cid));
    anchors = { ...await cardShots(browser, anchorsFile, LIST.filter(p => p.closest !== 'leg_press').map(p => cid(p.closest)), { mistake: false, paper: false }),
      ...await cardShots(browser, FIXTURE, ['leg-press'], { mistake: false, paper: false }) };
    const page = await (await browser.newContext()).newPage();
    hands = await Promise.all(HANDS.map(async h => Promise.all(h.images.map(f => webp(page, readFileSync(join(here, f)))))));
    er5 = {};
    for (const r of ER5) {
      er5[r.key] = {};
      for (const v of ['silent-black', 'paper', ...(r.mistake ? ['mistake'] : [])]) {
        const f = join(er5Dir, `${r.key}-${v}.png`);
        er5[r.key][v] = { url: await webp(page, readFileSync(f)), sha: sha256(readFileSync(f)) };
      }
    }
  } finally { await browser.close(); }

  // 3. the sheet: the plates page with a row per card (card + aside), then holds, hands, E-R5 and decisions
  // Owner decision LR-23 (2026-09-30): no Sources section and no source names in the sheet's visible text.
  const tierOf = id => LIST.find(p => cid(p.id) === id)?.tier;
  const cfg = await groupsConfig({ groups: ['A', 'B', 'C'].map(t => ({ id: `tier-${t.toLowerCase()}`, title: TIER_TITLE[t], ids: drawnIds().filter(i => tierOf(cid(i.slice(4))) === t) })).filter(g => g.ids.length) }, (await import('./build.mjs')).pbAll(), 'sheet');
  cfg.heading = { ...cfg.heading, title: 'M/ARC Library Plates · Pilot B sheet', kicker: 'M/ARC · How to do it · Library pilot B', h1: `Pilot B · ${LIST.length} anchor plates`,
    intro: `Each row: the plate as it will ship (live), its Mistake, a Paper thumbnail, the anchor plate and every flag. Plates page sha256 <span class="pg-sha">${pageSha}</span> (${plates.length.toLocaleString('en')} B); the cards on this sheet are byte-identical to that page.${HELD.map(h => `</p><p>Held off this sheet: ${h.id.replace(/_/g, ' ')}. ${esc(h.held)}.`).join('')}`,
    foot: 'Pilot sheet for review. Drawings are computed by our own code from the verified research cards.' };
  let sheet = (await buildPlatesPage(cfg)).html.toString();
  sheet = sheet.replace('</style>', `${SHEET_CSS}</style>`);
  const src = sheet.match(/\n  <details id="sources">[\s\S]*?<\/details>/g);
  if (src?.length !== 1) throw new Error('sheet: the sources list was not found exactly once');
  sheet = sheet.replace(src[0], '');
  for (const p of LIST) {
    const c = cid(p.id), s = shots[c], a = anchors[cid(p.closest)], f = q[p.id];
    const anchorName = p.closest.replace(/_/g, ' '), anchorWhere = p.closest === 'leg_press' ? 'golden A, census closest' : 'pilot A anchor, pinned';
    const lines = [...f.lines, ...(p.rig ? [{ id: 'Rig', text: p.rig }] : [])];
    const aside = `<aside class="pilot-aside" aria-label="${esc(p.id.replace(/_/g, ' '))}: review notes">
  <div class="pilot-meta"><span><b>Tier ${p.tier}</b> · ${esc(p.class)}</span><span>Anchor: <b>${esc(anchorName)}</b> (${anchorWhere})</span><span>Plate QA: <b>${f.hard} hard checks pass</b></span><span>Critic: ${esc(CRITIC[p.id] ?? 'pending')}</span>${f.differs ? `<span>${esc(f.differs)}</span>` : ''}</div>
  <ul class="pilot-flags">${lines.map(l => `<li><b>${l.id}</b> ${esc(l.text)}</li>`).join('')}</ul>
  <div class="pilot-shots">
    ${fig(s.mistake, `${p.id}: Mistake, Silent Black`, 'Mistake')}
    ${fig(a.dark, `Anchor plate: ${anchorName}`, `Anchor · ${anchorName}`)}
    ${fig(s.paper, `${p.id}: Paper theme`, 'Paper · normal')}
  </div>
</aside>`;
    const re = new RegExp(`(<article class="sheet-card" id="card-${c}"[\\s\\S]*?</article>)`);
    if (!re.test(sheet)) throw new Error(`${c}: card not found in the sheet`);
    sheet = sheet.replace(re, `<div class="pilot-row" id="row-${c}">$1${aside}</div>`);
  }
  const section = (id, title, body) => `<section class="group" id="group-${id}" aria-labelledby="group-${id}-title"><h2 class="group-title" id="group-${id}-title">${title}</h2>\n${body}\n</section>`;
  const row = (id, name, meta, flags, figs, { text = false } = {}) => `<div class="pilot-row wide" id="row-${id}"><aside class="pilot-aside" aria-label="${esc(name)}">
  <div class="pilot-meta"><span><b>${esc(name)}</b>${meta ? ` · ${esc(meta)}` : ''}</span></div>
  ${text ? flags.map(t => `<p class="pilot-text">${esc(t)}</p>`).join('') : `<ul class="pilot-flags">${flags.map(t => `<li${/^No drawing yet/.test(t) ? ' class="none"' : ''}>${esc(t)}</li>`).join('')}</ul>`}
  ${figs.length ? `<div class="pilot-shots">${figs.join('')}</div>` : ''}
</aside></div>`;
  const handRows = HANDS.map((h, i) => row(`hand-${h.key}${h.key === 'palm-flat' ? `-${h.fault}` : ''}`, h.name, h.id?.replace(/_/g, ' '), h.flags,
    hands[i].map((u, k) => fig(u, `${h.name}: ${k ? 'Paper' : 'Silent Black'}`, k ? 'Paper' : 'Silent Black'))));
  const er5Rows = ER5.map(r => row(`er5-${cid(r.key)}`, r.name, `engine test render; below the plate bar on ${r.below}`,
    [`Fields: ${r.fields}`, `Advisory scores: ${r.scores}`, ...(r.note ? [r.note] : []), `PNG sha256 ${Object.values(er5[r.key]).map(x => x.sha.slice(0, 12)).join(', ')}`],
    [fig(er5[r.key]['silent-black'].url, `${r.name}: Silent Black`, 'Silent Black'), ...(r.mistake ? [fig(er5[r.key].mistake.url, `${r.name}: Mistake`, 'Mistake')] : []), fig(er5[r.key].paper.url, `${r.name}: Paper`, 'Paper')]));
  const decRows = DECISIONS.map((d, i) => row(`decision-${i + 1}`, d.name, null, [d.state], [], { text: true }));
  const end = sheet.lastIndexOf('\n</main>');
  if (end < 0) throw new Error('sheet: </main> not found');
  sheet = `${sheet.slice(0, end)}\n${section('hands', 'Hand renders', handRows.join('\n'))}\n${section('er5', 'Engine renders', `<p class="pilot-text">Spike head <span class="pilot-mono">${SPIKE}</span>. Scored, never approved.</p>\n${er5Rows.join('\n')}`)}\n${section('decisions', 'Decisions', decRows.join('\n'))}${sheet.slice(end)}`;
  const sheetFile = join(out, `pilot-b-sheet-${n}.html`);
  writeFileSync(sheetFile, sheet);

  // 4. the sheet's cards are the plates page's bytes
  const cards = html => new Map([...html.matchAll(/<article class="sheet-card" id="card-([a-z0-9-]+)"[\s\S]*?<\/article>/g)].map(m => [m[1], m[0]]));
  const A = cards(plates.toString()), B = cards(sheet);
  if (A.size !== LIST.length || B.size !== LIST.length) throw new Error(`cards: plates page ${A.size}, sheet ${B.size}, list ${LIST.length}`);
  for (const [id, bytes] of A) if (B.get(id) !== bytes) throw new Error(`${id}: sheet card differs from the plates page`);
  return { pageSha, pageBytes: plates.length, sheetSha: sha256(sheet), sheetBytes: Buffer.byteLength(sheet), warnings: warnings.trim(),
    plates: LIST.map(p => ({ id: p.id, tier: p.tier, flags: q[p.id].raised, differs: q[p.id].differs })), held: HELD.map(h => h.id),
    er5: Object.fromEntries(ER5.map(r => [r.key, Object.fromEntries(Object.entries(er5[r.key]).map(([k, v]) => [k, v.sha]))])) };
}

/** The 6 hand evidence PNGs (A16): renderPair(id, { fault }) alone on pageHtml, 390 px, full page, both themes. */
export async function renderHands(dir = join(here, 'evidence')) {
  mkdirSync(dir, { recursive: true });
  const { chromium } = createRequire(join(ROOT, 'package.json'))('playwright');
  const browser = await chromium.launch({ executablePath: process.env.MARC_CHROMIUM ?? '/opt/pw-browsers/chromium' });
  const out = {};
  try {
    for (const h of HANDS.filter(x => x.images.length)) {
      const { svg } = renderPair(h.id, { fault: h.fault });
      for (const [k, [theme, scheme]] of [['silent-black', 'dark'], ['paper', 'light']].entries()) {
        const p = await browser.newPage({ viewport: { width: 390, height: 100 }, deviceScaleFactor: 2, colorScheme: scheme });
        await p.setContent(pageHtml(svg, theme));
        await p.evaluate(() => document.fonts.ready);
        const f = join(here, h.images[k]);
        if (!f.endsWith(`-${theme}.png`)) throw new Error(`${h.images[k]}: not the ${theme} file`);
        writeFileSync(f, await p.screenshot({ fullPage: true }));
        out[h.images[k]] = sha256(readFileSync(f));
        await p.close();
      }
    }
  } finally { await browser.close(); }
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
  if (args.includes('--hands')) { for (const [f, s] of Object.entries(await renderHands())) console.log(`${s}  ${f}`); process.exit(0); }
  const out = args[0], qa = opt('--qa'), er5Dir = opt('--er5');
  if (!out || !qa || !er5Dir || !existsSync(er5Dir)) throw new Error('usage: sheet.mjs <out> --qa <qa.json> --er5 <png dir>');
  const report = JSON.parse(readFileSync(qa, 'utf8')), runs = [];
  for (const n of [1, 2]) runs.push(await build({ qa: report, er5Dir, out, n }));
  const [a, b] = runs;
  console.log(JSON.stringify(a, null, 1));
  console.log(a.pageSha === b.pageSha ? `plates page: identical, sha256 ${a.pageSha}` : 'plates page: the two builds DIFFER');
  console.log(a.sheetSha === b.sheetSha ? `sheet: identical, sha256 ${a.sheetSha}` : `sheet: the two builds DIFFER (${a.sheetSha} / ${b.sheetSha})`);
  if (a.pageSha !== b.pageSha || a.sheetSha !== b.sheetSha) process.exitCode = 1;
}
