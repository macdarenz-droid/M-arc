/**
 * Reps-in-reserve bias (6.13 "RIR bias" foundation, "Effort calibration"
 * insight). When a max-effort set and a non-max set at the same load happen
 * within 14 days of each other, the gap between their reps is what the
 * non-max set's reps in reserve actually were — often more than the label
 * assumes, especially for newer lifters.
 */
import type { ExerciseSessionSummary } from './history';
import { daysBetween } from '@/core/dates';

const ASSUMED_RIR: Record<'easy' | 'ideal', number> = { easy: 3, ideal: 2 };

export interface RirObservation {
  day: string;
  kg: number;
  otherEffort: 'easy' | 'ideal';
  impliedRir: number;
}

/** Every same-load max/non-max pair within 14 days, across a chronological exercise history. */
export function rirObservations(hist: ExerciseSessionSummary[]): RirObservation[] {
  const out: RirObservation[] = [];
  for (let i = 0; i < hist.length; i++) {
    for (let j = i + 1; j < hist.length; j++) {
      if (daysBetween(hist[i]!.day, hist[j]!.day) > 14) break; // hist is day-ascending
      for (const a of hist[i]!.sets) for (const b of hist[j]!.sets) {
        if (!a.kg || !b.kg || a.kg !== b.kg) continue;
        if (a.effort === 'max' && (b.effort === 'easy' || b.effort === 'ideal')) {
          out.push({ day: hist[j]!.day, kg: a.kg, otherEffort: b.effort, impliedRir: (a.reps ?? 0) - (b.reps ?? 0) });
        } else if (b.effort === 'max' && (a.effort === 'easy' || a.effort === 'ideal')) {
          out.push({ day: hist[i]!.day, kg: a.kg, otherEffort: a.effort, impliedRir: (b.reps ?? 0) - (a.reps ?? 0) });
        }
      }
    }
  }
  return out;
}

export interface EffortBias { effort: 'easy' | 'ideal'; bias: number; n: number }

/** Mean bias per effort label, only once 3+ observations exist, capped ±3 reps. */
export function effortBiasByLabel(observations: RirObservation[]): EffortBias[] {
  const groups = new Map<'easy' | 'ideal', number[]>();
  for (const o of observations) {
    const arr = groups.get(o.otherEffort) ?? [];
    arr.push(o.impliedRir);
    groups.set(o.otherEffort, arr);
  }
  const out: EffortBias[] = [];
  for (const [effort, vals] of groups) {
    if (vals.length < 3) continue;
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const bias = Math.max(-3, Math.min(3, mean - ASSUMED_RIR[effort]));
    out.push({ effort, bias, n: vals.length });
  }
  return out;
}
