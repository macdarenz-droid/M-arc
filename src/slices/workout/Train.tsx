import { useEffect, useState } from 'preact/hooks';
import { signal } from '@preact/signals';
import { state } from '@/core/store';
import { nowMs, setTicking, today, unit, todayReadiness, todayCheckIn, recovery as recoverySelector, activeDeload } from '@/app/selectors';
import { saveCheckIn } from '@/slices/readiness/checkIn';
import { Button, Card, Chip, Empty, Field, Row, Section, Sheet, WeightInput } from '@/ui/primitives';
import { IconCheck, IconChevronDown, IconDumbbell, IconEdit, IconMinus, IconMore, IconPause, IconPlay, IconPlus, IconTrash, IconTrophy } from '@/ui/icons';
import { formatClock } from '@/core/dates';
import { formatLoad, formatSetLoad, kgToDisplay } from '@/core/units';
import { findExercise } from '@/core/exercises';
import { MUSCLES, muscleLabel, type MuscleId } from '@/data/muscles';
import type { Exercise, Split } from '@/core/models';
import { suggestNext, previousSet } from '@/brain/progression';
import { isLiveRecord } from '@/brain/prs';
import { sessionEmphasis } from '@/brain/exposure';
import { exerciseHistory } from '@/brain/history';
import { autoregulationSuggestion } from '@/brain/coach/live';
import { pickCue } from '@/brain/coach/cues';
import { addExerciseToSession, addSet, active, adjustRest, stopRest, commitSet, discardSession, elapsedSec, finishSession, logPastSession, markDone, pauseSession, removeEntry, removeSet, resolveSessionTiming, resumeSession, setSet, skipEntry, startSession, substituteEntry, type FinishSummary } from './session';
import { substitutesFor } from '@/brain/substitute';
import { preSessionInsights, warmupSets } from '@/brain/coach/pre';
import { postSessionInsights } from '@/brain/coach/post';
import { INSIGHT_COLOR } from '@/slices/coach/Coach';
import { addExerciseToSplit, addTemplates, createSplit, deleteSplit, moveExercise, removeExerciseFromSplit, renameSplit, setFocus, setSplitSets, MAX_SPLITS } from './splits';
import { ExercisePicker } from './ExercisePicker';
import { showToast } from '@/app/toast';
import { MuscleMap } from '@/ui/MuscleMap';
import { GOALS } from '@/data/goals';
import { watchSupported, watchStatus, latestMeasurement } from '@/native/watch';
import { WatchSheet } from '@/slices/settings/Watch';
import { recentLiveBpms } from './heart';
import { usePalaceFocus } from '@/escobar/palace/focus';
import { activeGymId, addGym, profileFor, setActiveGym, setEquipmentUnit, setExerciseUnit, setGymDefaultUnit, renameGym } from './units';
import { formatLoadable, formatPerSide, inferGym, loadableNear, plateBreakdown } from '@/brain/units';
import { suspectAlternative, unitSuspect } from '@/brain/fidelity';
import { equipmentGroup } from '@/brain/coach/cues';
import type { EquipmentProfile, LoadUnit, LoggedSet } from '@/core/models';
import { restTarget, hrMax, restingHr } from '@/brain/heart';
import { recoveryPctFor } from '@/brain/recovery';

const EFFORTS: Array<{ v: 'easy' | 'ideal' | 'max'; l: string; title: string }> = [
  { v: 'easy', l: 'E', title: 'Easy: 3 or more reps left' },
  { v: 'ideal', l: 'I', title: 'Ideal: 1 to 3 reps left' },
  { v: 'max', l: 'M', title: 'Max: nothing left' },
];

/** Shown once after a session is saved, then dismissed. */
const lastFinish = signal<FinishSummary | null>(null);
/** Set instead of lastFinish when the just-saved session looks logged after training. */
const pendingTimeQuestion = signal<FinishSummary | null>(null);
/** Set when the user taps "Log a past session" from the split list. */
const loggingPast = signal<Split | null>(null);
/** Set when the user taps "Start" — shows the check-in (if not done today) then the pre-session brief before the timer begins. */
const startingSplit = signal<Split | null>(null);
/** "Skip" on the check-in sheet, so it doesn't reappear for the rest of this app session. */
const checkInDismissed = signal(false);

export function Train() {
  const s = state.value;
  const live = s.active;
  if (pendingTimeQuestion.value) return <TimeQuestionSheet summary={pendingTimeQuestion.value} onResolved={r => { pendingTimeQuestion.value = null; lastFinish.value = r; }} />;
  if (lastFinish.value) return <FinishScreen summary={lastFinish.value} onClose={() => { lastFinish.value = null; }} />;
  if (loggingPast.value) return <PastSessionEntry split={loggingPast.value} onClose={() => { loggingPast.value = null; }} onSaved={r => { loggingPast.value = null; lastFinish.value = r; }} />;
  if (startingSplit.value) {
    if (!todayCheckIn.value && !checkInDismissed.value) return <CheckInSheet split={startingSplit.value} onClose={() => { startingSplit.value = null; }} onDone={() => { checkInDismissed.value = true; }} />;
    return <PreSessionSheet split={startingSplit.value} onClose={() => { startingSplit.value = null; }} onStart={() => { startSession(startingSplit.value!); startingSplit.value = null; }} />;
  }
  return live ? <LiveSession /> : <Splits />;
}

/* ---------- Split list and editor ---------- */

let gymInferred = false;

/** A target line in the equipment's own unit when known (§25), else in the display unit. */
function targetText(next: ReturnType<typeof suggestNext>, u: LoadUnit): string {
  if (next.unit) return next.target;
  return next.kg != null && u === 'lb' ? next.target.replace(`${next.kg} kg`, formatLoad(next.kg, u)) : next.target;
}

/** The recent best top load for an exercise, the reference for spotting a kg/lb slip. */
function recentBestKg(sessions: import('@/core/models').Session[], exerciseId: string, custom: Exercise[]): number | null {
  const hist = exerciseHistory(sessions, exerciseId, custom).slice(-3);
  const best = Math.max(0, ...hist.map(h => h.topKg));
  return best > 0 ? best : null;
}

/** Sets the user already answered "No, kg" for, this app session. */
const suspectDismissed = signal<Set<string>>(new Set());

