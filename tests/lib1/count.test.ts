// LIB-1 R1 (never merged): the clone build is complete. Every one of the 153 library ids has a How-to entry
// (hasHowTo) and a loader, in either wiring (tools/lib1/clone.mjs today|lib2). Red on an empty or short list.
import { describe, expect, it } from 'vitest';
import exercises from '@/data/exercises.json';
import { hasHowTo } from '@/howto/ids';
import { LOADERS } from '@/howto/generated';

const EXPECTED = 153;
/** The ids of `lib` that have both a How-to entry and a loader; throws unless that is all `EXPECTED` of them. */
export function howToCount(lib: readonly string[], loaders: Record<string, unknown>): number {
  const ok = lib.filter(id => hasHowTo(id) && typeof loaders[id] === 'function');
  if (lib.length !== EXPECTED || ok.length !== EXPECTED || Object.keys(loaders).length !== EXPECTED) {
    throw new Error(`expected ${EXPECTED} ids with How-to entries and loaders, got ${ok.length} of ${lib.length} (${Object.keys(loaders).length} loaders)`);
  }
  return ok.length;
}

describe('LIB-1 R1: 153 ids with How-to entries', () => {
  const lib = exercises.map(e => e.id);
  it('every exercises.json id has a How-to entry and a loader', () => {
    expect(howToCount(lib, LOADERS as Record<string, unknown>)).toBe(153);
  });
  it('is red on an empty list', () => {
    expect(() => howToCount([], LOADERS as Record<string, unknown>)).toThrow();
  });
  it('is red on a short list (one id dropped from the ids, or from the loaders)', () => {
    expect(() => howToCount(lib.slice(1), LOADERS as Record<string, unknown>)).toThrow();
    const short: Record<string, unknown> = { ...LOADERS }; delete short[lib[0]!];
    expect(() => howToCount(lib, short)).toThrow();
  });
  it('is red when hasHowTo misses an id', () => {
    expect(() => howToCount([...lib.slice(1), 'lib_not_an_exercise'], LOADERS as Record<string, unknown>)).toThrow();
  });
});
