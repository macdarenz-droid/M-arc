import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const fx = vi.hoisted(() => ({
  resyncReminders: vi.fn(async () => undefined),
  scheduleRestDone: vi.fn(async (_at: number) => undefined),
  cancelRestDone: vi.fn(async () => undefined),
  confirm: vi.fn(async () => undefined),
  success: vi.fn(async () => undefined),
}));
vi.mock('@/slices/settings/reminders', () => ({ resyncReminders: fx.resyncReminders }));
vi.mock('@/native/notifications', async orig => ({ ...(await orig<object>()), scheduleRestDone: fx.scheduleRestDone, cancelRestDone: fx.cancelRestDone }));
vi.mock('@/native/haptics', async orig => {
  const real = await orig<{ haptic: object }>();
  return { ...real, haptic: { ...real.haptic, confirm: fx.confirm, success: fx.success } };
});

import { freshState, type AppState, type CommandReceipt, type LoggedSet, type Split } from '@/core/models';
import { initStore, replaceState, state } from '@/core/store';
import { fnv } from '@/escobar/hash';
import { enteredLoad } from '@/core/units';
import { findExercise } from '@/core/exercises';
import {
  addExerciseToSession, addSet, adjustRest, commitSet, discardSession, finishSession, isCommitted, logWarmups, moveEntry, pauseSession, resumeSession, setSet, startRest, startSession, substituteEntry,
} from '@/slices/workout/session';
import { handleWorkoutCommand } from '@/slices/workout/commands';
import { sessionAt, sets } from '../helpers';

type Mem = Storage & { map: Map<string, string>; writes: string[]; fail: boolean };
function memoryStorage(): Mem {
  const map = new Map<string, string>();
  const writes: string[] = [];
  const mem = {
    map, writes, fail: false,
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => { if (mem.fail) throw new Error('disk error'); writes.push(k); map.set(k, v); },
    removeItem: (k: string) => { map.delete(k); },
    clear: () => map.clear(),
    key: (i: number) => [...map.keys()][i] ?? null,
    get length() { return map.size; },
  };
  return mem as Mem;
}

const split: Split = { id: 'sp', name: 'Push', color: '#fff', focus: [], createdAt: '', exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 2 }, { exerciseId: 'lib_cable_fly', sets: 1 }] };
const T0 = Date.parse('2026-09-22T10:00:00.000Z');
let mem: Mem;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(T0);
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  mem = memoryStorage();
  initStore(mem);
  replaceState({ ...freshState(), splits: [split] });
});
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

const a = () => state.value.active!;
const saved = (): AppState => JSON.parse(mem.map.get('marc.state.v1')!) as AppState;
const allSets = (): LoggedSet[] => a().entries.flatMap(e => e.sets);
const committed = (): LoggedSet[] => allSets().filter(s => s.status === 'committed');
const clearFx = () => Object.values(fx).forEach(f => f.mockClear());
/** Starts the split and forgets the start's own haptic, so each test counts only its commands' effects. */
const begin = () => { startSession(split); clearFx(); return a(); };

let seq = 0;
const nextId = () => `cmd-${String(++seq).padStart(5, '0')}`;
const cmd = (kind: string, extra: Record<string, unknown> = {}) => ({ v: 1, commandId: nextId(), sessionId: state.value.active?.id ?? 's_none', actionAt: Date.now(), kind, ...extra });
const complete = (setId: string, extra: Record<string, unknown> = {}) => cmd('complete_set', { setId, expectedRev: 0, load: { value: 60, unit: 'kg' }, reps: 8, ...extra });

describe('WATCH-B B1: new sets are drafts with their own id and rev 0', () => {
  it('start, added, warm-up, substitute and added-exercise sets', () => {
    begin();
    const draft = (s: LoggedSet) => s.status === 'draft' && s.rev === 0 && typeof s.id === 'string';
    expect(allSets().every(draft)).toBe(true);
    setSet(0, 1, { kg: 60, entered: { value: 60, unit: 'kg' }, reps: 8, effort: 'max', kind: 'drop', flags: ['duplicate'], durationSec: 40 });
    vi.advanceTimersByTime(30_000);
    expect(commitSet(0, 1)).toBe(true);
    setSet(0, 1, { heart: { peakBpm: 150, endBpm: 140 } });
    const last = a().entries[0]!.sets[1]!;
    expect(last.at && last.fidelity && last.restSec == null).toBe(true);
    addSet(0);
    const added = a().entries[0]!.sets[2]!;
    // The next set carries load and reps only: no timing, heart, flags, effort or kind (UI-01). UI-01's
    // own test pins its status as unset, which reads as a draft.
    expect(added).toEqual({ id: expect.any(String), rev: 0, kg: 60, entered: { value: 60, unit: 'kg' }, reps: 8, durationSec: 40 });
    expect(isCommitted(added)).toBe(false);
    logWarmups(1, [{ kg: 10, reps: 10 }]);
    const warm = a().entries[1]!.sets[0]!;
    expect(warm).toEqual({ id: expect.any(String), status: 'draft', rev: 0, kg: 10, reps: 10, kind: 'warmup' });
    const before = new Set(allSets().map(s => s.id));
    substituteEntry(0, findExercise('lib_dumbbell_bench_press')!);
    // A3-4 (main): the committed sets stay on the original entry, and the substitute follows it.
    const subs = a().entries.find(e => e.exerciseId === 'lib_dumbbell_bench_press')!.sets;
    expect(subs.length > 0 && subs.every(draft) && subs.every(s => !before.has(s.id))).toBe(true);
    addExerciseToSession(findExercise('lib_dumbbell_lateral_raise')!);
    const raise = () => a().entries.findIndex(e => e.exerciseId === 'lib_dumbbell_lateral_raise');
    expect(raise()).toBeGreaterThan(-1);
    expect(a().entries[raise()]!.sets.every(draft)).toBe(true);
    expect(new Set(allSets().map(s => s.id)).size).toBe(allSets().length);
    addSet(raise());
    expect(a().entries[raise()]!.sets.at(-1)!.id).not.toBe(a().entries[raise()]!.sets.at(-2)!.id);
  });
});

