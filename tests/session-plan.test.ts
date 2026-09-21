import { beforeEach, describe, expect, it } from 'vitest';
import { capturePlan, capturePlanEntry } from '@/brain/debrief';
import { freshState, type AppState, type Session, type WorkoutPlanSnapshot } from '@/core/models';
import { findExercise } from '@/core/exercises';
import { initStore, loadState, replaceState, STATE_KEY, state, update } from '@/core/store';
import { addExerciseToSession, finishSession, removeEntry, removeSet, replaceEntry, setSet, skipEntry, startSession } from '@/slices/workout/session';
import { cleanSessionEdit, removeSessionIfCurrent, replaceSessionIfCurrent } from '@/slices/history/sessionEdit';
import { ctx, pplSplits, PUSH_ID } from './coach-helpers';
import { session, sets } from './helpers';

const memory = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) }; };
const seed = (): AppState => { const next = freshState(new Date('2026-06-01T00:00:00Z')); next.splits = pplSplits(); return next; };
const savedStorage = (saved: AppState) => {
  const m = new Map([[STATE_KEY, JSON.stringify(saved)]]);
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
};

describe('capturePlan', () => {
  it('captures starter, history and unavailable targets without sharing input objects', () => {
    const history = [session('2026-09-18', [{ id: 'lib_machine_chest_press', sets: sets(50, 8, 'ideal', 3) }])];
    const context = ctx(history);
    const known = capturePlanEntry(context, { id: 'pe1', exerciseId: 'lib_machine_chest_press', name: 'Machine Chest Press', plannedSets: 4, origin: 'start' });
    expect(known).toMatchObject({ id: 'pe1', mode: 'weighted', targetSource: 'history', plannedSets: 4, allowIncrease: true });
    expect(known.targets).toHaveLength(4);
    expect(known.targets[3]).toEqual(known.targets[2]);

    const starter = capturePlanEntry(ctx([]), { id: 'pe2', exerciseId: 'lib_machine_chest_press', name: 'Machine Chest Press', plannedSets: 3, origin: 'start' });
    expect(starter).toMatchObject({ targetSource: 'starter', allowIncrease: false });
    const missing = capturePlanEntry(ctx([]), { id: 'pe3', exerciseId: 'custom_missing', name: 'Unknown', plannedSets: 3, origin: 'added' });
    expect(missing).toMatchObject({ mode: null, targetSource: 'unavailable', targets: [] });

    const inputs = [{ id: 'pe1', exerciseId: 'lib_machine_chest_press', name: 'Machine Chest Press', plannedSets: 3, origin: 'start' as const }];
    const snapshot = capturePlan(context, inputs, '2026-09-19T10:00:00.000Z');
    inputs[0]!.name = 'Changed';
    expect(snapshot.entries[0]!.name).toBe('Machine Chest Press');
  });

  it('captures the displayed deload target once without mutating the deload input', () => {
    const deload = { from: '2026-09-18', to: '2026-09-24', loadFactor: 0.85, effortCap: 'ideal' as const };
    const history = [session('2026-09-18', [{ id: 'lib_machine_chest_press', sets: sets(60, 8, 'ideal', 3) }])];
    const snapshot = capturePlan(ctx(history, { deload }), [{ id: 'pe1', exerciseId: 'lib_machine_chest_press', name: 'Machine Chest Press', plannedSets: 3, origin: 'start' }], '2026-09-19T10:00:00.000Z');
    expect(snapshot.entries[0]!.targets[0]!.kg).toBe(51);
    expect(snapshot.deload).toEqual(deload);
    expect(snapshot.deload).not.toBe(deload);
    deload.loadFactor = 0.5;
    expect(snapshot.entries[0]!.targets[0]!.kg).toBe(51);
    expect(snapshot.deload?.loadFactor).toBe(0.85);
  });
});

