/** A3 verify UI-R01: substituting an exercise must not erase work already committed for it. */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/slices/settings/reminders', () => ({ resyncReminders: vi.fn(async () => undefined) }));

import { replaceState, state } from '@/core/store';
import { freshState, type Split } from '@/core/models';
import { commitSet, finishSession, markDone, setSet, skipEntry, startSession, substituteEntry } from '@/slices/workout/session';
import { findExercise } from '@/core/exercises';

const BENCH = 'lib_barbell_bench_press';
const split: Split = { id: 'sp', name: 'Push', color: '#fff', focus: [], createdAt: '', exercises: [{ exerciseId: BENCH, sets: 3 }] };

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(Date.parse('2026-09-22T10:00:00.000Z'));
  replaceState({ ...freshState(), splits: [split] });
  startSession(split);
  vi.advanceTimersByTime(60_000);
  setSet(0, 0, { kg: 60, reps: 8, effort: 'ideal' });
  expect(commitSet(0, 0)).toBe(true);
  vi.advanceTimersByTime(120_000);
});
afterEach(() => { vi.useRealTimers(); });

describe('UI-R01: substitution keeps committed work', () => {
  it('committed bench 60 x 8, marked Done, then substituted: Finish still saves the bench set', () => {
    markDone(0);
    substituteEntry(0, findExercise('lib_dumbbell_shoulder_press')!);
    const r = finishSession(false);
    const benchSets = state.value.sessions.flatMap(s => s.exercises).filter(e => e.exerciseId === BENCH).flatMap(e => e.sets);
    expect(benchSets.map(s => [s.kg, s.reps]), `finish returned ${r ? 'a session' : 'null'}; sessions saved: ${state.value.sessions.length}`).toEqual([[60, 8]]);
  });

  it('the replacement starts unfinished (not Done, not Skipped)', () => {
    markDone(0);
    substituteEntry(0, findExercise('lib_dumbbell_shoulder_press')!);
    expect(state.value.active!.entries.find(e => e.exerciseId === 'lib_dumbbell_shoulder_press')!.done ?? false).toBe(false);
  });

  it('a skipped exercise substituted: the replacement is not skipped', () => {
    skipEntry(0);
    substituteEntry(0, findExercise('lib_dumbbell_shoulder_press')!);
    expect(state.value.active!.entries.find(e => e.exerciseId === 'lib_dumbbell_shoulder_press')!.skipped ?? false).toBe(false);
  });
});

describe('UI-R01 (R6): the split entry and the in-place swap', () => {
  const DB = 'lib_dumbbell_shoulder_press';

  it('with a committed set: the original keeps it and is Done; the substitute follows with the remaining rows and the lineage', () => {
    substituteEntry(0, findExercise(DB)!);
    const [orig, sub, ...rest] = state.value.active!.entries;
    expect(rest).toHaveLength(0);
    expect(orig!.exerciseId).toBe(BENCH);
    expect(orig!.sets.map(s => [s.kg, s.reps])).toEqual([[60, 8]]);
    expect([orig!.done, orig!.skipped]).toEqual([true, false]);
    expect(sub!.exerciseId).toBe(DB);
    expect(sub!.sets).toHaveLength(2);
    expect(sub!.sets.every(s => s.kg == null && s.reps == null)).toBe(true);
    expect([sub!.done, sub!.skipped, sub!.plannedId, sub!.target]).toEqual([false, false, BENCH, undefined]);
  });

  it('with no committed set: the swap stays in place (same entry count, old exercise gone, lineage kept)', () => {
    replaceState({ ...freshState(), splits: [split] });
    startSession(split);
    setSet(0, 0, { kg: 60, reps: 8, effort: 'ideal' });
    substituteEntry(0, findExercise(DB)!);
    const entries = state.value.active!.entries;
    expect(entries.map(e => e.exerciseId)).toEqual([DB]);
    expect(entries[0]!.plannedId).toBe(BENCH);
    expect(entries[0]!.sets).toHaveLength(3);
  });
});