describe('WATCH-B B2: complete_set saves the set', () => {
  it('saves the values, at, receivedAt and one receipt, read back from storage', () => {
    begin();
    const set = a().entries[0]!.sets[0]!;
    vi.advanceTimersByTime(60_000);
    const rev = a().rev!;
    const c = complete(set.id!, { actionAt: Date.now() - 2_000, load: { value: 135, unit: 'lb' }, effort: 'ideal' });
    const r = handleWorkoutCommand(c);
    expect(r).toEqual({ commandId: c.commandId, status: 'applied', sessionRev: rev + 1, replayed: false });
    const back = saved();
    expect(back.active!.rev).toBe(rev + 1);
    expect(back.active!.entries[0]!.sets[0]).toMatchObject({
      id: set.id, status: 'committed', rev: 1, ...enteredLoad(135, 'lb'), reps: 8, effort: 'ideal',
      at: new Date(c.actionAt).toISOString(), receivedAt: new Date(Date.now()).toISOString(), fidelity: 'live',
    });
    expect(back.commands.receipts).toEqual([{ commandId: c.commandId, sessionId: c.sessionId, kind: 'complete_set', fp: expect.stringMatching(/^[0-9a-f]{16}$/), result: r, actionAt: c.actionAt, receivedAt: Date.now() }]);
    // The rest starts at the watch's action time, and its alarm and haptic only after the save.
    expect(back.active!.rest).toMatchObject({ id: expect.any(String), rev: 0, endsAt: c.actionAt + 90_000 });
    expect(fx.scheduleRestDone).toHaveBeenCalledTimes(1);
    expect(fx.scheduleRestDone).toHaveBeenCalledWith(c.actionAt + 90_000);
    expect(fx.confirm).toHaveBeenCalledTimes(1);
  });
  it('a set without a load is saved without one', () => {
    begin();
    const set = a().entries[0]!.sets[0]!;
    setSet(0, 0, { kg: 50 });
    const r = handleWorkoutCommand(complete(set.id!, { expectedRev: 1, load: undefined, reps: 12 }));
    expect(r.status).toBe('applied');
    const s = saved().active!.entries[0]!.sets[0]!;
    expect(s.reps).toBe(12);
    expect(s.kg).toBeUndefined();
    expect(s.entered).toBeUndefined();
  });
});

describe('WATCH-B B3: a resend after a lost acknowledgement', () => {
  it('gets the identical result marked replayed: one set, one rest, no write', () => {
    begin();
    vi.advanceTimersByTime(60_000);
    const c = complete(a().entries[0]!.sets[0]!.id!);
    const first = handleWorkoutCommand(c);
    const restId = a().rest!.id;
    vi.advanceTimersByTime(3_000);
    const writes = mem.writes.length;
    const snapshot = state.value;
    const again = handleWorkoutCommand(JSON.parse(JSON.stringify(c)));
    expect(again).toEqual({ ...first, replayed: true });
    expect(state.value).toBe(snapshot);
    expect(mem.writes.length).toBe(writes);
    expect(committed()).toHaveLength(1);
    expect(a().rest!.id).toBe(restId);
    expect(saved().commands.receipts).toHaveLength(1);
    expect(fx.scheduleRestDone).toHaveBeenCalledTimes(1);
    expect(fx.confirm).toHaveBeenCalledTimes(1);
  });
});

describe('WATCH-B B4: duplicates and reused ids', () => {
  it('a second completion of a committed set gives already_committed, kept as a receipt', () => {
    begin();
    vi.advanceTimersByTime(60_000);
    const id = a().entries[0]!.sets[0]!.id!;
    handleWorkoutCommand(complete(id));
    const at = a().entries[0]!.sets[0]!.at;
    vi.advanceTimersByTime(10_000);
    // Checked before the revision (QA-W-6): the stale rev 0 would also not match.
    const c = complete(id, { reps: 9 });
    expect(handleWorkoutCommand(c)).toEqual({ commandId: c.commandId, status: 'rejected', reason: 'already_committed', replayed: false });
    expect(a().entries[0]!.sets[0]!).toMatchObject({ at, reps: 8 });
    expect(saved().commands.receipts.map(x => x.result.status)).toEqual(['applied', 'rejected']);
  });
  it('a reused id with a different payload or a different session gives id_conflict, stored nowhere', () => {
    begin();
    vi.advanceTimersByTime(60_000);
    const c = complete(a().entries[0]!.sets[0]!.id!);
    handleWorkoutCommand(c);
    const writes = mem.writes.length;
    const snapshot = state.value;
    for (const changed of [{ ...c, reps: 9 }, { ...c, sessionId: 's_other_session' }, { ...c, actionAt: c.actionAt - 1 }]) {
      expect(handleWorkoutCommand(changed)).toEqual({ commandId: c.commandId, status: 'rejected', reason: 'id_conflict', replayed: false });
    }
    expect(state.value).toBe(snapshot);
    expect(mem.writes.length).toBe(writes);
  });
});

