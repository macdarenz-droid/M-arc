/** Immutable workout-target capture and saved plan-versus-actual comparison. */
import { PLAN_MAX_METADATA_SETS, type Effort, type Exercise, type LoggedSet, type PlanSetTarget, type ResistanceMode, type Session, type WorkoutPlanEntry, type WorkoutPlanSnapshot } from '@/core/models';
import { findExercise } from '@/core/exercises';
import { exerciseHistory, summarizeSets, type ExerciseSessionSummary } from './history';
import { isWorkingSet } from './exposure';
import { suggestNext } from './progression';
import { applyDeload, captureSessionIntent, deloadActive } from './coach/deload';
import type { BrainContext } from './coach/context';
import { RIR_BAND } from './coach/bands';

export interface PlanEntryInput {
  id: string;
  exerciseId: string;
  name: string;
  plannedSets: number;
  origin: WorkoutPlanEntry['origin'];
  replaces?: string;
}

const finiteNonnegative = (value: number | null): number | null =>
  value !== null && Number.isFinite(value) && value >= 0 ? value : null;
const positiveInteger = (value: number | null): number | null =>
  value !== null && Number.isInteger(value) && value > 0 ? value : null;
const copyTarget = (target: { kg: number | null; reps: number | null; durationSec: number | null }): PlanSetTarget => ({
  kg: finiteNonnegative(target.kg),
  reps: positiveInteger(target.reps),
  durationSec: finiteNonnegative(target.durationSec),
});

export function capturePlanEntry(ctx: BrainContext, entry: PlanEntryInput): WorkoutPlanEntry {
  const exercise = findExercise(entry.exerciseId, ctx.custom);
  if (!exercise) return {
    ...entry, mode: null, targetSource: 'unavailable', allowIncrease: false, targets: [],
  };
  const historyBacked = exerciseHistory(ctx.sessions, entry.exerciseId, ctx.custom).length > 0;
  const raw = suggestNext(ctx.sessions, entry.exerciseId, ctx.goal, ctx.today, entry.plannedSets, ctx.custom);
  const suggestion = applyDeload(raw, ctx.deload, ctx.today);
  const targets = Array.from({ length: Math.max(0, entry.plannedSets) }, (_, index) => {
    const target = suggestion.sets[Math.min(index, suggestion.sets.length - 1)];
    return target ? copyTarget(target) : { kg: null, reps: null, durationSec: null };
  });
  const canIncrease = raw.mode === 'increase' || raw.mode === 'reps' || raw.mode === 'hold' || raw.mode === 'confirm';
  return {
    ...entry,
    mode: exercise.mode,
    targetSource: historyBacked ? 'history' : 'starter',
    allowIncrease: historyBacked && canIncrease && !deloadActive(ctx.deload, ctx.today),
    targets,
  };
}

/**
 * The only call site is `startSession` (docs/escobar-presence P04) — this
 * is what makes it safe to always attach a fresh `assessment` here rather
 * than threading an explicit "is this a new session" flag through: capturing
 * a plan snapshot IS starting a new session, today. `changes` starts empty;
 * P05 owns appending to it.
 */
export function capturePlan(ctx: BrainContext, entries: PlanEntryInput[], capturedAt: string): WorkoutPlanSnapshot {
  return {
    version: 1,
    capturedAt,
    goal: ctx.goal,
    deload: ctx.deload ? { ...ctx.deload } : null,
    entries: entries.map(entry => {
      const captured = capturePlanEntry(ctx, { ...entry });
      return { ...captured, targets: captured.targets.map(target => ({ ...target })) };
    }),
    assessment: {
      version: 1,
      intent: captureSessionIntent(ctx.deload, ctx.today, capturedAt),
      changes: [],
      invalidatedEntryIds: [],
      seenWorkingRows: [],
    },
  };
}

export const DEBRIEF_LOAD_EPS_KG = 0.01;

export interface DebriefSet {
  setNumber: number;
  planned: PlanSetTarget | null;
  accepted: PlanSetTarget | null;
  actual: PlanSetTarget;
  result: 'met' | 'below' | 'different_load' | 'uncomparable';
}

export interface DebriefExercise {
  planEntryId: string | null;
  exerciseId: string;
  name: string;
  plannedSets: number | null;
  loggedSets: number;
  targetSource: WorkoutPlanEntry['targetSource'] | 'missing';
  excluded: WorkoutPlanEntry['excluded'] | null;
  rows: DebriefSet[];
  tradeoff: {
    previousKg: number;
    actualKg: number;
    previousReps: number;
    actualReps: number;
    previousVolumeKg: number;
    actualVolumeKg: number;
  } | null;
}

