// LIB-5 (D-LIB5-GATE): the one refusal point for library How-to content. It runs after content.mjs and, like every
// plugin, before render() writes anything (generate.mjs), so a refusal here blocks every output. It never reads
// ctx.prev: rows come from the registry and content from content.mjs's loadContent. content.mjs, ids.mjs, generate.mjs
// and lib/** stay byte-unchanged. Until Do 9 it writes no file (outputs() returns []); from Do 9 it writes only
// src/howto/red-flag-back.ts. First, one label per fault key over every shipped row, LIB-5's shared modules and any
// hand-*.mjs (D-LIB5-FAMILY rule (a), D-LIB5-FAULTKEYS 4). Then per shipped row: the back-box refusal (S4-P), the family
// refusal (D-LIB5-FAMILY), then, for a library row only, the library lint (D-LIB5-REACH, D-LIB5-WORDS); the 8 are linted
// by the vitest sweep.
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from '../lib/inputs.mjs';
import { inputs as contentInputs, loadContent } from './content.mjs';
import { registryInputs, shippedRows, sourceOf } from '../library/registry.mjs';
import { refuseBack } from '../library/shared/back-box.mjs';
import { cardReader, familyRefusal, lintLibraryRow } from '../library/lint/index.mjs';
import { HANDS_DIR, SHARED_MODULES, treeFamily } from '../library/lint/family.mjs';

export const after = ['tools/plates/gen/content.mjs'];

const BACK_BOX = 'tools/plates/library/shared/back-box.mjs';
const BACK_CARD = 'docs/research/howto/shared/back-pain-box.json';
const CARDS = 'docs/research/howto/shared';
const OWN = ['tools/plates/gen/library-gate.mjs', BACK_BOX, 'tools/plates/library/lint/index.mjs', 'tools/plates/library/lint/family.mjs',
  'tools/plates/library/shared/card.mjs', ...SHARED_MODULES, 'tools/plates/layers/artifact/copy-lint.mjs', 'tools/plates/layers/howto/shared.mjs'];
const dirFiles = (d, re) => (existsSync(join(ROOT, d)) ? readdirSync(join(ROOT, d)).filter(n => re.test(n)).sort().map(n => `${d}/${n}`) : []);

/** Every file the plugin reads: its own modules, the shared cards and every module under hands/ (hand-*.mjs and what they import there). */
export const inputs = () => [...new Set([...OWN, ...dirFiles(CARDS, /\.json$/).filter(p => p !== BACK_CARD), ...dirFiles(HANDS_DIR, /\.mjs$/),
  ...registryInputs(), ...contentInputs()])];

/** The inputs of the one file it writes from Do 9: back-box.mjs, its static imports (none) and the back-box card. */
export const inputsFor = path => (path === 'src/howto/red-flag-back.ts' ? [BACK_BOX, BACK_CARD] : undefined);

export async function outputs() {
  const shared = await import(pathToFileURL(join(ROOT, 'tools/plates/layers/howto/shared.mjs')).href), readCard = cardReader(ROOT);
  const rows = shippedRows(), mods = await Promise.all(rows.map(async r => ({ src: r.id, M: await import(pathToFileURL(join(ROOT, sourceOf(r.id))).href) })));
  const fam = await treeFamily(mods, ROOT);
  if (fam.problems.length) throw new Error(`library family (rows ${fam.counts.eight}, shared ${fam.counts.shared}, hands ${fam.counts.hands}):\n  ${fam.problems.map(b => `${b.path}: ${b.rule}${b.detail ? ` (${b.detail})` : ''}`).join('\n  ')}`);
  for (const [i, row] of rows.entries()) {
    const { content } = await loadContent(row.id);
    refuseBack(row.id, content.riskFlags);
    const refused = familyRefusal(row.id, content, readCard);
    if (refused) throw new Error(refused);
    if (row.mode === 'golden') continue;
    const bad = lintLibraryRow(mods[i].M, shared);
    if (bad.length) throw new Error(`${row.id}: library lint:\n  ${bad.map(b => `${b.path}: ${b.rule}${b.detail ? ` (${b.detail})` : ''}`).join('\n  ')}`);
  }
  return [];
}
