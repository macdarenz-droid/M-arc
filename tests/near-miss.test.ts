import { describe, expect, it } from 'vitest';
import type { LoggedSet, ResistanceMode, Session } from '@/core/models';
import { summarizeSets } from '@/brain/history';
import { detectNearMiss, nearMissFor, sessionNearMisses } from '@/brain/coach/detectors/nearmiss';
import { buildReport } from '@/brain/coach/report';
import { renderFinding } from '@/brain/coach/words';
import { reportNumbers, type Finding } from '@/brain/coach/contract';
import { extractNumbers } from '@/brain/coach/explainer';
import { ctx, pplSplits } from './coach-helpers';
import { session } from './helpers';

const BENCH = 'lib_barbell_bench_press';
const PULL_UP = 'lib_pull_up';
const summary = (id: string, sets: LoggedSet[], day = '2026-09-18') => summarizeSets(id, day, sets);
const miss = (current: LoggedSet[], prior: LoggedSet[][], mode: ResistanceMode = 'weighted', id = BENCH) => nearMissFor(summary('current', current), prior.map((sets, index) => summary(`prior-${index}`, sets, `2026-09-${10 + index}`)), mode, id, id);
const weighted = (kg: number, reps: number): LoggedSet[] => [{ kg, reps, effort: 'ideal' }];
const bodyweight = (reps: number): LoggedSet[] => [{ reps, effort: 'ideal' }];

function namedSession(id: string, day: string, exerciseId: string, sets: LoggedSet[], startedAt = `${day}T17:00:00.000Z`, name = exerciseId): Session {
  const value = session(day, [{ id: exerciseId, name, sets }]);
  return { ...value, id, startedAt, endedAt: new Date(Date.parse(startedAt) + 3_600_000).toISOString() };
}

