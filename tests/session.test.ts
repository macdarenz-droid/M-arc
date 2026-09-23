import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { replaceState, state } from '@/core/store';
import { freshState, type AppState, type Session, type Split } from '@/core/models';
import {
  addSet, adjustRest, commitSet, commitSetById, finishSession, logPastSession, moveEntry, pauseSession, rebuildRecoveryModel,
  resolveSessionTiming, setSet, startRest, startSession, substituteEntry,
} from '@/slices/workout/session';
import { deleteSplit } from '@/slices/workout/splits';
import { findExercise } from '@/core/exercises';
import { sessionAt, sets, baseCoachExtras } from './helpers';

const split: Split = { id: 'sp', name: 'Push', color: '#fff', focus: [], createdAt: '', exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 2 }, { exerciseId: 'lib_cable_fly', sets: 1 }] };
const T0 = Date.parse('2026-09-22T10:00:00.000Z');

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(T0);
  replaceState({ ...freshState(), splits: [split], preferences: { ...freshState().preferences, autoRest: true } });
});
afterEach(() => { vi.useRealTimers(); });

const a = () => state.value.active!;
const start = () => { startSession(split); return a(); };

describe('commit-once sets (UI-01)', () => {
  it('a second blur changes nothing: time, rest, fidelity and the rest timer stay', () => {
    start();
    setSet(0, 0, { kg: 60, reps: 8 });
    vi.advanceTimersByTime(30_000);
    expect(commitSet(0, 0)).toBe(true);
    const first = { ...a().entries[0]!.sets[0]! };
    const endsAt = a().rest!.endsAt;
    vi.advanceTimersByTime(20_000);
    expect(commitSet(0, 0)).toBe(true);
    const again = a().entries[0]!.sets[0]!;
    expect(again.at).toBe(first.at);
    expect(again.restSec).toBe(first.restSec);
    expect(again.fidelity).toBe(first.fidelity);
    expect(a().rest!.endsAt).toBe(endsAt);
  });
  it('emptying a committed set makes it a draft again', () => {
    start();
    setSet(0, 0, { kg: 60, reps: 8 });
    commitSet(0, 0);
    setSet(0, 0, { reps: undefined });
    const s = a().entries[0]!.sets[0]!;
    expect(s.at).toBeUndefined();
    expect(s.fidelity).toBeUndefined();
    expect(s.status).toBe('draft');
  });
  it('addSet carries load and reps, never timing or effort', () => {
    start();
    setSet(1, 0, { kg: 60, reps: 8, effort: 'max' });
    commitSet(1, 0);
    addSet(1);
    const added = a().entries[1]!.sets.at(-1)!;
    expect(added).toMatchObject({ kg: 60, reps: 8 });
    for (const k of ['at', 'restSec', 'fidelity', 'heart', 'flags', 'effort', 'status'] as const) expect(added[k]).toBeUndefined();
    expect(added.id).toBeTruthy();
    expect(added.id).not.toBe(a().entries[1]!.sets[0]!.id);
  });
});

