/**
 * The contract between the brain (detection and planning, on device) and
 * the coach (words). The brain emits a FindingsReport: findings are facts
 * with numbers, a window, evidence and confidence; proposals are actions
 * the app can apply once the user accepts them. Neither carries prose.
 *
 * Only this report ever leaves the device, and only when the user has
 * turned the remote explainer on. Raw sessions never do.
 *
 * Every kind names the research cards it may cite (see docs/RESEARCH.md
 * and src/data/principles.json). A test keeps those references honest.
 */
import type { Weekday } from '@/core/models';
import type { MuscleGroup, MuscleId } from '@/data/muscles';

export const CONTRACT_VERSION = 1 as const;

export type Confidence = 'low' | 'medium' | 'high';
/** 0 informational, 1 worth a look, 2 act soon, 3 act before the next session. */
export type Severity = 0 | 1 | 2 | 3;

export const FINDING_KINDS = [
  'volume_drop',
  'volume_spike',
  'weekly_sets_out_of_band',
  'uncovered_muscle',
  'plateau',
  'decline',
  'progressing',
  'under_recovered',
  'effort_missing',
  'effort_drift_harder',
  'effort_drift_easier',
  'effort_mismatch',
  'rep_range_mismatch',
  'redundant_exercises',
  'chronic_skip',
  'balance_imbalance',
  'long_gap',
  'habit_pattern',
  'focus_behind',
  'low_sleep_readiness',
  'low_readiness',
  'record',
  'first_sessions',
  'note_flag',
] as const;
export type FindingKind = (typeof FINDING_KINDS)[number];

export const PROPOSAL_KINDS = [
  'schedule',
  'today_plan',
  'exercise_swap',
  'add_exercise',
  'split_modify',
  'split_new',
  'load_next',
  'rest_default',
  'deload_week',
] as const;
export type ProposalKind = (typeof PROPOSAL_KINDS)[number];

/** What a finding or proposal is about. All fields optional; use the ones that apply. */
export interface Subject {
  exerciseId?: string;
  exerciseName?: string;
  muscle?: MuscleId;
  muscleGroup?: MuscleGroup;
  splitId?: string;
  splitName?: string;
}

/** Local day keys, YYYY-MM-DD, inclusive. */
export interface Window {
  from: string;
  to: string;
  weeks?: number;
  sessions?: number;
}

export interface Evidence {
  sessionIds: string[];
  days: string[];
}

export type MetricValue = number | string | boolean;

export interface Finding {
  /** Stable within a report, e.g. "volume_drop:chest". */
  id: string;
  kind: FindingKind;
  subject: Subject;
  /** Numbers only; the words layer may not add any number that is not here. */
  metrics: Record<string, MetricValue>;
  window: Window;
  confidence: Confidence;
  severity: Severity;
  evidence: Evidence;
  /** Ids of cards in principles.json. */
  principles: string[];
}

export interface LearnedDay {
  splitId: string | null;
  /** 0–1 share of recent weeks with a session on this weekday. */
  probability: number;
  /** Typical local start time. */
  startHour: number;
  startMinute: number;
  /** Spread of start times in minutes (interquartile range). */
  spreadMinutes: number;
}

export interface SplitOption {
  splitId: string;
  score: number;
  readyMuscles: MuscleId[];
  recoveringMuscles: MuscleId[];
}

export interface ExerciseChange {
  removeExerciseId: string;
  replaceWithExerciseId?: string;
  reason: FindingKind;
}

export interface SplitDraft {
  name: string;
  focus: MuscleId[];
  exercises: Array<{ exerciseId: string; sets: number }>;
  /** Which weekdays this split would sit on in the proposed week. */
  days: Weekday[];
}

export type ProposalApply =
  /** A weekday mapped to null means: clear that day, the user never trains on it. */
  | { kind: 'schedule'; days: Partial<Record<Weekday, LearnedDay | null>> }
  | { kind: 'today_plan'; recommendedSplitId: string | null; options: SplitOption[]; modifications: ExerciseChange[] }
  | { kind: 'exercise_swap'; splitId?: string; fromExerciseId: string; toExerciseId: string }
  | { kind: 'add_exercise'; splitId: string; exerciseId: string; sets: number; muscle: MuscleId }
  | { kind: 'split_modify'; splitId: string; add: Array<{ exerciseId: string; sets: number }>; remove: string[]; setChanges: Array<{ exerciseId: string; sets: number }> }
  | { kind: 'split_new'; splits: SplitDraft[]; weeklySetsByMuscle: Partial<Record<MuscleId, number>>; daysPerWeek: number }
  | { kind: 'load_next'; exerciseId: string; kg: number | null; reps: [number, number] | null; mode: string }
  | { kind: 'rest_default'; seconds: number }
  | { kind: 'deload_week'; from: string; to: string; loadFactor: number; effortCap: 'easy' | 'ideal' };

