import { DEBRIEF_LOAD_EPS_KG } from './debrief';
import { isWorkingSet } from './exposure';
import { MAX_ASSESSMENT_CHANGES, PLAN_MAX_METADATA_ENTRIES, PLAN_MAX_METADATA_SETS, type Effort, type LoggedSet, type PlanAgreementChange, type PlanSetTarget, type Session, type WorkoutPlanEntry, type WorkoutPlanSnapshot } from '@/core/models';

export type PlanFitLabel = 'Followed the plan' | 'Harder than planned' | 'Less work than planned' | 'Followed the adjusted plan' | 'Not enough information';
export type PlanFitReason =
  | 'no_assessment'
  | 'invalid_agreement'
  | 'invalid_mapping'
  | 'invalidated_entry'
  | 'projection_mismatch'
  | 'different_load'
  | 'required_effort'
  | 'starter_target'
  | 'unavailable_target'
  | 'unsupported_mode'
  | 'unadopted_extra'
  | 'not_logged'
  | 'below_target'
  | 'empty_plan'
  | 'incomplete_coverage';

export interface PlanFitRow {
  entryId: string;
  exerciseId: string;
  setIndex: number;
  originalTarget: PlanSetTarget | null;
  effectiveTarget: PlanSetTarget | null;
  accepted: boolean;
  actual: LoggedSet | null;
  status: 'met' | 'below_target' | 'not_logged' | 'unresolved';
  reasons: PlanFitReason[];
}

export interface PlanFitResult {
  label: PlanFitLabel;
  rows: PlanFitRow[];
  reasons: PlanFitReason[];
  expectedRows: number;
  loggedRows: number;
  comparableRows: number;
  metRows: number;
  notLoggedRows: number;
  belowTargetRows: number;
  capBreaches: Array<{ entryId: string; setIndex: number; effort: Effort; cap: Effort }>;
  effectiveChange: boolean;
  coverageIncomplete: boolean;
}

interface ReplayedAgreement {
  active: Set<string>;
  accepted: Map<string, Map<number, PlanSetTarget>>;
  effectiveChange: boolean;
}

const EFFORT_RANK: Record<Effort, number> = { easy: 0, ideal: 1, max: 2 };
const validEffort = (value: unknown): value is Effort => value === 'easy' || value === 'ideal' || value === 'max';
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const validTarget = (value: unknown): value is PlanSetTarget => object(value)
  && (value.kg === null || (typeof value.kg === 'number' && Number.isFinite(value.kg) && value.kg >= 0))
  && (value.reps === null || (typeof value.reps === 'number' && Number.isInteger(value.reps) && value.reps > 0))
  && (value.durationSec === null || (typeof value.durationSec === 'number' && Number.isFinite(value.durationSec) && value.durationSec >= 0));
const copyTarget = (target: PlanSetTarget): PlanSetTarget => ({ kg: target.kg, reps: target.reps, durationSec: target.durationSec });
const sameTarget = (left: PlanSetTarget | null | undefined, right: PlanSetTarget | null | undefined): boolean =>
  left == null && right == null
    ? true
    : !!left && !!right && left.kg === right.kg && left.reps === right.reps && left.durationSec === right.durationSec;

function addReason(reasons: Set<PlanFitReason>, ...next: PlanFitReason[]): void {
  for (const reason of next) reasons.add(reason);
}

function validAssessmentShell(plan: WorkoutPlanSnapshot): boolean {
  const assessment = plan.assessment;
  if (!assessment || assessment.version !== 1 || !Array.isArray(assessment.changes)
    || assessment.changes.length > MAX_ASSESSMENT_CHANGES
    || !Array.isArray(assessment.invalidatedEntryIds) || assessment.invalidatedEntryIds.length > PLAN_MAX_METADATA_ENTRIES
    || !Array.isArray(assessment.seenWorkingRows) || assessment.seenWorkingRows.length > PLAN_MAX_METADATA_ENTRIES
    || !Array.isArray(plan.entries) || plan.entries.length > PLAN_MAX_METADATA_ENTRIES) return false;
  const ids = plan.entries.map(entry => entry.id);
  if (new Set(ids).size !== ids.length || assessment.invalidatedEntryIds.some(id => !ids.includes(id))
    || new Set(assessment.invalidatedEntryIds).size !== assessment.invalidatedEntryIds.length) return false;
  const intent = assessment.intent;
  if (!intent || !Number.isFinite(Date.parse(intent.capturedAt))) return false;
  if (intent.kind === 'normal') return intent.source === 'session_start' && intent.effortCap === null;
  return intent.kind === 'easier' && intent.source === 'accepted_deload' && (intent.effortCap === 'easy' || intent.effortCap === 'ideal');
}

