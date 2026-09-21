/**
 * The live workout. One active session at a time, stored in state so it
 * survives app restarts. All mutations go through `update` so they persist.
 */
import type { ActiveSession, CoachChange, Exercise, LoggedSet, NoteFlag, Session, Split } from '@/core/models';
import { newId } from '@/core/models';
import { state, update, flushSave } from '@/core/store';
import { findExercise } from '@/core/exercises';
import { isWorkingSet } from '@/brain/exposure';
import { dayKey } from '@/core/dates';
import { cancelRestDone, scheduleRestDone } from '@/native/notifications';
import { haptic } from '@/native/haptics';
import { resyncReminders } from '../settings/reminders';
import { refreshPreferenceFactsIfStale } from '../coach/preferences';

export const REST_MIN = 15, REST_MAX = 600, REST_STEP = 15;

export function active(): ActiveSession | null { return state.value.active; }

function patchActive(fn: (a: ActiveSession) => ActiveSession): void {
  update(s => (s.active ? { ...s, active: fn(s.active) } : s));
}

/** Start a split. `changes` are one-day swaps or drops from an accepted coach plan; the split itself is untouched. */
export function startSession(split: Split, changes: CoachChange[] = []): void {
  if (state.value.active) return;
  const custom = state.value.customExercises;
  let entries: ActiveSession['entries'] = split.exercises.map(se => {
    const ex = findExercise(se.exerciseId, custom);
    return { exerciseId: se.exerciseId, name: ex?.name ?? se.exerciseId, sets: Array.from({ length: se.sets }, () => ({})), done: false, skipped: false };
  });
  for (const c of changes) {
    const i = entries.findIndex(e => e.exerciseId === c.removeExerciseId);
    if (i < 0) continue;
    const to = c.replaceWithExerciseId ? findExercise(c.replaceWithExerciseId, custom) : undefined;
    entries = to
      ? entries.map((e, j) => (j !== i ? e : { ...e, exerciseId: to.id, name: to.name }))
      : entries.filter((_, j) => j !== i);
  }
  update(s => ({ ...s, active: { splitId: split.id, startedAt: new Date().toISOString(), pausedMs: 0, entries } }));
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
    const rest = a.rest?.pausedRemainingSec != null ? { endsAt: Date.now() + a.rest.pausedRemainingSec * 1000, totalSec: a.rest.totalSec } : a.rest;
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
  if (state.value.preferences.autoRest) startRest(state.value.preferences.restDefaultSec);
  void haptic.light();
  return true;
}

export function addSet(entry: number): void {
  patchActive(a => ({ ...a, entries: a.entries.map((e, i) => (i !== entry ? e : { ...e, sets: [...e.sets, { ...(e.sets[e.sets.length - 1] ?? {}), effort: undefined }] })) }));
}

export function removeSet(entry: number, index: number): void {
  patchActive(a => ({ ...a, entries: a.entries.map((e, i) => (i !== entry || e.sets.length <= 1 ? e : { ...e, sets: e.sets.filter((_, j) => j !== index) })) }));
}

export function markDone(entry: number, done = true): void {
  patchActive(a => ({ ...a, entries: a.entries.map((e, i) => (i !== entry ? e : { ...e, done, skipped: false })) }));
  if (done) void haptic.success();
}

export function skipEntry(entry: number, skipped = true): void {
  patchActive(a => ({ ...a, entries: a.entries.map((e, i) => (i !== entry ? e : { ...e, skipped, done: false })) }));
}

export function addExerciseToSession(ex: Exercise, sets = ex.defaultSets): void {
  patchActive(a => (a.entries.some(e => e.exerciseId === ex.id) ? a : { ...a, entries: [...a.entries, { exerciseId: ex.id, name: ex.name, sets: Array.from({ length: sets }, () => ({})), done: false, skipped: false }] }));
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
  patchActive(x => ({ ...x, entries: x.entries.map((e, i) => (i !== entry ? e : { exerciseId: ex.id, name: ex.name, sets: Array.from({ length: Math.max(1, e.sets.length) }, () => ({})), done: false, skipped: false })) }));
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
  patchActive(a => ({ ...a, entries: a.entries.filter((_, i) => i !== entry) }));
}

export function startRest(sec: number): void {
  const total = Math.max(REST_MIN, Math.min(REST_MAX, sec));
  const endsAt = Date.now() + total * 1000;
  patchActive(a => ({ ...a, rest: { endsAt, totalSec: total } }));
  void scheduleRestDone(endsAt);
}

export function adjustRest(deltaSec: number): void {
  const a = active();
  if (!a?.rest) return;
  const remaining = Math.max(0, (a.rest.endsAt - Date.now()) / 1000) + deltaSec;
  const endsAt = Date.now() + Math.max(5, Math.min(REST_MAX, remaining)) * 1000;
  patchActive(x => ({ ...x, rest: x.rest ? { ...x.rest, endsAt, totalSec: Math.max(x.rest.totalSec, Math.round(remaining)) } : x.rest }));
  void scheduleRestDone(endsAt);
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
    .map(e => ({ exerciseId: e.exerciseId, name: e.name, sets: e.sets.filter(isWorkingSet) }))
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