/** "At: Home ▾" → switch, add, rename a gym or set its default unit (§25.2 point 6). */
function GymSheet({ onClose }: { onClose: () => void }) {
  const s = state.value;
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [renaming, setRenaming] = useState<string | null>(null);
  return (
    <Sheet title="Where are you training?" onClose={onClose}>
      <div class="stack">
        <div class="list">
          {s.units.gyms.map(g => (
            <div key={g.id} class="list-row">
              <div class="grow pressable" onClick={() => { setActiveGym(g.id); onClose(); }}>
                {renaming === g.id
                  ? <input value={name} maxLength={28} onClick={e => e.stopPropagation()} onInput={e => setName((e.target as HTMLInputElement).value)} onBlur={() => { renameGym(g.id, name); setRenaming(null); }} />
                  : <div class="row">{g.name}{g.id === s.units.activeGymId && <Chip tone="accent">Here now</Chip>}</div>}
                <div class="hint">Mostly {g.defaultUnit}</div>
              </div>
              <div class="seg" style={{ width: 96 }}>
                <button type="button" aria-pressed={g.defaultUnit === 'kg'} onClick={() => setGymDefaultUnit(g.id, 'kg')}>kg</button>
                <button type="button" aria-pressed={g.defaultUnit === 'lb'} onClick={() => setGymDefaultUnit(g.id, 'lb')}>lb</button>
              </div>
              <Button variant="quiet" class="btn-icon" aria-label={`Rename ${g.name}`} onClick={() => { setRenaming(g.id); setName(g.name); }}><IconEdit size={16} /></Button>
            </div>
          ))}
        </div>
        {!adding ? (
          <Button onClick={() => setAdding(true)} disabled={s.units.gyms.length >= 8}><IconPlus size={16} /> Add a gym</Button>
        ) : (
          <Card class="card-quiet stack-sm">
            <Field label="Name"><input value={name} maxLength={28} placeholder="Work gym" onInput={e => setName((e.target as HTMLInputElement).value)} /></Field>
            <p class="small">Mostly kg or lb here?</p>
            <div class="grid-2">
              <Button onClick={() => { addGym(name || 'Gym', 'kg'); setAdding(false); setName(''); onClose(); }}>kg</Button>
              <Button onClick={() => { addGym(name || 'Gym', 'lb'); setAdding(false); setName(''); onClose(); }}>lb</Button>
            </div>
          </Card>
        )}
        <p class="hint">Each gym remembers which unit each machine and rack uses. Your history keeps one unit for comparing progress.</p>
      </div>
    </Sheet>
  );
}

/** Tap a barbell target → plates per side, in the plates' own unit (§25.2 point 5). */
function PlateSheet({ kg, profile, name, onClose }: { kg: number; profile: EquipmentProfile; name: string; onClose: () => void }) {
  const b = plateBreakdown(kg, profile);
  const u = unit.value;
  const barLabel = profile.unit === 'lb' ? `${kgToDisplay(b.barKg, 'lb')} lb` : `${kgToDisplay(b.barKg, 'kg')} kg`;
  return (
    <Sheet title={`${name}: plates`} onClose={onClose}>
      <div class="stack" data-palace="train.plate-sheet">
        <p class="small">Per side: <b>{formatPerSide(b)}</b> (bar {barLabel})</p>
        <div class="plate-row">{b.perSide.flatMap(p => Array.from({ length: p.count }, (_, i) => <span key={`${p.value}-${i}`} class="plate">{p.value}</span>))}</div>
        <p class="hint">Total {kgToDisplay(b.exactTotalKg, 'kg')} kg · {kgToDisplay(b.exactTotalKg, 'lb')} lb{Math.abs(b.remainderKg) >= 0.05 ? ` · ${formatLoad(Math.abs(b.remainderKg), u)} ${b.remainderKg > 0 ? 'short of' : 'over'} the target` : ''}</p>
      </div>
    </Sheet>
  );
}

function Splits() {
  const s = state.value;
  const [selected, setSelected] = useState<string | null>(s.splits[0]?.id ?? null);
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const split = s.splits.find(x => x.id === selected) ?? s.splits[0];
  useEffect(() => { if (!split && s.splits[0]) setSelected(s.splits[0].id); }, [s.splits.length]);
  const u = unit.value;
  const [gymOpen, setGymOpen] = useState(false);
  const gym = s.units.gyms.find(g => g.id === s.units.activeGymId);
  // Pre-select the gym usually trained at on this weekday and hour, once per app session.
  useEffect(() => {
    if (gymInferred || s.units.gyms.length < 2) return;
    gymInferred = true;
    const guess = inferGym(s.sessions, s.units.gyms, new Date());
    if (guess && guess !== s.units.activeGymId) setActiveGym(guess);
  }, []);

  usePalaceFocus('train.workouts', split ? { splitId: split.id } : undefined);

  return (
    <div class="view">
      <div class="topbar" data-palace="train.workouts">
        <div><div class="eyebrow">Train</div><h1>Workouts</h1></div>
        <Button variant="quiet" size="sm" data-palace="train.new-split" onClick={() => setCreating(true)} disabled={s.splits.length >= MAX_SPLITS}><IconPlus size={16} /> Split</Button>
      </div>
      <div class="row" style={{ marginBottom: 10 }}>
        <button type="button" class="chip chip-btn gym-chip" data-palace="train.gym-chip" aria-label={`Gym: ${gym?.name ?? ''}. Change gym`} onClick={() => setGymOpen(true)}>At: {gym?.name} <IconChevronDown size={14} /></button>
      </div>
      {gymOpen && <GymSheet onClose={() => setGymOpen(false)} />}

      {!s.splits.length && (
        <Card>
          <Empty icon={<IconDumbbell size={32} />} title="No workouts yet" action={<div class="row"><Button variant="primary" onClick={() => { addTemplates(); }}>Use Push / Pull / Legs</Button><Button onClick={() => setCreating(true)}>Build my own</Button></div>}>
            Start from a simple template or build your own split.
          </Empty>
        </Card>
      )}

      {s.splits.length > 0 && (
        <div class="tabs-strip" role="tablist">
          {s.splits.map(sp => <button type="button" key={sp.id} role="tab" class="tab" aria-pressed={sp.id === split?.id} style={{ '--dot': sp.color }} onClick={() => setSelected(sp.id)}><i />{sp.name}</button>)}
        </div>
      )}

      {split && (
        <>
          <Card data-palace="train.split">
            <div class="row-between">
              <div>
                <h2>{split.name}</h2>
                <span class="hint">{split.exercises.length} exercises · {split.exercises.reduce((a, e) => a + e.sets, 0)} sets{split.focus.length ? ` · focus: ${split.focus.map(muscleLabel).join(', ')}` : ''}</span>
              </div>
              <Button variant="quiet" class="btn-icon" aria-label="Edit split" data-palace="train.edit-split" onClick={() => setEditing(true)}><IconEdit /></Button>
            </div>
            <div class="list" style={{ marginTop: 6 }}>
              {split.exercises.map(se => {
                const ex = findExercise(se.exerciseId, s.customExercises);
                const next = suggestNext(s.sessions, se.exerciseId, s.goal, today.value, se.sets, s.customExercises, { readiness: todayReadiness.value, recoveryPct: recoveryPctFor(se.exerciseId, s.customExercises, recoverySelector.value), deload: activeDeload.value, equipment: profileFor(se.exerciseId) });
                return (
                  <Row key={se.exerciseId} trailing={<span class="hint num">{se.sets} sets</span>}>
                    <div class="ellipsis">{ex?.name ?? se.exerciseId}</div>
                    <div class="hint ellipsis">{targetText(next, u)} · {next.reason}</div>
                  </Row>
                );
              })}
              {!split.exercises.length && <p class="muted small" style={{ padding: '10px 0' }}>Empty split. Tap edit to add exercises.</p>}
            </div>
            <Button variant="primary" block style={{ marginTop: 12 }} data-palace="train.start" disabled={!split.exercises.length} onClick={() => { startingSplit.value = split; }}><IconPlay /> Start {split.name}</Button>
            <Button variant="quiet" block data-palace="train.log-past" disabled={!split.exercises.length} onClick={() => { loggingPast.value = split; }}>Log a past session</Button>
          </Card>
          <p class="hint" style={{ marginTop: 10 }}>Targets come from your last sessions and your goal ({GOALS.find(g => g.id === s.goal)?.name}). Change the goal in Coach.</p>
        </>
      )}

      {editing && split && <SplitEditor split={split} onClose={() => setEditing(false)} onDeleted={() => { setEditing(false); setSelected(null); }} />}
      {creating && <CreateSplit onClose={() => setCreating(false)} onCreated={id => { setCreating(false); setSelected(id); setEditing(true); }} />}
    </div>
  );
}

