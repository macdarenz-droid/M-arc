/** BUG-38 (D-BUG38): today's and the next split follow the sessions done, not only the weekday. */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { splitPlan, type SplitPlanInput } from '@/brain/splitPlan';
import { readinessSeries } from '@/brain/coach/rules';
import { emptySchedule, type Session, type Split, type Weekday } from '@/core/models';
import { baseCoachExtras, sessionAt, sets } from './helpers';

vi.mock('@/slices/settings/reminders', () => ({ resyncReminders: vi.fn(async () => undefined) }));

// Local wall-clock instants, so this passes under any TZ npm run test:tz picks.
const local = (day: string, h: number, mi = 0): Date => { const [y, m, d] = day.split('-').map(Number); return new Date(y!, m! - 1, d!, h, mi); };
const sp = (id: string, name: string, exerciseId = 'lib_barbell_bench_press'): Split => ({ id, name, color: '#fff', focus: [], createdAt: '', exercises: [{ exerciseId, sets: 3 }] });
const mk = (day: string, split: Split | string, h = 17, durH = 1, name?: string, mi = 0): Session => {
  const id = typeof split === 'string' ? split : split.id;
  const ex = typeof split === 'string' ? 'lib_barbell_bench_press' : split.exercises[0]!.exerciseId;
  const start = local(day, h, mi), end = new Date(start.getTime() + durH * 3600_000);
  return { ...sessionAt(start.toISOString(), end.toISOString(), [{ id: ex, sets: sets(60, 8, 'max', 4) }], id), day, splitName: name ?? (typeof split === 'string' ? split : split.name) };
};
const sched = (m: Partial<Record<Weekday, string>>) => ({ ...emptySchedule(), ...m });
const plan = (i: Partial<SplitPlanInput> & Pick<SplitPlanInput, 'today' | 'now'>) => splitPlan({ schedule: emptySchedule(), splits: [], sessions: [], daysOff: [], ...i });

// Owner fixture OWN (card): only Sat and Sun come from the owner's report.
const S1 = sp('split_1', 'SPLIT 1 - UPPER BODY', 'lib_barbell_bench_press');
const S2 = sp('split_2', 'SPLIT 2 - LOWER AND CORE', 'lib_seated_leg_curl');
const S3 = sp('split_3', 'SPLIT 3', 'lib_lat_pulldown');
const S4 = sp('split_4', 'SPLIT 4 - CONDITIONING', 'lib_standing_calf_raise');
const OWN_SPLITS = [S1, S2, S3, S4];
const OWN_SCHEDULE = sched({ tue: S1.id, thu: S4.id, sat: S2.id, sun: S3.id });
const SAT = '2026-10-03', SUN = '2026-10-04';
const ownSat = () => mk(SAT, S3, 17);
const OWN = () => [mk('2026-09-29', S1), mk('2026-10-01', S4), ownSat()];
const OWN_BARE = () => [ownSat()];
const SAT_19 = local(SAT, 19).getTime();