export interface SessionDebrief {
  sessionId: string;
  hasPlan: boolean;
  plannedSets: number | null;
  loggedSets: number;
  comparableSets: number;
  metSets: number;
  exercises: DebriefExercise[];
}

const actualTarget = (set: LoggedSet): PlanSetTarget => ({
  kg: finiteNonnegative(set.kg ?? null),
  reps: positiveInteger(set.reps ?? null),
  durationSec: finiteNonnegative(set.durationSec ?? null),
});

function compareTarget(mode: ResistanceMode | null, target: PlanSetTarget | null, actual: PlanSetTarget): DebriefSet['result'] {
  if (!target) return 'uncomparable';
  if (mode === 'weighted') {
    if (target.kg === null || target.reps === null || actual.kg === null || actual.reps === null) return 'uncomparable';
    if (Math.abs(target.kg - actual.kg) > DEBRIEF_LOAD_EPS_KG) return 'different_load';
    return actual.reps >= target.reps ? 'met' : 'below';
  }
  if (mode === 'bodyweight') {
    if (target.reps === null || actual.reps === null) return 'uncomparable';
    return actual.reps >= target.reps ? 'met' : 'below';
  }
  if (mode === 'duration') {
    if (target.durationSec === null || actual.durationSec === null) return 'uncomparable';
    return actual.durationSec >= target.durationSec ? 'met' : 'below';
  }
  return 'uncomparable';
}

export const compareSessionStarts = (a: Session, b: Session): number => Date.parse(a.startedAt) - Date.parse(b.startedAt) || a.id.localeCompare(b.id);

function beforeSession(candidate: Session, session: Session): boolean {
  return Number.isFinite(Date.parse(candidate.startedAt)) && Number.isFinite(Date.parse(session.startedAt))
    && compareSessionStarts(candidate, session) < 0;
}

/** The preceding exposure by actual instant, even when imported local days disagree. */
export function previousExerciseWork(session: Session, exerciseId: string, prior: Session[], custom: Exercise[] = []): { session: Session; summary: ExerciseSessionSummary } | null {
  const ordered = prior.filter(candidate => candidate.id !== session.id && beforeSession(candidate, session)).sort(compareSessionStarts);
  for (let index = ordered.length - 1; index >= 0; index--) {
    const candidate = ordered[index]!;
    const summary = exerciseHistory([candidate], exerciseId, custom)[0];
    if (summary) return { session: candidate, summary };
  }
  return null;
}

function weightedTradeoff(session: Session, exerciseId: string, sets: LoggedSet[], prior: Session[], custom: Exercise[]): DebriefExercise['tradeoff'] {
  const previous = previousExerciseWork(session, exerciseId, prior, custom)?.summary;
  if (!previous) return null;
  const actual = summarizeSets(session.id, session.day, sets);
  if (!(previous.topKg > 0 && previous.topReps > 0 && previous.volume > 0
    && actual.topKg > previous.topKg && actual.topReps > 0 && actual.topReps < previous.topReps
    && actual.volume > 0 && actual.volume < previous.volume)) return null;
  return {
    previousKg: previous.topKg,
    actualKg: actual.topKg,
    previousReps: previous.topReps,
    actualReps: actual.topReps,
    previousVolumeKg: previous.volume,
    actualVolumeKg: actual.volume,
  };
}

