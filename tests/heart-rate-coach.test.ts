/**
 * The detector and its wording. Recorded pulse enters the report as an
 * ordinary local-only finding: it is described, never acted on, and a person
 * with no watch must see the report they had before.
 */
import { describe, it, expect } from 'vitest';
import type { HeartRateSummary, LoggedSet, Session } from '@/core/models';
import type { BrainContext } from '@/brain/coach/context';
import { detectHeartRate } from '@/brain/coach/detectors/heartRate';
import { buildReport } from '@/brain/coach/report';
import { insightsFrom, type RenderContext } from '@/brain/coach/words';
import { PROPOSAL_KINDS } from '@/brain/coach/contract';

const HOUR = 3_600_000;
const NOW = Date.parse('2026-09-19T12:00:00.000Z');
const TODAY = '2026-09-19';

let seq = 0;
function workout(daysAgo: number, bpm: number | null, over: { effort?: LoggedSet['effort'] | null; kg?: number } = {}): Session {
  const start = NOW - daysAgo * 24 * HOUR;
  const end = start + HOUR;
  const captured = Math.round(HOUR * 0.9);
  const hr: HeartRateSummary | undefined = bpm === null ? undefined : {
    metricsVersion: 2, sampleCount: Math.ceil(captured / 5_000), capturedMs: captured, durationMs: HOUR,
    coveragePct: 90, averageBpm: bpm, recordedPeakBpm: bpm + 20,
    firstSampleAt: new Date(start).toISOString(), lastSampleAt: new Date(start + captured).toISOString(), gapCount: 0,
  };
  const effort = over.effort === undefined ? 'ideal' : over.effort;
  return {
    id: `s_${seq++}`, splitId: 'split_push', splitName: 'Push',
    day: new Date(start).toISOString().slice(0, 10),
    startedAt: new Date(start).toISOString(), endedAt: new Date(end).toISOString(), durationSec: 3600,
    exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench', sets: Array.from({ length: 3 }, () => (effort ? { kg: over.kg ?? 60, reps: 8, effort } : { kg: over.kg ?? 60, reps: 8 })) }],
    heartRate: hr,
  };
}

function context(sessions: Session[]): BrainContext {
  return {
    sessions, splits: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
    custom: [], goal: 'lean', restDefaultSec: 90, health: { connected: false }, readiness: [], deload: null,
    today: TODAY, now: NOW, dismissed: {}, accepted: {},
  };
}

const render: RenderContext = { unit: 'kg', splits: [], custom: [], today: TODAY, goal: 'lean' };
const baseline = (bpm: number) => Array.from({ length: 3 }, (_, i) => workout(10 - i * 2, bpm));

describe('detectHeartRate', () => {
  it('says nothing at all when no workout was ever recorded', () => {
    expect(detectHeartRate(context([workout(1, null), workout(3, null)]))).toEqual([]);
  });

  it('reports a difference as a low-severity observation, never as something to act on', () => {
    const [f] = detectHeartRate(context([...baseline(130), workout(1, 150)]));
    expect(f!.kind).toBe('heart_rate_response');
    expect(f!.metrics.direction).toBe('higher');
    expect(f!.metrics.averageBpm).toBe(150);
    expect(f!.metrics.baselineMedianBpm).toBe(130);
    expect(f!.metrics.absDeltaBpm).toBe(20);
    expect(f!.severity).toBe(1);
  });

  it('gives a matching recording no severity at all', () => {
    const [f] = detectHeartRate(context([...baseline(130), workout(1, 132)]));
    expect(f!.metrics.direction).toBe('usual');
    expect(f!.severity).toBe(0);
  });

  it('explains a missing baseline instead of staying silent', () => {
    const [f] = detectHeartRate(context([workout(5, 130), workout(1, 150)]));
    expect(f!.kind).toBe('heart_rate_evidence');
    expect(f!.metrics.code).toBe('baseline_too_small');
    expect(f!.metrics.baselineNeeded).toBe(3);
    expect(f!.severity).toBe(0);
  });

  it('carries the baseline it actually used as local evidence', () => {
    const history = [...baseline(130), workout(1, 150)];
    const [f] = detectHeartRate(context(history));
    expect(f!.evidence.sessionIds).toHaveLength(4);
    expect(f!.evidence.sessionIds).toContain(history.at(-1)!.id);
  });

  it('is deterministic for the same history', () => {
    const history = [...baseline(130), workout(1, 150)];
    expect(detectHeartRate(context(history))).toEqual(detectHeartRate(context(history)));
  });
});

