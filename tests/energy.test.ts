import { describe, it, expect } from 'vitest';
import { age, bmrKcalPerDay, grossKcalPerMin, sessionEnergy, energyFromWatch, energyFromHealthConnect, pickEnergy, dailyActiveKcal, weeklyEnergy } from '@/brain/energy';
import type { Profile, Session } from '@/core/models';

const full: Profile = { name: '', bodyWeightKg: 80, heightCm: 180, sex: 'male', birthYear: 1990 };
const today = '2026-01-01';

describe('age', () => {
  it('is null without a birth year', () => expect(age({ name: '' }, today)).toBeNull());
  it('computes from birth year', () => expect(age(full, today)).toBe(36));
});

describe('bmrKcalPerDay', () => {
  it('is null with an incomplete profile', () => expect(bmrKcalPerDay({ name: '' }, today)).toBeNull());
  it('is higher for male than female at the same stats', () => {
    const male = bmrKcalPerDay(full, today)!;
    const female = bmrKcalPerDay({ ...full, sex: 'female' }, today)!;
    expect(male).toBeGreaterThan(female);
  });
});

describe('grossKcalPerMin', () => {
  it('is null with an incomplete profile', () => expect(grossKcalPerMin(140, { name: '' }, today)).toBeNull());
  it('rises with bpm and clamps at 0', () => {
    const low = grossKcalPerMin(70, full, today)!;
    const high = grossKcalPerMin(160, full, today)!;
    expect(high).toBeGreaterThan(low);
    expect(grossKcalPerMin(0, full, today)).toBeGreaterThanOrEqual(0);
  });
});

describe('sessionEnergy', () => {
  const series: Array<[number, number]> = Array.from({ length: 60 }, (_, i) => [i * 5, 130]);
  it('is null with an incomplete profile', () => {
    expect(sessionEnergy({ series, profile: { name: '' }, today, quality: 1 })).toBeNull();
  });
  it('is null below quality 0.5', () => {
    expect(sessionEnergy({ series, profile: full, today, quality: 0.3 })).toBeNull();
  });
  it('active kcal never exceeds gross kcal', () => {
    const r = sessionEnergy({ series, profile: full, today, quality: 1 })!;
    expect(r.activeKcal).toBeLessThanOrEqual(r.grossKcal);
    expect(r.source).toBe('heart_rate');
  });
  it('is null with an empty series', () => {
    expect(sessionEnergy({ series: [], profile: full, today, quality: 1 })).toBeNull();
  });
});

describe('energyFromWatch', () => {
  it('is null when the counter went backward (reset/wrap)', () => {
    expect(energyFromWatch(500, 400, 60, full, today)).toBeNull();
  });
  it('converts kJ to kcal', () => {
    const r = energyFromWatch(0, 418.4, 60, full, today)!;
    expect(r.activeKcal).toBe(100);
    expect(r.source).toBe('watch_energy');
  });
});

describe('energyFromHealthConnect', () => {
  it('is null with a negative value', () => expect(energyFromHealthConnect(-1, 60, full, today)).toBeNull());
  it('passes through with a tighter band', () => {
    const r = energyFromHealthConnect(300, 60, full, today)!;
    expect(r.activeKcal).toBe(300);
    expect(r.high - r.activeKcal).toBeLessThan(r.activeKcal * 0.25);
  });
});

describe('pickEnergy', () => {
  const hr = { grossKcal: 1, activeKcal: 1, low: 1, high: 1, minutes: 1, source: 'heart_rate' as const, profileSnapshot: { kg: 80, age: 36, sex: 'male' as const } };
  const watch = { ...hr, source: 'watch_energy' as const };
  const hc = { ...hr, source: 'health_connect' as const };
  it('prefers Health Connect, then watch, then heart rate', () => {
    expect(pickEnergy({ healthConnect: hc, watch, heartRate: hr })?.source).toBe('health_connect');
    expect(pickEnergy({ watch, heartRate: hr })?.source).toBe('watch_energy');
    expect(pickEnergy({ heartRate: hr })?.source).toBe('heart_rate');
    expect(pickEnergy({})).toBeNull();
  });
});

describe('dailyActiveKcal', () => {
  it('reads the matching day', () => expect(dailyActiveKcal([{ day: '2026-01-01', activeCalories: 300 }], '2026-01-01')).toBe(300));
  it('is null with no matching day', () => expect(dailyActiveKcal([], '2026-01-01')).toBeNull());
});

describe('weeklyEnergy', () => {
  it('sums sessions in the week', () => {
    const sessions: Session[] = [
      { id: '1', splitId: 'a', splitName: 'a', day: '2026-01-05', startedAt: '', endedAt: '', durationSec: 0, exercises: [], logging: {} as never, heart: { source: 'ble', samples: 1, avgBpm: 1, maxBpm: 1, minBpm: 1, zoneSec: [0, 0, 0, 0, 0], coverage: 1, energy: { grossKcal: 1, activeKcal: 200, low: 1, high: 1, minutes: 1, source: 'heart_rate', profileSnapshot: { kg: 1, age: 1, sex: 'male' } } } },
      { id: '2', splitId: 'a', splitName: 'a', day: '2026-01-12', startedAt: '', endedAt: '', durationSec: 0, exercises: [], logging: {} as never },
    ];
    expect(weeklyEnergy(sessions, '2026-01-05')).toBe(200);
  });
});
