/**
 * Recorded heart rate as one more evidence channel (wearable_heart_rate_validity).
 *
 * Two findings, both descriptive and both local-only (see
 * LOCAL_ONLY_FINDING_KINDS): one reports a comparison against the person's own
 * earlier recordings of closely matching work; the other says why no comparison
 * is available yet. Neither carries prose, and neither may change a load, a
 * rest time, a recovery estimate, a readiness verdict or a plan-fit label —
 * those remain owned by logged performance and effort.
 *
 * Silent for anyone who has never recorded a workout with a watch.
 */
import type { Finding } from '../contract';
import type { BrainContext } from '../context';
import { HEART_RATE_EVIDENCE, heartRateContext } from '../../heart-rate';
import { finding } from './shared';

export function detectHeartRate(ctx: BrainContext): Finding[] {
  const hr = heartRateContext(ctx.sessions, ctx.now);
  // No recording has ever happened: a person without a watch sees nothing.
  if (hr.recordedCount === 0 || !hr.latest) return [];
  const latest = hr.latest;
  // An imported workout can carry a day key that disagrees with its own
  // timestamps, so clamp rather than emit a window that ends before it starts.
  const from = latest.day <= ctx.today ? latest.day : ctx.today;
  const shared = {
    subject: { splitId: latest.splitId, splitName: latest.splitName },
    from, to: ctx.today,
    evidence: { sessionIds: [...hr.baselineSessionIds, latest.id], days: [latest.day] },
  };

  if (hr.state !== 'ready' || hr.direction == null || hr.baselineMedianBpm == null || hr.deltaBpm == null) {
    return [finding({
      kind: 'heart_rate_evidence', target: latest.id, ...shared,
      metrics: {
        code: hr.code,
        recordedSessions: hr.recordedCount,
        eligibleSessions: hr.eligibleCount,
        baselineSessions: hr.baselineCount,
        baselineNeeded: HEART_RATE_EVIDENCE.minimumBaselineSessions,
        minimumCoveragePct: HEART_RATE_EVIDENCE.minimumCoveragePct,
        ...(hr.latestEvidence?.coveragePct != null ? { coveragePct: Math.round(hr.latestEvidence.coveragePct) } : {}),
        ...(hr.latestEvidence ? { quality: hr.latestEvidence.quality } : {}),
      },
      sessions: hr.recordedCount,
      confidence: 'low', severity: 0,
    })];
  }

  const evidence = hr.latestEvidence!;
  return [finding({
    kind: 'heart_rate_response', target: latest.id, ...shared,
    metrics: {
      direction: hr.direction,
      averageBpm: Math.round(evidence.averageBpm!),
      baselineMedianBpm: Math.round(hr.baselineMedianBpm),
      // Signed and absolute: the words layer needs the size without re-deriving it,
      // and the grounding validator only allows numbers that are actually here.
      deltaBpm: Math.round(hr.deltaBpm),
      absDeltaBpm: Math.abs(Math.round(hr.deltaBpm)),
      baselineSessions: hr.baselineCount,
      effortDirection: hr.effort.direction,
      coveragePct: Math.round(evidence.coveragePct!),
      gapCount: evidence.gapCount,
      ...(hr.intent ? { intent: hr.intent } : {}),
    },
    sessions: hr.baselineCount + 1,
    // A difference worth mentioning is still only worth a look. Recorded pulse
    // never earns "act soon": it cannot establish a cause.
    confidence: 'medium', severity: hr.direction === 'usual' ? 0 : 1,
  })];
}
