/**
 * Wording for the heart-rate surfaces. The brain returns reason codes; the
 * sentences live here, next to the screens that show them, so the same code
 * always reads the same way and no screen invents its own rules.
 */
import type { HeartRateContext, HeartRateContextCode, HeartRateEvidenceCode, HeartRateSessionEvidence } from '@/brain/heart-rate';
import { HEART_RATE_EVIDENCE } from '@/brain/heart-rate';

export function evidenceReason(evidence: HeartRateSessionEvidence): string {
  const code: HeartRateEvidenceCode = evidence.code;
  switch (code) {
    case 'eligible': return 'Enough recording coverage for a workout comparison.';
    case 'no_recording': return 'No heart-rate recording for this workout.';
    case 'no_samples': return 'No heart-rate samples were recorded during this workout.';
    case 'invalid_timing': return 'Workout timing is invalid or in the future.';
    case 'inconsistent_totals': return 'Recording totals are inconsistent; they cannot support a comparison.';
    case 'inconsistent_values': return 'Recording values or sample times are inconsistent; they cannot support a comparison.';
    case 'legacy_unverified': return 'This older recording has no verified time coverage. Record a new workout to build comparisons.';
    case 'outdated': return 'This workout is older than the 42-day comparison window.';
    case 'too_short': return 'Record at least 3 minutes of heart rate before making comparisons.';
    case 'low_coverage': return evidence.coveragePct != null
      ? `Heart rate covered ${Math.round(evidence.coveragePct)}% of this workout; comparisons need at least ${HEART_RATE_EVIDENCE.minimumCoveragePct}%.`
      : `Comparisons need at least ${HEART_RATE_EVIDENCE.minimumCoveragePct}% coverage.`;
  }
}

export function contextReason(context: HeartRateContext): string {
  const code: HeartRateContextCode = context.code;
  switch (code) {
    case 'ready': return 'Compared with recent workouts using the same exercises, recorded loads and set counts, with similar volume and duration.';
    case 'no_recordings': return 'Record a workout with heart rate to start building your baseline.';
    case 'latest_not_eligible': return context.latestEvidence ? evidenceReason(context.latestEvidence) : 'That recording cannot support a comparison.';
    case 'latest_unmatchable': return 'Pulse is recorded, but this workout cannot be matched reliably with the available load data.';
    case 'baseline_too_small':
      return `${context.baselineCount} of ${HEART_RATE_EVIDENCE.minimumBaselineSessions} prior comparable workouts recorded. Match the split, exercises, loads, set counts and a similar duration.`;
  }
}

export function contextAdvice(context: HeartRateContext): string {
  switch (context.code) {
    case 'ready':
      return context.direction === 'usual'
        ? 'Keep logging effort and rest lengths to make the next comparison more informative.'
        : 'Review your rest lengths, effort ratings and training conditions, then see whether this pattern repeats. Pulse alone does not explain the change or determine your next load.';
    case 'latest_not_eligible':
      return context.latestEvidence?.quality === 'limited'
        ? 'Check the sensor connection and fit, and record the next workout from start to finish.'
        : 'Connect your sensor before training and rate your sets to build useful context.';
    case 'latest_unmatchable':
      return 'Use the recording and your effort ratings as context. Comparisons currently need known weighted exercises with complete loads and reps.';
    case 'baseline_too_small':
      return 'Keep recording your usual workouts and rate your effort; there is no need to repeat work just to fill this baseline.';
    case 'no_recordings':
      return 'Connect your sensor before training and rate your sets to build useful context.';
  }
}

/** The one-line observation. Null until there is a real comparison to describe. */
export function contextObservation(context: HeartRateContext): string | null {
  if (context.state !== 'ready' || context.direction == null || context.baselineMedianBpm == null ||
      context.deltaBpm == null || context.latestEvidence?.averageBpm == null) return null;
  const matches = context.baselineCount === 1 ? '1 comparable workout' : `${context.baselineCount} comparable workouts`;
  const pulse = context.direction === 'usual'
    ? `Average recorded pulse was ${Math.round(context.latestEvidence.averageBpm)} bpm, close to your ${Math.round(context.baselineMedianBpm)} bpm median across ${matches}.`
    : `Average recorded pulse was ${Math.round(Math.abs(context.deltaBpm))} bpm ${context.direction} than your ${Math.round(context.baselineMedianBpm)} bpm median across ${matches}.`;
  const effort = context.effort.direction === 'unknown' ? 'Effort ratings are too limited to compare.'
    : context.effort.direction === 'similar' ? 'Your logged effort ratings were similar.'
    : `Your logged effort ratings were ${context.effort.direction === 'harder' ? 'higher' : 'lower'}.`;
  const easier = context.intent === 'easier' ? ' These are all easier-week sessions, compared only with each other.' : '';
  return `${pulse} ${effort}${easier}`;
}

export const STATE_LABEL: Record<HeartRateContext['state'], string> = {
  'warming-up': 'Building context',
  limited: 'Limited signal',
  ready: 'Comparison ready',
};
