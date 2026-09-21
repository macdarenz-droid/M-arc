import { describe, it, expect, beforeEach } from 'vitest';
import { initStore, replaceState, state, loadState } from '@/core/store';
import { emptyCoach, freshState, type AppState } from '@/core/models';
import { acceptProposal, dismissProposal, resetCoachMemory } from '@/slices/coach/apply';
import { buildReport } from '@/brain/coach/report';
import { contextFromState } from '@/brain/coach/context';
import { startSession, discardSession } from '@/slices/workout/session';
import type { Proposal } from '@/brain/coach/contract';
import { pplHistory, pplSplits, LAST_MONDAY, PUSH_ID } from './coach-helpers';
import { smartReminderOptions, nudgeTime } from '@/slices/settings/reminders';

const memory = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) }; };
const TODAY = '2026-09-19';

function seed(): AppState {
  const s = freshState(new Date('2026-06-01T00:00:00Z'));
  s.splits = pplSplits();
  s.sessions = pplHistory(LAST_MONDAY, 12);
  return s;
}

describe('coach state', () => {
  it('older saved states get coach defaults', () => {
    const store = memory();
    const old = seed() as Partial<AppState>;
    delete old.coach;
    store.setItem('marc.state.v1', JSON.stringify(old));
    const loaded = loadState(store);
    expect(loaded.source).toBe('saved');
    expect(loaded.state.coach).toEqual(emptyCoach());
  });
});

