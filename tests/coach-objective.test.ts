import { beforeEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { freshState, type PersonalObjective, type Split } from '@/core/models';
import { initStore, loadState, STATE_KEY, state, update } from '@/core/store';
import { currentPayload } from '@/slices/coach/remote';
import { draftFromObjective, removeObjective, restoreObjective, saveObjectiveDraft } from '@/slices/coach/objective';

function memoryStorage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => void values.set(key, value), removeItem: (key: string) => void values.delete(key), values };
}

const baseObjective = (): PersonalObjective => ({
  version: 1,
  id: 'objective_stable',
  revision: 1,
  createdAt: '2026-09-20T08:00:00.000Z',
  updatedAt: '2026-09-20T08:00:00.000Z',
  statement: 'Build a steady routine and improve my bench.',
  priorityMuscles: ['chest'],
  availableWeekdays: ['mon', 'wed', 'fri'],
  equipmentNote: 'Home dumbbells on weekdays',
  measures: [{ kind: 'consistency' }, { kind: 'lift_trend', exerciseId: 'lib_barbell_bench_press' }],
  reviewDay: '2026-10-20',
});

beforeEach(() => initStore(memoryStorage()));

describe('P08 optional personal objective', () => {
  it('is absent for existing users and cancel-like draft edits write nothing', () => {
    expect(state.value.coach.objective).toBeUndefined();
    const before = JSON.stringify(state.value);
    const draft = draftFromObjective(undefined);
    draft.statement = 'Changed only in the editor';
    expect(JSON.stringify(state.value)).toBe(before);
  });

  it('saves explicitly without changing goal, programme, schedule or targets', () => {
    const split: Split = { id: 'split_push', name: 'Push', color: '#4d9dff', createdAt: '2026-01-01T00:00:00.000Z', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }] };
    update(app => ({ ...app, goal: 'strength', splits: [split], schedule: { ...app.schedule, mon: split.id } }));
    const before = { goal: state.value.goal, splits: state.value.splits, schedule: state.value.schedule, sessions: state.value.sessions };
    const result = saveObjectiveDraft({
      statement: '  Build strength steadily 💪  ', priorityMuscles: ['chest', 'chest'], availableWeekdays: ['fri', 'mon', 'fri'],
      equipmentNote: '  Barbell and rack  ', measures: [{ kind: 'consistency' }, { kind: 'consistency' }, { kind: 'lift_trend', exerciseId: 'lib_barbell_bench_press' }], reviewDay: '2026-10-01',
    }, '2026-09-22', { now: new Date('2026-09-22T08:00:00.000Z'), id: 'objective_fixed' });
    expect(result).toMatchObject({ ok: true, objective: { id: 'objective_fixed', revision: 1, statement: 'Build strength steadily 💪', priorityMuscles: ['chest'], availableWeekdays: ['mon', 'fri'], equipmentNote: 'Barbell and rack' } });
    expect(result.ok && result.objective.measures).toEqual([{ kind: 'consistency' }, { kind: 'lift_trend', exerciseId: 'lib_barbell_bench_press' }]);
    expect({ goal: state.value.goal, splits: state.value.splits, schedule: state.value.schedule, sessions: state.value.sessions }).toEqual(before);
    const storage = memoryStorage();
    storage.setItem(STATE_KEY, JSON.stringify(state.value));
    expect(loadState(storage).state.coach.objective).toEqual(result.ok ? result.objective : undefined);
  });

  it('keeps stable identity, increments revision and does not let an older objective overwrite a later goal choice', () => {
    update(app => ({ ...app, coach: { ...app.coach, objective: baseObjective() } }));
    update(app => ({ ...app, goal: 'strength_muscle' }));
    const result = saveObjectiveDraft({ ...draftFromObjective(state.value.coach.objective), statement: 'Updated direction' }, '2026-09-22', { now: new Date('2026-09-23T08:00:00.000Z') });
    expect(result).toMatchObject({ ok: true, objective: { id: 'objective_stable', revision: 2, createdAt: '2026-09-20T08:00:00.000Z', updatedAt: '2026-09-23T08:00:00.000Z' } });
    expect(state.value.goal).toBe('strength_muscle');
  });

  it('requires a future newly chosen review day but retains an unchanged overdue day', () => {
    const draft = { ...draftFromObjective(undefined), statement: 'Stay consistent', reviewDay: '2026-09-21' };
    expect(saveObjectiveDraft(draft, '2026-09-22')).toMatchObject({ ok: false, error: 'Choose a future review day.' });
    const overdue = { ...baseObjective(), reviewDay: '2026-09-21' };
    update(app => ({ ...app, coach: { ...app.coach, objective: overdue } }));
    expect(saveObjectiveDraft({ ...draftFromObjective(overdue), statement: 'Still the same direction' }, '2026-09-22').ok).toBe(true);
  });

  it('enforces bounded statement, muscles, equipment and measures', () => {
    const base = { ...draftFromObjective(undefined), statement: 'Direction' };
    expect(saveObjectiveDraft({ ...base, statement: '' }, '2026-09-22').ok).toBe(false);
    expect(saveObjectiveDraft({ ...base, statement: 'é'.repeat(281) }, '2026-09-22').ok).toBe(false);
    expect(saveObjectiveDraft({ ...base, priorityMuscles: ['chest', 'lats', 'quads', 'calves'] }, '2026-09-22').ok).toBe(false);
    expect(saveObjectiveDraft({ ...base, equipmentNote: 'x'.repeat(121) }, '2026-09-22').ok).toBe(false);
    expect(saveObjectiveDraft({ ...base, measures: [] }, '2026-09-22').ok).toBe(false);
  });

  it('removes and restores explicitly without touching other state', () => {
    update(app => ({ ...app, goal: 'strength', coach: { ...app.coach, objective: baseObjective() } }));
    const removed = removeObjective();
    expect(state.value.coach.objective).toBeUndefined();
    expect(state.value.goal).toBe('strength');
    restoreObjective(removed!);
    expect(state.value.coach.objective).toEqual(baseObjective());
  });
});

