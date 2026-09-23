import { describe, it, expect } from 'vitest';
import { summarize } from '@/escobar/tools/show';
import { SHOW_COMPONENT_IDS } from '@/core/models';
import { ctxOf, sixMonthsState, emptyState, NOW } from './fixtures';
import { PPL6 } from '../fixtures/plans';

const six = ctxOf(sixMonthsState());
const sessionId = six.state.sessions.at(-1)!.id;
const PARAMS: Record<string, Record<string, unknown>> = {
  lift_trend: { exerciseId: 'lib_barbell_bench_press', weeks: 12 },
  recovery_map: { at: new Date(NOW + 24 * 3600e3).toISOString() },
  volume_bars: {},
  readiness_gauge: {},
  readiness_history: { days: 14 },
  week_summary: { offsetWeeks: 1 },
  session_summary: { sessionId },
  records_list: { limit: 5 },
  plan_week: {},
  plan_evaluation: { draft: PPL6 },
  exercise_card: { exerciseId: 'lib_barbell_bench_press' },
  heart_session: { sessionId },
  compare_periods: { metric: 'sets', a: { from: '2026-08-01', to: '2026-08-31' }, b: { from: '2026-09-01', to: '2026-09-21' } },
  body_trend: { weeks: 26 },
};

describe('show component summaries (§9)', () => {
  it.each(SHOW_COMPONENT_IDS)('%s summarises the six-month fixture with at most 12 points', c => {
    const s = summarize(c, PARAMS[c]!, six);
    expect(s).toBeTruthy();
    for (const v of Object.values(s)) if (Array.isArray(v) && c !== 'readiness_history' && c !== 'plan_week') expect(v.length).toBeLessThanOrEqual(12);
  });
  it('lift trend has first, last and best from the points drawn', () => {
    const s = summarize('lift_trend', PARAMS.lift_trend!, six) as { points: Array<{ value: number }>; first: number; last: number; best: number };
    expect(s.first).toBe(s.points[0]!.value);
    expect(s.last).toBe(s.points.at(-1)!.value);
    expect(s.best).toBe(Math.max(...s.points.map(p => p.value)));
  });
  it('compare periods reports a delta', () => {
    const s = summarize('compare_periods', PARAMS.compare_periods!, six) as { a: { value: number }; b: { value: number }; delta: number };
    expect(s.delta).toBe(Math.round((s.b.value - s.a.value) * 10) / 10);
  });
  it('empty data gives plain words, not a crash', () => {
    const e = ctxOf(emptyState());
    expect(summarize('lift_trend', { exerciseId: 'lib_barbell_bench_press' }, e).empty).toMatch(/No Barbell Bench Press sessions/);
    expect(summarize('volume_bars', {}, e).empty).toBeTruthy();
    expect(summarize('readiness_gauge', {}, e).empty).toBeTruthy();
  });
  it('rejects bad params with a range', () => {
    expect(() => summarize('lift_trend', { exerciseId: 'lib_barbell_bench_press', weeks: 2 }, six)).toThrow(/4–52/);
    expect(() => summarize('compare_periods', { metric: 'e1rm', a: { from: '2026-08-01', to: '2026-08-31' }, b: { from: '2026-09-01', to: '2026-09-21' } }, six)).toThrow(/exerciseId/);
    expect(() => summarize('bogus', {}, six)).toThrow(/unknown component/);
  });
});
