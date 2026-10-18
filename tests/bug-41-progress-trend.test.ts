import { describe, it, expect } from 'vitest';
import type { LoggedSet, ResistanceMode } from '@/core/models';
import { exerciseHistory, type ExerciseSessionSummary } from '@/brain/history';
import { liftTrend, progressSeries, trend, LIFT_TREND_SESSIONS, type ProgressMetric } from '@/brain/trend';
import { progressHint, progressTrend } from '@/slices/history/progressTrend';
import { session, sets } from './helpers';

// BUG-41: the Exercise progress line, its label and its trend tile come from one series.
const s = (kg: number, reps: number, effort: LoggedSet['effort'] = 'ideal'): LoggedSet => ({ kg, reps, effort });
const x3 = (kg: number, reps: number): LoggedSet[] => [s(kg, reps), s(kg, reps), s(kg, reps)];
const histOf = (id: string, rows: Array<[string, LoggedSet[]]>): ExerciseSessionSummary[] =>
  exerciseHistory(rows.map(([day, st]) => session(day, [{ id, sets: st }])), id);
const weekly = (n: number) => Array.from({ length: n }, (_, i) => new Date(Date.UTC(2026, 4, 4 + i * 7)).toISOString().slice(0, 10));
const weeklyHist = (id: string, n: number, set: (i: number) => LoggedSet[]) => histOf(id, weekly(n).map((d, i) => [d, set(i)]));

const REAR_DELT = histOf('lib_rear_delt_fly', [
  ['2026-08-23', x3(26, 15)], ['2026-08-30', x3(26, 15)], ['2026-09-06', x3(26, 15)], ['2026-09-23', x3(26, 11)],
  ['2026-09-28', x3(26, 15)], ['2026-10-04', x3(26, 16)], ['2026-10-06', [s(33, 12), s(33, 14)]],
  ['2026-10-11', [s(35.5, 9), s(35.5, 9), s(35.5, 9, 'max')]],
  ['2026-10-18', [s(35.5, 10, 'easy'), s(35.5, 10), s(35.5, 10, 'max')]],
]);

const LATERAL = histOf('lib_dumbbell_lateral_raise', [
  ...['2026-09-23', '2026-09-25', '2026-09-27', '2026-09-29', '2026-10-01'].map(d => [d, x3(6, 10)] as [string, LoggedSet[]]),
  ['2026-10-04', [s(6, 14), s(6, 13)]], ['2026-10-06', [s(7, 13), s(7, 13), s(7, 12)]],
  ['2026-10-09', [s(7, 12), s(7, 11), s(7, 10, 'easy')]], ['2026-10-11', [s(7, 14), s(7, 14), s(7, 13)]],
  ['2026-10-13', x3(7, 15)], ['2026-10-17', [s(7, 15), s(7, 10, 'max')]],
  ['2026-10-18', [s(7, 15, 'easy'), s(7, 15), s(7, 16, 'max')]],
]);

const FIXTURES: Array<[string, ResistanceMode, ExerciseSessionSummary[]]> = [
  ['weighted, all <=10 reps', 'weighted', weeklyHist('lib_barbell_bench_press', 8, i => sets(80 + i * 2.5, 5))],
  ['weighted, mixed', 'weighted', LATERAL],
  ['weighted, mixed (rear delt)', 'weighted', REAR_DELT],
  ['weighted, all >10 reps', 'weighted', weeklyHist('lib_barbell_bench_press', 8, i => sets(20, 12 + (i >> 1)))],
  ['weighted, all 0 kg', 'weighted', weeklyHist('lib_barbell_bench_press', 8, i => sets(0, 8 + i))],
  ['conditioning, distance every session', 'conditioning', weeklyHist('lib_farmer_s_carry', 6, i => [{ kg: 30, distanceM: 20 + i * 10, effort: 'ideal' }])],
  ['conditioning, distance in some', 'conditioning', weeklyHist('lib_farmer_s_carry', 6, i => (i % 2 ? [{ kg: 30, distanceM: 20 + i * 10, effort: 'ideal' }] : [s(30, 8)]))],
  ['conditioning, no distance', 'conditioning', weeklyHist('lib_farmer_s_carry', 6, i => sets(30 + i * 2.5, 8))],
  ['bodyweight', 'bodyweight', weeklyHist('lib_pull_up', 8, i => [{ reps: 5 + i, effort: 'ideal' }])],
  ['duration', 'duration', weeklyHist('lib_plank', 8, i => [{ durationSec: 30 + i * 10, effort: 'ideal' }])],
  ['assisted', 'assisted', weeklyHist('lib_assisted_pull_up', 8, i => [s(20 - i * 2, 8), s(40 + i * 2, 8)])],
];

