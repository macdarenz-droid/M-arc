import { describe, expect, it } from 'vitest';
import { sessionDebrief } from '@/brain/debrief';
import type { Exercise, Session, WorkoutPlanEntry } from '@/core/models';

const target = (kg: number | null, reps: number | null, durationSec: number | null = null) => ({ kg, reps, durationSec });
const entry = (over: Partial<WorkoutPlanEntry> = {}): WorkoutPlanEntry => ({
  id: 'pe_bench', exerciseId: 'lib_barbell_bench_press', name: 'Bench Press', mode: 'weighted', origin: 'start',
  plannedSets: 3, targetSource: 'history', allowIncrease: true,
  targets: [target(60, 8), target(60, 8), target(60, 8)], ...over,
});
const saved = (over: Partial<Session> = {}): Session => ({
  id: 'current', splitId: 'push', splitName: 'Push', day: '2026-09-19', startedAt: '2026-09-19T10:00:00.000Z', endedAt: '2026-09-19T11:00:00.000Z', durationSec: 3600,
  exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench Press', planEntryId: 'pe_bench', actualSetIndices: [0, 2], sets: [{ kg: 60, reps: 8 }, { kg: 60, reps: 6 }] }],
  plan: { version: 1, capturedAt: '2026-09-19T09:59:00.000Z', goal: 'strength', deload: null, entries: [entry()] },
  ...over,
});

