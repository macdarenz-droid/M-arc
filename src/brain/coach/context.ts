/**
 * Everything the brain needs, as plain data. Built from AppState by the
 * app, or by hand in tests. The brain never reads the store directly.
 */
import type { AppState, Exercise, HealthSnapshot, Session, Split, Weekday } from '@/core/models';
import type { GoalId } from '@/data/goals';

export interface BrainContext {
  sessions: Session[];
  splits: Split[];
  schedule: Record<Weekday, string | null>;
  custom: Exercise[];
  goal: GoalId;
  restDefaultSec: number;
  health: HealthSnapshot;
  /** Local day key, YYYY-MM-DD. */
  today: string;
  /** Epoch milliseconds. */
  now: number;
  /** dismissKey → how many times the user dismissed that suggestion. */
  dismissed: Record<string, number>;
}

export function contextFromState(state: AppState, today: string, now: number, dismissed: Record<string, number> = {}): BrainContext {
  return {
    sessions: state.sessions,
    splits: state.splits,
    schedule: state.schedule,
    custom: state.customExercises,
    goal: state.goal,
    restDefaultSec: state.preferences.restDefaultSec,
    health: state.health,
    today,
    now,
    dismissed,
  };
}
