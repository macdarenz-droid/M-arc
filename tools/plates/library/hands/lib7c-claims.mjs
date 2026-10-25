// LIB-7c: writes hands/lib7c-claims.json, the pinned extract of every research claim LIB-7c's keys cite (D-LIB7c-SCOPE;
// hands/DESIGN.md §10). LIB-7's claims.json and claims-extract.mjs's main are never touched: this reads only OWNER
// 'LIB-7c' modules, through claims-extract's refsOf and textOf. No drawing reads the output (it is in no inputsFor).
// Run: node tools/plates/library/hands/lib7c-claims.mjs [research commit]
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { refsOf, textOf } from './claims-extract.mjs';
import { HERE, MODULES, ROOT } from './pairs.mjs';

export const OWNER = 'LIB-7c', OUT = join(HERE, 'lib7c-claims.json');
export const lib7cMods = (mods = MODULES) => mods.filter(m => m.OWNER === OWNER);
/** { research, files: { file: sha256 }, claims: { ref: text } } for the LIB-7c refs at `research`. */
export function extract(research, mods = MODULES) {
  const files = {}, claims = {};
  for (const ref of refsOf(lib7cMods(mods))) {
    const [file, frag] = ref.split('#');
    if (!files[file]) {
      const raw = execFileSync('git', ['show', `${research}:docs/research/howto/${file}`], { cwd: ROOT });
      files[file] = { sha256: createHash('sha256').update(raw).digest('hex'), json: JSON.parse(raw.toString('utf8')) };
    }
    claims[ref] = textOf(files[file].json, frag);
  }
  return { research, files: Object.fromEntries(Object.entries(files).map(([k, v]) => [k, v.sha256])), claims };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const out = extract(process.argv[2] ?? '9eaa2480');
  writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log(`lib7c-claims.json: ${Object.keys(out.claims).length} refs from ${Object.keys(out.files).length} files @ ${out.research}`);
}
