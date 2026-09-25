import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { freshState, type ActiveSession } from '@/core/models';
import { flushSave, initStore, replaceState, resetState, state, update, updateWorkout } from '@/core/store';
import { assertPhoneWorkoutWriter, checkingWorkoutOwnership, handoverWorkout, initWorkoutOwnership, reconcileWorkoutOwnership, WORKOUT_HANDOVER_KEY, workoutOwnership, workoutOwnershipNotice, workoutHeartCaptureNotice, type HandoverSeed, type OwnershipBackend, type OwnershipReply } from '@/core/workoutOwnership';
import { workoutHandoverPhone } from '@/native/workoutOwnership';
import { commitSetById, discardSession, finishSession, pauseSession, setSetById, startRest } from '@/slices/workout/session';
import { captureHeartInputs, recentLiveBpms, resetHeartCapture, startHeartCapture } from '@/slices/workout/heart';
import { latestMeasurement } from '@/native/watch';
import { resetAppData } from '@/app/ErrorBoundary';
import { session } from './helpers';

const START = Date.parse('2026-09-24T10:00:00.000Z');
const active = (): ActiveSession => ({ id: 's-1', splitId: 'split-1', startedAt: new Date(START).toISOString(), pausedMs: 0,
  entries: [{ id: 'e-1', exerciseId: 'lib_barbell_bench_press', name: 'Bench', done: false, skipped: false,
    sets: [{ id: 'set-1', kg: 60, reps: 8, effort: 'ideal', status: 'draft' }] }],
  rest: { endsAt: START + 180000, totalSec: 120 } });
function memory() {
  const map = new Map<string, string>();
  return { map, getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => { map.set(k, v); }, removeItem: (k: string) => { map.delete(k); } };
}
function backend() {
  let owner: OwnershipReply = { owner: 'web' };
  const cancelled = new Set<string>();
  const port: OwnershipBackend = {
    read: vi.fn(async () => owner),
    handover: vi.fn(async seed => {
      if (cancelled.has(seed.handoverId)) throw new Error('cancelled');
      owner = { owner: 'native', seed, snapshot: seed.snapshot };
      return owner;
    }),
    settle: vi.fn(async (token: string): Promise<OwnershipReply> => {
      if (owner.owner === 'native') return owner;
      cancelled.add(token);
      return { owner: 'web', cancelledHandoverId: token };
    }),
  };
  return port;
}
let storage: ReturnType<typeof memory>;
beforeEach(() => {
  vi.useFakeTimers(); vi.setSystemTime(START + 60000);
  storage = memory(); initStore(storage);
  replaceState({ ...freshState(), active: active() });
  resetHeartCapture(); latestMeasurement.value = null; startHeartCapture();
});
afterEach(() => { initWorkoutOwnership(memory()); vi.useRealTimers(); });
const begin = (b: OwnershipBackend) => handoverWorkout(b, workoutHandoverPhone, 'handover-1', 'watch-1');
const recover = (b: OwnershipBackend) => reconcileWorkoutOwnership(b, workoutHandoverPhone);

