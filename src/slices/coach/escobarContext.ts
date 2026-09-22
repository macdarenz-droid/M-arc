/** Everything Escobar reads, gathered from the live selectors into brain/coach/escobar.ts's grounding. Built fresh per question, never on render. */
import { state } from '@/core/store';
import { activeDeload, coachContext, deloadSuggestion, recovery, scheduledSplit, today, todayReadiness } from '@/app/selectors';
import { buildGrounding } from '@/brain/coach/escobar';
import type { GroundingPayload } from '@/brain/coach/grounding';
import { suggestNext } from '@/brain/progression';
import { recoveryPctFor } from '@/brain/recovery';
import { muscleVolumeStatus } from '@/brain/volume';

export function currentGrounding(): GroundingPayload {
  const s = state.value;
  const split = scheduledSplit.value;
  const nextTargets = (split?.exercises ?? []).map(se => ({
    exerciseId: se.exerciseId,
    suggestion: suggestNext(s.sessions, se.exerciseId, s.goal, today.value, se.sets, s.customExercises, { readiness: todayReadiness.value, recoveryPct: recoveryPctFor(se.exerciseId, s.customExercises, recovery.value), deload: activeDeload.value }),
  }));
  return buildGrounding({
    ctx: coachContext.value,
    goal: s.goal,
    unit: s.preferences.weightUnit,
    profile: s.profile,
    preferences: s.coach.statedConstraints,
    readiness: todayReadiness.value,
    recovery: recovery.value,
    volume: muscleVolumeStatus(s.sessions, today.value, s.customExercises),
    deloadOffer: deloadSuggestion.value,
    todaySplit: split,
    nextTargets,
  });
}
