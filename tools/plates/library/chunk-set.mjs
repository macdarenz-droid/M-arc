// LIB-4a (D-LIB4-A9, D-LIB4-A4): the exact How-to chunk sets, shared by HT-2 A9 (the gate) and HT-10 A4 (ht10.mjs).
// A name is credited to a row only by an anchored match (`^ht-<slug>-<8>.js$`), never by a prefix, so a stray chunk
// such as ht-leg-press-calf-raise-* cannot pass on leg press's slug. Build and gate time only; never bundled.

export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const anchored = (kind, key) => new RegExp(`^${kind}-${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-[\\w-]{8}\\.js$`);

/** Problems (strings) unless every row's slug is valid and owns exactly one ht- chunk, and every ht-*.js file
 *  belongs to exactly one row; any other ht- file (another extension) is a problem too. `files`: asset file names;
 *  `rows`: registry rows with `id` and `slug`. */
export function htChunkProblems(files, rows) {
  const problems = [], ht = files.filter(f => /^ht-.*\.js$/.test(f)), owners = new Map(ht.map(f => [f, []]));
  for (const f of files) if (/^ht-/.test(f) && !owners.has(f)) problems.push(`unexpected How-to file ${f} (not a .js chunk)`);
  const bySlug = new Map();
  for (const r of rows) {
    if (typeof r.slug !== 'string' || !SLUG.test(r.slug)) { problems.push(`${r.id}: slug ${JSON.stringify(r.slug)} is not ${SLUG}`); continue; }
    if (bySlug.has(r.slug)) problems.push(`${r.id}: slug ${r.slug} is also ${bySlug.get(r.slug)}'s`);
    bySlug.set(r.slug, r.id);
    const re = anchored('ht', r.slug), mine = ht.filter(f => re.test(f));
    if (mine.length !== 1) problems.push(`${r.id}: expected one ht-${r.slug}-*.js chunk, found ${mine.join(', ') || 'none'}`);
    for (const f of mine) owners.get(f).push(r.id);
  }
  for (const [f, ids] of owners) {
    if (ids.length === 0) problems.push(`unexpected How-to chunk ${f} (no shipped row owns it)`);
    else if (ids.length > 1) problems.push(`${f} is owned by ${ids.length} rows: ${ids.join(', ')}`);
  }
  return problems;
}

/** Problems unless the hand-*.js set is exactly one `^hand-<chromeId>-<8>.js$` per chromeId given (the 8's), and no
 *  other hand- file exists. handpair-* (library hands) is not hand-*. */
export function handChunkProblems(files, chromeIds) {
  const problems = [], hand = files.filter(f => /^hand-.*\.js$/.test(f)), used = new Set();
  for (const f of files) if (/^hand-/.test(f) && !/\.js$/.test(f)) problems.push(`unexpected hand file ${f} (not a .js chunk)`);
  for (const c of chromeIds) {
    const re = anchored('hand', c), mine = hand.filter(f => re.test(f));
    if (mine.length !== 1) problems.push(`${c}: expected one hand-${c}-*.js chunk, found ${mine.join(', ') || 'none'}`);
    for (const f of mine) used.add(f);
  }
  for (const f of hand) if (!used.has(f)) problems.push(`unexpected hand chunk ${f} (not one of the 8's hand-<chromeId>-*.js)`);
  return problems;
}
