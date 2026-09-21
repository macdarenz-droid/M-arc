/**
 * The live workout. One active session at a time, stored in state so it
 * survives app restarts. All mutations go through `update` so they persist.
 */
import type { ActiveSession, CoachChange, Exercise, LoggedSet, NoteFlag, RestState, Session, Split } from '@/core/models';
import { newId } from '@/core/models';
import { state, update, flushSave } from '@/core/store';
import { findExercise } from '@/core/exercises';
import { isWorkingSet } from '@/brain/exposure';
import { REST_CEIL_SEC, REST_FLOOR_SEC, REST_MIN_REMAINING_SEC } from '@/brain/coach/bands';
import { restFor, type RestGrade } from '@/brain/live';
import { dayKey } from '@/core/dates';
import { cancelRestDone, scheduleRestDone } from '@/native/notifications';
import { haptic } from '@/native/haptics';
import { resyncReminders } from '../settings/reminders';
import { refreshPreferenceFactsIfStale } from '../coach/preferences';
import { contextFromState } from '@/brain/coach/context';
import { capturePlan, capturePlanEntry } from '@/brain/debrief';

/** The step the rest banner's +/- buttons move by. A UI step, not a coaching band. */
export const REST_STEP = 15;
/** Never let a running clock drop below this many seconds on a re-time. */
const MIN_REMAINING_SEC = REST_MIN_REMAINING_SEC;

export function active(): ActiveSession | null { return state.value.active; }

function patchActive(fn: (a: ActiveSession) => ActiveSession): void {
  update(s => (s.active ? { ...s, active: fn(s.active) } : s));
}

/** Start a split. `changes` are one-day swaps or drops from an accepted coach plan; the split itself is untouched. */
export function startSession(split: Split, changes: CoachChange[] = []): void {
  if (state.value.active) return;
  const started = new Date();
  const startedAt = started.toISOString();
  const custom = state.value.customExercises;
  let entries: ActiveSession['entries'] = split.exercises.map(se => {
    const ex = findExercise(se.exerciseId, custom);
    return { exerciseId: se.exerciseId, name: ex?.name ?? se.exerciseId, sets: Array.from({ length: se.sets }, () => ({})), done: false, skipped: false, planEntryId: newId('pe') };
  });
  for (const c of changes) {
    const i = entries.findIndex(e => e.exerciseId === c.removeExerciseId);
    if (i < 0) continue;
    const to = c.replaceWithExerciseId ? findExercise(c.replaceWithExerciseId, custom) : undefined;
    entries = to
      ? entries.map((e, j) => (j !== i ? e : { ...e, exerciseId: to.id, name: to.name }))
      : entries.filter((_, j) => j !== i);
  }
  const ctx = contextFromState(state.value, dayKey(started), started.getTime());
  const plan = capturePlan(ctx, entries.map(entry => ({ id: entry.planEntryId!, exerciseId: entry.exerciseId, name: entry.name, plannedSets: entry.sets.length, origin: 'start' })), startedAt);
  update(s => ({ ...s, active: { splitId: split.id, startedAt, pausedMs: 0, entries, plan } }));
  flushSave();
  void haptic.medium();
}

export function elapsedSec(a: ActiveSession, now = Date.now()): number {
  const paused = a.pausedMs + (a.pausedAt ? now - a.pausedAt : 0);
  return Math.max(0, Math.round((now - new Date(a.startedAt).getTime() - paused) / 1000));
}

export function pauseSession(): void {
  patchActive(a => (a.pausedAt ? a : { ...a, pausedAt: Date.now(), rest: a.rest ? { ...a.rest, pausedRemainingSec: Math.max(0, Math.round((a.rest.endsAt - Date.now()) / 1000)) } : undefined }));
  void cancelRestDone();
}

export function resumeSession(): void {
  patchActive(a => {
    if (!a.pausedAt) return a;
    const rest = a.rest?.pausedRemainingSec != null
      ? { ...a.rest, endsAt: Date.now() + a.rest.pausedRemainingSec * 1000, pausedRemainingSec: undefined }
      : a.rest;
    if (rest) void scheduleRestDone(rest.endsAt);
    return { ...a, pausedMs: a.pausedMs + (Date.now() - a.pausedAt), pausedAt: undefined, rest };
  });
}

