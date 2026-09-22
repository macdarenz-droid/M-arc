import { useMemo, useState } from 'preact/hooks';
import { state } from '@/core/store';
import { WEEKDAYS, type ObjectiveEvidenceMeasure, type PersonalObjective, type Weekday } from '@/core/models';
import { LIBRARY, findExercise } from '@/core/exercises';
import { MUSCLES, muscleLabel, type MuscleId } from '@/data/muscles';
import { formatDay, WEEKDAY_LABEL } from '@/core/dates';
import { Button, Card, Chip, Field, Section, Sheet } from '@/ui/primitives';
import { showToast } from '@/app/toast';
import { draftFromObjective, removeObjective, restoreObjective, saveObjectiveDraft, type ObjectiveDraft } from './objective';

const measureKey = (measure: ObjectiveEvidenceMeasure): string => measure.kind === 'lift_trend' ? `${measure.kind}:${measure.exerciseId}` : measure.kind;

function measureLabel(measure: ObjectiveEvidenceMeasure, custom = state.value.customExercises): string {
  if (measure.kind === 'consistency') return 'Training consistency';
  if (measure.kind === 'body_trend') return 'Recorded body trend';
  return findExercise(measure.exerciseId, custom)?.name ?? `Unavailable lift (${measure.exerciseId})`;
}

export function ObjectiveSummary({ objective, onEdit }: { objective: PersonalObjective | undefined; onEdit: () => void }) {
  return (
    <Section title="Your direction" aside={<Button variant="quiet" size="sm" onClick={onEdit}>{objective ? 'Edit' : 'Set'}</Button>}>
      <Card>
        {!objective ? <p class="small muted">Optional. Save what you are working towards and which recorded evidence should be reviewed later.</p> : (
          <div class="stack-sm">
            <b>{objective.statement}</b>
            {!!objective.priorityMuscles.length && <div class="wrap">{objective.priorityMuscles.map(muscle => <Chip key={muscle}>{muscleLabel(muscle)}</Chip>)}</div>}
            <p class="hint">Evidence: {objective.measures.map(measure => measureLabel(measure)).join(' · ')}</p>
            {!!objective.availableWeekdays.length && <p class="hint">Available: {objective.availableWeekdays.map(day => WEEKDAY_LABEL[day]).join(', ')}</p>}
            {objective.equipmentNote && <p class="hint">Equipment note: {objective.equipmentNote}</p>}
            {objective.reviewDay && <p class="hint">Review chosen for {formatDay(objective.reviewDay)}.</p>}
            <p class="hint">Availability and equipment are notes only. They do not change your schedule, splits or targets.</p>
          </div>
        )}
      </Card>
    </Section>
  );
}

