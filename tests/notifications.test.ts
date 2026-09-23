import { describe, it, expect, vi, beforeEach } from 'vitest';

const plugin = {
  schedule: vi.fn(async () => ({ notifications: [] })),
  cancel: vi.fn(async () => undefined),
  getPending: vi.fn(async () => ({ notifications: [] as Array<{ id: number }> })),
  createChannel: vi.fn(async () => undefined),
  checkPermissions: vi.fn(async () => ({ display: 'granted' })),
  requestPermissions: vi.fn(async () => ({ display: 'granted' })),
  checkExactNotificationSetting: vi.fn(async () => ({ exact_alarm: 'denied' })),
  changeExactNotificationSetting: vi.fn(async () => ({ exact_alarm: 'granted' })),
  addListener: vi.fn(),
};
vi.mock('@capacitor/local-notifications', () => ({ LocalNotifications: plugin }));
vi.mock('@/native/capacitor', () => ({ isNative: () => true }));

beforeEach(() => { vi.clearAllMocks(); });

type Scheduled = { notifications: Array<{ isExactNotification?: boolean; extra?: { type: string } }> };
const lastSchedule = () => (plugin.schedule.mock.calls.at(-1) as unknown as [Scheduled])[0];

describe('notifications (UI-02, PL-09)', () => {
  it('training reminders are never exact', async () => {
    const N = await import('@/native/notifications');
    await N.syncTrainingReminders({ enabled: true, time: '23:59', style: 'silent' }, { sun: 'a', mon: 'a', tue: 'a', wed: 'a', thu: 'a', fri: 'a', sat: 'a' }, () => 'Push', new Set());
    const list = lastSchedule().notifications;
    expect(list.length).toBeGreaterThan(0);
    expect(list.every(n => n.isExactNotification === false)).toBe(true);
    expect(plugin.changeExactNotificationSetting).not.toHaveBeenCalled();
  });
  it('the rest alert uses the cached exact-alarm permission', async () => {
    const N = await import('@/native/notifications');
    await N.refreshExactAlarm();
    await N.scheduleRestDone(Date.now() + 60_000);
    expect(lastSchedule().notifications[0]!.isExactNotification).toBe(false);
    plugin.checkExactNotificationSetting.mockResolvedValueOnce({ exact_alarm: 'granted' });
    await N.refreshExactAlarm();
    await N.scheduleRestDone(Date.now() + 60_000);
    expect(lastSchedule().notifications[0]!.isExactNotification).toBe(true);
    expect(plugin.changeExactNotificationSetting).not.toHaveBeenCalled();
  });
  it('only an explicit request opens the system setting', async () => {
    const N = await import('@/native/notifications');
    plugin.checkExactNotificationSetting.mockResolvedValueOnce({ exact_alarm: 'granted' });
    expect(await N.requestExactAlarm()).toBe(true);
    expect(plugin.changeExactNotificationSetting).toHaveBeenCalledTimes(1);
  });
});
