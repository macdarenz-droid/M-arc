import { beforeEach, describe, expect, it } from 'vitest';
import { findExercise } from '@/core/exercises';
import { freshState, type AppState, type Session, type WorkoutPlanSnapshot } from '@/core/models';
import { initStore, loadState, replaceState, STATE_KEY, state } from '@/core/store';
import { cleanSessionEdit } from '@/slices/history/sessionEdit';
import { addSet, finishSession, removeEntry, removeSet, replaceEntry, restoreEmptyEntry, setSet, startSession } from '@/slices/workout/session';
import { pplSplits, PUSH_ID } from './coach-helpers';

const memory = () => { const values = new Map<string, string>(); return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => void values.set(key, value), removeItem: (key: string) => void values.delete(key) }; };
const savedStorage = (saved: AppState) => { const values = new Map([[STATE_KEY, JSON.stringify(saved)]]); return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => void values.set(key, value), removeItem: (key: string) => void values.delete(key) }; };
const seed = (): AppState => { const next = freshState(new Date('2026-09-21T00:00:00.000Z')); next.splits = pplSplits(); return next; };

function begin(): string {
  startSession(state.value.splits.find(split => split.id === PUSH_ID)!);
  return state.value.active!.entries[0]!.planEntryId!;
}

describe('P05 sticky working-row provenance and invalidation', () => {
  beforeEach(() => { initStore(memory()); replaceState(seed()); });

  it('records a working row once; blanking and retyping that same row does not itself invalidate it', () => {
    const id = begin();
    setSet(0, 0, { kg: 60 });
    expect(state.value.active!.plan!.assessment!.seenWorkingRows).toEqual([]);
    setSet(0, 0, { reps: 8, effort: 'ideal' });
    setSet(0, 0, { kg: undefined, reps: undefined, effort: undefined });
    setSet(0, 0, { kg: 62.5, reps: 7, effort: 'max' });
    expect(state.value.active!.plan!.assessment).toMatchObject({
      seenWorkingRows: [{ entryId: id, setIndices: [0] }],
      invalidatedEntryIds: [],
    });
    const loaded = loadState(savedStorage(structuredClone(state.value))).state;
    expect(loaded.active!.plan!.assessment!.seenWorkingRows).toEqual([{ entryId: id, setIndices: [0] }]);
  });

  it('preserves overrides on append and remembers a copied working extra without inventing an accepted target', () => {
    const id = begin();
    setSet(0, 0, { kg: 60, reps: 8, effort: 'ideal' });
    setSet(0, 2, { kg: 55, reps: 8, effort: 'ideal' });
    const active = state.value.active!;
    active.entries[0]!.targetOverrides = [null, { kg: 55, reps: 8, durationSec: null }, null];
    active.plan!.entries[0]!.acceptedTargets = [null, { kg: 55, reps: 8, durationSec: null }, null];
    addSet(0);
    expect(state.value.active!.entries[0]!.targetOverrides).toEqual([null, { kg: 55, reps: 8, durationSec: null }, null, null]);
    expect(state.value.active!.plan!.entries[0]!.acceptedTargets).toHaveLength(3);
    expect(state.value.active!.plan!.assessment!.seenWorkingRows).toContainEqual({ entryId: id, setIndices: [0, 2, 3] });
  });

  it('marks any structural row deletion invalid while preserving the actual work', () => {
    const id = begin();
    setSet(0, 0, { kg: 60, reps: 8 });
    removeSet(0, 1);
    expect(state.value.active!.plan!.assessment!.invalidatedEntryIds).toEqual([id]);
    expect(state.value.active!.entries[0]!.sets[0]).toEqual({ kg: 60, reps: 8 });
  });

  it('retiring untouched work stays valid, but clear-then-remove and clear-then-swap retain lost-evidence invalidation', () => {
    const untouchedId = begin();
    removeEntry(0);
    expect(state.value.active!.plan!.assessment!.invalidatedEntryIds).not.toContain(untouchedId);

    replaceState(seed());
    const removedId = begin();
    setSet(0, 0, { kg: 60, reps: 8 });
    setSet(0, 0, { kg: undefined, reps: undefined });
    removeEntry(0);
    expect(state.value.active!.plan!.assessment!.invalidatedEntryIds).toContain(removedId);

    replaceState(seed());
    const swappedId = begin();
    setSet(0, 0, { kg: 60, reps: 8 });
    setSet(0, 0, { kg: undefined, reps: undefined });
    expect(replaceEntry(0, findExercise('lib_machine_chest_press')!)).toBe(true);
    expect(state.value.active!.plan!.assessment!.invalidatedEntryIds).toContain(swappedId);
  });

  it('finish detects a previously working row that is now empty and keeps other row identities', () => {
    const id = begin();
    setSet(0, 0, { kg: 60, reps: 8 });
    setSet(0, 1, { kg: 60, reps: 7 });
    setSet(0, 0, { kg: undefined, reps: undefined });
    const saved = finishSession(false)!.session;
    expect(saved.plan!.assessment!.invalidatedEntryIds).toContain(id);
    expect(saved.exercises[0]).toMatchObject({ planEntryId: id, actualSetIndices: [1], sets: [{ kg: 60, reps: 7 }] });
  });

  it('Undo records A→B→A2 with a fresh identity and never reactivates A', () => {
    const original = findExercise('lib_barbell_bench_press')!;
    const replacement = findExercise('lib_machine_chest_press')!;
    const a = begin();
    const startedAt = state.value.active!.startedAt;
    expect(replaceEntry(0, replacement, { startedAt, exerciseId: original.id })).toBe(true);
    const b = state.value.active!.entries[0]!.planEntryId!;
    expect(restoreEmptyEntry(0, original, { startedAt, exerciseId: replacement.id })).toBe(true);
    const a2 = state.value.active!.entries[0]!.planEntryId!;
    expect(new Set([a, b, a2]).size).toBe(3);
    expect(state.value.active!.plan!.assessment!.changes.map(change => change.kind === 'replace' ? [change.fromEntryId, change.toEntryId] : change.kind)).toEqual([[a, b], [b, a2]]);
    expect(state.value.active!.plan!.entries.find(entry => entry.id === a)?.excluded).toBe('replaced');
    expect(state.value.active!.plan!.entries.find(entry => entry.id === b)?.excluded).toBe('replaced');
  });
});

