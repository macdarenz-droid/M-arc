import { describe, it, expect, vi } from 'vitest';
import type { VNode } from 'preact';
import { ErrorBoundary, resetAppData } from '@/app/ErrorBoundary';
import { BACKUP_DAY_KEY, BACKUP_KEY, STATE_KEY, flushSave, initStore, update } from '@/core/store';
import { freshState } from '@/core/models';

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => { map.set(k, v); },
    removeItem: (k: string) => { map.delete(k); },
    clear: () => map.clear(),
    key: (i: number) => [...map.keys()][i] ?? null,
    get length() { return map.size; },
  } as Storage;
}

const texts = (n: unknown): string[] => {
  if (n == null || typeof n === 'boolean') return [];
  if (typeof n === 'string' || typeof n === 'number') return [String(n)];
  if (Array.isArray(n)) return n.flatMap(texts);
  const v = n as VNode<{ children?: unknown }>;
  const own = v.type === 'button' ? [`button:${texts(v.props.children).join('')}`] : [];
  return [...own, ...texts(v.props?.children)];
};

describe('the error card (QA-R1-8)', () => {
  it('offers a reset, so a crash on every render has a way out', () => {
    const b = new ErrorBoundary({});
    b.state = { error: new Error('x'), holding: false, armed: false };
    const out = texts(b.render());
    expect(out).toContain('button:Reload');
    expect(out).toContain('button:Hold to delete everything');
  });
  it('the reset clears storage and the photo database', async () => {
    const clear = vi.fn();
    const deleteDatabase = vi.fn();
    resetAppData({ clear }, { databases: async () => [{ name: 'marc-escobar-img', version: 1 }], deleteDatabase });
    await Promise.resolve(); await Promise.resolve();
    expect(clear).toHaveBeenCalled();
    expect(deleteDatabase).toHaveBeenCalledWith('marc-escobar-img');
  });
  it('QA2-FB-1: the save on unload does not write the crashing state back after the reset', () => {
    vi.useFakeTimers();
    try {
      const st = memoryStorage();
      st.setItem(STATE_KEY, JSON.stringify({ ...freshState(), profile: { ...freshState().profile, name: 'crash' } }));
      initStore(st);
      update(s => ({ ...s, profile: { ...s.profile, name: 'crash again' } }));
      resetAppData(st, undefined);
      vi.advanceTimersByTime(1000); // a save that was pending when the reset ran
      flushSave(); // pagehide / visibilitychange while location.reload() unloads the page
      expect(st.getItem(STATE_KEY)).toBeNull();
      expect(st.getItem(BACKUP_KEY)).toBeNull();
      expect(st.getItem(BACKUP_DAY_KEY)).toBeNull();
      expect(st.length).toBe(0);
    } finally { vi.useRealTimers(); }
  });
});
