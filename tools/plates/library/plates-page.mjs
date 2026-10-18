// LIB-2 (design 2.7, 8.2): a plates page config built from the registry. A page file (pages/<page>.json) names its
// groups by library id, in order; each id's spec comes from its registry row: the vendored golden-A spec for the 8
// (`ref-src` is the lateral raise, `exercises/<x>.mjs` is <x>), the library spec file for a library row. The 8 keep
// golden A's own source lines. build-page.mjs (LIB-8's blob, unchanged) builds the bytes.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../lib/inputs.mjs';
import { goldenAConfig } from './build-page.mjs';
import { rows } from './registry.mjs';

/** The vendored builder's spec id for a golden row (its `exercises/<id>.mjs`, or `lateral_raise` for ref-src). */
export const specIdOf = row => (row.src === 'ref-src' ? 'lateral_raise' : row.src.replace(/^exercises\//, '').replace(/\.mjs$/, ''));

/** A library row's card id in both page builders: its chromeId with underscores. */
export const cardIdOf = row => row.chromeId.replace(/-/g, '_');

/** { groups, sources, specs } for buildPlatesPage, from a page file and the registry rows. Refuses an empty page and an
 *  id the registry does not hold. */
export async function pageConfig(pageFile, all = rows()) {
  const page = JSON.parse(readFileSync(join(ROOT, pageFile), 'utf8'));
  return groupsConfig(page, all, pageFile);
}

/** The same config from page data ({ groups: [{ id, title, ids }], heading? }); `where` names it in errors. LIB-2b: a
 *  D/T candidate rebuilds its parent alone with it (candidate.mjs). */
export async function groupsConfig(page, all = rows(), where = 'page') {
  const ids = (page.groups ?? []).flatMap(g => g.ids ?? []);
  if (ids.length === 0) throw new Error(`plates-page: ${where} names no ids`);
  const byId = new Map(all.map(r => [r.id, r])), golden = await goldenAConfig();
  const specs = {}, sources = {};
  const specOf = id => {
    const r = byId.get(id);
    if (!r) throw new Error(`plates-page: ${where}: ${id} has no registry row`);
    if (r.mode === 'golden') { const s = specIdOf(r); sources[s] = golden.sources[s]; return s; }
    // the vendored builder names a card and its svg ids from the spec key (`_` -> `-`), so a library spec is keyed by its
    // chromeId with underscores: card-<chromeId>, as for the 8 (D-LIB2b-CARDID; LIB-6's layers pages use the same key)
    const s = cardIdOf(r);
    specs[s] = join(ROOT, 'tools/plates', r.src);
    sources[s] = r.sources ?? [];
    return s;
  };
  const groups = page.groups.map(g => ({ id: g.id, title: g.title, ids: g.ids.map(specOf) }));
  return { groups, sources, specs, heading: page.heading ?? golden.heading };
}
