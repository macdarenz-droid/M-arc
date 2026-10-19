// LIB-7c sheet (hands/DESIGN.md §10; D-LIB7c-SCOPE): LIB-7's buildSheet on copies of the LIB-7c key modules, each with
// CLAIMS_TEXT attached from lib7c-claims.json (sheet.mjs:47-49), plus the labelled golden-B references LIB-7's sheet has
// no archetype entry for: the hang beside pull_up/p1, the V-handle beside seated_cable_row. Never `calibrate: true`.
//   node tools/plates/library/hands/lib7c-sheet.mjs <out dir> [--critic] [--plant plant.json] [--anchors anchors.json] [--chromium <path>]
// --anchors [[id, page|null], [id, page|null]]: the supervisor's two golden-B pages, inserted unlabelled as sheet.mjs:83-87
// does; the key goes to <out>/calibration-key.json, never onto the sheet. A page that is also a labelled reference is
// refused.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { esc } from '../render/closeup/common.mjs';
import { MODULES, ROOT } from './pairs.mjs';
import { pageHtml } from './page.mjs';
import { approvedHand, buildSheet, REFERENCE } from './sheet.mjs';

export const CLAIMS = JSON.parse(readFileSync(new URL('./lib7c-claims.json', import.meta.url), 'utf8'));
/** Labelled references by the tile's first id: [golden-B id, page, label]. The hang's flag is the variant's own (V.flags). */
export const LABELLED = {
  chin_up: ['pull_up', 'p1', 'hang'],
  close_grip_pulldown: ['seated_cable_row', undefined, 'V-handle'],
};
for (const id of ['hanging_knee_raise', 'assisted_pull_up']) LABELLED[id] = LABELLED.chin_up;
const pageOf = (id, page) => `${id}${page ? `/${page}` : ''}`;
/** Every page the sheet shows labelled: these and buildSheet's closest-approved page of each drawn archetype. */
export const referencePages = (mods = MODULES) => new Set([...Object.values(LABELLED).map(([id, page]) => pageOf(id, page)),
  ...sheetMods(mods).flatMap(m => Object.values(m.VARIANTS ?? {}).map(V => REFERENCE[V.archetype])).filter(Boolean).map(([id, page]) => pageOf(id, page))]);
/** Copies of the LIB-7c modules with their claim texts (the module files are untouched). */
export const sheetMods = (mods = MODULES) => mods.filter(m => m.OWNER === 'LIB-7c').map(m => ({ ...m, CLAIMS_TEXT: CLAIMS.claims }));
const prefixed = (svg, p) => svg.replace(/id="([^"]+)"/g, `id="${p}-$1"`).replace(/#([a-z][\w-]*)/g, `#${p}-$1`);

export async function buildLib7cSheet({ critic = false, plants = [], anchors = [], mods = MODULES } = {}) {
  if (anchors.length && anchors.length !== 2) throw new Error(`lib7c sheet: ${anchors.length} anchors, expected 2`);
  const shown = referencePages(mods);
  for (const [id, page] of anchors) if (shown.has(pageOf(id, page))) throw new Error(`lib7c sheet: anchor ${pageOf(id, page)} is a labelled reference`);
  const { body } = await buildSheet({ critic, plants, mods: sheetMods(mods) });
  const [head, ...tiles] = body.split('<section class="tile">'), key = [];
  for (const [i, t] of tiles.entries()) {
    const first = t.match(/<p class="ids">([a-z0-9_]+)/)?.[1], L = LABELLED[first];
    if (!L) continue;
    const [id, page, label] = L, ref = `<p class="lab">Approved ${esc(label)} (${esc(pageOf(id, page))})</p><div class="hand-plate ref">${prefixed(await approvedHand(id, page), `l${i}`)}</div>`;
    tiles[i] = t.replace('<p class="lab">Flags</p>', `${ref}<p class="lab">Flags</p>`);
  }
  const rows = tiles.map(t => `<section class="tile">${t}`);
  for (const [n, [id, page]] of anchors.map((a, j) => [j ? 'B' : 'A', a])) {
    key.push({ tile: `Pair ${n}`, approved: pageOf(id, page) });
    const at = 1 + (n === 'A' ? Math.floor(rows.length / 3) : Math.floor(2 * rows.length / 3));
    rows.splice(at, 0, `<section class="tile"><h2>Pair ${n}</h2><div class="hand-plate">${prefixed(await approvedHand(id, page), `c${n}`)}</div></section>`);
  }
  return { body: head.replace('Hand pairs (LIB-7)', 'Hand pairs (LIB-7c)') + rows.join(''), key };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2), out = resolve(args[0] ?? 'out/lib7c-sheet'), at = f => args.indexOf(f);
  const json = f => at(f) >= 0 ? JSON.parse(readFileSync(args[at(f) + 1], 'utf8')) : [];
  const { body, key } = await buildLib7cSheet({ critic: args.includes('--critic'), plants: json('--plant'), anchors: json('--anchors') });
  mkdirSync(out, { recursive: true });
  if (key.length) writeFileSync(join(out, 'calibration-key.json'), JSON.stringify(key, null, 1));
  const { chromium } = createRequire(join(ROOT, 'package.json'))('playwright');
  const browser = await chromium.launch({ executablePath: at('--chromium') >= 0 ? args[at('--chromium') + 1] : '/opt/pw-browsers/chromium' });
  try {
    for (const [theme, scheme] of [['silent-black', 'dark'], ['paper', 'light']]) {
      const file = join(out, `lib7c-${theme}.html`);
      writeFileSync(file, pageHtml(body, theme));
      const p = await browser.newPage({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 2, colorScheme: scheme });
      await p.goto(pathToFileURL(file).href); await p.evaluate(() => document.fonts.ready);
      await p.screenshot({ path: join(out, `lib7c-${theme}.png`), fullPage: true });
      await p.close();
    }
  } finally { await browser.close(); }
  console.log(`lib7c sheet: ${out}`);
}
