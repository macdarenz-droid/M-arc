import { describe, it, expect } from 'vitest';
import { adjustedRecovery, detectReadiness, readinessFactor } from '@/brain/coach/detectors';
import { FATIGUE_RECOVERY_FACTOR, READINESS_LOW_AVG, READINESS_PATTERN_MIN_LOW, READINESS_RECOVERY_FACTOR_MAX } from '@/brain/coach/bands';
import type { ReadinessEntry } from '@/core/models';
import { session, sets } from './helpers';
import { addDays } from '@/core/dates';
import { ctx, TODAY } from './coach-helpers';

const entry = (day: string, sleep: 1 | 2 | 3 | 4 | 5, soreness: 1 | 2 | 3 | 4 | 5, stress: 1 | 2 | 3 | 4 | 5): ReadinessEntry => ({ day, sleep, soreness, stress });

describe('readinessFactor', () => {
  it('is 1 with no check-in today, and 1 for a good check-in', () => {
    expect(readinessFactor(ctx([], { readiness: [] }))).toBe(1);
    expect(readinessFactor(ctx([], { readiness: [entry(TODAY, 4, 5, 4)] }))).toBe(1);
    expect(readinessFactor(ctx([], { readiness: [entry('2026-09-18', 1, 1, 1)] }))).toBe(1); // yesterday, not today
  });

  it('widens toward the cap as today\'s check-in gets worse, capping at the worst possible reading', () => {
    const mild = readinessFactor(ctx([], { readiness: [entry(TODAY, 2, 2, 2)] })); // avg 2, just under the 2.5 threshold
    expect(mild).toBeGreaterThan(1);
    expect(mild).toBeLessThan(READINESS_RECOVERY_FACTOR_MAX);
    expect(readinessFactor(ctx([], { readiness: [entry(TODAY, 1, 1, 1)] }))).toBe(READINESS_RECOVERY_FACTOR_MAX);
  });
});

describe('adjustedRecovery combines volume and readiness', () => {
  const now = new Date('2026-09-19T18:00:00.000Z').getTime();
  const usual = [session('2026-09-18', [{ id: 'lib_machine_chest_press', sets: sets(50, 8, 'ideal', 3) }])];

  it('a low check-in today widens the window even when the session itself was ordinary', () => {
    const withoutCheckIn = adjustedRecovery(ctx(usual, { now })).find(r => r.muscle === 'chest')!;
    expect(withoutCheckIn.volumeFactor).toBe(1);
    expect(withoutCheckIn.readinessFactor).toBe(1);
    expect(withoutCheckIn.adjustedWindowHours).toBe(48);
    const withCheckIn = adjustedRecovery(ctx(usual, { now, readiness: [entry(TODAY, 1, 1, 1)] })).find(r => r.muscle === 'chest')!;
    expect(withCheckIn.readinessFactor).toBe(READINESS_RECOVERY_FACTOR_MAX);
    expect(withCheckIn.adjustedWindowHours).toBeGreaterThan(withoutCheckIn.adjustedWindowHours);
    expect(withCheckIn.adjustedWindowHours).toBe(Math.round(48 * READINESS_RECOVERY_FACTOR_MAX));
  });

  it('never shrinks the window, and the larger of the two factors wins rather than multiplying', () => {
    const prior = [0, 1, 2, 3].map(i => session(addDays('2026-09-01', i * 4), [{ id: 'lib_machine_chest_press', sets: sets(50, 8, 'ideal', 3) }]));
    const big = [...prior, session('2026-09-18', [{ id: 'lib_machine_chest_press', sets: sets(50, 8, 'ideal', 9) }])]; // volume factor caps at 1.5, bigger than the readiness cap
    const r = adjustedRecovery(ctx(big, { now, readiness: [entry(TODAY, 1, 1, 1)] })).find(x => x.muscle === 'chest')!;
    expect(r.volumeFactor).toBe(1.5);
    expect(r.readinessFactor).toBe(READINESS_RECOVERY_FACTOR_MAX);
    expect(r.adjustedWindowHours).toBe(72); // volume's wider factor wins, not the two multiplied together
  });
});

