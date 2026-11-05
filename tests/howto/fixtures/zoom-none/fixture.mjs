// F-ZOOM-NONE A1 fixture (#388, PLAN RULED): LIB-2b's scratch row (tests/howto/fixtures/lib2b) made a zero-zoom row in a
// temp repo copy. Its sheet keeps the hand zoom and drops the posture zooms (and every reference to them), its fixture
// page loses the card's posture close-ups, its scratch research card names those two posture zooms, and
// tools/plates/library/text-zooms.json rules them text checkpoints. Never pinned or shipped in the repo itself.
import { readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CARD_FILE, CHROME, HOWTO, ID, PAGE_FIXTURE, fixtureTree } from '../lib2b/fixture.mjs';
import { divAt } from '../../../../tools/plates/gen/hands.mjs';
import { writeScratchStamps } from '../../../../tools/plates/library/research/stamps.mjs';

export const TEXT_ZOOMS = 'tools/plates/library/text-zooms.json';
export const BASE_HOWTO = HOWTO.replace(/\.howto\.mjs$/, '.base.mjs');
/** The card zooms the fixture rules text checkpoints, with the sheet checkpoint that carries each. */
export const CHECKPOINTS = { shoulders: 'hang', top: 'top' };
export const ENTRY = { ruling: 'D-SHIP-TEXTZOOM', checkpoints: CHECKPOINTS };

/** The fixture page with the row's posture close-ups cut out of its card, and every control that opens one (chips,
 *  setup, mistake and feel "Show me" buttons), as a page built from the zero-zoom sheet has it. The hand stays. */
export function zeroZoomPage(page = readFileSync(PAGE_FIXTURE, 'utf8'), { keep } = {}) {
  // keep: 'panel' leaves the `top` close-up on the page, 'button' leaves one control that opens it (the page-check reds)
  for (const k of Object.keys(CHECKPOINTS).filter(k => !(keep === 'panel' && k === 'top'))) {
    const at = page.indexOf(`<div class="zx" id="${CHROME}-zoom-${k}" data-zoom="${k}"`);
    if (at < 0 || page.indexOf(`<div class="zx" id="${CHROME}-zoom-${k}"`, at + 1) >= 0) throw new Error(`zoom-none fixture: ${k} close-up not found once`);
    page = page.replace(divAt(page, at), '');
  }
  const re = new RegExp(`<button[^<>]*data-zoom="(?:${Object.keys(CHECKPOINTS).join('|')})"[^<>]*>[\\s\\S]*?<\\/button>`, 'g');
  if (!(page.match(re)?.length)) throw new Error('zoom-none fixture: no control opens the dropped close-ups');
  if (keep === 'button') { let first = true; return page.replace(re, m => (first && /data-zoom="top"/.test(m) ? ((first = false), m) : '')); }
  return page.replace(re, '');
}
/** The zero-zoom sheet: the staged clone renamed to BASE_HOWTO, re-exported with its posture zooms and their references dropped. */
export const WRAPPER = () => `// F-ZOOM-NONE fixture: the LIB-2b clone with no posture zoom (its card zooms are ruled text checkpoints).
import base from './${BASE_HOWTO.split('/').pop()}';
export * from './${BASE_HOWTO.split('/').pop()}';
const zeroZoomOf = ${zeroZoomOf.toString()};
export default zeroZoomOf(base);
`;
/** The temp tree. `entry`: the text-zooms entry (null leaves the list empty); `card`: the card's posture zooms. */
export function zeroZoomTree({ entry = ENTRY, cardZooms = Object.keys(CHECKPOINTS), keep } = {}) {
  const root = fixtureTree({ page: zeroZoomPage(undefined, { keep }) });
  renameSync(join(root, HOWTO), join(root, BASE_HOWTO));
  writeFileSync(join(root, HOWTO), WRAPPER());
  const card = JSON.parse(readFileSync(join(root, CARD_FILE), 'utf8'));
  writeFileSync(join(root, CARD_FILE), `${JSON.stringify({ ...card, zooms: cardZooms.map(key => ({ key, kind: 'posture', right: 'x', wrong: 'y', claim: 'c1' })) }, null, 2)}\n`);
  const list = JSON.parse(readFileSync(join(root, TEXT_ZOOMS), 'utf8'));
  writeFileSync(join(root, TEXT_ZOOMS), `${JSON.stringify({ ...list, entries: entry ? { [ID]: entry } : {} }, null, 1)}\n`);
  writeScratchStamps(root, [ID]);   // the stamps hash the sheet, which changed above
  return root;
}
/** Removes the guard in a tree's gen/zooms.mjs (red 3): the library loop runs today's posturePanels for every row. */
export function guardOff(root) {
  const f = join(root, 'tools/plates/gen/zooms.mjs'), s = readFileSync(f, 'utf8'), a = '      if (ruled) {';
  if (s.split(a).length !== 2) throw new Error('zoom-none fixture: guard anchor not found once');
  writeFileSync(f, s.replace(a, '      if (false) {'));
}

/** The gate route's edit (self-contained: its source runs in the browser wrapper): drops every posture-kind zoom, every
 *  `zoom` link to one and its chip. What a ruled zero-zoom sheet looks like to the app. */
export function zeroZoomOf(d) {
  const drop = new Set((d.zooms ?? []).filter(z => z.kind !== 'hand').map(z => z.key));
  const strip = x => Array.isArray(x) ? x.map(strip)
    : x && typeof x === 'object' && Object.getPrototypeOf(x) === Object.prototype
      ? Object.fromEntries(Object.entries(x).filter(([k, v]) => !(k === 'zoom' && drop.has(v))).map(([k, v]) => [k, strip(v)]))
      : x;
  const out = { ...d };
  for (const k of ['setup', 'posture', 'mistakes', 'feel']) if (k in d) out[k] = strip(d[k]);
  out.zooms = d.zooms.filter(z => !drop.has(z.key));
  if (d.chips) out.chips = d.chips.filter(k => !drop.has(k));
  return out;
}
