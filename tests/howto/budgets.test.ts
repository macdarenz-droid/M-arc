// HT-3c (B3, D-HT3c-1): tests/howto/budgets.json holds every How-to chunk ceiling the HT-3b gate block
// (scripts/screenshot-gate.mjs, A2) enforces. Its shape is checked here, and so is the rule that every
// ceiling sits between its measured value and measured + 10 % (rounded up): a ceiling cannot be raised
// without re-measuring the chunk and recording who did it and why.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SHIPPED } from './shipped-rows';

interface Budget { chunk: string; rawMax: number; gzMax: number; measuredRaw: number; measuredGz: number; setBy: string; reason: string }

const file = JSON.parse(readFileSync('tests/howto/budgets.json', 'utf8')) as { budgets: Budget[] };
const rows = JSON.parse(readFileSync('tools/plates/plates.json', 'utf8')) as Record<string, { slug: string }>;
const KEYS = ['chunk', 'rawMax', 'gzMax', 'measuredRaw', 'measuredGz', 'setBy', 'reason'];
const ceil10 = (v: number) => Math.ceil(v * 1.1);

describe('HT-3c B3: tests/howto/budgets.json', () => {
  it('is a non-empty list of entries with exactly the documented fields', () => {
    expect(Array.isArray(file.budgets) && file.budgets.length > 0).toBe(true);
    for (const b of file.budgets) {
      expect(Object.keys(b).sort(), b.chunk).toEqual([...KEYS].sort());
      expect(b.chunk, JSON.stringify(b)).toMatch(/^[A-Za-z0-9][\w-]*-\*\.(js|css)$/);
      for (const k of ['rawMax', 'gzMax', 'measuredRaw', 'measuredGz'] as const) expect(Number.isInteger(b[k]) && b[k] > 0, `${b.chunk} ${k}`).toBe(true);
      expect(b.setBy, b.chunk).toMatch(/^[A-Z][A-Z0-9]*-[A-Za-z0-9]+(-[A-Za-z0-9]+)*$/);
      expect(b.reason.trim().length, `${b.chunk} reason`).toBeGreaterThanOrEqual(10);
    }
  });

  it('names each chunk once', () => {
    const names = file.budgets.map(b => b.chunk);
    expect(new Set(names).size).toBe(names.length);
  });

  it('keeps every ceiling within measured .. measured + 10 % (rounded up)', () => {
    for (const b of file.budgets) {
      expect(b.rawMax, `${b.chunk} rawMax`).toBeGreaterThanOrEqual(b.measuredRaw);
      expect(b.rawMax, `${b.chunk} rawMax (measured ${b.measuredRaw} + 10 %)`).toBeLessThanOrEqual(ceil10(b.measuredRaw));
      expect(b.gzMax, `${b.chunk} gzMax`).toBeGreaterThanOrEqual(b.measuredGz);
      expect(b.gzMax, `${b.chunk} gzMax (measured ${b.measuredGz} + 10 %)`).toBeLessThanOrEqual(ceil10(b.measuredGz));
    }
  });

  it('has an entry for every chunk the gate budgets, and no stale ht-<slug> entry', () => {
    // LIB-2b (lib4-cards 11.1 item 6): the registry's shipped rows, not the 8 alone; at the 8 nothing changes
    expect(Object.keys(rows)).toEqual(SHIPPED.slice(0, 8).map(r => r.id));
    const slugs = SHIPPED.map(r => `ht-${r.slug}-*.js`);
    const names = file.budgets.map(b => b.chunk);
    for (const c of ['HowToSheet-*.js', 'HowToSheet-*.css', ...slugs]) expect(names, c).toContain(c);
    for (const n of names) if (/^ht-.*\.js$/.test(n)) expect(slugs, n).toContain(n);
  });

  it('LIB-2b: every shipped row\'s posture- and feel- chunk has an entry, and none is stale', () => {
    const names = file.budgets.map(b => b.chunk);
    for (const kind of ['posture', 'feel']) {
      const want = SHIPPED.map(r => `${kind}-${r.chromeId}-*.js`);
      for (const c of want) expect(names, c).toContain(c);
      for (const n of names) if (n.startsWith(`${kind}-`)) expect(want, n).toContain(n);
    }
  });
});
