/**
 * The live workout. One active session at a time, stored in state so it
 * survives app restarts. All mutations go through `update` so they persist.
 */
import type { ActiveSession, CoachChange, Effort, Exercise, LoggedSet, NoteFlag, RestState, Session, Split } from '@/core/models';
import { newId, PLAN_MAX_METADATA_SETS } from '@/core/models';
import { state, update, flushSave } from '@/core/store';
import { findExercise } from '@/core/exercises';
import { isWorkingSet } from '@/brain/exposure';
import { REST_CEIL_SEC, REST_FLOOR_SEC, REST_MIN_REMAINING_SEC } from '@/brain/coach/bands';
import { autoregulate, restFor, type LiveAdjustment, type RestGrade } from '@/brain/live';
import { dayKey } from '@/core/dates';
import { cancelRestDone, scheduleRestDone } from '@/native/notifications';
import { haptic } from '@/native/haptics';
import { beginHeartRateSession, discardHeartRateSession, finishHeartRateSession } from '@/heart-rate/store';
import { resyncReminders } from '../settings/reminders';
import { refreshPreferenceFactsIfStale } from '../coach/preferences';
import { contextFromState } from '@/brain/coach/context';
import { appendAgreementChange, capturePlan, capturePlanEntry, effortSetFingerprint, invalidateAssessmentEntry, recordSeenWorkingRow, seenWorkingSetIndices } from '@/brain/debrief';
import { deloadActive } from '@/brain/coach/deload';

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
  // The recorder needs an identity before the first sample arrives, so the
  // session id is minted here and reused verbatim at finish.
  const id = newId('s');
  update(s => ({ ...s, active: { id, splitId: split.id, startedAt, pausedMs: 0, entries, plan } }));
  flushSave();
  void beginHeartRateSession(id, startedAt);
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
    const target = a.entries[entry];
    const current = target?.sets[index];
    if (!target || !current) return a;
    const nextSet = { ...current, ...patch };
    const entries = a.entries.map((e, i) => i !== entry ? e : { ...e, sets: e.sets.map((s, j) => (j !== index ? s : nextSet)) });
    const plan = isWorkingSet(nextSet) ? recordSeenWorkingRow(a.plan, target.planEntryId, index) : a.plan;
    return { ...a, entries, plan };
  });
}

/** Commit a set. Starts the rest timer when auto-rest is on. Returns true if the set counts. */
export function commitSet(entry: number, index: number): boolean {
  const a = active();
  const set = a?.entries[entry]?.sets[index];
  if (!a || !set || !isWorkingSet(set)) return false;
  // Stamped once, on the first commit, and never revised by a later edit. It
  // marks the tap, not the work; the trace labels it that way.
  if (!set.loggedAt) {
    const loggedAt = new Date().toISOString();
    patchActive(current => ({
      ...current,
      entries: current.entries.map((item, i) => i !== entry ? item : {
        ...item,
        sets: item.sets.map((value, j) => j !== index ? value : { ...value, loggedAt }),
      }),
    }));
  }
  if (state.value.preferences.autoRest) {
    const grade = gradeFor(a, entry, index);
    startRest(grade.seconds, { entry, set: index, startedAt: a.startedAt, exerciseId: a.entries[entry]!.exerciseId }, grade);
  }
  void haptic.light();
  return true;
}

export function addSet(entry: number): void {
  patchActive(a => {
    const target = a.entries[entry];
    if (!target) return a;
    const appended = { ...(target.sets[target.sets.length - 1] ?? {}), effort: undefined };
    const nextIndex = target.sets.length;
    const targetOverrides = target.targetOverrides
      ? Array.from({ length: nextIndex + 1 }, (_, index) => target.targetOverrides?.[index] ?? null)
      : undefined;
    const entries = a.entries.map((e, i) => i !== entry ? e : { ...e, sets: [...e.sets, appended], targetOverrides });
    const plan = isWorkingSet(appended) ? recordSeenWorkingRow(a.plan, target.planEntryId, nextIndex) : a.plan;
    return { ...a, entries, plan };
  });
}

