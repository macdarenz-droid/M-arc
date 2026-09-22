import { describe, expect, it } from 'vitest';
import type { Exercise, LoggedSet, Session } from '@/core/models';
import { liftTrajectory } from '@/brain/trajectory';
import { addDays } from '@/core/dates';
import { session } from './helpers';

const BENCH = 'lib_barbell_bench_press';
const LAST = '2026-09-01';
const log = (day: string, kg: number, id = BENCH, sets: LoggedSet[] = [{ kg, reps: 8 }]): Session => session(day, [{ id, sets }]);
const linear = (count = 8, gain = 1, start = 43): Session[] => Array.from({ length: count }, (_, index) => log(addDays(LAST, (index - count + 1) * 7), start + index * gain));

describe('liftTrajectory', () => {
  it('recovers absolute kg per week from the existing relative trend', () => {
    const result = liftTrajectory(linear(), BENCH, LAST)!;
    expect(result).toMatchObject({ status: 'projected', points: 8, currentKg: 50, stepKg: 2.5, nextKg: 52.5, kgPerWeek: 1, projectedOn: '2026-09-19', expiresOn: '2026-10-10', confidence: 'medium' });
  });

  it('requires seven points spanning 28 days and an upward medium-confidence trend', () => {
    expect(liftTrajectory(linear(6), BENCH, LAST)).toBeNull();
    const crowded = Array.from({ length: 7 }, (_, index) => log(addDays(LAST, index - 6), 40 + index));
    expect(liftTrajectory(crowded, BENCH, LAST)).toBeNull();
    expect(liftTrajectory(linear(8, 0), BENCH, LAST)).toBeNull();
    expect(liftTrajectory(linear(8, -1, 50), BENCH, LAST)).toBeNull();
    expect(liftTrajectory(linear(), 'missing_exercise', LAST)).toBeNull();
  });

  it('collapses same-day sessions to the largest top load without inflating evidence', () => {
    const rows = linear();
    rows.push(log(LAST, 45), log(LAST, 50));
    expect(liftTrajectory(rows, BENCH, LAST)).toMatchObject({ points: 8, currentKg: 50 });
  });

  it('excludes future and invalid-day sessions and nonfinite or nonpositive loads', () => {
    const result = liftTrajectory([
      ...linear(),
      log('2026-09-08', 200),
      log('2026-02-30', 200),
      log('2026-08-30', Number.NaN),
      log('2026-08-29', 0),
    ], BENCH, LAST)!;
    expect(result).toMatchObject({ points: 8, currentKg: 50, kgPerWeek: 1 });
  });

  it('anchors projected and expiry dates to the last observation across later opens', () => {
    const first = liftTrajectory(linear(), BENCH, LAST)!;
    const later = liftTrajectory(linear(), BENCH, '2026-09-10')!;
    expect(later.projectedOn).toBe(first.projectedOn);
    expect(later.expiresOn).toBe(first.expiresOn);
  });

  it('expires after its deadline or a stale last observation without extending dates', () => {
    const deadline = liftTrajectory(linear(), BENCH, '2026-10-11')!;
    const stale = liftTrajectory(linear(8, 2), BENCH, '2026-09-30')!;
    expect(deadline.status).toBe('expired');
    expect(deadline.projectedOn).toBe('2026-09-19');
    expect(stale.status).toBe('expired');
  });

  it('recomputes from new or edited history', () => {
    const original = liftTrajectory(linear(), BENCH, LAST)!;
    const withNew = liftTrajectory([...linear(), log('2026-09-08', 52)], BENCH, '2026-09-08')!;
    const edited = linear();
    edited[edited.length - 1] = log(LAST, 52);
    expect(withNew.lastDay).toBe('2026-09-08');
    expect(withNew.projectedOn).not.toBe(original.projectedOn);
    expect(liftTrajectory(edited, BENCH, LAST)!.kgPerWeek).not.toBe(original.kgPerWeek);
  });

  it('rejects a horizon beyond 84 days instead of clamping it', () => {
    // A low but clearly positive relative slope passes trend(), while the
    // one-kilogram load step would still take far longer than twelve weeks.
    expect(liftTrajectory(linear(8, 0.01, 0.3), BENCH, LAST)).toBeNull();
  });

  it('excludes bodyweight, assisted, duration and conditioning modes', () => {
    for (const id of ['lib_push_up', 'lib_assisted_pull_up', 'lib_plank', 'lib_sled_push']) {
      expect(liftTrajectory(linear().map(row => ({ ...row, exercises: [{ ...row.exercises[0]!, exerciseId: id, name: id }] })), id, LAST)).toBeNull();
    }
  });

  it('supports known weighted custom exercises', () => {
    const custom: Exercise = { id: 'custom_press', name: 'Custom press', equipment: 'Barbell', primary: ['chest'], secondary: [], stabilizers: [], aliases: [], pattern: 'horizontal_push', defaultSets: 3, mode: 'weighted' };
    const rows = linear().map(row => ({ ...row, exercises: [{ ...row.exercises[0]!, exerciseId: custom.id, name: custom.name }] }));
    expect(liftTrajectory(rows, custom.id, LAST, [custom])).toMatchObject({ exerciseId: custom.id, kgPerWeek: 1 });
  });
});
