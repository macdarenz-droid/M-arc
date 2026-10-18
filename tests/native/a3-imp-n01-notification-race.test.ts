/** IMP-N01: an older notification request must not undo a newer cancellation (latest intent wins). */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type N = { id: number };
const plugin = vi.hoisted(() => {
  const pending = new Map<number, { id: number }>();
  return {
    pending,
    schedule: vi.fn(async ({ notifications }: { notifications: N[] }) => { for (const n of notifications) pending.set(n.id, n); return { notifications: [] }; }),
    cancel: vi.fn(async ({ notifications }: { notifications: N[] }) => { for (const n of notifications) pending.delete(n.id); }),
    getPending: vi.fn(async () => ({ notifications: [...pending.values()] })),
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

import { replaceState, update, state } from '@/core/store';
import { freshState } from '@/core/models';
import { scheduleRestDone, cancelRestDone, syncTrainingReminders, syncBackupReminder, backupReminderScheduled, BACKUP_REMINDER_ID } from '@/native/notifications';
import { resyncReminders, reminderHealth } from '@/slices/settings/reminders';
import { refreshClock } from '@/app/selectors';

const REST_ID = 880001;
const flush = async () => { for (let i = 0; i < 50; i++) await Promise.resolve(); };
function deferred<T>() { let resolve!: (v: T) => void; const promise = new Promise<T>(r => { resolve = r; }); return { promise, resolve }; }
const trainingIds = () => [...plugin.pending.keys()].filter(id => id >= 730000 && id < 820000);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 8, 26, 8, 0));
  refreshClock();
  plugin.pending.clear();
  vi.clearAllMocks();
});
afterEach(() => { vi.useRealTimers(); });

describe('IMP-N01 latest notification intent wins', () => {
  it('rest: Skip rest (cancel) after a pending schedule leaves no rest alert queued', async () => {
    const perm = deferred<{ display: string }>();
    plugin.checkPermissions.mockImplementationOnce(() => perm.promise);
    const older = scheduleRestDone(Date.now() + 90_000); // rest started
    await flush();
    await cancelRestDone(); // Skip rest / pause / finish
    perm.resolve({ display: 'granted' });
    await older;
    expect(plugin.pending.has(REST_ID)).toBe(false);
  });

  it('training: turning reminders off while an On request waits for permission ends Off with nothing queued', async () => {
    const week = { sun: 'sp', mon: 'sp', tue: 'sp', wed: 'sp', thu: 'sp', fri: 'sp', sat: 'sp' };
    replaceState({ ...freshState(), splits: [{ id: 'sp', name: 'Push', color: '#fff', focus: [], createdAt: '', exercises: [] }], schedule: week as never,
      preferences: { ...freshState().preferences, reminders: { enabled: true, time: '20:00', style: 'silent' } } });
    const perm = deferred<{ display: string }>();
    plugin.checkPermissions.mockImplementationOnce(() => perm.promise);
    const older = resyncReminders({ prompt: true }); // toggle On
    await flush();
    update(s => ({ ...s, preferences: { ...s.preferences, reminders: { ...s.preferences.reminders, enabled: false } } }));
    await resyncReminders({ prompt: true }); // toggle Off
    expect(reminderHealth.value.status).toBe('Off');
    perm.resolve({ display: 'granted' });
    await older;
    expect(state.value.preferences.reminders.enabled).toBe(false);
    expect.soft(trainingIds().length).toBe(0);
    expect.soft(reminderHealth.value.status).toBe('Off');
  });

  it('backup: switching the weekly reminder off while On waits for permission stays off', async () => {
    const perm = deferred<{ display: string }>();
    plugin.checkPermissions.mockImplementationOnce(() => perm.promise);
    const older = syncBackupReminder(true, { prompt: true });
    await flush();
    await syncBackupReminder(false, { prompt: true });
    expect(backupReminderScheduled.value).toBe(false);
    perm.resolve({ display: 'granted' });
    await older;
    expect.soft(plugin.pending.has(BACKUP_REMINDER_ID)).toBe(false);
    expect.soft(backupReminderScheduled.value).toBe(false);
  });
});

/** A3-3: a request whose schedule call already went out when a newer request started. */
describe('IMP-N01 a superseded schedule call that lands late', () => {
  function lateSchedule() {
    const gate = deferred<void>();
    plugin.schedule.mockImplementationOnce(async ({ notifications }: { notifications: N[] }) => { await gate.promise; for (const n of notifications) plugin.pending.set(n.id, n); return { notifications: [] }; });
    return gate;
  }
  it('rest: Skip rest while the schedule call is in flight leaves nothing queued', async () => {
    const gate = lateSchedule();
    const older = scheduleRestDone(Date.now() + 90_000);
    await flush();
    expect(plugin.schedule).toHaveBeenCalledTimes(1);
    await cancelRestDone();
    gate.resolve();
    await older;
    expect(plugin.pending.has(REST_ID)).toBe(false);
  });
  it('training: an older On that lands after a newer On keeps the newer reminders queued', async () => {
    const week = { sun: 'sp', mon: 'sp', tue: 'sp', wed: 'sp', thu: 'sp', fri: 'sp', sat: 'sp' };
    replaceState({ ...freshState(), splits: [{ id: 'sp', name: 'Push', color: '#fff', focus: [], createdAt: '', exercises: [] }], schedule: week as never,
      preferences: { ...freshState().preferences, reminders: { enabled: true, time: '20:00', style: 'silent' } } });
    const gate = lateSchedule();
    const older = resyncReminders();
    await flush();
    expect(plugin.schedule).toHaveBeenCalledTimes(1);
    await resyncReminders();
    expect(reminderHealth.value.status).toBe('On. 56 of 56 reminders queued.');
    gate.resolve();
    await older;
    expect(trainingIds().length).toBe(56);
    expect(reminderHealth.value.status).toBe('On. 56 of 56 reminders queued.');
  });
  it('training: a schedule call superseded in flight reports itself superseded, not a queued count', async () => {
    const week = { sun: 'sp', mon: 'sp', tue: 'sp', wed: 'sp', thu: 'sp', fri: 'sp', sat: 'sp' } as const;
    const reminders = { enabled: true, time: '20:00', style: 'silent' } as const;
    const gate = lateSchedule();
    const older = syncTrainingReminders(reminders, week, () => 'Push', new Set());
    await flush();
    expect(plugin.schedule).toHaveBeenCalledTimes(1);
    const newer = await syncTrainingReminders(reminders, week, () => 'Push', new Set());
    expect(newer.status).toBe('On. 56 of 56 reminders queued.');
    gate.resolve();
    const result = await older;
    expect(result).toEqual({ status: 'Superseded by a newer request.', queued: 0, ok: false });
  });
});
