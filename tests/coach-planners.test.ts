import { describe, it, expect } from 'vitest';
import { MUSCLE_BY_ID, type MuscleId } from '@/data/muscles';
import { findExercise } from '@/core/exercises';
import { adjustedRecovery, detectBalance, detectProgress, detectRedundant, detectUncovered, detectEffortDrift } from '@/brain/coach/detectors';
import { buildSplits, planAdditions, planDeload, planLoad, planRedundancy, planRest, planSwaps, planToday, usageProfile } from '@/brain/coach/planners';
import { session, sets } from './helpers';
import { ctx, history, pplHistory, pplSplits, std, LAST_MONDAY, PUSH_ID, PULL_ID, LEGS_ID, PUSH_EX } from './coach-helpers';
import { addDays } from '@/core/dates';
import { WEEKLY_SETS_HIGH, MAJOR_MUSCLES } from '@/brain/coach/bands';

describe('today plan', () => {
  it('moves a scheduled push day off a chest that was trained yesterday, and offers ready swaps', () => {
    const now = new Date('2026-09-19T18:00:00.000Z').getTime();
    const sessions = [...pplHistory(LAST_MONDAY, 8), session('2026-09-18', std(PUSH_EX, 40, 8, 'ideal'), PUSH_ID)];
    const c = ctx(sessions, { now, schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: PUSH_ID } });
    const recovery = adjustedRecovery(c);
    const p = planToday(c, recovery, [])!;
    expect(p).not.toBeNull();
    expect(p.apply.kind).toBe('today_plan');
    if (p.apply.kind !== 'today_plan') return;
    expect(p.apply.recommendedSplitId).not.toBe(PUSH_ID);
    expect(p.apply.options[0]!.splitId).toBe(p.apply.recommendedSplitId);
    expect(p.apply.options.find(o => o.splitId === PUSH_ID)!.recoveringMuscles).toContain('chest');
    const chestSwap = p.apply.modifications.find(m => m.removeExerciseId === 'lib_barbell_bench_press')!;
    expect(chestSwap.reason).toBe('under_recovered');
    // The whole push bucket was trained yesterday, so there is nothing ready to swap in.
    expect(chestSwap.replaceWithExerciseId).toBeUndefined();
    expect(p.expiresOn).toBe('2026-09-19');
    expect(p.dismissKey).toBe('today_plan:split_push');
  });

  it('when only chest was trained yesterday, chest lifts get a ready push-bucket replacement', () => {
    const now = new Date('2026-09-19T18:00:00.000Z').getTime();
    const sessions = [...pplHistory('2026-08-31', 8), session('2026-09-18', [{ id: 'lib_cable_fly', sets: sets(15, 12, 'ideal') }, { id: 'lib_pec_fly', sets: sets(40, 12, 'ideal') }], PUSH_ID)];
    const c = ctx(sessions, { now, schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: PUSH_ID } });
    const p = planToday(c, adjustedRecovery(c), [])!;
    expect(p.apply.kind).toBe('today_plan');
    if (p.apply.kind !== 'today_plan') return;
    const chestSwap = p.apply.modifications.find(m => m.removeExerciseId === 'lib_barbell_bench_press')!;
    expect(chestSwap).toBeDefined();
    expect(chestSwap.replaceWithExerciseId).toBeDefined();
    const repl = findExercise(chestSwap.replaceWithExerciseId!)!;
    expect(MUSCLE_BY_ID[repl.primary[0]!].bucket).toBe('push');
    expect(repl.primary).not.toContain('chest');
    expect(PUSH_EX).not.toContain(repl.id);
    expect(p.apply.modifications.some(m => m.removeExerciseId === 'lib_triceps_pushdown')).toBe(false);
  });

  it('is quiet when the scheduled split is the best choice and nothing needs changing, and after training today', () => {
    const now = new Date('2026-09-19T18:00:00.000Z').getTime();
    const sessions = pplHistory('2026-08-31', 8); // last session Friday 4 September, everything recovered
    const c = ctx(sessions, { now, schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: LEGS_ID } });
    expect(planToday(c, adjustedRecovery(c), [])).toBeNull();
    const trained = ctx([...sessions, session('2026-09-19', std(PUSH_EX), PUSH_ID)], { now });
    expect(planToday(trained, adjustedRecovery(trained), [])).toBeNull();
  });
});

