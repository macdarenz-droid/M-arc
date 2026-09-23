/**
 * Daily quotas (§12.5, PL-01, PL-07): per device turns, steps and output tokens, per IP turns,
 * and global steps and output tokens. Backends in order: the QUOTA_DO Durable Object (atomic,
 * counts every step), the QUOTA KV namespace (soft; written once per user turn to stay inside
 * KV's write limits), or none.
 */
import type { Env } from './anthropic';
import type { Limits, QuotaKeys } from './quotaDO';

export interface DeviceUsage { turns: number; steps: number; out: number }
export const DEFAULTS = { turns: 80, steps: 400, out: 400_000, ipTurns: 300, globalSteps: 20_000, globalOut: 3_000_000 };

const num = (v: string | undefined, d: number): number => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : d; };
export const limits = (env: Env): Limits => ({
  device: { turns: num(env.MAX_TURNS_PER_DEVICE, DEFAULTS.turns), steps: num(env.MAX_STEPS_PER_DEVICE, DEFAULTS.steps), out: num(env.MAX_OUTPUT_PER_DEVICE, DEFAULTS.out) },
  ip: { turns: num(env.MAX_TURNS_PER_IP, DEFAULTS.ipTurns) },
  global: { steps: num(env.MAX_STEPS_TOTAL, DEFAULTS.globalSteps), out: num(env.MAX_OUTPUT_TOTAL, DEFAULTS.globalOut) },
});

export const dayKey = (now: number): string => new Date(now).toISOString().slice(0, 10);
const deviceKey = (device: string, day: string) => `d:${day}:${device}`;
const ipKey = (ip: string, day: string) => `i:${day}:${ip}`;
const globalKey = (day: string) => `g:${day}`;

const DEVICE_MESSAGE = "That's today's coaching limit. Escobar is resting and back after midnight UTC; your notes still update.";
const GLOBAL_MESSAGE = 'Escobar is resting for today. Your notes still update.';

async function read<T>(kv: KVNamespace, key: string, fallback: T): Promise<T> {
  try { return ((await kv.get(key, 'json')) as T | null) ?? fallback; } catch { return fallback; }
}

const counter = (env: Env, now: number) => env.QUOTA_DO!.get(env.QUOTA_DO!.idFromName(dayKey(now)));

/** Seconds until the next UTC midnight: when the daily counters reset. */
export const resetInSec = (now: number): number => Math.ceil((Date.UTC(new Date(now).getUTCFullYear(), new Date(now).getUTCMonth(), new Date(now).getUTCDate() + 1) - now) / 1000);

export type QuotaResult = { ok: true } | { ok: false; message: string; retryAfter: number };

export async function checkQuota(env: Env, keys: QuotaKeys, now: number): Promise<QuotaResult> {
  const lim = limits(env);
  const retryAfter = resetInSec(now);
  if (env.QUOTA_DO) {
    try {
      const r = await counter(env, now).check(keys, lim);
      if (r.ok) return { ok: true };
      return { ok: false, message: r.scope === 'global' ? GLOBAL_MESSAGE : DEVICE_MESSAGE, retryAfter };
    } catch (e) { console.error('quota check failed:', String(e)); return { ok: true }; }
  }
  if (!env.QUOTA) return { ok: true };
  const day = dayKey(now);
  const [d, i, g] = await Promise.all([
    read<DeviceUsage>(env.QUOTA, deviceKey(keys.device, day), { turns: 0, steps: 0, out: 0 }),
    read<{ turns: number }>(env.QUOTA, ipKey(keys.ip, day), { turns: 0 }),
    read<{ steps: number; out?: number }>(env.QUOTA, globalKey(day), { steps: 0, out: 0 }),
  ]);
  if (d.turns >= lim.device.turns || d.steps >= lim.device.steps || d.out >= lim.device.out || i.turns >= lim.ip.turns) return { ok: false, message: DEVICE_MESSAGE, retryAfter };
  if (g.steps >= lim.global.steps || (g.out ?? 0) >= lim.global.out) return { ok: false, message: GLOBAL_MESSAGE, retryAfter };
  return { ok: true };
}

/**
 * Records one finished model step. The Durable Object counts it now: steps +1, its output
 * tokens, and a turn when it ends one. The KV fallback writes once per turn (`turnSteps` steps
 * and the last step's output), as before. Best-effort; never throws.
 */
export async function recordStep(env: Env, keys: QuotaKeys, now: number, step: { turnEnded: boolean; outputTokens: number; turnSteps: number }): Promise<void> {
  try {
    if (env.QUOTA_DO) {
      await counter(env, now).add(keys, { steps: 1, out: step.outputTokens, turns: step.turnEnded ? 1 : 0 });
      return;
    }
    if (!env.QUOTA || !step.turnEnded) return;
    const day = dayKey(now);
    const d = await read<DeviceUsage>(env.QUOTA, deviceKey(keys.device, day), { turns: 0, steps: 0, out: 0 });
    const i = await read<{ turns: number }>(env.QUOTA, ipKey(keys.ip, day), { turns: 0 });
    const g = await read<{ steps: number; out?: number }>(env.QUOTA, globalKey(day), { steps: 0, out: 0 });
    await Promise.all([
      env.QUOTA.put(deviceKey(keys.device, day), JSON.stringify({ turns: d.turns + 1, steps: d.steps + step.turnSteps, out: d.out + step.outputTokens }), { expirationTtl: 172_800 }),
      env.QUOTA.put(ipKey(keys.ip, day), JSON.stringify({ turns: i.turns + 1 }), { expirationTtl: 172_800 }),
      env.QUOTA.put(globalKey(day), JSON.stringify({ steps: g.steps + step.turnSteps, out: (g.out ?? 0) + step.outputTokens }), { expirationTtl: 172_800 }),
    ]);
  } catch (e) { console.error('quota write failed:', String(e)); }
}