export function setSet(entry: number, index: number, patch: Partial<LoggedSet>): void {
  patchActive(a => {
    const entries = a.entries.map((e, i) => i !== entry ? e : { ...e, sets: e.sets.map((s, j) => (j !== index ? s : { ...s, ...patch })) });
    return { ...a, entries };
  });
}

/** Commit a set. Starts the rest timer when auto-rest is on. Returns true if the set counts. */
export function commitSet(entry: number, index: number): boolean {
  const a = active();
  const set = a?.entries[entry]?.sets[index];
  if (!a || !set || !isWorkingSet(set)) return false;
  if (state.value.preferences.autoRest) {
    const grade = gradeFor(a, entry, index);
    startRest(grade.seconds, { entry, set: index, startedAt: a.startedAt, exerciseId: a.entries[entry]!.exerciseId }, grade);
  }
  void haptic.light();
  return true;
}

export function addSet(entry: number): void {
  patchActive(a => ({ ...a, entries: a.entries.map((e, i) => (i !== entry ? e : { ...e, sets: [...e.sets, { ...(e.sets[e.sets.length - 1] ?? {}), effort: undefined }], targetOverrides: undefined })) }));
}

export function removeSet(entry: number, index: number): void {
  patchActive(a => {
    const target = a.entries[entry];
    if (!target?.sets[index] || target.sets.length <= 1) return a;
    return { ...a, entries: a.entries.map((e, i) => (i !== entry ? e : { ...e, sets: e.sets.filter((_, j) => j !== index), targetOverrides: undefined, planComparisonValid: false })), rest: clearRestOwner(a.rest) };
  });
}

export function markDone(entry: number, done = true): void {
  patchActive(a => ({ ...a, entries: a.entries.map((e, i) => (i !== entry ? e : { ...e, done, skipped: false })) }));
  if (done) void haptic.success();
}

export function skipEntry(entry: number, skipped = true): void {
  patchActive(a => a.entries[entry]
    ? {
      ...a,
      entries: a.entries.map((e, i) => (i !== entry ? e : { ...e, skipped, done: false })),
      plan: a.plan ? { ...a.plan, entries: a.plan.entries.map(p => p.id === a.entries[entry]!.planEntryId ? { ...p, excluded: skipped ? 'skipped' : undefined } : p) } : undefined,
      rest: skipped ? clearRestOwner(a.rest) : a.rest,
    }
    : a);
}

export function addExerciseToSession(ex: Exercise, sets = ex.defaultSets): void {
  patchActive(a => {
    if (a.entries.some(e => e.exerciseId === ex.id)) return a;
    const id = newId('pe');
    const entry = { exerciseId: ex.id, name: ex.name, sets: Array.from({ length: sets }, () => ({})), done: false, skipped: false, planEntryId: id };
    const ctx = contextFromState(state.value, dayKey(new Date(a.startedAt)), Date.now());
    const captured = capturePlanEntry(ctx, { id, exerciseId: ex.id, name: ex.name, plannedSets: sets, origin: 'added' });
    return { ...a, entries: [...a.entries, entry], plan: a.plan ? { ...a.plan, entries: [...a.plan.entries, captured] } : undefined };
  });
}

/**
 * Swap one live entry for a different exercise, in place. The card keeps its
 * position and its planned set count, so a mid-session swap does not send the
 * exercise to the bottom of the list. Sets already logged in the slot are
 * cleared — they belong to the exercise that was there — so the caller confirms
 * with the person first when the slot is not empty. Returns false and changes
 * nothing when there is no active session, the index is out of range, or that
 * exercise is already somewhere in this session.
 */
export function replaceEntry(entry: number, ex: Exercise, expected?: { startedAt: string; exerciseId: string }): boolean {
  const a = active();
  if (!a || !a.entries[entry]) return false;
  if (expected && (a.startedAt !== expected.startedAt || a.entries[entry]!.exerciseId !== expected.exerciseId)) return false;
  if (a.entries[entry]!.exerciseId === ex.id) return false;
  if (a.entries.some((e, i) => i !== entry && e.exerciseId === ex.id)) return false;
  patchActive(x => {
    const previous = x.entries[entry]!;
    const id = newId('pe');
    const count = Math.max(1, previous.sets.length);
    const ctx = contextFromState(state.value, dayKey(new Date(x.startedAt)), Date.now());
    const captured = capturePlanEntry(ctx, { id, exerciseId: ex.id, name: ex.name, plannedSets: count, origin: 'replacement', replaces: previous.planEntryId });
    const plan = x.plan ? {
      ...x.plan,
      entries: [...x.plan.entries.map(p => p.id === previous.planEntryId ? { ...p, excluded: 'replaced' as const } : p), captured],
    } : undefined;
    return { ...x, entries: x.entries.map((e, i) => (i !== entry ? e : { exerciseId: ex.id, name: ex.name, sets: Array.from({ length: count }, () => ({})), done: false, skipped: false, planEntryId: id })), plan, rest: clearRestOwner(x.rest) };
  });
  void haptic.medium();
  return true;
}

