import { describe, it, expect, vi } from 'vitest';
import { handleErrors } from '../src/errorsHandler';
import { ErrorReports } from '../src/errorsDO';
import type { Env } from '../src/anthropic';

/** In-memory Durable Object storage: `kv` is synchronous like SyncKvStorage; the alarm calls yield. */
function fakeState(alarmDelayMs = 0) {
  const data = new Map<string, unknown>();
  let alarm: number | null = null;
  const tick = () => new Promise(r => setTimeout(r, alarmDelayMs));
  return {
    data,
    get alarm() { return alarm; },
    storage: {
      kv: {
        get: (k: string) => (data.has(k) ? structuredClone(data.get(k)) : undefined),
        put: (k: string, v: unknown) => { data.set(k, structuredClone(v)); },
        delete: (k: string) => data.delete(k),
        list: (opts?: { prefix?: string }) => [...data.entries()].filter(([k]) => !opts?.prefix || (k as string).startsWith(opts.prefix)),
      },
      getAlarm: async () => { await tick(); return alarm; },
      setAlarm: async (t: number) => { await tick(); alarm = t; },
      deleteAll: async () => { data.clear(); alarm = null; },
    },
  };
}

/** An ERRORS_DO namespace whose stubs are the objects themselves, one per name (one per UTC day). */
function fakeNamespace() {
  const objects = new Map<string, { obj: ErrorReports; state: ReturnType<typeof fakeState> }>();
  return {
    objects,
    idFromName: (name: string) => name,
    get: (id: string) => {
      if (!objects.has(id)) { const state = fakeState(); objects.set(id, { obj: new ErrorReports(state as never, {} as never), state }); }
      return objects.get(id)!.obj;
    },
  };
}

const NOW = Date.parse('2026-09-27T12:00:00Z');
const deps = { now: () => NOW };
const uuidFor = (i: number): string => `11111111-1111-4111-8111-${i.toString(16).padStart(12, '0')}`;
const INSTALL = uuidFor(0);

function report(overrides: Record<string, unknown> = {}) {
  return {
    installId: INSTALL, ts: '2026-09-27T12:00:00.000Z', app: 'm-arc', platform: 'android',
    route: 'home', kind: 'boundary', name: 'TypeError', message: 'x is undefined',
    frames: [{ file: 'app.js', line: 1, col: 2 }], sig: 'sig-1', count: 1, ...overrides,
  };
}
const batch = (reports: unknown[] = [report()]) => ({ v: 1, reports });

function post(body: unknown, headers: Record<string, string> = {}) {
  return new Request('https://marc-coach.example/errors', { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json', 'cf-connecting-ip': '203.0.113.5', ...headers } });
}

function testEnv(extra: Partial<Env> = {}) {
  const ns = fakeNamespace();
  return { ns, env: { ERRORS_DO: ns as never, ERRORS_SUMMARY_TOKEN: 'secret-token', ...extra } as Env };
}

describe('POST /errors', () => {
  it('W1 a valid batch returns 204 and is stored', async () => {
    const { ns, env } = testEnv();
    const r = await handleErrors(post(batch()), env, deps);
    expect(r.status).toBe(204);
    const stored = ns.objects.get('2026-09-27')!.obj.list(0);
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ sig: 'sig-1', installId: INSTALL });
  });

  it('W2 rejects an unknown field, a wrong type, an over-length message, 16 frames, 21 reports, and a bad kind with 400', async () => {
    const { env } = testEnv();
    const sixteenFrames = Array.from({ length: 16 }, () => ({ file: 'a.js', line: 1, col: 1 }));
    const cases: unknown[] = [
      batch([{ ...report(), extra: 'nope' }]),
      batch([{ ...report(), count: 'one' }]),
      batch([{ ...report(), message: 'x'.repeat(301) }]),
      batch([{ ...report(), frames: sixteenFrames }]),
      { v: 1, reports: Array.from({ length: 21 }, (_, i) => report({ installId: uuidFor(i) })) },
      batch([{ ...report(), kind: 'nope' }]),
    ];
    for (const body of cases) expect((await handleErrors(post(body), env, deps)).status).toBe(400);
  });

  it('W3 a 9 KB body returns 413', async () => {
    const { env } = testEnv();
    const big = batch([report({ message: 'x'.repeat(9_000) })]);
    expect((await handleErrors(post(big), env, deps)).status).toBe(413);
  });

  it('W4 the 31st request in an hour from one installId returns 429', async () => {
    const { env } = testEnv();
    const statuses: number[] = [];
    for (let i = 0; i < 31; i++) {
      const r = await handleErrors(post(batch([report()]), { 'cf-connecting-ip': `203.0.113.${i}` }), env, deps);
      statuses.push(r.status);
    }
    expect(statuses.slice(0, 30)).toEqual(Array(30).fill(204));
    expect(statuses[30]).toBe(429);
  });

  it('W4 the 31st request in an hour from one IP returns 429, with a different installId each time', async () => {
    const { env } = testEnv();
    const statuses: number[] = [];
    for (let i = 0; i < 31; i++) {
      const r = await handleErrors(post(batch([report({ installId: uuidFor(i) })])), env, deps);
      statuses.push(r.status);
    }
    expect(statuses.slice(0, 30)).toEqual(Array(30).fill(204));
    expect(statuses[30]).toBe(429);
  });

  it('W5 reports older than 90 days are deleted', async () => {
    const { ns, env } = testEnv();
    await handleErrors(post(batch()), env, deps);
    const shard = ns.objects.get('2026-09-27')!;
    expect(shard.state.alarm).toBeGreaterThanOrEqual(NOW + 89 * 86_400_000);
    await shard.obj.alarm();
    expect(shard.obj.list(0)).toHaveLength(0);
  });

  it('W7 never logs report bodies', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { env } = testEnv();
    await handleErrors(post(batch([report({ message: 'super-secret-message-xyz' })])), env, deps);
    const seen = [...logSpy.mock.calls, ...errSpy.mock.calls].flat().map(String).join('\n');
    expect(seen).not.toContain('super-secret-message-xyz');
    logSpy.mockRestore();
    errSpy.mockRestore();
  });
});

describe('GET /errors/summary', () => {
  function get(headers: Record<string, string> = {}) {
    return new Request('https://marc-coach.example/errors/summary', { headers });
  }

  it('W6 returns 401 without the token, and the correct counts with it', async () => {
    const { env } = testEnv();
    await handleErrors(post(batch([report({ sig: 'sig-a', count: 2, installId: uuidFor(1) })])), env, deps);
    await handleErrors(post(batch([report({ sig: 'sig-a', count: 3, installId: uuidFor(2) })])), env, deps);
    await handleErrors(post(batch([report({ sig: 'sig-b', count: 1, installId: uuidFor(1) })])), env, deps);

    expect((await handleErrors(get(), env, deps)).status).toBe(401);
    expect((await handleErrors(get({ authorization: 'Bearer wrong' }), env, deps)).status).toBe(401);

    const r = await handleErrors(get({ authorization: 'Bearer secret-token' }), env, deps);
    expect(r.status).toBe(200);
    const body = (await r.json()) as { signatures: Array<{ sig: string; count: number; installs: number }> };
    const bySig = Object.fromEntries(body.signatures.map(s => [s.sig, s]));
    expect(bySig['sig-a']).toMatchObject({ count: 5, installs: 2 });
    expect(bySig['sig-b']).toMatchObject({ count: 1, installs: 1 });
  });
});
