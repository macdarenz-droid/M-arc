// BUG-39 (rule D-BUG39): the streak counts training days while every finished week reaches its planned sessions.
import { describe, it, expect } from 'vitest';
import { plannedSessions, trainingStreak, weekSummary } from '@/brain/weekly';
import { emptySchedule, freshState, type Weekday } from '@/core/models';
import { replaceState, state } from '@/core/store';
import { streak, today } from '@/app/selectors';
import { makeCtx } from '@/escobar/tools/context';
import { getOverview } from '@/escobar/tools/read';
import { session, sets } from './helpers';

const day = (d: string) => ({ ...session(`2026-${d}`, [{ id: 'lib_barbell_bench_press', sets: sets(45, 12) }]), day: `2026-${d}` });
const warmupOnly = (d: string) => ({ ...session(`2026-${d}`, [{ id: 'lib_barbell_bench_press', sets: sets(45, 12).map(x => ({ ...x, kind: 'warmup' as const })) }]), day: `2026-${d}` });
const days = (...ds: string[]) => ds.map(day);
const sched = (...ws: Weekday[]) => ({ ...emptySchedule(), ...Object.fromEntries(ws.map(w => [w, 'sp'])) });
const mwf = sched('mon', 'wed', 'fri');

describe('BUG-39 AC1: the owner moved weekdays but hit every planned week', () => {
  const s = days('09-28', '09-30', '10-03', '10-04', '10-06', '10-07', '10-09', '10-11', '10-13', '10-17', '10-18');
  for (const ws of [['wed'], ['wed', 'sun'], ['wed', 'sat'], ['wed', 'sat', 'sun']] as Weekday[][]) {
    it(`{${ws.join(',')}}: 9 on 15 Oct, 11 on 18 Oct`, () => {
      const schedule = sched(...ws);
      expect(weekSummary(s, '2026-10-18', [], plannedSessions({ schedule, daysOff: [] }, '2026-10-18')).grade.title).toBe('Strong week');
      expect(trainingStreak(s, schedule, '2026-10-15')).toBe(9);
      expect(trainingStreak(s, schedule, '2026-10-18')).toBe(11);
    });
  }
});

describe('BUG-39 AC2-AC7: weeks on plan, one free miss per 4 weeks', () => {
  it('AC2: two short-by-one weeks two weeks apart stop at the second', () => {
    const s = days('09-07', '09-09', '09-11', '09-14', '09-16', '09-21', '09-23', '09-25', '09-28', '09-30');
    expect(trainingStreak(s, mwf, '2026-10-05')).toBe(5);
  });
  it('AC3: a miss 4 weeks after the last forgiven one is forgiven, 3 weeks after is not', () => {
    const full = (mon: string, wed: string, fri: string) => [mon, wed, fri];
    const base = [...full('08-10', '08-12', '08-14'), ...full('08-31', '09-02', '09-04'), ...full('09-07', '09-09', '09-11'), '09-14', '09-16'];
    expect(trainingStreak(days(...base, ...full('08-24', '08-26', '08-28'), '08-17', '08-19'), mwf, '2026-09-21')).toBe(16);
    expect(trainingStreak(days(...base, ...full('08-17', '08-19', '08-21'), '08-24', '08-26'), mwf, '2026-09-21')).toBe(8);
  });
  it('AC4: today\'s week is not judged; short by 2 stops', () => {
    const s = days('09-07', '09-09', '09-11', '09-14', '09-16', '09-23');
    expect(trainingStreak(s, mwf, '2026-09-23')).toBe(6);
    expect(trainingStreak(s, mwf, '2026-09-28')).toBe(0);
  });
  it('AC5: days off lower the target; warm-up-only sessions do not count', () => {
    const s = days('09-07', '09-14', '09-16', '09-18', '09-23');
    expect(trainingStreak(s, mwf, '2026-09-28')).toBe(0);
    expect(trainingStreak(s, mwf, '2026-09-28', ['2026-09-21'])).toBe(5);
    const w = [day('09-07'), day('09-14'), warmupOnly('09-16'), day('09-18'), day('09-23')];
    expect(trainingStreak(w, mwf, '2026-09-21')).toBe(3);
    expect(trainingStreak(w, mwf, '2026-09-28', ['2026-09-21'])).toBe(1);
  });
  it('AC6: no schedule uses plannedDays; no plan at all keeps consecutive days', () => {
    const s = days('09-01', '09-02', '09-04', '09-07', '09-09', '09-11', '09-14', '09-17', '09-19');
    expect(trainingStreak(s, emptySchedule(), '2026-09-21', [], 3)).toBe(9);
    expect(trainingStreak(s, emptySchedule(), '2026-09-21', [], 4)).toBe(3);
    expect(trainingStreak(s, emptySchedule(), '2026-09-20')).toBe(1);
  });
  it('AC7: the first week is not judged', () => {
    expect(trainingStreak(days('09-11', '09-14', '09-16', '09-18'), mwf, '2026-09-21')).toBe(4);
  });
});

describe('BUG-39 AC8: Today and Escobar pass plannedDays', () => {
  it('streak and get_overview.streak read 9', () => {
    const st = freshState();
    replaceState({ ...st, sessions: days('09-01', '09-02', '09-04', '09-07', '09-09', '09-11', '09-14', '09-17', '09-19'), profile: { ...st.profile, plannedDays: 3 } });
    today.value = '2026-09-21';
    expect(streak.value).toBe(9);
    expect((getOverview({}, makeCtx(state.value, new Date(2026, 8, 21, 12).getTime())) as { streak: number }).streak).toBe(9);
  });
});
