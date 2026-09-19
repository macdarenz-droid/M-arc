/**
 * Pure request handling: shape and size checks, CORS, per-device rate limit
 * and daily quotas, then the model call. The model call is injected so the
 * handler can be tested without the network.
 */
import type { CallModel, ExplainPayload, WorkerEnv } from './types';

export const MAX_BODY_BYTES = 24 * 1024;
export const MAX_FINDINGS = 24;
export const MAX_PROPOSALS = 16;
export const MAX_EXPLAIN = 12;
export const MAX_CARDS = 18;
const DEVICE_ID = /^[a-zA-Z0-9_-]{8,64}$/;

const ALWAYS_ALLOWED_ORIGINS = new Set(['capacitor://localhost', 'http://localhost', 'https://localhost', 'ionic://localhost']);

export function corsHeaders(origin: string | null, env: WorkerEnv): Record<string, string> {
  const extra = (env.ALLOWED_ORIGINS ?? '').split(',').map(s => s.trim()).filter(Boolean);
  const ok = !origin || ALWAYS_ALLOWED_ORIGINS.has(origin) || extra.includes(origin) || /^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/(127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin);
  const h: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, x-marc-device',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (ok && origin) h['Access-Control-Allow-Origin'] = origin;
  if (ok && !origin) h['Access-Control-Allow-Origin'] = '*';
  return h;
}

export function originAllowed(origin: string | null, env: WorkerEnv): boolean {
  return 'Access-Control-Allow-Origin' in corsHeaders(origin, env);
}

const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const isDay = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);

/** Returns the payload, or a plain-words reason it was refused. */
export function validatePayload(raw: unknown): { ok: true; payload: ExplainPayload } | { ok: false; reason: string } {
  if (!isRecord(raw)) return { ok: false, reason: 'Body must be a JSON object.' };
  if (raw.version !== 1 || raw.kind !== 'explain') return { ok: false, reason: 'Unsupported payload version or kind.' };
  if (typeof raw.goal !== 'string' || (raw.unit !== 'kg' && raw.unit !== 'lb') || !isDay(raw.today)) return { ok: false, reason: 'goal, unit and today are required.' };
  if (!isRecord(raw.dataQuality)) return { ok: false, reason: 'dataQuality is required.' };
  const findings = raw.findings, proposals = raw.proposals, cards = raw.cards, explain = raw.explain;
  if (!Array.isArray(findings) || findings.length > MAX_FINDINGS) return { ok: false, reason: `findings must be an array of at most ${MAX_FINDINGS}.` };
  if (!Array.isArray(proposals) || proposals.length > MAX_PROPOSALS) return { ok: false, reason: `proposals must be an array of at most ${MAX_PROPOSALS}.` };
  if (!Array.isArray(cards) || cards.length > MAX_CARDS) return { ok: false, reason: `cards must be an array of at most ${MAX_CARDS}.` };
  if (!Array.isArray(explain) || !explain.length || explain.length > MAX_EXPLAIN || !explain.every(x => typeof x === 'string')) return { ok: false, reason: `explain must list 1 to ${MAX_EXPLAIN} ids.` };
  for (const f of findings) {
    if (!isRecord(f) || typeof f.id !== 'string' || typeof f.kind !== 'string' || !isRecord(f.metrics) || !isRecord(f.window) || !isRecord(f.subject)) return { ok: false, reason: 'A finding is malformed.' };
    if ('evidence' in f || 'sessionIds' in f) return { ok: false, reason: 'Findings must not carry session evidence.' };
  }
  for (const p of proposals) {
    if (!isRecord(p) || typeof p.id !== 'string' || typeof p.kind !== 'string' || !isRecord(p.subject)) return { ok: false, reason: 'A proposal is malformed.' };
  }
  for (const c of cards) {
    if (!isRecord(c) || typeof c.id !== 'string' || typeof c.statement !== 'string' || typeof c.title !== 'string' || typeof c.rating !== 'string') return { ok: false, reason: 'A card is malformed.' };
  }
  const known = new Set([...findings.map(f => (f as { id: string }).id), ...proposals.map(p => (p as { id: string }).id)]);
  if (!explain.every(id => known.has(id as string))) return { ok: false, reason: 'explain lists an id that is not in the report.' };
  // Anything that looks like a person: refuse. The app never sends these; a modified client might.
  for (const key of ['profile', 'name', 'email', 'bodyWeightKg', 'heightCm', 'sessions']) if (key in raw) return { ok: false, reason: `Field "${key}" is not accepted.` };
  return { ok: true, payload: raw as unknown as ExplainPayload };
}

