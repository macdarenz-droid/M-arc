/**
 * Heart-rate evidence: pure, deterministic, and free of prose.
 *
 * The donor implementation returned finished sentences from the brain. That
 * cannot work here — Escobar's words layer owns wording, tone and units, and
 * evidence identity is fingerprinted from typed facts. So everything below
 * returns reason codes and numbers; `coach/words.ts` renders them.
 *
 * Nothing here establishes a physiological fact. The gates are data-quality
 * rules: they decide whether a recording is complete enough to compare, never
 * whether a pulse is good, safe, or improving.
 */
import type { LoggedSet, Session } from '@/core/models';
import { LIBRARY } from '@/core/exercises';

/** Data sufficiency rules, not physiological thresholds or training targets. */
export const HEART_RATE_EVIDENCE = {
  maxAgeMs: 42 * 86_400_000,
  minimumCoveragePct: 70,
  minimumCapturedMs: 180_000,
  minimumSamples: 36,
  minimumBaselineSessions: 3,
  maximumRecentPoints: 8,
  /** A difference smaller than max(8 bpm, 10% of baseline) is "usual". */
  minimumDeltaBpm: 8,
  minimumDeltaFraction: 0.1,
  /** Mean effort difference below this reads as "similar". */
  effortSimilarBand: 0.35,
  durationTolerance: 0.25,
  volumeTolerance: 0.2,
} as const;

export type HeartRateQuality = 'eligible' | 'limited' | 'missing' | 'outdated' | 'invalid';

/** Why a recording is or is not usable. Rendered by the words layer. */
export type HeartRateEvidenceCode =
  | 'eligible'
  | 'no_recording'
  | 'no_samples'
  | 'invalid_timing'
  | 'inconsistent_totals'
  | 'inconsistent_values'
  | 'legacy_unverified'
  | 'outdated'
  | 'too_short'
  | 'low_coverage';

/** Why a comparison is or is not available. */
export type HeartRateContextCode =
  | 'ready'
  | 'no_recordings'
  | 'latest_not_eligible'
  | 'latest_unmatchable'
  | 'baseline_too_small';

export interface HeartRateSessionEvidence {
  sessionId: string;
  quality: HeartRateQuality;
  eligible: boolean;
  code: HeartRateEvidenceCode;
  coveragePct?: number;
  averageBpm?: number;
  peakBpm?: number;
  sampleCount: number;
  capturedMs: number;
  durationMs: number;
  gapCount: number;
}

export interface HeartRateRecentPoint {
  sessionId: string;
  day: string;
  splitName: string;
  averageBpm?: number;
  coveragePct?: number;
  meanEffort?: number;
  eligible: boolean;
  code: HeartRateEvidenceCode;
}

export type EffortDirection = 'harder' | 'easier' | 'similar' | 'unknown';
export type PulseDirection = 'higher' | 'lower' | 'usual';

export interface HeartRateContext {
  state: 'warming-up' | 'limited' | 'ready';
  code: HeartRateContextCode;
  recentCount: number;
  recordedCount: number;
  eligibleCount: number;
  latest?: Session;
  latestEvidence?: HeartRateSessionEvidence;
  /** Chronological points, including workouts with no usable reading. */
  recent: HeartRateRecentPoint[];
  baselineCount: number;
  /** Session ids actually used as the baseline, oldest first. */
  baselineSessionIds: string[];
  baselineMedianBpm?: number;
  deltaBpm?: number;
  direction?: PulseDirection;
  effort: { direction: EffortDirection; latestMean?: number; baselineMean?: number };
  /** Set when the comparison was narrowed to one captured intent. */
  intent?: 'normal' | 'easier';
}

const modes = new Map(LIBRARY.map(exercise => [exercise.id, exercise.mode]));
const finite = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);
const positive = (n: unknown): n is number => finite(n) && n > 0;
const bpm = (n: unknown): n is number => finite(n) && n >= 20 && n <= 260;
const instant = (value: unknown) => typeof value === 'string' ? Date.parse(value) : NaN;
const round = (value: number) => Math.round(value * 10) / 10;
const median = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle]! : (sorted[middle - 1]! + sorted[middle]!) / 2;
};

