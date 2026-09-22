import { beforeEach, describe, expect, it } from 'vitest';
import { findExercise } from '@/core/exercises';
import { freshState, type ActiveSession, type AppState } from '@/core/models';
import { initStore, replaceState, state } from '@/core/store';
import { dismissWarmup, startSession } from '@/slices/workout/session';

const STARTED = '2026-09-21T05:00:00.000Z';
const bench = findExercise('lib_barbell_bench_press')!;
const memory = () => {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
    removeItem: (key: string) => void values.delete(key),
  };
};

function active(): ActiveSession {
  return {
    splitId: 'split_push',
    startedAt: STARTED,
    pausedMs: 0,
    entries: [{ exerciseId: bench.id, name: bench.name, sets: [{}, {}, {}], done: false, skipped: false, planEntryId: 'pe_bench' }],
    plan: {
      version: 1,
      capturedAt: STARTED,
      goal: 'lean',
      deload: null,
      entries: [{ id: 'pe_bench', exerciseId: bench.id, name: bench.name, mode: 'weighted', origin: 'start', plannedSets: 3, targetSource: 'history', allowIncrease: true, targets: Array.from({ length: 3 }, () => ({ kg: 60, reps: 8, durationSec: null })) }],
    },
  };
}

function seed(session = active()): AppState {
  const next = freshState(new Date('2026-09-21T00:00:00.000Z'));
  next.active = session;
  next.splits = [{ id: 'split_push', name: 'Push', color: '#fff', focus: [], createdAt: STARTED, exercises: [{ exerciseId: bench.id, sets: 3 }] }];
  return next;
}

describe('warm-up dismissal persistence', () => {
  beforeEach(() => { initStore(memory()); replaceState(seed()); });

  it('survives a store restart without touching sessions, split or logged rows', () => {
    const storage = memory();
    initStore(storage);
    replaceState(seed());
    const beforeEntries = structuredClone(state.value.active!.entries);
    const beforeSessions = structuredClone(state.value.sessions);
    const beforeSplits = structuredClone(state.value.splits);

    expect(dismissWarmup(STARTED)).toBe(true);
    initStore(storage);

    expect(state.value.active!.warmupDismissed).toBe(true);
    expect(state.value.active!.entries).toEqual(beforeEntries);
    expect(state.value.sessions).toEqual(beforeSessions);
    expect(state.value.splits).toEqual(beforeSplits);
  });

  it('does nothing when the expected session has gone stale', () => {
    expect(dismissWarmup('2026-09-21T06:00:00.000Z')).toBe(false);
    expect(state.value.active!.warmupDismissed).toBeUndefined();
  });

  it('starts the next session with no inherited dismissal', () => {
    expect(dismissWarmup(STARTED)).toBe(true);
    replaceState({ ...state.value, active: null });
    startSession(state.value.splits[0]!);
    expect(state.value.active!.warmupDismissed).toBeUndefined();
  });

  it('drops a malformed imported dismissal without discarding the active session', () => {
    const storage = memory();
    const malformed = seed({ ...active(), warmupDismissed: 'yes' as unknown as boolean });
    initStore(storage);
    replaceState(malformed);
    initStore(storage);
    expect(state.value.active?.startedAt).toBe(STARTED);
    expect(state.value.active?.warmupDismissed).toBeUndefined();
  });
});
