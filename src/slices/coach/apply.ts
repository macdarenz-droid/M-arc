/**
 * The only place a coach suggestion changes app state, and only when the
 * user accepts it. Dismissals are remembered so the same suggestion does
 * not keep coming back.
 */
import type { AppState, CoachChange, DismissalEvidence, Weekday } from '@/core/models';
import { WEEKDAYS } from '@/core/models';
import { flushSave, state, update } from '@/core/store';
import { addDays } from '@/core/dates';
import { findExercise } from '@/core/exercises';
import type { FindingsReport, Proposal } from '@/brain/coach/contract';
import { dismissalEvidence as captureDismissalEvidence } from '@/brain/coach/reopen';
import { clock } from '@/brain/coach/words';
import { MAX_SPLITS, addExerciseToSplit, createSplit, removeExerciseFromSplit, setFocus, setSplitSets } from '../workout/splits';
import { resyncReminders } from '../settings/reminders';

/** Hide a suggestion for this many days after one dismissal. A second dismissal suppresses it. */
export const SNOOZE_DAYS = 3;
const fromChronicSkip = (proposal: Proposal): boolean => proposal.basedOn.some(id => id.startsWith('chronic_skip:'));

function remember(proposal: Proposal, today: string): void {
  update(s => {
    const ledger = { ...(s.coach.dismissalEvidence ?? {}) };
    if (proposal.reopened && ledger[proposal.dismissKey]) ledger[proposal.dismissKey] = { ...ledger[proposal.dismissKey]!, reopenedOnce: true };
    return { ...s, coach: { ...s.coach, accepted: { ...s.coach.accepted, [proposal.dismissKey]: today }, dismissalEvidence: ledger } };
  });
}

const changedMessage = 'That suggestion has changed; review the latest coach update';

function actionIsCurrent(p: Proposal, s: AppState, today: string): boolean {
  const a = p.apply;
  const split = (id: string) => s.splits.find(candidate => candidate.id === id);
  const exercise = (id: string) => findExercise(id, s.customExercises);
  switch (a.kind) {
    case 'schedule': {
      const valid = WEEKDAYS.every(day => a.days[day] === undefined || a.days[day] === null || a.days[day]!.splitId === null || !!split(a.days[day]!.splitId!));
      const changes = WEEKDAYS.some(day => {
        const learned = a.days[day];
        if (learned === undefined) return false;
        if (learned === null) return s.schedule[day] !== null || s.coach.learnedStarts[day] !== undefined;
        const target = learned.splitId ?? s.schedule[day] ?? s.splits[0]?.id ?? null;
        return s.schedule[day] !== target || s.coach.learnedStarts[day] !== clock(learned.startHour, learned.startMinute);
      });
      return valid && (changes || (s.preferences.reminders.enabled && !s.coach.smartReminders));
    }
    case 'today_plan': {
      const splitId = a.recommendedSplitId ?? p.subject.splitId;
      const target = splitId ? split(splitId) : undefined;
      if (!target) return false;
      const valid = splitId !== p.subject.splitId || a.modifications.every(change => target.exercises.some(entry => entry.exerciseId === change.removeExerciseId)
        && (!change.replaceWithExerciseId || !!exercise(change.replaceWithExerciseId)));
      const changes: CoachChange[] = splitId === p.subject.splitId ? a.modifications.map(change => change.replaceWithExerciseId
        ? { removeExerciseId: change.removeExerciseId, replaceWithExerciseId: change.replaceWithExerciseId }
        : { removeExerciseId: change.removeExerciseId }) : [];
      return valid && JSON.stringify(s.coach.todayPlan) !== JSON.stringify({ day: today, splitId, changes });
    }
    case 'exercise_swap': {
      if (!exercise(a.toExerciseId)) return false;
      const targets = a.splitId ? [split(a.splitId)].filter(Boolean) : s.splits;
      return targets.some(target => target!.exercises.some(entry => entry.exerciseId === a.fromExerciseId))
        && targets.every(target => !target!.exercises.some(entry => entry.exerciseId === a.toExerciseId));
    }
    case 'add_exercise': {
      const target = split(a.splitId);
      return !!target && !!exercise(a.exerciseId) && Number.isInteger(a.sets) && a.sets >= 1 && a.sets <= 6
        && !target.exercises.some(entry => entry.exerciseId === a.exerciseId);
    }
    case 'split_modify': {
      const target = split(a.splitId);
      if (!target || (!a.add.length && !a.remove.length && !a.setChanges.length)) return false;
      const ids = new Set(target.exercises.map(entry => entry.exerciseId));
      const valid = a.remove.every(id => ids.has(id))
        && a.setChanges.every(change => ids.has(change.exerciseId) && Number.isInteger(change.sets) && change.sets >= 1 && change.sets <= 6)
        && a.add.every(entry => !ids.has(entry.exerciseId) && !!exercise(entry.exerciseId) && Number.isInteger(entry.sets) && entry.sets >= 1 && entry.sets <= 6);
      const changes = a.remove.length > 0 || a.add.length > 0 || a.setChanges.some(change => target.exercises.find(entry => entry.exerciseId === change.exerciseId)?.sets !== change.sets);
      return valid && changes;
    }
    case 'split_new':
      return a.splits.length > 0 && s.splits.length + a.splits.length <= MAX_SPLITS
        && a.splits.every(draft => draft.exercises.length > 0 && draft.exercises.every(entry => !!exercise(entry.exerciseId) && Number.isInteger(entry.sets) && entry.sets >= 1 && entry.sets <= 6));
    case 'load_next':
      return !!exercise(a.exerciseId) && (a.kg === null || (Number.isFinite(a.kg) && a.kg >= 0))
        && (a.reps === null || (Number.isInteger(a.reps[0]) && Number.isInteger(a.reps[1]) && a.reps[0] > 0 && a.reps[1] >= a.reps[0]));
    case 'rest_default':
      return Number.isInteger(a.seconds) && a.seconds >= 15 && a.seconds <= 600 && a.seconds !== s.preferences.restDefaultSec;
    case 'deload_week':
      return /^\d{4}-\d{2}-\d{2}$/.test(a.from) && /^\d{4}-\d{2}-\d{2}$/.test(a.to) && a.from <= a.to && a.loadFactor > 0 && a.loadFactor <= 1
        && JSON.stringify(s.coach.deload) !== JSON.stringify({ from: a.from, to: a.to, loadFactor: a.loadFactor, effortCap: a.effortCap });
  }
}

