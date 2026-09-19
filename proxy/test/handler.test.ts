import { describe, it, expect } from 'vitest';
import { createHandler, validatePayload, checkQuota, corsHeaders, MAX_BODY_BYTES } from '../src/handler';
import { SYSTEM_PROMPT, userMessage } from '../src/prompt';
import type { ExplainPayload, WorkerEnv } from '../src/types';

const payload = (): ExplainPayload => ({
  version: 1, kind: 'explain', goal: 'lean', unit: 'kg', today: '2026-09-19',
  dataQuality: { sessions: 40, weeksOfData: 12, effortCoverage: 0.9, insufficientData: false },
  findings: [{ id: 'volume_drop:chest', kind: 'volume_drop', subject: { muscleGroup: 'chest' }, metrics: { changePct: -18, baselineSets: 14.5, currentSets: 11.9 }, window: { from: '2026-08-24', to: '2026-09-13', weeks: 3 }, confidence: 'high', severity: 1 }],
  proposals: [{ id: 'exercise_swap:lib_barbell_bench_press', kind: 'exercise_swap', subject: { exerciseId: 'lib_barbell_bench_press' }, apply: { kind: 'exercise_swap', fromExerciseId: 'a', toExerciseId: 'b' }, basedOn: ['volume_drop:chest'], confidence: 'medium' }],
  cards: [{ id: 'volume_dose_response', title: 'Weekly volume drives growth', rating: 'strong', statement: 'More hard sets per muscle per week produce more growth, up to a point.', disputed: 'The exact shape at high volumes.' }],
  explain: ['volume_drop:chest', 'exercise_swap:lib_barbell_bench_press'],
});

class FakeKV {
  store = new Map<string, string>();
  async get(k: string) { return this.store.get(k) ?? null; }
  async put(k: string, v: string) { this.store.set(k, v); }
}

const env = (over: Partial<WorkerEnv> = {}): WorkerEnv => ({ ANTHROPIC_API_KEY: 'test-key', MODEL: 'claude-haiku-4-5', ...over });

const stubModel = async (p: ExplainPayload) => ({
  summary: 'A steady week with chest volume down 18%.',
  items: [...p.explain.map(id => ({ id, text: `About ${id}.` })), { id: 'not_requested', text: 'ignored' }],
  model: 'claude-haiku-4-5', usage: { inputTokens: 900, outputTokens: 120, cacheReadTokens: 0 },
});

const post = (body: unknown, headers: Record<string, string> = {}, origin?: string) =>
  new Request('https://marc-coach.example.workers.dev/explain', { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body), headers: { 'content-type': 'application/json', 'x-marc-device': 'device_abcdef12', ...(origin ? { origin } : {}), ...headers } });

describe('payload validation', () => {
  it('accepts the app payload and refuses anything personal or oversized', () => {
    expect(validatePayload(payload()).ok).toBe(true);
    expect(validatePayload({ ...payload(), profile: { name: 'x' } })).toMatchObject({ ok: false });
    expect(validatePayload({ ...payload(), sessions: [] })).toMatchObject({ ok: false });
    expect(validatePayload({ ...payload(), findings: [{ ...payload().findings[0], evidence: { sessionIds: ['s1'] } }] })).toMatchObject({ ok: false });
    expect(validatePayload({ ...payload(), explain: ['nope'] })).toMatchObject({ ok: false, reason: expect.stringContaining('not in the report') });
    expect(validatePayload({ ...payload(), explain: [] })).toMatchObject({ ok: false });
    expect(validatePayload({ ...payload(), version: 2 })).toMatchObject({ ok: false });
    expect(validatePayload({ ...payload(), findings: Array.from({ length: 30 }, () => payload().findings[0]) })).toMatchObject({ ok: false });
    expect(validatePayload('nope')).toMatchObject({ ok: false });
  });
});

describe('cors', () => {
  it('allows the app origins and configured web origins only', () => {
    expect(corsHeaders(null, env())['Access-Control-Allow-Origin']).toBe('*');
    expect(corsHeaders('capacitor://localhost', env())['Access-Control-Allow-Origin']).toBe('capacitor://localhost');
    expect(corsHeaders('http://localhost:5173', env())['Access-Control-Allow-Origin']).toBe('http://localhost:5173');
    expect('Access-Control-Allow-Origin' in corsHeaders('https://evil.example', env())).toBe(false);
    expect(corsHeaders('https://marc.example.app', env({ ALLOWED_ORIGINS: 'https://marc.example.app, https://other.example' }))['Access-Control-Allow-Origin']).toBe('https://marc.example.app');
  });
});

