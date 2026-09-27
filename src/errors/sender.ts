/**
 * 7.5: sends queued reports to POST {workerBase}/errors. 204 clears what was sent, 400/413 drop
 * it for good, anything else (429, 5xx, a thrown fetch) keeps the queue and backs off — at least
 * a minute, doubling, capped at 6 hours.
 */
import { BASE_BACKOFF_MS, loadQueueState, MAX_BACKOFF_MS, removeByIds, setBackoff, type QueuedReport } from './queue';
import type { Report } from './types';

const MAX_BODY_BYTES = 8 * 1024;

function byteLength(s: string): number {
  try { return new TextEncoder().encode(s).length; } catch { return s.length; }
}

/** Packs as many of the oldest-first reports as fit under MAX_BODY_BYTES. */
function packBatch(reports: readonly QueuedReport[]): QueuedReport[] {
  const batch: QueuedReport[] = [];
  for (const r of reports) {
    const wire = batch.map(stripId).concat(stripId(r));
    if (byteLength(JSON.stringify({ v: 1, reports: wire })) > MAX_BODY_BYTES && batch.length > 0) break;
    batch.push(r);
  }
  return batch;
}

function stripId(r: QueuedReport): Report {
  const { id: _id, ...rest } = r;
  return rest;
}

export interface SendOptions {
  workerBase: string;
  fetchImpl?: typeof fetch;
  storage?: Parameters<typeof loadQueueState>[0];
  now?: number;
}

/** One attempt at draining the queue. Safe to call anytime — it no-ops when empty, offline, or
 * still inside its backoff window. Never throws. */
export async function trySend(opts: SendOptions): Promise<void> {
  try {
    const now = opts.now ?? Date.now();
    const state = loadQueueState(opts.storage);
    if (state.reports.length === 0) return;
    if (now < state.nextAttemptAt) return;
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return;

    const batch = packBatch(state.reports);
    if (batch.length === 0) return;
    const f = opts.fetchImpl ?? fetch;
    const url = `${opts.workerBase.replace(/\/$/, '')}/errors`;
    let res: Response;
    try {
      res = await f(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ v: 1, reports: batch.map(stripId) }),
      });
    } catch {
      backOff(state.backoffMs, now, opts.storage);
      return;
    }

    if (res.status === 204) {
      removeByIds(batch.map(r => r.id), opts.storage);
      setBackoff(0, BASE_BACKOFF_MS, opts.storage);
      const remaining = loadQueueState(opts.storage).reports.length;
      if (remaining > 0) await trySend(opts);
      return;
    }
    if (res.status === 400 || res.status === 413) {
      removeByIds(batch.map(r => r.id), opts.storage);
      return;
    }
    backOff(state.backoffMs, now, opts.storage);
  } catch {
    /* a failure inside the reporter must never throw into the app */
  }
}

function backOff(currentBackoffMs: number, now: number, storage: SendOptions['storage']): void {
  const nextBackoff = Math.min(currentBackoffMs * 2, MAX_BACKOFF_MS);
  setBackoff(now + currentBackoffMs, nextBackoff, storage);
}
