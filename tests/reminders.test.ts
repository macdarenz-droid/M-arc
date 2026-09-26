import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

interface Scheduled { id: number; extra?: { day?: string } }

const plugin = vi.hoisted(() => {
  let pending: Scheduled[] = [];
  return {
    schedule: vi.fn(async ({ notifications }: { notifications: Scheduled[] }) => { pending = notifications; return { notifications: [] }; }),
    cancel: vi.fn(async () => { pending = []; }),
    getPending: vi.fn(async () => ({ notifications: pending })),
    createChannel: vi.fn(async () => undefined),
    checkPermissions: vi.fn(async () => ({ display: 'granted' })),
    requestPermissions: vi.fn(async () => ({ display: 'granted' })),
    checkExactNotificationSetting: vi.fn(async () => ({ exact_alarm: 'denied' })),
    changeExactNotificationSetting: vi.fn(async () => ({ exact_alarm: 'granted' })),
    addListener: vi.fn(),
  };
});
vi.mock('@capacitor/local-notifications', () => ({ LocalNotifications: plugin }));
vi.mock('@/native/capacitor', () => ({ isNative: () => true }));

import { replaceState } from '@/core/store';
import { freshState, type Split } from '@/core/models';
import { resyncReminders } from '@/slices/settings/reminders';
import { refreshClock } from '@/app/selectors';
import { sessionAt } from './helpers';

const split: Split = { id: 'sp', name: 'Push', color: '#fff', focus: [], createdAt: '', exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }] };
// 2026-09-26 is a Saturday.
const withSchedule = (extra: Partial<ReturnType<typeof freshState>> = {}) => ({
  ...freshState(), splits: [split], schedule: { ...freshState().schedule, sat: split.id },
  preferences: { ...freshState().preferences, reminders: { enabled: true, time: '20:00', style: 'silent' as const } },
  ...extra,
});

beforeEach(() => { vi.useFakeTimers(); vi.clearAllMocks(); vi.setSystemTime(new Date('2026-09-26T08:00:00Z')); refreshClock(); });
afterEach(() => { vi.useRealTimers(); });

describe('resyncReminders skips a day already trained (QA8-3, QA8-4)', () => {
  it('schedules today when nothing has been trained yet', async () => {
    replaceState(withSchedule());
    await resyncReminders();
    const todays = plugin.schedule.mock.calls[0]![0].notifications.filter((n: Scheduled) => n.extra?.day === '2026-09-26');
    expect(todays.length).toBe(1);
  });

  it('does not schedule today once a same-day session is done', async () => {
    const doneToday = sessionAt('2026-09-26T08:30:00.000Z', '2026-09-26T09:30:00.000Z', [], split.id);
    replaceState(withSchedule({ sessions: [doneToday] }));
    await resyncReminders();
    const todays = plugin.schedule.mock.calls[0]![0].notifications.filter((n: Scheduled) => n.extra?.day === '2026-09-26');
    expect(todays.length).toBe(0);
  });

  it('does not schedule today for a session that started before midnight and ended today, within 6h (QA8-4)', async () => {
    // Checked at 05:30, 4h50m after the session ended — inside the 6h window.
    vi.setSystemTime(new Date('2026-09-26T05:30:00Z'));
    refreshClock();
    const doneJustAfterMidnight = sessionAt('2026-09-25T23:30:00.000Z', '2026-09-26T00:40:00.000Z', [], split.id);
    replaceState(withSchedule({ sessions: [doneJustAfterMidnight] }));
    await resyncReminders();
    const calls = plugin.schedule.mock.calls;
    const todays = calls.length ? calls[0]![0].notifications.filter((n: Scheduled) => n.extra?.day === '2026-09-26') : [];
    expect(todays.length).toBe(0);
  });
});