describe('swaps, additions, redundancy', () => {
  it('swaps a plateaued bench for another chest press the user has not done lately', () => {
    const flat = [0, 1, 2, 3, 4, 5, 6, 7].map(i => session(addDays('2026-07-06', i * 4), [{ id: 'lib_barbell_bench_press', sets: sets(60, 8) }], PUSH_ID));
    const c = ctx(flat, { now: new Date('2026-09-19T18:00:00.000Z').getTime() });
    const findings = detectProgress(c);
    const out = planSwaps(c, findings, adjustedRecovery(c));
    expect(out).toHaveLength(1);
    const p = out[0]!;
    expect(p.apply.kind).toBe('exercise_swap');
    if (p.apply.kind !== 'exercise_swap') return;
    expect(p.apply.fromExerciseId).toBe('lib_barbell_bench_press');
    const to = findExercise(p.apply.toExerciseId)!;
    expect(to.pattern).toBe('horizontal_push');
    expect(to.primary[0]).toBe('chest');
    expect(pplSplits()[0]!.exercises.map(e => e.exerciseId)).not.toContain(to.id);
    expect(p.apply.splitId).toBe(PUSH_ID);
    expect(p.basedOn).toEqual([findings[0]!.id]);
  });

  it('caps swaps at two per report and puts compound lifts first', () => {
    const many = [0, 1, 2, 3, 4, 5, 6, 7].map(i => session(addDays('2026-07-06', i * 4), std(['lib_dumbbell_biceps_curl', 'lib_barbell_bench_press', 'lib_dumbbell_lateral_raise', 'lib_lat_pulldown', 'lib_triceps_pushdown'], 40, 8), PUSH_ID));
    const c = ctx(many, { now: new Date('2026-09-19T18:00:00.000Z').getTime() });
    const findings = detectProgress(c);
    expect(findings.filter(f => f.kind === 'plateau').length).toBeGreaterThanOrEqual(5);
    const out = planSwaps(c, findings, adjustedRecovery(c));
    expect(out).toHaveLength(2);
    expect(out.map(p => p.subject.exerciseId).sort()).toEqual(['lib_barbell_bench_press', 'lib_lat_pulldown']);
  });

  it('never adds a near-duplicate of something already in the split', () => {
    const s = history(LAST_MONDAY, 3, [
      { weekday: 'mon', splitId: PUSH_ID, exercises: () => std(PUSH_EX) },
      { weekday: 'thu', splitId: PULL_ID, exercises: () => std(['lib_lat_pulldown', 'lib_seated_cable_row', 'lib_face_pull', 'lib_dumbbell_biceps_curl']) },
    ]);
    // With a legs split in the programme the coach says nothing: the split exists, the user is skipping it.
    const withLegs = ctx(s);
    expect(planAdditions(withLegs, detectBalance(withLegs))).toEqual([]);
    // Without one, it adds a lower-body lift to the emptier split and never duplicates a muscle-and-pattern pair there.
    const c = ctx(s, { splits: pplSplits().slice(0, 2) });
    const balance = detectBalance(c);
    expect(balance[0]!.metrics.weak).toBe('Lower body');
    const out = planAdditions(c, balance);
    expect(out).toHaveLength(1);
    const apply = out[0]!.apply;
    if (apply.kind !== 'add_exercise') return;
    const host = c.splits.find(sp => sp.id === apply.splitId)!;
    expect(host.id).toBe(PULL_ID);
    const keys = new Set(host.exercises.map(e => { const m = findExercise(e.exerciseId)!; return `${m.primary[0]}|${m.pattern}`; }));
    const added = findExercise(apply.exerciseId)!;
    expect(keys.has(`${added.primary[0]}|${added.pattern}`)).toBe(false);
    expect(MUSCLE_BY_ID[added.primary[0]!].bucket).toBe('lower');
  });

  it('adds a hamstring exercise to the legs split when hamstrings are untouched', () => {
    const noHams = pplHistory(LAST_MONDAY, 6, (_, split, ex) => (split === 'legs' ? ex.filter(e => e.id !== 'lib_romanian_deadlift' && e.id !== 'lib_seated_leg_curl') : ex));
    const splits = pplSplits();
    splits[2]!.exercises = splits[2]!.exercises.filter(e => e.exerciseId !== 'lib_romanian_deadlift' && e.exerciseId !== 'lib_seated_leg_curl');
    const c = ctx(noHams, { splits });
    const findings = detectUncovered(c);
    const out = planAdditions(c, findings);
    const hams = out.find(p => p.subject.muscle === 'hamstrings')!;
    expect(hams).toBeDefined();
    expect(hams.apply.kind).toBe('add_exercise');
    if (hams.apply.kind !== 'add_exercise') return;
    expect(hams.apply.splitId).toBe(LEGS_ID);
    expect(findExercise(hams.apply.exerciseId)!.primary).toContain('hamstrings');
  });

  it('drops the less-used duplicate', () => {
    const splits = pplSplits();
    splits[0]!.exercises.push({ exerciseId: 'lib_dumbbell_bench_press', sets: 3 });
    const c = ctx(pplHistory(LAST_MONDAY, 4), { splits });
    const out = planRedundancy(c, detectRedundant(c));
    expect(out).toHaveLength(1);
    expect(out[0]!.apply).toMatchObject({ kind: 'split_modify', splitId: PUSH_ID, remove: ['lib_dumbbell_bench_press'] });
  });
});

