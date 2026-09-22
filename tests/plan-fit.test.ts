import { describe, expect, it } from 'vitest';
import { assessPlanFit } from '@/brain/planFit';
import { allRecords } from '@/brain/prs';
import type { Effort, LoggedExercise, PlanAgreementChange, PlanSetTarget, ResistanceMode, Session, WorkoutPlanEntry, WorkoutPlanSnapshot } from '@/core/models';

const DAY = '2026-09-21';
const START = `${DAY}T10:00:00.000Z`;
const target = (kg: number | null = 60, reps: number | null = 8, durationSec: number | null = null): PlanSetTarget => ({ kg, reps, durationSec });

function entry(id = 'a', options: Partial<WorkoutPlanEntry> = {}): WorkoutPlanEntry {
  const plannedSets = options.plannedSets ?? 2;
  return {
    id,
    exerciseId: 'lib_barbell_bench_press',
    name: 'Bench Press',
    mode: 'weighted',
    origin: 'start',
    plannedSets,
    targetSource: 'history',
    allowIncrease: true,
    targets: Array.from({ length: plannedSets }, () => target()),
    ...options,
  };
}

function plan(entries: WorkoutPlanEntry[], options: { cap?: Effort | null; kind?: 'normal' | 'easier'; changes?: PlanAgreementChange[]; invalidated?: string[] } = {}): WorkoutPlanSnapshot {
  return {
    version: 1,
    capturedAt: START,
    goal: 'growth',
    deload: null,
    entries,
    assessment: {
      version: 1,
      intent: { kind: options.kind ?? (options.cap ? 'easier' : 'normal'), capturedAt: START, source: options.cap ? 'accepted_deload' : 'session_start', effortCap: options.cap ?? null },
      changes: options.changes ?? [],
      invalidatedEntryIds: options.invalidated ?? [],
      seenWorkingRows: [],
    },
  };
}

function actual(planEntryId: string | undefined, sets: LoggedExercise['sets'], actualSetIndices?: number[], exerciseId = 'lib_barbell_bench_press'): LoggedExercise {
  return { exerciseId, name: exerciseId === 'lib_barbell_bench_press' ? 'Bench Press' : exerciseId, sets, planEntryId, actualSetIndices };
}

function saved(snapshot: WorkoutPlanSnapshot | undefined, exercises: LoggedExercise[]): Session {
  return { id: 'current', splitId: 'push', splitName: 'Push', day: DAY, startedAt: START, endedAt: `${DAY}T11:00:00.000Z`, durationSec: 3600, exercises, plan: snapshot };
}

