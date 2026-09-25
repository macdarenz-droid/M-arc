import { usePalaceFocus } from '@/escobar/palace/focus';
import { useState } from 'preact/hooks';
import { state } from '@/core/store';
import { Button, Card, CommitNumber, Field, Row, Section, Segmented, Sheet } from '@/ui/primitives';
import { showToast } from '@/app/toast';
import { formatLocalStamp } from '@/core/dates';
import { displayToKg, formatLoad, kgToDisplay } from '@/core/units';
import { parseLoad } from '@/core/parse';
import { profileCompleteness, isWeightTypo } from '@/brain/onboarding';
import { GOAL_BY_ID } from '@/data/goals';
import { GoalSheet } from '@/slices/coach/Coach';
import { lastChangeAt, logWeight, setBirthYear, setHeight, setPlannedDays, setSex, setTrainingSince } from './profile';

function updatedHint(at: string | undefined): string {
  return at ? `Updated ${formatLocalStamp(at)}` : 'Not set';
}

export function Profile({ onClose }: { onClose: () => void }) {
  const s = state.value;
  const c = profileCompleteness(s.profile);
  const [goalOpen, setGoalOpen] = useState(false);
  const goal = GOAL_BY_ID[s.goal];
  usePalaceFocus('profile.about');

  return (
    <Sheet title="Your profile" onClose={onClose}>
      <div class="stack">
        <Card class="card-quiet">
          <div class="eyebrow">{c.done} of {c.of} details for the coach</div>
          <p class="small muted" style={{ marginTop: 4 }}>Calories, heart-rate zones, recovery time and strength trends all depend on these once they're connected. Everything stays on this phone.</p>
        </Card>

        <Section title="About you" palace="profile.about">
          <Card class="stack-sm">
            <Field label="Birth year" hint="Unlocks: heart-rate zones, age-adjusted recovery. ">
              <CommitNumber value={s.profile.birthYear} min={1900} max={new Date().getFullYear() - 10} integer onCommit={v => setBirthYear(v)} />
              <span class="hint">{updatedHint(lastChangeAt(s.profileHistory, 'birthYear'))}</span>
            </Field>
            <Field label="Sex" hint="Unlocks: calories, relative-strength comparisons.">
              <Segmented value={s.profile.sex ?? 'male'} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} onChange={v => setSex(v)} />
              <span class="hint">{updatedHint(lastChangeAt(s.profileHistory, 'sex'))}</span>
            </Field>
            <Field label="Height (cm)" hint="Unlocks: calories, body-fat estimate.">
              <CommitNumber value={s.profile.heightCm} min={100} max={250} onCommit={v => setHeight(v)} />
              <span class="hint">{updatedHint(lastChangeAt(s.profileHistory, 'heightCm'))}</span>
            </Field>
          </Card>
        </Section>

        <Section title="Body" palace="profile.weigh-in">
          <Card class="stack-sm">
            <WeighIn />
            <span class="hint">{updatedHint(lastChangeAt(s.profileHistory, 'bodyWeightKg'))} · {s.weightLog.length} weigh-in{s.weightLog.length === 1 ? '' : 's'} logged</span>
          </Card>
        </Section>

        <Section title="Training" palace="profile.training" aside={<Button variant="quiet" size="sm" onClick={() => setGoalOpen(true)}>Change goal</Button>}>
          <Card class="stack-sm">
            <Row trailing={<span class="hint">{goal.name}</span>}><span class="small">Goal</span></Row>
            <Field label="Training since" hint="Unlocks: progress-rate expectations.">
              <div class="row">
                <input type="month" value={s.profile.trainingSince ?? ''} onInput={e => setTrainingSince((e.target as HTMLInputElement).value || undefined)} />
                <Button variant="quiet" size="sm" onClick={() => setTrainingSince(new Date().toISOString().slice(0, 7))}>I'm new</Button>
              </div>
            </Field>
            <Field label="Planned days per week" hint="Pre-fills your weekly schedule.">
              <div class="row"><Button variant="quiet" size="sm" onClick={() => setPlannedDays(Math.max(1, (s.profile.plannedDays ?? 3) - 1))}>−</Button><b class="num small">{s.profile.plannedDays ?? 3}</b><Button variant="quiet" size="sm" onClick={() => setPlannedDays(Math.min(7, (s.profile.plannedDays ?? 3) + 1))}>+</Button></div>
            </Field>
          </Card>
        </Section>
      </div>
      {goalOpen && <GoalSheet onClose={() => setGoalOpen(false)} />}
    </Sheet>
  );
}

/** Body weight is typed and shown in the display unit and stored in kg (UI-18, RG-09). */
function WeighIn() {
  const s = state.value;
  const u = s.preferences.weightUnit;
  const [value, setValue] = useState(s.profile.bodyWeightKg != null ? String(kgToDisplay(s.profile.bodyWeightKg, u)) : '');
  const [confirming, setConfirming] = useState(false);

  const save = () => {
    const typed = parseLoad(value, u);
    if (typed == null || typed <= 0) return;
    const kg = displayToKg(typed, u);
    if (!confirming && isWeightTypo(kg, s.profile.bodyWeightKg)) { setConfirming(true); return; }
    logWeight(kg);
    setConfirming(false);
    showToast('Saved');
  };

  return (
    <Field label={`Body weight (${u})`} hint="Also counts as the load on bodyweight exercises.">
      <div class="row"><input type="text" inputMode="decimal" value={value} onInput={e => { setValue((e.target as HTMLInputElement).value); setConfirming(false); }} /><Button size="sm" onClick={save}>Weigh in</Button></div>
      {confirming && <Card class="card-quiet"><p class="small">That's a big jump from {formatLoad(s.profile.bodyWeightKg, u)}. Save anyway?</p><div class="row" style={{ marginTop: 8 }}><Button variant="quiet" size="sm" onClick={() => setConfirming(false)}>Cancel</Button><Button size="sm" onClick={save}>Save {value} {u}</Button></div></Card>}
    </Field>
  );
}