describe('BUG-38 planner (src/brain/splitPlan.ts)', () => {
  it('BUG-38 owner: Sat SPLIT 3 done, SPLIT 2 skipped → next SPLIT 2 on Sun, moved from Sat, never SPLIT 3', () => {
    for (const sessions of [OWN(), OWN_BARE()]) {
      const p = plan({ schedule: OWN_SCHEDULE, splits: OWN_SPLITS, sessions, today: SAT, now: SAT_19 });
      expect(p.next).toEqual({ split: S2, day: SUN, weekday: 'sun', movedFrom: SAT });
      expect(p.next!.split.id).not.toBe(S3.id);
      expect(p.today?.split.id).toBe(S2.id);
      expect(p.days[1]).toEqual({ day: SUN, splitId: S2.id });
      // Sunday morning: the card's split is SPLIT 2, moved from Sat.
      const sun = plan({ schedule: OWN_SCHEDULE, splits: OWN_SPLITS, sessions, today: SUN, now: local(SUN, 8).getTime() });
      expect(sun.today).toEqual({ split: S2, day: SUN, weekday: 'sun', movedFrom: SAT, off: false });
    }
  });

  it('C done Thu → Fri doneEarly {C, Thu}; next on Thu is not C', () => {
    const A = sp('a', 'A'), C = sp('c', 'C');
    const schedule = sched({ mon: A.id, fri: C.id });
    const sessions = [mk('2026-10-01', C)];
    const thu = plan({ schedule, splits: [A, C], sessions, today: '2026-10-01', now: local('2026-10-01', 19).getTime() });
    expect(thu.next).toEqual({ split: A, day: '2026-10-05', weekday: 'mon' });
    expect(thu.days.find(d => d.day === '2026-10-02')).toEqual({ day: '2026-10-02', splitId: null });
    const fri = plan({ schedule, splits: [A, C], sessions, today: '2026-10-02', now: local('2026-10-02', 9).getTime() });
    expect(fri.today).toBeNull();
    expect(fri.doneEarly).toEqual({ split: C, on: '2026-10-01' });
  });

  it('Legs today and tomorrow, Legs done today → next Legs tomorrow', () => {
    const L = sp('legs', 'Legs', 'lib_barbell_back_squat');
    const p = plan({ schedule: sched({ sat: L.id, sun: L.id }), splits: [L], sessions: [mk(SAT, L)], today: SAT, now: SAT_19 });
    expect(p.next).toEqual({ split: L, day: SUN, weekday: 'sun' });
  });

  it('plan set mid-week, no sessions → nothing moved; a session on a rest day owes nothing', () => {
    const A = sp('a', 'A'), B = sp('b', 'B'), C = sp('c', 'C');
    const schedule = sched({ mon: A.id, wed: C.id, fri: B.id });
    const tue = '2026-09-29', now = local(tue, 19).getTime();
    const empty = plan({ schedule, splits: [A, B, C], today: tue, now });
    expect(empty.today).toBeNull();
    expect(empty.next).toEqual({ split: C, day: '2026-09-30', weekday: 'wed' });
    expect(empty.days.map(d => d.splitId)).toEqual([null, C.id, null, B.id, null, null, A.id, null]);
    // C on the rest day Tue covers Wed early. Mon's A was never displaced, so nothing moves into Wed.
    const p = plan({ schedule, splits: [A, B, C], sessions: [mk(tue, C)], today: tue, now });
    expect(p.days.find(d => d.day === '2026-09-30')).toEqual({ day: '2026-09-30', splitId: null });
    expect(p.next).toEqual({ split: B, day: '2026-10-02', weekday: 'fri' });
  });

  it('two displaced splits → the oldest fills the freed day', () => {
    const [A, B, C, D] = ['a', 'b', 'c', 'd'].map(x => sp(x, x.toUpperCase())) as [Split, Split, Split, Split];
    const schedule = sched({ mon: A.id, tue: B.id, thu: C.id, fri: D.id });
    const sessions = [mk('2026-09-28', C), mk('2026-09-29', D), mk('2026-09-30', C)];
    const p = plan({ schedule, splits: [A, B, C, D], sessions, today: '2026-09-30', now: local('2026-09-30', 19).getTime() });
    expect(p.next).toEqual({ split: A, day: '2026-10-01', weekday: 'thu', movedFrom: '2026-09-28' });
  });

  it('a split is never placed the day before its own day', () => {
    const Z = sp('z', 'Z'), Y = sp('y', 'Y');
    const schedule = sched({ mon: Z.id, tue: Y.id, wed: Z.id });
    const p = plan({ schedule, splits: [Z, Y], sessions: [mk('2026-09-28', Y)], today: '2026-09-28', now: local('2026-09-28', 19).getTime() });
    expect(p.days[1]).toEqual({ day: '2026-09-29', splitId: null });
    expect(p.next).toEqual({ split: Z, day: '2026-09-30', weekday: 'wed' });
  });

  it('a session after a missed day clears the debt: a later freed day stays done early', () => {
    const A = sp('a', 'A'), B = sp('b', 'B'), C = sp('c', 'C'), X = sp('x', 'X');
    const schedule = sched({ mon: A.id, thu: B.id, fri: C.id });
    // Mon: X instead of A. Tue: A, which pays the debt. Wed: B, early for Thu.
    const sessions = [mk('2026-09-28', X), mk('2026-09-29', A), mk('2026-09-30', B)];
    const p = plan({ schedule, splits: [A, B, C, X], sessions, today: '2026-09-30', now: local('2026-09-30', 19).getTime() });
    expect(p.days.find(d => d.day === '2026-10-01')).toEqual({ day: '2026-10-01', splitId: null });
    expect(p.next).toEqual({ split: C, day: '2026-10-02', weekday: 'fri' });
  });

  it('S2 owed, S2 done Wed with S4 also done Wed → Thu done early, next S2 Sat with no movedFrom', () => {
    const wed = '2026-10-07';
    const sessions = [...OWN(), mk(wed, S2, 10), mk(wed, S4, 17)];
    const p = plan({ schedule: OWN_SCHEDULE, splits: OWN_SPLITS, sessions, today: wed, now: local(wed, 20).getTime() });
    expect(p.days.find(d => d.day === '2026-10-08')).toEqual({ day: '2026-10-08', splitId: null });
    expect(p.next).toEqual({ split: S2, day: '2026-10-10', weekday: 'sat' });
  });

  it('QA8-1 fixture: at 01:00 today = own S2; at 07:00 doneEarly {S2, Fri}', () => {
    const lower = sp('split_lower', 'SPLIT 2 - LOWER AND CORE', 'lib_seated_leg_curl'), upper = sp('split_upper', 'Upper');
    const schedule = sched({ sat: lower.id, mon: upper.id });
    // Started Fri 23:30, ended Sat 00:40; stored day is Fri (QA8-4).
    const late = mk('2026-09-25', lower, 23, 70 / 60, undefined, 30);
    const at = (h: number) => plan({ schedule, splits: [lower, upper], sessions: [late], today: '2026-09-26', now: local('2026-09-26', h).getTime() });
    expect(at(1).today).toEqual({ split: lower, day: '2026-09-26', weekday: 'sat', off: false });
    expect(at(1).doneEarly).toBeNull();
    // 6h20m after it ended: the stored day applies, so it covered Sat early (the known 6-hour switch).
    expect(at(7).today).toBeNull();
    expect(at(7).doneEarly).toEqual({ split: lower, on: '2026-09-25' });
  });

  describe('remaining edges', () => {
    it('no schedule: today, next and doneEarly are null', () => {
      const p = plan({ splits: OWN_SPLITS, sessions: OWN(), today: SAT, now: SAT_19 });
      expect([p.today, p.next, p.doneEarly]).toEqual([null, null, null]);
      expect(p.days).toHaveLength(8);
      expect(p.days.every(d => d.splitId === null)).toBe(true);
    });

    it('a split on no weekday counts for no slot; today\'s split is owed and waits for a freed day', () => {
      const p = plan({ schedule: sched({ sat: S2.id, sun: S3.id }), splits: [S1, S2, S3], sessions: [mk(SAT, S1)], today: SAT, now: SAT_19 });
      expect(p.today?.split.id).toBe(S2.id);
      expect(p.next).toEqual({ split: S3, day: SUN, weekday: 'sun' });
    });

    it('renamed split (same id, new name) still matches; a deleted split\'s session counts for nothing', () => {
      const renamed = { ...ownSat(), splitName: 'Back day (old name)' };
      const p = plan({ schedule: OWN_SCHEDULE, splits: OWN_SPLITS, sessions: [renamed], today: SAT, now: SAT_19 });
      expect(p.next).toEqual({ split: S2, day: SUN, weekday: 'sun', movedFrom: SAT });
      // A session of a deleted split on Fri never covers Sat.
      const fri = mk('2026-10-02', 'split_gone');
      const q = plan({ schedule: OWN_SCHEDULE, splits: OWN_SPLITS, sessions: [fri], today: SAT, now: local(SAT, 8).getTime() });
      expect(q.today?.split.id).toBe(S2.id);
      expect(q.doneEarly).toBeNull();
    });

    it('two splits in one day: each counts for one slot', () => {
      const p = plan({ schedule: OWN_SCHEDULE, splits: OWN_SPLITS, sessions: [...OWN(), mk(SAT, S2, 10)], today: SAT, now: SAT_19 });
      expect(p.days[1]).toEqual({ day: SUN, splitId: null });
      expect(p.next).toEqual({ split: S1, day: '2026-10-06', weekday: 'tue' });
    });

    it('Sun-to-Mon swap across the week boundary', () => {
      const A = sp('a', 'A'), B = sp('b', 'B');
      const p = plan({ schedule: sched({ sun: A.id, mon: B.id }), splits: [A, B], sessions: [mk(SUN, B)], today: SUN, now: local(SUN, 19).getTime() });
      expect(p.next).toEqual({ split: A, day: '2026-10-05', weekday: 'mon', movedFrom: SUN });
    });

    it('past session logged later: S2 logged for Sat → next Tue S1', () => {
      const p = plan({ schedule: OWN_SCHEDULE, splits: OWN_SPLITS, sessions: [...OWN(), mk(SAT, S2, 10)], today: SUN, now: local(SUN, 10).getTime() });
      expect(p.today).toBeNull();
      expect(p.doneEarly).toEqual({ split: S3, on: SAT });
      expect(p.next).toEqual({ split: S1, day: '2026-10-06', weekday: 'tue' });
    });

    it('day off: today keeps its split with off; a past day off owes nothing', () => {
      const p = plan({ schedule: OWN_SCHEDULE, splits: OWN_SPLITS, sessions: OWN(), daysOff: [SAT], today: SAT, now: SAT_19 });
      expect(p.today).toEqual({ split: S2, day: SAT, weekday: 'sat', off: true });
      // Sunday, with Saturday taken off: SPLIT 3 still covered Sun early, and nothing was owed.
      const sun = plan({ schedule: OWN_SCHEDULE, splits: OWN_SPLITS, sessions: OWN(), daysOff: [SAT], today: SUN, now: local(SUN, 8).getTime() });
      expect(sun.today).toBeNull();
      expect(sun.doneEarly).toEqual({ split: S3, on: SAT });
    });

    it('sessions after today are ignored', () => {
      const p = plan({ schedule: OWN_SCHEDULE, splits: OWN_SPLITS, sessions: [...OWN(), mk(SUN, S2, 12)], today: SAT, now: SAT_19 });
      expect(p.next).toEqual({ split: S2, day: SUN, weekday: 'sun', movedFrom: SAT });
    });
  });
});