export interface QuotaResult { ok: boolean; reason?: string; remaining?: number }

/** Best-effort daily counters in KV. Without a QUOTA binding, everything is allowed. */
export async function checkQuota(env: WorkerEnv, device: string, today: string): Promise<QuotaResult> {
  const kv = env.QUOTA;
  if (!kv) return { ok: true };
  const perDevice = Number(env.MAX_DAILY_PER_DEVICE ?? '12') || 12;
  const total = Number(env.MAX_DAILY_TOTAL ?? '2000') || 2000;
  const dKey = `d:${device}:${today}`, tKey = `t:${today}`;
  const [d, t] = await Promise.all([kv.get(dKey), kv.get(tKey)]);
  const dn = Number(d ?? '0'), tn = Number(t ?? '0');
  if (dn >= perDevice) return { ok: false, reason: 'Daily limit for this device reached. Try again tomorrow.', remaining: 0 };
  if (tn >= total) return { ok: false, reason: 'The coach is busy today. Try again tomorrow.', remaining: 0 };
  const ttl = 60 * 60 * 36;
  await Promise.all([kv.put(dKey, String(dn + 1), { expirationTtl: ttl }), kv.put(tKey, String(tn + 1), { expirationTtl: ttl })]);
  return { ok: true, remaining: perDevice - dn - 1 };
}

function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });
}

export function createHandler(callModel: CallModel) {
  return async (request: Request, env: WorkerEnv): Promise<Response> => {
    const origin = request.headers.get('origin');
    const cors = corsHeaders(origin, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (!originAllowed(origin, env)) return json(403, { error: 'Origin not allowed.' }, cors);
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/health') return json(200, { ok: true, model: env.MODEL ?? 'claude-haiku-4-5', quotas: !!env.QUOTA, rateLimit: !!env.RATE }, cors);
    if (request.method !== 'POST' || url.pathname !== '/explain') return json(404, { error: 'Not found.' }, cors);
    if (!env.ANTHROPIC_API_KEY) return json(503, { error: 'The proxy has no API key yet. Run: npx wrangler@4 secret put ANTHROPIC_API_KEY' }, cors);

    const device = request.headers.get('x-marc-device') ?? '';
    if (!DEVICE_ID.test(device)) return json(400, { error: 'Missing or invalid x-marc-device header.' }, cors);
    const length = Number(request.headers.get('content-length') ?? '0');
    if (length > MAX_BODY_BYTES) return json(413, { error: `Body too large (max ${MAX_BODY_BYTES} bytes).` }, cors);
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return json(413, { error: `Body too large (max ${MAX_BODY_BYTES} bytes).` }, cors);
    let raw: unknown;
    try { raw = JSON.parse(text); } catch { return json(400, { error: 'Body is not valid JSON.' }, cors); }
    const v = validatePayload(raw);
    if (!v.ok) return json(400, { error: v.reason }, cors);

    if (env.RATE) {
      const r = await env.RATE.limit({ key: device });
      if (!r.success) return json(429, { error: 'Too many requests. Wait a minute.' }, { ...cors, 'retry-after': '60' });
    }
    const quota = await checkQuota(env, device, v.payload.today);
    if (!quota.ok) return json(429, { error: quota.reason }, { ...cors, 'retry-after': '3600' });

    try {
      const out = await callModel(v.payload, env);
      const wanted = new Set(v.payload.explain);
      const items = out.items.filter(i => wanted.has(i.id)).map(i => ({ id: i.id, text: String(i.text).trim() }));
      return json(200, { summary: String(out.summary).trim(), items, model: out.model, usage: out.usage, remaining: quota.remaining ?? null }, cors);
    } catch (err) {
      const status = (err as { status?: number }).status;
      if (status === 429) return json(429, { error: 'The model is busy. Try again in a minute.' }, { ...cors, 'retry-after': '60' });
      if (status === 401) return json(503, { error: 'The proxy key was rejected. Check the ANTHROPIC_API_KEY secret.' }, cors);
      console.error('explain failed', err);
      return json(502, { error: 'The coach could not answer right now.' }, cors);
    }
  };
}
