// scratch: Do 9 (D-LIB8M-QA) on a tree: runQa(candidateOf(id, { authoring }), browser half, pinned envelope) per pilot id
//   node do9.mjs <root> <plates.html> <out.json> [--pinned] [ids...]
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const [root, pagePath, out, ...rest] = process.argv.slice(2);
const pinned = rest.includes('--pinned'), want = rest.filter(a => a !== '--pinned');
const imp = p => import(pathToFileURL(join(root, p)).href);
const { candidateOf } = await imp('tools/plates/library/candidate.mjs');
const { runQa, loadPins, summary } = await imp('tools/plates/library/qa/index.mjs');
const { launch, browserResults } = await imp('tools/plates/library/qa/browser.mjs');
const { loadEngine, dropMirror } = await imp('tools/plates/library/qa/engine.mjs');
const { makeMirror } = await imp('tools/plates/golden.mjs');
const { rows } = await imp('tools/plates/library/registry.mjs');
const html = readFileSync(pagePath, 'utf8'), all = rows(root);
const ids = want.length ? want : JSON.parse(readFileSync(join(root, 'tools/plates/library/pilot-a/plates.json'), 'utf8')).plates.filter(p => !p.held).map(p => p.id);
const mirror = makeMirror(), E = await loadEngine(mirror), pins = loadPins(), browser = await launch();
const res = [];
try {
  const cands = [];
  for (const id of ids) cands.push(await candidateOf(`lib_${id}`, { root, platesHtml: html, engine: E, all, authoring: !pinned }));
  const b = await browserResults(browser, html, cands, E, pins.envelope);
  for (const c of cands) { const report = await runQa(c, { engine: E, pins, browser: b, root, platesHtml: html }); res.push({ id: c.id, report }); console.log(summary(report)); }
} finally { await browser.close(); dropMirror(mirror); }
writeFileSync(out, JSON.stringify(res, null, 1) + '\n');
