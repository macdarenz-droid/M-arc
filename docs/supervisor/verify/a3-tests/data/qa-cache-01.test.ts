/**
 * A3 QA CACHE 01: after Reset, no app-owned plaintext export copy may stay in the app cache.
 * In-memory Filesystem/Share stubs; no device, no network.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { VNode } from 'preact';

const files = new Map<string, string>(); // "<directory>/<path>" -> data
vi.mock('@capacitor/filesystem', () => ({
  Directory: { Cache: 'CACHE', Documents: 'DOCUMENTS', Data: 'DATA' },
  Filesystem: {
    writeFile: async ({ path, data, directory }: { path: string; data: string; directory: string }) => { files.set(`${directory}/${path}`, data); return { uri: `file:///${directory}/${path}` }; },
    getUri: async ({ path, directory }: { path: string; directory: string }) => ({ uri: `file:///${directory}/${path}` }),
    rmdir: async ({ path, directory }: { path: string; directory: string }) => { for (const k of [...files.keys()]) if (k.startsWith(`${directory}/${path}/`)) files.delete(k); },
    deleteFile: async ({ path, directory }: { path: string; directory: string }) => { files.delete(`${directory}/${path}`); },
    readdir: async ({ path, directory }: { path: string; directory: string }) => ({ files: [...files.keys()].filter(k => k.startsWith(`${directory}/${path}/`)).map(k => ({ name: k.split('/').pop() })) }),
    checkPermissions: async () => ({ publicStorage: 'granted' }),
    requestPermissions: async () => ({ publicStorage: 'granted' }),
  },
}));
vi.mock('@capacitor/share', () => ({ Share: { share: vi.fn(async () => ({})) } }));
// Settings is called as a plain function (no DOM in this suite): hooks become plain values, and every
// boolean state starts true so the confirm branch holding "Reset everything" is in the tree.
vi.mock('preact/hooks', async orig => ({
  ...(await orig<typeof import('preact/hooks')>()),
  useState: (init: unknown) => { const v = typeof init === 'function' ? (init as () => unknown)() : init; return [v === false ? true : v, () => {}]; },
  useEffect: () => {},
}));
vi.mock('@/escobar/palace/focus', async orig => ({ ...(await orig<object>()), usePalaceFocus: () => {} }));

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return { getItem: k => map.get(k) ?? null, setItem: (k, v) => { map.set(k, String(v)); }, removeItem: k => { map.delete(k); }, clear: () => map.clear(), key: i => [...map.keys()][i] ?? null, get length() { return map.size; } } as Storage;
}
const native = (on: boolean) => vi.stubGlobal('Capacitor', { isNativePlatform: () => on });
const cacheCopies = () => [...files.keys()].filter(k => k.startsWith('CACHE/'));

function findButton(n: unknown, label: string): VNode<{ onClick?: () => void }> | null {
  if (n == null || typeof n !== 'object') return null;
  if (Array.isArray(n)) { for (const c of n) { const f = findButton(c, label); if (f) return f; } return null; }
  const v = n as VNode<{ children?: unknown; onClick?: () => void }>;
  if (v.props?.children === label && typeof v.props.onClick === 'function') return v;
  return findButton(v.props?.children, label);
}

beforeEach(() => { files.clear(); vi.stubGlobal('localStorage', memoryStorage()); });
afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

describe('A3 QA CACHE 01', () => {
  it('Settings "Reset everything" removes the plaintext backup/CSV copies exportText left in the app cache', async () => {
    const { exportText } = await import('@/native/share');
    native(true);
    await exportText('marc-backup-2026-09-22.json', JSON.stringify({ app: 'M/ARC', state: { sessions: ['synthetic-workout'] } }));
    await exportText('marc-sessions-all-2026-09-22.csv', 'date,split\r\n2026-09-20,Push\r\n', 'text/csv');
    expect(cacheCopies()).toEqual(['CACHE/MARC Exports/marc-backup-2026-09-22.json', 'CACHE/MARC Exports/marc-sessions-all-2026-09-22.csv']); // premise
    native(false);
    const store = await import('@/core/store');
    store.state.value = { ...store.state.value, sessions: [{ id: 's-old' }] as never };
    const { Settings } = await import('@/slices/settings/Settings');
    const reset = findButton(Settings({ onClose: () => {} }), 'Reset everything');
    expect(reset).not.toBeNull();
    reset!.props.onClick!();
    for (let i = 0; i < 20; i++) await Promise.resolve();
    expect(store.state.value.sessions).toEqual([]); // the real Reset ran
    expect(cacheCopies()).toEqual([]);
  });

  it('the crash screen reset (resetAppData) also leaves no exported copy in the app cache', async () => {
    const { exportText } = await import('@/native/share');
    native(true);
    await exportText('marc-backup-2026-09-22.json', JSON.stringify({ app: 'M/ARC', state: { sessions: ['synthetic-workout'] } }));
    native(false);
    const { resetAppData } = await import('@/app/ErrorBoundary');
    resetAppData(memoryStorage(), undefined);
    for (let i = 0; i < 20; i++) await Promise.resolve();
    expect(cacheCopies()).toEqual([]);
  });
});
