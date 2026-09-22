import { describe, it, expect } from 'vitest';
import * as R from '@/escobar/tools/read';
import { FIXTURES, ctxOf, sixMonthsState, twoWeeksState, emptyState, NOW } from './fixtures';

const bytes = (v: unknown) => JSON.stringify(v).length;
const CASES: Array<[string, (ctx: ReturnType<typeof ctxOf>) => unknown, number]> = [
  ['get_overview', c => R.getOverview({}, c), 1200],
  ['get_sessions', c => R.getSessions({ limit: 20 }, c), 5200],
  ['get_exercise_history', c => R.getExerciseHistory({ exerciseId: 'lib_barbell_bench_press', weeks: 52 }, c), 6200],
  ['get_next_target', c => R.getNextTarget({ exerciseId: 'lib_barbell_bench_press' }, c), 3200],
  ['get_recovery', c => R.getRecovery({}, c), 5200],
  ['get_readiness', c => R.getReadiness({ historyDays: 30 }, c), 3200],
  ['get_volume', c => R.getVolume({ weeks: 12 }, c), 5200],
  ['get_records', c => R.getRecords({ limit: 20 }, c), 4200],
  ['get_insights', c => R.getInsights({}, c), 9200],
  ['get_plan', c => R.getPlan({}, c), 6200],
  ['get_body', c => R.getBody({ weeks: 52 }, c), 3200],
  ['get_health', c => R.getHealth({ days: 30 }, c), 4200],
  ['get_live_session', c => R.getLiveSession({}, c), 3200],
  ['search_exercises', c => R.searchExercisesTool({ query: 'press', limit: 12 }, c), 4000],
  ['get_exercise', c => R.getExercise({ exerciseId: 'lib_barbell_bench_press' }, c), 3000],
  ['get_equipment', c => R.getEquipment({ exerciseId: 'lib_dumbbell_shoulder_press' }, c), 3200],
  ['find_in_app', () => R.findInAppTool({ query: 'where is my recovery' }), 3000],
];

describe.each(FIXTURES)('read tools on the %s fixture', (_name, make) => {
  const ctx = ctxOf(make());
  it.each(CASES)('%s runs and stays under its byte cap', (_tool, run, cap) => {
    const out = run(ctx);
    expect(out).toBeTruthy();
    expect(bytes(out)).toBeLessThanOrEqual(cap);
  });
});

