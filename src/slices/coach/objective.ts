import { state, update } from '@/core/store';
import {
  MAX_OBJECTIVE_EQUIPMENT_CHARS,
  MAX_OBJECTIVE_MEASURES,
  MAX_OBJECTIVE_MUSCLES,
  MAX_OBJECTIVE_STATEMENT_CHARS,
  WEEKDAYS,
  newId,
  type ObjectiveEvidenceMeasure,
  type PersonalObjective,
  type Weekday,
} from '@/core/models';
import { findExercise } from '@/core/exercises';
import { isMuscleId, type MuscleId } from '@/data/muscles';

export interface ObjectiveDraft {
  statement: string;
  priorityMuscles: MuscleId[];
  availableWeekdays: Weekday[];
  equipmentNote: string;
  measures: ObjectiveEvidenceMeasure[];
  reviewDay: string;
}

export type SaveObjectiveResult = { ok: true; objective: PersonalObjective } | { ok: false; error: string };

const validDay = (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value)
  && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
  && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;

export function draftFromObjective(objective: PersonalObjective | undefined): ObjectiveDraft {
  return {
    statement: objective?.statement ?? '',
    priorityMuscles: [...(objective?.priorityMuscles ?? [])],
    availableWeekdays: [...(objective?.availableWeekdays ?? [])],
    equipmentNote: objective?.equipmentNote ?? '',
    measures: objective?.measures.map(measure => ({ ...measure })) ?? [{ kind: 'consistency' }],
    reviewDay: objective?.reviewDay ?? '',
  };
}

const measureKey = (measure: ObjectiveEvidenceMeasure): string => measure.kind === 'lift_trend' ? `${measure.kind}:${measure.exerciseId}` : measure.kind;

export function saveObjectiveDraft(
  draft: ObjectiveDraft,
  today: string,
  options: { now?: Date; id?: string } = {},
): SaveObjectiveResult {
  const statement = draft.statement.trim();
  if (!statement) return { ok: false, error: 'Describe the direction you want to work towards.' };
  if (statement.length > MAX_OBJECTIVE_STATEMENT_CHARS) return { ok: false, error: `Keep the objective to ${MAX_OBJECTIVE_STATEMENT_CHARS} characters.` };
  if (!draft.priorityMuscles.every(isMuscleId)) return { ok: false, error: 'Choose muscles from the available list.' };
  const priorityMuscles = [...new Set(draft.priorityMuscles)];
  if (priorityMuscles.length > MAX_OBJECTIVE_MUSCLES) return { ok: false, error: `Choose at most ${MAX_OBJECTIVE_MUSCLES} priority muscles.` };
  if (!draft.availableWeekdays.every(day => WEEKDAYS.includes(day))) return { ok: false, error: 'Choose available days from the week shown.' };
  const selectedDays = new Set(draft.availableWeekdays);
  const availableWeekdays = WEEKDAYS.filter(day => selectedDays.has(day));
  const equipmentNote = draft.equipmentNote.trim();
  if (equipmentNote.length > MAX_OBJECTIVE_EQUIPMENT_CHARS) return { ok: false, error: `Keep the equipment note to ${MAX_OBJECTIVE_EQUIPMENT_CHARS} characters.` };
  const measures: ObjectiveEvidenceMeasure[] = [];
  const seen = new Set<string>();
  for (const measure of draft.measures) {
    if (measure.kind !== 'consistency' && measure.kind !== 'body_trend' && measure.kind !== 'lift_trend') return { ok: false, error: 'Choose evidence from the available measures.' };
    if (measure.kind === 'lift_trend' && !measure.exerciseId) return { ok: false, error: 'Choose a lift for lift trend evidence.' };
    const key = measureKey(measure);
    if (!seen.has(key)) { seen.add(key); measures.push(measure.kind === 'lift_trend' ? { kind: 'lift_trend', exerciseId: measure.exerciseId } : { kind: measure.kind }); }
  }
  if (!measures.length || measures.length > MAX_OBJECTIVE_MEASURES) return { ok: false, error: `Choose between 1 and ${MAX_OBJECTIVE_MEASURES} evidence measures.` };
  const current = state.value.coach.objective;
  const priorUnknownIds = new Set(current?.measures.filter(measure => measure.kind === 'lift_trend').map(measure => measure.exerciseId) ?? []);
  for (const measure of measures) if (measure.kind === 'lift_trend'
    && !findExercise(measure.exerciseId, state.value.customExercises) && !priorUnknownIds.has(measure.exerciseId)) {
    return { ok: false, error: 'Choose a lift that is still available.' };
  }
  const reviewDay = draft.reviewDay.trim();
  if (reviewDay && !validDay(reviewDay)) return { ok: false, error: 'Choose a valid review day.' };
  if (reviewDay && reviewDay <= today && reviewDay !== current?.reviewDay) return { ok: false, error: 'Choose a future review day.' };
  const now = options.now ?? new Date();
  const timestamp = new Date(Math.max(now.getTime(), current ? Date.parse(current.updatedAt) : 0, current ? Date.parse(current.createdAt) : 0)).toISOString();
  const objective: PersonalObjective = {
    version: 1,
    id: current?.id ?? options.id ?? newId('objective'),
    revision: (current?.revision ?? 0) + 1,
    createdAt: current?.createdAt ?? timestamp,
    updatedAt: timestamp,
    statement,
    priorityMuscles,
    availableWeekdays,
    equipmentNote: equipmentNote || undefined,
    measures,
    reviewDay: reviewDay || undefined,
  };
  update(app => ({ ...app, coach: { ...app.coach, objective } }));
  return { ok: true, objective };
}

export function removeObjective(): PersonalObjective | null {
  const previous = state.value.coach.objective ?? null;
  if (previous) update(app => ({ ...app, coach: { ...app.coach, objective: undefined } }));
  return previous;
}

export function restoreObjective(objective: PersonalObjective): void {
  if (state.value.coach.objective) return;
  update(app => ({ ...app, coach: { ...app.coach, objective } }));
}
