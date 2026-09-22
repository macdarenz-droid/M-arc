/**
 * Evidence gating and workout matching. These are data-quality rules: they
 * decide whether a recording is complete enough to compare against the
 * person's own history, never whether a pulse is good or bad.
 */
import { describe, it, expect } from 'vitest';
import type { HeartRateSummary, LoggedSet, Session, SessionIntent } from '@/core/models';
import { HEART_RATE_EVIDENCE, heartRateContext, heartRateSessionEvidence, sessionIntentKind } from '@/brain/heart-rate';

const HOUR = 3_600_000;
const BASE = Date.parse('2026-09-01T10:00:00.000Z');
const NOW = BASE + 40 * 24 * HOUR;

function summary(averageBpm: number, over: Partial<HeartRateSummary> = {}): HeartRateSummary {
  const durationMs = HOUR;
  const capturedMs = Math.round(durationMs * 0.9);
  return {
    metricsVersion: 2,
    sampleCount: Math.ceil(capturedMs / 5_000),
    capturedMs,
    durationMs,
    coveragePct: Math.round(capturedMs / durationMs * 100),
    averageBpm,
    recordedPeakBpm: averageBpm + 20,
    firstSampleAt: new Date(BASE).toISOString(),
    lastSampleAt: new Date(BASE + capturedMs).toISOString(),
    gapCount: 0,
    ...over,
  };
}

let seq = 0;
function workout(opts: {
  daysAgoFromNow: number;
  bpm?: number | null;
  kg?: number;
  reps?: number;
  effort?: LoggedSet['effort'] | null;
  sets?: number;
  exerciseId?: string;
  splitId?: string;
  durationSec?: number;
  intent?: SessionIntent['kind'];
  heartRate?: HeartRateSummary;
}): Session {
  const start = NOW - opts.daysAgoFromNow * 24 * HOUR;
  const durationSec = opts.durationSec ?? 3600;
  const end = start + durationSec * 1000;
  const kg = opts.kg ?? 60, reps = opts.reps ?? 8, n = opts.sets ?? 3;
  const effort = opts.effort === undefined ? 'ideal' : opts.effort;
  const hr = opts.heartRate !== undefined ? opts.heartRate
    : opts.bpm === null ? undefined
    : {
        ...summary(opts.bpm ?? 130),
        durationMs: end - start,
        capturedMs: Math.round((end - start) * 0.9),
        coveragePct: 90,
        firstSampleAt: new Date(start).toISOString(),
        lastSampleAt: new Date(start + Math.round((end - start) * 0.9)).toISOString(),
        sampleCount: Math.ceil(Math.round((end - start) * 0.9) / 5_000),
      };
  return {
    id: `s_${seq++}`,
    splitId: opts.splitId ?? 'split_push',
    splitName: 'Push',
    day: new Date(start).toISOString().slice(0, 10),
    startedAt: new Date(start).toISOString(),
    endedAt: new Date(end).toISOString(),
    durationSec,
    exercises: [{
      exerciseId: opts.exerciseId ?? 'lib_barbell_bench_press',
      name: 'Bench',
      sets: Array.from({ length: n }, () => (effort ? { kg, reps, effort } : { kg, reps })),
    }],
    heartRate: hr,
    ...(opts.intent ? {
      plan: {
        version: 1 as const, capturedAt: new Date(start).toISOString(), goal: 'muscle' as never, deload: null, entries: [],
        assessment: {
          version: 1 as const,
          intent: { kind: opts.intent, capturedAt: new Date(start).toISOString(), source: 'session_start', effortCap: null },
          changes: [], invalidatedEntryIds: [], seenWorkingRows: [],
        },
      },
    } : {}),
  };
}

