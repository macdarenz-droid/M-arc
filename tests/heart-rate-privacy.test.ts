/**
 * The outbound boundary for recorded heart rate.
 *
 * A pulse reading is health data. `trimFindingsAndProposals` copies every
 * finding's metrics verbatim into the payload, so a heart-rate detector is one
 * registration away from putting BPM on the wire through routes that already
 * exist. These tests inspect the actual JSON that would be sent, not the
 * intent of the code that builds it.
 */
import { describe, it, expect } from 'vitest';
import { buildPayload, outboundFindings, trimFindingsAndProposals } from '@/brain/coach/explainer';
import { buildAskPayload } from '@/ai/ask';
import { emptyReport, FINDING_KINDS, LOCAL_ONLY_FINDING_KINDS, PRINCIPLES_BY_FINDING, type Finding, type FindingsReport } from '@/brain/coach/contract';

const BPM = 147;

function hrFinding(kind: 'heart_rate_response' | 'heart_rate_evidence' = 'heart_rate_response'): Finding {
  return {
    id: `${kind}:s_watch`,
    kind,
    subject: { splitId: 'split_push', splitName: 'Push' },
    metrics: { direction: 'higher', averageBpm: BPM, baselineMedianBpm: 131, deltaBpm: 16, absDeltaBpm: 16, baselineSessions: 4, effortDirection: 'harder', coveragePct: 92, gapCount: 1 },
    window: { from: '2026-09-20', to: '2026-09-20' },
    confidence: 'medium',
    severity: 1,
    evidence: { sessionIds: ['s_watch', 's_a', 's_b'], days: ['2026-09-20'] },
    principles: PRINCIPLES_BY_FINDING[kind],
  };
}

const ordinary: Finding = {
  id: 'volume_drop:chest',
  kind: 'volume_drop',
  subject: { muscleGroup: 'chest' },
  metrics: { changePct: 22, currentSets: 9, baselineSets: 12 },
  window: { from: '2026-09-01', to: '2026-09-20' },
  confidence: 'high',
  severity: 2,
  evidence: { sessionIds: ['s_a'], days: ['2026-09-20'] },
  principles: PRINCIPLES_BY_FINDING.volume_drop,
};

function reportWith(findings: Finding[]): FindingsReport {
  return { ...emptyReport('2026-09-20'), findings };
}

const askOpts = { goal: 'muscle', unit: 'kg' as const, splits: [], customExercises: [], schedule: {} as never };

describe('heart-rate findings never reach an outbound payload', () => {
  it('every heart-rate kind is registered as local-only', () => {
    const hrKinds = FINDING_KINDS.filter(k => k.startsWith('heart_rate'));
    expect(hrKinds.length).toBeGreaterThan(0);
    for (const kind of hrKinds) expect(LOCAL_ONLY_FINDING_KINDS.has(kind), kind).toBe(true);
  });

  it('outboundFindings drops them and keeps everything else', () => {
    const kept = outboundFindings(reportWith([ordinary, hrFinding(), hrFinding('heart_rate_evidence')]));
    expect(kept.map(f => f.id)).toEqual(['volume_drop:chest']);
  });

  it('the trim keeps them out of findings, and they do not consume the per-kind budget', () => {
    const { findings } = trimFindingsAndProposals(reportWith([hrFinding(), ordinary]));
    expect(findings.map(f => f.kind)).toEqual(['volume_drop']);
  });

  it('no BPM value appears anywhere in the serialized /explain payload', () => {
    const json = JSON.stringify(buildPayload(reportWith([ordinary, hrFinding()]), { goal: 'muscle', unit: 'kg' }));
    expect(json).not.toContain(String(BPM));
    expect(json).not.toContain('heart_rate');
    expect(json).not.toContain('wearable_heart_rate_validity');
    expect(json).not.toContain('bpm');
  });

  it('no BPM value appears anywhere in the serialized /ask payload', () => {
    const json = JSON.stringify(buildAskPayload(reportWith([ordinary, hrFinding()]), [], 'why was today hard?', askOpts));
    expect(json).not.toContain(String(BPM));
    expect(json).not.toContain('heart_rate');
    expect(json).not.toContain('wearable_heart_rate_validity');
  });

  /**
   * buildPayload picks default ids to explain straight off report.findings when
   * the caller names none. That path bypassed the trim entirely, so a
   * heart-rate finding's id — and its research card — could still ship.
   */
  it('the default explain selection cannot reach for a heart-rate finding', () => {
    const payload = buildPayload(reportWith([hrFinding(), ordinary]), { goal: 'muscle', unit: 'kg' });
    expect(payload.explain).not.toContain('heart_rate_response:s_watch');
    expect(payload.cards.map(c => c.id)).not.toContain('wearable_heart_rate_validity');
  });

  it('a caller that explicitly asks to explain one is refused', () => {
    const payload = buildPayload(reportWith([hrFinding(), ordinary]), { goal: 'muscle', unit: 'kg', explain: ['heart_rate_response:s_watch'] });
    expect(payload.explain).not.toContain('heart_rate_response:s_watch');
    expect(JSON.stringify(payload)).not.toContain(String(BPM));
  });

  it('a report of nothing but heart-rate findings produces an empty, valid payload', () => {
    const payload = buildPayload(reportWith([hrFinding(), hrFinding('heart_rate_evidence')]), { goal: 'muscle', unit: 'kg' });
    expect(payload.findings).toEqual([]);
    expect(payload.cards).toEqual([]);
    expect(payload.version).toBe(1);
  });

  it('the research card is never offered even when another finding is explained', () => {
    const payload = buildPayload(reportWith([ordinary, hrFinding()]), { goal: 'muscle', unit: 'kg', explain: ['volume_drop:chest'] });
    expect(payload.cards.length).toBeGreaterThan(0);
    expect(payload.cards.map(c => c.id)).not.toContain('wearable_heart_rate_validity');
  });
});