describe('quota', () => {
  it('counts per device and in total, and is a no-op without KV', async () => {
    expect(await checkQuota(env(), 'd1', '2026-09-19')).toEqual({ ok: true });
    const kv = new FakeKV();
    const e = env({ QUOTA: kv as unknown as KVNamespace, MAX_DAILY_PER_DEVICE: '2', MAX_DAILY_TOTAL: '3' });
    expect((await checkQuota(e, 'd1', '2026-09-19')).remaining).toBe(1);
    expect((await checkQuota(e, 'd1', '2026-09-19')).remaining).toBe(0);
    expect(await checkQuota(e, 'd1', '2026-09-19')).toMatchObject({ ok: false, reason: expect.stringContaining('this device') });
    expect((await checkQuota(e, 'd2', '2026-09-19')).ok).toBe(true);
    expect(await checkQuota(e, 'd3', '2026-09-19')).toMatchObject({ ok: false, reason: expect.stringContaining('busy') });
    expect((await checkQuota(e, 'd1', '2026-09-20')).ok).toBe(true);
  });
});

describe('handler', () => {
  const handle = createHandler(stubModel);

  it('answers a valid request with only the requested items', async () => {
    const res = await handle(post(payload()), env());
    expect(res.status).toBe(200);
    const body = await res.json() as { summary: string; items: Array<{ id: string }>; model: string; usage: { inputTokens: number } };
    expect(body.summary).toContain('18%');
    expect(body.items.map(i => i.id)).toEqual(['volume_drop:chest', 'exercise_swap:lib_barbell_bench_press']);
    expect(body.model).toBe('claude-haiku-4-5');
    expect(body.usage.inputTokens).toBe(900);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('preflight, health, wrong path, wrong method', async () => {
    expect((await handle(new Request('https://x/explain', { method: 'OPTIONS', headers: { origin: 'capacitor://localhost' } }), env())).status).toBe(204);
    const health = await handle(new Request('https://x/health'), env({ RATE: { limit: async () => ({ success: true }) } }));
    expect(await health.json()).toMatchObject({ ok: true, model: 'claude-haiku-4-5', rateLimit: true, quotas: false });
    expect((await handle(new Request('https://x/other', { method: 'POST' }), env())).status).toBe(404);
    expect((await handle(new Request('https://x/explain', { method: 'GET' }), env())).status).toBe(404);
  });

  it('refuses bad origins, missing device, missing key, bad JSON, oversized bodies', async () => {
    expect((await handle(post(payload(), {}, 'https://evil.example'), env())).status).toBe(403);
    expect((await handle(post(payload(), { 'x-marc-device': 'x' }), env())).status).toBe(400);
    const noKey = await handle(post(payload()), env({ ANTHROPIC_API_KEY: undefined }));
    expect(noKey.status).toBe(503);
    expect((await noKey.json() as { error: string }).error).toContain('secret put');
    expect((await handle(post('{not json'), env())).status).toBe(400);
    expect((await handle(post('x'.repeat(MAX_BODY_BYTES + 1)), env())).status).toBe(413);
    expect((await handle(post({ ...payload(), profile: {} }), env())).status).toBe(400);
  });

  it('applies the rate limiter and daily quota', async () => {
    const limited = env({ RATE: { limit: async () => ({ success: false }) } });
    const r = await handle(post(payload()), limited);
    expect(r.status).toBe(429);
    expect(r.headers.get('retry-after')).toBe('60');
    const kv = new FakeKV();
    const quota = env({ QUOTA: kv as unknown as KVNamespace, MAX_DAILY_PER_DEVICE: '1' });
    expect((await handle(post(payload()), quota)).status).toBe(200);
    const second = await handle(post(payload()), quota);
    expect(second.status).toBe(429);
    expect(second.headers.get('retry-after')).toBe('3600');
  });

  it('maps upstream failures to calm errors', async () => {
    const failing = createHandler(async () => { throw Object.assign(new Error('rate'), { status: 429 }); });
    expect((await failing(post(payload()), env())).status).toBe(429);
    const unauthorized = createHandler(async () => { throw Object.assign(new Error('auth'), { status: 401 }); });
    const u = await unauthorized(post(payload()), env());
    expect(u.status).toBe(503);
    expect((await u.json() as { error: string }).error).toContain('ANTHROPIC_API_KEY');
    const broken = createHandler(async () => { throw new Error('boom'); });
    expect((await broken(post(payload()), env())).status).toBe(502);
  });
});

describe('prompt', () => {
  it('states the contract and serialises the payload deterministically', () => {
    expect(SYSTEM_PROMPT).toContain('Use only numbers that appear in the report');
    expect(SYSTEM_PROMPT).toContain('Never predict or mention injury');
    expect(SYSTEM_PROMPT).toContain('contested');
    expect(SYSTEM_PROMPT).toContain('55 words');
    expect(userMessage(payload())).toBe(userMessage(payload()));
    expect(userMessage(payload())).toContain('"changePct":-18');
  });
});
