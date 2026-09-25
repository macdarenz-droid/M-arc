/**
 * The live workout. One active session at a time, stored in state so it
 * survives app restarts. All mutations go through `update` so they persist.
 */
import type { ActiveSession, AppState, Exercise, LoggedSet, RecoveryModel, Session, SessionLogging, Split, TodayOverride } from '@/core/models';
import { newId } from '@/core/models';
import { MAX_EXERCISE_NOTE, state, update, flushSave } from '@/core/store';
import { findExercise } from '@/core/exercises';
import { hasEntry } from '@/brain/exposure';
import { classifySetFidelity, liveSessionLogging, retroSessionLogging } from '@/brain/fidelity';
import { calibrateAfterSession } from '@/brain/recovery';
import { exerciseHistory, type ExerciseSessionSummary } from '@/brain/history';
import { IMPULSE_LOOKBACK_DAYS, F_REF_SESSION_LOOKBACK, NOVELTY_LAYOFF_DAYS } from '@/data/recovery';
import { dayKey, todayKey } from '@/core/dates';
import { cancelRestDone, scheduleRestDone } from '@/native/notifications';
import { haptic } from '@/native/haptics';
import { backgroundHealthSync } from '@/slices/settings/health';
import { connectWatch } from '@/native/watch';
import { resetHeartCapture, discardHeartCapture, heartForSet, finishHeartCapture, latestLiveBpm } from './heart';

export const REST_MIN = 15, REST_MAX = 600;

/** Sessions oldest first by start (RG-05). Sort is stable, so equal starts keep their order. */
export const sortByStart = (sessions: Session[]): Session[] => [...sessions].sort((x, y) => x.startedAt.localeCompare(y.startedAt));

/**
 * The sessions a recovery prediction at `atMs` depends on: the 28-day load ratio and layoff
 * window (which also cover the 7-day impulses), and at least the last few (F_ref). QA-R2b-3:
 * 7 days lost the load ratio and novelty history.
 */
const PRIOR_WINDOW_DAYS = Math.max(IMPULSE_LOOKBACK_DAYS, NOVELTY_LAYOFF_DAYS, 28) + 1;
function recentPrior(sorted: Session[], end: number, atMs: number): Session[] {
  const cutoff = atMs - PRIOR_WINDOW_DAYS * 86_400_000;
  let start = end;
  while (start > 0 && Date.parse(sorted[start - 1]!.startedAt) >= cutoff) start--;
  return sorted.slice(Math.max(0, Math.min(start, end - F_REF_SESSION_LOOKBACK)), end);
}

/**
 * QA-R2b-6: the sessions finishSession calibrated from, so a rebuild learns from the same ones:
 * everything finished in the app (live, mixed, compressed, and pre-logging 'legacy' saves), but
 * not a session typed in afterwards (retro without 'compressed').
 */
const calibratesAtFinish = (sess: Session): boolean => !sess.logging || sess.logging.mode !== 'retro' || sess.logging.flags.includes('compressed');

/**
 * UI-12: the recovery model is learned from live sessions in order. After history is edited or
 * a session deleted, rebuild it from scratch so it matches what is left. Linear: each step sees
 * only the recent window, and the previous result per exercise is carried forward.
 */
