import { signal, computed, batch } from '@preact/signals';
import {
  freshState,
  PLAN_MAX_METADATA_ENTRIES,
  PLAN_MAX_METADATA_SETS,
  type ActiveSession,
  type AppState,
  type AskThreadTurn,
  type DismissalEvidence,
  type LoggedExercise,
  type PlanSetTarget,
  type Session,
  type WorkoutPlanEntry,
  type WorkoutPlanSnapshot,
} from './models';
import { convertLegacy, readLegacy } from './migrate';
import { isGoalId } from '@/data/goals';

export const STATE_KEY = 'marc.state.v1';
const BACKUP_KEY = 'marc.state.v1.backup';

type Storagelike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function isState(v: unknown): v is AppState {
  return !!v && typeof v === 'object' && (v as AppState).version === 1 && Array.isArray((v as AppState).sessions) && Array.isArray((v as AppState).splits);
}

const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const shortString = (value: unknown): value is string => typeof value === 'string' && value.length > 0 && value.length <= 500;
const oneOf = <T extends string>(value: unknown, choices: readonly T[]): value is T => typeof value === 'string' && choices.includes(value as T);
const validDay = (value: unknown): value is string => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
const CONFIDENCES = ['low', 'medium', 'high'] as const;
const FINDING_KINDS = ['volume_drop', 'volume_spike', 'weekly_sets_out_of_band', 'uncovered_muscle', 'plateau', 'decline', 'progressing', 'under_recovered', 'effort_missing', 'effort_drift_harder', 'effort_drift_easier', 'effort_mismatch', 'rep_range_mismatch', 'redundant_exercises', 'chronic_skip', 'week_review', 'session_execution', 'balance_imbalance', 'long_gap', 'habit_pattern', 'consistency_drift', 'focus_behind', 'low_sleep_readiness', 'low_readiness', 'record', 'first_sessions', 'note_flag'] as const;

function validDismissalEvidence(value: unknown): value is DismissalEvidence {
  if (!object(value) || !validDay(value.day) || typeof value.proposalFingerprint !== 'string' || typeof value.reopenedOnce !== 'boolean' || !Array.isArray(value.findings)) return false;
  return value.findings.every(finding => object(finding)
    && shortString(finding.id) && oneOf(finding.kind, FINDING_KINDS)
    && finite(finding.severity) && Number.isInteger(finding.severity) && finding.severity >= 0 && finding.severity <= 3
    && oneOf(finding.confidence, CONFIDENCES)
    && Array.isArray(finding.sessionIds) && finding.sessionIds.length <= 64 && finding.sessionIds.every(shortString)
    && Array.isArray(finding.sessionFingerprints) && finding.sessionFingerprints.length === finding.sessionIds.length
    && finding.sessionFingerprints.every(item => typeof item === 'string'));
}

function normalizeDismissalEvidence(value: unknown): Record<string, DismissalEvidence> {
  if (!object(value)) return {};
  const valid: Array<[string, DismissalEvidence]> = [];
  for (const [key, entry] of Object.entries(value)) if (shortString(key) && validDismissalEvidence(entry)) valid.push([key, entry]);
  return Object.fromEntries(valid
    .sort(([keyA, a], [keyB, b]) => a.day.localeCompare(b.day) || keyA.localeCompare(keyB))
    .slice(-100));
}

const validFlags = (value: unknown, max: number): value is boolean[] => Array.isArray(value) && value.length <= max && value.every(flag => typeof flag === 'boolean');

function normalizeAskTurn(turn: AskThreadTurn): AskThreadTurn {
  const draftDismissed = validFlags(turn.draftDismissed, turn.drafts?.length ?? 0) ? turn.draftDismissed : undefined;
  const actionDismissed = validFlags(turn.actionDismissed, turn.actions?.length ?? 0) ? turn.actionDismissed : undefined;
  const scheduleDismissed = typeof turn.scheduleDismissed === 'boolean' && !!turn.scheduleDraft ? turn.scheduleDismissed : undefined;
  return { ...turn, draftDismissed, actionDismissed, scheduleDismissed };
}

function validTarget(value: unknown): value is PlanSetTarget {
  if (!object(value)) return false;
  return (value.kg === null || (finite(value.kg) && value.kg >= 0))
    && (value.reps === null || (finite(value.reps) && Number.isInteger(value.reps) && value.reps > 0))
    && (value.durationSec === null || (finite(value.durationSec) && value.durationSec >= 0));
}

