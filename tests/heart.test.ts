import { describe, it, expect } from 'vitest';
import { hrMax, observedHrMaxFromSeries, restingHr, zones, signalQuality, setHeartFromWindow, sessionHeartSummary, downsampleToBuckets, bestObservedHrMax } from '@/brain/heart';
import type { Profile } from '@/core/models';

const profile = (p: Partial<Profile> = {}): Profile => ({ name: '', ...p });

describe('hrMax', () => {
  it('prefers the manual override', () => {
    expect(hrMax(profile({ hrMaxOverride: 175, birthYear: 1990 })).source).toBe('override');
    expect(hrMax(profile({ hrMaxOverride: 175 })).bpm).toBe(175);
  });
  it('uses a recent observed max over Tanaka', () => {
    const r = hrMax(profile({ birthYear: 1990 }), { bpm: 185, atMs: Date.now() - 30 * 86_400_000 }, Date.now());
    expect(r).toEqual({ bpm: 185, source: 'observed' });
  });
  it('rejects an observed max below 150', () => {
    const r = hrMax(profile({ birthYear: 1990 }), { bpm: 140, atMs: Date.now() });
    expect(r.source).toBe('tanaka');
  });
  it('falls back to Tanaka from birth year', () => {
    const r = hrMax(profile({ birthYear: 1990 }), null, new Date('2026-01-01').getTime());
    expect(r).toEqual({ bpm: Math.round(208 - 0.7 * 36), source: 'tanaka' });
  });
  it('decays a stale observed max toward Tanaka past 12 months', () => {
    const now = new Date('2026-01-01').getTime();
    const r = hrMax(profile({ birthYear: 1990 }), { bpm: 200, atMs: now - 400 * 86_400_000 }, now);
    const tanaka = 208 - 0.7 * 36;
    expect(r.bpm).toBe(Math.round(200 + (tanaka - 200) * 0.25));
  });
  it('defaults to 190 with no age and no observation', () => {
    expect(hrMax(profile())).toEqual({ bpm: 190, source: 'default' });
  });
});

describe('observedHrMaxFromSeries', () => {
  it('finds a plateau reached by a ramp', () => {
    const series: Array<[number, number]> = [[0, 120], [5, 140], [10, 160], [15, 178], [20, 180], [25, 179], [30, 181], [35, 178]];
    expect(observedHrMaxFromSeries(series)).not.toBeNull();
  });
  it('rejects a lone spike with no plateau', () => {
    const series: Array<[number, number]> = [[0, 120], [5, 130], [10, 200], [15, 125], [20, 122]];
    expect(observedHrMaxFromSeries(series)).toBeNull();
  });
  it('rejects a value above 220', () => {
    const series: Array<[number, number]> = [[0, 150], [5, 200], [10, 225], [15, 226], [20, 224], [25, 225]];
    expect(observedHrMaxFromSeries(series)).toBeNull();
  });
});

describe('restingHr', () => {
  it('prefers the manual override', () => {
    expect(restingHr([], profile({ restingHrOverride: 50 }), '2026-01-08')).toBe(50);
  });
  it('takes the 7-day median', () => {
    const days = [1, 2, 3, 4, 5, 6, 7].map(d => ({ day: `2026-01-0${d}`, restingHr: 50 + d }));
    expect(restingHr(days, profile(), '2026-01-08')).not.toBeNull();
  });
  it('is null with no data and no override', () => {
    expect(restingHr([], profile(), '2026-01-08')).toBeNull();
  });
});

describe('zones', () => {
  it('gives 5 ascending boundaries', () => {
    const z = zones(190, 60);
    expect(z).toHaveLength(5);
    expect(z[0]).toBeLessThan(z[1]!);
    expect(z[4]).toBeLessThan(190);
  });
});

describe('signalQuality', () => {
  it('is the share of expected 5s buckets present', () => {
    const series: Array<[number, number]> = Array.from({ length: 6 }, (_, i) => [i * 5, 120]);
    expect(signalQuality(series, 60)).toBeCloseTo(0.5, 2);
  });
  it('caps at 1', () => {
    const series: Array<[number, number]> = Array.from({ length: 20 }, (_, i) => [i * 5, 120]);
    expect(signalQuality(series, 60)).toBe(1);
  });
});