describe('split builder', () => {
  const profile = usageProfile([], [], '2026-09-19');
  const coverage = (plan: ReturnType<typeof buildSplits>) => MAJOR_MUSCLES.filter(m => (plan.weeklySetsByMuscle[m] ?? 0) < 3);

  it('three days is push, pull, legs covering every major muscle inside the band', () => {
    const plan = buildSplits({ goal: 'lean', daysPerWeek: 3, focus: [], custom: [], profile });
    expect(plan.splits.map(s => s.name)).toEqual(['Push', 'Pull', 'Legs']);
    expect(plan.splits.map(s => s.days[0])).toEqual(['mon', 'wed', 'fri']);
    expect(coverage(plan)).toEqual([]);
    for (const [m, v] of Object.entries(plan.weeklySetsByMuscle)) expect(v, m).toBeLessThanOrEqual(WEEKLY_SETS_HIGH);
    for (const s of plan.splits) expect(new Set(s.exercises.map(e => e.exerciseId)).size).toBe(s.exercises.length);
  });

  it('four days alternates upper and lower with B days picking different lifts', () => {
    const plan = buildSplits({ goal: 'growth', daysPerWeek: 4, focus: [], custom: [], profile });
    expect(plan.splits.map(s => s.name)).toEqual(['Upper A', 'Lower A', 'Upper B', 'Lower B']);
    const a = new Set(plan.splits[0]!.exercises.map(e => e.exerciseId));
    const b = plan.splits[2]!.exercises.map(e => e.exerciseId);
    expect(b.filter(id => a.has(id)).length).toBeLessThan(b.length / 2);
    expect(coverage(plan)).toEqual([]);
  });

  it('a focus muscle gets direct work on two days with extra sets', () => {
    const plan = buildSplits({ goal: 'lean', daysPerWeek: 3, focus: ['side_delts'], custom: [], profile });
    const hits = plan.splits.filter(s => s.exercises.some(e => findExercise(e.exerciseId)!.primary.includes('side_delts')));
    expect(hits.length).toBeGreaterThanOrEqual(2);
    const push = plan.splits.find(s => s.name === 'Push')!;
    const lateral = push.exercises.find(e => findExercise(e.exerciseId)!.pattern === 'shoulder_abduction')!;
    expect(lateral.sets).toBe(4);
    expect(push.focus).toEqual(['side_delts']);
  });

  it('prefers what the user already uses and is deterministic', () => {
    const used = usageProfile(pplHistory(LAST_MONDAY, 6), [], '2026-09-19');
    const plan = buildSplits({ goal: 'lean', daysPerWeek: 3, focus: [], custom: [], profile: used });
    const push = plan.splits[0]!.exercises.map(e => e.exerciseId);
    expect(push).toContain('lib_barbell_bench_press');
    expect(push).toContain('lib_dumbbell_lateral_raise');
    expect(buildSplits({ goal: 'lean', daysPerWeek: 3, focus: [], custom: [], profile: used })).toEqual(plan);
  });

  it('two days and six days both stay inside the band', () => {
    for (const d of [1, 2, 5, 6]) {
      const plan = buildSplits({ goal: 'strength', daysPerWeek: d, focus: ['chest', 'quads'], custom: [], profile });
      expect(plan.splits).toHaveLength(d);
      for (const [m, v] of Object.entries(plan.weeklySetsByMuscle)) expect(v, `${d} days ${m}`).toBeLessThanOrEqual(WEEKLY_SETS_HIGH);
    }
  });
});