/**
 * The intent the person captured for this workout, when the app witnessed it.
 * An easier session is a different exposure, not a worse version of the same
 * one, so it is never compared against a normal one.
 */
export function sessionIntentKind(session: Session): 'normal' | 'easier' | undefined {
  const kind = session.plan?.assessment?.intent?.kind;
  return kind === 'normal' || kind === 'easier' ? kind : undefined;
}

/** Validate the versioned recording evidence before using it in any comparison. */
export function heartRateSessionEvidence(session: Session, now: number): HeartRateSessionEvidence {
  const result: HeartRateSessionEvidence = {
    sessionId: session.id, quality: 'missing', eligible: false,
    code: 'no_recording', sampleCount: 0, capturedMs: 0, durationMs: 0, gapCount: 0,
  };
  const reject = (quality: HeartRateQuality, code: HeartRateEvidenceCode) => ({ ...result, quality, code });
  const start = instant(session.startedAt), end = instant(session.endedAt);
  if (!finite(now) || !finite(start) || !finite(end) || end <= start || start > now || end > now ||
      !positive(session.durationSec) || session.durationSec * 1_000 > end - start + 1_000) {
    return reject('invalid', 'invalid_timing');
  }
  if (now - end > HEART_RATE_EVIDENCE.maxAgeMs) return reject('outdated', 'outdated');

  const hr = session.heartRate;
  if (!hr) return result;
  if (hr.metricsVersion !== 2) {
    // A legacy summary stays visible as a recorded fact. It cannot carry time
    // coverage, so it can never enter a comparison.
    if (Number.isSafeInteger(hr.sampleCount) && hr.sampleCount > 0) {
      result.sampleCount = hr.sampleCount;
      if (bpm(hr.averageBpm)) result.averageBpm = hr.averageBpm;
      if (bpm(hr.recordedPeakBpm) && (result.averageBpm == null || hr.recordedPeakBpm >= result.averageBpm)) result.peakBpm = hr.recordedPeakBpm;
    }
    return reject('limited', 'legacy_unverified');
  }
  const { sampleCount, capturedMs, durationMs, coveragePct, averageBpm, recordedPeakBpm, gapCount } = hr;
  if (!Number.isSafeInteger(sampleCount) || sampleCount < 0 ||
      !finite(capturedMs) || capturedMs < 0 || !positive(durationMs) ||
      !finite(coveragePct) || coveragePct < 0 || coveragePct > 100 ||
      capturedMs > durationMs || capturedMs > sampleCount * 5_000 ||
      Math.abs(durationMs - (end - start)) > 1_000 ||
      Math.abs(coveragePct - capturedMs / durationMs * 100) > 1 ||
      !Number.isSafeInteger(gapCount) || gapCount < 0) {
    return reject('invalid', 'inconsistent_totals');
  }
  if (sampleCount === 0 && capturedMs === 0) return reject('missing', 'no_samples');

  const first = instant(hr.firstSampleAt), last = instant(hr.lastSampleAt);
  if (!bpm(averageBpm) || !bpm(recordedPeakBpm) || recordedPeakBpm < averageBpm ||
      !finite(first) || !finite(last) || first < start || last > end || last < first ||
      capturedMs > last - first + 5_000) {
    return reject('invalid', 'inconsistent_values');
  }
  Object.assign(result, { sampleCount, capturedMs, durationMs, coveragePct, averageBpm, peakBpm: recordedPeakBpm, gapCount });
  if (capturedMs < HEART_RATE_EVIDENCE.minimumCapturedMs || sampleCount < HEART_RATE_EVIDENCE.minimumSamples) {
    return reject('limited', 'too_short');
  }
  if (coveragePct < HEART_RATE_EVIDENCE.minimumCoveragePct) return reject('limited', 'low_coverage');
  return { ...result, quality: 'eligible', eligible: true, code: 'eligible' };
}