function validDeload(value: unknown): value is WorkoutPlanSnapshot['deload'] {
  if (value === null) return true;
  return object(value) && shortString(value.from) && shortString(value.to)
    && finite(value.loadFactor) && value.loadFactor > 0 && value.loadFactor <= 1
    && oneOf(value.effortCap, ['easy', 'ideal'] as const);
}

function validPlanEntry(value: unknown): value is WorkoutPlanEntry {
  if (!object(value) || !shortString(value.id) || !shortString(value.exerciseId) || !shortString(value.name)) return false;
  if (!(value.mode === null || oneOf(value.mode, ['weighted', 'bodyweight', 'assisted', 'duration', 'conditioning'] as const))) return false;
  if (!oneOf(value.origin, ['start', 'added', 'replacement'] as const)) return false;
  if (value.replaces !== undefined && !shortString(value.replaces)) return false;
  if (!finite(value.plannedSets) || !Number.isInteger(value.plannedSets) || value.plannedSets < 1 || value.plannedSets > PLAN_MAX_METADATA_SETS) return false;
  if (!oneOf(value.targetSource, ['history', 'starter', 'unavailable'] as const) || typeof value.allowIncrease !== 'boolean') return false;
  if (!Array.isArray(value.targets) || value.targets.length > PLAN_MAX_METADATA_SETS || !value.targets.every(validTarget)) return false;
  if (value.targetSource === 'unavailable' ? value.targets.length !== 0 : value.targets.length !== value.plannedSets) return false;
  if (value.excluded !== undefined && !oneOf(value.excluded, ['skipped', 'removed', 'replaced'] as const)) return false;
  if (value.acceptedTargets !== undefined && (!Array.isArray(value.acceptedTargets) || value.acceptedTargets.length > PLAN_MAX_METADATA_SETS || !value.acceptedTargets.every(target => target === null || validTarget(target)))) return false;
  return true;
}

function validPlan(value: unknown): value is WorkoutPlanSnapshot {
  if (!object(value) || value.version !== 1 || !shortString(value.capturedAt) || !Number.isFinite(Date.parse(value.capturedAt))) return false;
  if (!isGoalId(value.goal) || !validDeload(value.deload)) return false;
  if (!Array.isArray(value.entries) || value.entries.length > PLAN_MAX_METADATA_ENTRIES || !value.entries.every(validPlanEntry)) return false;
  const ids = value.entries.map(entry => entry.id);
  return new Set(ids).size === ids.length;
}

function normalizeLoggedExercise(exercise: LoggedExercise, planEntries: Map<string, WorkoutPlanEntry> | null): LoggedExercise {
  const linkedEntry = planEntries !== null && shortString(exercise.planEntryId) ? planEntries.get(exercise.planEntryId) : undefined;
  const linked = !!linkedEntry && linkedEntry.exerciseId === exercise.exerciseId;
  if (!linked) {
    const { planEntryId: _planEntryId, actualSetIndices: _actualSetIndices, ...actual } = exercise;
    return actual;
  }
  const indices = exercise.actualSetIndices;
  const validIndices = Array.isArray(indices)
    && indices.length === exercise.sets.length
    && indices.length <= PLAN_MAX_METADATA_SETS
    && indices.every((index, position) => Number.isInteger(index) && index >= 0 && index < PLAN_MAX_METADATA_SETS && (position === 0 || index > indices[position - 1]!));
  return validIndices ? exercise : { ...exercise, actualSetIndices: undefined };
}

function normalizeSessionMetadata(session: Session): Session {
  const plan = validPlan(session.plan) ? session.plan : undefined;
  const planEntries = plan ? new Map(plan.entries.map(entry => [entry.id, entry])) : null;
  return { ...session, plan, exercises: (session.exercises ?? []).map(exercise => normalizeLoggedExercise(exercise, planEntries)) };
}

function normalizeActiveMetadata(active: ActiveSession | null): ActiveSession | null {
  if (!active) return null;
  const plan = validPlan(active.plan) ? active.plan : undefined;
  const planEntries = plan ? new Map(plan.entries.map(entry => [entry.id, entry])) : null;
  const entries = (active.entries ?? []).map(entry => {
    const linkedEntry = planEntries !== null && shortString(entry.planEntryId) ? planEntries.get(entry.planEntryId) : undefined;
    const linked = !!linkedEntry && linkedEntry.exerciseId === entry.exerciseId;
    const overrides = Array.isArray(entry.targetOverrides) && entry.targetOverrides.length <= PLAN_MAX_METADATA_SETS
      && entry.targetOverrides.every(target => target === null || validTarget(target)) ? entry.targetOverrides : undefined;
    const decision = object(entry.coachDecision) && shortString(entry.coachDecision.key)
      && oneOf(entry.coachDecision.action, ['accepted', 'dismissed'] as const) ? entry.coachDecision : undefined;
    return {
      ...entry,
      planEntryId: linked ? entry.planEntryId : undefined,
      planComparisonValid: linked && typeof entry.planComparisonValid === 'boolean' ? entry.planComparisonValid : undefined,
      targetOverrides: linked ? overrides : undefined,
      coachDecision: linked ? decision : undefined,
    };
  });
  return {
    ...active,
    plan,
    entries,
    warmupDismissed: typeof active.warmupDismissed === 'boolean' ? active.warmupDismissed : undefined,
  };
}

