/**
 * Live-only heart capture for the active session (6.3). Keeps an in-memory
 * ring that survives tab switches but not restarts — the series before a
 * restart is lost, which is stated in the UI, not hidden. Nothing here
 * touches AppState directly except the one write at finish/discard.
 */
import { effect } from '@preact/signals';
import { latestMeasurement, watchStatus } from '@/native/watch';
import { state } from '@/core/store';
import { assertPhoneWorkoutWriter, workoutOwnership } from '@/core/workoutOwnership';
import { today } from '@/app/selectors';
import { downsampleToBuckets, setHeartFromWindow, sessionHeartSummary, hrMax, restingHr, bestObservedHrMax } from '@/brain/heart';
import { sessionEnergy } from '@/brain/energy';
import { storeSeries, exportHeart } from '@/core/heartStore';
import type { Session, SetHeart } from '@/core/models';

export interface RawSample { tSec: number; bpm: number; contact: boolean | null; receivedAtEpochMs: number; receivedAtElapsedMs: number }
let rawSamples: RawSample[] = [];
/** The last measurement recorded: the plugin can re-deliver one, and a re-run effect sees the same one again. */
let lastReceivedAt = -1;

export function resetHeartCapture(): void {
  assertPhoneWorkoutWriter();
  rawSamples = [];
  lastReceivedAt = -1;
}

export function discardHeartCapture(): void { assertPhoneWorkoutWriter(); rawSamples = []; lastReceivedAt = -1; }

/** Detached input checkpoint, not a claim of native/live capture after handover. */
export function captureHeartInputs(): RawSample[] { return rawSamples.map(s => ({ ...s })); }
export function restoreHeartInputs(samples: RawSample[]): void {
  if (workoutOwnership.peek() === 'web') throw new Error('Ownership reconciliation required');
  rawSamples = samples.map(s => ({ ...s }));
  lastReceivedAt = rawSamples.at(-1)?.receivedAtEpochMs ?? -1;
}

let capturing = false;

/** Call once, from main.tsx. Records a sample only while a session is active. */
export function startHeartCapture(): void {
  if (capturing) return;
  capturing = true;
  effect(() => {
    const m = latestMeasurement.value;
    // Only the measurement drives this effect; the session is read without subscribing (UI-21).
    const a = state.peek().active;
    if (!m || !a || workoutOwnership.peek() !== 'web' || m.receivedAtEpochMs === lastReceivedAt) return;
    // The time base is the session's own start, so a restart mid-session keeps the same clock.
    const tSec = Math.round((m.receivedAtEpochMs - Date.parse(a.startedAt)) / 1000);
    if (!Number.isFinite(tSec) || tSec < 0) return;
    lastReceivedAt = m.receivedAtEpochMs;
    rawSamples.push({ tSec, bpm: m.bpm, contact: m.contact, receivedAtEpochMs: m.receivedAtEpochMs, receivedAtElapsedMs: m.receivedAtElapsedMs });
  });
}

/** The most recent contact=true bpm reading, for F1.2's rest target ("preSetBpm"). */
export function latestLiveBpm(): number | undefined {
  for (let i = rawSamples.length - 1; i >= 0; i--) {
    const s = rawSamples[i]!;
    if (s.contact !== false) return s.bpm;
  }
  return undefined;
}

/** The last n contact=true bpm readings, oldest first, for restTarget()'s "3 consecutive settled samples". */
export function recentLiveBpms(n = 3): number[] {
  return rawSamples.filter(s => s.contact !== false).slice(-n).map(s => s.bpm);
}

/** setStartSec/setEndSec: seconds since the session started (see resetHeartCapture). */
export function heartForSet(setStartSec: number, setEndSec: number): SetHeart | undefined {
  if (!rawSamples.length) return undefined;
  const series = downsampleToBuckets(rawSamples);
  return setHeartFromWindow(series, setStartSec, setEndSec) ?? undefined;
}

/** Computes the session's heart summary and stores its series. Returns the session unchanged when nothing was captured. */
export function finishHeartCapture(session: Session): Session {
  if (!rawSamples.length) return session;
  const series = downsampleToBuckets(rawSamples);
  storeSeries(session.id, series);
  if (!series.length) return session;
  const s = state.value;
  const restBpm = restingHr(s.healthDays, s.profile, today.value);
  const priorAndThis = s.sessions.some(x => x.id === session.id) ? s.sessions : [...s.sessions, session];
  const observed = bestObservedHrMax(priorAndThis.map(x => ({ id: x.id, endedAt: x.endedAt })), { ...exportHeart(), [session.id]: series });
  const maxBpm = hrMax(s.profile, observed).bpm;
  const quality = Math.min(1, series.length / Math.max(1, Math.ceil(session.durationSec / 5)));
  const energy = sessionEnergy({ series, profile: s.profile, today: today.value, quality }) ?? undefined;
  const sets = session.exercises.flatMap(e => e.sets);
  const summary = sessionHeartSummary({ series, sessionSec: session.durationSec, hrMaxBpm: maxBpm, restingHrBpm: restBpm, sets, energy });
  if (!summary) return session;
  return { ...session, heart: { ...summary, source: 'ble', deviceName: watchStatus.value.deviceName } };
}
