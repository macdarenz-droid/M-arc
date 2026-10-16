/**
 * A3-2b, QA CACHE 01 residual: the start-up crash screen's reset in index.html (it runs before the
 * bundle) leaves no cache holding pre-reset state: no Cache Storage entry, and on Android no
 * plaintext export copy in CACHE/MARC Exports or CACHE/MARC Share. The real index.html scripts run
 * in a node:vm sandbox with a minimal fake DOM; the Android bridge's nativePromise is routed to the
 * same in-memory Filesystem stub the app's own export path writes to. No device, no network.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const files = new Map<string, string>(); // "<directory>/<path>" -> data
vi.mock('@capacitor/filesystem', () => ({
  Directory: { Cache: 'CACHE', Documents: 'DOCUMENTS', Data: 'DATA' },
  Filesystem: {
    writeFile: async ({ path, data, directory }: { path: string; data: string; directory: string }) => { files.set(`${directory}/${path}`, data); return { uri: `file:///${directory}/${path}` }; },
    getUri: async ({ path, directory }: { path: string; directory: string }) => ({ uri: `file:///${directory}/${path}` }),
    rmdir: async ({ path, directory }: { path: string; directory: string }) => { for (const k of [...files.keys()]) if (k.startsWith(`${directory}/${path}/`)) files.delete(k); },
    checkPermissions: async () => ({ publicStorage: 'granted' }),
    requestPermissions: async () => ({ publicStorage: 'granted' }),
  },
}));
vi.mock('@capacitor/share', () => ({ Share: { share: vi.fn(async () => ({})) } }));

const html = readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1] ?? '');
const crashScript = scripts.find(s => s.includes('window.__marcCrash ='));
const clearScript = scripts.find(s => s.includes('window.__marcClearCaches ='));

const flush = async () => { for (let i = 0; i < 30; i++) await Promise.resolve(); };
const cacheCopies = () => [...files.keys()].filter(k => k.startsWith('CACHE/'));

/** Cache Storage as the service worker leaves it: the current and the carried-over build. */
function fakeCaches() {
  const store = new Map<string, string[]>([['marc-build-1', ['./index.html', './assets/index-old.js']], ['marc-build-2', ['./index.html']]]);
  return { store, api: { keys: async () => [...store.keys()], delete: async (k: string) => store.delete(k) } };
}

interface Boot { reload: ReturnType<typeof vi.fn>; timers: Array<{ fn: () => void; ms: number }>; clickReset: () => void; storage: Map<string, string> }

/** Runs index.html's head scripts, then the pre-mount crash, and hands back the screen's Reset button. */
function boot(extra: Record<string, unknown>): Boot {
  expect(crashScript, 'crash script in index.html').toBeTruthy();
  const storage = new Map<string, string>([['marc.state', '{"sessions":["s-old"]}']]);
  const handlers: Record<string, () => void> = {};
  const app = { attrs: {} as Record<string, string>, getAttribute(k: string) { return this.attrs[k] ?? null; }, setAttribute(k: string, v: string) { this.attrs[k] = v; }, appendChild() {} };
  const document = {
    getElementById: (id: string) => (id === 'app' ? app : null),
    createElement: () => ({ style: {}, innerHTML: '', querySelector: (sel: string) => ({ textContent: '', addEventListener: (_: string, fn: () => void) => { handlers[sel] = fn; } }) }),
  };
  const reload = vi.fn();
  const timers: Boot['timers'] = [];
  const sandbox: Record<string, unknown> = {
    document, console, Promise, JSON, Date,
    localStorage: { clear: () => storage.clear(), getItem: (k: string) => storage.get(k) ?? null, key: (i: number) => [...storage.keys()][i] ?? null, get length() { return storage.size; } },
    location: { reload },
    confirm: () => true,
    setTimeout: (fn: () => void, ms: number) => { timers.push({ fn, ms }); return timers.length; },
    addEventListener: () => {},
    ...extra,
  };
  sandbox.window = sandbox;
  const ctx = vm.createContext(sandbox);
  for (const s of scripts) if (s === crashScript || s === clearScript) vm.runInContext(s, ctx);
  (sandbox.__marcCrash as (e: unknown) => void)(new Error('boot failed'));
  expect(handlers['[data-reset]'], 'Reset button wired').toBeTypeOf('function');
  return { reload, timers, clickReset: handlers['[data-reset]']!, storage };
}

/** The Android bridge's nativePromise, routed to the same Filesystem stub the app writes through. */
async function androidBridge(calls: string[]) {
  const { Filesystem } = await import('@capacitor/filesystem');
  return {
    isNativePlatform: () => true,
    nativePromise: (plugin: string, method: string, opts: { path: string; directory: string; recursive?: boolean }) => {
      calls.push(`${plugin}.${method} ${opts.directory}/${opts.path} recursive=${opts.recursive}`);
      return (Filesystem as unknown as Record<string, (o: unknown) => Promise<unknown>>)[method]!(opts);
    },
  };
}

