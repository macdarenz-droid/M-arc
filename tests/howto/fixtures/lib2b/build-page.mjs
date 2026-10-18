// LIB-2b fixture page build (provenance.json "command"): in a worktree holding LIB-2b and LIB-6 (#181), stages the
// fixture tree and builds its layers page through layersSpecOf and LIB-6's buildLayersPage. Never run in CI.
//   node tests/howto/fixtures/lib2b/build-page.mjs <worktree> <out.html>
const [W, OUT] = process.argv.slice(2);
const f = await import(`${W}/tests/howto/fixtures/lib2b/fixture.mjs`);
const root = f.stageTree({ page: null, src: W });
console.error('tree', root);
const out = f.node(root, `
  import { mkdtempSync, writeFileSync } from 'node:fs';
  import { tmpdir } from 'node:os'; import { join } from 'node:path';
  import { layersSpecOf } from './tools/plates/library/layers-spec.mjs';
  import { buildLayersPage } from './tools/plates/library/build-layers-page.mjs';
  const spec = layersSpecOf(${JSON.stringify(f.BATCH)}, { stageDir: mkdtempSync(join(tmpdir(), 'stage-')) });
  const page = await buildLayersPage(spec);
  writeFileSync(${JSON.stringify(OUT)}, page);
  console.log(page.length);
`);
console.log(out);
