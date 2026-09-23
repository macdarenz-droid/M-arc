import { describe, it, expect } from 'vitest';
import { autoregulationSuggestion } from '@/brain/coach/live';
import type { LoggedSet } from '@/core/models';

const set = (patch: Partial<LoggedSet>): LoggedSet => ({ fidelity: 'live', ...patch });

describe('autoregulationSuggestion', () => {
  it('suggests more load when easy at or above target reps', () => {
    const r = autoregulationSuggestion({
      exerciseId: 'bench', exerciseName: 'Bench Press',
      firstSet: set({ kg: 80, reps: 10, effort: 'easy' }),
      targetKg: 80, targetReps: 8, historyCount: 5,
    });
    expect(r?.action).toContain('82');
  });

  it('uses a flat 2.5 kg step below 3 sessions of history', () => {
    const r = autoregulationSuggestion({
      exerciseId: 'bench', exerciseName: 'Bench Press',
      firstSet: set({ kg: 80, reps: 10, effort: 'easy' }),
      targetKg: 80, targetReps: 8, historyCount: 2,
    });
    expect(r?.action).toContain('82.5');
  });

  it('uses a 2.5% step at 3 or more sessions of history', () => {
    const r = autoregulationSuggestion({
      exerciseId: 'bench', exerciseName: 'Bench Press',
      firstSet: set({ kg: 100, reps: 10, effort: 'easy' }),
      targetKg: 100, targetReps: 8, historyCount: 3,
    });
    expect(r?.action).toContain('102.5');
  });

  it('suggests less load when missed by two or more at max effort', () => {
    const r = autoregulationSuggestion({
      exerciseId: 'bench', exerciseName: 'Bench Press',
      firstSet: set({ kg: 80, reps: 6, effort: 'max' }),
      targetKg: 80, targetReps: 8, historyCount: 5,
    });
    expect(r?.title).toContain('ease off');
    expect(r?.action).toContain('77.5');
  });

  it('stays quiet when missed by only one at max effort', () => {
    const r = autoregulationSuggestion({
      exerciseId: 'bench', exerciseName: 'Bench Press',
      firstSet: set({ kg: 80, reps: 7, effort: 'max' }),
      targetKg: 80, targetReps: 8, historyCount: 5,
    });
    expect(r).toBeNull();
  });

  it('stays quiet at ideal effort', () => {
    const r = autoregulationSuggestion({
      exerciseId: 'bench', exerciseName: 'Bench Press',
      firstSet: set({ kg: 80, reps: 8, effort: 'ideal' }),
      targetKg: 80, targetReps: 8, historyCount: 5,
    });
    expect(r).toBeNull();
  });

  it('stays quiet on a non-live commit', () => {
    const r = autoregulationSuggestion({
      exerciseId: 'bench', exerciseName: 'Bench Press',
      firstSet: { fidelity: 'retro', kg: 80, reps: 10, effort: 'easy' },
      targetKg: 80, targetReps: 8, historyCount: 5,
    });
    expect(r).toBeNull();
  });

  it('stays quiet without effort, kg, reps or a target', () => {
    expect(autoregulationSuggestion({ exerciseId: 'x', exerciseName: 'X', firstSet: set({ kg: 80, reps: 10 }), targetKg: 80, targetReps: 8, historyCount: 5 })).toBeNull();
    expect(autoregulationSuggestion({ exerciseId: 'x', exerciseName: 'X', firstSet: set({ effort: 'easy', reps: 10 }), targetKg: 80, targetReps: 8, historyCount: 5 })).toBeNull();
    expect(autoregulationSuggestion({ exerciseId: 'x', exerciseName: 'X', firstSet: set({ kg: 80, effort: 'easy' }), targetKg: 80, targetReps: 8, historyCount: 5 })).toBeNull();
    expect(autoregulationSuggestion({ exerciseId: 'x', exerciseName: 'X', firstSet: set({ kg: 80, reps: 10, effort: 'easy' }), targetKg: 0, targetReps: 8, historyCount: 5 })).toBeNull();
  });
});

describe('autoregulation without equipment never repeats the load (BR-18)', () => {
  it('a step that rounds back to the target moves a full 2.5 kg', async () => {
    const { autoregulationSuggestion } = await import('@/brain/coach/live');
    const up = autoregulationSuggestion({ exerciseId: 'x', exerciseName: 'X', firstSet: { kg: 40, reps: 10, effort: 'easy', fidelity: 'live' }, targetKg: 40, targetReps: 8, historyCount: 5 })!;
    expect(up.action).toBe('Try 42.5 kg for the next set.');
    const down = autoregulationSuggestion({ exerciseId: 'x', exerciseName: 'X', firstSet: { kg: 40, reps: 4, effort: 'max', fidelity: 'live' }, targetKg: 40, targetReps: 8, historyCount: 5 })!;
    expect(down.action).toMatch(/^Drop to 37.5 kg/);
  });
});
