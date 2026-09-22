/**
 * Daily quotas (§12.5): per device turns, steps and output tokens, and a global step cap.
 * Counters are written once per user turn (on the step that ends it) to stay inside KV's
 * write limits; KV is eventually consistent, so the caps are soft by design.
 */
import type { Env } from './anthropic';

export interface DeviceUsage { turns: number; steps: number; out: number }
export const DEFAULTS = { turns: 80, steps: 400, out: 400_000, globalSteps: 20_000 };

const num = (v: string | undefined, d: number): number => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : d; };
export const limits = (env: Env) => ({
  turns: num(env.MAX_TURNS_PER_DEVICE, DEFAULTS.turns),
  steps: num(env.MAX_STEPS_PER_DEVICE, DEFAULTS.steps),
  out: num(env.MAX_OUTPUT_PER_DEVICE, DEFAULTS.out),
  globalSteps: num(env.MAX_STEPS_TOTAL, DEFAULTS.globalSteps),
});

export const dayKey = (now: number): string => new Date(now).toISOString().slice(0, 10);
const deviceKey = (device: string, day: string) => `d:${day}:${device}`;
const globalKey = (day: string) => `g:${day}`;

async function read<T>(kv: KVNamespace, key: string, fallback: T): Promise<T> {
  try { return ((await kv.get(key, 'json')) as T | null) ?? fallback; } catch { return fallback; }
}

/** Seconds until the next UTC midnight: when the daily counters reset. */
export const resetInSec = (now: number): number => Math.ceil((Date.UTC(new Date(now).getUTCFullYear(), new Date(now).getUTCMonth(), new Date(now).getUTCDate() + 1) - now) / 1000);

export async function checkQuota(env: Env, device: string, now: number): Promise<{ ok: true } | { ok: false; message: string; retryAfter: number }> {
  if (!env.QUOTA) return { ok: true };
  const day = dayKey(now);
  const lim = limits(env);
  const [d, g] = await Promise.all([read<DeviceUsage>(env.QUOTA, deviceKey(device, day), { turns: 0, steps: 0, out: 0 }), read<{ steps: number }>(env.QUOTA, globalKey(day), { steps: 0 })]);
  const retryAfter = resetInSec(now);
  if (d.turns >= lim.turns || d.steps >= lim.steps || d.out >= lim.out) return { ok: false, message: "That's today's coaching limit. Escobar is resting and back after midnight UTC; your notes still update.", retryAfter };
  if (g.steps >= lim.globalSteps) return { ok: false, message: 'Escobar is resting for today. Your notes still update.', retryAfter };
  return { ok: true };
}

/** Adds one finished turn: its steps and output tokens. Best-effort; never throws. */
export async function recordTurn(env: Env, device: string, now: number, steps: number, outputTokens: number): Promise<void> {
  if (!env.QUOTA) return;
  const day = dayKey(now);
  try {
    const d = await read<DeviceUsage>(env.QUOTA, deviceKey(device, day), { turns: 0, steps: 0, out: 0 });
    const g = await read<{ steps: number }>(env.QUOTA, globalKey(day), { steps: 0 });
    await Promise.all([
      env.QUOTA.put(deviceKey(device, day), JSON.stringify({ turns: d.turns + 1, steps: d.steps + steps, out: d.out + outputTokens }), { expirationTtl: 172_800 }),
      env.QUOTA.put(globalKey(day), JSON.stringify({ steps: g.steps + steps }), { expirationTtl: 172_800 }),
    ]);
  } catch { /* quota writes are best-effort */ }
}