export function rebuildRecoveryModel(s: Pick<AppState, 'sessions' | 'customExercises' | 'profile' | 'healthDays'>): RecoveryModel {
  const sorted = sortByStart(s.sessions);
  // The window drops the first session, which dates training age when none is set.
  const profile = s.profile.trainingSince || !sorted[0] ? s.profile : { ...s.profile, trainingSince: sorted[0].day.slice(0, 7) };
  const lastSummary = new Map<string, ExerciseSessionSummary>();
  const keyOf = (exerciseId: string) => findExercise(exerciseId, s.customExercises)?.id ?? exerciseId;
  let model: RecoveryModel = { tauScale: {}, observations: {} };
  sorted.forEach((sess, i) => {
    if (calibratesAtFinish(sess)) {
      model = calibrateAfterSession(recentPrior(sorted, i, Date.parse(sess.startedAt)), sess, s.customExercises, profile, s.healthDays, model, id => lastSummary.get(keyOf(id)));
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

/**
 * ES-02: the split as today's applied Escobar adjustment reshapes it (swap, remove, add, sets,
 * load). Only for today's override of this split; otherwise the split as saved.
 */
export function plannedExercises(split: Split, override: TodayOverride | null, today = todayKey()): Array<{ exerciseId: string; sets: number; loadFactor?: number }> {
  let list: Array<{ exerciseId: string; sets: number; loadFactor?: number }> = split.exercises.map(e => ({ ...e }));
  if (!override || override.day !== today || override.splitId !== split.id) return list;
  for (const c of override.changes) {
    // QA-R4a-10: a swap to an exercise already in the list just drops the one swapped out.
    // QA2-FD-9: a swap to itself changes nothing.
    if (c.kind === 'swap') { if (c.to === c.from) continue; list = list.some(e => e.exerciseId === c.to) ? list.filter(e => e.exerciseId !== c.from) : list.map(e => (e.exerciseId === c.from ? { ...e, exerciseId: c.to } : e)); }
    else if (c.kind === 'remove') list = list.filter(e => e.exerciseId !== c.exerciseId);
    else if (c.kind === 'add') { if (!list.some(e => e.exerciseId === c.exerciseId)) list.push({ exerciseId: c.exerciseId, sets: c.sets }); }
    else if (c.kind === 'sets') list = list.map(e => (e.exerciseId === c.exerciseId ? { ...e, sets: c.sets } : e));
    else if (c.kind === 'load') list = list.map(e => (e.exerciseId === c.exerciseId ? { ...e, loadFactor: c.factor } : e));
  }
  return list;
}

/** QA-R4a-5/9: the split as it will run today, for the "Before you start" brief. */
export function todaySplit(split: Split, override: TodayOverride | null, today = todayKey()): Omit<Split, 'exercises'> & { exercises: Array<{ exerciseId: string; sets: number; loadFactor?: number }> } {
  return { ...split, exercises: plannedExercises(split, override, today) };
}

export function startSession(split: Split): void {
  if (state.value.active) return;
  const custom = state.value.customExercises;
  const entries: ActiveSession['entries'] = plannedExercises(split, state.value.escobar.todayOverride).map(se => {
    const ex = findExercise(se.exerciseId, custom);
    return { id: newId('e'), exerciseId: se.exerciseId, name: ex?.name ?? se.exerciseId, sets: blankSets(se.sets), done: false, skipped: false, ...(se.loadFactor != null ? { loadFactor: se.loadFactor } : {}) };
  });
  const startedAt = new Date().toISOString();
  update(s => ({ ...s, active: { id: newId('s'), splitId: split.id, startedAt, pausedMs: 0, entries, gymId: s.units.activeGymId } }));
  flushSave();
  resetHeartCapture();
  void haptic.confirm();
  void backgroundHealthSync();
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

/**
 * A committed set that is emptied is a draft while empty (it is not kept if left that way), but
 * it keeps its commit: correcting reps by clearing and retyping must not move its time or restart
 * rest (QA-R2b-1). Refilled, it is committed again with its original timing.
 */
function patched(set: LoggedSet, patch: Partial<LoggedSet>): LoggedSet {
  const next = { ...set, ...patch };
  if (isCommitted(set) && !hasEntry(next) && !('at' in patch)) return { ...next, status: 'draft' };
  if (set.status === 'draft' && next.at && hasEntry(next) && !('status' in patch)) return { ...next, status: 'committed' };
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
  // QA2-FB-5: a set left empty when its field loses focus gives up its commit, so a later real
  // entry gets its own time and rest instead of the mistaken one's.
  if (a && set && !hasEntry(set) && set.at) {
    setSetById(setId, { at: undefined, restSec: undefined, fidelity: undefined, heart: undefined, status: 'draft' });
    return false;
  }
  // F2: a filled-in warm-up commits too (it gets its time), it just never starts auto-rest.
  if (!a || !set || !hasEntry(set)) return false;
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
  if (state.value.preferences.autoRest && fidelity === 'live' && set.kind !== 'warmup') startRest(state.value.preferences.restDefaultSec, set.effort, latestLiveBpm(), now);
  void haptic.confirm();
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

/** F2 "Log warm-ups": puts the ramp in front of the working sets, once. They are logged, never counted. */
export function logWarmups(entry: number, sets: Array<Pick<LoggedSet, 'kg' | 'entered' | 'reps'>>): void {
  patchActive(a => ({ ...a, entries: a.entries.map((e, i) => (i !== entry || e.sets.some(x => x.kind === 'warmup') ? e : { ...e, sets: [...sets.map(w => draftSet({ ...w, kind: 'warmup' })), ...e.sets] })) }));
}

/** F1: today's note for one exercise. */
export function setEntryNote(entry: number, note: string): void {
  patchActive(a => ({ ...a, entries: a.entries.map((e, i) => (i !== entry ? e : { ...e, note: note.slice(0, 500) || undefined })) }));
}

/** F1: the sticky setup note (seat height, grip) shown every time this exercise comes up. */
export function setExerciseNote(exerciseId: string, note: string): void {
  const text = note.trim().slice(0, MAX_EXERCISE_NOTE);
  update(s => {
    const { [exerciseId]: _old, ...rest } = s.exerciseNotes;
    return { ...s, exerciseNotes: text ? { ...rest, [exerciseId]: text } : rest };
  });
}

export function removeSet(entry: number, index: number): void {
  patchActive(a => ({ ...a, entries: a.entries.map((e, i) => (i !== entry || e.sets.length <= 1 ? e : { ...e, sets: e.sets.filter((_, j) => j !== index) })) }));
}

export function markDone(entry: number, done = true): void {
  patchActive(a => ({ ...a, entries: a.entries.map((e, i) => (i !== entry ? e : { ...e, done, skipped: false })) }));
  if (done) void haptic.confirm(); else void haptic.tick();
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

/**
 * QA-R4a-4: the person changed the exercises themselves, compared with what was planned for
 * today (the split as today's Escobar adjustment shaped it). A one-day swap or skip from Escobar
 * is not a change worth saving to the split.
 */
export function changedFromPlan(a: ActiveSession, split: Split | undefined, override = state.value.escobar.todayOverride): boolean {
  if (!split) return false;
  const planned = plannedExercises(split, override, dayKey(new Date(a.startedAt))).map(e => e.exerciseId).join('|');
  return planned !== a.entries.filter(e => !e.skipped).map(e => e.exerciseId).join('|');
}

/**
 * QA2-FD-2, QA2-FD-7: "Save for future" keeps the person's own changes and leaves out Escobar's
 * one-day ones. An exercise only Escobar brought in today (an add or a swap's target) is not
 * saved; one Escobar took out today (a remove or a swap's source) stays at its place in the split.
 */
export function templateFromSession(a: ActiveSession, split: Split, override: TodayOverride | null = state.value.escobar.todayOverride): Split['exercises'] {
  const planned = new Set(plannedExercises(split, override, dayKey(new Date(a.startedAt))).map(e => e.exerciseId));
  const inSplit = new Set(split.exercises.map(e => e.exerciseId));
  const done = a.entries.filter(e => !e.skipped);
  const doneIds = new Set(done.map(e => e.exerciseId));
  const out = done
    .filter(e => inSplit.has(e.exerciseId) || !planned.has(e.exerciseId))
    .map(e => ({ exerciseId: e.exerciseId, sets: Math.max(1, e.sets.filter(x => x.kind !== 'warmup').length) }));
  split.exercises.forEach((se, i) => {
    if (!planned.has(se.exerciseId) && !doneIds.has(se.exerciseId)) out.splice(Math.min(i, out.length), 0, { ...se });
  });
  return out;
}

/** Turn the active session into history. Sets that were never filled are dropped. */
export function finishSession(saveTemplate: boolean, opts: { note?: string } = {}): FinishSummary | null {
  const a = active();
  if (!a) return null;
  const split = state.value.splits.find(s => s.id === a.splitId);
  const now = new Date();
  const exercises = a.entries
    .filter(e => !e.skipped)
    .map(e => ({ exerciseId: e.exerciseId, name: e.name, sets: e.sets.filter(hasEntry).map(({ status: _status, ...set }) => set), ...(e.note?.trim() ? { note: e.note.trim().slice(0, 500) } : {}) }))
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
    ...(opts.note?.trim() ? { note: opts.note.trim().slice(0, 1000) } : {}),
  });
  const changedTemplate = changedFromPlan(a, split);
  update(s => ({
    ...s,
    active: null,
    // ES-02: today's adjustment is used up by finishing this split (a discarded session keeps it).
    escobar: s.escobar.todayOverride?.splitId === a.splitId ? { ...s.escobar, todayOverride: null } : s.escobar,
    sessions: exercises.length ? sortByStart([...s.sessions, session]) : s.sessions,
    splits: saveTemplate && split
      ? s.splits.map(sp => (sp.id !== split.id ? sp : { ...sp, exercises: templateFromSession(a, split, s.escobar.todayOverride) }))
      : s.splits,
    // QA-R2b-5: the prediction at finish sees the whole history, like the number the app showed.
    recoveryModel: exercises.length ? calibrateAfterSession(sortByStart(s.sessions), session, s.customExercises, s.profile, s.healthDays, s.recoveryModel, id => { const h = exerciseHistory(s.sessions, id, s.customExercises); return h[h.length - 1]; }) : s.recoveryModel,
  }));
  flushSave();
  void cancelRestDone();
  void haptic.success();
  return { session, changedTemplate };
}

/** The finish sheet calls this after "when did you train?" resolves a compressed session's real timing. */
export function resolveSessionTiming(sessionId: string, trainedAtLocal: string, durationMin: number, timeSource: SessionLogging['timeSource']): boolean {
  // QA-R2c-2: a cleared day or time leaves the session as it was saved at finish.
  if (!Number.isFinite(new Date(trainedAtLocal).getTime()) || !Number.isFinite(durationMin) || durationMin <= 0) return false;
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
  return true;
}

/** "Log a past session": no timer, no rest banner. Every set is retro. */
export function logPastSession(input: { splitId: string; trainedAtLocal: string; durationMin: number; entries: Array<{ exerciseId: string; name: string; sets: LoggedSet[] }> }): FinishSummary | null {
  const split = state.value.splits.find(s => s.id === input.splitId);
  const exercises = input.entries.map(e => ({ exerciseId: e.exerciseId, name: e.name, sets: e.sets.filter(hasEntry) })).filter(e => e.sets.length);
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
  void haptic.confirm();
  return { session, changedTemplate: false };
}

export function discardSession(): void {
  update(s => ({ ...s, active: null }));
  flushSave();
  void cancelRestDone();
  discardHeartCapture();
}
