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

/**
 * What a session note was tagged as. Never a diagnosis, never a cause,
 * never a severity — only that the note mentioned this kind of thing and,
 * for pain or discomfort, which muscle it named, if any.
 */
export type NoteFlagKind = 'pain_or_discomfort' | 'equipment_issue' | 'fatigue' | 'schedule' | 'form_check' | 'positive';

export interface NoteFlag {
  kind: NoteFlagKind;
  muscle: MuscleId | null;
}

/**
 * One 10-second morning check-in: a trimmed, 3-item Hooper-style wellness
 * scale (sleep, soreness, stress — subjective_readiness_monitoring), each
 * 1 (worst) to 5 (best). At most one entry per day.
 */
export interface ReadinessEntry {
  day: string;
  sleep: 1 | 2 | 3 | 4 | 5;
  soreness: 1 | 2 | 3 | 4 | 5;
  stress: 1 | 2 | 3 | 4 | 5;
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
  /** Free text the person wrote about this session. Optional; most sessions have none. */
  note?: string;
  /** What `note` was tagged as, from the online coach. Empty until the person has both a note and the coach on. */
  noteFlags?: NoteFlag[];
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

/** One split proposal from an "Ask Escobar" reply, as persisted — mirrors SplitDraft in src/ai/ask.ts, kept as its own structural type here (rather than importing that one) the same way this app already mirrors a shape across layers instead of reaching across them. */
export interface AskThreadDraft {
  action: 'create' | 'modify';
  splitId: string | null;
  name: string;
  focus: MuscleId[];
  exercises: Array<{ exerciseId: string; sets: number }>;
}

/**
 * A proposal to switch the person's training goal, as persisted — mirrors
 * GoalChangeAction in src/ai/ask.ts, the first (and so far only) member of
 * the general "actions" envelope the intelligence audit's Tier 3 asked
 * for. Kept a plain discriminated shape (a "kind" tag) so a real future
 * action kind (reminders, session control) is a new union member later,
 * not a rewrite of this or of AskThreadDraft/scheduleDraft above, which
 * stay their own separate fields for now — see the doc comment on
 * AskActionSchema in proxy/src/anthropic.ts for the full scoping rationale.
 */
export interface AskThreadGoalChangeAction {
  kind: 'goal_change';
  goal: GoalId;
}

/** The general typed-action envelope, as persisted. Currently just AskThreadGoalChangeAction. */
export type AskThreadAction = AskThreadGoalChangeAction;

/**
 * One turn of the "Ask Escobar" conversation, as persisted in CoachState —
 * mirrors AskSheet.tsx's local AskBubble shape. Closing the sheet (or the
 * app) used to lose the whole conversation, along with any stated
 * constraint ("my elbow is bad, no curls") the person had just typed —
 * found in the intelligence audit's Tier 3. Persisting the full turn, not
 * just role/text, means a split or schedule action shown earlier still
 * renders correctly (including whether it was already applied) after
 * reopening rather than becoming a stale, unlabeled proposal.
 */
export interface AskThreadTurn {
  role: 'user' | 'assistant';
  text: string;
  scope?: 'personal' | 'general';
  category?: 'nutrition' | 'body' | 'training' | 'app' | 'general';
  drafts?: AskThreadDraft[];
  applied?: boolean[];
  scheduleDraft?: Record<Weekday, string | null> | null;
  scheduleApplied?: boolean;
  concern?: 'crisis' | 'disordered_eating' | null;
  trimmed?: number;
  actions?: AskThreadAction[];
  /** Parallel to "actions": null before that action is applied; the goal it replaced once applied, so "Undo" can restore exactly that (and revert this back to null). */
  actionPrev?: Array<GoalId | null>;
}

/** At most this many turns persist — oldest dropped first. Bounds how much the "Ask Escobar" thread adds to the saved state; a much higher ceiling than MAX_HISTORY_TURNS in src/ai/ask.ts, which caps what's actually resent to the model each call, not what's kept on screen. */
export const MAX_ASK_THREAD_TURNS = 40;
/** Mirrors MAX_PREFERENCE_CHARS in proxy/src/handler.ts — a stated constraint is sent to /ask merged into the same "preferences" list, so it's bound by the same per-fact length cap the proxy already enforces. */
export const MAX_STATED_CONSTRAINT_CHARS = 160;
/** At most this many stated constraints persist — oldest dropped first once a new one arrives past the cap. */
export const MAX_STATED_CONSTRAINTS = 12;

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
  /** The Cloudflare Worker proxy URL. Defaults to DEFAULT_PROXY_URL (this is a personal, single-deployment app, not a generic template — there is only one real Worker to point at), so the "Online coach" toggle alone turns everything on. Still editable in Settings for a future redeploy under a different URL. */
  explainerUrl: string;
  /** Random id for per-device quotas at the proxy. Not tied to anything personal. */
  deviceId: string;
  /**
   * Short, plain-word facts the coach has learned about how this person
   * responds to its own suggestions over time (which kinds they turn down
   * or usually accept, whether they use a learned schedule) — never a
   * diagnosis, never a body measurement, never invented. Recomputed at
   * most weekly and sent as extra context to the remote coach, since a
   * dismissed suggestion drops out of the report and would otherwise be
   * forgotten. Empty until the first computation.
   */
  preferenceFacts: string[];
  /** ISO timestamp preferenceFacts was last computed, or null before the first time. */
  preferencesUpdatedAt: string | null;
  /** The "Ask Escobar" conversation, persisted so it survives closing the sheet or the app — see AskThreadTurn. Oldest-first, capped at MAX_ASK_THREAD_TURNS. */
  askThread: AskThreadTurn[];
  /**
   * Durable facts the person has stated about their own body, equipment or
   * training preferences in the "Ask Escobar" chat (an injury to work
   * around, "I only have dumbbells at home") — flagged by the coach itself
   * (AskReply's own "constraints", the same "brain decides, words explain"
   * pattern rule 17's "concern" flag already uses) rather than guessed
   * client-side from the raw chat text. Merged into "preferences" on every
   * future /ask call so a stated constraint carries forward without the
   * person needing to repeat it in a new conversation. Capped at
   * MAX_STATED_CONSTRAINTS, oldest dropped first.
   */
  statedConstraints: string[];
}

/**
 * The one real Worker this app talks to. Baked in rather than left for the
 * person to paste in on every fresh install, data reset or new device: this
 * is a personal app with a single Cloudflare deployment, not a template
 * other people self-host under their own URL, so there is nothing to ask
 * the person to fill in. Still a plain Settings field if that ever changes
 * (a redeploy under a new name, for instance) — this is only the default.
 */
export const DEFAULT_PROXY_URL = 'https://marc-coach.mmarcdarenz.workers.dev';

export function emptyCoach(): CoachState {
  return { dismissed: {}, snoozedUntil: {}, accepted: {}, learnedStarts: {}, smartReminders: false, todayPlan: null, deload: null, remoteExplainer: false, explainerUrl: DEFAULT_PROXY_URL, deviceId: '', preferenceFacts: [], preferencesUpdatedAt: null, askThread: [], statedConstraints: [] };
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
  /** At most one per day. */
  readiness: ReadinessEntry[];
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
    readiness: [],
  };
}

export function newId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}_${rand}`;
}
