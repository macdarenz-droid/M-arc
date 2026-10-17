// LIB-2 reopened (supervisor 2026-10-16, from the LIB-1 rehearsal #209; library plan 5.2): the How-to wiring at scale.
//   L2-A22: the sheet chunk holds no per-id map; HAND, POSTURE and FEEL live in the lazy loaders chunk, keyed by the
//           shipped chrome ids (D-LIB2-sheet-maps).
//   L2-A23: the loaders-*.js ceiling is the per-id rule, set once on the 8 (D-LIB2-loaders-budget).
//   L2-A24: synthetic builds at N = 8 and N = 153: HowToSheet-*.js has the same bytes at both (content-hashed file names
//           made neutral) within its HT-3b budget, the map keys equal the shipped chrome ids, loaders-*.js within the
//           per-id rule (D-LIB2-synthetic).
import { readFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
/* eslint-disable @typescript-eslint/no-explicit-any */
const budgets = () => JSON.parse(readFileSync('tests/howto/budgets.json', 'utf8'));
const sheetBudget = () => budgets().budgets.find((b: any) => b.chunk === 'HowToSheet-*.js');
const loadersBudget = () => budgets().perId?.find((b: any) => b.chunk === 'loaders-*.js');

/** The HAND, POSTURE and FEEL keys against the shipped chrome ids, in order. Red on no chrome ids and on a missing map. */
export function mapProblems(keys: Record<string, string[] | null>, chromeIds: string[]): string[] {
  if (chromeIds.length === 0) return ['no shipped chrome ids'];
  const bad: string[] = [];
  for (const k of ['HAND', 'POSTURE', 'FEEL']) {
    const got = keys[k];
    if (!got) bad.push(`${k}: no map`);
    else if (JSON.stringify(got) !== JSON.stringify(chromeIds)) bad.push(`${k}: ${got.length} keys, not the ${chromeIds.length} shipped chrome ids in order`);
  }
  return bad;
}

describe('L2-A22: the sheet chunk holds no per-id map (D-LIB2-sheet-maps)', () => {
  it('no import.meta.glob anywhere under src/slices/howto (the three maps of registry.ts, Posture.tsx and Feel.tsx are gone)', () => {
    const walk = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(d, e.name)) : /\.(ts|tsx)$/.test(e.name) ? [join(d, e.name)] : []);
    const files = walk('src/slices/howto');
    expect(files.length).toBeGreaterThan(10);
    expect(files.filter(f => readFileSync(f, 'utf8').includes('import.meta.glob'))).toEqual([]);
  });
  it('loaders.ts maps every shipped chrome id, in registry order, in HAND, POSTURE and FEEL (8); red on none', async () => {
    const S = await import(/* @vite-ignore */ url('tools/plates/library/scale/synthetic.mjs'));
    const reg = await import(/* @vite-ignore */ url('tools/plates/library/registry.mjs'));
    const shipped = new Set(reg.shippedIds()), chromeIds = reg.rows().filter((r: any) => shipped.has(r.id)).map((r: any) => r.chromeId);
    expect(chromeIds).toHaveLength(reg.shippedIds().length);   // LIB-4a (D-LIB4-PINS-2): the registry's count, the 8 today
    expect(reg.shippedIds().slice(0, 8)).toEqual(Object.keys(JSON.parse(readFileSync('tools/plates/plates.json', 'utf8'))));   // the 8 ship first, in plates.json order
    const keys = S.mapKeys(readFileSync('src/howto/generated/loaders.ts', 'utf8'));
    expect(mapProblems(keys, chromeIds)).toEqual([]);
    expect(mapProblems(keys, [])).toEqual(['no shipped chrome ids']);
    expect(mapProblems(S.mapKeys(''), chromeIds)).toEqual(['HAND: no map', 'POSTURE: no map', 'FEEL: no map']);
    expect(mapProblems({ ...keys, FEEL: keys.FEEL.slice(1) }, chromeIds)).toHaveLength(1);
  });
  it('chunkMaps: an own hand chunk wins over a hand pair, a pair fills in, and an unwritten posture or feel chunk has no entry', async () => {
    const ids = await import(/* @vite-ignore */ url('tools/plates/gen/ids.mjs'));
    const has = (n: string) => ['hand-a', 'posture-a', 'feel-a'].includes(n);
    expect(ids.chunkMaps([{ chromeId: 'a' }, { chromeId: 'b' }, { chromeId: 'c' }], has, { a: 'k1', b: 'k2' })).toEqual({
      hand: [['a', 'hand-a'], ['b', 'handpair-k2']], posture: [['a', 'posture-a']], feel: [['a', 'feel-a']],
    });
  });
  it('Feel finds its chunk synchronously in the loaders module from context, and with none it loads and renders nothing', () => {
    const src = readFileSync('src/slices/howto/sections/Feel.tsx', 'utf8');
    expect(src).toContain('const loaders = useContext(LoadersContext);');
    expect(src).toMatch(/const load = loaders\?\.FEEL\[chromeIdOf\(howTo\)\];\n\s+const el = host\.current;\n\s+if \(!load \|\| !el\) return;/);
    expect(readFileSync('src/slices/howto/HowToSheet.tsx', 'utf8')).toContain('<LoadersContext.Provider value={howTo.loaders}>');
  });
});

