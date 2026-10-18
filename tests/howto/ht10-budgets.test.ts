// HT-10 (D-HT10-A4): the total How-to asset ceiling in tests/howto/budgets.json `totals`, under the D-HT3c-1 rule:
// measured .. measured + 10 % (rounded up), with who set it and why. Gate block HT-10 (A4) enforces it on www/assets.
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';

interface Total { chunk: string; rawMax: number; gzMax: number; measuredRaw: number; measuredGz: number; setBy: string; reason: string }
const file = JSON.parse(readFileSync('tests/howto/budgets.json', 'utf8')) as { totals?: Total[] };
const ceil10 = (v: number) => Math.ceil(v * 1.1);

describe('D-HT10-A4: the How-to total ceiling', () => {
  it('has exactly one "How-to total" entry with the documented fields', () => {
    expect(file.totals?.map(t => t.chunk)).toEqual(['How-to total']);
    const t = file.totals![0]!;
    expect(Object.keys(t).sort()).toEqual(['chunk', 'gzMax', 'measuredGz', 'measuredRaw', 'rawMax', 'reason', 'setBy']);
    for (const k of ['rawMax', 'gzMax', 'measuredRaw', 'measuredGz'] as const) expect(Number.isInteger(t[k]) && t[k] > 0, k).toBe(true);
    expect(t.setBy).toMatch(/^[A-Z][A-Z0-9]*-[A-Za-z0-9]+$/);
    expect(t.reason.trim().length).toBeGreaterThanOrEqual(10);
  });
  it('keeps the ceiling within measured .. measured + 10 % (rounded up), per shipped id past the 8 (LIB-2 rule)', async () => {
    const t = file.totals![0]!;
    // LIB-4a (D-LIB4-PINS-2): measured is the 8's; at N shipped ids the + 10 % bound is LIB-2's per-id rule
    // (budgets/total.mjs totalCeiling = ceil(measured x 11 x N / 80), which is ceil10 at N = 8)
    const reg = await import(/* @vite-ignore */ new URL('../../tools/plates/library/registry.mjs', import.meta.url).href) as { shippedIds: () => string[] };
    const { totalCeiling } = await import(/* @vite-ignore */ new URL('../../tools/plates/library/budgets/total.mjs', import.meta.url).href) as { totalCeiling: (m: number, n: number) => number };
    const n = reg.shippedIds().length;
    expect(reg.shippedIds().slice(0, 8)).toEqual(Object.keys(JSON.parse(readFileSync('tools/plates/plates.json', 'utf8'))));   // the 8 ship first, in plates.json order
    const upper = (v: number) => (n === 8 ? ceil10(v) : totalCeiling(v, n));
    expect(t.rawMax).toBeGreaterThanOrEqual(t.measuredRaw);
    expect(t.rawMax).toBeLessThanOrEqual(upper(t.measuredRaw));
    expect(t.gzMax).toBeGreaterThanOrEqual(t.measuredGz);
    expect(t.gzMax).toBeLessThanOrEqual(upper(t.measuredGz));
  });
});

describe('D-HT10-A3m: the tap-to-plate tripwire', () => {
  type M = { ms: number; where: string };
  let T: { HT10_TAP_MEDIANS: { ci: M[]; container: M[] }; HT10_TAP_CAP_MS: number; ht10TapLimit: (m?: { ci: M[]; container: M[] }) => number; ht10TapProblem: (median: number, limit: number) => string | null };
  beforeAll(async () => { T = await import(/* @vite-ignore */ new URL('../../tools/plates/fidelity/ht10.mjs', import.meta.url).href); });
  it('is set from at least 3 CI and 3 agent-container medians, each with where it ran', () => {
    const { ci, container } = T.HT10_TAP_MEDIANS;
    expect(ci.length).toBeGreaterThanOrEqual(3);
    expect(container.length).toBeGreaterThanOrEqual(3);
    for (const m of [...ci, ...container]) { expect(Number.isInteger(m.ms) && m.ms > 0).toBe(true); expect(m.where).toMatch(/\b[0-9a-f]{7}\b/); }
    for (const m of ci) expect(m.where).toMatch(/^CI /);
  });
  it('is ceil(1.25 x the highest median), capped at 400 ms', () => {
    const all = [...T.HT10_TAP_MEDIANS.ci, ...T.HT10_TAP_MEDIANS.container].map(m => m.ms);
    expect(T.HT10_TAP_CAP_MS).toBe(400);
    expect(T.ht10TapLimit()).toBe(Math.min(400, Math.ceil(1.25 * Math.max(...all))));
    expect(T.ht10TapLimit({ ci: [{ ms: 390, where: 'x' }], container: [] })).toBe(400);
  });
  it('trips 1 ms over its limit and not at it', () => {
    const lim = T.ht10TapLimit();
    expect(T.ht10TapProblem(lim, lim)).toBeNull();
    expect(T.ht10TapProblem(lim + 1, lim)).toMatch(/over \d+ ms/);
    for (const m of [...T.HT10_TAP_MEDIANS.ci, ...T.HT10_TAP_MEDIANS.container]) expect(T.ht10TapProblem(m.ms, m.ms - 1)).not.toBeNull();
  });
});