function CreateSplit({ onClose, onCreated }: { onClose: () => void; onCreated: (id: string) => void }) {
  const [name, setName] = useState('');
  return (
    <Sheet title="New split" onClose={onClose}>
      <div class="stack">
        <Field label="Name"><input autofocus value={name} maxLength={28} placeholder="e.g. Upper A" onInput={e => setName((e.target as HTMLInputElement).value)} /></Field>
        <Button variant="primary" disabled={!name.trim()} onClick={() => { const sp = createSplit(name); if (sp) onCreated(sp.id); }}>Create</Button>
        {!state.value.splits.length && <Button variant="quiet" onClick={() => { addTemplates(); onClose(); }}>Or add Push / Pull / Legs templates</Button>}
      </div>
    </Sheet>
  );
}

function SplitEditor({ split, onClose, onDeleted }: { split: Split; onClose: () => void; onDeleted: () => void }) {
  const s = state.value;
  const [picking, setPicking] = useState(false);
  const [name, setName] = useState(split.name);
  const [confirm, setConfirm] = useState(false);
  const fresh = s.splits.find(x => x.id === split.id) ?? split;
  return (
    <Sheet title="Edit split" onClose={onClose}>
      <div class="stack">
        <Field label="Name"><input value={name} maxLength={28} onInput={e => setName((e.target as HTMLInputElement).value)} onBlur={() => renameSplit(split.id, name)} /></Field>
        <div class="list">
          {fresh.exercises.map((se, i) => {
            const ex = findExercise(se.exerciseId, s.customExercises);
            return (
              <div key={se.exerciseId} class="list-row">
                <div class="grow"><div class="ellipsis">{ex?.name ?? se.exerciseId}</div><span class="hint">{ex?.equipment}</span></div>
                <div class="row" style={{ gap: 4 }}>
                  <Button variant="quiet" class="btn-icon" aria-label="Fewer sets" onClick={() => setSplitSets(split.id, se.exerciseId, se.sets - 1)}><IconMinus size={16} /></Button>
                  <span class="num small" style={{ minWidth: 44, textAlign: 'center' }}>{se.sets} sets</span>
                  <Button variant="quiet" class="btn-icon" aria-label="More sets" onClick={() => setSplitSets(split.id, se.exerciseId, se.sets + 1)}><IconPlus size={16} /></Button>
                  <Button variant="quiet" class="btn-icon" aria-label="Move up" disabled={i === 0} onClick={() => moveExercise(split.id, i, i - 1)}><IconChevronDown size={16} style={{ transform: 'rotate(180deg)' }} /></Button>
                  <Button variant="quiet" class="btn-icon" aria-label="Remove" onClick={() => removeExerciseFromSplit(split.id, se.exerciseId)}><IconTrash size={16} /></Button>
                </div>
              </div>
            );
          })}
        </div>
        <Button onClick={() => setPicking(true)}><IconPlus size={16} /> Add exercise</Button>
        <Field label="Focus muscles (optional, up to two)" hint="Tells the coach which muscles you want to bring up. It does not add exercises.">
          <div class="wrap">{MUSCLES.map(m => <Chip key={m.id} pressed={fresh.focus.includes(m.id)} onClick={() => setFocus(split.id, fresh.focus.includes(m.id) ? fresh.focus.filter(x => x !== m.id) : [...fresh.focus, m.id].slice(-2))}>{m.label}</Chip>)}</div>
        </Field>
        {!confirm ? <Button variant="danger" onClick={() => setConfirm(true)}>Delete split</Button>
          : <Card class="card-quiet"><p class="small">Delete {fresh.name}? Your history stays. Only the template goes.</p><div class="row" style={{ marginTop: 10 }}><Button variant="quiet" onClick={() => setConfirm(false)}>Keep</Button><Button variant="danger" onClick={() => { deleteSplit(split.id); onDeleted(); }}>Delete</Button></div></Card>}
      </div>
      {picking && <ExercisePicker exclude={fresh.exercises.map(e => e.exerciseId)} onClose={() => setPicking(false)} onPick={ex => { if (!addExerciseToSplit(split.id, ex)) showToast('Already in this split'); setPicking(false); }} />}
    </Sheet>
  );
}

/* ---------- Live session ---------- */