describe('stable ids (R2.8)', () => {
  it('a native handover snapshot has one stable identity for every live target', () => {
    const live = start();
    const ids = [live.id, ...live.entries.flatMap(e => [e.id, ...e.sets.map(s => s.id)])];
    expect(ids.every(id => typeof id === 'string' && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(JSON.parse(JSON.stringify(live)).id).toBe(live.id);
  });
  it('ids survive reorder and finish; the session keeps the live id', () => {
    const live = start();
    const ids = live.entries.map(e => [e.id, ...e.sets.map(s => s.id)]);
    expect(ids.flat().every(Boolean)).toBe(true);
    moveEntry(0, 1);
    expect(a().entries.map(e => e.id)).toEqual([ids[1]![0], ids[0]![0]]);
    setSet(1, 0, { kg: 60, reps: 8 });
    commitSet(1, 0);
    vi.advanceTimersByTime(40 * 60_000);
    const r = finishSession(false)!;
    expect(r.session.id).toBe(live.id);
    const set = r.session.exercises[0]!.sets[0]!;
    expect(set.id).toBe(ids[0]![1]);
    expect(set.status).toBeUndefined();
    expect(r.session.logging).toMatchObject({ trainedAt: live.startedAt });
  });
  it('a substitution creates a new entry id', () => {
    const before = start().entries[0]!.id;
    substituteEntry(0, findExercise('lib_dumbbell_shoulder_press')!);
    expect(a().entries[0]!.id).not.toBe(before);
  });
  it('commitSetById twice gives one commit', () => {
    start();
    const id = a().entries[0]!.sets[0]!.id!;
    setSet(0, 0, { kg: 60, reps: 8 });
    expect(commitSetById(id)).toBe(true);
    const at = a().entries[0]!.sets[0]!.at;
    vi.advanceTimersByTime(5_000);
    expect(commitSetById(id)).toBe(true);
    expect(a().entries[0]!.sets[0]!.at).toBe(at);
  });
  it('a stable set target survives reordering without committing another exercise', () => {
    start();
    const target = a().entries[0]!.sets[0]!.id!;
    const other = a().entries[1]!.sets[0]!.id!;
    setSet(0, 0, { kg: 60, reps: 8 });
    moveEntry(0, 1);
    expect(commitSetById(target)).toBe(true);
    expect(a().entries[1]!.sets[0]!.id).toBe(target);
    expect(a().entries[1]!.sets[0]!.status).toBe('committed');
    expect(a().entries[0]!.sets[0]!.id).toBe(other);
    expect(a().entries[0]!.sets[0]!.at).toBeUndefined();
  });
  it('actionAt in the past drives the set time, rest and rest timer', () => {
    start();
    setSet(0, 0, { kg: 60, reps: 8 });
    vi.advanceTimersByTime(60_000);
    commitSet(0, 0);
    vi.advanceTimersByTime(240_000);
    setSet(0, 1, { kg: 60, reps: 8 });
    const actionAt = new Date(Date.now() - 120_000).toISOString();
    commitSetById(a().entries[0]!.sets[1]!.id!, { actionAt });
    const s = a().entries[0]!.sets[1]!;
    expect(s.at).toBe(actionAt);
    expect(s.restSec).toBe(120);
    expect(s.fidelity).toBe('live');
    expect(a().rest!.endsAt).toBe(Date.parse(actionAt) + state.value.preferences.restDefaultSec * 1000);
  });
  it('an old live session without ids gets ids, and no invented times', () => {
    replaceState({ ...freshState(), active: { splitId: 'sp', startedAt: new Date(T0).toISOString(), pausedMs: 0, entries: [{ exerciseId: 'x', name: 'X', sets: [{ kg: 10, reps: 5 }, {}], done: false, skipped: false }] } });
    const live = a();
    expect(live.id).toBeTruthy();
    expect(live.entries[0]!.id).toBeTruthy();
    expect(live.entries[0]!.sets.every(s => s.id && !s.at)).toBe(true);
  });
});

describe('history order and edits (RG-05, UI-11, UI-12)', () => {
  const past = (day: string): Session => sessionAt(`${day}T10:00:00.000Z`, `${day}T11:00:00.000Z`, [{ id: 'lib_barbell_bench_press', sets: sets(60, 8, 'max') }]);
  it('resolveSessionTiming moves a session into its sorted place', () => {
    const [s1, s2, s3] = [past('2026-09-10'), past('2026-09-12'), past('2026-09-14')];
    replaceState({ ...freshState(), sessions: [s1, s2, s3] });
    resolveSessionTiming(s3.id, '2026-09-11T09:00', 60, 'user');
    expect(state.value.sessions.map(s => s.id)).toEqual([s1.id, s3.id, s2.id]);
  });
  it('logPastSession inserts in sorted order', () => {
    const [s1, s2] = [past('2026-09-10'), past('2026-09-14')];
    replaceState({ ...freshState(), splits: [split], sessions: [s1, s2] });
    const r = logPastSession({ splitId: 'sp', trainedAtLocal: '2026-09-12T10:00', durationMin: 45, entries: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench', sets: [{ kg: 60, reps: 8 }] }] })!;
    expect(state.value.sessions.map(s => s.id)).toEqual([s1.id, r.session.id, s2.id]);
  });
  it('deleting the split of a live session keeps the session', () => {
    start();
    deleteSplit('sp');
    expect(state.value.active).not.toBeNull();
    setSet(0, 0, { kg: 60, reps: 8 });
    commitSet(0, 0);
    expect(finishSession(false)!.session.splitName).toBe('Workout');
  });
  it('the rebuilt recovery model depends only on the sessions left, not their order', () => {
    const list = Array.from({ length: 12 }, (_, i) => past(`2026-08-${String(10 + i * 2).padStart(2, '0')}`));
    const base = { customExercises: [], profile: baseCoachExtras.profile, healthDays: [] };
    const without = list.filter((_, i) => i !== 5);
    expect(rebuildRecoveryModel({ ...base, sessions: [...without].reverse() })).toEqual(rebuildRecoveryModel({ ...base, sessions: without }));
    expect(rebuildRecoveryModel({ ...base, sessions: [] })).toEqual({ tauScale: {}, observations: {} });
  });
});

describe('rest while paused (UI-19)', () => {
  it('adjustRest while paused changes the held time and schedules nothing', () => {
    start();
    startRest(90);
    pauseSession();
    const held = a().rest!.pausedRemainingSec!;
    adjustRest(15);
    expect(a().rest!.pausedRemainingSec).toBe(held + 15);
    adjustRest(-1000);
    expect(a().rest!.pausedRemainingSec).toBe(5);
  });
  it('startRest while paused holds the full rest', () => {
    start();
    pauseSession();
    startRest(120);
    expect(a().rest!.pausedRemainingSec).toBe(120);
  });
});

export type { AppState };
