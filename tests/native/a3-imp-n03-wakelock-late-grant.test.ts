/** IMP-N03: a web wake lock granted after Off must be released, not kept. */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/native/capacitor', () => ({ isNative: () => false }));

function deferred<T>() { let resolve!: (v: T) => void; const promise = new Promise<T>(r => { resolve = r; }); return { promise, resolve }; }

beforeEach(() => {
  vi.resetModules();
  vi.stubGlobal('document', { visibilityState: 'visible', addEventListener: vi.fn() });
});
afterEach(() => { vi.unstubAllGlobals(); });

describe('IMP-N03 obsolete wake-lock grants are released', () => {
  it('Off while the request is pending leaves zero held locks', async () => {
    const grant = deferred<{ release: () => Promise<void> }>();
    const release = vi.fn(async () => undefined);
    vi.stubGlobal('navigator', { wakeLock: { request: vi.fn(() => grant.promise) } });
    const { keepAwake } = await import('@/native/keepAwake');
    const on = keepAwake(true); // live workout starts
    await keepAwake(false); // workout ends / preference off before the grant arrives
    grant.resolve({ release });
    await on;
    await Promise.resolve();
    expect(release).toHaveBeenCalledTimes(1);
  });
});

/** A3-3 AC7: tab returns re-acquire the lock without stacking; a stale grant never outlives a newer one. */
describe('IMP-N03 visibility re-acquires hold one lock', () => {
  const sentinel = () => ({ release: vi.fn(async () => undefined) });
  it('two visible events with grants release the earlier locks once each', async () => {
    const locks = [sentinel(), sentinel(), sentinel()];
    let n = 0;
    vi.stubGlobal('navigator', { wakeLock: { request: vi.fn(async () => locks[n++]) } });
    const { keepAwake } = await import('@/native/keepAwake');
    await keepAwake(true);
    const onVis = (document.addEventListener as ReturnType<typeof vi.fn>).mock.calls.find(c => c[0] === 'visibilitychange')![1] as () => void;
    onVis(); await flushAll();
    onVis(); await flushAll();
    expect(locks[0]!.release).toHaveBeenCalledTimes(1);
    expect(locks[1]!.release).toHaveBeenCalledTimes(1);
    expect(locks[2]!.release).toHaveBeenCalledTimes(0);
    await keepAwake(false);
    expect(locks[2]!.release).toHaveBeenCalledTimes(1);
  });
  it('an older grant that lands after a newer one is released, and the newer stays held', async () => {
    const a = deferred<{ release: () => Promise<void> }>(), b = deferred<{ release: () => Promise<void> }>();
    const la = sentinel(), lb = sentinel();
    const request = vi.fn().mockImplementationOnce(() => a.promise).mockImplementationOnce(() => b.promise);
    vi.stubGlobal('navigator', { wakeLock: { request } });
    const { keepAwake } = await import('@/native/keepAwake');
    const first = keepAwake(true);
    const onVis = (document.addEventListener as ReturnType<typeof vi.fn>).mock.calls.find(c => c[0] === 'visibilitychange')![1] as () => void;
    onVis();
    b.resolve(lb); await flushAll();
    a.resolve(la); await first; await flushAll();
    expect(la.release).toHaveBeenCalledTimes(1);
    expect(lb.release).toHaveBeenCalledTimes(0);
    await keepAwake(false);
    expect(lb.release).toHaveBeenCalledTimes(1);
  });
});
const flushAll = async () => { for (let i = 0; i < 20; i++) await Promise.resolve(); };
