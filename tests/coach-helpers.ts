/** Synthetic training histories for the coach brain tests. */
import type { Effort, LoggedSet, Session, Split, Weekday } from '@/core/models';
import { WEEKDAYS, newId } from '@/core/models';
import { addDays, parseDay, weekdayOf } from '@/core/dates';
import type { BrainContext } from '@/brain/coach/context';
import { sets } from './helpers';

export const TODAY = '2026-09-19'; // Saturday. Last complete week starts Monday 2026-09-07.
export const LAST_MONDAY = '2026-09-07';

export function mondayWeeksBefore(monday: string, weeks: number): string {
  return addDays(monday, -7 * weeks);
}

/** A session whose start time is `hour` local, so habit tests are timezone-proof. */
export function timedSession(day: string, hour: number, minute: number, exercises: Array<{ id: string; sets: LoggedSet[] }>, splitId = 'split_push'): Session {
  const d = parseDay(day);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, minute, 0, 0);
  const end = new Date(start.getTime() + 60 * 60_000);
  return {
    id: newId('s'), splitId, splitName: splitId, day, startedAt: start.toISOString(), endedAt: end.toISOString(), durationSec: 3600,
    exercises: exercises.map(e => ({ exerciseId: e.id, name: e.id, sets: e.sets })),
  };
}

export interface DaySpec {
  weekday: Weekday;
  splitId: string;
  hour?: number;
  minute?: number;
  /** Exercises for week index `w` (0 = first/oldest week). Return [] to skip that week. */
  exercises: (w: number) => Array<{ id: string; sets: LoggedSet[] }>;
}

/** Build `weeks` weeks of sessions, the last one starting on `lastMonday`. Oldest first. */
export function history(lastMonday: string, weeks: number, days: DaySpec[]): Session[] {
  const out: Session[] = [];
  for (let w = 0; w < weeks; w++) {
    const monday = mondayWeeksBefore(lastMonday, weeks - 1 - w);
    for (const spec of days) {
      const offset = (WEEKDAYS.indexOf(spec.weekday) + 6) % 7; // Monday-first
      const day = addDays(monday, offset);
      if (weekdayOf(day) !== spec.weekday) throw new Error('weekday mismatch');
      const ex = spec.exercises(w);
      if (!ex.length) continue;
      out.push(timedSession(day, spec.hour ?? 18, spec.minute ?? 0, ex, spec.splitId));
    }
  }
  return out.sort((a, b) => a.startedAt.localeCompare(b.startedAt));
}

export const PUSH_ID = 'split_push', PULL_ID = 'split_pull', LEGS_ID = 'split_legs';

export const PUSH_EX = ['lib_barbell_bench_press', 'lib_incline_dumbbell_press', 'lib_dumbbell_shoulder_press', 'lib_dumbbell_lateral_raise', 'lib_triceps_pushdown'];
export const PULL_EX = ['lib_lat_pulldown', 'lib_seated_cable_row', 'lib_face_pull', 'lib_dumbbell_biceps_curl'];
export const LEGS_EX = ['lib_leg_press', 'lib_romanian_deadlift', 'lib_leg_extension', 'lib_seated_leg_curl', 'lib_standing_calf_raise'];

export function pplSplits(): Split[] {
  const mk = (id: string, name: string, ids: string[]): Split => ({ id, name, color: '#000', exercises: ids.map(e => ({ exerciseId: e, sets: 3 })), focus: [], createdAt: '2026-01-01T00:00:00.000Z' });
  return [mk(PUSH_ID, 'Push', PUSH_EX), mk(PULL_ID, 'Pull', PULL_EX), mk(LEGS_ID, 'Legs', LEGS_EX)];
}

export const std = (ids: string[], kg = 40, reps = 8, effort: Effort | null = 'ideal', n = 3) => ids.map(id => ({ id, sets: sets(kg, reps, effort, n) }));

/** Push Monday, Pull Wednesday, Legs Friday, with a hook to vary a week. */
export function pplHistory(lastMonday: string, weeks: number, vary?: (w: number, split: 'push' | 'pull' | 'legs', ex: Array<{ id: string; sets: LoggedSet[] }>) => Array<{ id: string; sets: LoggedSet[] }>): Session[] {
  const v = vary ?? ((_, __, ex) => ex);
  return history(lastMonday, weeks, [
    { weekday: 'mon', splitId: PUSH_ID, exercises: w => v(w, 'push', std(PUSH_EX)) },
    { weekday: 'wed', splitId: PULL_ID, exercises: w => v(w, 'pull', std(PULL_EX)) },
    { weekday: 'fri', splitId: LEGS_ID, exercises: w => v(w, 'legs', std(LEGS_EX)) },
  ]);
}

export function ctx(sessions: Session[], over: Partial<BrainContext> = {}): BrainContext {
  return {
    sessions, splits: pplSplits(), schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null }, custom: [],
    goal: 'lean', restDefaultSec: 90, health: { connected: false }, today: TODAY, now: new Date('2026-09-19T12:00:00.000Z').getTime(), dismissed: {}, accepted: {},
    ...over,
  };
}
