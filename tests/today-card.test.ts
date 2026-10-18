/** BUG-38 (D-BUG38) and UI-R03: the Today session card and today's readiness follow the plan. */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { splitPlan } from '@/brain/splitPlan';
import { sessionCardState } from '@/slices/today/cardState';
import { emptySchedule, type Session, type Split } from '@/core/models';
import { sessionAt, sets } from './helpers';

vi.mock('@/slices/settings/reminders', () => ({ resyncReminders: vi.fn(async () => undefined) }));

const local = (day: string, h: number): Date => { const [y, m, d] = day.split('-').map(Number); return new Date(y!, m! - 1, d!, h, 0); };
const sp = (id: string, name: string, exerciseId = 'lib_barbell_bench_press'): Split => ({ id, name, color: '#fff', focus: [], createdAt: '', exercises: [{ exerciseId, sets: 3 }] });
const mk = (day: string, splitId: string, exerciseId = 'lib_barbell_bench_press', h = 17, kg = 60): Session =>
  ({ ...sessionAt(local(day, h).toISOString(), local(day, h + 1).toISOString(), [{ id: exerciseId, sets: sets(kg, 6, 'max', 6) }], splitId), day });

const S2 = sp('split_2', 'SPLIT 2 - LOWER AND CORE', 'lib_seated_leg_curl');
const S3 = sp('split_3', 'SPLIT 3', 'lib_lat_pulldown');
const OWN_SCHEDULE = { ...emptySchedule(), sat: S2.id, sun: S3.id };
const SAT = '2026-10-03', SUN = '2026-10-04';

describe('BUG-38 Today card state (src/slices/today/cardState.ts)', () => {
  it('BUG-38 owner Sunday: ready, \'Moved from Sat\', SPLIT 2', () => {
    const plan = splitPlan({ schedule: OWN_SCHEDULE, splits: [S2, S3], sessions: [mk(SAT, S3.id)], daysOff: [], today: SUN, now: local(SUN, 8).getTime() });
    expect(sessionCardState({ live: false, doneCount: 0, plan })).toEqual({ status: 'ready', eyebrow: 'Moved from Sat', split: S2 });
  });

  it('early: \'Done Thu\'', () => {
    const C = sp('c', 'C');
    const plan = splitPlan({ schedule: { ...emptySchedule(), fri: C.id }, splits: [C], sessions: [mk('2026-10-01', C.id)], daysOff: [], today: '2026-10-02', now: local('2026-10-02', 9).getTime() });
    expect(sessionCardState({ live: false, doneCount: 0, plan })).toEqual({ status: 'early', eyebrow: 'Done Thu', split: C });
  });

  it('off keeps the split', () => {
    const plan = splitPlan({ schedule: OWN_SCHEDULE, splits: [S2, S3], sessions: [], daysOff: [SAT], today: SAT, now: local(SAT, 9).getTime() });
    expect(sessionCardState({ live: false, doneCount: 0, plan })).toEqual({ status: 'off', eyebrow: 'Day off', split: S2 });
  });

  it('live, done, a plain scheduled day and a rest day keep their cards', () => {
    const plan = splitPlan({ schedule: OWN_SCHEDULE, splits: [S2, S3], sessions: [], daysOff: [], today: SAT, now: local(SAT, 9).getTime() });
    expect(sessionCardState({ live: true, doneCount: 1, plan }).status).toBe('live');
    expect(sessionCardState({ live: false, doneCount: 1, plan })).toEqual({ status: 'done', eyebrow: 'Today' });
    expect(sessionCardState({ live: false, doneCount: 0, plan })).toEqual({ status: 'ready', eyebrow: 'Scheduled today', split: S2 });
    const rest = splitPlan({ schedule: OWN_SCHEDULE, splits: [S2, S3], sessions: [], daysOff: [], today: '2026-10-05', now: local('2026-10-05', 9).getTime() });
    expect(sessionCardState({ live: false, doneCount: 0, plan: rest })).toEqual({ status: 'rest', eyebrow: 'Rest day' });
  });
});

describe('UI-R03: a day off is shared by readiness and Escobar', () => {
  const THU = '2026-10-01';
  const TARGET_DRIVER = 'the muscles you would train today are not fully recovered';
  const push = sp('split_push', 'Push');
  beforeEach(() => { vi.useFakeTimers(); vi.resetModules(); vi.setSystemTime(local(THU, 9)); });
  afterEach(() => { vi.useRealTimers(); });

  async function setup() {
    const { replaceState, state } = await import('@/core/store');
    const { freshState } = await import('@/core/models');
    const S = await import('@/app/selectors');
    const { setDayOff } = await import('@/slices/today/dayOff');
    // Wed evening: chest trained hard in another split (a Push session would cover Thu early).
    replaceState({ ...freshState(), splits: [push], schedule: { ...emptySchedule(), thu: push.id }, sessions: [mk('2026-09-30', 'split_other', 'lib_barbell_bench_press', 18, 100)] });
    expect(S.today.value).toBe(THU);
    return { S, state, setDayOff };
  }

  it('Take today off removes the scheduled-muscle input from readiness; Undo restores it', async () => {
    const { S, setDayOff } = await setup();
    expect(S.todayReadiness.value?.drivers).toContain(TARGET_DRIVER);
    setDayOff(THU, true, false);
    expect(S.scheduledSplit.value).toBeUndefined();
    expect(S.todayReadiness.value?.drivers ?? []).not.toContain(TARGET_DRIVER);
    setDayOff(THU, false, false);
    expect(S.todayReadiness.value?.drivers).toContain(TARGET_DRIVER);
  });

  it('Escobar brief and overview do not present a day taken off as a scheduled Push day', async () => {
    const { state, setDayOff } = await setup();
    setDayOff(THU, true, false);
    const { makeCtx } = await import('@/escobar/tools/context');
    const { getOverview } = await import('@/escobar/tools/read');
    const { buildBrief } = await import('@/escobar/context/brief');
    const ctx = makeCtx(state.value, Date.now());
    const brief = buildBrief({ ctx, mode: 'chat', turnIndex: 0, ledger: [] });
    expect(brief.lines.today).toMatch(/^day off, Push planned \(splitId split_push\)/);
    expect((getOverview(undefined, ctx) as unknown as { scheduled: unknown }).scheduled).toBeNull();
  });
});
