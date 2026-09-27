/**
 * Storage and rate limiting for anonymous error reports (docs/ERROR-REPORTS.md "Server").
 * One SQLite-backed Durable Object per UTC day, same sharding as QuotaCounter (src/quotaDO.ts):
 * a Durable Object runs one call at a time, so the synchronous KV API keeps the rate check and
 * the write free of `await` in between, and concurrent batches never race past the limit.
 */
import { DurableObject } from 'cloudflare:workers';
import type { Report } from './errorsValidate';

export const HOURLY_LIMIT = 30;
const RETENTION_MS = 90 * 86_400_000;

export type RateKeys = { installIds: string[]; ip: string };
export type IngestResult = { ok: true } | { ok: false; scope: 'installId' | 'ip' };
export type StoredReport = Report & { storedAt: number };

export class ErrorReports extends DurableObject {
  private alarmChecked = false;

  async ingest(keys: RateKeys, hourKey: string, reports: Report[], now: number): Promise<IngestResult> {
    const kv = this.ctx.storage.kv;
    const idCounts = keys.installIds.map(id => ({ id, n: kv.get<number>(`ri:${hourKey}:${id}`) ?? 0 }));
    if (idCounts.some(c => c.n >= HOURLY_LIMIT)) return { ok: false, scope: 'installId' };
    const ipN = kv.get<number>(`rp:${hourKey}:${keys.ip}`) ?? 0;
    if (ipN >= HOURLY_LIMIT) return { ok: false, scope: 'ip' };

    for (const c of idCounts) kv.put(`ri:${hourKey}:${c.id}`, c.n + 1);
    kv.put(`rp:${hourKey}:${keys.ip}`, ipN + 1);
    for (const r of reports) kv.put(`r:${now}:${crypto.randomUUID()}`, { ...r, storedAt: now } satisfies StoredReport);

    // Counters and reports are already written; the alarm only schedules this day's cleanup.
    if (this.alarmChecked) return { ok: true };
    this.alarmChecked = true;
    if ((await this.ctx.storage.getAlarm()) == null) await this.ctx.storage.setAlarm(now + RETENTION_MS);
    return { ok: true };
  }

  list(sinceTs: number): StoredReport[] {
    const out: StoredReport[] = [];
    for (const [key, value] of this.ctx.storage.kv.list<StoredReport>({ prefix: 'r:' })) {
      if (!key.startsWith('r:')) continue;
      if (value.storedAt >= sinceTs) out.push(value);
    }
    return out;
  }

  async alarm(): Promise<void> {
    await this.ctx.storage.deleteAll();
  }
}
