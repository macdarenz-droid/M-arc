/**
 * Routes, CORS, device id, validation, rate limit and quotas, then one streamed model step
 * relayed as server-sent events (§12.2, §12.4–12.6). Pure over injected deps so tests can
 * drive it with a scripted SDK stream.
 */
import { buildParams, noSystemRole, DEFAULT_MODEL, type ClientLike, type Env, type SseEvent, type ErrorCode } from './anthropic';
import { localStep, relayStep, type StepResult } from './upstream';
import { validateTurn, stepsSinceUser, MAX_BODY_BYTES } from './validate';
import { checkQuota, recordStep } from './quota';
import { MODES } from './prompt/modes';

export const PROTOCOL = 2;
export const DEVICE_ID = /^dev_[a-f0-9]{24}$/;
export const HEARTBEAT_MS = 10_000;
const ALWAYS_ALLOWED = new Set(['capacitor://localhost', 'http://localhost', 'https://localhost', 'ionic://localhost']);

export interface Deps {
  makeClient(env: Env): ClientLike;
  now(): number;
  requestId(): string;
  waitUntil?(p: Promise<unknown>): void;
  heartbeatMs?: number;
  idleMs?: number;
}

export function corsHeaders(origin: string | null, env: Env): Record<string, string> {
  const extra = (env.ALLOWED_ORIGINS ?? '').split(',').map(s => s.trim()).filter(Boolean);
  const ok = !origin || ALWAYS_ALLOWED.has(origin) || extra.includes(origin) || /^https?:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/(127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin);
  const h: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, x-escobar-device',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (ok) h['Access-Control-Allow-Origin'] = origin ?? '*';
  return h;
}

const json = (status: number, body: unknown, cors: Record<string, string>, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...cors, ...extra } });
const fail = (status: number, code: ErrorCode, message: string, cors: Record<string, string>, retryAfter?: number) =>
  json(status, { t: 'error', code, message, ...(retryAfter ? { retryAfter } : {}) }, cors, retryAfter ? { 'retry-after': String(retryAfter) } : {});

