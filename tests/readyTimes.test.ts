import { describe, it, expect } from 'vitest';
import { readyWindow, readyGroupFor, formatFullBy, formatDay } from '@/core/dates';

describe('readyWindow', () => {
  it('same day: hours-only tile and detail text', () => {
    const now = new Date(2026, 8, 26, 12, 0, 0).getTime(); // Sat 26 Sep, noon
    const w = readyWindow(now, 2, 5); // 2pm .. 5pm
    expect(w.group).toBe('today');
    expect(w.groupDay).toBe('2026-09-26');
    expect(w.tileText).toBe('2 – 5 pm');
    expect(w.detailText).toBe(`Ready ${formatDay('2026-09-26', { weekday: 'short', day: 'numeric' })}, 2 – 5 pm`);
  });

  it('crosses midnight into tomorrow', () => {
    const now = new Date(2026, 8, 26, 12, 0, 0).getTime();
    const w = readyWindow(now, 9, 15); // 9pm .. 3am next day
    expect(w.group).toBe('tomorrow');
    expect(w.groupDay).toBe('2026-09-27');
    expect(w.tileText).toBe('9 pm – 3 am');
    expect(w.detailText).toBe(
      `Ready ${formatDay('2026-09-26', { weekday: 'short', day: 'numeric' })}, 9 pm – ${formatDay('2026-09-27', { weekday: 'short', day: 'numeric' })}, 3 am`,
    );
  });

  it('an end at exactly midnight counts as the day before', () => {
    const now = new Date(2026, 8, 26, 12, 0, 0).getTime();
    const w = readyWindow(now, 4, 12); // 4pm .. exactly midnight
    expect(w.groupDay).toBe('2026-09-26');
    expect(w.group).toBe('today');
    expect(w.tileText).toBe('4 pm – midnight');
  });

  it('groups later days beyond tomorrow, days-only tile text', () => {
    const now = new Date(2026, 8, 26, 9, 0, 0).getTime(); // Sat 09:00
    const w = readyWindow(now, 50, 70); // earliest lands Mon, latest lands Tue
    expect(w.group).toBe('later');
    expect(w.tileText).toBe('Mon – Tue');
  });

  it('collapses a later window that lands on one day to a single weekday', () => {
    const now = new Date(2026, 8, 26, 9, 0, 0).getTime();
    const w = readyWindow(now, 50, 52); // both land on Monday
    expect(w.group).toBe('later');
    expect(w.tileText).toBe('Mon');
  });

  it('12-hour boundaries: noon and midnight get word labels, not "0" or "12"', () => {
    const now = new Date(2026, 8, 26, 1, 0, 0).getTime(); // 1am
    const w = readyWindow(now, 11, 23); // 1am+11h=noon .. 1am+23h=midnight (exact)
    expect(w.tileText).toBe('noon – midnight');
  });

  it('a lo that rounds to the current hour does not invert the range', () => {
    const now = new Date(2026, 8, 26, 14, 10, 0).getTime(); // 2:10pm
    const w = readyWindow(now, 0.05, 1); // lo ~ 3 minutes from now
    expect(w.earliestMs).toBeLessThanOrEqual(w.latestMs);
    expect(w.tileText.startsWith('2')).toBe(true);
  });

  it('never lets a rounded earliest land after the rounded latest', () => {
    const now = new Date(2026, 8, 26, 14, 55, 0).getTime(); // 2:55pm, rounds up to 3pm
    const w = readyWindow(now, 0.02, 0.02); // both ~1 minute from now, ceil(hi) rounds to 3pm too
    expect(w.earliestMs).toBe(w.latestMs);
  });

});

describe('readyGroupFor', () => {
  it('a real window delegates to readyWindow', () => {
    const now = new Date(2026, 8, 26, 12, 0, 0).getTime();
    const g = readyGroupFor(now, { readyInHours: [2, 5], hoursLeft: 3, soreToday: false });
    expect(g.group).toBe('today');
    expect(g.tileText).toBe('2 – 5 pm');
  });

  it('a null window that is not sore goes to Later with hours-left copy', () => {
    const now = Date.now();
    const g = readyGroupFor(now, { readyInHours: null, hoursLeft: 5.4, soreToday: false });
    expect(g.group).toBe('later');
    expect(g.tileText).toBe('5h left');
    expect(g.detailText).toBe('Ready in 5h');
  });

  it('a sore muscle with no window goes to the Sore today group', () => {
    const now = Date.now();
    const g = readyGroupFor(now, { readyInHours: null, hoursLeft: 0, soreToday: true });
    expect(g.group).toBe('sore');
    expect(g.tileText).toBe('Not today');
    expect(g.detailText).toBe('Ready when soreness eases');
  });
});

describe('formatFullBy', () => {
  it('formats a future hour, rounded up', () => {
    const now = new Date(2026, 8, 26, 16, 40, 0).getTime(); // 4:40pm + 30min = 5:10pm, ceils to 6pm
    expect(formatFullBy(now, 0.5)).toBe('Full by 6 pm');
  });

  it('falls back to "Ready" when there is no further full time', () => {
    expect(formatFullBy(Date.now(), null)).toBe('Ready');
  });
});
