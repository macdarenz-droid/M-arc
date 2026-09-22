import { useState } from 'preact/hooks';
import { Button, Chip, Field, Segmented, Sheet, Thinking } from '@/ui/primitives';
import { IconCamera } from '@/ui/icons';
import { makeCustomExercise, searchExercises } from '@/core/exercises';
import type { Exercise, ResistanceMode } from '@/core/models';
import { MUSCLES, muscleLabel } from '@/data/muscles';
import { state } from '@/core/store';
import { saveCustomExercise } from './splits';
import { requestTagSuggestion } from '@/ai/tagExercise';
import { requestExerciseFromPhoto } from '@/ai/identifyExercise';
import { pickAndCompressPhoto } from '@/native/photo';
import { ensureDeviceId, remoteEnabled } from '@/slices/coach/remote';
import { showToast } from '@/app/toast';

export function ExercisePicker({ onPick, onClose, exclude = [] }: { onPick: (ex: Exercise) => void; onClose: () => void; exclude?: string[] }) {
  const [q, setQ] = useState('');
  const [custom, setCustom] = useState(false);
  const [name, setName] = useState('');
  const [equipment, setEquipment] = useState('Machine');
  const [primary, setPrimary] = useState<string[]>([]);
  const [secondary, setSecondary] = useState<string[]>([]);
  const [mode, setMode] = useState<ResistanceMode>('weighted');
  const [role, setRole] = useState<'main' | 'accessory'>('accessory');
  const [suggesting, setSuggesting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [lowConfidence, setLowConfidence] = useState(false);
  const results = searchExercises(q, state.value.customExercises).filter(e => !exclude.includes(e.id));

  const applySuggestion = (s: { name?: string; equipment: string; mode: ResistanceMode; primary: string[]; secondary: string[]; confidence: 'high' | 'low' }) => {
    if (s.name) setName(s.name);
    setEquipment(s.equipment);
    setMode(s.mode);
    setPrimary(s.primary);
    setSecondary(s.secondary.filter(m => !s.primary.includes(m)));
    setLowConfidence(s.confidence === 'low');
    if (s.confidence === 'low') showToast('Not sure about this one — check the muscles below before saving.');
  };

  const suggest = async () => {
    if (!name.trim() || suggesting) return;
    setSuggesting(true);
    setLowConfidence(false);
    const r = await requestTagSuggestion(name, equipment === 'Other' ? undefined : equipment, { url: state.value.coach.explainerUrl, deviceId: ensureDeviceId() });
    setSuggesting(false);
    if (!r.ok) { showToast(r.error); return; }
    applySuggestion(r.suggestion);
  };

  const scan = async () => {
    if (scanning) return;
    const photo = await pickAndCompressPhoto().catch(() => null);
    if (!photo) return;
    setScanning(true);
    setLowConfidence(false);
    const r = await requestExerciseFromPhoto(photo, equipment === 'Other' ? undefined : equipment, { url: state.value.coach.explainerUrl, deviceId: ensureDeviceId() });
    setScanning(false);
    if (!r.ok) { showToast(r.error); return; }
    applySuggestion(r.suggestion);
  };

  const create = () => {
    if (!name.trim() || !primary.length) return;
    const ex = makeCustomExercise({ name, equipment, primary, secondary, mode, role });
    saveCustomExercise(ex);
    onPick(ex);
  };

  return (
    <Sheet title={custom ? 'New exercise' : 'Add exercise'} onClose={onClose}>
      {!custom ? (
        <div class="stack">
          <input autofocus placeholder="Search, e.g. chest press, lat pulldown" value={q} onInput={e => setQ((e.target as HTMLInputElement).value)} />
          <div class="list">
            {results.map(e => (
              <div key={e.id} class="list-row pressable" onClick={() => onPick(e)}>
                <div class="grow">
                  <div>{e.name}</div>
                  <div class="hint">{e.equipment} · {e.primary.map(muscleLabel).join(', ') || 'custom'}</div>
                </div>
                <span class="chip">Add</span>
              </div>
            ))}
            {!results.length && <p class="muted small" style={{ padding: '12px 0' }}>Nothing matches. You can create it below.</p>}
          </div>
          <Button variant="quiet" onClick={() => { setCustom(true); setName(q); }}>Create a custom exercise</Button>
        </div>
      ) : (
        <div class="stack">
          <Field label="Name"><input value={name} onInput={e => setName((e.target as HTMLInputElement).value)} placeholder="e.g. Cable Y-raise" /></Field>
          {remoteEnabled.value && (
            <div>
              <div class="wrap">
                <Button variant="quiet" size="sm" disabled={!name.trim() || suggesting || scanning} onClick={suggest}>{suggesting ? <Thinking /> : 'Suggest equipment and muscles'}</Button>
                <Button variant="quiet" size="sm" disabled={suggesting || scanning} onClick={scan}>{scanning ? <Thinking /> : <><IconCamera size={16} /> Scan a photo</>}</Button>
              </div>
              <div class="hint" style={{ marginTop: 4 }}>Photograph the equipment or the exercise, not yourself. The photo is sent once to your proxy for this and never saved.</div>
              {lowConfidence && <div class="hint" style={{ color: 'var(--warning)', marginTop: 4 }}>Not sure about this one. Check the muscles below before saving.</div>}
            </div>
          )}
          <Field label="Equipment">
            <select value={equipment} onChange={e => setEquipment((e.target as HTMLSelectElement).value)}>
              {['Machine', 'Cable', 'Dumbbells', 'Barbell', 'Smith Machine', 'Bodyweight', 'Kettlebell', 'Band', 'Other'].map(x => <option key={x}>{x}</option>)}
            </select>
          </Field>
          <Field label="How resistance works" hint="Decides what progress means for this exercise.">
            <select value={mode} onChange={e => setMode((e.target as HTMLSelectElement).value as ResistanceMode)}>
              <option value="weighted">Weighted: more load is progress</option>
              <option value="bodyweight">Bodyweight: more reps is progress</option>
              <option value="assisted">Assisted: less help is progress</option>
              <option value="duration">Timed hold: longer is progress</option>
              <option value="conditioning">Carry or sled: further or longer at the same load</option>
            </select>
          </Field>
          <Field label="Main muscles (pick one or two)">
            <div class="wrap">
              {MUSCLES.map(m => <Chip key={m.id} pressed={primary.includes(m.id)} onClick={() => setPrimary(p => (p.includes(m.id) ? p.filter(x => x !== m.id) : [...p, m.id].slice(-2)))}>{m.label}</Chip>)}
            </div>
          </Field>
          <Field label="Main lift or accessory" hint="Main lifts get your goal's main rep range; accessories get the accessory range.">
            <Segmented value={role} options={[{ value: 'accessory', label: 'Accessory' }, { value: 'main', label: 'Main lift' }]} onChange={setRole} />
          </Field>
          <Field label="Also involves (optional)">
            <div class="wrap">
              {MUSCLES.filter(m => !primary.includes(m.id)).map(m => <Chip key={m.id} pressed={secondary.includes(m.id)} onClick={() => setSecondary(s => (s.includes(m.id) ? s.filter(x => x !== m.id) : [...s, m.id]))}>{m.label}</Chip>)}
            </div>
          </Field>
          <div class="row"><Button variant="quiet" onClick={() => setCustom(false)}>Back</Button><Button variant="primary" class="grow" disabled={!name.trim() || !primary.length} onClick={create}>Create and add</Button></div>
        </div>
      )}
    </Sheet>
  );
}
