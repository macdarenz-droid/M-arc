import { describe, expect, it } from 'vitest';
import type { ReadinessEntry } from '@/core/models';
import { addDays } from '@/core/dates';
import {
  readinessBaseline,
  readinessLowLine,
  readinessMad,
  readinessMedian,
  readinessToday,
} from '@/brain/readiness';
import {
  READINESS_BASELINE_MIN_ENTRIES,
  READINESS_BASELINE_WINDOW_DAYS,
  READINESS_FLOOR_HARD_AVG,
  READINESS_LOW_AVG,
  READINESS_MAD_FLOOR,
  READINESS_Z_AMBER,
} from '@/brain/coach/bands';
import { TODAY } from './coach-helpers';

type Score = 1 | 2 | 3 | 4 | 5;
const entry = (day: string, sleep: Score, soreness: Score, stress: Score): ReadinessEntry => ({ day, sleep, soreness, stress });
const priors = (count: number, sleep: Score, soreness: Score, stress: Score, firstOffset = 1): ReadinessEntry[] =>
  Array.from({ length: count }, (_, i) => entry(addDays(TODAY, -(firstOffset + i)), sleep, soreness, stress));

describe('readiness baseline', () => {
  it('requires the named minimum number of prior entries', () => {
    expect(readinessBaseline(priors(READINESS_BASELINE_MIN_ENTRIES - 1, 4, 4, 4), TODAY)).toBeNull();
    expect(readinessBaseline(priors(READINESS_BASELINE_MIN_ENTRIES, 4, 4, 4), TODAY)?.entries).toBe(READINESS_BASELINE_MIN_ENTRIES);
  });

  it('excludes today from its own baseline', () => {
    const before = priors(10, 4, 4, 4);
    const baseline = readinessBaseline(before, TODAY);
    expect(readinessBaseline([...before, entry(TODAY, 1, 1, 1)], TODAY)).toEqual(baseline);
    expect(baseline?.avg.median).toBe(4);
    expect(baseline?.sleep.median).toBe(4);
  });

  it('uses only prior entries in the trailing window', () => {
    expect(readinessBaseline(priors(10, 4, 4, 4, READINESS_BASELINE_WINDOW_DAYS + 1), TODAY)).toBeNull();
    const inside = priors(10, 4, 4, 4);
    const baseline = readinessBaseline([...inside, entry(addDays(TODAY, 1), 1, 1, 1)], TODAY);
    expect(baseline?.entries).toBe(10);
    expect(baseline?.from).toBe(addDays(TODAY, -10));
    expect(baseline?.to).toBe(addDays(TODAY, -1));
  });

  it('computes medians and raw median absolute deviation without mutating input', () => {
    const xs = [4, 1, 3, 2];
    expect(readinessMedian(xs)).toBe(2.5);
    expect(xs).toEqual([4, 1, 3, 2]);
    expect(readinessMedian([])).toBe(0);
    expect(readinessMad([2, 2, 4, 4], 3)).toBe(1);
    expect(readinessMad([], 0)).toBe(0);
  });

  it('applies the MAD floor to comparisons, while retaining the real spread', () => {
    const entries = [...priors(10, 4, 4, 4), entry(TODAY, 4, 4, 4)];
    const today = readinessToday(entries, TODAY)!;
    expect(today.baseline?.avg.mad).toBe(0);
    expect(today.madDenom).toBe(READINESS_MAD_FLOOR);
  });
});

