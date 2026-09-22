import { describe, it, expect } from 'vitest';
import { readinessBaselines, readiness, type ReadinessInput } from '@/brain/readiness';
import type { CheckIn, DailyHealth } from '@/core/models';
import type { MuscleRecovery } from '@/brain/recovery';
import { session, sets } from './helpers';

const today = '2026-09-22';
const day = (offset: number) => { const d = new Date(today); d.setDate(d.getDate() - offset); return d.toISOString().slice(0, 10); };

const mr = (muscle: MuscleRecovery['muscle'], pct: number): MuscleRecovery => ({
  muscle, pct, hoursLeft: 0, windowHours: 24, lastTrainedAt: null, lastDay: null, personalized: false,
  recovering: pct < 90, ready: pct >= 90, readyInHours: null, fullInHours: null, confidence: 'medium', drivers: [], systemicFactor: 1,
});

const baseInput: ReadinessInput = {
  today, healthDays: [], checkIn: undefined, checkInHistory: [], recovery: [], scheduledSplit: undefined, custom: [], sessions: [],
};

describe('readinessBaselines', () => {
  it('computes 7d/28d resting HR and 14d sleep median with gaps', () => {
    const healthDays: DailyHealth[] = [
      { day: day(0), restingHr: 60, sleepMinutes: 420, source: 'health_connect', syncedAt: today },
      { day: day(1), restingHr: 62, source: 'health_connect', syncedAt: today },
      { day: day(10), restingHr: 58, sleepMinutes: 400, source: 'health_connect', syncedAt: today },
    ];
    const b = readinessBaselines(healthDays, today);
    expect(b.restingHr7d).toBeCloseTo(61, 0);
    expect(b.restingHr28d).toBeCloseTo(60, 0);
    expect(b.sleep14dMedian).not.toBeNull();
  });
  it('is all-null with no data', () => {
    const b = readinessBaselines([], today);
    expect(b.restingHr7d).toBeNull();
    expect(b.sleep14dMedian).toBeNull();
    expect(b.cv).toBeNull();
  });
});

describe('readiness', () => {
  it('returns null with zero inputs', () => {
    expect(readiness(baseInput)).toBeNull();
  });
  it('gives a low-confidence tier from a check-in alone, no watch', () => {
    const checkInHistory: CheckIn[] = Array.from({ length: 5 }, (_, i) => ({ day: day(i + 1), sleepQuality: 3, mood: 3 }));
    const r = readiness({ ...baseInput, checkIn: { day: today, sleepQuality: 3, mood: 3 }, checkInHistory });
    expect(r).not.toBeNull();
    expect(r!.confidence).toBe('low');
  });
  it('is red with reduce advice when recovery and resting HR are both poor', () => {
    const healthDays: DailyHealth[] = Array.from({ length: 28 }, (_, i) => ({ day: day(i), restingHr: i < 7 ? 70 : 55, source: 'health_connect' as const, syncedAt: today }));
    const r = readiness({ ...baseInput, healthDays, recovery: [mr('chest', 20), mr('triceps', 25)] });
    expect(r).not.toBeNull();
    expect(r!.band).toBe('red');
    expect(r!.loadAdvice).toBe('reduce');
  });
  it('is green with normal advice when everything is favourable', () => {
    const healthDays: DailyHealth[] = Array.from({ length: 28 }, (_, i) => ({ day: day(i), restingHr: 55, source: 'health_connect' as const, syncedAt: today }));
    const r = readiness({ ...baseInput, healthDays, recovery: [mr('chest', 100), mr('triceps', 100)] });
    expect(r).not.toBeNull();
    expect(r!.band).toBe('green');
    expect(r!.loadAdvice).toBe('normal');
  });
  it('is calibrating until 14 days of check-ins or sleep exist', () => {
    const healthDays: DailyHealth[] = Array.from({ length: 28 }, (_, i) => ({ day: day(i), restingHr: 55, source: 'health_connect' as const, syncedAt: today }));
    const r = readiness({ ...baseInput, healthDays, recovery: [mr('chest', 100)] });
    expect(r!.calibrating).toBe(true);
  });
  it('is no longer calibrating once 14 days of sleep data exist', () => {
    const healthDays: DailyHealth[] = Array.from({ length: 28 }, (_, i) => ({ day: day(i), restingHr: 55, sleepMinutes: 420, source: 'health_connect' as const, syncedAt: today }));
    const r = readiness({ ...baseInput, healthDays, recovery: [mr('chest', 100)] });
    expect(r!.calibrating).toBe(false);
  });
  it('gives higher confidence with more present inputs', () => {
    const healthDays: DailyHealth[] = Array.from({ length: 28 }, (_, i) => ({ day: day(i), restingHr: 55, sleepMinutes: 420, source: 'health_connect' as const, syncedAt: today }));
    const checkInHistory: CheckIn[] = Array.from({ length: 5 }, (_, i) => ({ day: day(i + 1), sleepQuality: 4, mood: 4 }));
    const sessions = [session(day(1), [{ id: 'bench', sets: sets(60, 8, 'ideal', 3) }])];
    const r = readiness({ ...baseInput, healthDays, checkIn: { day: today, sleepQuality: 4, mood: 4 }, checkInHistory, recovery: [mr('chest', 90)], sessions });
    expect(r!.confidence).not.toBe('low');
  });
});
