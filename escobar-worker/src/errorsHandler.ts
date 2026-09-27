/**
 * POST /errors and GET /errors/summary (docs/ERROR-REPORTS.md "Server"). Reuses the Escobar
 * Worker's CORS rules (src/handler.ts): only the Capacitor origin and the allowed web origin,
 * never a wildcard with credentials (no Access-Control-Allow-Credentials header is ever sent).
 * Report bodies are never logged.
 */
import { corsHeaders } from './handler';
import type { Env } from './anthropic';
import { validateBatch, MAX_ERRORS_BODY_BYTES } from './errorsValidate';
import { ingestReports, summarize } from './errors';

export interface ErrorsDeps { now(): number }

const json = (status: number, body: unknown, cors: Record<string, string>) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...cors } });

/** The request body, read in chunks and stopped at `max` bytes (null when over). */
async function readCapped(req: Request, max: number): Promise<{ text: string; bytes: number } | null> {
  if (!req.body) return { text: '', bytes: 0 };
  const reader = req.body.getReader();
  const parts: Uint8Array[] = [];
  let bytes = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > max) { void reader.cancel().catch(() => {}); return null; }
    parts.push(value);
  }
  const all = new Uint8Array(bytes);
  let at = 0;
  for (const p of parts) { all.set(p, at); at += p.byteLength; }
  return { text: new TextDecoder().decode(all), bytes };
}

export async function handleErrors(req: Request, env: Env, deps: ErrorsDeps): Promise<Response> {
  const url = new URL(req.url);
  const origin = req.headers.get('origin');
  const cors = corsHeaders(origin, env);
  if (origin && !('Access-Control-Allow-Origin' in cors)) return new Response('forbidden origin', { status: 403 });
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

  if (url.pathname === '/errors/summary' && req.method === 'GET') {
    const token = env.ERRORS_SUMMARY_TOKEN;
    if (!token || req.headers.get('authorization') !== `Bearer ${token}`) return json(401, { error: 'unauthorized' }, cors);
    if (!env.ERRORS_DO) return json(503, { error: 'not configured' }, cors);
    return json(200, await summarize(env, deps.now()), cors);
  }

  if (url.pathname === '/errors' && req.method === 'POST') {
    if (!env.ERRORS_DO) return json(503, { error: 'not configured' }, cors);
    const declared = Number(req.headers.get('content-length') ?? 'NaN');
    if (Number.isFinite(declared) && declared > MAX_ERRORS_BODY_BYTES) return json(413, { error: 'body over 8 KB' }, cors);
    const read = await readCapped(req, MAX_ERRORS_BODY_BYTES);
    if (!read) return json(413, { error: 'body over 8 KB' }, cors);
    let raw: unknown;
    try { raw = JSON.parse(read.text); } catch { return json(400, { error: 'body is not JSON' }, cors); }
    const v = validateBatch(raw);
    if (!v.ok) return json(400, { error: v.message }, cors);
    const ip = req.headers.get('cf-connecting-ip') ?? 'unknown';
    const result = await ingestReports(env, ip, v.body.reports, deps.now());
    if (!result.ok) return json(429, { error: 'rate limited' }, cors);
    return new Response(null, { status: 204, headers: cors });
  }

  return json(404, { error: 'not found' }, cors);
}
