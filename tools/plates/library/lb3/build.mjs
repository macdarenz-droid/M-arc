// LIB-13 (lib-13-card Do 5, Do 8, A10): the LB3 plates page, built from lb3/rows.json read as if it were a batch file
// (it never goes into batches/: D-LIB13-AHEAD). Each row's sources lines come from its research card (as pilot A's
// sheet does), in memory only. The page holds every LB3 row whose spec exists (the build-ahead draws in steps).
//   node tools/plates/library/lb3/build.mjs     builds the page twice into a temp directory and prints both sha256
//   MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/lb3/build.mjs --shots [theme] [lib_id ...]
//     screenshots each drawn card's Mistake (theme default paper, 390 px wide) into a temp directory (sheet review)
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT } from '../../lib/inputs.mjs';
import { buildPlatesPage } from '../build-page.mjs';
import { groupsConfig } from '../plates-page.mjs';
import { batchFiles, rows } from '../registry.mjs';

export const LB3_ROWS = 'tools/plates/library/lb3/rows.json';
const read = (root, p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const cardOf = (root, id) => read(root, `docs/research/howto/cards/${id.slice(4)}.json`);
/** A research card's source list as page lines (title, year, url, PMID). */
export const sourceLines = card => card.sources.map(s => `${s.title}${s.year ? ` (${s.year})` : ''}. ${s.url}${s.pmid ? ` PMID ${s.pmid}` : ''}`);

/** The LB3 rows data with each row's sources from its card (memory only). `data` defaults to lb3/rows.json. */
export function lb3Data(root = ROOT, data = read(root, LB3_ROWS)) {
  return { ...data, rows: Object.fromEntries(Object.entries(data.rows).map(([id, r]) => [id, { ...r, sources: sourceLines(cardOf(root, id)) }])) };
}

/** Every registry row: the 8, the batch files, then lb3/rows.json read as one more batch file (Do 4). */
export function lb3All(root = ROOT, data = lb3Data(root)) {
  return rows(root, { batches: [...batchFiles(root).map(p => [p, read(root, p)]), [LB3_ROWS, data]] });
}

/** The LB3 ids whose spec file exists, in rows.json order. */
export const drawnIds = (root = ROOT, data = read(root, LB3_ROWS)) => Object.entries(data.rows).filter(([, r]) => existsSync(join(root, 'tools/plates', r.src))).map(([id]) => id);

/** The LB3 plates page bytes ({ html: Buffer, warnings }) for `ids` (default: every drawn id). */
export async function buildLb3Page({ root = ROOT, all = lb3All(root), ids = drawnIds(root) } = {}) {
  return buildPlatesPage(await groupsConfig({ groups: [{ id: 'lb3', title: 'LB3', ids }] }, all, LB3_ROWS));
}

export const sha256 = b => createHash('sha256').update(b).digest('hex');

/** PNG screenshots of each card at 390 px in `theme`, `mode` 'mistake' or 'normal': [{ id, path }] in `dir`. */
export async function cardShots({ ids = drawnIds(), theme = 'paper', mode = 'mistake', dir = mkdtempSync(join(tmpdir(), 'lb3-shots-')) } = {}) {
  const { launch } = await import('../qa/browser.mjs'), { openGolden, settle } = await import('../../fidelity/harness.mjs');
  const { html } = await buildLb3Page({ ids }), data = read(ROOT, LB3_ROWS), browser = await launch(), out = [];
  try {
    const { ctx, page } = await openGolden(browser, theme, { viewport: { width: 390, height: 844 }, html });
    try {
      for (const id of ids) {
        const cid = data.rows[id].chromeId;
        await page.evaluate(([c, m]) => { const pill = document.getElementById(`${c}-mistake`); if ((pill.getAttribute('aria-pressed') === 'true') !== (m === 'mistake')) pill.click(); }, [cid, mode]);
        await settle(page);
        const path = join(dir, `${id}-${theme}-${mode}.png`);
        await page.locator(`#card-${cid}`).screenshot({ path });
        out.push({ id, path });
      }
    } finally { await ctx.close(); }
  } finally { await browser.close(); }
  return out;
}
export const mistakeShots = opts => cardShots({ ...opts, mode: 'mistake' });

/** The LB3 owner sheet (card :20-21; D-LIB8M-SHEET's pattern, copied from pilot-b/sheet.mjs @ #278, never imported).
 *  Per drawn id: tier, class, anchor, QA, critic and flags, from rows in this file and the Do 8 report. */
export const SHEET = {
  lib_pendlay_row: { tier: 'A', class: 'hinge row, floor start (H; ruling 4)', anchor: 'barbell_row',
    critic: 'approved, focused recheck 2 @ 8781ed0 (D-LIB13-PANEL2): every median 4 or more', notes: [] },
  lib_landmine_row: { tier: 'A', class: 'landmine rig (landmine anchor; D-LIB13-LANDMINE)', anchor: 'barbell_row',
    critic: 'approved, panel @ 59d3d78 (D-LIB13-PANEL1); bytes unchanged since',
    notes: ['Rig: landmine, new composer. Later user: t_bar_row (held, D-LIB13-TBAR)', 'Plate size: drawing convention (228 mm), the 10 lb plate (D-LIB13-TBAR)'] },
  lib_one_arm_dumbbell_row: { tier: 'C', class: 'bench support (support anchor; D-LIB13-SUPPORT); drawable-fault example', anchor: 'barbell_row',
    critic: 'approved, focused recheck 3 @ a6f4bd0 (D-LIB13-PANEL3): R5 4 [4,3,4]',
    notes: ['Support arm drawn bent: the card puts the hand under the shoulder with the back level, and on a standard body that needs a bent elbow (D-LIB13-ONEARM)',
      'Mistake drawn as the bottom half of c10, the arm never straightening at the bottom (D-LIB13-ONEARM-M)'] },
  lib_dumbbell_romanian_deadlift: { tier: 'A', class: 'hinge, dumbbells (H; HINGE not built)', anchor: 'romanian_deadlift',
    critic: 'approved, panel @ 59d3d78 (D-LIB13-PANEL1); bytes unchanged since', notes: [] },
  lib_conventional_deadlift: { tier: 'A', class: 'hinge, floor start (H; ruling 4)', anchor: 'romanian_deadlift',
    critic: 'approved, panel @ 59d3d78 (D-LIB13-PANEL1); bytes unchanged since', notes: [] },
  lib_sumo_deadlift: { tier: 'A', class: 'hinge, wide stance (H; ruling 4)', anchor: 'romanian_deadlift',
    critic: 'approved, panel @ 59d3d78 (D-LIB13-PANEL1); bytes unchanged since',
    notes: ['A pure side view cannot show the wide stance and turned-out feet, so it reads close to a conventional deadlift with low hips (D-LIB13-PANEL1)',
      "Stance drawn 30 cm apart, toes out 10°: the engine foot has no roll, so c2's 70 cm and 42° cannot be drawn"] },
  lib_back_extension: { tier: 'A', class: 'Roman chair, 45° (romanChair, single use); support class', anchor: 'romanian_deadlift',
    critic: 'approved, recheck @ 423acc1 (D-LIB13-PANEL1); bytes unchanged at 8781ed0 and a6f4bd0',
    notes: ['Support anchor: one_arm_dumbbell_row, shown above (D-LIB13-SUPPORT). Redrawn if that anchor is rejected'] },
  // LIB-13s wave 1 (lib-13s-card; DESIGN.md section 16)
  lib_t_bar_row: { tier: 'A', class: 'landmine rig, second user (H; D-LIB13S-MODES)', anchor: 'barbell_row',
    critic: 'panel mx16 @ 01b66192: R1 and R3 below 4; fix round (handle under the bar, grip square to the forearm), focused recheck next',
    notes: ['Plate size: drawing convention (228 mm), the 10 lb plate (D-LIB13-TBAR)', 'Zoom: normal view, k 1.5, on the handle path (D-LIB13S-ZOOM)',
      'Wrist drawn straight: the card\'s 35° extension of a neutral grip bends out of the side plane (mx16 R3)',
      'Feet 38 cm apart, toes out 17°: the widest stance the engine plants within 0.5 cm; the side view does not show width (D-LIB13S-TBARFEET)'] },
  lib_barbell_shrug: { tier: 'A', class: 'shrug, standing (H; SHRUG not built, D-LIB13S-MODES)', anchor: 'upright_row',
    critic: 'approved, panel mx16 @ 01b66192 (#359 6548509170): every median 4 or more',
    notes: ['Zoom: normal view, k 3.5, on the 5 cm shrug (D-LIB13S-ZOOM)', 'Bar 15 mm in front of the body: the 2 px clearance (D-LIB13S-CLEAR)',
      'Mistake drawn as bent arms (c4): rolling (c3) cannot be drawn (D-LIB13S-TOPFAULT)'] },
};
export const SHEET_HELD = [
  ['dumbbell_shrug', 'LIB-13s wave 2: drawn from barbell_shrug\'s approved bytes (D-LIB13S-WAVES)'],
  ['cable_shrug', 'LIB-13s wave 2: drawn from barbell_shrug\'s approved bytes (D-LIB13S-WAVES)'],
  ['smith_machine_shrug', 'LIB-13s wave 2: drawn from barbell_shrug\'s approved bytes (D-LIB13S-WAVES)'],
];
/** Each open choice with its recommended option (owner delegation of 10-24: the supervisor decides). */
export const SHEET_DECISIONS = [
  { name: 'One-arm row F7', state: 'one_arm_dumbbell_row draws the short range, not its top fault (momentum, seen only as speed; c10). Options: (i) approve F7 as a named drawable-fault exemption; (ii) hold the plate. Recommended: (i), as the curl\'s F7 named yes (D-LIB8M-TF1 4); the drawn fault is the next one on the card\'s own list. Supervisor decides.' },
  { name: 'One-arm support arm', state: 'Drawn bent (D-LIB13-ONEARM): the card\'s hand-under-shoulder (c2) and level back (c4) cannot both hold with a straight arm on the standard body (a 0.42 m chord against a 0.57-0.58 m arm). Options: (i) accept as drawn; (ii) hold until F-LB3-7 finds a sourced straight-arm form. Recommended: (i): card-true, and the panel passed R1 against the ruling. Supervisor decides.' },
  { name: 'Sumo side view', state: 'The side view hides the wide stance and turned-out feet (census view: side). Options: (i) accept the side view; (ii) hold for a front or three-quarter view, not drawn. Recommended: (i): card-true, every critic median 4 or more. Supervisor decides.' },
  { name: 'Pendlay row F2', state: 'pendlay_row\'s figure cover is under the envelope floor (value above): a held hinge where only the arms and bar move. Options: (i) a named exemption; (ii) hold. Recommended: (i), plan 8 decision 9\'s default; a figure is never padded to raise cover. Supervisor decides.' },
  { name: 'Landmine plate size', state: 'landmine_row draws the 10 lb plate (228 mm) as a drawing convention (D-LIB13-TBAR): the largest real plate that passes on this plate. Options: (i) accept; (ii) hold for a larger plate; every larger real plate fails this plate\'s checks (D-LIB13-TBAR). Recommended: (i). Supervisor decides.' },
  { name: 'Support anchor', state: 'one_arm_dumbbell_row anchors the bench-support class; back_extension is its other LB3 user (D-LIB13-SUPPORT). Options: (i) approve the anchor; (ii) reject it, and back_extension is redrawn. Recommended: (i): every item passed at a6f4bd0. Supervisor decides.' },
  { name: 'Landmine anchor', state: 'landmine_row anchors the new landmine rig; its later user t_bar_row is held (D-LIB13-LANDMINE). Options: (i) approve the anchor; (ii) reject it. Recommended: (i): approved in the panel at 59d3d78, bytes unchanged since. Supervisor decides.' },
];
const QA_LINE = {
  F2: f => `Figure cover ${+f.value.toFixed(3)}, approved ${f.range.map(v => +v.toFixed(3)).join('-')}. Named flag (#274 6267110489; D-LIB13S-FLAGS)`,
  F3: f => `Longest leader ${+f.value.toFixed(2)} px, approved ${f.range.map(v => +v.toFixed(2)).join('-')}. Named flag (D-LIB13S-FLAGS)`,
  F4: f => `Hand-placed label boxes ${f.value}, approved ${f.range.join('-')}: every label is placed by the engine. Named flag (D-LIB13S-FLAGS)`,
  F5: f => `Tell contrast ${f.value}, minimum ${f.min} (the selected Mistake tell in Midnight, D-LIB9-F5)`,
  F7: f => `Mistake draws '${f.value}'; the card's top fault is '${f.expect}' (drawable-fault rule; needs a named yes)`,
};
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const SHEET_CSS = `
:root { --wrap: 390px; }
@media (min-width: 832px) { :root { --wrap: 800px; } }
@media (min-width: 1240px) { :root { --wrap: 1200px; } }
.lb3-row { grid-column: 1 / -1; display: grid; grid-template-columns: minmax(0, 390px); gap: 16px; align-items: start; padding-bottom: 24px; border-bottom: 1px solid var(--border-subtle); }
@media (min-width: 832px) { .lb3-row { grid-template-columns: 390px minmax(0, 1fr); } }
.lb3-row.wide { grid-template-columns: minmax(0, 1fr); }
.lb3-aside { display: grid; gap: 12px; min-width: 0; }
.lb3-meta { display: grid; gap: 6px; font-size: var(--fs-small); color: var(--text-2); }
.lb3-meta b { color: var(--text); font-weight: var(--fw-semibold); }
.lb3-flags { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; padding: 0; list-style: none; }
.lb3-flags li { font-size: var(--fs-meta); line-height: var(--lh-meta); padding: 2px 8px; border-radius: var(--radius-pill); border: 1px solid color-mix(in srgb, var(--mistake) 55%, var(--border)); color: var(--text); }
.lb3-shots { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 230px), 1fr)); gap: 12px; }
.lb3-shots figure { display: grid; gap: 4px; margin: 0; }
.lb3-shots figcaption { font-size: var(--fs-cap); line-height: var(--lh-cap); letter-spacing: var(--ls-cap); text-transform: uppercase; font-weight: var(--fw-semibold); color: var(--text-2); }
.lb3-shots img { width: 100%; height: auto; border-radius: var(--radius-lg); border: 1px solid var(--border); }
.lb3-text { margin: 0; max-width: 72ch; font-size: var(--fs-small); line-height: 1.5; color: var(--text); }
.pg-sha { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; overflow-wrap: anywhere; color: var(--pg-text); }
`;
/** PNG data URLs of `ids`' cards in one built page, per [theme, mode]. */
async function pageShots(browser, html, ids, cells) {
  const { openGolden, settle } = await import('../../fidelity/harness.mjs'), out = {};
  for (const [theme, mode] of cells) {
    const { ctx, page } = await openGolden(browser, theme, { viewport: { width: 390, height: 844 }, html });
    try {
      for (const cid of ids) {
        if (mode === 'mistake') { await page.click(`#${cid}-mistake`); await settle(page); }
        (out[cid] ??= {})[`${theme}-${mode}`] = `data:image/png;base64,${(await page.locator(`#card-${cid}`).screenshot()).toString('base64')}`;
        if (mode === 'mistake') { await page.click(`#${cid}-mistake`); await settle(page); }
      }
    } finally { await ctx.close(); }
  }
  return out;
}
/** One build of the LB3 owner sheet. The Do 8 report runs on the same page bytes; every card on the sheet is
 *  byte-identical to the plates page's card. qa.mjs passes its own functions (no import cycle). Returns { html, pageSha, sheetSha, flags, table }. */
export async function buildOwnerSheet({ qaLb3, flagProblems, tableOf }) {
  const { HARD } = await import('../qa/index.mjs'), { launch } = await import('../qa/browser.mjs');
  const ids = drawnIds(), data = read(ROOT, LB3_ROWS), all = lb3All(), cid = id => data.rows[id].chromeId;
  if (ids.length !== Object.keys(SHEET).length || ids.some(id => !SHEET[id])) throw new Error(`sheet rows: ${ids.join(', ')}`);
  const { html: plates } = await buildLb3Page({ all, ids }), pageSha = sha256(plates);
  const browser = await launch();
  let qa, shots, anchors;
  try {
    qa = await qaLb3({ ids, all, browser });
    if (qa.sha !== pageSha) throw new Error(`Do 8 report ran on page ${qa.sha}, this page is ${pageSha}`);
    const bad = [...flagProblems(qa.reports), ...qa.reports.flatMap(r => HARD.filter(h => !r.hard[h].pass).map(h => `${r.id} ${h}`))];
    if (bad.length) throw new Error(`Do 8 report: ${bad.join('; ')}`);
    shots = await pageShots(browser, plates, ids.map(cid), [['silent-black', 'mistake'], ['paper', 'normal'], ['paper', 'mistake']]);
    const anchorIds = [...new Set(ids.map(id => `lib_${SHEET[id].anchor}`))];
    const { html: ah } = await buildPlatesPage(await groupsConfig({ groups: [{ id: 'anchors', title: 'Anchors', ids: anchorIds }] }, rows(), 'anchors'));
    anchors = await pageShots(browser, ah, anchorIds.map(i => i.slice(4).replace(/_/g, '-')), [['silent-black', 'normal']]);
  } finally { await browser.close(); }
  const rep = Object.fromEntries(qa.reports.map(r => [r.id, r]));
  const cfg = await groupsConfig({ groups: ['A', 'C'].map(t => ({ id: `tier-${t.toLowerCase()}`, title: `Tier ${t}`, ids: ids.filter(id => SHEET[id].tier === t) })) }, all, LB3_ROWS);
  cfg.heading = { ...cfg.heading, title: 'M/ARC Library Plates · LB3 sheet', kicker: 'M/ARC · How to do it · Library LB3', h1: `LB3 · ${ids.length} plates`,
    intro: `Each row: the plate as it will ship (live), its Mistake, a Paper thumbnail and Mistake, the pilot A anchor and every flag. Plates page sha256 <span class="pg-sha">${pageSha}</span> (${plates.length.toLocaleString('en')} B); the cards on this sheet are byte-identical to that page.${SHEET_HELD.map(([id, why]) => `</p><p>Held off this sheet: ${id.replace(/_/g, ' ')}. ${esc(why)}.`).join('')}`,
    foot: 'LB3 sheet for review. Drawings are computed by our own code from the verified research cards.' };
  let sheet = (await buildPlatesPage(cfg)).html.toString().replace('</style>', `${SHEET_CSS}</style>`);
  // Owner decision LR-23 (2026-09-30): no Sources section on a sheet
  const src = sheet.match(/\n  <details id="sources">[\s\S]*?<\/details>/g);
  if (src?.length !== 1) throw new Error('sheet: the sources list was not found exactly once');
  sheet = sheet.replace(src[0], '');
  const fig = (url, alt, cap) => `<figure><img class="shot" alt="${esc(alt)}" src="${url}"><figcaption>${esc(cap)}</figcaption></figure>`;
  const flags = {};
  for (const id of ids) {
    const r = rep[id], s = SHEET[id], c = cid(id), sh = shots[c], an = s.anchor.replace(/_/g, ' ');
    const raised = Object.keys(r.flags).filter(k => r.flags[k].raised).sort();
    flags[id] = raised;
    const lines = [...raised.map(k => ({ k, t: QA_LINE[k](r.flags[k]) })), ...s.notes.map(t => ({ k: 'Note', t }))];
    const aside = `<aside class="lb3-aside" aria-label="${esc(id.slice(4).replace(/_/g, ' '))}: review notes">
  <div class="lb3-meta"><span><b>Tier ${s.tier}</b> · ${esc(s.class)}</span><span>Anchor: <b>${esc(an)}</b> (pilot A, pinned)</span><span>Plate QA: <b>all ${HARD.length} hard checks pass</b></span><span>Critic: ${esc(s.critic)}</span></div>
  <ul class="lb3-flags">${lines.map(l => `<li><b>${l.k}</b> ${esc(l.t)}</li>`).join('')}</ul>
  <div class="lb3-shots">
    ${fig(sh['silent-black-mistake'], `${id}: Mistake, Silent Black`, 'Mistake')}
    ${fig(anchors[s.anchor.replace(/_/g, '-')]['silent-black-normal'], `Anchor plate: ${an}`, `Anchor · ${an}`)}
    ${fig(sh['paper-normal'], `${id}: Paper theme`, 'Paper · normal')}
    ${fig(sh['paper-mistake'], `${id}: Paper theme, Mistake`, 'Paper · Mistake')}
  </div>
</aside>`;
    const re = new RegExp(`(<article class="sheet-card" id="card-${c}"[\\s\\S]*?</article>)`);
    if (!re.test(sheet)) throw new Error(`${c}: card not found in the sheet`);
    sheet = sheet.replace(re, `<div class="lb3-row" id="row-${c}">$1${aside}</div>`);
  }
  const dec = SHEET_DECISIONS.map((d, i) => `<div class="lb3-row wide" id="row-decision-${i + 1}"><aside class="lb3-aside" aria-label="${esc(d.name)}"><div class="lb3-meta"><span><b>${esc(d.name)}</b></span></div><p class="lb3-text">${esc(d.state)}</p></aside></div>`);
  const end = sheet.lastIndexOf('\n</main>');
  if (end < 0) throw new Error('sheet: </main> not found');
  sheet = `${sheet.slice(0, end)}\n<section class="group" id="group-decisions" aria-labelledby="group-decisions-title"><h2 class="group-title" id="group-decisions-title">Decisions</h2>\n${dec.join('\n')}\n</section>${sheet.slice(end)}`;
  const cards = h => new Map([...h.matchAll(/<article class="sheet-card" id="card-([a-z0-9-]+)"[\s\S]*?<\/article>/g)].map(m => [m[1], m[0]]));
  const A = cards(plates.toString()), B = cards(sheet);
  if (A.size !== ids.length || B.size !== ids.length) throw new Error(`cards: plates page ${A.size}, sheet ${B.size}, ids ${ids.length}`);
  for (const [k, bytes] of A) if (B.get(k) !== bytes) throw new Error(`${k}: sheet card differs from the plates page`);
  return { html: sheet, pageSha, sheetSha: sha256(sheet), flags, table: tableOf(qa.reports) };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1] && process.argv[2] === '--shots') {
  const [theme = 'paper', ...ids] = process.argv.slice(3);
  for (const { path } of await mistakeShots({ theme, ...(ids.length ? { ids } : {}) })) console.log(path);
} else if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = mkdtempSync(join(tmpdir(), 'lb3-page-')), shas = [];
  for (const n of [1, 2]) {
    const { html, warnings } = await buildLb3Page();
    if (warnings) console.error(warnings.trim());
    writeFileSync(join(dir, `lb3-plates-${n}.html`), html);
    shas.push(sha256(html));
    console.log(`build ${n}: ${sha256(html)} (${html.length} B) ${join(dir, `lb3-plates-${n}.html`)}`);
  }
  console.log(`ids: ${drawnIds().join(', ')}`);
  console.log(shas[0] === shas[1] ? `PQ-H7 page: identical, sha256 ${shas[0]}` : 'PQ-H7 page: the two builds DIFFER');
  if (shas[0] !== shas[1]) process.exit(1);
}
