import type { MuscleId } from '@/data/muscles';
import type { GoalId } from '@/data/goals';

export type Effort = 'easy' | 'ideal' | 'max';
export type Weekday = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
export const WEEKDAYS: Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

/**
 * How resistance works for an exercise. It decides what "progress" means:
 * weighted → more load; bodyweight → more reps; assisted → less help;
 * duration → longer; conditioning → further or longer at the same load.
 */
export type ResistanceMode = 'weighted' | 'bodyweight' | 'assisted' | 'duration' | 'conditioning';

export interface Exercise {
  id: string;
  name: string;
  equipment: string;
  primary: MuscleId[];
  secondary: MuscleId[];
  stabilizers: MuscleId[];
  aliases: string[];
  pattern: string;
  defaultSets: number;
  mode: ResistanceMode;
  /** True for exercises the user created. */
  custom?: boolean;
}

export interface LoggedSet {
  kg?: number;
  reps?: number;
  effort?: Effort;
  durationSec?: number;
  distanceM?: number;
}

export interface LoggedExercise {
  exerciseId: string;
  name: string;
  sets: LoggedSet[];
}

export interface Session {
  id: string;
  splitId: string;
  splitName: string;
  /** Local calendar day, YYYY-MM-DD. */
  day: string;
  startedAt: string;
  endedAt: string;
  durationSec: number;
  exercises: LoggedExercise[];
}

export interface SplitExercise {
  exerciseId: string;
  sets: number;
}

export interface Split {
  id: string;
  name: string;
  color: string;
  exercises: SplitExercise[];
  /** Up to two muscles the user wants to bring up with this split. */
  focus: MuscleId[];
  createdAt: string;
}

export interface RestState {
  endsAt: number;
  totalSec: number;
  pausedRemainingSec?: number;
}

export interface ActiveSession {
  splitId: string;
  startedAt: string;
  pausedMs: number;
  pausedAt?: number;
  /** Working copy of the exercises for this session. */
  entries: Array<{ exerciseId: string; name: string; sets: LoggedSet[]; done: boolean; skipped: boolean }>;
  rest?: RestState;
}

export interface Reminders {
  enabled: boolean;
  /** HH:MM local time. */
  time: string;
  style: 'silent' | 'vibrate' | 'alert';
}

export interface Preferences {
  weightUnit: 'kg' | 'lb';
  restDefaultSec: number;
  autoRest: boolean;
  haptics: boolean;
  reminders: Reminders;
  /** Show the daily quote card. */
  showSpark: boolean;
}

export interface Profile {
  name: string;
  bodyWeightKg?: number;
  heightCm?: number;
  sex?: 'male' | 'female';
}

export interface BodyMeasurement {
  day: string;
  neckCm: number;
  waistCm: number;
  hipCm?: number;
  bodyFatPct: number;
}

export interface HealthSnapshot {
  connected: boolean;
  lastSync?: string;
  sleepMinutes?: number;
  restingHr?: number;
  steps?: number;
  activeCalories?: number;
}

/** One exercise swapped or dropped for a single session, from an accepted plan. */
export interface CoachChange {
  removeExerciseId: string;
  replaceWithExerciseId?: string;
}

/** What the user has done with the coach's suggestions. Only the user writes here. */
export interface CoachState {
  /** dismissKey → how many times dismissed. Two suppresses the suggestion. */
  dismissed: Record<string, number>;
  /** dismissKey → last day it stays hidden after a single dismissal. */
  snoozedUntil: Record<string, string>;
  /** dismissKey → day the suggestion was accepted. */
  accepted: Record<string, string>;
  /** HH:MM local start times learned from history and accepted with a schedule suggestion. */
  learnedStarts: Partial<Record<Weekday, string>>;
  /** Time reminders from the learned start instead of a fixed clock time. Off until a schedule is accepted. */
  smartReminders: boolean;
  /** An accepted plan for one day: which split, and per-session exercise changes. */
  todayPlan: { day: string; splitId: string; changes: CoachChange[] } | null;
  /** An accepted easier week. */
  deload: { from: string; to: string; loadFactor: number; effortCap: 'easy' | 'ideal' } | null;
  /** Send findings to the remote explainer for richer wording. Off by default. */
  remoteExplainer: boolean;
}

export function emptyCoach(): CoachState {
  return { dismissed: {}, snoozedUntil: {}, accepted: {}, learnedStarts: {}, smartReminders: false, todayPlan: null, deload: null, remoteExplainer: false };
}

export interface AppState {
  version: 1;
  createdAt: string;
  profile: Profile;
  goal: GoalId;
  splits: Split[];
  schedule: Record<Weekday, string | null>;
  sessions: Session[];
  active: ActiveSession | null;
  customExercises: Exercise[];
  preferences: Preferences;
  body: BodyMeasurement[];
  health: HealthSnapshot;
  coach: CoachState;
  /** Set once the old single-file app's data has been imported. */
  legacyImportedAt?: string;
}

export function emptySchedule(): Record<Weekday, string | null> {
  return { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null };
}

export function freshState(now = new Date()): AppState {
  return {
    version: 1,
    createdAt: now.toISOString(),
    profile: { name: '' },
    goal: 'lean',
    splits: [],
    schedule: emptySchedule(),
    sessions: [],
    active: null,
    customExercises: [],
    preferences: {
      weightUnit: 'kg',
      restDefaultSec: 90,
      autoRest: true,
      haptics: true,
      reminders: { enabled: false, time: '17:30', style: 'silent' },
      showSpark: true,
    },
    body: [],
    health: { connected: false },
    coach: emptyCoach(),
  };
}

export function newId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}_${rand}`;
}
