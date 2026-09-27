/**
 * Wires the ERRORS_DO Durable Object to the /errors routes: which day's shard a batch or a
 * summary query belongs to, and aggregating stored reports by signature for the owner summary.
 */
import type { Env } from './anthropic';
import type { Report } from './errorsValidate';
import type { IngestResult } from './errorsDO';

export const dayKey = (now: number): string => new Date(now).toISOString().slice(0, 10);
export const hourKey = (now: number): string => new Date(now).toISOString().slice(0, 13);

const stub = (env: Env, day: string) => env.ERRORS_DO!.get(env.ERRORS_DO!.idFromName(day));

export async function ingestReports(env: Env, ip: string, reports: Report[], now: number): Promise<IngestResult> {
  const installIds = [...new Set(reports.map(r => r.installId))];
  return stub(env, dayKey(now)).ingest({ installIds, ip }, hourKey(now), reports, now);
}

export interface SignatureSummary { sig: string; kind: string; name: string; message: string; count: number; installs: number }
export interface Summary { since: string; until: string; signatures: SignatureSummary[] }

/** New signatures (and their counts and distinct installs) seen in the last 24 hours. */
export async function summarize(env: Env, now: number): Promise<Summary> {
  const since = now - 24 * 3_600_000;
  const days = new Set([dayKey(now), dayKey(since)]);
  const lists = await Promise.all([...days].map(d => stub(env, d).list(since)));
  const bySig = new Map<string, { kind: string; name: string; message: string; count: number; installs: Set<string> }>();
  for (const list of lists) {
    for (const r of list) {
      const e = bySig.get(r.sig) ?? { kind: r.kind, name: r.name, message: r.message, count: 0, installs: new Set<string>() };
      e.count += r.count;
      e.installs.add(r.installId);
      bySig.set(r.sig, e);
    }
  }
  const signatures = [...bySig.entries()].map(([sig, e]) => ({ sig, kind: e.kind, name: e.name, message: e.message, count: e.count, installs: e.installs.size }));
  return { since: new Date(since).toISOString(), until: new Date(now).toISOString(), signatures };
}
