// LIB-3c 3c-A2 and 3c-A3 (D-LIB3b-H7): PQ-H7 renders again from a fresh import of the spec (every mode) and builds the
// plate twice in two processes (h7Builds), on the real path (candidateOf -> runQa) for the LIB-2b fixture row and on the
// 'approved' path through a scratch mirror. Test-only spec variants are written into the temp tree only; the row's `src`
// is changed in memory. Nothing is written to rows.json, batches/ or tests/howto/golden/.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const T = 300_000;
let F: any, root: string, cand: any, I: any, eng: any, golden: any, appr: any, mirror: string, E: any, base: any[], row: any, html: string;

beforeAll(async () => {
  F = await import(/* @vite-ignore */ new URL('./fixtures/lib2b/fixture.mjs', import.meta.url).href);
  root = F.fixtureTree();
  const im = (p: string) => import(/* @vite-ignore */ F.url(root, p));
  let bg: any, reg: any;
  [cand, bg, reg, golden, eng, I, appr] = await Promise.all(['tools/plates/library/candidate.mjs', 'tools/plates/library/batch-golden.mjs', 'tools/plates/library/registry.mjs',
    'tools/plates/golden.mjs', 'tools/plates/library/qa/engine.mjs', 'tools/plates/library/qa/index.mjs', 'tools/plates/library/qa/approved.mjs'].map(im));
  mirror = golden.makeMirror();
  E = await eng.loadEngine(mirror);
  base = reg.rows();
  row = base.find((r: any) => r.id === F.ID);
  html = await bg.platesPage(row, base);
}, T);
afterAll(() => { if (mirror) eng.dropMirror(mirror); if (root) F.drop(root); });

const SPEC_DIR = 'tools/plates/library/specs';
/** A variant of the fixture spec, written beside it (its relative imports still resolve): `body` follows the base spec. */
function variant(name: string, body: string, head = '') {
  const file = `${SPEC_DIR}/h7_${name}.mjs`;
  writeFileSync(join(root, file), `import base from './${F.CARD}.mjs';\n${head}\n${body}\n`);
  return `library/specs/h7_${name}.mjs`;
}
/** Module-top code that fixes RR at import time to a value no other evaluation of it gets: a counter kept in a file
 *  (so it also differs across processes), stepped once per evaluation. Random values could round to the same bytes. */
const importTimeRR = (name: string, base = '0.01', step = '0.01') => `import { existsSync as __e, readFileSync as __r, writeFileSync as __w } from 'node:fs';
const __f = ${JSON.stringify(join(root, `.h7-${name}.n`))}, __n = (__e(__f) ? +__r(__f, 'utf8') : 0) + 1;
__w(__f, String(__n));
const RR = ${base} + ${step} * __n;`;
const line = (z: string) => `{ type: 'line', cls: 'eq-thin', pts: [[0, 0.02, ${z}], [0, 0.02, -1]] }`;
const withLine = (item: string) => `export default { ...base, equipment: [...base.equipment, ${item}] };`;
const h7Keys = (r: any) => r.hard['PQ-H7'].problems.map((p: any) => p.key);
async function qa(src: string | null, edit: (c: any) => void = () => {}) {
  const all = src ? base.map(r => (r.id === F.ID ? { ...row, src } : r)) : base;
  const c = await cand.candidateOf(F.ID, { platesHtml: html, engine: E, all });
  edit(c);
  return cand.nodeHalf(await I.runQa(c, { engine: E }));
}

