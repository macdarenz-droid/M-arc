// LIB-5 (D-LIB5-GATE): the one refusal point for library How-to content. It runs after content.mjs and, like every
// plugin, before render() writes anything (generate.mjs), so a refusal here blocks every output. It never reads
// ctx.prev: rows come from the registry and content from content.mjs's loadContent. content.mjs, ids.mjs, generate.mjs
// and lib/** stay byte-unchanged. Until Do 9 it writes no file (outputs() returns []); from Do 9 it writes only
// src/howto/red-flag-back.ts. Order per shipped row: the back-box refusal first (S4-P).
import { inputs as contentInputs, loadContent } from './content.mjs';
import { registryInputs, shippedRows } from '../library/registry.mjs';
import { refuseBack } from '../library/shared/back-box.mjs';

export const after = ['tools/plates/gen/content.mjs'];

const BACK_BOX = 'tools/plates/library/shared/back-box.mjs';
const BACK_CARD = 'docs/research/howto/shared/back-pain-box.json';
const OWN = ['tools/plates/gen/library-gate.mjs', BACK_BOX];

/** Every file the plugin reads. */
export const inputs = () => [...new Set([...OWN, ...registryInputs(), ...contentInputs()])];

/** The inputs of the one file it writes from Do 9: back-box.mjs, its static imports (none) and the back-box card. */
export const inputsFor = path => (path === 'src/howto/red-flag-back.ts' ? [BACK_BOX, BACK_CARD] : undefined);

export async function outputs() {
  for (const row of shippedRows()) {
    const { content } = await loadContent(row.id);
    refuseBack(row.id, content.riskFlags);
  }
  return [];
}