function LiveSession() {
  const s = state.value;
  const a = active()!;
  usePalaceFocus('train.start', { live: 1, splitId: a.splitId });
  const split = s.splits.find(x => x.id === a.splitId);
  const [open, setOpen] = useState<number>(a.entries.findIndex(e => !e.done && !e.skipped));
  const [picking, setPicking] = useState(false);
  const [finishing, setFinishing] = useState(false);
  useEffect(() => { setTicking(true); return () => setTicking(false); }, []);
  const elapsed = elapsedSec(a, nowMs.value);
  const remaining = a.entries.filter(e => !e.done && !e.skipped);
  const done = a.entries.filter(e => e.done).length;

  return (
    <div class="view">
      <div class="topbar" data-palace="train.start">
        <div><div class="eyebrow">{a.pausedAt ? 'Paused' : 'Live'}</div><h1 class="num">{formatClock(elapsed)}</h1><span class="hint">{split?.name ?? 'Workout'} · {done}/{a.entries.length} done</span></div>
        <div class="row">
          <WatchPill />
          <Button variant="quiet" class="btn-icon" aria-label={a.pausedAt ? 'Resume' : 'Pause'} onClick={() => (a.pausedAt ? resumeSession() : pauseSession())}>{a.pausedAt ? <IconPlay /> : <IconPause />}</Button>
          <Button variant="solid" size="sm" onClick={() => setFinishing(true)}>Finish</Button>
        </div>
      </div>

      <div class="stack">
        {a.entries.map((entry, i) => <EntryCard key={`${entry.exerciseId}-${i}`} index={i} entry={entry} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} onDone={() => { markDone(i); const next = a.entries.findIndex((e, j) => j !== i && !e.done && !e.skipped); setOpen(next); }} />)}
        <Button onClick={() => setPicking(true)}><IconPlus size={16} /> Add exercise to this session</Button>
      </div>

      {picking && <ExercisePicker exclude={a.entries.map(e => e.exerciseId)} onClose={() => setPicking(false)} onPick={ex => { addExerciseToSession(ex); setPicking(false); }} />}
      {finishing && (
        <Sheet title={remaining.length ? 'Exercises remaining' : 'Finish session?'} onClose={() => setFinishing(false)}>
          <div class="stack">
            {remaining.length > 0 && <p class="small muted">{remaining.length} exercise{remaining.length > 1 ? 's' : ''} not marked done. Anything with logged sets is still saved. Skipping does not remove them from your split.</p>}
            <div class="grid-3">
              <div class="stat"><b class="num">{formatClock(elapsed)}</b><span>duration</span></div>
              <div class="stat"><b>{a.entries.filter(e => e.sets.some(x => (x.reps ?? 0) > 0 || (x.durationSec ?? 0) > 0)).length}</b><span>exercises</span></div>
              <div class="stat"><b>{a.entries.reduce((n, e) => n + e.sets.filter(x => (x.reps ?? 0) > 0 || (x.durationSec ?? 0) > 0).length, 0)}</b><span>sets</span></div>
            </div>
            <FinishChoice onFinish={saveTemplate => { const r = finishSession(saveTemplate); setFinishing(false); if (!r) return; if (r.session.logging.flags.includes('compressed')) pendingTimeQuestion.value = r; else lastFinish.value = r; }} changed={!!split && split.exercises.map(e => e.exerciseId).join('|') !== a.entries.filter(e => !e.skipped).map(e => e.exerciseId).join('|')} />
            <Button variant="quiet" onClick={() => setFinishing(false)}>Keep going</Button>
            <Button variant="danger" size="sm" onClick={() => { if (confirm('Discard this session? Nothing will be saved.')) { discardSession(); setFinishing(false); } }}>Discard session</Button>
          </div>
        </Sheet>
      )}
    </div>
  );
}

/** bpm + freshness dot, tap to open the watch sheet (6.5). Hidden entirely on the web, same as haptics. */
function WatchPill() {
  const [open, setOpen] = useState(false);
  if (!watchSupported.value) return null;
  const status = watchStatus.value;
  const bpm = latestMeasurement.value?.bpm;
  const live = status.freshness === 'LIVE';
  return (
    <>
      <button type="button" class="watch-pill" aria-label="Watch" onClick={() => setOpen(true)}>
        <span class={`dot ${live ? 'live' : ''}`} />
        {bpm != null ? `${bpm} bpm` : 'Watch'}
      </button>
      {open && <WatchSheet onClose={() => setOpen(false)} />}
    </>
  );
}

function FinishChoice({ changed, onFinish }: { changed: boolean; onFinish: (saveTemplate: boolean) => void }) {
  if (!changed) return <Button variant="primary" onClick={() => onFinish(false)}><IconCheck /> Finish and save</Button>;
  return (
    <div class="stack-sm">
      <p class="small">You changed the exercises today. Keep the change for future sessions?</p>
      <div class="grid-2"><Button onClick={() => onFinish(false)}>Just today</Button><Button variant="primary" onClick={() => onFinish(true)}>Save for future</Button></div>
    </div>
  );
}