describe('the report it lands in', () => {
  it('adds no proposal of any kind — pulse cannot change a plan', () => {
    const report = buildReport(context([...baseline(130), workout(1, 150)]));
    const hr = report.findings.filter(f => f.kind.startsWith('heart_rate'));
    expect(hr.length).toBe(1);
    for (const p of report.proposals) expect(PROPOSAL_KINDS).toContain(p.kind);
    expect(report.proposals.some(p => p.basedOn?.some(id => id.startsWith('heart_rate')))).toBe(false);
  });

  it('a person with no watch gets exactly the report they had before', () => {
    const noWatch = [workout(10, null), workout(6, null), workout(2, null)];
    const report = buildReport(context(noWatch));
    expect(report.findings.some(f => f.kind.startsWith('heart_rate'))).toBe(false);
  });

  it('keeps the quality note even though its confidence is low', () => {
    const report = buildReport(context([workout(5, 130), workout(1, 150)]));
    expect(report.findings.some(f => f.kind === 'heart_rate_evidence')).toBe(true);
  });
});

describe('wording', () => {
  const insightFor = (sessions: Session[]) => {
    const report = buildReport(context(sessions));
    return insightsFrom(report, render).find(i => i.kind.startsWith('heart_rate'))!;
  };

  it('states the size of the difference and refuses to explain it', () => {
    const insight = insightFor([...baseline(130), workout(1, 150)]);
    expect(insight.title).toContain('higher');
    expect(insight.noticed).toContain('20 bpm');
    expect(insight.noticed).toContain('130 bpm');
    expect(insight.means).toMatch(/does not establish/i);
    expect(insight.action).toMatch(/unchanged/i);
  });

  it('names the effort comparison alongside the pulse', () => {
    const sessions = [...baseline(130), workout(1, 150, { effort: 'max' })];
    expect(insightFor(sessions).noticed).toMatch(/rated the work harder/i);
  });

  it('says how much baseline is still missing', () => {
    const insight = insightFor([workout(5, 130), workout(1, 150)]);
    expect(insight.noticed).toContain('1 of 3');
  });

  it('cites the wearable-validity card', () => {
    const insight = insightFor([...baseline(130), workout(1, 150)]);
    expect(insight.evidence.map(c => c.id)).toContain('wearable_heart_rate_validity');
  });

  it('writes no number the finding does not carry', () => {
    const report = buildReport(context([...baseline(130), workout(1, 150)]));
    const finding = report.findings.find(f => f.kind === 'heart_rate_response')!;
    const insight = insightsFrom(report, render).find(i => i.id === finding.id)!;
    const allowed = new Set(Object.values(finding.metrics).filter(v => typeof v === 'number') as number[]);
    const written = `${insight.title} ${insight.noticed}`.match(/\d+/g) ?? [];
    for (const n of written) expect(allowed, `${n} is not in the finding's metrics`).toContain(Number(n));
  });
});

describe('window integrity', () => {
  it('never emits a window that ends before it starts, even for a mislabelled import', () => {
    const future = workout(1, 150);
    future.day = '2099-01-01'; // an import whose day key disagrees with its timestamps
    const [f] = detectHeartRate(context([...baseline(130), future]));
    expect(f!.window.from <= f!.window.to).toBe(true);
  });
});

describe('why no comparison is available', () => {
  const insightFor = (sessions: Session[]) => {
    const report = buildReport(context(sessions));
    return insightsFrom(report, render).find(i => i.kind === 'heart_rate_evidence')!;
  };

  it('says the baseline is still building when little has been recorded', () => {
    const insight = insightFor([workout(5, 130), workout(1, 150)]);
    expect(insight.title).toMatch(/still building/i);
    expect(insight.noticed).toContain('1 of 3');
  });

  /**
   * A lifter adding weight every session produces plenty of good recordings
   * that never match each other. Left alone, the app would show "0 of 3"
   * forever without ever saying why, and the advice for the two cases differs.
   */
  it('says the work keeps changing when recordings are plentiful but unmatched', () => {
    const climbing = Array.from({ length: 6 }, (_, i) => workout(18 - i * 3, 130, { kg: 60 + i * 2.5 }));
    const insight = insightFor(climbing);
    expect(insight.title).toMatch(/work keeps changing/i);
    expect(insight.noticed).toMatch(/recorded well enough to compare/i);
    expect(insight.action).toMatch(/no reason to stop progressing/i);
  });
});
