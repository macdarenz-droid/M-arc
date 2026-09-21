/** Pure attribution and copy for the morning-readiness card. */
import type { Exercise } from '@/core/models';
import { findExercise } from '@/core/exercises';
import { muscleLabel, type MuscleId } from '@/data/muscles';
import { READINESS_DIMENSION_LABEL, type ReadinessToday, type ReadinessVerdict } from '../readiness';
import { READINESS_BASELINE_WINDOW_DAYS, READINESS_Z_AMBER, RECOVERY_FLAG_PCT, RECOVERY_SWAP_PCT } from './bands';
import type { Proposal } from './contract';
import type { AdjustedRecovery } from './detectors/recovery';

export type ReadinessTone = 'positive' | 'warning' | 'danger' | 'muted';
export type ReadinessConsequence =
  | { kind: 'plan_swap'; exerciseIds: string[]; exerciseNames: string[]; muscle: MuscleId; pct: number; pctWithout: number; thresholdPct: number }
  | { kind: 'recovery_swap'; muscles: MuscleId[]; pct: number; pctWithout: number; thresholdPct: number }
  | { kind: 'recovery_flag'; muscles: MuscleId[]; pct: number; pctWithout: number; thresholdPct: number }
  | { kind: 'none_scheduled' }
  | { kind: 'none'; thresholdPct: number };

export interface ReadinessCard {
  verdict: ReadinessVerdict;
  tone: ReadinessTone;
  headline: string;
  detail: string;
  consequence: string;
  showPlanAction: boolean;
  personalized: boolean;
}

const byWorst = (a: AdjustedRecovery, b: AdjustedRecovery): number => a.adjustedPct - b.adjustedPct || a.muscle.localeCompare(b.muscle);

export function readinessConsequence(input: {
  recovery: AdjustedRecovery[];
  plan: Proposal | null;
  custom: Exercise[];
  hasScheduledSplit: boolean;
}): ReadinessConsequence {
  const crossedSwap = input.recovery
    .filter(r => r.lastTrainedAt !== null && r.readinessFactor > 1 && r.adjustedPct < RECOVERY_SWAP_PCT && r.pctWithoutReadiness >= RECOVERY_SWAP_PCT)
    .sort(byWorst);
  const crossedFlag = input.recovery
    .filter(r => r.lastTrainedAt !== null && r.readinessFactor > 1 && r.adjustedPct < RECOVERY_FLAG_PCT && r.pctWithoutReadiness >= RECOVERY_FLAG_PCT)
    .sort(byWorst);
  const swapSet = new Set(crossedSwap.map(r => r.muscle));
  const apply = input.plan?.apply;
  const attributed = apply?.kind === 'today_plan'
    && (apply.recommendedSplitId ?? input.plan?.subject.splitId) === input.plan?.subject.splitId
    ? apply.modifications.filter(change => {
      if (change.reason !== 'under_recovered') return false;
      const primary = findExercise(change.removeExerciseId, input.custom)?.primary[0];
      return !!primary && swapSet.has(primary);
    }) : [];
  if (attributed.length) {
    const ids = attributed.map(change => change.removeExerciseId);
    const muscles = new Set(ids.map(id => findExercise(id, input.custom)?.primary[0]).filter((m): m is MuscleId => !!m));
    const worst = crossedSwap.find(r => muscles.has(r.muscle)) ?? crossedSwap[0]!;
    return {
      kind: 'plan_swap', exerciseIds: ids,
      exerciseNames: ids.map(id => findExercise(id, input.custom)?.name ?? id),
      muscle: worst.muscle, pct: worst.adjustedPct, pctWithout: worst.pctWithoutReadiness,
      thresholdPct: RECOVERY_SWAP_PCT,
    };
  }
  if (crossedSwap.length) {
    const worst = crossedSwap[0]!;
    return { kind: 'recovery_swap', muscles: crossedSwap.map(r => r.muscle), pct: worst.adjustedPct, pctWithout: worst.pctWithoutReadiness, thresholdPct: RECOVERY_SWAP_PCT };
  }
  if (crossedFlag.length) {
    const worst = crossedFlag[0]!;
    return { kind: 'recovery_flag', muscles: crossedFlag.map(r => r.muscle), pct: worst.adjustedPct, pctWithout: worst.pctWithoutReadiness, thresholdPct: RECOVERY_FLAG_PCT };
  }
  return input.hasScheduledSplit ? { kind: 'none', thresholdPct: RECOVERY_FLAG_PCT } : { kind: 'none_scheduled' };
}