export function sessionDebrief(session: Session, prior: Session[], custom: Exercise[] = []): SessionDebrief {
  const plan = session.plan;
  const actualByPlanId = new Map(session.exercises.filter(entry => entry.planEntryId).map(entry => [entry.planEntryId!, entry]));
  const used = new Set<typeof session.exercises[number]>();
  const exercises: DebriefExercise[] = [];

  for (const entry of plan?.entries ?? []) {
    const candidate = actualByPlanId.get(entry.id);
    const logged = candidate?.exerciseId === entry.exerciseId ? candidate : undefined;
    if (logged) used.add(logged);
    const working = logged?.sets.filter(isWorkingSet) ?? [];
    const indices = logged?.actualSetIndices;
    const validIndices = !!logged && Array.isArray(indices) && indices.length === working.length
      && indices.every((value, index) => Number.isInteger(value) && value >= 0 && value < PLAN_MAX_METADATA_SETS
        && (index === 0 || value > indices[index - 1]!));
    const rows = working.map((set, index): DebriefSet => {
      const targetIndex = validIndices ? indices![index]! : -1;
      const planned = targetIndex >= 0 && entry.targets[targetIndex] ? { ...entry.targets[targetIndex]! } : null;
      const accepted = targetIndex >= 0 && entry.acceptedTargets?.[targetIndex] ? { ...entry.acceptedTargets[targetIndex]! } : null;
      const actual = actualTarget(set);
      return { setNumber: targetIndex >= 0 ? targetIndex + 1 : index + 1, planned, accepted, actual, result: compareTarget(entry.mode, accepted ?? planned, actual) };
    });
    exercises.push({
      planEntryId: entry.id,
      exerciseId: entry.exerciseId,
      name: entry.name,
      plannedSets: entry.plannedSets,
      loggedSets: working.length,
      targetSource: entry.targetSource,
      excluded: entry.excluded ?? null,
      rows,
      tradeoff: entry.mode === 'weighted' && logged ? weightedTradeoff(session, entry.exerciseId, working, prior, custom) : null,
    });
  }

  for (const logged of session.exercises) {
    if (used.has(logged)) continue;
    const working = logged.sets.filter(isWorkingSet);
    const mode = findExercise(logged.exerciseId, custom)?.mode ?? null;
    exercises.push({
      planEntryId: null,
      exerciseId: logged.exerciseId,
      name: logged.name,
      plannedSets: null,
      loggedSets: working.length,
      targetSource: 'missing',
      excluded: null,
      rows: working.map((set, index) => ({ setNumber: index + 1, planned: null, accepted: null, actual: actualTarget(set), result: 'uncomparable' })),
      tradeoff: mode === 'weighted' ? weightedTradeoff(session, logged.exerciseId, working, prior, custom) : null,
    });
  }

  const rows = exercises.flatMap(entry => entry.rows);
  return {
    sessionId: session.id,
    hasPlan: !!plan,
    plannedSets: plan ? plan.entries.reduce((sum, entry) => sum + entry.plannedSets, 0) : null,
    loggedSets: rows.length,
    comparableSets: rows.filter(row => row.result === 'met' || row.result === 'below').length,
    metSets: rows.filter(row => row.result === 'met').length,
    exercises,
  };
}

export interface UnratedSet {
  exerciseIndex: number;
  setIndex: number;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  fingerprint: string;
  actual: LoggedSet;
}

export interface EffortRepair {
  workingSets: number;
  ratedSets: number;
  missingSets: number;
  coverage: number;
  offer: boolean;
  missing: UnratedSet[];
}

const EFFORTS: readonly Effort[] = ['easy', 'ideal', 'max'];
const validEffort = (value: unknown): value is Effort => EFFORTS.includes(value as Effort);

export function effortSetFingerprint(session: Session, exerciseIndex: number, setIndex: number): string | null {
  const exercise = session.exercises[exerciseIndex];
  const set = exercise?.sets[setIndex];
  if (!exercise || !set || !Number.isInteger(exerciseIndex) || !Number.isInteger(setIndex) || exerciseIndex < 0 || setIndex < 0) return null;
  return JSON.stringify([
    session.id,
    session.startedAt,
    exerciseIndex,
    exercise.exerciseId,
    exercise.planEntryId ?? null,
    setIndex,
    set.kg ?? null,
    set.reps ?? null,
    set.durationSec ?? null,
    set.distanceM ?? null,
    set.effort ?? null,
  ]);
}

export function unratedSets(session: Session): UnratedSet[] {
  const missing: UnratedSet[] = [];
  session.exercises.forEach((exercise, exerciseIndex) => exercise.sets.forEach((set, setIndex) => {
    if (!isWorkingSet(set) || validEffort(set.effort)) return;
    const fingerprint = effortSetFingerprint(session, exerciseIndex, setIndex);
    if (!fingerprint) return;
    missing.push({ exerciseIndex, setIndex, exerciseId: exercise.exerciseId, exerciseName: exercise.name, setNumber: setIndex + 1, fingerprint, actual: { ...set } });
  }));
  return missing;
}

export function effortRepair(session: Session): EffortRepair {
  const working = session.exercises.flatMap(exercise => exercise.sets).filter(isWorkingSet);
  const ratedSets = working.filter(set => validEffort(set.effort)).length;
  const missing = unratedSets(session);
  const coverage = working.length ? ratedSets / working.length : 0;
  return {
    workingSets: working.length,
    ratedSets,
    missingSets: missing.length,
    coverage,
    offer: working.length > 0 && coverage < 0.5,
    missing,
  };
}

export function effortCalibration(): Array<{ effort: Effort; label: string; rir: readonly [number, number] }> {
  return EFFORTS.map(effort => ({ effort, label: `${effort[0]!.toUpperCase()}${effort.slice(1)}`, rir: [...RIR_BAND[effort]] as [number, number] }));
}