describe('workout ownership handover', () => {
  it('freezes live writers before capturing detached policy, rest and timestamped heart inputs', async () => {
    latestMeasurement.value = { bpm: 128, contact: true, rrMs: [], energyKj: null, receivedAtEpochMs: START + 50000, receivedAtElapsedMs: 90000 };
    const b = backend();
    let finish!: (r: OwnershipReply) => void;
    let sent!: HandoverSeed;
    b.handover = vi.fn((seed: HandoverSeed) => { sent = seed; return new Promise<OwnershipReply>(resolve => { finish = resolve; }); });
    const transfer = begin(b);
    expect(workoutOwnership.value).toBe('transferring');
    const old = JSON.stringify(state.value);
    const updater = vi.fn(s => s);
    for (const write of [() => updateWorkout(updater), () => update(s => ({ ...s, active: null })), () => setSetById('set-1', { reps: 20 }), () => commitSetById('set-1'),
      () => pauseSession(), () => startRest(30), () => finishSession(false), discardSession,
      () => replaceState(freshState()), () => resetState(freshState())]) expect(write).toThrow(/editing is paused/);
    expect(updater).not.toHaveBeenCalled();
    const clear = vi.fn();
    expect(() => resetAppData({ clear }, undefined)).toThrow(/editing is paused/);
    expect(clear).not.toHaveBeenCalled();
    expect(JSON.stringify(state.value)).toBe(old);
    const inputs = JSON.parse(sent.inputs);
    expect(inputs.restPolicy).toEqual({ autoRest: true, restDefaultSec: 90, rest: freshState().preferences.rest });
    expect(inputs.heartSamples[0]).toMatchObject({ bpm: 128, tSec: 50, receivedAtEpochMs: START + 50000, receivedAtElapsedMs: 90000 });
    latestMeasurement.value = { ...latestMeasurement.value!, bpm: 160, receivedAtEpochMs: START + 60000 };
    expect(captureHeartInputs()).toHaveLength(1);
    finish({ owner: 'native', seed: sent, snapshot: sent.snapshot });
    expect(await transfer).toBe(true);
    expect(workoutOwnership.value).toBe('native');
    expect(JSON.parse(storage.map.get(WORKOUT_HANDOVER_KEY)!).phase).toBe('native');
    expect(JSON.parse(sent.snapshot).rest.endsAt).toBe(START + 180000);
  });

  it('a lost reply after native commit recovers that owner after boot, never the stale phone writer', async () => {
    const b = backend(), commit = b.handover;
    b.handover = async seed => { await commit(seed); throw new Error('reply lost'); };
    expect(await begin(b)).toBe(false);
    expect(workoutOwnership.value).toBe('blocked');
    initStore(storage, true);
    expect(() => updateWorkout(s => s)).toThrow();
    expect(await recover(b)).toBe(true);
    expect(workoutOwnership.value).toBe('native');
    expect(b.settle).toHaveBeenCalledWith('handover-1');
  });

  it('cancels an uncertain request durably before permitting phone edits; its late arrival is rejected', async () => {
    const b = backend(), commit = b.handover;
    let delayed!: HandoverSeed;
    b.handover = async seed => { delayed = seed; throw new Error('transport timeout'); };
    expect(await begin(b)).toBe(false);
    initStore(storage, true);
    vi.setSystemTime(START + 150000);
    expect(await recover(b)).toBe(true);
    expect(workoutOwnership.value).toBe('web');
    expect(state.value.active!.rest!.endsAt).toBe(START + 180000); // countdown never restarts
    await expect(commit(delayed)).rejects.toThrow('cancelled');
    setSetById('set-1', { reps: 9 });
    expect(state.value.active!.entries[0]!.sets[0]!.reps).toBe(9);
  });

  it('does not unlock on an empty DB without cancellation or after a previously confirmed owner disappears', async () => {
    const b = backend();
    b.handover = async () => { throw new Error('uncertain'); };
    await begin(b);
    b.settle = async () => ({ owner: 'web' });
    expect(await recover(b)).toBe(false);
    expect(workoutOwnership.value).toBe('blocked');
    const marker = JSON.parse(storage.map.get(WORKOUT_HANDOVER_KEY)!);
    storage.map.set(WORKOUT_HANDOVER_KEY, JSON.stringify({ ...marker, phase: 'native' }));
    initStore(storage, true);
    expect(await recover(b)).toBe(false);
    expect(workoutOwnership.value).toBe('blocked');
  });

  it('protects a lost-marker native workout before and during the boot read, without finishing a duplicate', async () => {
    const b = backend();
    await begin(b);
    storage.removeItem(WORKOUT_HANDOVER_KEY);
    initStore(storage, true);
    expect(workoutOwnership.value).toBe('checking');
    expect(checkingWorkoutOwnership.value).toBe(true);
    const before = JSON.stringify(state.value.active);
    const checkLiveWriters = () => {
      for (const write of [() => setSetById('set-1', { reps: 99 }), () => finishSession(false), discardSession])
        expect(write).toThrow(/editing is paused/);
      expect(JSON.stringify(state.value.active)).toBe(before);
      expect(state.value.sessions).toHaveLength(0);
    };
    checkLiveWriters(); // Even before the asynchronous check is started.
    const owner = await b.read();
    let resolve!: (reply: OwnershipReply) => void;
    b.read = () => new Promise(r => { resolve = r; });
    const check = recover(b);
    checkLiveWriters();
    update(s => ({ ...s, preferences: { ...s.preferences, weightUnit: 'lb' } }));
    resolve(owner);
    expect(await check).toBe(true);
    expect(workoutOwnership.value).toBe('native');
    checkLiveWriters();
    expect(state.value.preferences.weightUnit).toBe('lb');
    expect(storage.getItem(WORKOUT_HANDOVER_KEY)).toBeTruthy();
  });

  it('keeps corrupted checkpoints protected, including after later failed reads', async () => {
    storage.setItem(WORKOUT_HANDOVER_KEY, '{broken');
    initStore(storage, true);
    expect(await recover(backend())).toBe(false);
    expect(storage.getItem(WORKOUT_HANDOVER_KEY)).toBe('{broken');
    storage.removeItem(WORKOUT_HANDOVER_KEY);
    const b = backend(); b.read = async () => { throw new Error('unavailable'); };
    expect(await recover(b)).toBe(false);
    expect(() => resetState(freshState())).toThrow();
  });

  it('never sends a seed when flushing or saving the recovery checkpoint fails', async () => {
    const b = backend();
    const phone = { ...workoutHandoverPhone, flush: () => false };
    expect(await handoverWorkout(b, phone, 'h-1', 'watch-1')).toBe(false);
    expect(b.handover).not.toHaveBeenCalled();
    initStore(storage);
    const original = storage.setItem;
    storage.setItem = (key, raw) => { if (key === WORKOUT_HANDOVER_KEY) throw new Error('full'); original(key, raw); };
    expect(await begin(b)).toBe(false);
    expect(b.handover).not.toHaveBeenCalled();
    expect(state.value.active!.id).toBe('s-1');
  });

  it('keeps the checkpoint when projection persistence fails and retries recovery', async () => {
    const b = backend(), original = storage.setItem, commit = b.handover;
    b.handover = async seed => {
      storage.setItem = (key, raw) => { if (key === 'marc.state.v1') throw new Error('full'); original(key, raw); };
      return commit(seed);
    };
    expect(await begin(b)).toBe(false);
    expect(JSON.parse(storage.getItem(WORKOUT_HANDOVER_KEY)!).phase).toBe('native');
    expect(workoutOwnership.value).toBe('blocked');
    storage.setItem = original;
    expect(await recover(b)).toBe(true);
    expect(workoutOwnership.value).toBe('native');
  });

  it('rejects a changed owner and ignores an obsolete response from a prior boot', async () => {
    const b = backend();
    b.handover = async seed => ({ owner: 'native', seed: { ...seed, installationId: 'watch-other' }, snapshot: seed.snapshot });
    expect(await begin(b)).toBe(false);
    const marker = storage.getItem(WORKOUT_HANDOVER_KEY);
    let resolve!: (reply: OwnershipReply) => void;
    b.settle = () => new Promise(r => { resolve = r; });
    const oldRecovery = recover(b);
    initStore(storage, true);
    resolve({ owner: 'web', cancelledHandoverId: 'handover-1' });
    expect(await oldRecovery).toBe(false);
    expect(storage.getItem(WORKOUT_HANDOVER_KEY)).toBe(marker);
    expect(workoutOwnership.value).toBe('checking');
  });

  it('checks another WebView marker before even running an updater', async () => {
    initWorkoutOwnership(storage, true);
    expect(await recover(backend())).toBe(true);
    storage.setItem(WORKOUT_HANDOVER_KEY, '{bad');
    expect(assertPhoneWorkoutWriter).toThrow();
    expect(workoutOwnership.value).toBe('blocked');
  });

  it.each(['web', 'failed'] as const)('blocks only live writes during an optional read, then unlocks after %s', async outcome => {
    initStore(storage, true);
    const b = backend();
    let reject!: (err: Error) => void;
    let resolve!: (reply: OwnershipReply) => void;
    b.read = () => new Promise((yes, no) => { resolve = yes; reject = no; });
    const check = recover(b);
    expect(checkingWorkoutOwnership.value).toBe(true);
    expect(workoutOwnership.value).toBe('checking');
    const before = JSON.stringify(state.value.active);
    for (const write of [() => setSetById('set-1', { reps: 9 }), () => finishSession(false), discardSession])
      expect(write).toThrow(/editing is paused/);
    update(s => ({ ...s, preferences: { ...s.preferences, weightUnit: 'lb' },
      sessions: [session('2026-09-23', [])], lastBackupAt: new Date().toISOString() }));
    expect(flushSave()).toBe(true);
    expect(JSON.stringify(state.value.active)).toBe(before);
    expect(state.value.preferences.weightUnit).toBe('lb');
    expect(state.value.sessions).toHaveLength(1);
    expect(JSON.parse(storage.getItem('marc.state.v1')!).lastBackupAt).toBeTruthy();
    if (outcome === 'web') resolve({ owner: 'web' });
    else reject(new Error('WearEngine method unavailable'));
    expect(await check).toBe(outcome === 'web');
    expect(checkingWorkoutOwnership.value).toBe(false);
    expect(workoutOwnership.value).toBe('web');
    if (outcome === 'failed') expect(workoutOwnershipNotice.value).toMatch(/keep using M\/ARC/);
    else expect(workoutOwnershipNotice.value).toBeNull();
    setSetById('set-1', { reps: 10 });
    expect(state.value.active!.entries[0]!.sets[0]!.reps).toBe(10);
    expect(await recover(backend())).toBe(true);
    expect(workoutOwnershipNotice.value).toBeNull();
  });

  it('allows history, settings and backup metadata during failed recovery, preserving the live copy and checkpoint', async () => {
    const b = backend(); b.handover = async () => { throw new Error('reply lost'); };
    await begin(b);
    initStore(storage, true);
    b.settle = async () => { throw new Error('unavailable'); };
    expect(await recover(b)).toBe(false);
    const live = state.value.active, marker = storage.getItem(WORKOUT_HANDOVER_KEY);
    update(s => ({ ...s, preferences: { ...s.preferences, weightUnit: 'lb' },
      sessions: [...s.sessions, { ...session('2026-09-23', []), id: 'old' }],
      lastBackupAt: new Date().toISOString() }));
    expect(flushSave()).toBe(true);
    const saved = JSON.parse(storage.getItem('marc.state.v1')!);
    expect(saved.preferences.weightUnit).toBe('lb');
    expect(saved.sessions[0].id).toBe('old');
    expect(saved.lastBackupAt).toBeTruthy();
    expect(state.value.active).toBe(live);
    expect(storage.getItem(WORKOUT_HANDOVER_KEY)).toBe(marker);
    expect(() => discardSession()).toThrow();
    expect(() => resetState(freshState())).toThrow();
  });

  it('retains a native owner actually read even if persisting its marker fails', async () => {
    const b = backend(); await begin(b);
    storage.removeItem(WORKOUT_HANDOVER_KEY);
    initStore(storage, true);
    const setItem = storage.setItem;
    storage.setItem = (k, v) => { if (k === WORKOUT_HANDOVER_KEY) throw new Error('full'); setItem(k, v); };
    expect(await recover(b)).toBe(false);
    expect(workoutOwnership.value).toBe('blocked');
    b.read = async () => { throw new Error('offline'); };
    expect(await recover(b)).toBe(false);
    expect(() => pauseSession()).toThrow();
  });

  it('never blocks web workout editing when localStorage reads throw or contain an obsolete native marker', () => {
    storage.setItem(WORKOUT_HANDOVER_KEY, '{old native marker');
    initStore(storage, false);
    expect(workoutOwnership.value).toBe('web');
    storage.getItem = () => { throw new Error('Storage denied'); };
    initStore(storage, false);
    expect(workoutOwnership.value).toBe('web');
    expect(checkingWorkoutOwnership.value).toBe(false);
    expect(() => replaceState({ ...freshState(), active: active() })).not.toThrow();
    expect(() => setSetById('set-1', { reps: 11 })).not.toThrow();
    expect(workoutOwnershipNotice.value).toBeNull();
  });

  it('still asks native when reading localStorage fails without any handover evidence', async () => {
    storage.getItem = () => { throw new Error('Storage denied'); };
    initStore(storage, true);
    const b = backend(); b.read = vi.fn(async () => { throw new Error('Bridge missing'); });
    expect(await recover(b)).toBe(false);
    expect(b.read).toHaveBeenCalled();
    expect(workoutOwnership.value).toBe('web');
    expect(() => update(s => ({ ...s, active: active() }))).not.toThrow();
  });

  it('does not overwrite a marker that changes while a native reply is pending', async () => {
    const b = backend();
    let finish!: (r: OwnershipReply) => void, sent!: HandoverSeed;
    b.handover = seed => { sent = seed; return new Promise(r => { finish = r; }); };
    const transfer = begin(b);
    const marker = JSON.parse(storage.getItem(WORKOUT_HANDOVER_KEY)!);
    marker.seed.handoverId = 'h-other';
    storage.setItem(WORKOUT_HANDOVER_KEY, JSON.stringify(marker));
    finish({ owner: 'native', seed: sent, snapshot: sent.snapshot });
    expect(await transfer).toBe(false);
    expect(workoutOwnership.value).toBe('blocked');
    expect(JSON.parse(storage.getItem(WORKOUT_HANDOVER_KEY)!).seed.handoverId).toBe('h-other');
  });

  it('restores the retained heart checkpoint after a cancelled handover and deduplicates the last sample', async () => {
    const sample = { bpm: 128, contact: true, rrMs: [], energyKj: null, receivedAtEpochMs: START + 50000, receivedAtElapsedMs: 90000 };
    latestMeasurement.value = sample;
    const b = backend(); b.handover = async () => { throw new Error('not delivered'); };
    await begin(b);
    initStore(storage, true);
    expect(await recover(b)).toBe(true);
    latestMeasurement.value = { ...sample };
    expect(recentLiveBpms(10)).toEqual([128]);
  });
});

