import { usePalaceFocus } from '@/escobar/palace/focus';
import { useState } from 'preact/hooks';
import { state } from '@/core/store';
import { Button, Card, Field, Row, Section, Segmented, Sheet } from '@/ui/primitives';
import { showToast } from '@/app/toast';
import { profileCompleteness, isWeightTypo } from '@/brain/onboarding';
import { GOAL_BY_ID } from '@/data/goals';
import { GoalSheet } from '@/slices/coach/Coach';
import { lastChangeAt, logWeight, setBirthYear, setHeight, setPlannedDays, setSex, setTrainingSince } from './profile';

function updatedHint(at: string | undefined): string {
  return at ? `Updated ${at.slice(0, 10)}` : 'Not set';
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
              <input type="number" value={s.profile.birthYear ?? ''} onInput={e => { const v = parseInt((e.target as HTMLInputElement).value, 10); setBirthYear(Number.isFinite(v) ? v : undefined); }} />
              <span class="hint">{updatedHint(lastChangeAt(s.profileHistory, 'birthYear'))}</span>
            </Field>
            <Field label="Sex" hint="Unlocks: calories, relative-strength comparisons.">
              <Segmented value={s.profile.sex ?? 'male'} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} onChange={v => setSex(v)} />
              <span class="hint">{updatedHint(lastChangeAt(s.profileHistory, 'sex'))}</span>
            </Field>
            <Field label="Height (cm)" hint="Unlocks: calories, body-fat estimate.">
              <input type="number" value={s.profile.heightCm ?? ''} onInput={e => { const v = parseFloat((e.target as HTMLInputElement).value); setHeight(Number.isFinite(v) ? v : undefined); }} />
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

function WeighIn() {
  const s = state.value;
  const [value, setValue] = useState(String(s.profile.bodyWeightKg ?? ''));
  const [confirming, setConfirming] = useState(false);

  const save = () => {
    const kg = parseFloat(value);
    if (!Number.isFinite(kg) || kg <= 0) return;
    if (!confirming && isWeightTypo(kg, s.profile.bodyWeightKg)) { setConfirming(true); return; }
    logWeight(kg);
    setConfirming(false);
    showToast('Saved');
  };

  return (
    <Field label="Body weight (kg)">
      <div class="row"><input type="number" value={value} onInput={e => { setValue((e.target as HTMLInputElement).value); setConfirming(false); }} /><Button size="sm" onClick={save}>Weigh in</Button></div>
      {confirming && <Card class="card-quiet"><p class="small">That's a big jump from {s.profile.bodyWeightKg} kg. Save anyway?</p><div class="row" style={{ marginTop: 8 }}><Button variant="quiet" size="sm" onClick={() => setConfirming(false)}>Cancel</Button><Button size="sm" onClick={save}>Save {value} kg</Button></div></Card>}
    </Field>
  );
}
