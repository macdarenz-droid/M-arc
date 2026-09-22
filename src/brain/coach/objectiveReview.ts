import type { BodyMeasurement, Exercise, ObjectiveEvidenceMeasure, PersonalObjective, Session } from '@/core/models';
import { findExercise } from '@/core/exercises';
import { dayKey, formatDay } from '@/core/dates';
import { exerciseHistory, modeOf } from '@/brain/history';
import { trainingDaysPerWeek } from '@/brain/weekly';
import { trend, type Confidence, type Direction } from '@/brain/trend';

export type ObjectiveReviewStatus = Direction;

export interface ObjectiveMeasureReview {
  key: string;
  kind: ObjectiveEvidenceMeasure['kind'];
  label: string;
  status: ObjectiveReviewStatus;
  confidence: Confidence;
  observations: number;
  baselineDay?: string;
  comparisonDay?: string;
  window: string;
  source: string;
  limitation: string;
  summary: string;
  available: boolean;
}

export interface ObjectiveReview {
  objectiveId: string;
  objectiveRevision: number;
  generatedForDay: string;
  due: boolean;
  evidenceKey: string;
  measures: ObjectiveMeasureReview[];
}

interface ObjectiveReviewInput {
  objective?: PersonalObjective;
  sessions: Session[];
  body: BodyMeasurement[];
  custom: Exercise[];
  today: string;
}

const objectiveDay = (objective: PersonalObjective): string => dayKey(objective.createdAt);
const round1 = (value: number): number => Math.round(value * 10) / 10;
const statusWord = (direction: Direction): string => direction === 'up' ? 'rising' : direction === 'down' ? 'falling' : direction === 'flat' ? 'steady' : 'not established';

function evidenceKey(parts: unknown[]): string {
  const input = JSON.stringify(parts);
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index++) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `objective:${(hash >>> 0).toString(36)}`;
}

function unknown(measure: ObjectiveEvidenceMeasure, label: string, source: string, limitation: string, observations: number, available = true, required = 2): ObjectiveMeasureReview {
  return {
    key: measure.kind === 'lift_trend' ? `lift_trend:${measure.exerciseId}` : measure.kind,
    kind: measure.kind,
    label,
    status: 'unknown',
    confidence: 'low',
    observations,
    window: observations ? `${observations} relevant observation${observations === 1 ? '' : 's'}` : 'No relevant observations',
    source,
    limitation,
    summary: `At least ${required === 2 ? 'two' : required} comparable dated observation${required === 1 ? '' : 's'} ${required === 1 ? 'is' : 'are'} needed.`,
    available,
  };
}

function consistencyReview(measure: ObjectiveEvidenceMeasure, objective: PersonalObjective, sessions: Session[], today: string): { review: ObjectiveMeasureReview; fingerprint: unknown } {
  const start = objectiveDay(objective);
  const weeks = trainingDaysPerWeek(sessions, today, 12).filter(week => week.from >= start);
  const points = weeks.map(week => ({ day: week.to, value: week.activeDayCount }));
  const fingerprint = weeks.map(week => [week.from, week.to, week.activeDayCount]);
  if (points.length < 4) return { review: unknown(measure, 'Training consistency', 'Completed sessions with at least one working set', 'Calendar attendance does not measure workout quality or effort.', points.length, true, points.length < 2 ? 2 : 4), fingerprint };
  const movement = trend(points.map(point => ({ ...point, value: point.value + 1 })));
  const first = points[0]!;
  const last = points[points.length - 1]!;
  return {
    review: {
      key: 'consistency', kind: 'consistency', label: 'Training consistency', status: movement.direction,
      confidence: movement.confidence, observations: points.length, baselineDay: first.day, comparisonDay: last.day,
      window: `${formatDay(first.day)} to ${formatDay(last.day)}`,
      source: 'Distinct calendar days with completed working sets, grouped into completed Monday–Sunday weeks',
      limitation: 'Calendar attendance does not measure workout quality or effort.',
      summary: `${statusWord(movement.direction)} across ${points.length} completed weeks; ${first.value} day${first.value === 1 ? '' : 's'} in the first and ${last.value} in the latest.`,
      available: true,
    },
    fingerprint,
  };
}

