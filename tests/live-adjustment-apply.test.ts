import { beforeEach, describe, expect, it } from 'vitest';
import { autoregulate, type LiveAdjustment } from '@/brain/live';
import { findExercise } from '@/core/exercises';
import { freshState, type ActiveSession, type AppState, type WorkoutPlanEntry } from '@/core/models';
import { initStore, replaceState, state, update } from '@/core/store';
import { restNext } from '@/app/selectors';
import { acceptLiveAdjustment, addSet, dismissLiveAdjustment, replaceEntry, setSet } from '@/slices/workout/session';

const STARTED = '2026-09-21T05:00:00.000Z';
const bench = findExercise('lib_barbell_bench_press')!;
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
    plan: { version: 1, capturedAt: STARTED, goal: 'lean', deload: null, entries: [planEntry()] },
  };
}

function seed(active = live()): AppState {
  const next = freshState(new Date('2026-09-21T00:00:00.000Z'));
  next.active = active;
  next.splits = [{ id: 'split_push', name: 'Push', color: '#fff', focus: [], createdAt: STARTED, exercises: [{ exerciseId: bench.id, sets: 3 }] }];
  return next;
}

function offer(active = state.value.active!): LiveAdjustment {
  const entry = active.entries.find(candidate => candidate.planEntryId === 'pe_bench')!;
  const captured = active.plan!.entries.find(candidate => candidate.id === 'pe_bench')!;
  return autoregulate({ exercise: bench, goal: active.plan!.goal, sets: entry.sets, targets: captured.targets, sourceSet: 0, deloadActive: false, decisionTaken: false, historyBacked: true, allowIncrease: true })!;
}