/** Fill in fields added after a state was first saved. */
function normalize(s: AppState): AppState {
  const fresh = freshState();
  return {
    ...fresh,
    ...s,
    goal: isGoalId(s.goal) ? s.goal : fresh.goal,
    profile: { ...fresh.profile, ...s.profile },
    preferences: { ...fresh.preferences, ...s.preferences, reminders: { ...fresh.preferences.reminders, ...s.preferences?.reminders } },
    schedule: { ...fresh.schedule, ...s.schedule },
    health: { ...fresh.health, ...s.health },
    sessions: (s.sessions ?? []).map(normalizeSessionMetadata),
    active: normalizeActiveMetadata(s.active ?? null),
    splits: (s.splits ?? []).map(sp => ({ ...sp, focus: sp.focus ?? [], exercises: sp.exercises ?? [] })),
    body: s.body ?? [],
    customExercises: s.customExercises ?? [],
    readiness: s.readiness ?? [],
    coach: {
      ...fresh.coach,
      ...s.coach,
      dismissed: { ...s.coach?.dismissed },
      snoozedUntil: { ...s.coach?.snoozedUntil },
      accepted: { ...s.coach?.accepted },
      dismissalEvidence: normalizeDismissalEvidence(s.coach?.dismissalEvidence),
      learnedStarts: { ...s.coach?.learnedStarts },
      askThread: Array.isArray(s.coach?.askThread) ? s.coach.askThread.map(normalizeAskTurn) : [],
    },
  };
}

export function loadState(storage: Storagelike = localStorage): { state: AppState; source: 'saved' | 'backup' | 'legacy' | 'fresh' } {
  const tryKey = (key: string): AppState | null => {
    try {
      const raw = storage.getItem(key);
      if (!raw) return null;
      const parsed: unknown = JSON.parse(raw);
      return isState(parsed) ? normalize(parsed) : null;
    } catch {
      return null;
    }
  };
  const saved = tryKey(STATE_KEY);
  if (saved) return { state: saved, source: 'saved' };
  const backup = tryKey(BACKUP_KEY);
  if (backup) return { state: backup, source: 'backup' };
  const legacy = readLegacy(storage);
  if (legacy?.workouts) return { state: convertLegacy(legacy), source: 'legacy' };
  return { state: freshState(), source: 'fresh' };
}

export const state = signal<AppState>(freshState());
export const bootSource = signal<'saved' | 'backup' | 'legacy' | 'fresh'>('fresh');
export const saveError = signal<string | null>(null);

let storageRef: Storagelike | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

export function initStore(storage: Storagelike = localStorage): void {
  storageRef = storage;
  const loaded = loadState(storage);
  batch(() => {
    state.value = loaded.state;
    bootSource.value = loaded.source;
  });
  if (loaded.source !== 'saved') persistNow();
}

export function persistNow(): boolean {
  if (!storageRef) return false;
  try {
    const raw = JSON.stringify(state.value);
    const previous = storageRef.getItem(STATE_KEY);
    storageRef.setItem(STATE_KEY, raw);
    if (previous && previous !== raw) storageRef.setItem(BACKUP_KEY, previous);
    saveError.value = null;
    return true;
  } catch (err) {
    saveError.value = 'Could not save. Free some storage space and try again.';
    console.warn('save failed', err);
    return false;
  }
}

function persistSoon(): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { saveTimer = null; persistNow(); }, 250);
}

/** Apply a change to the state. The updater must return a new object (spread). */
export function update(fn: (s: AppState) => AppState): void {
  state.value = fn(state.value);
  persistSoon();
}

export function replaceState(next: AppState): void {
  state.value = normalize(next);
  persistNow();
}

export function flushSave(): void {
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
  persistNow();
}

export const sessions = computed(() => state.value.sessions);
export const splits = computed(() => state.value.splits);
export const preferences = computed(() => state.value.preferences);
export const customExercises = computed(() => state.value.customExercises);
export const allExercisesLookup = computed(() => state.value.customExercises);