describe('WATCH-B B5: reorder', () => {
  it('commits the set the watch named, wherever its exercise moved; edits to other exercises do not reject', () => {
    begin();
    const target = a().entries[0]!.sets[1]!;
    moveEntry(0, 1);
    setSet(0, 0, { kg: 20, reps: 12 }); // the fly, now first
    vi.advanceTimersByTime(60_000);
    expect(handleWorkoutCommand(complete(target.id!)).status).toBe('applied');
    const bench = a().entries.find(e => e.exerciseId === 'lib_barbell_bench_press')!;
    expect(a().entries[1]).toBe(bench);
    expect(bench.sets[1]).toMatchObject({ id: target.id, status: 'committed', reps: 8 });
    expect(bench.sets[0]!.status).toBe('draft');
    expect(a().entries[0]!.sets[0]).toMatchObject({ status: 'draft', kg: 20, reps: 12 });
  });
});

describe('WATCH-B B6: substitution and phone edits', () => {
  it('after a substitution the old target gives target_missing', () => {
    begin();
    const old = a().entries[0]!.sets[0]!.id!;
    substituteEntry(0, findExercise('lib_dumbbell_bench_press')!);
    const r = handleWorkoutCommand(complete(old));
    expect(r).toMatchObject({ status: 'rejected', reason: 'target_missing', replayed: false });
    expect(committed()).toHaveLength(0);
    expect(saved().commands.receipts).toHaveLength(1);
  });
  it('after a phone edit it gives stale_revision, and the phone value is kept', () => {
    begin();
    const set = a().entries[0]!.sets[0]!;
    setSet(0, 0, { kg: 70, reps: 5 });
    const r = handleWorkoutCommand(complete(set.id!, { expectedRev: 0 }));
    expect(r).toMatchObject({ status: 'rejected', reason: 'stale_revision' });
    expect(saved().active!.entries[0]!.sets[0]).toMatchObject({ kg: 70, reps: 5, status: 'draft', rev: 1 });
    expect(a().entries[0]!.sets[0]!.at).toBeUndefined();
  });
});

describe('WATCH-B B7: a failed save', () => {
  it('answers not_saved, changes nothing, keeps no receipt and runs no side effect; a retry applies once', () => {
    begin();
    vi.advanceTimersByTime(60_000);
    const c = complete(a().entries[0]!.sets[0]!.id!);
    const before = state.value;
    const raw = mem.map.get('marc.state.v1');
    mem.fail = true;
    expect(handleWorkoutCommand(c)).toEqual({ commandId: c.commandId, status: 'not_saved', reason: 'storage_failed' });
    expect(state.value).toBe(before);
    expect(state.value.commands.receipts).toHaveLength(0);
    expect(mem.map.get('marc.state.v1')).toBe(raw);
    expect(fx.scheduleRestDone).not.toHaveBeenCalled();
    expect(fx.cancelRestDone).not.toHaveBeenCalled();
    expect(fx.confirm).not.toHaveBeenCalled();
    mem.fail = false;
    expect(handleWorkoutCommand(c)).toMatchObject({ status: 'applied', replayed: false });
    expect(committed()).toHaveLength(1);
    expect(saved().commands.receipts).toHaveLength(1);
    expect(fx.scheduleRestDone).toHaveBeenCalledTimes(1);
    expect(fx.confirm).toHaveBeenCalledTimes(1);
  });
  it('a finish that cannot be saved keeps the session; the retry saves it once', () => {
    begin();
    vi.advanceTimersByTime(60_000);
    handleWorkoutCommand(complete(a().entries[0]!.sets[0]!.id!));
    clearFx();
    const fin = cmd('finish');
    const before = state.value;
    mem.fail = true;
    expect(handleWorkoutCommand(fin)).toMatchObject({ status: 'not_saved' });
    expect(state.value).toBe(before);
    expect(fx.success).not.toHaveBeenCalled();
    expect(fx.resyncReminders).not.toHaveBeenCalled();
    expect(fx.cancelRestDone).not.toHaveBeenCalled();
    mem.fail = false;
    expect(handleWorkoutCommand(fin)).toMatchObject({ status: 'applied', finish: 'saved', replayed: false });
    expect(saved().sessions).toHaveLength(1);
    expect(fx.success).toHaveBeenCalledTimes(1);
  });
});