describe('sessionDebrief', () => {
  it('matches filtered actuals to their original row indices and keeps accepted targets separate', () => {
    const session = saved();
    session.plan!.entries[0]!.acceptedTargets = [null, null, target(60, 7)];
    const result = sessionDebrief(session, []);
    expect(result).toMatchObject({ hasPlan: true, plannedSets: 3, loggedSets: 2, comparableSets: 2, metSets: 1 });
    expect(result.exercises[0]!.rows).toEqual([
      { setNumber: 1, planned: target(60, 8), accepted: null, actual: target(60, 8), result: 'met' },
      { setNumber: 3, planned: target(60, 8), accepted: target(60, 7), actual: target(60, 6), result: 'below' },
    ]);
    expect(result.metSets).toBe(1);
  });

  it('does not reconstruct comparisons for edited or legacy rows and preserves plan order', () => {
    const edited = saved();
    edited.exercises[0]!.actualSetIndices = undefined;
    edited.exercises.push({ exerciseId: 'custom_extra', name: 'Extra', sets: [{ reps: 12 }] });
    const result = sessionDebrief(edited, []);
    expect(result.exercises.map(item => item.exerciseId)).toEqual(['lib_barbell_bench_press', 'custom_extra']);
    expect(result.exercises[0]!.rows.every(row => row.planned === null && row.result === 'uncomparable')).toBe(true);
    expect(result.exercises[1]).toMatchObject({ planEntryId: null, plannedSets: null, targetSource: 'missing' });
    expect(sessionDebrief({ ...edited, plan: undefined }, []).hasPlan).toBe(false);

    const corrupted = saved();
    corrupted.exercises[0]!.exerciseId = 'lib_leg_press';
    expect(sessionDebrief(corrupted, []).exercises[0]).toMatchObject({ loggedSets: 0, rows: [] });
    const duplicateIndices = saved();
    duplicateIndices.exercises[0]!.actualSetIndices = [0, 0];
    expect(sessionDebrief(duplicateIndices, []).exercises[0]!.rows.every(row => row.planned === null)).toBe(true);
  });

  it('keeps different loads and unsupported modes out, while comparing reps and seconds in their own modes', () => {
    const custom: Exercise[] = [
      { id: 'custom_hold', name: 'Hold', equipment: 'bodyweight', primary: ['abs'], secondary: [], stabilizers: [], aliases: [], pattern: 'core', defaultSets: 1, mode: 'duration', custom: true },
      { id: 'custom_assist', name: 'Assist', equipment: 'machine', primary: ['lats'], secondary: [], stabilizers: [], aliases: [], pattern: 'vertical_pull', defaultSets: 1, mode: 'assisted', custom: true },
    ];
    const session = saved({
      exercises: [
        { exerciseId: 'lib_barbell_bench_press', name: 'Bench', planEntryId: 'pe_bench', actualSetIndices: [0], sets: [{ kg: 62.5, reps: 8 }] },
        { exerciseId: 'custom_hold', name: 'Hold', planEntryId: 'pe_hold', actualSetIndices: [0], sets: [{ durationSec: 30 }] },
        { exerciseId: 'custom_assist', name: 'Assist', planEntryId: 'pe_assist', actualSetIndices: [0], sets: [{ kg: 25, reps: 10 }] },
      ],
      plan: { version: 1, capturedAt: '2026-09-19T09:59:00.000Z', goal: 'strength', deload: null, entries: [
        entry({ plannedSets: 1, targets: [target(60, 8)] }),
        entry({ id: 'pe_hold', exerciseId: 'custom_hold', name: 'Hold', mode: 'duration', plannedSets: 1, targets: [target(null, null, 30)] }),
        entry({ id: 'pe_assist', exerciseId: 'custom_assist', name: 'Assist', mode: 'assisted', plannedSets: 1, targets: [target(25, 10)] }),
      ] },
    });
    const result = sessionDebrief(session, [], custom);
    expect(result.exercises.map(item => item.rows[0]!.result)).toEqual(['different_load', 'met', 'uncomparable']);
    expect(result.comparableSets).toBe(1);
  });

  it('describes a heavier, lower-rep and lower-volume tradeoff against the immediately preceding session', () => {
    const previous = saved({ id: 'previous', day: '2026-09-12', startedAt: '2026-09-12T10:00:00.000Z', endedAt: '2026-09-12T11:00:00.000Z', plan: undefined,
      exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench', sets: Array.from({ length: 3 }, () => ({ kg: 60, reps: 10 })) }] });
    const current = saved({ exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench', planEntryId: 'pe_bench', actualSetIndices: [0, 1, 2], sets: Array.from({ length: 3 }, () => ({ kg: 62.5, reps: 6 })) }] });
    expect(sessionDebrief(current, [previous]).exercises[0]!.tradeoff).toEqual({ previousKg: 60, actualKg: 62.5, previousReps: 10, actualReps: 6, previousVolumeKg: 1800, actualVolumeKg: 1125 });
  });

  it('uses the latest same-day prior workout regardless of imported array order', () => {
    const earlier = saved({ id: 'earlier', day: '2026-09-18', startedAt: '2026-09-18T10:00:00.000Z',
      exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench', sets: [{ kg: 60, reps: 10 }] }] });
    const later = saved({ id: 'later', day: '2026-09-18', startedAt: '2026-09-18T16:00:00.000Z',
      exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench', sets: [{ kg: 62.5, reps: 8 }] }] });
    const current = saved({ exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench', planEntryId: 'pe_bench', actualSetIndices: [0], sets: [{ kg: 62.5, reps: 6 }] }] });
    for (const history of [[earlier, later], [later, earlier]]) {
      expect(sessionDebrief(current, history).exercises[0]!.tradeoff).toBeNull();
    }
  });

  it('breaks equal-instant ties by session ID and excludes the current or later sessions', () => {
    const earlier = saved({ id: 'a', startedAt: '2026-09-19T10:00:00.000Z',
      exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench', sets: [{ kg: 60, reps: 10 }] }] });
    const latest = saved({ id: 'b', startedAt: '2026-09-19T18:00:00.000+08:00',
      exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench', sets: [{ kg: 62.5, reps: 8 }] }] });
    const current = saved({ id: 'c', exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench', planEntryId: 'pe_bench', actualSetIndices: [0], sets: [{ kg: 65, reps: 6 }] }] });
    const later = { ...current, id: 'd' };
    const tomorrow = { ...current, id: 'tomorrow', day: '2026-09-20', startedAt: '2026-09-20T10:00:00.000Z' };
    const invalid = { ...current, id: 'invalid', startedAt: 'invalid' };
    const result = sessionDebrief(current, [latest, tomorrow, earlier, later, current, invalid]).exercises[0]!.tradeoff;
    expect(result).toEqual({ previousKg: 62.5, actualKg: 65, previousReps: 8, actualReps: 6, previousVolumeKg: 500, actualVolumeKg: 390 });
  });

  it('keeps actual time order when travel makes the imported local days run backwards', () => {
    const earlier = saved({ id: 'earlier', day: '2026-09-19', startedAt: '2026-09-19T00:30:00+14:00',
      exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench', sets: [{ kg: 60, reps: 10 }] }] });
    const latest = saved({ id: 'latest', day: '2026-09-18', startedAt: '2026-09-18T23:30:00-10:00',
      exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench', sets: [{ kg: 62.5, reps: 8 }] }] });
    const current = saved({ startedAt: '2026-09-19T12:00:00Z',
      exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench', planEntryId: 'pe_bench', actualSetIndices: [0], sets: [{ kg: 62.5, reps: 6 }] }] });
    for (const history of [[earlier, latest], [latest, earlier]]) {
      expect(sessionDebrief(current, history).exercises[0]!.tradeoff).toBeNull();
    }
    current.exercises[0]!.sets[0]!.kg = 65;
    expect(sessionDebrief(current, [latest, earlier]).exercises[0]!.tradeoff).toMatchObject({ previousKg: 62.5, previousReps: 8, previousVolumeKg: 500 });
  });
});
