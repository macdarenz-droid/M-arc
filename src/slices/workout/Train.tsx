import { useEffect, useMemo, useState } from 'preact/hooks';
import { signal } from '@preact/signals';
import { state } from '@/core/store';
import { deload, insights, nowMs, presenceMoment, report, restNext, setTicking, suggestions, today, todayChanges, todayPlan, unit } from '@/app/selectors';
import { Button, Card, Chip, Empty, Field, Row, Section, Sheet, Thinking } from '@/ui/primitives';
import { IconCamera, IconCheck, IconChevronDown, IconDumbbell, IconEdit, IconMafia, IconMinus, IconMore, IconPause, IconPlay, IconPlus, IconTrash, IconTrophy } from '@/ui/icons';
import { dayKey, formatClock, formatDay } from '@/core/dates';
import { formatLoad, kgToDisplay, displayToKg } from '@/core/units';
import { findExercise } from '@/core/exercises';
import { MUSCLES, muscleLabel } from '@/data/muscles';
import { PLAN_MAX_METADATA_SETS, type Exercise, type PlanSetTarget, type Split } from '@/core/models';
import { repRange, suggestNext, previousSet, type Suggestion } from '@/brain/progression';
import { applyDeload, deloadActive as isDeloadActive } from '@/brain/coach/deload';
import { autoregulate, effectiveSetTarget, isReducedTarget, substitutes, warmupRamp, type LiveAdjustment, type RestNext, type RestReasonKind, type Substitute, type WarmupRamp } from '@/brain/live';
import { contextFromState } from '@/brain/coach/context';
import { adjustedRecovery, detectNoteFlags } from '@/brain/coach/detectors';
import { recentPainMuscles } from '@/brain/coach/planners/shared';
import { equipmentGroup } from '@/brain/coach/cues';
import { acceptProposal, dismissProposal, endDeload } from '../coach/apply';
import { ensureDeviceId, remoteEnabled } from '../coach/remote';
import { InsightSheet, SuggestionSheet } from '../coach/Coach';
import { PresenceLauncher } from '../coach/Presence';
import { dismissPresenceMoment } from '../coach/presence';
import { liveRecordFrom, prReach } from '@/brain/prs';
import { exerciseHistory } from '@/brain/history';
import { isWorkingSet, sessionEmphasis } from '@/brain/exposure';
import { requestNoteFlags, noteFlagLabel } from '@/ai/notes';
import { acceptLiveAdjustment, addExerciseToSession, addSet, active, adjustRest, dismissLiveAdjustment, dismissWarmup, stopRest, applySessionNoteFlags, commitSet, discardSession, elapsedSec, finishSession, markDone, pauseSession, regradeRest, removeEntry, removeSet, replaceEntry, restoreEmptyEntry, resumeSession, setSessionNote, setSet, skipEntry, startSession, swapEntryFingerprint, REST_STEP, type FinishSummary } from './session';
import { addExerciseToSplit, addTemplates, createSplit, deleteSplit, moveExercise, removeExerciseFromSplit, renameSplit, setFocus, setSplitSets, MAX_SPLITS } from './splits';
import { ExercisePicker } from './ExercisePicker';
import { ImportProgrammeSheet } from './ImportProgramme';
import { openAsk } from '../coach/askController';
import { pickAndCompressPhoto, type CapturedPhoto } from '@/native/photo';
import { showToast } from '@/app/toast';
import { MuscleMap } from '@/ui/MuscleMap';
import { COACH_NAME } from '@/ui/chatRender';
import { GOALS } from '@/data/goals';
import { effortRepair, sessionDebrief } from '@/brain/debrief';
import { SessionDebrief } from './SessionDebrief';
import { EffortRepair } from './EffortRepair';
import { PrReachHint } from './PrReachHint';
import { sessionNearMisses } from '@/brain/coach/detectors/nearmiss';
import { NearMissNote } from './NearMissNote';

const EFFORTS: Array<{ v: 'easy' | 'ideal' | 'max'; l: string; title: string }> = [
  { v: 'easy', l: 'E', title: 'Easy: 3 or more reps left' },
  { v: 'ideal', l: 'I', title: 'Ideal: 1 to 3 reps left' },
  { v: 'max', l: 'M', title: 'Max: nothing left' },
];

const REST_REASON: Record<RestReasonKind, string> = {
  ungraded: '', base: '',
  easy: 'easy set', max: 'max effort',
  compound: 'a compound lift',
  easy_compound: 'easy set on a compound',
  max_compound: 'max effort on a compound',
  strength_floor: 'strength goal, compound lift',
};

function restNextLine(next: RestNext | null, displayUnit: 'kg' | 'lb'): string {
  if (!next) return '';
  if (next.kind === 'next_exercise') return `Last set · next up: ${next.name}`;
  if (next.kind === 'session_end') return 'Last set · last exercise of the session';
  if (next.durationSec != null) return `Set ${next.setNumber} · ${next.durationSec}s`;
  if (next.kg != null) return next.reps != null ? `Set ${next.setNumber} · ${formatLoad(next.kg, displayUnit)} × ${next.reps}` : `Set ${next.setNumber} · ${formatLoad(next.kg, displayUnit)}`;
  if (next.reps != null) return `Set ${next.setNumber} · ${next.reps} reps`;
  return `Set ${next.setNumber}`;
}

