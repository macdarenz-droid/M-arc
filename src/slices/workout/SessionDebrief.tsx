import { useState } from 'preact/hooks';
import type { CoachTone, PlanSetTarget } from '@/core/models';
import type { SessionDebrief as SessionDebriefResult } from '@/brain/debrief';
import type { PlanFitResult } from '@/brain/planFit';
import type { PersonalRecord } from '@/brain/prs';
import { PR_LABEL } from '@/brain/prs';
import { planFitCopy } from '@/brain/coach/planFitWords';
import { formatLoad } from '@/core/units';
import { Button, Card, Chip, Section } from '@/ui/primitives';

function targetText(target: PlanSetTarget, unit: 'kg' | 'lb'): string {
  if (target.durationSec !== null) return `${target.durationSec}s`;
  if (target.kg !== null && target.reps !== null) return `${formatLoad(target.kg, unit)} × ${target.reps}`;
  if (target.kg !== null) return formatLoad(target.kg, unit);
  if (target.reps !== null) return `${target.reps} reps`;
  return 'unavailable';
}

const setsLabel = (count: number): string => `${count} ${count === 1 ? 'set' : 'sets'}`;

export function SessionDebrief({ debrief, fit, achievements, tone, unit }: { debrief: SessionDebriefResult; fit: PlanFitResult; achievements: PersonalRecord[]; tone: CoachTone; unit: 'kg' | 'lb' }) {
  const [showAll, setShowAll] = useState(false);
  const [tradeoffs, setTradeoffs] = useState<Set<string>>(() => new Set());
  const shown = showAll ? debrief.exercises : debrief.exercises.slice(0, 3);
  const copy = planFitCopy(fit, tone);
  const toggleTradeoff = (key: string) => setTradeoffs(current => {
    const next = new Set(current);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });

  return (
    <>
    <Section title="Achievement">
      <Card>
        {achievements.length ? (
          <div class="list">{achievements.map((record, index) => (
            <div class="list-row" key={`${record.exerciseId}:${record.kind}:${index}`}>
              <div class="grow"><b class="small">{record.exerciseName}</b><div class="hint">{PR_LABEL[record.kind]} · {record.detail}</div></div>
              <Chip tone="positive">New best</Chip>
            </div>
          ))}</div>
        ) : <p class="small">No new personal record identified from the saved history. This is separate from how the workout fit the plan.</p>}
      </Card>
    </Section>
    <Section title="Plan fit">
      <Card>
        <b>{copy.headline}</b>
        <p class="small" style={{ marginTop: 6 }}>{copy.summary}</p>
        <p class="hint" style={{ marginTop: 6 }}>{fit.expectedRows
          ? `${fit.metRows} of ${fit.expectedRows} expected rows met with comparable evidence.`
          : 'No assessable expected rows were saved.'}</p>
        {!!copy.details.length && <div class="stack-sm" style={{ marginTop: 10 }}>{copy.details.map(detail => <p class="hint" key={detail}>{detail}</p>)}</div>}
      </Card>
    </Section>
    <Section title="Evidence">
      <Card>
        <p class="small">
          {debrief.loggedSets} working {debrief.loggedSets === 1 ? 'set' : 'sets'} logged{debrief.plannedSets !== null ? `; ${setsLabel(debrief.plannedSets)} originally planned.` : '.'}
        </p>
        {!debrief.hasPlan && <p class="hint" style={{ marginTop: 6 }}>Targets were not saved for this session.</p>}
        <div class="list" style={{ marginTop: 10 }}>
          {shown.map((exercise, exerciseIndex) => {
            const key = exercise.planEntryId ?? `actual:${exercise.exerciseId}:${exerciseIndex}`;
            const tradeoffOpen = tradeoffs.has(key);
            const edited = debrief.hasPlan && exercise.targetSource !== 'missing' && exercise.loggedSets > 0
              && exercise.rows.every(row => row.planned === null);
            return (
              <div class="list-row" key={key}>
                <div class="grow stack-sm">
                  <b class="small">{exercise.name}</b>
                  <div class="hint">
                    {exercise.plannedSets === null
                      ? `${setsLabel(exercise.loggedSets)} logged`
                      : `${exercise.loggedSets} of ${exercise.plannedSets} planned ${exercise.plannedSets === 1 ? 'set' : 'sets'}`}
                  </div>
                  {exercise.targetSource === 'starter' && <p class="hint">Starting suggestion, not a target learned from your history.</p>}
                  {edited && <p class="hint">Not comparable after this session was edited.</p>}
                  {!exercise.loggedSets && <p class="hint">{exercise.excluded ? `${exercise.excluded[0]!.toUpperCase()}${exercise.excluded.slice(1)}.` : 'No work logged.'}</p>}
                  {exercise.rows.map(row => {
                    const additional = exercise.plannedSets !== null && row.setNumber > exercise.plannedSets;
                    const unavailable = exercise.targetSource === 'unavailable' || (exercise.targetSource !== 'missing' && !edited && !additional && !row.planned);
                    return <div class="small" key={row.setNumber}>
                      <span class="muted">Set {row.setNumber} · </span>
                      {row.planned
                        ? <>Original target {targetText(row.planned, unit)}; actual {targetText(row.actual, unit)}</>
                        : additional
                          ? <>No original target (additional set); actual {targetText(row.actual, unit)}</>
                          : unavailable
                            ? <>Original target unavailable; actual {targetText(row.actual, unit)}</>
                            : <>Actual {targetText(row.actual, unit)}</>}
                      {row.accepted && <div class="hint">Accepted target {targetText(row.accepted, unit)}</div>}
                    </div>;
                  })}
                  {exercise.tradeoff && (
                    <div class="stack-sm">
                      <p class="hint">Heavier load, fewer reps and less total work than the previous session.</p>
                      <Button size="sm" variant="quiet" aria-expanded={tradeoffOpen} onClick={() => toggleTradeoff(key)}>{tradeoffOpen ? 'Hide comparison' : 'Show comparison'}</Button>
                      {tradeoffOpen && <p class="hint">
                        Previous: {formatLoad(exercise.tradeoff.previousKg, unit)} × {exercise.tradeoff.previousReps}, {formatLoad(exercise.tradeoff.previousVolumeKg, unit)} total. Logged: {formatLoad(exercise.tradeoff.actualKg, unit)} × {exercise.tradeoff.actualReps}, {formatLoad(exercise.tradeoff.actualVolumeKg, unit)} total.
                      </p>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {debrief.exercises.length > 3 && <Button variant="quiet" size="sm" style={{ marginTop: 10 }} onClick={() => setShowAll(value => !value)}>{showAll ? 'Show fewer exercises' : 'Show all exercises'}</Button>}
      </Card>
    </Section>
    </>
  );
}
