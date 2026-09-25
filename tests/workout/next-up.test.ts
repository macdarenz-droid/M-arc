import { describe, it, expect } from 'vitest';
import { nextUpCore, targetKgPh, targetRepsPh } from '@/slices/workout/Train';

describe('A1/A9: the next-up set label', () => {
  it('targetKgPh prefers today\'s target, then last time, then bw, then empty', () => {
    expect(targetKgPh({ kg: 60 }, { kg: 55 }, 'kg', 'weighted')).toBe('60');
    expect(targetKgPh(undefined, { kg: 55 }, 'kg', 'weighted')).toBe('55');
    expect(targetKgPh(undefined, undefined, 'kg', 'bodyweight')).toBe('bw');
    expect(targetKgPh(undefined, undefined, 'kg', 'weighted')).toBe('');
  });

  it('targetRepsPh prefers today\'s target, then last time, then empty', () => {
    expect(targetRepsPh({ reps: 8 }, { reps: 10 })).toBe('8');
    expect(targetRepsPh(undefined, { reps: 10 })).toBe('10');
    expect(targetRepsPh(undefined, undefined)).toBe('');
  });

  it('nextUpCore formats a loaded set as "kg unit x reps"', () => {
    expect(nextUpCore('62.5', 'kg', '8')).toBe('62.5 kg × 8');
  });

  it('nextUpCore drops the load for bodyweight or no-load sets', () => {
    expect(nextUpCore('bw', 'kg', '8')).toBe('8 reps');
    expect(nextUpCore('', 'kg', '8')).toBe('8 reps');
  });

  it('nextUpCore is null with nothing to log yet', () => {
    expect(nextUpCore('', 'kg', '')).toBeNull();
  });
});