describe('WATCH-B B8: finish', () => {
  it('a finish replay leaves one history session and the same result; the split is unchanged', () => {
    begin();
    addExerciseToSession(findExercise('lib_dumbbell_lateral_raise')!); // would change the template if it were saved
    const id = a().id;
    vi.advanceTimersByTime(60_000);
    handleWorkoutCommand(complete(a().entries[0]!.sets[0]!.id!));
    vi.advanceTimersByTime(60_000);
    const fin = cmd('finish');
    const first = handleWorkoutCommand(fin);
    expect(first).toMatchObject({ commandId: fin.commandId, status: 'applied', finish: 'saved', replayed: false });
    const writes = mem.writes.length;
    expect(handleWorkoutCommand(fin)).toEqual({ ...first, replayed: true });
    expect(mem.writes.length).toBe(writes);
    const back = saved();
    expect(back.active).toBeNull();
    expect(back.sessions.map(s => s.id)).toEqual([id]);
    expect(back.splits).toEqual([split]);
    expect(back.commands.closed).toEqual([{ sessionId: id, status: 'finished', at: Date.now() }]);
    const set = back.sessions[0]!.exercises[0]!.sets[0]!;
    expect(set.rev).toBeUndefined();
    expect(set.status).toBeUndefined();
    expect(set.receivedAt).toBe(new Date(T0 + 60_000).toISOString());
  });
  it('an empty session is discarded', () => {
    begin();
    const id = a().id;
    const r = handleWorkoutCommand(cmd('finish'));
    expect(r).toMatchObject({ status: 'applied', finish: 'discarded', replayed: false });
    const back = saved();
    expect(back.active).toBeNull();
    expect(back.sessions).toHaveLength(0);
    expect(back.commands.closed).toEqual([{ sessionId: id, status: 'discarded', at: Date.now() }]);
  });
});

describe('WATCH-B B9: late commands', () => {
  const lateIsClosed = (sessionId: string) => {
    const snapshot = state.value;
    const writes = mem.writes.length;
    for (const c of [cmd('pause', { sessionId }), cmd('complete_set', { sessionId, setId: 'set_x', expectedRev: 0, reps: 5 }), cmd('finish', { sessionId })]) {
      expect(handleWorkoutCommand(c)).toEqual({ commandId: c.commandId, status: 'rejected', reason: 'session_closed', replayed: false });
    }
    expect(state.value).toBe(snapshot);
    expect(mem.writes.length).toBe(writes);
  };
  it('after a phone finish', () => {
    begin();
    const id = a().id!;
    setSet(0, 0, { kg: 60, reps: 8 });
    commitSet(0, 0);
    finishSession(false);
    lateIsClosed(id);
  });
  it('after a phone discard', () => {
    begin();
    const id = a().id!;
    discardSession();
    lateIsClosed(id);
  });
  it('after a newer session starts', () => {
    begin();
    const id = a().id!;
    discardSession();
    begin();
    lateIsClosed(id);
  });
  it('for a session already in history from before the closed list', () => {
    const old = sessionAt('2026-09-20T10:00:00.000Z', '2026-09-20T11:00:00.000Z', [{ id: 'lib_barbell_bench_press', sets: sets(60, 8) }]);
    replaceState({ ...state.value, sessions: [old] });
    begin();
    lateIsClosed(old.id);
  });
  it('no active session gives no_session, another id gives wrong_session; neither creates one', () => {
    const c = { v: 1, commandId: nextId(), sessionId: 's_unknown', actionAt: Date.now(), kind: 'pause' };
    expect(handleWorkoutCommand(c)).toMatchObject({ status: 'rejected', reason: 'no_session' });
    expect(state.value.active).toBeNull();
    begin();
    expect(handleWorkoutCommand({ ...c, commandId: nextId() })).toMatchObject({ status: 'rejected', reason: 'wrong_session' });
    expect(a().pausedAt).toBeUndefined();
    expect(state.value.commands.receipts).toHaveLength(0);
  });
});

