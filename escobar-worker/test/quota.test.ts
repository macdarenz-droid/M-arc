import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QuotaCounter, type Limits } from '../src/quotaDO';
import { handle } from '../src/handler';
import { checkQuota, recordStep } from '../src/quota';
import type { Env } from '../src/anthropic';
import { baseEnv, deps, eventsFor, finalMessage, mockClient, post, sse, turn, DEVICE } from './helpers';

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
        list: () => data.entries(),
      },
      getAlarm: async () => { await tick(); return alarm; },
      setAlarm: async (t: number) => { await tick(); alarm = t; },
      deleteAll: async () => { data.clear(); alarm = null; },
    },
  };
}

/** A QUOTA_DO namespace whose stubs are the objects themselves, one per name (one per UTC day). */
function fakeNamespace() {
  const objects = new Map<string, { counter: QuotaCounter; state: ReturnType<typeof fakeState> }>();
  const ns = {
    objects,
    idFromName: (name: string) => name,
    get: (id: string) => {
      if (!objects.has(id)) { const state = fakeState(); objects.set(id, { counter: new QuotaCounter(state as never, {} as never), state }); }
      return objects.get(id)!.counter;
    },
  };
  return ns;
}

const LIM: Limits = { device: { turns: 80, steps: 400, out: 400_000 }, ip: { turns: 300 }, global: { steps: 20_000, out: 3_000_000 } };
const KEYS = { device: DEVICE, ip: '203.0.113.7' };
const TEXT = [{ type: 'text', text: 'ok' }];

beforeEach(() => { vi.spyOn(console, 'log').mockImplementation(() => {}); });

describe('QuotaCounter Durable Object (PL-01, PL-07)', () => {
  it('five concurrent adds sum exactly', async () => {
    const state = fakeState(5);
    const c = new QuotaCounter(state as never, {} as never);
    await Promise.all(Array.from({ length: 5 }, () => c.add(KEYS, { steps: 1, out: 40, turns: 1 })));
    expect(state.data.get(`d:${DEVICE}`)).toEqual({ turns: 5, steps: 5, out: 200 });
    expect(state.data.get('i:203.0.113.7')).toEqual({ turns: 5 });
    expect(state.data.get('g')).toEqual({ steps: 5, out: 200 });
  });
  it('sets one cleanup alarm three days out and clears everything when it fires', async () => {
    const state = fakeState();
    const c = new QuotaCounter(state as never, {} as never);
    const before = Date.now();
    await c.add(KEYS, { steps: 1, out: 1, turns: 1 });
    expect(state.alarm).toBeGreaterThanOrEqual(before + 3 * 86_400_000);
    await c.alarm();
    expect(state.data.size).toBe(0);
  });
  it('reports which scope is over its cap', async () => {
    const c = new QuotaCounter(fakeState() as never, {} as never);
    expect(c.check(KEYS, LIM)).toEqual({ ok: true });
    await c.add(KEYS, { steps: 1, out: 10, turns: 1 });
    expect(c.check(KEYS, { ...LIM, device: { ...LIM.device, turns: 1 } })).toEqual({ ok: false, scope: 'device' });
    expect(c.check({ device: 'dev_other000000000000000000', ip: KEYS.ip }, { ...LIM, ip: { turns: 1 } })).toEqual({ ok: false, scope: 'ip' });
    expect(c.check({ device: 'dev_other000000000000000000', ip: '198.51.100.1' }, { ...LIM, global: { steps: 1_000, out: 10 } })).toEqual({ ok: false, scope: 'global' });
  });
});

describe('quota backends', () => {
  it('the Durable Object comes first and maps scopes to the existing messages', async () => {
    const ns = fakeNamespace();
    const env = baseEnv({ QUOTA_DO: ns as never, MAX_TURNS_PER_IP: '1', MAX_OUTPUT_TOTAL: '50' });
    const now = Date.parse('2026-09-22T12:00:00Z');
    await recordStep(env, KEYS, now, { turnEnded: true, outputTokens: 40, turnSteps: 1 });
    expect(ns.objects.has('2026-09-22')).toBe(true);
    const ip = await checkQuota(env, { device: 'dev_aaaaaaaaaaaaaaaaaaaaaaaa', ip: KEYS.ip }, now);
    expect(ip).toMatchObject({ ok: false, message: expect.stringMatching(/coaching limit/) });
    await recordStep(env, { device: 'dev_bbbbbbbbbbbbbbbbbbbbbbbb', ip: '198.51.100.1' }, now, { turnEnded: false, outputTokens: 20, turnSteps: 1 });
    const g = await checkQuota(env, { device: 'dev_cccccccccccccccccccccccc', ip: '198.51.100.2' }, now);
    expect(g).toMatchObject({ ok: false, message: 'Escobar is resting for today. Your notes still update.' });
    expect(await checkQuota(env, KEYS, Date.parse('2026-09-23T00:00:01Z'))).toEqual({ ok: true });
  });
  it('without any binding every check passes', async () => {
    expect(await checkQuota(baseEnv(), KEYS, 0)).toEqual({ ok: true });
  });
});