describe('heartRateSessionEvidence', () => {
  it('accepts a complete version-2 recording', () => {
    const e = heartRateSessionEvidence(workout({ daysAgoFromNow: 1, bpm: 130 }), NOW);
    expect(e.eligible).toBe(true);
    expect(e.code).toBe('eligible');
    expect(e.averageBpm).toBe(130);
  });

  it('reports no recording rather than a zero reading', () => {
    const e = heartRateSessionEvidence(workout({ daysAgoFromNow: 1, bpm: null }), NOW);
    expect(e.code).toBe('no_recording');
    expect(e.averageBpm).toBeUndefined();
    expect(e.eligible).toBe(false);
  });

  it('refuses a recording below the coverage floor and says what it was', () => {
    const s = workout({ daysAgoFromNow: 1, bpm: 130 });
    const durationMs = s.heartRate!.durationMs!;
    const capturedMs = Math.round(durationMs * 0.5);
    s.heartRate = { ...s.heartRate!, capturedMs, coveragePct: 50, sampleCount: Math.ceil(capturedMs / 5_000), lastSampleAt: new Date(Date.parse(s.startedAt) + capturedMs).toISOString() };
    const e = heartRateSessionEvidence(s, NOW);
    expect(e.code).toBe('low_coverage');
    expect(e.eligible).toBe(false);
    expect(e.coveragePct).toBe(50);
  });

  it('refuses a recording shorter than three captured minutes', () => {
    const s = workout({ daysAgoFromNow: 1, bpm: 130, durationSec: 120 });
    const e = heartRateSessionEvidence(s, NOW);
    expect(e.code).toBe('too_short');
    expect(e.eligible).toBe(false);
  });

  it('keeps a legacy summary visible as a fact but never lets it into a comparison', () => {
    const s = workout({ daysAgoFromNow: 1, heartRate: { sampleCount: 400, averageBpm: 128, recordedPeakBpm: 160, gapCount: 0 } });
    const e = heartRateSessionEvidence(s, NOW);
    expect(e.code).toBe('legacy_unverified');
    expect(e.eligible).toBe(false);
    expect(e.averageBpm).toBe(128);
  });

  it('rejects totals that contradict each other instead of trusting the survivors', () => {
    const s = workout({ daysAgoFromNow: 1, bpm: 130 });
    s.heartRate = { ...s.heartRate!, capturedMs: s.heartRate!.durationMs! * 2 };
    expect(heartRateSessionEvidence(s, NOW).code).toBe('inconsistent_totals');
  });

  it('rejects a peak below the average', () => {
    const s = workout({ daysAgoFromNow: 1, bpm: 150 });
    s.heartRate = { ...s.heartRate!, recordedPeakBpm: 100 };
    expect(heartRateSessionEvidence(s, NOW).code).toBe('inconsistent_values');
  });

  it('rejects a workout that claims to end in the future', () => {
    const s = workout({ daysAgoFromNow: -2, bpm: 130 });
    expect(heartRateSessionEvidence(s, NOW).code).toBe('invalid_timing');
  });

  it('drops a workout past the 42-day window', () => {
    const s = workout({ daysAgoFromNow: 50, bpm: 130 });
    expect(heartRateSessionEvidence(s, NOW).code).toBe('outdated');
  });
});

describe('heartRateContext matching', () => {
  const baseline = (n: number, bpm: number) => Array.from({ length: n }, (_, i) => workout({ daysAgoFromNow: 10 - i * 2, bpm }));

  it('withholds a comparison until three comparable recordings exist', () => {
    const ctx = heartRateContext([...baseline(2, 130), workout({ daysAgoFromNow: 1, bpm: 150 })], NOW);
    expect(ctx.state).toBe('warming-up');
    expect(ctx.code).toBe('baseline_too_small');
    expect(ctx.baselineCount).toBe(2);
    expect(ctx.direction).toBeUndefined();
  });

  it('compares against the median once three exist', () => {
    const ctx = heartRateContext([...baseline(3, 130), workout({ daysAgoFromNow: 1, bpm: 150 })], NOW);
    expect(ctx.state).toBe('ready');
    expect(ctx.baselineCount).toBe(3);
    expect(ctx.baselineMedianBpm).toBe(130);
    expect(ctx.direction).toBe('higher');
    expect(ctx.deltaBpm).toBe(20);
  });

  it('calls a small difference usual rather than reporting noise', () => {
    // 5 bpm is under the max(8, 10%) band.
    const ctx = heartRateContext([...baseline(3, 130), workout({ daysAgoFromNow: 1, bpm: 135 })], NOW);
    expect(ctx.direction).toBe('usual');
  });

  it('uses the larger of eight bpm and ten percent as the band', () => {
    // 10% of 180 is 18, so a 12 bpm difference is still usual at a high baseline.
    const ctx = heartRateContext([...baseline(3, 180), workout({ daysAgoFromNow: 1, bpm: 192 })], NOW);
    expect(ctx.direction).toBe('usual');
  });

  it('refuses to match a different split', () => {
    const others = baseline(3, 130).map(s => ({ ...s, splitId: 'split_pull' }));
    const ctx = heartRateContext([...others, workout({ daysAgoFromNow: 1, bpm: 150 })], NOW);
    expect(ctx.baselineCount).toBe(0);
  });

  it('refuses to match different loads', () => {
    const others = baseline(3, 130).map(s => workout({ daysAgoFromNow: 5, bpm: 130, kg: 100 }));
    const ctx = heartRateContext([...others, workout({ daysAgoFromNow: 1, bpm: 150, kg: 60 })], NOW);
    expect(ctx.baselineCount).toBe(0);
  });

  it('refuses to match a markedly different duration', () => {
    const others = Array.from({ length: 3 }, (_, i) => workout({ daysAgoFromNow: 10 - i * 2, bpm: 130, durationSec: 7200 }));
    const ctx = heartRateContext([...others, workout({ daysAgoFromNow: 1, bpm: 150, durationSec: 3600 })], NOW);
    expect(ctx.baselineCount).toBe(0);
  });

  it('cannot match bodyweight work, and says so rather than guessing', () => {
    const ctx = heartRateContext([
      ...Array.from({ length: 3 }, (_, i) => workout({ daysAgoFromNow: 10 - i * 2, bpm: 130, exerciseId: 'lib_push_up' })),
      workout({ daysAgoFromNow: 1, bpm: 150, exerciseId: 'lib_push_up' }),
    ], NOW);
    expect(ctx.code).toBe('latest_unmatchable');
    expect(ctx.state).toBe('limited');
  });

  it('a repeated import cannot manufacture a baseline out of one workout', () => {
    const one = workout({ daysAgoFromNow: 5, bpm: 130 });
    const copies = [one, { ...one, id: 's_copy1' }, { ...one, id: 's_copy2' }];
    const ctx = heartRateContext([...copies, workout({ daysAgoFromNow: 1, bpm: 150 })], NOW);
    expect(ctx.baselineCount).toBeLessThan(HEART_RATE_EVIDENCE.minimumBaselineSessions);
  });

  it('ignores a workout whose own recording is not eligible', () => {
    const thin = workout({ daysAgoFromNow: 6, bpm: 130 });
    thin.heartRate = { ...thin.heartRate!, coveragePct: 30, capturedMs: Math.round(thin.heartRate!.durationMs! * 0.3), sampleCount: 100 };
    const ctx = heartRateContext([...baseline(2, 130), thin, workout({ daysAgoFromNow: 1, bpm: 150 })], NOW);
    expect(ctx.baselineCount).toBe(2);
  });

  it('reports the latest recording as ineligible rather than comparing it anyway', () => {
    const latest = workout({ daysAgoFromNow: 1, bpm: 150 });
    latest.heartRate = { ...latest.heartRate!, coveragePct: 20, capturedMs: Math.round(latest.heartRate!.durationMs! * 0.2), sampleCount: 100 };
    const ctx = heartRateContext([...baseline(3, 130), latest], NOW);
    expect(ctx.code).toBe('latest_not_eligible');
  });
});

