import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { freshState, type ActiveSession, type AppState, type Effort } from '@/core/models';
import { initStore, replaceState, state, update } from '@/core/store';
import { findExercise } from '@/core/exercises';
import { GOALS } from '@/data/goals';
import {
  REST_CEIL_SEC,
  REST_FLOOR_SEC,
} from '@/brain/coach/bands';
import { nextAfterRest, restFor } from '@/brain/live';
import type { Suggestion } from '@/brain/progression';
import {
  active,
  addSet,
  adjustRest,
  commitSet,
  discardSession,
  finishSession,
  pauseSession,
  regradeRest,
  removeEntry,
  removeSet,
  replaceEntry,
  restRemainingSec,
  resumeSession,
  setSet,
  skipEntry,
  startRest,
  startSession,
  stopRest,
} from '@/slices/workout/session';
import { LEGS_ID, pplSplits, PUSH_ID } from './coach-helpers';

const memory = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) }; };
const seed = (): AppState => { const next = freshState(new Date('2026-06-01T00:00:00Z')); next.splits = pplSplits(); return next; };

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

  it('rejects invalid owners and an immediate next row that is already logged', () => {
    expect(nextAfterRest(entries, { entry: -1, set: 0 }, suggestion)).toBeNull();
    expect(nextAfterRest(entries, { entry: 0, set: -1 }, suggestion)).toBeNull();
    expect(nextAfterRest(entries, { entry: 0.5, set: 0 }, suggestion)).toBeNull();
    expect(nextAfterRest(entries, { entry: 0, set: 3 }, suggestion)).toBeNull();
    expect(nextAfterRest([{ ...entries[0]!, skipped: true }], { entry: 0, set: 0 }, suggestion)).toBeNull();
    expect(nextAfterRest([{ ...entries[0]!, done: true }], { entry: 0, set: 0 }, suggestion)).toBeNull();
    expect(nextAfterRest([{ ...entries[0]!, sets: [{}, { kg: 60, reps: 8 }, {}] }], { entry: 0, set: 0 }, suggestion)).toBeNull();
  });
});

