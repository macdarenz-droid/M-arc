/**
 * Effort-aware one-rep-max estimate (6.13 foundations). Epley, but reps in
 * reserve come from the effort label, not just the rep count, so a max-effort
 * set of 5 and an easy set of 5 no longer produce the same estimate.
 */
import type { Effort } from '@/core/models';

const RIR_BY_EFFORT: Record<Effort, number> = { easy: 3, ideal: 2, max: 0 };

/** Epley with effectiveReps = reps + RIR(effort). Null for sets outside 1-10 reps or with no load. */
export function effectiveOneRm(kg: number, reps: number, effort?: Effort, rirBias = 0): number | null {
  if (!(kg > 0) || !(reps > 0) || reps > 10) return null;
  const rir = Math.max(0, RIR_BY_EFFORT[effort ?? 'ideal'] + rirBias);
  return kg * (1 + (reps + rir) / 30);
}

/** Sets of 7-10 reps carry more estimation error than sets of 6 or fewer; weight them at half in an aggregate. */
export function e1rmWeight(reps: number): number {
  return reps > 6 ? 0.5 : 1;
}

export function roundToStep(kg: number, step = 2.5): number {
  return Math.round(kg / step) * step;
}

/**
 * A change is only "real" above two typical errors. Default typical error is
 * 4% (consecutive-session noise), so about 5-8% combined depending on the pair.
 */
export function isRealChange(fromKg: number, toKg: number, typicalErrorPct = 0.04): boolean {
  if (fromKg <= 0) return toKg > 0;
  return Math.abs(toKg - fromKg) / fromKg > typicalErrorPct * 2;
}

/** Epley solved for load at a target rep count, from a trend e1RM. Used for load targets and warm-ups. */
export function loadForReps(e1rm: number, reps: number): number {
  return e1rm / (1 + reps / 30);
}
