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

// Local wall-clock instants (not UTC 'Z' strings), so this passes under any TZ npm run test:tz picks.
const local = (y: number, m: number, d: number, h: number, mi: number): string => new Date(y, m - 1, d, h, mi).toISOString();
const localMs = (y: number, m: number, d: number, h: number, mi: number): number => new Date(y, m - 1, d, h, mi).getTime();

describe('trainedToday (QA8-4)', () => {
  it('is true for a session dated today', () => {
    const s = [sessionAt(local(2026, 9, 26, 8, 0), local(2026, 9, 26, 9, 0), [])];
    expect(trainedToday(s, '2026-09-26', localMs(2026, 9, 26, 10, 0))).toBe(true);
  });
  it('a session starting before midnight and ending after counts as today within 6 hours of ending', () => {
    const started = local(2026, 9, 25, 23, 30);
    // Like finishSession() (dayKey(trainedAt)), not the helper's UTC-slice shortcut: the stored
    // day must be the local start day for this to test the midnight-crossing branch, not the plain one.
    const s = [{ ...sessionAt(started, local(2026, 9, 26, 0, 40), []), day: dayKey(started) }];
    expect(trainedToday(s, '2026-09-26', localMs(2026, 9, 26, 5, 30))).toBe(true);
    expect(trainedToday(s, '2026-09-26', localMs(2026, 9, 26, 18, 0))).toBe(false);
    // the stored day stays the start day, so it counts as Fri in history
    expect(s[0]!.day).toBe('2026-09-25');
  });
  it('is false with no sessions today or recently ended', () => {
    const s = [sessionAt(local(2026, 9, 20, 8, 0), local(2026, 9, 20, 9, 0), [])];
    expect(trainedToday(s, '2026-09-26', localMs(2026, 9, 26, 10, 0))).toBe(false);
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
