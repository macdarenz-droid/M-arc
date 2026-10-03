/** A3 DATA 02: a stale tab whose storage event has not arrived yet must not write deleted data back. */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { freshState, type AppState } from '@/core/models';

type Ev = { key: string | null; newValue: string | null };
type Storagelike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
function mapStorage(): Storagelike & { map: Map<string, string> } {
  const map = new Map<string, string>();
  return { map, getItem: k => map.get(k) ?? null, setItem: (k, v) => { map.set(k, v); }, removeItem: k => { map.delete(k); } };
}
/** A window that collects storage listeners but never fires them: the event is deferred or missed. */
function stubWindow(): Array<(e: Ev) => void> {
  const listeners: Array<(e: Ev) => void> = [];
  vi.stubGlobal('window', { addEventListener: (t: string, fn: (e: Ev) => void) => { if (t === 'storage') listeners.push(fn); }, removeEventListener: () => {} });
  return listeners;
}

const NOW = Date.parse('2026-09-22T12:00:00.000Z');
const session = (id: string, startedAt: string) => ({ id, splitId: 'x', splitName: 'Push', day: startedAt.slice(0, 10), startedAt, endedAt: startedAt, durationSec: 60, exercises: [{ exerciseId: 'a', name: 'A', sets: [{ kg: 50, reps: 5 }] }], logging: { mode: 'live' } });
const old = (): AppState => ({ ...freshState(new Date(NOW)), sessions: [session('s-old', '2026-09-20T10:00:00.000Z')] as never, profile: { ...freshState().profile, name: 'Synthetic old profile' } });

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.resetModules(); });

describe('A3 DATA 02', () => {
  it('crash-screen reset (storage cleared) elsewhere, event not yet delivered: the stale tab flush does not restore old data', async () => {
    vi.useFakeTimers(); vi.setSystemTime(NOW);
    stubWindow();
    const store = await import('@/core/store');
    const disk = mapStorage();
    disk.setItem(store.STATE_KEY, JSON.stringify(old()));
    store.initStore(disk);
    store.update(s => ({ ...s, profile: { ...s.profile, heightCm: 181 } })); // stale tab has a pending save
    disk.map.clear(); // other tab: localStorage.clear(); its storage event has not reached this tab
    store.flushSave(); // pagehide / visibilitychange flush in the stale tab
    expect(disk.getItem(store.STATE_KEY) ?? '').not.toContain('Synthetic old profile');
  });

  it('Settings "Reset everything" elsewhere (fresh state written), event not yet delivered: the stale tab debounced save does not restore old sessions', async () => {
    vi.useFakeTimers(); vi.setSystemTime(NOW);
    stubWindow();
    const store = await import('@/core/store');
    const disk = mapStorage();
    disk.setItem(store.STATE_KEY, JSON.stringify(old()));
    store.initStore(disk);
    // Other tab's resetState(freshState()): backup and legacy keys removed, a fresh state written.
    disk.removeItem(store.BACKUP_KEY); disk.removeItem(store.BACKUP_DAY_KEY);
    disk.setItem(store.STATE_KEY, JSON.stringify(freshState(new Date(NOW))));
    store.update(s => ({ ...s, preferences: { ...s.preferences, restSec: 90 } as never })); // any edit in the stale tab
    vi.advanceTimersByTime(1000);
    expect(disk.getItem(store.STATE_KEY) ?? '').not.toContain('s-old');
  });

  it('no edit at all: the pagehide/hidden flush (main.tsx) alone writes the old state back', async () => {
    vi.useFakeTimers(); vi.setSystemTime(NOW);
    stubWindow();
    const store = await import('@/core/store');
    const disk = mapStorage();
    disk.setItem(store.STATE_KEY, JSON.stringify(old()));
    store.initStore(disk);
    disk.map.clear(); // other tab cleared everything; event not delivered (frozen / bfcached tab)
    store.flushSave();
    expect(disk.getItem(store.STATE_KEY) ?? '').not.toContain('s-old');
  });
});
