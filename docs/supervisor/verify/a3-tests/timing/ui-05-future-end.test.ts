/** A3 verify UI 05: a completed workout must not end after now (both timing writers). */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/slices/settings/reminders', () => ({ resyncReminders: vi.fn(async () => undefined) }));

import { replaceState, state } from '@/core/store';
import { freshState, type Session } from '@/core/models';
import { logPastSession, resolveSessionTiming } from '@/slices/workout/session';
import { sessionAt } from '../../helpers';

// Noon local time; the forms build `${day}T${time}` local strings.
const NOW = new Date('2026-09-22T12:00:00').getTime();
const START = '2026-09-22T11:59';
const bench = { exerciseId: 'lib_barbell_bench_press', name: 'Bench', sets: [{ kg: 60, reps: 8 }] };

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(NOW); });
afterEach(() => { vi.useRealTimers(); });

describe('UI 05: completed workouts cannot end in the future', () => {
  it('logPastSession refuses 11:59 + 60 min at noon (the form default is "now" + 60)', () => {
    replaceState({ ...freshState(), sessions: [] });
    const r = logPastSession({ splitId: 'x', trainedAtLocal: START, durationMin: 60, entries: [bench] });
    const saved = state.value.sessions;
    const latestEnd = Math.max(0, ...saved.map(s => Date.parse(s.endedAt)));
    expect(latestEnd, `saved end ${saved[0]?.endedAt}`).toBeLessThanOrEqual(NOW);
    expect(r).toBeNull();
  });

  it("logPastSession refuses the form's own defaults: today, start = now (HH:MM), 60 min (Train.tsx:1185-1187)", () => {
    replaceState({ ...freshState(), sessions: [] });
    const r = logPastSession({ splitId: 'x', trainedAtLocal: '2026-09-22T12:00', durationMin: 60, entries: [bench] });
    const end = state.value.sessions[0]?.endedAt;
    expect(r, `saved end ${end}`).toBeNull();
  });

  it('logPastSession rejects a non-finite or non-positive duration', () => {
    for (const d of [Number.NaN, 0, -30, Number.POSITIVE_INFINITY]) {
      replaceState({ ...freshState(), sessions: [] });
      let r: unknown;
      try { r = logPastSession({ splitId: 'x', trainedAtLocal: '2026-09-21T10:00', durationMin: d, entries: [bench] }); } catch { r = 'threw'; }
      expect.soft(state.value.sessions, `duration ${d}`).toHaveLength(0);
      expect.soft(r, `duration ${d}`).not.toBe("threw");
    }
  });

  it('resolveSessionTiming refuses 11:59 + 60 min at noon and keeps the saved timing', () => {
    const s: Session = sessionAt('2026-09-22T11:00:00.000Z', '2026-09-22T11:01:00.000Z', [{ id: 'lib_barbell_bench_press', sets: [{ kg: 60, reps: 8 }] }]);
    replaceState({ ...freshState(), sessions: [s] });
    const ok = resolveSessionTiming(s.id, START, 60, 'user');
    const after = state.value.sessions[0]!;
    expect(Date.parse(after.endedAt), `saved end ${after.endedAt}`).toBeLessThanOrEqual(NOW);
    expect(Date.parse(after.logging.trainedEndAt)).toBeLessThanOrEqual(NOW);
    expect(ok).toBe(false);
  });
});