function relativeDetail(readiness: ReadinessToday): string {
  const baseline = readiness.baseline!;
  return readiness.worst
    ? `${READINESS_DIMENSION_LABEL[readiness.worst.dimension]} ${readiness.worst.value}/5 against your usual ${readiness.worst.median}/5. Today averages ${readiness.avg} where you normally read ${baseline.avg.median}.`
    : `Today averages ${readiness.avg} where you normally read ${baseline.avg.median}.`;
}

function consequenceLine(consequence: ReadinessConsequence): string {
  switch (consequence.kind) {
    case 'plan_swap': {
      const target = consequence.exerciseNames.length === 1 ? consequence.exerciseNames[0]! : `${consequence.exerciseNames.length} lifts`;
      return `That check-in is why the coach suggests adjusting ${target} today: ${muscleLabel(consequence.muscle)} reads ${consequence.pct}% recovered with this morning counted, ${consequence.pctWithout}% without it.`;
    }
    case 'recovery_swap':
      return `With this morning counted, ${muscleLabel(consequence.muscles[0]!)} reads ${consequence.pct}% recovered instead of ${consequence.pctWithout}% — under the ${consequence.thresholdPct}% line where the coach swaps the lifts that hit it.`;
    case 'recovery_flag':
      return `With this morning counted, ${muscleLabel(consequence.muscles[0]!)} reads ${consequence.pct}% recovered instead of ${consequence.pctWithout}% — under the ${consequence.thresholdPct}% line, though nothing in today's plan changes because of it.`;
    case 'none':
      return 'No new recovery threshold was crossed because of this check-in. Your plan still needs an explicit acceptance.';
    case 'none_scheduled':
      return 'Nothing is scheduled today, so there is nothing to change — the reading is logged either way.';
  }
}

export function readinessCard(input: { readiness: ReadinessToday; consequence: ReadinessConsequence; canOfferPlan: boolean }): ReadinessCard {
  const r = input.readiness;
  const { sleep, soreness, stress } = r.entry;
  let headline: string;
  let detail: string;
  if (r.verdict === 'red') {
    headline = r.personalized && r.z !== null && r.z <= READINESS_Z_AMBER ? 'Well below your normal' : 'A low morning';
    if (r.personalized && r.z !== null && r.z <= READINESS_Z_AMBER) detail = relativeDetail(r);
    else if (r.personalized) detail = `Sleep ${sleep}/5, soreness ${soreness}/5, stress ${stress}/5 — an average of ${r.avg}. That is close to your usual ${r.baseline!.avg.median}, and still low enough that the coach treats it as a hard day.`;
    else detail = `Sleep ${sleep}/5, soreness ${soreness}/5, stress ${stress}/5 — an average of ${r.avg}, at or under the ${r.lowLine} the coach treats as low.`;
  } else if (r.verdict === 'amber') {
    headline = 'Below your normal';
    detail = relativeDetail(r);
  } else if (r.verdict === 'green') {
    headline = 'Good to go';
    detail = r.personalized
      ? `Sleep ${sleep}/5, soreness ${soreness}/5, stress ${stress}/5 — Today averages ${r.avg}; your usual is ${r.baseline!.avg.median}. Keep to your planned targets and effort range.`
      : `Sleep ${sleep}/5, soreness ${soreness}/5, stress ${stress}/5. Not enough check-ins yet to know your normal, but that reads well. Keep to your planned targets and effort range.`;
  } else if (r.drift) {
    headline = 'Steady';
    const holding = r.drift.holding ? `; ${READINESS_DIMENSION_LABEL[r.drift.holding].toLowerCase()} is holding` : '';
    detail = `${READINESS_DIMENSION_LABEL[r.drift.dimension]} has read ${r.drift.value}/5 for your last ${r.drift.run} check-ins, against your usual ${r.drift.median}/5${holding}.`;
  } else if (r.personalized) {
    headline = 'Steady';
    detail = `Sleep ${sleep}/5, soreness ${soreness}/5, stress ${stress}/5 — your usual ${r.baseline!.avg.median}.`;
  } else {
    headline = 'Logged';
    detail = `Sleep ${sleep}/5, soreness ${soreness}/5, stress ${stress}/5. ${r.entriesInWindow} check-ins in the last ${READINESS_BASELINE_WINDOW_DAYS} days; ${r.baselineEntriesNeeded} more and the coach can read these against your own normal instead of a textbook.`;
  }
  const actionable = r.verdict === 'amber' || r.verdict === 'red';
  return {
    verdict: r.verdict,
    tone: { red: 'danger', amber: 'warning', green: 'positive', steady: 'muted' }[r.verdict] as ReadinessTone,
    headline, detail,
    consequence: actionable ? consequenceLine(input.consequence) : '',
    showPlanAction: actionable && input.canOfferPlan && input.consequence.kind === 'plan_swap',
    personalized: r.personalized,
  };
}
