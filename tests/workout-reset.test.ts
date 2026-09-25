import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { freshState } from '@/core/models';
import { initStore, resetState, state, updateWorkout, BACKUP_KEY } from '@/core/store';
import { workoutOwnership, initWorkoutOwnership } from '@/core/workoutOwnership';
import { reconcilePhoneWorkout } from '@/native/workoutOwnership';
import { resetAppData } from '@/app/ErrorBoundary';
const native = vi.hoisted(() => ({ enabled: true, workoutOwnership: vi.fn() }));
vi.mock('@/native/capacitor', () => ({ isNative: () => native.enabled }));
vi.mock('@capacitor/core', () => ({ registerPlugin: () => native }));
const memory = () => {
  const map = new Map<string, string>();
  return { map, getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => { map.set(k, v); }, removeItem: (k: string) => { map.delete(k); } };
};
let st: ReturnType<typeof memory>;
beforeEach(() => { native.enabled = true; native.workoutOwnership.mockReset(); st = memory(); initStore(st); state.value = { ...freshState(), profile: { ...freshState().profile, name: 'Keep' } }; st.map.set(BACKUP_KEY, 'keep backup'); });
afterEach(() => { initWorkoutOwnership(memory()); vi.useRealTimers(); });
describe('reset native workout data before phone data', () => {
  it('waits for native wipe, blocks live writes, then resets', async () => {
    let done!: (v: unknown) => void;
    native.workoutOwnership.mockImplementation(() => new Promise(resolve => { done = resolve; }));
    const pending = resetState(freshState());
    await Promise.resolve();
    expect(native.workoutOwnership).toHaveBeenCalledWith({ action: 'reset' });
    expect(state.value.profile.name).toBe('Keep'); expect(st.map.get(BACKUP_KEY)).toBe('keep backup');
    expect(() => updateWorkout(s => ({ ...s, active: null }))).toThrow(/editing is paused/);
    done({ owner: 'web', reset: true }); await pending;
    expect(state.value.profile.name).not.toBe('Keep'); expect(st.map.has(BACKUP_KEY)).toBe(false);
    expect(workoutOwnership.value).toBe('web');
  });
  it.each(['reject', 'wrong reply', 'timeout'])('preserves phone data when native wipe fails: %s', async how => {
    vi.useFakeTimers();
    native.workoutOwnership.mockImplementation(() => how === 'reject' ? Promise.reject(new Error('write failed')) : how === 'wrong reply' ? Promise.resolve({ owner: 'native' }) : new Promise(() => {}));
    const check = expect(Promise.resolve().then(() => resetState(freshState()))).rejects.toThrow();
    await vi.advanceTimersByTimeAsync(12001); await check;
    expect(state.value.profile.name).toBe('Keep'); expect(st.map.get(BACKUP_KEY)).toBe('keep backup');
    expect(workoutOwnership.value).toBe('web');
  });
  it('also waits before crash reset clears storage', async () => {
    native.workoutOwnership.mockRejectedValue(new Error('disk failed'));
    const clear = vi.fn();
    await expect(Promise.resolve().then(() => resetAppData({ clear }, undefined))).rejects.toThrow();
    expect(clear).not.toHaveBeenCalled();
  });
  it('web reset stays synchronous without calling the bridge', () => {
    native.enabled = false; resetState(freshState());
    expect(native.workoutOwnership).not.toHaveBeenCalled(); expect(state.value.profile.name).not.toBe('Keep');
  });
});

it('finishes a queued early-crash wipe before reading ownership on the next boot', async () => {
  st.map.set('marc.workout.reset.v1', 'pending');
  vi.stubGlobal('localStorage', st);
  native.workoutOwnership.mockResolvedValueOnce({ owner: 'web', reset: true }).mockResolvedValueOnce({ owner: 'web' });
  try {
    await reconcilePhoneWorkout();
    expect(native.workoutOwnership.mock.calls.map(x => x[0].action)).toEqual(['reset', 'read']);
    expect(st.map.has('marc.workout.reset.v1')).toBe(false);
  } finally { vi.unstubAllGlobals(); }
});
