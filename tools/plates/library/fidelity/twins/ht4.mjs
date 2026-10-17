// LIB-4b twin of gate group HT-4 (pinned in ../twins.mjs): HT4-A5 (every renderPlate call of the id's layers build:
// options, protected fields, an untouched base call, poses; the page's plate fragments) and HT4-A6 (goldenB.mjs's
// state-driver self-check on the id's layers page, per theme). The A5 capture build runs once per run.
// For the 8 the layers build is the vendored golden B (tools/plates/layers); a library id's comes from LIB-6's builder
// (B5), so until then its A5 rows fail: never a skip.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { WIDTH } from '../tuples.mjs';
import { stateOf } from '../rows.mjs';

const GB = () => import('../../../fidelity/goldenB.mjs');
const A5 = s => stateOf('HT4', `A5-${s}`, null);

/** The capture of the vendored layers build: its renderPlate calls, its built page and golden A's specs (once). */
async function capture8(ctx) {
  if (!ctx.ht4) ctx.ht4 = (async () => {
    const layers = await import(pathToFileURL(join(ctx.root, 'tools/plates/layers.mjs')).href), gb = await GB();
    const mirror = layers.makeMirror();
    try {
      const specs = await gb.loadGoldenASpecs(), calls = await gb.captureRenderPlateCalls(mirror);
      return { specs, calls, html: readFileSync(join(mirror, 'artifact', 'technical-plates.html'), 'utf8'), entries: JSON.parse(readFileSync(join(ctx.root, 'tests/howto/golden/GOLDEN.json'), 'utf8')).entries.filter(e => e.kind === 'plate') };
    } finally { layers.cleanupMirror(mirror); }
  })();
  return ctx.ht4;
}

/** HT4-A5 for one id (theme '*'). */
export async function runNode(ctx, { lib, chrome }) {
  const { R } = ctx, gb = await GB();
  const eight = gb.IDS.includes(chrome);
  if (!eight) { for (const s of ['protected', 'fragments', 'poses']) R.fail(lib, '*', A5(s), 'HT4-A5 for a library id needs its layers build from LIB-6 (B5)'); return; }
  const c = await capture8(ctx);
  const entry = c.entries.filter(e => e.id === lib).pop();
  R.check(lib, '*', A5('fragments'), entry ? gb.fragmentProblems(c.html, [entry]) : [`no GOLDEN.json plate entry for ${lib}`]);
  const specId = entry?.slug.replace(/-/g, '_'), goldenA = c.specs[specId], calls = c.calls.filter(x => x.spec.id === specId);
  if (!goldenA) {   // the reference plate (ref-src) draws its crops itself: never through renderPlate, pinned by its crop params
    R.check(lib, '*', A5('protected'), [...(calls.length ? [`${calls.length} renderPlate calls for the ref-src plate`] : []), ...await gb.validateLateralRaiseCrops(join(ctx.root, 'tools/plates/layers'))]);
    R.check(lib, '*', A5('poses'), calls.length ? [`${calls.length} renderPlate calls for the ref-src plate`] : []);
    return;
  }
  const bad = [];
  if (!calls.length) bad.push(`captured 0 renderPlate calls for ${specId}`);
  for (const x of calls) for (const k of Object.keys(x.opts ?? {})) if (!['id', 'mistake', 'selected'].includes(k)) bad.push(`call ${JSON.stringify(x.opts)} uses an option outside {id, mistake, selected}`);
  for (const x of calls) bad.push(...gb.protectedFieldProblems(specId, x, goldenA));
  if (!calls.some(x => JSON.stringify(x.spec) === JSON.stringify(goldenA))) bad.push(`no untouched base-plate call found for ${specId}`);
  R.check(lib, '*', A5('protected'), bad);
  R.check(lib, '*', A5('poses'), gb.validateCalls(calls, c.specs));
}

/** HT4-A6 for one id in one theme: the golden-B state driver self-check on the id's layers page. */
export async function run(ctx, { lib, chrome, theme }) {
  const gb = await GB(), st = stateOf('HT4', 'A6', WIDTH);
  const { browser: b, page, errs } = await gb.openPage(ctx.layersFile(lib), theme, { chromePath: process.env.MARC_CHROMIUM });
  try {
    const bad = await gb.selfCheck(page, chrome);
    ctx.R.check(lib, theme, st, [...bad, ...errs.map(e => `page error: ${e}`)]);
  } finally { await b.close(); }
}