function replay(plan: WorkoutPlanSnapshot): ReplayedAgreement | null {
  if (!validAssessmentShell(plan)) return null;
  const byId = new Map(plan.entries.map(entry => [entry.id, entry]));
  const active = new Set(plan.entries.filter(entry => entry.origin === 'start').map(entry => entry.id));
  const introduced = new Set(active);
  const retired = new Set<string>();
  const accepted = new Map<string, Map<number, PlanSetTarget>>();
  const targeted = new Set<string>();
  const changeIds = new Set<string>();
  for (const change of plan.assessment!.changes) {
    if (!object(change) || typeof change.id !== 'string' || !change.id || changeIds.has(change.id)
      || typeof change.acceptedAt !== 'string' || !Number.isFinite(Date.parse(change.acceptedAt))) return null;
    changeIds.add(change.id);
    if (change.kind === 'add') {
      if (typeof change.entryId !== 'string' || !byId.has(change.entryId)) return null;
      const entry = byId.get(change.entryId)!;
      if (entry.origin !== 'added' || introduced.has(entry.id) || retired.has(entry.id)) return null;
      introduced.add(entry.id); active.add(entry.id);
    } else if (change.kind === 'replace') {
      if (typeof change.fromEntryId !== 'string' || typeof change.toEntryId !== 'string') return null;
      const destination = byId.get(change.toEntryId);
      if (!active.has(change.fromEntryId) || !destination || destination.origin !== 'replacement'
        || destination.replaces !== change.fromEntryId || introduced.has(destination.id) || retired.has(destination.id)) return null;
      active.delete(change.fromEntryId); retired.add(change.fromEntryId);
      introduced.add(destination.id); active.add(destination.id);
    } else if (change.kind === 'remove') {
      if (typeof change.entryId !== 'string') return null;
      if (!active.has(change.entryId)) return null;
      active.delete(change.entryId); retired.add(change.entryId);
    } else if (change.kind === 'targets') {
      if (typeof change.entryId !== 'string' || !active.has(change.entryId) || targeted.has(change.entryId)
        || (change.reason !== 'max_below_target' && change.reason !== 'easy_above_target')
        || !Array.isArray(change.targets) || !change.targets.length || change.targets.length > PLAN_MAX_METADATA_SETS) return null;
      const projection = new Map<number, PlanSetTarget>();
      for (const item of change.targets) {
        if (!object(item) || !Number.isInteger(item.setIndex) || (item.setIndex as number) < 0 || (item.setIndex as number) >= PLAN_MAX_METADATA_SETS
          || projection.has(item.setIndex as number) || !validTarget(item.target)) return null;
        projection.set(item.setIndex as number, copyTarget(item.target));
      }
      targeted.add(change.entryId); accepted.set(change.entryId, projection);
    } else return null;
  }
  return { active, accepted, effectiveChange: plan.assessment!.changes.length > 0 };
}

function projectedTargetsMatch(entry: WorkoutPlanEntry, accepted: Map<number, PlanSetTarget> | undefined): boolean {
  const length = Math.max(entry.acceptedTargets?.length ?? 0, accepted?.size ? Math.max(...accepted.keys()) + 1 : 0);
  for (let index = 0; index < length; index++) if (!sameTarget(entry.acceptedTargets?.[index], accepted?.get(index))) return false;
  return true;
}

