import { describe, expect, it } from 'vitest';
import type { LoggedSet, PlanSetTarget, ResistanceMode } from '@/core/models';
import { liveRecordFrom, prReach, recordsFor } from '@/brain/prs';
import { summarizeSets, type ExerciseSessionSummary } from '@/brain/history';

const target = (kg: number | null, reps: number | null): PlanSetTarget => ({ kg, reps, durationSec: null });
const history = (sets: LoggedSet[]): ExerciseSessionSummary[] => [summarizeSets('prior', '2026-09-01', sets)];

describe('reachable rep records', () => {
  it('known 60 kg record of 8 offers 9 within target and goal ceiling', () => {
    expect(prReach({ prior: history([{ kg: 60, reps: 8 }]), mode: 'weighted', target: target(60, 8), repCeiling: 10, earlierSets: [], deloadActive: false, reducedTarget: false })).toEqual({
      kind: 'reps_at_load', kg: 60, standingReps: 8, requiredReps: 9,
    });
  });

  it('unknown load and first session produce no reachable PR', () => {
    const prior = history([{ kg: 60, reps: 8 }]);
    expect(prReach({ prior, mode: 'weighted', target: target(62.5, 8), repCeiling: 10, earlierSets: [], deloadActive: false, reducedTarget: false })).toBeNull();
    expect(prReach({ prior: [], mode: 'weighted', target: target(60, 8), repCeiling: 10, earlierSets: [], deloadActive: false, reducedTarget: false })).toBeNull();
  });

  it('two reps beyond target and above goal ceiling are suppressed', () => {
    const prior = history([{ kg: 60, reps: 9 }]);
    const base = { prior, mode: 'weighted' as const, target: target(60, 8), earlierSets: [], deloadActive: false, reducedTarget: false };
    expect(prReach({ ...base, repCeiling: 12 })).toBeNull();
    expect(prReach({ ...base, target: target(60, 10), repCeiling: 9 })).toBeNull();
  });

  it('earlier record today prevents another escalating rep challenge', () => {
    expect(prReach({ prior: history([{ kg: 60, reps: 8 }]), mode: 'weighted', target: target(60, 9), repCeiling: 10, earlierSets: [{ kg: 60, reps: 9 }], deloadActive: false, reducedTarget: false })).toBeNull();
  });

  it('supports bodyweight but excludes assisted, duration, conditioning and active deload', () => {
    const prior = history([{ reps: 8 }]);
    const base = { prior, target: target(null, 8), repCeiling: 10, earlierSets: [], deloadActive: false, reducedTarget: false };
    expect(prReach({ ...base, mode: 'bodyweight' })).toEqual({ kind: 'best_reps', kg: null, standingReps: 8, requiredReps: 9 });
    for (const mode of ['assisted', 'duration', 'conditioning'] as ResistanceMode[]) expect(prReach({ ...base, mode })).toBeNull();
    expect(prReach({ ...base, mode: 'bodyweight', deloadActive: true })).toBeNull();
  });

  it('accepted lower target hides reach without changing actuals', () => {
    const earlierSets = [{ kg: 60, reps: 7, effort: 'ideal' as const }];
    const before = structuredClone(earlierSets);
    expect(prReach({ prior: history([{ kg: 60, reps: 8 }]), mode: 'weighted', target: target(60, 8), repCeiling: 10, earlierSets, deloadActive: false, reducedTarget: true })).toBeNull();
    expect(earlierSets).toEqual(before);
  });

  it('rejects missing and non-finite inputs', () => {
    const prior = history([{ kg: 60, reps: 8 }]);
    const base = { prior, mode: 'weighted' as const, repCeiling: 10, earlierSets: [], deloadActive: false, reducedTarget: false };
    expect(prReach({ ...base, target: null })).toBeNull();
    expect(prReach({ ...base, target: target(60, null) })).toBeNull();
    expect(prReach({ ...base, target: target(Number.NaN, 8) })).toBeNull();
    expect(prReach({ ...base, target: target(60, 8), repCeiling: Number.POSITIVE_INFINITY })).toBeNull();
  });
});

describe('live record extraction', () => {
  it('matches the former recordsFor core across every mode and empty history', () => {
    const cases: Array<{ mode: ResistanceMode; prior: LoggedSet[]; current: LoggedSet }> = [
      { mode: 'weighted', prior: [{ kg: 60, reps: 8 }], current: { kg: 62.5, reps: 8 } },
      { mode: 'bodyweight', prior: [{ reps: 6 }], current: { reps: 7 } },
      { mode: 'assisted', prior: [{ kg: 30, reps: 6 }], current: { kg: 30, reps: 7 } },
      { mode: 'duration', prior: [{ durationSec: 30 }], current: { durationSec: 31 } },
      { mode: 'conditioning', prior: [{ kg: 20, reps: 8, durationSec: 30, distanceM: 20 }], current: { kg: 22, reps: 8, durationSec: 31, distanceM: 21 } },
    ];
    for (const { mode, prior, current } of cases) {
      const resolved = history(prior);
      const expected = recordsFor(summarizeSets('live', '9999-12-31', [current]), resolved, mode, '', '').length > 0;
      expect(liveRecordFrom(resolved, mode, current)).toBe(expected);
    }
    expect(liveRecordFrom([], 'weighted', { kg: 60, reps: 8 })).toBe(false);
    expect(liveRecordFrom(history([{ kg: 60, reps: 8 }]), 'weighted', {})).toBe(false);
  });
});
