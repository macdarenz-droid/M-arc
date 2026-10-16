/** A3 verify ENG-02: red readiness and the lighter week cut from today's planned rows, not last session's count. */
import { describe, it, expect } from 'vitest';
import { setAsideRows } from '@/slices/workout/Train';
import { suggestNext } from '@/brain/progression';
import type { LoggedSet } from '@/core/models';
import { session, sets } from '../helpers';

const BENCH = 'lib_barbell_bench_press';
const TODAY = '2026-09-22';
const red = { readiness: { loadAdvice: 'reduce' as const } };
const week = { startDay: '2026-09-21', endDay: '2026-09-27', reason: 'test', setFactor: 0.6, loadFactor: 0.9 };
const blank = (n: number): LoggedSet[] => Array.from({ length: n }, () => ({}) as LoggedSet);
const prior = (n: number) => [session('2026-09-18', [{ id: BENCH, sets: sets(60, 8, 'ideal', n) }])];
const usable = (aside: boolean[]) => aside.filter(x => !x).length;

describe('ENG-02: reductions apply to the current plan', () => {
  it('prior 6 sets, current plan 3, red day: 2 usable rows', () => {
    const next = suggestNext(prior(6), BENCH, 'lean', TODAY, 3, [], red);
    expect(usable(setAsideRows(next, blank(3))), `suggested ${next.sets.length} sets`).toBe(2);
  });

  it('prior 3 sets, current plan 6, red day: 5 usable rows (no excessive cut)', () => {
    const next = suggestNext(prior(3), BENCH, 'lean', TODAY, 6, [], red);
    expect(usable(setAsideRows(next, blank(6))), `suggested ${next.sets.length} sets`).toBe(5);
  });

  it('prior red-day session already cut to 2 of 3; today red again: 2 usable rows (no compounding)', () => {
    const next = suggestNext(prior(2), BENCH, 'lean', TODAY, 3, [], red);
    expect(usable(setAsideRows(next, blank(3))), `suggested ${next.sets.length} sets`).toBe(2);
  });

  it('prior 5 sets, current plan 3, lighter week (x0.6): round(3*0.6) = 2 usable rows', () => {
    const next = suggestNext(prior(5), BENCH, 'lean', TODAY, 3, [], { deload: week });
    expect(usable(setAsideRows(next, blank(3))), `suggested ${next.sets.length} sets`).toBe(2);
  });

  it('lighter week after a red-day session cut to 2 of 3: round(3*0.6) = 2 usable rows (no compounding)', () => {
    const next = suggestNext(prior(2), BENCH, 'lean', TODAY, 3, [], { deload: week });
    expect(usable(setAsideRows(next, blank(3))), `suggested ${next.sets.length} sets`).toBe(2);
  });

  it('related: a carry in a lighter week also takes the set factor (only timed holds are exempt, D-A1)', () => {
    const CARRY = 'lib_farmer_s_carry';
    const carry = [session('2026-09-18', [{ id: CARRY, sets: Array.from({ length: 3 }, () => ({ kg: 24, distanceM: 40, effort: 'ideal' as const })) }])];
    const next = suggestNext(carry, CARRY, 'lean', TODAY, 3, [], { deload: week });
    expect(next.mode, 'precondition: the carry takes its distance path').toBe('distance');
    expect(usable(setAsideRows(next, blank(3))), `mode ${next.mode}, ${next.sets.length} sets, cutSets ${next.cutSets}`).toBe(2);
  });
});
