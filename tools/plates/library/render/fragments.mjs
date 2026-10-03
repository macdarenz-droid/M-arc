// LIB-6: the close-up fragments of a layers page (plan 2.6 acceptance). Per card: `panels`, the card's close-up
// panels (its contiguous `<div class="zx" id="<card>-zoom-…">` blocks), and `css`, its scoped close-up rules (the
// `/* close-ups: … */` block up to the blank line that ends it). Cut from the page's bytes; nothing is re-serialized.

/** The whole element starting at `start` (a `<div`), by balanced div tags. */
export function divAt(html, start) {
  const re = /<div\b|<\/div>/g;
  re.lastIndex = start;
  let d = 0;
  for (let m; (m = re.exec(html));) { d += m[0] === '</div>' ? -1 : 1; if (!d) return html.slice(start, m.index + 6); }
  throw new Error(`fragments: unclosed div at ${start}`);
}

/** The card's close-up panels, exactly as the page holds them. Throws when there are none or they are not contiguous. */
export function panelsOf(html, card) {
  const open = `<div class="zx" id="${card}-zoom-`;
  let at = html.indexOf(open);
  if (at < 0) throw new Error(`fragments: ${card}: no close-up panel`);
  const start = at;
  let end = at;
  while (at >= 0 && at === end) { end = at + divAt(html, at).length; at = html.indexOf(open, end); }
  if (at >= 0) throw new Error(`fragments: ${card}: close-up panels are not contiguous`);
  return html.slice(start, end);
}

/** The card's scoped close-up CSS block (comment line through the rules' last newline). */
export function cssOf(html, card) {
  const scope = `.hx-${card} `;
  const blocks = [...html.matchAll(/\/\* close-ups: [^*]*\*\/\n/g)].filter(m => html.startsWith(scope, m.index + m[0].length));
  if (blocks.length !== 1) throw new Error(`fragments: ${card}: ${blocks.length} close-up CSS blocks`);
  const a = blocks[0].index, b = html.indexOf('\n\n', a);
  if (b < 0) throw new Error(`fragments: ${card}: unterminated close-up CSS block`);
  const css = html.slice(a, b + 1);
  for (const line of css.split('\n').slice(1, -1)) if (!line.startsWith(scope)) throw new Error(`fragments: ${card}: unscoped close-up rule ${line.slice(0, 60)}`);
  return css;
}

/** Every listed card's close-up fragments. */
export function closeupFragments(html, cards) {
  return Object.fromEntries(cards.map(c => [c, { panels: panelsOf(html, c), css: cssOf(html, c) }]));
}

/** Where two fragment sets differ: one line per card and part, with the first differing byte offset. [] = identical. */
export function fragmentDiff(got, want) {
  const out = [];
  for (const card of Object.keys(want)) for (const part of ['panels', 'css']) {
    const a = got[card]?.[part], b = want[card][part];
    if (a === b) continue;
    if (a === undefined) { out.push(`${card}.${part}: missing`); continue; }
    let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
    out.push(`${card}.${part}: differs at byte ${i} (${a.length} vs ${b.length} chars)`);
  }
  for (const card of Object.keys(got)) if (!(card in want)) out.push(`${card}: not in golden B`);
  return out;
}