describe('load, rest, deload', () => {
  it('next-session targets for the scheduled split', () => {
    const sessions = pplHistory('2026-08-31', 8);
    const c = ctx(sessions, { schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: PUSH_ID } });
    const out = planLoad(c, [], null);
    expect(out).toHaveLength(PUSH_EX.length);
    expect(out.every(p => p.apply.kind === 'load_next' && p.expiresOn === '2026-09-19')).toBe(true);
    const bench = out.find(p => p.subject.exerciseId === 'lib_barbell_bench_press')!;
    if (bench.apply.kind !== 'load_next') return;
    expect(bench.apply.kg).toBe(40);
    expect(['confirm', 'increase', 'hold', 'reps', 'reentry', 'plateau']).toContain(bench.apply.mode);
  });

  it('longer rests for strength goals with a short default', () => {
    expect(planRest(ctx([], { goal: 'strength', restDefaultSec: 90 }))!.apply).toEqual({ kind: 'rest_default', seconds: 150 });
    expect(planRest(ctx([], { goal: 'strength', restDefaultSec: 150 }))).toBeNull();
    expect(planRest(ctx([], { goal: 'growth', restDefaultSec: 60 }))).toBeNull();
  });

  it('an easier week only when several lifts decline together and effort climbs', () => {
    const efforts = ['ideal', 'ideal', 'ideal', 'ideal', 'max', 'max', 'max', 'max'] as const;
    const sessions = efforts.map((e, i) => session(addDays('2026-08-22', i * 3), [
      { id: 'lib_barbell_bench_press', sets: sets(70 - i, 6, e) },
      { id: 'lib_barbell_back_squat', sets: sets(100 - 2 * i, 6, e) },
      { id: 'lib_lat_pulldown', sets: sets(50, 10, 'ideal') },
    ]));
    const c = ctx(sessions);
    const findings = [...detectProgress(c), ...detectEffortDrift(c)];
    expect(findings.filter(f => f.kind === 'decline')).toHaveLength(2);
    expect(findings.some(f => f.kind === 'effort_drift_harder')).toBe(true);
    const p = planDeload(c, findings)!;
    expect(p).not.toBeNull();
    expect(p.apply).toMatchObject({ kind: 'deload_week', from: '2026-09-19', to: '2026-09-25', loadFactor: 0.85, effortCap: 'ideal' });
    expect(p.principles).toContain('deload_evidence');
    expect(planDeload(c, findings.filter(f => f.kind !== 'effort_drift_harder'))).toBeNull();
    const oneLift = findings.filter(f => !(f.kind === 'decline' && f.subject.exerciseId === 'lib_barbell_back_squat'));
    expect(planDeload(c, oneLift)).toBeNull();
  });
});