describe('owned rest lifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-19T18:00:00.000Z'));
    initStore(memory());
    replaceState(seed());
  });

  afterEach(() => {
    discardSession();
    vi.useRealTimers();
  });

  function begin(splitId = LEGS_ID): void {
    startSession(state.value.splits.find(split => split.id === splitId)!);
  }

  function commit(entry = 0, set = 0): void {
    setSet(entry, set, { kg: 100, reps: 8 });
    expect(commitSet(entry, set)).toBe(true);
  }

  it("committing a set starts the person's own rest and records which set owns it", () => {
    begin(PUSH_ID);
    commit(0, 0);
    expect(active()!.rest).toMatchObject({ totalSec: 90, gradedSec: 90, reasonKind: 'ungraded', deltaSec: 0 });
    expect(active()!.rest!.from).toEqual({ entry: 0, set: 0, startedAt: active()!.startedAt, exerciseId: active()!.entries[0]!.exerciseId });

    const rest = active()!.rest;
    expect(commitSet(0, 1)).toBe(false);
    expect(active()!.rest).toBe(rest);

    stopRest();
    update(current => ({ ...current, preferences: { ...current.preferences, autoRest: false } }));
    expect(commitSet(0, 0)).toBe(true);
    expect(active()!.rest).toBeUndefined();
  });

  it('tapping an effort re-grades the running timer without restarting it', () => {
    begin();
    commit();
    vi.advanceTimersByTime(20_000);
    setSet(0, 0, { effort: 'max' });
    regradeRest(0, 0);

    expect(active()!.rest).toMatchObject({ totalSec: 135, gradedSec: 135, reasonKind: 'max_compound', deltaSec: 45 });
    expect(restRemainingSec(active()!)).toBe(115);
    expect(active()!.rest!.totalSec - restRemainingSec(active()!)!).toBe(20);
  });

  it("clearing effort grades back down to the person's default symmetrically", () => {
    begin();
    commit();
    vi.advanceTimersByTime(20_000);
    setSet(0, 0, { effort: 'max' });
    regradeRest(0, 0);
    setSet(0, 0, { effort: undefined });
    regradeRest(0, 0);
    expect(active()!.rest).toMatchObject({ totalSec: 90, gradedSec: 90, reasonKind: 'ungraded', deltaSec: 0 });
    expect(restRemainingSec(active()!)).toBe(70);

    setSet(0, 0, { effort: 'easy' });
    regradeRest(0, 0);
    expect(active()!.rest).toMatchObject({ totalSec: 85, gradedSec: 85, reasonKind: 'easy_compound', deltaSec: -5 });
    expect(restRemainingSec(active()!)).toBe(65);
  });

  it('a late downgrade never drags the progress bar backwards', () => {
    begin(PUSH_ID);
    commit(4, 0);
    vi.advanceTimersByTime(80_000);
    const beforeRemaining = restRemainingSec(active()!)!;
    const beforePct = 100 - (beforeRemaining / active()!.rest!.totalSec) * 100;
    setSet(4, 0, { effort: 'easy' });
    regradeRest(4, 0);
    const remaining = restRemainingSec(active()!)!;
    const pct = 100 - (remaining / active()!.rest!.totalSec) * 100;

    expect(active()!.rest!.totalSec).toBe(85);
    expect(remaining).toBe(5);
    expect(active()!.rest!.totalSec - remaining).toBe(80);
    expect(pct).toBeGreaterThan(beforePct);
  });

  it('a regrade only ever touches the timer its own set started', () => {
    begin();
    commit();
    const before = active()!.rest;
    setSet(0, 1, { effort: 'max' });
    regradeRest(0, 1);
    expect(active()!.rest).toBe(before);
    regradeRest(1, 0);
    expect(active()!.rest).toBe(before);

    update(current => ({ ...current, preferences: { ...current.preferences, autoRest: false } }));
    setSet(0, 0, { effort: 'max' });
    regradeRest(0, 0);
    expect(active()!.rest).toBe(before);

    stopRest();
    regradeRest(0, 0);
    expect(active()!.rest).toBeUndefined();
  });

  it('never revives a timer that has already rung', () => {
    begin();
    commit();
    vi.advanceTimersByTime(90_000);
    const before = { ...active()!.rest! };
    setSet(0, 0, { effort: 'max' });
    regradeRest(0, 0);
    adjustRest(15);
    expect(active()!.rest).toEqual(before);
    expect(restRemainingSec(active()!)).toBe(0);
  });

  it('a paused and resumed rest still knows which set owns it', () => {
    begin();
    commit();
    vi.advanceTimersByTime(10_000);
    pauseSession();
    vi.advanceTimersByTime(5_000);
    resumeSession();
    expect(active()!.rest!.from).toEqual({ entry: 0, set: 0, startedAt: active()!.startedAt, exerciseId: active()!.entries[0]!.exerciseId });
    setSet(0, 0, { effort: 'max' });
    regradeRest(0, 0);
    expect(active()!.rest!.totalSec).toBe(135);
    expect(restRemainingSec(active()!)).toBe(125);
  });

  it('the +/-15 buttons report the length the clock is actually honouring', () => {
    begin();
    commit();
    vi.advanceTimersByTime(20_000);
    adjustRest(15);
    expect(active()!.rest).toMatchObject({ totalSec: 105, gradedSec: 90, reasonKind: 'ungraded' });
    expect(restRemainingSec(active()!)).toBe(85);
    adjustRest(-15);
    expect(active()!.rest!.totalSec).toBe(90);
    expect(restRemainingSec(active()!)).toBe(70);
    vi.advanceTimersByTime(67_000);
    adjustRest(-15);
    expect(restRemainingSec(active()!)).toBe(5);
    expect(active()!.rest!.totalSec).toBe(92);
  });

  it('adjusts a paused rest from its frozen remainder', () => {
    begin();
    commit();
    vi.advanceTimersByTime(20_000);
    pauseSession();
    vi.advanceTimersByTime(30_000);
    adjustRest(15);
    expect(active()!.rest).toMatchObject({ totalSec: 105, pausedRemainingSec: 85 });
    expect(restRemainingSec(active()!)).toBe(85);
  });

  it('the clamps from bands hold on start and retime paths', () => {
    begin();
    startRest(5);
    expect(active()!.rest!.totalSec).toBe(REST_FLOOR_SEC);
    startRest(9_999);
    expect(active()!.rest!.totalSec).toBe(REST_CEIL_SEC);
    adjustRest(10_000);
    expect(active()!.rest!.totalSec).toBe(REST_CEIL_SEC);
  });

  it('topology changes clear ownership without stopping the countdown', () => {
    const cases: Array<(run: () => void) => void> = [
      run => { begin(); commit(); run(); removeEntry(0); },
      run => { begin(); addSet(0); commit(); run(); removeSet(0, 1); },
      run => { begin(); commit(); run(); skipEntry(0); },
      run => { begin(); commit(); run(); replaceEntry(0, findExercise('lib_machine_chest_press')!); },
    ];
    for (const exercise of cases) {
      replaceState(seed());
      exercise(() => expect(active()!.rest?.from).toBeDefined());
      expect(active()!.rest).toBeDefined();
      expect(active()!.rest).toMatchObject({ from: undefined, reasonKind: undefined, gradedSec: undefined, deltaSec: undefined });
    }
  });

  it('finishing the session takes the timer with it', () => {
    begin();
    commit();
    finishSession(false);
    expect(state.value.active).toBeNull();
  });
});