/** Apply a proposal. Returns a plain-words confirmation, or a reason nothing changed. */
export function acceptProposal(p: Proposal, today: string): string {
  const a = p.apply;
  if (p.expiresOn && today > p.expiresOn) return 'That suggestion has expired; review the latest coach update';
  if (a.kind === 'split_new' && state.value.splits.length + a.splits.length > MAX_SPLITS) return `The app holds up to ${MAX_SPLITS} splits. Delete one first.`;
  if (a.kind === 'add_exercise') {
    const target = state.value.splits.find(split => split.id === a.splitId);
    const exercise = findExercise(a.exerciseId, state.value.customExercises);
    if (target?.exercises.some(entry => entry.exerciseId === a.exerciseId) && exercise) return `${exercise.name} is already in that split`;
  }
  if (a.kind === 'exercise_swap' && a.splitId) {
    const target = state.value.splits.find(split => split.id === a.splitId);
    const exercise = findExercise(a.toExerciseId, state.value.customExercises);
    if (target?.exercises.some(entry => entry.exerciseId === a.toExerciseId) && exercise) return `${exercise.name} is already in that split`;
  }
  if (!actionIsCurrent(p, state.value, today)) return changedMessage;
  let message = 'Done';
  switch (a.kind) {
    case 'schedule': {
      update(s => {
        const schedule = { ...s.schedule };
        const learnedStarts = { ...s.coach.learnedStarts };
        for (const d of WEEKDAYS) {
          const day = a.days[d];
          if (day === undefined) continue;
          if (day === null) { schedule[d] = null; delete learnedStarts[d]; continue; }
          schedule[d] = day.splitId && s.splits.some(sp => sp.id === day.splitId) ? day.splitId : (schedule[d] ?? s.splits[0]?.id ?? null);
          learnedStarts[d] = clock(day.startHour, day.startMinute);
        }
        return { ...s, schedule, coach: { ...s.coach, learnedStarts, smartReminders: s.preferences.reminders.enabled ? true : s.coach.smartReminders } };
      });
      void resyncReminders();
      message = 'Schedule updated from your training habits';
      break;
    }
    case 'today_plan': {
      const splitId = a.recommendedSplitId ?? p.subject.splitId;
      if (!splitId) return changedMessage;
      const changes: CoachChange[] = splitId === p.subject.splitId ? a.modifications.map(c => (c.replaceWithExerciseId ? { removeExerciseId: c.removeExerciseId, replaceWithExerciseId: c.replaceWithExerciseId } : { removeExerciseId: c.removeExerciseId })) : [];
      update(s => ({ ...s, coach: { ...s.coach, todayPlan: { day: today, splitId, changes } } }));
      message = `Today: ${state.value.splits.find(sp => sp.id === splitId)?.name ?? 'planned'}`;
      break;
    }
    case 'exercise_swap': {
      const to = findExercise(a.toExerciseId, state.value.customExercises);
      if (!to) return changedMessage;
      if (a.splitId) {
        const split = state.value.splits.find(candidate => candidate.id === a.splitId);
        if (!split || !split.exercises.some(entry => entry.exerciseId === a.fromExerciseId)) return 'That split has changed; review the suggestion again';
        if (split.exercises.some(entry => entry.exerciseId === to.id)) return `${to.name} is already in that split`;
      } else if (fromChronicSkip(p)) return 'That split has changed; review the suggestion again';
      update(s => ({ ...s, splits: s.splits.map(sp => (a.splitId && sp.id !== a.splitId ? sp : { ...sp, exercises: sp.exercises.map(e => (e.exerciseId === a.fromExerciseId ? { ...e, exerciseId: to.id } : e)) })) }));
      message = `Swapped in ${to.name}`;
      break;
    }
    case 'add_exercise': {
      const ex = findExercise(a.exerciseId, state.value.customExercises);
      if (!ex) return 'That exercise is not in the library any more';
      const ok = addExerciseToSplit(a.splitId, ex, a.sets);
      message = ok ? `Added ${ex.name}` : `${ex.name} is already in that split`;
      break;
    }
    case 'split_modify': {
      if (fromChronicSkip(p)) {
        const split = state.value.splits.find(candidate => candidate.id === a.splitId);
        const remove = a.remove[0];
        if (!split || a.remove.length !== 1 || a.add.length || a.setChanges.length || !remove || !split.exercises.some(entry => entry.exerciseId === remove) || split.exercises.length <= 1) return 'That split has changed; review the suggestion again';
        update(s => ({ ...s, splits: s.splits.map(candidate => candidate.id !== split.id ? candidate : { ...candidate, exercises: candidate.exercises.filter(entry => entry.exerciseId !== remove) }) }));
        message = `Removed ${findExercise(remove, state.value.customExercises)?.name ?? 'exercise'} from ${split.name}`;
        break;
      }
      for (const id of a.remove) removeExerciseFromSplit(a.splitId, id);
      for (const e of a.add) { const ex = findExercise(e.exerciseId, state.value.customExercises); if (ex) addExerciseToSplit(a.splitId, ex, e.sets); }
      for (const c of a.setChanges) setSplitSets(a.splitId, c.exerciseId, c.sets);
      message = 'Split updated';
      break;
    }
    case 'split_new': {
      if (state.value.splits.length + a.splits.length > MAX_SPLITS) return `The app holds up to ${MAX_SPLITS} splits. Delete one first.`;
      const created: Array<{ id: string; days: Weekday[] }> = [];
      for (const d of a.splits) {
        const split = createSplit(d.name, d.exercises.map(e => ({ ...e })));
        if (!split) break;
        if (d.focus.length) setFocus(split.id, d.focus);
        created.push({ id: split.id, days: d.days });
      }
      update(s => {
        const empty = WEEKDAYS.every(d => !s.schedule[d]);
        if (!empty) return s;
        const schedule = { ...s.schedule };
        for (const c of created) for (const d of c.days) schedule[d] = c.id;
        return { ...s, schedule };
      });
      void resyncReminders();
      message = `Added ${created.length} split${created.length === 1 ? '' : 's'}`;
      break;
    }
    case 'load_next':
      message = 'Targets are shown in Train';
      break;
    case 'rest_default':
      update(s => ({ ...s, preferences: { ...s.preferences, restDefaultSec: a.seconds } }));
      message = `Rest default is now ${a.seconds}s`;
      break;
    case 'deload_week':
      update(s => ({ ...s, coach: { ...s.coach, deload: { from: a.from, to: a.to, loadFactor: a.loadFactor, effortCap: a.effortCap } } }));
      message = `Easier week until ${addDays(a.to, 0)}`;
      break;
  }
  remember(p, today);
  flushSave();
  return message;
}

