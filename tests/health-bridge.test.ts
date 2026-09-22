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