function EntryCard({ index, entry, open, onToggle, onDone }: { index: number; entry: NonNullable<ReturnType<typeof active>>['entries'][number]; open: boolean; onToggle: () => void; onDone: () => void }) {
  const s = state.value;
  const u = unit.value;
  const ex: Exercise | undefined = findExercise(entry.exerciseId, s.customExercises);
  const mode = ex?.mode ?? 'weighted';
  const recoveryPct = recoveryPctFor(entry.exerciseId, s.customExercises, recoverySelector.value);
  const profile = profileFor(entry.exerciseId, s.active?.gymId ?? activeGymId());
  const eu = mode === 'weighted' ? profile.unit : u;
  const next = suggestNext(s.sessions, entry.exerciseId, s.goal, today.value, entry.sets.length, s.customExercises, { readiness: todayReadiness.value, recoveryPct, deload: activeDeload.value, equipment: profile });
  const [menu, setMenu] = useState(false);
  const [plates, setPlates] = useState(false);
  const barbell = !!(profile.plates?.length || profile.barKg) && mode === 'weighted';
  const best = mode === 'weighted' ? recentBestKg(s.sessions, entry.exerciseId, s.customExercises) : null;
  const flip = () => setExerciseUnit(entry.exerciseId, eu === 'kg' ? 'lb' : 'kg');
  const flipGroup = () => { if (ex) { const g = equipmentGroup(ex.equipment); setEquipmentUnit(g, eu === 'kg' ? 'lb' : 'kg'); showToast(`${eu === 'kg' ? 'lb' : 'kg'} for all ${g} here`); } };
  const [subOpen, setSubOpen] = useState(false);
  const logged = entry.sets.filter(x => (x.reps ?? 0) > 0 || (x.durationSec ?? 0) > 0).length;
  const isTimed = mode === 'duration';
  const firstSet = entry.sets[0];
  const firstTarget = next.sets[0];
  const autoreg = ex?.role === 'main' && mode === 'weighted' && firstSet && firstTarget?.kg != null && firstTarget?.reps != null
    ? autoregulationSuggestion({ exerciseId: entry.exerciseId, exerciseName: entry.name, firstSet, targetKg: firstTarget.kg, targetReps: firstTarget.reps, historyCount: exerciseHistory(s.sessions, entry.exerciseId, s.customExercises).length, equipment: profile })
    : null;
  const priorE1rm = ex?.role === 'main' && mode === 'weighted' ? exerciseHistory(s.sessions, entry.exerciseId, s.customExercises).at(-1)?.bestE1rm ?? 0 : 0;
  const warmup = priorE1rm > 0 ? warmupSets(priorE1rm, profile) : null;
  const [warmupOpen, setWarmupOpen] = useState(false);
  /** F3.5: one line, seeded by day + exercise so it rotates day to day, same as Coach's own cue card. */
  const cue = ex ? pickCue(ex, 'coach', `${today.value}|${ex.id}`) : null;

  return (
    <Card class={`exercise ${open && !entry.skipped ? 'active' : ''} ${entry.skipped ? 'card-quiet' : ''}`} style={{ opacity: entry.skipped ? .55 : 1 }}>
      <div class="row-between" onClick={onToggle} role="button" aria-expanded={open}>
        <div class="grow">
          <div class="row"><b class="ellipsis exname">{entry.name}</b>{entry.done && <Chip tone="positive"><IconCheck size={12} /> Done</Chip>}{entry.skipped && <Chip>Skipped</Chip>}</div>
          <div class="hint ellipsis">{barbell && next.kg != null ? <a class="target-link" onClick={e => { e.stopPropagation(); setPlates(true); }}>{targetText(next, u)}</a> : targetText(next, u)} · {logged}/{entry.sets.length} sets</div>
        </div>
        <Button variant="quiet" class="btn-icon" aria-label="Options" onClick={e => { e.stopPropagation(); setMenu(true); }}><IconMore /></Button>
        <IconChevronDown style={{ transform: open ? 'rotate(180deg)' : 'none', color: 'var(--text-3)' }} />
      </div>
      {open && (
        <div class="stack-sm" style={{ marginTop: 12 }}>
          <p class="hint">{next.reason}</p>
          {autoreg && <p class="hint" style={{ color: 'var(--accent)' }}>{autoreg.action}</p>}
          {ex && recoveryPct != null && recoveryPct < 60 && (
            <p class="hint" style={{ color: 'var(--warning)' }}>Still recovering ({recoveryPct}%). <a onClick={() => setSubOpen(true)}>See substitutes</a> or ease off today.</p>
          )}
          {cue && <p class="hint muted">{cue.text}</p>}
          {warmup && (
            <div class="warmup">
              <button type="button" class="btn btn-quiet btn-sm" onClick={() => setWarmupOpen(o => !o)}>{warmupOpen ? 'Hide warm-up' : 'Show warm-up'}</button>
              {warmupOpen && (
                <div class="list" style={{ marginTop: 4 }}>
                  {warmup.map((st, i) => <Row key={i} trailing={<span class="hint num">{formatLoadable(loadableNear(st.kg, profile))} × {st.reps}</span>}><span class="small muted">Warm-up {i + 1}</span></Row>)}
                </div>
              )}
            </div>
          )}
          <div class={`set-grid ${isTimed ? 'duration' : ''}`}><span class="set-index">Set</span>{isTimed ? <span class="hint">seconds</span> : <><span class="hint">{eu}</span><span class="hint">reps</span></>}<span class="hint">effort</span></div>
          {entry.sets.map((set, j) => {
            const prev = previousSet(s.sessions, entry.exerciseId, j, s.customExercises);
            const target = next.sets[Math.min(j, next.sets.length - 1)];
            const pr = !isTimed && isLiveRecord(s.sessions, entry.exerciseId, set, s.customExercises);
            return (
              <div key={j}>
                <div class={`set-grid ${isTimed ? 'duration' : ''}`}>
                  <span class="set-index">{j + 1}</span>
                  {isTimed ? (
                    <input type="number" inputMode="numeric" placeholder={String(target?.durationSec ?? prev?.durationSec ?? '')} value={set.durationSec ?? ''} onInput={e => setSet(index, j, { durationSec: parseInt((e.target as HTMLInputElement).value) || undefined })} onBlur={() => commitSet(index, j)} />
                  ) : (
                    <>
                      <WeightInput kg={set.kg} entered={set.entered} entryUnit={eu} displayUnit={u} placeholder={target?.kg != null ? String(kgToDisplay(target.kg, eu)) : prev?.kg != null ? String(kgToDisplay(prev.kg, eu)) : mode === 'bodyweight' ? 'bw' : ''} onChange={v => setSet(index, j, v ? { kg: v.kg, entered: v.entered } : { kg: undefined, entered: undefined })} onUnitFlip={mode === 'weighted' ? flip : undefined} onUnitLongPress={mode === 'weighted' ? flipGroup : undefined} />
                      <input type="number" inputMode="numeric" placeholder={String(target?.reps ?? prev?.reps ?? '')} value={set.reps ?? ''} onInput={e => setSet(index, j, { reps: parseInt((e.target as HTMLInputElement).value) || undefined })} onBlur={() => commitSet(index, j)} />
                    </>
                  )}
                  <div class="effort">{EFFORTS.map(ef => <button type="button" key={ef.v} class={ef.v} title={ef.title} aria-label={ef.title} aria-pressed={set.effort === ef.v} onClick={() => { setSet(index, j, { effort: set.effort === ef.v ? undefined : ef.v }); }}>{ef.l}</button>)}</div>
                </div>
                <div class="row-between" style={{ marginTop: 2 }}>
                  <span class="hint">{prev ? `Last: ${isTimed ? `${prev.durationSec ?? 0}s` : `${formatSetLoad(prev, eu)} × ${prev.reps ?? 0}`}${prev.effort ? ` · ${prev.effort}` : ''}` : target?.note ?? ''}</span>
                  <span class="row" style={{ gap: 6 }}>
                    {set.heart?.peakBpm != null && <span class="hint">peak {set.heart.peakBpm}</span>}
                    {pr && <span class="pr-badge"><IconTrophy size={12} /> Record</span>}
                  </span>
                </div>
                <SuspectChip set={set} best={best} dismissKey={`${s.active?.startedAt}|${entry.exerciseId}|${j}|${set.kg}`} onFix={alt => { setSet(index, j, { kg: alt.kg, entered: { value: alt.value, unit: alt.unit } }); setExerciseUnit(entry.exerciseId, alt.unit, 'suspect_fix'); }} />
              </div>
            );
          })}
          <div class="row">
            <Button variant="quiet" size="sm" onClick={() => addSet(index)}><IconPlus size={14} /> Set</Button>
            <Button variant="quiet" size="sm" onClick={() => removeSet(index, entry.sets.length - 1)} disabled={entry.sets.length <= 1}><IconMinus size={14} /> Set</Button>
            <span class="grow" />
            <Button variant={entry.done ? 'default' : 'solid'} size="sm" onClick={entry.done ? () => markDone(index, false) : onDone}>{entry.done ? 'Undo done' : 'Done with exercise'}</Button>
          </div>
        </div>
      )}
      {menu && (
        <Sheet title={entry.name} onClose={() => setMenu(false)}>
          <div class="stack-sm">
            <Button onClick={() => { skipEntry(index, !entry.skipped); setMenu(false); }}>{entry.skipped ? 'Put back in today' : 'Skip today'}</Button>
            {ex && <Button variant="quiet" onClick={() => { setMenu(false); setSubOpen(true); }}>Substitute exercise</Button>}
            <Button variant="danger" onClick={() => { removeEntry(index); setMenu(false); }}>Remove from this session</Button>
            {ex && <p class="hint">{ex.equipment} · main: {ex.primary.map(muscleLabel).join(', ')}{ex.secondary.length ? ` · helps: ${ex.secondary.map(muscleLabel).join(', ')}` : ''}</p>}
          </div>
        </Sheet>
      )}
      {plates && next.kg != null && <PlateSheet kg={next.kg} profile={profile} name={entry.name} onClose={() => setPlates(false)} />}
      {subOpen && ex && <SubstituteSheet exercise={ex} custom={s.customExercises} onPick={sub => { substituteEntry(index, sub); setSubOpen(false); }} onClose={() => setSubOpen(false)} />}
    </Card>
  );
}