describe('L2-A23: the loaders-*.js ceiling is a per-id rule (plan 5.2 "set once", D-LIB2-loaders-budget)', () => {
  it('the stored ceiling equals ceil(measured8 x 11 x N / 80) at the registry\'s shipped N; a fixed ceiling would fail at N = 9', async () => {
    const reg = await import(/* @vite-ignore */ url('tools/plates/library/registry.mjs'));
    const { perIdCeiling } = await import(/* @vite-ignore */ url('tools/plates/library/budgets/total.mjs'));
    const b = loadersBudget(), n = reg.shippedIds().length;
    expect(b).toBeTruthy();
    expect(reg.shippedIds().slice(0, 8)).toEqual(Object.keys(JSON.parse(readFileSync('tools/plates/plates.json', 'utf8'))));   // LIB-4a (D-LIB4-PINS-2): N is the registry's, the 8 first
    expect(b.n).toBe(n);
    expect(b.rawMax).toBe(perIdCeiling(b.measuredRaw, n));
    expect(b.gzMax).toBe(perIdCeiling(b.measuredGz, n));
    expect(perIdCeiling(b.measuredRaw, n + 1)).toBeGreaterThan(b.rawMax);
    expect(perIdCeiling(b.measuredGz, n + 1)).toBeGreaterThan(b.gzMax);
    expect(budgets().budgets.some((x: any) => x.chunk === 'loaders-*.js')).toBe(false);   // no fixed entry left beside it
  });
});

describe('L2-A24: synthetic N = 8 and N = 153 builds (plan 5.2 line 518, D-LIB2-synthetic)', () => {
  let S: any, perIdCeiling: (m: number, n: number) => number;
  const runs: Record<number, { root: string; assets: Record<string, Buffer>; chromeIds: string[]; loadersTs: string }> = {};
  beforeAll(async () => {
    S = await import(/* @vite-ignore */ url('tools/plates/library/scale/synthetic.mjs'));
    ({ perIdCeiling } = await import(/* @vite-ignore */ url('tools/plates/library/budgets/total.mjs')));
    for (const n of [8, 153]) {
      const { root, chromeIds } = await S.syntheticRoot(process.cwd(), n);
      runs[n] = { root, chromeIds, assets: S.buildAssets(root), loadersTs: readFileSync(join(root, 'src/howto/generated/loaders.ts'), 'utf8') };
    }
  }, 240_000);
  afterAll(() => { for (const r of Object.values(runs)) rmSync(r.root, { recursive: true, force: true }); });

  it('builds 8 and 153 shipped ids (counts asserted)', () => {
    expect(runs[8]!.chromeIds).toHaveLength(8);
    expect(runs[153]!.chromeIds).toHaveLength(153);
    expect(new Set(runs[153]!.chromeIds).size).toBe(153);
    expect(Object.keys(runs[153]!.assets).filter(f => /^ht-[\w-]+\.js$/.test(f))).toHaveLength(153);
  });
  it('HowToSheet-*.js has the same bytes at N = 8 and N = 153 and stays within its HT-3b budget at both', () => {
    const b = sheetBudget(), a = S.one(runs[8]!.assets, /^HowToSheet-[\w-]{8}\.js$/), z = S.one(runs[153]!.assets, /^HowToSheet-[\w-]{8}\.js$/);
    expect(z.raw).toBe(a.raw);
    expect(S.unhashed(z.buf)).toBe(S.unhashed(a.buf));
    for (const x of [a, z]) { expect(x.raw).toBeLessThanOrEqual(b.rawMax); expect(x.gz).toBeLessThanOrEqual(b.gzMax); }
    expect([b.rawMax, b.gzMax]).toEqual([30884, 10728]);
  });
  it('the HAND, POSTURE and FEEL keys equal the shipped chrome ids at both N', () => {
    for (const n of [8, 153]) expect(mapProblems(S.mapKeys(runs[n]!.loadersTs), runs[n]!.chromeIds), String(n)).toEqual([]);
  });
  it('loaders-*.js is within the per-id rule at both N', () => {
    const b = loadersBudget();
    for (const n of [8, 153]) {
      const l = S.one(runs[n]!.assets, /^loaders-[\w-]{8}\.js$/);
      expect(l.raw, `${n} raw`).toBeLessThanOrEqual(perIdCeiling(b.measuredRaw, n));
      expect(l.gz, `${n} gz`).toBeLessThanOrEqual(perIdCeiling(b.measuredGz, n));
    }
  });
});
