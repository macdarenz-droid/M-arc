/**
 * Heart-rate aggregates (F1.1, F1.6). Pure: takes the downsampled 5-second
 * series from heartStore (6.3) and plain profile/set data, returns plain
 * numbers. The live in-memory ring, freshness state machine and storage
 * live in slices/workout/heart.ts and core/heartStore.ts, not here.
 */
import type { Profile, SessionHeart, SetHeart, SessionEnergy } from '@/core/models';

export type HrMaxSource = 'override' | 'observed' | 'tanaka' | 'default';
export interface HrMaxResult { bpm: number; source: HrMaxSource }

/** A point earlier than 12 months keeps counting as observed, but decays 25% of the way back toward Tanaka. */
const OBSERVED_MAX_STALE_MONTHS = 12;

/**
 * `observedMax`, when given, is the best plateau found by `observedHrMaxFromSeries`
 * across the user's sessions, with the timestamp it was recorded at.
 * hrMaxOverride > observed max (decayed toward Tanaka past 12 months) > Tanaka > 190 default.
 */
export function hrMax(profile: Profile, observedMax?: { bpm: number; atMs: number } | null, nowMs = Date.now()): HrMaxResult {
  if (profile.hrMaxOverride) return { bpm: Math.round(profile.hrMaxOverride), source: 'override' };
  const age = profile.birthYear ? new Date(nowMs).getFullYear() - profile.birthYear : null;
  const tanaka = age != null ? 208 - 0.7 * age : null;
  if (observedMax && observedMax.bpm >= 150) {
    const monthsOld = (nowMs - observedMax.atMs) / (30.44 * 86_400_000);
    if (monthsOld <= OBSERVED_MAX_STALE_MONTHS) return { bpm: Math.round(observedMax.bpm), source: 'observed' };
    if (tanaka != null) return { bpm: Math.round(observedMax.bpm + (tanaka - observedMax.bpm) * 0.25), source: 'observed' };
    return { bpm: Math.round(observedMax.bpm), source: 'observed' };
  }
  if (tanaka != null) return { bpm: Math.round(tanaka), source: 'tanaka' };
  return { bpm: 190, source: 'default' };
}

/** Downsamples raw per-sample readings into 5-second buckets: the median bpm of each bucket, contact=true only. */
export function downsampleToBuckets(samples: Array<{ tSec: number; bpm: number; contact?: boolean | null }>, bucketSec = 5): Array<[number, number]> {
  const buckets = new Map<number, number[]>();
  for (const s of samples) {
    if (s.contact === false || !(s.bpm > 0)) continue;
    const b = Math.floor(s.tSec / bucketSec) * bucketSec;
    const list = buckets.get(b);
    if (list) list.push(s.bpm); else buckets.set(b, [s.bpm]);
  }
  return [...buckets.entries()].sort((a, b) => a[0] - b[0]).map(([t, bpms]) => {
    const sorted = [...bpms].sort((a, b) => a - b);
    return [t, sorted[Math.floor(sorted.length / 2)]!] as [number, number];
  });
}

/**
 * A validated max within one session's series: 5+ consecutive 5-second points within 3 bpm
 * of each other (a plateau), reached by an ascending run into it (a ramp), value <= 220.
 * Anything else (a lone spike, a plateau reached by a drop) is rejected as noise.
 */
export function observedHrMaxFromSeries(series: Array<[number, number]>): number | null {
  const bpms = series.map(p => p[1]);
  for (let i = 0; i + 4 < bpms.length; i++) {
    const window = bpms.slice(i, i + 5);
    const plateau = Math.max(...window) - Math.min(...window) <= 3;
    if (!plateau) continue;
    const plateauMax = Math.max(...window);
    if (plateauMax > 220) continue;
    const rampedIn = i === 0 || bpms[i - 1]! < plateauMax;
    if (rampedIn) return Math.round(window.reduce((a, b) => a + b, 0) / window.length);
  }
  return null;
}

/** 7-day median of healthDays' restingHr, or the manual override. Never inferred from a session. */
export function restingHr(healthDays: Array<{ day: string; restingHr?: number }>, profile: Profile, today: string): number | null {
  if (profile.restingHrOverride) return Math.round(profile.restingHrOverride);
  const since = new Date(today); since.setDate(since.getDate() - 6);
  const sinceKey = since.toISOString().slice(0, 10);
  const values = healthDays.filter(d => d.day >= sinceKey && d.day <= today && d.restingHr != null).map(d => d.restingHr!).sort((a, b) => a - b);
  if (!values.length) return null;
  return Math.round(values[Math.floor(values.length / 2)]!);
}

