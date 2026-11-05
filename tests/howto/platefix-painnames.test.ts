// LIB-PLATEFIX-1, D-PF-PAINNAMES (#385 6653463370): a feel row's screen-reader label names the marked region in words,
// never a raw body-map part id. Reads every built page this repo pins: the committed library layers pages and the
// generated app feel chunks, and checks every data-label against the body map's part ids.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
// @ts-expect-error untyped .mjs
import { BACK_PARTS, FRONT_PARTS } from '../../tools/plates/layers/engine/bodymap-parts.mjs';

const ROOT = join(__dirname, '..', '..');
const GOLDEN = 'tests/howto/golden/library', GEN = 'src/howto/generated';
const PAGES = [
  ...readdirSync(join(ROOT, GOLDEN)).filter(f => f.endsWith('.layers.html')).map(f => `${GOLDEN}/${f}`),
  ...readdirSync(join(ROOT, GEN)).filter(f => /^feel-.*\.ts$/.test(f)).map(f => `${GEN}/${f}`),
];
// part ids that are not plain words (every id with a hyphen, e.g. lower-back-erectors-left, knee-left)
const IDS: string[] = [...new Set<string>([...FRONT_PARTS, ...BACK_PARTS].map((p: { id: string }) => p.id))].filter(id => id.includes('-'));
const RAW = new RegExp(`(?<![\\w-])(?:${IDS.map(s => s.replace(/[-]/g, '\\-')).join('|')})(?![\\w-])`);
const labels = (src: string) => [...src.matchAll(/data-label=\\?"([^"\\]*)/g)].map(m => m[1] ?? '');
const rawIn = (src: string) => labels(src).filter(l => RAW.test(l));

describe('D-PF-PAINNAMES: no data-label on a built page holds a raw body-map part id', () => {
  it('the pages exist and carry feel labels', () => {
    expect(PAGES.filter(p => p.endsWith('.layers.html')).length).toBeGreaterThanOrEqual(3);
    expect(PAGES.reduce((n, p) => n + labels(readFileSync(join(ROOT, p), 'utf8')).length, 0)).toBeGreaterThan(50);
  });
  for (const p of PAGES) it(p, () => expect(rawIn(readFileSync(join(ROOT, p), 'utf8'))).toEqual([]));
  // The source's PAIN_NAMES table (howto-layers.mjs, MANIFEST-pinned golden B, add-only) names every part a library
  // How-to marks as pain, so a page built from them can carry no raw id.
  const SRC = readFileSync(join(ROOT, 'tools/plates/layers/artifact/howto-layers.mjs'), 'utf8');
  const TABLE = SRC.match(/const PAIN_NAMES = (\[[\s\S]*?\]\]);/)?.[1] ?? '';
  const NAMES: [RegExp, string][] = new Function(`return ${TABLE}`)();
  const named = (part: string) => NAMES.find(([re]) => re.test(part))?.[1];
  it('every library pain-row part has a PAIN_NAMES name (D-PF-PAINNAMES adds lower back, front shoulders)', async () => {
    expect(named('lower-back-erectors-left')).toBe('lower back');
    expect(named('lower-back-ql-right')).toBe('lower back');
    expect(named('shoulder-front-left')).toBe('front shoulders');
    expect(named('neck-left')).toBe('neck');   // crunch's neck row (pilot-b2)
    expect(named('foot-right')).toBe('feet');   // box_jump's ankle row (pilot-a2)
    const dir = join(ROOT, 'tools/plates/library/howto');
    const parts = new Set<string>();
    for (const f of readdirSync(dir).filter(n => n.endsWith('.howto.mjs'))) {
      const H = (await import(join(dir, f))).default;
      for (const r of H?.feel?.rows ?? []) for (const p of r.at?.parts ?? []) parts.add(p);
    }
    expect(parts.size).toBeGreaterThan(0);
    expect([...parts].filter(p => !named(p))).toEqual([]);
  });
  it('mutation: a label naming raw part ids is caught, a worded one is not', () => {
    expect(rawIn('<button data-label="Main: x. Marked: lower-back-erectors-left and lower-back-ql-right.">')).toHaveLength(1);
    expect(rawIn('<b data-label=\\"Marked: shoulder-front-left.\\">')).toHaveLength(1);
    expect(rawIn('<b data-label="Main: lower back, hamstrings. Marked: knees.">')).toEqual([]);
  });
});
