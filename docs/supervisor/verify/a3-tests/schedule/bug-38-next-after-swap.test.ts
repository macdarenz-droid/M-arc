/** A3 verify BUG-38: after doing SPLIT 3 on a day SPLIT 1 was scheduled, no screen may say "SPLIT 3 is next". */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sessionAt, sets, baseCoachExtras } from '../../helpers';
import { emptySchedule, type Split } from '@/core/models';

vi.mock('@/slices/settings/reminders', () => ({ resyncReminders: vi.fn(async () => undefined) }));

const local = (y: number, m: number, d: number, h: number, mi: number): Date => new Date(y, m - 1, d, h, mi);
const BENCH = 'lib_barbell_bench_press', SQUAT = 'lib_barbell_back_squat', ROW = 'lib_barbell_row';
const s1Lower: Split = { id: 'split_1', name: 'SPLIT 1', color: '#fff', focus: [], createdAt: '', exercises: [{ exerciseId: SQUAT, sets: 3 }] };
const s3Push: Split = { id: 'split_3', name: 'SPLIT 3', color: '#fff', focus: [], createdAt: '', exercises: [{ exerciseId: BENCH, sets: 3 }] };
const THU = '2026-10-01';
const schedule = { ...emptySchedule(), thu: 'split_1', sun: 'split_3' };
// Thursday 18:00-19:00 local: SPLIT 3 done instead of the scheduled SPLIT 1.
const doneS3 = () => ({ ...sessionAt(local(2026, 10, 1, 18, 0).toISOString(), local(2026, 10, 1, 19, 0).toISOString(), [{ id: BENCH, sets: sets(80, 8, 'max', 4) }], 'split_3'), day: THU, splitName: 'SPLIT 3' });

beforeEach(() => { vi.useFakeTimers(); vi.resetModules(); vi.setSystemTime(local(2026, 10, 1, 20, 0)); });
afterEach(() => { vi.useRealTimers(); });

describe('BUG-38: the next session ignores the split just done', () => {
  it('Today readiness card (selectors.todayReadiness, readiness.ts:327) does not say SPLIT 3 is next', async () => {
    const { replaceState } = await import('@/core/store');
    const { freshState } = await import('@/core/models');
    const S = await import('@/app/selectors');
    replaceState({ ...freshState(), splits: [s1Lower, s3Push], schedule, sessions: [doneS3()] });
    expect(S.today.value).toBe(THU);
    const r = S.todayReadiness.value;
    expect(r?.postSessionAdvice).toBeDefined();
    expect.soft(r!.postSessionAdvice).not.toContain('SPLIT 3 is next');
    expect(r!.drivers.join(' | ')).not.toContain('for SPLIT 3 on Sun');
  });

  it('Escobar readinessToday (context.ts:58 nextScheduledSplitFor) does not say SPLIT 3 is next', async () => {
    const { freshState } = await import('@/core/models');
    const { makeCtx, readinessToday } = await import('@/escobar/tools/context');
    const ctx = makeCtx({ ...freshState(), splits: [s1Lower, s3Push], schedule, sessions: [doneS3()] }, Date.now());
    expect(readinessToday(ctx)?.postSessionAdvice ?? '').not.toContain('SPLIT 3 is next');
  });

  it('Coach done-today card (rules.ts:232-252) names the split actually done and does not offer it as next', async () => {
    const { coachInsights } = await import('@/brain/coach/rules');
    // SPLIT 1 shares chest with SPLIT 3 here, so the rule takes its done-today branch via worst.lastDay === today.
    const s1Upper: Split = { ...s1Lower, exercises: [{ exerciseId: BENCH, sets: 3 }, { exerciseId: ROW, sets: 3 }] };
    const ctx = { ...baseCoachExtras, today: THU, now: Date.now(), splits: [s1Upper, s3Push], schedule, custom: [], sessions: [doneS3()] };
    const card = coachInsights(ctx, 20).find(i => i.id.startsWith('recovery.done-today'));
    expect(card, 'done-today card').toBeDefined();
    expect.soft(card!.title).toBe('Done today: SPLIT 3');
    expect(card!.means).not.toContain('Next: SPLIT 3');
  });
});