describe('optional native heart capture notice', () => {
  it.each([{ available: false }, { available: true, writeFailed: true }])('shows a non-blocking note for %j without losing the owner', async heartCapture => {
    const b = backend();
    const handover = b.handover;
    b.handover = async seed => ({ ...await handover(seed), heartCapture });
    expect(await begin(b)).toBe(true);
    expect(workoutOwnership.value).toBe('native');
    expect(workoutHeartCaptureNotice.value).toBe("Watch heart rate isn't being saved for this workout");
    expect(() => update(s => ({ ...s, profile: { ...s.profile, name: 'Usable settings' } }))).not.toThrow();
    expect(flushSave()).toBe(true);
    await recover({ ...b, read: async () => ({ ...await b.read(), heartCapture: { available: true, writeFailed: false } }) });
    expect(workoutHeartCaptureNotice.value).toBeNull();
  });
  it('does not invent a heart failure for legacy replies or a phone-owned workout', async () => {
    await begin(backend()); expect(workoutHeartCaptureNotice.value).toBeNull();
    initWorkoutOwnership(memory()); expect(workoutHeartCaptureNotice.value).toBeNull();
  });
});

describe('heart evidence during an ownership check', () => {
  const measure = (second: number) => { latestMeasurement.value = { bpm: 100 + second, contact: true, rrMs: [], energyKj: null, receivedAtEpochMs: START + second * 1000, receivedAtElapsedMs: second * 1000 }; };
  it.each(['web', 'failed', 'native'] as const)('retains checking samples unless ownership resolves native: %s', async outcome => {
    measure(1);
    const seed: HandoverSeed = { handoverId: 'h-check', installationId: 'watch-1', ...workoutHandoverPhone.capture() };
    let resolve!: (reply: OwnershipReply) => void, reject!: (e: Error) => void;
    const b = backend(); b.read = () => new Promise((yes, no) => { resolve = yes; reject = no; });
    const pending = recover(b);
    measure(2); measure(3); measure(3);
    expect(() => setSetById('set-1', { reps: 9 })).toThrow(/editing is paused/);
    if (outcome === 'failed') reject(new Error('Timeout'));
    else resolve(outcome === 'native' ? { owner: 'native', seed, snapshot: seed.snapshot } : { owner: 'web' });
    await pending;
    expect(captureHeartInputs().map(x => x.bpm)).toEqual(outcome === 'native' ? [101] : [101, 102, 103]);
    if (outcome !== 'native') { measure(3); measure(4); expect(recentLiveBpms(9)).toEqual([101, 102, 103, 104]); }
  });
  it('merges checking evidence after a cancelled prepared handover restores the checkpoint', async () => {
    measure(1);
    const b = backend(); b.handover = async () => { throw new Error('Not delivered'); };
    await begin(b);
    let settle!: (reply: OwnershipReply) => void;
    b.settle = () => new Promise(resolve => { settle = resolve; });
    const pending = recover(b); measure(2);
    settle({ owner: 'web', cancelledHandoverId: 'handover-1' }); await pending;
    expect(recentLiveBpms(9)).toEqual([101, 102]);
  });
});