describe('session plan lifecycle', () => {
  beforeEach(() => { initStore(memory()); replaceState(seed()); });

  it('captures stable IDs and preserves original targets across explicit topology changes', () => {
    const split = state.value.splits.find(s => s.id === PUSH_ID)!;
    startSession(split);
    const active = state.value.active!;
    expect(active.plan?.entries).toHaveLength(split.exercises.length);
    expect(new Set(active.entries.map(e => e.planEntryId)).size).toBe(active.entries.length);
    expect(active.plan?.entries.map(e => e.id)).toEqual(active.entries.map(e => e.planEntryId));

    const originalId = active.entries[0]!.planEntryId!;
    const originalTargets = active.plan!.entries[0]!.targets;
    skipEntry(0);
    expect(state.value.active!.plan!.entries.find(e => e.id === originalId)?.excluded).toBe('skipped');
    skipEntry(0, false);
    expect(state.value.active!.plan!.entries.find(e => e.id === originalId)?.excluded).toBeUndefined();

    replaceEntry(0, findExercise('lib_machine_chest_press')!);
    const replacement = state.value.active!.entries[0]!;
    expect(replacement.planEntryId).not.toBe(originalId);
    expect(state.value.active!.plan!.entries.find(e => e.id === originalId)).toMatchObject({ excluded: 'replaced', targets: originalTargets });
    expect(state.value.active!.plan!.entries.at(-1)).toMatchObject({ id: replacement.planEntryId, origin: 'replacement', replaces: originalId });

    addExerciseToSession(findExercise('lib_cable_fly')!, 2);
    expect(state.value.active!.plan!.entries.at(-1)).toMatchObject({ exerciseId: 'lib_cable_fly', origin: 'added', plannedSets: 2 });
    const addedId = state.value.active!.entries.at(-1)!.planEntryId!;
    removeEntry(state.value.active!.entries.length - 1);
    expect(state.value.active!.plan!.entries.find(e => e.id === addedId)?.excluded).toBe('removed');
  });

  it('saves plan identity and original live-row indices with working sets', () => {
    startSession(state.value.splits.find(s => s.id === PUSH_ID)!);
    const plan = state.value.active!.plan;
    const id = state.value.active!.entries[0]!.planEntryId;
    setSet(0, 0, { kg: 50, reps: 8 });
    setSet(0, 2, { kg: 50, reps: 6 });
    const result = finishSession(false)!;
    expect(result.session.plan).toBe(plan);
    expect(result.session.exercises[0]).toMatchObject({ planEntryId: id, actualSetIndices: [0, 2] });
  });

  it('invalidates row comparison after a structural set removal', () => {
    startSession(state.value.splits.find(s => s.id === PUSH_ID)!);
    setSet(0, 0, { kg: 50, reps: 8 });
    removeSet(0, 1);
    expect(state.value.active!.entries[0]!.planComparisonValid).toBe(false);
    const result = finishSession(false)!;
    expect(result.session.exercises[0]!.actualSetIndices).toBeUndefined();
  });

  it('does not invent comparison metadata when finishing a legacy active session', () => {
    const next = seed();
    next.active = { splitId: PUSH_ID, startedAt: '2026-09-20T10:00:00.000Z', pausedMs: 0, entries: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench Press', sets: [{ kg: 60, reps: 8 }], done: true, skipped: false }] };
    replaceState(next);
    const result = finishSession(false)!;
    expect(result.session.plan).toBeUndefined();
    expect(result.session.exercises[0]!.planEntryId).toBeUndefined();
    expect(result.session.exercises[0]!.actualSetIndices).toBeUndefined();
  });

  it('does not save untouched placeholders as actual work', () => {
    startSession(state.value.splits.find(s => s.id === PUSH_ID)!);
    const result = finishSession(false)!;
    expect(result.session.exercises).toEqual([]);
    expect(state.value.sessions).toEqual([]);
  });
});

describe('plan metadata persistence boundaries', () => {
  const validPlan = (): WorkoutPlanSnapshot => ({
    version: 1,
    capturedAt: '2026-09-20T10:00:00.000Z',
    goal: 'growth',
    deload: null,
    entries: [{ id: 'pe_1', exerciseId: 'lib_barbell_bench_press', name: 'Bench Press', mode: 'weighted', origin: 'start', plannedSets: 1, targetSource: 'history', allowIncrease: true, targets: [{ kg: 62.5, reps: 8, durationSec: null }] }],
  });

  it('round-trips valid snapshots and aligned row indices', () => {
    const saved = seed();
    const logged = session('2026-09-20', [{ id: 'lib_barbell_bench_press', sets: [{ kg: 60, reps: 8 }] }]);
    logged.plan = validPlan();
    logged.exercises[0]!.planEntryId = 'pe_1';
    logged.exercises[0]!.actualSetIndices = [2];
    saved.sessions = [logged];
    expect(loadState(savedStorage(saved)).state.sessions[0]).toEqual(logged);
  });

  it('drops malformed snapshot metadata without dropping the session or its actual sets', () => {
    const saved = seed();
    const logged = session('2026-09-20', [{ id: 'lib_barbell_bench_press', sets: [{ kg: 60, reps: 8 }] }]);
    logged.plan = validPlan();
    logged.plan.entries[0]!.targets[0]!.reps = 8.5;
    logged.exercises[0]!.planEntryId = 'pe_1';
    logged.exercises[0]!.actualSetIndices = [0];
    saved.sessions = [logged];
    const loaded = loadState(savedStorage(saved)).state.sessions[0]!;
    expect(loaded.exercises[0]!.sets).toEqual([{ kg: 60, reps: 8 }]);
    expect(loaded.plan).toBeUndefined();
    expect(loaded.exercises[0]!.planEntryId).toBeUndefined();
    expect(loaded.exercises[0]!.actualSetIndices).toBeUndefined();
  });

  it('drops only misaligned row indices when the captured plan is valid', () => {
    const saved = seed();
    const logged = session('2026-09-20', [{ id: 'lib_barbell_bench_press', sets: [{ kg: 60, reps: 8 }, { kg: 60, reps: 7 }] }]);
    logged.plan = validPlan();
    logged.exercises[0]!.planEntryId = 'pe_1';
    logged.exercises[0]!.actualSetIndices = [0];
    saved.sessions = [logged];
    const loaded = loadState(savedStorage(saved)).state.sessions[0]!;
    expect(loaded.plan).toEqual(logged.plan);
    expect(loaded.exercises[0]!.planEntryId).toBe('pe_1');
    expect(loaded.exercises[0]!.actualSetIndices).toBeUndefined();
    expect(loaded.exercises[0]!.sets).toHaveLength(2);
  });
});

describe('history editor comparison safety', () => {
  beforeEach(() => { initStore(memory()); replaceState(seed()); });

  const plannedSession = (): Session => {
    const logged = session('2026-09-20', [{ id: 'lib_barbell_bench_press', sets: [{ kg: 60, reps: 8 }, { kg: 60, reps: 7 }] }]);
    logged.exercises[0]!.planEntryId = 'pe_1';
    logged.exercises[0]!.actualSetIndices = [0, 2];
    return logged;
  };

  it('preserves row alignment for value edits and invalidates it when a row is removed', () => {
    const source = plannedSession();
    const valueEdit = cleanSessionEdit({ ...source, exercises: [{ ...source.exercises[0]!, sets: [{ kg: 62.5, reps: 8 }, source.exercises[0]!.sets[1]!] }] }, '', false);
    expect(valueEdit.exercises[0]!.actualSetIndices).toEqual([0, 2]);
    const rowRemoval = cleanSessionEdit({ ...source, exercises: [{ ...source.exercises[0]!, sets: [source.exercises[0]!.sets[0]!, { kg: 60, reps: 0 }] }] }, '', false);
    expect(rowRemoval.exercises[0]!.actualSetIndices).toBeUndefined();
  });

  it('refuses stale saves and deleted-session resurrection', () => {
    const source = plannedSession();
    replaceState({ ...state.value, sessions: [source] });
    update(current => ({ ...current, sessions: current.sessions.map(item => item.id === source.id ? { ...item, note: 'newer' } : item) }));
    expect(replaceSessionIfCurrent(source, { ...source, note: 'stale' })).toBe('changed');
    expect(state.value.sessions[0]!.note).toBe('newer');
    const current = state.value.sessions[0]!;
    expect(removeSessionIfCurrent(current)).toBe('saved');
    expect(replaceSessionIfCurrent(current, source)).toBe('deleted');
    expect(state.value.sessions).toHaveLength(0);
  });
});