/** Restore a swapped slot only while it is still the expected empty replacement. */
export function restoreEmptyEntry(entry: number, ex: Exercise, expected: { startedAt: string; exerciseId: string }): boolean {
  const a = active();
  const slot = a?.entries[entry];
  if (!a || !slot || a.startedAt !== expected.startedAt || slot.exerciseId !== expected.exerciseId) return false;
  if (slot.sets.some(set => Object.values(set).some(value => value !== undefined))) return false;
  return replaceEntry(entry, ex, expected);
}

export function removeEntry(entry: number): void {
  patchActive(a => a.entries[entry]
    ? {
      ...a,
      entries: a.entries.filter((_, i) => i !== entry),
      plan: a.plan ? { ...a.plan, entries: a.plan.entries.map(p => p.id === a.entries[entry]!.planEntryId ? { ...p, excluded: 'removed' } : p) } : undefined,
      rest: clearRestOwner(a.rest),
    }
    : a);
}

function clearRestOwner(rest: RestState | undefined): RestState | undefined {
  return rest ? { ...rest, from: undefined, reasonKind: undefined, gradedSec: undefined, deltaSec: undefined } : undefined;
}

/** Grade the rest for one logged set, starting from the person's own default. */
function gradeFor(a: ActiveSession, entry: number, index: number): RestGrade {
  const sessionEntry = a.entries[entry];
  const exercise = sessionEntry ? findExercise(sessionEntry.exerciseId, state.value.customExercises) : undefined;
  return restFor({
    base: state.value.preferences.restDefaultSec,
    effort: sessionEntry?.sets[index]?.effort,
    pattern: exercise?.pattern ?? '',
    mode: exercise?.mode ?? 'weighted',
    goal: state.value.goal,
  });
}

export function startRest(sec: number, from?: RestState['from'], grade?: RestGrade): void {
  const total = Math.max(REST_FLOOR_SEC, Math.min(REST_CEIL_SEC, Math.round(sec)));
  const endsAt = Date.now() + total * 1000;
  patchActive(a => ({ ...a, rest: { endsAt, totalSec: total, from, reasonKind: grade?.reasonKind, gradedSec: grade?.seconds, deltaSec: grade?.deltaSec } }));
  void scheduleRestDone(endsAt);
}

/** Re-time a running rest without restarting it: elapsed time is preserved. */
function retimeRest(totalTargetSec: number, grade?: RestGrade): void {
  const a = active();
  if (!a?.rest) return;
  const paused = a.pausedAt != null && a.rest.pausedRemainingSec != null;
  const previousRemaining = restRemainingSec(a) ?? 0;
  const elapsed = Math.max(0, a.rest.totalSec - previousRemaining);
  if (previousRemaining <= 0) return;
  const floorRemaining = Math.min(MIN_REMAINING_SEC, REST_CEIL_SEC - elapsed);
  const total = Math.max(elapsed + floorRemaining, Math.min(REST_CEIL_SEC, Math.round(totalTargetSec)));
  const remaining = total - elapsed;
  const endsAt = Date.now() + remaining * 1000;
  patchActive(current => {
    if (!current.rest) return current;
    const rest: RestState = { ...current.rest, endsAt, totalSec: total };
    if (paused) rest.pausedRemainingSec = remaining;
    if (grade) {
      rest.reasonKind = grade.reasonKind;
      rest.gradedSec = grade.seconds;
      rest.deltaSec = grade.deltaSec;
    }
    return { ...current, rest };
  });
  if (paused) void cancelRestDone(); else void scheduleRestDone(endsAt);
}

export function adjustRest(deltaSec: number): void {
  const a = active();
  if (!a?.rest) return;
  retimeRest(a.rest.totalSec + deltaSec);
}

