import { describe, it, expect } from 'vitest';
import { addDays, dayKey, daysBetween, weekStart, weekdayOf, formatClock, formatHours, trainedToday, nextScheduled } from '@/core/dates';
import { emptySchedule } from '@/core/models';
import { sessionAt } from './helpers';

describe('dates', () => {
  it('formats local day keys', () => {
    expect(dayKey(new Date(2026, 8, 18, 23, 59))).toBe('2026-09-18');
  });
  it('finds Monday as week start', () => {
    expect(weekStart('2026-09-18')).toBe('2026-09-14');
    expect(weekStart('2026-09-14')).toBe('2026-09-14');
    expect(weekStart('2026-09-13')).toBe('2026-09-07');
  });
  it('adds days across month ends', () => {
    expect(addDays('2026-08-31', 1)).toBe('2026-09-01');
    expect(daysBetween('2026-08-31', '2026-09-30')).toBe(30);
    expect(weekdayOf('2026-09-18')).toBe('fri');
  });
  it('formats clocks and hours', () => {
    expect(formatClock(65)).toBe('1:05');
    expect(formatClock(3725)).toBe('1:02:05');
    expect(formatHours(0.5)).toBe('under 1h');
    expect(formatHours(30)).toBe('1.5d');
    expect(formatHours(96)).toBe('4d');
  });
});

describe('trainedToday (QA8-4)', () => {
  it('is true for a session dated today', () => {
    const s = [sessionAt('2026-09-26T08:00:00.000Z', '2026-09-26T09:00:00.000Z', [])];
    expect(trainedToday(s, '2026-09-26', new Date('2026-09-26T10:00:00Z').getTime())).toBe(true);
  });
  it('a session starting before midnight and ending after counts as today within 6 hours of ending', () => {
    const s = [sessionAt('2026-09-25T23:30:00.000Z', '2026-09-26T00:40:00.000Z', [])];
    expect(trainedToday(s, '2026-09-26', new Date('2026-09-26T05:30:00Z').getTime())).toBe(true);
    expect(trainedToday(s, '2026-09-26', new Date('2026-09-26T18:00:00Z').getTime())).toBe(false);
    // the stored day stays the start day, so it counts as Fri in history
    expect(s[0]!.day).toBe('2026-09-25');
  });
  it('is false with no sessions today or recently ended', () => {
    const s = [sessionAt('2026-09-20T08:00:00.000Z', '2026-09-20T09:00:00.000Z', [])];
    expect(trainedToday(s, '2026-09-26', new Date('2026-09-26T10:00:00Z').getTime())).toBe(false);
  });
});

describe('nextScheduled (QA8-1, QA8-2)', () => {
  it('finds the next scheduled split, walking forward from tomorrow', () => {
    const schedule = { ...emptySchedule(), mon: 'split_push' };
    // 2026-09-26 is a Saturday; the next Monday is 2026-09-28
    expect(nextScheduled(schedule, '2026-09-26')).toEqual({ splitId: 'split_push', weekday: 'mon', day: '2026-09-28' });
  });
  it('returns null when nothing is scheduled within the window', () => {
    expect(nextScheduled(emptySchedule(), '2026-09-26')).toBeNull();
  });
});
