import { signal, computed, batch } from '@preact/signals';
import {
  freshState,
  MAX_ASSESSMENT_CHANGES,
  MAX_OBJECTIVE_EQUIPMENT_CHARS,
  MAX_OBJECTIVE_MEASURES,
  MAX_OBJECTIVE_MUSCLES,
  MAX_OBJECTIVE_STATEMENT_CHARS,
  PLAN_MAX_METADATA_ENTRIES,
  PLAN_MAX_METADATA_SETS,
  type ActiveSession,
  type AppState,
  type AskThreadTurn,
  type CoachPresence,
  type CoachPresenceDismissal,
  type DismissalEvidence,
  MAX_PRESENCE_DISMISSALS,
  type LoggedExercise,
  type PlanAgreementChange,
  type PlanSetTarget,
  type PersonalObjective,
  type Session,
  type SessionAssessment,
  type WorkoutPlanEntry,
  type WorkoutPlanSnapshot,
  WEEKDAYS,
} from './models';
import { convertLegacy, readLegacy } from './migrate';
import { isGoalId } from '@/data/goals';
import { isMuscleId } from '@/data/muscles';

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

const validIsoTimestamp = (value: unknown): value is string => typeof value === 'string' && value.length <= 40 && !Number.isNaN(Date.parse(value));

function validPresenceDismissal(value: unknown): value is CoachPresenceDismissal {
  return object(value) && shortString(value.id) && shortString(value.evidenceKey) && validIsoTimestamp(value.dismissedAt);
}

/** Malformed or oversized presence metadata drops only itself, never history. */
function normalizePresence(value: unknown): CoachPresence | undefined {
  if (!object(value)) return undefined;
  if (value.version !== 1) return undefined;
  const tone = value.tone === 'direct' ? 'direct' : value.tone === 'steady' ? 'steady' : undefined;
  if (!tone) return undefined;
  if (!Array.isArray(value.dismissed)) return undefined;
  const valid = value.dismissed.filter(validPresenceDismissal);
  const dismissed = valid
    .sort((a, b) => a.dismissedAt.localeCompare(b.dismissedAt))
    .slice(-MAX_PRESENCE_DISMISSALS);
  return { version: 1, tone, dismissed };
}

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

function validChangeTargets(value: unknown, ids: Set<string>): boolean {
  if (!Array.isArray(value) || value.length === 0 || value.length > PLAN_MAX_METADATA_SETS) return false;
  const seen = new Set<number>();
  for (const item of value) {
    if (!object(item) || !finite(item.setIndex) || !Number.isInteger(item.setIndex) || item.setIndex < 0 || item.setIndex >= PLAN_MAX_METADATA_SETS) return false;
    if (seen.has(item.setIndex)) return false;
    seen.add(item.setIndex);
    if (!validTarget(item.target)) return false;
  }
  return true;
}

/** Structural shape only — `id` uniqueness and the entryId-exists check happen in validAssessment, once, over the whole array. */
function validAssessmentChange(value: unknown, ids: Set<string>): value is PlanAgreementChange {
  if (!object(value) || !shortString(value.id) || !shortString(value.acceptedAt) || !Number.isFinite(Date.parse(value.acceptedAt))) return false;
  switch (value.kind) {
    case 'targets':
      return shortString(value.entryId) && ids.has(value.entryId)
        && oneOf(value.reason, ['max_below_target', 'easy_above_target'] as const)
        && validChangeTargets(value.targets, ids);
    case 'add':
      return shortString(value.entryId) && ids.has(value.entryId);
    case 'replace':
      return shortString(value.fromEntryId) && ids.has(value.fromEntryId)
        && shortString(value.toEntryId) && ids.has(value.toEntryId) && value.fromEntryId !== value.toEntryId;
    case 'remove':
      return shortString(value.entryId) && ids.has(value.entryId);
    default:
      return false;
  }
}

/** No cycle through `replace` edges (fromEntryId → toEntryId): follow each chain and fail on revisiting a node. */
function acyclicReplacements(changes: PlanAgreementChange[]): boolean {
  const next = new Map<string, string>();
  for (const change of changes) if (change.kind === 'replace') next.set(change.fromEntryId, change.toEntryId);
  for (const start of next.keys()) {
    const seen = new Set<string>();
    let cur: string | undefined = start;
    while (cur !== undefined && next.has(cur)) {
      if (seen.has(cur)) return false;
      seen.add(cur);
      cur = next.get(cur);
    }
  }
  return true;
}

