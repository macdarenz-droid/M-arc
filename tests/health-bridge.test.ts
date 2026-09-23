import { describe, it, expect } from 'vitest';
import { mapHealthSummary } from '@/native/health';

describe('mapHealthSummary', () => {
  it('maps a full summary to a daily record', () => {
    const d = mapHealthSummary({ needsPermission: false, steps: 5092, sleepMinutes: 410, restingHR: 58, workoutHR: 132, activeCalories: 310, heartRateTime: '2026-09-22T06:00:00Z', sleepEndTime: '2026-09-22T06:30:00Z' }, '2026-09-22', '2026-09-22T12:00:00Z');
    expect(d).toEqual({
      day: '2026-09-22',
      restingHr: 58,
      latestHr: 132,
      latestHrAt: '2026-09-22T06:00:00Z',
      sleepMinutes: 410,
      sleepEndAt: '2026-09-22T06:30:00Z',
      steps: 5092,
      activeCalories: 310,
      source: 'health_connect',
      syncedAt: '2026-09-22T12:00:00Z',
    });
  });

  it('returns null when permission is missing', () => {
    expect(mapHealthSummary({ needsPermission: true, steps: 0, sleepMinutes: 0, restingHR: 0, workoutHR: 0, activeCalories: 0 }, '2026-09-22', '2026-09-22T12:00:00Z')).toBeNull();
  });

  it('reads zero readings as absent, not zero', () => {
    const d = mapHealthSummary({ needsPermission: false, steps: 0, sleepMinutes: 0, restingHR: 0, workoutHR: 0, activeCalories: 0 }, '2026-09-22', '2026-09-22T12:00:00Z');
    expect(d?.steps).toBeUndefined();
    expect(d?.restingHr).toBeUndefined();
    expect(d?.latestHr).toBeUndefined();
    expect(d?.sleepMinutes).toBeUndefined();
    expect(d?.activeCalories).toBeUndefined();
    expect(d?.source).toBe('health_connect');
  });
});

import { afterEach, vi } from 'vitest';
import { kcalGuard, lastHealthError, syncHealth } from '@/native/health';
import * as health from '@/native/health';

describe('health bridge (R5.1)', () => {
  const day = '2026-09-22', at = '2026-09-22T12:00:00Z';
  afterEach(() => { delete (globalThis as { Capacitor?: unknown }).Capacitor; });
  const install = (p: Record<string, unknown>) => { (globalThis as { Capacitor?: unknown }).Capacitor = { isNativePlatform: () => true, Plugins: { HealthConnectNative: p } }; };

  it('heals small calories to kcal (VX-01)', () => {
    expect(kcalGuard(312_000)).toBe(312);
    expect(kcalGuard(450)).toBe(450);
    expect(kcalGuard(undefined)).toBeUndefined();
    expect(mapHealthSummary({ needsPermission: false, activeCalories: 480_400 }, day, at)?.activeCalories).toBe(480);
  });

  it('every granted type failing is nothing read, not a day of zeros', () => {
    const failed = ['StepsRecord: X', 'SleepSessionRecord: X', 'HeartRateRecord: X'];
    expect(mapHealthSummary({ needsPermission: false, missing: ['READ_ACTIVE_CALORIES_BURNED', 'READ_RESTING_HEART_RATE'], failed }, day, at)).toBeNull();
    expect(mapHealthSummary({ needsPermission: false, missing: ['READ_ACTIVE_CALORIES_BURNED', 'READ_RESTING_HEART_RATE'], failed: failed.slice(1), steps: 10 }, day, at)?.steps).toBe(10);
  });

  it('a background sync never asks for permission; a Settings sync does', async () => {
    const requestPermissions = vi.fn(async () => ({ granted: false }));
    install({ readSummary: async () => ({ needsPermission: true }), requestPermissions });
    expect(await syncHealth()).toBeNull();
    expect(await syncHealth({ prompt: false })).toBeNull();
    expect(requestPermissions).not.toHaveBeenCalled();
    expect(health.lastHealthError?.needsPermission).toBe(true);
    await syncHealth({ prompt: true });
    expect(requestPermissions).toHaveBeenCalledTimes(1);
  });

  it('a newly added permission is not requested in the background either', async () => {
    const requestPermissions = vi.fn(async () => ({ granted: true }));
    install({ readSummary: async () => ({ needsPermission: false, missing: ['READ_RESTING_HEART_RATE'], steps: 100 }), requestPermissions });
    expect((await syncHealth())?.steps).toBe(100);
    expect(requestPermissions).not.toHaveBeenCalled();
    expect(lastHealthError).toBeNull();
  });
});

import { repairState } from '@/core/store';
import { freshState } from '@/core/models';
it('a saved state with small-calorie days loads healed', () => {
  const s = { ...freshState(), healthDays: [{ day: '2026-09-21', activeCalories: 512_000, source: 'health_connect' as const, syncedAt: '' }, { day: '2026-09-22', activeCalories: 480, source: 'health_connect' as const, syncedAt: '' }], health: { connected: true, activeCalories: 512_000 } };
  const out = repairState(s).state;
  expect(out.healthDays.map(d => d.activeCalories)).toEqual([512, 480]);
  expect(out.health.activeCalories).toBe(512);
});
