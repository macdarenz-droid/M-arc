/**
 * Which drafts in the saved Escobar conversation can still be applied: a
 * split to create or change, a new weekly schedule, a goal change. Each is
 * identified by its turn's content fingerprint, so a tap on a stale bubble
 * (the thread was cleared, trimmed or restored meanwhile) can never apply
 * something else. Ported from the Escobar line's reopen.ts. Pure.
 */
import type { AskThreadTurn, CoachState, Split, Weekday } from '@/core/models';
import { WEEKDAYS } from '@/core/models';
import { findExercise } from '@/core/exercises';
import { GOAL_BY_ID, type GoalId } from '@/data/goals';

export interface PendingCoachItem {
  key: string;
  turnIndex: number;
  turnFingerprint: string;
  kind: 'split' | 'schedule' | 'goal';
  itemIndex: number;
  title: string;
  actionable: boolean;
}

const canonical = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      const entry = (value as Record<string, unknown>)[key];
      if (entry !== undefined) out[key] = canonical(entry);
    }
    return out;
  }
  return value;
};

/** The turn's content without the flags that change as the person acts on it. */
export function askTurnFingerprint(turn: AskThreadTurn): string {
  const { applied: _a, draftDismissed: _d, scheduleApplied: _sa, scheduleDismissed: _sd, actionPrev: _ap, actionDismissed: _ad, ...immutable } = turn;
  return JSON.stringify(canonical(immutable));
}

const sameSchedule = (a: Record<Weekday, string | null>, b: Record<Weekday, string | null>): boolean => WEEKDAYS.every(day => a[day] === b[day]);

/** Newest first. `actionable` is false when the draft now names a split that's gone, or the split cap is reached. */
export function pendingCoachItems(coach: CoachState, splits: Split[], schedule: Record<Weekday, string | null>, goal: GoalId, maxSplits: number): PendingCoachItem[] {
  const out: PendingCoachItem[] = [];
  const splitIds = new Set(splits.map(split => split.id));
  for (let turnIndex = coach.askThread.length - 1; turnIndex >= 0; turnIndex--) {
    const turn = coach.askThread[turnIndex]!;
    if (turn.role !== 'assistant') continue;
    const turnFingerprint = askTurnFingerprint(turn);
    const add = (kind: PendingCoachItem['kind'], itemIndex: number, title: string, actionable: boolean) => out.push({
      key: JSON.stringify([turnIndex, turnFingerprint, kind, itemIndex]), turnIndex, turnFingerprint, kind, itemIndex, title, actionable,
    });
    for (const [itemIndex, draft] of (turn.drafts ?? []).entries()) {
      if (turn.applied?.[itemIndex] || turn.draftDismissed?.[itemIndex]) continue;
      const exercisesValid = draft.exercises.length > 0 && draft.exercises.every(entry => !!findExercise(entry.exerciseId) && Number.isInteger(entry.sets) && entry.sets >= 1 && entry.sets <= 6);
      const targetValid = draft.action === 'modify' ? !!draft.splitId && splitIds.has(draft.splitId) : draft.action === 'create' && !draft.splitId && splits.length < maxSplits;
      add('split', itemIndex, `Split draft: ${draft.name}`, exercisesValid && targetValid);
    }
    if (turn.scheduleDraft && !turn.scheduleApplied && !turn.scheduleDismissed && !sameSchedule(turn.scheduleDraft, schedule)) {
      add('schedule', 0, 'Schedule draft', WEEKDAYS.every(day => turn.scheduleDraft![day] === null || splitIds.has(turn.scheduleDraft![day]!)));
    }
    for (const [itemIndex, action] of (turn.actions ?? []).entries()) {
      if (turn.actionPrev?.[itemIndex] != null || turn.actionDismissed?.[itemIndex] || action.kind !== 'goal_change' || action.goal === goal) continue;
      add('goal', itemIndex, `Goal: ${GOAL_BY_ID[action.goal]?.name ?? action.goal}`, !!GOAL_BY_ID[action.goal]);
    }
  }
  return out;
}
