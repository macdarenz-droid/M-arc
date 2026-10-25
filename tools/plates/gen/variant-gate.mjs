// LIB-5v (D-LIB5-VARIANT, D-LIB5v-FIELD, D-LIB5v-GENWRITER): the variant-line refusal point. It runs after content.mjs
// and, like every plugin, before render() writes anything (generate.mjs), so a refusal blocks every output. For every
// shipped row, the 8 included, the row's copy.variantLine (loadContent's content) must meet variantLine() against its
// exercises.json equipment. It writes nothing, so no generated file names it as a writer (library-gate.mjs, the writer
// of red-flag-back.ts, stays unchanged).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from '../lib/inputs.mjs';
import { inputs as contentInputs, loadContent } from './content.mjs';
import { EXERCISES_JSON, registryInputs, shippedRows, sourceOf } from '../library/registry.mjs';
import { variantLine, variantLineOf } from '../library/lint/index.mjs';
import { sourceNamePatterns } from '../layers/artifact/copy-lint.mjs';

export const after = ['tools/plates/gen/content.mjs'];

/** Every file the plugin reads: its own modules, the registry (exercises.json included) and content.mjs's inputs. */
export const inputs = () => [...new Set(['tools/plates/gen/variant-gate.mjs', 'tools/plates/library/lint/index.mjs', 'tools/plates/layers/artifact/copy-lint.mjs',
  ...registryInputs(), ...contentInputs()])];

export async function outputs() {
  const exercises = JSON.parse(readFileSync(join(ROOT, EXERCISES_JSON), 'utf8'));
  for (const row of shippedRows()) {
    const { content } = await loadContent(row.id), M = await import(pathToFileURL(join(ROOT, sourceOf(row.id))).href);
    const equipment = exercises.find(e => e.id === row.id)?.equipment;
    const bad = variantLine({ id: row.id, equipment, line: variantLineOf(content), names: sourceNamePatterns([M]) }).violations;
    if (bad.length) throw new Error(`${row.id}: copy.variantLine: ${bad.map(b => `${b.rule}${b.detail ? ` (${b.detail})` : ''}`).join('; ')}`);
  }
  return [];
}
