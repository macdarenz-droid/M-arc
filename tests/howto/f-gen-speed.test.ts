// F-GEN-SPEED (D-GSP-AFIRST): PQ-H7 starts the row's two process builds first, both at once, and reads them in the old
// order. Stubs only (no render, no child process): every result and message path is pinned, and that both builds are
// in flight at once, and that no build outlives the row when the fresh import throws first.
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
let N: any;
beforeAll(async () => { N = await import(/* @vite-ignore */ new URL('../../tools/plates/library/qa/node.mjs', import.meta.url).href); }, 120_000);

const E = { renderPlate: () => ({ svg: '<svg></svg>', overlay: '', report: { issues: [] } }) };
const plate = { prefix: 'fgs', normal: { svg: '<svg></svg>', overlay: '<span class="plate-meta">Side view</span>', cues: [] }, mistake: { svg: '<svg></svg>', overlay: '', cues: [] }, tells: '', tempo: '', alt: '', mistakeAlt: '' };
type Build = { v?: string; e?: string; sync?: boolean };
/** A stub row whose builds settle after `ms`; counts the builds open at once. */
function row(builds: Build[], { fresh = async () => ({}), ms = 30 }: { fresh?: () => Promise<any>; ms?: number } = {}) {
  const st = { open: 0, most: 0, started: 0 };
  const c = {
    id: 'fgs', chromeId: 'fgs', mode: 'H', spec: {}, plate, article: '', freshSpec: fresh,
    rebuild: () => {
      const b = builds[st.started++]!;
      if (b.sync) throw new Error(b.e);
      st.open++; st.most = Math.max(st.most, st.open);
      return new Promise((res, rej) => setTimeout(() => { st.open--; if (b.e !== undefined) rej(new Error(b.e)); else res(b.v); }, ms));
    },
  };
  return { c, st };
}
const h7 = async (c: any) => (await N.h7(c, { engine: E }, N.rendersOf(c, E))).filter((p: any) => p.key.startsWith('H7.determinism'));
const threw = (m: string) => [{ key: 'H7.determinism:fresh-threw', text: `a fresh import, render or build threw: ${m}` }];
const NULL = 'the rebuilt page has no plate for the id';

describe('F-GEN-SPEED PQ-H7 builds', () => {
  it('both builds are in flight at once', async () => {
    const { c, st } = row([{ v: 'X' }, { v: 'X' }]);
    expect(await h7(c)).toEqual([]);
    expect([st.started, st.most, st.open]).toEqual([2, 2, 0]);
  });
  it.each([
    ['builds equal', [{ v: 'X' }, { v: 'X' }], []],
    ['builds differ', [{ v: 'X' }, { v: 'Y' }], [{ key: 'H7.determinism:build', text: 'two builds of the card differ' }]],
    ['a throws', [{ e: 'a-bad' }, { v: 'X' }], threw('a-bad')],
    ['a throws synchronously', [{ e: 'a-sync', sync: true }, { v: 'X' }], threw('a-sync')],
    ['a gives null', [{ v: 'null' }, { v: 'X' }], threw(NULL)],
    ['b throws', [{ v: 'X' }, { e: 'b-bad' }], threw('b-bad')],
    ['b gives null', [{ v: 'X' }, { v: 'null' }], threw(NULL)],
    ['a and b throw: a\'s message', [{ e: 'a-bad' }, { e: 'b-bad' }], threw('a-bad')],
    ['b throws, a gives null: a\'s null', [{ v: 'null' }, { e: 'b-bad' }], threw(NULL)],
    ['a throws, b gives null: a\'s message', [{ e: 'a-bad' }, { v: 'null' }], threw('a-bad')],
  ] as [string, Build[], any[]][])('%s', async (_n, builds, want) => {
    const { c, st } = row(builds);
    expect(await h7(c)).toEqual(want);
    expect(st.open).toBe(0);
  });
  it('the fresh import throws while the builds are pending (one of them rejects): the fresh error, and no build left open', async () => {
    const { c, st } = row([{ e: 'a-bad' }, { v: 'X' }], { fresh: async () => { throw new Error('fresh-bad'); }, ms: 80 });
    expect(await h7(c)).toEqual(threw('fresh-bad'));
    expect(st.open).toBe(0);
  });
});
