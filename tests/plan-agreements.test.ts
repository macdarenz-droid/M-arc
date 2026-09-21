import { beforeEach, describe, expect, it } from 'vitest';
import { autoregulate, type LiveAdjustment } from '@/brain/live';
import { findExercise } from '@/core/exercises';
import { freshState, MAX_ASSESSMENT_CHANGES, type ActiveSession, type AppState, type PlanAgreementChange, type WorkoutPlanEntry } from '@/core/models';
import { appendAgreementChange } from '@/brain/debrief';
import { initStore, loadState, replaceState, STATE_KEY, state } from '@/core/store';
import { acceptLiveAdjustment, addExerciseToSession, removeEntry, replaceEntry } from '@/slices/workout/session';

const STARTED = '2026-09-21T05:00:00.000Z';
const bench = findExercise('lib_barbell_bench_press')!;
const squat = findExercise('lib_barbell_back_squat')!;
const legPress = findExercise('lib_leg_press')!;
const target = { kg: 60, reps: 8, durationSec: null };
const memory = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) }; };

function planEntry(id = 'pe_bench'): WorkoutPlanEntry {
  return { id, exerciseId: bench.id, name: bench.name, mode: 'weighted', origin: 'start', plannedSets: 3, targetSource: 'history', allowIncrease: true, targets: [{ ...target }, { ...target }, { ...target }] };
}

function live(): ActiveSession {
  return {
    splitId: 'split_push',
    startedAt: STARTED,
    pausedMs: 0,
    entries: [{ exerciseId: bench.id, name: bench.name, sets: [{ kg: 60, reps: 6, effort: 'max' }, {}, {}], done: false, skipped: false, planEntryId: 'pe_bench' }],
    plan: {
      version: 1, capturedAt: STARTED, goal: 'lean', deload: null, entries: [planEntry()],
      assessment: { version: 1, intent: { kind: 'normal', capturedAt: STARTED, source: 'session_start', effortCap: null }, changes: [], invalidatedEntryIds: [], seenWorkingRows: [] },
    },
  };
}

function seed(active = live()): AppState {
  const next = freshState(new Date('2026-09-21T00:00:00.000Z'));
  next.active = active;
  next.splits = [{ id: 'split_push', name: 'Push', color: '#fff', focus: [], createdAt: STARTED, exercises: [{ exerciseId: bench.id, sets: 3 }, { exerciseId: squat.id, sets: 3 }] }];
  return next;
}

function offer(active = state.value.active!): LiveAdjustment {
  const entry = active.entries.find(candidate => candidate.planEntryId === 'pe_bench')!;
  const captured = active.plan!.entries.find(candidate => candidate.id === 'pe_bench')!;
  return autoregulate({ exercise: bench, goal: active.plan!.goal, sets: entry.sets, targets: captured.targets, sourceSet: 0, deloadActive: false, decisionTaken: false, historyBacked: true, allowIncrease: true })!;
}

describe('J03: accepting a live adjustment appends a matching "targets" change', () => {
  beforeEach(() => { initStore(memory()); replaceState(seed()); });

  it('records the exact entry, reason and remaining-index targets, once', () => {
    const proposed = offer();
    expect(acceptLiveAdjustment('pe_bench', STARTED, proposed)).toBe(true);
    const changes = state.value.active!.plan!.assessment!.changes;
    expect(changes).toHaveLength(1);
    expect(changes[0]).toMatchObject({ kind: 'targets', entryId: 'pe_bench', reason: proposed.reason });
    expect((changes[0] as Extract<PlanAgreementChange, { kind: 'targets' }>).targets.map(t => t.setIndex)).toEqual(proposed.remainingIndices);
  });

  it('a session with no assessment (pre-P04) accepts the adjustment but never acquires one', () => {
    const noAssessment = live();
    delete (noAssessment.plan as { assessment?: unknown }).assessment;
    replaceState(seed(noAssessment));
    const proposed = offer();
    expect(acceptLiveAdjustment('pe_bench', STARTED, proposed)).toBe(true);
    expect(state.value.active!.plan!.assessment).toBeUndefined();
    // The actual mutation (what J01 already guards) still happened.
    expect(state.value.active!.plan!.entries[0]!.acceptedTargets).toBeDefined();
  });
});

