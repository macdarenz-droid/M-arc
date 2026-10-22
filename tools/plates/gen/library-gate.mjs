// LIB-5 (D-LIB5-GATE): the one refusal point for library How-to content. It runs after content.mjs and, like every
// plugin, before render() writes anything (generate.mjs), so a refusal here blocks every output. It never reads
// ctx.prev: rows come from the registry and content from content.mjs's loadContent. content.mjs, ids.mjs, generate.mjs
// and lib/** stay byte-unchanged. It writes only src/howto/red-flag-back.ts (RED_FLAG_BACK, Do 9): the owner-approved
// back box from back-box.mjs, after the box passes the library box reach under its BOX-CAP key. First, one label per
// fault key over every shipped row, LIB-5's shared modules and any hand-*.mjs (D-LIB5-FAMILY rule (a), D-LIB5-FAULTKEYS
// 4). Then per shipped row: the family refusal (D-LIB5-FAMILY), the variant line (LIB-5v, every row), then, for a library row only, the library lint with the
// back box as an extra box (D-LIB5-REACH, D-LIB5-WORDS); the 8 are linted by the vitest sweep. After the loop, the C15 stamp gate (D-LIB5-STAMPS): every shipped row needs a reviews.json entry
// matching its content hash, and a missing, unparsable or empty file fails every row.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from '../lib/inputs.mjs';
import { inputs as contentInputs, loadContent } from './content.mjs';
import { EXERCISES_JSON, registryInputs, shippedRows, sourceOf } from '../library/registry.mjs';
import { BACK_BOX_KEY, backBox } from '../library/shared/back-box.mjs';
import { backBoxRules, boxReach, cardReader, familyRefusal, lintLibraryRow, variantLine, variantLineOf } from '../library/lint/index.mjs';
import { sourceNamePatterns } from '../layers/artifact/copy-lint.mjs';
import { HANDS_DIR, SHARED_MODULES, treeFamily } from '../library/lint/family.mjs';
import { REVIEWS, stampProblems } from '../library/research/stamps.mjs';

export const after = ['tools/plates/gen/content.mjs'];

const BACK_BOX = 'tools/plates/library/shared/back-box.mjs';
const BACK_CARD = 'docs/research/howto/shared/back-pain-box.json';
const CARDS = 'docs/research/howto/shared';
const OWN = ['tools/plates/gen/library-gate.mjs', BACK_BOX, BACK_CARD, 'tools/plates/library/lint/index.mjs', 'tools/plates/library/lint/box-caps.mjs', 'tools/plates/library/lint/family.mjs',
  'tools/plates/library/shared/card.mjs', ...SHARED_MODULES, 'tools/plates/layers/artifact/copy-lint.mjs', 'tools/plates/layers/howto/shared.mjs',
  'tools/plates/library/research/stamps.mjs', REVIEWS, 'tests/howto/golden/GOLDEN.json'];
const dirFiles = (d, re) => (existsSync(join(ROOT, d)) ? readdirSync(join(ROOT, d)).filter(n => re.test(n)).sort().map(n => `${d}/${n}`) : []);

/** Every file the plugin reads: its own modules, the shared cards and every module under hands/ (hand-*.mjs and what they import there). */
export const inputs = () => [...new Set([...OWN, ...dirFiles(CARDS, /\.json$/).filter(p => p !== BACK_CARD), ...dirFiles(HANDS_DIR, /\.mjs$/),
  ...registryInputs(), ...contentInputs()])];

const OUT = 'src/howto/red-flag-back.ts';
/** The inputs of the one file it writes: back-box.mjs, its static imports (node:* only) and the back-box card. */
export const inputsFor = path => (path === OUT ? [BACK_BOX, BACK_CARD] : undefined);

/** src/howto/red-flag-back.ts's text (generate.mjs adds the GENERATED header). */
export const backModuleText = block => `import type { RedFlagBlock } from './content-types';

// GENERATED from docs/research/howto/shared/back-pain-box.json through tools/plates/library/shared/back-box.mjs (LIB-5
// Do 9): the back-pain red-flag box, owner-approved (decision 6, option 1). It is not in archetypes.ts (HT5-A5).
export const RED_FLAG_BACK: RedFlagBlock = ${JSON.stringify(block, null, 2)};
`;

export async function outputs() {
  const shared = await import(pathToFileURL(join(ROOT, 'tools/plates/layers/howto/shared.mjs')).href), readCard = cardReader(ROOT);
  const back = backBox(ROOT), reach = [...boxReach('RED_FLAG_BACK', back, [], BACK_BOX_KEY), ...backBoxRules('RED_FLAG_BACK', back)];
  if (reach.length) throw new Error(`back box: library lint:\n  ${reach.map(b => `${b.path}: ${b.rule}${b.detail ? ` (${b.detail})` : ''}`).join('\n  ')}`);
  const rows = shippedRows(), mods = await Promise.all(rows.map(async r => ({ src: r.id, M: await import(pathToFileURL(join(ROOT, sourceOf(r.id))).href) })));
  const fam = await treeFamily(mods, ROOT), exercises = JSON.parse(readFileSync(join(ROOT, EXERCISES_JSON), 'utf8'));
  if (fam.problems.length) throw new Error(`library family (rows ${fam.counts.eight}, shared ${fam.counts.shared}, hands ${fam.counts.hands}):\n  ${fam.problems.map(b => `${b.path}: ${b.rule}${b.detail ? ` (${b.detail})` : ''}`).join('\n  ')}`);
  for (const [i, row] of rows.entries()) {
    const { content } = await loadContent(row.id);
    const refused = familyRefusal(row.id, content, readCard);
    if (refused) throw new Error(refused);
    // LIB-5v (D-LIB5-VARIANT, D-LIB5v-FIELD): the variant line on every shipped row, the 8 included
    const equipment = exercises.find(e => e.id === row.id)?.equipment;
    const line = variantLine({ id: row.id, equipment, line: variantLineOf(content), names: sourceNamePatterns([mods[i].M]) }).violations;
    if (line.length) throw new Error(`${row.id}: copy.variantLine: ${line.map(b => `${b.rule}${b.detail ? ` (${b.detail})` : ''}`).join('; ')}`);
    if (row.mode === 'golden') continue;
    const bad = lintLibraryRow(mods[i].M, shared, { extraBoxes: { back }, boxKeys: { back: BACK_BOX_KEY } });
    if (bad.length) throw new Error(`${row.id}: library lint:\n  ${bad.map(b => `${b.path}: ${b.rule}${b.detail ? ` (${b.detail})` : ''}`).join('\n  ')}`);
  }
  const stamps = await stampProblems(rows.map(r => r.id), { root: ROOT });
  if (stamps.length) throw new Error(stamps.join('\n'));
  return [{ path: OUT, text: backModuleText(back), inputs: inputsFor(OUT) }];
}
