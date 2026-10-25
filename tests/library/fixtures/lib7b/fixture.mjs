// LIB-7b fixture (scratch; lib4-cards 11.1 item 3's limits: never pinned or shipped). A temp tree with LIB-4b's B5
// staging (fidelity/fixture.mjs stage) of three scratch library ids whose layers config names a pair:
//   - lib_scratch_pull_row and lib_t_bar_row (D-LIB-SCRATCHIDS: outside LB1 and LB2, not taken; accepted on #284) on
//     curl-dumbbell-under: two rows on one key on one page (D-LIB7b-PAGEDUP). lib_scratch_pull_row is no library id: the
//     tree's copied exercises.json gains it as a copy of lib_lat_pulldown's entry (copyOf; D-LIB8M-SCRATCH7B, #109) and
//     its coverage-archetypes.json gains it as 'pull';
//   - lib_smith_machine_shoulder_press (a push clone: its ht-also button names the hand panel) on rope-push-neutral.
// pairTree() builds the tree; pageOf() builds its layers page through layersSpecOf + buildLayersPage, in the tree.
import { cpSync, mkdtempSync, readdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { node } from '../../../howto/fixtures/lib2b/fixture.mjs';
import { markScratch, writeScratchStamps } from '../../../../tools/plates/library/research/stamps.mjs';

export const REPO = join(dirname(fileURLToPath(import.meta.url)), '../../../..');
export const SCRATCH_7B = [
  { id: 'lib_scratch_pull_row', from: 'lat_pulldown', key: 'curl-dumbbell-under', pre: 'scratch-pull-row', copyOf: 'lib_lat_pulldown', archetype: 'pull' },
  { id: 'lib_t_bar_row', from: 'seated_cable_row', key: 'curl-dumbbell-under', pre: 't-bar-row' },
  { id: 'lib_smith_machine_shoulder_press', from: 'machine_chest_press', key: 'rope-push-neutral', pre: 'smith-machine-shoulder-press' },
];
const COPY = ['index.html', 'vite.config.ts', 'package.json', 'tsconfig.json', 'public', 'src', 'tools', 'tests/howto/golden', 'docs/research/howto', 'tests/howto/fixtures/lib2b'];

/** Stages the scratch rows into `root` in place (marked as a LIB-5 scratch root); `pair` false leaves the layers config
 *  with no pair field. */
export async function stagePairs(root, { scratch = SCRATCH_7B, pair = true, src = REPO } = {}) {
  const bad = scratchRowProblems(scratch, src);
  if (bad.length) throw new Error(`lib7b fixture: ${bad.join('; ')}`);
  const exf = join(root, 'src/data/exercises.json'), ex = JSON.parse(readFileSync(exf, 'utf8'));
  for (const s of scratch.filter(x => x.copyOf)) ex.push({ ...ex.find(e => e.id === s.copyOf), id: s.id });
  writeFileSync(exf, `${JSON.stringify(ex, null, 1)}\n`);
  // generate (gen/ids.mjs) needs every exercises.json id in the coverage data: the hand archetype of the replaced target and of lib_t_bar_row
  const cvf = join(root, 'tools/plates/library/coverage-archetypes.json'), cv = JSON.parse(readFileSync(cvf, 'utf8'));
  for (const s of scratch.filter(x => x.copyOf)) cv.archetypes[s.id] = s.archetype;
  writeFileSync(cvf, `${JSON.stringify(cv, null, 2)}\n`);
  markScratch(root);
  const F = await import(join(root, 'tools/plates/library/fidelity/fixture.mjs'));
  F.stage(root, { scratch, src: root });
  if (pair) {
    const f = join(root, F.PAGES.layersConfig), c = JSON.parse(readFileSync(f, 'utf8'));
    for (const s of scratch) c.closeups[s.id].pair = s.key;
    writeFileSync(f, `${JSON.stringify(c, null, 2)}\n`);
  }
  return root;
}
/** D-LIB8M-SCRATCH7B: a copyOf scratch id is never a real row: not in `src`'s exercises.json and in no batch file. */
export function scratchRowProblems(scratch = SCRATCH_7B, src = REPO) {
  const known = new Set(JSON.parse(readFileSync(join(src, 'src/data/exercises.json'), 'utf8')).map(e => e.id)), dir = join(src, 'tools/plates/library/batches'), out = [];
  const batches = readdirSync(dir).filter(n => n.endsWith('.json')).map(n => [n, Object.keys(JSON.parse(readFileSync(join(dir, n), 'utf8')).rows ?? {})]);
  for (const s of scratch.filter(x => x.copyOf)) {
    if (known.has(s.id)) out.push(`${s.id} is in src/data/exercises.json`);
    for (const [n, ids] of batches) if (ids.includes(s.id)) out.push(`${s.id} is a row of batches/${n}`);
  }
  return out;
}
/** A temp tree of `src` with the scratch rows staged. */
export async function pairTree({ src = REPO, scratch = SCRATCH_7B, pair = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'lib7b-'));
  for (const p of COPY) cpSync(join(src, p), join(root, p), { recursive: true });
  symlinkSync(join(src, 'node_modules'), join(root, 'node_modules'), 'dir');
  return stagePairs(root, { scratch, pair, src });
}