describe('J06: adding, replacing and removing an entry each append their own matching change', () => {
  beforeEach(() => { initStore(memory()); replaceState(seed()); });

  it('addExerciseToSession appends "add" with the new entry\'s own id', () => {
    addExerciseToSession(legPress);
    const active = state.value.active!;
    const newEntry = active.entries.find(e => e.exerciseId === legPress.id)!;
    const changes = active.plan!.assessment!.changes;
    expect(changes).toHaveLength(1);
    expect(changes[0]).toMatchObject({ kind: 'add', entryId: newEntry.planEntryId });
  });

  it('replaceEntry appends "replace" from the original entry to the fresh one, and retires the original with excluded:"replaced"', () => {
    expect(replaceEntry(0, squat)).toBe(true);
    const active = state.value.active!;
    const newEntryId = active.entries[0]!.planEntryId!;
    const changes = active.plan!.assessment!.changes;
    expect(changes).toHaveLength(1);
    expect(changes[0]).toMatchObject({ kind: 'replace', fromEntryId: 'pe_bench', toEntryId: newEntryId });
    expect(active.plan!.entries.find(e => e.id === 'pe_bench')!.excluded).toBe('replaced');
  });

  it('removeEntry appends "remove" for the retired entry', () => {
    removeEntry(0);
    const active = state.value.active!;
    const changes = active.plan!.assessment!.changes;
    expect(changes).toHaveLength(1);
    expect(changes[0]).toMatchObject({ kind: 'remove', entryId: 'pe_bench' });
    expect(active.plan!.entries.find(e => e.id === 'pe_bench')!.excluded).toBe('removed');
  });

  it('a pre-P04 session (no assessment) still adds/replaces/removes correctly, and stays without one', () => {
    const noAssessment = live();
    delete (noAssessment.plan as { assessment?: unknown }).assessment;
    replaceState(seed(noAssessment));
    addExerciseToSession(legPress);
    expect(state.value.active!.plan!.assessment).toBeUndefined();
    expect(state.value.active!.entries.some(e => e.exerciseId === legPress.id)).toBe(true);
  });
});

describe('a full mixed session (add, replace, targets, remove) round-trips through save/reload intact', () => {
  beforeEach(() => { initStore(memory()); replaceState(seed()); });

  it('the whole journal survives loadState unchanged, and normalizePlan accepts real production output — not just hand-crafted fixtures', () => {
    addExerciseToSession(legPress);
    const proposed = offer();
    acceptLiveAdjustment('pe_bench', STARTED, proposed);
    expect(replaceEntry(state.value.active!.entries.findIndex(e => e.exerciseId === legPress.id), squat)).toBe(true);
    const before = state.value.active!.plan!.assessment!;
    expect(before.changes).toHaveLength(3);
    expect(before.changes.map(c => c.kind)).toEqual(['add', 'targets', 'replace']);

    const storage = memory();
    storage.setItem(STATE_KEY, JSON.stringify(state.value));
    const { state: loaded } = loadState(storage);
    expect(loaded.active!.plan!.assessment).toEqual(before);
  });
});

describe('D06: appendAgreementChange enforces the cap explicitly, never a silent truncation', () => {
  it('the 257th change drops the whole assessment, not a 256-length array', () => {
    const base = live().plan!;
    let plan: typeof base | undefined = base;
    for (let i = 0; i < MAX_ASSESSMENT_CHANGES; i++) {
      plan = appendAgreementChange(plan, { id: `c${i}`, acceptedAt: STARTED, kind: 'targets', entryId: 'pe_bench', reason: 'max_below_target', targets: [{ setIndex: 0, target: { ...target } }] });
    }
    expect(plan!.assessment!.changes).toHaveLength(MAX_ASSESSMENT_CHANGES);
    plan = appendAgreementChange(plan, { id: 'overflow', acceptedAt: STARTED, kind: 'targets', entryId: 'pe_bench', reason: 'max_below_target', targets: [{ setIndex: 0, target: { ...target } }] });
    expect(plan!.assessment).toBeUndefined();
  });

  it('appending to a plan with no assessment (or no plan at all) is a safe no-op', () => {
    expect(appendAgreementChange(undefined, { id: 'c1', acceptedAt: STARTED, kind: 'add', entryId: 'x' })).toBeUndefined();
    const withoutAssessment = { ...live().plan!, assessment: undefined };
    expect(appendAgreementChange(withoutAssessment, { id: 'c1', acceptedAt: STARTED, kind: 'add', entryId: 'x' })).toEqual(withoutAssessment);
  });
});