describe('an accepted easier week is a different exposure', () => {
  it('reads the captured intent when the app witnessed it', () => {
    expect(sessionIntentKind(workout({ daysAgoFromNow: 1, intent: 'easier' }))).toBe('easier');
    expect(sessionIntentKind(workout({ daysAgoFromNow: 1 }))).toBeUndefined();
  });

  it('never compares an easier session against normal ones', () => {
    const normals = Array.from({ length: 3 }, (_, i) => workout({ daysAgoFromNow: 10 - i * 2, bpm: 130, intent: 'normal' }));
    const ctx = heartRateContext([...normals, workout({ daysAgoFromNow: 1, bpm: 150, intent: 'easier' })], NOW);
    expect(ctx.baselineCount).toBe(0);
    expect(ctx.code).toBe('baseline_too_small');
  });

  it('compares easier sessions with each other and labels the comparison', () => {
    const easier = Array.from({ length: 3 }, (_, i) => workout({ daysAgoFromNow: 10 - i * 2, bpm: 130, intent: 'easier' }));
    const ctx = heartRateContext([...easier, workout({ daysAgoFromNow: 1, bpm: 150, intent: 'easier' })], NOW);
    expect(ctx.state).toBe('ready');
    expect(ctx.intent).toBe('easier');
  });

  it('still matches when neither session recorded an intent', () => {
    const ctx = heartRateContext([
      ...Array.from({ length: 3 }, (_, i) => workout({ daysAgoFromNow: 10 - i * 2, bpm: 130 })),
      workout({ daysAgoFromNow: 1, bpm: 150 }),
    ], NOW);
    expect(ctx.state).toBe('ready');
    expect(ctx.intent).toBeUndefined();
  });
});

describe('effort comparison', () => {
  const withBaseline = (latestEffort: LoggedSet['effort'] | null) => heartRateContext([
    ...Array.from({ length: 3 }, (_, i) => workout({ daysAgoFromNow: 10 - i * 2, bpm: 130, effort: 'ideal' })),
    workout({ daysAgoFromNow: 1, bpm: 150, effort: latestEffort }),
  ], NOW);

  it('reports a harder-rated session', () => {
    expect(withBaseline('max').effort.direction).toBe('harder');
  });

  it('reports an easier-rated session', () => {
    expect(withBaseline('easy').effort.direction).toBe('easier');
  });

  it('stays unknown when the session was not rated', () => {
    expect(withBaseline(null).effort.direction).toBe('unknown');
  });
});