describe('accepting and dismissing', () => {
  beforeEach(() => { initStore(memory()); replaceState(seed()); });

  it('a schedule proposal fills empty days, learns start times and turns on smart reminders when reminders are on', () => {
    replaceState({ ...state.value, preferences: { ...state.value.preferences, reminders: { enabled: true, time: '17:30', style: 'silent' } } });
    const r = buildReport(contextFromState(state.value, TODAY, new Date('2026-09-19T12:00:00Z').getTime()));
    const p = r.proposals.find(x => x.kind === 'schedule')!;
    expect(p).toBeDefined();
    const msg = acceptProposal(p, TODAY);
    expect(msg).toContain('Schedule');
    expect(state.value.schedule.mon).toBe(PUSH_ID);
    expect(state.value.schedule.wed).toBe('split_pull');
    expect(state.value.coach.learnedStarts.mon).toBe('18:00');
    expect(state.value.coach.smartReminders).toBe(true);
    expect(state.value.coach.accepted['schedule:*']).toBe(TODAY);
    const again = buildReport(contextFromState(state.value, TODAY, Date.now()));
    expect(again.proposals.some(x => x.kind === 'schedule')).toBe(false);
    const opts = smartReminderOptions(state.value.coach.learnedStarts, true);
    expect(opts.timeByDay?.mon).toBe('17:00');
    expect(opts.body?.('Push', 'mon')).toContain('around 18:00');
    expect(nudgeTime('05:30')).toBe('05:00');
  });

  it('an exercise swap edits the split and the old lift is not proposed again', () => {
    const p: Proposal = { id: 'exercise_swap:lib_barbell_bench_press', kind: 'exercise_swap', subject: { exerciseId: 'lib_barbell_bench_press', splitId: PUSH_ID },
      apply: { kind: 'exercise_swap', splitId: PUSH_ID, fromExerciseId: 'lib_barbell_bench_press', toExerciseId: 'lib_dumbbell_bench_press' }, basedOn: [], principles: ['exercise_variation'], confidence: 'medium', dismissKey: 'exercise_swap:lib_barbell_bench_press' };
    expect(acceptProposal(p, TODAY)).toContain('Dumbbell Bench Press');
    const push = state.value.splits.find(s => s.id === PUSH_ID)!;
    expect(push.exercises.map(e => e.exerciseId)).toContain('lib_dumbbell_bench_press');
    expect(push.exercises.map(e => e.exerciseId)).not.toContain('lib_barbell_bench_press');
    expect(push.exercises[0]!.sets).toBe(3);
  });

  it('guards chronic-skip cut and swap against stale splits without touching active work or history', () => {
    const split = state.value.splits.find(candidate => candidate.id === PUSH_ID)!;
    startSession(split);
    const beforeActive = structuredClone(state.value.active);
    const beforeHistory = structuredClone(state.value.sessions);
    const cut: Proposal = {
      id: 'split_modify:split_push:skip-cut-lib_barbell_bench_press', kind: 'split_modify',
      subject: { splitId: PUSH_ID, splitName: 'Push' },
      apply: { kind: 'split_modify', splitId: PUSH_ID, add: [], remove: ['lib_barbell_bench_press'], setChanges: [] },
      basedOn: ['chronic_skip:split_push:lib_barbell_bench_press'], principles: ['exercise_variation'], confidence: 'medium', dismissKey: 'split_modify:split_push',
    };
    expect(acceptProposal(cut, TODAY)).toContain('Removed Barbell Bench Press');
    expect(state.value.active).toEqual(beforeActive);
    expect(state.value.sessions).toEqual(beforeHistory);
    expect(state.value.splits.find(candidate => candidate.id === PUSH_ID)!.exercises.some(entry => entry.exerciseId === 'lib_barbell_bench_press')).toBe(false);
    expect(state.value.coach.accepted[cut.dismissKey]).toBe(TODAY);

    expect(acceptProposal(cut, TODAY)).toContain('changed');
    const staleSwap: Proposal = {
      id: 'exercise_swap:split_push:skip-swap-lib_barbell_bench_press', kind: 'exercise_swap',
      subject: { splitId: PUSH_ID, splitName: 'Push', exerciseName: 'Barbell Bench Press' },
      apply: { kind: 'exercise_swap', splitId: PUSH_ID, fromExerciseId: 'lib_barbell_bench_press', toExerciseId: 'lib_dumbbell_bench_press' },
      basedOn: ['chronic_skip:split_push:lib_barbell_bench_press'], principles: ['exercise_variation'], confidence: 'medium', dismissKey: 'exercise_swap:split_push',
    };
    expect(acceptProposal(staleSwap, TODAY)).toContain('changed');
    expect(state.value.coach.accepted[staleSwap.dismissKey]).toBeUndefined();
    expect(state.value.active).toEqual(beforeActive);
    expect(state.value.sessions).toEqual(beforeHistory);
  });

  it('rejects a chronic-skip replacement already in the split and never removes a sole exercise', () => {
    const swap: Proposal = {
      id: 'exercise_swap:split_push:skip-swap-lib_barbell_bench_press', kind: 'exercise_swap', subject: { splitId: PUSH_ID },
      apply: { kind: 'exercise_swap', splitId: PUSH_ID, fromExerciseId: 'lib_barbell_bench_press', toExerciseId: 'lib_incline_dumbbell_press' },
      basedOn: ['chronic_skip:split_push:lib_barbell_bench_press'], principles: ['exercise_variation'], confidence: 'medium', dismissKey: 'exercise_swap:split_push',
    };
    expect(acceptProposal(swap, TODAY)).toContain('already');
    expect(state.value.coach.accepted[swap.dismissKey]).toBeUndefined();
    replaceState({ ...state.value, splits: [{ ...state.value.splits[0]!, exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }] }] });
    const cut: Proposal = {
      id: 'split_modify:split_push:skip-cut-lib_barbell_bench_press', kind: 'split_modify', subject: { splitId: PUSH_ID },
      apply: { kind: 'split_modify', splitId: PUSH_ID, add: [], remove: ['lib_barbell_bench_press'], setChanges: [] },
      basedOn: ['chronic_skip:split_push:lib_barbell_bench_press'], principles: ['exercise_variation'], confidence: 'medium', dismissKey: 'split_modify:split_push',
    };
    expect(acceptProposal(cut, TODAY)).toContain('changed');
    expect(state.value.splits[0]!.exercises).toHaveLength(1);
    expect(state.value.coach.accepted[cut.dismissKey]).toBeUndefined();
  });

  it('a today plan applies one-day swaps to the session, not the split', () => {
    const p: Proposal = { id: 'today_plan:split_push', kind: 'today_plan', subject: { splitId: PUSH_ID },
      apply: { kind: 'today_plan', recommendedSplitId: PUSH_ID, options: [], modifications: [{ removeExerciseId: 'lib_barbell_bench_press', replaceWithExerciseId: 'lib_triceps_pushdown', reason: 'under_recovered' }, { removeExerciseId: 'lib_incline_dumbbell_press', reason: 'under_recovered' }] },
      basedOn: [], principles: ['recovery_time_course'], confidence: 'medium', dismissKey: 'today_plan:split_push', expiresOn: TODAY };
    acceptProposal(p, TODAY);
    expect(state.value.coach.todayPlan).toMatchObject({ day: TODAY, splitId: PUSH_ID });
    const split = state.value.splits.find(s => s.id === PUSH_ID)!;
    startSession(split, state.value.coach.todayPlan!.changes);
    const ids = state.value.active!.entries.map(e => e.exerciseId);
    expect(ids).not.toContain('lib_barbell_bench_press');
    expect(ids).not.toContain('lib_incline_dumbbell_press');
    expect(ids.filter(id => id === 'lib_triceps_pushdown')).toHaveLength(2);
    expect(split.exercises.map(e => e.exerciseId)).toContain('lib_barbell_bench_press');
    discardSession();
  });

  it('split_new respects the cap, sets the schedule when empty, and other kinds apply', () => {
    const plan: Proposal = { id: 'split_new:*', kind: 'split_new', subject: {}, basedOn: [], principles: ['volume_dose_response'], confidence: 'low', dismissKey: 'split_new:*',
      apply: { kind: 'split_new', daysPerWeek: 2, weeklySetsByMuscle: {}, splits: [{ name: 'Full body A', focus: ['chest'], days: ['mon'], exercises: [{ exerciseId: 'lib_leg_press', sets: 3 }] }, { name: 'Full body B', focus: [], days: ['thu'], exercises: [{ exerciseId: 'lib_lat_pulldown', sets: 3 }] }] } };
    expect(acceptProposal(plan, TODAY)).toContain('Added 2');
    expect(state.value.splits).toHaveLength(5);
    expect(state.value.schedule.mon).toBe(state.value.splits[3]!.id);
    expect(state.value.splits[3]!.focus).toEqual(['chest']);
    replaceState({ ...state.value, splits: [...state.value.splits, ...pplSplits().map(s => ({ ...s, id: `${s.id}_2` }))].slice(0, 7) });
    expect(acceptProposal(plan, TODAY)).toContain('up to 7');
    expect(acceptProposal({ id: 'rest_default:*', kind: 'rest_default', subject: {}, apply: { kind: 'rest_default', seconds: 150 }, basedOn: [], principles: ['rest_intervals'], confidence: 'medium', dismissKey: 'rest_default:*' }, TODAY)).toContain('150');
    expect(state.value.preferences.restDefaultSec).toBe(150);
    acceptProposal({ id: 'deload_week:*', kind: 'deload_week', subject: {}, apply: { kind: 'deload_week', from: TODAY, to: '2026-09-25', loadFactor: 0.85, effortCap: 'ideal' }, basedOn: [], principles: ['deload_evidence'], confidence: 'medium', dismissKey: 'deload_week:*' }, TODAY);
    expect(state.value.coach.deload?.loadFactor).toBe(0.85);
    acceptProposal({ id: 'add_exercise:hamstrings', kind: 'add_exercise', subject: { muscle: 'hamstrings' }, apply: { kind: 'add_exercise', splitId: 'split_legs', exerciseId: 'lib_lying_leg_curl', sets: 3, muscle: 'hamstrings' }, basedOn: [], principles: ['volume_dose_response'], confidence: 'high', dismissKey: 'add_exercise:hamstrings' }, TODAY);
    expect(state.value.splits.find(s => s.id === 'split_legs')!.exercises.some(e => e.exerciseId === 'lib_lying_leg_curl')).toBe(true);
    acceptProposal({ id: 'split_modify:split_legs', kind: 'split_modify', subject: { splitId: 'split_legs' }, apply: { kind: 'split_modify', splitId: 'split_legs', add: [], remove: ['lib_lying_leg_curl'], setChanges: [{ exerciseId: 'lib_leg_press', sets: 4 }] }, basedOn: [], principles: ['exercise_variation'], confidence: 'high', dismissKey: 'split_modify:split_legs' }, TODAY);
    const legs = state.value.splits.find(s => s.id === 'split_legs')!;
    expect(legs.exercises.some(e => e.exerciseId === 'lib_lying_leg_curl')).toBe(false);
    expect(legs.exercises.find(e => e.exerciseId === 'lib_leg_press')!.sets).toBe(4);
  });

  it('dismissing snoozes, twice suppresses, and reset forgets', () => {
    const r = buildReport(contextFromState(state.value, TODAY, Date.now()));
    const p = r.proposals.find(x => x.kind === 'schedule')!;
    dismissProposal(p, TODAY);
    expect(state.value.coach.dismissed['schedule:*']).toBe(1);
    expect(state.value.coach.snoozedUntil['schedule:*']).toBe('2026-09-22');
    expect(buildReport(contextFromState(state.value, TODAY, Date.now())).proposals.some(x => x.kind === 'schedule')).toBe(true);
    dismissProposal(p, TODAY);
    expect(buildReport(contextFromState(state.value, TODAY, Date.now())).proposals.some(x => x.kind === 'schedule')).toBe(false);
    resetCoachMemory();
    expect(state.value.coach.dismissed).toEqual({});
    expect(buildReport(contextFromState(state.value, TODAY, Date.now())).proposals.some(x => x.kind === 'schedule')).toBe(true);
  });
});
