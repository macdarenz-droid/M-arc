/**
 * The live workout. One active session at a time, stored in state so it
 * survives app restarts. All mutations go through `update` so they persist.
 */
import type { ActiveSession, AppState, Exercise, LoggedSet, RecoveryModel, Session, SessionLogging, Split } from '@/core/models';
import { newId } from '@/core/models';
import { state, update, flushSave } from '@/core/store';
import { findExercise } from '@/core/exercises';
import { isWorkingSet } from '@/brain/exposure';
import { classifySetFidelity, liveSessionLogging, retroSessionLogging } from '@/brain/fidelity';
import { calibrateAfterSession } from '@/brain/recovery';
import { exerciseHistory, type ExerciseSessionSummary } from '@/brain/history';
import { IMPULSE_LOOKBACK_DAYS, F_REF_SESSION_LOOKBACK } from '@/data/recovery';
import { dayKey } from '@/core/dates';
import { cancelRestDone, scheduleRestDone } from '@/native/notifications';
import { haptic } from '@/native/haptics';
import { syncAndStoreHealth } from '@/slices/settings/health';
import { connectWatch } from '@/native/watch';
import { resetHeartCapture, discardHeartCapture, heartForSet, finishHeartCapture, latestLiveBpm } from './heart';

export const REST_MIN = 15, REST_MAX = 600, REST_STEP = 15;

/** Sessions oldest first by start (RG-05). Sort is stable, so equal starts keep their order. */
export const sortByStart = (sessions: Session[]): Session[] => [...sessions].sort((x, y) => x.startedAt.localeCompare(y.startedAt));

/** The sessions a recovery prediction at `atMs` can see: the lookback window, and at least the last few (F_ref). */
function recentPrior(sorted: Session[], end: number, atMs: number): Session[] {
  const cutoff = atMs - (IMPULSE_LOOKBACK_DAYS + 1) * 86_400_000;
  let start = end;
  while (start > 0 && Date.parse(sorted[start - 1]!.startedAt) >= cutoff) start--;
  return sorted.slice(Math.max(0, Math.min(start, end - F_REF_SESSION_LOOKBACK)), end);
}

/**
 * UI-12: the recovery model is learned from live sessions in order. After history is edited or
 * a session deleted, rebuild it from scratch so it matches what is left. Linear: each step sees
 * only the recent window, and the previous result per exercise is carried forward.
 */
export function rebuildRecoveryModel(s: Pick<AppState, 'sessions' | 'customExercises' | 'profile' | 'healthDays'>): RecoveryModel {
  const sorted = sortByStart(s.sessions);
  const lastSummary = new Map<string, ExerciseSessionSummary>();
  const keyOf = (exerciseId: string) => findExercise(exerciseId, s.customExercises)?.id ?? exerciseId;
  let model: RecoveryModel = { tauScale: {}, observations: {} };
  sorted.forEach((sess, i) => {
    if (sess.logging?.mode === 'live') {
      model = calibrateAfterSession(recentPrior(sorted, i, Date.parse(sess.startedAt)), sess, s.customExercises, s.profile, s.healthDays, model, id => lastSummary.get(keyOf(id)));
    }
    for (const e of sess.exercises) {
      const h = exerciseHistory([sess], e.exerciseId, s.customExercises);
      const last = h[h.length - 1];
      if (last) lastSummary.set(keyOf(e.exerciseId), last);
    }
  });
  return model;
}

export function active(): ActiveSession | null { return state.value.active; }

function patchActive(fn: (a: ActiveSession) => ActiveSession): void {
  update(s => (s.active ? { ...s, active: fn(s.active) } : s));
}

const draftSet = (from: Partial<LoggedSet> = {}): LoggedSet => ({ ...from, id: newId('set') });
const blankSets = (n: number): LoggedSet[] => Array.from({ length: n }, () => draftSet());
const isCommitted = (set: LoggedSet): boolean => set.status === 'committed' || !!set.at;

