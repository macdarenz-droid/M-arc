// LIB-3c 3c-A1 (D-LIB9-AUTHORQA, ported from #245's A8 and Q-A, lb1-plates.test.ts:1013-1041 @ 38b436d): the authoring
// option of candidateOf and its How-to source rule, on the LIB-2b fixture row. #245's tests read LB1's files, which are
// not on main; every assertion is kept. The row's stage is changed in memory only; the batch golden file is deleted in
// the temp tree only, after the page is built (the page is built directly, so batch-golden.mjs's cache holds no pin).
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const T = 180_000;
let F: any, root: string, cand: any, reg: any, eng: any, mirror: string, E: any, base: any[], html: string, mainCand: any, mainReg: any;

beforeAll(async () => {
  F = await import(/* @vite-ignore */ new URL('./fixtures/lib2b/fixture.mjs', import.meta.url).href);
  root = F.fixtureTree();
  const im = (p: string) => import(/* @vite-ignore */ F.url(root, p));
  let bp: any, pp: any, golden: any;
  [cand, reg, bp, pp, golden, eng] = await Promise.all(['tools/plates/library/candidate.mjs', 'tools/plates/library/registry.mjs',
    'tools/plates/library/build-page.mjs', 'tools/plates/library/plates-page.mjs', 'tools/plates/golden.mjs', 'tools/plates/library/qa/engine.mjs'].map(im));
  [mainCand, mainReg] = await Promise.all(['candidate.mjs', 'registry.mjs'].map(f => import(/* @vite-ignore */ new URL(`../../tools/plates/library/${f}`, import.meta.url).href)));
  mirror = golden.makeMirror();
  E = await eng.loadEngine(mirror);
  base = reg.rows();
  html = (await bp.buildPlatesPage(await pp.pageConfig(F.PAGES.plates, base))).html.toString('utf8');
  rmSync(join(root, F.BATCH_GOLDEN));
}, T);
afterAll(() => { if (mirror) eng.dropMirror(mirror); if (root) F.drop(root); });

const at = (stage: string) => base.map(r => (r.id === F.ID ? { ...r, stage } : r));

describe('LIB-3c 3c-A1 (D-LIB9-AUTHORQA): the authoring option', { timeout: T }, () => {
  it('returns the candidate with exemptions [] and reads no pin; the default path with no pin still throws', async () => {
    expect(existsSync(join(root, F.BATCH_GOLDEN))).toBe(false);
    const all = at('drawing');
    const c = await cand.candidateOf(F.ID, { all, platesHtml: html, engine: E, authoring: true });
    expect(c.exemptions).toEqual([]);
    expect(c.research.topFault).toBe(JSON.parse(readFileSync(join(root, F.CARD_FILE), 'utf8')).topFault);
    await expect(cand.candidateOf(F.ID, { all, platesHtml: html, engine: E })).rejects.toThrow(/batch golden|golden file|pin/i);
  });
  it('mutations: authoring on a shipped row and on an approved-plate row both throw', async () => {
    for (const stage of ['shipped', 'approved-plate']) {
      await expect(cand.candidateOf(F.ID, { all: at(stage), platesHtml: html, engine: E, authoring: true })).rejects.toThrow(/authoring QA is refused/);
    }
  });
});

describe('LIB-3c 3c-A1 (Q-A, #245): candidate.mjs resolves the How-to source exactly as registry sourceOf does', () => {
  it('equal to sourceOf for every main row, and for the fixture row inside the tree', () => {
    const all = mainReg.rows();
    for (const r of all) expect(mainCand.howtoOf(r.id, undefined, all), r.id).toBe(mainReg.sourceOf(r.id));
    expect(cand.howtoOf(F.ID, undefined, base)).toBe(reg.sourceOf(F.ID));
    expect(cand.howtoOf(F.ID, undefined, base)).toBe(F.HOWTO);
  });
  it('an unknown id throws', () => {
    expect(() => mainCand.howtoOf('lib_no_such_id', undefined, mainReg.rows())).toThrow(/no row/);
  });
});
