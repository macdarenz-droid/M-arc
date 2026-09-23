import { describe, it, expect } from 'vitest';
import { volumeChartWeeks } from '@/slices/history/volumeChart';
import { session, sets } from './helpers';

describe('weekly volume chart order (QA-R6-2)', () => {
  it('draws oldest to newest, so the last bar is this week', () => {
    const s = [session('2026-09-22', [{ id: 'lib_barbell_bench_press', sets: sets(100, 5, 'ideal', 3) }]), session('2026-07-07', [{ id: 'lib_barbell_bench_press', sets: sets(50, 5, 'ideal', 1) }])];
    const w = volumeChartWeeks(s, '2026-09-23', [], 'kg');
    expect(w).toHaveLength(12);
    expect(w.at(-1)).toEqual({ week: '2026-09-21', value: 1500 });
    expect(w[0]!.value).toBe(250);
    expect(w.map(x => x.week)).toEqual([...w.map(x => x.week)].sort());
  });
});