/**
 * Replays `changes` in stored order against which entries are "active"
 * (01-ARCHITECTURE.md §5, ¶102): only `origin: 'start'` entries begin
 * active; `add`/`replace` introduce a previously unseen destination;
 * `remove`/`replace` require a currently active source; `targets` requires
 * a currently active entry and allows at most one per entry (the existing
 * one-live-adjustment-per-entry rule). Any violation — double introduction,
 * acting on a retired or never-active entry, a second target event on the
 * same entry — makes the whole assessment unavailable, not partially
 * salvaged.
 */
function replayValid(changes: PlanAgreementChange[], startEntryIds: Set<string>): boolean {
  const active = new Set(startEntryIds);
  const retired = new Set<string>();
  const targeted = new Set<string>();
  for (const change of changes) {
    if (change.kind === 'add') {
      if (active.has(change.entryId) || retired.has(change.entryId)) return false;
      active.add(change.entryId);
    } else if (change.kind === 'replace') {
      if (!active.has(change.fromEntryId)) return false;
      if (active.has(change.toEntryId) || retired.has(change.toEntryId)) return false;
      active.delete(change.fromEntryId);
      retired.add(change.fromEntryId);
      active.add(change.toEntryId);
    } else if (change.kind === 'remove') {
      if (!active.has(change.entryId)) return false;
      active.delete(change.entryId);
      retired.add(change.entryId);
    } else if (change.kind === 'targets') {
      if (!active.has(change.entryId) || targeted.has(change.entryId)) return false;
      targeted.add(change.entryId);
    }
  }
  return true;
}

function validSeenWorkingRow(value: unknown, ids: Set<string>): boolean {
  if (!object(value) || !shortString(value.entryId) || !ids.has(value.entryId)) return false;
  if (!Array.isArray(value.setIndices) || value.setIndices.length > PLAN_MAX_METADATA_SETS) return false;
  const seen = new Set<number>();
  for (const index of value.setIndices) {
    if (!finite(index) || !Number.isInteger(index) || index < 0 || index >= PLAN_MAX_METADATA_SETS || seen.has(index)) return false;
    seen.add(index);
  }
  return true;
}

/**
 * The whole wrapper is dropped on any structural or replay failure — never
 * partially salvaged (D06: "explicit unavailable, not a truncated effective
 * plan"). `entryIds` is every id in the owning plan's `entries[]`, since a
 * change/invalidation/seen-row referencing an id that doesn't exist there is
 * a dangling link regardless of replay order.
 */
function validAssessment(value: unknown, entryIds: Set<string>, startEntryIds: Set<string>): value is SessionAssessment {
  if (!object(value) || value.version !== 1) return false;
  const intent = value.intent;
  if (!object(intent) || !oneOf(intent.kind, ['normal', 'easier'] as const)) return false;
  if (!shortString(intent.capturedAt) || !Number.isFinite(Date.parse(intent.capturedAt))) return false;
  if (!oneOf(intent.source, ['session_start', 'accepted_deload'] as const)) return false;
  if (!(intent.effortCap === null || oneOf(intent.effortCap, ['easy', 'ideal', 'max'] as const))) return false;
  if (!Array.isArray(value.changes) || value.changes.length > MAX_ASSESSMENT_CHANGES) return false;
  if (!value.changes.every(change => validAssessmentChange(change, entryIds))) return false;
  const changeIds = value.changes.map(change => change.id);
  if (new Set(changeIds).size !== changeIds.length) return false;
  if (!acyclicReplacements(value.changes) || !replayValid(value.changes, startEntryIds)) return false;
  if (!Array.isArray(value.invalidatedEntryIds) || value.invalidatedEntryIds.length > PLAN_MAX_METADATA_ENTRIES) return false;
  if (!value.invalidatedEntryIds.every(id => shortString(id) && entryIds.has(id))) return false;
  if (new Set(value.invalidatedEntryIds).size !== value.invalidatedEntryIds.length) return false;
  if (!Array.isArray(value.seenWorkingRows) || value.seenWorkingRows.length > PLAN_MAX_METADATA_ENTRIES) return false;
  if (!value.seenWorkingRows.every(row => validSeenWorkingRow(row, entryIds))) return false;
  return new Set(value.seenWorkingRows.map(row => row.entryId)).size === value.seenWorkingRows.length;
}

