import { describe, expect, it } from 'vitest';
import { warmupRamp } from '@/brain/live';
import { findExercise } from '@/core/exercises';
import type { ActiveSession, PlanSetTarget, WorkoutPlanEntry } from '@/core/models';
import { ctx } from './coach-helpers';

const STARTED = '2026-09-21T05:00:00.000Z';
const planEntry = (id: string, exerciseId: string, source: WorkoutPlanEntry['targetSource'] = 'history'): WorkoutPlanEntry => ({
  id, exerciseId, name: exerciseId, mode: 'weighted', origin: 'start', plannedSets: 3, targetSource: source, allowIncrease: true,
  targets: Array.from({ length: 3 }, () => ({ kg: 60, reps: 8, durationSec: null })),
});
const entry = (id: string, exerciseId: string): ActiveSession['entries'][number] => ({
  exerciseId, name: exerciseId, sets: [{}, {}, {}], done: false, skipped: false, planEntryId: id,
});
const active = (entries = [entry('pe_bench', 'lib_barbell_bench_press')], plans = [planEntry('pe_bench', 'lib_barbell_bench_press')]): ActiveSession => ({
  splitId: 'split_push', startedAt: STARTED, pausedMs: 0, entries,
  plan: { version: 1, capturedAt: STARTED, goal: 'lean', deload: null, entries: plans },
});
const target = (kg: number): PlanSetTarget => ({ kg, reps: 8, durationSec: null });

describe('warmupRamp', () => {
  it('turns a 60 kg captured working target into 24x8, 36x5 and 48x3 without mutation', () => {
    const session = active();
    const targets = new Map([['pe_bench', target(60)]]);
    const before = structuredClone(session);
    expect(warmupRamp({ ctx: ctx([]), active: session, targets })).toEqual({
      entryId: 'pe_bench', exerciseId: 'lib_barbell_bench_press', name: 'lib_barbell_bench_press', workingKg: 60,
      sets: [{ kg: 24, reps: 8 }, { kg: 36, reps: 5 }, { kg: 48, reps: 3 }],
    });
    expect(session).toEqual(before);
    expect(targets.get('pe_bench')).toEqual(target(60));
  });

  it('selects only the first eligible loaded compound in current order', () => {
    const entries = [entry('pe_fly', 'lib_cable_fly'), entry('pe_bench', 'lib_barbell_bench_press'), entry('pe_press', 'lib_barbell_overhead_press')];
    const plans = [planEntry('pe_fly', 'lib_cable_fly'), planEntry('pe_bench', 'lib_barbell_bench_press'), planEntry('pe_press', 'lib_barbell_overhead_press')];
    const targets = new Map([['pe_fly', target(30)], ['pe_bench', target(60)], ['pe_press', target(40)]]);
    expect(warmupRamp({ ctx: ctx([]), active: active(entries, plans), targets })?.entryId).toBe('pe_bench');
  });

  it('suppresses the ramp after any working set anywhere in the session', () => {
    const session = active([entry('pe_bench', 'lib_barbell_bench_press'), entry('pe_fly', 'lib_cable_fly')], [planEntry('pe_bench', 'lib_barbell_bench_press'), planEntry('pe_fly', 'lib_cable_fly')]);
    session.entries[1]!.sets[0] = { kg: 10, reps: 12 };
    expect(warmupRamp({ ctx: ctx([]), active: session, targets: new Map([['pe_bench', target(60)]]) })).toBeNull();
  });

  it('does not turn starter, unknown, missing or light targets into personal preparation', () => {
    const starter = active(undefined, [planEntry('pe_bench', 'lib_barbell_bench_press', 'starter')]);
    expect(warmupRamp({ ctx: ctx([]), active: starter, targets: new Map([['pe_bench', target(60)]]) })).toBeNull();
    expect(warmupRamp({ ctx: ctx([]), active: active(), targets: new Map() })).toBeNull();
    expect(warmupRamp({ ctx: ctx([]), active: active(), targets: new Map([['pe_bench', target(19.5)]]) })).toBeNull();
    const unknown = active([entry('pe_unknown', 'custom_missing')], [planEntry('pe_unknown', 'custom_missing')]);
    expect(warmupRamp({ ctx: ctx([]), active: unknown, targets: new Map([['pe_unknown', target(60)]]) })).toBeNull();
  });

  it.each([
    ['lib_push_up', 'bodyweight'],
    ['lib_assisted_pull_up', 'assisted'],
    ['lib_plank', 'duration'],
    ['lib_sled_push', 'conditioning'],
  ])('keeps %s %s work silent', (exerciseId, mode) => {
    expect(findExercise(exerciseId)?.mode).toBe(mode);
    const session = active([entry('pe_other', exerciseId)], [planEntry('pe_other', exerciseId)]);
    expect(warmupRamp({ ctx: ctx([]), active: session, targets: new Map([['pe_other', target(60)]]) })).toBeNull();
  });

  it('uses an already-lowered deload target exactly once and always rounds down', () => {
    expect(warmupRamp({ ctx: ctx([]), active: active(), targets: new Map([['pe_bench', target(51)]]) })?.sets).toEqual([
      { kg: 20, reps: 8 }, { kg: 30.5, reps: 5 }, { kg: 40.5, reps: 3 },
    ]);
  });

  it('returns null for nonfinite targets, invalid identity, pause or explicit hide', () => {
    expect(warmupRamp({ ctx: ctx([]), active: active(), targets: new Map([['pe_bench', target(Number.POSITIVE_INFINITY)]]) })).toBeNull();
    const mismatched = active(); mismatched.plan!.entries[0]!.exerciseId = 'lib_overhead_press';
    expect(warmupRamp({ ctx: ctx([]), active: mismatched, targets: new Map([['pe_bench', target(60)]]) })).toBeNull();
    expect(warmupRamp({ ctx: ctx([]), active: { ...active(), pausedAt: 1 }, targets: new Map([['pe_bench', target(60)]]) })).toBeNull();
    const hidden = { ...active(), warmupDismissed: true } as ActiveSession & { warmupDismissed: boolean };
    expect(warmupRamp({ ctx: ctx([]), active: hidden, targets: new Map([['pe_bench', target(60)]]) })).toBeNull();
  });
});