function loggedSets(session: Session): LoggedSet[] {
  return Array.isArray(session.exercises) ? session.exercises.flatMap(e => e && Array.isArray(e.sets) ? e.sets.filter(Boolean) : []) : [];
}

/** Needs three ratings and at least half the session rated, or it stays unknown. */
function effortMean(session: Session): number | undefined {
  const all = loggedSets(session);
  const ratings = all.flatMap(set => set.effort === 'easy' ? [1] : set.effort === 'ideal' ? [2] : set.effort === 'max' ? [3] : []);
  if (ratings.length < 3 || ratings.length < all.length / 2) return undefined;
  return ratings.reduce((sum, value) => sum + value, 0) / ratings.length;
}

interface Workload { signature: string; volume: number[] }

/** Historical bodyweight/resistance-mode snapshots are unavailable, so only known weighted work is matched. */
function workload(session: Session): Workload | undefined {
  if (!Array.isArray(session.exercises) || !session.exercises.length || !positive(session.durationSec)) return undefined;
  const rows: Array<{ signature: string; volume: number }> = [];
  for (const exercise of session.exercises) {
    if (!exercise || modes.get(exercise.exerciseId) !== 'weighted' || !Array.isArray(exercise.sets) || !exercise.sets.length) return undefined;
    if (exercise.sets.some(set => !set || !positive(set.kg) || !Number.isSafeInteger(set.reps) || !positive(set.reps) ||
      set.durationSec != null || set.distanceM != null)) return undefined;
    const volume = exercise.sets.reduce((sum, set) => sum + set.kg! * set.reps!, 0);
    if (!positive(volume)) return undefined;
    // Equal load multiset also requires equal set counts, preventing equal tonnage at unlike loads from matching.
    const loads = exercise.sets.map(set => set.kg!).sort((a, b) => a - b);
    rows.push({ signature: JSON.stringify([exercise.exerciseId, loads]), volume });
  }
  rows.sort((a, b) => a.signature.localeCompare(b.signature) || a.volume - b.volume);
  return { signature: JSON.stringify(rows.map(row => row.signature)), volume: rows.map(row => row.volume) };
}

function comparable(latest: Session, prior: Session, current: Workload, previous: Workload): boolean {
  if (latest.splitId !== prior.splitId || current.signature !== previous.signature) return false;
  // An accepted easier week is a different exposure. Completing reduced work is
  // not evidence about the normal session, in either direction.
  const latestIntent = sessionIntentKind(latest), priorIntent = sessionIntentKind(prior);
  if (latestIntent && priorIntent && latestIntent !== priorIntent) return false;
  if (Math.abs(prior.durationSec - latest.durationSec) > latest.durationSec * HEART_RATE_EVIDENCE.durationTolerance) return false;
  // Pulse includes pauses. Equal active durations must not hide unlike lengths
  // of rest or a long interruption in the elapsed recording window.
  const elapsed = instant(latest.endedAt) - instant(latest.startedAt);
  const previousElapsed = instant(prior.endedAt) - instant(prior.startedAt);
  if (Math.abs(previousElapsed - elapsed) > elapsed * HEART_RATE_EVIDENCE.durationTolerance) return false;
  return current.volume.every((volume, index) => Math.abs(previous.volume[index]! - volume) <= volume * HEART_RATE_EVIDENCE.volumeTolerance);
}

function timeline(sessions: Session[], now: number): Session[] {
  const sorted = sessions.filter(session => {
    const start = instant(session.startedAt), end = instant(session.endedAt);
    return typeof session.id === 'string' && session.id.length > 0 && finite(start) && finite(end) && start < end && end <= now;
  }).sort((a, b) => instant(a.endedAt) - instant(b.endedAt));
  const seenIds = new Set<string>(), seenTimes = new Set<string>();
  // Keep only one copy of a workout; repeated imports must not manufacture baseline sessions.
  return sorted.reverse().filter(session => {
    const times = `${instant(session.startedAt)}:${instant(session.endedAt)}`;
    if (seenIds.has(session.id) || seenTimes.has(times)) return false;
    seenIds.add(session.id); seenTimes.add(times);
    return true;
  }).reverse();
}

