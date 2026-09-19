/**
 * Everything the brain needs, as plain data. Built from AppState by the
 * app, or by hand in tests. The brain never reads the store directly.
 */
import type { AppState, Exercise, HealthSnapshot, ReadinessEntry, Session, Split, Weekday } from '@/core/models';
import type { GoalId } from '@/data/goals';

export interface BrainContext {
  sessions: Session[];
  splits: Split[];
  schedule: Record<Weekday, string | null>;
  custom: Exercise[];
  goal: GoalId;
  restDefaultSec: number;
  health: HealthSnapshot;
  readiness: ReadinessEntry[];
  /** Local day key, YYYY-MM-DD. */
  today: string;
  /** Epoch milliseconds. */
  now: number;
  /** dismissKey → how many times the user dismissed that suggestion. */
  dismissed: Record<string, number>;
  /** dismissKey → day the user accepted that suggestion. */
  accepted: Record<string, string>;
}

export function contextFromState(state: AppState, today: string, now: number): BrainContext {
  return {
    sessions: state.sessions,
    splits: state.splits,
    schedule: state.schedule,
    custom: state.customExercises,
    goal: state.goal,
    restDefaultSec: state.preferences.restDefaultSec,
    health: state.health,
    readiness: state.readiness,
    today,
    now,
    dismissed: state.coach?.dismissed ?? {},
    accepted: state.coach?.accepted ?? {},
  };
}