describe('LIB-3c 3c-A2 PQ-H7 from a fresh import (library row)', { timeout: T }, () => {
  it('control: the unedited spec gives no PQ-H7 problem', async () => {
    expect(h7Keys(await qa(null))).toEqual([]);
  });
  it('a value fixed at import time that reaches a drawn dimension gives H7.determinism', async () => {
    const src = variant('import', withLine(line('-0.9 - RR')), importTimeRR('import'));
    const keys = h7Keys(await qa(src));
    expect(keys.filter((k: string) => k.startsWith('H7.determinism:')).length).toBeGreaterThan(0);
    expect(keys).toContain('H7.determinism:normal.svg');
  });
  it('control: a per-call random value still gives H7.determinism', async () => {
    const src = variant('call', `export default { ...base, equipment: [...base.equipment, () => (${line('-0.9 - Math.random() * 0.5')}), () => (${line('-0.4 - Math.random() * 0.5')})] };`);
    expect(h7Keys(await qa(src))).toContain('H7.determinism:normal.svg');
  });
  it('control: M8\'s per-call counter (reset by a fresh import) still gives H7.determinism', async () => {
    const src = variant('counter', `let n = 0;\n${withLine(`() => (${line('-0.9 - (n++ % 7) * 0.01')})`)}`);
    expect(h7Keys(await qa(src))).toContain('H7.determinism:normal.svg');
  });
  it('control: a render that throws still gives H1.engine:render-threw', async () => {
    const src = variant('throws', withLine("() => { throw new Error('h7 test: render refused'); }"));
    const r = await qa(src);
    expect(r.hard['PQ-H1'].problems.map((p: any) => p.key)).toContain('H1.engine:render-threw');
  });
  it('an engine candidate without the fresh loader gives H7.determinism:fresh-missing (H, D and T)', async () => {
    for (const mode of ['H', 'D', 'T']) {
      const c = await cand.candidateOf(F.ID, { platesHtml: html, engine: E, all: base });
      const r = await I.runQa({ ...c, mode, freshSpec: undefined }, { engine: E });
      expect([mode, h7Keys(r)]).toEqual([mode, ['H7.determinism:fresh-missing']]);
    }
  });
  it('a fresh import that throws gives H7.determinism:fresh-threw', async () => {
    const r = await qa(null, c => { c.freshSpec = async () => { throw new Error('h7 test: import refused'); }; });
    expect(h7Keys(r)).toEqual(['H7.determinism:fresh-threw']);
  });
});

describe('LIB-3c 3c-A2 PQ-H7 from a fresh import (\'approved\' path, D-LIB3b-H7\'s reproduction)', { timeout: T }, () => {
  const seated = async (edit: ((s: string) => string) | null) => {
    const m = golden.makeMirror();
    try {
      const f = join(m, 'exercises', 'seated_cable_row.mjs');
      if (edit) { const s = readFileSync(f, 'utf8'), t = edit(s); expect(t).not.toBe(s); writeFileSync(f, t); }
      const E2 = await eng.loadEngine(m);
      const c = (await appr.candidatesOf(appr.goldenHtml(), E2)).find((x: any) => x.chromeId === 'seated-cable-row');
      return h7Keys(await I.runQa(c, { engine: E2 }));
    } finally { eng.dropMirror(m); }
  };
  it('control: the unedited spec gives no PQ-H7 problem', async () => {
    expect(await seated(null)).toEqual([]);
  });
  it('the pulley radius fixed at import time gives H7.determinism', async () => {
    const keys = await seated(s => s.replace('pulley: { at: PULLEY, r: 0.045 }', 'pulley: { at: PULLEY, r: RR }').replace(/\nexport default/, `\n${importTimeRR('seated', '0.04', '0.005')}\nexport default`));
    expect(keys.filter((k: string) => k.startsWith('H7.determinism:')).length).toBeGreaterThan(0);
  });
});

describe('LIB-3c 3c-A3 h7Builds is wired: two page builds catch a value a composer fixes at import time', { timeout: T }, () => {
  it('a composer\'s import-time value: the fresh spec import misses it, the two builds do not', async () => {
    writeFileSync(join(root, SPEC_DIR, 'h7_composer_part.mjs'), `${importTimeRR('composer')}\nexport { RR };\n`);
    const src = variant('composer', withLine(line('-0.9 - RR')), "import { RR } from './h7_composer_part.mjs';");
    expect(h7Keys(await qa(src))).toEqual(['H7.determinism:build']);
  });
  it('a rebuild that finds no plate for the id gives H7.determinism:fresh-threw', async () => {
    expect(h7Keys(await qa(null, c => { c.rebuild = async () => 'null'; }))).toEqual(['H7.determinism:fresh-threw']);
  });
  it('an engine candidate without the rebuild gives H7.determinism:fresh-missing', async () => {
    expect(h7Keys(await qa(null, c => { c.rebuild = undefined; }))).toEqual(['H7.determinism:fresh-missing']);
  });
});