describe('read tool details', () => {
  const six = ctxOf(sixMonthsState());
  it('overview names the scheduled split and the least recovered muscles', () => {
    const o = R.getOverview({}, six);
    expect(o.scheduled?.split).toBe('Pull');
    expect(o.leastRecovered.length).toBe(3);
    expect(o.readiness).not.toBeNull();
  });
  it('sessions filter by day and split, newest first, with limit', () => {
    const all = R.getSessions({ limit: 20 }, six);
    expect(all.sessions[0]!.day >= all.sessions[1]!.day).toBe(true);
    const pull = R.getSessions({ splitId: 'sp_pull', limit: 5 }, six);
    expect(pull.sessions.every(s => s.split === 'Pull')).toBe(true);
    const range = R.getSessions({ from: '2026-09-14', to: '2026-09-20' }, six);
    expect(range.sessions.every(s => s.day >= '2026-09-14' && s.day <= '2026-09-20')).toBe(true);
    expect(() => R.getSessions({ limit: 50 }, six)).toThrow(/between 1 and 20/);
    expect(() => R.getSessions({ from: 'yesterday' }, six)).toThrow(/YYYY-MM-DD/);
  });
  it('one session has every set and no heart without sharing', () => {
    const id = R.getSessions({ limit: 1 }, six).sessions[0]!.sessionId;
    const s = R.getSession({ sessionId: id }, six);
    expect(s.exercises.length).toBe(3);
    expect(s.exercises[0]!.sets.length).toBe(3);
    expect(() => R.getSession({ sessionId: 'nope' }, six)).toThrow(/unknown sessionId/);
  });
  it('exercise history reports plateau, trend and loads with a unit', () => {
    const h = R.getExerciseHistory({ exerciseId: 'lib_barbell_bench_press', weeks: 12 }, six);
    expect(h.sessions.length).toBeGreaterThan(10);
    expect(h.sessions[0]!.top.unit).toBe('kg');
    expect(['progressing', 'plateaued', 'declining', 'unknown']).toContain(h.plateau.status);
    expect(() => R.getExerciseHistory({ exerciseId: 'lib_nope' }, six)).toThrow(/search_exercises/);
    expect(() => R.getExerciseHistory({ exerciseId: 'lib_barbell_bench_press', weeks: 60 }, six)).toThrow(/between 1 and 52/);
  });
  it('next target includes a warm-up for main lifts and the equipment unit', () => {
    const lb = sixMonthsState();
    lb.units.byExercise.gym_default = { lib_barbell_bench_press: { unit: 'lb', barKg: 20.412, plates: [45, 35, 25, 10, 5, 2.5], source: 'user', updatedAt: '' } };
    const t = R.getNextTarget({ exerciseId: 'lib_barbell_bench_press' }, ctxOf(lb));
    expect(t.unit).toBe('lb');
    expect(t.target).toContain('lb');
    expect(t.warmup.length).toBe(3);
  });
  it('recovery projects forward and refuses more than 7 days', () => {
    const now = R.getRecovery({ muscles: ['chest'] }, six);
    const later = R.getRecovery({ muscles: ['chest'], at: new Date(NOW + 48 * 3600e3).toISOString() }, six);
    expect(later.muscles[0]!.pct).toBeGreaterThanOrEqual(now.muscles[0]!.pct);
    expect(() => R.getRecovery({ at: new Date(NOW + 9 * 86400e3).toISOString() }, six)).toThrow(/7 days/);
    expect(() => R.getRecovery({ muscles: ['wings'] }, six)).toThrow(/unknown muscles/);
  });
  it('readiness hides health drivers and baselines without health sharing', () => {
    const s = sixMonthsState();
    s.escobar.sharing.health = false;
    const r = R.getReadiness({}, ctxOf(s));
    expect('baselines' in r).toBe(false);
    const shared = R.getReadiness({ historyDays: 7 }, six);
    expect(shared.baselines).toBeTruthy();
    expect(shared.history).toHaveLength(7);
  });
  it('insights include every rule, not just the top three', () => {
    const i = R.getInsights({}, six);
    expect(i.insights.length).toBeGreaterThan(3);
    expect(i.insights.every(x => x.id && x.title && x.action)).toBe(true);
  });
  it('plan lists splits with exercise names and the schedule by name', () => {
    const p = R.getPlan({}, six);
    expect(p.splits).toHaveLength(3);
    expect(p.schedule.mon).toBe('Push');
    expect(p.goal.mainReps).toEqual([6, 12]);
  });
  it('body gives the trend and BMI', () => {
    const b = R.getBody({ weeks: 52 }, six);
    expect(b.bmi).toBeCloseTo(80.5 / 1.8 ** 2, 0);
    expect(b.bodyFat).toHaveLength(2);
  });
  it('live session is empty without one', () => {
    expect(R.getLiveSession({}, six)).toEqual({ active: false });
    const s = twoWeeksState();
    s.active = { splitId: 'sp_push', startedAt: new Date(NOW - 20 * 60e3).toISOString(), pausedMs: 0, entries: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench', sets: [{ kg: 60, reps: 10, effort: 'easy', fidelity: 'live', at: new Date(NOW).toISOString() }, {}, {}], done: false, skipped: false }] };
    const l = R.getLiveSession({}, ctxOf(s));
    expect(l).toMatchObject({ active: true, split: 'Push', elapsedMin: 20 });
  });
  it('search filters by muscle and equipment', () => {
    const r = R.searchExercisesTool({ muscle: 'chest', equipment: 'Dumbbells' }, six);
    expect(r.exercises.length).toBeGreaterThan(0);
    expect(r.exercises.every(e => e.primary.includes('chest'))).toBe(true);
    expect(() => R.searchExercisesTool({ muscle: 'wings' }, six)).toThrow();
  });
  it('equipment reports the gym and loadable neighbours', () => {
    const e = R.getEquipment({ exerciseId: 'lib_dumbbell_shoulder_press' }, six) as unknown as { profile: { unit: string; ladder: number[] }; loadableNear: unknown[] };
    expect(e.profile.unit).toBe('kg');
    expect(e.profile.ladder.length).toBeGreaterThan(5);
    expect(e.loadableNear.length).toBeGreaterThan(0);
    expect(() => R.getEquipment({ gymId: 'nope' }, six)).toThrow(/unknown gymId/);
  });
  it('find_in_app returns palace entries', () => {
    expect(R.findInAppTool({ query: 'export a backup' }).results[0]!.id).toBe('settings.data');
    expect(() => R.findInAppTool({ query: '' })).toThrow();
  });
  it('capJson trims arrays and marks truncation', () => {
    const big = { rows: Array.from({ length: 500 }, (_, i) => ({ i, pad: 'x'.repeat(20) })) };
    const out = R.capJson(big, 1000) as typeof big & { truncated?: boolean };
    expect(JSON.stringify(out).length).toBeLessThanOrEqual(1000);
    expect(out.truncated).toBe(true);
    expect(R.capJson({ a: 1 }, 100)).toEqual({ a: 1 });
  });
  it('empty state answers without throwing', () => {
    const e = ctxOf(emptyState());
    expect(R.getOverview({}, e).scheduled).toBeNull();
    expect(R.getRecovery({}, e).muscles).toEqual([]);
    expect(R.getInsights({}, e).insights).toBeDefined();
  });
});