describe('WATCH-B B10: rest, pause and resume', () => {
  it('+30 s moves the deadline by 30 s', () => {
    begin();
    startRest(90);
    const rest = a().rest!;
    vi.advanceTimersByTime(10_000);
    clearFx();
    expect(handleWorkoutCommand(cmd('rest_add_30', { restId: rest.id }))).toMatchObject({ status: 'applied' });
    expect(a().rest).toMatchObject({ id: rest.id, rev: 1, endsAt: rest.endsAt + 30_000 });
    expect(fx.scheduleRestDone).toHaveBeenCalledWith(rest.endsAt + 30_000);
  });
  it('a wrong rest id, or +30 s on a rest that has ended, gives stale_rest', () => {
    begin();
    startRest(90);
    const rest = a().rest!;
    expect(handleWorkoutCommand(cmd('rest_add_30', { restId: 'rest_old' }))).toMatchObject({ status: 'rejected', reason: 'stale_rest' });
    expect(handleWorkoutCommand(cmd('rest_skip', { restId: 'rest_old' }))).toMatchObject({ status: 'rejected', reason: 'stale_rest' });
    vi.advanceTimersByTime(91_000);
    clearFx();
    expect(handleWorkoutCommand(cmd('rest_add_30', { restId: rest.id }))).toMatchObject({ status: 'rejected', reason: 'stale_rest' });
    expect(a().rest).toEqual(rest);
    expect(fx.scheduleRestDone).not.toHaveBeenCalled();
    expect(saved().commands.receipts).toHaveLength(3);
  });
  it('while paused, +30 s adds to the held rest and sets no alarm; a held rest with 0 s left is stale', () => {
    begin();
    startRest(90);
    const rest = a().rest!;
    vi.advanceTimersByTime(30_000);
    handleWorkoutCommand(cmd('pause'));
    vi.advanceTimersByTime(120_000); // paused past the rest's original end: 60 s are still held
    clearFx();
    expect(handleWorkoutCommand(cmd('rest_add_30', { restId: rest.id }))).toMatchObject({ status: 'applied' });
    expect(a().rest).toMatchObject({ id: rest.id, pausedRemainingSec: 90, endsAt: rest.endsAt });
    expect(fx.scheduleRestDone).not.toHaveBeenCalled();
    handleWorkoutCommand(cmd('resume'));
    startRest(15);
    const short = a().rest!;
    vi.advanceTimersByTime(16_000);
    handleWorkoutCommand(cmd('pause')); // the rest has ended: 0 s held
    expect(a().rest!.pausedRemainingSec).toBe(0);
    expect(handleWorkoutCommand(cmd('rest_add_30', { restId: short.id }))).toMatchObject({ status: 'rejected', reason: 'stale_rest' });
    expect(a().rest!.pausedRemainingSec).toBe(0);
  });
  it('skip ends the rest', () => {
    begin();
    startRest(90);
    clearFx();
    expect(handleWorkoutCommand(cmd('rest_skip', { restId: a().rest!.id }))).toMatchObject({ status: 'applied' });
    expect(a().rest).toBeUndefined();
    expect(fx.cancelRestDone).toHaveBeenCalledTimes(1);
  });
  it('pause and resume use the receive time and hold the rest', () => {
    begin();
    startRest(90);
    const endsAt = a().rest!.endsAt;
    vi.advanceTimersByTime(30_000);
    expect(handleWorkoutCommand(cmd('pause', { actionAt: Date.now() - 5_000 }))).toMatchObject({ status: 'applied' });
    expect(a().pausedAt).toBe(Date.now());
    expect(a().rest).toMatchObject({ pausedRemainingSec: 60, rev: 1 });
    vi.advanceTimersByTime(20_000);
    clearFx();
    expect(handleWorkoutCommand(cmd('resume', { actionAt: Date.now() - 5_000 }))).toMatchObject({ status: 'applied' });
    expect(a().pausedAt).toBeUndefined();
    expect(a().pausedMs).toBe(20_000);
    expect(a().rest!.endsAt).toBe(endsAt + 20_000);
    expect(fx.scheduleRestDone).toHaveBeenCalledWith(endsAt + 20_000);
  });
  it('a resent invalid_state command stays rejected', () => {
    begin();
    expect(handleWorkoutCommand(cmd('resume'))).toMatchObject({ status: 'rejected', reason: 'invalid_state' });
    expect(handleWorkoutCommand(cmd('pause'))).toMatchObject({ status: 'applied' });
    const twice = cmd('pause');
    expect(handleWorkoutCommand(twice)).toMatchObject({ status: 'rejected', reason: 'invalid_state', replayed: false });
    expect(handleWorkoutCommand(cmd('resume'))).toMatchObject({ status: 'applied' });
    expect(handleWorkoutCommand(twice)).toEqual({ commandId: twice.commandId, status: 'rejected', reason: 'invalid_state', replayed: true });
    expect(a().pausedAt).toBeUndefined();
  });
});

describe('WATCH-B B11: action times', () => {
  it('delayed sets that arrive together keep the fidelity of their action times', () => {
    begin();
    const [s1, s2] = a().entries[0]!.sets;
    const s3 = a().entries[1]!.sets[0]!;
    vi.advanceTimersByTime(300_000);
    const at = [T0 + 60_000, T0 + 150_000, T0 + 240_000];
    [s1, s2, s3].forEach((s, i) => expect(handleWorkoutCommand(complete(s!.id!, { actionAt: at[i] }))).toMatchObject({ status: 'applied' }));
    const done = [s1, s2, s3].map(s => allSets().find(x => x.id === s!.id)!);
    expect(done.map(s => s.at)).toEqual(at.map(t => new Date(t).toISOString()));
    expect(done.map(s => s.fidelity)).toEqual(['live', 'live', 'live']);
    expect(done.map(s => s.restSec)).toEqual([undefined, 90 - 8 * 3, 90 - 8 * 3]);
    expect(done.every(s => s.receivedAt === new Date(T0 + 300_000).toISOString())).toBe(true);
    // Only the last set's rest is still running; the earlier ones ended before they arrived.
    expect(a().rest!.endsAt).toBe(T0 + 330_000);
    expect(fx.scheduleRestDone.mock.calls).toEqual([[T0 + 330_000]]);
  });
  it('a late set does not replace the rest a later set started', () => {
    begin();
    vi.advanceTimersByTime(150_000);
    setSet(0, 1, { kg: 60, reps: 8 });
    commitSet(0, 1);
    const rest = a().rest!;
    vi.advanceTimersByTime(10_000);
    clearFx();
    expect(handleWorkoutCommand(complete(a().entries[0]!.sets[0]!.id!, { actionAt: T0 + 60_000 }))).toMatchObject({ status: 'applied' });
    expect(a().entries[0]!.sets[0]).toMatchObject({ status: 'committed', at: new Date(T0 + 60_000).toISOString() });
    expect(a().rest).toEqual(rest);
    expect(fx.scheduleRestDone).not.toHaveBeenCalled();
  });
  it('a later set saved in another time format still keeps its rest', () => {
    begin();
    vi.advanceTimersByTime(150_000);
    setSet(0, 1, { kg: 60, reps: 8 });
    commitSet(0, 1);
    setSet(0, 1, { at: '2026-09-22T09:02:30.000-01:00' }); // the same instant, T0 + 150 s, as text that sorts before 10:01Z
    const rest = a().rest!;
    vi.advanceTimersByTime(10_000);
    expect(handleWorkoutCommand(complete(a().entries[0]!.sets[0]!.id!, { actionAt: T0 + 60_000 }))).toMatchObject({ status: 'applied' });
    expect(a().rest).toEqual(rest);
  });
  it('a future actionAt is clamped to the receive time and flagged', () => {
    begin();
    vi.advanceTimersByTime(60_000);
    const now = Date.now();
    const [s1, s2] = a().entries[0]!.sets;
    const s3 = a().entries[1]!.sets[0]!;
    handleWorkoutCommand(complete(s1!.id!, { actionAt: now + 60_000 }));
    handleWorkoutCommand(complete(s2!.id!, { actionAt: now + 4_000 }));
    handleWorkoutCommand(complete(s3.id!, { actionAt: T0 - 1_000 }));
    const [x1, x2, x3] = [s1, s2, s3].map(s => allSets().find(x => x.id === s!.id)!);
    expect(x1).toMatchObject({ at: new Date(now).toISOString(), flags: ['future_time'] });
    expect(x2!.at).toBe(new Date(now).toISOString());
    expect(x2!.flags).toBeUndefined();
    expect(x3!.at).toBe(new Date(now).toISOString());
    expect(x3!.flags).toBeUndefined();
  });
  it('two sets that share a clamped time both stay committed after a reload', () => {
    begin();
    vi.advanceTimersByTime(60_000);
    const now = Date.now();
    const [s1, s2] = a().entries[0]!.sets;
    handleWorkoutCommand(complete(s1!.id!, { actionAt: now + 60_000 }), now);
    handleWorkoutCommand(complete(s2!.id!, { actionAt: now + 60_000 }), now);
    initStore(mem);
    expect(a().entries[0]!.sets.map(s => [s.id, s.status, s.at])).toEqual([[s1!.id, 'committed', new Date(now).toISOString()], [s2!.id, 'committed', new Date(now).toISOString()]]);
  });
});