/** One shared context for Coach, Today, and a history view evaluated at a selected workout's end. */
export function heartRateContext(sessions: Session[], now: number): HeartRateContext {
  const valid = finite(now) ? timeline(sessions, now) : [];
  const latest = valid[valid.length - 1];
  const recent = valid.filter(session => now - instant(session.endedAt) <= HEART_RATE_EVIDENCE.maxAgeMs);
  const evidence = new Map(recent.map(session => [session.id, heartRateSessionEvidence(session, now)]));
  const latestEvidence = latest ? heartRateSessionEvidence(latest, now) : undefined;
  const context: HeartRateContext = {
    state: 'warming-up', code: 'no_recordings',
    recentCount: recent.length,
    recordedCount: recent.filter(session => session.heartRate && session.heartRate.sampleCount > 0).length,
    eligibleCount: [...evidence.values()].filter(item => item.eligible).length,
    latest, latestEvidence,
    recent: recent.slice(-HEART_RATE_EVIDENCE.maximumRecentPoints).map(session => {
      const item = evidence.get(session.id)!;
      return {
        sessionId: session.id, day: session.day, splitName: session.splitName,
        averageBpm: item.averageBpm, coveragePct: item.coveragePct,
        meanEffort: effortMean(session), eligible: item.eligible, code: item.code,
      };
    }),
    baselineCount: 0, baselineSessionIds: [], effort: { direction: 'unknown' },
  };
  if (!latest || !latestEvidence) return context;
  if (!latestEvidence.eligible) return { ...context, state: 'limited', code: 'latest_not_eligible' };

  const currentWork = workload(latest);
  if (!currentWork) return { ...context, state: 'limited', code: 'latest_unmatchable' };

  const candidates = recent.filter(session => {
    if (session.id === latest.id || instant(session.endedAt) > instant(latest.startedAt) || !evidence.get(session.id)?.eligible) return false;
    const previous = workload(session);
    return previous != null && comparable(latest, session, currentWork, previous);
  });
  // Walk backwards keeping only workouts that finished before the next one
  // started, so overlapping or duplicated records cannot stack up a baseline.
  let precedingStart = instant(latest.startedAt);
  const baseline = candidates.slice().reverse().filter(session => {
    if (instant(session.endedAt) > precedingStart) return false;
    precedingStart = instant(session.startedAt);
    return true;
  }).reverse();
  context.baselineCount = baseline.length;
  context.baselineSessionIds = baseline.map(s => s.id);
  if (baseline.length < HEART_RATE_EVIDENCE.minimumBaselineSessions) {
    return { ...context, code: 'baseline_too_small' };
  }

  const baselineMedianBpm = median(baseline.map(session => evidence.get(session.id)!.averageBpm!));
  const delta = latestEvidence.averageBpm! - baselineMedianBpm;
  const threshold = Math.max(HEART_RATE_EVIDENCE.minimumDeltaBpm, baselineMedianBpm * HEART_RATE_EVIDENCE.minimumDeltaFraction);
  const direction: PulseDirection = Math.abs(delta) < threshold ? 'usual' : delta > 0 ? 'higher' : 'lower';
  const latestMean = effortMean(latest);
  const baselineEfforts = baseline.map(effortMean);
  const baselineMean = baselineEfforts.every(finite) ? median(baselineEfforts as number[]) : undefined;
  const effortDirection: EffortDirection = latestMean == null || baselineMean == null ? 'unknown'
    : Math.abs(latestMean - baselineMean) < HEART_RATE_EVIDENCE.effortSimilarBand ? 'similar'
    : latestMean > baselineMean ? 'harder' : 'easier';
  return {
    ...context, state: 'ready', code: 'ready',
    baselineMedianBpm: round(baselineMedianBpm), deltaBpm: round(delta), direction,
    effort: { direction: effortDirection, latestMean, baselineMean },
    intent: sessionIntentKind(latest),
  };
}