function liftReview(measure: Extract<ObjectiveEvidenceMeasure, { kind: 'lift_trend' }>, objective: PersonalObjective, sessions: Session[], custom: Exercise[], today: string): { review: ObjectiveMeasureReview; fingerprint: unknown } {
  const exercise = findExercise(measure.exerciseId, custom);
  const label = exercise?.name ?? `Unavailable lift (${measure.exerciseId})`;
  if (!exercise) return { review: unknown(measure, label, 'Saved exercise selection', 'The saved exercise is no longer available. Edit the direction to choose another.', 0, false), fingerprint: ['missing', measure.exerciseId] };
  const mode = modeOf(exercise.id, custom);
  const history = exerciseHistory(sessions.filter(session => session.day >= objectiveDay(objective) && session.day <= today), exercise.id, custom);
  const valueOf = (row: (typeof history)[number]): number => mode === 'weighted' ? row.topKg : mode === 'duration' ? row.bestDurationSec : mode === 'bodyweight' ? row.bestReps : 0;
  const byDay = new Map<string, { day: string; value: number; sessionIds: string[] }>();
  for (const row of history) {
    const value = valueOf(row);
    if (value <= 0) continue;
    const prior = byDay.get(row.day);
    if (!prior || value > prior.value) byDay.set(row.day, { day: row.day, value, sessionIds: [row.sessionId] });
    else prior.sessionIds.push(row.sessionId);
  }
  const points = [...byDay.values()].sort((a, b) => a.day.localeCompare(b.day));
  const unit = mode === 'weighted' ? 'kg top load' : mode === 'duration' ? 'seconds' : 'best reps';
  const limitation = mode === 'weighted'
    ? 'Top load does not account for every rep, set, technique change or effort rating.'
    : mode === 'duration' ? 'Longest logged duration does not capture technique or effort.'
      : mode === 'bodyweight' ? 'Best repetitions do not capture technique, tempo or effort.'
        : 'This exercise mode does not have a supported comparable lift measure.';
  const fingerprint = history.map(row => [row.sessionId, row.day, valueOf(row)]);
  if (mode === 'assisted' || mode === 'conditioning') return { review: unknown(measure, label, 'Completed working sets for the saved exercise', limitation, points.length, false), fingerprint };
  if (points.length < 4) return { review: unknown(measure, label, `Best ${unit} per training day`, limitation, points.length, true, points.length < 2 ? 2 : 4), fingerprint };
  const movement = trend(points);
  const first = points[0]!;
  const last = points[points.length - 1]!;
  return {
    review: {
      key: `lift_trend:${measure.exerciseId}`, kind: 'lift_trend', label, status: movement.direction,
      confidence: movement.confidence, observations: points.length, baselineDay: first.day, comparisonDay: last.day,
      window: `${formatDay(first.day)} to ${formatDay(last.day)}`,
      source: `Best ${unit} from completed working sets for ${label}`,
      limitation,
      summary: `${statusWord(movement.direction)} across ${points.length} training days; ${round1(first.value)} to ${round1(last.value)} ${unit.replace(' top load', '')}.`,
      available: true,
    },
    fingerprint,
  };
}

function bodyReview(measure: ObjectiveEvidenceMeasure, objective: PersonalObjective, body: BodyMeasurement[], today: string): { review: ObjectiveMeasureReview; fingerprint: unknown } {
  const byDay = new Map<string, BodyMeasurement>();
  for (const reading of body) if (reading.day >= objectiveDay(objective) && reading.day <= today && Number.isFinite(reading.bodyFatPct)) byDay.set(reading.day, reading);
  const points = [...byDay.values()].sort((a, b) => a.day.localeCompare(b.day)).map(reading => ({ day: reading.day, value: reading.bodyFatPct }));
  const limitation = 'US Navy tape-method estimates are not direct body-fat measurements and can vary with measurement technique.';
  const fingerprint = points.map(point => [point.day, point.value]);
  if (points.length < 4) return { review: unknown(measure, 'Recorded body trend', 'Locally saved US Navy tape-method estimates', limitation, points.length, true, points.length < 2 ? 2 : 4), fingerprint };
  const movement = trend(points);
  const first = points[0]!;
  const last = points[points.length - 1]!;
  return {
    review: {
      key: 'body_trend', kind: 'body_trend', label: 'Recorded body trend', status: movement.direction,
      confidence: movement.confidence, observations: points.length, baselineDay: first.day, comparisonDay: last.day,
      window: `${formatDay(first.day)} to ${formatDay(last.day)}`,
      source: 'Locally saved US Navy tape-method estimates', limitation,
      summary: `${statusWord(movement.direction)} across ${points.length} readings; ${round1(first.value)}% to ${round1(last.value)}% recorded estimate.`,
      available: true,
    },
    fingerprint,
  };
}

export function projectObjectiveReview(input: ObjectiveReviewInput): ObjectiveReview | null {
  const objective = input.objective;
  if (!objective) return null;
  const projected = objective.measures.map(measure => measure.kind === 'consistency'
    ? consistencyReview(measure, objective, input.sessions, input.today)
    : measure.kind === 'lift_trend'
      ? liftReview(measure, objective, input.sessions, input.custom, input.today)
      : bodyReview(measure, objective, input.body, input.today));
  return {
    objectiveId: objective.id,
    objectiveRevision: objective.revision,
    generatedForDay: input.today,
    due: !!objective.reviewDay && objective.reviewDay <= input.today,
    evidenceKey: evidenceKey([objective.id, objective.revision, input.today, projected.map(item => item.fingerprint)]),
    measures: projected.map(item => item.review),
  };
}
