import { describe, expect, it } from 'vitest';
import type { ActiveSession, Effort } from '@/core/models';
import { GOALS } from '@/data/goals';
import {
  REST_CEIL_SEC,
  REST_FLOOR_SEC,
} from '@/brain/coach/bands';
import { nextAfterRest, restFor } from '@/brain/live';
import type { Suggestion } from '@/brain/progression';

const baseInput = {
  base: 90,
  pattern: 'elbow_extension',
  mode: 'weighted' as const,
  goal: 'lean' as const,
};

describe('restFor', () => {
  it('leaves an unrated set at the length the person chose', () => {
    expect(restFor({ ...baseInput, pattern: 'squat', goal: 'strength' })).toEqual({
      seconds: 90,
      deltaSec: 0,
      reasonKind: 'ungraded',
    });
    expect(restFor({ ...baseInput, base: 90.6 })).toEqual({
      seconds: 91,
      deltaSec: 0,
      reasonKind: 'ungraded',
    });
  });

  it("bends the person's own number by effort", () => {
    expect(restFor({ ...baseInput, effort: 'ideal' })).toEqual({ seconds: 90, deltaSec: 0, reasonKind: 'base' });
    expect(restFor({ ...baseInput, effort: 'easy' })).toEqual({ seconds: 70, deltaSec: -20, reasonKind: 'easy' });
    expect(restFor({ ...baseInput, effort: 'max' })).toEqual({ seconds: 115, deltaSec: 25, reasonKind: 'max' });
  });

  it('gives a compound longer rest than an isolation at the same effort', () => {
    expect(restFor({ ...baseInput, pattern: 'squat', effort: 'ideal' })).toEqual({
      seconds: 110,
      deltaSec: 20,
      reasonKind: 'compound',
    });
    expect(restFor({ ...baseInput, pattern: 'squat', effort: 'easy' })).toEqual({
      seconds: 85,
      deltaSec: -5,
      reasonKind: 'easy_compound',
    });
    const compoundMax = restFor({ ...baseInput, pattern: 'squat', effort: 'max' });
    expect(compoundMax).toEqual({ seconds: 135, deltaSec: 45, reasonKind: 'max_compound' });
    expect(compoundMax.seconds).toBeGreaterThan(restFor({ ...baseInput, effort: 'max' }).seconds);
  });

  it('applies the strength floor only to loaded compounds', () => {
    expect(restFor({ ...baseInput, pattern: 'squat', goal: 'strength', effort: 'easy' })).toEqual({
      seconds: 150,
      deltaSec: 60,
      reasonKind: 'strength_floor',
    });
    expect(restFor({ ...baseInput, pattern: 'squat', goal: 'strength_muscle', effort: 'easy' }).seconds).toBe(150);
    expect(restFor({ ...baseInput, pattern: 'vertical_pull', mode: 'bodyweight', goal: 'strength', effort: 'easy' })).toMatchObject({
      seconds: 85,
      reasonKind: 'easy_compound',
    });
    expect(restFor({ ...baseInput, pattern: 'elbow_flexion', goal: 'strength', effort: 'easy' })).toMatchObject({
      seconds: 70,
      reasonKind: 'easy',
    });
    expect(restFor({ ...baseInput, pattern: 'squat', effort: 'easy' })).toMatchObject({
      seconds: 85,
      reasonKind: 'easy_compound',
    });
  });

  it('always returns an integer inside the shared clamps and stays silent at the base', () => {
    const clamp = (seconds: number) => Math.max(REST_FLOOR_SEC, Math.min(REST_CEIL_SEC, Math.round(seconds)));
    const efforts: Effort[] = ['easy', 'ideal', 'max'];
    for (const effort of efforts) for (const pattern of ['squat', 'elbow_extension', '']) {
      for (const goal of GOALS.map(item => item.id)) for (const base of [15, 90, 150, 600, 5, 900]) {
        const grade = restFor({ base, effort, pattern, mode: 'weighted', goal });
        expect(Number.isInteger(grade.seconds)).toBe(true);
        expect(grade.seconds).toBeGreaterThanOrEqual(REST_FLOOR_SEC);
        expect(grade.seconds).toBeLessThanOrEqual(REST_CEIL_SEC);
        expect(grade.reasonKind === 'base' || grade.reasonKind === 'ungraded').toBe(grade.seconds === clamp(base));
      }
    }
    expect(restFor({ ...baseInput, base: 600, effort: 'max', pattern: 'squat' })).toEqual({
      seconds: 600,
      deltaSec: 0,
      reasonKind: 'base',
    });
  });
});

describe('nextAfterRest', () => {
  const entries: ActiveSession['entries'] = [
    { exerciseId: 'a', name: 'Leg Press', sets: [{}, {}, {}], done: false, skipped: false },
    { exerciseId: 'b', name: 'Romanian Deadlift', sets: [{}], done: false, skipped: false },
  ];
  const suggestion: Suggestion = {
    mode: 'hold',
    target: '60 kg',
    kg: 60,
    reps: [6, 8],
    reason: '',
    confidence: 'medium',
    sets: [
      { kg: 60, reps: 8, durationSec: null, note: '' },
      { kg: 62.5, reps: 8, durationSec: null, note: '' },
      { kg: 62.5, reps: 6, durationSec: null, note: '' },
    ],
  };

  it('names the next set, then the next exercise, then the end', () => {
    expect(nextAfterRest(entries, { entry: 0, set: 0 }, suggestion)).toEqual({
      kind: 'set',
      setNumber: 2,
      kg: 62.5,
      reps: 8,
      durationSec: null,
    });
    expect(nextAfterRest(entries, { entry: 0, set: 2 }, suggestion)).toEqual({
      kind: 'next_exercise',
      name: 'Romanian Deadlift',
    });
    expect(nextAfterRest([{ ...entries[0]! }, { ...entries[1]!, skipped: true }], { entry: 0, set: 2 }, suggestion)).toEqual({
      kind: 'session_end',
    });
    expect(nextAfterRest(entries, { entry: 9, set: 0 }, suggestion)).toBeNull();
  });

  it('returns empty targets without a suggestion and reuses the last planned target for added sets', () => {
    expect(nextAfterRest(entries, { entry: 0, set: 0 }, null)).toEqual({
      kind: 'set',
      setNumber: 2,
      kg: null,
      reps: null,
      durationSec: null,
    });
    const extended: ActiveSession['entries'] = [{ ...entries[0]!, sets: [{}, {}, {}, {}, {}] }];
    expect(nextAfterRest(extended, { entry: 0, set: 3 }, suggestion)).toEqual({
      kind: 'set',
      setNumber: 5,
      kg: 62.5,
      reps: 6,
      durationSec: null,
    });
  });
});
