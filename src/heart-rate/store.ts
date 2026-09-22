/**
 * The app-side handle on the native recorder. Raw samples never enter app
 * state: only the compact per-session summary does. Everything here is a
 * no-op in the browser, where `heartRateNative()` returns null.
 */
import { computed, signal } from '@preact/signals';
import type { HeartRateSummary, Session } from '@/core/models';
import { flushSave, state, update } from '@/core/store';
import { heartRateNative, heartRateNativeAvailable } from './native';
import { freshness, twoMinuteWindow, validSample } from './metrics';
import type { HeartRateDevice, HeartRateSample, HeartRateStatus, HeartRateTrace } from './types';

const webStatus: HeartRateStatus = { available: false, state: 'unavailable', title: 'Android app required', detail: 'Live heart rate is unavailable in this browser.' };
export const heartRateStatus = signal<HeartRateStatus>(webStatus);
export const heartRateDevices = signal<HeartRateDevice[]>([]);
export const latestHeartRate = signal<HeartRateSample | null>(null);
export const recentHeartRate = signal<HeartRateSample[]>([]);
export const heartRateFreshness = computed(() => heartRateStatus.value.state === 'unavailable' ? 'unavailable' : freshness(latestHeartRate.value));

let initialized = false;

export async function initializeHeartRate(): Promise<void> {
  if (initialized) return;
  initialized = true;
  const native = heartRateNative();
  if (!native) { heartRateStatus.value = webStatus; return; }
  try {
    await native.addListener('heartRateStatus', status => { heartRateStatus.value = status; });
    await native.addListener('heartRateDevices', event => { heartRateDevices.value = event.devices; });
    await native.addListener('heartRateSample', sample => {
      if (sample.contactDetected === false) {
        // A failed contact reading is not a reading. It still enters the
        // window so the trace breaks the line instead of drawing through it.
        latestHeartRate.value = null;
        recentHeartRate.value = twoMinuteWindow([...recentHeartRate.value, sample], sample.receivedAtEpochMs);
        return;
      }
      if (!validSample(sample)) return;
      latestHeartRate.value = sample;
      recentHeartRate.value = twoMinuteWindow([...recentHeartRate.value, sample], sample.receivedAtEpochMs);
    });
  } catch {
    // Listener registration failed outright; let a later call try again.
    initialized = false;
    heartRateStatus.value = { available: true, state: 'lost', title: 'Sensor unavailable', detail: 'Open sensor setup and try again.' };
    return;
  }
  try {
    // Binding the Android service is asynchronous on a cold start.
    for (let attempt = 0; ; attempt++) {
      try { heartRateStatus.value = await native.getStatus(); break; }
      catch (error) { if (attempt === 5) throw error; await new Promise(resolve => setTimeout(resolve, 150)); }
    }
    const listed = await native.listDevices();
    heartRateDevices.value = listed.devices;
    await native.reconnectRemembered();
  } catch {
    heartRateStatus.value = { available: true, state: 'lost', title: 'Sensor unavailable', detail: 'Open sensor setup and try again.' };
  }
}

export async function requestHeartRatePermissions(): Promise<boolean> {
  const native = heartRateNative();
  if (!native) return false;
  return (await native.requestSensorPermissions()).granted;
}

export async function scanHeartRateDevices(): Promise<void> {
  const native = heartRateNative();
  if (!native) return;
  await native.startScan();
  heartRateStatus.value = { ...heartRateStatus.value, scanning: true, title: 'Scanning', detail: 'Keep heart-rate broadcast enabled on the watch.' };
}

export async function connectHeartRateDevice(deviceId: string): Promise<void> {
  const native = heartRateNative();
  if (!native) return;
  await native.connect({ deviceId });
}

export async function disconnectHeartRate(): Promise<void> { await heartRateNative()?.disconnect(); }

export async function beginHeartRateSession(sessionId: string, startedAt: string): Promise<void> {
  const startedAtEpochMs = Date.parse(startedAt);
  if (!sessionId || !Number.isFinite(startedAtEpochMs)) return;
  await heartRateNative()?.beginSession({ sessionId, startedAtEpochMs });
}