function compare(entry: WorkoutPlanEntry, target: PlanSetTarget, actual: LoggedSet): 'met' | 'below_target' | 'unresolved' {
  if (entry.mode === 'weighted') {
    if (target.kg === null || target.reps === null || !Number.isFinite(actual.kg) || !Number.isInteger(actual.reps) || actual.reps! <= 0) return 'unresolved';
    if (Math.abs(actual.kg! - target.kg) > DEBRIEF_LOAD_EPS_KG) return 'unresolved';
    return actual.reps! >= target.reps ? 'met' : 'below_target';
  }
  if (entry.mode === 'bodyweight') {
    if (target.reps === null || !Number.isInteger(actual.reps) || actual.reps! <= 0) return 'unresolved';
    return actual.reps! >= target.reps ? 'met' : 'below_target';
  }
  if (entry.mode === 'duration') {
    if (target.durationSec === null || !Number.isFinite(actual.durationSec) || actual.durationSec! <= 0) return 'unresolved';
    return actual.durationSec! >= target.durationSec ? 'met' : 'below_target';
  }
  return 'unresolved';
}

function baseResult(reason: PlanFitReason): PlanFitResult {
  return { label: 'Not enough information', rows: [], reasons: [reason], expectedRows: 0, loggedRows: 0, comparableRows: 0, metRows: 0, notLoggedRows: 0, belowTargetRows: 0, capBreaches: [], effectiveChange: false, coverageIncomplete: true };
}

/**
 * Compare a saved workout with its captured agreement. This is deliberately
 * pure and local: achievement/PR output remains owned by the existing PR
 * engine, while this result describes only plan fit and its uncertainty.
 */
