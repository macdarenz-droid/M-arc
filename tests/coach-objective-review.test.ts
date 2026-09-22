import { beforeEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { freshState, type BodyMeasurement, type Exercise, type PersonalObjective, type Session } from '@/core/models';
import { initStore, state, update } from '@/core/store';
import { projectObjectiveReview } from '@/brain/coach/objectiveReview';
import { nowMs, objectiveReview, today } from '@/app/selectors';
import { setPresenceTone } from '@/slices/coach/presenceState';

const memory = () => { const data = new Map<string, string>(); return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => void data.set(key, value), removeItem: (key: string) => void data.delete(key) }; };

const objective = (patch: Partial<PersonalObjective> = {}): PersonalObjective => ({
  version: 1, id: 'objective_one', revision: 1,
  createdAt: '2026-06-01T08:00:00.000Z', updatedAt: '2026-06-01T08:00:00.000Z',
  statement: 'Train steadily and improve my bench.', priorityMuscles: ['chest'], availableWeekdays: [], equipmentNote: '',
  measures: [{ kind: 'consistency' }, { kind: 'lift_trend', exerciseId: 'lib_barbell_bench_press' }, { kind: 'body_trend' }],
  reviewDay: '2026-09-22', ...patch,
});

function session(id: string, day: string, kg = 60): Session {
  return {
    id, splitId: 'push', splitName: 'Push', day,
    startedAt: `${day}T08:00:00.000Z`, endedAt: `${day}T09:00:00.000Z`, durationSec: 3600,
    exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', sets: [{ kg, reps: 5, effort: 'ideal' }] }],
  };
}

const body = (day: string, bodyFatPct: number): BodyMeasurement => ({ day, bodyFatPct, neckCm: 38, waistCm: 82 });
const project = (value: PersonalObjective | undefined, sessions: Session[] = [], readings: BodyMeasurement[] = []) => projectObjectiveReview({ objective: value, sessions, body: readings, custom: [], today: '2026-09-22' });

beforeEach(() => { initStore(memory()); state.value = freshState(); today.value = '2026-09-22'; });

describe('P09 objective evidence projection', () => {
  it('is absent without an agreement and marks fewer than two dated observations unknown', () => {
    expect(project(undefined)).toBeNull();
    const recent = objective({ createdAt: '2026-09-14T08:00:00.000Z', updatedAt: '2026-09-14T08:00:00.000Z' });
    const review = project(recent, [session('one', '2026-09-15')], [body('2026-09-15', 20)]);
    expect(review?.measures.map(measure => [measure.kind, measure.status, measure.observations])).toEqual([
      ['consistency', 'unknown', 1], ['lift_trend', 'unknown', 1], ['body_trend', 'unknown', 1],
    ]);
    expect(review?.measures[1]?.summary).toContain('At least two');
    expect(review?.measures[2]?.limitation).toContain('not direct');
  });

  it('uses dated attendance, lift logs and local tape estimates with sources, windows and limitations', () => {
    const sessions = [
      session('s1', '2026-08-03', 60), session('s2', '2026-08-10', 62.5),
      session('s3', '2026-08-17', 65), session('s4', '2026-08-24', 67.5),
    ];
    const readings = [body('2026-08-01', 22), body('2026-08-10', 21.5), body('2026-08-20', 21), body('2026-09-01', 20.5)];
    const review = project(objective(), sessions, readings)!;
    expect(review.due).toBe(true);
    expect(review.objectiveRevision).toBe(1);
    expect(review.measures.every(measure => !!measure.source && !!measure.window && !!measure.limitation)).toBe(true);
    expect(review.measures.find(measure => measure.kind === 'lift_trend')).toMatchObject({ status: 'up', baselineDay: '2026-08-03', comparisonDay: '2026-08-24', observations: 4 });
    expect(review.measures.find(measure => measure.kind === 'body_trend')).toMatchObject({ status: 'down', baselineDay: '2026-08-01', comparisonDay: '2026-09-01', observations: 4 });
    expect(review.measures.find(measure => measure.kind === 'body_trend')?.source).toContain('Locally saved');
  });

  it('shows a deleted exercise as unavailable without losing the other measures', () => {
    const review = project(objective({ measures: [{ kind: 'lift_trend', exerciseId: 'deleted_lift' }, { kind: 'consistency' }] }))!;
    expect(review.measures[0]).toMatchObject({ status: 'unknown', available: false, observations: 0 });
    expect(review.measures[0]?.label).toContain('Unavailable');
    expect(review.measures[1]?.kind).toBe('consistency');
  });

  it('invalidates evidence identity on revision, value edit or source deletion but not repeated projection', () => {
    const sessions = [session('s1', '2026-08-03', 60), session('s2', '2026-08-10', 62.5), session('s3', '2026-08-17', 65), session('s4', '2026-08-24', 67.5)];
    const first = project(objective(), sessions)!;
    expect(project(objective(), sessions)?.evidenceKey).toBe(first.evidenceKey);
    expect(project(objective({ revision: 2 }), sessions)?.evidenceKey).not.toBe(first.evidenceKey);
    expect(project(objective(), sessions.map(row => row.id === 's4' ? session('s4', row.day, 70) : row))?.evidenceKey).not.toBe(first.evidenceKey);
    expect(project(objective(), sessions.slice(0, -1))?.evidenceKey).not.toBe(first.evidenceKey);
  });

  it('keeps overdue review due and does not invent a result for an unsupported assisted measure', () => {
    const assisted: Exercise = { id: 'custom_assisted', name: 'Assisted pull-up', equipment: 'Machine', primary: ['lats'], secondary: [], stabilizers: [], aliases: [], pattern: 'pull', defaultSets: 3, mode: 'assisted', custom: true };
    const value = objective({ reviewDay: '2020-01-01', measures: [{ kind: 'lift_trend', exerciseId: assisted.id }] });
    const review = projectObjectiveReview({ objective: value, sessions: [], body: [], custom: [assisted], today: '2026-09-22' })!;
    expect(review.due).toBe(true);
    expect(review.measures[0]).toMatchObject({ status: 'unknown', available: false });
    const projectionSource = readFileSync(new URL('../src/brain/coach/objectiveReview.ts', import.meta.url), 'utf8');
    expect(projectionSource).not.toContain('resyncReminders');
    expect(projectionSource).not.toContain('fetch(');
  });
});

describe('objective selector boundaries', () => {
  it('reuses the projection across tone and second-clock changes, then refreshes for evidence', () => {
    const sessions = [session('s1', '2026-08-03', 60), session('s2', '2026-08-10', 62.5), session('s3', '2026-08-17', 65), session('s4', '2026-08-24', 67.5)];
    update(app => ({ ...app, sessions, coach: { ...app.coach, objective: objective() } }));
    const first = objectiveReview.value;
    setPresenceTone('direct');
    expect(objectiveReview.value).toBe(first);
    nowMs.value += 1_000;
    expect(objectiveReview.value).toBe(first);
    update(app => ({ ...app, sessions: app.sessions.map(row => row.id === 's4' ? session('s4', row.day, 70) : row) }));
    expect(objectiveReview.value).not.toBe(first);
    expect(objectiveReview.value?.evidenceKey).not.toBe(first?.evidenceKey);
  });
});
