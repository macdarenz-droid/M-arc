import { describe, expect, it } from 'vitest';
import { findExercise } from '@/core/exercises';
import type { ActiveSession, LoggedSet, PlanSetTarget } from '@/core/models';
import { autoregulate, effectiveSetTarget, isReducedTarget, nextAfterRest } from '@/brain/live';

const bench = findExercise('lib_barbell_bench_press')!;
const target = (kg = 60, reps = 8): PlanSetTarget => ({ kg, reps, durationSec: null });
const input = (sets: LoggedSet[], over: Partial<Parameters<typeof autoregulate>[0]> = {}) => ({
  exercise: bench,
  goal: 'lean' as const,
  sets,
  targets: sets.map(() => target()),
  sourceSet: 0,
  deloadActive: false,
  decisionTaken: false,
  historyBacked: true,
  allowIncrease: true,
  ...over,
});

describe('effectiveSetTarget', () => {
  it('uses a valid row override, otherwise the last captured target, and always returns a copy', () => {
    const base = [target(60, 8), target(60, 7)];
    const overrides = [null, target(57.5, 8)];
    const overridden = effectiveSetTarget(base, overrides, 1)!;
    expect(overridden).toEqual(target(57.5, 8));
    overridden.kg = 1;
    expect(overrides[1]!.kg).toBe(57.5);
    expect(effectiveSetTarget(base, undefined, 4)).toEqual(target(60, 7));
    expect(effectiveSetTarget(base, [{ kg: -1, reps: 8, durationSec: null }], 0)).toEqual(target(60, 8));
    expect(effectiveSetTarget([], undefined, 0)).toBeNull();
    expect(effectiveSetTarget(base, undefined, -1)).toBeNull();
    expect(effectiveSetTarget(base, undefined, 0.5)).toBeNull();
  });

  it('reports only a comparable kg or rep reduction', () => {
    expect(isReducedTarget(target(60, 8), target(57.5, 8))).toBe(true);
    expect(isReducedTarget(target(60, 8), target(60, 7))).toBe(true);
    expect(isReducedTarget(target(60, 8), target(60, 9))).toBe(false);
    expect(isReducedTarget({ kg: null, reps: 8, durationSec: null }, { kg: 0, reps: 8, durationSec: null })).toBe(false);
    expect(isReducedTarget(null, target())).toBe(false);
  });
});

