/**
 * The only place a coach suggestion changes app state, and only when the
 * user accepts it. Dismissals are remembered so the same suggestion does
 * not keep coming back.
 */
import type { CoachChange, Weekday } from '@/core/models';
import { WEEKDAYS } from '@/core/models';
import { flushSave, state, update } from '@/core/store';
import { addDays } from '@/core/dates';
import { findExercise } from '@/core/exercises';
import type { Proposal } from '@/brain/coach/contract';
import { clock } from '@/brain/coach/words';
import { MAX_SPLITS, addExerciseToSplit, createSplit, removeExerciseFromSplit, setFocus, setSplitSets } from '../workout/splits';
import { resyncReminders } from '../settings/reminders';

/** Hide a suggestion for this many days after one dismissal. A second dismissal suppresses it. */
export const SNOOZE_DAYS = 3;

function remember(key: string, today: string): void {
  update(s => ({ ...s, coach: { ...s.coach, accepted: { ...s.coach.accepted, [key]: today } } }));
}

/** Apply a proposal. Returns a plain-words confirmation, or a reason nothing changed. */
export function acceptProposal(p: Proposal, today: string): string {
  const a = p.apply;
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
      if (!splitId) return 'Nothing to plan today';
      const changes: CoachChange[] = splitId === p.subject.splitId ? a.modifications.map(c => (c.replaceWithExerciseId ? { removeExerciseId: c.removeExerciseId, replaceWithExerciseId: c.replaceWithExerciseId } : { removeExerciseId: c.removeExerciseId })) : [];
      update(s => ({ ...s, coach: { ...s.coach, todayPlan: { day: today, splitId, changes } } }));
      message = `Today: ${state.value.splits.find(sp => sp.id === splitId)?.name ?? 'planned'}`;
      break;
    }
    case 'exercise_swap': {
      const to = findExercise(a.toExerciseId, state.value.customExercises);
      if (!to) return 'That exercise is not in the library any more';
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
  remember(p.dismissKey, today);
  flushSave();
  return message;
}

export function dismissProposal(p: Proposal, today: string): void {
  update(s => ({
    ...s,
    coach: {
      ...s.coach,
      dismissed: { ...s.coach.dismissed, [p.dismissKey]: (s.coach.dismissed[p.dismissKey] ?? 0) + 1 },
      snoozedUntil: { ...s.coach.snoozedUntil, [p.dismissKey]: addDays(today, SNOOZE_DAYS) },
    },
  }));
  flushSave();
}

/** Forget every dismissal and acceptance, so suppressed suggestions can return. */
export function resetCoachMemory(): void {
  update(s => ({ ...s, coach: { ...s.coach, dismissed: {}, snoozedUntil: {}, accepted: {} } }));
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
