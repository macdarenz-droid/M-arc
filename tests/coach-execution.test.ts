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
});