export async function handle(req: Request, env: Env, deps: Deps): Promise<Response> {
  const url = new URL(req.url);
  const origin = req.headers.get('origin');
  const cors = corsHeaders(origin, env);
  if (origin && !('Access-Control-Allow-Origin' in cors)) return new Response('forbidden origin', { status: 403 });
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (url.pathname === '/health' && req.method === 'GET') {
    return json(200, { ok: true, protocol: PROTOCOL, model: env.MODEL || DEFAULT_MODEL, modes: MODES, quotas: !!(env.QUOTA_DO || env.QUOTA), relay: !!env.UPSTREAM, key: !!env.ANTHROPIC_API_KEY }, cors);
  }
  if (url.pathname !== '/v2/turn') return json(404, { t: 'error', code: 'invalid', message: 'not found' }, cors);
  if (req.method !== 'POST') return fail(405, 'invalid', 'use POST', cors);
  const device = req.headers.get('x-escobar-device') ?? '';
  if (!DEVICE_ID.test(device)) return fail(400, 'invalid', 'missing or malformed x-escobar-device', cors);
  if (!env.ANTHROPIC_API_KEY) return fail(503, 'upstream_auth', 'The coach is not set up correctly.', cors);

  const declared = Number(req.headers.get('content-length') ?? 'NaN');
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return fail(413, 'invalid', 'body over 3 MB', cors);
  const text = await req.text();
  const bytes = new TextEncoder().encode(text).byteLength;
  if (bytes > MAX_BODY_BYTES) return fail(413, 'invalid', 'body over 3 MB', cors);
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { return fail(400, 'invalid', 'body is not JSON', cors); }
  const v = validateTurn(raw, bytes);
  if (!v.ok) return fail(400, v.code, v.message, cors);
  const body = v.body;

  if (env.RATE) {
    try { const r = await env.RATE.limit({ key: device }); if (!r.success) return fail(429, 'rate', 'Slow down a little: too many requests this minute.', cors, 60); } catch { /* binding unavailable: allow */ }
  }
  const ip = req.headers.get('cf-connecting-ip') ?? 'unknown';
  // The Cloudflare location serving this request (e.g. HKG): the first thing to check for PL-20.
  const colo = (req as Request & { cf?: { colo?: string } }).cf?.colo ?? null;
  if (env.RATE_IP) {
    try { const r = await env.RATE_IP.limit({ key: ip }); if (!r.success) return fail(429, 'rate', 'Slow down a little: too many requests this minute.', cors, 60); } catch { /* binding unavailable: allow */ }
  }
  const keys = { device, ip };
  const now = deps.now();
  const q = await checkQuota(env, keys, now);
  if (!q.ok) return fail(429, 'quota', q.message, cors, q.retryAfter);

  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const enc = new TextEncoder();
  let closed = false;
  // Stop the model (and its billing) as soon as the app goes away (PL-05).
  const upstream = new AbortController();
  req.signal?.addEventListener('abort', () => upstream.abort());
  const gone = () => { closed = true; upstream.abort(); };
  writer.closed.catch(gone);
  const write = (s: string) => { if (!closed) void writer.write(enc.encode(s)).catch(gone); };
  const emit = (e: SseEvent) => write(`data: ${JSON.stringify(e)}\n\n`);
  const heartbeat = setInterval(() => write(': ping\n\n'), deps.heartbeatMs ?? HEARTBEAT_MS);

  const work = (async () => {
    const requestId = deps.requestId();
    emit({ t: 'start', requestId });
    const model = env.MODEL || DEFAULT_MODEL;
    const turnSteps = stepsSinceUser(body.messages) + 1;
    // PL-20: with the relay bound, the Anthropic call leaves from the US, not from this edge.
    const step = (p: ReturnType<typeof buildParams>): Promise<StepResult> => env.UPSTREAM
      ? relayStep(env, p, emit, { idleMs: deps.idleMs, signal: upstream.signal })
      : localStep(deps.makeClient(env), p, emit, { idleMs: deps.idleMs, signal: upstream.signal });
    let params = buildParams(body, env);
    let res = await step(params);
    if (res.systemRole && !res.emittedAny) {
      noSystemRole.add(model);
      params = buildParams(body, env, { foldSystem: true });
      res = await step(params);
    }
    if (res.error && !upstream.signal.aborted) {
      const { detail, ...shown } = res.error;
      if (detail || res.error.code.startsWith('upstream')) console.error(JSON.stringify({ requestId, code: res.error.code, detail: detail ?? null, colo }));
      emit({ t: 'error', ...shown, ...(detail ? { detail } : {}) });
    }
    const usage = (res.final?.usage ?? {}) as { input_tokens?: number; output_tokens?: number; cache_read_input_tokens?: number | null; cache_creation_input_tokens?: number | null };
    console.log(JSON.stringify({ requestId, colo, mode: body.mode, model: res.final?.model ?? model, stop_reason: res.final?.stop_reason ?? null, in: usage.input_tokens ?? 0, out: usage.output_tokens ?? 0, cacheRead: usage.cache_read_input_tokens ?? 0, cacheWrite: usage.cache_creation_input_tokens ?? 0, steps: turnSteps, ms: deps.now() - now }));
    if (res.final) {
      const p = recordStep(env, keys, now, { turnEnded: res.final.stop_reason !== 'tool_use', outputTokens: res.final.usage?.output_tokens ?? 0, turnSteps });
      if (deps.waitUntil) deps.waitUntil(p); else await p;
    }
  })().catch(() => emit({ t: 'error', code: 'upstream', message: 'The coach is unavailable right now.' })).finally(() => {
    clearInterval(heartbeat);
    closed = true;
    void writer.close().catch(() => {});
  });
  if (deps.waitUntil) deps.waitUntil(work);

  return new Response(readable, { status: 200, headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-store', 'x-accel-buffering': 'no', ...cors } });
}