describe('WATCH-B B12: bad commands and the receipt cap', () => {
  it('a bad version, kind, type, range or size is rejected and not stored', () => {
    begin();
    const id = a().entries[0]!.sets[0]!.id!;
    const good = complete(id);
    const pad = (bytes: number) => { const c = { ...good, commandId: nextId(), pad: '' }; c.pad = 'x'.repeat(bytes - new TextEncoder().encode(JSON.stringify(c)).length); return c; };
    const cases: Array<[unknown, string]> = [
      [{ ...good, v: 2 }, 'unsupported'],
      [{ ...good, kind: 'undo_set' }, 'unsupported'],
      [{ ...good, v: '1' }, 'invalid'],
      [{ ...good, kind: 7 }, 'invalid'],
      [{ ...good, commandId: 'short' }, 'invalid'],
      [{ ...good, commandId: 'has space 123' }, 'invalid'],
      [{ ...good, commandId: 'x'.repeat(65) }, 'invalid'],
      [{ ...good, sessionId: 5 }, 'invalid'],
      [{ ...good, actionAt: 'now' }, 'invalid'],
      [{ ...good, setId: undefined }, 'invalid'],
      [{ ...good, expectedRev: -1 }, 'invalid'],
      [{ ...good, reps: 0 }, 'invalid'],
      [{ ...good, reps: 101 }, 'invalid'],
      [{ ...good, reps: 8.5 }, 'invalid'],
      [{ ...good, load: { value: 1001, unit: 'kg' } }, 'invalid'],
      [{ ...good, load: { value: -1, unit: 'kg' } }, 'invalid'],
      [{ ...good, load: { value: 60, unit: 'st' } }, 'invalid'],
      [{ ...good, effort: 'hard' }, 'invalid'],
      [{ ...cmd('rest_add_30') }, 'invalid'],
      [pad(1001), 'invalid'],
      [null, 'invalid'],
      ['{"v":1}', 'invalid'],
      [[good], 'invalid'],
    ];
    const snapshot = state.value;
    const writes = mem.writes.length;
    for (const [c, reason] of cases) expect(handleWorkoutCommand(c), JSON.stringify(c)?.slice(0, 80)).toMatchObject({ status: 'rejected', reason, replayed: false });
    expect(state.value).toBe(snapshot);
    expect(mem.writes.length).toBe(writes);
    // The limits themselves are accepted: 1000 B, 100 reps, 1000 kg, a 0 kg load.
    expect(handleWorkoutCommand(pad(1000))).toMatchObject({ status: 'applied' });
    const [, s2] = a().entries[0]!.sets;
    expect(handleWorkoutCommand(complete(s2!.id!, { reps: 100, load: { value: 1000, unit: 'kg' } }))).toMatchObject({ status: 'applied' });
    expect(handleWorkoutCommand(complete(a().entries[1]!.sets[0]!.id!, { load: { value: 0, unit: 'lb' }, reps: 1 }))).toMatchObject({ status: 'applied' });
  });
  it('at 500 receipts a new command gets limit_reached; nothing is dropped and replays still answer', () => {
    begin();
    vi.advanceTimersByTime(60_000);
    const first = complete(a().entries[0]!.sets[0]!.id!);
    const r = handleWorkoutCommand(first);
    const filler: CommandReceipt[] = Array.from({ length: 499 }, (_, i) => ({ commandId: `fill-${String(i).padStart(4, '0')}`, sessionId: a().id!, kind: 'pause', fp: '00000000', result: { commandId: `fill-${String(i).padStart(4, '0')}`, status: 'rejected', reason: 'invalid_state', replayed: false }, actionAt: T0, receivedAt: T0 }));
    replaceState({ ...state.value, commands: { ...state.value.commands, receipts: [...state.value.commands.receipts, ...filler] } });
    expect(state.value.commands.receipts).toHaveLength(500);
    const snapshot = state.value;
    const c = complete(a().entries[0]!.sets[1]!.id!);
    expect(handleWorkoutCommand(c)).toEqual({ commandId: c.commandId, status: 'rejected', reason: 'limit_reached', replayed: false });
    expect(state.value).toBe(snapshot);
    expect(a().entries[0]!.sets[1]!.status).toBe('draft');
    expect(handleWorkoutCommand(first)).toEqual({ ...r, replayed: true });
    expect(saved().commands.receipts).toHaveLength(500);
  });
  it('starting a session keeps only the last closed session\'s receipts', () => {
    begin();
    const one = a().id!;
    handleWorkoutCommand(cmd('pause'));
    handleWorkoutCommand(cmd('finish'));
    begin();
    const two = a().id!;
    const fin = cmd('finish');
    handleWorkoutCommand(fin);
    expect(state.value.commands.receipts.map(x => x.sessionId)).toEqual([one, one, two]);
    begin();
    expect(state.value.commands.receipts.map(x => x.commandId)).toEqual([fin.commandId]);
    expect(handleWorkoutCommand(fin)).toMatchObject({ finish: 'discarded', replayed: true });
  });
});