describe('objective normalization and privacy', () => {
  it('round-trips valid data, deduplicates fields and keeps an unavailable lift plus an overdue review', () => {
    const storage = memoryStorage();
    const app = freshState();
    app.coach.objective = { ...baseObjective(), priorityMuscles: ['chest', 'chest'], availableWeekdays: ['fri', 'mon', 'fri'], measures: [{ kind: 'consistency' }, { kind: 'consistency' }, { kind: 'lift_trend', exerciseId: 'deleted_custom_lift' }], reviewDay: '2020-01-01' };
    storage.setItem(STATE_KEY, JSON.stringify(app));
    expect(loadState(storage).state.coach.objective).toMatchObject({
      priorityMuscles: ['chest'], availableWeekdays: ['mon', 'fri'],
      measures: [{ kind: 'consistency' }, { kind: 'lift_trend', exerciseId: 'deleted_custom_lift' }], reviewDay: '2020-01-01',
    });
  });

  it.each([
    ['wrong version', { ...baseObjective(), version: 2 }],
    ['oversized statement', { ...baseObjective(), statement: 'x'.repeat(281) }],
    ['unknown muscle', { ...baseObjective(), priorityMuscles: ['not_real'] }],
    ['invalid weekday', { ...baseObjective(), availableWeekdays: ['someday'] }],
    ['too many measures', { ...baseObjective(), measures: [{ kind: 'consistency' }, { kind: 'body_trend' }, { kind: 'lift_trend', exerciseId: 'a' }, { kind: 'lift_trend', exerciseId: 'b' }] }],
    ['bad review day', { ...baseObjective(), reviewDay: '2026-99-99' }],
  ])('drops only malformed objective metadata for %s', (_label, objective) => {
    const storage = memoryStorage();
    const app = freshState();
    app.goal = 'strength';
    app.sessions = [{ id: 'kept', splitId: 'push', splitName: 'Push', day: '2026-09-20', startedAt: '2026-09-20T08:00:00.000Z', endedAt: '2026-09-20T09:00:00.000Z', durationSec: 3600, exercises: [] }];
    (app.coach as unknown as Record<string, unknown>).objective = objective;
    storage.setItem(STATE_KEY, JSON.stringify(app));
    const loaded = loadState(storage).state;
    expect(loaded.coach.objective).toBeUndefined();
    expect(loaded.goal).toBe('strength');
    expect(loaded.sessions[0]?.id).toBe('kept');
  });

  it('never adds objective prose, equipment or assessment arrays to remote payloads', () => {
    const secret = 'LOCAL OBJECTIVE SECRET';
    update(app => ({ ...app, coach: { ...app.coach, objective: { ...baseObjective(), statement: secret, equipmentNote: 'LOCAL EQUIPMENT SECRET' } } }));
    expect(JSON.stringify(currentPayload())).not.toContain('LOCAL');
    const askSource = readFileSync(new URL('../src/slices/coach/AskSheet.tsx', import.meta.url), 'utf8');
    expect(askSource).not.toContain('coach.objective');
    expect(askSource).not.toContain('assessment');
  });
});
