import { describe, expect, it } from 'vitest';
import { weekReview, weekReviewCopy } from '@/brain/coach/review';
import type { Session } from '@/core/models';
import { addDays } from '@/core/dates';
import { ctx, PUSH_ID } from './coach-helpers';

const TODAY = '2026-09-21';
function workout(day: string, id: string, sets = 2, exerciseId = 'lib_barbell_bench_press'): Session {
  return { id, splitId: PUSH_ID, splitName: 'Push', day, startedAt: `${day}T10:00:00.000Z`, endedAt: `${day}T11:00:00.000Z`, durationSec: 3600,
    exercises: [{ exerciseId, name: exerciseId, sets: Array.from({ length: sets }, () => ({ kg: 50, reps: 8, effort: 'ideal' as const })) }] };
}
const mondays = ['2026-08-17', '2026-08-24', '2026-08-31', '2026-09-07'];
const base = (sets = 2) => [...mondays.map((day, i) => workout(day, `b${i}`, sets)), workout('2026-09-14', 'closed', 4)];

describe('weekReview', () => {
  it('closes Monday through Sunday and excludes this Monday', () => {
    const review = weekReview(ctx([...base(), workout(TODAY, 'current', 20)], { today: TODAY }))!;
    expect(review).toMatchObject({ start: '2026-09-14', end: '2026-09-20', workouts: 1, activeDayCount: 1, sets: 4, baselineWeeks: 4, baselineSets: 2, setsDelta: 2, direction: 'more' });
  });

  it('still reviews the prior complete week on Sunday', () => {
    const review = weekReview(ctx(base(), { today: '2026-09-20' }))!;
    expect(review).toMatchObject({ start: '2026-09-07', end: '2026-09-13' });
  });

  it('counts two sessions on one day as two workouts and one active day', () => {
    const sessions = [...base(), workout('2026-09-14', 'closed-2', 1)];
    const review = weekReview(ctx(sessions, { today: TODAY }))!;
    expect(review.workouts).toBe(2);
    expect(review.activeDayCount).toBe(1);
    expect(review.activeDays).toEqual(['2026-09-14']);
  });

  it('needs four complete baseline weeks and includes observed zero weeks', () => {
    const three = [workout('2026-08-24', 'a'), workout('2026-08-31', 'b'), workout('2026-09-07', 'c'), workout('2026-09-14', 'd', 0)];
    expect(weekReview(ctx(three, { today: TODAY }))!).toMatchObject({ baselineWeeks: 3, baselineSets: null, direction: 'insufficient' });
    const zeros = [workout('2026-08-17', 'first', 2), workout('2026-09-14', 'last', 0)];
    expect(weekReview(ctx(zeros, { today: TODAY }))!).toMatchObject({ baselineWeeks: 4, baselineSets: 0, sets: 0, direction: 'similar' });
  });

  it('excludes a partial first observation week and hides with no working history', () => {
    const partial = [workout('2026-08-19', 'partial'), ...mondays.slice(1).map((day, i) => workout(day, `x${i}`)), workout('2026-09-14', 'last')];
    expect(weekReview(ctx(partial, { today: TODAY }))!.baselineWeeks).toBe(3);
    expect(weekReview(ctx([], { today: TODAY }))).toBeNull();
  });

  it('uses effective muscle sets including secondary half credit', () => {
    const review = weekReview(ctx(base(2), { today: TODAY }))!;
    expect(review.muscle).toEqual({ id: 'chest', sets: 4, baselineSets: 2, deltaSets: 2 });
  });

  it('labels current schedule alignment without calling it historical adherence', () => {
    const c = ctx(base(), { today: TODAY });
    c.schedule.mon = PUSH_ID; c.schedule.wed = PUSH_ID;
    const review = weekReview(c)!;
    expect(review).toMatchObject({ scheduledDays: 2, alignedDays: 1, scheduleBasis: 'current' });
    expect(weekReviewCopy(review, 'kg').schedule).toContain("today's schedule");
  });

  it('updates from edited, deleted or imported logs and stays finite', () => {
    const sessions = base();
    const before = weekReview(ctx(sessions, { today: TODAY }))!;
    sessions[sessions.length - 1]!.exercises[0]!.sets.push({ kg: 50, reps: 8 });
    expect(weekReview(ctx(sessions, { today: TODAY }))!.sets).toBe(before.sets + 1);
    sessions.pop();
    expect(weekReview(ctx(sessions, { today: TODAY }))!.sets).toBe(0);
    sessions.push(workout(addDays(TODAY, 2), 'future', 99));
    expect(weekReview(ctx(sessions, { today: TODAY }))!.sets).toBe(0);
  });
});