describe('BUG-41: the progress line and its trend read one series', () => {
  it('A1: Rear Delt plots top load and reads up, not slipping', () => {
    const sr = progressSeries(REAR_DELT, 'weighted');
    expect(sr.metric).toBe('top');
    expect(sr.values).toEqual([26, 26, 26, 26, 26, 26, 33, 35.5, 35.5]);
    expect(sr.trend.direction).toBe('up');
    expect(sr.trend.confidence).toBe('medium');
    expect(progressTrend(REAR_DELT, 'weighted').direction).not.toBe('down');
  });

  it('A2: Lateral plots top load, ends on 18 Oct no lower than before, and reads up', () => {
    const sr = progressSeries(LATERAL, 'weighted');
    expect(sr.metric).toBe('top');
    expect(sr.rows[sr.rows.length - 1]!.day).toBe('2026-10-18');
    expect(sr.values[sr.values.length - 1]).toBe(7);
    expect(sr.values[sr.values.length - 1]!).toBeGreaterThanOrEqual(sr.values[sr.values.length - 2]!);
    expect(sr.trend.direction).toBe('up');
    expect(sr.trend.confidence).toBe('high');
  });

  it('A3: every mode: the trend is exactly trend() of the plotted rows and values, all above 0', () => {
    for (const [name, mode, h] of FIXTURES) {
      if (mode === 'assisted') continue;
      const sr = progressSeries(h, mode);
      expect(sr.rows.length, name).toBe(sr.values.length);
      expect(sr.rows.length, name).toBeGreaterThan(0);
      for (const v of sr.values) expect(v, name).toBeGreaterThan(0);
      expect(sr.trend, name).toEqual(trend(sr.rows.map((r, i) => ({ day: r.day, value: sr.values[i]! }))));
    }
    const picked = Object.fromEntries(FIXTURES.map(([name, mode, h]) => [name, progressSeries(h, mode).metric]));
    expect(picked).toEqual({
      'weighted, all <=10 reps': 'e1rm', 'weighted, mixed': 'top', 'weighted, mixed (rear delt)': 'top',
      'weighted, all >10 reps': 'volume', 'weighted, all 0 kg': 'reps',
      'conditioning, distance every session': 'distance', 'conditioning, distance in some': 'distance',
      'conditioning, no distance': 'e1rm', bodyweight: 'reps', duration: 'hold', assisted: 'assist',
    });
    const some = progressSeries(FIXTURES[6]![2], 'conditioning');
    expect(some.rows.every(r => r.bestDistanceM > 0)).toBe(true);
    expect(some.rows.length).toBe(3);
  });

  it('A4: assisted plots the least help, rising as it falls, not the back-off set', () => {
    const h = FIXTURES.find(f => f[1] === 'assisted')![2];
    const sr = progressSeries(h, 'assisted');
    expect(sr.metric).toBe('assist');
    expect(sr.values).toEqual([-20, -18, -16, -14, -12, -10, -8, -6]);
    for (let i = 1; i < sr.values.length; i++) expect(sr.values[i]!).toBeGreaterThan(sr.values[i - 1]!);
    expect(sr.trend.direction).toBe('up');
    const flat = weeklyHist('lib_assisted_pull_up', 8, i => sets(20, 5 + i));
    const fr = progressSeries(flat, 'assisted');
    expect(fr.metric).toBe('reps');
    expect(fr.values).toEqual(flat.map(r => r.bestReps));
    expect(fr.trend.direction).toBe('up');
  });

  it('A5: the series is the last 12 sessions, and older ones never move the trend', () => {
    expect(LIFT_TREND_SESSIONS).toBe(12);
    const h = weeklyHist('lib_barbell_bench_press', 15, i => sets(80 + i * 2.5, 5));
    expect(progressSeries(h, 'weighted').rows).toEqual(h.slice(-12));
    const odd = weeklyHist('lib_barbell_bench_press', 15, i => (i < 3 ? sets(200, 5) : sets(80 + i * 2.5, 5)));
    const sr = progressSeries(odd, 'weighted');
    expect(sr.rows).toEqual(odd.slice(-12));
    expect(sr.trend).toEqual(progressSeries(odd.slice(3), 'weighted').trend);
    expect(sr.trend.direction).toBe('up');
  });

  it('A6: Escobar\'s liftTrend is the card\'s trend', () => {
    for (const [name, mode, h] of FIXTURES) expect(liftTrend(h, mode), name).toEqual(progressSeries(h, mode).trend);
    expect(liftTrend(LATERAL, 'weighted').direction).toBe('up');
    expect(liftTrend(REAR_DELT).direction).toBe('up');
  });

  it('A7: the label names the plotted metric', () => {
    const want: Record<ProgressMetric, string> = {
      e1rm: 'Estimated one-rep max', top: 'Top load', volume: 'Volume', distance: 'Farthest distance',
      assist: 'Less assistance', reps: 'Best reps', hold: 'Longest hold',
    };
    const modes: ResistanceMode[] = ['weighted', 'bodyweight', 'assisted', 'duration', 'conditioning'];
    for (const mode of modes) for (const [m, text] of Object.entries(want)) {
      expect(progressHint(mode, m as ProgressMetric)).toBe(text);
      if (m !== 'e1rm') expect(progressHint(mode, m as ProgressMetric)).not.toMatch(/one-rep/);
    }
    expect(progressHint('weighted', progressSeries(REAR_DELT, 'weighted').metric)).toBe('Top load');
  });

  it('A9: known costs stay as decided (D-BUG41-2)', () => {
    const c1 = progressSeries(weeklyHist('lib_barbell_bench_press', 12, i => (i < 10 ? x3(100, 8) : i === 10 ? x3(105, 3) : x3(50, 15))), 'weighted');
    expect([c1.metric, c1.trend.direction]).toEqual(['top', 'down']);
    const c2 = progressSeries(weeklyHist('lib_barbell_bench_press', 12, i => (i < 11 ? x3(100 + 2.5 * i, 5) : x3(60, 12))), 'weighted');
    expect([c2.metric, c2.trend.direction]).toEqual(['volume', 'up']);
    expect(c2.values[c2.values.length - 1]).toBe(2160);
    expect(Math.max(...c2.values)).toBe(2160);
    const c3 = progressSeries(weeklyHist('lib_barbell_bench_press', 8, i => x3(20, 15 - Math.floor(i / 2))), 'weighted');
    expect([c3.metric, c3.trend.direction]).toEqual(['top', 'flat']);
  });

  it('A10: a carry with a distance in one of three sessions has a one-row series', () => {
    const h = histOf('lib_farmer_s_carry', [
      ['2026-10-04', [s(30, 8)]], ['2026-10-11', [{ kg: 30, distanceM: 40, effort: 'ideal' }]], ['2026-10-18', [s(30, 8)]],
    ]);
    const sr = progressSeries(h, 'conditioning');
    expect(sr.metric).toBe('distance');
    expect(sr.rows.length).toBe(1);
    expect(sr.trend.direction).toBe('unknown');
  });

  it('an empty history has an empty series', () => {
    const sr = progressSeries([] as ExerciseSessionSummary[], 'weighted');
    expect(sr.rows).toEqual([]);
    expect(sr.trend.direction).toBe('unknown');
  });
});
