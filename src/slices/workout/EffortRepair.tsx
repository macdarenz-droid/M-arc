import type { Session } from '@/core/models';
import { effortCalibration, effortRepair } from '@/brain/debrief';
import { findExercise } from '@/core/exercises';
import { formatLoad } from '@/core/units';
import { unit } from '@/app/selectors';
import { state } from '@/core/store';
import { Button, Card, Section } from '@/ui/primitives';
import { showToast } from '@/app/toast';
import { setSessionEffort } from './session';

function actualText(row: ReturnType<typeof effortRepair>['missing'][number]): string {
  const mode = findExercise(row.exerciseId, state.value.customExercises)?.mode;
  const set = row.actual;
  if (mode === 'duration') return set.durationSec != null ? `${set.durationSec}s` : 'timed set';
  if (mode === 'conditioning') {
    return [set.distanceM != null ? `${set.distanceM} m` : '', set.durationSec != null ? `${set.durationSec}s` : '', set.kg != null ? formatLoad(set.kg, unit.value) : ''].filter(Boolean).join(' · ') || 'conditioning set';
  }
  if (mode === 'bodyweight') return set.reps != null ? `${set.reps} reps` : 'bodyweight set';
  if (set.kg != null) return `${formatLoad(set.kg, unit.value)}${set.reps != null ? ` × ${set.reps}` : ''}`;
  return set.reps != null ? `${set.reps} reps` : 'working set';
}

export function EffortRepair({ session, onDone }: { session: Session; onDone: () => void }) {
  const repair = effortRepair(session);
  const calibration = effortCalibration();
  return (
    <Section title="Rate the sets you remember">
      <Card>
        <p class="small">{repair.missingSets} of {repair.workingSets} working sets have no effort rating.</p>
        <p class="hint" style={{ marginTop: 6 }}>These are rough effort bands. If you cannot remember, leave it unrated.</p>
        <p class="hint">Ratings help Escobar choose future targets.</p>
        <div class="stack-sm" style={{ marginTop: 12 }}>
          {repair.missing.map(row => (
            <Card key={row.fingerprint} class="card-quiet">
              <b class="small">{row.exerciseName} · Set {row.setNumber} · {actualText(row)}</b>
              <div class="wrap" style={{ marginTop: 10 }}>
                {calibration.map(choice => (
                  <Button key={choice.effort} size="sm" class="grow" aria-label={`Rate ${row.exerciseName} set ${row.setNumber} ${choice.label}`} onClick={() => {
                    if (!setSessionEffort(session.id, row.exerciseIndex, row.setIndex, row.fingerprint, choice.effort)) showToast('That set changed. Check it in History.');
                  }}>{choice.label} · {choice.rir[0]}–{choice.rir[1]} reps left</Button>
                ))}
              </div>
            </Card>
          ))}
          {!repair.missing.length && <p class="small muted">All remembered sets are rated.</p>}
        </div>
        <div class="row" style={{ marginTop: 12 }}>
          <Button variant="quiet" onClick={onDone}>Skip for now</Button>
          <Button variant="primary" class="grow" onClick={onDone}>Done</Button>
        </div>
      </Card>
    </Section>
  );
}