/** A Suggestion's headline target, with kg rendered in the user's unit. */
function fmtTarget(sg: Suggestion, u: 'kg' | 'lb'): string {
  return sg.kg != null && u === 'lb' ? sg.target.replace(`${sg.kg} kg`, formatLoad(sg.kg, u)) : sg.target;
}

function fmtCapturedTarget(target: PlanSetTarget | undefined, u: 'kg' | 'lb'): string {
  if (!target) return 'Target unavailable';
  if (target.durationSec != null) return `Hold ${target.durationSec}s`;
  if (target.kg != null && target.reps != null) return `${formatLoad(target.kg, u)} × ${target.reps} reps`;
  if (target.kg != null) return formatLoad(target.kg, u);
  if (target.reps != null) return `${target.reps} reps`;
  return 'Target unavailable';
}

/** Shown once after a session is saved, then dismissed. */
const lastFinish = signal<FinishSummary | null>(null);

export function Train() {
  const s = state.value;
  const live = s.active;
  if (lastFinish.value) return <FinishScreen summary={lastFinish.value} onClose={() => { lastFinish.value = null; }} />;
  return live ? <LiveSession /> : <Splits />;
}

/* ---------- Split list and editor ---------- */

function Splits() {
  const s = state.value;
  const [selected, setSelected] = useState<string | null>(s.splits[0]?.id ?? null);
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [pickingPhoto, setPickingPhoto] = useState(false);
  const [importPhoto, setImportPhoto] = useState<CapturedPhoto | null>(null);
  const [momentOpen, setMomentOpen] = useState(false);
  const moment = presenceMoment.value;
  const momentInsight = moment?.kind === 'insight' ? insights.value.find(i => `insight:${i.id}` === moment.id) : undefined;
  const momentSuggestion = moment?.kind === 'suggestion' ? suggestions.value.find(sg => `suggestion:${sg.dismissKey}` === moment.id) : undefined;
  const split = s.splits.find(x => x.id === selected) ?? s.splits[0];
  useEffect(() => { if (!split && s.splits[0]) setSelected(s.splits[0].id); }, [s.splits.length]);
  const u = unit.value;

  const startImport = async () => {
    if (pickingPhoto) return;
    setPickingPhoto(true);
    const photo = await pickAndCompressPhoto().catch(() => null);
    setPickingPhoto(false);
    if (photo) setImportPhoto(photo);
  };

  return (
    <div class="view">
      <div class="topbar">
        <div><div class="eyebrow">Train</div><h1>Workouts</h1></div>
        <div class="row">
          {remoteEnabled.value && <Button variant="quiet" size="sm" onClick={openAsk} aria-label={`Ask ${COACH_NAME}`}><IconMafia size={16} aria-hidden={true} /> {COACH_NAME}</Button>}
          {remoteEnabled.value && <Button variant="quiet" size="sm" disabled={pickingPhoto} onClick={startImport}>{pickingPhoto ? <Thinking /> : <><IconCamera size={16} /> Import</>}</Button>}
          <Button variant="quiet" size="sm" onClick={() => setCreating(true)} disabled={s.splits.length >= MAX_SPLITS}><IconPlus size={16} /> Split</Button>
        </div>
      </div>

      {/*
        Its own full-width row below the topbar, not squeezed into the
        compact button row above (matching the "easier week" banner's own
        placement right below): cramming this text-bearing card into a
        narrow flex row alongside icon buttons was the real design flaw
        behind a real, reproduced visual-gate bug — a long cue's nested
        dismiss control in that cramped row made the bottom nav
        unclickable under headless Chromium's mobile+touch emulation. See
        docs/escobar-presence/PROGRESS.md's P02 Train entry for the full
        diagnosis trail. This placement was verified against that exact
        failure with the full five-theme visual gate before shipping.
      */}
      {!remoteEnabled.value && moment && (
        <div style={{ marginBottom: 12 }}>
          <PresenceLauncher moment={moment} label={COACH_NAME} onOpen={() => setMomentOpen(true)} onDismiss={m => dismissPresenceMoment(m)} />
        </div>
      )}

      {deload.value && (
        <div class="banner row-between" role="status" style={{ marginBottom: 12 }}>
          <span>Easier week until {formatDay(deload.value.to)}: targets are about {Math.round(deload.value.loadFactor * 100)}% of your usual, no max sets.</span>
          <Button variant="quiet" size="sm" onClick={() => { endDeload(); showToast('Back to normal targets'); }}>End</Button>
        </div>
      )}

      {!s.splits.length && (
        <Card>
          <Empty icon={<IconDumbbell size={32} />} title="No workouts yet" action={<div class="wrap" style={{ justifyContent: 'center' }}><Button variant="primary" onClick={() => { addTemplates(); }}>Use Push / Pull / Legs</Button><Button onClick={() => setCreating(true)}>Build my own</Button>{remoteEnabled.value && <Button variant="quiet" disabled={pickingPhoto} onClick={startImport}>{pickingPhoto ? <Thinking /> : 'Import from a photo'}</Button>}</div>}>
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
          <Card>
            <div class="row-between">
              <div>
                <h2>{split.name}</h2>
                <span class="hint">{split.exercises.length} exercises · {split.exercises.reduce((a, e) => a + e.sets, 0)} sets{split.focus.length ? ` · focus: ${split.focus.map(muscleLabel).join(', ')}` : ''}</span>
              </div>
              <Button variant="quiet" class="btn-icon" aria-label="Edit split" onClick={() => setEditing(true)}><IconEdit /></Button>
            </div>
            <div class="list" style={{ marginTop: 6 }}>
              {split.exercises.map(se => {
                const ex = findExercise(se.exerciseId, s.customExercises);
                const next = applyDeload(suggestNext(s.sessions, se.exerciseId, s.goal, today.value, se.sets, s.customExercises), deload.value, today.value);
                return (
                  <Row key={se.exerciseId} trailing={<span class="hint num">{se.sets} sets</span>}>
                    <div class="ellipsis">{ex?.name ?? se.exerciseId}</div>
                    <div class="hint ellipsis">{fmtTarget(next, u)} · {next.reason}</div>
                  </Row>
                );
              })}
              {!split.exercises.length && <p class="muted small" style={{ padding: '10px 0' }}>Empty split. Tap edit to add exercises.</p>}
            </div>
            <Button variant="primary" block style={{ marginTop: 12 }} disabled={!split.exercises.length} onClick={() => startSession(split, todayPlan.value?.splitId === split.id ? todayChanges.value : [])}><IconPlay /> Start {split.name}</Button>
          </Card>
          <p class="hint" style={{ marginTop: 10 }}>Targets come from your last sessions and your goal ({GOALS.find(g => g.id === s.goal)?.name}). Change the goal in Coach.</p>
        </>
      )}

      {editing && split && <SplitEditor split={split} onClose={() => setEditing(false)} onDeleted={() => { setEditing(false); setSelected(null); }} />}
      {creating && <CreateSplit onClose={() => setCreating(false)} onCreated={id => { setCreating(false); setSelected(id); setEditing(true); }} />}
      {importPhoto && <ImportProgrammeSheet photo={importPhoto} onClose={() => setImportPhoto(null)} />}
      {momentOpen && momentInsight && <InsightSheet insight={momentInsight} onClose={() => setMomentOpen(false)} />}
      {momentOpen && momentSuggestion && (
        <SuggestionSheet
          suggestion={momentSuggestion}
          onAccept={() => { showToast(acceptProposal(momentSuggestion.proposal, today.value)); setMomentOpen(false); }}
          onDismiss={() => { dismissProposal(momentSuggestion.proposal, today.value, report.value); setMomentOpen(false); }}
          onClose={() => setMomentOpen(false)}
        />
      )}
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
  const split = s.splits.find(x => x.id === a.splitId);
  const [open, setOpen] = useState<number>(a.entries.findIndex(e => !e.done && !e.skipped));
  const [picking, setPicking] = useState<{ mode: 'add' } | { mode: 'replace'; index: number; expected: { startedAt: string; exerciseId: string } } | null>(null);
  const [finishing, setFinishing] = useState(false);
  useEffect(() => { setTicking(true); return () => setTicking(false); }, []);
  const elapsed = elapsedSec(a, nowMs.value);
  const remaining = a.entries.filter(e => !e.done && !e.skipped);
  const done = a.entries.filter(e => e.done).length;
  const ramp = useMemo(() => {
    const targets = new Map<string, PlanSetTarget | null>();
    for (const entry of a.entries) {
      if (!entry.planEntryId || entry.planComparisonValid === false) continue;
      const captured = a.plan?.entries.find(candidate => candidate.id === entry.planEntryId);
      if (captured?.exerciseId === entry.exerciseId) targets.set(captured.id, effectiveSetTarget(captured.targets, entry.targetOverrides, 0));
    }
    return warmupRamp({
      ctx: contextFromState(s, dayKey(new Date(a.startedAt)), Date.now()),
      active: a,
      targets,
    });
  }, [a.entries, a.plan, a.pausedAt, a.warmupDismissed, s.customExercises]);

  return (
    <div class="view">
      <div class="topbar">
        <div><div class="eyebrow">{a.pausedAt ? 'Paused' : 'Live'}</div><h1 class="num">{formatClock(elapsed)}</h1><span class="hint">{split?.name ?? 'Workout'} · {done}/{a.entries.length} done</span></div>
        <div class="row">
          <Button variant="quiet" class="btn-icon" aria-label={a.pausedAt ? 'Resume' : 'Pause'} onClick={() => (a.pausedAt ? resumeSession() : pauseSession())}>{a.pausedAt ? <IconPlay /> : <IconPause />}</Button>
          <Button variant="solid" size="sm" onClick={() => setFinishing(true)}>Finish</Button>
        </div>
      </div>

      <div class="stack">
        {a.entries.map((entry, i) => <EntryCard key={`${entry.exerciseId}-${i}`} index={i} entry={entry} ramp={entry.planEntryId === ramp?.entryId ? ramp : null} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} onDone={() => { markDone(i); const next = a.entries.findIndex((e, j) => j !== i && !e.done && !e.skipped); setOpen(next); }} onRemove={() => { removeEntry(i); setOpen(o => (o === i ? -1 : o > i ? o - 1 : o)); }} onBrowse={expected => setPicking({ mode: 'replace', index: i, expected })} />)}
        <Button onClick={() => setPicking({ mode: 'add' })}><IconPlus size={16} /> Add exercise to this session</Button>
      </div>

      {picking && <ExercisePicker exclude={a.entries.map(e => e.exerciseId)} onClose={() => setPicking(null)} onPick={ex => {
        if (picking.mode === 'replace') {
          const latest = active();
          const slot = latest?.entries[picking.index];
          if (!latest || latest.startedAt !== picking.expected.startedAt || !slot || slot.exerciseId !== picking.expected.exerciseId) {
            showToast('This exercise has changed; open its options again.');
            setPicking(null);
            return;
          }
          const n = slot.sets.filter(isWorkingSet).length;
          const setsFingerprint = swapEntryFingerprint(slot);
          if (n > 0 && !confirm(`Replace ${slot.name}? The ${n} set${n === 1 ? '' : 's'} you logged on it are cleared from this session.`)) { setPicking(null); return; }
          if (!replaceEntry(picking.index, ex, { ...picking.expected, setsFingerprint })) showToast('This exercise has changed or is already in this session');
        } else addExerciseToSession(ex);
        setPicking(null);
      }} />}
      {finishing && (
        <Sheet title={remaining.length ? 'Exercises remaining' : 'Finish session?'} onClose={() => setFinishing(false)}>
          <div class="stack">
            {remaining.length > 0 && <p class="small muted">{remaining.length} exercise{remaining.length > 1 ? 's' : ''} not marked done. Anything with logged sets is still saved. Skipping does not remove them from your split.</p>}
            <div class="grid-3">
              <div class="stat"><b class="num">{formatClock(elapsed)}</b><span>duration</span></div>
              <div class="stat"><b>{a.entries.filter(e => e.sets.some(x => (x.reps ?? 0) > 0 || (x.durationSec ?? 0) > 0)).length}</b><span>exercises</span></div>
              <div class="stat"><b>{a.entries.reduce((n, e) => n + e.sets.filter(x => (x.reps ?? 0) > 0 || (x.durationSec ?? 0) > 0).length, 0)}</b><span>sets</span></div>
            </div>
            <FinishChoice onFinish={saveTemplate => { const r = finishSession(saveTemplate); setFinishing(false); if (r) lastFinish.value = r; }} changed={!!split && split.exercises.map(e => e.exerciseId).join('|') !== a.entries.filter(e => !e.skipped).map(e => e.exerciseId).join('|')} />
            <Button variant="quiet" onClick={() => setFinishing(false)}>Keep going</Button>
            <Button variant="danger" size="sm" onClick={() => { if (confirm('Discard this session? Nothing will be saved.')) { discardSession(); setFinishing(false); } }}>Discard session</Button>
          </div>
        </Sheet>
      )}
    </div>
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

function EntryCard({ index, entry, ramp, open, onToggle, onDone, onRemove, onBrowse }: { index: number; entry: NonNullable<ReturnType<typeof active>>['entries'][number]; ramp: WarmupRamp | null; open: boolean; onToggle: () => void; onDone: () => void; onRemove: () => void; onBrowse: (expected: { startedAt: string; exerciseId: string }) => void }) {
  const s = state.value;
  const u = unit.value;
  const ex: Exercise | undefined = findExercise(entry.exerciseId, s.customExercises);
  const mode = ex?.mode ?? 'weighted';
  const prior = useMemo(
    () => exerciseHistory(s.sessions, entry.exerciseId, s.customExercises),
    [s.sessions, s.customExercises, entry.exerciseId],
  );
  const next = applyDeload(suggestNext(s.sessions, entry.exerciseId, s.goal, today.value, entry.sets.length, s.customExercises), deload.value, today.value);
  const captured = entry.planComparisonValid === false ? undefined : s.active?.plan?.entries.find(planEntry => planEntry.id === entry.planEntryId);
  const headlineTarget = captured ? effectiveSetTarget(captured.targets, entry.targetOverrides, 0) : null;
  const headline = captured ? fmtCapturedTarget(headlineTarget ?? undefined, u) : fmtTarget(next, u);
  const [offer, setOffer] = useState<LiveAdjustment | null>(null);
  const [menu, setMenu] = useState<{ startedAt: string; exerciseId: string } | null>(null);
  const [swap, setSwap] = useState<{ mode: 'any' | 'different_equipment'; rows: Substitute[] } | null>(null);
  const [confirmSwap, setConfirmSwap] = useState<{ sub: Substitute; count: number; fingerprint: string } | null>(null);
  const logged = entry.sets.filter(x => (x.reps ?? 0) > 0 || (x.durationSec ?? 0) > 0).length;
  const isTimed = mode === 'duration';
  const firstUncompleted = entry.sets.findIndex(set => !isWorkingSet(set));
  const activeDeload = !!s.active && (
    isDeloadActive(s.active.plan?.deload, dayKey(new Date(s.active.startedAt)))
    || isDeloadActive(s.coach.deload, today.value)
  );

  const evaluateOffer = (sourceSet: number) => {
    const latest = active();
    const slot = latest?.entries[index];
    const planEntry = latest?.plan?.entries.find(candidate => candidate.id === slot?.planEntryId);
    if (!latest || latest.pausedAt || !slot || !planEntry || slot.exerciseId !== planEntry.exerciseId || slot.done || slot.skipped || slot.sets.length > PLAN_MAX_METADATA_SETS || slot.planComparisonValid === false || planEntry.excluded) { setOffer(null); return; }
    const exercise = findExercise(slot.exerciseId, state.value.customExercises);
    setOffer(autoregulate({
      exercise,
      goal: latest.plan!.goal,
      sets: slot.sets,
      targets: planEntry.targets,
      sourceSet,
      deloadActive: isDeloadActive(latest.plan!.deload, dayKey(new Date(latest.startedAt))) || isDeloadActive(state.value.coach.deload, today.value),
      decisionTaken: !!slot.coachDecision,
      historyBacked: planEntry.targetSource === 'history',
      allowIncrease: planEntry.allowIncrease,
    }));
  };

  const decideOffer = (action: 'accept' | 'dismiss') => {
    if (!offer || !entry.planEntryId || !s.active) return;
    const ok = action === 'accept'
      ? acceptLiveAdjustment(entry.planEntryId, s.active.startedAt, offer)
      : dismissLiveAdjustment(entry.planEntryId, s.active.startedAt, offer);
    setOffer(null);
    if (!ok) showToast('The set changed; review the new target.');
  };

  const hideWarmup = () => {
    if (!s.active || dismissWarmup(s.active.startedAt)) return;
    showToast('This workout changed; review the warm-up again.');
  };

  const closeChanged = () => {
    setConfirmSwap(null);
    setSwap(null);
    setMenu(null);
    showToast('This exercise has changed; open its options again.');
  };
  const currentSlot = () => {
    const latest = active();
    const slot = latest?.entries[index];
    return menu && latest?.startedAt === menu.startedAt && slot?.exerciseId === menu.exerciseId ? { latest, slot } : null;
  };
  // Computed on tap, never in the render body: usageProfile is an O(all logged sets)
  // scan and adjustedRecovery is ~20 ms — both would otherwise run on every keystroke.
  const openSwaps = (m: 'any' | 'different_equipment') => {
    const current = currentSlot();
    if (!current) { closeChanged(); return; }
    const c = contextFromState(state.value, today.value, Date.now());
    const ready = new Map(adjustedRecovery(c).map(r => [r.muscle, r.adjustedPct]));
    const rows = substitutes(c, current.slot.exerciseId, current.slot.sets.length, {
      mode: m,
      exclude: new Set(current.latest.entries.map(e => e.exerciseId)),
      readiness: muscle => ready.get(muscle) ?? 100,
      avoid: recentPainMuscles(detectNoteFlags(c)),
    });
    setSwap({ mode: m, rows });
  };
  const doSwap = (sub: Substitute, confirmedFingerprint?: string) => {
    const current = currentSlot();
    if (!current) { closeChanged(); return; }
    const currentCount = current.slot.sets.filter(isWorkingSet).length;
    const fingerprint = swapEntryFingerprint(current.slot);
    if (currentCount > 0 && confirmedFingerprint === undefined) {
      setConfirmSwap({ sub, count: currentCount, fingerprint });
      return;
    }
    if (confirmedFingerprint !== undefined && fingerprint !== confirmedFingerprint) {
      setConfirmSwap({ sub, count: currentCount, fingerprint });
      showToast('Your logged sets changed; review them before swapping.');
      return;
    }
    const pick = findExercise(sub.exerciseId, state.value.customExercises);
    const original = findExercise(menu!.exerciseId, state.value.customExercises);
    if (!pick || !replaceEntry(index, pick, { ...menu!, setsFingerprint: confirmedFingerprint ?? fingerprint })) {
      showToast('This exercise has changed or is already in this session');
      return;
    }
    const undoable = currentCount === 0 && !!original;
    const swappedSession = current.latest.startedAt;
    setConfirmSwap(null);
    setSwap(null);
    setMenu(null);
    showToast(`Swapped in ${pick.name}`, undoable ? 'Undo' : undefined, undoable ? () => {
      const latest = active();
      const slot = latest?.entries[index];
      if (!latest || latest.startedAt !== swappedSession || !slot || slot.exerciseId !== pick.id || !restoreEmptyEntry(index, original!, { startedAt: swappedSession, exerciseId: pick.id })) {
        showToast('This exercise has changed; Undo is no longer available');
      }
    } : undefined);
  };

  return (
    <Card class={`exercise ${entry.skipped ? 'card-quiet' : ''}`} style={{ opacity: entry.skipped ? .55 : 1 }}>
      <div class="row-between" onClick={onToggle} role="button" aria-expanded={open}>
        <div class="grow">
          <div class="row"><b class="ellipsis">{entry.name}</b>{entry.done && <Chip tone="positive"><IconCheck size={12} /> Done</Chip>}{entry.skipped && <Chip>Skipped</Chip>}</div>
          <div class="hint ellipsis">{headline} · {logged}/{entry.sets.length} sets</div>
        </div>
        <Button variant="quiet" class="btn-icon" aria-label="Options" onClick={e => { e.stopPropagation(); const latest = active(); const slot = latest?.entries[index]; if (latest && slot) setMenu({ startedAt: latest.startedAt, exerciseId: slot.exerciseId }); }}><IconMore /></Button>
        <IconChevronDown style={{ transform: open ? 'rotate(180deg)' : 'none', color: 'var(--text-3)' }} />
      </div>
      {open && (
        <div class="stack-sm" style={{ marginTop: 12 }}>
          <p class="hint">{next.reason}</p>
          {ramp && (
            <div class="stack-sm">
              <p class="hint">Suggested ramp: {ramp.sets.map(step => `${formatLoad(step.kg, u)} × ${step.reps}`).join(' → ')}. Working target {formatLoad(ramp.workingKg, u)}.</p>
              <p class="hint">Use the nearest lighter load your equipment allows. These suggestions are not logged sets.</p>
              <Button size="sm" variant="quiet" onClick={hideWarmup}>Hide warm-up</Button>
            </div>
          )}
          {entry.coachDecision?.action === 'accepted' && <p class="hint positive-text">Target updated for the remaining empty sets.</p>}
          <div class={`set-grid ${isTimed ? 'duration' : ''}`}><span class="set-index">Set</span>{isTimed ? <span class="hint">seconds</span> : <><span class="hint">{u}</span><span class="hint">reps</span></>}<span class="hint">effort</span></div>
          {entry.sets.map((set, j) => {
            const prev = previousSet(s.sessions, entry.exerciseId, j, s.customExercises);
            const fallbackTarget = next.sets[Math.min(j, next.sets.length - 1)];
            const target = (captured ? effectiveSetTarget(captured.targets, entry.targetOverrides, j) : fallbackTarget) ?? null;
            const overridden = !!entry.targetOverrides?.[j];
            const targetNote = captured ? (overridden ? 'Updated target' : captured.targetSource === 'starter' ? 'Starting suggestion' : 'Original target') : fallbackTarget?.note;
            const pr = !isTimed && liveRecordFrom(prior, mode, set);
            const originalTarget = captured ? effectiveSetTarget(captured.targets, undefined, j) : null;
            const rowHasInput = set.kg != null || set.reps != null || set.durationSec != null || set.distanceM != null || set.effort != null;
            const reach = captured && j === firstUncompleted && !rowHasInput && !entry.done && !entry.skipped && !offer
              ? prReach({
                prior,
                mode,
                target,
                repCeiling: repRange(ex, s.goal)[1],
                earlierSets: entry.sets.slice(0, j),
                deloadActive: activeDeload,
                reducedTarget: isReducedTarget(originalTarget, target),
              })
              : null;
            return (
              <div key={j}>
                <div class={`set-grid ${isTimed ? 'duration' : ''}`}>
                  <span class="set-index">{j + 1}</span>
                  {isTimed ? (
                    <input type="number" inputMode="numeric" placeholder={String(target?.durationSec ?? prev?.durationSec ?? '')} value={set.durationSec ?? ''} onInput={e => { setOffer(null); setSet(index, j, { durationSec: parseInt((e.target as HTMLInputElement).value) || undefined }); }} onBlur={() => commitSet(index, j)} />
                  ) : (
                    <>
                      <input type="number" inputMode="decimal" step="0.5" placeholder={target?.kg != null ? String(kgToDisplay(target.kg, u)) : prev?.kg != null ? String(kgToDisplay(prev.kg, u)) : mode === 'bodyweight' ? 'bw' : ''} value={set.kg != null ? kgToDisplay(set.kg, u) : ''} onInput={e => { setOffer(null); const v = parseFloat((e.target as HTMLInputElement).value); setSet(index, j, { kg: Number.isFinite(v) ? displayToKg(v, u) : undefined }); }} />
                      <input type="number" inputMode="numeric" placeholder={String(target?.reps ?? prev?.reps ?? '')} value={set.reps ?? ''} onInput={e => { setOffer(null); setSet(index, j, { reps: parseInt((e.target as HTMLInputElement).value) || undefined }); }} onBlur={() => { if (commitSet(index, j)) evaluateOffer(j); }} />
                    </>
                  )}
                  <div class="effort">{EFFORTS.map(ef => <button type="button" key={ef.v} class={ef.v} title={ef.title} aria-label={ef.title} aria-pressed={set.effort === ef.v} onClick={() => { setOffer(null); setSet(index, j, { effort: set.effort === ef.v ? undefined : ef.v }); regradeRest(index, j); evaluateOffer(j); }}>{ef.l}</button>)}</div>
                </div>
                <div class="row-between" style={{ marginTop: 2 }}>
                  <span class="hint">{prev ? `Last: ${isTimed ? `${prev.durationSec ?? 0}s` : `${formatLoad(prev.kg, u)} × ${prev.reps ?? 0}`}${prev.effort ? ` · ${prev.effort}` : ''}` : targetNote ?? ''}</span>
                  {pr && <span class="pr-badge"><IconTrophy size={12} /> Record</span>}
                </div>
                {reach && <PrReachHint reach={reach} unit={u} />}
                {!s.active?.pausedAt && offer?.sourceSet === j && (
                  <div class="stack-sm" style={{ marginTop: 8 }}>
                    <p class="hint">{offer.reason === 'max_below_target'
                      ? `That set was ${formatLoad(offer.actualKg, u)} × ${offer.actualReps} at max effort.`
                      : 'Those easy sets cleared their targets.'} Use {formatLoad(offer.next.kg!, u)} × {offer.next.reps} for the remaining {offer.remainingSets} empty set{offer.remainingSets === 1 ? '' : 's'}?</p>
                    <div class="wrap"><Button size="sm" variant="solid" onClick={() => decideOffer('accept')}>Use this target</Button><Button size="sm" onClick={() => decideOffer('dismiss')}>Keep my targets</Button></div>
                  </div>
                )}
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
      {menu && !swap && !confirmSwap && (
        <Sheet title={entry.name} onClose={() => setMenu(null)}>
          <div class="stack-sm">
            <Row onClick={() => openSwaps('different_equipment')}>
              <div>Equipment is taken</div>
              <div class="hint">Same muscles, different kit</div>
            </Row>
            <Row onClick={() => openSwaps('any')}>
              <div>Not doing this one today</div>
              <div class="hint">Same muscles, best match from your history</div>
            </Row>
            <Button onClick={() => { if (!currentSlot()) { closeChanged(); return; } skipEntry(index, !entry.skipped); setMenu(null); }}>{entry.skipped ? 'Put back in today' : 'Skip today'}</Button>
            <Button variant="danger" onClick={() => { if (!currentSlot()) { closeChanged(); return; } onRemove(); setMenu(null); }}>Remove from this session</Button>
            {ex && <p class="hint">{ex.equipment} · main: {ex.primary.map(muscleLabel).join(', ')}{ex.secondary.length ? ` · helps: ${ex.secondary.map(muscleLabel).join(', ')}` : ''}</p>}
          </div>
        </Sheet>
      )}
      {menu && swap && !confirmSwap && (
        <Sheet title={`Swap ${entry.name}`} onClose={() => { setSwap(null); setMenu(null); }}>
          <div class="stack-sm">
            <p class="hint">{swap.mode === 'different_equipment' && ex ? `Same muscles, off the ${equipmentGroup(ex.equipment).toLowerCase()}.` : 'Same muscles, ranked by what you already train.'} Targets use your own sessions where available; new exercises show a starting suggestion. Nothing changes until you pick one.</p>
            <div class="list">
              {swap.rows.map(sub => (
                <Row
                  key={sub.exerciseId}
                  onClick={() => doSwap(sub)}
                  trailing={sub.useCount === 0 ? <Chip>New to you</Chip> : sub.target.confidence === 'low' ? <Chip tone="warning">Rough target</Chip> : <Chip>{sub.useCount} session{sub.useCount === 1 ? '' : 's'}</Chip>}
                >
                  <div class="ellipsis">{sub.name}</div>
                  <div class="hint ellipsis">{fmtTarget(sub.target, u)} · {sub.samePattern ? `Same movement, ${sub.sharedPrimary.map(muscleLabel).join(' and ')}` : `Also hits ${sub.sharedPrimary.map(muscleLabel).join(' and ')}`} · {sub.equipment}</div>
                </Row>
              ))}
              {!swap.rows.length && <p class="muted small" style={{ padding: '12px 0' }}>{swap.mode === 'different_equipment' ? 'Nothing on other kit trains the same muscles and is ready today.' : 'No close match right now — everything similar is already in this session or still recovering.'}</p>}
            </div>
            <Row onClick={() => { const expected = menu; setSwap(null); setMenu(null); onBrowse(expected); }}>
              <div>Browse all exercises</div>
              <div class="hint">Search the full library, including your saved exercises.</div>
            </Row>
            <Button variant="quiet" onClick={() => setSwap(null)}>Back</Button>
          </div>
        </Sheet>
      )}
      {menu && confirmSwap && (
        <Sheet title={`Swap ${entry.name}?`} onClose={() => setConfirmSwap(null)}>
          <div class="stack-sm">
            <p class="small">You have {confirmSwap.count} set{confirmSwap.count === 1 ? '' : 's'} logged on {entry.name}. Swapping replaces the card and clears them from this session.</p>
            <div class="grid-2">
              <Button onClick={() => {
                const current = currentSlot();
                if (!current) { closeChanged(); return; }
                const pick = findExercise(confirmSwap.sub.exerciseId, state.value.customExercises);
                if (!pick || current.latest.entries.some(item => item.exerciseId === pick.id)) { showToast('Already in this session'); return; }
                addExerciseToSession(pick);
                setConfirmSwap(null); setSwap(null); setMenu(null);
                showToast(`${pick.name} added below`);
              }}>Keep my sets, add below</Button>
              <Button variant="primary" onClick={() => doSwap(confirmSwap.sub, confirmSwap.fingerprint)}>Swap and clear</Button>
            </div>
            <Button variant="quiet" onClick={() => setConfirmSwap(null)}>Cancel</Button>
          </div>
        </Sheet>
      )}
    </Card>
  );
}

function FinishScreen({ summary, onClose }: { summary: FinishSummary; onClose: () => void }) {
  const sessions = state.value.sessions;
  const custom = state.value.customExercises;
  const fresh = sessions.find(candidate => candidate.id === summary.session.id);
  const session = fresh ?? summary.session;
  const debrief = useMemo(() => fresh ? sessionDebrief(fresh, sessions, custom) : null, [fresh, sessions, custom]);
  const nearMiss = useMemo(() => fresh ? sessionNearMisses(fresh, sessions, custom)[0] ?? null : null, [fresh, sessions, custom]);
  const [repairSessionId, setRepairSessionId] = useState<string | null>(() => fresh && effortRepair(fresh).offer ? fresh.id : null);
  const emphasis = sessionEmphasis(session.exercises, custom).percents;
  const top = (Object.entries(emphasis) as Array<[string, number]>).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const sets = session.exercises.reduce((a, e) => a + e.sets.length, 0);
  const [note, setNote] = useState('');
  const saveNote = async () => {
    const trimmed = note.trim();
    if (!trimmed) return;
    setSessionNote(session.id, trimmed);
    if (!remoteEnabled.value) return;
    const r = await requestNoteFlags(trimmed, { url: state.value.coach.explainerUrl, deviceId: ensureDeviceId() });
    if (r.ok && applySessionNoteFlags(session.id, trimmed, r.flags)) {
      showToast(`Noted: ${r.flags.map(noteFlagLabel).join(', ')}.`);
    }
  };
  return (
    <div class="view">
      <div class="topbar"><div><div class="eyebrow">Session saved</div><h1>{session.splitName} done</h1></div></div>
      <Card class="card-accent">
        <div class="grid-3"><div class="stat"><b class="num">{formatClock(session.durationSec)}</b><span>duration</span></div><div class="stat"><b>{session.exercises.length}</b><span>exercises</span></div><div class="stat"><b>{sets}</b><span>sets</span></div></div>
      </Card>
      {fresh && repairSessionId === fresh.id && <EffortRepair session={fresh} onDone={() => setRepairSessionId(null)} />}
      {debrief && <SessionDebrief debrief={debrief} unit={unit.value} />}
      {nearMiss && <NearMissNote miss={nearMiss} unit={unit.value} />}
      <Section title="Muscles worked today">
        <Card>
          <MuscleMap values={emphasis as never} mode="emphasis" />
          <div class="wrap" style={{ marginTop: 12 }}>{top.map(([m, v]) => <Chip key={m} tone="accent">{muscleLabel(m)} {v}%</Chip>)}</div>
          {sets === 0 && <p class="small muted" style={{ marginTop: 10 }}>No sets were logged, so nothing was added to history.</p>}
        </Card>
      </Section>
      <Section title="Note">
        <Card>
          <Field label="Add a note (optional)" hint="How it felt, soreness, an equipment issue — whatever's useful later.">
            <input value={note} maxLength={280} placeholder="e.g. Left shoulder felt a bit off on presses" onInput={e => setNote((e.target as HTMLInputElement).value)} onBlur={saveNote} />
          </Field>
        </Card>
      </Section>
      <div class="stack-sm" style={{ marginTop: 16 }}><Button variant="primary" onClick={() => { void saveNote(); onClose(); }}>Done</Button></div>
    </div>
  );
}

export function RestBanner() {
  const a = state.value.active;
  useEffect(() => { if (a?.rest) setTicking(true); }, [a?.rest?.endsAt]);
  if (!a?.rest) return null;
  const now = nowMs.value;
  const remaining = a.pausedAt && a.rest.pausedRemainingSec != null ? a.rest.pausedRemainingSec : Math.max(0, Math.round((a.rest.endsAt - now) / 1000));
  const done = remaining <= 0;
  const pct = a.rest.totalSec ? Math.max(0, Math.min(100, 100 - (remaining / a.rest.totalSec) * 100)) : 100;
  const primary = restNextLine(restNext.value, unit.value);
  const base = state.value.preferences.restDefaultSec;
  const honouring = a.rest.gradedSec != null && a.rest.gradedSec === a.rest.totalSec && a.rest.totalSec !== base;
  const reason = honouring && a.rest.reasonKind ? REST_REASON[a.rest.reasonKind] : '';
  const delta = a.rest.deltaSec ?? 0;
  const detail = done
    ? (primary ? 'Rest done.' : 'Rest done. Next set.')
    : `Rest · ${formatClock(a.rest.totalSec)}${reason ? ` · ${delta > 0 ? '+' : '−'}${Math.abs(delta)}s, ${reason}` : ''}`;
  return (
    <div class={`rest ${done ? 'done' : ''}`} role="status">
      <div class="clock">{done ? 'Go' : formatClock(remaining)}</div>
      <div class="grow">
        {primary && <div class="rest-next ellipsis">{primary}</div>}
        <div class="hint ellipsis">{detail}</div>
        <div class="bar" style={{ marginTop: 6 }}><i style={{ width: `${pct}%`, background: done ? 'var(--positive)' : undefined }} /></div>
      </div>
      {!done && <Button variant="quiet" size="sm" aria-label="Less rest" onClick={() => adjustRest(-REST_STEP)}>{`−${REST_STEP}`}</Button>}
      {!done && <Button variant="quiet" size="sm" aria-label="More rest" onClick={() => adjustRest(REST_STEP)}>{`+${REST_STEP}`}</Button>}
      <Button size="sm" onClick={() => stopRest()}>{done ? 'OK' : 'Skip'}</Button>
    </div>
  );
}

