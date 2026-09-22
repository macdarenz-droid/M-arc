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
  /** Main lifts get the goal's main rep range; everything else gets the accessory range. */
  role: 'main' | 'accessory';
  /** True for exercises the user created. */
  custom?: boolean;
}

export type SetFidelity = 'live' | 'delayed' | 'retro' | 'edited';
export type SetFlag = 'implausible_load' | 'implausible_reps' | 'unit_suspect' | 'duplicate' | 'future_time';

export interface LoggedSet {
  kg?: number;
  reps?: number;
  effort?: Effort;
  durationSec?: number;
  distanceM?: number;
  /** Commit time. Absent for sets from before this field existed, or the past-session flow. */
  at?: string;
  /** Seconds since the previous commit in this session, capped at 600. */
  restSec?: number;
  fidelity?: SetFidelity;
  flags?: SetFlag[];
}

export interface LoggedExercise {
  exerciseId: string;
  name: string;
  sets: LoggedSet[];
}

/** How a session was logged, and how much its timing can be trusted. See brain/fidelity.ts. */
export interface SessionLogging {
  mode: 'live' | 'mixed' | 'retro' | 'legacy';
  /** When training actually started: the timer, the user's own answer, the schedule slot, or a 17:00 default. */
  trainedAt: string;
  trainedEndAt: string;
  /** When Finish (or Save) was tapped. */
  loggedAt: string;
  timeSource: 'timer' | 'user' | 'schedule' | 'default';
  /** 0-1 share of sets with fidelity 'live'. */
  liveShare: number;
  timingTrusted: boolean;
  contentConfidence: 'high' | 'medium' | 'low';
  flags: string[];
}

export interface Session {
  id: string;
  splitId: string;
  splitName: string;
  /** Local calendar day, YYYY-MM-DD. Derived from logging.trainedAt, never from when it was logged. */
  day: string;
  startedAt: string;
  endedAt: string;
  durationSec: number;
  exercises: LoggedExercise[];
  logging: SessionLogging;
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
  birthYear?: number;
  /** Month the user started training, YYYY-MM. Defaults to the first session's month. */
  trainingSince?: string;
  /** Preferred training days per week, independent of which days are actually scheduled. */
  plannedDays?: number;
}

export interface WeightEntry {
  day: string;
  kg: number;
}

export type ProfileField = 'bodyWeightKg' | 'heightCm' | 'birthYear' | 'sex' | 'goal' | 'trainingSince' | 'plannedDays';
export interface ProfileChange {
  at: string;
  field: ProfileField;
  from: unknown;
  to: unknown;
  source: 'user' | 'onboarding' | 'health_connect' | 'migration';
}

export interface Onboarding {
  completedAt?: string;
  /** ISO timestamps of "Later" taps, newest last, so the sheet can back off after a few. */
  dismissedAt: string[];
  lastReviewAt?: string;
}

/** A day's soreness-only check-in (recovery v2). Sleep quality and mood join this later without a migration. */
export interface CheckIn {
  day: string;
  soreness?: Partial<Record<MuscleId, 1 | 2 | 3 | 4 | 5>>;
  sleepQuality?: 1 | 2 | 3 | 4 | 5;
  mood?: 1 | 2 | 3 | 4 | 5;
  note?: string;
}

/** Recovery-model self-calibration (6.11 point 8). Bounded, slow, two-sided. */
export interface RecoveryModel {
  tauScale: Partial<Record<MuscleId, number>>;
  observations: Partial<Record<MuscleId, number>>;
}

/** A muscle the user marked recovered from the muscle sheet, overriding the model for today. */
export interface FreshMark {
  muscle: MuscleId;
  at: string;
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

/** One day's Health Connect readings. `restingHr`/`latestHr` are point samples, not averages. */
export interface DailyHealth {
  day: string;
  restingHr?: number;
  restingHrAt?: string;
  latestHr?: number;
  latestHrAt?: string;
  sleepMinutes?: number;
  sleepEndAt?: string;
  steps?: number;
  activeCalories?: number;
  source: 'health_connect' | 'watch' | 'manual';
  syncedAt: string;
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
  /** Daily Health Connect history, newest last, capped at 180 days. */
  healthDays: DailyHealth[];
  /** Weigh-ins, newest last, capped at 400. */
  weightLog: WeightEntry[];
  /** Changes to profile facts, newest last, capped at 500. */
  profileHistory: ProfileChange[];
  onboarding: Onboarding;
  /** Per-muscle soreness check-ins, newest last, capped at 180. */
  checkIns: CheckIn[];
  recoveryModel: RecoveryModel;
  /** "Mark as fresh" overrides, newest last, capped at 100. Cleared once older than the muscle's fullInHours. */
  freshMarks: FreshMark[];
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
    healthDays: [],
    weightLog: [],
    profileHistory: [],
    onboarding: { dismissedAt: [] },
    checkIns: [],
    recoveryModel: { tauScale: {}, observations: {} },
    freshMarks: [],
  };
}

export function newId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}_${rand}`;
}
