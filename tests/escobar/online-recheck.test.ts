import { describe, it, expect, vi, afterEach } from 'vitest';
import type { Transport } from '@/escobar/transport';

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.resetModules(); });

describe('after a dropped answer (QA-R4a-6)', () => {
  it('Escobar checks again when the back-off ends, without the sheet being reopened', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ protocol: 2, key: true }), { status: 200, headers: { 'content-type': 'application/json' } })));
    const store = await import('@/escobar/store');
    const session = await import('@/escobar/session');
    const { online } = await import('@/escobar/state');
    store.setEscobarStorage(store.memoryStorage());
    const broken: Transport = { async *turn() { await Promise.resolve(); throw new TypeError('Failed to fetch'); } };
    session.setTransport(broken);
    const r = await session.send({ text: 'hello' });
    expect(r.error?.code).toBe('network');
    expect(online.value).toBe(false);
    await vi.advanceTimersByTimeAsync(61_000);
    expect(online.value).toBe(true);
  });
});
