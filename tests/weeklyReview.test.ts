import { describe, it, expect } from 'vitest';
import {
  hardSetsThisWeek, volumeBand, frequencyThisWeek, failureShare, isStale, adherenceRate,
  weightTrendPctPerWeek, repMixShares, weekHasEnoughData, weeklyReviewInsights,
} from '@/brain/coach/weeklyReview';
import { emptySchedule, type Profile } from '@/core/models';
import { exerciseHistory } from '@/brain/history';
import { session, sets } from './helpers';

const bench = 'lib_barbell_bench_press';
const lateral = 'lib_dumbbell_lateral_raise';

describe('hardSetsThisWeek and volumeBand', () => {
  it('easy sets count half, ideal/max count full', () => {
    const s = session('2026-09-15', [{ id: bench, sets: [...sets(60, 8, 'easy', 2), ...sets(60, 8, 'ideal', 1)] }]); // Tue
    const out = hardSetsThisWeek([s], '2026-09-18', []);
    expect(out.chest).toBeCloseTo(0.5 + 0.5 + 1, 5);
  });
  it('bands match the plan thresholds', () => {
    expect(volumeBand(3)).toBe('low');
    expect(volumeBand(8)).toBe('maintenance');
    expect(volumeBand(15)).toBe('productive');
    expect(volumeBand(25)).toBe('high');
  });
});

describe('frequencyThisWeek', () => {
  it('counts sessions with 2+ primary sets for the muscle', () => {
    const a = session('2026-09-14', [{ id: bench, sets: sets(60, 8, 'ideal', 3) }]); // Mon
    expect(frequencyThisWeek([a], '2026-09-18', 'chest')).toBe(1);
  });
});

describe('failureShare', () => {
  it('is the share of working sets rated max', () => {
    const a = session('2026-09-14', [{ id: bench, sets: [...sets(60, 8, 'max', 2), ...sets(60, 8, 'ideal', 2)] }]);
    expect(failureShare([a])).toBe(0.5);
  });
});

describe('isStale', () => {
  it('flags 6 sessions at the same load with no e1RM movement', () => {
    const days = ['2026-08-03', '2026-08-06', '2026-08-10', '2026-08-13', '2026-08-17', '2026-08-20'];
    const hist = days.map(d => session(d, [{ id: bench, sets: sets(60, 8, 'ideal', 3) }]));
    expect(isStale(exerciseHistory(hist, bench))).toBe(true);
  });
  it('does not flag a lift with too little history', () => {
    const hist = exerciseHistory([session('2026-09-01', [{ id: bench, sets: sets(60, 8) }])], bench);
    expect(isStale(hist)).toBe(false);
  });
});

describe('adherenceRate', () => {
  it('is planned days done over planned days passed', () => {
    const schedule = { ...emptySchedule(), mon: 'split_push', wed: 'split_pull' };
    const a = session('2026-09-14', [{ id: bench, sets: sets(60, 8) }]); // Mon, done
    // Wed 09-16 missed
    expect(adherenceRate([a], schedule, '2026-09-18', 7)).toBeCloseTo(0.5, 5);
  });
});

describe('weightTrendPctPerWeek', () => {
  it('needs at least 7 entries spanning 14+ days', () => {
    expect(weightTrendPctPerWeek([{ day: '2026-09-01', kg: 80 }])).toBeNull();
  });
  it('reports a downward trend as negative pct/week', () => {
    const log = Array.from({ length: 15 }, (_, i) => ({ day: `2026-09-${String(i + 1).padStart(2, '0')}`, kg: 80 - i * 0.1 }));
    const r = weightTrendPctPerWeek(log)!;
    expect(r.pctPerWeek).toBeLessThan(0);
  });
});

describe('repMixShares', () => {
  it('splits main-lift working sets into low/mid/high rep bands', () => {
    const s = session('2026-09-14', [{ id: bench, sets: [...sets(100, 3, 'max', 2), ...sets(60, 8, 'ideal', 2)] }]);
    const mix = repMixShares([s], '2026-09-18');
    expect(mix.low).toBeCloseTo(0.5, 5);
    expect(mix.mid).toBeCloseTo(0.5, 5);
  });
  it('excludes accessory exercises', () => {
    const s = session('2026-09-14', [{ id: lateral, sets: sets(10, 15, 'ideal', 3) }]);
    expect(repMixShares([s], '2026-09-18').n).toBe(0);
  });
});

describe('weekHasEnoughData', () => {
  it('needs 5+ days logged in the calendar week', () => {
    const days = ['2026-09-14', '2026-09-15', '2026-09-16', '2026-09-17', '2026-09-18'];
    const s = days.map(d => session(d, [{ id: bench, sets: sets(60, 8) }]));
    expect(weekHasEnoughData(s, '2026-09-18')).toBe(true);
    expect(weekHasEnoughData(s.slice(0, 3), '2026-09-18')).toBe(false);
  });
});

describe('weeklyReviewInsights', () => {
  it('produces at least one insight for a week with low chest volume', () => {
    // Two light chest sessions plus a third (legs) session so the week has 3+ sessions but chest stays under band.
    const sessions = [
      session('2026-09-14', [{ id: bench, sets: sets(60, 8, 'ideal', 1) }]),
      session('2026-09-16', [{ id: bench, sets: sets(60, 8, 'ideal', 1) }]),
      session('2026-09-18', [{ id: 'lib_leg_press', sets: sets(100, 8, 'ideal', 3) }]),
    ];
    const profile: Profile = { name: 'Test' };
    const out = weeklyReviewInsights({
      sessions, today: '2026-09-18', custom: [], schedule: emptySchedule(), goal: 'lean', profile,
      weightLog: [], trainingAgeMonths: 24, exerciseIds: [{ id: bench, name: 'Barbell Bench Press' }],
    });
    expect(out.length).toBeGreaterThan(0);
    expect(out.some(i => i.id.startsWith('weekly:volume'))).toBe(true);
    for (const i of out) expect(i.evidence).toBeDefined();
  });
});
