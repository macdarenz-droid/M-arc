import { describe, expect, it } from 'vitest';
import { substitutesFor } from '@/brain/substitute';
import { findExercise } from '@/core/exercises';

describe('substitutesFor (F3.7)', () => {
  it('only offers exercises sharing a primary muscle', () => {
    const bench = findExercise('lib_barbell_bench_press')!;
    const subs = substitutesFor(bench);
    expect(subs.length).toBeGreaterThan(0);
    expect(subs.every(e => e.primary.some(m => bench.primary.includes(m)))).toBe(true);
    expect(subs.some(e => e.id === bench.id)).toBe(false);
  });
  it('ranks a same-pattern, same-equipment-group substitute above a different-pattern one', () => {
    const bench = findExercise('lib_barbell_bench_press')!;
    const subs = substitutesFor(bench);
    const declineBench = subs.find(e => e.id === 'lib_decline_bench_press'); // same pattern, same equipment group (Barbell)
    const pecFly = subs.find(e => e.id === 'lib_pec_fly'); // different pattern, different equipment group
    expect(declineBench).toBeDefined();
    expect(pecFly).toBeDefined();
    expect(subs.indexOf(declineBench!)).toBeLessThan(subs.indexOf(pecFly!));
  });
});
