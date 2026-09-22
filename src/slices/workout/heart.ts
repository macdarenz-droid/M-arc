/**
 * Live-only heart capture for the active session (6.3). Keeps an in-memory
 * ring that survives tab switches but not restarts — the series before a
 * restart is lost, which is stated in the UI, not hidden. Nothing here
 * touches AppState directly except the one write at finish/discard.
 */
import { effect } from '@preact/signals';
import { latestMeasurement, watchStatus } from '@/native/watch';
import { active } from './session';
import { state } from '@/core/store';
import { today } from '@/app/selectors';
import { downsampleToBuckets, setHeartFromWindow, sessionHeartSummary, hrMax, restingHr, bestObservedHrMax } from '@/brain/heart';
import { sessionEnergy } from '@/brain/energy';
import { storeSeries, exportHeart } from '@/core/heartStore';
import type { Session, SetHeart } from '@/core/models';

interface RawSample { tSec: number; bpm: number; contact: boolean | null }
let rawSamples: RawSample[] = [];
let sessionStartMs = 0;

export function resetHeartCapture(startedAtIso: string): void {
  rawSamples = [];
  sessionStartMs = new Date(startedAtIso).getTime();
}

export function discardHeartCapture(): void { rawSamples = []; }

let capturing = false;

/** Call once, from main.tsx. Records a sample only while a session is active. */
export function startHeartCapture(): void {
  if (capturing) return;
  capturing = true;
  effect(() => {
    const m = latestMeasurement.value;
    if (!m || !active()) return;
    const tSec = Math.round((m.receivedAtEpochMs - sessionStartMs) / 1000);
    if (tSec < 0) return;
    rawSamples.push({ tSec, bpm: m.bpm, contact: m.contact });
  });
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
  const s = state.value;
  const restBpm = restingHr(s.healthDays, s.profile, today.value);
  if (restBpm == null || !series.length) return session;
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
