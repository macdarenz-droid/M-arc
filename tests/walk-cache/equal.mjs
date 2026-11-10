// F-GEN-WALK-SPEED acceptance 2: the data each walker asserts on is byte-equal with and without tests/walk-cache.ts.
// Run: node tests/walk-cache/equal.mjs  (about 15 minutes; prints one sha256 line per row or output, both ways, and
// exits 1 on any difference). Not a test file: it runs every shared step twice on purpose.
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = new URL('../../', import.meta.url).pathname.replace(/\/$/, '');
const url = p => pathToFileURL(join(ROOT, p)).href;
const sha = s => createHash('sha256').update(s).digest('hex');
const dir = mkdtempSync(join(tmpdir(), 'marc-walk-cache-'));
process.env.MARC_WALK_CACHE = dir;
const W = await import(url('tests/walk-cache.ts'));
let bad = 0;
const line = (what, a, b) => { const ok = a === b; if (!ok) bad++; console.log(`${ok ? 'EQUAL' : 'DIFF '} ${what} ${a.slice(0, 16)} ${b.slice(0, 16)}`); };
try {
  // render(): library-core L2 beforeAll, library-rows repoOut, library-shared S6 (both render() tests)
  const gen = await import(url('tools/plates/generate.mjs'));
  const direct = await gen.render(), cached = await W.renderOf(ROOT), again = await W.renderOf(ROOT);
  line('render() output count', String(direct.size), String(cached.size));
  line('render() path order', sha(JSON.stringify([...direct.keys()])), sha(JSON.stringify([...cached.keys()])));
  for (const [p, v] of direct) {
    line(`render() ${p}`, sha(JSON.stringify(v)), sha(JSON.stringify(cached.get(p))));
    if (JSON.stringify(again.get(p)) !== JSON.stringify(v)) { bad++; console.log(`DIFF  render() from the stored file ${p}`); }
  }
  // inputsMap(): library-ci C4 class 3
  const aff = await import(url('tools/plates/library/ci/affected.mjs'));
  const m = await aff.inputsMap(ROOT), c = await W.inputsMapOf(ROOT);
  line('inputsMap() proven/why', sha(JSON.stringify([m.proven, m.why])), sha(JSON.stringify([c.proven, c.why])));
  line('inputsMap() path order', sha(JSON.stringify([...m.inputs.keys(), ...m.writers.keys()])), sha(JSON.stringify([...c.inputs.keys(), ...c.writers.keys()])));
  for (const [p, ins] of m.inputs) line(`inputsMap() ${p}`, sha(JSON.stringify([ins, m.writers.get(p)])), sha(JSON.stringify([c.inputs.get(p), c.writers.get(p)])));
  // feel.renderAll(): library-rows D-LIB2b-FEEL, per shipped library row: everything feelChecks compares a section to
  const feel = await import(url('tools/plates/gen/feel.mjs')), content = await import(url('tools/plates/gen/content.mjs'));
  const reg = await import(url('tools/plates/library/registry.mjs'));
  const rows = reg.shippedRows().filter(r => r.mode !== 'golden');
  const dataOf = async (fm, row) => {
    const Fs = (await content.loadContent(row.id)).content.feel, pre = row.chromeId, out = [];
    out.push(fm.renderFeelMap({ primary: Fs.primary, secondary: Fs.secondary, views: ['front', 'back'], id: `${pre}-feel`, shimmer: true }).label);
    for (const r of Fs.rows) {
      const watch = (r.at?.muscles ?? []).filter(x => Fs.watch.some(w => w.muscleId === x) && !Fs.primary.some(p => p.muscleId === x)), pain = r.at?.parts ?? [];
      if (watch.length || pain.length) out.push(fm.renderFeelMap({ primary: Fs.primary, secondary: Fs.secondary, avoid: watch, pain, views: ['front', 'back'], id: `${pre}-feel-${r.key}`, shimmer: false }).svg);
    }
    out.push(fm.renderFeelLegend({ avoid: true }));
    return sha(JSON.stringify(out));
  };
  for (const row of rows) {
    const fresh = await dataOf((await feel.renderAll()).fm, row);   // as before: a new renderAll() per row
    line(`feel ${row.id}`, fresh, await dataOf((await W.feelAllOf(ROOT)).fm, row));
  }
  line('feel row count', String(rows.length), String(rows.length));
} finally { rmSync(dir, { recursive: true, force: true }); }
console.log(bad ? `${bad} DIFFERENT` : 'ALL EQUAL');
process.exit(bad ? 1 : 0);
