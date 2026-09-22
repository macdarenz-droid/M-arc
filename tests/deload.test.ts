import { describe, expect, it } from 'vitest';
import { deloadTrigger } from '@/brain/deload';
import { session, sets } from './helpers';

const today = '2026-09-18';

describe('deloadTrigger (F3.3)', () => {
  it('does not suggest a deload with no history and clean readiness', () => {
    expect(deloadTrigger([], today, [], []).suggest).toBe(false);
  });

  it('suggests a deload when two or more main lifts have plateaued or declined', () => {
    const days = ['2026-08-20', '2026-08-24', '2026-08-27', '2026-08-31', '2026-09-03', '2026-09-07', '2026-09-10', '2026-09-14', '2026-09-17'];
    const s = days.flatMap((d, i) => [
      session(d, [{ id: 'lib_barbell_bench_press', sets: sets(70 - i * 2.5, 9, 'ideal') }]),
      session(d, [{ id: 'lib_barbell_back_squat', sets: sets(100 - i * 2.5, 9, 'ideal') }], 'split_legs'),
    ]);
    const r = deloadTrigger(s, today, [], []);
    expect(r.suggest).toBe(true);
    expect(r.reason).toMatch(/plateaued or slipped/);
  });

  it('suggests a deload when readiness has read red on 3 of the last 5 days', () => {
    const r = deloadTrigger([], today, [], ['red', 'green', 'red', 'amber', 'red']);
    expect(r.suggest).toBe(true);
    expect(r.reason).toMatch(/red on three or more/);
  });

  it('does not suggest a deload for readiness red on only 2 of the last 5 days', () => {
    const r = deloadTrigger([], today, [], ['red', 'green', 'red', 'amber', 'green']);
    expect(r.suggest).toBe(false);
  });
});
