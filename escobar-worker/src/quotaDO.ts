/**
 * Daily quota counters (PL-01, PL-07): one SQLite-backed Durable Object per UTC day.
 * A Durable Object runs one call at a time, and the synchronous KV API keeps every
 * read-modify-write free of `await`, so concurrent turns never lose an update.
 */
import { DurableObject } from 'cloudflare:workers';

export type Limits = { device: { turns: number; steps: number; out: number }; ip: { turns: number }; global: { steps: number; out: number } };
export type QuotaKeys = { device: string; ip: string };
export type QuotaDelta = { steps: number; out: number; turns: number };
export type QuotaCheck = { ok: true } | { ok: false; scope: 'device' | 'ip' | 'global' };

type DeviceRow = { turns: number; steps: number; out: number };
type IpRow = { turns: number };
type GlobalRow = { steps: number; out: number };

const RETENTION_MS = 3 * 86_400_000;

export class QuotaCounter extends DurableObject {
  private alarmChecked = false;

  check(keys: QuotaKeys, lim: Limits): QuotaCheck {
    const kv = this.ctx.storage.kv;
    const d = kv.get<DeviceRow>(`d:${keys.device}`) ?? { turns: 0, steps: 0, out: 0 };
    if (d.turns >= lim.device.turns || d.steps >= lim.device.steps || d.out >= lim.device.out) return { ok: false, scope: 'device' };
    const i = kv.get<IpRow>(`i:${keys.ip}`) ?? { turns: 0 };
    if (i.turns >= lim.ip.turns) return { ok: false, scope: 'ip' };
    const g = kv.get<GlobalRow>('g') ?? { steps: 0, out: 0 };
    if (g.steps >= lim.global.steps || g.out >= lim.global.out) return { ok: false, scope: 'global' };
    return { ok: true };
  }

  async add(keys: QuotaKeys, delta: QuotaDelta): Promise<void> {
    const kv = this.ctx.storage.kv;
    const d = kv.get<DeviceRow>(`d:${keys.device}`) ?? { turns: 0, steps: 0, out: 0 };
    kv.put(`d:${keys.device}`, { turns: d.turns + delta.turns, steps: d.steps + delta.steps, out: d.out + delta.out });
    const i = kv.get<IpRow>(`i:${keys.ip}`) ?? { turns: 0 };
    kv.put(`i:${keys.ip}`, { turns: i.turns + delta.turns });
    const g = kv.get<GlobalRow>('g') ?? { steps: 0, out: 0 };
    kv.put('g', { steps: g.steps + delta.steps, out: g.out + delta.out });
    // Counters are already written; the alarm only schedules this day's cleanup.
    if (this.alarmChecked) return;
    this.alarmChecked = true;
    if (await this.ctx.storage.getAlarm() == null) await this.ctx.storage.setAlarm(Date.now() + RETENTION_MS);
  }

  async alarm(): Promise<void> {
    await this.ctx.storage.deleteAll();
  }
}