describe('near-miss records', () => {
  it('matched eight is one from a new record while seven correctly names nine and gap two', () => {
    const prior = [weighted(60, 8), weighted(60, 7)];
    expect(miss(weighted(60, 8), prior)).toMatchObject({ kind: 'reps_at_load', value: 8, standing: 8, required: 9, gap: 1, kg: 60 });
    expect(miss(weighted(60, 7), prior)).toMatchObject({ kind: 'reps_at_load', value: 7, standing: 8, required: 9, gap: 2, kg: 60 });
  });

  it('any actual PR on the exercise suppresses all its near misses', () => {
    const prior = [weighted(60, 8), weighted(60, 8)];
    expect(miss(weighted(60, 9), prior)).toBeNull();
    expect(miss(weighted(62.5, 8), prior)).toBeNull();
  });

  it('requires two prior working exposures and leaves first sessions as baselines', () => {
    expect(miss(weighted(60, 8), [])).toBeNull();
    expect(miss(weighted(60, 8), [weighted(60, 8)])).toBeNull();
  });

  it('does not infer rep records from new loads or unsupported modes', () => {
    const prior = [weighted(60, 8), weighted(60, 8)];
    expect(miss(weighted(50, 7), prior)).toBeNull();
    for (const mode of ['assisted', 'duration', 'conditioning'] as const) expect(miss(weighted(60, 8), prior, mode)).toBeNull();
    expect(nearMissFor(summary('current', []), prior.map((sets, index) => summary(`p${index}`, sets)), 'weighted', BENCH, 'Bench')).toBeNull();
  });

  it('handles bodyweight ties and one-below cases without estimating body mass', () => {
    const prior = [bodyweight(8), bodyweight(7)];
    expect(miss(bodyweight(8), prior, 'bodyweight', PULL_UP)).toMatchObject({ kind: 'best_reps', value: 8, required: 9, gap: 1, kg: null });
    expect(miss(bodyweight(7), prior, 'bodyweight', PULL_UP)).toMatchObject({ kind: 'best_reps', value: 7, required: 9, gap: 2, kg: null });
  });

  it('uses the normal load step around 10 and 30 kg for a heaviest near miss', () => {
    expect(miss(weighted(9, 5), [weighted(10, 8), weighted(10, 7)])).toMatchObject({ kind: 'heaviest', standing: 10, required: 11, value: 9, gap: 2 });
    expect(miss(weighted(28, 5), [weighted(30, 8), weighted(30, 7)])).toMatchObject({ kind: 'heaviest', standing: 30, required: 32, value: 28, gap: 4 });
    expect(miss(weighted(27, 5), [weighted(30, 8), weighted(30, 7)])).toBeNull();
  });

  it('agrees with the strict one-percent strength boundary and next-tenth threshold', () => {
    const result = miss(weighted(97, 6), [weighted(100, 5), weighted(100, 5)]);
    expect(result).toMatchObject({ kind: 'strength', value: 116.4, standing: 116.7, required: 117.9, gap: 1.5 });
    const standing = summary('standing', weighted(100, 5)).bestE1rm;
    const roundedAtThreshold = summary('current', weighted(97, 6));
    roundedAtThreshold.bestE1rm = standing * 1.01;
    expect(nearMissFor(roundedAtThreshold, [summary('p1', weighted(100, 5)), summary('p2', weighted(100, 5))], 'weighted', BENCH, 'Bench')?.kind).toBe('strength');
    roundedAtThreshold.bestE1rm = standing * 1.010001;
    expect(nearMissFor(roundedAtThreshold, [summary('p1', weighted(100, 5)), summary('p2', weighted(100, 5))], 'weighted', BENCH, 'Bench')).toBeNull();
  });

  it('sorts imported sessions by timestamp and same-time id without leaking later work', () => {
    const old = namedSession('old', '2026-09-10', BENCH, weighted(60, 8));
    const tiePrior = namedSession('a', '2026-09-18', BENCH, weighted(60, 8), '2026-09-18T17:00:00.000Z');
    const current = namedSession('b', '2026-09-18', BENCH, weighted(60, 8), '2026-09-18T17:00:00.000Z');
    const later = namedSession('c', '2026-09-18', BENCH, weighted(60, 20), '2026-09-18T17:00:00.000Z');
    expect(sessionNearMisses(current, [later, current, tiePrior, old])[0]).toMatchObject({ standing: 8, gap: 1 });
  });

  it('resolves aliases once and recomputes after the standing result is edited or deleted', () => {
    const p1 = namedSession('p1', '2026-09-10', BENCH, weighted(60, 8));
    const p2 = namedSession('p2', '2026-09-14', BENCH, weighted(60, 8));
    const current = namedSession('current', '2026-09-18', 'legacy-bench', weighted(60, 8), '2026-09-18T17:00:00.000Z', 'Bench Press');
    current.exercises.push({ exerciseId: BENCH, name: 'Barbell Bench Press', sets: weighted(60, 7) });
    expect(sessionNearMisses(current, [current, p1, p2])).toHaveLength(1);
    const edited1 = { ...p1, exercises: [{ ...p1.exercises[0]!, sets: weighted(60, 6) }] };
    const edited2 = { ...p2, exercises: [{ ...p2.exercises[0]!, sets: weighted(60, 6) }] };
    expect(sessionNearMisses(current, [current, edited1, edited2])).toHaveLength(0);
    expect(sessionNearMisses(current, [current, p1])).toHaveLength(0);
  });

  it('detector expires after two local days, ignores future sessions and exposes grounded scalar copy', () => {
    const p1 = namedSession('p1', '2026-09-10', BENCH, weighted(60, 8));
    const p2 = namedSession('p2', '2026-09-14', BENCH, weighted(60, 8));
    const current = namedSession('current', '2026-09-18', BENCH, weighted(60, 8));
    const future = namedSession('future', '2026-09-20', BENCH, weighted(60, 20));
    const context = ctx([future, p2, current, p1], { today: '2026-09-19', now: new Date('2026-09-19T20:00:00.000Z').getTime(), splits: pplSplits() });
    const findings = detectNearMiss(context);
    expect(findings).toHaveLength(1);
    expect(buildReport(context).findings.some(item => item.kind === 'near_miss')).toBe(true);
    expect(findings[0]).toMatchObject({ kind: 'near_miss', confidence: 'medium', severity: 0, metrics: { recordKind: 'reps_at_load', current: 8, standing: 8, required: 9, gap: 1, loadKg: 60 } });
    expect(findings[0]!.evidence.sessionIds).toEqual(expect.arrayContaining(['p1', 'p2', 'current']));
    const insight = renderFinding(findings[0]!, { unit: 'kg', splits: context.splits, custom: [], today: context.today, goal: context.goal });
    expect(insight.noticed).toBe('Matched your 8-rep best at 60 kg. 1 more rep would be a new rep record.');
    expect(insight.action).toBe('A useful marker for another day; no extra set needed now.');
    const report = { version: 1 as const, generatedAt: '', today: context.today, dataQuality: { sessions: 3, weeksOfData: 2, effortCoverage: 1, insufficientData: false }, findings, proposals: [] };
    for (const number of extractNumbers(`${insight.noticed} ${insight.means} ${insight.action}`)) expect(reportNumbers(report).has(number)).toBe(true);
    expect(detectNearMiss({ ...context, today: '2026-09-21' })).toHaveLength(0);
  });

  it('renders each near-miss kind without turning it into a retry instruction', () => {
    const context = { unit: 'kg' as const, splits: pplSplits(), custom: [], today: '2026-09-19', goal: 'lean' as const };
    const finding = (metrics: Finding['metrics']): Finding => ({
      id: 'near_miss:test', kind: 'near_miss', subject: { exerciseId: BENCH, exerciseName: 'Barbell Bench Press' }, metrics,
      window: { from: '2026-09-10', to: '2026-09-18' }, confidence: 'medium', severity: 0,
      evidence: { sessionIds: [], days: [] }, principles: ['progressive_overload', 'one_rm_estimation'],
    });
    expect(renderFinding(finding({ recordKind: 'reps_at_load', current: 7, standing: 8, required: 9, gap: 2, loadKg: 60, sessionDay: '2026-09-18' }), context).noticed)
      .toBe('7 reps at 60 kg; previous best 8. 9 would beat it.');
    expect(renderFinding(finding({ recordKind: 'best_reps', current: 7, standing: 8, required: 9, gap: 2, sessionDay: '2026-09-18' }), context).noticed)
      .toBe('7 reps; previous best 8. 9 would beat it.');
    expect(renderFinding(finding({ recordKind: 'heaviest', current: 28, standing: 30, required: 32, gap: 4, sessionDay: '2026-09-18' }), context).noticed)
      .toBe('Logged 28 kg; heaviest previously 30 kg. A load above 30 kg would beat it; the next normal step is 32 kg.');
    expect(renderFinding(finding({ recordKind: 'strength', current: 116.4, standing: 116.7, required: 117.9, gap: 1.5, sessionDay: '2026-09-18' }), context).noticed)
      .toBe('Strength estimate 116.5 kg; the next record threshold is 118 kg.');
  });
});