export async function finishHeartRateSession(sessionId: string, endedAt: string): Promise<HeartRateSummary | undefined> {
  const endedAtEpochMs = Date.parse(endedAt);
  if (!sessionId || !Number.isFinite(endedAtEpochMs)) return undefined;
  const result = await heartRateNative()?.finishSession({ sessionId, endedAtEpochMs });
  recentHeartRate.value = [];
  return result?.summary;
}

export async function discardHeartRateSession(sessionId: string): Promise<void> {
  if (!sessionId) return;
  await heartRateNative()?.discardSession({ sessionId });
  recentHeartRate.value = [];
}

export async function deleteHeartRateSession(sessionId: string): Promise<void> {
  if (!sessionId) return;
  await heartRateNative()?.deleteSession({ sessionId });
}

export async function getHeartRateTrace(sessionId: string): Promise<HeartRateTrace | null> {
  if (!sessionId) return null;
  return (await heartRateNative()?.getSessionTrace({ sessionId })) ?? null;
}

export async function exportAllHeartRate(): Promise<{ version: 1; traces: HeartRateTrace[] } | null> {
  const backup = await heartRateNative()?.exportAll();
  if (!backup) return null;
  const ids = new Set(state.value.sessions.map(session => session.id));
  const activeId = state.value.active?.id;
  if (activeId) ids.add(activeId);
  // A trace whose workout no longer exists is not exported: a backup must not
  // carry recordings the person can never see or delete from inside the app.
  return { ...backup, traces: backup.traces.filter(trace => ids.has(trace.sessionId)) };
}

export async function importAllHeartRate(payload: { version: 1; traces: HeartRateTrace[]; replace?: boolean }): Promise<number> {
  return (await heartRateNative()?.importAll({ payload }))?.imported ?? 0;
}

export async function resetAllHeartRate(): Promise<void> { await heartRateNative()?.resetAll(); recentHeartRate.value = []; }

/** Field comparison, so a differently-ordered native payload is not mistaken for a change. */
function sameSummary(a: HeartRateSummary | undefined, b: HeartRateSummary | undefined): boolean {
  if (!a || !b) return a === b;
  return a.metricsVersion === b.metricsVersion && a.sampleCount === b.sampleCount && a.capturedMs === b.capturedMs &&
    a.durationMs === b.durationMs && a.averageBpm === b.averageBpm && a.recordedPeakBpm === b.recordedPeakBpm &&
    a.coveragePct === b.coveragePct && a.firstSampleAt === b.firstSampleAt && a.lastSampleAt === b.lastSampleAt &&
    a.gapCount === b.gapCount;
}

let refreshing = false;
/** Rebuild compact summaries from durable native data after a restart or an older backup. */
export async function refreshHeartRateSummaries(): Promise<void> {
  const native = heartRateNative();
  if (!native || refreshing) return;
  refreshing = true;
  try {
    const recent = state.value.sessions.filter(s => Date.parse(s.endedAt) >= Date.now() - 42 * 86_400_000);
    // Keyed by id, not by object: sessions may be edited, replaced or deleted
    // while the native calls below are still in flight.
    const replacements = new Map<string, HeartRateSummary>();
    for (const session of recent) {
      const startedAtEpochMs = Date.parse(session.startedAt), endedAtEpochMs = Date.parse(session.endedAt);
      if (!Number.isFinite(startedAtEpochMs) || !Number.isFinite(endedAtEpochMs) || endedAtEpochMs <= startedAtEpochMs) continue;
      try {
        const { summary } = await native.getSessionSummary({ sessionId: session.id, startedAtEpochMs, endedAtEpochMs });
        if (summary && summary.sampleCount > 0) replacements.set(session.id, summary);
      } catch { /* The saved summary remains available if the service has not bound yet. */ }
    }
    if (!replacements.size) return;
    update(s => {
      let changed = false;
      const sessions = s.sessions.map((session: Session) => {
        const summary = replacements.get(session.id);
        // Re-read the session's own times: an edit during the awaits above may
        // have moved the window this summary was computed for.
        if (!summary || sameSummary(summary, session.heartRate)) return session;
        changed = true;
        return { ...session, heartRate: summary };
      });
      return changed ? { ...s, sessions } : s;
    });
    flushSave();
  } finally { refreshing = false; }
}

export { heartRateNativeAvailable };