describe('live adjustment persistence guards', () => {
  beforeEach(() => { initStore(memory()); replaceState(seed()); });

  it('accepts into target metadata only and leaves actuals, originals and the split unchanged', () => {
    const beforeSets = structuredClone(state.value.active!.entries[0]!.sets);
    const beforeTargets = structuredClone(state.value.active!.plan!.entries[0]!.targets);
    const beforeSplit = structuredClone(state.value.splits[0]);
    const proposed = offer();
    expect(acceptLiveAdjustment('pe_bench', STARTED, proposed)).toBe(true);
    const active = state.value.active!;
    expect(active.entries[0]!.sets).toEqual(beforeSets);
    expect(active.plan!.entries[0]!.targets).toEqual(beforeTargets);
    expect(active.entries[0]!.targetOverrides).toEqual([null, proposed.next, proposed.next]);
    expect(active.plan!.entries[0]!.acceptedTargets).toEqual([null, proposed.next, proposed.next]);
    expect(active.entries[0]!.coachDecision).toEqual({ key: proposed.key, action: 'accepted' });
    expect(state.value.splits[0]).toEqual(beforeSplit);
    expect(state.value.sessions).toEqual([]);
    expect(dismissLiveAdjustment('pe_bench', STARTED, proposed)).toBe(false);
  });

  it('persists one dismissal across a store restart without writing overrides', () => {
    const storage = memory();
    initStore(storage);
    replaceState(seed());
    const proposed = offer();
    expect(dismissLiveAdjustment('pe_bench', STARTED, proposed)).toBe(true);
    initStore(storage);
    expect(state.value.active!.entries[0]!.coachDecision).toEqual({ key: proposed.key, action: 'dismissed' });
    expect(state.value.active!.entries[0]!.targetOverrides).toBeUndefined();
    expect(state.value.active!.plan!.entries[0]!.acceptedTargets).toBeUndefined();
  });

  it('rejects a stale source edit without changing any target metadata', () => {
    const proposed = offer();
    setSet(0, 0, { reps: 5 });
    expect(acceptLiveAdjustment('pe_bench', STARTED, proposed)).toBe(false);
    expect(state.value.active!.entries[0]!.targetOverrides).toBeUndefined();
    expect(state.value.active!.entries[0]!.coachDecision).toBeUndefined();
  });

  it('uses stable identity after an array shift and never redirects to the shifted row', () => {
    const proposed = offer();
    const otherPlan = { ...planEntry('pe_other'), exerciseId: 'lib_machine_chest_press', name: 'Machine Chest Press' };
    update(current => ({ ...current, active: current.active ? {
      ...current.active,
      entries: [{ exerciseId: otherPlan.exerciseId, name: otherPlan.name, sets: [{}, {}, {}], done: false, skipped: false, planEntryId: otherPlan.id }, ...current.active.entries],
      plan: { ...current.active.plan!, entries: [otherPlan, ...current.active.plan!.entries] },
    } : null }));
    expect(acceptLiveAdjustment('pe_bench', STARTED, proposed)).toBe(true);
    expect(state.value.active!.entries[0]!.targetOverrides).toBeUndefined();
    expect(state.value.active!.entries[1]!.targetOverrides).toEqual([null, proposed.next, proposed.next]);
  });

  it('rejects an offer after its entry is removed or a new session replaces it', () => {
    const proposed = offer();
    update(current => ({ ...current, active: current.active ? { ...current.active, entries: [], plan: { ...current.active.plan!, entries: [] } } : null }));
    expect(acceptLiveAdjustment('pe_bench', STARTED, proposed)).toBe(false);
    replaceState(seed({ ...live(), startedAt: '2026-09-21T07:00:00.000Z' }));
    expect(dismissLiveAdjustment('pe_bench', STARTED, proposed)).toBe(false);
    expect(state.value.active!.entries[0]!.coachDecision).toBeUndefined();
  });

  it('rejects acceptance while the session is paused', () => {
    const proposed = offer();
    update(current => ({ ...current, active: current.active ? { ...current.active, pausedAt: Date.now() } : null }));
    expect(acceptLiveAdjustment('pe_bench', STARTED, proposed)).toBe(false);
  });

  it('rejects a stale offer after the exercise is done or metadata exceeds its bound', () => {
    const proposed = offer();
    update(current => ({ ...current, active: current.active ? { ...current.active, entries: current.active.entries.map((entry, index) => index ? entry : { ...entry, done: true }) } : null }));
    expect(acceptLiveAdjustment('pe_bench', STARTED, proposed)).toBe(false);
    const oversized = live();
    oversized.entries[0]!.sets = [oversized.entries[0]!.sets[0]!, ...Array.from({ length: 100 }, () => ({}))];
    replaceState(seed(oversized));
    expect(acceptLiveAdjustment('pe_bench', STARTED, proposed)).toBe(false);
  });

  it('keeps the accepted row target and rest banner in agreement', () => {
    const proposed = offer();
    expect(acceptLiveAdjustment('pe_bench', STARTED, proposed)).toBe(true);
    update(current => ({ ...current, active: current.active ? { ...current.active, rest: { endsAt: Date.now() + 60_000, totalSec: 60, from: { entry: 0, set: 0, startedAt: STARTED, exerciseId: bench.id } } } : null }));
    expect(state.value.active!.entries[0]!.targetOverrides?.[1]).toEqual(proposed.next);
    expect(restNext.value).toEqual({ kind: 'set', setNumber: 2, kg: proposed.next.kg, reps: proposed.next.reps, durationSec: null });
  });

  it('clears effective overrides after a structural add while retaining the one decision and accepted record', () => {
    const proposed = offer();
    expect(acceptLiveAdjustment('pe_bench', STARTED, proposed)).toBe(true);
    addSet(0);
    expect(state.value.active!.entries[0]!.targetOverrides).toBeUndefined();
    expect(state.value.active!.entries[0]!.coachDecision?.action).toBe('accepted');
    expect(state.value.active!.plan!.entries[0]!.acceptedTargets?.[1]).toEqual(proposed.next);
    expect(acceptLiveAdjustment('pe_bench', STARTED, proposed)).toBe(false);
  });

  it('a replacement receives a fresh identity and no inherited decision', () => {
    const proposed = offer();
    expect(dismissLiveAdjustment('pe_bench', STARTED, proposed)).toBe(true);
    const machine = findExercise('lib_machine_chest_press')!;
    expect(replaceEntry(0, machine, { startedAt: STARTED, exerciseId: bench.id })).toBe(true);
    const replacement = state.value.active!.entries[0]!;
    expect(replacement.planEntryId).not.toBe('pe_bench');
    expect(replacement.coachDecision).toBeUndefined();
    expect(replacement.targetOverrides).toBeUndefined();
  });

  it('a legacy active session cannot acquire invented target metadata', () => {
    const legacy = live();
    legacy.plan = undefined;
    legacy.entries[0]!.planEntryId = undefined;
    replaceState(seed(legacy));
    const staleOffer = autoregulate({ exercise: bench, goal: 'lean', sets: legacy.entries[0]!.sets, targets: [target, target, target], sourceSet: 0, deloadActive: false, decisionTaken: false, historyBacked: true, allowIncrease: true })!;
    expect(acceptLiveAdjustment('pe_bench', STARTED, staleOffer)).toBe(false);
    expect(state.value.active!.entries[0]!.targetOverrides).toBeUndefined();
  });
});
