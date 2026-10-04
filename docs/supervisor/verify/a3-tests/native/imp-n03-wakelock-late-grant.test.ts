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
