/**
 * Recognises how a set or session was actually logged, and how much its
 * timing can be trusted. Content (exercise, kg, reps, effort) is trusted at
 * every fidelity; timing is trusted only for a live commit in a live
 * session. Pure: no store, no clock reads other than what is passed in.
 */
import type { LoadUnit, LoggedSet, Session, SessionLogging, SetFidelity, SetFlag } from '@/core/models';
import { KG_PER_LB } from '@/core/units';
import { dayKey } from '@/core/dates';

/** A commit is "delayed" (timing not trusted) when it is part of a burst or outside a plausible rest/set gap. */
/** A commit gap in this range (seconds) reads as logged live; 3+ commits within 15 s is a burst. */
export const LIVE_GAP_SEC = [20, 720] as const;
export const BURST_COUNT = 3;
export const COMPRESSED_SEC_PER_SET = 40;

export function classifySetFidelity(gapSec: number | null, burstCount: number): SetFidelity {
  if (burstCount >= BURST_COUNT) return 'delayed';
  if (gapSec == null) return 'live'; // first set of the session
  if (gapSec >= LIVE_GAP_SEC[0] && gapSec <= LIVE_GAP_SEC[1]) return 'live';
  return 'delayed';
}

/** A session logged in far less time than its working-set count could plausibly take. */
export function isCompressed(workingSetCount: number, loggedDurationSec: number, burstShare: number): boolean {
  return loggedDurationSec < workingSetCount * COMPRESSED_SEC_PER_SET || burstShare >= 0.6;
}

export type SessionOrigin = 'live' | 'retro' | 'legacy';

function sessionMode(origin: SessionOrigin, compressed: boolean, liveShare: number): SessionLogging['mode'] {
  if (origin === 'legacy') return 'legacy';
  if (origin === 'retro') return 'retro';
  if (compressed) return 'retro';
  if (liveShare >= 0.7) return 'live';
  if (liveShare >= 0.3) return 'mixed';
  return 'retro';
}

/** Built once a live session finishes, from the fidelity of every set that was committed. */
export function liveSessionLogging(input: {
  setFidelities: SetFidelity[];
  startedAt: string;
  endedAt: string;
  loggedDurationSec: number;
  workingSetCount: number;
}): SessionLogging {
  const { setFidelities, startedAt, endedAt, loggedDurationSec, workingSetCount } = input;
  const liveShare = setFidelities.length ? setFidelities.filter(f => f === 'live').length / setFidelities.length : 0;
  const burstShare = setFidelities.length ? setFidelities.filter(f => f === 'delayed').length / setFidelities.length : 0;
  const compressed = isCompressed(workingSetCount, loggedDurationSec, burstShare);
  const mode = sessionMode('live', compressed, liveShare);
  const flags: string[] = [];
  if (compressed) flags.push('compressed');
  if (burstShare >= 0.3 && !compressed) flags.push('burst');
  const trainedDay = dayKey(startedAt);
  const loggedDay = dayKey(endedAt);
  if (trainedDay !== loggedDay) flags.push('midnight_crossing');
  return {
    mode,
    trainedAt: startedAt,
    trainedEndAt: endedAt,
    loggedAt: endedAt,
    timeSource: 'timer',
    liveShare,
    timingTrusted: mode === 'live' && liveShare >= 0.7,
    contentConfidence: mode === 'retro' ? 'medium' : 'high',
    flags,
  };
}

/** Built by the "when did you train?" sheet, or the "Log a past session" flow. */
export function retroSessionLogging(trainedAt: string, trainedEndAt: string, timeSource: SessionLogging['timeSource'], loggedAt = new Date().toISOString()): SessionLogging {
  const trainedDay = dayKey(trainedAt);
  const loggedDay = dayKey(loggedAt);
  return {
    mode: 'retro',
    trainedAt,
    trainedEndAt,
    loggedAt,
    timeSource,
    liveShare: 0,
    timingTrusted: false,
    contentConfidence: 'medium',
    flags: trainedDay !== loggedDay ? ['midnight_crossing'] : [],
  };
}

/** Lives in core so the store and the migration need not import the brain (RG-12). */
export { legacySessionLogging } from '@/core/sessionLogging';

/** kg more than 25% above the exercise's recent best, or a physically implausible absolute load. */
export function implausibleLoad(kg: number, recentBestKg: number | null): boolean {
  if (kg > 500) return true;
  return recentBestKg != null && recentBestKg > 0 && kg > recentBestKg * 1.25;
}

/** Reps beyond what is plausible: 50 in general, 30 for a main lift loaded above 70% of e1RM. */
export function implausibleReps(reps: number, isHeavyMainLift: boolean): boolean {
  return reps > (isHeavyMainLift ? 30 : 50);
}

/** A load within 5% of 2.2x or 0.45x the exercise's recent best: kg and lb likely got mixed up. */
export function unitSuspect(kg: number, recentBestKg: number | null): boolean {
  if (!recentBestKg || recentBestKg <= 0 || kg <= 0) return false;
  const ratio = kg / recentBestKg;
  return Math.abs(ratio - 2.2) / 2.2 <= 0.05 || Math.abs(ratio - 0.45) / 0.45 <= 0.05;
}

/**
 * The reading `unitSuspect` implies (§25.4): a load about 2.2× the usual was probably
 * the right number typed as kg when the plate said lb; about 0.45× was probably kg
 * typed into an lb field. Null when the load is not suspect.
 */
export function suspectAlternative(kg: number, recentBestKg: number | null): { unit: LoadUnit; value: number; kg: number } | null {
  if (!unitSuspect(kg, recentBestKg)) return null;
  const ratio = kg / recentBestKg!;
  if (ratio > 1) return { unit: 'lb', value: Math.round(kg * 100) / 100, kg: Math.round(kg * KG_PER_LB * 1000) / 1000 };
  const value = Math.round((kg / KG_PER_LB) * 10) / 10;
  return { unit: 'kg', value, kg: value };
}

/** Same day, same exercises in the same order, same load and reps on every set: an accidental double-save. */
export function isDuplicateSession(a: Session, b: Session): boolean {
  if (a.day !== b.day || a.exercises.length !== b.exercises.length) return false;
  return a.exercises.every((ex, i) => {
    const other = b.exercises[i];
    if (!other || other.exerciseId !== ex.exerciseId || other.sets.length !== ex.sets.length) return false;
    return ex.sets.every((s, j) => s.kg === other.sets[j]?.kg && s.reps === other.sets[j]?.reps);
  });
}

export function futureTime(atIso: string | undefined, nowMs: number): boolean {
  return !!atIso && new Date(atIso).getTime() > nowMs;
}

/** All plausibility flags for one set, given the exercise's recent best load. */
export function flagsForSet(set: LoggedSet, recentBestKg: number | null, isHeavyMainLift: boolean, nowMs = Date.now()): SetFlag[] {
  const flags: SetFlag[] = [];
  const kg = set.kg ?? 0;
  const reps = set.reps ?? 0;
  if (kg > 0 && implausibleLoad(kg, recentBestKg)) flags.push('implausible_load');
  if (reps > 0 && implausibleReps(reps, isHeavyMainLift)) flags.push('implausible_reps');
  if (kg > 0 && unitSuspect(kg, recentBestKg)) flags.push('unit_suspect');
  if (futureTime(set.at, nowMs)) flags.push('future_time');
  return flags;
}
