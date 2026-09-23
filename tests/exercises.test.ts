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
