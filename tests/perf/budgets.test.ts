/**
 * Timing budgets (R2.6). Run on their own (`MARC_PERF=1 vitest run`, part of `npm test`) so the
 * numbers measure the code, not the other test files competing for the same CPU.
 */
import { describe, it, expect } from 'vitest';
import { freshState, type Session, type Split } from '@/core/models';
import { rebuildRecoveryModel } from '@/slices/workout/session';
import { recoveryStatus } from '@/brain/recovery';
import { coachInsights } from '@/brain/coach/rules';
import { sessionAt, sets, baseCoachExtras } from '../helpers';

const split: Split = { id: 'sp', name: 'Push', color: '#fff', focus: [], createdAt: '', exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 2 }] };
const EXS = ['lib_barbell_bench_press', 'lib_barbell_back_squat', 'lib_barbell_row', 'lib_barbell_overhead_press', 'lib_conventional_deadlift', 'lib_cable_fly', 'lib_dumbbell_biceps_curl', 'lib_dumbbell_lateral_raise'];
function synthetic(n: number): Session[] {
  const start = Date.parse('2024-01-01T17:00:00.000Z');
  return Array.from({ length: n }, (_, i) => {
    const at = start + i * 1.5 * 86_400_000;
    const exs = [0, 1, 2, 3].map(k => EXS[(i + k * 2) % EXS.length]!);
    return sessionAt(new Date(at).toISOString(), new Date(at + 3_600_000).toISOString(), exs.map(id => ({ id, sets: sets(40 + (i % 20), 8, i % 3 === 0 ? 'max' : 'ideal', 3) })));
  });
}

const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)]!;
function timeIt(fn: () => void): number { fn(); const t: number[] = []; for (let i = 0; i < 5; i++) { const s = performance.now(); fn(); t.push(performance.now() - s); } return median(t); }

describe('performance budgets, 600 sessions (R2.6, UI-12)', () => {
  const many = synthetic(600);
  it('rebuildRecoveryModel under 500 ms', () => {
    const ms = timeIt(() => rebuildRecoveryModel({ sessions: many, customExercises: [], profile: baseCoachExtras.profile, healthDays: [] }));
    console.log(`rebuildRecoveryModel(600): ${ms.toFixed(0)} ms`);
    expect(ms).toBeLessThan(500);
  });
  it('recoveryStatus under 60 ms and coachInsights under 150 ms', () => {
    const now = Date.parse(many.at(-1)!.endedAt) + 3_600_000;
    const today = new Date(now).toISOString().slice(0, 10);
    const rec = timeIt(() => recoveryStatus({ sessions: many, now, profile: baseCoachExtras.profile }));
    const ctx = { sessions: many, splits: [split], schedule: freshState().schedule, custom: [], today, now, ...baseCoachExtras } as Parameters<typeof coachInsights>[0];
    const coach = timeIt(() => coachInsights(ctx, 3));
    console.log(`perf (median of 5): recoveryStatus ${rec.toFixed(1)} ms, coachInsights ${coach.toFixed(1)} ms`);
    expect(rec).toBeLessThan(60);
    expect(coach).toBeLessThan(150);
  });
});
