/**
 * Restore preparation. The saved workout log is authoritative: a sparse or
 * malformed trace may never shorten a workout, invent one, or attach to a
 * workout the restore does not contain. Everything is validated before any
 * replacement happens, so a bad file fails whole rather than in part.
 */
import type { ActiveSession, Session } from '@/core/models';
import type { HeartRateTrace } from './types';
import { summarize } from './metrics';

export function prepareHeartRateRestore(sessions: Session[], payload?: { version: 1; traces: HeartRateTrace[] }, active?: ActiveSession | null) {
  if (payload && (payload.version !== 1 || !Array.isArray(payload.traces))) throw new Error('Invalid heart-rate backup');
  const byId = new Map(sessions.map(session => [session.id, session]));
  const activeId = active?.id;
  const seen = new Set<string>();
  const traces = (payload?.traces ?? [])
    .filter(trace => trace && typeof trace.sessionId === 'string' && (byId.has(trace.sessionId) || (!!activeId && trace.sessionId === activeId)))
    .map(trace => {
      if (seen.has(trace.sessionId) || trace.version !== 1 || !Array.isArray(trace.samples)) throw new Error('Invalid heart-rate trace');
      seen.add(trace.sessionId);
      const session = byId.get(trace.sessionId);
      const startedAtEpochMs = Date.parse(session?.startedAt ?? active!.startedAt);
      const endedAtEpochMs = session
        ? Date.parse(session.endedAt)
        : trace.samples.reduce((last, s) => Math.max(last, s.receivedAtEpochMs + 1), startedAtEpochMs + 1);
      if (!Number.isFinite(startedAtEpochMs) || !Number.isFinite(endedAtEpochMs) || endedAtEpochMs <= startedAtEpochMs) throw new Error('Invalid workout times');
      for (const sample of trace.samples) {
        if (!sample || sample.source !== 'ble-heart-rate' || !Number.isInteger(sample.bpm) || sample.bpm < 20 || sample.bpm > 260 ||
            !Number.isSafeInteger(sample.receivedAtEpochMs) || sample.receivedAtEpochMs < 0 ||
            !Number.isSafeInteger(sample.receivedAtElapsedMs) || sample.receivedAtElapsedMs < 0) throw new Error('Invalid sample');
      }
      return {
        ...trace,
        startedAtEpochMs,
        // A restored active workout has not ended; its trace stays unfinished.
        endedAtEpochMs: session ? endedAtEpochMs : undefined,
        summary: summarize(trace.samples, startedAtEpochMs, endedAtEpochMs),
      };
    });
  // Only finished workouts take a summary into app state.
  const summaries = new Map(traces.filter(t => byId.has(t.sessionId)).map(trace => [trace.sessionId, trace.summary]));
  return {
    sessions: sessions.map(session => summaries.has(session.id) ? { ...session, heartRate: summaries.get(session.id)! } : session),
    payload: { version: 1 as const, traces, replace: true },
  };
}