export function dismissProposal(p: Proposal, today: string, report?: FindingsReport): void {
  update(s => {
    const ledger = { ...(s.coach.dismissalEvidence ?? {}) };
    if (p.reopened) {
      const previous = ledger[p.dismissKey];
      if (previous) ledger[p.dismissKey] = { ...previous, reopenedOnce: true };
      else if (report) ledger[p.dismissKey] = { ...captureDismissalEvidence(p, report, s.sessions, today), reopenedOnce: true };
    } else if (report) {
      const captured = captureDismissalEvidence(p, report, s.sessions, today);
      ledger[p.dismissKey] = { ...captured, reopenedOnce: ledger[p.dismissKey]?.reopenedOnce ?? false };
    }
    const bounded = Object.fromEntries(Object.entries(ledger)
      .sort(([keyA, a], [keyB, b]) => a.day.localeCompare(b.day) || keyA.localeCompare(keyB))
      .slice(-100)) as Record<string, DismissalEvidence>;
    return {
      ...s,
      coach: {
        ...s.coach,
        dismissed: { ...s.coach.dismissed, [p.dismissKey]: (s.coach.dismissed[p.dismissKey] ?? 0) + 1 },
        snoozedUntil: { ...s.coach.snoozedUntil, [p.dismissKey]: addDays(today, SNOOZE_DAYS) },
        dismissalEvidence: bounded,
      },
    };
  });
  flushSave();
}

/** Forget every dismissal and acceptance, so suppressed suggestions can return. */
export function resetCoachMemory(): void {
  update(s => ({ ...s, coach: { ...s.coach, dismissed: {}, snoozedUntil: {}, accepted: {}, dismissalEvidence: {} } }));
  flushSave();
}

/** Drop an accepted plan or easier week. */
export function clearTodayPlan(): void {
  update(s => ({ ...s, coach: { ...s.coach, todayPlan: null } }));
}

export function endDeload(): void {
  update(s => ({ ...s, coach: { ...s.coach, deload: null } }));
  flushSave();
}
