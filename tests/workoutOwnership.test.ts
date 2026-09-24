import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { freshState, type ActiveSession } from '@/core/models';
import { initStore, replaceState, resetState, state, update } from '@/core/store';
import { assertPhoneWorkoutWriter, handoverWorkout, initWorkoutOwnership, reconcileWorkoutOwnership, WORKOUT_HANDOVER_KEY, workoutOwnership, type HandoverSeed, type OwnershipBackend, type OwnershipReply } from '@/core/workoutOwnership';
import { workoutHandoverPhone } from '@/native/workoutOwnership';
import { commitSetById, discardSession, finishSession, pauseSession, setSetById, startRest } from '@/slices/workout/session';
import { captureHeartInputs, recentLiveBpms, resetHeartCapture, startHeartCapture } from '@/slices/workout/heart';
import { latestMeasurement } from '@/native/watch';
import { resetAppData } from '@/app/ErrorBoundary';

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
  it('freezes all phone writers before capturing detached policy, rest and timestamped heart inputs', async () => {
    latestMeasurement.value = { bpm: 128, contact: true, rrMs: [], energyKj: null, receivedAtEpochMs: START + 50000, receivedAtElapsedMs: 90000 };
    const b = backend();
    let finish!: (r: OwnershipReply) => void;
    let sent!: HandoverSeed;
    b.handover = vi.fn((seed: HandoverSeed) => { sent = seed; return new Promise<OwnershipReply>(resolve => { finish = resolve; }); });
    const transfer = begin(b);
    expect(workoutOwnership.value).toBe('transferring');
    const old = JSON.stringify(state.value);
    const updater = vi.fn(s => s);
    for (const write of [() => update(updater), () => setSetById('set-1', { reps: 20 }), () => commitSetById('set-1'),
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
    expect(() => update(s => s)).toThrow();
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

  it('queries native ownership even when its local marker is missing', async () => {
    const b = backend();
    await begin(b);
    storage.removeItem(WORKOUT_HANDOVER_KEY);
    initStore(storage, true);
    expect(() => discardSession()).toThrow();
    expect(await recover(b)).toBe(true);
    expect(workoutOwnership.value).toBe('native');
    expect(storage.getItem(WORKOUT_HANDOVER_KEY)).toBeTruthy();
  });

  it('keeps corrupted checkpoints and rejected bridge calls blocked', async () => {
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

  it('checks another WebView marker before even running an updater', () => {
    storage.setItem(WORKOUT_HANDOVER_KEY, '{bad');
    expect(assertPhoneWorkoutWriter).toThrow();
    expect(workoutOwnership.value).toBe('blocked');
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