/** Karvonen heart-rate-reserve boundaries at 50/60/70/80/90%, the lower edge of zones 1-5. Below b[0] is outside any zone. */
export function zones(hrMaxBpm: number, restingHrBpm: number): [number, number, number, number, number] {
  const reserve = Math.max(1, hrMaxBpm - restingHrBpm);
  const at = (pct: number) => Math.round(restingHrBpm + pct * reserve);
  return [at(0.5), at(0.6), at(0.7), at(0.8), at(0.9)];
}

/** -1 when below zone 1 (not counted in any zone), else 0-4 for zones 1-5. */
function zoneIndex(bpm: number, b: [number, number, number, number, number]): number {
  if (bpm < b[0]) return -1;
  return bpm < b[1] ? 0 : bpm < b[2] ? 1 : bpm < b[3] ? 2 : bpm < b[4] ? 3 : 4;
}

/** Share of the session's 5-second buckets that actually have a stored (live) sample. */
export function signalQuality(series: Array<[number, number]>, sessionSec: number): number {
  if (sessionSec <= 0) return 0;
  const expectedBuckets = Math.ceil(sessionSec / 5);
  if (expectedBuckets <= 0) return 0;
  return Math.min(1, series.length / expectedBuckets);
}

/** Peak/end/rest-start bpm for one set, from the stored series between its start and end (seconds into the session). */
export function setHeartFromWindow(series: Array<[number, number]>, setStartSec: number, setEndSec: number): SetHeart | null {
  const during = series.filter(([t]) => t >= setStartSec && t <= setEndSec);
  if (!during.length) return null;
  const peakBpm = Math.max(...during.map(([, bpm]) => bpm));
  const endBpm = during[during.length - 1]![1];
  const restStart = series.filter(([t]) => t >= setEndSec && t <= setEndSec + 10);
  const restStartBpm = restStart[0]?.[1];
  const after60 = series.filter(([t]) => t >= setEndSec + 55 && t <= setEndSec + 65);
  let hrr60: number | undefined;
  if (after60.length) {
    const sorted = after60.map(([, bpm]) => bpm).sort((a, b) => a - b);
    hrr60 = Math.round(endBpm - sorted[Math.floor(sorted.length / 2)]!);
  }
  return { peakBpm, endBpm, restStartBpm, hrr60 };
}

export interface SessionHeartInput {
  series: Array<[number, number]>;
  sessionSec: number;
  hrMaxBpm: number;
  restingHrBpm: number;
  sets: Array<{ heart?: SetHeart }>;
  energy?: SessionEnergy;
}

/** avg/max/min, zone seconds, coverage, HRR60 median from sets that have one. Null when nothing valid was recorded. */
export function sessionHeartSummary(input: SessionHeartInput): Omit<SessionHeart, 'source' | 'deviceName'> | null {
  const { series, sessionSec, hrMaxBpm, restingHrBpm, sets, energy } = input;
  if (!series.length) return null;
  const bpms = series.map(([, bpm]) => bpm);
  const zoneSec: [number, number, number, number, number] = [0, 0, 0, 0, 0];
  const boundaries = zones(hrMaxBpm, restingHrBpm);
  for (const bpm of bpms) { const z = zoneIndex(bpm, boundaries); if (z >= 0) zoneSec[z] = (zoneSec[z] ?? 0) + 5; }
  const hrr60s = sets.map(s => s.heart?.hrr60).filter((x): x is number => x != null).sort((a, b) => a - b);
  const hrr60Median = hrr60s.length ? hrr60s[Math.floor(hrr60s.length / 2)] : undefined;
  return {
    samples: series.length,
    avgBpm: Math.round(bpms.reduce((a, b) => a + b, 0) / bpms.length),
    maxBpm: Math.max(...bpms),
    minBpm: Math.min(...bpms),
    hrr60Median,
    zoneSec,
    energy,
    coverage: signalQuality(series, sessionSec),
  };
}

/** The best validated observed max across stored session series, with when it was recorded, for hrMax(). */
export function bestObservedHrMax(sessions: Array<{ id: string; endedAt: string }>, seriesById: Record<string, Array<[number, number]>>): { bpm: number; atMs: number } | null {
  let best: { bpm: number; atMs: number } | null = null;
  for (const s of sessions) {
    const series = seriesById[s.id];
    if (!series?.length) continue;
    const observed = observedHrMaxFromSeries(series);
    if (observed != null && (!best || observed > best.bpm)) best = { bpm: observed, atMs: new Date(s.endedAt).getTime() };
  }
  return best;
}
