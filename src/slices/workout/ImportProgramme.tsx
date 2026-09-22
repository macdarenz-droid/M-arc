/**
 * Reviews what /import-programme found in a photo before anything is
 * saved: each day can be renamed, each exercise can be left out, and a
 * day is only ever added as a real split on an explicit tap. An exercise
 * that already matches the library or a saved custom exercise is reused;
 * anything new is created the same way "Scan a photo" creates one, just
 * without a second round trip per exercise.
 */
import { useEffect, useState } from 'preact/hooks';
import { Button, Card, Field, Row, Sheet, Thinking } from '@/ui/primitives';
import { IconCheck } from '@/ui/icons';
import { state } from '@/core/store';
import { findExercise, makeCustomExercise } from '@/core/exercises';
import { newId, type SplitExercise } from '@/core/models';
import type { CapturedPhoto } from '@/native/photo';
import { requestProgrammeImport, type ImportedDay } from '@/ai/importProgramme';
import { ensureDeviceId } from '@/slices/coach/remote';
import { createSplit, saveCustomExercise, MAX_SPLITS } from './splits';
import { showToast } from '@/app/toast';

export function ImportProgrammeSheet({ photo, onClose }: { photo: CapturedPhoto; onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState<ImportedDay[]>([]);
  const [dayNames, setDayNames] = useState<string[]>([]);
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [added, setAdded] = useState<Set<number>>(new Set());

  useEffect(() => {
    let alive = true;
    void (async () => {
      const r = await requestProgrammeImport(photo, { url: state.value.coach.explainerUrl, deviceId: ensureDeviceId() });
      if (!alive) return;
      setLoading(false);
      if (!r.ok) { setError(r.error); return; }
      setDays(r.days);
      setDayNames(r.days.map(d => d.name));
    })();
    return () => { alive = false; };
  }, []);

  const toggle = (di: number, ei: number) => {
    const key = `${di}:${ei}`;
    setExcluded(s => { const next = new Set(s); if (next.has(key)) next.delete(key); else next.add(key); return next; });
  };

  const addDay = (di: number) => {
    const day = days[di];
    if (!day) return;
    const keep = day.exercises.filter((_, ei) => !excluded.has(`${di}:${ei}`));
    if (!keep.length) { showToast('Nothing left to add — every exercise in this day is unchecked.'); return; }
    if (state.value.splits.length >= MAX_SPLITS) { showToast(`You already have the most splits this app supports (${MAX_SPLITS}).`); return; }
    const entries: SplitExercise[] = [];
    for (const ex of keep) {
      const match = findExercise(ex.name, state.value.customExercises);
      if (match) { entries.push({ exerciseId: match.id, sets: ex.sets }); continue; }
      const created = makeCustomExercise({ id: newId('custom'), name: ex.name, equipment: ex.equipment, primary: ex.primary, secondary: ex.secondary, mode: ex.mode });
      saveCustomExercise(created);
      entries.push({ exerciseId: created.id, sets: ex.sets });
    }
    const wanted = dayNames[di]?.trim() || day.name;
    const taken = new Set(state.value.splits.map(sp => sp.name.toLowerCase()));
    let name = wanted;
    for (let n = 2; taken.has(name.toLowerCase()); n++) name = `${wanted} (${n})`;
    createSplit(name, entries);
    setAdded(s => new Set(s).add(di));
    showToast(`Added "${name}"`);
  };

  return (
    <Sheet title="Import from a photo" onClose={onClose}>
      {loading && <div class="stack" style={{ alignItems: 'center', padding: '28px 0' }}><Thinking /></div>}
      {!loading && error && (
        <div class="stack">
          <p class="small muted">{error}</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      )}
      {!loading && !error && (
        <div class="stack">
          <p class="small muted">Review what was found before adding anything. Tap an exercise to leave it out, or edit a day's name. Nothing is saved until you tap "Add".</p>
          {days.map((day, di) => (
            <Card key={di} class="card-quiet">
              <Field label={`Day ${di + 1}`}>
                <input value={dayNames[di] ?? day.name} maxLength={28} onInput={e => setDayNames(n => n.map((v, i) => (i === di ? (e.target as HTMLInputElement).value : v)))} />
              </Field>
              <div class="list" style={{ marginTop: 8 }}>
                {day.exercises.map((ex, ei) => {
                  const on = !excluded.has(`${di}:${ei}`);
                  const matched = findExercise(ex.name, state.value.customExercises);
                  return (
                    <Row key={ei} onClick={() => toggle(di, ei)} trailing={<span class="hint num">{ex.sets} sets</span>}>
                      <div class="row">
                        <span style={{ width: 16, opacity: on ? 1 : 0.3, color: 'var(--accent)' }}>{on && <IconCheck size={16} />}</span>
                        <div class="grow" style={{ opacity: on ? 1 : 0.5 }}>
                          <div class="ellipsis">{matched ? matched.name : ex.name}</div>
                          <div class="hint">{matched ? 'Matched in your library' : 'New custom exercise'}{ex.confidence === 'low' ? ' · double-check this one' : ''}</div>
                        </div>
                      </div>
                    </Row>
                  );
                })}
              </div>
              <Button variant="primary" block style={{ marginTop: 10 }} disabled={added.has(di) || state.value.splits.length >= MAX_SPLITS} onClick={() => addDay(di)}>{added.has(di) ? 'Added' : `Add "${dayNames[di]?.trim() || day.name}" as a split`}</Button>
            </Card>
          ))}
          <Button variant="quiet" onClick={onClose}>Done</Button>
        </div>
      )}
    </Sheet>
  );
}