/** A committed load that looks like a kg/lb slip (§25.2 point 3): one tap converts it and remembers the unit. */
function SuspectChip({ set, best, dismissKey, onFix }: { set: LoggedSet; best: number | null; dismissKey: string; onFix: (alt: { unit: LoadUnit; value: number; kg: number }) => void }) {
  if (!set.at || set.kg == null || !unitSuspect(set.kg, best) || suspectDismissed.value.has(dismissKey)) return null;
  // What was typed, read in the other unit.
  const typed = set.entered?.value ?? set.kg;
  const typedUnit = set.entered?.unit ?? 'kg';
  const altUnit: LoadUnit = typedUnit === 'kg' ? 'lb' : 'kg';
  const alt = set.entered ? { unit: altUnit, value: typed, kg: altUnit === 'lb' ? Math.round(typed * 0.45359237 * 1000) / 1000 : typed } : suspectAlternative(set.kg, best);
  if (!alt) return null;
  const ratio = Math.round((set.kg / best!) * 10) / 10;
  return (
    <div class="suspect-chip" role="status">
      <span class="grow">That's {ratio}× your usual. Was it {alt.value} {alt.unit}?</span>
      <Button size="sm" variant="primary" onClick={() => onFix(alt)}>Yes, {alt.unit}</Button>
      <Button size="sm" variant="quiet" onClick={() => { suspectDismissed.value = new Set([...suspectDismissed.value, dismissKey]); }}>No, {typedUnit}</Button>
    </div>
  );
}

/** F3.7: substitutes sharing the primary muscle, when it is recovering or an insight suggests balance work. */
function SubstituteSheet({ exercise, custom, onPick, onClose }: { exercise: Exercise; custom: Exercise[]; onPick: (ex: Exercise) => void; onClose: () => void }) {
  const subs = substitutesFor(exercise, custom);
  return (
    <Sheet title={`Substitute ${exercise.name}`} onClose={onClose}>
      <div class="list">
        {subs.map(e => (
          <div key={e.id} class="list-row pressable" onClick={() => onPick(e)}>
            <div class="grow">
              <div>{e.name}</div>
              <div class="hint">{e.equipment} · {e.primary.map(muscleLabel).join(', ')}</div>
            </div>
            <span class="chip">Swap</span>
          </div>
        ))}
        {!subs.length && <p class="small muted" style={{ padding: '12px 0' }}>No substitutes with the same primary muscle in the library yet.</p>}
      </div>
    </Sheet>
  );
}

/** "Looks like you logged this after training." Never blocks: Skip files it on the schedule slot or 17:00. */
/** Shown when "Start" is tapped, before the timer begins (6.13 cadence 'pre'). */
const RATING_LABELS = ['1', '2', '3', '4', '5'] as const;

function RatingRow({ value, onChange }: { value: 1 | 2 | 3 | 4 | 5 | undefined; onChange: (v: 1 | 2 | 3 | 4 | 5) => void }) {
  return (
    <div class="row" style={{ gap: 6 }}>
      {RATING_LABELS.map((l, i) => {
        const n = (i + 1) as 1 | 2 | 3 | 4 | 5;
        return <Button key={l} size="sm" variant={value === n ? 'solid' : 'quiet'} onClick={() => onChange(n)}>{l}</Button>;
      })}
    </div>
  );
}

/** F2.2: optional, a few taps — sleep quality, mood, and soreness for today's target muscles. Shown once per day, before the pre-session brief. */
/** The daily check-in. With a split, soreness asks about its muscles; without one (the `checkin` panel), about the least-recovered ones. */
export function CheckInSheet({ split, onClose, onDone }: { split?: Split; onClose: () => void; onDone: () => void }) {
  const s = state.value;
  usePalaceFocus('panel.checkin');
  const muscles = split
    ? [...new Set(split.exercises.flatMap(se => findExercise(se.exerciseId, s.customExercises)?.primary ?? []))].slice(0, 4)
    : recoverySelector.value.filter(r => r.lastTrainedAt).sort((a, b) => a.pct - b.pct).slice(0, 4).map(r => r.muscle);
  const [sleepQuality, setSleepQuality] = useState<1 | 2 | 3 | 4 | 5 | undefined>(undefined);
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5 | undefined>(undefined);
  const [soreness, setSoreness] = useState<Partial<Record<MuscleId, 1 | 2 | 3 | 4 | 5>>>({});
  const save = () => { saveCheckIn(today.value, { sleepQuality, mood, soreness }); onDone(); };
  return (
    <Sheet title="Quick check-in" onClose={onClose} palace="panel.checkin">
      <div class="stack">
        <p class="hint">Feeds today's readiness. Takes a few seconds, skip any time.</p>
        <Field label="Sleep quality"><RatingRow value={sleepQuality} onChange={setSleepQuality} /></Field>
        <Field label="Mood"><RatingRow value={mood} onChange={setMood} /></Field>
        {muscles.map(m => (
          <Field key={m} label={`${muscleLabel(m)} soreness`}><RatingRow value={soreness[m]} onChange={v => setSoreness(cur => ({ ...cur, [m]: v }))} /></Field>
        ))}
        <div class="row"><Button variant="quiet" onClick={onDone}>Skip</Button><Button variant="primary" class="grow" onClick={save}>Save</Button></div>
      </div>
    </Sheet>
  );
}

function PreSessionSheet({ split, onClose, onStart }: { split: Split; onClose: () => void; onStart: () => void }) {
  const s = state.value;
  const age = s.profile.birthYear ? new Date().getFullYear() - s.profile.birthYear : null;
  const items = preSessionInsights({ sessions: s.sessions, custom: s.customExercises, today: today.value, split, profile: s.profile, age });
  return (
    <Sheet title={`Before you start ${split.name}`} onClose={onClose}>
      <div class="stack">
        {items.map(i => (
          <Card key={i.id} class="insight" style={{ '--insight': INSIGHT_COLOR[i.category] }}>
            <b class="small">{i.title}</b>
            <p class="small muted" style={{ marginTop: 4 }}>{i.means}</p>
            <p class="hint" style={{ marginTop: 4 }}>{i.action}</p>
          </Card>
        ))}
        {!items.length && <p class="small muted">Nothing to flag. Have a good session.</p>}
        <Button variant="primary" block onClick={onStart}><IconPlay /> Start {split.name}</Button>
      </div>
    </Sheet>
  );
}