export function startSession(split: Split): void {
  if (state.value.active) return;
  const custom = state.value.customExercises;
  const entries: ActiveSession['entries'] = split.exercises.map(se => {
    const ex = findExercise(se.exerciseId, custom);
    return { id: newId('e'), exerciseId: se.exerciseId, name: ex?.name ?? se.exerciseId, sets: blankSets(se.sets), done: false, skipped: false };
  });
  const startedAt = new Date().toISOString();
  update(s => ({ ...s, active: { id: newId('s'), splitId: split.id, startedAt, pausedMs: 0, entries, gymId: s.units.activeGymId } }));
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
    const rest = a.rest?.pausedRemainingSec != null ? { ...a.rest, endsAt: Date.now() + a.rest.pausedRemainingSec * 1000, pausedRemainingSec: undefined } : a.rest;
    if (rest) void scheduleRestDone(rest.endsAt);
    return { ...a, pausedMs: a.pausedMs + (Date.now() - a.pausedAt), pausedAt: undefined, rest };
  });
}

/** A set that is emptied after its commit loses its commit (UI-01): it is a draft again. */
function patched(set: LoggedSet, patch: Partial<LoggedSet>): LoggedSet {
  const next = { ...set, ...patch };
  if (isCommitted(set) && !isWorkingSet(next) && !('at' in patch)) {
    const { at: _at, restSec: _r, fidelity: _f, heart: _h, ...rest } = next;
    return { ...rest, status: 'draft' };
  }
  return next;
}

export function setSetById(setId: string, patch: Partial<LoggedSet>): void {
  patchActive(a => ({ ...a, entries: a.entries.map(e => (e.sets.some(s => s.id === setId) ? { ...e, sets: e.sets.map(s => (s.id === setId ? patched(s, patch) : s)) } : e)) }));
}

export function setSet(entry: number, index: number, patch: Partial<LoggedSet>): void {
  patchActive(a => {
    const entries = a.entries.map((e, i) => i !== entry ? e : { ...e, sets: e.sets.map((s, j) => (j !== index ? s : patched(s, patch))) });
    return { ...a, entries };
  });
}

/** Every already-committed set's timestamp, oldest first, used to judge the next commit's timing. */
function committedTimestamps(a: ActiveSession): number[] {
  return a.entries.flatMap(e => e.sets.map(s => s.at)).filter((x): x is string => !!x).map(t => new Date(t).getTime()).sort((x, y) => x - y);
}

/**
 * Commit a set once (UI-01): a second blur or tap on a committed set changes nothing. Starts the
 * rest timer only on a live commit. `actionAt` is when the person actually did it (a watch tap
 * relayed later): it drives fidelity and rest instead of the receipt time. Returns true if the set counts.
 */
export function commitSetById(setId: string, opts: { actionAt?: string } = {}): boolean {
  const a = active();
  const set = a?.entries.flatMap(e => e.sets).find(s => s.id === setId);
  if (!a || !set || !isWorkingSet(set)) return false;
  if (isCommitted(set)) return true;
  const action = opts.actionAt ? Date.parse(opts.actionAt) : NaN;
  const now = Number.isFinite(action) ? Math.min(action, Date.now()) : Date.now();
  const prior = committedTimestamps(a).filter(t => t <= now);
  const last = prior[prior.length - 1];
  const gapSec = last != null ? Math.round((now - last) / 1000) : null;
  const burstCount = prior.filter(t => now - t <= 15_000).length + 1;
  const fidelity = classifySetFidelity(gapSec, burstCount);
  const startedAtMs = new Date(a.startedAt).getTime();
  const heart = fidelity === 'live' ? heartForSet(Math.max(0, Math.round(((last ?? startedAtMs) - startedAtMs) / 1000)), Math.round((now - startedAtMs) / 1000)) : undefined;
  setSetById(setId, { at: new Date(now).toISOString(), restSec: gapSec != null ? Math.min(600, Math.max(0, gapSec)) : undefined, fidelity, heart, status: 'committed' });
  if (state.value.preferences.autoRest && fidelity === 'live') startRest(state.value.preferences.restDefaultSec, set.effort, latestLiveBpm(), now);
  void haptic.light();
  return true;
}

export function commitSet(entry: number, index: number): boolean {
  const set = active()?.entries[entry]?.sets[index];
  if (!set) return false;
  if (!set.id) setSet(entry, index, { id: newId('set') });
  return commitSetById(active()!.entries[entry]!.sets[index]!.id!);
}

/** The latest committed set in the session, if any (UI-31). */
export function latestCommittedSetId(a: ActiveSession): string | undefined {
  let best: { id?: string; at: string } | undefined;
  for (const e of a.entries) for (const s of e.sets) if (s.at && (!best || s.at > best.at)) best = { id: s.id, at: s.at };
  return best?.id;
}

