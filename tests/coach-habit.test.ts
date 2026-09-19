import { describe, it, expect } from 'vitest';
import { learnHabits, detectHabit, minutesOfDay } from '@/brain/coach/detectors';
import { planSchedule } from '@/brain/coach/planners';
import { ctx, history, PUSH_ID, PULL_ID, PUSH_EX, PULL_EX, std, pplSplits } from './coach-helpers';

/** The last week is the current one, so Wednesday and Thursday have already happened by Saturday. */
const THIS_MONDAY = '2026-09-14';
const wedThu = (weeks: number, withSat?: (w: number) => boolean) => history(THIS_MONDAY, weeks, [
  { weekday: 'wed', splitId: PUSH_ID, hour: 18, minute: 0, exercises: () => std(PUSH_EX) },
  { weekday: 'thu', splitId: PULL_ID, hour: 18, minute: 30, exercises: () => std(PULL_EX) },
  { weekday: 'sat', splitId: PUSH_ID, hour: 9, minute: 0, exercises: w => (withSat?.(w) ? std(PUSH_EX) : []) },
]);

describe('habit learning', () => {
  it('finds the days and start times the user actually keeps', () => {
    const sessions = wedThu(12);
    const m = learnHabits(sessions, pplSplits(), '2026-09-19');
    expect(Object.keys(m.days).sort()).toEqual(['thu', 'wed']);
    expect(m.days.wed!.probability).toBeGreaterThanOrEqual(0.95);
    expect(m.days.wed!.startHour).toBe(18);
    expect(m.days.wed!.startMinute).toBe(0);
    expect(m.days.thu!.startMinute).toBe(30);
    expect(m.days.wed!.splitId).toBe(PUSH_ID);
    expect(m.days.thu!.splitId).toBe(PULL_ID);
    expect(m.sessionsPerWeek).toBe(2);
    expect(m.retired).toEqual([]);
    expect(minutesOfDay(sessions[0]!.startedAt)).toBe(18 * 60);
  });

  it('retires a Saturday habit that went cold, and reports it', () => {
    const sessions = wedThu(12, w => w < 8); // Saturdays only in the older weeks
    const m = learnHabits(sessions, pplSplits(), '2026-09-19');
    expect(m.retired).toEqual(['sat']);
    expect(m.days.sat).toBeUndefined();
    const f = detectHabit(ctx(sessions))[0]!;
    expect(f.kind).toBe('habit_pattern');
    expect(f.metrics.days).toBe('wed,thu');
    expect(f.metrics.retired).toBe('sat');
    expect(f.metrics.wed_start).toBe('18:00');
    expect(f.metrics.thu_start).toBe('18:30');
    expect(f.confidence).toBe('high');
  });

  it('stays quiet with fewer than six weeks and ignores one-off days', () => {
    expect(detectHabit(ctx(wedThu(4)))).toEqual([]);
    const sessions = wedThu(12, w => w === 5);
    const m = learnHabits(sessions, pplSplits(), '2026-09-19');
    expect(m.days.sat).toBeUndefined();
    expect(m.retired).toEqual([]);
  });

  it('proposes the learned schedule only where the schedule is empty, and clears never-used days after eight weeks', () => {
    const sessions = wedThu(12);
    const c = ctx(sessions, { schedule: { sun: null, mon: 'split_legs', tue: null, wed: null, thu: null, fri: null, sat: null } });
    const model = learnHabits(sessions, c.splits, c.today);
    const f = detectHabit(c, model)[0];
    const p = planSchedule(c, model, f)!;
    expect(p.kind).toBe('schedule');
    expect(p.apply.kind).toBe('schedule');
    if (p.apply.kind !== 'schedule') return;
    expect(p.apply.days.wed).toMatchObject({ splitId: PUSH_ID, startHour: 18, startMinute: 0 });
    expect(p.apply.days.thu).toMatchObject({ splitId: PULL_ID, startHour: 18, startMinute: 30 });
    expect(p.apply.days.mon).toBeNull();
    expect(p.dismissKey).toBe('schedule:*');
    expect(p.principles).toEqual(['habit_formation_and_cues']);
    const already = ctx(sessions, { schedule: { sun: null, mon: null, tue: null, wed: PUSH_ID, thu: PULL_ID, fri: null, sat: null } });
    expect(planSchedule(already, model, f)).toBeNull();
  });
});