/** Malformed objective metadata drops only itself. Unknown exercise IDs remain inspectable/editable. */
function normalizeObjective(value: unknown): PersonalObjective | undefined {
  if (!object(value) || value.version !== 1 || !shortString(value.id)
    || !Number.isInteger(value.revision) || (value.revision as number) < 1
    || !validIsoTimestamp(value.createdAt) || !validIsoTimestamp(value.updatedAt)
    || Date.parse(value.updatedAt as string) < Date.parse(value.createdAt as string)
    || typeof value.statement !== 'string') return undefined;
  const statement = value.statement.trim();
  if (!statement || statement.length > MAX_OBJECTIVE_STATEMENT_CHARS) return undefined;
  if (!Array.isArray(value.priorityMuscles) || !value.priorityMuscles.every(isMuscleId)) return undefined;
  const priorityMuscles = [...new Set(value.priorityMuscles)];
  if (priorityMuscles.length > MAX_OBJECTIVE_MUSCLES) return undefined;
  if (!Array.isArray(value.availableWeekdays) || !value.availableWeekdays.every(day => oneOf(day, WEEKDAYS))) return undefined;
  const available = new Set(value.availableWeekdays);
  const availableWeekdays = WEEKDAYS.filter(day => available.has(day));
  const equipmentNote = value.equipmentNote === undefined ? undefined : typeof value.equipmentNote === 'string' ? value.equipmentNote.trim() : null;
  if (equipmentNote === null || (equipmentNote !== undefined && equipmentNote.length > MAX_OBJECTIVE_EQUIPMENT_CHARS)) return undefined;
  if (!Array.isArray(value.measures)) return undefined;
  const measures: PersonalObjective['measures'] = [];
  const keys = new Set<string>();
  for (const measure of value.measures) {
    if (!object(measure)) return undefined;
    let normalized: PersonalObjective['measures'][number];
    if (measure.kind === 'consistency') normalized = { kind: 'consistency' };
    else if (measure.kind === 'body_trend') normalized = { kind: 'body_trend' };
    else if (measure.kind === 'lift_trend' && shortString(measure.exerciseId)) normalized = { kind: 'lift_trend', exerciseId: measure.exerciseId };
    else return undefined;
    const key = normalized.kind === 'lift_trend' ? `${normalized.kind}:${normalized.exerciseId}` : normalized.kind;
    if (!keys.has(key)) { keys.add(key); measures.push(normalized); }
  }
  if (measures.length < 1 || measures.length > MAX_OBJECTIVE_MEASURES) return undefined;
  if (value.reviewDay !== undefined && !validDay(value.reviewDay)) return undefined;
  return {
    version: 1,
    id: value.id,
    revision: value.revision as number,
    createdAt: value.createdAt as string,
    updatedAt: value.updatedAt as string,
    statement,
    priorityMuscles,
    availableWeekdays,
    equipmentNote: equipmentNote || undefined,
    measures,
    reviewDay: value.reviewDay as string | undefined,
  };
}

const sameTarget = (left: PlanSetTarget | null | undefined, right: PlanSetTarget | null | undefined): boolean =>
  left == null && right == null
    ? true
    : !!left && !!right && left.kg === right.kg && left.reps === right.reps && left.durationSec === right.durationSec;

function sameTargetProjection(left: Array<PlanSetTarget | null> | undefined, right: Array<PlanSetTarget | null> | undefined): boolean {
  const length = Math.max(left?.length ?? 0, right?.length ?? 0);
  for (let index = 0; index < length; index++) if (!sameTarget(left?.[index], right?.[index])) return false;
  return true;
}

function activeAssessmentEntryIds(plan: WorkoutPlanSnapshot): Set<string> {
  const active = new Set(plan.entries.filter(entry => entry.origin === 'start').map(entry => entry.id));
  for (const change of plan.assessment?.changes ?? []) {
    if (change.kind === 'add') active.add(change.entryId);
    else if (change.kind === 'replace') { active.delete(change.fromEntryId); active.add(change.toEntryId); }
    else if (change.kind === 'remove') active.delete(change.entryId);
  }
  return active;
}