/** Re-grade only the running timer owned by this exact set. */
export function regradeRest(entry: number, index: number): void {
  const a = active();
  if (!a?.rest?.from) return;
  if (a.rest.from.startedAt !== a.startedAt || a.rest.from.exerciseId !== a.entries[entry]?.exerciseId) return;
  if (a.rest.from.entry !== entry || a.rest.from.set !== index) return;
  if (!state.value.preferences.autoRest || (restRemainingSec(a) ?? 0) <= 0) return;
  const grade = gradeFor(a, entry, index);
  retimeRest(grade.seconds, grade);
}

export function stopRest(): void {
  patchActive(a => ({ ...a, rest: undefined }));
  void cancelRestDone();
}

export function restRemainingSec(a: ActiveSession, now = Date.now()): number | null {
  if (!a.rest) return null;
  if (a.pausedAt && a.rest.pausedRemainingSec != null) return a.rest.pausedRemainingSec;
  return Math.max(0, Math.round((a.rest.endsAt - now) / 1000));
}

export interface FinishSummary { session: Session; changedTemplate: boolean }

/** Turn the active session into history. Sets that were never filled are dropped. */
export function finishSession(saveTemplate: boolean): FinishSummary | null {
  const a = active();
  if (!a) return null;
  const split = state.value.splits.find(s => s.id === a.splitId);
  const now = new Date();
  const exercises = a.entries
    .filter(e => !e.skipped)
    .map(e => {
      const hasCapturedEntry = !!a.plan?.entries.some(planEntry => planEntry.id === e.planEntryId);
      const actualSetIndices = hasCapturedEntry && e.planComparisonValid !== false
        ? e.sets.map((set, index) => isWorkingSet(set) ? index : -1).filter(index => index >= 0)
        : undefined;
      return { exerciseId: e.exerciseId, name: e.name, sets: e.sets.filter(isWorkingSet), planEntryId: hasCapturedEntry ? e.planEntryId : undefined, actualSetIndices };
    })
    .filter(e => e.sets.length);
  const session: Session = {
    id: newId('s'),
    splitId: a.splitId,
    splitName: split?.name ?? 'Workout',
    day: dayKey(now),
    startedAt: a.startedAt,
    endedAt: now.toISOString(),
    durationSec: elapsedSec(a, now.getTime()),
    exercises,
    plan: a.plan,
  };
  const templateIds = (split?.exercises ?? []).map(e => e.exerciseId).join('|');
  const sessionIds = a.entries.filter(e => !e.skipped).map(e => e.exerciseId).join('|');
  const changedTemplate = !!split && templateIds !== sessionIds;
  update(s => ({
    ...s,
    active: null,
    sessions: exercises.length ? [...s.sessions, session].sort((x, y) => x.startedAt.localeCompare(y.startedAt)) : s.sessions,
    splits: saveTemplate && split
      ? s.splits.map(sp => (sp.id !== split.id ? sp : { ...sp, exercises: a.entries.filter(e => !e.skipped).map(e => ({ exerciseId: e.exerciseId, sets: Math.max(1, e.sets.length) })) }))
      : s.splits,
  }));
  flushSave();
  void cancelRestDone();
  void resyncReminders();
  refreshPreferenceFactsIfStale();
  void haptic.success();
  return { session, changedTemplate };
}

export function discardSession(): void {
  update(s => ({ ...s, active: null }));
  flushSave();
  void cancelRestDone();
}

/** Sets a session's note text, by id. Clears its old flags: a changed note needs a fresh read, not the last one's tags. */
export function setSessionNote(sessionId: string, note: string): void {
  update(s => ({ ...s, sessions: s.sessions.map(x => (x.id === sessionId ? { ...x, note: note || undefined, noteFlags: undefined } : x)) }));
  flushSave();
}

/**
 * The online coach's read of a session's note arrives after the request
 * that started it, sometimes after the screen that asked has closed. This
 * merges those flags into the session by id whenever it resolves, so
 * Train's finish screen and History's session editor can both start the
 * same request and let it land safely in the background.
 */
export function applySessionNoteFlags(sessionId: string, flags: NoteFlag[]): void {
  if (!flags.length) return;
  update(s => ({ ...s, sessions: s.sessions.map(x => (x.id === sessionId ? { ...x, noteFlags: flags } : x)) }));
  flushSave();
}