describe('P05 saved-session normalization and History edits', () => {
  const plan = (): WorkoutPlanSnapshot => ({
    version: 1,
    capturedAt: '2026-09-21T10:00:00.000Z',
    goal: 'growth',
    deload: null,
    entries: [{ id: 'pe', exerciseId: 'lib_barbell_bench_press', name: 'Bench Press', mode: 'weighted', origin: 'start', plannedSets: 2, targetSource: 'history', allowIncrease: true, targets: [{ kg: 60, reps: 8, durationSec: null }, { kg: 60, reps: 8, durationSec: null }] }],
    assessment: { version: 1, intent: { kind: 'normal', capturedAt: '2026-09-21T10:00:00.000Z', source: 'session_start', effortCap: null }, changes: [], invalidatedEntryIds: [], seenWorkingRows: [{ entryId: 'pe', setIndices: [0, 1] }] },
  });
  const savedSession = (): Session => ({ id: 's', splitId: 'push', splitName: 'Push', day: '2026-09-21', startedAt: '2026-09-21T10:00:00.000Z', endedAt: '2026-09-21T11:00:00.000Z', durationSec: 3600, plan: plan(), exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench Press', planEntryId: 'pe', actualSetIndices: [0, 1], sets: [{ kg: 60, reps: 8 }, { kg: 60, reps: 7 }] }] });

  it('History value/effort corrections preserve agreement; deleting a row or the final row invalidates its entry', () => {
    const source = savedSession();
    const corrected = cleanSessionEdit({ ...source, exercises: [{ ...source.exercises[0]!, sets: [{ kg: 62.5, reps: 8, effort: 'max' }, source.exercises[0]!.sets[1]!] }] }, '', false);
    expect(corrected.plan!.assessment!.invalidatedEntryIds).toEqual([]);
    expect(corrected.exercises[0]!.actualSetIndices).toEqual([0, 1]);

    const oneDeleted = cleanSessionEdit({ ...source, exercises: [{ ...source.exercises[0]!, sets: [source.exercises[0]!.sets[0]!, { kg: 60, reps: 0 }] }] }, '', false);
    expect(oneDeleted.plan!.assessment!.invalidatedEntryIds).toEqual(['pe']);
    expect(oneDeleted.exercises[0]!.actualSetIndices).toBeUndefined();

    const finalDeleted = cleanSessionEdit({ ...source, exercises: [{ ...source.exercises[0]!, sets: [{ kg: 60, reps: 0 }] }] }, '', false);
    expect(finalDeleted.exercises).toEqual([]);
    expect(finalDeleted.plan!.assessment!.invalidatedEntryIds).toEqual(['pe']);
  });

  it('D04 rejects duplicate seenWorkingRows entry records instead of accepting ambiguous provenance', () => {
    const saved = seed();
    const session = savedSession();
    session.plan!.assessment!.seenWorkingRows.push({ entryId: 'pe', setIndices: [1] });
    saved.sessions = [session];
    expect(loadState(savedStorage(saved)).state.sessions[0]!.plan!.assessment).toBeUndefined();
  });

  it('D04 rejects orphaned entries and journal events that disagree with captured origin/replacement links', () => {
    const cases: Array<(session: Session) => void> = [
      session => {
        session.plan!.entries.push({ ...session.plan!.entries[0]!, id: 'pe2', origin: 'added' });
      },
      session => {
        session.plan!.entries.push({ ...session.plan!.entries[0]!, id: 'pe2', origin: 'replacement', replaces: 'pe' });
        session.plan!.assessment!.changes.push({ id: 'c', acceptedAt: '2026-09-21T10:15:00.000Z', kind: 'add', entryId: 'pe2' });
      },
      session => {
        session.plan!.entries.push({ ...session.plan!.entries[0]!, id: 'pe2', origin: 'replacement', replaces: 'wrong-predecessor' });
        session.plan!.assessment!.changes.push({ id: 'c', acceptedAt: '2026-09-21T10:15:00.000Z', kind: 'replace', fromEntryId: 'pe', toEntryId: 'pe2' });
      },
      session => {
        session.plan!.entries[0] = { ...session.plan!.entries[0]!, replaces: 'ghost' };
      },
    ];

    for (const corrupt of cases) {
      const saved = seed();
      const session = savedSession();
      corrupt(session);
      saved.sessions = [session];
      const loaded = loadState(savedStorage(saved)).state.sessions[0]!;
      expect(loaded.exercises[0]!.sets).toEqual(session.exercises[0]!.sets);
      expect(loaded.plan).toBeDefined();
      expect(loaded.plan!.assessment).toBeUndefined();
    }
  });

  it('D05 keeps logs but marks a surviving journal/projection mismatch unassessable', () => {
    const saved = seed();
    const session = savedSession();
    const accepted = { kg: 55, reps: 8, durationSec: null };
    session.plan!.assessment!.changes = [{ id: 'c', acceptedAt: '2026-09-21T10:15:00.000Z', kind: 'targets', entryId: 'pe', reason: 'max_below_target', targets: [{ setIndex: 1, target: accepted }] }];
    session.plan!.entries[0]!.acceptedTargets = [null, { kg: 57.5, reps: 8, durationSec: null }];
    saved.sessions = [session];
    const loaded = loadState(savedStorage(saved)).state.sessions[0]!;
    expect(loaded.exercises[0]!.sets).toEqual(session.exercises[0]!.sets);
    expect(loaded.plan!.assessment!.invalidatedEntryIds).toContain('pe');
  });

  it('accepts an explicitly adopted extra-row target using metadata bounds, not original target length', () => {
    const saved = seed();
    const session = savedSession();
    const accepted = { kg: 55, reps: 8, durationSec: null };
    session.plan!.assessment!.changes = [{ id: 'c', acceptedAt: '2026-09-21T10:15:00.000Z', kind: 'targets', entryId: 'pe', reason: 'max_below_target', targets: [{ setIndex: 3, target: accepted }] }];
    session.plan!.entries[0]!.acceptedTargets = [null, null, null, accepted];
    saved.sessions = [session];
    const loaded = loadState(savedStorage(saved)).state.sessions[0]!;
    expect(loaded.plan!.assessment!.invalidatedEntryIds).toEqual([]);
    expect(loaded.plan!.entries[0]!.acceptedTargets?.[3]).toEqual(accepted);
  });
});