export interface Proposal {
  id: string;
  kind: ProposalKind;
  subject: Subject;
  apply: ProposalApply;
  /** Finding ids this proposal rests on. */
  basedOn: string[];
  principles: string[];
  confidence: Confidence;
  /** Same key across days for the same suggestion, so dismissals can suppress it. */
  dismissKey: string;
  /** Day key after which the proposal is stale. */
  expiresOn?: string;
}

export interface DataQuality {
  sessions: number;
  weeksOfData: number;
  /** 0–1 share of recent working sets with an effort rating. */
  effortCoverage: number;
  /** True when the brain thinks there is too little history to say much. */
  insufficientData: boolean;
}

export interface FindingsReport {
  version: typeof CONTRACT_VERSION;
  /** ISO timestamp. */
  generatedAt: string;
  /** Local day key the report was computed for. */
  today: string;
  dataQuality: DataQuality;
  findings: Finding[];
  proposals: Proposal[];
}

/** Which research cards each finding kind may cite. */
export const PRINCIPLES_BY_FINDING: Record<FindingKind, string[]> = {
  volume_drop: ['volume_dose_response'],
  volume_spike: ['volume_dose_response', 'load_monitoring_acwr'],
  weekly_sets_out_of_band: ['volume_dose_response'],
  uncovered_muscle: ['volume_dose_response'],
  plateau: ['progressive_overload', 'exercise_variation'],
  decline: ['progressive_overload', 'deload_evidence'],
  progressing: ['progressive_overload'],
  under_recovered: ['recovery_time_course'],
  effort_missing: ['effort_rir_scale'],
  effort_drift_harder: ['effort_rir_scale', 'deload_evidence'],
  effort_drift_easier: ['effort_rir_scale'],
  effort_mismatch: ['effort_rir_scale', 'proximity_to_failure'],
  rep_range_mismatch: ['load_and_rep_range'],
  redundant_exercises: ['exercise_variation'],
  chronic_skip: ['habit_formation_and_cues', 'exercise_variation'],
  balance_imbalance: ['push_pull_balance'],
  long_gap: ['detraining_retraining'],
  habit_pattern: ['habit_formation_and_cues'],
  focus_behind: ['volume_dose_response'],
  low_sleep_readiness: ['sleep_and_performance'],
  low_readiness: ['subjective_readiness_monitoring'],
  record: ['one_rm_estimation'],
  first_sessions: ['beginner_progression'],
  note_flag: ['subjective_readiness_monitoring'],
};

/** Which research cards each proposal kind may cite. */
export const PRINCIPLES_BY_PROPOSAL: Record<ProposalKind, string[]> = {
  schedule: ['habit_formation_and_cues'],
  today_plan: ['recovery_time_course', 'frequency_secondary_to_volume', 'sleep_and_performance'],
  exercise_swap: ['exercise_variation'],
  add_exercise: ['volume_dose_response', 'push_pull_balance'],
  split_modify: ['volume_dose_response', 'exercise_variation', 'push_pull_balance'],
  split_new: ['volume_dose_response', 'frequency_secondary_to_volume'],
  load_next: ['progressive_overload', 'load_and_rep_range', 'beginner_progression', 'detraining_retraining'],
  rest_default: ['rest_intervals'],
  deload_week: ['deload_evidence', 'proximity_to_failure', 'load_monitoring_acwr'],
};

/** A stable key for "the same suggestion about the same thing". */
export function dismissKey(kind: ProposalKind, subject: Subject): string {
  const target = subject.exerciseId ?? subject.muscle ?? subject.muscleGroup ?? subject.splitId ?? '*';
  return `${kind}:${target}`;
}

export function emptyReport(today: string, now = new Date()): FindingsReport {
  return {
    version: CONTRACT_VERSION,
    generatedAt: now.toISOString(),
    today,
    dataQuality: { sessions: 0, weeksOfData: 0, effortCoverage: 0, insufficientData: true },
    findings: [],
    proposals: [],
  };
}

/** Every number that appears in a report, for the words layer's validator. */
export function reportNumbers(report: FindingsReport): Set<number> {
  const out = new Set<number>();
  const visit = (v: unknown): void => {
    if (typeof v === 'number' && Number.isFinite(v)) out.add(v);
    else if (Array.isArray(v)) v.forEach(visit);
    else if (v && typeof v === 'object') Object.values(v as Record<string, unknown>).forEach(visit);
  };
  for (const f of report.findings) { visit(f.metrics); visit(f.window); }
  for (const p of report.proposals) visit(p.apply);
  return out;
}
