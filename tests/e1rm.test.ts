import { describe, it, expect } from 'vitest';
import { effectiveOneRm, e1rmWeight, isRealChange, loadForReps, roundToStep } from '@/brain/e1rm';

describe('effectiveOneRm', () => {
  it('max effort assumes zero reps in reserve', () => {
    expect(effectiveOneRm(100, 5, 'max')).toBeCloseTo(100 * (1 + 5 / 30), 5);
  });
  it('easy assumes 3 reps in reserve, so it estimates higher than max at the same reps', () => {
    const easy = effectiveOneRm(100, 5, 'easy')!;
    const max = effectiveOneRm(100, 5, 'max')!;
    expect(easy).toBeGreaterThan(max);
  });
  it('unrated defaults to ideal (RIR 2)', () => {
    expect(effectiveOneRm(100, 5, undefined)).toBeCloseTo(effectiveOneRm(100, 5, 'ideal')!, 5);
  });
  it('null outside 1-10 reps or with no load', () => {
    expect(effectiveOneRm(100, 11, 'ideal')).toBeNull();
    expect(effectiveOneRm(0, 5, 'ideal')).toBeNull();
    expect(effectiveOneRm(100, 0, 'ideal')).toBeNull();
  });
  it('a personal RIR bias shifts the assumed reps in reserve, never below zero', () => {
    const noBias = effectiveOneRm(100, 5, 'ideal', 0)!;
    const biasedUp = effectiveOneRm(100, 5, 'ideal', 2)!;
    const biasedDown = effectiveOneRm(100, 5, 'ideal', -5)!;
    expect(biasedUp).toBeGreaterThan(noBias);
    expect(biasedDown).toBe(effectiveOneRm(100, 5, 'max', 0)); // clamped at RIR 0
  });
});

describe('e1rmWeight', () => {
  it('down-weights 7-10 rep sets relative to 6 or fewer', () => {
    expect(e1rmWeight(5)).toBe(1);
    expect(e1rmWeight(8)).toBe(0.5);
  });
});

describe('isRealChange', () => {
  it('flags a change above two typical errors', () => {
    expect(isRealChange(100, 109)).toBe(true);
    expect(isRealChange(100, 103)).toBe(false);
  });
  it('anything from zero is a real change', () => {
    expect(isRealChange(0, 50)).toBe(true);
  });
});

describe('loadForReps and roundToStep', () => {
  it('inverts the Epley formula', () => {
    const e1rm = 130;
    expect(loadForReps(e1rm, 5)).toBeCloseTo(130 / (1 + 5 / 30), 5);
  });
  it('rounds to the nearest step', () => {
    expect(roundToStep(83.3)).toBe(82.5);
    expect(roundToStep(84.0)).toBe(85);
  });
});
