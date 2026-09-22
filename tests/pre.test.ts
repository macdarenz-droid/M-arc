import { describe, it, expect } from 'vitest';
import { mastersDefaults, preSessionInsights, warmupRamp, warmupSets, workingLoadTarget } from '@/brain/coach/pre';
import { exerciseHistory } from '@/brain/history';
import { session, sets } from './helpers';
import type { Split } from '@/core/models';

const bench = 'lib_barbell_bench_press';

describe('workingLoadTarget', () => {
  it('needs 3+ sessions with e1RM before it fires', () => {
    const a = session('2026-09-01', [{ id: bench, sets: sets(60, 8) }]);
    expect(workingLoadTarget(exerciseHistory([a], bench), bench, 'Bench', 8)).toBeNull();
  });
  it('gives a load target once there is enough history', () => {
    const days = ['2026-09-01', '2026-09-05', '2026-09-09', '2026-09-13'];
    const s = days.map((d, i) => session(d, [{ id: bench, sets: sets(60 + i, 8, 'ideal') }]));
    const t = workingLoadTarget(exerciseHistory(s, bench), bench, 'Bench', 8);
    expect(t).not.toBeNull();
    expect(t!.action).toMatch(/kg/);
  });
});

describe('warmupRamp', () => {
  it('gives three ramp steps at 50/70/85% of e1RM', () => {
    const a = session('2026-09-01', [{ id: bench, sets: sets(100, 5, 'ideal') }]);
    const w = warmupRamp(exerciseHistory([a], bench), bench, 'Bench')!;
    expect(w.action).toMatch(/x 8.*x 5.*x 2/);
  });
  it('null with no history', () => {
    expect(warmupRamp([], bench, 'Bench')).toBeNull();
  });
});

describe('warmupSets (F3.4)', () => {
  it('rounds 50/70/85% of e1RM to the load step, at 8/5/2 reps', () => {
    expect(warmupSets(100)).toEqual([{ kg: 50, reps: 8 }, { kg: 70, reps: 5 }, { kg: 85, reps: 2 }]);
  });
});

describe('mastersDefaults', () => {
  it('only fires at 60+', () => {
    expect(mastersDefaults(45)).toBeNull();
    expect(mastersDefaults(61)).not.toBeNull();
    expect(mastersDefaults(null)).toBeNull();
  });
});

describe('preSessionInsights', () => {
  it('assembles insights for the exercises in the split', () => {
    const days = ['2026-09-01', '2026-09-05', '2026-09-09', '2026-09-13'];
    const s = days.map((d, i) => session(d, [{ id: bench, sets: sets(60 + i, 8, 'ideal') }]));
    const split: Split = { id: 'split_push', name: 'Push', color: '#fff', exercises: [{ exerciseId: bench, sets: 3 }], focus: [], createdAt: '2026-01-01' };
    const out = preSessionInsights({ sessions: s, custom: [], today: '2026-09-18', split, profile: { name: 'Test' }, age: null });
    expect(out.length).toBeGreaterThan(0);
    expect(out.every(i => i.cadence === 'pre')).toBe(true);
  });
});
