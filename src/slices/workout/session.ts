/**
 * The live workout. One active session at a time, stored in state so it
 * survives app restarts. All mutations go through `update` so they persist.
 */
import type { ActiveSession, Exercise, LoggedSet, Session, SessionLogging, Split } from '@/core/models';
import { newId } from '@/core/models';
import { state, update, flushSave } from '@/core/store';
import { findExercise } from '@/core/exercises';
import { isWorkingSet } from '@/brain/exposure';
import { classifySetFidelity, liveSessionLogging, retroSessionLogging } from '@/brain/fidelity';
import { calibrateAfterSession } from '@/brain/recovery';
import { dayKey } from '@/core/dates';
import { cancelRestDone, scheduleRestDone } from '@/native/notifications';
import { haptic } from '@/native/haptics';
import { syncAndStoreHealth } from '@/slices/settings/health';
import { connectWatch } from '@/native/watch';
import { resetHeartCapture, discardHeartCapture, heartForSet, finishHeartCapture, latestLiveBpm } from './heart';

export const REST_MIN = 15, REST_MAX = 600, REST_STEP = 15;

export function active(): ActiveSession | null { return state.value.active; }

function patchActive(fn: (a: ActiveSession) => ActiveSession): void {
  update(s => (s.active ? { ...s, active: fn(s.active) } : s));
}

export function startSession(split: Split): void {
  if (state.value.active) return;
  const custom = state.value.customExercises;
  const entries: ActiveSession['entries'] = split.exercises.map(se => {
    const ex = findExercise(se.exerciseId, custom);
    return { exerciseId: se.exerciseId, name: ex?.name ?? se.exerciseId, sets: Array.from({ length: se.sets }, () => ({})), done: false, skipped: false };
  });
  const startedAt = new Date().toISOString();
  update(s => ({ ...s, active: { splitId: split.id, startedAt, pausedMs: 0, entries, gymId: s.units.activeGymId } }));
  flushSave();
  resetHeartCapture(startedAt);
  void haptic.medium();
  void syncAndStoreHealth();
  const w = state.value.preferences.watch;
  if (w.autoConnectOnSession && w.deviceAddress) void connectWatch(w.deviceAddress);
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

/** Every already-committed set's timestamp, oldest first, used to judge the next commit's timing. */
function committedTimestamps(a: ActiveSession): number[] {
  return a.entries.flatMap(e => e.sets.map(s => s.at)).filter((x): x is string => !!x).map(t => new Date(t).getTime()).sort((x, y) => x - y);
}

/** Commit a set. Starts the rest timer only on a live commit (a delayed catch-up should not restart it). Returns true if the set counts. */
export function commitSet(entry: number, index: number): boolean {
  const a = active();
  const set = a?.entries[entry]?.sets[index];
  if (!a || !set || !isWorkingSet(set)) return false;
  const now = Date.now();
  const prior = committedTimestamps(a);
  const last = prior[prior.length - 1];
  const gapSec = last != null ? Math.round((now - last) / 1000) : null;
  const burstCount = prior.filter(t => now - t <= 15_000).length + 1;
  const fidelity = classifySetFidelity(gapSec, burstCount);
  const startedAtMs = new Date(a.startedAt).getTime();
  const heart = fidelity === 'live' ? heartForSet(Math.max(0, Math.round(((last ?? startedAtMs) - startedAtMs) / 1000)), Math.round((now - startedAtMs) / 1000)) : undefined;
  setSet(entry, index, { at: new Date(now).toISOString(), restSec: gapSec != null ? Math.min(600, Math.max(0, gapSec)) : undefined, fidelity, heart });
  if (state.value.preferences.autoRest && fidelity === 'live') startRest(state.value.preferences.restDefaultSec, set.effort, latestLiveBpm());
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

/** Reorder the live session: hold an exercise and drag it up or down. */
export function moveEntry(from: number, to: number): void {
  patchActive(a => {
    if (from === to || from < 0 || to < 0 || from >= a.entries.length || to >= a.entries.length) return a;
    const entries = [...a.entries];
    const [item] = entries.splice(from, 1);
    entries.splice(to, 0, item!);
    return { ...a, entries };
  });
}

export function removeEntry(entry: number): void {
  patchActive(a => ({ ...a, entries: a.entries.filter((_, i) => i !== entry) }));
}

/** F3.7: swap this entry for a substitute, e.g. a recovering muscle or a balance nudge. Blank sets: a different exercise's numbers would not mean the same thing. */
export function substituteEntry(entry: number, ex: Exercise): void {
  patchActive(a => ({ ...a, entries: a.entries.map((e, i) => (i !== entry ? e : { ...e, exerciseId: ex.id, name: ex.name, sets: e.sets.map(() => ({})) })) }));
}

export function startRest(sec: number, effort?: LoggedSet['effort'], preSetBpm?: number): void {
  const total = Math.max(REST_MIN, Math.min(REST_MAX, sec));
  const endsAt = Date.now() + total * 1000;
  patchActive(a => ({ ...a, rest: { endsAt, totalSec: total, effort, preSetBpm } }));
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
  const workingSets = exercises.flatMap(e => e.sets);
  const logging = liveSessionLogging({
    setFidelities: workingSets.map(s => s.fidelity ?? 'live'),
    startedAt: a.startedAt,
    endedAt: now.toISOString(),
    loggedDurationSec: elapsedSec(a, now.getTime()),
    workingSetCount: workingSets.length,
  });
  const session: Session = finishHeartCapture({
    id: newId('s'),
    splitId: a.splitId,
    splitName: split?.name ?? 'Workout',
    day: dayKey(logging.trainedAt),
    startedAt: logging.trainedAt,
    endedAt: logging.trainedEndAt,
    durationSec: Math.max(0, Math.round((new Date(logging.trainedEndAt).getTime() - new Date(logging.trainedAt).getTime()) / 1000)),
    exercises,
    logging,
    gymId: a.gymId ?? state.value.units.activeGymId,
  });
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
    recoveryModel: exercises.length ? calibrateAfterSession(s.sessions, session, s.customExercises, s.profile, s.healthDays, s.recoveryModel) : s.recoveryModel,
  }));
  flushSave();
  void cancelRestDone();
  void haptic.success();
  return { session, changedTemplate };
}

