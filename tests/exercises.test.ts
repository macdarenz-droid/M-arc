import { describe, it, expect } from 'vitest';
import { findExercise, findExerciseExact } from '@/core/exercises';

describe('findExercise (ST-13)', () => {
  it('an ambiguous fragment resolves to nothing', () => {
    expect(findExercise('Press')).toBeUndefined();
  });
  it('plurals and aliases still resolve', () => {
    expect(findExercise('Pull Ups')).toBeDefined();
    expect(findExercise('lib_barbell_bench_press')!.id).toBe('lib_barbell_bench_press');
  });
  it('findExerciseExact never guesses from a substring', () => {
    expect(findExerciseExact('Machine Chest Press')?.id).toBe('lib_machine_chest_press');
    expect(findExerciseExact('Chest Pres')).toBeUndefined();
  });
});

describe('a longer name is not filed under the library name it contains (QA-R3b-3)', () => {
  it('extra movement words make it a different exercise', () => {
    expect(findExercise('Hack Squat Calf Raise')?.id).not.toBe(findExercise('Hack Squat')?.id);
    expect(findExercise('Hack Squat Calf')?.id).not.toBe(findExercise('Hack Squat')?.id);
  });
  it('extra words that name no movement still match', () => {
    expect(findExercise('Hack Squat heavy')?.id).toBe(findExercise('Hack Squat')?.id);
  });
});

describe('the heavy main-lift damage floor (QA-R7-2, QA-R7-3)', () => {
  it('comes from DAMAGE_HEAVY_MAIN, so changing it changes the model', async () => {
    const { vi } = await import('vitest');
    vi.resetModules();
    vi.doMock('@/data/recovery', async orig => ({ ...(await orig<typeof import('@/data/recovery')>()), DAMAGE_HEAVY_MAIN: 1.5 }));
    const { setDamage } = await import('@/core/exercises');
    expect(setDamage({ id: 'x', name: 'Bench', role: 'main' }, 5)).toBe(1.5);
    vi.doUnmock('@/data/recovery');
    vi.resetModules();
  });
});