describe('handler with QUOTA_DO', () => {
  const env = (extra: Partial<Env> = {}) => { const ns = fakeNamespace(); return { ns, env: baseEnv({ QUOTA_DO: ns as never, ...extra }) }; };
  const counters = (ns: ReturnType<typeof fakeNamespace>) => ns.objects.get('2026-09-22')!.state.data;

  it('health reports quotas:true when the Durable Object is bound', async () => {
    const r = await handle(new Request('https://x/health'), env().env, deps(mockClient([])));
    expect(((await r.json()) as { quotas: boolean }).quotas).toBe(true);
  });
  it('a tool_use step is recorded as steps 1 / turns 0, and a turn end adds exactly one more step', async () => {
    const { ns, env: e } = env();
    const toolStep = [{ type: 'tool_use', id: 't', name: 'get_overview', input: {} }];
    await sse(await handle(post(turn()), e, deps(mockClient([{ events: eventsFor(toolStep), final: finalMessage(toolStep, 'tool_use') }]))));
    expect(counters(ns).get(`d:${DEVICE}`)).toEqual({ turns: 0, steps: 1, out: 40 });
    const next = turn({ messages: [{ role: 'user', content: 'go' }, { role: 'assistant', content: toolStep }, { role: 'user', content: [{ type: 'tool_result', tool_use_id: 't', content: '{}' }] }] });
    await sse(await handle(post(next), e, deps(mockClient([{ events: eventsFor(TEXT), final: finalMessage(TEXT) }]))));
    expect(counters(ns).get(`d:${DEVICE}`)).toEqual({ turns: 1, steps: 2, out: 80 });
    expect(counters(ns).get('i:unknown')).toEqual({ turns: 1 });
  });
  it('rotating device ids from one IP hit 429 from RATE_IP', async () => {
    const seen = new Map<string, number>();
    const RATE_IP = { limit: async ({ key }: { key: string }) => { const n = (seen.get(key) ?? 0) + 1; seen.set(key, n); return { success: n <= 5 }; } };
    const { env: e } = env({ RATE: { limit: async () => ({ success: true }) }, RATE_IP });
    const statuses: number[] = [];
    for (let i = 0; i < 10; i++) {
      const device = `dev_${i.toString(16).padStart(24, '0')}`;
      const r = await handle(post(turn(), { 'x-escobar-device': device, 'cf-connecting-ip': '203.0.113.7' }), e, deps(mockClient([{ events: eventsFor(TEXT), final: finalMessage(TEXT) }])));
      statuses.push(r.status);
      if (r.status === 200) await sse(r); else expect(((await r.json()) as { code: string }).code).toBe('rate');
    }
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429, 429, 429, 429, 429]);
    expect([...seen.keys()]).toEqual(['203.0.113.7']);
  });
  it('the per-IP daily turn cap refuses new device ids from that IP', async () => {
    const { env: e } = env({ MAX_TURNS_PER_IP: '2' });
    const send = (i: number) => handle(post(turn(), { 'x-escobar-device': `dev_${i.toString(16).padStart(24, '0')}`, 'cf-connecting-ip': '203.0.113.9' }), e, deps(mockClient([{ events: eventsFor(TEXT), final: finalMessage(TEXT) }])));
    await sse(await send(1));
    await sse(await send(2));
    const r = await send(3);
    expect(r.status).toBe(429);
    expect(((await r.json()) as { code: string }).code).toBe('quota');
  });
  it('logs one structured line per step with no device id and no content', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    await sse(await handle(post(turn()), env().env, deps(mockClient([{ events: eventsFor(TEXT), final: finalMessage(TEXT) }]))));
    expect(log).toHaveBeenCalledTimes(1);
    const line = String(log.mock.calls[0]![0]);
    expect(JSON.parse(line)).toEqual({ requestId: 'req_1', mode: 'chat', model: 'claude-opus-5', stop_reason: 'end_turn', in: 100, out: 40, cacheRead: 80, cacheWrite: 0, steps: 1, ms: 0 });
    expect(line).not.toContain(DEVICE);
    expect(line).not.toContain('readiness');
  });
});