/** The finish sheet calls this after "when did you train?" resolves a compressed session's real timing. */
export function resolveSessionTiming(sessionId: string, trainedAtLocal: string, durationMin: number, timeSource: SessionLogging['timeSource']): void {
  const trainedAt = new Date(trainedAtLocal).toISOString();
  const trainedEndAt = new Date(new Date(trainedAtLocal).getTime() + durationMin * 60_000).toISOString();
  update(s => ({
    ...s,
    sessions: s.sessions.map(sess => {
      if (sess.id !== sessionId) return sess;
      const flags = dayKey(trainedAt) !== dayKey(sess.logging.loggedAt) ? [...new Set([...sess.logging.flags, 'midnight_crossing'])] : sess.logging.flags;
      return {
        ...sess,
        day: dayKey(trainedAt),
        startedAt: trainedAt,
        endedAt: trainedEndAt,
        durationSec: durationMin * 60,
        logging: { ...sess.logging, trainedAt, trainedEndAt, timeSource, flags },
      };
    }),
  }));
  flushSave();
}

/** "Log a past session": no timer, no rest banner. Every set is retro. */
export function logPastSession(input: { splitId: string; trainedAtLocal: string; durationMin: number; entries: Array<{ exerciseId: string; name: string; sets: LoggedSet[] }> }): FinishSummary | null {
  const split = state.value.splits.find(s => s.id === input.splitId);
  const exercises = input.entries.map(e => ({ exerciseId: e.exerciseId, name: e.name, sets: e.sets.filter(isWorkingSet) })).filter(e => e.sets.length);
  if (!exercises.length) return null;
  const trainedAt = new Date(input.trainedAtLocal).toISOString();
  const trainedEndAt = new Date(new Date(input.trainedAtLocal).getTime() + input.durationMin * 60_000).toISOString();
  const logging = retroSessionLogging(trainedAt, trainedEndAt, 'user');
  const session: Session = {
    id: newId('s'),
    splitId: input.splitId,
    splitName: split?.name ?? 'Workout',
    day: dayKey(trainedAt),
    startedAt: trainedAt,
    endedAt: trainedEndAt,
    durationSec: input.durationMin * 60,
    exercises,
    logging,
    gymId: state.value.units.activeGymId,
  };
  update(s => ({ ...s, sessions: [...s.sessions, session].sort((x, y) => x.startedAt.localeCompare(y.startedAt)) }));
  flushSave();
  void haptic.success();
  return { session, changedTemplate: false };
}

export function discardSession(): void {
  update(s => ({ ...s, active: null }));
  flushSave();
  void cancelRestDone();
  discardHeartCapture();
}
