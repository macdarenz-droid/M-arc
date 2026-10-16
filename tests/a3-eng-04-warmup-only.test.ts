/** A3 verify ENG-04: warm-up-only sessions are saved but must not count as completed training sessions. */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/slices/settings/reminders', () => ({ resyncReminders: vi.fn(async () => undefined) }));

import { replaceState, state } from '@/core/store';
import { emptySchedule, freshState, type LoggedSet, type Session } from '@/core/models';
import { logPastSession } from '@/slices/workout/session';
import { trainingStreak, weekSummary } from '@/brain/weekly';
import { weekHasEnoughData } from '@/brain/coach/weeklyReview';
import { muscleVolumeStatus } from '@/brain/volume';
import { addDays } from '@/core/dates';
import { session, sets } from './helpers';

const BENCH = 'lib_barbell_bench_press';
const TODAY = '2026-10-01'; // Thursday; week starts 2026-09-28
const warm: LoggedSet[] = [{ kind: 'warmup', kg: 20, reps: 10 }];
const warmOnly = (day: string): Session => session(day, [{ id: BENCH, sets: warm }]);

beforeEach(() => { vi.useFakeTimers({ now: Date.parse(`${TODAY}T12:00:00.000Z`), toFake: ['Date'] }); replaceState(freshState()); });
afterEach(() => { vi.useRealTimers(); });

describe('ENG-04: warm-up-only sessions', () => {
  it('premise: the past-session save path stores a warm-up-only session', () => {
    const r = logPastSession({ splitId: 'x', trainedAtLocal: '2026-09-28T17:00', durationMin: 30, entries: [{ exerciseId: BENCH, name: 'Bench', sets: warm }] });
    expect(r).not.toBeNull();
    expect(state.value.sessions).toHaveLength(1);
  });

  it('three warm-up-only sessions do not complete a 3-session week or unlock the review', () => {
    const three = ['2026-09-28', '2026-09-29', '2026-09-30'].map(warmOnly);
    expect(trainingStreak(three, emptySchedule(), TODAY), 'premise: streak ignores them').toBe(0);
    const w = weekSummary(three, TODAY, [], 3);
    expect.soft(w.sets, 'premise: zero working sets').toBe(0);
    expect.soft(w.workouts, 'warm-up-only sessions counted as workouts').toBe(0);
    expect.soft(w.grade.title, 'warm-up-only week graded').not.toBe('Strong week');
    expect.soft(weekHasEnoughData(three, TODAY, { plannedDays: 3 }), 'warm-up-only sessions unlock the weekly review').toBe(false);
  });

  it('warm-up-only sessions do not make a week full for an under-volume judgment', () => {
    // Two past weeks, each: one real session (2 bench sets) plus two warm-up-only sessions.
    const monday = '2026-09-28';
    const weeks = [7, 14].flatMap(back => {
      const wk = addDays(monday, -back);
      return [session(wk, [{ id: BENCH, sets: sets(60, 8, 'ideal', 2) }]), warmOnly(addDays(wk, 2)), warmOnly(addDays(wk, 4))];
    });
    const chest = muscleVolumeStatus(weeks, monday, [], { plannedDays: 3 }).find(r => r.muscle === 'chest')!;
    expect(chest.status, `1 real session a week judged as a full week (band ${chest.band})`).not.toBe('under');
  });

  it('a mixed session (warm-up + working sets) counts once', () => {
    const mixed = session('2026-09-28', [{ id: BENCH, sets: [...warm, ...sets(60, 8, 'ideal', 2)] }]);
    expect(weekSummary([mixed], TODAY, [], 3).workouts).toBe(1);
  });
});
