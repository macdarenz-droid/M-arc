/** IMP-N02: a health read started before Reset/Restore must not repopulate the replaced state. */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { replaceState, resetState, state } from '@/core/store';
import { freshState } from '@/core/models';
import { restoredState } from '@/slices/settings/backup';
import { syncAndStoreHealth } from '@/slices/settings/health';

const flush = async () => { for (let i = 0; i < 50; i++) await Promise.resolve(); };
function deferred<T>() { let resolve!: (v: T) => void; const promise = new Promise<T>(r => { resolve = r; }); return { promise, resolve }; }
const summary = { needsPermission: false, steps: 3000, sleepMinutes: 420, restingHR: 57, workoutHR: 0, activeCalories: 0 };

let read: ReturnType<typeof deferred<typeof summary>>;
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 8, 26, 12, 0));
  read = deferred<typeof summary>();
  (globalThis as { Capacitor?: unknown }).Capacitor = { isNativePlatform: () => true, Plugins: { HealthConnectNative: { readSummary: vi.fn(() => read.promise) } } };
  replaceState({ ...freshState(), health: { connected: true } });
});
afterEach(() => { delete (globalThis as { Capacitor?: unknown }).Capacitor; vi.useRealTimers(); });

describe('IMP-N02 old health reads cannot repopulate replaced state', () => {
  it('Reset everything during a read keeps the fresh state empty and disconnected', async () => {
    const older = syncAndStoreHealth(); // background/resume sync
    await flush();
    resetState(freshState()); // Settings resetEverything, Settings.tsx:77
    expect(state.value.healthDays.length).toBe(0);
    expect(state.value.health.connected).toBe(false);
    read.resolve(summary);
    await older;
    expect.soft(state.value.healthDays.length).toBe(0);
    expect.soft(state.value.health.connected).toBe(false);
  });

  it('Restore during a read keeps Health Connect disconnected', async () => {
    const older = syncAndStoreHealth();
    await flush();
    replaceState(restoredState(freshState(), state.value)); // restore path, backup.ts:66
    expect(state.value.health.connected).toBe(false);
    read.resolve(summary);
    await older;
    expect.soft(state.value.health.connected).toBe(false);
    expect.soft(state.value.healthDays.length).toBe(0);
  });
});

/** A3-3 AC4: another tab replacing the state (ST-19 listener, both branches) also drops a read in flight. */
describe('IMP-N02 another tab replaces the state during a read', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });
  const memory = () => { const map = new Map<string, string>(); return { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => { map.set(k, v); }, removeItem: (k: string) => { map.delete(k); }, clear: () => map.clear(), key: () => null, length: 0 } as unknown as Storage; };
  async function setup() {
    const target = new EventTarget();
    vi.stubGlobal('window', target);
    vi.resetModules();
    const S = await import('@/core/store');
    const H = await import('@/slices/settings/health');
    const st = memory();
    st.setItem(S.STATE_KEY, JSON.stringify({ ...freshState(), health: { connected: true } }));
    S.initStore(st);
    expect(S.state.value.health.connected).toBe(true);
    return { target, S, H, st };
  }
  it('a storage event with the other tab\'s state drops the read', async () => {
    const { target, S, H } = await setup();
    const older = H.syncAndStoreHealth();
    await flush();
    target.dispatchEvent(Object.assign(new Event('storage'), { key: S.STATE_KEY, newValue: JSON.stringify(freshState()) }));
    expect(S.state.value.health.connected).toBe(false);
    read.resolve(summary);
    await older;
    expect.soft(S.state.value.health.connected).toBe(false);
    expect.soft(S.state.value.healthDays.length).toBe(0);
  });
  it('another tab clearing storage drops the read', async () => {
    const { target, S, H, st } = await setup();
    const older = H.syncAndStoreHealth();
    await flush();
    st.removeItem(S.STATE_KEY);
    target.dispatchEvent(Object.assign(new Event('storage'), { key: null, newValue: null }));
    expect(S.state.value.health.connected).toBe(false);
    read.resolve(summary);
    await older;
    expect.soft(S.state.value.health.connected).toBe(false);
    expect.soft(S.state.value.healthDays.length).toBe(0);
  });
});
