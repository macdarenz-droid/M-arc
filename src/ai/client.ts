/**
 * The small, generic pieces every remote-AI feature shares: a device id,
 * building the proxy's URL, and a POST with a timeout that never throws —
 * it returns a result the caller checks. Nothing here knows about coach
 * reports, exercises or notes; each feature builds its own payload, calls
 * `postJson`, and validates its own reply shape before trusting it.
 */

export function newDeviceId(): string {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  const uuid = c && 'randomUUID' in c ? c.randomUUID().replace(/-/g, '') : Math.random().toString(36).slice(2) + Date.now().toString(36);
  return `dev_${uuid.slice(0, 24)}`;
}

export function endpoint(url: string, path: string): string {
  return `${url.trim().replace(/\/+$/, '')}${path}`;
}

export type PostResult<T> = { ok: true; body: T } | { ok: false; error: string };

export interface PostOptions {
  url: string;
  path: string;
  deviceId: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

interface ErrorBody { error?: unknown }

/** POST a payload to the user's proxy. Never throws: a timeout, a network failure and a proxy-side error all come back as `{ ok: false, error }`. */
export async function postJson<TPayload, TReply>(payload: TPayload, opts: PostOptions): Promise<PostResult<TReply>> {
  const f = opts.fetchImpl ?? globalThis.fetch;
  if (!f) return { ok: false, error: 'No network available.' };
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), opts.timeoutMs ?? 20_000) : null;
  try {
    const res = await f(endpoint(opts.url, opts.path), {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-marc-device': opts.deviceId }, body: JSON.stringify(payload),
      ...(controller ? { signal: controller.signal } : {}),
    });
    let body: unknown = {};
    try { body = await res.json(); } catch { /* non-JSON error body */ }
    if (!res.ok) return { ok: false, error: typeof (body as ErrorBody)?.error === 'string' ? (body as ErrorBody).error as string : `The proxy answered ${res.status}.` };
    return { ok: true, body: body as TReply };
  } catch (err) {
    const aborted = (err as { name?: string }).name === 'AbortError';
    return { ok: false, error: aborted ? 'The proxy took too long to answer.' : 'Could not reach the proxy. Check the address and your connection.' };
  } finally {
    if (timer) clearTimeout(timer);
  }
}