describe('WATCH-B B12, B13: a save from a newer build', () => {
  const newer = {
    receipts: [{ commandId: 'cmd-future-1', sessionId: 's_x', kind: 'undo_set', fp: 'ffffffff', result: { commandId: 'cmd-future-1', status: 'applied', sessionRev: 1, replayed: false }, actionAt: T0, receivedAt: T0 }],
    closed: [{ sessionId: 's_y', status: 'finished', at: T0, epoch: 3 }],
    cursor: 7,
  };
  const loadNewer = () => replaceState({ ...state.value, dataVersion: 2, commands: JSON.parse(JSON.stringify(newer)) as never });
  it("the phone's Start, Finish and Discard leave its command log as that build wrote it", () => {
    loadNewer();
    begin();
    expect(state.value.commands).toEqual(newer);
    setSet(0, 0, { kg: 60, reps: 8 });
    commitSet(0, 0);
    finishSession(false);
    expect(state.value.commands).toEqual(newer);
    begin();
    discardSession();
    expect(saved().commands).toEqual(newer);
    expect(saved().dataVersion).toBe(2);
  });
  it('a watch command gets unsupported, is not stored and writes nothing', () => {
    loadNewer();
    begin();
    const snapshot = state.value;
    const writes = mem.writes.length;
    const c = complete(a().entries[0]!.sets[0]!.id!);
    expect(handleWorkoutCommand(c)).toEqual({ commandId: c.commandId, status: 'rejected', reason: 'unsupported', replayed: false });
    expect(state.value).toBe(snapshot);
    expect(mem.writes.length).toBe(writes);
  });
});

