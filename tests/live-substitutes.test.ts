import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it } from 'vitest';
import { addDays } from '@/core/dates';
import { findExercise } from '@/core/exercises';
import { freshState } from '@/core/models';
import { initStore, replaceState, state } from '@/core/store';
import type { MuscleId } from '@/data/muscles';
import { applyDeload } from '@/brain/coach/deload';
import { DELOAD_LOAD_FACTOR, MAX_SUBSTITUTES } from '@/brain/coach/bands';
import { substitutes } from '@/brain/live';
import { suggestNext } from '@/brain/progression';
import { finishSession, markDone, removeEntry, replaceEntry, restoreEmptyEntry, setSet, skipEntry, startSession } from '@/slices/workout/session';
import { createSplit } from '@/slices/workout/splits';
import { ctx, LAST_MONDAY, LEGS_EX, pplHistory, PUSH_EX } from './coach-helpers';
import { session, sets } from './helpers';

const memory = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) }; };

const withMachine = () => pplHistory(LAST_MONDAY, 8, (_week, split, exercises) =>
  split === 'push'
    ? [...exercises, { id: 'lib_machine_chest_press', sets: sets(60, 8, 'ideal') }]
    : exercises);

describe('substitutes', () => {
  it('puts same-movement candidates first and caps the result', () => {
    const rows = substitutes(ctx(pplHistory(LAST_MONDAY, 8)), 'lib_barbell_bench_press', 3, {
      exclude: new Set(PUSH_EX),
    });
    const firstOtherPattern = rows.findIndex(row => !row.samePattern);
    const lastSamePattern = rows.reduce((last, row, index) => row.samePattern ? index : last, -1);

    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThanOrEqual(MAX_SUBSTITUTES);
    expect(firstOtherPattern === -1 || firstOtherPattern > lastSamePattern).toBe(true);
  });

  it('excludes the original, current cards, and candidates without shared primary muscle', () => {
    const origin = findExercise('lib_barbell_bench_press')!;
    const rows = substitutes(ctx(pplHistory(LAST_MONDAY, 8)), origin.id, 3, {
      exclude: new Set(PUSH_EX),
    });

    expect(rows.every(row => row.exerciseId !== origin.id && !PUSH_EX.includes(row.exerciseId))).toBe(true);
    for (const row of rows) {
      expect(row.sharedPrimary.length).toBeGreaterThan(0);
      expect(origin.primary).toEqual(expect.arrayContaining(row.sharedPrimary));
      expect(findExercise(row.exerciseId)!.primary).toEqual(expect.arrayContaining(row.sharedPrimary));
    }
  });

  it("carries the candidate's own next-session target", () => {
    const context = ctx(withMachine());
    const row = substitutes(context, 'lib_barbell_bench_press', 3, {
      exclude: new Set(PUSH_EX),
    }).find(candidate => candidate.exerciseId === 'lib_machine_chest_press')!;

    expect(row.target).toEqual(suggestNext(
      context.sessions,
      'lib_machine_chest_press',
      context.goal,
      context.today,
      3,
      context.custom,
    ));
    expect(row.target.kg).toBe(60);
    expect(row.target.confidence).toBe('medium');
    expect(row.useCount).toBe(8);
  });

  it('uses honest starter targets for candidates with no history', () => {
    const rows = substitutes(ctx(pplHistory(LAST_MONDAY, 8)), 'lib_barbell_bench_press', 3, {
      exclude: new Set(PUSH_EX),
    });

    expect(rows.every(row => row.useCount === 0 && row.target.mode === 'start' && row.target.confidence === 'low')).toBe(true);
    expect(rows.find(row => row.exerciseId === 'lib_decline_bench_press')?.target.kg).toBe(20);
    expect(rows.find(row => row.exerciseId === 'lib_cable_chest_press')?.target).toMatchObject({
      kg: null,
      target: 'Start light · 6–12 reps',
    });
  });

  it('scales targets during an active easier week', () => {
    const context = ctx(withMachine(), {
      deload: { from: '2026-09-15', to: '2026-09-25', loadFactor: DELOAD_LOAD_FACTOR, effortCap: 'ideal' },
    });
    const row = substitutes(context, 'lib_barbell_bench_press', 3, {
      exclude: new Set(PUSH_EX),
    }).find(candidate => candidate.exerciseId === 'lib_machine_chest_press')!;
    const ordinary = suggestNext(context.sessions, row.exerciseId, context.goal, context.today, 3, context.custom);

    expect(row.target).toEqual(applyDeload(ordinary, context.deload, context.today));
    expect(row.target.kg).toBe(51);
    expect(row.target.kg).toBeLessThan(ordinary.kg!);
  });

  it('drops candidates below the readiness floor or on the avoid list', () => {
    const context = ctx(pplHistory(LAST_MONDAY, 8));
    const lowGlutes = substitutes(context, 'lib_leg_press', 3, {
      exclude: new Set(LEGS_EX),
      readiness: muscle => muscle === 'glutes' ? 40 : 100,
    });
    expect(lowGlutes.map(row => row.exerciseId)).toEqual([
      'lib_barbell_back_squat',
      'lib_goblet_squat',
      'lib_hack_squat',
    ]);
    expect(lowGlutes.every(row => !findExercise(row.exerciseId)!.primary.includes('glutes'))).toBe(true);

    expect(substitutes(context, 'lib_barbell_bench_press', 3, {
      exclude: new Set(PUSH_EX),
      avoid: new Set<MuscleId>(['chest']),
    })).toEqual([]);
    const avoidGlutes = substitutes(context, 'lib_leg_press', 3, {
      exclude: new Set(LEGS_EX),
      avoid: new Set<MuscleId>(['glutes']),
    });
    expect(avoidGlutes.length).toBeGreaterThan(0);
    expect(avoidGlutes.every(row => !findExercise(row.exerciseId)!.primary.includes('glutes'))).toBe(true);
  });

  it('keeps rep-progress modes together but excludes holds and conditioning', () => {
    const ids = substitutes(ctx(pplHistory(LAST_MONDAY, 8)), 'lib_leg_press', 3, {
      exclude: new Set(LEGS_EX),
      max: 30,
    }).map(row => row.exerciseId);

    expect(ids).toContain('lib_bodyweight_squat');
    expect(ids).not.toEqual(expect.arrayContaining([
      'lib_wall_sit',
      'lib_box_jump',
      'lib_jump_squat',
      'lib_sled_push',
    ]));
  });

  it('spreads equipment groups and can exclude the occupied group', () => {
    const context = ctx(pplHistory(LAST_MONDAY, 8));
    const any = substitutes(context, 'lib_barbell_bench_press', 3, { exclude: new Set(PUSH_EX) });
    expect(new Set(any.map(row => row.equipmentGroup)).size).toBeGreaterThanOrEqual(2);

    const different = substitutes(context, 'lib_barbell_bench_press', 3, {
      exclude: new Set(PUSH_EX),
      mode: 'different_equipment',
    });
    expect(different.map(row => row.exerciseId)).toEqual([
      'lib_cable_chest_press',
      'lib_dumbbell_bench_press',
      'lib_machine_chest_press',
    ]);
    expect(different.every(row => row.equipmentGroup !== 'Barbell')).toBe(true);
  });

  it('ranks familiarity inside a tier and remains deterministic', () => {
    const history = [
      ...pplHistory(LAST_MONDAY, 8),
      ...Array.from({ length: 10 }, (_, index) => session(
        addDays('2026-06-01', index),
        [{ id: 'lib_cable_fly', sets: sets(15, 12, 'ideal') }],
      )),
    ];
    const context = ctx(history);
    const options = { exclude: new Set(PUSH_EX) };
    const first = substitutes(context, 'lib_barbell_bench_press', 3, options);
    const second = substitutes(context, 'lib_barbell_bench_press', 3, options);

    expect(first[0]?.samePattern).toBe(true);
    expect(first.every(row => row.samePattern)).toBe(true);
    expect(first.map(row => row.exerciseId)).toEqual(second.map(row => row.exerciseId));
  });

  it('returns nothing for an unresolved exercise', () => {
    expect(substitutes(ctx([]), 'lib_not_a_real_id_at_all', 3)).toEqual([]);
  });

  it('stays inside the brain layer', () => {
    const source = readFileSync(new URL('../src/brain/live.ts', import.meta.url), 'utf8');
    expect(source).not.toMatch(/from '@\/(app|slices|ui|native)\//);
    expect(source).not.toMatch(/from '@\/core\/store'/);
  });
});

describe('replaceEntry', () => {
  beforeEach(() => {
    initStore(memory());
    replaceState(freshState(new Date('2026-06-01T00:00:00Z')));
  });

  function startPush() {
    const split = createSplit('Push', [
      { exerciseId: 'lib_barbell_bench_press', sets: 4 },
      { exerciseId: 'lib_dumbbell_lateral_raise', sets: 3 },
      { exerciseId: 'lib_triceps_pushdown', sets: 3 },
    ])!;
    startSession(split);
    return split;
  }

  it('replaces a card in place while preserving its planned set count', () => {
    startPush();
    const replacement = findExercise('lib_machine_chest_press')!;

    expect(replaceEntry(0, replacement)).toBe(true);
    expect(state.value.active?.entries).toHaveLength(3);
    expect(state.value.active?.entries[0]).toEqual({
      exerciseId: replacement.id,
      name: replacement.name,
      sets: [{}, {}, {}, {}],
      done: false,
      skipped: false,
    });
    expect(state.value.active?.entries.slice(1).map(entry => entry.exerciseId)).toEqual([
      'lib_dumbbell_lateral_raise',
      'lib_triceps_pushdown',
    ]);
  });

  it('clears logged sets and the done flag from the replaced exercise', () => {
    startPush();
    setSet(0, 0, { kg: 60, reps: 8, effort: 'ideal' });
    markDone(0);

    expect(replaceEntry(0, findExercise('lib_machine_chest_press')!)).toBe(true);
    expect(state.value.active?.entries[0]).toMatchObject({
      sets: [{}, {}, {}, {}],
      done: false,
      skipped: false,
    });
  });

  it('clears the skipped flag from the replaced exercise', () => {
    startPush();
    skipEntry(0);

    expect(replaceEntry(0, findExercise('lib_machine_chest_press')!)).toBe(true);
    expect(state.value.active?.entries[0]).toMatchObject({ done: false, skipped: false });
  });

  it('refuses a duplicate exercise without changing the session', () => {
    startPush();
    const before = state.value.active;

    expect(replaceEntry(0, findExercise('lib_dumbbell_lateral_raise')!)).toBe(false);
    expect(state.value.active).toBe(before);
  });

  it('refuses missing sessions and out-of-range entries', () => {
    const replacement = findExercise('lib_machine_chest_press')!;
    expect(replaceEntry(0, replacement)).toBe(false);

    startPush();
    const before = state.value.active;
    expect(replaceEntry(99, replacement)).toBe(false);
    expect(state.value.active).toBe(before);
  });

  it('guards against stale session and exercise identities', () => {
    startPush();
    const replacement = findExercise('lib_machine_chest_press')!;
    const current = state.value.active!;

    expect(replaceEntry(0, replacement, { startedAt: '2025-01-01T00:00:00.000Z', exerciseId: current.entries[0]!.exerciseId })).toBe(false);
    expect(state.value.active).toBe(current);
    expect(replaceEntry(0, replacement, { startedAt: current.startedAt, exerciseId: 'lib_incline_bench_press' })).toBe(false);
    expect(state.value.active).toBe(current);
    expect(replaceEntry(0, replacement, { startedAt: current.startedAt, exerciseId: current.entries[0]!.exerciseId })).toBe(true);
  });

  it('stale swap cannot replace a shifted entry', () => {
    startPush();
    const current = state.value.active!;
    const expected = { startedAt: current.startedAt, exerciseId: current.entries[1]!.exerciseId };
    removeEntry(0);
    const shifted = state.value.active;

    expect(replaceEntry(1, findExercise('lib_machine_chest_press')!, expected)).toBe(false);
    expect(state.value.active).toBe(shifted);
    expect(state.value.active?.entries.map(entry => entry.exerciseId)).toEqual([
      'lib_dumbbell_lateral_raise',
      'lib_triceps_pushdown',
    ]);
  });

  it('undo never clears newly logged sets', () => {
    startPush();
    const original = findExercise('lib_barbell_bench_press')!;
    const replacement = findExercise('lib_machine_chest_press')!;
    const startedAt = state.value.active!.startedAt;
    expect(replaceEntry(0, replacement, { startedAt, exerciseId: original.id })).toBe(true);
    setSet(0, 0, { kg: 50, reps: 10, effort: 'ideal' });
    const withNewWork = state.value.active;

    expect(restoreEmptyEntry(0, original, { startedAt, exerciseId: replacement.id })).toBe(false);
    expect(state.value.active).toBe(withNewWork);
    expect(state.value.active?.entries[0]).toMatchObject({
      exerciseId: replacement.id,
      sets: [{ kg: 50, reps: 10, effort: 'ideal' }, {}, {}, {}],
    });
  });

  it('leaves coach state byte-identical across a swap and empty-slot undo', () => {
    startPush();
    const original = findExercise('lib_barbell_bench_press')!;
    const replacement = findExercise('lib_machine_chest_press')!;
    const startedAt = state.value.active!.startedAt;
    const coachBefore = JSON.stringify(state.value.coach);

    expect(replaceEntry(0, replacement, { startedAt, exerciseId: original.id })).toBe(true);
    expect(restoreEmptyEntry(0, original, { startedAt, exerciseId: replacement.id })).toBe(true);
    expect(JSON.stringify(state.value.coach)).toBe(coachBefore);
  });

  it('finishes with the replacement while leaving the split template unchanged', () => {
    const split = startPush();
    const replacement = findExercise('lib_machine_chest_press')!;
    replaceEntry(0, replacement);
    setSet(0, 0, { kg: 50, reps: 10, effort: 'ideal' });

    const result = finishSession(false)!;
    expect(result.changedTemplate).toBe(true);
    expect(result.session.exercises[0]?.exerciseId).toBe(replacement.id);
    expect(state.value.splits.find(item => item.id === split.id)?.exercises[0]?.exerciseId).toBe('lib_barbell_bench_press');
  });
});
