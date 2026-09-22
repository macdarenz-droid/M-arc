import type { Exercise, Session } from '@/core/models';
import { findExercise } from '@/core/exercises';
import { addDays, daysBetween } from '@/core/dates';
import { exerciseHistory, modeOf } from './history';
import { loadStep } from './progression';
import { trend, type Confidence } from './trend';
import {
  TRAJECTORY_EXPIRY_DAYS,
  TRAJECTORY_MAX_HORIZON_DAYS,
  TRAJECTORY_MAX_LAST_GAP_DAYS,
  TRAJECTORY_MIN_POINTS,
  TRAJECTORY_MIN_SPAN_DAYS,
  TRAJECTORY_POINTS,
} from './coach/bands';

export interface LiftTrajectory {
  exerciseId: string;
  status: 'projected' | 'expired';
  points: number;
  from: string;
  lastDay: string;
  currentKg: number;
  stepKg: number;
  nextKg: number;
  kgPerWeek: number;
  projectedOn: string;
  expiresOn: string;
  confidence: Extract<Confidence, 'medium' | 'high'>;
}

const validDay = (day: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(day)
  && !Number.isNaN(Date.parse(`${day}T00:00:00Z`)) && new Date(`${day}T00:00:00Z`).toISOString().slice(0, 10) === day;
const round2 = (value: number): number => Math.round(value * 100) / 100;
const half = (value: number): number => Math.round(value * 2) / 2;

export function liftTrajectory(sessions: Session[], exerciseId: string, today: string, custom: Exercise[] = []): LiftTrajectory | null {
  if (!findExercise(exerciseId, custom) || modeOf(exerciseId, custom) !== 'weighted') return null;
  const eligible = sessions.filter(session => validDay(session.day) && session.day <= today);
  const byDay = new Map<string, { day: string; topKg: number }>();
  for (const row of exerciseHistory(eligible, exerciseId, custom)) {
    if (!Number.isFinite(row.topKg) || row.topKg <= 0) continue;
    const prior = byDay.get(row.day);
    if (!prior || row.topKg >= prior.topKg) byDay.set(row.day, { day: row.day, topKg: row.topKg });
  }
  const points = [...byDay.values()].sort((a, b) => a.day.localeCompare(b.day)).slice(-TRAJECTORY_POINTS);
  if (points.length < TRAJECTORY_MIN_POINTS) return null;
  const first = points[0]!;
  const last = points[points.length - 1]!;
  if (daysBetween(first.day, last.day) < TRAJECTORY_MIN_SPAN_DAYS) return null;

  const movement = trend(points.map(point => ({ day: point.day, value: point.topKg })));
  if (movement.direction !== 'up' || movement.confidence === 'low') return null;
  const weights = points.map((_, index) => 0.5 + index / Math.max(1, points.length - 1));
  const weightTotal = weights.reduce((total, value) => total + value, 0);
  const weightedMean = points.reduce((total, point, index) => total + point.topKg * weights[index]!, 0) / weightTotal;
  const rawKgPerWeek = movement.slopePerWeek * weightedMean;
  const kgPerWeek = round2(rawKgPerWeek);
  if (!Number.isFinite(rawKgPerWeek) || rawKgPerWeek <= 0 || kgPerWeek <= 0) return null;

  const currentKg = last.topKg;
  const stepKg = loadStep(currentKg);
  const nextKg = half(currentKg + stepKg);
  const horizonDays = Math.max(1, Math.ceil(((nextKg - currentKg) / rawKgPerWeek) * 7));
  if (!Number.isFinite(horizonDays) || horizonDays > TRAJECTORY_MAX_HORIZON_DAYS) return null;
  const projectedOn = addDays(last.day, horizonDays);
  const expiresOn = addDays(projectedOn, TRAJECTORY_EXPIRY_DAYS);
  return {
    exerciseId,
    status: today > expiresOn || daysBetween(last.day, today) > TRAJECTORY_MAX_LAST_GAP_DAYS ? 'expired' : 'projected',
    points: points.length,
    from: first.day,
    lastDay: last.day,
    currentKg,
    stepKg,
    nextKg,
    kgPerWeek,
    projectedOn,
    expiresOn,
    confidence: movement.confidence,
  };
}