describe('personal readiness verdict', () => {
  it('marks an amber relative dip and names the cratered dimension', () => {
    const r = readinessToday([...priors(10, 4, 4, 4), entry(TODAY, 4, 4, 2)], TODAY)!;
    expect(r).toMatchObject({ avg: 3.3, delta: -0.7, z: -1.17, verdict: 'amber', personalized: true });
    expect(r.worst).toEqual({ dimension: 'stress', value: 2, median: 4, delta: -2 });
  });

  it('finds a relative red reading above the old absolute line', () => {
    const r = readinessToday([...priors(10, 4, 4, 4), entry(TODAY, 4, 2, 2)], TODAY)!;
    expect(r.avg).toBeGreaterThan(READINESS_LOW_AVG);
    expect(r).toMatchObject({ avg: 2.7, z: -2.17, verdict: 'red' });
  });

  it("treats a habitual 2 as this person's steady normal", () => {
    // The old absolute cut called this person low every day despite no change from normal.
    const r = readinessToday([...priors(10, 2, 2, 2), entry(TODAY, 2, 2, 2)], TODAY)!;
    expect(r.avg).toBeLessThanOrEqual(READINESS_LOW_AVG);
    expect(r).toMatchObject({ avg: 2, z: 0, verdict: 'steady', personalized: true });
  });

  it('finds a 4.7-to-3.0 crash the old absolute line missed', () => {
    const baseline = Array.from({ length: 12 }, (_, i) => i % 2
      ? entry(addDays(TODAY, -(i + 1)), 4, 5, 5)
      : entry(addDays(TODAY, -(i + 1)), 5, 4, 5));
    const r = readinessToday([...baseline, entry(TODAY, 3, 3, 3)], TODAY)!;
    expect(r.baseline?.avg.median).toBe(4.7);
    expect(r.avg).toBeGreaterThan(READINESS_LOW_AVG);
    expect(r.verdict).toBe('red');
  });

  it('keeps an absolute hard floor even for a habitually low baseline', () => {
    const r = readinessToday([...priors(10, 1, 1, 2), entry(TODAY, 1, 1, 2)], TODAY)!;
    expect(r.avg).toBeLessThanOrEqual(READINESS_FLOOR_HARD_AVG);
    expect(r).toMatchObject({ avg: 1.3, z: 0, verdict: 'red' });
  });

  it('lets one cratered dimension trigger amber even when z does not', () => {
    const r = readinessToday([...priors(10, 4, 4, 4), entry(TODAY, 5, 5, 1)], TODAY)!;
    expect(r.z).toBe(-0.5);
    expect(r.worst?.delta).toBe(-3);
    expect(r.verdict).toBe('amber');
  });

  it('makes green available with or without a baseline, but never with a 1', () => {
    expect(readinessToday([...priors(10, 3, 3, 3), entry(TODAY, 5, 5, 5)], TODAY)?.verdict).toBe('green');
    expect(readinessToday([...priors(10, 3, 3, 3), entry(TODAY, 5, 5, 1)], TODAY)?.verdict).not.toBe('green');
    expect(readinessToday([...priors(3, 4, 4, 4), entry(TODAY, 5, 5, 5)], TODAY)).toMatchObject({ verdict: 'green', personalized: false });
    expect(readinessToday([...priors(3, 4, 4, 4), entry(TODAY, 3, 3, 3)], TODAY)?.verdict).toBe('steady');
  });
});

describe('readiness drift and low line', () => {
  it('finds a consecutive below-normal dimension and a dimension that is holding', () => {
    const baseline = priors(10, 4, 4, 4).map((r, i) => i < 3 ? { ...r, stress: 2 as const } : r);
    const r = readinessToday([...baseline, entry(TODAY, 4, 4, 2)], TODAY)!;
    expect(r.drift).toEqual({ dimension: 'stress', value: 2, run: 4, median: 4, holding: 'sleep' });

    const short = priors(10, 4, 4, 4).map((x, i) => i < 1 ? { ...x, stress: 2 as const } : x);
    expect(readinessToday([...short, entry(TODAY, 4, 4, 2)], TODAY)?.drift).toBeNull();
    expect(readinessToday([entry(TODAY, 2, 2, 2)], TODAY)?.drift).toBeNull();
    expect(readinessToday([...priors(10, 4, 4, 4), entry(TODAY, 4, 4, 4)], TODAY)?.drift).toBeNull();
  });

  it('derives the personal low line from the named bands', () => {
    expect(readinessLowLine(null)).toBe(READINESS_LOW_AVG);
    const baseline = readinessBaseline(priors(10, 4, 4, 4), TODAY)!;
    const expected = Math.round((4 + READINESS_Z_AMBER * READINESS_MAD_FLOOR) * 10) / 10;
    expect(readinessLowLine(baseline)).toBe(expected);
  });

  it('returns null safely when today has no entry', () => {
    expect(readinessToday([], TODAY)).toBeNull();
    expect(readinessToday(priors(10, 4, 4, 4), TODAY)).toBeNull();
  });
});
