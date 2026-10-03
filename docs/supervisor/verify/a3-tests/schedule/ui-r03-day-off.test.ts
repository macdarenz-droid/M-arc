/** A3 verify UI-R03: a day taken off must remove today's scheduled-split conflict and its readiness input; Undo restores them. */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sessionAt, sets } from '../../helpers';
import { emptySchedule, type Split } from '@/core/models';

vi.mock('@/slices/settings/reminders', () => ({ resyncReminders: vi.fn(async () => undefined) }));

const local = (y: number, m: number, d: number, h: number, mi: number): Date => new Date(y, m - 1, d, h, mi);
const BENCH = 'lib_barbell_bench_press';
const push: Split = { id: 'split_push', name: 'Push', color: '#fff', focus: [], createdAt: '', exercises: [{ exerciseId: BENCH, sets: 3 }] };
const THU = '2026-10-01';
const TARGET_DRIVER = 'the muscles you would train today are not fully recovered';

beforeEach(() => { vi.useFakeTimers(); vi.resetModules(); });
afterEach(() => { vi.useRealTimers(); });

async function setup() {
  vi.setSystemTime(local(2026, 10, 1, 9, 0)); // Thursday 09:00 local
  const { replaceState, state } = await import('@/core/store');
  const { freshState } = await import('@/core/models');
  const S = await import('@/app/selectors');
  const { setDayOff } = await import('@/slices/today/dayOff');
  // Wednesday evening: six max-effort bench sets.
  const wed = { ...sessionAt(local(2026, 9, 30, 18, 0).toISOString(), local(2026, 9, 30, 19, 0).toISOString(), [{ id: BENCH, sets: sets(100, 6, 'max', 6) }], 'split_push'), day: '2026-09-30' };
  replaceState({ ...freshState(), splits: [push], schedule: { ...emptySchedule(), thu: 'split_push' }, sessions: [wed] });
  expect(S.today.value).toBe(THU);
  return { S, state, setDayOff };
}

const conflict = (S: typeof import('@/app/selectors')) => S.insights.value.concat(S.hiddenInsights.value).find(i => i.id.startsWith('scheduled-conflict'));

describe('UI-R03: day off is honoured by coach and readiness', () => {
  it('precondition: with Push scheduled and chest fatigued, the conflict and the target-muscle driver show', async () => {
    const { S } = await setup();
    expect(conflict(S)?.title).toMatch(/^Push today, but chest is only \d+% recovered$/);
    expect(S.todayReadiness.value?.drivers).toContain(TARGET_DRIVER);
  });

  it('Take today off removes the "Push today" conflict from the coach', async () => {
    const { S, setDayOff, state } = await setup();
    setDayOff(THU, true, false);
    expect(state.value.daysOff).toEqual([THU]);
    expect(conflict(S)?.title, `action still shown: ${conflict(S)?.action}`).toBeUndefined();
  });

  it('Take today off removes the scheduled-muscle input from readiness', async () => {
    const { S, setDayOff } = await setup();
    setDayOff(THU, true, false);
    expect(S.todayReadiness.value?.drivers ?? []).not.toContain(TARGET_DRIVER);
  });

  it('Undo day off restores the conflict and the driver', async () => {
    const { S, setDayOff } = await setup();
    setDayOff(THU, true, false);
    setDayOff(THU, false, false);
    expect(conflict(S)).toBeDefined();
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
    expect(brief.lines.today, 'brief "today" line').not.toMatch(/^scheduled Push/);
    const ov = getOverview(undefined, ctx) as unknown as Record<string, unknown>;
    // Correct: no scheduled split, or a day-off fact next to it.
    expect(ov.scheduled === null || 'dayOff' in ov, `overview.scheduled=${JSON.stringify(ov.scheduled)}; keys=${Object.keys(ov).join(',')}`).toBe(true);
  });
});
