import { describe, expect, it } from 'vitest';
import { detectSessionExecution } from '@/brain/coach/detectors/execution';
import { buildReport } from '@/brain/coach/report';
import { allowedNumbers, buildPayload, validateText } from '@/brain/coach/explainer';
import type { Session, WorkoutPlanEntry } from '@/core/models';
import { ctx } from './coach-helpers';

const planEntry = (source: WorkoutPlanEntry['targetSource'] = 'history'): WorkoutPlanEntry => ({
  id: 'pe', exerciseId: 'lib_barbell_bench_press', name: 'Bench', mode: 'weighted', origin: 'start', plannedSets: 3,
  targetSource: source, allowIncrease: source === 'history', targets: Array.from({ length: 3 }, () => ({ kg: 60, reps: 8, durationSec: null })),
});
const plannedSession = (day = '2026-09-19', source: WorkoutPlanEntry['targetSource'] = 'history'): Session => ({
  id: 'done', splitId: 'split_push', splitName: 'Push', day, startedAt: `${day}T10:00:00.000Z`, endedAt: `${day}T11:00:00.000Z`, durationSec: 3600,
  exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench', planEntryId: 'pe', actualSetIndices: [0, 1, 2], sets: [{ kg: 60, reps: 8 }, { kg: 60, reps: 7 }, { kg: 60, reps: 8 }] }],
  plan: { version: 1, capturedAt: `${day}T09:59:00.000Z`, goal: 'strength', deload: null, entries: [planEntry(source)] },
});