/** The tree's batch layers page, built in the tree and written to the batch's layers page path (or `out`). */
export function pageOf(root, out = join(root, 'tests/howto/golden/library/zz-lib4b.layers.html')) {
  node(root, `
    import { mkdtempSync, writeFileSync } from 'node:fs';
    import { tmpdir } from 'node:os'; import { join } from 'node:path';
    import { layersSpecOf } from './tools/plates/library/layers-spec.mjs';
    import { buildLayersPage } from './tools/plates/library/build-layers-page.mjs';
    import { BATCH } from './tools/plates/library/fidelity/fixture.mjs';
    import { mkdirSync } from 'node:fs'; import { dirname } from 'node:path';
    mkdirSync(dirname(${JSON.stringify(out)}), { recursive: true });
    writeFileSync(${JSON.stringify(out)}, await buildLayersPage(layersSpecOf(BATCH, { stageDir: mkdtempSync(join(tmpdir(), 'lib7b-stage-')) })));
  `);
  return readFileSync(out, 'utf8');
}

/** The scratch-only IDS lines (7b-A3: same variant, orientation and ordered faults as the key's first id), never committed. */
export const IDS_EDITS = {
  'tools/plates/library/hands/hand-curl.mjs': ["  dumbbell_biceps_curl: { variant: 'dumbbell', orientation: 'under', faults: BOTH, claims: ['cards/dumbbell_biceps_curl.json#c1'] },\n",
    id => `  ${id}: { variant: 'dumbbell', orientation: 'under', faults: BOTH, claims: ['cards/dumbbell_biceps_curl.json#c1'] },\n`, 'curl-dumbbell-under'],
  'tools/plates/library/hands/hand-rope.mjs': ["  rope_triceps_pushdown: { variant: 'push', orientation: 'neutral', faults: ['curled'], claims: ['shared/rope-rule.json#c3'] },\n",
    id => `  ${id}: { variant: 'push', orientation: 'neutral', faults: ['curled'], claims: ['shared/rope-rule.json#c3'] },\n`, 'rope-push-neutral'],
};
/** Pins the tree (LIB-4b's pin: batch golden file, research cards), then puts back the real LIB-7 loader (pin writes
 *  B5's own) and joins each scratch id to its real key by an IDS line after the key's first id. */
export async function keyTree(root, { scratch = SCRATCH_7B } = {}) {
  const F = await import(join(root, 'tools/plates/library/fidelity/fixture.mjs')), loader = join(root, 'tools/plates/library/hands/pairs.mjs');
  const real = readFileSync(loader);
  F.pin(root, { scratch });
  writeFileSync(loader, real);
  for (const [file, [anchor, line, key]] of Object.entries(IDS_EDITS)) {
    const f = join(root, file), text = readFileSync(f, 'utf8'), ids = scratch.filter(s => s.key === key).map(s => s.id.slice(4));
    if (text.split(anchor).length !== 2) throw new Error(`lib7b fixture: ${file}: anchor not found once`);
    if (ids.length) writeFileSync(f, text.replace(anchor, () => anchor + ids.map(line).join('')));
  }
  writeScratchStamps(root, scratch.map(s => s.id));
  return root;
}
