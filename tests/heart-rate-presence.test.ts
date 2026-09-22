/**
 * How a recorded-pulse observation behaves as the one shared presence cue:
 * what dismissing it suppresses, and — more importantly — what it must not.
 *
 * The risk the architecture named is a stale evidence key silently hiding a
 * materially different observation. These tests pin the opposite behaviour.
 */
import { describe, it, expect } from 'vitest';
import type { HeartRateSummary, LoggedSet, Session } from '@/core/models';
import type { BrainContext } from '@/brain/coach/context';
import { buildReport } from '@/brain/coach/report';
import { insightsFrom, type RenderContext } from '@/brain/coach/words';
import { selectMoment } from '@/brain/coach/moments';

const HOUR = 3_600_000;
const NOW = Date.parse('2026-09-19T12:00:00.000Z');
const TODAY = '2026-09-19';

function workout(id: string, daysAgo: number, bpm: number | null, effort: LoggedSet['effort'] | null = 'ideal'): Session {
  const start = NOW - daysAgo * 24 * HOUR, end = start + HOUR, captured = Math.round(HOUR * 0.9);
  const hr: HeartRateSummary | undefined = bpm === null ? undefined : {
    metricsVersion: 2, sampleCount: Math.ceil(captured / 5_000), capturedMs: captured, durationMs: HOUR,
    coveragePct: 90, averageBpm: bpm, recordedPeakBpm: bpm + 20,
    firstSampleAt: new Date(start).toISOString(), lastSampleAt: new Date(start + captured).toISOString(), gapCount: 0,
  };
  return {
    id, splitId: 'split_push', splitName: 'Push', day: new Date(start).toISOString().slice(0, 10),
    startedAt: new Date(start).toISOString(), endedAt: new Date(end).toISOString(), durationSec: 3600,
    exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench', sets: Array.from({ length: 3 }, () => (effort ? { kg: 60, reps: 8, effort } : { kg: 60, reps: 8 })) }],
    heartRate: hr,
  };
}

const context = (sessions: Session[]): BrainContext => ({
  sessions, splits: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
  custom: [], goal: 'lean', restDefaultSec: 90, health: { connected: false }, readiness: [], deload: null,
  today: TODAY, now: NOW, dismissed: {}, accepted: {},
});

const render: RenderContext = { unit: 'kg', splits: [], custom: [], today: TODAY, goal: 'lean' };
const baseline = (bpm: number) => Array.from({ length: 3 }, (_, i) => workout(`b_${i}`, 10 - i * 2, bpm));

const hrInsight = (sessions: Session[]) =>
  insightsFrom(buildReport(context(sessions)), render).find(i => i.kind === 'heart_rate_response')!;

const moment = (sessions: Session[], dismissed: Array<{ id: string; evidenceKey: string; dismissedAt: string }> = []) =>
  selectMoment({
    suggestions: [],
    insights: insightsFrom(buildReport(context(sessions)), render).filter(i => i.kind.startsWith('heart_rate')),
    tone: 'steady',
    dismissed,
  });

describe('a recorded-pulse observation as a presence cue', () => {
  it('can be selected when there is something to say', () => {
    const m = moment([...baseline(130), workout('latest', 1, 150)]);
    expect(m?.id).toBe('insight:heart_rate_response:latest');
  });

  it('stays dismissed while the evidence is unchanged', () => {
    const sessions = [...baseline(130), workout('latest', 1, 150)];
    const m = moment(sessions)!;
    expect(moment(sessions, [{ id: m.id, evidenceKey: m.evidenceKey, dismissedAt: '2026-09-19T00:00:00.000Z' }])).toBeNull();
  });

  /** The failure mode the architecture warned about. */
  it('comes back when the same workout is re-read against a changed baseline', () => {
    const before = [...baseline(130), workout('latest', 1, 150)];
    const dismissed = [{ id: moment(before)!.id, evidenceKey: moment(before)!.evidenceKey, dismissedAt: '2026-09-19T00:00:00.000Z' }];
    // A fourth comparable workout is recorded, moving the median.
    const after = [...baseline(130), workout('b_3', 3, 160), workout('latest', 1, 150)];
    const m = moment(after, dismissed);
    expect(m).not.toBeNull();
    expect(m!.id).toBe('insight:heart_rate_response:latest');
  });

  it('comes back when an effort rating is repaired after the fact', () => {
    const before = [...baseline(130), workout('latest', 1, 150, 'ideal')];
    const dismissed = [{ id: moment(before)!.id, evidenceKey: moment(before)!.evidenceKey, dismissedAt: '2026-09-19T00:00:00.000Z' }];
    const after = [...baseline(130), workout('latest', 1, 150, 'max')];
    expect(moment(after, dismissed)).not.toBeNull();
  });

  it('dismissing one workout says nothing about the next', () => {
    const first = [...baseline(130), workout('latest', 1, 150)];
    const dismissed = [{ id: moment(first)!.id, evidenceKey: moment(first)!.evidenceKey, dismissedAt: '2026-09-19T00:00:00.000Z' }];
    const next = [...baseline(130), workout('latest', 3, 150), workout('newer', 1, 152)];
    expect(moment(next, dismissed)?.id).toBe('insight:heart_rate_response:newer');
  });

  it('the key ignores wording, so tone alone cannot revive a dismissal', () => {
    const sessions = [...baseline(130), workout('latest', 1, 150)];
    const insights = insightsFrom(buildReport(context(sessions)), render).filter(i => i.kind.startsWith('heart_rate'));
    const steady = selectMoment({ suggestions: [], insights, tone: 'steady', dismissed: [] })!;
    const direct = selectMoment({ suggestions: [], insights, tone: 'direct', dismissed: [] })!;
    expect(direct.evidenceKey).toBe(steady.evidenceKey);
    expect(direct.cue).not.toBe(steady.cue);
  });

  it('never outranks an actionable suggestion for the one shared slot', () => {
    const sessions = [...baseline(130), workout('latest', 1, 150)];
    const insights = insightsFrom(buildReport(context(sessions)), render).filter(i => i.kind.startsWith('heart_rate'));
    const suggestion = {
      id: 'p1', dismissKey: 'rest_default', kind: 'rest_default' as const, title: 'Longer rest', summary: 's',
      acceptLabel: 'Use 180s', confidence: 'medium' as const, evidenceKey: 'k', evidence: [], basis: [],
    } as never;
    const m = selectMoment({ suggestions: [suggestion], insights, tone: 'steady', dismissed: [] })!;
    expect(m.kind).toBe('suggestion');
  });

  it('a quality note carries no urgency of its own', () => {
    const insight = insightsFrom(buildReport(context([workout('a', 5, 130), workout('latest', 1, 150)])), render)
      .find(i => i.kind === 'heart_rate_evidence')!;
    expect(insight.severity).toBe(0);
  });
});