describe('WATCH-B red team', () => {
  const oldReceipt = (sessionId: string, i: number): CommandReceipt => {
    const commandId = `old-${String(i).padStart(4, '0')}`;
    return { commandId, sessionId, kind: 'pause', fp: '00000000', result: { commandId, status: 'rejected', reason: 'invalid_state', replayed: false }, actionAt: T0, receivedAt: T0 };
  };
  it('B12: the cap counts only the live session, so a full previous session does not block the next', () => {
    begin();
    const one = a().id!;
    discardSession();
    replaceState({ ...state.value, commands: { ...state.value.commands, receipts: Array.from({ length: 500 }, (_, i) => oldReceipt(one, i)) } });
    begin();
    expect(state.value.commands.receipts).toHaveLength(500);
    expect(handleWorkoutCommand(cmd('pause'))).toMatchObject({ status: 'applied' });
    expect(saved().commands.receipts).toHaveLength(501);
  });
  it('B4: a reused id whose payload collides with a 32-bit fingerprint is still a conflict', () => {
    replaceState({ ...state.value, active: { id: 's_fixed01', splitId: 'sp', startedAt: new Date(T0).toISOString(), pausedMs: 0, rev: 0, entries: [{ id: 'e_fixed01', exerciseId: 'lib_barbell_bench_press', name: 'Bench', done: false, skipped: false, sets: [{ id: 'set_fixed01', status: 'draft', rev: 0 }] }] } });
    vi.advanceTimersByTime(60_000);
    const at = Date.now();
    const fp32 = (value: number, reps: number) => fnv(JSON.stringify([1, 's_fixed01', 'complete_set', at, ['set_fixed01', 0, value, 'kg', reps, null]]));
    expect(fp32(91.3, 9)).toBe(fp32(207, 12));
    const send = (value: number, reps: number) => handleWorkoutCommand({ v: 1, commandId: 'samecmdid01', sessionId: 's_fixed01', actionAt: at, kind: 'complete_set', setId: 'set_fixed01', expectedRev: 0, load: { value, unit: 'kg' }, reps });
    expect(send(91.3, 9)).toMatchObject({ status: 'applied' });
    expect(send(207, 12)).toMatchObject({ status: 'rejected', reason: 'id_conflict' });
    expect(a().entries[0]!.sets[0]).toMatchObject({ kg: 91.3, reps: 9 });
  });
  it('B4: a resend replays only when the stored session, kind and action time match too', () => {
    begin();
    vi.advanceTimersByTime(60_000);
    const c = complete(a().entries[0]!.sets[0]!.id!);
    handleWorkoutCommand(c);
    const stored = state.value.commands.receipts[0]!;
    for (const change of [{ sessionId: 's_elsewhere' }, { kind: 'pause' as const }, { actionAt: stored.actionAt - 1 }]) {
      replaceState({ ...state.value, commands: { ...state.value.commands, receipts: [{ ...stored, ...change }] } });
      expect(handleWorkoutCommand(c), JSON.stringify(change)).toMatchObject({ status: 'rejected', reason: 'id_conflict' });
    }
    replaceState({ ...state.value, commands: { ...state.value.commands, receipts: [stored] } });
    expect(handleWorkoutCommand(c)).toMatchObject({ status: 'applied', replayed: true });
  });
  it('B12: only plain objects, and only their own fields, are read', () => {
    begin();
    const own = { v: 1, commandId: nextId(), sessionId: a().id, actionAt: Date.now() };
    expect(handleWorkoutCommand(Object.assign(Object.create({ kind: 'finish' }), own))).toMatchObject({ status: 'rejected', reason: 'invalid' });
    expect(state.value.active).not.toBeNull();
    // Complete own fields on another prototype are refused too.
    expect(handleWorkoutCommand(Object.assign(Object.create({ via: 'class' }), { ...own, commandId: nextId(), kind: 'pause' }))).toMatchObject({ status: 'rejected', reason: 'invalid' });
    expect(a().pausedAt).toBeUndefined();
    startRest(90);
    Object.defineProperty(Object.prototype, 'restId', { value: a().rest!.id, configurable: true });
    try {
      expect(handleWorkoutCommand({ ...own, commandId: nextId(), kind: 'rest_skip' })).toMatchObject({ status: 'rejected', reason: 'invalid' });
    } finally {
      delete (Object.prototype as unknown as Record<string, unknown>).restId;
    }
    expect(a().rest).toBeDefined();
    expect(state.value.commands.receipts).toHaveLength(0);
    // JSON's own "__proto__" key is only a field: this pause stays a pause.
    const raw: unknown = JSON.parse(`{"v":1,"commandId":"${nextId()}","sessionId":"${a().id}","actionAt":${Date.now()},"kind":"pause","__proto__":{"kind":"finish"}}`);
    expect(handleWorkoutCommand(raw)).toMatchObject({ status: 'applied' });
    expect(a().pausedAt).toBe(Date.now());
  });
  it('B11: a receive time that is not a finite number is replaced by the phone clock', () => {
    begin();
    vi.advanceTimersByTime(60_000);
    expect(handleWorkoutCommand(complete(a().entries[0]!.sets[0]!.id!), NaN)).toMatchObject({ status: 'applied' });
    expect(a().entries[0]!.sets[0]!.receivedAt).toBe(new Date(Date.now()).toISOString());
    expect(state.value.commands.receipts[0]!.receivedAt).toBe(Date.now());
    expect(handleWorkoutCommand(cmd('pause'), Number.POSITIVE_INFINITY)).toMatchObject({ status: 'applied' });
    expect(a().pausedAt).toBe(Date.now());
  });
  it('B10: a clock that steps back while paused adds no negative pause, from the watch or the phone', () => {
    begin();
    vi.advanceTimersByTime(600_000);
    handleWorkoutCommand(cmd('pause'));
    vi.setSystemTime(Date.now() - 120_000);
    handleWorkoutCommand(cmd('resume'));
    expect(a().pausedMs).toBe(0);
    pauseSession();
    vi.setSystemTime(Date.now() - 120_000);
    resumeSession();
    expect(a().pausedMs).toBe(0);
  });
  it('B11: a phone set committed in the same millisecond as the watch set before it stays committed after a reload', () => {
    begin();
    vi.advanceTimersByTime(120_000);
    const iso = new Date(Date.now()).toISOString();
    const [s0, s1] = a().entries[0]!.sets;
    handleWorkoutCommand(complete(s0!.id!));
    setSet(0, 1, { kg: 60, reps: 8 });
    commitSet(0, 1);
    vi.advanceTimersByTime(300); // the phone's debounced save
    initStore(mem);
    expect(a().entries[0]!.sets.map(s => [s.id, s.status, s.at])).toEqual([[s0!.id, 'committed', iso], [s1!.id, 'committed', iso]]);
  });
  it('B10: a rest the phone restarts after it ended is a new rest, so a late +30 s is stale', () => {
    begin();
    startRest(60);
    const first = a().rest!.id;
    const late = cmd('rest_add_30', { restId: first });
    vi.advanceTimersByTime(70_000);
    adjustRest(30);
    const restarted = a().rest!;
    expect(restarted.id).not.toBe(first);
    expect(handleWorkoutCommand(late)).toMatchObject({ status: 'rejected', reason: 'stale_rest' });
    expect(a().rest).toEqual(restarted);
    startRest(15);
    vi.advanceTimersByTime(16_000);
    pauseSession();
    const held = a().rest!.id;
    adjustRest(15); // a held rest at 0 s, restarted while paused
    expect(a().rest!.id).not.toBe(held);
    resumeSession();
    startRest(60);
    const running = a().rest!.id;
    adjustRest(15); // time added to a running rest keeps it the same rest
    expect(a().rest!.id).toBe(running);
  });
});
