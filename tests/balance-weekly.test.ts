import { describe, it, expect } from 'vitest';
import { trainingBalance } from '@/brain/balance';
import { trainingStreak, weekSummary, weeklyVolumeHistory } from '@/brain/weekly';
import { buildReport } from '@/brain/coach/report';
import { insightsFrom, type RenderContext } from '@/brain/coach/words';
import type { BrainContext } from '@/brain/coach/context';
import { emptySchedule } from '@/core/models';
import { session, sets } from './helpers';

describe('balance', () => {
  it('flags heavy push with no pull over three weeks', () => {
    const days = ['2026-09-01', '2026-09-04', '2026-09-08', '2026-09-11', '2026-09-15'];
    const s = days.map(d => session(d, [{ id: 'lib_barbell_bench_press', sets: sets(60, 8, 'ideal', 5) }, { id: 'lib_shoulder_press', sets: sets(30, 8, 'ideal', 4) }]));
    const b = trainingBalance(s, '2026-09-18');
    expect(b?.pair).toBe('push_pull');
    expect(b?.weak).toBe('Pull');
  });
  it('stays quiet with balanced work', () => {
    const days = ['2026-09-01', '2026-09-04', '2026-09-08', '2026-09-11', '2026-09-15'];
    const s = days.map(d => session(d, [{ id: 'lib_barbell_bench_press', sets: sets(60, 8, 'ideal', 4) }, { id: 'lib_lat_pulldown', sets: sets(50, 8, 'ideal', 4) }, { id: 'lib_leg_press', sets: sets(100, 8, 'ideal', 4) }]));
    expect(trainingBalance(s, '2026-09-18')).toBeNull();
  });
});

describe('weekly', () => {
  it('summarises the current week', () => {
    const s = [session('2026-09-14', [{ id: 'lib_barbell_bench_press', sets: sets(60, 8) }]), session('2026-09-16', [{ id: 'lib_barbell_bench_press', sets: sets(62.5, 8) }])];
    const w = weekSummary(s, '2026-09-18');
    expect(w.workouts).toBe(2);
    expect(w.sets).toBe(6);
    expect(w.volumeKg).toBe(60 * 8 * 3 + 62.5 * 8 * 3);
    expect(w.records.length).toBeGreaterThan(0);
    expect(w.grade.title).toBe('Building momentum');
  });
  it('reports one entry per week, oldest first, ending on the current week', () => {
    const s = [session('2026-08-03', [{ id: 'lib_barbell_bench_press', sets: sets(60, 8) }]), session('2026-09-14', [{ id: 'lib_barbell_bench_press', sets: sets(62.5, 8) }])];
    const weeks = weeklyVolumeHistory(s, '2026-09-18', 8);
    expect(weeks).toHaveLength(8);
    expect(weeks.every((w, i) => i === 0 || w.start > weeks[i - 1]!.start)).toBe(true); // oldest first
    const last = weeks.at(-1)!;
    expect(last.start).toBe(weekSummary(s, '2026-09-18').start); // last entry is the current week
    const withBench = weeks.find(w => w.start <= '2026-09-14' && w.end >= '2026-09-14');
    expect(withBench?.sets).toBe(3);
    expect(withBench?.volumeKg).toBe(62.5 * 8 * 3);
  });

  it('a week with nothing logged is a real zero, not skipped', () => {
    const weeks = weeklyVolumeHistory([], '2026-09-18', 4);
    expect(weeks).toHaveLength(4);
    for (const w of weeks) expect(w).toMatchObject({ sets: 0, volumeKg: 0 });
  });

  it('schedule-aware streak ignores rest days and forgives today', () => {
    const schedule = { ...emptySchedule(), mon: 'split_push', wed: 'split_pull', fri: 'split_legs' };
    const s = [session('2026-09-14', [{ id: 'lib_barbell_bench_press', sets: sets(60, 8) }]), session('2026-09-16', [{ id: 'lib_lat_pulldown', sets: sets(60, 8) }])];
    expect(trainingStreak(s, schedule, '2026-09-18')).toBe(2); // Friday not yet done
    expect(trainingStreak(s, schedule, '2026-09-21')).toBe(0); // Friday missed
    expect(trainingStreak(s, emptySchedule(), '2026-09-17')).toBe(1); // yesterday counts, today is forgiven
    expect(trainingStreak(s, emptySchedule(), '2026-09-18')).toBe(0);
    expect(trainingStreak(s, emptySchedule(), '2026-09-16')).toBe(1);
  });
});

describe('coach', () => {
  const ctx = (sessions: BrainContext['sessions']): BrainContext => ({ sessions, splits: [], schedule: emptySchedule(), custom: [], goal: 'lean', restDefaultSec: 90, health: { connected: false }, readiness: [], today: '2026-09-18', now: new Date('2026-09-18T12:00:00Z').getTime(), dismissed: {}, accepted: {} });
  const render: RenderContext = { unit: 'kg', splits: [], custom: [], today: '2026-09-18', goal: 'lean' };
  it('asks for a first session on an empty app', () => {
    const insights = insightsFrom(buildReport(ctx([])), render);
    expect(insights[0]?.id).toBe('first_sessions:baseline');
    expect(insights[0]?.title).toBe('Start with a few sessions');
  });
  it('flags missing effort ratings and imbalance with plain words', () => {
    const days = ['2026-09-01', '2026-09-04', '2026-09-08', '2026-09-11', '2026-09-15'];
    const s = days.map(d => session(d, [{ id: 'lib_barbell_bench_press', sets: sets(60, 8, null, 5) }, { id: 'lib_shoulder_press', sets: sets(30, 8, undefined, 4) }]));
    const insights = insightsFrom(buildReport(ctx(s)), render);
    const ids = insights.map(i => i.id);
    expect(ids).toContain('balance_imbalance:push_pull');
    expect(ids).toContain('effort_missing:recent');
    for (const i of insights) expect(i.action.length).toBeGreaterThan(10);
  });
});
