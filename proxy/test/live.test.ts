/**
 * One real call to the model. Runs only when ANTHROPIC_API_KEY is set in the
 * environment (never from a file in the repo). Checks the shape of the
 * answer and that it invents no numbers.
 */
import { describe, it, expect } from 'vitest';
import { callAnthropic } from '../src/anthropic';
import type { ExplainPayload } from '../src/types';

const key = process.env.ANTHROPIC_API_KEY;
const live = key ? describe : describe.skip;

const payload: ExplainPayload = {
  version: 1, kind: 'explain', goal: 'lean', unit: 'kg', today: '2026-09-19',
  dataQuality: { sessions: 38, weeksOfData: 12, effortCoverage: 0.85, insufficientData: false },
  findings: [
    { id: 'volume_drop:chest', kind: 'volume_drop', subject: { muscleGroup: 'chest' }, metrics: { changePct: -31, baselineSets: 14.5, currentSets: 10, baselineWeeks: 8, activeBaselineWeeks: 7 }, window: { from: '2026-08-24', to: '2026-09-13', weeks: 3 }, confidence: 'high', severity: 1 },
    { id: 'plateau:lib_barbell_bench_press', kind: 'plateau', subject: { exerciseId: 'lib_barbell_bench_press', exerciseName: 'Barbell Bench Press' }, metrics: { sessions: 8, firstTopKg: 60, lastTopKg: 60, firstTopReps: 8, lastTopReps: 8 }, window: { from: '2026-07-20', to: '2026-09-14', sessions: 8 }, confidence: 'medium', severity: 1 },
    { id: 'under_recovered:chest', kind: 'under_recovered', subject: { muscle: 'chest', muscleGroup: 'chest' }, metrics: { pct: 40, hoursLeft: 29, windowHours: 48, volumeFactor: 1, personalized: false, lastDay: '2026-09-18' }, window: { from: '2026-09-18', to: '2026-09-19' }, confidence: 'medium', severity: 2 },
  ],
  proposals: [
    { id: 'exercise_swap:lib_barbell_bench_press', kind: 'exercise_swap', subject: { exerciseId: 'lib_barbell_bench_press', exerciseName: 'Barbell Bench Press', splitName: 'Push' }, apply: { kind: 'exercise_swap', fromExerciseId: 'lib_barbell_bench_press', toExerciseId: 'lib_dumbbell_bench_press', splitId: 'split_push' }, basedOn: ['plateau:lib_barbell_bench_press'], confidence: 'medium' },
  ],
  cards: [
    { id: 'volume_dose_response', title: 'Weekly volume drives growth, with diminishing returns', rating: 'strong', statement: 'More hard sets per muscle per week produce more growth, up to a point. Past that point each extra set adds less and costs more recovery.', disputed: 'The exact shape at high volumes.' },
    { id: 'exercise_variation', title: 'Changing exercises: a useful reset, not a growth hack', rating: 'contested', statement: 'Swapping a stalled exercise for a similar one can spread growth across a muscle and refresh motivation. It has not been shown to grow more muscle overall.', disputed: 'The best-supported benefit is motivation and adherence.' },
    { id: 'recovery_time_course', title: 'Recovery takes one to three days', rating: 'moderate', statement: 'After a hard session a muscle performs worse for roughly one to three days.', disputed: 'Exact hours per muscle.' },
  ],
  explain: ['volume_drop:chest', 'plateau:lib_barbell_bench_press', 'under_recovered:chest', 'exercise_swap:lib_barbell_bench_press'],
};

const numbersIn = (s: string) => (s.match(/-?\d+(?:[.,]\d+)?/g) ?? []).map(n => parseFloat(n.replace(',', '.')));
const allowed = new Set<number>([-31, 31, 14.5, 10, 8, 7, 3, 60, 40, 29, 48, 1, 2, 12, 38, 0.85, 2026, 9, 19, 18, 24, 13, 20, 14]);

live('live model call', () => {
  it('answers in the schema, for every requested id, without inventing numbers', async () => {
    const out = await callAnthropic(payload, { ANTHROPIC_API_KEY: key, MODEL: process.env.MODEL || 'claude-haiku-4-5' });
    expect(out.model).toContain('haiku');
    expect(out.summary.split(/\s+/).length).toBeLessThanOrEqual(110);
    expect(out.items.map(i => i.id).sort()).toEqual([...payload.explain].sort());
    for (const item of out.items) {
      expect(item.text.split(/\s+/).length, item.id).toBeLessThanOrEqual(70);
      expect(item.text).not.toMatch(/injur/i);
      for (const n of numbersIn(item.text)) expect(allowed.has(n), `${item.id}: ${n} in "${item.text}"`).toBe(true);
    }
    for (const n of numbersIn(out.summary)) expect(allowed.has(n), `summary: ${n}`).toBe(true);
    console.log(JSON.stringify({ usage: out.usage, summary: out.summary, items: out.items }, null, 1));
  }, 60_000);
});
