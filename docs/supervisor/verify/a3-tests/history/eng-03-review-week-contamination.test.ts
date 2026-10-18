/** A3 verify ENG-03: sessions after the reviewed week must not change that week's volume verdict. */
import { describe, it, expect } from 'vitest';
import { weeklyReviewInsights, reviewWeek } from '@/brain/coach/weeklyReview';
import { emptySchedule, type Profile, type Session } from '@/core/models';
import { session, sets } from '../../helpers';

const BENCH = 'lib_barbell_bench_press';
const profile: Profile = { name: 'T', plannedDays: 3 };
const TODAY = '2026-09-30'; // Wednesday; week starts Monday 2026-09-28
const review = (sessions: Session[]) => weeklyReviewInsights({
  sessions, today: TODAY, custom: [], schedule: emptySchedule(), goal: 'lean', profile,
  weightLog: [], trainingAgeMonths: 24, exerciseIds: [{ id: BENCH, name: 'Bench' }],
}, 50);

describe('ENG-03: reviewed week is judged on its own interval', () => {
  const prior = ['2026-09-21', '2026-09-23', '2026-09-25'].map(d => session(d, [{ id: BENCH, sets: sets(60, 8, 'ideal', 2) }]));
  const later = session('2026-09-29', [{ id: BENCH, sets: sets(60, 8, 'ideal', 12) }]);

  it('a 12-set session in the current week does not flag last week (6 chest sets) as over', () => {
    const withLater = [...prior, later];
    expect(reviewWeek(withLater, TODAY, { plannedDays: 3 }), 'premise: review covers last week').toBe('2026-09-21');
    const before = review(prior).filter(i => i.id.startsWith('weekly:volume'));
    const after = review(withLater).filter(i => i.id.startsWith('weekly:volume'));
    const chest = after.find(i => i.id === 'weekly:volume:chest');
    expect.soft(chest?.title, `last-week review: ${chest?.noticed}`).not.toMatch(/over/);
    expect(after.map(i => i.title), 'a later session changed the reviewed week verdict').toEqual(before.map(i => i.title));
  });
});
