import { describe, expect, it } from 'vitest';
import type { ReadinessEntry } from '@/core/models';
import type { AdjustedRecovery } from '@/brain/coach/detectors/recovery';
import type { Proposal } from '@/brain/coach/contract';
import { readinessCard, readinessConsequence, type ReadinessConsequence } from '@/brain/coach/verdict';
import { readinessToday } from '@/brain/readiness';
import { RECOVERY_FLAG_PCT, RECOVERY_SWAP_PCT } from '@/brain/coach/bands';
import { addDays } from '@/core/dates';
import { PUSH_ID, TODAY } from './coach-helpers';

type Score = 1 | 2 | 3 | 4 | 5;
const check = (day: string, sleep: Score, soreness: Score, stress: Score): ReadinessEntry => ({ day, sleep, soreness, stress });
const prior = (score: Score) => Array.from({ length: 10 }, (_, i) => check(addDays(TODAY, -(i + 1)), score, score, score));
const recovery = (over: Partial<AdjustedRecovery> = {}): AdjustedRecovery => ({
  muscle: 'chest', pct: 80, hoursLeft: 10, windowHours: 48,
  lastTrainedAt: '2026-09-18T12:00:00.000Z', lastDay: '2026-09-18', personalized: false, recovering: true,
  volumeFactor: 1, readinessFactor: 1.3, fatigueFactor: 1,
  adjustedWindowHours: 62, adjustedPct: 70, adjustedHoursLeft: 20,
  pctWithoutReadiness: 80, windowHoursWithoutReadiness: 48, readinessPersonalized: true,
  ...over,
});
const plan = (reason: 'under_recovered' | 'note_flag' = 'under_recovered'): Proposal => ({
  id: 'today:x', kind: 'today_plan', subject: { splitId: PUSH_ID, splitName: 'Push' },
  apply: { kind: 'today_plan', recommendedSplitId: PUSH_ID, options: [], modifications: [{ removeExerciseId: 'lib_machine_chest_press', reason }] },
  basedOn: [], principles: [], confidence: 'medium', dismissKey: 'today:x', expiresOn: TODAY,
});
const clean = (value: string) => value.length > 0 && !/undefined|NaN|\{|\}|\[object/.test(value);

describe('readiness consequence attribution', () => {
  it('reports only thresholds crossed because of readiness', () => {
    const flag = readinessConsequence({ recovery: [recovery()], plan: null, custom: [], hasScheduledSplit: true });
    expect(flag).toEqual({ kind: 'recovery_flag', muscles: ['chest'], pct: 70, pctWithout: 80, thresholdPct: RECOVERY_FLAG_PCT });

    const swap = readinessConsequence({ recovery: [recovery({ adjustedPct: 55, pctWithoutReadiness: 65 })], plan: null, custom: [], hasScheduledSplit: true });
    expect(swap).toEqual({ kind: 'recovery_swap', muscles: ['chest'], pct: 55, pctWithout: 65, thresholdPct: RECOVERY_SWAP_PCT });

    expect(readinessConsequence({ recovery: [recovery({ adjustedPct: 55, pctWithoutReadiness: 55 })], plan: null, custom: [], hasScheduledSplit: true })).toMatchObject({ kind: 'none' });
  });

  it('switching splits does not claim an ignored swap, and a note flag is never attributed', () => {
    const crossed = recovery({ adjustedPct: 55, pctWithoutReadiness: 65 });
    expect(readinessConsequence({ recovery: [crossed], plan: plan(), custom: [], hasScheduledSplit: true })).toMatchObject({
      kind: 'plan_swap', exerciseIds: ['lib_machine_chest_press'], exerciseNames: ['Machine Chest Press'], muscle: 'chest', pct: 55, pctWithout: 65,
    });
    expect(readinessConsequence({ recovery: [crossed], plan: plan('note_flag'), custom: [], hasScheduledSplit: true }).kind).toBe('recovery_swap');
    const switchPlan = { ...plan(), apply: { ...plan().apply, recommendedSplitId: 'split_pull' } } as Proposal;
    expect(readinessConsequence({ recovery: [crossed], plan: switchPlan, custom: [], hasScheduledSplit: true }).kind).toBe('recovery_swap');
  });

  it('attribution names only the muscle whose numbers are shown', () => {
    const chest = recovery({ muscle: 'chest', adjustedPct: 52, pctWithoutReadiness: 65 });
    const triceps = recovery({ muscle: 'triceps', adjustedPct: 57, pctWithoutReadiness: 68 });
    const tricepsPlan = { ...plan(), apply: { kind: 'today_plan' as const, recommendedSplitId: PUSH_ID, options: [], modifications: [{ removeExerciseId: 'lib_triceps_pushdown', reason: 'under_recovered' as const }] } };
    expect(readinessConsequence({ recovery: [chest, triceps], plan: tricepsPlan, custom: [], hasScheduledSplit: true })).toMatchObject({
      kind: 'plan_swap', muscle: 'triceps', pct: 57, pctWithout: 68,
    });
  });

  it('states honestly when no recovery threshold moved', () => {
    expect(readinessConsequence({ recovery: [], plan: null, custom: [], hasScheduledSplit: true })).toEqual({ kind: 'none', thresholdPct: RECOVERY_FLAG_PCT });
    expect(readinessConsequence({ recovery: [], plan: null, custom: [], hasScheduledSplit: false })).toEqual({ kind: 'none_scheduled' });
  });
});

describe('readiness card copy', () => {
  const fixtures = [
    readinessToday([check(TODAY, 1, 1, 1)], TODAY)!,
    readinessToday([...prior(4), check(TODAY, 4, 4, 2)], TODAY)!,
    readinessToday([...prior(3), check(TODAY, 5, 5, 5)], TODAY)!,
    readinessToday([...prior(4), check(TODAY, 4, 4, 4)], TODAY)!,
  ];
  const consequences: ReadinessConsequence[] = [
    { kind: 'plan_swap', exerciseIds: ['a'], exerciseNames: ['Chest Press'], muscle: 'chest', pct: 55, pctWithout: 65, thresholdPct: 60 },
    { kind: 'recovery_swap', muscles: ['chest'], pct: 55, pctWithout: 65, thresholdPct: 60 },
    { kind: 'recovery_flag', muscles: ['chest'], pct: 70, pctWithout: 80, thresholdPct: 75 },
    { kind: 'none_scheduled' },
    { kind: 'none', thresholdPct: 75 },
  ];

  it('builds clean copy for every verdict and consequence kind', () => {
    expect(fixtures.map(r => r.verdict)).toEqual(['red', 'amber', 'green', 'steady']);
    for (const readiness of fixtures) for (const consequence of consequences) {
      const card = readinessCard({ readiness, consequence, canOfferPlan: true });
      expect(clean(card.headline)).toBe(true);
      expect(clean(card.detail)).toBe(true);
      if (readiness.verdict === 'red' || readiness.verdict === 'amber') expect(clean(card.consequence)).toBe(true);
      else {
        expect(card.consequence).toBe('');
        expect(card.showPlanAction).toBe(false);
      }
    }
  });

  it('offers the existing plan action only for an attributed amber or red plan swap', () => {
    const readiness = fixtures[1]!;
    const consequence = consequences[0]!;
    expect(readinessCard({ readiness, consequence, canOfferPlan: true }).showPlanAction).toBe(true);
    expect(readinessCard({ readiness, consequence, canOfferPlan: false }).showPlanAction).toBe(false);
    expect(readinessCard({ readiness, consequence: consequences[1]!, canOfferPlan: true }).showPlanAction).toBe(false);
  });

  it('describes steady drift in check-ins, not days', () => {
    const history = prior(4).map((r, i) => i < 3 ? { ...r, stress: 3 as const } : r);
    const readiness = readinessToday([...history, check(TODAY, 4, 4, 3)], TODAY)!;
    const card = readinessCard({ readiness, consequence: { kind: 'none', thresholdPct: 75 }, canOfferPlan: false });
    expect(card.detail).toContain('Stress');
    expect(card.detail).toContain('3/5');
    expect(card.detail).toContain('last 4 check-ins');
    expect(card.detail).toContain('sleep is holding');
    expect(card.detail).not.toContain('%');
    expect(card.detail).not.toContain('days');
  });

  it('absolute green does not claim above-baseline improvement', () => {
    const readiness = readinessToday([check(TODAY, 5, 5, 5)], TODAY)!;
    const card = readinessCard({ readiness, consequence: { kind: 'none', thresholdPct: 75 }, canOfferPlan: false });
    expect(card.verdict).toBe('green');
    expect(card.personalized).toBe(false);
    expect(card.detail).not.toMatch(/above|better|improv/i);
    expect(card.detail).toContain('Not enough check-ins');
  });
});
