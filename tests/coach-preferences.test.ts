import { describe, it, expect } from 'vitest';
import { computePreferenceFacts, PREFERENCE_FACTS_MAX, shouldRefreshPreferences } from '@/brain/coach/preferences';
import { emptyCoach } from '@/core/models';

describe('computePreferenceFacts', () => {
  it('is empty for a fresh coach state', () => {
    expect(computePreferenceFacts(emptyCoach())).toEqual([]);
  });

  it('names a kind dismissed twice for the same subject, but not one dismissed only once or a different kind dismissed for two different subjects', () => {
    const coach = { ...emptyCoach(), dismissed: { 'deload_week:*': 2, 'exercise_swap:lib_bench_press': 1, 'exercise_swap:lib_squat': 1 } };
    const facts = computePreferenceFacts(coach);
    expect(facts.some(f => f.includes('easier weeks'))).toBe(true);
    expect(facts.some(f => f.includes('exercise swaps'))).toBe(false);
  });

  it('names a kind accepted for at least two distinct subjects, but not just one', () => {
    const oneOnly = { ...emptyCoach(), accepted: { 'exercise_swap:lib_bench_press': '2026-09-01' } };
    expect(computePreferenceFacts(oneOnly).some(f => f.includes('exercise swaps'))).toBe(false);
    const twice = { ...emptyCoach(), accepted: { 'exercise_swap:lib_bench_press': '2026-09-01', 'exercise_swap:lib_squat': '2026-09-08' } };
    expect(computePreferenceFacts(twice).some(f => f.includes('exercise swaps'))).toBe(true);
  });

  it('mentions a learned schedule with smart reminders on, never a diagnosis or a raw count', () => {
    const coach = { ...emptyCoach(), smartReminders: true };
    const facts = computePreferenceFacts(coach);
    expect(facts.some(f => f.includes('learned training schedule'))).toBe(true);
    expect(facts.join(' ')).not.toMatch(/\d/);
  });

  it('caps at PREFERENCE_FACTS_MAX even with every kind dismissed twice', () => {
    const dismissed: Record<string, number> = {};
    const kinds = ['deload_week', 'exercise_swap', 'schedule', 'today_plan', 'add_exercise', 'split_modify', 'split_new', 'rest_default'];
    for (const k of kinds) dismissed[`${k}:*`] = 2;
    const facts = computePreferenceFacts({ ...emptyCoach(), dismissed, smartReminders: true });
    expect(facts.length).toBeLessThanOrEqual(PREFERENCE_FACTS_MAX);
  });
});

describe('shouldRefreshPreferences', () => {
  it('is true with no prior computation, and only after a week has passed since the last one', () => {
    expect(shouldRefreshPreferences(emptyCoach(), '2026-09-19')).toBe(true);
    const fresh = { ...emptyCoach(), preferencesUpdatedAt: '2026-09-15T00:00:00.000Z' };
    expect(shouldRefreshPreferences(fresh, '2026-09-19')).toBe(false);
    const stale = { ...emptyCoach(), preferencesUpdatedAt: '2026-09-10T00:00:00.000Z' };
    expect(shouldRefreshPreferences(stale, '2026-09-19')).toBe(true);
  });
});
