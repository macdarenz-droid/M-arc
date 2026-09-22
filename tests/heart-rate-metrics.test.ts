import { describe, it, expect } from 'vitest';
import { freshness, summarize, twoMinuteWindow, validSample, LIVE_MAX_MS } from '@/heart-rate/metrics';
import { tracePoints } from '@/heart-rate/chart';
import type { HeartRateSample } from '@/heart-rate/types';

const START = Date.parse('2026-09-20T10:00:00.000Z');
const sample = (offsetMs: number, bpm: number, extra: Partial<HeartRateSample> = {}): HeartRateSample => ({
  bpm, receivedAtEpochMs: START + offsetMs, receivedAtElapsedMs: offsetMs, source: 'ble-heart-rate', ...extra,
});

describe('validSample', () => {
  it('accepts an ordinary reading and rejects out-of-range or foreign ones', () => {
    expect(validSample(sample(0, 120))).toBe(true);
    expect(validSample(sample(0, 19))).toBe(false);
    expect(validSample(sample(0, 261))).toBe(false);
    expect(validSample(sample(0, 120.5))).toBe(false);
    expect(validSample(sample(0, 120, { source: 'other' as never }))).toBe(false);
  });

  it('rejects a reading the watch itself flagged as bad contact', () => {
    expect(validSample(sample(0, 120, { contactDetected: false }))).toBe(false);
    // Unknown is not the same as failed: many devices never send the flag.
    expect(validSample(sample(0, 120, { contactDetected: undefined }))).toBe(true);
    expect(validSample(sample(0, 120, { contactDetected: true }))).toBe(true);
  });
});

describe('summarize', () => {
  it('weights the average by bounded intervals, not by sample count', () => {
    // 100 bpm covers 5 s (capped), 200 bpm covers 1 s before the end.
    const s = summarize([sample(0, 100), sample(60_000, 200)], START, START + 61_000);
    expect(s.metricsVersion).toBe(2);
    expect(s.capturedMs).toBe(LIVE_MAX_MS + 1_000);
    expect(s.averageBpm).toBe(Math.round((100 * 5_000 + 200 * 1_000) / 6_000));
    expect(s.recordedPeakBpm).toBe(200);
  });

  it('caps each reading at five seconds so a dropout cannot inherit the last good value', () => {
    const s = summarize([sample(0, 150)], START, START + 600_000);
    expect(s.capturedMs).toBe(LIVE_MAX_MS);
    expect(s.coveragePct).toBe(1); // 5 s of a 10-minute workout
  });

  it('counts a gap over fifteen seconds and leaves shorter spacing alone', () => {
    expect(summarize([sample(0, 120), sample(10_000, 120)], START, START + 20_000).gapCount).toBe(0);
    expect(summarize([sample(0, 120), sample(20_000, 120)], START, START + 30_000).gapCount).toBe(1);
  });

  it('excludes readings outside the workout window', () => {
    const s = summarize([sample(-5_000, 200), sample(1_000, 100), sample(99_000, 200)], START, START + 10_000);
    expect(s.sampleCount).toBe(1);
    expect(s.averageBpm).toBe(100);
  });

  it('deduplicates identical timestamps rather than double-counting them', () => {
    const s = summarize([sample(0, 100), sample(0, 100), sample(0, 100)], START, START + 10_000);
    expect(s.sampleCount).toBe(1);
  });

  it('keeps a bad-contact packet as an interval boundary without averaging it in', () => {
    // The good reading at 0 would otherwise cover its full 5 s.
    const s = summarize([sample(0, 100), sample(1_000, 190, { contactDetected: false })], START, START + 30_000);
    expect(s.sampleCount).toBe(1);
    expect(s.averageBpm).toBe(100);
    expect(s.capturedMs).toBe(1_000);
  });

  it('never reports a zero or NaN average when nothing was captured', () => {
    const empty = summarize([], START, START + 10_000);
    expect(empty.sampleCount).toBe(0);
    expect(empty.averageBpm).toBeUndefined();
    expect(empty.coveragePct).toBe(0);
  });

  it('refuses an impossible window instead of inventing coverage', () => {
    const s = summarize([sample(0, 120)], START + 10_000, START);
    expect(s).toEqual({ sampleCount: 0, gapCount: 0 });
  });

  it('coverage can reach but never exceed 100%', () => {
    const dense = Array.from({ length: 12 }, (_, i) => sample(i * 5_000, 120));
    const s = summarize(dense, START, START + 60_000);
    expect(s.coveragePct).toBe(100);
    expect(s.capturedMs).toBeLessThanOrEqual(s.durationMs!);
  });
});

describe('freshness', () => {
  it('reads live, then delayed, then lost as the reading ages', () => {
    const now = START + 60_000;
    expect(freshness(sample(60_000 - 1_000, 120), now)).toBe('live');
    expect(freshness(sample(60_000 - 10_000, 120), now)).toBe('delayed');
    expect(freshness(sample(60_000 - 30_000, 120), now)).toBe('lost');
    expect(freshness(null, now)).toBe('lost');
  });
});

describe('tracePoints', () => {
  it('breaks the line at a failed contact rather than drawing through it', () => {
    const points = tracePoints([
      sample(0, 120), sample(1_000, 120),
      sample(2_000, 130, { contactDetected: false }),
      sample(3_000, 125),
    ], START, START + 10_000);
    expect(points.map(p => p.bpm)).toEqual([120, 120, 125]);
    expect(points.map(p => p.startsSegment)).toEqual([true, false, true]);
  });

  it('breaks the line across a silent gap of more than five seconds', () => {
    const points = tracePoints([sample(0, 120), sample(9_000, 120)], START, START + 20_000);
    expect(points.map(p => p.startsSegment)).toEqual([true, true]);
  });
});

describe('twoMinuteWindow', () => {
  it('keeps only the last two minutes', () => {
    const kept = twoMinuteWindow([sample(0, 100), sample(150_000, 110), sample(180_000, 120)], START + 180_000);
    expect(kept.map(s => s.bpm)).toEqual([110, 120]);
  });
});