export function assessPlanFit(session: Session): PlanFitResult {
  const plan = session.plan;
  if (!plan || !validAssessmentShell(plan)) return baseResult('no_assessment');
  const agreement = replay(plan);
  if (!agreement) return baseResult('invalid_agreement');
  const reasons = new Set<PlanFitReason>();
  const invalidated = new Set(plan.assessment!.invalidatedEntryIds);
  const rows: PlanFitRow[] = [];
  const expectedKeys = new Set<string>();
  const actualByEntry = new Map<string, Map<number, LoggedSet>>();
  let loggedRows = 0;

  const linked = new Map<string, typeof session.exercises>();
  for (const exercise of session.exercises) {
    const working = exercise.sets.filter(isWorkingSet);
    loggedRows += working.length;
    if (!exercise.planEntryId) { if (working.length) addReason(reasons, 'unadopted_extra'); continue; }
    const list = linked.get(exercise.planEntryId) ?? [];
    list.push(exercise); linked.set(exercise.planEntryId, list);
  }

  for (const entryId of agreement.active) {
    const entry = plan.entries.find(candidate => candidate.id === entryId);
    if (!entry) return baseResult('invalid_agreement');
    const adopted = agreement.accepted.get(entryId);
    if (!projectedTargetsMatch(entry, adopted)) { invalidated.add(entryId); addReason(reasons, 'projection_mismatch'); }
    const actualEntries = linked.get(entryId) ?? [];
    if (actualEntries.length > 1 || actualEntries.some(actual => actual.exerciseId !== entry.exerciseId)) {
      invalidated.add(entryId); addReason(reasons, 'invalid_mapping');
    }
    const actual = actualEntries.length === 1 ? actualEntries[0]! : undefined;
    const working = actual?.sets.filter(isWorkingSet) ?? [];
    const indices = actual?.actualSetIndices;
    const mappingValid = !!actual && Array.isArray(indices) && indices.length === working.length
      && indices.every((index, position) => Number.isInteger(index) && index >= 0 && index < PLAN_MAX_METADATA_SETS && (position === 0 || index > indices[position - 1]!));
    if (actual && working.length && !mappingValid) { invalidated.add(entryId); addReason(reasons, 'invalid_mapping'); }
    if (mappingValid) actualByEntry.set(entryId, new Map(indices!.map((index, position) => [index, working[position]!] as const)));

    const indicesToAssess = new Set<number>();
    for (let index = 0; index < entry.plannedSets; index++) indicesToAssess.add(index);
    for (const index of adopted?.keys() ?? []) indicesToAssess.add(index);
    const actualRows = actualByEntry.get(entryId);
    for (const setIndex of [...indicesToAssess].sort((a, b) => a - b)) {
      const originalTarget = setIndex < entry.plannedSets && entry.targets[setIndex] ? copyTarget(entry.targets[setIndex]!) : null;
      const acceptedTarget = adopted?.get(setIndex);
      const effectiveTarget = acceptedTarget ? copyTarget(acceptedTarget) : originalTarget;
      const actualSet = actualRows?.get(setIndex) ?? null;
      const rowReasons: PlanFitReason[] = [];
      let status: PlanFitRow['status'] = 'unresolved';
      expectedKeys.add(`${entryId}:${setIndex}`);
      if (invalidated.has(entryId)) rowReasons.push('invalidated_entry');
      else if (!actualSet) { status = 'not_logged'; rowReasons.push('not_logged'); }
      else if (entry.targetSource === 'starter') rowReasons.push('starter_target');
      else if (entry.targetSource === 'unavailable' || !effectiveTarget) rowReasons.push('unavailable_target');
      else if (entry.mode === 'assisted' || entry.mode === 'conditioning' || entry.mode === null) rowReasons.push('unsupported_mode');
      else {
        status = compare(entry, effectiveTarget, actualSet);
        if (status === 'unresolved') rowReasons.push(entry.mode === 'weighted' ? 'different_load' : 'unavailable_target');
        if (status === 'below_target') rowReasons.push('below_target');
      }
      const cap = plan.assessment!.intent.effortCap;
      if (actualSet && cap && !invalidated.has(entryId)) {
        if (!validEffort(actualSet.effort)) rowReasons.push('required_effort');
      }
      rows.push({ entryId, exerciseId: entry.exerciseId, setIndex, originalTarget, effectiveTarget, accepted: !!acceptedTarget, actual: actualSet ? { ...actualSet } : null, status, reasons: [...new Set(rowReasons)] });
      addReason(reasons, ...rowReasons);
    }
  }

  for (const [entryId, byIndex] of actualByEntry) {
    for (const setIndex of byIndex.keys()) if (!expectedKeys.has(`${entryId}:${setIndex}`)) addReason(reasons, 'unadopted_extra');
  }
  for (const [entryId, exercises] of linked) {
    if (!agreement.active.has(entryId) && exercises.some(exercise => exercise.sets.some(isWorkingSet))) addReason(reasons, 'unadopted_extra');
  }
  for (const entryId of invalidated) addReason(reasons, 'invalidated_entry');

  const capBreaches: PlanFitResult['capBreaches'] = [];
  const cap = plan.assessment!.intent.effortCap;
  if (cap) for (const row of rows) {
    if (!row.actual || invalidated.has(row.entryId) || !validEffort(row.actual.effort)) continue;
    if (EFFORT_RANK[row.actual.effort] > EFFORT_RANK[cap]) capBreaches.push({ entryId: row.entryId, setIndex: row.setIndex, effort: row.actual.effort, cap });
  }

  const unresolved = rows.some(row => row.status === 'unresolved' || row.reasons.includes('required_effort'))
    || [...reasons].some(reason => ['invalid_mapping', 'invalidated_entry', 'projection_mismatch', 'unadopted_extra'].includes(reason));
  const notLoggedRows = rows.filter(row => row.status === 'not_logged').length;
  const belowTargetRows = rows.filter(row => row.status === 'below_target').length;
  const comparableRows = rows.filter(row => row.status === 'met' || row.status === 'below_target').length;
  const metRows = rows.filter(row => row.status === 'met').length;
  const empty = rows.length === 0 && loggedRows === 0;
  if (empty) addReason(reasons, 'empty_plan');
  const coverageIncomplete = unresolved || notLoggedRows > 0 || empty;
  if (capBreaches.length && coverageIncomplete) addReason(reasons, 'incomplete_coverage');

  let label: PlanFitLabel;
  if (capBreaches.length) label = 'Harder than planned';
  else if (unresolved || empty) label = 'Not enough information';
  else if (notLoggedRows > 0 || belowTargetRows > 0) label = 'Less work than planned';
  else if (agreement.effectiveChange) label = 'Followed the adjusted plan';
  else label = 'Followed the plan';

  return {
    label,
    rows,
    reasons: [...reasons],
    expectedRows: rows.length,
    loggedRows,
    comparableRows,
    metRows,
    notLoggedRows,
    belowTargetRows,
    capBreaches,
    effectiveChange: agreement.effectiveChange,
    coverageIncomplete,
  };
}