describe('session execution finding', () => {
  it('emits one recent informational finding from history-backed comparable rows', () => {
    const context = ctx([plannedSession()], { today: '2026-09-19' });
    const finding = detectSessionExecution(context)[0]!;
    expect(finding).toMatchObject({ id: 'session_execution:done', kind: 'session_execution', confidence: 'medium', severity: 0,
      subject: { splitId: 'split_push', splitName: 'Push' }, metrics: { plannedSets: 3, loggedSets: 3, comparableSets: 3, metSets: 2, belowSets: 1, sessionDay: '2026-09-19' } });
    expect(finding.evidence.sessionIds).toEqual(['done']);
    expect(buildReport(context).findings.some(item => item.id === finding.id)).toBe(true);
  });

  it('stays silent for starter, legacy, edited, sparse, old and future sessions', () => {
    expect(detectSessionExecution(ctx([plannedSession('2026-09-19', 'starter')], { today: '2026-09-19' }))).toEqual([]);
    expect(detectSessionExecution(ctx([{ ...plannedSession(), plan: undefined }], { today: '2026-09-19' }))).toEqual([]);
    const edited = plannedSession(); edited.exercises[0]!.actualSetIndices = undefined;
    expect(detectSessionExecution(ctx([edited], { today: '2026-09-19' }))).toEqual([]);
    const sparse = plannedSession(); sparse.exercises[0]!.sets = sparse.exercises[0]!.sets.slice(0, 2); sparse.exercises[0]!.actualSetIndices = [0, 1];
    expect(detectSessionExecution(ctx([sparse], { today: '2026-09-19' }))).toEqual([]);
    expect(detectSessionExecution(ctx([plannedSession('2026-09-16')], { today: '2026-09-19' }))).toEqual([]);
    expect(detectSessionExecution(ctx([plannedSession('2026-09-20')], { today: '2026-09-19' }))).toEqual([]);
  });

  it('trims plan arrays while retaining and grounding every scalar metric', () => {
    const report = buildReport(ctx([plannedSession()], { today: '2026-09-19' }));
    const payload = buildPayload(report, { goal: 'strength', unit: 'kg' });
    const finding = payload.findings.find(item => item.kind === 'session_execution')!;
    expect(finding.metrics).toMatchObject({ plannedSets: 3, loggedSets: 3, comparableSets: 3, metSets: 2, belowSets: 1 });
    expect(JSON.stringify(payload)).not.toContain('acceptedTargets');
    expect(JSON.stringify(payload)).not.toContain('actualSetIndices');
    const allowed = allowedNumbers(payload);
    expect(validateText('2 of 3 targets were met; 1 was below.', allowed).ok).toBe(true);
    expect(validateText('137 targets were met.', allowed).ok).toBe(false);
  });

  it('uses the same chronological tradeoff evidence after reversed same-day imports', () => {
    const earlier = { ...plannedSession('2026-09-18'), id: 'earlier' };
    earlier.exercises[0]!.sets = Array.from({ length: 3 }, () => ({ kg: 57.5, reps: 12 }));
    const latest = { ...plannedSession('2026-09-18'), id: 'latest', startedAt: '2026-09-18T16:00:00.000Z' };
    latest.exercises[0]!.sets = Array.from({ length: 3 }, () => ({ kg: 60, reps: 10 }));
    const current = plannedSession();
    current.plan!.entries[0]!.targets = Array.from({ length: 3 }, () => ({ kg: 62.5, reps: 6, durationSec: null }));
    current.exercises[0]!.sets = Array.from({ length: 3 }, () => ({ kg: 62.5, reps: 6 }));
    const future = { ...plannedSession('2026-09-20'), id: 'future' };
    const finding = detectSessionExecution(ctx([latest, future, current, earlier], { today: '2026-09-19' }))[0]!;
    expect(finding.evidence.sessionIds).toEqual(['latest', 'done']);
    expect(finding.metrics.metSets).toBe(3);
  });

  it('selects the latest actual instant and resolves same-instant evidence by ID', () => {
    const earlier = { ...plannedSession(), id: 'a', startedAt: '2026-09-19T09:00:00.000Z' };
    earlier.exercises[0]!.sets = Array.from({ length: 3 }, () => ({ kg: 57.5, reps: 12 }));
    const latest = { ...plannedSession(), id: 'b', startedAt: '2026-09-19T17:00:00.000+08:00' };
    latest.exercises[0]!.sets = Array.from({ length: 3 }, () => ({ kg: 60, reps: 10 }));
    const current = plannedSession();
    current.plan!.entries[0]!.targets = Array.from({ length: 3 }, () => ({ kg: 62.5, reps: 6, durationSec: null }));
    current.exercises[0]!.sets = Array.from({ length: 3 }, () => ({ kg: 62.5, reps: 6 }));
    const finding = detectSessionExecution(ctx([latest, current, earlier], { today: '2026-09-19' }))[0]!;
    expect(finding.id).toBe('session_execution:done');
    expect(finding.evidence.sessionIds).toEqual(['b', 'done']);
  });

  it.each([true, false])('ignores a later-today session without suppressing current metrics (future planned: %s)', planned => {
    const current = plannedSession();
    const future = { ...plannedSession(), id: 'future', startedAt: '2026-09-19T20:00:00Z', plan: planned ? plannedSession().plan : undefined };
    const finding = detectSessionExecution(ctx([current, future]))[0]!;
    expect(finding.id).toBe('session_execution:done');
    expect(finding.metrics).toMatchObject({ comparableSets: 3, metSets: 2, belowSets: 1 });
    expect(finding.evidence.sessionIds).toEqual(['done']);
  });

  it.each([62.5, 65])('grounds current %s kg work against timestamp order when local days run backwards', kg => {
    const earlier = { ...plannedSession(), id: 'earlier', startedAt: '2026-09-19T00:30:00+14:00' };
    earlier.exercises[0]!.sets = Array.from({ length: 3 }, () => ({ kg: 60, reps: 10 }));
    const latest = { ...plannedSession('2026-09-18'), id: 'latest', startedAt: '2026-09-18T23:30:00-10:00' };
    latest.exercises[0]!.sets = Array.from({ length: 3 }, () => ({ kg: 62.5, reps: 8 }));
    const current = { ...plannedSession(), startedAt: '2026-09-19T12:00:00Z' };
    current.plan!.entries[0]!.targets = Array.from({ length: 3 }, () => ({ kg, reps: 6, durationSec: null }));
    current.exercises[0]!.sets = Array.from({ length: 3 }, () => ({ kg, reps: 6 }));
    for (const sessions of [[earlier, latest, current], [latest, current, earlier]]) {
      const finding = detectSessionExecution(ctx(sessions))[0]!;
      expect(finding.id).toBe('session_execution:done');
      expect(finding.metrics).toMatchObject({ comparableSets: 3, metSets: 3, belowSets: 0 });
      expect(finding.evidence.sessionIds).toEqual(kg === 62.5 ? ['done'] : ['latest', 'done']);
    }
  });
});