/** D05: a surviving entry whose journal and compatibility projection disagree is retained but explicitly unassessable. */
function invalidateProjectionMismatches(plan: WorkoutPlanSnapshot): WorkoutPlanSnapshot {
  if (!plan.assessment) return plan;
  const active = activeAssessmentEntryIds(plan);
  const expected = new Map<string, Array<PlanSetTarget | null>>();
  for (const change of plan.assessment.changes) if (change.kind === 'targets') {
    const projection: Array<PlanSetTarget | null> = [];
    for (const item of change.targets) projection[item.setIndex] = { ...item.target };
    expected.set(change.entryId, projection);
  }
  const invalidated = new Set(plan.assessment.invalidatedEntryIds);
  for (const entry of plan.entries) {
    if (!active.has(entry.id)) continue;
    if (!sameTargetProjection(entry.acceptedTargets, expected.get(entry.id))) invalidated.add(entry.id);
  }
  if (invalidated.size === plan.assessment.invalidatedEntryIds.length) return plan;
  return { ...plan, assessment: { ...plan.assessment, invalidatedEntryIds: [...invalidated] } };
}

/** Drops just `assessment` on failure — malformed metadata never invalidates the plan or logged work it sits on top of (D03). */
function normalizePlan(value: unknown): WorkoutPlanSnapshot | undefined {
  if (!validPlan(value)) return undefined;
  const entryIds = new Set(value.entries.map(entry => entry.id));
  const startEntryIds = new Set(value.entries.filter(entry => entry.origin === 'start').map(entry => entry.id));
  const assessment = value.assessment !== undefined && validAssessment(value.assessment, entryIds, startEntryIds) ? value.assessment : undefined;
  return invalidateProjectionMismatches({ ...value, assessment });
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
  const plan = normalizePlan(session.plan);
  const planEntries = plan ? new Map(plan.entries.map(entry => [entry.id, entry])) : null;
  return { ...session, plan, exercises: (session.exercises ?? []).map(exercise => normalizeLoggedExercise(exercise, planEntries)) };
}

function normalizeActiveMetadata(active: ActiveSession | null): ActiveSession | null {
  if (!active) return null;
  let plan = normalizePlan(active.plan);
  const planEntries = plan ? new Map(plan.entries.map(entry => [entry.id, entry])) : null;
  const projectionMismatchIds = new Set<string>();
  const entries = (active.entries ?? []).map(entry => {
    const linkedEntry = planEntries !== null && shortString(entry.planEntryId) ? planEntries.get(entry.planEntryId) : undefined;
    const linked = !!linkedEntry && linkedEntry.exerciseId === entry.exerciseId;
    const overrides = Array.isArray(entry.targetOverrides) && entry.targetOverrides.length <= PLAN_MAX_METADATA_SETS
      && entry.targetOverrides.every(target => target === null || validTarget(target)) ? entry.targetOverrides : undefined;
    const decision = object(entry.coachDecision) && shortString(entry.coachDecision.key)
      && oneOf(entry.coachDecision.action, ['accepted', 'dismissed'] as const) ? entry.coachDecision : undefined;
    if (linked && plan?.assessment && activeAssessmentEntryIds(plan).has(linkedEntry.id)
      && !sameTargetProjection(overrides, linkedEntry.acceptedTargets)) projectionMismatchIds.add(linkedEntry.id);
    return {
      ...entry,
      planEntryId: linked ? entry.planEntryId : undefined,
      planComparisonValid: linked && typeof entry.planComparisonValid === 'boolean' ? entry.planComparisonValid : undefined,
      targetOverrides: linked ? overrides : undefined,
      coachDecision: linked ? decision : undefined,
    };
  });
  if (plan?.assessment && projectionMismatchIds.size) {
    const invalidated = new Set([...plan.assessment.invalidatedEntryIds, ...projectionMismatchIds]);
    plan = { ...plan, assessment: { ...plan.assessment, invalidatedEntryIds: [...invalidated] } };
  }
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
      presence: normalizePresence(s.coach?.presence),
      objective: normalizeObjective(s.coach?.objective),
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