describe('P06 deterministic plan-fit truth table', () => {
  it('F01/I07: normal intent has no invented cap and needs no ratings', () => {
    const result = assessPlanFit(saved(plan([entry()]), [actual('a', [{ kg: 60, reps: 8 }, { kg: 60, reps: 9 }], [0, 1])]));
    expect(result).toMatchObject({ label: 'Followed the plan', expectedRows: 2, comparableRows: 2, metRows: 2, capBreaches: [], reasons: [] });
  });

  it('F02/I07: easier intent with an Easy cap succeeds only with known in-cap ratings', () => {
    const snapshot = plan([entry()], { cap: 'easy' });
    const followed = assessPlanFit(saved(snapshot, [actual('a', [{ kg: 60, reps: 8, effort: 'easy' }, { kg: 60, reps: 8, effort: 'easy' }], [0, 1])]));
    expect(followed.label).toBe('Followed the plan');
    const unknown = assessPlanFit(saved(snapshot, [actual('a', [{ kg: 60, reps: 8 }, { kg: 60, reps: 8, effort: 'easy' }], [0, 1])]));
    expect(unknown.label).toBe('Not enough information');
    expect(unknown.reasons).toContain('required_effort');
  });

  it('F03: a real PR remains real while a linked Max rating makes an Easy-capped session harder than planned', () => {
    const current = saved(plan([entry('a', { plannedSets: 1, targets: [target(60, 8)] })], { cap: 'easy' }), [actual('a', [{ kg: 70, reps: 8, effort: 'max' }], [0])]);
    const previous = { ...current, id: 'previous', day: '2026-09-14', startedAt: '2026-09-14T10:00:00.000Z', endedAt: '2026-09-14T11:00:00.000Z', plan: undefined, exercises: [actual(undefined, [{ kg: 60, reps: 8, effort: 'ideal' }])] };
    const result = assessPlanFit(current);
    expect(result.label).toBe('Harder than planned');
    expect(result.capBreaches).toEqual([{ entryId: 'a', setIndex: 0, effort: 'max', cap: 'easy' }]);
    expect(allRecords([previous, current]).some(record => record.day === DAY)).toBe(true);
  });

  it('F04: extra reps at comparable load meet the target and do not imply excessive effort', () => {
    const result = assessPlanFit(saved(plan([entry('a', { plannedSets: 1, targets: [target(60, 8)] })], { cap: 'ideal' }), [actual('a', [{ kg: 60, reps: 12, effort: 'ideal' }], [0])]));
    expect(result).toMatchObject({ label: 'Followed the plan', metRows: 1, capBreaches: [] });
  });

  it('F05: an accepted reduction applies only to its named row and leaves the original target unchanged', () => {
    const reduced = target(55, 8);
    const a = entry();
    a.acceptedTargets = [null, reduced];
    const changes: PlanAgreementChange[] = [{ id: 'c', acceptedAt: `${DAY}T10:10:00.000Z`, kind: 'targets', entryId: 'a', reason: 'max_below_target', targets: [{ setIndex: 1, target: reduced }] }];
    const result = assessPlanFit(saved(plan([a], { changes }), [actual('a', [{ kg: 60, reps: 8 }, { kg: 55, reps: 8 }], [0, 1])]));
    expect(result.label).toBe('Followed the adjusted plan');
    expect(result.rows[1]).toMatchObject({ originalTarget: target(60, 8), effectiveTarget: reduced, accepted: true, status: 'met' });
  });

  it('F06: an unaccepted different load is uncertainty, not a target failure', () => {
    const result = assessPlanFit(saved(plan([entry('a', { plannedSets: 1, targets: [target(60, 8)] })]), [actual('a', [{ kg: 62.5, reps: 8 }], [0])]));
    expect(result.label).toBe('Not enough information');
    expect(result.reasons).toContain('different_load');
    expect(result.belowTargetRows).toBe(0);
  });

  it('F07: a saved cap with missing or invalid effort remains unresolved', () => {
    for (const effort of [undefined, 'medium' as never]) {
      const result = assessPlanFit(saved(plan([entry('a', { plannedSets: 1, targets: [target()] })], { cap: 'ideal' }), [actual('a', [{ kg: 60, reps: 8, effort }], [0])]));
      expect(result.label).toBe('Not enough information');
      expect(result.reasons).toContain('required_effort');
    }
  });

  it('F08: a witnessed breach outranks separate unknown coverage and discloses that coverage', () => {
    const result = assessPlanFit(saved(plan([entry()], { cap: 'easy' }), [actual('a', [{ kg: 60, reps: 8, effort: 'max' }], [0])]));
    expect(result.label).toBe('Harder than planned');
    expect(result.reasons).toEqual(expect.arrayContaining(['not_logged', 'incomplete_coverage']));
    expect(result.coverageIncomplete).toBe(true);
  });

  it('F09: legacy or missing assessment is insufficient without altering ordinary logs', () => {
    const legacy = plan([entry()]);
    legacy.assessment = undefined;
    const session = saved(legacy, [actual('a', [{ kg: 60, reps: 8 }], [0])]);
    const before = structuredClone(session.exercises);
    expect(assessPlanFit(session)).toMatchObject({ label: 'Not enough information', reasons: ['no_assessment'] });
    expect(session.exercises).toEqual(before);
  });

  it.each(['starter', 'unavailable'] as const)('F10: %s targets stay unresolved rather than becoming failures', source => {
    const a = entry('a', { plannedSets: 1, targetSource: source, targets: source === 'unavailable' ? [] : [target()] });
    const result = assessPlanFit(saved(plan([a]), [actual('a', [{ kg: 60, reps: 4 }], [0])]));
    expect(result.label).toBe('Not enough information');
    expect(result.reasons).toContain(source === 'starter' ? 'starter_target' : 'unavailable_target');
    expect(result.belowTargetRows).toBe(0);
  });

  it('F11: below-target and never-logged rows mean less work; absence is not also missing effort', () => {
    const below = assessPlanFit(saved(plan([entry()], { cap: 'ideal' }), [actual('a', [{ kg: 60, reps: 6, effort: 'easy' }], [0])]));
    expect(below).toMatchObject({ label: 'Less work than planned', belowTargetRows: 1, notLoggedRows: 1 });
    const missingRow = below.rows.find(row => row.status === 'not_logged')!;
    expect(missingRow.reasons).toEqual(['not_logged']);
    expect(missingRow.reasons).not.toContain('required_effort');
  });

  it('F12: a replacement chain counts only its final obligation and yields an adjusted verdict', () => {
    const a = entry('a', { plannedSets: 1, targets: [target()], excluded: 'replaced' });
    const b = entry('b', { exerciseId: 'lib_machine_chest_press', name: 'Machine Chest Press', origin: 'replacement', replaces: 'a', plannedSets: 1, targets: [target(50, 10)], excluded: 'replaced' });
    const c = entry('c', { exerciseId: 'lib_dumbbell_bench_press', name: 'Dumbbell Bench Press', origin: 'replacement', replaces: 'b', plannedSets: 1, targets: [target(24, 10)] });
    const changes: PlanAgreementChange[] = [
      { id: 'r1', acceptedAt: `${DAY}T10:05:00.000Z`, kind: 'replace', fromEntryId: 'a', toEntryId: 'b' },
      { id: 'r2', acceptedAt: `${DAY}T10:06:00.000Z`, kind: 'replace', fromEntryId: 'b', toEntryId: 'c' },
    ];
    const result = assessPlanFit(saved(plan([a, b, c], { changes }), [actual('c', [{ kg: 24, reps: 10 }], [0], c.exerciseId)]));
    expect(result).toMatchObject({ label: 'Followed the adjusted plan', expectedRows: 1, metRows: 1 });
  });

  it('F12/J06: add-below keeps both the original and the explicitly added obligation', () => {
    const a = entry('a', { plannedSets: 1, targets: [target()] });
    const b = entry('b', { exerciseId: 'lib_machine_chest_press', name: 'Machine Chest Press', origin: 'added', plannedSets: 1, targets: [target(50, 10)] });
    const changes: PlanAgreementChange[] = [{ id: 'add', acceptedAt: `${DAY}T10:05:00.000Z`, kind: 'add', entryId: 'b' }];
    const result = assessPlanFit(saved(plan([a, b], { changes }), [
      actual('a', [{ kg: 60, reps: 8 }], [0]),
      actual('b', [{ kg: 50, reps: 10 }], [0], b.exerciseId),
    ]));
    expect(result).toMatchObject({ label: 'Followed the adjusted plan', expectedRows: 2, metRows: 2 });
  });

  it('J07: skip stays expected while an accepted untouched removal retires only that obligation', () => {
    const skipped = entry('a', { plannedSets: 1, targets: [target()], excluded: 'skipped' });
    expect(assessPlanFit(saved(plan([skipped]), []))).toMatchObject({ label: 'Less work than planned', notLoggedRows: 1 });

    const removed = entry('a', { plannedSets: 1, targets: [target()], excluded: 'removed' });
    const kept = entry('b', { exerciseId: 'lib_machine_chest_press', name: 'Machine Chest Press', plannedSets: 1, targets: [target(50, 10)] });
    const changes: PlanAgreementChange[] = [{ id: 'rm', acceptedAt: `${DAY}T10:05:00.000Z`, kind: 'remove', entryId: 'a' }];
    const result = assessPlanFit(saved(plan([removed, kept], { changes }), [actual('b', [{ kg: 50, reps: 10 }], [0], kept.exerciseId)]));
    expect(result).toMatchObject({ label: 'Followed the adjusted plan', expectedRows: 1, metRows: 1 });
  });

  it('F13: unadopted extra work, unsupported modes and invalid row mapping remain unresolved', () => {
    const extra = assessPlanFit(saved(plan([entry('a', { plannedSets: 1, targets: [target()] })]), [actual('a', [{ kg: 60, reps: 8 }, { kg: 60, reps: 8 }], [0, 2])]));
    expect(extra.label).toBe('Not enough information');
    expect(extra.reasons).toContain('unadopted_extra');

    const assisted = entry('a', { mode: 'assisted', plannedSets: 1, targets: [target(20, 8)] });
    expect(assessPlanFit(saved(plan([assisted]), [actual('a', [{ kg: 20, reps: 8 }], [0])]))).toMatchObject({ label: 'Not enough information', reasons: ['unsupported_mode'] });

    const invalid = assessPlanFit(saved(plan([entry('a', { plannedSets: 1, targets: [target()] })]), [actual('a', [{ kg: 60, reps: 8 }], undefined)]));
    expect(invalid.reasons).toEqual(expect.arrayContaining(['invalid_mapping', 'invalidated_entry']));
  });

  it('F14: invalidated evidence cannot witness a breach; a separate surviving breach still can', () => {
    const invalidOnly = assessPlanFit(saved(plan([entry('a', { plannedSets: 1, targets: [target()] })], { cap: 'easy', invalidated: ['a'] }), [actual('a', [{ kg: 60, reps: 8, effort: 'max' }], [0])]));
    expect(invalidOnly.label).toBe('Not enough information');
    expect(invalidOnly.capBreaches).toEqual([]);

    const b = entry('b', { exerciseId: 'lib_machine_chest_press', name: 'Machine Chest Press', plannedSets: 1, targets: [target(50, 10)] });
    const mixed = assessPlanFit(saved(plan([entry('a', { plannedSets: 1, targets: [target()] }), b], { cap: 'easy', invalidated: ['a'] }), [
      actual('a', [{ kg: 60, reps: 8, effort: 'max' }], [0]),
      actual('b', [{ kg: 50, reps: 10, effort: 'max' }], [0], b.exerciseId),
    ]));
    expect(mixed.label).toBe('Harder than planned');
    expect(mixed.capBreaches).toEqual([{ entryId: 'b', setIndex: 0, effort: 'max', cap: 'easy' }]);
    expect(mixed.reasons).toContain('incomplete_coverage');

    const retired = entry('a', { plannedSets: 1, targets: [target()], excluded: 'replaced' });
    const replacement = entry('b', { exerciseId: 'lib_machine_chest_press', name: 'Machine Chest Press', origin: 'replacement', replaces: 'a', plannedSets: 1, targets: [target(50, 10)] });
    const changes: PlanAgreementChange[] = [{ id: 'r', acceptedAt: `${DAY}T10:05:00.000Z`, kind: 'replace', fromEntryId: 'a', toEntryId: 'b' }];
    const retiredInvalid = assessPlanFit(saved(plan([retired, replacement], { changes, invalidated: ['a'] }), [actual('b', [{ kg: 50, reps: 10 }], [0], replacement.exerciseId)]));
    expect(retiredInvalid.label).toBe('Not enough information');
    expect(retiredInvalid.reasons).toContain('invalidated_entry');
  });

  it('F15: canonical kg classification is stable across equivalent display-unit round trips and within tolerance', () => {
    const fromKg = 60;
    const throughLb = (fromKg * 2.2046226218) / 2.2046226218;
    const snapshot = plan([entry('a', { plannedSets: 1, targets: [target(fromKg, 8)] })]);
    const kg = assessPlanFit(saved(snapshot, [actual('a', [{ kg: fromKg, reps: 8 }], [0])]));
    const lb = assessPlanFit(saved(snapshot, [actual('a', [{ kg: throughLb, reps: 8 }], [0])]));
    expect({ label: lb.label, reasons: lb.reasons }).toEqual({ label: kg.label, reasons: kg.reasons });
  });

  it('F16: accepted removal of every obligation with no logged work is insufficient, never success', () => {
    const a = entry('a', { plannedSets: 1, targets: [target()], excluded: 'removed' });
    const changes: PlanAgreementChange[] = [{ id: 'rm', acceptedAt: `${DAY}T10:05:00.000Z`, kind: 'remove', entryId: 'a' }];
    const result = assessPlanFit(saved(plan([a], { changes }), []));
    expect(result).toMatchObject({ label: 'Not enough information', expectedRows: 0, loggedRows: 0, effectiveChange: true });
    expect(result.reasons).toContain('empty_plan');
  });

  it('returns invalid-agreement instead of throwing on bounded malformed journal data', () => {
    const malformed = plan([entry()]);
    malformed.assessment!.changes = [{ id: 'bad', acceptedAt: START, kind: 'remove', entryId: 'ghost' }];
    expect(assessPlanFit(saved(malformed, []))).toMatchObject({ label: 'Not enough information', reasons: ['invalid_agreement'] });

    const badTarget = plan([entry()]);
    badTarget.assessment!.changes = [{ id: 'bad-target', acceptedAt: START, kind: 'targets', entryId: 'a', reason: 'max_below_target', targets: [{ setIndex: 0, target: { kg: Number.NaN, reps: 8, durationSec: null } }] }];
    expect(() => assessPlanFit(saved(badTarget, []))).not.toThrow();
    expect(assessPlanFit(saved(badTarget, [])).reasons).toEqual(['invalid_agreement']);
  });
});