export function removeSet(entry: number, index: number): void {
  patchActive(a => {
    const target = a.entries[entry];
    if (!target?.sets[index] || target.sets.length <= 1) return a;
    const plan = invalidateAssessmentEntry(a.plan, target.planEntryId);
    return { ...a, entries: a.entries.map((e, i) => (i !== entry ? e : { ...e, sets: e.sets.filter((_, j) => j !== index), targetOverrides: undefined, planComparisonValid: false })), plan, rest: clearRestOwner(a.rest) };
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
    const withEntry = a.plan ? { ...a.plan, entries: [...a.plan.entries, captured] } : undefined;
    const plan = appendAgreementChange(withEntry, { id: newId('pac'), acceptedAt: new Date().toISOString(), kind: 'add', entryId: id });
    return { ...a, entries: [...a.entries, entry], plan };
  });
}

/** Canonical identity and set values reviewed before a destructive swap. */
export function swapEntryFingerprint(entry: ActiveSession['entries'][number]): string {
  return JSON.stringify([entry.planEntryId ?? null, entry.exerciseId, entry.sets.map(set => [
    set.kg ?? null, set.reps ?? null, set.effort ?? null, set.durationSec ?? null, set.distanceM ?? null,
  ])]);
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
export function replaceEntry(entry: number, ex: Exercise, expected?: { startedAt: string; exerciseId: string; setsFingerprint?: string }): boolean {
  const a = active();
  if (!a || !a.entries[entry]) return false;
  if (expected && (a.startedAt !== expected.startedAt || a.entries[entry]!.exerciseId !== expected.exerciseId)) return false;
  if (expected?.setsFingerprint !== undefined && swapEntryFingerprint(a.entries[entry]!) !== expected.setsFingerprint) return false;
  if (a.entries[entry]!.exerciseId === ex.id) return false;
  if (a.entries.some((e, i) => i !== entry && e.exerciseId === ex.id)) return false;
  patchActive(x => {
    const previous = x.entries[entry]!;
    const id = newId('pe');
    const count = Math.max(1, previous.sets.length);
    const ctx = contextFromState(state.value, dayKey(new Date(x.startedAt)), Date.now());
    const captured = capturePlanEntry(ctx, { id, exerciseId: ex.id, name: ex.name, plannedSets: count, origin: 'replacement', replaces: previous.planEntryId });
    const linkedPlan = previous.planEntryId
      ? x.plan
      : x.plan ? { ...x.plan, assessment: undefined } : undefined;
    const invalidated = previous.sets.some(isWorkingSet) || seenWorkingSetIndices(linkedPlan, previous.planEntryId).length
      ? invalidateAssessmentEntry(linkedPlan, previous.planEntryId)
      : linkedPlan;
    const withEntries = invalidated ? {
      ...invalidated,
      entries: [...invalidated.entries.map(p => p.id === previous.planEntryId ? { ...p, excluded: 'replaced' as const } : p), captured],
    } : undefined;
    const plan = previous.planEntryId
      ? appendAgreementChange(withEntries, { id: newId('pac'), acceptedAt: new Date().toISOString(), kind: 'replace', fromEntryId: previous.planEntryId, toEntryId: id })
      : withEntries;
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
  patchActive(a => {
    if (!a.entries[entry]) return a;
    const removed = a.entries[entry]!;
    const removedId = removed.planEntryId;
    const invalidated = removed.sets.some(isWorkingSet) || seenWorkingSetIndices(a.plan, removedId).length
      ? invalidateAssessmentEntry(a.plan, removedId)
      : a.plan;
    const withEntries = invalidated ? { ...invalidated, entries: invalidated.entries.map(p => p.id === removedId ? { ...p, excluded: 'removed' as const } : p) } : undefined;
    const plan = removedId
      ? appendAgreementChange(withEntries, { id: newId('pac'), acceptedAt: new Date().toISOString(), kind: 'remove', entryId: removedId })
      : withEntries;
    return { ...a, entries: a.entries.filter((_, i) => i !== entry), plan, rest: clearRestOwner(a.rest) };
  });
}

function currentLiveAdjustment(a: ActiveSession, entryId: string, sourceSet: number): { entryIndex: number; offer: LiveAdjustment } | null {
  if (a.pausedAt) return null;
  const entryIndex = a.entries.findIndex(entry => entry.planEntryId === entryId);
  const entry = a.entries[entryIndex];
  const planEntry = a.plan?.entries.find(candidate => candidate.id === entryId);
  if (!entry || !planEntry || entry.exerciseId !== planEntry.exerciseId || entry.done || entry.skipped || entry.sets.length > PLAN_MAX_METADATA_SETS || entry.planComparisonValid === false || planEntry.excluded) return null;
  const exercise = findExercise(entry.exerciseId, state.value.customExercises);
  const startDay = dayKey(new Date(a.startedAt));
  const offer = autoregulate({
    exercise,
    goal: a.plan!.goal,
    sets: entry.sets,
    targets: planEntry.targets,
    sourceSet,
    deloadActive: deloadActive(a.plan!.deload, startDay) || deloadActive(state.value.coach.deload, dayKey(new Date())),
    decisionTaken: !!entry.coachDecision,
    historyBacked: planEntry.targetSource === 'history',
    allowIncrease: planEntry.allowIncrease,
  });
  return offer ? { entryIndex, offer } : null;
}

export function acceptLiveAdjustment(entryId: string, expectedStartedAt: string, expected: LiveAdjustment): boolean {
  const a = active();
  if (!a || a.startedAt !== expectedStartedAt) return false;
  const current = currentLiveAdjustment(a, entryId, expected.sourceSet);
  if (!current || current.offer.key !== expected.key) return false;
  patchActive(latest => {
    if (latest !== a) return latest;
    const entry = latest.entries[current.entryIndex]!;
    const overrides = Array.from({ length: entry.sets.length }, (_, index) => entry.targetOverrides?.[index] ?? null);
    for (const index of current.offer.remainingIndices) overrides[index] = { ...current.offer.next };
    const entries = latest.entries.map((candidate, index) => index !== current.entryIndex ? candidate : {
      ...candidate,
      targetOverrides: overrides,
      coachDecision: { key: current.offer.key, action: 'accepted' as const },
    });
    const withTargets = latest.plan ? {
      ...latest.plan,
      entries: latest.plan.entries.map(candidate => {
        if (candidate.id !== entryId) return candidate;
        const acceptedTargets = Array.from({ length: entry.sets.length }, (_, index) => candidate.acceptedTargets?.[index] ?? null);
        for (const index of current.offer.remainingIndices) acceptedTargets[index] = { ...current.offer.next };
        return { ...candidate, acceptedTargets };
      }),
    } : undefined;
    const plan = appendAgreementChange(withTargets, {
      id: newId('pac'), acceptedAt: new Date().toISOString(), kind: 'targets', entryId, reason: current.offer.reason,
      targets: current.offer.remainingIndices.map(index => ({ setIndex: index, target: { ...current.offer.next } })),
    });
    return { ...latest, entries, plan };
  });
  flushSave();
  return true;
}

export function dismissLiveAdjustment(entryId: string, expectedStartedAt: string, expected: LiveAdjustment): boolean {
  const a = active();
  if (!a || a.startedAt !== expectedStartedAt) return false;
  const current = currentLiveAdjustment(a, entryId, expected.sourceSet);
  if (!current || current.offer.key !== expected.key) return false;
  patchActive(latest => latest !== a ? latest : {
    ...latest,
    entries: latest.entries.map((candidate, index) => index !== current.entryIndex ? candidate : {
      ...candidate,
      coachDecision: { key: current.offer.key, action: 'dismissed' as const },
    }),
  });
  flushSave();
  return true;
}

/** Hide the read-only preparation ramp for this active session only. */
export function dismissWarmup(expectedStartedAt: string): boolean {
  const a = active();
  if (!a || a.startedAt !== expectedStartedAt) return false;
  patchActive(latest => latest !== a ? latest : { ...latest, warmupDismissed: true });
  flushSave();
  return true;
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
  let plan = a.plan;
  for (const entry of a.entries) {
    if (seenWorkingSetIndices(plan, entry.planEntryId).some(index => !entry.sets[index] || !isWorkingSet(entry.sets[index]!))) {
      plan = invalidateAssessmentEntry(plan, entry.planEntryId);
    }
  }
  const exercises = a.entries
    .filter(e => !e.skipped)
    .map(e => {
      const hasCapturedEntry = !!plan?.entries.some(planEntry => planEntry.id === e.planEntryId);
      const actualSetIndices = hasCapturedEntry && e.planComparisonValid !== false
        ? e.sets.map((set, index) => isWorkingSet(set) ? index : -1).filter(index => index >= 0)
        : undefined;
      return { exerciseId: e.exerciseId, name: e.name, sets: e.sets.filter(isWorkingSet), planEntryId: hasCapturedEntry ? e.planEntryId : undefined, actualSetIndices };
    })
    .filter(e => e.sets.length);
  const session: Session = {
    // Reused from the active session so the recording already points at it. A
    // session resumed from before this feature has none, so one is minted.
    id: a.id ?? newId('s'),
    splitId: a.splitId,
    splitName: split?.name ?? 'Workout',
    day: dayKey(now),
    startedAt: a.startedAt,
    endedAt: now.toISOString(),
    durationSec: elapsedSec(a, now.getTime()),
    exercises,
    plan,
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
  if (exercises.length) {
    // Closing the recording window is native work and may fail or be absent;
    // it must never prevent the workout itself from saving.
    void finishHeartRateSession(session.id, session.endedAt).then(summary => {
      if (!summary || !summary.sampleCount) return;
      update(current => ({ ...current, sessions: current.sessions.map(value => value.id === session.id ? { ...value, heartRate: summary } : value) }));
      flushSave();
    }).catch(() => undefined);
  } else {
    // Nothing was logged, so nothing is saved to attach a recording to.
    void discardHeartRateSession(session.id);
  }
  void cancelRestDone();
  void resyncReminders();
  refreshPreferenceFactsIfStale();
  void haptic.success();
  return { session, changedTemplate };
}

export function discardSession(): void {
  const sessionId = state.value.active?.id;
  update(s => ({ ...s, active: null }));
  flushSave();
  if (sessionId) void discardHeartRateSession(sessionId);
  void cancelRestDone();
}

/** Sets a session's note text, by id. Clears its old flags: a changed note needs a fresh read, not the last one's tags. */
export function setSessionNote(sessionId: string, note: string): void {
  update(s => ({ ...s, sessions: s.sessions.map(x => (x.id === sessionId ? { ...x, note: note || undefined, noteFlags: undefined } : x)) }));
  flushSave();
}

/** Rate exactly one saved working set while its canonical fingerprint is still current. */
export function setSessionEffort(sessionId: string, exerciseIndex: number, setIndex: number, expectedFingerprint: string, effort: Effort): boolean {
  if (effort !== 'easy' && effort !== 'ideal' && effort !== 'max') return false;
  const session = state.value.sessions.find(candidate => candidate.id === sessionId);
  const set = session?.exercises[exerciseIndex]?.sets[setIndex];
  if (!session || !set || !isWorkingSet(set) || set.effort === 'easy' || set.effort === 'ideal' || set.effort === 'max'
    || effortSetFingerprint(session, exerciseIndex, setIndex) !== expectedFingerprint) return false;
  update(current => ({
    ...current,
    sessions: current.sessions.map(candidate => candidate !== session ? candidate : {
      ...candidate,
      exercises: candidate.exercises.map((exercise, candidateExerciseIndex) => candidateExerciseIndex !== exerciseIndex ? exercise : {
        ...exercise,
        sets: exercise.sets.map((candidateSet, candidateSetIndex) => candidateSetIndex !== setIndex ? candidateSet : { ...candidateSet, effort }),
      }),
    }),
  }));
  flushSave();
  return true;
}

/**
 * The online coach's read of a session's note arrives after the request
 * that started it, sometimes after the screen that asked has closed. This
 * merges those flags only while the submitted note is still current, so
 * a late response cannot tag a newer note. Unrelated set edits are preserved.
 */
export function applySessionNoteFlags(sessionId: string, expectedNote: string, flags: NoteFlag[]): boolean {
  const session = state.value.sessions.find(candidate => candidate.id === sessionId);
  if (!flags.length || !session || session.note !== expectedNote) return false;
  update(s => ({ ...s, sessions: s.sessions.map(candidate => candidate === session ? { ...candidate, noteFlags: flags } : candidate) }));
  flushSave();
  return true;
}
