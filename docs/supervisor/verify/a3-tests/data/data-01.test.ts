/** A3 DATA 01: an accepted backup with a bare custom exercise ({id, name}) must not leave readers crashing. */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { freshState, type AppState } from '@/core/models';

type Storagelike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
function mapStorage(): Storagelike & { map: Map<string, string> } {
  const map = new Map<string, string>();
  return { map, getItem: k => map.get(k) ?? null, setItem: (k, v) => { map.set(k, v); }, removeItem: k => { map.delete(k); } };
}

const NOW = Date.parse('2026-09-22T12:00:00.000Z');
const session = { id: 's1', splitId: 'x', splitName: 'Push', day: '2026-09-21', startedAt: '2026-09-21T10:00:00.000Z', endedAt: '2026-09-21T11:00:00.000Z', durationSec: 3600, exercises: [{ exerciseId: 'cx_1', name: 'My Lift', sets: [{ kg: 50, reps: 5 }] }], logging: { mode: 'live' } };
const st = (): AppState => ({ ...freshState(new Date(NOW)), sessions: [session] as never, customExercises: [{ id: 'cx_1', name: 'My Lift' }] as never });
const file = () => JSON.stringify({ app: 'M/ARC', schema: 2, exportedAt: new Date(NOW).toISOString(), state: st() });

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.resetModules(); });

describe('A3 DATA 01', () => {
  it('a backup with a custom exercise lacking muscle metadata is accepted and the recovery reader still runs', async () => {
    vi.useFakeTimers(); vi.setSystemTime(NOW);
    const { parseBackup } = await import('@/slices/settings/backup');
    const store = await import('@/core/store');
    const sel = await import('@/app/selectors');
    const b = parseBackup(file(), NOW);
    if (!('kind' in b) || b.kind !== 'v37') throw new Error('rejected');
    // Accepted as valid (the premise of the finding).
    expect(b.state.sessions).toHaveLength(1);
    store.state.value = b.state;
    expect(() => sel.recovery.value).not.toThrow();
  });

  it('after a reload of that saved state, boot keeps it ("saved") and recovery/week still run', async () => {
    vi.useFakeTimers(); vi.setSystemTime(NOW);
    const store = await import('@/core/store');
    const sel = await import('@/app/selectors');
    const disk = mapStorage();
    disk.setItem(store.STATE_KEY, JSON.stringify(st()));
    store.initStore(disk);
    expect(store.bootSource.value).toBe('saved');
    expect(() => [sel.recovery.value, sel.week.value]).not.toThrow();
  });

  it('a name lookup across the restored custom list does not throw (findExercise by name)', async () => {
    const { parseBackup } = await import('@/slices/settings/backup');
    const { findExercise } = await import('@/core/exercises');
    const b = parseBackup(file(), NOW);
    if (!('kind' in b) || b.kind !== 'v37') throw new Error('rejected');
    expect(() => findExercise('Bench Press', b.state.customExercises)).not.toThrow();
  });
});