export function ObjectiveEditor({ objective, today, onClose }: { objective: PersonalObjective | undefined; today: string; onClose: () => void }) {
  const [draft, setDraft] = useState<ObjectiveDraft>(() => draftFromObjective(objective));
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const exercises = useMemo(() => {
    const all = [...LIBRARY, ...state.value.customExercises];
    const seen = new Set<string>();
    return all.filter(exercise => !seen.has(exercise.id) && !!seen.add(exercise.id)).sort((a, b) => a.name.localeCompare(b.name));
  }, [state.value.customExercises]);
  const lift = draft.measures.find((measure): measure is Extract<ObjectiveEvidenceMeasure, { kind: 'lift_trend' }> => measure.kind === 'lift_trend');
  const has = (kind: ObjectiveEvidenceMeasure['kind']) => draft.measures.some(measure => measure.kind === kind);
  const toggleSimple = (kind: 'consistency' | 'body_trend') => setDraft(current => ({
    ...current,
    measures: has(kind) ? current.measures.filter(measure => measure.kind !== kind) : [...current.measures, { kind }],
  }));
  const toggleMuscle = (muscle: MuscleId) => setDraft(current => ({
    ...current,
    priorityMuscles: current.priorityMuscles.includes(muscle)
      ? current.priorityMuscles.filter(item => item !== muscle)
      : current.priorityMuscles.length < 3 ? [...current.priorityMuscles, muscle] : current.priorityMuscles,
  }));
  const toggleDay = (day: Weekday) => setDraft(current => ({
    ...current,
    availableWeekdays: current.availableWeekdays.includes(day)
      ? current.availableWeekdays.filter(item => item !== day)
      : [...current.availableWeekdays, day],
  }));
  const toggleLift = () => setDraft(current => ({
    ...current,
    measures: lift
      ? current.measures.filter(measure => measure.kind !== 'lift_trend')
      : [...current.measures, { kind: 'lift_trend', exerciseId: exercises[0]?.id ?? '' }],
  }));
  const setLift = (exerciseId: string) => setDraft(current => ({
    ...current,
    measures: current.measures.map(measure => measure.kind === 'lift_trend' ? { kind: 'lift_trend', exerciseId } : measure),
  }));
  const save = () => {
    const result = saveObjectiveDraft(draft, today);
    if (!result.ok) { setError(result.error); return; }
    showToast(objective ? 'Direction updated' : 'Direction saved');
    onClose();
  };
  const remove = () => {
    const previous = removeObjective();
    if (previous) showToast('Direction removed', 'Undo', () => restoreObjective(previous));
    onClose();
  };
  const unavailableLift = lift && !findExercise(lift.exerciseId, state.value.customExercises);

  return (
    <Sheet title={objective ? 'Edit your direction' : 'Set your direction'} onClose={onClose}>
      <div class="stack">
        <Field label="What are you working towards?" hint={`${draft.statement.length}/280 · Your words are stored locally and are not sent to the online coach.`}>
          <textarea rows={4} maxLength={280} value={draft.statement} placeholder="e.g. Build a steady three-day routine and improve my bench press" onInput={event => setDraft(current => ({ ...current, statement: (event.target as HTMLTextAreaElement).value }))} />
        </Field>

        <div class="stack-sm"><span class="small muted">Priority muscles (optional, up to 3)</span><div class="wrap">{MUSCLES.map(muscle => <Chip key={muscle.id} pressed={draft.priorityMuscles.includes(muscle.id)} onClick={() => toggleMuscle(muscle.id)}>{muscle.label}</Chip>)}</div></div>

        <div class="stack-sm"><span class="small muted">Available days (optional)</span><div class="wrap">{WEEKDAYS.map(day => <Chip key={day} pressed={draft.availableWeekdays.includes(day)} onClick={() => toggleDay(day)}>{WEEKDAY_LABEL[day]}</Chip>)}</div><span class="hint">This records availability only; it does not edit your schedule.</span></div>

        <Field label="Equipment note (optional)" hint={`${draft.equipmentNote.length}/120 · This does not change your programme.`}>
          <input maxLength={120} value={draft.equipmentNote} placeholder="e.g. Home dumbbells on weekdays" onInput={event => setDraft(current => ({ ...current, equipmentNote: (event.target as HTMLInputElement).value }))} />
        </Field>

        <div class="stack-sm">
          <span class="small muted">Evidence to review (choose 1–3)</span>
          <div class="wrap">
            <Chip pressed={has('consistency')} onClick={() => toggleSimple('consistency')}>Consistency</Chip>
            <Chip pressed={!!lift} onClick={toggleLift}>Lift trend</Chip>
            <Chip pressed={has('body_trend')} onClick={() => toggleSimple('body_trend')}>Recorded body trend</Chip>
          </div>
          {lift && <Field label="Lift to follow" hint={unavailableLift ? 'This saved lift is no longer available. Choose another to replace it.' : undefined}>
            <select value={lift.exerciseId} onChange={event => setLift((event.target as HTMLSelectElement).value)}>
              {unavailableLift && <option value={lift.exerciseId}>Unavailable · {lift.exerciseId}</option>}
              {exercises.map(exercise => <option key={exercise.id} value={exercise.id}>{exercise.name}</option>)}
            </select>
          </Field>}
        </div>

        <Field label="Review day (optional)" hint="Choose a future day. An overdue saved day stays visible until you edit it.">
          <input type="date" value={draft.reviewDay} onInput={event => setDraft(current => ({ ...current, reviewDay: (event.target as HTMLInputElement).value }))} />
        </Field>

        {error && <p class="small negative-text" role="alert">{error}</p>}
        <Button variant="primary" onClick={save}>Save direction</Button>
        <Button variant="quiet" onClick={onClose}>Cancel</Button>
        {objective && (!confirmDelete
          ? <Button variant="danger" onClick={() => setConfirmDelete(true)}>Remove direction</Button>
          : <div class="row"><Button variant="quiet" onClick={() => setConfirmDelete(false)}>Keep</Button><Button variant="danger" class="grow" onClick={remove}>Yes, remove</Button></div>)}
      </div>
    </Sheet>
  );
}

export function objectiveMeasureKeys(objective: PersonalObjective): string[] {
  return objective.measures.map(measureKey);
}
