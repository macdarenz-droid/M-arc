import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sessionAt } from './helpers';

beforeEach(() => { vi.useFakeTimers(); vi.resetModules(); });
afterEach(() => { vi.useRealTimers(); });

describe('sessionsToday (QA8-4)', () => {
  it('includes a session that started before midnight and ended today, checked within 6 hours of ending', async () => {
    vi.setSystemTime(new Date('2026-09-26T05:30:00Z'));
    const { replaceState } = await import('@/core/store');
    const { freshState } = await import('@/core/models');
    const S = await import('@/app/selectors');
    const s = sessionAt('2026-09-25T23:30:00.000Z', '2026-09-26T00:40:00.000Z', []);
    replaceState({ ...freshState(), sessions: [s] });
    expect(S.sessionsToday.value.map(x => x.id)).toEqual([s.id]);
    // the stored day is unchanged: the session still counts as Fri in History
    expect(s.day).toBe('2026-09-25');
  });

  it('drops out again once more than 6 hours have passed since it ended', async () => {
    vi.setSystemTime(new Date('2026-09-26T18:00:00Z'));
    const { replaceState } = await import('@/core/store');
    const { freshState } = await import('@/core/models');
    const S = await import('@/app/selectors');
    const s = sessionAt('2026-09-25T23:30:00.000Z', '2026-09-26T00:40:00.000Z', []);
    replaceState({ ...freshState(), sessions: [s] });
    expect(S.sessionsToday.value).toEqual([]);
  });

  it('still includes a plain same-day session regardless of time elapsed', async () => {
    vi.setSystemTime(new Date('2026-09-26T20:00:00Z'));
    const { replaceState } = await import('@/core/store');
    const { freshState } = await import('@/core/models');
    const S = await import('@/app/selectors');
    const s = sessionAt('2026-09-26T08:00:00.000Z', '2026-09-26T09:00:00.000Z', []);
    replaceState({ ...freshState(), sessions: [s] });
    expect(S.sessionsToday.value.map(x => x.id)).toEqual([s.id]);
  });
});