function TimeQuestionSheet({ summary, onResolved }: { summary: FinishSummary; onResolved: (r: FinishSummary) => void }) {
  const s = state.value;
  const medianLiveMinutes = () => {
    const durations = s.sessions.filter(x => x.logging.mode === 'live').map(x => x.durationSec / 60);
    if (!durations.length) return 60;
    const sorted = [...durations].sort((a, b) => a - b);
    return Math.round(sorted[Math.floor(sorted.length / 2)]!);
  };
  const [duration, setDuration] = useState(medianLiveMinutes());
  const guessedTime = s.preferences.reminders.enabled ? s.preferences.reminders.time : '17:00';
  const now = Date.now();
  // Never default to a session that would end in the future: fall back to "ended just now" instead.
  const guessedEndsInFuture = new Date(`${summary.session.day}T${guessedTime}`).getTime() + duration * 60_000 > now;
  const fallbackStart = new Date(now - duration * 60_000);
  const [day, setDay] = useState(guessedEndsInFuture ? fallbackStart.toISOString().slice(0, 10) : summary.session.day);
  const [time, setTime] = useState(guessedEndsInFuture ? fallbackStart.toTimeString().slice(0, 5) : guessedTime);

  const resolve = (timeSource: 'user' | 'schedule' | 'default', overrideDay?: string, overrideTime?: string) => {
    resolveSessionTiming(summary.session.id, `${overrideDay ?? day}T${overrideTime ?? time}`, duration, timeSource);
    const updated = state.value.sessions.find(x => x.id === summary.session.id)!;
    onResolved({ session: updated, changedTemplate: summary.changedTemplate });
  };

  return (
    <Sheet title="When did you train?" onClose={() => resolve('schedule')}>
      <div class="stack">
        <p class="small muted">Looks like you logged this after training. Timing-based advice (rest, density, live heart data) needs to know when it actually happened.</p>
        <div class="grid-2">
          <Field label="Day"><input type="date" value={day} onInput={e => setDay((e.target as HTMLInputElement).value)} /></Field>
          <Field label="Start time"><input type="time" value={time} onInput={e => setTime((e.target as HTMLInputElement).value)} /></Field>
        </div>
        <Field label="Duration (minutes)"><input type="number" value={duration} onInput={e => setDuration(parseInt((e.target as HTMLInputElement).value, 10) || duration)} /></Field>
        <div class="row"><Button variant="quiet" onClick={() => resolve('schedule')}>Skip</Button><Button variant="primary" class="grow" onClick={() => resolve('user')}>Save</Button></div>
        <Button variant="quiet" size="sm" onClick={() => {
          // The session ends now; start is `duration` minutes before that (never a future timestamp).
          const start = new Date(Date.now() - duration * 60_000);
          resolveSessionTiming(summary.session.id, start.toISOString(), duration, 'default');
          onResolved({ session: state.value.sessions.find(x => x.id === summary.session.id)!, changedTemplate: summary.changedTemplate });
        }}>I trained just now</Button>
      </div>
    </Sheet>
  );
}

/** "Log a past session": the split's usual sets, entered without a timer or rest banner. */
function PastSessionEntry({ split, onClose, onSaved }: { split: Split; onClose: () => void; onSaved: (r: FinishSummary) => void }) {
  const s = state.value;
  const u = unit.value;
  const [day, setDay] = useState(today.value);
  const [time, setTime] = useState(() => new Date().toTimeString().slice(0, 5)); // never defaults into the future
  const [duration, setDuration] = useState(60);
  const [entries, setEntries] = useState(() => split.exercises.map(se => {
    const ex = findExercise(se.exerciseId, s.customExercises);
    return { exerciseId: se.exerciseId, name: ex?.name ?? se.exerciseId, sets: Array.from({ length: se.sets }, () => ({}) as import('@/core/models').LoggedSet) };
  }));

  const patchSet = (ei: number, si: number, patch: Partial<import('@/core/models').LoggedSet>) =>
    setEntries(cur => cur.map((e, i) => (i !== ei ? e : { ...e, sets: e.sets.map((st, j) => (j !== si ? st : { ...st, ...patch })) })));

  const save = () => {
    const r = logPastSession({ splitId: split.id, trainedAtLocal: `${day}T${time}`, durationMin: duration, entries });
    if (r) onSaved(r);
  };

  return (
    <Sheet title={`Log ${split.name}`} onClose={onClose}>
      <div class="stack">
        <div class="grid-2">
          <Field label="Day"><input type="date" value={day} onInput={e => setDay((e.target as HTMLInputElement).value)} /></Field>
          <Field label="Start time"><input type="time" value={time} onInput={e => setTime((e.target as HTMLInputElement).value)} /></Field>
        </div>
        <Field label="Duration (minutes)"><input type="number" value={duration} onInput={e => setDuration(parseInt((e.target as HTMLInputElement).value, 10) || duration)} /></Field>
        {entries.map((entry, ei) => (
          <Card key={entry.exerciseId}>
            <b class="small">{entry.name}</b>
            <div class="set-grid" style={{ marginTop: 6 }}><span class="set-index">Set</span><span class="hint">{profileFor(entry.exerciseId).unit}</span><span class="hint">reps</span><span class="hint">effort</span></div>
            {entry.sets.map((set, si) => (
              <div key={si} class="set-grid">
                <span class="set-index">{si + 1}</span>
                <WeightInput kg={set.kg} entered={set.entered} entryUnit={profileFor(entry.exerciseId).unit} displayUnit={u} onChange={v => patchSet(ei, si, v ? { kg: v.kg, entered: v.entered } : { kg: undefined, entered: undefined })} onUnitFlip={() => setExerciseUnit(entry.exerciseId, profileFor(entry.exerciseId).unit === 'kg' ? 'lb' : 'kg')} />
                <input type="number" inputMode="numeric" value={set.reps ?? ''} onInput={e => patchSet(ei, si, { reps: parseInt((e.target as HTMLInputElement).value, 10) || undefined })} />
                <div class="effort">{EFFORTS.map(ef => <button type="button" key={ef.v} class={ef.v} title={ef.title} aria-label={ef.title} aria-pressed={set.effort === ef.v} onClick={() => patchSet(ei, si, { effort: set.effort === ef.v ? undefined : ef.v })}>{ef.l}</button>)}</div>
              </div>
            ))}
            <div class="row">
              <Button variant="quiet" size="sm" onClick={() => setEntries(cur => cur.map((e, i) => (i !== ei ? e : { ...e, sets: [...e.sets, {}] })))}><IconPlus size={14} /> Set</Button>
              <Button variant="quiet" size="sm" onClick={() => setEntries(cur => cur.map((e, i) => (i !== ei ? e : { ...e, sets: e.sets.slice(0, -1) })))} disabled={entry.sets.length <= 1}><IconMinus size={14} /> Set</Button>
            </div>
          </Card>
        ))}
        <Button variant="primary" block onClick={save}>Save past session</Button>
      </div>
    </Sheet>
  );
}