/** UI-31: rating the effort of the set just done updates the running rest's heart target. */
export function setRestEffort(effort: LoggedSet['effort']): void {
  patchActive(a => (a.rest ? { ...a, rest: { ...a.rest, effort } } : a));
}

/** The next set carries the load and reps forward, never the previous set's timing or effort (UI-01). */
export function addSet(entry: number): void {
  patchActive(a => ({ ...a, entries: a.entries.map((e, i) => {
    if (i !== entry) return e;
    const last = e.sets[e.sets.length - 1];
    const carry: Partial<LoggedSet> = last ? { kg: last.kg, entered: last.entered, reps: last.reps, durationSec: last.durationSec, distanceM: last.distanceM } : {};
    for (const k of Object.keys(carry) as Array<keyof LoggedSet>) if (carry[k] === undefined) delete carry[k];
    return { ...e, sets: [...e.sets, draftSet(carry)] };
  }) }));
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
  patchActive(a => (a.entries.some(e => e.exerciseId === ex.id) ? a : { ...a, entries: [...a.entries, { id: newId('e'), exerciseId: ex.id, name: ex.name, sets: blankSets(sets), done: false, skipped: false }] }));
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

export function removeEntryById(entryId: string): void {
  patchActive(a => ({ ...a, entries: a.entries.filter(e => e.id !== entryId) }));
}

export function removeEntry(entry: number): void {
  patchActive(a => ({ ...a, entries: a.entries.filter((_, i) => i !== entry) }));
}

/** F3.7: swap this entry for a substitute, e.g. a recovering muscle or a balance nudge. Blank sets: a different exercise's numbers would not mean the same thing. */
export function substituteEntry(entry: number, ex: Exercise): void {
  patchActive(a => ({ ...a, entries: a.entries.map((e, i) => (i !== entry ? e : { ...e, id: newId('e'), exerciseId: ex.id, name: ex.name, sets: blankSets(e.sets.length) })) }));
}

export function startRest(sec: number, effort?: LoggedSet['effort'], preSetBpm?: number, from = Date.now()): void {
  const total = Math.max(REST_MIN, Math.min(REST_MAX, sec));
  const endsAt = from + total * 1000;
  // Paused: hold the full rest until resume (UI-19); resume schedules it.
  if (active()?.pausedAt) {
    patchActive(a => ({ ...a, rest: { endsAt, totalSec: total, effort, preSetBpm, pausedRemainingSec: total } }));
    return;
  }
  patchActive(a => ({ ...a, rest: { endsAt, totalSec: total, effort, preSetBpm } }));
  if (endsAt > Date.now()) void scheduleRestDone(endsAt);
}

export function adjustRest(deltaSec: number): void {
  const a = active();
  if (!a?.rest) return;
  if (a.pausedAt) {
    const cur = a.rest.pausedRemainingSec ?? Math.max(0, Math.round((a.rest.endsAt - a.pausedAt) / 1000));
    const next = Math.max(5, Math.min(REST_MAX, cur + deltaSec));
    patchActive(x => ({ ...x, rest: x.rest ? { ...x.rest, pausedRemainingSec: next, totalSec: Math.max(x.rest.totalSec, next) } : x.rest }));
    return;
  }
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
    .map(e => ({ exerciseId: e.exerciseId, name: e.name, sets: e.sets.filter(isWorkingSet).map(({ status: _status, ...set }) => set) }))
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
    id: a.id ?? newId('s'),
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
    sessions: exercises.length ? sortByStart([...s.sessions, session]) : s.sessions,
    splits: saveTemplate && split
      ? s.splits.map(sp => (sp.id !== split.id ? sp : { ...sp, exercises: a.entries.filter(e => !e.skipped).map(e => ({ exerciseId: e.exerciseId, sets: Math.max(1, e.sets.length) })) }))
      : s.splits,
    recoveryModel: exercises.length ? calibrateAfterSession(recentPrior(sortByStart(s.sessions), s.sessions.length, Date.parse(session.startedAt)), session, s.customExercises, s.profile, s.healthDays, s.recoveryModel, id => { const h = exerciseHistory(s.sessions, id, s.customExercises); return h[h.length - 1]; }) : s.recoveryModel,
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
    sessions: sortByStart(s.sessions.map(sess => {
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
    })),
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
  update(s => ({ ...s, sessions: sortByStart([...s.sessions, session]) }));
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