describe('setHeartFromWindow', () => {
  const series: Array<[number, number]> = [[0, 100], [5, 120], [10, 140], [15, 130], [70, 110], [75, 108]];
  it('takes the peak and end bpm within the set window', () => {
    const r = setHeartFromWindow(series, 0, 15);
    expect(r?.peakBpm).toBe(140);
    expect(r?.endBpm).toBe(130);
  });
  it('computes hrr60 from samples 55-65s after the end', () => {
    const r = setHeartFromWindow(series, 0, 15);
    expect(r?.hrr60).toBe(130 - 110);
  });
  it('is null with nothing in the window', () => {
    expect(setHeartFromWindow(series, 200, 210)).toBeNull();
  });
});

describe('downsampleToBuckets', () => {
  it('takes the median bpm per 5-second bucket', () => {
    const samples = [{ tSec: 0, bpm: 100 }, { tSec: 1, bpm: 110 }, { tSec: 4, bpm: 120 }, { tSec: 5, bpm: 130 }];
    const r = downsampleToBuckets(samples);
    expect(r).toEqual([[0, 110], [5, 130]]);
  });
  it('drops contact=false and non-positive bpm samples', () => {
    const samples = [{ tSec: 0, bpm: 100, contact: false }, { tSec: 1, bpm: 0 }, { tSec: 2, bpm: 110, contact: true }];
    expect(downsampleToBuckets(samples)).toEqual([[0, 110]]);
  });
});

describe('bestObservedHrMax', () => {
  it('takes the highest validated plateau across sessions', () => {
    const flat = (bpm: number): Array<[number, number]> => [[0, bpm], [5, bpm], [10, bpm], [15, bpm], [20, bpm]];
    const seriesById = { a: flat(170), b: flat(185) };
    const r = bestObservedHrMax([{ id: 'a', endedAt: '2026-01-01T00:00:00Z' }, { id: 'b', endedAt: '2026-01-02T00:00:00Z' }], seriesById);
    expect(r?.bpm).toBe(185);
  });
  it('is null with no stored series', () => {
    expect(bestObservedHrMax([{ id: 'a', endedAt: '2026-01-01T00:00:00Z' }], {})).toBeNull();
  });
});

describe('sessionHeartSummary', () => {
  it('aggregates avg/max/min and zone seconds', () => {
    const series: Array<[number, number]> = [[0, 100], [5, 150], [10, 170]];
    const r = sessionHeartSummary({ series, sessionSec: 15, hrMaxBpm: 190, restingHrBpm: 60, sets: [] });
    expect(r?.avgBpm).toBe(140);
    expect(r?.maxBpm).toBe(170);
    expect(r?.minBpm).toBe(100);
    expect(r?.zoneSec.reduce((a, b) => a + b, 0)).toBeGreaterThan(0);
  });
  it('takes the hrr60 median from sets that have one', () => {
    const series: Array<[number, number]> = [[0, 120]];
    const r = sessionHeartSummary({ series, sessionSec: 5, hrMaxBpm: 190, restingHrBpm: 60, sets: [{ heart: { peakBpm: 140, endBpm: 130, hrr60: 10 } }, { heart: { peakBpm: 150, endBpm: 140, hrr60: 20 } }] });
    expect(r?.hrr60Median).toBe(20);
  });
  it('is null with an empty series', () => {
    expect(sessionHeartSummary({ series: [], sessionSec: 60, hrMaxBpm: 190, restingHrBpm: 60, sets: [] })).toBeNull();
  });
  it('still gives avg/max/coverage without a resting HR, but skips zones rather than guessing one', () => {
    const series: Array<[number, number]> = [[0, 100], [5, 150], [10, 170]];
    const r = sessionHeartSummary({ series, sessionSec: 15, hrMaxBpm: 190, restingHrBpm: null, sets: [] });
    expect(r?.avgBpm).toBe(140);
    expect(r?.zoneSec).toEqual([0, 0, 0, 0, 0]);
  });
});