describe('autoregulate', () => {
  it('offers one load step after a max-effort two-rep miss and never mutates actuals', () => {
    const sets: LoggedSet[] = [{ kg: 60, reps: 6, effort: 'max' }, {}, {}];
    const before = structuredClone(sets);
    const offer = autoregulate(input(sets));
    expect(offer).toMatchObject({
      sourceSet: 0,
      direction: 'down',
      reason: 'max_below_target',
      actualKg: 60,
      actualReps: 6,
      targetReps: 8,
      next: target(57.5, 8),
      remainingIndices: [1, 2],
      remainingSets: 2,
    });
    expect(sets).toEqual(before);
  });

  it('does not call a deliberate different load a target miss', () => {
    expect(autoregulate(input([{ kg: 57.5, reps: 5, effort: 'max' }, {}]))).toBeNull();
    expect(autoregulate(input([{ kg: 60.02, reps: 5, effort: 'max' }, {}]))).toBeNull();
  });

  it('protects every later draft and adjusts only entirely untouched rows', () => {
    const offer = autoregulate(input([{ kg: 60, reps: 6, effort: 'max' }, { kg: 60 }, { effort: 'easy' }, {}]));
    expect(offer?.remainingIndices).toEqual([3]);
    expect(autoregulate(input([{ kg: 60, reps: 6, effort: 'max' }, { kg: 60 }, { effort: 'easy' }]))).toBeNull();
  });

  it('offers one rep after two easy surplus sets within the goal band', () => {
    const sets: LoggedSet[] = [{ kg: 60, reps: 10, effort: 'easy' }, { kg: 60, reps: 10, effort: 'easy' }, {}, {}];
    const offer = autoregulate(input(sets, { sourceSet: 1 }));
    expect(offer).toMatchObject({ direction: 'up', reason: 'easy_above_target', next: target(60, 9), remainingIndices: [2, 3] });
  });

  it('requires two qualifying easy rows, increase permission, and room in the rep band', () => {
    expect(autoregulate(input([{ kg: 60, reps: 10, effort: 'easy' }, {}]))).toBeNull();
    const twoEasy: LoggedSet[] = [{ kg: 60, reps: 10, effort: 'easy' }, { kg: 60, reps: 10, effort: 'easy' }, {}];
    expect(autoregulate(input(twoEasy, { sourceSet: 1, allowIncrease: false }))).toBeNull();
    expect(autoregulate(input(twoEasy, { sourceSet: 1, targets: twoEasy.map(() => target(60, 12)) }))).toBeNull();
  });

  it.each([6, 8, 9])('does not increase after a current easy set of %i reps despite two earlier surplus sets', reps => {
    const sets: LoggedSet[] = [
      { kg: 60, reps: 10, effort: 'easy' },
      { kg: 60, reps: 10, effort: 'easy' },
      { kg: 60, reps, effort: 'easy' },
      {},
    ];
    expect(autoregulate(input(sets, { sourceSet: 2 }))).toBeNull();
  });

  it('blocks an upward offer during a deload but still permits a conservative downward offer', () => {
    const easy: LoggedSet[] = [{ kg: 51, reps: 10, effort: 'easy' }, { kg: 51, reps: 10, effort: 'easy' }, {}];
    expect(autoregulate(input(easy, { sourceSet: 1, targets: easy.map(() => target(51, 8)), deloadActive: true }))).toBeNull();
    const miss: LoggedSet[] = [{ kg: 51, reps: 6, effort: 'max' }, {}];
    expect(autoregulate(input(miss, { targets: miss.map(() => target(51, 8)), deloadActive: true }))?.next).toEqual(target(48.5, 8));
  });

  it('requires a captured history plan, weighted exercise, valid source, and no prior decision', () => {
    const sets: LoggedSet[] = [{ kg: 60, reps: 6, effort: 'max' }, {}];
    expect(autoregulate(input(sets, { historyBacked: false }))).toBeNull();
    expect(autoregulate(input(sets, { decisionTaken: true }))).toBeNull();
    expect(autoregulate(input(sets, { sourceSet: 9 }))).toBeNull();
    expect(autoregulate(input(sets, { exercise: findExercise('lib_push_up') }))).toBeNull();
  });

  it('makes a stable evidence key that changes with the source facts', () => {
    const a = autoregulate(input([{ kg: 60, reps: 6, effort: 'max' }, {}]))!;
    const b = autoregulate(input([{ kg: 60, reps: 6, effort: 'max' }, {}]))!;
    const changed = autoregulate(input([{ kg: 60, reps: 5, effort: 'max' }, {}]))!;
    expect(a.key).toBe(b.key);
    expect(changed.key).not.toBe(a.key);
  });
});

describe('nextAfterRest effective target', () => {
  it('uses the caller-resolved target vector without falling back to the suggestion', () => {
    const entries: ActiveSession['entries'] = [{ exerciseId: bench.id, name: bench.name, sets: [{ kg: 60, reps: 6 }, {}], done: false, skipped: false }];
    expect(nextAfterRest(entries, { entry: 0, set: 0 }, null, [target(60, 8), target(57.5, 8)])).toEqual({
      kind: 'set', setNumber: 2, kg: 57.5, reps: 8, durationSec: null,
    });
    expect(nextAfterRest(entries, { entry: 0, set: 0 }, null, [target(60, 8), null])).toEqual({
      kind: 'set', setNumber: 2, kg: null, reps: null, durationSec: null,
    });
  });
});