beforeEach(() => { files.clear(); });
afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

describe('A3-2b pre-load reset clears every cache', () => {
  it('AC1: after the start-up reset, Cache Storage holds no pre-reset entry', async () => {
    const caches = fakeCaches();
    expect(caches.store.size).toBe(2); // premise
    const b = boot({ caches: caches.api });
    b.clickReset();
    await flush();
    expect(b.storage.size).toBe(0); // the real reset ran
    expect(caches.store.size).toBe(0);
  });

  it('AC2: on Android, the start-up reset leaves CACHE/MARC Exports and CACHE/MARC Share empty', async () => {
    vi.stubGlobal('Capacitor', { isNativePlatform: () => true });
    const { exportText, shareImage } = await import('@/native/share');
    await exportText('marc-backup-2026-09-22.json', JSON.stringify({ app: 'M/ARC', state: { sessions: ['synthetic-workout'] } }));
    await exportText('marc-sessions-all-2026-09-22.csv', 'date,split\r\n2026-09-20,Push\r\n', 'text/csv');
    await shareImage('card.png', new Blob(['png']), 'My card');
    expect(cacheCopies()).toEqual(['CACHE/MARC Exports/marc-backup-2026-09-22.json', 'CACHE/MARC Exports/marc-sessions-all-2026-09-22.csv', 'CACHE/MARC Share/card.png']); // premise
    const calls: string[] = [];
    const b = boot({ Capacitor: await androidBridge(calls) });
    b.clickReset();
    await flush();
    expect(cacheCopies()).toEqual([]);
    expect(calls.sort()).toEqual(['Filesystem.rmdir CACHE/MARC Exports recursive=true', 'Filesystem.rmdir CACHE/MARC Share recursive=true']);
  });

  it('AC3 web control: with native off, the start-up reset makes no Filesystem call', async () => {
    const nativePromise = vi.fn(async () => undefined);
    // The web bundle's own Capacitor global (it may have loaded before the crash) reports not native.
    const b = boot({ Capacitor: { isNativePlatform: () => false, nativePromise }, caches: fakeCaches().api });
    b.clickReset();
    await flush();
    expect(nativePromise).not.toHaveBeenCalled();
    expect(b.reload).toHaveBeenCalledTimes(1);
    // No Capacitor global at all (the bundle never loaded): still resets and reloads.
    const bare = boot({});
    bare.clickReset();
    await flush();
    expect(bare.storage.size).toBe(0);
    expect(bare.reload).toHaveBeenCalledTimes(1);
  });

  it('reloads once the caches are cleared, and after 2 s at most when the bridge hangs', async () => {
    const quick = boot({ caches: fakeCaches().api });
    quick.clickReset();
    await flush();
    expect(quick.reload).toHaveBeenCalledTimes(1);
    quick.timers.filter(t => t.ms === 2000).forEach(t => t.fn());
    expect(quick.reload).toHaveBeenCalledTimes(1); // the cap does not reload a second time

    const hung = boot({ Capacitor: { isNativePlatform: () => true, nativePromise: () => new Promise(() => {}) } });
    hung.clickReset();
    await flush();
    expect(hung.reload).not.toHaveBeenCalled();
    const cap = hung.timers.filter(t => t.ms === 2000);
    expect(cap).toHaveLength(1);
    cap[0]!.fn();
    expect(hung.reload).toHaveBeenCalledTimes(1);
  });

  it('a failing cache call never blocks the reset or the reload', async () => {
    const b = boot({
      caches: { keys: async () => { throw new Error('denied'); } },
      Capacitor: { isNativePlatform: () => true, nativePromise: async () => { throw new Error('no plugin'); } },
    });
    b.clickReset();
    await flush();
    expect(b.storage.size).toBe(0);
    expect(b.reload).toHaveBeenCalledTimes(1);
  });

  it('no drift: index.html removes the same cache folders as clearExportCache() in src/native/share.ts', async () => {
    const { EXPORT_CACHE_DIRS } = await import('@/native/share');
    const list = /\[([^\]]*)\]\.forEach\(function \(path\)/.exec(clearScript ?? '')?.[1];
    expect(list).toBeTruthy();
    expect(JSON.parse(`[${list!.replace(/'/g, '"')}]`)).toEqual([...EXPORT_CACHE_DIRS]);
    expect(clearScript).toContain("directory: 'CACHE'");
    const { Directory } = await import('@capacitor/filesystem');
    expect(Directory.Cache).toBe('CACHE');
  });
});