describe('BUG-38 readiness', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.resetModules(); });
  afterEach(() => { vi.useRealTimers(); });

  it('BUG-38 owner: todayReadiness.postSessionAdvice === "Today\'s session is done. Recover well; SPLIT 2 - LOWER AND CORE is next on Sun."', async () => {
    vi.setSystemTime(new Date(SAT_19));
    const { replaceState } = await import('@/core/store');
    const { freshState } = await import('@/core/models');
    const S = await import('@/app/selectors');
    replaceState({ ...freshState(), splits: OWN_SPLITS, schedule: OWN_SCHEDULE, sessions: OWN(), checkIns: [{ day: SAT, sleepQuality: 4, mood: 4 }] });
    expect(S.today.value).toBe(SAT);
    const r = S.todayReadiness.value;
    expect(r).not.toBeNull();
    expect(r!.postSessionAdvice).toBe('Today\'s session is done. Recover well; SPLIT 2 - LOWER AND CORE is next on Sun.');
  });

  it('BUG-38: readinessSeries on Sun scores Sat with SPLIT 2 next, even after S2 was done Sun', () => {
    const ctx = {
      ...baseCoachExtras, today: SUN, now: local(SUN, 19).getTime(), splits: OWN_SPLITS, schedule: OWN_SCHEDULE, custom: [],
      sessions: [...OWN(), mk(SUN, S2, 12)], checkIns: [{ day: SAT, sleepQuality: 4 as const, mood: 4 as const }, { day: SUN, sleepQuality: 4 as const, mood: 4 as const }],
    };
    const sat = readinessSeries(ctx, 2)[1];
    expect(sat).not.toBeNull();
    expect(sat!.postSessionAdvice).toBe('Today\'s session is done. Recover well; SPLIT 2 - LOWER AND CORE is next on Sun.');
  });
});

describe('BUG-38 one source of truth', () => {
  it('source scan', () => {
    const files: string[] = [];
    const walk = (dir: string) => { for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) walk(p); else if (/\.tsx?$/.test(f)) files.push(p); } };
    walk('src');
    expect(files.length).toBeGreaterThan(100);
    const hits = (re: RegExp) => files.flatMap(f => (readFileSync(f, 'utf8').match(re) ?? []).map(() => f.replace(/\\/g, '/')));
    expect(hits(/nextScheduled\(/g)).toEqual(['src/core/dates.ts']);
    expect(hits(/nextScheduledSplitOf|nextScheduledSplitFor|scheduledSplitId/g)).toEqual([]);
    const lookups = hits(/schedule\[weekdayOf\(/g);
    expect(lookups.filter(f => f === 'src/brain/coach/rules.ts')).toHaveLength(1);
    expect(lookups.filter(f => f === 'src/native/notifications.ts')).toHaveLength(1);
    expect([...new Set(lookups)].sort()).toEqual(['src/brain/coach/rules.ts', 'src/brain/splitPlan.ts', 'src/brain/weekly.ts', 'src/native/notifications.ts']);
  });
});
