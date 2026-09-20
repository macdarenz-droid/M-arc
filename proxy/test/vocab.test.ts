/**
 * The Worker's closed vocabularies (proxy/src/vocab.ts) are a manual copy of
 * the app's real ones, so the model can only ever pick a muscle or pattern
 * the app understands. This test reads the app's actual source files at
 * runtime — not through tsc, so a proxy-only `npm run check` never needs the
 * app to build — and fails loudly the moment the two drift apart.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { EXERCISE_CATALOG, MUSCLE_IDS, PATTERNS } from '../src/vocab';

const here = dirname(fileURLToPath(import.meta.url));
const appSrc = join(here, '..', '..', 'src');

describe('vocab stays in sync with the app', () => {
  it('every muscle id in muscles.ts is in the Worker vocab, and nothing extra', () => {
    const text = readFileSync(join(appSrc, 'data', 'muscles.ts'), 'utf8');
    const ids = [...text.matchAll(/id:\s*'([a-z_]+)'/g)].map(m => m[1]);
    expect(ids.length).toBeGreaterThan(0);
    expect([...MUSCLE_IDS].sort()).toEqual([...new Set(ids)].sort());
  });

  it('every pattern used in exercises.json is in the Worker vocab', () => {
    const raw = readFileSync(join(appSrc, 'data', 'exercises.json'), 'utf8');
    const library = JSON.parse(raw) as Array<{ pattern: string }>;
    const used = new Set(library.map(e => e.pattern));
    expect(used.size).toBeGreaterThan(0);
    for (const p of used) expect(PATTERNS as readonly string[], `pattern "${p}" used in exercises.json is missing from proxy/src/vocab.ts`).toContain(p);
  });

  it('EXERCISE_CATALOG has exactly the same ids, names and primary muscles as the app\'s real library', () => {
    const raw = readFileSync(join(appSrc, 'data', 'exercises.json'), 'utf8');
    const library = JSON.parse(raw) as Array<{ id: string; name: string; primary?: string[] }>;
    expect(library.length).toBeGreaterThan(0);
    expect(EXERCISE_CATALOG.length).toBe(library.length);
    const expected = new Set(library.map(e => `${e.id}|${e.name}|${(e.primary ?? []).join(',')}`));
    const actual = new Set(EXERCISE_CATALOG);
    expect(actual).toEqual(expected);
  });
});