function FinishScreen({ summary, onClose }: { summary: FinishSummary; onClose: () => void }) {
  const { session } = summary;
  const s = state.value;
  const emphasis = sessionEmphasis(session.exercises, s.customExercises).percents;
  const top = (Object.entries(emphasis) as Array<[string, number]>).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const sets = session.exercises.reduce((a, e) => a + e.sets.length, 0);
  const priorSessions = s.sessions.filter(x => x.id !== session.id);
  const debrief = sets > 0 ? postSessionInsights({ session, priorSessions, custom: s.customExercises, isStrengthGoal: s.goal === 'strength' }) : [];
  /** F3.5: a "did you know" cue on the finish screen, for whichever main lift the session actually trained. */
  const learnExercise = findExercise((session.exercises.find(e => findExercise(e.exerciseId, s.customExercises)?.role === 'main') ?? session.exercises[0])?.exerciseId ?? '', s.customExercises);
  const learnCue = learnExercise ? pickCue(learnExercise, 'learn', `${session.day}|${learnExercise.id}`) : null;
  return (
    <div class="view">
      <div class="topbar"><div><div class="eyebrow">Session saved</div><h1>{session.splitName} done</h1></div></div>
      <Card class="card-accent">
        <div class="grid-3"><div class="stat"><b class="num">{formatClock(session.durationSec)}</b><span>duration</span></div><div class="stat"><b>{session.exercises.length}</b><span>exercises</span></div><div class="stat"><b>{sets}</b><span>sets</span></div></div>
      </Card>
      {session.heart && (
        <Section title="Heart">
          <Card>
            <div class="grid-3">
              <div class="stat"><b class="num">{session.heart.avgBpm}</b><span>avg bpm</span></div>
              <div class="stat"><b class="num">{session.heart.maxBpm}</b><span>max bpm</span></div>
              <div class="stat"><b class="num">{session.heart.hrr60Median ?? '—'}</b><span>HRR60</span></div>
            </div>
            <div class="row" style={{ marginTop: 12, gap: 2 }}>
              {session.heart.zoneSec.map((sec, i) => <div key={i} class="grow" style={{ height: 8, borderRadius: 4, background: sec > 0 ? 'var(--accent)' : 'var(--border)', opacity: sec > 0 ? 0.4 + i * 0.15 : 1 }} />)}
            </div>
            {session.heart.energy && (
              <p class="small" style={{ marginTop: 10 }}>About {session.heart.energy.low} to {session.heart.energy.high} kcal active. {session.heart.energy.source === 'heart_rate' ? 'Estimated from heart rate.' : session.heart.energy.source === 'watch_energy' ? 'From your watch.' : 'From Health Connect.'}</p>
            )}
            <p class="hint" style={{ marginTop: 6 }}>Watch was live for {Math.round(session.heart.coverage * 100)}% of the session.</p>
          </Card>
        </Section>
      )}
      {debrief.length > 0 && (
        <Section title="Debrief">
          <div class="stack-sm">
            {debrief.map(i => (
              <Card key={i.id} class="insight" style={{ '--insight': INSIGHT_COLOR[i.category] }}>
                <b class="small">{i.title}</b>
                <p class="small muted" style={{ marginTop: 4 }}>{i.means}</p>
                <p class="hint" style={{ marginTop: 4 }}>{i.action}</p>
              </Card>
            ))}
          </div>
        </Section>
      )}
      {learnCue && (
        <Section title="Worth knowing">
          <Card class="card-quiet"><b class="small">{learnCue.title}</b><p class="small muted" style={{ marginTop: 4 }}>{learnCue.text}</p></Card>
        </Section>
      )}
      <Section title="Muscles worked today">
        <Card>
          <MuscleMap values={emphasis as never} mode="emphasis" />
          <div class="wrap" style={{ marginTop: 12 }}>{top.map(([m, v]) => <Chip key={m} tone="accent">{muscleLabel(m)} {v}%</Chip>)}</div>
          {sets === 0 && <p class="small muted" style={{ marginTop: 10 }}>No sets were logged, so nothing was added to history.</p>}
        </Card>
      </Section>
      <div class="stack-sm" style={{ marginTop: 16 }}><Button variant="primary" onClick={onClose}>Done</Button></div>
    </div>
  );
}

export function RestBanner() {
  const s = state.value;
  const a = s.active;
  useEffect(() => { if (a?.rest) setTicking(true); }, [a?.rest?.endsAt]);
  if (!a?.rest) return null;
  const now = nowMs.value;
  const remaining = a.pausedAt && a.rest.pausedRemainingSec != null ? a.rest.pausedRemainingSec : Math.max(0, Math.round((a.rest.endsAt - now) / 1000));
  const timeDone = remaining <= 0;

  // Heart-guided rest (F1.2): only while the stream is LIVE; a DELAYED/STALE stream falls back to the timer.
  const heartMode = s.preferences.rest.mode === 'heart' && !a.pausedAt && a.rest.preSetBpm != null && watchStatus.value.freshness === 'LIVE';
  let heartReady = false;
  let currentBpm: number | undefined;
  let targetBpm: number | undefined;
  if (heartMode) {
    const restingBpm = restingHr(s.healthDays, s.profile, today.value);
    if (restingBpm != null) {
      const elapsedSec = Math.max(0, a.rest.totalSec - remaining);
      const r = restTarget({ recentBpms: recentLiveBpms(3), preSetBpm: a.rest.preSetBpm!, restingHrBpm: restingBpm, hrMaxBpm: hrMax(s.profile).bpm, effort: a.rest.effort, elapsedSec });
      heartReady = r.ready;
      targetBpm = r.readyBpm;
      currentBpm = latestMeasurement.value?.bpm;
    }
  }
  const done = timeDone || heartReady;
  const pct = a.rest.totalSec ? Math.min(100, 100 - (remaining / a.rest.totalSec) * 100) : 100;
  const showBpm = heartMode && !done && currentBpm != null && targetBpm != null;
  return (
    <div class={`rest ${done ? 'done' : ''}`} role="status">
      <div>
        <div class="clock">{done ? 'Go' : showBpm ? `${currentBpm} → ${targetBpm}` : formatClock(remaining)}</div>
        <div class="hint">{done ? 'Rest done. Next set.' : showBpm ? 'Resting until heart rate settles' : `Rest · ${formatClock(a.rest.totalSec)}`}</div>
      </div>
      <div class="grow"><div class="bar"><i style={{ width: `${pct}%`, background: done ? 'var(--positive)' : undefined }} /></div></div>
      {!done && <Button variant="quiet" size="sm" aria-label="Less rest" onClick={() => adjustRest(-15)}>-15</Button>}
      {!done && <Button variant="quiet" size="sm" aria-label="More rest" onClick={() => adjustRest(15)}>+15</Button>}
      <Button size="sm" onClick={() => stopRest()}>{done ? 'OK' : 'Skip'}</Button>
    </div>
  );
}