describe('adjustedRecovery: a session note tagged "fatigue" widens that session\'s recovery window', () => {
  const now = new Date('2026-09-19T18:00:00.000Z').getTime();
  const usual = (noteFlags?: { kind: 'fatigue'; muscle: 'chest' | null }[]) => [
    { ...session('2026-09-18', [{ id: 'lib_machine_chest_press', sets: sets(50, 8, 'ideal', 3) }]), ...(noteFlags ? { noteFlags } : {}) },
  ];

  it('a whole-session fatigue note (no muscle named) widens every muscle trained that day', () => {
    const withoutFlag = adjustedRecovery(ctx(usual(), { now })).find(r => r.muscle === 'chest')!;
    expect(withoutFlag.fatigueFactor).toBe(1);
    const withFlag = adjustedRecovery(ctx(usual([{ kind: 'fatigue', muscle: null }]), { now })).find(r => r.muscle === 'chest')!;
    expect(withFlag.fatigueFactor).toBe(FATIGUE_RECOVERY_FACTOR);
    expect(withFlag.adjustedWindowHours).toBe(Math.round(48 * FATIGUE_RECOVERY_FACTOR));
  });

  it('a muscle-specific fatigue note only widens that muscle, not an unrelated one', () => {
    const both = [
      session('2026-09-18', [{ id: 'lib_machine_chest_press', sets: sets(50, 8, 'ideal', 3) }], 'split_push'),
      { ...session('2026-09-18', [{ id: 'lib_barbell_back_squat', sets: sets(60, 8, 'ideal', 3) }], 'split_legs'), noteFlags: [{ kind: 'fatigue' as const, muscle: 'chest' as const }] },
    ];
    const out = adjustedRecovery(ctx(both, { now }));
    expect(out.find(r => r.muscle === 'chest')!.fatigueFactor).toBe(FATIGUE_RECOVERY_FACTOR);
    expect(out.find(r => r.muscle === 'quads')!.fatigueFactor).toBe(1);
  });

  it('never shrinks the window, and combines with the other factors by taking the largest rather than multiplying', () => {
    const flagged = adjustedRecovery(ctx(usual([{ kind: 'fatigue', muscle: null }]), { now, readiness: [entry(TODAY, 1, 1, 1)] })).find(r => r.muscle === 'chest')!;
    expect(flagged.fatigueFactor).toBe(FATIGUE_RECOVERY_FACTOR);
    expect(flagged.readinessFactor).toBe(READINESS_RECOVERY_FACTOR_MAX);
    // Both factors are the same size here, so the combined window matches either one alone, not their product.
    expect(flagged.adjustedWindowHours).toBe(Math.round(48 * READINESS_RECOVERY_FACTOR_MAX));
  });
});

describe('detectReadiness', () => {
  it('stays quiet with no check-in today, and with a single low reading and no pattern behind it', () => {
    expect(detectReadiness(ctx([], { readiness: [] }))).toEqual([]);
    expect(detectReadiness(ctx([], { readiness: [entry(TODAY, 1, 1, 1)] }))).toEqual([]);
    expect(READINESS_PATTERN_MIN_LOW).toBeGreaterThan(1); // the gate this test relies on
  });

  it('stays quiet when today itself reads fine, even with a low history', () => {
    const readiness = [entry('2026-09-17', 1, 1, 1), entry('2026-09-18', 1, 1, 1), entry(TODAY, 5, 5, 5)];
    expect(detectReadiness(ctx([], { readiness }))).toEqual([]);
  });

  it('speaks up once enough of the trailing check-ins, today included, were low', () => {
    const readiness = [entry('2026-09-15', 4, 4, 4), entry('2026-09-17', 2, 1, 2), entry(TODAY, 1, 2, 1)];
    const out = detectReadiness(ctx([], { readiness }));
    expect(out).toHaveLength(1);
    const f = out[0]!;
    expect(f.kind).toBe('low_readiness');
    expect(f.metrics.sleep).toBe(1);
    expect(f.metrics.soreness).toBe(2);
    expect(f.metrics.stress).toBe(1);
    expect(f.metrics.avg).toBe(1.3); // round1 of (1 + 2 + 1) / 3
    expect(f.metrics.thresholdAvg).toBe(READINESS_LOW_AVG);
    expect(f.metrics.lowCheckIns).toBe(2);
    expect(f.principles).toEqual(['subjective_readiness_monitoring']);
  });

  it('ignores a low check-in more than a week old', () => {
    const readiness = [entry('2026-09-05', 1, 1, 1), entry(TODAY, 1, 1, 1)];
    expect(detectReadiness(ctx([], { readiness }))).toEqual([]);
  });
});
